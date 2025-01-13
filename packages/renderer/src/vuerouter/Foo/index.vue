<template>
  <div>Foo</div>
</template>

<script lang="ts">
import { SetupContext, onMounted } from "vue"

export default {
  name: "Foo",
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
