import { ConvertExternalTexts } from './app/commands/GameData/ExternalTexts/ConvertExternalTexts';
import { IConfiguration } from './app/interfaces/IConfiguration';
import path from 'path';

export const Configuration: IConfiguration = {
    https: true,
    externalVariablesUrl: 'https://www.habbo.fr/gamedata/external_variables/0',
    externalTextsUrl: 'https://www.habbo.fr/gamedata/external_flash_texts/0',
    commands: [
        ConvertExternalTexts,
    ],
    tmpFolder: path.resolve(__dirname, '..', 'tmp'),
    overrideExternalVariables: [],
};