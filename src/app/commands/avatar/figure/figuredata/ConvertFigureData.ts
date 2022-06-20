import { Constructor } from '../../../../tasks/types/Constructor';
import { DownloadFigureData } from './DownloadFigureData';
import { Task } from '../../../../tasks/Task';

export class ConvertFigureData extends Task {
    
    dependencies(): Constructor<Task>[] {
        return [
            DownloadFigureData,
        ];
    }

    async execute(): Promise<void> {
        console.log('Not implemented ATM');
    }
}