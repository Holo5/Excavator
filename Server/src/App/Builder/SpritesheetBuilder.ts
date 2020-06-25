import {container, inject, singleton} from 'tsyringe';
import {FSRepository} from '../../Infra/FSRepository';
import * as Path from 'path';
import * as SpriteSheet from 'spritesheet-js';

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
}