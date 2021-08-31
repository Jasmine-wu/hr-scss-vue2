import { getToken, setToken, removeToken } from "@/utils/auth";
import { login, getUserInfo, getUserDetailById, logout } from "@/api/user";
const state = {
    token: getToken(), //token初始状态
    userInfo: {}, //这里为什么是用{}而不是null, null.属性会抱异常
};
const mutations = {
    setToken(state, token) {
        // 更新vuex state状态
        state.token = token;
        // 数据持久化
        setToken(token);
    },
    removeToken(state) {
        // 更新vuex state状态
        state.token = null;
        // 删除本地数据
        removeToken();
    },
    setUserInfo(state, data) {
        state.userInfo = data;

    },
    removeUserInfo(state) {
        state.userInfo = {};
    }
};
const actions = {
    // 登陆
    async login(context, body) {
        // 注意axios默认加了一层data
        // 发起异步请求
        const data = await login(body);

        // 修改vuex token状态
        context.commit('setToken', data);
    },

    // 获取用户资料
    async getUserInfo(context) {
        // 获取用户资料
        const data = await getUserInfo();
        // 获取用户基本信息
        const baseInfo = await getUserDetailById(data.userId);
        // 合并两个对象数据
        const userData = {...data, ...baseInfo };
        context.commit('setUserInfo', userData);
        return userData // 这里为什么要返回 为后面埋下伏笔
    },

    logout(context) {
        // 删除token
        context.commit('removeToken');
        // 删除用户数据
        context.commit('removeUserInfo');
    }

};

export default {
    namespaced: true,
    state,
    mutations,
    actions
}