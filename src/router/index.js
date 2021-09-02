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
            meta: { title: 'Dashboard', icon: 'dashboard' }
        }]
    },

    { path: '*', redirect: '/404', hidden: true }
];


// 动态路由： 有响应权限的人才可以访问
const asyncRoutes = [
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
    // 合并静态路由和动态路由
    routes: [...constantRoutes, ...asyncRoutes],
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router