import { Configuration } from '../../../../../conf';
import { DownloadEffectMap } from './DownloadEffectMap';
import { Task } from '../../../../tasks/Task';
import { xml2json } from 'xml-js';
import fs from 'fs';
import path from 'path';

interface Effect {
    id: string,
    lib: string,
    type: string
}

export class ConvertEffectMap extends Task {
    async execute(): Promise<void> {
        await (new DownloadEffectMap(true)).execute();

        try {
            const data = fs.readFileSync(path.resolve(Configuration.tmpFolder, 'gamedata', 'effectmap.xml'), { encoding: 'utf8' });
            const effectMapJson = xml2json(data.toString(), { compact:false });
            const effectMap = JSON.parse(effectMapJson);

            const effects: Effect[] = [];

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