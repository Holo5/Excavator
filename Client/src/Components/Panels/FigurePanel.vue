<template>
    <div id="figure-panel">
        OK
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
        name: 'FigurePanel'
    });
</script>

<style lang="scss" scoped>
    #figure-panel {
        width: 400px;
        min-height: 100%;
        padding: 5px;
        background: rgb(11, 99, 149) bottom left url("../../../assets/images/clothing_outfit_background.png") repeat-x;
        color: white;
        border-right: 2px solid rgba(9, 74, 112);
        border-radius: 5px 0px 0px 5px;
        animation: animation 100s linear infinite;
    }

    @keyframes animation {
        100%{
            background-position-x: -1000px;
        }
    }
</style>