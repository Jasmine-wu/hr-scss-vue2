import Layout from '@/layout';

export default {
    path: '/attendances',
    component: Layout, //一级路由
    name: '/attendances', // 为啥要给模块一级路由加name属性？
    children: [{
        path: '', //什么都不写：/employees显示/views/employees
        component: () =>
            import ('@/views/attendances'),
        meta: {
            title: '考勤', //左边菜单导航栏的信息来自路由的元信息
            icon: 'skill',
        }
    }],
}