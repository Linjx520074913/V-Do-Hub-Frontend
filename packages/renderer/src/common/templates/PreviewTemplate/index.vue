<template>
    <div id="preview-template">
        <div id="content">
            <div ref="control" id="control" :class="{'hide-div': !sideVisible}">
                <slot name="control"/>
            </div>

            <div
                id="control-resize"
                :class="{'wider-resize': !sideVisible}"
            />
            <div id="main">
                <div ref="display" id="display">
                    <slot name="display"/>
                </div>

                <div ref="log" id="log">
                    <slot name="log" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { ref, SetupContext, onMounted } from "vue";
import type { Ref } from "vue";
import { Props } from "@/common/export/interface";

export default {
    name: 'PreviewTemplate',

    setup(props: Props<any>, context: SetupContext) {

        const sideVisible = ref<boolean>(true);

        function handleXResize(resizeVisibility: Ref<boolean>): void {
            // TODO: need to refactor, using ref to get the element
            var resize = document.getElementById("control-resize");
            var resizeTarget = document.getElementById("control");

            if (resize && resizeTarget) {
                resize.onmousedown = (e) => {
                    // 设置移动条颜色
                    if (resize) {
                        resize.style.background = "#818181";
                    }

                    // 获取原高度
                    if (resizeTarget) {
                        var initWidth = resizeTarget.clientWidth;
                    }
                    // 获取起始Y坐标
                    var startX = e.clientX;

                    // 初始化移动距离
                    var moveLen = 0;

                    // 设置鼠标拖拽时的表现
                    document.onmousemove = (e) => {
                        // 获取当前拖动时的鼠标Y坐标
                        var endX = e.clientX;

                        // 计算移动距离
                        moveLen = endX - startX;
                        
                        let targetWidth = initWidth + moveLen;

                        // 使log区域能从隐藏状态展开
                        if (moveLen > 0 && !resizeVisibility.value) {
                                resizeVisibility.value = true;
                        }


                        if (moveLen < 0 && targetWidth <= 50 && resizeVisibility.value) {
                            resizeVisibility.value = false;
                        }

                        // 根据移动距离设置log区域高度
                        if (resizeTarget) {
                            resizeTarget.style.width = (targetWidth).toString() + "px";
                        }
                    };

                    // 设置拖拽结束时表现
                    document.onmouseup = (evt) => {

                        // 重置移动条颜色
                        if (resize) {
                                resize.style.background = "";
                        }

                        // 重置事件
                        evt.stopPropagation();
                        document.onmousemove = null;
                        document.onmouseup = null;

                        // @ts-ignore
                        resize.releaseCapture && resize.releaseCapture();
                    }
                    // @ts-ignore
                    resize.releaseCapture && resize.releaseCapture();
                    return false;
                };
            }

        }


        onMounted(() => {
                handleXResize(sideVisible);
        });

        return {
            sideVisible,
            handleXResize
        }
    }
};
</script>

<style lang="scss" scoped>
    @import './local.scss';
</style>
