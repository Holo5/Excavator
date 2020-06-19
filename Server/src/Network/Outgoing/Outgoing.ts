import {OutgoingHeader} from './OutgoingHeader';
import {container} from 'tsyringe';
import {SocketServer} from '../Serveur/SocketServer';
import {white, yellow} from "colors";

export interface IOutgoingData {
    header: number,
    data: any
}

export abstract class Outgoing<T> {
    protected _header: number;
    protected _data: T;

    constructor(header: OutgoingHeader) {
        this._header = header;
    }

    abstract process(): void;

    send() {
        this.process();
        container.resolve(SocketServer).send(this);
    }

    getOutgoingData(): IOutgoingData {
        return {
            header: this._header,
            data: this._data
        }
    }

    protected log(text: string) {
        console.log(yellow("[" + this.constructor.name + "] " + white(text)));
    }
}