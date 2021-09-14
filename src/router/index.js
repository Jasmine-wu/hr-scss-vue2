import Vue from 'vue'
import Router from 'vue-router';
import Layout from '@/layout'

// 引入多个模块的规则
import approvalsRouter from './modules/approvals'
import departmentsRouter from './modules/departments'
import employeesRouter from './modules/employees'
import permissionRouter from './modules/permission'
import attendancesRouter from './modules/attendances'
import salarysRouter from './modules/salarys'
import settingRouter from './modules/setting'
import socialRouter from './modules/social'

Vue.use(Router)


// 静态路由：所有人都可以访问
export const constantRoutes = [{
        path: '/login',
        component: () =>
            import ('@/views/login/index'),
        hidden: true
    },

    {
        path: '/404',
        component: () =>
            import ('@/views/404'),
        hidden: true
    },

    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [{
            path: 'dashboard',
            name: 'Dashboard',
            component: () =>
                import ('@/views/dashboard/index'),
            meta: { title: '首页', icon: 'dashboard' }
        }]
    },
    {
        path: '/import',
        component: Layout,
        hidden: true, // 隐藏在左侧菜单中
        children: [{
            path: '', // 二级路由path什么都不写 表示二级默认路由
            component: () =>
                import ('@/views/import')
        }]
    },

    // { path: '*', redirect: '/404', hidden: true } //404路由应放到动态路由最后面
];


// 动态路由： 有相应权限的人才可以访问
export const asyncRoutes = [
    approvalsRouter,
    departmentsRouter,
    employeesRouter,
    permissionRouter,
    attendancesRouter,
    salarysRouter,
    settingRouter,
    socialRouter
];

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    // router初始化时，路由表只放入（人人都能访问的路由）静态路由
    // 当具体用户登陆时，再根据获取到的用户拥有的实际权限筛选出满足用户权限的动态路由，然后动态添加到路由表中

    // 动态路由和静态路由的临时合并
    // routes:[...constantRoutes, ...asyncRoutes],
    routes: [...constantRoutes],
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465

// 重新创建router实例，用于登出时重置路由
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router