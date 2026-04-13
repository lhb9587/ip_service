<template>
  <div class="staff" style="box-sizing: border-box;">
    <ViewsSwitching class="ViewsSwitching" @changePattern="changePattern"></ViewsSwitching>
    <div class="queryButton">
      <div class="buttonWrap">
        <el-button-group class="button-group-search"  v-clickoutside="clickoutside">
          <el-button id="mySearch" type="primary" size="mini" @click="handleSearch(0)">搜索</el-button>
          <el-button type="primary" class="searchRight"  size="mini" icon="el-icon-arrow-down" @click.stop.prevent="drawerState=true"></el-button>
          <transition name="show" mode="out-in">
            <div class="searchWrap" id="searchWrap" v-show="drawerState">
              <el-form size="mini" label-width="130px" class="form-container" style="margin-top: 2px">
                <el-form-item label="客户" class="postInfo-container-item">
                  <el-select v-model="queryModuleData.custIdArray"  multiple filterable remote clearable placeholder="请输入关键词" :remote-method="remoteMethod">
                    <el-option v-for="itm in customerList" :key="itm.custId" :label="itm.name" :value="itm.custId">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="申请人" class="postInfo-container-item">
                  <el-select v-model="queryModuleData.appCnNameArray" multiple filterable remote clearable placeholder="请输入关键词" :remote-method="remoteMethodApp">
                    <el-option v-for="itm in appCnNameList" :key="itm.applicantName+Math.random()" :label="itm.applicantName" :value="itm.applicantName">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="申请方向" class="postInfo-container-item">
                  <el-select  v-model="queryModuleData.appFromtoArray" multiple  placeholder="请选择"  filterable  clearable >
                    <el-option v-for="item in ['内-内','外-外','外-内','内-外','台-内']" :key="item" :label="item" :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="案件类型:" class="postInfo-container-item" >
                  <el-multi-cascader
                    @change="queryMaterialType"
                    ref="multiCascader"
                    :show-all-levels="false"
                    :options="$store.state.caseInformation.caseTypeList"
                    multiple
                    filterable
                    clearable
                    :props="defaultParams"
                    change-on-select
                    selectChildren
                    v-model="queryModuleData.caseTypeIds"> </el-multi-cascader>
                </el-form-item>
                <el-form-item  label="案件文号:" class="postInfo-container-item">
                  <el-input type="text" clearable v-model="queryModuleData.agentNumStart" placeholder="请输入案件文号" @change="(value)=>changeTextRange(value,'agentNumEnd')"></el-input>
                  <span>至</span>
                  <el-input type="text" clearable v-model="queryModuleData.agentNumEnd"  placeholder="请输入案件文号"></el-input>
                </el-form-item>
                <el-form-item label="多个案件文号" class="postInfo-container-item">
                  <el-input type="textarea" v-model="queryModuleData.agentNums" clearable></el-input>
                </el-form-item>
<!--                <el-form-item label="客户组" class="postInfo-container-item">-->
<!--                  <el-select  v-model="queryModuleData.custWkgIdArray" multiple  placeholder="请选择"  filterable  clearable >-->
<!--                    <el-option v-for="item in  queryWorkGroupList" :key="item.wkgId" :label="item.groupName" :value="item.wkgId">-->
<!--                    </el-option>-->
<!--                  </el-select>-->
<!--                </el-form-item>-->
                <el-form-item label="部门/客户组:" class="postInfo-container-item">
                    <el-multi-cascader
                      ref="multiCascader"
                      :show-all-levels="false"
                      :options="deptGroupList"
                      multiple
                      filterable
                      clearable
                      change-on-select
                      selectChildren
                      v-model="queryModuleData.deptGroupIds"> </el-multi-cascader>
                  </el-form-item>
                <el-form-item label="承办组" class="postInfo-container-item">
                  <el-select  v-model="queryModuleData.cbWkgId"   placeholder="请选择"  filterable  clearable >
                    <el-option v-for="item in  queryWorkGroupList" :key="item.wkgId" :label="item.groupName" :value="item.wkgId">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="案件名称" class="postInfo-container-item">
                  <el-input type="text" v-model="queryModuleData.caseName" clearable></el-input>
                </el-form-item>


                <el-form-item  label-width="130px"  label="立卷日期:" class="postInfo-container-item">
                  <DataPicker
                    v-model="caseDate"
                    type="date"
                    placeholder="选择日期"
                    @change="(array)=>timePickerChange(array,'caseDateStart','caseDateEnd')">
                  </DataPicker>
                </el-form-item>
                <el-form-item  label-width="130px"  label="申请日期:" class="postInfo-container-item">
                  <DataPicker
                    v-model="appDate"
                    type="date"
                    placeholder="选择日期"
                    @change="(array)=>timePickerChange(array,'appDateStart','appDateEnd')">
                  </DataPicker>
                </el-form-item>
                <div class="line" style="height: 1px;border:1px solid cadetblue;width: 100%;margin: 20px;"></div>
                <el-form-item label="往来类型" class="postInfo-container-item">
                  <el-select default-first-option v-model="queryModuleData.doctId" placeholder="请选择" filterable clearable>
                    <el-option v-for="item in materialDocTypeList" :key="item.doctId" :label="item.typeName" :value="item.doctId">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="文件类型" class="postInfo-container-item">
                  <el-select  v-model="queryModuleData.materialTypeIdArray" multiple  placeholder="请选择"  filterable  clearable >
                    <el-option v-for="item in materialTypeList" :key="item.materialTypeId" :label="item.typeName" :value="item.materialTypeId">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="专利类型" class="postInfo-container-item">
                  <el-select v-model="queryModuleData.patentType" placeholder="请选择" filterable clearable>
                    <el-option v-for="item in this.patentTypeList"
                               :key="item.id" :label="item.label" :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="文件名称" class="postInfo-container-item">
                  <el-input type="text" v-model="queryModuleData.eventName" clearable></el-input>
                </el-form-item>
                <el-form-item label="上传文件名称" class="postInfo-container-item">
                  <el-input type="text" v-model="queryModuleData.materialName" clearable></el-input>
                </el-form-item>
                <!-- <el-form-item label="上传文件:">
                  <a v-for="item in materialName.materialArray" style="color: #409EFF" target="_blank" :href="`ipdoc${item.address}`">{{item.name}}</a>
                </el-form-item> -->
                <el-form-item  label-width="130px"  label="绝限日期:" class="postInfo-container-item">
                  <DataPicker
                    v-model="abslimitDate"
                    type="date"
                    placeholder="选择日期"
                    @change="(array)=>timePickerChange(array,'abslimitDateStart','abslimitDateEnd')">
                  </DataPicker>
                </el-form-item>
                <el-form-item  label-width="130px"  label="收文日期:" class="postInfo-container-item">
                  <DataPicker
                    v-model="recvDate"
                    type="date"
                    placeholder="选择日期"
                    @change="(array)=>timePickerChange(array,'recvDateStar','recvDateEnd')">
                  </DataPicker>
                </el-form-item>
                <el-form-item  label-width="130px"  label="所属月:" class="postInfo-container-item">
                  <DateMonthPicker class="DataPicker" v-model="queryModuleData['belongToDateArray']"></DateMonthPicker>
                </el-form-item>
                <el-form-item  label-width="130px"  label="创建日期:" class="postInfo-container-item">
                  <DataPicker
                    v-model="createDate"
                    type="date"
                    placeholder="选择日期"
                    @change="(array)=>timePickerChange(array,'createDateStart','createDateEnd')">
                  </DataPicker>
                </el-form-item>
                <el-form-item  label-width="130px"  label="递交日期:" class="postInfo-container-item" v-if="computedSubmitDate">
                  <DataPicker
                    v-model="djSubmitDate"
                    type="date"
                    placeholder="选择日期"
                    @change="(array)=>timePickerChange(array,'djSubmitDateStart','djSubmitDateEnd')">
                  </DataPicker>
                </el-form-item>
                <el-form-item label="上报事项:" class="postInfo-container-item" v-if="computedSubmitDate">
                  <el-select clearable filterable default-first-option v-model="queryModuleData.instructionReportMatter" placeholder="请选择">
                    <el-option
                      v-for="item in reportMatterList"
                      :key="item.id"
                      :label="item.typeName"
                      :value="item.typeName">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item  label-width="130px"  label="注册日期:" class="postInfo-container-item">
                  <DataPicker
                    v-model="regDate"
                    type="date"
                    placeholder="选择日期"
                    @change="(array)=>timePickerChange(array,'regDateStart','regDateEnd')">
                  </DataPicker>
                </el-form-item>
                <el-form-item  label-width="130px"  label="缴费日期:" class="postInfo-container-item">
                  <DataPicker
                    v-model="payDate"
                    type="date"
                    placeholder="选择日期"
                    @change="(array)=>timePickerChange(array,'payDateStart','payDateEnd')">
                  </DataPicker>
                </el-form-item>
                <el-form-item label="创建人" class="postInfo-container-item">
                  <el-input type="text" v-model="queryModuleData.creater" clearable></el-input>
                </el-form-item>
              </el-form>
              <div class="clearWrap" v-if="drawerState"  id="clearWrap" >
                <el-button  size="mini"   @click="clearSearch"><span>重置</span></el-button>
                <el-button  type="primary" size="mini"  @click="handleSearch(0)">搜索</el-button>
              </div>
            </div>
          </transition>
        </el-button-group>
        <el-button style="margin-left: 10px" type="primary" size="mini" v-allow='240' @click="changeSelectionType('下载')" >下载</el-button>
        <el-button  type="primary" size="mini" v-allow='241'  @click="changeSelectionType('删除')">删除</el-button>
      </div>
    </div>
    <div style="cursor: pointer; float: right; align-items: center; right: 0px; bottom: -6px; font-size: 14px; padding-right: 6px;">
          <el-button type="text" @click="exportList(2)" >导出</el-button>
          <span style="color: #52A2F4;margin: 0 5px"> / </span>
          <el-button type="text" @click="exportList(1)">全局导出</el-button>
<!--      <el-button type="text" @click="exportList(1)"><i class="el-icon-download">导出</i></el-button>-->
<!--      <img @click="exportList(2)" src="@/assets/moon.png" style="width: 16px;height: 16px" width="16" alt="">-->
    </div>
    <div style="display: flex; position: relative;">
      <TitleTotal :total="total" :currentPageSize="currentPageSize" style="float: left;"/>
      <div class="button_wrap" v-if="selectionState" style="float: left;margin-left: 20px;">
        <el-button class="exactButton" size="mini" type="primary" @click="jumpDetailSubmisson">{{multipleTypeText}}</el-button>
        <el-button class="exactButton"  size="mini" @click="selectionState=false">取消</el-button>
      </div>
      <el-button class="exactButton"  type="primary"  size="mini" style="margin-left: 10px" @click="gridApi.deselectAll();gridApi.selectAllFiltered()">全选</el-button>
        <el-button class="exactButton"  size="mini" @click="gridApi.deselectAll()">清除所选</el-button>
    </div>
    <div class="content_wrap">
        <div class="left_wrap" :style="{width:pattern?leftWrapWidth:'100%' }">
          <div class="dots" @click="handleCheckboxState">
            <span class="dot">.</span>
            <span class="dot">.</span>
            <span class="dot">.</span>
          </div>
          <el-button class="brush_right" :class="brushRightHasFilter?'red':''" @click="brushRight" type="text"
                     icon="el-icon-brush"></el-button>
          <AgGridVue :style="{width:'100%',height: clientHeight+'px'}"
               class="ag-theme-balham"
               :columnDefs="columnDefs"
               :rowData="rowData"
               :localeText="$store.state.caseInformation.localeText"
               rowSelection="multiple"
               suppressCellSelection
               @rowClicked="rowClicked"
                @dragStopped="dragStopped"
               :getContextMenuItems="getContextMenuItems"
               @grid-ready="onGridReady"
               @sortChanged="refreshEvenRowsCurrencyData"
               @filterChanged="refreshEvenRowsCurrencyData"
               :suppressDragLeaveHidesColumns="true"
               :suppressMakeColumnVisibleAfterUnGroup="true"
               rowGroupPanelShow="always"
               :groupSelectsChildren="true"
               :suppressAggFuncInHeader="true"
               :autoGroupColumnDef="autoGroupColumnDef"
          >
          </AgGridVue>

          <pagination
            v-show="total>0"
            :total="total"
            :pageSizes="pageSizesList"
            :page.sync="listQuery.pageNo"
            :limit.sync="listQuery.pageSize"
            @pagination="queryCaseMaterialList"
          />
        </div>

        <div class="right_wrap" :style="{position:'relative','margin-left':currentCaseId&&pattern?'10px' :'0',height:clientHeight+'px'}">
            <!--<span class="el-icon-close" slot="close" style="cursor:pointer;position: absolute;right: 0;top: 10px;z-index: 1000" @click="closeCurrentRow"></span>-->
            <seeCaseDetail :style="cssVar" v-if="currentCaseId&&pattern" :case-id="currentCaseId" :taskType="taskType" :sign="1" :backsign="0">
            </seeCaseDetail>
          <limitElectronicDocument v-else-if="currentTltId&&pattern" :tltId="currentTltId"></limitElectronicDocument>
          <div v-else style="margin-left: 45%;margin-top: 30px">暂无数据</div>

        </div>
    </div>

    <el-dialog
      title="预览"
      append-to-body
      :visible.sync="pdfDataState"
      width="50%"
      height="100vh"
      :modal="false"
      top="0"
      class="pdfDialog"
      :close-on-click-modal="false"
      v-dialogDrag
    >
      <iframe class="iframe"  :src="pdfData"></iframe>
    </el-dialog>
    <SelectOption :buss-id="bussId" v-if="selectionOptionState" :dialog-visible="selectionOptionState"
                  @cancel="closeSelect" :idArray="getCurrentRowsData('materialId')"
                  :defaultMultipleSelect="preferenceList.map(i=>i.title)"
                  :propsArray="getCurrentRowsProps()"
                  :exportType="exportType" :exportQueryModel="exportQueryModel">
    </SelectOption>

    <div class="checkbox" v-show="checkboxState">
      <el-select ref="checkCaseSelect" v-model="checkCaseList" multiple reserve-keyword filterable
                 placeholder="请选择" collapse-tags :popper-append-to-body="false" @visible-change="handleChange"
                 :filter-method="filterCheck">
        <template slot="">
          <div class="checkbox_bottom">
            <el-button size="mini" round @click.stop="delPreference(1)">恢复默认</el-button>
            <el-button style="margin-right: 3px" size="mini" round @click.stop="savePreference(1)">保存设置
            </el-button>
            <!--<el-button size="mini" round @click.stop="checkNotAtAll">全不选</el-button>-->
          </div>
        </template>
        <el-option v-for="(item,idx) in selectColumnList.filter(item =>item.COLUMN_COMMENT.includes(filterText))"
                   :key="item.COLUMN_NAME" :label="item.COLUMN_COMMENT" :value="item.COLUMN_NAME">
          <!--<el-checkbox v-model="selectBox[idx]">{{item.COLUMN_COMMENT}}</el-checkbox>-->
        </el-option>
      </el-select>
    </div>

    <!--    文件下载选择命名方式弹框-->
    <el-dialog
      class="file-down"
      :visible.sync="fileDownLoadView"
      width="40%"
      top="50px"
      title="文件命名"
      :before-close="closeDialog"
    >
      <FileDownLoadDialog ref="filedown" :caseTypeNum="10" @downLoadfiles="downLoadfiles" @closeDialog="closeDialog"></FileDownLoadDialog>
    </el-dialog>
  </div>
</template>

<script>
  import limitElectronicDocument from '@/views/workbench/toDoTasks/components/limitElectronicDocument'
  import { querycustSelectClass } from '@/api/customerList.js'
  import seeCaseDetail from '@/views/workbench/case/components/ManualIdentification/seeCaseDetail'
  import ViewsSwitching from '@/views/workbench/case/components/ViewsSwitching'
  import {mapState } from "vuex";
  import { doEditInOffice, getProgID } from '@/utils/editInOffice.js'
  import SelectOption from '@/views/workbench/case/components/SelectOption'
  import Pagination from "@/components/Pagination";
  import { queryCaseMaterialList,queryCustomerNameId,queryMaterialType,queryMaterialDocType,downloadMaterial,deleteCaseMaterial,deleteMaterialById,selectColumn,queryPreference,savePreference,delPreference} from '@/api/caseList'
  import { delCaseMaterialUrl
  } from "@/api/caseDetail";
  import { queryAllUrl } from "@/api/applicant";
  import { queryWorkGroup } from '@/api/systemList'
  import axios from 'axios'
  import jsFileDownload from 'js-file-download'
  import {queryDeptGroup} from "../../../../api/caseList";
  import FileDownLoadDialog from '@/components/FileDownLoadDialog';

  export default {
    props:{
      caseTypeParty:{
        // default:3
      }
    },
    name: 'caseMaterialDetail',
    data() {
      var tableHeader = []
      if (localStorage.getItem('tableHeader') && JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$route.name)) {
        tableHeader = JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$route.name).tableHeader
      }
      return {
        queryInfo: {},
        autoGroupColumnDef:{
          headerName: '组',
          field: 'group',
          headerCheckboxSelection: true,
          cellRenderer: 'agGroupCellRenderer',
          cellRendererParams: { checkbox: true },
        },
        deptGroupList: [],
        currentTltId: '',
        currentMaterialId: '',
        reportMatterList: [],
        brushRightHasFilter: false,
        filterText: '',
        tableHeader: tableHeader,
        checkCaseList: [],
        checkboxState: false,
        exportType: 1,
        taskType: '',
        caseMaterialId: '',
        currentCaseId: '',
        leftWrapWidth:localStorage.getItem('leftWrapWidth')?localStorage.getItem('leftWrapWidth'):'60%',
        createDate:[],
        abslimitDate:[],
        recvDate:[],
        appDate:[],
        caseDate:[],
        djSubmitDate:[],
        regDate:[],
        payDate:[],
        isSpinShow: false,
        pageSizesList:[10, 50, 200,500,1000],
        listQuery:{
          caseTypeParty:this.caseTypeParty,
          pageNo:0,
          pageSize: JSON.parse(localStorage.getItem('pageSize'))?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name)?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name).pageSize:10:10,
        },
        currentPageSize:0,
        total:0,
        bussId: 35,
        defaultcolumnDefs:[
          {
            headerName: '序号',
            field: 'sid',
            width: 80,
            enableRowGroup: true,
            //enablePivot: true,
            cellRenderer:this.cellRenderer,
            floatingFilter:true,
            filter: false,
            cellClass: 'vAlign',
            suppressMenu: true,
            'pinned': 'left', //固定在左边
            checkboxSelection: false,//设置为ture显示为复选框
            headerCheckboxSelection: false,//表头是否也显示复选框，全选反选用
            headerCheckboxSelectionFilteredOnly: true
          },
        ],
        patentTypeList: [{ label: '发明', id: 1296 }, { label: '实用新型', id: 1297 }, { label: '外观', id: 1298 }],
        columnDefs:[
          {headerName: '客户', field: 'custFullName'},
          {headerName: '申请人', field: 'applicantName'},
          {headerName: '申请方向', field: 'appFromto'},
          {headerName: '案件文号', field: 'agentNum'},
          {headerName: '往来类型', field: 'docTypeName'},
          {headerName: '文件类型', field: 'typeName'},
          {headerName: '文件名称', field: 'eventName'},
          {headerName: '上传文件名称', field: 'materialName'},
          {headerName: '客户组', field: 'custWorks'},
          {headerName: '承办组', field: 'cbWorks'},
          {headerName: '案件名称', field: 'caseName'},
          {headerName: '立卷日期', field: 'caseDate'},
          {headerName: '申请日期', field: 'appDate'},
          {headerName: '创建日期', field: 'createDate'},
          {headerName: '创建人', field: 'creater'},
          {headerName: '案件类型', field: 'caseType'},
          {headerName: '绝限日期', field: 'abslimitDate'},
          {headerName: '收文日期', field: 'recvDate'},
          {headerName: '专利类型', field: 'patentTypeStr'}
        ],
        rowData: [

        ],
        queryModuleData:{
          custIdArray:[],
          appCnNameArray:[],
          appFromtoArray:[],
          agentNumStart: '',
          agentNumEnd: '',
          // createDateArray:[],
          materialTypeIdArray:[],
          deptGroupIds:[],
          cbWkgId:[],
          eventName:'',
          materialName:'',
          creater:'',
          doctId:'',
          caseTypeIds:[],
          patentType: '',
          instructionReportMatter: ''
        },
        defaultParams: {
          //級聯菜單默認
          value: "caseTypeId",
          label: "caseType",
          children: "childrens",
          checkStrictly: true,
          multiple: true
        },
        customerList:[],
        appCnNameList:[],
        materialTypeList:[],
        queryWorkGroupList:[],
        materialDocTypeList:[],
        preferenceList: [],
        drawerState: false,
        exportQueryModel:'',
        selectionState:false,
        selectionOptionState:false,
        multipleTypeText:'',
        pdfData:'',
        pdfDataState:false,
        selectColumnList: [],
        filterData: {},
        checkFilterList: [],
        fileDownLoadView:false
      }
    },
    created() {
      // 路由带参数，使用路由参数
      if (this.$route.query.agentNums) {
        this.queryInfo = {
          agentNums: this.$route.query.agentNums.split('@').join('/n'),
          payDate: this.$route.query.payDate,
          materialTypeIdArray: [301423]
        }
        this.handleSearch()
      }
      this.querycustSelectClass();
      this.queryMaterialDocType()
      this.queryWorkGroup()
      this.getAllWfs()
      // this.columnDefs=[...this.defaultcolumnDefs,...this.columnDefs.map(item=>({
      //   headerName: item.headerName,
      //   field: item.field,
      //   resizable: true,
      //   sortable: true,
      //   filter: 'agSetColumnFilter',
      //   cellRenderer:this.cellRenderer,
      //   menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],
      //   filterParams: {
      //      comparator: (a, b)=>{
      //         return this.$commonUtils.sort(a,b,item.value)
      //       }
      //   }
      // }))]
    },
    mounted(){
      this.rightDrag()
      this.defaultQuerySearch()
      this.queryDeptGroup()
    },
    methods: {
      closeDialog() {
        this.fileDownLoadView = false
        this.$refs.filedown.clearData()
      },
      // 文件下载
      downLoadfiles(data) {
        if (this.getSelectedRows().map(item => item.materialId || item.mailId).filter(i => !!i).length == 0) {
          this.$message.error('没有可下载的文件')
          return;
        };
        downloadMaterial({
          zipFlag: 1,
          materialIdList: this.getSelectedRows().map(item => item.materialId),
          mailIdList: this.getSelectedRows().map(item => item.mailId),
          ...data
        }).then(res => {
          this.$commonUtils.downLoadAll({download: res.data.replace(/(.*\/)*([^.]+).*/ig,"$2",'')+'.'+res.data.replace(/.+\./,""), url: "ipdoc" + res.data})
          this.closeDialog()
        })
      },
      queryDeptGroup(){
        queryDeptGroup().then(res => {
          this.deptGroupList = res.data
        })
      },
      defaultQuerySearch(){
        const data = JSON.parse(localStorage.getItem('queryModuleData')) ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$route.name) ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$route.name).queryModuleData : {} : {}
        for (let key in data) {
          this.$set(this.queryModuleData, key, data[key])
        }
        // caseDate
        if (this.queryModuleData.caseDateStart || this.queryModuleData.caseDateEnd) {
          this.dateToArray(this.queryModuleData.caseDateStart||"", this.queryModuleData.caseDateEnd || "", "caseDate")
        }
        // appDate
        if (this.queryModuleData.appDateStart || this.queryModuleData.appDateEnd) {
          this.dateToArray(this.queryModuleData.appDateStart || "", this.queryModuleData.appDateEnd || "", "appDate")
        }
        // abslimitDate
        if (this.queryModuleData.abslimitDateStart || this.queryModuleData.abslimitDateEnd) {
          this.dateToArray(this.queryModuleData.abslimitDateStart || "", this.queryModuleData.abslimitDateEnd || "", "abslimitDate")
        }
        // recvDate
        if (this.queryModuleData.recvDateStar || this.queryModuleData.recvDateEnd) {
          this.dateToArray(this.queryModuleData.recvDateStar || "", this.queryModuleData.recvDateEnd || "", "recvDate")
        }

        // createDate
        if (this.queryModuleData.createDateStart || this.queryModuleData.createDateEnd) {
          this.dateToArray(this.queryModuleData.createDateStart || "", this.queryModuleData.createDateEnd || "", "createDate")
        }


        // djSubmitDate
        if (this.queryModuleData.djSubmitDateStart || this.queryModuleData.djSubmitDateEnd) {
          this.dateToArray(this.queryModuleData.djSubmitDateStart || "", this.queryModuleData.djSubmitDateEnd || "", "djSubmitDate")
        }

        // regDate
        if (this.queryModuleData.regDateStart || this.queryModuleData.regDateEnd) {
          this.dateToArray(this.queryModuleData.regDateStart || "", this.queryModuleData.regDateEnd || "", "regDate")
        }
        if (this.queryModuleData.payDateStart || this.queryModuleData.payDateEnd) {
          this.dateToArray(this.queryModuleData.payDateStart || "", this.queryModuleData.payDateEnd || "", "payDate")
        }

        if (this.queryModuleData.custIdArray && this.queryModuleData.custIdArray.length) {
          queryCustomerNameId({ pageNo: 1, pageSize: 100, custIdArray: this.queryModuleData.custIdArray }).then(res => {
            this.customerList = res.data
          })
        }
      },
      getCurrentRowsData(key){
        if (this.gridApi && this.gridApi.rowModel) {
          return this.gridApi.rowModel.rootNode.childrenAfterSort.map(item => item.data).map(item => item[key])
        }
        return []
      },
      getCurrentRowsProps(){
        if (this.gridApi && this.gridApi.rowModel) {
          return this.gridApi.rowModel.rootNode.childrenAfterSort.map(item => item.data).map(item => ({caseMaterialId:item.caseMaterialId, mailId:item.mailId}))
        }
        return []
      },
      querycustSelectClass(){
        querycustSelectClass({classId: '1069',}).then(res => {
          this.reportMatterList = res.data['1069']
        })
      },
      brushRight() {
        let data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel')
        let arr = Object.keys(data)
        arr.forEach(item => {
          this.gridApi.destroyFilter(item)
        })
        this.$commonUtils.saveFilterModel(this.$options.name+this.$route.name,'FilterModel', {})
      },
      getFilterModel() {
        this.$nextTick(() => {
          let data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel')
          let arr = Object.keys(data)
          let arrInstance = arr.map(item => this.gridApi.getFilterInstance(item))
          arrInstance.forEach((item, index) => {
            // item.selectNothing()
            item.setModel(data[arr[index]])
            item.applyModel()
          })
          this.gridApi.onFilterChanged()
          let sortData = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'SortModel')
          if (sortData && sortData.length) {
            this.gridApi.setSortModel(sortData)
            this.gridApi.onSortChanged()
          }
          if(this.gridApi.rowModel.rootNode.childrenAfterFilter.length){
            this.gridApi.rowModel.rootNode.childrenAfterFilter[0].setSelected(true)
            if(this.gridApi.rowModel.rootNode.childrenAfterFilter[0].data.caseId) {
              const param = this.gridApi.rowModel.rootNode.childrenAfterFilter[0]
              this.caseMaterialId = param.data.caseMaterialId
              // this.currentMaterialId = param.data.materialId || param.data.mailId
              this.currentCaseId = param.data.caseId
              this.taskType = param.data.taskType
              if(!this.currentCaseId){
                this.currentTltId = param.data.tltId
              }
            }
          }

        })
      },
      dragStopped(params) {
        let tableHeader = params.columnApi.columnController.gridColumns.map(item => ({
          label: item.colDef.headerName,
          width: item.actualWidth,
          prop: item.colDef.field,
        })).filter(item => item.prop != "group" && item.prop != "operation")
        var arr = JSON.parse(localStorage.getItem('tableHeader'))
        arr.find(item => item.name == this.$route.name).tableHeader = tableHeader
        localStorage.setItem('tableHeader', JSON.stringify(arr))
        this.changeHeader(tableHeader)
        // console.log(a);
      },
      changeHeader(n) {
        if (n && n.length) {
          this.checkCaseList = n.map(item => item.prop).filter(item => item != 'sid')
          let list2 = this.checkCaseList.map(item => ({
            title: this.selectColumnList.find(i => i.COLUMN_NAME === item)
              .COLUMN_COMMENT,
            value: item
          }));
          const data = {
            userId: this.$store.getters.userId,
            bussId: this.bussId,
            list2
          };
          savePreference(data).then(res => {

          });
        }
      },
      handleChange(boolean) {
        if (!boolean) {
          this.checkboxState = false;
        }
      },
      filterCheck(val) {
        this.filterText = val;
      },
      delPreference(num) {
        const data = {
          userId: this.$store.getters.userId,
          bussId: this.bussId
        };
        delPreference(data).then(res => {
          if (res.success) {
            this.checkboxState = false;
            if (!num) {
              this.getList();
            }
            this.getAllWfs();
          }
        });
      },
      savePreference(num) {
        let list2 = this.checkCaseList.map(item => ({
          title: this.selectColumnList.find(i => i.COLUMN_NAME === item)
            .COLUMN_COMMENT,
          value: item
        }));
        const data = {
          userId: this.$store.getters.userId,
          bussId: this.bussId,
          list2
        };
        savePreference(data).then(res => {
          if (res.success) {
            this.checkboxState = false;
            this.filterText = ''
            if (!num) {
              this.queryCaseMaterialList();
            }
            this.getAllWfs();
          }
        });
      },
      getLoactionWidth(label) {
        if (!localStorage.getItem('tableHeader')) {
          return 'auto'
        } else {
          var arr = JSON.parse(localStorage.getItem('tableHeader'))
          if (arr.find(item => item.name == this.$route.name)) {
            var header = arr.find(item => item.name == this.$route.name).tableHeader
            if (header.find(item => item.label == label)) {
              return header.find(item => item.label == label).width
            } else {
              return 'auto'
            }
          } else {
            return 'auto'
          }
        }
      },
      getAllWfs() {
        const data = {
          userId: this.$store.getters.userId,
          bussId: this.bussId
        };
        Promise.all([selectColumn(data), queryPreference(data)]).then(res => {
          this.selectColumnList = res[0].data;

          this.preferenceList = res[1].data;
          this.columnDefs = [...this.defaultcolumnDefs, ...this.preferenceList.map(item => ({
            headerName: item.title,
            field: item.value,
            width: this.getLoactionWidth(item.title) == 'auto' ? 200 : this.getLoactionWidth(item.title),
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
          }))]
          this.$nextTick(() => {
            this.columnDefs.forEach(item => {
              this.columnApi.getColumn(item.field)&&this.columnApi.getColumn(item.field).addEventListener('menuVisibleChanged', () => {
                if (document.querySelector(".ag-tabs")) {
                  new this.$DraginResize(document.querySelector(".ag-set-filter-list"), {
                    clone: true,
                    end(info) {
                      if (info.dir == 'ver') {
                        this.elem.style.height = info.height + 'px';
                      } else if (info.dir == 'hor') {
                        this.elem.style.width = info.width + 'px';
                      }
                    }
                  })
                }
                // let arr = this.columnDefs.map(item => item.field)
                // if (this.columnDefs.map(itm => itm.field).diff(arr).includes(item.field)) {
                //   this.gridApi.getFilterInstance(item.field).selectNothing()
                // }
              });
            })
          })
          this.tableHeader = this.preferenceList.map(item => ({
            label: item.title,
            prop: item.value,
            width: this.getLoactionWidth(item.title)
          }))

          this.saveLocation()
          this.checkCaseList = this.preferenceList.map(item => item.value);
          this.preferenceList.forEach(item => {
            this.$set(this.filterData, item.value, []);
          });
          this.checkFilterList = this.preferenceList.map(item => false);
        });
      },
      saveLocation() {
        if (!localStorage.getItem('tableHeader')) {
          let arr = []
          arr.push({name: this.$options.name, tableHeader: this.tableHeader})
          localStorage.setItem('tableHeader', JSON.stringify(arr))
        } else {
          let arr = JSON.parse(localStorage.getItem('tableHeader'))
          if (arr.find(item => item.name == this.$route.name)) {
            arr.find(item => item.name == this.$route.name).tableHeader = this.tableHeader
            localStorage.setItem('tableHeader', JSON.stringify(arr))
          } else {
            arr.push({name: this.$route.name, tableHeader: this.tableHeader})
            localStorage.setItem('tableHeader', JSON.stringify(arr))
          }
        }

      },
      handleCheckboxState() {
        this.checkboxState = !this.checkboxState;
      },
      rightDrag(){
        let that=this
        // document.getElementById('searchWrap').onscroll=function (e) {
        //   that.clearWrapTop = e.target.scrollTop+ e.target.offsetHeight
        //   document.getElementById('clearWrap').style.top = that.clearWrapTop -40 + 'px'
        // }
        document.querySelector('.left_wrap') && new this.$DraginResize(document.querySelector(".left_wrap"), {
          clone: true,
          end(info) {
            if (info.dir == 'ver') {
              this.elem.style.height = info.height + 'px';
            }
            else if (info.dir == 'hor') {
              this.elem.style.width = info.width + 'px';
              localStorage.setItem('leftWrapWidth', info.width + 'px')
              that.leftWrapWidth = info.width + 'px'
            }
          }
        })
      },
      rowClicked(param){
        // if(this.currentMaterialId === param.data.materialId || this.currentMaterialId === param.data.mailId )return;
        if(param.node.selected) {
          this.currentCaseId = ''
          this.currentTltId = ''
          // this.caseMaterialId = ''
          this.$nextTick(() => {
            this.caseMaterialId = param.data.caseMaterialId
            // this.currentMaterialId = param.data.materialId || param.data.mailId
            this.currentCaseId = param.data.caseId
            this.taskType = param.data.taskType
            if(!this.currentCaseId){
              this.currentTltId=param.data.tltId
            }
          })
        }
      },
      changePattern(e){
        if(e===1){
          this.$store.commit('user/SET_PATTERN',false)
        } else {
          this.$store.commit('user/SET_PATTERN',true)
          // if(this.caseList.length&&!this.currentId){
          //   let row = this.caseList.find((item,index) => index == 0)
          //   // this.currentId=row[this.getCurFilterId(this.pageTitle)]
          //   // this.currentCaseId=row.caseId
          //   // this.$refs.caseListMultiple.setCurrentRow(row)
          // }
        }
      },
      dateToArray(start, end, key){
        this.$set(this, key, [start, end])
      },
      timePickerChange(e,type1,type2){
        this.queryModuleData[type1]=e[0]
        this.queryModuleData[type2]=e[1]
      },
      handleSearch() {

        this.drawerState=false
        this.selectionState = false;
        this.listQuery.pageNo = 1;
        this.queryCaseMaterialList();
      },
      clearSearch() {
        this.caseDate = []
        this.appDate = []
        this.createDate = []
        this.abslimitDate=[]
        this.recvDate=[]
        this.regDate = []
        this.payDate = []
        for (var key in this.queryModuleData) {
          if(!['officialInformScreen', 'myCase', 'instructionSubmitStatus'].includes(key)){
            if(key.includes('Date')){
              this.$set(this.queryModuleData,key,['',''])
            } else if(key.includes('Array')) {
              this.$set(this.queryModuleData,key,[])
            }else if(key==='caseTypeIds'){
              this.$set(this.queryModuleData,key,[])
              if(this.$refs.multiCascader){
                this.$refs.multiCascader.$el.querySelector('.el-input__inner').value=''
              }
            } else if (key==='deptGroupIds') {
              this.$set(this.queryModuleData,key,[])
            } else{
              this.$set(this.queryModuleData,key,null)
            }
          }
        }
      },
      closeSelect(){
        this.selectionState=false
        this.selectionOptionState=false
      },
      exportList(flag){
        this.exportType=flag
        this.selectionOptionState = true
        // if(flag==2){
        //   this.selectionState = true;
        //   this.multipleTypeText = '列表导出';
        // } else if(flag == 1) {
        //   this.selectionOptionState=true
        // }
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
          this.columnDefs.push({})
          this.columnDefs.pop({})
        }else {
          this.columnDefs.find(item=>item.field=='sid').checkboxSelection=false
          this.columnDefs.find(item=>item.field=='sid').headerCheckboxSelection=false
          this.columnDefs.push({})
          this.columnDefs.pop({})
        }
      },
      changeSelectionType(type){
        if(type=='下载'){
          this.multipleTypeText='下载'
          this.selectionState=true
        }
        if(type=='删除'){
          this.multipleTypeText = '删除';
          this.selectionState=true
        }
      },
      // jumpDetailSubmissons(){
      //   downloadMaterial({zipFlag:1,materialIdList:this.getSelectedRows().map(item=>item.materialId)}).then(res=>{
      //       axios.get(`ipdoc${res.data}`,{ responseType: 'blob', headers: {
      //           "Content-Type": "application/json; charset=utf-8",
      //         }}).then(function (response) {
      //         jsFileDownload(response.data, res.data.replace(/(.*\/)*([^.]+).*/ig,"$2",'')+'.'+res.data.replace(/.+\./,""));
      //       })
      //       this.selectionState=false
      //     })0
      // },
      jumpDetailSubmisson(){
        if ( this.multipleTypeText === "下载") {
          // downloadMaterial({zipFlag:1,materialIdList:this.getSelectedRows().map(item=>item.materialId), mailIdList: this.getSelectedRows().map(item=>item.mailId)}).then(res=>{
          //   if (res.messageType == 100) {
          //     this.$confirm(res.message, '提示', {
          //       confirmButtonText: '确定',
          //       cancelButtonText: '取消',
          //       type: 'warning'
          //     }).then(() => {
          //       this.$commonUtils.downLoadAll({download: res.data.replace(/(.*\/)*([^.]+).*/ig,"$2",'')+'.'+res.data.replace(/.+\./,""), url: "ipdoc" + res.data})
          //     }).catch(() => {
          //       this.$commonUtils.downLoadAll({download: res.data.replace(/(.*\/)*([^.]+).*/ig,"$2",'')+'.'+res.data.replace(/.+\./,""), url: "ipdoc" + res.data})
          //     })
          //   } else {
          //     this.$commonUtils.downLoadAll({download: res.data.replace(/(.*\/)*([^.]+).*/ig,"$2",'')+'.'+res.data.replace(/.+\./,""), url: "ipdoc" + res.data})
          //   }
          //   // axios.get(`ipdoc${res.data}`,{ responseType: 'blob', headers: {
          //   //     "Content-Type": "application/json; charset=utf-8",
          //   //   }}).then(function (response) {
          //   //   jsFileDownload(response.data, res.data.replace(/(.*\/)*([^.]+).*/ig,"$2",'')+'.'+res.data.replace(/.+\./,""));
          //   // })
          //   this.selectionState=false
          // })
          this.fileDownLoadView = true
        }
        if (this.multipleTypeText === "删除") {
          this.$confirm('此操作将永久删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(res=>{
            deleteMaterialById({materialList: this.getSelectedRows().map(item=>({
                caseId:item.caseId,
                materialId:item.materialId,
                mailId:item.mailId,
              }))}).then(res=>{
              this.selectionState=false
              this.queryCaseMaterialList()
            })
          }).catch(err=>{
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          })
        }
        if(this.multipleTypeText === "列表导出"){
          this.selectionOptionState=true
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
      queryMaterialType(){
        queryMaterialType({doctId: this.queryModuleData.doctId, caseTypeIdList: [...new Set(this.queryModuleData.caseTypeIds.flat())].filter(item=>[1,2,3,4,75,76,86].includes(item))}).then(res=>{
          this.materialTypeList=res.data
        })
      },
      queryMaterialDocType() {
        queryMaterialDocType().then(res => {
          this.materialDocTypeList = res.data;
        });
      },
      changeTextRange(value, property) {
        this.$set(this.queryModuleData, property,value);
      },
      clickoutside(){
        this.drawerState = false
      },
      remoteMethod(value) {
        if (value){
         queryCustomerNameId({ pageNo: 1, pageSize: 100, keyword: value }).then(res => {
            this.customerList = res.data
          })
        }
      },
      remoteMethodApp(value) {
        if (value) {
          queryAllUrl({ pageNo: 1, pageSize: 100, applicantName: value,orderBy:1 }).then(res => {
            this.appCnNameList=res.data
          })
        }

      },
      queryWorkGroup(){
        queryWorkGroup().then(res=>{
          this.queryWorkGroupList=res.data || []
          this.queryWorkGroupList = this.queryWorkGroupList.filter(item => item.status)
        })
      },
      getContextMenuItems(params){
        return [{name:'复制',
          action: () =>{
            this.$copyText(params.value).then(
              res => {
              })
          }},
          {name:'预览',
            action:()=>{
              this.preView(params)
            }
          },
          {name:'删除',
            action:()=>{
              this.deleteDeptId(params.node.data)

            },permissions:241}].filter(item=>{
          if(item.permissions){
            return this.$store.getters.permissions.includes(item.permissions)
          }else {
            return true
          }
        })
      },
      // preView(params){
      //   if(params.node.data&&params.node.data.address){
      //     if(['pdf','jpg','png'].some(item=>params.node.data.address.replace(/.+\./,"").toLocaleLowerCase()==item)){
      //       this.pdfDataState=false
      //       this.pdfData=`ipdoc${params.node.data.address}`
      //       this.$nextTick(()=>{
      //         this.pdfDataState=true
      //       })
      //
      //     }else {
      //       this.pdfDataState=false
      //       this.$commonUtils.downLoadAll({url:`ipdoc${params.node.data.address}`})
      //     }
      //
      //   }
      // },
      preView(params){
        var data = params.node.data
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
            // doEditInOffice(url, getProgID(url))
          } else if(['pdf','jpg','png'].some(item=>url.replace(/.+\./,"").toLocaleLowerCase()==item)){

            this.pdfDataState=false
            this.pdfData=`ipdoc${params.node.data.address}`
            this.$nextTick(()=>{
              this.pdfDataState=true
            })
          } else {
            this.pdfDataState=false
            this.$commonUtils.downLoadAll({url:`ipdoc${params.node.data.address}`})
          }
      },
      cellRenderer(params){
        if(params.colDef.field=='sid'){
          return params.rowIndex+1
        }
        if(params.colDef.field=='recvDate'){
          return `<span title="${params.value}">${params.value?params.value.slice(0,10):''}</span>`
        }
        if(params.colDef.field=='materialName'){
          var eDiv = document.createElement('div');
          eDiv.innerHTML = `<span class="btn-simple" style="cursor: pointer;color: #00b0ff" title="${params.value}">${params.value?params.value:''}</span>`
          var eButton = eDiv.querySelectorAll('.btn-simple')[0];

          eButton.addEventListener('click', ()=> {
            this.preView(params)
          });

          return eDiv;
        }
        return `<span title="${params.value}">${params.value?params.value:''}</span>`
      },
      refreshEvenRowsCurrencyData(params) {
        this.currentPageSize = params.api.rowModel.rootNode.allChildrenCount
        this.gridApi.rowModel.rootNode.childrenAfterFilter&&this.gridApi.rowModel.rootNode.childrenAfterFilter.length&&this.gridApi.rowModel.rootNode.childrenAfterFilter.forEach(rowNode => {
          setTimeout(() => {
            rowNode.setDataValue(
            'sid',
            rowNode.rowIndex + 1)
          }, 0)
        });
        if (this.rowData.length) {
          if (params.type == "filterChanged") {
            let obj = this.gridApi.getFilterModel()
            for (let k in obj) {
              if (obj.hasOwnProperty(k)) {
                if(obj[k].values && !obj[k].values.length){
                  delete obj[k]
                }
              }
            }
            Object.keys(obj).length && this.$commonUtils.saveFilterModel(this.$options.name+this.$route.name,'FilterModel', this.gridApi.getFilterModel())
            var data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel');
            var arr = Object.keys(data);
            if (arr.length) {
              this.brushRightHasFilter = true
            } else {
              this.brushRightHasFilter = false
            }
          }
          if (params.type == "sortChanged") {
            this.$commonUtils.saveFilterModel(this.$options.name + this.$route.name, 'SortModel', this.gridApi.getSortModel())
          }
        }else{
          this.brushRightHasFilter = false
        }
      },
      onGridReady(params) {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
      },
      queryCaseMaterialList() {
        if(!this.computedSubmitDate){
          delete this.queryModuleData.djSubmitDateStart;
          delete this.queryModuleData.djSubmitDateEnd;
        }
        let data=this.$commonUtils.emptyParameterProcessing(Object.assign(this.listQuery,this.queryModuleData))
        let i=0
        for (var key in data){
          if(['agentNums','caseDateStart','caseDateEnd','caseTypeIds','appDateStart','appDateEnd','deptGroupIds','custIdArray','appCnNameArray', 'appFromtoArray','agentNumStart','agentNumEnd','cbWkgId', 'caseName'].includes(key)){
            if(Object.prototype.toString.call(data[key]).includes('Array')||data[key]=='caseTypeIds'){
              if(data[key].filter(item=>!!item).length){
                i+=1
              }
            }else {
              if(data[key]){
                i+=1
              }
            }
          }
        }
        if(i===0 && !this.queryInfo.agentNums){
          this.$message.error('您必须在分割线以上的案件信息选中查询条件')
          return
        }
        queryCaseMaterialList({...this.queryInfo, ...data}).then(res => {
          if (res.success) {
            this.rowData = res.data || []
            if (this.rowData.length) {
              this.getFilterModel()
            }
            this.total = res.total
            // this.currentPageSize=res.data.length
            // 导出列表的查询条件
            this.exportQueryModel = JSON.stringify(data)
          }
        })
        if (JSON.parse(localStorage.getItem('queryModuleData'))) {
          var arr = JSON.parse(localStorage.getItem('queryModuleData'))
        } else {
          var arr = []
        }
        if (arr.find(item => item.name == this.$route.name)) {
          arr.find(item => item.name == this.$route.name).queryModuleData = this.queryModuleData
        } else {
          arr.push({name: this.$route.name, queryModuleData: this.queryModuleData})
        }
        localStorage.setItem('queryModuleData', JSON.stringify(arr))
      },
      mySearch() {
        this.listQuery.pageNo = 1
        this.queryCaseMaterialList()
      },
      detachMent() {
        for (var key in this.queryModuleData) {
          if(key.includes('Array')||key.includes('List')){
            this.$set(this.queryModuleData,key,[])
          }else if(key==='caseTypeIds'){
            this.$set(this.queryModuleData,key,[])
            if(this.$refs.multiCascader){
              this.$refs.multiCascader.$el.querySelector('.el-input__inner').value=''
            }
          } else{
            this.$set(this.queryModuleData,key,null)
          }
        }
      },
      jumpStaffModify(row) {
        this.$router.push(`/workbench/system_management/marked_detail?type=2&chargeItemId=${row.chargeItemId}`)
      },
      jumpStaffAdd() {
        this.$router.push('/workbench/system_management/marked_detail?type=1')
      },
      // rowDoubleClicked(parmas){
      //   this.$router.push(`/workbench/system_management/marked_details?chargeItemId=${parmas.data.chargeItemId}`)
      // },
      deleteDeptId(row){
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteMaterialById({ materialList:[{caseId:row.caseId,materialId:row.materialId,mailId:row.mailId}]}).then(res=>{
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.handleSearch()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
    },
    watch:{
      'queryModuleData.doctId':{
        handler(n){
          this.queryMaterialType()
        },
        immediate: true
      },
      checkboxState(n) {
        if (n) {
          this.$nextTick(() => {
            this.$refs.checkCaseSelect.focus()
          })
        }
      },
      $route: {
        handler: function(val, oldVal){
          this.$nextTick(()=>{
            this.rightDrag()
          })
        },
        immediate: true
      },
      selectionState(n){
        this.changeSelection(n)
      },
    },
    components:{
      Pagination,
      SelectOption,
      ViewsSwitching,
      seeCaseDetail,
      limitElectronicDocument,
      FileDownLoadDialog
    },
    computed:{
      ...mapState({
        'pattern' : state => state.user.pattern
      }),
      clientHeight(){
        return document.documentElement.clientHeight-250
      },
      cssVar(){
        return {
          '--height': document.documentElement.clientHeight-300 + 'px'
        }
      },
      computedSubmitDate(){
       let  curArr=[...new Set(this.queryModuleData.caseTypeIds.map(item => item[0]))]
        if([1,2,75,76,86].find(item=>curArr.includes(item))){
          return false
        }else if(curArr.length==0){
          return  false
        }else{
          return true
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .el-form {
    position: relative;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .el-cascader {
      width: 100%;
    }
    .el-multi-cascader{
      width: 100%;
    }
    .el-select /deep/{
      .el-select__tags{
        max-height: 40px;
        overflow-y: auto;
      }
    }
    .multi-cascader /deep/{
      /*.el-cascader__label{*/
      /*  max-height: 40px;*/
      /*  overflow-y: auto*/
      /*}*/
    }
    .postInfo-container-item {

      /deep/ .el-form-item__content {
        width: 330px;
        display: flex;
        /*height: 28px;*/
        align-items: center;
        .el-select {
          width: 100%;
        }
        .el-input {
          width: 100%;
        }
      }
    }
  }
  /*.button-group-search{*/
  /*  position: relative;*/
  /*  display: flex;*/
  /*  .searchWrap{*/
  /*    border-radius: 5px;*/
  /*    top: 34px;*/
  /*    left: 10px;*/
  /*    width: 550px;*/
  /*    max-height: 500px;*/
  /*    position: absolute;*/
  /*    background: #ffffff;*/
  /*    border: 1px solid #d4d5d5;*/
  /*    z-index: 1;*/
  /*    overflow: auto;*/
  /*    padding: 20px 0;*/
  /*    box-shadow: 0 3px 6px rgba(111,111,111,0.2);*/
  /*    /deep/  .el-form{*/
  /*      padding-bottom: 10px;*/
  /*      .el-form-item__label{*/
  /*        text-align: left;*/
  /*        padding-left: 32px;*/
  /*        font-weight: normal;*/
  /*      }*/
  /*      .el-form-item__content{*/
  /*        input{*/
  /*          border-top: 0;*/
  /*          border-left: 0;*/
  /*          border-radius: 0;*/
  /*          border-right: 0*/
  /*        }*/
  /*      }*/
  /*    }*/
  /*    .clearWrap{*/
  /*      display: flex;*/
  /*      justify-content: flex-end;*/
  /*      width: 100%;*/
  /*      background: #fff;*/
  /*      right: 10px;*/
  /*      padding-bottom: 10px;*/
  /*      position: absolute;*/
  /*      z-index: 1;*/
  /*    }*/
  /*  }*/
  /*}*/
  /*.button-group-search{*/
  /*  position: relative;*/
  /*  .searchRight{*/
  /*    border-top-right-radius:3px !important;*/
  /*    border-bottom-right-radius:3px !important;*/
  /*    padding:0 5px;*/
  /*    height: 28px*/
  /*  }*/
  /*  .searchWrap{*/
  /*    border-radius: 5px;*/
  /*    top: 34px;*/
  /*    left: 0;*/
  /*    width: 550px;*/
  /*    max-height: 500px;*/
  /*    position: absolute;*/
  /*    background: #ffffff;*/
  /*    border: 1px solid #d4d5d5;*/
  /*    z-index: 4;*/
  /*    overflow: auto;*/
  /*    padding: 20px 0;*/
  /*    box-shadow: 0 3px 6px rgba(111,111,111,0.2);*/
  /*    /deep/  .el-form{*/
  /*      .el-form-item__label{*/
  /*        text-align: left;*/
  /*        padding-left: 32px;*/
  /*        font-weight: normal;*/
  /*      }*/
  /*      .el-form-item__content{*/
  /*        display: flex;*/
  /*        input{*/
  /*          border-top: 0;*/
  /*          border-left: 0;*/
  /*          border-radius: 0;*/
  /*          border-right: 0*/
  /*        }*/
  /*      }*/
  /*    }*/
  /*    .clearWrap{*/
  /*      display: flex;*/
  /*      justify-content: flex-end;*/
  /*      width: 100%;*/
  /*      background: #fff;*/
  /*      right: 10px;*/
  /*      padding-bottom: 10px;*/
  /*      position: absolute;*/
  /*      z-index: 1;*/
  /*    }*/
  /*  }*/
  /*}*/
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
  .el-button{
    position: relative;
  }
  .buttonWrap{
    width: 100%;
    text-align: center;
    margin: 10px 0;
    display: flex;
    justify-content: center;
  }
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
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
  .button-group-search{
    position: relative;
    display: flex;
    .searchRight{
      margin-left: 0;
      height: 32px;
      border-top-right-radius:3px !important;
      border-bottom-right-radius:3px !important;
      padding: 0 5px
    }
    .searchWrap{
      border-radius: 5px;
      top: 34px;
      left: 10px;
      width: 550px;
      min-height: 200px;
      /*max-height: 500px;*/
      position: absolute;
      background: #ffffff;
      border: 1px solid #d4d5d5;
      z-index: 50;
      /*overflow: auto;*/
      padding: 20px 0;
      box-shadow: 0 3px 6px rgba(111,111,111,0.2);
      /deep/  .el-form{
        padding-bottom: 10px;
        overflow: auto;
        max-height: 500px;
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
        right: 20px;
        bottom: 10px;
        position: absolute;
        z-index: 1;
      }
    }
  }
  .ViewsSwitching{
    position: absolute !important;
    right: 0;
    z-index: 100;
    top: -20px;
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
      /*overflow: auto;*/
      overflow: hidden;
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
  >>>.el-tabs__content{
    height: var(--height)!important;
    overflow: auto!important;
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
  .checkbox {
    position: absolute;
    left: 0px;
    top: 125px;
    /*width: 222px;*/
    height: 324px;
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
  .brush_right {
    position: absolute;
    right: 6px;
    z-index: 1;
    top: -4px;
  }
  .file-down {
    >>>.el-dialog__body {
      padding-bottom: 50px;
      padding-top: 20px;
    }
  }
</style>
