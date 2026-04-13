import vm from '@/main.js'
import Bus from '@/utils/Bus'
export function browserBehavior() {
  window.document.onkeydown=function(){
    let list= [112,113,114,115,117,118,119,120,121,122,123]
    if([40,38].includes(event.keyCode)){
      if(['officialCommunication','officialSubmission','case_management'].includes(vm.$route.name)){
        Bus.$emit('keyboardEvents',event.keyCode)
      }
    }
    console.log(event.keyCode);
    if(list.includes(event.keyCode)){//屏蔽F5键，改为只刷新本页面，防止一刷就刷整个窗口
      if(vm.$route.name=='case_management'){
        Bus.$emit('keyboardEvents',event.keyCode)
        event.returnValue=false;
        event.cancelBubble=true;
        return false;
      }

    }
  }
}
