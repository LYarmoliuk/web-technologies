// Основні елементи
const redLight = document.getElementById('redLight');
const yellowLight = document.getElementById('yellowLight');
const greenLight = document.getElementById('greenLight');
const currentStatusText = document.getElementById('currentStatus');
const timeLeftText = document.getElementById('timeLeft');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const nextButton = document.getElementById('nextButton');
const settingsButton = document.getElementById('settingsButton');

// Налаштування тривалості
const redDurationInput = document.getElementById('redDuration');
const yellowDurationInput = document.getElementById('yellowDuration');
const greenDurationInput = document.getElementById('greenDuration');
const blinkCountInput = document.getElementById('blinkCount');

// Стани світлофора
const STATES = {
    RED: 'red',
    YELLOW_TO_GREEN: 'yellowToGreen',
    GREEN: 'green',
    YELLOW_BLINKING: 'yellowBlinking'
};

// Змінні для контролю стану та таймерів
let currentState = STATES.RED;
let timeLeft = parseInt(redDurationInput.value);
let mainTimer = null;
let blinkingTimer = null;
let countdownTimer = null;
let isRunning = false;
let currentBlinkCount = 0;

// Функція ініціалізації
function initialize() {
    updateTimeLeft();
    updateState(STATES.RED);
}

// Функція оновлення часу, що залишився
function updateTimeLeft() {
    timeLeftText.textContent = timeLeft;
}

// Функція скидання світлофора (всі не активні)
function resetLights() {
    redLight.classList.remove('active');
    yellowLight.classList.remove('active', 'blinking');
    greenLight.classList.remove('active');
}

// Функція оновлення стану світлофора
function updateState(state) {
    currentState = state;
    resetLights();
    
    switch (state) {
        case STATES.RED:
            redLight.classList.add('active');
            currentStatusText.textContent = 'червоний';
            timeLeft = parseInt(redDurationInput.value);
            break;
        case STATES.YELLOW_TO_GREEN:
            yellowLight.classList.add('active');
            currentStatusText.textContent = 'жовтий';
            timeLeft = parseInt(yellowDurationInput.value);
            break;
        case STATES.GREEN:
            greenLight.classList.add('active');
            currentStatusText.textContent = 'зелений';
            timeLeft = parseInt(greenDurationInput.value);
            break;
        case STATES.YELLOW_BLINKING:
            yellowLight.classList.add('active');
            currentStatusText.textContent = 'миготливий жовтий';
            startYellowBlinking();
            break;
    }
    
    updateTimeLeft();
}

// Функція для переходу до наступного стану
function nextState() {
    switch (currentState) {
        case STATES.RED:
            updateState(STATES.YELLOW_TO_GREEN);
            break;
        case STATES.YELLOW_TO_GREEN:
            updateState(STATES.GREEN);
            break;
        case STATES.GREEN:
            updateState(STATES.YELLOW_BLINKING);
            break;
        case STATES.YELLOW_BLINKING:
            updateState(STATES.RED);
            break;
    }
}

// Функція запуску миготіння жовтого світла
function startYellowBlinking() {
    currentBlinkCount = 0;
    const totalBlinks = parseInt(blinkCountInput.value);
    timeLeft = Math.ceil(totalBlinks / 2); // Приблизний час в секундах для миготіння
    
    clearInterval(blinkingTimer);
    
    let isOn = true;
    blinkingTimer = setInterval(() => {
        if (isOn) {
            yellowLight.classList.remove('active');
        } else {
            yellowLight.classList.add('active');
            currentBlinkCount++;
        }
        
        isOn = !isOn;
        
        // Перевірка завершення миготіння
        if (currentBlinkCount >= totalBlinks) {
            clearInterval(blinkingTimer);
            nextState(); // Перейти до червоного після миготіння
            
            if (isRunning) {
                startCycle(); // Якщо світлофор запущений, продовжуємо цикл
            }
        }
    }, 500);
}

// Функція запуску циклу світлофора
function startCycle() {
    // Очищаємо попередні таймери
    clearTimeout(mainTimer);
    clearInterval(countdownTimer);
    
    // Не запускаємо таймер для миготливого жовтого, він керується своїм власним таймером
    if (currentState !== STATES.YELLOW_BLINKING) {
        // Запускаємо головний таймер для переходу до наступного стану
        mainTimer = setTimeout(() => {
            nextState();
            
            // Продовжуємо цикл, якщо не перейшли до миготливого жовтого
            if (currentState !== STATES.YELLOW_BLINKING && isRunning) {
                startCycle();
            }
        }, timeLeft * 1000);
        
        // Запускаємо таймер зворотного відліку
        countdownTimer = setInterval(() => {
            timeLeft--;
            updateTimeLeft();
            
            if (timeLeft <= 0) {
                clearInterval(countdownTimer);
            }
        }, 1000);
    }
}

// Функція запуску світлофора
function startTrafficLight() {
    isRunning = true;
    startButton.disabled = true;
    stopButton.disabled = false;
    startCycle();
}

// Функція зупинки світлофора
function stopTrafficLight() {
    isRunning = false;
    startButton.disabled = false;
    stopButton.disabled = true;
    clearTimeout(mainTimer);
    clearInterval(countdownTimer);
    clearInterval(blinkingTimer);
    
    // Якщо був миготливий стан, встановлюємо постійний жовтий
    if (currentState === STATES.YELLOW_BLINKING) {
        yellowLight.classList.add('active');
    }
}

// Функція налаштування часу
function openSettings() {
    // Створюємо діалогове вікно для введення нових значень
    const redDuration = prompt('Введіть тривалість червоного світла (секунди)', redDurationInput.value);
    if (redDuration !== null && !isNaN(redDuration) && redDuration > 0) {
        redDurationInput.value = redDuration;
    }
    
    const yellowDuration = prompt('Введіть тривалість жовтого світла (секунди)', yellowDurationInput.value);
    if (yellowDuration !== null && !isNaN(yellowDuration) && yellowDuration > 0) {
        yellowDurationInput.value = yellowDuration;
    }
    
    const greenDuration = prompt('Введіть тривалість зеленого світла (секунди)', greenDurationInput.value);
    if (greenDuration !== null && !isNaN(greenDuration) && greenDuration > 0) {
        greenDurationInput.value = greenDuration;
    }
    
    const blinkCount = prompt('Введіть кількість миготінь жовтого світла', blinkCountInput.value);
    if (blinkCount !== null && !isNaN(blinkCount) && blinkCount > 0) {
        blinkCountInput.value = blinkCount;
    }
    
    // Оновлюємо час, якщо світлофор не працює
    if (!isRunning) {
        updateState(currentState);
    }
}

// Обробники подій
startButton.addEventListener('click', startTrafficLight);
stopButton.addEventListener('click', stopTrafficLight);
nextButton.addEventListener('click', () => {
    if (!isRunning) {
        // Якщо світлофор не запущений, просто переходимо до наступного стану
        nextState();
    } else {
        // Якщо світлофор запущений, зупиняємо цикл і переходимо до наступного стану
        clearTimeout(mainTimer);
        clearInterval(countdownTimer);
        nextState();
        startCycle();
    }
});
settingsButton.addEventListener('click', openSettings);

// Ініціалізація при завантаженні
initialize();

// Використання Map для збереження інформації про стани світлофора
const stateInfo = new Map([
    [STATES.RED, { name: 'червоний', nextState: STATES.YELLOW_TO_GREEN, color: '#ff0000' }],
    [STATES.YELLOW_TO_GREEN, { name: 'жовтий', nextState: STATES.GREEN, color: '#ffff00' }],
    [STATES.GREEN, { name: 'зелений', nextState: STATES.YELLOW_BLINKING, color: '#00ff00' }],
    [STATES.YELLOW_BLINKING, { name: 'миготливий жовтий', nextState: STATES.RED, color: '#ffff00' }]
]);

// Використання Set для зберігання історії станів
const stateHistory = new Set();

// Функція для додавання стану до історії
function addToHistory(state) {
    const timestamp = new Date().toLocaleTimeString();
    const stateDetails = stateInfo.get(state);
    
    if (stateDetails) {
        stateHistory.add(`${timestamp}: ${stateDetails.name}`);
        
        // Обмеження розміру історії
        if (stateHistory.size > 50) {
            stateHistory.delete(stateHistory.values().next().value);
        }
        
        // Можна вивести в консоль для перевірки
        console.log(`Додано до історії: ${timestamp}: ${stateDetails.name}`);
    }
}

// Додаємо логування перемикання станів
const originalUpdateState = updateState;
updateState = function(state) {
    originalUpdateState(state);
    addToHistory(state);
};