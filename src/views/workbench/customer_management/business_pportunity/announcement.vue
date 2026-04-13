<template>
  <div class="app-container">
<!--    <header class="y-header">{{ $route.meta.title }}</header>-->

    <div class="filter-container" style="margin-bottom:15px">
      <el-form :model="listQuery" label-width="100px">
        <el-row>
          <el-col :span="4">
            <el-form-item label="客户" style="width: 90%;">
              <el-select
                v-model="listQuery.custIdArray"
                multiple
                filterable
                remote
                clearable
                placeholder="请输入客户名"
                :remote-method="(queryString)=>{queryCustArrList(queryString)}"
              >
                <el-option v-for="(item,index) in custArrOptions" :key="index" :label="item.fullname" :value="item.custId">
                  <span>{{item.name}}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="申请人" style="width: 90%;">
              <el-select
                v-model="listQuery.appIdArray"
                multiple
                filterable
                remote
                clearable
                placeholder="请输入申请人名"
                :remote-method="(queryString)=>{queryAllUrl(queryString)}"
              >
                <el-option v-for="(item,index) in appIdArrOptions" :key="index" :label="item.applicantName" :value="item.appId">
                  <span>{{item.applicantName}}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="文种类型" style="width: 90%;">
              <el-select clearable v-model="listQuery.recordType" placeholder="请选择文种类型" >
                <el-option
                  v-for="(item, index) in recordTypeList"
                  :key="item.value"
                  :label="item.id"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="注册号" style=" width: 90%;">
              <el-input clearable v-model="listQuery.regnumber" placeholder="请输入注册号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="商标名称" style="width: 90%;">
              <el-input clearable v-model="listQuery.tmName" placeholder="请输入商标名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2" style="margin-left: 50px">
            <el-form-item>
              <el-button type="primary" class="clearButton" size="mini"  @click="clearSearch"><img src="@/assets/清除@2x.png" alt=""><span>重置</span></el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" style="padding-left: 35%">
            <el-form-item>
              <el-button size="small" style="" type="primary" @click="getList(1)">搜 索</el-button>
            </el-form-item>
          </el-col>
          <el-col v-if="$store.getters.permissions.includes(263)" :span="12" style="margin-left: -7%">
            <el-form-item>
<!--                <el-upload-->
<!--                  class="upload-demo"-->
<!--                  ref="upload"-->
<!--                  :data="uploadFile"-->
<!--                  :action="tmAnnouncement"-->
<!--                  :before-upload="beforeUpload"-->
<!--                  :on-success="successCallback"-->
<!--                  multiple-->
<!--                  :show-file-list="false">-->
<!--                  <el-button ref="isUpload" size="small" :loading="isLoading" type="primary">上传公告</el-button>-->
<!--                </el-upload>-->
              <el-button type="primary" size="mini" @click="clickUpload=true">上传</el-button>
              <uploadFile :clickUpload="clickUpload" @getUploadFile="getUploadFile" @changeClick="clickUpload=false"></uploadFile>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>

        </el-row>
        <el-row style="">
          <el-col :span="20" style="height: 40px;margin-left: 15px">
            <el-form-item label="最近期号为：">
              <el-tag
                style="cursor: pointer;margin-left: 10px;"
                v-for="(item, index) in qihaoList"
                :key="index"
                :class="{isActive: isActiveArr.includes(item)}"
                @click="qihaoClick(item)"
              >
                {{ item }}
              </el-tag>
            </el-form-item>
          </el-col>

        </el-row>

      </el-form>
    </div>
<!--    <div style="display: block; margin-top: 40px">-->

<!--    </div>-->
    <div style="height: 30px;">
      <el-button v-show="selectionState" type="primary" class="exactButton"  size="mini" @click="gridApi.deselectAll()">清除所选</el-button>
    <el-button v-show="selectionState" type="primary" class="exactButton"  size="mini" @click="exportFile">导出</el-button>
    <el-button v-show="selectionState" type="primary" class="exactButton"  size="mini" @click="selectionState=false">取消</el-button>
    </div>
    <div style="cursor:pointer;position: absolute;display:flex;align-items:center;right: 0;bottom: 72%;font-size: 14px;padding-right: 6px"><el-button type="text"  @click="exportList(1)"><i class="el-icon-download">导出</i></el-button>
          <img @click="exportList(2)" src="@/assets/moon.png" width="16" alt=""></div>
    <AgGridVue
               :style="{width:'100%',height: '500px'}"
               class="ag-theme-balham"
               :columnDefs="columnDefs"
               :rowData="list"
               rowSelection="multiple"
               @grid-ready="onGridReady"
               :gridOptions="gridOptions"
               :getContextMenuItems="getContextMenuItems"
               suppressAutoSize
               animateRows
               :localeText="$store.state.caseInformation.localeText"
    >
    </AgGridVue>
    <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.pageNo"
        :limit.sync="listQuery.pageSize"
        @pagination="getList"
        :pageSizes="pageSizesList"
      />
    <SelectOption :buss-id="bussId" :dialog-visible="exportView" @cancel="closeSelect" :idArray="getSelectedRows().map(item=>item.id)" :defaultMultipleSelect="tableTitleList.map(i=>i.title)" :exportType="exportType" :exportQueryModel="JSON.stringify(listQuery)"></SelectOption>
  </div>
</template>
<script>
import uploadFile from '../../../workbench/material_management/components/uploadFile'
import { queryTmAnnouncement, queryTmRecordType, queryCustomerNameId, queryTmEdition,tmAnnouncement } from '@/api/caseList'
import { queryAllUrl } from '@/api/applicant'
// import { tmAnnouncement } from '@/api/ipServiceApi.config.js'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
// import SelectOption from '@/views/workbench/case/components/SelectOptions'
import SelectOption from '../../case/components/SelectOption'
const defaultData = {
  pageNo: 1,
  pageSize: 10,
  keyword: '',
  createTime: '',
  examineStatuss: '',
  isCustomer: '1'
}
export default {
  components: { Pagination, SelectOption,uploadFile },
  data() {
    return {
      clickUpload: false,
      partExport: false,
      exportType: 1,
      // tmAnnouncement,
      isLoading: false,
      uploadFile: {
        tokenID: this.$store.getters.token
      },
      uploadData: {},
      appIdArrOptions: [],
      appIdArrayList: [],
      uploadView: false,
      pageSizesList:[10, 50, 200,500,1000,5000,10000],
      qihaoList: [],
      dialogFormxy: false,
      list: null,
      total: 0,
      listLoading: true,
      reListQuery: [],
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        // qihao: '',
        custIdArray: [],
        appIdArray: [],
        // regnumber: '',
        // tmName: '',
        // recordType: ''
      },
      deldata: {
        conId: ''
      },
      seletData: {
        scStatu: {},
        country: {},
        custnames: {},
        level: {}
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          },
          {
            text: '一周前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }
        ]
      },
      xyData: {
        conId: '',
        level: '',
        memo: ''
      },
      gridOptions: {
        ...this.$store.state.caseInformation.gridOptions, ...{
          statusBar: {
            statusPanels: [
              { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
              { statusPanel: 'agSelectedRowCountComponent', align: 'left' }
            ]
          }
        },
        getRowStyle: this.ChangRowColor,
      },
      currentPageSize: 0,
      defaultcolumnDefs: [
        {
          headerName: '序号',
          field: 'sid',
          width: 60,
          'pinned': 'left', // 固定再左边
          enableRowGroup: true,
          // enablePivot: true,
          floatingFilter: true,
          filter: false,
          cellClass: 'vAlign',
          suppressMenu: true,
          checkboxSelection: false,
          headerCheckboxSelection: false,
          headerCheckboxSelectionFilteredOnly: true,
          cellRenderer: this.cellRenderer
        }
      ],
      tableTitleList:[
        {'title':'公告类型','value':'announcementType'},{'title':'公告期号','value':'announcementQH'},{"title":"注册号","value":"regnumber" },
        {"title":"类号","value":"goodClass" },{"title":"商标名称","value":"tmName" },{"title":"原发文编号","value":"primaryDocNumber" }
        ,{"title":"原发文日期","value":"primaryDocDate" },{"title":"接收人地址","value":"receiverAddress" },{"title":"文种类型","value":"recordType" }
        ,{"title":"申请人","value":"applicantName" },{"title":"客户","value":"custName" }
      ],
      columnDefs: [],
      recordTypeList: [],
      custIdArrayList: [],
      custArrOptions: [],
      isActiveArr: [],
      bussId: 20,
      selectionState: false,
      exportView: false,
      // current: false
    }
  },
  watch: {
    selectionState(n){
      if(n){
        if(this.multipleTypeText!='官方通知'&&this.multipleTypeText!='递交官方(文件)'){
          this.gridApi.deselectAll()
        }
      }
       this.changeSelection(n)
    },
  },
  created() {

    sessionStorage.setItem('reListQuery', JSON.stringify(this.listQuery))
    this.handleSearch()
    this.queryTmRecordType()
    // this.queryTmEdition()
  },
  computed: {
    clientHeight() {
      return document.documentElement.clientHeight - 310
    }
  },
  methods: {
    getUploadFile(e){
        let formData = new FormData()
        for(let i = 0; i < e.target.files.length; i++){
          formData.append("file", e.target.files[i]);
        }
        formData.append("tokenID", this.$store.getters.token);

        tmAnnouncement(formData).then(res=>{
          this.message.success('文件上传成功!')
          this.getList(1)
        })
      },
    ChangRowColor(row) {
      row = row || { data: { isBelong: 100 }}
      if (row.data.isBelong === 0) {
        return { 'color': 'red' }
      }else if(row.data.isBelong === 2){
        return { 'color': 'green' }
      }
    },
    closeSelect() {
      this.exportView = false
      this.selectionState = false
      this.partExport = false
    },
    exportFile() {
      this.exportType = 2
      this.exportView = true
    },
    changeSelection(n) {
      if (n) {
        this.columnDefs.find(item => item.field == 'sid').checkboxSelection = function (params) {
          // we put checkbox on the name if we are not doing grouping
          return params.columnApi.getRowGroupColumns().length === 0;
        },
          this.columnDefs.find(item => item.field == 'sid').headerCheckboxSelection = function (params) {
            // we put checkbox on the name if we are not doing grouping
            return params.columnApi.getRowGroupColumns().length === 0;
          }
        this.columnDefs.find(item => item.field == 'sid').width = 80
        this.columnDefs.push({})
        this.columnDefs.pop({})
      } else {
        this.columnDefs.find(item => item.field == 'sid').checkboxSelection = false
        this.columnDefs.find(item => item.field == 'sid').headerCheckboxSelection = false
        this.columnDefs.find(item => item.field == 'sid').width = 60
        this.columnDefs.push({})
        this.columnDefs.pop({})
      }
    },
    getSelectedRows() {
      if (this.selectionState) {
        const selectedNodes = this.gridApi.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data);
        return selectedData
      } else {
        return []
      }
    },
    exportList(flag) {
      if(flag == 1) {
        this.exportType = flag
        this.exportView = true
      }
      if(flag == 2){
        this.exportType = flag
        // this.partExport = true
        this.selectionState = true
      }
      // this.$confirm('选择类型', '提示', {
      //   confirmButtonText: '全部导出',
      //   cancelButtonText: '部分导出',
      //   type: 'warning'
      // }).then(()=>{
      //   this.exportType = 1
      //   this.exportView = true
      // }).catch(()=>{
      //   this.exportType = 2
      //   this.partExport = true
      //   this.selectionState = true
      // })
    },
    clearSearch(){
      this.reListQuery = JSON.parse(sessionStorage.getItem('reListQuery'))
      this.listQuery = this.reListQuery
      // this.listQuery.custIdArray = []
      // this.listQuery.appIdArray = []
      // this.listQuery.regnumber = ''
      // this.listQuery.tmName = ''
      // this.listQuery.recordType = ''
    },
    handleSearch() {
      this.listQuery.pageNo = 1
      queryTmEdition({type: 2}).then((res)=>{
        this.qihaoList = res.data
        this.listQuery.qihao = this.qihaoList[0]
        this.isActiveArr.length = 0
        this.isActiveArr.push(this.qihaoList[0])
        this.getList(1)
      })

    },
    beforeUpload() {
      this.isLoading = true
      // this.uploadFile = {tokenID: this.$store.getters.token}
    },
    successCallback(response, file, fileList) {
      if(response.success){
        this.$message.success('文件上传成功!')
        this.isLoading = false
        this.getList(1)
      }else{
        this.$message.error('文件上传失败!')
        this.isLoading = false
      }
    },
    queryAllUrl(value) {
      if(value !== ''){
        if(this.listQuery.appIdArray&&this.listQuery.appIdArray.length){
          queryAllUrl({orderBy: 1, pageNo: 1, pageSize: 100,appIdArray: this.listQuery.appIdArray}).then(res=> {
            this.appIdArrayList = res.data.map(item=>({
              appId: item.appId,
              applicantName: item.applicantName
            }))
          })
        }
        queryAllUrl({orderBy: 1, pageNo: 1, pageSize: 100,applicantName:value }).then(res=>{
          this.appIdArrOptions = res.data.map(item=>({
            appId: item.appId,
            applicantName: item.applicantName
          }))
          this.appIdArrOptions=this.appIdArrayList.concat(this.appIdArrOptions)
        })
      }
    },
    // queryTmEdition() {
    //   queryTmEdition({type: 2}).then((res)=>{
    //     this.qihaoList = res.data
    //   })
    // },
    qihaoClick(item) {
      this.isActiveArr.length = 0
      this.isActiveArr.push(item)
      this.listQuery.qihao = item
      this.getList(1)
    },
    queryCustArrList(value) {
      if(value !== ''){
        if(this.listQuery.custIdArray&&this.listQuery.custIdArray.length){
          queryCustomerNameId({pageNo: 1, pageSize: 100,custIdArray: this.listQuery.custIdArray}).then(res=> {
            this.custIdArrayList = res.data
        })
        }
        queryCustomerNameId({ pageNo: 1, pageSize: 100,keyword:value }).then(res=>{
          this.custArrOptions=this.custIdArrayList.concat(res.data)
        })
      }
    },
    queryTmRecordType() {
      queryTmRecordType().then(res=>{
        this.recordTypeList = res.data
      })
    },
    // clearSeach() {
    //   this.listQuery = JSON.parse(JSON.stringify(defaultData))
    //
    //   this.total = '0'
    // },

    // getAllWfs() {
    //   // const data = {
    //   //   userId: this.userId,
    //   //   bussId: this.bussId
    //   // }
    //   var tableHeader = []
    //   if (localStorage.getItem('tableHeader') && JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name === this.$route.name)) {
    //     tableHeader = JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name === this.$route.name).tableHeader
    //   }
    //   if (tableHeader.length === 0) {
    //     this.preferenceList = [{ 'label': '利益冲突者', prop: 'fullname' }, {
    //       'label': '相对客户',
    //       prop: 'custName'
    //     }, { 'label': '创建日期', prop: 'createDate' }, { 'label': '备注', prop: 'memo' }]
    //   } else {
    //     this.preferenceList = tableHeader
    //   }
    //   this.columnDef
    // 序号
    refreshEvenRowsCurrencyData(params) {
      this.currentPageSize = params.api.rowModel.rootNode.allChildrenCount
      if (!params.columnApi.columnController.groupAutoColumns) {
        this.gridApi.forEachNode(rowNode => {
          rowNode.setDataValue(
            'sid',
            rowNode.rowIndex + 1)
        })
      }
    },
    cellRenderer(params) {
      if (params.colDef.field === 'sid') {
        return params.rowIndex + 1
      }
      return `<span title="${params.value}">${params.value ? params.value : ''}</span>`
    },
    // 右键点击表格
    getContextMenuItems(params) {
      if (!params.node || !params.node.data) {
        return []
      }
      return this.getRowContextmenuList(params.node.data).map(item => ({
        name: item.name,
        action: () => {
          this[item.action](params.node.data, params.value, params.node)
        }
      }))
    },
    getRowContextmenuList(row) {
      return [
        { name: '复制', action: 'copy' },
        // { name: '商标导入', action: 'installtmmessage', permissions: 185 },
        // { name: '修改', action: 'editFun', permissions: 65 },
        // { name: '删除', action: 'handledeleElement', permissions: 66 }
      ]
      //   .filter(item => {
      //   if (item.permissions) {
      //     if (item.examineStatusStr) {
      //       return this.$store.getters.permissions.includes(item.permissions) && row.examineStatusStr === item.examineStatusStr
      //     }
      //     return this.$store.getters.permissions.includes(item.permissions)
      //   } else {
      //     return true
      //   }
      // })
    },
    copy(row, value) {
      if (value) {
        this.$copyText(value).then(
          res => {
          })
      }
    },

    getList(flag, qihao) {
      if (flag == 1) {
        this.listQuery.pageNo = '1'
      }
      if(qihao){
        this.listQuery.qihao = qihao
      }
      this.listLoading = true
      queryTmAnnouncement(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        this.listLoading = false
        this.columnDefs = [...this.defaultcolumnDefs, ...this.tableTitleList.map(item=>({
          headerName: item.title,
          field: item.value,
          resizable: true,
          sortable: true,
          filter: 'agSetColumnFilter',
          cellRenderer:this.cellRenderer,
          menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],
          enableRowGroup: true,
          filterParams: {
            newRowsAction: 'keep',
            comparator: (a, b)=>{
              return this.$commonUtils.sort(a,b,item.value)
            }
          }
        }))]
      })
    },
    // 存储对grid和column API的引用
    onGridReady(params) {
      this.gridparams = params
      this.gridApi = params.api
      this.columnApi = params.columnApi
      params.api.sizeColumnsToFit()
    },
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";



  /*.el-form{
    position: relative;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    padding: 20px 120px 20px  0;
    margin: 10px 0 40px 0;
    box-shadow:0px 2px 5px 0px rgba(163, 163, 163, 0.35);
    .el-form-item{
      width: 33%;
      height: 28px;
      /deep/ .el-form-item__label{
        line-height: 28px;
      }
      /deep/  .el-form-item__content{
        display: flex;
        align-items: center;
        height: 100%;
        .el-cascader{
          width: 100%;
        }
        .el-select{
          width: 100%;
          .el-select__tags {
            max-height: 40px;
            overflow-y: auto;
          }
        }
        .el-input__inner{
          height: 28px;
          line-height: 28px;
        }
      }
    }
  }
  .button_wrap {
    width: 100%;
    display: flex;
    height: 85px;
    align-items: center;
    justify-content: flex-end;
    .el-button{
      margin-right: 30px;
    }
  }
  .el-table{
    /deep/ th{
      padding:5px 0;
      color: rgba(51, 51, 51, 1);
      background: rgba(187, 187, 187, 0.5);
    }
    /deep/ td {
      padding: 0 ;
    }
  }
  .clearButton{
    position: absolute;
    right: 18px;
    top:20px;
    background: #fff;
    color: RGBA(254, 153, 23, 1);
    border: 0;
    /deep/ span{
      display: flex;
      justify-content: center;
      align-items: center;
    }
    img{
      width: 20px;
      margin-right: 8px;
      vertical-align: middle;
    }
  }
  .buttonWrap{
    width: 100%;
    text-align: center;
  }
  /deep/ .el-table__expand-column{
  border-right: 0;
    .cell{
      overflow: visible;
      padding-left: 10px;
      position: relative;
      z-index: 1;
    }
    &+td{
      .cell{
        padding: 0 20px;
      }
    }
  }
  /deep/ .expanded+tr{
    opacity: 0;
    animation: myfirst .5s linear forwards;
  }
  @keyframes myfirst{
    from{opacity:0}
    to{opacity:1}
  }
  .brush_right{
   position: absolute;
    right: 6px;
    top: -4px;
    z-index: 4;
  }
  .ag-theme-balham /deep/ .ag-details-row{
    padding: 0;
  }
  /deep/ .rotateClass{
    transform: rotate(90deg);
    transition: transform 5s ease-in-out
  }

   */
  .isActive {
    background-color: #409EFF;
    color: #fff;
  }
/*>>> .el-tag--info {*/
/*  width: 100px;*/
/*}*/
/*  .el-select{*/
/*          width: 200px;*/
/*          .el-select__tags {*/
/*            max-height: 40px;*/
/*            max-width: 80px;*/
/*            overflow-x: hidden;*/
/*            overflow-y: hidden;*/
/*            >>> .el-select__input {*/
/*              background-color: red;*/
/*            }*/
/*          }*/
/*        }*/
/*        .el-input__inner{*/
/*          height: 28px;*/
/*          line-height: 28px;*/
/*        }*/
  .brush_right{
   position: absolute;
    right: 6px;
    top: -4px;
    z-index: 4;
  }
  .el-form {
    /*padding-right: 120px;*/
    box-shadow:0px 2px 5px 0px rgba(163, 163, 163, 0.35);
    .el-row {
      .el-col {
        height: 50px;
        .el-select{
          max-height: 40px;
          max-width: 300px;
          >>> .el-select__tags{
            max-height: 30px;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            overflow-y: auto;
            /*background-color: red;*/
            /*.el-tag--small {*/
            /*    height: 40px;*/
            /*    max-width: 143px;*/
            /*    !*overflow-y: auto;*!*/
            /*    padding: 0 8px;*/
            /*    line-height: 22px;*/
            /*}*/
            /* .el-select__input {*/
            /*   !*background-color: red;*!*/
            /*  max-width: 160px;*/
            /*   max-height: 30px;*/
            /*   overflow: hidden;*/
            /*}*/
          }
        }
      }

    }

  }
  .clearButton{
    /*position: absolute;*/
    /*left: 42%;*/
    /*top:5px;*/
    background: #fff;
    color: RGBA(254, 153, 23, 1);
    border: 0;
    /deep/ span{
      display: flex;
      justify-content: center;
      align-items: center;
    }
    img{
      width: 20px;
      margin-right: 8px;
      vertical-align: middle;
    }
  }
  >>> .el-input__inner {
    height: 28px!important;
  }
  .overflow-hidden{
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }
</style>

