<template>
  <div>
    <div class="queryButton">
      <el-menu class="el-menu-demo" mode="horizontal" @select="handleSelect" v-allow="83" >
        <el-submenu index="1">
          <template slot="title">新建</template>
          <el-submenu index="1-1" v-allow="152">
            <template slot="title">新建费用账单</template>
            <el-menu-item index="1-1-1" v-allow="180">账单</el-menu-item>
            <el-menu-item index="1-1-2" v-allow="181">内部账单</el-menu-item>
            <el-menu-item index="1-1-4" v-allow="229">境外账单</el-menu-item>
            <el-menu-item index="1-1-3">费用</el-menu-item>
          </el-submenu>
          <el-submenu index="1-2" >
            <template slot="title">新建案件进程</template>
            <el-menu-item index="1-2-1" v-if="$store.getters.permissions.includes(182)">递交指令</el-menu-item>
            <el-menu-item index="1-2-2" v-allow="183">官方通知</el-menu-item>
            <el-menu-item index="1-2-2-2">递交官方(文件)</el-menu-item>
            <el-menu-item index="1-2-3"  >客户往来</el-menu-item>
            <el-menu-item index="1-2-4" >内部往来</el-menu-item>
            <el-menu-item index="1-2-5" >外代所往来</el-menu-item>
            <el-menu-item index="1-2-6" >对方当事人往来</el-menu-item>
            <!--<el-menu-item index="1-2-7">特批预立卷审批</el-menu-item>-->
          </el-submenu>
          <el-submenu index="1-3" v-allow="154">
            <template slot="title">新建时限</template>
            <el-menu-item index="1-3-1" v-allow="190">官方时限</el-menu-item>
            <el-menu-item index="1-3-2" v-allow="191">内部时限</el-menu-item>
          </el-submenu>
        </el-submenu>
      </el-menu>
      <exportFile ref="exportFile" :downLoadState="downLoadState" :multipleSelection="getSelectedRows()" @getData="getExportFileData" @exportList="exportList" @close="closeSelect" :pageTitle="pageTitle" @multipleTypeText="changeMultiple"></exportFile>
      <!--    <el-button class="plbj" type="primary" size="small" @click="handleSelect('批量操作')">批量编辑</el-button>-->
      <!--    <exportFile ref="exportFile" :downLoadState="downLoadState" :multipleSelection="multipleSelection" @getData="getExportFileData" @exportList="exportList" @close="closeSelect" :pageTitle="pageTitle" @multipleTypeText="changeMultiple"></exportFile>-->
    </div>
    <div style="display: flex;position: relative">
      <TitleTotal :total="list.length" />
      <div style="cursor:pointer;position: absolute;display:flex;align-items:center;right: 10px;bottom:-16px;font-size: 14px;padding-right: 6px">
        <el-button type="text" @click="exportList(2)" >导出</el-button>
      </div>
<!--      <div class="button_wrap" v-if="selectionState">-->
<!--        <el-button class="exactButton" size="mini" type="primary" @click="jumpDetailSubmisson">{{multipleTypeText}}</el-button>-->
<!--        <el-button class="exactButton"  size="mini" @click="selectionState=false">取消</el-button>-->
<!--      </div>-->
      <!--      <el-button type="text" style="position: absolute;right: 0;bottom:-6px;font-size: 14px;padding-right: 6px" @click="exportList"><i class="el-icon-download">导出</i></el-button>-->
    </div>
    <div class="content_wrap" style="margin-top: 10px">
      <div class="left_wrap" :style="{width:currentCaseId&&pattern?leftWrapWidth:'100%' }">
        <AgGridVue :style="{width:'100%',height: clientHeight+'px'}"
                   class="ag-theme-balham"
                   :columnDefs="columnDefs"
                   :rowData="list"
                   rowSelection="multiple"
                   @grid-ready="onGridReady"
                   :gridOptions="gridOptions"
                   @dragStopped="dragStopped"
                   :getContextMenuItems="getContextMenuItems"
                   suppressAutoSize

                   animateRows
                   @rowSelected="rowSelected"
                   @rowDoubleClicked="rowDoubleClicked"
                   @rowClicked="rowClicked"
                   @sortChanged="refreshEvenRowsCurrencyData"
                   @filterChanged="refreshEvenRowsCurrencyData"
                   @selectionChanged="selectionChanged"
                   :localeText="$store.state.caseInformation.localeText"
        >
        </AgGridVue>
<!--        <div class="checkbox" v-show="checkboxState" >-->
<!--          <el-select ref="checkCaseSelect" v-model="checkCaseList" reserve-keyword multiple   filterable placeholder="请选择" collapse-tags :popper-append-to-body="false"  @visible-change="handleChange"-->
<!--                     :filter-method="filterCheck">-->
<!--            <template slot="">-->
<!--              <div class="checkbox_bottom">-->
<!--                <el-button size="mini" round @click.stop="delPreference(1)">恢复默认</el-button>-->
<!--                <el-button style="margin-right: 3px" size="mini" round @click.stop="savePreference(1)">保存设置</el-button>-->
<!--                &lt;!&ndash;<el-button size="mini" round @click.stop="checkNotAtAll">全不选</el-button>&ndash;&gt;-->
<!--              </div>-->
<!--            </template>-->
<!--            <el-option v-for="(item,idx) in selectColumnList.filter(item =>item.COLUMN_COMMENT.includes(filterText))" :key="item.COLUMN_NAME" :label="item.COLUMN_COMMENT" :value="item.COLUMN_NAME">-->
<!--              &lt;!&ndash;<el-checkbox v-model="selectBox[idx]">{{item.COLUMN_COMMENT}}</el-checkbox>&ndash;&gt;-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </div>-->
      </div>
      <div class="right_wrap" v-if="pattern" :style="{position:'relative','margin-left':currentCaseId&&pattern?'10px' :'0',height:clientHeight+'px'}">
        <!--<span class="el-icon-close" slot="close" style="cursor:pointer;position: absolute;right: 0;top: 10px;z-index: 1000" @click="closeCurrentRow"></span>-->
        <seeCaseDetail v-if="currentCaseId" :case-id="currentCaseId" :sign="1" :task-type="taskType" >
        </seeCaseDetail>
      </div>
    </div>
    <el-dialog :title="uploadType" :visible.sync="uploadState" width="70%" :append-to-body="true">
      <el-table :data="getSelectedRows()" border>

        <el-table-column align="left" v-for="(item,index) in preferenceList" :label="item.title" :prop="item.value" :width="item.width" :key="index">

          <template slot-scope="scope">
            <span :class="item.value=='agentNum'?'itemTitle_style':''" v-if="item.value!=='imageFile'&&item.value!='custName'" :title='scope.row[item.value]' style="margin: 0;cursor: pointer"
                  @click="takeCaseDetail(scope.row)">
              {{scope.row[item.value]}}
            </span>
            <CustCard v-if="item.value=='custName'" :custName="scope.row.custName" :customerID="scope.row.custId" />
            <img class="filterTableTmg" v-if="item.value==='imageFile'" :src="'ipdoc'+scope.row['imageFile']" alt="">
          </template>
        </el-table-column>
      </el-table>
      <BulkUploadFile v-if="uploadState" :uploadType="uploadType" :curCaseId="getSelectedRows().map(item=>item.caseId)" @changeFalse="closeSelect"></BulkUploadFile>
    </el-dialog>
<!--    <Willtable v-if="showTable" :plType="plType" :changeType="multipleSelection.length?multipleSelection[0].changeType:''" :reportMatter="multipleSelection.length?multipleSelection[0].reportMatter:null"-->
<!--               :materialTypeId="multipleSelection.length?multipleSelection[0].materialTypeId:null" :caseTypeId="multipleSelection.length?multipleSelection[0].caseTypeId:null" :caseIds='willtableCaseIdList'-->
<!--                :showTable='showTable'  @closeTable="closeSelect">-->
<!--    </Willtable>-->
<!--    <SelectOption :exportType="2" :buss-id="bussId" v-if="selectionOptionState&&multipleSelection.map(item=>item[getCurFilterId(pageTitle)]).length" :dialog-visible="selectionOptionState" @cancel="closeSelect" :idArray="multipleSelection.map(item=>item[getCurFilterId(pageTitle)])" :defaultMultipleSelect="preferenceList.map(i=>i.title)" >-->

<!--    </SelectOption>-->
    <detail-official-communication :taskType="taskType" v-if="communicationState" @closeThisPage="closeSelect" :dialogVisible="communicationState" :queryInfo="queryInfo" ></detail-official-communication>
    <el-dialog
      title="递交官方"
      append-to-body
      :visible.sync="detailSubmissionState"
      width="60%"
      height="100vh"
      :modal="false"
      top="0"
      class="pdfDialog"
      :close-on-click-modal="false"
      v-dialogDrag
    >
      <officialSubmission :query="detailSubmissionData" @cancel="closeSelect"></officialSubmission>
    </el-dialog>
    <el-dialog
      ref="timeLimit"
      title="创建时限"
      append-to-body
      :visible.sync="timeLimitState"
      width="50%"
      height="100vh"
      :modal="false"
      top="0"
      class="pdfDialog"
      :close-on-click-modal="false"
      v-dialogDrag
    >
      <createTimeLimit v-if="pageTitle=='官方通知'" :query="timeLimitData" objType="1021" :objInstId="curentObjInstId" @cancel="closeSelect"></createTimeLimit>
      <createTimeLimit v-else :query="timeLimitData"  @cancel="closeSelect"></createTimeLimit>
    </el-dialog>

    <!--    导出-->
    <SelectOption
      :buss-id="bussId"
      v-if="selectionOptionState"
      :dialog-visible="selectionOptionState"
      @cancel="closeSelect"
      :idArray="getCurrentRowsData(getCurFilterId(pageTitle))"
      :defaultMultipleSelect="preferenceList.map(i=>i.title)"
      :exportType="exportType"
      :exportQueryModel="exportQueryModel"></SelectOption>
  </div>
</template>
<script>
  import Bus from '@/utils/Bus'
  import {
    selectColumn,
    savePreference,
    queryPreference,
    delPreference,
    queryFilter,
    configFilter,
    queryCorrelationCaseList,
    checkPermission
  } from "@/api/caseList.js";
  import {mapState,mapGetters} from 'vuex'
  import {unique,throttle} from '@/utils'
  import BulkUploadFile from "../BulkUploadFile";
  import seeCaseDetail from "../ManualIdentification/seeCaseDetail";
  import ViewsSwitching from "../ViewsSwitching";
  import Willtable from "@/components/Willtable";
  import exportFile from '@/components/exportFile'
  import DetailOfficialCommunication from '@/views/workbench/case/officialCommunication/detailOfficialCommunication';
  import officialSubmission from '@/views/workbench/case/officialSubmission/components/detailSubmission.vue'
  import createTimeLimit from "@/views/workbench/toDoTasks/createTimeLimit";
  import SelectOption from "../SelectOption";
  export default {
    props: {
      editableTabsValue:{

      },
      business: {
        type: String,
        default: "2"
      },
      bussId: {
        type: String,
        default: '5'
      },
      caseList: {
        type: Array,
        default: () => []
      },
      pageTitle: {
        type: String,
        default:'案件管理'
      },
      taskType:{
        default:1
      },
      list: {},
      defaultColumnDefs: {},
      identification: {},
      // defaultGetContextMenuItems:{}
    },
    name: "Table",
    data() {
      var tableHeader = []
      if (localStorage.getItem('tableHeader') && JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.identification)) {
        tableHeader = JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.identification).tableHeader
      }
      return {
        exportType: '',
        timeLimitState:false,
        timeLimitData:{},
        curentObjInstId:'',
        willtableCaseIdList:[],
        selectionOptionState:false,
        plType: "",
        downLoadState: false,
        uploadType: '',
        uploadState: false,
        showTable: false,
        selectColumnList: [],
        currentCaseId: '',
        currentId: '',
        selectionState: false,
        checkboxState: false,
        tableHeader: tableHeader,
        tableHeaderLabelList: [],
        checkCaseList: [],
        multipleSelection:[],
        requireList:[],
        preferenceList:[],
        multipleTypeText:'',
        filterText: '',
        rowContextmenuList: [
          { name: '相关案件', action: 'relevant' },
          { name:'暂存', action: 'temporarStorage'},

        ],
        queryInfo:{},
        communicationState:false,
        leftWrapWidth: localStorage.getItem('leftWrapWidth')?localStorage.getItem('leftWrapWidth'):'60%',
        gridOptions:{...this.$store.state.caseInformation.gridOptions,...{
            getRowStyle:(params)=>{
              if(params.node.data){
                if(params.node.data.auditStatus==1){
                  return { background:'#DCDFE6' }
                }
              }
            },
            statusBar: {
              statusPanels: [
                { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
                { statusPanel: 'agSelectedRowCountComponent', align: 'left' },
              ]
            },
          }},
        columnDefs: [

        ],
        operationKey:'',
        gridApi:'',
        gridReadyState:false,
        detailSubmissionState:false,
        detailSubmissionData:{
          caseIds:[],
          pageType:''
        }
      }
    },
    created() {
      Bus.$on('changeColumns', (name)=>{
        this.changeColumns(name)
      })
      this.columnDefs=this.defaultColumnDefs
      // this.getContextMenuItems = this.defaultGetContextMenuItems
      this.getAllWfs();
    },
    mounted() {
      new this.$DraginResize(document.querySelector(".left_wrap"), {
        clone: true,
        end(info) {
          if (info.dir == 'ver') {
            this.elem.style.height = info.height + 'px';
          }
          else if (info.dir == 'hor') {
            this.elem.style.width = info.width + 'px';
            localStorage.setItem('leftWrapWidth', info.width + 'px')
          }
        }
      })
    },
    methods: {
      getCurrentRowsData(key){
        if (this.gridApi && this.gridApi.rowModel) {
          console.log('+++++++++++++++++')
          console.log(this.gridApi.rowModel.rootNode.childrenAfterSort.map(item => item.data).map(item => item[key]))
          console.log('+++++++++++++++++')
          return this.gridApi.rowModel.rootNode.childrenAfterSort.map(item => item.data).map(item => item[key])
        }
        return []
      },
      changeColumns(name){
        if(name == '相关案件' && !this.columnDefs.find(i=>i.field == 'relationTypeStr')){
          this.columnDefs.push(
            {
                headerName: '相关类型',
                field: 'relationTypeStr',
                width: 200,
                pinned: 'left',
                resizable: true,
                sortable: true,
                filter: 'agSetColumnFilter',
                cellRenderer: this.cellRenderer,
                menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
                enableRowGroup: true,
                filterParams: {
                  newRowsAction: 'keep',
                  comparator: (a, b) => {
                    return this.$commonUtils.sort(a, b, item.value)
                  }
                }
              },
          )
        }
        if(name != '相关案件'&&this.columnDefs.findIndex(i=>i.field == 'relationTypeStr')){
          this.columnDefs.findIndex(i=>i.field == 'relationTypeStr')!= -1&&this.columnDefs.splice(this.columnDefs.findIndex(i=>i.field == 'relationTypeStr'), 1)
        }
      },
      getRowContextmenuList(row){
        let hash = {}
        let contextmenuList = [
          { name:'复制',action: 'copy' },
          { name: '修改', action: 'editFun',permissions:203, isSubmitOfficial:0,isCheck:true},
          { name: '修改', action: 'editFun',permissions:204, isSubmitOfficial:1 ,isCheck:true},
          { name: '删除', action: 'delCase',permissions:205, isSubmitOfficial:0},
          { name: '删除', action: 'delCase',permissions:206, isSubmitOfficial:1 },
          { name: '删除', action: 'delCase',permissions:250},
        ]
        if(this.pageTitle === '官方通知'){
          return [
            { name:'复制',action: 'copy' },
            // { name:'暂存',action: 'temporarStorageAll' },
            // { name: '附件', action: 'pdfPre' },
            // { name:'隐藏', action: 'hidden'},
            // { name:'隐藏(批量)', action: 'hiddenAll'},
            { name: '修改', action: 'editFun',permissions:195, auditStatus:0},
            { name: '修改', action: 'editFun',permissions:200, auditStatus:1 },
            { name: '修改', action: 'editFun',permissions:195, auditStatus:2},
            { name: '修改', action: 'editFun',permissions:195, auditStatus:3 },
            { name: '删除', action: 'delCase',permissions:201, auditStatus:0},
            { name: '删除', action: 'delCase',permissions:202, auditStatus:1 },
            { name: '删除', action: 'delCase',permissions:201, auditStatus:2},
            { name: '删除', action: 'delCase',permissions:201, auditStatus:3}].filter(item=>{
            if(item.permissions){
              return this.$store.getters.permissions.includes(item.permissions)&&row.auditStatus==item.auditStatus
            }else if( item.action=='pdfPre'){
              return row.addressList&&this.isOrNotPdfPre(row.addressList)
            }else {
              return true
            }
          }).reduce((preVal, curVal) => {
              hash[curVal.action] ? '' : hash[curVal.action] = true && preVal.push(curVal);
              return preVal
          }, []).filter(item=>!this.editableTabsValue.includes(item.name))
        }
        return this.rowContextmenuList.concat(contextmenuList.filter(item=>{
          if((row.agentNum.slice(0,2) === 'NO' && row.createUserId == this.userId)){
            return true
          }
          if(item.permissions){
            if(item.permissions==250){
              return  this.$store.getters.permissions.includes(item.permissions)
            }
            else if(item.isCheck){
              return this.$store.getters.permissions.includes(item.permissions)&&row.isSubmitOfficial==item.isSubmitOfficial&&row.isCheck==item.isCheck
            } else {
              return this.$store.getters.permissions.includes(item.permissions)&&(row.isSubmitOfficial==item.isSubmitOfficial || (row.agentNum.slice(0,2) === 'NO' && row.createUserId == this.userId))
            }
          }else {
            return true
          }
        }).reduce((preVal, curVal) => {
            hash[curVal.action] ? '' : hash[curVal.action] = true && preVal.push(curVal);
            return preVal
        }, []).filter(item=>!this.editableTabsValue.includes(item.name)))
      },
      rowContextmenu(row, column, event) {
        const that=this
        this.$ContextMenu({
          event, // 传入鼠标事件
          menu:this.getRowContextmenuList(row)
        }).then(rs => {
          if(rs){
            this[rs](row, column, event);
          }
        });
      },
      // relevant(row, column, event) {
      //   queryCorrelationCaseList({caseId:row.caseId}).then(res=>{
      //     if(this.pageTitle==='案件管理'){
      //       res.data.forEach(item=>{
      //         if(this.ajglTabList.find(item=>item.title=='相关案件')){
      //           this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'push',data:{title:'相关案件',name:'相关案件',data:item}})
      //         }else {
      //           this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'pushItem',data:{title:'相关案件',name:'相关案件',list:[item]}})
      //         }
      //       })
      //     }
      //   })
      // },
      relevant(row, column, event) {
        queryCorrelationCaseList({caseId:row.caseId}).then(res=>{
          res.data.forEach(item=>{
            this.$store.commit('tabs/CHANGE_STORAGETABLE',{type:'push',title:'相关案件',name:'相关案件',identification:this.identification,data:item})
          })

          // if(this.pageTitle==='案件管理'){
          //   res.data.forEach(item=>{
          //     if(this.ajglTabList.find(item=>item.title=='相关案件')){
          //       this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'push',data:{title:'相关案件',name:'相关案件',data:item}})
          //     }else {
          //       this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'pushItem',data:{title:'相关案件',name:'相关案件',list:[item]}})
          //     }
          //   })
          // }
        })
      },
      temporarStorage(row, column, event) {
        this.$store.commit('tabs/CHANGE_STORAGETABLE',{type:'push',title:'暂存案件(商标)',name:'暂存案件(商标)',identification:this.identification,data:row})
        // if(this.pageTitle==='案件管理'){
        //   if(this.ajglTabList.find(item=>item.title=='暂存案件')){
        //     this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'push',data:{title:'暂存案件',name:'暂存案件',data:row}})
        //   }else {
        //     this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'pushItem',data:{title:'暂存案件',name:'暂存案件',list:[row]}})
        //   }
        // }
      },
      abnormal(row, column, event) {
        if(this.pageTitle==='案件管理'){
          if(this.ajglTabList.find(item=>item.title=='异常案件')){
            this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'push',data:{title:'异常案件',name:'异常案件',data:row}})
          }else {
            this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'pushItem',data:{title:'异常案件',name:'异常案件',list:[row]}})
          }
        }
      },
      copy(row, value) {
        if(value){
          this.$copyText(value).then(res => {
          })
        }
      },
      changeMultiple(text){
        this.multipleTypeText=text
      },
      // jumpDetailSubmisson() {
      //   if (!this.getSelectedRows().length) {
      //     this.$message.error("请先选择！");
      //     return;
      //   }
      //   if ( this.operationKey === "1-2-1") {
      //     if (this.pageTitle === "官方通知") {
      //       let list = this.unique(
      //         this.getSelectedRows(),
      //         this.getCurFilterId(this.pageTitle)
      //       );
      //       let caseIds = this.getLanglist(list.map(item => item.caseArray)).map(
      //         item => item.caseId
      //       );
      //       this.detailSubmissionData={
      //         caseIds: [...new Set(caseIds)] , pageType: "1"
      //       }
      //       this.detailSubmissionState=true
      //       // this.$router.push({
      //       //   path: "/workbench/case/detailSubmission",
      //       //   query: { caseIds: caseIds, pageType: "1" }
      //       // });
      //     } else {
      //       this.detailSubmissionData= {
      //         caseIds: [
      //           ...new Set(this.getSelectedRows().map(item => item.caseId))
      //         ],
      //         pageType: "1"
      //       }
      //       this.detailSubmissionState=true
      //       // this.$router.push({
      //       //   path: "/workbench/case/detailSubmission",
      //       //   query: {
      //       //     caseIds: [
      //       //       ...new Set(this.getSelectedRows().map(item => item.caseId))
      //       //     ],
      //       //     pageType: "1"
      //       //   }
      //       // });
      //     }
      //   }
      //   if (this.operationKey === "1-2-2") {
      //     if (this.pageTitle === "官方通知") {
      //       let list = this.unique(
      //         this.getSelectedRows(),
      //         this.getCurFilterId(this.pageTitle)
      //       );
      //       let caseList = this.getLanglist(list.map(item => item.caseArray));
      //       let caseIds = caseList.map(item => item.caseId);
      //       const queryInfo = {
      //         caseIds: caseIds,
      //         pageType: "1",
      //         info: caseList
      //       };
      //       this.$emit("getCaseQueryInfo", queryInfo);
      //     } else {
      //       let info = this.unique(this.getSelectedRows(), "caseId");
      //       info.forEach(item => {
      //         delete item.insId;
      //       });
      //       const queryInfo = {
      //         caseIds: [
      //           ...new Set(this.getSelectedRows().map(item => item.caseId))
      //         ],
      //         pageType: "1",
      //         info
      //       };
      //       this.queryInfo=queryInfo
      //       this.communicationState=true
      //       // this.$emit("getCaseQueryInfo", queryInfo);
      //     }
      //   }
      //   if (this.operationKey === "1-1-1") {
      //     if (this.pageTitle === "官方通知") {
      //       let list = this.unique(
      //         this.getSelectedRows(),
      //         this.getCurFilterId(this.pageTitle)
      //       );
      //       let caseIds = this.getLanglist(list.map(item => item.caseArray)).map(
      //         item => item.caseId
      //       );
      //
      //       this.$router.push({
      //         path: "/workbench/finance/off_bill/bill",
      //         query: { caseIdList: caseIds }
      //       });
      //     } else {
      //       this.$router.push({
      //         path: "/workbench/finance/off_bill/bill",
      //         query: {
      //           caseIdList: [
      //             ...new Set(this.getSelectedRows().map(item => item.caseId))
      //           ]
      //         }
      //       });
      //     }
      //   }
      //   if (this.operationKey === "1-1-2") {
      //     if (this.pageTitle === "官方通知") {
      //       let list = this.unique(
      //         this.getSelectedRows(),
      //         this.getCurFilterId(this.pageTitle)
      //       );
      //       let caseIds = this.getLanglist(list.map(item => item.caseArray)).map(
      //         item => item.caseId
      //       );
      //       this.$router.push({
      //         path: "/workbench/finance/off_bill/bill",
      //         query: { caseIdList: caseIds }
      //       });
      //     } else {
      //       this.$router.push({
      //         path: "/workbench/finance/off_bill/insideBill",
      //         query: {
      //           caseIdList: [
      //             ...new Set(this.getSelectedRows().map(item => item.caseId))
      //           ]
      //         }
      //       });
      //     }
      //   }
      //   if (this.operationKey === "1-3-1") {
      //     if (this.pageTitle === "官方通知") {
      //       let list = this.unique(
      //         this.getSelectedRows(),
      //         this.getCurFilterId(this.pageTitle)
      //       );
      //       let agentNums = this.getLanglist(list.map(item => item.caseArray))
      //         .map(item => item.agentNum)
      //         .join(",");
      //       // this.$router.push({
      //       //   path: "/workbench/createTimeLimit",
      //       //   query: { agentNums: agentNums, kind: 1 }
      //       // });
      //     } else {
      //       // this.$router.push({
      //       //   path: "/workbench/createTimeLimit",
      //       //   query: {
      //       //     agentNums: [
      //       //       ...new Set(this.getSelectedRows().map(item => item.agentNum))
      //       //     ].join(","),
      //       //     kind: 1
      //       //   }
      //       // });
      //     }
      //   }
      //   // if (this.operationKey === "1-3-2") {
      //   //   if (this.pageTitle === "官方通知") {
      //   //     let list = this.unique(
      //   //       this.getSelectedRows(),
      //   //       this.getCurFilterId(this.pageTitle)
      //   //     );
      //   //     let agentNums = this.getLanglist(list.map(item => item.caseArray))
      //   //       .map(item => item.agentNum)
      //   //       .join(",");
      //   //     this.$router.push({
      //   //       path: "/workbench/createTimeLimit",
      //   //       query: { agentNums: agentNums, kind: 2 }
      //   //     });
      //   //   } else {
      //   //     this.$router.push({
      //   //       path: "/workbench/createTimeLimit",
      //   //       query: {
      //   //         agentNums: [
      //   //           ...new Set(this.getSelectedRows().map(item => item.agentNum))
      //   //         ].join(","),
      //   //         kind: 2
      //   //       }
      //   //     });
      //   //   }
      //   // }
      //   // if (this.operationKey === "1-1-3") {
      //   //   if (this.pageTitle === "官方通知") {
      //   //     let list = this.unique(
      //   //       this.getSelectedRows(),
      //   //       this.getCurFilterId(this.pageTitle)
      //   //     );
      //   //     let agentNums = this.getLanglist(list.map(item => item.caseArray))
      //   //       .map(item => item.agentNum)
      //   //       .join(",");
      //   //
      //   //     this.$router.push({
      //   //       path: "/workbench/finance/addFeeDetail/1",
      //   //       query: { agentNums: agentNums, kind: 2 }
      //   //     });
      //   //   } else {
      //   //
      //   //     this.$router.push({
      //   //       path: "/workbench/finance/addFeeDetail/1",
      //   //       query: {
      //   //         agentNums: [
      //   //           ...new Set(this.getSelectedRows().map(item => item.agentNum))
      //   //         ].join(","),
      //   //         kind: 2
      //   //       }
      //   //     });
      //   //   }
      //   // }
      //   if (this.multipleTypeText === "新建官方时限") {
      //     if (this.pageTitle === "官方通知") {
      //       let list = this.unique(
      //         this.getSelectedRows(),
      //         this.getCurFilterId(this.pageTitle)
      //       );
      //       let agentNums = this.getLanglist(list.map(item => item.caseArray))
      //         .map(item => item.agentNum)
      //         .join(",");
      //       this.timeLimitData={
      //         agentNums: agentNums, kind: 1
      //       }
      //       this.curentObjInstId = list[0][this.getCurFilterId(this.pageTitle)]
      //       if(list.reduce((pre,next)=>next.caseArray.length?pre+1:pre,0)!=list.length&&list.length>1){
      //         this.$message.error('只能选一个无案件官文绑定时限')
      //         return;
      //       }
      //       this.timeLimitState=true
      //       // this.$router.push({
      //       //   path: "/workbench/createTimeLimit",
      //       //   query: { agentNums: agentNums, kind: 1 }
      //       // });
      //     } else {
      //       // this.$router.push({
      //       //   path: "/workbench/createTimeLimit",
      //       //   query: {
      //       //     agentNums: [
      //       //       ...new Set(this.getSelectedRows().map(item => item.agentNum))
      //       //     ].join(","),
      //       //     kind: 1
      //       //   }
      //       // });
      //       this.timeLimitData={
      //         agentNums: [
      //           ...new Set(this.getSelectedRows().map(item => item.agentNum))
      //         ].join(","),
      //         kind: 1
      //       }
      //
      //       this.timeLimitState=true
      //     }
      //   }
      //   if ( this.multipleTypeText === "新建内部时限") {
      //     if (this.pageTitle === "官方通知") {
      //       let list = this.unique(
      //         this.getSelectedRows(),
      //         this.getCurFilterId(this.pageTitle)
      //       );
      //       let agentNums = this.getLanglist(list.map(item => item.caseArray))
      //         .map(item => item.agentNum)
      //         .join(",");
      //       this.timeLimitData={
      //         agentNums: agentNums, kind: 2
      //       }
      //       this.curentObjInstId = list[0][this.getCurFilterId(this.pageTitle)]
      //       if(list.reduce((pre,next)=>next.caseArray.length?pre+1:pre,0)!=list.length&&list.length>1){
      //         this.$message.error('只能选一个无案件官文绑定时限')
      //         return;
      //       }
      //       this.timeLimitState=true
      //       // let agentNums = this.getLanglist(list.map(item => item.caseArray))
      //       //   .map(item => item.agentNum)
      //       //   .join(",");
      //       // this.$router.push({
      //       //   path: "/workbench/createTimeLimit",
      //       //   query: { agentNums: agentNums, kind: 2 }
      //       // });
      //     } else {
      //       this.timeLimitData={
      //         agentNums: [
      //           ...new Set(this.getSelectedRows().map(item => item.agentNum))
      //         ].join(","),
      //         kind: 2
      //       }
      //       this.timeLimitState=true
      //       // this.$router.push({
      //       //   path: "/workbench/createTimeLimit",
      //       //   query: {
      //       //     agentNums: [
      //       //       ...new Set(this.getSelectedRows().map(item => item.agentNum))
      //       //     ].join(","),
      //       //     kind: 2
      //       //   }
      //       // });
      //     }
      //   }
      //   if (this.operationKey === "1-1-4") {
      //     if (this.pageTitle === "官方通知") {
      //       let list = this.unique(
      //         this.getSelectedRows(),
      //         this.getCurFilterId(this.pageTitle)
      //       );
      //       let agentNums = this.getLanglist(list.map(item => item.caseArray))
      //         .map(item => item.agentNum)
      //         .join(",");
      //
      //       this.$router.push({
      //         path: "/workbench/finance/addOverseasBill/1",
      //         query: { agentNums: agentNums }
      //       });
      //     } else {
      //       this.$router.push({
      //         path: "/workbench/finance/addOverseasBill/1",
      //         query: {
      //           agentNums: [
      //             ...new Set(this.getSelectedRows().map(item => item.agentNum))
      //           ].join(","),
      //         }
      //       });
      //     }
      //   }
      //   if (this.multipleTypeText === "批量操作") {
      //     this.plType = this.pageTitle;
      //     if (this.pageTitle === "官方通知") {
      //       // let list = this.unique(
      //       //   this.multipleSelection,
      //       //   this.getCurFilterId(this.pageTitle)
      //       // );
      //       // let caseIdList = this.getLanglist(
      //       //   list.map(item => item.caseArray)
      //       // ).map(item => item.tmFileId);
      //       this.willtableCaseIdList = [
      //         ...new Set(this.getSelectedRows().map(item => item.tmFileId))
      //       ];
      //       // this.willtableCaseIdList = caseIdList;
      //       this.showTable = true;
      //     } else {
      //       if (this.pageTitle === "递交官方") {
      //         this.willtableCaseIdList = [
      //           ...new Set(this.getSelectedRows().map(item => item.insId))
      //         ];
      //       } else {
      //         this.willtableCaseIdList = [
      //           ...new Set(this.getSelectedRows().map(item => item.caseId))
      //         ];
      //       }
      //
      //       this.showTable = true;
      //     }
      //   }
      //   if(this.otherSelect){
      //     this.downLoadState=true
      //     this.$nextTick(()=>{
      //       this.downLoadState=false
      //     })
      //   }
      //   if(this.exportListState){
      //     this.selectionOptionState=true
      //     this.exportListState=false
      //   }
      //   if(this.multipleTypeText === '确定'&&!this.otherSelect&&!this.selectionOptionState){
      //     this.uploadState=true
      //   }
      //    this.selectionState = false;
      // },
      async jumpDetailSubmisson(currentType) {
      if (!this.getSelectedRows().length) {
        this.$message.error("请先选择！");
        return;
      }
      if(!this.selectionChanged()){
        return;
      }
      if(currentType=='1-2'||currentType=='1-3'){
        this.$refs.exportFile.currentType=currentType
      }
      if (this.multipleTypeText === "递交") {
        if (this.pageTitle === "官方通知") {
          let list = this.unique(
            this.getSelectedRows(),
            this.getCurFilterId(this.pageTitle)
          );
          let caseIds = this.getLanglist(list.map(item => item.caseArray)).map(
            item => item.caseId
          );
          this.detailSubmissionData={
            caseIds: [...new Set(caseIds)] , pageType: "1"
          }
          this.detailSubmissionState=true
          // this.$router.push({
          //   path: "/workbench/case/detailSubmission",
          //   query: { caseIds: [...new Set(caseIds)] , pageType: "1" }
          // });
        } else {
          this.detailSubmissionData= {
            caseIds: [
              ...new Set(this.getSelectedRows().map(item => item.caseId))
            ],
            pageType: "1"
          }
          this.detailSubmissionState=true
        }
      }
      if (this.multipleTypeText === "官方通知") {
        if (this.pageTitle === "官方通知") {
          let list = this.unique(
            this.getSelectedRows(),
            this.getCurFilterId(this.pageTitle)
          );
          let caseList = this.getLanglist(list.map(item => item.caseArray));
          let caseIds = caseList.map(item => item.caseId);
          const queryInfo = {
            business: this.business,
            caseIds: [...new Set(caseIds)] ,
            pageType: "1",
            info: caseList
          };
          this.$emit("getCaseQueryInfo", queryInfo);
        } else {
          let info = this.unique(this.getSelectedRows(), "caseId");
          info.forEach(item => {
            delete item.insId;
          });
          const queryInfo = {
            business: this.business,
            caseIds: [
              ...new Set(this.getSelectedRows().map(item => item.caseId))
            ],
            pageType: "1",
            info
          };
          this.$emit("getCaseQueryInfo", queryInfo);
        }
      }
      // if (this.multipleTypeText === "审核" && this.pageTitle === "递交官方") {
      //   const data = {
      //     userId: this.$store.getters.userId,
      //     caseIds: [
      //       ...new Set(this.getSelectedRows().map(item => item.caseId))
      //     ],
      //     insIdList: this.getSelectedRows().map(item => item.insId),
      //     result: 1
      //   };
      //   submitOfficalAudit(data).then(res => {
      //     if (res.success) {
      //       this.queryCaseList();
      //     }
      //   });
      // }
      // if (this.multipleTypeText === "审核" && this.pageTitle === "官方通知") {
      //
      //   queryTrademarkCaseOfficial({ insIdList: this.getSelectedRows().map(item => item.tmFileId)}).then(res=>{
      //     this.examineDialog=true
      //     this.examineData=res.data
      //   })
      //   // auditOfficalDoc(data).then(res => {
      //   //
      //   //     this.selectionState=false
      //   //     this.queryCaseList();
      //   //
      //   // });
      // }
      if (this.multipleTypeText === "新建账单") {
        if (this.pageTitle === "官方通知") {
          let list = this.unique(
            this.getSelectedRows(),
            this.getCurFilterId(this.pageTitle)
          );
          let caseIds = this.getLanglist(list.map(item => item.caseArray)).map(
            item => item.caseId
          );
          if([...new Set(caseIds)].length>1000){
            this.$store.commit('caseInformation/SET_CASEIDLIST',[...new Set(caseIds)])
          }
          this.$router.push({
            path: "/workbench/finance/off_bill/bill",
            query: { caseIdList:[...new Set(caseIds)] }
          });
        } else {
          if([
            ...new Set(this.getSelectedRows().map(item => item.caseId))
          ].length>1000){
            this.$store.commit('caseInformation/SET_CASEIDLIST',[
              ...new Set(this.getSelectedRows().map(item => item.caseId))
            ])
          }
          this.$router.push({
            path: "/workbench/finance/off_bill/bill",
            query: {
              caseIdList: [
                ...new Set(this.getSelectedRows().map(item => item.caseId))
              ]
            }
          });
        }
      }
      if ( this.multipleTypeText === "新建内部账单") {
        if (this.pageTitle === "官方通知") {
          let list = this.unique(
            this.getSelectedRows(),
            this.getCurFilterId(this.pageTitle)
          );
          let caseIds = this.getLanglist(list.map(item => item.caseArray)).map(
            item => item.caseId
          );
          if([...new Set(caseIds)].length>1000){
            this.$store.commit('caseInformation/SET_CASEIDLIST',[...new Set(caseIds)])
          }
          this.$router.push({
            path: "/workbench/finance/off_bill/bill",
            query: { caseIdList: [...new Set(caseIds)]}
          });
        } else {
          if([
            ...new Set(this.getSelectedRows().map(item => item.caseId))
          ].length>1000){
            this.$store.commit('caseInformation/SET_CASEIDLIST',[
              ...new Set(this.getSelectedRows().map(item => item.caseId))
            ])
          }
          this.$router.push({
            path: "/workbench/finance/off_bill/insideBill",
            query: {
              caseIdList: [
                ...new Set(this.getSelectedRows().map(item => item.caseId))
              ]
            }
          });
        }
      }
      if (this.multipleTypeText === "新建官方时限") {
        if (this.pageTitle === "官方通知") {
          let list = this.unique(
            this.getSelectedRows(),
            this.getCurFilterId(this.pageTitle)
          );
          let agentNums = this.getLanglist(list.map(item => item.caseArray))
            .map(item => item.agentNum)
            .join(",");
           this.timeLimitData={
             agentNums: agentNums, kind: 1
           }
          this.curentObjInstId = list[0][this.getCurFilterId(this.pageTitle)]
           if(list.reduce((pre,next)=>next.caseArray.length?pre+1:pre,0)!=list.length&&list.length>1){
             this.$message.error('只能选一个无案件官文绑定时限')
            return;
           }
          this.timeLimitState=true
          // this.$router.push({
          //   path: "/workbench/createTimeLimit",
          //   query: { agentNums: agentNums, kind: 1 }
          // });
        } else {
          // this.$router.push({
          //   path: "/workbench/createTimeLimit",
          //   query: {
          //     agentNums: [
          //       ...new Set(this.getSelectedRows().map(item => item.agentNum))
          //     ].join(","),
          //     kind: 1
          //   }
          // });
          this.timeLimitData={
            agentNums: [
                  ...new Set(this.getSelectedRows().map(item => item.agentNum))
                ].join(","),
                kind: 1
          }

          this.timeLimitState=true
        }
      }
      if ( this.multipleTypeText === "新建内部时限") {
        if (this.pageTitle === "官方通知") {
          let list = this.unique(
            this.getSelectedRows(),
            this.getCurFilterId(this.pageTitle)
          );
          let agentNums = this.getLanglist(list.map(item => item.caseArray))
            .map(item => item.agentNum)
            .join(",");
          this.timeLimitData={
            agentNums: agentNums, kind: 2
          }
          this.curentObjInstId = list[0][this.getCurFilterId(this.pageTitle)]
          if(list.reduce((pre,next)=>next.caseArray.length?pre+1:pre,0)!=list.length&&list.length>1){
            this.$message.error('只能选一个无案件官文绑定时限')
            return;
          }
          this.timeLimitState=true
          // let agentNums = this.getLanglist(list.map(item => item.caseArray))
          //   .map(item => item.agentNum)
          //   .join(",");
          // this.$router.push({
          //   path: "/workbench/createTimeLimit",
          //   query: { agentNums: agentNums, kind: 2 }
          // });
        } else {
          this.timeLimitData={
            agentNums: [
              ...new Set(this.getSelectedRows().map(item => item.agentNum))
            ].join(","),
            kind: 2
          }
          this.timeLimitState=true
          // this.$router.push({
          //   path: "/workbench/createTimeLimit",
          //   query: {
          //     agentNums: [
          //       ...new Set(this.getSelectedRows().map(item => item.agentNum))
          //     ].join(","),
          //     kind: 2
          //   }
          // });
        }
      }
      if (this.multipleTypeText === "新建费用") {
        if (this.pageTitle === "官方通知") {
          let list = this.unique(
            this.getSelectedRows(),
            this.getCurFilterId(this.pageTitle)
          );
          let agentNums = this.getLanglist(list.map(item => item.caseArray))
            .map(item => item.agentNum)
            .join(",");

          this.$router.push({
            path: "/workbench/finance/addFeeDetail/1",
            query: { agentNums: agentNums, kind: 2 }
          });
        } else {

          this.$router.push({
            path: "/workbench/finance/addFeeDetail/1",
            query: {
              agentNums: [
                ...new Set(this.getSelectedRows().map(item => item.agentNum))
              ].join(","),
              kind: 2
            }
          });
        }
      }
      if (this.multipleTypeText === "新建境外账单") {
        if (this.pageTitle === "官方通知") {
          let list = this.unique(
            this.getSelectedRows(),
            this.getCurFilterId(this.pageTitle)
          );
          let agentNums = this.getLanglist(list.map(item => item.caseArray))
            .map(item => item.agentNum)
            .join(",");

          this.$router.push({
            path: "/workbench/finance/addOverseasBill/1",
            query: { agentNums: agentNums }
          });
        } else {
          this.$router.push({
            path: "/workbench/finance/addOverseasBill/1",
            query: {
              agentNums: [
                ...new Set(this.getSelectedRows().map(item => item.agentNum))
              ].join(","),
            }
          });
        }
      }
      if ( this.multipleTypeText === "批量操作") {
        this.plType = this.pageTitle + this.taskType; // this.taskType区分不同的pageTitle
        if (this.pageTitle === "官方通知") {
          if(this.$store.getters.permissions.includes(195) || this.$store.getters.permissions.includes(200)){
            if(this.$store.getters.permissions.includes(195) && !this.$store.getters.permissions.includes(200)){
              if(this.getSelectedSortRows().find(item => item.auditStatus === 1)){
                this.$message.error('无法批量编辑所选官方通知！')
                return;
              }
            }
            if(this.$store.getters.permissions.includes(200) && !this.$store.getters.permissions.includes(195)) {
              if(this.getSelectedSortRows().find(item => item.auditStatus === 0 || item.auditStatus === 2 || item.auditStatus === 3)){
                this.$message.error('无法批量编辑所选官方通知！')
                return;
              }
            }
          }else{
            this.$message.error('无法批量编辑所选官方通知！')
            return;
          }
          // let list = this.unique(
          //   this.multipleSelection,
          //   this.getCurFilterId(this.pageTitle)
          // );
          // let caseIdList = this.getLanglist(
          //   list.map(item => item.caseArray)
          // ).map(item => item.tmFileId);
          this.willtableCaseIdList = [
            ...new Set(this.getSelectedSortRows().map(item => item.tmFileId))
          ];
          // this.willtableCaseIdList = caseIdList;
          this.showTable = true;
        } else {
          if (this.pageTitle === "递交官方") {
            this.willtableCaseIdList = [
              ...new Set(this.getSelectedSortRows().map(item => item.insId))
            ];
            let res = await checkPermission({
              insIdList: this.willtableCaseIdList
            });
            if(!res.data.modify){
              this.$message.error('无法批量编辑所选递交指令！')
              return;
            }
          } else {
            if(this.getSelectedSortRows().find(item => !item.isCheck)){
              this.$message.error('无法批量编辑所选案件！')
              return;
            }
            if(this.$store.getters.permissions.includes(203) || this.$store.getters.permissions.includes(204)){
              if(this.$store.getters.permissions.includes(203) && !this.$store.getters.permissions.includes(204)){
                if(this.getSelectedSortRows().find(item => item.isSubmitOfficial === 1)){
                  this.$message.error('无法批量编辑所选案件！')
                  return;
                }
              }
              if(this.$store.getters.permissions.includes(204) && !this.$store.getters.permissions.includes(203)) {
                if(this.getSelectedSortRows().find(item => item.isSubmitOfficial === 0)){
                  this.$message.error('无法批量编辑所选案件！')
                  return;
                }
              }
            }else{
              this.$message.error('无法批量编辑所选案件！')
              return;
            }
            this.willtableCaseIdList = [
              ...new Set(this.getSelectedSortRows().map(item => item.caseId))
            ];
          }

          this.showTable = true;
        }
      }
      if(this.multipleTypeText==='模板生成'){
        this.downLoadState=true
        this.$nextTick(()=>{
          this.downLoadState=false
        })
      }
      // if ( this.multipleTypeText === "文件下载") {
      //   downloadMaterial({zipFlag:1,materialIdList:this.getSelectedRows().map(item=>item.materialId)}).then(res=>{
      //     this.$commonUtils.downLoadAll({download: res.data.replace(/(.*\/)*([^.]+).*/ig,"$2",'')+'.'+res.data.replace(/.+\./,""), url: "ipdoc" + res.data})
      //     // axios.get(`ipdoc${res.data}`,{ responseType: 'blob', headers: {
      //     //   "Content-Type": "application/json; charset=utf-8",
      //     //   }}).then(function (response) {
      //     //   jsFileDownload(response.data, res.data.replace(/(.*\/)*([^.]+).*/ig,"$2",'')+'.'+res.data.replace(/.+\./,""));
      //     // })
      //     // res.data.forEach((item,index)=>{
      //     //   axios.get(`ipdoc${item.address}`,{ responseType: 'blob', headers: {
      //     //       "Content-Type": "application/json; charset=utf-8",
      //     //     }}).then(function (res) {
      //     //
      //     //     jsFileDownload(res.data,item.fileName);
      //     //   })
      //     // })
      //   })
      //
      // }
      if(this.exportListState){
        this.selectionOptionState=true
        this.exportListState=false
      }
      if(this.uploadType&&!this.otherSelect&&!this.selectionOptionState){
        this.uploadState=true
      }
      // this.selectionState = false;
    },
      closeSelect(){
        this.detailSubmissionState=false
        this.selectionState=false
        this.selectionOptionState=false
        this.uploadState = false
        this.showTable=false
        this.communicationState=false
        this.timeLimitState=false
      },
      editFun(row) {
        this.$listeners.editFun(row)
        // if(row.pageId===100){
        //   this.$router.push('/workbench/case/case_detail/'+row.caseId+'/'+row.caseType+'?pageId=100')
        // } else {
        //   this.$router.push('/workbench/case/case_detail/'+row.caseId+'/'+row.caseType)
        // }
      },
      delCase(row) {
        this.$store.commit('tabs/CHANGE_STORAGETABLE',{type:'delete',title:this.editableTabsValue,name:this.editableTabsValue,identification:this.identification,data:row})
        // this.$store.commit('tabs/CHANGE_STORAGETABLE',{type:'delete',data:{title:this.editableTabsValue,name:this.editableTabsValue,data:row}})
        // this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'delete',data:{title:this.editableTabsValue,name:this.editableTabsValue,data:row}})
      },
      takeCaseDetail(row) {
       this.$commonUtils.takeCaseDetail(row,this,'push')
      },
      // savePreference(num) {
      //   let list2 = this.checkCaseList.map(item => ({
      //     title: this.selectColumnList.find(i => i.COLUMN_NAME === item)
      //       .COLUMN_COMMENT,
      //     value: item
      //   }));
      //   const data = {
      //     userId: this.userId,
      //     bussId: this.bussId,
      //     list2
      //   };
      //   savePreference(data).then(res => {
      //     if (res.success) {
      //       this.checkboxState = false;
      //       this.filterText=''
      //       if (!num) {
      //         this.queryCaseList();
      //       }
      //       this.getAllWfs();
      //     }
      //   });
      // },
      // delPreference(num) {
      //   const data = {
      //     userId: this.userId,
      //     bussId: this.bussId
      //   };
      //   delPreference(data).then(res => {
      //     if (res.success) {
      //       this.checkboxState = false;
      //       if (!num) {
      //         this.queryCaseList();
      //       }
      //       this.getAllWfs();
      //     }
      //   });
      // },
      // handleCheckboxState() {
      //   this.checkboxState = !this.checkboxState;
      // },
      // saveLocation() {
      //   if (!localStorage.getItem('tableHeader')) {
      //     let arr = []
      //     arr.push({name:this.identification, tableHeader: this.tableHeader})
      //     localStorage.setItem('tableHeader', JSON.stringify(arr))
      //   } else {
      //     let arr = JSON.parse(localStorage.getItem('tableHeader'))
      //     if (arr.find(item => item.name == this.identification)) {
      //       arr.find(item => item.name == this.identification).tableHeader = this.tableHeader
      //       localStorage.setItem('tableHeader', JSON.stringify(arr))
      //     } else {
      //       arr.push({name: this.identification, tableHeader: this.tableHeader})
      //       localStorage.setItem('tableHeader', JSON.stringify(arr))
      //     }
      //   }
      // },
      getAllWfs() {
        const data = {
          userId: this.userId,
          bussId: this.bussId
        };
        Promise.all([selectColumn(data)]).then(res => {
          this.selectColumnList = res[0].data;
          this.preferenceList=this.columnDefs.map(item=>({title:item.headerName,value:item.field}))
          // this.preferenceList = res[1].data;
          // this.tableHeader = this.preferenceList.map(item => ({
          //   label: item.title,
          //   prop: item.value,
          //   width: this.getLoactionWidth(item.title)
          // }))
          // this.saveLocation()
          // this.checkCaseList = this.preferenceList.map(item => item.value);
          // // this.preferenceList.forEach(item => {
          // //   this.$set(this.filterData, item.value, []);
          // // });
          // // this.checkFilterList = this.preferenceList.map(item => false);
        });
      },

      queryFilter() {
        this.transferVisible = true;
        const data = {
          bussId: this.bussId
        };
        queryFilter(data).then(res => {
          if (res.success) {
            this.transferData = this.generateData(res.data);
          }
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
          this.transferVisible = false;
          this.queryFilterConfig();
        });
      },
      handleSelect(key,requireList,multipleTypeTextDisabled) {
        this.requireList=[]
        this.uploadType=''
        this.multipleTypeText=''
        if(requireList){
          this.requireList=requireList
        }
        if (key === "1-2-1") {
          this.multipleTypeText = "递交";
        }
        if (key === "1-2-2") {
          this.multipleTypeText = "官方通知";
        }
        if (key === "1-1-1") {

          this.multipleTypeText = "新建账单";

        }
        if (key === "1-1-2") {
          this.multipleTypeText = "新建内部账单";
        }

        if (key === "1-1-3") {
          this.multipleTypeText = "新建费用";
        }
        if (key === "1-1-4") {
          this.multipleTypeText = "新建境外账单";
        }
        if (key === "1-3-1") {
          this.multipleTypeText = "新建官方时限";
         // this.queryCaseList();
        }
        if (key === "1-3-2") {
          this.multipleTypeText = "新建内部时限";
          // this.queryCaseList();
        }
        if (key === "1-2-2-2") {
          this.multipleTypeText = "递交官方(文件)";
          this.uploadType = "递交官方";

          // this.queryCaseList();
        }
        if (key === "1-2-3") {
          this.multipleTypeText = "客户往来";
          this.uploadType = "客户往来";
          // this.queryCaseList();
        }
        if (key === "1-2-4") {
          this.multipleTypeText = "内部往来";
          this.uploadType = "内部往来";
          // this.queryCaseList();
        }
        if (key === "1-2-5") {

          this.multipleTypeText = "外代所往来";
          this.uploadType = "外代所往来";
          // this.queryCaseList();
        }
        if (key === "1-2-6") {
          this.multipleTypeText = "对方当事人往来";
          this.uploadType = "对方当事人往来";
          // this.queryCaseList();
        }
        if (key === "1-2-7") {
          this.multipleTypeText = "特批预立卷审批";
          this.uploadType = "特批预立卷审批";
          // this.queryCaseList();
        }
        if (key === "批量操作") {
          this.multipleTypeText = "批量操作";
          // this.queryCaseList();
        }
        if (key === "文件下载") {
          this.multipleTypeText = "文件下载";
        }
        if (key === "变更办案人") {
          this.multipleTypeText = "变更办案人";
        }
        if (key === "1-2") {

          this.multipleTypeText = "模板生成";
          // this.multipleTypeText = "报官清单";
        }
        if (key === "1-3") {
          this.multipleTypeText = "模板生成";
          // this.multipleTypeText = "批量报官清单";
        }
        // if (key === "文件上传排序") {
        //   this.multipleTypeText = "文件上传";
        //   this.multipleTypeTextDisabled=true
        //   // this.queryModuleData.isTmfileIdOrder=1
        //   this.queryCaseList({isTmfileIdOrder:1})
        //   return
        // }
        // if (key === "文件上传") {
        //   this.multipleTypeText = "文件上传";
        // }
        // if(multipleTypeTextDisabled){
        //   if(!this.getSelectedSortRows().length){
        //     this.$message.error('请选择需要匹配的案件')
        //     return;
        //   }
        //
        //   if(!this.curFile.length){
        //     this.$message.error('先拖动文件到表格中，再点击"文件上传"')
        //     return
        //   }
        //   if(this.curFile.length!=this.getSelectedSortRows().length){
        //     this.$message.error('文件和案件数量需要相同')
        //     return
        //   }
        //   this.uploadProofreadingState=true
        //   return;
        // }
        if (key === "1-4") {

          this.multipleTypeText = "工时";
        }
        if (key === "1-5") {

          this.multipleTypeText = "任务";
        }
        this.jumpDetailSubmisson(key)
      },
      exportList(flag) {
        this.exportType=flag
        this.selectionOptionState=true
        // this.otherSelect = false
        // this.multipleSelection.forEach(item => {
        //   this.$refs.caseListMultiple.toggleRowSelection(item, false)
        // })
        // this.multipleSelection = []
        // this.selectionState = true;
        // this.multipleTypeText = '列表导出';
        // this.exportListState = true
        // this.jumpDetailSubmisson()
      },
      getExportFileData(requireList,key){
        if(key){
          this.$refs.exportFile.currentType=key
        }
        this.multipleTypeTextDisabled=false
        this.multipleTypeText='模板生成'
        this.exportListState=false
        this.requireList=requireList
        this.jumpDetailSubmisson()
      },
      rowSelected(params){
        if(this.pdfDataState){
          if(params.node.selected){
            this.pdfData=[]
            this.$nextTick(()=>{
              if(params.node.data.addressList){
                this.pdfData = params.node.data.addressList.filter(itm=>['pdf','jpg','png'].some(item=>itm.replace(/.+\./,"").toLocaleLowerCase()==item))
                if(this.pdfData.length==0){
                  this.pdfDataState=false
                }
              }
              // this.pdfDataState = true;
              // this.pdfPre(params.node.data,params.value,params.node)
            })
          }
        }
        if(!this.selectionState){
          this.rowClicked(params)
        }
      },
      rowClicked(param){
        if(param.node.selected){
          if(param.data[this.getCurFilterId(this.pageTitle)]!=this.currentId){
            this.currentId=''
            this.currentCaseId=''
            this.$nextTick(()=>{
              this.currentId=param.data[this.getCurFilterId(this.pageTitle)]
              this.currentCaseId=param.data.caseId
            })
          }
        }
      },
      refreshEvenRowsCurrencyData(params) {
        this.currentPageSize = params.api.rowModel.rootNode.allChildrenCount
        if(!params.columnApi.columnController.groupAutoColumns) {
          this.gridApi.forEachNode(rowNode => {
            rowNode.setDataValue(
              'sid',
              rowNode.rowIndex + 1)
          });
        }
      },
      selectionChanged(params,n){
        let flag=true
          if (this.multipleTypeText === "递交") {
            if ([...new Set(this.getSelectedRows().map(item => item.custName))].length >= 2) {
              this.$message.error("您必须选择同一客户下的案件");
              flag=false
            }
            if ([...new Set(this.getSelectedRows().map(item => item.caseType))].length >= 2) {
              this.$message.error("您必须选择同一案件类型的案件");
              flag=false
            }
            if ([...new Set(this.getSelectedRows().map(item => item.appCnName))].length >= 2) {
              this.$message.error("您必须选择同一申请人下的案件");
              flag=false
            }
          }

          if (this.multipleTypeText === "新建账单" || this.multipleTypeText === "新建内部账单") {
            if ([...new Set(this.getSelectedRows().map(item => item.custName))].length >= 2) {
              this.$message.error("您必须选择同一客户下的案件");
              flag=false
            }
          }
          // if (this.multipleTypeText === "批量操作") {
          //   if ([...new Set(this.getSelectedRows().map(item => item.caseTypeId))].length >= 2) {
          //     this.$message.error("您必须选择同一案件类型的案件");
          //     flag=false
          //   }
          //   if (this.multipleSelection.length&&(this.getSelectedRows()[0].caseTypeId==48||this.getSelectedRows()[0].caseTypeId==62)&&[...new Set(this.getSelectedRows().map(item => item.changeType))].length >= 2) {
          //     this.$message.error("您必须选择同一撤回类型的案件");
          //     flag=false
          //   }
          // }
          if (this.multipleTypeText === "报官清单"){
            if(this.requireList.length){

              this.requireList.forEach(thisType =>{
                if ([...new Set(this.multipleSelection.map(item => item[thisType['value']]))].length >= 2) {
                  this.$message.error(`该选择需要${thisType.label}相同`);
                  flag=false
                }
              })
            }
          }
          if(this.multipleTypeText === "申请书") {
            if ([...new Set(this.getSelectedRows().map(item => item.caseType))].length >= 2) {
              this.$message.error("您必须选择同一案件类型的案件");
              flag=false
            }
          }
          return flag
      },
      cellRenderer(params){
        if(params.colDef.field=='imageFile'){
          return  `<img class="filterTableTmg"   src="/ipdoc${params.value}" alt="">`
        }
        if(params.colDef.field=='isLackMaterial'){
          if (params.value=='是'){
            return `<label role="checkbox" class="el-checkbox is-checked" aria-checked="true"><span aria-checked="mixed" class="el-checkbox__input is-checked"><span class="el-checkbox__inner"></span><input type="checkbox" aria-hidden="true" class="el-checkbox__original" value=""></span><!----></label>`
            } else {
            return `<label role="checkbox" class="el-checkbox" aria-checked="true"><span aria-checked="mixed" class="el-checkbox__input"><span class="el-checkbox__inner"></span><input type="checkbox" aria-hidden="true" class="el-checkbox__original" value=""></span><!----></label>`
            }
        }
        if(params.colDef.field=='agentNum'){
          var eDiv = document.createElement('div');
          eDiv.innerHTML = `<span class="btn-simple" title="${params.value}">${params.value?params.value:''}</span>`
          var eButton = eDiv.querySelectorAll('.btn-simple')[0];

          eButton.addEventListener('click', ()=> {
            if(!this.pattern&&!this.selectionState){
              this.takeCaseDetail(params.data)
            }
          });

          return eDiv;
        }
        if(params.colDef.field==='reportMatter'){
          if(params.value=='申请'){
            return `<span style="color:blue" title="${params.value}">${params.value ? params.value :''}</span>`
          } else {
            return  `<span style="color:red" title="${params.value}">${params.value ? params.value :''}</span>`
          }
        } else if (params.colDef.field === 'insSubmitType') {
          if (params.value == '人工送达') {
            return `<span style="color:blue" title="${params.value}">${params.value ? params.value :''}</span>`
          } else {
            return `<span style="color:red" title="${params.value}">${params.value ? params.value :''}</span>`
          }
        } else if (params.colDef.field ==='submitPlace') {
          if (params.value == '国际处' ||params.value == '海淀区工商局') {
            return `<span style="color:blue" title="${params.value}">${params.value ? params.value :''}</span>`
          }
        }
        if(params.colDef.field == 'sid'){
          return params.rowIndex+1
        }
        if(params.colDef.field == 'multiclassStr'){
          return `<span title="${params.value}">${params.value?params.value:'否'}</span>`
        }

        return `<span title="${params.value}">${params.value?params.value:''}</span>`
      },
      rowDoubleClicked(params){
        var row=params.data
        if(this.pageTitle!=='案件管理'){
          this.getViewRow(row)
        } else {
          this.takeCaseDetail(row)
        }
      },
      changeSelection(n){
        if(n){
          this.columnDefs.find(item=>item.field=='sid').checkboxSelection=function(params) {
            // we put checkbox on the name if we are not doing grouping
            return params.columnApi.getRowGroupColumns().length === 0;
          },
            this.columnDefs.find(item=>item.field=='sid').headerCheckboxSelection= function(params) {
              // we put checkbox on the name if we are not doing grouping
              return params.columnApi.getRowGroupColumns().length === 0;
            }
          this.columnDefs.find(item=>item.field=='sid').width=80
          this.columnDefs.push({})
          this.columnDefs.pop({})
        }else {
          this.columnDefs.find(item=>item.field=='sid').checkboxSelection=false
          this.columnDefs.find(item=>item.field=='sid').headerCheckboxSelection=false
          this.columnDefs.find(item=>item.field=='sid').width=60
          this.columnDefs.push({})
          this.columnDefs.pop({})
        }
      },
      getSelectedRows() {
        if(this.gridApi){
          const selectedNodes = this.gridApi.getSelectedNodes();
          const selectedData = selectedNodes.map(node => node.data);
          return selectedData
        }else {
          return []
        }
        // if (this.selectionState) {
        //
        // } else {
        //   return []
        // }
        // if(this.gridReadyState){
        //   const selectedNodes = this.gridApi.getSelectedNodes();
        //   const selectedData = selectedNodes.map(node => node.data);
        //   return selectedData
        // }else {
        //   return []
        // }
      },
      getSelectedSortRows() {
        if (this.gridReadyState) {
          const selectedNodes = this.gridApi.getSelectedNodes();
          // const selectedData = selectedNodes.map(node => node.data);
          return  this.gridApi.rowModel.rootNode.childrenAfterSort.filter(item=>selectedNodes.includes(item)).map(node=>node.data)
        } else {
          return []
        }
      },
      onGridReady(params) {
        this.gridparams=params
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.gridReadyState=true
      },
      dragStopped(params){
        let tableHeader=params.columnApi.columnController.gridColumns.map(item=>({
          label:item.colDef.headerName,
          width:item.actualWidth,
          prop:item.colDef.field,
        })).filter(item=>item.prop!='sid'&&item.prop!="group")
        var arr=JSON.parse(localStorage.getItem('tableHeader'))
        // this.identification
        arr.find(item=>item.name==this.identification).tableHeader=tableHeader
        localStorage.setItem('tableHeader',JSON.stringify(arr))
        this.changeHeader(tableHeader)
        // console.log(a);
      },
      getContextMenuItems(params){
        if(!params.node||!params.node.data){
          return []
        }
        return this.getRowContextmenuList(params.node.data).map(item=>({
          name: item.name,
          action: () =>{
            this[item.action](params.node.data,params.value,params.node)
          },
        }))
      },
      changeHeader(n){
        if(n&&n.length){
          this.checkCaseList=n.map(item => item.prop)
          let list2 = this.checkCaseList.map(item => ({
            title: this.selectColumnList.find(i => i.COLUMN_NAME === item)
              .COLUMN_COMMENT,
            value: item
          }));
          const data = {
            userId: this.userId,
            bussId: this.bussId,
            list2
          };

          savePreference(data).then(res => {
            // this.tableState=false
            //  this.$nextTick(()=>{
            //  //  this.tableState=true
            //    this.caseList.push({})
            //    this.caseList.pop()
            //  })
          });
        }
        // this.selectColumnList=
        // console.log(this.selectColumnList);
        // this.savePreference(1)
      },
      filterCheck(val) {
        this.filterText = val;},
      unique(data, key) {
        return unique(data, key)
      },
      getCurFilterId(title) {
        switch (title) {
          case "案件管理":
            return "caseId";
          case "递交官方":
            return "insId";
          case "官方通知":
            return "insId";
        }
      },
    },
    watch: {
      timeLimitState(n,o){
        if(!n){
          let allData = this.$refs['timeLimit']._data
          for(var key in allData){
            allData[key] = ''
          }
        }
      },
      // checkboxState(n) {
      //   if (n) {
      //     this.$nextTick(() => {
      //       this.$refs.checkCaseSelect.focus()
      //     })
      //   }
      // },
      // tableHeader(n) {
      //   this.tableHeaderLabelList = n.map(item => item.label)
      // },
      columnDefs:{
        handler(n,o){
          console.log(n, o);
        },
        deep:true
      },
      selectionState(n){
        // if(n){
        //   if(this.multipleTypeText!='官方通知'){
        //     this.gridApi.deselectAll()
        //   }
        // }
        // this.changeSelection(n)
      },
    },
    computed: {
      ...mapGetters(["userId"]),
      ...mapState({
        'pattern' : state => state.user.pattern,
        'ajglTabList' : state => state.tabs.ajglTabList,
        'djgfTabList' : state => state.tabs.djgfTabList,
        'gftzTabList' : state => state.tabs.gftzTabList,
      }),
      clientHeight() {
        return document.documentElement.clientHeight -240
      },
    },
    components:{
      SelectOption,
      Willtable,
      BulkUploadFile,
      exportFile,
      seeCaseDetail,
      DetailOfficialCommunication,
      officialSubmission,
      createTimeLimit
    }
  }
</script>

<style lang="scss" scoped>
  header {
    margin-bottom: 19px;
    box-shadow: 0px 2px 5px 0px rgba(163, 163, 163, 0.35);

    /*<!--.queryButton:before{-->*/
    /*<!--content: '';-->*/
    /*<!--display: block;-->*/
    /*<!--width:0px;-->*/
    /*<!--border-right: 2px dashed rgba(191, 191, 191, 1);-->*/
    /*<!--height:58px;-->*/
    /*<!--position: absolute;-->*/
    /*<!--left: 0;-->*/
    /*<!--top: 50%;-->*/
    /*<!--transform: translateY(-50%);-->*/
    /*<!--}-->*/
  }
  .queryButton {
    display: flex;
    flex-wrap: nowrap;
    position: relative;
    justify-content: center;
    .buttonWrap_small {
      transform: translateX(-90px);
      display: flex;
      margin: 5px 5px;
      align-items: center;
      .el-button {
        margin-left: 10px;
      }
    }
  }

  .el-form {
    position: relative;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .el-cascader {
      width: 100%;
    }
    .el-select /deep/{
      .el-select__tags{
        max-height: 40px;
        overflow-y: auto;
      }
    }
    .multi-cascader /deep/{
      .el-cascader__label{
        max-height: 40px;
        overflow-y: auto
      }
    }
    .postInfo-container-item {

      /deep/ .el-form-item__content {
        width: 330px;
        display: flex;
        height: 28px;
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
  .case_management_item {
    /*min-height: calc(100vh - 50px - 18px - 41px);*/
    display: flex;
    flex-direction: column;
    //overflow: auto;
    padding: 5px 5px;
  }
  section {
    position: relative;
    clear: both;
    flex: 1;
    //padding-bottom: 200px;
  }
  .checkbox {
    position: absolute;
    left: 0px;
    top: 34px;
    /*width: 222px;*/
    height: 330px;
    border: 1px solid #99a9bf;
    background: #fff;
    z-index: 100;
    padding-top: 6px;
    padding-left: 6px;
    padding-right: 16px;
  }
  .checkbox_bottom {
    position: absolute;
    display: flex;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 29px;
    background: #fff;
    z-index: 2;
    justify-content: flex-end;
  }
  .checkbox_bottom ~ li:last-of-type {
    margin-bottom: 30px;
  }
  .brush_right{
    position: absolute;
    right: 6px;
    z-index: 1;
    top: -4px;
  }
  .dots {
    cursor: pointer;
    position: absolute;
    left: 0;
    z-index: 1;
    top: 6px;
    width: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    .dot {
      color: transparent;
      padding: 1px;
      margin: 1px;
      width: 5px;
      background: RGBA(113, 123, 140, 1);
      height: 5px;
      display: block;
    }
    & ~ span {
      margin-left: 5px;
    }
  }

  .el-table {
    overflow: visible;
    /deep/ th {
      color: rgba(51, 51, 51, 1);
      background: rgba(187, 187, 187, 0.5);
    }
  }
  .el-table /deep/ td .cell {
    height: 40px;
  }
  .el-table /deep/ th .cell {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    padding-left:10px ;
    img {
      margin-left: 5px;
      width: 12px;
      cursor: pointer;
    }
    .checkboxs {
      position: absolute;
      background: #fff;
      min-width: 100%;
      top: 47px;
      left: 0px;
      display: flex;
      z-index: 1;
      border: 1px solid #f4f4f5;
      overflow: visible;
      padding-left: 6px;
      padding-bottom: 80px;
      .filter_content {
        width: 100%;
        max-height: 200px;
        height: 200px;
        overflow: auto;
      }
      .el-checkbox-group {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        overflow: visible;
      }
      .checkAll {
        position: absolute;
        bottom: -27px;
        width: 100%;
        left: 0;
        background: #fff;
        height: 27px;
        color: #409eff;
        text-indent: 5px;
        line-height: 27px;
        cursor: pointer;
        border: 1px solid #f4f4f5;
      }
    }
  }
  .el-table /deep/ th div{
    overflow: visible;
    text-overflow: inherit;
    padding: 0;
  }

  .el-table /deep/ .el-table__header-wrapper {
    overflow: hidden;
    th {
      overflow: visible;
      .cell {
        overflow: visible;
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
  .el-dropdown {
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
    width: 66px;
    height: 32px;
    font-size: 12px;
    border-radius: 3px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 10px;
  }
  .el-menu-demo {
    display: inline-block;
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
    width: 92px;
    height: 32px;
    font-size: 12px;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 10px;
    &:hover {
      opacity: 0.8;
    }
    /deep/ li {
      height: 100%;
      width: 100%;
      .el-submenu__title {
        border-radius: 3px;
        background: #409eff;
        color: #fff !important;
        line-height: 32px;
        height: 100%;
        text-align: center;
        border-bottom: 0;
        padding: 0;
        i {
          color: #fff;
        }
        &:hover {
          color: #fff;
          background: #409eff;
        }
      }
    }
    //padding: 9px 15px;
  }
  .button_wrap {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 50px;

    .el-button {
      margin-left: 10px;
    }
  }


  .fullItem {
    width: 100%;
  }
  .pdfPreview {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
  }
  /deep/ .plTableBox {
    .ant-table-scroll {
      max-height: "af" !important;
      .el-table {
        height: "123" !important;
      }
    }
    .myPagination {
      display: none;
    }
  }
  .FilterSelectWrap{
    display: flex;
    flex-wrap: wrap;
    .filterSelect{
      width: 232px;
      margin-right: 30px;
      margin-bottom: 10px;
    }
  }
  .selectButton{
    position: absolute;
    right: 12px;
    top: 28px;
  }
  .myeltable{
    /deep/ .cell{
      overflow:hidden;
      white-space: nowrap;
      text-overflow: clip;
    }
  }

  .divdiver{
    position: relative;
    left: 30px;
    height: 1px;
    width: 83%;
    background: #EEF2FB;
    margin-bottom: 10px;
  }
  /deep/ .selectRow{
    background: #C9C8D0;



  }
  /deep/ .gray{
    background: #E4E2E2;
  }
  /deep/ .pagination-container{
    padding: 0;
  }
  .content_wrap{
    width: 100%;
    display: flex;
    .left_wrap{
      position: relative;
      transition:all 0.5s;
      //   width: 40%;
    }
    .right_wrap{
      box-shadow: 0px 0px 18px 0px rgba(64, 158, 255,0.5);
      height: 598px;
      overflow: auto;
      transition:all 0.5s;
      flex: 1;
      /deep/ *{
        font-size: 12px !important;
      }
      // width: 60%;
      /deep/.sectionWrap{
        padding: 0 !important;
        padding-left: 10px !important;
        // padding-bottom: 350px!important;
        .ElectronWrap{
          padding: 0!important;
        }
      }
    }
  }
  .w-table  {
    position: relative;
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* 没有前缀，目前支持Opera和谷歌浏览器 */
    /deep/ .caret-wrapper{
      position: relative;
    }
    /deep/ .el-table__column-filter-trigger{
      position: relative;
    }
    /deep/ .el-table th {
      padding: 0;
      .virtual{
        position: absolute;
        display: block;
        width: 0;
        height: 0;
        z-index: 99;
        top: 0;
        background: none;
        border: none;
        box-sizing: border-box;
      }
      .thead-cell {
        vertical-align: middle !important;
        padding: 0;
        display: inline-flex;
        flex-direction: column;
        align-items: left;
        cursor: pointer;
        overflow: visible;
        /*&:before {*/
        /*content: "";*/
        /*position: absolute;*/
        /*top: 0;*/
        /*left: 0;*/
        /*bottom: 0;*/
        /*right: 0;*/
        /*}*/
      }
    }

    &.w-table_moving {
      .el-table th .thead-cell{
        cursor: move !important;
      }
      .el-table__fixed {
        cursor: not-allowed;
      }
    }
  }
  .right_wrap{

    /deep/.el-collapse-item{
      border-bottom: 1px solid #303133;
    }
  }
  /deep/ .moveIng{
    .virtual {
      border: 2px dotted #666 !important;
    }
  }
  /deep/  .darg_active_left {
    .virtual {
      border-left: 2px dotted #666 !important;
    }
  }

  /deep/  .darg_active_right {
    .virtual {
      border-right: 2px dotted #666 !important;
    }
  }
  .DataPicker /deep/ {
    .el-input__prefix{
      display: none;
    }
    .el-input__inner{
      text-align: left;
      padding-left: 15px;
      padding-right: 18px;
      // padding-left: 10px;
    }
  }
  .djSubmitDateArray{
    width: 490px;
    margin-bottom: 0;
    /deep/ .el-form-item__label{
      line-height: 40px!important;
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
      max-height: 500px;
      position: absolute;
      background: #ffffff;
      border: 1px solid #d4d5d5;
      z-index: 1;
      overflow: auto;
      padding: 20px 0;
      box-shadow: 0 3px 6px rgba(111,111,111,0.2);
      /deep/  .el-form{
        padding-bottom: 10px;
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
        width: 100%;
        background: #fff;
        right: 10px;
        padding-bottom: 10px;
        position: absolute;
        z-index: 1;
      }
    }
  }
  @keyframes show {
    0% {

      opacity: 0;
      //transform: translateX(100%);

    }
    100% {
      // transform: translateX(0);
      opacity: 1;

    }
  }
  @keyframes hide {
    0% {
      opacity: 1;
      // transform: translateX(0);
    }
    100% {

      opacity: 0;
      //  transform: translateX(100%);
    }
  }
  .show-enter-active {
    animation: show 0.5s;
  }
  .show-leave-active {
    animation: hide 0.5s;
  }
  .show-enter, .show-leave-to {
    opacity: 0;
  }
  .ViewsSwitching{
    position: absolute !important;
    right: 0;
    z-index: 100;
    top: 5px;
  }
  .searchRight{
    margin-left: 0;
    height: 32px;
    border-top-right-radius:3px !important;
    border-bottom-right-radius:3px !important;
    padding: 0 5px
  }
  .MyTabs{
    width: 100%;
    position: absolute;

    /deep/ .el-tabs{
      .el-tabs__header{
        margin: 0;
      }
      .el-tabs__content{
        background: #fff;
      }
    }
  }
  .MyTabs.activity{
    background: #fff;
    z-index: 8;
    /deep/ .el-tabs{
      .el-tabs__header{
        margin: 0;
        background: #fff;
      }
      .el-tabs__content{
        background: #fff;
      }
    }
  }
  .queryButton{
    z-index:7
  }
  .cube{
    -webkit-transform: translateZ(0);
    -moz-transform: translateZ(0);
    -ms-transform: translateZ(0);
    -o-transform: translateZ(0);
    transform: translateZ(0);
    /* Other transform properties here */
  }
  /deep/ .imgWrap{
    .cell{
      width: 100%;
      height: 30px;
    }
  }
  .noTrigger /deep/.el-table__column-filter-trigger{
    display: none;
  }
  /deep/ .filterTableTmg {
    height: 100%;
    /*width: 100%;*/
    /*height: 30px;*/
  }
  /*/deep/ .ag-theme-balham .ag-row-selected {*/
  /*  background-color: #b7e4ff !important;*/
  /*}*/
  .pdfDialog  /deep/{
    z-index: 3000;
    .el-dialog{
      z-index: 3000;
      height: 100vh;
      display: flex;
      flex-direction: column;
      .el-dialog__body{
        flex: 1;
        .swiper-container{
          height: 100%;
          .swiper-button-prev-son{
            cursor: pointer;
            position: absolute;
            top: 10px;
            left: 50%;
            z-index: 10000;
            transform: translateX(-50%);
            text-align: center;
            font-size: 50px;
          }
          .swiper-button-next-son{
            cursor: pointer;
            position: absolute;
            bottom:  10px;
            left: 50%;
            z-index: 10000;
            transform: translateX(-50%);
            text-align: center;
            font-size: 50px;
          }
        }
      }
    }
    .iframe{
      width: 100%;
      height: 100%;
    }
  }
  .button_grey{
    background: grey;
    border-color: grey;
  }
  .progressWrap{
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0,0,0,0.6);
    z-index: 200;
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

</style>
