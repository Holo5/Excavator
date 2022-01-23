import { Configuration } from '../conf';
import { HabboDataExtractor } from './utilities/HabboDataExtractor';
import { Task } from './tasks/Task';

export class Excavator extends Task {
    private readonly taskToExecute: typeof Task[];

    public constructor() {
        super();

        this.taskToExecute = [
            HabboDataExtractor,
            ...Configuration.commands,
        ];
    }

    async execute(): Promise<void> {
        for (const task of this.taskToExecute) {
            await (new task()).execute();
        }

        this.success();
    }
}