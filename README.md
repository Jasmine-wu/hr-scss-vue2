# 人力资源管理平台
    - 桌面web项目
    - vue-element-template + vuex + vue-router+ elementUI + sass(scss)
    - qrcode：生成二维码插件
    - vue-print-nb：打印功能
    - screenfull: 页面全屏显示

## 一.表单校验
## 二.区分生产/开发环境:
### 1.在js中可通过固有环境变量process.env.NODE_ENV==='development'来判断
    当为production时为生产环境 为development时为开发环境。
### 2.可通过nodejs服务环境文件.env.development/.env.production
        分析:
        1.当运行 npm run dev/yarn serve时，nodejs服务下的环境变量process.env会自动读取.env.development文件里的变量
        2. 当运行 npm buildv/yarn build时，nodejs服务下的环境变量process.env会自动读取.env.production文件里的变量
        解决: 使用process.env.变量时，nodejs会自动加载对应环境文件的变量
## 三.解决跨域问题：
    总的思路：
        设置前端服务器为代理服务器，网站向前端服务器发起请求，由前端服务器转发给真实的后台接口服务器
        我们这里主要解决的是开发环境的跨域问题。
        生产环境需将前端项目部署在具有反向代理功能的服务器上，比如nginx,然后在nginx上配置
    
    跨域实现思路：
        - 网页如何开发服务器发起请求？
            - 网站向网站服务器(我们运行在本地的是vue内部开启的devServe)发起请求（axios baseURL不要设置域名），不设置域名，axiso发起ajax请求就是向localhost发起的。假如我们设置baseURL:/api，则axiso发起的ajax请求为:localhost:port/api
        - 网站向服务器发起请求以后，开发服务器如何实现代理的？
            - 通过在vue.config.js文件里配置开发服务器的代理。
            - 设置一个触发条件,比如‘/api’,即遇到/api
            - 设置target，则触发代理以后代理到哪里去，假如是：http://www.baidu.com/
            - 开发服务器要开启跨域
            - 是否要重写路由
            - 以上：假如我们使用axios发起请求，axios请求的url是sync/login,配置的baseURL:'/api',则发起ajax请求完整路由：http://localhost:port/api/sync/login, 此时因为请求里包含/api， 则会触发代理，代理后的路由为：http://www.baidu.com/api/sync/login
### 解决开发环境跨域问题：
#### 1.vue-cli配置跨域代理

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
#### 2.区分axios在不同环境下的请求baseURL
##### （1）首先在环境文件中设置固定变量VUE_APP_BASE_API，该变量可以作为axios请求的baseURL
##### （2）配置axios baseURL
```javascript
const service = axios.create({
    // baseURL=/api会触发代理
    // localhost:port/api 代理到 http://ihrm-java.itheima.net/api
    baseURL: process.env.VUE_APP_BASE_API,
    timeout:5000,
});     

```
## 五.vuex+本地缓存管理token
    - mapGetters需映射到组件的计算属性中
    - 映射mapActions(['user/login'])， 不能有/， 调用this['user/login']()

## 六.处理axios响应拦截器
### 1.对请求失败统一添加reject处理
        - 前提是：人资项目的接口,如果执行失败,只是服务器只是设置了success=false，并没有reject抛出错误。
        - 没有reject，那么我们发起请求时用try-catch就会捕捉不到请求失败
        - 解决：
```javascript
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
## 七.权限拦截
    - 有token,是不是在登陆页,是，直接跳转到主页，
    - 没token，是不是在白名单（404/login），不在，跳到登陆页
    - 免登陆；进入登陆页时，如果有token，直接跳转到主页

## 八.vue-template-admine样式修改
    - 侧边栏Sidebar背景色/背景图/选中效果/折叠和展开时login显示
    - Navbar左边汉堡按钮svg图片颜色修改(fill属性)/右下拉/中标题

## 九.封装用户信息action，并在在权限拦截permission处获取用户信息
    - 如何只获取一次
    - 获取用户信息之前要确保有token

## 十.img标签，图片加载的错误处理
    - 解决： 自定义imgerror全局指令
    - （1）服务器返回的url不为空，但是服务器图片失效了，或者url有问题）
    - （2）服务器返回的url为空串
    - 解决：（1）（2）加载错误都可以用img的onerror事件监听到 
    - 注意：如果src属性是v-bind赋值，这时src直接加载本地图片也是加载不出来
    - 注意：如果src绑定的值是null值, 是不会触发onerror事件的
    - 注意: 自定义指令inserted和componentUpdated钩子函数的使用区别！

## 十一.登出逻辑action
     - 移除token-移除用户基本信息-跳到登陆页

## 十二.处理token过期问题
### 主动介入：客户端做判断
    - 在获取时存入时间戳
    - 在token注入的地方判断当前时间与token获取时间>=过期时间->有->logout清除token->跳转登陆页->reuturn Promise.reject(new Error(“身份令牌过期了，请重新登陆”))
### 被动介入：服务器判断token是否超时，返回一个error
    - 响应拦截器里，判断error.response里的token过期的字段是不是过期值

## 十三.路由模块化：分为动态路由和静态路由整理
    - 静态路由：所有人都能访问
    - 动态路由：有权限的人能访问
    - 动态路由和静态路由的设置
    - 动态路由和静态路由的合并
    - 在vue-admin-template这个模版，左侧菜单导航栏的数据来源于路由
## 十四.函数式组件的应用：item.vue
    - 组件内：fuctional=true,
    - 组件内：咩有vdata响应式数据，没有this，只接收props属性
    - 组件内：render函数

## 十五.树形组件el-tree
    - （1）自定义树形组件的内容，并单独封装成组件tree-node
    - （2）将数组数据转化成树形数据
        - 原始数组数据：数组里每条部门数据里pid表示父部门是哪个
        - 用递归算法
        - 具体如何遍历？
            - 找到根id
    - 扩展：如何将树形数据转化成数组数据？

## 十六.vue sync修饰符的使用
​      - 常规: 子组件修改自身props属性，需$emit通知父组件来修改
​      - sync提供了一种简写形式
```js
            //子组件内
​            //固定写法：
​            this.$emit("update:要修改的组件props属性名", 属性值)
​            this.$emit('update:showDialog', false);
​            //父组件中：
​            //该子组件修改的props属性用sync修饰
​            <child  :showDialog.sync="isShowDialog" />
```
​    
## 十七.父组件调用子组件中的方法
​     - this.$refs.refname.functionName
## 十八.计算属性设置dialog的标题
## 十九.区分编辑/添加状态，分别设置不同的校验规则和显示不同的弹窗数据
## 二十.添加区域loading
## 二十一.封装全局组件
### 具名插槽的使用
### 统一注册全局组件

## 二十二.格式化el-table枚举类型列数据
## 二十三.封装上传excel文件组件
    - 需求分析：新增员工，可以单个增加，也可以导入excel表格批量增加
    - 选择文件上传
    - 拖拽文件上传
    - 实现: 
        - vue-element-admin已实现了该功能，我们拿来进行二次改造：https://github.com/PanJiaChen/vue-element-admin/blob/master/src/components/UploadExcel/index.vue
        - 该实现是对xlsx插件的二次封装，需： yarn add xlsx
        - 注意的是：xlsx插件在解析excel表格里的时间格式数据，比如1992/12/1时，会将其转换成数值型数据，比如44550.
            - 如果你的后台需要接收的是日期类型的数据，则需要将数值数据格式化成日期格式字符串，再转换成日期类型数据。

## 二十四.封装导出成excel表格的功能
    - 实现：
        - vue-element-admin已实现Export2Excel.js二次封装js-xlsx实现了导出成excel的功能
        - Export2Excel依赖js-xlsx，file-saver，script-loader
            - yarn add xlsx file-saver script-loader （注意script-loader 提供按需加载功能，生产。开发环境都要用）
        - 注意的是：Export2Excel接收的数据是二维数组格式数据
            - 需将后台json格式数据[{{},{}}]转化成二维数据[[],[]]
            - 单独对后台字符串日期数据进行处理:"2018-11-16T00:00:00.000+0000"转成2004/11/3
## 二十五.上传图片组件
### yarn add cos-js-sdk-v5, 上传图片至腾讯云，必须下载这个包
### 封装el-upload组件
```js   
            // 1.缩略图预览/删除
            // 2.根据图片上传的数量控制是否显示上传+号:计算属性
            //  - 问题：删除图片至0张，上传+号并没有显示出来
            //  - 问题：上传的图片未显示
            // 3.上传之前限制图片上传的数量和size
            // 4.上传至腾讯云:
            //  - 上传至腾讯云成功以后，fileList里对应图片的url也应该替换成远程url
            //  - 并且需要标记该图已上传（已上传的图片才允许用户点击保存）
            //  - 上传进度显示
            //  - 上传成功后处理返回数据
```
## 二十六.根据图片地址生成二维码
    - yarn add qrcode
    - import QrCode from "qrcode"
    - 准备canvas标签作为容器
```js
    this.$nextTick(() => {
        // 根据图片地址生成二维码图像
        QrCode.toCanvas(this.$refs.myCanvas, url);
    });    
```
## 二十七.打印功能
    - 根据查询参数type区分不同类型，同一打印页面实现打印个人不同信息
    - 打印功能：
        - 右键浏览器点击打印完成打印
            - 浏览器打印的问题：浏览器会把整个浏览器页面都打印出来，不合适
        - 自己实现打印（推荐）
    - 自己实现打印：
### 使用vue-print-nb插件
        - yarn add vue-print-nb
        -  全局注册组件,即可使用v-print指令
```js
            <el-row type="flex" justify="end">
                <el-button v-print="printObj" size="small" type="primary">打印</el-button>
                </el-row>
            printObj: {
                id: 'myPrint' //你想打印内容根标签的id
            }
```
## 二十八.权限设计和管理
    - 基于个人的单独权限设置,低效
    - 优化：基于角色的权限设置,即RBAC（推荐）
        - RBAC：
            - 添加Role中间层
            - 给用户分角色，给角色配置权限

### 权限设计-RBAC实现：
#### 1.新建权限(点)管理页面 （所有权限点）
    - 企业服务中，权限分类：
        - 页面访问权限
        - 按钮操作权限
        - API访问权限（一般后端做）
    - 结构
        - 模块路由权限
            - 该模块有哪些功能权限
        - 操作
            - 增加
            - 编辑
            - 删除
#### 2.新建分配角色弹层-在员工管理页（给用户添加角色）

#### 3.新建角色管理页面 （给角色分配权限点）
        - 可新建角色
        - 每个角色都可
            - 分配权限
            - 编辑角色
            - 删除角色 
### 权限管理-应用用户拥有的权限
#### 用户权限受控分类
    - api使用权限(一般后台做，这里不考虑)
    - 路由访问权限受控
    - 功能权限受控
#### 1.控制路由访问权限
    - 需求：根据用户实际的权限来动态设置满足权限的动态路由
    - 总的思路：
        - 1。梳理所有路由，将不需要权限人人都可以访问的放到静态路由数组中
        - 2. 将需要权限访问的所有路由放到动态路由数组中。
        - 3. 静态路由在注册路由表时添加。
        - 4. 获取用户路由访问权限后，则根据其路由访问权限，从动态路由中筛选满足用户路由访问权限的路由，再动态添加到路由表中。
    
    - 具体如何做？：
##### （1）.在vuex中新建路由权限管理模块-permission
        - 定义state属性routes，
            - 建立mapGetter快捷访问,可用于生成侧边导航栏
        - 定义筛选满足用户权限的路由数组action
            - 如何过滤？
                - 登陆时获取用户路由权限信息-（即权限标识数组，后台给的权限标识要与路由name一致）
                - 根据用户真实的路由访问权限，从动态路由中筛选中满足用户权限的路由
##### （2）.将筛选出的满足权限的路由数组动态添加到路由表中

        - router.addRoutes(xxx);
    
        - addRoutes动态添加路由的bug:
            - 1.在addRoutes添加路由之后应该使用 next(to.path)，而不是next()否则会使刷新页面之后 权限消失，这属于一个vue-router的已知缺陷
            - 2. 动态添加路由，用this.$router.options.routes是获取不到的，this.$router.options.routes只能获取路由表注册时添加的路由。因此侧边导航栏不应该根据this.$router.options.routes生成
    
        - 为什么是addRoutes而不是push?
            - push只能push路由表中已存在的路由（router对象创建时设置的路由表，又称静态路由）
            - addRoutes之所以叫动态设置路由，是指在路由表routes设置以后，再添加路由表中不存在的路由。

#####  （3）. 在注册路由表的地方，解除动态路由和静态路由的临时合并，只添加静态路由
#####  （4）. 当前用户logout以后，重置路由以及vuex中routes值
            - 问题：当前用户登出后，如果不重置路由，router会保留上次用户的router设置，vuex permission模块也会保留上次routes值
            - 解决：
                - 重置路由
                    - 调用resetRouter方法重新创建router实例
                - 重置vuex中permission模块routes值

##### （5）. 将404路由放至动态路由的末尾
            - vue-router里的404路由需放到所有路由的最后面
            - 404放到静态路由的最后面，引发的bug：
                - 当访问动态路由页面时，再次刷新页面，会跳转到404页面

#### 2. 控制可使用的功能
        - 需求：根据当前用户的功能权限，控制项目的某些功能该用户是否可以使用
        - 比如按钮的使用权限
        - 思考：受控的按钮很多，且分布在不同vue文件，难道每个文件都做权限判断么？
        - 解决：
            - 为啥不封装一个检查防范放到工具类,所有文件也都能使用？
                - 因为每个文件还需要导入
            - 全局注册混入对象,所有vue文件都可以使用混入对象里的checkPermission方法
                - 根据检查权限方法的返回值，disabled或者隐藏首先要功能组件
## 二十九.工作日历组件封装
        - 1.下拉选择年份/月份
        - 2.隐藏日历自带的头部
        - 3.选择月份/年份后，切换日历显示
                - 动态修改日历的绑定值currentDate
        - 4.自定义dateCell的内容
                - 比如在周末/周日/节假日后面添加 休 字
        - 5. 修改日期选中时的样式

## 三十.雷达图组件封装
        - yarn add echarts
        - 按需引入echarts雷达图

## 三十一.页面的全屏功能
        - 核心两个方法：
            - 全屏：document.documentElement.requestFullscreen()
            - 退出全屏：document.exitFullscreen()
    
        - 我们这里使用全屏显示插件screenfull

##  三十二.多语言切换（重点）
            - 多语言又称国际化
### 采用国际化i18n方法
#### 1.yarn add vue-i18n
#### 2.新建实例化vue-i18n文件:src/lang/index.js
        - 配置locale选项 - 当前是那种语言
        - 配置messages选项 - 各个语言对应加载哪些语言包
#### 3.将实例挂载到所有Vue实例上（main.js）=》这样所有vue实例都拥有 $t 函数
#### 4.第三方组件库element-ui多语言如何应用？
##### （1）在i18n实例文件里,导入element-ui多语言语言包，配置好messages选项
##### （2）让多语言包生效，local是zh的时候，显示中文，local是en事，显示英文：
```js
    // elment-ui本身支持i18n的处理
    // 如何处理？
    // 根据传入key,i18n会根据当前的local属性去加载对应的语言包里对应内容（element-ui已经帮我们做好）
    Vue.use(ElementUI, {
        // i18n选项是一个回调函数
        i18n: (key, value) => i18n.t(key), //t方法会去对应的语言包里找对应的内容
    });
```
#### 5. 自定义vue组件多语言如何应用？
##### （1） 先写好多语言文件, zh.js/en/js/ja.js等，如何写参考elemnt-ui多语言文件是怎么写
##### （2）在i18n实例文件里，导入自定义多语言包，配置好messages选项
##### （3） 让自定义多语言文件生效
        - i18n会根据local属性值，自动加载对应语言包，因此我们需要做的就是告诉组件你要显示语言包里的哪个内容
###### 所有自定子组件需要做多语言的都如下获取：
```js
//onlyOneChild.name是多语言文件下的key值
        :title="$t('route.' + onlyOneChild.name)"
        - 6. 动态切换语言
            - 即：改变i18n实例里local值
                ```js
                        // 数据持久化
                    Cookie.set("lang", lang);
                        // 设置当前语言
                        this.$i18n.locale = lang;
```
 ##  三十三.集成多页签组件
        - 实现tab页打开路由的功能
        - 集成tagsView组件

##  三十四.动态换肤
        - 本项目集成的是element-ui换肤组件：
        - 从elment-ui动态换肤方案得到的启发：
            - 用scss写文件样式，将样式，背景图等全部用变量表示
            - 切换主题时，覆盖变量，达到换肤效果

##  三十五.打包上线
### 1.配置打包之前的路由模式
        - hash转history模式
        - 或者根据项目需求，配置路由前缀地址？base

### 2.打包优化
        - 文件越大，对访问速度，网络带宽要求越高，1个100M的文件的访问速度远远小于10个10M小文件的访问速度
        - 打包优化这种东西，dev环境没必要做
        - 本项目采取的方案：将大文件放到cdn服务器上. CDN有加速服务器，加速对插件的访问速度
        - 总的思路：将打包文件变小，将文件放到专门的服务器上，不打包进来

 - 具体：
#### （1）使用vue-cli提供的性能分析工具,分析出最大的几个文件是哪些
            - yarn/npm run preview -- --report
#### （2）将大文件放到CDN服务器上。
#### （3）在vue.config.js文件里，区分环境，是生产环境才：
- 1 定义webpack打包排除项:externals
- 2 定义cdn配置文件
```js
    // 判断环境，只有在生产环境，才做打包排除和配置cdn配置文件
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
```
#### （4）让排除项以及cdn配置文件生效
#####  让打包排除项生效

```js
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
```
#####  让cdn配置文件生效
- 1.使用html-webpack-plugin插件，配置插件cdn项
```javascript

config.plugin('html').tap((args) => {
    args[0].cdn = cdn;
    return args;
})

```
- 2.使用html-webpack-plugin插件，将cdn文件注入到模版public/index.html文件中
```html
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
        <link rel="icon" href="<%= BASE_URL %>favicon.ico">
        <title>
            <%= webpackConfig.name %>
        </title>
        <!-- 通过htmlWebpackPlugin引入cdn配置文件里样式文件 -->
        <% for(var css of htmlWebpackPlugin.options.cdn.css) { %>
            <link rel="stylesheet" href="<%=css%>">
            <% } %>
    </head>

    <body>
        <noscript>
        <strong>We're sorry but <%= webpackConfig.name %> doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
        </noscript>
        <div id="app"></div>
        <!-- built files will be auto injected -->

        <!-- 通过htmlWebpackPlugin引入cdn配置文件里的js文件 -->
        <% for(var js of htmlWebpackPlugin.options.cdn.js) { %>
            <script src="<%=js%>"></script>
            <% } %>
    </body>

```

#### （5）打包: yarn run build:prod

### 3. 上线
#### (1)使用koa框架部署项目
```shell
        #建立hrServer文件夹 
        mkdir hrServer 
        npm init -y
        #安装服务端框架koa
        npm i koa koa-static 
        #拷贝上小节打包的dist目录到**`hrServer/public`**下
        #在根目录下创建app.js

```

 ```js
        // app.js
        const Koa  = require('koa')
        const serve = require('koa-static');

        const app = new Koa();
        app.use(serve(__dirname + "/public")); //将public下的代码静态化
        app.listen(3333, () => {
            console.log('人资项目启动')
        })

 ```
#### (2) 解决history模式页面刷新notFound的问题
```js
// npm i koa2-connect-history-api-fallback #专门处理history模式的中间件
        const Koa  = require('koa')
        const serve = require('koa-static');
        const  { historyApiFallback } = require('koa2-connect-history-api-fallback');
        const path = require('path')
        const app = new Koa();
        // 这句话 的意思是除接口之外所有的请求都发送给了 index.html
        app.use(historyApiFallback({ 
            whiteList: ['/prod-api']
        }));  // 这里的whiteList是 白名单的意思
        app.use(serve(__dirname + "/public")); //将public下的代码静态化

        app.listen(3333, () => {
            console.log('人资项目启动')
        })

```

#### (3) 解决生产环境跨域问题
```js
// npm i koa2-proxy-middleware: 处理跨域的中间件
       const proxy = require('koa2-proxy-middleware')
        app.use(proxy({
        targets: {
            // (.*) means anything
            '/prod-api/(.*)': {
                target: 'http://ihrm-java.itheima.net/api', //后端服务器地址
                changeOrigin: true,
                pathRewrite: { 	
                    '/prod-api': ""
                }
            }
        }
        }))

```







​           


​        





​            

​                    

​            





