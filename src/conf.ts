import { IConfiguration } from './app/interfaces/IConfiguration';
import path from 'path';

export const Configuration: IConfiguration = {
    https: true,
    externalVariablesUrl: 'https://www.habbo.fr/gamedata/external_variables/0',
    tmpFolder: path.resolve(__dirname, '..', 'tmp'),
};