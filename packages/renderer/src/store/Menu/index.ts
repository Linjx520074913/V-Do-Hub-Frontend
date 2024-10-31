import { ref } from 'vue'

const MenuRef = ref({
    data:{
        slider: [
            { title: '创建', icon: 'icon-splice',  link: '/Capture' },
            { title: '图库', icon: 'icon-texture', link: '/Gallery' },
            { title: '设备', icon: 'icon-setting', link: '/Setting' },
            { title: '商城', icon: 'icon-mobile1', link: '/Mall' },
            { title: '登录', icon: 'icon-mobile1', link: '/Login' }
        ]
    },
    methods:{

    }
})

const Menu = MenuRef.value

export { Menu }