import { IExcavatorConfiguration } from './src/App/Interface/IExcavatorConfiguration';

export const Configuration: IExcavatorConfiguration = {
    tmpDir: 'Server/tmp', // From projet root
    assetExtractorPath: '',
    externalVariablesUrl: 'https://www.habbo.com/gamedata/external_variables/1',
    keepTmpFiles: true,
    forceHttps: true,
    serverPort: 6691,
    packetDebug: true,
    folder: {
        figures: 'figure',
        furnis: 'furni',
        furniIcons: 'icons'
    }
};
