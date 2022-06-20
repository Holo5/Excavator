import { Configuration } from '../../../../../conf';
import { Downloader } from '../../../../utilities/Downloader';
import { HabboDataExtractor, HabboDataType } from '../../../../utilities/HabboDataExtractor';
import { Task } from '../../../../tasks/Task';
import path from 'path';

export class DownloadFigureMap extends Task {
    async execute(): Promise<void> {
        await Downloader.getFile(
            HabboDataExtractor.getHabboData(HabboDataType.FIGUREMAP_URL),
            path.resolve(Configuration.tmpFolder, 'gamedata'),
            'figuremap.xml',
        );

        this.success();
    }
}