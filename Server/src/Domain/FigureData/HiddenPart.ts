export class HiddenPart {
    private readonly _partType: string;

    constructor(partType: string) {
        this._partType = partType;
    }

    public get partType(): string {
        return this._partType;
    }
}
