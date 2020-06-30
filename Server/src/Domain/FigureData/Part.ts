export class Part {
    private readonly _id: string;
    private readonly _type: string;
    private readonly _colorable: string;
    private readonly _index: string;
    private readonly _colorIndex: string;

    constructor(id: string, type: string, colorable: string, index: string, colorindex: string) {
        this._id = id;
        this._type = type;
        this._colorable = colorable;
        this._index = index;
        this._colorIndex = colorindex;
    }

    public get id(): string {
        return this._id;
    }

    public get type(): string {
        return this._type;
    }

    public get colorable(): string {
        return this._colorable;
    }

    public get index(): string {
        return this._index;
    }

    public get colorIndex(): string {
        return this._colorIndex;
    }
}
