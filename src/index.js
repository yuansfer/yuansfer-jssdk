/**@index 入口文件*/
import apis from './api'
// class Yuansfer {
//   constructor() {
//   }
// }

function Yuansfer() {
  this.merchantNo = null
  this.storeNo = null
  this.token = null
  this.baseURL = null
}

Yuansfer.prototype._setBaseURL = function(env) {
  env = env || 'prod'
  const baseURL = {
    prod: 'https://mapi.yuansfer.com',
    test: 'https://mapi.yuansfer.yunkeguan.com'
  }
  this.baseURL = baseURL[env]
}

Yuansfer.prototype.init = function(options) {
  if(!options.merchantNo){
    console.error('merchantNo could not be null.')
    return false;
  }
  if(!options.storeNo){
    console.error('storeNo could not be null.')
    return false;
  }
  if(!options.token){
    console.error('token could not be null.')
    return false;
  }
  this.merchantNo = options.merchantNo
  this.storeNo = options.storeNo
  this.token = options.token
  this._setBaseURL(options.env)
  Object.assign(Yuansfer.prototype, apis);
}

const yuansfer = new Yuansfer()

export default yuansfer
