import { IOutgoingData } from './IOutgoingData';
import { Logger } from '../../app/logger/Logger';
import { OutgoingHeader } from './OutgoingHeader';
import { yellow } from 'colors';

export abstract class Outgoing<Data> {
    protected readonly _header: number;
    protected _data: Data;

    protected constructor(header: OutgoingHeader) {
        this._header = header;
    }

    abstract process(): void;

    public evaluate(): IOutgoingData<Data> {
        this.process();

        return this.getOutgoingData();
    }

    private getOutgoingData(): IOutgoingData<Data> {
        return {
            header: this._header,
            data: this._data,
        };
    }

    protected log(text: string) {
        Logger.info(`${yellow(this.constructor.name)} | ${text}`);
    }
}
