document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('touchstart', () => {}, {passive: true});

  // --- DOM-елементи ---
  // ... (всі твої старі const залишаються тут)
  const exerciseAudioInput = document.getElementById('exerciseAudioInput'); // ДОДАНО
  // ... (решта твоїх const)

  // ... (весь твій код до "Логіка налаштувань тренувань" залишається без змін)

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

