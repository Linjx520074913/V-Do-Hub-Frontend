<template>
  <div>
    Gallery
    <el-button type="text" @click="click">点击打开 Dialog</el-button>

    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible"
      width="30%"
      center
    >
      <span>需要注意的是内容是默认不居中的</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="centerDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { SetupContext, onMounted, ref } from "vue";
import { Props } from "@/common/export/interface";

export default {
  name: "Gallery",
  props: {},

  emits: [],
  components: {},

  setup(props: Props<any>, context: SetupContext) {
    const centerDialogVisible = ref(false);
    function click() {
      console.log("ffff");
      centerDialogVisible.value = true;
    }
    return { centerDialogVisible, click };
  },
};
</script>
<style lang="scss" scoped>
@import "./local.scss";
</style>
