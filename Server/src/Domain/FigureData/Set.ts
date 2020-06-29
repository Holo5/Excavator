import { Part } from './Part';
import { HiddenPart } from './HiddenPart';

export class Set {
  private _id: string;
  private _gender: string;
  private _club: string;
  private _colorable: string;
  private _selectable: string;
  private _preselectable: string;
  private _sellable: string;
  private _parts: Part[];
  private _hiddenParts: HiddenPart[];

  constructor(
    id: string,
    gender: string,
    club: string,
    colorable: string,
    selectable: string,
    preselectable: string,
    sellable: string,
    parts: Part[],
    hiddenParts: HiddenPart[],
  ) {
    this._id = id;
    this._gender = gender;
    this._club = club;
    this._colorable = colorable;
    this._selectable = selectable;
    this._preselectable = preselectable;
    this._sellable = sellable;
    this._parts = parts;
    this._hiddenParts = hiddenParts;
  }

  public get id(): string {
    return this._id;
  }

  public get gender(): string {
    return this._gender;
  }

  public get club(): string {
    return this._club;
  }

  public get colorable(): string {
    return this._colorable;
  }

  public get selectable(): string {
    return this._selectable;
  }

  public get preselectable(): string {
    return this._preselectable;
  }

  public get sellable(): string {
    return this._sellable;
  }

  public get parts(): Part[] {
    return this._parts;
  }

  public get hiddenParts(): HiddenPart[] {
    return this._hiddenParts;
  }
}
