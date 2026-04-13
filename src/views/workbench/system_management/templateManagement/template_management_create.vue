<template>
  <div class="template-create">
    <div class="template-create-generous-view" style="margin-top: 20px">
      <el-row>
        <el-col :span="22">
          <el-tabs>
            <el-tab-pane label="概览"></el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
      <div style="width: 50%;margin: 0 auto">
<!--        新建模板-->
        <el-form ref="form" :model="templateForm" label-width="80px">
          <el-row v-if="type==2">
             <el-col>
               <el-form-item label="创建方式:">
                 <el-radio-group v-model="copyTemplate">
                   <el-radio :label="1">新建模板</el-radio>
                   <el-radio :label="2">提取项目数据</el-radio>
                 </el-radio-group>
               </el-form-item>

             </el-col>
           </el-row>
          <el-row>
            <el-col>
              <el-form-item label="模板类型:">
                <span v-if="type == 1">万慧达模板</span>
                <span v-if="type == 2">内部共享模板</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row v-if="copyTemplate != 2">
            <el-col>
              <el-form-item label="模板名称:">
                <el-input style="width: 200px;" v-model="templateForm.teptName" placeholder="请输入模板名称" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="copyTemplate != 2">
            <el-col>
              <el-form-item label="案件类型:">
  <!--              <el-select v-model="templateForm.caseTypeId" placeholder="请选择案件类型">-->
  <!--                <el-option-->
  <!--                  v-for="item in caseTypeList"-->
  <!--                  :key="item.caseTypeId"-->
  <!--                  :label="item.caseType"-->
  <!--                  :value="item.caseTypeId">-->
  <!--                </el-option>-->
  <!--              </el-select>-->
  <!--              <el-cascader-->
  <!--                v-model="caseTypeIdList"-->
  <!--                filterable-->
  <!--                :show-all-levels="false"-->
  <!--                :options="caseTypeOptions"-->
  <!--                :props="defaultParams"-->
  <!--                placeholder="请选择"-->
  <!--                clearable-->
  <!--                @change="changeCaseType"-->
  <!--              >-->
  <!--              </el-cascader>-->
                <el-multi-cascader
                  v-model="caseTypeIdList"
                  :options="caseTypeOptions"
                  filterable
                  clearable
                  :props="defaultParams"
                  change-on-select
                  @change="changeCaseType"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="copyTemplate != 2">
            <el-col>
              <el-form-item label="审级:">
                <el-select clearable v-model="templateForm.judgeRank" placeholder="请选择审级">
                  <el-option
                    v-for="item in judgeRankList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="copyTemplate != 2" style="display: flex;justify-content: center;align-items: center">
            <el-col :span="18">
              <el-button ref="createBtn" type="primary" style="" size="small" @click="nextCreateTemplate">创建模板</el-button>
              <el-button type="primary" size="small" @click="$router.go(-1)">返回</el-button>
<!--              <el-tooltip  content="提取已有项目中的模板数据" placement="right" effect="light">-->
<!--                <el-button v-if="type == 2" ref="" type="primary" style="" size="small" @click.native="copyTeptClick">复制模板</el-button>-->
<!--              </el-tooltip>-->
            </el-col>
          </el-row>
          <!--        复制模板-->
        <div v-if="copyTemplate == 2">
          <copy-template @closeCopyView="closeCopyView" :copy-tept-view="false" :no-dialog="true"></copy-template>
        </div>
      </el-form>

      </div>

    </div>
<!--    <div class="template-create-task-group" v-if="taskGroupView" style="margin-top: 60px">-->
<!--    <div class="template-create-task-group"  style="margin-top: 60px">-->
<!--      <el-row v-if="copyTemplate!=2">-->
<!--        <el-col :span="22" style="margin-bottom: 33px">-->
<!--          <el-tabs>-->
<!--            <el-tab-pane label="任务"></el-tab-pane>-->
<!--          </el-tabs>-->
<!--        </el-col>-->
<!--        <el-col :span="2">-->
<!--&lt;!&ndash;          <el-button type="primary" @click="createGroupsView = true" style="width: 139px;"><i class="el-icon-plus"></i>新建阶段</el-button>&ndash;&gt;-->
<!--          <el-dropdown @command="handleCommand" style="float: right">-->
<!--              <el-button type="primary" size="small">-->
<!--                新建<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
<!--              </el-button>-->
<!--              <el-dropdown-menu slot="dropdown">-->
<!--                <el-dropdown-item command="createGroupView">阶段</el-dropdown-item>-->
<!--                <el-dropdown-item command="createTaskView">任务</el-dropdown-item>-->
<!--              </el-dropdown-menu>-->
<!--            </el-dropdown>-->
<!--        </el-col>-->
<!--      </el-row>-->
<!--      &lt;!&ndash;  阶段列表    &ndash;&gt;-->
<!--      <div class="group-list" v-if="groupList.length>0">-->
<!--        <div class="template-collapse">-->
<!--            <el-collapse v-model="activeNames" accordion>-->
<!--              <el-collapse-item class="template-collapse-item" :name="index" v-for="(item, index) in groupList">-->
<!--                <span slot="title" class="collapse-title">-->
<!--&lt;!&ndash;                  <el-input ref="groups" :value="`${item.tgNo}.${item.tgName}`" readonly></el-input>&ndash;&gt;-->
<!--                  <span>{{item.tgNo}}.{{item.tgName}}</span>-->
<!--&lt;!&ndash;                  <el-tooltip effect="light" content="删除阶段" placement="left"><i class="el-icon-delete" @click="delGroup(item)"></i></el-tooltip>&ndash;&gt;-->

<!--                </span>-->
<!--                <div class="template-check-box">-->
<!--&lt;!&ndash;                  <el-checkbox-group v-model="taskQueryList" :max="1">&ndash;&gt;-->
<!--&lt;!&ndash;                    <el-checkbox v-for="(task, id) in item.taskDefineList" :key="id" :label="task.taskName" style="display: block;margin: 10px 20px"></el-checkbox>&ndash;&gt;-->
<!--&lt;!&ndash;                  </el-checkbox-group>&ndash;&gt;-->
<!--                  <span v-for="(task, id) in item.taskDefineList" style="display: block;margin: 10px 40px">{{task.taskName}}</span>-->
<!--                  <el-tooltip effect="light" content="新建任务" placement="right"><i class="el-icon-circle-plus-outline" @click="taskViewData(item)"></i></el-tooltip>-->
<!--&lt;!&ndash;                  <el-tooltip effect="light" content="删除任务" placement="right"><i class="el-icon-remove-outline" @click="delTask(item, taskQueryList)"></i></el-tooltip>&ndash;&gt;-->
<!--                </div>-->
<!--              </el-collapse-item>-->
<!--            </el-collapse>-->
<!--          </div>-->
<!--      </div>-->
<!--&lt;!&ndash;       新建阶段&ndash;&gt;-->
<!--      <el-dialog title="新建阶段" :visible.sync="createGroupsView" width="20%">-->
<!--        <el-form :model="createGroups" label-width="90px">-->
<!--          <el-form-item label="阶段名称:">-->
<!--            <el-input v-model="createGroups.tgName" autocomplete="off"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="阶段序号:">-->
<!--            <el-input v-model="createGroups.tgNo" autocomplete="off"></el-input>-->
<!--          </el-form-item>-->
<!--        </el-form>-->
<!--        <div slot="footer" class="dialog-footer f-c">-->
<!--          <el-button @click="createGroupsView = false">取 消</el-button>-->
<!--          <el-button type="primary" @click="createNewGroup">确 定</el-button>-->
<!--        </div>-->
<!--      </el-dialog>-->
<!--      &lt;!&ndash;   新建任务弹窗   &ndash;&gt;-->
<!--      <el-dialog title="新建任务" :visible.sync="taskView" width="20%">-->
<!--        <el-form :model="taskInfo" label-width="90px">-->
<!--          <el-form-item label="任务名称:">-->
<!--            <el-input v-model="taskInfo.taskName" autocomplete="off"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="任务描述:">-->
<!--            <el-input type="textarea" v-model="taskInfo.taskDesc" autocomplete="off"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="阶段:" v-if="outCreate">-->
<!--            <el-select v-if="groupList.length>0" v-model="taskInfo.tgId" placeholder="请选择">-->
<!--              <el-option-->
<!--                v-for="item in groupList"-->
<!--                :key="item.tgId"-->
<!--                :label="item.tgName"-->
<!--                :value="item.tgId">-->
<!--              </el-option>-->
<!--            </el-select>-->
<!--            <span v-else>还没有阶段，<i style="color: #409EFF;cursor: pointer;" @click="handleCommand('createGroupView', 1)">新建一个</i></span>-->
<!--&lt;!&ndash;            <el-input v-model="taskInfo.taskDesc" autocomplete="off"></el-input>&ndash;&gt;-->
<!--          </el-form-item>-->
<!--        </el-form>-->
<!--        <div slot="footer" class="dialog-footer f-c">-->
<!--          <el-button @click="taskView = false">取 消</el-button>-->
<!--          <el-button type="primary" @click="addTask(taskInfo)">确 定</el-button>-->
<!--        </div>-->
<!--      </el-dialog>-->
<!--    </div>-->
    <el-row>
      <el-col :span="16" class="f-c">
<!--        <el-button type="primary" size="small" @click="$router.go(-1)">返回</el-button>-->
      </el-col>
    </el-row>

<!--    复制模板-->
<!--    <copy-template @closeCopyView="closeCopyView" :copy-tept-view="copyTeptView"></copy-template>-->
  </div>
</template>

<script>
  import copyTemplate from "./components/copyTemplate";
  import { queryCaseType } from '@/api/caseList';
  import { createTemplate, queryTaskList, addTask, addTaskGroup, modifyTaskGroup } from '@/api/templateManagement';
  import Bus from '@/utils/Bus'
  export default {
    name: "template_management_create",
    components:{
      copyTemplate
    },
    data() {
      return {
        copyTemplate:1,
        copyTeptView: false,
        templateForm: {
          teptName: '',
          caseTypeId: '',
          judgeRank: ''

        },
        judgeRankList: [
          {name:'一审', value:1071},
          {name:'二审', value:1072},
          {name:'再审', value:1073},
          {name:'重审', value:1074},
          {name:'执行', value:1075},
          {name:'无', value:1368}
        ],
        templateValue: '',
        caseTypeList: [],
        groupView: false,
        taskGroupView: false,
        isLoading: false,
        isDisabled: false,
        createGroupsView: false,
        createGroups: {
          tgName: '',
          tgNo: '',
          taskDefineList: []
        },
        teptId: 0,
        groupList:[],
        activeNames: [],
        taskQueryList: [],
        taskInfo: {
          taskName: '',
          taskDesc: '',
          tgId: ''
        },
        taskView: false,
        outCreate:false,
        firstGroup: false,
        caseTypeOptions:[],
        defaultParams: { // 級聯菜單默認
          checkStrictly: true,
          value: 'caseTypeId',
          label: 'caseType',
          children: 'childrens',

        },
        caseTypeIdList: [],
        type: ''
      }
    },
    created() {
      this.queryCaseType()
      this.type=this.$route.params.id
    },
    methods: {
      closeCopyView(){
        this.copyTeptView = false
        this.$router.go(-1)
      },
      copyTeptClick(){
        this.copyTeptView = true
      },
      changeCaseType(v){
        if(v&&v.length>0){
          this.templateForm.caseTypeId = v[v.length - 1]
        }
      },
      queryCaseType() {
        queryCaseType().then(res => {
          this.caseTypeOptions = res.data
          this.caseTypeOptions.splice(2,1)
        })
      },
      handleCommand(f,n) {
        if(!this.isDisabled){
          this.$message.warning('请先创建模板')
          return
        }
        if(n==1){
          this.firstGroup = true
        }
        if(f=='createGroupView') {
          this.createGroupsView = true
        }else{
          this.outCreate = true
          this.taskView = true
        }
      },
      // 添加阶段，排序
      compare(property,desc) {
        return function (a, b) {
          let value1 = a[property];
          let value2 = b[property];
          if(desc==true){
            // 升序排列
            return value1 - value2;
          }else{
            // 降序排列
            return value2 - value1;
          }
        }
      },
      queryTaskList(teptId) {
        queryTaskList({teptId: teptId}).then((res)=>{
          this.groupList = res.data
          if(this.firstGroup&&this.groupList.length==1){
              this.taskInfo.tgId = res.data[0].tgId
            }
          this.groupList = this.groupList.filter(item=>!!item)
          this.groupList.sort(this.compare("tgNo",true))
        })
      },
      // queryCaseType() {
      //   this.caseTypeList = this.$store.getters.caseTypeList
      //   let arr = this.caseTypeList
      //     arr[2] = []
      //   this.caseTypeList = arr.filter(i=>i.caseType)
      //   let typeList = []
      //   let recursiveFunction = (a)=>{
      //       const getObj = (arr)=>{
      //         arr.forEach(function(row){
      //         if(row.childrens){
      //           // console.log('++++++++rowchild+++++++')
      //           // console.log(row)
      //           // typeList.push({'caseType': row.caseType,'caseTypeId': row.caseTypeId})
      //           getObj(row.childrens)
      //         }else {
      //           // console.log('++++++roe')
      //           // console.log(row)
      //           typeList.push({'caseType': row.caseType,'caseTypeId': row.caseTypeId})
      //         }
      //       })
      //       }
      //       getObj(a)
      //     return typeList
      //   //     console.log('+++++3333333++++++++++')
      //   // console.log(recursiveFunction(typeList))
      //   // console.log('+++++++++++++++')
      //   }
      //   console.log('+++++222222++++++++++')
      //   // const list = JSON.parse(JSON.stringify(this.caseTypeList[1].childrens))
      //   this.caseTypeList = recursiveFunction(arr)
      //   // console.log(recursiveFunction(arr))
      //   console.log('+++++++++++++++')
      // },
      nextCreateTemplate() {
        this.isLoading = true
        if(!this.templateForm.teptName){
          this.$message.error('请填写模板名称！')
          this.isLoading = false
          return
        }
        if(!this.templateForm.caseTypeId){
          this.$message.error('请选择案件类型！')
          this.isLoading = false
          return;
        }
        createTemplate({...this.templateForm,tempType: this.type}).then((res)=>{
          this.teptId = res.data.teptId
          this.$message.success('创建成功！')
          Bus.$emit('updateTemplate')
          this.queryTaskList(this.teptId)
          this.$router.go(-1)
          this.isLoading = false
          this.isDisabled = true
        }).catch(()=>{
          this.isLoading = false
        })

      },
      createNewGroup() {

        this.createGroups.teptId = +this.teptId
        if(this.groupList.find(item=>item.tgNo == this.createGroups.tgNo)){
          this.createGroups.tgId = this.groupList.find(item=>item.tgNo == this.createGroups.tgNo).tgId
          this.$confirm('此阶段已经存在，是否覆盖?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            this.editGroup(this.createGroups).then(()=>{
              this.createGroupsView = false
              this.$message.success('新建成功！')
              this.queryTaskList(this.teptId)
            })
          })
        }else {
          addTaskGroup(this.createGroups).then(()=>{
            this.createGroupsView = false
            this.$message.success('新建成功！')
            this.queryTaskList(this.teptId)
          })
        }


      },
      editGroup(data) {
        data.teptId = this.teptId
        modifyTaskGroup(data).then(()=>{
          this.$message.success('修改成功！')
          this.groupsEdit = false
        })
      },
      addTask(taskInfo) {
        this.taskInfo = taskInfo
        this.taskInfo.teptId = this.teptId
        addTask(this.taskInfo).then(()=>{
          this.taskView = false
          this.$message.success('新建成功！')
          this.queryTaskList(this.teptId)
        })
      },
      taskViewData(item) {
        if(item){
          this.outCreate = false
        }
        this.taskView = true
        this.taskInfo.tgId = item.tgId
      },
    }
  }
</script>

<style lang="scss" scoped>
  .template-collapse {
    .template-collapse-item{
      position: relative;
      .template-check-box {
        .el-icon-circle-plus-outline {
          font-size: 20px;
          margin-top: 20px;
          margin-left: 37px;
          &:hover {
            color: #409EFF;
          }
        }
        .el-icon-remove-outline {
          font-size: 20px;
          margin-left: 50px;
          &:hover {
            color: red;
          }
        }
      }
      .collapse-title {
        flex: 1 0 90%;
        order: 1;
        .el-icon-delete {
          position: absolute;
          left: 50%;
          top: 20px;
          font-size: 16px;
          transform: translateX(-200px) translateY(-6px);
          /*transition: all .3s;*/
          &:hover {
            color: red;
          }
        }
        >>> .el-input__inner {
          cursor: pointer;
          border: 0;
        }
        .active {
          border: 1px solid #dcdfe6;
        }
      }
      .el-collapse-item__header {
        flex: 1 0 auto;
        order: -1;
      }
    }

  }
  .f-c{
    display: flex;
    justify-content: center;
  }
</style>
