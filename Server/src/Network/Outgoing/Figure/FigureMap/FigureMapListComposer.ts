import {Outgoing} from '../../Outgoing';
import {OutgoingHeader} from '../../OutgoingHeader';
import {Lib} from '../../../../Domain/FigureMap/Lib';
import {container} from 'tsyringe';
import {FigureMapExtractor} from '../../../../Extractor/FigureMapExtractor';

export interface IFigureMapListMessage {
    libs: Lib[];
}

export class FigureMapListComposer extends Outgoing<IFigureMapListMessage> {
    private _libs: Lib[];

    constructor(libs: Lib[]) {
        super(OutgoingHeader.FIGUREMAPLIST);

        this._libs = libs;
    }

    public process() {
        this._data = {
            libs: container.resolve(FigureMapExtractor).libs
        };
    }
}