import { inject, singleton } from 'tsyringe';
import { FSRepository } from '../Infra/FSRepository';
import { SocketServer } from '../Network/Server/SocketServer';
import { HabboDataExtractor } from '../Extractor/HabboDataExtractor';
import { FigureMapExtractor } from '../Extractor/FigureMapExtractor';
import { FigureExtractorTaskRunner } from './TaskRunner/FigureExtractorTaskRunner';
import { FigureDataExtractor } from '../Extractor/FigureDataExtractor';
import { Holo5FigureDataAssembler } from './Assembler/Holo5FigureDataAssembler';
// import { HabboFlashExtractor } from '../Extractor/HabboFlashExtractor';
// import { AssetDownloader } from './Downloader/AssetDownloader';

@singleton()
export class Holo5Excavator {
    constructor(
        @inject(FSRepository) private _fsRepository: FSRepository,
        // @inject(HabboFlashExtractor) private _habboFlashExtractor: HabboFlashExtractor,
        // @inject(AssetDownloader) private _assetDownloader: AssetDownloader,
        @inject(SocketServer) private _socketServer: SocketServer,
        @inject(HabboDataExtractor) private _habboDataExtractor: HabboDataExtractor,
        @inject(FigureMapExtractor) private _figureMapExtractor: FigureMapExtractor,
        @inject(FigureDataExtractor) private _figureDataExtractor: FigureDataExtractor,
        @inject(Holo5FigureDataAssembler) private _holo5FigureDataAssembler: Holo5FigureDataAssembler,
        @inject(FigureExtractorTaskRunner) private _figureExtractorTaskRunner: FigureExtractorTaskRunner,
    ) {}

    async init() {
        this._fsRepository.init();
        this._socketServer.init();
        await this._habboDataExtractor.init();

        await this._figureDataExtractor.retrieve();
        await this._figureMapExtractor.retrieve();
        await this._holo5FigureDataAssembler.assemble();

        this._figureExtractorTaskRunner.startExtraction();
    }
}
