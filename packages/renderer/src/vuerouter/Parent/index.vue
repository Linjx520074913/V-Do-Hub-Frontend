<template>
    <div>
        Parent
        <ul>
        <li><router-link to="foo">/foo</router-link></li>
        <li><router-link to="bar">/bar</router-link></li>
        </ul>
        <router-view/>
    </div>    
</template>

<script lang="ts">
import { SetupContext, onMounted } from "vue"
import Foo from '../Foo/index.vue'
import Bar from '../Bar/index.vue'

export default {
  name: "Parent",
  props: {},

  emits: [],
  components: { Foo, Bar },

  setup(props: any, context: SetupContext) {
    return {};
  },
};
</script>
<style lang="scss" scoped>
@import "./local.scss";
</style>
