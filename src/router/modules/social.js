import Layout from '@/layout';

export default {
    path: '/social',
    component: Layout, //一级路由
    name: 'social_securitys', // 为啥要给模块一级路由加name属性？
    children: [{
            path: '', //什么都不写：/employees显示/views/employees
            component: () =>
                import ('@/views/social'),
            meta: {
                title: '社保', //左边菜单导航栏的信息来自路由的元信息
                icon: 'table'
            }
        },
        // 报表
        {
            path: 'detail/:id',
            hidden: true,
            component: () =>
                import ('@/views/social/detail'),
            name: 'socialDetail',
            meta: {
                title: '社保'
            }
        },
        // 历史归档
        {
            path: 'historicalArchiving',
            hidden: true,
            component: () =>
                import ('@/views/social/historical'),
            name: 'socialHistorical',
            meta: {
                title: '历史归档'
            }
        },
        // 月报表
        {
            path: 'monthStatement',
            component: () =>
                import ('@/views/social/month'),
            name: 'socialMonthStatement',
            hidden: true,
            meta: {
                title: '当月报表'
            }
        }
    ],
}