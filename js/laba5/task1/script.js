// Основні елементи
const bulb = document.getElementById('bulb');
const toggleButton = document.getElementById('toggleButton');
const bulbTypeSelect = document.getElementById('bulbType');
const brightnessButton = document.getElementById('brightnessButton');
const currentTypeText = document.getElementById('currentType');
const currentStateText = document.getElementById('currentState');
const currentBrightnessText = document.getElementById('currentBrightness');
const timerText = document.getElementById('timer');

// Змінні для стану та таймерів
let isOn = false;
let brightness = 100;
let inactivityTimeout = null;
let countdownTimer = null;
let countdownSeconds = 300; // 5 хвилин

// Карта з типами лампочок та їх можливостями
const bulbTypes = new Map([
    ['regular', { name: 'Звичайна лампочка', dimmable: false }],
    ['energy-saving', { name: 'Енергозберігаюча лампочка', dimmable: true }],
    ['led', { name: 'Світлодіодна лампочка', dimmable: true }]
]);

// Ініціалізація
updateBulbType();

// Функція переключення стану лампочки
function toggleBulb() {
    isOn = !isOn;
    
    if (isOn) {
        bulb.classList.add('on');
        toggleButton.textContent = 'Виключити';
        currentStateText.textContent = 'Увімкнено';
        
        // Почати таймер неактивності
        resetInactivityTimer();
        startCountdownTimer();
    } else {
        bulb.classList.remove('on');
        toggleButton.textContent = 'Включити';
        currentStateText.textContent = 'Вимкнено';
        
        // Зупинити таймери
        clearTimeout(inactivityTimeout);
        clearInterval(countdownTimer);
        countdownSeconds = 300;
        updateTimerDisplay();
    }
}

// Функція оновлення типу лампочки
function updateBulbType() {
    const selectedType = bulbTypeSelect.value;
    const typeInfo = bulbTypes.get(selectedType);
    
    // Очистити попередні класи типу лампочки
    bulb.classList.remove('regular', 'energy-saving', 'led');
    
    // Додати клас для типу лампочки
    bulb.classList.add(selectedType);
    
    // Відновити клас "увімкнено", якщо лампочка була увімкнена
    if (isOn) {
        bulb.classList.add('on');
    }
    
    // Оновити інформацію
    currentTypeText.textContent = typeInfo.name;
    
    // Увімкнути/вимкнути кнопку яскравості
    brightnessButton.disabled = !typeInfo.dimmable;
    
    // Оновити яскравість відповідно до нового типу
    updateBrightness(brightness);
}

// Функція зміни яскравості
function changeBrightness() {
    const selectedType = bulbTypeSelect.value;
    const typeInfo = bulbTypes.get(selectedType);
    
    if (typeInfo.dimmable) {
        let newBrightness = prompt('Введіть яскравість (25, 50, 75 або 100):', brightness);
        
        if (newBrightness !== null) {
            newBrightness = parseInt(newBrightness);
            
            // Перевірка допустимих значень
            if ([25, 50, 75, 100].includes(newBrightness)) {
                updateBrightness(newBrightness);
            } else {
                alert('Неправильне значення. Введіть 25, 50, 75 або 100.');
            }
        }
    } else {
        alert('Цей тип лампочки не підтримує зміну яскравості.');
    }
    
    // Скинути таймер неактивності
    resetInactivityTimer();
}

// Функція оновлення яскравості
function updateBrightness(value) {
    brightness = value;
    
    // Очистити попередні класи яскравості
    bulb.classList.remove('dim-25', 'dim-50', 'dim-75', 'dim-100');
    
    // Додати новий клас яскравості для дімованих лампочок
    const selectedType = bulbTypeSelect.value;
    const typeInfo = bulbTypes.get(selectedType);
    
    if (typeInfo.dimmable) {
        bulb.classList.add(`dim-${value}`);
    } else {
        // Для недімованих лампочок завжди 100%
        bulb.classList.add('dim-100');
    }
    
    // Оновити інформацію
    currentBrightnessText.textContent = typeInfo.dimmable ? `${value}%` : 'Не регулюється';
}

// Функції для таймеру неактивності
function resetInactivityTimer() {
    clearTimeout(inactivityTimeout);
    
    if (isOn) {
        inactivityTimeout = setTimeout(function() {
            // Вимкнути лампочку після бездіяльності
            if (isOn) {
                toggleBulb();
                alert('Лампочка автоматично вимкнулась через 5 хвилин бездіяльності.');
            }
        }, 5 * 60 * 1000); // 5 хвилин
    }
}

// Функції для відліку та відображення таймера
function startCountdownTimer() {
    countdownSeconds = 300; // 5 хвилин
    updateTimerDisplay();
    
    clearInterval(countdownTimer); // Очистити попередній таймер, якщо існує
    
    countdownTimer = setInterval(function() {
        countdownSeconds--;
        updateTimerDisplay();
        
        if (countdownSeconds <= 0) {
            clearInterval(countdownTimer);
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(countdownSeconds / 60);
    const seconds = countdownSeconds % 60;
    timerText.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Обробники подій
toggleButton.addEventListener('click', function() {
    toggleBulb();
    resetInactivityTimer();
});

bulbTypeSelect.addEventListener('change', function() {
    updateBulbType();
    resetInactivityTimer();
});

brightnessButton.addEventListener('click', function() {
    changeBrightness();
});

// Додати обробник для скидання таймера при будь-якій активності користувача
document.addEventListener('click', function() {
    resetInactivityTimer();
});

document.addEventListener('keypress', function() {
    resetInactivityTimer();
});

// Створення Set для зберігання історії дій
const actionsHistory = new Set();

// Функція для додавання дії до історії
function addToHistory(action) {
    const timestamp = new Date().toLocaleTimeString();
    actionsHistory.add(`${timestamp}: ${action}`);
    
    // Якщо історія стає занадто довгою, можна очистити старі записи
    if (actionsHistory.size > 50) {
        // Видалення найстарішого запису (перший елемент Set)
        actionsHistory.delete(actionsHistory.values().next().value);
    }
    
    // Можна вивести в консоль для перевірки
    console.log(`Додано до історії: ${timestamp}: ${action}`);
}

// Додати логування подій
toggleButton.addEventListener('click', function() {
    const action = isOn ? 'Лампочка увімкнена' : 'Лампочка вимкнена';
    addToHistory(action);
});

bulbTypeSelect.addEventListener('change', function() {
    addToHistory(`Змінено тип лампочки на ${bulbTypes.get(bulbTypeSelect.value).name}`);
});

brightnessButton.addEventListener('click', function() {
    const selectedType = bulbTypeSelect.value;
    const typeInfo = bulbTypes.get(selectedType);
    if (typeInfo.dimmable) {
        addToHistory(`Змінено яскравість на ${brightness}%`);
    }
});

// Початкове налаштування доступності кнопки яскравості
brightnessButton.disabled = !bulbTypes.get(bulbTypeSelect.value).dimmable;