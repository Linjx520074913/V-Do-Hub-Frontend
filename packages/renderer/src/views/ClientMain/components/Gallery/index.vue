<template>
  <div>Gallery</div>
</template>

<script lang="ts">
import { SetupContext, onMounted } from "vue";
import { Props } from "@/common/export/interface";

export default {
  name: "Gallery",
  props: {},

  emits: [],
  components: {},

  setup(props: Props<any>, context: SetupContext) {
    return {};
  },
};
</script>
<style lang="scss" scoped>
@import "./local.scss";
</style>
