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
                    </div>       
                    <!-- <div
                        class="menu-item"
                        @click="() => { Locale.switchTo('de-de'); close() }"
                    >
                        {{ "Deutsch" }}
                    </div>    -->
                    <!-- <div
                        class="menu-item"
                        @click="() => { Locale.methods.switchTo('ja-jp'); close() }"
                    >
                        {{ "日本語" }}
                    </div>  -->
                    <!-- <div
                        class="menu-item"
                        @click="() => { Locale.switchTo('es-es'); close() }"
                    >
                        {{ "español" }}
                    </div>    
                    <div
                        class="menu-item"
                        @click="() => { Locale.switchTo('pt-br'); close() }"
                    >
                        {{ "Português" }}
                    </div>                               -->
                    </div>
                    
                </div>
            </template>
        </n-popover>
        <!-- <div class="dot-btn-group">
            <div>
                <span class="icon-wiki" />
            </div>
            <div>  
                <span class="icon-tutorial" />
            </div>
            <div>  
                <span class="icon-community" /> 
            </div>
            <div>  
                <span class="icon-support" />
            </div>
        </div> -->
    </div>
</template>

<script lang="ts">
import { SetupContext, toRefs, ref, reactive, computed } from "vue";
import { Props } from "@/common/export/interface";
import { t, Locale, Theme, OpenLocal, ExternalLink, UI } from "@/components/index";

export default {
    name: "UserMenu",

    components: { },

    emit: ["onClose"],

    setup(props: Props<any>, context: SetupContext) {

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
          ExternalLink,
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