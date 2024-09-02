<template>
    <div id="float-window-template">
        <!-- Header Bar -->
        <div
            id="float-background"
            :class="{ 'backdrop-blur': enableBlur }"
            @click.stop="hideFloatWindow"
        />

        <!-- Main Switchable Section -->
        <div id="float-main__center">
            <slot name="center" />
        </div>

        <div id="float-main__center-bottom">
            <slot name="center-bottom" />
        </div>

        <div id="float-main__top-right" :style="{'right': topRightRight}">
            <slot name="top-right" />
        </div>
    </div>
</template>

<script lang='ts'>
import { SetupContext, toRefs } from 'vue';
import { Props } from "@/common/export/interface";

export default {
    name: 'FloatWindowTemplate',

    emits: ["onHide"],

    props: {
        enableBlur: {
            type: Boolean,
            default: true,
        },
        
        topRightRight: {
            type: String,
            default: "110px",
        }
    },

    setup(props: Props<any>, context: SetupContext) {

        const { enableBlur, topRightRight } = toRefs(props);

        function hideFloatWindow(): void {
            context.emit("onHide");
        };

        return {
            hideFloatWindow,
            enableBlur,
            topRightRight,
        }
    }

}
</script>

<style lang='scss' scoped>
@import './local.scss';
</style>