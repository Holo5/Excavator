import {inject, singleton} from 'tsyringe';
import {FSRepository} from '../Infra/FSRepository';
import {SocketServer} from '../Network/Serveur/SocketServer';
import {HabboDataExtractor} from '../Extractor/HabboDataExtractor';
import {HabboDataType} from '../Extractor/Enum/HabboDataType';

@singleton()
export class Holo5Excavator {
    constructor(
        @inject(FSRepository) private _fsRepository: FSRepository,
        @inject(SocketServer) private _socketServer: SocketServer,
        @inject(HabboDataExtractor) private _figureDataExtractor: HabboDataExtractor
    ) {}

    async init() {
        this._fsRepository.init();
        this._socketServer.init();
        await this._figureDataExtractor.init();
    }
}
