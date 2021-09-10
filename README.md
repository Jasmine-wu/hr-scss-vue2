# 人力资源管理平台
    - 桌面web项目
    - vue-element-template+ vuex + vue-router+ elementUI + sass(scss)

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
        - 免登陆；进入登陆页时，如果有token，直接跳转到主页
    
    - 8 样式修改
        - 侧边栏Sidebar背景色/背景图/选中效果/折叠和展开时login显示
        - Navbar左边汉堡按钮svg图片颜色修改(fill属性)/右下拉/中标题
    
    - 9 封装用户信息action，并在在权限拦截permission处获取用户信息
        - 如何只获取一次
        - 获取用户信息之前要确保有token
    
    - 10 ue动态img的src属性动态设置图片时，图片加载不出来
        - （1）服务器返回的url不为空，但是服务器图片失效了，或者url有问题）
        - （2）服务器返回的url为空
        - （3）如果src属性是v-bind赋值，这时src直接加载本地图片也是加载不出来
        - 解决：（1）（2）加载错误都可以用img的onerror事件监听到 （3）用require
        - 技巧：如何一次性注册所有的全局指令

    - 11 登出逻辑action
        - 移除token-移除用户基本信息-跳到登陆页

    - 12 处理token过期问题
        - （1）主动介入：客户端做判断
            - 在获取时存入时间戳
            - 在token注入的地方判断当前时间与token获取时间>=过期时间->有->logout清除token->跳转登陆页->reuturn Promise.reject(new Error(“身份令牌过期了，请重新登陆”))
        - （2）被动介入：服务器判断token是否超时，返回一个error
            - 响应拦截器里，判断error.response里的token过期的字段是不是过期值

    - 13 路由模块化：分为动态路由和静态路由整理
        - 静态路由：所有人都能访问
        - 动态路由：有权限的人能访问
        - 动态路由和静态路由的设置
        - 动态路由和静态路由的合并
        - 在vue-admin-template这个模版，左侧菜单导航栏的数据来源于路由

    - 14 item.vue :函数式组件的应用
        - 组件内：fuctional=true,
        - 组件内：咩有vdata响应式数据，没有this，只接收props属性
        - 组件内：render函数

    - 15 树形组件el-tree
        - （1）自定义树形组件的内容，并单独封装成组件tree-node
        - （2）将数组数据转化成树形数据
            - 原始数组数据：数组里每条部门数据里pid表示父部门是哪个
            - 用递归算法
            - 具体如何遍历？
                - 找到根id
        - 扩展：如何将树形数据转化成数组数据？

        
    - 16 vue.js的sync修饰符的使用
        - 常规: 子组件修改自身props属性，需$emit通知父组件来修改
        - sync提供了一种简写形式
        ```js
            //子组件内
            //固定写法：
            this.$emit("update:要修改的组件props属性名", 属性值)
            this.$emit('update:showDialog', false);
            //父组件中：
            //该子组件修改的props属性用sync修饰
            <child  :showDialog.sync="isShowDialog" />

        ```

    - 17 父组件调用子组件中的方法
        - this.$refs.refname.functionName

    - 18 计算属性设置dialog的标题
    - 19 区分编辑/添加状态，分别设置不同的校验规则和显示不同的弹窗数据
    - 20 添加区域loading
    - 21 封装全局组件
            - （1）具名插槽的使用
            - （2）统一注册全局组件

    - 22 格式化el-table枚举类型列数据
    - 23 封装一个上传excel文件的组件- 上传excel表格批量导入表格数据
        - 需求分析：新增员工，可以单个增加，也可以导入excel表格批量增加
        - 选择文件上传
        - 拖拽文件上传
        - 实现: 
            - vue-element-admin已实现了该功能，我们拿来进行二次改造：https://github.com/PanJiaChen/vue-element-admin/blob/master/src/components/UploadExcel/index.vue
            - 该实现是对xsxl插件的二次封装，需： yarn add xlsx
            - 注意的是：xsxl插件在解析excel表格里的时间格式数据，比如1992/12/1时，会将其转换成数值型数据，比如44550.
                - 如果你的后台需要接收的是日期类型的数据，则需要将数值数据格式化成日期格式字符串，再转换成日期类型数据。

    - 24 封装一个将员工数据批量导出成excel表格的功能
        - 实现：
            - vue-element-admin已实现Export2Excel.js二次封装js-xlsx实现了导出成excel的功能
            - Export2Excel依赖js-xlsx，file-saver，script-loader
                - yarn add xlsx file-saver script-loader （注意script-loader 提供按需加载功能，生产。开发环境都要用）
            - 注意的是：Export2Excel接收的数据是二维数组格式数据
                - 需将后台json格式数据[{{},{}}]转化成二维数据[[],[]]
                - 单独对后台字符串日期数据进行处理:"2018-11-16T00:00:00.000+0000"转成2004/11/3
    

            





