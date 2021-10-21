import TodoList from "./todoList";

const time = document.querySelector(".time");
const addProject = document.querySelector(".add-project");

function showTime() {
  let currentTime = new Date(),
    hour = currentTime.getHours(),
    min = currentTime.getMinutes(),
    sec = currentTime.getSeconds();

  time.innerHTML = `${hour}<span>:</span>${addZeroToClock(
    min
  )}<span>:</span>${addZeroToClock(sec)}`;

  setTimeout(showTime, 1000);
}

function addZeroToClock(time) {
  return parseInt(time) < 10 ? "0" + time : time;
}

//Event: Load page
window.addEventListener("load", (e) => {
  showTime();
  renderProjects();
  renderTasks();
});

//DOM elements from projects section
const projectForm = document.querySelector("#project-form");
let projectInputField = document.querySelector(".new-project-field");
const projectsList = document.querySelector(".project-list");

//Event: Add book upon submission
projectForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newProject = projectInputField.value;
  if (newProject === "" || newProject === null) return;
  TodoList.addProject(newProject);
  renderProjects();
  projectInputField.value = null;
});

function renderProjects() {
  projectsList.innerHTML = "";
  TodoList.savedProjects.forEach((project) => {
    const newProjectElement = document.createElement("li");
    newProjectElement.textContent = `${project.name}`;
    newProjectElement.dataset.id = project.id;
    if (newProjectElement.dataset.id === TodoList.getSelectedProjectId()) {
      newProjectElement.classList.add("active-project");
    }
    projectsList.appendChild(newProjectElement);
  });
}

//Event: Select project
projectsList.addEventListener("click", (e) => {
  TodoList.saveSelectedProject(e.target.dataset.id);
  renderProjects();
  renderTasks();
});

//DOM elements from tasks section
const taskProjectTitle = document.querySelector(".tasks-title h3");
const deleteProjectBtn = document.querySelector(".delete-project");
const tasksList = document.querySelector(".tasks-list");
const taskTemplate = document.querySelector("#task-template");
const openModalBtn = document.querySelector(".open-modal");
const addTaskModal = document.querySelector(".modal");
const taskForm = document.querySelector(".modal-form");
const btnModalCancel = document.querySelector(".btn-modal-cancel");
const taskName = document.querySelector(".add-task-field");
const description = document.querySelector(".add-task-description");
const dueDate = document.querySelector("#task-due-date");

//Event: open Modal
openModalBtn.addEventListener("click", (e) => {
  openTaskModal();
  taskName.focus();
});

//Event: close Modal
btnModalCancel.addEventListener("click", (e) => {
  closeTaskModal();
});

//Event: Add tasks
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  TodoList.addTask(taskName.value, description.value, dueDate.value);
  closeTaskModal();
  renderTasks();
});

//Event: complete Task
tasksList.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "input") {
    TodoList.markCompletedTask(e.target);
  }
});

//Event: delete task
tasksList.addEventListener("click", (e) => {
  if (e.target.classList.contains("task-del-icon")) {
    TodoList.deleteTask(e.target);
    renderTasks();
  }
});

//Event: Update task due date
tasksList.addEventListener("change", (e) => {
  if (e.target.classList.contains("task-due-date")) {
    TodoList.updateDueDate(e.target);
    renderTasks();
  }
});

//Event: delete project
deleteProjectBtn.addEventListener("click", (e) => {
  TodoList.removeProject();
  renderProjects();
  renderTasks();
});

function renderTaskTitle() {
  const currProject = TodoList.getSelectedProjectName();
  taskProjectTitle.textContent = currProject;
}

function renderTasks() {
  const currProject = TodoList.getSelectedProjectName();
  tasksList.innerHTML = ""; // clear list
  renderTaskTitle();

  const tasks = TodoList.getTasks();
  tasks.forEach((task) => {
    const taskElement = taskTemplate.content.cloneNode(true);
    const taskName = taskElement.querySelector(".task-name label");
    const checkBox = taskElement.querySelector(".task-name input");
    const taskDescription = taskElement.querySelector(".task-description");
    const taskDueDate = taskElement.querySelector(".task-due-date");
    const taskDeleteBtn = taskElement.querySelector(".task-del-icon");

    checkBox.id = task.id;
    checkBox.checked = task.completed;
    taskName.htmlFor = task.id;
    taskName.append(task.taskName);
    taskDescription.textContent = task.description;
    taskDueDate.id = task.id;
    taskDueDate.value = task.dueDate;
    taskDeleteBtn.id = task.id;

    tasksList.appendChild(taskElement);
  });
}

function openTaskModal() {
  addTaskModal.style.display = "block";
}

function closeTaskModal() {
  //clear fields
  taskName.value = null;
  description.value = null;
  dueDate.value = null;
  addTaskModal.style.display = "none";
}
