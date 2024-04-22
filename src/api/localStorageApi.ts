import { Project } from "../models/project";
import { Task } from "../models/task";

export class LocalStorageApi {
    private storageKey: string;

    constructor(storageKey: string) {
        this.storageKey = storageKey;
    }

    // Generic methods for handling data
    private getData<T>(): T[] {
        const dataJson = localStorage.getItem(this.storageKey);
        return dataJson ? JSON.parse(dataJson) : [];
    }

    private saveData<T>(data: T[]): void {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    // Projects
    getProjects(): Project[] {
        return this.getData<Project>();
    }

    saveProjects(projects: Project[]): void {
        this.saveData<Project>(projects);
    }

    createProject(project: Project): void {
        const projects = this.getProjects();
        projects.push(project);
        this.saveProjects(projects);
    }

    getProject(id: number): Project | undefined {
        const projects = this.getProjects();
        return projects.find(project => project.id === id);
    }

    updateProject(updatedProject: Project): void {
        const projects = this.getProjects();
        const index = projects.findIndex(project => project.id === updatedProject.id);
        if (index !== -1) {
            projects[index] = updatedProject;
            this.saveProjects(projects);
        }
    }

    deleteProject(id: number): void {
        const projects = this.getProjects();
        const filteredProjects = projects.filter(project => project.id !== id);
        this.saveProjects(filteredProjects);
    }

    getCurrentProjectId(): number {
        const projectId: string | null = localStorage.getItem('currentProjectId');
        console.log(`Current Project Id: ${projectId}`)
        return projectId ? parseInt(projectId) : 0;
    }

    setCurrentProjectId(id: number): void {
        localStorage.setItem('currentProjectId', id.toString());
        console.log(`Current Project Id: ${id}`)
    }

    // Tasks
    getTasks(): Task[] {
        return this.getData<Task>();
    }

    saveTasks(tasks: Task[]): void {
        this.saveData<Task>(tasks);
    }

    createTask(task: Task): void {
        const tasks = this.getTasks();
        tasks.push(task);
        this.saveTasks(tasks);
    }

    getTask(id: number): Task | undefined {
        const tasks = this.getTasks();
        return tasks.find(task => task.id === id);
    }

    updateTask(updatedTask: Task): void {
        const tasks = this.getTasks();
        const index = tasks.findIndex(task => task.id === updatedTask.id);
        if (index !== -1) {
            tasks[index] = updatedTask;
            this.saveTasks(tasks);
        }
    }

    deleteTask(id: number): void {
        const tasks = this.getTasks();
        const filteredTasks = tasks.filter(task => task.id !== id);
        this.saveTasks(filteredTasks);
    }

    getTasksByProjectId(projectId: number): Task[] {
        return this.getTasks().filter(task => task.projectId === projectId);
    }

    getCurrentTaskId(): number {
        const taskId: string | null = localStorage.getItem('currentTaskId');
        console.log(`Current Task Id: ${taskId}`)
        return taskId ? parseInt(taskId) : 0;
    }

    setCurrentTaskId(id: number): void {
        localStorage.setItem('currentTaskId', id.toString());
        console.log(`Current Task Id: ${id}`)
    }
}
