import {Part} from './Part';

export class Lib {
    private _id: string;
    private _revision: string;
    private _parts: Part[];

    constructor(id: string, revision: string, parts: Part[]) {
        this._id = id;
        this._revision = revision;
        this._parts = parts;
    }
}