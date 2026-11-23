/*
 * Данные расписания.
 *
 * Всё, что нужно менять при обновлении расписания — этот файл.
 * Ячейки, объединённые на фото сразу на чётную и нечётную недели,
 * помечены week: 'both'.
 */
window.SCHEDULE_DATA = {
  meta: {
    org: 'ПГТУ — филиал НИУ МГСУ',
    title: 'Расписание занятий',
    period: 'Режим занятий обучающихся по образовательным программам высшего образования',
    updated: '19.11.2026',
    // Опорная неделя для автоопределения: понедельник этой недели считается чётным.
    weekRule: {
      anchorMonday: '2026-11-16',
      anchorWeek: 'even',
    },
  },

  groups: [
    // 1 курс (набор 2026)
    { id: 'it-1-26', name: 'ИТ-1-26' },
    { id: 'ii-26', name: 'ИИ-26' },
    { id: 'bs-26', name: 'БС-26' },
    { id: 'ib-1-26', name: 'ИБ-1-26' },
    { id: 'ib-2-26', name: 'ИБ-2-26' },
    // 2 курс (набор 2025)
    { id: 'it-1-25', name: 'ИТ-1-25' },
    { id: 'it-2-25', name: 'ИТ-2-25' },
    { id: 'ii-25', name: 'ИИ-25' },
    { id: 'ib-1-25', name: 'ИБ-1-25' },
    { id: 'ib-2-25', name: 'ИБ-2-25' },
    { id: 'bs-25', name: 'БС-25' },
    // 3 курс (набор 2024)
    { id: 'it-1-24', name: 'ИТ-1-24' },
    { id: 'it-2-24', name: 'ИТ-2-24' },
    { id: 'ib-1-24', name: 'ИБ-1-24' },
    { id: 'ib-2-24', name: 'ИБ-2-24' },
    { id: 'bs-24', name: 'БС-24' },
    // 4 курс (набор 2023)
    { id: 'it-1-23', name: 'ИТ-1-23' },
    { id: 'it-2-23', name: 'ИТ-2-23' },
    { id: 'ib-1-23', name: 'ИБ-1-23' },
  ],

  /*
   * Факультеты и курсы. Новый факультет — ещё один объект в этом массиве:
   * id, name и список курсов. В courses[].groups указываются id из groups выше.
   * Курсы без групп показываются с подсказкой «расписание появится позже».
   */
  faculties: [
    {
      id: 'uniit',
      name: 'УНИИТ',
      courses: [
        { number: 1, groups: ['it-1-26', 'ii-26', 'bs-26', 'ib-1-26', 'ib-2-26'] },
        { number: 2, groups: ['it-1-25', 'it-2-25', 'ii-25', 'ib-1-25', 'ib-2-25', 'bs-25'] },
        { number: 3, groups: ['it-1-24', 'it-2-24', 'ib-1-24', 'ib-2-24', 'bs-24'] },
        { number: 4, groups: ['it-1-23', 'it-2-23', 'ib-1-23'] },
      ],
    },
  ],

  days: [
    { id: 'mon', name: 'Понедельник', short: 'Пн' },
    { id: 'tue', name: 'Вторник', short: 'Вт' },
    { id: 'wed', name: 'Среда', short: 'Ср' },
    { id: 'thu', name: 'Четверг', short: 'Чт' },
    { id: 'fri', name: 'Пятница', short: 'Пт' },
  ],

  // Учебные пары (I–VI используются в расписании, но звонки есть до VIII)
  pairs: [
    { number: 1, label: 'I' },
    { number: 2, label: 'II' },
    { number: 3, label: 'III' },
    { number: 4, label: 'IV' },
    { number: 5, label: 'V' },
    { number: 6, label: 'VI' },
  ],

  // Звонки: pair — номер пары, break — перерыв
  bells: [
    { pair: 1, start: '08:30', end: '09:50' },
    { break: true, start: '09:50', end: '10:00' },
    { pair: 2, start: '10:00', end: '11:20' },
    { break: true, start: '11:20', end: '11:30' },
    { pair: 3, start: '11:30', end: '12:50' },
    { break: true, start: '12:50', end: '13:00' },
    { pair: 4, start: '13:00', end: '14:20' },
    { break: true, start: '14:20', end: '14:30' },
    { pair: 5, start: '14:30', end: '15:50' },
    { break: true, start: '15:50', end: '16:00' },
    { pair: 6, start: '16:00', end: '17:20' },
    { break: true, start: '17:20', end: '17:30' },
    { pair: 7, start: '17:30', end: '18:50' },
    { break: true, start: '18:50', end: '19:00' },
    { pair: 8, start: '19:00', end: '20:20' },
  ],

  /*
   * Занятия.
   * week: 'even' — чётная, 'odd' — нечётная, 'both' — каждая неделя.
   * groups: к каким группам относится занятие (одна пара может идти на поток).
   * type: lecture | practice | lab | coursework | pe — влияет на цветную метку.
   */
  lessons: [
    // ── Понедельник ────────────────────────────────────────────────
    {
      day: 'mon', pair: 1, week: 'both', groups: ['ib-1-25', 'ib-2-25'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Физика',
      teacher: 'Тютюников', room: '5.410',
    },
    {
      day: 'mon', pair: 2, week: 'both', groups: ['ii-25'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Математический анализ',
      teacher: 'Безбородова', room: '5.509',
    },
    {
      day: 'mon', pair: 2, week: 'both', groups: ['ib-1-25', 'ib-2-25'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Алгоритмизация и программирование',
      teacher: 'Лифшиц', room: '16.337',
    },
    {
      day: 'mon', pair: 3, week: 'odd', groups: ['ii-25'],
      type: 'practice', typeLabel: 'пр.', subject: 'Математический анализ',
      teacher: 'Полищук', room: '5.507',
    },
    {
      day: 'mon', pair: 4, week: 'both', groups: ['ii-25'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Алгоритмизация и программирование',
      teacher: 'Лифшиц', room: '16.337',
    },
    {
      day: 'mon', pair: 4, week: 'both', groups: ['ib-1-25', 'ib-2-25'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Философия',
      teacher: 'Сусарина', room: '1Д.411',
    },
    {
      day: 'mon', pair: 5, week: 'even', groups: ['ib-2-25'],
      type: 'lab', typeLabel: 'лаб.', subject: 'Алгоритмизация и программирование',
      teacher: 'Лифшиц', room: '5.214',
    },
    {
      day: 'mon', pair: 5, week: 'odd', groups: ['ii-25'],
      type: 'practice', typeLabel: 'пр.', subject: 'Философия',
      teacher: 'Сусарина', room: '2.214',
    },
    {
      day: 'mon', pair: 5, week: 'odd', groups: ['ib-1-25', 'ib-2-25'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Алгоритмизация и программирование',
      teacher: 'Лифшиц', room: '5.214',
    },

    // ── Вторник ───────────────────────────────────────────────────
    {
      day: 'tue', pair: 1, week: 'even', groups: ['ii-25'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Компьютерная графика',
      teacher: 'Миронова', room: '5.511',
    },
    {
      day: 'tue', pair: 1, week: 'even', groups: ['ib-1-25'],
      type: 'practice', typeLabel: 'пр.', subject: 'Философия',
      teacher: 'Сусарина', room: '2.214',
    },
    {
      day: 'tue', pair: 1, week: 'odd', groups: ['ib-2-25'],
      type: 'coursework', typeLabel: 'Курсовая', subject: 'Алгоритмизация и программирование',
      teacher: 'Лифшиц', room: '5.401',
    },
    {
      day: 'tue', pair: 2, week: 'both', groups: ['ii-25', 'ib-1-25', 'ib-2-25'],
      type: 'pe', typeLabel: '', subject: 'Физическая культура',
      teacher: '', room: '',
    },
    {
      day: 'tue', pair: 3, week: 'both', groups: ['ib-1-25', 'ib-2-25'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Математический анализ',
      teacher: 'Безбородова', room: '5.511',
    },
    {
      day: 'tue', pair: 4, week: 'both', groups: ['ii-25', 'ib-1-25'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Вычислительная математика',
      teacher: 'Гусев', room: '1Д.410',
    },
    {
      day: 'tue', pair: 4, week: 'both', groups: ['ib-2-25'],
      type: 'practice', typeLabel: 'пр.', subject: 'Математический анализ',
      teacher: 'Полищук', room: '5.511',
    },

    // ── Среда ─────────────────────────────────────────────────────
    {
      day: 'wed', pair: 1, week: 'both', groups: ['ii-25'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Философия',
      teacher: 'Сусарина', room: '1Д.411',
    },
    {
      day: 'wed', pair: 1, week: 'odd', groups: ['ib-1-25'],
      type: 'practice', typeLabel: 'пр.', subject: 'Дифференциальные уравнения',
      teacher: 'Тютюников', room: '5.511',
    },
    {
      day: 'wed', pair: 1, week: 'both', groups: ['ib-2-25'],
      type: 'lab', typeLabel: 'лаб.', subject: 'Алгоритмизация и программирование',
      teacher: 'Лифшиц', room: '5.214',
    },
    {
      day: 'wed', pair: 2, week: 'even', groups: ['ii-25'],
      type: 'practice', typeLabel: 'пр.', subject: 'Дифференциальные уравнения',
      teacher: 'Тютюников', room: '5.511',
    },
    {
      day: 'wed', pair: 2, week: 'both', groups: ['ib-1-25', 'ib-2-25'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Дифференциальные уравнения',
      teacher: 'Анищенко', room: '5.507',
    },
    {
      day: 'wed', pair: 4, week: 'both', groups: ['ii-25'],
      type: 'practice', typeLabel: 'пр.', subject: 'Вычислительная математика',
      teacher: 'Гусев', room: '1Д.403',
    },
    {
      day: 'wed', pair: 4, week: 'odd', groups: ['ib-2-25'],
      type: 'practice', typeLabel: 'пр.', subject: 'Дифференциальные уравнения',
      teacher: 'Тютюников', room: '5.511',
    },
    {
      day: 'wed', pair: 5, week: 'both', groups: ['ib-2-25'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Вычислительная математика',
      teacher: 'Гусев', room: '5.337',
    },

    // ── Четверг ───────────────────────────────────────────────────
    {
      day: 'thu', pair: 1, week: 'both', groups: ['ii-25'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Физика',
      teacher: 'Тютюников', room: '5.509',
    },
    {
      day: 'thu', pair: 1, week: 'even', groups: ['ib-1-25'],
      type: 'coursework', typeLabel: 'Курсовая', subject: 'Алгоритмизация и программирование',
      teacher: 'Лифшиц', room: '5.401',
    },
    {
      day: 'thu', pair: 1, week: 'odd', groups: ['ib-1-25'],
      type: 'lab', typeLabel: 'лаб.', subject: 'Алгоритмизация и программирование',
      teacher: 'Лифшиц', room: '5.214',
    },
    {
      day: 'thu', pair: 1, week: 'odd', groups: ['ib-2-25'],
      type: 'practice', typeLabel: 'пр.', subject: 'Философия',
      teacher: 'Сусарина', room: '2.214',
    },
    {
      day: 'thu', pair: 2, week: 'even', groups: ['ii-25', 'ib-1-25', 'ib-2-25'],
      type: 'practice', typeLabel: 'пр.', subject: 'Основы военной подготовки',
      teacher: 'Цараков', room: '1А.417',
    },
    {
      day: 'thu', pair: 2, week: 'odd', groups: ['ii-25', 'ib-1-25', 'ib-2-25'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Основы военной подготовки',
      teacher: 'Пивень', room: '1А.417',
    },
    {
      day: 'thu', pair: 3, week: 'both', groups: ['ii-25'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Дифференциальные уравнения',
      teacher: 'Анищенко', room: '5.509',
    },
    {
      day: 'thu', pair: 3, week: 'both', groups: ['ib-1-25'],
      type: 'practice', typeLabel: 'пр.', subject: 'Физика',
      teacher: 'Эрнесто Кампано Вега', room: '5.422',
    },
    {
      day: 'thu', pair: 3, week: 'both', groups: ['ib-2-25'],
      type: 'practice', typeLabel: 'пр.', subject: 'Вычислительная математика',
      teacher: 'Безбородова', room: '5.522',
    },
    {
      day: 'thu', pair: 4, week: 'even', groups: ['ii-25'],
      type: 'practice', typeLabel: 'Пр+коп.', subject: 'Компьютерная графика',
      teacher: 'Туровник', room: '5.210',
    },
    {
      day: 'thu', pair: 4, week: 'odd', groups: ['ii-25'],
      type: 'coursework', typeLabel: 'Курсовая', subject: 'Алгоритмизация и программирование',
      teacher: 'Лифшиц', room: '5.401',
    },
    {
      day: 'thu', pair: 4, week: 'both', groups: ['ib-2-25'],
      type: 'practice', typeLabel: 'пр.', subject: 'Физика',
      teacher: 'Эрнесто Кампано Вега', room: '5.422',
    },
    {
      day: 'thu', pair: 5, week: 'both', groups: ['ib-1-25'],
      type: 'practice', typeLabel: 'пр.', subject: 'Математический анализ',
      teacher: 'Полищук', room: '5.507',
    },

    // ── Пятница ───────────────────────────────────────────────────
    {
      day: 'fri', pair: 1, week: 'even', groups: ['ii-25'],
      type: 'lab', typeLabel: 'лаб+коп.', subject: 'Алгоритмизация и программирование',
      teacher: 'Лифшиц', room: '5.214',
    },
    {
      day: 'fri', pair: 1, week: 'even', groups: ['ib-1-25', 'ib-2-25'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Компьютерная графика',
      teacher: 'Миронова', room: '5.509',
    },
    {
      day: 'fri', pair: 2, week: 'even', groups: ['ib-2-25'],
      type: 'practice', typeLabel: 'Пр+коп.', subject: 'Компьютерная графика',
      teacher: 'Туровник', room: '5.214',
    },
    {
      day: 'fri', pair: 2, week: 'odd', groups: ['ib-1-25'],
      type: 'practice', typeLabel: 'Пр+коп.', subject: 'Компьютерная графика',
      teacher: 'Туровник', room: '5.214',
    },
    {
      day: 'fri', pair: 3, week: 'both', groups: ['ii-25'],
      type: 'practice', typeLabel: 'пр/лр.', subject: 'Физика',
      teacher: 'Эрнесто Кампано Вега', room: '5.422',
    },
    {
      day: 'fri', pair: 3, week: 'both', groups: ['ib-1-25'],
      type: 'practice', typeLabel: 'пр.', subject: 'Вычислительная математика',
      teacher: 'Безбородова', room: '5.511',
    },
    {
      day: 'fri', pair: 4, week: 'both', groups: ['ib-1-25'],
      type: 'lab', typeLabel: 'лаб.', subject: 'Физика',
      teacher: 'Эрнесто Кампано Вега', room: '5.422',
    },
    {
      day: 'fri', pair: 5, week: 'both', groups: ['ib-1-25'],
      type: 'lab', typeLabel: 'лаб.', subject: 'Алгоритмизация и программирование',
      teacher: 'Лифшиц', room: '5.214',
    },
    {
      day: 'fri', pair: 5, week: 'both', groups: ['ib-2-25'],
      type: 'lab', typeLabel: 'лаб.', subject: 'Физика',
      teacher: 'Эрнесто Кампано Вега', room: '5.422',
    },
    // ── Новые группы: 1 курс (2026) и 2 курс (2025, кроме уже
    //    опубликованных ИИ-25, ИБ-1-25, ИБ-2-25) ─────────────
    {
      day: 'mon', pair: 1, week: 'even', groups: ['it-2-25'],
      type: 'practice', typeLabel: 'пр.', subject: 'Математический анализ',
      teacher: 'Полищук', room: '5.507',
    },
    {
      day: 'mon', pair: 1, week: 'odd', groups: ['it-1-25'],
      type: 'practice', typeLabel: 'пр.', subject: 'Математический анализ',
      teacher: 'Полищук', room: '5.507',
    },
    {
      day: 'mon', pair: 1, week: 'both', groups: ['it-1-26'],
      type: 'practice', typeLabel: 'пр.', subject: 'Иностранный язык',
      teacher: 'Дацер', room: '2.413',
    },
    {
      day: 'mon', pair: 1, week: 'both', groups: ['ii-26'],
      type: 'practice', typeLabel: 'пр.', subject: 'История России',
      teacher: 'Чича', room: '1Д.411',
    },
    {
      day: 'mon', pair: 1, week: 'both', groups: ['ib-1-26', 'ib-2-26'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Математический анализ',
      teacher: 'Безбородова', room: '5.509',
    },
    {
      day: 'mon', pair: 2, week: 'both', groups: ['ib-1-26', 'ib-2-26'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Дискретная математика',
      teacher: 'Деревянко', room: '5.206',
    },
    {
      day: 'mon', pair: 2, week: 'both', groups: ['it-1-26'],
      type: 'practice', typeLabel: 'пр.', subject: 'Иностранный язык',
      teacher: 'Дацер', room: '2.413',
    },
    {
      day: 'mon', pair: 2, week: 'both', groups: ['it-1-25', 'it-2-25'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Математический анализ',
      teacher: 'Безбородова', room: '5.509',
    },
    {
      day: 'mon', pair: 2, week: 'both', groups: ['bs-25'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Физика',
      teacher: 'Тютюнников', room: '5.410',
    },
    {
      day: 'mon', pair: 3, week: 'even', groups: ['bs-26'],
      type: 'practice', typeLabel: 'пр.', subject: 'Дискретная математика',
      teacher: 'Цыс', room: '5.522',
    },
    {
      day: 'mon', pair: 3, week: 'odd', groups: ['bs-26'],
      type: 'practice', typeLabel: 'пр.', subject: 'Линейная алгебра',
      teacher: 'Цыс', room: '5.522',
    },
    {
      day: 'mon', pair: 3, week: 'both', groups: ['ib-1-26'],
      type: 'practice', typeLabel: '', subject: 'Деловой русский язык',
      teacher: 'Бороденко', room: '2.413',
    },
    {
      day: 'mon', pair: 3, week: 'both', groups: ['it-1-26', 'ii-26'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Дискретная математика',
      teacher: 'Деревянко', room: '5.206',
    },
    {
      day: 'mon', pair: 3, week: 'both', groups: ['bs-25'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Философия',
      teacher: 'Сусарина', room: '1Д.411',
    },
    {
      day: 'mon', pair: 4, week: 'even', groups: ['it-1-26'],
      type: 'practice', typeLabel: 'Пр+коп.', subject: 'Введение в специальность',
      teacher: 'Раков', room: '5.403',
    },
    {
      day: 'mon', pair: 4, week: 'even', groups: ['ii-26'],
      type: 'practice', typeLabel: 'пр.', subject: 'Дискретная математика',
      teacher: 'Цыс', room: '5.522',
    },
    {
      day: 'mon', pair: 4, week: 'even', groups: ['ib-1-26'],
      type: 'practice', typeLabel: 'пр.', subject: 'Математический анализ',
      teacher: 'Полищук', room: '5.509',
    },
    {
      day: 'mon', pair: 4, week: 'odd', groups: ['ii-26'],
      type: 'practice', typeLabel: 'Пр+коп.', subject: 'Введение в специальность',
      teacher: 'Раков', room: '5.403',
    },
    {
      day: 'mon', pair: 4, week: 'odd', groups: ['it-1-26'],
      type: 'practice', typeLabel: 'пр.', subject: 'Линейная алгебра',
      teacher: 'Цыс', room: '5.522',
    },
    {
      day: 'mon', pair: 4, week: 'both', groups: ['it-1-25', 'it-2-25'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Алгоритмизация и программирование',
      teacher: 'Лифшиц', room: '1Б.337',
    },
    {
      day: 'mon', pair: 4, week: 'both', groups: ['bs-26'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Дискретная математика',
      teacher: 'Деревянко', room: '5.206',
    },
    {
      day: 'mon', pair: 4, week: 'both', groups: ['ib-2-26'],
      type: 'practice', typeLabel: 'пр.', subject: 'История России',
      teacher: 'Чича', room: '5.507',
    },
    {
      day: 'mon', pair: 5, week: 'even', groups: ['ii-26'],
      type: 'practice', typeLabel: 'пр.', subject: 'Линейная алгебра',
      teacher: 'Цыс', room: '5.522',
    },
    {
      day: 'mon', pair: 5, week: 'even', groups: ['bs-25'],
      type: 'coursework', typeLabel: 'Курсовая', subject: 'Математический анализ',
      teacher: 'Безбородова', room: '5.507',
    },
    {
      day: 'mon', pair: 5, week: 'even', groups: ['bs-26'],
      type: 'practice', typeLabel: 'пр.', subject: 'Математический анализ',
      teacher: 'Полищук', room: '5.509',
    },
    {
      day: 'mon', pair: 5, week: 'odd', groups: ['bs-26'],
      type: 'practice', typeLabel: 'Пр+коп.', subject: 'Введение в специальность',
      teacher: 'Раков', room: '5.403',
    },
    {
      day: 'mon', pair: 5, week: 'odd', groups: ['it-1-26'],
      type: 'practice', typeLabel: 'пр.', subject: 'Дискретная математика',
      teacher: 'Цыс', room: '5.522',
    },
    {
      day: 'mon', pair: 5, week: 'odd', groups: ['ib-2-26'],
      type: 'practice', typeLabel: 'пр.', subject: 'Математический анализ',
      teacher: 'Полищук', room: '5.509',
    },
    {
      day: 'mon', pair: 5, week: 'both', groups: ['it-1-25', 'it-2-25'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Вычислительная математика',
      teacher: 'Гусев', room: '1Б.337',
    },
    {
      day: 'mon', pair: 6, week: 'odd', groups: ['it-2-25'],
      type: 'practice', typeLabel: 'пр.', subject: 'Философия',
      teacher: 'Сусарина', room: '2.214',
    },
    {
      day: 'tue', pair: 1, week: 'even', groups: ['bs-25'],
      type: 'lab', typeLabel: 'лаб.', subject: 'Алгоритмизация и программирование',
      teacher: 'Лифшиц', room: '5.214',
    },
    {
      day: 'tue', pair: 1, week: 'even', groups: ['it-1-25', 'it-2-25'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Компьютерная графика',
      teacher: 'Миронова', room: '5.511',
    },
    {
      day: 'tue', pair: 1, week: 'both', groups: ['it-1-26', 'ii-26', 'bs-26', 'ib-1-26', 'ib-2-26'],
      type: 'pe', typeLabel: '', subject: 'Физическая культура',
      teacher: '', room: '',
    },
    {
      day: 'tue', pair: 2, week: 'even', groups: ['bs-26'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Введение в специальность',
      teacher: 'Лаврова', room: '5.206',
    },
    {
      day: 'tue', pair: 2, week: 'both', groups: ['it-1-26'],
      type: 'practice', typeLabel: 'пр.', subject: 'История России',
      teacher: 'Чича', room: '1Д.411',
    },
    {
      day: 'tue', pair: 2, week: 'both', groups: ['it-1-25', 'it-2-25', 'bs-25'],
      type: 'pe', typeLabel: '', subject: 'Физическая культура',
      teacher: '', room: '',
    },
    {
      day: 'tue', pair: 3, week: 'even', groups: ['ib-1-26', 'ib-2-26'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Введение в специальность',
      teacher: 'Лаврова', room: '5.206',
    },
    {
      day: 'tue', pair: 3, week: 'even', groups: ['bs-25'],
      type: 'practice', typeLabel: 'пр+лаб.', subject: 'Физика',
      teacher: 'Эрнесто Кампано Вега', room: '5.422',
    },
    {
      day: 'tue', pair: 3, week: 'odd', groups: ['bs-25'],
      type: 'practice', typeLabel: 'пр.', subject: 'Философия',
      teacher: 'Сусарина', room: '2.214',
    },
    {
      day: 'tue', pair: 3, week: 'both', groups: ['bs-26'],
      type: 'practice', typeLabel: 'пр.', subject: 'История России',
      teacher: 'Чича', room: '1Д.410',
    },
    {
      day: 'tue', pair: 4, week: 'even', groups: ['it-1-26', 'ii-26'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Введение в специальность',
      teacher: 'Лаврова', room: '5.206',
    },
    {
      day: 'tue', pair: 4, week: 'odd', groups: ['it-1-26'],
      type: 'lab', typeLabel: 'лаб+коп.', subject: 'Алгоритмизация и программирование',
      teacher: 'Лифшиц', room: '5.210',
    },
    {
      day: 'tue', pair: 4, week: 'both', groups: ['ib-1-26'],
      type: 'practice', typeLabel: 'пр.', subject: 'Введение в специальность',
      teacher: 'Раков', room: '5.403',
    },
    {
      day: 'tue', pair: 4, week: 'both', groups: ['ib-2-26'],
      type: 'practice', typeLabel: '', subject: 'Деловой русский язык',
      teacher: 'Бороденко', room: '2.413',
    },
    {
      day: 'tue', pair: 5, week: 'both', groups: ['ib-1-26', 'ib-2-26'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Алгоритмизация и программирование',
      teacher: 'Лифшиц', room: '5.511',
    },
    {
      day: 'tue', pair: 5, week: 'both', groups: ['bs-26'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Линейная алгебра',
      teacher: 'Цыс', room: '5.507',
    },
    {
      day: 'wed', pair: 1, week: 'odd', groups: ['ib-1-26', 'ib-2-26'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'История России',
      teacher: 'Ярченко', room: '1Д.410',
    },
    {
      day: 'wed', pair: 1, week: 'both', groups: ['it-1-26', 'ii-26'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Линейная алгебра',
      teacher: 'Цыс', room: '5.206',
    },
    {
      day: 'wed', pair: 1, week: 'both', groups: ['bs-26'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Математический анализ',
      teacher: 'Безбородова', room: '5.509',
    },
    {
      day: 'wed', pair: 1, week: 'both', groups: ['it-1-25', 'it-2-25'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Философия',
      teacher: 'Сусарина', room: '1Д.411',
    },
    {
      day: 'wed', pair: 2, week: 'even', groups: ['it-1-25'],
      type: 'practice', typeLabel: 'пр.', subject: 'Философия',
      teacher: 'Сусарина', room: '2.214',
    },
    {
      day: 'wed', pair: 2, week: 'odd', groups: ['bs-25'],
      type: 'practice', typeLabel: 'пр.', subject: 'Дифференциальные уравнения',
      teacher: 'Тютюнников', room: '5.511',
    },
    {
      day: 'wed', pair: 2, week: 'both', groups: ['ii-26', 'bs-26'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Алгоритмизация и программирование',
      teacher: 'Лифшиц', room: '1Д.410',
    },
    {
      day: 'wed', pair: 2, week: 'both', groups: ['ib-2-26'],
      type: 'practice', typeLabel: 'пр.', subject: 'Введение в специальность',
      teacher: 'Раков', room: '5.403',
    },
    {
      day: 'wed', pair: 2, week: 'both', groups: ['it-2-25'],
      type: 'practice', typeLabel: 'пр.', subject: 'Вычислительная математика',
      teacher: 'Безбородова', room: '5.522',
    },
    {
      day: 'wed', pair: 3, week: 'both', groups: ['ib-2-26'],
      type: 'lab', typeLabel: 'лаб.', subject: 'Алгоритмизация и программирование',
      teacher: 'Лифшиц', room: '5.214',
    },
    {
      day: 'wed', pair: 3, week: 'both', groups: ['it-1-26'],
      type: 'practice', typeLabel: '', subject: 'Деловой русский язык',
      teacher: 'Бороденко', room: '2.412',
    },
    {
      day: 'wed', pair: 3, week: 'both', groups: ['bs-25'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Дифференциальные уравнения',
      teacher: 'Анищенко', room: '5.509',
    },
    {
      day: 'wed', pair: 3, week: 'both', groups: ['ib-1-26'],
      type: 'practice', typeLabel: 'пр.', subject: 'Иностранный язык',
      teacher: 'Дацер', room: '2.413',
    },
    {
      day: 'wed', pair: 4, week: 'even', groups: ['ii-26'],
      type: 'lab', typeLabel: 'лаб+коп.', subject: 'Алгоритмизация и программирование',
      teacher: 'Лифшиц', room: '5.210',
    },
    {
      day: 'wed', pair: 4, week: 'even', groups: ['ib-2-26'],
      type: 'practice', typeLabel: 'пр.', subject: 'Введение в специальность',
      teacher: 'Раков', room: '5.403',
    },
    {
      day: 'wed', pair: 4, week: 'odd', groups: ['it-1-26'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Алгоритмизация и программирование',
      teacher: 'Лифшиц', room: '5.401',
    },
    {
      day: 'wed', pair: 4, week: 'odd', groups: ['bs-25'],
      type: 'practice', typeLabel: 'пр.', subject: 'Математический анализ',
      teacher: 'Полищук', room: '5.507',
    },
    {
      day: 'wed', pair: 4, week: 'both', groups: ['it-1-25'],
      type: 'practice', typeLabel: 'пр.', subject: 'Вычислительная математика',
      teacher: 'Безбородова', room: '5.522',
    },
    {
      day: 'wed', pair: 4, week: 'both', groups: ['bs-26'],
      type: 'practice', typeLabel: 'пр.', subject: 'Иностранный язык',
      teacher: 'Дацер', room: '2.413',
    },
    {
      day: 'wed', pair: 5, week: 'even', groups: ['ib-1-26'],
      type: 'practice', typeLabel: 'пр.', subject: 'Введение в специальность',
      teacher: 'Раков', room: '5.403',
    },
    {
      day: 'wed', pair: 5, week: 'odd', groups: ['ib-1-26'],
      type: 'practice', typeLabel: 'пр.', subject: 'Дискретная математика',
      teacher: 'Цыс', room: '5.522',
    },
    {
      day: 'wed', pair: 5, week: 'both', groups: ['bs-25'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Вычислительная математика',
      teacher: 'Гусев', room: '1Б.337',
    },
    {
      day: 'wed', pair: 5, week: 'both', groups: ['ii-26'],
      type: 'practice', typeLabel: 'пр.', subject: 'Иностранный язык',
      teacher: 'Дацер', room: '2.413',
    },
    {
      day: 'wed', pair: 5, week: 'both', groups: ['bs-26'],
      type: 'practice', typeLabel: 'пр.', subject: 'Основы российской государственности',
      teacher: 'Гай', room: '1Д.403',
    },
    {
      day: 'thu', pair: 1, week: 'even', groups: ['ib-2-26'],
      type: 'practice', typeLabel: 'пр.', subject: 'Дискретная математика',
      teacher: 'Цыс', room: '5.522',
    },
    {
      day: 'thu', pair: 1, week: 'odd', groups: ['ib-1-26'],
      type: 'practice', typeLabel: 'пр.', subject: 'Линейная алгебра',
      teacher: 'Цыс', room: '5.522',
    },
    {
      day: 'thu', pair: 1, week: 'both', groups: ['bs-25'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Математический анализ',
      teacher: 'Безбородова', room: '5.511',
    },
    {
      day: 'thu', pair: 1, week: 'both', groups: ['it-1-26'],
      type: 'practice', typeLabel: 'пр.', subject: 'Основы российской государственности',
      teacher: 'Гай', room: '1Д.410',
    },
    {
      day: 'thu', pair: 1, week: 'both', groups: ['it-1-25', 'it-2-25'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Физика',
      teacher: 'Тютюнников', room: '5.509',
    },
    {
      day: 'thu', pair: 2, week: 'even', groups: ['it-2-25'],
      type: 'coursework', typeLabel: 'Курсовая', subject: 'Алгоритмизация и программирование',
      teacher: 'Лифшиц', room: '5.401',
    },
    {
      day: 'thu', pair: 2, week: 'even', groups: ['it-1-25'],
      type: 'practice', typeLabel: 'пр.', subject: 'Дифференциальные уравнения',
      teacher: 'Тютюнников', room: '5.509',
    },
    {
      day: 'thu', pair: 2, week: 'even', groups: ['bs-25'],
      type: 'practice', typeLabel: 'пр.', subject: 'Основы военной подготовки',
      teacher: 'Цараков', room: '1А.417',
    },
    {
      day: 'thu', pair: 2, week: 'odd', groups: ['it-2-25'],
      type: 'practice', typeLabel: 'пр.', subject: 'Дифференциальные уравнения',
      teacher: 'Тютюнников', room: '5.509',
    },
    {
      day: 'thu', pair: 2, week: 'odd', groups: ['it-1-25'],
      type: 'practice', typeLabel: 'Пр+коп.', subject: 'Компьютерная графика',
      teacher: 'Туровник', room: '5.210',
    },
    {
      day: 'thu', pair: 2, week: 'odd', groups: ['bs-25'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Основы военной подготовки',
      teacher: 'Цараков', room: '1А.417',
    },
    {
      day: 'thu', pair: 2, week: 'both', groups: ['bs-26'],
      type: 'practice', typeLabel: '', subject: 'Деловой русский язык',
      teacher: 'Бороденко', room: '2.412',
    },
    {
      day: 'thu', pair: 2, week: 'both', groups: ['ib-2-26'],
      type: 'practice', typeLabel: 'пр.', subject: 'Основы российской государственности',
      teacher: 'Гай', room: '1Д.410',
    },
    {
      day: 'thu', pair: 2, week: 'both', groups: ['it-1-26', 'ii-26'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Основы российской государственности',
      teacher: 'Исаенко', room: '5.507',
    },
    {
      day: 'thu', pair: 3, week: 'both', groups: ['bs-25'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Алгоритмизация и программирование',
      teacher: 'Лифшиц', room: '5.401',
    },
    {
      day: 'thu', pair: 3, week: 'both', groups: ['ii-26'],
      type: 'practice', typeLabel: '', subject: 'Деловой русский язык',
      teacher: 'Бороденко', room: '2.412',
    },
    {
      day: 'thu', pair: 3, week: 'both', groups: ['it-1-25', 'it-2-25'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Дифференциальные уравнения',
      teacher: 'Анищенко', room: '5.509',
    },
    {
      day: 'thu', pair: 3, week: 'both', groups: ['ib-2-26'],
      type: 'practice', typeLabel: 'пр.', subject: 'Иностранный язык',
      teacher: 'Дацер', room: '2.413',
    },
    {
      day: 'thu', pair: 3, week: 'both', groups: ['ib-1-26'],
      type: 'practice', typeLabel: 'пр.', subject: 'История России',
      teacher: 'Чича', room: '1Д.411',
    },
    {
      day: 'thu', pair: 4, week: 'even', groups: ['it-1-26'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Алгоритмизация и программирование',
      teacher: 'Лифшиц', room: '5.401',
    },
    {
      day: 'thu', pair: 4, week: 'odd', groups: ['it-1-26', 'ii-26', 'bs-26'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'История России',
      teacher: 'Ярченко', room: '5.410',
    },
    {
      day: 'thu', pair: 4, week: 'odd', groups: ['it-2-25'],
      type: 'practice', typeLabel: 'Пр+коп.', subject: 'Компьютерная графика',
      teacher: 'Туровник', room: '5.210',
    },
    {
      day: 'thu', pair: 4, week: 'both', groups: ['ib-1-26'],
      type: 'practice', typeLabel: 'пр.', subject: 'Иностранный язык',
      teacher: 'Дацер', room: '2.413',
    },
    {
      day: 'thu', pair: 5, week: 'even', groups: ['bs-26'],
      type: 'lab', typeLabel: 'лаб+коп.', subject: 'Алгоритмизация и программирование',
      teacher: 'Лифшиц', room: '5.210',
    },
    {
      day: 'thu', pair: 5, week: 'both', groups: ['ib-2-26'],
      type: 'practice', typeLabel: 'пр.', subject: 'Иностранный язык',
      teacher: 'Дацер', room: '2.413',
    },
    {
      day: 'thu', pair: 5, week: 'both', groups: ['ib-1-26'],
      type: 'practice', typeLabel: 'пр.', subject: 'Основы российской государственности',
      teacher: 'Гай', room: '1Д.410',
    },
    {
      day: 'fri', pair: 1, week: 'even', groups: ['bs-25'],
      type: 'practice', typeLabel: 'Пр+коп.', subject: 'Компьютерная графика',
      teacher: 'Туровник', room: '5.210',
    },
    {
      day: 'fri', pair: 1, week: 'odd', groups: ['it-2-25'],
      type: 'lab', typeLabel: 'лаб+коп.', subject: 'Алгоритмизация и программирование',
      teacher: 'Лифшиц', room: '5.214',
    },
    {
      day: 'fri', pair: 1, week: 'odd', groups: ['bs-25'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Компьютерная графика',
      teacher: 'Миронова', room: '5.509',
    },
    {
      day: 'fri', pair: 1, week: 'both', groups: ['bs-26'],
      type: 'practice', typeLabel: 'пр.', subject: 'Иностранный язык',
      teacher: 'Дацер', room: '2.413',
    },
    {
      day: 'fri', pair: 1, week: 'both', groups: ['ib-1-26', 'ib-2-26'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Линейная алгебра',
      teacher: 'Цыс', room: '5.206',
    },
    {
      day: 'fri', pair: 1, week: 'both', groups: ['it-1-26', 'ii-26'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Математический анализ',
      teacher: 'Безбородова', room: '5.511',
    },
    {
      day: 'fri', pair: 1, week: 'both', groups: ['it-1-25'],
      type: 'practice', typeLabel: 'пр./лр.', subject: 'Физика',
      teacher: 'Эрнесто Кампано Вега', room: '5.422',
    },
    {
      day: 'fri', pair: 2, week: 'even', groups: ['it-1-25'],
      type: 'coursework', typeLabel: 'Курсовая', subject: 'Алгоритмизация и программирование',
      teacher: 'Лифшиц', room: '5.401',
    },
    {
      day: 'fri', pair: 2, week: 'even', groups: ['it-1-26'],
      type: 'practice', typeLabel: 'пр.', subject: 'Математический анализ',
      teacher: 'Полищук', room: '5.511',
    },
    {
      day: 'fri', pair: 2, week: 'odd', groups: ['it-1-25'],
      type: 'lab', typeLabel: 'лаб+коп.', subject: 'Алгоритмизация и программирование',
      teacher: 'Лифшиц', room: '5.401',
    },
    {
      day: 'fri', pair: 2, week: 'odd', groups: ['ii-26'],
      type: 'practice', typeLabel: 'пр.', subject: 'Математический анализ',
      teacher: 'Полищук', room: '5.511',
    },
    {
      day: 'fri', pair: 2, week: 'both', groups: ['bs-25'],
      type: 'practice', typeLabel: 'пр.', subject: 'Вычислительная математика',
      teacher: 'Гусев', room: '5.507',
    },
    {
      day: 'fri', pair: 2, week: 'both', groups: ['bs-26', 'ib-1-26', 'ib-2-26'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Основы российской государственности',
      teacher: 'Исаенко', room: '1Д.411',
    },
    {
      day: 'fri', pair: 2, week: 'both', groups: ['it-2-25'],
      type: 'practice', typeLabel: 'пр./лр.', subject: 'Физика',
      teacher: 'Эрнесто Кампано Вега', room: '5.422',
    },
    {
      day: 'fri', pair: 3, week: 'even', groups: ['ib-1-26'],
      type: 'lab', typeLabel: 'коп.', subject: 'Алгоритмизация и программирование',
      teacher: 'Лифшиц', room: '5.210',
    },
    {
      day: 'fri', pair: 3, week: 'even', groups: ['ib-2-26'],
      type: 'practice', typeLabel: 'пр.', subject: 'Линейная алгебра',
      teacher: 'Цыс', room: '5.522',
    },
    {
      day: 'fri', pair: 3, week: 'odd', groups: ['ib-2-26'],
      type: 'lab', typeLabel: 'коп.', subject: 'Алгоритмизация и программирование',
      teacher: 'Лифшиц', room: '5.210',
    },
    {
      day: 'fri', pair: 4, week: 'both', groups: ['ib-1-26'],
      type: 'lab', typeLabel: 'лаб.', subject: 'Алгоритмизация и программирование',
      teacher: 'Лифшиц', room: '5.214',
    },
    {
      day: 'fri', pair: 4, week: 'both', groups: ['ii-26'],
      type: 'practice', typeLabel: 'пр.', subject: 'Иностранный язык',
      teacher: 'Дацер', room: '2.413',
    },
    {
      day: 'fri', pair: 5, week: 'both', groups: ['ii-26'],
      type: 'practice', typeLabel: 'пр.', subject: 'Основы российской государственности',
      teacher: 'Гай', room: '1Д.411',
    },

    // ── 3–4 курсы (наборы 2024 и 2023) ────────────────────────────
    {
      day: 'mon', pair: 1, week: 'odd', groups: ['it-1-23', 'it-2-23'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Технологии создания программных продуктов',
      teacher: 'Лифшиц', room: '5.210',
    },
    {
      day: 'mon', pair: 1, week: 'both', groups: ['ib-1-24', 'ib-2-24'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Криптографические методы защиты информации',
      teacher: 'Цыс', room: '5.206',
    },
    {
      day: 'mon', pair: 1, week: 'both', groups: ['ib-1-23'],
      type: 'lecture', typeLabel: 'лек+пр.', subject: 'Охрана труда и экология',
      teacher: 'Иващенко', room: '5.511',
    },
    {
      day: 'mon', pair: 2, week: 'even', groups: ['ib-1-24', 'ib-2-24'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Криптографические методы защиты информации',
      teacher: 'Цыс', room: '5.401',
    },
    {
      day: 'mon', pair: 2, week: 'odd', groups: ['ib-1-24'],
      type: 'lab', typeLabel: 'лаб.', subject: 'Криптографические методы защиты информации',
      teacher: 'Цыс', room: '5.401',
    },
    {
      day: 'mon', pair: 2, week: 'odd', groups: ['it-2-24'],
      type: 'lab', typeLabel: 'лаб.', subject: 'Математические методы исследования операций',
      teacher: 'Туровник', room: '5.214',
    },
    {
      day: 'mon', pair: 2, week: 'odd', groups: ['ib-1-23'],
      type: 'practice', typeLabel: 'пр.', subject: 'Охрана труда и экология',
      teacher: 'Иващенко', room: '5.511',
    },
    {
      day: 'mon', pair: 2, week: 'both', groups: ['it-1-23', 'it-2-23'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Методы и системы искусственного интеллекта',
      teacher: 'Иванов', room: '5.507',
    },
    {
      day: 'mon', pair: 2, week: 'both', groups: ['it-1-24'],
      type: 'lab', typeLabel: 'лаб.', subject: 'Организация баз данных и знаний',
      teacher: 'Шилин', room: '5.210',
    },
    {
      day: 'mon', pair: 2, week: 'both', groups: ['bs-24'],
      type: 'practice', typeLabel: 'пр.', subject: 'Социальное взаимодействие в профессиональной деятельности',
      teacher: 'Асаулюк', room: '5.207',
    },
    {
      day: 'mon', pair: 3, week: 'even', groups: ['ib-1-24'],
      type: 'lab', typeLabel: 'лаб+коп.', subject: 'Компьютерные сети',
      teacher: 'Туровник', room: '5.210',
    },
    {
      day: 'mon', pair: 3, week: 'odd', groups: ['bs-24'],
      type: 'lab', typeLabel: 'лаб+коп.', subject: 'Компьютерные сети',
      teacher: 'Туровник', room: '5.210',
    },
    {
      day: 'mon', pair: 3, week: 'odd', groups: ['ib-1-24', 'ib-2-24'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Организация баз данных и знаний',
      teacher: 'Иванов', room: '5.222',
    },
    {
      day: 'mon', pair: 3, week: 'both', groups: ['it-1-24', 'it-2-24'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Администрирование компьютерных систем',
      teacher: 'Ялына', room: '5.511',
    },
    {
      day: 'mon', pair: 4, week: 'even', groups: ['it-1-24', 'it-2-24'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Организация баз данных и знаний',
      teacher: 'Иванов', room: '5.222',
    },
    {
      day: 'mon', pair: 4, week: 'odd', groups: ['bs-24'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Организация баз данных и знаний',
      teacher: 'Иванов', room: '5.222',
    },
    {
      day: 'mon', pair: 4, week: 'both', groups: ['it-2-23'],
      type: 'practice', typeLabel: 'Пр+коп.', subject: 'Методы и системы искусственного интеллекта',
      teacher: 'Туровник', room: '5.214',
    },
    {
      day: 'mon', pair: 4, week: 'both', groups: ['ib-2-24'],
      type: 'practice', typeLabel: 'пр.', subject: 'Социальное взаимодействие в профессиональной деятельности',
      teacher: 'Асаулюк', room: '5.207',
    },
    {
      day: 'mon', pair: 4, week: 'both', groups: ['ib-1-23'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Теория принятия решений',
      teacher: 'Носовская', room: '5.509',
    },
    {
      day: 'mon', pair: 5, week: 'even', groups: ['it-2-23'],
      type: 'practice', typeLabel: 'пр.', subject: 'Охрана труда и экология',
      teacher: 'Иващенко', room: '5.403',
    },
    {
      day: 'mon', pair: 5, week: 'odd', groups: ['it-1-24', 'it-2-24'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Компьютерная 3D графика',
      teacher: 'Миронова', room: '5.507',
    },
    {
      day: 'mon', pair: 5, week: 'both', groups: ['bs-24'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Дифференциальная геометрия и топология',
      teacher: 'Носовская', room: '5.511',
    },
    {
      day: 'mon', pair: 5, week: 'both', groups: ['ib-2-24'],
      type: 'practice', typeLabel: 'Пр+коп.', subject: 'Основы информационной безопасности',
      teacher: 'Иванов', room: '5.222',
    },
    {
      day: 'tue', pair: 1, week: 'both', groups: ['it-1-24'],
      type: 'lab', typeLabel: 'лаб.', subject: 'Компьютерная 3D графика',
      teacher: 'Туровник', room: '5.210',
    },
    {
      day: 'tue', pair: 2, week: 'even', groups: ['it-1-23'],
      type: 'practice', typeLabel: 'пр.', subject: 'Охрана труда и экология',
      teacher: 'Иващенко', room: '5.511',
    },
    {
      day: 'tue', pair: 2, week: 'odd', groups: ['it-1-23', 'it-2-23'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Охрана труда и экология',
      teacher: 'Иващенко', room: '5.511',
    },
    {
      day: 'tue', pair: 2, week: 'both', groups: ['ib-1-24'],
      type: 'lab', typeLabel: 'коп.', subject: 'Криптографические методы защиты информации',
      teacher: 'Иванов', room: '5.222',
    },
    {
      day: 'tue', pair: 2, week: 'both', groups: ['it-1-24', 'it-2-24'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Математические методы исследования операций',
      teacher: 'Малинов', room: '5.509',
    },
    {
      day: 'tue', pair: 2, week: 'both', groups: ['ib-1-23'],
      type: 'practice', typeLabel: 'Пр+коп.', subject: 'Теория принятия решений',
      teacher: 'Носовская', room: '5.210',
    },
    {
      day: 'tue', pair: 3, week: 'even', groups: ['ib-1-23'],
      type: 'practice', typeLabel: 'пр.', subject: 'Экономика отрасли',
      teacher: 'Псарева', room: '9.201',
    },
    {
      day: 'tue', pair: 3, week: 'odd', groups: ['it-1-23', 'it-2-23', 'ib-1-23'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Экономика отрасли',
      teacher: 'Псарева', room: '9.201',
    },
    {
      day: 'tue', pair: 3, week: 'both', groups: ['it-1-24', 'it-2-24', 'ib-1-24', 'ib-2-24', 'bs-24'],
      type: 'pe', typeLabel: '', subject: 'Физическая культура',
      teacher: '', room: '',
    },
    {
      day: 'tue', pair: 4, week: 'both', groups: ['it-2-24'],
      type: 'lab', typeLabel: 'лаб.', subject: 'Организация баз данных и знаний',
      teacher: 'Шилин', room: '5.214',
    },
    {
      day: 'tue', pair: 4, week: 'both', groups: ['bs-24'],
      type: 'practice', typeLabel: 'Пр+коп.', subject: 'Основы информационной безопасности',
      teacher: 'Иванов', room: '5.222',
    },
    {
      day: 'tue', pair: 4, week: 'both', groups: ['ib-1-24', 'ib-2-24'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Основы информационной безопасности',
      teacher: 'Ялына', room: '5.507',
    },
    {
      day: 'tue', pair: 4, week: 'both', groups: ['it-1-23', 'it-2-23', 'ib-1-23'],
      type: 'pe', typeLabel: '', subject: 'Физическая культура',
      teacher: '', room: '',
    },
    {
      day: 'tue', pair: 5, week: 'both', groups: ['ib-2-24'],
      type: 'lab', typeLabel: 'коп.', subject: 'Криптографические методы защиты информации',
      teacher: 'Иванов', room: '5.222',
    },
    {
      day: 'tue', pair: 5, week: 'both', groups: ['it-1-24'],
      type: 'practice', typeLabel: 'пр.', subject: 'Социальное взаимодействие в профессиональной деятельности',
      teacher: 'Асаулюк', room: '5.206',
    },
    {
      day: 'tue', pair: 6, week: 'both', groups: ['ib-1-24'],
      type: 'practice', typeLabel: 'пр.', subject: 'Социальное взаимодействие в профессиональной деятельности',
      teacher: 'Асаулюк', room: '1А.404',
    },
    {
      day: 'wed', pair: 1, week: 'even', groups: ['it-2-23'],
      type: 'practice', typeLabel: 'пр.', subject: 'Экономика отрасли',
      teacher: 'Псарева', room: '9.209',
    },
    {
      day: 'wed', pair: 1, week: 'both', groups: ['it-2-24'],
      type: 'lab', typeLabel: 'лаб.', subject: 'Компьютерная 3D графика',
      teacher: 'Туровник', room: '5.210',
    },
    {
      day: 'wed', pair: 1, week: 'both', groups: ['ib-1-24'],
      type: 'practice', typeLabel: 'Пр+коп.', subject: 'Основы информационной безопасности',
      teacher: 'Иванов', room: '5.222',
    },
    {
      day: 'wed', pair: 2, week: 'even', groups: ['it-1-23'],
      type: 'lab', typeLabel: 'лаб+коп.', subject: 'Технологии создания программных продуктов',
      teacher: 'Полищук', room: '5.214',
    },
    {
      day: 'wed', pair: 2, week: 'odd', groups: ['it-2-23'],
      type: 'lab', typeLabel: 'лаб+коп.', subject: 'Технологии создания программных продуктов',
      teacher: 'Полищук', room: '5.214',
    },
    {
      day: 'wed', pair: 2, week: 'odd', groups: ['it-1-23'],
      type: 'practice', typeLabel: 'пр.', subject: 'Экономика отрасли',
      teacher: 'Псарева', room: '9.209',
    },
    {
      day: 'wed', pair: 2, week: 'both', groups: ['ib-1-23'],
      type: 'practice', typeLabel: 'Пр+коп.', subject: 'Методы и системы искусственного интеллекта',
      teacher: 'Туровник', room: '5.210',
    },
    {
      day: 'wed', pair: 2, week: 'both', groups: ['ib-1-24', 'ib-2-24'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Программно-аппаратные средства защиты информации',
      teacher: 'Лаврова', room: '5.206',
    },
    {
      day: 'wed', pair: 3, week: 'even', groups: ['it-1-24'],
      type: 'lab', typeLabel: 'лаб+коп.', subject: 'Компьютерные сети',
      teacher: 'Туровник', room: '5.210',
    },
    {
      day: 'wed', pair: 3, week: 'even', groups: ['it-2-24'],
      type: 'coursework', typeLabel: 'Курсовой проект', subject: 'Моделирование систем',
      teacher: 'Полищук', room: '5.507',
    },
    {
      day: 'wed', pair: 3, week: 'even', groups: ['it-1-23'],
      type: 'practice', typeLabel: 'пр.', subject: 'Охрана труда и экология',
      teacher: 'Иващенко', room: '5.511',
    },
    {
      day: 'wed', pair: 3, week: 'even', groups: ['bs-24'],
      type: 'coursework', typeLabel: 'Курсовая', subject: 'Элементы технологии разработки систем управления беспилотными аппаратами',
      teacher: 'Иванов', room: '5.507',
    },
    {
      day: 'wed', pair: 3, week: 'odd', groups: ['it-2-24'],
      type: 'lab', typeLabel: 'лаб+коп.', subject: 'Компьютерные сети',
      teacher: 'Туровник', room: '5.210',
    },
    {
      day: 'wed', pair: 3, week: 'odd', groups: ['it-1-24'],
      type: 'coursework', typeLabel: 'Курсовой проект', subject: 'Моделирование систем',
      teacher: 'Полищук', room: '5.507',
    },
    {
      day: 'wed', pair: 3, week: 'odd', groups: ['it-2-23'],
      type: 'practice', typeLabel: 'пр.', subject: 'Охрана труда и экология',
      teacher: 'Иващенко', room: '5.511',
    },
    {
      day: 'wed', pair: 3, week: 'odd', groups: ['bs-24'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Элементы технологии разработки систем управления беспилотными аппаратами',
      teacher: 'Иванов', room: '5.222',
    },
    {
      day: 'wed', pair: 3, week: 'both', groups: ['ib-1-24', 'ib-2-24'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Математические методы исследования операций',
      teacher: 'Малинов', room: '5.206',
    },
    {
      day: 'wed', pair: 4, week: 'both', groups: ['ib-1-23'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Методы и системы искусственного интеллекта',
      teacher: 'Иванов', room: '5.222',
    },
    {
      day: 'wed', pair: 4, week: 'both', groups: ['ib-2-24'],
      type: 'lab', typeLabel: 'лаб.', subject: 'Организация баз данных и знаний',
      teacher: 'Шилин', room: '5.214',
    },
    {
      day: 'wed', pair: 4, week: 'both', groups: ['bs-24'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Основы информационной безопасности',
      teacher: 'Ялына', room: '5.509',
    },
    {
      day: 'wed', pair: 4, week: 'both', groups: ['it-2-24'],
      type: 'practice', typeLabel: 'пр.', subject: 'Социальное взаимодействие в профессиональной деятельности',
      teacher: 'Асаулюк', room: '1А.404',
    },
    {
      day: 'wed', pair: 5, week: 'both', groups: ['bs-24'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Компьютерные сети',
      teacher: 'Ялына', room: '5.509',
    },
    {
      day: 'thu', pair: 1, week: 'even', groups: ['it-1-24', 'ib-1-24'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Социальное взаимодействие в профессиональной деятельности',
      teacher: 'Асаулюк', room: '5.206',
    },
    {
      day: 'thu', pair: 2, week: 'even', groups: ['ib-2-24'],
      type: 'lab', typeLabel: 'лаб.', subject: 'Математические методы исследования операций',
      teacher: 'Туровник', room: '5.210',
    },
    {
      day: 'thu', pair: 2, week: 'both', groups: ['it-1-23', 'it-2-23'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Математическая статистика',
      teacher: 'Деревянко', room: '5.206',
    },
    {
      day: 'thu', pair: 2, week: 'both', groups: ['ib-1-24'],
      type: 'lab', typeLabel: 'лаб.', subject: 'Организация баз данных и знаний',
      teacher: 'Шилин', room: '5.214',
    },
    {
      day: 'thu', pair: 3, week: 'even', groups: ['it-2-23'],
      type: 'practice', typeLabel: 'пр.', subject: 'Математическая статистика',
      teacher: 'Деревянко', room: '5.214',
    },
    {
      day: 'thu', pair: 3, week: 'even', groups: ['it-1-24'],
      type: 'lab', typeLabel: 'лаб.', subject: 'Математические методы исследования операций',
      teacher: 'Туровник', room: '5.403',
    },
    {
      day: 'thu', pair: 3, week: 'even', groups: ['ib-1-24', 'ib-2-24'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Основы информационной безопасности',
      teacher: 'Ялына', room: '5.511',
    },
    {
      day: 'thu', pair: 3, week: 'odd', groups: ['it-1-24'],
      type: 'lab', typeLabel: 'лаб+коп.', subject: 'Администрирование компьютерных систем',
      teacher: 'Ялына', room: '5.210',
    },
    {
      day: 'thu', pair: 3, week: 'odd', groups: ['it-1-23'],
      type: 'practice', typeLabel: 'пр.', subject: 'Математическая статистика',
      teacher: 'Деревянко', room: '5.214',
    },
    {
      day: 'thu', pair: 3, week: 'odd', groups: ['ib-1-24'],
      type: 'lab', typeLabel: 'лаб.', subject: 'Математические методы исследования операций',
      teacher: 'Туровник', room: '5.403',
    },
    {
      day: 'thu', pair: 3, week: 'both', groups: ['bs-24'],
      type: 'practice', typeLabel: 'пр.', subject: 'Дифференциальная геометрия и топология',
      teacher: 'Цыс', room: '5.206',
    },
    {
      day: 'thu', pair: 4, week: 'even', groups: ['it-1-23', 'it-2-23', 'ib-1-23'],
      type: 'practice', typeLabel: 'пр.', subject: 'Основы военной подготовки',
      teacher: 'Цараков', room: '1А.417',
    },
    {
      day: 'thu', pair: 4, week: 'odd', groups: ['it-1-23', 'it-2-23', 'ib-1-23'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Основы военной подготовки',
      teacher: 'Цараков', room: '1А.417',
    },
    {
      day: 'thu', pair: 4, week: 'both', groups: ['ib-1-24', 'ib-2-24'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Компьютерные сети',
      teacher: 'Ялына', room: '5.507',
    },
    {
      day: 'thu', pair: 4, week: 'both', groups: ['bs-24'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Основы эксплуатации беспилотных систем',
      teacher: 'Иванов', room: '5.222',
    },
    {
      day: 'thu', pair: 5, week: 'even', groups: ['it-2-24'],
      type: 'lab', typeLabel: 'лаб+коп.', subject: 'Администрирование компьютерных систем',
      teacher: 'Ялына', room: '5.214',
    },
    {
      day: 'thu', pair: 5, week: 'even', groups: ['ib-2-24'],
      type: 'lab', typeLabel: 'лаб.', subject: 'Криптографические методы защиты информации',
      teacher: 'Цыс', room: '5.522',
    },
    {
      day: 'thu', pair: 5, week: 'odd', groups: ['it-2-24', 'ib-2-24', 'bs-24'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Социальное взаимодействие в профессиональной деятельности',
      teacher: 'Асаулюк', room: '5.511',
    },
    {
      day: 'fri', pair: 1, week: 'odd', groups: ['ib-2-24'],
      type: 'lab', typeLabel: 'лаб+коп.', subject: 'Компьютерные сети',
      teacher: 'Туровник', room: '5.210',
    },
    {
      day: 'fri', pair: 2, week: 'both', groups: ['ib-1-23'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Проектирование информационных систем',
      teacher: 'Иванов', room: '5.222',
    },
    {
      day: 'fri', pair: 2, week: 'both', groups: ['it-1-23', 'it-2-23'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Теория принятия решений',
      teacher: 'Носовская', room: '5.206',
    },
    {
      day: 'fri', pair: 3, week: 'both', groups: ['it-1-24', 'it-2-24'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Моделирование систем',
      teacher: 'Полищук', room: '5.509',
    },
    {
      day: 'fri', pair: 3, week: 'both', groups: ['ib-2-24'],
      type: 'coursework', typeLabel: 'Курсовая', subject: 'Основы информационной безопасности',
      teacher: 'Ялына', room: '5.401',
    },
    {
      day: 'fri', pair: 3, week: 'both', groups: ['ib-1-24'],
      type: 'lab', typeLabel: 'лаб+коп.', subject: 'Программно-аппаратные средства защиты информации',
      teacher: 'Иванов', room: '5.222',
    },
    {
      day: 'fri', pair: 3, week: 'both', groups: ['ib-1-23'],
      type: 'lab', typeLabel: 'лаб+коп.', subject: 'Проектирование информационных систем',
      teacher: 'Туровник', room: '5.214',
    },
    {
      day: 'fri', pair: 3, week: 'both', groups: ['it-1-23'],
      type: 'practice', typeLabel: 'Пр+коп.', subject: 'Теория принятия решений',
      teacher: 'Носовская', room: '5.206',
    },
    {
      day: 'fri', pair: 4, week: 'even', groups: ['it-1-24'],
      type: 'lab', typeLabel: 'лаб+коп.', subject: 'Моделирование систем',
      teacher: 'Полищук', room: '5.210',
    },
    {
      day: 'fri', pair: 4, week: 'odd', groups: ['it-2-24'],
      type: 'lab', typeLabel: 'лаб+коп.', subject: 'Моделирование систем',
      teacher: 'Полищук', room: '5.210',
    },
    {
      day: 'fri', pair: 4, week: 'both', groups: ['it-1-23'],
      type: 'practice', typeLabel: 'Пр+коп.', subject: 'Методы и системы искусственного интеллекта',
      teacher: 'Туровник', room: '5.216',
    },
    {
      day: 'fri', pair: 4, week: 'both', groups: ['ib-1-24'],
      type: 'coursework', typeLabel: 'Курсовая', subject: 'Основы информационной безопасности',
      teacher: 'Ялына', room: '5.507',
    },
    {
      day: 'fri', pair: 4, week: 'both', groups: ['bs-24'],
      type: 'practice', typeLabel: 'пр.', subject: 'Основы эксплуатации беспилотных систем',
      teacher: 'Иванов', room: '5.222',
    },
    {
      day: 'fri', pair: 4, week: 'both', groups: ['it-2-23'],
      type: 'practice', typeLabel: 'Пр+коп.', subject: 'Теория принятия решений',
      teacher: 'Носовская', room: '5.207',
    },
    {
      day: 'fri', pair: 5, week: 'both', groups: ['it-1-24', 'it-2-24'],
      type: 'lecture', typeLabel: 'Лек.', subject: 'Компьютерные сети',
      teacher: 'Ялына', room: '5.507',
    },
    {
      day: 'fri', pair: 5, week: 'both', groups: ['ib-2-24'],
      type: 'lab', typeLabel: 'лаб+коп.', subject: 'Программно-аппаратные средства защиты информации',
      teacher: 'Иванов', room: '5.222',
    },
    {
      day: 'fri', pair: 5, week: 'both', groups: ['bs-24'],
      type: 'lab', typeLabel: 'лаб+коп.', subject: 'Элементы технологии разработки систем управления беспилотными аппаратами',
      teacher: 'Полищук', room: '5.210',
    },
  ],
};
