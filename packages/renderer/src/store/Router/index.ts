import { ref } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router';
import Main from "@/components/main/index.vue"
import { Setting, MediaLibrary, MediaCapture, Mall, UserLogin, UserRegister, UserZone, AIScene, HomePage } from '@/views/components/index';

enum RouterPath{
    BASE = '/',
    LOGIN = '/login',
    MAIN = '/main',
    USER_REGISTER = '/main/user_register',
    HOMEPAGE = '/main/homepage'
}

const RouterRef = ref({
    data:{
        router: null as any
    },
    methods:{
        init(){
            const subChildRoutes = [

            ]
            
            const childRoutes = [
                { path: '/', component: UserRegister },
                { path: 'user_register', component: UserRegister },
                { path: 'homepage', component: HomePage }
            ]
            
            const routes = [
                { path: '/',      component: UserLogin                       },
                { path: '/login', component: UserLogin                       },
                { path: '/main',  component: Main,     children: childRoutes }
            ]

            Router.data.router = createRouter({
                history: createMemoryHistory(),
                routes
            })
        },
        to(to: RouterPath){
            Router.data.router!.push(to)
        }
    }
})

const Router = RouterRef.value

export { Router, RouterPath }