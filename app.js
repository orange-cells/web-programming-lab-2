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

    const ul = document.createElement('ul');
    ul.setAttribute('id', 'taskList');
    document.querySelector('body').append(ul);

    addButton.addEventListener('click', newTask);
}

let taskTable = JSON.parse(localStorage.getItem('taskTable')) || [];

const newTask = () => {
    taskTable.push({
        taskText: document.getElementById('taskText').value,
        taskDate: document.getElementById('taskDate').value,
        status: false,
        taskId: Date.now()
    });

    localStorage.setItem('taskTable', JSON.stringify(taskTable));
}

const displayTaskTable = () => {
    const tasks = document.getElementById('taskList');

    taskTable.forEach(element => {
        const task = document.createElement('li');
        
        const checkBox = document.createElement('input');
        // checkBox.setAttribute('id', )
        checkBox.setAttribute('type', 'checkbox');
        
        const text = document.createElement('span');
        text.textContent = element.taskText;

        const date = document.createElement('span');
        date.textContent = element.taskDate;

        const delButton = document.createElement('button');
        delButton.textContent = '-';
        
        delButton.addEventListener('click', () => removeTask(element.taskId));

        task.append(checkBox, text, date, delButton);
        tasks.appendChild(task);
    });
}

const removeTask = (taskId) => {
    taskTable = taskTable.filter(i => i.taskId !== taskId);
    localStorage.setItem('taskTable', JSON.stringify(taskTable));
    location.reload();
}

document.addEventListener('DOMContentLoaded', () => {
    loadPage();
    displayTaskTable();
   //localStorage.clear()
});
