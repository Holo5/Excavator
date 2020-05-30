<template>
    <perfect-scrollbar class="card-list">
        <slot></slot>
    </perfect-scrollbar>
</template>

<script lang="ts">
    import Vue from 'vue';
    import {PerfectScrollbar} from 'vue2-perfect-scrollbar';

    export default Vue.extend({
        name: 'CardList',
        components: {
            PerfectScrollbar
        }
    });
</script>

<style lang="scss" scoped>
    .card-list {
        height: 300px;
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 5px;
    }
</style>