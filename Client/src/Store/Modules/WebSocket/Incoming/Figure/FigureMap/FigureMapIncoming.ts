import { Incoming } from '../../Incoming';
import { IFigureMapListMessage } from '../../../../../../../../Server/src/Network/Outgoing/Figure/FigureMap/FigureMapListComposer';
import { Store } from '../../../../../Store';

export class FigureMapIncoming extends Incoming<IFigureMapListMessage> {
  public process() {
    Store.commit('figureModule/SET_LIBS', this.packet.libs);
  }
}
