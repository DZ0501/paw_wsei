import { Scenario } from './models/scenario';
import { LocalStorageApi } from './api/localStorageApi';
import { loggedInUser } from './userContext';

const apiScenarios = new LocalStorageApi('scenarios');

const newScenarioButton = document.getElementById('scenario-modal-new-button') as HTMLElement;
const modalNewScenario = document.getElementById('scenario-modal-new') as HTMLElement;
const modalScenarioUpdate = document.getElementById('scenario-modal-update') as HTMLElement;
const scenarioListContainer = document.getElementById('scenario-container-list') as HTMLElement;
const nameInput = document.getElementById('scenario-name') as HTMLInputElement;
const descriptionInput = document.getElementById('scenario-description') as HTMLInputElement;
const priorityInput = document.getElementById('scenario-priority') as HTMLSelectElement;
const updateNameInput = document.getElementById('scenario-details-name') as HTMLInputElement;
const updateDescriptionInput = document.getElementById('scenario-details-description') as HTMLInputElement;
const updatePriorityInput = document.getElementById('scenario-details-priority') as HTMLSelectElement;
const updateStatusInput = document.getElementById('scenario-details-status') as HTMLSelectElement;
const statusButtonAll = document.getElementById("navigation-statuses-button-all") as HTMLElement;
const statusButtonTodo = document.getElementById("navigation-statuses-button-todo") as HTMLElement;
const statusButtonInprogress = document.getElementById("navigation-statuses-button-inprogress") as HTMLElement;
const statusButtonDone = document.getElementById("navigation-statuses-button-done") as HTMLElement;



function addScenarioToList(scenario: Scenario) {
    const listElement = document.createElement('div');
    listElement.className = 'scenario';
    listElement.id = `${scenario.id}`;
    listElement.addEventListener('click', () => {
        showScenarioDetails(scenario);
    });

    const scenarioName = document.createElement('div');
    scenarioName.textContent = `${scenario.name}`;
    scenarioName.className = 'scenario-name';
    listElement.appendChild(scenarioName);

    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'scenario-actions';
    const selectButton = document.createElement('button');
    selectButton.textContent = 'Select';
    selectButton.addEventListener('click', (event) => {
        event.stopPropagation();
        apiScenarios.setCurrentScenarioId(scenario.id);
        setCurrentScenarioColor(scenario.id);
    });

    actionsContainer.appendChild(selectButton);
    listElement.appendChild(actionsContainer);

    scenarioListContainer.appendChild(listElement);
}

function setCurrentScenarioColor(id: number): void {

    const allScenarios = document.querySelectorAll('.scenario');
    allScenarios.forEach((scenario) => {
        (scenario as HTMLElement).style.backgroundColor = '';
    });

    const selectedScenario = document.getElementById(`${id}`);
    if (selectedScenario) {
        selectedScenario.style.backgroundColor = '#999999';
    }
}

function showScenarioDetails(scenario: Scenario): void {
    apiScenarios.setCurrentScenarioId(scenario.id);
    setCurrentScenarioColor(scenario.id);
    updateNameInput.value = scenario.name;
    updateDescriptionInput.value = scenario.description;
    updatePriorityInput.value = scenario.priority;
    updateStatusInput.value = scenario.status;
    modalScenarioUpdate.style.display = 'block';
}

newScenarioButton.addEventListener('click', () => {
    if (apiScenarios.getCurrentProjectId() > 0) {
        modalNewScenario.style.display = "block";
    } else {
        alert("No project selected. Please select a project first.");
    }
});

statusButtonAll.addEventListener('click', () => filterScenarios('all'));
statusButtonTodo.addEventListener('click', () => filterScenarios('todo'));
statusButtonInprogress.addEventListener('click', () => filterScenarios('in progress'));
statusButtonDone.addEventListener('click', () => filterScenarios('done'));

document.getElementById('scenario-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const priority: 'low' | 'medium' | 'high' = priorityInput.value as 'low' | 'medium' | 'high';
    const scenario = new Scenario(Date.now(), nameInput.value, descriptionInput.value, priority, apiScenarios.getCurrentProjectId(), new Date(), 'todo', loggedInUser.id);
    apiScenarios.createScenario(scenario);
    addScenarioToList(scenario);
    nameInput.value = '';
    descriptionInput.value = '';
});

document.getElementById('scenario-details-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (apiScenarios.getCurrentScenarioId() == null) {
        alert("No scenario selected for details.");
        return;
    }

    const existingScenario = apiScenarios.getScenario(apiScenarios.getCurrentScenarioId());
    if (!existingScenario) {
        alert("Scenario not found.");
        return;
    }

    const updatePriority: 'low' | 'medium' | 'high' = updatePriorityInput.value as 'low' | 'medium' | 'high';
    const updateStatus: 'todo' | 'in progress' | 'done' = updateStatusInput.value as 'todo' | 'in progress' | 'done';
    const updatedScenario = new Scenario(apiScenarios.getCurrentScenarioId(), updateNameInput.value, updateDescriptionInput.value, updatePriority, existingScenario.projectId, existingScenario.creationDate, updateStatus, loggedInUser.id);
    apiScenarios.updateScenario(updatedScenario);

    loadScenarios();

    scenarioListContainer.style.display = 'block';
    modalScenarioUpdate.style.display = 'none';
});

window.addEventListener('click', (event) => {
    toggleModalVisibility(event, modalNewScenario, false);
    toggleModalVisibility(event, modalScenarioUpdate, false);
});

function toggleModalVisibility(event: MouseEvent, modalElement: HTMLElement, shouldBeVisible: boolean) {
    if (modalElement !== null && event.target === modalElement) {
        modalElement.style.display = shouldBeVisible ? "block" : "none";
        scenarioListContainer.style.display = shouldBeVisible ? "none" : "block";
    }
}

export function loadScenarios(): void {
    clearScenarioList();
    const scenarios = apiScenarios.getScenariosByProjectId(apiScenarios.getCurrentProjectId());
    scenarios.forEach(scenario => addScenarioToList(scenario));
    setCurrentScenarioColor(apiScenarios.getCurrentScenarioId());
}

function clearScenarioList(): void {
    scenarioListContainer.innerHTML = '';
}

function filterScenarios(status: 'all' | 'todo' | 'in progress' | 'done') {
    clearScenarioList();
    let scenarios = apiScenarios.getScenariosByProjectId(apiScenarios.getCurrentProjectId());

    if (status !== 'all') {
        scenarios = scenarios.filter(scenario => scenario.status === status);
    }

    scenarios.forEach(scenario => addScenarioToList(scenario));
    setCurrentScenarioColor(apiScenarios.getCurrentScenarioId());
}
