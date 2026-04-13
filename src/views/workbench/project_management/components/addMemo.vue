<template>
  <div id="addCom">
    <el-button  v-show="!memoState" type="primary" icon="el-icon-chat-line-round" size="mini" @click="takeMemo">备注</el-button>
    <div v-show="memoState">
      <div class="comment">备注</div>
      <VueUeditorWrap  v-model="memo"  :config="myConfig" :destroy="true"  >

      </VueUeditorWrap>
      <div style="display:flex;justify-content: flex-end;">
        <el-button type="primary"  size="mini" @click="addTaskMemo">添加</el-button>
        <el-button type="text"  size="mini" @click="memoState=false">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {queryTaskMemo,deleteTaskMemo,modifyTaskMemo,addTaskMemo} from '@/api/caseList'
  import VueUeditorWrap from 'vue-ueditor-wrap'
  export default {
    props:{
      taskData:{

      }
    },
    data(){
      return {
        myConfig: {
          toolbars: [[
            'fullscreen', 'source', '|', 'undo', 'redo', '|',
            'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
            'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
            'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
            'directionalityltr', 'directionalityrtl', 'indent', '|',
            'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
            'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
            'horizontal', 'date', 'time', 'spechars', 'wordimage', '|',
            'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
            'print', 'preview', 'searchreplace', 'drafts'
          ]],
          imageActionName:'upfile',
          // imageAllowFiles:['jpg','png','gif'],
          imageFieldName:'upFile',
          imageUrlPrefix:'',
          //是否启用元素路径，默认是显示
          elementPathEnabled : false,
          enableAutoSave:false,
          //wordCount
          wordCount: false  ,        //是否开启字数统计
          maximumWords:100000 ,      //允许的最大字符数
          // 编辑器不自动被内容撑高
          autoHeightEnabled:false,
          // 初始容器高度
          initialFrameHeight: 200,

          // 初始容器宽度
          initialFrameWidth: '100%',
          // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
          serverUrl: `/ip_service/interface/material/uploadMaterial?tokenID=${this.$store.getters.token}`,
          // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
          UEDITOR_HOME_URL: '/UEditor/'
        },
        memo:'',
        memoState:false
      }
    },
    name: "addMemo",
    methods:{
      addTaskMemo(){
        addTaskMemo({prjTaskId:this.taskData.prjTaskId,memo:this.memo,ifRemind:this.taskData.ifRemind}).then(res=>{
          this.$emit('update')
          this.memoState=false
          this.memo=''
        })
      },
      takeMemo(){
        this.memoState=true
        setTimeout(()=>{
          document.getElementById('addCom').scrollIntoView(false)
          }
        )


      }
    },
    components:{
      VueUeditorWrap
    }
  }
</script>

<style lang="scss" scoped>
.comment{
  margin: 0 0 5px 0;
  padding: 0;
  text-align: left;
  width: auto;
  color:#707070;
  font-size: 12px;
}
</style>
