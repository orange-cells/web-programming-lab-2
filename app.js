const loadPage = () => {
    // заголовок
    const header = document.createElement('h1');
    header.textContent = 'To-Do List';
    document.querySelector('body').append(header);

    // добавление задачи
    const addButton = document.createElement('button');
    addButton.textContent = '+';

    // поиск задач
    const search = document.createElement('input');
    search.setAttribute('placeholder', 'Searching for...');
    document.querySelector('body').append(search);

    // создание задачи
    const taskTable = document.createElement('form');
    document.querySelector('body').append(taskTable);
    
    const task = document.createElement('input');
    task.setAttribute('id', 'taskText');
    task.setAttribute('type', 'text');
    task.setAttribute('placeholder', 'Enter a task');

    const taskDate = document.createElement('input');
    taskDate.setAttribute('id', 'taskDate');
    taskDate.setAttribute('type', 'date');

    taskTable.append(task);
    taskTable.append(taskDate);
    taskTable.append(addButton);

    addButton.addEventListener('click', newTask);
}

const taskTable = JSON.parse(localStorage.getItem('taskTable')) || [];

const newTask = () => {
    taskTable.push({
        taskText: document.querySelector('#taskText').value.trim(),
        taskDate: document.querySelector('#taskDate').value,
        status: false
    });

    localStorage.setItem('taskTable', JSON.stringify(taskTable));
}


document.addEventListener('DOMContentLoaded', loadPage)
