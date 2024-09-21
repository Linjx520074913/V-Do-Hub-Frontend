<template>
  <div
    class="ob-button-switch-main"
    :class="{ 'button-active': target }"
    @click="toggleSwitch()"
  >
    <div>
      <slot name="default" />
    </div>
  </div>
</template>

<script lang="ts">
import { SetupContext, toRefs, ref, onMounted, computed } from "vue";
import { Props } from "@/common/export/interface";

export default {
  name: "OBSwitch",

  props: {
    target: {
      type: Boolean,
    },
  },

  emits: ["update:target", "change"],

  setup(props: Props<any>, context: SetupContext) {
    const { target } = toRefs<Props<boolean>>(props);

    function toggleSwitch(): void {
      context.emit("update:target", !target.value);
      context.emit("change", !target.value);
      console.log(!target.value);
    }

    return {
      target,
      toggleSwitch,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "./local.scss";
</style>
