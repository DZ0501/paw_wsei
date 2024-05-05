import { Task } from './models/task';
import { LocalStorageApi } from './api/localStorageApi';
import { loggedInUser, users } from './userContext';

const apiTasks = new LocalStorageApi('tasks');
const apiScenarios = new LocalStorageApi('scenarios');

const newTaskButton = document.getElementById('task-modal-new-button') as HTMLElement;
const modalNewTask = document.getElementById('task-modal-new') as HTMLElement;
const modalTaskUpdate = document.getElementById('task-container-details') as HTMLElement;
const taskListContainer = document.getElementById('task-container-list') as HTMLElement;

const statusButtonAll = document.getElementById("navigation-statuses-button-all") as HTMLElement;
const statusButtonTodo = document.getElementById("navigation-statuses-button-todo") as HTMLElement;
const statusButtonInprogress = document.getElementById("navigation-statuses-button-inprogress") as HTMLElement;
const statusButtonDone = document.getElementById("navigation-statuses-button-done") as HTMLElement;

const nameInput = document.getElementById('task-name') as HTMLInputElement;
const descriptionInput = document.getElementById('task-description') as HTMLInputElement;
const priorityInput = document.getElementById('task-priority') as HTMLSelectElement;
const estimatedTimeInput = document.getElementById('task-estimated-time') as HTMLInputElement;

const updateNameInput = document.getElementById('task-details-name') as HTMLInputElement;
const updateDescriptionInput = document.getElementById('task-details-description') as HTMLInputElement;
const updatePriorityInput = document.getElementById('task-details-priority') as HTMLSelectElement;
const updateStatusInput = document.getElementById('task-details-status') as HTMLSelectElement;
const updateEstimatedTimeInput = document.getElementById('task-details-estimated-time') as HTMLInputElement;
const updateCreationDateInput = document.getElementById('task-details-creation-date') as HTMLInputElement;
const updateStartDateInput = document.getElementById('task-details-start-date') as HTMLInputElement;
const updateEndDateInput = document.getElementById('task-details-end-date') as HTMLInputElement;
const updateUserSelect = document.getElementById('task-details-responsible') as HTMLSelectElement;

const kanbanNavigationButton = document.getElementById('task-container-button-kanban') as HTMLButtonElement;


function addTaskToList(task: Task) {
    const listElement = document.createElement('div');
    listElement.className = 'task';
    listElement.id = `${task.id}`;
    listElement.addEventListener('click', () => {
        showTaskDetails(task);
    });

    const taskName = document.createElement('div');
    taskName.textContent = `${task.name}`;
    taskName.className = 'task-name';
    listElement.appendChild(taskName);

    taskListContainer.appendChild(listElement);
}

function showTaskDetails(task: Task) {
    apiTasks.setCurrentTaskId(task.id);
    updateNameInput.value = task.name;
    updateDescriptionInput.value = task.description;
    updatePriorityInput.value = task.priority;
    updateStatusInput.value = task.status;
    updateEstimatedTimeInput.value = task.estimatedTime.toString();
    updateUserSelect.value = task.ownerId.toString();

    if (task.startDate) {
        const startDate = new Date(task.startDate);
        updateStartDateInput.value = startDate.toLocaleString().split('T')[0];
    } else {
        updateStartDateInput.value = "";
    }

    if (task.endDate) {
        const endDate = new Date(task.endDate);
        updateEndDateInput.value = endDate.toLocaleString().split('T')[0];
    } else {
        updateEndDateInput.value = "";
    }

    const dateCreation = new Date(task.creationDate);
    const formattedDateCreation = dateCreation.toISOString().split('T')[0];
    updateCreationDateInput.value = formattedDateCreation;

    taskListContainer.style.display = 'none';
    kanbanNavigationButton.style.display = 'none';
    modalTaskUpdate.style.display = 'block';
}

function clearTaskList(): void {
    taskListContainer.innerHTML = '';
}

export function loadTasks(): void {
    clearTaskList();
    const tasks = apiTasks.getTasksByScenarioId(apiTasks.getCurrentScenarioId());
    tasks.forEach(task => addTaskToList(task));
}

function filterTasks(status: 'all' | 'todo' | 'in progress' | 'done') {
    clearTaskList();
    let tasks = apiTasks.getTasksByScenarioId(apiTasks.getCurrentScenarioId());
    if (status !== 'all') {
        tasks = tasks.filter(task => task.status === status);
    }
    tasks.forEach(task => addTaskToList(task));
}

document.getElementById('task-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const priority: 'low' | 'medium' | 'high' = priorityInput.value as 'low' | 'medium' | 'high';
    const task = new Task(Date.now(), apiTasks.getCurrentScenarioId(), loggedInUser.id, nameInput.value, descriptionInput.value, priority, 'todo', parseInt(estimatedTimeInput.value), new Date());
    apiTasks.createTask(task);
    addTaskToList(task);
    nameInput.value = '';
    descriptionInput.value = '';
});

document.getElementById('task-details-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (apiTasks.getCurrentTaskId() == null) {
        alert("No task selected for details.");
        return;
    }

    const updateStatus: 'todo' | 'in progress' | 'done' = updateStatusInput.value as 'todo' | 'in progress' | 'done';
    const updatePriority: 'low' | 'medium' | 'high' = updatePriorityInput.value as 'low' | 'medium' | 'high';
    const updateStartDate = new Date(updateStartDateInput.value);
    const updateEndDate = new Date(updateEndDateInput.value);

    const existingTask = apiTasks.getTask(apiTasks.getCurrentTaskId());
    if (!existingTask) {
        alert("Task not found.");
        return;
    }

    const updatedTask = new Task(apiTasks.getCurrentTaskId(), apiTasks.getCurrentScenarioId(), parseInt(updateUserSelect.value), updateNameInput.value, updateDescriptionInput.value, updatePriority, updateStatus, parseInt(updateEstimatedTimeInput.value), existingTask.creationDate, updateStartDate, updateEndDate);
    apiTasks.updateTask(updatedTask);

    loadTasks();
    taskListContainer.style.display = 'block';
    modalTaskUpdate.style.display = 'none';
});

document.addEventListener("DOMContentLoaded", () => {
    users.forEach(user => {
        if (user.role === 'devops' || user.role === 'developer') {
            const option = document.createElement('option');
            option.value = user.id.toString();
            option.textContent = `${user.name} ${user.surname}`;
            updateUserSelect.appendChild(option);
        }
    });
})

document.addEventListener("DOMContentLoaded", () => {
    const deleteButton = document.getElementById('task-details-delete');
    if (deleteButton) {
        deleteButton.addEventListener('click', () => {
            const currentTaskId = apiTasks.getCurrentTaskId();
            if (currentTaskId) {
                const confirmed = confirm("Are you sure you want to delete this task?");
                if (confirmed) {
                    apiTasks.deleteTask(currentTaskId);

                    modalTaskUpdate.style.display = 'none';
                    taskListContainer.style.display = 'block';

                    loadTasks();
                }
            } else {
                alert("No task is currently selected for deletion.");
            }
        });
    }
});

newTaskButton.addEventListener('click', () => {
    if (apiScenarios.getCurrentScenarioId() > 0) {
        modalNewTask.style.display = "block";
    } else {
        alert("No scenario selected. Please select a scenario first.");
    }
});


updateUserSelect.addEventListener('change', (event) => {
    const selectElement = event.target as HTMLSelectElement;
    if (selectElement) {
        const selectedUserId = selectElement.value;
        const currentTaskId = apiTasks.getCurrentTaskId();
        if (currentTaskId) {
            const task = apiTasks.getTask(currentTaskId);
            if (task) {
                task.ownerId = parseInt(selectedUserId, 10);

                if (task.status === 'todo') {
                    task.status = 'in progress';
                    if (!task.startDate) {
                        task.startDate = new Date();
                    }
                }
                apiTasks.updateTask(task);
                showTaskDetails(task);
            }
        }
    } else {
        console.error('The event target is null.');
    }
});



updateStatusInput.addEventListener('change', (event) => {
    const selectElement = event.target as HTMLSelectElement;
    if (selectElement) {
        const selectedStatus = selectElement.value as 'todo' | 'in progress' | 'done';
        const currentTaskId = apiTasks.getCurrentTaskId();
        if (currentTaskId) {
            const task = apiTasks.getTask(currentTaskId);
            if (task) {
                if (task.ownerId === 1) {
                    alert("An owner must be assigned before changing the status.");
                    selectElement.value = task.status;
                    return;
                }
                if ((task.status === 'in progress' && selectedStatus === 'todo') ||
                    (task.status === 'done' && (selectedStatus === 'todo' || selectedStatus === 'in progress'))) {
                    alert("You cannot regress the status of this task.");
                    selectElement.value = task.status;
                    return;
                }
                const confirmed = confirm("Are you sure you want to change the task status?");
                if (!confirmed) {
                    selectElement.value = task.status;
                    return;
                }
                task.status = selectedStatus;
                if (selectedStatus === 'done' && !task.endDate) {
                    task.endDate = new Date();
                }
                apiTasks.updateTask(task);
                showTaskDetails(task);
            }
        }
    } else {
        console.error('The event target is null.');
    }
});


function toggleModalVisibility(event: MouseEvent, modalElement: HTMLElement, shouldBeVisible: boolean) {
    if (modalElement !== null && event.target === modalElement) {
        modalElement.style.display = shouldBeVisible ? "block" : "none";
        taskListContainer.style.display = shouldBeVisible ? "none" : "block";
        kanbanNavigationButton.style.display = shouldBeVisible ? "none" : "block";
        loadTasks();
    }
}

window.addEventListener('click', (event) => {
    toggleModalVisibility(event, modalNewTask, false);
    toggleModalVisibility(event, modalTaskUpdate, false);
});


kanbanNavigationButton.addEventListener('click', () => {
    const kanbanContainer = document.getElementById('task-container-kanban') as HTMLElement;
    const todoContainer = document.getElementById('task-container-kanban-todo') as HTMLElement;
    const inProgressContainer = document.getElementById('task-container-kanban-inprogress') as HTMLElement;
    const doneContainer = document.getElementById('task-container-kanban-done') as HTMLElement;

    if (kanbanContainer.style.display === 'none' || kanbanContainer.style.display === '') {
        kanbanContainer.style.display = 'block';
        taskListContainer.style.display = 'none';
        newTaskButton.style.display = 'none';

        todoContainer.innerHTML = '<h2>To do</h2>';
        inProgressContainer.innerHTML = '<h2>In progress</h2>';
        doneContainer.innerHTML = '<h2>Done</h2>';

        const tasks = apiTasks.getTasks();

        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.textContent = task.name;
            taskElement.className = 'task-card'; 

            switch (task.status) {
                case 'todo':
                    todoContainer.appendChild(taskElement);
                    break;
                case 'in progress':
                    inProgressContainer.appendChild(taskElement);
                    break;
                case 'done':
                    doneContainer.appendChild(taskElement);
                    break;
            }
        });
    } else {
        kanbanContainer.style.display = 'none';
        taskListContainer.style.display = 'block';
        kanbanNavigationButton.style.display = 'block';
        newTaskButton.style.display = 'block';
    }
});



statusButtonAll.addEventListener('click', () => filterTasks('all'));
statusButtonTodo.addEventListener('click', () => filterTasks('todo'));
statusButtonInprogress.addEventListener('click', () => filterTasks('in progress'));
statusButtonDone.addEventListener('click', () => filterTasks('done'));

