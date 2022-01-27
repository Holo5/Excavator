import { ConvertEffectMap } from '../effectmap/ConvertEffectMap';
import { Task } from '../../../../tasks/Task';

export class ExtractEffects extends Task {
    async execute(): Promise<void> {
        await (new ConvertEffectMap(true)).execute();

        try {
            //
            this.success();
        } catch (e) {
            this.error(`Can't convert external texts. Error: ${e}`);
        }
    }
}