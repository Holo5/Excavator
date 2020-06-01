import {inject, singleton} from 'tsyringe';
import {HabboDataExtractor} from './HabboDataExtractor';
import {HabboDataType} from './Enum/HabboDataType';
import {FSRepository} from '../Infra/FSRepository';
import {xml2json} from 'xml-js';
import download = require('download');
import {Part} from '../Domain/FigureMap/Part';
import {Lib} from '../Domain/FigureMap/Lib';
import {black, blue, cyan, gray, green, grey, magenta, red, white, yellow} from 'colors';

const FIGURE_DATA_NAME = 'figuremap.xml';

@singleton()
export class FigureMapExtractor {
    private _figureMapJson: any;

    constructor(
        @inject(HabboDataExtractor) private _habboDataExtractor: HabboDataExtractor,
        @inject(FSRepository) private _fsRepository: FSRepository
    ) {}

    async retrieve() {
        await this.download();
        this.convertToJson();
        this.parse();

        console.log("");
        console.log("");
        console.log("");
        console.log(red("HELLOOOO"));
        console.log(green("HELLOOOO"));
        console.log(yellow("HELLOOOO"));
        console.log(blue("HELLOOOO"));
        console.log(magenta("HELLOOOO"));
        console.log(cyan("HELLOOOO"));
        console.log(white("HELLOOOO"));
        console.log(gray("HELLOOOO"));
        console.log(grey("HELLOOOO"));

        console.log("");
        console.log("");
        console.log("");
        console.log("");
        console.log("");
        console.log("");


        console.log(cyan("Initing ") + yellow("FigureMapExtractor"));
        console.log(green("HELLOOOO"));

    }

    private async download() {
        let externalVariables = await download(this._habboDataExtractor.getHabboData(HabboDataType.FIGUREMAP_URL));
        this._fsRepository.writeInTmpFolder(FIGURE_DATA_NAME, externalVariables);
    }

    private convertToJson() {
        let xml = this._fsRepository.readInTmpFolder(FIGURE_DATA_NAME);
        this._figureMapJson = JSON.parse(xml2json(xml, {compact: false}));
    }

    private parse() {
        let libs: Array<any> = this._figureMapJson.elements[0].elements;
        libs = libs.reduce((previousValue, currentValue) => {

            let parts: Array<any> = currentValue.elements;
            parts = parts.reduce((previousValue1, currentValue1) => {

                previousValue1.push(new Part(currentValue1.attributes.id, currentValue1.attributes.type));
                return previousValue1;
            }, []);

            previousValue.push(new Lib(currentValue.attributes.id, currentValue.attributes.revision, parts));
            return previousValue;
        }, []);
    }
}