import { Configuration } from '../../../../conf';
import { DownloadEffectMap } from './DownloadEffectMap';
import { Task } from '../../../tasks/Task';
import { xml2json } from 'xml-js';
import fs from 'fs';
import path from 'path';

export class ConvertEffectMap extends Task {
    async execute(): Promise<void> {
        await (new DownloadEffectMap(true)).execute();

        try {
            const data = fs.readFileSync(path.resolve(Configuration.tmpFolder, 'gamedata', 'effectmap.xml'), { encoding: 'utf8' });

            const effectMapJson = xml2json(data.toString(), { compact:false });
            console.log(effectMapJson);

            // fs.mkdirSync(path.resolve(Configuration.distFolder, 'gamedata'), { recursive: true });
            // fs.writeFileSync(path.resolve(Configuration.distFolder, 'gamedata', 'external_texts.json'), JSON.stringify(this.texts), { encoding: 'utf8', flag: 'w+' });

            this.success();
        } catch (e) {
            this.error(`Can't convert external texts. Error: ${e}`);
        }
    }
}