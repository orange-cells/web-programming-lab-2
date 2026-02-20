const loadPage = () => {
    const header = document.createElement('h1')
    header.textContent = 'To-Do List'
    document.querySelector('body').append(header)

    // будет выплывать окно для создания
    const addButton = document.createElement('button')
    document.querySelector('body').append(addButton)

    const search = document.createElement('input')
    search.setAttribute('placeholder', 'Searching for...')
    document.querySelector('body').append(search)

    const tasks = document.createElement('form')
    document.querySelector('body').append(tasks)
}

document.addEventListener('DOMContentLoaded', loadPage)
