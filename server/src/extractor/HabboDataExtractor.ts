import * as download from 'download';
import { Configuration } from '../../config';
import { FSRepository } from '../infra/FSRepository';
import { HabboDataType } from './enums/HabboDataType';
import { inject, singleton } from 'tsyringe';

const LOCAL_EXTERNAL_VARIABLES_NAME = 'external_variables.txt';

@singleton()
export class HabboDataExtractor {
    private _variables: string[];

    constructor(
        @inject(FSRepository) private _fsRepository: FSRepository,
    ) {}

    async init() {
        await this.download();
        this.extractData();
        this.replaceValues();
        this.mergeOverrides();
    }

    private async download() {
        const externalVariables = await download(Configuration.externalVariablesUrl);
        this._fsRepository.writeInTmpFolder(LOCAL_EXTERNAL_VARIABLES_NAME, externalVariables);
    }

    private extractData() {
        const data = this._fsRepository.readInTmpFolder(LOCAL_EXTERNAL_VARIABLES_NAME) as Buffer;
        const dataArray: string[] = data
            .toString('utf-8')
            .split('\n')
            .filter((value) => value !== '' && !value.includes('(?)'))
            .reduce((previousValue: any, currentValue: string) => {
                const variable = currentValue.split('=');
                const reducedPreviousValue = previousValue;
                // eslint-disable-next-line prefer-destructuring
                reducedPreviousValue[variable[0]] = variable[1];
                return reducedPreviousValue;
            }, []);

        this._variables = dataArray;
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
        Object.keys(Configuration.override).forEach((key) => {
            this._variables[key] = Configuration.override[key];
        });
    }

    getHabboData(habboDataType: HabboDataType): string {
        const data = this._variables[habboDataType];
        if (data !== undefined && data.substring(0, 2) === '//') {
            return this._variables[habboDataType].replace('//', Configuration.forceHttps ? 'https://' : 'http://').trim();
        }
        return this._variables[habboDataType].trim();
    }
}
