import Vue from "vue";
import Vuex from "vuex";
import {FurniExcavatorModule} from './Modules/FurniExcavatorModule';

Vue.use(Vuex);

export const Store = new Vuex.Store({
    modules: {
        furniExcavator: FurniExcavatorModule
    }
});