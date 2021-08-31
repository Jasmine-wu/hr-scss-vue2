// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios';
import { Message } from 'element-ui';
const service = axios.create({
    // baseURL=/api会触发代理
    // localhost:port/api 代理到 http://ihrm-java.itheima.net/api
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 5000, //超时
});
service.interceptors.request.use();

// reject处理的前提,ihr项目后台对执行失败没有做reject处理，只是将返回数据的success设置为false
// 服务器没有reject处理，请求数据时用try-cath就会捕捉不到error
// 因此，这里统一处理
service.interceptors.response.use(
    // 2xx以内会进这里
    response => {
        // axios多包了一层data
        if (response.data.success) {
            return response.data;
        } else {
            Message(response.data.message);
            return Promise.reject(new Error(response.data.message));
        }
    },
    // 2xx以外进这里
    error => {
        Message(error.message);
        return Promise.reject(error);

    }
);
export default service;