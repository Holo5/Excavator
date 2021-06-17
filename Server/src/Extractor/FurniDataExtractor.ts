import * as download from 'download';
import { inject, singleton } from 'tsyringe';
import { magenta } from 'colors';
import { xml2js } from 'xml-js';
import { HabboDataType } from './Enum/HabboDataType';
import { HabboDataExtractor } from './HabboDataExtractor';
import { FSRepository } from '../Infra/FSRepository';
import { Logger } from '../App/Logger/Logger';
import { FloorItem } from '../Domain/FurniData/FloorItem';
import { WallItem } from '../Domain/FurniData/WallItem';

const LOCAL_FURNIDATA_NAME = 'furnidata.xml';

@singleton()
export class FurniDataExtractor {
    private _furniDataJson: any;
    private _furniDataArray: any[];
    private _floorItems: FloorItem[];
    private _wallItems: WallItem[];

    constructor(
        @inject(HabboDataExtractor) private readonly _habboDataExtractor: HabboDataExtractor,
        @inject(FSRepository) private readonly _fsRepository: FSRepository,
    ) {
        this._furniDataArray = [];
        this._floorItems = [];
        this._wallItems = [];
    }

    private async download() {
        const figureMap = await download(
            this._habboDataExtractor.getHabboData(HabboDataType.FURNIDATA_URL),
        );
        this._fsRepository.writeInTmpFolder(LOCAL_FURNIDATA_NAME, figureMap);
    }

    private convertToJsonAndParse() {
        const data = this._fsRepository.readInTmpFolder(LOCAL_FURNIDATA_NAME);
        const isXML = (data as Buffer).toString().substr(0, 30).includes('<?xml');
        if (isXML) {
            this._furniDataJson = xml2js(data, { compact: false });
            this.parseXML();
        } else {
            const furniDataTxt = data.toString();
            furniDataTxt.split('\n').forEach((line) => {
                let finalLine = line.trim();

                if (finalLine[finalLine.length - 1] === ',') {
                    finalLine = finalLine.substr(0, finalLine.length - 1);
                }
                finalLine = finalLine.replace('\\', '').replace('\\', '').replace('\\', '');

                try {
                    // eslint-disable-next-line no-eval
                    const furni = eval(finalLine);
                    if (typeof furni === 'object') {
                        this._furniDataArray.push(furni);
                    }
                } catch (e) {
                    Logger.error(`Furnidata line non well formed: ${finalLine}`);
                }
            });
            this.parseTXT();
        }
    }

    private parseTXT() {
        this._furniDataArray.forEach((furniData) => {
            if (furniData === undefined) {
                Logger.error(`Undefined furni type: ${furniData}`);
            } else if (furniData[0] === 's') {
                const floorItem = new FloorItem(
                    furniData[1],
                    (furniData[2] as string).split('*')[0],
                    furniData[3],
                    undefined,
                    furniData[4],
                    furniData[5],
                    furniData[6],
                    (furniData[7] as string).split(','),
                    furniData[8],
                    furniData[9],
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                );
                this._floorItems.push(floorItem);
            } else if (furniData[0] === 'i') {
                const wallItem = new WallItem(
                    furniData[1],
                    (furniData[2] as string).split('*')[0],
                    furniData[3],
                    furniData[8],
                    furniData[9],
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                );
                this._wallItems.push(wallItem);
            } else if (furniData[0] === 'e') {
                console.log(furniData);
            }
        });
    }

    private parseXML() {
        const libs: Array<any> = this._furniDataJson.elements[0].elements;
        let roomItems = libs[0].elements as Array<any>;
        let wallItems = libs[1].elements as Array<any>;

        roomItems = roomItems.reduce((previousValue, currentValue) => {
            const floorItem = new FloorItem(
                parseInt(currentValue.attributes.id),
                currentValue.attributes.classname,
                parseInt(this.getSubData(currentValue.elements, 'revision')),
                this.getSubData(currentValue.elements, 'category'),
                parseInt(this.getSubData(currentValue.elements, 'defaultdir')),
                parseInt(this.getSubData(currentValue.elements, 'xdim')),
                parseInt(this.getSubData(currentValue.elements, 'ydim')),
                this.getPartsColor(currentValue.elements),
                this.getSubData(currentValue.elements, 'name'),
                this.getSubData(currentValue.elements, 'description'),
                this.getSubData(currentValue.elements, 'adurl'),
                parseInt(this.getSubData(currentValue.elements, 'offerid')),
                parseInt(this.getSubData(currentValue.elements, 'buyout')),
                parseInt(this.getSubData(currentValue.elements, 'rentofferid')),
                parseInt(this.getSubData(currentValue.elements, 'rentbuyout')),
                parseInt(this.getSubData(currentValue.elements, 'bc')),
                this.getSubData(currentValue.elements, 'excludeddynamic') == 1,
                this.getSubData(currentValue.elements, 'customparams'),
                this.getSubData(currentValue.elements, 'specialtype'),
                this.getSubData(currentValue.elements, 'canstandon') == 1,
                this.getSubData(currentValue.elements, 'cansiton') == 1,
                this.getSubData(currentValue.elements, 'canlayon') == 1,
                this.getSubData(currentValue.elements, 'furniline'),
                this.getSubData(currentValue.elements, 'environment'),
                this.getSubData(currentValue.elements, 'rare') == 1,
            );

            previousValue.push(floorItem);
            return previousValue;
        }, []);
        this._floorItems = roomItems;

        wallItems = wallItems.reduce((previousValue, currentValue) => {
            const wallItem = new WallItem(
                parseInt(currentValue.attributes.id),
                currentValue.attributes.classname,
                parseInt(this.getSubData(currentValue.elements, 'revision')),
                this.getSubData(currentValue.elements, 'name'),
                this.getSubData(currentValue.elements, 'description'),
                this.getSubData(currentValue.elements, 'adurl'),
                parseInt(this.getSubData(currentValue.elements, 'offerid')),
                parseInt(this.getSubData(currentValue.elements, 'buyout')),
                parseInt(this.getSubData(currentValue.elements, 'rentofferid')),
                parseInt(this.getSubData(currentValue.elements, 'rentbuyout')),
                parseInt(this.getSubData(currentValue.elements, 'bc')),
                this.getSubData(currentValue.elements, 'excludeddynamic') == 1,
                this.getSubData(currentValue.elements, 'specialtype'),
                this.getSubData(currentValue.elements, 'furniline'),
                this.getSubData(currentValue.elements, 'environment'),
                this.getSubData(currentValue.elements, 'rare') == 1,
            );

            previousValue.push(wallItem);
            return previousValue;
        }, []);
        this._wallItems = wallItems;
    }

    private getSubData(elements: Array<any>, name: string) {
        const elm = elements.find((elm) => elm.name == name);
        if (elm === undefined) return '';
        if (elm.elements === undefined) return '';

        return elm.elements[0].text;
    }

    private getPartsColor(elements: Array<any>): string[] {
        const colors: string[] = [];

        const elm = elements.find((elm) => elm.name == 'partcolors');

        if (elm === undefined) return [];
        if (elm.elements === undefined) return [];

        elm.elements.forEach((elm1) => {
            if (elm1.elements !== undefined && elm1.elements.length > 0) {
                colors.push(elm1.elements[0].text);
            }
        });

        return colors;
    }

    async retrieve() {
        Logger.info('Retrieving furnidata...');

        try {
            await this.download();
        } catch (e) {
            Logger.error('Furnidata can\'t be downloaded...');
            Logger.debug(`Link ${this._habboDataExtractor.getHabboData(HabboDataType.FURNIDATA_URL)}`);
        }

        this.convertToJsonAndParse();

        Logger.info(`Found ${magenta(this._floorItems.length.toString())} floor items`);
        Logger.info(`Found ${magenta(this._wallItems.length.toString())} wall items`);
    }

    public get floorItems(): FloorItem[] {
        return this._floorItems;
    }

    public get wallItems(): WallItem[] {
        return this._wallItems;
    }
}
