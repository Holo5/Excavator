<template>
    <div id="header">
        <img id="logo" src="../../../assets/images/excavator_logo.png">
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
        name: 'HeaderTop'
    });
</script>

<style lang="scss" scoped>
    #header {
        display: flex;
        height: 110px;
        justify-content: flex-end;
        align-items: flex-end;

        #logo {
            transition: 0.3s ease;
            cursor: pointer;
            margin-bottom: 5px;

            &:hover {
                margin-bottom: 10px;
            }
        }
    }
</style>