<template>
    <div class="figure-card">
        <div class="name">
            <slot></slot>
        </div>
        <div class="actions">
            <little-green-button>S</little-green-button>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import LittleGreenButton from '../LittleGreenButton.vue';

    export default Vue.extend({
        name: 'FigureCard',
        components: {
            LittleGreenButton
        }
    });
</script>

<style lang="scss" scoped>
    .figure-card {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        font-weight: 300;
        padding: 10px 5px;
        margin: 10px;
        border-radius: 5px;
        background-color: #EEE;
        color: #333333;

        &:hover {
            background-color: white;
            animation: animate 2s linear infinite;
        }
    }

    @keyframes animate {
        0% {
            box-shadow: 0px 0px 0px 0px rgba(255, 255, 255, .4)
        }
        40% {
            box-shadow: 0px 0px 0px 6px rgba(255, 255, 255, 0)
        }
        80% {
            box-shadow: 0px 0px 0px 6px rgba(255, 255, 255, 0)
        }
        100% {
            box-shadow: 0px 0px 0px 0px rgba(255, 255, 255, 0)
        }
    }
</style>