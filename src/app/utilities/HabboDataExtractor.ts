import * as Path from 'path';
import { Configuration } from '../../conf';
import { Downloader } from './Downloader';
import { Task } from '../tasks/Task';
import fs from 'fs';

export class HabboDataExtractor extends Task {
    private _variables: Record<string, string>;

    async init() {
        await this.download();
        this.extractData();
        this.replaceValues();
        this.mergeOverrides();
    }

    private async download() {
        await Downloader.getFile(Configuration.externalVariablesUrl, Path.resolve(Configuration.tmpFolder, 'gamedata'), 'external_variables.txt');
    }

    private extractData() {
        const data = fs.readFileSync(Path.resolve(Configuration.tmpFolder, 'gamedata', 'external_variables.txt'), { encoding: 'utf8' });
        this._variables = data
            .split('\n')
            .filter((value) => value !== '' && !value.includes('(?)'))
            .reduce((previousValue: any, currentValue: string) => {
                const variable = currentValue.split('=');
                const reducedPreviousValue = previousValue;
                // eslint-disable-next-line prefer-destructuring
                reducedPreviousValue[variable[0]] = variable[1];
                return reducedPreviousValue;
            }, []);
    }

    private replaceValues() {
        Object.keys(this._variables).forEach((index) => {
            const value: string = this._variables[index];

            const reg = new RegExp(/\$\{.+\w\}/);
            const result = reg.exec(value);

            if (result !== null) {
                const indexToReplace = result[0].substr(2, result[0].length - 3);
                const replacementValue = this._variables[indexToReplace];

                if (replacementValue !== undefined) {
                    this._variables[index] = value.replace(reg, replacementValue);
                }
            }
        });
    }

    private mergeOverrides() {
        Object.keys(Configuration.overrideExternalVariables).forEach((key) => {
            // TODO fix this shit
            // @ts-ignore
            this._variables[key] = Configuration.overrideExternalVariables[key];
        });
    }

    getHabboData(habboDataType: HabboDataType): string {
        const data = this._variables[habboDataType];
        if (data !== undefined && data.substring(0, 2) === '//') {
            return this._variables[habboDataType].replace('//', Configuration.https ? 'https://' : 'http://').trim();
        }
        return this._variables[habboDataType].trim();
    }
}

enum HabboDataType {
    FIGUREMAP_URL = 'flash.dynamic.avatar.download.configuration',
    FIGUREDATA_URL = 'external.figurepartlist.txt',
    FURNIDATA_URL = 'furnidata.load.url',
    FLASH_CLIENT_URL = 'flash.client.url',
    FURNI_URL = 'dynamic.download.url',
    FURNI_LINK_TEMPLATE = 'flash.dynamic.download.name.template',
}