<template>
    <div id="excavator">
        <panels></panels>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Panels from './Components/Panels.vue';

    export default Vue.extend({
        name: 'Excavator',
        components: {
            Panels
        },
        mounted() {
            this.$store.dispatch('webSocket/registerPackets');
            this.$store.dispatch('webSocket/connect');
        }
    });
</script>

<style lang="scss">
    @import "~mixins";
    @import "~perfect-scrollbar";

    #excavator {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        background: top left url("../assets/images/habbobg.png");
        width: 100%;
        height: 100%;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    }
</style>