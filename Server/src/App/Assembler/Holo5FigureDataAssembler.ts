import { inject, singleton } from 'tsyringe';
import { FigureDataExtractor } from '../../Extractor/FigureDataExtractor';
import { FigureMapExtractor } from '../../Extractor/FigureMapExtractor';
import { IFigureData, SetTypes } from '../../Domain/Model/Interface/IFigureData';
import { SetType } from '../../Domain/FigureData/SetType';
import { FSRepository } from '../../Infra/FSRepository';
import { Logger } from '../Logger/Logger';

@singleton()
export class Holo5FigureDataAssembler {
    constructor(
        @inject(FSRepository) private _fsRepository: FSRepository,
        @inject(FigureDataExtractor) private _figureDataExtractor: FigureDataExtractor,
        @inject(FigureMapExtractor) private _figureMapExtractor: FigureMapExtractor,
    ) {}

    assemble() {
        Logger.info('Assembling figuredata...');

        const figureData: IFigureData = {
            setTypes: this.assembleSetTypes(),
        };

        this._fsRepository.writeInTmpFolder('figuredata.json', JSON.stringify(figureData));

        Logger.info('Figuredata writed !');
    }

    private assembleSetTypes() {
        const currentSetTypes: SetTypes = {};

        this._figureDataExtractor.setTypes.forEach((setType: SetType) => {
            currentSetTypes[setType.type] = {
                paletteid: setType.paletteid,
                mand_f_0: setType.mand_f_0,
                mand_m_0: setType.mand_m_0,
                mand_f_1: setType.mand_f_1,
                mand_m_1: setType.mand_m_1,
                sets: {},
            };

            setType.sets.forEach((set) => {
                currentSetTypes[setType.type].sets[set.id] = {
                    club: set.club,
                    colorable: set.colorable,
                    gender: set.gender,
                    preselectable: set.preselectable,
                    selectable: set.selectable,
                    sellable: set.sellable,
                    parts: [],
                    hiddenparts: [],
                };

                set.hiddenParts.forEach((hiddenPart) => {
                    currentSetTypes[setType.type].sets[set.id].hiddenparts.push({
                        partType: hiddenPart.partType,
                    });
                });

                set.parts.forEach((part) => {
                    const assetName = this.findAssetName(part.id, part.type);
                    if (assetName !== undefined) {
                        currentSetTypes[setType.type].sets[set.id].parts.push({
                            type: part.type,
                            colorable: part.colorable,
                            colorindex: part.colorIndex,
                            id: part.id,
                            index: part.index,
                            assetname: assetName.id,
                        });
                    }
                });
            });
        });

        return currentSetTypes;
    }

    private findAssetName(id: string, type: string) {
        return this._figureMapExtractor.libs.find((lib) => lib.parts.find((part) => part.type === type && part.id === id));
    }
}
