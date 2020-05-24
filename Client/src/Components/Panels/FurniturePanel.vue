<template>
    <div id="furniture-panel">
        <green-button>Validate</green-button>
        <blue-button>COU</blue-button>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import GreenButton from '../Shared/GreenButton.vue';
    import BlueButton from '../Shared/BlueButton.vue';

    export default Vue.extend({
        name: 'FurniturePanel',
        components: {
            GreenButton,
            BlueButton,
        }
    });
</script>

<style lang="scss" scoped>
    #furniture-panel {
        color: #333333;
        width: 600px;
        min-height: 100%;
        padding: 5px;
        background: #EEEEEE 0px 0px url("../../../assets/images/furni_background.png");
        border-radius: 0px 5px 5px 0px;
        animation: animation 200s linear infinite;
    }

    @keyframes animation {
        100%{
            background-position: 1000px -1000px;
        }
    }
</style>