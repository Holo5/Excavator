import { Configuration } from '../../../../../conf';
import { Constructor } from '../../../../tasks/types/Constructor';
import { DownloadFigureMap } from './DownloadFigureMap';
import { IFigureLib } from './interfaces/IFigureMap';
import { Task } from '../../../../tasks/Task';
import { xml2json } from 'xml-js';
import fs from 'fs';
import path from 'path';

export class ConvertFigureMap extends Task {

    dependencies(): Constructor<Task>[] {
        return [
            DownloadFigureMap,
        ];
    }

    async execute(): Promise<void> {
        const data = fs.readFileSync(path.resolve(Configuration.tmpFolder, 'gamedata', 'figuremap.xml'), { encoding: 'utf8' });
        const figureMapJson = xml2json(data.toString(), { compact:false });
        const figureMap = JSON.parse(figureMapJson);

        const figureLibs: IFigureLib[] = figureMap.elements[0].elements.map((elm: any) => {
            return {
                id: elm.attributes.id,
                revision: elm.attributes.revision,
                parts: elm.elements.map((subElm: any) => {
                    return {
                        id: subElm.attributes.id,
                        type: subElm.attributes.type,
                    };
                }),
            };
        });

        fs.mkdirSync(path.resolve(Configuration.distFolder, 'gamedata'), { recursive: true });
        fs.writeFileSync(path.resolve(Configuration.distFolder, 'gamedata', 'figuremap.json'), JSON.stringify(figureLibs), { encoding: 'utf8', flag: 'w+' });

        this.success();
    }
}