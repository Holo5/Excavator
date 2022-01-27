import { ConvertExternalTexts } from './app/commands/gamedata/ExternalTexts/ConvertExternalTexts';
import { ConvertExternalVariables } from './app/commands/gamedata/ExternalVariables/ConvertExternalVariables';
import { ExtractEffects } from './app/commands/avatar/effects/effect-extractor/ExtractEffects';
import { IConfiguration } from './app/interfaces/IConfiguration';
import path from 'path';

export const Configuration: IConfiguration = {
    https: true,
    externalVariablesUrl: 'https://www.habbo.fr/gamedata/external_variables/0',
    externalTextsUrl: 'https://www.habbo.fr/gamedata/external_flash_texts/0',
    commands: [
        ConvertExternalTexts,
        ConvertExternalVariables,
        ExtractEffects,
    ],
    tmpFolder: path.resolve(__dirname, '..', 'tmp'),
    distFolder: path.resolve(__dirname, '..', 'dist'),
    overrideExternalVariables: [],
};
