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
        - 基础模板在环境文件中定义了变量VUE_APP_BASE_API，该变量可以作为axios请求的baseURL。
        - 使用：
            ```js
            const service = axios.create({
                // baseURL=/api会触发代理
                // localhost:port/api 代理到 http://ihrm-java.itheima.net/api
                baseURL: process.env.VUE_APP_BASE_API,
                timeout:5000,
            });     

            ```
    -  5.vuex+本地缓存管理token
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


