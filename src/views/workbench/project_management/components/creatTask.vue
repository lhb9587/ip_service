<template>
  <el-dialog
    v-dialogDrag
    center
    top="0"
    :title="title"
    height="852"
    :visible.sync="newlovingVue"
    :width="width"
    :modal="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
  <div>
    <div class="taskDetail">
      <div class="wrap_left">
        <div class="model_wrap">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item >{{taskData.prjName}}</el-breadcrumb-item>
            <el-breadcrumb-item v-if="taskData.prjTgName">{{taskData.prjTgName}}</el-breadcrumb-item>
            <el-breadcrumb-item  v-if="taskData.prjTaskName">{{taskData.prjTaskName}}</el-breadcrumb-item>
          </el-breadcrumb>
          <div style="margin: 10px">
<!--            <el-button  type="primary" size="mini" @click="takeAssign">分配</el-button>-->
<!--            <el-dropdown trigger="click" @command="handleCommand">-->
<!--            <span class="el-dropdown-link">-->
<!--              <el-button type="primary"  size="mini" >更多 <i class="el-icon-arrow-down el-icon&#45;&#45;right"></i></el-button>-->
<!--            </span>-->
<!--              <el-dropdown-menu slot="dropdown">-->
<!--                &lt;!&ndash;              <el-dropdown-item  command="转案">转案</el-dropdown-item>&ndash;&gt;-->
<!--              </el-dropdown-menu>-->
<!--            </el-dropdown>-->
          </div>
        </div>
        <div style="margin: 10px">
          <el-button  type="primary" size="mini" @click="remindPlan">提醒计划</el-button>

        </div>
        <div class="model_wrap">
          <div class="divider"><span>任务详情</span></div>
          <div>
            <el-form label-position="left" label-width="100px">
              <el-form-item label="阶段:">
                <el-select
                  clearable
                  allow-create
                  filterable
                  v-if="prjTgIdState"
                  v-model="taskData.prjTgId"
                  @change="changeHa"
                  placeholder="请选择或输入创建"
                  default-first-option
                >
                  <el-option
                    v-for="(item, index) in taskgroupList"
                    :key="item.prjTgId"
                    :label="item.prjTgName"
                    :value="item.prjTgId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="任务名称:" required>
               <el-input type="text"  v-model="taskData.prjTaskName"  clearable></el-input>
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
<!--            <VueUeditorWrap v-model="taskData.prjTaskDesc"  :config="myConfig" :destroy="true"  ></VueUeditorWrap>-->
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
                <p class="fileName"><a :href="`ipdoc${item.address}`" target="_blank">{{item.name}}</a></p>
                <p class="file_detail"><span>{{item.createDate}}</span><span class="creater">{{item.creater}}</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="wrap_right">
        <div class="model_wrap">
          <div class="divider"><span>用户</span></div>
          <el-form label-position="left" label-width="100px">
            <el-form-item label="任务创建人:">
              <virtual-select clearable :isUser="true" :data="$store.getters.userList" v-model="taskData.creator"  filterable :render="(data)=>$commonUtils.UserRender(data)" />
            </el-form-item>
            <el-form-item label="当前任务执行人:">
              <virtual-select clearable :isUser="true" :data="$store.getters.userList" v-model="taskData.executor"  filterable :render="(data)=>$commonUtils.UserRender(data)" />
              <localExector @getUserId="(e)=>$set(taskData,'executor',e)"></localExector>
            </el-form-item>
          </el-form>
        </div>
        <div class="model_wrap">
          <div class="divider"><span>日期</span></div>

          <el-form label-position="left" label-width="100px">
            <el-form-item label="创建:">
              <el-date-picker
                v-model="taskData.createDate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="开始:">
              <el-date-picker
                v-model="taskData.startDate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                :picker-options="expireTimeOption(taskData.endDate)">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="截止:">
              <el-date-picker
                v-model="taskData.endDate"
                type="date"
                placeholder="选择日期"
                :picker-options="expireTimeOption(taskData.startDate)"
                value-format="yyyy-MM-dd">
              </el-date-picker>
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
      <el-button size="mini"  @click="cancel">返回</el-button>
    </div>
    <taskPlanList :visible.sync="taskPlanState" @getData="getData"></taskPlanList>
  </div>
</el-dialog>
<!--    <el-dialog-->
<!--      title="任务执行人"-->
<!--      :visible.sync="excutorView"-->
<!--      width="50%"-->
<!--      append-to-body-->
<!--      :modal="false"-->
<!--      height="500"-->
<!--      center-->
<!--      top="0"-->
<!--      v-dialogDrag-->
<!--      :close-on-click-modal="false"-->
<!--    >-->
<!--      <div style="display: flex;flex-direction: column; align-items: center;justify-content: center">-->
<!--        <div style="display: flex;width: 100%; align-items: center;justify-content:left;padding-left: 18% ;margin-bottom: 30px">-->
<!--          <span style="display: inline-block;width: 100px;text-align: right;padding-right: 20px">执行人:</span>-->
<!--          <virtual-select clearable  :data="$store.getters.userList" v-model="taskData.executor"  filterable :render="(data)=>$commonUtils.UserRender(data)" >-->
<!--          </virtual-select>-->
<!--          &lt;!&ndash;          <el-select class="executor" v-model="taskData.executor" placeholder="请选择执行人" filterable clearable>&ndash;&gt;-->
<!--          &lt;!&ndash;            <el-option&ndash;&gt;-->
<!--          &lt;!&ndash;              v-for="item in this.$store.getters.userList"&ndash;&gt;-->
<!--          &lt;!&ndash;              :key="item.userId"&ndash;&gt;-->
<!--          &lt;!&ndash;              :label="item.fullname"&ndash;&gt;-->
<!--          &lt;!&ndash;              :value="item.userId">&ndash;&gt;-->
<!--          &lt;!&ndash;              <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>&ndash;&gt;-->
<!--          &lt;!&ndash;            </el-option>&ndash;&gt;-->
<!--          &lt;!&ndash;          </el-select>&ndash;&gt;-->
<!--        </div>-->
<!--        <div style="display: flex;width: 100%; align-items: center;justify-content:left;padding-left: 18% ">-->
<!--          <span style="display: inline-block;width: 100px;text-align: right;padding-right: 20px">截止日期:</span>-->
<!--          <el-date-picker-->
<!--            class="executor"-->
<!--            v-model="taskData.endDate"-->
<!--            type="date"-->
<!--            :clearable="false"-->
<!--            value-format="yyyy-MM-dd"-->
<!--            placeholder="选择日期"-->
<!--            :picker-options="expireTimeOption()">-->
<!--          </el-date-picker>-->
<!--        </div>-->

<!--      </div>-->
<!--      <span slot="footer" class="dialog-footer" style="display: flex;justify-content: center">-->
<!--          <el-button @click="assginTask" type="primary" size="small">确 定</el-button>-->
<!--          <el-button size="small" @click="excutorView = false">取 消</el-button>-->
<!--        </span>-->
<!--    </el-dialog>-->


</template>

<script>
  import localExector from './localExector'
import {
  addCaseEventUrl,
} from "@/api/caseDetail";
import VueUeditorWrap from 'vue-ueditor-wrap'
import uploadFile from '@/views/workbench/material_management/components/uploadFile'
import { createTemplate, queryTaskList, addTask, addTaskGroup, modifyTaskGroup } from '@/api/templateManagement';
import {modifyProjectTask,queryTaskById,queryWorkType,assginTask,creatematerial,bindTaskFile,addProjectTaskGroup,queryProjectTask,addProjectTask,unbindTaskFile} from '@/api/caseList'
import taskPlanList from "./taskPlanList";
export default {
  props:{
    prjTgId: {},
    prjTaskId:{

    },
    lovingVue: {
    },
    width:{
      default:'80%'
    },
    title:{
      default:'新建任务'
    },
    projectData:{

    }
  },
  name: "creatTask",
  model:{
    prop: 'lovingVue',
    event: 'change'
  },
  data(){
    return {
      prjTgIdState:true,
      taskgroupList:[],
      newlovingVue: this.lovingVue,
      referralView:false,
      text:'',
      workKinds:[],
      percentage:0,
      excutorView:false,
      clickUpload:false,
      taskData:{
        remindPlanList:[]
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
      taskPlanState:false
    }
  },

  created() {
    // this.init()
    // this.queryWorkType()
  },
  methods:{
    init(){
      this.$set(this.taskData, 'prjTgId', this.prjTgId)
      this.taskData.projectId= this.projectData.projectId
      this.taskData.creator=this.$store.getters.userId
      this.taskData.executor=this.$store.getters.userId
      this.taskData.prjName=this.projectData.prjName
      this.taskData.createDate=this.$commonUtils.formatDate(new Date())
      this.queryProjectTask()
      // if(this.$route.query.prjTaskId){
      //   this.queryTaskById(this.$route.query.prjTaskId)
      // }else {
      //   this.isComponent=true
      //   this.queryTaskById(this.prjTaskId)
      // }
    },
    unbindTaskFile({materialId}){
      this.$confirm(`该操作将会删除该附件,确定要继续吗`,'提示').then(res=>{
        unbindTaskFile({prjTaskId:this.taskData.prjTaskId,materialId}).then(res=>{
          this.taskData.fileList=this.taskData.fileList.filter(item=>item.materialId!=materialId)
        })
      })
    },
    remindPlan(){
      this.taskPlanState=true
    },
    getData(data){
      this.taskData.remindPlanList=data
    },
    changeHa(v){
      if(!v){
        return;
      }
      if(!this.taskgroupList.find(i=>i.prjTgId == v||i.prjTgName == v)) {
        addProjectTaskGroup({
          projectId: this.projectData.projectId,
          prjTgName: v,
          tepId: this.projectData.tepId
        }).then((res) => {
          this.taskData.prjTgName =v
          this.taskData.prjTgId = res.data.prjTgId
          this.queryProjectTask()
        })
      }else {
        this.taskData.prjTgName=this.taskgroupList.find(item=>item.prjTgId == v).prjTgName
      }
    },
    queryProjectTask(){
      this.prjTgIdState=false
      queryProjectTask({projectId:this.projectData.projectId}).then(res=>{
        this.taskgroupList=res.data
        this.prjTgIdState=true
      })
    },
    handleCommand(command){
      if(command=='转案'){
        this.referralView=true
      }
    },
    takeAssign(){
      this.excutorView=true

    },
    changeCheckItem(e){
      this.taskData.itemList=  e.split(/\r\n|\n/).filter(i=>!!i).map((item,index)=>({prjIemName:index+1+'.'+item.replace(/^\d[.]/,'')}))
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
    expireTimeOption(taskData){
      let that=this
      return {
        disabledDate(date) {
          return that.CompareDate(that.$commonUtils.formatDate(date),taskData)
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
        projectId:this.projectData.projectId,
        materialIdList,
        materialTypeId: 300046,
        docTypeName:'内部往来',
        doctId: 6,
        eventName: '项目文档',
        typeName: '项目文档', }).then(res=>{

      })
      // bindTaskFile({prjTaskId, projectId:this.taskData.projectId,materialIdList}).then( async res=>{
      //   // await this.modifyProjectTask()
      //   // this.init()
      // })
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
        this.taskData.materialIdList= this.taskData.fileList.map(item=>item.materialId)

        this.$message.success(res.message)
      }).catch(()=>{
        this.percentage = 0
      })
    },
    queryTaskById(prjTaskId){
      this.prjTaskId=Number(prjTaskId)
      queryTaskById({prjTaskId}).then(res=>{
        this.taskData=res.data
      })
    },

    validationRules(){
      if(!this.taskData.prjTaskName){
        this.$message.error('请填写任务名称')
        return false
      }
      return true
    },
    async confirm(){
      if(!this.validationRules()){
        return
      }
      // if (this.taskgroupList.length && !this.taskData.prjTgId) {
      //   this.$message.error('请选择或填写阶段')
      //   return
      // }
      await  this.addProjectTask()
      this.$emit('refesh',true)
      this.cancel()
    },
    addProjectTask(){
      return  addProjectTask(this.taskData)
    },

    cancel(){
      this.newlovingVue = false

    }
  },
  watch:{
    newlovingVue: function(newVal,oldVal){
      if(newVal){
        this.taskData={}
        this.init()
      }

      this.$emit('change',newVal)
    },
    lovingVue(n) {
      this.newlovingVue = n
    },
  },
  components:{
    uploadFile,VueUeditorWrap,
    taskPlanList,localExector
  }
}
</script>

<style lang="scss" scoped>
  .taskDetail{
    position: relative;
    display: flex;
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

</style>
