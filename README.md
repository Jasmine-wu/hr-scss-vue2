# 人力资源管理平台
    - 桌面web项目
    - vue-element-template + vuex + vue-router+ elementUI + sass(scss)
    - qrcode：生成二维码插件
    - vue-print-nb：打印功能
    - screenfull: 页面全屏显示

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
    
    - 10 vue动态设置img的src属性时，图片加载的错误处理
        - 解决： 自定义imgerror全局指令
        - （1）服务器返回的url不为空，但是服务器图片失效了，或者url有问题）
        - （2）服务器返回的url为空串
        - 解决：（1）（2）加载错误都可以用img的onerror事件监听到 
        - 注意：如果src属性是v-bind赋值，这时src直接加载本地图片也是加载不出来
        - 注意：如果src绑定的值是null值, 是不会触发onerror事件的
        - 注意: 自定义指令inserted和componentUpdated钩子函数的使用区别！

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

    - 25 上传图片组件
        - 上传图片至腾讯云，必须下载： yarn add cos-js-sdk-v5 这个包。
        - 封装el-upload组件
            - // 限制图片上传的个数：limit
                ```js
                // 缩略图预览/删除
                // 根据图片上传的数量控制是否显示上传+号:计算属性
                //  - 问题：删除图片至0张，上传+号并没有显示出来
                //  -  问题：上传的图片未显示
                // 上传之前限制图片上传的数量和size
                // 上传至腾讯云
                //  - 上传至腾讯云成功以后，fileList里对应图片的url也应该替换成远程url
                //  - 并且需要标记该图已上传（已上传的图片才允许用户点击保存）
                //  - 上传进度显示
                //  - 上传成功后处理返回数据
                ```
    - 26 根据图片地址生成二维码
        - yarn add qrcode
        - import QrCode from "qrcode"
        - 准备canvas标签作为容器
            ```js
                this.$nextTick(() => {
                    // 根据图片地址生成二维码图像
                    QrCode.toCanvas(this.$refs.myCanvas, url);
                });    
                        ```
    - 27 单独的打印页面
        - 根据查询参数type区分不同类型，打印个人详情/岗位信息
        - 打印功能：
            - 右键浏览器点击打印完成打印
                - 浏览器打印的问题：浏览器会把整个浏览器页面都打印出来，不合适
            - 自己实现打印（推荐）
        - 实现打印：
            - 借助打印组件vue-print-nb
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
    - 28 权限设计和管理
        - 基于个人的单独权限设置,低效
        - 优化：基于角色的权限设置,即RBAC（推荐）

        - RBAC：
            - 添加Role中间层
            - 给用户分角色，给角色配置权限
        - RBAC实现：
             - 新建权限(点)管理页面 （所有权限点）
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
            - 新建分配角色弹层-在员工管理页（给用户添加角色）
       
            - 新建角色管理页面 （给角色分配权限点）
                    - 可新建角色
                    - 每个角色都可
                        - 分配权限
                        - 编辑角色
                        - 删除角色

            - 应用用户拥有的权限
                - 用户权限受控
                    - 路由访问权限受控
                    - 功能权限受控
                - 1.控制路由访问权限
                    - 需求：根据用户实际的权限来动态设置满足权限的动态路由
                    - 总的思路：
                        - 1。梳理所有路由，将不需要权限人人都可以访问的放到静态路由数组中
                        - 2. 将需要权限访问的所有路由放到动态路由数组中。
                        - 3. 静态路由在注册路由表时添加。
                        - 4. 获取用户路由访问权限后，则根据其路由访问权限，从动态路由中筛选满足用户路由访问权限的路由，再动态添加到路由表中。

                    - 具体如何做？：
                        - 1.在vuex中新建路由权限管理模块-permission
                            - 定义state属性routes，
                                - 建立mapGetter快捷访问,可用于生成侧边导航栏
                            - 定义筛选满足用户权限的路由数组action
                                - 如何过滤？
                                    - 登陆时获取用户路由权限信息-（即权限标识数组，后台给的权限标识要与路由name一致）
                                    - 根据用户真实的路由访问权限，从动态路由中筛选中满足用户权限的路由
                        - 2.将筛选出的满足权限的路由数组动态添加到路由表中
                            - router.addRoutes(xxx);
                            - addRoutes动态添加路由的bug:
                                - 1.在addRoutes添加路由之后应该使用 next(to.path)，而不是next()否则会使刷新页面之后 权限消失，这属于一个vue-router的已知缺陷

                                - 2. 动态添加路由，用this.$router.options.routes是获取不到的，this.$router.options.routes只能获取路由表注册时添加的路由。因此侧边导航栏不应该根据this.$router.options.routes生成

                            - 为什么是addRoutes而不是push?
                                - push只能push路由表中已存在的路由（router对象创建时设置的路由表，又称静态路由）
                                - addRoutes之所以叫动态设置路由，是指在路由表routes设置以后，再添加路由表中不存在的路由。

                        - 3. 在注册路由表的地方，解除动态路由和静态路由的临时合并，只添加静态路由
                        - 4. 当前用户logout以后，重置路由以及vuex中routes值
                            - 问题：当前用户登出后，如果不重置路由，router会保留上次用户的router设置，vuex permission模块也会保留上次routes值
                            - 解决：
                                - 重置路由
                                    - 调用resetRouter方法重新创建router实例
                                - 重置vuex中permission模块routes值

                        - 5. 将404路由放至动态路由的末尾
                            - vue-router里的404路由需放到所有路由的最后面
                            - 404放到静态路由的最后面，引发的bug：
                                - 当访问动态路由页面时，再次刷新页面，会跳转到404页面

                - 2.控制可使用的功能
                    - 需求：根据当前用户的功能权限，控制项目的某些功能该用户是否可以使用
                    - 比如按钮的使用权限
                    - 思考：受控的按钮很多，且分布在不同vue文件，难道每个文件都做权限判断么？
                    - 解决：
                        - 为啥不封装一个检查防范放到工具类,所有文件也都能使用？
                            - 因为每个文件还需要导入
                        - 全局注册混入对象,所有vue文件都可以使用混入对象里的checkPermission方法
                            - 根据检查权限方法的返回值，disabled或者隐藏首先要功能组件
        - 29 工作日历组件封装
            - 1.下拉选择年份/月份
            - 2.隐藏日历自带的头部
            - 3.选择月份/年份后，切换日历显示
                 - 动态修改日历的绑定值currentDate
            - 4.自定义dateCell的内容
                  - 比如在周末/周日/节假日后面添加 休 字
            - 5. 修改日期选中时的样式

        - 30 雷达图组件封装
            - yarn add echarts
            - 按需引入echarts雷达图

        - 31 页面的全屏功能
            - 核心两个方法：
                - 全屏：document.documentElement.requestFullscreen()
                - 退出全屏：document.exitFullscreen()

            - 我们这里使用全屏显示插件screenfull

        - 32 多语言切换（重点）
            - 多语言又称国际化
            - 这里采用国际化i18n方法
                - 1.yarn add vue-i18n
                - 2.新建实例化vue-i18n文件:src/lang/index.js
                    - 配置locale选项 - 当前是那种语言
                    - 配置messages选项 - 各个语言对应加载哪些语言包
                - 3.将实例挂载到所有Vue实例上（main.js）=》这样所有vue实例都拥有 $t 函数
                - 4.第三方组件库element-ui多语言如何应用？
                    - 1.在i18n实例文件里,导入element-ui多语言语言包，配置好messages选项
                    - 2.让多语言包生效，local是zh的时候，显示中文，local是en事，显示英文：
                        ```js
                            // elment-ui本身支持i18n的处理
                            // 如何处理？
                            // 根据传入key,i18n会根据当前的local属性去加载对应的语言包里对应内容（element-ui已经帮我们做好）
                            Vue.use(ElementUI, {
                             // i18n选项是一个回调函数
                                i18n: (key, value) => i18n.t(key), //t方法会去对应的语言包里找对应的内容
                            });
                        ```
                - 5. 自定义vue组件多语言如何应用？
                    - 1. 先写好多语言文件, zh.js/en/js/ja.js等，如何写参考elemnt-ui多语言文件是怎么写
                    - 2. 在i18n实例文件里，导入自定义多语言包，配置好messages选项
                    - 3. 让自定义多语言文件生效
                        - i18n会根据local属性值，自动加载对应语言包，因此我们需要做的就是告诉组件你要显示语言包里的哪个内容
                        - 所有自定子组件设计多语言的部分都如下获取：
                        ```js
                        //onlyOneChild.name是多语言文件下的key值
                             :title="$t('route.' + onlyOneChild.name)"
                        ```
                - 6. 动态切换语言
                    - 即：改变i18n实例里local值
                        ```js
                             // 数据持久化
                            Cookie.set("lang", lang);
                             // 设置当前语言
                             this.$i18n.locale = lang;
                        ```





            

                    

            





