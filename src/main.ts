import { LocalStorageApi } from './api/localStorageApi';
import { loadProjects } from './projectManager';
import { loadTasks } from './taskManager';
import { loggedInUser } from './userContext';

const apiProjects = new LocalStorageApi('projects');

document.addEventListener('DOMContentLoaded', initApp);

function initApp() {

    console.log(`Hello ${loggedInUser.name}`)
    //Current Project Id is read becouse of loadProjects();
    setupNavigation();
    loadProjects();
    loadTasks();
}


function setupNavigation() {
    const projectListContainer = document.getElementById('project-container-list') as HTMLElement;
    const taskListContainer = document.getElementById('task-container-list') as HTMLElement;

    const taskListButton = document.getElementById('tasklist-navigation-button') as HTMLElement;
    taskListButton.addEventListener('click', () => {
        if (apiProjects.getCurrentProjectId() > 0) {
            navigateTo(taskListContainer, projectListContainer);
        } else {
            alert("No project selected. Please select a project first.");
        }
    });

    const projectListButton = document.getElementById('projectlist-navigation-button') as HTMLElement;
    projectListButton.addEventListener('click', () => navigateTo(projectListContainer, taskListContainer));
}

function navigateTo(visibleContainer: HTMLElement, hiddenContainer: HTMLElement) {
    visibleContainer.style.display = 'block';
    hiddenContainer.style.display = 'none';
}


