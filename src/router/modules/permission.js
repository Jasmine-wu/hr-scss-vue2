import Layout from '@/layout';

export default {
    path: '/permission',
    component: Layout, //一级路由
    name: 'permissions', // 为啥要给模块一级路由加name属性？
    children: [{
        path: '', //什么都不写：/employees显示/views/employees
        component: () =>
            import ('@/views/permission'),
        name: 'permissions', //为啥这里要有name？ 为了做侧边栏多语言，name可以做侧边栏多语言的key值

        meta: {
            title: '权限管理', //左边菜单导航栏的信息来自路由的元信息
            icon: 'lock',

        }
    }],
}