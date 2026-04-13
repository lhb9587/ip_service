<template>
    <div class="dialog">
<!--   审核   -->
      <div class="drag">
        <el-dialog
        :title="dialogName"
        :visible.sync="shenView"
        width="80%"
        :before-close="closeDialog"
        center
        top="0"
        height="500"
        append-to-body
        :modal="false"
        v-dialogDrag
        :close-on-click-modal="false"
        >
        <div class="taskDetail">
            <div class="wrap_left">
<!--              <div class="model_wrap">-->
                <el-breadcrumb separator="/">
                  <el-breadcrumb-item >{{edtiTasksData.prjName}}</el-breadcrumb-item>
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
              <div style="font-size: 18px;font-weight: bold;line-height: 20px">
                {{edtiTasksData.prjTaskName}}
              </div>
<!--              操作按钮-->
              <div>
<!--                <el-button  type="primary" icon="el-icon-chat-line-round" size="mini" @click="takeMemo">备注</el-button>-->
                <el-button  type="primary" size="mini" @click="taskPlanState=true">提醒计划</el-button>
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
                    <el-row style="width: 100%;">
<!--                      <el-col :span="24">-->
<!--                        <el-form-item  style="width: 100%;" label="任务名称:" prop="prjTaskName">-->
<!--                          {{edtiTasksData.prjTaskName||edtiTasksData.taskName}}-->
<!--                        </el-form-item>-->
<!--                      </el-col>-->
                      <el-form-item label="任务状态:">
                        {{edtiTasksData.taskStatus}}
                      </el-form-item>
                    </el-row>


                    <el-row v-if="!workSign&&!projectSign" style="width: 100%;">
                      <el-col :span="24">
                        <el-form-item style="width: 100%;" label="当前模板名称:">
                          <span>{{edtiTasksData.teptName}}</span>
                          <el-button :disabled="$store.getters.userId != edtiTasksData.creator" type="primary" size="mini" @click="taskTemplateView = true">选择</el-button>
                          <el-button :disabled="$store.getters.userId != edtiTasksData.creator" type="primary" size="mini" @click="noTemplate">删除</el-button>
                        </el-form-item>
                      </el-col>

                    </el-row>


                    <el-row v-if="!projectSign" style="width: 100%;">
                      <el-col :span="12">
                        <el-form-item style="width: 100%;" class="" label="选择任务:" v-if="!workSign">
                          <el-multi-cascader
                            :disabled="$store.getters.userId != edtiTasksData.creator"
                            ref="refHandle"
                            :options="templateGroupTask"
                            @change="editTemplateChange"
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
                        <el-form-item style="width: 100%;" class="group-task" label="选择任务组:" prop="createTaskGroup">
        <!--                  <div v-if="taskgroupList.length<1">-->
        <!--                    <el-input placeholder="请填写任务组:"></el-input>-->
        <!--                  </div>-->
                          <div>
                            <el-select  allow-create :disabled="$store.getters.userId != edtiTasksData.creator" filterable v-model="edtiTasksData.createTaskGroup"  placeholder="请选择">
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
                      <el-form-item style="width: 100%;" class="group-task" label="选择任务组:" prop="prjTgId">
                        <el-select allow-create :disabled="$store.getters.userId != edtiTasksData.creator" filterable v-model="edtiTasksData.createTaskGroup"  placeholder="请选择">
                          <el-option
                            v-for="(item, index) in groupLists"
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
                          <el-input type="textarea" :disabled="$store.getters.userId != edtiTasksData.creator" :autosize="{ minRows: 1, maxRows: 4}" v-model="edtiTasksData.prjTaskName"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>

<!--                    <el-row v-if="input=='审批延期'" style="width: 100%;">-->
<!--                      <el-col :span="12">-->
<!--                        <el-form-item label="申请延期时间:" style="width: 100%;">-->
<!--                          <span>{{edtiTasksData.delayDate}}</span>-->
<!--                        </el-form-item>-->
<!--                      </el-col>-->
<!--                      <el-col :span="12">-->
<!--&lt;!&ndash;                        <el-form-item label="申请延期理由:">&ndash;&gt;-->
<!--&lt;!&ndash;                          <span style="max-height: 120px;overflow-y: auto">{{edtiTasksData.reason}}</span>&ndash;&gt;-->
<!--&lt;!&ndash;                        </el-form-item>&ndash;&gt;-->
<!--                      </el-col>-->
<!--                    </el-row>-->
<!--                    <el-row v-if="input=='审批延期'" style="width: 100%;">-->
<!--            <el-col :span="12">-->
<!--              <el-form-item label="审批延期时间:" style="width: 100%;">-->
<!--                <el-date-picker-->
<!--                  v-model="endDate"-->
<!--                  type="date"-->
<!--                  style="width: 100%"-->
<!--                  value-format="yyyy-MM-dd"-->
<!--                  :placeholder="edtiTasksData.delayDate">-->
<!--                </el-date-picker>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="12">-->
<!--              <el-form-item label="选择执行人:" style="width: 100%;">-->
<!--                <el-select style="width: 100%" v-model="edtiTasksData.executor" placeholder="请选择执行人" filterable clearable>-->
<!--                  <el-option-->
<!--                    v-for="item in peopleList"-->
<!--                    :key="item.id"-->
<!--                    :label="item.fullname"-->
<!--                    :value="item.id">-->
<!--                  </el-option>-->
<!--                </el-select>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--                    <el-row v-if="input=='申请延期'" style="width: 100%;">-->
<!--&lt;!&ndash;            <el-col :span="12">&ndash;&gt;-->
<!--&lt;!&ndash;              <el-form-item label="延期原因:" style="width: 100%;">&ndash;&gt;-->
<!--&lt;!&ndash;                <el-input type="textarea" placeholder="请输入备注" v-model="delayRemark" clearable :autosize="{ minRows: 1, maxRows: 4}"></el-input>&ndash;&gt;-->
<!--&lt;!&ndash;              </el-form-item>&ndash;&gt;-->
<!--&lt;!&ndash;            </el-col>&ndash;&gt;-->
<!--            <el-col :span="24">-->
<!--              <el-form-item label="延期时间:" style="width: 100%;">-->
<!--                <el-date-picker-->
<!--                  v-model="delayDate"-->
<!--                  type="date"-->
<!--                  value-format="yyyy-MM-dd"-->
<!--                  placeholder="选择日期">-->
<!--                </el-date-picker>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--          </el-row>-->
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
                            <i v-if="input != '查看'" class="el-icon-delete" style="font-size: 16px;cursor: pointer;margin-right: 5px" @click="unbindTaskFile(item)"></i>
                            <i v-if="input != '查看'" class="el-icon-edit" style="margin-right: 10px;font-size: 16px;cursor: pointer" @click="doEditInOffice(item)"></i>
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
                    <remarksCom ref="remarksCom" :ifRemind="edtiTasksData.ifRemind" v-if="edtiTasksData.prjTaskId&&shenView" :prjTaskId="edtiTasksData.prjTaskId" ></remarksCom>
                  </el-tab-pane>
                  <el-tab-pane label="改动记录">
                    <ChangeRecord ref="ChangeRecord" :taskHistoryList="edtiTasksData.taskHistoryList"></ChangeRecord>
                  </el-tab-pane>
                  <addMemo ref="addMemo" :taskData="edtiTasksData"  @update="update"></addMemo>
                </el-tabs>
              </div>
<!--              <div class="model_wrap" v-if="input == '提交'">-->
<!--                <div class="divider"><span>执行人备注</span></div>-->
<!--                <div>-->
<!--                  <el-input-->
<!--                    type="textarea"-->
<!--                    :autosize="{ minRows: 4, maxRows: 4}"-->
<!--                    placeholder="请输入备注"-->
<!--                    v-model="edtiTasksData.remark">-->
<!--                  </el-input>-->
<!--                </div>-->
<!--              </div>-->
<!--              <div class="model_wrap" v-if="input == '审批人备注'">-->
<!--                <div class="divider"><span>审批人备注</span></div>-->
<!--                <div>-->
<!--                  <el-input-->
<!--                    type="textarea"-->
<!--                    :autosize="{ minRows: 4, maxRows: 4}"-->
<!--                    placeholder="请输入备注"-->
<!--                    v-model="edtiTasksData.remark">-->
<!--                  </el-input>-->
<!--                </div>-->
<!--              </div>-->
<!--              <div class="model_wrap" v-if="input == '审核'">-->
<!--                <div class="divider"><span>审核人备注</span></div>-->
<!--                <div>-->
<!--                  <el-input-->
<!--                    type="textarea"-->
<!--                    :autosize="{ minRows: 4, maxRows: 4}"-->
<!--                    placeholder="请输入备注"-->
<!--                    v-model="edtiTasksData.remark">-->
<!--                  </el-input>-->
<!--                </div>-->
<!--              </div>-->
<!--              <div class="model_wrap">-->
<!--                <div class="divider"><span>历史备注</span></div>-->
<!--                <div>-->
<!--                  <span v-if="showBeizhu" @click="showBeizhu = !showBeizhu" style="cursor: pointer;color: #52A0F5;">收起</span>-->
<!--                <span v-else @click="showBeizhu = !showBeizhu" style="cursor: pointer;color: #52A0F5;">展开</span>-->
<!--                <div style="max-width: 100%;overflow-x: auto">-->
<!--                  <el-table-->
<!--                    v-if="showBeizhu"-->
<!--                    :data="edtiTasksData.taskRecordList"-->
<!--                    border-->
<!--                    max-height="120"-->
<!--                    style="width: 90%">-->
<!--                    <el-table-column-->
<!--                      prop="operatorName"-->
<!--                      label="备注人"-->
<!--                     >-->
<!--                    </el-table-column>-->
<!--                    <el-table-column-->
<!--                      label="备注日期"-->
<!--                      >-->
<!--                      <template slot-scope="scope">-->
<!--                        <el-popover-->
<!--                          trigger="hover"-->
<!--                          placement="top"-->
<!--                        >-->
<!--                          <div style="max-width: 400px">{{scope.row.createDate}}</div>-->
<!--                          <div slot="reference" class="name-wrapper">-->
<!--                            <span>{{scope.row.createDate}}</span>-->
<!--                          </div>-->
<!--                        </el-popover>-->
<!--                      </template>-->
<!--                    </el-table-column>-->
<!--                    <el-table-column-->
<!--                      label="备注内容">-->
<!--                      <template slot-scope="scope">-->
<!--                        <el-popover-->
<!--                          trigger="hover"-->
<!--                          placement="top"-->
<!--                        >-->
<!--                          <div style="max-width: 400px">{{scope.row.remark}}</div>-->
<!--                          <div slot="reference" class="name-wrapper">-->
<!--                            <span>{{scope.row.remark}}</span>-->
<!--                          </div>-->
<!--                        </el-popover>-->
<!--                      </template>-->
<!--                    </el-table-column>-->
<!--                    <el-table-column-->
<!--                      prop="optName"-->
<!--                      label="备注类型">-->
<!--                    </el-table-column>-->
<!--                  </el-table>-->
<!--                </div>-->
<!--                </div>-->
<!--              </div>-->

<!--              <div class="model_wrap">-->
<!--                <div class="divider"><span>附件</span></div>-->
<!--                <div class="" style="width: 100%;">-->
<!--                  <div style="text-align: center">-->
<!--&lt;!&ndash;                    <span style="font-size: 12px">将文件拖放到此处以添加附件，或者<span style="color: #409EFF;cursor: pointer;" @click="clickUpload=true">浏览</span></span>&ndash;&gt;-->
<!--                  </div>-->
<!--                  <el-row>-->
<!--                    <el-col :span="24">-->
<!--                      <el-upload-->
<!--                        ref="upload"-->
<!--                        class="upload-demo"-->
<!--                        multiple-->
<!--                        drag-->
<!--                        name="attachFile"-->
<!--                        :action="creatematerial"-->
<!--                        :data="uploadLocalData"-->
<!--                        :before-upload="beforeUpload"-->
<!--                        :on-success="successCallback"-->
<!--                        :show-file-list="false"-->
<!--                      >-->
<!--                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>-->
<!--                        <div class="fileWarp" style="height: 100%;width: 100%;" v-if="edtiTasksData.fileList&&edtiTasksData.fileList.length">-->
<!--                          <div class="file_item" v-for="item in edtiTasksData.fileList">-->
<!--                            <div>-->
<!--                              <svg-icon  class="svg-icon" :icon-class="$commonUtils.getSuffixFile(item.address)"/>-->
<!--                            </div>-->
<!--                            <p class="fileName"><a :href="`ipdoc${item.address}`" target="_blank">{{item.name}}</a></p>-->
<!--                            <p class="file_detail"><span>{{item.createDate}}</span><span class="creater">{{item.creater}}</span></p>-->
<!--                          </div>-->
<!--                        </div>-->
<!--                      </el-upload>-->
<!--                    </el-col>-->
<!--                  </el-row>-->

<!--                </div>-->
<!--              </div>-->
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
<!--                    <virtual-select clearable disabled :data="$store.getters.userList" v-model="edtiTasksData.executor"  filterable :render="(data)=>$commonUtils.UserRender(data)" />-->
<!--                    {{edtiTasksData.executorName}}-->
                  </el-form-item>
                  <el-form-item label="全部任务执行人:">
                    {{edtiTasksData.executorNames}}
                  </el-form-item>
                  <el-form-item label="关注人:">
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
                      <el-badge slot="reference" :value="edtiTasksData.watchList&&edtiTasksData.watchList.length" class="item" type="primary">
                      </el-badge>
                    </el-popover>

                    <span class="watch" @click="modifyTaskWatch(false)" v-if="edtiTasksData.watchList&&edtiTasksData.watchList.find(item=>item.userId==$store.getters.userId)">
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

                <el-form label-position="left" label-width="100px" :model="edtiTasksData" :rules="EditTaskRules">
                  <el-form-item label="创建:">
<!--                    <el-date-picker-->
<!--                      v-model="edtiTasksData.createDate"-->
<!--                      type="date"-->
<!--                      placeholder="选择日期"-->
<!--                      value-format="yyyy-MM-dd">-->
<!--                    </el-date-picker>-->
                    <span>{{edtiTasksData.createDate}}</span>
                  </el-form-item>
                  <el-form-item label="更新:" prop="">
<!--                    <el-date-picker-->
<!--                      :clearable="false"-->
<!--                      :disabled="$store.getters.userId != edtiTasksData.creator"-->
<!--                      v-model="edtiTasksData.startDate"-->
<!--                      type="date"-->
<!--                      placeholder="选择日期"-->
<!--                      value-format="yyyy-MM-dd"-->
<!--                      :picker-options="expireTimeOption_(edtiTasksData.endDate)">-->
<!--                    </el-date-picker>-->
                    <span>{{edtiTasksData.modifyDate}}</span>
                  </el-form-item>
                  <el-form-item label="开始:" prop="">
<!--                    <el-date-picker-->
<!--                      v-if="isCreator"-->
<!--                      :clearable="false"-->
<!--                      v-model="edtiTasksData.startDate"-->
<!--                      type="date"-->
<!--                      placeholder="选择日期"-->
<!--                      value-format="yyyy-MM-dd"-->
<!--                      :picker-options="expireTimeOption_(edtiTasksData.endDate)">-->
<!--                    </el-date-picker>-->
                    <span>{{edtiTasksData.startDate}}</span>
                  </el-form-item>
                  <el-form-item label="截止:" prop="">
<!--                    <el-date-picker-->
<!--                      :clearable="false"-->
<!--                      v-if="isCreator"-->
<!--                      v-model="edtiTasksData.endDate"-->
<!--                      type="date"-->
<!--                      placeholder="选择日期"-->
<!--                      value-format="yyyy-MM-dd"-->
<!--                      :picker-options="_expireTimeOption(edtiTasksData.startDate)">-->
<!--                    </el-date-picker>-->
                    <span>{{edtiTasksData.endDate}}</span>
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
        <div class="progressWrap" v-if="percentage">
          <el-progress type="circle" :percentage="percentage"></el-progress>
        </div>
          </div>
<!--        <el-form class="edit-task-dialog" label-width="120px" :model="edtiTasksData" :rules="EditTaskRules">-->
<!--          <el-row>-->
<!--            <el-col :span="12">-->
<!--              <el-form-item  label="任务名称:" prop="prjTaskName">-->
<!--                <div style="max-height: 120px;overflow-y: auto">{{edtiTasksData.prjTaskName||edtiTasksData.taskName}}</div>-->
<!--&lt;!&ndash;                <el-input type="textarea" :rows="1" v-model="edtiTasksData.prjTaskName"></el-input>&ndash;&gt;-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="12">-->
<!--              <el-form-item label="任务描述:">-->
<!--                <p style="max-height: 120px;overflow-y: auto" v-html="edtiTasksData.prjTaskDesc"></p>-->
<!--&lt;!&ndash;                <el-input type="textarea" :rows="1" v-model="edtiTasksData.prjTaskDesc"></el-input>&ndash;&gt;-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--          <el-row>-->
<!--            <el-col :span="12">-->
<!--              <el-form-item label="文件:" v-model="edtiTasksData.fileList">-->
<!--              <div style="display: flex;justify-content: left;min-height: 40px">-->
<!--                <div class="left-fileList" style="flex: 4">-->
<!--                  <div style="max-height: 120px;overflow-y: auto">-->
<!--                    <div v-for="(item, index) in edtiTasksData.fileList" :key="index">-->
<!--                      <div-->
<!--                        :class="{'filehover': fileHover == index}"-->
<!--                        @mouseover="fileHover = index" @mouseout="fileHover = 10000"-->
<!--                        style="display: flex;justify-content: space-between;align-items: center"-->
<!--                      >-->
<!--                        <span class="fileName-hidden1" style="color: #409EFF;width: 70%;">{{item.materialName}}</span>-->
<!--                        <div class="" v-show="fileHover == index">-->
<!--                          <i class="el-icon-view" style="color: #727477;cursor: pointer;margin-right: 5px;" @click="preView(item)"></i>-->
<!--                          <i v-if="input != '查看'" class="el-icon-delete" style="font-size: 18px;cursor: pointer;margin-right: 5px" @click="unbindTaskFile(item)"></i>-->
<!--                          <i v-if="input != '查看'" class="el-icon-edit" style="margin-right: 10px;font-size: 18px;cursor: pointer" @click="doEditInOffice(item)"></i>-->
<!--                        </div>-->
<!--                      </div>-->

<!--                    </div>-->
<!--                  </div>-->
<!--                </div>-->
<!--                <div v-if="input != '查看'" style="flex: 1;position: relative;">-->
<!--                  <el-button style="position: absolute;bottom: 0;right: 0;" type="primary" size="mini" @click.native="fileType">-->
<!--                      上传文件-->
<!--                    </el-button>-->
<!--                </div>-->
<!--              </div>-->
<!--            </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="12">-->
<!--               <el-form-item label="任务检查项:">-->
<!--                 <div style="max-height: 120px;overflow-y: auto">-->
<!--                   <div v-for="(item, index) in edtiTasksData.itemList" :key="index">{{item}}</div>-->
<!--                 </div>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--          </el-row>-->

<!--          <el-row>-->
<!--            <el-col :span="12">-->
<!--              <el-form-item label="截止日期:" prop="endDate">-->
<!--                <div>{{edtiTasksData.endDate}}</div>-->
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
<!--            <el-col :span="12">-->
<!--              <el-form-item label="任务分配人:">-->
<!--                {{edtiTasksData.assigneeName?edtiTasksData.assigneeName:'无'  }}-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="12">-->
<!--              <el-form-item label="任务状态:">-->
<!--                {{edtiTasksData.taskStatus}}-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--          <el-row>-->
<!--            <el-col v-if="input == '提交'" :span="12">-->
<!--              <el-form-item label="执行人备注:" label-width="120px">-->
<!--                <el-input  v-if="input == '提交'" type="textarea" placeholder="请输入备注" v-model="edtiTasksData.remark" clearable :autosize="{ minRows: 1, maxRows: 4}"></el-input>-->
<!--                <span v-else>{{edtiTasksData.remark}}</span>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col v-if="input == '审批人备注'" :span="12">-->
<!--              <el-form-item label="审批人备注:" label-width="120px">-->
<!--                <el-input  v-if="input == '审批延期'" type="textarea" placeholder="请输入备注" v-model="edtiTasksData.remark" clearable :autosize="{ minRows: 1, maxRows: 4}"></el-input>-->
<!--                <span v-else>{{edtiTasksData.remark}}</span>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col v-if="input == '审核'" :span="12">-->
<!--              <el-form-item label="审核人备注:" label-width="120px">-->
<!--                <el-input v-if="input == '审核'" type="textarea" placeholder="请输入备注" v-model="edtiTasksData.remark" clearable :autosize="{ minRows: 1, maxRows: 4}"></el-input>-->
<!--                <span v-else>{{edtiTasksData.remark}}</span>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col v-if="input == '申请延期'" :span="12"></el-col>-->
<!--            <el-col v-if="input == '查看'" :span="12"></el-col>-->
<!--            <el-col :span="12">-->
<!--              <el-form-item label="历史备注:">-->
<!--                <span v-if="showBeizhu" @click="showBeizhu = !showBeizhu" style="cursor: pointer;color: #52A0F5;">收起</span>-->
<!--                <span v-else @click="showBeizhu = !showBeizhu" style="cursor: pointer;color: #52A0F5;">展开</span>-->
<!--                <div style="max-width: 100%;overflow-x: auto">-->
<!--                  <el-table-->
<!--                    v-if="showBeizhu"-->
<!--                    :data="edtiTasksData.taskRecordList"-->
<!--                    border-->
<!--                    max-height="120"-->
<!--                    style="width: 90%">-->
<!--                    <el-table-column-->
<!--                      prop="operatorName"-->
<!--                      label="备注人"-->
<!--                     >-->
<!--                    </el-table-column>-->
<!--                    <el-table-column-->
<!--                      label="备注日期"-->
<!--                      >-->
<!--                      <template slot-scope="scope">-->
<!--                        <el-popover-->
<!--                          trigger="hover"-->
<!--                          placement="top"-->
<!--                        >-->
<!--                          <div style="max-width: 400px">{{scope.row.createDate}}</div>-->
<!--                          <div slot="reference" class="name-wrapper">-->
<!--                            <span>{{scope.row.createDate}}</span>-->
<!--                          </div>-->
<!--                        </el-popover>-->
<!--                      </template>-->
<!--                    </el-table-column>-->
<!--                    <el-table-column-->
<!--                      label="备注内容">-->
<!--                      <template slot-scope="scope">-->
<!--                        <el-popover-->
<!--                          trigger="hover"-->
<!--                          placement="top"-->
<!--                        >-->
<!--                          <div style="max-width: 400px">{{scope.row.remark}}</div>-->
<!--                          <div slot="reference" class="name-wrapper">-->
<!--                            <span>{{scope.row.remark}}</span>-->
<!--                          </div>-->
<!--                        </el-popover>-->
<!--                      </template>-->
<!--                    </el-table-column>-->
<!--                    <el-table-column-->
<!--                      prop="optName"-->
<!--                      label="备注类型">-->
<!--                    </el-table-column>-->
<!--                  </el-table>-->
<!--                </div>-->

<!--              </el-form-item>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--          <el-row v-if="input=='审批延期'">-->
<!--            <el-col :span="12">-->
<!--              <el-form-item label="申请延期时间:">-->
<!--                <span>{{edtiTasksData.delayDate}}</span>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="12">-->
<!--              <el-form-item label="申请延期理由:">-->
<!--                <span style="max-height: 120px;overflow-y: auto">{{edtiTasksData.reason}}</span>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--          <el-row v-if="input=='审批延期'">-->
<!--            <el-col :span="12">-->
<!--              <el-form-item label="审批延期时间:">-->
<!--                <el-date-picker-->
<!--                  v-model="endDate"-->
<!--                  type="date"-->
<!--                  value-format="yyyy-MM-dd"-->
<!--                  :placeholder="edtiTasksData.delayDate">-->
<!--                </el-date-picker>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="12">-->
<!--              <el-form-item label="选择执行人:">-->
<!--                <el-select v-model="edtiTasksData.appUserId" placeholder="请选择执行人" filterable clearable>-->
<!--                  <el-option-->
<!--                    v-for="item in peopleList"-->
<!--                    :key="item.id"-->
<!--                    :label="item.fullname"-->
<!--                    :value="item.id">-->
<!--                  </el-option>-->
<!--                </el-select>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--          <el-row v-if="input=='申请延期'">-->
<!--            <el-col :span="12">-->
<!--              <el-form-item label="延期原因:">-->
<!--                <el-input type="textarea" placeholder="请输入备注" v-model="delayRemark" clearable :autosize="{ minRows: 1, maxRows: 4}"></el-input>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="12">-->
<!--              <el-form-item label="延期时间:">-->
<!--                <el-date-picker-->
<!--                  v-model="delayDate"-->
<!--                  type="date"-->
<!--                  value-format="yyyy-MM-dd"-->
<!--                  placeholder="选择日期">-->
<!--                </el-date-picker>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--        </el-form>-->




        <span v-if="input=='审核'" slot="footer" class="dialog-footer" style="display: flex;justify-content: center">
          <el-button @click="closeDialog" size="mini" style="margin-right: 30px">取 消</el-button>
          <el-dropdown v-if="edtiTasksData.nextOperation==3" @command="(e)=>auditTask(edtiTasksData, e)" trigger="click">
            <el-button type="primary" size="mini">
              审核<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="1">通过</el-dropdown-item>
              <el-dropdown-item command="2">不通过</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>

        <span v-if="input=='审批延期'" slot="footer" class="dialog-footer" style="display: flex;justify-content: center">
          <el-button @click="closeDialog" size="mini" style="margin-right: 30px">取 消</el-button>
          <el-dropdown @command="(e)=>shenpiTask(edtiTasksData, e)" trigger="click">
            <el-button type="primary" size="mini">
              审批<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="1">通过</el-dropdown-item>
              <el-dropdown-item command="2">不通过</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
        <span v-if="input=='申请延期'" slot="footer" class="dialog-footer" style="display: flex;justify-content: center">
          <el-button @click="closeDialog" size="mini" style="margin-right: 30px">取 消</el-button>
          <el-button size="small" type="primary" @click.native="delayShenqing">提交申请</el-button>
        </span>
        <span v-if="input=='提交'" slot="footer" class="dialog-footer" style="display: flex;justify-content: center">
          <el-button @click="closeDialog" size="small" style="margin-right: 30px">取 消</el-button>
          <el-dropdown @command="(e)=>submitTasks(edtiTasksData, e)" trigger="click">
            <el-button type="primary" size="mini">
              提交<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="1">提交</el-dropdown-item>
              <el-dropdown-item command="2">提交并创建新任务</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
<!--        <span  slot="footer" class="dialog-footer" style="display: flex;justify-content: center">-->
<!--          <el-button @click="closeDialog" size="mini" style="margin-right: 0px">取 消</el-button>-->
<!--        </span>-->

      </el-dialog>
      </div>
      <!--提醒计划-->
        <taskPlanList :visible.sync="taskPlanState" :task-info="edtiTasksData"></taskPlanList>
<!--      上传-->
      <el-dialog
        title="上传文件"
        :visible.sync="rightView"
        width="30%"
        center
        top="0"
        height="500"
        v-dialogDrag
      >
        <div class="edit-file">
<!--                  <i class="el-icon-close" @click="clickClose"></i>-->
                  <el-tabs v-model="activeName" type="border-card" class="" @tab-click="handleClick">
                    <el-tab-pane label="本地文件" name="1">
<!--                      <div class="file-type" style="display: flex; justify-content: center;align-items: center">-->
<!--                        <div style="display: flex;justify-content: left;align-items: center">-->
<!--                          <span style="flex: 2;text-align: right">文件类型:</span>-->
<!--                          <el-select style="flex: 4" default-first-option v-model="fileDocId" placeholder="请选择" filterable clearable @change="handleChangeDoc">-->
<!--                            <el-option v-for="item in docTypeList" :key="item.doctId" :label="item.typeName" :value="item.doctId">-->
<!--                            </el-option>-->
<!--                          </el-select>-->
<!--                          <el-select style="flex: 4;padding-right: 10px" default-first-option v-model="materialTypeId" placeholder="请选择" filterable clearable>-->
<!--                            <el-option v-for="item in typeNameList" :key="item.materialTypeId" :label="item.typeName" :value="item.materialTypeId">-->
<!--                            </el-option>-->
<!--                          </el-select>-->
<!--                        </div>-->

<!--                    </div>-->
                    <div style="display: flex; justify-content: center">
                      <el-upload
                        ref="upload"
                        class="upload-demo"
                        multiple
                        drag
                        name="attachFile"
                        :action="creatematerial"
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
<!--                    <el-tab-pane label="模板文件" name="2">-->
<!--                      <el-card class="box-card box-card1">-->
<!--                        <div slot="header" class="">-->
<!--                          <div class="file-type" style="display: flex; justify-content: center;align-items: center">-->
<!--                            <div style="display: flex;justify-content: left;align-items: center">-->
<!--                              <span style="flex: 2;text-align: right">文件类型:</span>-->
<!--                              <el-select style="flex: 3.5" default-first-option v-model="fileDocId" placeholder="请选择" filterable clearable @change="handleChangeDoc">-->
<!--                                <el-option v-for="item in docTypeList" :key="item.doctId" :label="item.typeName" :value="item.doctId">-->
<!--                                </el-option>-->
<!--                              </el-select>-->
<!--                              <el-select style="flex: 3.5" default-first-option v-model="materialTypeId" placeholder="请选择" filterable clearable>-->
<!--                                <el-option v-for="item in typeNameList" :key="item.materialTypeId" :label="item.typeName" :value="item.materialTypeId">-->
<!--                                </el-option>-->
<!--                              </el-select>-->
<!--                              <el-button style="flex:1" type="text" @click="copyTemplFile">上传</el-button>-->
<!--                            </div>-->

<!--                          </div>-->

<!--                        </div>-->
<!--                        <div style="">-->
<!--                          <el-checkbox-group-->
<!--                            v-model="modelFileId"-->
<!--                            @change="onlyOneChoice"-->
<!--                            style="height: 95px;"-->
<!--                            >-->
<!--                            <el-checkbox v-for="(item, j) in edtiTasksData.modelFileList" :key="j"  style="width: 90%;" :label="item.tfileId">{{item.fileName}}</el-checkbox>-->
<!--                          </el-checkbox-group>-->
<!--                        </div>-->

<!--                      </el-card>-->
<!--&lt;!&ndash;                      {{edtiTasksData.modelFileList}}&ndash;&gt;-->
<!--                    </el-tab-pane>-->
                  </el-tabs>
                </div>
      </el-dialog>
    </div>
</template>

<script>
  import taskPlanList from "@/views/workbench/project_management/components/taskPlanList";
  import addMemo from "@/views/workbench/project_management/components/addMemo";
  import remarksCom from "@/views/workbench/project_management/components/remarksCom";
  import ChangeRecord from "@/views/workbench/project_management/components/ChangeRecord";
  import { queryTaskList } from '@/api/templateManagement'
  import uploadFile from '@/views/workbench/material_management/components/uploadFile'
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
    unbindTaskFile,
    bindTaskFile,
    creatematerial,
    addTaskWach,
    deleteTaskWach,
    queryTaskWatch,
    recordOnlienEdit
  } from '@/api/caseList'
  // import { creatematerial } from '@/api/ipServiceApi.config.js'
  import { doEditInOffice, getProgID } from '@/utils/editInOffice.js'
  export default {
    name: "taskDialog",
    components:{
      uploadFile,
      addMemo,
      remarksCom,
      ChangeRecord,
      taskPlanList
    },
    computed:{
      isCreator(){
        return this.edtiTasksData.creator == this.$store.getters.userId
      }
    },
    props: {
      workSign:false,
      projectSign:false,
      title: '',
      shenheView: false,
      caseData: '',
      peopleList: {
        type: Array,
        default () {
            return []
        }
      },
      doData: {
        type: Object,
        default () {
            return {}
        }
      },
    },
    watch: {
      caseData: {
        handler(n,o){
          this.caseId = n
          this.nocaseId = n
          // console.log(n,111111111)
        },
        immediate: true
      },
      shenheView(n,o){
        this.shenView = n
      },
      // caseData(n,o) {
      //   this.caseId = n
      // },
      doData(n,o) {
        this.edtiTasksData = JSON.parse(JSON.stringify(n))
        this.edtiTasksData.prjTaskId&&this.shenView&&this.queryTaskWatch(this.edtiTasksData.prjTaskId)
        if(this.edtiTasksData.delayFlag&&this.edtiTasksData.delayFlag == 2){
          this.handleList = [
          // {'name':'分配','nextOperation':'12','ban':1},
          // {'name':'提交','nextOperation': '2','ban':1},
          // {'name':'审核','nextOperation':'3','ban':1},
          // {'name':'申请延期','delayFlag': '1','ban':1},
          {'name':'审批延期','delayFlag': '2'},
          {'name':'修改','per':this.$store.getters.userId},
          // {'name':'删除','per':this.$store.getters.userId}
          ]
        }
        // this.caseId = this.edtiTasksData.caseId
        this.teptId = this.edtiTasksData.teptId
        this.shenheTaskId = this.edtiTasksData.prjTaskId
        this.endDate = this.edtiTasksData.delayDate
      },
      title: {
        handler(n,o){
          this.dialogName = n
          this.input = n
          // if(n=='审核'){
          //   this.input = '审核'
          // }
          // if(n=='提交'){
          //   this.input = '提交'
          // }
          // if(n=='审批延期'){
          //   this.input = '审批延期'
          // }
          // if(n=='申请延期'){
          //   this.input = '申请延期'
          // }
          // if(n=='查看'){
          //   this.input = '查看'
          // }
        },
        immediate:true

      }
    },
    created() {
      // this.shenView = this.shenheView
    },
    data(){
      return {
        watchId:'',
        taskPlanState:false,
        handleList: [
          {'name':'分配','nextOperation':'12'},
          {'name':'提交','nextOperation': '2'},
          {'name':'审核','nextOperation':'3'},
          {'name':'申请延期','delayFlag': '1'},
          {'name':'审批延期','delayFlag': '2'},
          {'name':'修改','per':this.$store.getters.userId},
          // {'name':'删除','per':this.$store.getters.userId}
        ],
        clickUpload:false,
        hoverState: false,
        curFile:[],
        nocaseId: '',
        showBeizhu: false,
        delayDate: '',
        delayRemark: '',
        executor: '',
        endDate: '',
        input: '',
        shenheTaskId: '',
        fileHover: 100000,
        caseId: '',
        teptId: '',
        shenView: false,
        dialogName: '',
        modelFileId: [],
        uploadLocalData: {
          tokenID: this.$store.getters.token
        },
        EditTaskRules: {
          prjTaskName: [{ required: true, message: '请输入任务名称', trigger: 'change' }],
          endDate: [{ required: true, message: '请选择截止日期', trigger: 'change' },]
        },
        creatematerial,
        creatematerialUrl: '',
        typeNameList: [],
        materialTypeId: '',
        docTypeList: [],
        fileDocId: '',
        rightView: false,
        activeName: '1',
        edtiTasksData: {
          watchList:[],
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
          taskStatus: '',
        },
        materialIdList: [],
        percentage:0
      }
    },
    methods: {
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
      handleCommand(command){
        if(command=='关注'){
          if(this.edtiTasksData.watchList&&this.edtiTasksData.watchList.find(item=>item.userId==this.$store.getters.userId)){
            this.modifyTaskWatch(false)
          }else {
            this.modifyTaskWatch(true)
          }
        }
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
          // this.taskData.watchList=res.data
        })
      },
      takeMemo(){
        this.$refs.addMemo.takeMemo()
      },
      update(){
        this.$refs.remarksCom.queryTaskMemo()
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
            this.updateData(this.caseId)
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
      unbindTaskFile(data) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          unbindTaskFile({materialId: data.materialId,prjTaskId: this.shenheTaskId}).then(()=>{
            this.$message.success('删除成功！')
            this.updateData(this.caseId)
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
        url = url.replace(/&/g, '%26')
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
      submitTasks(data,e){
        data.caseId = this.caseId
        this.$emit('submitTask', [data,e,this.nocaseId])
        // this.closeDialog('sub')
      },
      CompareDate(d1,d2){
        return ((new Date(d1.replace(/-/g,"\/"))) > (new Date(d2.replace(/-/g,"\/"))));
      },
      delayShenqing() {
        if(!this.delayDate){
          this.$message.error('请选择延期时间！')
          return
        }
        if(this.CompareDate(this.edtiTasksData.endDate,this.delayDate)){
          this.$message.error('延期时间应该大于截止日期！')
          return;
        }
        delayTask({prjTaskId: this.shenheTaskId, endDate: this.delayDate}).then(()=>{
          this.$message.success('申请延期已提交！')
          this.$emit('shenqingOk')
          this.closeDialog()
          // this.delayView = false
        })
      },
      shenpiTask(data,e) {
        // console.log(data)
        // return
        if(this.CompareDate(this.edtiTasksData.endDate,this.endDate)){
          this.$message.error('延期时间应该大于截止日期！')
          return;
        }
        shenpiTask({prjTaskId: this.shenheTaskId, result: e, executor: this.edtiTasksData.executor,endDate: this.endDate}).then(()=>{
          this.$message.success('审批成功!')
          this.$emit('shenpiOk')
          this.closeDialog()
          // this.handleDelayView = false
        })
      },
      closeDialog(a){
        // if(a!='sub'){
        //   this.edtiTasksData = {}
        // }
        this.edtiTasksData = {}
          this.delayDate = ''
          this.delayRemark = ''
          this.executor = ''
          this.endDate = ''
          // this.nocaseId = ''
          this.$emit('closeDialog')

      },
      deepFlatten(arr) {
        let flatten = (arr)=> [].concat(...arr);
        return flatten(arr.map(x=>Array.isArray(x)? this.deepFlatten(x): x));
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
        let id = this.shenheTaskId
        copyTemplFile({
          tfileId: this.modelFileId[0],
          caseId: this.caseId,
          materialTypeId: this.materialTypeId,
          doctId: this.fileDocId,
          prjTaskId: id
        }).then(()=>{
          // this.queryProjectTask('add')
          this.$message.success('绑定文件成功！')
          this.updateData(this.caseId)
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
          this.uploadLocalData.prjTaskId = this.shenheTaskId
        this.creatematerialUrl = this.creatematerial
        // this.uploadLocalData.materialTypeId = this.materialTypeId
        //
        // if(this.fileDocId&&this.materialTypeId||this.fileDocId&&!this.typeNameList.length&&!this.materialTypeId){
        //   this.creatematerialUrl = this.creatematerial
        //   let promise = new Promise((resolve) => {
        //   this.$nextTick(function () {
        //     resolve(true);
        //   });
        // });
        // return promise;
        // }else{
        //    let promise = new Promise((resolve,reject) => {
        //       this.$nextTick(function () {
        //         reject(false);
        //       });
        //     });
        //    this.$message.error('请填写文件类型！')
        //     return promise;
        //
        // }
      },
      successCallback(res, file, fileList) {
        if(res.success){
          const materialId = res.data[0].materialId
          bindTaskFile({materialId,prjTaskId: this.shenheTaskId})
          this.$message.success('文件上传成功!')
           this.$refs.upload.clearFiles();
          this.updateData(this.caseId)
          this.rightView = false
          this.fileDocId = ''
          this.materialTypeId = ''
          this.bindTaskId = ''
        }else{
          this.$message.error('文件上传失败!')
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
      handleClick(f) {
        if(f==2){
        }
      },
      fileType(type) {
        this.activeName = '1'
        this.rightView = true
        // this.copyTemplFileView = true
        this.querytepTaskFile(this.edtiTasksData)
        // this.queryMaterialDocType()
      },
      queryMaterialDocType() {
        queryMaterialDocType().then(res=>{
          this.docTypeList = res.data
        })
      },
      updateData(a){
        if(a){
          queryProjectTask({caseId:a}).then(res=>{
            this.taskgroupList = res.data.filter(item=>!!item)
            let agList = this.taskgroupList.map(i=>{
              if(i.teptId){
                if(i.taskList){
                  // i.taskList.forEach(j=>{
                  //   j.teptId = i.teptId
                  // })
                  return  i.taskList
                }else{
                  return i
                }
              }else{
                return i
              }
            })
            if(this.deepFlatten(agList).find(i=>i.prjTaskId == this.shenheTaskId )){
              this.edtiTasksData = this.deepFlatten(agList).find(i=>i.prjTaskId == this.shenheTaskId )
            }else{
              this.deepFlatten(agList).forEach(item=>{
                if(item.taskList&&item.taskList.find(i=>i.prjTaskId == this.shenheTaskId)){
                  this.edtiTasksData = item.taskList.find(i=>i.prjTaskId == this.shenheTaskId)
                }
              })
            }

            let arr = []
          if(this.edtiTasksData.itemList&&this.edtiTasksData.itemList.length>0){
            this.edtiTasksData.itemList.forEach((i, index)=>{
              arr.push(i.prjIemName)
            })
            this.edtiTasksData.itemList = arr
          }

            // let arr = this.deepFlatten(agList)
          })
        }else{
          queryProjectTask({prjTaskId: this.shenheTaskId}).then(res=>{
              this.edtiTasksData = res.data[0].taskList[0]
              let arr = []
              if(this.edtiTasksData.itemList&&this.edtiTasksData.itemList.length>0){
                this.edtiTasksData.itemList.forEach((i, index)=>{
                  arr.push(i.prjIemName)
                })
                this.edtiTasksData.itemList = arr
              }
            })
        }


        // if(a == 'delete' || a == 'add'){
        //     if(!this.copyTemplFileView){
        //       this.edtiTasksData.fileList = this.deepFlatten(this.agList).find(item=>item.prjTaskId == this.prjTaskId).fileList
        //     }
        //   }
      },
      // auditTaskTwo(data){
      //   console.log('11222+++++++++++++++')
      //   console.log(data)
      //   console.log('+++++++++++++++')
      //   this.shenView = true
      //   this.dialogName = '审核'
      //   // this.modelTeptId = data.teptId
      //   this.modelFileListView = false
      //   this.shenheTaskId = data.taskId
      //   this.queryMaterialDocType()
      //   this.doCaseId = data.caseId
      //   this.updateData(this.doCaseId)
      //   console.log('+++++++111++++++++')
      //   console.log(this.edtiTasksData)
      //   console.log('+++++++++++++++')
      // },
      //模板任务的文件
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
      auditTask(item, e) {

        item.caseId = this.caseId
        item.taskId = item.prjTaskId
        this.$emit('shenhe', [item,e])
        this.closeDialog()
      },
    }
  }
</script>

<style lang="scss" scoped>
  .fileName-hidden{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
  .filehover {
    background-color: #f7f7f7;
  }
  /*.file-type {*/
  /*  .about-task{*/
  /*    >>>.el-input__inner{*/
  /*      height: 30px;*/
  /*      !*background-color: red;*!*/
  /*      !*width: 285px;*!*/
  /*      line-height: 30px;*/
  /*    }*/
  /*  }*/
  /*  .task{*/
  /*    >>>.el-input__inner{*/
  /*      height: 30px;*/
  /*      !*background-color: red;*!*/
  /*      !*width: 305px;*!*/
  /*      line-height: 30px;*/
  /*    }*/
  /*  }*/
  /*  >>>.el-input__inner{*/
  /*    height: 30px;*/
  /*    !*width: 150px;*!*/
  /*    line-height: 30px;*/
  /*  }*/
  /*  >>>.el-input__icon {*/
  /*    line-height: 30px;*/
  /*  }*/
  /*}*/

  .new-task-dialog,.edit-task-dialog {
    .el-row {
      display: flex;

      .el-col {
        /*height: 80vh;*/
        display: flex;
        border: 1px solid #ccc;
        border-bottom: none;

        .el-form-item {
          flex: 1;
          margin-bottom: 0;
          /*max-height: 120px;*/
          /*overflow-y: auto;*/
          display: flex;
          justify-content: left;
          /*align-items: center;*/
          > > > .el-form-item__label {
            background-color: #f7f7f7;
          }

          > > > .el-form-item__content {
            margin-left: 0 !important;
            width: 80%;
            overflow-x: auto;
          }
        }
      }

      .bott {
        border-bottom: 1px solid #ccc;
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
  .dialog{
    position: relative;
    .drag{
      position: absolute;
      top: 0;
      .drag-dialog{
        position: absolute;
        top: -200px!important;
      }
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
      }
    }


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
</style>


