/**@dev 构建*/
const rollup = require('rollup')
const config = require('./base')

// 初始化配置文件 可以根据需求扩展config
const watcher = rollup.watch(config);

watcher.on('event', event => {
  // 状态码
  console.log(event.code)
  // logic
});
