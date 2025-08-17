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
  const trainingBackBtn = document.getElementById('trainingBackBtn');
  const trainingProgramNameEl = document.getElementById('trainingProgramName');
  const exerciseNameEl = document.getElementById('exerciseName');
  const timerEl = document.getElementById('timer');
  const prevBtn = document.getElementById('prevExercise');
  const pauseBtn = document.getElementById('pauseBtn');
  const stopBtn = document.getElementById('stopBtn');
  const nextBtn = document.getElementById('nextExercise');
  const completedListEl = document.getElementById('completedExercises');

  // ===== Пули вправ =====
  const poolHIIT = ['Берпі', 'Джамп-сквот', 'Спринт на місці', 'Альпініст', 'Планка', 'Стрибки джек'];
  const poolMIX = ['Присідання з гантелями','Тяга гантелей у нахилі','Жим гантелей лежачи', 'Махи гантелями в сторони'];
  const poolCommon = ['Віджимання','Планка','Стрибки на місці','Випади','Скручування','Підйоми ніг'];
  
  // ===== Оновлення дати і часу в хедері =====
const datetimeDisplayEl = document.getElementById('datetime-display');

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

// Запускаємо функцію одразу, а потім оновлюємо кожну секунду
updateDateTime();
setInterval(updateDateTime, 1000);

  
  // ===== Логіка генерації тренувань =====
  function shuffle(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
  }

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

  function finishWorkout() {
    clearInterval(timerInterval);
    isStarted = false;
    isPaused = true;
    alert('Тренування завершено! 💪');
    showScreen('homeScreen');
  }

  function confirmExitTraining() {
    if (!isStarted) {
      showScreen('homeScreen');
      return;
    }
    if (confirm("Точно хочеш завершити тренування?")) {
      finishWorkout();
    }
  }

  // ===== Логіка відліку і старту =====
  function startWorkout(programName) {
    let count = 3;
    const countdownScreen = document.getElementById('countdownScreen');
    const countdownNumberEl = document.getElementById('countdownNumber');
    
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
    remainingTime = exercises[0]?.duration || DEFAULT_DURATION;
    isStarted = true;
    isPaused = false;
    updateUI();
    startTimer();
    showScreen('trainingScreen');
  }

  // ===== Обробники кнопок керування =====
  pauseBtn.addEventListener('click', () => {
    if (!isStarted) return;
    isPaused = !isPaused;
    updateUI();
  });

  stopBtn.addEventListener('click', confirmExitTraining);
  trainingBackBtn.addEventListener('click', confirmExitTraining);

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

  modalSettingsBtn.addEventListener('click', () => {
    alert('Тут буде вікно налаштувань і кастомізації плитки!');
  });
  
  // ===== Ініціалізація =====
  showScreen('homeScreen');
});
