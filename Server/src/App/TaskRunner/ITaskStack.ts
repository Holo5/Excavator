import { FigureTask } from '../../Domain/Tasks/FigureTask';

export interface ITaskStack {
    task: FigureTask,
    running: boolean
}
