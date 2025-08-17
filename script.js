// Запускаємо скрипт, коли вся сторінка завантажена
document.addEventListener('DOMContentLoaded', () => {
  
  // ===== Навігація між екранами =====
  const screens = document.querySelectorAll('.screen');
  function showScreen(screenId) {
    screens.forEach(s => s.classList.remove('active'));
    const screenToShow = document.getElementById(screenId);
    if (screenToShow) {
      screenToShow.classList.add('active');
    }
  }
  
  // Make showScreen globally available
  window.showScreen = showScreen;

  // ===== DOM елементи =====

  // --- Модальне вікно --- 
  const workoutModal = document.getElementById('workoutModal');
  const modalProgramNameEl = document.getElementById('modalProgramName');
  const modalExerciseListEl = document.getElementById('modalExerciseList');
  const modalStartBtn = document.getElementById('modalStartBtn');
  const modalSettingsBtn = document.getElementById('modalSettingsBtn');
  const closeModalBtn = workoutModal.querySelector('.close-button');

  // --- Головний екран ---
  const workoutTiles = document.querySelectorAll('.neumorphic-tile[data-program]');
  const burgerBtn = document.getElementById('burgerBtn');
  const sideMenu = document.getElementById('sideMenu');
  const restDayBtn = document.getElementById('restDayBtn');

  // --- Екран тренування ---
  const trainingScreen = document.getElementById('trainingScreen');
  const trainingProgramNameEl = document.getElementById('trainingProgramName');
  const exerciseNameEl = document.getElementById('exerciseName');
  const timerEl = document.getElementById('timer');
  const prevBtn = document.getElementById('prevExercise');
  const pauseBtn = document.getElementById('pauseBtn');
  const stopBtn = document.getElementById('stopBtn');
  const nextBtn = document.getElementById('nextExercise');
  const completedListEl = document.getElementById('completedExercises');

  // ВИПРАВЛЕНО: Я тимчасово "вимкнув" пошук елементів, яких ще немає в HTML
  // --- Glassmorphism модалки ---
  // const danceModal = document.getElementById('danceModal');
  // const weightModal = document.getElementById('weightModal');
  // const restDayModal = document.getElementById('restDayModal');
  // const closeModalBtns = document.querySelectorAll('.close-modal');

  // --- Прогрес-бар ---
  const progressBar = document.querySelector('.progress-line-fg');

  // ВИПРАВЛЕНО: Я тимчасово "вимкнув" пошук елементів меню, яких ще немає в HTML
  // --- Menu screens ---
  // const menuBackBtn = document.getElementById('menuBackBtn');
  // const menuTitle = document.getElementById('menuTitle');
  // const mainMenu = document.getElementById('mainMenu');
  // const workoutSettingsMenu = document.getElementById('workoutSettingsMenu');
  // const programEditMenu = document.getElementById('programEditMenu');
  // const statsSettingsMenu = document.getElementById('statsSettingsMenu');
  // const goalSettingsMenu = document.getElementById('goalSettingsMenu');
  // const appSettingsMenu = document.getElementById('appSettingsMenu');

  // ===== Пули вправ (залишились без змін, бо вони ідеальні) =====
  const poolHIIT = [
    'Берпі', 'Джамп-сквот', 'Спринт на місці', 'Альпініст', 'Планка', 'Стрибки джек', 
    'Випади стрибком', 'Планка + коліно-лікоть', 'Скелелаз з паузою', 'Хай-ніс (високі коліна)'
  ];
  const poolMIX = [
    'Присідання з гантелями','Тяга гантелей у нахилі','Жим гантелей лежачи', 'Махи гантелями в сторони',
    'Ягодичний міст','Станова з гантелями', 'Пуловер з гантеллю','Молоткові згинання'
  ];
  const poolCommon = [
    'Віджимання','Планка','Стрибки на місці','Випади','Скручування','Підйоми ніг','Біг на місці',
    'Стільчик біля стіни','Супермен','Російські скручування','Бічна планка'
  ];
  
  // ===== Логіка генерації тренувань =====
  function shuffle(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  function buildWorkout(program) {
    let basePool = [];
    if (program.startsWith('HIIT')) {
        basePool = poolHIIT;
    } else if (program.startsWith('MIXED')) {
        basePool = poolMIX;
    } else if (program === 'ГАНТЕЛЬ') { // ВИПРАВЛЕНО: змінив назву програми на великі літери, як в HTML
        basePool = poolMIX;
    } else if (program === 'ФІЗИЧНЕ') { // ВИПРАВЛЕНО: змінив назву програми на великі літери, як в HTML
        basePool = poolCommon;
    } else {
        basePool = poolCommon;
    }
    const workoutNames = shuffle([...new Set([...basePool, ...poolCommon])]).slice(0, 10);
    const workout = workoutNames.map(name => ({ name: name, duration: 30 }));
    workout.push({ name: 'Кінець тренування', duration: 3 });
    return workout;
  }

  // ===== Стан тренування (майже без змін) =====
  let currentProgram = '';
  let exercises = [];
  let currentIndex = 0;
  let remainingTime = 0;
  let timerInterval = null;
  let isPaused = true;
  let isStarted = false;
  const DEFAULT_DURATION = 30;

  // ===== Функції тренування (адаптовані під новий UI) =====
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
    pauseBtn.textContent = isPaused ? '▶️' : '⏸️'; // ВИПРАВЛЕНО: спростив оновлення кнопки паузи
  }

  function tick() {
    if (isPaused) return;
    remainingTime--;
    timerEl.textContent = formatTime(remainingTime);
    if (remainingTime <= 0) {
      if (currentIndex < exercises.length - 1) {
        currentIndex++;
        remainingTime = exercises[currentIndex].duration || DEFAULT_DURATION;
        updateUI();
      } else {
        finishWorkout();
      }
    }
  }

  function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(tick, 1000);
  }

  // ВИПРАВЛЕНО: Я тимчасово повернув стару, просту версію функції startWorkout,
  // бо для твоєї нової версії (з екраном підтвердження) ще немає HTML.
  function startWorkout(programName) {
    currentProgram = programName;
    exercises = buildWorkout(programName);
    currentIndex = 0;
    remainingTime = exercises[0]?.duration || DEFAULT_DURATION;
    isStarted = true;
    isPaused = false;
    
    updateUI();
    startTimer();
    showScreen('trainingScreen');
  }

  function finishWorkout() {
    clearInterval(timerInterval);
    isStarted = false;
    isPaused = true;
    alert('Тренування завершено! 💪');
    showScreen('homeScreen');
  }

  // ===== Обробники кнопок керування =====
  pauseBtn.addEventListener('click', () => {
    if (!isStarted) return;
    isPaused = !isPaused;
    updateUI();
  });

  stopBtn.addEventListener('click', () => {
    if (!isStarted) {
        showScreen('homeScreen');
        return;
    }
    finishWorkout();
  });

  nextBtn.addEventListener('click', () => {
    if (!isStarted || currentIndex >= exercises.length - 1) return;
    currentIndex++;
    remainingTime = exercises[currentIndex].duration || DEFAULT_DURATION;
    updateUI();
  });

  prevBtn.addEventListener('click', () => {
    if (!isStarted || currentIndex <= 0) return;
    currentIndex--;
    remainingTime = exercises[currentIndex].duration || DEFAULT_DURATION;
    updateUI();
  });

  // ===== ІНІЦІАЛІЗАЦІЯ та ЛОГІКА МОДАЛЬНОГО ВІКНА (залишаємо як є) =====
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

  closeModalBtn.addEventListener('click', () => {
    workoutModal.classList.remove('active');
  });

  workoutModal.addEventListener('click', (event) => {
    if (event.target === workoutModal) {
      workoutModal.classList.remove('active');
    }
  });

  // ВИПРАВЛЕНО: я тимчасово "вимкнув" обробники для меню, бо для них ще немає HTML
  // ===== GLASSMORPHISM ФУНКЦІОНАЛ =====
  // burgerBtn.addEventListener('click', () => {
  //   sideMenu.classList.toggle('open');
  // });
  // document.addEventListener('click', (e) => {
  //   if (!sideMenu.contains(e.target) && !burgerBtn.contains(e.target)) {
  //     sideMenu.classList.remove('open');
  //   }
  // });

  // Показуємо головний екран при завантаженні
  showScreen('homeScreen');
});

  document.querySelectorAll('.glass-modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        hideModal(modal);
      }
    });
  });

  // ===== ОБРОБНИКИ ПЛИТОК ТА ДІЙ =====
  
  // Обробка кліків на плитки та кнопки
  // ===== EMOJI FUNCTIONALITY =====
  
  let longPressTimer;
  let isLongPress = false;

  function showEmojiPicker(tile) {
    const emojis = ['🔥', '💪', '⚡', '🚀', '💯', '🎯', '⭐', '🏆', '💎', '🌟', '❤️', '💙', '💚', '💛', '🧡', '💜'];
    const emoji = prompt(`Оберіть емодзі для цієї кнопки:\n${emojis.join(' ')}\n\nВведіть один з них або будь-який інший:`);
    
    if (emoji && emoji.trim()) {
      addEmojiToTile(tile, emoji.trim());
      saveButtonEmoji(tile.dataset.program || tile.dataset.action, emoji.trim());
    }
  }

  function addEmojiToTile(tile, emoji) {
    const existingEmoji = tile.querySelector('.emoji-icon');
    if (existingEmoji) {
      existingEmoji.remove();
    }

    const emojiSpan = document.createElement('span');
    emojiSpan.className = 'emoji-icon';
    emojiSpan.textContent = emoji;
    tile.appendChild(emojiSpan);
  }

  function saveButtonEmoji(buttonId, emoji) {
    const savedEmojis = JSON.parse(localStorage.getItem('buttonEmojis') || '{}');
    savedEmojis[buttonId] = emoji;
    localStorage.setItem('buttonEmojis', JSON.stringify(savedEmojis));
  }

  function loadButtonEmojis() {
    const savedEmojis = JSON.parse(localStorage.getItem('buttonEmojis') || '{}');
    
    document.querySelectorAll('.neumorphic-tile').forEach(tile => {
      const buttonId = tile.dataset.program || tile.dataset.action;
      if (savedEmojis[buttonId]) {
        addEmojiToTile(tile, savedEmojis[buttonId]);
      }
    });
  }

  // ===== CLICK AND LONG PRESS HANDLERS =====

  document.addEventListener('mousedown', (e) => {
    const tile = e.target.closest('.neumorphic-tile, .fab');
    if (!tile) return;

    isLongPress = false;
    longPressTimer = setTimeout(() => {
      isLongPress = true;
      showEmojiPicker(tile);
    }, 800);
  });

  document.addEventListener('mouseup', (e) => {
    clearTimeout(longPressTimer);
    setTimeout(() => { isLongPress = false; }, 100);
  });

  document.addEventListener('touchstart', (e) => {
    const tile = e.target.closest('.neumorphic-tile, .fab');
    if (!tile) return;

    isLongPress = false;
    longPressTimer = setTimeout(() => {
      isLongPress = true;
      showEmojiPicker(tile);
    }, 800);
  });

  document.addEventListener('touchend', (e) => {
    clearTimeout(longPressTimer);
    setTimeout(() => { isLongPress = false; }, 100);
  });

  document.addEventListener('click', (e) => {
    const tile = e.target.closest('.neumorphic-tile, .fab');
    if (!tile || isLongPress) return;

    const programName = tile.dataset.program;
    const action = tile.dataset.action;

    if (programName) {
      startWorkout(programName);
    } else if (action) {
      handleAction(action);
    }
  });

  function handleAction(action) {
    switch (action) {
      case 'show-dance':
        showModal(danceModal);
        break;
      case 'show-weight':
        showModal(weightModal);
        loadWeightHistory();
        break;
      case 'add-rest-day':
        showModal(restDayModal);
        break;
      case 'show-stats':
        alert('Статистика буде додана пізніше');
        break;
      case 'show-calendar':
        alert('Календар буде додано пізніше');
        break;
      case 'show-records':
        alert('Рекорди будуть додані пізніше');
        break;
      case 'add-program':
        alert('Додавання програм буде реалізовано пізніше');
        break;
      case 'workout-settings':
        showMenuScreen('workoutSettingsMenu', 'Налаштування тренувань');
        populateWorkoutPrograms();
        break;
      case 'stats-settings':
        showMenuScreen('statsSettingsMenu', 'Статистика');
        break;
      case 'goal-settings':
        showMenuScreen('goalSettingsMenu', 'Мета');
        loadGoalSettings();
        break;
      case 'app-settings':
        showMenuScreen('appSettingsMenu', 'Налаштування додатку');
        loadAppSettings();
        break;
      case 'calendar':
        alert('Календар буде додано пізніше');
        break;
      case 'workout-history':
        alert('Історія тренувань буде додана пізніше');
        break;
    }
  }

  // ===== MENU NAVIGATION =====
  
  function showMenuScreen(screenId, title) {
    // Hide all menu screens
    document.querySelectorAll('.menu-screen').forEach(screen => {
      screen.classList.remove('active');
    });
    
    // Show target screen
    document.getElementById(screenId).classList.add('active');
    
    // Update title and back button
    menuTitle.textContent = title;
    menuBackBtn.style.display = screenId === 'mainMenu' ? 'none' : 'block';
  }

  menuBackBtn.addEventListener('click', () => {
    showMenuScreen('mainMenu', 'Меню');
  });

  // ===== WORKOUT PROGRAMS MANAGEMENT =====
  
  const defaultPrograms = {
    'HIIT BASIC': { exercises: poolHIIT, duration: 30 },
    'HIIT ULTRA': { exercises: poolHIIT, duration: 45 },
    'HIIT PRO': { exercises: poolHIIT, duration: 60 },
    'MIXED BASIC': { exercises: poolMIX, duration: 30 },
    'ГАНТЕЛЬ': { exercises: poolMIX, duration: 30 },
    'ФІЗИЧНЕ': { exercises: poolCommon, duration: 30 }
  };

  function getWorkoutPrograms() {
    const saved = localStorage.getItem('workoutPrograms');
    return saved ? JSON.parse(saved) : { ...defaultPrograms };
  }

  function saveWorkoutPrograms(programs) {
    localStorage.setItem('workoutPrograms', JSON.stringify(programs));
  }

  function populateWorkoutPrograms() {
    const programs = getWorkoutPrograms();
    const list = document.getElementById('workoutProgramsList');
    
    list.innerHTML = Object.keys(programs).map(name => `
      <div class="program-item" data-program="${name}">
        <span>${name}</span>
        <span>→</span>
      </div>
    `).join('');

    // Add event listeners
    list.querySelectorAll('.program-item').forEach(item => {
      item.addEventListener('click', () => {
        const programName = item.dataset.program;
        editProgram(programName);
      });
    });
  }

  function editProgram(programName) {
    const programs = getWorkoutPrograms();
    const program = programs[programName];
    
    showMenuScreen('programEditMenu', `Редагування: ${programName}`);
    
    // Populate program editor
    document.getElementById('programNameEdit').value = programName;
    document.getElementById('exerciseDuration').value = program.duration;
    
    const exercisesList = document.getElementById('exercisesList');
    exercisesList.innerHTML = program.exercises.map((exercise, index) => `
      <div class="exercise-item" data-index="${index}">
        <span>${exercise}</span>
        <button onclick="removeExercise(${index})" style="background: rgba(255,0,0,0.2); border: none; border-radius: 4px; padding: 4px 8px; color: white;">×</button>
      </div>
    `).join('');

    // Store current program name for editing
    window.currentEditingProgram = programName;
  }

  // ===== DANCE TIMER =====
  document.querySelectorAll('.glass-timer-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const time = parseInt(btn.dataset.time);
      startDanceTimer(time);
      hideModal(danceModal);
    });
  });

  function startDanceTimer(minutes) {
    alert(`Танцювальний таймер на ${minutes} хвилин запущено! 🕺`);
  }

  // ===== ВАГА =====
  document.getElementById('saveWeight').addEventListener('click', () => {
    const weight = document.getElementById('weightInput').value;
    if (weight) {
      saveWeight(weight);
      document.getElementById('weightInput').value = '';
      loadWeightHistory();
    }
  });

  function saveWeight(weight) {
    const weights = JSON.parse(localStorage.getItem('weights') || '[]');
    const today = new Date().toISOString().split('T')[0];
    weights.push({ date: today, weight: parseFloat(weight) });
    localStorage.setItem('weights', JSON.stringify(weights));
    updateProgressBar();
  }

  function loadWeightHistory() {
    const weights = JSON.parse(localStorage.getItem('weights') || '[]');
    const historyEl = document.getElementById('weightHistory');
    historyEl.innerHTML = weights.slice(-5).reverse().map(entry => 
      `<div style="padding: 10px; margin: 5px 0; background: rgba(255,255,255,0.1); border-radius: 8px;">
        ${entry.date}: ${entry.weight} кг
      </div>`
    ).join('');
  }

  // ===== ДЕНЬ ВІДПОЧИНКУ =====
  document.getElementById('saveRestDay').addEventListener('click', () => {
    const note = document.getElementById('restDayNote').value;
    saveRestDay(note);
    document.getElementById('restDayNote').value = '';
    hideModal(restDayModal);
  });

  function saveRestDay(note) {
    const restDays = JSON.parse(localStorage.getItem('restDays') || '[]');
    const today = new Date().toISOString().split('T')[0];
    restDays.push({ date: today, note: note || 'День відпочинку' });
    localStorage.setItem('restDays', JSON.stringify(restDays));
    alert('День відпочинку додано! 🦥');
  }

  // ===== ДИНАМІЧНИЙ ПРОГРЕС-БАР =====
  function updateProgressBar() {
    const weights = JSON.parse(localStorage.getItem('weights') || '[]');
    const goals = JSON.parse(localStorage.getItem('goals') || '{"weight": 65}');
    const targetWeight = goals.weight || 65;
    
    if (weights.length === 0) {
      progressBar.style.width = '0%';
      progressBar.className = 'progress-line-fg progress-red';
      document.querySelector('.goal-bar span').innerHTML = `Мета: Схуднути до ${targetWeight} кг`;
      return;
    }

    const currentWeight = weights[weights.length - 1].weight;
    const startWeight = weights[0].weight;
    
    const progress = Math.max(0, Math.min(100, 
      ((startWeight - currentWeight) / (startWeight - targetWeight)) * 100
    ));

    progressBar.style.width = `${progress}%`;
    
    // Змінюємо колір залежно від прогресу
    progressBar.className = 'progress-line-fg';
    if (progress >= 95) {
      progressBar.classList.add('progress-green');
      document.querySelector('.goal-bar span').innerHTML = `Мета: Схуднути до ${targetWeight} кг ✅`;
    } else if (progress >= 75) {
      progressBar.classList.add('progress-yellow');
      document.querySelector('.goal-bar span').innerHTML = `Мета: Схуднути до ${targetWeight} кг (${Math.round(progress)}%)`;
    } else if (progress >= 50) {
      progressBar.classList.add('progress-orange');
      document.querySelector('.goal-bar span').innerHTML = `Мета: Схуднути до ${targetWeight} кг (${Math.round(progress)}%)`;
    } else {
      progressBar.classList.add('progress-red');
      document.querySelector('.goal-bar span').innerHTML = `Мета: Схуднути до ${targetWeight} кг (${Math.round(progress)}%)`;
    }
  }

  // ===== GOAL AND APP SETTINGS =====
  
  function loadGoalSettings() {
    const goals = JSON.parse(localStorage.getItem('goals') || '{}');
    document.getElementById('targetWeight').value = goals.weight || 65;
    document.getElementById('targetWorkouts').value = goals.workouts || 3;
    document.getElementById('targetSteps').value = goals.steps || 8000;
  }

  function saveGoalSettings() {
    const goals = {
      weight: parseFloat(document.getElementById('targetWeight').value),
      workouts: parseInt(document.getElementById('targetWorkouts').value),
      steps: parseInt(document.getElementById('targetSteps').value)
    };
    localStorage.setItem('goals', JSON.stringify(goals));
    updateProgressBar();
    alert('Цілі збережено!');
  }

  function loadAppSettings() {
    const settings = JSON.parse(localStorage.getItem('appSettings') || '{}');
    
    // Load theme
    const currentTheme = settings.theme || 'default';
    document.querySelectorAll('.theme-option').forEach(option => {
      option.classList.toggle('active', option.dataset.theme === currentTheme);
    });
    
    // Load font
    const currentFont = settings.font || 'Inter';
    document.getElementById('fontSelect').value = currentFont;
    document.documentElement.style.setProperty('--font-family', currentFont);
  }

  function applyTheme(themeName) {
    // Remove all theme classes
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    
    if (themeName !== 'default') {
      document.body.classList.add(`theme-${themeName}`);
    }
    
    // Save setting
    const settings = JSON.parse(localStorage.getItem('appSettings') || '{}');
    settings.theme = themeName;
    localStorage.setItem('appSettings', JSON.stringify(settings));
    
    // Update active theme option
    document.querySelectorAll('.theme-option').forEach(option => {
      option.classList.toggle('active', option.dataset.theme === themeName);
    });
  }

  function applyFont(fontName) {
    document.documentElement.style.setProperty('--font-family', `'${fontName}', sans-serif`);
    
    // Save setting
    const settings = JSON.parse(localStorage.getItem('appSettings') || '{}');
    settings.font = fontName;
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }

  // ===== EVENT LISTENERS FOR SETTINGS =====
  
  document.getElementById('saveGoals').addEventListener('click', saveGoalSettings);

  document.querySelectorAll('.theme-option').forEach(option => {
    option.addEventListener('click', () => {
      applyTheme(option.dataset.theme);
    });
  });

  document.getElementById('fontSelect').addEventListener('change', (e) => {
    applyFont(e.target.value);
  });

  // Program editing functions
  document.getElementById('saveProgramName').addEventListener('click', () => {
    const oldName = window.currentEditingProgram;
    const newName = document.getElementById('programNameEdit').value.trim();
    
    if (newName && newName !== oldName) {
      const programs = getWorkoutPrograms();
      programs[newName] = programs[oldName];
      delete programs[oldName];
      saveWorkoutPrograms(programs);
      
      window.currentEditingProgram = newName;
      populateWorkoutPrograms();
      alert('Назву програми змінено!');
    }
  });

  document.getElementById('applyToAllExercises').addEventListener('click', () => {
    const duration = parseInt(document.getElementById('exerciseDuration').value);
    const programName = window.currentEditingProgram;
    
    if (duration && programName) {
      const programs = getWorkoutPrograms();
      programs[programName].duration = duration;
      saveWorkoutPrograms(programs);
      alert(`Тривалість ${duration} секунд застосовано до всіх вправ!`);
    }
  });

  document.getElementById('addExercise').addEventListener('click', () => {
    const exerciseName = prompt('Введіть назву нової вправи:');
    if (exerciseName && exerciseName.trim()) {
      const programName = window.currentEditingProgram;
      const programs = getWorkoutPrograms();
      programs[programName].exercises.push(exerciseName.trim());
      saveWorkoutPrograms(programs);
      editProgram(programName); // Refresh the view
    }
  });

  // Global function for removing exercises
  window.removeExercise = function(index) {
    const programName = window.currentEditingProgram;
    const programs = getWorkoutPrograms();
    programs[programName].exercises.splice(index, 1);
    saveWorkoutPrograms(programs);
    editProgram(programName); // Refresh the view
  };

  // ===== EXIT CONFIRMATION =====
  
  window.confirmExitTraining = function() {
    if (confirm('Завершити тренування?')) {
      isStarted = false;
      isPaused = false;
      clearInterval(timerInterval);
      showScreen('homeScreen');
    }
  };

  // ===== ІНІЦІАЛІЗАЦІЯ =====
// ✨ Нова магія: вішаємо один обробник на всі плитки тренувань ✨
workoutTiles.forEach(tile => {
  tile.addEventListener('click', () => {
    const programName = tile.dataset.program;
    if (programName) {
      startWorkout(programName);
    }
  });
});

// Показуємо головний екран при завантаженні
showScreen('homeScreen');
