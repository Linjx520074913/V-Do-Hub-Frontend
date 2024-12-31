import axios from 'axios'
import { ElMessage } from 'element-plus'
import { rjSdkConfg } from '../config'
const { appKey, baseURL } = rjSdkConfg

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
const service = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  timeout: 30000
})

interface RequestParams {
  [key: string]: any
  timestamp?: number
}

service.interceptors.request.use(
  (config) => {
    const { data, params, url } = config
    if(url?.includes('/img/upload')) {
      data.append('appKey', appKey)
      return config
    }

    let reqParam: RequestParams = {}
    reqParam = Object.assign({}, params)

    const timestamp = new Date().getTime()
    reqParam.timestamp = timestamp
    reqParam.appKey = appKey
    config.params = reqParam

    return config
  }
)

service.interceptors.response.use(
  (response: any) => {
    const data = response.data
    const code = data.code
    let res = data.payload

    if (code === '200') {
      return Promise.resolve(res)
    } else {
      ElMessage({
        message: res.message,
        type: 'error'
      })
      return Promise.reject(res)
    }
  },
  (error) => {
    ElMessage.error('服务异常')
    return Promise.reject(error)
  }
)

export { service as request }
