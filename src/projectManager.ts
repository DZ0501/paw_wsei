import { Project } from './models/project';
import { LocalStorageApi } from './api/localStorageApi';

const api = new LocalStorageApi('projects');
export let currentProjectId: number;



const newProjectButton = document.getElementById('new-project-modal-button') as HTMLElement;
const modalNewProject = document.getElementById('new-project-modal') as HTMLElement;
const modalProjectDescription = document.getElementById('project-description-modal') as HTMLElement;
const modalProjectDescriptionContent = document.getElementById('project-description-content') as HTMLElement;
const modalProjectUpdate = document.getElementById('project-update-modal') as HTMLElement;
const projectListContainer = document.getElementById('container-project-list') as HTMLElement;



const addProjectToList = (project: Project) => {
    const listElement = document.createElement('div');
    listElement.className = 'project';

    const projectName = document.createElement('div');
    projectName.textContent = `${project.name} ❔`;
    projectName.className = 'project-name';

    projectName.addEventListener('click', () => {
        showProjectDetails(project);
    });

    listElement.appendChild(projectName);

    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'container-project-list-actions';

    const selectButton = document.createElement('button');
    selectButton.textContent = 'Select';
    selectButton.addEventListener('click', () => {
        setCurrentProjectId(project.id);
    });

    const updateButton = document.createElement('button');
    updateButton.textContent = 'Update';
    updateButton.addEventListener('click', () => {
        prepareProjectUpdate(project);
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteProject(project.id, listElement));

    actionsContainer.appendChild(selectButton);
    actionsContainer.appendChild(updateButton);
    actionsContainer.appendChild(deleteButton);

    listElement.appendChild(actionsContainer);
    document.getElementById('container-project-list')!.appendChild(listElement);
};



// new project submission
document.getElementById('project-form')!.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('project-name') as HTMLInputElement;
    const descriptionInput = document.getElementById('project-description') as HTMLInputElement;

    const project = new Project(Date.now(), nameInput.value, descriptionInput.value);
    api.createProject(project);
    addProjectToList(project);
    nameInput.value = '';
    descriptionInput.value = '';
});

// existing project sumbission
document.getElementById('project-update-form')!.addEventListener('submit', () => {
    if (currentProjectId == 0) {
        alert("No project selected for update.");
        return;
    }
    const nameInput = document.getElementById('update-project-name') as HTMLInputElement;
    const descriptionInput = document.getElementById('update-project-description') as HTMLInputElement;

    const updatedProject = new Project(currentProjectId, nameInput.value, descriptionInput.value);
    api.updateProject(updatedProject);

    const updateModal = document.getElementById("project-update-modal") as HTMLElement;
    updateModal.style.display = 'none';
    currentProjectId = 0;
});



newProjectButton.addEventListener('click', () => {
    modalNewProject.style.display = "block";
});

window.addEventListener('click', (event) => {
    if (modalNewProject !== null && event.target === modalNewProject) {
        modalNewProject.style.display = "none";
        projectListContainer.style.display = "block";
    } else if (modalProjectDescription !== null && event.target === modalProjectDescription) {
        modalProjectDescription.style.display = "none";
        projectListContainer.style.display = "block";
    } else if (modalProjectUpdate !== null && event.target === modalProjectUpdate) {
        modalProjectUpdate.style.display = "none";
        projectListContainer.style.display = "block";
    }
});



function deleteProject(projectId: number, listElement: HTMLElement) {
    api.deleteProject(projectId);
    api.setCurrentProject(0);
    listElement.remove();
}

function showProjectDetails(project: Project) {
    if (modalProjectDescriptionContent) {
        modalProjectDescriptionContent.textContent = project.description;
        modalProjectDescription.style.display = 'block';
    }
}

function prepareProjectUpdate(project: Project) {
    currentProjectId = project.id;
    const updateNameInput = document.getElementById('update-project-name') as HTMLInputElement;
    const updateDescriptionInput = document.getElementById('update-project-description') as HTMLInputElement;
    updateNameInput.value = project.name;
    updateDescriptionInput.value = project.description;
    modalProjectUpdate.style.display = 'block';
}

export function loadProjects() {
    const projects = api.getProjects();
    projects.forEach(addProjectToList);
};

export function setCurrentProjectId(id: number) {
    api.setCurrentProject(id);
    console.log(`Current project ID: ${id}`);
}

