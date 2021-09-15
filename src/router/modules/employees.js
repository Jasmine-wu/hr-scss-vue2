import Layout from '@/layout';

export default {
    path: '/employees',
    component: Layout, //一级路由
    name: 'employees', // 为啥要给模块一级路由加name属性？
    children: [{
            path: '', //什么都不写：/employees显示/views/employees
            component: () =>
                import ('@/views/employees'),
            name: 'employees', //为啥这里要有name？ 为了做侧边栏多语言，name可以做侧边栏多语言的key值
            meta: {
                title: '员工管理', //左边菜单导航栏的信息来自路由的元信息
                icon: 'people',
            }
        },
        {
            path: "detail/:id", //注意：没有/
            component: () =>
                import ("@/views/employees/detail"),
            hidden: true, // 解决侧边栏员工不见了问题
            meta: {
                title: "员工详情"
            }

        },
        {
            path: 'print/:id', // 二级默认路由
            component: () =>
                import ('@/views/employees/print'), // 按需加载
            hidden: true,
            meta: {
                title: '打印', // 标记当前路由规则的中文名称 后续在做左侧菜单时 使用
                icon: 'people'
            }
        }
    ],

}