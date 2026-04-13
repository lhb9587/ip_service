<template>
    <div class="">
      <el-dialog
          title="新建任务"
          append-to-body
          :modal="false"
          class="out-dialog"
          top="0"
          :visible.sync="createTaskView"
          width="80%"
          :close-on-click-modal="false"
          :before-close="clearData"
          v-dialogDrag
        >
        <div>
    <div class="taskDetail">
      <div class="wrap_left">
        <div class="model_wrap">
<!--          <el-breadcrumb separator="/">-->
<!--            <el-breadcrumb-item >1</el-breadcrumb-item>-->
<!--            <el-breadcrumb-item>2</el-breadcrumb-item>-->
<!--            <el-breadcrumb-item>3</el-breadcrumb-item>-->
<!--          </el-breadcrumb>-->
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
        <div style="font-size: 18px;font-weight: bold;line-height: 20px">
          {{taskForm.prjTaskName}}
        </div>

        <!--              操作按钮-->
              <div>
<!--                <el-button  type="primary" icon="el-icon-chat-line-round" size="mini" @click="takeMemo">备注</el-button>-->
<!--                <el-button  type="primary" icon="el-icon-chat-line-round" size="mini" @click="excutorView=true">分配</el-button>-->
<!--                <el-button  type="primary" size="mini" @click="taskPlanState=true">提醒计划</el-button>-->
<!--                <el-dropdown trigger="click" @command="handleCommand">-->
<!--                  <span class="el-dropdown-link">-->
<!--                    <el-button type="primary"  size="mini" >更多 <i class="el-icon-arrow-down el-icon&#45;&#45;right"></i></el-button>-->
<!--                  </span>-->
<!--                  <el-dropdown-menu slot="dropdown">-->
<!--                    <el-dropdown-item  command="关注">{{edtiTasksData.watchList&&edtiTasksData.watchList.find(item=>item.userId==$store.getters.userId)?'停止关注':'添加关注'}}</el-dropdown-item>-->
<!--                  </el-dropdown-menu>-->
<!--                </el-dropdown>-->
              </div>
        <div class="model_wrap">
          <div class="divider"><span>任务详情</span></div>
          <div>
            <el-form label-position="left" label-width="100px" :model="taskForm" :rules="rules">
              <div v-if="changeHead" style="width: 100%;">
                <slot name="search-case"></slot>
                <el-form-item label="当前模板名称:" style="width: 100%;">
                  <span>{{teptName}}</span>
                  <el-button  type="primary" size="mini" :disabled="!!workType" @click="taskTemplateView = true">选择</el-button>
                  <el-button  type="primary" size="mini" :disabled="!!workType" @click="noTemplate">删除</el-button>
                </el-form-item>
              </div>
              <div v-else>
                <el-form-item label="当前模板名称:" style="width: 100%;">
                  <span>{{teptName}}</span>
                  <el-button  type="primary" size="mini" @click="taskTemplateView = true">选择</el-button>
                  <el-button  type="primary" size="mini" @click="noTemplate">删除</el-button>
                </el-form-item>
              </div>
              <el-row style="width: 100%;">
                <el-col :span="12">
                  <el-form-item style="width: 100%;" label="选择任务:">
                    <el-multi-cascader
                      ref="refHandle"
                      style="width: 100%;"
                      :disabled="!!workType"
                      :options="templateGroupTask"
                      @change="templateChange"
                      v-model="taskList"
                      multiple
                      filterable
                      select-children
                      clearable
                      collapse-tags
                      only-out-put-leaf-node
                      change-on-select> </el-multi-cascader>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item style="width: 100%;" class="" label="阶段:" label-width="60px"  prop="createTaskGroup">
                  <div>
                    <el-select
                      style="width: 100%;"
                      clearable
                      :disabled="!!workType"
                      allow-create
                      filterable
                      v-model="taskForm.createTaskGroup"
                      @change="changeHa"
                      placeholder="请选择"
                      default-first-option
                    >
                      <el-option
                        v-for="(item, index) in taskgroupList"
                        :key="item.prjTgId"
                        :label="item.prjTgName"
                        :value="item.prjTgId">
                      </el-option>
                    </el-select>
                  </div>
                </el-form-item>
                </el-col>
              </el-row>
              <el-row style="width: 100%;">
                <el-col :span="24">
                  <el-form-item style="width: 100%;" label="任务名称:" prop="prjTaskName">
                    <el-input type="textarea" style="" :autosize="{ minRows: 1, maxRows: 4}" v-model="taskForm.prjTaskName" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

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
              v-model="taskForm.prjTaskDesc">
            </el-input>
<!--            <el-input-->
<!--              type="textarea"-->
<!--              :autosize="{ minRows: 4, maxRows: 4}"-->
<!--              placeholder="请输入任务描述"-->
<!--              v-model="taskData.prjTaskDesc"-->
<!--          >-->
<!--            </el-input>-->
<!--            <VueUeditorWrap v-model="taskData.prjTaskDesc"  :config="myConfig" :destroy="true"  ></VueUeditorWrap>-->
          </div>
        </div>
        <div class="model_wrap">
          <div class="divider"><span>任务检查项</span></div>
          <div>
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 4}"
              placeholder="请输入任务检查项"
              v-model="taskForm.checkItem">
            </el-input>
          </div>
        </div>

<!--        <div class="model_wrap">-->
<!--          <div class="divider"><span>附件</span></div>-->
<!--          <div class="uploadwrap" :style="{'height': '100%','background':hoverState?'RGBA(32,159,255,0.06)':'#fff','overflow':'auto','padding':'20px'}"-->
<!--               @drop.stop.prevent="enentDrop($event)"-->
<!--               @dragover.stop.prevent="hoverState=true"-->
<!--               @dragleave.stop.prevent="hoverState=false"-->
<!--               @dragenter.stop.prevent="hoverState=true">-->
<!--            <div style="text-align: center">-->
<!--              <span style="font-size: 12px">将文件拖放到此处以添加附件，或者<span style="color: #409EFF;cursor: pointer;" @click="clickUpload=true">浏览</span></span>-->
<!--            </div>-->
<!--            <uploadFile :clickUpload="clickUpload" @getUploadFile="getUploadFile" @changeClick="clickUpload=false"></uploadFile>-->

<!--            <div class="fileWarp" v-if="taskData.fileList&&taskData.fileList.length">-->
<!--              <div class="file_item" v-for="item in taskData.fileList">-->
<!--                <p class="fileName"><a :href="`ipdoc${item.address}`" target="_blank">{{item.name}}</a></p>-->
<!--                <p class="file_detail"><span>{{item.createDate}}</span><span class="creater">{{item.creater}}</span></p>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
      </div>
      <div class="wrap_right">
        <div class="model_wrap">
          <div class="divider"><span>用户</span></div>
          <el-form label-position="left" label-width="120px" :model="taskForm" :rules="rules">
            <el-form-item label="任务创建人:">
<!--              {{taskForm.creatorName}}-->
              <UserIconAndUserName :user-id="taskForm.creator" ></UserIconAndUserName>
<!--              <virtual-select disabled clearable  :data="$store.getters.userList" v-model="taskForm.creator"  filterable :render="(data)=>$commonUtils.UserRender(data)" />-->
            </el-form-item>
            <el-form-item label="当前任务执行人:" label-width="120px" prop="executor">
              <virtual-select clearable :disabled="!!snExecutor" :data="$store.getters.userList" v-model="taskForm.executor"  filterable :render="(data)=>$commonUtils.UserRender(data)" />
              <localExector v-show="!snExecutor" @getUserId="(e)=>taskForm.executor=e"></localExector>
            </el-form-item>
          </el-form>
        </div>
        <div class="model_wrap">
          <div class="divider"><span>日期</span></div>

          <el-form label-position="left" label-width="100px" :model="taskForm" :rules="rules">
            <el-form-item label="创建:">
              {{taskForm.createDate}}
<!--              <el-date-picker-->
<!--                disabled-->
<!--                v-model="taskForm.createDate"-->
<!--                type="date"-->
<!--                placeholder="选择日期"-->
<!--                value-format="yyyy-MM-dd">-->
<!--              </el-date-picker>-->
            </el-form-item>
            <el-form-item label="开始:" prop="beginDate">
              <el-date-picker
                :clearable="false"
                v-model="taskForm.beginDate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                :picker-options="expireTimeOption_(taskForm.endDate)">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="截止:" prop="endDate">
              <el-date-picker
                :clearable="false"
                v-model="taskForm.endDate"
                type="date"
                placeholder="选择日期"
                :picker-options="_expireTimeOption(taskForm.beginDate)"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
      </div>
<!--      <div class="progressWrap" v-if="percentage">-->
<!--        <el-progress type="circle" :percentage="percentage"></el-progress>-->
<!--      </div>-->
    </div>
    <div class="button_wrap">
<!--      <el-button size="mini" type="primary" @click="confirm">确定</el-button>-->
<!--      <el-button size="mini"  @click="cancel">返回</el-button>-->
    </div>
  </div>


<!--          <el-form v-if="false" class="new-task-dialog" style="" :model="taskForm" :rules="rules" label-width="100px">-->
<!--            <el-row v-if="changeHead">-->
<!--              <el-col :span="12" style="">-->
<!--                <slot name="search-case">-->

<!--                </slot>-->

<!--              </el-col>-->
<!--              <el-col :span="12">-->
<!--                <el-form-item label="当前模板名称:">-->
<!--                  <span>{{teptName}}</span>-->
<!--                  <el-button  type="primary" size="mini" :disabled="!!workType" @click="taskTemplateView = true">选择</el-button>-->
<!--                  <el-button  type="primary" size="mini" :disabled="!!workType" @click="noTemplate">删除</el-button>-->
<!--                </el-form-item>-->
<!--              </el-col>-->


<!--            </el-row>-->
<!--            <el-row v-else >-->
<!--              <el-col :span="12">-->
<!--                <el-form-item label="当前模板名称:">-->
<!--                  <span>{{teptName}}</span>-->
<!--                  <el-button  type="primary" size="mini" @click="taskTemplateView = true">选择</el-button>-->
<!--                  <el-button  type="primary" size="mini" @click="noTemplate">删除</el-button>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--              <el-col :span="12" style="">-->

<!--              </el-col>-->

<!--            </el-row>-->
<!--            <el-row>-->
<!--&lt;!&ndash;              <el-col :span="12">&ndash;&gt;-->
<!--&lt;!&ndash;                <el-form-item label="选择模板:">&ndash;&gt;-->
<!--&lt;!&ndash;                  <el-button type="primary" size="mini" @click="taskTemplateView = true">选择</el-button>&ndash;&gt;-->
<!--&lt;!&ndash;                </el-form-item>&ndash;&gt;-->
<!--&lt;!&ndash;              </el-col>&ndash;&gt;-->
<!--              <el-col :span="12">-->
<!--                <el-form-item class="cascader" label="选择任务:">-->
<!--                  <el-multi-cascader-->
<!--                    ref="refHandle"-->
<!--                    :disabled="!!workType"-->
<!--                    :options="templateGroupTask"-->
<!--                    @change="templateChange"-->
<!--                    :focus="teptName"-->
<!--                    v-model="taskList"-->
<!--                    multiple-->
<!--                    filterable-->
<!--                    select-children-->
<!--                    clearable-->
<!--                    collapse-tags-->
<!--                    only-out-put-leaf-node-->
<!--                    change-on-select> </el-multi-cascader>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--              <el-col :span="12" style="">-->
<!--                <el-form-item class="group-task" label="选择任务组:"  prop="createTaskGroup">-->
<!--&lt;!&ndash;                  <div v-if="taskgroupList.length<1">&ndash;&gt;-->
<!--&lt;!&ndash;                    <el-input placeholder="请填写任务组:"></el-input>&ndash;&gt;-->
<!--&lt;!&ndash;                  </div>&ndash;&gt;-->
<!--                  <div>-->
<!--                    <el-select-->
<!--                      clearable-->
<!--                      :disabled="!!workType"-->
<!--                      allow-create-->
<!--                      filterable-->
<!--                      v-model="taskForm.createTaskGroup"-->
<!--                      @change="changeHa"-->
<!--                      placeholder="请选择"-->
<!--                      default-first-option-->
<!--                    >-->
<!--                      <el-option-->
<!--                        v-for="(item, index) in taskgroupList"-->
<!--                        :key="item.prjTgId"-->
<!--                        :label="item.prjTgName"-->
<!--                        :value="item.prjTgId">-->
<!--                      </el-option>-->
<!--                    </el-select>-->
<!--                  </div>-->
<!--                </el-form-item>-->
<!--              </el-col>-->

<!--            </el-row>-->


<!--            <el-row>-->
<!--              <el-col :span="12">-->
<!--                <el-form-item label="任务名称:" prop="prjTaskName">-->
<!--                  <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 4}" v-model="taskForm.prjTaskName" clearable></el-input>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--              <el-col :span="12">-->
<!--                <el-form-item label="任务执行人:" prop="executor">-->
<!--                  <div>-->
<!--                      <el-select clearable :disabled="!!snExecutor" v-model="taskForm.executor" @change="changeExecutor" placeholder="请选择执行人" filterable>-->
<!--                      <el-option-->
<!--                        v-for="item in peopleList"-->
<!--                        :key="item.userId"-->
<!--                        :label="item.fullName"-->
<!--                        :value="item.userId">-->
<!--                        <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>-->
<!--                      </el-option>-->
<!--                    </el-select>-->
<!--                  </div>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--            </el-row>-->
<!--            <el-row>-->
<!--              <el-col :span="12">-->
<!--                <el-form-item label="任务检查项:">-->
<!--                  <el-input-->
<!--                    type="textarea"-->
<!--                    :autosize="{ minRows: 1, maxRows: 4}"-->
<!--                    placeholder="请输入任务检查项"-->
<!--                    v-model="taskForm.checkItem">-->
<!--                  </el-input>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--              <el-col :span="12">-->
<!--                <el-form-item label="任务描述:">-->
<!--                  <el-input-->
<!--                    type="textarea"-->
<!--                    :autosize="{ minRows: 1, maxRows: 4}"-->
<!--                    placeholder="请输入任务描述"-->
<!--                    v-model="taskForm.prjTaskDesc">-->
<!--                  </el-input>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--            </el-row>-->

<!--&lt;!&ndash;            <el-row>&ndash;&gt;-->
<!--&lt;!&ndash;              <el-col :span="12" style="position: relative;">&ndash;&gt;-->
<!--&lt;!&ndash;                <el-form-item label="文件:">&ndash;&gt;-->
<!--&lt;!&ndash;                  <div style="max-height: 120px;overflow-y: auto">&ndash;&gt;-->
<!--&lt;!&ndash;                    <div v-for="(file, index) in fileLists" style="color: #409EFF;cursor: pointer">{{file.materialName}}</div>&ndash;&gt;-->
<!--&lt;!&ndash;                  </div>&ndash;&gt;-->

<!--&lt;!&ndash;                </el-form-item>&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                <div style="position: absolute;bottom: 0;right: 0"><el-button size="mini" type="primary" @click.native="upTempFile">上传</el-button></div>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;              </el-col>&ndash;&gt;-->
<!--&lt;!&ndash;              <el-col :span="12"></el-col>&ndash;&gt;-->
<!--&lt;!&ndash;            </el-row>&ndash;&gt;-->


<!--            <el-row>-->
<!--              <el-col class="bott" :span="12">-->
<!--                <el-form-item label="开始日期" prop="beginDate">-->
<!--                  <el-date-picker-->
<!--                    v-model="taskForm.beginDate"-->
<!--                    type="date"-->
<!--                    @change="timeCompare"-->
<!--                    value-format="yyyy-MM-dd"-->
<!--                    placeholder="选择日期">-->
<!--                  </el-date-picker>-->
<!--    &lt;!&ndash;              <el-date-picker&ndash;&gt;-->
<!--    &lt;!&ndash;                v-model="taskForm.date"&ndash;&gt;-->
<!--    &lt;!&ndash;                @change="dateChange"&ndash;&gt;-->
<!--    &lt;!&ndash;                value-format="yyyy-MM-dd"&ndash;&gt;-->
<!--    &lt;!&ndash;                type="daterange"&ndash;&gt;-->
<!--    &lt;!&ndash;                range-separator="至"&ndash;&gt;-->
<!--    &lt;!&ndash;                start-placeholder="开始日期"&ndash;&gt;-->
<!--    &lt;!&ndash;                end-placeholder="结束日期">&ndash;&gt;-->
<!--    &lt;!&ndash;              </el-date-picker>&ndash;&gt;-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--              <el-col class="bott" :span="12">-->
<!--                <el-form-item label="截止日期" prop="endDate">-->
<!--                  <el-date-picker-->
<!--                    v-model="taskForm.endDate"-->
<!--                    type="date"-->
<!--                    @change="timeCompare"-->
<!--                    value-format="yyyy-MM-dd"-->
<!--                    placeholder="选择日期">-->
<!--                  </el-date-picker>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--            </el-row>-->
<!--          </el-form>-->
          <div slot="footer" class="dialog-footer" style="display: flex;justify-content: center">
            <el-button @click="clearData" size="mini">取 消</el-button>
<!--            <el-button type="primary" @click="createTaskView = false">确 定</el-button>-->
            <el-button type="primary" @click="clickCreateTask" size="mini">确 定</el-button>
          </div>
            <el-dialog class="abow_dialog" :visible.sync="taskTemplateView" append-to-body width="80%" height="80%">
              <TemplateList ref="tempList" @templateData="templateData" class="list"></TemplateList>
              <div slot="footer" class="dialog-footer">
<!--                <el-button @click="taskTemplateView = false">取 消</el-button>-->
                <el-button @click="cancelChose" size="mini">取 消</el-button>
                <el-button type="primary" @click="leadIn" size="mini">选 择</el-button>
              </div>
            </el-dialog>

        </el-dialog>


      <!--提醒计划-->
      <taskPlanList :visible.sync="taskPlanState" :task-info="taskForm"></taskPlanList>
    </div>
</template>

<script>

  import {
    addProjectTaskGroup,
    queryProjectTask,
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
    queryMaterialType,
    queryMaterialDocType,
    queryMaterialTypeByDocId,
    copyTemplFile,
    unbindTaskFile,
    queryProjecTeptId,
    recordOnlienEdit
  } from '@/api/caseList'
  import { doEditInOffice, getProgID } from '@/utils/editInOffice.js'
  import { creatematerial } from '@/api/ipServiceApi.config.js'
  import { getUser } from '@/api/user'
  import { queryTemplateList, queryTaskList, queryTemplateFileList } from '@/api/templateManagement'
  import localExector from "../../project_management/components/localExector";
  import TemplateList from '../../system_management/templateManagement/index'
  import taskPlanList from "@/views/workbench/project_management/components/taskPlanList";
  import Bus from '@/utils/Bus'
  export default {
    name: "CreateNewTask",
    components: {
      TemplateList,
      taskPlanList,
      localExector
      // ChangeInput
    },
    props: {
      // hasTemplate: false,
      snRemark: '',
      snPrjTaskId: '',
      snAssignee: '',
      snExecutor: '',
      caseInfo: '',
      workType: '',
      messageType: '',
      tTeptId: '',
      taskView: false,
      tName: '',
      tepGroupList: {
        type: Array,
        default () {
            return []
        }
      },
      groupList: {
        type: Array,
        default () {
            return []
        }
      },
      createTask: {
        type: Array,
        default () {
            return ['','']
        }
      },
      caseId: '',
      caseTypeId: '',
      waitDo: '',
      judgeRank: '',
      checkCase: false,
      inTask: false,
    },
    data() {
      // 获取当前日期
      let currentDate = new Date();
      // 格式化日期为 yyyy-MM-dd
      let year = currentDate.getFullYear();
      let month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 加1并补零
      let day = String(currentDate.getDate()).padStart(2, '0'); // 补零
      const formattedDate = `${year}-${month}-${day}`
      const that = this
      return {
        taskPlanState:false,
        changeHead: false,
        haha: false,
        changExecutor: '',
        shenView: false,
        bindTaskList: [],
        bindTaskId: '',
        copyTemplFileView:false,
        fileHover: 10000,
        rightView: false,
        fileDocId: '',
        materialTypeId: '',
        uploadLocalData: {
          tokenID: this.$store.getters.token
        },
        creatematerial,
        creatematerialUrl: '',
        uploadDialog: false,
        popShow: false,
        onceCreateGroup: true,
        // groupList: [],
        rules: {
          prjTaskName: [{ required: true, message: '请输入任务名称', trigger: 'change' },],
          // createTaskGroup: [{ required: true, message: '请选择任务组', trigger: 'change' },],
          beginDate: [{ required: true, message: '请选择开始日期', trigger: 'change' },],
          endDate: [{ required: true, message: '请选择截止日期', trigger: 'change' },],
          executor: [{ required: true, message: '请选择任务执行人', trigger: 'change' },],
        },
        groupRules: {
          prjTgName: [{ required: true, message: '请输入任务组名称', trigger: 'change' },],
        },
        EditTaskRules: {
          prjTaskName: [{ required: true, message: '请输入任务名称', trigger: 'change' }],
          endDate: [{ required: true, message: '请选择截止日期', trigger: 'change' },]
        },
        aboutTask: '',
        userList:[],
        handTime: {
          date: new Date().toLocaleDateString(),
          username: this.$store.getters.userId,
          workContent: '',
          time: '',
          startDate: '',
          endDate: ''
        },
        setWorkTimeView: false,
        dateValue: '',
        peopleList: [],
        textareaState:false,
        textarea: '',
        activeNames: [],
        activeName: '1',
        createGroupView: false,
        createTaskView: false,
        taskTemplateView: false,
        groupForm: {
          prjTgName: '',
          agentNum: ''
        },
        prjTgId: '',
        taskForm: {
          creator:this.$store.getters.userId,
          creatorName:this.$store.getters.name,
          executor: this.$store.getters.userId,
          createTaskGroup: '',
          prjTaskName: '',
          prjTaskDesc: '',
          createDate: formattedDate,
          beginDate: formattedDate,
          endDate: formattedDate,
          checkItem: ''
        },
        taskgroupList: [],
        editGroupInfo: {
          prjTgName: ''
        },
        EditGroupView: false,
        teptId: '',
        templateTaskList: [],
        templateGroupTask: [],
        teptName: '',
        taskList: [],
        // createTaskGroup: [],
        timeDate: [],
        groupTaskList: [],
        columnDefs: [],
        firstGroup:false,
        subTaskList: [],
        selectEndDate: '',
        index: 0,
        agList: [],
        selected: '',
        editTaskView: false,
        tgId: '',
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
        executor: '',
        confirmDialog: false,
        tgIdd: '',
        groupNames: '',
        modelFileView: false,
        modelFileListView: false,
        modelFileId: [],
        localFileView: false,
        typeNameList: [],
        prjTaskId: '',
        taskId:'',
        docTypeList: [],
        modelTeptId: '',
        taskSelect: false,
        taskLook: false,
        backDate: '',
        editTeptId: '',
        materialIdList: [],
        fileLists: [],
        excutorView:false,
        assignData: {},
        dialogName: '',
        newTask: '',
        doCaseId: '',
        snTask: false,
        // snAssignee: '',
        // snExecutor: '',
        // messageType: '',
        choosePeople: false,
        workPrjName: '',
        changeTeptId: '',
        changeTeptName: '',
        // hasTemplate: false
      }
    },
    watch: {
      snExecutor(n,o){
        this.taskForm.executor = n
      },
      caseInfo(n,o) {
        let currentDate = new Date();
        // 格式化日期为 yyyy-MM-dd
        let year = currentDate.getFullYear();
        let month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 加1并补零
        let day = String(currentDate.getDate()).padStart(2, '0'); // 补零
        const  formattedDate = `${year}-${month}-${day}`
        if(n==''){
          this.templateGroupTask = []
          this.taskList = []
          this.teptName = ''
          this.taskgroupList = []
          this.taskForm.createTaskGroup = ''
          this.taskForm.prjTaskName = ''
          this.taskForm.prjTaskDesc = ''
          this.taskForm.checkItem = ''
          this.taskForm.endDate = formattedDate
          this.taskForm.createDate = formattedDate
          this.taskForm.beginDate = formattedDate
          this.taskForm.executor = this.$store.getters.userId

        }
      },
      workType(n,o){
        if(n!=''){

        }
      },
      caseTypeId: {
        handler: (n,o)=>{
        },
        immediate: true
      },
      caseId(n,o){
        let currentDate = new Date();
        // 格式化日期为 yyyy-MM-dd
        let year = currentDate.getFullYear();
        let month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 加1并补零
        let day = String(currentDate.getDate()).padStart(2, '0'); // 补零
        const formattedDate = `${year}-${month}-${day}`
        if(n!=''){
          this.workPrjName = ''
          this.taskForm.prjTaskName = ''
          this.taskForm.prjTaskDesc = ''
          this.taskForm.checkItem = ''
          this.templateGroupTask = []
          this.taskForm.createTaskGroup = ''
          // this.checkCase = false
          this.teptName = ''
          this.taskList = []
          this.onceCreateGroup = true
          // this.taskForm.date = ''
          // this.taskForm.executor = ''
          this.taskForm.endDate = formattedDate
          this.taskForm.beginDate = formattedDate
          this.queryProjectTask()
        }
      },
      messageType: {
        handler: (n,o)=>{
          if(n == '11'){

          }
        },
        immediate: true
      },
      waitDo(n,o){
        if(n){
          this.changeHead = true
        }
      },
      createTask(n,o){
        if (n[1] == '1'&&n[0]!=''){
          // this.queryProjectTask()
        }
      },
      tTeptId(n,o){
        this.teptId = n
      },
      tName(n,o){
        this.teptName = n
      },
      groupList(n,o) {
        this.taskgroupList = n
      },
      tepGroupList(n,o) {
        this.templateGroupTask = n
      },
      taskView(n,o){
        if(n){
          this.createTaskView = n
        }
      }
    },
    created() {
      this.queryPeopleList()
    },
    methods: {
      expireTimeOption_(taskData){
        let that=this
        return {
          disabledDate(date) {
            return that.CompareDate(that.$commonUtils.formatDate(date),taskData)
          }
        }
      },
      _expireTimeOption(taskData){
        let that=this
        return {
          disabledDate(date) {
            return that.CompareDate(taskData,that.$commonUtils.formatDate(date))
          }
        }
      },
      changeExecutor(e){
        this.taskForm.executor = e
      },
      doEditInOffice(data){
        const url = data.address
        if (getProgID(url)) {
          recordOnlienEdit({materialId: data.materialId})
          doEditInOffice(url, getProgID(url))
        } else if(['pdf','jpg','png'].some(item=>url.replace(/.+\./,"").toLocaleLowerCase()==item)){
          window.open(`/ipdoc${url}`.replace(/[+]/g,'%2B'))
          // window.open(`#/preView?address=ipdoc${url}`.replace(/[+]/g,'%2B'))
        } else {
         this.downLoad(data)
        }
      },
      postMessage(){
        this.$worker.postMessage({data:{
          value: {
            "popFlag":0,
            "msgType":-6,
            "data":"操作成功, userId=2834",
            "success":true,
            "event":"taskEvent",
            "message":"操作成功",
            userId:this.$store.getters.userId
          }}
        })
      },



      changeHa(v){
        if(this.createTask[1]=='2'&&!this.checkCase){
            this.$message.warning('请先输入案件文号或案件名称')
            this.taskForm.createTaskGroup = ''
            return;
          }
        if(this.taskgroupList.find(i=>i.prjTgId == v)){
          return
        }else if(this.taskgroupList.find(i=>i.prjTgName == v)){
          return
        }else if(!v){
          return
        }
        else{
          addProjectTaskGroup({ caseId: this.caseId, prjTgName: v, tepId: this.teptId}).then((res)=>{
            let id = res.data.prjTgId
            queryProjectTask({caseId:this.caseId}).then((res)=>{

          this.taskgroupList = res.data

          this.taskgroupList.forEach((i,index)=>{
            this.activeNames.push(index)
          })
              this.taskgroupList = res.data
              // this.taskForm.createTaskGroup =this.taskgroupList.find(i=>i.prjTgId == id).prjTgId

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
                //   // j.teptId = i.teptId
                // })
                return  i.taskList
              }else{
                return i
              }
            }
          })
        }).then((res)=>{
              // this.$emit('closeView')
            this.taskForm.createTaskGroup =this.taskgroupList.find(i=>i.prjTgId == id).prjTgId
            })
            this.createGroupView = false
            this.groupForm.prjTgName = ''
            // this.taskForm.createTaskGroup = res.data.prjTgId
            // this.confirmDialog = false
          })
        }
      },
      copyTemplClose() {
        this.copyTemplFileView = false
        this.materialTypeId = ''
        this.typeNameList = []
        this.fileDocId = ''
        // this.bindTaskList = []
        this.bindTaskId = ''
      },
      handleClick(f) {
        if(f==2){
        }
      },
      handleChangeMat(v) {
      },
      upTempFile() {
        this.prjTaskId = ''
        this.queryTempFiles()
        this.copyTemplFileView = true
        // this.taskSelect = true
        this.queryMaterialDocType()
      },
      copyTemplFile() {
        if(!this.fileDocId){
          this.$message.error('请填写文件类型！')

          return
        }
        if(this.fileDocId&&this.typeNameList.length&&!this.materialTypeId){
          this.$message.error('请填写文件类型！')
          return
        }
        // this.queryTempFiles()
        let id
        if(this.copyTemplFileView){
          id = this.bindTaskId
        }else if(this.editTaskView){
          id = this.prjTaskId
        }
        if(this.newTask){
          id = ''
        }
        copyTemplFile({
          tfileId: this.modelFileId[0],
          caseId: this.caseId,
          materialTypeId: this.materialTypeId,
          doctId: this.fileDocId,
          prjTaskId: id
        }).then((res)=>{
          // this.queryProjectTask('add')
          this.fileLists.push(res.data)
          this.$message.success('绑定文件成功！')
          this.copyTemplFileView = false
          this.rightView = false
          this.modelFileId = []
          this.fileDocId = ''
          this.materialTypeId = ''
          this.bindTaskId = ''
          // this.copyTemplFileView = false
        })
      },
      queryMaterialDocType() {
        queryMaterialDocType().then(res=>{
          this.docTypeList = res.data
        })
      },
      localFileClick(data) {
        this.localFileView = true
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
      beforeUpload() {
        if(this.bindTaskId){
          this.uploadLocalData.prjTaskId = this.bindTaskId
        }else{
          this.uploadLocalData.prjTaskId = this.prjTaskId
        }
        if(this.newTask){
          this.uploadLocalData.prjTaskId = ''
        }
        this.uploadLocalData.materialTypeId = this.materialTypeId

        if(this.fileDocId&&this.materialTypeId||this.fileDocId&&!this.typeNameList.length&&!this.materialTypeId){
          this.creatematerialUrl = this.creatematerial
          let promise = new Promise((resolve) => {
          this.$nextTick(function () {
            resolve(true);
          });
        });
        return promise;
        }else{
           let promise = new Promise((resolve,reject) => {
              this.$nextTick(function () {
                reject(false);
              });
            });
           this.$message.error('请填写文件类型！')
            return promise;

        }
      },
      successCallback(res, file, fileList) {
        if(res.success){
          // this.materialIdList.push(res.data[0].materialId)
          if(this.newTask || this.createTaskView){
            this.fileLists.push(res.data[0])
          }
          this.$message.success('文件上传成功!')
          // this.queryProjectTask('add')
          this.copyTemplFileView = false
          this.rightView = false
          this.fileDocId = ''
          this.materialTypeId = ''
          this.bindTaskId = ''
        }else{
          this.$message.error('文件上传失败!')
          // this.loadView = false
          // this.isLoading = true
        }
      },
      handleChangeDoc(value){
        if(value){
          this.queryMaterialTypeByDocId()
          this.materialTypeId = ''
        }else{
          this.typeNameList = []
          this.materialTypeId = ''
        }
      },
      queryMaterialTypeByDocId() {
          queryMaterialTypeByDocId({ doctId:this.fileDocId ,caseId:this.caseId}).then(res => {
            this.typeNameList = res.data
          })

      },
      queryTempFiles() {
        queryTemplateFileList({teptId: this.teptId,tfileId: this.teptId}).then(res=>{
          this.edtiTasksData.modelFileList = res.data
        })
      },
      // getUser(){
      //   getUser().then(res=>{
      //     this.userList=res.data
      //   })
      // },
      clearData() {
        Bus.$emit('deleteSelect')
        this.$emit('closeView','取消')
        this.createTaskView = false
        // this.changeHead = false
        // this.workType = ''
        // this.templateGroupTask = []
        // this.workPrjName = ''
        // this.taskForm.prjTaskName = ''
        // this.taskForm.prjTaskDesc = ''
        // this.taskForm.checkItem = ''
        // this.taskForm.createTaskGroup = ''
        // this.teptName = ''
        // this.taskList = []
        // this.onceCreateGroup = true
      },
      noTemplate() {
        // this.$refs['tempList'].selected = 100
        Bus.$emit('deleteSelect')
        this.taskTemplateView = false
        this.teptName = ''
        this.teptId = ''
        this.groupForm.prjTgName = ''
        this.templateGroupTask = []
        this.taskList = []
        this.onceCreateGroup = true
      },
      changeDate(v, e) {
        this.modifyProjectTask(v)
      },
      queryPeopleList(data) {
        queryTaskUserList({caseId: this.caseId}).then(res=>{
          this.peopleList = res.data
        })
      },
      onlyOneChoice(v){
        this.modelFileId = []
        if(v){
          this.modelFileId.push(v.splice(-1)[0])
          // console.log(this.modelFileId)
        }
      },
      queryProjectTask(a) {
        queryProjectTask({caseId:this.caseId}).then((res)=>{
          this.snExecutor&&(this.taskForm.executor = this.snExecutor)
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
            } else if (this.caseTypeId) {
              queryTemplateList({caseTypeId: this.caseTypeId}).then((res) => {
                if (res.data.find(item => item.judgeRank == this.judgeRank)) {
                  // this.hasTemplate = true
                  this.teptId = res.data.find(item => item.judgeRank == this.judgeRank).teptId
                  this.teptName = res.data.find(item => item.judgeRank == this.judgeRank).teptName
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
                }
              })
            } else {
              this.teptName = ''
              this.taskList = []
              this.templateGroupTask = []
              // this.taskForm.createTaskGroup = ''
              // this.taskgroupList = []
            }
          }).catch(res=>{

          })
          // if(res.data.find(i=>i.teptName)){
          //   this.teptName = res.data.find(i=>i.teptName).teptName
          // }
          this.taskgroupList = res.data.filter(item=>item.prjTgId)
          // console.log(this.taskgroupList,999)
          // this.taskgroupList.forEach((i,index)=>{
          //   this.activeNames.push(index)
          // })
          // this.agList = this.taskgroupList.map(i=>{
          //   if(i.teptId){
          //     if(i.taskList){
          //       //   i.taskList.forEach(j=>{
          //       //   j.teptId = i.teptId
          //       // })
          //        return  i.taskList
          //     }else{
          //       return i
          //     }
          //   }
          //   else{
          //     if(i.taskList){
          //       // i.taskList.forEach(j=>{
          //       //   j.teptId = i.teptId
          //       // })
          //       return  i.taskList
          //     }else{
          //       return i
          //     }
          //   }
          //
          // })
          // this.bindTaskList = this.deepFlatten(this.agList)
          // this.bindTaskList = this.bindTaskList.filter(i=>i.prjTaskId)
          // if(a == 'delete' || a == 'add'){
          //   if(!this.copyTemplFileView){
          //     this.edtiTasksData.fileList = this.deepFlatten(this.agList).find(item=>item.prjTaskId == this.prjTaskId).fileList
          //   }else{
          //     Bus.$emit('updateCaseEvent')
          //     this.copyTemplFileView = false
          //   }
          // }
        })
      },
      dateChange(date) {
        this.timeDate = date
      },
      cancelChose(){
        Bus.$emit('deleteSelect')
        this.taskTemplateView = false
        this.changeTeptId = ''
        this.changeTeptName = ''
      },
      templateData(item) {
        this.changeTeptId = item.teptId
        this.changeTeptName = item.teptName
      },
      leadIn() {
        if(this.changeTeptId){
          this.teptId = this.changeTeptId
        }
        if(this.changeTeptName){
          this.teptName = this.changeTeptName
        }
        this.changeTeptId = ''
        this.changeTeptName = ''
        if(this.createTask[1]=='2'&&!this.checkCase){
          this.$message.warning('请先输入案件文号或案件名称')
          Bus.$emit('deleteSelect')
          this.teptName = ''
          this.$refs['tempList'].selected = 100
          this.taskTemplateView = false
          return;
        }
        this.taskList = []
        this.$refs['tempList'].selected = 100
        this.templateGroupTask = []
        // this.taskForm.prjTaskName = ''
        // this.taskForm.prjTaskDesc = ''
        // this.taskForm.checkItem = ''
        // this.templateGroupTask = []
        // this.taskForm.createTaskGroup = ''
        this.groupForm.tgId = ''
        this.groupForm.prjTgName = ''
        // this.taskForm.date = ''
        // this.taskgroupList.length = 0
        queryTaskList({teptId: this.teptId, caseId: this.caseId}).then((res)=>{
          this.templateGroupTask = res.data.filter(item=>!!item)
          this.templateGroupTask = (this.templateGroupTask).map(item=>({
            value: item.tgId,
            label: item.tgName,
            children: (item.taskDefineList).map(i=>({
              value: i.taskDefineId,
              label: i.taskName,
              taskDesc: i.taskDesc,
              itemList: i.itemList,
              taskFileList: i.taskFileList
            }))
          }))
          this.taskTemplateView = false
          this.onceCreateGroup = true
        })
      },
      newTaskGroup(o) {
        if(o=='onceCreate'){
          this.onceCreateGroup = false
        }
        addProjectTaskGroup({tgId: this.tgIdd, caseId: this.caseId, prjTgName: this.groupNames, tepId: this.teptId}).then((res)=>{
          let id = res.data.prjTgId
            queryProjectTask({caseId:this.caseId}).then((res)=>{

          this.taskgroupList = res.data

          this.taskgroupList.forEach((i,index)=>{
            this.activeNames.push(index)
          })
              this.taskgroupList = res.data
              // this.taskForm.createTaskGroup =this.taskgroupList.find(i=>i.prjTgId == id).prjTgId

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
        }).then((res)=>{
              // this.$emit('update')
            this.taskForm.createTaskGroup =this.taskgroupList.find(i=>i.prjTgId == id).prjTgId
            })
            this.createGroupView = false
            this.groupForm.prjTgName = ''
        })
      },
      templateChange(v) {
        if(v.length == 0){
          // this.confirmDialog = false
          this.taskForm.createTaskGroup = ''
        }
        let vArr = v.map(it=>{
            return it[0]
          })
        const uniqArr = Array.from(new Set(vArr))
        if(v.length>0){
          if(uniqArr.length==1){
            let groupName = this.templateGroupTask.find(item=>item.value == v[0][0])
            this.tgIdd = groupName.value
            // this.taskForm.createTaskGroup = groupName.value
            this.groupNames = groupName.label

            if(this.taskgroupList.length>0){
              // 任务组中有模板新建任务的任务组
              if(this.taskgroupList.find(item=>item.prjTgName == this.groupNames)){
                this.taskForm.createTaskGroup = this.taskgroupList.find(item=>item.prjTgName == this.groupNames).prjTgId
              }else{
                // if(this.onceCreateGroup){
                if(this.createTask[1]=='2'&&!this.checkCase){
                    this.$message.warning('请先输入案件文号或案件名称')
                    this.taskList = []
                    return;
                  }
                  this.newTaskGroup('onceCreate')
                  // this.confirmDialog = true
                // }
              //  任务组中没有选中任务模板的任务组
              }
            }else{
            //  该案件任务组中没有模板选中的任务组，是否新建任务组
            //   if(this.onceCreateGroup){
              if(this.createTask[1]=='2'&&!this.checkCase){
                this.taskList = []
                this.$message.warning('请先输入案件文号或案件名称')
                return;
              }
                this.newTaskGroup('onceCreate')
                  // this.confirmDialog = true
                // }
            }
          }

        }
        this.subTaskList = []
        let valueList = []
        this.taskList.forEach(item=>{
          valueList.push(item[1])
        })
        let allTaskList = []
        this.templateGroupTask.forEach(item=>{
          allTaskList.push(item.children)
        })
        allTaskList = this.deepFlatten(allTaskList)
        valueList.forEach(item=>{
          this.subTaskList.push(allTaskList.find(i=>i.value == item))
        })
        this.subTaskList = this.subTaskList.map(item=>({
          subTaskName: item.label,
          subTaskDesc: item.taskDesc,
          taskDefineId: item.value,
          itemList: item.itemList,
          taskFileList: item.taskFileList
        }))

        if(this.subTaskList.length==1){
          this.taskDefineId = this.subTaskList[0].taskDefineId
        }else{
          this.taskDefineId = ''
        }
        let prjTaskNameList = []
        let prjTaskDescList = []
        let prjTaskCheckList = []
        this.subTaskList.forEach(item => {
          prjTaskNameList.push(item.subTaskName)
          prjTaskDescList.push(item.subTaskDesc)
          prjTaskCheckList.push(item.itemList)
        })
        let arr = []
        this.deepFlatten(prjTaskCheckList.filter(item=>!!item)).forEach((i, index)=>{
          // arr.push(index+1+'.'+i.itemName)
          if(i.itemName) {
            if (i.itemName.slice(0, 3).includes('.')) {
              // let signIndex = i.itemName.indexOf('.')
              // arr.push(i.itemName.substring(signIndex+1))
              arr.push(i.itemName)
            } else {
              arr.push(index + 1 + '.' + i.itemName)
            }
          }
        })

        this.taskForm.checkItem = arr.join('\n')
        this.taskForm.prjTaskName = prjTaskNameList.filter(item=>!!item).join('&')
        this.taskForm.prjTaskDesc = prjTaskDescList.filter(item=>!!item).join('\n')
        // this.taskForm.prjTaskDesc = this.taskForm.prjTaskDesc.split('\n')
        //
        // if(this.taskForm.prjTaskDesc.filter(item=>!!item).length>0){
        //   this.taskForm.prjTaskDesc = this.taskForm.prjTaskDesc.map((item,index)=>{
        //     return item = index+1+'.'+item
        //   })
        //   this.taskForm.prjTaskDesc = this.taskForm.prjTaskDesc.join('\n')
        // }else{
        //   this.taskForm.prjTaskDesc = ''
        // }
      },
      deepFlatten(arr) {
        let flatten = (arr)=> [].concat(...arr);
        return flatten(arr.map(x=>Array.isArray(x)? this.deepFlatten(x): x));
      },
      CompareDate(d1,d2){
        if(!d2){
          return false
        }
        return ((new Date(d1.replace(/-/g,"\/"))) > (new Date(d2.replace(/-/g,"\/"))));
      },
      timeCompare(v){
        if(this.CompareDate(this.taskForm.beginDate, this.taskForm.endDate)){
          this.$message.error('开始日期不能大于截止日期!')
          // this.taskForm.beginDate = ''
          // this.taskForm.endDate = ''
          return
        }
      },
      clickCreateTask() {
        if(this.snExecutor){
          this.taskForm.executor = this.snExecutor
        }
        if(this.CompareDate(this.taskForm.beginDate, this.taskForm.endDate)){
          this.$message.error('开始日期不能大于截止日期!')
          // this.taskForm.beginDate = ''
          // this.taskForm.endDate = ''
          return
        }
        if(this.createTask[1]=='2'&&!this.checkCase&&!this.workType){
          this.$message.error('请输入正确案件文号或案件名称')
          return;
        }
        if(!!this.workType){
          this.caseId = ''
          this.teptId = ''
          this.taskDefineId = ''
          this.taskForm.createTaskGroup = ''
          this.subTaskList = []
          this.workPrjName = this.taskForm.prjTaskName
          // if(!this.taskForm.prjTaskName || !this.taskForm.beginDate || !this.taskForm.endDate || !this.taskForm.executor) {
          //   this.$message.error('请填写必填项！')
          //   return
          // }
          if(!this.taskForm.prjTaskName){
            this.$message.error('请填写任务名称！')
            return
          }
          if(!this.taskForm.beginDate){
            this.$message.error('请填写开始时间！')
            return
          }
          if(!this.taskForm.endDate){
            this.$message.error('请填写截止时间！')
            return
          }
          if(!this.taskForm.executor){
            this.$message.error('请选择任务执行人！')
            return
          }

        }else{
          // if(!this.taskForm.prjTaskName || !(this.taskForm.createTaskGroup || this.taskForm.prjTgName) || !this.taskForm.beginDate || !this.taskForm.endDate||!this.taskForm.executor) {
          //   this.$message.error('请填写必填项！')
          //   return
          // }
          if(!this.taskForm.prjTaskName){
            this.$message.error('请填写任务名称！')
            return
          }
          if(!this.taskForm.beginDate){
            this.$message.error('请填写开始时间！')
            return
          }
          if(!this.taskForm.endDate){
            this.$message.error('请填写截止时间！')
            return
          }
          if(!this.taskForm.executor){
            this.$message.error('请选择任务执行人！')
            return
          }
          // if(!(this.taskForm.createTaskGroup || this.taskForm.prjTgName)){
          //   this.$message.error('请选择任务组！')
          //   return
          // }
        }

        let list = []
        let itemList = []
        if(this.taskForm.checkItem){
          this.taskForm.checkItem.split('\n').filter(item=>!!item).forEach((i,index)=>{
            if(i.slice(0,3).includes('.')){
              // let signIndex = i.indexOf('.')
              // list.push(i.substring(signIndex+1))
              list.push(i)
            }else{
              list.push(index+1+'.'+i)
            }

          })
            itemList = list.map(i=>({
              prjIemName: i
            }))
        }

        if(this.snPrjTaskId){
          submitTask({prjTaskId: this.snPrjTaskId,remark: this.snRemark}).then(()=>{
            // this.$message.success('任务提交成功！')
            // this.postMessage()
            // this.queryToDoTask()
          })
        }
        // 获取当前日期
        let currentDate = new Date();
        // 格式化日期为 yyyy-MM-dd
        let year = currentDate.getFullYear();
        let month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 加1并补零
        let day = String(currentDate.getDate()).padStart(2, '0'); // 补零
        const formattedDate = `${year}-${month}-${day}`

        addProjectTask({
          // materialIdList: this.fileLists.map(i=>i.materialId),
          itemList,
          workType: this.workType,
          teptId: this.teptId,
          taskDefineId: this.taskDefineId,
          caseId: this.caseId,
          prjTgName: this.workPrjName,
          prjTgId: this.taskForm.createTaskGroup,
          prjTaskName: this.taskForm.prjTaskName,
          prjTaskDesc: this.taskForm.prjTaskDesc,
          startDate: this.taskForm.beginDate,
          endDate: this.taskForm.endDate,
          subTaskList: this.subTaskList,
          executor: this.taskForm.executor,
          assignee: this.snAssignee
        }).then(()=>{
          Bus.$emit('deleteSelect')
          this.$emit('closeView','成功')
          this.createTaskView = false
          // this.queryProjectTask()
          // this.queryProjectTask()
          // this.postMessage()
          this.$message.success('增加任务成功！')
          this.workType = ''
          this.templateGroupTask = []
          this.workPrjName = ''
          this.taskForm.prjTaskName = ''
          this.taskForm.prjTaskDesc = ''
          this.taskForm.checkItem = ''
          // this.templateGroupTask.length = 0
          this.taskForm.createTaskGroup = ''
          // this.checkCase = false
          if(this.createTask[1]){
            this.teptName = ''
            this.caseId = ''
          }
          // this.teptName = ''
          this.taskList = []
          this.onceCreateGroup = true
          // this.taskForm.date = ''
          this.taskForm.executor = this.$store.getters.userId
          this.taskForm.endDate = formattedDate
        }).catch((res)=>{
          this.$message.error(res.message)
          // this.$emit('closeView','失败')
          // this.taskForm.executor = ''
          // this.taskForm.prjTaskName = ''
          // this.taskForm.endDate = ''
        })
      }
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
      width: 200px;
      margin: 0 15px 15px 0;
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





.new-task-dialog,.edit-task-dialog{
    .el-row{
      display: flex;
      &:last-child{
        border-bottom: 1px solid #ccc;
      }
      .el-col{
        /*height: 100%;*/
        display: flex;
        border: 1px solid #ccc;
        border-bottom: none;
        .el-form-item{
          flex: 1;
          margin-bottom: 0;
          /*max-height: 120px;*/
          overflow-y: auto;
          display: flex;
          justify-content: left;
          >>>.el-form-item__label{
            background-color: #f1f1f1;
          }
          >>>.el-form-item__content{
            margin-left: 0!important;
            width: 75%;
          }
        }
      }
      /*.bott{*/
      /*  border-bottom: 1px solid #ccc;*/
      /*}*/
    }
  }
  .task-progress {
    height: 100%;
    .task-group {
      /*padding: 50px 80px;*/
      .template-collapse-item{
        position: relative;
        .collapse-title {
          flex: 1 0 90%;
          order: 1;
          .el-icon-delete {
            /*position: absolute;*/
            /*left: 50%;*/
            /*top: 20px;*/
            font-size: 16px;
            /*<!--transform: translateX(-200px) translateY(-6px);-->*/
            transition: all .3s;
            &:hover {
              color: red;
            }
          }
          .el-icon-edit {
            /*position: absolute;*/
            /*left: 50%;*/
            /*top: 20px;*/
            margin-right: 30px;
            font-size: 18px;
            /*<!--transform: translateX(-250px) translateY(-6px);-->*/
            /*transition: all .3s;*/
            &:hover {
              color: #52A0F5;
            }
          }
        }
        >>> .el-collapse-item__header {
          display: flex;
          flex: 1 0 auto;
          height: 50px;
          order: -1;
          background-color: #fff;
          text-align: left;
        }
      }
    }
    .task-dialog {
      .out-dialog {
        .in-dialog {
        }
      }
    }
  }
  .abow_dialog{
    >>> .el-dialog {
        position: absolute;
        top: 50%;
        left: 50%;
        margin: 0 !important;
        transform: translate(-50%, -50%);
        max-height: calc(100% - 30px);
        max-width: calc(100% - 30px);
        display: flex;
        flex-direction: column;
    }
    >>> .el-dialog__body {
          overflow: auto;
    }
  }

  .overflow-hidden{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }
  .fileName-hidden{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
  .el-icon-s-cooperation, .el-icon-s-claim, .el-icon-s-unfold {
    color: #52A0F5;
  }
  .date-picker {
    height: 30px;
    >>>.el-input__inner {
      width: 150px;
      height: 30px;
    }
  }
  .selected {
    .el-select{
      >>>.el-input__inner{
        width: 150px;
        height: 30px;
      }
    }

  }
  .do-more {
    .el-icon-edit {
      &:hover{
        color: #52A0F5
      }
    }
    .el-icon-paperclip {
      font-size: 20px;
      &:hover{
        color: #52A0F5
      }
    }
    .el-icon-delete {
      &:hover {
        color: red
      }
    }
  }
  >>> .el-form-item__label {
    font-weight: 500;
  }
  .right-fileList {
    flex: 5;
    >>>.el-card__header{
      padding: 0;
    }
    >>> .el-card__body{
      padding: 10px;
        line-height: 30px;
    }
  }
  /deep/ .el-upload-dragger{
        /*height:70px*/
  }
  .file-type {
    .el-input__inner{
      height: 30px;
    }
  }
  .el-icon-view {
    margin-left: 5px;
    font-size: 16px;

    cursor: pointer;
    color: #409EFF;
    /*&:hover {*/
    /*  color: #409EFF;*/
    /*}*/
  }
  .do-some {
    .el-icon-view {
      margin-right: 10px;
      font-size: 18px;
      color: #657174;
    }
  }


  .right-fileList {
    /*position: absolute;*/
    /*right: 0;width: 400px;*/
    /*height: 300px;*/
    /*z-index: 199999;*/
    >>>.el-card__header{
      /*padding: 5px 0;*/
    }
    >>> .el-card__body{
      padding: 10px;
      /*height: 200px;*/
      height: 160px;
      line-height: 30px;
      overflow-y: auto;
    }
  }
  >>>.el-collapse-item__content{
    /*height: 250px;*/
    /*overflow-y: auto;*/
  }
  .right-tab {
    height: 300px;
  }
  .el-icon-close{
    position: absolute;
    height: 20px;
    width: 20px;
    font-size: 20px;
    /*margin: 5px;*/
    margin-top: 10px;
    margin-right: 5px;
    /*background-color: red;*/
    cursor: pointer;
    z-index: 99999;
    right: 0;
  }
  >>>.el-tabs__content {
    padding: 0;
  }
  .file-type {
    .about-task{
      >>>.el-input__inner{
        height: 30px;
        /*background-color: red;*/
        /*width: 285px;*/
        line-height: 30px;
      }
    }
    .task{
      >>>.el-input__inner{
        height: 30px;
        /*background-color: red;*/
        /*width: 305px;*/
        line-height: 30px;
      }
    }
    >>>.el-input__inner{
      height: 30px;
      /*width: 150px;*/
      line-height: 30px;
    }
    >>>.el-input__icon {
      line-height: 30px;
    }
  }
  .upload-demo {
    height: 150px;
  }
  >>>.el-upload-dragger{
    height: 150px;
    /*width: 400px;*/
  }
  .filehover {
    background-color: #f7f7f7;
  }
  .dialog-footer{
    display: flex;
    justify-content: center;
  }
  .file-name{
    color: #409EFF;
    width: 140px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
  .file-name1{
    color: #409EFF;
    width: 250px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
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
  /*.new-task-dialog,.edit-task-dialog{*/
  /*  .el-row{*/
  /*    display: flex;*/
  /*    &:last-child{*/
  /*      border-bottom: 1px solid #ccc;*/
  /*    }*/
  /*    .el-col{*/
  /*      !*height: 100%;*!*/
  /*      display: flex;*/
  /*      border: 1px solid #ccc;*/
  /*      border-bottom: none;*/
  /*      .el-form-item{*/
  /*        flex: 1;*/
  /*        margin-bottom: 0;*/
  /*        !*max-height: 120px;*!*/
  /*        overflow-y: auto;*/
  /*        display: flex;*/
  /*        justify-content: left;*/
  /*        >>>.el-form-item__label{*/
  /*          flex-shrink: 0;*/
  /*          background-color: #f1f1f1;*/
  /*        }*/
  /*        >>>.el-form-item__content{*/
  /*          margin-left: 0!important;*/
  /*          width: 100%;*/
  /*        }*/
  /*      }*/
  /*    }*/
  /*    !*.bott{*!*/
  /*    !*  border-bottom: 1px solid #ccc;*!*/
  /*    !*}*!*/
  /*  }*/
  /*}*/
  >>>.el-input__inner{
    /*height: 30px!important;*/
    /*line-height: 30px!important;*/
  }
</style>
