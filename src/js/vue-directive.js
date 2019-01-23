/**
 * Created by Administrator on 2018/4/25.
 */
import Vue from 'vue'

Vue.directive('enable',{
    inserted(el,binding){
        let enable=binding.value.enable;
        if(!enable && el.parentNode)
        {
            el.parentNode.removeChild(el);
        }
    },
    update(el,binding){
        let enable=binding.value.enable;
        if(!enable && el.parentNode)
        {
            el.parentNode.removeChild(el);
        }
    }
})

//图片自适应
Vue.directive("adjust-pic",{
    inserted: function(el, binding) {
        let w = 0;
        let h = 0;
        try{
            w = binding.value.w;
            h = binding.value.h;
        }catch(err){}
        let img = new Image();
        img.src = el.src;
        img.onload = () => {
            let width = el.width;
            let height = el.height;
            if(w ==0 || h == 0)
            {
                if(width < height)
                {
                    el.style.width="auto";
                    el.style.height="100%";
                }else if(width > height){
                    el.style.width="100%";
                    el.style.height="auto";
                }else{
                    el.style.width="100%";
                    el.style.height="100%";
                }
            }else{
                if(width/height >= w/h)
                {
                    el.style.width="100%";
                    el.style.height="auto";
                }else if(width/height < w/h)
                {
                    el.style.width="auto";
                    el.style.height="100%";
                }
            }
        }
        img.onerror = () => {
            console.log(`fail:${el.src}`)
            el.style.width="100%";
            el.style.height="100%";
        }
    },
    update: function(el, binding) {
        let w = 0;
        let h = 0;
        try{
            w = binding.value.w;
            h = binding.value.h;
        }catch(err){}
        let img = new Image();
        img.src = el.src;
        img.onload = () => {
            let width = el.width;
            let height = el.height;
            if(w ==0 || h == 0)
            {
                if(width < height)
                {
                    el.style.width="auto";
                    el.style.height="100%";
                }else if(width > height){
                    el.style.width="100%";
                    el.style.height="auto";
                }else{
                    el.style.width="100%";
                    el.style.height="100%";
                }
            }else{
                if(width/height >= w/h)
                {
                    el.style.width="100%";
                    el.style.height="auto";
                }else if(width/height < w/h)
                {
                    el.style.width="auto";
                    el.style.height="100%";
                }
            }
        }
        img.onerror = () => {
            console.log(`fail:${el.src}`)
            el.style.width="100%";
            el.style.height="100%";
        }
    },
})
Vue.directive('positive-integer',{
    update(el,binding){
        let value = Number(binding.value.value);
        let isValid = true;
        if(isNaN(value))
        {
            isValid = false;
        }
        if(isValid)
        {
            el.style.backgroundColor = "green";
        }else{
            el.style.backgroundColor = "red";
        }
    }
})