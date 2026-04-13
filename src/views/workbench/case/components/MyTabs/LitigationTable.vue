<template>
  <div>
    <div class="queryButton" style="margin: 0 auto" >
      <div class="buttonWrap_small">
        <el-menu class="el-menu-demo" mode="horizontal" @select='(e)=>handleSelect(e)' v-allow="83">
          <el-submenu index="1">
            <template slot="title">新建</template>
            <el-submenu index="1-1" v-allow="152">
              <template slot="title">新建费用账单</template>
              <el-menu-item index="1-1-1" v-allow="180">账单</el-menu-item>
              <el-menu-item index="1-1-2" v-allow="181">内部账单</el-menu-item>
              <el-menu-item index="1-1-4" v-allow="229">境外账单</el-menu-item>
              <el-menu-item index="1-1-3">费用</el-menu-item>
            </el-submenu>
            <el-submenu index="1-2">
              <template slot="title">新建案件进程</template>
              <el-menu-item index="1-2-1" v-if="$store.getters.permissions.includes(182)">递交指令</el-menu-item>
              <el-menu-item index="1-2-2" v-allow="183" v-if="business != 6&&taskType !=  7">官方通知</el-menu-item>
              <el-menu-item index="1-2-2-3" >cpc递交文件</el-menu-item>
              <el-menu-item index="1-2-2-2" >递交官方(文件)</el-menu-item>
              <el-menu-item index="1-2-3" v-if="taskType != 4">客户往来</el-menu-item>

                <el-submenu v-else index="1-2-3">
                  <template slot="title">客户往来</template>
                  <el-menu-item index="1-2-3-1">客户指示</el-menu-item>
                  <el-menu-item index="1-2-3-2">致函客户</el-menu-item>
                </el-submenu>

              <el-menu-item index="1-2-4">内部往来</el-menu-item>
              <el-menu-item index="1-2-5" v-if="taskType != 4">外代所往来</el-menu-item>
              <el-submenu v-else index="1-2-5">
                <template slot="title">外代所往来</template>
                <el-menu-item index="1-2-5-1">外代所来函</el-menu-item>
                <el-menu-item index="1-2-5-2">致函外代所</el-menu-item>
              </el-submenu>
              <el-menu-item index="1-2-6">对方当事人往来</el-menu-item>
              <!--<el-menu-item index="1-2-7">特批预立卷审批</el-menu-item>-->
            </el-submenu>
            <el-submenu index="1-3" v-allow="154">
              <template slot="title">新建时限</template>
              <el-menu-item index="1-3-1" v-allow="190">官方时限</el-menu-item>
              <el-menu-item index="1-3-2" v-allow="191">内部时限</el-menu-item>
            </el-submenu>
<!--            <el-menu-item index="1-4">工时</el-menu-item>-->
<!--            <el-menu-item index="1-5">任务</el-menu-item>-->
          </el-submenu>

        </el-menu>


<!--                模板生成-->
<!--        <exportFile v-if="pageTitle==='案件管理'&&taskType == 4" ref="exportFile" :business="3" :downLoadState="downLoadState"-->
<!--                    :multipleSelection="getSelectedRows()" @getData="getExportFileData" @exportList="exportList"-->
<!--                    @close="closeSelect" :pageTitle="pageTitle" @multipleTypeText="changeMultiple"></exportFile>-->




<!--        <el-menu class="el-menu-demo" mode="horizontal" @select='(e)=>handleSelect(e,[],true)' v-if="pageTitle!='官方通知' && pageTitle!='递交官方' && taskType == 4"  >-->
<!--          <el-submenu index="1">-->
<!--            <template slot="title">文件上传</template>-->
<!--            <el-menu-item index="1-2-2-2">递交官方(文件)</el-menu-item>-->
<!--            <el-menu-item index="1-2-3"  >客户往来</el-menu-item>-->
<!--            <el-menu-item index="1-2-4" >内部往来</el-menu-item>-->
<!--            <el-menu-item index="1-2-5" >外代所往来</el-menu-item >-->
<!--            <el-menu-item index="1-2-6" >对方当事人往来</el-menu-item>-->
<!--          </el-submenu>-->
<!--        </el-menu>-->
      </div>


    </div>
    <div style="display: flex;position: relative">
      <TitleTotal :total="list.length" />
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
                   :columnDefs="defaultColumnDefs"
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
        <seeCaseDetail v-if="currentCaseId&&pattern" :case-id="currentCaseId" :sign="1" :taskType="taskType"
                         :backsign="false">
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
<!--    <detail-official-communication :taskType="taskType" v-if="communicationState" @closeThisPage="closeSelect" :dialogVisible="communicationState" :queryInfo="queryInfo" ></detail-official-communication>-->
    <litigationSubmission :business="business" :taskType="taskType"
                          :title="title"
                          v-if="submissionState" :submissionState="submissionState" :submissionType="submissionType"
                          :multipleSelection="multipleSelectionCaseArray"
                          :curCaseId="multipleSelectionCaseArray.map(item=>item.caseId)"
                          @changeFalse="closeSelect"></litigationSubmission>

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
      <createTimeLimit v-if="timeLimitState" :query="timeLimitData" @cancel="closeSelect"></createTimeLimit>

    </el-dialog>
    <litigationOfficial :business="business" :taskType="taskType" v-if="officialCommunicationState"
                        :officialCommunicationState="officialCommunicationState"
                        :officialCommunicationType="officialCommunicationType"
                        :multipleSelection="multipleSelectionCaseArray" @closeThisPage="closeSelect"/>
  </div>
</template>
<script>
  import litigationSubmission from '@/views/workbench/case/officialSubmission/components/litigationSubmission.vue'
  import litigationOfficial from '@/views/workbench/case/officialCommunication/components/litigationOfficial.vue'
import {
  selectColumn,
  savePreference,
  queryPreference,
  delPreference,
  queryFilter,
  configFilter,
  queryCorrelationCaseList
} from "@/api/caseList.js";
import {mapState,mapGetters} from 'vuex'
import {unique,throttle} from '@/utils'
import BulkUploadFile from "../BulkUploadFile";
import SelectOption from "../SelectOption";
import seeCaseDetail from "../ManualIdentification/seeCaseDetail";
import ViewsSwitching from "../ViewsSwitching";
import Willtable from "@/components/Willtable";
import exportFile from '@/components/exportFile'
import DetailOfficialCommunication from '@/views/workbench/case/officialCommunication/detailOfficialCommunication';
import officialSubmission from '@/views/workbench/case/officialSubmission/components/detailSubmission.vue'
import Bus from '@/utils/Bus'
import CreateTimeLimit from '../../../toDoTasks/createTimeLimit'
export default {
  props: {
    name:{

    },
    // taskType:{
    //   default: 2
    // },
    editableTabsValue:{

    },
    business: {
      type: String,
      default: "2"
    },
    // bussId: {
    //   type: String,
    //   default: '5'
    // },
    caseList: {
      type: Array,
      default: () => []
    },
    pageTitle: {
      type: String,
      default:'案件管理'
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
      submissionState: false,
      multipleSelectionCaseArray: [],
      officialCommunicationType: '',
      officialCommunicationState: false,
      timeLimitData: {},
      timeLimitState: false,
      bussId: 11,
      // userId:this.$store.getters.userId,
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
        // { name: '相关案件', action: 'relevant' },
        { name:'暂存', action: 'temporarStorage'},
        // { name:'隐藏', action: 'hidden'}

      ],
      filed:"",
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
  beforeDestroy(){
    // Bus.$off('changeColumns')
  },
  created() {
    Bus.$on('changeColumns', (name)=>{
      this.changeColumns(name)
    })
    this.columnDefs=this.defaultColumnDefs
    this.getAllWfs();
    // this.getContextMenuItems = this.defaultGetContextMenuItems

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
      return this.rowContextmenuList.concat([
        { name:'复制',action: 'copy' },
        { name: '修改', action: 'editFun',permissions:203, isSubmitOfficial:0, taskType: this.taskType},
        { name: '修改', action: 'editFun',permissions:204, isSubmitOfficial:1, taskType: this.taskType},
        { name: '删除', action: 'delCase',permissions:205, isSubmitOfficial:0, taskType: this.taskType},
        { name: '删除', action: 'delCase',permissions:206, isSubmitOfficial:1, taskType: this.taskType},
        {name: '删除', action: 'delCase', permissions: 250, taskType: this.taskType},
      ].filter(item => {
            if(item.taskType){
              return item.taskType != 1
            }else if (item.permissions) {
              if(this.taskType == 4){
                return this.$store.getters.permissions.includes(item.permissions) && row.isSubmitOfficial===item.isSubmitOfficial
              }
              return this.$store.getters.permissions.includes(item.permissions)
            } else {
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
    getCurFilterId(title) {
      switch (title) {
        case "案件管理":
          return "caseId";
        case "递交官方":
          return "insId";
        case "官方通知":
          return "tmFileId";
      }
    },
    hidden(row){
      this.list=this.list.filter(item=>item[this.getCurFilterId(this.pageTitle)]!=row[this.getCurFilterId(this.pageTitle)])
      // this.caseList.splice(this.caseList.indexOf(row),1)
      this.currentPageSize-=1
    },
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
      this.$store.commit('tabs/CHANGE_STORAGETABLE',{type:'push',title:'暂存案件',name:'暂存案件',identification:this.identification,data:row})
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
    closeSelect(f){
      this.isAuditing = false
      this.isChangeDoc = false
      this.timeLimitState = false
      this.selectionState = false
      this.selectionOptionState = false
      this.uploadState = false
      this.ManualIdentificationState = false
      this.submissionState = false
      this.officialCommunicationState = false
      this.uploadType = ''
      this.uploadProofreadingState=false
    },
    editFun(row) {
      // if(row.pageId===100){
      //   this.$router.push('/workbench/case/case_detail/'+row.caseId+'/'+row.caseType+'?pageId=100')
      // } else {
      //   this.$router.push('/workbench/case/case_detail/'+row.caseId+'/'+row.caseType)
      // }
      if (row.pageId === 100) {
          this.$router.push('/workbench/case/case_detail/' + row.caseId + '/' + row.caseType || row.caseTypeStr + '?pageId=100&taskType=' + this.taskType + '&copy=false')
        } else {
          this.$router.push('/workbench/case/case_detail/' + row.caseId + '/' + row.caseType || row.caseTypeStr + '?taskType=' + this.taskType + '&copy=false')
        }
    },
    delCase(row) {
      this.$store.commit('tabs/CHANGE_STORAGETABLE',{type:'delete',title:this.editableTabsValue,name:this.editableTabsValue,identification:this.identification,data:row})
      // this.$store.commit('tabs/CHANGE_STORAGETABLE',{type:'delete',data:{title:this.editableTabsValue,name:this.editableTabsValue,data:row}})
      // this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'delete',data:{title:this.editableTabsValue,name:this.editableTabsValue,data:row}})
    },
    takeCaseDetail(row) {
      this.$router.push("/workbench/case/seeCaseDetail/" + row.caseId + '?taskType=' + this.taskType);
      // if( this.$commonUtils.getTwoDimensionalArray(this.$store.getters.caseTypeList,'caseTypeId',row.caseTypeId).includes(2)){
      //   this.$router.push({ path: '/workbench/case/seeCaseDetail/' + row.caseId, query: {taskType: this.taskType}})
      // }else {
      //   this.$router.push("/workbench/case/seeCaseDetail/" + row.caseId);
      // }
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
        this.preferenceList=this.defaultColumnDefs.map(item=>({title:item.headerName,value:item.field}))
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
    // handleSelect(key, keyPath) {
    //
    //   if (!this.getSelectedRows().length) {
    //     this.$message.error('请选择案件！')
    //     return
    //   }
    //   Bus.$emit('handleSelect', key)
    // },
    getLanglist(array) {
        let arr = [];
        array.forEach(item => {
          arr.push(...item);
        });
        return arr;
      },
    jumpDetailSubmisson() {
        if (!this.getSelectedRows().length) {
          this.$message.error("请先选择！");
          return;
        }
        if (this.multipleTypeText === "立卷") {
          if (this.getSelectedRows().length > 1) {
            this.$message.error('只能选择一个案件！')
          } else if (this.getSelectedRows().length == 1) {
            if (this.getSelectedRows()[0].caseType == '建议') {
              this.$router.push({name: 'registration', query: this.getSelectedRows()[0]})
            } else {
              this.$message.warning('仅支持建议类型案件立卷')
            }

          } else {
            this.$message.warning('请选择案件！')
          }
        }
        if (this.multipleTypeText === "审核") {
          let list = this.unique(
          this.getSelectedRows(),
          this.getCurFilterId(this.pageTitle)
        );
        let caseList = this.getLanglist(list.map(item => item.caseArray))
        this.multipleSelectionCaseArray = caseList || [{}]
        // if(caseList.length == 1){
          // this.multipleSelectionCaseArray = caseList
          this.officialCommunicationState = true
          this.officialCommunicationType = 'audit'
        // }else{
        //   const data = {
        //     userId: this.$store.getters.userId,
        //     caseIds: caseList.map(item => item.caseId),
        //     insIdList: caseList.map(item => item.insId),
        //     taskType: this.taskType,
        //     result: 1,
        //   }
        //   auditOfficalDoc(data).then(res => {
        //     this.$message.success(res.message)
        //     this.queryCaseList()
        //   })
        // }
          // queryTrademarkCaseOfficial({insIdList: this.getSelectedRows().map(item => item.tmFileId || item.ptOfficialId)}).then(res => {
          //   this.examineDialog = true
          //   this.examineData = res.data
          // })
        }
        // if (this.multipleTypeText === "文件下载") {
        //   this.fileDownLoadView = true;
        // }

        if (this.multipleTypeText === "工时") {
          if (this.getSelectedRows().length > 1) {
            this.$message.error('只能选择一个案件创建工时')
            return;
          }
          {
            this.$refs.handTime.isShow = true
            this.caseData = [
              ...new Set(this.getSelectedRows())
            ][0]
          }

        }
        if (this.multipleTypeText === "任务") {
          if (this.getSelectedRows().length > 1) {
            this.$message.error('只能选择一个案件创建任务')
            return;
          }
          {
            this.caseData = [
              ...new Set(this.getSelectedRows())
            ][0]
            this.taskView = true
          }
        }

        if (this.getSelectedRows().length && this.multipleTypeText === "递交") {
          if(this.taskType == 4 && this.getSelectedRows().length > 1){
              this.$message.error('只能选择一条数据!')
              return
            }
          this.title = '递交 / 新建'
          if (this.pageTitle === "官方通知" || this.pageTitle === "递交官方") {
            let list = this.unique(
              this.getSelectedRows(),
              this.getCurFilterId(this.pageTitle)
            );
            let caseList = this.getLanglist(list.map(item => item.caseArray))
            this.multipleSelectionCaseArray = caseList || [{}]
            this.submissionState = true
            this.submissionType = 'create'
            // this.$router.push({
            //   path: "/workbench/case/detailSubmission",
            //   query: { caseIds: caseIds, pageType: "1" }
            // });
          } else {
            this.multipleSelectionCaseArray = this.getSelectedRows()
            this.submissionState = true
            // this.submissionData =
            this.submissionType = 'create'
          }
        }
        // if (this.getSelectedRows().length && this.multipleTypeText === "变更办案人") {
        //   queryCaseWork({caseId: this.getSelectedRows()[0].caseId}).then(res => {
        //     // this.updateWkgData= res.data
        //     this.updateWkgData = {
        //       ...{
        //         caseTypeId: this.getSelectedRows()[0].caseTypeId,
        //         trademarkCaseCustWorkgroups: [{wkgId: ""}],
        //         trademarkCaseCBWorkgroups: [],
        //         trademarkCaseLCWorkgroups: [{groupName: ''}]
        //       }, ...res.data
        //     }
        //
        //     this.updateWkgState = true;
        //   })
        //
        // }
        //立卷
        if (this.multipleTypeText === "立卷") {
          if (this.getSelectedRows().length > 1) {
            this.$message.error('只能选择一个案件！')
          } else if (this.getSelectedRows().length == 1) {
            if (this.getSelectedRows()[0].caseType == '建议') {
              sessionStorage.setItem('suggestRowData', JSON.stringify(this.getSelectedRows()[0]))
              this.$router.push({
                path: 'registration', query: {
                  // data:this.getSelectedRows()[0]
                  caseId: this.getSelectedRows()[0].caseId,
                  custName: this.getSelectedRows()[0].custName,
                  custLevel: this.getSelectedRows()[0].custLevel,
                  custId: this.getSelectedRows()[0].custId,
                  caseTypeId: this.getSelectedRows()[0].caseTypeId
                }
              })
              this.selectionState = false
            } else {
              this.$message.warning('仅支持建议类型案件立卷')
            }

          } else {
            this.$message.warning('请选择案件！')
          }

        }
        if (this.getSelectedRows().length && this.multipleTypeText === "官方通知") {
          // if(this.taskType == 4 && this.getSelectedRows().length > 1){
          //     this.$message.error('只能选择一条数据!')
          //     return
          //   }
          if (this.pageTitle === "官方通知" || this.pageTitle === "递交官方") {
            let list = this.unique(
              this.getSelectedRows(),
              this.getCurFilterId(this.pageTitle)
            );
            let caseList = this.getLanglist(list.map(item => item.caseArray));
            // let caseIds = caseList.map(item => item.caseId);
            this.multipleSelectionCaseArray = caseList || [{}]
            this.officialCommunicationState = true
            this.officialCommunicationType = 'create'
          } else {
            let info = this.unique(this.getSelectedRows(), "caseId");
            info.forEach(item => {
              delete item.insId;
            });
            this.multipleSelectionCaseArray = this.getSelectedRows()
            this.officialCommunicationState = true
            this.officialCommunicationType = 'create'
          }
        }
        if (
          this.getSelectedRows().length &&
          this.multipleTypeText === "新建账单"
        ) {
          if (this.pageTitle !== "案件管理") {
            let list = this.unique(
              this.getSelectedRows(),
              this.getCurFilterId(this.pageTitle)
            );
            let caseIds = this.getLanglist(list.map(item => item.caseArray)).map(
              item => item.caseId
            );
            this.$router.push({
              path: "/workbench/finance/off_bill/bill",
              query: {caseIdList: caseIds}
            });
          } else {
            this.$router.push({
              path: "/workbench/finance/off_bill/bill",
              query: {
                caseIdList: [
                  ...new Set(this.getSelectedRows().map(item => item.caseId))
                ]
              }
            });
          }
          this.selectionState = false
        }
        if (
          this.getSelectedRows().length &&
          this.multipleTypeText === "新建内部账单"
        ) {
          if (this.pageTitle !== "案件管理") {
            let list = this.unique(
              this.getSelectedRows(),
              this.getCurFilterId(this.pageTitle)
            );
            let caseIds = this.getLanglist(list.map(item => item.caseArray)).map(
              item => item.caseId
            );
            this.$router.push({
              path: "/workbench/finance/off_bill/bill",
              query: {caseIdList: caseIds}
            });
          } else {
            this.$router.push({
              path: "/workbench/finance/off_bill/insideBill",
              query: {
                caseIdList: [
                  ...new Set(this.getSelectedRows().map(item => item.caseId))
                ]
              }
            });
          }
          this.selectionState = false
        }
        if (
          this.getSelectedRows().length &&
          this.multipleTypeText === "新建官方时限"
        ) {
          if (this.pageTitle !== "案件管理") {
            let list = this.unique(
              this.getSelectedRows(),
              this.getCurFilterId(this.pageTitle)
            );
            let agentNums = this.getLanglist(list.map(item => item.caseArray))
              .map(item => item.agentNum)
              .join(",");
            this.timeLimitData = {
              agentNums: agentNums, kind: 1
            }
            this.timeLimitState = true
          } else {
            this.timeLimitData = {
              agentNums: [
                ...new Set(this.getSelectedRows().map(item => item.agentNum))
              ].join(","),
              kind: 1
            }
            this.timeLimitState = true
          }
          this.selectionState = false
        }
        if (
          this.getSelectedRows().length &&
          this.multipleTypeText === "新建内部时限"
        ) {
          if (this.pageTitle !== "案件管理") {
            let list = this.unique(
              this.getSelectedRows(),
              this.getCurFilterId(this.pageTitle)
            );
            let agentNums = this.getLanglist(list.map(item => item.caseArray))
              .map(item => item.agentNum)
              .join(",");
            this.timeLimitData = {
              agentNums: agentNums, kind: 2
            }
            this.timeLimitState = true
          } else {
            this.timeLimitData = {
              agentNums: [
                ...new Set(this.getSelectedRows().map(item => item.agentNum))
              ].join(","),
              kind: 2
            }
            this.timeLimitState = true
          }
          this.selectionState = false
        }
        if (
          this.getSelectedRows().length &&
          this.multipleTypeText === "新建费用"
        ) {
          if (this.pageTitle !== "案件管理") {
            let list = this.unique(
              this.getSelectedRows(),
              this.getCurFilterId(this.pageTitle)
            );
            let agentNums = this.getLanglist(list.map(item => item.caseArray))
              .map(item => item.agentNum)
              .join(",");

            this.$router.push({
              path: "/workbench/finance/addFeeDetail/1",
              query: {agentNums: agentNums, kind: 2}
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
          this.selectionState = false
        }
        if (this.multipleTypeText === "新建境外账单") {
          if (this.pageTitle !== "案件管理") {
            let list = this.unique(
              this.getSelectedRows(),
              this.getCurFilterId(this.pageTitle)
            );
            let agentNums = this.getLanglist(list.map(item => item.caseArray))
              .map(item => item.agentNum)
              .join(",");

            this.$router.push({
              path: "/workbench/finance/addOverseasBill/1",
              query: {agentNums: agentNums}
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
        if (this.multipleTypeText === '模板生成') {
          this.downLoadState = true
          this.$nextTick(() => {
            this.downLoadState = false
          })
        }
        if (
          this.getSelectedRows().length &&
          this.multipleTypeText === "批量操作"
        ) {
          this.plType = this.pageTitle + this.taskType; // this.taskType区分不同的pageTitle
          if (this.pageTitle === "官方通知") {
            // let list = this.unique(
            //   this.multipleSelection,
            //   this.getCurFilterId(this.pageTitle)
            // );
            // let caseIdList = this.getLanglist(
            //   list.map(item => item.caseArray)
            // ).map(item => item.tmFileId);
            this.willtableCaseIdList = [
              ...new Set(this.getSelectedRows().map(item => item.tmFileId))
            ];
            // this.willtableCaseIdList = caseIdList;
            this.showTable = true;
          } else {
            if (this.pageTitle === "递交官方") {
              this.willtableCaseIdList = [
                ...new Set(this.getSelectedRows().map(item => item.insId))
              ];
            } else {
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
                ...new Set(this.getSelectedRows().map(item => item.caseId))
              ];
            }

            this.showTable = true;
          }
        }
        if (this.uploadType && !this.otherSelect && !this.selectionOptionState) {
          this.uploadState = true
        }
      },
    handleSelect(key, requireList, multipleTypeTextDisabled) {
        this.patentOneMaterial = false
        this.requireList = []
        this.uploadType = ''
        this.multipleTypeText = ''
        if (requireList) {
          this.requireList = requireList
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
        if (key === "1-2-2-3") {
          this.multipleTypeText = "cpc递交文件";
          this.uploadType = "递交官方";
          this.patentOneMaterial = true

          // this.queryCaseList();
        }
        if (key === "1-2-3") {
          this.multipleTypeText = "客户往来";
          this.uploadType = "客户往来";
          // this.queryCaseList();
        }
        if (key === "1-2-3-1") {
          this.multipleTypeText = "客户指示";
          this.uploadType = "客户指示";
          // this.queryCaseList();
        }
        if (key === "1-2-3-2") {
          this.multipleTypeText = "致函客户";
          this.uploadType = "致函客户";
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
        if (key === "1-2-5-1") {
          this.multipleTypeText = "外代所来函";
          this.uploadType = "外方代理来函";
          // this.queryCaseList();
        }
        if (key === "1-2-5-2") {
          this.multipleTypeText = "致函外代所";
          this.uploadType = "致函外方代理";
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
          this.multipleTypeText = "报官清单";
        }
        if (key === "1-3") {
          this.multipleTypeText = "批量报官清单";
        }
        if (key === "1-4") {
          this.multipleTypeText = "工时";
        }
        if (key === "1-5") {

          this.multipleTypeText = "任务";
        }
        if (key === "文件上传排序") {
          this.multipleTypeText = "文件上传";
          this.multipleTypeTextDisabled = true
          // this.queryModuleData.isTmfileIdOrder=1
          this.queryCaseList({isTmfileIdOrder: 1})
          return
        }
        if (key === "文件上传") {
          this.multipleTypeText = "文件上传";
        }
        if (multipleTypeTextDisabled) {
          if (!this.getSelectedSortRows().length) {
            this.$message.error('请选择需要匹配的案件')
            return;
          }
          if (this.curFile.length != this.getSelectedSortRows().length) {
            this.$message.error('文件和案件数量需要相同')
            return
          }
          this.uploadProofreadingState = true
          return;
        }
        if (key === "1-4") {

          this.multipleTypeText = "工时";
        }
        if (key === "1-5") {

          this.multipleTypeText = "任务";
        }
        if (key === "立卷") {
          // this.selectionState = true;
          // this.multipleTypeText = "立卷";
          if (this.getSelectedRows().length > 1) {
            this.$message.error('只能选择一个案件！')
          } else if (this.getSelectedRows().length == 1) {
            if (this.getSelectedRows()[0].caseType == '建议') {
              sessionStorage.setItem('suggestRowData', JSON.stringify(this.getSelectedRows()[0]))
              this.$router.push({
                path: 'registration', query: {
                  // data:this.getSelectedRows()[0]
                  caseId: this.getSelectedRows()[0].caseId,
                  custName: this.getSelectedRows()[0].custName,
                  custLevel: this.getSelectedRows()[0].custLevel,
                  custId: this.getSelectedRows()[0].custId,
                  caseTypeId: this.getSelectedRows()[0].caseTypeId
                }
              })
              // this.selectionState = false
            } else {
              this.$message.warning('仅支持建议类型案件立卷')
            }

          } else {
            this.$message.warning('请选择案件！')
          }
          // queryCaseWork({caseId:this.getSelectedRows()[0].caseId}).then(res=>{
          //   // this.updateWkgData= res.data
          //   this.updateWkgData={...{caseTypeId:this.getSelectedRows()[0].caseTypeId,trademarkCaseCustWorkgroups:[{ wkgId: "" }],trademarkCaseCBWorkgroups:[],trademarkCaseLCWorkgroups:[{groupName:''}]},...res.data}
          //
          //   this.updateWkgState = true;
          // })

        }
        this.jumpDetailSubmisson(key)
      },
    exportList() {
      this.otherSelect = false
      this.multipleSelection.forEach(item => {
        this.$refs.caseListMultiple.toggleRowSelection(item, false)
      })
      this.multipleSelection = []
      this.selectionState = true;
      this.multipleTypeText = '列表导出';
      this.exportListState = true
    },
    getExportFileData(requireList, key) {
      if (key) {
        this.$refs.exportFile.currentType = key
      }
      this.multipleSelection.forEach(item => {
        this.$refs.caseListMultiple.toggleRowSelection(item, false)
      })
      this.multipleSelection = []
      this.selectionState = true
      //this.multipleTypeText='确定'
      this.otherSelect = true
      this.exportListState = false
      this.requireList = requireList
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
      if (this.multipleTypeText === "递交") {
        if ([...new Set(this.getSelectedRows().map(item => item.custName))].length >= 2) {
          this.$message.error("您必须选择同一客户下的案件");
        }
        if ([...new Set(this.getSelectedRows().map(item => item.caseType))].length >= 2) {
          this.$message.error("您必须选择同一案件类型的案件");
        }
        if ([...new Set(this.getSelectedRows().map(item => item.appCnName))].length >= 2) {
          this.$message.error("您必须选择同一申请人下的案件");
        }
      }

      if (this.multipleTypeText === "新建账单" || this.multipleTypeText === "新建内部账单") {
        if ([...new Set(this.getSelectedRows().map(item => item.custName))].length >= 2) {
          this.$message.error("您必须选择同一客户下的案件");
        }
      }
      if (this.multipleTypeText === "批量操作") {
        if ([...new Set(this.getSelectedRows().map(item => item.caseTypeId))].length >= 2) {
          this.$message.error("您必须选择同一案件类型的案件");
        }
        if (this.multipleSelection.length&&(this.getSelectedRows()[0].caseTypeId==48||this.getSelectedRows()[0].caseTypeId==165)&&[...new Set(this.getSelectedRows().map(item => item.changeType))].length >= 2) {
          this.$message.error("您必须选择同一撤回类型的案件");
        }
      }
      if (this.multipleTypeText === "报官清单"){
        if(this.requireList.length){
          this.requireList.forEach(thisType =>{
            if ([...new Set(this.multipleSelection.map(item => item[thisType['value']]))].length >= 2) {
              this.$message.error(`该选择需要${thisType.label}相同`);
            }
          })
        }
      }
    },
    cellRenderer(params){
      // if(params.colDef.field=='relationType'){
      //   switch (params.value) {
      //     case 0:
      //       return `<span title="当前案件">当前案件</span>`
      //     case 1:
      //       return `<span title="一带二申请">一带二申请</span>`
      //     case 2:
      //       return `<span title="母案分案">母案分案</span>`
      //     case 3:
      //       return `<span title="香港申请">香港申请</span>`
      //     case 4:
      //       return `<span title="同族案件">同族案件</span>`
      //     default:
      //       return ''
      //   }
      // }
      if(params.colDef.field=='imageFile'){
        return  `<img class="filterTableTmg"   src="/ipdoc${params.value}" alt="">`
      }
      if(params.colDef.field=='isLackMaterial'){
        if (params.value=='是'){
          return `<label role="checkbox" class="el-checkbox is-checked" aria-checked="true"><span aria-checked="mixed" class="el-checkbox__input is-checked"><span class="el-checkbox__inner"></span><input type="checkbox" aria-hidden="true" class="el-checkbox__original" value=""></span><!----></label>`
          }else {
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
        this.defaultColumnDefs.find(item=>item.field=='sid').checkboxSelection=function(params) {
          // we put checkbox on the name if we are not doing grouping
          return params.columnApi.getRowGroupColumns().length === 0;
        },
          this.defaultColumnDefs.find(item=>item.field=='sid').headerCheckboxSelection= function(params) {
            // we put checkbox on the name if we are not doing grouping
            return params.columnApi.getRowGroupColumns().length === 0;
          }
        this.defaultColumnDefs.find(item=>item.field=='sid').width=80
        this.defaultColumnDefs.push({})
        this.defaultColumnDefs.pop({})
      }else {
        this.defaultColumnDefs.find(item=>item.field=='sid').checkboxSelection=false
        this.defaultColumnDefs.find(item=>item.field=='sid').headerCheckboxSelection=false
        this.defaultColumnDefs.find(item=>item.field=='sid').width=60
        this.defaultColumnDefs.push({})
        this.defaultColumnDefs.pop({})
      }
    },
    getSelectedRows() {
      // if (this.selectionState) {
      //
      // } else {
      //   return []
      // }
      if(this.gridApi){
        const selectedNodes = this.gridApi.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data);
        return selectedData
      }else {
        return []
      }
    },
    getSelectedSortRows() {
      if (this.selectionState) {
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
      this.gridApi.rowModel.rootNode.allLeafChildren[0].setSelected(true)
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
    defaultColumnDefs:{
      handler(n,o){
        // console.log(n, o);
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
    taskType(){
      return this.getSelectedRows()[0]&&this.getSelectedRows()[0].taskType || this.$route.meta.taskType
    }
  },
  components:{
    CreateTimeLimit,
    Willtable,
    BulkUploadFile,
    exportFile,
    SelectOption,
    seeCaseDetail,
    DetailOfficialCommunication,
    officialSubmission,
    litigationOfficial,
    litigationSubmission

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
