 /**
 * Created by LSF on 2017/11/13.
 */
module.exports={
    getToken(){
        return this.getCookie("token");
    },
    //时间YYYY-MM-DD 00:00:00
    formatDate2(date){
        let year = date.getFullYear();
        let month = this.formatTwo(date.getMonth() + 1);
        let day = this.formatTwo(date.getDate());
        let hour = this.formatTwo(date.getHours());
        let minute = this.formatTwo(date.getMinutes());
        let second = this.formatTwo(date.getSeconds());
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    },
    //时间YYYY-MM-DD
    formatDate3(date){
        let year = date.getFullYear();
        let month = this.formatTwo(date.getMonth() + 1);
        let day = this.formatTwo(date.getDate());
        return `${year}-${month}-${day}`;
    },
    formatTwo(num){
        num = Number(num);
        if(num < 10)
        {
            return `0${num}`;
        }else{
            return num;
        }
    },
    //url参数
    getUrlParam(name) {
        var reg = RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        var result = window.location.search.substr(1).match(reg);
        return result ? decodeURIComponent(result[2]) : null;
    },
    setCookie(name, value){
        var Days = 14;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString()+";path=/";
    },
    getCookie(name){
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    },
    setClipboard(text){
        var oInput = document.createElement('input');
        oInput.value = text;
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        document.body.removeChild(oInput);
    },
//    "2018-09-08 10:10"时间转stamp
    datetime_to_stamp(datetime){
        let dateTime = datetime.split(' ');
        let date = dateTime[0];
        let time = dateTime[1];
        let dateArr = date.split("-");
        let timeArr = time.split(':');
        let crtDate = new Date();
        crtDate.setFullYear(dateArr[0]);
        crtDate.setMonth(Number(dateArr[1]) - 1);
        crtDate.setDate(dateArr[2]);
        crtDate.setHours(timeArr[0],timeArr[1],timeArr[2],0);
        return crtDate.getTime();
    },
//    支付倒计时
    calculate_pay_time(payTime,crtStamp){
        /*let newDate = new Date();
        let newStamp = newDate.getTime();
        let secondsLong = Math.abs(payTime*60 - (newStamp - crtStamp)/1000);
        let minute = Math.floor(secondsLong/60);
        let seconds = Math.abs(secondsLong % 60).toFixed(0);
        minute = minute < 10 ? `0${minute}` : minute;
        seconds = seconds < 10 ? `0${seconds}` : seconds;
        let unit = payTime*60 - (newStamp - crtStamp)/1000 < 0 ? "-" : "";
        return `${unit}${minute}:${seconds}`;*/
        let timeLeft = "";
        let end = false;
        try{
            let now = new Date();
            let nowStamp = now.getTime();
            let secondsLong = Math.abs(payTime*60 - (nowStamp - crtStamp)/1000);
            let day = Math.floor(secondsLong/86400);
            let hour = Math.floor((secondsLong - day * 86400) / 3600);
            let minute = Math.floor((secondsLong - day * 86400 - hour * 3600) / 60);
            let seconds = Math.abs(secondsLong - day * 86400 - hour * 3600 - minute * 60).toFixed(0);
            minute = minute < 10 ? `0${minute}` : minute;
            seconds = seconds < 10 ? `0${seconds}` : seconds;
            if(payTime*60 - (nowStamp - crtStamp)/1000 < 0)
            {
                end = true;
                timeLeft = "00分00秒";
            }else{
                timeLeft = `${day}天${hour}时${minute}分${seconds}秒`;
            }
        }catch(err){}
        return timeLeft
    },
//    正数 > 0
    is_positive_number({num,point=null}={}){
        let _point = null;
        if(this.is_positive_integer2(point))
        {
            _point = Number(point);
        }
        if((typeof num).toLowerCase() != 'string' && (typeof num).toLowerCase() != 'number')
        {
            return false;
        }
        if(/[^0-9.]|^[.]|[.]$/g.test(num))
        {
            return false;
        }
        if(/[.]/g.test(num))
        {
            let splitNum = num.toString().split('.');
            if(splitNum.length > 2)
            {
                return false;
            }
            if(_point != null)
            {
                if(splitNum.length <= 1 || splitNum[1].length > _point)
                {
                    return false;
                }
            }
        }
        let newNum = Number(num);
        if(!newNum || newNum <= 0)
        {
            return false;
        }
        return true;
    },
//    正整数 > 0
    is_positive_integer(num){
        let result = true;
        if((typeof num).toLowerCase() != 'string' && (typeof num).toLowerCase() != 'number')
        {
            result = false;
        }else if(/[^0-9]|^[0]/g.test(num))
        {
            result = false;
        }
        let newNum = Number(num);
        if(!newNum || newNum <= 0)
        {
            result = false;
        }
        return result;
    },
//    正整数 >= 0
    is_positive_integer2(num){
        let result = true;
        if((typeof num).toLowerCase() != 'string' && (typeof num).toLowerCase() != 'number')
        {
            result = false;
        }else if(/[^0-9]/g.test(num))
        {
            result = false;
        }
        let newNum = Number(num);
        if(newNum < 0)
        {
            result = false;
        }
        return result;
    },
//    手机号验证
    is_phone(phone){
        return /[0-9]{11}/g.test(phone);
    },
//    邮箱
    is_email(email){
        return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/g.test(email);
    }
}