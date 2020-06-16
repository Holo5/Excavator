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

    constructor(libs: Lib[] = undefined) {
        super(OutgoingHeader.FIGUREMAPLIST);

        if(libs !== undefined) {
            this._libs = libs;
        } else {
            this._libs = container.resolve(FigureMapExtractor).libs
        }
    }

    public process() {
        this._data = {
            libs: container.resolve(FigureMapExtractor).libs
        };
    }
}