export class Color {
    private _id: string;
    private _index: string;
    private _club: string;
    private _selectable: string;
    private _color: string;

    constructor(id: string, index: string, club: string, selectable: string, color: string) {
        this._id = id;
        this._index = index;
        this._club = club;
        this._selectable = selectable;
        this._color = color;
    }

    public get id(): string {
        return this._id;
    }

    public get index(): string {
        return this._index;
    }

    public get club(): string {
        return this._club;
    }

    public get selectable(): string {
        return this._selectable;
    }

    public get color(): string {
        return this._color;
    }
}
