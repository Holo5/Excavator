import {inject, singleton} from 'tsyringe';
import {FSRepository} from '../Infra/FSRepository';
import {SocketServer} from '../Network/Serveur/SocketServer';
import {HabboDataExtractor} from '../Extractor/HabboDataExtractor';
import {HabboDataType} from '../Extractor/Enum/HabboDataType';
import {FigureMapExtractor} from '../Extractor/FigureMapExtractor';
import {FigureExtractorTaskRunner} from "./TaskRunner/FigureExtractorTaskRunner";

@singleton()
export class Holo5Excavator {
    constructor(
        @inject(FSRepository) private _fsRepository: FSRepository,
        @inject(SocketServer) private _socketServer: SocketServer,
        @inject(HabboDataExtractor) private _habboDataExtractor: HabboDataExtractor,
        @inject(FigureMapExtractor) private _figureMapExtractor: FigureMapExtractor,
        @inject(FigureExtractorTaskRunner) private _figureExtractorTaskRunner: FigureExtractorTaskRunner
    ) {}

    async init() {
        this._fsRepository.init();
        this._socketServer.init();
        await this._habboDataExtractor.init();

        await this._figureMapExtractor.retrieve();
        this._figureExtractorTaskRunner.startExtraction();
    }
}
