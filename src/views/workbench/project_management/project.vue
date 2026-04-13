<template>
  <div style="position: relative">
    <el-select v-model="projectId" :clearable="true" default-first-option filterable placeholder="请选择" @change="changeProjectId">
      <el-option  v-for="(item,key) in projectList"   :key="item.projectId" :label="item.prjName" :value="item.projectId"/>
    </el-select>
    <el-button v-if="projectData.projectId" size="mini" type="primary"  @click="addNewTask">新建任务</el-button>
    <el-button size="mini" type="primary" @click="referralView=true" v-if="projectData.canCreateCase==1">转案</el-button>
     <ViewsSwitching class="ViewsSwitching" @changePattern="changePattern"></ViewsSwitching>
    <el-tooltip  content="提取项目中的模板数据" placement="right" effect="light" v-if="projectData.projectId">
      <el-button  type="primary" style="" size="mini" @click.native="copyTeptClick">复制模板</el-button>
    </el-tooltip>
    <el-button v-if="projectData.toCaseId" type="text" @click="takeCaseDetail(projectData)">跳转案件</el-button>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="概览" name="1">
        <el-form label-position="left" label-width="120px">
          <el-form-item label="项目名称:">
            {{projectData.prjName}}
          </el-form-item>
          <el-form-item label="项目简介:">
            {{projectData.prjDesc}}
          </el-form-item>
          <el-form-item label="创建人:">
            {{projectData.createUserName}}
          </el-form-item>
          <el-form-item label="创建时间:">
            {{projectData.createTime}}
          </el-form-item>
          <el-form-item label="项目状态:">
            {{projectData.projectStatus}}
          </el-form-item>
          <el-form-item label="更新时间:">
            {{projectData.modifyTime}}
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="任务" name="2">
        <taskList ref="taskList" :projectData="projectData" @fetchDetail="queryProjectList" @selectRow="selectRow"></taskList>
      </el-tab-pane>
      <el-tab-pane label="费用" name="3">
        <projectBill :projectId="projectId"></projectBill>
      </el-tab-pane>
      <el-tab-pane label="工时" name="4">
        <projectTime v-if="activeName == 4" :projectId="projectId"></projectTime>
<!--        <project-work-hour v-if="activeName == 4" :projectId="projectId" />-->
<!--        <projectBill :projectId="projectId"></projectBill>-->
      </el-tab-pane>
    </el-tabs>
    <referralCase v-model="referralView" :projectId="projectId"></referralCase>
    <!--    复制模板-->
    <copy-template @closeCopyView="closeCopyView" :copy-tept-view="copyTeptView" :c-prj-name="prjName" :c-project-id="projectId"></copy-template>

    <creatTask v-model="creatTaskView" :prjTgId="prjTgId" :projectData="projectData" @refesh="changeProjectId(projectId)"></creatTask>
  </div>
</template>

<script>
  import copyTemplate from "../system_management/templateManagement/components/copyTemplate";
  import creatTask from "./components/creatTask";
  import ViewsSwitching from '@/views/workbench/case/components/ViewsSwitching.vue'
  import referralCase from "./components/referralCase"
  import projectBill from './components/projectBill'
  import taskList from "./components/taskList";
  import {queryProjectDetail , queryProjectList , createProject,queryProjectFeeInfo} from '@/api/caseList'
  import ProjectWorkHour from '@/views/workbench/project_management/components/projectWorkHour.vue'
  import projectTime from '@/views/workbench/project_management/components/projectTime.vue'
export default {
  name: "project",
  data(){
    return {
      prjTgId: '',
      projectId:'',
      prjName:'',
      activeName:'2',
      projectList:[],
      projectData:{},
      referralView:false,
      creatTaskView:false,
      copyTeptView:false
    }
  },
  created() {
    this.queryProjectList()
  },
  methods:{
    addNewTask() {
      this.creatTaskView = true
      // this.projectData = this.getR
    },
    selectRow(data) {
      if (data) {
        this.prjTgId = data.prjTgId
      }
    },
    handleClick(){

    },
    copyTeptClick(){
      this.copyTeptView = true
    },
    closeCopyView(){
      this.copyTeptView = false
    },
    queryProjectList(){
      queryProjectList({pageSize:10000}).then(res=>{
        this.projectList=res.data
        this.projectList.push({projectId:0,prjName:'查看全部项目'})
        if(this.$route.query.projectId){
          this.changeProjectId(this.$route.query.projectId)
        }else if(this.$route.query.prjAgentNum) {
          let prjData=this.projectList.find(item=>item.prjAgentNum==this.$route.query.prjAgentNum)
          if(prjData){
            this.changeProjectId(prjData.projectId)
          }
        }else {
          if(this.projectList&&this.projectList.length){
            if(this.projectList.length==1){
              return
            }
            if(localStorage.getItem('projectId')){
              if(this.projectList.find(item=>item.projectId==localStorage.getItem('projectId'))){
                this.changeProjectId(localStorage.getItem('projectId'))
              }else {
                this.changeProjectId(this.projectList[0].projectId)
              }
            }else {
              this.changeProjectId(this.projectList[0].projectId)
            }
          }

        }
      })
    },
    takeCaseDetail(data){
      this.$router.push(`/workbench/case/case_detail/${data.toCaseId}/商标侵权?taskType=${this.$commonUtils.getTaskType(data,this)}`)
      // this.$router.push("/workbench/case/seeCaseDetail/" + params.data.toCaseId);
    },

    changeProjectId(projectId){
      this.prjTgId = ''
      if(projectId){
        this.projectId=Number(projectId)
        queryProjectDetail({projectId}).then(res=>{
          this.projectData=res.data
          this.prjName = res.data.prjName
          localStorage.setItem('projectId',projectId)
        })

      }
      if(projectId===0){
        this.$router.push(`/workbench/ResourceView/allProject`)
      }else{
        if(this.$route.query.projectId!==projectId){
          this.$router.replace({
            path: '/workbench/ResourceView/project',
            query: {
              projectId: projectId
            }
          });
        }
      }
    },
    changePattern(e){
      if(e===1){
        this.$store.commit('user/SET_PATTERN',false)
      } else {
        this.$store.commit('user/SET_PATTERN',true)
        this.$refs.taskList.selectDefaultNode()
      }
    },
  },
  components:{
    projectTime,
    ProjectWorkHour,
    taskList,projectBill,referralCase,ViewsSwitching,creatTask,copyTemplate
  }
}
</script>

<style lang="scss" scoped>
  .ViewsSwitching{
    position: absolute !important;
    right: 0;
    z-index: 100;
    top: 5px;
  }

</style>
