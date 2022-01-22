import { FigureModule } from './Modules/Figure/FigureModule';
import { WebSocketModule } from './Modules/WebSocket/WebSocketModule';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const Store = new Vuex.Store({
    modules: {
        webSocket: WebSocketModule,
        figureModule: FigureModule,
    },
});
