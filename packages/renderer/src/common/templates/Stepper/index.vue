<template>
    <div id="navigator">
        <div
            v-for="(item, index) in items"
            class="navigator__item"
            :class="{
                'navigator__item--selected': activeIndex == index,
                'navigator__item--disabled': item.disabled
            }"
            @click="active(index)"
        >
            <div class="navigator__item--icon">
                <span :class="item.icon"/>
            </div>
            <div class="navigator__item--label">
                {{ t(item.title) }}
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import { SetupContext, toRefs } from "vue";
import { Props } from "@/common/export/interface";
import { t } from "@/components";

export default {
    name: "Stepper",

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

        const { items } = toRefs<Props<Array<any>>>(props);
        const { activeIndex } = toRefs<Props<number>>(props);


        function active(index: number): void {
            console.log(index);
            if (!items.value[index].disabled) {
                context.emit('update:activeIndex', index);
            }
        };

        return {
            t,
            items,
            activeIndex,
            active,
        }
    }
}
</script>

<style lang='scss' scoped>
@import './local.scss';
</style>