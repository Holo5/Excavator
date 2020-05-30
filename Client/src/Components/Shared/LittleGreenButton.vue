<template>
    <button @click="click" class="little-green-button">
        <slot></slot>
    </button>
</template>

<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
        name: 'LittleGreenButton',
        methods: {
            click() {
                this.$emit('click');
            }
        }
    });
</script>

<style lang="scss" scoped>
    .little-green-button {
        font-size: 13px;
        padding: 5px 10px;
        letter-spacing: 1.33px;
        cursor: pointer;
        color: #fff;
        border: 2px solid #96c11c;
        background-color: #96c11c;
        transition: 0.4s ease;

        &:active {
            background-color: #7ba218;
        }

        &:focus {
            outline: none;
        }
    }
</style>