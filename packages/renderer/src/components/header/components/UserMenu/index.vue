<template>
    <div id="user-menu" class="select-menu">
        <n-popover
            placement="left-start"
            :style="popOverStyle"
            :show-arrow="false"
            trigger="click"
        >
            <template #trigger>
                <div class="menu-item">
                {{ t("language") }}
                </div>
            </template>
            <template #default>
                <div>
                    <div class="select-menu sub-menu">
                    <div
                        class="menu-item"
                        @click="() => { Locale.methods.switchTo('en-us'); close() }"
                    >
                        {{ "English" }}
                    </div>
                    <div
                        class="menu-item"
                        @click="() => { Locale.methods.switchTo('zh-cn'); close() }"
                    >
                        {{ "中文" }}
                    </div>                             -->
                    </div>
                    
                </div>
            </template>
        </n-popover>
    </div>
</template>

<script lang="ts">
import { SetupContext, ref } from "vue"
import { t, Locale, Theme, OpenLocal, UI } from "@/components/index"

export default {
    name: "UserMenu",

    components: { },

    emit: ["onClose"],

    setup(props: any, context: SetupContext) {

        const popOverStyle = ref({
            "padding": 0,
            "background-color": "transparent",
            "box-shadow": "none"
        });

        function close() {
            context.emit("onClose");
        }

        return {
            t,
            Locale,
            Theme,
            OpenLocal,
            UI,

            popOverStyle,
            close,
        }
    }
}
</script>

<style lang="scss" scoped>
@import "./local.scss";
@import "@/common/styles/elementPlusDefault.scss";
</style>