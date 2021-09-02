import Layout from '@/layout';

export default {
    path: '/salarys',
    component: Layout, //一级路由
    name: '/salarys', // 为啥要给模块一级路由加name属性？
    children: [{
        path: '', //什么都不写：/employees显示/views/employees
        component: () =>
            import ('@/views/salarys'),
        meta: {
            title: '员工薪资', //左边菜单导航栏的信息来自路由的元信息
            icon: 'money'
        }
    }],
}