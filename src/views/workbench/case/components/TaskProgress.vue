<template>
    <div class="task-progress">
<!--      <el-button type="primary" @click="createTaskView = true">新建</el-button>-->
      <div class="task-group" style="margin-top:5px;min-height: 730px">
        <el-card class="box-card" shadow="always" style="margin: 10px;margin-bottom: 0; min-height: 730px;">
          <div slot="header" class="clearfix" style="">
<!--            <div style="display: inline-block;height: 40px;line-height: 40px; color: #409EFF">任务组</div>-->
            <el-button style="float: right;" @click.native="deriveList" type="primary" size="small">导出</el-button>
            <el-button style="float: right;margin-right: 10px" @click.native="state=!state" type="primary" size="small">切换视图</el-button>
            <el-button style="float: right;margin-right: 10px" @click.native="handleCommand" type="primary" size="small">新建</el-button>
            <el-button style="float: right;margin-right: 10px" @click.native="checkTept" type="primary" size="small">复制模板</el-button>


<!--            <el-dropdown @command="handleCommand" style="float: right">-->
<!--              <el-button type="primary" size="small">-->
<!--                新建<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
<!--              </el-button>-->
<!--              <el-dropdown-menu slot="dropdown">-->
<!--                <el-dropdown-item command="createGroupView">任务组</el-dropdown-item>-->
<!--                <el-dropdown-item command="createTaskView">任务</el-dropdown-item>-->
<!--              </el-dropdown-menu>-->
<!--            </el-dropdown>-->
<!--            <el-button-->
<!--                      style="float: right;height: 33px;margin-right: 20px;width: 73px;"-->
<!--                      size="small"-->
<!--                      type="primary"-->
<!--                      @click="addTaskHours()">计时</el-button>-->
<!--            <el-button-->
<!--                      style="float: right;height: 33px;margin-right: 20px;width: 73px;"-->
<!--                      size="small"-->
<!--                      type="primary"-->
<!--                      @click="upTempFile">上传文件</el-button>-->
          </div>
          <TaskGantt v-if="taskLists.length" v-show="!state" :taskList="taskLists"></TaskGantt>
<!--          <el-collapse v-show="state" ref="collapse" v-model="activeNames" style="padding-bottom: 50px">-->
<!--          <el-collapse-item class="template-collapse-item" :name="index" v-for="(item, index) in taskgroupList" :key="index">-->
<!--            <span  slot="title" class="collapse-title">-->
<!--&lt;!&ndash;              <el-tooltip @dblclick.native="editGroupName(item)" effect="light" content="双击修改" placement="left">&ndash;&gt;-->
<!--&lt;!&ndash;                <span>{{index+1}}.{{item.prjTgName}}</span>&ndash;&gt;-->
<!--&lt;!&ndash;              </el-tooltip>&ndash;&gt;-->


<!--              <div style="display: flex;justify-content: space-between">-->
<!--                <div style="width: 200px"><span>{{index+1}}.{{item.prjTgName}}</span></div>-->
<!--                <div><span style="margin-left: 20px; color: #ccc">任务进度{{computedSuccess(item.taskList?item.taskList:[])}}/{{(item.taskList?item.taskList:[]).filter(item=>item.prjTaskId).length}}</span></div>-->
<!--                <div style="margin-right: 40px">-->
<!--                  <el-tooltip effect="light" content="修改任务组" placement="right"><i class="el-icon-edit" @click.stop="editGroupName(item)"></i></el-tooltip>-->
<!--                  <el-tooltip effect="light" content="删除任务组" placement="right"><i class="el-icon-delete" @click.stop="delGroup(item)"></i></el-tooltip>-->
<!--                </div>-->



<!--              </div>-->

<!--            </span>-->
<!--            <div v-if="!Array.isArray(agList[index])" style="display: block; padding:  20px;">当前任务组没有任务， <span style="color:#409EFF;cursor: pointer;" @click="handleCommand('createTaskView')">新建任务</span></div>-->
<!--&lt;!&ndash;            子任务表格&ndash;&gt;-->

<!--            <div v-else class="table" style="width: 96%;margin: 0px 30px">-->
<!--              <el-table-->
<!--                @row-dblclick="rowDbClick"-->
<!--                :data="Array.isArray(agList[index])?agList[index]:[]"-->
<!--                border-->
<!--                max-height="500"-->
<!--                style="width: 100%">-->
<!--                <el-table-column-->
<!--                  type="index"-->
<!--                  width="50"-->
<!--                >-->
<!--                </el-table-column>-->
<!--                <el-table-column-->
<!--                  label="任务名称"-->
<!--                  width="225">-->
<!--                  <template slot-scope="scope">-->
<!--                    <span class="overflow-hidden">{{scope.row.prjTaskName}}</span>-->
<!--                  </template>-->
<!--                </el-table-column>-->
<!--                <el-table-column-->
<!--                  label="任务检查项"-->
<!--                >-->
<!--                  <template slot-scope="scope">-->
<!--                      <span class="overflow-hidden" v-for="(it, index) in scope.row.itemList" :key="index">-->
<!--                        <p>-->
<!--                          <span>{{index+1}}.</span><span>{{it.prjIemName}}</span>-->
<!--                        </p>-->

<!--                      </span>-->

<!--                  </template>-->
<!--                </el-table-column>-->
<!--                <el-table-column-->
<!--                  label="任务描述"-->
<!--                >-->
<!--                  <template slot-scope="scope">-->
<!--                    <span v-if="scope.row.prjTaskDesc">-->
<!--                      <span class="overflow-hidden" v-for="(it, index) in scope.row.prjTaskDesc.split('\n')" :key="index">-->
<!--                        <p>{{it}}</p>-->
<!--                      </span>-->
<!--                    </span>-->

<!--                  </template>-->
<!--                </el-table-column>-->
<!--&lt;!&ndash;                <el-table-column&ndash;&gt;-->
<!--&lt;!&ndash;                  label="文件"&ndash;&gt;-->
<!--&lt;!&ndash;                  width="200"&ndash;&gt;-->
<!--&lt;!&ndash;                >&ndash;&gt;-->
<!--&lt;!&ndash;                  <template slot-scope="scope">&ndash;&gt;-->
<!--&lt;!&ndash;                    <div class="file-list">&ndash;&gt;-->
<!--&lt;!&ndash;                      <div v-for="(file,index) in scope.row.fileList">&ndash;&gt;-->
<!--&lt;!&ndash;                        <p style="width: 100%;display: flex;justify-content: left;align-items: center">&ndash;&gt;-->
<!--&lt;!&ndash;                          <span class="file-name">{{file.materialName}}</span> <span class="el-icon-view" @click="preView(file)"></span>&ndash;&gt;-->
<!--&lt;!&ndash;                        </p>&ndash;&gt;-->
<!--&lt;!&ndash;                      </div>&ndash;&gt;-->
<!--&lt;!&ndash;                    </div>&ndash;&gt;-->

<!--&lt;!&ndash;                  </template>&ndash;&gt;-->
<!--&lt;!&ndash;                </el-table-column>&ndash;&gt;-->
<!--                <el-table-column-->
<!--                  prop="endDate"-->
<!--                  label="任务截止日期"-->
<!--                  width="120"-->
<!--                >-->
<!--                  <template slot-scope="scope">-->
<!--&lt;!&ndash;                    <el-date-picker&ndash;&gt;-->
<!--&lt;!&ndash;                      style="width: 100%"&ndash;&gt;-->
<!--&lt;!&ndash;                      ref="input"&ndash;&gt;-->
<!--&lt;!&ndash;                      v-model="scope.row.endDate"&ndash;&gt;-->
<!--&lt;!&ndash;                      type="date"&ndash;&gt;-->
<!--&lt;!&ndash;                      @change="changeDate(scope.row, $event)"&ndash;&gt;-->
<!--&lt;!&ndash;                      value-format="yyyy-MM-dd"&ndash;&gt;-->
<!--&lt;!&ndash;                      placeholder="选择日期">&ndash;&gt;-->
<!--&lt;!&ndash;                    </el-date-picker>&ndash;&gt;-->
<!--                    <span>{{scope.row.endDate}}</span>-->
<!--                  </template>-->
<!--                </el-table-column>-->
<!--                <el-table-column-->
<!--                  label="任务创建人"-->
<!--                  width="95">-->
<!--                  <template slot-scope="scope">-->
<!--                    <span>{{scope.row.creatorName  }}</span>-->
<!--                  </template>-->
<!--                </el-table-column>-->
<!--                <el-table-column-->
<!--                  label="任务分配人"-->
<!--                  width="95">-->
<!--                  <template slot-scope="scope">-->
<!--                    <span>{{scope.row.assigneeName?scope.row.assigneeName:'无'  }}</span>-->

<!--                  </template>-->
<!--                </el-table-column>-->
<!--                <el-table-column-->
<!--                  label="当前任务执行人"-->
<!--                  width="150">-->
<!--                  <template slot-scope="scope">-->
<!--                    <div>{{scope.row.executorName }}</div>-->

<!--                  </template>-->
<!--                </el-table-column>-->
<!--                <el-table-column-->
<!--                  label="全部任务执行人"-->
<!--                  width="150">-->
<!--                  <template slot-scope="scope">-->
<!--                    <div v-if="scope.row.executorNames&&!scope.row.executorNames.includes(',')">{{scope.row.executorNames}}</div>-->
<!--                    <div v-if="scope.row.executorNames&&scope.row.executorNames.includes(',')">-->
<!--                      <div v-for="(item, index) in scope.row.executorNames.split(',')">{{item}}</div>-->
<!--                    </div>-->
<!--                  </template>-->
<!--                </el-table-column>-->
<!--                <el-table-column-->
<!--                  label="任务状态"-->
<!--                  width="80">-->
<!--                  <template slot-scope="scope">-->
<!--&lt;!&ndash;                    {{scope.row.taskStatus}}&ndash;&gt;-->
<!--                    <span>{{scope.row.taskStatus}}</span>-->
<!--&lt;!&ndash;                    <el-input v-model="scope.row.taskStatus" :placeholder="scope.row.taskStatus"></el-input>&ndash;&gt;-->
<!--                  </template>-->
<!--                </el-table-column>-->
<!--                <el-table-column label="操作" width="60">-->
<!--                  <template slot-scope="scope">-->
<!--                    <el-dropdown @command="(e)=>caozuo(e, scope.row, index)" trigger="click" placement="bottom-start">-->
<!--                        <i class="el-icon-more" style="font-size: 20px"></i>-->
<!--                      <el-dropdown-menu v-if="scope.row.delayFlag==2" slot="dropdown">-->
<!--                        <el-dropdown-item command="审批延期">审批延期</el-dropdown-item>-->
<!--                        <el-dropdown-item command="修改">修改</el-dropdown-item>-->
<!--                        <el-dropdown-item v-if="scope.row.creator==$store.getters.userId" command="删除">删除</el-dropdown-item>-->
<!--                      </el-dropdown-menu>-->
<!--                      <el-dropdown-menu v-else slot="dropdown">-->
<!--                        <el-dropdown-item v-if="(scope.row.nextOperation == 1 || scope.row.nextOperation == 2)" command="分配">分配</el-dropdown-item>-->
<!--                        <el-dropdown-item v-if="scope.row.nextOperation==2" command="提交">提交</el-dropdown-item>-->
<!--                        <el-dropdown-item v-if="scope.row.nextOperation==3" command="审核">审核</el-dropdown-item>-->
<!--                        <el-dropdown-item v-if="scope.row.delayFlag==1" command="申请延期">申请延期</el-dropdown-item>-->
<!--                        <el-dropdown-item command="修改">修改</el-dropdown-item>-->
<!--                        <el-dropdown-item v-if="scope.row.creator==$store.getters.userId" command="删除">删除</el-dropdown-item>-->
<!--                      </el-dropdown-menu>-->
<!--                    </el-dropdown>-->


<!--                  </template>-->
<!--                </el-table-column>-->
<!--              </el-table>-->
<!--            </div>-->
<!--          </el-collapse-item>-->
<!--        </el-collapse>-->
<!--          任务组和任务列表-->
          <caseTaskList :case-data="taskgroupList" @dbclick="dbclick" @update="queryProjectTask" :case-id="taskDataCaseId"></caseTaskList>
        </el-card>
      </div>
<!--      新建任务-->
      <div class="task-dialog">
        <el-dialog
          title="新建任务"
          center
          top="0"
          height="500"
          :visible.sync="createTaskView"
          width="80%"
          :append-to-body="false"
          :modal="false"
          v-dialogDrag
          :close-on-click-modal="false"
          :before-click="clearData"
        >
          <div class="taskDetail">
            <div class="wrap_left">
              <div class="model_wrap">
      <!--          <el-breadcrumb separator="/">-->
<!--                <el-breadcrumb separator="/">-->
<!--                  <el-breadcrumb-item >{{taskForm.prjName}}</el-breadcrumb-item>-->
<!--                  <el-breadcrumb-item>{{taskForm.prjTgName}}</el-breadcrumb-item>-->
<!--                </el-breadcrumb>-->
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
<!--                  <el-button  type="primary" size="mini" :disabled="end" @click="taskTemplateView = true">选择</el-button>-->
<!--                  <el-button  type="primary" size="mini" :disabled="end" @click="noTemplate">删除</el-button>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--              <el-col :span="12" style="" v-if="!teptName">-->
<!--                <el-form-item class="group-task" label="选择任务组:" prop="createTaskGroup">-->
<!--&lt;!&ndash;                  <div v-if="taskgroupList.length<1">&ndash;&gt;-->
<!--&lt;!&ndash;                    <el-input placeholder="请填写任务组:"></el-input>&ndash;&gt;-->
<!--&lt;!&ndash;                  </div>&ndash;&gt;-->
<!--                  <div>-->
<!--                    <el-select :disabled="end" allow-create filterable v-model="taskForm.createTaskGroup"  placeholder="请选择">-->
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
<!--                    <el-select clearable :disabled="end" allow-create filterable v-model="taskForm.createTaskGroup" @change="changeHa" placeholder="请选择">-->
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
<!--                  <el-input :disabled="end" type="textarea" :autosize="{ minRows: 1, maxRows: 4}" v-model="taskForm.prjTaskName" clearable></el-input>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--              <el-col :span="12">-->
<!--                <el-form-item label="任务执行人:" prop="executor">-->
<!--                  <div>-->
<!--                      <el-select clearable v-model="taskForm.executor" :disabled="snTask||hasBoss" placeholder="请选择执行人" filterable>-->
<!--                      <el-option-->
<!--                        v-for="item in peopleList"-->
<!--                        :key="item.id"-->
<!--                        :label="item.fullname"-->
<!--                        :value="item.id">-->
<!--                        <UserIconAndUserName :user-id="item.id"></UserIconAndUserName>-->
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
            <el-dialog class="abow_dialog" :visible.sync="taskTemplateView" append-to-body width="80%" height="80%">
              <TemplateList ref="tempList" @templateData="templateData" class="list"></TemplateList>
              <div slot="footer" class="dialog-footer">
<!--                <el-button @click="taskTemplateView = false">取 消</el-button>-->
                <el-button @click="cancelChose" size="mini">取 消</el-button>
                <el-button type="primary" @click="leadIn" size="mini">选 择</el-button>
              </div>
            </el-dialog>

        </el-dialog>
      </div>

<!--      新建任务弹框-->
      <div class="">
        <create-new-task
          :case-type-id="caseTypeId"
          v-if="taskDataCaseId"
          :t-name="teptName"
          :t-tept-id="teptId"
          :tep-group-list="templateGroupTask"
          :group-list="taskgroupList"
          @closeView="closeView"
          :case-id="taskDataCaseId"
          :task-view="createView"
          :judgeRank="judgeRank"
        ></create-new-task>

      </div>
      <!--   任务查看弹框   -->
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
        <el-form class="edit-task-dialog" label-width="120px">
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
              <el-form-item label="任务描述:" style="width: 100%;">
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
<!--      修改任务弹框-->
      <edit-task
        ref="edit"
        :edit-data="edtiTasksData"
        :edit-view="editTaskView"
        :id="editTeptId"
        :title="title"
        :name="editTeptName"
        :task-data-case-id="taskDataCaseId"
        :group-list="taskgroupList"
        :tep-group-list="editGroupTask"
        @tijiao="tijiao"
        @shenHe="shenHe"
        @update="updateTask"
        @handleTask="handleTask"
        @editTaskViewClos="editTaskViewClos"
      ></edit-task>
<!--      选择执行人弹框-->
      <el-dialog
        title="任务执行人"
        :visible.sync="excutorView"
        width="25%"
        append-to-body
        :modal="false"
        height="500"
        center
        top="0"
        v-dialogDrag
        :close-on-click-modal="false"
      >
        <div style="width:100%;display: flex;justify-content: center;align-items: center">
          <el-form label-width="120px">
            <el-form-item label="执行人:">
              <virtual-select clearable  :data="$store.getters.userList" v-model="executor"  filterable :render="(data)=>$commonUtils.UserRender(data)" >
              </virtual-select>
            </el-form-item>
            <el-form-item label="常用执行人:">
              <localExector @getUserId="(e)=>executor=e"></localExector>
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
<!--      修改任务上传框-->
      <el-dialog
        title="上传文件"
        :visible.sync="rightView"
        width="30%"
        center
        top="0"
        height="500"
        v-dialogDrag
        :before-close="copyTemplClose"
      >
        <div class="edit-file">
<!--                  <i class="el-icon-close" @click="clickClose"></i>-->
                  <el-tabs v-model="activeName" type="border-card" class="" @tab-click="handleClick">
                    <el-tab-pane label="本地文件" name="1">
                      <div class="file-type" style="display: flex; justify-content: center;align-items: center">
                        <div style="display: flex;justify-content: left;align-items: center">
                          <span style="flex: 2;text-align: right">文件类型:</span>
                          <el-select style="flex: 4" default-first-option v-model="fileDocId" placeholder="请选择" filterable clearable @change="handleChangeDoc">
                            <el-option v-for="item in docTypeList" :key="item.doctId" :label="item.typeName" :value="item.doctId">
                            </el-option>
                          </el-select>
                          <el-select style="flex: 4;padding-right: 10px" default-first-option v-model="materialTypeId" placeholder="请选择" filterable clearable>
                            <el-option v-for="item in typeNameList" :key="item.materialTypeId" :label="item.typeName" :value="item.materialTypeId">
                            </el-option>
                          </el-select>
                        </div>

                    </div>
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
                    <el-tab-pane label="模板文件" name="2">
                      <el-card class="box-card box-card1">
                        <div slot="header" class="">
                          <div class="file-type" style="display: flex; justify-content: center;align-items: center">
                            <div style="display: flex;justify-content: left;align-items: center">
                              <span style="flex: 2;text-align: right">文件类型:</span>
                              <el-select style="flex: 3.5" default-first-option v-model="fileDocId" placeholder="请选择" filterable clearable @change="handleChangeDoc">
                                <el-option v-for="item in docTypeList" :key="item.doctId" :label="item.typeName" :value="item.doctId">
                                </el-option>
                              </el-select>
                              <el-select style="flex: 3.5" default-first-option v-model="materialTypeId" placeholder="请选择" filterable clearable>
                                <el-option v-for="item in typeNameList" :key="item.materialTypeId" :label="item.typeName" :value="item.materialTypeId">
                                </el-option>
                              </el-select>
<!--                              <el-button style="flex:1" type="text" @click="copyTemplFile">上传</el-button>-->
                            </div>

                          </div>

                        </div>
                        <div style="">
                          <el-checkbox-group
                            v-model="modelFileId"
                            @change="onlyOneChoice"
                            >
                            <el-checkbox v-for="(item, j) in edtiTasksData.modelFileList" :key="j"  style="width: 90%;" :label="item.tfileId">{{item.fileName}}</el-checkbox>
                          </el-checkbox-group>
                        </div>

                      </el-card>
<!--                      {{edtiTasksData.modelFileList}}-->
                    </el-tab-pane>
                  </el-tabs>
                </div>
        <span slot="footer" class="dialog-footer" style="display: flex;justify-content: center">
          <el-button @click.native="copyTemplClose">取 消</el-button>
          <el-button size="small" type="primary" @click.native="copyTemplFile">确 定</el-button>

        </span>
      </el-dialog>
<!--      修改任务组-->
      <div class="edit-group">
        <el-dialog title="修改任务组" :visible.sync="EditGroupView" width="30%">
        <el-form :model="editGroupInfo" :rules="groupRules">
          <el-form-item label="任务组名称" style="padding: 0 50px" prop="prjTgName">
            <el-input v-model="editGroupInfo.prjTgName" autocomplete="off"></el-input>
          </el-form-item>
<!--          <el-form-item label="任务组序号">-->
<!--            <el-input v-model="editGroupInfo.prjTgId" autocomplete="off"></el-input>-->
<!--          </el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer" style="display: flex;justify-content: center">
          <el-button @click="EditGroupView = false">取 消</el-button>
          <el-button type="primary" @click="editTaskGroup(editGroupInfo)">确 定</el-button>
        </div>
      </el-dialog>
<!--        计时弹框-->
        <el-dialog
          title="添加工时"
          :visible.sync="setWorkTimeView"
          width="30%"
          append-to-body
          :modal="false"
          v-dialogDrag
          :close-on-click-modal="false"
          style="max-height: 600px;margin: auto 0"
          >
          <el-form :model="handTime">
          <el-row>
            <el-col>
              <el-form-item>
                <el-input :rows="4" type="textarea" v-model="handTime.workContent" placeholder="请输入工作描述"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item class="selected">
                <i class="el-icon-s-cooperation"></i>
              <span>案件文号:</span>{{$route.query.agentNum? $route.query.agentNum : agentNum}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="selected" label="员工:" label-width="100px">
                <el-select v-model="handTime.username"  filterable clearable placeholder="请选择">
                  <el-option
                    v-for="item in userList"
                    :key="item.userId"
                    :label="item.fullname"
                    :value="item.userId">
                    <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="display: flex;justify-content: space-between">
            <el-col :span="10" style="flex: 1">
              <el-form-item class="date-picker" label="日期:" style="width: 80%" label-width="75px">
                <el-date-picker
                  style="width: 100%;"
                  v-model="handTime.date"
                  type="date"
                  :clearable="false"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="10" style="flex: 1">
              <el-form-item class="time-long" label="时长:" style="width: 100%;" label-width="100px">
                <TimerComponent v-model="handTime.time"></TimerComponent>
<!--                <el-input placeholder="请输入时长"></el-input>-->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="display: flex;justify-content: space-between">
            <el-col :span="10" style="flex: 1">
              <el-form-item label="开始时间:" style="width: 100%" label-width="75px">
                <TimerComponent v-model="handTime.startDate"></TimerComponent>
<!--                <el-date-picker-->
<!--                  style="width: 100%;"-->
<!--                  v-model="handTime.startDate"-->
<!--                  type="date"-->
<!--                  placeholder="选择日期">-->
<!--                </el-date-picker>-->
              </el-form-item>
            </el-col>
            <el-col :span="10" style="flex: 1">
              <el-form-item label="结束时间:" style="width: 100%" label-width="100px">
                <TimerComponent v-model="handTime.endDate"></TimerComponent>
<!--                <el-date-picker-->
<!--                  style="width: 100%;"-->
<!--                  v-model="handTime.endDate"-->
<!--                  type="date"-->
<!--                  placeholder="选择日期">-->
<!--                </el-date-picker>-->
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
          <span slot="footer" class="dialog-footer" style="display: flex;justify-content: center">
            <el-button @click="setWorkTimeView = false">取 消</el-button>
            <el-button type="primary" @click="addTaskHoursClick">确 定</el-button>
          </span>
        </el-dialog>
<!--        <el-dialog-->
<!--          style="margin-left: 22%;margin-top:15.3%;height: 35vh"-->
<!--          append-to-body-->
<!--          :visible.sync="textareaState"-->
<!--          width="30%"-->
<!--          :modal="false"-->
<!--          class="pdfDialog"-->
<!--          :close-on-click-modal="false"-->
<!--          :before-close="handleClose"-->
<!--        >-->
<!--      <el-input-->
<!--        type="textarea"-->
<!--        placeholder="请输入内容"-->
<!--        v-model="textarea">-->
<!--      </el-input>-->

<!--    </el-dialog>-->
      </div>
<!--      修改任务描述弹窗-->

      <el-dialog
        append-to-body
        title="上传文件"
        :visible.sync="copyTemplFileView"
        width="30%"
        center
        top="0"
        height="500"
        v-dialogDrag
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
                              <el-select style="flex: 4;" default-first-option v-model="fileDocId" placeholder="请选择" filterable clearable @change="handleChangeDoc">
                                <el-option v-for="item in docTypeList" :key="item.doctId" :label="item.typeName" :value="item.doctId">
                                </el-option>
                              </el-select>
                              <el-select style="flex: 4;padding-right: 10px" default-first-option v-model="materialTypeId" placeholder="请选择" filterable clearable>
                                <el-option v-for="item in typeNameList" :key="item.materialTypeId" :label="item.typeName" :value="item.materialTypeId">
                                </el-option>
                              </el-select>
<!--                              <el-button v-if="!taskSelect" style="flex: 1;padding-right:5px" type="text" @click="copyTemplFile">上传</el-button>-->
                              <span style="flex: 1"></span>
                            </div>

                          </div>
                        </div>
                        <div style="">
                          <el-checkbox-group
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
          <el-button size="small" @click.native="copyTemplClose">取 消</el-button>
          <el-button size="small" type="primary" @click.native="copyTemplFile">确 定</el-button>

        </span>
      </el-dialog>
<!--    审核不通过  -->
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
            <el-select class="executor" v-model="changExecutor" placeholder="请选择执行人" filterable clearable>
              <el-option
                v-for="item in peopleList"
                :key="item.id"
                :label="item.fullname"
                :value="item.id">
                <UserIconAndUserName :user-id="item.id"></UserIconAndUserName>
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

<!--      操作弹框-->
<!--      <taskDialog @submitTask="submitTask" @shenhe="shenhe" @shenpiOk="shenpiOk" @shenqingOk="shenqingOk" :people-list="peopleList"  @closeDialog="closeDialog" :title="dialogName" :do-data="edtiTasksData" :shenhe-view="shenView" :caseData="doCaseId"></taskDialog>-->

      <!--提醒计划-->
      <taskPlanList :visible.sync="taskPlanState" :task-info="taskForm"></taskPlanList>

      <!--    复制模板-->
      <copy-template v-if="taskDataCaseId" :caseTypeStr="caseTypeStr" type="case" @closeCopyView="closeCopyView" :copy-tept-view="copyTeptView" :agent-num="agentNum" :case-id="taskDataCaseId"></copy-template>
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
    deriveList,
    addTaskHours,
    startTaskHours,
    stopTaskHours,
    queryMaterialType,
    queryMaterialDocType,
    queryMaterialTypeByDocId,
    copyTemplFile,
    unbindTaskFile,
    queryProjecTeptId,
    queryTaskById,
    recordOnlienEdit
  } from '@/api/caseList'
  import copyTemplate from "../../system_management/templateManagement/components/copyTemplate";
  import localExector from "../../project_management/components/localExector";
  import caseTaskList from "./caseTaskList";
  import CreateNewTask from "./CreateNewTask";
  import taskDialog from "../../toDoTasks/components/taskDialog";
  import { doEditInOffice, getProgID } from '@/utils/editInOffice.js'
  import { creatematerial } from '@/api/ipServiceApi.config.js'
  import { getUser } from '@/api/user'
  import { queryTaskList, queryTemplateFileList,queryTemplateList } from '@/api/templateManagement'
  import TemplateList from '../../system_management/templateManagement/index'
  import Bus from '@/utils/Bus'
  import taskPlanList from "@/views/workbench/project_management/components/taskPlanList";
  import TaskGantt from './ManualIdentification/TaskGantt'
  import material from "../../material_management/material";
  import EditTask from "./EditTask";
  // import ChangeInput from  "./ChangeInput";
  export default {
    name: "TaskProgress",
    props: {
      caseName:'',
      caseTypeStr:'',
      taskDataCaseId: {
        type: String
      },
      agentNum: {
        type: String
      },
      caseTypeId: '',
      judgeRank: ''
    },
    watch: {
      caseTypeId: {
        handler: (n,o)=>{
          // console.log(11111222,n)
        },
        immediate: true
      },
    },
    components: {
      EditTask,
      TemplateList,
      taskDialog,
      CreateNewTask,
      TaskGantt,
      taskPlanList,
      caseTaskList,
      localExector,
      copyTemplate
      // ChangeInput
    },
    data() {
      const that = this
      return {
        copyTeptView:false,
        taskPlanState:false,
        title: '',
        hasBoss:false,
        bossUserId: '',
        changeTeptId: '',
        changeTeptName: '',
        editTeptId: '',
        editTeptName: '',
        editGroupTask: [],
        expireTimeOption: {
					disabledDate(date) {
						return that.CompareDate(that.format(date.getTime()),that.choseEndDate1)
					}
				},
        end: false,
        choseEndDate: '',
        choseEndDate1: '',
        shenheEndDate: '',
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
        groupList: [],
        rules: {
          prjTaskName: [{ required: true, message: '请输入任务名称', trigger: 'change' },],
          createTaskGroup: [{ required: true, message: '请选择任务组', trigger: 'change' },],
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
        createView: false,
        taskTemplateView: false,
        groupForm: {
          prjTgName: '',
          agentNum: ''
        },
        prjTgId: '',
        taskForm: {
          creator:this.$store.getters.userId,
          createDate:(new Date().toLocaleDateString()).replace(/\//g, '-'),
          createTaskGroup: '',
          prjTaskName: '',
          prjTaskDesc: '',
          beginDate: (new Date().toLocaleDateString()).replace(/\//g, '-'),
          endDate: '',
          checkItem: '',
          executor: ''
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
          createTaskGroup: 0,
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
        snPrjTaskId: '',
        snRemark: '',
        snAssignee: '',
        snExecutor: '',
        messageType: '',
        choosePeople: false,
        shenheremark: '',
        state:true,
        taskLists:[],
        subTaskId: '',
        subRemark: '',
        subMessageType: '',
        // hasTemplate:false,
        startDate: ''
        // choseEndDate: ''
      }
    },
    created() {
      this.getUser()
      this.groupForm.agentNum = this.$route.query.agentNum
      this.groupForm.caseId = this.taskDataCaseId
      this.queryProjectTask()
      this.keyCodeForEvent()
      this.peopleList = this.$store.getters.userList
    },
    computed: {
    },
    mounted() {
      Bus.$on('taskManageHandle',(arr)=>{
        this.caozuo(arr[0],arr[1])
        // this.resetBtnIndex()
      })
       // this.groupForm.agentNum = this.agentNum
    },
    methods: {
      checkTept(){
        if(this.taskgroupList&&this.taskgroupList.length>0){
          this.copyTeptView = true
        }else{
          this.$message.error('该案件没有任务组')
        }
      },
      closeCopyView(){
        this.copyTeptView = false
      },
      updateTask(f){
       if(f=='0'){
          this.updateData(this.taskDataCaseId,this.edtiTasksData)
        }else{
          this.closeDialog()
         this.queryProjectTask()
        }
      },
      shenHe(arr){
        this.auditTask(arr[1],arr[0])
      },
      tijiao(arr){
        this.submitTask(arr)
      },
      handleTask(arr){
        this.caozuo(arr[0],arr[1])
      },
      dbclick(data){
        // console.log(data,999)
        this.editTaskClick(data.data,'查看')
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
      editTaskViewClos(v){
        // this.edtiTasksData = {}
        this.editTaskView = false
        this.editTeptId = ''
        this.editTeptName = ''
        // this.taskDataCaseId = ''
        this.TaskgroupList = []
        this.editGroupTask = []
        if(v == '修改成功'){
          this.queryProjectTask()
        }else{
          // this.queryProjectTask()
        }
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
      timeCompare(v){
        // console.log(v,123)
        if(this.CompareDate(this.taskForm.beginDate, this.taskForm.endDate)){
          this.$message.error('开始日期不能大于截止日期!')
          // this.taskForm.beginDate = ''
          // this.taskForm.endDate = ''
          return
        }
      },
      deriveList(){
        deriveList({bussId:26,caseId:this.taskDataCaseId}).then(res=>{
          this.$commonUtils.downLoadAll({url:`${res.data}`})
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
      caozuo(e, data) {
        if(e == '分配'){
          // this.showExcutor(data)
          this.auditTaskTwo(e, data)
        }
        if(e == '提交'){
          this.auditTaskTwo(e, data)
        }
        if(e == '审核'){
          this.auditTaskTwo(e, data)
        }
        if(e == '审批延期'){
          this.auditTaskTwo(e, data)
        }
        if(e == '申请延期'){
          this.auditTaskTwo(e, data)
        }
        if(e == '修改' || e == '查看'){
          this.editTaskClick(data, e)
        }
        if(e == '上传'){
          this.addFile(data)
        }
        if(e == '删除'){
          this.handleDelete(data)
        }
      },
      closeView(v) {
        if(v != '取消'){
          this.queryProjectTask()
        }
        this.createView = false
        this.editTaskView = false
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
      // auditTaskNo() {
      //     auditTask({prjTaskId: this.taskId, result: 2, executor: this.changExecutor}).then(()=>{
      //       this.choosePeople = false
      //       // this.postMessage()
      //       this.messageType = ''
      //       this.$message.success('审核成功！')
      //       this.messageType = ''
      //       this.queryProjectTask()
      //       this.closeDialog()
      //     })
      // },
      auditTaskNo() {
        const a = typeof this.changExecutor
        if(a == 'string') {
          auditTask({prjTaskId: this.taskId, result: 2,remark: this.shenheremark,endDate: this.shenheEndDate}).then(()=>{
            this.choosePeople = false
            // this.postMessage()
            this.$message.success('审核成功！')
            this.queryProjectTask()
          })
        }else{
          auditTask({prjTaskId: this.taskId, result: 2, executor: this.changExecutor,remark: this.shenheremark,endDate: this.shenheEndDate}).then(()=>{
            this.choosePeople = false
            // this.postMessage()
            this.$message.success('审核成功！')
            this.messageType = ''
            this.queryProjectTask()
            this.closeDialog()
          })
        }

      },
      closeDialog(f){
        if(this.snTask){

        }else{
          // this.$refs.edit.modifyProjectTask('parent')
          this.editTaskView = false
        }

      },
      shenqingOk(){
        this.queryProjectTask()
        this.closeDialog()
      },
      shenpiOk(){
        this.queryProjectTask()
        this.closeDialog()
      },
      shenhe(arr){
        this.auditTask(arr[0],arr[1])
      },
      queryPrjTask(caseId,f){
        queryProjectTask({caseId}).then(res=>{
          queryProjecTeptId({caseId}).then(res=>{
            if(res.data.teptId){
              this.teptId = res.data.teptId
              this.teptName = res.data.teptName
              queryTaskList({teptId: this.teptId,caseId}).then(res=>{
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
          this.taskgroupList = res.data.filter(item=>!!item)
        })
      },
      submitTask(arr) {
        if(arr[1] == 1){
          // submitTask({prjTaskId: arr[0].prjTaskId,remark: arr[0].remark}).then(()=>{
          //   this.$message.success('任务提交成功！')
          //   this.closeDialog()
          //   this.queryProjectTask()
          // })
          this.subTaskId = arr[0].prjTaskId
          this.subRemark = arr[0].remark
          submitTask({prjTaskId: arr[0].prjTaskId,remark: arr[0].remark}).then((res)=>{
            if(!res.messageType){
              this.$message.success('提交成功！')
              this.subTaskId = ''
              this.subRemark = ''
              this.closeDialog()
              this.queryProjectTask()
            }
            if(res.messageType == 15){
              // this.messageType = 15
              this.subMessageType = 15
              this.bossUserId = res.data.bossUserId
              // this.$message.error(res.message)
              this.queryPrjTask(this.taskDataCaseId)
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
                  // this.createView = true
                })
                .catch((action)=>{
                  // alert('整理案卷')
                  if(action == 'cancel'){
                    this.end = true
                    this.hasBoss = true
                    this.taskForm.prjTaskName = '返回客户组组长分配任务'
                    this.taskForm.prjTgName = '返回客户组组长分配任务'
                    // this.changeHa('整理案卷')
                    this.taskForm.executor = this.bossUserId
                    this.taskForm.endDate = this.$commonUtils.getDay(1,'-')
                    this.createTaskView = true
                    // this.createView = true
                  }
                })
            }
            if(res.messageType == 11){
              this.subMessageType = 11
              // this.$message.error(res.message)
              this.queryPrjTask(this.taskDataCaseId)
              this.end = false
              this.$confirm(`${res.message}？`, "提示", {
                confirmButtonText: "新建任务",
                cancelButtonText: "整理案卷",
                distinguishCancelAndClose: true,
                type: "warning"
              })
                .then(()=>{
                  // alert('新建任务')
                  // this.createView = true
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
                    // this.createView = true
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
                this.queryPrjTask(this.taskDataCaseId)
                // this.createView = true
                this.createTaskView = true
              }).catch((action)=>{
                if(action=='cancel'){
                  submitTask({prjTaskId: arr[0].prjTaskId, remark: arr[0].remark,checkFlag: 0}).then(()=>{
                    // this.postMessage()
                    this.closeDialog()
                    this.subMessageType = ''
                    this.$message.success('提交成功！')
                    this.subTaskId = ''
                    this.subRemark = ''
                    this.queryProjectTask()
                    // this.queryToDoTask(1)
                  })
                }

              })
            }

          })
        }

        if(arr[1] == 2){
          this.teptId = ''
          this.teptName = ''
          this.templateGroupTask = []
          this.snTask = true
          this.snPrjTaskId = arr[0].prjTaskId
          this.snRemark = arr[0].remark
          // this.createView = true
          this.createTaskView = true
          this.snAssignee = arr[0].assignee
          this.snExecutor = arr[0].executor
          this.taskForm.assignee = arr[0].assignee
          this.taskForm.executor = arr[0].executor
          this.newTask = true
          if(this.taskDataCaseId){
            queryProjecTeptId({caseId:this.taskDataCaseId}).then(res=>{
              if(res.data.teptId) {
                this.teptId = res.data.teptId
                this.teptName = res.data.teptName
                queryTaskList({teptId: this.teptId,caseId: this.taskDataCaseId}).then(res=>{
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
      auditTaskTwo(f,data){
        // return
        // this.shenView = true
        this.editTaskView = true
        if(f=='审核'){
          this.dialogName = '审核'
          this.title = '审核'
        }
        if(f=='分配'){
          this.dialogName = '分配'
          this.title = '分配'
        }
        if(f=='提交'){
          this.dialogName = '提交'
          this.title = '提交'
        }
        if(f=='申请延期'){
          this.dialogName = '申请延期'
          this.title = '申请延期'
        }
        if(f=='审批延期'){
          this.dialogName = '审批延期'
          this.title = '审批延期'
        //   queryTaskUserList({caseId: this.taskDataCaseId}).then(res=> {
        //   this.peopleList = res.data
        // })
        }

        // this.modelTeptId = data.teptId
        this.modelFileListView = false
        this.shenheTaskId = data.prjTaskId
        // this.queryMaterialDocType()
        this.doCaseId = this.taskDataCaseId
        this.updateData(this.doCaseId,data)
        // console.log('+++++++111++++++++')
        // console.log(this.edtiTasksData)
        // console.log('+++++++++++++++')
      },
      auditTask(item, e) {
        this.taskId = item.prjTaskId
        this.shenheremark = ''
         if(item.remark){
           this.shenheremark = item.remark
         }
        if(e==1){
          auditTask({prjTaskId: item.prjTaskId, result: 1 }).then((res)=>{
            // this.queryToDoTask(1)
            if(res.messageType == 13){
              this.messageType = 13
              this.$confirm(`${res.message}？`, "提示", {
                confirmButtonText: "是",
                cancelButtonText: "否",
                distinguishCancelAndClose: true,
                type: "warning"
              }).then(()=>{
                this.newTask = true
                this.queryPrjTask(this.taskDataCaseId)
                // queryProjectTask({caseId: item.caseId}).then(res=>{
                //   if(res.data.find(i=>i.teptId)){
                //     this.teptId = res.data.find(i=>i.teptId).teptId
                //   }
                //   queryTaskList({teptId: this.teptId,caseId: this.groupForm.caseId}).then(res=>{
                //     this.templateGroupTask = res.data.filter(item=>!!item)
                //     this.templateGroupTask = (this.templateGroupTask).map(item=>({
                //       value: item.tgId,
                //       label: item.tgName,
                //       children: (item.taskDefineList).map(i=>({
                //         value: i.taskDefineId,
                //         label: i.taskName,
                //         taskDesc: i.taskDesc,
                //         itemList: i.itemList,
                //         taskFileList: i.taskFileList
                //       }))
                //     }))
                //     this.taskTemplateView = false
                //   })
                // if(res.data.find(i=>i.teptName)){
                //   this.teptName = res.data.find(i=>i.teptName).teptName
                // }
                // this.taskgroupList = res.data.filter(item=>!!item)
                //
                // })
                // this.createView = true
                this.createTaskView = true
              }).catch((action)=>{
                if(action=='cancel'){
                  auditTask({prjTaskId: item.prjTaskId, result: 1 ,checkFlag: 0}).then(()=>{
                    // this.postMessage()
                    this.messageType = ''
                    this.$message.success('审核成功！')
                    this.closeDialog()
                    this.queryProjectTask()
                  })
                }
              })
            }
            if(res.messageType == 12){
              this.messageType = 12
              this.$confirm("当前案件没有待处理的任务，是否需要创建一个任务？", "提示", {
                confirmButtonText: "是",
                cancelButtonText: "否",
                distinguishCancelAndClose: true,
                type: "warning"
              }).then(()=>{
                this.newTask = true
                // this.queryToDoTask(1)
                this.queryProjectTask()
                // this.createView = true
                this.createTaskView = true
              }).catch((action)=>{
                if(action=='cancel'){
                  auditTask({prjTaskId: item.prjTaskId, result: 1 ,checkFlag: 0}).then(()=>{
                    this.$message.success('审核成功！')
                    this.messageType = ''
                    this.closeDialog()
                    this.queryProjectTask()
                  })
                }

              })
            }
            if(res.messageType == 11){
              this.messageType = 11
              this.newTask = true
              this.queryPrjTask(this.taskDataCaseId)
              this.end = false
              this.$confirm(`${res.message}？`, "提示", {
                confirmButtonText: "新建任务",
                cancelButtonText: "整理案卷",
                distinguishCancelAndClose: true,
                type: "warning"
              })
                .then(()=>{
                  // alert('新建任务')
                  // this.createView = true
                  this.createTaskView = true
                })
                .catch((action)=>{
                  if(action == 'cancel'){
                    this.end = true
                    this.taskForm.prjTaskName = '整理案卷'
                    this.taskForm.prjTgName = '整理案卷'
                    // this.changeHa('整理案卷')
                    // this.createView = true
                    this.createTaskView = true
                  }
                })
            }
            if(res.messageType == 15){
              this.messageType = 15
              this.newTask = true
              this.bossUserId = res.data.bossUserId
              this.queryPrjTask(this.taskDataCaseId)
              this.end = false
              this.$confirm(`${res.message}？`, "提示", {
                confirmButtonText: "新建任务",
                cancelButtonText: "返回客户组组长分配任务",
                distinguishCancelAndClose: true,
                type: "warning"
              })
                .then(()=>{
                  // alert('新建任务')
                  this.hasBoss = false
                  this.bossUserId = ''
                  // this.createView = true
                  this.createTaskView = true
                })
                .catch((action)=>{
                  if(action == 'cancel'){
                    this.end = true
                    this.hasBoss = true
                    this.taskForm.prjTaskName = '返回客户组组长分配任务'
                    this.taskForm.prjTgName = '返回客户组组长分配任务'
                    this.taskForm.endDate = this.$commonUtils.getDay(1,'-')
                    this.taskForm.executor = this.bossUserId
                    // this.changeHa('整理案卷')
                    // this.createView = true
                    this.createTaskView = true
                  }
                })
            }
            if(!res.messageType){
              // this.postMessage()
              this.$message.success('审核成功！')
              this.queryProjectTask()
            }
          })
        }
        if(e==2){
          auditTask({prjTaskId: item.prjTaskId, result: 2, executor: item.executor,remark: item.shenheremark,endDate: item.shenheEndDate}).then(()=>{
            this.choosePeople = false
            // this.postMessage()
            this.$message.success('审核成功！')
            this.messageType = ''
            this.queryProjectTask()
            this.closeDialog()
          })
          // this.choosePeople = true
          // this.shenheEndDate = item.endDate
          // queryTaskUserList({caseId: item.caseId}).then(res=> {
          //   this.peopleList = res.data
          // })
          // console.log(item)
          // this.changExecutor = item.executorName

        }
      },
      updateData(a,data){
        // console.log(data,999)
        // this.edtiTasksData = JSON.parse(JSON.stringify(data))
        queryProjectTask({prjTaskId:data.prjTaskId}).then((res)=>{
          this.edtiTasksData = res.data[0].taskList[0]
          this.edtiTasksData.createTaskGroup = data.prjTgId
          this.edtiTasksData.caseName = this.caseName
        // this.edtiTasksData.assignee = data.assignee
        // this.edtiTasksData.executor = data.executor
        // this.edtiTasksData.appUserId = data.appUserId
          let arr = []
        if(this.edtiTasksData.itemList&&this.edtiTasksData.itemList.length>0){
          this.edtiTasksData.itemList.forEach((i, index)=>{
            arr.push(i.prjIemName)
          })
          // this.edtiTasksData.itemList = arr
          this.edtiTasksData.itemList = arr.join('\n')
        }
        if(data.teptId){
          queryTaskList({teptId: data.teptId,caseId: this.groupForm.caseId}).then(res=>{
              this.editGroupTask = res.data.filter(item=>!!item)
              this.editGroupTask = (this.editGroupTask).map(item=>({
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
            })
        }else{
          this.editGroupTask = []
        }
        })

        //
        //   // let arr = this.deepFlatten(agList)
        // })
        // }
        //
        // if(a == 'delete' || a == 'add'){
        //     if(!this.copyTemplFileView){
        //       this.edtiTasksData.fileList = this.deepFlatten(this.agList).find(item=>item.prjTaskId == this.prjTaskId).fileList
        //     }
        //   }
      },




      showExcutor(row){
        this.excutorView = true
        this.assignData = row
        this.choseEndDate = row.endDate
        this.startDate = row.startDate
        this.choseEndDate1 = row.endDate
        // this.queryPeopleList()
      },
      changeHa(v){
        if(this.taskgroupList.find(i=>i.prjTgId == v)){
          return
        }else if(this.taskgroupList.find(i=>i.prjTgName == v)){
          return
        }else if(!v){
          return
        }
        else{
          addProjectTaskGroup({ caseId: this.taskDataCaseId, prjTgName: v, tepId: this.teptId}).then((res)=>{
            let id = res.data.prjTgId
            queryProjectTask({caseId:this.taskDataCaseId}).then((res)=>{

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
          // })
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
      copyTemplClose() {
        this.rightView = false
        this.copyTemplFileView = false
        this.materialTypeId = ''
        this.typeNameList = []
        this.fileDocId = ''
        // this.bindTaskList = []
        this.bindTaskId = ''
      },
      clickClose() {
        this.rightView = false
        this.activeName = '1'
      },
      handleClick(f) {
        if(f==2){
        }
      },
      rowDbClick(data){
        // this.taskLook = true
        this.editTaskView = true
        this.shenView = false
        this.title = '查看任务'
        this.edtiTasksData = JSON.parse(JSON.stringify(data))
        this.edtiTasksData.caseName = this.caseName
        let arr = []
        if(this.edtiTasksData.itemList&&this.edtiTasksData.itemList.length>0){
          this.edtiTasksData.itemList.forEach((i, index)=>{
            arr.push(i.prjIemName)
          })
          this.edtiTasksData.itemList = arr.join('\n')
        }
      },
      addFile(row){
        this.queryMaterialDocType()
        this.bindTaskId = row.prjTaskId
        this.copyTemplFileView = true
        this.taskSelect = false
        this.querytepTaskFile(row)
        // this.queryTempFiles()
      },
      querytepTaskFile(a) {
        // this.edtiTasksData.modelFileList = []
        if(!this.teptId){
          return
        }
        queryTaskList({teptId: this.teptId}).then(res=>{
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
      handleChangeMat(v) {
      },
      unbindTaskFile(data) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          unbindTaskFile({materialId: data.materialId,prjTaskId: this.prjTaskId}).then(()=>{
            this.$message.success('删除成功！')
            this.queryProjectTask('delete')
          })
        })

      },
      upTempFile() {
        this.prjTaskId = ''
        // console.log('1111+++++++++++++++')
        // console.log(this.teptId)
        // console.log('+++++++++++++++')
        this.queryTempFiles()
        this.copyTemplFileView = true
        // this.taskSelect = true
        this.queryMaterialDocType()
      },
      bindTaskFileSelect(v) {
        if(!v){
          this.queryTempFiles()
        }else{
          let data = this.deepFlatten(this.agList).find(i=>i.prjTaskId == v)
          this.querytepTaskFile(data)
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
          caseId: this.taskDataCaseId,
          materialTypeId: this.materialTypeId,
          doctId: this.fileDocId,
          prjTaskId: id
        }).then((res)=>{
          this.queryProjectTask('add')
          this.fileLists.push(res.data)
          this.$message.success('绑定文件成功！')
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

          // console.log('444444+++++++++++++++')
          // console.log(this.materialIdList)
          // console.log('+++++++++++++++')
          this.$message.success('文件上传成功!')
          this.queryProjectTask('add')
          this.rightView = false
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
          queryMaterialTypeByDocId({ doctId:this.fileDocId ,caseId:this.taskDataCaseId}).then(res => {
            this.typeNameList = res.data
          })

      },
      fileType(type) {
        this.rightView = true
        // this.copyTemplFileView = true
        this.querytepTaskFile(this.edtiTasksData)
      },
      queryTempFiles() {
        queryTemplateFileList({teptId: this.teptId,tfileId: this.teptId}).then(res=>{
          this.edtiTasksData.modelFileList = res.data
        })
      },
      getUser(){
        getUser().then(res=>{
          this.userList=res.data
        })
      },
      computedSuccess(list) {
        let successNum = 0
        list.forEach(item=>{
          if(item.taskStatus == '已完成'){
            successNum += 1
          }
        })
        return successNum
      },
      clearData() {
        this.templateGroupTask = []
        this.createTaskView = false
        // this.createView = false
        Bus.$emit('deleteSelect')
        if(this.messageType){
            if(this.messageType == '11' || this.messageType == '15'){
              return
            }else{
              auditTask({prjTaskId: this.taskId, result: 1 ,checkFlag: 0}).then((res)=>{
              // this.postMessage()
                this.$message.success('审核成功！')
              this.messageType = ''
                this.closeDialog()
              this.queryProjectTask()
            })
            }
        }
        if(this.subMessageType == '13'){
          submitTask({prjTaskId: this.subTaskId, remark: this.subRemark,checkFlag: 0}).then(()=>{
            // this.postMessage()
            this.messageType = ''
            this.$message.success('提交成功！')
            this.queryProjectTask()
            this.subTaskId = ''
            this.subRemark = ''
            this.subMessageType = ''
            // this.queryToDoTask(1)
            this.closeDialog()
          })
        }
        this.bossUserId = ''
        this.hasBoss = false
        this.end = false
        this.taskForm.prjTaskName = ''
        this.taskForm.prjTgName = ''
        this.snTask = false
        this.newTask = false

        // this.teptName = ''
        // this.confirmDialog = false
        this.taskForm.prjTaskDesc = ''
        this.taskForm.prjTaskName = ''
        this.taskForm.createTaskGroup = ''

        // this.taskDefineId = ''
        //   this.taskForm.prjTaskName = ''
        //   this.taskForm.prjTaskDesc = ''
          // this.templateGroupTask.length = 0
          // this.taskForm.createTaskGroup = ''
          // this.teptName = ''
          this.taskList = []
          this.taskForm.checkItem = ''
          this.taskForm.endDate = ''
        this.taskForm.executor = ''
      },
      changeGroup(v) {
        let arr = this.templateGroupTask.find(item=>item.value == v)
        this.groupForm.prjTgName = arr.label
        this.tgId = arr.value
      },
      noTemplate() {
        // this.$refs['tempList'].selected = 100
        Bus.$emit('deleteSelect')
        this.taskTemplateView = false
        this.templateGroupTask = []
        this.taskList = []
        this.teptName = ''
        this.groupForm.prjTgName = ''
        this.onceCreateGroup = true
      },
      addTaskHours(){
        // this.groupForm.agentNum = this.agentNum
        this.setWorkTimeView = true
        // this.aboutTask = b.prjTaskName
      },
      addTaskHoursClick() {
        if(!this.handTime.workContent){
          this.$message.error('请填写工作描述')
          return
        }
        const {time,workContent} = this.handTime
        addTaskHours({...{time,workContent}, caseId: this.groupForm.caseId }).then(()=>{
          this.$message.success('记录工时成功！')
          this.setWorkTimeView = false
        })
      },
      // changeInput(v) {
      //   console.log('+++++++++++++++')
      //   console.log('我是父组件')
      //   console.log(v)
      //   console.log('+++++++++++++++')
      // },
      changeDate(v, e) {
        this.modifyProjectTask(v)
      },
      hiddenInput(data) {
        if(data){
          this.modifyProjectTask(data)
        }
      },
      editTaskClick(data,f) {
        this.editTeptId = data.teptId
        this.editTeptName= data.teptName
        if(this.editTeptId){
          queryTaskList({teptId: this.editTeptId,caseId: this.groupForm.caseId}).then(res=>{
              this.editGroupTask = res.data.filter(item=>!!item)
              this.editGroupTask = (this.editGroupTask).map(item=>({
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
            })
        }else{
          this.editGroupTask = []
        }
        // this.modelFileListView = false
        // if(data.subTaskList){
        //   this.modelFileListView = true
        // }
        this.editTaskView = true
        this.shenView = false
        f == '修改' ? this.title = '修改' : this.title = '查看'
        this.prjTaskId = data.prjTaskId
        this.edtiTasksData = JSON.parse(JSON.stringify(data))
        this.edtiTasksData.caseName = this.caseName
        this.edtiTasksData.createTaskGroup = data.prjTgId
        let arr = []
        if(this.edtiTasksData.itemList&&this.edtiTasksData.itemList.length>0){
          this.edtiTasksData.itemList.forEach((i, index)=>{
            arr.push(i.prjIemName)
          })
          this.edtiTasksData.itemList = arr.join('\n')
        }
      },
      modifyProjectTask() {
        if(!this.edtiTasksData.prjTaskName){
          this.$message.error('请填写任务名称!')
          return
        }
        if(!this.edtiTasksData.endDate){
          this.$message.error('请选择截止日期!')
          return
        }
        if(!this.edtiTasksData.startDate){
          this.$message.error('请选择开始日期!')
          return
        }
        if(this.edtiTasksData.itemList){
          let list = []
          this.edtiTasksData.itemList = this.edtiTasksData.itemList+''
          this.edtiTasksData.itemList.split('\n').filter(item=>!!item).forEach(i=>{
            list.push(i.substring(2))
          })
          this.edtiTasksData.itemList = list.map(i=>({
            prjIemName: i
          }))
        }
        // if(this.backDate == this.edtiTasksData.endDate){
        //   this.edtiTasksData.endDate = ''
        // }
        this.clickClose()
        this.materialTypeId = ''
        this.typeNameList = []
        this.fileDocId = ''
        modifyProjectTask(this.edtiTasksData).then(()=>{
          this.queryProjectTask()
          this.selected = ''
          this.prjTaskId = ''
          this.$message.success('修改成功！')
          this.editTaskView = false

        }).catch(()=>{
          // this.$message.error('没有权限修改截止日期！')
        })
      },
      // queryPeopleList(data) {
      //   // console.log('+++++++++++++++')
      //   // console.log(data)
      //   // console.log('+++++++++++++++')
      //   queryTaskUserList({caseId: this.taskDataCaseId}).then(res=>{
      //     this.peopleList = res.data
      //   })
      // },
      CompareDate(d1,d2) {
        return ((new Date(d1.replace(/-/g,"\/"))) > (new Date(d2.replace(/-/g,"\/"))));
      },
      assginTask() {
        let data = this.assignData
        if(!this.executor){
          this.$message.error('请选择执行人')
          return
        }
        if(this.CompareDate(this.startDate,this.choseEndDate)){
          this.$message.error(`截止日期不能早于开始日期:${this.startDate}`)
          return;
        }
        if(!this.choseEndDate){
          this.$message.error('请填写截止时间')
          return;
        }
        if(this.CompareDate(this.choseEndDate,this.choseEndDate1)){
          this.$message.error('超出当前截止时间')
          return;
        }
        assginTask({prjTaskId:data.prjTaskId, executor: this.executor, endDate: this.choseEndDate}).then(()=>{
         this.$message.success('任务分配成功!')
          this.queryProjectTask()
          this.excutorView = false
        })

      },
      // peopleView() {
      //   queryTaskUserList({caseId: this.groupForm.caseId}).then(res=>{
      //     this.peopleList = res.data
      //     // this.agList.forEach(item=>{
      //     //   item.push(res.data)
      //     // })
      //   })
      // },
      handleDelete(data) {
        // if(data.executorName){
        //   this.$message.error('无法删除该任务!')
        //   return
        // }
        this.deleteProjectTask(data)
        // this.queryProjectTask()
      },
      deleteProjectTask(data) {
        this.$confirm('此操作将永久删除该任务, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          deleteProjectTask({prjTaskId: data.prjTaskId, caseId: this.groupForm.caseId}).then(()=>{
            this.$message.success('删除成功！')
            this.queryProjectTask()
          })
        }).catch(()=>{
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      onlyOneChoice(v){
        this.modelFileId = []
        if(v){
          // console.log(v)
          const length = v.length
          this.modelFileId.push(v.splice(-1)[0])
          // console.log(this.modelFileId)
        }
      },
      queryProjectTask(a) {
        if(this.editTaskView && this.edtiTasksData.prjTaskId){
          queryTaskById({prjTaskId:this.edtiTasksData.prjTaskId}).then(res=> {
            this.edtiTasksData = res.data
            this.edtiTasksData.createTaskGroup = res.data.prjTgId
            this.edtiTasksData.caseName = this.caseName
          })
        }
        queryProjectTask({caseId:this.groupForm.caseId}).then((res)=>{
          this.taskLists=res.data
          queryProjecTeptId({caseId:this.groupForm.caseId}).then((res)=>{
            if(res.data.teptId) {
                this.teptId = res.data.teptId
                this.teptName = res.data.teptName
                queryTaskList({teptId: this.teptId,caseId: this.groupForm.caseId}).then(res=>{
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
            }else{
              if(this.caseTypeId){
              queryTemplateList({caseTypeId:this.caseTypeId}).then((res)=> {
                if(res.data.find(item=>item.judgeRank == this.judgeRank)){
                  // this.hasTemplate = true
                  this.teptId = res.data.find(item=>item.judgeRank == this.judgeRank).teptId
                  this.teptName = res.data.find(item=>item.judgeRank == this.judgeRank).teptName
                  queryTaskList({teptId: this.teptId,caseId: this.groupForm.caseId}).then(res=>{
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
                //   j.teptName = i.teptName
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
          // this.bindTaskList = this.deepFlatten(this.agList)
          // this.bindTaskList = this.bindTaskList.filter(i=>i.prjTaskId)
          // if(a == 'delete' || a == 'add'){
          //   if(!this.copyTemplFileView){
          //     this.edtiTasksData.fileList = this.deepFlatten(this.agList).find(item=>item.prjTaskId == this.prjTaskId).fileList
          //   }else{
          //     // Bus.$emit('updateCaseEvent')
          //     this.copyTemplFileView = false
          //   }
          // }
        })
      },
      handleCommand(value, n) {
        // if(n==1){
        //   this.firstGroup = true
        // }
          this.createView = true
        // this.teptId
      },
      addProjectTaskGroup() {
        if(!this.groupForm.prjTgName){
          this.$message.error('请填写任务组名称')
          return
        }
        this.groupForm.agentNum = this.$route.query.agentNum
        addProjectTaskGroup({...this.groupForm, tgId: this.tgId, tepId: this.teptId}).then((res)=>{
          this.queryProjectTask()
          this.createGroupView = false
          this.groupForm.prjTgName = ''
          // this.$message.success('新建任务组成功！')

        })
      },
      editTaskGroup(a, b) {
        if(!this.editGroupInfo.prjTgName){
          this.$message.error('请填写任务组名称')
          return
        }
        modifyProjectTaskGroup({
          caseId: this.groupForm.caseId,
          prjTgId: this.editGroupInfo.prjTgId,
          prjTgName: this.editGroupInfo.prjTgName,
          // teptId: this.teptId,
          // tgId: this.tgId
        }).then(res=>{
          this.$message.success('修改成功！')
          this.EditGroupView = false
          this.editGroupInfo.prjTgName = ''
          this.queryProjectTask()
        }).catch(()=>{
          this.$message.error('修改失败！')
          this.editGroupInfo.prjTgName = ''
          this.EditGroupView = false
        })
      },
      editGroupName(item) {
        this.editGroupInfo.prjTgId = item.prjTgId
        this.EditGroupView = true
      },
      delGroup(item) {
        this.$confirm('此操作将永久删除该任务, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          deleteProjectTaskGroup({prjTgId: item.prjTgId}).then(()=>{
            this.$message.success('删除成功！')
            this.queryProjectTask()
          }).catch(()=>{
            this.$message.error('需要先删除任务组中的任务，才能删除任务组！')
          })
        }).catch(()=>{
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
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
        // console.log(item.teptId,11111)
        this.changeTeptId = item.teptId
        this.changeTeptName = item.teptName
        // this.edtiTasksData.teptName = item.teptName
        // this.edtiTasksData.teptId = item.teptId
      },
      leadIn() {
        if(this.changeTeptId){
          this.teptId = this.changeTeptId
          this.edtiTasksData.teptId = this.changeTeptId
        }
        if(this.changeTeptName){
          this.teptName = this.changeTeptName
          this.edtiTasksData.teptName = this.changeTeptName
        }
        this.changeTeptId = ''
        this.changeTeptName = ''
        this.taskList = []
        this.$refs['tempList'].selected = 100
        this.templateGroupTask = []
        this.taskForm.prjTaskName = ''
        this.taskForm.prjTaskDesc = ''
        this.taskForm.checkItem = ''
        this.templateGroupTask = []
        this.taskForm.createTaskGroup = ''
        this.groupForm.tgId = ''
        this.groupForm.prjTgName = ''
        // this.taskForm.date = ''
        // this.taskgroupList.length = 0
        queryTaskList({teptId: this.teptId, caseId: this.groupForm.caseId}).then((res)=>{
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
        addProjectTaskGroup({tgId: this.tgIdd, caseId: this.taskDataCaseId, prjTgName: this.groupNames, tepId: this.teptId}).then((res)=>{
          this.queryProjectTask()
          this.createGroupView = false
          this.groupForm.prjTgName = ''
          if(o!='onceCreate'){
            // this.$message.success('新建任务组成功！')
          }
          this.taskForm.createTaskGroup = res.data.prjTgId
          // this.confirmDialog = false
        })
      },
      editTemplateChange(v) {
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
          // prjTaskDescList.push(item.subTaskDesc)
          // prjTaskCheckList.push(item.itemList)
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
        // this.taskForm.checkItem = arr.join('\n')
        this.edtiTasksData.prjTaskName = prjTaskNameList.filter(item=>!!item).join('&')
        // this.taskForm.prjTaskDesc = prjTaskDescList.filter(item=>!!item).join('\n')
        // this.taskForm.prjTaskDesc = this.taskForm.prjTaskDesc.split('\n')

        // if(this.taskForm.prjTaskDesc.filter(item=>!!item).length>0){
        //   this.taskForm.prjTaskDesc = this.taskForm.prjTaskDesc.map((item,index)=>{
        //     return item = index+1+'.'+item
        //   })
        //   this.taskForm.prjTaskDesc = this.taskForm.prjTaskDesc.join('\n')
        // }else{
        //   this.taskForm.prjTaskDesc = ''
        // }
      },
      templateChange(v) {
        if(v.length == 0){
          // this.confirmDialog = false
          this.taskForm.createTaskGroup = ''
        }
        // console.log('++++++++change+++++++')
        // console.log(this.$refs['refHandle'].dropDownVisible)
        // console.log('+++++++++++++++')
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
                if(this.onceCreateGroup){
                  this.newTaskGroup('onceCreate')
                  // this.confirmDialog = true
                }
              //  任务组中没有选中任务模板的任务组
              }
            }else{
            //  该案件任务组中没有模板选中的任务组，是否新建任务组
              if(this.onceCreateGroup){
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
      clickCreateTask() {
        this.fileLists = []
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
        if(this.CompareDate(this.taskForm.beginDate, this.taskForm.endDate)){
          this.$message.error('开始日期不能大于截止日期!')
          // this.taskForm.beginDate = ''
          // this.taskForm.endDate = ''
          return
        }
        let list = []
        let itemList = []
        // if(this.taskForm.checkItem){
        //   this.taskForm.checkItem.split('\n').filter(item=>!!item).forEach(i=>{
        //     list.push(i.substring(2))
        //   })
        //     itemList = list.map(i=>({
        //     prjIemName: i
        //   }))
        // }
        //处理输入的检查项
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
        // console.log(this.snExecutor,this.snPrjTaskId,this.snAssignee,99999)
        // return;
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
        addProjectTask({
          materialIdList: this.fileLists.map(i=>i.materialId),
          itemList,
          teptId: this.teptId,
          taskDefineId: this.taskDefineId,
          caseId: this.groupForm.caseId,
          prjTgId: this.taskForm.createTaskGroup,
          prjTgName: this.taskForm.prjTgName,
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

          if(this.messageType){
            auditTask({prjTaskId: this.taskId, result: 1 ,checkFlag: 0}).then((res)=>{
              // this.postMessage()
              this.messageType = ''
              // this.queryProjectTask()
            })
          }
          if(this.subMessageType == '13' || this.subMessageType == '15'){
            submitTask({prjTaskId: this.subTaskId, remark: this.subRemark,checkFlag: 0}).then(()=>{
              // this.postMessage()
              this.$message.success('提交成功！')
              this.subTaskId = ''
              this.subRemark = ''
              this.subMessageType = ''
              // this.closeDialog()
              // this.queryToDoTask(1)
            })
          }
          this.bossUserId = ''
          this.hasBoss = false
          this.snPrjTaskId = ''
          this.snRemark = ''
          this.snExecutor = ''
          this.snAssignee = ''
          this.snTask = false
          this.newTask = false
          this.createTaskView = false
          // this.createView = false
          // this.queryProjectTask()
          this.queryProjectTask()
          // this.postMessage()
          this.$message.success('增加任务成功！')
          Bus.$emit('deleteSelect')
          this.closeDialog()
          this.taskForm.prjTaskName = ''
          this.taskForm.prjTgName = ''
          this.taskForm.executor = ''
          this.templateGroupTask = []
          this.taskForm.prjTaskName = ''
          this.taskForm.prjTaskDesc = ''
          this.taskForm.checkItem = ''
          this.templateGroupTask = []
          this.taskForm.createTaskGroup = ''
          this.teptName = ''
          this.taskList = []
          this.onceCreateGroup = true
          this.taskForm.date = ''
          this.taskForm.endDate = ''
          this.end = false
        }).catch((res)=>{
          this.$message.error(res.message)
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
  .pdfDialog  /deep/{
  z-index: 3000;
  .el-dialog{
    z-index: 3000;
    height: 100vh;
    display: flex;
    /*flex-direction: column;*/
    .el-dialog__body {
      flex: 1;
      .el-textarea{
        height: 100%;
        textarea{
          height: 100%;
        }
      }
    }
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
  .el-form {
    .el-row{
      &:last-child{
        border-bottom: 1px solid #ccc;
      }
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
  .edit-file {
    display: flex;
    justify-content: center;
    .el-tabs--border-card{
      width: 95%;
    }
  }
  .el-icon-user-solid{
    &:hover{
      color: #409EFF;
    }
  }
  .task-group {
    >>>.el-card__header{
      padding-top: 0;
      padding-bottom: 0;
    }
  }
</style>
