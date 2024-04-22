import { Project } from './models/project';
import { LocalStorageApi } from './api/localStorageApi';

const api = new LocalStorageApi('projects');

const newProjectButton = document.getElementById('project-new-modal-button') as HTMLElement;
const modalNewProject = document.getElementById('project-new-modal') as HTMLElement;
const modalProjectDescription = document.getElementById('project-description-modal') as HTMLElement;
const modalProjectDescriptionContent = document.getElementById('project-description-content') as HTMLElement;
const modalProjectUpdate = document.getElementById('project-update-modal') as HTMLElement;
const projectListContainer = document.getElementById('project-container-list') as HTMLElement;



const addProjectToList = (project: Project) => {
    const listElement = document.createElement('div');
    listElement.className = 'project';
    listElement.id = `${project.id}`

    const projectName = document.createElement('div');
    projectName.textContent = `${project.name} ❔`;
    projectName.className = 'project-name';

    projectName.addEventListener('click', () => {
        showProjectDetails(project);
    });

    listElement.appendChild(projectName);

    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'project-container-list-actions';

    const selectButton = document.createElement('button');
    selectButton.textContent = 'Select';
    selectButton.addEventListener('click', () => {
        setCurrentProject(project.id);
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
    document.getElementById('project-container-list')!.appendChild(listElement);
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
    let currentProjectId = api.getCurrentProjectId();
    if (currentProjectId == null) {
        alert("No project selected for update.");
        return;
    }
    const nameInput = document.getElementById('project-update-name') as HTMLInputElement;
    const descriptionInput = document.getElementById('project-update-description') as HTMLInputElement;

    const updatedProject = new Project(currentProjectId, nameInput.value, descriptionInput.value);
    api.updateProject(updatedProject);

    const updateModal = document.getElementById("project-update-modal") as HTMLElement;
    updateModal.style.display = 'none';
    api.setCurrentProjectId(0);
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
    const currentProjectId: number = api.getCurrentProjectId();
    if (projectId === currentProjectId) {
        setCurrentProject(0);
    }
    listElement.remove();
}

function showProjectDetails(project: Project) {
    if (modalProjectDescriptionContent) {
        modalProjectDescriptionContent.textContent = project.description;
        modalProjectDescription.style.display = 'block';
    }
}

function prepareProjectUpdate(project: Project) {
    api.setCurrentProjectId(project.id);
    const updateNameInput = document.getElementById('project-update-name') as HTMLInputElement;
    const updateDescriptionInput = document.getElementById('project-update-description') as HTMLInputElement;
    updateNameInput.value = project.name;
    updateDescriptionInput.value = project.description;
    modalProjectUpdate.style.display = 'block';
}

function setCurrentProject(id: number): void {
    api.setCurrentProjectId(id);
    setCurrentProjectColor(id);
}

function setCurrentProjectColor(id: number): void {

    const allProjects = document.querySelectorAll('.project');
    allProjects.forEach((project) => {
        (project as HTMLElement).style.backgroundColor = ''; 
    });
    
    const selectedProject = document.getElementById(`${id}`);
    if (selectedProject) {
        selectedProject.style.backgroundColor = '#999999';
    }
}

export function loadProjects() {
    const projects = api.getProjects();
    projects.forEach(addProjectToList);
    setCurrentProjectColor(api.getCurrentProjectId());
};

