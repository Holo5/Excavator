import * as download from 'download';
import { container, inject, singleton } from 'tsyringe';
import { Element as XMLElement, xml2js } from 'xml-js';
import { HabboDataExtractor } from './HabboDataExtractor';
import { HabboDataType } from './Enum/HabboDataType';
import { FSRepository } from '../Infra/FSRepository';
import { SocketServer } from '../Network/Server/SocketServer';
import { Logger } from '../App/Logger/Logger';
import { Color } from '../Domain/FigureData/Color';
import { ColorPalette } from '../Domain/FigureData/ColorPalette';
import { SetType } from '../Domain/FigureData/SetType';
import { SetTypesTransformer } from '../App/Transformers/SetTypesTransformer';

const FIGURE_DATA_NAME = 'figuredata.xml';

@singleton()
export class FigureDataExtractor {
    private readonly _socketServer: SocketServer;
    private _figureDataJson: XMLElement;
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

        Logger.info('All data from firedata retrieved !');
    }

    private async download() {
        const figureData = await download(
            this._habboDataExtractor.getHabboData(HabboDataType.FIGUREDATA_URL),
        );
        this._fsRepository.writeInTmpFolder(FIGURE_DATA_NAME, figureData);
    }

    private convertToJson() {
        const xml = this._fsRepository.readInTmpFolder(FIGURE_DATA_NAME);

        this._figureDataJson = xml2js(xml, { compact: false }) as XMLElement;
    }

    private parsePalette() {
        let colors: Array<any> = this._figureDataJson.elements[0].elements[0].elements;

        colors = colors.reduce((previousValue, currentValue) => {
            const colorsArray: Array<any> = currentValue.elements;
            colorsArray.reduce((previousValue1, currentValue1) => {
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
        const setTypes = this._figureDataJson.elements[0].elements[1].elements;

        this._setTypes = SetTypesTransformer.transform(setTypes);
    }

    public get colorPalettes(): ColorPalette[] {
        return this._colorPalettes;
    }

    public get setTypes(): SetType[] {
        return this._setTypes;
    }
}
