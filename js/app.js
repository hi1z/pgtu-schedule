/* 
 * Расписание занятий — ПГТУ УНИИТ
 * Модернизированный монохромный интерфейс
 */
(function () {
  'use strict';

  var DATA = window.SCHEDULE_DATA;

  var state = {
    faculty: null,
    course: null,
    group: null,
    week: 'even',
    weekAuto: true,
    view: 'schedule',
    mobileDay: 'all', // 'all', 'mon', 'tue', 'wed', 'thu', 'fri'
  };

  var STORAGE_KEY = 'pgtu.schedule.selection';

  var els = {
    org: document.getElementById('org'),
    title: document.getElementById('title'),
    period: document.getElementById('period'),
    headerMiniClock: document.getElementById('header-mini-clock'),
    groupChip: document.getElementById('group-chip'),
    changeGroup: document.getElementById('change-group'),
    scheduleControls: document.getElementById('schedule-controls'),
    scheduleWrap: document.getElementById('schedule-wrap'),
    mobileDayFilter: document.getElementById('mobile-day-filter'),
    mobileDayStack: document.getElementById('mobile-day-stack'),
    emptyState: document.getElementById('schedule-empty'),
    emptyChoose: document.getElementById('empty-choose'),
    setupModal: document.getElementById('setup-modal'),
    setupFaculties: document.getElementById('setup-faculties'),
    setupCourses: document.getElementById('setup-courses'),
    setupGroups: document.getElementById('setup-groups'),
    setupApply: document.getElementById('setup-apply'),
    weekSwitch: document.getElementById('week-switch'),
    autoWeek: document.getElementById('auto-week'),
    tabs: Array.prototype.slice.call(document.querySelectorAll('.tab')),
    views: Array.prototype.slice.call(document.querySelectorAll('.view')),
    scheduleTable: document.getElementById('schedule-table'),
    bellsTable: document.getElementById('bells-table'),
    clockTime: document.getElementById('clock-time'),
    clockHour: document.getElementById('clock-hour'),
    clockMinute: document.getElementById('clock-minute'),
    clockSecond: document.getElementById('clock-second'),
    clockTicks: document.getElementById('clock-ticks'),
    wheelSegments: document.getElementById('wheel-segments'),
    wheelNeedle: document.getElementById('wheel-needle'),
    wheelResult: document.getElementById('wheel-result'),
    spinWheel: document.getElementById('spin-wheel'),
    installBtn: document.getElementById('install-btn'),
    installModal: document.getElementById('install-modal'),
    installSteps: document.getElementById('install-steps'),
    installNative: document.getElementById('install-native'),
    reminderBar: document.getElementById('reminder-bar'),
    reminderToggleBtn: document.getElementById('reminder-toggle-btn'),
    reminderBtnText: document.getElementById('reminder-btn-text'),
    reminderTestBtn: document.getElementById('reminder-test-btn'),
    reminderModal: document.getElementById('reminder-modal'),
    reminderPhrase: document.getElementById('reminder-phrase'),
    reminderLessonDetails: document.getElementById('reminder-lesson-details'),
    reminderSnooze: document.getElementById('reminder-snooze'),
  };

  // ── Утилиты ──────────────────────────────────────────────────────

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function groupById(id) {
    if (!DATA || !DATA.groups) return null;
    return DATA.groups.filter(function (g) { return g.id === id; })[0] || null;
  }

  function facultyById(id) {
    if (!DATA || !DATA.faculties) return null;
    return DATA.faculties.filter(function (f) { return f.id === id; })[0] || null;
  }

  function courseByNumber(faculty, number) {
    if (!faculty || !faculty.courses) return null;
    return faculty.courses.filter(function (c) { return c.number === number; })[0] || null;
  }

  function locateGroup(groupId) {
    if (!DATA || !DATA.faculties) return null;
    for (var i = 0; i < DATA.faculties.length; i++) {
      var faculty = DATA.faculties[i];
      for (var j = 0; j < faculty.courses.length; j++) {
        if (faculty.courses[j].groups.indexOf(groupId) !== -1) {
          return { faculty: faculty, course: faculty.courses[j] };
        }
      }
    }
    return null;
  }

  function applyGroup(groupId) {
    var found = locateGroup(groupId);
    if (!found) return false;
    state.faculty = found.faculty.id;
    state.course = found.course.number;
    state.group = groupId;
    return true;
  }

  function todayId() {
    var map = { 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri' };
    return map[new Date().getDay()] || null;
  }

  function parseLocalDate(value) {
    var parts = String(value).split('-');
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  }

  function startOfWeek(date) {
    var d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    var day = d.getDay();
    d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
    return d;
  }

  function currentWeek() {
    var rule = DATA.meta && DATA.meta.weekRule;
    if (!rule || !rule.anchorMonday) return 'even';

    var anchor = startOfWeek(parseLocalDate(rule.anchorMonday));
    var today = startOfWeek(new Date());
    var weeks = Math.round((today - anchor) / 604800000);
    var base = rule.anchorWeek === 'odd' ? 1 : 0;
    var parity = ((base + weeks) % 2 + 2) % 2;

    return parity === 0 ? 'even' : 'odd';
  }

  function effectiveWeek() {
    return state.weekAuto ? currentWeek() : state.week;
  }

  function getBellForPair(pairNum) {
    if (!DATA.bells) return null;
    for (var i = 0; i < DATA.bells.length; i++) {
      if (DATA.bells[i].pair === pairNum) return DATA.bells[i];
    }
    return null;
  }

  function getCurrentGmt3Minutes() {
    var now = new Date(Date.now() + 3 * 3600000);
    return now.getUTCHours() * 60 + now.getUTCMinutes();
  }

  function parseTimeToMinutes(timeStr) {
    var parts = timeStr.split(':');
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  }

  function getCurrentBellStatus() {
    var curMins = getCurrentGmt3Minutes();
    var currentDay = todayId();
    if (!currentDay) return null; // выходные

    for (var i = 0; i < DATA.bells.length; i++) {
      var b = DATA.bells[i];
      var startM = parseTimeToMinutes(b.start);
      var endM = parseTimeToMinutes(b.end);
      if (curMins >= startM && curMins <= endM) {
        return {
          isBreak: !!b.break,
          pair: b.pair || null,
          start: b.start,
          end: b.end,
        };
      }
    }
    return null;
  }

  // ── Hash & Хранилище ─────────────────────────────────────────────

  function readHash() {
    var hash = window.location.hash.replace(/^#/, '');
    if (!hash) return;
    var params = new URLSearchParams(hash);
    var group = params.get('group');
    var week = params.get('week');
    var view = params.get('view');
    var day = params.get('day');

    if (group) applyGroup(group);

    if (week === 'auto') {
      state.weekAuto = true;
    } else if (week === 'even' || week === 'odd') {
      state.week = week;
      state.weekAuto = false;
    }

    if (view === 'schedule' || view === 'bells' || view === 'roulette') {
      state.view = view;
    }

    if (day && ['all', 'mon', 'tue', 'wed', 'thu', 'fri'].indexOf(day) !== -1) {
      state.mobileDay = day;
    }
  }

  function writeHash() {
    var params = new URLSearchParams();
    if (state.group) {
      params.set('faculty', state.faculty);
      params.set('course', String(state.course));
      params.set('group', state.group);
    }
    params.set('week', state.weekAuto ? 'auto' : state.week);
    params.set('view', state.view);
    if (state.mobileDay && state.mobileDay !== 'all') {
      params.set('day', state.mobileDay);
    }
    history.replaceState(null, '', '#' + params.toString());
  }

  function readStored() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      var saved = JSON.parse(raw);
      return saved && saved.group ? applyGroup(saved.group) : false;
    } catch (e) {
      return false;
    }
  }

  function saveSelection() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        faculty: state.faculty,
        course: state.course,
        group: state.group,
      }));
    } catch (e) {}
  }

  // ── Отрисовка расписания ─────────────────────────────────────────

  function renderHeader() {
    if (DATA.meta) {
      if (els.org) els.org.textContent = DATA.meta.org || 'ПГТУ';
      if (els.title) els.title.textContent = DATA.meta.title || 'Расписание';
      if (els.period) els.period.textContent = DATA.meta.period || '';
      document.title = (DATA.meta.title || 'Расписание') + ' — ' + (DATA.meta.org || 'ПГТУ');
    }
  }

  function syncControls() {
    var hasGroup = !!state.group;

    if (els.scheduleControls) els.scheduleControls.hidden = !hasGroup;
    if (els.scheduleWrap) els.scheduleWrap.hidden = !hasGroup;
    if (els.emptyState) els.emptyState.hidden = hasGroup;
    if (els.mobileDayFilter) els.mobileDayFilter.hidden = !hasGroup;

    if (hasGroup) {
      var faculty = facultyById(state.faculty);
      var group = groupById(state.group);
      els.groupChip.innerHTML =
        '<span class="group-chip__name">' + escapeHtml(group ? group.name : state.group) + '</span>' +
        '<span class="group-chip__meta">' + escapeHtml(faculty ? faculty.name : '') +
        ' · ' + escapeHtml(state.course) + ' курс</span>';
    }

    var week = effectiveWeek();
    Array.prototype.forEach.call(els.weekSwitch.querySelectorAll('[data-week]'), function (btn) {
      var active = btn.dataset.week === week;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    els.autoWeek.classList.toggle('is-active', state.weekAuto);
    els.autoWeek.setAttribute('aria-pressed', String(state.weekAuto));

    els.tabs.forEach(function (tab) {
      var active = tab.dataset.view === state.view;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-current', active ? 'page' : 'false');
    });

    els.views.forEach(function (view) {
      var active = view.id === 'view-' + state.view;
      view.classList.toggle('is-active', active);
      view.hidden = !active;
    });

    // Mobile day filter active state
    if (els.mobileDayFilter) {
      Array.prototype.forEach.call(els.mobileDayFilter.querySelectorAll('[data-day]'), function (btn) {
        var active = btn.dataset.day === state.mobileDay;
        btn.classList.toggle('is-active', active);
      });
    }
  }

  function lessonsFor(dayId, pairNumber) {
    if (!DATA.lessons || !state.group) return [];
    return DATA.lessons.filter(function (lesson) {
      return lesson.day === dayId &&
        lesson.pair === pairNumber &&
        (lesson.week === effectiveWeek() || lesson.week === 'both') &&
        lesson.groups.indexOf(state.group) !== -1;
    });
  }

  function renderLesson(lesson) {
    var typeLabel = lesson.typeLabel || (
      lesson.type === 'lecture' ? 'Лекция' :
      lesson.type === 'practice' ? 'Практика' :
      lesson.type === 'lab' ? 'Лаб. работа' :
      lesson.type === 'coursework' ? 'Курсовая' :
      lesson.type === 'pe' ? 'Физкультура' : 'Занятие'
    );

    var typeBadge = '<span class="lesson-tag lesson-tag--' + escapeHtml(lesson.type) + '">' +
      escapeHtml(typeLabel) + '</span>';

    var roomBadge = lesson.room
      ? '<span class="lesson-room" title="Аудитория ' + escapeHtml(lesson.room) + '">' +
        escapeHtml(lesson.room) + '</span>'
      : '';

    var teacherHtml = lesson.teacher
      ? '<div class="lesson-teacher">' +
        '<svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' +
        '<span>' + escapeHtml(lesson.teacher) + '</span></div>'
      : '';

    return '<article class="lesson lesson--' + escapeHtml(lesson.type) + '">' +
      '<div class="lesson__header">' +
        typeBadge +
        roomBadge +
      '</div>' +
      '<div class="lesson__subject">' + escapeHtml(lesson.subject) + '</div>' +
      (teacherHtml ? '<div class="lesson__footer">' + teacherHtml + '</div>' : '') +
      '</article>';
  }

  function renderScheduleTable() {
    if (!state.group) {
      els.scheduleTable.innerHTML = '';
      return;
    }

    var today = todayId();
    var currentBell = getCurrentBellStatus();

    var head = '<thead><tr>' +
      '<th class="schedule__pair-col" scope="col"><span class="pair-col-title">Время</span></th>' +
      DATA.days.map(function (day) {
        var isToday = day.id === today;
        return '<th scope="col" class="' + (isToday ? 'is-today' : '') + '">' +
          '<div class="day-head-inner">' +
            '<span class="schedule__day">' + escapeHtml(day.name) + '</span>' +
            '<span class="schedule__day-short">' + escapeHtml(day.short) + '</span>' +
            (isToday ? '<span class="today-badge">СЕГОДНЯ</span>' : '') +
          '</div>' +
          '</th>';
      }).join('') +
      '</tr></thead>';

    var body = '<tbody>' + DATA.pairs.map(function (pair) {
      var bell = getBellForPair(pair.number);
      var timeRange = bell ? (bell.start + ' — ' + bell.end) : '';
      var isCurrentPair = (currentBell && !currentBell.isBreak && currentBell.pair === pair.number);

      var cells = DATA.days.map(function (day) {
        var lessons = lessonsFor(day.id, pair.number);
        var isToday = day.id === today;
        var cellIsNow = (isToday && isCurrentPair);

        if (!lessons.length) {
          return '<td class="schedule__cell is-empty' + (isToday ? ' is-today' : '') + (cellIsNow ? ' is-now' : '') + '">' +
            '<span class="empty-mark" aria-hidden="true">—</span>' +
            '</td>';
        }

        return '<td class="schedule__cell' + (isToday ? ' is-today' : '') + (cellIsNow ? ' is-now' : '') + '">' +
          (cellIsNow ? '<div class="now-pulse-tag"><span class="pulse-dot"></span> ИДЁТ СЕЙЧАС</div>' : '') +
          lessons.map(renderLesson).join('') +
          '</td>';
      }).join('');

      return '<tr class="' + (isCurrentPair ? 'row-is-now' : '') + '">' +
        '<th class="schedule__pair-col' + (isCurrentPair ? ' is-now' : '') + '" scope="row">' +
        '<div class="pair-info">' +
          '<span class="pair-num">' + escapeHtml(pair.label) + '</span>' +
          (timeRange ? '<span class="pair-clock">' + escapeHtml(timeRange) + '</span>' : '') +
        '</div>' +
        '</th>' + cells +
        '</tr>';
    }).join('') + '</tbody>';

    els.scheduleTable.innerHTML = head + body;
  }

  function renderMobileDayStack() {
    if (!els.mobileDayStack) return;

    if (!state.group || state.mobileDay === 'all') {
      els.mobileDayStack.hidden = true;
      els.scheduleWrap.hidden = !state.group;
      return;
    }

    var selectedDay = DATA.days.filter(function (d) { return d.id === state.mobileDay; })[0];
    if (!selectedDay) {
      els.mobileDayStack.hidden = true;
      els.scheduleWrap.hidden = false;
      return;
    }

    els.scheduleWrap.hidden = true;
    els.mobileDayStack.hidden = false;

    var today = todayId();
    var isToday = selectedDay.id === today;
    var currentBell = getCurrentBellStatus();

    var markup = '<div class="day-card">' +
      '<div class="day-card__header">' +
        '<div class="day-card__title-row">' +
          '<h3 class="day-card__title">' + escapeHtml(selectedDay.name) + '</h3>' +
          (isToday ? '<span class="today-badge">СЕГОДНЯ</span>' : '') +
        '</div>' +
        '<span class="day-card__week-note">Неделя: ' + (effectiveWeek() === 'even' ? 'Чётная' : 'Нечётная') + '</span>' +
      '</div>' +
      '<div class="day-card__lessons">';

    var hasAnyLessons = false;

    DATA.pairs.forEach(function (pair) {
      var lessons = lessonsFor(selectedDay.id, pair.number);
      var bell = getBellForPair(pair.number);
      var timeRange = bell ? (bell.start + ' — ' + bell.end) : '';
      var isCurrentPair = (isToday && currentBell && !currentBell.isBreak && currentBell.pair === pair.number);

      if (lessons.length > 0) {
        hasAnyLessons = true;
        markup += '<div class="mobile-pair-row' + (isCurrentPair ? ' is-now' : '') + '">' +
          '<div class="mobile-pair-time">' +
            '<span class="mobile-pair-num">' + escapeHtml(pair.label) + ' пара</span>' +
            '<span class="mobile-pair-hours">' + escapeHtml(timeRange) + '</span>' +
            (isCurrentPair ? '<span class="now-badge">СЕЙЧАС</span>' : '') +
          '</div>' +
          '<div class="mobile-pair-content">' +
            lessons.map(renderLesson).join('') +
          '</div>' +
          '</div>';
      }
    });

    if (!hasAnyLessons) {
      markup += '<div class="day-no-lessons">' +
        '<p class="day-no-lessons__text">В этот день занятий нет</p>' +
        '</div>';
    }

    markup += '</div></div>';
    els.mobileDayStack.innerHTML = markup;
  }

  function renderSchedule() {
    renderScheduleTable();
    renderMobileDayStack();
  }

  // ── Отрисовка звонков ────────────────────────────────────────────

  function toRoman(number) {
    var numerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
    return numerals[number - 1] || String(number);
  }

  function renderBells() {
    var tbody = els.bellsTable.querySelector('tbody');
    var currentBell = getCurrentBellStatus();

    tbody.innerHTML = DATA.bells.map(function (row) {
      if (row.break) {
        var isCurrentBreak = (currentBell && currentBell.isBreak && currentBell.start === row.start);
        return '<tr class="is-break' + (isCurrentBreak ? ' is-now' : '') + '">' +
          '<td class="bell-label-cell">' +
            '<span class="break-tag">Перерыв</span>' +
          '</td>' +
          '<td class="bell-time-cell"><span class="bell-time">' + escapeHtml(row.start) + ' — ' + escapeHtml(row.end) + '</span></td>' +
          '<td class="bell-status-cell">' +
            (isCurrentBreak ? '<span class="status-badge status-badge--active"><span class="pulse-dot"></span> Идёт перерыв</span>' : '<span class="status-badge status-badge--dim">10 минут</span>') +
          '</td>' +
          '</tr>';
      }

      var isCurrentPair = (currentBell && !currentBell.isBreak && currentBell.pair === row.pair);
      return '<tr class="' + (isCurrentPair ? 'is-now' : '') + '">' +
        '<td class="bell-label-cell">' +
          '<span class="bell-pair-num">' + toRoman(row.pair) + '</span>' +
          '<span class="bell-pair-sub">пара</span>' +
        '</td>' +
        '<td class="bell-time-cell"><span class="bell-time bell-time--strong">' + escapeHtml(row.start) + ' — ' + escapeHtml(row.end) + '</span></td>' +
        '<td class="bell-status-cell">' +
          (isCurrentPair ? '<span class="status-badge status-badge--active"><span class="pulse-dot"></span> Идёт сейчас</span>' : '<span class="status-badge status-badge--dim">80 минут</span>') +
        '</td>' +
        '</tr>';
    }).join('');
  }

  function render() {
    syncControls();
    renderSchedule();
    renderBells();
    syncReminderButton();
    updateReminderStatus();
  }

  // ── Часы (Swiss Minimalist) ──────────────────────────────────────

  function pad2(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function renderClockTicks() {
    var markup = '';
    for (var i = 0; i < 60; i++) {
      var major = i % 5 === 0;
      var angle = (i * 6 - 90) * Math.PI / 180;
      var inner = major ? 92 : 98;
      var outer = 104;

      var x1 = (120 + Math.cos(angle) * inner).toFixed(2);
      var y1 = (120 + Math.sin(angle) * inner).toFixed(2);
      var x2 = (120 + Math.cos(angle) * outer).toFixed(2);
      var y2 = (120 + Math.sin(angle) * outer).toFixed(2);

      markup += '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 +
        '" stroke="#ffffff" stroke-opacity="' + (major ? 0.75 : 0.25) +
        '" stroke-width="' + (major ? 2 : 1) + '" stroke-linecap="round" />';
    }
    if (els.clockTicks) els.clockTicks.innerHTML = markup;
  }

  function updateClock() {
    var now = new Date(Date.now() + 3 * 3600000);
    var hours = now.getUTCHours();
    var minutes = now.getUTCMinutes();
    var seconds = now.getUTCSeconds();

    if (els.clockHour) {
      els.clockHour.setAttribute('transform',
        'rotate(' + ((hours % 12) * 30 + minutes * 0.5) + ' 120 120)');
    }
    if (els.clockMinute) {
      els.clockMinute.setAttribute('transform',
        'rotate(' + (minutes * 6 + seconds * 0.1) + ' 120 120)');
    }
    if (els.clockSecond) {
      els.clockSecond.setAttribute('transform',
        'rotate(' + (seconds * 6) + ' 120 120)');
    }

    var timeStr = pad2(hours) + ':' + pad2(minutes) + ':' + pad2(seconds);
    if (els.clockTime) els.clockTime.textContent = timeStr;
    if (els.headerMiniClock) els.headerMiniClock.textContent = pad2(hours) + ':' + pad2(minutes);
  }

  // ── Рулетка (Монохромная) ───────────────────────────────────────

  var WHEEL_CX = 160;
  var WHEEL_CY = 160;
  var WHEEL_RADIUS = 150;
  var WHEEL_SPIN_MS = 4300;

  var WHEEL_SEGMENTS = [
    {
      id: 'go',
      weight: 50,
      label: 'Идти на пару',
      lines: ['Идти', 'на пару'],
      fill: '#18181b',
      stroke: '#3f3f46',
      text: '#ffffff',
    },
    {
      id: 'skip',
      weight: 45,
      label: 'Не идти на пару',
      lines: ['Не идти', 'на пару'],
      fill: '#09090b',
      stroke: '#27272a',
      text: '#a1a1aa',
    },
    {
      id: 'home',
      weight: 5,
      label: 'Остаться дома',
      fill: '#ffffff',
      stroke: '#ffffff',
      text: '#09090b',
    },
  ];

  var wheelRotation = 0;
  var wheelSpinning = false;
  var wheelTimer = null;
  var wheelOnEnd = null;

  function clearWheelTimers() {
    if (wheelTimer) {
      window.clearTimeout(wheelTimer);
      wheelTimer = null;
    }
    if (wheelOnEnd && els.wheelNeedle) {
      els.wheelNeedle.removeEventListener('transitionend', wheelOnEnd);
      wheelOnEnd = null;
    }
  }

  function wheelPoint(angle, radius) {
    var rad = angle * Math.PI / 180;
    return {
      x: WHEEL_CX + Math.sin(rad) * radius,
      y: WHEEL_CY - Math.cos(rad) * radius,
    };
  }

  function wheelSector(start, end) {
    var a = wheelPoint(start, WHEEL_RADIUS);
    var b = wheelPoint(end, WHEEL_RADIUS);
    var large = end - start > 180 ? 1 : 0;

    return 'M' + WHEEL_CX + ' ' + WHEEL_CY +
      ' L' + a.x.toFixed(2) + ' ' + a.y.toFixed(2) +
      ' A' + WHEEL_RADIUS + ' ' + WHEEL_RADIUS + ' 0 ' + large + ' 1 ' +
      b.x.toFixed(2) + ' ' + b.y.toFixed(2) + ' Z';
  }

  function renderWheel() {
    if (!els.wheelSegments) return;
    var total = 0;
    var angle = 0;
    var markup = '';

    WHEEL_SEGMENTS.forEach(function (item) { total += item.weight; });

    WHEEL_SEGMENTS.forEach(function (item) {
      var span = item.weight / total * 360;
      item.start = angle;
      item.span = span;
      item.mid = angle + span / 2;

      markup += '<path class="roulette__segment roulette__segment--' + item.id +
        '" d="' + wheelSector(angle, angle + span) +
        '" fill="' + item.fill + '" stroke="' + item.stroke + '" stroke-width="1.5" />';

      if (span >= 40) {
        var point = wheelPoint(item.mid, WHEEL_RADIUS * 0.55);
        var x = point.x.toFixed(2);
        var y = point.y.toFixed(2);

        markup += '<text class="roulette__label" x="' + x + '" y="' + y +
          '" text-anchor="middle" fill="' + item.text + '">' +
          '<tspan x="' + x + '" dy="-10" font-weight="600">' + item.lines[0] + '</tspan>' +
          '<tspan x="' + x + '" dy="16" font-weight="600">' + item.lines[1] + '</tspan>' +
          '<tspan class="roulette__label-sub" x="' + x + '" dy="15" fill-opacity="0.65" font-family="monospace">' +
          item.weight + '%</tspan>' +
          '</text>';
      } else {
        var star = wheelPoint(item.mid, WHEEL_RADIUS * 0.62);
        markup += '<path class="roulette__star" fill="#09090b" transform="translate(' +
          star.x.toFixed(2) + ' ' + star.y.toFixed(2) + ')" ' +
          'd="M0 -8.2L2.29 -3.16L7.8 -2.53L3.71 1.21L4.82 6.63L0 3.9' +
          'L-4.82 6.63L-3.71 1.21L-7.8 -2.53L-2.29 -3.16Z" />';
      }

      angle += span;
    });

    els.wheelSegments.innerHTML = markup;
  }

  function pickWheelSegment() {
    var total = 0;
    var roll;
    var acc = 0;
    var i;

    WHEEL_SEGMENTS.forEach(function (item) { total += item.weight; });
    roll = Math.random() * total;

    for (i = 0; i < WHEEL_SEGMENTS.length; i++) {
      acc += WHEEL_SEGMENTS[i].weight;
      if (roll < acc) return WHEEL_SEGMENTS[i];
    }
    return WHEEL_SEGMENTS[WHEEL_SEGMENTS.length - 1];
  }

  function spinWheel() {
    if (wheelSpinning) return;

    var picked = pickWheelSegment();
    var turns = 5 + Math.floor(Math.random() * 2);
    var jitterLimit = Math.max(0, picked.span / 2 - 4);
    var jitter = (Math.random() * 2 - 1) * jitterLimit * 0.55;
    var current = ((wheelRotation % 360) + 360) % 360;
    var delta = ((picked.mid + jitter - current) % 360 + 360) % 360;

    clearWheelTimers();
    wheelSpinning = true;
    wheelRotation += delta + turns * 360;

    els.spinWheel.disabled = true;
    els.spinWheel.textContent = 'Определяем судьбу…';
    els.wheelResult.className = 'roulette__result is-spinning';
    els.wheelResult.innerHTML = '<span class="roulette__result-label">Колесо крутится…</span>';

    function finish() {
      if (!wheelSpinning) return;
      clearWheelTimers();
      wheelSpinning = false;
      els.spinWheel.disabled = false;
      els.spinWheel.textContent = 'Крутить колесо';
      els.wheelNeedle.classList.remove('is-spinning');

      els.wheelResult.className = 'roulette__result has-outcome tone--' + picked.id;
      els.wheelResult.innerHTML =
        '<div class="outcome-box">' +
          '<span class="outcome-badge">Результат</span>' +
          '<h3 class="outcome-title">' + escapeHtml(picked.label) + '</h3>' +
          '<span class="outcome-note">Вероятность исхода: ' + picked.weight + '%</span>' +
        '</div>';
    }

    wheelOnEnd = function (event) {
      if (event.propertyName !== 'transform') return;
      finish();
    };
    els.wheelNeedle.addEventListener('transitionend', wheelOnEnd);

    els.wheelNeedle.classList.add('is-spinning');
    void els.wheelNeedle.getBoundingClientRect();
    els.wheelNeedle.style.transform = 'rotate(' + wheelRotation + 'deg)';

    wheelTimer = window.setTimeout(finish, WHEEL_SPIN_MS + 300);
  }

  // ── Выбор группы (Модальное окно) ───────────────────────────────

  var draft = { faculty: null, course: null, group: null };

  function optionHtml(kind, value, label, active) {
    return '<button class="setup__option' + (active ? ' is-active' : '') + '" type="button" ' +
      'data-' + kind + '="' + escapeHtml(value) + '" aria-pressed="' + (active ? 'true' : 'false') + '">' +
      escapeHtml(label) + '</button>';
  }

  function markActive(container, kind, value) {
    Array.prototype.forEach.call(container.querySelectorAll('[data-' + kind + ']'), function (btn) {
      var on = btn.dataset[kind] === value;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', String(on));
    });
  }

  function focusOption(container, kind, value) {
    var btn = container.querySelector('[data-' + kind + '="' + value + '"]');
    if (btn) btn.focus();
  }

  function renderSetup() {
    var faculty = facultyById(draft.faculty);
    if (!faculty) {
      draft.course = null;
      draft.group = null;
    }

    els.setupFaculties.innerHTML = DATA.faculties.map(function (item) {
      return optionHtml('faculty', item.id, item.name, draft.faculty === item.id);
    }).join('');

    var courses = faculty ? faculty.courses : [];
    els.setupCourses.innerHTML = courses.map(function (item) {
      return optionHtml('course', String(item.number), item.number + ' курс', draft.course === item.number);
    }).join('');

    var course = faculty ? courseByNumber(faculty, draft.course) : null;

    if (!course) {
      els.setupGroups.innerHTML = '<p class="setup__hint">Сначала выберите курс выше</p>';
    } else if (!course.groups.length) {
      els.setupGroups.innerHTML = '<p class="setup__hint">На этом курсе расписание пока не добавлено</p>';
    } else {
      els.setupGroups.innerHTML = course.groups.map(function (id) {
        var group = groupById(id);
        return optionHtml('group', id, group ? group.name : id, draft.group === id);
      }).join('');
    }

    els.setupApply.disabled = !draft.group;
  }

  function openSetup() {
    draft.faculty = state.faculty || (DATA.faculties[0] && DATA.faculties[0].id) || null;
    draft.course = state.course || null;
    draft.group = state.group || null;

    renderSetup();
    els.setupModal.hidden = false;
    document.body.classList.add('has-modal');

    var first = els.setupFaculties.querySelector('button');
    if (first) first.focus();
  }

  function closeSetup() {
    if (els.setupModal.hidden) return;
    els.setupModal.hidden = true;
    document.body.classList.remove('has-modal');
    (state.group ? els.changeGroup : els.emptyChoose).focus();
  }

  // ── Установка PWA ───────────────────────────────────────────────

  var installPrompt = null;
  var standaloneQuery = window.matchMedia('(display-mode: standalone)');

  function isStandalone() {
    return standaloneQuery.matches || window.navigator.standalone === true;
  }

  function isIOS() {
    return /iPad|iPhone|iPod/.test(window.navigator.userAgent) ||
      (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
  }

  function isAndroid() {
    return /Android/i.test(window.navigator.userAgent);
  }

  function isLocalFile() {
    return window.location.protocol === 'file:';
  }

  function syncInstallButton() {
    if (els.installBtn) els.installBtn.hidden = isStandalone();
  }

  function installSteps() {
    if (isLocalFile()) {
      return [
        'Сайт сейчас открыт локально с диска.',
        'После размещения на GitHub Pages вы сможете добавить ярлык на экран смартфона.'
      ];
    }
    if (installPrompt) {
      return [
        'Нажмите кнопку <b>«Установить»</b> ниже — приложение будет установлено автоматически.',
        'Или в меню браузера выберите пункт <b>«Добавить на главный экран»</b>.'
      ];
    }
    if (isIOS()) {
      return [
        'Откройте сайт в браузере <b>Safari</b>.',
        'Нажмите кнопку <b>«Поделиться»</b> (квадрат со стрелкой вверх) в нижней панели.',
        'Выберите пункт <b>«На экран „Домой“»</b> и нажмите <b>«Добавить»</b>.'
      ];
    }
    if (isAndroid()) {
      return [
        'Откройте меню браузера (три точки <b>⋮</b> в правом верхнем углу).',
        'Нажмите <b>«Установить приложение»</b> или «Добавить на главный экран».',
        'Подтвердите установку — ярлык появится на рабочем столе.'
      ];
    }
    return [
      'В адресной строке Chrome или Edge нажмите значок установки приложения справа.',
      'Либо откройте меню браузера и выберите <b>«Установить приложение»</b>.'
    ];
  }

  function openInstall() {
    els.installSteps.innerHTML = installSteps().map(function (step) {
      return '<li>' + step + '</li>';
    }).join('');
    els.installModal.hidden = false;
    document.body.classList.add('has-modal');
  }

  function closeInstall() {
    if (els.installModal.hidden) return;
    els.installModal.hidden = true;
    document.body.classList.remove('has-modal');
  }

  // ── Напоминания о парах (за 5 минут) ──────────────────────────────

  var REMINDER_STORAGE_KEY = 'pgtu.reminders.enabled';
  var remindersEnabled = true;
  try {
    var storedRem = window.localStorage.getItem(REMINDER_STORAGE_KEY);
    if (storedRem !== null) remindersEnabled = (storedRem === 'true');
  } catch (e) {}

  var lastTriggeredPairKey = null;

  var REMINDER_PHRASES = [
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
    'Хватай рюкзак и стартуй, опоздаешь ведь!',
    'Подъём, боец! До пары ровно 5 минут!'
  ];

  function getRandomPhrase() {
    return REMINDER_PHRASES[Math.floor(Math.random() * REMINDER_PHRASES.length)];
  }

  function playAlertChime() {
    try {
      var AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      var ctx = new AudioContext();
      var now = ctx.currentTime;

      var osc1 = ctx.createOscillator();
      var osc2 = ctx.createOscillator();
      var gain = ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.setValueAtTime(880, now + 0.12); // A5

      osc2.frequency.setValueAtTime(587.33 * 2, now);
      osc2.frequency.setValueAtTime(880 * 2, now + 0.12);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.55);
      osc2.stop(now + 0.55);
    } catch (e) {}
  }

  function triggerVibrate() {
    try {
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200, 100, 300]);
      }
    } catch (e) {}
  }

  function sendNativeNotification(title, body) {
    var options = {
      body: body,
      icon: 'icons/icon-192.png',
      badge: 'icons/favicon-32.png',
      vibrate: [200, 100, 200, 100, 300],
      tag: 'pgtu-pair-alert',
      renotify: true,
      data: { url: window.location.href },
    };

    try {
      if ('Notification' in window && Notification.permission === 'granted') {
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.ready.then(function (reg) {
            reg.showNotification(title, options);
          }).catch(function () {
            try { new Notification(title, options); } catch (err) {}
          });
        } else {
          new Notification(title, options);
        }
      }
    } catch (e) {}
  }

  function syncReminderButton() {
    if (!els.reminderToggleBtn) return;
    els.reminderToggleBtn.classList.toggle('is-active', remindersEnabled);
    if (els.reminderBtnText) {
      els.reminderBtnText.textContent = remindersEnabled ? '🔔 Вкл' : '🔕 Выкл';
    }
  }

  function toggleReminders() {
    remindersEnabled = !remindersEnabled;
    try {
      window.localStorage.setItem(REMINDER_STORAGE_KEY, String(remindersEnabled));
    } catch (e) {}
    syncReminderButton();

    if (remindersEnabled && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(function () {
        updateReminderStatus();
      });
    }
    updateReminderStatus();
  }

  function getUpcomingLessonInfo() {
    if (!state.group) return null;
    var day = todayId();
    if (!day) return { status: 'weekend' };

    var curMins = getCurrentGmt3Minutes();
    var allLessons = [];

    DATA.pairs.forEach(function (pair) {
      var lessons = lessonsFor(day, pair.number);
      var bell = getBellForPair(pair.number);
      if (lessons.length > 0 && bell) {
        allLessons.push({
          pair: pair,
          lesson: lessons[0],
          bell: bell,
          startMins: parseTimeToMinutes(bell.start),
          endMins: parseTimeToMinutes(bell.end),
        });
      }
    });

    if (allLessons.length === 0) {
      return { status: 'no-lessons-today' };
    }

    for (var i = 0; i < allLessons.length; i++) {
      var item = allLessons[i];
      if (curMins >= item.startMins && curMins <= item.endMins) {
        return {
          status: 'in-progress',
          item: item,
          minutesLeft: item.endMins - curMins,
        };
      }
    }

    for (var j = 0; j < allLessons.length; j++) {
      var next = allLessons[j];
      if (curMins < next.startMins) {
        return {
          status: 'upcoming',
          item: next,
          minutesUntil: next.startMins - curMins,
        };
      }
    }

    return { status: 'finished' };
  }

  function showUrgentModal(phrase, lesson, bell, minutes) {
    if (!els.reminderModal) return;
    if (els.reminderPhrase) els.reminderPhrase.textContent = phrase;
    if (els.reminderLessonDetails) {
      var roomStr = lesson.room ? 'ауд. ' + escapeHtml(lesson.room) : 'аудитория не указана';
      var teacherStr = lesson.teacher ? escapeHtml(lesson.teacher) : '';
      var typeStr = lesson.typeLabel || 'Пара';

      els.reminderLessonDetails.innerHTML =
        '<div class="urgent-lesson-top">' +
          '<span class="urgent-time">' + escapeHtml(bell.start) + ' — ' + escapeHtml(bell.end) + '</span>' +
          '<span class="urgent-room">' + roomStr + '</span>' +
        '</div>' +
        '<div class="urgent-subject">' + escapeHtml(lesson.subject) + '</div>' +
        '<div class="urgent-meta">' +
          '<span class="urgent-type">' + escapeHtml(typeStr) + '</span>' +
          (teacherStr ? '<span class="urgent-teacher">' + teacherStr + '</span>' : '') +
        '</div>' +
        '<div class="urgent-countdown">До звонка осталось: <b>' + (minutes != null ? minutes : 5) + ' мин</b></div>';
    }

    els.reminderModal.hidden = false;
    document.body.classList.add('has-modal');
  }

  function closeReminderModal() {
    if (!els.reminderModal || els.reminderModal.hidden) return;
    els.reminderModal.hidden = true;
    document.body.classList.remove('has-modal');
  }

  function updateReminderStatus() {
    if (!els.reminderBar) return;
    if (!state.group) {
      els.reminderBar.hidden = true;
      return;
    }

    var info = getUpcomingLessonInfo();
    if (!info) {
      els.reminderBar.hidden = true;
      return;
    }

    els.reminderBar.hidden = false;

    if (info.status === 'weekend') {
      els.reminderBar.className = 'reminder-bar reminder-bar--calm';
      els.reminderBar.innerHTML =
        '<span class="reminder-bar__icon">☕</span>' +
        '<span class="reminder-bar__text">Сегодня выходной! Занятий нет, отдыхаем.</span>';
      return;
    }

    if (info.status === 'no-lessons-today') {
      els.reminderBar.className = 'reminder-bar reminder-bar--calm';
      els.reminderBar.innerHTML =
        '<span class="reminder-bar__icon">🎉</span>' +
        '<span class="reminder-bar__text">На сегодня занятий в расписании нет.</span>';
      return;
    }

    if (info.status === 'finished') {
      els.reminderBar.className = 'reminder-bar reminder-bar--calm';
      els.reminderBar.innerHTML =
        '<span class="reminder-bar__icon">✨</span>' +
        '<span class="reminder-bar__text">Все пары на сегодня закончились! Свобода.</span>';
      return;
    }

    if (info.status === 'in-progress') {
      var curLesson = info.item.lesson;
      var curBell = info.item.bell;
      els.reminderBar.className = 'reminder-bar reminder-bar--active';
      els.reminderBar.innerHTML =
        '<span class="pulse-dot"></span>' +
        '<div class="reminder-bar__content">' +
          '<span class="reminder-bar__label">СЕЙЧАС ИДЁТ:</span> ' +
          '<b>' + escapeHtml(curLesson.subject) + '</b> ' +
          (curLesson.room ? '<span class="reminder-bar__room">ауд. ' + escapeHtml(curLesson.room) + '</span>' : '') +
          '<span class="reminder-bar__note">до конца ' + info.minutesLeft + ' мин (' + escapeHtml(curBell.end) + ')</span>' +
        '</div>';
      return;
    }

    if (info.status === 'upcoming') {
      var upLesson = info.item.lesson;
      var upBell = info.item.bell;
      var mins = info.minutesUntil;

      if (mins <= 5 && mins >= 0) {
        var pairKey = todayId() + '-' + info.item.pair.number + '-' + effectiveWeek();
        var phrase = getRandomPhrase();

        if (remindersEnabled && lastTriggeredPairKey !== pairKey) {
          lastTriggeredPairKey = pairKey;
          playAlertChime();
          triggerVibrate();
          showUrgentModal(phrase, upLesson, upBell, mins);
          sendNativeNotification(phrase, 'Через ' + mins + ' мин: ' + upLesson.subject + (upLesson.room ? ' (ауд. ' + upLesson.room + ')' : ''));
        }

        els.reminderBar.className = 'reminder-bar reminder-bar--urgent';
        els.reminderBar.innerHTML =
          '<span class="urgent-pulse-icon">🚨</span>' +
          '<div class="reminder-bar__content">' +
            '<span class="reminder-bar__alert-title">' + escapeHtml(phrase) + '</span> ' +
            '<span class="reminder-bar__text">Через <b>' + mins + ' мин</b>: ' + escapeHtml(upLesson.subject) + '</span> ' +
            (upLesson.room ? '<span class="reminder-bar__room">ауд. ' + escapeHtml(upLesson.room) + '</span>' : '') +
          '</div>' +
          '<button class="btn btn--solid btn--xs reminder-bar__action" type="button" id="reminder-bar-open">Открыть</button>';

        var openBtn = document.getElementById('reminder-bar-open');
        if (openBtn) {
          openBtn.addEventListener('click', function () {
            showUrgentModal(phrase, upLesson, upBell, mins);
          });
        }
      } else {
        els.reminderBar.className = 'reminder-bar reminder-bar--upcoming';
        els.reminderBar.innerHTML =
          '<span class="reminder-bar__icon">⏳</span>' +
          '<div class="reminder-bar__content">' +
            '<span class="reminder-bar__label">Следующая пара:</span> ' +
            '<b>' + escapeHtml(upLesson.subject) + '</b> ' +
            (upLesson.room ? '<span class="reminder-bar__room">ауд. ' + escapeHtml(upLesson.room) + '</span>' : '') +
            '<span class="reminder-bar__note">через ' + mins + ' мин (в ' + escapeHtml(upBell.start) + ')</span>' +
          '</div>';
      }
    }
  }

  function triggerTestReminder() {
    var phrase = getRandomPhrase();
    var info = getUpcomingLessonInfo();
    var lesson, bell;

    if (info && (info.item || info.status === 'in-progress')) {
      lesson = info.item.lesson;
      bell = info.item.bell;
    } else {
      lesson = {
        subject: 'Прикладной искусственный интеллект',
        type: 'lecture',
        typeLabel: 'Лекция',
        room: '5.410',
        teacher: 'Тютюников В. А.',
      };
      bell = { start: '10:00', end: '11:20' };
    }

    playAlertChime();
    triggerVibrate();
    showUrgentModal(phrase, lesson, bell, 5);

    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        sendNativeNotification(phrase, 'Через 5 минут пара: ' + lesson.subject + ' (ауд. ' + lesson.room + ')');
      } else if (Notification.permission === 'default') {
        Notification.requestPermission().then(function (perm) {
          if (perm === 'granted') {
            sendNativeNotification(phrase, 'Через 5 минут пара: ' + lesson.subject + ' (ауд. ' + lesson.room + ')');
          }
        });
      }
    }
  }

  // ── Обработчики событий ──────────────────────────────────────────

  els.changeGroup.addEventListener('click', openSetup);
  els.emptyChoose.addEventListener('click', openSetup);

  els.setupModal.addEventListener('click', function (event) {
    if (event.target.closest('[data-setup-close]')) {
      closeSetup();
      return;
    }

    var facultyBtn = event.target.closest('[data-faculty]');
    if (facultyBtn) {
      var facultyId = facultyBtn.dataset.faculty;
      if (draft.faculty !== facultyId) {
        draft.course = null;
        draft.group = null;
      }
      draft.faculty = facultyId;
      renderSetup();
      focusOption(els.setupFaculties, 'faculty', facultyId);
      return;
    }

    var courseBtn = event.target.closest('[data-course]');
    if (courseBtn) {
      var number = Number(courseBtn.dataset.course);
      var faculty = facultyById(draft.faculty);
      var course = courseByNumber(faculty, number);

      draft.course = number;
      if (!course || course.groups.indexOf(draft.group) === -1) draft.group = null;

      renderSetup();
      focusOption(els.setupCourses, 'course', String(number));
      return;
    }

    var groupBtn = event.target.closest('[data-group]');
    if (groupBtn) {
      draft.group = groupBtn.dataset.group;
      markActive(els.setupGroups, 'group', draft.group);
      els.setupApply.disabled = false;
    }
  });

  els.setupApply.addEventListener('click', function () {
    if (!draft.group) return;

    state.faculty = draft.faculty;
    state.course = draft.course;
    state.group = draft.group;

    saveSelection();
    writeHash();
    closeSetup();
    render();
  });

  els.weekSwitch.addEventListener('click', function (event) {
    var btn = event.target.closest('[data-week]');
    if (!btn) return;
    state.week = btn.dataset.week;
    state.weekAuto = false;
    writeHash();
    render();
  });

  els.autoWeek.addEventListener('click', function () {
    if (state.weekAuto) {
      state.week = currentWeek();
      state.weekAuto = false;
    } else {
      state.weekAuto = true;
    }
    writeHash();
    render();
  });

  els.tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      state.view = tab.dataset.view;
      writeHash();
      syncControls();
    });
  });

  // Mobile day filter clicks
  if (els.mobileDayFilter) {
    els.mobileDayFilter.addEventListener('click', function (event) {
      var btn = event.target.closest('[data-day]');
      if (!btn) return;
      state.mobileDay = btn.dataset.day;
      writeHash();
      syncControls();
      renderMobileDayStack();
    });
  }

  window.addEventListener('hashchange', function () {
    readHash();
    render();
  });

  els.spinWheel.addEventListener('click', spinWheel);
  els.installBtn.addEventListener('click', openInstall);

  if (els.reminderToggleBtn) {
    els.reminderToggleBtn.addEventListener('click', toggleReminders);
  }
  if (els.reminderTestBtn) {
    els.reminderTestBtn.addEventListener('click', triggerTestReminder);
  }
  if (els.reminderModal) {
    els.reminderModal.addEventListener('click', function (event) {
      if (event.target.closest('[data-reminder-close]')) closeReminderModal();
    });
  }

  els.installModal.addEventListener('click', function (event) {
    if (event.target.closest('[data-install-close]')) closeInstall();
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeInstall();
      closeSetup();
      closeReminderModal();
    }
  });

  window.addEventListener('beforeinstallprompt', function (event) {
    event.preventDefault();
    installPrompt = event;
    if (els.installNative) els.installNative.hidden = false;
    if (els.installBtn) {
      els.installBtn.hidden = false;
      els.installBtn.classList.add('is-ready');
    }
  });

  window.addEventListener('appinstalled', function () {
    installPrompt = null;
    if (els.installNative) els.installNative.hidden = true;
    if (els.installBtn) els.installBtn.hidden = true;
    closeInstall();
  });

  if (els.installNative) {
    els.installNative.addEventListener('click', function () {
      if (!installPrompt) return;
      var prompt = installPrompt;
      els.installNative.hidden = true;
      installPrompt = null;
      prompt.prompt();
      if (prompt.userChoice && typeof prompt.userChoice.then === 'function') {
        prompt.userChoice.then(function (res) {
          if (res && res.outcome === 'accepted' && els.installBtn) {
            els.installBtn.hidden = true;
          }
          closeInstall();
        });
      } else {
        closeInstall();
      }
    });
  }

  // ── Инициализация ────────────────────────────────────────────────

  readHash();

  if (!state.group) readStored();

  if (state.group) {
    saveSelection();
    writeHash();
  }

  renderHeader();
  renderClockTicks();
  renderWheel();
  updateClock();
  setInterval(updateClock, 1000);

  // Каждую минуту проверяем, не сменилась ли текущая пара
  setInterval(function () {
    if (state.view === 'schedule') renderScheduleTable();
    if (state.view === 'bells') renderBells();
  }, 60000);

  // Каждые 10 секунд проверяем статус напоминалки за 5 минут
  setInterval(updateReminderStatus, 10000);

  render();
  syncInstallButton();

  if (!state.group) openSetup();

  if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    });
  }
})();
