<template>
  <div class="">
    <div class="queryButton_wrap" v-if="!isFinance">


 <el-button-group>
  <el-button type="primary" size="small" @click="handleSearch(1)" >搜索</el-button>

  <el-popover
    placement="bottom"
    width="550"
    trigger="click"
 >
    <div style="position:relative;">
      <div style="min-height: 200px;max-height: 400px;position: relative;overflow:auto;">
        <el-form size="mini" label-width="120px" class="form-container" @keyup.enter.native="handleSearch(1)" style="margin-top: 2px"  >
          <el-form-item :label="item.filterName+':'"
                        :class="item.filterType==='radio'&&item.values.length>3?'fullItem':'postInfo-container-item'" v-for="(item,index) in conditionsModuleList" :key="index">

            <el-select v-model="queryModuleData[item.property]" placeholder="请选择" v-if="item.filterType==='select'" filterable clearable>
              <el-option v-for="itm in item.values" :key="itm.id" :label="itm.value" :value="itm.id">
              </el-option>
            </el-select>
            <!--<el-checkbox-group style="display:flex" v-model="queryModuleData[item.property]" v-if="item.filterType==='checkbox'">-->
            <!--<el-checkbox v-for="itm in item.values" :label="itm.value" :key="itm.id">{{itm.value}}</el-checkbox>-->
            <!--</el-checkbox-group>-->
            <el-select  v-if="item.filterType==='checkbox'&&item.values&&item.values.length"    v-model="queryModuleData[item.property]" multiple placeholder="请选择"  filterable  clearable @change="(e)=>checkBox(e,item.property,item.values)">
              <el-option v-for="itm in item.values" :key="itm.id" :label="itm.value" :value="itm.id">
              </el-option>
            </el-select>
            <el-select v-if="item.filterType==='selectMany'" v-model="queryModuleData[item.property]"  filterable remote clearable  placeholder="请输入关键词" :remote-method="(queryString)=>{
                remoteMethod(queryString,index,item.property,item.filterName);
                }">
              <el-option v-for="itm in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
              </el-option>
            </el-select>
            <el-select v-if="item.filterType==='selectMultipleMany'" multiple v-model="queryModuleData[item.property]"  filterable remote clearable placeholder="请输入关键词" :remote-method="(queryString)=>{
                remoteMethod(queryString,index,item.property,item.filterName);
                }">
              <el-option v-for="itm in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
              </el-option>
            </el-select>
            <el-select v-if="item.filterType==='selectMultipleManyTable'" multiple v-model="queryModuleData[item.property]" filterable remote clearable  placeholder="请输入关键词" :remote-method="(queryString)=>{
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
            <el-select v-if="item.filterType==='selectTableMany'"  v-model="queryModuleData[item.property]" filterable remote clearable  placeholder="请输入关键词" :remote-method="(queryString)=>{
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
            <el-select v-if="item.filterType==='selectTableMultipleMany'" v-model="queryModuleData[item.property]" multiple filterable remote clearable  placeholder="请输入关键词" :remote-method="(queryString)=>{
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
            <DateMonthPicker class="DataPicker" v-if="item.filterType==='dateMonth'" v-model="queryModuleData[item.property]"></DateMonthPicker>
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

      </div>
      <el-button style="position:absolute;top: 10px;right: 10px" type="text" size="small"  @click="queryFilter"><i class="el-icon-s-tools"></i>更多</el-button>
      <div class="clearWrap">
<!--        <el-popover-->
<!--          placement="top"-->
<!--          width="300"-->
<!--          v-model="addFilterState">-->
<!--          <div>过滤器名称</div>-->
<!--          <div><el-input type="text" v-model="schemeName"></el-input></div>-->
<!--          <div style="text-align: right; margin: 0">-->
<!--            <el-button size="mini" type="text" @click="addFilterState = false">取消</el-button>-->
<!--            <el-button type="primary" size="mini" @click="addFilterScheme(2)">确定</el-button>-->
<!--          </div>-->
<!--          <el-button  size="mini" slot="reference"><span>保存</span></el-button>-->
<!--        </el-popover>-->

        <el-button  size="mini"   @click="clearSearch(this)"><span>重置</span></el-button>
        <el-button  type="primary" size="mini"  @click="handleSearch(1)">搜索</el-button>
      </div>
    </div>



     <el-button slot="reference"  style="padding: 8.5px 5px;" type="primary" size="small" icon="el-icon-arrow-down"></el-button>
  </el-popover>

</el-button-group>
            <el-button class="el-dropdown-link" type="primary" size="small" @click="creatbtn('2')" v-allow="161">
              新建内部账单
            </el-button>
            <el-button v-allow="165" class="filter-item" type="primary" @click="shbtnclick" size="small">审核
            </el-button>
    </div>
<!--    <el-form>-->
<!--      <el-form-item label="申请方向" style="width: 100%;">-->

<!--          <el-checkbox-group v-model="listQuery.appfromList"  @change="handleSearch(0)">-->
<!--            <el-checkbox label="内-内"></el-checkbox>-->
<!--            <el-checkbox label="内-外"></el-checkbox>-->
<!--            <el-checkbox label="外-外"></el-checkbox>-->
<!--            <el-checkbox label="台-内"></el-checkbox>-->
<!--            <el-checkbox label="外-内"></el-checkbox>-->
<!--          </el-checkbox-group>-->
<!--      </el-form-item>-->
<!--    </el-form>-->
    <TitleTotal style="position: relative;top:10px;margin-right:10px" :currentPageSize="currentPageSize" :total="total"/>
    <div style="position: relative;margin-top: 10px">
      <div class="dots" @click="handleCheckboxState">
        <span class="dot">.</span>
        <span class="dot">.</span>
        <span class="dot">.</span>
      </div>
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
      <div style="position: relative">
        <div style="cursor:pointer;position: absolute;display:flex;align-items:center;right: 0;bottom:-6px;font-size: 14px;padding-right: 6px">
          <el-button type="text" @click="exportList(2)" >导出</el-button>
          <span style="color: #52A2F4;margin: 0 5px"> / </span>
          <el-button type="text" @click="exportList(1)">全局导出</el-button>
<!--          <el-button type="text"  @click="exportList(1)"><i class="el-icon-download">导出</i></el-button>-->
<!--          <img @click="exportList(2)" src="@/assets/moon.png" width="16" alt="">-->
        </div>
      </div>

      <el-button class="brush_right" :class="brushRightHasFilter?'red':''" @click="brushRight" type="text" icon="el-icon-brush" ></el-button>
      <AgGridVue :style="{width:'100%',height: clientHeight+'px'}"
                 class="ag-theme-balham"
                 :columnDefs="columnDefs"
                 :rowData="list"
                 rowSelection="multiple"
                 @grid-ready="onGridReady"
                 :gridOptions="gridOptions"
                 :getContextMenuItems="getContextMenuItems"
                 suppressAutoSize
                 animateRows
                 @rowDoubleClicked="rowDoubleClicked"
                 @dragStopped="dragStopped"
                 @sortChanged="refreshEvenRowsCurrencyData"
                 @filterChanged="refreshEvenRowsCurrencyData"
                 :localeText="$store.state.caseInformation.localeText"
                 :suppressDragLeaveHidesColumns="true"
                 :suppressMakeColumnVisibleAfterUnGroup="true"
                 rowGroupPanelShow="always"
                 :groupSelectsChildren="true"
                 :suppressAggFuncInHeader="true"
                 :frameworkComponents="frameworkComponents"
                 :rowHeight="isFinance ? $commonUtils.getRowHeight() : 28"
                 :pinnedBottomRowData="pinnedBottomRowData"
      >
      </AgGridVue>
    </div>
    <pagination :page-sizes="pageSizesList"   v-show="total > 0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <pagination :page-sizes="pageSizesList"   v-show="totalsh > 0" :total="totalsh" :page.sync="listQuerysh.pageNo" :limit.sync="listQuerysh.pageSize" @pagination="shSeach" />
    <el-row class="bottomrowdiv" v-if="showBottomBtn">
      <el-col class="bottom-row" :span="24">
        <el-button v-if="showBottomBtn === 7" @click="editBtnclick('7')" class="iconBtn" type="primary" size="small">通过</el-button>
        <el-button v-if="showBottomBtn === 7" @click="editBtnclick('8')" class="iconBtn" type="primary" size="small">退回</el-button>
      </el-col>
    </el-row>
    <el-dialog title="提示" :append-to-body="false" :visible.sync="transferVisible" width="80%" >
      <el-transfer v-model="transferValue" :key="transferData.filterId" :data="transferData" filterable filter-placeholder="请输入搜索内容"
                   :titles="['选择筛选项—全部案件', '已选']">
      </el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="transferVisible = false">取 消</el-button>
        <el-button type="primary" @click="configFilter">确 定</el-button>
      </span>
    </el-dialog>
    <SelectOption :buss-id="bussId" v-if="selectionOptionState" :dialog-visible="selectionOptionState" @cancel="closeSelect" :idArray="getCurrentRowsData('billinterid')" :defaultMultipleSelect="preferenceList.map(i=>i.title)" :exportType="exportType" :exportQueryModel="exportQueryModel"></SelectOption>

<!--    修改-->
    <el-dialog v-if="insideBillView" class="abow_dialog" :title="insideTitle" :close-on-click-modal="false" :visible.sync="insideBillView" width="80%"
               height="80%" :before-close="() => {closeDialog(false)}">
      <inside-bill-details :is-finance="true" :pageBillId="pageBillId" :detailType="detailType" v-if="insideBillView" @closeBillDialog="closeDialog" />
    </el-dialog>

<!--  费用核销  -->
    <el-dialog v-if="writeOffView" class="abow_dialog" title="核销草单" :close-on-click-modal="false" :visible.sync="writeOffView" width="80%"
               height="80%" :before-close="() => {closeWriteOffDialog(false)}">
      <off_bill v-if="writeOffView" page-type="insideBill" @billCreateDialog="closeWriteOffDialog"/>
    </el-dialog>
  </div>
</template>
<script>
  import {formatAmount, fomatFloat} from '@/utils/filters'
  import SelectOption from '@/views/workbench/case/components/SelectOption.vue'
  import InsideBillDetails from './insideBillDetails'
  import {
    querylyctListUrl,
  } from "@/api/customerList";
  import Summary from "@/components/Summary/index.js";
import {
  queryCustomerNameIdUrl,
  querywfUserNameUrl,
  queryAllUrl,
  queryBillInternalListUrl,
  deleteBillInternalUrl,
  cancelrequest,
  queryBillInternalTaskListUrl,
  doBillInternalTaskUrl
} from "@/api/billApi";
import {
  queryCaseType,
  selectColumn,
  savePreference,
  queryPreference,
  delPreference,
  queryFilter,
  configFilter,
  queryFilterConfig,
  queryCustomerNameId,
  checkPermission,
  queryList} from "@/api/caseList.js";
import Pagination from "@/components/Pagination";
  import Off_bill from "../off_bill"; // secondary package based on el-pagination
const defaultData = {
  pageNo: 1,
  pageSize: 10,
  appfromList: [], //（申请方向，查询使用）

};
const defaultDatash = {
  pageNo: 1,
  pageSize: 10
};
export default {
  components: {Off_bill, Pagination ,SelectOption, InsideBillDetails},
  name:'insideBill',
  props: {
    isFinance: {
      type: Boolean,
      default: false
    }
  },
  computed:{
    clientHeight(){
      let height = 0;
      if(this.$store.state.settings.toolPosTop == 'top'){
        height = 245
      }else if(this.$store.state.settings.toolPosTop == 'right'){
        height = 165
      }
      return (document.documentElement.clientHeight-(this.isFinance ? height : 250))
    },
    pinnedBottomRowData(){
      if(this.gridApi&&this.gridApi.rowModel){
        const columnDisplay = ['total']
        return this.$commonUtils.pinnedBottomRowData(this.gridApi.rowModel.rootNode.childrenAfterFilter.map(item=>item.data), this.columnDefs, columnDisplay)
      }
      return ''
    }
  },
  data() {
    return {
      dialogType: 'edit',
      currentPageSize: 0,
      operationState: 0,
      writeOffView: false,
      pageBillId: '',
      detailType: '',
      insideTitle: '',
      insideBillView: false,
      exportQueryModel:'',
      filterText: "",
      showTable: false,
      userId: this.$store.getters.userId,
      ManualIdentificationState: false,
      selectionOptionState:false,
      exportType:1,
      checkboxState: false, // 表头筛选框状态
      transferVisible: false, // 配置筛选条件框
      transferData: [], // 筛选条件数据
      transferValue: [], // 当前筛选条件id
      caseList: [], // 当前列表数据
      checkCaseList: [], // 当前选中表头条件
      selectColumnList: [], // 配置表头总列数据做循环用
      preferenceList: [], // 循环表头数据
      filterData: {}, // 表头过滤数据
      conditionsModuleList: [], // 渲染筛选条件
      tableselectRow: [],
      showBottomBtn: "",
      selectshow: false,
      fwDatevalue: [],
      pageSizesList:[10, 50, 200,500,1000,5000,10000],
      defaultParams: {
        // 級聯菜單默認
        value: "deptId",
        label: "domainName",
        children: "children",
        checkStrictly: false
      },
      caseTypeOptions: [], // 案件类型集合
      list: [],
      total: 0,
      totalsh: 0,
      listLoading: true,
      listQuerysh: {
        pageNo: 1,
        pageSize: JSON.parse(localStorage.getItem('pageSize')) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name).pageSize : 10 : 10

      },
      listQuery: {
        pageNo: 1,
        pageSize: JSON.parse(localStorage.getItem('pageSize')) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name).pageSize : 10 : 10,
        appfromList: [], //（申请方向，查询使用）
      },
      defaultcolumnDefs:[
        {
          headerName: '序号',
          field: 'sid',
          width: 60,
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
      bussId:9,
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
              { statusPanel: 'agSelectedRowCountComponent', align: 'left' },
              {statusPanel: 'CountStatusBarComponent'}
            ]
          },
        }},
      brushRightHasFilter:false,
      frameworkComponents:{
        CountStatusBarComponent: Summary
      },
      gridApi:null,
      columnApi:null,
      pickerOptions: {
        // disabledDate(time) {
        //   return time.getTime() > Date.now();
        // },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      seletData: {
        custnames: [],
        usernames: [],
        apps: []
      },
      queryModuleData:{

      }
    };
  },
  activated(){
    if(this.initFlag){
      this.init()
      if(document.querySelector('.ag-body-viewport')){
        document.querySelector('.ag-body-viewport').scrollTop=this.scrollTopY
      }
    }
    this.initFlag=true
  },
  created() {
    this.init(1)
    // this.$route.meta.activeName=2
    // var columnDefs=[ {headerName: '内部账单号', field: 'billinterno',width:200}, {headerName: '案件文号', field: 'showrefno'}, {headerName: '内部账单种类', field: 'nbbillKindString'},{headerName: '客户', field: 'custIdString',width:400},{headerName: '承办组', field: 'costWkgIdString'},{headerName: '客户组', field: 'wkgidString'},{headerName: '所属部门', field: 'deptname'},{headerName: '总金额', field: 'total'},{headerName: '开单日期', field: 'reimburseUserIdString'},{headerName: '任务人', field: 'tasker'}]
    // this.columnDefs=[...this.defaultcolumnDefs,...columnDefs.map(item=> {
    //   if(!item.field.includes('Date')){
    //     return {
    //       headerName: item.headerName,
    //       field: item.field,
    //       width:item.width?item.width:100,
    //       resizable: true,
    //       sortable: true,
    //       filter: 'agSetColumnFilter',
    //       cellRenderer:this.cellRenderer,
    //       menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],
    //       enableRowGroup: true,
    //       filterParams: {
    //         newRowsAction: 'keep',
    //         comparator: (a, b)=>{
    //           return this.$commonUtils.sort(a,b,item.field)
    //         },
    //       }
    //     }
    //   }else {
    //     return {
    //       headerName: item.headerName,
    //       field: item.field,
    //       width:item.width?item.width:100,
    //       resizable: true,
    //       sortable: true,
    //       filter: 'agDateColumnFilter',
    //       cellRenderer:this.cellRenderer,
    //       menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],
    //       enableRowGroup: true,
    //       filterParams: {
    //         buttons: ['apply', 'reset'],
    //         // newRowsAction: 'keep',
    //         comparator: function (filterLocalDateAtMidnight, cellValue) {
    //           var dateAsString = cellValue;
    //           if (dateAsString == null) return -1;
    //           // var dateParts = dateAsString.split('/');
    //           // var cellDate = new Date(
    //           //   Number(dateParts[2]),
    //           //   Number(dateParts[1]) - 1,
    //           //   Number(dateParts[0])
    //           // );
    //           var cellDate = new Date(cellValue.replace(/-/g,'/'))
    //           if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
    //             return 0;
    //           }
    //           if (cellDate < filterLocalDateAtMidnight) {
    //             return -1;
    //           }
    //           if (cellDate > filterLocalDateAtMidnight) {
    //             return 1;
    //           }
    //         },
    //         browserDatePicker: true,
    //         minValidYear: 2000,
    //       }
    //     }
    //   }
    //
    // })]
    // this.getselectdata();
    // this.getList();
  },
  watch: {
    fwDatevalue: function(val) {
      this.listQuery.fillindateStart = val[0];
      this.listQuery.fillindateEnd = val[1];
    },
    checkboxState(n){
      if(n){
        this.$nextTick(()=>{
          this.$refs.checkCaseSelect.focus()
        })
      }
    },
  },
  methods: {
    queryPartData(billinterid){
      this.$commonUtils.partUpdate(
          this.list,
          queryBillInternalListUrl,
          {
            searchKey: 'billinterids',
            key: 'billinterid',
            value: billinterid
          },
          (list) => {
            this.gridApi.refreshCells();
          }
        )
    },
    rowDoubleClicked({data}){
      if(this.isFinance){
        this.insideTitle = '内部账单-查看'
        this.pageBillId = data.billinterid
        this.detailType = 'view'
        this.insideBillView = true
      }else{
       // this.$router.push('./cinBill/' +data.billinterid + '/view')
      }
    },
    getCurrentRowsData(key){
      if (this.gridApi && this.gridApi.rowModel) {
        return this.gridApi.rowModel.rootNode.childrenAfterSort.map(item => item.data).map(item => item[key])
      }
      return []
    },
    defaultQuerySearch(){
      this.queryModuleData = JSON.parse(localStorage.getItem('queryModuleData')) ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$route.name) ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$route.name).queryModuleData : {} : {}
    },
    closeWriteOffDialog(search){
      this.writeOffView = false
      search && this.handleSearch(1)
    },
    closeDialog({search, billinterid}){
      this.insideBillView = false
      this.insideTitle = ''
      // search && this.handleSearch(1)
      billinterid && this.queryPartData(billinterid)

    },
    init(flag){
      this.$route.meta.activeName=2
      if(flag){
        this.getAllWfs();
        !this.isFinance && this.queryFilterConfig(1);
      }

    },
    exportList(flag){
      this.exportType=flag
      this.selectionOptionState=true
    },
    closeSelect(flag){
      this.selectionOptionState=false
      if(flag){
        this.getList()
      }
    },
    clearSearch(that) {
      for (var key in that.queryModuleData) {
        if (!['billwfStatus'].includes(key)) {
          // for (var key in that.queryModuleData) {
          if(key.includes('Date') && key.includes('Array')){
            that.$set(that.queryModuleData,key,['',''])
          }else if (key.includes('Array') || key.includes('List')) {
              that.$set(that.queryModuleData, key, [])
            } else if (key === 'caseTypeIds' || key === 'deptGroupIds') {
              that.$set(that.queryModuleData, key, [])
            } else {
              that.$set(that.queryModuleData, key, null)
            }
          // }
        }
      }
      if (that.$refs.multiCascader) {
        that.$refs.multiCascader.forEach(item => {
          item.$el.querySelector('.el-input__inner').value = ''
        })
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
          width:this.getLoactionWidth(item.title)=='auto'?110:this.getLoactionWidth(item.title),
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
        this.$nextTick(()=>{
          this.columnDefs.forEach(item=>{
            this.columnApi.getColumn(item.field).addEventListener('menuVisibleChanged', ()=>{
              if(document.querySelector(".ag-tabs")){
                new this.$DraginResize(document.querySelector(".ag-set-filter-list"), {
                  clone: true,
                  end(info) {
                    if (info.dir == 'ver') {
                      this.elem.style.height = info.height + 'px';
                    }
                    else if (info.dir == 'hor') {
                      this.elem.style.width = info.width + 'px';
                    }
                  }
                })
              }
              let data =   this.$commonUtils.getFilterModel(this.$options.name+this.$route.name,'FilterModel')
              let arr =  Object.keys(data)
              if(this.columnDefs.map(itm => itm.field).diff(arr).includes(item.field)){
                this.gridApi.getFilterInstance(item.field).selectNothing()
              }
            });
          })

        })
        this.tableHeader=this.preferenceList.map(item=>({label:item.title, prop:item.value,width: this.getLoactionWidth(item.title)}))
        this.saveLocation()
        this.checkCaseList = this.preferenceList.map(item => item.value);
        // this.selectBox = this.selectColumnList.map(item => {
        //   if (this.checkCaseList.includes(item.COLUMN_NAME)) {
        //     return true;
        //   } else {
        //     return false;
        //   }
        // });
        this.preferenceList.forEach(item => {
          this.$set(this.filterData, item.value, []);
        });
        this.checkFilterList = this.preferenceList.map(item => false);
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
            this.getList('search')
          }
          this.getAllWfs();
        }
      });
    },
    handleCheckboxState() {
      this.checkboxState = !this.checkboxState;
      // if (this.checkboxState) {
      //   this.setWidth();
      // }
    },
    filterCheck(val) {
      this.filterText = val;
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
        this.checkboxState = false;
        this.filterText=''
        this.getList('search')
        this.getAllWfs();
      });
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
    queryFilterConfig(type) {

      const data = {
        bussId: this.bussId
      };
      this.conditionsModuleList=[]
      queryFilterConfig(data).then(res => {
        this.transferVisible = false;
          this.$nextTick(()=>{
            this.conditionsModuleList = res.data;
            this.transferValue = res.data.map(item => item.filterId);
            if(type==1){
              this.handleSearch(1)
            }
          })
      })
    },
    getSummary(list){
      let data={
        total: this.getSum(list,'total'),
      }
      this.$store.commit('caseInformation/SET_SUMMARYDATA',{name:'insidebill',count:data})
    },
    getSum(list,type){
      return list.map(item=>item[type]).filter(item=>!!item).reduce((x,y)=>x+y,0)
    },
    refreshEvenRowsCurrencyData(params) {
      this.getSummary(this.gridApi.rowModel.rootNode.childrenAfterFilter.map(item=>item.data))
      this.gridApi.rowModel.rootNode.childrenAfterFilter&&this.gridApi.rowModel.rootNode.childrenAfterFilter.length&&this.gridApi.rowModel.rootNode.childrenAfterFilter.forEach(rowNode => {
        setTimeout(() => {
          rowNode.setDataValue(
          'sid',
          rowNode.rowIndex + 1)
        }, 0)
      });
      // if(!params.columnApi.columnController.groupAutoColumns){
      //   this.gridApi.forEachNode(rowNode=> {
      //     rowNode.setDataValue(
      //       'sid',
      //       rowNode.rowIndex + 1)
      //   });
      // }

      // if(this.timeLimitList.length){
      //   // &&!params.afterDataChange
      if(params.type=="filterChanged"){
         this.$commonUtils.saveFilterModel(this.$options.name+this.$route.name,'FilterModel',this.gridApi.getFilterModel())
        var data = this.gridApi.getFilterModel()
        var arr = Object.keys(data);
        if(arr.length){
          this.brushRightHasFilter=true
        }else {
          this.brushRightHasFilter=false
        }
      }
      //   if(params.type=="sortChanged"){
      //     this.$commonUtils.saveFilterModel(this.$options.name+this.$route.name,'SortModel',this.gridApi.getSortModel())
      //   }
      // }
    },
    getContextMenuItems(params){
      if(!params.node.data){
        return []
      }
      // console.log(params.node.data,this.$router.name,1);
      return this.getRowContextmenuList(params.node.data).map(item=>({
        name: item.name,
        action: () =>{
          this[item.action](params.node.data,params.value,params)
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
      arr.find(item=>item.name==this.$options.name+this.$route.name).tableHeader=tableHeader
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

        });
      }
    },
    brushRight(){
      let data =   this.$commonUtils.getFilterModel(this.$options.name+this.$route.name,'FilterModel')
      let arr =  Object.keys(data)
      arr.forEach(item=>{
        this.gridApi.destroyFilter(item)
      })
    },
    getRowContextmenuList(row){
      return [
        { name:'复制',action: 'copy' },
        { name: '修改', action: 'editBill',permissions:166},
        { name: '删除', action: 'handledeleElement',permissions:167, }].filter(item=> {
        if (item.permissions) {
          return this.$store.getters.permissions.includes(item.permissions)
        } else {
          return true
        }
      })
    },
    onGridReady(params){
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
    },
    cellRenderer(params){
      if(params.colDef.field=='sid'){
        return params.rowIndex+1
      }
      if(params.colDef.field == 'total'){
        return `<span title="${params.value}" style="float: right">${formatAmount(params.value)}</span>`
      }
      return  `<span title="${params.value}">${params.value?params.value:''}</span>`
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
    handleSearch(flag){
      if(typeof flag == 'object'){
          const { searchType, searchData } = flag
          this.queryModuleData = Object.assign(this.queryModuleData, searchData)
          if(searchType !== undefined){
           this.operationState = searchType
          }
        }else {
          this.operationState = flag
        }
      this.listQuery.pageNo = "1";
      // if(this.operationState==1){
      //   this.listQuery=JSON.parse(JSON.stringify(defaultData))
      // }
      this.getList()
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
    getList(type) {

      this.showBottomBtn=false
      // if (type == "search") {
      //   this.listQuery.pageNo = "1";
      // }
      this.listLoading = true;
      this.totalsh = 0;
      var queryData;
      if( this.operationState==1){
        queryData=Object.assign(this.listQuery, this.queryModuleData)
      }

      if(this.operationState==0){
        queryData=this.listQuery
      }
      this.exportQueryModel=JSON.stringify(queryData)
      queryBillInternalListUrl(this.$commonUtils.cleanNullAttr(queryData)).then(response => {
        this.list = response.data;
        this.total = response.total;
        this.listLoading = false;
        this.$nextTick(()=>{
          this.currentPageSize= this.gridApi.rowModel.rootNode.allChildrenCount
          this.getSummary(this.gridApi.rowModel.rootNode.childrenAfterFilter.map(item=>item.data))
        })
      });
    },
    copy(row, value) {
      if(value){
        this.$copyText(value).then(
          res => {
          })
      }
    },
    remotepaternalUnit(query) {
      if (query !== "") {
        queryCustomerNameIdUrl({ keyword: query ,isCustomer:1 }).then(response => {
          if (response.success) {
            this.seletData.custnames = response.data;
          } else {
            this.$message.error(response.message);
          }
        });
      }
    },
    remotepaternalUnitapp(query) {
      if (query !== "") {
        queryAllUrl({ applicantName: query,orderBy:1 }).then(response => {
          if (response.success) {
            this.seletData.apps = response.data;
          } else {
            this.$message.error(response.message);
          }
        });
      }
    },
    shbtnclick() {
      cancelrequest("queryBillInternalListUrl");
      this.shSeach();
    },
    shSeach() {
      this.selectshow = true;
      this.showBottomBtn = 7;
      this.list = [];
      this.listLoading = true;
      this.total = 0;
      queryBillInternalTaskListUrl(this.listQuerysh).then(response => {
        this.list = response.data;
        this.totalsh = response.total;
        this.listLoading = false;
        this.$nextTick(()=>{
          this.currentPageSize= this.gridApi.rowModel.rootNode.allChildrenCount
          this.getSummary(this.gridApi.rowModel.rootNode.childrenAfterFilter.map(item=>item.data))
        })
      });
    },
    // getselectdata() {
    //   queryCaseType().then(res => {
    //     this.caseTypeOptions = res.data; // this.getTreeData()
    //   });
    //   querywfUserNameUrl().then(response => {
    //     if (response.success) {
    //       this.seletData.usernames = response.data;
    //     } else {
    //       this.$message.error(response.message);
    //     }
    //   });
    // },
    handleSelectionlistChange(val) {
      this.tableselectRow = val;
    },

    editBill(item){
      checkPermission({billInterId: item.billinterid}).then(res => {
        if (res.data.modify == 0) {
          this.$message.error('该条目您无法编辑')
        } else {
          if(this.isFinance){
            this.insideTitle = '内部账单-修改'
            this.pageBillId = item.billinterid
            this.detailType = 'edit'
            this.insideBillView = true
          }else{
          this.$router.push('./cinBill/' +item.billinterid + '/edit')
          }
        }
      })
    },
    handledeleElement(item, index) {
      checkPermission({billInterId: item.billinterid}).then(res => {
          if (res.data.delete == 0) {
            this.$message.error('该条目您无法删除')
          } else {
            this.$confirm("此操作将永久删除该条目, 是否继续?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                deleteBillInternalUrl({ billinterid: item.billinterid }).then(
                  response => {
                    if (response.success) {
                      // const index = this.list.indexOf(item);
                      this.list.splice(this.list.findIndex(itm=>itm===item), 1);
                      this.$nextTick(()=>{
                        this.currentPageSize= this.gridApi.rowModel.rootNode.allChildrenCount
                        this.getSummary(this.gridApi.rowModel.rootNode.childrenAfterFilter.map(item=>item.data))
                      })
                      this.$message({
                        type: "success",
                        message: "删除成功"
                      });
                    } else {
                      this.$message.error(response.message);
                    }
                  }
                );
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消删除"
                });
              });
          }
        })
    },
    editBtnclick(val) {
      switch (val) {
        case "7":
          this.shfunc("1");
          break;
        case "8":
          this.shfunc("0");
          break;

        default:
          break;
      }
    },
    getSelectedRows() {
      if (this.gridApi) {
        const selectedNodes = this.gridApi.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data);
        return selectedData
      } else {
        return []
      }
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
      // if(property=='agentNumEnd'){
      //   this.handleSearch(1)
      // }
    },
    shfunc(style) {
      if (!this.getSelectedRows().length) {
        this.$message.error("请选择账单");
        return;
      }
      doBillInternalTaskUrl({
        taskIdList: this.getSelectedRows().map(item => item.taskId),
        result: style
      }).then(response => {
        this.$message.success(response.message);
        this.shSeach();
      });
    },
    creatbtn(val) {
      if (val === "1") {
        this.$router.push("./off_bill/bill");
      }
      if (val === "2") {
        if(this.isFinance){

        }else{
          this.$router.push("./off_bill/insideBill");
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.searchfullRow {
  .searchcol {
    padding-right: 3%;
  }
  /deep/ .el-form-item__label {
    width: 25%;
  }
  /deep/ .el-form-item__content {
    width: 75%;
  }
  /deep/ .el-form-item {
    width: 100%;
  }
  /deep/ .el-input,
  /deep/ .el-select {
    width: 100%;
  }
}
.searchfullRow1 {
  .searchcol {
    padding-right: 0%;
  }
  /deep/ .el-form-item__label {
    width: 11.7%;
  }
  /deep/ .el-checkbox,
  .el-checkbox-group {
    display: inline-block;
  }
  /deep/ .el-form-item__content {
    width: 75%;
  }
  /deep/ .el-form-item {
    width: 100%;
  }
  /deep/ .el-input,
  /deep/ .el-select {
    width: 100%;
  }
}
.dateSlect {
  /deep/ .el-input,
  /deep/ .el-select {
    width: 45%;
  }
}
/deep/ .el-cascader {
  width: 100%;
}
.el-table /deep/ th {
  background-color: #f2f2f2;
  color: #333333;
  text-align: center;
}
.el-table /deep/ td {
  padding: 0px;
  text-align: center;
}
.el-row {
  margin-bottom: 5px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.iconBtn {
  font-size: 16px;
}
/deep/.el-range-editor {
  width: 100% !important;
}
/deep/ .el-date-editor .el-range-separator {
  width: 9% !important;
}
.bottom-row {
  padding: 10px 10px;
  text-align: right;
  // margin-top: 10px;
  // border: 1px solid #ccc;
}
.bottomrowdiv {
  position: fixed;
  bottom: 30px;
  /* width: 100.6%; */
  right: 45px;
}
.clearButton {
  background: #fff;
  color: RGBA(254, 153, 23, 1);
  border: 0;
  /deep/ span {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  img {
    width: 20px;
    margin-right: 8px;
    vertical-align: middle;
  }
}
.el-form /deep/ {
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
  .clearWrap{
    display: flex;
    justify-content: flex-end;
  }
  .queryButton_wrap{
    display: flex;
    justify-content: center;
    .el-button-group{
      margin-right: 10px;
    }
    margin-bottom:20px ;
  }
  .abow_dialog {
    > > > .el-dialog {
      position: absolute;
      top: 50%;
      left: 50%;
      margin: 0 !important;
      transform: translate(-50%, -50%);
      max-height: calc(100% - 30px);
      max-width: calc(100% - 30px);
      display: flex;
      flex-direction: column;
    }

    > > > .el-dialog__body {
      overflow: auto;
    }
  }
</style>
