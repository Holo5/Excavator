import { Configuration } from '../../../../conf';
import { Downloader } from '../../../utilities/Downloader';
import { Task } from '../../../tasks/Task';
import path from 'path';

export class DownloadExternalTexts extends Task {
    async execute(): Promise<void> {
        await Downloader.getFile(Configuration.externalTextsUrl, path.resolve(Configuration.tmpFolder, 'gamedata'), 'external_flash_texts.txt');

        this.success();
    }
}