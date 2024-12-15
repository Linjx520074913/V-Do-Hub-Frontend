<template>
  <div class="account">
    <p id="dropdown-trigger" class="w-10">账户</p>
    <ul id="dropdown-menu" class="hidden">
        <li v-for="(item, index) in items" :key="index" @click="item.click">
            {{ item.text }}
        </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { onMounted, SetupContext, toRefs, ref } from "vue";

export default {
  name: "ObDropdownMenu",

  props: {
    text: {
      type: String,
    },
    items:{
        type: Array,
        required: true
    }
  },

  emits: [],

  setup(props: any, context: SetupContext) {
    const { items } = toRefs(props);
    // const items = ref([
    //     { text: '设置', click: () => { console.log('设置') } },
    //     { text: '登出', click: () => { console.log('登出') } }
    // ])
    onMounted(() => {
        const trigger = document.getElementById("dropdown-trigger") as any;
        const menu = document.getElementById("dropdown-menu") as any;

        trigger.addEventListener("click", function (event: any) {
            event.stopPropagation(); // 阻止事件冒泡
            menu.classList.toggle("hidden");
        });

        // 点击其他地方关闭菜单
        document.addEventListener("click", function () {
            menu.classList.add("hidden");
        });
    })

    return { items }
  },
};
</script>

<style lang="scss" scoped>
@import "./local.scss";
.account {
    height: 100%;
    position: relative;
}

#dropdown-menu {
  position: absolute;
  top: 100%;
  left: auto;
  right: 0;
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
