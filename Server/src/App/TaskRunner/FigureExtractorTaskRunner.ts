import { inject, singleton } from 'tsyringe';
import { FigureMapExtractor } from '../../Extractor/FigureMapExtractor';
import { Lib } from '../../Domain/FigureMap/Lib';
import { ExtractionState } from '../../Domain/FigureMap/Enum/ExtractionState';
import { ITaskStack } from './ITaskStack';
import { FigureTask } from '../../Domain/Tasks/FigureTask';
import {Logger} from '../Logger/Logger';

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

        for (let i = 0; i < 5; i++) {
            this.addToStack();
        }

        this.runStack();

        //
        // new FigureTask(this._libsToExtract[0]).run();

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

    private addToStack() {
        const lib = this._libsToExtract.shift();
        Logger.debug("Extracting " + lib.id);
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
