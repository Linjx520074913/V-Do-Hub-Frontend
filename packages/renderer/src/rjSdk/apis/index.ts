import { request } from '../utils/request'

const getResourceFusion = () => {
  return request({
    url: '/openapi/general/resource/get.htm',
    params: {
      resourceCode: 'fusion_bg'
    }
  })
}

const submitCutout = (params: any) => {
  return request({
    url: '/openapi/img/submitCutout.htm',
    params
  })
}

const queryCutout = (params: any) => {
  return request({
    url: '/openapi/img/queryCutout.htm',
    params
  })
}

const submitFusionBg = (params: any) => {
  return request({
    url: '/openapi/img/submitFusionBg.htm',
    params
  })
}

const queryFusionBg = (params: any) => {
  return request({
    url: '/openapi/img/queryFusionBg.htm',
    params
  })
}

const uploadImg = (data: any) => {
  return request({
    url: '/openapi/img/upload.htm',
    method: 'post',
    data
  })
}

export {
  getResourceFusion,
  submitCutout,
  queryCutout,
  submitFusionBg,
  queryFusionBg,
  uploadImg
}