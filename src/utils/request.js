// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios';
import { Message } from 'element-ui';
import store from "@/store";
import { getTimeStamp } from './auth';
import router from '@/router';
const timeOut = 60 * 60; //token有效期2小时
const service = axios.create({
    // baseURL=/api会触发代理
    // localhost:port/api 代理到 http://ihrm-java.itheima.net/api
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 5000, //超时
});

service.interceptors.request.use(config => {

    // 在这个位置需要统一的去注入token
    if (store.getters.token) {

        // 先判断token是否过期
        if (isTimeOut()) {
            console.log("xxx");
            // 如果超时了
            // 清除token数据
            store.dispatch('user/logout');
            // 跳转到登陆页面
            router.push('/login');
            // return reject 中断程序
            return Promise.reject(new Error('身份令牌过期了，请重新登陆'));
        }

        // 如果token存在 注入token
        config.headers['Authorization'] = `Bearer ${store.getters.token}`
    }
    return config // 必须返回配置
}, error => {
    return Promise.reject(error)
});

// reject处理的前提,ihr项目后台对执行失败没有做reject处理，只是将返回数据的success设置为false
// 服务器没有reject处理，请求数据时用try-cath就会捕捉不到error
// 因此，这里统一处理
service.interceptors.response.use(
    // 2xx以内会进这里
    response => {
        // axios多包了一层data
        // 统一解构数据
        const { message, data, success } = response.data;
        if (success) {
            return data;
        } else {
            Message(message);
            return Promise.reject(new Error(message));
        }
    },
    // 2xx以外进这里
    error => {
        Message(error.message);
        return Promise.reject(error);

    }
);

function isTimeOut() {
    var currentTime = Date.now();
    return (currentTime - getTimeStamp()) / 1000 > timeOut;
};
export default service;