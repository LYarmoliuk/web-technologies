// Завдання 1
function task1() {
    let fruits = ["яблуко", "банан", "груша", "апельсин"];
    fruits.pop();
    console.log("Завдання 1.1:", fruits);

    fruits.unshift("ананас");
    console.log("Завдання 1.2:", fruits);

    fruits.sort().reverse();
    console.log("Завдання 1.3:", fruits);

    let index = fruits.indexOf("яблуко");
    console.log("Завдання 1.4: Індекс яблуко:", index);
}

// Завдання 2
function task2() {
    let colors = ["червоний", "синій", "жовтий", "темно-синій", "блакитний"];

    let longest = colors.reduce((a, b) => a.length >= b.length ? a : b);
    let shortest = colors.reduce((a, b) => a.length <= b.length ? a : b);
    console.log("Завдання 2.1: Найдовший:", longest, "Найкоротший:", shortest);

    colors = colors.filter(color => color.includes("синій"));
    console.log("Завдання 2.2: Тільки 'синій':", colors);

    let joined = colors.join(", ");
    console.log("Завдання 2.3: Об'єднаний рядок:", joined);
}

// Завдання 3
function task3() {
    let employees = [
        {name: "Андрій", age: 30, position: "розробник"},
        {name: "Ірина", age: 25, position: "дизайнер"},
        {name: "Олексій", age: 28, position: "розробник"}
    ];

    employees.sort((a, b) => a.name.localeCompare(b.name));
    console.log("Завдання 3.1: Сортування за іменем:", employees);

    let developers = employees.filter(e => e.position === "розробник");
    console.log("Завдання 3.2: Розробники:", developers);

    employees = employees.filter(e => e.age < 30);
    console.log("Завдання 3.3: Менше 30 років:", employees);

    employees.push({name: "Марія", age: 27, position: "тестувальник"});
    console.log("Завдання 3.4: Додано Марію:", employees);
}

// Завдання 4
function task4() {
    let students = [
        {name: "Іван", age: 21, course: 3},
        {name: "Олексій", age: 22, course: 4},
        {name: "Наталія", age: 20, course: 2}
    ];

    students = students.filter(s => s.name !== "Олексій");
    console.log("Завдання 4.1: Без Олексія:", students);

    students.push({name: "Олена", age: 19, course: 1});
    console.log("Завдання 4.2: Додано Олену:", students);

    students.sort((a, b) => b.age - a.age);
    console.log("Завдання 4.3: За віком:", students);

    let course3 = students.find(s => s.course === 3);
    console.log("Завдання 4.4: Студент 3-го курсу:", course3);
}

// Завдання 5
function task5() {
    let numbers = [1, 2, 3, 4, 5];
    let squared = numbers.map(n => n ** 2);
    console.log("Завдання 5.1: Квадрати:", squared);

    let even = numbers.filter(n => n % 2 === 0);
    console.log("Завдання 5.2: Парні:", even);

    let sum = numbers.reduce((acc, n) => acc + n, 0);
    console.log("Завдання 5.3: Сума:", sum);

    let extraNumbers = [6, 7, 8, 9, 10];
    numbers = numbers.concat(extraNumbers);
    console.log("Завдання 5.4: Об'єднаний:", numbers);

    numbers.splice(0, 3);
    console.log("Завдання 5.5: Після видалення:", numbers);
}

// Завдання 6
function libraryManagement() {
    let books = [
        {title: "Книга1", author: "Автор1", genre: "фантастика", pages: 200, isAvailable: true},
        {title: "Книга2", author: "Автор2", genre: "драма", pages: 150, isAvailable: false}
    ];

    function addBook(title, author, genre, pages) {
        books.push({title, author, genre, pages, isAvailable: true});
    }

    function removeBook(title) {
        books = books.filter(book => book.title !== title);
    }

    function findBooksByAuthor(author) {
        return books.filter(book => book.author === author);
    }

    function toggleBookAvailability(title, isBorrowed) {
        let book = books.find(book => book.title === title);
        if (book) book.isAvailable = !isBorrowed;
    }

    function sortBooksByPages() {
        books.sort((a, b) => a.pages - b.pages);
    }

    function getBooksStatistics() {
        let total = books.length;
        let available = books.filter(b => b.isAvailable).length;
        let borrowed = total - available;
        let avgPages = books.reduce((acc, b) => acc + b.pages, 0) / total;
        return {total, available, borrowed, avgPages};
    }

    console.log("Завдання 6.1: Початкові книги:", books);
    addBook("Книга3", "Автор1", "детектив", 300);
    console.log("Додано Книга3:", books);
    removeBook("Книга1");
    console.log("Після видалення Книга1:", books);
    console.log("Книги автора Автор1:", findBooksByAuthor("Автор1"));
    toggleBookAvailability("Книга2", true);
    console.log("Після toggle Книга2:", books);
    sortBooksByPages();
    console.log("Сортування за сторінками:", books);
    console.log("Статистика:", getBooksStatistics());
}

// Завдання 7
function task7() {
    let student = {name: "Марко", age: 20, course: 2};
    student.subjects = ["математика", "фізика", "програмування"];
    delete student.age;
    console.log("Завдання 7:", student);
}

// Виклик всіх завдань
task1();
task2();
task3();
task4();
task5();
libraryManagement();
task7();

