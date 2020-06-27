import { inject, singleton } from 'tsyringe';
import * as Listr from 'listr';
import { blue } from 'colors';
import { FigureMapExtractor } from '../../Extractor/FigureMapExtractor';
import { Lib } from '../../Domain/FigureMap/Lib';
import { ExtractionState } from '../../Domain/FigureMap/Enum/ExtractionState';
import { FigureTask } from '../../Domain/Tasks/FigureTask';

@singleton()
export class FigureExtractorTaskRunner {
  private _libsToExtract: Lib[];

  constructor(
    @inject(FigureMapExtractor) private _figureMapExtractor: FigureMapExtractor,
  ) {
    this._libsToExtract = [];
  }

  startExtraction() {
    this._libsToExtract = [];
    this.trimWaitingLib();

    // new FigureTask(this._libsToExtract[0]).run();

    const tasks = [];
    for (let i = 0; i < 3; i++) {
      tasks.push({
        title: this._libsToExtract[i].id,
        task: async () => { await new FigureTask(this._libsToExtract[i]).run(); },
      });
    }

    const taks = new Listr(tasks, { concurrent: false });

    taks.run().then(() => {
      console.log(blue('All files extracted...'));
    });
  }

  private trimWaitingLib() {
    this._figureMapExtractor.libs.forEach((lib) => {
      if (lib.extractionState === ExtractionState.WAITING) {
        this._libsToExtract.push(lib);
      }
    });
  }
}
