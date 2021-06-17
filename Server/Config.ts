import { IExcavatorConfiguration } from './src/App/Interface/IExcavatorConfiguration';

export const Configuration: IExcavatorConfiguration = {
    tmpDir: 'Server/tmp', // From projet root
    assetExtractorPath: '',
    externalVariablesUrl: 'https://swf.habbocity.me/gamedata/variables.txt?v11623531275',
    keepTmpFiles: true,
    forceHttps: true,
    serverPort: 6691,
    packetDebug: true,
    override: {
        'furnidata.load.url': 'https://swf.habbocity.me/gamedata/furnidata_2884441y959994259.txt?1623535700',
    },
    folder: {
        figures: 'figure',
        furnis: 'furni',
        furniIcons: 'icons',
    },
};
