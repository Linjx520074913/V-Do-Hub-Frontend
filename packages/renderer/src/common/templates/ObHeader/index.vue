<template>
    <div id="message-header">
        <div id="header-title">
            {{ title }}
        </div>

        <!-- win32 control -->
        <div
            v-if="showWin32Control"
            id="win32-control"
            class="header-control"
            
        >
            <button
                v-show="crossEnabled"
                class="button-style--text--normal"
                @click="crossAction()"
            >
                <span class="icon-close" />
            </button>
        </div>

        <!-- darwin control -->
        <div
            v-if="showDarwinControl"
            id="darwin-control"
            class="header-control"
        >
            <button
                v-show="crossEnabled"
                class="traffic-light__red"
                @click="crossAction()"
            >
                <span class="icon-close" />
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { SetupContext, toRefs, computed } from "vue"

export default {
    name: "ObHeader",

    props: {
        crossEnabled: {
            type: Boolean,
            default: false
        },

        title: {
            type: String,
            default: ""
        },

        platform: {
            type: String,
            default: "win32"
        }
    },

    emits: ["onCross"],


    setup(props: any, context: SetupContext) {
        const {
            crossEnabled,
            title,
            platform
        } = toRefs(props);

        const showWin32Control = computed((): boolean => {
            return (
                "win32" == platform.value
                && crossEnabled.value
            )
        });

        const showDarwinControl = computed((): boolean => {
            return (
                "darwin" == platform.value
                && crossEnabled.value
            )
        })


        function crossAction(): void {
            context.emit("onCross");
        }


        return {
            crossEnabled,
            title,
            platform,

            showWin32Control,
            showDarwinControl,

            crossAction,
        }

    }

}
</script>

<style lang="scss" scoped>
@import "./local.scss";
// @import "@/common/styles/elementPlusDefault.scss";
</style>