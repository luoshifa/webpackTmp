/**
 * Created by LSF on 2017/11/13.
 */
import "babel-polyfill"
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from '../../js/routes'
const commonConfig = require('../../config/common')
require('../../js/httpRequest')
//自定义指令
require('../../js/vue-directive.js')
//自定义过滤器
require('../../js/vue-filter.js')
Vue.use(VueRouter);
let {apiBase,businessDomain,webUrl,imgBase} = commonConfig;
Vue.prototype.apiBase = apiBase;
Vue.prototype.businessDomain = businessDomain;
Vue.prototype.webUrl = webUrl;
Vue.prototype.imgBase = imgBase;
const router=new VueRouter({
    routes
})
const vm=new Vue({
    router,
    el:'#app'
})