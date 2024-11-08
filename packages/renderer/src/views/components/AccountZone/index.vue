<template>
  <div class="p-5 flex-1">
    <MemberShip/>
  </div>
</template>

<script lang="ts">
import { SetupContext } from "vue"
import MemberShip from './MemberShip/index.vue'

export default {
  name: "AccountZone",
  props: {},

  emits: [],
  components: { MemberShip },

  setup(props: any, context: SetupContext) {
    return {};
  },
};
</script>
<style lang="scss" scoped>
@import "./local.scss";
</style>
