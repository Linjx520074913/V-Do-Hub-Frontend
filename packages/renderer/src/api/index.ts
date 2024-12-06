const axios = require('axios').default

const AXIOS = axios.create({
    baseURL: 'http://119.29.186.158'
})

AXIOS.interceptors.request.use(
    
    function(config: any){

        // const user = User.getCurUser();
        // if(user != undefined){
        //     config.headers.Authorization = 'Bearer ' + user.token
        // }

        return config

    },
    function(error: any){

        return Promise.reject(error)

    }

)

export { AXIOS }
