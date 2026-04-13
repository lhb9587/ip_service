<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>系统更新</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="handleSee('systemUpdateRecordList')">查看历史</el-button>
        <el-button style="float: right; padding: 3px 0" type="text" v-allow="0" @click="handleAdd('systemUpdateRecordList')">添加</el-button>
      </div>
      <div v-for="item in systemUpdateRecordList" :key="item.id" class="text item" style="overflow: hidden" @contextmenu="contextmenu('systemUpdateRecordList',item)">
        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.modifyDate }}</span>
        <el-popover
          placement="top-start"
          trigger="hover"
          popper-class="background245241229"
        >
          <div  style="background: rgb(245,241,229)" v-html="getSpecialInfo(item.message)"></div>
          <p class="ellipsis" slot="reference">{{ item.message }}</p>
        </el-popover>


        <!--      {{item.message}}{{item.modifyDate}}-->
      </div>
    </el-card>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form ref="form" :model="updateData" label-width="80px" size="mini">
        <el-form-item label="内容">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="updateData.message">
          </el-input>
        </el-form-item>
        <el-form-item label="版本号">
          <el-input v-model="updateData.version"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  // insertSystemUpdateRecord deleteSystemUpdateRecord updateSystemUpdateRecord querySystemUpdateRecord
  import { querySystemUpdateRecordList,insertSystemUpdateRecord, deleteSystemUpdateRecord, updateSystemUpdateRecord, querySystemUpdateRecord } from '@/api/systemList'
  export default {
    name: "VersionCard",
    data() {
      return {
        dialogVisible:false,
        updateData:{
          createDate: "",
          createUserId: this.$store.getters.userId,
          id: null,
          message: "",
          modifyDate: "",
          version: "",},
        systemUpdateRecordList: [],
        addType:'',
        operateType:'',
        systemGuidelinesList:[{title:'死亡日记',username:'陈红',img:'/ipdoc/upload/usericon/2.jpg',desc:'今天真开心',}]
      }
    },
    created() {
      this.init()
      // this.$commonUtils.downLoadAll({url:'ipdoc/ipexport/material/applicant/1594278094592.zip'})
    },
    methods:{
      init(){
        this.querySystemUpdateRecordList()
      },
      handleSee(type){
        if(type=='systemUpdateRecordList'){
          this.$router.push('historyDetail')
        }
        if(type='userManual'){

        }

      },
      contextmenu(type, item) {
        if(type=='userManual'){
          const that=this
          this.$ContextMenu({
            event, // 传入鼠标事件
            menu: this.getRowContextmenuList(item)
          }).then(rs => {
            if(rs){
              this[rs](item, type, event);
            }
          });
        }
        if(type=='systemUpdateRecordList'){
          if(!this.getRowContextmenuList(item).length){
            return
          }
          const that=this
          this.$ContextMenu({
            event, // 传入鼠标事件
            menu: [ {name: '下载', action: 'downLoadAll'}]
          }).then(rs => {
            if(rs){
              this[rs](item, type, event);
            }
          });
        }
      },
      downLoadAll(){

      },
      handleAdd(type){
        this.addType=type
        this.operateType='add'
        this.updateData={
          createDate: "",
          createUserId: this.$store.getters.userId,
          id: null,
          message: "",
          modifyDate: "",
          version: ""}
        this.dialogVisible=true
      },
      handleConfirm(){
        if(this.operateType=='add'){
          insertSystemUpdateRecord(this.updateData).then(res=>{
            this.dialogVisible=false
            this.init()
          })
        }else {
          updateSystemUpdateRecord(this.updateData).then(res=>{
            this.dialogVisible=false
            this.init()
          })
        }

      },
      getSpecialInfo(string){
        if(string){
          return string.split('\n').map(item=>`<p style="word-wrap: break-word;
    word-break: break-word;">${item}</p>`).join('')
        }else {
          return ''
        }
      },
      getRowContextmenuList(item) {
        return [
          // {name: '复制', action: 'copy'},
          {name: '修改', action: 'editMessage', permissions: 0},
          {name: '删除', action: 'delMessage', permissions: 0}].filter(item => {
          if (item.permissions) {
            return this.$store.getters.permissions.includes(item.permissions)
          } else {
            return  true
          }
        })
      },
      editMessage(item,type){
        this.operateType='update'
        this.updateData=item
        this.dialogVisible=true
      },
      delMessage(item,type){
        deleteSystemUpdateRecord({id:item.id}).then(res=>{
          this.dialogVisible=false
          this.init()
        })
      },
      querySystemUpdateRecordList(){
        querySystemUpdateRecordList({pageNo:1,

          pageSize:5}).then(res=>{
          this.systemUpdateRecordList=res.data
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .box_card_wrap{
    width: 800px;
    padding: 10px;
    .box-card{
      /*height: 200px;*/
      /*flex: 1;*/
      width: 50%;
      margin-right:10px ;
    }
  }
  .systemGuidelines_warp{
    flex: 1;
    border: 1px solid #c9c9c9;
  }
  .systemGuidelines_box{
    height: 400px;
    width: 300px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, .2);
    .systemGuidelines_title{
      height: 30px;
    }
    .systemGuidelines_img{
      border-radius:50%;
      width: 30px;
      height: 30px;
      margin-right: 10px;
      margin-bottom: 10px;
      vertical-align: middle;
    }
    .item{
      padding: 10px;
      border-bottom:1px solid #c9c9c9;
      .item_title{
        font-size: 14px;
        margin-bottom: 10px;
      }
      .item_username{
        font-size: 14px;
      }
      .item_desc{
        font-size: 12px;
      }
    }

  }
  .ellipsis{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    margin-bottom: 8px;
    font-size: 14px;
  }

</style>
