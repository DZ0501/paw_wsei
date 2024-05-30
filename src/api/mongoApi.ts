import { User } from '../models/user';
import { Project } from '../models/project';
import { Scenario } from '../models/scenario';
import { Task } from '../models/task';

export class MongoApi {
    constructor(private baseUrl: string = 'http://localhost:2137') { }

    // Generic

    private async fetchData<T>(endpoint: string): Promise<T> {
        const response = await fetch(`${this.baseUrl}/${endpoint}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${endpoint}`);
        }
        return response.json();
    }

    private async postData<T>(endpoint: string, data: T): Promise<void> {
        const response = await fetch(`${this.baseUrl}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`Failed to post to ${endpoint}`);
        }
    }

    private async putData<T>(endpoint: string, data: T): Promise<void> {
        const response = await fetch(`${this.baseUrl}/${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`Failed to put to ${endpoint}`);
        }
    }

    private async deleteData(endpoint: string): Promise<void> {
        const response = await fetch(`${this.baseUrl}/${endpoint}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Failed to delete from ${endpoint}`);
        }
    }

    // Users

    async getUsers(): Promise<User[]> {
        return this.fetchData<User[]>('users');
    }

    // Projects

    async getProjects(): Promise<Project[]> {
        return this.fetchData<Project[]>('projects');
    }

    async createProject(project: Project): Promise<void> {
        await this.postData<Project>('projects', project);
    }

    async updateProject(project: Project): Promise<void> {
        await this.putData<Project>(`projects/${project.id}`, project);
    }

    async deleteProject(id: number): Promise<void> {
        await this.deleteData(`projects/${id}`);
    }

    // Scenarios

    async getScenarios(): Promise<Scenario[]> {
        return this.fetchData<Scenario[]>('scenarios');
    }

    async getSingleScenario(id: number): Promise<Scenario | null> {
        return this.fetchData<Scenario>(`scenarios/${id}`);
    }

    async getScenariosByProjectId(projectId: number): Promise<Scenario[]> {
        return this.fetchData<Scenario[]>(`projects/${projectId}/scenarios`);
    }

    async createScenario(scenario: Scenario): Promise<void> {
        await this.postData<Scenario>('scenarios', scenario);
    }

    async updateScenario(scenario: Scenario): Promise<void> {
        await this.putData<Scenario>(`scenarios/${scenario.id}`, scenario);
    }

    async deleteScenario(id: number): Promise<void> {
        await this.deleteData(`scenarios/${id}`);
    }

    async deleteScenariosByProjectId(projectId: number): Promise<void> {
        const response = await fetch(`${this.baseUrl}/projects/${projectId}/scenarios`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            // Check if the error is due to no scenarios being found
            if (response.status === 404) {
                console.log('No scenarios found for this project.');
                return;
            }
            throw new Error('Failed to delete scenarios');
        }
    }

    // Tasks

    async getTasks(): Promise<Task[]> {
        return this.fetchData<Task[]>('tasks');
    }

    async getTasksByScenarioId(scenarioId: number): Promise<Task[]> {
        return this.fetchData<Task[]>(`scenarios/${scenarioId}/tasks`);
    }

    async getSingleTask(id: number): Promise<Task | null> {
        return this.fetchData<Task>(`tasks/${id}`);
    }

    async createTask(task: Task): Promise<void> {
        await this.postData<Task>('tasks', task);
    }

    async updateTask(task: Task): Promise<void> {
        await this.putData<Task>(`tasks/${task.id}`, task);
    }

    async deleteTask(id: number): Promise<void> {
        await this.deleteData(`tasks/${id}`);
    }

    async deleteTasksByScenarioId(scenarioId: number): Promise<void> {
        await this.deleteData(`tasks/scenario/${scenarioId}`);
    }

    // Current ID management

    async getCurrentProjectId(): Promise<number> {
        const response = await this.fetchData<{ currentProjectId: number }>('currentProjectId');
        return response.currentProjectId;
    }

    async setCurrentProjectId(id: number): Promise<void> {
        await this.postData<{ id: number }>('currentProjectId', { id });
    }

    async getCurrentScenarioId(): Promise<number> {
        const response = await this.fetchData<{ currentScenarioId: number }>('currentScenarioId');
        return response.currentScenarioId;
    }

    async setCurrentScenarioId(id: number): Promise<void> {
        await this.postData<{ id: number }>('currentScenarioId', { id });
    }

    async getCurrentTaskId(): Promise<number> {
        const response = await this.fetchData<{ currentTaskId: number }>('currentTaskId');
        return response.currentTaskId;
    }

    async setCurrentTaskId(id: number): Promise<void> {
        await this.postData<{ id: number }>('currentTaskId', { id });
    }
}
