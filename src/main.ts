import { loadProjects } from './projectManager';

document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    setupNavigation();
    loadProjects();
    console.log(`Current project ID: ${storedId}`);
}

const storedId: number = localStorage.getItem('currentProjectId') !== null ? parseInt(localStorage.getItem('currentProjectId')!) : 0;



function setupNavigation() {
    const projectListContainer = document.getElementById('container-project-list') as HTMLElement;
    const taskListContainer = document.getElementById('container-task-list') as HTMLElement;

    const taskListButton = document.getElementById('tasklist-navigation-button') as HTMLElement;
    taskListButton.addEventListener('click', () => {
        if (storedId) {
            navigateTo(taskListContainer, projectListContainer);
        } else {
            alert("No project selected. Please select a project first.");
        }
    });



    const projectListButton = document.getElementById('projectlist-navigation-button') as HTMLElement;
    projectListButton.addEventListener('click', () => { navigateTo(projectListContainer, taskListContainer) });

    function navigateTo(visibleContainer: HTMLElement, hiddenContainer: HTMLElement) {
        visibleContainer.style.display = 'block';
        hiddenContainer.style.display = 'none';
    }
}
