import { ITask } from './ITask';
import { Logger } from '../logger/Logger';

export class Task implements ITask {
    async execute(): Promise<void> {
        this.success();
        this.log('extracting');
        this.warning('COUCOU');
        this.error('OK ?');
    }

    private success() {
        Logger.success('Completed !');
    }

    private error(error: string) {
        Logger.error(error);
    }

    private log(msg: string) {
        Logger.info(msg);
    }

    private warning(msg: string) {
        Logger.warning(msg);
    }
}