import {container, inject, singleton} from 'tsyringe';
import {FSRepository} from '../../Infra/FSRepository';
import * as Path from 'path';
import * as SpriteSheet from 'spritesheet-js';
import {xml2json} from 'xml-js';

@singleton()
export class SpritesheetBuilder {
    constructor(
        @inject(FSRepository) private _fsRepository: FSRepository,
    ) {}

    async build(id: string) {
        await new Promise(resolve => {
            let path = Path.resolve(container.resolve(FSRepository).extractedPath, id, 'images', '*.png');

            SpriteSheet(
                path,
                {
                    format: 'pixi.js',
                    trim: false,
                    path: Path.resolve(container.resolve(FSRepository).buildPath, id),
                    name: id
                },
                resolve
            );
        });
    }

    async retrieveOffsets(id: string) {
        let spritesheet: any = JSON.parse(this._fsRepository.readSpritesheet(id));
        let xmlOffset = this._fsRepository.readBinaries(id, 'manifest');
        xmlOffset = JSON.parse(xml2json(xmlOffset, {compact: false}));
        if (spritesheet === false && xmlOffset === false) return;

        Array.from(xmlOffset?.elements[0]?.elements[0]?.elements[0]?.elements).some((elm: any) => {
            let offset = elm?.elements[0]?.attributes?.value?.split(',');
            let name = elm?.attributes?.name;

            let spriteSourceSize: { x: number, y: number, w: number, h: number } = spritesheet?.frames[`${id}_${name}.png`]?.spriteSourceSize;
            if (spriteSourceSize !== undefined) {
                spriteSourceSize.x = parseInt(offset[0]);
                spriteSourceSize.y = parseInt(offset[0]);
            }
        });

        this._fsRepository.writeSpriteSheet(id, JSON.stringify(spritesheet));
    }
}
