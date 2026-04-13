<template>
  <div class="template-view">
    <div class="template-header-title" style="margin-top: 20px;margin-bottom: 20px">
      <h3>{{templateTitle}}</h3>
    </div>
    <el-row>
      <el-col :span="22">
        <div class="tabs">
          <div @click="clickIndex(1)" :class="{'clickName': isClick == 1}">概览</div>
          <div @click="clickIndex(2)" :class="{'clickName': isClick == 2}">任务</div>
          <div @click="clickIndex(3)" :class="{'clickName': isClick == 3}">文档</div>
          <div v-if="type==2" @click="clickIndex(4)" :class="{'clickName': isClick == 4}">成员</div>

        </div>
      </el-col>
    </el-row>

    <!--  概览模块  -->
    <div class="template-create-generous-view" v-show="isClick == 1">
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
              <span>{{templateData.teptName}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="案件类型:">
              <span>{{templateData.caseType}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="审级:">
              <span>{{templateData.judgeRankName}}</span>
            </el-form-item>
          </el-col>
        </el-row>
<!--        <el-button ref="createBtn" type="primary" style="margin-left: 130px" @click="editTemplate(teptId)">修改模板</el-button>-->
      </el-form>
    </div>

    <!--  阶段模块  -->
    <div class="template-create-task-group" v-show="isClick == 2">
      <el-row>
        <el-col :span="22" style="position: relative">
          <el-tabs>
            <el-tab-pane label="概览"></el-tab-pane>
          </el-tabs>
          <div style="position: absolute;right: 0;top: 10px;color: #409EFF;cursor:pointer;font-size: 14px;" @click="openOrClose">{{isOpen ? '全部收起' : '全部展开'}}</div>
        </el-col>
      </el-row>
      <div>
        <!--      查看任务-->
        <el-dialog title="查看任务" :visible.sync="clickTaskView" width="60%">
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
                    <div v-for="(item, index) in editTaskData.itemList" :key="index" style="width: 100%; padding-left: 10px;display: flex;justify-content: left" @mouseover="checkHover = index" @mouseout="checkHover = 10000">
                      <div style="width: 90%;">
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
                  <div style="max-height: 100px;overflow-y: auto">
                    <div v-for="(item, index) in editTaskData.taskFileList" :key="index">
                      <p style="cursor: pointer;color: #409EFF" @click="preView(item)">{{item.fileName}}</p>
                    </div>
                  </div>

                </el-form-item>
              </el-col>
            </el-row>

          </el-form>
          <div slot="footer" class="dialog-footer" style="display: flex;justify-content: center">
            <el-button type="primary" @click="clickTaskView = false">取 消</el-button>
          </div>
        </el-dialog>
        <!--  阶段列表    -->
        <div class="group-list" v-if="groupList.length>0">
          <el-row>
            <el-col :span="22">
               <div class="template-collapse">
                <el-collapse v-model="activeNames" accordion>
                  <el-collapse-item class="template-collapse-item" v-for="(item, index) in groupList" :key="index" :name="index">
                    <span slot="title" class="collapse-title">
                      {{item.tgNo}}. {{item.tgName}} <span style="margin-left: 10px; color: #ccc">{{item.taskDefineList.length}}个任务</span>
                    </span>
                    <!--                    <span :class="{'taskhover': taskHover == id}" @mouseover="taskHover = id" @mouseout="taskHover = 10000" v-for="(task, id) in item.taskDefineList" style="display: block;margin: 10px 20px;cursor: pointer;" :key="id" @dblclick="clickTask(item.taskDefineList,id)">{{task.taskNoString}}.{{task.taskName}}</span>-->

  <!--                    <span :class="{'taskhover': taskHover == id}" @mouseover="taskHover = id" @mouseout="taskHover = 10000" v-for="(task, id) in item.taskDefineList" style="display: block;margin: 10px 20px;cursor: pointer;" :key="id" @dblclick="clickTask(item.taskDefineList,id)">{{task.taskNoString}}.{{task.taskName}}</span>-->
                      <div v-for="(task, i) in item.taskDefineList" :key="i" :name="i" class="" style="margin-left: 30px">
                        <el-collapse v-model="activeNames1" accordion>
                        <el-collapse-item :name="i">
                            <span  slot="title" class="collapse-title1">

                                <div class="" style="width: 100%;display: flex" @dblclick="clickTask(task)">
                                  <span class="" style="flex:1;cursor: pointer;">
                                    <span>{{task.taskNoString}}. {{task.taskName}}</span>
                                    <span class="task-num" style="margin-left: 10px">
                                      {{task.itemList&&task.itemList.length}}个检查项
<!--                                      <i class="el-icon-document" style="margin-left: 10px"></i>-->
                                    </span>
                                    <span class="task-num" style="margin-left: 5px">
                                      {{task.taskFileList&&task.taskFileList.length}}<i class="el-icon-document" style="margin-left: 5px"></i>
                                    </span>
                                  </span>
                                  <div style="">
                                    <i class="el-icon-view" @click.stop="clickTask(task)"></i>
<!--                                    <i class="el-icon-edit" ></i>-->
<!--                                    <i class="el-icon-delete" ></i>-->
<!--                                    <i class="el-icon-paperclip"></i>-->
                                  </div>

                                </div>
                          </span>

                          <div>
                                  <div style="margin-left: 30px; width: 100%;">
                                    <div v-for="(item, index_) in task.itemList" :key="index_" style="width: 100%; padding-left: 10px;display: flex;justify-content: left" :class="{'filehover': taskHover == index_ + item.itemName}" @mouseover="taskHover = index_ + item.itemName" @mouseout="taskHover = 10000">
                                      <div style="width: 70%;line-height: 40px;">
                                        <span>{{task.taskNoString + '.' + (index_ + 1)}}. {{item.itemName}}</span>
                                      </div>
                                      <div class="check-item-icon" style=" width: 30%;display: flex;justify-content: left;align-items: center">
<!--                                        <i v-show="taskHover == index_ + item.itemName" class="el-icon-view" @click="preView(item)"></i>-->
  <!--                                      <i v-show="taskHover == index_" class="el-icon-edit" style="" ></i>-->
  <!--                                      <i v-show="taskHover == index_" class="el-icon-delete" style="" ></i>-->
                                      </div>
                                    </div>
                                  </div>
  <!--                                <div v-for="(file,index_) in task.taskFileList" :index="index_">-->
  <!--                                  <span>{{file.fileName}}</span>-->
  <!--                                </div>-->
                                </div>

                        </el-collapse-item>
                      </el-collapse>
                      </div>

                  </el-collapse-item>
                </el-collapse>
              </div>
            </el-col>
          </el-row>

        </div>
      </div>

    </div>

<!--    <div class="template-doc" v-show="isClick==3"></div>-->


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
            <el-col :span="12" style="text-align: center">成员({{userList&&userList.length||0}})</el-col>
            <el-col :span="12" style="text-align: center">权限</el-col>
<!--            <el-col :span="8" style="text-align: center">操作</el-col>-->
          </el-row>
        </div>
        <div style="font-size: 14px" class="people-item" v-for="(item,index) in userList" :key="index">
          <el-row>
            <el-col :span="12" style="text-align: center">{{item.userFullName}}</el-col>
            <el-col :span="12" style="text-align: center">
              <span v-if="item.canDelete">拥用者</span>
              <span v-else-if="item.canEdit">可编辑</span>
              <span v-else-if="item.canUse">可使用</span>
              <span v-else>无权限</span>
            </el-col>
<!--            <el-col v-if="createUserId != item.tempUserId" class="people-handle" :span="8" style="text-align: center;cursor: pointer">-->
<!--              <span v-if="createUserId == $store.getters.userId">-->
<!--                <el-popover-->
<!--                  placement="top"-->
<!--                  width="200"-->
<!--                  trigger="click"-->
<!--                  >-->
<!--                  <template>-->
<!--                    <div style="display: flex; flex-direction: column;align-items: center">-->
<!--                      <el-switch-->
<!--                        style="margin-bottom: 10px"-->
<!--                        v-model="canEdit"-->
<!--                        :disabled="createUserId == item.tempUserId"-->
<!--                        active-text="可编辑"-->
<!--                        active-color="#13ce66"-->
<!--                        inactive-color="#ff4949"-->
<!--                        @change="(v)=>{changeEdit(item,v)}"-->
<!--                      >-->
<!--                      </el-switch>-->
<!--                      <el-switch-->
<!--                        v-model="canUse"-->
<!--                        active-text="可使用"-->
<!--                        disabled-->
<!--                        active-color="#13ce66"-->
<!--                        inactive-color="#ff4949"-->
<!--                        @change="(v)=>{changeUse(item,v)}"-->
<!--                      >-->
<!--                      </el-switch>-->
<!--                    </div>-->

<!--                    <i slot="reference" @click="editSharePeople(item)" class="el-icon-edit"></i>-->
<!--                  </template>-->

<!--                </el-popover>-->
<!--              </span>-->
<!--              <span style="margin-left: 10px" v-if="createUserId == $store.getters.userId" @click="deleteSharePeople(item)">-->
<!--                  <i class="el-icon-delete"></i>-->
<!--              </span>-->
<!--            </el-col>-->
          </el-row>
        </div>

      </div>
    </div>

    <!--    文档-->
    <div v-show="isClick==3">
      <el-row>
        <el-col :span="22">
          <el-tabs>
            <el-tab-pane label="文档"></el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
      <el-row>
      <el-col :span="22" >
        <div class="doc-tree" >
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
<!--                  <span v-show="data.fileName" class="el-icon-delete"></span>-->
                </span>
              </span>
            </el-tree>
          </div>
      </el-col>

    </el-row>
    </div>

    <div style="display: flex;justify-content: center" v-if="currentPage">
      <el-button type="primary" size="small" @click="$router.go(-1)" style="margin-top: 30px">返回</el-button>
    </div>


  </div>
</template>

<script>

  import {
    queryTaskList,
    queryTemplateFileList,
    queryTemplateList
  } from '@/api/templateManagement';
  import { doEditInOffice, getProgID } from '@/utils/editInOffice.js'
  export default {
    name: "template_management_view",
    data() {
      return {
        isOpen: false, // 是否全部展开
        taskHover:1000,
        userList: [],
        currentPage:true,
        editTaskData: [],
        clickTaskView: false,
        props: {
          label: 'label',
          children: 'children',
          isLeaf: false
        },

        isClick: 1,
        templateTitle: '',

        templateData: {
          teptName: '',
          caseTypeId: '',
          caseType: '',
          judgeRank: '',
          judgeRankName: ''
        },
        teptName: '',
        judgeRankList: [
          {name:'一审', value:1071},
          {name:'二审', value:1072},
          {name:'再审', value:1073},
          {name:'重审', value:1074},
          {name:'执行', value:1075},
          {name:'无', value:1368}
        ],
        teptId: 0,
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
        editGroupData: {},
        addGroups: {
          tgName: '',
          tgNo: '',
          taskDefineList: []
        },
        groupList: [],
        taskQueryList: [],
        activeNames: [],
        activeNames1: ['1'],
        taskInfo: {
          taskName: '',
          taskDesc: '',
          tgId: 0
        },
        caseType: '',
        judgeRankName: '',
        data: [],
        typeLists: [],
        type: ''
      }
    },
    beforeRouteEnter (to, from, next) {
      if(from.path == "/workbench/system_management/templateManagement" || from.path == "/"){
        // sessionStorage.setItem('tempView', '1')
        next()
      }else{
        next(vm => {
            vm.currentPage = false
        })
      }
    },
    computed: {
      typeList() {
        // console.log('23232323', this.$store.getters.caseTypeList)
        return this.$store.getters.caseTypeList
      }
    },
    created() {
      this.teptId = this.$route.params && this.$route.params.id;
      this.teptName = this.$route.query && this.$route.query.teptName
      this.type = this.$route.query && this.$route.query.type
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
                this.activeNames1.push(idx)
              })
            })
          })
        } else {
          for (let i = 0; i < this.activeNames.length; i++) {
            setTimeout(() => {
              this.activeNames.shift()
            })
          }
          for (let i = 0; i < this.activeNames1.length; i++) {
            setTimeout(() => {
              this.activeNames1.shift()
            })
          }
        }
      },
      clickTask(data) {
        this.clickTaskView = true
        this.editTaskData = data
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
      deepFlatten(arr) {
        let flatten = (arr)=> [].concat(...arr);
        return flatten(arr.map(x=>Array.isArray(x)? this.deepFlatten(x): x));
      },
      initFileList(a = '') {
        this.data = []
        queryTemplateFileList({teptId: this.teptId,tfileId: a}).then(res=>{
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
            // return resolve(this.data)
          })
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
        console.log(123,this.tfileId)
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
      clickIndex(a) {
        this.isClick = a
        // console.log(this.isClick)
      },
      queryTaskList(teptId) {
        queryTaskList({teptId}).then((res)=>{
          this.groupList = res.data
          this.groupList = this.groupList.filter(item=>!!item).sort((a, b) => {
            return a.tgNo - b.tgNo
          })
        })
      },
      queryTemplateList() {
        queryTemplateList({tempType: this.type,pageSize: 10000}).then(res=>{
          if(res.data&&res.data.find(item=>item.teptId == this.teptId)){
            this.templateData = res.data.find(item=>item.teptId == this.teptId)
            this.templateData.judgeRankName = this.judgeRankList.find(i=>i.value == this.templateData.judgeRank)&&this.judgeRankList.find(i=>i.value == this.templateData.judgeRank).name
            this.templateData.caseType = this.typeLists.find(i=>i.caseTypeId == this.templateData.caseTypeId)&&this.typeLists.find(i=>i.caseTypeId == this.templateData.caseTypeId).caseType
            this.templateTitle = this.templateData.teptName
            this.userList = this.templateData.userList
          }
        })
        // queryTemplateList({teptName: this.teptName,tempType: this.type}).then(res=>{
        //   this.templateData = res.data[0]
        //   this.templateData.judgeRankName = this.judgeRankList.find(i=>i.value == this.templateData.judgeRank)&&this.judgeRankList.find(i=>i.value == this.templateData.judgeRank).name
        //   this.templateData.caseType = this.typeLists.find(i=>i.caseTypeId == this.templateData.caseTypeId)&&this.typeLists.find(i=>i.caseTypeId == this.templateData.caseTypeId).caseType
        //   this.templateTitle = this.templateData.teptName
        // })
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
          margin-left: 17px;
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
  .tabs {
    display: flex;
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
      justify-content: center;
      padding-left: 100px;
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
  .doc-tree {
    max-height: 500px;
    overflow-y: auto;
  }
  .some-click {
    position: absolute;
    margin-right: 30%;
    right: 0;
    >>>.el-icon-view{
      margin-right: 15px;
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
            width: 75%;
          }
        }
      }
      /*.bott{*/
      /*  border-bottom: 1px solid #ccc;*/
      /*}*/
    }
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
  .taskhover, .checkhover, .filehover {
    background-color: #f1f1f1;
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
</style>
