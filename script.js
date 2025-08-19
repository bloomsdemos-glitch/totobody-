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
    previewExercises.forEach(ex => { if (ex.name !== 'Кінець тренування') { const li = document.createElement('li'); li.textContent = ex.name; modalExerciseListEl.appendChild(li); } });
    workoutModal.classList.add('active');
    const startFunction = () => { workoutModal.classList.remove('active'); startWorkout(programName); modalStartBtn.removeEventListener('click', startFunction); };
    modalStartBtn.addEventListener('click', startFunction);
  }
  
  workoutTiles.forEach(tile => { tile.addEventListener('click', () => { const programName = tile.dataset.program; if (programName) { setTimeout(() => { openWorkoutModal(programName); }, 150); } }); });

  if (closeModalBtn) closeModalBtn.addEventListener('click', () => { workoutModal.classList.remove('active'); });
  if (workoutModal) workoutModal.addEventListener('click', (event) => { if (event.target === workoutModal) { workoutModal.classList.remove('active'); } });

  function applyBackground(url) { document.body.style.backgroundImage = `url('${url}')`; }
  if (saveBgBtn) { saveBgBtn.addEventListener('click', () => { const bgUrl = bgUrlInput.value.trim(); if (bgUrl) { localStorage.setItem('customBackground', bgUrl); applyBackground(bgUrl); } }); }
  if (resetBgBtn) { resetBgBtn.addEventListener('click', () => { localStorage.removeItem('customBackground'); document.body.style.backgroundImage = 'none'; if (bgUrlInput) bgUrlInput.value = ''; }); }

  function loadPrograms() {
    const savedPrograms = localStorage.getItem('workoutPrograms');
    if (savedPrograms) {
        workoutPrograms = JSON.parse(savedPrograms);
    } else {
        workoutPrograms = {
            "HIIT BASIC": { exercises: [{name: "Стрибки джек", duration: 30, audio: 'jack.mp3'}, {name: "Берпі", duration: 45, audio: 'burpee.mp3'}] },
            "HIIT ULTRA": { exercises: [] }, "HIIT PRO": { exercises: [] }, "MIXED BASIC": { exercises: [] }, "DUMBBELL": { exercises: [] }, "BODYWEIGHT": { exercises: [] }
        };
    }
  }
  function savePrograms() { localStorage.setItem('workoutPrograms', JSON.stringify(workoutPrograms)); }
  function renderProgramList() { if (!programListEl) return; programListEl.innerHTML = ''; for (const programName in workoutPrograms) { const li = document.createElement('li'); li.className = 'program-list-item'; li.dataset.programName = programName; li.innerHTML = `<span>${programName}</span><span class="arrow">></span>`; li.addEventListener('click', () => { openProgramEditor(programName); }); programListEl.appendChild(li); } }
  
  function renderExerciseList(programName) {
    if (!exerciseListEl) return;
    const program = workoutPrograms[programName];
    exerciseListEl.innerHTML = '';

    if (program && program.exercises.length > 0) {
        program.exercises.forEach((exercise, index) => {
            const li = document.createElement('li');
            li.className = 'exercise-list-item';
            li.innerHTML = `
              <div class="exercise-item-info">
                <span class="name">${exercise.name}</span>
                <span class="duration">${formatSecondsToTime(exercise.duration)}</span>
              </div>
              <div class="exercise-item-actions">
                <button class="edit-btn" data-index="${index}"><i class="bi bi-pencil-square"></i></button>
                <button class="delete-btn" data-index="${index}"><i class="bi bi-trash"></i></button>
              </div>`;
            exerciseListEl.appendChild(li);
        });

        exerciseListEl.querySelectorAll('.edit-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const index = e.currentTarget.dataset.index;
            openExerciseEditor('edit', programName, parseInt(index, 10));
          });
        });

        exerciseListEl.querySelectorAll('.delete-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const index = e.currentTarget.dataset.index;
            const exercise = program.exercises[index];
            if (confirm(`Видалити вправу "${exercise.name}"?`)) {
              program.exercises.splice(index, 1);
              savePrograms();
              renderExerciseList(programName);
            }
          });
        });
    } else { 
        exerciseListEl.innerHTML = '<li>(Вправ ще немає)</li>'; 
    }
  }

  function openProgramEditor(programName) {
    currentlyEditingProgram = programName;
    if (programEditMenu) {
      const allMenus = sideMenu.querySelectorAll('.menu-screen');
      allMenus.forEach(m => m.classList.remove('active'));
      programEditMenu.classList.add('active');
    }
    if (menuTitle) menuTitle.textContent = `Редагування`;
    if (programNameInput) programNameInput.value = programName;
    renderExerciseList(programName);
  }

  function openExerciseEditor(mode, programName, exerciseIndex = null) {
    currentlyEditingProgram = programName;
    currentlyEditingExerciseIndex = exerciseIndex;
    if (mode === 'edit') {
      const exercise = workoutPrograms[programName].exercises[exerciseIndex];
      exerciseModalTitle.textContent = "Редагувати вправу";
      exerciseNameInput.value = exercise.name;
      exerciseDurationInput.value = formatSecondsToTime(exercise.duration);
      exerciseAudioInput.value = exercise.audio || '';
    } else {
      exerciseModalTitle.textContent = "Нова вправа";
      exerciseNameInput.value = '';
      exerciseDurationInput.value = '00:30';
      exerciseAudioInput.value = '';
      currentlyEditingExerciseIndex = null;
    }
    exerciseModal.classList.add('active');
  }

  if (addNewProgramBtn) {
    addNewProgramBtn.addEventListener('click', () => {
      const allMenus = sideMenu.querySelectorAll('.menu-screen');
      allMenus.forEach(m => m.classList.remove('active'));
      if (addProgramMenu) addProgramMenu.classList.add('active');
      if (menuTitle) menuTitle.textContent = 'Нова програма';
      if (newProgramNameInput) newProgramNameInput.value = '';
      if (menuBackBtn) menuBackBtn.style.display = 'block';
    });
  }

  if (saveNewProgramBtn) {
    saveNewProgramBtn.addEventListener('click', () => {
      const newName = newProgramNameInput.value.trim();
      if (newName && !workoutPrograms[newName]) {
        workoutPrograms[newName] = { exercises: [] };
        savePrograms();
        renderProgramList();
        const allMenus = sideMenu.querySelectorAll('.menu-screen');
        allMenus.forEach(m => m.classList.remove('active'));
        if (workoutSettingsMenu) workoutSettingsMenu.classList.add('active');
        if (menuTitle) menuTitle.textContent = 'Налаштування тренувань';
      } else {
        alert('Будь ласка, введи унікальну назву програми.');
      }
    });
  }

  if (saveProgramBtn) {
    saveProgramBtn.addEventListener('click', () => {
      const newName = programNameInput.value.trim();
      if (newName && currentlyEditingProgram) {
        if (newName !== currentlyEditingProgram) {
          if (workoutPrograms[newName]) {
            alert('Програма з такою назвою вже існує!');
            return;
          }
          Object.defineProperty(workoutPrograms, newName, Object.getOwnPropertyDescriptor(workoutPrograms, currentlyEditingProgram));
          delete workoutPrograms[currentlyEditingProgram];
        }
        savePrograms();
        renderProgramList();
        alert(`Програму "${newName}" збережено!`);
        const allMenus = sideMenu.querySelectorAll('.menu-screen');
        allMenus.forEach(m => m.classList.remove('active'));
        if (workoutSettingsMenu) workoutSettingsMenu.classList.add('active');
        if (menuTitle) menuTitle.textContent = 'Налаштування тренувань';
      }
    });
  }

  if (deleteProgramBtn) {
    deleteProgramBtn.addEventListener('click', () => {
      if (currentlyEditingProgram && confirm(`Ви впевнені, що хочете видалити програму "${currentlyEditingProgram}"?`)) {
        delete workoutPrograms[currentlyEditingProgram];
        savePrograms();
        renderProgramList();
        const allMenus = sideMenu.querySelectorAll('.menu-screen');
        allMenus.forEach(m => m.classList.remove('active'));
        if (workoutSettingsMenu) workoutSettingsMenu.classList.add('active');
        if (menuTitle) menuTitle.textContent = 'Налаштування тренувань';
      }
    });
  }
  
  if (addExerciseBtn) { addExerciseBtn.addEventListener('click', () => openExerciseEditor('add', currentlyEditingProgram)); }
  
  if (saveExerciseBtn) {
      saveExerciseBtn.addEventListener('click', () => {
          const name = exerciseNameInput.value.trim();
          const durationString = exerciseDurationInput.value.trim();
          const duration = parseTimeToSeconds(durationString);
          const audio = exerciseAudioInput.value.trim();

          if (name && duration > 0 && currentlyEditingProgram) {
              const newExercise = { name, duration, audio };
              if (currentlyEditingExerciseIndex !== null) {
                workoutPrograms[currentlyEditingProgram].exercises[currentlyEditingExerciseIndex] = newExercise;
              } else {
                workoutPrograms[currentlyEditingProgram].exercises.push(newExercise);
              }
              savePrograms();
              renderExerciseList(currentlyEditingProgram);
              exerciseModal.classList.remove('active');
          } else { alert('Будь ласка, введи коректну назву та тривалість (формат хх:сс).'); }
      });
  }

  if (closeExerciseModalBtn) { closeExerciseModalBtn.addEventListener('click', () => { exerciseModal.classList.remove('active'); }); }

  const difficultyEmojis = ['😌', '🙂', '😮‍💨', '😵', '🥵', '💀'];
  const starEmojis = ['😟', '😕', '😐', '🙂', '🤩'];
  
  function updateSliderEmoji() {
    if (!difficultySlider || !sliderEmojiBubble) return;
    const value = parseFloat(difficultySlider.value);
    const min = parseFloat(difficultySlider.min);
    const max = parseFloat(difficultySlider.max);
    const trackWidth = difficultySlider.clientWidth;
    const thumbWidth = 30;
    const percent = (value - min) / (max - min);
    const thumbPosition = percent * (trackWidth - thumbWidth) + (thumbWidth / 2);
    sliderEmojiBubble.style.left = `${thumbPosition}px`;
    sliderEmojiBubble.textContent = difficultyEmojis[Math.round(value) - 1];
  }
  if (difficultySlider) { difficultySlider.addEventListener('input', updateSliderEmoji); }

  function setupEmojiRating(container) {
    if (!container) return;
    const emojis = container.querySelectorAll('span');
    emojis.forEach(emoji => { emoji.addEventListener('click', () => { emojis.forEach(e => e.classList.remove('active')); emoji.classList.add('active'); }); });
  }
  setupEmojiRating(energyRating);

  if (starRating) {
    const stars = starRating.querySelectorAll('span');
    stars.forEach(star => { star.addEventListener('click', () => { const currentRating = star.dataset.value; stars.forEach(s => { s.classList.toggle('active', s.dataset.value <= currentRating); }); }); });
  }
  
  if (expandTagsBtn && extraTagsSection) {
    expandTagsBtn.addEventListener('click', () => extraTagsSection.classList.toggle('visible'));
    const allTags = extraTagsSection.querySelectorAll('.tags-rating span');
    allTags.forEach(tag => { tag.addEventListener('click', () => tag.classList.toggle('active')); });
  }

  function collectAllTags() {
    const tags = new Set();
    if (sliderEmojiBubble) tags.add(sliderEmojiBubble.textContent);
    const activeEnergyEl = energyRating ? energyRating.querySelector('span.active') : null;
    if (activeEnergyEl) tags.add(activeEnergyEl.textContent);
    const rating = starRating ? starRating.querySelectorAll('span.active').length : 0;
    if (rating > 0) tags.add(starEmojis[rating - 1]);
    if (extraTagsSection) {
      const activeExtraTags = extraTagsSection.querySelectorAll('span.active');
      activeExtraTags.forEach(tag => tags.add(tag.textContent));
    }
    return Array.from(tags);
  }

  if (saveWorkoutLogBtn) {
    saveWorkoutLogBtn.addEventListener('click', () => {
      const calories = parseInt(caloriesInput.value, 10) || 0;
      const allCollectedTags = collectAllTags();
      const workoutLog = { sessionId: new Date().getTime(), date: new Date().toISOString(), program: currentProgram, calories: calories, tags: allCollectedTags, exercises: exercises.slice(0, -1) };
      const history = JSON.parse(localStorage.getItem('workoutHistory')) || [];
      history.push(workoutLog);
      localStorage.setItem('workoutHistory', JSON.stringify(history));
      alert('Результат збережено! Красунчик!');
      finishModal.classList.remove('active');
      showScreen('homeScreen');
    });
  }
  
  if (burgerBtn && sideMenu && mainMenu && menuBackBtn && menuTitle) {
      const menuOverlayClose = sideMenu.querySelector('.menu-overlay-close');
      burgerBtn.addEventListener('click', (e) => { e.stopPropagation(); sideMenu.classList.add('open'); });
      if (menuOverlayClose) { menuOverlayClose.addEventListener('click', () => sideMenu.classList.remove('open')); }
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
        const activeScreen = sideMenu.querySelector('.menu-screen.active');
        if (activeScreen && activeScreen.id !== 'mainMenu') {
            activeScreen.classList.remove('active');
            mainMenu.classList.add('active');
            menuTitle.textContent = 'Меню';
            if(activeScreen.id === 'programEditMenu' || activeScreen.id === 'addProgramMenu'){
                workoutSettingsMenu.classList.add('active');
                mainMenu.classList.remove('active');
                menuTitle.textContent = 'Налаштування тренувань';
            } else {
                menuBackBtn.style.display = 'none';
            }
        } else {
             sideMenu.classList.remove('open');
             menuBackBtn.style.display = 'none';
        }
      });
  }
  
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
