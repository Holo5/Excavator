import { Configuration } from '../../../../../conf';
import { ConvertEffectMap } from '../effectmap/ConvertEffectMap';
import { Downloader } from '../../../../utilities/Downloader';
import { HabboDataExtractor, HabboDataType } from '../../../../utilities/HabboDataExtractor';
import { HabboSwfExtractor } from '@holo5/habbo-swf-extractor';
import { IEffect } from '../effectmap/interfaces/IEffect';
import { Task } from '../../../../tasks/Task';
import { xml2json } from 'xml-js';
import fs from 'fs';
import path from 'path';

export class ExtractEffects extends Task {
    async execute(): Promise<void> {
        await (new ConvertEffectMap(true)).execute();

        try {
            const data = fs.readFileSync(path.resolve(Configuration.distFolder, 'gamedata', 'effectmap.json'), { encoding: 'utf8' });

            const effects: IEffect[] = JSON.parse(data.toString());

            for (const effect of effects) {

                if (effect.lib !== 'Dance1') return;

                await Downloader.getFile(
                    HabboDataExtractor.getHabboData(HabboDataType.FLASH_CLIENT_URL) + effect.lib + '.swf',
                    path.resolve(Configuration.tmpFolder, 'effects', '_swf'),
                    effect.lib + '.swf',
                );

                await HabboSwfExtractor.dumpAsset(
                    effect.lib,
                    path.resolve(Configuration.tmpFolder, 'effects', '_swf'),
                    path.resolve(Configuration.tmpFolder, 'effects', '_extracted'),
                );

                this.log(effect.lib + ' downloaded !');

                if (effect.lib.includes('Dance')) {
                    this.convertToJson(effect.lib);
                } else {
                    this.log(`Can't extract effect ${effect.lib}. Not implemented at the moment !`);
                }
            }

            this.success();
        } catch (e) {
            this.error(`Can't extract effects. Error: ${e}`);
        }
    }

    private convertToJson(lib: string) {
        const data = fs.readFileSync(path.resolve(Configuration.tmpFolder, 'effects', '_extracted', lib, 'animation.xml'), { encoding: 'utf8' });
        const animationJson = JSON.parse(xml2json(data.toString(), { compact:false }));

        for (const frame of animationJson.elements[0].elements) {
            for (const bodyPart of frame.elements) {
                console.log(bodyPart);
            }
        }
    }
}