// build文件夹下的dev-server.js引入的config即是此文件
var path = require('path')
var URLroot = 'http://api3.zzinno.com:9080'
// index.js 中有 dev 和 production 两种环境的配置
module.exports = {
  // 我们先写dev环境：
  dev: {
    env: require('./dev.env.js'),
    port: 8095,
    autoOpenBrowser: true,
    // 静态资源文件夹
    assetsSubDirectory: 'static',
    // 编译发布的根目录，可配置为资源服务器域名或 CDN 域名
    assetsPublicPath: '/', // 和本地node server约定了缓存项目在根目录，所以dev时资源都是按根目录来放的
    proxyTable: {
      '/api': {
        // target: URLroot,
        target:'http://api3.zzinno.com:9080',  //解决出现500的问题
        changeOrigin: true,
        pathRewrite: {
          '^/api': 'http://api3.zzinno.com:9080'
        }
      }
    }, // 需要 proxyTable 代理的接口（可跨域）
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    // 是否开启 cssSourceMap
    cssSourceMap: false
  },
  build: {
    env: require('./prod.env.js'), // 使用 config/prod.env.js 中定义的编译环境
    assetsRoot: path.resolve(__dirname, '../dist'), // 编译输出的静态资源路径
    assetsSubDirectory: 'static', // 编译输出的二级目录
    // 我在assetsPublicPath的路径前面加了个.    :
    assetsPublicPath: './', // 不是根路径，这个路径其实就是dist文件夹
    index: path.resolve(__dirname, '../dist/index.html'), // 编译输入的 index.html 文件
    productionSourceMap: true, // 是否开启 SourceMap
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    // productionGzip: false, // 是否开启 gzip
    // productionGzipExtensions: ['js', 'css'], // 需要使用 gzip 压缩的文件扩展名
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
