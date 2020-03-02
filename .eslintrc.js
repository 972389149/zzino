module.exports = {
    // 默认情况下，ESLint会在所有父级组件中寻找配置文件，一直到根目录。ESLint一旦发现配置文件中有 "root": true，它就会停止在父级目录中寻找。
    "root": true,
    // 预设好环境，eslint就能理解这些环境的全局变量
    "env": {
        // 浏览器环境
        "browser": true,
        "es6": true
    },
    // 扩展自一个流行的风格指南，即 eslint-config-standard
    "extends": "standard",
    "plugins": [
        // standard风格的依赖包
        "standard",
        // standard风格的依赖包
        "promise",

        // 此插件用来识别.html 和 .vue文件中的js代码
        "html"
    ],
    // 对Babel解析器的包装使其与 ESLint 兼容
    "parser": "babel-eslint",
    "parserOptions": {
        // 代码是 ECMAScript 模块
        "sourceType": "module",
        "ecmaFeatures": {
        }
    },
    // 让eslint能识别出来的全局变量：
    "globals": {
        "IS_DEV": false // 设置为false表示该变量在代码中不可再重新赋值
    },
    "rules": {
        // 允许在 注释部分 中使用空白符
        "no-trailing-spaces": ["error", { "ignoreComments": true }],
        "no-unused-vars": 1,
        "quotes": [1, "single", { "allowTemplateLiterals": true }],
        "comma-dangle": 0,
    }
}