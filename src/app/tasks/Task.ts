import { ITask } from './ITask';
import { Logger } from '../logger/Logger';

export class Task implements ITask {
    async execute(): Promise<void> {
        this.success();
    }

    protected success() {
        Logger.success(`${this.constructor.name} | Task completed !`);
    }

    protected error(error: string) {
        Logger.error(error);
    }

    protected log(msg: string) {
        Logger.info(msg);
    }

    protected warning(msg: string) {
        Logger.warning(msg);
    }
}