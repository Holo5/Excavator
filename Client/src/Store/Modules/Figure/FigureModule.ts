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
            state.libs = libs;
        },
        SET_EXTRACTION_STATUS_CHANGE: (state: IStateInterface, lib: Lib) => {
            let currentLibs = state.libs.find(currentLib => currentLib.id === lib.id);
            if(currentLibs !== undefined) {
                currentLibs.extractionState = lib.extractionState;
            } else {
                state.libs.push(lib);
            }
        }
    }
};
