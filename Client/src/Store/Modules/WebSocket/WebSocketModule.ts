import { Module } from 'vuex';
import { Configuration } from '../../../../../Server/Config';
import { Outgoing } from '../../../../../Server/src/Network/Outgoing/Outgoing';
import { OutgoingHeader } from '../../../../../Server/src/Network/Outgoing/OutgoingHeader';
import { FigureMapIncoming } from './Incoming/Figure/FigureMap/FigureMapIncoming';
import { Incoming } from './Incoming/Incoming';
import { LibExtractionStateChangeIncoming } from './Incoming/Figure/FigureMap/LibExtractionStateChangeIncoming';

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
    handlers: [],
  },
  mutations: {},
  getters: {},
  actions: {
    registerPackets: ({ dispatch }) => {
      dispatch('addHandler', { header: OutgoingHeader.FIGUREMAPLIST, handler: FigureMapIncoming });
      dispatch('addHandler', { header: OutgoingHeader.LIB_EXTRACTION_STATE_CHANGED, handler: LibExtractionStateChangeIncoming });
    },
    connect: ({ state, dispatch }) => {
      const currentState = state;
      currentState.socket = new WebSocket(Configuration.serverAdress);
      currentState.socket.onopen = () => { console.log('Connected !'); };
      currentState.socket.onclose = () => {
        console.log('Closed !');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      };
      currentState.socket.onmessage = async (messageEvent: MessageEvent) => {
        const packet = JSON.parse(messageEvent.data);
        const Handler = await dispatch('getHandler', packet.header);
        if (Handler !== undefined) {
          const handlerIncoming: Incoming<any> = new Handler();
          handlerIncoming.setPacket(packet.data).process();
        }
      };
    },
    addHandler: ({ state }, handlerData: HandlerData) => {
      const totalHandlers = state.handlers.length;
      const currentHandlerData = handlerData;
      currentHandlerData.header = (handlerData.header.toString() as any);

      for (let i = 0; i < totalHandlers; i++) {
        const existing = state.handlers[i];
        if (existing.header === currentHandlerData.header) {
          state.handlers.splice(i, 1);
          break;
        }
      }

      state.handlers.push({ header: currentHandlerData.header, handler: currentHandlerData.handler });
    },
    getHandler: ({ state }, header: number) => {
      let handler: typeof Outgoing = null;
      const totalHandlers = state.handlers.length;

      for (let i = 0; i < totalHandlers; i++) {
        const existing = state.handlers[i];
        if (existing.header === header.toString()) {
          handler = existing.handler;
          break;
        }
      }

      return handler;
    },
  },
};
