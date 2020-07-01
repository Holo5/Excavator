import { Color } from './Color';

export class ColorPalette {
    private _id: string;
    private _colors: Color[];

    constructor(id: string, colors: Color[]) {
        this._id = id;
        this._colors = colors;
    }

    public get id(): string {
        return this._id;
    }

    public get colors(): Color[] {
        return this._colors;
    }
}
