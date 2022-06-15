import { Configuration } from '../../../../conf';
import { Constructor } from '../../../tasks/types/Constructor';
import { DownloadExternalTexts } from './DownloadExternalTexts';
import { Task } from '../../../tasks/Task';
import fs from 'fs';
import path from 'path';

export class ConvertExternalTexts extends Task {
    private texts: Record<string, string> = {};

    dependencies(): Constructor<Task>[] {
        return [
            DownloadExternalTexts,
        ];
    }

    async execute(): Promise<void> {
        try {
            const data = fs.readFileSync(path.resolve(Configuration.tmpFolder, 'gamedata', 'external_flash_texts.txt'), { encoding: 'utf8' });

            const lines = data.toString().split('\n');

            lines.forEach((line: string) => {
                const translation = line.split('=');
                if (translation.length === 2) {
                    this.texts[translation[0]] = translation[1];
                }
            });

            fs.mkdirSync(path.resolve(Configuration.distFolder, 'gamedata'), { recursive: true });
            fs.writeFileSync(path.resolve(Configuration.distFolder, 'gamedata', 'external_texts.json'), JSON.stringify(this.texts), { encoding: 'utf8', flag: 'w+' });

            this.success();
        } catch (e) {
            this.error(`Can't convert external texts. Error: ${e}`);
        }
    }
}