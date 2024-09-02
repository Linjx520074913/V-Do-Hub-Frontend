<template>
    <div id="tab">
        <div
            v-for="(item, index) in items"
            class="tab__item"
            :class="{ 'tab__item--selected': activeIndex == index }"
            @click="active(index)"
        >
            <div class="tab__item--icon">
                <span :class="item.icon"/>
            </div>
            <div class="tab__item--label">
                {{ item.label }}
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import { SetupContext, toRefs } from "vue";
import { Props } from "@/common/export/interface";

export default {
    name: "Navigator",

    props: {
        items: {
            type: Array,
        },

        activeIndex: {
            type: Number,
            default: 0
        }
    },

    emit: ["update:activeIndex"],

    setup(props: Props<any>, context: SetupContext) {

        const { items } = toRefs<Props<Array<{icon: string, label: string}>>>(props);
        const { activeIndex } = toRefs<Props<number>>(props);


        function active(index: number): void {
            console.log(index);
            context.emit('update:activeIndex', index);
        };

        return {
            items,
            activeIndex,
            active
        }
    }
}
</script>

<style lang='scss' scoped>
@import './local.scss';
</style>