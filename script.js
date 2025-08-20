document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('touchstart', () => {}, {passive: true});

  // --- DOM-елементи ---
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
  const datetimeDisplayEl = document.getElementById('datetime-display');
  const trainingScreen = document.getElementById('trainingScreen');
  const trainingBackBtn = document.getElementById('trainingBackBtn');
  const muteBtn = document.getElementById('muteBtn'); // НОВА КНОПКА
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
  const addProgramMenu = document.getElementById('addProgramMenu');
  const appSettingsMenu = document.getElementById('appSettingsMenu');
  const bgUrlInput = document.getElementById('bgUrlInput');
  const saveBgBtn = document.getElementById('saveBgBtn');
  const resetBgBtn = document.getElementById('resetBgBtn');
  const programListEl = document.getElementById('program-list');
  const addNewProgramBtn = document.getElementById('addNewProgramBtn');
  const newProgramNameInput = document.getElementById('newProgramNameInput');
  const saveNewProgramBtn = document.getElementById('saveNewProgramBtn');
  const programEditMenu = document.getElementById('programEditMenu');
  const programNameInput = document.getElementById('programNameInput');
  const exerciseListEl = document.getElementById('exercise-list');
  const addExerciseBtn = document.getElementById('addExerciseBtn');
  const saveProgramBtn = document.getElementById('saveProgramBtn');
  const deleteProgramBtn = document.getElementById('deleteProgramBtn');
  const exerciseModal = document.getElementById('exerciseModal');
  const exerciseModalTitle = document.getElementById('exerciseModalTitle');
  const exerciseNameInput = document.getElementById('exerciseNameInput');
  const exerciseDurationInput = document.getElementById('exerciseDurationInput');
  const exerciseAudioInput = document.getElementById('exerciseAudioInput');
  const saveExerciseBtn = document.getElementById('saveExerciseBtn');
  const closeExerciseModalBtn = exerciseModal.querySelector('.close-button');
  const finishModal = document.getElementById('finishModal');
  const caloriesInput = document.getElementById('caloriesInput');
  const difficultySlider = document.getElementById('difficultySlider');
  const sliderEmojiBubble = document.getElementById('sliderEmojiBubble');
  const energyRating = document.getElementById('energyRating');
  const starRating = document.getElementById('starRating');
  const saveWorkoutLogBtn = document.getElementById('saveWorkoutLogBtn');
  const expandTagsBtn = document.getElementById('expandTagsBtn');
  const extraTagsSection = document.getElementById('extraTagsSection');

  let isMuted = false; // НОВА ЗМІННА СТАНУ

  // --- ФУНКЦІЇ-ПОМІЧНИКИ ДЛЯ ЧАСУ ---
  function parseTimeToSeconds(timeString) {
    if (!timeString || !timeString.includes(':')) {
      const seconds = parseInt(timeString, 10);
      return isNaN(seconds) ? 30 : seconds;
    }
    const parts = timeString.split(':');
    const minutes = parseInt(parts[0], 10) || 0;
    const seconds = parseInt(parts[1], 10) || 0;
    return (minutes * 60) + seconds;
  }

  function formatSecondsToTime(totalSeconds) {
    if (isNaN(totalSeconds) || totalSeconds < 0) {
      totalSeconds = 0;
    }
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  function showScreen(screenId) {
    screens.forEach(s => s.classList.remove('active'));
    const screenToShow = document.getElementById(screenId);
    if (screenToShow) screenToShow.classList.add('active');
    if (burgerBtn) {
      burgerBtn.style.display = (screenId === 'trainingScreen') ? 'none' : 'flex';
    }
  }

  if (datetimeDisplayEl) {
    function updateDateTime() {
      const now = new Date();
      const options = { hour: '2-digit', minute: '2-digit', weekday: 'long', day: 'numeric', month: 'long' };
      const formatter = new Intl.DateTimeFormat('uk-UA', options);
      const parts = formatter.formatToParts(now);
      const time = parts.find(p => p.type === 'hour').value + ':' + parts.find(p => p.type === 'minute').value;
      let weekday = parts.find(p => p.type === 'weekday').value;
      weekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
      const day = parts.find(p => p.type === 'day').value;
      const month = parts.find(p => p.type === 'month').value;
      datetimeDisplayEl.textContent = `${time} • ${weekday}, ${day} ${month}`;
    }
    updateDateTime();
    setInterval(updateDateTime, 1000);
  }

  let workoutPrograms = {};
  let currentlyEditingProgram = null;
  let currentlyEditingExerciseIndex = null;
  const poolHIIT = ['Берпі', 'Джамп-сквот', 'Спринт на місці', 'Альпініст', 'Планка', 'Стрибки джек'];
  const poolMIX = ['Присідання з гантелями', 'Тяга гантелей у нахилі', 'Жим гантелей лежачи'];
  const poolCommon = ['Віджимання', 'Планка', 'Стрибки на місці', 'Випади', 'Скручування'];

  function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }
  function buildWorkout(programName) {
    const programData = workoutPrograms[programName] || {};
    const exercises = programData.exercises || [];
    if (exercises.length > 0) {
      const workout = exercises.map(ex => ({ name: ex.name, duration: ex.duration || 30, audio: ex.audio }));
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
  
  function playCurrentExerciseSound() {
    if (isMuted) return; // ЯКЩО ЗВУК ВИМКНЕНО, НІЧОГО НЕ РОБИМО
    const currentExercise = exercises[currentIndex];
    if (currentExercise && currentExercise.audio) {
      const audioPath = `audio/${currentExercise.audio}`;
      const exerciseSound = new Audio(audioPath);
      exerciseSound.play().catch(error => console.error(`Помилка відтворення аудіо: ${audioPath}`, error));
    }
  }

  function updateUI() {
    const currentExercise = exercises[currentIndex];
    if (currentExercise) {
      trainingProgramNameEl.textContent = currentProgram;
      exerciseNameEl.textContent = currentExercise.name;
    }
    timerEl.textContent = formatSecondsToTime(remainingTime);
    pauseBtn.innerHTML = isPaused ? '<i class="bi bi-play-fill"></i>' : '<i class="bi bi-pause-fill"></i>';
    const completedHTML = exercises.slice(0, currentIndex).map(ex => `<div class="completed-exercise">${ex.name}</div>`).join('');
    completedListEl.innerHTML = completedHTML;
  }
  
  function tick() {
    if (isPaused) return;
    remainingTime--;
    if (remainingTime < 0) {
      if (currentIndex < exercises.length - 1) {
        currentIndex++;
        remainingTime = exercises[currentIndex].duration || 30;
        playCurrentExerciseSound();
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
    isStarted = false;
    isPaused = true;
    if (finishModal) {
      caloriesInput.value = '';
      difficultySlider.value = 3;
      updateSliderEmoji();
      starRating.querySelectorAll('span').forEach(s => s.classList.remove('active'));
      energyRating.querySelectorAll('span').forEach(e => e.classList.remove('active'));
      const defaultEnergy = energyRating.querySelector('[data-value="5"]');
      if (defaultEnergy) defaultEnergy.classList.add('active');
      if (extraTagsSection) {
        extraTagsSection.classList.remove('visible');
        extraTagsSection.querySelectorAll('.tags-rating span').forEach(tag => tag.classList.remove('active'));
      }
      finishModal.classList.add('active');
    } else {
      alert('Тренування завершено! 💪');
      showScreen('homeScreen');
    }
  }

  function confirmExitTraining() { if (!isStarted) { showScreen('homeScreen'); return; } if (confirm("Точно хочеш завершити тренування?")) { finishWorkout(); } }
  
  function startWorkout(programName) {
    let count = 3;
    countdownNumberEl.textContent = count;
    countdownScreen.classList.add('active');
    const countdownInterval = setInterval(() => {
      count--;
      if (count > 0) {
        countdownNumberEl.textContent = count;
      } else {
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
    remainingTime = exercises[0]?.duration || 30;
    isStarted = true;
    isPaused = false;
    updateUI();
    startTimer();
    playCurrentExerciseSound();
    showScreen('trainingScreen');
  }

  if (pauseBtn) pauseBtn.addEventListener('click', () => { if (!isStarted) return; isPaused = !isPaused; updateUI(); });
  if (stopBtn) stopBtn.addEventListener('click', confirmExitTraining);
  if (trainingBackBtn) trainingBackBtn.addEventListener('click', confirmExitTraining);
  if (nextBtn) nextBtn.addEventListener('click', () => { if (!isStarted || currentIndex >= exercises.length - 1) return; currentIndex++; remainingTime = exercises[currentIndex].duration || 30; updateUI(); playCurrentExerciseSound(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { if (!isStarted || currentIndex <= 0) return; currentIndex--; remainingTime = exercises[currentIndex].duration || 30; updateUI(); playCurrentExerciseSound(); });

  // --- НОВА ЛОГІКА ДЛЯ КНОПКИ MUTE ---
  function updateMuteButtonUI() {
    if (!muteBtn) return;
    muteBtn.innerHTML = isMuted ? '<i class="bi bi-volume-mute-fill"></i>' : '<i class="bi bi-volume-up-fill"></i>';
  }

  function saveMuteState() {
    localStorage.setItem('isMuted', isMuted);
  }

  function loadMuteState() {
    isMuted = localStorage.getItem('isMuted') === 'true';
  }
  
  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      saveMuteState();
      updateMuteButtonUI();
    });
  }


  function openWorkoutModal(programName) { /* ... без змін ... */ }
  workoutTiles.forEach(tile => { /* ... без змін ... */ });
  if (closeModalBtn) { /* ... без змін ... */ }
  if (workoutModal) { /* ... без змін ... */ }
  function applyBackground(url) { /* ... без змін ... */ }
  if (saveBgBtn) { /* ... без змін ... */ }
  if (resetBgBtn) { /* ... без змін ... */ }
  function loadPrograms() { /* ... без змін ... */ }
  function savePrograms() { /* ... без змін ... */ }
  function renderProgramList() { /* ... без змін ... */ }
  function renderExerciseList(programName) { /* ... без змін ... */ }
  function openProgramEditor(programName) { /* ... без змін ... */ }
  function openExerciseEditor(mode, programName, exerciseIndex = null) { /* ... без змін ... */ }
  if (addNewProgramBtn) { /* ... без змін ... */ }
  if (saveNewProgramBtn) { /* ... без змін ... */ }
  if (saveProgramBtn) { /* ... без змін ... */ }
  if (deleteProgramBtn) { /* ... без змін ... */ }
  if (addExerciseBtn) { /* ... без змін ... */ }
  if (saveExerciseBtn) { /* ... без змін ... */ }
  if (closeExerciseModalBtn) { /* ... без змін ... */ }
  const difficultyEmojis = ['😌', '🙂', '😮‍💨', '😵', '🥵', '💀'];
  const starEmojis = ['😟', '😕', '😐', '🙂', '🤩'];
  function updateSliderEmoji() { /* ... без змін ... */ }
  if (difficultySlider) { /* ... без змін ... */ }
  function setupEmojiRating(container) { /* ... без змін ... */ }
  setupEmojiRating(energyRating);
  if (starRating) { /* ... без змін ... */ }
  if (expandTagsBtn && extraTagsSection) { /* ... без змін ... */ }
  function collectAllTags() { /* ... без змін ... */ }
  if (saveWorkoutLogBtn) { /* ... без змін ... */ }
  if (burgerBtn && sideMenu && mainMenu && menuBackBtn && menuTitle) { /* ... без змін ... */ }
  
  // --- Ініціалізація ---
  loadMuteState(); // ЗАВАНТАЖУЄМО СТАН КНОПКИ MUTE
  updateMuteButtonUI(); // ОНОВЛЮЄМО ІКОНКУ
  const savedBg = localStorage.getItem('customBackground');
  if (savedBg) {
    applyBackground(savedBg);
    if (bgUrlInput) bgUrlInput.value = savedBg;
  }
  loadPrograms();
  renderProgramList();
  if (difficultySlider) { updateSliderEmoji(); }
  showScreen('homeScreen');
});
