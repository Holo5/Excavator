import {inject, singleton} from 'tsyringe';
import {ITaskStack} from './ITaskStack';
import {Lib} from '../../Domain/FigureMap/Lib';
import {FigureMapExtractor} from '../../Extractor/FigureMapExtractor';
import {Logger} from '../Logger/Logger';
import {FigureTask} from '../../Domain/Tasks/FigureTask';
import {ExtractionState} from '../../Domain/FigureMap/Enum/ExtractionState';
import {FloorItem} from '../../Domain/FurniData/FloorItem';
import {FurniDataExtractor} from '../../Extractor/FurniDataExtractor';
import {FloorItemTask} from '../../Domain/Tasks/FloorItemTask';

@singleton()
export class FurniExtractorTaskRunner {
    private readonly _stack: ITaskStack[];

    private _floorItemsToExtract: FloorItem[];

    constructor(
        @inject(FurniDataExtractor) private _furniDataExtractor: FurniDataExtractor,
    ) {
        this._floorItemsToExtract = [];
        this._stack = [];
    }

    startExtraction() {
        this.setFloorItemsToExtract();

        for (let i = 0; i < 10; i++) {
            this.addToStack();
        }

        this.runStack();
    }

    private addToStack() {
        if (this._floorItemsToExtract.length <= 0) return;

        const floorItem = this._floorItemsToExtract.shift();

        Logger.debug(`Extracting ${floorItem.className}. ${this._floorItemsToExtract.length}`);
        const task = new FloorItemTask(floorItem);

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

    private setFloorItemsToExtract() {
        let knownElements: string[] = [];

        let elmList = this._furniDataExtractor.floorItems.filter(floorItem => {
            if(floorItem.className.includes('*')) {
                let realClassName = floorItem.className.split('*')[0];
                if(knownElements.indexOf(realClassName) === -1) {
                    floorItem.className = realClassName;
                    knownElements.push(realClassName);
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        });

        elmList.forEach(floorItem => {
            this._floorItemsToExtract.push(floorItem);
        });
    }
}