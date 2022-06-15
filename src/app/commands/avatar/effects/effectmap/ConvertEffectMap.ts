import { Configuration } from '../../../../../conf';
import { Constructor } from '../../../../tasks/types/Constructor';
import { DownloadEffectMap } from './DownloadEffectMap';
import { IEffect } from './interfaces/IEffect';
import { Task } from '../../../../tasks/Task';
import { xml2json } from 'xml-js';
import fs from 'fs';
import path from 'path';

export class ConvertEffectMap extends Task {

    dependencies(): Constructor<Task>[] {
        return [
            DownloadEffectMap,
        ];
    }

    async execute(): Promise<void> {
        try {
            const data = fs.readFileSync(path.resolve(Configuration.tmpFolder, 'gamedata', 'effectmap.xml'), { encoding: 'utf8' });
            const effectMapJson = xml2json(data.toString(), { compact:false });
            const effectMap = JSON.parse(effectMapJson);

            const effects: IEffect[] = [];

            for (const effect of effectMap.elements[0].elements) {
                effects.push({ id: effect.attributes.id, lib: effect.attributes.lib, type: effect.attributes.type });
            }

            fs.mkdirSync(path.resolve(Configuration.distFolder, 'gamedata'), { recursive: true });
            fs.writeFileSync(path.resolve(Configuration.distFolder, 'gamedata', 'effectmap.json'), JSON.stringify(effects), { encoding: 'utf8', flag: 'w+' });

            this.success();
        } catch (e) {
            this.error(`Can't convert effect map. Error: ${e}`);
        }
    }
}