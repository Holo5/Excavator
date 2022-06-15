import { Constructor } from './tasks/types/Constructor';
import { Logger } from './logger/Logger';
import { Task } from './tasks/Task';

export class Excavator extends Task {

    async execute(): Promise<void> {
        Logger.info('Extracting Habbo\'s data...');
        // await (new HabboDataExtractor()).execute();
        //
        // for (const task of this.taskToExecute) {
        //     await (new task()).execute();
        // }

        this.buildDependyGraph();

        this.success();
    }

    private buildDependyGraph(): Constructor<Task>[] {



        return [];
    }
}