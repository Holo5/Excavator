import { inject, singleton } from 'tsyringe';
import { FSRepository } from '../Infra/FSRepository';
import { SocketServer } from '../Network/Server/SocketServer';
import { HabboDataExtractor } from '../Extractor/HabboDataExtractor';
import { FigureMapExtractor } from '../Extractor/FigureMapExtractor';
import { FigureExtractorTaskRunner } from './TaskRunner/FigureExtractorTaskRunner';
import { FigureDataExtractor } from '../Extractor/FigureDataExtractor';
import { Holo5FigureDataAssembler } from './Assembler/Holo5FigureDataAssembler';
import { FurniDataExtractor } from '../Extractor/FurniDataExtractor';
import { Holo5FurniDataAssembler } from './Assembler/Holo5FurniDataAssembler';
import { FurniExtractorTaskRunner } from './TaskRunner/FurniExtractorTaskRunner';

@singleton()
export class Holo5Excavator {
    constructor(
        @inject(FSRepository) private _fsRepository: FSRepository,
        @inject(SocketServer) private _socketServer: SocketServer,
        @inject(HabboDataExtractor) private _habboDataExtractor: HabboDataExtractor,
        @inject(FigureMapExtractor) private _figureMapExtractor: FigureMapExtractor,
        @inject(FigureDataExtractor) private _figureDataExtractor: FigureDataExtractor,
        @inject(Holo5FigureDataAssembler) private _holo5FigureDataAssembler: Holo5FigureDataAssembler,
        @inject(FigureExtractorTaskRunner) private _figureExtractorTaskRunner: FigureExtractorTaskRunner,
        @inject(FurniDataExtractor) private _furniDataExtractor: FurniDataExtractor,
        @inject(Holo5FurniDataAssembler) private _holo5FurniDataAssembler: Holo5FurniDataAssembler,
        @inject(FurniExtractorTaskRunner) private _furniExtractorTaskRunner: FurniExtractorTaskRunner,
    ) {}

    async init() {
        this._fsRepository.init();
        this._socketServer.init();
        await this._habboDataExtractor.init();
        //
        // await this._figureDataExtractor.retrieve();
        // await this._figureMapExtractor.retrieve();
        // await this._holo5FigureDataAssembler.assemble();
        // this._figureExtractorTaskRunner.startExtraction();

        await this._furniDataExtractor.retrieve();
        await this._holo5FurniDataAssembler.assemble();
        this._furniExtractorTaskRunner.startExtraction();
    }
}
