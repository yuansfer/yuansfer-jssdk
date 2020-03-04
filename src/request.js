import axios from 'axios'
import { calculateVerifySign } from './utils'

// 创建axios实例
const service = axios.create({
  // baseURL: process.env.BASE_API, // api 的 base_url
  baseURL: 'https://mapi.yuansfer.yunkeguan.com',
  headers: { 'Content-Type': 'application/json;charset=UTF-8' },
  timeout: 100000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    config.data.verifySign = calculateVerifySign(config.data)
    console.log(config.data)
    config.data = JSON.stringify(config.data)
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.ret_code != '000100') {
      return Promise.reject('error')
    } else {
      return res.data
    }
  },
  error => {
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default service
