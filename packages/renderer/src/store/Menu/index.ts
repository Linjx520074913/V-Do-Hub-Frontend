import { ref } from 'vue'
import { Router } from '@/store/index'

interface MenuItem{
    title: string,
    icon: string,
    visible: boolean,
    link: string
}

const MenuRef = ref({
    data:{
        slider: [
            { title: '创建',           icon: 'icon-splice',  visible: true,  link: '/main/homepage/media_capture' },
            { title: '图库',           icon: 'icon-texture', visible: true,  link: '/main/homepage/media_library' },
            { title: '设备',           icon: 'icon-setting', visible: false, link: 'RouterPath.SETTING' },
            { title: '商城',           icon: 'icon-mobile1', visible: false, link: 'RouterPath.MALL' },
            { title: '登录',           icon: 'icon-mobile1', visible: false, link: 'RouterPath.USER_LOGIN' },
            { title: '场景图',         icon: 'icon-mobile1', visible: false, link: 'RouterPath.AISCENE' },
            { title: '我的个人资料',   icon: 'icon-mobile1', visible: false, link: '/main/homepage/user_zone/:index' },
        ],
        activedItem: null as MenuItem | null
    },
    methods:{
        init(){
            Menu.data.activedItem = Menu.data.slider[0]
        },
        active(item: MenuItem, query?: Object){
            Menu.data.activedItem = item
            Router.methods.to( item.link, query )
        },
        activeIndex(index: number){
            Menu.data.activedItem = Menu.data.slider[index]
        },
        activeAccountZone(index: number){
            const item: MenuItem = Menu.data.slider[Menu.data.slider.length - 1]
            Menu.methods.active(item, { index: index})
        },
        isActived(item: MenuItem){
            return (Menu.data.activedItem as MenuItem).title == item.title
        }
    }
})

const Menu = MenuRef.value
Menu.methods.init()


export { Menu, MenuItem }