<template>
    <div id="ob-select">
        <n-popover
            :placement="placement"
            :style="popOverStyle"
            :show-arrow="false"
            :to="false"
            trigger="click"
            ref="nPopOverRef"
            @update:show="recordPopOverVisibility($event)"
        >
            <template #trigger>
                <div
                    class="ob-select-trigger__outer"
                >
                    <el-tooltip
                        :content="t(items[activeIndex].tooltip)"
                        placement="bottom"
                        :show-arrow="false"
                        :enterable="false"
                        :hide-after="0"
                        popper-class="el-tooltip-prewrap"
                    >
                        <div
                            :style="{
                                'border-top-left-radius': popOverVisible ? '0px' : '2px',
                                'border-top-right-radius': popOverVisible ? '0px' : '2px'
                            }"
                        >
                            <div
                                v-if="textIconOnly"
                                class="text-icon-wrapper">
                                <span :class="[items[activeIndex].textIcon]" />
                            </div>
                            <div v-else>
                                {{ items[activeIndex].label }}
                            </div>
                        </div>
                    </el-tooltip>

                    <div
                        class="ob-select-indicator"
                        :class="{ 'ob-select-indicator__rotated': popOverVisible }"
                    >
                        <span />
                    </div>
                </div>
            </template>
            <template #default>
                <div
                    class="ob-select-popover"
                >
                    <el-tooltip
                        v-for="(option, index) in items"
                        :key="index"
                        :content="t(option.tooltip)"
                        placement="left"
                        :show-arrow="false"
                        :enterable="false"
                        :hide-after="0"
                        popper-class="el-tooltip-prewrap"
                    >
                        <div
                            v-show="!(hideSelectedInMenu && activeValue == option.value)"
                            class="ob-select-item"
                            :class="{ 'ob-select-item__selected': activeValue == option.value }"
                            @click="() => { active(index) }"
                        >
                            <span
                                class="text-icon-wrapper"
                                :class="[option.textIcon]"
                            />
                            <span v-if="!textIconOnly">{{ option.label }}</span>
                        </div>
                    </el-tooltip>                              
                </div>
            </template>
        </n-popover>
    </div>
</template>

<script lang='ts'>
import { SetupContext, toRefs, ref, computed, onMounted } from "vue";
import { Props } from "@/common/export/interface";
import { t } from "@/components/index";

export default {
    name: "ObSelect",

    props: {
        items: {
            type: Array,
        },

        activeValue: {
            type: Number,
            default: 0
        },

        placement: {
            type: String,
            default: "top-start"
        },

        textIconOnly: {
            type: Boolean,
            default: false
        },

        imgIconAsBrief: {
            type: Boolean,
            default: false
        },

        hideSelectedInMenu: {
            type: Boolean,
            default: false
        },

        triggerTooltipPlacement: {
            type: String,
            default: "bottom"
        },

        optionItemTooltipPlacement: {
            type: String,
            default: "left"
        },
    },

    emit: ["update:activeValue", "change"],

    setup(props: Props<any>, context: SetupContext) {

        const {
            items,
            activeValue,
            placement,
            textIconOnly,
            hideSelectedInMenu
        } = toRefs(props);


        const popOverStyle = ref({
            "padding": 0,
            "background-color": "transparent",
            "box-shadow": "none",
            "margin": 0,
            "transform": "translate(0px, 1px)"
        });

        
        const activeIndex = computed(() => {
            for (let index = 0; index < items.value.length; index++) {
                if (activeValue.value == items.value[index].value) {
                    return index;
                }
            }

            return 0;
        })

        const nPopOverRef = ref<null | HTMLElement>(null);
        
        function active(index: number): void {
            if (!items.value[index].disabled) {
                const curVal = items.value[index].value;
                context.emit("update:activeValue", curVal);
                context.emit("change", curVal);
            }

            popOverVisible.value = false;
            if (nPopOverRef.value) {
                (nPopOverRef.value as any).setShow(false);
            }

        };

        
        let popOverVisible = ref(false);


        function recordPopOverVisibility(targetValue: boolean) {
            // This timeout is required due to naive-ui hook issue
            setTimeout(() => {
                popOverVisible.value = targetValue;
            }, 1);
        }

        onMounted(() => {

        });

        return {
            t,
            popOverStyle,

            items,
            activeValue,
            activeIndex,
            placement,
            textIconOnly,
            hideSelectedInMenu,

            active,
            nPopOverRef,

            popOverVisible,
            recordPopOverVisibility,
        }
    }
}
</script>

<style lang='scss' scoped>
@import './local.scss';
</style>