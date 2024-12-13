import { ref } from 'vue'

const LocalStorageRef = ref({
    data:{

    },
    methods: {
        set(key: string, value: string){
            window.localStorage.setItem(key, value)
        },
        get(key: string){
            return window.localStorage.getItem(key)
        }
    },
})

const LocalStorage = LocalStorageRef.value

export { LocalStorage }