<template>
    <div style="">
      <p style="color: #909399;">
<!--        <span v-if="caseId || caseData&&taskData">任务提醒</span>-->
<!--        <span v-if="idData&&!wait">任务提醒</span>-->
        <span v-if="wait&&$route.path=='/workbench/toDoTask'">任务待办</span></p>
      <div style="display: flex;justify-content: space-between">
          <div style="display: flex;justify-content: space-between"><span style="width: 130px;display: flex;align-items: center;color: #909399">案件文号:</span><el-input v-model="queryAgentNum" placeholder="请输入案件文号" clearable size="small"></el-input><el-button @click="queryAgentYask()" type="primary" size="mini">搜索</el-button></div>
          <div style="display: flex;">
<!--            <div style="padding-left: 100px"><el-button v-if="idData&&!wait" @click="waitToDo" type="primary" size="small">待办</el-button></div>-->
            <div style="padding-right: 100px;padding-left: 50px">
              <el-button  @click="toTest" type="primary" size="small">切换视图</el-button>
              <el-button @click="handleCommand" type="primary" size="small">新建任务</el-button>
            </div>
          </div>

      </div>

      <div style="height: 100%;">
        <div class="box" :class="this.todo===false?'':'flipped'">
          <div class="card front">
            <div v-if="isList" class="task-list">
              <div class="out-task">
                <el-collapse ref="collapse" v-model="activeNames">
                  <el-collapse-item class="template-collapse-item" name="1">
                    <span  slot="title" class="collapse-title">
                      <span>发出的任务</span><span style="margin-left: 10px; color: #ccc">共{{outData.length}}个任务</span>
                    </span>
        <!--            子任务表格-->
                    <div v-if="outData.length" class="table" style="width: 100%; margin-top: 10px;margin-bottom: 10px; padding: 0 30px;" :style="outGridHeight">
<!--                      <el-table-->
<!--                        @row-dblclick="rowDbClick"-->
<!--                        @row-click="outRowClick"-->
<!--                        :data="outData"-->
<!--                        border-->
<!--                        max-height="250"-->
<!--                        style="width: 100%;"-->
<!--                        :row-class-name="currentRow"-->
<!--                        >-->
<!--&lt;!&ndash;                        <el-table-column&ndash;&gt;-->
<!--&lt;!&ndash;                          v-if="idData&&!wait"&ndash;&gt;-->
<!--&lt;!&ndash;                          label=""&ndash;&gt;-->
<!--&lt;!&ndash;                          width="30"&ndash;&gt;-->
<!--&lt;!&ndash;                        >&ndash;&gt;-->
<!--&lt;!&ndash;                        <template slot-scope="scope">&ndash;&gt;-->
<!--&lt;!&ndash;                          <div style="display: flex;justify-content: center;align-items: center">&ndash;&gt;-->
<!--&lt;!&ndash;                            <span :style="changeRemindColor(scope.row)">*</span>&ndash;&gt;-->
<!--&lt;!&ndash;                          </div>&ndash;&gt;-->

<!--&lt;!&ndash;                        </template>&ndash;&gt;-->
<!--&lt;!&ndash;                      </el-table-column>&ndash;&gt;-->
<!--                        <el-table-column-->
<!--                          label="任务名称"-->
<!--                        >-->
<!--                          <template slot-scope="scope">-->
<!--                            <el-popover-->
<!--                              trigger="hover"-->
<!--                              placement="top"-->
<!--                            >-->
<!--                              <div style="max-width: 400px">{{scope.row.taskName}}</div>-->
<!--                              <div slot="reference" class="name-wrapper">-->
<!--                                <span>{{scope.row.taskName}}</span>-->
<!--                              </div>-->
<!--                            </el-popover>-->
<!--                          </template>-->
<!--                        </el-table-column>-->
<!--                      <el-table-column-->
<!--                        label="案件文号"-->
<!--                        width="140px"-->
<!--                        >-->
<!--                        <template slot-scope="scope">-->
<!--                          <span style="color: #52A0F5;cursor: pointer" @click="goToDetail(scope.row)">{{scope.row.agentNum}}</span>-->
<!--                        </template>-->
<!--                      </el-table-column>-->

<!--                        <el-table-column-->
<!--                        label="客户"-->
<!--                        >-->
<!--                          <template slot-scope="scope">-->
<!--                          <el-popover-->
<!--                          trigger="hover"-->
<!--                          placement="top"-->
<!--                          >-->
<!--                            <div style="max-width: 400px">{{scope.row.custName}}</div>-->
<!--                            <div slot="reference" class="name-wrapper">-->
<!--                              <span>{{scope.row.custName}}</span>-->
<!--                            </div>-->
<!--                          </el-popover>-->
<!--                        </template>-->
<!--                      </el-table-column>-->
<!--                        <el-table-column-->
<!--                        label="案件名称"-->
<!--                        >-->
<!--                          <template slot-scope="scope">-->
<!--                            <el-popover-->
<!--                            trigger="hover"-->
<!--                            placement="top"-->
<!--                            >-->
<!--                              <div style="max-width: 400px">{{scope.row.caseName}}</div>-->
<!--                              <div slot="reference" class="name-wrapper">-->
<!--                                <span>{{scope.row.caseName}}</span>-->
<!--                              </div>-->
<!--                            </el-popover>-->
<!--                          </template>-->
<!--                      </el-table-column>-->
<!--                      <el-table-column-->
<!--                        label="截止日期"-->
<!--                        >-->
<!--                        <template slot-scope="scope">-->
<!--                          {{format(scope.row.endDate)}}-->
<!--                        </template>-->
<!--                      </el-table-column>-->
<!--                        <el-table-column-->
<!--                        prop="assigneeName"-->
<!--                        label="分配人"-->
<!--                        width="80px">-->
<!--                      </el-table-column>-->
<!--                      <el-table-column-->
<!--                        prop="executorName"-->
<!--                        label="执行人"-->
<!--                         width="80px">-->
<!--                      </el-table-column>-->
<!--                      <el-table-column-->
<!--                        prop="taskStatus"-->
<!--                        label="状态"-->
<!--                        width="80px">-->
<!--                      </el-table-column>-->
<!--                        <el-table-column-->
<!--                        label="操作"-->
<!--                        width="80px"-->
<!--                        >-->
<!--                          <template slot-scope="scope">-->
<!--&lt;!&ndash;                            <taskHandle :items="clickData" page="toDoTaskOut" :userId="$store.getters.userId" :rowIndex="scope.$index"></taskHandle>&ndash;&gt;-->
<!--                            <el-dropdown v-if="scope.row.delayFlag==2|| $store.getters.userId == scope.row.creator" @command="(e)=>auditTaskTwo(e, scope.row)" trigger="click">-->
<!--                              <i class="el-icon-more" style="font-size: 20px"></i>-->
<!--                            <el-dropdown-menu slot="dropdown">-->
<!--                              <el-dropdown-item v-if="scope.row.nextOperation == 1 || scope.row.nextOperation == 2" command="分配">分配</el-dropdown-item>-->
<!--&lt;!&ndash;                              <el-dropdown-item command="2">修改</el-dropdown-item>&ndash;&gt;-->
<!--&lt;!&ndash;                              <el-dropdown-item command="3">上传</el-dropdown-item>&ndash;&gt;-->
<!--&lt;!&ndash;                              <el-dropdown-item command="4">删除</el-dropdown-item>&ndash;&gt;-->
<!--&lt;!&ndash;                              <el-dropdown-item v-if="scope.row.nextOperation==2" command="提交">提交</el-dropdown-item>&ndash;&gt;-->
<!--&lt;!&ndash;                              <el-dropdown-item v-if="scope.row.nextOperation==3" command="审核">审核</el-dropdown-item>&ndash;&gt;-->
<!--&lt;!&ndash;                              <el-dropdown-item v-if="scope.row.delayFlag==1" command="申请延期">申请延期</el-dropdown-item>&ndash;&gt;-->
<!--                              <el-dropdown-item v-if="scope.row.delayFlag==2" command="审批延期">审批延期</el-dropdown-item>-->
<!--                              <el-dropdown-item v-if="$store.getters.userId == scope.row.creator" command="修改">修改</el-dropdown-item>-->
<!--                              <el-dropdown-item v-if="$store.getters.userId == scope.row.creator" command="删除">删除</el-dropdown-item>-->
<!--                            </el-dropdown-menu>-->
<!--                          </el-dropdown>-->
<!--                            <el-button v-if="scope.row.delayFlag==2" type="primary" size="mini" @click.native="auditTaskTwo('审批延期',scope.row)">审批延期</el-button>-->
<!--                          </template>-->
<!--                      </el-table-column>-->
<!--                    </el-table>-->
                      <AgGridVue
                                 style="width:100%;height: 100%"
                                 class="ag-theme-balham"
                                 :columnDefs="columnDefs1"
                                 :rowData="outData"
                                 rowSelection="multiple"
                                 @grid-ready="onGridReady"
                                 @rowClicked="rowClicked1"
                                 @rowDoubleClicked="rowDbClick"
                                 :gridOptions="gridOptions1"
                                 :getContextMenuItems="getContextMenuItems"
                                 @sortChanged="refreshEvenRowsCurrencyData"
                                 @filterChanged="refreshEvenRowsCurrencyData"
                                 suppressAutoSize
                                 animateRows
                                 :localeText="$store.state.caseInformation.localeText"
                      >
                      </AgGridVue>
                    </div>
<!--                    <el-pagination-->
<!--                      @current-change="handleCurrentChange"-->
<!--                      page-size="10"-->
<!--                      layout="total, sizes, prev, pager, next, jumper"-->
<!--                      :total="total">-->
<!--                    </el-pagination>-->
                  </el-collapse-item>
                  <el-collapse-item class="template-collapse-item" name="2">
                    <span  slot="title" class="collapse-title">
                      <span>收到的任务</span><span style="margin-left: 10px; color: #ccc">共{{getData.length}}个任务</span>
                    </span>
        <!--            子任务表格-->
                    <div v-if="getData.length" class="table" style="width: 100%; margin-top: 10px;padding: 0 30px;" :style="getGridHeight">
<!--                      <el-table-->
<!--                        @row-dblclick="rowDbClick"-->
<!--                        @row-click="getRowClick"-->
<!--                        :data="getData"-->
<!--                        border-->
<!--                        max-height="250"-->
<!--                        :row-class-name="currentRow">-->
<!--&lt;!&ndash;                        <el-table-column&ndash;&gt;-->
<!--&lt;!&ndash;                          v-if="idData&&!wait"&ndash;&gt;-->
<!--&lt;!&ndash;                          width="30"&ndash;&gt;-->
<!--&lt;!&ndash;                        >&ndash;&gt;-->
<!--&lt;!&ndash;                        <template slot-scope="scope">&ndash;&gt;-->
<!--&lt;!&ndash;                          <div style="display: flex;justify-content: center;align-items: center">&ndash;&gt;-->
<!--&lt;!&ndash;                            <span :style="changeRemindColor(scope.row)">*</span>&ndash;&gt;-->
<!--&lt;!&ndash;                          </div>&ndash;&gt;-->
<!--&lt;!&ndash;                        </template>&ndash;&gt;-->
<!--&lt;!&ndash;                      </el-table-column>&ndash;&gt;-->
<!--                        <el-table-column-->
<!--                          label="任务名称"-->
<!--                        >-->
<!--                          <template slot-scope="scope">-->
<!--                            <el-popover-->
<!--                              trigger="hover"-->
<!--                              placement="top"-->
<!--                            >-->
<!--                              <div style="max-width: 400px">{{scope.row.taskName}}</div>-->
<!--                              <div slot="reference" class="name-wrapper">-->
<!--                                <span>{{scope.row.taskName}}</span>-->
<!--                              </div>-->
<!--                            </el-popover>-->
<!--                          </template>-->
<!--                        </el-table-column>-->
<!--                      <el-table-column-->
<!--                        label="案件文号"-->
<!--                        width="140px"-->
<!--                        >-->
<!--                        <template slot-scope="scope">-->
<!--                          <span style="color: #52A0F5;cursor: pointer" @click="goToDetail(scope.row)">{{scope.row.agentNum}}</span>-->
<!--                        </template>-->
<!--                      </el-table-column>-->

<!--                        <el-table-column-->
<!--                        label="客户"-->
<!--                        >-->
<!--                          <template slot-scope="scope">-->
<!--                          <el-popover-->
<!--                          trigger="hover"-->
<!--                          placement="top"-->
<!--                          >-->
<!--                            <div style="max-width: 400px">{{scope.row.custName}}</div>-->
<!--                            <div slot="reference" class="name-wrapper">-->
<!--                              <span>{{scope.row.custName}}</span>-->
<!--                            </div>-->
<!--                          </el-popover>-->
<!--                        </template>-->
<!--                      </el-table-column>-->
<!--                        <el-table-column-->
<!--                        label="案件名称"-->
<!--                        >-->
<!--                          <template slot-scope="scope">-->
<!--                            <el-popover-->
<!--                            trigger="hover"-->
<!--                            placement="top"-->
<!--                            >-->
<!--                              <div style="max-width: 400px">{{scope.row.caseName}}</div>-->
<!--                              <div slot="reference" class="name-wrapper">-->
<!--                                <span>{{scope.row.caseName}}</span>-->
<!--                              </div>-->
<!--                            </el-popover>-->
<!--                          </template>-->
<!--                      </el-table-column>-->
<!--                      <el-table-column-->
<!--                        label="截止日期"-->
<!--                        >-->
<!--                        <template slot-scope="scope">-->
<!--                          {{format(scope.row.endDate)}}-->
<!--                        </template>-->
<!--                      </el-table-column>-->
<!--                         <el-table-column-->
<!--                          prop="assigneeName"-->
<!--                          label="分配人"-->
<!--                          width="80px">-->
<!--                        </el-table-column>-->
<!--                      <el-table-column-->
<!--                        prop="executorName"-->
<!--                        label="执行人"-->
<!--                        width="80px">-->
<!--                      </el-table-column>-->
<!--                        <el-table-column-->
<!--                        prop="taskStatus"-->
<!--                        label="状态"-->
<!--                        width="80px">-->
<!--                      </el-table-column>-->
<!--                      <el-table-column-->
<!--                        label="操作"-->
<!--                        width="80px"-->
<!--                        >-->
<!--                        <template slot-scope="scope">-->
<!--&lt;!&ndash;                          <taskHandle :items="clickData" page="toDoTaskGet" :userId="$store.getters.userId" :rowIndex="scope.$index"></taskHandle>&ndash;&gt;-->
<!--                          <el-dropdown @command="(e)=>auditTaskTwo(e, scope.row)" trigger="click">-->
<!--                              <i class="el-icon-more" style="font-size: 20px"></i>-->
<!--                            <el-dropdown-menu v-if="scope.row.delayFlag==2" slot="dropdown">-->
<!--                              <el-dropdown-item v-if="scope.row.delayFlag==2" command="审批延期">审批延期</el-dropdown-item>-->
<!--                            </el-dropdown-menu>-->
<!--                            <el-dropdown-menu v-else slot="dropdown">-->
<!--                              <el-dropdown-item v-if="(scope.row.nextOperation == 1 || scope.row.nextOperation == 2)" command="分配">分配</el-dropdown-item>-->
<!--                              <el-dropdown-item v-if="scope.row.nextOperation==2" command="提交">提交</el-dropdown-item>-->
<!--                              <el-dropdown-item v-if="scope.row.nextOperation==3" command="审核">审核</el-dropdown-item>-->
<!--                              <el-dropdown-item v-if="scope.row.delayFlag==1" command="申请延期">申请延期</el-dropdown-item>-->
<!--                              <el-dropdown-item v-if="$store.getters.userId == scope.row.creator" command="修改">修改</el-dropdown-item>-->
<!--                              <el-dropdown-item v-if="$store.getters.userId == scope.row.creator" command="删除">删除</el-dropdown-item>-->

<!--                            </el-dropdown-menu>-->
<!--                          </el-dropdown>-->

<!--                        </template>-->
<!--                      </el-table-column>-->
<!--                    </el-table>-->
                      <AgGridVue
                                 style="width:100%;height: 100%"
                                 class="ag-theme-balham"
                                 :columnDefs="columnDefs2"
                                 :rowData="getData"
                                 rowSelection="multiple"
                                 @grid-ready="onGridReady"
                                 @rowClicked="rowClicked2"
                                 @rowDoubleClicked="rowDbClick"
                                 @cellMouseOver="cellMouseOver"
                                 @cellMouseOut="cellMouseOut"
                                 :gridOptions="gridOptions2"
                                 :getContextMenuItems="getContextMenuItems"
                                 @sortChanged="refreshEvenRowsCurrencyData"
                                 @filterChanged="refreshEvenRowsCurrencyData"
                                 suppressAutoSize
                                 animateRows
                                 :localeText="$store.state.caseInformation.localeText"
                      >
                      </AgGridVue>
                    </div>
                  </el-collapse-item>
                </el-collapse>
            </div>
          </div>
          </div>
          <div class="card back"><div v-if="isList==false" class="task-calendar">
            <ToDoTaskCalendar :getData="getData" :outData="outData" :taskId="idData" @action="doSome"></ToDoTaskCalendar>
          </div>
          </div>
        </div>
      </div>
<!--新建任务-->
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
                <el-breadcrumb separator="/">
<!--                  <el-breadcrumb-item >{{prjName}}</el-breadcrumb-item>-->
<!--                  <el-breadcrumb-item>{{taskForm.prjTgName}}</el-breadcrumb-item>-->
<!--                  <el-breadcrumb-item>3</el-breadcrumb-item>-->
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
                    <el-form-item v-if="!projectSign" label="当前模板名称:" style="width: 100%;">
                      <span>{{teptName}}</span>
                      <el-button  type="primary" :disabled="end" size="mini" @click="taskTemplateView = true">选择</el-button>
                      <el-button  type="primary" :disabled="end" size="mini" @click="noTemplate">删除</el-button>
                    </el-form-item>
                    <el-row style="width: 100%;" v-if="!projectSign">
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
                        <el-form-item style="width: 100%;" class="" label="选择任务组:"  prop="createTaskGroup">
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
                    <el-row style="width: 100%;" v-if="projectSign">
                      <el-col :span="12">
                        <el-form-item style="width: 100%;" class="" label="选择任务组:"  prop="createTaskGroup">
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
                    <UserIconAndUserName :user-id="taskForm.creator" ></UserIconAndUserName>
<!--                    <virtual-select disabled clearable  :data="$store.getters.userList" v-model="taskForm.creator"  filterable :render="(data)=>$commonUtils.UserRender(data)" />-->
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
<!--                  <el-button type="primary"  :disabled="end" size="mini" @click="taskTemplateView = true">选择</el-button>-->
<!--                  <el-button type="primary"  :disabled="end" size="mini" @click="noTemplate">删除</el-button>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--              <el-col :span="12" style="" v-if="!teptName">-->
<!--                <el-form-item class="group-task" label="选择任务组:" prop="createTaskGroup">-->
<!--&lt;!&ndash;                  <div v-if="taskgroupList.length<1">&ndash;&gt;-->
<!--&lt;!&ndash;                    <el-input placeholder="请填写任务组:"></el-input>&ndash;&gt;-->
<!--&lt;!&ndash;                  </div>&ndash;&gt;-->
<!--                  <div>-->
<!--                    <el-select allow-create filterable v-model="taskForm.createTaskGroup" :disabled="end" placeholder="请选择">-->
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
<!--              <el-col :span="12" v-else></el-col>-->

<!--            </el-row>-->
<!--            <el-row v-if="teptName">-->
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
<!--                      <el-select v-model="taskForm.executor" :disabled="snTask||hasBoss" placeholder="请选择执行人" filterable>-->
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
            <el-button type="primary" size="mini" @click="clickCreateTask">确 定</el-button>
          </div>
            <el-dialog
              class="abow_dialog"
              :visible.sync="taskTemplateView"
              append-to-body
              width="80%"
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
        <div style="">
          <el-form>
            <el-form-item label="执行人:">
              <el-select class="executor" v-model="executor" placeholder="请选择执行人" filterable clearable>
                <el-option
                  v-for="item in peopleList"
                  :key="item.id"
                  :label="item.fullname"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="截止日期:">
              <el-date-picker
                class="executor"
                v-model="shenheEndDate"
                type="date"
                :clearable="false"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="审核备注:">
              <el-input placeholder="请输入备注" v-model="shenheremark"></el-input>
            </el-form-item>
          </el-form>

        </div>

        <span slot="footer" class="dialog-footer" style="display: flex; align-items: center;justify-content: center">
          <el-button @click="choosePeople = false">取 消</el-button>
          <el-button type="primary" @click="auditTaskNo">确 定</el-button>
        </span>
      </el-dialog>
<!--      申请延期-->
      <el-dialog
        title="申请延期"
        :visible.sync="delayView"
        append-to-body
        :modal="false"
        center
        top="0"
        height="500"
        v-dialogDrag
        :close-on-click-modal="false"
        width="35%">
<!--        <div style="display: flex;justify-content: center;align-items: center;margin-bottom: 30px">-->
          <el-row>
            <el-col :span="20" style="display: flex;">
                <span style="display: inline-block;width: 100px;text-align: right;flex-shrink: 0">延期原因:</span>
                <el-input type="textarea" :rows="4" placeholder="请填写延期原因" v-model="remark"></el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20" style="display: flex;padding-top: 20px;align-items: center">
              <span style="display: inline-block;width: 100px;text-align: right">选择延期日期:</span>
              <el-date-picker
                v-model="delayDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </el-col>

          </el-row>


<!--        </div>-->
        <span slot="footer" class="dialog-footer" style="display: flex;justify-content: center">
          <el-button @click="delayView = false">取 消</el-button>
          <el-button type="primary" @click="delayTask">确 定</el-button>
        </span>
      </el-dialog>
<!--      审批延期-->
<!--      <shenPi-->
<!--        v-if="handleDelayView"-->
<!--        :handleDelayView="handleDelayView"-->
<!--        :delayDate="delayDate"-->
<!--        :reason="reason"-->
<!--        :peopleList="peopleList"-->
<!--        @shenpi="shenpiTask"-->
<!--      ></shenPi>-->
<!--   操作弹框  -->
<!--      <taskDialog-->
<!--        @submitTask="submitTask"-->
<!--        @shenhe="shenhe"-->
<!--        @shenpiOk="shenpiOk"-->
<!--        @shenqingOk="shenqingOk"-->
<!--        :people-list="peopleList"-->
<!--        @closeDialog="closeDialog"-->
<!--        :title="dialogName"-->
<!--        :do-data="edtiTasksData"-->
<!--        :shenhe-view="shenView"-->
<!--        :caseData="doCaseId"-->
<!--        :workSign="workSign"-->
<!--        :projectSign="projectSign"-->
<!--      ></taskDialog>-->
<!--      上传文件-->
    <el-dialog
        append-to-body
        title="上传文件"
        :visible.sync="copyTemplFileView"
        width="30%"
        center
        top="0"
        height="500"
        :before-close="copyTemplClose"
        >
        <div class="right-fileList" style="padding: 0 10px">
<!--                  <i class="el-icon-close" @click="rightView = false"></i>-->
                  <el-tabs type="border-card" class="right-tab">
                    <el-tab-pane label="本地文件">
                      <div class="file-type" style="display: flex; justify-content: left;align-items: center;margin: 10px 0px">
                        <div style="display: flex;justify-content: left;align-items: center">
                          <span style="flex: 2;text-align: right;">文件类型:</span>
                          <el-select style="flex: 4;" default-first-option v-model="fileDocId" placeholder="请选择" filterable clearable @change="handleChangeDoc">
                            <el-option v-for="item in docTypeList" :key="item.doctId" :label="item.typeName" :value="item.doctId">
                            </el-option>
                          </el-select>
                          <el-select style="flex: 4;padding-right: 10px" default-first-option v-model="materialTypeId" placeholder="请选择" filterable clearable @change="handleChangeMat">
                            <el-option v-for="item in typeNameList" :key="item.materialTypeId" :label="item.typeName" :value="item.materialTypeId">
                            </el-option>
                          </el-select>
                        </div>

                    </div>
<!--                      <div v-if="taskSelect" class="file-type" style="">-->
<!--                        <div style="display: flex;justify-content: left;align-items: center">-->
<!--                          <span style="flex:2;text-align: right">关联任务:</span>-->
<!--                            <el-select style="flex: 8;padding-right: 10px" class="task" default-first-option v-model="bindTaskId" placeholder="请选择" filterable clearable @change="bindTaskFileSelect">-->
<!--                              <el-option v-for="item in bindTaskList" :key="item.prjTaskId" :label="item.prjTaskName" :value="item.prjTaskId">-->
<!--                              </el-option>-->
<!--                            </el-select>-->
<!--&lt;!&ndash;                          <span style="flex: 2"></span>&ndash;&gt;-->
<!--                        </div>-->

<!--                          </div>-->
                    <div style="display: flex; justify-content: center">
                      <el-upload
                        ref="upload"
                        class="upload-demo"
                        multiple
                        drag
                        name="attachFile"
                        :action="creatematerialUrl"
                        :data="uploadLocalData"
                        :before-upload="beforeUpload"
                        :on-success="successCallback"
                        :show-file-list="false"
                      >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                      </el-upload>
                    </div>
                    </el-tab-pane>
                    <el-tab-pane label="模板文件">
                      <el-card class="box-card box-card1">
                        <div slot="header" class="">
                          <div class="file-type" style="display: flex; justify-content: left;align-items: center;margin: 10px 0px">
                            <div style="display: flex;justify-content: left;align-items: center;">
                              <span style="flex: 2; text-align: right;">文件类型:</span>
                              <el-select style="flex: 3.5;" default-first-option v-model="fileDocId" placeholder="请选择" filterable clearable @change="handleChangeDoc">
                                <el-option v-for="item in docTypeList" :key="item.doctId" :label="item.typeName" :value="item.doctId">
                                </el-option>
                              </el-select>
                              <el-select style="flex: 3.5;padding-right: 10px" default-first-option v-model="materialTypeId" placeholder="请选择" filterable clearable>
                                <el-option v-for="item in typeNameList" :key="item.materialTypeId" :label="item.typeName" :value="item.materialTypeId">
                                </el-option>
                              </el-select>
<!--                              <el-button style="flex: 1;padding-right:5px" type="text" @click="copyTemplFile">上传</el-button>-->
<!--                              <span v-else style="flex: 1"></span>-->
                            </div>

                          </div>
<!--                          <div v-if="taskSelect" class="file-type" style="display: flex;justify-content: left;">-->
<!--                            <div style="display: flex;justify-content: left;align-items: center;width: 100%;">-->
<!--                              <span  style="flex:2;text-align: right;">关联任务:</span>-->
<!--                              <el-select style="flex: 7;" class="about-task" v-if="taskSelect" default-first-option v-model="bindTaskId" placeholder="请选择" filterable clearable @change="bindTaskFileSelect">-->
<!--                                <el-option v-for="item in bindTaskList" :key="item.prjTaskId" :label="item.prjTaskName" :value="item.prjTaskId">-->
<!--                                </el-option>-->
<!--                              </el-select>-->
<!--                              <el-button style="flex: 1;padding-right:5px" type="text" @click="copyTemplFile">上传</el-button>-->
<!--                            </div>-->

<!--                          </div>-->
                        </div>
                        <div style="">
                          <el-checkbox-group
                            style="max-height: 120px;overflow-y: auto"
                            v-model="modelFileId"
                            @change="onlyOneChoice"
                            >
                            <el-checkbox v-for="(item, j) in edtiTasksData.modelFileList" :key="j"  style="width: 90%;" :label="item.tfileId">{{item.fileName}}</el-checkbox>
                          </el-checkbox-group>
                        </div>

                      </el-card>
                    </el-tab-pane>
                  </el-tabs>
                </div>
        <span slot="footer" class="dialog-footer" style="display: flex;justify-content: center">
          <el-button size="small" type="primary" @click.native="copyTemplFile">确 定</el-button>
          <el-button @click.native="copyTemplClose">取 消</el-button>
        </span>
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
<!--      新建任务组件-->
<!--      <create-new-task1-->
<!--        @closeView="closeView"-->
<!--        :task-view="createView"-->
<!--        :wait-do="waitDo"-->
<!--        :message-type="messageType"-->
<!--      >-->
<!--      </create-new-task1>-->
      <create-new-task
        @closeView="closeView"
        :task-view="createView"
        :case-id="createCaseId"
        :wait-do="waitDo"
        :message-type="messageType"
        :create-task="[createCaseId,createTask]"
        :work-type="workType"
        :case-info="caseInfo"
        :check-case="checkCase"
        :sn-assignee="snAssignee"
        :sn-executor="snExecutor"
        :sn-remark="snRemark"
        :snPrjTaskId="snPrjTaskId"
      >
        <el-row slot="search-case" style="width:100%;">
          <el-col :span="12" style="border: none">
            <el-form-item style="width: 100%!important;" label="搜索案件:" label-width="100px">

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
                  <el-input :disabled="workType!=''" @blur="closeCaseList" @focus="openCaseList" style="" clearable @clear="clearCaseInfo" slot="reference" v-model="caseInfo"   @keyup.enter.native="(v)=>{queryCaseList(v,'agent')}"></el-input>
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
      <!--      修改任务弹框-->
      <edit-task
        ref="edit"
        :title="title"
        :edit-data="edtiTasksData"
        :edit-view="editTaskView"
        :id="teptId"
        :name="teptName"
        :work-sign="workSign"
        :task-data-case-id="doCaseId"
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

      <!--提醒计划-->
    <taskPlanList :visible.sync="taskPlanState" :task-info="taskForm"></taskPlanList>

      <!--    悬浮菜单-->
    <div>
      <ul v-show="hoverView" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li>{{hoverValue}}</li>
    </ul>
    </div>
    </div>
</template>

<script>
  import taskDetails from "../../project_management/components/taskDetail";
  import localExector from "../../project_management/components/localExector";
  import taskPlanList from "@/views/workbench/project_management/components/taskPlanList";
  import taskHandle from "@/views/homePage/components/taskHandle.vue";
  import EditTask from "../../case/components/EditTask";
  import CreateNewTask from "../../case/components/CreateNewTask";
  import { queryTaskList, queryTemplateFileList } from '@/api/templateManagement'
  import taskDialog from "./taskDialog";
  import { creatematerial } from '@/api/ipServiceApi.config.js'
  import ToDoTaskCalendar from "./ToDoTaskCalendar";
  import shenPi from "./shenPi";
  import TemplateList from '@/views/workbench/system_management/templateManagement/index'
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
    delayTask,
    queryMaterialTypeByDocId,
    shenpiTask,
    copyTemplFile,
    queryMaterialDocType,
    queryCaseList,
    queryWorkType,
    getCaseHistory,
    queryProjecTeptId,
    queryTaskById
  } from '@/api/caseList'
  import Bus from '@/utils/Bus'
  import vm from "../../../../main";
  import TaskDetail from "../../case/components/ManualIdentification/TaskDetail";
  // import CreateNewTask1 from "./CreateNewTask1";
  export default {
    name: "Lawsuit",
    components: {
      TaskDetail,
      // CreateNewTask1,
      TemplateList,ToDoTaskCalendar,shenPi,taskDialog,CreateNewTask,EditTask,taskHandle,taskPlanList,localExector,taskDetails
    },
    props: {
      closeDelayView: true,
      caseId: {
        default: ''
      },
      taskName: {
        default: ''
      },
      toTaskId: {
        default: ''
      }
    },
    computed: {
      flag() {
        return this.$store.getters.flag
      },
      getGridHeight(){
        let h = (28 * this.getData.length + 55) > 250 ? 250 : (28 * this.getData.length + 55)
        return `height:${h}px;`
      },
      outGridHeight(){
        let h = (28 * this.outData.length + 55) > 250 ? 250 : (28 * this.outData.length + 55)
        return `height:${h}px;`
      }
      // vuexTaskId() {
      //   if(this.$store.getters.toDoTaskId) {
      //     return this.$store.getters.toDoTaskId
      //   }
      // },
      // vuexCaseId() {
      //   if(this.$store.getters.toDoTaskCaseId) {
      //     return this.$store.getters.toDoTaskCaseId
      //   }
      // },
      // vuexTaskName() {
      //   if(this.$store.getters.toDoTaskName) {
      //     return this.$store.getters.toDoTaskName
      //   }
      // },
    },
    watch: {
      closeDelayView(n,o){
        if(n){
          this.handleDelayView = false
        }else{
          this.handleDelayView = false
        }

      },
      flag: {
        handler(n,o){
          if(n){
            // 如果有新待办任务，刷新数据
            this.queryToDoTask()
            this.$store.commit('caseInformation/SET_FLAG', false)
            // this.$store.dispatch('user/getTodoTaskNotice',null, { root: true })
          }
        },
        immediate: true

      },
      toTaskId(n, o) {
        if(n){
          this.wait = ''
          this.idData = n
          this.handTaskData(n)
        }
      },
      caseId(n, o) {
        if(n){
          this.caseData = n
          // this.outData = JSON.parse(sessionStorage.getItem('toDaTaskDataList'))[0].filter(item=>item.remind>0)
          // this.getData = JSON.parse(sessionStorage.getItem('toDaTaskDataList'))[1].filter(item=>item.remind>0)
          // this.outData = this.outData.filter(item=>item.remind>0)
        }
      },
    },
    data() {
      const that = this
      return {
        detailPrjTaskId:'',
        hoverView:false,
        hoverValue:'',
        left:0,
        top:0,
        gridOptions1: {
          ...this.$store.state.caseInformation.gridOptions, ...{
            statusBar: {
              statusPanels: [
                // { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
                // { statusPanel: 'agSelectedRowCountComponent', align: 'left' }
              ]
            }
          },
          getRowStyle: this.ChangRowColor,
      },
        gridOptions2: {
          ...this.$store.state.caseInformation.gridOptions, ...{
            statusBar: {
              statusPanels: [
                // { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
                // { statusPanel: 'agSelectedRowCountComponent', align: 'left' }
              ]
            }
          },
          getRowStyle: this.ChangRowColor,
      },
      defaultcolumnDefs1: [
        {
          headerName: '序号',
          field: 'sid',
          width: 80,
          'pinned': 'left', // 固定再左边
          enableRowGroup: true,
          // enablePivot: true,
          floatingFilter: true,
          filter: false,
          cellClass: 'vAlign',
          suppressMenu: true,
          checkboxSelection: false,
          headerCheckboxSelection: false,
          headerCheckboxSelectionFilteredOnly: true,
          cellRenderer: this.cellRenderer1
        },
        {
            headerName: '操作',
            field: 'handle',
            width: 80,
            'pinned': 'right', //固定在右边
            enableRowGroup: true,
            // enablePivot: true,
            floatingFilter:true,
            filter: false,
            cellClass: 'vAlign',
            suppressMenu: true,
            checkboxSelection: false,
            headerCheckboxSelection: false,
            headerCheckboxSelectionFilteredOnly: true,
            cellRenderer:this.cellRenderer1,
            // editable: true,
            // cellEditor: 'taskHandle',
            // checkboxSelection:function(params) {
            //   // we put checkbox on the name if we are not doing grouping
            //   return params.columnApi.getRowGroupColumns().length === 0;
            // },
            // headerCheckboxSelection:(params)=>{
            //   // we put checkbox on the name if we are not doing grouping
            //   if(this.selectionState){
            //     return false
            //   }
            //   console.log(params.columnApi.getRowGroupColumns().length === 0);
            //   return params.columnApi.getRowGroupColumns().length === 0;
            // }
          },
      ],
        defaultcolumnDefs2: [
        {
          headerName: '序号',
          field: 'sid',
          width: 80,
          'pinned': 'left', // 固定再左边
          enableRowGroup: true,
          // enablePivot: true,
          floatingFilter: true,
          filter: false,
          cellClass: 'vAlign',
          suppressMenu: true,
          checkboxSelection: false,
          headerCheckboxSelection: false,
          headerCheckboxSelectionFilteredOnly: true,
          cellRenderer: this.cellRenderer2
        },
        {
            headerName: '操作',
            field: 'handle',
            width: 80,
            'pinned': 'right', //固定在右边
            enableRowGroup: true,
            // enablePivot: true,
            floatingFilter:true,
            filter: false,
            cellClass: 'vAlign',
            suppressMenu: true,
            checkboxSelection: false,
            headerCheckboxSelection: false,
            headerCheckboxSelectionFilteredOnly: true,
            cellRenderer:this.cellRenderer2,
            // editable: true,
            // cellEditor: 'taskHandle',
            // checkboxSelection:function(params) {
            //   // we put checkbox on the name if we are not doing grouping
            //   return params.columnApi.getRowGroupColumns().length === 0;
            // },
            // headerCheckboxSelection:(params)=>{
            //   // we put checkbox on the name if we are not doing grouping
            //   if(this.selectionState){
            //     return false
            //   }
            //   console.log(params.columnApi.getRowGroupColumns().length === 0);
            //   return params.columnApi.getRowGroupColumns().length === 0;
            // }
          },
      ],
        projectId:'',
      columnDefs1:[],
      columnDefs2:[],
      preferenceList: [{ 'label': '任务名称', prop: 'taskName'},
                       {'label': '案件/项目文号', prop: 'agentNum'},
                       { 'label': '客户', prop: 'custName' },
                       { 'label': '案件名称', prop: 'caseName' },
                       { 'label': '截止日期', prop: 'endDate' },
                       { 'label': '分配人', prop: 'assigneeName' },
                       { 'label': '执行人', prop: 'executorName' },
                       { 'label': '状态', prop: 'taskStatus' }
                      ],
        taskPlanState:false,
        projectSign:false,
        title:'',
        clickData:{
          delayFlag: '',
          nextOperation:'',
          index: '',
          creator: ''
        },
        bossUserId:'',
        hasBoss:false,
        agentCaseLists:[],
        agentVisible:false,
        editTaskgroupList: [],
        editGroupTask: [],
        workSign:false,
        expireTimeOption: {
					disabledDate(date) {
						return that.CompareDate(that.format(date.getTime()),that.choseEndDate1)
					}
				},
        checkCase: false,
        workType: '',
        end: false,
        shenheEndDate: '',
        createTask: '2',
        createCaseId: '',
        caseListOption: [],
        caseInfo: '',
        excutorView: false,
        assignData: {},
        copyTemplFileView:false,
        dialogName: '',
        modelFileId: [],
        uploadLocalData: {
          tokenID: this.$store.getters.token
        },
        fileLists: [],
        creatematerial,
        creatematerialUrl: '',
        typeNameList: [],
        materialTypeId: '',
        docTypeList: [],
        fileDocId: '',
        rightView: false,
        activeName: '1',
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
        rules: {
          prjTaskName: [{ required: true, message: '请输入任务名称', trigger: 'change' },],
          createTaskGroup: [{ required: true, message: '请选择任务组', trigger: 'change' },],
          beginDate: [{ required: true, message: '请选择开始日期', trigger: 'change' },],
          endDate: [{ required: true, message: '请选择截止日期', trigger: 'change' },],
          executor: [{ required: true, message: '请选择任务执行人', trigger: 'change' },],
        },
        EditTaskRules: {
          prjTaskName: [{ required: true, message: '请输入任务名称', trigger: 'change' }],
          endDate: [{ required: true, message: '请选择截止日期', trigger: 'change' },]
        },
        remark: '',
        shenView: false,
        delayExecutor: '',
        handleDelayView: false,
        delayResult: '',
        delayDate: '',
        delayView: false,
        onceCreateGroup: true,
        // confirmDialog: false,
        notQuery: true,
        activeNames: ['1','2'],
        queryAgentNum: '',
        executor: '',
        choseExecutor:'',
        choseEndDate: '',
        choseEndDate1: '',
        peopleList: [],
        choosePeople: false,
        todo:false,
        idData: this.toTaskId,
        isList: true,
        templateGroupTask: [],
        taskList: [],
        taskgroupList: [],
        createTaskGroup: '',
        caseData: this.caseId,
        // taskData: this.taskName,
        outData: [],
        getData: [],
        getData1: [],
        outData1: [],
        checkFlag: 0,
        newTaskView: false,
        newTask: {},
        taskForm: {
          creator: this.$store.getters.userId ,
          prjTgName: '',
          createDate: (new Date().toLocaleDateString()).replace(/\//g, '-'),
          createTaskGroup: '',
          prjTaskName: '',
          prjTaskDesc: '',
          beginDate: (new Date().toLocaleDateString()).replace(/\//g, '-'),
          endDate: '',
          checkItem: '',
          executor: ''

        },
        taskTemplateView:false,
        teptId: 0,
        taskDefineId: '',
        teptName: '',
        subTaskList: [],
        timeDate: [],
        createTaskView: false,
        taskId: '',
        createGroupView: false,
        groupForm: {
          caseId: '',
          agentNum: '',
          prjTgName: ''
        },
        delayTaskId: '',
        handleDelayTaskId: '',
        wait: '',
        tgIdd: '',
        groupNames: '',
        delayDate: '',
        reason: '',
        shenheTaskId:'',
        doCaseId:'',
        snTask: false,
        snAssignee: '',
        snExecutor: '',
        shenheremark: '',
        waitDo: '',
        messageType: '',
        createView: false,
        snPrjTaskId: '',
        snRemark: '',
        workKinds: {},
        editTaskView:false,
        subMessageType:'',
        subTaskId:'',
        subRemark: '',
        changeTeptId: '',
        changeTeptName: '',
        // newTaskHasTemplate: false,
        startDate:'',
        prjName:''

      }
    },
    activated() {
      this.caseData = this.caseId
      this.queryToDoTask()
      this.keyCodeForEvent()
      this.workClick()
    },
    mounted() {
      Bus.$on('toDoTaskHandle',(arr)=>{
        this.auditTaskTwo(arr[0],arr[1])
        // this.resetBtnIndex()
      })
      this.peopleList = this.$store.getters.userList
    },
    methods: {
      closeDetail(){
        this.projectSign = false
        this.detailPrjTaskId = ''
      },
      updateTask(f){
        if(f=='0'){
          this.queryPrjTask(this.edtiTasksData,'edit')
        }else{
          this.closeDialog()
          this.postMessage()
          // this.queryToDoTask()
        }

      },
      shenHe(arr){
        this.auditTask(arr[1],arr[0])
      },
      tijiao(arr){
        this.submitTask(arr)
      },
      handleTask(arr){
        // console.log(arr,777)
        this.auditTaskTwo(arr[0],arr[1])
      },
      rowClicked1(params){
        // this.$store.commit('caseInformation/SET_GET_INDEX', 0)
        // if(!(params.event.target.getAttribute("class")&&params.event.target.getAttribute("class").includes('dot-btn') || params.event.target.getAttribute("class")&&params.event.target.getAttribute("class").includes('el-icon-more'))){
        //   this.$store.commit('caseInformation/SET_OUT_INDEX', 0)
        //   return
        // };
        // this.$store.commit('caseInformation/SET_OUT_INDEX', params.data.prjTaskId)

      },
      rowClicked2(params){
        // this.$store.commit('caseInformation/SET_OUT_INDEX', 0)
        // if(!(params.event.target.getAttribute("class")&&params.event.target.getAttribute("class").includes('dot-btn') || params.event.target.getAttribute("class")&&params.event.target.getAttribute("class").includes('el-icon-more'))){
        //   this.$store.commit('caseInformation/SET_GET_INDEX', 0)
        //   return
        // };
        // this.$store.commit('caseInformation/SET_GET_INDEX', params.data.prjTaskId)

      },
      cellMouseOver(params){
        // console.log(params.value)
        // this.hoverView = true
        // this.hoverValue = params.value
        // this.left = params.event.clientX
        // this.top = params.event.clientY
      },
      cellMouseOut(params){
        // console.log(params)
        // this.hoverView = false
        // this.hoverValue = ''
        // this.left = 0
        // this.top = 0
      },
      onGridReady(params) {
        this.gridparams = params
        this.gridApi = params.api
        this.columnApi = params.columnApi
        params.api.sizeColumnsToFit()
      },
      refreshEvenRowsCurrencyData(params) {
        this.currentPageSize = params.api.rowModel.rootNode.allChildrenCount
        if (!params.columnApi.columnController.groupAutoColumns) {
          this.gridApi.forEachNode(rowNode => {
            rowNode.setDataValue(
              'sid',
              rowNode.rowIndex + 1)
          })
        }
      },
      // cellRenderer(params) {
      //   if (params.colDef.field === 'sid') {
      //     return params.rowIndex + 1
      //   }
      //   if(params.colDef.field=='subject'){
      //     var eDiv = document.createElement('div');
      //     eDiv.innerHTML = `<span class="btn-simple" style="cursor: pointer;color: #00b0ff" title="${params.value}">${params.value?params.value:''}</span>`
      //     var eButton = eDiv.querySelectorAll('.btn-simple')[0];
      //
      //     eButton.addEventListener('click', ()=> {
      //       if(params.data){
      //         this.$router.push(`./activity_edit/${params.data.custActId}`)
      //       }
      //     });
      //
      //     return eDiv;
      //   }
      //   if(params.colDef.field=='handle'){
      //     const h = vm.$createElement;
      //     let vnode=h(taskHandle,{
      //       props: {
      //         items:params.data,
      //         userId:this.$store.getters.userId,
      //         rowIndex:params.rowIndex,
      //         page:'toDoTaskOut'
      //       },
      //
      //     })
      //     const div = document.createElement('div');
      //     vm.__patch__(div,vnode,true,false)
      //     return div
      //   }
      //   return `<span title="${params.value}">${params.value ? params.value : ''}</span>`
      // },
      cellRenderer1(params) {
        if (params.colDef.field === 'sid') {
          return params.rowIndex + 1
        }
        if(params.colDef.field=='agentNum'){
          var eDiv = document.createElement('div');
          eDiv.innerHTML = `<span class="btn-simple" style="cursor: pointer;color: #00b0ff" title="${params.value}">${params.value?params.value:''}</span>`
          var eButton = eDiv.querySelectorAll('.btn-simple')[0];

          eButton.addEventListener('click', ()=> {
            this.goToDetail(params.data)
            // if(params.data){
            //   this.$router.push(`./activity_edit/${params.data.custActId}`)
            // }
          });

          return eDiv;
        }
        if(params.colDef.field=='handle'){
          const h = vm.$createElement;
          let vnode=h(taskHandle,{
            props: {
              items:params.data,
              userId:this.$store.getters.userId,
              page:'toDoTaskOut'
            },

          })
          const div = document.createElement('div');
          vm.__patch__(div,vnode,true,false)
          return div
        }
        return `<span title="${params.value}">${params.value ? params.value : ''}</span>`
      },
      cellRenderer2(params) {
        if (params.colDef.field === 'sid') {
          return params.rowIndex + 1
        }
        if(params.colDef.field=='agentNum'){
          var eDiv = document.createElement('div');
          eDiv.innerHTML = `<span class="btn-simple" style="cursor: pointer;color: #00b0ff" title="${params.value}">${params.value?params.value:''}</span>`
          var eButton = eDiv.querySelectorAll('.btn-simple')[0];

          eButton.addEventListener('click', ()=> {
            this.goToDetail(params.data)
            // if(params.data){
            //   this.$router.push(`./activity_edit/${params.data.custActId}`)
            // }
          });

          return eDiv;
        }
        if(params.colDef.field=='handle'){
          const h = vm.$createElement;
          let vnode=h(taskHandle,{
            props: {
              items:params.data,
              userId:this.$store.getters.userId,
              page:'toDoTaskGet'
            },

          })
          const div = document.createElement('div');
          vm.__patch__(div,vnode,true,false)
          return div
        }
        return `<span title="${params.value}">${params.value ? params.value : ''}</span>`
      },
      getContextMenuItems(params) {
        if (!params.node || !params.node.data) {
          return []
        }
        return this.getRowContextmenuList(params.node.data).map(item => ({
          name: item.name,
          action: () => {
            this[item.action](params.node.data, params.node.rowIndex,params.value, params.node)
          }
        }))
      },
      getRowContextmenuList(row) {
        return [
          { name: '复制', action: 'copy' },
          // { name: '商标导入', action: 'installtmmessage', permissions: 185 },
          // { name: '修改', action: 'editFun', permissions: 73 },
          // { name: '删除', action: 'handledeleElement', permissions: 74 }
        ].filter(item => {
          if (item.permissions) {
            return this.$store.getters.permissions.includes(item.permissions)
          } else {
            return true
          }
        })
      },
      copy(row, index, value) {
        if(value){
          this.$copyText(value).then(
            res => {
            })
        }
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
      resetBtnIndex(){
        // this.$store.commit('caseInformation/SET_GET_INDEX', 0)
        // this.$store.commit('caseInformation/SET_OUT_INDEX', 0)
      },
      getRowClick(r,c,e){
        //
        // this.clickData.creator = r.creator
        // this.clickData.index = r.index
        // this.clickData.delayFlag = r.delayFlag
        // this.clickData.nextOperation = r.nextOperation
        // this.$store.commit('caseInformation/SET_GET_INDEX', r.index)
      },
      outRowClick(r,c,e){
        // this.clickData = r
        // this.$store.commit('caseInformation/SET_OUT_INDEX', r.index)
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
          // this.postMessage()
          this.queryToDoTask()
        }

      },
      CompareDate(d1,d2){
        return ((new Date(d1.replace(/-/g,"\/"))) > (new Date(d2.replace(/-/g,"\/"))));
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
      clearCaseInfo(){
        this.createCaseId = ''
        this.createTask = '2'
        this.caseInfo = ''
        this.checkCase = false
        this.agentCaseLists = []
        this.agentVisible = false
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
          if(key == 17){
            code = 1
          }
          if(key == 81){
            code2 = 1
          }
          if (code == 1 && code2 == 1) {
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
          // this.hasTemplate = false
        }else{
          this.caseInfo = item.agentNum
          this.createCaseId = item.caseId
          this.createTask = '1'
          this.checkCase = true
          // queryProjectTask({caseId:this.createCaseId}).then(res=> {
          //   if (res.data.find(i => i.teptId)) {
          //     this.hasTemplate = true
          //     this.teptId = res.data.find(i => i.teptId).teptId
          //   }
          // })
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
              //   if (res.data.find(i => i.teptId)) {
              //     this.hasTemplate = true
              //     this.teptId = res.data.find(i => i.teptId).teptId
              //   }
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
      // closeView(v) {
      //   if(v != '取消'){
      //     // this.queryToDoTask()
      //   }
      //   if(v == '成功'){
      //     this.hasTemplate = false
      //     this.caseInfo = ''
      //     this.workType = ''
      //     this.shenView = false
      //     this.createCaseId = ''
      //     this.queryCaseListList()
      //   }
      //   this.createView = false
      //   this.createTask = '2'
      //   this.checkCase = false
      // },
      closeView(v) {
        if(v != '取消'){
          // this.queryToDoTask()
          this.postMessage()
        }
        if(v == '成功'){
          this.caseInfo = ''
          this.workType = ''
          this.shenView = false
          this.editTaskView = false
        }
        // this.caseInfo = ''
        // this.workType = ''
        this.createCaseId = ''
        this.createView = false
        this.createTask = '2'
        this.checkCase = false
        this.snRemark = ''
        this.snAssignee = ''
        this.snExecutor = ''
        this.snPrjTaskId = ''
        // this.hasTemplate = false
      },
      handleCommand(value, n) {
        // if(n==1){
        //   this.firstGroup = true
        // }
        this.caseInfo = ''
        this.workType = ''
        this.waitDo++
        this.teptName = ''
        // this.caseInfo = ''
          this.createView = true
        // this.teptId
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
      // CompareDate(d1,d2) {
      //   return ((new Date(d1.replace(/-/g,"\/"))) > (new Date(d2.replace(/-/g,"\/"))));
      // },
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
          this.queryToDoTask()
          // this.postMessage()
          // this.queryProjectTask()
          this.choseExecutor = ''
          this.excutorView = false
        })

      },
      goToDetail(row) {
        row.caseId ? this.$commonUtils.takeCaseDetail(row,this) : window.open(`/#/workbench/ResourceView/taskDetail?prjTaskId=${row.prjTaskId}`)
      },
      rowDbClick(params){
        if(params.event.target.getAttribute("class")&&params.event.target.getAttribute("class").includes('dot-btn') || params.event.target.getAttribute("class")&&params.event.target.getAttribute("class").includes('el-icon-more'))return;
        this.auditTaskTwo('查看', params.data)
      },
      handleChangeMat(v) {
      },
      copyTemplClose() {
        this.copyTemplFileView = false
        this.materialTypeId = ''
        this.typeNameList = []
        this.fileDocId = ''
        // this.bindTaskList = []
        this.bindTaskId = ''
      },
      upTempFile() {
        this.prjTaskId = ''
        this.queryTempFiles()
        this.copyTemplFileView = true
        // this.taskSelect = true
        this.queryMaterialDocType()
      },
      queryTempFiles() {
        queryTemplateFileList({teptId: this.teptId,tfileId: this.teptId}).then(res=>{
          this.edtiTasksData.modelFileList = res.data
        })
      },
      noTemplate() {
        // this.$refs['tempList'].selected = 100
        Bus.$emit('deleteSelect')
        this.taskTemplateView = false
        this.teptName = ''
        this.groupForm.prjTgName = ''
        this.onceCreateGroup = true
      },
      // queryPeopleList(data) {
      //   // console.log('+++++++++++++++')
      //   // console.log(data)
      //   // console.log('+++++++++++++++')
      //   queryTaskUserList({caseId: this.doCaseId}).then(res=>{
      //     this.peopleList = res.data
      //   })
      // },
      shenhe(arr){
        this.auditTask(arr[0],arr[1])
      },
      shenqingOk(){
        // this.queryToDoTask()
        this.postMessage()
        this.closeDialog()
      },
      shenpiOk(){
        // this.queryToDoTask()
        this.postMessage()
        this.closeDialog()
      },
      closeDialog(f){
        if(this.snTask){
          // alert(1)
        }else{
          // alert(2)
          // this.$refs.edit.modifyProjectTask('parent')
          this.editTaskView = false
          this.projectSign = false
        }

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
        let id = ''
        // this.queryTempFiles()
        if(this.newTask){
          id = ''
        }else{
          id = this.shenheTaskId
        }
        copyTemplFile({
          tfileId: this.modelFileId[0],
          caseId: this.doCaseId,
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
      onlyOneChoice(v){
        this.modelFileId = []
        if(v){
          // console.log(v)
          // const length = v.length
          this.modelFileId.push(v.splice(-1)[0])
          // console.log(this.modelFileId)
        }
      },
      beforeUpload() {
        if(this.newTask||this.createTaskView){
          this.uploadLocalData.prjTaskId = ''
        }else{
          this.uploadLocalData.prjTaskId = this.shenheTaskId
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
          if(this.newTask||this.createTaskView){
            this.fileLists.push(res.data[0])
          }
          // console.log('444444+++++++++++++++')
          // console.log(this.materialIdList)
          // console.log('+++++++++++++++')
          this.$message.success('文件上传成功!')
          this.updateData(this.doCaseId)
          this.rightView = false
          this.copyTemplFileView = false
          this.fileDocId = ''
          this.materialTypeId = ''
          this.bindTaskId = ''
          // this.initFileList(1)
          // this.isLoading = false
          // this.loadView = false
          // this.handleSearch()
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
          queryMaterialTypeByDocId({ doctId:this.fileDocId ,caseId:this.caseData}).then(res => {
            this.typeNameList = res.data
          })

      },
      handleClick(f) {
        if(f==2){
          console.log(this.edtiTasksData.modelFileList)
        }
      },
      handleDelay(data) {
        // this.handleDelayView = true
        // this.handleDelayTaskId = data.taskId
        // this.groupForm.caseId = data.caseId
        // this.reason = data.reason
        // this.delayDate = data.delayDate
        // queryTaskUserList({caseId: this.groupForm.caseId}).then(res=> {
        //   this.peopleList = res.data
        // })
      },
      shenpiTask(data) {
        shenpiTask({prjTaskId: this.handleDelayTaskId, result: data.delayResult, executor: data.delayExecutor,endDate: data.endDate}).then(()=>{
          this.$message.success('审批成功!')
          // this.postMessage()
          this.queryToDoTask()
          this.handleDelayView = false
        })
      },
      clickDelay(data) {
        this.delayView = true
        this.delayTaskId = data.taskId
      },
      delayTask() {
        if(!this.delayDate){
          this.$message.error('请选择日期！')
          return
        }
        delayTask({prjTaskId: this.delayTaskId, endDate: this.delayDate,remark:this.remark}).then(()=>{
          // this.postMessage()
          this.queryToDoTask()
          this.$message.success('申请延期已提交！')
          this.delayView = false
        })
      },
      clearData() {
        Bus.$emit('deleteSelect')
        this.snAssignee = ''
        this.snExecutor = ''
        this.bossUserId = ''
        this.hasBoss = false
        this.snTask = false
        // this.newTaskHasTemplate = false
        this.end = false
        this.taskForm.prjTaskName = ''
        this.taskForm.endDate = ''
        this.newTask = false
        this.createTaskView = false
        this.snTask = false
        this.taskForm.checkItem = ''
        this.taskForm.executor = ''
        this.templateGroupTask = []
        this.taskForm.prjTaskDesc = ''
        this.taskForm.createTaskGroup = ''
        this.teptName = ''
        this.teptId = ''
        this.taskList = []
        if(this.messageType){
          if(this.messageType == '11' || this.messageType == '15'){
            return
          }else{
            auditTask({prjTaskId: this.taskId, result: 1 ,checkFlag: 0,remark: this.shenheremark}).then((res)=>{
              this.messageType = ''
              this.$message.success('审核成功！')
              this.postMessage()
              // this.queryToDoTask()
              this.closeDialog()
              // this.queryProjectTask()
            })
          }
        }
        if(this.subMessageType == '13'){
          submitTask({prjTaskId: this.subTaskId, remark: this.subRemark,checkFlag: 0}).then(()=>{
            this.postMessage()
            this.messageType = ''
            this.$message.success('提交成功！')
            this.subTaskId = ''
            this.subRemark = ''
            this.subMessageType = ''
            // this.queryToDoTask()
            this.closeDialog()
          })
        }


        // this.end = false
        // this.taskDefineId = ''
        // this.confirmDialog = false
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
          // this.taskgroupList = res.data
          this.createGroupView = false
          this.groupForm.prjTgName = ''
          // this.$message.success('新建任务组成功！')
          this.taskForm.createTaskGroup = res.data.prjTgId
          // this.confirmDialog = false
        })
      },
      handleCurrentChange(no) {
        this.pageNo = no
        // this.outData =
      },
      queryAgentYask() {
        // this.activeNames = ['1','2']
        // this.getData = JSON.parse(sessionStorage.getItem('getData'))
        // this.outData = JSON.parse(sessionStorage.getItem('outData'))
        this.notQuery = false
        if(this.queryAgentNum){
          //提醒
          let a,b
          if(this.idData&&!this.wait){
             a = this.outData1.filter(item=>item.agentNum == this.queryAgentNum)
             b = this.getData1.filter(item=>item.agentNum == this.queryAgentNum)
          }else{
             a = this.outData1.filter(item=>item.agentNum == this.queryAgentNum)
             b = this.getData1.filter(item=>item.agentNum == this.queryAgentNum)
          }
          if(a.length>0){
            this.outData = a
          }else{
            this.outData = []
          }
          if(b.length>0){
            this.getData = b
          }else{
            this.getData = []
          }
        }else{
          if(this.wait != 'wait'){
            this.waitToDo()
          }else{
            this.queryToDoTask()
          }
        }
      },
      toTest(){
        this.isList = !this.isList
        this.todo=!this.todo;
      },
      waitToDo() {
        // this.idData = ''
        // this.$router.push('/workbench/toDoTask')
        if(this.$route.query.taskId){
          this.$router.replace({ query: {} })
        }
        this.queryToDoTask('wait')
      },
      doSome(a,b) {
        // if(a == 'submitTask') {
        //   this.submitTask(b.taskId)
        // }
        // if(a == 'auditTask') {
        //   this.auditTask(b, 1)
        // }
        // if(a == 'NoAuditTask') {
        //   this.auditTask(b, 2)
        // }
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
      // addProjectTaskGroup() {
      //   addProjectTaskGroup(this.groupForm).then((res)=>{
      //     // this.queryProjectTask()
      //     this.createGroupView = false
      //     this.groupForm.prjTgName = ''
      //     this.$message.success('新建任务组成功！')
      //
      //   })
      // },
      queryProjectTask() {
        queryProjectTask({caseId:this.caseData}).then((res)=>{
          this.taskgroupList = res.data.filter(item=>!!item)
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
        this.templateGroupTask = []
        this.taskForm.prjTaskName = ''
        this.taskForm.prjTaskDesc = ''
        // this.templateGroupTask = []
        this.taskForm.createTaskGroup = ''
        queryTaskList({teptId: this.teptId, caseId: this.caseData}).then((res)=>{
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
      templateChange(v) {
        if(v.length == 0){
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
                // console.log(this.taskgroupList.find(item=>item.prjTgName == this.groupNames),1111)
                // return
                if(this.onceCreateGroup){
                  this.newTaskGroup('onceCreate')
                  // this.confirmDialog = true
                }
              //  任务组中没有选中任务模板的任务组
              }
            }else{
            //  该案件任务组中没有模板选中的任务组，是否新建任务组
              if(this.onceCreateGroup){
                // console.log(this.taskgroupList.find(item=>item.prjTgName == this.groupNames),2222)
                // return
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
      deepFlatten(arr) {
        let flatten = (arr)=> [].concat(...arr);
        return flatten(arr.map(x=>Array.isArray(x)? this.deepFlatten(x): x));
      },
      async clickCreateTask() {
        if(this.CompareDate(this.taskForm.beginDate, this.taskForm.endDate)){
          this.$message.error('开始日期不能大于截止日期!')
          // this.taskForm.beginDate = ''
          // this.taskForm.endDate = ''
          return
        }
        // if(!this.taskForm.prjTaskName || !(this.taskForm.createTaskGroup || this.taskForm.prjTgName) || !this.taskForm.beginDate || !this.taskForm.endDate) {
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
          if(!this.snTask && !this.taskForm.executor){
            this.$message.error('请选择任务执行人！')
            return
          }
          if(!(this.taskForm.createTaskGroup || this.taskForm.prjTgName)){
            this.$message.error('请选择任务组！')
            return
          }
        // else if(!this.snTask && !this.taskForm.executor){
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
        assignee = this.taskForm.assignee
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
        await addProjectTask({
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
          executor: executors,
          projectId:this.taskForm.projectId
        })
          // .then(()=>{
          if(this.snTask){
            await submitTask({prjTaskId: this.snPrjTaskId,remark: this.snRemark}).then(()=>{
            })
          }
          if(this.messageType){
              await auditTask({prjTaskId: this.taskId, result: 1 ,checkFlag: 0,remark: this.shenheremark}).then((res)=>{
                this.postMessage()
                // this.queryToDoTask()
                this.$message.success('审核成功！')
                this.closeDialog()
                this.messageType = ''
              })
          }
          if(this.subMessageType == '13' || this.subMessageType == '15'){
            await submitTask({prjTaskId: this.subTaskId, remark: this.subRemark,checkFlag: 0}).then(()=>{
              this.postMessage()
              this.$message.success('提交成功！')
              this.subTaskId = ''
              this.subRemark = ''
              this.subMessageType = ''
              // this.queryToDoTask()
            })
          }
          if(!this.messageType&&this.subMessageType != '13'&&this.subMessageType != '15'){
            // this.postMessage()
            this.queryToDoTask()
          }
          // this.newTaskHasTemplate = false
          this.snPrjTaskId = ''
          this.snRemark = ''
          this.snExecutor = ''
          this.snAssignee = ''
          this.newTask = false
          this.createTaskView = false
          this.snTask = false
          this.shenView = false
          this.$message.success('增加任务成功！')
          Bus.$emit('deleteSelect')
          this.closeDialog()
          this.bossUserId = ''
          this.hasBoss = false
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
        // }).catch((res)=>{
        //   this.$message.error(res.message)
        // })
      },
      submitTask(arr) {
        // return
        if(arr[1] == 1){
          this.subTaskId = arr[0].prjTaskId
          this.subRemark = arr[0].remark
          submitTask({prjTaskId: arr[0].prjTaskId,remark: arr[0].remark}).then((res)=>{
            if(!res.messageType){
              this.$message.success('提交成功！')
              this.closeDialog()
              this.postMessage()
              // this.queryToDoTask()
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
                    this.taskForm.endDate = this.$commonUtils.getDay(1,'-')
                    // this.changeHa('整理案卷')
                    this.taskForm.executor = this.bossUserId
                    this.createTaskView = true
                  }
                })
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
                    this.postMessage()
                    this.closeDialog()
                    this.subMessageType = ''
                    this.$message.success('提交成功！')
                    this.subTaskId = ''
                    this.subRemark = ''
                    // this.queryToDoTask(1)
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
            this.taskForm.assignee = arr[0].assignee
            this.taskForm.executor = arr[0].executor
          if(arr[0].agentNum){
            this.newTask = true
            this.snTask = true
            this.createTaskView = true
            this.$set(this.taskForm,'prjName',arr[0].prjName)
            this.$set(this.taskForm,'prjTgName',arr[0].prjTgName)
            this.$set(this.taskForm,'prjTgName',arr[0].prjTgName)
            this.$set(this.taskForm,'projectId',arr[0].projectId)
            this.$set(this.taskForm,'prjTaskName','')
            // this.projectSign = true
          }else if(arr[0].workType){
            this.snTask = true
            this.snPrjTaskId = arr[0].prjTaskId
            this.snRemark = arr[0].remark
            this.snAssignee = arr[0].assignee
            this.snExecutor = arr[0].executor
            this.taskForm.executor = arr[0].executor
            this.taskForm.assignee = arr[0].assignee
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
            if(arr[0].caseId){
              queryProjecTeptId({caseId:arr[0].caseId}).then(res=>{
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
                console.log('error')
              })
              // queryProjectTask({caseId:arr[0].caseId}).then(res=>{
              //
              //   if(res.data.find(i=>i.teptId == arr[0].teptId)){
              //     this.teptName = res.data.find(i=>i.teptId == arr[0].teptId).teptName
              //   }
              // })
              // this.teptId = arr[0].teptId
              // queryTaskList({teptId: arr[0].teptId,caseId: arr[0].caseId}).then(res=>{
              //   this.templateGroupTask = res.data.filter(item=>!!item)
              //   this.templateGroupTask = (this.templateGroupTask).map(item=>({
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
              //   this.taskTemplateView = false
              // })
            }
          }

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
      initTaskForm() {
        this.taskgroupList = []
        this.createTaskView = false
        // this.confirmDialog = false
        this.onceCreateGroup = true
        this.templateGroupTask = []
        this.taskForm.prjTaskName = ''
        this.taskForm.prjTaskDesc = ''
        // this.templateGroupTask.length = 0
        this.taskForm.createTaskGroup = ''
        this.teptName = ''
        this.taskList = []
        this.taskForm.date = ''
        if(this.messageType!=11){
          auditTask({prjTaskId: this.taskId, result: 1 ,checkFlag: 0,remark: this.shenheremark}).then(()=>{
            this.$message.success('审核成功')
            this.postMessage()
            // this.queryToDoTask()
            this.closeDialog()
            this.messageType = ''
          })
        }

      },
      // cancelAud(){
      //   this.createGroupView = false
      // },




      fileType(type) {
        this.activeName = '1'
        this.rightView = true
        // this.copyTemplFileView = true
        this.querytepTaskFile(this.edtiTasksData)
      },
      queryMaterialDocType() {
        queryMaterialDocType().then(res=>{
          this.docTypeList = res.data
        })
      },
      updateData(caseId,prjTaskId){
        queryTaskById({prjTaskId}).then(res=>{
          if(res.data.teptId) {
            this.teptId = res.data.teptId
            this.teptName = res.data.teptName
          }
          this.edtiTasksData = res.data
          this.edtiTasksData.createTaskGroup = this.edtiTasksData.prjTgId
          let arr = []
          if(this.edtiTasksData.itemList&&this.edtiTasksData.itemList.length>0){
            this.edtiTasksData.itemList.forEach((i, index)=>{
              arr.push(i.prjIemName)
            })
            this.edtiTasksData.itemList = arr.join('\n')
          }
          if(caseId){
            queryProjectTask({caseId}).then(res=>{
              this.taskgroupList = res.data.filter(item=>!!item)
              // this.editTaskgroupList = this.taskgroupList
            })
            this.teptId&&(queryTaskList({teptId: this.teptId,caseId}).then(res=>{
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
              // f=='edit' ? this.editGroupTask = this.templateGroupTask : this.editGroupTask = []
            }))
          }
        })


        // if(a&&a!='add'&&a!='delete'){
        //   queryProjectTask({caseId:a}).then(res=>{
        //     // if(res.data.find(i=>i.teptId)){
        //     //   this.newTaskHasTemplate = true
        //     //   this.teptId = res.data.find(i=>i.teptId).teptId
        //     // }
        //   this.taskgroupList = res.data.filter(item=>!!item)
        //   let agList = this.taskgroupList.map(i=>{
        //     if(i.teptId){
        //       if(i.taskList){
        //         i.taskList.forEach(j=>{
        //           if(i.prjTgId){
        //             j.prjTgId = i.prjTgId
        //           }
        //           // j.teptId = i.teptId
        //         })
        //         return i.taskList
        //       }else{
        //         return i
        //       }
        //     }else{
        //       if(i.taskList){
        //         // i.taskList.forEach(j=>{
        //         //   j.teptId = i.teptId
        //         // })
        //         return  i.taskList
        //       }else{
        //         return i
        //       }
        //     }
        //   })
        //   this.edtiTasksData = this.deepFlatten(agList).find(i=>i.prjTaskId == this.shenheTaskId )
        //     this.edtiTasksData.createTaskGroup = this.edtiTasksData.prjTgId
        //     if(data){
        //       this.edtiTasksData.assignee = data.assignee
        //       this.edtiTasksData.executor = data.executor
        //       this.edtiTasksData.appUserId = data.appUserId
        //       // console.log(this.edtiTasksData,222)
        //     }
        //     // if(this.editTaskView){
        //     //     let arr = []
        //     //   if(this.edtiTasksData.itemList&&this.edtiTasksData.itemList.length>0){
        //     //     this.edtiTasksData.itemList.forEach((i, index)=>{
        //     //       arr.push(index+1+'.'+i.prjIemName)
        //     //     })
        //     //     this.edtiTasksData.itemList = arr.join('\n')
        //     //   }
        //     // }
        //   let arr = []
        // if(this.edtiTasksData.itemList&&this.edtiTasksData.itemList.length>0){
        //   this.edtiTasksData.itemList.forEach((i, index)=>{
        //     arr.push(i.prjIemName)
        //   })
        //   this.edtiTasksData.itemList = arr
        // }
        // })
        // }
      },
      auditTaskTwo(f,data){
        // if(f == '分配') {
        //   this.excutorView = true
        //   this.assignData = data
        //   this.startDate = data.startDate
        //   this.choseEndDate = data.endDate
        //   this.choseEndDate1 = data.endDate
        //   // this.queryPeopleList()
        //   return
        // }
        if(f == '删除'){
          this.$confirm('此操作将永久删除该任务, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          deleteProjectTask({prjTaskId:data.taskId}).then(()=>{
              this.$message.success('删除成功')
              // this.queryToDoTask()
              this.postMessage()
            })
          })
          return;
        }
        this.title = f
        if(!data.workType && !data.caseId) {
          this.editTaskView = false
          this.projectSign = true
          this.detailPrjTaskId = data.prjTaskId
        }else{
          this.editTaskView = true
          this.projectSign = false
        }
        this.doCaseId = data.caseId

        // if(f=='修改' || f =='删除' || f=='查看'){
        //   this.title = f
        //   this.shenView = false
        // }else{
        //   this.shenView = true
        //   this.editTaskView = false
        // }

        // if(f=='审核'){
        //   this.dialogName = '审核'
        // }
        // if(f=='提交'){
        //   this.dialogName = '提交'
        // }
        // if(f=='申请延期'){
        //   this.dialogName = '申请延期'
        // }
        // if(f=='审批延期'){
        //   this.dialogName = '审批延期'
        //   // queryTaskUserList({caseId: data.caseId}).then(res=> {
        //   //   this.peopleList = res.data
        //   // })
        // }
        // if(f=='查看'){
        //   this.dialogName = '查看'
        // }
        // if(f=='修改' || f=='查看'){
        //   this.editTaskView = true
        //   this.shenView = false
        // }


        // this.modelTeptId = data.teptId
        this.modelFileListView = false
        this.shenheTaskId = data.taskId
        // this.queryMaterialDocType()
        f != '删除'&&this.queryPrjTask(data,'edit')
      },
      queryPrjTask(data,f){
        //任务详情
        // this.teptId = ''
        // this.teptName = ''
        // this.templateGroupTask = []

        queryTaskById({prjTaskId:data.prjTaskId}).then(res=>{
          if(res.data.teptId) {
            this.teptId = res.data.teptId
            this.teptName = res.data.teptName
          }
          this.prjName = res.data.prjName || ''
          let projectId = res.data.projectId
          this.$set(this.edtiTasksData,'projectId',res.data.projectId)
          res.data.workType ? this.workSign = true : this.workSign = false
          // if(!res.data.workType && !data.caseId){
          //   this.projectSign = true
          //   this.detailPrjTaskId = data.prjTaskId
          //   this.workSign = false
          // }else{
          //   this.projectSign = false
          // }

          this.edtiTasksData = res.data
          this.edtiTasksData.createTaskGroup = this.edtiTasksData.prjTgId
          this.edtiTasksData.caseId = data.caseId
          let arr = []
          if(this.edtiTasksData.itemList&&this.edtiTasksData.itemList.length>0){
            this.edtiTasksData.itemList.forEach((i, index)=>{
              arr.push(i.prjIemName)
            })
            this.edtiTasksData.itemList = arr.join('\n')
          }
          //任务组列表
          data.caseId&&queryProjectTask({caseId:data.caseId}).then(res=>{
            this.taskgroupList = res.data.filter(item=>!!item)
            this.editTaskgroupList = this.taskgroupList
          })
          //模板任务组和任务
          if(f!='create'&&this.teptId){
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
          }

          //项目或案件所用的模板
          if(f == 'create'){
            queryProjecTeptId({projectId}).then(res=>{
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
            })
          }

        })
        // alert(this.templateGroupTask.length)
      },



      querytepTaskFile(a) {
        // this.edtiTasksData.modelFileList = []
        if(!a.teptId){
          return
        }
        queryTaskList({teptId: a.teptId}).then(res=>{
          let data = res.data
          let taskIdArr = []
          if(a&&a.subTaskList){
            a.subTaskList.forEach(item=>{
              taskIdArr.push(item.taskDefineId)
            })
          }else if(a&&a.taskDefineId){
            taskIdArr.push(a.taskDefineId)
          }else {
            taskIdArr = []
          }
          let allFileList = []
          data.forEach(i=>{
            allFileList.push(...i.taskDefineList)
          })
            let list = []
          taskIdArr.forEach(it=>{
            if(allFileList&&allFileList.find(item => item.taskDefineId == it)){
              list.push(allFileList.find(item => item.taskDefineId == it).taskFileList)
            }
          })
          if(this.deepFlatten(list)){
            this.edtiTasksData.modelFileList = this.deepFlatten(list)
          }
        })
      },

       auditTask(items, e) {
        let item = JSON.parse(JSON.stringify(items))
         this.taskId = item.prjTaskId
        this.groupForm.caseId = item.caseId
        this.caseData = item.caseId
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
             this.postMessage()
             // this.queryToDoTask()
             this.closeDialog()
             this.$message.success('审核成功！')
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
                    this.postMessage()
                    this.messageType = ''
                    this.$message.success('审核成功！')
                    this.closeDialog()
                    // this.queryToDoTask()
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
                    this.postMessage()
                    this.closeDialog()
                    // this.queryToDoTask()
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
              this.teptId = ''
              this.teptName = ''
              this.templateGroupTask = []
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
                  this.taskForm.prjTaskName = ''
                  this.hasBoss = false
                  this.createTaskView = true
                })
                .catch((action)=>{
                  // alert('整理案卷')
                  if(action == 'cancel'){
                    this.end = true
                    this.hasBoss = true
                    this.teptId = item.teptId
                    this.teptName = item.teptName
                    this.taskForm.prjTaskName = '返回客户组组长分配任务'
                    this.taskForm.prjTgName = '返回客户组组长分配任务'
                    this.taskForm.endDate = this.$commonUtils.getDay(1,'-')
                    // this.changeHa('整理案卷')
                    this.taskForm.executor = this.bossUserId
                    this.createTaskView = true
                  }
                })
            }
            if(!res.messageType){
              this.postMessage()
              this.$message.success('审核成功！')
              this.closeDialog()
              // this.queryToDoTask(1)
            }
          })
        }
        if(e==2&&!item.workType){
          // this.choosePeople = true
          // this.shenheEndDate = item.endDate
          // this.executor = item.executor
          // queryTaskUserList({caseId: this.groupForm.caseId}).then(res=> {
          //   this.peopleList = res.data
          // })
          // console.log(item)
          auditTask({prjTaskId: item.prjTaskId, result: 2, executor: item.executor,remark: item.shenheremark,endDate: item.shenheEndDate}).then(()=>{
            this.postMessage()
            this.$message.success('审核成功！')
            this.messageType = ''
            // this.queryToDoTask()
            this.closeDialog()
          })
        }
      },
      auditTaskNo() {
          auditTask({prjTaskId: this.taskId, result: 2, executor: this.executor,remark: this.shenheremark,endDate: this.shenheEndDate}).then(()=>{
            this.choosePeople = false
            this.postMessage()
            this.$message.success('审核成功！')
            this.messageType = ''
            // this.queryToDoTask(1)
            this.closeDialog()
          })

      },
      changeRemindColor(e) {
        if(e.remind === 1){
          return {
            fontSize: "30px",
            color: "#FFEEBC"
          }
        }else if(e.remind === 2){
          return {
            fontSize: "30px",
            color: "#FFEEBC"
          }
        }else if(e.remind === 3) {
          return {
            fontSize: "30px",
            color: "orange"
          }
        }else if(e.remind === 4) {
          return {
            fontSize: "30px",
            color: "red"
          }
        }else if(e.remind === 100){
          return {
            fontSize: "30px",
            color: "red"
          }
        }
      },
      ChangRowColor({data}){
        if(data.delayFlag == 1|| data.delayFlag == 2|| data.remind === 4||data.remind === 100){
          return { 'color': 'red' }
        }
        if(data.remind === 3){
          return { 'color': 'orange' }
        }
        if(data.remind === 2){
          return { 'color': 'yellow' }
        }
        if(data.remind === 1){
          return { 'color': 'yellow' }
        }
      },
      currentRow({row,rowIndex}) {
        row.index = rowIndex
        if(row.delayFlag == 1|| row.delayFlag == 2|| row.remind === 4||row.remind === 100){
          return 'color-red'
        }
        if(row.remind === 3){
          return 'color-orange'
        }
        if(row.remind === 2){
          return 'color-yellow'
        }
        if(row.remind === 1){
          return 'color-yellow'
        }
        // if(row.row.taskId == this.idData) {
        //   return 'current-row'
        // }
      },
      handTaskData(f) {
        this.idData = f
        this.outData = this.outData1
        this.getData = this.getData1
        this.getData.forEach((item,index)=>{
          if(item.taskId == this.idData){
            this.activeNames = ['2']
            this.getData.splice(index,1)
            this.getData.unshift(item)
          }
        })
        this.outData.forEach((item,index)=>{
          if(item.taskId == this.idData){
            this.activeNames = ['1']
            this.outData.splice(index,1)
            this.outData.unshift(item)
          }
        })
      },
      queryToDoTask(a) {
        if(this.editTaskView && this.edtiTasksData.prjTaskId){
          queryTaskById({prjTaskId:this.edtiTasksData.prjTaskId}).then(res=> {
            this.edtiTasksData = res.data
            this.edtiTasksData.createTaskGroup = res.data.prjTgId
          })
        }
        this.columnDefs1 = [...this.defaultcolumnDefs1, ...this.preferenceList.map(item => ({
          headerName: item.label,
          field: item.prop,
          resizable: true,
          sortable: true,
          width: item.width,
          filter: 'agSetColumnFilter',
          cellRenderer: this.cellRenderer1,
          menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
          enableRowGroup: true,
          filterParams: {
            newRowsAction: 'keep',
            comparator: (a, b) => {
              return this.$commonUtils.sort(a, b, item.value)
            }
          }
        }))]
        this.columnDefs2 = [...this.defaultcolumnDefs2, ...this.preferenceList.map(item => ({
          headerName: item.label,
          field: item.prop,
          resizable: true,
          sortable: true,
          width: item.width,
          filter: 'agSetColumnFilter',
          cellRenderer: this.cellRenderer2,
          menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
          enableRowGroup: true,
          filterParams: {
            newRowsAction: 'keep',
            comparator: (a, b) => {
              return this.$commonUtils.sort(a, b, item.value)
            }
          }
        }))]
        this.notQuery = true
        if(a=='wait'){
          this.wait = 'wait'
          this.idData = ''
          }
        Promise.all([queryToDoTask({taskType: 1, pageSize: 10000000}),queryToDoTask({taskType: 2, pageSize: 10000000})]).then(res=>{
          this.outData = res[0].data
          this.getData = res[1].data
          this.getData1 = JSON.parse(JSON.stringify(this.getData))
          this.outData1 = JSON.parse(JSON.stringify(this.outData))
          if(this.idData && a!='wait'){
            this.handTaskData(this.idData)
          }
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


  >>> .el-autocomplete-suggestion{
    width: 500px!important;
  }
  >>>.el-table .current-row {
    color: orange!important;
  }
  >>>.el-table .color-red {
    color: red!important;
  }
  >>>.el-table .color-orange{
    color: orange!important;
  }
  /*>>>.el-table .color-yellow{*/
  /*  color: 	#87CEEB!important;*/
  /*}*/
  .abow_dialog {
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

  /*.pdfDialog  /deep/{*/
  /*z-index: 3000;*/
  /*.el-dialog{*/
  /*  z-index: 3000;*/
  /*  height: 100%;*/
  /*  overflow-y: auto;*/
  /*  display: flex;*/
  /*  !*flex-direction: column;*!*/
  /*  .el-dialog__body {*/
  /*    flex: 1;*/
  /*    .el-textarea{*/
  /*      height: 100%;*/
  /*      textarea{*/
  /*        height: 100%;*/
  /*      }*/
  /*    }*/
  /*  }*/
  /*  }*/
  /*}*/
  .task-list {}
  /*.table {*/
  /*  .table >>> .el-table__header-wrapper {*/
  /*    height: 90px;*/
  /*  }*/
  /*  .table >>> .el-table__body-wrapper {*/
  /*    height: calc(100% - 90px) !important;*/
  /*  }*/
  /*}*/


  .box{
	  margin-top: 20px;
    width: 100%;
    height: 700px;
    transform-style: preserve-3d;
    transition: transform 1s;
  }
  .card{
    //display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;//后面的藏起来, 不然会有小叠加..
    border-radius: 20px;
  }
  .front{
      //background-position: -24px -23px;
  }
  .back{
    transform: rotateY(180deg);
      //background-position: -287px -23px;
  }
  .flipped{
    transform: rotateY(180deg);
  }


  .template-collapse-item{
        position: relative;
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
          .el-icon-edit {
            position: absolute;
            left: 50%;
            top: 20px;
            font-size: 16px;
            transform: translateX(-250px) translateY(-6px);
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
    >>>.el-table{
      td{
        padding: 0;
      }
      th{
        padding: 0;
      }
      .cell {
        height: 30px;
        line-height: 30px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
      }
    }
  .shenpi, .executor {
    .el-date-editor{
      .el-input__inner{
        width: 150px;
      }
    }
    >>>.el-input__inner {
      height: 30px;
      width: 150px;
      line-height: 30px;
    }
    >>>.el-input__icon{
      line-height: 30px;
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
      .bott{
        border-bottom: 1px solid #ccc;
      }
    }
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

  .box-card1  {
    /*>>>.el-tabs__body{*/
    /*  background-color: red;*/
    /*  height: 340px;*/
    /*}*/
  }
  .tables{
    div{
      border: 1px solid #ccc;
      border-top: none;
      text-align: center;
    }
  }
  .inline-input{
    >>>.el-input__inner{
      /*width: 200%;*/
    }
  }
  /*>>>.el-autocomplete-suggestion{*/
  /*  li{*/
  /*    padding: 0;*/
  /*  }*/
  /*  padding: 0;*/
  /*}*/
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
  .el-table{
    >>>th{
      background-color: #f5f5f5!important;
    }
    >>>.cell{
      height: auto!important;
    }
  }
  .el-message-box{
    width: 500px!important;
  }

  .contextmenu {
  margin: 0;
  background: #fff;
  z-index: 3000;
  position: fixed;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
}

.contextmenu li {
  margin: 0;
  padding: 7px 16px;
  cursor: pointer;
}
</style>
