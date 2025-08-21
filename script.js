document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('touchstart', () => {}, { passive: true });

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
    const caloriesIcon = document.getElementById('caloriesIcon');
    const difficultySlider = document.getElementById('difficultySlider');
    const sliderEmojiBubble = document.getElementById('sliderEmojiBubble');
    const energyRating = document.getElementById('energyRating');
    const starRating = document.getElementById('starRating');
    const saveWorkoutLogBtn = document.getElementById('saveWorkoutLogBtn');
    const expandTagsBtn = document.getElementById('expandTagsBtn');
    const extraTagsSection = document.getElementById('extraTagsSection');
    const restDayBtn = document.getElementById('restDayBtn');
    const historyListEl = document.getElementById('historyList');
    const dayDetailScreen = document.getElementById('dayDetailScreen');
    const detailBackBtn = document.getElementById('detailBackBtn');
    const detailDateEl = document.getElementById('detailDate');
    const detailTitleEl = document.getElementById('detailTitle');
    const detailStatsListEl = document.getElementById('detailStatsList');
    const prevDayBtn = document.getElementById('prevDayBtn');
    const nextDayBtn = document.getElementById('nextDayBtn');
    const editDayBtn = document.getElementById('editDayBtn');

    let isMuted = false;
    let isShuffleActive = false;
    let currentSelectedDate = null;

    // --- ПІДСВІЧУВАННЯ ІКОНКИ КАЛОРІЙ ---
    let typingTimer;
    if (caloriesInput && caloriesIcon) {
        caloriesInput.addEventListener('input', function() {
            clearTimeout(typingTimer);
            
            if (this.value.trim() !== '') {
                caloriesIcon.classList.add('highlight');
            } else {
                caloriesIcon.classList.remove('highlight');
            }
            
            // Видаляємо підсвічування через 2 секунди після зупинки введення
            typingTimer = setTimeout(() => {
                if (this.value.trim() === '') {
                    caloriesIcon.classList.remove('highlight');
                }
            }, 2000);
        });

        // Видаляємо підсвічування при втраті фокусу, якщо поле порожнє
        caloriesInput.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                caloriesIcon.classList.remove('highlight');
            }
        });
    }

    // --- НОВІ НАЛАШТУВАННЯ ФОНІВ ---
    const backgroundInputs = {
        training: document.getElementById('trainingBgInput'),
        stats: document.getElementById('statsBgInput'), 
        calendar: document.getElementById('calendarBgInput'),
        dayDetail: document.getElementById('dayDetailBgInput')
    };

    // Обробники кнопок налаштування фонів
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('bg-control-btn')) {
            const action = e.target.getAttribute('data-action');
            const target = e.target.getAttribute('data-target');
            
            if (action === 'save' && backgroundInputs[target]) {
                const url = backgroundInputs[target].value.trim();
                if (url) {
                    localStorage.setItem(`background-${target}`, url);
                    applyBackgroundToScreen(target, url);
                    showToast('Фон збережено!');
                } else {
                    showToast('Введіть URL фону', 'error');
                }
            } else if (action === 'reset') {
                localStorage.removeItem(`background-${target}`);
                if (backgroundInputs[target]) {
                    backgroundInputs[target].value = '';
                }
                applyBackgroundToScreen(target, '');
                showToast('Фон скинуто!');
            }
        }
    });

    // Функція застосування фону до конкретного екрану
    function applyBackgroundToScreen(screenType, url) {
        const defaultBg = 'var(--bg-color)';
        let targetElement;

        switch(screenType) {
            case 'training':
                targetElement = trainingScreen;
                break;
            case 'stats':
                targetElement = document.getElementById('statsSettingsMenu');
                break;
            case 'calendar':
                targetElement = document.getElementById('calendarMenu');
                break;
            case 'dayDetail':
                targetElement = dayDetailScreen;
                break;
        }

        if (targetElement) {
            if (url) {
                targetElement.style.backgroundImage = `url(${url})`;
                targetElement.style.backgroundSize = 'cover';
                targetElement.style.backgroundPosition = 'center';
                targetElement.style.backgroundAttachment = 'fixed';
            } else {
                targetElement.style.backgroundImage = '';
                targetElement.style.background = screenType === 'dayDetail' ? '#000000' : defaultBg;
            }
        }
    }

    // Завантаження збережених фонів при старті
    function loadSavedBackgrounds() {
        Object.keys(backgroundInputs).forEach(screenType => {
            const savedBg = localStorage.getItem(`background-${screenType}`);
            if (savedBg && backgroundInputs[screenType]) {
                backgroundInputs[screenType].value = savedBg;
                applyBackgroundToScreen(screenType, savedBg);
            }
        });
    }

    // Простий toast для сповіщень
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'error' ? '#CB444A' : '#2ed573'};
            color: white;
            padding: 12px 20px;
            border-radius: 16px;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

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

        // Керуємо видимістю і темою хедера/футера для DayDetailScreen
        if (screenId === 'dayDetailScreen') {
            // На dayDetailScreen ми маємо власний header, тому ховаємо основний
            // Але тут ми залишаємо його, просто змінюємо тему
        }
    }

    // --- ФУНКЦІЯ ВІДКРИТТЯ DAYDETAILSCREEN ЯК ОКРЕМОЇ СТОРІНКИ ---
    function openDayDetails(dateStr) {
        currentSelectedDate = dateStr;
        
        // Закриваємо меню
        sideMenu.classList.remove('active');
        
        // Переходимо на сторінку деталей дня
        showScreen('dayDetailScreen');
        
        // Заповнюємо дані
        populateDayDetails(dateStr);
    }

    function populateDayDetails(dateStr) {
        if (!dateStr) return;

        // Форматуємо дату для відображення
        const date = new Date(dateStr + 'T00:00:00');
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const formattedDate = date.toLocaleDateString('uk-UA', options);
        
        if (detailDateEl) {
            detailDateEl.textContent = formattedDate;
        }

        // Отримуємо дані за цей день
        const dayData = getWorkoutDataForDate(dateStr);
        
        // Встановлюємо заголовок
        if (detailTitleEl) {
            detailTitleEl.textContent = dayData.hasWorkout ? 'День тренування' : 'Вихідний';
        }

        // Заповнюємо список статистики
        if (detailStatsListEl) {
            detailStatsListEl.innerHTML = '';
            
            if (dayData.calories) {
                const li = document.createElement('li');
                li.innerHTML = `<i class="bi bi-fire"></i> Спалені калорії — ${dayData.calories}`;
                detailStatsListEl.appendChild(li);
            }
            
            if (dayData.steps) {
                const li = document.createElement('li');
                li.innerHTML = `<i class="bi bi-triangle"></i> Кроки — ${dayData.steps}`;
                detailStatsListEl.appendChild(li);
            }
            
            if (dayData.energy) {
                const li = document.createElement('li');
                li.innerHTML = `<i class="bi bi-lightning"></i> Рівень енергії — ${dayData.energy}`;
                detailStatsListEl.appendChild(li);
            }
            
            if (dayData.weight) {
                const li = document.createElement('li');
                li.innerHTML = `<i class="bi bi-speedometer2"></i> Вага — ${dayData.weight} кг`;
                detailStatsListEl.appendChild(li);
            }

            if (dayData.program) {
                const li = document.createElement('li');
                li.innerHTML = `<i class="bi bi-play-circle"></i> Програма — ${dayData.program}`;
                detailStatsListEl.appendChild(li);
            }

            // Якщо немає даних взагалі
            if (detailStatsListEl.children.length === 0) {
                const li = document.createElement('li');
                li.innerHTML = `<i class="bi bi-info-circle"></i> Дані за цей день відсутні`;
                li.style.opacity = '0.6';
                detailStatsListEl.appendChild(li);
            }
        }
    }

    function getWorkoutDataForDate(dateStr) {
        // Отримуємо дані з localStorage або створюємо заглушку
        const workoutHistory = JSON.parse(localStorage.getItem('workoutHistory') || '{}');
        const dayData = workoutHistory[dateStr] || {};

        return {
            hasWorkout: !!dayData.program,
            calories: dayData.calories,
            steps: dayData.steps,
            energy: dayData.energy,
            weight: dayData.weight,
            program: dayData.program,
            date: dateStr
        };
    }

    // Навігація між днями в DayDetailScreen
    if (prevDayBtn) {
        prevDayBtn.addEventListener('click', () => {
            if (currentSelectedDate) {
                const currentDate = new Date(currentSelectedDate + 'T00:00:00');
                currentDate.setDate(currentDate.getDate() - 1);
                const newDateStr = currentDate.toISOString().split('T')[0];
                currentSelectedDate = newDateStr;
                populateDayDetails(newDateStr);
            }
        });
    }

    if (nextDayBtn) {
        nextDayBtn.addEventListener('click', () => {
            if (currentSelectedDate) {
                const currentDate = new Date(currentSelectedDate + 'T00:00:00');
                currentDate.setDate(currentDate.getDate() + 1);
                const newDateStr = currentDate.toISOString().split('T')[0];
                currentSelectedDate = newDateStr;
                populateDayDetails(newDateStr);
            }
        });
    }

    if (editDayBtn) {
        editDayBtn.addEventListener('click', () => {
            showToast('Функція редагування буде додана в наступному оновленні');
        });
    }

    // Кнопка назад з DayDetailScreen
    if (detailBackBtn) {
        detailBackBtn.addEventListener('click', () => {
            showScreen('homeScreen');
        });
    }

    // --- ОНОВЛЕННЯ ДАТИ-ЧАСУ ---
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

    // --- ПРОГРАМИ ТРЕНУВАНЬ ---
    let workoutPrograms = {};
    let currentlyEditingProgram = null;
    let currentlyEditingExerciseIndex = null;

    function buildWorkout(programName) {
        const programData = workoutPrograms[programName] || {};
        let exercises = programData.exercises ? [...programData.exercises] : [];

        if (exercises.length > 0) {
            const workout = exercises.map(ex => ({
                name: ex.name,
                duration: ex.duration || 30,
                audio: ex.audio
            }));
            workout.push({ name: 'Кінець тренування', duration: 3 });
            return workout;
        } else {
            const poolCommon = ['Віджимання', 'Планка', 'Стрибки на місці', 'Випади', 'Скручування'];
            const workoutNames = [...poolCommon].sort(() => Math.random() - 0.5).slice(0, 10);
            const workout = workoutNames.map(name => ({ name, duration: 30 }));
            workout.push({ name: 'Кінець тренування', duration: 3 });
            return workout;
        }
    }

    // --- ТРЕНУВАЛЬНА ЛОГІКА ---
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
            exerciseNameEl.textContent = currentExercise.name;
            timerEl.textContent = formatSecondsToTime(remainingTime);
        }
    }

    function completeExercise() {
        const completedExercise = exercises[currentIndex];
        if (completedExercise && completedExercise.name !== 'Кінець тренування') {
            const exerciseItem = document.createElement('div');
            exerciseItem.className = 'completed-exercise';
            exerciseItem.innerHTML = `<i class="bi bi-check-circle"></i> ${completedExercise.name}`;
            completedListEl.appendChild(exerciseItem);
        }
    }

    function nextExercise() {
        completeExercise();
        if (currentIndex < exercises.length - 1) {
            currentIndex++;
            const nextExercise = exercises[currentIndex];
            remainingTime = parseTimeToSeconds(nextExercise.duration);
            updateUI();
            if (nextExercise.name === 'Кінець тренування') {
                showFinishModal();
                return;
            }
            playCurrentExerciseSound();
        } else {
            showFinishModal();
        }
    }

    function prevExercise() {
        if (currentIndex > 0) {
            currentIndex--;
            const prevExercise = exercises[currentIndex];
            remainingTime = parseTimeToSeconds(prevExercise.duration);
            updateUI();
            playCurrentExerciseSound();
        }
    }

    function startTimer() {
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            if (remainingTime > 0) {
                remainingTime--;
                updateUI();
            } else {
                nextExercise();
            }
        }, 1000);
    }

    function pauseTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    function togglePause() {
        if (isPaused) {
            startTimer();
            pauseBtn.innerHTML = '<i class="bi bi-pause-circle-fill"></i>';
            isPaused = false;
        } else {
            pauseTimer();
            pauseBtn.innerHTML = '<i class="bi bi-play-circle-fill"></i>';
            isPaused = true;
        }
    }

    function stopWorkout() {
        pauseTimer();
        showScreen('homeScreen');
        resetWorkout();
    }

    function resetWorkout() {
        currentIndex = 0;
        remainingTime = 0;
        isPaused = true;
        isStarted = false;
        completedListEl.innerHTML = '';
        pauseBtn.innerHTML = '<i class="bi bi-play-circle-fill"></i>';
    }

    function startWorkout(programName) {
        currentProgram = programName;
        exercises = buildWorkout(programName);
        
        if (isShuffleActive) {
            const lastExercise = exercises.pop();
            exercises = exercises.sort(() => Math.random() - 0.5);
            exercises.push(lastExercise);
        }

        currentIndex = 0;
        remainingTime = parseTimeToSeconds(exercises[0].duration);
        trainingProgramNameEl.textContent = programName;
        
        showCountdown(() => {
            showScreen('trainingScreen');
            updateUI();
            playCurrentExerciseSound();
            isStarted = true;
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
                callback();
            }
        }, 1000);
    }

    function showFinishModal() {
        pauseTimer();
        finishModal.classList.add('active');
    }

    // --- ІСТОРІЯ ТРЕНУВАНЬ ---
    function loadWorkoutHistory() {
        if (!historyListEl) return;
        
        const workoutHistory = JSON.parse(localStorage.getItem('workoutHistory') || '{}');
        const dates = Object.keys(workoutHistory).sort().reverse();
        
        historyListEl.innerHTML = '';
        
        if (dates.length === 0) {
            const li = document.createElement('li');
            li.innerHTML = '<span style="opacity: 0.6;">Історія тренувань порожня</span>';
            historyListEl.appendChild(li);
            return;
        }

        dates.forEach(date => {
            const data = workoutHistory[date];
            const li = document.createElement('li');
            const dateFormatted = new Date(date + 'T00:00:00').toLocaleDateString('uk-UA', {
                weekday: 'short',
                month: 'short', 
                day: 'numeric'
            });
            
            const a = document.createElement('a');
            a.href = '#';
            a.innerHTML = `
                <span>${dateFormatted}</span>
                <span style="opacity: 0.7;">${data.program || 'Вихідний'}</span>
            `;
            
            a.addEventListener('click', (e) => {
                e.preventDefault();
                openDayDetails(date);
            });
            
            li.appendChild(a);
            historyListEl.appendChild(li);
        });
    }

    function saveWorkoutLog() {
        const calories = caloriesInput.value;
        const difficulty = difficultySlider.value;
        const energy = document.querySelector('#energyRating .active')?.getAttribute('data-value') || '3';
        const rating = document.querySelectorAll('#starRating .active').length;

        const today = new Date().toISOString().split('T')[0];
        const workoutHistory = JSON.parse(localStorage.getItem('workoutHistory') || '{}');
        
        workoutHistory[today] = {
            program: currentProgram,
            calories: calories ? parseInt(calories) : null,
            difficulty: parseInt(difficulty),
            energy: energy,
            rating: rating,
            date: today
        };

        localStorage.setItem('workoutHistory', JSON.stringify(workoutHistory));
        finishModal.classList.remove('active');
        showScreen('homeScreen');
        resetWorkout();
        
        // Оновлюємо історію в меню
        loadWorkoutHistory();
        
        showToast('Результат тренування збережено!');
    }

    // --- МЕНЮ НАВІГАЦІЯ ---
    function showMenuScreen(targetId) {
        document.querySelectorAll('.menu-screen').forEach(s => s.classList.remove('active'));
        const targetScreen = document.getElementById(targetId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            
            // Оновлюємо заголовок меню
            switch(targetId) {
                case 'workoutSettingsMenu':
                    menuTitle.textContent = 'Програми тренувань';
                    loadProgramsList();
                    break;
                case 'appSettingsMenu':
                    menuTitle.textContent = 'Налаштування додатку';
                    break;
                case 'historyMenu':
                    menuTitle.textContent = 'Історія тренувань';
                    loadWorkoutHistory();
                    break;
                case 'statsSettingsMenu':
                    menuTitle.textContent = 'Статистика';
                    break;
                case 'goalSettingsMenu':
                    menuTitle.textContent = 'Мета';
                    break;
                case 'calendarMenu':
                    menuTitle.textContent = 'Календар';
                    break;
                case 'programEditMenu':
                    menuTitle.textContent = 'Редагувати програму';
                    break;
                case 'addProgramMenu':
                    menuTitle.textContent = 'Нова програма';
                    break;
                default:
                    menuTitle.textContent = 'Меню';
            }
        }
    }

    // --- EVENT LISTENERS ---

    // Бургер меню
    if (burgerBtn) {
        burgerBtn.addEventListener('click', () => {
            sideMenu.classList.add('active');
            showMenuScreen('mainMenu');
        });
    }

    // Закриття меню
    if (menuBackBtn) {
        menuBackBtn.addEventListener('click', () => {
            if (!mainMenu.classList.contains('active')) {
                showMenuScreen('mainMenu');
            } else {
                sideMenu.classList.remove('active');
            }
        });
    }

    // Оверлей для закриття меню
    document.querySelector('.menu-overlay-close')?.addEventListener('click', () => {
        sideMenu.classList.remove('active');
    });

    // Навігація в меню
    document.addEventListener('click', (e) => {
        if (e.target.closest('[data-target]')) {
            e.preventDefault();
            const target = e.target.closest('[data-target]').getAttribute('data-target');
            showMenuScreen(target);
        }
    });

    // Тренувальні тайли
    workoutTiles.forEach(tile => {
        tile.addEventListener('click', () => {
            const program = tile.getAttribute('data-program');
            const action = tile.getAttribute('data-action');

            if (program) {
                modalProgramNameEl.textContent = program;
                const exercises = workoutPrograms[program]?.exercises || [];
                modalExerciseListEl.innerHTML = exercises.length > 0 
                    ? exercises.map(ex => `<li>${ex.name} (${ex.duration}с)</li>`).join('')
                    : '<li>Базова програма з випадковими вправами</li>';
                workoutModal.classList.add('active');
            } else if (action === 'add-program') {
                sideMenu.classList.add('active');
                showMenuScreen('addProgramMenu');
            }
        });
    });

    // Модальне вікно тренування
    if (modalStartBtn) {
        modalStartBtn.addEventListener('click', () => {
            const programName = modalProgramNameEl.textContent;
            workoutModal.classList.remove('active');
            startWorkout(programName);
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            workoutModal.classList.remove('active');
        });
    }

    // Тренувальні контроли
    if (pauseBtn) pauseBtn.addEventListener('click', togglePause);
    if (stopBtn) stopBtn.addEventListener('click', stopWorkout);
    if (nextBtn) nextBtn.addEventListener('click', nextExercise);
    if (prevBtn) prevBtn.addEventListener('click', prevExercise);
    if (trainingBackBtn) trainingBackBtn.addEventListener('click', stopWorkout);

    // Mute/Shuffle
    if (muteBtn) {
        muteBtn.addEventListener('click', () => {
            isMuted = !isMuted;
            muteBtn.classList.toggle('mute-btn-muted', isMuted);
            muteBtn.innerHTML = isMuted ? '<i class="bi bi-volume-mute-fill"></i>' : '<i class="bi bi-volume-up-fill"></i>';
        });
    }

    if (shuffleBtn) {
        shuffleBtn.addEventListener('click', () => {
            isShuffleActive = !isShuffleActive;
            shuffleBtn.classList.toggle('shuffle-active', isShuffleActive);
        });
    }

    // Фініш модал
    if (saveWorkoutLogBtn) {
        saveWorkoutLogBtn.addEventListener('click', saveWorkoutLog);
    }

    if (finishModal?.querySelector('.close-button')) {
        finishModal.querySelector('.close-button').addEventListener('click', () => {
            finishModal.classList.remove('active');
            showScreen('homeScreen');
            resetWorkout();
        });
    }

    // Рейтинги в фініш модалі
    if (energyRating) {
        energyRating.addEventListener('click', (e) => {
            if (e.target.hasAttribute('data-value')) {
                energyRating.querySelectorAll('span').forEach(s => s.classList.remove('active'));
                e.target.classList.add('active');
            }
        });
    }

    if (starRating) {
        starRating.addEventListener('click', (e) => {
            if (e.target.hasAttribute('data-value')) {
                const value = parseInt(e.target.getAttribute('data-value'));
                starRating.querySelectorAll('span').forEach((s, i) => {
                    s.classList.toggle('active', i < value);
                });
            }
        });
    }

    if (expandTagsBtn) {
        expandTagsBtn.addEventListener('click', () => {
            extraTagsSection.classList.toggle('active');
        });
    }

    // Слайдер складності
    if (difficultySlider && sliderEmojiBubble) {
        const emojis = ['😵‍💫', '🥱', '🙂', '😅', '😤', '🔥'];
        difficultySlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value) - 1;
            sliderEmojiBubble.textContent = emojis[value] || '🙂';
            const percent = (value / 5) * 100;
            sliderEmojiBubble.style.left = `${percent}%`;
        });
    }

    // Ініціалізація
    loadSavedBackgrounds();
    loadWorkoutHistory();

    // Завантаження програм з localStorage
    function loadPrograms() {
        const saved = localStorage.getItem('workoutPrograms');
        if (saved) {
            workoutPrograms = JSON.parse(saved);
        }
    }

    function savePrograms() {
        localStorage.setItem('workoutPrograms', JSON.stringify(workoutPrograms));
    }

    function loadProgramsList() {
        if (!programListEl) return;
        programListEl.innerHTML = '';
        
        Object.keys(workoutPrograms).forEach(programName => {
            const li = document.createElement('li');
            li.innerHTML = `
                <a href="#" data-program="${programName}">
                    <i class="bi bi-play-circle"></i>
                    ${programName}
                </a>
            `;
            li.querySelector('a').addEventListener('click', (e) => {
                e.preventDefault();
                editProgram(programName);
            });
            programListEl.appendChild(li);
        });

        if (Object.keys(workoutPrograms).length === 0) {
            const li = document.createElement('li');
            li.innerHTML = '<span style="opacity: 0.6;">Немає створених програм</span>';
            programListEl.appendChild(li);
        }
    }

    function editProgram(programName) {
        currentlyEditingProgram = programName;
        const program = workoutPrograms[programName];
        
        programNameInput.value = programName;
        updateExercisesList(program.exercises || []);
        showMenuScreen('programEditMenu');
    }

    function updateExercisesList(exercises) {
        if (!exerciseListEl) return;
        exerciseListEl.innerHTML = '';
        
        exercises.forEach((exercise, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${exercise.name} (${exercise.duration}с)</span>
                <button class="edit-exercise-btn" data-index="${index}">✏️</button>
                <button class="delete-exercise-btn" data-index="${index}">🗑️</button>
            `;
            exerciseListEl.appendChild(li);
        });

        // Event listeners для кнопок редагування
        exerciseListEl.querySelectorAll('.edit-exercise-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                editExercise(index);
            });
        });

        exerciseListEl.querySelectorAll('.delete-exercise-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                deleteExercise(index);
            });
        });
    }

    function editExercise(index) {
        currentlyEditingExerciseIndex = index;
        const program = workoutPrograms[currentlyEditingProgram];
        const exercise = program.exercises[index];
        
        exerciseModalTitle.textContent = 'Редагувати вправу';
        exerciseNameInput.value = exercise.name;
        exerciseDurationInput.value = exercise.duration;
        exerciseAudioInput.value = exercise.audio || '';
        
        exerciseModal.classList.add('active');
    }

    function deleteExercise(index) {
        const program = workoutPrograms[currentlyEditingProgram];
        program.exercises.splice(index, 1);
        updateExercisesList(program.exercises);
        savePrograms();
    }

    // Event listeners для роботи з програмами
    if (addNewProgramBtn) {
        addNewProgramBtn.addEventListener('click', () => {
            showMenuScreen('addProgramMenu');
        });
    }

    if (saveNewProgramBtn) {
        saveNewProgramBtn.addEventListener('click', () => {
            const name = newProgramNameInput.value.trim();
            if (name && !workoutPrograms[name]) {
                workoutPrograms[name] = { exercises: [] };
                savePrograms();
                newProgramNameInput.value = '';
                showMenuScreen('workoutSettingsMenu');
                showToast('Програму створено!');
            } else {
                showToast('Введіть унікальну назву програми', 'error');
            }
        });
    }

    if (addExerciseBtn) {
        addExerciseBtn.addEventListener('click', () => {
            currentlyEditingExerciseIndex = null;
            exerciseModalTitle.textContent = 'Нова вправа';
            exerciseNameInput.value = '';
            exerciseDurationInput.value = '';
            exerciseAudioInput.value = '';
            exerciseModal.classList.add('active');
        });
    }

    if (saveExerciseBtn) {
        saveExerciseBtn.addEventListener('click', () => {
            const name = exerciseNameInput.value.trim();
            const duration = parseTimeToSeconds(exerciseDurationInput.value) || 30;
            const audio = exerciseAudioInput.value.trim();

            if (!name) {
                showToast('Введіть назву вправи', 'error');
                return;
            }

            const exercise = { name, duration, audio: audio || null };
            const program = workoutPrograms[currentlyEditingProgram];

            if (currentlyEditingExerciseIndex !== null) {
                program.exercises[currentlyEditingExerciseIndex] = exercise;
            } else {
                program.exercises.push(exercise);
            }

            updateExercisesList(program.exercises);
            savePrograms();
            exerciseModal.classList.remove('active');
            showToast('Вправу збережено!');
        });
    }

    if (saveProgramBtn) {
        saveProgramBtn.addEventListener('click', () => {
            const newName = programNameInput.value.trim();
            if (newName && newName !== currentlyEditingProgram) {
                workoutPrograms[newName] = workoutPrograms[currentlyEditingProgram];
                delete workoutPrograms[currentlyEditingProgram];
                currentlyEditingProgram = newName;
            }
            savePrograms();
            showMenuScreen('workoutSettingsMenu');
            showToast('Програму збережено!');
        });
    }

    if (deleteProgramBtn) {
        deleteProgramBtn.addEventListener('click', () => {
            if (confirm(`Видалити програму "${currentlyEditingProgram}"?`)) {
                delete workoutPrograms[currentlyEditingProgram];
                savePrograms();
                showMenuScreen('workoutSettingsMenu');
                showToast('Програму видалено!');
            }
        });
    }

    if (closeExerciseModalBtn) {
        closeExerciseModalBtn.addEventListener('click', () => {
            exerciseModal.classList.remove('active');
        });
    }

    // Ініціалізація
    loadPrograms();
    loadWorkoutHistory();
    loadSavedBackgrounds();
});