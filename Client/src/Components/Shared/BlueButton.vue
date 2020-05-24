<template>
    <button @click="click" class="blue-button">
        <slot></slot>
    </button>
</template>

<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
        name: 'BlueButton',
        methods: {
            click() {
                this.$emit('click');
            }
        }
    });
</script>

<style lang="scss" scoped>
    .blue-button {
        font-size: 13px;
        padding: 15px 20px;
        letter-spacing: 1.33px;
        cursor: pointer;
        color: #fff;
        border: 2px solid #3b5998;
        background-color: #3b5998;
        transition: 0.4s ease;

        &:active {
            background-color: #2f4779;
        }

        &:focus {
            outline: none;
        }
    }
</style>