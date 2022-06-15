import { Configuration } from '../conf';
import { Constructor } from './tasks/types/Constructor';
import { HabboDataExtractor } from './utilities/HabboDataExtractor';
import { Logger } from './logger/Logger';
import { Task } from './tasks/Task';

export class Excavator extends Task {

    async execute(): Promise<void> {
        Logger.info('Extracting Habbo\'s data...');
        await (new HabboDataExtractor()).execute();

        for (const task of this.buildDependencyGraph()) {
            await task.execute();
        }

        this.success();
    }

    private buildDependencyGraph(): Task[] {

        const tasksAndDependencies: Task[] = [];

        Configuration.tasks.forEach((task: Constructor<Task>) => {
            const dependencyList = this.retrieveDependencyList(task);

            dependencyList.forEach(dependency => {
                const existingTask = tasksAndDependencies
                    .find(tk => tk.constructor.name === dependency.constructor.name);
                if (existingTask === undefined) {
                    tasksAndDependencies.push(dependency);
                }
            });
        });

        return tasksAndDependencies;
    }

    private retrieveDependencyList(task: Constructor<Task>): Task[] {
        const taskList: Task[] = [];

        const currentTask = new task();

        currentTask.dependencies().forEach(subTask => {
            taskList.push(...this.retrieveDependencyList(subTask));
        });

        taskList.push(currentTask);

        return taskList;
    }
}