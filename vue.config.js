'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
    return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'vue Admin Template' // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following methods:
// port = 9528 npm run dev OR npm run dev --port = 9528
const port = process.env.port || process.env.npm_config_port || 9528 // dev port

// 引入放到cdn服务器上的几个大文件
// 判断环境，只有在生产环境，菜做打包排除和cdn注入
const isPro = process.env.NODE_ENV === "production";
let cdn = { css: [], js: [] }; //cdn配置文件
let externals = {}; //排除项
if (isPro) {
    //1. webpack排除打包的包
    // key:value, 要排除的包名：实际引入的包的全局变量名
    // 本项目中，我们实际将大包放到了CDN上，因此这里的value指的是CDN服务器上该包的全局变量
    externals = {
        "vue": "Vue",
        'element-ui': 'ELEMENT',
        'xlsx': 'XLSX'
    };

    // 2.cdn配置文件
    // 这里将这个大包放到了cdn服务器上
    cdn = {
        css: [
            // element-ui css
            'https://unpkg.com/element-ui/lib/theme-chalk/index.css' // 样式表
        ],
        js: [
            // vue must at first!
            'https://unpkg.com/vue/dist/vue.js', // vuejs
            // element-ui js
            'https://unpkg.com/element-ui/lib/index.js', // elementUI
            'https://cdn.jsdelivr.net/npm/xlsx@0.16.6/dist/jszip.min.js',
            'https://cdn.jsdelivr.net/npm/xlsx@0.16.6/dist/xlsx.full.min.js'
        ]
    };
};


// 3. 注入cdn文件到模版中
// 借助插件 html-webpack-plugin
// 1. 配置插件的cdn项：见chainWebpack
// 2. 使用插件在public/index.html文件中引入注入的css/js文件


// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
    /**
     * You will need to set publicPath if you plan to deploy your site under a sub path,
     * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
     * then publicPath should be set to "/bar/".
     * In most cases please use '/' !!!
     * Detail: https://cli.vuejs.org/config/#publicpath
     */
    publicPath: '/',
    outputDir: 'dist',
    assetsDir: 'static',
    lintOnSave: process.env.NODE_ENV === 'development',
    productionSourceMap: false,

    // 开发服务器配置
    devServer: {
        port: port,
        open: true,
        overlay: {
            warnings: false,
            errors: true
        },
        // 2 配置开发服务器代理
        proxy: {
            // 这里的api 表示如果我们的请求地址有/api的时候,就出触发代理机制
            // localhost:8888/api/abc  => 代理给另一个服务器
            // 本地的前端  =》 本地的后端  =》 代理我们向另一个服务器发请求 （行得通）
            // 本地的前端  =》 另外一个服务器发请求 （跨域 行不通）
            '/api': {
                target: 'http://ihrm-java.itheima.net/', // 我们要代理的地址
                changeOrigin: true, // 是否跨域 需要设置此值为true 才可以让本地服务代理我们发出请求
                // 路径重写
                // pathRewrite: {
                //     // 重新路由  localhost:8888/api/login  => www.baidu.com/api/login
                //     '^/api': '' // 假设我们想把 localhost:8888/api/login 变成www.baidu.com/login 就需要这么做 
                // }
            },
            '/api2': {
                // 遇到/api2触发代理，localhost:8888/api2代理到http://www.baidu.com/api
                target: 'http://www.baidu.com/',
                // 开发跨域
                changeOrigin: true,
                pathRewrite: {
                    // 重写路由：假设想把 localhost:8888/api2/login 变成www.baidu.com/login
                    '^/api': ''
                }
            },
        }
    },
    configureWebpack: {
        // provide the app's title in webpack's name field, so that
        // it can be accessed in index.html to inject the correct title.
        name: name,
        resolve: {
            alias: {
                '@': resolve('src')
            }
        },
        // 配置webpack打包时排除项：
        externals: externals,

    },
    chainWebpack(config) {
        // it can improve the speed of the first screen, it is recommended to turn on preload
        config.plugin('preload').tap(() => [{
            rel: 'preload',
            // to ignore runtime.js
            // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
            fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
            include: 'initial'
        }])

        // 执行打包时执行:
        // 配置html插件cdn项
        config.plugin('html').tap((args) => {
            args[0].cdn = cdn;
            return args;
        })

        // when there are many pages, it will cause too many meaningless requests
        config.plugins.delete('prefetch')

        // set svg-sprite-loader
        config.module
            .rule('svg')
            .exclude.add(resolve('src/icons'))
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end()

        config
            .when(process.env.NODE_ENV !== 'development',
                config => {
                    config
                        .plugin('ScriptExtHtmlWebpackPlugin')
                        .after('html')
                        .use('script-ext-html-webpack-plugin', [{
                            // `runtime` must same as runtimeChunk name. default is `runtime`
                            inline: /runtime\..*\.js$/
                        }])
                        .end()
                    config
                        .optimization.splitChunks({
                            chunks: 'all',
                            cacheGroups: {
                                libs: {
                                    name: 'chunk-libs',
                                    test: /[\\/]node_modules[\\/]/,
                                    priority: 10,
                                    chunks: 'initial' // only package third parties that are initially dependent
                                },
                                elementUI: {
                                    name: 'chunk-elementUI', // split elementUI into a single package
                                    priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                                    test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                                },
                                commons: {
                                    name: 'chunk-commons',
                                    test: resolve('src/components'), // can customize your rules
                                    minChunks: 3, //  minimum common number
                                    priority: 5,
                                    reuseExistingChunk: true
                                }
                            }
                        })
                        // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
                    config.optimization.runtimeChunk('single')
                }
            )
    }
}