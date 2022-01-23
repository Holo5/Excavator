import { DownloadExternalTexts } from './DownloadExternalTexts';
import { Task } from '../../../tasks/Task';

export class ConvertExternalTexts extends Task {

    async execute(): Promise<void> {
        await (new DownloadExternalTexts(true)).execute();

        this.success();
    }
}