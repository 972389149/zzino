require('./check-versions.js')()

process.env.NODE_ENV = 'production'

var webpack = require('webpack')
var config = require('../config')
var webpackConfig = require('./webpack.prod.conf')

// rm，用于删除文件或文件夹的插件:
var rm = require('rimraf')
var path = require('path')
// chalk，用于在控制台输出带颜色字体的插件:
var chalk = require('chalk')

// ora是在命令行显示spinner的插件：
var ora = require('ora')
var spinner = ora('building for production...') // 使用 ora 打印出 loading + log
spinner.start() // 开始 loading 动画

// rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
rm(path.join(config.build.assetsRoot, ""), err => {
  if (err) throw err
  //  开始 webpack 的编译
  webpack(webpackConfig, function (err, stats) {
    // 编译成功的回调函数
    spinner.stop()
    if (err) throw err
      // nodejs控制台输出流的设置:
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
