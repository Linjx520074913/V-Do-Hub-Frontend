<template>
    <div
        id="tab"
        :style="{ 'flex-direction': (reversed ? 'row-reverse' : 'row') }"
    >
        <div
            v-for="(item, index) in items"
            class="tab__item"
            :class="{
                'tab__item--selected': activeIndex == index,
                'tab__item--disabled': disabled
            }"

            @click="active(index)"
        >
            <div class="tab__item--icon">
                <span :class="item.icon"/>
            </div>
            <div class="tab__item--label">
                {{ t(item.label) }}
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import { SetupContext, toRefs } from "vue";
import { Props } from "@/common/export/interface";
import { t } from "@/components/index";

export default {
    name: "Tab",

    props: {
        items: {
            type: Array,
        },

        activeIndex: {
            type: Number,
            default: 0
        },

        disabled: {
            type: Boolean,
            default: false
        },

        reversed: {
            type: Boolean,
            default: false
        }
    },

    emit: ["update:activeIndex", "changed"],

    setup(props: Props<any>, context: SetupContext) {

        const { items } = toRefs<Props<Array<{icon: string, label: string}>>>(props);
        const { activeIndex, disabled, reversed } = toRefs<Props<any>>(props);


        function active(index: number): void {
            if (disabled.value) {
                return;
            }

            console.log(index);
            context.emit('update:activeIndex', index);
            context.emit("changed", index);
        };

        return {
            t,

            items,
            activeIndex,
            disabled,
            reversed,
            
            active
        }
    }
}
</script>

<style lang='scss' scoped>
@import './local.scss';
</style>