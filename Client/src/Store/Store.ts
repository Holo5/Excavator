import Vue from "vue";
import Vuex from "vuex";
import {WebSocketModule} from './Modules/WebSocket/WebSocketModule';
import {FigureModule} from './Modules/Figure/FigureModule';

Vue.use(Vuex);

export const Store = new Vuex.Store({
    modules: {
        webSocket: WebSocketModule,
        figureModule: FigureModule
    }
});