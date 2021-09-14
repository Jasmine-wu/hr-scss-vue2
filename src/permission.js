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
            if (!store.getters.userId) {
                // 获取用户信息
                //强制等待，成功获取用户信息以后再跳转路由
                const { roles } = await store.dispatch('user/getUserInfo');

                // 注意:dispatch操作返回的是Promise对象，Promise对象return返回的结果用await获取
                // 筛选满足用户权限的动态路由
                const routes = await store.dispatch("permission/filterRoutes", roles.menus);

                // 动态添加满足权限的路由至路由表
                // 并将404路由放到动态路由末尾
                router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }]);

                // 注意：动态添加完动态路由之后，必须使用next(to.path)， 而不是next();
                // 这是它自身的bug
                next(to.path);
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