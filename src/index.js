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

const TodoList = (function () {
  let savedProjects = JSON.parse(localStorage.getItem("projectList")) || [];

  const addProject = function (project) {
    savedProjects.push(project);
    localStorage.setItem("projectList", JSON.stringify(savedProjects));
  };

  const saveSelectedProject = function (id) {
    savedProjects.forEach((project) => {
      if (project.id === id) {
        localStorage.setItem("selectedProject", JSON.stringify(project));
      }
    });
  };

  const getSelectedProjectId = function () {
    const project = JSON.parse(localStorage.getItem("selectedProject")) || null;
    if (project) {
      return project.id;
    }
  };

  const getSelectedProjectName = function () {
    const project = JSON.parse(localStorage.getItem("selectedProject")) || null;
    if (project) {
      return project.name;
    }
  };

  const addTask = function (taskName, description, dueDate) {
    const task = new Task(taskName, description, dueDate);
    const currentProject = savedProjects.findIndex(
      (project) => project.id === getSelectedProjectId()
    );
    savedProjects[currentProject].tasks.push(task);
  };

  return {
    savedProjects,
    addProject,
    saveSelectedProject,
    getSelectedProjectId,
    getSelectedProjectName,
    addTask,
  };
})();

class Project {
  constructor(name) {
    this.id = Math.random().toString();
    this.name = name;
    this.tasks = [];
  }
}

class Task {
  constructor(taskName, description, dueDate) {
    this.taskName = taskName;
    this.description = description;
    this.dueDate = dueDate;
  }
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
  const newProjectName = projectInputField.value;
  if (newProjectName === "" || newProjectName === null) return;
  const newProject = new Project(newProjectName);
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
const tasksList = document.querySelector(".tasks-list");
const taskProjectTitle = document.querySelector(".tasks-title");
const openModalBtn = document.querySelector(".open-modal");
const addTaskModal = document.querySelector(".modal");
const taskForm = document.querySelector(".modal-form");
const addTaskBtn = document.querySelector("btn-modal-add");
const btnModalCancel = document.querySelector(".btn-modal-cancel");
const taskTemplate = document.querySelector("#task-template");
const taskTemplateContent = taskTemplate.content.cloneNode(true);
const taskContainer = document.querySelector(".task");
const taskName = document.querySelector(".add-task-field");
const description = document.querySelector(".add-task-description");
const dueDate = document.querySelector("#task-due-date");

//Event: open Modal
openModalBtn.addEventListener("click", (e) => {
  openTaskModal();
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
});

function renderTasks() {
  taskProjectTitle.textContent = TodoList.getSelectedProjectName();
  tasksList.innerHTML = ""; // clear list

  // TodoList.tasks
  // taskTemplateContent.querySelector("label").textContent =
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
