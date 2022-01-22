export interface IExcavatorConfiguration {
    assetVersion: string,
    tmpDir: string,
    assetExtractorPath: string,
    externalVariablesUrl: string,
    keepTmpFiles: boolean,
    forceHttps: boolean,
    serverPort: number,
    packetDebug: boolean,
    override: {
        'furnidata.load.url'?: string
    }
    folder: {
        figures: string,
        furnis: string,
        furniIcons: string,
    }
}
