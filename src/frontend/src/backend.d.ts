import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Task {
    id: string;
    title: string;
    createdAt: bigint;
    skipCount: bigint;
    state: TaskState;
    subtasks: Array<Subtask>;
    difficultyMultiplier: number;
    estimatedMinutes: bigint;
}
export interface Subtask {
    id: string;
    title: string;
    completed: boolean;
}
export interface Stats {
    currentBurdenScore: bigint;
    completedCount: bigint;
    avoidedCount: bigint;
    totalFocusMinutes: bigint;
}
export enum Outcome {
    avoided = "avoided",
    completed = "completed"
}
export enum TaskState {
    active = "active",
    avoided = "avoided",
    idle = "idle",
    completed = "completed"
}
export interface backendInterface {
    carryOverTasks(): Promise<void>;
    coachQuery(message: string): Promise<string>;
    createTask(id: string, title: string, estimatedMinutes: bigint, subtasks: Array<Subtask>): Promise<void>;
    deleteTask(id: string): Promise<void>;
    endSession(id: string, outcome: Outcome, minutesSpent: bigint): Promise<void>;
    getAllTasks(): Promise<Array<Task>>;
    getStats(): Promise<Stats>;
    getTask(id: string): Promise<Task>;
    startSession(id: string, taskId: string): Promise<void>;
    updateTask(id: string, task: Task): Promise<void>;
}
