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
  // --- Menu screens ---
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
  // --- Workout Settings Elements ---
  const programListEl = document.getElementById('program-list');
  const addNewProgramBtn = document.getElementById('addNewProgramBtn');
  const addProgramMenu = document.getElementById('addProgramMenu');
  const newProgramNameInput = document.getElementById('newProgramNameInput');
  const saveNewProgramBtn = document.getElementById('saveNewProgramBtn');
  const programEditMenu = document.getElementById('programEditMenu');
  const programNameInput = document.getElementById('programNameInput');
  const exerciseListEl = document.getElementById('exercise-list');
  const addExerciseBtn = document.getElementById('addExerciseBtn');
  const saveProgramBtn = document.getElementById('saveProgramBtn');
  const deleteProgramBtn = document.getElementById('deleteProgramBtn');
  // --- Exercise Modal Elements ---
  const exerciseModal = document.getElementById('exerciseModal');
  const exerciseModalTitle = document.getElementById('exerciseModalTitle');
  const exerciseNameInput = document.getElementById('exerciseNameInput');
  const exerciseDurationInput = document.getElementById('exerciseDurationInput');
  const saveExerciseBtn = document.getElementById('saveExerciseBtn');
  const closeExerciseModalBtn = exerciseModal.querySelector('.close-button');
  // --- Finish Modal Elements ---
  const finishModal = document.getElementById('finishModal');
  const caloriesInput = document.getElementById('caloriesInput');
  const difficultySlider = document.getElementById('difficultySlider');
  const starRating = document.getElementById('starRating');
  const saveWorkoutLogBtn = document.getElementById('saveWorkoutLogBtn');

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
      const workout = exercises.map(ex => ({ name: ex.name, duration: ex.duration || 30 }));
      workout.push({ name: 'Кінець тренування', duration: 3 });
      return workout;
    } else {
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
  
  function formatTime(seconds) { /* ... */ }
  function updateUI() { /* ... */ }
  function tick() { /* ... */ }
  function startTimer() { /* ... */ }
  
  function finishWorkout() {
    clearInterval(timerInterval);
    isStarted = false;
    isPaused = true;
    if (finishModal) finishModal.classList.add('active');
    if (caloriesInput) caloriesInput.value = '';
    if (difficultySlider) difficultySlider.value = 3;
    if (starRating) {
      starRating.querySelectorAll('span').forEach(star => star.classList.remove('active'));
    }
  }

  function confirmExitTraining() { /* ... */ }
  function startWorkout(programName) { /* ... */ }
  function _actuallyStartWorkout(programName) { /* ... */ }

  // ===== Обробники Подій =====
  if (pauseBtn) { /* ... */ }
  if (stopBtn) { /* ... */ }
  if (trainingBackBtn) { /* ... */ }
  if (nextBtn) { /* ... */ }
  if (prevBtn) { /* ... */ }

  // ===== Логіка Модального Вікна =====
  function openWorkoutModal(programName) { /* ... */ }
  workoutTiles.forEach(tile => { /* ... */ });
  if(closeModalBtn) { /* ... */ }
  if(workoutModal) { /* ... */ }
  if(modalSettingsBtn) { /* ... */ }
  
  // ===== ЛОГІКА НАЛАШТУВАНЬ ДОДАТКУ (ФОН) =====
  function applyBackground(url) { /* ... */ }
  if (saveBgBtn) { /* ... */ }
  if (resetBgBtn) { /* ... */ }
  
  // ===== ЛОГІКА НАЛАШТУВАНЬ ТРЕНУВАНЬ =====
  let workoutPrograms = {}; 
  let currentlyEditing = null; 
  function loadPrograms() { /* ... */ }
  function savePrograms() { /* ... */ }
  function renderProgramList() { /* ... */ }
  function renderExerciseList(programName) { /* ... */ }
  function openProgramEditor(programName) { /* ... */ }
  if (addNewProgramBtn) { /* ... */ }
  if (saveNewProgramBtn) { /* ... */ }
  if (saveProgramBtn) { /* ... */ }
  if (deleteProgramBtn) { /* ... */ }
  if (addExerciseBtn) { /* ... */ }
  if (saveExerciseBtn) { /* ... */ }
  if (closeExerciseModalBtn) { /* ... */ }

  // ===== ЛОГІКА МОДАЛКИ ПІСЛЯ ТРЕНУВАННЯ =====
  if (starRating) {
    const stars = starRating.querySelectorAll('span');
    let currentRating = 0;
    stars.forEach(star => {
      star.addEventListener('click', () => {
        currentRating = star.dataset.value;
        stars.forEach(s => {
          s.classList.toggle('active', s.dataset.value <= currentRating);
        });
      });
    });
  }
  if (saveWorkoutLogBtn) {
    saveWorkoutLogBtn.addEventListener('click', () => {
      const calories = parseInt(caloriesInput.value, 10) || 0;
      const difficulty = parseInt(difficultySlider.value, 10);
      const rating = starRating.querySelectorAll('span.active').length;
      const workoutLog = {
        date: new Date().toISOString(),
        program: currentProgram,
        calories, difficulty, rating,
        exercises: exercises.slice(0, -1)
      };
      const history = JSON.parse(localStorage.getItem('workoutHistory')) || [];
      history.push(workoutLog);
      localStorage.setItem('workoutHistory', JSON.stringify(history));
      alert('Результат збережено! Красунчик!');
      finishModal.classList.remove('active');
      showScreen('homeScreen');
    });
  }
  
  // ===== ЛОГІКА БОКОВОГО МЕНЮ =====
  if (burgerBtn && sideMenu && mainMenu && menuBackBtn && menuTitle) { /* ... */ }
  
  // ===== Ініціалізація =====
  loadPrograms(); 
  renderProgramList();
  const savedBg = localStorage.getItem('customBackground');
  if (savedBg) { /* ... */ }
  showScreen('homeScreen');
});
