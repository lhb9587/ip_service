<template>
  <div class="taskDetail_wrap" >
  <div class="taskDetail">
    <div class="wrap_left">
      <div class="model_wrap">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item style="color: #00b0ff"  :to="{ path: `/workbench/ResourceView/project?projectId=${taskData.projectId}` }">{{taskData.prjName}}</el-breadcrumb-item>
          <el-breadcrumb-item >{{taskData.prjTgName}}</el-breadcrumb-item>
<!--          <el-breadcrumb-item :to="{ path: `/workbench/ResourceView/taskDetail?prjTaskId=${taskData.prjTaskId}`}">{{taskData.prjTaskName}}</el-breadcrumb-item>-->
        </el-breadcrumb>
        <div style="font-size: 18px;font-weight: bold;line-height: 32px">
          <a :href="`#/workbench/ResourceView/taskDetail?prjTaskId=${taskData.prjTaskId}`">{{taskData.prjTaskName}}</a></div>
        <div style="margin: 10px">
          <el-button  type="primary" icon="el-icon-chat-line-round" size="mini" @click="takeMemo">备注</el-button>
          <el-button  type="primary" size="mini" @click="takeAssign">分配</el-button>
          <el-button  type="primary" size="mini" @click="remindPlan">提醒计划</el-button>
          <el-button  type="primary" size="mini" v-if="taskData.taskStatus!=='已完成'" @click="completeTask ">完成</el-button>
          <el-dropdown trigger="click" @command="handleCommand">
            <span class="el-dropdown-link">
              <el-button type="primary"  size="mini" >更多 <i class="el-icon-arrow-down el-icon--right"></i></el-button>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item  command="关注">{{taskData.watchList.find(item=>item.userId==$store.getters.userId)?'停止关注':'添加关注'}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="model_wrap">
        <div class="divider"><span>任务详情</span></div>
        <div>
          <el-form label-position="right" label-width="100px">
            <el-form-item label="任务名称:">
              <el-input
                placeholder="请输入任务名称"
                v-model="taskData.prjTaskName"
                style="width: 150px"
                size="small"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="状态:">
              {{taskData.taskStatus}}
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="model_wrap">
        <div class="divider"><span>描述</span></div>
        <div>
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 4}"
            placeholder="请输入任务描述"
            v-model="taskData.prjTaskDesc"
          >
          </el-input>
<!--          <VueUeditorWrap v-model="taskData.prjTaskDesc"  :config="myConfig" :destroy="true"  ></VueUeditorWrap>-->
        </div>
      </div>
      <div class="model_wrap">
        <div class="divider"><span>任务检查项</span></div>
        <div>
          <el-input
            type="textarea"
            :autosize="{ minRows: 1, maxRows: 4}"
            placeholder="请输入任务检查项"
            v-model="taskData.checkItem"
            @change="changeCheckItem">
          </el-input>
        </div>
      </div>
      <div class="model_wrap">
        <div class="divider"><span>附件</span></div>
          <div class="uploadwrap" :style="{'height': '100%','background':hoverState?'RGBA(32,159,255,0.06)':'#fff','overflow':'auto','padding':'20px'}"
                @drop.stop.prevent="enentDrop($event)"
                @dragover.stop.prevent="hoverState=true"
                @dragleave.stop.prevent="hoverState=false"
                @dragenter.stop.prevent="hoverState=true">
            <div style="text-align: center">
              <span style="font-size: 12px">将文件拖放到此处以添加附件，或者<span style="color: #409EFF;cursor: pointer;" @click="clickUpload=true">浏览</span></span>
            </div>

            <uploadFile :clickUpload="clickUpload" @getUploadFile="getUploadFile" @changeClick="clickUpload=false"></uploadFile>

            <div class="fileWarp" v-if="taskData.fileList&&taskData.fileList.length">
              <div class="file_item" v-for="item in taskData.fileList">
                <i class="el-icon-circle-close" @click="unbindTaskFile(item)">

                </i>
                <div>
                  <svg-icon  class="svg-icon" :icon-class="$commonUtils.getSuffixFile(item.address)"/>
                </div>
                  <p class="fileName"><a :href="`ipdoc${item.address}`"  target="_blank">{{item.name}}</a></p>
                <p class="file_detail"><span>{{item.createDate}}</span><span class="creater">{{item.creater}}</span></p>
              </div>
            </div>
          </div>
      </div>
      <div class="model_wrap">
        <div class="divider"><span>活动</span></div>
        <el-tabs type="border-card">
          <el-tab-pane label="备注">
            <remarksCom ref="remarksCom" :ifRemind="taskData.ifRemind" :prjTaskId="prjTaskId" ></remarksCom>
          </el-tab-pane>
          <el-tab-pane label="改动记录">
            <ChangeRecord ref="ChangeRecord" :taskHistoryList="taskData.taskHistoryList"></ChangeRecord>
          </el-tab-pane>
          <addMemo ref="addMemo" :taskData="taskData"  @update="update"></addMemo>
        </el-tabs>
      </div>
    </div>
    <div class="wrap_right">
      <div class="model_wrap">
        <div class="divider"><span>用户</span></div>
        <el-form label-position="left" label-width="120px">
          <el-form-item label="任务创建人:">
            <UserIconAndUserName :user-id="taskData.creator" ></UserIconAndUserName>
          </el-form-item>
          <el-form-item label="当前任务执行人:">
            <UserIconAndUserName :user-id="taskData.executor" ></UserIconAndUserName>
          </el-form-item>
          <el-form-item label="关注人:">
            <el-popover
              placement="left"
              width="270"
              trigger="click">
              <div>添加关注者</div>
              <virtual-select clearable :isUser="true" :data="$store.getters.userList"  v-model="watchId" @change="watchIdChange" filterable :render="(data)=>$commonUtils.UserRender(data)" >
              </virtual-select>
              <div>输入用户名</div>
              <div v-if="taskData.watchList.length">
                <div class="watch_User" v-for="item in taskData.watchList" >
                  <UserIconAndUserName :user-id="item.userId" ></UserIconAndUserName>
                  <i  @click="deleteTaskWach(item.userId)"  class="el-icon-delete"></i>
                </div>

              </div>
              <el-badge slot="reference" :value="taskData.watchList.length" class="item" type="primary">
              </el-badge>
            </el-popover>

            <span class="watch" @click="modifyTaskWatch(false)" v-if="taskData.watchList.find(item=>item.userId==$store.getters.userId)">
              停止关注这个任务
            </span>
            <span class="watch" @click="modifyTaskWatch(true)" v-else>
               关注这个任务
            </span>
          </el-form-item>
        </el-form>
      </div>
      <div class="model_wrap">
        <div class="divider"><span>日期</span></div>
        <el-form label-position="left" label-width="90px">
          <el-form-item label="创建:">
            {{taskData.createDate}}
          </el-form-item>
          <el-form-item label="更新:">
            {{modifyDate}}
          </el-form-item>
          <el-form-item label="开始:">
            <el-date-picker
              v-model="taskData.startDate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="截止:">
            <el-date-picker
              v-model="taskData.endDate"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <div class="model_wrap">
        <div class="divider"><span>提醒</span></div>
        <el-form label-position="left" label-width="120px">
          <el-form-item label="本次修改提醒:">
            <el-checkbox
              v-model="taskData.ifRemind"
              :true-label="1"
              :false-label="0"
            ></el-checkbox>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="progressWrap" v-if="percentage">
      <el-progress type="circle" :percentage="percentage"></el-progress>
    </div>
  </div>
  <div class="button_wrap">
    <el-button size="mini" type="primary" @click="confirm">确定</el-button>
    <el-button size="mini"  v-if="!isComponent" @click="cancel">返回</el-button>
  </div>
    <el-dialog
      title="任务执行人"
      :visible.sync="excutorView"
      width="50%"
      append-to-body
      :modal="false"
      height="500"
      center
      top="0"
      v-dialogDrag
      :close-on-click-modal="false"
    >
      <div style="display: flex;flex-direction: column; align-items: center;justify-content: center">

        <div style="display: flex;width: 100%; align-items: center;justify-content:left;padding-left: 18% ;margin-bottom: 30px">
          <span style="display: inline-block;width: 100px;text-align: right;padding-right: 20px">执行人:</span>
          <virtual-select clearable :isUser="true" :data="$store.getters.userList" v-model="taskData.executor"  filterable :render="(data)=>$commonUtils.UserRender(data)" >
          </virtual-select>
        </div>
        <div style="display: flex;width: 100%; align-items: center;justify-content:left;padding-left: 18% ;margin-bottom: 30px">
          <span style="display: inline-block;width: 100px;text-align: right;padding-right: 20px">常用执行人:</span>
          <localExector @getUserId="(e)=>taskData.executor=e"></localExector>
        </div>
        <div style="display: flex;width: 100%; align-items: center;justify-content:left;padding-left: 18% ">
          <span style="display: inline-block;width: 100px;text-align: right;padding-right: 20px">截止日期:</span>
          <el-date-picker
            class="executor"
            v-model="taskData.endDate"
            type="date"
            :clearable="false"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            :picker-options="expireTimeOption()">
          </el-date-picker>
        </div>

      </div>
      <span slot="footer" class="dialog-footer" style="display: flex;justify-content: center">
          <el-button @click="assginTask" type="primary" size="small">确 定</el-button>
          <el-button size="small" @click="excutorView = false">取 消</el-button>
        </span>
    </el-dialog>
    <taskPlanList :visible.sync="taskPlanState" :task-info="taskData"></taskPlanList>
  </div>
</template>

<script>
  import localExector from './localExector'
  import addMemo from "./addMemo";
  import remarksCom from "./remarksCom";
  import ChangeRecord from "./ChangeRecord";
import taskPlanList from "./taskPlanList";
  import {
    addCaseEventUrl,

  } from "@/api/caseDetail";
  import VueUeditorWrap from 'vue-ueditor-wrap'
  import uploadFile from '@/views/workbench/material_management/components/uploadFile'
  import {modifyProjectTask,queryTaskById,queryWorkType,assginTask,creatematerial,bindTaskFile,finishTask,addTaskWach,deleteTaskWach,queryTaskWatch,unbindTaskFile} from '@/api/caseList'

  export default {
    props:{
      prjTaskId:{

      }
    },
    name: "taskDetail",
    data(){
      return {
        taskPlanState:false,
        referralView:false,
        text:'',
        workKinds:[],
        percentage:0,
        excutorView:false,
        clickUpload:false,
        taskData:{
          checkItem:'',
          watchList:[]
        },
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
          // serverUrl: `/ip_kg/interface/material/creatematerial?tokenID=${this.$store.getters.token}`,
          // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
          UEDITOR_HOME_URL: '/UEditor/'
        },
        hoverState:false,
        isComponent:false,
        watchId:null,
        reMarksState:true,
        modifyDate:''
      }
    },

    created() {
      this.init()
      // this.queryWorkType()
    },
    methods:{
      init(){
        if(this.$route.query.prjTaskId){
          this.queryTaskById(this.$route.query.prjTaskId)
        }else {
          this.isComponent=true
          this.queryTaskById(this.prjTaskId)
        }
      },
      remindPlan(){
        this.taskPlanState=true
      },
      handleCommand(command){
        if(command=='关注'){
          if(this.taskData.watchList.find(item=>item.userId==this.$store.getters.userId)){
            this.modifyTaskWatch(false)
          }else {
            this.modifyTaskWatch(true)
          }
        }
      },
      update(){
        this.$refs.remarksCom.queryTaskMemo()
      },
      takeMemo(){
        this.$refs.addMemo.takeMemo()
      },
      addTaskWach(){
        addTaskWach({prjTaskId:this.taskData.prjTaskId,userId:this.$store.getters.userId}).then(res=>{
          this.queryTaskWatch(this.taskData.prjTaskId)
        })
      },
      unbindTaskFile({materialId}){
        this.$confirm(`该操作将会删除该附件,确定要继续吗`,'提示').then(res=>{
          unbindTaskFile({prjTaskId:this.taskData.prjTaskId,materialId}).then(res=>{
            this.taskData.fileList=this.taskData.fileList.filter(item=>item.materialId!=materialId)
          })
        })
      },
      watchIdChange(e){
        if(this.taskData.watchList.find(item=>item.userId==e)){
          this.watchId=null
          this.$message.warning('该员工已关注')
          return
        }
        if(e){
          addTaskWach({prjTaskId:this.taskData.prjTaskId,userId:e}).then(res=>{
            this.queryTaskWatch(this.taskData.prjTaskId)
            this.watchId=null
            this.$message.success('添加成功')
          })
        }
      },
      deleteTaskWach(userId){
        let twId=this.taskData.watchList.find(item=>item.userId==userId).twId
        deleteTaskWach({prjTaskId:this.taskData.prjTaskId,userId,twId}).then(res=>{
          this.queryTaskWatch(this.taskData.prjTaskId)
        })
      },
      modifyTaskWatch(flag){
        if(flag){
          this.addTaskWach()
        }else {
          this.deleteTaskWach(this.$store.getters.userId)
        }
      },

      queryTaskWatch(prjTaskId){
        queryTaskWatch({prjTaskId}).then(res=>{
          this.$set(this.taskData,'watchList',res.data)
          // this.taskData.watchList=res.data
        })
      },
      takeAssign(){
        this.excutorView=true

      },
      completeTask(){
        finishTask({prjTaskId:this.taskData.prjTaskId}).then(res=>{
          this.init()
        })
      },
      changeCheckItem(e){
        this.taskData.itemList = e.split(/\r\n|\n/).filter(i=>!!i).map((item,index)=>({prjIemName:index+1+'.'+item.replace(/^\d[.]/,'')}))
      },
      assginTask() {
        // return;

        if(!this.taskData.executor){
          this.$message.error('请选择执行人')
          return
        }
        if(!this.taskData.endDate){
          this.$message.error('请填写截止时间')
          return;
        }
        if(this.CompareDate(this.taskData.endDate,this.taskData.startDate)){
          this.$message.error('超出当前截止时间')
          return;
        }
        assginTask({prjTaskId:this.prjTaskId, executor:this.taskData.executor, endDate: this.taskData.endDate}).then(()=>{
          this.$message.success('任务分配成功!')
          this.init()
          this.excutorView = false
        })
      },
      expireTimeOption(){
        let that=this
        return {
          disabledDate(date) {
            return that.CompareDate(that.$commonUtils.formatDate(date),that.taskData.startDate)
          }
        }
      },
      CompareDate(d1,d2){
        if(!d2){
          return false
        }
        return ((new Date(d1.replace(/-/g,"\/"))) < (new Date(d2.replace(/-/g,"\/"))));
      },
      queryWorkType(){
        queryWorkType().then(res=>{
          this.workKinds = res.data
        })
      },
      enentDrop(e){
        e.stopPropagation();
        e.preventDefault();
        this.hoverState=false
        this.curFile=e.dataTransfer.files
        this.createMultMaterial(this.curFile)
      },

      getUploadFile(e){
        this.curFile=e.target.files
        this.createMultMaterial(this.curFile)
      },
      bindTaskFile(prjTaskId,materialIdList){
        addCaseEventUrl({
          prjTaskId,
          projectId:this.taskData.projectId,
          materialIdList,
          materialTypeId: 300046,
          docTypeName:'内部往来',
          doctId: 6,
          eventName: '项目文档',
          typeName: '项目文档', }).then(res=>{
        })
        bindTaskFile({prjTaskId, projectId:this.taskData.projectId,materialIdList}).then( async res=>{
          // await this.modifyProjectTask()
          // this.init()
        })
      },
     getTimer() {
        var time = new Date();
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate();
        var w = time.getDay();
        var w1 = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
        var h = time.getHours();
        h = h < 10 ? '0' + h : h;
        var min = time.getMinutes();
        min = min < 10 ? '0' + min : min;
        var s = time.getSeconds();
        s = s < 10 ? '0' + s : s;

        return   y + '-' + m + '-' + d + ' ' + h + ':' + min + ':' + s + ' ' //+ w1[w];
      },
      createMultMaterial(file){
          let formData = new FormData()
          for (let item of file){
            formData.append("attachFile", item);
          }
        formData.append("materialTypeId", 300046);
          formData.append("tokenID", this.$store.getters.token);
        creatematerial(formData,(e)=>{
            this.percentage = parseInt(e.loaded/e.total*100)
          }).then(async res=>{
            this.percentage = 0
            res.data.forEach(item=>{
              item.name=item.materialName
              item.createDate=this.getTimer()
            })
          this.materialIdList=res.data.map(item=>item.materialId)
          this.bindTaskFile(this.prjTaskId,this.materialIdList)
          if(!this.taskData.fileList){
            this.taskData.fileList=[]
          }
          this.taskData.fileList=[...this.taskData.fileList,...res.data]
          this.$message.success(res.message)
          }).catch(()=>{
            this.percentage = 0
          })
      },
      queryTaskById(prjTaskId){

        this.prjTaskId=Number(prjTaskId)
        queryTaskById({prjTaskId}).then(res=>{
          this.taskData=res.data
          this.modifyDate=res.data.modifyDate
          delete res.data.modifyDate
          if(!this.taskData.watchList){
            this.taskData.watchList=[]
          }
          if(this.taskData.itemList){
            this.$set( this.taskData,'checkItem',this.taskData.itemList.map(item=>item.prjIemName).join('\n'))
          }else {
            this.$set( this.taskData,'checkItem','')
          }

        })
      },
     async confirm(){
       await  this.modifyProjectTask()
       this.$message.success('修改成功')
       this.init()
       this.cancel()
      },
       modifyProjectTask(){
        return  modifyProjectTask(this.taskData)
      },
      cancel(){
        if(!this.isComponent){
          this.$router.go(-1)
        }else{
          this.$emit('closeDetail')
        }

      }
    },

    components:{
      uploadFile,VueUeditorWrap,taskPlanList,ChangeRecord,remarksCom,addMemo,localExector
    }
  }
</script>

<style lang="scss" scoped>
  .taskDetail{
    position: relative;
    display: flex;
    flex: 1;
    overflow: auto;
    .wrap_left{
      width: 60%;
      .el-form{
        display: flex;
        flex-wrap:wrap;
        padding: 10px;
        .el-form-item{
          width: 50%;

        }

      }
    }
    .wrap_right{
     width: 40%;
      .el-form{
        display: flex;
        flex-wrap:wrap;
        padding: 10px;
        .el-form-item{
          width: 100%;
        }
      }
    }
    .model_wrap{
      margin-bottom: 15px;
  padding: 0 15px;
    }
    .uploadwrap{
      border: 1px dashed #c9c9c9;
    }
  }
  .divider {
    position: relative;
    border-bottom: 1px solid rgba(215, 215, 215, 1);
    margin-bottom: 10px;
    margin-top: 20px;
    span {
      color: #333;
      font-weight: bold;
      font-size: 14px;
      background: #fff;
      position: absolute;
      bottom: -9px;
      left: 10px;
      padding: 0 2px;
    }
  }
  .fileWarp{
    display: flex;
    flex-wrap: wrap;
    font-size: 12px;
    .file_item{
      position: relative;
      width: 200px;
      margin: 0 15px 15px 0;
      .el-icon-circle-close{
        cursor: pointer;
        font-size: 16px;
        position: absolute;
        right: 0;
        top: 0;
        display: none;
      }
      &:hover{
        .el-icon-circle-close{
          display: block;
        }
      }
      .fileName{
        font-size: 14px;
        color: #00b0ff;
        overflow: hidden;
        white-space: nowrap;
      }
      .file_detail{
        display: flex;
        justify-content: space-between;
      }
    }
  }
.button_wrap{
  display: flex;
  justify-content: center;
}
  .progressWrap{
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0,0,0,0.6);
    .el-progress{
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
      /deep/ .el-progress__text{
        color: #fff;
      }
      /deep/ path{
        fill: none !important;
      }
    }
  }
  .taskDetail .wrap_left .model_wrap .svg-icon{
    color: #999;
    font-size: 50px !important ;
    width: 200px;
}
  /deep/ .el-badge__content.el-badge__content--primary{
    top: 0;
    line-height: 17px;
  }
  .watch{
    color:  #3b73af;
    cursor: pointer;
  }
  .watch :hover{
    text-decoration: underline;
  }
  .watch_User{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .el-icon-delete{
      display: none;
      cursor: pointer;

    }
    &:hover{
      .el-icon-delete{
        display: inline-block;
      }
    }
  }
  .taskDetail_wrap{
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 90px);
  }
</style>
