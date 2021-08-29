import request from '@/utils/request'

// 登陆
export function login(data) {
    return request({
        method: "POST",
        url: '/sys/login',
        data
    });
};

export function getInfo(token) {

}

export function logout() {

}