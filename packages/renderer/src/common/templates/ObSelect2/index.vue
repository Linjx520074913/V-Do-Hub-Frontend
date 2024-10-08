<template>
    <div id="ob-select">
        <n-popover
            :placement="placement"
            :style="popOverStyle"
            :show-arrow="false"
            :to="false"
            :animated="!popOverVisible"
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
                        :visible="tooltipVisible(items[activeIndex].tooltip)"
                        placement="bottom"
                        :show-arrow="false"
                        :enterable="false"
                        :hide-after="0"
                        popper-class="el-tooltip-prewrap"
                    >
                        <div
                            class="ob-select-label"
                            :style="{
                                'min-width': labelMinWidth,
                                'border-top-left-radius': popOverVisible ? '0px' : '2px',
                                'border-top-right-radius': popOverVisible ? '0px' : '2px'
                            }"
                        >
                            <div
                                class="icon-wrapper"
                            >
                                <img
                                    v-if="isImgIcon"
                                    :src="items[activeIndex].imgIcon"
                                    class="img-icn"
                                />
                                <span
                                    v-if="isTextIcon"
                                    :class="[items[activeIndex].textIcon]"
                                />
                            </div>
                            <div
                                class="label-wrapper"
                                v-if="showSelectedLabel"
                            >
                                {{ t(items[activeIndex].label) }}
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
                        :visible="tooltipVisible(option.tooltip)"
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
                            :style="{'min-width': minWidthLabel}"
                            @click="() => { active(index) }"
                        >
                            <img
                                v-if="isImgIcon"
                                :src="option.imgIcon"
                                class="img-icn"
                            />
                            <span
                                v-if="isTextIcon"
                                class="icon-wrapper"
                                :class="[option.textIcon]"
                            />
                            <span v-if="!iconOnly">{{ t(option.label) }}</span>
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
    name: "ObSelect2",

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

        iconType: {
            type: String,
            default: "none" // none, text, img
        },

        iconOnly: {
            type: Boolean,
            default: false
        },

        foldable: {
            type: Boolean,
            default: false
        },

        minWidthLabel: {
            type: String,
            default: "0px"
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

    emit: ["update:activeValue", "change", "popOverVisible"],

    setup(props: Props<any>, context: SetupContext) {

        const {
            items,
            activeValue,
            placement,
            iconType,
            iconOnly,
            foldable,
            minWidthLabel,
            hideSelectedInMenu
        } = toRefs(props);


        const isTextIcon = computed(() => {
            return "text" == iconType.value
        });
        const isImgIcon = computed(() => {
            return "img" == iconType.value
        });
        const isNoIcon = computed(() => {
            return !(isTextIcon || isImgIcon)
        });

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
                context.emit("popOverVisible", false);
            }

            popOverVisible.value = false;
            if (nPopOverRef.value) {
                (nPopOverRef.value as any).setShow(false);
            }

        };

        
        let popOverVisible = ref(false);

        function recordPopOverVisibility(targetValue: boolean) {
            context.emit("popOverVisible", targetValue);
            // This timeout is required due to naive-ui hook issue
            setTimeout(() => {
                popOverVisible.value = targetValue;

            }, 5);

            setTimeout(() => {
                if (nPopOverRef.value) {
                    (nPopOverRef.value as any).syncPosition();
                }
            }, 10);
        };

        function tooltipVisible(targetTooltip: any) {
            if (undefined == targetTooltip || "null" == targetTooltip) {
                return false;
            }

            return undefined;
        }


        const showSelectedLabel = computed(() => {
            if (iconOnly.value) {
                return false;
            }

            else if (!foldable.value) {
                return true;
            }
            
            else {
                return popOverVisible.value
            }
        });

        const labelMinWidth = computed(() => {
            if (!iconOnly.value && popOverVisible.value) {
                return minWidthLabel.value;
            }

            return "0px";
        });

        onMounted(() => {

        });

        return {
            t,
            popOverStyle,

            items,
            activeValue,
            activeIndex,
            placement,
            iconOnly,
            hideSelectedInMenu,

            active,
            nPopOverRef,

            popOverVisible,
            recordPopOverVisibility,

            tooltipVisible,
            isTextIcon,
            isImgIcon,
            isNoIcon,
            showSelectedLabel,
            minWidthLabel,
            labelMinWidth
        }
    }
}
</script>

<style lang='scss' scoped>
@import './local.scss';
</style>