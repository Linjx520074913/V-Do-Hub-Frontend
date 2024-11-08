import { ref } from 'vue'
import { router } from '@/main'

// 个人信息
interface Profile{
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    company: string,
    website: string
}

// 订阅
interface Subscription{
    feature: Object
}

const AccountRef = ref({
    data:{
        
    },
    methods:{
        
    }
})

const Account = AccountRef.value

export { Account }