<template>
<div>
  <div v-if="memoList.length">
    <div class="item_warp" v-for="item in memoList" >
      <div class="item_warp_header">
        <div style="display: flex;align-items: center">
          <UserIconAndUserName class="item_header_corB" :user-id="item.userId" ></UserIconAndUserName><span>添加了备注-{{item.createDate}}</span>
        </div>

        <div class="item_opticon">
          <i class="el-icon-edit" @click="getModifyData(item)"></i>
          <i class="el-icon-delete" @click="deleteTaskMemo(item)"></i>
        </div>
      </div>
      <div class="commit" v-html="item.memo"></div>
    </div>
  </div>

  <el-dialog
    v-dialogDrag
    center
    top="0"
    title="编辑备注"
    height="852"
    :visible.sync="memoState"
    width="50%"
    :modal="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form label-width="75px">
      <el-form-item label="作者:">
        <UserIconAndUserName :user-id="modifyData.userId" ></UserIconAndUserName>
      </el-form-item>
      <el-form-item label="创建日期:">
       {{modifyData.createDate}}
      </el-form-item>
      <el-form-item label="备注:">
        <VueUeditorWrap  v-model="modifyData.memo"  :config="myConfig" :destroy="true"  >
        </VueUeditorWrap>
      </el-form-item>

    </el-form>
    <div style="display:flex;justify-content: flex-end;">
      <el-button type="primary"  size="mini" @click="modifyTaskMemo">保存</el-button>
      <el-button type="text"  size="mini" @click="memoState=false">取消</el-button>
    </div>
    <div>

    </div>
  </el-dialog>

<!--  <el-button type="primary" icon="el-icon-chat-line-round">备注</el-button>-->

</div>
</template>

<script>
  const deleTaskComponent = {
    props: {
      modifyData: {},
      list:{

      }
    },
    template:`
      <div class="deleTaskComponent">
      <div>你确定要删除这个备注吗?</div>
      <el-form label-width="75px">
        <el-form-item label="作者:">
          <UserIconAndUserName :user-id="modifyData.userId" :list="list"></UserIconAndUserName>
        </el-form-item>
        <el-form-item label="创建日期:">
                 {{modifyData.createDate}}
        </el-form-item>
        <el-form-item label="备注:">
        <div v-html="modifyData.memo" class="memo" style="max-height: 400px;overflow: auto"></div>
        </el-form-item>
      </el-form>
      </div>`
  }
  import VueUeditorWrap from 'vue-ueditor-wrap'
  import {queryTaskMemo,deleteTaskMemo,modifyTaskMemo,addTaskMemo} from '@/api/caseList'
  export default {
    props:{
      prjTaskId:{

      },
      ifRemind:{}
    },
    name: "remarksCom",
    data(){
      return{
        memoList:[],
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
          autoHeightEnabled: true,
          // 初始容器高度
          initialFrameHeight: 200,
          autoHeightEnabled:false,
          // 初始容器宽度
          initialFrameWidth: '100%',
          // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
           serverUrl: `/ip_service/interface/material/uploadMaterial?tokenID=${this.$store.getters.token}`,
          // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
          UEDITOR_HOME_URL: '/UEditor/'
        },
        modifyData:{

        },
        memoState:false
      }
    },
    created() {
      this.queryTaskMemo()
    },
    methods:{
      queryTaskMemo(){
        queryTaskMemo({prjTaskId:this.prjTaskId}).then(res=>{
          this.memoList=res.data
        })
      },
      deleteTaskMemo(item){
        this.modifyData=JSON.parse(JSON.stringify(item))
        const h = this.$createElement;
        this.$msgbox({
          title: '删除备注',
          message: h(deleTaskComponent ,
            {
              props: {
                modifyData: this.modifyData,
                list:this.$store.getters.allUserList
              },
            }),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(action => {
          this.modifyData.ifRemind=this.ifRemind
          delete this.modifyData.modifyDate
          deleteTaskMemo(this.modifyData).then(res=>{
            this.queryTaskMemo()
          })
        });
      },
      getModifyData(item){
        this.modifyData=JSON.parse(JSON.stringify(item))
        this.memoState=true
      },
      modifyTaskMemo(){

        this.modifyData.ifRemind=this.ifRemind
        delete this.modifyData.modifyDate
        modifyTaskMemo(this.modifyData).then(res=>{
          this.memoState=false

          this.queryTaskMemo()
        })
      },

    },
    components:{
      VueUeditorWrap,deleTaskComponent
    }
  }
</script>

<style lang="scss" scoped>
.item_warp{
  font-size: 12px;
  padding: 5px 10px;
  .item_warp_header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap:nowrap ;
  }
  .item_opticon{
    display: none;
    i{
      cursor: pointer;
    }
  }
  .commit{
    margin: 10px 0;
  }
  &:hover .item_opticon{
    display: inline-block;
  }
}
  .deleTaskComponent /deep/{
    .el-form{
      .el-form-item{
        margin-bottom: 10px;
      }
      .el-form-item__label{
        line-height: 24px;
      }
      .el-form-item__content{
        line-height: 24px;
      }
    }
  }
.item_header_corB{
  color: #3b73af;

}
</style>
