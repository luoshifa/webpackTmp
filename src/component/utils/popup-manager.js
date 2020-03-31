import {addClass,removeClass} from "./dom"
const instances = {};
const getModal = function () {
    let modalDom = PopupManager.modalDom;
    if(modalDom)
    {

    }else{
        modalDom = document.createElement("div");
        PopupManager.modalDom = modalDom;
        modalDom.addEventListener("click",function () {
            PopupManager.modalClick();
        })
    }
    return modalDom;
}
const PopupManager = {
    zIndex:2000,
    getInstance(id){
        return instances[id];
    },
    nextZIndex:function () {
        return PopupManager.zIndex++;
    },
    register:function (id,instance) {
        if(id && instance)
        {
            instances[id] = instance;
        }
    },
    deregister:function (id) {
        if(id)
        {
            instances[id] = null;
            delete instances[id];
        }
    },
    modalClick:function () {
        if(PopupManager.modalStack.length === 0) return;
        let topItem = PopupManager.modalStack[PopupManager.modalStack.length - 1];
        let instance = PopupManager.getInstance(topItem.id);
        if(instance && instance.closeOnClickModal)
        {
            instance.close();
        }
    },
    modalStack:[],
    openModal:function (id,zIndex,dom) {
        let modalStack =this.modalStack;
        let modalIndex = modalStack.findIndex(item => {
            if(item.id === id)
            {
                return true;
            }
        })
        if(modalIndex > -1)
        {
            return;
        }
        let modalDom = getModal();
        removeClass(modalDom,'hm-modal-leave');
        addClass(modalDom,'hm_modal');
        addClass(modalDom,'hm-modal-enter');
        setTimeout(() => {
            removeClass(modalDom,'hm-modal-enter');
        },200)
        if(dom && dom.parentNode && dom.parentNode.nodeType !== 11)
        {
            dom.parentNode.appendChild(modalDom);
        }else{
            document.body.appendChild(modalDom);
        }

        if(zIndex)
        {
            modalDom.style.zIndex = zIndex;
        }
        this.modalStack.push({id:id,zIndex:zIndex});
    },
    closeModal:function (id) {
        let modalStack = this.modalStack;
        let modalDom = getModal();
        if(modalStack.length > 0)
        {
            let topItem = modalStack[modalStack.length - 1];
            if(topItem.id === id)
            {
                modalStack.pop();
                if(modalStack.length > 0)
                {
                    modalDom.style.zIndex = modalStack[modalStack.length - 1].zIndex;
                }
            }else{
                let modalIndex = modalStack.findIndex(item => {
                    if(item.id === id)
                    {
                        return true;
                    }
                })
                if(modalIndex > -1)
                {
                    modalStack.splice(modalIndex,1);
                }
            }
        }
        if(modalStack.length === 0)
        {
            addClass(modalDom,'hm-modal-leave');
            setTimeout(() => {
                if(modalStack.length === 0)
                {
                    modalDom.parentNode.removeChild(modalDom);
                    modalDom.style.display = "none";
                    PopupManager.modalDom = undefined;
                    removeClass(modalDom,'hm-modal-leave');
                }
            },200)

        }
    }
}
export default PopupManager