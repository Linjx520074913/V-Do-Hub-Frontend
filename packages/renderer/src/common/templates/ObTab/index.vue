<template>
  <div class="obtab-root">
    <div class="obtab-menu">
      <div v-for="item in options"
        :class="['obtab-menu-item', selected.id == item.id? 'obtab-menu-item-selected': '']"
        @click="AcitveItem(item)">
        {{  item.title }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { SetupContext, toRefs, ref } from "vue";

export default {
  name: "ObTab",

  props: {
    options:{
      type: Array
    }
  },

  setup(props: any, context: SetupContext) {
    const { options } = toRefs(props);
   
    const selected = ref(options.value[0]);

    function AcitveItem(item: any){
      selected.value = item;
    }
    return {
      selected,
      AcitveItem
    };
  },
};
</script>

<style lang="scss" scoped>
@import "./local.scss";
</style>
