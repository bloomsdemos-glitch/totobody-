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

  // --- НОВІ ФУНКЦІЇ-ПОМІЧНИКИ ДЛЯ ЧАСУ ---
  /**
   * Перетворює рядок формату "хх:сс" в загальну кількість секунд.
   * @param {string} timeString - Рядок часу, наприклад "01:20".
   * @returns {number} Загальна кількість секунд, наприклад 80.
   */
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

  /**
   * Форматує загальну кількість секунд в рядок "хх:сс".
   * @param {number} totalSeconds - Загальна кількість секунд, наприклад 80.
   * @returns {string} Рядок часу, наприклад "01:20".
   */
  function formatSecondsToTime(totalSeconds) {
    if (isNaN(totalSeconds) || totalSeconds < 0) {
      totalSeconds = 0;
    }
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }


  function showScreen(screenId) { /* ... без змін ... */ }
  if (datetimeDisplayEl) { /* ... без змін ... */ }
  
  // --- Логіка тренувань ---
  let workoutPrograms = {};
  let currentlyEditingProgram = null;
  let currentlyEditingExerciseIndex = null;
  // ... (решта коду до renderExerciseList без змін)
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
    const currentExercise = exercises[currentIndex];
    if (currentExercise && currentExercise.audio) {
      const audioPath = `audio/${currentExercise.audio}`;
      const exerciseSound = new Audio(audioPath);
      exerciseSound.play().catch(error => console.error(`Помилка відтворення аудіо: ${audioPath}`, error));
    }
  }

  // ОНОВЛЕНО: Тепер використовуємо нову функцію форматування
  function updateUI() {
    const currentExercise = exercises[currentIndex];
    if (currentExercise) {
      trainingProgramNameEl.textContent = currentProgram;
      exerciseNameEl.textContent = currentExercise.name;
    }
    timerEl.textContent = formatSecondsToTime(remainingTime); // ВИКОРИСТОВУЄМО НОВУ ФУНКЦІЮ
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
  
  // ... (решта коду до loadPrograms без змін)

  function loadPrograms() {
    const savedPrograms = localStorage.getItem('workoutPrograms');
    if (savedPrograms) {
        workoutPrograms = JSON.parse(savedPrograms);
    } else {
        workoutPrograms = {
            "HIIT BASIC": { exercises: [{name: "Стрибки джек", duration: 30, audio: 'jack.mp3'}, {name: "Берпі", duration: 45, audio: 'burpee.mp3'}] },
            "HIIT ULTRA": { exercises: [] },
            "HIIT PRO": { exercises: [] },
            "MIXED BASIC": { exercises: [] },
            "DUMBBELL": { exercises: [] },
            "BODYWEIGHT": { exercises: [] }
        };
    }
  }
  function savePrograms() { localStorage.setItem('workoutPrograms', JSON.stringify(workoutPrograms)); }
  function renderProgramList() { if (!programListEl) return; programListEl.innerHTML = ''; for (const programName in workoutPrograms) { const li = document.createElement('li'); li.className = 'program-list-item'; li.dataset.programName = programName; li.innerHTML = `<span>${programName}</span><span class="arrow">></span>`; li.addEventListener('click', () => { openProgramEditor(programName); }); programListEl.appendChild(li); } }
  
  // ОНОВЛЕНО: Повністю перероблено для відображення часу і нових іконок
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
              </div>
            `;
            
            exerciseListEl.appendChild(li);
        });

        // Додаємо обробники подій для нових кнопок
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

  function openProgramEditor(programName) { /* ... без змін ... */ }
  
  // ОНОВЛЕНО: Використовує форматування часу
  function openExerciseEditor(mode, programName, exerciseIndex = null) {
    currentlyEditingProgram = programName;
    currentlyEditingExerciseIndex = exerciseIndex;
    if (mode === 'edit') {
      const exercise = workoutPrograms[programName].exercises[exerciseIndex];
      exerciseModalTitle.textContent = "Редагувати вправу";
      exerciseNameInput.value = exercise.name;
      exerciseDurationInput.value = formatSecondsToTime(exercise.duration); // ВИКОРИСТОВУЄМО НОВУ ФУНКЦІЮ
      exerciseAudioInput.value = exercise.audio || '';
    } else {
      exerciseModalTitle.textContent = "Нова вправа";
      exerciseNameInput.value = '';
      exerciseDurationInput.value = '00:30'; // Стандартне значення
      exerciseAudioInput.value = '';
      currentlyEditingExerciseIndex = null;
    }
    exerciseModal.classList.add('active');
  }

  if (addExerciseBtn) { addExerciseBtn.addEventListener('click', () => openExerciseEditor('add', currentlyEditingProgram)); }
  
  // ОНОВЛЕНО: Використовує парсинг часу
  if (saveExerciseBtn) {
      saveExerciseBtn.addEventListener('click', () => {
          const name = exerciseNameInput.value.trim();
          const durationString = exerciseDurationInput.value.trim();
          const duration = parseTimeToSeconds(durationString); // ВИКОРИСТОВУЄМО НОВУ ФУНКЦІЮ
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

  // ... (решта коду до кінця файлу без змін) ...
});