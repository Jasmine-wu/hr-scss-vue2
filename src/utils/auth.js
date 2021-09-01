import Cookies from 'js-cookie'
const TokenKey = 'hrsass-token'
const IIMESTAMPKEY = 'hrsass-token-timestamp';

export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return Cookies.set(TokenKey, token)
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}


export function getTimeStamp() {
    return Cookies.get(IIMESTAMPKEY)
}

export function setTimeStamp(token) {
    return Cookies.set(IIMESTAMPKEY, token)
}

export function removeTimeStamp() {
    return Cookies.remove(IIMESTAMPKEY)
}