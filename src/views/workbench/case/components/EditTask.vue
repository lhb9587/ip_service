<template>
    <div>
      <!--      修改任务弹框-->
      <el-dialog
        :visible.sync="editTaskView"
        width="80%"
        top="0"
        style="width: 300px;"
        append-to-body
        :modal="false"
        v-dialogDrag
        :close-on-click-modal="false"
        :before-close="()=>{ this.closeDialog('取消')}"
        >
        <div class="taskDetail" style="max-height: 80vh;overflow-y: auto">
            <div class="wrap_left">
<!--              <div class="model_wrap">-->
                <el-breadcrumb separator="/">
                  <el-breadcrumb-item >{{edtiTasksData.prjName||edtiTasksData.caseName}}</el-breadcrumb-item>
                  <el-breadcrumb-item>{{edtiTasksData.prjTgName}}</el-breadcrumb-item>
                </el-breadcrumb>
<!--                <div style="margin: 10px">-->
      <!--            <el-button  type="primary" size="mini" @click="takeAssign">分配</el-button>-->
      <!--            <el-dropdown trigger="click" @command="handleCommand">-->
      <!--            <span class="el-dropdown-link">-->
      <!--              <el-button type="primary"  size="mini" >更多 <i class="el-icon-arrow-down el-icon&#45;&#45;right"></i></el-button>-->
      <!--            </span>-->
      <!--              <el-dropdown-menu slot="dropdown">-->
      <!--                &lt;!&ndash;              <el-dropdown-item  command="转案">转案</el-dropdown-item>&ndash;&gt;-->
      <!--              </el-dropdown-menu>-->
      <!--            </el-dropdown>-->
<!--                </div>-->
<!--              </div>-->

              <div style="font-size: 18px;font-weight: bold;line-height: 20px;margin-top: 10px">
                {{edtiTasksData.prjTaskName}}
              </div>
              <!--              操作按钮-->
              <div style="margin-top: 10px">
                <el-button @click.native="handleCommand(item.name)" size="mini" type="primary" v-if="!(item.ban || !( nextOperation&&item.nextOperation&&item.nextOperation.includes(nextOperation) || delayFlag&&item.delayFlag&&item.delayFlag==delayFlag))" v-for="(item,index) in handleList" :command="item.name">{{item.name}}</el-button>


<!--                <span v-if="title=='审核'&&edtiTasksData.nextOperation==3">-->
<!--                    <el-button type="primary" size="mini" @click="handleCommand('审核')">-->
<!--                      审核-->
<!--                    </el-button>-->
<!--                </span>-->

<!--                <span v-if="title=='审批延期'&&edtiTasksData.delayFlag == 2 ">-->
<!--                  <el-button type="primary" size="mini" @click="handleCommand('审批延期')">-->
<!--                      审批延期-->
<!--                    </el-button>-->
<!--                </span>-->
<!--                <span v-if="title=='分配'&&(edtiTasksData.nextOperation == 2 || edtiTasksData.nextOperation == 1)">-->
<!--                  <el-button type="primary" size="mini" @click.native="handleCommand('分配')">-->
<!--                      分配-->
<!--                    </el-button>-->
<!--                </span>-->
<!--                <span v-if="title=='申请延期'&&edtiTasksData.delayFlag == 1">-->
<!--        &lt;!&ndash;          <el-button @click="closeDialog" size="mini" style="margin-right: 30px">取 消</el-button>&ndash;&gt;-->
<!--                  <el-button size="small" type="primary" @click.native="handleCommand('申请延期')">申请延期</el-button>-->
<!--                </span>-->
<!--                <span v-if="title=='提交'&&edtiTasksData.nextOperation == 2">-->
<!--        &lt;!&ndash;          <el-button @click="closeDialog" size="small" style="margin-right: 30px">取 消</el-button>&ndash;&gt;-->
<!--                  <el-button type="primary" size="mini" @click="handleCommand('提交')">-->
<!--                      提交-->
<!--                    </el-button>-->
<!--                </span>-->

<!--                <el-button  type="primary" icon="el-icon-chat-line-round" size="mini" @click="takeMemo">备注</el-button>-->
<!--                <el-button  type="primary" icon="el-icon-chat-line-round" size="mini" @click="excutorView=true" v-if="nextOperation == 1 || nextOperation == 2 || projectSign">分配</el-button>-->
                <el-button  type="primary" size="mini" @click="taskPlanState=true" style="margin-left: 0">提醒计划</el-button>
<!--                <el-button  type="primary" size="mini" v-if="edtiTasksData.taskStatus!=='已完成'&&projectSign" @click="completeTask ">完成</el-button>-->
                <el-dropdown trigger="click" @command="handleCommand">
                  <span class="el-dropdown-link">
                    <el-button type="primary"  size="mini" >更多 <i class="el-icon-arrow-down el-icon--right"></i></el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item  command="关注">{{edtiTasksData.watchList&&edtiTasksData.watchList.find(item=>item.userId==$store.getters.userId)?'停止关注':'添加关注'}}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>

              <div class="model_wrap">
                <div class="divider"><span>任务详情</span></div>
                <div>
                  <el-form label-position="left" label-width="100px" :model="edtiTasksData" :rules="EditTaskRules">
<!--                    <el-form-item label="当前模板名称:" style="width: 100%;">-->
<!--                      <span>{{teptName}}</span>-->
<!--                      <el-button  type="primary" :disabled="end" size="mini" @click="taskTemplateView = true">选择</el-button>-->
<!--                      <el-button  type="primary" :disabled="end" size="mini" @click="noTemplate">删除</el-button>-->
<!--                    </el-form-item>-->
                    <el-row v-if="!workSign&&!projectSign" style="width: 100%;">
                      <el-col :span="24">
                        <el-form-item style="width: 100%;" label="当前模板名称:">
                          <span>{{edtiTasksData.teptName}}</span>
                          <el-button type="primary" size="mini" @click="taskTemplateView = true">选择</el-button>
                          <el-button type="primary" size="mini" @click="noTemplate">删除</el-button>
                        </el-form-item>
                      </el-col>

                    </el-row>


                    <el-row v-if="!projectSign" style="width: 100%;">
                      <el-col :span="12">
                        <el-form-item style="width: 100%;" class="" label="选择任务:" v-if="!workSign">
                          <el-multi-cascader
                            ref="refHandle"
                            :options="templateGroupTask"
                            @change="editTemplateChange"
                            v-model="taskList"
                            multiple
                            filterable
                            select-children
                            clearable
                            collapse-tags
                            only-out-put-leaf-node
                            change-on-select> </el-multi-cascader>
                        </el-form-item>
                        <el-form-item style="width: 100%;" v-else label="工作类型:">
                          <el-select clearable  class="select-input" v-model="edtiTasksData.workType" placeholder="请选择">
                            <el-option
                              v-for="item in workKinds"
                              :key="item.workType"
                              :label="item.workTypeName"
                              :value="item.workType">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12" v-if="!workSign">
                        <el-form-item style="width: 100%;" class="group-task" label="阶段:" prop="createTaskGroup">
        <!--                  <div v-if="taskgroupList.length<1">-->
        <!--                    <el-input placeholder="请填写任务组:"></el-input>-->
        <!--                  </div>-->
                          <div>
                            <el-select @change="changeHa" allow-create filterable v-model="edtiTasksData.createTaskGroup"  placeholder="请选择">
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
                    <el-row v-if="projectSign" style="width: 100%;">
                      <el-form-item style="width: 100%;" class="group-task" label="阶段:" prop="prjTgId">
                        <el-select allow-create filterable v-model="edtiTasksData.createTaskGroup"  placeholder="请选择">
                          <el-option
                            v-for="(item, index) in taskgroupList"
                            :key="item.prjTgId"
                            :label="item.prjTgName"
                            :value="item.prjTgId">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-row>
                    <el-row style="width: 100%;">
                      <el-col :span="24">
                        <el-form-item  style="width: 100%;" label="任务名称:" prop="prjTaskName">
                          <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 4}" v-model="edtiTasksData.prjTaskName"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-form-item label="任务状态:">
                      {{edtiTasksData.taskStatus}}
                    </el-form-item>

                  </el-form>

                </div>
              </div>
              <div class="model_wrap">
                <div class="divider"><span>描述</span></div>
                <div>
                  <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4}" v-model="edtiTasksData.prjTaskDesc"></el-input>
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
                    v-model="edtiTasksData.itemList">
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
                    <div style="text-align: center;margin-bottom: 10px">
                      <span style="font-size: 12px;">将文件拖放到此处以添加附件，或者<span style="color: #409EFF;cursor: pointer;" @click="clickUpload=true">浏览</span></span>
                    </div>

                    <uploadFile :clickUpload="clickUpload" @getUploadFile="getUploadFile" @changeClick="clickUpload=false"></uploadFile>

                    <div class="fileWarp" v-if="edtiTasksData.fileList&&edtiTasksData.fileList.length">
                      <div class="file_item" v-for="item in edtiTasksData.fileList">
                        <div style="display: flex;justify-content: left">
                          <svg-icon  class="svg-icon" :icon-class="$commonUtils.getSuffixFile(item.address)"/>
                          <div style="display: flex;flex-direction: column;justify-content: space-between">
                            <i class="el-icon-view" style="color: #727477;font-size: 16px;cursor: pointer;margin-right: 5px;" @click="preView(item)"></i>
                            <i v-if="$store.getters.userId == edtiTasksData.creator" class="el-icon-delete" style="font-size: 16px;cursor: pointer;margin-right: 5px" @click="unbindTaskFile(item)"></i>
                            <i v-if="$store.getters.userId == edtiTasksData.creator" class="el-icon-edit" style="margin-right: 10px;font-size: 16px;cursor: pointer" @click="doEditInOffice(item)"></i>
                          </div>

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
<!--                    <el-input-->
<!--                    type="textarea"-->
<!--                    :autosize="{ minRows: 4, maxRows: 4}"-->
<!--                    placeholder="请输入备注"-->
<!--                    v-model="edtiTasksData.remark">-->
<!--                  </el-input>-->
                    <remarksCom ref="remarksCom" :ifRemind="edtiTasksData.ifRemind" v-if="edtiTasksData.prjTaskId&&editTaskView" :prjTaskId="edtiTasksData.prjTaskId" ></remarksCom>
                  </el-tab-pane>
                  <el-tab-pane label="改动记录">
                    <ChangeRecord ref="ChangeRecord" :taskHistoryList="edtiTasksData.taskHistoryList"></ChangeRecord>
                  </el-tab-pane>
                  <addMemo ref="addMemo" :taskData="edtiTasksData"  @update="update"></addMemo>
                </el-tabs>
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
                <el-form label-position="left" label-width="120px" :model="edtiTasksData" :rules="EditTaskRules">
                  <el-form-item label="任务创建人:">
                    <UserIconAndUserName :user-id="edtiTasksData.creator" ></UserIconAndUserName>
<!--                    <virtual-select disabled clearable  :data="$store.getters.userList" v-model="edtiTasksData.creator"  filterable :render="(data)=>$commonUtils.UserRender(data)" />-->
<!--                    {{edtiTasksData.creatorName}}-->
                  </el-form-item>
                  <el-form-item label="任务分配人:">
                    <UserIconAndUserName :user-id="edtiTasksData.assignee" ></UserIconAndUserName>
<!--                    <virtual-select disabled clearable  :data="$store.getters.userList" v-model="edtiTasksData.assignee"  filterable :render="(data)=>$commonUtils.UserRender(data)" />-->

<!--                    {{edtiTasksData.assigneeName?edtiTasksData.assigneeName:'无'  }}-->
                  </el-form-item>
                  <el-form-item label="当前任务执行人:" label-width="120px" prop="executor">
                    <UserIconAndUserName :user-id="edtiTasksData.executor" ></UserIconAndUserName>
<!--                    <virtual-select disabled clearable :data="$store.getters.userList" v-model="edtiTasksData.executor"  filterable :render="(data)=>$commonUtils.UserRender(data)" />-->
<!--                    {{edtiTasksData.executorName}}-->
                  </el-form-item>
                  <el-form-item label="全部任务执行人:">
                    {{edtiTasksData.executorNames}}
                  </el-form-item>
                  <el-form-item label="关注人:">
                    <div>
                      <el-popover
                        placement="left"
                        width="270"
                        trigger="click">
                        <div>添加关注者</div>
                        <virtual-select clearable  :data="$store.getters.userList"  v-model="watchId" @change="watchIdChange" filterable :render="(data)=>$commonUtils.UserRender(data)" >
                        </virtual-select>
                        <div>输入用户名</div>
                        <div v-if="edtiTasksData.watchList&&edtiTasksData.watchList.length">
                          <div class="watch_User" v-for="item in edtiTasksData.watchList" >
                            <UserIconAndUserName :user-id="item.userId" ></UserIconAndUserName>
                            <i  @click="deleteTaskWach(item.userId)"  class="el-icon-delete"></i>
                          </div>

                        </div>
                        <el-badge style="cursor: pointer;top: 5px;" slot="reference" :value="edtiTasksData.watchList&&edtiTasksData.watchList.length" class="item" type="primary">
                        </el-badge>
                      </el-popover>

                      <span style="color: #3b73af;cursor: pointer" class="watch" @click="modifyTaskWatch(false)" v-if="edtiTasksData.watchList&&edtiTasksData.watchList.find(item=>item.userId==$store.getters.userId)">
                        停止关注这个任务
                      </span>
                      <span style="color: #3b73af;cursor: pointer" class="watch" @click="modifyTaskWatch(true)" v-else>
                         关注这个任务
                      </span>
                    </div>

                  </el-form-item>
                </el-form>
              </div>
              <div class="model_wrap">
                <div class="divider"><span>日期</span></div>

                <el-form label-position="left" label-width="100px" :model="edtiTasksData" :rules="EditTaskRules">
                  <el-form-item label="创建:">
<!--                    <el-date-picker-->
<!--                      v-model="edtiTasksData.createDate"-->
<!--                      type="date"-->
<!--                      placeholder="选择日期"-->
<!--                      value-format="yyyy-MM-dd">-->
<!--                    </el-date-picker>-->
                    {{edtiTasksData.createDate}}
                  </el-form-item>
                  <el-form-item label="开始:" prop="startDate">
                    <el-date-picker
                      :clearable="false"
                      v-model="edtiTasksData.startDate"
                      type="date"
                      placeholder="选择日期"
                      value-format="yyyy-MM-dd"
                      :picker-options="expireTimeOption_(edtiTasksData.endDate)">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="截止:" prop="endDate">
                    <el-date-picker
                      :clearable="false"
                      v-model="edtiTasksData.endDate"
                      type="date"
                      placeholder="选择日期"
                      value-format="yyyy-MM-dd"
                      :picker-options="_expireTimeOption(edtiTasksData.startDate)">
                    </el-date-picker>
                  </el-form-item>
                </el-form>
              </div>
              <div class="model_wrap">
                <div class="divider"><span>提醒</span></div>
                <el-form label-position="left" label-width="130px">
                  <el-form-item label="此次修改是否提醒:">
                    <el-checkbox
                      v-model="edtiTasksData.ifRemind"
                      :true-label="1"
                      :false-label="0"
                    ></el-checkbox>
                  </el-form-item>
                </el-form>
              </div>
            </div>


  <!--      <div class="progressWrap" v-if="percentage">-->
  <!--        <el-progress type="circle" :percentage="percentage"></el-progress>-->
  <!--      </div>-->
          </div>
<!--        <el-form class="edit-task-dialog" label-width="120px" :model="edtiTasksData" :rules="EditTaskRules">-->
<!--          <el-row v-if="!workSign">-->
<!--              <el-col :span="12">-->
<!--                <el-form-item label="当前模板名称:">-->
<!--                  <span>{{teptName}}</span>-->
<!--&lt;!&ndash;                  <el-button :disabled="$store.getters.userId != edtiTasksData.creator" type="primary" size="mini" @click="taskTemplateView = true">选择</el-button>&ndash;&gt;-->
<!--&lt;!&ndash;                  <el-button :disabled="$store.getters.userId != edtiTasksData.creator" type="primary" size="mini" @click="noTemplate">删除</el-button>&ndash;&gt;-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--              <el-col :span="12" style="">-->
<!--                <el-form-item class="group-task" label="选择任务组:" prop="createTaskGroup">-->
<!--&lt;!&ndash;                  <div v-if="taskgroupList.length<1">&ndash;&gt;-->
<!--&lt;!&ndash;                    <el-input placeholder="请填写任务组:"></el-input>&ndash;&gt;-->
<!--&lt;!&ndash;                  </div>&ndash;&gt;-->
<!--                  <div>-->
<!--                    <el-select @change="changeHa" allow-create :disabled="$store.getters.userId != edtiTasksData.creator" filterable v-model="edtiTasksData.createTaskGroup"  placeholder="请选择">-->
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
<!--                <el-form-item class="" label="选择任务:" v-if="!workSign">-->
<!--                  <el-multi-cascader-->
<!--                    :disabled="$store.getters.userId != edtiTasksData.creator"-->
<!--                    ref="refHandle"-->
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
<!--                <el-form-item v-else label="工作类型:">-->
<!--                  <el-select clearable  class="select-input" v-model="edtiTasksData.workType" placeholder="请选择">-->
<!--                    <el-option-->
<!--                      v-for="item in workKinds"-->
<!--                      :key="item.workType"-->
<!--                      :label="item.workTypeName"-->
<!--                      :value="item.workType">-->
<!--                    </el-option>-->
<!--                  </el-select>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
<!--              <el-col :span="12" style="">-->
<!--                <el-form-item  label="任务名称:" prop="prjTaskName">-->
<!--                  <el-input type="textarea" :disabled="$store.getters.userId != edtiTasksData.creator" :autosize="{ minRows: 1, maxRows: 4}" v-model="edtiTasksData.prjTaskName"></el-input>-->
<!--                </el-form-item>-->
<!--              </el-col>-->

<!--            </el-row>-->

<!--          <el-row>-->
<!--            <el-col :span="12">-->
<!--              <el-form-item label="任务描述:">-->
<!--                <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 4}" v-model="edtiTasksData.prjTaskDesc"></el-input>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="12">-->
<!--               <el-form-item label="任务检查项:">-->
<!--                <el-input-->
<!--                  type="textarea"-->
<!--                  :autosize="{ minRows: 1, maxRows: 4}"-->
<!--                  placeholder="请输入任务检查项"-->
<!--                  v-model="edtiTasksData.itemList">-->
<!--                </el-input>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--          </el-row>-->

<!--          <el-row>-->
<!--            <el-col :span="6">-->
<!--              <el-form-item label="开始日期:" prop="endDate">-->
<!--                <el-date-picker-->
<!--                  :disabled="$store.getters.userId != edtiTasksData.creator"-->
<!--                  style="width: 90%"-->
<!--                  ref="input"-->
<!--                  v-model="edtiTasksData.startDate"-->
<!--                  type="date"-->
<!--                  @change="timeCompare"-->
<!--                  value-format="yyyy-MM-dd"-->
<!--                  placeholder="选择日期">-->
<!--                </el-date-picker>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="6">-->
<!--              <el-form-item label="截止日期:" prop="endDate">-->
<!--                <el-date-picker-->
<!--                  :disabled="$store.getters.userId != edtiTasksData.creator"-->
<!--                  style="width: 90%"-->
<!--                  ref="input"-->
<!--                  v-model="edtiTasksData.endDate"-->
<!--                  type="date"-->
<!--                  @change="timeCompare"-->
<!--                  value-format="yyyy-MM-dd"-->
<!--                  placeholder="选择日期">-->
<!--                </el-date-picker>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="12">-->
<!--              <el-form-item label="任务创建人:">-->
<!--                {{edtiTasksData.creatorName}}-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--          <el-row>-->
<!--            <el-col :span="12">-->
<!--              <el-form-item label="当前任务执行人:">-->
<!--                {{edtiTasksData.executorName}}-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="12">-->
<!--              <el-form-item label="全部任务执行人:">-->
<!--                {{edtiTasksData.executorNames}}-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--          <el-row>-->
<!--            <el-col :span="12" class="bott">-->
<!--              <el-form-item label="任务分配人:">-->
<!--                {{edtiTasksData.assigneeName?edtiTasksData.assigneeName:'无'  }}-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="12" class="bott">-->
<!--              <el-form-item label="任务状态:">-->
<!--                {{edtiTasksData.taskStatus}}-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--          <el-row>-->
<!--          </el-row>-->
<!--        </el-form>-->
        <div class="parent">
          <span slot="footer" class="dialog-footer" style="">
          <el-button @click="closeDialog('取消')" size="mini" style="margin-right: 10px">取 消</el-button>
          <el-button  type="primary" @click="modifyProjectTask" size="mini" style="margin-right: 10px">修 改</el-button>

<!--          <span v-if="title=='审核'&&edtiTasksData.nextOperation==3" class="dialog-footer" style="display: flex;justify-content: center">-->
<!--            <el-button type="primary" size="mini" @click="handleCommand('审核')">-->
<!--              审核-->
<!--            </el-button>-->
<!--&lt;!&ndash;          <el-button @click="closeDialog" size="mini" style="margin-right: 30px">取 消</el-button>&ndash;&gt;-->
<!--&lt;!&ndash;          <el-dropdown v-if="edtiTasksData.nextOperation==3" @command="(e)=>auditTask(edtiTasksData, e)" trigger="click">&ndash;&gt;-->
<!--&lt;!&ndash;            <el-button type="primary" size="mini">&ndash;&gt;-->
<!--&lt;!&ndash;              审核<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>&ndash;&gt;-->
<!--&lt;!&ndash;            </el-button>&ndash;&gt;-->
<!--&lt;!&ndash;            <el-dropdown-menu slot="dropdown">&ndash;&gt;-->
<!--&lt;!&ndash;              <el-dropdown-item command="1">通过</el-dropdown-item>&ndash;&gt;-->
<!--&lt;!&ndash;              <el-dropdown-item command="2">不通过</el-dropdown-item>&ndash;&gt;-->
<!--&lt;!&ndash;            </el-dropdown-menu>&ndash;&gt;-->
<!--&lt;!&ndash;          </el-dropdown>&ndash;&gt;-->
<!--        </span>-->

<!--        <span v-if="title=='审批延期'&&edtiTasksData.delayFlag == 2 " class="dialog-footer" style="display: flex;justify-content: center">-->
<!--          <el-button type="primary" size="mini" @click="handleCommand('审批延期')">-->
<!--              审批延期-->
<!--            </el-button>-->
<!--&lt;!&ndash;          <el-button @click="closeDialog" size="mini" style="margin-right: 30px">取 消</el-button>&ndash;&gt;-->
<!--&lt;!&ndash;          <el-dropdown @command="(e)=>handleCommand('审批延期')" trigger="click">&ndash;&gt;-->
<!--&lt;!&ndash;            <el-button type="primary" size="mini">&ndash;&gt;-->
<!--&lt;!&ndash;              审批<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>&ndash;&gt;-->
<!--&lt;!&ndash;            </el-button>&ndash;&gt;-->
<!--&lt;!&ndash;            <el-dropdown-menu slot="dropdown">&ndash;&gt;-->
<!--&lt;!&ndash;              <el-dropdown-item command="1">通过</el-dropdown-item>&ndash;&gt;-->
<!--&lt;!&ndash;              <el-dropdown-item command="2">不通过</el-dropdown-item>&ndash;&gt;-->
<!--&lt;!&ndash;            </el-dropdown-menu>&ndash;&gt;-->
<!--&lt;!&ndash;          </el-dropdown>&ndash;&gt;-->
<!--        </span>-->
<!--        <span v-if="title=='申请延期'&&edtiTasksData.delayFlag == 1" class="dialog-footer" style="display: flex;justify-content: center">-->
<!--&lt;!&ndash;          <el-button @click="closeDialog" size="mini" style="margin-right: 30px">取 消</el-button>&ndash;&gt;-->
<!--          <el-button size="small" type="primary" @click.native="handleCommand('申请延期')">申请延期</el-button>-->
<!--        </span>-->
<!--        <span v-if="title=='提交'&&edtiTasksData.nextOperation == 2" class="dialog-footer" style="display: flex;justify-content: center">-->
<!--&lt;!&ndash;          <el-button @click="closeDialog" size="small" style="margin-right: 30px">取 消</el-button>&ndash;&gt;-->
<!--          <el-button type="primary" size="mini" @click="handleCommand('提交')">-->
<!--              提交-->
<!--            </el-button>-->
<!--&lt;!&ndash;          <el-dropdown @command="(e)=>submitTasks(edtiTasksData, e)" trigger="click">&ndash;&gt;-->
<!--&lt;!&ndash;            <el-button type="primary" size="mini">&ndash;&gt;-->
<!--&lt;!&ndash;              提交<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>&ndash;&gt;-->
<!--&lt;!&ndash;            </el-button>&ndash;&gt;-->
<!--&lt;!&ndash;            <el-dropdown-menu slot="dropdown">&ndash;&gt;-->
<!--&lt;!&ndash;              <el-dropdown-item command="1">提交</el-dropdown-item>&ndash;&gt;-->
<!--&lt;!&ndash;              <el-dropdown-item command="2">提交并创建新任务</el-dropdown-item>&ndash;&gt;-->
<!--&lt;!&ndash;            </el-dropdown-menu>&ndash;&gt;-->
<!--&lt;!&ndash;          </el-dropdown>&ndash;&gt;-->
<!--        </span>-->
        </span>
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
<!--      分配执行人-->
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
        <div style="width:100%;display: flex;justify-content: center;align-items: center">
          <el-form :model="edtiTasksData" label-width="120px">
            <el-form-item label="执行人:">
              <virtual-select clearable  :data="$store.getters.userList" v-model="edtiTasksData.executor"  filterable :render="(data)=>$commonUtils.UserRender(data)" >
              </virtual-select>
            </el-form-item>
            <el-form-item label="常用执行人:">
              <localExector @getUserId="(e)=>edtiTasksData.executor=e"></localExector>
            </el-form-item>
            <el-form-item label="开始日期:">
              <span>{{edtiTasksData.startDate}}</span>
            </el-form-item>
            <el-form-item label="截止日期:">
              <el-date-picker
                class="executor"
                v-model="edtiTasksData.endDate"
                type="date"
                :clearable="false"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                :picker-options="expireTimeOption()">
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>

      <span slot="footer" class="dialog-footer" style="display: flex;justify-content: center">
          <el-button @click="assginTask" type="primary" size="small">确 定</el-button>
          <el-button size="small" @click="excutorView = false">取 消</el-button>
        </span>
    </el-dialog>
      <!--提醒计划-->
  <taskPlanList :visible.sync="taskPlanState" :task-info="edtiTasksData"></taskPlanList>
<!--      申请延期-->
      <delayDate ref="delay" :approve="approveView" :delayInfo="edtiTasksData" :delayView="shenqingView" :taskId="edtiTasksData.prjTaskId" @modifyTask="modifyTask" @closeDelay="closeDelay"></delayDate>
<!--   审核-->
      <auditTasks :audit-data="edtiTasksData" :audit-view="auditTaskView" @closeAudit="closeAudit" @auditTasks="auditTasks"></auditTasks>
    </div>
</template>

<script>
  import localExector from "../../project_management/components/localExector";
  import auditTasks from './auditTask'
  import taskPlanList from "@/views/workbench/project_management/components/taskPlanList";
  import addMemo from "@/views/workbench/project_management/components/addMemo";
  import remarksCom from "@/views/workbench/project_management/components/remarksCom";
  import ChangeRecord from "@/views/workbench/project_management/components/ChangeRecord";
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
    queryWorkType,
    addTaskWach,
    deleteTaskWach,
    queryTaskWatch,
    queryProjectDetail,
    delayTask,
    finishTask,
    creatematerial,
    bindTaskFile,
    recordOnlienEdit
  } from '@/api/caseList'
  import uploadFile from '@/views/workbench/material_management/components/uploadFile'
  import { queryTaskList, queryTemplateFileList,queryTemplateList } from '@/api/templateManagement'
  import delayDate from "../../toDoTasks/components/delayDate";
  import TemplateList from '../../system_management/templateManagement/index'
  import Bus from '@/utils/Bus'
  import { doEditInOffice, getProgID } from '@/utils/editInOffice.js'
  export default {
    name: "EditTask",
    components:{
      TemplateList,
      taskPlanList,
      addMemo,
      remarksCom,
      ChangeRecord,
      delayDate,
      auditTasks,
      localExector,
      uploadFile
    },
    props:{
      projectSign:{
        type:Boolean,
        default:false
      },
      title:{
        type:String,
        default:'任务修改'
      },
      editData: {},
      workSign: false,
      editView: false,
      id: '', //teptId
      name: '',//teptName
      taskDataCaseId: '',
      // backDate: '',
      groupList: {
        type: Array,
        default () {
            return []
        }
      },
      tepGroupList: {
        type: Array,
        default () {
            return []
        }
      }

    },
    computed:{
      prjId(){
        return this.edtiTasksData.projectId
      }
    },
    watch:{
      workSign(n,o){
        n&&this.workClick()
      },
      projectSign(n){
        if(n){
          this.queryProjectDetail(this.prjId)
        }
      },
      tepGroupList: {
        handler(n){
          this.templateGroupTask = n
        },
        immediate:true
      },
      editData: {
        handler(n){
          this.edtiTasksData = JSON.parse(JSON.stringify(n))
          // this.projectSign&&this.queryProjectDetail(this.edtiTasksData.projectId)
          // if(Array.isArray(this.edtiTasksData.itemList)){
            // this.edtiTasksData.itemList = this.edtiTasksData.itemList.map(i=>i.prjIemName).join('\n')
          // }
          // this.edtiTasksData.itemList = arr.join('\n')
          // console.log(this.edtiTasksData.itemList,99900)
          this.edtiTasksData.prjTaskId&&this.editTaskView&&this.queryTaskWatch(this.edtiTasksData.prjTaskId)
          this.endDate1 = this.edtiTasksData.endDate
          this.edtiTasksData.startDate1 = this.edtiTasksData.startDate
          this.delayFlag = this.edtiTasksData.delayFlag
          this.nextOperation = this.edtiTasksData.nextOperation
          // this.$set(this.edtiTa  sksData,'endDate1',this.edtiTasksData.endDate)
          if(this.edtiTasksData.delayFlag&&this.edtiTasksData.delayFlag == 2){
            this.handleList = [
            {'name':'分配','nextOperation':'12','ban':1},
            {'name':'提交','nextOperation': '2','ban':1},
            {'name':'审核','nextOperation':'3','ban':1},
            {'name':'申请延期','delayFlag': '1','ban':1},
            {'name':'审批延期','delayFlag': '2'},
            // {'name':'修改','per':this.$store.getters.userId},
            // {'name':'删除','per':this.$store.getters.userId}
            ]
          }else{
            this.handleList = [
              {'name':'分配','nextOperation':'12'},
              {'name':'提交','nextOperation': '2'},
              {'name':'审核','nextOperation':'3'},
              {'name':'申请延期','delayFlag': '1'},
              {'name':'审批延期','delayFlag': '2'},
              // {'name':'修改','per':this.$store.getters.userId},
              // {'name':'删除','per':this.$store.getters.userId}
            ]
          }
        },
        immediate:true
      },
      groupList: {
        handler(n){
          this.taskgroupList = JSON.parse(JSON.stringify(n))

          // console.log(this.taskgroupList,'0000')
          // console.log(this.edtiTasksData.createTaskGroup,'00001')
        },
        immediate:true
      },
      editView(n){
        this.editTaskView = n
      },
      name:{
        handler(n){
          this.teptName = n
        },
        immediate: true
      },
      id:{
        handler(n){
          this.edtiTasksData.teptId = n
        },
        immediate: true
      }
    },
    data(){
      // 获取当前日期
      let currentDate = new Date();
      // 格式化日期为 yyyy-MM-dd
      let year = currentDate.getFullYear();
      let month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 加1并补零
      let day = String(currentDate.getDate()).padStart(2, '0'); // 补零
      const formattedDate = `${year}-${month}-${day}`
      return{
        clickUpload:false,
        auditTaskView:false,
        approveView:false,
        shenqingView: false,
        nextOperation: '',
        delayFlag:'',
        endDate1: '',
        watchId:'',
        excutorView:false,
        taskPlanState:false,
        handleList: [
          // {'name':'分配','nextOperation':'12'},
          // {'name':'提交','nextOperation': '2'},
          // {'name':'审核','nextOperation':'3'},
          // {'name':'申请延期','delayFlag': '1'},
          // {'name':'审批延期','delayFlag': '2'},
          // {'name':'修改','per':this.$store.getters.userId},
          // {'name':'删除','per':this.$store.getters.userId}
        ],
        changeTeptId: '',
        changeTeptName: '',
        onceCreateGroup: true,
        // workType:'',
        groupForm: {
          prjTgName: '',
          agentNum: ''
        },
        taskForm: {
          createTaskGroup: '',
          prjTaskName: '',
          prjTaskDesc: '',
          beginDate: formattedDate,
          endDate: '',
          checkItem: '',
          executor: ''
        },
        editTaskView: false,
        taskTemplateView:false,
        EditTaskRules: {
          prjTaskName: [{ required: true, message: '请输入任务名称', trigger: 'change' }],
          endDate: [{ required: true, message: '请选择截止日期', trigger: 'change' },],
          startDate: [{ required: true, message: '请选择开始日期', trigger: 'change' },]
        },
        edtiTasksData: {
          teptId:'',
          teptName:'',
          prjTgId:'',
          watchList:[],
          createTaskGroup: '',
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
        // teptName: this.name,
        // teptId: this.id,
        templateGroupTask: [],
        taskList: [],
        taskgroupList:[],
        subTaskList: [],
        peopleList: [],
        workKinds: [],
        groupNames: '',
        tgId: '',
        groupLists:[],
        hoverState: false,
        curFile:[],
      }
    },
    created() {
      // this.queryPeopleList()
      // this.workClick()
    },
    methods:{
      modifyTask(a){
        //a:'申请' || '审批'
        this.modifyProjectTask('noMessage', a)
      },
      unbindTaskFile(data) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          unbindTaskFile({materialId: data.materialId,prjTaskId: this.edtiTasksData.prjTaskId}).then(()=>{
            this.$message.success('删除成功！')
            this.$emit('update','0')
          })
        })

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
          // doEditInOffice(url, getProgID(url))
        } else if(['pdf','jpg','png'].some(item=>url.replace(/.+\./,"").toLocaleLowerCase()==item)){
          window.open(`/ipdoc${url}`.replace(/[+]/g,'%2B'))
        } else {
         this.downLoad(data)
        }
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
      getUploadFile(e){
        this.curFile=e.target.files
        this.createMultMaterial(this.curFile)
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
          bindTaskFile({prjTaskId:this.edtiTasksData.prjTaskId,materialIdList:this.materialIdList}).then(res=>{
            this.$message.success('文件绑定成功')
            this.$emit('update','0')
          })
          }).catch(()=>{
            this.percentage = 0
          })
      },
      enentDrop(e){
        e.stopPropagation();
        e.preventDefault();
        this.hoverState=false
        this.curFile=e.dataTransfer.files
        this.createMultMaterial(this.curFile)
      },
      completeTask(){
        finishTask({prjTaskId:this.edtiTasksData.prjTaskId}).then(res=>{
          this.$emit('update')
        })
      },
      closeDelay(f){
        this.shenqingView = false
        this.approveView = false
        f=='update'&&this.$emit('update')
      },
      watchIdChange(e){
        if(this.edtiTasksData.watchList.find(item=>item.userId==e)){
          this.watchId=null
          this.$message.warning('该员工已关注')
          return
        }
        if(e){
          addTaskWach({prjTaskId:this.edtiTasksData.prjTaskId,userId:e}).then(res=>{
            this.queryTaskWatch(this.edtiTasksData.prjTaskId)
            this.watchId=null
            this.$message.success('添加成功')
          })
        }
      },
      queryProjectDetail(projectId){
        queryProjectDetail({projectId}).then(res=>{
          res.data&&res.data.groupList&&(this.taskgroupList = res.data.groupList)
          // console.log(this.groupLists,9999)
        })
      },
      modifyTaskWatch(flag){
        if(flag){
          this.addTaskWach()
        }else {
          this.deleteTaskWach(this.$store.getters.userId)
        }
      },
      addTaskWach(){
        addTaskWach({prjTaskId:this.edtiTasksData.prjTaskId,userId:this.$store.getters.userId}).then(res=>{
          this.queryTaskWatch(this.edtiTasksData.prjTaskId)
        })
      },
      deleteTaskWach(userId){
        let twId=this.edtiTasksData.watchList&&this.edtiTasksData.watchList.find(item=>item.userId==userId).twId
        deleteTaskWach({prjTaskId:this.edtiTasksData.prjTaskId,userId,twId}).then(res=>{
          this.queryTaskWatch(this.edtiTasksData.prjTaskId)
        })
      },
      queryTaskWatch(prjTaskId){
        queryTaskWatch({prjTaskId}).then(res=>{
          this.$set(this.edtiTasksData,'watchList',res.data)
          // this.edtiTasksData.watchList=res.data
        })
      },
      assginTask() {
        // return;
        if(!this.edtiTasksData.executor){
          this.$message.error('请选择执行人')
          return
        }
        if(!this.edtiTasksData.endDate){
          this.$message.error('请填写截止时间')
          return;
        }
        if(this.CompareDate(this.edtiTasksData.startDate,this.edtiTasksData.endDate)){
          this.$message.error(`截止日期不能早于开始日期:${this.edtiTasksData.startDate}`)
          return;
        }
        this.modifyTask()
        assginTask({prjTaskId:this.edtiTasksData.prjTaskId, executor:this.edtiTasksData.executor, endDate: this.edtiTasksData.endDate}).then(()=>{
          this.$message.success('任务分配成功!')
          // this.init()
          // this.closeDialog('成功')
          this.$emit('update')
          this.excutorView = false
        })
      },
      expireTimeOption(){
        let that=this
        return {
          disabledDate(date) {
            return that.CompareDate(that.$commonUtils.formatDate(date),that.endDate1)
          }
        }
      },
      closeAudit(){
        this.auditTaskView = false
      },
      auditTasks(data){
        this.modifyTask()
        this.$emit('shenHe',[data.result, data])
        this.auditTaskView = false
      },
      handleCommand(command){
        // if(command == '分配' || command == '审核' || command == '提交' || command == '申请延期' || command == '审批延期'){
        //   this.modifyProjectTask('noMessage')
        // }
        if(command == '分配'){
          this.excutorView = true
        }
        if(command=='关注'){
          if(this.edtiTasksData.watchList&&this.edtiTasksData.watchList.find(item=>item.userId==this.$store.getters.userId)){
            this.modifyTaskWatch(false)
          }else {
            this.modifyTaskWatch(true)
          }
        }else{
          this.edtiTasksData.caseId = this.taskDataCaseId
          this.edtiTasksData.taskId = this.edtiTasksData.prjTaskId
          if(command == '审核'){
            this.auditTaskView =  true
          }
          if(command == '提交'){
          //  打开提交弹框
            this.$confirm('请选择提交方式', "提示", {
                confirmButtonText: "提交",
                cancelButtonText: "提交并创建新任务",
                distinguishCancelAndClose: true,
                type: "warning"
              }).then(()=>{
                this.modifyProjectTask('noMessage')
                this.$emit('tijiao', [this.edtiTasksData,1,this.edtiTasksData.caseId])
            }).catch((action)=>{
                if(action=='cancel'){
                  this.modifyProjectTask('noMessage')
                  this.$emit('tijiao', [this.edtiTasksData,2,this.edtiTasksData.caseId])
                }

              })
          }
          if(command == '申请延期'){
            this.approveView = false
            this.shenqingView = true
          }
          if(command == '审批延期'){
            this.shenqingView = true
            this.approveView = true
          }

        }
      },
      auditTask(data,e){
        this.auditTaskView =  true
      },
      submitTasks(data,e){
        this.$emit('tijiao', [this.edtiTasksData,e,this.edtiTasksData.caseId])
      },
      takeMemo(){
        this.$refs.addMemo.takeMemo()
      },
      update(){
        this.$refs.remarksCom.queryTaskMemo()
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
      workClick() {
        queryWorkType().then(res=>{
          this.workKinds = res.data
        })
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
          addProjectTaskGroup({ caseId: this.taskDataCaseId, prjTgName: v, tepId: this.edtiTasksData.teptId}).then((res)=>{
            let id = res.data.prjTgId
            queryProjectTask({caseId:this.taskDataCaseId}).then((res)=>{

          this.taskgroupList = res.data

          // this.taskgroupList.forEach((i,index)=>{
          //   this.activeNames.push(index)
          // })
          //     this.taskgroupList = res.data
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
            this.edtiTasksData.createTaskGroup =this.taskgroupList.find(i=>i.prjTgId == id).prjTgId
            })
            // this.createGroupView = false
            this.groupForm.prjTgName = ''
            // this.taskForm.createTaskGroup = res.data.prjTgId
            // this.confirmDialog = false
          })
        }
      },
      deepFlatten(arr) {
        let flatten = (arr)=> [].concat(...arr);
        return flatten(arr.map(x=>Array.isArray(x)? this.deepFlatten(x): x));
      },
      editTemplateChange(v) {
        if(v.length == 0){
          // this.confirmDialog = false
          this.edtiTasksData.createTaskGroup = ''
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
                this.edtiTasksData.createTaskGroup = this.taskgroupList.find(item=>item.prjTgName == this.groupNames).prjTgId
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
        // console.log(this.subTaskList,'111')
        if(this.subTaskList.length==1){
          this.taskDefineId = this.subTaskList[0].taskDefineId
        }else{
          this.taskDefineId = ''
        }
        let prjTaskNameList = []
        let prjTaskDescList = []
        let prjTaskCheckList = []
        // console.log(prjTaskNameList,'222')
        this.subTaskList.forEach(item => {
          prjTaskNameList.push(item.subTaskName)
          prjTaskDescList.push(item.subTaskDesc)
          prjTaskCheckList.push(item.itemList)
        })

        let arr = []
        this.deepFlatten(prjTaskCheckList.filter(item=>!!item)).forEach((i, index)=>{
          // arr.push(index+1+'.'+i.itemName)
          if(i.itemName){
            if(i.itemName.slice(0,3).includes('.')){
              // let signIndex = i.itemName.indexOf('.')
              // arr.push(i.itemName.substring(signIndex+1))
              arr.push(i.itemName)
            }else{
              arr.push(index+1+'.'+i.itemName)
            }
          }

        })

        this.edtiTasksData.itemList = arr.join('\n')
        this.edtiTasksData.prjTaskName = prjTaskNameList.filter(item=>!!item).join('&')
        this.edtiTasksData.prjTaskDesc = prjTaskDescList.filter(item=>!!item).join('\n')
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
      timeCompare(v){
        // console.log(v,123)
        if(this.CompareDate(this.edtiTasksData.startDate, this.edtiTasksData.endDate)){
          this.$message.error('开始日期不能超过截止日期!')
          // this.edtiTasksData.startDate = ''
          // this.edtiTasksData.endDate = ''
          return
        }
      },
      CompareDate(d1,d2) {
        return ((new Date(d1.replace(/-/g,"\/"))) > (new Date(d2.replace(/-/g,"\/"))));
      },
      // editTaskViewClos() {
      //   // this.clickClose()
      //   // this.materialTypeId = ''
      //   // this.typeNameList = []
      //   // this.fileDocId = ''
      //   this.editTaskView = false
      //   this.prjTaskId = ''
      //   this.closeDialog()
      //   // this.rightView = false
      // },
      closeDialog(f=''){
        this.groupLists = []
        this.editTaskView = false
        this.onceCreateGroup = true
        // this.prjTaskId = ''
        // this.edtiTasksData = []
        // this.teptId = ''
        // this.teptName = ''
        this.taskList = []
        // this.templateGroupTask = []
        this.workType = ''
        this.$emit('editTaskViewClos',f)
      },
      async modifyProjectTask(f,a) {
        let itemList1 = ''
        if(!this.edtiTasksData.prjTaskName){
          this.$message.error('请填写任务名称!')
          return
        }
        if(this.CompareDate(this.edtiTasksData.startDate, this.edtiTasksData.endDate)){
          this.$message.error('开始日期不能超过截止日期!')
          // this.edtiTasksData.startDate = ''
          // this.edtiTasksData.endDate = ''
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
          itemList1 = this.edtiTasksData.itemList+''
          this.edtiTasksData.itemList.split('\n').filter(item=>!!item).forEach((i,index)=>{
            if(i.slice(0,3).includes('.')){
              // let signIndex = i.indexOf('.')
              // list.push(i.substring(signIndex+1))
              list.push(i)
            }else{
              list.push(index+1+'.'+i)
            }
          })
          this.edtiTasksData.itemList = list.map(i=>({
            prjIemName: i
          }))
        }
        // if(this.backDate == this.edtiTasksData.endDate){
        //   this.edtiTasksData.endDate = ''
        // }
        // this.clickClose()
        // this.materialTypeId = ''
        // this.typeNameList = []
        // this.fileDocId = ''
        this.edtiTasksData.prjTgId = this.edtiTasksData.createTaskGroup
        await modifyProjectTask(this.edtiTasksData).then(()=>{
          // this.queryProjectTask()
          // alert(1)
          if(f == 'noMessage'){
            if(a&&a=='申请'){
              this.$refs.delay.shenqing()
            }
            if(a&&a=='审批'){
              this.$refs.delay.shenpi()
            }
            this.edtiTasksData.itemList = itemList1
          }else{
            this.$message.success('修改成功！')
            this.closeDialog('修改成功')
            this.onceCreateGroup = true
            this.editTaskView = false
          }
        }).catch(()=>{
          // this.$message.error('没有权限修改截止日期！')
        })
      },
      queryPeopleList(data) {
        // console.log('+++++++++++++++')
        // console.log(data)
        // console.log('+++++++++++++++')
        queryTaskUserList({caseId: this.taskDataCaseId}).then(res=>{
          this.peopleList = res.data
        })
      },
      cancelChose(){
        this.taskTemplateView = false
        this.changeTeptId = ''
        this.changeTeptName = ''
      },
      templateData(item) {
        // this.teptId = item.teptId
        // this.teptName = item.teptName
        // this.edtiTasksData.teptName = item.teptName
        // this.edtiTasksData.teptId = item.teptId
        this.changeTeptId = item.teptId
        this.changeTeptName = item.teptName
      },
      noTemplate() {
        // this.$refs['tempList'].selected = 100
        Bus.$emit('deleteSelect')
        this.taskTemplateView = false
        this.templateGroupTask = []
        this.taskList = []
        this.edtiTasksData.teptName = ''
        this.groupForm.prjTgName = ''
        this.onceCreateGroup = true
      },
      leadIn() {
        if(this.changeTeptId){
          this.edtiTasksData.teptId = this.changeTeptId
          // this.edtiTasksData.teptId = this.changeTeptId
        }
        if(this.changeTeptName){
          this.teptName = this.changeTeptName
          this.edtiTasksData.teptName = this.changeTeptName
        }
        this.changeTeptId = ''
        this.changeTeptName = ''
        this.$refs['tempList'].selected = 100
        queryTaskList({teptId: this.edtiTasksData.teptId, caseId: this.taskDataCaseId}).then((res)=>{
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
        addProjectTaskGroup({tgId: this.tgIdd, caseId: this.taskDataCaseId, prjTgName: this.groupNames, tepId: this.edtiTasksData.teptId}).then((res)=>{
          let id = res.data.prjTgId
            queryProjectTask({caseId:this.taskDataCaseId}).then((res)=>{

          this.taskgroupList = res.data

              this.taskgroupList = res.data
              // this.taskForm.createTaskGroup =this.taskgroupList.find(i=>i.prjTgId == id).prjTgId

        }).then((res)=>{
              // this.$emit('update')
            this.edtiTasksData.createTaskGroup =this.taskgroupList.find(i=>i.prjTgId == id).prjTgId
            })
            this.createGroupView = false
            this.groupForm.prjTgName = ''
        })
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
    .el-upload__text{
      margin-top: 20px;
    }
    .upload-demo{
      >>>.el-upload{
        width: 100%;
        height: 100%;
        .el-upload-dragger{
          width: 100%!important;
          height: 100%!important;
          min-height: 200px;
        }
      }
    }
  .taskDetail .wrap_left .model_wrap .svg-icon{
    color: #999;
    font-size: 50px !important ;
    width: 200px;
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




  .el-form {
    .el-row{
      &:last-child{
        border-bottom: 1px solid #ccc;
      }
    }
  }
  /*.new-task-dialog,.edit-task-dialog{*/
  /*  .el-row{*/
  /*    display: flex;*/
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
  /*          background-color: #f1f1f1;*/
  /*          flex-shrink: 0;*/
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
  .dialog-footer{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  /*.parent{*/
  /*  width: 100%;*/
  /*  height: 40px;*/
  /*  position: relative!important;*/
  /*  !*transform:translate(0,0);*!*/
  /*  .dialog-footers{*/
  /*    width: 100%;*/
  /*    position: fixed;*/
  /*    right: 0;*/
  /*    bottom: 0;*/
  /*    background-color: #eee;*/
  /*  }*/
  /*}*/

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
</style>
