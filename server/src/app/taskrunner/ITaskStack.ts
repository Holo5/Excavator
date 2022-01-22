import { Task } from '../../domain/tasks/Task';

export interface ITaskStack {
    task: Task,
    running: boolean
}
