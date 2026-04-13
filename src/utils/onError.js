import {saveLog} from '@/api/systemList'
import Vue from 'vue'
import store from '@/store'
//获取当前页面路由
import router from '@/router'

var oldError = window.onerror;

const isSaveLog = ()=>{
  const saveLogUrlList = ['/login']
  const saveLogNameList = ['addFeeDetail']
  return saveLogUrlList.includes(router.currentRoute.path) || saveLogNameList.includes(router.currentRoute.name)
}
window.onerror = function (msg, fileUrl, lineNo, columnNo, error) {//最后两个参数有些部分浏览器拿不到,依然需要记录

  var args = Array.prototype.slice.call(arguments);

  if (oldError) {
    oldError.apply(window, args)
  }
  var stack = null;
  if(error && error.stack) stack = error.stack;
  var json = {
    msg: msg || null,
    fileUrl: fileUrl || null,
    lineNo: lineNo || null,
    columnNo: columnNo || null,
    error: stack,
    userId:store.getters.userId,
    userAgent: encodeURIComponent( navigator.userAgent),
    time: new Date().toLocaleString()
  }
  if(msg=='ResizeObserver loop limit exceeded'){
    return
  }
  // var userAgent = navigator.userAgent;
  if (isSaveLog()) {
    saveLog({content:JSON.stringify(json)}).then(res=>{

    })
  }

  // if(XMLHttpRequest){
  //   var xhr = new XMLHttpRequest();
  //   xhr.open('post', 'urlxxx', true);
  //   xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  //   xhr.send("message="+JSON.stringify(json)+"&userAgent="+encodeURIComponent(userAgent))
  // }
}


Vue.config.errorHandler = (err, vm, info) => {
  var stack = null;
  if(err && err.stack) stack = err.stack;
  console.log(stack);
  if(stack=='ResizeObserver loop limit exceeded'){
    return
  }
  var json = {
    msg: stack || null,
    fileUrl: window.location.href || null,
    info,
    userId:store.getters.userId,
    error: stack,
    userAgent: encodeURIComponent( navigator.userAgent),
    time: new Date().toLocaleString()
  }
  if (isSaveLog()) {
    saveLog({content:JSON.stringify(json)}).then(res=>{

    })
  }
}
