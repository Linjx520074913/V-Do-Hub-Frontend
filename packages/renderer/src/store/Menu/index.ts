import { ref } from 'vue'
import { router } from '@/main'
import { RouterPath } from '../TypeDefine'

interface MenuItem{
    title: string,
    icon: string,
    visible: boolean,
    link: string
}

const MenuRef = ref({
    data:{
        slider: [
            { title: '创建', icon: 'icon-splice',  visible: true,  link: RouterPath.MEDIA_CAPTURE },
            { title: '图库', icon: 'icon-texture', visible: true,  link: RouterPath.MEDIA_LIBRARY },
            { title: '设备', icon: 'icon-setting', visible: false, link: RouterPath.SETTING },
            { title: '商城', icon: 'icon-mobile1', visible: false, link: RouterPath.MALL },
            { title: '登录', icon: 'icon-mobile1', visible: false, link: RouterPath.USER_LOGIN },
            { title: '账户', icon: 'icon-mobile1', visible: true,  link: RouterPath.USER_ZONE },
        ],
        activedItem: null as MenuItem | null
    },
    methods:{
        init(){
            Menu.data.activedItem = Menu.data.slider[0]
        },
        active(item: MenuItem){
            Menu.data.activedItem = item
            console.log('@@@@@@@@@@@@', item.link)
            router.push(item.link)
        },
        activeAccountZone(){
            const item = Menu.data.slider[Menu.data.slider.length - 1]
            Menu.methods.active(item)
        },
        isActived(item: MenuItem){
            return (Menu.data.activedItem as MenuItem).title == item.title
        }
    }
})

const Menu = MenuRef.value
Menu.methods.init()


export { Menu, MenuItem }