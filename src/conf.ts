import { ConvertFigureData } from './app/commands/avatar/figure/figuredata/ConvertFigureData';
import { IConfiguration } from './app/interfaces/IConfiguration';
import path from 'path';

export const Configuration: IConfiguration = {
    https: true,
    externalVariablesUrl: 'https://www.habbo.fr/gamedata/external_variables/0',
    externalTextsUrl: 'https://www.habbo.fr/gamedata/external_flash_texts/0',
    tasks: [
        ConvertFigureData,
        // ConvertFigureMap,
        // ConvertExternalTexts,
        // ConvertExternalVariables,
        // ExtractEffects,
    ],
    tmpFolder: path.resolve(__dirname, '..', 'tmp'),
    distFolder: path.resolve(__dirname, '..', 'dist'),
    overrideExternalVariables: [],
};
