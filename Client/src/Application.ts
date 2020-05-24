import Vue from 'vue';
import {Store} from './Store/Store';
//@ts-ignore
import Excavator from './Excavator.vue';

export class Application {
    private app: Vue;

    public init() {
        this.app = new Vue({
            el: '#app',
            template: '<excavator></excavator>',
            components: {
                excavator: Excavator,
            },
            store: Store,
        });
    }
}

let app = new Application();
app.init();