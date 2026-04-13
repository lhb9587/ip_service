<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

  import {browserBehavior} from '@/views/workbench/case/components/browserBehavior.js'

  export default {
    name: "App",

    mounted() {

      browserBehavior()
      let that=this
      document.getElementsByTagName('body')[0].onmouseover=function (e) {
        if(e.target.className=='filterTableTmg'){
          that.cloneNode = e.target.cloneNode(true)
          that.cloneNode.setAttribute('id','cloneNode')
          that.cloneNode.style.left=e.pageX+10+'px'
          that.cloneNode.style.top=e.pageY+'px'
          that.cloneNode.style.width=200+'px'
          that.cloneNode.style.height='auto'
          that.cloneNode.style.zIndex='3000'
          document.getElementsByTagName('body')[0].appendChild(that.cloneNode)
        }
      }
      document.getElementsByTagName('body')[0].onmouseout=function (e) {
        if(e.target.className=='filterTableTmg'){
          document.getElementById('cloneNode').remove()
          // that.cloneNode
        }
      }

      function getParentTag(startTag, parentTagList = []) {
        // 传入标签是否是DOM对象
        if (!(startTag instanceof HTMLElement)) return console.error('receive only HTMLElement');
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

      document.getElementsByTagName('body')[0].oncontextmenu=function (e) {
        if(getParentTag(e.target,[e.target]).map(item => item.className).includes('ag-theme-balham')){
          return false
        }
      }
    }
  }

</script>
<style lang="scss">
  *{
    margin: 0;
    padding: 0;
  }
  .formatMMdd  ~.el-date-picker /deep/.el-date-picker__header{
    .el-icon-d-arrow-left, .el-icon-d-arrow-right,.el-date-picker__header-label:nth-of-type(1){
      display: none;
    }
  }
  .formatdd  ~.el-date-picker /deep/.el-date-picker__header{
    display: none;
  }
  /*移除费用暂存页面的滚动条*/
  #app .main-container{
    overflow: visible;
  }
</style>
