import { Task } from './models/task';
import { LocalStorageApi } from './api/localStorageApi';
import { loggedInUser } from './userContext';

const apiProjects = new LocalStorageApi('projects');
let currentProjectId = apiProjects.getCurrentProjectId();
const api = new LocalStorageApi('tasks');
let currentTaskId = api.getCurrentTaskId();

const newTaskButton = document.getElementById('task-new-modal-button') as HTMLElement;
const modalNewTask = document.getElementById('task-new-modal') as HTMLElement;
const modalTaskUpdate = document.getElementById('task-container-details') as HTMLElement;
const taskListContainer = document.getElementById('task-container-list') as HTMLElement;



const addTaskToList = (task: Task) => {
    const listElement = document.createElement('div');
    listElement.className = 'task';
    listElement.id = `${task.id}`
    listElement.addEventListener('click', () => {
        showTaskDetails(task);
    });

    const taskName = document.createElement('div');
    taskName.textContent = `${task.name}`;
    taskName.className = 'task-name';

    listElement.appendChild(taskName);

    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'task-container-list-actions';

    const selectButton = document.createElement('button');
    selectButton.textContent = 'Select';
    selectButton.addEventListener('click', () => {
        setCurrentTask(task.id);
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteTask(task.id, listElement));

    actionsContainer.appendChild(selectButton);
    actionsContainer.appendChild(deleteButton);

    listElement.appendChild(actionsContainer);
    document.getElementById('task-container-list')!.appendChild(listElement);
};



// new task submission
document.getElementById('task-form')!.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('task-name') as HTMLInputElement;
    const descriptionInput = document.getElementById('task-description') as HTMLInputElement;
    const priorityInput = document.getElementById('task-priority') as HTMLSelectElement;

    const priority: 'low' | 'medium' | 'high' = priorityInput.value as 'low' | 'medium' | 'high';

    const task = new Task(Date.now(), nameInput.value, descriptionInput.value, priority, currentProjectId, new Date, 'todo', loggedInUser.id);
    api.createTask(task);
    addTaskToList(task);
    nameInput.value = '';
    descriptionInput.value = '';
    priorityInput.value = '';
});

// existing task submission
document.getElementById('task-details-form')!.addEventListener('submit', (e) => {
    e.preventDefault();
    if (currentTaskId == null) {
        alert("No task selected for details.");
        return;
    }
    const nameInput = document.getElementById('task-details-name') as HTMLInputElement;
    const descriptionInput = document.getElementById('task-details-description') as HTMLInputElement;
    const priorityInput = document.getElementById('task-details-priority') as HTMLSelectElement;

    const priority: 'low' | 'medium' | 'high' = priorityInput.value as 'low' | 'medium' | 'high';

    const updatedTask = new Task(currentTaskId, nameInput.value, descriptionInput.value, priority, currentProjectId, new Date, 'todo', loggedInUser.id);;
    api.updateTask(updatedTask);

    currentTaskId = 0;

    loadTasks();

    taskListContainer.style.display = 'block';
    modalTaskUpdate.style.display = 'none';
});



newTaskButton.addEventListener('click', () => {
    if (apiProjects.getCurrentProjectId() > 0) {
        modalNewTask.style.display = "block";
    } else
        alert("No project selected. Please select a project first.");

});

window.addEventListener('click', (event) => {
    if (modalNewTask !== null && event.target === modalNewTask) {
        modalNewTask.style.display = "none";
        taskListContainer.style.display = "block";
    } else if (modalTaskUpdate !== null && event.target === modalTaskUpdate) {
        modalTaskUpdate.style.display = "none";
        taskListContainer.style.display = "block";
    }
});



function deleteTask(taskId: number, listElement: HTMLElement) {
    api.deleteTask(taskId);
    const currentTaskId: number = api.getCurrentTaskId();
    if (taskId === currentTaskId) {
        setCurrentTask(0);
    }
    listElement.remove();
}

function showTaskDetails(task: Task) {
    currentTaskId = task.id;
    const detailsNameInput = document.getElementById('task-details-name') as HTMLInputElement;
    const detailsDescriptionInput = document.getElementById('task-details-description') as HTMLInputElement;
    const detailsPriorityInput = document.getElementById('task-details-priority') as HTMLSelectElement;
    detailsNameInput.value = task.name;
    detailsDescriptionInput.value = task.description;
    detailsPriorityInput.value = task.priority;
    taskListContainer.style.display = 'none';
    modalTaskUpdate.style.display = 'block';
}

function setCurrentTask(id: number): void {
    api.setCurrentTaskId(id);
}

function clearTaskList() {
    taskListContainer.innerHTML = ''; // Clear the contents of the task list
}

export function loadTasks() {
    clearTaskList();
    const tasks = api.getTasks();
    tasks.forEach(addTaskToList);
};

