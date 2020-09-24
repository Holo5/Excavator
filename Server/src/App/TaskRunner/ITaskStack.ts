import {Task} from '../../Domain/Tasks/Task';

export interface ITaskStack {
    task: Task,
    running: boolean
}
