import {inject, singleton} from 'tsyringe';
import {FigureMapExtractor} from '../../Extractor/FigureMapExtractor';
import {Lib} from '../../Domain/FigureMap/Lib';
import {ExtractionState} from '../../Domain/FigureMap/Enum/ExtractionState';
import * as Listr from 'listr';
import {blue} from 'colors';
import {FigureTask} from '../../Domain/Tasks/FigureTask';

// @ts-ignore

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

    new FigureTask(this._libsToExtract[0]).run();

    // let tasks = [];
    // for(let i = 0; i < 10; i++) {
    //   tasks.push({
    //     title: this._libsToExtract[i].id,
    //     task: async () => { await new FigureTask(this._libsToExtract[i]).run(); }
    //   })
    // }
    //
    // let taks = new Listr(tasks, {concurrent: false, renderer: "default"});
    //
    // taks.run().then(() => {
    //   console.log(blue('All files extracted...'));
    // });
  }

  private trimWaitingLib() {
    this._figureMapExtractor.libs.forEach(lib => {
      if (lib.extractionState === ExtractionState.WAITING) {
        this._libsToExtract.push(lib);
      }
    });
  }
}
