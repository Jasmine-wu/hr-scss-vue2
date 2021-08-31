# 人力资源管理平台
    - 桌面web项目
    - vue+vuex+vue-router+vue-element-template + elementUI + sass(scss)

## 主要功能
    - 1.表单校验
    - 2.区分不同的环境
        （1）在js中可通过固有环境变量process.env.NODE_ENV==='development'来判断
            - 当为production时为生产环境 为development时为开发环境。
        （2）可通过nodejs服务环境文件.env.development/.env.production
            -  分析：
                -（1）当运行 npm run dev/yarn serve时，nodejs服务下的环境变量process.env会自动读取.env.development文件里的变量
                -（2）当运行 npm buildv/yarn build时，nodejs服务下的环境变量process.env会自动读取.env.production文件里的变量
            - 解决： 使用process.env.变量时，nodejs会自动加载对应环境文件的变量
    - 3.解决跨域问题：
        - 总的思路：设置前端服务器为代理服务器，网站像前端服务器发起请求，由前端服务器转发给真实的后台接口服务器
        - 跨域实现思路：
            - 网页如何开发服务器发起请求？
                 - 网站向网站服务器(我们运行在本地的是vue内部开启的devServe)发起请求（axios baseURL不要设置域名），不设置域名，axiso发起ajax请求就是向localhost发起的。假如我们设置baseURL:/api，则axiso发起的ajax请求为:localhost:port/api
            - 网站向服务器发起请求以后，开发服务器如何实现代理的？
                - 通过在vue.config.js文件里配置开发服务器的代理。
                - 设置一个触发条件,比如‘/api’,即遇到/api
                - 设置target，则触发代理以后代理到哪里去，假如是：http://www.baidu.com/
                - 开发服务器要开启跨域
                - 是否要重写路由
                - 以上：假如我们使用axios发起请求，axios请求的url是sync/login,配置的baseURL:'/api',则发起ajax请求完整路由：http://localhost:port/api/sync/login, 此时因为请求里包含/api， 则会触发代理，代理后的路由为：http://www.baidu.com/api/sync/login
        （1）解决开发环境跨域问题：vue-cli配置跨域代理
            ```javascript
                        '/api2': {
                            // 遇到/api2触发代理，localhost:8888/api2代理到http://www.baidu.com/api
                            target: 'http://www.baidu.com/',
                            // 服务器开启跨域
                            changeOrigin: true, 
                            pathRewrite: {
                                // 重写路由：假设想把 localhost:8888/api2/login 变成www.baidu.com/login
                                '^/api': '' 
                            }
                        },
                   
            ```
        （2）解决生产环境跨域问题：
            - 生产环境，需将前端项目部署在具有反向代理功能的服务器上，比如nginx,然后在nginx上配置
    - 4.区分axios在不同环境下的请求baseURL
        - 首先在环境文件中设置固定变量VUE_APP_BASE_API，该变量可以作为axios请求的baseURL。
        - 再使用：
            ```js
            const service = axios.create({
                // baseURL=/api会触发代理
                // localhost:port/api 代理到 http://ihrm-java.itheima.net/api
                baseURL: process.env.VUE_APP_BASE_API,
                timeout:5000,
            });     

            ```
    -  5.vuex+本地缓存管理token
        - mapGetters需映射到组件的计算属性中
        - 映射mapActions(['user/login'])， 不能有/， 调用this['user/login']()
    -  6.处理响应拦截器
        - （1）对请求失败统一添加reject处理
            - 前提是：人资项目的接口,如果执行失败,只是服务器只是设置了success=false，并没有reject抛出错误。
            - 没有reject，那么我们发起请求时用try-catch就会捕捉不到请求失败
            - 解决：
                ```js
                service.interceptors.response.use(
                    // 2xx以内会进这里
                    response => {
                    // axios多包了一层data
                        if (response.data.success) {
                            return response.data;
                        } else {
                            message(response.data.message);
                            return Promise.reject(new Error(response.data.message));
                        }
                     },
                 // 2xx以外进这里
                error => {
                     message(error.message);
                     return Promise.reject(error);

                    }
                );
                ```

    - 7 权限拦截
        - 有token,是不是在登陆页,是，直接跳转到主页，
        - 没token，是不是在白名单（404/login），不在，跳到登陆页
    
    - 8 样式修改
        - 侧边栏Sidebar背景色/背景图/选中效果/折叠和展开时login显示
        - Navbar左边汉堡按钮svg图片颜色修改(fill属性)/右下拉/中标题
    
    - 9 封装用户信息action，并在在权限拦截permission处获取用户信息
        - 如何只获取一次
        - 获取用户信息之前要确保有token
    
    - 10  解决vue动态img src动态设置图片时，本地图片加载出来的问题
