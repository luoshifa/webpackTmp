/**
 * Created by LSF on 2017/11/13.
 */
import  axios from 'axios'
import Vue from 'vue'
// import { Loading } from 'element-ui';
import utils from './utils'
let loading = null
//剩余请求数量。
let needLoadingRequestCount = 0;
//开启loaing
function startLoading(){
    /*loading = Loading.service({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
    });*/
}
//结束loading
function endLoading() {
    // loading.close()
}
//验证是否需要开启loading，请求数加1
export function showFullScreenLoading() {
    if (needLoadingRequestCount === 0) {
        startLoading()
    }
    needLoadingRequestCount++
}
//验证当前剩余请求数，并结束loading
export function tryHideFullScreenLoading() {
    if (needLoadingRequestCount <= 0) return
    needLoadingRequestCount--
    if (needLoadingRequestCount === 0) {
        endLoading()
    }
}
//创建请求对象
let $http=axios.create({
    baseURL:"/business-admin",
    withCredentials: true,
    timeout: 180000,
    headers:{
        "Content-Type":"application/json",
        "Cache-Control":"no-chache",
        "access_token":utils.getToken()
    },
});
//响应拦截
$http.interceptors.response.use(res => {
    tryHideFullScreenLoading();
    if(res.status == 200 && res.data.code == 1)
    {
        res.data.success=true;
    }else{
        res.data.success=false;
    }
    return res
},error => {
    tryHideFullScreenLoading();
    if(error.response.status == 401)
    {
        window.location.href = "./login.html";
    }
    return Promise.reject(error);
})
//请求拦截
$http.interceptors.request.use(config => {
    showFullScreenLoading();
    if(config.method == 'get')
    {
        try{
            config.params.hymnCurrentTime = Date.now();
        }catch (err){}
    }else{
        // console.log(config)
    }
    return config;
},error => {
    return error;
})
//
Vue.prototype.$http=$http;
