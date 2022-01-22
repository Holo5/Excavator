import * as Path from 'path';
import * as nsg from 'node-sprite-generator';
import { Configuration } from '../../../config';
import { FSRepository } from '../../infra/FSRepository';
import { Logger } from '../logger/Logger';
import { container, inject, singleton } from 'tsyringe';
import { xml2js } from 'xml-js';

@singleton()
export class SpritesheetBuilder {
    constructor(
        @inject(FSRepository) private _fsRepository: FSRepository,
    ) {}

    async build(id: string, folder: string) {
        return new Promise<void>((resolve) => {
            const partsPath = Path.resolve(container.resolve(FSRepository).extractedPath, id, 'images', '*.png');
            const spriteDest = Path.resolve(container.resolve(FSRepository).buildPath, folder, id, id);

            nsg({
                src: [partsPath],
                layout: 'packed',
                spritePath: `${spriteDest}.png`,
                stylesheetPath: `${spriteDest}.json`,
                stylesheet: Path.resolve(__dirname, 'json.tpl'),
                compositor: 'jimp',
            }, (err) => {
                if (err) {
                    throw err;
                }
                resolve();
            });
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
        let xmlOffset: any = null;

        if (classname === 'TileCursor') {
            xmlOffset = this._fsRepository.readBinaries(classname, 'tile_cursor_assets');
        } else {
            xmlOffset = this._fsRepository.readBinaries(classname, `${classname}_assets`);
        }

        xmlOffset = xml2js(xmlOffset, { compact: true });

        if (spritesheet?.meta?.image) {
            spritesheet.meta.image = `${classname}.png`;
        }

        xmlOffset.assets.asset.forEach((asset) => {
            const assetName: string = asset._attributes.name;

            try {
                const { spriteSourceSize } = spritesheet.frames[`${classname}_${asset._attributes.name}`];
                spriteSourceSize.x = asset._attributes.flipH === undefined ? -parseInt(asset._attributes.x) : -(parseInt(spriteSourceSize.w) - parseInt(asset._attributes.x));
                spriteSourceSize.y = -parseInt(asset._attributes.y);
            } catch (e) {
                Logger.error(`Error finding frame ${assetName}`);
            }
        });

        this._fsRepository.writeSpriteSheet(classname, Configuration.folder.furnis, JSON.stringify(spritesheet));
    }
}
