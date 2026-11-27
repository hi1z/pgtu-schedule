'use strict';

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const vm = require('vm');

// ── Загрузка .env (без сторонних пакетов) ─────────────────────────
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
}
loadEnv();

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const BOT_USERNAME = (process.env.BOT_USERNAME || '').replace(/^@/, '');
const PORT = Number(process.env.PORT || 3000);
const DB_PATH = path.join(__dirname, 'db.json');

// ── Загрузка базы расписания из ../js/data.js ─────────────────────
function loadScheduleData() {
  const dataPath = path.join(__dirname, '..', 'js', 'data.js');
  const code = fs.readFileSync(dataPath, 'utf8');
  const sandbox = { window: {} };
  vm.runInNewContext(code, sandbox);
  return sandbox.window.SCHEDULE_DATA;
}

const DATA = loadScheduleData();

const REMINDER_PHRASES = [
  'У тебя пара, ебень!',
  'Пора бежать!',
  'Запихуй бутик и на пару!',
  'Хватит втыкать, пара через 5 минут!',
  'Ноги в руки и в универ!',
  'Препод уже на подходе, шевели булками!',
  'Доедай шавуху и лети в аудиторию!',
  'Пять минут до звонка, пора двигать!',
  'Включай форсаж, пара сама себя не отсидит!',
  'Оставь рилсы, звонок уже близко!',
  'Шевелись, а то займут козырные места на задней парте!',
  'Хватай рюкзак и стартуй, опоздаешь ведь!'
];

// ── Простое JSON-хранилище ────────────────────────────────────────
function loadDb() {
  try {
    if (fs.existsSync(DB_PATH)) {
      return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    }
  } catch (e) {}
  return { users: {}, pendingAuth: {} };
}

const db = loadDb();
const awaitingNoteSubject = {}; // { [telegramId]: subjectName }
const lastNotified = {};        // { [telegramId]: 'mon-2-even' }

function saveDb() {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
  } catch (e) {
    console.error('DB save error:', e.message);
  }
}

function getOrCreateUser(from) {
  const id = String(from.id);
  if (!db.users[id]) {
    db.users[id] = {
      telegramId: id,
      username: from.username || '',
      firstName: from.first_name || 'Студент',
      group: 'ii-26',
      reminders: true,
      notes: {},
      token: crypto.randomBytes(24).toString('hex'),
    };
    saveDb();
  } else {
    db.users[id].username = from.username || db.users[id].username;
    db.users[id].firstName = from.first_name || db.users[id].firstName;
  }
  return db.users[id];
}

function findUserByToken(token) {
  if (!token) return null;
  for (const id of Object.keys(db.users)) {
    if (db.users[id].token === token) return db.users[id];
  }
  return null;
}

// ── Утилиты расписания (GMT+3) ────────────────────────────────────
function getGmt3Now(offsetDays = 0) {
  const ms = Date.now() + 3 * 3600000 + offsetDays * 86400000;
  return new Date(ms);
}

function dayIdFromDate(d) {
  const map = { 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri' };
  return map[d.getUTCDay()] || null;
}

function weekParityForDate(d) {
  const rule = DATA.meta && DATA.meta.weekRule;
  if (!rule || !rule.anchorMonday) return 'even';
  const [y, m, day] = rule.anchorMonday.split('-').map(Number);
  const anchor = Date.UTC(y, m - 1, day);
  const targetDay = d.getUTCDay();
  const mondayShift = targetDay === 0 ? -6 : 1 - targetDay;
  const targetMonday = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + mondayShift);
  const weeks = Math.round((targetMonday - anchor) / 604800000);
  const base = rule.anchorWeek === 'odd' ? 1 : 0;
  return (((base + weeks) % 2) + 2) % 2 === 0 ? 'even' : 'odd';
}

function getBellForPair(pairNum) {
  return DATA.bells.find((b) => b.pair === pairNum) || null;
}

function parseMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function getSubjectsForGroup(groupId) {
  const set = new Set();
  for (const l of DATA.lessons) {
    if (l.groups.includes(groupId)) set.add(l.subject);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'ru'));
}

function formatDaySchedule(groupId, offsetDays = 0) {
  const d = getGmt3Now(offsetDays);
  const dayId = dayIdFromDate(d);
  const groupObj = DATA.groups.find((g) => g.id === groupId);
  const groupName = groupObj ? groupObj.name : groupId;
  const label = offsetDays === 0 ? 'Сегодня' : offsetDays === 1 ? 'Завтра' : 'День';

  if (!dayId) {
    return `📅 <b>${label}</b> (${groupName})\n\nВыходной! Пар нет, отдыхай ☕`;
  }

  const dayObj = DATA.days.find((x) => x.id === dayId);
  const week = weekParityForDate(d);
  const weekLabel = week === 'even' ? 'чётная' : 'нечётная';

  const lines = [`📅 <b>${label} — ${dayObj.name}</b> (${groupName}, ${weekLabel} неделя)\n`];
  let count = 0;

  for (const pair of DATA.pairs) {
    const lessons = DATA.lessons.filter(
      (l) => l.day === dayId && l.pair === pair.number && (l.week === week || l.week === 'both') && l.groups.includes(groupId)
    );
    if (!lessons.length) continue;
    const bell = getBellForPair(pair.number);
    const time = bell ? `${bell.start}–${bell.end}` : '';
    for (const l of lessons) {
      count++;
      const room = l.room ? ` · ауд. <code>${l.room}</code>` : '';
      const teacher = l.teacher ? `\n   👤 ${l.teacher}` : '';
      lines.push(`<b>${pair.label} пара</b> (${time})\n   [${l.typeLabel || 'Пара'}] <b>${l.subject}</b>${room}${teacher}\n`);
    }
  }

  if (count === 0) {
    lines.push('Занятий нет 🎉');
  }
  return lines.join('\n');
}

// ── Telegram Bot API клиент ───────────────────────────────────────
function tgCall(method, payload) {
  if (!BOT_TOKEN) return Promise.resolve(null);
  return new Promise((resolve) => {
    const body = JSON.stringify(payload || {});
    const req = https.request(
      {
        hostname: 'api.telegram.org',
        path: `/bot${BOT_TOKEN}/${method}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(raw));
          } catch (e) {
            resolve(null);
          }
        });
      }
    );
    req.on('error', () => resolve(null));
    req.write(body);
    req.end();
  });
}

function mainKeyboard() {
  return {
    keyboard: [
      [{ text: '📅 Сегодня' }, { text: '📆 Завтра' }],
      [{ text: '📝 Домашка' }, { text: '➕ Заметка' }],
      [{ text: '🔔 Напоминания' }, { text: '👥 Сменить группу' }],
    ],
    resize_keyboard: true,
  };
}

function sendHomeworkOverview(chatId, user) {
  const subjects = getSubjectsForGroup(user.group);
  const lines = ['📝 <b>Домашние задания и заметки</b>\n'];
  let hasAny = false;

  for (const subj of subjects) {
    const notes = (user.notes[subj] || []).filter((n) => !n.done);
    if (!notes.length) continue;
    hasAny = true;
    lines.push(`<b>• ${subj}</b>`);
    for (const n of notes) {
      lines.push(`  ▫️ ${n.text}`);
    }
    lines.push('');
  }

  if (!hasAny) {
    lines.push('Активных заметок пока нет! Нажми «➕ Заметка», чтобы добавить задание по любому предмету.');
  }

  return tgCall('sendMessage', {
    chat_id: chatId,
    text: lines.join('\n'),
    parse_mode: 'HTML',
    reply_markup: mainKeyboard(),
  });
}

function sendSubjectPicker(chatId, user, mode) {
  const subjects = getSubjectsForGroup(user.group);
  const buttons = subjects.map((subj, idx) => [
    { text: subj, callback_data: `${mode}:${idx}` },
  ]);
  return tgCall('sendMessage', {
    chat_id: chatId,
    text: mode === 'add' ? 'Выбери предмет, по которому добавить заметку:' : 'Выбери предмет, чтобы посмотреть или отметить заметки:',
    reply_markup: { inline_keyboard: buttons },
  });
}

async function handleMessage(msg) {
  if (!msg || !msg.from || !msg.text) return;
  const chatId = msg.chat.id;
  const text = msg.text.trim();
  const user = getOrCreateUser(msg.from);

  // Ожидание текста заметки после выбора предмета
  if (awaitingNoteSubject[user.telegramId] && !text.startsWith('/') && !['📅 Сегодня', '📆 Завтра', '📝 Домашка', '➕ Заметка', '🔔 Напоминания', '👥 Сменить группу'].includes(text)) {
    const subj = awaitingNoteSubject[user.telegramId];
    delete awaitingNoteSubject[user.telegramId];
    if (!Array.isArray(user.notes[subj])) user.notes[subj] = [];
    user.notes[subj].unshift({
      id: String(Date.now()) + '-' + Math.random().toString(36).slice(2, 6),
      text,
      done: false,
      createdAt: Date.now(),
    });
    saveDb();
    await tgCall('sendMessage', {
      chat_id: chatId,
      text: `✅ Заметка добавлена в <b>${subj}</b>:\n«${text}»\n\nОна также появится на сайте.`,
      parse_mode: 'HTML',
      reply_markup: mainKeyboard(),
    });
    return;
  }

  // /start или /start login_<code>
  if (text.startsWith('/start')) {
    const arg = text.split(/\s+/)[1] || '';
    if (arg.startsWith('login_')) {
      const code = arg.slice(6);
      const pending = db.pendingAuth[code];
      if (pending) {
        if (pending.group) user.group = pending.group;
        if (pending.notes && typeof pending.notes === 'object') {
          for (const subj of Object.keys(pending.notes)) {
            const existing = user.notes[subj] || [];
            const incoming = pending.notes[subj] || [];
            const seen = new Set(existing.map((n) => n.id));
            for (const item of incoming) {
              if (!seen.has(item.id)) existing.push(item);
            }
            user.notes[subj] = existing;
          }
        }
        pending.authenticated = true;
        pending.telegramId = user.telegramId;
        saveDb();

        await tgCall('sendMessage', {
          chat_id: chatId,
          text: `✅ <b>Аккаунт успешно привязан к сайту!</b>\nТеперь заметки и расписание синхронизированы, а за 5 минут до пары я буду присылать напоминание сюда.`,
          parse_mode: 'HTML',
          reply_markup: mainKeyboard(),
        });
        return;
      }
    }

    const groupObj = DATA.groups.find((g) => g.id === user.group);
    await tgCall('sendMessage', {
      chat_id: chatId,
      text: `Привет, ${user.firstName}! 👋\nТвоя группа: <b>${groupObj ? groupObj.name : user.group}</b>.\n\nЯ подскажу расписание, сохраню домашку и пну за 5 минут до начала пары.`,
      parse_mode: 'HTML',
      reply_markup: mainKeyboard(),
    });
    return;
  }

  if (text === '📅 Сегодня' || text === '/today' || text === '/schedule') {
    await tgCall('sendMessage', {
      chat_id: chatId,
      text: formatDaySchedule(user.group, 0),
      parse_mode: 'HTML',
      reply_markup: mainKeyboard(),
    });
    return;
  }

  if (text === '📆 Завтра' || text === '/tomorrow') {
    await tgCall('sendMessage', {
      chat_id: chatId,
      text: formatDaySchedule(user.group, 1),
      parse_mode: 'HTML',
      reply_markup: mainKeyboard(),
    });
    return;
  }

  if (text === '📝 Домашка' || text === '/hw') {
    await sendHomeworkOverview(chatId, user);
    return;
  }

  if (text === '➕ Заметка' || text === '/add') {
    await sendSubjectPicker(chatId, user, 'add');
    return;
  }

  if (text === '🔔 Напоминания') {
    user.reminders = !user.reminders;
    saveDb();
    await tgCall('sendMessage', {
      chat_id: chatId,
      text: user.reminders
        ? '🔔 Напоминания за 5 минут до пары <b>включены</b>!'
        : '🔕 Напоминания <b>выключены</b>.',
      parse_mode: 'HTML',
      reply_markup: mainKeyboard(),
    });
    return;
  }

  if (text === '👥 Сменить группу' || text === '/group') {
    const rows = [];
    for (let i = 0; i < DATA.groups.length; i += 3) {
      rows.push(
        DATA.groups.slice(i, i + 3).map((g) => ({
          text: g.name,
          callback_data: `grp:${g.id}`,
        }))
      );
    }
    await tgCall('sendMessage', {
      chat_id: chatId,
      text: 'Выбери свою группу:',
      reply_markup: { inline_keyboard: rows },
    });
  }
}

async function handleCallback(cb) {
  if (!cb || !cb.from || !cb.data) return;
  const user = getOrCreateUser(cb.from);
  const chatId = cb.message.chat.id;
  const [action, val] = cb.data.split(':');

  if (action === 'grp') {
    const grp = DATA.groups.find((g) => g.id === val);
    if (grp) {
      user.group = grp.id;
      saveDb();
      await tgCall('answerCallbackQuery', { callback_query_id: cb.id, text: `Группа: ${grp.name}` });
      await tgCall('sendMessage', {
        chat_id: chatId,
        text: `✅ Выбрана группа: <b>${grp.name}</b>`,
        parse_mode: 'HTML',
        reply_markup: mainKeyboard(),
      });
    }
    return;
  }

  if (action === 'add') {
    const subjects = getSubjectsForGroup(user.group);
    const subj = subjects[Number(val)];
    if (subj) {
      awaitingNoteSubject[user.telegramId] = subj;
      await tgCall('answerCallbackQuery', { callback_query_id: cb.id });
      await tgCall('sendMessage', {
        chat_id: chatId,
        text: `✍️ Напиши текст заметки для предмета <b>${subj}</b>:`,
        parse_mode: 'HTML',
      });
    }
  }
}

// ── Long Polling Telegram ─────────────────────────────────────────
let updateOffset = 0;
async function pollTelegram() {
  if (!BOT_TOKEN) return;
  while (true) {
    const res = await tgCall('getUpdates', { offset: updateOffset, timeout: 25 });
    if (res && res.ok && Array.isArray(res.result)) {
      for (const upd of res.result) {
        updateOffset = upd.update_id + 1;
        if (upd.message) await handleMessage(upd.message);
        if (upd.callback_query) await handleCallback(upd.callback_query);
      }
    } else {
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

// ── Фоновый планировщик напоминаний за 5 минут ────────────────────
function checkAndSendReminders() {
  if (!BOT_TOKEN) return;
  const now = getGmt3Now(0);
  const dayId = dayIdFromDate(now);
  if (!dayId) return;

  const week = weekParityForDate(now);
  const curMins = now.getUTCHours() * 60 + now.getUTCMinutes();

  for (const userId of Object.keys(db.users)) {
    const user = db.users[userId];
    if (!user.reminders || !user.group) continue;

    for (const pair of DATA.pairs) {
      const bell = getBellForPair(pair.number);
      if (!bell) continue;
      const diff = parseMinutes(bell.start) - curMins;
      if (diff <= 0 || diff > 5) continue;

      const lessons = DATA.lessons.filter(
        (l) => l.day === dayId && l.pair === pair.number && (l.week === week || l.week === 'both') && l.groups.includes(user.group)
      );
      if (!lessons.length) continue;

      const key = `${now.toISOString().slice(0, 10)}-${pair.number}`;
      if (lastNotified[userId] === key) continue;
      lastNotified[userId] = key;

      const phrase = REMINDER_PHRASES[Math.floor(Math.random() * REMINDER_PHRASES.length)];
      const lesson = lessons[0];
      const room = lesson.room ? ` · ауд. <code>${lesson.room}</code>` : '';
      const teacher = lesson.teacher ? `\n👤 ${lesson.teacher}` : '';

      tgCall('sendMessage', {
        chat_id: user.telegramId,
        text: `🚨 <b>${phrase}</b>\n\nЧерез <b>${diff} мин</b> (${bell.start}):\n<b>${lesson.subject}</b> [${lesson.typeLabel || 'Пара'}]${room}${teacher}`,
        parse_mode: 'HTML',
      });
    }
  }
}

// ── HTTP API сервер синхронизации ─────────────────────────────────
function readJsonBody(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (chunk) => (raw += chunk));
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

function sendJson(res, status, obj) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(obj));
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    return sendJson(res, 204, {});
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (req.method === 'GET' && url.pathname === '/health') {
    return sendJson(res, 200, { ok: true, botConfigured: Boolean(BOT_TOKEN && BOT_USERNAME) });
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/init') {
    const body = await readJsonBody(req);
    const code = crypto.randomBytes(6).toString('hex');
    db.pendingAuth[code] = {
      createdAt: Date.now(),
      group: body.group || null,
      notes: body.notes || {},
      authenticated: false,
      telegramId: null,
    };
    saveDb();
    return sendJson(res, 200, {
      code,
      botUrl: `https://t.me/${BOT_USERNAME}?start=login_${code}`,
    });
  }

  if (req.method === 'GET' && url.pathname === '/api/auth/status') {
    const code = url.searchParams.get('code') || '';
    const pending = db.pendingAuth[code];
    if (!pending || !pending.authenticated) {
      return sendJson(res, 200, { authenticated: false });
    }
    const user = db.users[pending.telegramId];
    if (!user) return sendJson(res, 200, { authenticated: false });
    return sendJson(res, 200, {
      authenticated: true,
      session: {
        token: user.token,
        telegramId: user.telegramId,
        username: user.username,
        firstName: user.firstName,
      },
      group: user.group,
      notes: user.notes,
    });
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  const user = findUserByToken(token);

  if (url.pathname === '/api/notes') {
    if (!user) return sendJson(res, 401, { error: 'Unauthorized' });

    if (req.method === 'GET') {
      return sendJson(res, 200, { group: user.group, notes: user.notes });
    }

    if (req.method === 'PUT') {
      const body = await readJsonBody(req);
      if (body.group) user.group = body.group;
      if (body.notes && typeof body.notes === 'object') user.notes = body.notes;
      saveDb();
      return sendJson(res, 200, { ok: true, group: user.group, notes: user.notes });
    }
  }

  sendJson(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => {
  console.log(`HTTP sync server listening on port ${PORT}`);
  if (BOT_TOKEN) {
    console.log('Starting Telegram bot polling...');
    pollTelegram();
    setInterval(checkAndSendReminders, 20000);
  } else {
    console.warn('BOT_TOKEN is not set. Set BOT_TOKEN and BOT_USERNAME in bot/.env to enable Telegram bot.');
  }
});
