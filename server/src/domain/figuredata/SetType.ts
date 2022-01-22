import { Set } from './Set';

export class SetType {
    private readonly _type: string;
    private readonly _paletteid: string;
    private readonly _mand_m_0: string;
    private readonly _mand_f_0: string;
    private readonly _mand_m_1: string;
    private readonly _mand_f_1: string;
    private readonly _sets: Set[];

    constructor(type: string, paletteid: string, mand_m_0: string, mand_f_0: string, mand_m_1: string, mand_f_1: string, sets: Set[]) {
        this._type = type;
        this._paletteid = paletteid;
        this._mand_m_0 = mand_m_0;
        this._mand_f_0 = mand_f_0;
        this._mand_m_1 = mand_m_1;
        this._mand_f_1 = mand_f_1;
        this._sets = sets;
    }

    public get type(): string {
        return this._type;
    }

    public get paletteid(): string {
        return this._paletteid;
    }

    public get mand_m_0(): string {
        return this._mand_m_0;
    }

    public get mand_f_0(): string {
        return this._mand_f_0;
    }

    public get mand_m_1(): string {
        return this._mand_m_1;
    }

    public get mand_f_1(): string {
        return this._mand_f_1;
    }

    public get sets(): Set[] {
        return this._sets;
    }
}
