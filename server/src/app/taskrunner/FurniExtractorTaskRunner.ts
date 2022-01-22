import { inject, singleton } from 'tsyringe';
import { ITaskStack } from './ITaskStack';
import { Logger } from '../Logger/Logger';
import { FloorItem } from '../../Domain/FurniData/FloorItem';
import { FurniDataExtractor } from '../../Extractor/FurniDataExtractor';
import { FloorItemTask } from '../../Domain/Tasks/FloorItemTask';

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

        for (let i = 0; i < 20; i++) {
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
        const finalList: { [classname: string]: FloorItem } = {};

        this._furniDataExtractor.floorItems.forEach((floorItem: FloorItem) => {
            const className = floorItem.className.split('*')[0];
            if (finalList[className] === undefined) {
                finalList[className] = floorItem;
            }
        });

        this._floorItemsToExtract.push(FloorItem.tileCursor());
        this._floorItemsToExtract.push(...Object.values(finalList));
    }
}
