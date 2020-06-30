import Vue from 'vue';
import PerfectScrollbar from 'vue2-perfect-scrollbar';
import { Store } from './Store/Store';
import Excavator from './Excavator.vue';

export class Application {
    private app: Vue;

    public init() {
        Vue.use(PerfectScrollbar);

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

const app = new Application();
app.init();
