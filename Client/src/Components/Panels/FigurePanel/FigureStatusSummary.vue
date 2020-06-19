<template>
    <div id="figure-status-summary">
        <div class="rounded-labels">
            &#8987; Waiting: {{ libs.length }}
        </div>
        <div class="rounded-labels">
            &#9997; Extracting: 0
        </div>
        <div class="rounded-labels">
            &#9889; Extracted: 0
        </div>
    </div>
</template>

<script lang="ts">
  import Vue from "vue";
  import {mapState} from "vuex";

  export default Vue.extend({
    name: "FigureStatusSummary",
    computed: {
      ...mapState('figureModule', ['libs'])
    }
  });
</script>

<style lang="scss" scoped>
    #figure-status-summary {
        margin-top: 5px;
        font-size: 10px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        .rounded-labels {
            padding: 5px;
            border-radius: 5px;
            background-color: rgba(0, 0, 0, 0.4);
        }
    }
</style>
