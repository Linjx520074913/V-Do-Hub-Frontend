import { ref } from "vue";
import { router } from "@/main";

const menu = [
    { title: '创建', icon: 'icon-splice',  link: '/Create' },
    { title: '图库', icon: 'icon-texture', link: '/Gallery' },
    { title: '设备', icon: 'icon-setting', link: '/Setting' },
    { title: '商城', icon: 'icon-mobile1', link: '/Mall' }
];
const selectedItem = ref(menu[0]);

function handleClickMenuItem(item: any){
    selectedItem.value = item;
    router.push(item.link)
}

export { menu, selectedItem, handleClickMenuItem }