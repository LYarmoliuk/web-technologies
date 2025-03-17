// Завдання 1: Сума перших 10 чисел Фібоначчі (while)
function task1() {
    let a = 0, b = 1, sum = 0, count = 0;
    while (count <= 10) {
        sum += a;
        let next = a + b;
        a = b;
        b = next;
        count++;
    }
    console.log("Завдання 1: Сума перших 10 чисел Фібоначчі =", sum);
}
task1();

// Завдання 2: Сума всіх простих чисел від 1 до 1000 (for)
function task2() {
    let sum = 0;
    for (let i = 2; i <= 1000; i++) {
        let isPrime = true;
        for (let j = 2; j <= Math.sqrt(i); j++) {
            if (i % j === 0) {
                isPrime = false;
                break;
            }
        }
        if (isPrime) {
            sum += i;
        }
    }
    console.log("Завдання 2: Сума простих чисел від 1 до 1000 =", sum);
}
task2();

// Завдання 3: switch - день тижня
function task3(dayNumber) {
    let dayName;
    switch (dayNumber) {
        case 1: dayName = "Понеділок"; break;
        case 2: dayName = "Вівторок"; break;
        case 3: dayName = "Середа"; break;
        case 4: dayName = "Четвер"; break;
        case 5: dayName = "П’ятниця"; break;
        case 6: dayName = "Субота"; break;
        case 7: dayName = "Неділя"; break;
        default: dayName = "Невірне число (введіть від 1 до 7)";
    }
    console.log("Завдання 3: День тижня для числа", dayNumber, ":", dayName);
}

task3(3);

// Завдання 4: Масив рядків з непарною довжиною
function task4(strings) {
    const result = strings.filter(str => str.length % 2 !== 0);
    console.log("Завдання 4: Рядки з непарною довжиною =", result);
    return result;
}

task4(["apple", "banana", "kiwi", "fig", "plum"]);

// Завдання 5: Стрілкова функція +1 до кожного числа
const task5 = (numbers) => {
    const result = numbers.map(num => num + 1);
    console.log("Завдання 5: Масив після збільшення на 1 =", result);
    return result;
}

task5([1, 2, 3, 4, 5]);

// Завдання 6: Функція перевірки суми або різниці = 10
function task6(a, b) {
    const result = (a + b === 10) || (Math.abs(a - b) === 10);
    console.log(`Завдання 6: Числа (${a}, ${b}), результат:`, result);
    return result;
}

task6(7, 3);
task6(15, 5);
task6(6, 2);
