import { Configuration } from '../../../../../conf';
import { ConvertEffectMap } from '../effectmap/ConvertEffectMap';
import { Downloader } from '../../../../utilities/Downloader';
import { HabboDataExtractor, HabboDataType } from '../../../../utilities/HabboDataExtractor';
import { IEffect } from '../effectmap/interfaces/IEffect';
import { Task } from '../../../../tasks/Task';
import fs from 'fs';
import path from 'path';

export class ExtractEffects extends Task {
    async execute(): Promise<void> {
        await (new ConvertEffectMap(true)).execute();

        try {
            const data = fs.readFileSync(path.resolve(Configuration.distFolder, 'gamedata', 'effectmap.json'), { encoding: 'utf8' });

            const effects: IEffect[] = JSON.parse(data.toString());

            for (const effect of effects) {
                await Downloader.getFile(
                    HabboDataExtractor.getHabboData(HabboDataType.FLASH_CLIENT_URL) + effect.lib + '.swf',
                    path.resolve(Configuration.tmpFolder, 'effects'),
                    effect.lib + '.swf',
                );

                this.log(effect.lib + ' downloaded !');
            }

            this.success();
        } catch (e) {
            this.error(`Can't convert external texts. Error: ${e}`);
        }
    }
}