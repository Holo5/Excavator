import {inject, singleton} from 'tsyringe';
import {FSRepository} from '../Infra/FSRepository';
import {SocketServer} from "../Network/Serveur/SocketServer";

@singleton()
export class Holo5Excavator {
    constructor(
        @inject(FSRepository) private _fsRepository: FSRepository,
        @inject(SocketServer) private _socketServer: SocketServer
    ) {}

    init() {
        this._fsRepository.init();
        this._socketServer.init();
    }
}
