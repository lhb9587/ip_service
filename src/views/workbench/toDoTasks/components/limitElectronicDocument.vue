<template>
  <div class="ElectronWrap" style="padding: 0px 0px;overflow: hidden">

    <Tabs  ref="tagg" v-model='collapseactiveNames' @tab-click='tabclick' type="border-card">

      <el-tab-pane v-for="(item,key) in tagArr" :key="key" :name='item.name' :label="item.label">
        <timeLimit v-if="item.name=='2'" :caseDetail='true' :tltId="tltId" ></timeLimit>
        <div v-else-if="item.name=='3'">
<!--          <el-button v-if="isEdit" style="float: right" @click="selectionState=true" type="primary" size="medium">下载</el-button>-->
<!--          <el-button v-if="isEdit" style="float: right;margin-right: 20px" @click="dialogVisible=true" type="primary" size="medium">新建</el-button>-->
          <el-collapse class="materialModule" v-model="activeNames">
            <el-collapse-item v-for="(item,index) in materialList" :key="index" :name="index">
              <template slot="title">
                <p>
                  <!-- <img style="vertical-align: middle;width:25px;margin-right:5px;margin-left: -25px" :src="require(`@/assets/电子档案图标/${item.typeName}.png`)" alt=""> -->
                  <span>{{item.docTypeName}}</span></p>
              </template>
              <el-table @row-dblclick="(row)=>rowDblclick(row,item)" @header-dragend="colChange" :data="item.evenList" border size='mini' style="width: 100%" @select="handleSelectionChange"
                        @select-all="(val)=>handleSelectionAll(val,item.childList)">
                <el-table-column type="selection" :width="colWidth[0]" class="selection" v-if="selectionState">
                </el-table-column>
                <el-table-column type="index" :width="colWidth[1]" label="序号" align="left">
                  <template slot-scope="scope">
                    <span>{{scope.$index+1}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="typeName" label="文件/事件类型" :width="colWidth[2]" align="left">
                </el-table-column>
                <el-table-column prop="eventName" label="文件/事件名称" :width="colWidth[3]" align="left">
                </el-table-column>
                <el-table-column label="附件名称" :width="colWidth[4]" align="left">
                  <template slot-scope="scope">
                    <div style="text-align:left" v-for="(items,key) in scope.row.materialList" :key="key">
                      <el-popover
                        v-if="items.sameList&&items.sameList.length>1"
                        placement="top-start"
                        trigger="hover"
                      >
                        <p style="text-align:left" v-for="(itm,key) in items.sameList" :key="key">
                          <a  style="color:#409eff"
                              @click="doEditInOffice(itm, item.docTypeName)"
                          >{{itm.materialName}}&nbsp;{{itm.createDate}} <i class="el-icon-circle-close"  v-show="getPermission(item.docTypeName ,scope.row.creater)" @click.stop="deleteRow(itm)"></i>
                          </a>
                        </p>
                        <a slot="reference" style="color:#409eff"
                           @click="doEditInOffice(items, item.docTypeName)"
                        >{{items.materialName}}
                        </a>
                      </el-popover>
                      <a v-else style="color:#409eff"
                         @click="doEditInOffice(items, item.docTypeName)"
                      >{{items.materialName}}
                      </a>
                      <el-button type="text" class="el-icon-view" @click="preView(items)"></el-button>
                    </div>
                  </template>
                </el-table-column>

                <el-table-column align="left" prop="creater" :width="colWidth[5]" label="上传人">
                </el-table-column>
                <el-table-column align="left" prop="createDate" :width="colWidth[6]" label="上传时间">
                </el-table-column>
                <el-table-column label="操作" align="left" :width="colWidth[7]" class-name="small-padding fixed-width">
                  <template slot-scope="{ row }">
                    <el-button style="color: #FB9608;font-weight: 700" type="text"  v-show="row.eventRecordId||row.insId&&getEditPermission(item.docTypeName ,row.creater)" size="small"
                               @click="(val)=>editFile(row,item)">编辑
                    </el-button>
                    <el-popover
                      placement="top"
                      width="160"
                      v-if='getPermission(item.docTypeName ,row.creater)'
                      v-model="row.visible">
                      <p>确定要删除吗？</p>
                      <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="row.visible = false">取消</el-button>
                        <el-button type="primary" size="mini" @click="deleteRow(row)">确定</el-button>
                      </div>
                      <el-button   size="small" style="color: #FB9608;font-weight: 700" type="text" slot="reference">删除</el-button>
                    </el-popover>
                    <!--                    <el-button style="color: #FB9608;font-weight: 700" type="text" v-if='isEdit' v-show="row.creater==$store.state.user.name" size="small"-->
                    <!--                      @click="deleteRow(row)">删除</el-button>-->
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>
          <div class="button_wrap" v-if="selectionState">
            <el-button class="exactButton" style="margin-right: 20px" @click="selectionState=false">取消</el-button>
            <el-button class="exactButton" type="primary" @click="downloadMaterial">确定</el-button>
          </div>
        </div>
<!--        <div v-else-if="item.name=='1'">-->
<!--          <el-timeline >-->
<!--            <el-timeline-item-->
<!--              v-for="(activity, index) in myCaseEvolve"-->
<!--              :key="index"-->
<!--              :type="activity.stageName"-->
<!--              :color="getColor(activity.id,index)"-->
<!--              :size="'large'">-->
<!--              <h4 style="color: #303133;font-weight: normal">{{activity.stageName}}</h4>-->
<!--              <p style="margin: 5px 0;color: #909399;-->
<!--    line-height: 1;-->
<!--    font-size: 12px" v-for="taskRecord in activity.taskRecordArray">-->
<!--                <span class="taskRecord_span">{{taskRecord.createTime}}</span>-->
<!--                <span class="taskRecord_span">{{taskRecord.opertorName}}</span>-->
<!--                <span class="taskRecord_span">{{taskRecord.proceeName}}</span>-->
<!--                <span class="taskRecord_span">{{taskRecord.memo}}</span>-->
<!--              </p>-->
<!--            </el-timeline-item>-->
<!--          </el-timeline>-->
<!--          &lt;!&ndash;          <div class="step-div">&ndash;&gt;-->
<!--          &lt;!&ndash;            <el-steps :active="stepActive" finish-status="success" process-status="finish" >&ndash;&gt;-->
<!--          &lt;!&ndash;              <el-step :key="key" :title="item.stageName" @click.native="getjzFilelist(item.id)" v-for="(item,key) in myCaseEvolve" />&ndash;&gt;-->
<!--          &lt;!&ndash;            </el-steps>&ndash;&gt;-->
<!--          &lt;!&ndash;          </div>&ndash;&gt;-->
<!--          &lt;!&ndash;          <el-table v-if="collapseactiveNames=='1'" :data="taskRecordArray" border current-row-key empty-text="暂无数据" fit highlight-current-row size="mini" style="width: 100%;">&ndash;&gt;-->
<!--          &lt;!&ndash;            <el-table-column align="left" label="序号" type="index" width="50" />&ndash;&gt;-->
<!--          &lt;!&ndash;            <el-table-column align="left" label="阶段" width>&ndash;&gt;-->
<!--          &lt;!&ndash;              <template slot-scope="scope">&ndash;&gt;-->
<!--          &lt;!&ndash;                <span>{{ scope.row.stageName }}</span>&ndash;&gt;-->
<!--          &lt;!&ndash;              </template>&ndash;&gt;-->
<!--          &lt;!&ndash;            </el-table-column>&ndash;&gt;-->
<!--          &lt;!&ndash;            <el-table-column align="left" label="最新进展" width>&ndash;&gt;-->
<!--          &lt;!&ndash;              <template slot-scope="scope">&ndash;&gt;-->
<!--          &lt;!&ndash;                <span>{{ scope.row.proceeName }}</span>&ndash;&gt;-->
<!--          &lt;!&ndash;              </template>&ndash;&gt;-->
<!--          &lt;!&ndash;            </el-table-column>&ndash;&gt;-->
<!--          &lt;!&ndash;            <el-table-column align="left" label="上一步骤处理人" width>&ndash;&gt;-->
<!--          &lt;!&ndash;              <template slot-scope="scope">&ndash;&gt;-->
<!--          &lt;!&ndash;                <span>{{ scope.row.opertorName }}</span>&ndash;&gt;-->
<!--          &lt;!&ndash;              </template>&ndash;&gt;-->
<!--          &lt;!&ndash;            </el-table-column>&ndash;&gt;-->
<!--          &lt;!&ndash;            <el-table-column align="left" label="处理时间" width>&ndash;&gt;-->
<!--          &lt;!&ndash;              <template slot-scope="scope">&ndash;&gt;-->
<!--          &lt;!&ndash;                <span>{{ scope.row.createTime }}</span>&ndash;&gt;-->
<!--          &lt;!&ndash;              </template>&ndash;&gt;-->
<!--          &lt;!&ndash;            </el-table-column>&ndash;&gt;-->
<!--          &lt;!&ndash;            <el-table-column align="left" label="备注" width>&ndash;&gt;-->
<!--          &lt;!&ndash;              <template slot-scope="scope">&ndash;&gt;-->
<!--          &lt;!&ndash;                <span>{{ scope.row.memo }}</span>&ndash;&gt;-->
<!--          &lt;!&ndash;              </template>&ndash;&gt;-->
<!--          &lt;!&ndash;            </el-table-column>&ndash;&gt;-->
<!--          &lt;!&ndash;          </el-table>&ndash;&gt;-->
<!--        </div>-->
      </el-tab-pane>

    </Tabs>
<!--    <el-popover-->
<!--      placement="top-start"-->
<!--      width="200"-->
<!--      trigger="click"-->
<!--      v-if="isEdit&&collapseactiveNames==1"-->
<!--    >-->
<!--      <el-form>-->
<!--        <el-form-item label="更新后案件阶段:" >-->
<!--          <el-select  default-first-option v-model="caseStageId" placeholder="请选择" filterable-->
<!--                      clearable >-->
<!--            <el-option-->
<!--              v-for="itm in getCaseStageList"-->
<!--              :key="itm.id"-->
<!--              :label="itm.stageName"-->
<!--              :value="itm.id">-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--      <el-button type="primary" size="mini" @click="updateCaseEvolve">确定</el-button>-->
<!--      <div slot="reference" class="updateCaseEvolve"  >更新案件进展</div>-->
<!--    </el-popover>-->

<!--    <el-dialog title="提示" :visible.sync="dialogVisible" width="70%" :before-close="handleClose">-->
<!--      <UploadMetailDetail v-if="dialogVisible" :pageType="pageType" :eventRecordData="curmaterialId" :evenItem='evenItem' :curCaseId="curCaseId" :custId="custId" @changeFalse="changeFalse"></UploadMetailDetail>-->

<!--    </el-dialog>-->
    <litigationOfficial  v-if="communicationState&&taskType!=2" :taskType="taskType" :officialCommunicationState="communicationState" officialCommunicationType="edit" :multipleSelection="multipleSelectionCaseArray" @closeThisPage="changeFalse"/>
    <detail-official-communication v-if="communicationState&&taskType!=2" :taskType="taskType" @closeThisPage="changeFalse" :dialogVisible="communicationState" :queryInfo="queryInfo" ></detail-official-communication>
    <!--    <detail-official-communication v-if="communicationState" @closeThisPage="changeFalse" :dialogVisible="communicationState" :queryInfo="queryInfo" ></detail-official-communication>-->
  </div>
</template>

<script>
  import DetailOfficialCommunication from '@/views/workbench/case/officialCommunication/detailOfficialCommunication';
  import {
    queryFileByTltId,
    delCaseMaterial,
    downloadMaterial,
    changeCaseStage,
    getCaseStage,
    queryCaseProgress,
    getCaseByTmFileId,
    deleteDoc,
    recordOnlienEdit
  } from "@/api/caseList";
  import { doEditInOffice, getProgID } from '@/utils/editInOffice.js'
  import {
    queryCaseEventListUrl,
    addCaseEventUrl,
    deleteCaseEventUrl,
    oneKeyZipUrl,
    delCaseMaterialUrl
  } from "@/api/caseDetail";
  import Sortable from "sortablejs";
  import litigationOfficial from '@/views/workbench/case/officialCommunication/components/litigationOfficial.vue'
  export default {
    props: {
      custId: {},
      tltId:{},
      caseEvolve: {},
      agentNum: {},
      isEdit: {
        type: Boolean,
        default: true
      },
      taskType:{
        default:1
      }
    },
    name: "limitElectronicDocument",
    mounted() {
      var el = this.$refs.tagg.$children[0].$el.children[0].children[0];
      var self = this;
      var sortable = Sortable.create(el, {
        onEnd(evt) {
          const tempIndex = self.tagArr.splice(evt.oldIndex, 1)[0];
          self.tagArr.splice(evt.newIndex, 0, tempIndex);
          // self.collapseactiveNames = tempIndex;
          localStorage.setItem("tagArr", JSON.stringify(self.tagArr));
        }
      });
    },
    data() {
      return {
        myCaseEvolve:[],
        tagArr: JSON.parse(localStorage.getItem("tagArr"))
          ? JSON.parse(localStorage.getItem("tagArr"))
          : [
            { name: "2", label: "时限" },
            { name: "3", label: "电子文档" },
            // { name: "1", label: "详情进展" }
          ],
        stepActive: 0,
        jzNub: "",
        collapseactiveNames: JSON.parse(localStorage.getItem("collitem"))
          ? JSON.parse(localStorage.getItem("collitem"))
          : "2",
        materialList: [],
        dialogVisible: false,
        curmaterialId: "",
        evenItem: {},
        selectionState: false,
        multipleSelection: [],
        activeNames: [],
        taskRecordArray: [],
        materialArray: [],
        clickType: false,
        colWidth: JSON.parse(localStorage.getItem("colwidth"))
          ? JSON.parse(localStorage.getItem("colwidth"))
          : [30, 50, 180, 180, 300, "", "", ""],
        getCaseStageList:[],
        caseStageId:'',
        communicationState:false,
        queryInfo:{},
        multipleSelectionCaseArray:[],
        pageType:'edit',
      };
    },
    watch: {
      tltId:{
        handler(n,o){
          if(n){
            this.queryFileByTltId(n);
          }
        },
        immediate: true
      }
    },
    methods: {
      getPermission(type,creater){
        if(type=='官方通知'){
          if(this.$store.getters.permissions.includes(241)){
            return true
          }else {
            return  false
          }
        }else {
          if(this.$store.getters.permissions.includes(241)||creater==this.$store.state.user.name){
            return true
          }else {
            return false
          }
        }
      },
      getEditPermission(type,creater){
        if(type=='官方通知'){
          if(this.$store.getters.permissions.includes(195)||creater==this.$store.state.user.name){
            return true
          }else {
            return false
          }
        }else {
          if(this.$store.getters.permissions.includes(241)||creater==this.$store.state.user.name){
            return true
          }else {
            return false
          }
        }
      },
      rowDblclick(row,item){
        if(row.eventRecordId||row.insId){
          if(item.docTypeName=='官方通知'&&row.insId){
            if(this.taskType&&this.taskType!=1){
              getCaseByTmFileId({ tmFileId: row.insId ,taskType: this.taskType}).then(res=>{
                this.queryInfo={
                  caseIds: res.data.map(itm=>itm.caseId),
                  pageId: 106,
                  pageType:'4',
                  // materialId: row.materialId,
                  // mailingTypeId: row.mailingTypeId,
                  insId: row.insId,
                  info: res.data
                }
                res.data.forEach(itm=>itm.insId=row.insId)
                this.multipleSelectionCaseArray=res.data
                this.communicationState = true
              })
            }else {
              getCaseByTmFileId({ tmFileId: row.insId }).then(res=>{
                this.queryInfo={
                  caseIds: res.data.map(itm=>itm.caseId),
                  pageId: 106,
                  pageType:'4',
                  // materialId: row.materialId,
                  // mailingTypeId: row.mailingTypeId,
                  insId: row.insId,
                  info: res.data
                }
                // res.data.forEach(itm=>itm.insId=row.insId)
                // this.multipleSelectionCaseArray=res.data
                this.communicationState = true
              })
            }

          } else {
            this.pageType='view'
            this.curmaterialId = row;
            this.evenItem = item;
            this.dialogVisible = true;

          }
        }
      },
      getColor(id,index){
        // if(this.myCaseEvolve.indexOf(this.myCaseEvolve.find(item=>item.id==this.jzNub))===index){
        //     return '#52a0f5'
        // }
        if(this.myCaseEvolve.indexOf(this.myCaseEvolve.find(item=>item.id==this.jzNub))<=index){
          return 'green'
        }
        if(this.myCaseEvolve.indexOf(this.myCaseEvolve.find(item=>item.id==this.jzNub))>index){
          return 'gray'
        }
      },
      colChange(newWidth, oldWidth, column, event) {
        this.colWidth[this.colWidth.indexOf(oldWidth)] = newWidth;
        localStorage.setItem("colwidth", JSON.stringify(this.colWidth));
      },
      doEditInOffice(data, docTypeName){
        // console.log("====------")
        // console.log(data,docTypeName)
        const url = data.address
        if(docTypeName == "账单费用"&&!this.$store.getters.permissions.includes(163)){
          this.preView(data)
          return
        }
        // if(docTypeName !== "账单费用"){
        if (getProgID(url)) {
          recordOnlienEdit({materialId: data.materialId})
          doEditInOffice(url, getProgID(url))
        } else if(['pdf','jpg','png'].some(item=>url.replace(/.+\./,"").toLocaleLowerCase()==item)){
          window.open(`/ipdoc${url}`.replace(/[+]/g,'%2B'))
          // window.open(`#/preView?address=ipdoc${url}`.replace(/[+]/g,'%2B'))
        } else {
          this.downLoad(data)
        }

        // }else{
        //   if(this.$store.getters.permissions.includes(163)){
        //     if (getProgID(url)) {
        //     doEditInOffice(url, getProgID(url))
        //     } else if(['pdf','jpg','png'].some(item=>url.replace(/.+\./,"").toLocaleLowerCase()==item)){
        //       window.open(`/ipdoc${url}`.replace(/[+]/g,'%2B'))
        //       // window.open(`#/preView?address=ipdoc${url}`.replace(/[+]/g,'%2B'))
        //     } else {
        //     let notify = this.$notify.success({
        //         // title: 'Info',
        //         message: '正在下载',
        //         showClose: false,
        //         duration: 0
        //       });
        //     const downData={
        //       url:`ipdoc${url}`,
        //       success(){
        //         notify.close()
        //       }
        //     }
        //     if(data.mailId){
        //       downData.downLoad=data.materialName
        //     }
        //       this.$commonUtils.downLoadAll(downData)
        //     }
        //   }else{
        //     return false
        //   }
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
        //
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
      tabclick(n) {
        // this.clickType = true;
        localStorage.setItem("collitem", JSON.stringify(n.name));
      },
      complay() {
        this.queryFileByTltId(this.tltId);
        if(this.myCaseEvolve.length==1&&this.myCaseEvolve[0]==null){
          this.myCaseEvolve=[]
          return
        }
        if (
          this.myCaseEvolve.length &&
          this.myCaseEvolve[this.myCaseEvolve.length - 1].id
        ) {
          this.jzNub = this.myCaseEvolve;
        } else {
          this.jzNub = this.myCaseEvolve.pop();
        }
        if (this.jzNub > 0) {
          this.myCaseEvolve.forEach((element, index) => {
            if (element.id == this.jzNub) {
              this.materialArray = element.materialArray;
              this.taskRecordArray = element.taskRecordArray;
              this.stepActive = index;
              this.getjzFilelist(index)
              return;
            }
          });
          this.myCaseEvolve.reverse()
        }
      },
      handleSelectionAll(val, childList) {
        val = val
          .map(item => item.materialList)
          .map(item => {
            return item.map(item => item.materialId);
          });

        val = this.flattenDeep(val);
        this.multipleSelection = this.multipleSelection.concat(val);
        this.multipleSelection = Array.from(new Set(this.multipleSelection));
      },
      handleSelectionChange(val, row) {
        val = val
          .map(item => item.materialList)
          .map(item => {
            return item.map(item => item.materialId);
          });

        val = this.flattenDeep(val);
        this.multipleSelection = this.multipleSelection.concat(val);
        this.multipleSelection = Array.from(new Set(this.multipleSelection));
      },
      flattenDeep(arr) {
        return Array.isArray(arr)
          ? arr.reduce(
            (a, b) => [...this.flattenDeep(a), ...this.flattenDeep(b)],
            []
          )
          : [arr];
      },
      downloadMaterial() {
        downloadMaterial({
          materialIdList: this.multipleSelection
        }).then(res => {
          var a = document.createElement("a");
          a.setAttribute("href", "ipdoc" + res.data);
          a.setAttribute("id", "startTelMedicine");
          a.setAttribute("downLoad", this.agentNum);
          if (document.getElementById("startTelMedicine")) {
            document.body.removeChild(
              document.getElementById("startTelMedicine")
            );
          }
          document.body.appendChild(a);
          a.click();
        });
      },
      queryFileByTltId(tltId) {
        queryFileByTltId({ tltId }).then(res => {
          this.materialList = res.data;
          this.activeNames = Array.from(new Array(res.data.length).keys()).slice(
            0
          );
        });
      },
      deleteRow(row) {
        if(row.eventRecordId){
          deleteCaseEventUrl({
            eventRecordId: row.eventRecordId
          }).then(res => {
            this.queryFileByTltId(this.tltId);
          });
        } else {
          if(row.insId){
            deleteDoc({
              docList: [{ tmFileId: row.insId }],
              taskType:this.taskType
            }).then(res => {
              this.queryFileByTltId(this.tltId);
            });
          }else {
            if(row.materialList&&row.materialList.map(item=>item.materialId).filter(item=>!!item).length){
              delCaseMaterialUrl({
                caseIdArray: this.tltId,
                materialIdList:row.materialList.map(item=>item.materialId)
              }).then(res => {
                this.queryFileByTltId(this.tltId);
              })
            }
            if(row.materialList&&row.materialList.map(item=>item.mailId).filter(item=>!!item).length){
              delCaseMaterialUrl({
                caseIdArray: this.tltId,
                mailIdList:row.materialList.map(item=>item.mailId)
              }).then(res => {
                this.queryFileByTltId(this.tltId);
              })
            }
            if(row.materialId){
              delCaseMaterialUrl({
                caseIdArray: this.tltId,
                materialIdList:row.materialId
              }).then(res => {
                this.queryFileByTltId(this.tltId);
              })
            }
          }
        }
      },
      handleClose(done) {
        return;
      },
      editFile(row, item) {
        if(item.docTypeName=='官方通知'&&row.insId){
          if(this.taskType&&this.taskType!=1){
            getCaseByTmFileId({ tmFileId: row.insId ,taskType: this.taskType}).then(res=>{
              this.queryInfo={
                caseIds: res.data.map(itm=>itm.caseId),
                pageId: 106,
                pageType:'3',
                // materialId: row.materialId,
                // mailingTypeId: row.mailingTypeId,
                insId: row.insId,
                info: res.data
              }
              res.data.forEach(itm=>itm.insId=row.insId)
              this.multipleSelectionCaseArray=res.data
              this.communicationState = true
            })
          }else {
            getCaseByTmFileId({ tmFileId: row.insId }).then(res=>{
              this.queryInfo={
                caseIds: res.data.map(itm=>itm.caseId),
                pageId: 106,
                pageType:'3',
                // materialId: row.materialId,
                // mailingTypeId: row.mailingTypeId,
                insId: row.insId,
                info: res.data
              }
              // res.data.forEach(itm=>itm.insId=row.insId)
              // this.multipleSelectionCaseArray=res.data
              this.communicationState = true
            })
          }

        } else {
          this.pageType='edit'
          this.dialogVisible = true;
          this.curmaterialId = row;
          this.evenItem = item;
        }

      },
      changeFalse(flag) {
        this.dialogVisible = false;
        this.curmaterialId = "";
        this.evenItem = {};
        this.communicationState=false
        if (flag) {
          this.queryFileByTltId(this.tltId);
        }
      },
      // 进展
      downloadLCfile(command) {
        const data = { caseId: this.caseDetailFoemData.caseId };
        if (command == "1") {
          data.caseStageId = this.downloadDtepfiles;
        }
        oneKeyZipUrl(data).then(res => {
          if (res.success) {
            var a = document.createElement("a");
            a.setAttribute("href", res.data);
            a.setAttribute("id", "zipDownLoad");
            if (document.getElementById("zipDownLoad")) {
              document.body.removeChild(document.getElementById("zipDownLoad"));
            }
            document.body.appendChild(a);
            a.click();
          }
        });
      },
      getjzFilelist(number) {
        this.downloadDtepfiles = number;
        if (number >= 0) {
          this.myCaseEvolve.forEach(element => {
            if (element.id == number) {
              this.materialArray = element.materialArray;
              this.taskRecordArray = element.taskRecordArray;
              return;
            }
          });
        }
      }
    },
    components: {
      'timeLimit': (resolve, reject) => {
        require(['@/views/workbench/toDoTasks/timeLimit.vue'], resolve)
      },
      DetailOfficialCommunication,
      litigationOfficial
    }
  };
</script>

<style lang="scss" scoped>
  .materialModule {
    margin-top: 0px;
    & > p {
      height: 60px;
      line-height: 80px;
      border-bottom: 1px solid rgba(187, 187, 187, 0.5);
    }
  }
  .el-table {
    margin-top: 0px;
    /deep/ th {
      padding: 5px 0;
      color: rgba(51, 51, 51, 1);
      background: rgba(187, 187, 187, 0.5);
    }
    /deep/ td {
      padding: 0;
    }
  }
  /deep/ .el-dialog__close {
    display: none;
  }
  .button_wrap {
    width: 100%;
    display: flex;
    height: 85px;
    align-items: center;
    justify-content: flex-end;
    .el-button {
      margin-right: 30px;
    }
  }
  /deep/ .el-collapse {
    border: 0;
    .el-collapse-item {
      margin-top: 0px;
    }
    .el-collapse-item__header {
      text-align: left !important;
      background: #fff !important;
      border-top: 0 !important;
      border-bottom: 1px solid #ebeef5 !important;
      .el-collapse-item__arrow.el-icon-arrow-right {
        display: none;
      }
    }
    .el-collapse-item__wrap {
      border-bottom: 0;
      box-sizing: border-box;
    }
    .step-div {
      padding: 10px 65px;
    }
    .fg-div {
      height: 20px;
      background: #e4e4e4;
    }
    /deep/ section {
      padding-bottom: 10px !important;
    }
    /deep/ .el-collapse-item__wrap {
      width: 100%;
    }
    .el-collapse-item__header {
      font-size: 16px;
      color: #6aa7ff;
    }
    /deep/.el-tabs--border-card > .el-tabs__content {
      padding: 5px !important;
    }
  }
  .ElectronWrap{
    position: relative;
    .updateCaseEvolve{
      color:#409eff;
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
    }
  }
  .taskRecord_span{
    margin-right: 16px;
  }
</style>
