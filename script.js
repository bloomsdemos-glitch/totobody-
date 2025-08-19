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
  const exerciseAudioInput = document.getElementById('exerciseAudioInput'); // Наше нове поле
  const saveExerciseBtn = document.getElementById('saveExerciseBtn');
  const closeExerciseModalBtn = exerciseModal.querySelector('.close-button'); // А ось і винуватець
  const finishModal = document.getElementById('finishModal');
  const caloriesInput = document.getElementById('caloriesInput');
  const difficultySlider = document.getElementById('difficultySlider');
  const sliderEmojiBubble = document.getElementById('sliderEmojiBubble');
  const energyRating = document.getElementById('energyRating');
  const starRating = document.getElementById('starRating');
  const saveWorkoutLogBtn = document.getElementById('saveWorkoutLogBtn');
  const expandTagsBtn = document.getElementById('expandTagsBtn');
  const extraTagsSection = document.getElementById('extraTagsSection');

  // --- Логіка налаштувань тренувань (ПОВНІСТЮ ОНОВЛЕНО) ---
  let workoutPrograms = {}; 
  let currentlyEditingProgram = null;
  let currentlyEditingExerciseIndex = null; // Для відстеження, яку вправу редагуємо

  function loadPrograms() { /* ... без змін ... */ }
  function savePrograms() { /* ... без змін ... */ }
  function renderProgramList() { /* ... без змін ... */ }

  // ОНОВЛЕНО: Тепер ця функція створює кнопки "Редагувати" і "Видалити"
  function renderExerciseList(programName) {
    if (!exerciseListEl) return;
    const program = workoutPrograms[programName];
    exerciseListEl.innerHTML = '';

    if (program && program.exercises.length > 0) {
        program.exercises.forEach((exercise, index) => {
            const li = document.createElement('li');
            li.className = 'exercise-list-item'; // Новий клас для стилізації
            
            const infoSpan = document.createElement('span');
            infoSpan.textContent = `${exercise.name} (${exercise.duration}с)`;
            
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'exercise-item-actions';

            const editBtn = document.createElement('button');
            editBtn.textContent = '✏️';
            editBtn.addEventListener('click', () => {
              openExerciseEditor('edit', programName, index);
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '🗑️';
            deleteBtn.addEventListener('click', () => {
              if (confirm(`Видалити вправу "${exercise.name}"?`)) {
                program.exercises.splice(index, 1);
                savePrograms();
                renderExerciseList(programName);
              }
            });

            actionsDiv.appendChild(editBtn);
            actionsDiv.appendChild(deleteBtn);
            li.appendChild(infoSpan);
            li.appendChild(actionsDiv);
            exerciseListEl.appendChild(li);
        });
    } else { 
        exerciseListEl.innerHTML = '<li>(Вправ ще немає)</li>'; 
    }
  }

  function openProgramEditor(programName) {
    currentlyEditingProgram = programName;
    // ... (решта функції без змін)
    renderExerciseList(programName);
  }

  // НОВА ФУНКЦІЯ: Відкриває модалку для додавання/редагування вправи
  function openExerciseEditor(mode, programName, exerciseIndex = null) {
    currentlyEditingProgram = programName;
    currentlyEditingExerciseIndex = exerciseIndex;

    if (mode === 'edit') {
      const exercise = workoutPrograms[programName].exercises[exerciseIndex];
      exerciseModalTitle.textContent = "Редагувати вправу";
      exerciseNameInput.value = exercise.name;
      exerciseDurationInput.value = exercise.duration;
      exerciseAudioInput.value = exercise.audio || ''; // Показуємо назву аудіофайлу, якщо є
    } else { // mode === 'add'
      exerciseModalTitle.textContent = "Нова вправа";
      exerciseNameInput.value = '';
      exerciseDurationInput.value = 30;
      exerciseAudioInput.value = '';
      currentlyEditingExerciseIndex = null;
    }
    exerciseModal.classList.add('active');
  }

  if (addExerciseBtn) {
      addExerciseBtn.addEventListener('click', () => {
          openExerciseEditor('add', currentlyEditingProgram);
      });
  }

  // ОНОВЛЕНО: Тепер ця кнопка вміє і додавати, і оновлювати вправу
  if (saveExerciseBtn) {
      saveExerciseBtn.addEventListener('click', () => {
          const name = exerciseNameInput.value.trim();
          const duration = parseInt(exerciseDurationInput.value, 10);
          const audio = exerciseAudioInput.value.trim();

          if (name && duration > 0 && currentlyEditingProgram) {
              const newExercise = { name, duration, audio };

              if (currentlyEditingExerciseIndex !== null) {
                // Режим редагування
                workoutPrograms[currentlyEditingProgram].exercises[currentlyEditingExerciseIndex] = newExercise;
              } else {
                // Режим додавання
                workoutPrograms[currentlyEditingProgram].exercises.push(newExercise);
              }
              
              savePrograms();
              renderExerciseList(currentlyEditingProgram);
              exerciseModal.classList.remove('active');
          } else { 
              alert('Будь ласка, введи коректну назву та тривалість.'); 
          }
      });
  }

  if (closeExerciseModalBtn) { /* ... без змін ... */ }
  // ... (решта коду, що стосується налаштувань програм, залишається без змін)
  
  
  // --- Логіка модалки після тренування (ПОВНІСТЮ ОНОВЛЕНО) ---
  // ... (весь цей блок залишається таким, як ми зробили минулого разу)


  // ... (решта твого JS коду без змін)
});

