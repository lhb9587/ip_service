<template>
  <div class="" style="position:relative;">
    <ViewsSwitching class="ViewsSwitching" @changePattern="changePattern"></ViewsSwitching>
    <div v-if="!isFinance" class="filter-container">
      <el-form :inline="true" :model="listQuery" size="small" class="demo-form-inline">

        <el-row>

          <el-col :span="24" style="text-align:center">
            <el-button-group>
              <el-button type="primary" size="small" @click="getList('search')">搜索</el-button>
              <el-popover
                placement="bottom"
                width="550"
                trigger="click"
              >

                <template>
                  <el-form label-width="120px" :model="listQuery" size="mini" class="form-container"
                           @keyup.enter.native="getList('search')">
                    <el-form-item label="案件文号">
                      <!--              <el-input v-model="listQuery.agentNum" placeholder=""></el-input>-->
                      <el-input v-model="listQuery.agentNumStart " placeholder="请输入内容" @change="changeTextRange"
                                clearable></el-input>
                      <span>至</span>
                      <el-input v-model="listQuery.agentNumEnd" placeholder="请输入内容" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="多个案件文号">
                      <el-input clearable v-model="listQuery.agentNums" placeholder="请输入案件文号"
                                type="textarea"></el-input>
                    </el-form-item>

                    <el-form-item label="客户">
                      <el-select default-first-option :clearable='true' v-model="listQuery.custId" no-match-text='暂无数据'
                                 loading-text='正在查询' filterable remote reserve-keyword placeholder="请输入关键词"
                                 :remote-method="remotepaternalUnit">
                        <el-option v-for="item in seletData.custnames" :key="item.custId" :label="item.fullname"
                                   :value="item.custId">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="提交人">
                      <el-select default-first-option :clearable='true' v-model="listQuery.referUserId"
                                 no-match-text='暂无数据' loading-text='正在查询' filterable remote reserve-keyword
                                 placeholder="请输入关键词">
                        <el-option v-for="(item,key) in seletData.usernames" :key="key" :label="item.fullname"
                                   :value="item.userId">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="申请人">
                      <el-select default-first-option :clearable='true' v-model="listQuery.appId" no-match-text='暂无数据'
                                 loading-text='正在查询' filterable remote reserve-keyword placeholder="请输入关键词"
                                 :remote-method="remotepaternalUnitapp">
                        <el-option v-for="(item,key) in seletData.apps" :key="key" :label="item.applicantName"
                                   :value="item.appId">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="申请方向">
                      <el-select v-model="listQuery.appFromtoArray" placeholder="请选择创建人" filterable clearable multiple>
                        <el-option
                          v-for="(item,index) in [{label: '内-内'},{label: '外-内'},{label: '内-外'},{label: '外-外'},{label: '台-内'}]"
                          :key="item.label"
                          :label="item.label"
                          :value="item.label"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="申请号">
                      <el-input clearable v-model="listQuery.droitNumber" placeholder="请输入申请号" type="text"></el-input>
                    </el-form-item>
                    <el-form-item label="多个申请号">
                      <el-input clearable v-model="listQuery.droitNumbers" placeholder="请输入申请号"
                                type="textarea"></el-input>
                    </el-form-item>
                    <el-form-item label="案件类型">
                      <el-multi-cascader
                        ref="multiCascader"
                        :show-all-levels="false"
                        :options="$store.getters.caseTypeList"
                        :props="defaultParams"
                        multiple
                        filterable
                        clearable
                        change-on-select
                        selectChildren
                        v-model="listQuery.caseTypeIds"></el-multi-cascader>
                      <!--              <el-cascader ref="caseTypecascader" filterable v-model="listQuery.caseTypeId" :show-all-levels="false" :options="caseTypeOptions" :props="defaultParams" placeholder="请选择">-->
                      <!--              </el-cascader>-->
                    </el-form-item>

                    <!--            <el-form-item label="开单日期">-->
                    <!--              <el-date-picker v-model="listQuery.referDate" format='yyyy-MM-dd' value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">-->
                    <!--              </el-date-picker>-->
                    <!--            </el-form-item>-->

                    <el-form-item label="核销日期">
                      <DataPicker class="DataPicker" v-model="listQuery['tobillDateArray']"></DataPicker>
                    </el-form-item>
                    <el-form-item label="立卷日期">
                      <DataPicker class="DataPicker" v-model="listQuery['caseDateArray']"></DataPicker>
                    </el-form-item>
                    <el-form-item label="核销状态" class="content-center">
                      <template>
                        <el-radio-group v-model="listQuery.tobillStatus">
                          <el-radio label="0">未核销</el-radio>
                          <el-radio label="1">已核销</el-radio>
                        </el-radio-group>
                      </template>
                    </el-form-item>
                    <el-form-item label="费用种类" class="content-center">
                      <template>
                        <el-radio-group v-model="listQuery.feeKind">
                          <el-radio :label="1">服务费</el-radio>
                          <el-radio :label="2">官费</el-radio>
                          <el-radio :label="3">杂费</el-radio>
                        </el-radio-group>
                      </template>
                    </el-form-item>
                    <el-form-item label="开单日期">
                      <DataPicker class="DataPicker" v-model="listQuery['referDateArray']"></DataPicker>
                    </el-form-item>
                  </el-form>
                  <div style="text-align:right">
                    <el-button size="mini" @click="clearSeach"><span>重置</span></el-button>
                    <el-button type="primary" size="mini" @click="getList('search')">搜索</el-button>
                  </div>
                </template>
                <el-button slot="reference" style="padding: 8.5px 5px;" type="primary" size="small"
                           icon="el-icon-arrow-down"></el-button>
              </el-popover>

            </el-button-group>
            <el-button type="primary" size="small" @click="handleSelect('批量编辑')" v-allow="168">批量编辑</el-button>
            <el-button type="primary" size="small" @click="handleSelect('删除')">删除</el-button>
          </el-col>
        </el-row>

        <!--        <el-row class="searchfullRow1">-->
        <!--          <el-col :span="24" class="searchcol">-->
        <!--            <el-form-item label="核销状态">-->
        <!--              <template>-->
        <!--                <el-radio-group v-model="listQuery.tobillStatus"  @change="getList">-->
        <!--                  <el-radio label="">全部</el-radio>-->
        <!--                  <el-radio label="0">未核销</el-radio>-->
        <!--                  <el-radio label="1">已核销</el-radio>-->
        <!--                  <el-radio label="2">延迟核销</el-radio>-->
        <!--                  <el-radio label="3">不开账单</el-radio>-->

        <!--                </el-radio-group>-->
        <!--              </template>-->
        <!--            </el-form-item>-->
        <!--          </el-col>-->

        <!--        </el-row>-->
      </el-form>

    </div>
    <!--    <template v-if="editState">-->
    <!--      <el-button type="primary" size="small"  @click="handleEdit()" >{{multipleTypeText}}</el-button> <el-button type="primary" size="small"  @click="editState=false" >取消</el-button>-->
    <!--    </template>-->
    <TitleTotal :total="total" :currentPageSize="currentPageSize" style="float: left;"/>
    <div
      style="height: 30px;cursor: pointer; float: right; align-items: center; right: 0px; bottom: -6px; font-size: 14px; padding-right: 6px;">
          <el-button type="text" @click="exportList(2)" >导出</el-button>
          <span style="color: #52A2F4;margin: 0 5px"> / </span>
          <el-button type="text" @click="exportList(1)">全局导出</el-button>
<!--      <el-button type="text" @click="exportList(1)"><i class="el-icon-download">导出</i></el-button>-->
<!--      <img @click="exportList(2)" src="@/assets/moon.png" style="width: 16px;height: 16px" width="16" alt="">-->
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
                   :rowData="list"
                   rowSelection="multiple"
                   @grid-ready="onGridReady"
                   :gridOptions="gridOptions"
                   @dragStopped="dragStopped"
                   :getContextMenuItems="getContextMenuItems"
                   suppressAutoSize

                   animateRows
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
                   @dragover.native.stop.prevent="hoverState=true"
                   @dragleave.native.stop.prevent="hoverState=false"
                   @dragenter.native.stop.prevent="hoverState=true"
        >
        </AgGridVue>
        <pagination v-show="total>0" :total="total" :page.sync="pageQuery.pageNo" :pageSizes="pageSizesList"
                    :limit.sync="pageQuery.pageSize" @pagination="getList"/>
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
      </div>
              <div class="right_wrap"
                   :style="{position:'relative','margin-left':currentCaseId&&pattern?'10px' :'0',height:clientHeight+'px'}">
                <!--<span class="el-icon-close" slot="close" style="cursor:pointer;position: absolute;right: 0;top: 10px;z-index: 1000" @click="closeCurrentRow"></span>-->
                <seeCaseDetail :style="cssVar" v-if="currentCaseId&&pattern" :case-id="currentCaseId" :sign="1" :taskType="taskType"
                               :backsign="false"></seeCaseDetail>
              </div>
    </div>
    <!--    <el-table show-summary size="mini" @selection-change="handleSelectionChange"  :data="list" border fit empty-text="暂无数据"  highlight-current-row current-row-key style="width: 100%;">-->
    <!--      <el-table-column type="selection" width="55">-->
    <!--      </el-table-column>-->
    <!--      <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>-->
    <!--      <el-table-column label="案件文号" align="left" width>-->
    <!--        <template slot-scope="scope">-->
    <!--          <span style="cursor: pointer;" @click='$router.push("./trawSheet/" + scope.row.billRecordId + "/see")'>{{ scope.row.agentNum }}</span>-->
    <!--        </template>-->
    <!--      </el-table-column>-->

    <!--      <el-table-column label="客户" align="left" width >-->
    <!--        <template slot-scope="scope">-->

    <!--          <CustCard :custName='scope.row.custName' :customerID='scope.row.custId' />-->
    <!--        </template>-->
    <!--      </el-table-column>-->

    <!--      <el-table-column label="费用种类" align="left" width>-->
    <!--        <template slot-scope="scope">-->
    <!--          <span>{{ scope.row.feeKindNameString }}</span>-->
    <!--        </template>-->
    <!--      </el-table-column>-->
    <!--      <el-table-column label="费用描述(中文)" align="left" width="200" >-->
    <!--        <template slot-scope="scope">-->
    <!--          <span>{{ scope.row.descriptionCn}}</span>-->
    <!--        </template>-->
    <!--      </el-table-column>-->
    <!--      <el-table-column label="费用描述(英文)" align="left" width="200" >-->
    <!--        <template slot-scope="scope">-->
    <!--          <span>{{ scope.row.descriptionEn }}</span>-->
    <!--        </template>-->
    <!--      </el-table-column>-->
    <!--      <el-table-column label="单价" align="left" width >-->
    <!--        <template slot-scope="scope">-->
    <!--          <span>{{ scope.row.price }}</span>-->
    <!--        </template>-->
    <!--      </el-table-column>-->
    <!--      <el-table-column label="金额" align="left" width prop="amountBill">-->
    <!--        <template slot-scope="scope">-->
    <!--          <span>{{ scope.row.amountBill }}</span>-->
    <!--        </template>-->
    <!--      </el-table-column>-->
    <!--      <el-table-column width="100" prop="yearNo" label="年号"></el-table-column>-->
    <!--      <el-table-column label="提交人" align="left" width >-->
    <!--        <template slot-scope="scope">-->
    <!--          <span>{{ scope.row.referUserNameString }}</span>-->
    <!--        </template>-->
    <!--      </el-table-column>-->
    <!--      <el-table-column label="核销状态" align="left" width >-->
    <!--        <template slot-scope="scope">-->
    <!--          <span>{{ scope.row.tobillStatusStr }}</span>-->
    <!--        </template>-->
    <!--      </el-table-column>-->
    <!--      <el-table-column label="核销日期" align="left" width >-->
    <!--        <template slot-scope="scope">-->
    <!--          <span>{{ scope.row.tobillDate }}</span>-->
    <!--        </template>-->
    <!--      </el-table-column>-->

    <!--      <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">-->
    <!--        <template slot-scope="scope">-->

    <!--          <el-row>-->
    <!--            <el-col :span="24">-->

    <!--              <router-link v-allow="168" v-if="scope.row.tobillStatusStr=='未核销'" :to='"./trawSheet/" +scope.row.billRecordId + "/edit"'>-->
    <!--                <el-button class="iconBtn" type="text" size="medium" icon="el-icon-edit">-->

    <!--                </el-button>-->
    <!--              </router-link>-->
    <!--              <el-button v-allow="169" class="iconBtn" size="medium" type="text" @click="handledeleElement(scope.row,scope.$index)" icon="el-icon-delete"></el-button>-->
    <!--            </el-col>-->
    <!--          </el-row>-->
    <!--        </template>-->
    <!--      </el-table-column>-->
    <!--    </el-table>-->
    <!--    <pagination :storage="false" v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />-->
    <SelectOption :buss-id="10" v-if="selectionOptionState" :dialog-visible="selectionOptionState"
                  @cancel="closeSelect" :idArray="getCurrentRowsData('billRecordId')"
                  :defaultMultipleSelect="preferenceList.map(i=>i.title)" :exportType="exportType"
                  :exportQueryModel="exportQueryModel"></SelectOption>
    <Willtable v-if="showTable" :showTable="showTable" :billRecordIds="getSelectedRows().map(item=>item.billRecordId)"
               plType="草单" @closeTable="closeTable"></Willtable>

    <!--    复制草单-->
    <!--    <el-dialog-->
    <!--      :visible.sync="copyTrawSheetView"-->
    <!--      width="80%"-->
    <!--      title="复制草单"-->
    <!--    >-->
    <!--      <div>-->
    <!--        <el-row class="searchfullRow">-->
    <!--          <el-col :span="11" class="searchcol">-->

    <!--            <el-form label-width="100px">-->
    <!--              <el-form-item label="案件文号">-->
    <!--                <el-select multiple remote clearable reserve-keyword filterable placeholder="请输入关键词" :remote-method="getCase" v-model="caseNums">-->
    <!--                  <el-option v-for="item in gridData" :key="item.caseId" :value="item.agentNum" :disabled="item.agentNum == '案件文号'" style="display: flex;max-height: 100px;overflow-y: auto">-->
    <!--                    <div class="tables" style="display: flex;max-height: 100px;width: 100%; overflow-y: auto">-->
    <!--                      <el-tooltip  :content="item.agentNum" placement="top" effect="light">-->
    <!--                          <div style="flex: 1;cursor: default;height: 34px;line-height: 34px;" class="overflow-hidden" :class="{'table-head': item.agentNum == '案件文号'}">{{item.agentNum}}</div>-->
    <!--                        </el-tooltip>-->
    <!--                        <el-tooltip  :content="item.caseName" placement="top" effect="light">-->
    <!--                          <div style="flex: 1;cursor: default;height: 34px;line-height: 34px;" class="overflow-hidden" :class="{'table-head': item.caseName == '案件名称'}">{{item.caseName}}</div>-->
    <!--                        </el-tooltip>-->
    <!--                        <el-tooltip  :content="item.name||item.custName" placement="top" effect="light">-->
    <!--                          <div style="flex: 1;cursor: default;height: 34px;line-height: 34px;" class="overflow-hidden" :class="{'table-head': item.custName == '客户'}">{{item.name||item.custName}}</div>-->
    <!--                        </el-tooltip>-->
    <!--                    </div>-->


    <!--                  </el-option>-->
    <!--                </el-select>-->

    <!--              </el-form-item>-->
    <!--            </el-form>-->
    <!--          </el-col>-->

    <!--        </el-row>-->
    <!--      </div>-->
    <!--      <span slot="footer" class="dialog-footer fl-ac-jc">-->
    <!--        <el-button size="mini" @click="copyTrawSheetView = false">取 消</el-button>-->
    <!--        <el-button type="primary" size="mini">确 定</el-button>-->
    <!--      </span>-->
    <!--    </el-dialog>-->
    <el-dialog
      v-if="trawSheetView"
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="trawSheetView"
      width="80%"
      height="80%"
      class="abow_dialog"
      :before-close="beforeClose"
    >
      <traw-sheet-details v-if="trawSheetView" :copyTraw="copyTraw" :finance-bill-record-id="billRecordId" :open-type="openType" :opt="2" @closeDialog="closeDialog" />
    </el-dialog>
  </div>
</template>
<script>
  import {formatAmount, fomatFloat} from '@/utils/filters'
  import TrawSheetDetails from './trawSheetDetails'
  import SelectOption from '@/views/workbench/case/components/SelectOption'
  import { mapState, mapGetters } from 'vuex'
  import Willtable from '@/components/Willtable'
  import {
    queryBillRecordListUrl,
    queryCustomerNameIdUrl,
    querywfUserNameUrl,
    queryAllUrl,
    billRecorddeleteUrl
  } from '@/api/billApi'
  import {
    queryCaseType,
    billRecordDelete,
    savePreference,
    delPreference,
    selectColumn,
    queryPreference,
    queryApplicantByIdList
  } from '@/api/caseList.js'
  import Pagination from '@/components/Pagination'
  import { getCase } from '../../../../../api/feeList'
  import DateFilter from '@/components/ag-date-filter'
  import ViewsSwitching from '@/views/workbench/case/components/ViewsSwitching.vue'
  import SeeCaseDetail from '@/views/workbench/case/components/ManualIdentification/seeCaseDetail.vue' // secondary package based on el-pagination
  const defaultData = {
    pageNo: 1,
    pageSize: 10,
    agentNum: '', //（代理文号，查询使用）
    caseTypeId: [], //（案件类型ID，查询使用）
    custId: '', //
    appId: '', //（申请人ID，查询使用）
    referDate: '', //
    tobillDate: '', //
    referUserId: '', //
    tobillStatus: '', //（1已核销2延迟核销3不开账单0未核销null全部）
    tobillDateArray: []
  }
  export default {
    name: 'traw-sheet-list',
    components: { SeeCaseDetail, ViewsSwitching, Pagination, Willtable, SelectOption, TrawSheetDetails },
    computed: {
      cssVar(){
        return {
          '--height': document.documentElement.clientHeight-300 + 'px'
        }
      },
      clientHeight() {
        return document.documentElement.clientHeight - 260
      },
      ...mapGetters(['userId']),
      ...mapState({
        'pattern': state => state.user.pattern
      })
    },
    props:{
      isFinance: {
        type: Boolean,
        default: false
      }
    },
    data() {
      var tableHeader = []
      if (localStorage.getItem('tableHeader') && JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$route.name)) {
        tableHeader = JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$route.name).tableHeader
      }
      return {
        taskType: '',
        currentCaseId: '',
        copyTraw: false,
        openType: '',
        billRecordId: '',
        title: '',
        trawSheetView: false,
        gridData: [],
        caseNums: [],
        copyTrawSheetView: false,
        defaultParams: { // 級聯菜單默認
          value: 'caseTypeId',
          label: 'caseType',
          children: 'childrens'
          // checkStrictly: false
        },
        multipleTypeText: '',
        exportQueryModel: {},
        selectionOptionState: false,
        exportType: 1,
        currentPageSize: 0,
        rowContextmenuList: [],
        transferVisible: false, // 配置筛选条件框
        transferData: [], // 筛选条件数据
        transferValue: [], // 当前筛选条件id
        caseList: [], // 当前列表数据
        preferenceList: [], // 循环表头数据
        filterData: {}, // 表头过滤数据
        conditionsModuleList: [], // 渲染筛选条件
        caseListDefault: [], // 案件默认全部列表
        checkFilterList: [], // 控制筛选漏斗状态
        checkboxState: false,
        selectColumnList: [],
        pageSizesList: [10, 50, 200, 500, 1000, 5000, 10000],
        filterText: '',
        checkCaseList: [],
        tableHeader: tableHeader,
        gridOptions: {
          ...this.$store.state.caseInformation.gridOptions, ...{
            statusBar: {
              statusPanels: [
                { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
                { statusPanel: 'agSelectedRowCountComponent', align: 'left' }
              ]
            }
            //floatingFilter: true,
          }
        },
        autoGroupColumnDef: {
          headerName: '组',
          field: 'group',
          headerCheckboxSelection: true,
          cellRenderer: 'agGroupCellRenderer',
          cellRendererParams: { checkbox: true }
        },
        defaultcolumnDefs: [
          {
            headerName: '序号',
            field: 'sid',
            width: this.getLoactionWidth('序号') == 'auto' ? 60 : this.getLoactionWidth('序号'),
            resizable: true,
            enableRowGroup: true,
            // enablePivot: true,
            'pinned': 'left',
            floatingFilter: true,
            filter: false,
            cellClass: 'vAlign',
            cellRenderer: this.cellRenderer,
            suppressMenu: true
          }
        ],
        columnDefs: [],
        brushRightHasFilter: false,
        leftWrapWidth: localStorage.getItem('leftWrapWidth') ? localStorage.getItem('leftWrapWidth') : '60%',
        defaultParams: {
          // 級聯菜單默認
          value: 'caseTypeId',
          label: 'caseType',
          children: 'childrens',
          checkStrictly: false
        },
        caseTypeOptions: [], // 案件类型集合
        list: [],
        total: 0,
        listLoading: true,
        pageQuery: {
          pageNo: 1,
          pageSize: JSON.parse(localStorage.getItem('pageSize')) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name).pageSize : 10 : 10
        },
        listQuery: {
          // pageNo: 1,
          // pageSize: 10,
          agentNum: '', //（代理文号，查询使用）
          caseTypeId: [], //（案件类型ID，查询使用）
          custId: '', //
          appId: '', //（申请人ID，查询使用）
          referDate: '', //
          tobillDate: '', //
          referUserId: '', //
          tobillStatus: '' //（1已核销2延迟核销3不开账单0未核销null全部）
        },
        pickerOptions: {
          // disabledDate(time) {
          //   return time.getTime() > Date.now();
          // },
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
        seletData: {
          custnames: [],
          usernames: [],
          apps: []
        },
        showTable: false,
        editState: false,
        allselecOffs: []
      }
    },
    created() {
      this.getselectdata()
      this.defaultQuerySearch()
      // this.getList();
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
      $route: {
        handler: function (val, oldVal) {
          // this.$nextTick(() => {
          //   this.rightDrag()
          // })
          setTimeout(()=>{
            this.rightDrag()
          },500)
        },
        immediate: true
      },
      checkboxState(n) {
        if (n) {
          this.$nextTick(() => {
            this.$refs.checkCaseSelect.focus()
          })
        }
      }
    },
    methods: {
      changePattern(e){
        if(e===1){
          this.$store.commit('user/SET_PATTERN',false)
        } else {
          this.$store.commit('user/SET_PATTERN',true)
        }
      },
      queryPartData(billRecordIds){
        this.$commonUtils.partUpdate(
            this.list,
            queryBillRecordListUrl,
            {
              searchKey: 'billRecordIds',
              key: 'billRecordId',
              value: billRecordIds
            },
            (list) => {
              this.gridApi.refreshCells();
            }
          )
      },
      beforeClose(done){
        done()
        this.copyTraw = false
      },
      getCurrentRowsData(key){
        if (this.gridApi && this.gridApi.rowModel) {
          return this.gridApi.rowModel.rootNode.childrenAfterSort.map(item => item.data).map(item => item[key])
        }
        return []
      },
      closeDialog({search, billRecordId}){
        this.trawSheetView = false
        this.title = ''
        this.billRecordId = ''
        this.openType = ''
        // search && this.getList()
        billRecordId && this.queryPartData(billRecordId)
      },
      clickCase() {

      },
      rowClick(row) {
        //下拉框多选
      },
      getCase(e) {
        getCase({ agentNumCaseName: e, pageSize: 50 }).then(res => {
          this.gridData = res.data
          this.gridData.unshift({ 'agentNum': '案件文号', 'caseName': '案件名称', 'custName': '客户' })
        })
      },
      getSelectedRows() {
        if (this.gridApi) {
          const selectedNodes = this.gridApi.getSelectedNodes()
          const selectedData = selectedNodes.map(node => node.data)
          return selectedData
        }
      },
      closeSelect(f) {
        this.selectionOptionState = false
      },
      exportList(flag) {
        this.exportType = flag
        this.selectionOptionState = true
      },
      defaultQuerySearch() {
        this.listQuery = JSON.parse(localStorage.getItem('queryModuleData')) ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$options.name) ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$options.name).queryModuleData : {} : {}
        this.getAllWfs()
        !this.isFinance && this.getList()
      },
      handleSeeCaseDetail(params){
        this.currentCaseId=''
        if(params.data.taskType){
          this.taskType=params.data.taskType
        }
        this.$nextTick(()=>{
          this.currentCaseId = params.data.caseId
        })
      },
      cellRenderer(params) {
        if (params.colDef.field == 'sid') {
          return params.rowIndex + 1
        }
        if(params.colDef.field=='agentNum'){
          var eDiv = document.createElement('div');
          eDiv.style.height='100%'
          eDiv.innerHTML = `<div class="btn-simple" style="cursor: pointer;color: #00b0ff" title="${params.value}"><span>${params.value?params.value:''}</span></div>`
          var eButton = eDiv.querySelectorAll('.btn-simple')[0];
          eButton.addEventListener('click', ()=> {
            this.handleSeeCaseDetail(params)  //this.takeCaseDetail(params.data,params.colDef.field)
          });
          return eDiv;
        }
        if(['amountBill', 'price'].includes(params.colDef.field)){
          return `<span title="${params.value}" style="float: right">${formatAmount(params.value)}</span>`
        }
        return `<span title="${params.value}">${(params.value || params.value === 0) ? params.value : ''}</span>`
      },
      rightDrag() {
        let that = this
        // document.getElementById('searchWrap').onscroll=function (e) {
        //   that.clearWrapTop = e.target.scrollTop+ e.target.offsetHeight
        //   document.getElementById('clearWrap').style.top = that.clearWrapTop -40 + 'px'
        // }

        // if(document.querySelector('.dragin-resize')){ // 任务6235专利官方通知无法拖拽问题注释此处
        //   return
        // }
        document.querySelector(".left_wrap")&&new this.$DraginResize(document.querySelector(".left_wrap"), {
          clone: true,
          end(info) {
            if (info.dir == 'ver') {
              this.elem.style.height = info.height + 'px';
            } else if (info.dir == 'hor') {
              this.elem.style.width = info.width + 'px';
              localStorage.setItem('leftWrapWidth', info.width + 'px')
              that.leftWrapWidth = info.width + 'px'
            }
          }
        })

      },
      getAllWfs() {
        const data = {
          userId: this.userId,
          bussId: 44
        }
        Promise.all([selectColumn(data), queryPreference(data)]).then(res => {
          this.selectColumnList = res[0].data

          this.preferenceList = res[1].data
          this.columnDefs = [...this.defaultcolumnDefs, ...this.preferenceList.map(item => ({
            headerName: item.title,
            field: item.value,
            width: this.getLoactionWidth(item.title) == 'auto' ? 110 : this.getLoactionWidth(item.title),
            resizable: true,
            sortable: true,
            filter: ['payDate', 'tobillDate', 'referDate', 'createDate'].includes(item.value) ? DateFilter : 'agSetColumnFilter',
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
              this.columnApi.getColumn(item.field) && this.columnApi.getColumn(item.field).addEventListener('menuVisibleChanged', () => {
                if (document.querySelector('.ag-tabs')) {
                  new this.$DraginResize(document.querySelector('.ag-set-filter-list'), {
                    clone: true,
                    end(info) {
                      if (info.dir == 'ver') {
                        this.elem.style.height = info.height + 'px'
                      } else if (info.dir == 'hor') {
                        this.elem.style.width = info.width + 'px'
                      }
                    }
                  })
                }
                // let arr = this.columnDefs.map(item => item.field)
                // if (this.columnDefs.map(itm => itm.field).diff(arr).includes(item.field)) {
                //   this.gridApi.getFilterInstance(item.field).selectNothing()
                // }
              })
            })
          })
          this.tableHeader = this.preferenceList.map(item => ({
            label: item.title,
            prop: item.value,
            width: this.getLoactionWidth(item.title)
          }))

          this.saveLocation()
          this.checkCaseList = this.preferenceList.map(item => item.value)
          // this.selectBox = this.selectColumnList.map(item => {
          //   if (this.checkCaseList.includes(item.COLUMN_NAME)) {
          //     return true;
          //   } else {
          //     return false;
          //   }
          // });
          this.preferenceList.forEach(item => {
            this.$set(this.filterData, item.value, [])
          })
          this.checkFilterList = this.preferenceList.map(item => false)
        })
      },
      saveLocation() {
        if (!localStorage.getItem('tableHeader')) {
          let arr = []
          arr.push({ name: this.$options.name, tableHeader: this.tableHeader })
          localStorage.setItem('tableHeader', JSON.stringify(arr))
        } else {
          let arr = JSON.parse(localStorage.getItem('tableHeader'))
          if (arr.find(item => item.name == this.$route.name)) {
            arr.find(item => item.name == this.$route.name).tableHeader = this.tableHeader
            localStorage.setItem('tableHeader', JSON.stringify(arr))
          } else {
            arr.push({ name: this.$route.name, tableHeader: this.tableHeader })
            localStorage.setItem('tableHeader', JSON.stringify(arr))
          }
        }

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
      delPreference(num) {
        const data = {
          userId: this.userId,
          bussId: 44
        }
        delPreference(data).then(res => {
          if (res.success) {
            this.checkboxState = false
            if (!num) {
              this.getList()
            }
            this.getAllWfs()
          }
        })
      },
      savePreference(num) {

        let list2 = this.checkCaseList.map(item => ({
          title: this.selectColumnList.find(i => i.COLUMN_NAME === item)
            .COLUMN_COMMENT,
          value: item
        }))
        const data = {
          userId: this.userId,
          bussId: 44,
          list2
        }
        savePreference(data).then(res => {
          if (res.success) {
            this.checkboxState = false
            this.filterText = ''
            if (!num) {
              this.getList()
            }
            this.getAllWfs()
          }
        })
      },
      handleChange(boolean) {
        if (!boolean) {
          this.checkboxState = false
        }
      },
      filterCheck(val) {
        this.filterText = val
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
        // if (!params.columnApi.columnController.groupAutoColumns) {
        //   this.gridApi.forEachNode(rowNode => {
        //     rowNode.setDataValue(
        //       'sid',
        //       rowNode.rowIndex + 1)
        //   })
        // }
        // if(this.caseList.length){
        //   this.$commonUtils.saveFilterModel(this.$options.name+this.$route.name,'FilterModel',this.gridApi.getFilterModel())
        // }
        if (this.list.length) {
          if (params.type == 'filterChanged') {
            var arr = Object.keys(this.gridApi.getFilterModel())
            if (arr.length) {
              this.brushRightHasFilter = true
            } else {
              this.brushRightHasFilter = false
            }
          }
          // if (params.type == "sortChanged") {
          //   this.$commonUtils.saveFilterModel(this.$options.name + this.$route.name, 'SortModel', this.gridApi.getSortModel())
          // }
        }
      },
      rowDoubleClicked(params) {
        if(!this.isFinance){
         this.$router.push('./trawSheet/' + params.data.billRecordId + '/see')
        }else{
          this.trawSheetView = true
          this.title = '草单查看'
          this.billRecordId = params.data.billRecordId
          this.openType = 'see'
        }
        // var row = params.data
        // if (this.pageTitle !== '案件管理') {
        //   this.getViewRow(row)
        // } else {
        //   this.takeCaseDetail(row)
        // }
      },
      rowClicked(param) {
        // if (param.node.selected) {
        //   if (param.data[this.getCurFilterId(this.pageTitle)] != this.currentId) {
        //     this.currentId = ''
        //     this.currentCaseId = ''
        //     this.$nextTick(() => {
        //       this.currentId = param.data[this.getCurFilterId(this.pageTitle)]
        //       this.currentCaseId = param.data.caseId
        //       this.caseTypeId = param.data.caseTypeId
        //       this.judgeRank = param.data.judgeRank
        //     })
        //   }
        // }
      },
      getContextMenuItems(params) {
        if (!params.node.data) {
          return []
        }
        return this.getRowContextmenuList(params.node.data).map(item => ({
          name: item.name,
          action: () => {
            this[item.action](params.node.data, params.value)
          }
        }))
      },
      copy(row, value) {
        this.$copyText(value).then(
          res => {
          })
      },
      editFun(row) {
        if(!this.isFinance){
         this.$router.push(`./trawSheet/${row.billRecordId}/edit?opt=2`)
        }else{
          this.trawSheetView = true
          this.title = '草单修改'
          this.billRecordId = row.billRecordId
          this.openType = 'edit'
        }
      },
      delCase(row) {
        this.$confirm('此操作将永久删除该条目, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            billRecordDelete({ billRecordIds: row.billRecordId }).then(res => {
              this.$message.success('删除成功')
              this.getList()
            })
          })
      },
      copyTrawSheet(row) {
        if(!this.isFinance){
         this.$router.push(`./trawSheet/${row.billRecordId}/edit?copyByCase=1`)
        }else{
          this.trawSheetView = true
          this.title = '草单修改'
          this.billRecordId = row.billRecordId
          this.openType = 'edit'
          this.copyTraw = true
        }
      },
      getRowContextmenuList(row) {
        return this.rowContextmenuList.concat([
          { name: '复制', action: 'copy' },
          { name: '复制草单', action: 'copyTrawSheet' },
          { name: '修改', action: 'editFun', permissions: 168 },
          { name: '删除', action: 'delCase', permissions: 169 }
        ]).filter(item => {
          if (item.permissions) {
            if (item.permissions == 168) {
              return this.$store.getters.permissions.includes(item.permissions) && row.tobillStatusStr == '未核销'
            } else if (item.permissions == 169) {
              return this.$store.getters.permissions.includes(item.permissions)
            }
          } else if (item.action == 'pdfPre') {
            // return row.addressList && this.isOrNotPdfPre(row.addressList)
          } else {
            return true
          }
        })
      },
      dragStopped(params) {
        let tableHeader = params.columnApi.columnController.gridColumns.map(item => ({
          label: item.colDef.headerName,
          width: item.actualWidth,
          prop: item.colDef.field
        })).filter(item => item.prop != 'group' && item.prop != 'operation')
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
          }))
          const data = {
            userId: this.userId,
            bussId: 44,
            list2
          }
          savePreference(data).then(res => {

          })
        }
      },
      onGridReady(params) {
        this.gridApi = params.api
        this.columnApi = params.columnApi
        // this.init(1)
      },
      brushRight() {
        // let arr = this.columnDefs.map(item => item.field)
         var arr = Object.keys(this.gridApi.getFilterModel())
        arr.forEach(item => {
          this.gridApi.destroyFilter(item)
        })
      },
      handleCheckboxState() {
        this.checkboxState = !this.checkboxState
      },

      handleSelectionChange(val) {
        this.allselecOffs = val
      },
      handleSelect(key) {
        this.multipleTypeText = key
        // this.editState=true
        this.handleEdit()
      },
      handleEdit() {
        if (this.multipleTypeText == '批量编辑') {
          if (this.getSelectedRows().length) {
            if (this.getSelectedRows().find(i => i.tobillStatusStr === '已核销')) {
              this.$message.error('已核销的草单不能修改！')
              return
            }
            this.showTable = true
            return
          }
          this.$message.error('请选择草单！')
        } else {
          if (this.getSelectedRows().length) {
            this.$confirm('此操作将永久删除该条目, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                billRecordDelete({ billRecordIds: this.getSelectedRows().map(item => item.billRecordId) }).then(res => {
                  this.$message.success('删除成功')
                  this.getList()
                })
              })
          }
        }
      },
      closeTable({billRecordIds = []}) {
        this.showTable = false
        // this.getList()
        this.queryPartData(billRecordIds)
      },
      getList(type) {
        if(typeof type == 'object'){
          const { searchType, searchData } = type
          this.listQuery = Object.assign(this.listQuery, searchData)
        }
        // if (type == "search") {
        //   this.listQuery.pageNo = "1";
        // }
        // this.listLoading = true;
        // let casearr = this.listQuery.caseTypeId;
        // this.listQuery.caseTypeId = this.listQuery.caseTypeId[
        //   this.listQuery.caseTypeId.length - 1
        // ];

        // if(type !== "search"){
        //   for (let key in this.listQuery){
        //     if(!['tobillStatus','pageSize', 'pageNo'].includes(key)){
        //       if(key.includes('Date')){
        //         this.$set(this.listQuery,key,['',''])
        //       } else if(key.includes('Array')) {
        //         this.$set(this.listQuery,key,[])
        //       }else if(key==='caseTypeIds'||key==='deptGroupIds'){
        //         this.$set(this.listQuery,key,[])
        //       }else{
        //         this.$set(this.listQuery,key,null)
        //       }
        //     }
        //   }
        // }else{
        //  for (let key in this.listQuery){
        //    if(['tobillStatus'].includes(key)){
        //      this.$set(this.listQuery,key, null)
        //    }
        //  }
        // }
        if (JSON.parse(localStorage.getItem('queryModuleData'))) {
          var arr = JSON.parse(localStorage.getItem('queryModuleData'))
        } else {
          var arr = []
        }
        if (arr.find(item => item.name == this.$options.name)) {
          arr.find(item => item.name == this.$options.name).queryModuleData = this.listQuery
        } else {
          arr.push({ name: this.$options.name, queryModuleData: this.listQuery })
        }
        localStorage.setItem('queryModuleData', JSON.stringify(arr))
        this.exportQueryModel = JSON.stringify(this.listQuery)
        if (this.listQuery.custId && !this.seletData.custnames.length) {
          queryCustomerNameIdUrl({ custIdArray: this.listQuery.custId, isCustomer: 1 }).then(response => {
            if (response.success) {
              this.seletData.custnames = response.data
            } else {
              this.$message.error(response.message)
            }
          })
        }
        if (this.listQuery.appId && !this.seletData.apps.length) {
          queryApplicantByIdList({ appIdArray: [this.listQuery.appId] }).then(res => {
            // this.$set(this.selectData, 'apps' , res.data)
            this.seletData.apps = res.data
          })
        }
        // this.listQuery.pageSize = this.pageQuery.pageSize
        // this.listQuery.pageNo = this.pageQuery.pageNo
        let data = {
          ...this.listQuery,
          ...this.pageQuery
        }
        queryBillRecordListUrl(this.$commonUtils.cleanNullAttr(data)).then(response => {
          // this.listQuery.caseTypeId = casearr;
          this.list = response.data
          this.total = response.total
          this.currentPageSize = response.data.length
          // this.listLoading = false;
        })
      },
      remotepaternalUnit(query) {
        if (query !== '') {
          queryCustomerNameIdUrl({ keyword: query, isCustomer: 1 }).then(response => {
            if (response.success) {
              this.seletData.custnames = response.data
            } else {
              this.$message.error(response.message)
            }
          })
        }
      },
      changeTextRange(e) {
        this.$set(this.listQuery, 'agentNumEnd', e)
      },
      remotepaternalUnitapp(query) {
        if (query !== '') {
          queryAllUrl({ applicantName: query, orderBy: 1 }).then(response => {
            if (response.success) {
              this.seletData.apps = response.data
            } else {
              this.$message.error(response.message)
            }
          })
        }
      },

      clearSeach() {
        for (var key in this.listQuery) {
          // if (!['officialInformScreen', 'myCase', 'instructionSubmitStatus'].includes(key)) {
          if (key.includes('Date')) {
            this.$set(this.listQuery, key, ['', ''])
          } else if (key.includes('Array')) {
            this.$set(this.listQuery, key, [])
          } else if (key === 'caseTypeIds' || key === 'deptGroupIds') {
            this.$set(this.listQuery, key, [])
          } else {
            this.$set(this.listQuery, key, null)
          }
          // }
        }
        // if (this.$refs.multiCascader) {
        //   this.$refs.multiCascader.forEach(item => {
        //     item.$el.querySelector('.el-input__inner').value = ''
        //   })
        // }
        // this.listQuery = Object.assign({}, defaultData);

        // this.total = "0";
      },
      shSeach() {
        this.listQuery = Object.assign({}, defaultData)
        this.listQuery.billwfStatus = '待组长审核'
        this.getList()
      },
      getselectdata() {
        queryCaseType().then(res => {
          this.caseTypeOptions = res.data // this.getTreeData()
        })
        querywfUserNameUrl().then(response => {
          if (response.success) {
            this.seletData.usernames = response.data
          } else {
            this.$message.error(response.message)
          }
        })
      },

      handledeleElement(item, index) {
        this.$confirm('此操作将永久删除该条目, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            billRecorddeleteUrl({ billRecordId: item.billRecordId }).then(
              response => {
                if (response.success) {
                  const index = this.list.indexOf(item)
                  this.list.splice(index, 1)
                  this.$message({
                    type: 'success',
                    message: '删除成功'
                  })
                } else {
                  this.$message.error(response.message)
                }
              }
            )
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      }
    }
  }
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

  .el-table /deep/ th {
    background-color: #f2f2f2;
    color: #333333;
    text-align: center;
  }

  .el-table /deep/ td {
    padding: 0px;
    text-align: center;
  }

  .iconBtn {
    font-size: 20px;
  }

  /deep/ .el-cascader {
    width: 100%;
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

  .form-container /deep/ {
    padding-bottom: 10px;

    .el-form-item__label {
      text-align: left;
      padding-left: 32px;
      font-weight: normal;
      float: left;
    }

    .el-form-item__content {
      display: flex;

      input {
        border-top: 0;
        border-left: 0;
        border-radius: 0;
        border-right: 0
      }
    }
  }

  .DataPicker /deep/ {
    line-height: 28px;

    .el-input__prefix {
      display: none;
    }

    .el-input__inner {
      text-align: left;
      padding-left: 15px;
      padding-right: 18px;
      // padding-left: 10px;
    }
  }

  .content_wrap {
    width: 100%;
    display: flex;

    .left_wrap {
      position: relative;
      transition: all 0.5s;
      //   width: 40%;
    }

    .right_wrap {
      box-shadow: 0px 0px 18px 0px rgba(64, 158, 255, 0.5);
      height: 598px;
      /*overflow: auto;*/
      overflow: hidden;
      transition: all 0.5s;
      flex: 1;

      /deep/ * {
        font-size: 12px !important;
      }

      // width: 60%;
      /deep/ .sectionWrap {
        padding: 0 !important;
        padding-left: 10px !important;
        // padding-bottom: 350px!important;
        .ElectronWrap {
          padding: 0 !important;
        }
      }
    }
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

  .brush_right {
    position: absolute;
    right: 6px;
    z-index: 1;
    top: -4px;
  }

  .checkbox {
    position: absolute;
    left: 0px;
    top: 88px;
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

  > > > .content-center {
    .el-form-item__content {
      height: 28px;
      display: flex;
      align-items: center;
      /*justify-content: center;*/
    }
  }

  .tables {
    div {
      border: 1px solid #ccc;
      border-top: none;
      text-align: center;
    }
  }

  .table-head {
    text-align: center;
    background-color: #f7f7f7;
    cursor: not-allowed !important;
  }

  > > > .el-textarea__inner {
    word-break: keep-all;
  }

  > > > .el-autocomplete-suggestion {
    width: 500px !important;
  }

  .overflow-hidden {
    overflow: hidden;
    width: 100%;
    display: inline-block;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
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
  .ViewsSwitching {
    position: absolute !important;
    right: 0;
    z-index: 100;
    top: -40px;
  }
</style>

