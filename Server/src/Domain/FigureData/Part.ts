export class Part {
  private _id: string;
  private _type: string;
  private _colorable: string;
  private _index: string;
  private _colorindex: string;

  constructor(id: string, type: string, colorable: string, index: string, colorindex: string) {
    this._id = id;
    this._type = type;
    this._colorable = colorable;
    this._index = index;
    this._colorindex = colorindex;
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

  public get colorindex(): string {
    return this._colorindex;
  }
}
