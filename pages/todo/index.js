const taskKey = '@tasks'

let selectedTaskId = null

// Função para adicionar tarefa
function addTask(event) {
  event.preventDefault() // Evita o recarregamento da página
  const taskId = new Date().getTime()
  const taskList = document.querySelector('#taskList')

  const form = document.querySelector('#taskForm')
  const formData = new FormData(form)

  const taskTitle = formData.get('title')
  const taskDescription = formData.get('description')

  const li = document.createElement('li')

  li.id = `id-${taskId}`
  li.innerHTML = `
    <div>
      <h2>${taskTitle}</h2>
      <p>${taskDescription}</p>
    </div>
    <div class="button-container">
      <button title="Editar tarefa" onClick="openEditDialog(${taskId})">✏️</button>
      <button title="Remover tarefa" onClick="removeTask(${taskId})">❌</button>
    </div>
  `

  taskList.appendChild(li)

  // Salvar tarefas no localStorage
  const tasks = JSON.parse(localStorage.getItem(taskKey)) || []
  tasks.push({
    id: taskId,
    title: taskTitle,
    description: taskDescription,
  })
  localStorage.setItem(taskKey, JSON.stringify(tasks))

  form.reset()
}

function openEditDialog(taskId) {
  const tasks = JSON.parse(localStorage.getItem(taskKey)) || []

  selectedTaskId = tasks.findIndex((task) => task.id === taskId)
  const task = tasks[selectedTaskId]

  const dialog = document.querySelector('dialog')

  const editTitle = document.querySelector('#editTaskForm #editTitle')
  const editDescription = document.querySelector('#editTaskForm #editDescription')

  editTitle.value = task.title
  editDescription.value = task.description

  dialog.showModal()
}

function closeDialog() {
  const dialog = document.querySelector('dialog')
  dialog.close()
}

function editTask(event) {
  event.preventDefault() // Evita o recarregamento da página

  const tasks = JSON.parse(localStorage.getItem(taskKey)) || []

  const form = document.querySelector('#editTaskForm')
  const formData = new FormData(form)

  const taskTitle = formData.get('editTitle')
  const taskDescription = formData.get('editDescription')

  tasks[selectedTaskId].title = taskTitle
  tasks[selectedTaskId].description = taskDescription

  localStorage.setItem(taskKey, JSON.stringify(tasks))

  const li = document.querySelector(`#id-${tasks[selectedTaskId].id}`)
  li.querySelector('h2').textContent = taskTitle
  li.querySelector('p').textContent = taskDescription

  closeDialog()
}

function removeTask(taskId) {
  let tasks = JSON.parse(localStorage.getItem(taskKey)) || []

  tasks = tasks.filter((task) => task.id !== taskId)
  localStorage.setItem(taskKey, JSON.stringify(tasks))

  const li = document.querySelector(`#id-${taskId}`)
  li.remove()
}

// Carregar tarefas do localStorage ao recarregar a página
window.addEventListener('DOMContentLoaded', () => {
  const tasks = JSON.parse(localStorage.getItem(taskKey)) || []
  const taskList = document.querySelector('#taskList')

  taskList.innerHTML = tasks
    .map(
      (task) => `
      <li id='id-${task.id}'>
        <div>
          <h2>${task.title}</h2>
          <p>${task.description}</p>
        </div>
        <div class="button-container">
          <button title="Editar tarefa" onClick="openEditDialog(${task.id})">✏️</button>
          <button title="Remover tarefa" onClick="removeTask(${task.id})">❌</button>
        </div>
      </li>
    `
    )
    .join('')
})
