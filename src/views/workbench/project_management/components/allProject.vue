<template>
  <div class="case_management_item" >
    <div class="queryButton" style="width: 40%;margin: 0 auto" :class="myTabsActivity?'activity':''">
      <div class="buttonWrap_small">
        <!--<el-button size="small" @click="reset">重置</el-button>-->
        <!--<el-button id="mySearch" type="primary" size="small" @click="drawerState=true">搜索条件</el-button>-->
        <el-button-group class="button-group-search"  v-clickoutside="clickoutside">
          <el-button id="mySearch" type="primary" size="small" @click="handleSearch(0)">搜索</el-button>
          <el-button type="primary" style="margin-left:0" class="searchRight"  size="small" icon="el-icon-arrow-down" @click.stop.prevent="drawerState=true"></el-button>
          <transition name="show" mode="out-in">
            <div class="searchWrap" id="searchWrap" v-show="drawerState">
              <el-form size="mini" label-width="120px" class="form-container" @keyup.enter.native="handleSearch(0)" style="margin-top: 2px"  >
                <el-form-item :label="item.filterName+':'"
                              :class="item.filterType==='radio'&&item.values.length>3?'fullItem':'postInfo-container-item'" v-for="item,index in conditionsModuleList" :key="index">

                  <el-select v-model="queryModuleData[item.property]" placeholder="请选择" v-if="item.filterType==='select'" filterable clearable>
                    <el-option v-for="itm in item.values" :key="itm.id" :label="itm.value" :value="itm.id">
                    </el-option>
                  </el-select>
                  <!--<el-checkbox-group style="display:flex" v-model="queryModuleData[item.property]" v-if="item.filterType==='checkbox'">-->
                  <!--<el-checkbox v-for="itm in item.values" :label="itm.value" :key="itm.id">{{itm.value}}</el-checkbox>-->
                  <!--</el-checkbox-group>-->
                  <el-select  v-if="item.filterType==='checkbox'&&item.values&&item.values.length"    v-model="queryModuleData[item.property]" reserve-keyword multiple placeholder="请选择"  filterable  clearable @change="(e)=>checkBox(e,item.property,item.values)">
                    <el-option v-for="itm in item.values" :key="itm.id" :label="itm.value" :value="itm.id">
                    </el-option>
                  </el-select>
                  <el-select v-if="item.filterType==='selectMany'" v-model="queryModuleData[item.property]" reserve-keyword  filterable remote clearable  placeholder="请输入关键词" :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName);
            }">
                    <el-option v-for="itm in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
                    </el-option>
                  </el-select>
                  <el-select v-if="item.filterType==='selectMultipleMany'" multiple v-model="queryModuleData[item.property]"  reserve-keyword filterable remote clearable placeholder="请输入关键词" :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName);
            }">
                    <el-option v-for="itm in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
                    </el-option>
                  </el-select>
                  <el-select v-if="item.filterType==='selectMultipleManyTable'" multiple v-model="queryModuleData[item.property]" reserve-keyword filterable remote clearable  placeholder="请输入关键词" :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName); }">
                    <el-option disabled label="" value="-1">
            <span v-for="(itmx,key) in getAppTitleList(item.filterName,item['valueList']?item['valueList'][0]:undefined)" v-if="key!='id'">
            {{itmx}}
            </span>
                    </el-option>
                    <el-option v-for="(itm,idx) in item['valueList']" :key="idx" :label="itm.value" :value="itm.id">
                      <el-tooltip v-for="(itmx,key) in item['valueList'][idx]" v-if="key!='id'" :key="key" class="item" effect="light" :content="itmx" placement="top">
                        <span>{{itmx}}</span>
                      </el-tooltip>
                    </el-option>
                  </el-select>
                  <el-select v-if="item.filterType==='selectTableMany'"  v-model="queryModuleData[item.property]" reserve-keyword filterable remote clearable  placeholder="请输入关键词" :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName); }">
                    <el-option disabled label="" value="">
            <span v-for="(itmx,key) in getAppTitleList(item.filterName,item['valueList']?item['valueList'][0]:undefined)" v-if="key!='id'">
            {{itmx}}
            </span>
                    </el-option>
                    <el-option v-for="itm,idx in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
                      <el-tooltip v-for="itmx,key in item['valueList'][idx]" v-if="key!='id'" class="item" effect="light" :content="itmx" placement="top">
                        <span>{{itmx}}</span>
                      </el-tooltip>
                    </el-option>
                  </el-select>
                  <el-select v-if="item.filterType==='selectTableMultipleMany'" v-model="queryModuleData[item.property]" reserve-keyword multiple filterable remote clearable  placeholder="请输入关键词" :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName); }">
                    <el-option disabled label="" value="">
            <span v-for="(itmx,key) in getAppTitleList(item.filterName,item['valueList']?item['valueList'][0]:undefined)" v-if="key!='id'" :key="key">
            {{itmx}}
            </span>
                    </el-option>
                    <el-option v-for="(itm,idx) in item['valueList']" :key="itm.id+idx" :label="itm.value" :value="itm.id">
                      <el-tooltip v-for="(itmx,key) in item['valueList'][idx]" v-if="key!='id'" :key="itmx+key" class="item" effect="light" :content="itmx" placement="top">
                        <span>{{itmx}}</span>
                      </el-tooltip>
                    </el-option>
                  </el-select>
                  <el-select v-if="item.filterType==='selectTable'" v-model="queryModuleData[item.property]" filterable clearable placeholder="请选择">
                    <el-option v-for="itm ,idx in item.values" :key="idx" :label="itm.value" :value="itm.id" :disabled="itm.id==-1">
                      <span v-for="itmx ,key in item['values'][idx]" v-if="key!='id'">{{itmx}}</span>
                    </el-option>
                  </el-select>
                  <el-radio-group v-model="queryModuleData[item.property]" v-if="item.filterType==='radio'">
                    <el-radio :label="itm.id" v-for="itm,index in item.values" :key="index">{{itm.value}}</el-radio>
                  </el-radio-group>
                  <el-input clearable v-model="queryModuleData[item.property]" :placeholder="'请输入'+item.filterName" v-if="item.filterType==='text'"></el-input>
                  <el-input clearable v-model="queryModuleData[item.property]" :placeholder="'请输入'+item.filterName" type="textarea" v-if="item.filterType==='textarea'"></el-input>
                  <el-input clearable v-model="queryModuleData[item.property.split(',')[0]]" :placeholder="'请输入'+item.filterName" v-if="item.filterType==='textRange'"
                            @change="(string)=>changeTextRange(string,item.property.split(',')[1])"></el-input>
                  <span v-if="item.filterType==='textRange'" v-show="item.property.includes(',')">至</span>
                  <el-input clearable v-model="queryModuleData[item.property.split(',')[1]]" :placeholder="'请输入'+item.filterName" v-if="item.filterType==='textRange'"></el-input>
                  <DataPicker class="DataPicker" v-if="item.filterType==='date'" v-model="queryModuleData[item.property]"></DataPicker>
                  <!--<el-date-picker v-if="item.filterType==='date'" v-model="queryModuleData[item.property.split(',')[0]]" type="date" placeholder="开始日期">-->
                  <!--</el-date-picker>-->
                  <!--<span v-if="item.filterType==='date'" v-show="item.property.includes(',')">至</span>-->
                  <!--<el-date-picker v-if="item.filterType==='date'" v-show="item.property.includes(',')" v-model="queryModuleData[item.property.split(',')[1]]" type="date" placeholder="结束日期">-->
                  <!--</el-date-picker>-->
                  <el-multi-cascader
                    ref="multiCascader"
                    :class="item.property"
                    v-if="item.filterType==='cascader'"
                    :show-all-levels="false"
                    :options="item.values"
                    multiple
                    filterable
                    clearable
                    :props="item.props"

                    change-on-select
                    selectChildren
                    v-model="queryModuleData[item.property]"> </el-multi-cascader>
                  <el-autocomplete
                    v-if="item.filterType==='autocomplete'"
                    v-model="queryModuleData[item.property]"
                    :fetch-suggestions="(queryString,cb)=>querySearchAsync(queryString, index, item.property, item.filterName,cb)"
                    placeholder="请输入内容"
                    filterable
                    :popper-append-to-body="false"
                  >
                    <template slot-scope="{ item }">
                      <div class="name_wrap" :class="item.id==-1?'firstName_wrap':''">
                        <el-tooltip  class="item" effect="light" :content="item.value" placement="top">
                          <div  :class="item.id==-1?'name0':'name'">{{ item.value }}</div>
                        </el-tooltip>
                        <el-tooltip  class="item" effect="light" :content="item.value1" placement="top">
                          <div :class="item.id==-1?'name0':'name'">{{ item.value1 }}</div>
                        </el-tooltip>
                        <el-tooltip  class="item" effect="light" :content="item.value2" placement="top">
                          <div  :class="item.id==-1?'name0':'name'">{{ item.value2 }}</div>
                        </el-tooltip>
                        <el-tooltip  class="item" effect="light" :content="item.value3" placement="top">
                          <div :class="item.id==-1?'name0':'name'">{{ item.value3 }}</div>
                        </el-tooltip>
                      </div>
                    </template>
                  </el-autocomplete>
                  <!--                  <el-cascader :change-on-select="true" :show-all-levels="false" v-if="item.filterType==='cascader'" collapse-tags filterable clearable v-model="queryModuleData[item.property]"-->
                  <!--                               :options="item.values" :props="defaultParams" placeholder="请选择"></el-cascader>-->
                </el-form-item>
              </el-form>
              <div class="clearWrap" v-if="drawerState"  id="clearWrap" >
                <el-popover
                  placement="top"
                  width="300"
                  v-model="addFilterState">
                  <div>过滤器名称</div>
                  <div><el-input type="text" v-model="schemeName"></el-input></div>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="addFilterState = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="addFilterScheme(2)">确定</el-button>
                  </div>
                  <el-button  size="mini" slot="reference"><span>保存</span></el-button>
                </el-popover>

                <el-button  size="mini"   @click="clearSearch"><span>重置</span></el-button>
                <el-button  type="primary" size="mini"  @click="handleSearch(0)">搜索</el-button>
              </div>
              <el-button style="position:absolute;top: 10px;right: 10px" type="text" size="small"  @click="queryFilter"><i class="el-icon-s-tools"></i>更多</el-button>
            </div>
          </transition>
        </el-button-group>

       <el-button size="mini" @click="creatProject">新建项目</el-button>
        <!--<i class="el-icon-rank" :style="{cursor: 'pointer',color:pattern?'#409EFF':'rgba(187,187,187)',transition:'all 0.5s',transform:pattern?'transform: rotate(180deg)':'transform: rotate(-180deg)'}" @click="changePattern"></i>-->
      </div>

    </div>

    <section>
      <div style="display: flex;position: relative">
        <TitleTotal :total="total" :currentPageSize="currentPageSize"/>
        <div class="button_wrap" >

          <el-button class="exactButton"  type="primary"  size="mini" @click="gridApi.deselectAll();gridApi.selectAllFiltered()">全选</el-button>
          <el-button class="exactButton"  size="mini" @click="gridApi.deselectAll()">清除所选</el-button>
        </div>
        <div style="cursor:pointer;position: absolute;display:flex;align-items:center;right: 0;bottom:-6px;font-size: 14px;padding-right: 6px">
          <el-button type="text" @click="exportList(2)" >导出</el-button>
          <span style="color: #52A2F4;margin: 0 5px"> / </span>
          <el-button type="text" @click="exportList(1)">全局导出</el-button>
<!--          <el-button type="text"  @click="exportList(1)"><i class="el-icon-download">导出</i></el-button>-->
<!--          <img @click="exportList(2)" src="@/assets/moon.png" width="16" alt="">-->
        </div>
      </div>
      <div class="content_wrap">
        <!--        <i class="el-icon-folder" v-if="curFile.length"></i>-->
        <div class="left_wrap" :style="{width:'100%' }">
          <div class="dots" @click="handleCheckboxState">
            <span class="dot">.</span>
            <span class="dot">.</span>
            <span class="dot">.</span>
          </div>
          <el-button class="brush_right" :class="brushRightHasFilter?'red':''" @click="brushRight" type="text" icon="el-icon-brush" ></el-button>
          <AgGridVue :style="{width:'100%',height: clientHeight+'px'}"
                     class="ag-theme-balham"
                     :columnDefs="columnDefs"
                     :rowData="caseList"
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
                     :localeText="$store.state.caseInformation.localeText"
                     :suppressDragLeaveHidesColumns="true"
                     :suppressMakeColumnVisibleAfterUnGroup="true"
                     rowGroupPanelShow="always"
                     :groupSelectsChildren="true"
                     :suppressAggFuncInHeader="true"
                     :autoGroupColumnDef="autoGroupColumnDef"
          >
          </AgGridVue>

          <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :pageSizes="pageSizesList" :limit.sync="listQuery.pageSize" @pagination="queryCaseList()" />
          <div class="checkbox" v-show="checkboxState" >
            <el-select ref="checkCaseSelect" v-model="checkCaseList" multiple  reserve-keyword	 filterable placeholder="请选择" collapse-tags :popper-append-to-body="false"  @visible-change="handleChange"
                       :filter-method="filterCheck">
              <template slot="">
                <div class="checkbox_bottom">
                  <el-button size="mini" round @click.stop="delPreference(1)">恢复默认</el-button>
                  <el-button style="margin-right: 3px" size="mini" round @click.stop="savePreference(1)">保存设置</el-button>
                  <!--<el-button size="mini" round @click.stop="checkNotAtAll">全不选</el-button>-->
                </div>
              </template>
              <el-option v-for="(item,idx) in selectColumnList.filter(item =>item.COLUMN_COMMENT.includes(filterText))" :key="item.COLUMN_NAME" :label="item.COLUMN_COMMENT" :value="item.COLUMN_NAME">
                <!--<el-checkbox v-model="selectBox[idx]">{{item.COLUMN_COMMENT}}</el-checkbox>-->
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
    </section>
    <el-dialog title="提示" :append-to-body="false" :visible.sync="transferVisible" width="80%" >
      <el-transfer v-model="transferValue" :key="transferData.filterId" :data="transferData" filterable filter-placeholder="请输入搜索内容"
                   :titles="['选择筛选项—全部案件', '已选']">
      </el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="transferVisible = false">取 消</el-button>
        <el-button type="primary" @click="configFilter">确 定</el-button>
      </span>
    </el-dialog>

    <SelectOption :buss-id="bussId" v-if="selectionOptionState" :dialog-visible="selectionOptionState" @cancel="closeSelect" :idArray="getCurrentRowsData('projectId')" :defaultMultipleSelect="preferenceList.map(i=>i.title)" :exportType="exportType" :exportQueryModel="exportQueryModel"></SelectOption>
    <EmitSearch @undateSearch="undateSearch"></EmitSearch>
    <CommonDialog ref="CommonDialog" :view="title=='查看'" width="60%" v-model="visible" :title="title" :formData="formData" :FORM_ITEMS="FORM_ITEMS">
      <div v-if="title!='查看'" style="display: flex;justify-content: center">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
      <div v-else style="display: flex;justify-content: center">
        <el-button @click="visible = false">关闭</el-button>
      </div>
    </CommonDialog>
  </div>
</template>

<script>


  import Pagination from "@/components/Pagination";
  import FilterSelect from '@/components/FilterSelect'

  import { queryAllUrl } from "@/api/applicant";

  import exportFile from '@/components/exportFile'
  import SelectOption from '@/views/workbench/case/components/SelectOption'
import ChooseTemplate from "./ChooseTemplate";
  import {
    querylyctListUrl,
  } from "@/api/customerList";

  import {
    addFilterScheme,
    delCase,

    selectColumn,
    savePreference,
    queryCaseList,
    queryPreference,
    delPreference,
    queryFilter,
    configFilter,
    queryFilterConfig,
    submitOfficalAudit,
    auditOfficalDoc,
    queryTrademarkCaseOfficial,
    deleteCase,
    deleteDoc,
    deleteIns,
    queryCustomerNameId,
    getManualRecognitionOfficialInfoCount,
    recognizedError,
    getCaseByTmFileId,
    submitOfficalModify,
    queryCorrelationCaseList,
    downloadMaterial,
    copyCase,
    uploadDocFile,
    updateWkg,
    queryCaseWork,
    queryList,
    queryProjectList,
    createProject,
    modifyProject, deleteProject, queryProjectType
  } from '@/api/caseList.js'

  import { mapGetters,mapState } from "vuex";

  export default {
    props: {

      business: {
        default: "2"
      },
      bussId: {
        default: "30"
      },
      getCaseList: {
        type: Function,
        default: queryProjectList
      },
      // queryModuleData: {
      //   type: Object,
      //   default: () => ({})
      // },
      pageTitle: {
        type: String,
        default:'案件管理'
      },
      dialogVisible: {
        type: Boolean,
        default: true
      },
    },
    name: "types_of_cases",
    data() {
      var tableHeader=[]
      if(localStorage.getItem('tableHeader')&&JSON.parse(localStorage.getItem('tableHeader')).find(item=>item.name==this.$options.name+this.$route.name)){
        tableHeader=JSON.parse(localStorage.getItem('tableHeader')).find(item=>item.name==this.$options.name+this.$route.name).tableHeader
      }

      return {
        prjTypeList: [],
        prjTypeList1: [], // 备份
        gridOptions:{...this.$store.state.caseInformation.gridOptions,...{
            getRowStyle:(params)=>{
              if(params.node.data){

                if(params.node.data.auditStatus==1||params.node.data.isCheck==0){
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
        title:'',
        currentPageSize:0,
        defaultcolumnDefs:[
          {
            headerName: '序号',
            field: 'sid',
            width:this.getLoactionWidth('序号')=='auto'?60:this.getLoactionWidth('序号'),
            resizable: true,
            'pinned': 'left', //固定再左边
            enableRowGroup: true,
            // enablePivot: true,
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
        ],
        columnDefs: [

        ],
        brushRightHasFilter:false,
        autoGroupColumnDef:{
          headerName: '组',
          field: 'group',
          headerCheckboxSelection: true,
          cellRenderer: 'agGroupCellRenderer',
          cellRendererParams: { checkbox: true },
        },
        selectionOptionState:false,
        plType: "",
        drawerState:false,
        queryModuleData: {

        },
        exportType:1,
        pageSizesList:[10, 50, 200,500,1000,5000,10000],
        filterText: "",
        showTable: false,
        ManualIdentificationState: false,
        checkboxState: false, // 表头筛选框状态
        transferVisible: false, // 配置筛选条件框
        transferData: [], // 筛选条件数据
        transferValue: [], // 当前筛选条件id
        caseList: [], // 当前列表数据
        checkCaseList: [], // 当前选中表头条件
        selectColumnList: [], // 配置表头总列数据做循环用
        preferenceList: [], // 循环表头数据
        conditionsModuleList: [], // 渲染筛选条件

        listQuery: {
          pageNo: 0,
          pageSize: JSON.parse(localStorage.getItem('pageSize'))?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name)?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name).pageSize:10:10
        },
        total: 0,

        defaultParams: {
          //級聯菜單默認
          value: "caseTypeId",
          label: "caseType",
          children: "childrens",
          checkStrictly: true,
          multiple: true
        },
        tableTitleList:[{"title":"案件文号", "value": "agentNum" },{"title":"案件类型","value":"caseType","boo":"2"},{"title":"商标名称","value":"tmName"},{"title":"商标号","value":"regNumber"},{"title":"商标类别","value":"goodClasses"},{"title":"客户","value":"custName" },{"title":"申请人中文名称","value":"appCnName","boo":"1"},{"title":"阶段","value":"stageName" }],

        multipleTypeText: "",



        tableHeader: tableHeader,
        currentId:'',
        clearWrapTop:0,
        tableHeaderLabelList:[],
        myTabsActivity: false,
        curFilterSelect:{},
        rowContextmenuList: [

        ],

        officialInfoCounData:{},
        addFilterState:false,
        schemeName:'',
        exportQueryModel:'',
        currentTltId:'',
        curentObjInstId:'',
        visible:false,
        formData:{
          userList:[],
          prjTypeId: ''
        },
        FORM_ITEMS:[
          { prop: "prjName", label: "项目名称", el: "input",fill:true },
          { prop: "prjTypeId",label: "项目类型", render:(h, params)=>{return (
              <div>
                <el-select
                  clearable
                  allow-create
                  filterable
                  v-model={params.prjTypeId}
                  placeholder='请选择或输入创建'
                  v-on:change={this.changePrjType}
                >
                  {
                    this.prjTypeList.map((item, index) =>
                    <el-option
                      key={item.prjTypeId}
                      label={item.prjTypeName}
                      value={item.prjTypeId}>
                    </el-option>
                )
                  }

              </el-select>
              </div>
              // <span>{this.$commonUtils.transformation(item.options,formLabelAlign[item.prop],'custId','fullname')}</span>
            )
            },fill:true
          },
          { prop: "prjDesc", label: "项目简介", el: "input",fill:true },
          { prop: "prjAgentNum", label: "项目文号", el: "input",fill:true },
          { prop: "userList", required: true, trigger: 'change',label: "参与人员", render:(h, params)=>{return (
              <div>
                {
                  this.visible ? <virtual-select className="virtual-select" isUser={true} v-on:change={this.changeUserIdList}
                                            clearable multiple
                                            data={this.$commonUtils.unique(this.$store.getters.userList, 'userId')}
                                            v-model={params.userIdList} filterable
                                            render={(data) => this.$commonUtils.UserRender(data)}
                  >
                  </virtual-select> : ''
                }

              </div>
              // <span>{this.$commonUtils.transformation(item.options,formLabelAlign[item.prop],'custId','fullname')}</span>
            )
            }, fill: true
          },

          {
            prop: 'teptId', label: '选择模板', render: (h, params) => {
              return (
                <div>
                <ChooseTemplate v-model={params.teptId} v-on:change={this.changeTeptId}>
            </ChooseTemplate>
              </div>
              // <span>{this.$commonUtils.transformation(item.options,formLabelAlign[item.prop],'custId','fullname')}</span>
            )
            },fill:true
          },
          { prop: "major", label: "重点项目", el: "radio",options:[{label:'是',value:1},{label:'否',value:0}],fill:true },
          { prop: "userList",label: "参与人员角色", el: "table",columns:[{label:'参与人员',prop:'userId',width:150,
              renderCell:(h,params)=>{return (
                <div>{this.$commonUtils.transformation(this.$store.getters.userList,params.userId,'userId','fullname')}</div>
              )}
            },{label:'角色',prop:'role',width:150,}],fill:true
          },
        ],
      };
    },
    created() {
      this.init(1)
    },
    mounted(){
      // let that=this
      // document.getElementById('searchWrap').onscroll=function (e) {
      //   that.clearWrapTop = e.target.scrollTop+ e.target.offsetHeight
      //   document.getElementById('clearWrap').style.top = that.clearWrapTop -40 + 'px'
      // }
      // new this.$DraginResize(document.querySelector(".left_wrap"), {
      //   clone: true,
      //   end(info) {
      //     if (info.dir == 'ver') {
      //       this.elem.style.height = info.height + 'px';
      //     }
      //     else if (info.dir == 'hor') {
      //       this.elem.style.width = info.width + 'px';
      //       localStorage.setItem('leftWrapWidth', info.width + 'px')
      //       that.leftWrapWidth = info.width + 'px'
      //     }
      //   }
      // })
    },
    methods: {
      changePrjType(v) {
        this.$set(this.formData, 'prjTypeId' , v)
        if (!this.prjTypeList1.find(item => item.prjTypeId == v)) {
          this.prjTypeList.unshift({
            prjTypeId: v,
            prjTypeName: v,
          })
        }
        console.log(JSON.parse(JSON.stringify(this.prjTypeList)))
        this.prjTypeList = this.$commonUtils.unique(this.prjTypeList, 'prjTypeName')
      },
      queryPrjType(flag) {
        queryProjectType().then(res => {
          this.prjTypeList = res.data
          this.prjTypeList1 = JSON.parse(JSON.stringify(this.prjTypeList))
          if (flag === 1 && this.formData.prjTypeName) {
            this.formData.prjTypeId = this.prjTypeList.find(item => item.prjTypeName === this.formData.prjTypeName) && this.prjTypeList.find(item => item.prjTypeName === this.formData.prjTypeName).prjTypeId || ''
          }
        })
      },
      getCurrentRowsData(key){
        if (this.gridApi && this.gridApi.rowModel) {
          return this.gridApi.rowModel.rootNode.childrenAfterSort.map(item => item.data).map(item=>item[key])
        }
        return []
      },
      init(flag){
        if(flag) {
          this.$store.commit('caseInformation/SET_BUSSID', this.bussId)
          this.queryFilterConfig(1);
          this.getAllWfs();
        }
        this.queryPrjType()
      },
      changeUserIdList(e){
        if(e&&e.length){
          this.formData.userList= e.map(item=>({
            userId:item,
            role: this.formData.userList.find(i=>i.userId==item)?this.formData.userList.find(i=>i.userId==item)['role']:''
          }))
        }else {
          this.formData.userIdList = [this.$store.getters.userId]
          this.formData.userList = [{userId:this.$store.getters.userId,role:'负责人'}]
        }
      },
      creatProject(){
        this.formData={
          userList:[{userId:this.$store.getters.userId,role:'负责人'}],
          userIdList:[this.$store.getters.userId],

        }
        this.title='新建项目'
        this.visible=true
      },
      editFun(row){
        this.title='修改项目'
        this.formData=row
        if(this.formData.userList){
          this.formData.userIdList= [...new Set(this.formData.userList.map(item=>item.userId))]
        }else {
          this.formData.userIdList=[]
          this.formData.userList=[]
        }
        // prjTypeName
        this.visible=true
        this.queryPrjType(1)
      },
      async confirm(){
        const [ err, success] = await this.$commonUtils.awaitWrap(this.$refs.CommonDialog.checkValidate())
        if(!success){
          return
        }
        if (!this.prjTypeList1.find(item => item.prjTypeId == this.formData.prjTypeId)) {
          this.formData.prjTypeName = this.formData.prjTypeId
          delete this.formData.prjTypeId
        }
        if(this.title=='新建项目'){
          createProject(this.formData).then(res=>{
            this.visible=false
            this.handleSearch()
          })
        }
        if(this.title=='修改项目'){
          modifyProject(this.formData).then(res=>{
            this.visible=false
            this.handleSearch()
          })
        }
      },
      changeTeptId(e){
        if(e){
          this.formData.teptId=e
        }
      },
      rowSelected(params){

      },
      rowClicked(param){

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
            this.takeCaseDetail(params.data)
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
        this.$router.push(`/workbench/ResourceView/project?projectId=${row.projectId}`)
      },

      getSelectedRows() {
        if(this.gridApi){
          const selectedNodes = this.gridApi.getSelectedNodes();
          const selectedData = selectedNodes.map(node => node.data);
          return selectedData
        }else {
          return []
        }

      },
      getSelectedSortRows() {
        if (this.gridApi) {
          const selectedNodes = this.gridApi.getSelectedNodes();
          // const selectedData = selectedNodes.map(node => node.data);
          return this.gridApi.rowModel.rootNode.childrenAfterSort.filter(item=>selectedNodes.includes(item)).map(node=>node.data)
        } else {
          return []
        }
      },
      takeCaseDetail(data){
        this.$router.push(`/workbench/case/case_detail/${data.toCaseId}/商标侵权?taskType=${this.$commonUtils.getTaskType(data,this)}`)
        // this.$router.push("/workbench/case/seeCaseDetail/" + params.data.toCaseId);
      },
      onGridReady(params) {
        this.gridparams=params
        this.gridApi = params.api;
        this.columnApi = params.columnApi;

      },
      dragStopped(params){
        let tableHeader=params.columnApi.columnController.gridColumns.map(item=>({
          label:item.colDef.headerName,
          width:item.actualWidth,
          prop:item.colDef.field,
        })).filter(item=>item.prop!="group")
        var arr=JSON.parse(localStorage.getItem('tableHeader'))
        arr.find(item=>item.name==this.$options.name+this.$route.name).tableHeader=tableHeader
        localStorage.setItem('tableHeader',JSON.stringify(arr))
        this.changeHeader(tableHeader)
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
          this.checkCaseList=n.map(item => item.prop).filter(item=>item!='sid')
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

          });
        }

      },
      clickoutside(){
        this.drawerState = false
      },
      // closeCurrentRow(){
      //   this.currentCaseId=''
      //   this.currentId=''
      // },
      closeSelect(flag){
        this.detailSubmissionState=false
        this.timeLimitState=false
        this.selectionState=false
        this.selectionOptionState=false
        this.uploadState = false
        this.uploadType=''
        this.ManualIdentificationState = false
        this.uploadProofreadingState=false
        this.$emit('closeModel')
        // this.changeKeepAlive()
        if(flag){
          this.queryCaseList()
        }
      },
      checkBox(e,property,values){
        if(this.queryModuleData[property].includes('')&&this.queryModuleData[property].filter(item=>item).length!=values.filter(item=>item).length){
          this.queryModuleData[property]=this.queryModuleData[property].filter(item=>item)
        }
        if(e[e.length-1]==''){
          this.queryModuleData[property]=values.map(item=>item.id)
        }
      },
      closeTable(bool) {
        this.showTable = bool;
        this.selectionState=false
        this.queryCaseList();
      },
      pdfPre({ address },value,node) {
        this.pdfDataState = true;
        this.pdfData=[]
        this.$nextTick(()=>{
          if(node.data.addressList){
            this.pdfData =node.data.addressList.filter(itm=>['pdf','jpg','png'].some(item=>itm.replace(/.+\./,"").toLocaleLowerCase()==item))
            if(this.pdfData.length==0){
              this.pdfDataState=false
            }
          }

        })


      },
      exportList(flag){
        this.exportType=flag
        this.selectionOptionState=true
      },

      getLanglist(array) {
        let arr = [];
        array.forEach(item => {
          arr.push(...item);
        });
        return arr;
      },

      unique(data, key) {
        const hash = {};
        const data2 = data.reduce((preVal, curVal) => {
          hash[curVal[key]]
            ? ""
            : (hash[curVal[key]] = true && preVal.push(curVal));
          return preVal;
        }, []);
        return data2;
      },
      querySearchAsync(value, index, property, filterName,cb){
        if (value && ["被申请人"].includes(filterName)) {
          querylyctListUrl({
            fullname: value,
            pageNo: 1,
            pageSize: 100,
            isCustomer:1
          }).then(res => {

            let list = res.data.map(item => ({
              id: item.fullname,
              value: item.fullname,
              value1: item.fullnameEn,
              value2: item.address,
              value3: item.addressEn
            }))
            cb([...[this.getAppTitleList(filterName)],...list])
          })
        }
        cb([])
      },
      remoteMethod(value, index, property, filterName) {
        if (value && filterName === "客户") {
          let request = new Promise(resolve => {
            if(this.queryModuleData[property]&&this.queryModuleData[property].length){
              queryCustomerNameId({ pageNo: 1, pageSize: 100, custIdArray: this.queryModuleData[property]}).then(res=>{
                resolve(res)
              })
            } else {
              resolve({data:[]})
            }
          })
          Promise.all([ request,queryList({ pageNo: 1, pageSize: 100,sign:1, parameter: value})]).then(res=>{
            this.$set(
              this.conditionsModuleList[index],
              "valueList",
              this.$commonUtils.unique(res[0].data.concat(res[1].data).map(item => ({ id: item.custId, value:item.name,value1:item.country,value2:item.fullname})),'id')
            );
            this.$forceUpdate();
          })
          // queryCustomerNameId({ pageNo: 1, pageSize: 100, keyword: value, custIdArray: this.queryModuleData[property]}).then(
          //   res => {
          //     this.$set(
          //       this.conditionsModuleList[index],
          //       "valueList",
          //       res.data.map(item => ({ id: item.custId, value:item.name,value1:item.country,value2:item.fullname}))
          //     );
          //     this.$forceUpdate();
          //   }
          // );
          // queryCustomerNameId({ pageNo: 1, pageSize: 100, keyword: value, custIdArray: this.queryModuleData[property]}).then(
          //   res => {
          //     this.$set(
          //       this.conditionsModuleList[index],
          //       "valueList",
          //       res.data.map(item => ({ id: item.custId, value:item.name,value1:item.country,value2:item.fullname}))
          //     );
          //     this.$forceUpdate();
          //   }
          // );
        }
        if (value && ["申请人",  "转让人"].includes(filterName)) {
          queryAllUrl({
            applicantName: value,
            pageNo: 1,
            pageSize: 100,
            orderBy:1
          }).then(res => {
            this.$set(
              this.conditionsModuleList[index],
              "valueList",
              res.data.map(item => ({
                id: item.applicantName,
                value: item.applicantName,
                value1: item.applicantEnName,
                value2: item.applicantAddress,
                value3: item.applicantEnAddress
              }))
            );
            this.$forceUpdate();
          });
          if (value && ["被申请人"].includes(filterName)) {
            querylyctListUrl({
              fullname: value,
              pageNo: 1,
              pageSize: 100,
              isCustomer:1
            }).then(res => {
              this.$set(
                this.conditionsModuleList[index],
                "valueList",
                res.data.map(item => ({
                  id: item.fullname,
                  value: item.fullname,
                  value1: item.fullnameEn,
                  value2: item.address,
                  value3: item.addressEn
                }))
              );
              this.$forceUpdate();
            });
          }
          // "",
          // console.log(this.conditionsModuleList[index]['valueList']);

          // this.$set(
          //   this.conditionsModuleList[index],
          //   "valueList",
          //   this.conditionsModuleList[index].values
          //     .filter(item => {
          //       for (let key in item) {
          //         if (
          //           item[key] &&
          //           item[key]
          //             .toLocaleUpperCase()
          //             .includes(value.toLocaleUpperCase())
          //         ) {
          //           return true;
          //         }
          //       }
          //       return false;
          //     })
          //     .slice(0, 100)
          // );
        }
        if (
          value &&
          filterName !== "客户" &&
          !["申请人", "被申请人", "转让人"].includes(filterName)
        ) {
          this.$set(
            this.conditionsModuleList[index],
            "valueList",
            this.conditionsModuleList[index].values
              .filter(item =>
                item.value
                  ? item.value
                    .toLocaleUpperCase()
                    .includes(value.toLocaleUpperCase())
                  : false
              )
              .slice(0, 100)
          );
          this.$forceUpdate();
        }
      },
      changeTextRange(value, property) {
        this.$set(this.queryModuleData, property, value);

      },

      handleSearch(flag,e) {
        if(e){
          return
        }
        this.operationState=flag
        this.drawerState=false
        this.listQuery.pageNo = 1;
        this.queryCaseList();
        // if(JSON.parse(localStorage.getItem('queryModuleData'))){
        //   var arr = JSON.parse(localStorage.getItem('queryModuleData'))
        // }else {
        //   var arr = []
        // }
        // if(arr.find(item=>item.name==this.identification)){
        //   let data= arr.find(item=>item.name==this.identification)
        //   data.queryModuleData=this.queryModuleData
        //   data.operationState=this.operationState
        // }else {
        //   arr.push({name:this.identification,queryModuleData:this.queryModuleData,operationState:this.operationState})
        // }
        // localStorage.setItem('queryModuleData',JSON.stringify(arr))
      },
      clearSearch() {
        for (var key in this.queryModuleData) {
          if(key.includes('Date')){
            this.$set(this.queryModuleData,key,['',''])
          } else if(key.includes('Array')||key.includes('List')) {
            this.$set(this.queryModuleData,key,[])
          }else if(key==='caseTypeIds'||key==='deptGroupIds'){
            this.$set(this.queryModuleData,key,[])
          }else{
            this.$set(this.queryModuleData,key,null)
          }
        }
      },
      queryCaseList(obj) {

        const data = {
          business: this.business,
          pageNo: this.listQuery.pageNo,
          pageSize: this.listQuery.pageSize
        };
        for (var key in this.queryModuleData) {
          if (Object.prototype.toString.call(this.queryModuleData[key]).includes("Date")) {
            this.queryModuleData[key] = this.formatDate(this.queryModuleData[key]);
          }
          if(this.queryModuleData[key]===null){
            delete this.queryModuleData[key]
          }
        }
        const querData=Object.assign(data, this.queryModuleData)
        this.exportQueryModel=JSON.stringify(querData)
        this.getCaseList(querData).then(
          res => {
            res.data.forEach(item=>{
              for(var key in item){
                if(!item[key]){
                  item[key]=''
                }
              }
            })
            this.total = res.total;
            this.caseList = res.data
          }
        );
      },
      getFilterModel(){
        this.$nextTick(()=>{
          let data =   this.$commonUtils.getFilterModel(this.$options.name+this.$route.name,'FilterModel')
          let arr =  Object.keys(data)
          let arrInstance=arr.map(item=>this.gridApi.getFilterInstance(item))
          arrInstance.forEach((item,index)=>{
            item.selectNothing()
            item.setModel(data[arr[index]])
            item.applyModel()
          })
          this.gridApi.onFilterChanged()
          let sortData =   this.$commonUtils.getFilterModel(this.$options.name+this.$route.name,'SortModel')
          if(sortData&&sortData.length){
            this.gridApi.setSortModel(sortData)
            this.gridApi.onSortChanged()
          }
          if(this.gridApi.rowModel.rootNode.childrenAfterFilter.length){
            this.gridApi.rowModel.rootNode.childrenAfterFilter[0].setSelected(true)
          }

        })
      },
      brushRight(){

        let data = this.$commonUtils.getFilterModel(this.$options.name+this.$route.name,'FilterModel')
        let arr =  Object.keys(data)
        arr.forEach(item=>{
          this.gridApi.destroyFilter(item)
        })
        // this.columnDefs.map(item=>item.field).forEach(item=>{
        //   this.gridApi.getFilterInstance(item).selectNothing()
        //   // this.gridApi.getFilterInstance(item).setModel(data[arr[index]])
        // })
      },
      handleChange(boolean) {
        if (!boolean) {
          this.checkboxState = false;
        }
      },
      savePreference(num) {

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
          if (res.success) {
            this.checkboxState = false;
            this.filterText=''
            // if (!num) {
            //   this.queryCaseList();
            // }
            this.queryCaseList()
            this.getAllWfs();
          }
        });
      },
      delPreference(num) {
        const data = {
          userId: this.userId,
          bussId: this.bussId
        };
        delPreference(data).then(res => {
          if (res.success) {
            this.checkboxState = false;
            if (!num) {
              this.queryCaseList();
            }
            this.getAllWfs();
          }
        });
      },
      handleCheckboxState() {
        this.checkboxState = !this.checkboxState;
      },
      saveLocation(){
        if(!localStorage.getItem('tableHeader')){
          let arr=[]
          arr.push({name:this.$options.name+this.$route.name,tableHeader:this.tableHeader})
          localStorage.setItem('tableHeader',JSON.stringify(arr))
        }else {
          let arr=JSON.parse(localStorage.getItem('tableHeader'))
          if(arr.find(item=>item.name==this.$options.name+this.$route.name)) {
            arr.find(item => item.name==this.$options.name+this.$route.name).tableHeader = this.tableHeader
            localStorage.setItem('tableHeader',JSON.stringify(arr))
          } else {
            arr.push({name:this.$options.name+this.$route.name,tableHeader:this.tableHeader})
            localStorage.setItem('tableHeader',JSON.stringify(arr))
          }
        }
      },
      getAllWfs() {
        const data = {
          userId: this.userId,
          bussId: this.bussId
        };
        Promise.all([selectColumn(data), queryPreference(data)]).then(res => {
          this.selectColumnList = res[0].data;

          this.preferenceList = res[1].data;
          this.columnDefs = [...this.defaultcolumnDefs, ...this.preferenceList.map(item=>({
            headerName: item.title,
            field: item.value,
            width:this.getLoactionWidth(item.title)=='auto'?200:this.getLoactionWidth(item.title),
            resizable: true,
            sortable: true,
            filter: 'agSetColumnFilter',
            cellRenderer:this.cellRenderer,
            menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],
            enableRowGroup: true,
            filterParams: {
              showTooltips:true,
              defaultToNothingSelected: true,
              newRowsAction: 'keep',
              comparator: (a, b)=>{
                return this.$commonUtils.sort(a,b,item.value)
              },
            }
          }))]
          this.columnDefs.forEach(item=>{
            if(item.field=='materialName'){
              item.comparator=function (a,b) {
                if (!a && !b) {
                  return 0;
                }
                if (!a) {
                  return -1;
                }
                if (!b) {
                  return 1;
                }
                if (!/^\d+$/.test(a.split(/[-_]/)[0])&&!/^\d+$/.test(b.split(/[-_]/)[0])){
                  return 0;
                }
                if (!/^\d+$/.test(a.split(/[-_]/)[0])){
                  return -1;
                }
                if (!/^\d+$/.test(b.split(/[-_]/)[0])){
                  return 1;
                }

                return a.split(/[-_]/)[0] - b.split(/[-_]/)[0];
              }
            }else if(item.field=='goodClasses'){
              item.comparator=function (a,b) {
                if (!a && !b) {
                  return 0;
                }
                if (!a) {
                  return -1;
                }
                if (!b) {
                  return 1;
                }
                if (!/^\d+$/.test(a.split(';')[0])&&!/^\d+$/.test(b.split(';')[0])){
                  return 0;
                }
                if (!/^\d+$/.test(a.split(';')[0])){
                  return -1;
                }
                if (!/^\d+$/.test(b.split(';')[0])){
                  return 1;
                }

                return a.split(';')[0] - b.split(';')[0];
              }
            }else if(item.field=='regNumber'||item.field=='approvalNo') {
              item.comparator = function (a, b) {
                if (!a && !b) {
                  return 0;
                }
                if (!a) {
                  return -1;
                }
                if (!b) {
                  return 1;
                }
                if (!a.match(/^\d+/)) {
                  return 1;
                }
                if (!b.match(/^\d+/)) {
                  return -1;
                }
                if (a.match(/^\d+/) && b.match(/^\d+/)) {
                  return Number(a.match(/^\d+/)[0]) - Number(b.match(/^\d+/)[0])
                }
              }
            }
          })
          // this.$nextTick(()=>{
          //   this.columnDefs.forEach(item=>{
          //     this.columnApi.getColumn(item.field).addEventListener('menuVisibleChanged', ()=>{
          //       if(document.querySelector(".ag-tabs")){
          //         new this.$DraginResize(document.querySelector(".ag-set-filter-list"), {
          //           clone: true,
          //           end(info) {
          //             if (info.dir == 'ver') {
          //               this.elem.style.height = info.height + 'px';
          //             }
          //             else if (info.dir == 'hor') {
          //               this.elem.style.width = info.width + 'px';
          //             }
          //           }
          //         })
          //       }
          //       let data =   this.$commonUtils.getFilterModel(this.$options.name+this.$route.name,'FilterModel')
          //       let arr =  Object.keys(data)
          //       if(this.columnDefs.map(itm => itm.field).diff(arr).includes(item.field)){
          //         this.gridApi.getFilterInstance(item.field).selectNothing()
          //       }
          //     });
          //   })
          //
          // })
          this.tableHeader=this.preferenceList.map(item=>({label:item.title, prop:item.value,width: this.getLoactionWidth(item.title)}))
          this.saveLocation()
          this.checkCaseList = this.preferenceList.map(item => item.value);

        });
      },
      getLoactionWidth(label){
        if(!localStorage.getItem('tableHeader')){
          return 'auto'
        } else {
          var arr= JSON.parse(localStorage.getItem('tableHeader'))
          if(arr.find(item=>item.name==this.$options.name+this.$route.name)){
            var header=arr.find(item=>item.name==this.$options.name+this.$route.name).tableHeader
            if(header.find(item=>item.label==label)){
              return header.find(item=>item.label==label).width
            } else {
              return 'auto'
            }
          } else {
            return 'auto'
          }
        }
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
          this.queryFilterConfig();
        });
      },
      defaultQuerySearch(){
        this.queryModuleData = JSON.parse(localStorage.getItem('queryModuleData'))?JSON.parse(localStorage.getItem('queryModuleData')).find(item=>item.name==this.identification)?JSON.parse(localStorage.getItem('queryModuleData')).find(item=>item.name==this.identification).queryModuleData:{}:{}
      },
      queryFilterConfig(type) {
        const data = {
          bussId: this.bussId
        };
        this.conditionsModuleList=[]
        queryFilterConfig(data).then(res => {
          this.transferVisible = false;
          this.$nextTick(()=>{
            this.conditionsModuleList = res.data;
            let keyList=res.data.map(item=>item.property)
            for (var key in this.queryModuleData) {
              if(!keyList.includes(key)){
                if(key.includes('Date')){
                  this.$set(this.queryModuleData,key,['',''])
                } else if(key.includes('Array')) {
                  this.$set(this.queryModuleData,key,[])
                }else{
                  this.$set(this.queryModuleData,key,null)
                }
              }
            }
            this.defaultQuerySearch()
            if(type==1&&!this.$route.query.custId){
              this.queryCaseList()
            }
            this.transferValue = res.data.map(item => item.filterId);
            res.data.forEach(item => {
              if (item.filterType.includes("Many")) {
                if(this.queryModuleData[item.property]){
                  if(item.filterType.includes('Many')){
                    if(["被申请人", "转让人"].includes(item.filterName)){
                      // queryAllUrl({ appId:this.queryModuleData[item.property]}).then(res=>{
                      //   this.$set(item,'valueList', res.data.map(i => ({
                      //     id: i.applicantName,
                      //     value: i.applicantName,
                      //     value1: i.applicantEnName,
                      //     value2: i.applicantAddress,
                      //     value3: i.applicantEnAddress
                      //   })))
                      // })
                    }else if(item.filterName=='申请人' ){
                      // console.log(this.queryModuleData[item.property]);
                      // Promise.all( this.queryModuleData[item.property].map(itm=>queryAllUrl({appId:itm}))).then(res=>{
                      //   this.$set(item,'valueList', this.$commonUtils.getLanglist(res.map(i=>i.data)).map(i => ({
                      //     id: i.applicantName,
                      //     value: i.applicantName,
                      //     value1: i.applicantEnName,
                      //     value2: i.applicantAddress,
                      //     value3: i.applicantEnAddress
                      //   })))
                      //   // this.$set(item,'valueList', this.$commonUtils.getLanglist(res.map(i=>i.data)).map(i => ({ id: i.custId, value: i.name })))
                      // })
                    } else if(item.filterName=='客户'){
                      if(this.queryModuleData[item.property].length){
                        queryCustomerNameId({custIdArray: this.queryModuleData[item.property]}).then(res=>{
                          this.$set(item,'valueList', res.data.map(i => ({ id: i.custId, value:`${i.name}-${i.country?i.country:''}-${i.fullname}` })))
                        })
                      }
                    } else {
                      item.valueList = item.values.filter(i=>i.id==this.queryModuleData[item.property])
                    }
                    // if(item.property.includes('Array')){
                    //   //this.queryModuleData[item.property]=this.queryModuleData[item.property].map(itm=>Number(itm))
                    // }else {
                    //  // this.queryModuleData[item.property]=Number(this.queryModuleData[item.property])
                    // }
                  }
                } else {
                  item.valueList=[]
                }
              }
              if (item.filterType.includes("checkbox")) {
                if(this.queryModuleData[item.property]&&this.queryModuleData[item.property].length){
                  this.$set(this.queryModuleData, item.property, this.queryModuleData[item.property]);
                }else {
                  this.$set(this.queryModuleData, item.property, []);
                }
              }
            });
          });
        })
      },
      delCase(row) {
        this.$confirm("此操作将删除该项目, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            deleteProject({ projectId: row.projectId })
              .then(res => {
                  this.handleSearch()
              })
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },
      formatDate(time) {
        return this.$commonUtils.formatDate(time)
      },
      filterCheck(val) {
        this.filterText = val;
      },
      getAppTitleList(filterName, valueList0) {
        if (filterName === "申请人") {
          return {
            id: "-1",
            value: "申请人中文名称",
            value1: "申请人英文名称",
            value2: "申请人中文地址",
            value3: "申请人英文地址",
            // disabled:true
          };
        }
        if (filterName === "被申请人") {
          return {
            id: "-1",
            value: "中文名称",
            value1: "英文名称",
            value2: "中文地址",
            value3: "英文地址"
          };
        }
        if (filterName === "转让人") {
          return {
            id: "-1",
            value: "转让人中文名称",
            value1: "转让人英文名称",
            value2: "转让人中文地址",
            value3: "转让人英文地址"
          };

        }
        if (filterName === "客户") {
          return {
            id: "-1",
            value: "简称",
            value1: "国籍",
            value2: "全称",
          };

        }
        return valueList0;
      },
      addFilterScheme(e){
        if(e==1){
          this.addFilterState=true
        }else if(e==2) {
          if(!this.schemeName||!this.schemeName.trim()){
            this.$message.error('请输入过滤器名称')
            return
          }
          const data={
            schemeName:this.schemeName,
            bussId:this.bussId,
            value: JSON.stringify(this.queryModuleData)
          }
          addFilterScheme(data).then(res=>{
            this.addFilterState = false
          })
        }
      },

      getRowContextmenuList(row){
        return [
          { name:'复制',action: 'copy' },
          { name: '修改', action: 'editFun'},
          { name: '删除', action: 'delCase'},
        ]

      },
      copy(row, value) {
        if(value){
          this.$copyText(value).then(
            res => {
            })
        }
      },
      undateSearch(n){
        if(this.bussId==n.bussId){
          this.queryModuleData=JSON.parse(n.value)
          this.handleSearch(0)
          this.queryFilterConfig()
        }

      }
    },
    computed: {
      ...mapGetters(["userId"]),
      ...mapState({
        'pattern' : state => state.user.pattern,
        'ajglTabList' : state => state.tabs.ajglTabList,
        'djgfTabList' : state => state.tabs.djgfTabList,
        'gftzTabList' : state => state.tabs.gftzTabList,

      }),
      clientHeight(){
        return document.documentElement.clientHeight-250
      },
    },
    watch: {
      pattern:{
        handler(n,o){
          if(n){
            this.$store.commit('app/TOGGLE_SIDEBAR',false)

          } else {
            // this.$store.commit('app/TOGGLE_SIDEBAR',true)
          }
        },
        immediate:true
      },
      checkboxState(n){
        if(n){
          this.$nextTick(()=>{
            this.$refs.checkCaseSelect.focus()
          })
        }
      },
      timeLimitState(n){
        if(!n){
          const caseId = this.currentCaseId
          this.currentCaseId=''
          this.$nextTick(()=>{
            this.currentCaseId = caseId
          })
        }
      },
    },
    activated() {
      if(this.initFlag){
        this.init()
      }
      this.initFlag=true
    },
    components: {

      Pagination,

      ChooseTemplate,

      exportFile,
       SelectOption,


      // AgGridVue
    }
  };
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
    /*.el-select /deep/{*/
    /*  .el-select__tags{*/
    /*    max-height: 40px;*/
    /*    overflow-y: auto;*/
    /*  }*/
    /*}*/
    /*.multi-cascader /deep/{*/
    /*  .el-cascader__label{*/
    /*    max-height: 40px;*/
    /*    overflow-y: auto*/
    /*  }*/
    /*}*/
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
  /deep/ .virtual-select{
     .jh-virtual-select{
      height: auto;
       width: 100%;
    }
  }
  /deep/ .btn-simple{
    color:#409EFF;
    cursor: pointer;
  }
</style>
