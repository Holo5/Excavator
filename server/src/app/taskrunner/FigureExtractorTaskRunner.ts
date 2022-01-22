import { inject, singleton } from 'tsyringe';
import { FigureMapExtractor } from '../../extractor/FigureMapExtractor';
import { Lib } from '../../domain/figuremap/Lib';
import { ExtractionState } from '../../domain/figuremap/enums/ExtractionState';
import { ITaskStack } from './ITaskStack';
import { FigureTask } from '../../domain/tasks/FigureTask';
import { Logger } from '../logger/Logger';

@singleton()
export class FigureExtractorTaskRunner {
    private readonly _stack: ITaskStack[];

    private _libsToExtract: Lib[];

    constructor(
        @inject(FigureMapExtractor) private _figureMapExtractor: FigureMapExtractor,
    ) {
        this._libsToExtract = [];
        this._stack = [];
    }

    startExtraction() {
        this.setLibsToExtract();

        for (let i = 0; i < 10; i++) {
            this.addToStack();
        }

        this.runStack();
    }

    private addToStack() {
        if (this._libsToExtract.length <= 0) return;

        const lib = this._libsToExtract.shift();

        Logger.debug(`Extracting ${lib.id}. ${this._libsToExtract.length}`);
        const task = new FigureTask(lib);

        this._stack.push({
            task,
            running: false,
        });
    }

    private runStack() {
        const stoppedStack = this._stack.filter((s: ITaskStack) => !s.running);

        for (let i = 0; i < stoppedStack.length; i++) {
            stoppedStack[i].running = true;

            stoppedStack[i].task.run().then(() => {
                const index = this._stack.findIndex((item: ITaskStack) => item === stoppedStack[i]);

                this._stack.splice(index, 1);

                this.addToStack();
                this.runStack();
            });
        }
    }

    private setLibsToExtract() {
        this._libsToExtract = [];

        this._figureMapExtractor.libs.forEach((lib) => {
            if (lib.extractionState === ExtractionState.WAITING) {
                this._libsToExtract.push(lib);
            }
        });
    }
}
