<template>
  <div id="client">
    <Header class="header header-bg dragable" />
    <div id="app-main">
      <ClientMain />
    </div>
    <Footer class="footer" />
  </div>
</template>

<script>
import Header from "@components/header/index.vue";
import Footer from "@components/footer/index.vue";
import { init } from "@components/index";
import { mount } from "./index";

import { ClientMain } from "@/views/index";

export default {
  name: "Main",

  components: { Header, Footer, ClientMain },

  setup() {
    init();
    mount();
    return {};
  },
};
</script>
<style lang="scss">
@import "./index.scss";
</style>
