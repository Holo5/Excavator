import { Color } from './Color';

export class ColorPalette {
    private readonly _id: string;
    private readonly _colors: Color[];

    constructor(id: string, colors: Color[]) {
        this._id = id;
        this._colors = colors;
    }
}
