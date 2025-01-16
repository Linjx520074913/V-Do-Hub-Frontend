<template>
    <div class="relative flex items-center justify-center w-[100px] h-[100px]">
      <!-- 外圈圆环 -->
      <svg class="absolute w-full h-full transform -rotate-90" shape-rendering="geometricPrecision">
        <!-- 灰色背景圆环 -->
        <circle
          class="text-gray-300"
          vector-effect="non-scaling-stroke"
          stroke-width="8"
          fill="transparent"
          r="46"
          cx="50%"
          cy="50%"
        />
        <!-- 红色倒计时圆环 -->
        <circle
          class="text-[#E94902]"
          vector-effect="non-scaling-stroke"
          :style="circleStyle"
          stroke-width="8"
          stroke-linecap="round"
          fill="transparent"
          r="46"
          cx="50%"
          cy="50%"
          :stroke-dasharray="dashArray"
        />
      </svg>
  
      <!-- 中间实心圆与倒计时 -->
      <div
        class="absolute flex items-center justify-center w-[70px] h-[70px] bg-[#E94902] text-white text-xl rounded-full cursor-pointer"
        @click="countDown"
      >
        {{ timeLeft }}s
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { computed, SetupContext, ref, onUnmounted } from "vue";
  
  export default {
    name: "ProgressTimer",
    setup(props: any, context: SetupContext) {
        const timeLeft = ref(15);
        const totalTime = ref(15);
        const transitionEnabled = ref(true)
        let intervalId: NodeJS.Timer | null;
    
        function countDown() {
            // 如果已有计时器，则先清除
            if (intervalId) {
                return
            }
    
            // 启动倒计时
            intervalId = setInterval(() => {
                if (timeLeft.value > 0) {
                    timeLeft.value -= 1;
                } else {
                    clearInterval(intervalId!); // 倒计时结束
                    intervalId = null;
                    timeLeft.value = totalTime.value; // 重置倒计时

                    // 禁用动画并立即重置
                    transitionEnabled.value = false;
                    timeLeft.value = totalTime.value;

                    // 延迟启用动画，确保下一次倒计时的动画生效
                    setTimeout(() => {
                        transitionEnabled.value = true;
                    }, 0);
                }
            }, 1000);
        }
    
        const dashArray = computed(() => {
            const radius = 46; // 整数值，避免锯齿
            return 2 * Math.PI * radius;
        });
    
        const dashOffset = computed(() => {
            return ((totalTime.value + timeLeft.value) / totalTime.value) * dashArray.value;
        });

        const circleStyle = computed(() => ({
            strokeDashoffset: dashOffset.value,
            transition: transitionEnabled.value ? "stroke-dashoffset 1s linear" : "none",
        }));
    
        // 组件卸载时清除定时器
        onUnmounted(() => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        });
    
        return { circleStyle, transitionEnabled, timeLeft, totalTime, countDown, dashArray, dashOffset };
    },
  };
  </script>
  
  <style>
  circle {
    stroke: currentColor;
  }
  </style>
  