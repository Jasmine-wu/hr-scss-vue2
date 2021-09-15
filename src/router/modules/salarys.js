import Layout from '@/layout';

export default {
    path: '/salarys',
    component: Layout, //一级路由
    name: 'salarys', // 为啥要给模块一级路由加name属性？
    children: [{
            path: '', //什么都不写：/employees显示/views/employees
            component: () =>
                import ('@/views/salarys'),
            name: 'salarys', //为啥这里要有name？ 为了做侧边栏多语言，name可以做侧边栏多语言的key值
            meta: {
                title: '员工薪资', //左边菜单导航栏的信息来自路由的元信息
                icon: 'money'
            }
        },
        {
            path: 'setting',
            component: () =>
                import ('@/views/salarys/setting'),
            name: 'salarysSetting',
            hidden: true,
            meta: {
                title: '设置'
            }
        },
        {
            path: 'details/:yearMonth/:id',
            component: () =>
                import ('@/views/salarys/detail'),
            name: 'salarysDetails',
            hidden: true,
            meta: {
                title: '详情'
            }
        },
        {
            path: 'historicalArchiving',
            component: () =>
                import ('@/views/salarys/historical'),
            name: 'salarysHistorical',
            hidden: true,
            meta: {
                title: '历史归档'
            }
        },
        {
            path: 'monthStatement',
            component: () =>
                import ('@/views/salarys/month'),
            name: 'salarysMonthStatement',
            hidden: true,
            meta: {
                title: '月报表'
            }
        }
    ],
}