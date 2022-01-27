import { Configuration } from '../../../../conf';
import { Downloader } from '../../../utilities/Downloader';
import { HabboDataExtractor, HabboDataType } from '../../../utilities/HabboDataExtractor';
import { Task } from '../../../tasks/Task';
import path from 'path';

export class DownloadEffectMap extends Task {
    async execute(): Promise<void> {
        await Downloader.getFile(
            HabboDataExtractor.getHabboData(HabboDataType.FLASH_CLIENT_URL) + 'effectmap.xml',
            path.resolve(Configuration.tmpFolder, 'gamedata'),
            'effectmap.xml',
        );

        this.success();
    }
}