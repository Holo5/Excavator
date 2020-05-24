export interface IExcavatorConfiguration {
    tmpDir: string,
    assetExtractorPath: string,
    keepTmpFiles: boolean,
    figure: {
        figureData: string,
        figureMap: string
    },
    furni: {
        furniData: string
    }
}