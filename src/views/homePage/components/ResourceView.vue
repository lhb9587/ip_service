<template>
    <div style="position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
overflow: auto">
     <el-button style="float: right" size="small" @click="changeView">切换视图</el-button>
      <div style="display: flex;justify-content: center;align-items:center;">
        <el-button-group class="button-group-search"  v-clickoutside="clickoutside">
          <el-button id="mySearch" type="primary" size="small" @click="handleSearch(0)">搜索</el-button>
          <el-button type="primary" style="margin-left:0" class="searchRight"  size="small" icon="el-icon-arrow-down" @click.stop.prevent="drawerState=true"></el-button>
          <transition name="show" mode="out-in">
            <div class="searchWrap" v-show="drawerState">

              <el-form size="mini" label-width="120px" class="form-container" @keyup.enter.native="handleSearch(0)" style="margin-top: 2px"  >
                <el-form-item :label="item.filterName+':'"
                              :class="item.filterType==='radio'&&item.values.length>3?'fullItem':'postInfo-container-item'" v-for="item,index in conditionsModuleList" :key="index">

                  <el-select v-model="queryModuleData[item.property]" placeholder="请选择" v-if="item.filterType==='select'" filterable clearable>
                    <el-option v-for="itm in item.values" :key="itm.id" :label="itm.value" :value="itm.id">
                    </el-option>
                  </el-select>
                  <!--<el-checkbox-group style="display:flex" v-model="queryModuleData[item.property]" v-if="item.filterType==='checkbox'">-->
                  <!--<el-checkbox v-for="itm in item.values" :label="itm.value" :key="itm.id">{{itm.value}}</el-checkbox>-->
                  <!--</el-checkbox-group>-->
                  <el-select  v-if="item.filterType==='checkbox'&&item.values&&item.values.length"    v-model="queryModuleData[item.property]" multiple placeholder="请选择"  filterable  clearable >
                    <el-option v-for="itm in item.values" :key="itm.id" :label="itm.value" :value="itm.id">
                    </el-option>
                  </el-select>
                  <el-select v-if="item.filterType==='selectMany'" v-model="queryModuleData[item.property]"  filterable remote clearable  placeholder="请输入关键词" :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName);
            }">
                    <el-option v-for="itm in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
                    </el-option>
                  </el-select>
                  <el-select v-if="item.filterType==='selectMultipleMany'" multiple v-model="queryModuleData[item.property]"  filterable remote clearable placeholder="请输入关键词" :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName);
            }">
                    <el-option v-for="itm in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
                    </el-option>
                  </el-select>
                  <el-select v-if="item.filterType==='selectMultipleManyTable'" multiple v-model="queryModuleData[item.property]" filterable remote clearable  placeholder="请输入关键词" :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName); }">
                    <el-option disabled label="" value="-1">
            <span v-for="(itmx,key) in getAppTitleList(item.filterName,item['valueList']?item['valueList'][0]:undefined)" v-if="key!='id'">
            {{itmx}}
            </span>
                    </el-option>
                    <el-option v-for="(itm,idx) in item['valueList']" :key="idx" :label="itm.value" :value="itm.id">
                      <el-tooltip v-for="(itmx,key) in item['valueList'][idx]" v-if="key!='id'" :key="key" class="item" effect="light" :content="itmx" placement="top">
                        <span>{{itmx}}</span>
                      </el-tooltip>
                    </el-option>
                  </el-select>
                  <el-select v-if="item.filterType==='selectTableMany'"  v-model="queryModuleData[item.property]" filterable remote clearable  placeholder="请输入关键词" :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName); }">
                    <el-option disabled label="" value="">
            <span v-for="(itmx,key) in getAppTitleList(item.filterName,item['valueList']?item['valueList'][0]:undefined)" v-if="key!='id'">
            {{itmx}}
            </span>
                    </el-option>
                    <el-option v-for="itm,idx in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
                      <el-tooltip v-for="itmx,key in item['valueList'][idx]" v-if="key!='id'" class="item" effect="light" :content="itmx" placement="top">
                        <span>{{itmx}}</span>
                      </el-tooltip>
                    </el-option>
                  </el-select>
                  <el-select v-if="item.filterType==='selectTableMultipleMany'" v-model="queryModuleData[item.property]" multiple filterable remote clearable  placeholder="请输入关键词" :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName); }">
                    <el-option disabled label="" value="">
            <span v-for="(itmx,key) in getAppTitleList(item.filterName,item['valueList']?item['valueList'][0]:undefined)" v-if="key!='id'" :key="key">
            {{itmx}}
            </span>
                    </el-option>
                    <el-option v-for="(itm,idx) in item['valueList']" :key="itm.id+idx" :label="itm.value" :value="itm.id">
                      <el-tooltip v-for="(itmx,key) in item['valueList'][idx]" v-if="key!='id'" :key="itmx+key" class="item" effect="light" :content="itmx" placement="top">
                        <span>{{itmx}}</span>
                      </el-tooltip>
                    </el-option>
                  </el-select>
                  <el-select v-if="item.filterType==='selectTable'" v-model="queryModuleData[item.property]" filterable clearable placeholder="请选择">
                    <el-option v-for="itm ,idx in item.values" :key="idx" :label="itm.value" :value="itm.id" :disabled="itm.id==-1">
                      <span v-for="itmx ,key in item['values'][idx]" v-if="key!='id'">{{itmx}}</span>
                    </el-option>
                  </el-select>
                  <el-radio-group v-model="queryModuleData[item.property]" v-if="item.filterType==='radio'">
                    <el-radio :label="itm.id" v-for="itm,index in item.values" :key="index">{{itm.value}}</el-radio>
                  </el-radio-group>
                  <el-input clearable v-model="queryModuleData[item.property]" :placeholder="'请输入'+item.filterName" v-if="item.filterType==='text'"></el-input>
                  <el-input clearable v-model="queryModuleData[item.property]" :placeholder="'请输入'+item.filterName" type="textarea" v-if="item.filterType==='textarea'"></el-input>
                  <el-input clearable v-model="queryModuleData[item.property.split(',')[0]]" :placeholder="'请输入'+item.filterName" v-if="item.filterType==='textRange'"
                            @change="(string)=>changeTextRange(string,index,item.property)"></el-input>
                  <span v-if="item.filterType==='textRange'" v-show="item.property.includes(',')">至</span>
                  <el-input clearable v-model="queryModuleData[item.property.split(',')[1]]" :placeholder="'请输入'+item.filterName" v-if="item.filterType==='textRange'"></el-input>
                  <DataPicker class="DataPicker" v-if="item.filterType==='date'" v-model="queryModuleData[item.property]"></DataPicker>
                  <!--<el-date-picker v-if="item.filterType==='date'" v-model="queryModuleData[item.property.split(',')[0]]" type="date" placeholder="开始日期">-->
                  <!--</el-date-picker>-->
                  <!--<span v-if="item.filterType==='date'" v-show="item.property.includes(',')">至</span>-->
                  <!--<el-date-picker v-if="item.filterType==='date'" v-show="item.property.includes(',')" v-model="queryModuleData[item.property.split(',')[1]]" type="date" placeholder="结束日期">-->
                  <!--</el-date-picker>-->
                  <el-multi-cascader
                    ref="multiCascader"
                    :class="item.property"
                    v-if="item.filterType==='cascader'"
                    :show-all-levels="false"
                    :options="item.values"
                    multiple
                    filterable
                    clearable
                    :props="defaultParams"

                    change-on-select
                    selectChildren
                    v-model="queryModuleData[item.property]"> </el-multi-cascader>
                  <el-autocomplete
                    v-if="item.filterType==='autocomplete'"
                    v-model="queryModuleData[item.property]"
                    :fetch-suggestions="(queryString,cb)=>querySearchAsync(queryString, index, item.property, item.filterName,cb)"
                    placeholder="请输入内容"
                    filterable
                    :popper-append-to-body="false"
                  >
                    <template slot-scope="{ item }">
                      <div class="name_wrap" :class="item.id==-1?'firstName_wrap':''">
                        <el-tooltip  class="item" effect="light" :content="item.value" placement="top">
                          <div  :class="item.id==-1?'name0':'name'">{{ item.value }}</div>
                        </el-tooltip>
                        <el-tooltip  class="item" effect="light" :content="item.value1" placement="top">
                          <div :class="item.id==-1?'name0':'name'">{{ item.value1 }}</div>
                        </el-tooltip>
                        <el-tooltip  class="item" effect="light" :content="item.value2" placement="top">
                          <div  :class="item.id==-1?'name0':'name'">{{ item.value2 }}</div>
                        </el-tooltip>
                        <el-tooltip  class="item" effect="light" :content="item.value3" placement="top">
                          <div :class="item.id==-1?'name0':'name'">{{ item.value3 }}</div>
                        </el-tooltip>
                      </div>
                    </template>
                  </el-autocomplete>
                  <!--                  <el-cascader :change-on-select="true" :show-all-levels="false" v-if="item.filterType==='cascader'" collapse-tags filterable clearable v-model="queryModuleData[item.property]"-->
                  <!--                               :options="item.values" :props="defaultParams" placeholder="请选择"></el-cascader>-->
                </el-form-item>
              </el-form>
              <div class="clearWrap" v-if="drawerState"   >
<!--                <el-popover-->
<!--                  placement="top"-->
<!--                  width="300"-->
<!--                  v-model="addFilterState">-->
<!--                  <div>过滤器名称</div>-->
<!--                  <div><el-input type="text" v-model="schemeName"></el-input></div>-->
<!--                  <div style="text-align: right; margin: 0">-->
<!--                    <el-button size="mini" type="text" @click="addFilterState = false">取消</el-button>-->
<!--                    <el-button type="primary" size="mini" @click="addFilterScheme(2)">确定</el-button>-->
<!--                  </div>-->
<!--                  <el-button  size="mini" slot="reference"><span>保存</span></el-button>-->
<!--                </el-popover>-->

                <el-button  size="mini"   @click="clearSearch"><span>重置</span></el-button>
                <el-button  type="primary" size="mini"  @click="handleSearch(0)">搜索</el-button>
              </div>
              <el-button style="position:absolute;top: 10px;right: 10px" type="text" size="small"  @click="queryFilter"><i class="el-icon-s-tools"></i>更多</el-button>
            </div>
          </transition>
        </el-button-group>
        <el-button type="primary" size="mini" @click.native="handleCommand" style="margin-left: 20px;">新建任务</el-button>
        <el-checkbox style="margin-left: 20px"  v-model="checked" @change="(e)=>queryCaseListList(e)">已完成任务</el-checkbox>
        <el-checkbox style="margin-left: 20px" v-if="$store.getters.roles.find(item=>item.roleId==2049)" v-model="departmentSelection" @change="(e)=>queryCaseListList(e)">本部门员工任务</el-checkbox>
        <el-checkbox style="margin-left: 20px"  v-model="watch" @change="(e)=>queryCaseListList(e)">我关注的任务</el-checkbox>

      </div>

      <el-dialog title="提示" :visible.sync="transferVisible" width="80%" >
        <el-transfer v-model="transferValue" :key="transferData.filterId" :data="transferData" filterable filter-placeholder="请输入搜索内容"
                     :titles="['选择筛选项—全部案件', '已选']">
        </el-transfer>
        <span slot="footer" class="dialog-footer">
        <el-button @click="transferVisible = false">取 消</el-button>
        <el-button type="primary" @click="configFilter">确 定</el-button>
      </span>
      </el-dialog>
      <el-form style="margin-top: 10px">
        <el-form-item  label="时间:" label-width="45px">
          <DateRange v-model="queryModuleData.endDateArray"  @change="handleSearch(1)"></DateRange>
        </el-form-item>
        <el-form-item  label="员工:" label-width="45px">
          <el-select v-model="queryModuleData.userIdList"   multiple filterable clearable placeholder="请选择" @change="handleSearch(1)">
            <el-option
              v-for="item in $store.getters.userList"
              :key="item.userId"
              :label="item.fullname"
              :value="item.userId">
<!--              <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>-->
            </el-option>
          </el-select>
          <!--            <el-button type="primary" @click="queryWorkHours">查询</el-button>-->
        </el-form-item>
      </el-form>
<!--      <transition-group name="slide-fade">-->
        <ResourceList  v-show="state" ref="resourceList" :total.sync="total"  @getData="getData" @taskData="taskData"></ResourceList>
        <div   v-if="!state" class="Gantt_wrap">
        <!--        <div>-->
        <!--        <CaleNarTitle style="width: 600px" @updateToPage="updateToPage" v-if="chartTitleFlag"></CaleNarTitle>-->
        <!--        <v-chart v-if="chartFlag" class="chart" ref="echarts" :autoresize="true" theme="ovilia-green" :options="option" @click="handleClick"/>-->
        <!--        </div>-->
        <div style="width: 100%;" v-if="chartTitleFlag">
          <Gantt :dataList="dataList"></Gantt>
        </div>

      </div>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :pageSizes="pageSizesList" :limit.sync="listQuery.pageSize" @pagination="queryCaseListList()" />
<!--      </transition-group>-->
<!--      新建任务-->
      <create-new-task
        @closeView="closeView"
        :task-view="createView"
        :case-id="createCaseId"
        :wait-do="waitDo"
        :check-case="checkCase"
        :create-task="[createCaseId,createTask]"
        :work-type="workType"
        :case-info="caseInfo"
      >
        <el-row slot="search-case" class="" style="width: 100%;">
          <el-col :span="12" style="border: none">
            <el-form-item style="width: 100%!important;" label="搜索案件:" label-width="110px" prop="">
              <el-popover
                  placement="bottom-start"
                  width="600"
                  trigger="manual"
                  v-model="agentVisible"
                  >
                  <div style="max-height: 200px;overflow-y: auto">
                    <div @click="queryCase(item)" v-for="(item,index) in agentCaseLists" :key="index" class="tables" style="display: flex;max-height: 100px;overflow-y: auto">
                      <el-tooltip  :content="item.agentNum" placement="top" effect="light">
                        <div style="flex: 1;cursor: default;height: 30px;line-height: 30px;" class="overflow-hidden" :class="{'table-head': item.agentNum == '案件文号'}">{{item.agentNum}}</div>
                      </el-tooltip>
                      <el-tooltip  :content="item.caseName" placement="top" effect="light">
                        <div style="flex: 1;cursor: default;height: 30px;line-height: 30px;" class="overflow-hidden" :class="{'table-head': item.caseName == '案件名称'}">{{item.caseName}}</div>
                      </el-tooltip>
                    </div>
                  </div>
                  <el-input :disabled="workType!=''" style="" clearable @clear="clearCaseInfo" slot="reference" v-model="caseInfo"  @blur="closeCaseList" @focus="openCaseList"  @keyup.enter.native="(v)=>{queryCaseList(v,'agent')}"></el-input>
                </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="border: none">
            <el-form-item style="width: 100%!important;" label="工作类型:" label-width="100px">
              <el-select clearable @clear="onlyCase" :disabled="caseInfo!=''" class="select-input" v-model="workType" placeholder="请选择">
                <el-option
                  v-for="item in workKinds"
                  :key="item.workType"
                  :label="item.workTypeName"
                  :value="item.workType">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </create-new-task>
<!--      操作弹框-->
<!--      <taskDialog-->
<!--        @submitTask="submitTask"-->
<!--        @shenhe="shenhe"-->
<!--        @shenpiOk="shenpiOk"-->
<!--        @shenqingOk="shenqingOk"-->
<!--        @closeDialog="closeDialog"-->
<!--        :people-list="peopleList"-->
<!--        :title="dialogName"-->
<!--        :do-data="taskInfo"-->
<!--        :shenhe-view="shenView"-->
<!--        :caseData="doCaseId"-->
<!--      ></taskDialog>-->
<!--      修改任务-->
      <edit-task
        ref="edit"
        :edit-data="edtiTasksData"
        :edit-view="editTaskView"
        :title="title"
        :id="teptId"
        :name="teptName"
        :work-sign="workSign"
        :task-data-case-id="taskDataCaseId"
        :group-list="editTaskgroupList"
        :tep-group-list="editGroupTask"
        @tijiao="tijiao"
        @shenHe="shenHe"
        @update="updateTask"
        @handleTask="handleTask"
        @editTaskViewClos="editTaskViewClos"
      ></edit-task>

      <!--      项目详情-->
      <el-dialog
          :visible.sync="projectSign"
          width="80%"
          top="0"
          height="500"
          append-to-body
          :modal="false"
          v-dialogDrag
          :close-on-click-modal="false"
          :before-close="closeDetail"
      >
        <task-details @closeDetail="closeDetail" :prjTaskId="detailPrjTaskId" v-if="projectSign&&detailPrjTaskId"></task-details>
      </el-dialog>
      <!--      再分配任务执行人-->
      <el-dialog
        title="任务执行人"
        :visible.sync="excutorView"
        width="25%"
        append-to-body
        center
        top="0"
        height="500"
        :modal="false"
        v-dialogDrag
        :close-on-click-modal="false"
      >
        <div style="width:100%;display: flex;justify-content: center;align-items: center">
          <el-form label-width="120px">
            <el-form-item label="执行人:">
              <virtual-select clearable  :data="$store.getters.userList" v-model="choseExecutor"  filterable :render="(data)=>$commonUtils.UserRender(data)" >
              </virtual-select>
            </el-form-item>
            <el-form-item label="常用执行人:">
              <localExector @getUserId="(e)=>choseExecutor=e"></localExector>
            </el-form-item>
            <el-form-item label="截止日期:">
              <el-date-picker
                class="executor"
                v-model="choseEndDate"
                type="date"
                :clearable="false"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                :picker-options="expireTimeOption">
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer" style="display: flex;justify-content: center">
          <el-button @click="assginTask" type="primary" size="small">确 定</el-button>
          <el-button size="small" @click="excutorView = false">取 消</el-button>
        </span>
      </el-dialog>

<!--      <Gantt @rowClick="handleClick" :dataList="dataList"></Gantt>-->
      <!--提交并创建、审核创建新任务-->
      <div class="task-dialog">
        <el-dialog
          title="新建任务"
          :visible.sync="createTaskView"
          width="80%"
          center
          top="0"
          height="500"
          append-to-body
          :modal="false"
          v-dialogDrag
          :close-on-click-modal="false"
          :before-close="clearData"
        >
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
                    <el-form-item label="当前模板名称:" style="width: 100%;">
                      <span>{{teptName}}</span>
                      <el-button  type="primary" :disabled="end" size="mini" @click="taskTemplateView = true">选择</el-button>
                      <el-button  type="primary" :disabled="end" size="mini" @click="noTemplate">删除</el-button>
                    </el-form-item>
                    <el-row style="width: 100%;">
                      <el-col :span="12">
                        <el-form-item style="width: 100%;" label="选择任务:">
                          <el-multi-cascader
                            ref="refHandle"
                            style="width: 100%;"
                            :disabled="end"
                            :options="templateGroupTask"
                            @change="templateChange"
                            :focus="teptName"
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
                        <el-form-item style="width: 100%;" class="" label="阶段:"  prop="createTaskGroup">
                        <div>
                          <el-select
                            style="width: 100%;"
                            clearable
                            :disabled="end"
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
                        <el-form-item style="width: 100%;" label="任务名称:"  prop="prjTaskName">
                          <el-input type="textarea" style="" :disabled="end" :autosize="{ minRows: 1, maxRows: 2}" v-model="taskForm.prjTaskName" clearable></el-input>
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
                    <virtual-select clearable  :data="$store.getters.userList" v-model="taskForm.creator"  filterable :render="(data)=>$commonUtils.UserRender(data)" />
                  </el-form-item>
                  <el-form-item label="当前任务执行人:" label-width="120px" prop="executor">
                    <virtual-select clearable :disabled="snTask || hasBoss" :data="$store.getters.userList" v-model="taskForm.executor"  filterable :render="(data)=>$commonUtils.UserRender(data)" />
                    <localExector v-show="!(snTask || hasBoss)" @getUserId="(e)=>taskForm.executor=e"></localExector>
                  </el-form-item>
                </el-form>
              </div>
              <div class="model_wrap">
                <div class="divider"><span>日期</span></div>

                <el-form label-position="left" label-width="100px" :model="taskForm" :rules="rules">
                  <el-form-item label="创建:">
<!--                    <el-date-picker-->
<!--                      v-model="taskForm.createDate"-->
<!--                      type="date"-->
<!--                      placeholder="选择日期"-->
<!--                      value-format="yyyy-MM-dd">-->
<!--                    </el-date-picker>-->
                    {{taskForm.createDate}}
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
<!--          <el-form class="new-task-dialog" style="" :model="taskForm" :rules="rules" label-width="100px">-->
<!--            <el-row>-->
<!--              <el-col :span="12">-->
<!--                <el-form-item label="当前模板名称:">-->
<!--                  <span>{{teptName}}</span>-->
<!--                  <el-button  type="primary" :disabled="end" size="mini" @click="taskTemplateView = true">选择</el-button>-->
<!--                  <el-button  type="primary" :disabled="end" size="mini" @click="noTemplate">删除</el-button>-->
<!--                </el-form-item>-->
<!--              </el-col>-->

<!--            </el-row>-->
<!--            <el-row>-->
<!--              <el-col :span="12">-->
<!--                <el-form-item class="cascader" label="选择任务:" >-->
<!--                  <el-multi-cascader-->
<!--                    :disabled="end"-->
<!--                    ref="refHandle"-->
<!--                    :options="templateGroupTask"-->
<!--                    @change="templateChange"-->
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
<!--                <el-form-item class="group-task" label="选择任务组:" prop="createTaskGroup">-->
<!--&lt;!&ndash;                  <div v-if="taskgroupList.length<1">&ndash;&gt;-->
<!--&lt;!&ndash;                    <el-input placeholder="请填写任务组:"></el-input>&ndash;&gt;-->
<!--&lt;!&ndash;                  </div>&ndash;&gt;-->
<!--                  <div>-->
<!--                    <el-select :disabled="end" allow-create filterable v-model="taskForm.createTaskGroup" @change="changeHa" placeholder="请选择">-->
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
<!--                  <el-input type="textarea" :disabled="end" :autosize="{ minRows: 1, maxRows: 4}" v-model="taskForm.prjTaskName" clearable></el-input>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--              <el-col :span="12">-->
<!--                <el-form-item label="任务执行人:" prop="executor">-->
<!--                  <div>-->
<!--                      <el-select v-model="taskForm.executor" :disabled="snTask || hasBoss" placeholder="请选择执行人" filterable>-->
<!--                      <el-option-->
<!--                        v-for="item in peopleList"-->
<!--                        :key="item.id"-->
<!--                        :label="item.fullname"-->
<!--                        :value="item.id">-->
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
<!--                    :autosize="{ minRows: 3, maxRows: 4}"-->
<!--                    placeholder="请输入任务检查项"-->
<!--                    v-model="taskForm.checkItem">-->
<!--                  </el-input>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--              <el-col :span="12">-->
<!--                <el-form-item label="任务描述:">-->
<!--                  <el-input-->
<!--                    type="textarea"-->
<!--                    :autosize="{ minRows: 3, maxRows: 4}"-->
<!--                    placeholder="请输入任务描述"-->
<!--                    v-model="taskForm.prjTaskDesc">-->
<!--                  </el-input>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--            </el-row>-->

<!--            <el-row>-->
<!--              <el-col :span="12" style="position: relative;">-->
<!--&lt;!&ndash;                <el-form-item label="文件">&ndash;&gt;-->
<!--&lt;!&ndash;                  <div style="max-height: 120px;overflow-y: auto">&ndash;&gt;-->
<!--&lt;!&ndash;                    <div v-for="(file, index) in fileLists" style="color: #409EFF;cursor: pointer">{{file.materialName}}</div>&ndash;&gt;-->
<!--&lt;!&ndash;                  </div>&ndash;&gt;-->
<!--&lt;!&ndash;                </el-form-item>&ndash;&gt;-->
<!--&lt;!&ndash;                <div style="position: absolute;bottom: 0;right: 0"><el-button size="mini" type="primary" @click.native="upTempFile">上传</el-button></div>&ndash;&gt;-->
<!--              </el-col>-->
<!--              <el-col :span="12"></el-col>-->
<!--            </el-row>-->


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
            <el-dialog
              class="abow_dialog"
              :visible.sync="taskTemplateView"
              append-to-body width="80%"
              center
              top="0"
              height="500">
              <TemplateList ref="tempList" @templateData="templateData" class="list"></TemplateList>
              <div slot="footer" class="dialog-footer">
<!--                <el-button @click="taskTemplateView = false">取 消</el-button>-->
                <el-button @click="cancelChose" size="mini">取 消</el-button>
                <el-button type="primary" @click="leadIn" size="mini">选 择</el-button>
              </div>
            </el-dialog>

        </el-dialog>
      </div>
      <!--      审核不通过重新分配执行人-->
      <el-dialog
        title="提示"
        :visible.sync="choosePeople"
        append-to-body
        :modal="false"
        center
        top="0"
        height="500"
        v-dialogDrag
        :close-on-click-modal="false"
        width="25%">
        <div style="display: flex;flex-direction: column; align-items: center;justify-content: center">
          <div style="display: flex;width: 100%; align-items: center;justify-content:left;padding-left: 18% ;margin-bottom: 30px">
            <span style="display: inline-block;width: 100px;text-align: right;padding-right: 20px">执行人:</span>
            <el-select class="executor" v-model="executor" placeholder="请选择执行人" filterable clearable>
              <el-option
                v-for="item in peopleList"
                :key="item.id"
                :label="item.fullname"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div style="display: flex;width: 100%; align-items: center;justify-content:left;padding-left: 18% ">
            <span style="display: inline-block;width: 100px;text-align: right;padding-right: 20px">截止日期:</span>
            <el-date-picker
              class="executor"
              v-model="shenheEndDate"
              type="date"
              :clearable="false"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </div>

        </div>

        <span slot="footer" class="dialog-footer" style="display: flex; align-items: center;justify-content: center">
          <el-button @click="choosePeople = false">取 消</el-button>
          <el-button type="primary" @click="auditTaskNo">确 定</el-button>
        </span>
      </el-dialog>

      <!--提醒计划-->
      <taskPlanList :visible.sync="taskPlanState" :task-info="taskForm"></taskPlanList>
    </div>
</template>

<script>
  import localExector from "../../workbench/project_management/components/localExector";
  import taskPlanList from "@/views/workbench/project_management/components/taskPlanList";
  import TemplateList from '@/views/workbench/system_management/templateManagement/index'
  import EditTask from "../../workbench/case/components/EditTask";
  import taskDialog from "@/views/workbench/toDoTasks/components/taskDialog";
  import Gantt from "./Gantt.vue";
  import {queryUsersTaskList,queryWorkType,queryProjectTask,queryProjecTeptId,queryTaskById} from '@/api/caseList'
  // import ECharts from "vue-echarts";
  // import "echarts/lib/chart/bar";
  // import "echarts/lib/chart/line";
  // import "echarts/lib/chart/pie";
  // import "echarts/lib/chart/map";
  // import "echarts/lib/chart/radar";
  // import "echarts/lib/chart/scatter";
  // import "echarts/lib/chart/effectScatter";
  // import "echarts/lib/component/tooltip";
  // import "echarts/lib/component/polar";
  // import "echarts/lib/component/geo";
  // import "echarts/lib/component/legend";
  // import "echarts/lib/component/title";
  // import "echarts/lib/component/visualMap";
  // import "echarts/lib/component/dataset";
  // import "echarts/map/js/world";
  // import "zrender/lib/svg/svg";
  // import "echarts-gl";
  // // import getOption from "./getOptions.js";
  // import theme from "./shine.json";
  // ECharts.registerTheme("ovilia-green", theme);
  import {
    addFilterScheme,
    delCase,

    selectColumn,
    savePreference,
    queryCaseList,
    queryPreference,
    delPreference,
    queryFilter,
    configFilter,
    queryFilterConfig,
    submitOfficalAudit,
    auditOfficalDoc,
    queryTrademarkCaseOfficial,
    deleteCase,
    deleteDoc,
    deleteIns,
    queryCustomerNameId,
    getManualRecognitionOfficialInfoCount,
    recognizedError,
    getCaseByTmFileId,
    submitOfficalModify,
    queryCorrelationCaseList,
    downloadMaterial,
    copyCase,
    uploadDocFile,
    updateWkg,
    queryCaseWork,
    getCaseHistory,
    deleteProjectTask,
    queryTaskUserList,
    assginTask,
    auditTask,
    submitTask,
    addProjectTaskGroup,
    addProjectTask
  } from "@/api/caseList.js";
  import { queryTaskList, queryTemplateFileList } from '@/api/templateManagement'
import ResourceList from "./ResourceList.vue";
import CreateNewTask from "../../workbench/case/components/CreateNewTask";
import CaleNarTitle from "./CaleNarTitle";
  import {getUser} from "@/api/user"
  import dateRangUtil from '@/utils/dateRangUtil'
  import Bus from '@/utils/Bus'
  import Pagination from "@/components/Pagination";
  import taskDetails from "../../workbench/project_management/components/taskDetail";
  export default {
    components: {taskDetails,ResourceList,CaleNarTitle,Gantt,CreateNewTask,taskDialog,EditTask,TemplateList,Pagination,taskPlanList,localExector},
    name: "ResourceView",
    props:{
      bussId: {
        default: "26"
      },
    },
    data(){
      // 获取当前日期
      let currentDate = new Date();
      
      // 格式化日期为 yyyy-MM-dd
      let year = currentDate.getFullYear();
      let month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 加1并补零
      let day = String(currentDate.getDate()).padStart(2, '0'); // 补零
        
      const formattedDate = `${year}-${month}-${day}`
      const that = this
      var cellSize=[80, 80]
      var scatterData = this.getVirtulData({month: new Date().getMonth()+1, year: new Date().getFullYear()},1);
      return{
        watch:false,
        //任务操作
        // newTaskGroupList:[],
        detailPrjTaskId:'',
        taskPlanState:false,
        title:'',
        projectSign:false,
        bossUserId: '',
        hasBoss: false,
        agentVisible:false,
        agentCaseLists:[],
        // newTaskHasTemplate:false,
        // hasTemplate: false,
        shenheTaskId: '',
        peopleList: [],
        excutorView: false,
        assignData: {},
        choseEndDate: '',
        choseEndDate1: '',
        choseExecutor: '',
        expireTimeOption: {
					disabledDate(date) {
						return that.CompareDate(that.format(date.getTime()),that.choseEndDate1)
					}
				},
        snPrjTaskId: '',
        snRemark: '',
        snAssignee:'',
        snExecutor: '',
        snTask: false,
        newTask:false,
        choosePeople: false,
        messageType: '',
        shenheremark: '',
        createTaskView: false,
        taskForm: {
          creator: this.$store.getters.userId,
          prjTgName: '',
          createTaskGroup: '',
          prjTaskName: '',
          prjTaskDesc: '',
          createDate: formattedDate,
          beginDate: formattedDate,
          endDate: formattedDate,
          checkItem: '',
          executor: ''

        },
        executor: '',
        groupForm: {
          caseId: '',
          agentNum: '',
          prjTgName: ''
        },
        rules: {
          prjTaskName: [{ required: true, message: '请输入任务名称', trigger: 'change' },],
          // createTaskGroup: [{ required: true, message: '请选择任务组', trigger: 'change' },],
          beginDate: [{ required: true, message: '请选择开始日期', trigger: 'change' },],
          endDate: [{ required: true, message: '请选择截止日期', trigger: 'change' },],
          executor: [{ required: true, message: '请选择任务执行人', trigger: 'change' },],
        },
        taskTemplateView: false,
        end: false,
        taskList: [],
        onceCreateGroup: true,
        taskDefineId: '',
        subTaskList: [],
        shenheEndDate: '',
        tgIdd: '',
        groupNames: '',


        //修改任务数据
        editTaskId: '',
        templateGroupTask: [],
        editTaskgroupList: [],
        workSign: false,
        edtiTasksData:{},
        editTaskView: false,
        teptId: '',
        teptName: '',
        dialogName:'',
        taskDataCaseId: '',
        taskgroupList: [],
        editGroupTask: [],

        taskInfo: {},
        shenView: false,
        doCaseId: '',
        createView: false,
        createCaseId: '',
        waitDo: false,
        workType: '',
        caseInfo: '',
        createTask: '2',
        workKinds: {},

        queryModuleData:{
          endDateArray:new dateRangUtil().getCurrentMonth().map(item=>this.$commonUtils.formatDate(item)),
          userIdList:[this.$store.getters.userId],
        },

        state:true,
        chartTitleFlag:false,
        chartFlag:true,
        drawerState:false,
        pageSizesList:[10, 50, 200,500,1000,5000,10000],
        listQuery: {
          pageNo: 1,
          pageSize: JSON.parse(localStorage.getItem('pageSize'))?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name)?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name).pageSize:10:10
        },
        total: 0,
        option:{
          tooltip : {},
          legend: {
            data: ['张三', '李四', '王五'],
            bottom: 30
          },
          visualMap: {
            show: false,
            min: 0,
            max: 300,
            calculable: true,
            seriesIndex: [1],
            orient: 'horizontal',
            left: 'center',
            bottom: 20,
            inRange: {
              color: ['#fff', '#006edd'],
              opacity: 0.3
            },
            controller: {
              inRange: {
                opacity: 0.5
              }
            }
          },
          calendar: {
            top: 'middle',
            left: 'center',
            orient: 'vertical',
            cellSize: cellSize,
            yearLabel: {
              show: false,
              textStyle: {
                fontSize: 30
              }
            },
            dayLabel: {
              margin: 20,
              firstDay: 1,
              nameMap: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
            },
            monthLabel: {
              show: false
            },

             range: ['2020-11']
          },
          series: [{
            tooltip:{ show : false},
            id: 'label',
            type: 'scatter',
            coordinateSystem: 'calendar',
            symbolSize: 1,
            label: {
              normal: {
                show: true,
                formatter: function (params) {
                  return params.value[0].slice(-2)
                },
                offset: [-cellSize[0] / 2 + 10, -cellSize[1] / 2 + 10],
                textStyle: {
                  color: '#000',
                  fontSize: 14
                }
              },

            },
            data: scatterData
          },{
            label:{show: false} ,
            type: 'heatmap',
            coordinateSystem: 'calendar',
             data: scatterData,
            tooltip:{ show : false}
          }]
        },
        cellSize,
        taskId:'',
        pieRadius :30,
        dataList:[],
        conditionsModuleList:[],
        transferData:[],
        transferValue:[],
        transferVisible:false,
        userList:[],
        subTaskId:'',
        subRemark:'',
        subMessageType: '',
        checkCase: false,
        checked:localStorage.getItem('rwChecked')?(localStorage.getItem('rwChecked')==='true'?true:false):false,
        departmentSelection:false,
        changeTeptId: '',
        changeTeptName: '',
        startDate:''
      }
    },
    mounted() {
      this.queryFilterConfig(1)
      // this.getUser()
      this.keyCodeForEvent()
      this.workClick()
      Bus.$on('taskHandle',(arr)=>{
        this.taskHandle(arr)
      })
      this.peopleList = this.$store.getters.userList
// this.queryUsersTaskList()
//       this.$nextTick(()=>{
//         this.updateToPage({month: new Date().getMonth()+1, year: new Date().getFullYear()})
//       })
//       this.$nextTick(()=>{
//         this.chartTitleFlag=true
//       })

    },
    methods:{
      closeDetail(){
        this.projectSign = false
        this.detailPrjTaskId = ''
      },
      updateTask(f){
        if(f == '0'){
          this.queryPrjTask(this.edtiTasksData,'edit')
        }else{
          this.closeDialog()
          this.queryCaseListList()
        }
      },
      shenHe(arr){
        this.auditTask(arr[1],arr[0])
      },
      tijiao(arr){
        this.submitTask(arr)
      },
      handleTask(arr){
        this.taskHandle(arr)
      },
      closeCaseList(){
        this.agentVisible = false
      },
      openCaseList(){
        this.agentVisible = true
      },
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
      checkCaseList(v,f){
        // if(this.checkCase){
        //   return
        // }else{
        //
        // }
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
        this.templateGroupTask = []
        this.taskForm.prjTaskName = ''
        this.taskForm.prjTaskDesc = ''
        // this.templateGroupTask = []
        this.taskForm.createTaskGroup = ''
        queryTaskList({teptId: this.teptId, caseId: this.doCaseId}).then((res)=>{
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
      clickCreateTask() {
        if(this.CompareDate(this.taskForm.beginDate, this.taskForm.endDate)){
          this.$message.error('开始日期不能大于截止日期!')
          // this.taskForm.beginDate = ''
          // this.taskForm.endDate = ''
          return
        }
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
        // if(!this.taskForm.prjTaskName || !(this.taskForm.createTaskGroup || this.taskForm.prjTgName) || !this.taskForm.beginDate || !this.taskForm.endDate) {
        //   this.$message.error('请填写必填项！')
        //   return
        // }else if(!this.snTask && !this.taskForm.executor){
        //   this.$message.error('请填写必填项！')
        //   return
        // }
        let list = []
        let itemList = []
        // this.taskForm.checkItem.split('\n').filter(item=>!!item).forEach(i=>{
        //   list.push(i.substring(2))
        // })
        // let itemList = list.map(i=>({
        //   prjIemName: i
        // }))
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
        let executors = ''
        let assignee = ''
        executors = this.taskForm.executor
        if(this.snTask){
          // submitTask({prjTaskId: this.snPrjTaskId,remark: this.snRemark}).then(()=>{
          // })
          executors = this.snExecutor
          assignee = this.snAssignee
        }
        if((this.messageType == '15' || this.subMessageType == '15')&&this.hasBoss){
          executors = this.bossUserId
          assignee = this.bossUserId
        }
        addProjectTask({
          // materialIdList: this.fileLists.map(i=>i.materialId),
          itemList,
          teptId: this.teptId,
          taskDefineId: this.taskDefineId,
          caseId: this.doCaseId,
          prjTgName: this.taskForm.prjTgName,
          prjTgId: this.taskForm.createTaskGroup,
          prjTaskName: this.taskForm.prjTaskName,
          prjTaskDesc: this.taskForm.prjTaskDesc,
          startDate: this.taskForm.beginDate,
          endDate: this.taskForm.endDate,
          subTaskList: this.subTaskList,
          assignee: assignee,
          executor: executors
        }).then(()=>{
          if(this.snTask){
            submitTask({prjTaskId: this.snPrjTaskId,remark: this.snRemark}).then(()=>{
            })
          }
          this.snPrjTaskId = ''
          this.snRemark = ''
          this.snExecutor = ''
          this.snAssignee = ''
          this.newTask = false
          this.createTaskView = false
          this.snTask = false
          this.shenView = false
          // this.queryToDoTask()
          // this.queryCaseListList()
          if(this.messageType){
            auditTask({prjTaskId: this.shenheTaskId, result: 1 ,checkFlag: 0,remark: this.shenheremark}).then((res)=>{
              // this.postMessage()
              // this.queryToDoTask()
              // this.queryCaseListList()
              this.messageType = ''
            })
          }
        if(this.subMessageType == '13' || this.subMessageType == '15'){
          submitTask({prjTaskId: this.subTaskId, remark: this.subRemark,checkFlag: 0}).then(()=>{
            // this.postMessage()
            // this.$message.success('提交成功！')
            this.subTaskId = ''
            this.subRemark = ''
            this.subMessageType = ''
            // this.closeDialog()
            // this.queryToDoTask(1)
          })
        }
          this.$message.success('增加任务成功！')
          this.closeDialog()
          Bus.$emit('deleteSelect')
          // this.postMessage()
          this.queryCaseListList()
          // this.taskForm.createDate = ''
          this.bossUserId = ''
          this.hasBoss = false
          this.taskForm.prjTaskName = ''
          this.taskForm.prjTgName = ''
          this.taskForm.prjTgName = ''
          this.taskForm.checkItem = ''
          this.taskForm.executor = ''
          this.templateGroupTask = []
          this.taskForm.prjTaskName = ''
          this.taskForm.endDate = ''
          this.taskForm.prjTaskDesc = ''
          // this.templateGroupTask.length = 0
          this.taskForm.createTaskGroup = ''
          this.teptName = ''
          this.taskList = []
          this.end = false
        }).catch((res)=>{
          this.$message.error(res.message)
        })
      },
      clearData() {
        Bus.$emit('deleteSelect')
        this.snAssignee = ''
        this.snExecutor = ''
        this.bossUserId = ''
        this.hasBoss = false
        this.snTask = false
        // this.taskForm.createDate = ''
        this.bossUserId = ''
        this.hasBoss = false
        this.end = false
        this.newTask = false
        this.createTaskView = false
        this.snTask = false
        this.taskForm.prjTaskName = ''
        this.taskForm.prjTgName = ''
          if(this.messageType){
            if(this.messageType == '11' || this.messageType == '15'){
              return
            }else{
              auditTask({prjTaskId: this.shenheTaskId, result: 1 ,checkFlag: 0,remark: this.shenheremark}).then((res)=>{
              // this.postMessage()
                this.$message.success('审核成功！')
                this.queryCaseListList()
                this.closeDialog()
              this.messageType = ''
              // this.queryProjectTask()
            })
            }
        }
          if(this.subMessageType == '13'){
            submitTask({prjTaskId: this.subTaskId, remark: this.subRemark,checkFlag: 0}).then(()=>{
              // this.postMessage()
              this.messageType = ''
              this.$message.success('提交成功！')
              this.queryCaseListList()
              this.subTaskId = ''
              this.subRemark = ''
              this.subMessageType = ''
              // this.queryToDoTask(1)
              this.closeDialog()
            })
          }
          this.taskForm.prjTaskName = ''
          this.taskForm.prjTgName = ''
          this.taskForm.prjTgName = ''
          this.taskForm.checkItem = ''
          this.taskForm.executor = ''
          this.templateGroupTask = []
          this.taskForm.prjTaskName = ''
          this.taskForm.endDate = ''
          this.taskForm.prjTaskDesc = ''
          // this.templateGroupTask.length = 0
          this.taskForm.createTaskGroup = ''
          this.teptName = ''
          this.taskList = []
          this.end = false
        // this.taskDefineId = ''
          // this.taskForm.prjTaskName = ''
          // this.taskForm.prjTaskDesc = ''
          // this.templateGroupTask.length = 0
          // this.taskForm.createTaskGroup = ''
          // this.teptName = ''
          // this.taskList = []
          // this.taskForm.date = ''
        // this.taskForm.executor = ''
        // this.confirmDialog = false
      },
      timeCompare(v){
        // console.log(v,123)
        if(this.CompareDate(this.taskForm.beginDate, this.taskForm.endDate)){
          this.$message.error('开始日期不能大于截止日期!')
          // this.taskForm.beginDate = ''
          // this.taskForm.endDate = ''
          return
        }
      },
      changeHa(v){
        if(this.taskgroupList.find(i=>i.prjTgId == v)){
          return
        }else if(this.taskgroupList.find(i=>i.prjTgName == v)){
          return
        }
        else{
          addProjectTaskGroup({ caseId: this.doCaseId, prjTgName: v, tepId: this.teptId}).then((res)=>{
            let id = res.data.prjTgId
            queryProjectTask({caseId:this.doCaseId}).then((res)=>{

          this.taskgroupList = res.data

          this.taskgroupList.forEach((i,index)=>{
            this.activeNames.push(index)
          })
              this.taskgroupList = res.data
              // this.taskForm.createTaskGroup =this.taskgroupList.find(i=>i.prjTgId == id).prjTgId

          // this.agList = this.taskgroupList.map(i=>{
          //   if(i.teptId){
          //     if(i.taskList){
          //         i.taskList.forEach(j=>{
          //         j.teptId = i.teptId
          //       })
          //        return  i.taskList
          //     }else{
          //       return i
          //     }
          //   }
          //   else{
          //     if(i.taskList){
          //       i.taskList.forEach(j=>{
          //         j.teptId = i.teptId
          //       })
          //       return  i.taskList
          //     }else{
          //       return i
          //     }
          //   }
          //
          // })

              // return this.taskgroupList
        }).then((res)=>{
            this.taskForm.createTaskGroup =this.taskgroupList.find(i=>i.prjTgId == id).prjTgId
            })
            this.createGroupView = false
            this.groupForm.prjTgName = ''
            // this.taskForm.createTaskGroup = res.data.prjTgId
            // this.confirmDialog = false
          })
        }

      },
      newTaskGroup(o) {
        if(o=='onceCreate'){
          this.onceCreateGroup = false
        }
        addProjectTaskGroup({tgId: this.tgIdd, caseId: this.doCaseId, prjTgName: this.groupNames, tepId: this.teptId}).then((res)=>{
          // this.queryProjectTask()
          // queryTaskList({teptId: this.teptId,caseId: this.doCaseId}).then(res=>{
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
          //     this.taskTemplateView = false
          //   })
          queryProjectTask({caseId:this.doCaseId}).then((res)=>{

          this.taskgroupList = res.data
          // this.agList = this.taskgroupList.map(i=>{
          //   if(i.teptId){
          //     if(i.taskList){
          //         i.taskList.forEach(j=>{
          //         j.teptId = i.teptId
          //       })
          //        return  i.taskList
          //     }else{
          //       return i
          //     }
          //   }
          //   else{
          //     if(i.taskList){
          //       i.taskList.forEach(j=>{
          //         j.teptId = i.teptId
          //       })
          //       return  i.taskList
          //     }else{
          //       return i
          //     }
          //   }
          //
          // })
        })
          // this.taskgroupList = res.data
          this.createGroupView = false
          this.groupForm.prjTgName = ''
          // this.$message.success('新建任务组成功！')
          this.taskForm.createTaskGroup = res.data.prjTgId
          // this.confirmDialog = false
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
              // console.log(111)
              if(this.taskgroupList.find(item=>item.prjTgName == this.groupNames)){
                // console.log(222)
                this.taskForm.createTaskGroup = this.taskgroupList.find(item=>item.prjTgName == this.groupNames).prjTgId
              }else{
                // console.log(333)
                if(this.onceCreateGroup){
                  // console.log(444)
                  this.newTaskGroup('onceCreate')
                  // this.confirmDialog = true
                }
              //  任务组中没有选中任务模板的任务组
              }
            }else{
            //  该案件任务组中没有模板选中的任务组，是否新建任务组
            //   console.log(555)
              if(this.onceCreateGroup){
                // console.log(666)
                this.newTaskGroup('onceCreate')
                  // this.confirmDialog = true
                }
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

          // prjTaskCheckList.filter(item=>item.length>0).forEach(i=>{
          //   this.taskForm.checkItem += i.itemName
          // })
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
      noTemplate(){
        Bus.$emit('deleteSelect')
        this.taskTemplateView = false
        this.teptName = ''
        this.groupForm.prjTgName = ''
        this.onceCreateGroup = true
      },
      shenhe(arr){
        this.auditTask(arr[0],arr[1])
      },
      shenpiOk(){
        this.queryCaseListList()
        this.closeDialog()
      },
      shenqingOk(){
        this.queryCaseListList()
        this.closeDialog()
      },
      auditTask(item, e) {
        this.groupForm.caseId = item.caseId
        this.caseData = item.caseId
        // this.taskId = item.taskId
        // queryProjectTask({caseId: item.caseId}).then(res=>{
        //   console.log(res.data)
        //   console.log(res.data.find(item=>item.teptId))
        //         })
         this.shenheremark = ''
         if(item.remark){
           // this.shenheremark = item.remark
         }
         if(item.workType){
           auditTask({prjTaskId: item.prjTaskId, result: e ,remark: item.shenheremark}).then(()=>{
             // this.postMessage()
             // this.queryToDoTask()
             this.closeDialog()
             this.$message.success('审核成功！')
             this.queryCaseListList()
           })
           return
         }
        if(e==1&&!item.workType){
          auditTask({prjTaskId: item.prjTaskId, result: 1,remark: item.shenheremark}).then((res)=>{
            // this.queryToDoTask(1)
            if(res.messageType == 13){
              this.messageType = 13
              this.$confirm(`${res.message}？`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                distinguishCancelAndClose: true,
                type: "warning"
              }).then(()=>{
                this.newTask = true
                this.queryPrjTask(item,'create')
                this.createTaskView = true
              }).catch((action)=>{
                if(action=='cancel'){
                  auditTask({prjTaskId: item.prjTaskId, result: 1 ,checkFlag: 0,remark: item.shenheremark}).then(()=>{
                    this.messageType = ''
                    this.$message.success('审核成功！')
                    this.closeDialog()
                    this.queryCaseListList()
                  })
                }

              })
            }
            if(res.messageType == 12){
              this.messageType = 12
              this.$confirm("当前案件没有待处理的任务，是否需要创建一个任务？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                distinguishCancelAndClose: true,
                type: "warning"
              }).then(()=>{
                // this.queryToDoTask(1)

                this.newTask = true
                // this.queryProjectTask()
                this.queryPrjTask(item,'create')
                this.createTaskView = true
              }).catch((action)=>{
                if(action=='cancel'){
                  auditTask({prjTaskId: item.prjTaskId, result: 1 ,checkFlag: 0,remark: item.shenheremark}).then(()=>{
                    this.messageType = ''
                    this.$message.success('审核成功！')
                    // this.queryToDoTask(1)
                    this.closeDialog()
                    this.queryCaseListList()
                  })
                }

              })
            }
            if(res.messageType == 11){
              this.messageType = 11
              // this.$message.error(res.message)
              this.queryPrjTask(item,'create')

              this.end = false
              this.$confirm(`${res.message}？`, "提示", {
                confirmButtonText: "新建任务",
                cancelButtonText: "整理案卷",
                distinguishCancelAndClose: true,
                type: "warning"
              })
                .then(()=>{
                  // alert('新建任务')
                  this.createTaskView = true
                })
                .catch((action)=>{
                  // alert('整理案卷')
                  if(action == 'cancel'){
                    this.end = true
                    this.taskForm.prjTaskName = '整理案卷'
                    this.taskForm.prjTgName = '整理案卷'
                    // this.changeHa('整理案卷')
                    this.createTaskView = true
                  }
                })
            }
            if(res.messageType == 15){
              this.messageType = 15
              this.bossUserId = res.data.bossUserId
              // this.$message.error(res.message)
              this.queryPrjTask(item,'create')
              this.end = false
              this.$confirm(`${res.message}？`, "提示", {
                confirmButtonText: "新建任务",
                cancelButtonText: "返回客户组组长分配任务",
                distinguishCancelAndClose: true,
                type: "warning"
              })
                .then(()=>{
                  // alert('新建任务')
                  this.bossUserId = ''
                  this.taskForm.executor = ''
                  this.hasBoss = false
                  this.createTaskView = true
                })
                .catch((action)=>{
                  // alert('整理案卷')
                  if(action == 'cancel'){
                    this.end = true
                    this.hasBoss = true
                    this.taskForm.prjTaskName = '返回客户组组长分配任务'
                    this.taskForm.prjTgName = '返回客户组组长分配任务'
                    // this.changeHa('整理案卷')
                    // alert(this.$commonUtils.getDay(1,'-'))
                    this.taskForm.endDate = this.$commonUtils.getDay(1,'-')
                    this.taskForm.executor = this.bossUserId
                    this.createTaskView = true
                  }
                })
            }
            if(!res.messageType){
              // this.postMessage()
              this.$message.success('审核成功！')
              // this.queryToDoTask(1)
              this.queryCaseListList()
            }
          })
        }
        if(e==2){
          auditTask({prjTaskId: item.prjTaskId, result: 2, executor: item.executor,remark: item.shenheremark,endDate: item.shenheEndDate}).then(()=>{
            // this.choosePeople = false
            // this.postMessage()
            this.closeDialog()
            this.$message.success('审核成功！')
            this.queryCaseListList()
            this.messageType = ''
            // this.queryToDoTask(1)
            this.closeDialog()
          })

        }
      },
      auditTaskNo() {
          auditTask({prjTaskId: this.shenheTaskId, result: 2, executor: this.executor,remark: this.shenheremark,endDate: this.shenheEndDate}).then(()=>{
            this.choosePeople = false
            // this.postMessage()
            this.$message.success('审核成功！')
            this.queryCaseListList()
            this.messageType = ''
            // this.queryToDoTask(1)
            this.closeDialog()
          })

      },
      assginTask() {
        // return;
        let data = this.assignData
        if(!this.choseExecutor){
          this.$message.error('请选择执行人')
          return
        }
        if(!this.choseEndDate){
          this.$message.error('请填写截止时间')
          return;
        }
        if(this.CompareDate(this.startDate,this.choseEndDate)){
          this.$message.error(`截止日期不能早于开始日期:${this.startDate}`)
          return;
        }
        if(this.CompareDate(this.choseEndDate,this.choseEndDate1)){
          this.$message.error('超出当前截止时间')
          return;
        }
        assginTask({prjTaskId:data.prjTaskId, executor: this.choseExecutor, endDate: this.choseEndDate}).then(()=>{
          // modifyProjectTask(data).then(()=>{
          //   this.queryProjectTask()
          //   this.selected = ''
          //   this.$message.success('修改成功！')
          //
          // }).catch(()=>{
          //   this.$message.error('修改失败！')
          // })
          this.$message.success('任务分配成功!')
          this.queryCaseListList()
          // this.queryToDoTask()
          // this.postMessage()
          // this.queryProjectTask()
          this.choseExecutor = ''
          this.excutorView = false
        })

      },
      CompareDate(d1,d2){
        return ((new Date(d1.replace(/-/g,"\/"))) > (new Date(d2.replace(/-/g,"\/"))));
      },
      add0(m){
         return m<10?'0'+m:m
       },
      format(shijianchuo) {
        //shijianchuo是整数，否则要parseInt转换
        var time = new Date(shijianchuo);
        var y = time.getFullYear();
        var m = time.getMonth()+1;
        var d = time.getDate();
        // var h = time.getHours();
        // var mm = time.getMinutes();
        // var s = time.getSeconds();
        return y+'-'+this.add0(m)+'-'+this.add0(d)
      },
      // queryPeopleList(data) {
      //   // console.log('+++++++++++++++')
      //   // console.log(data)
      //   // console.log('+++++++++++++++')
      //   queryTaskUserList({caseId: this.doCaseId}).then(res=>{
      //     this.peopleList = res.data
      //   })
      // },
      taskHandle(arr){
        this.doCaseId = arr[1].caseId || ''
        if(!arr[1].workType && !arr[1].caseId) {
          this.editTaskView = false
          this.projectSign = true
          this.detailPrjTaskId = arr[1].prjTaskId
        }else{
          this.editTaskView = true
          this.projectSign = false
        }
        // this.queryPeopleList()
        switch(arr[0]) {
          case '修改':
            // this.editTaskView = true
           // this.edtiTasksData = arr[1]
           // this.getTaskData(arr[1].caseId, arr[1])
           //  this.editTaskView = true
            this.shenView = false
            this.title = '修改'
            this.taskDataCaseId = arr[1].caseId || ''
            this.editTaskId = arr[1].taskId
            this.queryPrjTask(arr[1],'edit')
            break;
          case '删除':
           this.editTaskView = false
           this.edtiTasksData = arr[1]
           this.$confirm('此操作将永久删除该任务, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(()=>{
              deleteProjectTask({prjTaskId:this.edtiTasksData.taskId}).then(()=>{
                  this.$message.success('删除成功')
                  this.queryCaseListList()
                })
              })
            break;
          case '审核':
           // this.editTaskView = true
           // this.edtiTasksData = arr[1]
            this.dialogName = '审核'
            this.title = '审核'
            this.taskInfo = JSON.parse(JSON.stringify(arr[1]))
            // this.shenView = true
            // this.editTaskView = true
            // this.doCaseId = arr[1].caseId || ''
            this.shenheTaskId = arr[1].taskId
            this.queryPrjTask(arr[1],'edit')
           // this.getTaskData(arr[1].caseId, arr[1])
            break;
          case '分配':
            this.dialogName = '分配'
            this.title = '分配'
            // this.editTaskView = true
            this.taskInfo = JSON.parse(JSON.stringify(arr[1]))
            // this.shenView = true
            // this.doCaseId = arr[1].caseId || ''
            this.shenheTaskId = arr[1].taskId
            this.queryPrjTask(arr[1],'edit')
            break;
          case '提交':
           // this.editTaskView = true
           // this.edtiTasksData = arr[1]
           // this.getTaskData(arr[1].caseId, arr[1])
            this.dialogName = '提交'
            this.title = '提交'
            // this.editTaskView = true
            this.taskInfo = JSON.parse(JSON.stringify(arr[1]))
            // this.shenView = true
            // this.doCaseId = arr[1].caseId || ''
            this.shenheTaskId = arr[1].taskId
            this.queryPrjTask(arr[1],'edit')
            break;
          case '申请延期':
           // this.editTaskView = true
           // this.edtiTasksData = arr[1]
           // this.getTaskData(arr[1].caseId, arr[1])
            this.dialogName = '申请延期'
            this.title = '申请延期'
            this.taskInfo = JSON.parse(JSON.stringify(arr[1]))
            // this.shenView = true
            // this.editTaskView = true
            // this.doCaseId = arr[1].caseId || ''
            this.shenheTaskId = arr[1].taskId
            this.queryPrjTask(arr[1],'edit')
            break;
          case '审批延期':
            this.dialogName = '审批延期'
            this.title = '审批延期'
            this.taskInfo = JSON.parse(JSON.stringify(arr[1]))
            // this.editTaskView = true
            // this.shenView = true
            // this.doCaseId = arr[1].caseId || ''
            this.shenheTaskId = arr[1].taskId
            this.queryPrjTask(arr[1],'edit')
            break;
         default:
           break;
        }
      },
      updateData(a,data){
        if(a&&a!='add'&&a!='delete'){
          queryProjectTask({caseId:a}).then(res=>{
          this.taskgroupList = res.data.filter(item=>!!item)
          let agList = this.taskgroupList.map(i=>{
            if(i.teptId){
              if(i.taskList){
                i.taskList.forEach(j=>{
                  if(i.prjTgId){
                    j.prjTgId = i.prjTgId
                  }
                  // j.teptId = i.teptId
                })
                return i.taskList
              }else{
                return i
              }
            }else{
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
            this.taskInfo = this.deepFlatten(agList).find(i=>i.prjTaskId == this.shenheTaskId )
            this.taskInfo.createTaskGroup = this.taskInfo.prjTgId
            if(data){
              this.taskInfo.assignee = data.assignee
              this.taskInfo.executor = data.executor
              this.taskInfo.appUserId = data.appUserId
              // console.log(this.edtiTasksData,222)
            }
            // if(this.editTaskView){
            //     let arr = []
            //   if(this.edtiTasksData.itemList&&this.edtiTasksData.itemList.length>0){
            //     this.edtiTasksData.itemList.forEach((i, index)=>{
            //       arr.push(index+1+'.'+i.prjIemName)
            //     })
            //     this.edtiTasksData.itemList = arr.join('\n')
            //   }
            // }
          let arr = []
        if(this.taskInfo.itemList&&this.taskInfo.itemList.length>0){
          this.taskInfo.itemList.forEach((i, index)=>{
            arr.push(i.prjIemName)
          })
          this.taskInfo.itemList = arr
        }

          // let arr = this.deepFlatten(agList)
        })
        }
        if(!a){
          queryProjectTask({prjTaskId: data.taskId}).then(res=>{
              this.taskInfo = res.data[0].taskList[0]
              this.taskInfo.workType = data.workType
              this.taskInfo.assignee = data.assignee
              this.taskInfo.executor = data.executor
              this.taskInfo.appUserId = data.appUserId
              let arr = []
              if(this.taskInfo.itemList&&this.taskInfo.itemList.length>0){
                this.taskInfo.itemList.forEach((i, index)=>{
                  arr.push(i.prjIemName)
                })
                this.taskInfo.itemList = arr
              }
            })
          // this.edtiTasksData = JSON.parse(JSON.stringify(data))
        }

        // if(a == 'delete' || a == 'add'){
        //     if(!this.copyTemplFileView){
        //       this.edtiTasksData.fileList = this.deepFlatten(this.agList).find(item=>item.prjTaskId == this.prjTaskId).fileList
        //     }
        //   }
      },
      queryPrjTask(data,f){
        queryTaskById({prjTaskId:data.prjTaskId}).then(res=>{
          if(res.data.teptId) {
            this.teptId = res.data.teptId
            this.teptName = res.data.teptName
          }
          let projectId = res.data.projectId
          this.$set(this.edtiTasksData,'projectId',res.data.projectId)
          res.data.workType ? this.workSign = true : this.workSign = false
          // if(!res.data.workType && !data.caseId){
          //   this.projectSign = true
          //   this.workSign = false
          // }else{
          //   this.projectSign = false
          // }
          this.edtiTasksData = res.data
          this.edtiTasksData.createTaskGroup = this.edtiTasksData.prjTgId
          let arr = []
          if(this.edtiTasksData.itemList&&this.edtiTasksData.itemList.length>0){
            this.edtiTasksData.itemList.forEach((i, index)=>{
              arr.push(i.prjIemName)
            })
            this.edtiTasksData.itemList = arr.join('\n')
          }
          data.caseId&&queryProjectTask({caseId:data.caseId}).then(res=>{
            this.taskgroupList = res.data.filter(item=>!!item)
            this.editTaskgroupList = this.taskgroupList
          })
          this.teptId && f != 'create' && (queryTaskList({teptId: this.teptId,prjTaskId:data.prjTaskId}).then(res=>{
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
            f=='edit' ? this.editGroupTask = this.templateGroupTask : this.editGroupTask = []
          }))
          f == 'create' && (queryProjecTeptId({projectId}).then(res=>{
            if(res.data.teptId){
              this.teptId = res.data.teptId
              this.teptName = res.data.teptName
              queryTaskList({teptId: this.teptId,prjTaskId:data.prjTaskId}).then(res=>{
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
                f=='edit' ? this.editGroupTask = this.templateGroupTask : this.editGroupTask = []
              })
            }else{
              this.teptId = ''
              this.teptName = ''
              this.templateGroupTask = []
            }

          }))
        })
      },
      editTaskViewClos(f){
        this.editTaskView = false
        this.workSign = false
        this.teptId = ''
        this.teptName = ''
        // this.edtiTasksData = {}
        this.taskDataCaseId = ''
        this.editTaskgroupList = []
        this.editGroupTask = []
        if(f == '修改成功'){
          this.queryCaseListList()
        }
      },
      submitTask(arr) {
        // return
        if(arr[1] == 1){
          // submitTask({prjTaskId: arr[0].prjTaskId,remark: arr[0].remark}).then(()=>{
          //   this.$message.success('任务提交成功！')
          //   this.closeDialog()
          //   this.queryCaseListList()
          //   // this.postMessage()
          //   // this.queryToDoTask()
          // })
          this.subTaskId = arr[0].prjTaskId
          this.subRemark = arr[0].remark
          submitTask({prjTaskId: arr[0].prjTaskId,remark: arr[0].remark}).then((res)=>{
            if(!res.messageType){
              this.$message.success('提交成功！')
              this.subTaskId = ''
              this.subRemark = ''
              this.closeDialog()
              this.queryCaseListList()
              // this.postMessage()
              // this.queryToDoTask()
            }
            if(res.messageType == 11){
              this.subMessageType = 11
              // this.$message.error(res.message)
              this.queryPrjTask(arr[0],'create')
              this.end = false
              this.$confirm(`${res.message}？`, "提示", {
                confirmButtonText: "新建任务",
                cancelButtonText: "整理案卷",
                distinguishCancelAndClose: true,
                type: "warning"
              })
                .then(()=>{
                  // alert('新建任务')
                  this.createTaskView = true
                })
                .catch((action)=>{
                  // alert('整理案卷')
                  if(action == 'cancel'){
                    this.end = true
                    this.taskForm.prjTaskName = '整理案卷'
                    this.taskForm.prjTgName = '整理案卷'
                    // this.changeHa('整理案卷')
                    this.createTaskView = true
                  }
                })
            }
            if(res.messageType == 15){
              // this.messageType = 15
              this.subMessageType = 15
              this.bossUserId = res.data.bossUserId
              // this.$message.error(res.message)
              this.queryPrjTask(arr[0],'create')
              this.end = false
              this.$confirm(`${res.message}？`, "提示", {
                confirmButtonText: "新建任务",
                cancelButtonText: "返回客户组组长分配任务",
                distinguishCancelAndClose: true,
                type: "warning"
              })
                .then(()=>{
                  // alert('新建任务')
                  this.bossUserId = ''
                  this.taskForm.executor = ''
                  this.taskForm.prjTaskName = ''
                  this.hasBoss = false
                  this.createTaskView = true
                })
                .catch((action)=>{
                  // alert('整理案卷')
                  if(action == 'cancel'){
                    this.end = true
                    this.hasBoss = true
                    this.taskForm.prjTaskName = '返回客户组组长分配任务'
                    this.taskForm.prjTgName = '返回客户组组长分配任务'
                    // this.changeHa('整理案卷')
                    this.taskForm.endDate = this.$commonUtils.getDay(1,'-')
                    this.taskForm.executor = this.bossUserId
                    this.createTaskView = true
                  }
                })
            }
            if(res.messageType == 13){
              this.subMessageType = 13
              this.$confirm(`${res.message}？`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                distinguishCancelAndClose: true,
                type: "warning"
              }).then(()=>{
                this.newTask = true
                this.queryPrjTask(arr[0],'create')
                this.createTaskView = true
              }).catch((action)=>{
                if(action=='cancel'){
                  submitTask({prjTaskId: arr[0].prjTaskId, remark: arr[0].remark,checkFlag: 0}).then(()=>{
                    // this.postMessage()
                    // this.closeDialog()
                    this.subMessageType = ''
                    this.$message.success('提交成功！')
                    this.closeDialog()
                    this.subTaskId = ''
                    this.subRemark = ''
                    // this.queryToDoTask(1)
                    this.queryCaseListList()
                  })
                }

              })
            }

          })
        }
        if(arr[1] == 2){
            this.snPrjTaskId = arr[0].prjTaskId
            this.snRemark = arr[0].remark
            this.snAssignee = arr[0].assignee
            this.snExecutor = arr[0].executor
            this.taskForm.executor = arr[0].executor
          if(arr[0].workType){
            this.snTask = true
            this.snPrjTaskId = arr[0].prjTaskId
            this.snRemark = arr[0].remark
            this.snAssignee = arr[0].assignee
            this.snExecutor = arr[0].executor
            this.taskForm.executor = arr[0].executor
            // console.log(arr[0],999)
            // console.log(this.snExecutor,777)
            this.handleCommand()
          }else{
            this.teptId = ''
            this.teptName = ''
            this.templateGroupTask = []
            this.snTask = true
            this.createTaskView = true
            this.newTask = true
              queryProjecTeptId({projectId:arr[0].projectId}).then(res=>{
              if(res.data.teptId) {
                this.teptId = res.data.teptId
                this.teptName = res.data.teptName
                queryTaskList({teptId: this.teptId,caseId: arr[0].caseId}).then(res=>{
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
                })
              }

            }).catch(()=>{

              })
          }
        }
      },
      taskData(data){
        if(!data.workType && !data.caseId) {
          this.editTaskView = false
          this.projectSign = true
          this.detailPrjTaskId = data.prjTaskId
        }else{
          this.editTaskView = true
          this.projectSign = false
        }
        this.shenView =false
        this.title = '查看'
        this.editTaskId = data.taskId
        this.queryPrjTask(data,'edit')
        // this.dialogName = '查看'
        // this.taskInfo = data
        // this.getTaskData(this.doCaseId,this.taskInfo)
      },
      deepFlatten(arr) {
        let flatten = (arr)=> [].concat(...arr);
        return flatten(arr.map(x=>Array.isArray(x)? this.deepFlatten(x): x));
      },
      getTaskData(caseId,data){
        if(caseId){
          queryProjectTask({caseId}).then(res=>{
          this.taskgroupList = res.data.filter(item=>!!item)
          let agList = this.taskgroupList.map(i=>{
            if(i.teptId){
              if(i.taskList){
                i.taskList.forEach(j=>{
                  if(i.prjTgId){
                    j.prjTgId = i.prjTgId
                  }
                  // j.teptId = i.teptId
                })
                return i.taskList
              }else{
                return i
              }
            }else{
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
          this.taskInfo = this.deepFlatten(agList).find(i=>i.prjTaskId == this.taskId )
            // this.taskInfo.createTaskGroup = this.taskInfo.prjTgId
            if(data){
              this.taskInfo.assignee = data.assignee
              this.taskInfo.executor = data.executor
              this.taskInfo.appUserId = data.appUserId
            }
          let arr = []
        if(this.taskInfo.itemList&&this.taskInfo.itemList.length>0){
          this.taskInfo.itemList.forEach((i, index)=>{
            arr.push(i.prjIemName)
          })
          this.taskInfo.itemList = arr
        }
        })
        }
        if(!caseId){
          queryProjectTask({prjTaskId: data.taskId}).then(res=>{
              this.taskInfo = res.data[0].taskList[0]
              this.taskInfo.workType = data.workType
              this.taskInfo.assignee = data.assignee
              this.taskInfo.executor = data.executor
              this.taskInfo.appUserId = data.appUserId
              let arr = []
              if(this.taskInfo.itemList&&this.taskInfo.itemList.length>0){
                this.taskInfo.itemList.forEach((i, index)=>{
                  arr.push(i.prjIemName)
                })
                this.taskInfo.itemList = arr
              }
            })
        }
      },
      closeDialog(f){
        if(this.snTask){

        }else{
          // this.$refs.edit.modifyProjectTask('parent')
          this.editTaskView = false
          this.projectSign = false
           this.taskInfo = {}
        }

      },
      changeView(){
        this.state=!this.state
        // this.queryCaseListList(this.state)
      },
      getAppTitleList(filterName, valueList0) {
        if (filterName === "申请人") {
          return {
            id: "-1",
            value: "申请人中文名称",
            value1: "申请人英文名称",
            value2: "申请人中文地址",
            value3: "申请人英文地址",
            // disabled:true
          };
        }
        if (filterName === "被申请人") {
          return {
            id: "-1",
            value: "中文名称",
            value1: "英文名称",
            value2: "中文地址",
            value3: "英文地址"
          };
        }
        if (filterName === "转让人") {
          return {
            id: "-1",
            value: "转让人中文名称",
            value1: "转让人英文名称",
            value2: "转让人中文地址",
            value3: "转让人英文地址"
          };

        }
        if (filterName === "客户") {
          return {
            id: "-1",
            value: "简称",
            value1: "国籍",
            value2: "全称",
          };

        }
        return valueList0;
      },
      clearCaseInfo(){
        this.createCaseId = ''
        this.createTask = '2'
        this.checkCase = false
        this.agentVisible = false
        this.agentCaseLists = []
      },
      onlyCase(v){
        this.workType = ''
      },
      workClick() {
        queryWorkType().then(res=>{
          this.workKinds = res.data
        })
      },
      keyCodeForEvent() {
        let self = this
        let code = 0
        let code2 = 0
        document.onkeydown = function(e) {
          let evn = e || event
          let key = evn.keyCode || evn.which || evn.charCode
          if (key === 17) {
            code = 1
          }
          if (key === 81) {
            code2 = 1
          }
          if (code === 1 && code2 === 1) {
            self.handleCommand()
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
      queryCase(item){
        this.agentVisible = false
        if(item.agentNum == '案件文号'){
          // this.caseInfo = ''
        }else{
          this.caseInfo = item.agentNum
          this.createCaseId = item.caseId
          this.createTask = '1'
          this.checkCase = true
          queryProjectTask({caseId:this.createCaseId}).then(res=> {
            if (res.data.find(i => i.teptId)) {
              this.teptId = res.data.find(i => i.teptId).teptId
            }
          })
        }

      },
      queryCaseList(v,f){
        if(!v.target.value){
          return
        }
        let keyWord = v.target.value
        if(f == 'agent'){
          this.agentVisible = true
          getCaseHistory({
            businessList: [3,4,5,6,11,23],
            pageNo: 1,
            pageSize: 100,
            keyWord,
            delCaseTypeIdList: [94]
          }).then((res)=>{
            if(res.data&&res.data.length == 1){
              this.createCaseId = res.data[0].caseId
              this.createTask = '1'
              this.checkCase = true
              // queryProjectTask({caseId:this.createCaseId}).then(res=> {
              //    this.newTaskGroupList = res.data
              //   // if (res.data.find(i => i.teptId)) {
              //   //   this.teptId = res.data.find(i => i.teptId).teptId
              //   // }
              // })
            }else{
              // this.hasTemplate = false
              // this.checkCase = false
              // this.createTask = '2'
            }
            this.agentCaseLists = res.data
            this.agentCaseLists.unshift({'agentNum': '案件文号','caseName': '案件名称','custName': '客户'})
          })
        }else{
          // this.visible = true
          // getCaseHistory({
          //   businessList: [3,4,5,6,11,23],
          //   pageNo: 1,
          //   pageSize: 100,
          //   keyWord
          // }).then((res)=>{
          //   if(res.data&&res.data.length == 1){
          //     this.handTime.agentNum = res.data[0].agentNum
          //     this.handTime.caseName = res.data[0].caseName
          //     this.handTime.custName = res.data[0].custName||item.name
          //     this.handTime.caseId = res.data[0].caseId
          //     this.checkCase = true
          //   }else{
          //     this.checkCase = false
          //   }
          //   this.nameCaseLists = res.data
          //   this.nameCaseLists.unshift({'agentNum': '案件文号','caseName': '案件名称','custName': '客户'})
          // })
        }




      },
      // queryCaseList(queryString, cb) {
      //   // return
      //   if(!queryString){
      //
      //   }else{
      //     let keyWord = queryString
      //     getCaseHistory({
      //       businessList: [3,4,5,6,11,23],
      //       pageNo: 1,
      //       pageSize: 100,
      //       keyWord,
      //       delCaseTypeIdList: [94]
      //     }).then(res=>{
      //       if(res.data&&res.data.length == 1){
      //         this.createCaseId = res.data[0].caseId
      //         this.createTask = '1'
      //         this.checkCase = true
      //         queryProjectTask({caseId:this.createCaseId}).then(res=> {
      //           if (res.data.find(i => i.teptId)) {
      //             this.hasTemplate = true
      //             this.teptId = res.data.find(i => i.teptId).teptId
      //           }
      //         })
      //       }else{
      //         this.hasTemplate = false
      //         this.checkCase = false
      //         this.createTask = '2'
      //       }
      //       res.data.unshift({'agentNum': '案件文号','caseName': '案件名称'})
      //       cb(res.data)
      //     })
      //   }
      //
      // },
      closeView(v) {
        if(v != '取消'){
          // this.queryToDoTask()
        }
        if(v == '成功'){
          // this.caseInfo = ''
          // this.workType = ''
          // this.createCaseId = ''
          this.queryCaseListList()
          this.shenView = false
          this.editTaskView = false
        }
          this.caseInfo = ''
          this.workType = ''
          this.createCaseId = ''
          this.createView = false
          this.createTask = '2'
          this.checkCase = false

      },
      handleCommand(value, n) {
        // if(n==1){
        //   this.firstGroup = true
        // }
        this.waitDo++
        this.teptName = ''
        // this.caseInfo = ''
          this.createView = true
        // this.teptId
      },
      // getUser(){
      //   getUser().then(res=>{
      //     this.userList=res.data
      //   })
      // },
      queryCaseListList(e){
        if(this.editTaskView && this.edtiTasksData.prjTaskId){
          queryTaskById({prjTaskId:this.edtiTasksData.prjTaskId}).then(res=> {
            this.edtiTasksData = res.data
            this.edtiTasksData.createTaskGroup = res.data.prjTgId
          })
        }
        for (var key in this.queryModuleData) {
          // if (Object.prototype.toString.call(this.queryModuleData[key]).includes("Date")) {
          //   this.queryModuleData[key] = this.formatDate(this.queryModuleData[key]);
          // }
          if(this.queryModuleData[key]===null){
            delete this.queryModuleData[key]
          }
        }
        const querData=JSON.parse(JSON.stringify(this.queryModuleData))

        if(this.operationState){
          for (var key in querData) {
            if(!['business', 'pageNo', 'pageSize','shortcuts','isTmfileIdOrder'].includes(key)){
              if(!['userIdList','endDateArray'].includes(key)){
                delete querData[key]
              }
            }
          }
        } else {
          for (var key in querData) {
            if(!['business', 'pageNo', 'pageSize','shortcuts','isTmfileIdOrder'].includes(key)){
              if(['userIdList','endDateArray'].includes(key)||![...this.conditionsModuleList.map(item=>item.property),...['agentNumStart', 'agentNumEnd', 'goodClasses', 'regNumber',  'tmName']].includes(key)){
                if(key=='endDateArray'){
                  this.queryModuleData.endDateArray=[]//'7'
                }
                if(key=='userIdList'){
                  this.queryModuleData.userIdList=[]//'7'
                }
                delete querData[key]
              }
            }
          }
        }
        if(this.checked){
          querData.taskView=0
        }else {
          querData.taskView=1
        }
        if(this.watch){
          querData.watch = 1
        }else{
          querData.watch = 0
        }
        if(this.departmentSelection){
          querData.taskFanWei=1
        }else {
         delete querData.taskFanWei
        }
        localStorage.setItem('rwChecked',this.checked)
        // if(this.state===false){
        //   querData.taskView=1
        //
        //
        // }
        // if(this.state===true) {
        //   querData.taskView=0
        // }
        this.$refs.resourceList.queryUsersTaskList(Object.assign(querData,this.listQuery))
      },
      handleSearch(flag){
        this.listQuery.pageNo=1
        this.operationState=flag
        this.drawerState=false
        this.queryCaseListList()
      },
      clearSearch() {
        for (var key in this.queryModuleData) {
          if(key.includes('Date')){
            this.$set(this.queryModuleData,key,['',''])
          } else if(key.includes('Array')||key.includes('List')) {
            this.$set(this.queryModuleData,key,[])
          }else if(key==='caseTypeIds'||key==='deptGroupIds'){
            this.$set(this.queryModuleData,key,[])
          }else{
            this.$set(this.queryModuleData,key,null)
          }
        }
      },
      queryFilter() {
        this.transferVisible = true;
        const data = {
          bussId: this.bussId
        };
        queryFilter(data).then(res => {
          this.transferData = this.generateData(res.data);
        });
      },
      generateData(arr) {
        arr.forEach(item => {
          item.key = item.filterId;
          item.label = item.filterName;
        });
        return arr;
      },
      configFilter() {
        const data = {
          bussId: this.bussId,
          filterIds: this.transferValue.join(",")
        };
        configFilter(data).then(res => {
          this.queryFilterConfig();
        });
      },
      queryFilterConfig(type) {
        const data = {
          bussId: this.bussId
        };
        this.conditionsModuleList=[]
        queryFilterConfig(data).then(res => {
          this.transferVisible = false;
          this.$nextTick(()=>{
            this.conditionsModuleList = res.data;
            let keyList=res.data.map(item=>item.property)
            for (var key in this.queryModuleData) {
              if(!['userIdList','endDateArray'].includes(key)){
                if(!keyList.includes(key)){
                  if(key.includes('Date')){
                    this.$set(this.queryModuleData,key,['',''])
                  } else if(key.includes('Array')||key.includes('List')) {
                    this.$set(this.queryModuleData,key,[])
                  }else{
                    this.$set(this.queryModuleData,key,null)
                  }
                }
              }
            }

            if(type==1){
              this.handleSearch(1)
            }
            this.transferValue = res.data.map(item => item.filterId);
            if (this.$route.query.custId) {
              if (!this.transferValue.find(item => item == 58)) {
                this.$set(this.transferValue, this.transferValue.length - 1, 58);
                this.configFilter();
              } else {
                this.remoteMethod(
                  this.$route.query.name,
                  this.transferValue.indexOf(58),
                  "",
                  "客户"
                );
              }
              this.operationState=0
              this.clearSearch()
              this.$set(this.queryModuleData,'custIdArray',[Number(this.$route.query.custId)])
            } else {
              res.data.forEach(item => {
                if (item.filterType.includes("Many")) {
                  if(this.queryModuleData[item.property]){
                    if(item.filterType.includes('Many')){
                      if(["被申请人", "转让人"].includes(item.filterName)){
                        // queryAllUrl({ appId:this.queryModuleData[item.property]}).then(res=>{
                        //   this.$set(item,'valueList', res.data.map(i => ({
                        //     id: i.applicantName,
                        //     value: i.applicantName,
                        //     value1: i.applicantEnName,
                        //     value2: i.applicantAddress,
                        //     value3: i.applicantEnAddress
                        //   })))
                        // })
                      }else if(item.filterName=='申请人' ){
                        // console.log(this.queryModuleData[item.property]);
                        // Promise.all( this.queryModuleData[item.property].map(itm=>queryAllUrl({appId:itm}))).then(res=>{
                        //   this.$set(item,'valueList', this.$commonUtils.getLanglist(res.map(i=>i.data)).map(i => ({
                        //     id: i.applicantName,
                        //     value: i.applicantName,
                        //     value1: i.applicantEnName,
                        //     value2: i.applicantAddress,
                        //     value3: i.applicantEnAddress
                        //   })))
                        //   // this.$set(item,'valueList', this.$commonUtils.getLanglist(res.map(i=>i.data)).map(i => ({ id: i.custId, value: i.name })))
                        // })
                      } else if(item.filterName=='客户'){
                        if(this.queryModuleData[item.property].length){
                          queryCustomerNameId({custIdArray: this.queryModuleData[item.property]}).then(res=>{
                            this.$set(item,'valueList', res.data.map(i => ({ id: i.custId, value:`${i.name}-${i.country?i.country:''}-${i.fullname}` })))
                          })
                        }
                      } else {
                        item.valueList = item.values.filter(i=>i.id==this.queryModuleData[item.property])
                      }
                      // if(item.property.includes('Array')){
                      //   //this.queryModuleData[item.property]=this.queryModuleData[item.property].map(itm=>Number(itm))
                      // }else {
                      //  // this.queryModuleData[item.property]=Number(this.queryModuleData[item.property])
                      // }
                    }
                  } else {
                    item.valueList=[]
                  }
                }
                if (item.filterType.includes("checkbox")) {
                  if(this.queryModuleData[item.property]&&this.queryModuleData[item.property].length){
                    this.$set(this.queryModuleData, item.property, this.queryModuleData[item.property]);
                  }else {
                    this.$set(this.queryModuleData, item.property, []);
                  }
                }
              });
            }
          });
        })
      },
      async updateToPage(page){
        if(page){
          this.chartFlag=false
          await this.$nextTick()
          this.$set(this.option.calendar.range,0,`${page.year}-${page.month}`)
          this.$set(this.option.series,0,{
            tooltip:{ show : false},
            id: 'label',
            type: 'scatter',
            coordinateSystem: 'calendar',
            symbolSize: 1,
            label: {
              normal: {
                show: true,
                formatter: function (params) {
                  return params.value[0].slice(-2)
                },
                offset: [-this.cellSize[0] / 2 + 10, -this.cellSize[1] / 2 + 10],
                textStyle: {
                  color: '#000',
                  fontSize: 14
                }
              },
            },data:this.getVirtulData(page)})
          this.$set(this.option.series,1,{
            label:{show: false} ,
            type: 'heatmap',
            coordinateSystem: 'calendar',
            data:this.getVirtulData(page),
            tooltip:{ show : false}
          })
          var executorNameList=[...new Set(this.dataList.map(itm=>itm.executorName))]
          this.$set(this.option.legend,'data',executorNameList)

          this.chartFlag=true
          await this.$nextTick()

          // await this.$nextTick()
          this.option.series=this.getPieSeries(this.getVirtulData(page), this.$refs.echarts)

        }

      },
      handleClick(params){
        // this.$refs.resourceList.selectJohnAndKenny(params.name)
      },
      remoteMethod(value, index, property, filterName) {
        if (value && filterName === "客户") {
          let request = new Promise(resolve => {
            if(this.queryModuleData[property]&&this.queryModuleData[property].length){
              queryCustomerNameId({ pageNo: 1, pageSize: 100, custIdArray: this.queryModuleData[property]}).then(res=>{
                resolve(res)
              })
            } else {
              resolve({data:[]})
            }
          })
          Promise.all([ request,queryCustomerNameId({ pageNo: 1, pageSize: 100, keyword: value})]).then(res=>{
            this.$set(
              this.conditionsModuleList[index],
              "valueList",
              this.$commonUtils.unique(res[0].data.concat(res[1].data).map(item => ({ id: item.custId, value:item.name,value1:item.country,value2:item.fullname})),'id')
            );
            this.$forceUpdate();
          })
          // queryCustomerNameId({ pageNo: 1, pageSize: 100, keyword: value, custIdArray: this.queryModuleData[property]}).then(
          //   res => {
          //     this.$set(
          //       this.conditionsModuleList[index],
          //       "valueList",
          //       res.data.map(item => ({ id: item.custId, value:item.name,value1:item.country,value2:item.fullname}))
          //     );
          //     this.$forceUpdate();
          //   }
          // );
          // queryCustomerNameId({ pageNo: 1, pageSize: 100, keyword: value, custIdArray: this.queryModuleData[property]}).then(
          //   res => {
          //     this.$set(
          //       this.conditionsModuleList[index],
          //       "valueList",
          //       res.data.map(item => ({ id: item.custId, value:item.name,value1:item.country,value2:item.fullname}))
          //     );
          //     this.$forceUpdate();
          //   }
          // );
        }
        if (value && ["申请人",  "转让人"].includes(filterName)) {
          queryAllUrl({
            applicantName: value,
            pageNo: 1,
            pageSize: 100,
            orderBy:1
          }).then(res => {
            this.$set(
              this.conditionsModuleList[index],
              "valueList",
              res.data.map(item => ({
                id: item.applicantName,
                value: item.applicantName,
                value1: item.applicantEnName,
                value2: item.applicantAddress,
                value3: item.applicantEnAddress
              }))
            );
            this.$forceUpdate();
          });
          if (value && ["被申请人"].includes(filterName)) {
            querylyctListUrl({
              fullname: value,
              pageNo: 1,
              pageSize: 100,
              isCustomer:1
            }).then(res => {
              this.$set(
                this.conditionsModuleList[index],
                "valueList",
                res.data.map(item => ({
                  id: item.fullname,
                  value: item.fullname,
                  value1: item.fullnameEn,
                  value2: item.address,
                  value3: item.addressEn
                }))
              );
              this.$forceUpdate();
            });
          }
          // "",
          // console.log(this.conditionsModuleList[index]['valueList']);

          // this.$set(
          //   this.conditionsModuleList[index],
          //   "valueList",
          //   this.conditionsModuleList[index].values
          //     .filter(item => {
          //       for (let key in item) {
          //         if (
          //           item[key] &&
          //           item[key]
          //             .toLocaleUpperCase()
          //             .includes(value.toLocaleUpperCase())
          //         ) {
          //           return true;
          //         }
          //       }
          //       return false;
          //     })
          //     .slice(0, 100)
          // );
        }
        if (
          value &&
          filterName !== "客户" &&
          !["申请人", "被申请人", "转让人"].includes(filterName)
        ) {
          this.$set(
            this.conditionsModuleList[index],
            "valueList",
            this.conditionsModuleList[index].values
              .filter(item =>
                item.value
                  ? item.value
                    .toLocaleUpperCase()
                    .includes(value.toLocaleUpperCase())
                  : false
              )
              .slice(0, 100)
          );
          this.$forceUpdate();
        }
      },
      changeTextRange(value, property) {
        this.$set(this.queryModuleData, property, value);
        // if(property=='agentNumEnd'){
        //   this.handleSearch(1)
        // }
      },
     async getData(data){
       this.dataList=data
       this.chartTitleFlag=false
       await this.$nextTick()
       this.chartTitleFlag=true
        // if(!this.state){
        //   this.dataList=data
        //   this.chartTitleFlag=false
        //   await this.$nextTick()
        //   this.chartTitleFlag=true
        // }else {
        //   this.dataList=[]
        // }
     },
      queryUsersTaskList(){
        queryUsersTaskList().then(res=>{
            this.dataList=res.data.reduce((pre,next)=>{
              next.taskList.forEach(item=>item.executorName=next.executorName)
              return pre.concat( next.taskList)
            },[])
        })

      },
       getZero(month) {
          return month.length==2?month:`0${month}`
        },
       getVirtulData(page) {

         var startstr=`${page.year}-${this.getZero(page.month)}-01`
         var endstr;
         if(page.month+1==13){
            endstr=`${page.year+1}-01-01`
         }else {
            endstr=`${page.year}-${this.getZero(page.month+1)}-01`
         }
         var date = +new Date(startstr).getTime();
        var end = +new Date(endstr).getTime();
        var dayTime = 3600 * 24 * 1000;
        var data = [];
        for (var time = date; time < end; time += dayTime){
          data.push([
            this.$commonUtils.formatDate(time),
           this.$commonUtils.formatDate(time)==this.$commonUtils.formatDate(new Date)?300:0
            // echarts.format.formatTime('yyyy-MM-dd', time),
           // Math.floor(Math.random() * 10000),
          ]);
        }
         return data

      },

      getPieSeries(scatterData, chart) {
        return scatterData.map( (item, index)=>{
          function getColor(curData,itm,date) {
            if(curData.filter(i=>i.executorName===itm).find(i=>i.endDate == date)){
              return '#f00'
            }
            if(curData.filter(i=>i.executorName===itm).find(i=>i.startDate == date)){
              return '#0f0'
            }
            return '#fff'
          }
          var center = chart.convertToPixel('calendar', item);
          var curData=this.dataList.filter(itm=>item[0]>=itm.startDate&&item[0]<=itm.endDate)
          var executorNameList=[...new Set(curData.map(itm=>itm.executorName))]
          var data=executorNameList.map(itm=>({
          name: itm, value: curData.filter(i=>i.executorName===itm).length,label:{color:getColor(curData,itm,item[0])}
          }))

          return {
            id: index + 'pie',
            type: 'pie',
            center: center,
            label: {
              normal: {
                formatter: '{c}',
                position: 'inside',
              },

            },
            radius: this.pieRadius,
            data: data
          }

        });
      },

      getPieSeriesUpdate(scatterData, chart) {
        return scatterData.map( (item, index)=> {
          var center = chart.convertToPixel('calendar', item);
          return {
            id: index + 'pie',
            center: center
          };
        })
      },
      clickoutside(){
        this.drawerState = false
      },
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




.chart{
  height: 550px;
}
.slide-fade{
  position: fixed;left:0;right: 0;
  width: 100%;
  background-color: white;
}
.slide-fade-enter, .slide-fade-leave-to
{
  left:0;top: 0;right: 0;
  position: absolute;
  transform:translateX(-500px) translateY(-500px)  rotate(-150deg) scale3d(0.5,0,0);
  opacity:1;
}
.slide-fade-enter-active {
  background-color: white;
  transition: all 0.6s ease;
}
.slide-fade-leave-active {
  transition: all 0.7s ease;
  background-color: white;
  transform:translateX(500px) translateY(500px) rotate(150deg) scale3d(1,0,0) ;
  z-index: 100;
}
  .Gantt_wrap{
    display: flex;
    /*position: relative;*/
    top: 90px;
    left: 0;
    width: 100%;
  }
.el-form {
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .el-cascader {
    width: 100%;
  }
  /*.el-select /deep/{*/
  /*  .el-select__tags{*/
  /*    max-height: 40px;*/
  /*    overflow-y: auto;*/
  /*  }*/
  /*}*/
  /*.multi-cascader /deep/{*/
  /*  .el-cascader__label{*/
  /*    max-height: 40px;*/
  /*    overflow-y: auto*/
  /*  }*/
  /*}*/
  .postInfo-container-item {

    /deep/ .el-form-item__content {
      width: 330px;
      display: flex;
      /*height: 28px;*/
      align-items: center;
      .el-select {
        width: 100%;
      }
      .el-input {
        width: 100%;
      }
      .el-autocomplete{
        width: 100%;

      }
    }
  }
}
.el-scrollbar li {
  display: flex;
  span {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    border-right: 1px solid #f4f4f5;
    border-bottom: 1px solid #f4f4f5;
  }
}
.el-transfer {
  display: flex;

  /deep/ & > .el-transfer-panel {
    flex: 1;
  }

  /deep/ .el-transfer__buttons {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  /deep/ .el-transfer-panel__list {
    display: flex;
    flex-wrap: wrap;
    label {
      width: 33.3%;
      margin-right: 0;
    }
  }
}
.button-group-search{
  position: relative;
  display: flex;
  .searchWrap{
    border-radius: 5px;
    top: 34px;
    left: 10px;
    width: 550px;
    min-height: 200px;
    /*max-height: 500px;*/
    position: absolute;
    background: #ffffff;
    border: 1px solid #d4d5d5;
    z-index: 50;
    /*overflow: auto;*/
    padding: 20px 0;
    box-shadow: 0 3px 6px rgba(111,111,111,0.2);
    /deep/  .el-form{
      padding-bottom: 10px;
      overflow: auto;
      max-height: 500px;
      .el-form-item__label{
        text-align: left;
        padding-left: 32px;
        font-weight: normal;
      }
      .el-form-item__content{
        input{
          border-top: 0;
          border-left: 0;
          border-radius: 0;
          border-right: 0
        }
      }
    }
    .clearWrap{
      display: flex;
      justify-content: flex-end;
      right: 10px;
      bottom: 10px;
      position: absolute;
      z-index: 1;
    }
  }
}
/deep/ .name_wrap{
  display: flex;
  .name{
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    border-right:1px solid #2b2f3a;
    border-bottom:1px solid #2b2f3a;
  }
  .name0{
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    /*text-overflow: ellipsis;*/
    border-right:1px solid #2b2f3a;
    border-bottom:1px solid #2b2f3a;
  }
}
/deep/.firstName_wrap{
  cursor: not-allowed;
  background: #c9c9c9;
}
.searchRight{
  margin-left: 0;
  height: 32px;
  border-top-right-radius:3px !important;
  border-bottom-right-radius:3px !important;
  padding: 0 5px
}
.tables{
    div{
      border: 1px solid #ccc;
      border-top: none;
      text-align: center;
    }
  }
.table-head{
    &:first-child{
      border-left: 1px solid #ccc;
    }
    text-align: center;
    background-color: #f7f7f7;
    /*border-left: 1px solid #000;*/
    border-right: 1px solid #ccc;
  }
.hidden{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
  .overflow-hidden{
      overflow:hidden;
      width: 100%;
      display:inline-block;
      text-overflow:ellipsis;
      white-space:nowrap;
      word-break: break-all;
    }
  >>> .el-autocomplete-suggestion{
    width: 500px!important;
  }
  .new-task-slot{
    display: flex;
      .el-col{
        /*height: 100%;*/
        display: flex;
        border: 1px solid #ccc;
        border-bottom: none;
        .el-form-item{
          flex: 1;
          margin-bottom: 0;
          /*max-height: 120px;*/
          /*overflow-y: auto;*/
          display: flex;
          justify-content: left;
          /*align-items: center;*/
          >>>.el-form-item__label{
            background-color: #f1f1f1;
          }
          >>>.el-form-item__content{
            margin-left: 0!important;
            width: 75%;
          }
        }
      }
  }
  .el-form {
    .el-row{
      width: 100%;
      &:last-child{
        border-bottom: 1px solid #ccc;
      }
    }
  }
  .el-form{
    .el-cascader{
      width: 50%;
    }
  }
  .new-task-dialog,.edit-task-dialog{
    .el-row{
      display: flex;
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
            flex-shrink: 0;
          }
          >>>.el-form-item__content{
            margin-left: 0!important;
            width: 100%;
          }
        }
      }
      /*.bott{*/
      /*  border-bottom: 1px solid #ccc;*/
      /*}*/
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
</style>
