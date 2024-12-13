<template>
  <div class="account">
    <p id="dropdown-trigger">Test</p>
        <ul id="dropdown-menu" class="hidden">
            <li><a href="#">设置项 1</a></li>
            <li><a href="#">设置项 2</a></li>
            <li><a href="#">设置项 3</a></li>
        </ul>
  </div>
</template>

<script lang="ts">
import { SetupContext, toRefs } from "vue";

export default {
  name: "ObDropdownMenu",

  props: {
    text: {
      type: String,
    }
  },

  emits: [],

  setup(props: any, context: SetupContext) {
    document.addEventListener("DOMContentLoaded", function () {
        console.log('aaaaaaa')
        const trigger = document.getElementById("dropdown-trigger") as any;
        const menu = document.getElementById("dropdown-menu") as any;

        trigger.addEventListener("click", function (event: any) {
            console.log('FADFASDf')
            event.stopPropagation(); // 阻止事件冒泡
            menu.classList.toggle("hidden");
        });

        // 点击其他地方关闭菜单
        document.addEventListener("click", function () {
            menu.classList.add("hidden");
        });
    });

    return {
    };
  },
};
</script>

<style lang="scss" scoped>
@import "./local.scss";
.account {
    width: 100%;
    height: 100%;
  position: relative;
  display: inline-block;
}

#dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  list-style: none;
  margin: 0;
  padding: 0;
  min-width: 150px;
  z-index: 1000;
}

#dropdown-menu li {
  padding: 10px;
  cursor: pointer;
}

#dropdown-menu li:hover {
  background-color: #f5f5f5;
}

.hidden {
  display: none;
}
</style>
