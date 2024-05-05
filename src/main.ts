import { LocalStorageApi } from './api/localStorageApi';
import { loadProjects } from './projectManager';
import { loadScenarios } from './scenarioManager';
import { loadTasks } from './taskManager';
import { loggedInUser } from './userContext';

const apiProjects = new LocalStorageApi('projects');

document.addEventListener('DOMContentLoaded', initApp);

function initApp() {

    console.log(`Hello ${loggedInUser.name}`)
    //Current Project Id is read becouse of loadProjects();
    setupNavigation();
    loadProjects();
    loadScenarios();
    loadTasks();
}

function setupNavigation() {
    document.getElementById('tasklist-navigation-button')?.addEventListener('click', () => {
        navigateToSection('task');
    });

    document.getElementById('projectlist-navigation-button')?.addEventListener('click', () => {
        navigateToSection('project');
    });

    document.getElementById('scenariolist-navigation-button')?.addEventListener('click', () => {
        navigateToSection('scenario');
    });
}

function navigateToSection(section: 'project' | 'task' | 'scenario') {
    const projectListContainer = document.getElementById('project-container-list') as HTMLElement;
    const taskListContainer = document.getElementById('task-container-list') as HTMLElement;
    const scenarioListContainer = document.getElementById('scenario-container-list') as HTMLElement;

    const ProjectModalNewButton = document.getElementById('project-modal-new-button') as HTMLButtonElement;
    const ScenarioModalNewButton = document.getElementById('scenario-modal-new-button') as HTMLButtonElement;
    const TaskModalNewButton = document.getElementById('task-modal-new-button') as HTMLButtonElement;

    const navigationStatuses = document.getElementById('navigation-statuses') as HTMLElement;

    const kanbanNavigationButton = document.getElementById('task-container-button-kanban') as HTMLButtonElement;
    const kanbanContainer = document.getElementById('task-container-kanban') as HTMLElement;

    [projectListContainer, taskListContainer, scenarioListContainer].forEach(container => container.style.display = 'none');
    navigationStatuses.style.display = 'none';

    [ProjectModalNewButton, ScenarioModalNewButton, TaskModalNewButton].forEach(button => button.style.display = 'none');
    navigationStatuses.style.display = 'none';

    switch (section) {
        case 'project':
            ProjectModalNewButton.style.display = 'block';
            projectListContainer.style.display = 'block';
            navigationStatuses.style.display = 'none';
            kanbanNavigationButton.style.display = 'none';
            break;
        case 'scenario':
            if (apiProjects.getCurrentProjectId() > 0) {
                ScenarioModalNewButton.style.display = 'block';
                scenarioListContainer.style.display = 'block';
                navigationStatuses.style.display = 'flex';
                kanbanNavigationButton.style.display = 'none';
                loadScenarios();
            } else {
                alert("No project selected. Please select a project first.");
            }
            break;
        case 'task':
            if (apiProjects.getCurrentProjectId() > 0) {
                TaskModalNewButton.style.display = 'block';
                kanbanNavigationButton.style.display = 'block';
                taskListContainer.style.display = 'block';
                navigationStatuses.style.display = 'flex';
                kanbanContainer.style.display = 'none';
                loadTasks();
            } else {
                alert("No project selected. Please select a project first.");
            }
            break;
    }
}
