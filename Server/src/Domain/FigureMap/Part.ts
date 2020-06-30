export class Part {
    private _id: string;
    private _type: string;

    constructor(id: string, type: string) {
        this._id = id;
        this._type = type;
    }

    public get id(): string {
        return this._id;
    }

    public get type(): string {
        return this._type;
    }
}
