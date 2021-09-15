import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

// 引入多语言
import i18n from "@/lang"

// 统一注册全局组件
import components from '@/components'
Vue.use(components);

// 注册某一个全局指令
// import { imgerror } from "@/directive"
// Vue.directive("imgerror", imgerror);


// 统一注册全局指令:import * as
// 遍历对象:for in
// es6遍历对象: Object.keys
import * as directives from '@/directive';
Object.keys(directives).forEach(key => {
    Vue.directive(key, directives[key]);
});

// 统一注册全局过滤器
import * as filters from "@/filters"
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
});

// 注册全局混入对象
import CheckPermission from "@/mixins/checkPermission"
Vue.mixin(CheckPermission); //这样混入以后所有组件都拥有了checkPermission（key）方法

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })

// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

// elment-ui本身是支持i18n的
Vue.use(ElementUI, {
    // i18n选项是一个回调函数
    // 传入key,value,i18n会根据当前的local属性去加载对应的语言包
    i18n: (key, value) => i18n.t(key), //t方法会去对应的语言包里找对应的内容
});


Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    // 挂载i18n，这样所有实例都拥有了$t函数
    i18n,
    render: h => h(App)
})