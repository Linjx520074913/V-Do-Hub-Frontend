import { ref } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router';
import Main from "@/components/main/index.vue"
import { Setting, MediaLibrary, MediaCapture, Mall, UserLogin, UserRegister, UserZone, AIScene, HomePage } from '@/views/components/index';
import { ElStep } from 'element-plus';

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
                { path: '',                 component: MediaLibrary },
                { path: 'media_capture',    component: MediaCapture },
                { path: 'media_library',    component: MediaLibrary },
                { path: 'user_zone/:index', component: UserZone }
            ]
            
            const childRoutes = [
                { path: '',              component: UserRegister },
                { path: 'user_register', component: UserRegister },
                { path: 'homepage',      component: HomePage , children: subChildRoutes }
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
        to(to: RouterPath | string, query?: Object){
            if(query){
                Router.data.router!.push({ path: to, query })
            }else{
                Router.data.router!.push({ path: to })
            }
            
        }
    }
})

const Router = RouterRef.value

export { Router, RouterPath }