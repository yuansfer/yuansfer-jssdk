/**@index 入口文件*/
// import { securePay } from './api';

// function reduce() {
//   console.log('reduce')
// }
//
// const utils = {
//   add(a, b) {
//     return a + b
//   },
//   reduce:function () {
//
//   }
// }
//
// function Yuansfer(config) {
//   this.config = config
// }
//
// Yuansfer.prototype.say = function () {
//   console.log(this.config)
// }
//
// Yuansfer.prototype.add = function (a, b) {
//   return utils.add.call(this, a, b)
// }
//
// // Yuansfer.prototype.securePay = function(params) {
// //   return securePay.call(this, params)
// // };
//
// // Yuansfer.prototype.securePay = function() {
// //   return securePay
// // };
// Yuansfer.prototype.securePay = securePay

// module.exports = Yuansfer

import apis from './api'
class Yuansfer {
  constructor() {
  }
}
//
// function Yuansfer(config) {
//   this.config = config
// }

Object.assign(Yuansfer.prototype, apis);

const yuansfer = new Yuansfer()

export default yuansfer
