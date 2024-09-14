<template>
  <div class="ob-button" @click="handleClick">
    <span :class="icon" />
    {{ text }}
  </div>
</template>

<script lang="ts">
import { SetupContext, toRefs, ref, onMounted, computed } from "vue";
import { Props } from "@/common/export/interface";

export default {
  name: "ObButton",

  props: {
    text: {
      type: String,
    },
    icon: {
      type: String,
    },
    click: {
      type: Function,
    },
  },

  emits: ["update:target", "change"],

  setup(props: Props<any>, context: SetupContext) {
    const { text, icon, click } = toRefs(props);

    function handleClick() {
      if (click && click.value) {
        click.value();
      }
    }
    // function toggleSwitch(): void {
    //   context.emit("update:target", !target.value);
    //   context.emit("change", !target.value);
    //   console.log(!target.value);
    // }

    return {
      handleClick,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "./local.scss";
</style>
