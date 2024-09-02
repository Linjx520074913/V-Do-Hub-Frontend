<template>
  <div :id="id" class="pointcloudview"></div>
</template>

<style lang="scss" scoped>
@import "./index.scss";
</style>

<script>
import elementResizeDetectorMaker from "element-resize-detector";
import { PCLPlayer, PointCloudType, ToolMode, SelectionMode } from "./player";
import { v4 as uuidv4 } from "uuid";
import { onMounted, onUnmounted, watch } from "vue";

export default {
  name: "ObScanner",
  emits: ["pointsNumChanged", "facesNumChanged"],
  setup(_, { emit }) {
    var player;

    const id = "pointcloudview-" + uuidv4();

    onMounted(() => {
      const canvas = document.getElementById(id);
      // initRenderContext(canvas);
      if (canvas != undefined) {
        player = new PCLPlayer(canvas);
      }

      let resizer = elementResizeDetectorMaker();

      resizer.listenTo(canvas, function (element) {
        var width = element.offsetWidth;
        var height = element.offsetHeight;
        player.resize(width, height);
      });

      watch(
        () => player.editor.pointsNum.value,
        (value) => {
          emit("pointsNumChanged", value);
        },
        { deep: true }
      );
      watch(
        () => player.editor.facesNum.value,
        (value) => {
          emit("facesNumChanged", value);
        },
        { deep: true }
      );
    });

    onUnmounted(() => {
      if (player) {
        player.free();
      }
    });

    function reset() {
      if (player) {
        player.reset();
      }
    }

    function undo() {
      if (player) {
        player.undo();
        player.render();
      }
    }

    function redo() {
      if (player) {
        player.redo();
        player.render();
      }
    }

    function deleteSelection() {
      if (player) {
        player.deleteSelection();
        player.render();
      }
    }

    function exportSelection(path) {
      if (player) {
        return player.exportSelection(path);
      }
    }

    function resetSelection() {
      if (player) {
        player.resetSelection();
      }
    }

    function toggleToolMode(mode) {
      if (player) {
        player.toggleToolMode(mode);
      }
    }

    function enableRotate(value) {
      if (player) {
        player.enableRotate(value);
      }
    }

    function enablePan(value) {
      if (player) {
        player.enablePan(value);
      }
    }

    function moveToCenter(value) {
      if (player) {
        player.moveToCenter(value);
      }
    }

    function debug(value) {
      if (player) {
        // player.debug(value);
        player.change();
      }
    }

    function hide(type) {
      if (player) {
        player.hide(type);
      }
    }

    function show(type) {
      if (player) {
        player.show(type);
      }
    }

    function clear() {
      if (player) {
        player.clear();
      }
    }

    function loadModel(file) {
      if (player) {
        return player.loadModel(file);
      }
    }

    function cleanModelCache(file) {
      if (player) {
        player.cleanModelCache(file);
      }
    }

    function loadModelSeq(file, pointSize, callback) {
      if (player) {
        player.loadModelSeq(file, pointSize, callback);
      }
    }

    function cleanModel() {
      if (player) {
        player.cleanModel();
        player.render();
      }
    }

    function toggleModel() {
      if (player) {
        player.toggleModel();
      }
    }

    function setCameraPosition(x, y, z) {
      if (player) {
        player.setCameraPosition(x, y, z);
      }
    }

    function setScale(value) {
      if (player) {
        player.setScale(value);
      }
    }

    function updateMesh(type, vertices, normals, colors, info, forceUpdate) {
      if (player) {
        player.updateMesh(type, vertices, normals, colors, info, forceUpdate);
      }
    }

    function updateMarkers(num, inner, outer, flags, position, normal) {
      if (player) {
        player.updateMarkers(num, inner, outer, flags, position, normal);
      }
    }

    function hideMarkers() {
      if (player) {
        player.hideMarkers();
      }
    }

    function useBVH() {
      if (player) {
        player.enableBVH();
      }
    }

    function invertSelection() {
      if (player) {
        player.invertSelection();
        player.render();
      }
    }

    function enableSelection(value) {
      if (player) {
        player.enableSelection(value);
      }
    }

    function setSelectionMode(mode) {
      if (player) {
        player.setSelectionMode(mode);
      }
    }

    function getPointsNum() {
      if (player) {
        return player.getPointsNum();
      }
      return 0;
    }

    function getFacesNum() {
      if (player) {
        return player.getFacesNum();
      }
      return 0;
    }

    function setPointSize(size, type) {
      if (player) {
        player.setPointSize(size, type);
      }
    }

    function resetModelMaterial() {
      if (player) {
        player.resetModelMaterial();
      }
    }

    function setSelectedPointsListener(callback) {
      if (player) {
        player.setSelectedPointsListener(callback);
      }
    }

    function takeScreenShot() {
      if (player) {
        return player.takeScreenShot();
      }
    }

    function movePointCloud(x, y) {
      if (player) {
        player.movePointCloud(x, y);
      }
    }

    function scalePointCloud(value) {
      if (player) {
        player.scalePointCloud(value);
      }
    }

    return {
      takeScreenShot,

      loadModel,
      loadModelSeq,

      cleanModel,
      cleanModelCache,
      useBVH,

      toggleModel,
      toggleToolMode,

      undo,
      redo,
      reset,
      resetModelMaterial,

      resetSelection,
      enableSelection,
      exportSelection,
      deleteSelection,
      invertSelection,

      getFacesNum,
      getPointsNum,

      setScale,
      setPointSize,
      setSelectionMode,
      setCameraPosition,
      setSelectedPointsListener,

      enablePan,
      enableRotate,

      hide,
      show,
      clear,
      debug,

      moveToCenter,
      movePointCloud,
      scalePointCloud,

      updateMesh,
      updateMarkers,
      hideMarkers,

      PointCloudType,
      ToolMode,
      SelectionMode,
      id,
    };
  },
};
</script>
