<template>
    <button @click="click" class="green-button">
        <slot></slot>
    </button>
</template>

<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
        name: 'GreenButton',
        methods: {
            click() {
                this.$emit('click');
            }
        }
    });
</script>

<style lang="scss" scoped>
    .green-button {
        font-size: 13px;
        padding: 15px 20px;
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