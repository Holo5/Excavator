import { inject, singleton } from 'tsyringe';
import { FigureDataExtractor } from '../../Extractor/FigureDataExtractor';
import { FigureMapExtractor } from '../../Extractor/FigureMapExtractor';
import { ColorPalettes, IFigureData, SetTypes } from '../../Domain/Model/Interface/IFigureData';
import { SetType } from '../../Domain/FigureData/SetType';
import { FSRepository } from '../../Infra/FSRepository';
import { Logger } from '../Logger/Logger';
import { ColorPalette } from '../../Domain/FigureData/ColorPalette';
import { Color } from '../../Domain/FigureData/Color';
import { Draworder } from '../../HabboLogic/Avatar/Constants/Draworder';
import {Configuration} from '../../../Config';

const LOCAL_FIGURE_DATA_NAME = "figuredata.json"

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
            colorPalettes: this.assembleColorPalette(),
            setTypes: this.assembleSetTypes(),
            draworder: Draworder,
        };

        this._fsRepository.writeInBuildFolder(LOCAL_FIGURE_DATA_NAME, Configuration.folder.figures, JSON.stringify(figureData));

        Logger.info('Figuredata writed !');
    }

    private assembleColorPalette() {
        const currentColorPalettes: ColorPalettes = {};

        this._figureDataExtractor.colorPalettes.forEach((colorPalette: ColorPalette) => {
            currentColorPalettes[colorPalette.id] = {};

            colorPalette.colors.forEach((color: Color) => {
                currentColorPalettes[colorPalette.id][color.id] = {
                    club: color.club,
                    index: color.index,
                    color: color.color,
                    selectable: color.selectable,
                };
            });
        });

        return currentColorPalettes;
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
                    let assetName = this.findAssetName(part.id, part.type);
                    if (part.type === 'hrb' && assetName === undefined) {
                        assetName = this.findAssetName(part.id, 'hr');
                    }
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
