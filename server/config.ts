import { IExcavatorConfiguration } from './src/App/Interface/IExcavatorConfiguration';

export const Configuration: IExcavatorConfiguration = {
    assetVersion: '1.0',
    tmpDir: 'Server/tmp', // From projet root
    assetExtractorPath: '',
    externalVariablesUrl: 'https://www.habbo.fr/gamedata/external_variables/e5f86b428af85e8d9d62a8c60e04a77a193fbf61',
    keepTmpFiles: true,
    forceHttps: true,
    serverPort: 6691,
    packetDebug: true,
    override: {
        // 'furnidata.load.url': 'https://swf.habbocity.me/gamedata/furnidata_2884441y959994259.txt?1623535700',
    },
    folder: {
        figures: 'figure',
        furnis: 'furni',
        furniIcons: 'icons',
    },
};
