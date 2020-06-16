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

    public get id(): string {
        return this._id;
    }

    public get revision(): string {
        return this._revision;
    }

    public get parts(): Part[] {
        return this._parts;
    }
}