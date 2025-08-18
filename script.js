document.addEventListener('DOMContentLoaded', () => {
  // ===== "ЧАРІВНИЙ" РЯДОК ДЛЯ SAFARI =====
  document.body.addEventListener('touchstart', () => {}, {passive: true});

  // ===== DOM елементи =====
  const screens = document.querySelectorAll('.screen');
  const workoutModal = document.getElementById('workoutModal');
  const modalProgramNameEl = document.getElementById('modalProgramName');
  const modalExerciseListEl = document.getElementById('modalExerciseList');
  const modalStartBtn = document.getElementById('modalStartBtn');
  const modalSettingsBtn = document.getElementById('modalSettingsBtn');
  const closeModalBtn = workoutModal.querySelector('.close-button');
  const workoutTiles = document.querySelectorAll('.neumorphic-tile[data-program]');
  const burgerBtn = document.getElementById('burgerBtn');
  const sideMenu = document.getElementById('sideMenu');
  const restDayBtn = document.getElementById('restDayBtn');
  const datetimeDisplayEl = document.getElementById('datetime-display');
  const trainingScreen = document.getElementById('trainingScreen');
  const trainingBackBtn = document.getElementById('trainingBackBtn');
  const trainingProgramNameEl = document.getElementById('trainingProgramName');
  const exerciseNameEl = document.getElementById('exerciseName');
  const timerEl = document.getElementById('timer');
  const prevBtn = document.getElementById('prevExercise');
  const pauseBtn = document.getElementById('pauseBtn');
  const stopBtn = document.getElementById('stopBtn');
  const nextBtn = document.getElementById('nextExercise');
  const completedListEl = document.getElementById('completedExercises');
  const countdownScreen = document.getElementById('countdownScreen');
  const countdownNumberEl = document.getElementById('countdownNumber');

  // ===== Навігація =====
  function showScreen(screenId) {
    screens.forEach(s => s.classList.remove('active'));
    const screenToShow = document.getElementById(screenId);
    if (screenToShow) {
      screenToShow.classList.add('active');
    }
    if (burgerBtn) {
      if (screenId === 'trainingScreen') {
        burgerBtn.style.display = 'none';
      } else {
        burgerBtn.style.display = 'flex'; // Використовуємо flex для сумісності з neumorphic-icon-btn
      }
    }
  }

  // ===== Дата і час =====
  if (datetimeDisplayEl) {
    function updateDateTime() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const days = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'Пʼятниця', 'Субота'];
      const dayOfWeek = days[now.getDay()];
      const months = ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'];
      const month = months[now.getMonth()];
      const dayOfMonth = now.getDate();
      datetimeDisplayEl.textContent = `${hours}:${minutes} • ${dayOfWeek}, ${dayOfMonth} ${month}`;
    }
    updateDateTime();
    setInterval(updateDateTime, 1000);
  }

  // ===== Логіка тренувань =====
  const poolHIIT = ['Берпі', 'Джамп-сквот', 'Спринт на місці', 'Альпініст', 'Планка', 'Стрибки джек'];
  const poolMIX = ['Присідання з гантелями','Тяга гантелей у нахилі','Жим гантелей лежачи'];
  const poolCommon = ['Віджимання','Планка','Стрибки на місці','Випади','Скручування'];
  
  function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

  function buildWorkout(program) {
    let basePool = poolCommon;
    if (program.startsWith('HIIT')) basePool = poolHIIT;
    if (program.startsWith('MIXED') || program === 'DUMBBELL') basePool = poolMIX;
    if (program === 'BODYWEIGHT') basePool = poolCommon;
    const workoutNames = shuffle([...new Set([...basePool, ...poolCommon])]).slice(0, 10);
    const workout = workoutNames.map(name => ({ name, duration: 30 }));
    workout.push({ name: 'Кінець тренування', duration: 3 });
    return workout;
  }

  let currentProgram = '';
  let exercises = [];
  let currentIndex = 0;
  let remainingTime = 0;
  let timerInterval = null;
  let isPaused = true;
  let isStarted = false;
  const DEFAULT_DURATION = 30;

  function formatTime(seconds) {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  function updateUI() {
    const currentExercise = exercises[currentIndex];
    if (currentExercise) {
        trainingProgramNameEl.textContent = currentProgram;
        exerciseNameEl.textContent = currentExercise.name;
    }
    timerEl.textContent = formatTime(remainingTime);
    pauseBtn.textContent = isPaused ? '▶️' : '⏸️';
    const completedHTML = exercises.slice(0, currentIndex).map(ex => `<div class="completed-exercise">${ex.name} ✓</div>`).join('');
    completedListEl.innerHTML = completedHTML;
  }

  function tick() {
    if (isPaused) return;
    remainingTime--;
    if (remainingTime < 0) {
        if (currentIndex < exercises.length - 1) {
            currentIndex++;
            remainingTime = exercises[currentIndex].duration || DEFAULT_DURATION;
        } else {
            finishWorkout();
            return;
        }
    }
    updateUI();
  }

  function startTimer() { clearInterval(timerInterval); timerInterval = setInterval(tick, 1000); }

  function finishWorkout() {
    clearInterval(timerInterval);
    isStarted = false; isPaused = true;
    alert('Тренування завершено! 💪');
    showScreen('homeScreen');
  }

  function confirmExitTraining() {
    if (!isStarted) { showScreen('homeScreen'); return; }
    if (confirm("Точно хочеш завершити тренування?")) { finishWorkout(); }
  }

  function startWorkout(programName) {
    let count = 3;
    countdownNumberEl.textContent = count;
    countdownScreen.classList.add('active');
    const countdownInterval = setInterval(() => {
      count--;
      if (count > 0) { countdownNumberEl.textContent = count; } 
      else {
        clearInterval(countdownInterval);
        countdownScreen.classList.remove('active');
        _actuallyStartWorkout(programName);
      }
    }, 1000);
  }

  function _actuallyStartWorkout(programName) {
    currentProgram = programName;
    exercises = buildWorkout(programName);
    currentIndex = 0;
    remainingTime = exercises[0]?.duration || DEFAULT_DURATION;
    isStarted = true; isPaused = false;
    updateUI();
    startTimer();
    showScreen('trainingScreen');
  }

  // ===== Обробники Подій =====
  if (pauseBtn) pauseBtn.addEventListener('click', () => { if (!isStarted) return; isPaused = !isPaused; updateUI(); });
  if (stopBtn) stopBtn.addEventListener('click', confirmExitTraining);
  if (trainingBackBtn) trainingBackBtn.addEventListener('click', confirmExitTraining);
  if (nextBtn) nextBtn.addEventListener('click', () => { if (!isStarted || currentIndex >= exercises.length - 1) return; currentIndex++; remainingTime = exercises[currentIndex].duration || DEFAULT_DURATION; updateUI(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { if (!isStarted || currentIndex <= 0) return; currentIndex--; remainingTime = exercises[currentIndex].duration || DEFAULT_DURATION; updateUI(); });

  function openWorkoutModal(programName) {
    const previewExercises = buildWorkout(programName);
    modalProgramNameEl.textContent = programName;
    modalExerciseListEl.innerHTML = '';
    previewExercises.forEach(ex => {
      if (ex.name !== 'Кінець тренування') {
        const li = document.createElement('li');
        li.textContent = ex.name;
        modalExerciseListEl.appendChild(li);
      }
    });
    workoutModal.classList.add('active');
    const startFunction = () => {
      workoutModal.classList.remove('active');
      startWorkout(programName);
      modalStartBtn.removeEventListener('click', startFunction);
    };
    modalStartBtn.addEventListener('click', startFunction);
  }

  workoutTiles.forEach(tile => {
    tile.addEventListener('click', () => {
      const programName = tile.dataset.program;
      if (programName) {
        openWorkoutModal(programName);
      }
    });
  });

  if(closeModalBtn) closeModalBtn.addEventListener('click', () => { workoutModal.classList.remove('active'); });
  if(workoutModal) workoutModal.addEventListener('click', (event) => { if (event.target === workoutModal) { workoutModal.classList.remove('active'); } });
  if(modalSettingsBtn) modalSettingsBtn.addEventListener('click', () => { alert('Тут буде вікно налаштувань!'); });
  
    // ===== ЛОГІКА НАЛАШТУВАНЬ ДОДАТКУ =====
  const bgUrlInput = document.getElementById('bgUrlInput');
  const saveBgBtn = document.getElementById('saveBgBtn');
  const resetBgBtn = document.getElementById('resetBgBtn');

  // Функція, яка застосовує фон
  function applyBackground(url) {
    document.body.style.backgroundImage = `url('${url}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
  }

  // Зберігаємо фон
  if (saveBgBtn) {
    saveBgBtn.addEventListener('click', () => {
      const bgUrl = bgUrlInput.value.trim();
      if (bgUrl) {
        localStorage.setItem('customBackground', bgUrl);
        applyBackground(bgUrl);
        alert('Фон збережено!');
      } else {
        alert('Будь ласка, встав посилання на картинку.');
      }
    });
  }

  // Скидаємо фон
  if (resetBgBtn) {
    resetBgBtn.addEventListener('click', () => {
      localStorage.removeItem('customBackground');
      document.body.style.backgroundImage = 'none';
      bgUrlInput.value = '';
      alert('Фон скинуто до стандартного.');
    });
  }

  // При завантаженні сторінки перевіряємо, чи є збережений фон
  const savedBg = localStorage.getItem('customBackground');
  if (savedBg) {
    applyBackground(savedBg);
    bgUrlInput.value = savedBg; // Показуємо збережений URL в полі
  }

  showScreen('homeScreen');
});
