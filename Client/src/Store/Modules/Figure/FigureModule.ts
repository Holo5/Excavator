import {Module} from "vuex";
import {Lib} from '../../../../../Server/src/Domain/FigureMap/Lib';

interface IStateInterface {
    libs: Lib[]
}

export const FigureModule: Module<IStateInterface, any> = {
    namespaced: true,
    state: {
        libs: []
    },
    mutations: {
        SET_LIBS: (state, libs: Lib[]) => {
            console.log(state.libs);
            state.libs = libs;
        }
    }
};
