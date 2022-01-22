import { IFigureMapListMessage } from '../../../../../../../../Server/src/Network/Outgoing/Figure/FigureMap/FigureMapListComposer';
import { Incoming } from '../../Incoming';
import { Store } from '../../../../../Store';

export class FigureMapIncoming extends Incoming<IFigureMapListMessage> {
    public process() {
        Store.commit('figureModule/SET_LIBS', this.packet.libs);
    }
}
