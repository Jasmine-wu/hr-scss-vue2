import Layout from '@/layout';

export default {
    path: '/approvals',
    component: Layout, //一级路由
    name: 'approvals', // 为啥要给模块一级路由加name属性？和当前用户权限数组里的权限标识一一对应，用于控制路由访问
    children: [{
        path: '', //什么都不写：/employees显示/views/employees
        component: () =>
            import ('@/views/approvals'),
        meta: {
            title: '审批', //左边菜单导航栏item的标题来自路由的元信息里的title
            icon: 'tree-table', //左边菜单导航栏item的icon来自路由的元信息里的icon，icon图标加载的是src/icons/svg里的vvg图片
        }
    }],

}