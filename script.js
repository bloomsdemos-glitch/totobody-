document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('touchstart', () => {}, {passive: true});

  // --- DOM-елементи ---
  const appHeader = document.querySelector('.app-header');
  const goalBar = document.getElementById('goalProgress');
  const screens = document.querySelectorAll('.screen');
  const workoutModal = document.getElementById('workoutModal');
  const modalProgramNameEl = document.getElementById('modalProgramName');
  const modalExerciseListEl = document.getElementById('modalExerciseList');
  const modalStartBtn = document.getElementById('modalStartBtn');
  const modalSettingsBtn = document.getElementById('modalSettingsBtn');
  const closeModalBtn = workoutModal.querySelector('.close-button');
  const workoutTiles = document.querySelectorAll('.neumorphic-tile');
  const burgerBtn = document.getElementById('burgerBtn');
  const sideMenu = document.getElementById('sideMenu');
  const datetimeDisplayEl = document.getElementById('datetime-display');
  const trainingScreen = document.getElementById('trainingScreen');
  const trainingBackBtn = document.getElementById('trainingBackBtn');
  const muteBtn = document.getElementById('muteBtn');
  const shuffleBtn = document.getElementById('shuffleBtn');
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
  const restDayBtn = document.getElementById('restDayBtn');
  const restDayModal = document.getElementById('restDayModal');
  const closeRestDayModalBtn = document.getElementById('closeRestDayModal');
  const stepsInput = document.getElementById('stepsInput');
  const restDayCaloriesInput = document.getElementById('restDayCaloriesInput');
  const moodRating = document.getElementById('moodRating');
  const saveRestDayBtn = document.getElementById('saveRestDayBtn');
  const danceModal = document.getElementById('danceModal');
  const closeDanceModalBtn = danceModal.querySelector('.close-button');
  const danceOptionBtns = danceModal.querySelectorAll('.dance-option-btn');
  const historyListEl = document.getElementById('historyList');
  const dayDetailScreen = document.getElementById('dayDetailScreen');
  const detailBackBtn = document.getElementById('detailBackBtn');
  const detailDateEl = document.getElementById('detailDate');
  const detailTitleEl = document.getElementById('detailTitle');
  const detailStatsListEl = document.getElementById('detailStatsList');

  let isMuted = false;
  let isShuffleActive = false;

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

    // Керуємо видимістю і темою хедера/футера
    if (screenId === 'dayDetailScreen') {
      appHeader.classList.add('dark-theme');
      goalBar.classList.add('dark-theme');
    } else {
      appHeader.classList.remove('dark-theme');
      goalBar.classList.remove('dark-theme');
    }
  }

  if (datetimeDisplayEl) {
    function updateDateTime() {
      const now = new Date();
      const options = {hour: '2-digit', minute: '2-digit', weekday: 'long', day: 'numeric', month: 'long'};
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

  function buildWorkout(programName) {
    const programData = workoutPrograms[programName] || {};
    let exercises = programData.exercises ? [...programData.exercises] : [];
    
    if (exercises.length > 0) {
      const workout = exercises.map(ex => ({name: ex.name, duration: ex.duration || 30, audio: ex.audio}));
      workout.push({name: 'Кінець тренування', duration: 3});
      return workout;
    } else {
      const poolCommon = ['Віджимання', 'Планка', 'Стрибки на місці', 'Випади', 'Скручування'];
      const workoutNames = [...poolCommon].sort(() => Math.random() - 0.5).slice(0, 10);
      const workout = workoutNames.map(name => ({ name, duration: 30}));
      workout.push({name: 'Кінець тренування', duration: 3});
      return workout;
    }
  }

  let currentProgram = '', exercises = [], currentIndex = 0, remainingTime = 0, timerInterval = null, isPaused = true, isStarted = false;

  function playCurrentExerciseSound() {
    if (isMuted) return;
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
    pauseBtn.innerHTML = isPaused ? '<i class="bi bi-play-circle-fill"></i>' : '<i class="bi bi-pause-circle-fill"></i>';
    pauseBtn.classList.toggle('active-green', !isPaused);
    pauseBtn.classList.toggle('active-blue', isPaused);

    const completedHTML = exercises.slice(0, currentIndex)
      .map(ex => `<div class="completed-exercise"><i class="bi bi-check-square-fill"></i> ${ex.name}</div>`)
      .join('');
    completedListEl.innerHTML = completedHTML;
  }

  function startTraining(programName) {
    currentProgram = programName;
    exercises = buildWorkout(programName);
    currentIndex = 0;
    remainingTime = exercises[0].duration || 30;
    isPaused = true;
    isStarted = false;
    
    updateUI();
    showScreen('trainingScreen');
    workoutModal.classList.remove('active');
    
    // Countdown before start
    showCountdown(() => {
      isPaused = false;
      isStarted = true;
      startTimer();
      playCurrentExerciseSound();
      updateUI();
    });
  }

  function showCountdown(callback) {
    countdownScreen.classList.add('active');
    let count = 3;
    countdownNumberEl.textContent = count;
    
    const countdownInterval = setInterval(() => {
      count--;
      if (count > 0) {
        countdownNumberEl.textContent = count;
      } else {
        clearInterval(countdownInterval);
        countdownScreen.classList.remove('active');
        if (callback) callback();
      }
    }, 1000);
  }

  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
      if (!isPaused && isStarted) {
        remainingTime--;
        updateUI();
        
        if (remainingTime <= 0) {
          nextExercise();
        }
      }
    }, 1000);
  }

  function nextExercise() {
    if (currentIndex >= exercises.length - 1) {
      finishWorkout();
      return;
    }
    
    currentIndex++;
    remainingTime = exercises[currentIndex].duration || 30;
    updateUI();
    playCurrentExerciseSound();
  }

  function prevExercise() {
    if (currentIndex <= 0) return;
    
    currentIndex--;
    remainingTime = exercises[currentIndex].duration || 30;
    updateUI();
    playCurrentExerciseSound();
  }

  function finishWorkout() {
    if (timerInterval) clearInterval(timerInterval);
    isPaused = true;
    isStarted = false;
    finishModal.classList.add('active');
    
    // Reset difficulty slider
    if (difficultySlider) {
      difficultySlider.value = 3;
      updateDifficultyBubble();
    }
    
    // Reset energy rating
    resetEnergyRating();
    resetStarRating();
    
    // Reset calories input
    if (caloriesInput) caloriesInput.value = '';
  }

  function confirmExitTraining() {
    if (confirm('Ви впевнені, що хочете завершити тренування?')) {
      if (timerInterval) clearInterval(timerInterval);
      isPaused = true;
      isStarted = false;
      showScreen('homeScreen');
    }
  }

  // Event listeners for training controls
  if (pauseBtn) pauseBtn.addEventListener('click', () => { 
    if (!isStarted) return; 
    isPaused = !isPaused; 
    updateUI(); 
  });

  if (stopBtn) stopBtn.addEventListener('click', finishWorkout);
  if (trainingBackBtn) trainingBackBtn.addEventListener('click', confirmExitTraining);
  if (nextBtn) nextBtn.addEventListener('click', () => { 
    if (!isStarted || currentIndex >= exercises.length - 1) return; 
    nextExercise();
  });
  if (prevBtn) prevBtn.addEventListener('click', () => { 
    if (!isStarted || currentIndex <= 0) return; 
    prevExercise();
  });

  function updateMuteButtonUI() {
    if (!muteBtn) return;
    muteBtn.classList.toggle('mute-btn-muted', isMuted);
    muteBtn.innerHTML = isMuted ? '<i class="bi bi-volume-mute-fill"></i>' : '<i class="bi bi-volume-up-fill"></i>';
  }

  function updateShuffleButtonUI() {
    if (!shuffleBtn) return;
    shuffleBtn.classList.toggle('shuffle-active', isShuffleActive);
  }

  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      updateMuteButtonUI();
    });
  }

  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', () => {
      isShuffleActive = !isShuffleActive;
      updateShuffleButtonUI();
      if (isShuffleActive && exercises.length > 0) {
        // Shuffle remaining exercises
        const remaining = exercises.slice(currentIndex + 1, -1); // Exclude last "end" exercise
        const shuffled = remaining.sort(() => Math.random() - 0.5);
        exercises = [...exercises.slice(0, currentIndex + 1), ...shuffled, exercises[exercises.length - 1]];
      }
    });
  }

  // Workout tiles click handlers
  workoutTiles.forEach(tile => {
    tile.addEventListener('click', () => {
        const programName = tile.dataset.program;
        const action = tile.dataset.action;
        
        if (programName) {
            modalProgramNameEl.textContent = programName;
            const exerciseList = buildWorkout(programName);
            modalExerciseListEl.innerHTML = exerciseList.slice(0, -1).map(ex => `<li>${ex.name} (${formatSecondsToTime(ex.duration)})</li>`).join('');
            workoutModal.classList.add('active');
            
            modalStartBtn.onclick = () => startTraining(programName);
            modalSettingsBtn.onclick = () => {
                workoutModal.classList.remove('active');
                openProgramEditor(programName);
            };
        } else if (action === 'show-dance') {
            danceModal.classList.add('active');
        } else if (action === 'add-program') {
            sideMenu.classList.add('open');
            openProgramEditor(null);
        }
    });
  });

  // Close modal handlers
  if (closeModalBtn) closeModalBtn.addEventListener('click', () => workoutModal.classList.remove('active'));
  if (closeDanceModalBtn) closeDanceModalBtn.addEventListener('click', () => danceModal.classList.remove('active'));
  if (closeExerciseModalBtn) closeExerciseModalBtn.addEventListener('click', () => exerciseModal.classList.remove('active'));

  // Side menu handlers
  if (burgerBtn) {
    burgerBtn.addEventListener('click', () => {
      sideMenu.classList.add('open');
      showMenuScreen('mainMenu', 'Меню');
    });
  }

  if (sideMenu) {
    const menuOverlay = sideMenu.querySelector('.menu-overlay-close');
    if (menuOverlay) {
      menuOverlay.addEventListener('click', () => {
        sideMenu.classList.remove('open');
      });
    }
  }

  if (menuBackBtn) {
    menuBackBtn.addEventListener('click', () => {
      showMenuScreen('mainMenu', 'Меню');
    });
  }

  function showMenuScreen(screenId, title) {
    const menuScreens = sideMenu.querySelectorAll('.menu-screen');
    menuScreens.forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    menuTitle.textContent = title;
    menuBackBtn.style.display = screenId === 'mainMenu' ? 'none' : 'flex';
  }

  // Main menu navigation
  if (mainMenu) {
    const menuLinks = mainMenu.querySelectorAll('a[data-target]');
    menuLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetScreen = link.dataset.target;
        const title = link.textContent.trim();
        
        if (targetScreen === 'workoutSettingsMenu') {
          renderProgramList();
        } else if (targetScreen === 'historyMenu') {
          renderHistory();
        }
        
        showMenuScreen(targetScreen, title);
      });
    });
  }

  // Background settings
  if (saveBgBtn) {
    saveBgBtn.addEventListener('click', () => {
      const bgUrl = bgUrlInput.value.trim();
      if (bgUrl) {
        document.body.style.backgroundImage = `url(${bgUrl})`;
        localStorage.setItem('backgroundUrl', bgUrl);
      }
    });
  }

  if (resetBgBtn) {
    resetBgBtn.addEventListener('click', () => {
      document.body.style.backgroundImage = '';
      bgUrlInput.value = '';
      localStorage.removeItem('backgroundUrl');
    });
  }

  // Load saved background
  const savedBg = localStorage.getItem('backgroundUrl');
  if (savedBg) {
    document.body.style.backgroundImage = `url(${savedBg})`;
    bgUrlInput.value = savedBg;
  }

  // Program management
  function loadPrograms() {
    const saved = localStorage.getItem('workoutPrograms');
    if (saved) {
      try {
        workoutPrograms = JSON.parse(saved);
      } catch (e) {
        console.error('Помилка завантаження програм:', e);
        workoutPrograms = {};
      }
    }
  }

  function savePrograms() {
    localStorage.setItem('workoutPrograms', JSON.stringify(workoutPrograms));
  }

  function renderProgramList() {
    if (!programListEl) return;
    programListEl.innerHTML = '';
    
    Object.keys(workoutPrograms).forEach(programName => {
      const li = document.createElement('li');
      li.className = 'program-list-item';
      li.innerHTML = `<span>${programName}</span><span class="arrow">›</span>`;
      li.addEventListener('click', () => openProgramEditor(programName));
      programListEl.appendChild(li);
    });
  }

  function openProgramEditor(programName) {
    currentlyEditingProgram = programName;
    
    if (programName) {
      // Edit existing program
      const program = workoutPrograms[programName] || {exercises: []};
      programNameInput.value = programName;
      renderExerciseList(program.exercises || []);
      showMenuScreen('programEditMenu', `Редагувати: ${programName}`);
    } else {
      // Create new program
      showMenuScreen('addProgramMenu', 'Нова програма');
    }
  }

  function renderExerciseList(exercises) {
    if (!exerciseListEl) return;
    exerciseListEl.innerHTML = '';
    
    exercises.forEach((exercise, index) => {
      const li = document.createElement('li');
      li.className = 'exercise-list-item';
      li.innerHTML = `
        <span>${exercise.name} (${formatSecondsToTime(exercise.duration || 30)})</span>
        <button class="edit-exercise-btn" data-index="${index}">✏️</button>
        <button class="delete-exercise-btn" data-index="${index}">🗑️</button>
      `;
      exerciseListEl.appendChild(li);
    });

    // Add event listeners
    exerciseListEl.querySelectorAll('.edit-exercise-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(btn.dataset.index);
        editExercise(index);
      });
    });

    exerciseListEl.querySelectorAll('.delete-exercise-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(btn.dataset.index);
        deleteExercise(index);
      });
    });
  }

  function editExercise(index) {
    currentlyEditingExerciseIndex = index;
    const program = workoutPrograms[currentlyEditingProgram] || {exercises: []};
    const exercise = program.exercises[index];
    
    if (exercise) {
      exerciseModalTitle.textContent = 'Редагувати вправу';
      exerciseNameInput.value = exercise.name || '';
      exerciseDurationInput.value = formatSecondsToTime(exercise.duration || 30);
      exerciseAudioInput.value = exercise.audio || '';
    } else {
      exerciseModalTitle.textContent = 'Нова вправа';
      exerciseNameInput.value = '';
      exerciseDurationInput.value = '00:30';
      exerciseAudioInput.value = '';
    }
    
    exerciseModal.classList.add('active');
  }

  function deleteExercise(index) {
    if (confirm('Видалити цю вправу?')) {
      const program = workoutPrograms[currentlyEditingProgram] || {exercises: []};
      program.exercises.splice(index, 1);
      workoutPrograms[currentlyEditingProgram] = program;
      savePrograms();
      renderExerciseList(program.exercises);
    }
  }

  // Exercise modal handlers
  if (addExerciseBtn) {
    addExerciseBtn.addEventListener('click', () => editExercise(-1));
  }

  if (saveExerciseBtn) {
    saveExerciseBtn.addEventListener('click', () => {
      const name = exerciseNameInput.value.trim();
      const duration = parseTimeToSeconds(exerciseDurationInput.value);
      const audio = exerciseAudioInput.value.trim();
      
      if (!name) {
        alert('Введіть назву вправи');
        return;
      }
      
      const exercise = { name, duration, audio };
      const program = workoutPrograms[currentlyEditingProgram] || {exercises: []};
      
      if (currentlyEditingExerciseIndex >= 0) {
        program.exercises[currentlyEditingExerciseIndex] = exercise;
      } else {
        program.exercises.push(exercise);
      }
      
      workoutPrograms[currentlyEditingProgram] = program;
      savePrograms();
      renderExerciseList(program.exercises);
      exerciseModal.classList.remove('active');
    });
  }

  // Program creation
  if (saveNewProgramBtn) {
    saveNewProgramBtn.addEventListener('click', () => {
      const name = newProgramNameInput.value.trim();
      if (!name) {
        alert('Введіть назву програми');
        return;
      }
      
      if (workoutPrograms[name]) {
        alert('Програма з такою назвою вже існує');
        return;
      }
      
      workoutPrograms[name] = {exercises: []};
      savePrograms();
      newProgramNameInput.value = '';
      openProgramEditor(name);
    });
  }

  // Program saving/deletion
  if (saveProgramBtn) {
    saveProgramBtn.addEventListener('click', () => {
      const newName = programNameInput.value.trim();
      if (!newName) {
        alert('Введіть назву програми');
        return;
      }
      
      if (newName !== currentlyEditingProgram && workoutPrograms[newName]) {
        alert('Програма з такою назвою вже існує');
        return;
      }
      
      const program = workoutPrograms[currentlyEditingProgram];
      if (newName !== currentlyEditingProgram) {
        delete workoutPrograms[currentlyEditingProgram];
        workoutPrograms[newName] = program;
        currentlyEditingProgram = newName;
      }
      
      savePrograms();
      renderProgramList();
      showMenuScreen('workoutSettingsMenu', 'Налаштування тренувань');
    });
  }

  if (deleteProgramBtn) {
    deleteProgramBtn.addEventListener('click', () => {
      if (confirm(`Видалити програму "${currentlyEditingProgram}"?`)) {
        delete workoutPrograms[currentlyEditingProgram];
        savePrograms();
        renderProgramList();
        showMenuScreen('workoutSettingsMenu', 'Налаштування тренувань');
      }
    });
  }

  if (addNewProgramBtn) {
    addNewProgramBtn.addEventListener('click', () => {
      showMenuScreen('addProgramMenu', 'Нова програма');
    });
  }

  // Finish modal handlers
  function updateDifficultyBubble() {
    if (!difficultySlider || !sliderEmojiBubble) return;
    const value = parseInt(difficultySlider.value);
    const emojis = ['😌', '🙂', '😮‍💨', '😵', '🥵', '💀'];
    sliderEmojiBubble.textContent = emojis[value - 1] || '🙂';
  }

  function resetEnergyRating() {
    if (!energyRating) return;
    energyRating.querySelectorAll('span').forEach(span => span.classList.remove('active'));
    energyRating.querySelector('span[data-value="5"]').classList.add('active');
  }

  function resetStarRating() {
    if (!starRating) return;
    starRating.querySelectorAll('span').forEach(span => span.classList.remove('active'));
  }

  if (difficultySlider) {
    difficultySlider.addEventListener('input', updateDifficultyBubble);
    updateDifficultyBubble();
  }

  if (energyRating) {
    energyRating.querySelectorAll('span').forEach(span => {
      span.addEventListener('click', () => {
        energyRating.querySelectorAll('span').forEach(s => s.classList.remove('active'));
        span.classList.add('active');
      });
    });
  }

  if (starRating) {
    starRating.querySelectorAll('span').forEach(span => {
      span.addEventListener('click', () => {
        const value = parseInt(span.dataset.value);
        starRating.querySelectorAll('span').forEach((s, index) => {
          s.classList.toggle('active', index < value);
        });
      });
    });
  }

  if (expandTagsBtn) {
    expandTagsBtn.addEventListener('click', () => {
      extraTagsSection.style.display = extraTagsSection.style.display === 'none' ? 'block' : 'none';
    });
  }

  if (extraTagsSection) {
    extraTagsSection.querySelectorAll('span[data-tag]').forEach(span => {
      span.addEventListener('click', () => {
        span.classList.toggle('active');
      });
    });
  }

  if (saveWorkoutLogBtn) {
    saveWorkoutLogBtn.addEventListener('click', () => {
      const calories = parseInt(caloriesInput.value) || 0;
      const difficulty = difficultySlider ? parseInt(difficultySlider.value) : 3;
      const energy = energyRating ? energyRating.querySelector('.active')?.dataset.value : null;
      const rating = starRating ? starRating.querySelectorAll('.active').length : 0;
      
      const difficultyEmojis = ['😌', '🙂', '😮‍💨', '😵', '🥵', '💀'];
      const energyEmojis = ['😵‍💫', '🥱', '🫤', '👌🏻', '⚡️', '🔥'];
      const ratingEmojis = ['😟', '😕', '😐', '🙂', '🤩'];
      
      const tags = [];
      if (difficulty >= 1 && difficulty <= 6) tags.push(difficultyEmojis[difficulty - 1]);
      if (energy !== null && energy >= 0 && energy <= 5) tags.push(energyEmojis[energy]);
      if (rating >= 1 && rating <= 5) tags.push(ratingEmojis[rating - 1]);
      
      if (extraTagsSection) {
        extraTagsSection.querySelectorAll('.active').forEach(span => {
          tags.push(span.textContent);
        });
      }
      
      const workoutRecord = {
        date: new Date().toLocaleDateString('uk-UA'),
        program: currentProgram,
        calories,
        tags,
        type: 'workout'
      };
      
      saveWorkoutHistory(workoutRecord);
      finishModal.classList.remove('active');
      showScreen('homeScreen');
    });
  }

  function saveWorkoutHistory(record) {
    const history = JSON.parse(localStorage.getItem('workoutHistory')) || [];
    history.unshift(record);
    localStorage.setItem('workoutHistory', JSON.stringify(history));
  }

  function renderHistory() {
    if (!historyListEl) return;
    const history = JSON.parse(localStorage.getItem('workoutHistory')) || [];
    
    if (history.length === 0) {
      historyListEl.innerHTML = '<li class="history-empty">Історія тренувань порожня</li>';
      return;
    }
    
    // Group by date
    const groupedHistory = {};
    history.forEach(record => {
      const date = record.date;
      if (!groupedHistory[date]) {
        groupedHistory[date] = [];
      }
      groupedHistory[date].push(record);
    });
    
    historyListEl.innerHTML = '';
    Object.entries(groupedHistory).forEach(([date, records]) => {
      const li = document.createElement('li');
      li.className = 'history-day-item';
      
      const totalCalories = records.reduce((sum, r) => sum + (r.calories || 0), 0);
      const hasWorkout = records.some(r => r.type === 'workout');
      
      li.innerHTML = `
        <div class="history-day-header">
          <span class="history-date">${date}</span>
          <span class="history-info">${hasWorkout ? '🔥' : '🦥'} ${totalCalories} kcal</span>
        </div>
      `;
      
      li.addEventListener('click', () => openDayDetails(date, records));
      historyListEl.appendChild(li);
    });
  }

  function openDayDetails(day, dayRecords) {
    detailDateEl.textContent = day;
    detailStatsListEl.innerHTML = '';

    // Збираємо всі дані за день в один об'єкт
    const dayData = {
        calories: 0,
        difficulty: null,
        energy: null,
        steps: 0,
        mood: null,
        tags: [],
        rating: 0,
        hasWorkout: false
    };

    dayRecords.forEach(record => {
        dayData.calories += record.calories || 0;
        dayData.steps += record.steps || 0;
        
        if (record.type === 'workout') {
            dayData.hasWorkout = true;
            const difficultyTag = record.tags.find(t => ['😌', '🙂', '😮‍💨', '😵', '🥵', '💀'].includes(t));
            const energyTag = record.tags.find(t => ['😵‍💫', '🥱', '🫤', '👌🏻', '⚡️', '🔥'].includes(t));
            const ratingTag = record.tags.find(t => ['😟', '😕', '😐', '🙂', '🤩'].includes(t));
            const extraTags = record.tags.filter(t => !['😌', '🙂', '😮‍💨', '😵', '🥵', '💀', '😵‍💫', '🥱', '🫤', '👌🏻', '⚡️', '🔥', '😟', '😕', '😐', '🙂', '🤩'].includes(t));

            if (difficultyTag) dayData.difficulty = difficultyTag;
            if (energyTag) dayData.energy = energyTag;
            if (ratingTag) {
                dayData.rating = ['😟', '😕', '😐', '🙂', '🤩'].indexOf(ratingTag) + 1;
            }
            // Збираємо унікальні теги
            extraTags.forEach(tag => {
                if (!dayData.tags.includes(tag)) {
                    dayData.tags.push(tag);
                }
            });
        } else if (record.type === 'rest') {
            const moodTag = record.tags.find(t => ['🤩', '😌', '🙂', '🫤', '😟', '😩', '🤬'].includes(t));
            if (moodTag) dayData.mood = moodTag;
        }
    });

    detailTitleEl.textContent = dayData.hasWorkout ? '• День тренування •' : '• Вихідний •';

    let statsHTML = '';
    if (dayData.calories > 0) statsHTML += `<li class="detail-stat-item"><i class="bi bi-fire"></i><span class="label">Спалені калорії</span><span class="value">${dayData.calories}</span></li>`;
    if (dayData.difficulty) statsHTML += `<li class="detail-stat-item"><i class="bi bi-triangle-half"></i><span class="label">Рівень складності</span><span class="value">${dayData.difficulty}</span></li>`;
    if (dayData.energy) statsHTML += `<li class="detail-stat-item"><i class="bi bi-lightning-charge-fill"></i><span class="label">Енергія</span><span class="value">${dayData.energy}</span></li>`;
    if (dayData.steps > 0) statsHTML += `<li class="detail-stat-item"><i class="bi bi-person-walking"></i><span class="label">Кроки</span><span class="value">${dayData.steps}</span></li>`;
    if (dayData.mood) statsHTML += `<li class="detail-stat-item"><i class="bi bi-emoji-smile"></i><span class="label">Настрій</span><span class="value">${dayData.mood}</span></li>`;
    if (dayData.tags.length > 0) statsHTML += `<li class="detail-stat-item"><i class="bi bi-node-plus-fill"></i><span class="label">Теґи</span><span class="value">${dayData.tags.join(' ')}</span></li>`;
    if (dayData.rating > 0) statsHTML += `<li class="detail-stat-item"><i class="bi bi-star"></i><span class="label">Оцінка</span><span class="value star-value">${'★'.repeat(dayData.rating)}${'☆'.repeat(5 - dayData.rating)}</span></li>`;

    detailStatsListEl.innerHTML = statsHTML;
    
    sideMenu.classList.remove('open');
    setTimeout(() => showScreen('dayDetailScreen'), 200);
  }

  // Обробник для кнопки "назад" на екрані деталей
  if (detailBackBtn) {
    detailBackBtn.addEventListener('click', () => {
        sideMenu.classList.add('open');
        showScreen('homeScreen');
        
        // Робимо активним екран історії в меню
        const menuScreens = sideMenu.querySelectorAll('.menu-screen');
        menuScreens.forEach(s => s.classList.remove('active'));
        document.getElementById('historyMenu').classList.add('active');
        menuTitle.textContent = 'Історія тренувань';
        menuBackBtn.style.display = 'flex';
    });
  }

  // Initialize
  loadPrograms();
  updateMuteButtonUI();
  updateShuffleButtonUI();
});