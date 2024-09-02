<template>
  <div class="home-page-root">
    <div class="left">
      <div class="camera-container">
        <img class="camera" />
        <hr class="white-line" />
        <div>
          <el-button type="primary">录像</el-button>
          <el-button type="primary">拍照</el-button>
        </div>
      </div>
      <div class="motor"></div>
    </div>
    <div class="middle">
      <img class="wafer" />
    </div>
    <div class="right"></div>
    <!-- <ObPlayer class="player" ref="player" />
    <el-button type="primary" @click="AutoFocus">AutoFocus</el-button>
    <el-button type="primary" @click="Capture">Capture</el-button>
    <el-button type="primary" @click="Record">Record</el-button>

    <div style="margin-top: 30px">
      <el-button type="primary" @click="GoHome">GoHome</el-button>
      <el-button type="primary" @click="MoveAbsolute">MoveAbsolute</el-button>
      <el-button type="primary" @click="MoveRelative">MoveRelative</el-button>
    </div>

    <p>{{ infomation0 }}</p>
    <p>{{ infomation1 }}</p> -->
  </div>
</template>

<script lang="ts">
import { SetupContext, onMounted } from "vue";
import { FloatWindowTemplate, ObMessage, ObProgress } from "@/common/templates";
import { t } from "@/components/index";
import { Props } from "@/common/export/interface";

import {
  AutoFocus,
  Capture,
  Record,
  player,
  GoHome,
  MoveAbsolute,
  MoveRelative,
  infomation0,
  infomation1,
} from "./index";
import { ObPlayer } from "ob-xw-common";

export default {
  name: "HomePage",
  props: {},

  emits: [],
  components: {
    FloatWindowTemplate,
    ObMessage,
    ObProgress,
    ObPlayer,
  },

  setup(props: Props<any>, context: SetupContext) {
    return {
      t,
      FloatWindowTemplate,
      ObMessage,
      AutoFocus,
      Capture,
      Record,
      player,
      GoHome,
      MoveAbsolute,
      MoveRelative,
      infomation0,
      infomation1,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "./local.scss";
</style>
