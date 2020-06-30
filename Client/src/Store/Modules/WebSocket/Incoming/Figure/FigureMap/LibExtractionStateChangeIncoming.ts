import { Incoming } from '../../Incoming';
import { ILibExtractionStateChangeMessage } from '../../../../../../../../Server/src/Network/Outgoing/Figure/FigureMap/LibExtractionStateChangeComposer';
import { Store } from '../../../../../Store';

export class LibExtractionStateChangeIncoming extends Incoming<ILibExtractionStateChangeMessage> {
    public process() {
        Store.commit('figureModule/SET_EXTRACTION_STATUS_CHANGE', this.packet.lib);
    }
}
