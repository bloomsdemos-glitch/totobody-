// TOTOBODY — узгоджений скрипт під останній HTML
document.addEventListener('DOMContentLoaded', () => {
  // ===== Навігація між екранами =====
  const screens = document.querySelectorAll('.screen');
  function showScreen(id) {
    screens.forEach(s => s.classList.remove('active'));
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
  }
  // зробимо доступним для кнопок із HTML (onclick="showScreen('...')")
  window.showScreen = showScreen;

  // ===== DOM елементи тренування =====
  const startHIITBtn = document.getElementById('startHIITBtn');
  const startMIXBtn  = document.getElementById('startMIXBtn');

  const exerciseNameEl = document.getElementById('exerciseName'); // заголовок (бігуча строка / просто текст)
  const timerEl         = document.getElementById('timer');
  const prevBtn         = document.getElementById('prevExercise');
  const pauseBtn        = document.getElementById('pauseBtn');
  const stopBtn         = document.getElementById('stopBtn');
  const nextBtn         = document.getElementById('nextExercise');
  const completedListEl = document.getElementById('completedExercises');

  const caloriesInput   = document.getElementById('caloriesInput');
  const saveCaloriesBtn = document.getElementById('saveCaloriesBtn');

  // ===== Пули вправ =====
  const poolCommon = [
    'Присідання','Віджимання','Планка','Берпі','Стрибки на місці','Випади',
    'Скручування','Махи гантелями','Підйоми ніг','Біг на місці','Гірка (mountain climbers)',
    'Планка з обертанням','Присідання з гантелями','Стільчик біля стіни',
    'Стрибки через скакалку','Джамп-сквот','Віджимання з колін','Супермен',
    'Російські скручування','Альпініст з паузою','Бічна планка','Гіперекстензія (лежачи)',
    'Ягодичний міст','Хіп-траст','Віджимання вузьким хватом'
  ];
  const poolHIIT = [
    'Берпі', 'Джамп-сквот', 'Спринт на місці', 'Альпініст', 'Планка',
    'Стрибки джек', 'Випади стрибком', 'Планка + коліно-лікоть', 'Скелелаз з паузою',
    'Хай-ніс (високі коліна)', 'Бокові стрибки', 'Скейт-степ', 'Велосипед', 'Бічна планка', 'Планка + дотик плеча'
  ];
  const poolMIX = [
    'Присідання з гантелями','Тяга гантелей у нахилі','Жим гантелей лежачи',
    'Махи гантелями в сторони','Ягодичний міст','Станова з гантелями',
    'Артеміс (корпус + ноги)','Бокові випади','Зведення на груди',
    'Пуловер з гантеллю','Молоткові згинання','Розгинання трицепсу',
    'Планка','Велосипед','Скручування'
  ];

  function shuffle(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
  }
  function buildWorkout(program) {
    const base = program === 'HIIT BASIC' ? poolHIIT
               : program === 'MIX BASIC'  ? poolMIX
               : poolCommon;
    const names = shuffle(base.concat(poolCommon)).slice(0, 15);
    // усі вправи поки по 30 сек (потім легко зробимо різні)
    return names.map(n => ({ name: n, duration: 30 }));
  }

  // ===== Стан тренування =====
  let currentProgram = '';
  let exercises = [];
  let idx = 0;
  let remaining = 0;
  let tmr = null;
  let paused = true;
  let started = false;
  const EX_DURATION_DEFAULT = 30;

  function fmt(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  function renderHeader() {
    exerciseNameEl.textContent = exercises[idx]?.name ?? '—';
    timerEl.textContent = fmt(remaining);
  }

  function pushCompletedName(name) {
    const row = document.createElement('div');
    row.className = 'done-row';
    row.textContent = `${name} ✅`;
    completedListEl.appendChild(row);
  }

  function popCompletedName() {
    if (completedListEl.lastChild) completedListEl.removeChild(completedListEl.lastChild);
  }

  function tick() {
    if (paused) return;
    if (remaining > 0) {
      remaining -= 1;
      timerEl.textContent = fmt(remaining);
      return;
    }
    // завершили поточну
    pushCompletedName(exercises[idx].name);
    if (idx < exercises.length - 1) {
      idx += 1;
      remaining = exercises[idx].duration ?? EX_DURATION_DEFAULT;
      renderHeader();
    } else {
      finishWorkout(); // все, кінець
    }
  }

  function startInterval() {
    clearInterval(tmr);
    tmr = setInterval(tick, 1000);
  }

  function goTraining(program) {
    currentProgram = program;
    exercises = buildWorkout(program);
    idx = 0;
    remaining = exercises[0]?.duration ?? EX_DURATION_DEFAULT;
    started = false;
    paused = true;
    completedListEl.innerHTML = '';
    renderHeader();
    showScreen('trainingScreen');

    // Показуємо кнопку Старт (динамічно), якщо її ще немає
    let startBtn = document.getElementById('dynamicStartBtn');
    if (!startBtn) {
      startBtn = document.createElement('button');
      startBtn.id = 'dynamicStartBtn';
      startBtn.textContent = 'Старт';
      // вставимо перед блоком controls
      const controls = document.querySelector('#trainingScreen .controls');
      controls.parentNode.insertBefore(startBtn, controls);
      startBtn.addEventListener('click', () => {
        started = true;
        paused = false;
        startInterval();
        startBtn.remove(); // сховати старт
        pauseBtn.textContent = '⏸️';
      });
    }
  }

  function finishWorkout() {
    clearInterval(tmr);
    paused = true;
    started = false;
    // Перейдемо на екран завершення
    showScreen('finishScreen');
    // очистимо інпут
    if (caloriesInput) caloriesInput.value = '';
  }

  // ===== Обробники керування під час тренування =====
  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      if (!started) return; // поки не стартанули — нічого
      paused = !paused;
      pauseBtn.textContent = paused ? '▶️' : '⏸️';
      if (!paused) startInterval();
    });
  }

  if (stopBtn) {
    stopBtn.addEventListener('click', () => {
      if (!started) { showScreen('workoutsScreen'); return; }
      finishWorkout();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (!exercises.length) return;
      // відмічаємо поточну як виконану (якщо ще не в кінці)
      pushCompletedName(exercises[idx].name);
      if (idx < exercises.length - 1) {
        idx += 1;
        remaining = exercises[idx].duration ?? EX_DURATION_DEFAULT;
        renderHeader();
      } else {
        finishWorkout();
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (idx > 0) {
        idx -= 1;
        popCompletedName(); // прибрати останню «виконану»
        remaining = exercises[idx].duration ?? EX_DURATION_DEFAULT;
        renderHeader();
      }
    });
  }

  // ===== Збереження калорій (мінімальна логіка + localStorage) =====
  if (saveCaloriesBtn) {
    saveCaloriesBtn.addEventListener('click', () => {
      const kcal = Number(caloriesInput?.value || 0);
      const dayKey = new Date().toISOString().slice(0,10); // YYYY-MM-DD
      const rec = JSON.parse(localStorage.getItem('tb_stats') || '{}');
      if (!rec[dayKey]) rec[dayKey] = { calories: 0, sessions: [] };
      rec[dayKey].calories += kcal;
      rec[dayKey].sessions.push({ program: currentProgram, done: true, count: exercises.length });
      localStorage.setItem('tb_stats', JSON.stringify(rec));
      alert(`Збережено: ${kcal} ккал. Красунчик 💪`);
      showScreen('homeScreen');
    });
  }

  // ===== Кнопки запуску тренувань зі списку =====
  if (startHIITBtn) startHIITBtn.addEventListener('click', () => goTraining('HIIT BASIC'));
  if (startMIXBtn)  startMIXBtn.addEventListener('click', () => goTraining('MIX BASIC'));

  // Стартовий екран
  showScreen('homeScreen');
});