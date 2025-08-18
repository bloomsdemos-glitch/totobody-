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
  const menuBackBtn = document.getElementById('menuBackBtn');
  const menuTitle = document.getElementById('menuTitle');
  const mainMenu = document.getElementById('mainMenu');
  const workoutSettingsMenu = document.getElementById('workoutSettingsMenu');
  const statsSettingsMenu = document.getElementById('statsSettingsMenu');
  const goalSettingsMenu = document.getElementById('goalSettingsMenu');
  const appSettingsMenu = document.getElementById('appSettingsMenu');
  const calendarMenu = document.getElementById('calendarMenu');
  const historyMenu = document.getElementById('historyMenu');
  const bgUrlInput = document.getElementById('bgUrlInput');
  const saveBgBtn = document.getElementById('saveBgBtn');
  const resetBgBtn = document.getElementById('resetBgBtn');
  const homeScreen = document.getElementById('homeScreen');
  // ВИПРАВЛЕНО: Додав відсутні елементи
  const programListEl = document.getElementById('program-list');
  const addNewProgramBtn = document.getElementById('addNewProgramBtn');
  const addProgramMenu = document.getElementById('addProgramMenu');
  const newProgramNameInput = document.getElementById('newProgramNameInput');
  const saveNewProgramBtn = document.getElementById('saveNewProgramBtn');
  const programEditMenu = document.getElementById('programEditMenu');
  const programNameInput = document.getElementById('programNameInput');
  const saveProgramBtn = document.getElementById('saveProgramBtn');
  const deleteProgramBtn = document.getElementById('deleteProgramBtn');

  // ===== Навігація =====
  function showScreen(screenId) {
    screens.forEach(s => s.classList.remove('active'));
    const screenToShow = document.getElementById(screenId);
    if (screenToShow) screenToShow.classList.add('active');
    if (burgerBtn) {
      if (screenId === 'trainingScreen') {
        burgerBtn.style.display = 'none';
      } else {
        burgerBtn.style.display = 'flex';
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

  // ===== Логіка тренувань (основна) =====
  const poolHIIT = ['Берпі', 'Джамп-сквот', 'Спринт на місці', 'Альпініст', 'Планка', 'Стрибки джек'];
  const poolMIX = ['Присідання з гантелями','Тяга гантелей у нахилі','Жим гантелей лежачи'];
  const poolCommon = ['Віджимання','Планка','Стрибки на місці','Випади','Скручування'];
  function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }
  function buildWorkout(programName) {
    const programData = workoutPrograms[programName] || {};
    const exercises = programData.exercises || [];
    if (exercises.length > 0) {
      // Якщо програма кастомна і має вправи, використовуємо їх
      const workout = exercises.map(ex => ({ name: ex.name, duration: ex.duration || 30 }));
      workout.push({ name: 'Кінець тренування', duration: 3 });
      return workout;
    } else {
      // Якщо програма стандартна або порожня, генеруємо рандомно
      let basePool = poolCommon;
      if (programName.startsWith('HIIT')) basePool = poolHIIT;
      if (programName.startsWith('MIXED') || programName === 'DUMBBELL') basePool = poolMIX;
      if (programName === 'BODYWEIGHT') basePool = poolCommon;
      const workoutNames = shuffle([...new Set([...basePool, ...poolCommon])]).slice(0, 10);
      const workout = workoutNames.map(name => ({ name, duration: 30 }));
      workout.push({ name: 'Кінець тренування', duration: 3 });
      return workout;
    }
  }

  let currentProgram = '', exercises = [], currentIndex = 0, remainingTime = 0, timerInterval = null, isPaused = true, isStarted = false;
  
  function formatTime(seconds) { /* ... без змін ... */ }
  function updateUI() { /* ... без змін ... */ }
  function tick() { /* ... без змін ... */ }
  function startTimer() { /* ... без змін ... */ }
  function finishWorkout() { /* ... без змін ... */ }
  function confirmExitTraining() { /* ... без змін ... */ }
  function startWorkout(programName) { /* ... без змін ... */ }
  function _actuallyStartWorkout(programName) { /* ... без змін ... */ }

  // ===== Обробники Подій (кнопки керування тренуванням) =====
  if (pauseBtn) pauseBtn.addEventListener('click', () => { if (!isStarted) return; isPaused = !isPaused; updateUI(); });
  // ... (решта обробників без змін)

  // ===== Логіка Модального Вікна =====
  function openWorkoutModal(programName) { /* ... без змін ... */ }
  workoutTiles.forEach(tile => { /* ... без змін ... */ });

  if(closeModalBtn) closeModalBtn.addEventListener('click', () => { workoutModal.classList.remove('active'); });
  if(workoutModal) workoutModal.addEventListener('click', (event) => { if (event.target === workoutModal) { workoutModal.classList.remove('active'); } });
  
  // ===== ЛОГІКА НАЛАШТУВАНЬ ДОДАТКУ (ФОН) =====
  function applyBackground(url) { /* ... без змін ... */ }
  // ... (обробники для saveBgBtn, resetBgBtn і завантаження фону без змін)

  // ===== ЛОГІКА НАЛАШТУВАНЬ ТРЕНУВАНЬ =====
  let workoutPrograms = {}; 
  let currentlyEditing = null; 

  function loadPrograms() { /* ... без змін ... */ }
  function savePrograms() { /* ... без змін ... */ }
  function renderProgramList() { /* ... без змін ... */ }
  function openProgramEditor(programName) { /* ... без змін ... */ }

  if (addNewProgramBtn) { /* ... без змін ... */ }
  if (saveNewProgramBtn) { /* ... без змін ... */ }
  if (saveProgramBtn) { /* ... без змін ... */ }
  if (deleteProgramBtn) { /* ... без змін ... */ }

  loadPrograms();
  renderProgramList();
  
  // ===== ЛОГІКА БОКОВОГО МЕНЮ =====
  if (burgerBtn && sideMenu && mainMenu && menuBackBtn && menuTitle) { /* ... без змін ... */ }

  // ===== Ініціалізація =====
  const savedBg = localStorage.getItem('customBackground');
  if (savedBg) {
    applyBackground(savedBg);
    if(bgUrlInput) bgUrlInput.value = savedBg;
  }
  showScreen('homeScreen');
});
