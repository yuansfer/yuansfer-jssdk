/**@base rollup config基础配置*/
const babel = require("rollup-plugin-babel")
const resolve = require("rollup-plugin-node-resolve")
const commonjs = require("@rollup/plugin-commonjs")
const json = require("@rollup/plugin-json")

module.exports = {
  // 打包入口
  input: 'src/index.js',
  // 插件
  plugins: [
    resolve({ mainFields: ["jsnext", "preferBuiltins", "browser"] }),
    commonjs(),
    json(),
    babel({
      exclude: 'node_modules/**',
      // plugins: ['external-helpers'],
      externalHelpers: true
    })
  ],
  external: [
    "http",
    "https",
    "url",
    "assert",
    "stream",
    "tty",
    "util",
    "os",
    "zlib"
  ],
  // 输出配置
  output: {
    file: 'dist/Yuansfer-js-sdk.js',
    format: 'umd',
    name: 'Yuansfer'
  }
}
