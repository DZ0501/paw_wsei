import { Task } from './models/task';
import { LocalStorageApi } from './api/localStorageApi';

const taskApi = new LocalStorageApi('tasks');
let currentProjectId: number;

export function renderTasks() {
    const taskContainer = document.getElementById('task-list') as HTMLElement;
    taskContainer.innerHTML = ''; // Clear previous tasks

    let tasks: Task[];
    if (currentProjectId) {
        tasks = taskApi.getTasks().filter(task => task.projectId === currentProjectId);
    } else {
        tasks = taskApi.getTasks(); // Get all tasks if no project is selected
    }

    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task';
        taskElement.innerHTML = `
            <div class="task-name">${task.name} (${task.priority})</div>
            <div class="task-desc">${task.description}</div>
            <button onclick="deleteTask(${task.id})">Delete</button>
            <button onclick="editTask(${task.id})">Edit</button>
        `;
        taskContainer.appendChild(taskElement);
    });
}

function deleteTask(id: number) {
    taskApi.deleteTask(id);
    renderTasks(); // Re-render tasks after deletion
}

function editTask(id: number) {
    // Code to open edit modal and update task
}
