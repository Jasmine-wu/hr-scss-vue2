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

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
    // 如果想要中文版 element-ui，按如下方式声明
    // Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})