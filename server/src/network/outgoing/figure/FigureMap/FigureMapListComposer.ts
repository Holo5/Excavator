import { FigureMapExtractor } from '../../../../Extractor/FigureMapExtractor';
import { Lib } from '../../../../Domain/FigureMap/Lib';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { container } from 'tsyringe';

export interface IFigureMapListMessage {
    libs: Lib[];
}

export class FigureMapListComposer extends Outgoing<IFigureMapListMessage> {
    private readonly _figureMapExtractor: FigureMapExtractor;
    private readonly _libs: Lib[];

    constructor(libs: Lib[] = undefined) {
        super(OutgoingHeader.FIGUREMAP_LIST);

        this._figureMapExtractor = container.resolve(FigureMapExtractor);
        this._libs = libs ?? this._figureMapExtractor.libs;
    }

    public process() {
        this._data = {
            libs: this._libs,
        };
    }
}
