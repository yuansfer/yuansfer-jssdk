/**@build 构建*/
const rollup = require('rollup')
const {uglify} = require('rollup-plugin-uglify')
const config = require('./base')
const version = process.env.VERSION || require('../package.json').version

// 设置头部注释信息
const banner =
  '/*!\n' +
  ` * Yuansfer v${version}\n` +
  ` * (c) 2018-${new Date().getFullYear()} li hui\n` +
  ' * Released under the MIT License.\n' +
  ' */'

// 设置尾部注释信息
const footer =
  `/** ${new Date()} **/`

config.output.banner = banner
config.output.footer = footer

function getSize(code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

async function build(config) {
  const bundle = await rollup.rollup(config)
  // 通过generate拿到code代码 ，计算代码大小
  const {output: [{code}]} = await bundle.generate(config.output)
  console.log(config.output.file + ':' + getSize(code))
  bundle.write(config.output)
}

build(config).then(() => {
  // 打压缩包
  config.plugins.push(uglify())
  config.output.file = 'dist/Yuansfer-sdk.min.js'
  build(config).then(() => {
    console.log('succeed')
  })
})
