import { constantRoutes, asyncRoutes } from "@/router";

// 使用vuex permission模块管理权限
// constantRoutes->静态路由：所有人都可访问
// asyncRoutes->动态路由：有相应权限的才可访问
// routes: 当前用户能访问的所有路由
const state = {
    routes: constantRoutes, // 
};

const mutations = {

    setRoutes(state, newRoutes) {
        // 注意：这种写法是错误的，why？
        // 假如我先用管理员账号登陆，这时state.routes有100个可访问的路由，我退出再用普通账号登陆
        // 这时，普通账号的可访问的路由是100+newRoutes么？ 显然不是
        // 正确：每次路由设置都应该是静态路由+newRoutes
        // state.routes = [...state.routes, ...newRoutes];
        state.routes = [...constantRoutes, ...newRoutes];

    },

};
const actions = {
    // 筛选当前用户有权限的路由
    // menus: 登陆时获取到的当前用户拥有的权限(对应权限点的权限标识-对应路由name)
    // menus；["settings", "permissions"]
    filterRoutes(context, menus) {

        // routes: 满足用户权限的路由数组
        const routes = [];
        menus.forEach(code => {

            // asyncRoutes.filter(route => route.name === code); //返回的可能是数组，也可能为空
            routes.push(...asyncRoutes.filter(route => route.name === code));
        });

        // 保存至state
        context.commit("setRoutes", routes);

        // 为什么要return? 
        // 后续使用dispatch调用action时，可用await直接获取返回结果
        return routes;
    }

};

export default {
    namespaced: true,
    state: state,
    mutations: mutations,
    actions: actions,
}