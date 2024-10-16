<template>
  <div>
    HelloWorld
  </div>
</template>

<script lang="ts">
import { SetupContext, toRefs, ref, onMounted, computed } from "vue";
import { Props } from "@/common/export/interface";

export default {
  name: "ObCard",

  props: {
    options:{
      type: Array
    }
  },

  setup(props: Props<any>, context: SetupContext) {
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
