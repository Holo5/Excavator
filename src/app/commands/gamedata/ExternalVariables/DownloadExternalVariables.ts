import { Configuration } from '../../../../conf';
import { Downloader } from '../../../utilities/Downloader';
import { Task } from '../../../tasks/Task';
import path from 'path';

export class DownloadExternalVariables extends Task {
    async execute(): Promise<void> {
        await Downloader.getFile(Configuration.externalVariablesUrl, path.resolve(Configuration.tmpFolder, 'gamedata'), 'external_flash_vars.txt');

        this.success();
    }
}