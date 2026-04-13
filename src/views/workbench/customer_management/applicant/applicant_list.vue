<template>
  <div class="app-container">
    <header class="y-header">{{ $route.meta.title }}</header>
    <div style="display: flex;justify-content: center">
      <el-button-group class="button-group-search"  >
        <el-button id="mySearch" type="primary" size="small" @click="handleSearch(0)">搜索</el-button>
        <el-popover
          placement="bottom-start"
          width="550"
          trigger="click"
          v-model="drawerState"
        >
          <div style="position:relative;">
            <div class="searchWrap" >
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
                  <el-select  v-if="item.filterType==='checkbox'&&item.values&&item.values.length"    v-model="queryModuleData[item.property]" multiple  placeholder="请选择"  filterable  clearable @change="(e)=>checkBox(e,item.property,item.values)">
                    <el-option v-for="itm in item.values" :key="itm.id" :label="itm.value" :value="itm.id">
                    </el-option>
                  </el-select>
                  <el-select v-if="item.filterType==='selectMany'" v-model="queryModuleData[item.property]"  filterable remote clearable reserve-keyword placeholder="请输入关键词" :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName);
            }">
                    <el-option v-for="itm in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
                    </el-option>
                  </el-select>
                  <el-select v-if="item.filterType==='selectMultipleMany'" multiple v-model="queryModuleData[item.property]"  filterable remote clearable reserve-keyword placeholder="请输入关键词" :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName);
            }">
                    <el-option v-for="itm in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
                    </el-option>
                  </el-select>
                  <el-select v-if="item.filterType==='selectTableMany'" v-model="queryModuleData[item.property]" filterable remote clearable reserve-keyword placeholder="请输入关键词" :remote-method="(queryString)=>{
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
                  <el-select v-if="item.filterType==='selectTableMultipleMany'" v-model="queryModuleData[item.property]" multiple filterable remote clearable reserve-keyword placeholder="请输入关键词" :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName); }">
                    <el-option disabled label="" value="">
            <span v-for="(itmx,key) in getAppTitleList(item.filterName,item['valueList']?item['valueList'][0]:undefined)" v-if="key!='id'">
            {{itmx}}
            </span>
                    </el-option>
                    <el-option v-for="itm,idx in item['valueList']" :key="itm.id" :label="itm.value||itm.value1" :value="itm.id">
                      <el-tooltip v-for="itmx,key in item['valueList'][idx]" v-if="key!='id'" class="item" effect="light" :content="itmx" placement="top">
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
                  <el-input clearable v-model="queryModuleData[item.property]" :placeholder="'请输入'+item.filterName" v-if="item.filterType==='text'"></el-input>
                  <el-input clearable v-model="queryModuleData[item.property]" :placeholder="'请输入'+item.filterName" type="textarea" v-if="item.filterType==='textarea'"></el-input>
                  <el-input clearable v-model="queryModuleData[item.property.split(',')[0]]" :placeholder="'请输入'+item.filterName" v-if="item.filterType==='textRange'"
                            @change="(string)=>changeTextRange(string,index,item.property)"></el-input>
                  <span v-if="item.filterType==='textRange'" v-show="item.property.includes(',')">至</span>
                  <el-input clearable v-model="queryModuleData[item.property.split(',')[1]]" :placeholder="'请输入'+item.filterName" v-if="item.filterType==='textRange'"></el-input>
                  <DataPicker class="DataPicker" v-if="item.filterType==='date'" v-model="queryModuleData[item.property]"></DataPicker>
                  <DateMonthPicker class="DataPicker" v-if="item.filterType==='dateMonth'" v-model="queryModuleData[item.property]"></DateMonthPicker>
                  <el-multi-cascader
                    v-if="item.filterType==='cascader'"
                    ref="multiCascader"
                    :class="item.property"
                    :show-all-levels="false"
                    :options="item.values"
                    multiple
                    filterable
                    clearable
                    :props="item.props"

                    change-on-select
                    selectChildren
                    v-model="queryModuleData[item.property]"> </el-multi-cascader>
                </el-form-item>
              </el-form>

            </div>
            <div class="clearWrap"    >
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
            <el-button style="position:absolute;top: 0;right: 10px" type="text" size="small"  @click="queryFilter"><i class="el-icon-s-tools"></i>更多</el-button>

          </div>
          <el-button type="primary" slot="reference" style="margin-left:0" class="searchRight"  size="small" icon="el-icon-arrow-down"></el-button>
        </el-popover>
      </el-button-group>
      <el-button v-if="patent" type="primary" size="small" icon="el-icon-edit" @click="newPatentApp">创建</el-button>
      <router-link v-else style="margin-left: 20px"  v-allow="52" :to="'./applicant_creat'">
        <el-button type="primary" size="small" icon="el-icon-edit">创建</el-button>
      </router-link>
    </div>

    <TitleTotal :total="total"/>
    <div style="position: relative">
      <div  class="dots" @click="handleCheckboxState">
        <span class="dot">.</span>
        <span class="dot">.</span>
        <span class="dot">.</span>
      </div>
      <div class="checkbox" v-show="checkboxState" >
        <el-select ref="checkCaseSelect" v-model="checkCaseList" multiple   reserve-keyword	 filterable placeholder="请选择" collapse-tags :popper-append-to-body="false"  @visible-change="handleChange"
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
      <div
        style="cursor:pointer;position: absolute;display:flex;align-items:center;right: 0;top: -30px;font-size: 14px;padding-right: 6px">
          <el-button type="text" @click="exportList(2)" >导出</el-button>
          <span style="color: #52A2F4;margin: 0 5px"> / </span>
          <el-button type="text" @click="exportList(1)">全局导出</el-button>
      </div>
      <el-button class="brush_right" :class="brushRightHasFilter?'red':''" @click="brushRight" type="text" icon="el-icon-brush" ></el-button>
      <AgGridVue
        :style="{width:'100%',height: clientHeight+'px'}"
        class="ag-theme-balham"
        :columnDefs="columnDefs"
        :rowData="list"
        rowSelection="multiple"
        @grid-ready="onGridReady"
        :gridOptions="gridOptions"
        @dragStopped="dragStopped"
        :getContextMenuItems="getContextMenuItems"
        suppressAutoSize
        @rowDoubleClicked="rowDoubleClicked"
        animateRows
        @sortChanged="refreshEvenRowsCurrencyData"
        @filterChanged="refreshEvenRowsCurrencyData"
        :localeText="$store.state.caseInformation.localeText"
      >
      </AgGridVue>

      <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :pageSizes="pageSizesList"  :limit.sync="listQuery.pageSize"
                  @pagination="getList"/>
    </div>

    <el-dialog title="提示" :visible.sync="transferVisible" width="80%" >
      <el-transfer v-model="transferValue" :key="transferData.filterId" :data="transferData" filterable filter-placeholder="请输入搜索内容"
                   :titles="['选择筛选项—全部案件', '已选']">
      </el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="transferVisible = false">取 消</el-button>
        <el-button type="primary" @click="configFilter">确 定</el-button>
      </span>
    </el-dialog>

    <!--    导出-->
    <SelectOption
      :buss-id="34"
      v-if="selectionOptionState"
      :dialog-visible="selectionOptionState"
      @cancel="closeSelect"
      :idArray="getCurrentRowsData('appId')"
      :defaultMultipleSelect="preferenceList.map(i=>i.title)"
      :exportType="exportType"
      :exportQueryModel="exportQueryModel"></SelectOption>
  </div>
</template>
<script>
  import { queryCaseType, selectColumn, queryPreference, savePreference,configFilter ,queryFilterConfig,queryFilter,addFilterScheme,queryCustomerNameId,delPreference,queryApplicantByIdList,checkPermission} from "@/api/caseList.js";
  import {
  queryAllUrl,
  queryCountrysUrl,
  // updateUrl,
  deleteUrl,
  searchtmdataUrl
} from '@/api/applicant'
import Pagination from '@/components/Pagination/index'
import { delConflicterUrl } from '@/api/customerList'
  import SelectOption from '../../case/components/SelectOption'

const defaultData = {
  pageNo: 1,
  pageSize: 10,
  applicantName: '',

  createDate: '',

  custName: '',

  fgFullname: '',

  country: ''
}
export default {
  components: { SelectOption, Pagination },
  props: {
    custId: {

    },
    custName: '',
    patent: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      exportType: 0,
      countryName: [],
      dialogFormxy: false,
      list: null,
      total: 0,
      listLoading: true,
      pageSizesList:[10, 50, 200,500,1000,5000,10000],
      listQuery: {
        pageNo: 1,
        pageSize: JSON.parse(localStorage.getItem('pageSize')) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name).pageSize : 10 : 10

      },
      // deldata: {
      //   customerID: ""
      // },
      seletData: {
        scStatu: {},
        country: {},
        custnames: {},
        level: {}
      },
      gridOptions: {
        ...this.$store.state.caseInformation.gridOptions, ...{
          statusBar: {
            statusPanels: [
              { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
              { statusPanel: 'agSelectedRowCountComponent', align: 'left' }
            ]
          }
        }
      },
      currentPageSize: 0,
      selectColumnList:[],
      checkCaseList:[],
      preferenceList:[],
      drawerState:false,
      checkboxState: false, // 表头筛选框状态
      transferVisible: false, // 配置筛选条件框
      transferData: [], // 筛选条件数据
      transferValue: [], // 当前筛选条件id
      exportQueryModel:'',
      selectionOptionState:false,
      selectionState:false,
      schemeName:'',
      filterText:'',
      userId:this.$store.getters.userId,
      conditionsModuleList:[],
      bussId:34,

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
      queryModuleData:{},
      columnDefs: [],
      addFilterState:false,
      brushRightHasFilter:false,
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
      }
    }
  },
  activated() {
    if(this.flag){
      this.getList()
    }
    this.flag = true
  },
  created() {
    this.getAllWfs()
    this.queryFilterConfig(1);

    // this.getallSelectData()
  },
  computed: {
    clientHeight() {
      return document.documentElement.clientHeight - 200
    }
  },
  methods: {
    closeSelect() {
      this.selectionOptionState = false
    },
    getCurrentRowsData(key){
      if (this.gridApi && this.gridApi.rowModel) {
        return this.gridApi.rowModel.rootNode.childrenAfterSort.map(item => item.data).map(item => item[key])
      }
      return []
    },
    exportList(flag) {
      this.exportType = flag
      this.selectionOptionState = true
    },
    newPatentApp(){
      this.$emit('openNew')
    },
    clearSearch() {
      for (var key in this.queryModuleData) {
        if (key.includes('Date')) {
          this.$set(this.queryModuleData, key, ['', ''])
        } else if (key.includes('Array')) {
          this.$set(this.queryModuleData, key, [])
        } else if (key === 'caseTypeIds' || key === 'deptGroupIds') {
          this.$set(this.queryModuleData, key, [])
        } else {
          this.$set(this.queryModuleData, key, null)
        }
      }
      // this.drawerState=false
    },
    handleSearch(isQuery){
      this.listQuery.pageNo=1
      this.getList(isQuery)
      this.drawerState=false
    },
    querySearchAsync(value, index, property, filterName,cb){
      if (value && ["申请人名称"].includes(filterName)) {
        queryAllUrl({
          applicantName: value,
          pageNo: 1,
          pageSize: 100,
          orderBy:1
        }).then(res => {
          let list = res.data.map(item => ({
            id: item.applicantName,
            value: item.applicantName,
            value1: item.applicantEnName,
            value2: item.applicantAddress,
            value3: item.applicantEnAddress
          }))
          cb([...[this.getAppTitleList(filterName)],...list])
        });
      }
      cb([])
    },
    queryFilter() {
      this.transferVisible = true;
      const data = {
        bussId: this.bussId
      };
      queryFilter(data).then(res => {
        this.transferData = this.generateData(res.data);
      });
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
          if (!num) {
            this.queryList();
          }
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
            this.queryList();
          }
          this.getAllWfs();
        }
      });
    },
    handleCheckboxState() {
      this.checkboxState = !this.checkboxState;
    },
    handleChange(boolean) {
      if (!boolean) {
        this.checkboxState = false;
      }
    },
    filterCheck(val) {
      this.filterText = val;
    },
    getAppTitleList(filterName, valueList0) {
      if (filterName === "申请人名称") {
        return {
          id: "-1",
          value: "申请人中文名称",
          value1: "申请人英文名称",
          value2: "申请人中文地址",
          value3: "申请人英文地址"
        };
      }
      if (filterName === "被申请人") {
        return {
          id: "-1",
          value: "被申请人中文名称",
          value1: "被申请人英文名称",
          value2: "被申请人中文地址",
          value3: "被申请人英文地址"
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
      if (filterName === "所属客户") {
        return {
          id: "-1",
          value: "简称",
          value1: "国籍",
          value2: "全称",
        };

      }
      return valueList0;
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
    remoteMethod(value, index, property, filterName) {
      if (value && filterName === "所属客户") {
        queryCustomerNameId({ pageNo: 1, pageSize: 100, keyword: value }).then(
          res => {
            this.$set(
              this.conditionsModuleList[index],
              "valueList",
              res.data.map(item => ({ id: item.custId, value: item.name }))
            );
            this.$forceUpdate();
          }
        );
      }
      if (value && ["申请人名称", "被申请人", "转让人"].includes(filterName)) {
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
              id: item.appId,
              value: item.applicantName,
              value1: item.applicantEnName,
              value2: item.applicantAddress,
              value3: item.applicantEnAddress
            }))
          );
          this.$forceUpdate();
        });
      }
      if (
        value &&
        filterName !== "客户" &&
        !["申请人名称", "被申请人", "转让人"].includes(filterName)
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
    changeTextRange(value, index,property) {
      this.$set(this.queryModuleData, property.split(',')[1], value);
      // if(property=='agentNumEnd'){
      //   this.handleSearch(1)
      // }
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
              } else if(key.includes('Array')||key.includes('List')) {
                this.$set(this.queryModuleData,key,[])
              }else{
                this.$set(this.queryModuleData,key,null)
              }
            }
          }
          if(type==1){
            this.handleSearch(true)
          }
          res.data.forEach(item => {
            if (item.filterType.includes("Many")) {
              if(this.queryModuleData[item.property]){
                if(item.filterType.includes('Many')){
                  if(["被申请人", "转让人"].includes(item.filterName)){
                  } else if(item.filterName=='申请人'){
                    if(this.queryModuleData[item.property]&&this.queryModuleData[item.property].length){
                      queryApplicantByIdList({appIdArray:this.queryModuleData[item.property]}).then(res=>{
                        this.$set(item,'valueList', res.data.map(i => ({
                          id: i.appId,
                          value: i.applicantName,
                          value1: i.applicantEnName,
                          value2: i.applicantAddress,
                          value3: i.applicantEnAddress
                        })))
                      })
                    }
                  } else if(item.filterName=='客户'){
                    if(this.queryModuleData[item.property].length){
                      queryCustomerNameId({custIdArray: this.queryModuleData[item.property]}).then(res=>{
                        this.$set(item,'valueList', res.data.map(i => ({ id: i.custId, value: i.name })))
                      })
                    }
                  } else {
                    item.valueList = item.values&&item.values.filter(i=>i.id==this.queryModuleData[item.property])
                  }
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
          this.transferValue = res.data.map(item => item.filterId);
        });
      })
    },
    dragStopped(params){
      let tableHeader=params.columnApi.columnController.gridColumns.map(item=>({
        label:item.colDef.headerName,
        width:item.actualWidth,
        prop:item.colDef.field,
      })).filter(item=>item.prop!="group")
      var arr=JSON.parse(localStorage.getItem('tableHeader'))
      arr.find(item=>item.name==this.$route.name).tableHeader=tableHeader
      localStorage.setItem('tableHeader',JSON.stringify(arr))
      this.changeHeader(tableHeader)
    },
    clearSeach() {

    },

    getLoactionWidth(label){
      if(!localStorage.getItem('tableHeader')){
        return 'auto'
      } else {
        var arr= JSON.parse(localStorage.getItem('tableHeader'))
        if(arr.find(item=>item.name==this.$route.name)){
          var header=arr.find(item=>item.name==this.$route.name).tableHeader
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
    getAllWfs() {
      const data = {
        userId: this.userId,
        bussId: this.bussId
      };
      Promise.all([selectColumn(data), queryPreference(data)]).then(res => {
        this.selectColumnList = res[0].data;

        this.preferenceList = res[1].data;
        this.tableHeader=this.preferenceList.map(item=>({label:item.title, prop:item.value,width: this.getLoactionWidth(item.title)}))
        this.columnDefs=[...this.defaultcolumnDefs,...this.preferenceList.map(item=>({
          headerName: item.title,
          field: item.value,
          width:this.getLoactionWidth(item.title)=='auto'?200:this.getLoactionWidth(item.title),
          resizable: true,
          sortable: true,
          filter: 'agSetColumnFilter',
          menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],
          cellRenderer: this.cellRenderer,
          enableRowGroup: true,
          filterParams: {
            newRowsAction: 'keep',
            comparator: (a, b)=>{
              return this.$commonUtils.sort(a,b,item.value)
            }
          }
        }))]
        this.saveLocation()
        this.checkCaseList = this.preferenceList.map(item => item.value);
      });
    },
    saveLocation() {
      if (!localStorage.getItem('tableHeader')) {
        const arr = []
        arr.push({ name: this.$route.name, tableHeader: this.tableHeader })
        localStorage.setItem('tableHeader', JSON.stringify(arr))
      } else {
        const arr = JSON.parse(localStorage.getItem('tableHeader'))
        if (arr.find(item => item.name === this.$route.name)) {
          arr.find(item => item.name === this.$route.name).tableHeader = this.tableHeader
          localStorage.setItem('tableHeader', JSON.stringify(arr))
        } else {
          arr.push({ name: this.$route.name, tableHeader: this.tableHeader })
          localStorage.setItem('tableHeader', JSON.stringify(arr))
        }
      }
    },
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
      if(params.type=="filterChanged"){
        this.$commonUtils.saveFilterModel(this.$options.name+this.$route.name,'FilterModel',this.gridApi.getFilterModel())
        var data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel');
        var arr = Object.keys(data);
        if(arr.length){
          this.brushRightHasFilter=true
        }else {
          this.brushRightHasFilter=false
        }
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
      if(this.patent){
        return [
        { name: '复制', action: 'copy' }
      ]
      }
      return [
        { name: '复制', action: 'copy' },
        { name: '商标导入', action: 'installtmmessage', permissions: 53 },
        { name: '修改', action: 'editFun', permissions: 54 },
        { name: '删除', action: 'handledeleElement', permissions: 55 }
      ].filter(item => {
        if (item.permissions) {
          if (item.examineStatusStr) {
            return this.$store.getters.permissions.includes(item.permissions) && row.examineStatusStr === item.examineStatusStr
          }
          return this.$store.getters.permissions.includes(item.permissions)
        } else {
          return true
        }
      })
    },
    copy(row, value) {
      if (value) {
        this.$copyText(value).then(
          res => {
          })
      }
    },
    editFun(row) {
      this.scrollTop = document.getElementsByClassName('ag-body-viewport')[0].scrollTop
      this.$router.push(`./applicant_edit/${row.appId}`)
    },
    installtmmessage(row) {
      searchtmdataUrl({
        appName: row.applicantName
      }).then(res => {
      })
    },
    rowDoubleClicked(params) {
      if(this.patent){
        this.$emit('checked', params)
      }else{
        this.$router.push(`./applicant_view/${params.data.appId}`)
      }
    },
    async getList(type) {
      this.listLoading = true
      if(this.patent && type === true){
        let index = this.conditionsModuleList.length && this.conditionsModuleList.findIndex(item => item.filterName == '所属客户')
        let res =await queryCustomerNameId({ pageNo: 1, pageSize: 100, keyword: this.custName })
          this.$set(
              this.conditionsModuleList[index],
              "valueList",
              res.data.map(item => ({ id: item.custId, value: item.name }))
            );
          // this.$set(this.queryModuleData, 'custIdArray',[this.custId])
          this.queryModuleData.custIdArray = [this.custId]
          this.$forceUpdate();
      }
      if (this.$route.query.custId) {
        this.queryModuleData.custIdArray = [this.$route.query.custId]
      }
      this.exportQueryModel = JSON.stringify(this.queryModuleData)
      queryAllUrl(Object.assign(this.queryModuleData,this.listQuery)).then(response => {
        this.list = response.data
        this.total = response.total
        this.listLoading = false
        if(this.list.length){
          let index = this.gridApi.getSelectedNodes()[0]&&this.gridApi.getSelectedNodes()[0].rowIndex || 0
          this.$nextTick(()=>{
            var obj = document.getElementsByClassName('ag-body-viewport')[0]
            obj.scrollTop = this.scrollTop
            //选中
            this.gridApi.rowModel.rootNode.allLeafChildren[index].setSelected(true)
          })
        }
      })
    },
    onGridReady(params) {
      this.gridparams = params
      this.gridApi = params.api
      this.columnApi = params.columnApi
      params.api.sizeColumnsToFit()
    },
    getallSelectData() {
      queryCountrysUrl().then(response => {
        if (response.success) {
          let arr = response.data
          var couArr = []
          for (let i = 0; i < arr.length; i++) {
            var couList = {}
            couList.name = arr[i].shortName
            couArr[i] = couList
          }
          this.countryName = couArr
        } else {
          this.$message.error(response.message)
        }
      })
    },
    handledeleElement(item) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteUrl({ appId: item.appId }).then(() => {
              const index = this.list.indexOf(item);
              this.list.splice(index, 1);
              this.total--;
              this.$message({
                type: "success",
                message: "删除成功"
              });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          })
        })
    }
  },
  watch:{
    checkboxState(n){
      if(n){
        this.$nextTick(()=>{
          this.$refs.checkCaseSelect.focus()
        })
      }
    },
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.el-table /deep/ th {
  background-color: #7199d5;
  color: #ffffff;
}

.el-row {
  margin-bottom: 5px;
}

.el-row:last-child {
  margin-bottom: 0;
}
.el-form {
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .el-cascader {
    width: 100%;
  }
  .el-autocomplete{
    width: 100%;
  }
  .postInfo-container-item {

    /deep/ .el-form-item__content {
      width: 330px;
      display: flex;
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
  top: 33px;
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


/deep/ .datePickerWrap{
  line-height: 28px;
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

}
.searchWrap{
  min-height: 200px;
  max-height: 500px;
  position: relative;
  overflow:auto;
  /deep/  .el-form{
    padding-bottom: 10px;
    .el-form-item__label{
      text-align: left;
      padding-left: 32px;
      font-weight: normal;
      float:left;
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

}
.clearWrap{
  display: flex;
  justify-content: flex-end;
  width: 100%;
  background: #fff;
  right: 10px;
  /*padding-bottom: 10px;*/
  /*position: absolute;*/
  z-index: 1;
}

.searchRight{
  margin-left: 0;
  height: 33px;
  border-top-right-radius:3px !important;
  border-bottom-right-radius:3px !important;
  padding: 0 5px
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
.brush_right{
  position: absolute;
  right: 6px;
  z-index: 1;
  top: -4px;
}
</style>

