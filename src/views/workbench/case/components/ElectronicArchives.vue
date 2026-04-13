<template>
  <div class="ElectronWrap" style="padding: 0px 0px;overflow: hidden">

    <Tabs :before-leave='leavetab' ref="tagg" v-model='collapseactiveNames' @tab-click='tabclick' type="border-card">

      <el-tab-pane v-for="(item,key) in tagArr.filter(it => !usAgency || usAgency && it.name != 1)" :key="key" :name='item.name' :label="item.label">
        <timeLimit v-if="item.name=='2'" :caseDetail='true' :caseDetailCaseId="curCaseId" :agentNum='agentNum' :isPatent="taskType == 4"></timeLimit>
        <div v-else-if="item.name=='3'">
<!--          <el-button v-if="isEdit" style="float: right" @click="selectionState=true" type="primary" size="medium">下载</el-button>-->

          <el-button v-if="isEdit" style="float: right" type="primary" size="medium" @click="downloadMaterial">下载</el-button>
          <el-button v-if="isEdit || isPatentFee" style="float: right;margin-right: 20px" @click="() => {dialogVisible=true; pageType = 'create'}" type="primary" size="medium">新建</el-button>
          <el-collapse class="materialModule" v-model="activeNames" v-if="materialList.length">
            <el-collapse-item  v-for="(item,index) in materialList.filter(item => eDocPermissonList.includes(item.docTypeName))" :key="index" :name="index">
              <template slot="title">
                <p>
                  <!-- <img style="vertical-align: middle;width:25px;margin-right:5px;margin-left: -25px" :src="require(`@/assets/电子档案图标/${item.typeName}.png`)" alt=""> -->
                  <span>{{item.docTypeName}}</span></p>
              </template>
              <AgGridVue :style="{width:'100%',maxHeight: 400+'px',height:getHeight(item.evenList)}"
                         class="ag-theme-balham"
                         :columnDefs="columnDefs"
                         :rowData="item.evenList"
                         rowSelection="multiple"
                         @grid-ready="(params)=>onGridReady(params,index)"
                         :gridOptions="gridOptions"
                         @dragStopped="dragStopped"
                         :getContextMenuItems="()=>([])"
                         suppressAutoSize
                         animateRows
                         :rowHeight="28"
                         @rowSelected="(params)=>handleSelection(params,index)"
                         @rowClicked="(params)=>rowClick(params,index)"
                         @rowDoubleClicked="(params)=>rowDblclick(params.data,item)"
                         :localeText="$store.state.caseInformation.localeText"
              >
              </AgGridVue>
<!--              <el-table @row-dblclick="(row)=>rowDblclick(row,item)" @header-dragend="colChange" :data="item.evenList" border size='mini' style="width: 100%" @select="handleSelectionChange"-->
<!--                @select-all="(val)=>handleSelectionAll(val,item.childList)">-->
<!--                <el-table-column type="selection" :width="colWidth[0]" class="selection" v-if="selectionState">-->
<!--                </el-table-column>-->
<!--                <el-table-column type="index" :width="colWidth[1]" label="序号" align="left">-->
<!--                  <template slot-scope="scope">-->
<!--                    <span>{{scope.$index+1}}</span>-->
<!--                  </template>-->
<!--                </el-table-column>-->
<!--                <el-table-column prop="typeName" label="文件/事件类型" :width="colWidth[2]" align="left">-->
<!--                </el-table-column>-->
<!--                <el-table-column prop="eventName" label="文件/事件名称" :width="colWidth[3]" align="left">-->
<!--                </el-table-column>-->
<!--                <el-table-column label="附件名称" :width="colWidth[4]" align="left">-->
<!--                  <template slot-scope="scope">-->
<!--                    <div style="text-align:left" v-for="(items,key) in scope.row.materialList" :key="key">-->
<!--                      <el-popover-->
<!--                        v-if="items.sameList&&items.sameList.length>1"-->
<!--                        placement="top-start"-->
<!--                        trigger="hover"-->
<!--                        >-->
<!--                         <p style="text-align:left" v-for="(itm,key) in items.sameList" :key="key">-->
<!--                          <a  style="color:#409eff"-->
<!--                             @click="doEditInOffice(itm, item.docTypeName)"-->
<!--                          >{{itm.materialName}}&nbsp;{{itm.createDate}} <i class="el-icon-circle-close"  v-show="getPermission(item.docTypeName ,scope.row.creater)" @click.stop="deleteRow(itm)"></i>-->
<!--                          </a>-->
<!--                        </p>-->
<!--                        <a slot="reference" style="color:#409eff"-->
<!--                           @click="doEditInOffice(items, item.docTypeName)"-->
<!--                        >{{items.materialName}}-->
<!--                        </a>-->
<!--                      </el-popover>-->
<!--                      <a v-else style="color:#409eff"-->
<!--                         @click="doEditInOffice(items, item.docTypeName)"-->
<!--                        >{{items.materialName}}-->
<!--                      </a>-->
<!--                      <el-button type="text" class="el-icon-view" @click="preView(items)"></el-button>-->
<!--                    </div>-->
<!--                  </template>-->
<!--                </el-table-column>-->

<!--                <el-table-column align="left" prop="creater" :width="colWidth[5]" label="上传人">-->
<!--                </el-table-column>-->
<!--                <el-table-column align="left" prop="createDate" :width="colWidth[6]" label="上传时间">-->
<!--                </el-table-column>-->
<!--                <el-table-column label="操作" align="left" :width="colWidth[7]" class-name="small-padding fixed-width">-->
<!--                  <template slot-scope="{ row }">-->
<!--                    <el-button style="color: #FB9608;font-weight: 700" type="text"  v-show="row.eventRecordId||row.insId&&getEditPermission(item.docTypeName ,row.creater)" size="small"-->
<!--                      @click="(val)=>editFile(row,item)">编辑-->
<!--                    </el-button>-->
<!--                    <el-popover-->
<!--                      placement="top"-->
<!--                      width="160"-->
<!--                      v-if='getPermission(item.docTypeName ,row.creater)'-->
<!--                      v-model="row.visible">-->
<!--                      <p>确定要删除吗？</p>-->
<!--                      <div style="text-align: right; margin: 0">-->
<!--                        <el-button size="mini" type="text" @click="row.visible = false">取消</el-button>-->
<!--                        <el-button type="primary" size="mini" @click="deleteRow(row)">确定</el-button>-->
<!--                      </div>-->
<!--                      <el-button   size="small" style="color: #FB9608;font-weight: 700" type="text" slot="reference">删除</el-button>-->
<!--                    </el-popover>-->
<!--                  </template>-->
<!--                </el-table-column>-->
<!--              </el-table>-->
            </el-collapse-item>
          </el-collapse>

<!--          <div class="button_wrap" v-if="selectionState">-->
<!--            <el-button class="exactButton" style="margin-right: 20px" @click="selectionState=false">取消</el-button>-->
<!--            <el-button class="exactButton" type="primary" @click="downloadMaterial">确定</el-button>-->
<!--          </div>-->
        </div>
        <div v-else-if="item.name=='1'">
          <el-timeline >
            <el-timeline-item
              v-for="(activity, index) in myCaseEvolve"
              :key="index"
              :type="activity.stageName"
              :color="getColor(activity.id,index,activity.isCurrent)"
              :size="'large'">
              <h4 style="color: #303133;font-weight: normal">{{activity.stageName}}</h4>
              <p style="margin: 5px 0;color: #909399;
    line-height: 1;
    font-size: 12px" v-for="taskRecord in activity.taskRecordArray">
                <span class="taskRecord_span">{{taskRecord.createTime}}</span>
                <span class="taskRecord_span">{{taskRecord.opertorName}}</span>
                <span class="taskRecord_span">{{taskRecord.proceeName}}</span>
                <span class="taskRecord_span">{{taskRecord.memo}}</span>
                <span class="taskRecord_span">{{taskRecord.ukeyName}}</span>
              </p>
            </el-timeline-item>
          </el-timeline>
<!--          <div class="step-div">-->
<!--            <el-steps :active="stepActive" finish-status="success" process-status="finish" >-->
<!--              <el-step :key="key" :title="item.stageName" @click.native="getjzFilelist(item.id)" v-for="(item,key) in myCaseEvolve" />-->
<!--            </el-steps>-->
<!--          </div>-->
<!--          <el-table v-if="collapseactiveNames=='1'" :data="taskRecordArray" border current-row-key empty-text="暂无数据" fit highlight-current-row size="mini" style="width: 100%;">-->
<!--            <el-table-column align="left" label="序号" type="index" width="50" />-->
<!--            <el-table-column align="left" label="阶段" width>-->
<!--              <template slot-scope="scope">-->
<!--                <span>{{ scope.row.stageName }}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column align="left" label="最新进展" width>-->
<!--              <template slot-scope="scope">-->
<!--                <span>{{ scope.row.proceeName }}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column align="left" label="上一步骤处理人" width>-->
<!--              <template slot-scope="scope">-->
<!--                <span>{{ scope.row.opertorName }}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column align="left" label="处理时间" width>-->
<!--              <template slot-scope="scope">-->
<!--                <span>{{ scope.row.createTime }}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column align="left" label="备注" width>-->
<!--              <template slot-scope="scope">-->
<!--                <span>{{ scope.row.memo }}</span>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--          </el-table>-->
        </div>
        <div v-else-if="item.name=='4'">
          <el-collapse class="materialModule" v-model="archivesNames" v-if="archivesList.length">
            <el-collapse-item v-for="(aitem,aindex) in archivesList" :key="aindex" :name="aindex">
              <template v-if="aitem.list.length > 0">
                <template slot="title">
                  <p>
                    <span>{{aitem.name}}</span></p>
                </template>
                <AgGridVue :style="{width:'100%',maxHeight: 400+'px',height:getHeight(aitem.list)}"
                           class="ag-theme-balham"
                           :columnDefs="(aitem.name == '档案') ? archivesColumnDefs : samplesColumnDefs"
                           :rowData="aitem.list"
                           rowSelection="multiple"
                           @grid-ready="(params)=>onGridReady(params,aindex)"
                           :gridOptions="$store.state.caseInformation.gridOptions"
                           @dragStopped="dragStopped"
                           :getContextMenuItems="()=>([])"
                           suppressAutoSize
                           animateRows
                           :rowHeight="28"
                           @rowSelected="(params)=>handleSelection(params,aindex)"
                           @rowDoubleClicked="(params)=>archiveRowDblclick(params.data,aitem)"
                           :localeText="$store.state.caseInformation.localeText"
                >
                </AgGridVue>
              </template>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-tab-pane>

    </Tabs>
    <el-popover
      placement="top-start"
      width="200"
      trigger="click"
      v-if="isEdit&&collapseactiveNames==1"
     >
      <el-form>
      <el-form-item label="更新后案件阶段:" >
        <el-select  default-first-option v-model="caseStageId" placeholder="请选择" filterable
                    clearable >
          <el-option
            v-for="itm in getCaseStageList"
            :key="itm.id"
            :label="itm.stageName"
            :value="itm.id">
          </el-option>
        </el-select>
      </el-form-item>
      </el-form>
      <el-button type="primary" size="mini" @click="updateCaseEvolve">确定</el-button>
      <div slot="reference" class="updateCaseEvolve"  >更新案件阶段</div>
    </el-popover>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="70%" :before-close="handleClose" :append-to-body="true">
      <UploadMetailDetail v-if="dialogVisible" :caseDetailFoemData="caseDetailFoemData" :caseIds="caseIds" :isPatentFee="isPatentFee" :taskType="taskType" :pageType="pageType" :eventRecordData="curmaterialId" :evenItem='evenItem' :curCaseId="curCaseId" :custId="custId" @changeFalse="changeFalse"></UploadMetailDetail>

    </el-dialog>
<!--    <div v-if="msgUrl">-->
<!--      <iframe :src="msgUrl" frameborder="0" height="800px" width="800px"></iframe>-->
<!--    </div>-->
    <litigationOfficial :taskType="taskType"  v-if="communicationState&&taskType != 1" :officialCommunicationState="communicationState" :officialCommunicationType="officialCommunicationType" :multipleSelection="multipleSelectionCaseArray" @closeThisPage="changeFalse" :business="business"/>
    <detail-official-communication v-if="communicationState&&taskType==1" @closeThisPage="changeFalse" :dialogVisible="communicationState" :queryInfo="queryInfo" ></detail-official-communication>
<!--    <detail-official-communication v-if="communicationState" @closeThisPage="changeFalse" :dialogVisible="communicationState" :queryInfo="queryInfo" ></detail-official-communication>-->
    <el-dialog :visible.sync="archiveDetailView" title="档案信息" width="50%" :close-on-click-modal="false">
      <archiveDetail v-if="archiveDetailView" :check-type="archiveCheckType" :agent-nums="agentNum.split(',')" :material-id="archiveMaterialId" :archive-id="archiveId" @closeDialog="closeDetailDialog"></archiveDetail>
    </el-dialog>
    <el-dialog :visible.sync="selectMaterialView" title="选择识别原件">
      <template v-for="(item,key) in archiveMaterialList">
        <div style="margin-bottom: 10px">
          <el-button @click="handleArchiveMateria(item.materialId)" plain>{{ item.materialName }}</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog :visible.sync="sampleDetailView" title="样品信息" width="50%" :close-on-click-modal="false">
      <sampleDetail v-if="sampleDetailView" :check-type="$store.getters.permissions.includes(371) ? 'edit' : 'view'" :sample-id="sampleId" @closeDialog="closeDetailDialog"></sampleDetail>
    </el-dialog>

    <el-dialog append-to-body :visible.sync="mergeFileView" title="合成副本" width="80%" :close-on-click-modal="false" class="mergefile-dialog">
      <drag-pdf-and-view v-if="mergeFileView" :mergeFileList="mergeFileList" :caseId="curCaseId" @closeMergeDialog="closeMergeDialog"></drag-pdf-and-view>
    </el-dialog>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import DetailOfficialCommunication from '@/views/workbench/case/officialCommunication/detailOfficialCommunication';
  import archiveDetail from '@/views/workbench/material_management/components/archiveDetail';
  import sampleDetail from '@/views/workbench/material_management/components/sampleDetail';
  import { queryArchivesAndSampleList } from "@/api/material";
import {
  queryCaseMaterial,
  delCaseMaterial,
  downloadMaterial,
  changeCaseStage,
  getCaseStage,
  queryCaseProgress,
  checkPermission,
  translate
} from "@/api/caseList";
import { doEditInOffice, getProgID } from '@/utils/editInOffice.js'
  import Bus from '@/utils/Bus'
// import timeLimit from "@/views/workbench/toDoTasks/timeLimit.vue";
import {
  queryCaseEventListUrl,
  addCaseEventUrl,
  deleteCaseEventUrl,
  oneKeyZipUrl,
  delCaseMaterialUrl,
  modifyMailInfo
} from "@/api/caseDetail";
import UploadMetailDetail from "./UploadMetailDetail";
import Sortable from "sortablejs";
  import {  getCaseByTmFileId,deleteDoc, recordOnlienEdit } from '@/api/caseList.js'
  import litigationOfficial from '@/views/workbench/case/officialCommunication/components/litigationOfficial.vue'
  import vm from '../../../../main'
  import taskHandle from "../../../homePage/components/taskHandle";
  import delConfirm from "./delConfirm.vue";
  import {decFile, deleteFile} from "../../../../api/caseList";
  import {fileMergePdf} from "../../../../api/caseDetail";
  import DragPdfAndView from "./DragPdfAndView";
  const functionalComponent = {
    functional: true,
    props: {
      render: Function,
      params: {},
    },
    render(h, ctx) {
      const params={...ctx.props.params}
      return ctx.props.render.call(ctx, h, params);
    }
  }
export default {
  props: {
    caseDetailFoemData: {
      default: () => ({})
    },
    caseIds: {
      default: () => []
    },
    searchFanweiList: {
      default: () => []
    },
    usAgency: {},
    isPatentFee: {
      default: false
    },
    curCaseId: {
      default: 407394
    },
    custId: {},
    caseEvolve: {},
    agentNum: {},
    isEdit: {
      type: Boolean,
      default: true
    },
    caseTypeId:{},
    taskType:{
      default:1
    },
    business:{}
  },
  name: "ElectronicArchives",
  mounted() {
    console.log(this.business,'ElectronicArchives中business');
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
    Bus.$on('updateCaseEvent', ()=>{
      this.queryCaseMaterial(this.curCaseId)
    })
  },
  created() {
    if(this.caseEvolve) {
      this.myCaseEvolve= JSON.parse(JSON.stringify(this.caseEvolve))
    }
    this.getCaseStage()
    this.complay();
    this.queryArchivesAndSampleList()
    this.checkWritePermisson()
  },

  data() {
  let  colWidth= JSON.parse(localStorage.getItem("colwidth1"))
      ? JSON.parse(localStorage.getItem("colwidth1"))
      : [180, 180, 300, 100,100]
    return {
      mergeFileView: false,
      mergeFileList: [],
    // msgData: {},
    // msgUrl:'',
    selectedList:[],
    officialCommunicationType: 'view',
    flag:false,
      defaultcolumnDefs:[
        {
          headerName: '序号',
          field: 'sid',
          width:60,
          resizable: true,
          'pinned': 'left', //固定再左边
          enableRowGroup: true,
          floatingFilter:true,
          filter: false,
          autoHeight: true,
          cellClass: 'vAlign',
          suppressMenu: true,
          checkboxSelection: false,
          headerCheckboxSelection: false,
          headerCheckboxSelectionFilteredOnly: true,
          cellRenderer:this.cellRenderer,
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
      gridOptions: {...this.$store.state.caseInformation.gridOptions,...{
        onColumnResized(params) {
          params.api.resetRowHeights();
        },
        }
      },

      columnDefs: [
        {
          headerName: '序号',
          field: 'sid',
          width:60,
          resizable: true,
          autoHeight: true,
           'pinned': 'left', //固定再左边
          enableRowGroup: true,
          floatingFilter:true,
          filter: false,
          cellClass: 'vAlign',
          suppressMenu: true,
          checkboxSelection: false,
          headerCheckboxSelection: false,
          headerCheckboxSelectionFilteredOnly: true,
          cellRenderer:this.cellRenderer,
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

        {
          headerName:'文件/事件类型',
          field:'typeName',
          resizable: true,
          autoHeight: true,
          width:colWidth[0],
          cellRenderer:this.cellRenderer,
        },
        {
          headerName:'事件名称',field:'eventName',
          resizable: true,
          autoHeight: true,
          width:colWidth[1],
          cellRenderer:this.cellRenderer,
        },
        {
          headerName:'附件名称',field:'materialList',
          resizable: true,
          autoHeight: true,
          width:colWidth[2],
          cellRenderer:this.cellRenderer,
        },
        {
          headerName:'上传人',field:'creater',
          resizable: true,
          autoHeight: true,
          width:colWidth[3],
          cellRenderer:this.cellRenderer,
        },
        {
          headerName:'上传时间',field:'createDate',
          resizable: true,
          autoHeight: true,
          width:colWidth[4],
          cellRenderer:this.cellRenderer,
        },
        {
          headerName:'操作',
          field:'operation',
          autoHeight: true,
          resizable: true,
          cellRenderer:this.cellRenderer,
        }

      ],
      archivesColumnDefs: [
        {
          headerName: '序号',
          field: 'sid',
          width:60,
          resizable: true,
          'pinned': 'left', //固定再左边
          enableRowGroup: true,
          floatingFilter:true,
          filter: false,
          autoHeight: true,
          cellClass: 'vAlign',
          suppressMenu: true,
          checkboxSelection: false,
          headerCheckboxSelection: false,
          headerCheckboxSelectionFilteredOnly: true,
          cellRenderer:this.cellRenderer1,
        },
        {
          headerName:'条码号',
          field:'barcode',
          resizable: true,
          autoHeight: true,
          width:colWidth[0],
        },
        {
          headerName:'是否原件',
          field:'originalStr',
          resizable: true,
          autoHeight: true,
          width:colWidth[0],
        },
        {
          headerName:'档案状态',
          field:'statusStr',
          resizable: true,
          autoHeight: true,
          width:colWidth[0],
        },
        {
          headerName:'创建人',
          field:'filingUserName',
          resizable: true,
          autoHeight: true,
          width:colWidth[0],
        },
        {
          headerName:'创建时间',
          field:'filingDate',
          resizable: true,
          autoHeight: true,
          width:colWidth[0],
        },
        {
          headerName:'案件名称',
          field:'oriName',
          resizable: true,
          autoHeight: true,
          width:colWidth[0],
        }
      ],
      samplesColumnDefs: [
        {
          headerName: '序号',
          field: 'sid',
          width:60,
          resizable: true,
          'pinned': 'left', //固定再左边
          enableRowGroup: true,
          floatingFilter:true,
          filter: false,
          autoHeight: true,
          cellClass: 'vAlign',
          suppressMenu: true,
          checkboxSelection: false,
          headerCheckboxSelection: false,
          headerCheckboxSelectionFilteredOnly: true,
          cellRenderer:this.cellRenderer1,
        },
        {
          headerName:'条码号',
          field:'barcode',
          resizable: true,
          autoHeight: true,
          width:colWidth[0],
        },
        {
          headerName:'样品名称',
          field:'sampleName',
          resizable: true,
          autoHeight: true,
          width:colWidth[0],
        },
        {
          headerName:'是否真伪',
          field:'realOrFakeStr',
          resizable: true,
          autoHeight: true,
          width:colWidth[0],
        },
        {
          headerName:'创建人',
          field:'filingUserName',
          resizable: true,
          autoHeight: true,
          width:colWidth[0],
        },
        {
          headerName:'创建时间',
          field:'filingDate',
          resizable: true,
          autoHeight: true,
          width:colWidth[0],
        }
      ],
      myCaseEvolve:[],
      tagArr: [
        { name: "2", label: "时限" },
        { name: "3", label: "电子文档" },
        { name: "1", label: "详情进展" },
        { name: "4", label: "档案管理" }
      ],
      stepActive: 0,
      jzNub: "",
      collapseactiveNames: JSON.parse(localStorage.getItem("collitem"))
        ? JSON.parse(localStorage.getItem("collitem"))
        : "2",
      materialList: [],
      archivesList: [], // 档案管理列表
      archiveDetailView: false, // 档案信息视图
      sampleDetailView: false, // 样品信息视图
      archiveId: 0, // 档案id
      selectMaterialView: false,
      archiveMaterialList: [],
      archiveMaterialId: [], // 附件id
      sampleId: [], // 样品id
      dialogVisible: false,
      curmaterialId: "",
      evenItem: {},
      selectionState: false,
      multipleSelection: [],
      activeNames: [],
      archivesNames: [],
      taskRecordArray: [],
      materialArray: [],
      clickType: false,
      colWidth,
      getCaseStageList:[],
      caseStageId:'',
      communicationState:false,
      queryInfo:{},
      multipleSelectionCaseArray:[],
      pageType:'edit',
      gridApi:{},
      archiveCheckType: 'view',
      eDocPermissonList: [], // 有权查看列表
    };
  },
  watch: {
    caseEvolve: {
      handler(v) {
        if(v) {
          this.myCaseEvolve= JSON.parse(JSON.stringify(v))
          this.complay()
        }
      },
      immediate: true
    },
    selectionState(){
      this.changeSelectionState()
    }
  },
  methods: {
    closeMergeDialog(flag) {
      this.mergeFileList = []
      this.mergeFileView = false
      if (flag === true) {
        this.queryCaseMaterial(this.curCaseId)
      }
    },
    checkWritePermisson() {
      this.eDocPermissonList = this.searchFanweiList.filter(item => item.cjType == 1 && item.canSearch).map(item => item.canSearch)
      this.eDocPermissonList = this.eDocPermissonList.length ? this.eDocPermissonList : ['官方往来','客户指示','致函客户','外方代理来函','致函外方代理','内部管理','递交官方','官方通知','客户往来','内部往来','外代所往来','账单费用','对方当事人往来','档案扫描件']
    },
    handleArchiveMateria(value) {
      this.archiveMaterialId = value
      this.archiveCheckType = 'create'
      this.archiveDetailView = true
    },
    getSelectedRows(api){
      if(api){
        const selectedNodes = api.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data);
        return selectedData
      }
    },
    rowClick(params,index){
      if(this.getSelectedRows(this['gridApi'][index]).length > 1)return;
      if(this.selectedList.find(i => i.createDate === params.data.createDate)){
        params.api.deselectNode(params.node)
        this.selectedList.splice(this.selectedList.indexOf(i => i.createDate === params.data.createDate), 1)
      }else{
        this.selectedList=[params.data]
      }
    },
    // 档案点击查看详情
    archiveRowDblclick(row,item) {
      if (item.name == '档案'){
        this.archiveCheckType = this.$store.getters.permissions.includes(371) ? 'edit' : 'view'
        this.archiveDetailView = true
        this.archiveId = row.arcId
      }else if (item.name == '样品'){
        this.sampleDetailView = true
        this.sampleId = row.samId
      }else {

      }

    },
    // 关闭档案查看
    closeDetailDialog(search) {
      this.archiveDetailView = false
      this.sampleDetailView = false
      this.selectMaterialView = false
    },
    modifyDone(){
      this.$emit('modifyDone')
    },
    onGridReady(params,index){
      this['gridApi'][index]=params.api
      // this['gridApi'][index].sizeColumnsToFit();

    },
    getHeight(eventList){
      return this.$commonUtils.getLanglist(eventList.map(item => item.materialList || [{}])).length*36+50+'px'
    },
    changeSelectionState(){
      if(this.selectionState){
         this.columnDefs.find(item=>item.field=='sid').checkboxSelection=function (params) {
           return params.columnApi.getRowGroupColumns().length === 0;
         }
        this.columnDefs.find(item=>item.field=='sid').headerCheckboxSelection=(params)=>{
          return params.columnApi.getRowGroupColumns().length === 0
        }
      }else {
        this.columnDefs.find(item => item.field == 'sid').checkboxSelection = false
        this.columnDefs.find(item => item.field == 'sid').headerCheckboxSelection = false
      }
     let materialList=JSON.parse(JSON.stringify( this.materialList))
      this.materialList=[]
      this.$nextTick(()=>{
        this.materialList= materialList
      })
    },
    formatSort(materialList){
      let arr=['官方往来','客户指示','致函客户','外方代理来函','致函外方代理','内部管理','递交官方','官方通知','客户往来','内部往来','外代所往来','账单费用','对方当事人往来','档案扫描件']
      return materialList.filter(i=>arr.includes(i.docTypeName))
      // return arr.reduce((pre,next)=>{
      //   let item = materialList.find(itm=>itm.docTypeName==next)
      //   if(item){
      //     pre.push(item)
      //   }
      //   return  pre
      // },[])

    },
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
    cellRenderer1(params) {
      if (params.colDef.field === 'sid') {
        return params.rowIndex+1
      }
      return `<span title="${params.value}">${params.value ? params.value : ''}</span>`
    },
    cellRenderer(params){
      let item = this.materialList.find(i=>i.evenList.includes(params.data))

      if(params.colDef.field == 'sid'){
        return params.rowIndex+1
      }
      if(params.colDef.field == 'materialList'){
        const h = this.$createElement;
        let vnode=h(functionalComponent,{
          props: {
            render:(h, ctx)=>{
              return (<div >
                        {ctx.materialList?ctx.materialList.map(items=>(
                            <div style="display:flex;justify-content: space-between">
                          {items.sameList&&items.sameList.length>1?<el-popover

                          placement="top-start"
                          trigger="hover"
                          >
                          {items.sameList.map(itm=>(
                              <p style="text-align:left" >
                                <a  style="color:#409eff" v-on:click={()=>{this.doEditInOffice(itm, item.docTypeName)}}>
                          {itm.materialName} {itm.createDate} </a>
                          <i class="el-icon-circle-close"
                          v-show={this.getPermission(item.docTypeName ,ctx.creater)}
                          v-on:click={()=>{this.deleteRow(itm)}}></i>
                </p>
                          ))}
                          <a slot="reference" style="color:#409eff" v-on:click={()=>{this.doEditInOffice(items, item.docTypeName)}} >{items.materialName}</a>
                      </el-popover>:
                <a  class="materialName"
                v-on:click={()=>{this.doEditInOffice(items, item.docTypeName)}}
                  >{items.materialName}
              </a>}
              <el-button type="text" class="el-icon-view" style="line-height:0" v-on:click={()=>{this.preView(items)}}></el-button>
              {items.hasAttach ? <el-button type="text" class="el-icon-paperclip" style="line-height:0" v-on:click={()=>{this.preView(items)}}></el-button> : ''}
                  </div>
                    )):''}
                    </div>

                )
            },
            params:params.data,
          },

        })
        const div = document.createElement('div');
        this.__patch__(div,vnode,true,false)
        return  div
      }

      if(params.colDef.field == 'operation'){
        const h = this.$createElement;
        let vnode = h(delConfirm,{
          props: {
            caseTypeId: this.caseTypeId,
            items:item,
            ctx: params.data,
            permissionList: this.$store.getters.permissions,
            name: this.$store.state.user.name,
            delItem: ()=>{this.deleteRow(params.data)},
            editItem: ()=>{this.editFile(params.data,item)},
            createArchiveItem: ()=>{this.createArchive(params.data,item)},
            translateItem: ()=>{this.translateFile(params.data,item)},
            mergeFile: ()=>{this.mergeFile(params.data, item)},
            changeItem: (mailId, mdocName)=>{this.changeName(mailId,mdocName, params)}
          },
        })
        const div = document.createElement('div');
        this.__patch__(div,vnode,true,false)
        return  div
        // let vnode=h(functionalComponent,{
        //   props: {
        //     render:(h, ctx)=>{
        //       return (
        //         <div>
        //         <el-button style="color: #FB9608;font-weight: 700" type="text"  v-show={ctx.eventRecordId||ctx.insId&&this.getEditPermission(item.docTypeName ,ctx.creater)} size="small"
        //     v-on:click={()=>{this.editFile(ctx,item)}}>编辑
        //         </el-button>
        //       {this.getPermission(item.docTypeName ,ctx.creater)?
        //           <el-popover
        //           trigger="hover"
        //           ref="dcPopover"
        //           placement="top"
        //           width="160"
        //           >
        //             <p>确定要删除吗？</p>
        //         <div style="text-align: right; margin: 0">
        //
        //           <el-button type="primary" size="mini" v-on:click={()=>{this.deleteRow(ctx)}}>确定</el-button>
        //           </div>
        //           <el-button   size="small" style="color: #FB9608;font-weight: 700" type="text" slot="reference">删除</el-button>
        //           </el-popover>
        //       :''}
        //
        //       </div>
        //       )
        //     },
        //     params:params.data,
        //   },
        //
        // })
        // const div = document.createElement('div');
        // this.__patch__(div,vnode,true,false)
        // return  div
      }
      return `<span title="${params.value}">${params.value?params.value:''}</span>`
    },
    createArchive(row,item) {
      if (row.materialList.length > 1){
        this.selectMaterialView = true
        this.archiveMaterialList = row.materialList
      }else{
        this.archiveMaterialId = row.materialList[0].materialId
        this.archiveCheckType = 'create'
        this.archiveDetailView = true
      }
    },
    mergeFile(row, item) {
      fileMergePdf({
        caseId: this.curCaseId,
        materialId: row.materialList[0].materialId
      }).then(res => {
        this.mergeFileView = true
        this.mergeFileList = res.data
      }).catch(err => {
        this.$message.error('合成失败！')
      })

    },
    translateFile(row, item){
      translate({
        materialId: row.materialList[0].materialId
      }).then(res => {
        this.$message.success('已生成机翻英文，请在内部往来下查看或重新导出模板')
        this.queryCaseMaterial(this.curCaseId)
      }).catch(() => {
        this.$message.error('翻译失败')
      })
    },
    changeName(mailid, mdocname, params){
      modifyMailInfo({mailid, mdocname}).then(res=>{
        this.$message.success('修改成功')
        params.data.eventName = mdocname
        params.api.refreshCells()
        // this.queryCaseMaterial(this.curCaseId);
      }).catch(()=>{
        this.$message.error('修改失败')
      })
      // this.changeNameView = true
    },
    rowDblclick(row,item){
      if(row.eventRecordId||row.insId){
        if(item.docTypeName=='官方通知'&&row.insId){
          // alert(1)
          if(this.taskType!=1){
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
              this.officialCommunicationType = 'view'
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
              // this.officialCommunicationType = 'view'
              this.communicationState = true
            })
          }

        } else {
         // alert(2)
          this.pageType='view'
            this.curmaterialId = row;
          this.evenItem = item;
          this.dialogVisible = true;

        }
      }
    },
    handleSelection(params,index){
      // if(this.selectedList.find(i => i.createDate === params.data.createDate)){
      //   params.api.deselectNode(params.node)
      //   this.selectedList.splice(this.selectedList.find(i => i.createDate === params.data.createDate), 1)
      // }else{
      //   this.selectedList.push(params.data)
      // }
    },
    getColor(id,index,isCurrent){
      // if(this.myCaseEvolve.indexOf(this.myCaseEvolve.find(item=>item.id==this.jzNub))===index){
      //     return '#52a0f5'
      // }
      if(this.myCaseEvolve.indexOf(this.myCaseEvolve.find(item=>item.id==this.jzNub))<=index && isCurrent){
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
    dragStopped(params,type){
      let tableHeader=params.columnApi.columnController.gridColumns.filter(item=>item.colId!='sid').map(item=>item.actualWidth)
      localStorage.setItem("colwidth1", JSON.stringify(tableHeader));
    },
    async doEditInOffice(data, docTypeName){
      if (data.status1 == 9) {
        decFile({
          materialId: data.materialId
        }).then(res => {
          res.data && this.downLoad(res.data, true)
        })
      } else {
        const url = data.address
        if(docTypeName == "账单费用"){
          let res = await checkPermission({materialId:data.materialId})
          if(res.data.modify==0){
            this.preView(data)
            return
          }
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
      if (data.status1 == 9) {
        decFile({
          materialId: data.materialId
        }).then(res => {
          res.data && this.downLoad(res.data, true)
        })
      } else {
        let url = data.address || data.url
        if (getProgID(url)||['eml', 'msg'].includes(url.replace(/.+\./, '').toLocaleLowerCase())) {
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
      }
    },
    downLoad(data, isDel){
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
            isDel && deleteFile({
              materialId: data.materialId
            })
          }
        }
        if(data.mailId){
          downData.downLoad=data.materialName
        }
        this.$commonUtils.downLoadAll(downData)
    },
    getCaseStage(){
      getCaseStage({taskType: this.taskType}).then(res=>{
        this.getCaseStageList=res.data
      })
    },
   async updateCaseEvolve(){
      if(!this.caseStageId){
        this.$message.error('请选择更新后的案件阶段')
        return
      }
      try {
        await this.$confirm('此操作将更新案件阶段, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      } catch (e) {
        return
      }
      changeCaseStage({caseStageId:this.caseStageId,caseIds:this.curCaseId}).then(res=>{
        if (res.messageType === 1) {
          this.$confirm(res.message,
              "提示",
              {
                confirmButtonText: "确定",
                showCancelButton: false,
                // cancelButtonText: "取消",
                type: "warning"
              })
        } else if (res.messageType === 2) {
            this.$confirm(res.message,
              "提示",
              {
                confirmButtonText: "确定",
                // showCancelButton: false,
                cancelButtonText: "取消",
                type: "warning"
              }).then(() => {
                changeCaseStage({caseStageId:this.caseStageId,caseIds:this.curCaseId, sign: 1}).then(res => {
                  queryCaseProgress({caseIds:this.curCaseId, taskType: this.taskType}).then(res=>{
                    const {caseEvolve} = res.data
                    this.myCaseEvolve=caseEvolve
                    this.complay()
                  })
                })
            })
        } else {
          queryCaseProgress({caseIds:this.curCaseId, taskType: this.taskType}).then(res=>{
            const {caseEvolve} = res.data
            this.myCaseEvolve=caseEvolve
            this.complay()
          })
        }
      })
    },
    leavetab(activeName) {
      // if (this.clickType) {
      //   this.clickType = false;
      // } else {
      //   return false;
      // }
      // let keycode = "";
      // document.addEventListener("keydown", function(event) {
      //   keycode = event.keyCode;
      //   return (
      //      !(
      //       37 == event.keyCode ||
      //       38 == event.keyCode ||
      //       39 == event.keyCode ||
      //       40 == event.keyCode
      //     ) || (event.returnValue = false) //shift + 点击a标签
      //   );
      // });
      // if (keycode == 37 || keycode == 38 || keycode == 39 || keycode == 40) {
      //   return false;
      // }
      this.$nextTick(() => {
        for (let key in this.gridApi) {
          this.gridApi[key].resetRowHeights()
        }
      })
      console.log("change");
    },
    tabclick(n) {
      // this.clickType = true;
      localStorage.setItem("collitem", JSON.stringify(n.name));
    },
    complay() {
      this.queryCaseMaterial(this.curCaseId);
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
      this.multipleSelection= this.materialList.map((item,index)=>this['gridApi'][index].getSelectedNodes().map(itm=>itm.data.materialList&&itm.data.materialList.map(item=>item.materialId)))
      this.multipleSelection1= this.materialList.map((item,index)=>this['gridApi'][index].getSelectedNodes().map(itm=>itm.data.materialList&&itm.data.materialList.map(item=>item.mailId)))
      if(!this.$commonUtils.getLanglist(this.$commonUtils.getLanglist(this.multipleSelection)).filter(Boolean).length
        && !this.$commonUtils.getLanglist(this.$commonUtils.getLanglist(this.multipleSelection1)).filter(Boolean).length

      ){
        this.$message.error('请选择文档')
        return
      };
      downloadMaterial({
        materialIdList:this.$commonUtils.getLanglist(this.$commonUtils.getLanglist(this.multipleSelection)),
        mailIdList:this.$commonUtils.getLanglist(this.$commonUtils.getLanglist(this.multipleSelection1)),
        fdid: this.taskType == 4 ? 10 : this.taskType == 1 ? 8 : 9
      }).then(res => {
        this.$commonUtils.downLoadAll({download: this.agentNum, url: "ipdoc" + res.data})
        // var a = document.createElement("a");
        // a.setAttribute("href", "ipdoc" + res.data);
        // a.setAttribute("id", "startTelMedicine");
        // a.setAttribute("downLoad", this.agentNum);
        // if (document.getElementById("startTelMedicine")) {
        //   document.body.removeChild(
        //     document.getElementById("startTelMedicine")
        //   );
        // }
        // document.body.appendChild(a);
        // a.click();
      });
    },
    queryCaseMaterial(caseId) {
      queryCaseEventListUrl({ caseId }).then(res => {
        this.materialList=[]
        if(res.data&&res.data.length>0){this.$nextTick(()=>{ this.materialList = this.formatSort(res.data);
          this.activeNames = Array.from(new Array(res.data.length).keys()).slice(
            0
          )
        })}
      });
    },
    // 获取档案列表
    queryArchivesAndSampleList(caseId) {
      queryArchivesAndSampleList({ caseId: this.curCaseId }).then(res => {
        // var data = JSON.parse('{"total":null,"currPage":null,"messageType":null,"success":true,"data":[{"name":"档案","list":[{"arcId":6173907,"showRefno":"LD2024000135","subject":"建立档案","createDate":"2024-03-05","createUser":3063,"createUserName":null,"memo":null,"original":0,"originalStr":"否","filingDate":"2024-03-05","custId":2298,"custName":null,"filingUserId":3063,"barcode":"LSWHD008120","barcodes":null,"barcodesStr":null,"packageCode":"","remarks":"","briefContent":"","oriType":"","oriName":"","oriFilePath":null,"status":2,"statusStr":"借出","remoteStorageDate":null,"destroyDate":null,"destroyUserId":null,"destroyUserName":null,"taskType":2,"takeAwayUserId":null,"takeAwayUserName":null,"takeAwayDate":null,"takeAwayReason":null,"dataSource":null,"modifyDate":"2024-03-05 16:14:28","filingUserName":"杜梦楠","caseId":null,"caseName":null,"caseType":null,"caseLevelStr":null,"caseStatus":null,"domain":null,"caseArray":null,"recordArray":null,"takeAwayRecordArray":null,"territory":null,"territoryArray":null,"applicantName":null,"patentType":null,"appFromto":null,"goodClasses":"","quickSearchParam":null,"caseIds":null,"caseIdStr":null,"noCaseIdStr":null,"agentNums":null,"arcIds":null,"arcIdStr":null,"custWorks":null,"cbWorks":null,"lendUser":null,"lendDate":null,"returnDate":null,"userId":null,"materialId":null,"materialIdArray":null,"custIdArray":null,"materialArray":null,"droitNumber":null,"caseStatusId":null,"caseStage":null,"createDateStart":null,"createDateEnd":null,"createDateArray":null,"destroyDateStart":null,"destroyDateEnd":null,"destroyDateArray":null,"remoteStorageDateStart":null,"remoteStorageDateEnd":null,"remoteStorageDateArray":null,"takeAwayDateStart":null,"takeAwayDateEnd":null,"takeAwayDateArray":null,"lendDateStart":null,"lendDateEnd":null,"lendDateArray":null,"returnDateStart":null,"returnDateEnd":null,"returnDateArray":null,"agentNumStart":null,"agentNumEnd":null,"agentNumStartIs":null,"agentNumEndIs":null,"excludeArcId":null,"operatorId":null}]},{"name":"样品","list":[{"samId":6152964,"showRefno":"LD2024000135","subject":"建立样品","createDate":"2024-03-26","createUser":null,"barcode":"YP004096","barcodesStr":null,"memo":null,"realOrFake":0,"filingDate":"2024-03-26","sendUserId":null,"custId":2298,"custName":null,"filingUserId":3063,"receiveTotal":1,"sendNum":null,"mailNum":null,"destroyedNum":null,"status":1,"sampleName":"侵权衣服（重庆）","notaryAddr":"","source":"自购","position":"样品库3列1-1","remarks":"","sender":"赵楠","quantity":1,"dataSource":null,"modifyDate":"2024-03-26 17:05:17","caseName":null,"caseIds":[30284334],"agentNums":null,"samIds":null,"samIdStr":null,"custIdArray":null,"taskType":2,"statusStr":"是","filingUserName":"杜梦楠","caseId":null,"caseType":null,"droitNumber":null,"caseStatusId":null,"noCaseIdStr":null,"custWkgId":null,"custWorks":null,"cbWorks":null,"caseArray":[{"agentNum":"LD2024000135","taskType":2,"caseId":30284334}],"recordArray":[],"returnDate":null,"recordDate":null,"operatorId":null,"operator":null,"lendUser":null,"expressAddr":null,"userId":null,"recordType":null,"unDestroyed":null,"destroyed":null,"otherStatus":null,"senRecordUser":null,"sendRecordDate":null,"returnRecordDate":null,"mailRecordDate":null,"mailRecordUser":null,"destroyRecordDate":null,"destroyRecordUser":null,"destroyRemarks":null,"quickSearchParam":null,"recordPosition":null,"realOrFakeStr":"否","caseStatus":null,"samRecordId":null,"createDateStart":null,"createDateEnd":null,"createDateArray":null,"filingDateStart":null,"filingDateEnd":null,"filingDateArray":null,"agentNumStart":null,"agentNumEnd":null,"recordDateArray":null,"recordDate1Array":null,"recordDate2Array":null,"recordDate3Array":null,"recordDateStart":null,"recordDateEnd":null,"returnDateArray":null,"returnDateStart":null,"returnDateEnd":null,"materialId":null,"materialIdArray":null,"materialArray":null},{"samId":6152963,"showRefno":"LD2024000135","subject":"建立样品","createDate":"2024-03-26","createUser":null,"barcode":"YP004095","barcodesStr":null,"memo":null,"realOrFake":0,"filingDate":"2024-03-26","sendUserId":null,"custId":2298,"custName":null,"filingUserId":3063,"receiveTotal":1,"sendNum":null,"mailNum":null,"destroyedNum":null,"status":1,"sampleName":"侵权衣服（浙江）","notaryAddr":"","source":"自购","position":"样品库3列1-1","remarks":"","sender":"赵楠","quantity":1,"dataSource":null,"modifyDate":"2024-03-26 17:05:17","caseName":null,"caseIds":[30284334],"agentNums":null,"samIds":null,"samIdStr":null,"custIdArray":null,"taskType":2,"statusStr":"是","filingUserName":"杜梦楠","caseId":null,"caseType":null,"droitNumber":null,"caseStatusId":null,"noCaseIdStr":null,"custWkgId":null,"custWorks":null,"cbWorks":null,"caseArray":[{"agentNum":"LD2024000135","taskType":2,"caseId":30284334}],"recordArray":[],"returnDate":null,"recordDate":null,"operatorId":null,"operator":null,"lendUser":null,"expressAddr":null,"userId":null,"recordType":null,"unDestroyed":null,"destroyed":null,"otherStatus":null,"senRecordUser":null,"sendRecordDate":null,"returnRecordDate":null,"mailRecordDate":null,"mailRecordUser":null,"destroyRecordDate":null,"destroyRecordUser":null,"destroyRemarks":null,"quickSearchParam":null,"recordPosition":null,"realOrFakeStr":"否","caseStatus":null,"samRecordId":null,"createDateStart":null,"createDateEnd":null,"createDateArray":null,"filingDateStart":null,"filingDateEnd":null,"filingDateArray":null,"agentNumStart":null,"agentNumEnd":null,"recordDateArray":null,"recordDate1Array":null,"recordDate2Array":null,"recordDate3Array":null,"recordDateStart":null,"recordDateEnd":null,"returnDateArray":null,"returnDateStart":null,"returnDateEnd":null,"materialId":null,"materialIdArray":null,"materialArray":null},{"samId":6152962,"showRefno":"LD2024000135","subject":"建立样品","createDate":"2024-03-26","createUser":null,"barcode":"YP004094","barcodesStr":null,"memo":null,"realOrFake":0,"filingDate":"2024-03-26","sendUserId":null,"custId":2298,"custName":null,"filingUserId":3063,"receiveTotal":1,"sendNum":null,"mailNum":null,"destroyedNum":null,"status":1,"sampleName":"侵权衣服（山东）","notaryAddr":"","source":"自购","position":"样品库3列1-1","remarks":"","sender":"赵楠","quantity":1,"dataSource":null,"modifyDate":"2024-03-26 17:05:17","caseName":null,"caseIds":[30284334],"agentNums":null,"samIds":null,"samIdStr":null,"custIdArray":null,"taskType":2,"statusStr":"是","filingUserName":"杜梦楠","caseId":null,"caseType":null,"droitNumber":null,"caseStatusId":null,"noCaseIdStr":null,"custWkgId":null,"custWorks":null,"cbWorks":null,"caseArray":[{"agentNum":"LD2024000135","taskType":2,"caseId":30284334}],"recordArray":[],"returnDate":null,"recordDate":null,"operatorId":null,"operator":null,"lendUser":null,"expressAddr":null,"userId":null,"recordType":null,"unDestroyed":null,"destroyed":null,"otherStatus":null,"senRecordUser":null,"sendRecordDate":null,"returnRecordDate":null,"mailRecordDate":null,"mailRecordUser":null,"destroyRecordDate":null,"destroyRecordUser":null,"destroyRemarks":null,"quickSearchParam":null,"recordPosition":null,"realOrFakeStr":"否","caseStatus":null,"samRecordId":null,"createDateStart":null,"createDateEnd":null,"createDateArray":null,"filingDateStart":null,"filingDateEnd":null,"filingDateArray":null,"agentNumStart":null,"agentNumEnd":null,"recordDateArray":null,"recordDate1Array":null,"recordDate2Array":null,"recordDate3Array":null,"recordDateStart":null,"recordDateEnd":null,"returnDateArray":null,"returnDateStart":null,"returnDateEnd":null,"materialId":null,"materialIdArray":null,"materialArray":null},{"samId":6152954,"showRefno":"LD2024000135","subject":"建立样品","createDate":"2024-03-25","createUser":null,"barcode":"YP004086","barcodesStr":null,"memo":"","realOrFake":0,"filingDate":"2024-03-25","sendUserId":null,"custId":2298,"custName":null,"filingUserId":3063,"receiveTotal":1,"sendNum":null,"mailNum":null,"destroyedNum":null,"status":1,"sampleName":"封存TOMMY JACKY衣服","notaryAddr":"海诚公证处2024.3.19","source":"公证购买","position":"样品库6列3-1","remarks":"","sender":"范文硕","quantity":1,"dataSource":"","modifyDate":"2024-03-25 16:07:46","caseName":null,"caseIds":[30284334],"agentNums":null,"samIds":null,"samIdStr":null,"custIdArray":null,"taskType":2,"statusStr":"是","filingUserName":"杜梦楠","caseId":null,"caseType":null,"droitNumber":null,"caseStatusId":null,"noCaseIdStr":null,"custWkgId":null,"custWorks":null,"cbWorks":null,"caseArray":[{"agentNum":"LD2024000135","taskType":2,"caseId":30284334}],"recordArray":[],"returnDate":null,"recordDate":null,"operatorId":null,"operator":null,"lendUser":null,"expressAddr":null,"userId":null,"recordType":null,"unDestroyed":null,"destroyed":null,"otherStatus":null,"senRecordUser":null,"sendRecordDate":null,"returnRecordDate":null,"mailRecordDate":null,"mailRecordUser":null,"destroyRecordDate":null,"destroyRecordUser":null,"destroyRemarks":null,"quickSearchParam":null,"recordPosition":null,"realOrFakeStr":"否","caseStatus":null,"samRecordId":null,"createDateStart":null,"createDateEnd":null,"createDateArray":null,"filingDateStart":null,"filingDateEnd":null,"filingDateArray":null,"agentNumStart":null,"agentNumEnd":null,"recordDateArray":null,"recordDate1Array":null,"recordDate2Array":null,"recordDate3Array":null,"recordDateStart":null,"recordDateEnd":null,"returnDateArray":null,"returnDateStart":null,"returnDateEnd":null,"materialId":null,"materialIdArray":null,"materialArray":null}]}],"message":"查询案件相关档案及样品成功！"}')
        // console.log('data',data,data.length)
        this.archivesList = res.data;
        this.archivesNames = Array.from(new Array(res.data.length).keys()).slice(0)
      });
    },
    deleteRow(row) {
        if(row.eventRecordId){
        deleteCaseEventUrl({
          eventRecordId: row.eventRecordId
        }).then(res => {
          this.queryCaseMaterial(this.curCaseId);
        });
      } else {
        if(row.insId){
          deleteDoc({
            docList: [{ tmFileId: row.insId }],
            taskType:this.taskType
          }).then(res => {
            this.queryCaseMaterial(this.curCaseId);
          });
        }else {
          if(row.materialList&&row.materialList.map(item=>item.materialId).filter(item=>!!item).length){
            delCaseMaterialUrl({
              caseIdArray: this.curCaseId,
              materialIdList:row.materialList.map(item=>item.materialId)
            }).then(res => {
              this.queryCaseMaterial(this.curCaseId);
            })
          }
          if(row.materialList&&row.materialList.map(item=>item.mailId).filter(item=>!!item).length){
            delCaseMaterialUrl({
              caseIdArray: this.curCaseId,
              mailIdList:row.materialList.map(item=>item.mailId)
            }).then(res => {
              this.queryCaseMaterial(this.curCaseId);
            })
          }
          if(row.materialId){
            delCaseMaterialUrl({
              caseIdArray: this.curCaseId,
              materialIdList:row.materialId
            }).then(res => {
              this.queryCaseMaterial(this.curCaseId);
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
      if(this.taskType!=1){
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
          this.officialCommunicationType = 'edit'
          this.communicationState = true
        })
      }else {
        getCaseByTmFileId({ tmFileId: row.insId,taskType: this.taskType }).then(res=>{
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
        this.queryCaseMaterial(this.curCaseId);
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
    DragPdfAndView,
    UploadMetailDetail,
    'timeLimit': (resolve, reject) => {
      require(['@/views/workbench/toDoTasks/timeLimit.vue'], resolve)
    },
    DetailOfficialCommunication,
    litigationOfficial,
    archiveDetail,
    sampleDetail
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
  .materialName{
    color:#409eff;
    display:block;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    margin-right:10px;
  }
  .ag-row-selected{
    position: relative;
    .materialName{
      color:#fff;
    }
    .el-icon-view{
      color:#fff;
    }
  }
  .mergefile-dialog{
    /deep/ .el-dialog{
      margin-top: 40px !important;
    }
  }

</style>
