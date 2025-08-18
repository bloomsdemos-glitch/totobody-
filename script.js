document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('touchstart', () => {}, {passive: true});

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
  const programListEl = document.getElementById('program-list');
  const addNewProgramBtn = document.getElementById('addNewProgramBtn');
  const addProgramMenu = document.getElementById('addProgramMenu');
  const newProgramNameInput = document.getElementById('newProgramNameInput');
  const saveNewProgramBtn = document.getElementById('saveNewProgramBtn');
  const programEditMenu = document.getElementById('programEditMenu');
  const programNameInput = document.getElementById('programNameInput');
  const saveProgramBtn = document.getElementById('saveProgramBtn');
  const deleteProgramBtn = document.getElementById('deleteProgramBtn');

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
  
  function formatTime(seconds) { const m = String(Math.floor(seconds / 60)).padStart(2, '0'); const s = String(seconds % 60).padStart(2, '0'); return `${m}:${s}`; }
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
            remainingTime = exercises[currentIndex].duration || 30;
        } else { finishWorkout(); return; }
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
    remainingTime = exercises[0]?.duration || 30;
    isStarted = true; isPaused = false;
    updateUI();
    startTimer();
    showScreen('trainingScreen');
  }

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
  
  function applyBackground(url) {
    document.body.style.backgroundImage = `url('${url}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
  }
  if (saveBgBtn) {
    saveBgBtn.addEventListener('click', () => {
      const bgUrl = bgUrlInput.value.trim();
      if (bgUrl) {
        localStorage.setItem('customBackground', bgUrl);
        applyBackground(bgUrl);
        alert('Фон збережено!');
      } else { alert('Будь ласка, встав посилання на картинку.'); }
    });
  }
  if (resetBgBtn) {
    resetBgBtn.addEventListener('click', () => {
      localStorage.removeItem('customBackground');
      document.body.style.backgroundImage = 'none';
      if(bgUrlInput) bgUrlInput.value = '';
      alert('Фон скинуто до стандартного.');
    });
  }
  
  let workoutPrograms = {}; 
  let currentlyEditing = null; 
  function loadPrograms() { const savedPrograms = localStorage.getItem('workoutPrograms'); if (savedPrograms) { workoutPrograms = JSON.parse(savedPrograms); } else { workoutPrograms = { "HIIT BASIC": { exercises: [] }, "HIIT ULTRA": { exercises: [] }, "HIIT PRO": { exercises: [] }, "MIXED BASIC": { exercises: [] }, "DUMBBELL": { exercises: [] }, "BODYWEIGHT": { exercises: [] } }; } }
  function savePrograms() { localStorage.setItem('workoutPrograms', JSON.stringify(workoutPrograms)); }
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
  function openProgramEditor(programName) {
    currentlyEditing = programName;
    workoutSettingsMenu.classList.remove('active');
    programEditMenu.classList.add('active');
    menuTitle.textContent = `Редагування`;
    programNameInput.value = programName;
  }
  if (addNewProgramBtn) {
    addNewProgramBtn.addEventListener('click', () => {
      workoutSettingsMenu.classList.remove('active');
      addProgramMenu.classList.add('active');
      menuTitle.textContent = 'Нова програма';
      menuBackBtn.style.display = 'block';
    });
  }
  if (saveNewProgramBtn) {
      saveNewProgramBtn.addEventListener('click', () => {
          const newName = newProgramNameInput.value.trim();
          if (newName && !workoutPrograms[newName]) {
              workoutPrograms[newName] = { exercises: [] };
              savePrograms();
              renderProgramList();
              addProgramMenu.classList.remove('active');
              workoutSettingsMenu.classList.add('active');
              menuTitle.textContent = 'Налаштування тренувань';
              newProgramNameInput.value = '';
          } else { alert('Будь ласка, введи унікальну назву програми.'); }
      });
  }
  if (saveProgramBtn) {
    saveProgramBtn.addEventListener('click', () => {
      const newName = programNameInput.value.trim();
      if (newName && currentlyEditing) {
        if (newName !== currentlyEditing) {
          if (workoutPrograms[newName]) { alert('Програма з такою назвою вже існує!'); return; }
          workoutPrograms[newName] = workoutPrograms[currentlyEditing];
          delete workoutPrograms[currentlyEditing];
        }
        savePrograms();
        renderProgramList();
        alert(`Програму "${newName}" збережено!`);
        programEditMenu.classList.remove('active');
        workoutSettingsMenu.classList.add('active');
        menuTitle.textContent = 'Налаштування тренувань';
      }
    });
  }
  if (deleteProgramBtn) {
    deleteProgramBtn.addEventListener('click', () => {
      if (currentlyEditing && confirm(`Ви впевнені, що хочете видалити програму "${currentlyEditing}"?`)) {
          delete workoutPrograms[currentlyEditing];
          savePrograms();
          renderProgramList();
          programEditMenu.classList.remove('active');
          workoutSettingsMenu.classList.add('active');
          menuTitle.textContent = 'Налаштування тренувань';
      }
    });
  }

  loadPrograms();
  renderProgramList();
  
  if (burgerBtn && sideMenu && mainMenu && menuBackBtn && menuTitle) {
      const menuOverlayClose = sideMenu.querySelector('.menu-overlay-close');
      burgerBtn.addEventListener('click', (e) => { e.stopPropagation(); sideMenu.classList.add('open'); });
      if (menuOverlayClose) { menuOverlayClose.addEventListener('click', () => { sideMenu.classList.remove('open'); }); }
      
      const menuLinks = mainMenu.querySelectorAll('a');
      const menuScreens = sideMenu.querySelectorAll('.menu-screen');
      menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = link.dataset.target;
          const targetScreen = document.getElementById(targetId);
          if (targetScreen) {
            menuScreens.forEach(s => s.classList.remove('active'));
            targetScreen.classList.add('active');
            menuTitle.textContent = link.textContent;
            menuBackBtn.style.display = 'block';
          }
        });
      });
      menuBackBtn.addEventListener('click', () => {
        menuScreens.forEach(s => s.classList.remove('active'));
        mainMenu.classList.add('active');
        menuTitle.textContent = 'Меню';
        menuBackBtn.style.display = 'none';
      });
    }
  
  const savedBg = localStorage.getItem('customBackground');
  if (savedBg) {
    applyBackground(savedBg);
    if(bgUrlInput) bgUrlInput.value = savedBg;
  }
  showScreen('homeScreen');
});
