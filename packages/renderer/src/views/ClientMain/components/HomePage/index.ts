import { ref } from "vue";
import { router } from "@/main";

const menu = [
    { title: '创建', icon: '', link: '/Create' },
    { title: '图库', icon: '', link: '/Gallery' },
    { title: '设备', icon: '', link: '/Setting' },
    { title: '商城', icon: '', link: '/Mall' }
];
const selectedItem = ref(menu[0]);

function handleClickMenuItem(item: any){
    selectedItem.value = item;
    router.push(item.link)
}

export { menu, selectedItem, handleClickMenuItem }