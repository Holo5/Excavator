import {Module} from 'vuex';
import {Configuration} from '../../../Configuration';
import {Outgoing} from '../../../../../Server/src/Network/Outgoing/Outgoing';
import {OutgoingHeader} from '../../../../../Server/src/Network/Outgoing/OutgoingHeader';
import {FigureMapIncoming} from './Incoming/Figure/FigureMap/FigureMapIncoming';
import {Incoming} from './Incoming/Incoming';
import {LibExtractionStateChangeIncoming} from "./Incoming/Figure/FigureMap/LibExtractionStateChangeIncoming";

interface IStateInterface {
    socket: WebSocket
    handlers: { header: number | string, handler: typeof Outgoing }[]
}

interface HandlerData {
    header: number,
    handler: typeof Outgoing
}

export const WebSocketModule: Module<IStateInterface, any> = {
    namespaced: true,
    state: {
        socket: undefined,
        handlers: []
    },
    mutations: {},
    getters: {},
    actions: {
        registerPackets: ({state, dispatch}) => {
            dispatch('addHandler', {header: OutgoingHeader.FIGUREMAP_LIST, handler: FigureMapIncoming});
            dispatch('addHandler', {header: OutgoingHeader.LIB_EXTRACTION_STATE_CHANGED, handler: LibExtractionStateChangeIncoming});
        },
        connect: ({state, dispatch}) => {
            state.socket = new WebSocket(Configuration.serverAdress);
            state.socket.onopen = () => { console.log('Connected !'); };
            state.socket.onclose = () => {
                console.log('Closed !');
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            };

            state.socket.onmessage = async (messageEvent: MessageEvent) => {
                let packet = JSON.parse(messageEvent.data);
                let handler = await dispatch('getHandler', packet.header);
                if (handler !== undefined) {
                    let handlerIncoming: Incoming<any> = new handler();
                    handlerIncoming.setPacket(packet.data).process();
                }
            };
        },
        addHandler: ({state}, handlerData: HandlerData) => {
            const totalHandlers = state.handlers.length;
            handlerData.header = (handlerData.header.toString() as any);

            for (let i = 0; i < totalHandlers; i++) {
                const existing = state.handlers[i];
                if (existing.header === handlerData.header) {
                    state.handlers.splice(i, 1);

                    break;
                }
            }

            state.handlers.push({header: handlerData.header, handler: handlerData.handler});
        },
        getHandler: ({state}, header: number) => {
            let handler: typeof Outgoing = null;
            let totalHandlers = state.handlers.length;

            for (let i = 0; i < totalHandlers; i++) {
                const existing = state.handlers[i];
                if (existing.header === header.toString()) {
                    handler = existing.handler;
                    break;
                }
            }

            return handler;
        }
    }
};
