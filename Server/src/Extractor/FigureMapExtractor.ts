import { inject, singleton } from 'tsyringe';
import { xml2json } from 'xml-js';
import * as download from 'download';
import { blue, cyan, magenta, yellow } from 'colors';
import { HabboDataExtractor } from './HabboDataExtractor';
import { HabboDataType } from './Enum/HabboDataType';
import { FSRepository } from '../Infra/FSRepository';
import { Part } from '../Domain/FigureMap/Part';
import { Lib } from '../Domain/FigureMap/Lib';
import { FigureMapListComposer } from '../Network/Outgoing/Figure/FigureMap/FigureMapListComposer';

const FIGURE_DATA_NAME = 'figuremap.xml';

@singleton()
export class FigureMapExtractor {
  private _figureMapJson: any;
  private _libs: Lib[];

  constructor(
    @inject(HabboDataExtractor) private _habboDataExtractor: HabboDataExtractor,
    @inject(FSRepository) private _fsRepository: FSRepository,
  ) {
    this._libs = [];
  }

  async retrieve() {
    console.log(cyan('Retrieving ') + yellow('figuremaps...'));

    await this.download();
    this.convertToJson();
    this.parse();

    console.log(blue('Clothes founds: ') + magenta(this._libs.length.toString()));
    new FigureMapListComposer(this._libs).send();
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
