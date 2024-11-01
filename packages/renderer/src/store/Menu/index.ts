import { ref } from 'vue'
import { router } from '@/main'

interface MenuItem{
    title: string,
    icon: string,
    link: string
}

const MenuRef = ref({
    data:{
        slider: [
            { title: '创建', icon: 'icon-splice',  link: '/MediaCapture' },
            { title: '图库', icon: 'icon-texture', link: '/MediaLibrary' },
            { title: '设备', icon: 'icon-setting', link: '/Setting' },
            { title: '商城', icon: 'icon-mobile1', link: '/Mall' },
            { title: '登录', icon: 'icon-mobile1', link: '/Login' }
        ],
        activedItem: null as MenuItem | null
    },
    methods:{
        init(){
            Menu.data.activedItem = Menu.data.slider[0]
        },
        active(item: MenuItem){
            Menu.data.activedItem = item
            router.push(item.link)
        },
        isActived(item: MenuItem){
            return (Menu.data.activedItem as MenuItem).title == item.title
        }
    }
})

const Menu = MenuRef.value
Menu.methods.init()


export { Menu }