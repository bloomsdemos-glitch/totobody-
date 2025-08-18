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
  function finishWorkout() { /* ... */ }
  function confirmExitTraining() { /* ... */ }
  function startWorkout(programName) { /* ... */ }
  function _actuallyStartWorkout(programName) { /* ... */ }

  // ===== Обробники Подій =====
  if (pauseBtn) pauseBtn.addEventListener('click', () => { if (!isStarted) return; isPaused = !isPaused; updateUI(); });
  if (stopBtn) stopBtn.addEventListener('click', confirmExitTraining);
  if (trainingBackBtn) trainingBackBtn.addEventListener('click', confirmExitTraining);
  if (nextBtn) nextBtn.addEventListener('click', () => { if (!isStarted || currentIndex >= exercises.length - 1) return; currentIndex++; remainingTime = exercises[currentIndex].duration || 30; updateUI(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { if (!isStarted || currentIndex <= 0) return; currentIndex--; remainingTime = exercises[currentIndex].duration || 30; updateUI(); });

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
      if (programName) { setTimeout(() => { openWorkoutModal(programName); }, 150); }
    });
  });

  if(closeModalBtn) closeModalBtn.addEventListener('click', () => { workoutModal.classList.remove('active'); });
  if(workoutModal) workoutModal.addEventListener('click', (event) => { if (event.target === workoutModal) { workoutModal.classList.remove('active'); } });
  if(modalSettingsBtn) modalSettingsBtn.addEventListener('click', () => { alert('Тут буде вікно налаштувань!'); });
  
  // ===== ЛОГІКА НАЛАШТУВАНЬ ДОДАТКУ =====
  function applyBackground(url) { /* ... */ }
  if (saveBgBtn) { /* ... */ }
  if (resetBgBtn) { /* ... */ }
  const savedBg = localStorage.getItem('customBackground');
  if (savedBg) { /* ... */ }
  
  // ===== ЛОГІКА НАЛАШТУВАНЬ ТРЕНУВАНЬ =====
  let workoutPrograms = {}; 
  let currentlyEditing = null; 

  function loadPrograms() {
    const savedPrograms = localStorage.getItem('workoutPrograms');
    if (savedPrograms) {
      workoutPrograms = JSON.parse(savedPrograms);
    } else {
      workoutPrograms = {
        "HIIT BASIC": { exercises: [{name: "Стрибки джек", duration: 30}, {name: "Берпі", duration: 30}] }, 
        "HIIT ULTRA": { exercises: [] }, "HIIT PRO": { exercises: [] },
        "MIXED BASIC": { exercises: [] }, "DUMBBELL": { exercises: [] }, "BODYWEIGHT": { exercises: [] }
      };
    }
  }
  function savePrograms() {
    localStorage.setItem('workoutPrograms', JSON.stringify(workoutPrograms));
  }
  function renderProgramList() {
    if (!programListEl) return;
    programListEl.innerHTML = '';
    for (const programName in workoutPrograms) {
        const li = document.createElement('li');
        li.className = 'program-list-item';
        li.dataset.programName = programName;
        li.innerHTML = `<span>${programName}</span><span class="arrow">></span>`;
        li.addEventListener('click', () => { openProgramEditor(programName); });
        programListEl.appendChild(li);
    }
  }
  function renderExerciseList(programName) {
    if (!exerciseListEl) return;
    const program = workoutPrograms[programName];
    exerciseListEl.innerHTML = '';
    if (program && program.exercises.length > 0) {
        program.exercises.forEach((exercise, index) => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${exercise.name} (${exercise.duration}с)</span>`;
            exerciseListEl.appendChild(li);
        });
    } else {
        exerciseListEl.innerHTML = '<li>(Вправ ще немає)</li>';
    }
  }
  function openProgramEditor(programName) {
    currentlyEditing = programName;
    workoutSettingsMenu.classList.remove('active');
    programEditMenu.classList.add('active');
    menuTitle.textContent = `Редагування`;
    programNameInput.value = programName;
    renderExerciseList(programName);
  }
  if (addNewProgramBtn) { /* ... */ }
  if (saveNewProgramBtn) { /* ... */ }
  if (saveProgramBtn) { /* ... */ }
  if (deleteProgramBtn) { /* ... */ }

  if (addExerciseBtn) {
      addExerciseBtn.addEventListener('click', () => {
          exerciseModalTitle.textContent = "Нова вправа";
          exerciseNameInput.value = '';
          exerciseDurationInput.value = 30;
          exerciseModal.classList.add('active');
      });
  }
  if (saveExerciseBtn) {
      saveExerciseBtn.addEventListener('click', () => {
          const name = exerciseNameInput.value.trim();
          const duration = parseInt(exerciseDurationInput.value, 10);
          if (name && duration > 0 && currentlyEditing) {
              workoutPrograms[currentlyEditing].exercises.push({ name, duration });
              savePrograms();
              renderExerciseList(currentlyEditing);
              exerciseModal.classList.remove('active');
          } else {
              alert('Будь ласка, введи коректну назву та тривалість.');
          }
      });
  }
  if (closeExerciseModalBtn) {
      closeExerciseModalBtn.addEventListener('click', () => {
          exerciseModal.classList.remove('active');
      });
  }
  
  loadPrograms(); 
  renderProgramList();
  
  // ===== ЛОГІКА БОКОВОГО МЕНЮ =====
  if (burgerBtn && sideMenu && mainMenu && menuBackBtn && menuTitle) { /* ... */ }

  showScreen('homeScreen');
});
