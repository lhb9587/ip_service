<template>
  <div>
    <el-dialog
      title="复制模板"
      :visible.sync="copyTeptView"
      width="40%"
      :before-close="closeCopyView"
      >
      <el-row class="dialog-footer" style="margin-bottom: 30px">
        <el-col :span="24" class="dialog-footer">
          <div class="all-user" style="width: 60%">
            <div v-if="type == 'project'" style="display: flex;justify-content: center;align-items: center">
              <div style="width: 80px;display: flex;flex-shrink: 0">项目名称:</div>
              <div style="width: 100%;">{{prjInfo}}</div>
<!--              <el-autocomplete-->
<!--                ref="autocomplete"-->
<!--                class="inline-input"-->
<!--                v-model="prjInfo"-->
<!--                style="width: 100%;"-->
<!--                multiple-->
<!--                filterable-->
<!--                clearable-->
<!--                :fetch-suggestions="queryPrjList"-->
<!--                @select="choosePrj"-->
<!--                placeholder="请输入内容"-->
<!--                :popper-append-to-body="false"-->
<!--                :trigger-on-focus="false"-->
<!--              >-->
<!--                <template slot-scope="{ item }" style="">-->
<!--                  <div class="tables" style="display: flex;width: 100%;" @contextmenu.prevent="openMenu($event,item)">-->
<!--                    <el-tooltip  :content="item.prjName" placement="top" effect="light">-->
<!--                      <div style="flex: 1;" class="overflow-hidden" :class="{'table-head': item.prjName == '项目名称'}">{{item.prjName}}</div>-->
<!--                    </el-tooltip>-->
<!--&lt;!&ndash;                    <el-tooltip  :content="item.createUserName" placement="top" effect="light">&ndash;&gt;-->
<!--                      <div style="flex: 1;" class="overflow-hidden" :class="{'table-head': item.createUserName == '创建人'}">{{item.createUserName}}</div>-->
<!--&lt;!&ndash;                    </el-tooltip>&ndash;&gt;-->
<!--&lt;!&ndash;                    <el-tooltip  :content="item.executorNames" placement="top" effect="light">&ndash;&gt;-->
<!--                      <div style="flex: 1;" class="overflow-hidden" :class="{'table-head': item.executorNames == '执行人'}">{{item.executorNames}}</div>-->
<!--&lt;!&ndash;                    </el-tooltip>&ndash;&gt;-->
<!--&lt;!&ndash;                    <el-tooltip  :content="item.projectStatus" placement="top" effect="light">&ndash;&gt;-->
<!--                      <div style="flex: 1;" class="overflow-hidden" :class="{'table-head': item.projectStatus == '状态'}">{{item.projectStatus}}</div>-->
<!--&lt;!&ndash;                    </el-tooltip>&ndash;&gt;-->
<!--                  </div>-->
<!--&lt;!&ndash;      <!-              <div class="name">{{ item.caseId }}</div>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;      <!-              <span class="addr">{{ item.address }}</span>&ndash;&gt;&ndash;&gt;-->
<!--                </template>-->
<!--              </el-autocomplete>-->
            </div>

          </div>

        </el-col>
      </el-row>

      <el-row v-if="hasPrj||type == 'case'" class="dialog-footer" style="margin-bottom: 30px">
        <el-col :span="24" class="dialog-footer">
          <div class="all-user" style="width: 60%">
            <div style="display: flex;justify-content: center;align-items: center">
              <div style="width: 80px;display: flex;flex-shrink: 0">模板名称:</div>
              <el-input v-model="copyTeptName" clearable placeholder="请输入内容"></el-input>
            </div>

          </div>

        </el-col>
      </el-row>

      <el-row class="dialog-footer" style="margin-bottom: 30px">
        <el-col :span="24" class="dialog-footer">
          <div class="all-user" style="width: 60%">
            <div style="display: flex;align-items: center">
              <div style="width: 95px;display: flex;flex-shrink: 0">复制数据:</div>
              <el-checkbox-group v-model="content">
                <el-checkbox label="1">任务/任务组</el-checkbox>
                <el-checkbox label="2">文档</el-checkbox>
              </el-checkbox-group>
            </div>

          </div>

        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeCopyView" size="small">取 消</el-button>
        <el-button type="primary" @click="createTemplateByPrj" size="small">确 定</el-button>
      </span>
    </el-dialog>

<!--    右键菜单-->
    <div>
      <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li @click="clickFocus">详情</li>
<!--      <li @click="handleDelete(rightClickItem)">删除</li>-->
<!--      <li @click="handleDownloadFile(rightClickItem)" v-if="rightClickItem.fileType!=99">下载</li>-->
<!--      <li @click="handlePreviewFile(rightClickItem)" v-if="rightClickItem.fileType!=99">预览</li>-->
<!--      <li @click="handleUpdate(rightClickItem)">编辑</li>-->
<!--      <li>内容</li>-->
    </ul>
    </div>

<!--    非弹框组件-->
    <div v-if="noDialog">
      <el-form label-width="80px">
        <el-row class="" style="">
          <el-col :span="24">
            <el-form-item label="项目名称:">
              <div class="all-user" style="">
                <div style="">
<!--                <div style="width: 80px;display: flex;flex-shrink: 0">项目名称:</div>-->
                <el-autocomplete
                  ref="autocomplete"
                  class="inline-input"
                  v-model="prjInfo"
                  style=";"
                  multiple
                  filterable
                  clearable
                  :fetch-suggestions="queryPrjList"
                  @select="choosePrj"
                  placeholder="请输入内容"
                  :popper-append-to-body="false"
                  :trigger-on-focus="false"
                >
                  <template slot-scope="{ item }" style="">
                    <div class="tables" style="display: flex;width: 100%;" @contextmenu.prevent="openMenu($event,item)">
                      <el-tooltip  :content="item.prjName" placement="top" effect="light">
                        <div style="flex: 1;" class="overflow-hidden" :class="{'table-head': item.prjName == '项目名称'}">{{item.prjName}}</div>
                      </el-tooltip>
  <!--                    <el-tooltip  :content="item.createUserName" placement="top" effect="light">-->
                        <div style="flex: 1;" class="overflow-hidden" :class="{'table-head': item.createUserName == '创建人'}">{{item.createUserName}}</div>
  <!--                    </el-tooltip>-->
  <!--                    <el-tooltip  :content="item.executorNames" placement="top" effect="light">-->
                        <div style="flex: 1;" class="overflow-hidden" :class="{'table-head': item.executorNames == '执行人'}">{{item.executorNames}}</div>
  <!--                    </el-tooltip>-->
  <!--                    <el-tooltip  :content="item.projectStatus" placement="top" effect="light">-->
                        <div style="flex: 1;" class="overflow-hidden" :class="{'table-head': item.projectStatus == '状态'}">{{item.projectStatus}}</div>
  <!--                    </el-tooltip>-->
                    </div>
  <!--      <!-              <div class="name">{{ item.caseId }}</div>&ndash;&gt;-->
  <!--      <!-              <span class="addr">{{ item.address }}</span>&ndash;&gt;-->
                  </template>
                </el-autocomplete>
              </div>

            </div>
            </el-form-item>


          </el-col>
        </el-row>

        <el-row v-if="hasPrj">
          <el-col :span="24">
            <el-form-item label="模板名称">
              <div class="all-user" style="width: 200px;">
                <div style="">
                  <el-input v-model="copyTeptName" clearable placeholder="请输入内容"></el-input>
                </div>

              </div>
            </el-form-item>


          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="复制数据">
              <div class="all-user" style="">
              <div style="">
                <el-checkbox-group v-model="content">
                  <el-checkbox label="1">任务/任务组</el-checkbox>
                  <el-checkbox label="2">文档</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-button size="small" type="primary" style="margin-left: 80px" @click="createTemplateByPrj">创建模板</el-button>
            <el-button type="primary" size="small" @click="$router.go(-1)">返回</el-button>
          </el-col>
        </el-row>
      </el-form>

    </div>
  </div>
</template>

<script>
  import {queryProjectList,createTemplateByPrj} from '@/api/caseList'
  import Bus from '@/utils/Bus'
  export default {
    name: "copyTemplate",
    props:{
      caseTypeStr:'',
      // taskgroupList:{},
      noDialog:{
        type:Boolean,
        default:false
      },
      agentNum:'',
      caseId:'',
      type:{
        type:String,
        default:'project'
      },
      copyTeptView:{
        type: Boolean,
        default:false
      },
      cPrjName:'',
      cProjectId: ''
    },
    data(){
      return{
        visible: false,
        top: 0,
        left: 0,
        prjInfo: '',
        copyTeptName:'',
        copyTeptName1:'',
        content: ['1'],
        hasPrj:false,
        projectId: '',
        detailPrjId: ''
      }
    },
    watch: {
      caseTypeStr:{
        handler(n){
          this.copyTeptName = n
          this.copyTeptName1 = n
        },
        immediate:true
      },
      cProjectId(n){
        this.projectId = n
        // alert('1')
      },
      cPrjName(n){
        this.prjInfo = n
        this.copyTeptName = n
        this.copyTeptName1 = n
        // alert('2')
      },
      prjInfo(n,o){
        if(!n){
          this.hasPrj = false
          // this.projectId = ''
          this.copyTeptName = ''
          // this.copyTeptName1 = ''
        }else{
          this.hasPrj = true
        }
      },
      visible(value) {
        if (value) {
          document.body.addEventListener('click', this.closeMenu)
        } else {
          document.body.removeEventListener('click', this.closeMenu)
        }
      }
    },
    methods:{
      clickFocus(){
        this.$refs.autocomplete.focus()
        window.open(`/#/workbench/ResourceView/project?projectId=${this.detailPrjId}`)
        // this.$router.push(`/workbench/ResourceView/project?${this.detailPrjId}`)
      },
      openMenu(e, item) {
        if(item.prjName == '项目名称'){
          return
        }
        // this.rightClickItem = item;
        this.detailPrjId = item.projectId
        let x = e.clientX;
        let y = e.clientY;
        this.top = y;
        this.left = x;
        this.visible = true;
      },
      closeMenu() {
        this.visible = false;
      },
      createTemplateByPrj(){
        if(this.type == 'project'){
          if(!this.projectId){
            this.$message.error('项目名称不存在')
            return
          }
          if(!this.copyTeptName){
            this.$message.error('请输入模板名称')
            return
          }
          if(!this.content.length){
            this.$message.error('请选择需要复制的数据')
            return
          }
          if(this.copyTeptName == this.copyTeptName1){
              // this.copyTeptName = this.copyTeptName + new Date().getTime()
            }
          createTemplateByPrj(
            {
              projectId:this.projectId,
              teptName: this.copyTeptName,
              content:this.content
            }
          ).then(()=>{
            this.$message.success('创建模板成功!')
            Bus.$emit('updateTemplate')
            this.closeCopyView()
          })
        }else{
          if(!this.copyTeptName){
            this.$message.error('请输入模板名称')
            return
          }
          if(!this.content.length){
            this.$message.error('请选择需要复制的数据')
            return
          }
          // if(this.taskgroupList.length == 0){
          //   this.$message.error('该案件没有任务组')
          //   return
          // }
          createTemplateByPrj(
            {
              caseId:this.caseId,
              teptName: this.copyTeptName,
              content:this.content
            }
          ).then(()=>{
            this.$message.success('创建模板成功!')
            // Bus.$emit('updateTemplate')
            this.closeCopyView()
          })
        }

      },
      closeCopyView(){
        // this.hasPrj = false
        // this.projectId = ''
        this.copyTeptName = this.copyTeptName1
        // this.copyTeptName1 = ''
        this.prjInfo = this.copyTeptName1
        // this.content = ['1']
        this.$emit('closeCopyView')
      },
      choosePrj(item){
        if(item.prjName == '项目名称'){
          return
        }else{
          this.hasPrj = true
          this.copyTeptName = item.prjName
          this.copyTeptName1 = item.prjName
          this.prjInfo = item.prjName
          this.projectId = item.projectId
        }
      },
      queryPrjList(queryString, cb){
        this.projectId = ''
        if(!queryString){
          return
        }
        queryProjectList({prjName:queryString,pageSize:100}).then(res=>{
          if(res.data&&res.data.length == 1){
            this.hasPrj = true
            this.copyTeptName = res.data[0].prjName
            this.copyTeptName1 = res.data[0].prjName
            this.prjInfo = res.data[0].prjName
            this.projectId = res.data[0].projectId
          }
          res.data.unshift({'prjName': '项目名称','createUserName': '创建人','executorNames': '执行人','projectStatus':'状态'})
          cb(res.data)
        })
      },
      queryPrj(){

      }
    }
  }
</script>

<style lang="scss" scoped>
  .dialog-footer{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  >>> .el-autocomplete-suggestion{
    width: 500px!important;
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

.contextmenu li:hover {
  background-color: rgb(3, 125, 243);;
  color: white;
}
</style>
