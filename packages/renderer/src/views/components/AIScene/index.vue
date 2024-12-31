<template>
  <div class="page-scene">
    <div class="main-left">
      <div class="main-box">
        <div v-for="pItem in dataList" :key="pItem.id" class="block-list">
          <div class="block-title">{{ pItem.name }}</div>
          <div class="child-list">
            <div v-for="cItem in pItem.items" :key="cItem.id" class="child-item" :class="{ 'active' : activeCode === cItem.code }" @click="onClick(cItem.code)">
              <img class="item-img" :src="cItem.coverUrl" alt="" />
              <div class="item-name">{{ cItem.name }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="btn-box">
        <el-button :disabled="btnDisabled" :loading="btnLoading" class="btn-submit" @click="onCreate">点击生成</el-button>
      </div>
    </div>
    <div class="main-right">
      <div class="main-content" >
        <div class="box" v-if="originUrl">
          <img class="img" :src="originUrl" alt="" />
          <div class="title-tips">原图</div>
        </div>
        <div class="box" v-else style="text-align: left;">
          <el-button class="btn-choose" :loading="uploadLoading" type="primary" @click="onChooseImg" >上传图片</el-button>
        </div>
        <div class="box" v-if="resultUrlR">
          <img class="img" :src="resultUrlR" alt="" />
          <div class="title-tips">效果图</div>
        </div>
      </div>
    </div>
    <input type="file" accept="image/*" class="file-input" name="file" ref="fileRef" @change="onFileChange">
  </div>
</template>

<script lang="ts">
import { SetupContext, onMounted, ref } from "vue"

import { ElMessage } from 'element-plus'

import { getResourceFusion, submitCutout, queryCutout, submitFusionBg, queryFusionBg, uploadImg } from '@/rjSdk/apis'



export default {
  name: "AIScene",
  props: {},

  emits: [],
  components: {},

  setup(props: any, context: SetupContext) {
    let timer, aiType = 'Cutout' // Cutout: 抠图、Fusion: 合成
    const dataList = ref([])
    const activeCode = ref('')

    const originUrl = ref('')
    const originUrl2 = ref('')
    const resultUrlR = ref('')
    const fileRef = ref(null)
    const gidRef = ref('')
    const taskIdRef = ref('')
    const uploadLoading = ref(false)
    const btnDisabled = ref(true)
    const btnLoading = ref(false)

    const getList = async () => {
        const res = await getResourceFusion()
        dataList.value = res.subjects
    }

    const onClick = (code) => {
        activeCode.value = code
    }

    const onChooseImg = () => {
        fileRef.value.click()
    }

    const onFileChange = async (e) => {
        if (e.target.files.length) {
            uploadLoading.value = true
            const fileData = e.target.files[0]
            const form = new FormData()
            form.append('file', fileData)
            // 本地文件上传，如果是网络图片则无须上传
            const res = await uploadImg(form)
            fileRef.value.value = ''
            // 抠图
            aiType = 'Cutout'
            createTask({
            origUrl: res.resultUrl
            })
        }
    }

    const createTask = async (params = {}) => {
        let taskFun = null
        switch (aiType) {
            case 'Cutout':
            taskFun = submitCutout
            break;
            case 'Fusion':
            taskFun = submitFusionBg
            break;
        }
        const res = await taskFun(params)
        const { gid, taskId } = res
        gidRef.value = gid
        taskIdRef.value = taskId
        queryTask()
    }

    const queryTask = () => {
        let taskFun = null
        switch (aiType) {
            case 'Cutout':
            taskFun = queryCutout
            break;
            case 'Fusion':
            taskFun = queryFusionBg
            break;
        }
        timer = setInterval(async () => {
            try {
            const res = await taskFun({
                gid: gidRef.value, 
                taskId: taskIdRef.value
            })
            const { status, resultUrl, origUrl } = res
            if (status === 'finished') {
                if (aiType === 'Cutout') {
                btnDisabled.value = false
                uploadLoading.value = false
                originUrl.value = origUrl
                originUrl2.value = resultUrl
                } else {
                btnLoading.value = false
                resultUrlR.value = resultUrl
                }
                stopTask()
            } else if (status === 'failed') {
                stopTask()
            }
            } catch (error) {
            console.log(error)
            stopTask()
            }
        }, 2000)
    }

    const stopTask = () => {
        clearInterval(timer)
    }

    const onCreate = () => {
        const templateCode = activeCode.value
        if (!templateCode) {
            ElMessage.error('请选择模板')
            return
        }
        btnLoading.value = true
        aiType = 'Fusion'
        createTask({
            origUrl: originUrl2.value,
            templateCode
        })
    }

    onMounted(() => {
        getList()
    })
    return { onCreate, onFileChange, onChooseImg, onClick, btnLoading, btnDisabled, uploadLoading, taskIdRef, gidRef, fileRef, resultUrlR, originUrl2, originUrl, activeCode, dataList, timer, aiType };
  },
};
</script>

<style lang="scss" scoped>
.page-scene {
  display: flex;
  height: 100%;
  padding-bottom: 35px;
  .main-left {
    display: flex;
    flex-direction: column;
    width: 290px;
    background: #FFF;
    border: 1px solid #e5e7eb;
    .block-title {
      font-size: 16px;
      color: #2D2D2D;
    }
    .main-box {
      padding: 15px 20px;
      flex: 1;
      overflow-y: auto;
    }
    .block-list {
      .child-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .child-item {
          display: inline-block;
          text-align: center;
          font-size: 14px;
          cursor: pointer;
          margin-bottom: 5px;
          .item-img {
            width: 114px;
            height: 114px;
            border: 1px solid transparent;
          }
          &.active {
            color: #E94902;
            .item-img {
              border: 1px solid #E94902;
            }
          }
        }
      }
      & + .block-list {
        margin-top: 15px;
      }
    }
    .btn-box {
      padding: 10px 20px;
      .btn-submit {
        width: 100%;
        height: 30px;
        background: #E94902;
        border-radius: 30px;
        color: #FFFFFF;
        text-align: center;
        font-size: 14px;
        &.is-disabled {
          opacity: 0.5;
        }
      }
    }
  }
  .main-right {
    padding: 40px;
    flex: 1;
  }
  .main-content {
    height: 100%;
    text-align: center;
    display: flex;
    justify-content: space-between;
    .box {
      width: 49%;
      max-width: 600px;
      height: 100%;
      font-size: 16px;
      color: #333333;
      border-radius: 8px;
      user-select: none;
      padding: 20px;
      .img {
        width: auto;
        height: auto;
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
    }
    .title-tips {
      color: #999999;
      margin-top: 10px;
    }
  }
}

.file-input {
  display: none;
}

.btn-choose {

  background-color: #E94902;
  outline: none;
  border: none;
}
</style>
