import {inject, singleton} from 'tsyringe';
import {FSRepository} from '../Infra/FSRepository';
import download = require('download');
import {Configuration} from '../../Config';
import {HabboDataType} from './Enum/HabboDataType';

const EXTERNAL_VARIABLES_NAME = "external_variables.txt";

@singleton()
export class HabboDataExtractor {

    private _variables: string[];

    constructor(
        @inject(FSRepository) private _fsRepository: FSRepository
    ) {}

    async init() {
        await this.download();
        this.extractData();
        this.replaceValues();
    }

    private async download() {
        let externalVariables = await download(Configuration.externalVariablesUrl);
        this._fsRepository.writeInTmpFolder(EXTERNAL_VARIABLES_NAME, externalVariables);
    }

    private extractData() {
        let data = this._fsRepository.readInTmpFolder(EXTERNAL_VARIABLES_NAME) as Buffer;
        let dataArray: string[] = data
            .toString('utf-8')
            .split('\n')
            .filter(value => value !== "" && !value.includes('(?)'))
            .reduce((previousValue: any, currentValue: string) => {
                let variable = currentValue.split("=");
                previousValue[variable[0]] = variable[1];
                return previousValue;
            }, [])
        ;

        this._variables = dataArray;
    }

    private replaceValues() {
        Object.keys(this._variables).forEach(index => {
            let value: string = this._variables[index];

            let reg = new RegExp(/\$\{.+\w\}/);
            let result = reg.exec(value);

            if(result !== null) {
                let indexToReplace = result[0].substr(2, result[0].length - 3);
                let replacementValue = this._variables[indexToReplace];

                if(replacementValue !== undefined) {
                    this._variables[index] = value.replace(reg, replacementValue);
                }
            }
        });
    }

    getHabboData(habboDataType: HabboDataType) {
        let data = this._variables[habboDataType];
        if(data !== undefined && data.substring(0, 2) === "//") {
            return this._variables[habboDataType].replace('//', Configuration.forceHttps ? 'https://' : 'http://');
        }
        return this._variables[habboDataType];
    }
}