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

// --- Екран відліку ---
const countdownScreen = document.getElementById('countdownScreen');
const countdownNumberEl = document.getElementById('countdownNumber');


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

  // --- Glassmorphism модалки (ЗАКОМЕНТОВАНО, бо ще немає HTML) ---
  // const danceModal = document.getElementById('danceModal');
  // const weightModal = document.getElementById('weightModal');
  // const restDayModal = document.getElementById('restDayModal');
  // const closeModalBtns = document.querySelectorAll('.close-modal');

  // --- Прогрес-бар ---
  const progressBar = document.querySelector('.progress-line-fg');

  // --- Menu screens (ЗАКОМЕНТОВАНО, бо ще немає HTML) ---
  // const menuBackBtn = document.getElementById('menuBackBtn');
  // const menuTitle = document.getElementById('menuTitle');
  // const mainMenu = document.getElementById('mainMenu');
  // const workoutSettingsMenu = document.getElementById('workoutSettingsMenu');
  // const programEditMenu = document.getElementById('programEditMenu');
  // const statsSettingsMenu = document.getElementById('statsSettingsMenu');
  // const goalSettingsMenu = document.getElementById('goalSettingsMenu');
  // const appSettingsMenu = document.getElementById('appSettingsMenu');

  // ===== Пули вправ =====
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
    } else if (program === 'DUMBBELL') { // Змінив назву на відповідну до data-program в HTML
        basePool = poolMIX;
    } else if (program === 'BODYWEIGHT') { // Змінив назву на відповідну до data-program в HTML
        basePool = poolCommon;
    } else {
        basePool = poolCommon;
    }
    const workoutNames = shuffle([...new Set([...basePool, ...poolCommon])]).slice(0, 10);
    const workout = workoutNames.map(name => ({ name: name, duration: 30 }));
    workout.push({ name: 'Кінець тренування', duration: 3 });
    return workout;
  }

  // ===== Стан тренування =====
  let currentProgram = '';
  let exercises = [];
  let currentIndex = 0;
  let remainingTime = 0;
  let timerInterval = null;
  let isPaused = true;
  let isStarted = false;
  const DEFAULT_DURATION = 30;

  // ===== Функції тренування =====
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

  // Нова функція, яка ТІЛЬКИ запускає відлік
function startWorkout(programName) {
  let count = 3; // Починаємо з 3

  // Показуємо екран відліку
  countdownNumberEl.textContent = count;
  countdownScreen.classList.add('active');

  const countdownInterval = setInterval(() => {
    count--;
    if (count > 0) {
      // Оновлюємо цифру
      countdownNumberEl.textContent = count;
    } else {
      // Коли дійшло до 0, зупиняємо відлік
      clearInterval(countdownInterval);
      // Ховаємо екран відліку
      countdownScreen.classList.remove('active');
      // І ТІЛЬКИ ТЕПЕР реально запускаємо тренування
      _actuallyStartWorkout(programName);
    }
  }, 1000); // Інтервал в 1 секунду
}

// Стара логіка старту, винесена в окрему функцію з підкресленням
function _actuallyStartWorkout(programName) {
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

// Нова функція для підтвердження виходу
function confirmExitTraining() {
  // Якщо тренування ще не почалось, просто виходимо
  if (!isStarted) {
    showScreen('homeScreen');
    return;
  }

  // Показуємо стандартне вікно браузера з питанням
  const userIsSure = confirm("Точно хочеш завершити тренування?");

  // Якщо користувач натиснув "ОК" (true), то завершуємо тренування
  if (userIsSure) {
    finishWorkout();
  }
  // Якщо натиснув "Cancel", нічого не відбувається
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

// Нова функція для підтвердження виходу
function confirmExitTraining() {
  // Якщо тренування ще не почалось, просто виходимо
  if (!isStarted) {
    showScreen('homeScreen');
    return;
  }

  // Показуємо стандартне вікно браузера з питанням
  const userIsSure = confirm("Точно хочеш завершити тренування?");

  // Якщо користувач натиснув "ОК" (true), то завершуємо тренування
  if (userIsSure) {
    finishWorkout();
  }
  // Якщо натиснув "Cancel", нічого не відбувається
}


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

  // ===== Логіка Модального Вікна =====
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
    startWorkout(programName); // <-- Тут запускається відлік
    modalStartBtn.removeEventListener('click', startFunction);
  };
  modalStartBtn.addEventListener('click', startFunction);
}

workoutTiles.forEach(tile => {
  tile.addEventListener('click', () => {
    const programName = tile.dataset.program;
    if (programName) {
      openWorkoutModal(programName); // <-- Тут відкривається модалка
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



  workoutModal.addEventListener('click', (event) => {
    if (event.target === workoutModal) {
      workoutModal.classList.remove('active');
    }
  });

  // ===== Обробник для кнопки налаштувань в модалці =====
  modalSettingsBtn.addEventListener('click', () => {
    alert('Тут буде вікно налаштувань і кастомізації плитки!');
  });
  
  // Показуємо головний екран при завантаженні
  showScreen('homeScreen');
});
