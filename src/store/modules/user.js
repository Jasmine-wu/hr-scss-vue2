import { getToken, setToken, removeToken } from "@/utils/auth";
import { login } from "@/api/user";
const state = {
    token: getToken(), //token初始状态
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
    }
};
const actions = {
    async login(context, body) {
        // 注意axios默认加了一层data
        // 发起异步请求
        const result = await login(body);
        console.log(result);

        if (result.success) {
            // 修改vuex token状态
            context.commit('setToken', result.data);
        }
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
}