<template>
    <div id="progress-box">
        <div class="rotatable-icon">
            <span class="icon-spinner" />
        </div>
        <div>
            {{  message }}
        </div>
        <div v-show="enableProgress">
            {{ progress }}%
        </div>
        ...
    </div>
</template>

<script lang="ts">
import { SetupContext, toRefs, ref, onMounted, computed } from "vue";
import { Props } from "@/common/export/interface";


export default {
    name: "ObProgress",

    props: {
        message: {
            type: String,
            default: ""
        },

        progress: {
            type: Number,
            default: 0
        },

        enableProgress: {
            type: Boolean,
            default: true
        }
    },

    emits: [],


    setup(props: Props<any>, context: SetupContext) {
        const {
            message,
            progress,
            enableProgress
        } = toRefs(props);

        return {
            message,
            progress,
            enableProgress
        }

    }

}
</script>

<style lang="scss" scoped>
@import "./local.scss";
@import "@/common/styles/elementPlusDefault.scss";
</style>