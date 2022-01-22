import { Configuration } from '../../../config';
import { FSRepository } from '../../infra/FSRepository';
import { FurniDataExtractor } from '../../extractor/FurniDataExtractor';
import { IFurniData } from '../../domain/model/interfaces/IFurniData';
import { Logger } from '../logger/Logger';
import { inject, singleton } from 'tsyringe';

@singleton()
export class Holo5FurniDataAssembler {
    constructor(
        @inject(FSRepository) private _fsRepository: FSRepository,
        @inject(FurniDataExtractor) private _furniDataExtractor: FurniDataExtractor,
    ) {}

    assemble() {
        Logger.info('Assembling furnidata...');

        const figureData: IFurniData = {
            floorItems: {},
            wallItems: {},
        };

        this._furniDataExtractor.floorItems.forEach((floorItem) => {
            figureData.floorItems[floorItem.id] = floorItem;
        });

        this._furniDataExtractor.wallItems.forEach((wallItem) => {
            figureData.wallItems[wallItem.id] = wallItem;
        });

        this._fsRepository.writeInBuildFolder('furnidata.json', Configuration.folder.furnis, JSON.stringify(figureData));

        Logger.info('Furnidata writed !');
    }
}
