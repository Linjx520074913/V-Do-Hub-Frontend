<template>
    <div>
      <audio ref="audioPlayerRef" :src="finishTips" preload="none"></audio>
      <el-button @click="togglePlay">Play Once</el-button>
      <el-button @click="toggleMute">{{ isMuted ? 'Unmute' : 'Mute' }}</el-button>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import finishTips from "@/assets/audio/finish_tips.mp3";
  export default {
    name: 'AudioPlayer',
    props: {
    //   audioSrc: {
    //     type: String,
    //     required: true
    //   }
    },
    setup(props) {

      const audioPlayerRef = ref(null);
      const isMuted = ref(false);
 

      function togglePlay() {
        audioPlayerRef.value.play();
        if (!audioPlayerRef.value) return;
        
        // 播放音频
        audioPlayerRef.value.play();
      }
  
      function toggleMute() {
        if (!audioPlayerRef.value) return;
        
        // 切换静音状态
        audioPlayerRef.value.muted = !audioPlayerRef.value.muted;
        isMuted.value = audioPlayerRef.value.muted;
      }
  
      return {
        audioPlayerRef,
        togglePlay,
        toggleMute,
        isMuted,
        finishTips
      };
    }
  };
  </script>
  
  <style scoped>
  /* 可选的样式 */
  </style>
  