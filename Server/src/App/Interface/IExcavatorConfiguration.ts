export interface IExcavatorConfiguration {
    tmpDir: string,
    assetExtractorPath: string,
    externalVariablesUrl: string,
    keepTmpFiles: boolean,
    forceHttps: boolean,
    serverPort: number,
    packetDebug: boolean,
    folder: {
        figures: string,
        furnis: string,
        furniIcons: string,
    }
}
