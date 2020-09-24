import * as download from 'download';
import {inject, singleton} from 'tsyringe';
import {HabboDataType} from './Enum/HabboDataType';
import {HabboDataExtractor} from './HabboDataExtractor';
import {FSRepository} from '../Infra/FSRepository';
import {Logger} from '../App/Logger/Logger';
import {magenta} from 'colors';
import {xml2js} from 'xml-js';
import {FloorItem} from '../Domain/FurniData/FloorItem';
import {WallItem} from '../Domain/FurniData/WallItem';

const LOCAL_FURNIDATA_NAME = 'furnidata.xml';

@singleton()
export class FurniDataExtractor {
    private _figureDataJson: any;
    private _floorItems: FloorItem[];
    private _wallItems: WallItem[];

    constructor(
        @inject(HabboDataExtractor) private readonly _habboDataExtractor: HabboDataExtractor,
        @inject(FSRepository) private readonly _fsRepository: FSRepository,
    ) {
        this._floorItems = [];
        this._wallItems = [];
    }

    private async download() {
        const figureMap = await download(
            this._habboDataExtractor.getHabboData(HabboDataType.FURNIDATA_URL),
        );
        this._fsRepository.writeInTmpFolder(LOCAL_FURNIDATA_NAME, figureMap);
    }

    private convertToJson() {
        const xml = this._fsRepository.readInTmpFolder(LOCAL_FURNIDATA_NAME);
        this._figureDataJson = xml2js(xml, {compact: false});
    }

    private parse() {
        let libs: Array<any> = this._figureDataJson.elements[0].elements;
        let roomItems = libs[0].elements as Array<any>;
        let wallItems = libs[1].elements as Array<any>;

        roomItems = roomItems.reduce((previousValue, currentValue) => {
            let floorItem = new FloorItem(
                parseInt(currentValue.attributes.id),
                currentValue.attributes.classname,
                parseInt(this.getSubData(currentValue.elements, 'revision')),
                this.getSubData(currentValue.elements, 'category'),
                parseInt(this.getSubData(currentValue.elements, 'defaultir')),
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
                this.getSubData(currentValue.elements, 'rare') == 1
            );

            previousValue.push(floorItem);
            return previousValue;
        }, []);
        this._floorItems = roomItems;

        wallItems = wallItems.reduce((previousValue, currentValue) => {
            let wallItem = new WallItem(
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
                this.getSubData(currentValue.elements, 'rare') == 1
            );

            previousValue.push(wallItem);
            return previousValue;
        }, []);
        this._wallItems = wallItems;
    }

    private getSubData(elements: Array<any>, name: string) {
        let elm = elements.find(elm => {
            return elm.name == name;
        });
        if (elm === undefined) return '';
        if (elm.elements === undefined) return '';

        return elm.elements[0].text;
    }

    private getPartsColor(elements: Array<any>): string[] {
        let colors: string[] = [];

        let elm = elements.find(elm => {
            return elm.name == 'partcolors';
        });

        if (elm === undefined) return [];
        if (elm.elements === undefined) return [];

        elm.elements.forEach(elm1 => {
            colors.push(elm1.elements[0].text);
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


        this.convertToJson();
        this.parse();

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