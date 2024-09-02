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
                    ref="obSelectTriggerRef"
                    :class="{
                        'ob-select-trigger__outer--active': popOverVisible
                    }"
                >
                    <div
                        class="ob-select-label"
                    >
                        <div
                            class="label-wrapper"
                        >
                            {{ t(items[activeIndex].label) }}
                        </div>
                    </div>

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
                    <div
                        v-for="(option, index) in items"
                        class="ob-select-item"
                        :class="{ 'ob-select-item__selected': activeValue == option.value }"
                        @click="() => { active(index) }"
                    >
                        <span>{{ t(option.label) }}</span>
                    </div>
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

        const obSelectTriggerRef = ref(null);

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

            isTextIcon,
            isImgIcon,
            isNoIcon,
            showSelectedLabel,
            minWidthLabel,

            obSelectTriggerRef
        }
    }
}
</script>

<style lang='scss' scoped>
@import './local.scss';
</style>