export class Color {
    private readonly _id: string;
    private readonly _index: string;
    private readonly _club: string;
    private readonly _selectable: string;
    private readonly _color: string;

    constructor(id: string, index: string, club: string, selectable: string, color: string) {
        this._id = id;
        this._index = index;
        this._club = club;
        this._selectable = selectable;
        this._color = color;
    }
}
