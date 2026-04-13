<template>
    <div>
      <div class="task-group" style="margin-top:5px;min-height: 730px" >
          <el-card class="box-card" shadow="always" style="margin: 10px;margin-bottom: 0; min-height: 730px;">
            <div slot="header" class="clearfix" style="">
              <div style="display: inline-block;margin-left: 20px; height: 40px;line-height: 40px; color: #409EFF">任务组</div>
              <div style="float: right;margin-right: 20px; display: inline-block;height: 40px;line-height: 40px; color: #409EFF">
                <el-button v-if="!noCreate" @click.native="handleCommand" size="mini" type="primary">新建</el-button>
                <el-button  @click.native="state=!state" size="mini" type="primary">切换视图</el-button>
                <el-button  @click.native="deriveList" size="mini" type="primary">导出</el-button>

              </div>
            </div>
            <el-collapse ref="collapse" v-show="state" v-model="activeNames">
            <el-collapse-item class="template-collapse-item" :name="index" v-for="(item, index) in taskgroupList" :key="index">
              <span  slot="title" class="collapse-title">
                <span>{{index+1}}.{{item.prjTgName}}</span>
              </span>
  <!--            子任务表格-->

              <div class="table" style="width: 96%;margin: 0px 30px">
                <el-table
                  :data="Array.isArray(agList[index])?agList[index]:[]"
                  border
                  @row-dblclick="rowDbClick"
                  style="width: 100%">
                  <el-table-column
                    type="index"
                    width="50"
                  >
                  </el-table-column>
                  <el-table-column
                    label="任务名称"
                    >
                    <template slot-scope="scope">
                        <span class="overflow-hidden">{{scope.row.prjTaskName}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="任务描述"
                    >
                    <template slot-scope="scope">
                    <span v-if="scope.row.prjTaskDesc">
                      <span class="" v-for="(it, index) in scope.row.prjTaskDesc.split('\n')" :key="index">
                        <p>{{it}}</p>
                      </span>
                    </span>

                  </template>
<!--                    <template slot-scope="scope" @dblclick="selected = scope.row.prjTaskDesc">-->
<!--                      <span class="overflow-hidden">{{scope.row.prjTaskDesc}}</span>-->
<!--                    </template>-->
                  </el-table-column>
<!--                  <el-table-column-->
<!--                    label="文件"-->
<!--                    width="200"-->
<!--                  >-->
<!--                    <template slot-scope="scope">-->
<!--                      <div class="file-list">-->
<!--                        <div v-for="(file,index) in scope.row.fileList">-->
<!--                          <p style="width: 100%;display: flex;justify-content: left;align-items: center">-->
<!--                            <span class="file-name">{{file.materialName}}</span> <span class="el-icon-view" @click="preView(file)"></span>-->
<!--                          </p>-->
<!--                        </div>-->
<!--                      </div>-->

<!--                    </template>-->
<!--                  </el-table-column>-->
                  <el-table-column
                    label="任务检查项"
                    >
                    <template slot-scope="scope">
                      <span v-if="scope.row.itemList&&scope.row.itemList.length==0"></span>
                      <span v-else class="" v-for="(it, index) in scope.row.itemList" :key="index">
                        <p>
                          <span>{{index+1}}.</span><span>{{it.prjIemName}}</span>
                        </p>
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="endDate"
                    label="任务截止日期"
                    width="100px"
                  >
                    <template slot-scope="scope">
                      {{scope.row.endDate}}
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="任务创建人"
                    width="80">
                    <template slot-scope="scope">
                      <span>{{scope.row.creatorName  }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="任务分配人"
                    width="80">
                    <template slot-scope="scope">
                      <span>{{scope.row.assigneeName?scope.row.assigneeName:'无'  }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="当前任务执行人"
                    width="80">
                    <template slot-scope="scope">
                      <div>{{scope.row.executorName }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="全部任务执行人"
                    width="150">
                    <template slot-scope="scope">
                      <div v-if="scope.row.executorNames&&!scope.row.executorNames.includes(',')">{{scope.row.executorNames}}</div>
                      <div v-if="scope.row.executorNames&&scope.row.executorNames.includes(',')">
                        <div v-for="(item, index) in scope.row.executorNames.split(',')">{{item}}</div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="任务状态"
                    width="80">
                    <template slot-scope="scope" @dblclick="selected = scope.$index">
  <!--                    {{scope.row.taskStatus}}-->
                      <span>{{scope.row.taskStatus}}</span>
  <!--                    <el-input v-model="scope.row.taskStatus" :placeholder="scope.row.taskStatus"></el-input>-->
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-collapse-item>
          </el-collapse>
            <TaskGantt v-if="taskLists.length" v-show="!state" :taskList="taskLists"></TaskGantt>
          </el-card>

      </div>

      <!--    任务查看弹框-->
      <el-dialog
        title="任务查看"
        center
        top="0"
        height="500"
        :visible.sync="taskLook"
        width="70%"
        append-to-body
        :modal="false"
        v-dialogDrag
        :close-on-click-modal="false"
        >
        <el-form class="new-task-dialog" label-width="120px">
          <el-row>
            <el-col :span="12">
              <el-form-item  label="任务名称:">
                {{edtiTasksData.prjTaskName}}
              </el-form-item>
            </el-col>
            <el-col :span="12">

            </el-col>

          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="任务描述:">
                <div style="max-height: 120px;overflow-y: auto;">
                  <p v-if="!edtiTasksData.prjTaskDesc"></p>
                  <p v-else v-for="(j,index) in edtiTasksData.prjTaskDesc.split('\n')">{{j}}</p>
                </div>

              </el-form-item>
<!--              <el-form-item label="文件:">-->
<!--                <div style="display: flex;justify-content: left">-->
<!--                  <div class="left-fileList" style="flex: 4">-->
<!--                    <div style="max-height: 120px;overflow-y: auto;">-->
<!--                      <div v-for="(item, index) in edtiTasksData.fileList" :key="index">-->
<!--                        <div-->
<!--                          :class="{'filehover': fileHover == index}"-->
<!--                          @mouseover="fileHover = index" @mouseout="fileHover = 10000"-->
<!--                          style="display: flex;justify-content: space-between;align-items: center"-->
<!--                        >-->
<!--                          <span style="color: #409EFF;display: flex;justify-content: left;align-items: center"><span class="file-name1">{{item.materialName}}</span><i class="el-icon-view" @click="preView(item)"></i></span>-->
<!--                          <div class="do-some">-->
<!--                          </div>-->
<!--                        </div>-->

<!--                      </div>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </div>-->

<!--              </el-form-item>-->
            </el-col>
            <el-col :span="12">
              <el-form-item label="任务检查项:">
                <div style="max-height: 120px;overflow-y: auto;">
                  <p v-if="!edtiTasksData.itemList"></p>
                  <p v-else v-for="(i,index) in (edtiTasksData.itemList+'').split('\n')">{{i}}</p>
                </div>

              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="截止日期:">
                {{edtiTasksData.endDate}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="任务创建人:">
                {{edtiTasksData.creatorName}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="当前任务执行人:">
                {{edtiTasksData.executorName}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="全部任务执行人:">
                {{edtiTasksData.executorNames}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="bott">
              <el-form-item label="任务分配人:">
                {{edtiTasksData.assigneeName?edtiTasksData.assigneeName:'无'  }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="任务状态:" class="bott">
                {{edtiTasksData.taskStatus}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer" style="display: flex;justify-content: center">
          <el-button @click="taskLook = false">取 消</el-button>
        </span>
      </el-dialog>
      <!--      新建任务弹框-->
      <div class="">
        <create-new-task
          v-if="caseId"
          :t-name="teptName"
          :t-tept-id="teptId"
          :tep-group-list="templateGroupTask"
          :group-list="taskgroupList"
          @closeView="closeView"
          :case-id="caseId"
          :task-view="createTaskView"
          :case-type-id="caseTypeId"
          :judge-rank="judgeRank"
          :hasTemplate="hasTemplate"
        ></create-new-task>

      </div>
    </div>
</template>

<script>
  import TaskGantt from "./TaskGantt";
  import CreateNewTask from "../CreateNewTask";
  import { doEditInOffice, getProgID } from '@/utils/editInOffice.js'
  import {
    addProjectTaskGroup,
    queryProjectTask,
    deriveList,
    modifyProjectTaskGroup,
    deleteProjectTaskGroup,
    addProjectTask,
    modifyProjectTask,
    deleteProjectTask,
    queryTaskUserList,
    assginTask,
    submitTask,
    auditTask,
    queryToDoTask,
    addTaskHours,
    startTaskHours,
    stopTaskHours,
    queryProjecTeptId
  } from '@/api/caseList'
  import { downLoadAll } from '@/utils'
  import { queryTemplateList, queryTaskList, queryTemplateFileList } from '@/api/templateManagement'
  export default {
    name: "TaskDetail",
    props: {
      noCreate: false,
      caseId: {},
      caseTypeId: '',
      judgeRank: ''
    },
    computed: {

    },
    components: {
      CreateNewTask,TaskGantt
    },
    data() {
      return {
        state:true,
        teptName: '',
        templateGroupTask: [],
        fileHover:10000,
        teptId: '',
        taskLook: false,
        edtiTasksData: {
          prjTaskId: '',
          fileList: [],
          modelFileList: [],
          executor: '',
          itemList: '',
          prjTaskName: '',
          prjTaskDesc: '',
          endDate: '',
          creatorName: '',
          assigneeName: '',
          taskStatus: ''
        },
        activeNames: [],
        taskgroupList: [],
        agList: [],
        taskLists:[],
        createTaskView: false,
        hasTemplate:false
      }
    },
    created() {
      this.queryProjectTask()
      this.keyCodeForEvent()
    },
    methods: {
      keyCodeForEvent() {
        let self = this
        let code = 0
        let code2 = 0
        document.onkeydown = function(e) {
          let evn = e || event
          let key = evn.keyCode || evn.which || evn.charCode
          console.log(key)
          if (key === 17) {
            code = 1
          }
          if (key === 81) {
            code2 = 1
          }
          if (code === 1 && code2 === 1) {
            self.handleCommand()
            code = 0
            code2 = 0
          }
        }
        document.onkeyup = function (e) {
          if (e.keyCode === 81) {
            code2 = 0;
          }
          if (e.keyCode === 17) {
            code = 0;
          }
        }
      },
      deriveList(){
        deriveList({bussId:26,caseId:this.caseId}).then(res=>{
          downLoadAll({url:`${res.data}`})
        })
      },
      handleCommand(value, n) {
        // if(n==1){
        //   this.firstGroup = true
        // }
          this.createTaskView = true
        // this.teptId
      },
      closeView(v) {
        if(v != '取消'){
          this.queryProjectTask()
        }
        this.createTaskView = false
      },
      rowDbClick(data){
        this.taskLook = true
        this.edtiTasksData = JSON.parse(JSON.stringify(data))
        let arr = []
        if(this.edtiTasksData.itemList&&this.edtiTasksData.itemList.length>0){
          this.edtiTasksData.itemList.forEach((i, index)=>{
            arr.push(i.prjIemName)
          })
          this.edtiTasksData.itemList = arr.join('\n')
        }
      },
    preView(data){
        let url = data.address
        if (getProgID(url)||url.replace(/.+\./,"").toLocaleLowerCase()=='msg') {
          if(['doc','docx'].includes(url.replace(/.+\./,"").toLocaleLowerCase())){
            this.$commonUtils.viewPdf(`${url}`)
          }else {
            let flag = ''
            if(data.mailId){
              flag = 'mailId'
            }else if (data.materialId) {
              flag = 'materialId'
            }
            url = url.replace(/&/g, '%26')
            window.open(`#/preView?address=ipdoc${url}&${flag}=${data[flag]}`.replace(/[+]/g,'%2B'))
          }
        } else if(['pdf','jpg','png'].some(item=>url.replace(/.+\./,"").toLocaleLowerCase()==item)){
          window.open(`/ipdoc${url}`.replace(/[+]/g,'%2B'))
        } else {
         this.downLoad(data)
        }
      },
      downLoad(data){
        const url = data.address
        // let notify = this.$notify.success({
        //   // title: 'Info',
        //   message: '正在下载',
        //   showClose: false,
        //   duration: 0
        // });
        const downData={
          url:`ipdoc${url}`,
          success(){
            // notify.close()
          }
        }
        if(data.mailId){
          downData.downLoad=data.materialName
        }
        this.$commonUtils.downLoadAll(downData)
      },
    queryProjectTask() {
      queryProjectTask({caseId:this.caseId}).then((res)=>{
        this.taskLists=res.data
          // if(res.data.find(i=>i.teptId)){
          //   this.hasTemplate = true
          //   this.teptId = res.data.find(i=>i.teptId).teptId
          //   this.teptName = res.data.find(i=>i.teptName).teptName
          //   queryTaskList({teptId: this.teptId,caseId: this.caseId}).then(res=>{
          //     this.templateGroupTask = res.data.filter(item=>!!item)
          //     this.templateGroupTask = (this.templateGroupTask).map(item=>({
          //     value: item.tgId,
          //     label: item.tgName,
          //     children: (item.taskDefineList).map(i=>({
          //       value: i.taskDefineId,
          //       label: i.taskName,
          //       taskDesc: i.taskDesc,
          //       itemList: i.itemList,
          //       taskFileList: i.taskFileList
          //     }))
          //   }))
          //   })
          // }
        queryProjecTeptId({caseId:this.caseId}).then((res)=> {
          if (res.data.teptId) {
            this.teptId = res.data.teptId
            this.teptName = res.data.teptName
            queryTaskList({teptId: this.teptId, caseId: this.groupForm.caseId}).then(res => {
              this.templateGroupTask = res.data.filter(item => !!item)
              this.templateGroupTask = (this.templateGroupTask).map(item => ({
                value: item.tgId,
                label: item.tgName,
                children: (item.taskDefineList).map(i => ({
                  value: i.taskDefineId,
                  label: i.taskName,
                  taskDesc: i.taskDesc,
                  itemList: i.itemList,
                  taskFileList: i.taskFileList
                }))
              }))
              this.taskTemplateView = false
            })
          } else {
            if (this.caseTypeId) {
              queryTemplateList({caseTypeId: this.caseTypeId}).then((res) => {
                if (res.data.find(item => item.judgeRank == this.judgeRank)) {
                  this.teptId = res.data.find(item => item.judgeRank == this.judgeRank).teptId
                  this.teptName = res.data.find(item => item.judgeRank == this.judgeRank).teptName
                  queryTaskList({teptId: this.teptId, caseId: this.caseId}).then(res => {
                    this.templateGroupTask = res.data.filter(item => !!item)
                    this.templateGroupTask = (this.templateGroupTask).map(item => ({
                      value: item.tgId,
                      label: item.tgName,
                      children: (item.taskDefineList).map(i => ({
                        value: i.taskDefineId,
                        label: i.taskName,
                        taskDesc: i.taskDesc,
                        itemList: i.itemList,
                        taskFileList: i.taskFileList
                      }))
                    }))
                  })
                }
                // console.log('++++++ooooo+++++++++')
                // console.log(res.data)
                // console.log('+++++++++++++++')
              })
            }
          }
        }).catch(()=>{

        })
          this.taskgroupList = res.data
          this.taskgroupList.forEach((i,index)=>{
            this.activeNames.push(index)
          })
          this.agList = this.taskgroupList.map(i=>{
            if(i.teptId){
              if(i.taskList){
                //   i.taskList.forEach(j=>{
                //   j.teptId = i.teptId
                // })
                 return  i.taskList
              }else{
                return i
              }
            }
            else{
              if(i.taskList){
                // i.taskList.forEach(j=>{
                //   j.teptId = i.teptId
                // })
                return  i.taskList
              }else{
                return i
              }
            }

          })
        })


      },
    }
  }
</script>

<style lang="scss" scoped>
  .table {
    >>>.el-table{
      height: auto;
      .cell {
        max-height: 70px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        .file-list {
          /*width: 100%;*/
          /*max-height: 70px;*/
          /*display: -webkit-box;*/
          /*-webkit-box-orient: vertical;*/
          /*-webkit-line-clamp: 3;*/
          /*overflow: hidden;*/
        }
      }
    }
  }
  .el-form {
    .el-row{
      &:last-child{
        border-bottom: 1px solid #ccc;
      }
    }
  }
  .new-task-dialog,.edit-task-dialog {
    .el-row {
      display: flex;

      .el-col {
        /*height: 100%;*/
        display: flex;
        border: 1px solid #ccc;
        border-bottom: none;

        .el-form-item {
          flex: 1;
          margin-bottom: 0;
          /*max-height: 120px;*/
          overflow-y: auto;
          display: flex;
          justify-content: left;

          > > > .el-form-item__label {
            background-color: #f1f1f1;
          }

          > > > .el-form-item__content {
            margin-left: 0 !important;
            width: 75%;
          }
        }
      }
    }
  }
  .filehover {
    background-color: #f7f7f7;
  }
  .file-name{
    color: #409EFF;
    width: 140px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    cursor: pointer;
  }
  .el-icon-view {
      color: #409EFF;
      cursor: pointer;
  }
  >>>.el-card__header{
    padding: 0;
  }
</style>
