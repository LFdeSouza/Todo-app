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
    this.id = Math.random().toString();
    this.description = description;
    this.dueDate = dueDate;
    this.completed = false;
  }
}

export default class TodoList {
  static savedProjects = JSON.parse(localStorage.getItem("projectList")) || [];

  static updateStorage() {
    localStorage.setItem("projectList", JSON.stringify(this.savedProjects));
  }
  static addProject(project) {
    const newProject = new Project(project);
    this.savedProjects.push(newProject);
    this.updateStorage();
  }

  static saveSelectedProject(id) {
    this.savedProjects.forEach((project) => {
      if (project.id === id) {
        localStorage.setItem("selectedProject", JSON.stringify(project));
      }
    });
  }

  static getSelectedProjectId() {
    const project = JSON.parse(localStorage.getItem("selectedProject")) || null;
    if (project) {
      return project.id;
    }
  }

  static getSelectedProjectName() {
    const project = JSON.parse(localStorage.getItem("selectedProject")) || null;
    if (project) {
      return project.name;
    }
  }

  static getSelectedProjectIndex() {
    const project = JSON.parse(localStorage.getItem("selectedProject")) || null;
    const currentProject = this.savedProjects.findIndex(
      (project) => project.id === this.getSelectedProjectId()
    );
    return currentProject;
  }

  static removeProject() {
    const currentProject = this.getSelectedProjectIndex();
    this.savedProjects.splice(currentProject, 1);
    this.updateStorage();
    localStorage.setItem("selectedProject", JSON.stringify(null));
  }

  static addTask(taskName, description, dueDate) {
    const task = new Task(taskName, description, dueDate);
    const currentProject = this.getSelectedProjectIndex();
    this.savedProjects[currentProject].tasks.push(task);
    this.updateStorage();
  }

  static getTasks() {
    const currentProject = this.getSelectedProjectIndex();
    return this.savedProjects[currentProject].tasks;
  }

  static markCompletedTask(selectedTask) {
    const currentProject = this.getSelectedProjectIndex();
    const task = this.savedProjects[currentProject].tasks.find(
      (task) => task.id === selectedTask.id
    );
    task.completed = selectedTask.checked;
    this.updateStorage();
  }

  static updateDueDate(selectedTask) {
    const currentProject = this.getSelectedProjectIndex();
    const task = this.savedProjects[currentProject].tasks.find(
      (task) => task.id === selectedTask.id
    );
    task.dueDate = selectedTask.value;
    this.updateStorage();
  }

  static deleteTask(selectedTask) {
    const currentProject = this.getSelectedProjectIndex();
    const task = this.savedProjects[currentProject].tasks.findIndex(
      (task) => task.id === selectedTask.id
    );
    TodoList.savedProjects[currentProject].tasks.splice(task, 1);
    this.updateStorage();
  }
}
