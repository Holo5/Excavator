import {inject, singleton} from "tsyringe";
import {FigureMapExtractor} from "../../Extractor/FigureMapExtractor";
import {Lib} from "../../Domain/FigureMap/Lib";
import {ExtractionState} from "../../Domain/FigureMap/Enum/ExtractionState";

@singleton()
export class FigureExtractorTaskRunner {
  private _libsToExtract: Lib[];

  constructor(
    @inject(FigureMapExtractor) private _figureMapExtractor: FigureMapExtractor
  ) {
    this._libsToExtract = [];
  }

  startExtraction() {
    this._libsToExtract = [];
    this.trimWaitingLib();
  }

  private trimWaitingLib() {
    this._figureMapExtractor.libs.forEach(lib => {
      if(lib.extractionState === ExtractionState.WAITING) {
        this._libsToExtract.push(lib);
      }
    });
  }
}
