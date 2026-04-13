import Vue from 'vue';
import { on } from 'element-ui/src/utils/dom';

const nodeList = [];
const ctx = '@@clickoutsideContext';

let startClick;
let seed = 0;

!Vue.prototype.$isServer && on(document, 'mousedown', e => (startClick = e));

!Vue.prototype.$isServer && on(document, 'mouseup', e => {
  nodeList.forEach(node => node[ctx].documentHandler(e, startClick));
});
function getParentTag(startTag, parentTagList = []) {
  // 传入标签是否是DOM对象
  if (!(startTag instanceof HTMLElement)) return console.log('receive only HTMLElement');
  // 父级标签是否是body,是着停止返回集合,反之继续
  if ('BODY' !== startTag.parentElement.nodeName) {
    // 放入集合
    parentTagList.push(startTag.parentElement)
    // 再上一层寻找
    return getParentTag(startTag.parentElement, parentTagList)
  }
  // 返回集合,结束
  else return parentTagList;
}

  function createDocumentHandler(el, binding, vnode) {

    return function(mouseup = {}, mousedown = {}) {
      if(mousedown.target){
        if(mousedown.target.offsetWidth-mousedown.offsetX<13||mousedown.target.offsetHeight-mousedown.offsetY<13){
          return
        }
      }
    if (!vnode ||
      !vnode.context ||
      !mouseup.target ||
      !mousedown.target ||
      el.contains(mouseup.target) ||
      el.contains(mousedown.target) ||
      el === mouseup.target ||
      (vnode.context.popperElm &&
        (vnode.context.popperElm.contains(mouseup.target) ||
          vnode.context.popperElm.contains(mousedown.target)))) return;
    if(mouseup.target&&getParentTag(mouseup.target)){
      if(!getParentTag(mouseup.target).map(item=>item.getAttribute('id')).filter(item=>item).includes('app')){
        return
      }
      if(getParentTag(mouseup.target).map(item => item.className).includes("el-dialog__wrapper")||mouseup.target.className.includes("el-dialog__wrapper")){
        return
      }
    }
    if (binding.expression &&
      el[ctx].methodName &&
      vnode.context[el[ctx].methodName]) {
      vnode.context[el[ctx].methodName]();
    } else {
      el[ctx].bindingFn && el[ctx].bindingFn();
    }
  };
}

/**
 * v-clickoutside
 * @desc 点击元素外面才会触发的事件
 * @example
 * ```vue
 * <div v-element-clickoutside="handleClose">
 * ```
 */
export default {
  bind(el, binding, vnode) {
    nodeList.push(el);
    const id = seed++;
    el[ctx] = {
      id,
      documentHandler: createDocumentHandler(el, binding, vnode),
      methodName: binding.expression,
      bindingFn: binding.value
    };
  },

  update(el, binding, vnode) {
    el[ctx].documentHandler = createDocumentHandler(el, binding, vnode);
    el[ctx].methodName = binding.expression;
    el[ctx].bindingFn = binding.value;
  },

  unbind(el) {
    let len = nodeList.length;

    for (let i = 0; i < len; i++) {
      if (nodeList[i][ctx].id === el[ctx].id) {
        nodeList.splice(i, 1);
        break;
      }
    }
    delete el[ctx];
  }
};
