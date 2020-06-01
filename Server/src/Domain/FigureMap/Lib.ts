import {Part} from './Part';

export class Lib {
    private id_: string;
    private _revision: string;
    private _parts: Part[];

    constructor(id_: string, revision: string, parts: Part[]) {
        this.id_ = id_;
        this._revision = revision;
        this._parts = parts;
    }
}