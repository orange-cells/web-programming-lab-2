let sortDate = false;
let currentStatus = 'all';
let pickedTask = null;

const loadPage = () => {
    // заголовок
    const header = document.createElement('h1');
    header.textContent = 'To-Do List';
    document.querySelector('body').append(header);

    // добавление задачи
    const addButton = document.createElement('button');
    addButton.textContent = '+';
    addButton.setAttribute('type', 'submit');

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

    // таблица со списком задач
    const todoTable = document.createElement('table');
    const thead = document.createElement('thead');
    const attrs = document.createElement('tr');

    const tableHeaders = ['move', 'check', 'task', 'due date', 'status', 'delete'];
    tableHeaders.forEach(i => {
        const th = document.createElement('th');
        th.textContent = i;

        if (i.includes('due date')) {
            th.style.cursor = 'pointer';
            th.addEventListener('click', () => {
                sortDate = !sortDate;
                displayTaskTable();
            });
        }

        if (i.includes('status')) {
            th.textContent = 'status ';
            const statusSelect = document.createElement('select');

            const statusList = ['all', 'done', 'not done'];
            statusList.forEach(st => {
                const option = document.createElement('option');
                option.textContent = st;
                statusSelect.appendChild(option);
            });

            statusSelect.value = currentStatus;
            statusSelect.addEventListener('change', (e) => {
                currentStatus = e.target.value;
                displayTaskTable();
            });

            th.append(statusSelect); 
        }

        attrs.appendChild(th);
    });

    thead.append(attrs);
    todoTable.append(thead);

    const tbody = document.createElement('tbody');
    tbody.setAttribute('id', 'todo-body');
    todoTable.appendChild(tbody);

    document.querySelector('body').append(todoTable);

    taskTable.addEventListener('submit', (e) => {
        e.preventDefault();
        newTask();
        taskTable.reset();
    });
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
    displayTaskTable();
}

const displayTaskTable = () => {
    const tasks = document.getElementById('todo-body');

    while (tasks.firstChild) {
        tasks.removeChild(tasks.firstChild);
    }

    let tasksToDisplay = [...taskTable];  // делаем копию
    if (sortDate) {  // пришлось немного поменять, иначе drag and drop работал только со смещением вниз
        tasksToDisplay.sort((a, b) => {
            const dateA = a.taskDate ? new Date(a.taskDate) : new Date('9999-12-31');
            const dateB = b.taskDate ? new Date(b.taskDate) : new Date('9999-12-31');
            return dateA - dateB;
        });
    };

    if (currentStatus !== 'all') {
        const ifDone = currentStatus === 'done';
        tasksToDisplay = tasksToDisplay.filter(task => Boolean(task.status) === ifDone);
    }

    tasksToDisplay.forEach((element, index) => {
        const task = document.createElement('tr');
        task.dataset.id = element.taskId;
        task.draggable = true;
        
        task.addEventListener('dragstart', () => {
            pickedTask = index;
            task.classList.add('dragging');
        });

        task.addEventListener('dragover', (e) => {
            e.preventDefault();
            task.classList.add('drag-over');
        });

        task.addEventListener('dragleave', () => {
            task.classList.remove('drag-over');
        });

        task.addEventListener('drop', () => {
            task.classList.remove('drag-over');
            dragAndDrop(pickedTask, index);
        });

        task.addEventListener('dragend', () => {
            task.classList.remove('dragging');
        });

        task.ontouchstart = () => {
            startId = taskTable.findIndex(t => t.taskId === element.taskId);
        };

        task.ontouchend = (e) => {
            const touch = e.changedTouches[0];
            const target = document.elementFromPoint(touch.clientX, touch.clientY).closest('tr');
            if (target) {
                const endId = taskTable.findIndex(t => t.taskId == target.dataset.id);
                dragAndDrop(startId, endId);
            }
        };

        const drag = document.createElement('td');
        drag.textContent = '⇅';
        drag.style.cursor = 'pointer';

        const status = document.createElement('td');
        const check = document.createElement('input');
        check.setAttribute('type', 'checkbox');
        check.checked = element.status;
        check.addEventListener('change', () => {
            element.status = check.checked;
            localStorage.setItem('taskTable', JSON.stringify(taskTable));
            displayTaskTable();
        });
        status.append(check)

        const text = document.createElement('td');
        text.textContent = element.taskText;

        // редактирование текста
        text.addEventListener('dblclick', () => {
            const newText = document.createElement('input');
            newText.value = element.taskText;

            text.textContent = '';
            text.append(newText);
            newText.focus();
                        
            newText.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') 
                    element.taskText = newText.value;
                    localStorage.setItem('taskTable', JSON.stringify(taskTable));
            });
        });
        
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

        task.append(drag, check, text, dueDate, status, delButton);
        tasks.append(task);
    });
}

const removeTask = (taskId) => {
    taskTable = taskTable.filter(i => i.taskId !== taskId);
    localStorage.setItem('taskTable', JSON.stringify(taskTable));
    displayTaskTable();
}

const dragAndDrop = (startId, endId) => {
    if (startId === endId || startId === null) return;
    
    const movedItem = taskTable.splice(startId, 1)[0];
    taskTable.splice(endId, 0, movedItem);
    
    sortDate = false;
    
    localStorage.setItem('taskTable', JSON.stringify(taskTable));
    displayTaskTable();
}

document.addEventListener('DOMContentLoaded', () => {
    // localStorage.clear()
    // console.log(taskTable, sortDate);
    loadPage();
    displayTaskTable();
});
