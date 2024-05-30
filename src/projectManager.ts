import { Project } from './models/project';
import { MongoApi } from './api/mongoApi';

const api = new MongoApi;

const newProjectButton = document.getElementById('project-modal-new-button') as HTMLElement;
const modalNewProject = document.getElementById('project-modal-new') as HTMLElement;
const modalProjectDescription = document.getElementById('project-modal-description') as HTMLElement;
const modalProjectDescriptionContent = document.getElementById('project-description-content') as HTMLElement;
const modalProjectUpdate = document.getElementById('project-modal-update') as HTMLElement;
const projectListContainer = document.getElementById('project-container-list') as HTMLElement;

const nameInput = document.getElementById('project-name') as HTMLInputElement;
const descriptionInput = document.getElementById('project-description') as HTMLInputElement;
const updateNameInput = document.getElementById('project-update-name') as HTMLInputElement;
const updateDescriptionInput = document.getElementById('project-update-description') as HTMLInputElement;

function addProjectToList(project: Project) {
    const listElement = document.createElement('div');
    listElement.className = 'project';
    listElement.id = `${project.id}`;

    const projectName = document.createElement('div');
    projectName.textContent = `${project.name} ❔`;
    projectName.className = 'project-name';
    projectName.addEventListener('click', () => showProjectDetails(project));
    listElement.appendChild(projectName);

    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'project-container-list-actions';

    const selectButton = document.createElement('button');
    selectButton.textContent = 'Select';
    selectButton.addEventListener('click', () => {
        setCurrentProject(project.id);
        setCurrentProjectColor(project.id);
    });
    actionsContainer.appendChild(selectButton);

    const updateButton = document.createElement('button');
    updateButton.textContent = 'Update';
    updateButton.addEventListener('click', () => prepareProjectUpdate(project));
    actionsContainer.appendChild(updateButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteProject(project.id, listElement));
    actionsContainer.appendChild(deleteButton);

    listElement.appendChild(actionsContainer);
    projectListContainer.appendChild(listElement);
}

async function setCurrentProject(projectId: number): Promise<void> {
    await api.setCurrentProjectId(projectId);
    await api.setCurrentScenarioId(0);
    await api.setCurrentTaskId(0);
}

async function deleteProject(projectId: number, listElement: HTMLElement) {
    await api.deleteProject(projectId);
    await api.deleteScenariosByProjectId(projectId);
    await api.setCurrentProjectId(0);
    listElement.remove();
}

function showProjectDetails(project: Project): void {
    modalProjectDescriptionContent.textContent = project.description;
    modalProjectDescription.style.display = 'block';
}

function prepareProjectUpdate(project: Project): void {
    setCurrentProject(project.id);
    setCurrentProjectColor(project.id);
    updateNameInput.value = project.name;
    updateDescriptionInput.value = project.description;
    modalProjectUpdate.style.display = 'block';
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

newProjectButton.addEventListener('click', () => {
    modalNewProject.style.display = "block";
});

document.getElementById('project-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const project = new Project(Date.now(), nameInput.value, descriptionInput.value);
    await api.createProject(project);
    addProjectToList(project);
    nameInput.value = '';
    descriptionInput.value = '';
});

document.getElementById('project-form-update')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const currentProjectId = await api.getCurrentProjectId();
    if (currentProjectId == null) {
        alert("No project selected for update.");
        return;
    }

    const updatedProject = new Project(currentProjectId, updateNameInput.value, updateDescriptionInput.value);
    await api.updateProject(updatedProject);
    loadProjects();
    modalProjectUpdate.style.display = 'none';
    setCurrentProjectColor(currentProjectId);
});

window.addEventListener('click', (event) => {
    toggleModalVisibility(event, modalNewProject, false);
    toggleModalVisibility(event, modalProjectDescription, false);
    toggleModalVisibility(event, modalProjectUpdate, false);
});

function toggleModalVisibility(event: MouseEvent, modalElement: HTMLElement, shouldBeVisible: boolean) {
    if (modalElement !== null && event.target === modalElement) {
        modalElement.style.display = shouldBeVisible ? "block" : "none";
        projectListContainer.style.display = shouldBeVisible ? "none" : "block";
    }
}

function clearProjectList(): void {
    projectListContainer.innerHTML = '';
}

export async function loadProjects() {
    clearProjectList();
    const projects = await api.getProjects();
    projects.forEach(addProjectToList);
    setCurrentProjectColor(await api.getCurrentProjectId());
}
