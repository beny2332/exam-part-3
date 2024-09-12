const app = document.getElementById('app')
let soldiers = JSON.parse(localStorage.getItem('soldiers')) || []
let isEditMode = false
let currentEditIndex = null

// Initial render
renderHome()

// Function to render the home page
function renderHome() {
  app.innerHTML = '' // Clear the app content

  // Create main container
  const mainContainer = document.createElement('div')
  mainContainer.classList.add('main-container')

  // Create form container
  const formContainer = document.createElement('div')
  formContainer.classList.add('form-container')

  // Form title
  const formTitle = document.createElement('h2')
  formTitle.innerText = isEditMode ? 'Edit Soldier' : 'Create New Soldier'
  formContainer.appendChild(formTitle)
  const formHr = document.createElement('hr')
  formContainer.appendChild(formHr)

  // Create form elements
  const fullName = createInput('text', 'Full Name', 'fullName')
  const rank = createInput('text', 'Rank', 'rank')
  const position = createInput('text', 'Position', 'position')
  const platoon = createInput('text', 'Platoon', 'platoon')
  const status = createSelect(['Active', 'Reserve', 'Retired'], 'status')
  const taskTime = createInput('number', 'Task Time (seconds)', 'taskTime')

  // Create submit button
  const submitBtn = document.createElement('button')
  submitBtn.innerText = isEditMode ? 'Save Changes' : 'Add Soldier'
  submitBtn.onclick = () => handleFormSubmit()

  // Create form element
  const form = document.createElement('form')
  form.onsubmit = (e) => {
    e.preventDefault()
    handleFormSubmit()
  }

  // Append inputs and button to form
  form.append(fullName, rank, position, platoon, status, taskTime, submitBtn)
  formContainer.appendChild(form)

  mainContainer.appendChild(formContainer)

  // Create table container
  const tableContainer = document.createElement('div')
  tableContainer.classList.add('table-container')

  // Table title
  const tableTitle = document.createElement('h2')
  tableTitle.innerText = 'Forces Overview'
  tableContainer.appendChild(tableTitle)
  const tableHr = document.createElement('hr')
  tableContainer.appendChild(tableHr)

  // Create table
  const table = document.createElement('table')
  const headerRow = document.createElement('tr')

  const headers = ['Full Name', 'Rank', 'Position', 'Platoon', 'Status', 'Actions']
  headers.forEach(header => {
    const th = document.createElement('th')
    th.innerText = header
    headerRow.appendChild(th)
  })

  table.appendChild(headerRow)
            soldiers.forEach((soldier, index) => {
              const row = document.createElement('tr')

              // Create cells for specific properties
              const properties = ['fullName', 'rank', 'position', 'platoon', 'status']
              properties.forEach(prop => {
                const td = document.createElement('td')
                td.innerText = soldier[prop]
                row.appendChild(td)
              })

              // Create actions cell with buttons
              const actionsCell = document.createElement('td')
              actionsCell.classList.add('actions')

              const editBtn = document.createElement('button')
              editBtn.innerText = 'Edit'
              editBtn.onclick = () => handleEdit(index)

              const deleteBtn = document.createElement('button')
              deleteBtn.innerText = 'Delete'
              deleteBtn.onclick = () => handleDelete(index)

              const missionBtn = document.createElement('button')
              if (soldier.missionEndTime && soldier.missionEndTime > Date.now()) {
                updateMissionButton(missionBtn, soldier.missionEndTime)
              } else if (soldier.missionEndTime && soldier.missionEndTime <= Date.now()) {
                missionBtn.innerText = 'Mission Completed'
                missionBtn.disabled = true
              } else {
                missionBtn.innerText = 'Mission'
                missionBtn.onclick = () => handleMission(index)
              }

              actionsCell.appendChild(missionBtn)
              actionsCell.appendChild(editBtn)
              actionsCell.appendChild(deleteBtn)
              row.appendChild(actionsCell)

              table.appendChild(row)
            })
  tableContainer.appendChild(table)

  mainContainer.appendChild(tableContainer)
  app.appendChild(mainContainer)
}// Function to handle form submit
function handleFormSubmit(index = null) {
  console.log('Before adding:', soldiers)

  const newSoldier = {
    fullName: document.getElementById('fullName').value,
    rank: document.getElementById('rank').value,
    position: document.getElementById('position').value,
    platoon: document.getElementById('platoon').value,
    status: document.getElementById('status').value,
    taskTime: document.getElementById('taskTime').value,
  }

  if (index !== null) {
    soldiers[index] = newSoldier
  } else {
    soldiers.push(newSoldier)
  }

  console.log('After adding:', soldiers)
  localStorage.setItem('soldiers', JSON.stringify(soldiers))

  renderHome() // Re-render home page
  isEditMode = false;

}

// Function to handle edit
function handleEdit(index) {
  renderEditPage(index)
}

// Function to handle delete
function handleDelete(index) {
  soldiers.splice(index, 1)
  localStorage.setItem('soldiers', JSON.stringify(soldiers))
  renderHome()
}

// Function to handle mission
function handleMission(index) {
  const soldier = soldiers[index]
    if (soldier.status === 'Retierd') {
      alert(`${soldier.fullName} has retired and cannot be assigned to a mission.`)
    } else {
      soldier.missionStartTime = Date.now()
      soldier.missionEndTime = Date.now() + (soldier.taskTime * 1000)
      localStorage.setItem('soldiers', JSON.stringify(soldiers))
      renderHome()
    }
}

// Helper function to create input elements
function createInput(type, placeholder, id, value = '') {
  const input = document.createElement('input')
  input.type = type
  input.placeholder = placeholder
  input.id = id
  input.value = value
  return input
}

// Helper function to create select elements
function createSelect(options, id, value = '') {
  const select = document.createElement('select')
  select.id = id

  options.forEach(option => {
    const opt = document.createElement('option')
    opt.value = option
    opt.innerText = option
    if (option === value) opt.selected = true
    select.appendChild(opt)
  })

  return select
}

function renderEditPage(index) {
  app.innerHTML = '' // Clear the app content

  const editContainer = document.createElement('div')
  editContainer.classList.add('container', 'edit-container')  // Add 'edit-container' class

  const editTitle = document.createElement('h2')
  editTitle.innerText = 'Edit Soldier'
  editContainer.appendChild(editTitle)
  const editHr = document.createElement('hr')
  editContainer.appendChild(editHr)

  const soldier = soldiers[index]

  const fullName = createInput('text', 'Full Name', 'fullName', soldier.fullName)
  const rank = createInput('text', 'Rank', 'rank', soldier.rank)
  const position = createInput('text', 'Position', 'position', soldier.position)
  const platoon = createInput('text', 'Platoon', 'platoon', soldier.platoon)
  const status = createSelect(['Active', 'Reserve', 'Retired'], 'status', soldier.status)
  const taskTime = createInput('number', 'Task Time (minutes)', 'taskTime', soldier.taskTime)

  const saveBtn = document.createElement('button')
  saveBtn.innerText = 'Save Changes'
  saveBtn.onclick = () => {
    handleFormSubmit(index)
    renderHome()
  }

  const cancelBtn = document.createElement('button')
  cancelBtn.innerText = 'Cancel'
  cancelBtn.classList.add('cancel-btn')
  cancelBtn.onclick = renderHome

  editContainer.append(fullName, rank, position, platoon, status, taskTime, saveBtn, cancelBtn)
  app.appendChild(editContainer)
}
function updateMissionButton(button, endTime) {
  const updateTimer = () => {
    const timeLeft = Math.max(0, endTime - Date.now());
    if (timeLeft > 0) {
      button.innerText = `${Math.floor(timeLeft / 1000)}s`;
      setTimeout(updateTimer, 1000);
    } else {
      button.innerText = 'Mission Completed';
      button.disabled = true;
    }
  };
  updateTimer();
}

console.log('Soldiers array:', soldiers)
