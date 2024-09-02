<template>
    <div id="message-box" ref="messageBoxRef">
        <div
            v-show="'' != title || crossEnabled"
            id="message-header"
        >
                <!-- <div v-show="'' != title">
                    {{ title }}
                </div>
                <button
                    v-show="crossEnabled"
                    class="button-style--text--normal"
                    @click="cancelAction()"
                >
                    <span class="icon-close" />
                </button> -->
                <ObHeader
                    :cross-enabled="crossEnabled"
                    :title="title"
                    :platform="platform"
                    @onCross="cancelAction()"
                />
        </div>
        <div>
            <div
                v-if="'' != message"
                :id="smallText ? 'message-small' : 'message'"
            >
                {{ message }}
            </div>
            <slot name="main" />
        </div>
        <div
            id="control-area"
            v-show="!disableControl"
        >
                <button
                    class="button-style--theme--brighter button--normal"
                    @click="confirmAction()"
                >
                    {{ confirmText }}
                </button>
                <button
                    v-if="!confirmOnly"
                    class="button-style--theme--normal button--normal"
                    @click="cancelAction()"
                >
                    {{ cancelText }}
                </button>
        </div>

        <div id="augment-line">
            <slot name="augment-line" />
        </div>
    </div>
</template>

<script lang="ts">
import { SetupContext, toRefs, ref, onMounted, computed } from "vue";
import { Props } from "@/common/export/interface";
import { ObHeader } from "../index";


export default {
    name: "ObMessage",

    components: { ObHeader },

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
        },

        message: {
            type: String,
            default: "",
        },

        confirmText: {
            type: String,
            default: "Confirm",
        },

        cancelText: {
            type: String,
            default: "Cancel"
        },

        disableControl: {
            type: Boolean,
            default: false
        },

        confirmOnly: {
            type: Boolean,
            default: false,
        },

        smallText: {
            type: Boolean,
            default: false,
        },

        minWidth: {
            type: String,
            default: "349px"
        }
    },

    emits: ["onCancel", "onConfirm"],


    setup(props: Props<any>, context: SetupContext) {
        const {
            crossEnabled,
            title,
            platform,
            message,
            confirmText,
            cancelText,
            disableControl,
            confirmOnly,
            smallText,
            minWidth
        } = toRefs(props);

        const messageBoxRef = ref(null);

        function confirmAction(): void {
            context.emit("onConfirm");
        }

        function cancelAction(): void {
            context.emit("onCancel");
        }

        onMounted(() => {
            if (messageBoxRef.value) {
                (messageBoxRef.value as HTMLElement).style.minWidth = minWidth.value;
            }
        })

        return {
            messageBoxRef,
            
            crossEnabled,
            title,
            platform,
            message,
            confirmText,
            cancelText,
            disableControl,
            confirmOnly,
            smallText,

            confirmAction,
            cancelAction
        }

    }

}
</script>

<style lang="scss" scoped>
@import "./local.scss";
@import "@/common/styles/elementPlusDefault.scss";
</style>