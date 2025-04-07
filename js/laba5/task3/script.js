document.addEventListener('DOMContentLoaded', function() {
    // 1. Цифровий годинник із анімацією
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        document.getElementById('hours').textContent = hours;
        document.getElementById('minutes').textContent = minutes;
        document.getElementById('seconds').textContent = seconds;
    }
    
    // Запускаємо годинник і оновлюємо кожну секунду
    updateClock();
    setInterval(updateClock, 1000);
    
    // 2. Таймер зворотного відліку
    let countdownInterval;
    
    document.getElementById('set-countdown').addEventListener('click', function() {
        const dateInput = document.getElementById('countdown-date').value;
        
        if (!dateInput) {
            alert('Будь ласка, виберіть дату та час');
            return;
        }
        
        const targetDate = new Date(dateInput);
        
        // Очищаємо попередній інтервал, якщо він існує
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
        
        // Функція для оновлення таймера
        function updateCountdown() {
            const now = new Date();
            const difference = targetDate - now;
            
            if (difference <= 0) {
                clearInterval(countdownInterval);
                document.getElementById('countdown-days').textContent = '00';
                document.getElementById('countdown-hours').textContent = '00';
                document.getElementById('countdown-minutes').textContent = '00';
                document.getElementById('countdown-seconds').textContent = '00';
                alert('Відлік завершено!');
                return;
            }
            
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            
            document.getElementById('countdown-days').textContent = String(days).padStart(2, '0');
            document.getElementById('countdown-hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('countdown-minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('countdown-seconds').textContent = String(seconds).padStart(2, '0');
        }
        
        // Відразу оновлюємо і встановлюємо інтервал
        updateCountdown();
        countdownInterval = setInterval(updateCountdown, 1000);
    });
    
    // 3. Календар
    const monthPicker = document.getElementById('month-picker');
    const calendarBody = document.getElementById('calendar-body');
    
    // Встановлюємо початкове значення для поля вибору місяця
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    monthPicker.value = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
    
    // Функція для рендерингу календаря
    function renderCalendar(year, month) {
        calendarBody.innerHTML = '';
        
        const firstDay = new Date(year, month - 1, 1);
        const lastDay = new Date(year, month, 0);
        
        // Отримуємо день тижня першого дня місяця (0 - неділя, 1 - понеділок, ...)
        let dayOfWeek = firstDay.getDay();
        // Конвертуємо в формат (0 - понеділок, 6 - неділя)
        dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        
        // Додаємо дні попереднього місяця
        const prevMonthLastDay = new Date(year, month - 1, 0).getDate();
        for (let i = dayOfWeek - 1; i >= 0; i--) {
            const dayDiv = document.createElement('div');
            dayDiv.textContent = prevMonthLastDay - i;
            dayDiv.classList.add('other-month');
            calendarBody.appendChild(dayDiv);
        }
        
        // Додаємо дні поточного місяця
        const today = new Date();
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const dayDiv = document.createElement('div');
            dayDiv.textContent = i;
            
            // Позначаємо поточний день
            if (year === today.getFullYear() && month === today.getMonth() + 1 && i === today.getDate()) {
                dayDiv.classList.add('current-day');
            }
            
            calendarBody.appendChild(dayDiv);
        }
        
        // Додаємо дні наступного місяця
        const totalCells = Math.ceil((dayOfWeek + lastDay.getDate()) / 7) * 7;
        const nextMonthDays = totalCells - (dayOfWeek + lastDay.getDate());
        
        for (let i = 1; i <= nextMonthDays; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.textContent = i;
            dayDiv.classList.add('other-month');
            calendarBody.appendChild(dayDiv);
        }
    }
    
    // Викликаємо функцію для рендерингу календаря
    renderCalendar(currentYear, currentMonth);
    
    // Оновлюємо календар при зміні місяця
    monthPicker.addEventListener('change', function() {
        const [year, month] = this.value.split('-').map(Number);
        renderCalendar(year, month);
    });
    
    // 4. День народження
    let birthdayInterval;
    
    document.getElementById('set-birthday').addEventListener('click', function() {
        const birthdayInput = document.getElementById('birthday-date').value;
        
        if (!birthdayInput) {
            alert('Будь ласка, виберіть дату народження');
            return;
        }
        
        // Очищаємо попередній інтервал, якщо він існує
        if (birthdayInterval) {
            clearInterval(birthdayInterval);
        }
        
        function updateBirthdayCountdown() {
            const now = new Date();
            const birthDate = new Date(birthdayInput);
            
            // Встановлюємо дату наступного дня народження
            const nextBirthday = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
            
            // Якщо день народження вже пройшов в цьому році, встановлюємо на наступний рік
            if (nextBirthday < now) {
                nextBirthday.setFullYear(now.getFullYear() + 1);
            }
            
            const difference = nextBirthday - now;
            
            // Розрахунок місяців, днів, годин, хвилин і секунд
            const months = Math.floor(difference / (1000 * 60 * 60 * 24 * 30));
            const days = Math.floor((difference % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
            
            document.getElementById('birthday-months').textContent = String(months).padStart(2, '0');
            document.getElementById('birthday-days').textContent = String(days).padStart(2, '0');
            document.getElementById('birthday-hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('birthday-minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('birthday-seconds').textContent = String(seconds).padStart(2, '0');
        }
        
        // Відразу оновлюємо і встановлюємо інтервал
        updateBirthdayCountdown();
        birthdayInterval = setInterval(updateBirthdayCountdown, 1000);
    });
});