import store from "@/store"
// 检查用户功能权限的混入对象

// 混入对象是vue实例的选项对象
export default {
    methods: {
        // key: 检查点
        // points:用户的功能权限数组
        checkPermission(key) {
            const { userInfo } = store.state.user;
            if (userInfo.roles && userInfo.roles.points) {
                return userInfo.roles.points.some(point => point === key);
            }
            return false;
        }
    },
}