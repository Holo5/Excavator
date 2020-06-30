export interface IExcavatorConfiguration {
    tmpDir: string,
    assetExtractorPath: string,
    externalVariablesUrl: string,
    keepTmpFiles: boolean,
    forceHttps: boolean,
    serverPort: number,
    packetDebug: boolean,
    figure: {
        figureData: string,
        figureMap: string,
        swfBaseUrl: string
    },
    furni: {
        furniData: string,
        swfBaseUrl: string
    }
}
