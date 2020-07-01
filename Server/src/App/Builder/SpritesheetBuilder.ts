import { container, inject, singleton } from 'tsyringe';
import * as Path from 'path';
import { xml2js } from 'xml-js';
import * as SpriteSheet from '@pi-bouf/spritesheet-js';
import { FSRepository } from '../../Infra/FSRepository';

@singleton()
export class SpritesheetBuilder {
    constructor(
        @inject(FSRepository) private _fsRepository: FSRepository,
    ) {}

    async build(id: string) {
        await new Promise((resolve) => {
            const path = Path.resolve(container.resolve(FSRepository).extractedPath, id, 'images', '*.png');

            SpriteSheet(
                path,
                {
                    format: 'pixi.js',
                    trim: true,
                    path: Path.resolve(container.resolve(FSRepository).buildPath, id),
                    name: id,
                },
                (err) => {
                    if (err) throw err;
                    resolve();
                },
            );
        });
    }

    async retrieveOffsets(id: string) {
        const spritesheet: any = JSON.parse(this._fsRepository.readSpritesheet(id));
        let xmlOffset = this._fsRepository.readBinaries(id, 'manifest');
        xmlOffset = xml2js(xmlOffset, { compact: false });

        if (spritesheet === false && xmlOffset === false) {
            return;
        }

        Array.from(xmlOffset?.elements[0]?.elements[0]?.elements[0]?.elements).some((elm: any) => {
            const offset = elm?.elements[0]?.attributes?.value?.split(',');
            const name = elm?.attributes?.name;

            if (spritesheet?.frames[`${id}_${name}.png`]?.trimmed !== undefined) {
                spritesheet.frames[`${id}_${name}.png`].trimmed = true;
            }
            const spriteSourceSize: { x: number, y: number, w: number, h: number } = spritesheet?.frames[`${id}_${name}.png`]?.spriteSourceSize;
            if (spriteSourceSize !== undefined) {
                spriteSourceSize.x = parseInt(offset[0]);
                spriteSourceSize.y = parseInt(offset[0]);
            }
            return null;
        });

        this._fsRepository.writeSpriteSheet(id, JSON.stringify(spritesheet));
    }
}
