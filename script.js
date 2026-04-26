// Отримуємо посилання на елементи DOM
const taskInput = document.getElementById('task-input');
const taskAddBtn = document.getElementById('task-add-btn');
const taskList = document.getElementById('task-list');


// Відтворюємо список завдань з LocalStorage
document.addEventListener('DOMContentLoaded', loadTaskList);
 
// Функція для додавання до списку завдань нового завдання
// з урахуванням збереження списку завдань у LocalStorage
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") return;
 
    createTaskListElement(taskText, false);
    saveTaskList(); // Зберігаємо після додавання
 
    taskInput.value = "";
    taskInput.focus();
}
 
// Функція як для створення нових завдань 
// з добавленням кнопки видалення, так і для
// відтворення збереженого списку завдань з LocalStorage
// Функція як для створення нових завдань
// з добавленням кнопки видалення, 
// із можливістю редагувати завдання у списку, так і для
// відтворення збереженого списку завдань з LocalStorage
function createTaskListElement(taskText, isCompleted) {
    // Створюємо елемент завдання (контейнер label)
    const label = document.createElement('label');
    label.className = 'task-list-item';
 
    // Наповнюємо його структурними елементами
    // із значеннями taskText та isCompleted
    label.innerHTML = `
        <input type="checkbox" ${isCompleted ? 'checked' : ''}>
        <span class="task-checkmark"></span>
        <span class="task-text" contenteditable="true" spellcheck="false">${taskText} </span>
        <button class="task-delete-btn" title="Видалити завдання">✖</button>
    `;
 
    // Зберігаємо зміни після редагування
    // при кліку поза текстом завдання (втраті фокусу)
    const textSpan = label.querySelector('.task-text');
    textSpan.addEventListener('blur', () => {
        // Перевіряємо, чи текст не порожній
        if (textSpan.innerText.trim() === "") {
            // Запобігаємо зникненню елемента
            textSpan.innerText = "Введіть нове завдання";
        }
        saveTaskList(); // Зберігаємо список завдань після редагування
    });
 
    // Зберігаємо зміни при натисканні Enter
    textSpan.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Запобігаємо перенесенню рядка
            textSpan.blur();    // Викликаємо подію blur для збереження
        }
    });
 
    // Добавляємо подію для checkbox зміни стану виконання завдання
    const checkbox = label.querySelector('input');
    checkbox.addEventListener('change', () => {
        saveTaskList(); // Зберігаємо список завдань після кліку
    });
 
    // Додавляємо подію для кнопки видалення завдання
const taskDeleteBtn = label.querySelector('.task-delete-btn');
    taskDeleteBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Запобігаємо спрацюванню label
        label.remove(); // Видаляємо завдання
        saveTaskList(); // Зберігаємо список завдань після видалення
    });
 
    taskList.appendChild(label);
}

 
//Функція для збереження всіх завдань у LocalStorage
function saveTaskList() {
    const myTaskList = [];
    document.querySelectorAll('.task-list-item').forEach(item => {
        myTaskList.push({
            text: item.querySelector('.task-text').innerText,
            completed: item.querySelector('input').checked
        });
    });
    // Перетворюємо масив об'єктів у рядок JSON
    localStorage.setItem('myTaskList', JSON.stringify(myTaskList));
}
 
// Функція для завантаження списку завдань з LocalStorage
function loadTaskList() {
    // Видаляємо зі списку завдань всі статичні завдання
    staticTaskList = document.querySelectorAll('.task-list-item');
    staticTaskList.forEach(item => {
        item.remove();
    });
 
    // Додаємо у список завдань всі завдання з LocalStorage
    const savedTaskList = localStorage.getItem('myTaskList');
    if (savedTaskList) {
        const myTaskList = JSON.parse(savedTaskList);
        myTaskList.forEach(myTaskList => {
            createTaskListElement(myTaskList.text, myTaskList.completed);
        });
    }
}
 
// Додаємо слухач кліку для кнопки додавання нових завдань
taskAddBtn.addEventListener('click', addTask);
 
// Дозволяємо додавати завдання натисканням клавіші Enter
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});


// Функція для обробки подій на елементах списку
function attachTaskListEvents(label) {
    // Зберігаємо зміни після редагування
    // при кліку поза текстом завдання (втраті фокусу)
    const textSpan = label.querySelector('.task-text');
    textSpan.addEventListener('blur', () => {
        // Перевіряємо, чи текст не порожній
        if (textSpan.innerText.trim() === "") {
            // Запобігаємо зникненню елемента
            textSpan.innerText = "Введіть нове завдання"; 
        }
        saveTaskList(); // Зберігаємо список завдань після редагування
    });
 
    // Зберігаємо зміни при натисканні Enter
    textSpan.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Запобігаємо перенесенню рядка
            textSpan.blur();    // Викликаємо подію blur для збереження
        }
    });
 
    // Додаємо подію для чекбокса зміни стану виконання завдання
    const checkbox = label.querySelector('input');
    checkbox.addEventListener('change', () => {
        saveTaskList(); // Зберігаємо список завдань після кліку
    });
 
    // Додаємо подію для кнопки видалення
const taskDeleteBtn = label.querySelector('.task-delete-btn');
    taskDeleteBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Запобігаємо спрацюванню label
        label.remove(); // Видаляємо завдання
        saveTaskList(); // Зберігаємо список завдань після видалення
    });
}

 
// Навішуємо функцію обробки подій на статичні елементи списку
document.querySelectorAll('#task-list label').forEach(attachTaskListEvents);
