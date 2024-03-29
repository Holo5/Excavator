import * as download from 'download';
import { Color } from '../domain/figuredata/Color';
import { ColorPalette } from '../domain/figuredata/ColorPalette';
import { FSRepository } from '../infra/FSRepository';
import { HabboDataExtractor } from './HabboDataExtractor';
import { HabboDataType } from './enums/HabboDataType';
import { HiddenPart } from '../domain/figuredata/HiddenPart';
import { Logger } from '../app/logger/Logger';
import { Part } from '../domain/figuredata/Part';
import { Set } from '../domain/figuredata/Set';
import { SetType } from '../domain/figuredata/SetType';
import { SocketServer } from '../network/server/SocketServer';
import { container, inject, singleton } from 'tsyringe';
import { xml2json } from 'xml-js';

const FIGURE_DATA_NAME = 'figuredata.xml';

@singleton()
export class FigureDataExtractor {
    private readonly _socketServer: SocketServer;
    private _figureDataJson: any;
    private _colorPalettes: ColorPalette[];
    private _setTypes: SetType[];

    constructor(
        @inject(HabboDataExtractor) private readonly _habboDataExtractor: HabboDataExtractor,
        @inject(FSRepository) private readonly _fsRepository: FSRepository,
    ) {
        this._colorPalettes = [];
        this._setTypes = [];
        this._socketServer = container.resolve(SocketServer);
    }

    async retrieve() {
        Logger.info('Retrieving figuremap...');

        await this.download();

        this.convertToJson();

        this.parsePalette();
        this.parseSetTypes();

        Logger.info('All data from figuredata retrieved !');
    }

    private async download() {
        Logger.debug(`Downloading ${this._habboDataExtractor.getHabboData(HabboDataType.FIGUREDATA_URL)}`);
        const figureData = await download(
            this._habboDataExtractor.getHabboData(HabboDataType.FIGUREDATA_URL),
        );
        this._fsRepository.writeInTmpFolder(FIGURE_DATA_NAME, figureData);
    }

    private convertToJson() {
        const xml = this._fsRepository.readInTmpFolder(FIGURE_DATA_NAME);
        this._figureDataJson = JSON.parse(xml2json(xml, { compact: false }));
    }

    private parsePalette() {
        let colors: Array<any> = this._figureDataJson.elements[0].elements[0].elements;

        colors = colors.reduce((previousValue, currentValue) => {
            let colorsArray: Array<any> = currentValue.elements;
            colorsArray = colorsArray.reduce((previousValue1, currentValue1) => {
                previousValue1.push(new Color(currentValue1.attributes.id,
                    currentValue1.attributes.index,
                    currentValue1.attributes.club,
                    currentValue1.attributes.selectable,
                    currentValue1.elements[0].text));

                return previousValue1;
            }, []);

            previousValue.push(new ColorPalette(currentValue.attributes.id, colorsArray));
            return previousValue;
        }, []);

        this._colorPalettes = colors;
    }

    private parseSetTypes() {
        let setTypes: Array<any> = this._figureDataJson.elements[0].elements[1].elements;
        setTypes = setTypes.reduce((previousValue, currentValue) => {
            const sets = Array.from(currentValue.elements).reduce((previousValue1: any, currentValue1: any) => {
                const hiddenParts: HiddenPart[] = [];
                const parts: Part[] = [];

                Array.from(currentValue1.elements).forEach((elm: any) => {
                    if (elm.name === 'part') {
                        parts.push(new Part(
                            elm.attributes.id,
                            elm.attributes.type,
                            elm.attributes.colorable,
                            elm.attributes.index,
                            elm.attributes.colorindex,
                        ));
                    } else if (elm.name === 'hiddenlayers') {
                        Array.from(elm.elements).forEach((elmHidden: any) => {
                            hiddenParts.push(new HiddenPart(
                                elmHidden.attributes.parttype,
                            ));
                        });
                    }
                });

                previousValue1.push(new Set(
                    currentValue1.attributes.id,
                    currentValue1.attributes.gender,
                    currentValue1.attributes.club,
                    currentValue1.attributes.colorable,
                    currentValue1.attributes.selectable,
                    currentValue1.attributes.preselectable,
                    currentValue1.attributes.sellable,
                    parts,
                    hiddenParts,
                ));
                return previousValue1;
            }, []) as Set[];

            previousValue.push(new SetType(
                currentValue.attributes.type,
                currentValue.attributes.paletteid,
                currentValue.attributes.mand_m_0,
                currentValue.attributes.mand_f_0,
                currentValue.attributes.mand_m_1,
                currentValue.attributes.mand_f_1,
                sets,
            ));
            return previousValue;
        }, []);

        this._setTypes = setTypes;
    }

    public get colorPalettes(): ColorPalette[] {
        return this._colorPalettes;
    }

    public get setTypes(): SetType[] {
        return this._setTypes;
    }
}
