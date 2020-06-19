import {inject, singleton} from "tsyringe";
import {FigureMapExtractor} from "../../Extractor/FigureMapExtractor";
import {Lib} from "../../Domain/FigureMap/Lib";
import {ExtractionState} from "../../Domain/FigureMap/Enum/ExtractionState";
import * as Listr from "listr";

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

    let taks = new Listr([
        this.getRandomTask()
      ]
    );

    taks.run().then(() => {
      console.log("HEY");

    });
  }

  getRandomTask() {
    return {
      title: "Test :D " + (Math.random() * 15000).toString(),
      task: () => new Listr([
        {
          title: "Test :D " + (Math.random() * 15000).toString(),
          task: this.getDelayedTask
        },
        {
          title: "Test :D " + (Math.random() * 15000).toString(),
          task: this.getDelayedTask
        },
        {
          title: "Test :D " + (Math.random() * 15000).toString(),
          task: this.getDelayedTask
        },
        {
          title: "Test :D " + (Math.random() * 15000).toString(),
          task: this.getDelayedTask
        },
        {
          title: "Test :D " + (Math.random() * 15000).toString(),
          task: this.getDelayedTask
        },
        {
          title: "Test :D " + (Math.random() * 15000).toString(),
          task: this.getDelayedTask
        },
        {
          title: "Test :D " + (Math.random() * 15000).toString(),
          task: this.getDelayedTask
        },
        {
          title: "Test :D " + (Math.random() * 15000).toString(),
          task: this.getDelayedTask
        },

      ])
    }
  }

  getDelayedTask() {
    return new Promise(resolve => {
      setTimeout(resolve, Math.random() * 1000)
    });
  }

  private trimWaitingLib() {
    this._figureMapExtractor.libs.forEach(lib => {
      if (lib.extractionState === ExtractionState.WAITING) {
        this._libsToExtract.push(lib);
      }
    });
  }
}
