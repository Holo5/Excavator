import {container, inject, singleton} from 'tsyringe';
import {HabboDataExtractor} from './HabboDataExtractor';
import {HabboDataType} from './Enum/HabboDataType';
import {FSRepository} from '../Infra/FSRepository';
import {xml2json} from 'xml-js';
import download = require('download');
import {Part} from '../Domain/FigureMap/Part';
import {Lib} from '../Domain/FigureMap/Lib';
import {black, blue, cyan, gray, green, grey, magenta, red, white, yellow} from 'colors';
import {FigureMapListComposer} from '../Network/Outgoing/Figure/FigureMap/FigureMapListComposer';
import {SocketServer} from "../Network/Server/SocketServer";
import {Logger} from "../App/Logger/Logger";

const FIGURE_DATA_NAME = 'figuremap.xml';

@singleton()
export class FigureMapExtractor {
    private readonly _socketServer: SocketServer
    private _figureMapJson: any;
    private _libs: Lib[];

    constructor(
        @inject(HabboDataExtractor) private readonly _habboDataExtractor: HabboDataExtractor,
        @inject(FSRepository) private readonly _fsRepository: FSRepository,
    ) {
        this._libs = [];

        this._socketServer = container.resolve(SocketServer)
    }

    async retrieve() {
        Logger.info("Retrieving figuremap...")

        await this.download();

        this.convertToJson();
        this.parse();

        Logger.info(`Found ${magenta(this._libs.length.toString())} clothes`)

        this._socketServer.send(new FigureMapListComposer(this._libs));
    }

  private async download() {
    const externalVariables = await download(
      this._habboDataExtractor.getHabboData(HabboDataType.FIGUREMAP_URL),
    );
    this._fsRepository.writeInTmpFolder(FIGURE_DATA_NAME, externalVariables);
  }

  private convertToJson() {
    const xml = this._fsRepository.readInTmpFolder(FIGURE_DATA_NAME);
    this._figureMapJson = JSON.parse(xml2json(xml, { compact: false }));
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
