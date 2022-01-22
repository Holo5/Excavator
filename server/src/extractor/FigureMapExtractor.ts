import * as download from 'download';
import { container, inject, singleton } from 'tsyringe';
import { magenta } from 'colors';
import { xml2js } from 'xml-js';
import { HabboDataExtractor } from './HabboDataExtractor';
import { HabboDataType } from './enums/HabboDataType';
import { FSRepository } from '../infra/FSRepository';
import { Part } from '../domain/figuremap/Part';
import { Lib } from '../domain/figuremap/Lib';

import { SocketServer } from '../network/server/SocketServer';
import { Logger } from '../app/logger/Logger';
import { FigureMapListComposer } from '../network/outgoing/figure/FigureMap/FigureMapListComposer';

const LOCAL_FIGURE_MAP_NAME = 'figuremap.xml';

@singleton()
export class FigureMapExtractor {
    private readonly _socketServer: SocketServer;
    private _figureMapJson: any;
    private _libs: Lib[];

    constructor(
        @inject(HabboDataExtractor) private readonly _habboDataExtractor: HabboDataExtractor,
        @inject(FSRepository) private readonly _fsRepository: FSRepository,
    ) {
        this._libs = [];
        this._socketServer = container.resolve(SocketServer);
    }

    async retrieve() {
        Logger.info('Retrieving figuremap...');

        try {
            await this.download();
        } catch (e) {
            Logger.error("Figuremap can't be downloaded...");
            Logger.debug(`Link ${this._habboDataExtractor.getHabboData(HabboDataType.FIGUREMAP_URL)}`);
        }

        this.convertToJson();
        this.parse();

        Logger.info(`Found ${magenta(this._libs.length.toString())} clothes`);

        this._socketServer.send(new FigureMapListComposer(this._libs));
    }

    private async download() {
        Logger.debug(`Downloading ${this._habboDataExtractor.getHabboData(HabboDataType.FIGUREMAP_URL)}`);
        const figureMap = await download(
            this._habboDataExtractor.getHabboData(HabboDataType.FIGUREMAP_URL),
        );
        this._fsRepository.writeInTmpFolder(LOCAL_FIGURE_MAP_NAME, figureMap);
    }

    private convertToJson() {
        const xml = this._fsRepository.readInTmpFolder(LOCAL_FIGURE_MAP_NAME);
        this._figureMapJson = xml2js(xml, { compact: false });
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

        this._libs = libs;
    }

    public get libs(): Lib[] {
        return this._libs;
    }
}
