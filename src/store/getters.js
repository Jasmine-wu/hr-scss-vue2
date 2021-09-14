// 建立各模块state属性的快捷访问
const getters = {
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    token: state => state.user.token,
    userName: state => state.user.userInfo.username,
    userId: state => state.user.userInfo.userId,
    userPhoto: state => state.user.userInfo.staffPhoto,
    companyId: state => state.user.userInfo.companyId,
    routes: state => state.permission.routes,

}
export default getters