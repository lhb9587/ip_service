import Vue from "vue";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/zh-CN"; // lang i18n
import multiCascader from "@/components/multiCascader/index.js";
import "@/styles/index.scss"; // global css
import "@/styles/dragin-resize.scss";
import "vue-willtable/dist/vue-willtable.min.css";
import "swiper/css/swiper.css";
import App from "./App";
import store from "./store";
import router from "./router";

import "@/icons"; // icon
import "@/permission"; // permission control
import TitleTotal from "@/components/TitleTotal/index.js";
import CustCard from "@/components/CustomerCard/index.js";
import DataPicker from "@/components/DataPicker/index.js";
import DateYearPicker from "@/components/DateYearPicker/index.js";
import DateMonthPicker from "@/components/DateMonthPicker/index.js";

import DateRange from "@/components/DateRange/index.js";
import Tabs from '@/components/tabs/index.js'
import Clickoutside from "@/utils/directives.js"
import "@/utils/dialogDrag.js"
import drawer from "@/components/drawer/index.js"
import "@/assets/iconfont.js"
import "@/assets/iconfont.css"
import ContextMenu from '@/components/ContextMenu';
import * as filters from '@/utils/filters'
import * as commonUtils from '@/utils'
import plTable from 'pl-table'
import '@/components/ag-grid-enterprise'
import 'pl-table/themes/index.css' // 引入样式（必须引入)，请查看webpack是否配置了url-loader对woff，ttf文件的引用,不配置会报错哦
import '@/utils/onError.js'
//import 'pl-table/themes/plTableStyle.css' // 默认表格样式很丑 引入这个样式就可以好看啦（如果你不喜欢这个样式，就不要引入，不引入就跟ele表格样式一样）
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import DraginResize from 'jo-dragin-resize'
import Alerts from "@/components/alert/index.js";
import ZmTreeOrg from 'zm-tree-org';
import "zm-tree-org/lib/zm-tree-org.css";
Vue.use(Alerts)
Vue.use(ZmTreeOrg)
// import VueQuillEditor from 'vue-quill-editor'
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'
// Vue.use(VueQuillEditor);
Vue.prototype.$DraginResize=DraginResize
Vue.use(plTable);
Vue.prototype.$commonUtils = commonUtils
Object.keys(filters).forEach(key=>{
  Vue.filter(key,filters[key])
})

Vue.use(Tabs)
Vue.use(ContextMenu);
Vue.use(Clickoutside)
Vue.use(DateRange)

Vue.use(drawer)
import VueClipboard from 'vue-clipboard2'
import AgGridVue from  '@/components/agGridVue/index.js'
import FocusOrBlur from "@/components/FocusOrBlur/index.js";
Vue.use(FocusOrBlur)
Vue.use(AgGridVue)
Vue.use(VueClipboard)
import Autocomplete from "@/components/Autocomplete/index"
Vue.use(Autocomplete)

import UserIconAndUserName from "@/components/UserIconAndUserName/index.js"
Vue.use(UserIconAndUserName)
import virtualSelect from '@/components/VirtualSelect/index.js';
Vue.use(virtualSelect);
import EmitSearch from "@/components/FilterHistory/EmitSearch.js"
Vue.use(EmitSearch)
import infiniteScroll from 'vue-infinite-scroll'
Vue.use(infiniteScroll)
import myCalendar from '@/components/Calendar/index.js'
Vue.use(myCalendar)
import InputList from '@/components/InputList/index.js'
Vue.use(InputList)

import TimerComponent from '@/components/TimerComponent/index.js'
Vue.use(TimerComponent)
import GetCase from '@/components/GetCase/index.js'
Vue.use(GetCase)
import Calendar from 'v-calendar'
// import Calendar from '@/components/Calendar/index.js'
Vue.use(Calendar)
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";

// Vue.use(AgGridVue)
//import 'lib-flexible'
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
// set ElementUI lang to EN
Vue.use(ElementUI, {
  locale
});
import  option from '@/components/option/index.js'
Vue.use(option)

import  CommonForm from '@/components/CommonForm/index.js'
Vue.use(CommonForm)
import  CommonDialog from '@/components/CommonDialog/index.js'
Vue.use(CommonDialog)
Vue.use(TitleTotal);
Vue.use(CustCard);
Vue.use(multiCascader);
Vue.use(DataPicker);
Vue.use(DateYearPicker);
Vue.use(DateMonthPicker);
import VueAwesomeSwiper from "vue-awesome-swiper";
Vue.use(VueAwesomeSwiper);
Vue.config.productionTip = false;

import * as wUtil from 'wangs-utils/dist/wang_utils';

Vue.prototype.$wUtil = wUtil

Vue.prototype.getNowFormatDate = function () {
  var date = new Date();
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
};

Array.prototype.diff = function (a) {
  return this.filter(function (i) {
    return a.indexOf(i) < 0;
  });
};

Object.defineProperty(Event.prototype, "path", {
  get() {
    return this.composedPath();
  },
});

if(new Date().getDay()!=localStorage.getItem('date')){
  localStorage.setItem('date',new Date().getDay())
  if(localStorage.getItem('materialTypeId')){
    localStorage.setItem('materialTypeId','')
  }
  if(localStorage.getItem('materialModel')){
    localStorage.setItem('materialModel','')
  }
}
if(localStorage.getItem('reloadUrl')){
  window.location.href=localStorage.getItem('reloadUrl')
  localStorage.setItem('reloadUrl','')
}
var orignalSetItem = localStorage.setItem;
localStorage.setItem = function(key,newValue){
  orignalSetItem.apply(this,arguments);
  if(key=='executor'){
    var setItemEvent = new Event("setItemEvent");
    setItemEvent.newValue = newValue;
    window.dispatchEvent(setItemEvent);
  }

}

// Number.prototype.toFixed = function(length){
//   var carry = 0; //存放进位标志
//   var num, multiple; //num为原浮点数放大multiple倍后的数，multiple为10的length次方
//   var str = this + ''; //将调用该方法的数字转为字符串
//   var dot = str.indexOf("."); //找到小数点的位置
//   if(str.slice(dot + length + 1, dot + length + 2) >= 5) carry = 1; /*找到要进行舍入的数的位置，手动判断是否大于等于5，满足条件进位标志置为1,或str.substr(dot + length + 1, 1)*/
//   multiple = Math.pow(10, length); //设置浮点数要扩大的倍数
//   num = Math.floor(this * multiple) + carry; //去掉舍入位后的所有数，然后加上我们的手动进位数
//   var result = num / multiple + ''; //将进位后的整数再缩小为原浮点数
//   /*
//   * 处理进位后无小数
//   */
//   dot = result.indexOf(".");
//   if(dot === -1){
//     result += '.';
//     dot = result.indexOf(".");
//   }
//   /*
//   * 处理多次进位
//   */
//   var len = result.length - (dot+1);
//   if(len < length){
//     for(var i = 0; i < length - len; i++){
//       result += 0;
//     }
//   }
//   return result;
// }
// 按扭权限指令
Vue.directive("allow", {
  inserted: (el, binding, vnode) => {
    if (!store.getters.permissions.includes(binding.value)) {
      el.parentNode.removeChild(el);
    }
  }
});
function throttle(callback, delay) {
  let pre = 0 // 默认值不要是Date.now() ==> 第1次事件立即调用
  return function (event) { // 节流函数/真正的事件回调函数   this是发生事件的标签
    const current = Date.now()
    console.log(current, pre, current - pre, true)
    if (current - pre > delay) { // 只有离上一次调用callback的时间差大于delay
      // 调用真正处理事件的函数, this是事件源, 参数是event
      callback.call(this, event)
      // 记录此次调用的时间
      pre = current
    }
  }
}
//coder__wang
Vue.directive("debounce", {
  inserted: (el, binding, vnode) => {
    const that = vnode.context,
          eventName = binding.expression.replace(/,(.+)/g, '').replace(/'/g, ''),
          delay = binding.expression.replace(/(.+),/g, '').replace(/'/g, ''),
          event = that[binding.arg];
    el.addEventListener(eventName, wUtil.debounce(event, delay))
  }
});
// Vue.directive("throttle", {
//   inserted: (el, binding, vnode) => {
//     const that = vnode.context,
//           eventName = binding.expression.replace(/,(.+)/g, '').replace(/'/g, ''),
//           delay = binding.expression.replace(/(.+),/g, '').replace(/'/g, ''),
//           event = that[binding.arg];
//     el.addEventListener(eventName, wUtil.throttle(event, delay))
//   }
// });

Vue.directive('throttle', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function(el, binding) {
    //binding.value，使用自定义指令v-throttle时填写的参数
    //解构赋值，定义了3个变量，将参数（数组）按顺序进行赋值
    let [fn, event = "click", time = 300] = binding.value
    let timer = null;
    el.addEventListener(event, () => {
      //默认监听的事件为click
      //判断计时器是否存在，不存在则执行函数fn，创建计时器
      if (timer == null) {
        fn();
        timer = setTimeout(() => timer = null, time)
      }
    })
  }
})

export default new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
