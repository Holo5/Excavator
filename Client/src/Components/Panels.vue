<template>
    <div id="panels">
        <header-top></header-top>
        <div id="excavators">
            <figure-panel></figure-panel>
            <furniture-panel></furniture-panel>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import FigurePanel from './Panels/FigurePanel.vue';
    import FurniturePanel from './Panels/FurniturePanel.vue';
    import HeaderTop from './Panels/HeaderTop.vue';
    export default Vue.extend({
        name: 'Panels',
        components: {
            HeaderTop,
            FigurePanel,
            FurniturePanel,
        }
    });
</script>

<style lang="scss" scoped>
    #panels {
        display: flex;
        flex-direction: column;
        width: 1002px;

        #excavators {
            display: flex;
            flex-direction: row;
            height: 500px;
        }
    }
</style>