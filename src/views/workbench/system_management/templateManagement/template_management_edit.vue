<template>
  <div class="template-edit" style="margin-left: 0px">
    <div class="template-header-title" style="margin-bottom: 20px">
      <h3>{{templateTitle}}</h3>
    </div>
    <el-row>
      <el-col :span="22">
        <div class="tabs">
          <div @click="clickIndex(1)" :class="{'clickName': isClick == 1}">概览</div>
          <div @click="clickIndex(2)" :class="{'clickName': isClick == 2}">任务</div>
          <div @click="clickIndex(3)" :class="{'clickName': isClick == 3}">文档</div>
          <div v-if="type==2" @click="clickIndex(4)" :class="{'clickName': isClick == 4}">成员</div>
          <div style="position: absolute;right: 0;top: 0;">
            <div style="float: right" v-if="isClick == 4">
              <el-button  type="primary" size="small" @click="addSharePeopleView = true">添加共享成员</el-button>
            </div>

            <el-dropdown v-if="isClick == 2" style="float: right" @command="handleCommand" trigger="click">
              <el-button type="primary" size="small">
                新建<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="createGroupView">阶段</el-dropdown-item>
                <el-dropdown-item command="createTaskView">任务</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-upload
              style="float: right"
              ref="upload"
              :data="importData"
              :action="importTemplateData"
              name="file"
              :auto-upload="true"
              :on-success="importTemplatesuccess"
              :show-file-list="false">
              <el-button slot="trigger" size="small" type="primary">导入模板</el-button>
            </el-upload>
          </div>
        </div>

      </el-col>
    </el-row>

    <!--  概览模块  -->
    <div class="template-create-generous-view" v-show="isClick==1">
      <el-row>
        <el-col :span="22">
          <el-tabs>
            <el-tab-pane label="概览"></el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
      <el-form class="form" ref="form" :model="templateData" label-width="80px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="模板类型:">
              <span v-if="type == 1">万慧达模板</span>
              <span v-if="type == 2">内部共享模板</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="模板名称:">
              <el-input v-model="templateData.teptName" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="案件类型:">
<!--              <el-cascader-->
<!--                ref="caseTypecascader"-->
<!--                v-model="caseTypeIdList"-->
<!--                filterable-->
<!--                :show-all-levels="false"-->
<!--                :options="caseTypeOptions"-->
<!--                :props="defaultParams"-->
<!--                placeholder="请选择"-->
<!--                clearable-->
<!--              />-->
              <el-select clearable filterable v-model="templateData.caseTypeId" placeholder="请选择案件类型" style="width: 100%">
                <el-option
                  v-for="item in typeLists"
                  :key="item.caseTypeId"
                  :label="item.caseType"
                  :value="item.caseTypeId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="审级:">
              <el-select clearable filterable v-model="templateData.judgeRank" placeholder="请选择审级" style="width: 100%">
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
      </el-form>
    </div>

    <!--  阶段模块  -->
    <div class="template-create-task-group" v-show="isClick==2">
      <el-row>
        <el-col :span="22" style="margin-bottom: 33px;position:relative;">
          <el-tabs>
            <el-tab-pane label="任务"></el-tab-pane>
          </el-tabs>
          <div style="position: absolute;right: 0;top: 10px;color: #409EFF;cursor:pointer;font-size: 14px;" @click="openOrClose">{{isOpen ? '全部收起' : '全部展开'}}</div>
        </el-col>
      </el-row>

      <!--  阶段列表    -->
      <div class="group-list" v-if="groupList.length>0" style="height: 550px;overflow-y: auto">
        <el-row>
          <el-col :span="21">
            <div class="template-collapse">
            <el-collapse v-model="activeNames" @change="closeTab">
              <el-collapse-item class="template-collapse-item" :name="index" v-for="(item, index) in groupList" >
                <span  slot="title" class="collapse-title">
                  <div>
                    <span>{{item.tgNo}}. {{item.tgName}}</span>
                    <span class="task-num">{{item.taskDefineList.length}}个任务</span>
                  </div>
                  <div style="margin-right: 20%">
                    <el-tooltip effect="light" content="修改阶段" placement="right"><i class="el-icon-edit" @click.stop="editGroupName(item,index)"></i></el-tooltip>
                    <el-tooltip effect="light" content="删除阶段" placement="right"><i class="el-icon-delete" @click.stop="delGroup(item)"></i></el-tooltip>
                  </div>
                </span>
                <div class="template-check-box">
                   <draggable class="wrapper" group="haha" @change="(e) =>{changeList(e, item.tgId, item.taskDefineList)}"  v-model="item.taskDefineList">
                      <transition-group>
<!--                        <div key="haha" v-if="!item.taskDefineList.length" >-->
<!--                          无任务-->
<!--&lt;!&ndash;                          <el-collapse>&ndash;&gt;-->
<!--&lt;!&ndash;                            <el-collapse-item class="template-collapse-item1">&ndash;&gt;-->
<!--&lt;!&ndash;                              <span  slot="title" class="collapse-title1">&ndash;&gt;-->
<!--&lt;!&ndash;                                <div class="" style="width: 100%;display: flex">&ndash;&gt;-->
<!--&lt;!&ndash;                                  <span class="" style="flex:1;cursor: pointer;">&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                                    hahah&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;                                  </span>&ndash;&gt;-->
<!--&lt;!&ndash;                                </div>&ndash;&gt;-->
<!--&lt;!&ndash;                              </span>&ndash;&gt;-->
<!--&lt;!&ndash;                            </el-collapse-item>&ndash;&gt;-->
<!--&lt;!&ndash;                          </el-collapse>&ndash;&gt;-->
<!--                        </div>-->
                        <div v-for="(task, i) in item.taskDefineList.length ? item.taskDefineList : [{taskName: '空', taskFileList: [], itemList: []}]" :key="i" class="">
                          <div v-if="rightView == ('rightView' + task.taskName)" class="right-fileList" :style="{marginTop: selected*49+'px'}">
                            <i class="el-icon-close" @click="rightViewClose"></i>
                            <el-tabs type="border-card" class="right-tab">
                              <el-tab-pane label="本地文件">
                                <div style="display: flex;justify-content: center;align-items: center;padding-top: 10px">
                                <el-upload
                                  class="upload-demo"
                                  name="attachFile"
                                  :data="localFileData"
                                  :action="createTmplateFile"
                                  :before-upload="beforeUpload1"
                                  :on-success="successCallback1"
                                  multiple
                                  drag
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
                                    <span style="color: #66B1FF;">模板文件</span>
                                    <el-tooltip  content="将勾选的文件与当前任务关联" placement="right" effect="light">
                                      <el-button style="float: right;padding: 5px" type="primary" size="mini" @click="bindTmplateFile">关联任务</el-button>
                                    </el-tooltip>
                                  </div>
                                  <div style="">
                                    <el-checkbox-group
                                      v-model="modelFile"
                                      @change="onlyOneChoice"
                                    >
                                      <el-checkbox v-for="(temFile, j) in modelData" :key="j"  style="width: 90%;" :label="temFile.tfileId">{{temFile.fileName}}</el-checkbox>
                                    </el-checkbox-group>
                                  </div>
                                 </el-card>
                              </el-tab-pane>
                            </el-tabs>
                          </div>
                          <el-collapse v-model="activeTaskNames" v-if="task.taskDefineId">
                            <el-collapse-item class="template-collapse-item1" :name="i">
                              <span  slot="title" class="collapse-title1">
                                <div class="" style="width: 100%;display: flex">
                                  <span class="" style="flex:1;cursor: pointer;height: 48px;overflow: hidden" @dblclick.stop="editTaskName(item, task.taskName,index,i,'look')">
                                    <span>{{task.taskNoString}}. {{task.taskName}}</span>
                                    <span class="task-num" style="margin-left: 10px">
                                      {{task.itemList&&task.itemList.length}}个检查项
<!--                                      <i class="el-icon-document" style="margin-left: 10px"></i>-->
                                    </span>
                                    <span class="task-num" style="margin-left: 10px">
                                      {{task.taskFileList&&task.taskFileList.length}}
                                      <i class="el-icon-document" style="margin-left: 5px"></i>
                                    </span>
                                  </span>
                                  <div style="" v-if="task.taskDefineId">
                                    <i class="el-icon-view" @click.stop="editTaskName(item, task.taskName, index, i, 'look')"></i>
                                    <i class="el-icon-edit" @click.stop="editTaskName(item, task.taskName,index,i)"></i>
                                    <i class="el-icon-delete" @click.stop="delTask(item,i)"></i>
                                    <i class="el-icon-paperclip" @click.stop="uploadTempFile(task,i)"></i>
                                  </div>

                                </div>
                              </span>
                              <div>
                                <div style="margin-left: 30px; width: 100%;">
                                  <draggable @change="(v) => {changeItem(v, true, task.itemList, task)}" :list="task.itemList">
                                    <div v-for="(item, index_) in task.itemList" :key="index_" style="width: 100%; padding-left: 10px;display: flex;justify-content: left" :class="{'filehover': fileHover == index_ + item.itemName}" @mouseover="fileHover = index_ + item.itemName" @mouseout="fileHover = ''">
                                    <div style="width:70%;cursor: pointer;line-height: 40px;">
                                      <span :title="task.taskNoString + '.' + (index_ + 1) + '. ' + item.itemName">{{task.taskNoString + '.' + (index_ + 1)}}. {{item.itemName}}</span>
                                    </div>
                                    <div class="check-item-icon" style=" width: 30%;display: flex;justify-content: left;align-items: center">
<!--                                      <i v-show="fileHover == index_" class="el-icon-view" @click="preView(item)"></i>-->
                                      <i v-show="fileHover == index_ + item.itemName" class="el-icon-edit" style="" @click="openEditDialog(item)"></i>
                                      <i v-show="fileHover == index_ + item.itemName" class="el-icon-delete" style="" @click="deleteTaskItem(item)"></i>
                                    </div>
                                  </div>
                                  </draggable>
                                </div>
<!--                                <div v-for="(file,index_) in task.taskFileList" :index="index_">-->
<!--                                  <span>{{file.fileName}}</span>-->
<!--                                </div>-->
                              </div>
                            </el-collapse-item>
                          </el-collapse>
                          <div v-else style="color: #ccc">空</div>
                        </div>
                      </transition-group>
                    </draggable>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
          </el-col>
        </el-row>
      </div>

      <!--  新建阶段弹框    -->
      <el-dialog
        title="新建阶段"
        :visible.sync="groupsView"
        width="50%"
        center
        top="0"
        append-to-body
        :modal="false"
        v-dialogDrag
      >
        <el-form :model="addGroups" label-width="100px">
          <el-form-item label="阶段名称:">
            <el-input style="width: 80%;" v-model="addGroups.tgName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="阶段序号:">
            <el-input style="width: 80%;" v-model="addGroups.tgNo" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer f-c">
          <el-button @click="groupsView = false">取 消</el-button>
          <el-button type="primary" @click="addNewGroup">确 定</el-button>
        </div>
      </el-dialog>


      <el-dialog title="修改阶段" :visible.sync="groupsEdit" width="30%">
        <el-form :model="editGroupData" label-width="100px">
          <el-form-item label="阶段名称" style="padding: 0 50px">
            <el-input v-model="editGroupData.tgName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="阶段序号" style="padding: 0 50px">
            <el-input v-model="editGroupData.tgNo" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer f-c" style="display: flex;justify-content: center">
          <el-button @click="groupsEdit = false">取 消</el-button>
          <el-button type="primary" @click="editGroup(editGroupData)">确 定</el-button>
        </div>
      </el-dialog>
      <!--   新建任务弹窗   -->
      <el-dialog
        title="新建任务"
        :visible.sync="taskView"
        width="50%"
        center
        top="0"
        append-to-body
        :modal="false"
        v-dialogDrag
      >
        <el-form :model="taskInfo" style="">
          <el-form-item label="任务名称:" style="" label-width="100px">
            <el-input v-model="taskInfo.taskName"></el-input>
          </el-form-item>
          <el-form-item label="任务描述:" style="" label-width="100px">
            <el-input type="textarea" :rows="5" v-model="taskInfo.taskDesc"></el-input>
          </el-form-item>
          <el-form-item label="阶段:" v-if="outCreate" label-width="100px">
            <el-select v-if="groupList.length>0" v-model="taskInfo.tgId" placeholder="请选择" style="width:50%">
              <el-option
                v-for="item in groupList"
                :key="item.tgId"
                :label="item.tgName"
                :value="item.tgId">
              </el-option>
            </el-select>
            <span v-else>还没有阶段，<i style="color: #409EFF;cursor: pointer;" @click="handleCommand('createGroupView')">新建一个</i></span>
<!--            <el-input v-model="taskInfo.taskDesc" autocomplete="off"></el-input>-->
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="display: flex;justify-content: center">
          <el-button @click="taskView = false">取 消</el-button>
          <el-button type="primary" @click="addTask(taskInfo)">确 定</el-button>
        </div>
      </el-dialog>
<!--      查看任务弹框-->
      <el-dialog title="查看任务" :visible.sync="lookTaskView" width="70%">
        <el-form class="edit-task-dialog">
          <el-row>
            <el-col :span="12">
              <el-form-item label="任务名称:" style="" label-width="130px">
                {{editTaskData.taskName}}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="任务检查项:" class="check-list" label-width="130px" style="width: 100%;">
                <div style="max-height: 220px;overflow-y: auto;">
                  <div v-for="(item, index) in editTaskData.checkItem" :key="index" style="width: 100%; padding-left: 10px;display: flex;justify-content: left" @mouseover="checkHover = index" @mouseout="checkHover = 10000">
                    <div style="width: 90%;overflow: hidden;">
                      <span>{{index+1}}.</span>
                      <span>{{item.itemName}}</span>
                    </div>
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="任务描述:" style="" label-width="130px">
                <div style="max-height: 200px;overflow-y: auto">
                  {{editTaskData.taskDesc}}
                </div>

              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label-width="130px" label="文件:">
                <div style="max-height: 200px;overflow-y: auto">
                  <div v-for="(item, index) in editTaskData.taskFileList" :key="index">
                    <p style="cursor: pointer;color: #409EFF" @click="preView(item)">{{item.fileName}}</p>
                  </div>
                </div>

              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
        <div slot="footer" class="dialog-footer" style="display: flex;justify-content: center">
          <el-button type="primary" @click="lookTaskView = false">取 消</el-button>
        </div>
      </el-dialog>
<!--      修改任务检查项-->
      <el-dialog title="修改任务检查项" :visible.sync="editDialogView" width="35%">
        <el-form label-width="100px">
          <el-form-item label="检查项名称" style="padding: 0 50px">
            <el-input v-model="editItem.itemName" autocomplete="off" type="textarea" style="width: 100%;"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer f-c" style="display: flex;justify-content: center">
          <el-button @click="editDialogView = false">取 消</el-button>
          <el-button type="primary" @click="editCheckEnter(editItem)">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 修改任务弹窗  -->
      <el-dialog title="修改任务" :visible.sync="editTaskView" width="70%" :before-close="closeEditView">
        <el-form class="edit-task-dialog" :model="editTaskData"  label-width="130px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="任务名称:" style="">
                <el-input v-model="editTaskData.taskName" style="width: 90%;height: 30px;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" style="">
              <el-form-item label="任务描述:" style="" >
                <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 6}" v-model="editTaskData.taskDesc" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">

              <el-form-item label="任务检查项:" class="check-list" style="width: 80%;">
                <div style="display: flex;justify-content: center;align-items: center">
                  <el-input style="width: 80%;" type="textarea" :autosize="{ minRows: 1, maxRows: 4}" v-model="inputValue" @keyup.enter.native="createCheckItem(inputValue)"></el-input>
                  <el-button size="mini" type="primary" @click.native="createCheckItem(inputValue)">添加</el-button>
                </div>

                <div style="max-height: 150px;overflow-y: auto">
                  <draggable @change="(v) => {changeItem(v, false, editTaskData.checkItem)}" v-model="editTaskData.checkItem">
                    <div v-for="(item, index) in editTaskData.checkItem" :key="index" style="width: 100%; padding-left: 10px;display: flex;justify-content: left" :class="{'checkhover': checkHover == index}" @mouseover="checkHover = index" @mouseout="checkHover = 10000">
                      <div style="width: 85%;cursor: pointer">
                        <span>{{index+1}}.</span>
                        <span>{{item.itemName}}</span>
                      </div>
                      <div class="check-item-icon" style="width: 15%;display: flex;justify-content: center;align-items: center">
                        <i v-show="checkHover == index" class="el-icon-edit" @click="openEditDialog(item)"></i>
                        <i v-show="checkHover == index" class="el-icon-delete" style="margin-left: 10px" @click="deleteTaskItem(item)"></i>
                      </div>
                    </div>
                  </draggable>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="文件:" class="check-list" style="width: 80%;">
                <div style="width: 100%; max-height: 150px;overflow-y: auto">
                  <div v-for="(item, index) in editTaskData.taskFileList" :key="index" style="width: 100%; padding-left: 10px;display: flex;justify-content: left" :class="{'filehover': fileHover == index}" @mouseover="fileHover = index" @mouseout="fileHover = 10000">
                    <div style="color:#409EFF; width: 80%;">
                      <span>{{item.fileName}}</span>
                    </div>
                    <div class="check-item-icon" style="width: 20%;display: flex;justify-content: center;align-items: center">
                      <i v-show="fileHover == index" class="el-icon-view" @click="preView(item)"></i>
                      <i v-show="fileHover == index" class="el-icon-edit" style="" @click="doEditInOffice(item)"></i>
                      <i v-show="fileHover == index" class="el-icon-delete" style="" @click="unbindTmplateFile(item)"></i>
                    </div>
                  </div>
                </div>
<!--                <div style="width: 100%; height: 100px;overflow-y: auto">-->
<!--                  <div style="width: 100%; padding-left: 10px;display: flex;justify-content: left" v-for="(item, index) in editTaskData.taskFileList" :key="index">-->
<!--                    <div-->
<!--                      :class="{'filehover': fileHover == index}"-->
<!--                      @mouseover="fileHover = index" @mouseout="fileHover = 10000"-->
<!--                      style="width: 80%;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"-->
<!--                    >-->
<!--                      <span style="cursor: pointer;color: #409EFF" @click="preView(item)">{{item.fileName}}</span>-->
<!--                    </div>-->
<!--                    <div style="width: 20%;margin-left: 5px;margin-right: 5px"><i v-show="fileHover == index" class="el-icon-delete" style="font-size: 18px;cursor: pointer" @click="unbindTmplateFile(item)"></i></div>-->
<!--                  </div>-->
<!--                </div>-->
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer" style="display: flex;justify-content: center">
          <el-button @click="closeEditView">取 消</el-button>
          <el-button type="primary" @click="editTask(editTaskData)">确 定</el-button>
        </div>
      </el-dialog>
    </div>
<!--    文档-->
    <div class="template-doc" v-show="isClick==3">
      <el-row>
        <el-col :span="22">
          <el-tabs>
            <el-tab-pane label="文档"></el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
      <el-row style="max-height: 500px;overflow-y: auto">
        <el-col :span="22">
<!--          <div class="template-detail-doc">-->
<!--            <div class="doc-tree"></div>-->
<!--            <div class="doc-table"></div>-->
<!--          </div>-->
          <div class="doc-tree">
            <el-tree
              :data="data"
              :expand-on-click-node="true"
              :props="props"
              :load="loadNode"
              :default-expand-all="true"
              lazy
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>
                  <i :class="data.icon" ></i>
                  <span>{{ node.label }}</span>
                </span>

                <span class="some-click">
                  <span v-show="data.fileName" class="el-icon-view" @click="preView(data)"></span>
                  <span v-show="data.fileName" class="el-icon-edit" @click="doEditInOffice(data)"></span>
                  <span v-show="data.fileName" class="el-icon-delete" @click="deleteTemplateFile(data)"></span>
                </span>
              </span>
            </el-tree>
          </div>
        </el-col>
      </el-row>

    </div>
    <!--    共享成员-->
    <div class="template-share-people" v-show="isClick==4">
      <el-row>
        <el-col :span="22">
          <el-tabs>
            <el-tab-pane label="共享成员"></el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
      <div class="people-list" style="max-height: 550px">
        <div class="people-item">
          <el-row>
            <el-col :span="8" style="text-align: center">成员 ({{userList&&userList.length||0}})</el-col>
            <el-col :span="8" style="text-align: center">权限</el-col>
            <el-col :span="8" style="text-align: center">操作</el-col>
          </el-row>
        </div>
        <div style="font-size: 14px" class="people-item" v-for="(item,index) in userList" :key="index">
          <el-row>
            <el-col :span="8" style="text-align: center">{{item.userFullName}}</el-col>
            <el-col :span="8" style="text-align: center">
              <span v-if="item.canDelete">拥用者</span>
              <span v-else-if="item.canEdit">可编辑</span>
              <span v-else-if="item.canUse">可使用</span>
<!--              <span v-else>无权限</span>-->
            </el-col>
            <el-col v-if="createUserId != item.tempUserId" class="people-handle" :span="8" style="text-align: center;cursor: pointer">
              <span v-if="createUserId == $store.getters.userId">
                <el-popover
                  placement="top"
                  width="200"
                  trigger="click"
                  >
                  <template>
                    <div style="display: flex; flex-direction: column;align-items: center">
                      <el-switch
                        style="margin-bottom: 10px"
                        v-model="canEdit"
                        :disabled="createUserId == item.tempUserId"
                        active-text="可编辑"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        @change="(v)=>{changeEdit(item,v)}"
                      >
                      </el-switch>
                      <el-switch
                        v-model="canUse"
                        active-text="可使用"
                        disabled
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        @change="(v)=>{changeUse(item,v)}"
                      >
                      </el-switch>
                    </div>

                    <i slot="reference" @click="editSharePeople(item)" class="el-icon-edit"></i>
                  </template>

                </el-popover>
              </span>
              <span style="margin-left: 10px" v-if="createUserId == $store.getters.userId" @click="deleteSharePeople(item)">
                  <i class="el-icon-delete"></i>
              </span>
            </el-col>
          </el-row>
        </div>

      </div>
    </div>

    <el-row>
      <el-col :span="21">
        <div style="display: flex;justify-content: center;margin-top: 30px">
          <el-button class="btn" size="small" v-show="isClick==1" ref="createBtn" type="primary" @click="editTemplate(teptId)" style="margin-left: 150px;margin-right: 60px">修改模板</el-button>
          <el-button type="primary" size="small" v-show="isClick==3" @click="upFile">上传文件</el-button>
          <el-button type="primary" size="small" @click="$router.go(-1)" style="">返回</el-button>

        </div>
      </el-col>
    </el-row>


  <el-dialog
    title="上传文件"
    :visible.sync="loadView"
    top="30vh"
    width="30%">
    <div style="display: flex;justify-content: center;align-items: center">
      <div style="padding-right: 20px">
        <span>选择任务:</span>
        <el-select v-model="taskId" placeholder="默认根目录">
          <el-option
            v-for="item in taskList"
            :key="item.taskDefineId"
            :label="item.taskName"
            :value="item.taskDefineId">
          </el-option>
        </el-select>
      </div>
      <div>
        <el-upload
          class=""
          ref="upload"
          name="attachFile"
          :data="uploadData"
          :action="createTmplateFile"
          :before-upload="beforeUpload"
          :on-success="successCallback"
          multiple
          :show-file-list="false"
        >
          <el-button v-show="isClick==3" size="small" type="primary">点击上传</el-button>
        </el-upload>
      </div>


    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="loadView = false">取 消</el-button>
    </span>
  </el-dialog>
<!--    添加共享成员-->
    <el-dialog
      title="添加"
      :visible.sync="addSharePeopleView"
      width="25%"
    >
      <el-row class="dialog-footer" style="margin-bottom: 30px">
<!--        <el-col  :span="4">-->
<!--          <div style="text-align: right">成员:</div>-->
<!--        </el-col>-->
        <el-col :span="24">
          <div class="all-user" style="padding-left: 20%">
            <span style="text-align: right;margin-right: 10px">成员:</span>
            <el-select clearable filterable v-model="userId" placeholder="请选择">
              <el-option
                v-for="item in allUserList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>

        </el-col>
      </el-row>
      <el-row class="dialog-footer">
<!--        <el-col :span="4">-->
<!--          <div style="text-align: right">权限:</div>-->
<!--        </el-col>-->
        <el-col :span="24">
          <div style="padding-left: 20%">
            <span style="text-align: right;margin-right: 10px">权限:</span>
            <el-radio-group v-model="sharePeoplePermisson">
              <el-radio :label="1">编辑</el-radio>
              <el-radio :label="2">使用</el-radio>
            </el-radio-group>
          </div>

        </el-col>

      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addSharePeopleView = false">取 消</el-button>
        <el-button type="primary" @click="addSharePeople">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { importTemplateData}from '@/api/ipServiceApi.config.js'
  import draggable from 'vuedraggable'
  import {
    modifyTemplate,
    addTaskGroup,
    queryTaskList,
    modifyTaskGroup,
    deleteTaskGroup,
    addTask,
    deleteTasks,
    modifyTask,
    addTaskItem,
    modifyTaskItem,
    deleteTaskItem,
    queryTemplateFileList,
    queryTemplateList,
    deleteTemplateFile,
    addTemplateUser,
    modifyTemplateUser,
    deleteTemplateUser
  } from '@/api/templateManagement';
  import {
    queryMaterialDocType,
    queryMaterialTypeByDocId,
    bindTaskFile,
    bindTmplateFile,
    unbindTmplateFile,
    queryCaseType,
    modifyTaskNo,
    recordOnlienEdit
  } from '@/api/caseList'
  import { createTmplateFile } from '@/api/serviceApi.config.js'
  import { creatematerial } from '@/api/ipServiceApi.config.js'
  import { doEditInOffice, getProgID } from '@/utils/editInOffice.js'
  import Bus from '@/utils/Bus'
  export default {
    name: "template_management_edit",
    components:{
      draggable
    },
    data() {
      return {
        isOpen: false,
        editItem:{
          itemName:''
        },
        editDialogView:false,
        activeTaskNames:['1'],
        createUserId: '',
        canEdit: true,
        canUse: true,
        userId: '',
        addSharePeopleView: false,
        caseTypeIdList: [],
        caseTypeOptions: [],
        defaultParams: { // 級聯菜單默認
          value: 'caseTypeId',
          label: 'caseType',
          children: 'childrens',
          checkStrictly: false
        },
        materialTypeId: '',
        importTemplateData,
        localFileData: {
          tokenID: this.$store.getters.token
        },
        importData:{
          tokenID:this.$store.getters.token,
          teptId:this.$route.params.id
        },
        modelFile: [],
        paperclipView: true,
        loadView: false,
        taskId: '',
        taskList: [],
        uploadData: {
          tokenID: this.$store.getters.token
        },
        createTmplateFile,
        creatematerial,
        props: {
          label: 'label',
          children: 'children',
          isLeaf: false
        },
        data: [],
        lookTaskView: false,
        itemLists: [],
        editCheck: 10000,
        fileHover: 10000,
        inputValue: '',
        taskHover: 10000,
        checkHover: 10000,
        isClick: 1,
        tabName: '1',
        templateTitle: '',
        templateData: {
          teptName: '',
          caseTypeId: '',
          judgeRank: ''
        },
        teptName: '',
        judgeRankList: [
          {name:'一审', value:1071},
          {name:'二审', value:1072},
          {name:'再审', value:1073},
          {name:'重审', value:1074},
          {name:'执行', value:1075},
          {name:'无', value:1368},
          {name:'', value: ''}
        ],
        teptId: '',
        taskDefineId: '',
        templateValue: '',
        groupView: false,
        taskGroupView: false,
        isLoading: false,
        isDisabled: false,
        groupsView: false,
        groupsEdit: false,
        taskView: false,
        // readonly: true,
        // isActive: false,
        taskGroupNum: 0,
        editGroupData: {
          tgName: '',
          tgNo: ''
        },
        addGroups: {
          tgName: '',
          tgNo: '',
          taskDefineList: []
        },
        groupList: [],
        taskQueryList: [],
        activeNames: [],
        taskInfo: {
          taskName: '',
          taskDesc: '',
          tgId: '',
          // checkItem: ''
        },
        editTaskData: {
          taskName: '',
          taskDesc: '',
          checkItem: '',
          taskFileList: []

        },
        tgId: '',
        editTaskView: false,
        createGroupsView: false,
        outCreate: false,
        checkId1: '',
        checkId2: '',
        tfileId: '',
        isDir: 1,
        rightView:false,
        docTypeList: [],
        typeNameList: [],
        fileDocId: '',
        index: '',
        i: '',
        selected: 0,
        modelData: [],
        typeLists: [],
        type: '',
        userList: [],
        sharePeoplePermisson: ''
      }
    },
    computed: {
      typeList() {
        return this.$store.getters.caseTypeList
      },
      allUserList(){
        return this.$store.getters.userList
      }
    },
    created() {
      // this.queryCaseType()
      this.teptId = this.$route.params && this.$route.params.id;
      this.teptName = this.$route.query&&this.$route.query.teptName
      this.type = this.$route.query&&this.$route.query.type
      this.queryTaskList(this.teptId)
      this.initFileList()

      if(this.typeList&&this.typeList.length>0){
         this.recursiveFunction(this.typeList)
      }
    },
    watch: {
      typeList:{
        handler(n, o) {
          if(n&&n.length>0){
            this.recursiveFunction(n)
          }
      　},
    　　immediate: true
      }
    },
    methods: {
      openOrClose() {
        this.isOpen = !this.isOpen
        if (this.isOpen) {
          this.groupList.forEach((item, index) => {
            setTimeout(() => {
              this.activeNames.push(index)
            })
            item.taskDefineList.forEach((i, idx) => {
              setTimeout(() => {
                this.activeTaskNames.push(idx)
              })
            })
          })
        } else {
          for (let i = 0; i < this.activeNames.length; i++) {
            setTimeout(() => {
              this.activeNames.shift()
            })
          }
          for (let i = 0; i < this.activeTaskNames.length; i++) {
            setTimeout(() => {
              this.activeTaskNames.shift()
            })
          }
        }
      },
      changeItem(v, isSave, list, taskData){
        list.forEach((item, index) => {
          item.itemNo = index + 1
        })
        if (isSave) {
          modifyTask({...taskData, teptId: this.teptId,tgId: taskData.tgId,taskDefineId: taskData.taskDefineId}).then(()=>{
            this.queryTaskList(this.teptId)
          })
        }
      },
      openEditDialog(item){
        // console.log(item,889989)
        this.editItem = JSON.parse(JSON.stringify(item))
        this.editDialogView = true
      },
      closeEditView(){
        this.editTaskView = false
        this.editCheck = 10000
      },
      onlyOneChoice(v){
        this.modelFile = []
        if(v){
          // console.log(v)
          // const length = v.length
          this.modelFile.push(v.splice(-1)[0])
          // console.log(this.modelFileId)
        }
      },
      changeEdit(item,v){
        if(v){
          // console.log(v)
          this.canUse = true
        }
        modifyTemplateUser({teptId: this.teptId,tempUserId: item.tempUserId,canEdit:+this.canEdit,canUse: +this.canUse}).then(()=>{
          this.$message.success('修改成功!')
          this.queryTemplateList()
        })
      },
      changeUse(item,v){
        // console.log(item,v)
        if(!v){
          this.$message.error('无法更改使用权限!')
          this.canUse = true
          return
          // this.canEdit = false
        }
        if(this.canEdit){

        }else{
          modifyTemplateUser({teptId: this.teptId,tempUserId: item.tempUserId,canEdit:+this.canEdit,canUse: +this.canUse}).then(()=>{
            this.$message.success('修改成功!')
            this.queryTemplateList()
          })
        }
      },
      editSharePeople(item){
        this.canUse = !!item.canUse
        this.canEdit = !!item.canEdit
      },
      deleteSharePeople(item){
        this.$confirm('此操作将删除该共享成员, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          deleteTemplateUser({tempUserId:item.tempUserId,teptId: this.teptId,canEdit: +item.canEdit,canUse: +item.canUse}).then(()=>{
            this.$message.success('删除成功!')
            this.queryTemplateList()
          })
        })
      },
      addSharePeople(){
        let canEdit = ''
        let canUse = ''
        if(this.sharePeoplePermisson == 1){
          canEdit = 1
          canUse = 1
        }else{
          canEdit = 0
          canUse = 1
        }
        if(!this.userId){
          this.$message.error('请选择共享成员!')
        }
        if(!this.sharePeoplePermisson){
          this.$message.error('请设置权限!')
        }
        addTemplateUser({
          teptId: this.teptId,
          tempUserId: this.userId,
          canEdit,
          canUse
        }).then(()=>{
          this.$message.success('添加成功!')
          this.addSharePeopleView = false
          this.queryTemplateList()
        })
      },
      deleteTemplateFile(data){
        // console.log(data)
        this.$confirm('此操作将解除关联该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          let teptId = this.teptId
          let tfileId = data.tfileId
          deleteTemplateFile({teptId,tfileId}).then(()=>{
            this.$message.success('删除成功!')
            this.initFileList()
            this.queryTaskList(teptId)
          })
        })

      },
      changeList({added, moved, removed}, tgId, list){
        let taskDefineList = list.filter(i =>i.taskDefineId).map((item,index)=>({
          taskNo: index+1,
          taskDefineId: item.taskDefineId
        }))
        if (added) {
          modifyTask({taskDefineId: added.element.taskDefineId, teptId: this.teptId, tgId}).then(res => {
            modifyTaskNo({teptId:this.teptId,taskDefineList}).then(res=>{
              this.queryTaskList(this.teptId)
            })
          })
          return;
        }
        taskDefineList.length && modifyTaskNo({teptId:this.teptId,taskDefineList}).then(res=>{
          this.queryTaskList(this.teptId)
        })
      },
      queryCaseType() {
        queryCaseType().then(res => {
          this.caseTypeOptions = res.data
          // this.caseTypeOptions.splice(2,1)
        })
      },
      upFile() {
        this.loadView = true
        this.taskId = ''
        this.rightView = false
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
      importTemplatesuccess(e){
        this.teptId = this.$route.params && this.$route.params.id;
        this.teptName = this.$route.query&&this.$route.query.teptName
        this.queryTaskList(this.teptId)
        this.initFileList()

        if(this.typeList&&this.typeList.length>0){
          this.recursiveFunction(this.typeList)
        }
      },
      recursiveFunction(a){
        let typeList = []
        const getObj = (arr)=>{
          arr.forEach(function(row){
          if(row.childrens){
            // console.log('++++++++rowchild+++++++')
            // console.log(row)
            typeList.push({'caseType': row.caseType,'caseTypeId': row.caseTypeId})
            getObj(row.childrens)
          }else {
            // console.log('++++++roe')
            // console.log(row)
              typeList.push({'caseType': row.caseType,'caseTypeId': row.caseTypeId})
            }
          })
        }
        getObj(a)
        this.typeLists = typeList
        if(this.typeLists&&this.typeLists.length>0&&this.teptId!=0){
          this.queryTemplateList()
        }
      },
      closeTab() {
        if(this.rightView){
          this.rightView = false
        }else{
          // console.log(7890)
        }

      },
      unbindTmplateFile(data,taskDefineId_) {
        const tfileId = data.tfileId
        this.$confirm('此操作将解除关联该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          let taskDefineId = taskDefineId_ ? taskDefineId_ : this.taskDefineId
          unbindTmplateFile({tfileId,taskDefineId}).then(()=>{
            this.queryTaskList(this.teptId)
             this.$message.success('删除成功!')
          })
        })
      },
      bindTmplateFile() {
        if(!this.modelFile[0]){
          this.$message.error('请先勾选文件!')
          return
        }
        bindTmplateFile({tfileId: this.modelFile[0], taskDefineId: this.localFileData.taskDefineId }).then(()=>{
          this.queryTaskList(this.teptId)
          this.$message.success('关联成功')
          this.rightView = false
          this.modelFile = []
        })
      },
      queryMaterialDocType() {
        queryMaterialDocType().then(res=>{
          this.docTypeList = res.data
        })
      },
      handleChangeDoc(value){
        if(value){
          this.queryMaterialTypeByDocId()
        }
      },
      queryMaterialTypeByDocId() {
        queryMaterialTypeByDocId({ doctId:this.fileDocId ,caseTypeId:2}).then(res => {
          this.typeNameList = res.data
        })
      },
      uploadTempFile(data,i) {
        this.selected = i
        this.taskId = data.taskDefineId
        this.uploadData.taskDefineId=data.taskDefineId
        this.localFileData.taskDefineId=data.taskDefineId
        this.rightView = 'rightView' + data.taskName
        // this.queryMaterialDocType()
        // this.initFileList( 1)
        if(this.modelData.length == 0){
          queryTemplateFileList({teptId: this.teptId,tfileId: ''}).then(res=>{
            let arr = []
            this.tfileId = res.data[0].tfileId
            // res.data.forEach(item=>{
            //   if(item.dirName){
            //     item.isLeaf = false
            //     item.icon = 'el-icon-folder'
            //     item.label = item.dirName
            //   }
            //   if(item.fileName){
            //     item.isLeaf = true
            //     item.icon = 'el-icon-document'
            //     item.label = item.fileName
            //   }
            //   arr.push(item)
            // })
          }).then(()=>{
              queryTemplateFileList({teptId: this.teptId,tfileId: this.tfileId}).then(res=>{
              let arr = []
              res.data.forEach(item=>{
                if(item.dirName){
                  item.isLeaf = false
                  item.icon = 'el-icon-folder'
                  item.label = item.dirName
                }
                if(item.fileName){
                  item.isLeaf = true
                  item.icon = 'el-icon-document'
                  item.label = item.fileName
                }
                arr.push(item)
              })
             this.modelData.push(...arr)

            })
          })
        }

        // if(!this.data){
        //   this.initFileList( 1)
        // }else{
        //   console.log('111')
        // }

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
      initFileList(a = '') {
        queryTemplateFileList({teptId: this.teptId,tfileId: a}).then(res=>{
            this.data = []
            let arr = []
            res.data.forEach(item=>{
              if(item.dirName){
                item.isLeaf = false
                item.icon = 'el-icon-folder'
                item.label = item.dirName
              }
              if(item.fileName){
                item.isLeaf = true
                item.icon = 'el-icon-document'
                item.label = item.fileName
              }
              arr.push(item)
            })
            this.data.push(...arr)
          })

      },
      findPathBydirName(leafId, nodes, path,arr){
        if(path === undefined) {
          path = {};
        }
        for(var i = 0; i < nodes.length; i++) {
          var tmpPath = path;
          //   tmpPath.push(nodes[i].id);
          if(leafId == nodes[i].dirName) {
            tmpPath=nodes[i];
            // tmpPath.children = arr
            return tmpPath;
          }
          if(nodes[i].children) {
            var findResult = this.findPathBydirName(leafId, nodes[i].children,  tmpPath);
            if(findResult) {
              // findResult.children = arr
              return findResult;
            }
          }
        }
      },
      loadNode(node, resolve) {        // 加载 树数据
        let that = this;
        this.tfileId = node.data.tfileId
        if(node.data.isDir == 0){
          resolve([])
          return
        }
        if (node.level === 0) {
          that.loadtreeData(resolve);
        }
        if (node.level >= 1) {
          this.getChildByList( resolve);
          return resolve([]); // 加上这个，防止在该节点没有子节点时一直转圈的问题发生。
        }
      },
      loadtreeData( resolve) {      // 获取loadtreeData 就是父节点数据，getChildByList就是异步获取子节点数据


      },
      getChildByList( resolve) {     // 获取子节点请求
        queryTemplateFileList({teptId: this.teptId, tfileId: this.tfileId}).then(res=>{
              let arr = []
              res.data.forEach(item=>{
                if(item.dirName){
                  item.isLeaf = false
                  item.icon = 'el-icon-folder'
                  item.label = item.dirName
                }
                if(item.fileName){
                  item.isLeaf = true
                  item.icon = 'el-icon-document'
                  item.label = item.fileName
                }
                arr.push(item)
              })
          resolve(arr)
            })
      },
      beforeUpload() {
        this.uploadData.teptId = this.teptId
        this.uploadData.taskDefineId = this.taskId
      },
      successCallback(response, file, fileList) {
        if(response.success){
          this.$message.success('文件上传成功!')
           this.$refs.upload.clearFiles();
          this.initFileList()
          this.queryTaskList(this.teptId)
          // this.isLoading = false
          this.loadView = false
          // this.handleSearch()
        }else{
          this.$message.error('文件上传失败!')
          // this.loadView = false
          // this.isLoading = true
        }
      },
      rightViewClose(){
        this.rightView = false
        this.taskId = ''
      },
      beforeUpload1() {
        // this.localFileData.taskDefineId = this.taskId
        this.localFileData.teptId = this.teptId
        // this.localFileData.materialTypeId = this.materialTypeId

      },
      successCallback1(response, file, fileList) {
        if(response.success){
          // const materialId = response.data[0].materialId
          // console.log('++++++4324234+++++++++')
          // console.log(materialId)
          // console.log('+++++++++++++++')
          // bindTaskFile({materialId:materialId,prjTaskId:this.prjTaskId}).then(()=>{
          //   console.log('+++++++++++++++')
          //   console.log('关联成功')
          //   console.log('+++++++++++++++')
          // })
          this.queryTaskList(this.teptId)
          this.rightView = false
          this.$message.success('文件上传成功!')
           this.$refs.upload.clearFiles();
          this.taskId = ''
          // this.initFileList(1)
          // this.isLoading = false
          // this.loadView = false
          // this.handleSearch()
        }else{
          this.$message.error('文件上传失败!')
          this.taskId = ''
          // this.loadView = false
          // this.isLoading = true
        }
      },
      deleteTaskItem(i) {
        deleteTaskItem({teptId: this.teptId, itemId: i.itemId}).then(()=>{
          // this.$message.success('删除成功!')
          this.queryTaskList(this.teptId)
        })
      },
      editCheckEnter(i) {
        // this.editCheck = 10000
        modifyTaskItem({teptId: this.teptId,itemId: i.itemId,itemName: i.itemName}).then(()=>{
          this.editCheck = 10000
          this.queryTaskList(this.teptId)
          this.editDialogView = false
          // teptId：模板编号
          // itemId：模板任务检查项编号
          // itemName：模板任务检查项名称
        })
      },
      createCheckItem(v,f) {
          //清空检查项列表
         // this.taskInfo.checkItem = []
        // console.log(v,'haha')
        // // alert(!v)
        // return;
        if(!v)return;
        if(v&&v.split('\n').every(i=>i=='')){
          return;
        }
        let itemList = v.split('\n').filter(i=>!!i)
        itemList = itemList.map(item=>({
          itemName: item,
          taskDefineId: this.taskDefineId
        }))
        addTaskItem({itemList, teptId: this.teptId}).then(()=>{
          // this.$message.success('增加')
          !f&&this.queryTaskList(this.teptId)
          this.inputValue = ''
        })
      },
      clickIndex(a) {
        this.isClick = a
      },
      handleCommand(f) {
        if(f=='createGroupView') {
          this.groupsView = true
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
        queryTaskList({teptId}).then((res)=>{
          this.groupList = res.data
          this.groupList = this.groupList.filter(item=>!!item).sort((a, b) => {
              return a.tgNo - b.tgNo
          })
          // this.groupList.sort(this.compare("tgNo",true))
          this.groupList.forEach(i=>{
            this.taskList.push(...i.taskDefineList)
          })
          if(this.editTaskView){
            if(this.groupList[this.checkId1].taskDefineList[this.checkId2].itemList){
              this.itemLists = this.groupList[this.checkId1].taskDefineList[this.checkId2].itemList
              if(this.itemLists.length) {
                let arr = this.itemLists.map(it => ({
                  itemName: it.itemName,
                  taskDefineId: it.taskDefineId,
                  itemId: it.itemId
                }))
                // this.itemLists.forEach(i => {
                //   arr.push(i.itemName)
                // })
                this.editTaskData.checkItem = arr
              } else {
                this.editTaskData.checkItem = []
              }
            }
            if(this.groupList[this.checkId1].taskDefineList[this.checkId2].taskFileList){
              this.editTaskData.taskFileList = this.groupList[this.checkId1].taskDefineList[this.checkId2].taskFileList
            }
          }

        })
      },
      queryTemplateList() {
        queryTemplateList({tempType: this.type,pageSize:10000}).then(res=>{
          if(res.data&&res.data.find(item=>item.teptId == this.teptId)){
            this.templateData = res.data.find(item=>item.teptId == this.teptId)
            this.userList = this.templateData.userList
            // console.log(this.userList)
          }

          this.templateTitle = this.templateData.teptName
          this.createUserId = this.templateData.createUserId
        })
        // this.templateData = JSON.parse(localStorage.getItem('templateList')).filter(item=>item.teptId==teptId)[0]
        // this.taskGroupNum = this.templateData.taskGroupList

        // if(this.templateData&&this.templateData.teptName){
        //   this.templateTitle = this.templateData.teptName
        // }
        // if(this.templateData&&this.templateData.caseTypeId){
        //   this.templateData.caseTypeId = this.templateData.caseTypeId
        // }
        //
        // if(this.typeLists.find(item=>item.caseTypeId == this.templateData.caseTypeId)&&this.typeLists.find(item=>item.caseTypeId == this.templateData.caseTypeId).caseType){
        //   this.caseType = this.typeLists.find(item=>item.caseTypeId == this.templateData.caseTypeId).caseType
        // }
        //
        // this.templateData.judgeRank = this.templateData.judgeRank
        // if(this.judgeRankList.find(item=>item.value == this.templateData.judgeRank)&&this.judgeRankList.find(item=>item.value == this.templateData.judgeRank).name){
        //   this.judgeRankName  = this.judgeRankList.find(item=>item.value == this.templateData.judgeRank).name
        // }
      },
      editTemplate(teptId) {
        this.templateData.teptId = +teptId
        delete this.templateData.taskGroupList
        modifyTemplate(this.templateData).then(()=>{
          this.$message.success('修改成功！')
          this.queryTemplateList()
          Bus.$emit('updateTemplate')
        })
      },
      // groupViewClick() {
      //   this.groupsView = true
      // },
      addNewGroup() {
        if(!this.addGroups.tgName){
          this.$message.error('请填写阶段名称!')
          return
        }
        if(!this.addGroups.tgNo){
          this.$message.error('请填写阶段序号!')
          return
        }
        this.addGroups.teptId = +this.teptId
        if(this.groupList.find(item=>item.tgNo == this.addGroups.tgNo)){
          this.addGroups.tgId = this.groupList.find(item=>item.tgNo == this.addGroups.tgNo).tgId
          this.$confirm('此阶段已经存在，是否覆盖?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            this.editGroup(this.addGroups,'newTask')
          }).catch(()=>{
            this.addGroups.tgId = ''
          })
        }else {
          if(this.addGroups.tgNo > this.groupList.length){
            this.addGroups.tgNo = this.groupList.length+1
          }
          addTaskGroup(this.addGroups).then(()=>{
            this.groupsView = false
            this.$message.success('新建成功！')
            this.addGroups.tgName = ''
            this.addGroups.tgNo = ''
            this.queryTaskList(this.teptId)
          })
        }
      },
      editGroupName(item, index) {
        this.editGroupData = JSON.parse(JSON.stringify(item))
        this.groupsEdit = true
      },
      editGroup(data,n) {
        if(!this.editGroupData.tgName){
          this.$message.error('请填写阶段名称!')
          return
        }
        if(!this.editGroupData.tgNo){
          this.$message.error('请填写阶段序号!')
          return
        }
        data.taskDefineList = data.taskDefineList.map(o => ({
          itemList: o.itemList,
          taskDefineId: o.taskDefineId,
          taskDesc: o.taskDesc,
          taskName: o.taskName,
          taskNo: o.taskNo,
          tgId: o.tgId
        }))
        data.teptId = this.teptId
        modifyTaskGroup(data).then(()=>{
          if(n == 'newTask'){
            this.$message.success('新建成功！')
            this.groupsView = false
            this.addGroups.tgName = ''
            this.addGroups.tgNo = ''
          }else{
            this.$message.success('修改成功！')
            this.groupsEdit = false
            this.editGroupData.tgNo = ''
            this.editGroupData.tgName = ''
            this.addGroups.tgId = ''
          }
          this.queryTaskList(this.teptId)

        })
      },
      delGroup(item) {
        const tgId = item.tgId
        const teptId = this.teptId
        this.$confirm('此操作将永久删除该阶段, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          deleteTaskGroup({tgId,teptId}).then(()=>{
            this.$message.success('删除成功！')
            this.queryTaskList(this.teptId)
          })
        }).catch(()=>{
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      addTask(taskInfo) {
        if(!this.taskInfo.taskName){
          this.$message.error('请填写任务名称!')
          return
        }
        if(!this.taskInfo.tgId){
          this.$message.error('请选择阶段!')
          return
        }
        this.taskInfo = taskInfo
        this.taskInfo.teptId = this.teptId
        addTask(this.taskInfo).then(()=>{
          this.taskView = false
          this.taskInfo.taskName = ''
          this.taskInfo.taskDesc = ''
          this.taskInfo.tgId = ''
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
      delTask(item,index) {
        const taskDefineId = item.taskDefineList[index].taskDefineId
        this.$confirm('此操作将永久删除该任务, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            deleteTasks({taskDefineId, teptId: this.teptId}).then(()=>{
            this.$message.success('删除成功！')
            this.queryTaskList(this.teptId)
          })
        }).catch(()=>{
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })

      },
      editTaskName(item, name, index, i,f) {
        if(f == 'look'){
          this.lookTaskView = true
        }else{
          this.editTaskView = true
        }
        this.checkId1 = index
        this.checkId2 = i
        this.tgId = item.tgId
        if(item.taskDefineId){
          this.taskDefineId = item.taskDefineId
        }else{
          this.taskDefineId = item.taskDefineList.find(i=>i.taskName == name).taskDefineId
        }

        const arr = item.taskDefineList.find(i=>i.taskName == name)
        this.editTaskData.taskName = name
        this.editTaskData.taskDesc = arr.taskDesc
        this.itemLists = this.groupList[index].taskDefineList[i].itemList
        //taskFileList
        this.editTaskData.taskFileList = this.groupList[index].taskDefineList[i].taskFileList
        if(this.itemLists.length) {
          let arr1 = this.itemLists.map(it=>({
            itemName: it.itemName,
            taskDefineId: this.taskDefineId,
            itemId: it.itemId
          }))
          this.editTaskData.checkItem = arr1
        }else{
          this.editTaskData.checkItem = []
        }
      },
      editTask(data) {
        if(this.inputValue){
          this.createCheckItem(this.inputValue,1)
        }
        data.itemList = JSON.parse(JSON.stringify(data.checkItem))
        delete data.taskFileList
        delete data.checkItem
        modifyTask({...data, teptId: this.teptId,tgId: this.tgId,taskDefineId: this.taskDefineId}).then(()=>{
          this.editTaskView = false
          this.editCheck = 10000
          this.queryTaskList(this.teptId)
          this.$message.success('修改成功！')
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  /deep/ .el-tree-node__expand-icon.is-leaf{
    color: #333;
  }
  .template-collapse {
    .template-collapse-item{
      position: relative;
      .template-check-box {
        padding-left: 30px;
        .el-icon-circle-plus-outline, .el-icon-edit {
          font-size: 16px;
          /*margin-top: 20px;*/
          margin-left: 20px;
          &:hover {
            color: #409EFF;
          }
        }
        .el-icon-delete {
          font-size: 16px;
          margin-left: 20px;
          /*margin-left: 30px;*/
          &:hover {
            color: red;
          }
        }
      }
      .collapse-title {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex: 1 0 90%;
        order: 1;
        .task-num {
          /*position: absolute;*/
          /*left: 40%;*/
          /*top: 6px;*/
          font-size: 14px;
          color: #ccc;
          padding-left: 10px;
          /*<!--transform: translateX(-200px) translateY(-6px);-->*/
        }
        .el-icon-delete,.el-icon-edit{
          /*position: absolute;*/
          /*left: 50%;*/
          /*top: 20px;*/
          cursor: pointer;
          margin-left: 20px;
          font-size: 16px;
          /*<!--transform: translateX(-200px) translateY(-6px);-->*/
          transition: all .3s;
          &:hover {
            color: red;
          }
        }
        .el-icon-edit,.el-icon-view {
          /*left: 47%;*/
          &:hover {
            color: #409EFF
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

    .template-collapse-item1{
      position: relative;
      .template-check-box {
        .el-icon-circle-plus-outline, .el-icon-edit {
          font-size: 16px;
          /*margin-top: 20px;*/
          margin-left: 20px;
          &:hover {
            color: #409EFF;
          }
        }
        .el-icon-delete {
          font-size: 16px;
          margin-left: 20px;
          /*margin-left: 30px;*/
          &:hover {
            color: red;
          }
        }
      }
      .collapse-title1 {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex: 1 0 90%;
        order: 1;
        .task-num {
          /*position: absolute;*/
          /*left: 40%;*/
          /*top: 6px;*/
          font-size: 14px;
          color: #ccc;
          padding-left: 10px;
          /*<!--transform: translateX(-200px) translateY(-6px);-->*/
        }
        .el-icon-delete,.el-icon-edit{
          /*position: absolute;*/
          /*left: 50%;*/
          /*top: 20px;*/
          cursor: pointer;
          margin-left: 20px;
          font-size: 16px;
          /*<!--transform: translateX(-200px) translateY(-6px);-->*/
          transition: all .3s;
          &:hover {
            color: red;
          }
        }
        .el-icon-edit,.el-icon-view {
          /*left: 47%;*/
          &:hover {
            color: #409EFF
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
  .tabs {
    display: flex;
    position: relative;
    justify-content: center;
    padding-top: 30px;
    border-top: 3px solid #E4E7ED;
    div{
      padding: 15px;
      cursor: pointer;
    }
    .clickName {
      color: #409EFF;
      border-bottom: 3px solid #409EFF;
    }
  }
  .form {
    .el-row{
      display: flex;
      justify-content: center
    }
  }
  .template-create-generous-view{
    .el-form{
      margin-top: 40px;
    }
  }
  .template-create-task-group {
    .group-list{
      padding: 0 60px;
    }

  }
  .task-list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .task-name, .task-icon{
      height: 40px;
      line-height: 40px;
    }
    .task-name{
      padding-left: 5%;
    }
    .task-icon {
      padding-right: 30%;
    }
  }
  .taskhover, .checkhover, .filehover {
    background-color: #f1f1f1;
  }
  .check-list {
    >>>.el-form-item__content{
      width: 100% !important;
      margin-left: 0!important;
    }
  }
  .check-item-icon {
    .el-icon-delete,.el-icon-edit {
      /*position: absolute;*/
      /*left: 50%;*/
      /*top: 20px;*/
      /*margin-left: 20px;*/
      font-size: 16px;
      cursor: pointer;
      /*<!--transform: translateX(-200px) translateY(-6px);-->*/
      transition: all .3s;
      &:hover {
        color: red;
      }
    }
    .el-icon-edit, .el-icon-view{
      cursor: pointer;
      /*left: 47%;*/
      &:hover {
        color: #409EFF
      }
    }
  }
  .some-click {
    position: absolute;
    margin-right: 30%;
    right: 0;
    >>>.el-icon-view{
      /*margin-right: 15px;*/
      /*font-size: 20px;*/
      &:hover{
        color: #409EFF;
      }
    }
    >>>.el-icon-delete{
      /*font-size: 20px;*/
      &:hover{
        color: red;
      }
    }
  }
  .el-icon-paperclip {
    margin-left: 15px;
      font-size: 18px;
      &:hover{
        color: #52A0F5
      }
    }
  .right-fileList {
    position: absolute;
    right: 0;width: 400px;
    height: 300px;
    z-index: 199999;
    >>>.el-card__header{
      padding: 5px 0;
    }
    >>> .el-card__body{
      padding: 10px;
      /*height: 200px;*/
      height: 170px;
      line-height: 30px;
      overflow-y: auto;
    }
  }
  >>>.el-collapse-item__content{
    /*height: 250px;*/
    /*overflow-y: auto;*/
  }
  .right-tab {
    height: 250px;
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
    >>>.el-input__inner{
      height: 30px;
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
  }


  /*<!--&gt;>> .el-dialog {-->*/
  /*<!--      position: absolute;-->*/
  /*<!--      top: 50%;-->*/
  /*<!--      left: 50%;-->*/
  /*<!--      margin: 0 !important;-->*/
  /*<!--      transform: translate(-50%, -50%);-->*/
  /*<!--      max-height: calc(100% - 30px);-->*/
  /*<!--      max-width: calc(100% - 30px);-->*/
  /*<!--      display: flex;-->*/
  /*<!--      flex-direction: column;-->*/
  /*<!--}-->*/
  >>> .el-dialog__body {
        overflow: auto;
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
  .edit-task-dialog {
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
          /*overflow-y: auto;*/
          display: flex;
          justify-content: left;
          >>>.el-form-item__label{
            flex-shrink: 0;
            background-color: #f1f1f1;
          }
          >>>.el-form-item__content{
            margin-left: 0!important;
            width: 80%;
          }
        }
      }
      /*.bott{*/
      /*  border-bottom: 1px solid #ccc;*/
      /*}*/
    }
  }
  .f-c{
    display: flex;
    justify-content: center;
  }
  .people-list{
    padding: 10px 20px;
    .people-item{
      &:first-child{
        /*font-weight: 800;*/
        font-size: 20px;
      }
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid #EBEEF5;
      width: 85%;
    }
  }
  .dialog-footer{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .all-user{
    .el-select{
      >>>.el-input__icon{
          line-height: 30px;
        }
      >>>.el-input__inner{
        height: 30px;
        line-height: 30px;

      }
    }
  }
  .people-handle{
    .el-icon-edit {
      font-size: 18px;
      &:hover {
        color: #52A0F5;
      }
    }
    .el-icon-delete {
      font-size: 18px;
      &:hover {
        color: red;
      }
    }
  }
  .wrapper{
    .el-collapse{
      border: none;
    }
  }
</style>
<style>
  .doc-tree .el-tree-node__expand-icon{
    display: none;
  }

</style>
