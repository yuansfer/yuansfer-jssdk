import axios from 'axios'
import Qs from 'qs'
import yuansfer from './index'
import jsonToXml from './utils/JsonToXml'
import md5 from 'js-md5';

function calculateVerifySign(contents) {
  //1.对参数进行排序，然后用a=1&b=2..的形式拼接
  let sortArray = []

  Object.keys(contents).sort().forEach(k => {
    if(contents[k] || contents[k] === false) {
      sortArray.push(`${k}=${contents[k]}`)
    }
  })

  //对token进行md5，得到的结果追加到sortArray之后
  sortArray.push(md5(yuansfer.token))

  const tempStr = sortArray.join('&')
  // console.log('tempStr:', tempStr);

  //对tempStr 再进行一次md5加密得到verifySign
  const verifySign = md5(tempStr)
  // console.log('veirfySign:', verifySign)

  return verifySign;
}

// 创建axios实例
const service = axios.create({
  // baseURL: process.env.BASE_API, // api 的 base_url
  // baseURL: 'https://mapi.yuansfer.com',
  // baseURL: 'https://mapi.yuansfer.yunkeguan.com',
  // baseURL: 'http://zk-tys.yunkeguan.com',
  // #config里面有这个transformRquest，这个选项会在发送参数前进行处理。
  // #这时候我们通过Qs.stringify转换为表单查询参数
  transformRequest: [function(data) {
    data = Qs.stringify(data)
    return data
  }],
  headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
  timeout: 100000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    config.url = yuansfer.baseURL + config.url
    yuansfer.isvFlag == 1 && (config.data.merGroupNo = yuansfer.merGroupNo)
    config.data.merchantNo = yuansfer.merchantNo
    config.data.storeNo = yuansfer.storeNo
    config.data.verifySign = calculateVerifySign(config.data)
    // console.log(config.data)
    // config.data = JSON.stringify(config.data)
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
    // console.log(response)
    let res = response.data
    const code = res.ret_code
    yuansfer.responseXml && (res = jsonToXml.parse(res))
    if (code === '000100') {
      return res
    } else {
      return Promise.reject(res)
    }
    // return response.data
  },
  error => {
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default service
