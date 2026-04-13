<template>
  <div>
<!--    <div class="queryButton">-->
<!--      <el-menu class="el-menu-demo" mode="horizontal" v-allow="83" style="backgroundColor: #fff; border: none">-->
<!--&lt;!&ndash;        <el-submenu index="1">&ndash;&gt;-->
<!--&lt;!&ndash;          <template slot="title">新建</template>&ndash;&gt;-->
<!--&lt;!&ndash;          <el-submenu index="1-1" v-allow="152">&ndash;&gt;-->
<!--&lt;!&ndash;            <template slot="title">新建费用账单</template>&ndash;&gt;-->
<!--&lt;!&ndash;            <el-menu-item index="1-1-1" v-allow="180">账单</el-menu-item>&ndash;&gt;-->
<!--&lt;!&ndash;            <el-menu-item index="1-1-2" v-allow="181">内部账单</el-menu-item>&ndash;&gt;-->
<!--&lt;!&ndash;            <el-menu-item index="1-1-4" v-allow="229">境外账单</el-menu-item>&ndash;&gt;-->
<!--&lt;!&ndash;            <el-menu-item index="1-1-3">费用</el-menu-item>&ndash;&gt;-->
<!--&lt;!&ndash;          </el-submenu>&ndash;&gt;-->
<!--&lt;!&ndash;          <el-submenu index="1-2" >&ndash;&gt;-->
<!--&lt;!&ndash;            <template slot="title">新建案件进程</template>&ndash;&gt;-->
<!--&lt;!&ndash;            <el-menu-item index="1-2-1" v-if="$store.getters.permissions.includes(182)">递交指令</el-menu-item>&ndash;&gt;-->
<!--&lt;!&ndash;            <el-menu-item index="1-2-2" v-allow="183">官方通知</el-menu-item>&ndash;&gt;-->
<!--&lt;!&ndash;            <el-menu-item index="1-2-2-2">递交官方(文件)</el-menu-item>&ndash;&gt;-->
<!--&lt;!&ndash;            <el-menu-item index="1-2-3"  >客户往来</el-menu-item>&ndash;&gt;-->
<!--&lt;!&ndash;            <el-menu-item index="1-2-4" >内部往来</el-menu-item>&ndash;&gt;-->
<!--&lt;!&ndash;            <el-menu-item index="1-2-5" >外代所往来</el-menu-item>&ndash;&gt;-->
<!--&lt;!&ndash;            <el-menu-item index="1-2-6" >对方当事人往来</el-menu-item>&ndash;&gt;-->
<!--&lt;!&ndash;            &lt;!&ndash;<el-menu-item index="1-2-7">特批预立卷审批</el-menu-item>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;          </el-submenu>&ndash;&gt;-->
<!--&lt;!&ndash;          <el-submenu index="1-3" v-allow="154">&ndash;&gt;-->
<!--&lt;!&ndash;            <template slot="title">新建时限</template>&ndash;&gt;-->
<!--&lt;!&ndash;            <el-menu-item index="1-3-1" v-allow="190">官方时限</el-menu-item>&ndash;&gt;-->
<!--&lt;!&ndash;            <el-menu-item index="1-3-2" v-allow="191">内部时限</el-menu-item>&ndash;&gt;-->
<!--&lt;!&ndash;          </el-submenu>&ndash;&gt;-->
<!--&lt;!&ndash;        </el-submenu>&ndash;&gt;-->
<!--      </el-menu>-->
<!--      &lt;!&ndash;    <el-button class="plbj" type="primary" size="small" @click="handleSelect('批量操作')">批量编辑</el-button>&ndash;&gt;-->
<!--      &lt;!&ndash;    <exportFile ref="exportFile" :downLoadState="downLoadState" :multipleSelection="multipleSelection" @getData="getExportFileData" @exportList="exportList" @close="closeSelect" :pageTitle="pageTitle" @multipleTypeText="changeMultiple"></exportFile>&ndash;&gt;-->
<!--    </div>-->
    <div style="display: flex;position: relative">
      <TitleTotal :total="list.length" />
      <div class="button_wrap" v-if="selectionState">
<!--        <el-button class="exactButton" size="mini" type="primary" @click="jumpDetailSubmisson">{{multipleTypeText}}</el-button>-->
<!--        <el-button class="exactButton"  size="mini" @click="selectionState=false">取消</el-button>-->
      </div>
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
                   @rowDoubleClicked="rowDoubleClicked"
                   @sortChanged="refreshEvenRowsCurrencyData"
                   @filterChanged="refreshEvenRowsCurrencyData"
                   :localeText="$store.state.caseInformation.localeText"
        >
        </AgGridVue>
<!--        <createInvoice v-if="createInvoiceState" :createInvoiceState="createInvoiceState" @close="closeCreateInvoice" :pageState="pageState" :receiptId="receiptId"></createInvoice>-->

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
<!--      <div class="right_wrap" v-if="pattern" :style="{position:'relative','margin-left':currentCaseId&&pattern?'10px' :'0',height:clientHeight+'px'}">-->
<!--        &lt;!&ndash;<span class="el-icon-close" slot="close" style="cursor:pointer;position: absolute;right: 0;top: 10px;z-index: 1000" @click="closeCurrentRow"></span>&ndash;&gt;-->
<!--        <seeCaseDetail v-if="currentCaseId" :case-id="currentCaseId" :sign="1" :filed="filed">-->
<!--        </seeCaseDetail>-->
<!--      </div>-->
    </div>
<!--    <el-dialog :title="uploadType" :visible.sync="uploadState" width="70%" :append-to-body="true">-->
<!--      <el-table :data="getSelectedRows()" border>-->

<!--        <el-table-column align="left" v-for="(item,index) in preferenceList" :label="item.title" :prop="item.value" :width="item.width" :key="index">-->

<!--          <template slot-scope="scope">-->
<!--            <span :class="item.value=='agentNum'?'itemTitle_style':''" v-if="item.value!=='imageFile'&&item.value!='custName'" :title='scope.row[item.value]' style="margin: 0;cursor: pointer"-->
<!--                  @click="takeCaseDetail(scope.row)">-->
<!--              {{scope.row[item.value]}}-->
<!--            </span>-->
<!--            <CustCard v-if="item.value=='custName'" :custName="scope.row.custName" :customerID="scope.row.custId" />-->
<!--            <img class="filterTableTmg" v-if="item.value==='imageFile'" :src="'ipdoc'+scope.row['imageFile']" alt="">-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--      </el-table>-->
<!--      <BulkUploadFile v-if="uploadState" :uploadType="uploadType" :curCaseId="getSelectedRows().map(item=>item.caseId)" @changeFalse="closeSelect"></BulkUploadFile>-->
<!--    </el-dialog>-->
    <!--    <Willtable v-if="showTable" :plType="plType" :changeType="multipleSelection.length?multipleSelection[0].changeType:''" :reportMatter="multipleSelection.length?multipleSelection[0].reportMatter:null"-->
    <!--               :materialTypeId="multipleSelection.length?multipleSelection[0].materialTypeId:null" :caseTypeId="multipleSelection.length?multipleSelection[0].caseTypeId:null" :caseIds='willtableCaseIdList'-->
    <!--                :showTable='showTable'  @closeTable="closeSelect">-->
    <!--    </Willtable>-->
    <!--    <SelectOption :exportType="2" :buss-id="bussId" v-if="selectionOptionState&&multipleSelection.map(item=>item[getCurFilterId(pageTitle)]).length" :dialog-visible="selectionOptionState" @cancel="closeSelect" :idArray="multipleSelection.map(item=>item[getCurFilterId(pageTitle)])" :defaultMultipleSelect="preferenceList.map(i=>i.title)" >-->

    <!--    </SelectOption>-->
<!--    <detail-official-communication v-if="communicationState" @closeThisPage="closeSelect" :dialogVisible="communicationState" :queryInfo="queryInfo" ></detail-official-communication>-->
<!--    <el-dialog-->
<!--      title="递交官方"-->
<!--      append-to-body-->
<!--      :visible.sync="detailSubmissionState"-->
<!--      width="60%"-->
<!--      height="100vh"-->
<!--      :modal="false"-->
<!--      top="0"-->
<!--      class="pdfDialog"-->
<!--      :close-on-click-modal="false"-->
<!--      v-dialogDrag-->
<!--    >-->
<!--      <officialSubmission :query="detailSubmissionData" @cancel="closeSelect"></officialSubmission>-->
<!--    </el-dialog>-->
  </div>
</template>
<script>
import {queryReceiptList,queryCustomerNameId, queryReceiptCompany, queryBankaccountListBycustId ,getTimelimitTypeAll, getWriteoffState,delTimelimit,selectColumn,queryPreference,savePreference,delPreference,getCaseTimelimitList,deleteReceipt,receiptCreateReceipt} from '@/api/caseList.js'
import {mapState,mapGetters} from 'vuex'
import {unique,throttle} from '@/utils'
import BulkUploadFile from "../BulkUploadFile";
import SelectOption from "../SelectOption";
import seeCaseDetail from "../ManualIdentification/seeCaseDetail";
import createInvoice from "../../../finance/invoice/createInvoice";
import ViewsSwitching from "../ViewsSwitching";
import Willtable from "@/components/Willtable";
import exportFile from '@/components/exportFile'
import DetailOfficialCommunication from '@/views/workbench/case/officialCommunication/detailOfficialCommunication';
import officialSubmission from '@/views/workbench/case/officialSubmission/components/detailSubmission.vue'
export default {
  props: {
    editableTabsValue:{

    },
    business: {
      type: String,
      default: "2"
    },
    caseList: {
      type: Array,
      default: () => []
    },
    pageTitle: {
      type: String,
      default:''
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
      bussId: 15,
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
        // { name:'暂存', action: 'temporarStorage'},

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
      // iList:[],
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
    // this.iList = this.list
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
    getAllWfs() {
      const data = {
        userId: this.userId,
        bussId: this.bussId
      }
      Promise.all([selectColumn(data), queryPreference(data)]).then(res=>{
        this.selectColumnList = res[0].data
        this.preferenceList = res[1].data
        // this.tableHeader = this.preferenceList.map(item=>({ label:item.title, prop:item.value,width: this.getLoactionWidth(item.title)}))
        // this.saveLocation()
        // this.checkCaseList = this.preferenceList.map(item => item.value)
        // this.columnDefs=[...this.defaultcolumnDefs,...this.preferenceList.map(item=>({
        //   headerName: item.title,
        //   field: item.value,
        //   width:this.getLoactionWidth(item.title)=='auto'?200:this.getLoactionWidth(item.title),
        //   resizable: true,
        //   sortable: true,
        //   filter: 'agSetColumnFilter',
        //   menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],
        //   cellRenderer: this.cellRenderer,
        //   enableRowGroup: true,
        //   filterParams: {
        //     newRowsAction: 'keep',
        //      comparator: (a, b)=>{
        //       return this.$commonUtils.sort(a,b,item.value)
        //     }
        //   }
        // }))]
        // console.log('+++++++++++++++')
        // console.log(this.columnDefs)
        // console.log('+++++++++++++++')
        // this.preferenceList.forEach(item => {
        //   if(item.title.includes('日期')){
        //     item.width=140
        //   }
        // })
        // this.checkFilterList = this.preferenceList.map(item => false)
      })
    },
    getRowContextmenuList(row){
      return [
        // { name:'暂存', action: 'temporarStorage'},
        // { name:'隐藏', action: 'hidden'},
        { name:'复制发票',action: 'copyInvocie', permissions:216 },
        { name: '修改', action: 'editInvocie',permissions:216,},
        { name: '删除', action: 'deleteInvocie',permissions:217, }].filter(item=> {
        if (item.permissions) {
          return this.$store.getters.permissions.includes(item.permissions)
        }else {
          return true
        }
      })
    },
    getCurFilterId(title) {
        switch (title) {
          case "案件管理":
            return "caseId";
          case "递交官方":
            return "insId";
          case "官方通知":
            return "tmFileId";
          case "境外账单":
            return "abroadBillId";
          case "账单":
            return "billId";
          case "费用":
            return "feeId";
          case "发票":
            return "receiptId";
        }
      },
    closeCreateInvoice(e){
      this.createInvoiceState=false
      if(e){
      this.handleSearch()
      }
    },
    // hidden(row){
    //     this.iList=this.iList.filter(item=>item[this.getCurFilterId(this.pageTitle)]!=row[this.getCurFilterId(this.pageTitle)])
    //     // this.caseList.splice(this.caseList.indexOf(row),1)
    //     this.currentPageSize-=1
    // },
    copyInvocie(data){
      this.$emit('copyInvo', data)
      // if(row.receiptType==0){
      //   this.$confirm('该操作会创建一条相同账单的发票, 是否继续?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     receiptCreateReceipt({receiptId:row.receiptId,copyReceipt:1}).then(res=>{
      //       // this.handleSearch()
      //       this.editInvocie(res.data[0])
      //     })
      //   }).catch(() => {
      //
      //   });
      // }else {
      //   receiptCreateReceipt({receiptId:row.receiptId,copyReceipt:1}).then(res=>{
      //     // this.handleSearch()
      //     this.editInvocie(res.data[0])
      //   })
      // }

    },
     handleSearch(num){
      this.multipleSelection=[]
      this.selectionState=false
      this.listQuery.pageNo=1
      this.operationState=null
      this.saveQueryModel()
      this.queryReceiptList()
      this.drawerState=false
    },
    queryReceiptList(){
      this.queryModuleData = JSON.parse(localStorage.getItem('queryModuleData'))?JSON.parse(localStorage.getItem('queryModuleData')).find(item=>item.name==this.$route.name)?JSON.parse(localStorage.getItem('queryModuleData')).find(item=>item.name==this.$route.name).queryModuleData:{}:{}
      this.queryModuleData.pageNo=this.listQuery.pageNo
      this.queryModuleData.pageSize=this.listQuery.pageSize
      this.listLoading = true
      this.exportQueryModel=JSON.stringify(this.queryModuleData)
      queryReceiptList(this.queryModuleData).then(res=>{
        this.total=res.total
        this.listLoading = false
        this.invocieList= res.data
        if (this.multipleSelection.length) {
          this.$nextTick(() => {
            this.multipleSelection.forEach(itm => {
              this.$refs.todoTaskMultiple.toggleRowSelection(this.invocieList.find(item => item.receiptId === itm.receiptId), true)
            })
          })
        }
      })
    },
    saveQueryModel(){
      if(JSON.parse(localStorage.getItem('queryModuleData'))){
        var arr = JSON.parse(localStorage.getItem('queryModuleData'))
      }else {
        var arr = []
      }
      if(arr.find(item=>item.name==this.$route.name)){
        arr.find(item=>item.name==this.$route.name).queryModuleData=this.queryModuleData
      }else {
        arr.push({name:this.$route.name,queryModuleData:this.queryModuleData})
      }
      localStorage.setItem('queryModuleData',JSON.stringify(arr))
    },
    create(){
      this.pageState = 'create'
      this.createInvoiceState=true
    },
    editInvocie(row){
      this.pageState = 'edit'
      this.receiptId=row.receiptId
      this.createInvoiceState=false
      this.$nextTick(()=>{
        this.createInvoiceState = true
      })
      const data ={
        pageState: this.pageState,
        receiptId: this.receiptId,
        createInvoiceState: true
      }
      this.$emit('edit', data)
    },
    deleteInvocie(row) {
        this.$store.commit('tabs/CHANGE_STORAGETABLE',{type:'delete',title:this.editableTabsValue,name:this.editableTabsValue,identification:this.identification,data:row})
        // this.$store.commit('tabs/CHANGE_STORAGETABLE',{type:'delete',data:{title:this.editableTabsValue,name:this.editableTabsValue,data:row}})
        // this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'delete',data:{title:this.editableTabsValue,name:this.editableTabsValue,data:row}})
      },
    // deleteInvocie(row){
    //   this.$confirm("此操作将永久删除, 是否继续?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   }).then(()=>{
    //     deleteReceipt({receiptIdList:row.receiptId}).then(()=>{
    //       this.$message.success('刪除成功')
    //       this.currentPageSize=this.currentPageSize-1
    //       this.total=this.total-1
    //       this.list.splice(this.list.indexOf(row),1)
    //     })
    //   })
    //
    // },
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
    changeMultiple(text){
      this.multipleTypeText=text
    },
    closeSelect(){
      this.detailSubmissionState=false
      this.selectionState=false
      this.selectionOptionState=false
      this.uploadState = false
      this.showTable=false
      this.communicationState=false
    },
    takeCaseDetail(row) {
      if( this.$commonUtils.getTwoDimensionalArray(this.$store.getters.caseTypeList,'caseTypeId',row.caseTypeId).includes(2)){
        this.$router.push({ path: '/workbench/case/seeCaseDetail/' + row.caseId, query: {taskType:2}})
      }else {
        this.$router.push("/workbench/case/seeCaseDetail/" + row.caseId);
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
    cellRenderer(params) {
      if (params.colDef.field === 'sid') {
        return params.rowIndex + 1
      }
      return `<span title="${params.value}">${params.value ? params.value : ''}</span>`
    },
    rowDoubleClicked(params){
      var row=params.data
      if(this.pageTitle === '发票'){
          const data = {
            pageState : 'view',
            createInvoiceState: true,
            receiptId: row.receiptId
          }
          this.$emit('invocie', data)
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
      if(this.gridReadyState){
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
        console.log(n, o);
      },
      deep:true
    },
    selectionState(n){
      if(n){
        if(this.multipleTypeText!='官方通知'){
          this.gridApi.deselectAll()
        }
      }
      this.changeSelection(n)
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
      return document.documentElement.clientHeight -180
    },
  },
  components:{
    Willtable,
    BulkUploadFile,
    exportFile,
    SelectOption,
    seeCaseDetail,
    DetailOfficialCommunication,
    officialSubmission,
    createInvoice
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
