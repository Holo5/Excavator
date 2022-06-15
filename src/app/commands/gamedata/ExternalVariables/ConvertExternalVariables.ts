import { Configuration } from '../../../../conf';
import { Constructor } from '../../../tasks/types/Constructor';
import { DownloadExternalVariables } from './DownloadExternalVariables';
import { Task } from '../../../tasks/Task';
import fs from 'fs';
import path from 'path';

export class ConvertExternalVariables extends Task {
    private texts: Record<string, string> = {};

    dependencies(): Constructor<Task>[] {
        return [
            DownloadExternalVariables,
        ];
    }

    async execute(): Promise<void> {
        try {
            const data = fs.readFileSync(path.resolve(Configuration.tmpFolder, 'gamedata', 'external_flash_vars.txt'), { encoding: 'utf8' });

            const lines = data.toString().split('\n');

            lines.forEach((line: string) => {
                const translation = line.split('=');
                if (translation.length === 2) {
                    this.texts[translation[0]] = translation[1];
                }
            });

            fs.mkdirSync(path.resolve(Configuration.distFolder, 'gamedata'), { recursive: true });
            fs.writeFileSync(path.resolve(Configuration.distFolder, 'gamedata', 'external_variables.json'), JSON.stringify(this.texts), { encoding: 'utf8', flag: 'w+' });

            this.success();
        } catch (e) {
            this.error(`Can't convert external variables. Error: ${e}`);
        }
    }
}