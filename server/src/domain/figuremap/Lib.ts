import { Part } from './Part';
import { ExtractionState } from './Enum/ExtractionState';

export class Lib {
    public id: string;
    public revision: string;
    public parts: Part[];
    public extractionState: ExtractionState;

    constructor(id: string, revision: string, parts: Part[]) {
        this.id = id;
        this.revision = revision;
        this.parts = parts;
        this.extractionState = ExtractionState.WAITING;
    }

    setExtractionState(value: ExtractionState) {
        this.extractionState = value;
    }
}
