/**
 * Created by Administrator on 2018/4/25.
 */
import Vue from 'vue'

Vue.filter('hmMoney',value => {
    let money = Number.parseFloat(value);
    if(isNaN(money))
    {
        return "invalid ￥"
    }else{
        money = money.toFixed(2);
        return `￥${money}`
    }
})