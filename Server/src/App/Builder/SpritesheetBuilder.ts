import { container, inject, singleton } from 'tsyringe';
import * as Path from 'path';
import { xml2js } from 'xml-js';
import * as nsg from 'node-sprite-generator';
import { FSRepository } from '../../Infra/FSRepository';
import {Configuration} from '../../../Config';

@singleton()
export class SpritesheetBuilder {
    constructor(
        @inject(FSRepository) private _fsRepository: FSRepository,
    ) {}

    async build(id: string, folder: string) {
        await new Promise((resolve) => {
            const partsPath = Path.resolve(container.resolve(FSRepository).extractedPath, id, 'images', '*.png');
            const spriteDest = Path.resolve(container.resolve(FSRepository).buildPath, folder, id, id);

            nsg({
                src: [partsPath],
                layout: 'packed',
                spritePath: `${spriteDest}.png`,
                stylesheetPath: `${spriteDest}.json`,
                stylesheet: Path.resolve(__dirname, 'json.tpl'),
                compositor: 'jimp',
            }, resolve);
        });
    }

    async retrieveFigureOffset(id: string) {
        const spritesheet: any = JSON.parse(this._fsRepository.readSpritesheet(id, Configuration.folder.figures));
        let xmlOffset = this._fsRepository.readBinaries(id, 'manifest');
        xmlOffset = xml2js(xmlOffset, { compact: false });

        if (spritesheet === false && xmlOffset === false) {
            return;
        }

        if (spritesheet?.meta?.image) {
            spritesheet.meta.image = `${id}.png`;
        }

        Array.from(xmlOffset?.elements[0]?.elements[0]?.elements[0]?.elements).some((elm: any) => {
            const offset = elm?.elements[0]?.attributes?.value?.split(',');
            const name = elm?.attributes?.name;

            if (spritesheet?.frames[`${id}_${name}`]?.trimmed !== undefined) {
                spritesheet.frames[`${id}_${name}`].trimmed = true;
            }
            const spriteSourceSize: { x: number, y: number, w: number, h: number } = spritesheet?.frames[`${id}_${name}`]?.spriteSourceSize;
            if (spriteSourceSize !== undefined) {
                spriteSourceSize.x = parseInt(offset[0]) * -1;
                spriteSourceSize.y = parseInt(offset[1]) * -1;
            }
            return null;
        });

        this._fsRepository.writeSpriteSheet(id, Configuration.folder.figures, JSON.stringify(spritesheet));
    }

    async retrieveFurniOffset(classname: string) {
        const spritesheet: any = JSON.parse(this._fsRepository.readSpritesheet(classname, Configuration.folder.furnis));
        let xmlOffset: any = this._fsRepository.readBinaries(classname, classname + '_assets');
        xmlOffset = xml2js(xmlOffset, { compact: true });

        xmlOffset.assets.asset.forEach(asset => {
            if(spritesheet.frames[`${classname}_${asset._attributes.name}`] === undefined && asset._attributes.source !== undefined) {
                console.log(asset._attributes.name);
            }
        });

        //console.log(xmlOffset);

        /*
        if (spritesheet === false && xmlOffset === false) {
            return;
        }

        if (spritesheet?.meta?.image) {
            spritesheet.meta.image = `${id}.png`;
        }

        Array.from(xmlOffset?.elements[0]?.elements[0]?.elements[0]?.elements).some((elm: any) => {
            const offset = elm?.elements[0]?.attributes?.value?.split(',');
            const name = elm?.attributes?.name;

            if (spritesheet?.frames[`${id}_${name}`]?.trimmed !== undefined) {
                spritesheet.frames[`${id}_${name}`].trimmed = true;
            }
            const spriteSourceSize: { x: number, y: number, w: number, h: number } = spritesheet?.frames[`${id}_${name}`]?.spriteSourceSize;
            if (spriteSourceSize !== undefined) {
                spriteSourceSize.x = parseInt(offset[0]) * -1;
                spriteSourceSize.y = parseInt(offset[1]) * -1;
            }
            return null;
        });

        this._fsRepository.writeSpriteSheet(id, Configuration.folder.figures, JSON.stringify(spritesheet));

         */
    }
}
