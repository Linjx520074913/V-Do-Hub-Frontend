<template>
  <div>Bar</div>
</template>

<script lang="ts">
import { SetupContext, onMounted } from "vue"

export default {
  name: "Bar",
  props: {},

  emits: [],
  components: {},

  setup(props: any, context: SetupContext) {
    return {};
  },
};
</script>
<style lang="scss" scoped>
@import "./local.scss";
</style>
