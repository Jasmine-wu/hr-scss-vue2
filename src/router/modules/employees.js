import Layout from '@/layout';

export default {
    path: '/employees',
    component: Layout, //一级路由
    name: '/employees', // 为啥要给模块一级路由加name属性？
    children: [{
            path: '', //什么都不写：/employees显示/views/employees
            component: () =>
                import ('@/views/employees'),
            meta: {
                title: '员工', //左边菜单导航栏的信息来自路由的元信息
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

        }
    ],

}