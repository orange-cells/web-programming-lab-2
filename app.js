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

    // переделаем список задач в таблицу
    const todoTable = document.createElement('table');
    const thead = document.createElement('thead');
    const attrs = document.createElement('tr');

    const tableHeaders = ['check', 'task', 'due date', 'status', 'delete'];
    tableHeaders.forEach(i => {
        const th = document.createElement('th');
        th.textContent = i;
        attrs.appendChild(th);
    });

    thead.append(attrs);
    todoTable.append(thead);

    const tbody = document.createElement('tbody');
    todoTable.setAttribute('id', 'todo-body');
    todoTable.appendChild(tbody);

    document.querySelector('body').append(todoTable);

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
    const tasks = document.getElementById('todo-body');

    taskTable.forEach(element => {
        const task = document.createElement('tr');

        const status = document.createElement('td');
        const check = document.createElement('input');
        check.setAttribute('type', 'checkbox');
        check.checked = element.status;
        check.addEventListener('change', () => {
            element.status = check.checked;
            localStorage.setItem('taskTable', JSON.stringify(taskTable));
        });
        status.append(check)

        const text = document.createElement('td');
        text.textContent = element.taskText;
        
        const dueDate = document.createElement('td');
        dueDate.textContent = element.taskDate;

        if (element.status) {
            status.textContent = 'done';
        } else {
            status.textContent = 'not done';
        }
        
        const del = document.createElement('td');
        const delButton = document.createElement('button');
        delButton.textContent = '-';
        
        delButton.addEventListener('click', () => removeTask(element.taskId));

        task.append(check, text, dueDate, status, delButton);
        tasks.append(task);
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
