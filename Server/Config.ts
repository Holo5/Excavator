import {IExcavatorConfiguration} from './src/App/interface/IExcavatorConfiguration';

export const Configuration: IExcavatorConfiguration = {
    tmpDir: "Server/tmp", // From projet root
    assetExtractorPath: "",
    externalVariablesUrl: "https://www.habbo.com/gamedata/external_variables/27426eed456735d61363bc3655409281d8ec60a6",
    keepTmpFiles: true,
    forceHttps: true,
    figure: {
        figureData: "",
        figureMap: "",
        swfBaseUrl: ""
    },
    furni: {
        furniData: "",
        swfBaseUrl: ""
    }
};