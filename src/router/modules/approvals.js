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
        },
        {
            path: 'salaryApproval/:id',
            component: () =>
                import ('@/views/approvals/salary'),
            name: 'salaryApproval',
            hidden: true,
            meta: {
                title: '工资审核',
                icon: 'approval',
                noCache: true
            }
        },
        {
            path: 'enterApproval/:id',
            component: () =>
                import ('@/views/approvals/enter'),
            name: 'enterApproval',
            hidden: true,
            meta: {
                title: '入职审核',
                icon: 'approval',
                noCache: true
            }
        },
        {
            path: 'leaveApproval/:id',
            component: () =>
                import ('@/views/approvals/leave'),
            name: 'leaveApproval',
            hidden: true,
            meta: {
                title: '申请请假',
                icon: 'approval',
                noCache: true
            }
        },
        {
            path: 'quitApproval/:id',
            component: () =>
                import ('@/views/approvals/quit'),
            name: 'quitApproval',
            hidden: true,
            meta: {
                title: '申请离职',
                icon: 'approval',
                noCache: true
            }
        },
        {
            path: 'overtimeApproval/:id',
            component: () =>
                import ('@/views/approvals/overtime'),
            name: 'overtimeApproval',
            hidden: true,
            meta: {
                title: '加班申请',
                icon: 'approval',
                noCache: true
            }
        },
        {
            path: 'securitySetting',
            component: () =>
                import ('@/views/approvals/security'),
            name: 'securitySetting',
            hidden: true,
            meta: {
                title: '设置',
                icon: 'approval',
                noCache: true
            }
        }
    ],

}