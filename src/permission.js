// 权限控制逻辑

import router from '@/router';
import store from '@/store';

import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式


// 白名单
const whiteList = ['/login', '/404'];

// 路由前置守卫
router.beforeEach(async(to, from, next) => {
    NProgress.start() // 开启进度条
        // 如果有token
    if (store.getters.token) {
        // 是否是登陆页
        if (to.path === '/login') {
            // 是，直接跳转回首页
            next('/');

        } else {
            // 不是，放行
            // 获取用户信息
            if (!store.getters.userId) {
                await store.dispatch('user/getUserInfo'); //强制等待，获取完了再跳转next
            }
            next();
        }

    } else {
        // 没有token
        // 是否在白名单
        if (whiteList.indexOf(to.path) !== -1) {
            // 在，方行
            next();
        } else {
            // 不在，跳转回登陆页
            next('/login');
        }
    }

    NProgress.done() // 解决手动切换url后置守卫没有调用的问题，手动关闭进度条
});

// // 路由后置守卫
// bug：手动切换url到login地址时，后置守卫没有调用
router.afterEach(() => {
    NProgress.done() // 关闭进度条
});