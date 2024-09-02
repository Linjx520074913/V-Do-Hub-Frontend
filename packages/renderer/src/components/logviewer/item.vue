<template>
    <div :class="['w-full flex flex-col mb-1', {'hover:cursor-pointer': source.longDesc != undefined && source.longDesc != ''}]"  @click="click">
        <div class='flex flex-row w-full hover:bg-gray-700'>
            <div :class="['text-center flex flex-row', source.level]" style="width:80px">
                <p :class="['mt-auto mb-auto mr-2 mt-2', 'icon-' + source.level]"></p>
                <p class="ml-2 mt-auto mb-auto">{{ source.level }}</p>
            </div>
            <span class="name py-1 mr-2 whitespace-nowra"  style="width:150px">{{ source.timestamp }}</span>
            <span :class="['name py-1 mr-2 overflow-hidden', source.level]" style="width:100px">{{ source.module }}</span>
            <div class="desc py-1 flex flex-row flex-1 overflow-hidden whitespace-nowrap">
                <div class="w-4 flex">
                    <p v-if="source.longDesc!=''" :class="[log.foldIndex==source.index ? 'icon-circle-up' : 'icon-circle-down', 'mt-auto mb-auto']"></p>
                </div>
                <p :class="['ml-1', source.level]">{{ source.shortDesc }}</p>
            </div>
        </div>
        <div v-if="log.foldIndex == source.index && source.longDesc != ''" class="border-blue-400">
            <JsonEditorVue
                class="jse-theme-dark"
                v-model="source.longDesc"
                readOnly="true"
			/>
        </div>
        
    </div>
</template>

<script>
// https://github.com/cloydlau/json-editor-vue
import JsonEditorVue from 'json-editor-vue';
import 'vanilla-jsoneditor/themes/jse-theme-dark.css';
import { ref } from "vue";
import { log } from "@components/index";

export default {
    name: "LogItem",
    components:{ JsonEditorVue },
    props:{
        source: {
        type: Object,
        default: () => ({}),
      },
    },
    setup(props){

        const value = ref({
          'array with numbers': [1, 2, 3],
          boolean: true,
          color: '#82b92c',
          null: null,
          number: 123,
          object: {
            a: 'b',
            c: 'd',
          },
          time: 1575599819000,
          string: 'Hello World',
        })

        function click(){
            
            log.foldIndex = log.foldIndex != props.source.index ? props.source.index : -1;
            
        }

        

        return { click, log, value };

    }
}
</script>
    
    
    
<style lang="scss" scoped>
.debug{
    // background: #F0F
    color: #AAA;

    .type{
        background: #AAA;
        color: #000
    }
}
.warn{
    // background: #FF0
    color: #FF0;
    .type{
        background: #FF0;
        color: #000
    }
}
.error{
    // background: #F00
    color: #F00;
    .type{
        background: #F00;
        color: #000
    }
}

.info{
    color: #AAA;
    .type{
        background: #AAA;
        color: #000
    }
}

.animate {
    padding-left: 0px;
    white-space: nowrap;
    animation: 5s wordsLoop linear infinite normal;
}

@keyframes wordsLoop {
    0% {
        transform: translateX(0px);
        -webkit-transform: translateX(0px);
    }
    100% {
        transform: translateX(-100%);
        -webkit-transform: translateX(-100%);
    }
}

@-webkit-keyframes wordsLoop {
    0% {
        transform: translateX(0px);
        -webkit-transform: translateX(0px);
    }
    100% {
        transform: translateX(-100%);
        -webkit-transform: translateX(-100%);
    }
}

</style>
    