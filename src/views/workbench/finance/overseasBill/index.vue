<template>
  <div style="margin: 0">
    <MyTabs ref="myTabs" class="MyTabs" :page-title="pageTitle" :identification="identification"
            :defaultColumnDefs="columnDefs" style="position: absolute" @editableTab="editableTab"
            :class="myTabsActivity?'activity':''" v-if="pageTitle=='境外账单' && !isFinance"></MyTabs>
    <div v-if="!isFinance" class="buttonWrap" style="margin-bottom: 10px">
      <el-button-group class="button-group-search" v-clickoutside="clickoutside">
        <el-button id="mySearch" style="margin-right:0" type="primary" size="small" @click="handleSearch(0)">搜索
        </el-button>
        <el-button type="primary" class="searchRight" size="small" icon="el-icon-arrow-down"
                   @click.stop.prevent="drawerState=true"></el-button>
        <transition name="show" mode="out-in">
          <div class="searchWrap" id="searchWrap" v-show="drawerState">
            <el-form size="mini" label-width="120px" class="form-container" @keyup.enter.native="handleSearch(0)"
                     style="margin-top: 2px">
              <el-form-item :label="item.filterName+':'"
                            :class="item.filterType==='radio'&&item.values.length>3?'fullItem':'postInfo-container-item'"
                            v-for="item,index in conditionsModuleList" :key="index">

                <el-select v-model="queryModuleData[item.property]" placeholder="请选择" v-if="item.filterType==='select'"
                           filterable clearable>
                  <el-option v-for="itm in item.values" :key="itm.id" :label="itm.value" :value="itm.id">
                  </el-option>
                </el-select>
                <!--<el-checkbox-group style="display:flex" v-model="queryModuleData[item.property]" v-if="item.filterType==='checkbox'">-->
                <!--<el-checkbox v-for="itm in item.values" :label="itm.value" :key="itm.id">{{itm.value}}</el-checkbox>-->
                <!--</el-checkbox-group>-->
                <el-select v-if="item.filterType==='checkbox'&&item.values&&item.values.length"
                           v-model="queryModuleData[item.property]" multiple placeholder="请选择" filterable clearable
                           @change="(e)=>checkBox(e,item.property,item.values)">
                  <el-option v-for="itm in item.values" :key="itm.id" :label="itm.value" :value="itm.id">
                  </el-option>
                </el-select>
                <el-select v-if="item.filterType==='selectMany'" v-model="queryModuleData[item.property]" filterable
                           remote clearable reserve-keyword placeholder="请输入关键词" :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName);
            }">
                  <el-option v-for="itm in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
                  </el-option>
                </el-select>
                <el-select v-if="item.filterType==='selectMultipleMany'" multiple
                           v-model="queryModuleData[item.property]" filterable remote clearable reserve-keyword
                           placeholder="请输入关键词" :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName);
            }">
                  <el-option v-for="itm in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
                  </el-option>
                </el-select>
                <el-select v-if="item.filterType==='selectTableMany'" v-model="queryModuleData[item.property]"
                           filterable remote clearable reserve-keyword placeholder="请输入关键词" :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName); }">
                  <el-option disabled label="" value="">
            <span
              v-for="(itmx,key) in getAppTitleList(item.filterName,item['valueList']?item['valueList'][0]:undefined)"
              v-if="key!='id'">
            {{itmx}}
            </span>
                  </el-option>
                  <el-option v-for="itm,idx in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
                    <el-tooltip v-for="itmx,key in item['valueList'][idx]" v-if="key!='id'" class="item" effect="light"
                                :content="itmx" placement="top">
                      <span>{{itmx}}</span>
                    </el-tooltip>
                  </el-option>
                </el-select>
                <el-select v-if="item.filterType==='selectTableMultipleMany'" v-model="queryModuleData[item.property]"
                           multiple filterable remote clearable reserve-keyword placeholder="请输入关键词" :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName); }">
                  <el-option disabled label="" value="">
            <span
              v-for="(itmx,key) in getAppTitleList(item.filterName,item['valueList']?item['valueList'][0]:undefined)"
              v-if="key!='id'">
            {{itmx}}
            </span>
                  </el-option>
                  <el-option v-for="itm,idx in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
                    <el-tooltip v-for="itmx,key in item['valueList'][idx]" v-if="key!='id'" class="item" effect="light"
                                :content="itmx" placement="top">
                      <span>{{itmx}}</span>
                    </el-tooltip>
                  </el-option>
                </el-select>
                <el-select v-if="item.filterType==='selectTable'" v-model="queryModuleData[item.property]" filterable
                           clearable placeholder="请选择">
                  <el-option v-for="itm ,idx in item.values" :key="idx" :label="itm.value" :value="itm.id"
                             :disabled="itm.id==-1">
                    <span v-for="itmx ,key in item['values'][idx]" v-if="key!='id'">{{itmx}}</span>
                  </el-option>
                </el-select>
                <el-radio-group v-model="queryModuleData[item.property]" v-if="item.filterType==='radio'">
                  <el-radio :label="itm.id" v-for="itm,index in item.values" :key="index">{{itm.value}}</el-radio>
                </el-radio-group>
                <el-input clearable v-model="queryModuleData[item.property]" :placeholder="'请输入'+item.filterName"
                          v-if="item.filterType==='text'"></el-input>
                <el-input clearable v-model="queryModuleData[item.property]" :placeholder="'请输入'+item.filterName"
                          type="textarea" v-if="item.filterType==='textarea'"></el-input>
                <el-input clearable v-model="queryModuleData[item.property.split(',')[0]]"
                          :placeholder="'请输入'+item.filterName" v-if="item.filterType==='textRange'"
                          @change="(string)=>changeTextRange(string,index,item.property)"></el-input>
                <span v-if="item.filterType==='textRange'" v-show="item.property.includes(',')">至</span>
                <el-input clearable v-model="queryModuleData[item.property.split(',')[1]]"
                          :placeholder="'请输入'+item.filterName" v-if="item.filterType==='textRange'"></el-input>
                <DataPicker class="DataPicker" v-if="item.filterType==='date'"
                            v-model="queryModuleData[item.property]"></DataPicker>
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
                  v-model="queryModuleData[item.property]"></el-multi-cascader>
                <!--                  <el-cascader :change-on-select="true" :show-all-levels="false" v-if="item.filterType==='cascader'" collapse-tags filterable clearable v-model="queryModuleData[item.property]"-->
                <!--                               :options="item.values" :props="defaultParams" placeholder="请选择"></el-cascader>-->
              </el-form-item>
            </el-form>
            <div class="clearWrap" v-if="drawerState" id="clearWrap">
              <el-popover
                placement="top"
                width="300"
                v-model="addFilterState">
                <div>过滤器名称</div>
                <div>
                  <el-input type="text" v-model="schemeName"></el-input>
                </div>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="addFilterState = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="addFilterScheme(2)">确定</el-button>
                </div>
                <el-button size="mini" slot="reference"><span>保存</span></el-button>
              </el-popover>

              <el-button size="mini" @click="() => {clearSearch(this)}"><span>重置</span></el-button>
              <el-button type="primary" size="mini" @click="handleSearch(0)">搜索</el-button>
            </div>
            <el-button style="position:absolute;top: 10px;right: 10px" type="text" size="small" @click="queryFilter"><i
              class="el-icon-s-tools"></i>更多
            </el-button>
          </div>
        </transition>
      </el-button-group>
      <!--      <el-dropdown @command="selectionList" v-if="$store.getters.permissions.includes(218)">-->
      <!--        <el-button type="primary"  size="small"  >-->
      <!--          批量操作<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
      <!--        </el-button>-->
      <!--        <el-dropdown-menu slot="dropdown">-->
      <!--          <el-dropdown-item command="费用提交" v-if="$store.getters.permissions.includes(219)">费用提交</el-dropdown-item>-->
      <!--          <el-dropdown-item command="报销人所属组审核" v-if="$store.getters.permissions.includes(220)">报销人所属组审核</el-dropdown-item>-->
      <!--          <el-dropdown-item command="承担组审核" v-if="$store.getters.permissions.includes(221)">承担组审核</el-dropdown-item>-->
      <!--          &lt;!&ndash;          <el-dropdown-item command="编辑">编辑</el-dropdown-item>&ndash;&gt;-->
      <!--          <el-dropdown-item command="改签">改签</el-dropdown-item>-->
      <!--        </el-dropdown-menu>-->
      <!--      </el-dropdown>-->
      <!--      <el-button type="primary" size="mini" @click="selectionList(1)">批量操作</el-button>-->
      <el-button v-allow="229" type="primary" size="small" @click="$router.push('addOverseasBill/1')">新建</el-button>
      <el-button v-allow="229" type="primary" size="small" @click="toExamine('提交')">提交</el-button>
      <!--      <el-button v-allow="" type="primary"  size="small"  @click="toExamine('财务初审')" >财务初审</el-button>-->
      <el-menu class="el-menu-demo" mode="horizontal" @select="(e)=>toExamine(e)"
               v-if="$store.getters.permissions.includes(229)">
        <el-submenu index="1">
          <template slot="title">财务初审</template>
          <el-menu-item index="财务初审通过">通过</el-menu-item>
          <el-menu-item index="财务初审退回">退回</el-menu-item>
        </el-submenu>
      </el-menu>
      <el-button v-allow="229" type="primary" size="small" @click="toExamine('支付')">支付</el-button>
      <el-button v-allow="229" type="primary" size="small" @click="toExamine('费用复审')">费用复审</el-button>
      <el-button type="primary" size="small" @click="batchPayAbroad">设置\取消同批付款</el-button>
    </div>
    <el-form v-if="!isFinance">
      <el-form-item label="流程状态:" label-width="130px">
        <el-radio-group v-model="queryModuleData.wfStatus" @change="handleSearch(1)">
          <el-radio v-for="item in feeWfstatusList" :label="item">{{item}}</el-radio>
          <el-radio label="">全部</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div style="display: flex;position: relative">
      <TitleTotal :total="total" :currentPageSize="currentPageSize"/>
      <!--      <div class="button_wrap" v-if="selectionState">-->
      <!--        <el-button class="exactButton" size="small"  type="primary" @click="jumpDetailSubmisson">{{multipleTypeText}}</el-button>-->
      <!--        <el-button v-if="multipleTypeText=='财务初审'" class="exactButton" size="small"  type="primary"  @click="doAbroadBillTask(0,1)">退回</el-button>-->
      <!--        <el-button class="exactButton"  size="mini" @click="selectionState=false">取消</el-button>-->
      <!--      </div>-->
      <div
        style="cursor:pointer;position: absolute;display:flex;align-items:center;right: 0;bottom:-6px;font-size: 14px;padding-right: 6px">
        <el-button type="text" @click="exportList(2)">导出</el-button>
        <span style="color: #52A2F4;margin: 0 5px"> / </span>
        <el-button type="text" @click="exportList(1)">全局导出</el-button>
        <!--        <el-button type="text"  @click="exportList(1)"><i class="el-icon-download">导出</i></el-button>-->
        <!--        <img @click="exportList(2)" src="@/assets/moon.png" style="width: 16px;height: 16px" width="16" alt="">-->
      </div>
      <!--    <el-button type="text" style="position: absolute;right: 0;bottom:-6px;font-size: 14px;padding-right: 6px" @click="selectionList('导出')"><i class="el-icon-download">导出</i></el-button>-->
    </div>
    <div class="w-table">
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
                 :rowData="feeList"
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
                 @drop.native.stop.prevent="enentDrop($event)"
                   @dragover.native.stop.prevent="hoverState=true"
                   @dragleave.native.stop.prevent="hoverState=false"
                   @dragenter.native.stop.prevent="hoverState=true"
                 :localeText="$store.state.caseInformation.localeText"
                 :suppressDragLeaveHidesColumns="true"
                 :suppressMakeColumnVisibleAfterUnGroup="true"
                 rowGroupPanelShow="always"
                 :groupSelectsChildren="true"
                 :suppressAggFuncInHeader="true"
                 :autoGroupColumnDef="autoGroupColumnDef"
                 :rowHeight="isFinance ? $commonUtils.getRowHeight() : 28"
                 :pinnedBottomRowData="pinnedBottomRowData"

      >
      </AgGridVue>
      <div class="checkbox" v-show="checkboxState">
        <el-select ref="checkCaseSelect" v-model="checkCaseList" multiple reserve-keyword filterable placeholder="请选择"
                   collapse-tags :popper-append-to-body="false" @visible-change="handleChange"
                   :filter-method="filterCheck">
          <template slot="">
            <div class="checkbox_bottom">
              <el-button size="mini" round @click.stop="delPreference(1)">恢复默认</el-button>
              <el-button style="margin-right: 3px" size="mini" round @click.stop="savePreference(1)">保存设置</el-button>
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


    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNo"
      :limit.sync="listQuery.pageSize"
      @pagination="queryAbroadList"
      :pageSizes="pageSizesList"
    />
    <el-dialog title="提示" :visible.sync="transferVisible" width="80%">
      <el-transfer v-model="transferValue" @left-check-change="leftCheckChange" :key="transferData.filterId"
                   :data="transferData" filterable filter-placeholder="请输入搜索内容"
                   :titles="['选择筛选项—全部案件', '已选']">
      </el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="transferVisible = false">取 消</el-button>
        <el-button type="primary" @click="configFilter">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="文件导入" :visible.sync="patchImportVisible">
      <div class="el-radio-wrap">
        <el-radio v-model="uploadOrDownload" label="1">下载模板</el-radio>
        <el-radio v-model="uploadOrDownload" label="2">
          <el-upload
            class="upload-patchimprot"
            ref="uploadExcel"
            :action="uploadExcelFile"
            :file-list="fileList"
            :auto-upload="false"
            accept=".xlsx"
            :limit="1"
            :on-change="postFileChange"
            :before-remove="postFileRemove"
            :on-success="handleSuccess"
            :data="postFileData"
          >
            <span slot="trigger" style="">导入Excel文件</span>
            <el-button
              slot="trigger"
              size="small"
              type="primary"
              v-show="uploadButtonState"
              >上传</el-button
            >
          </el-upload>
        </el-radio>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeLoadType">确 定</el-button>
        <el-button @click="patchImportVisible = false">取 消</el-button>
      </span>
      <a id="exceldown" href="/ipdoc/material/template/批量登记境外账单Excel.xlsx"
        >123456</a
      >
    </el-dialog>
    <SelectOption
      :buss-id="bussId"
      v-if="selectionOptionState"
      :dialog-visible="selectionOptionState"
      @cancel="closeDialogSelectOption"
      :idArray="getCurrentRowsData('abroadBillId')"
      :defaultMultipleSelect="tableDefaultList.map(i=>i.title)"
      :exportType="exportType"
      :exportQueryModel="exportQueryModel"></SelectOption>
    <EmitSearch @undateSearch="undateSearch"></EmitSearch>

<!--    复制境外账单-->
    <el-dialog
      v-if="copyForm.addAbroadBillView"
      title="账单数量"
      :visible.sync="copyForm.addAbroadBillView"
      width="30%"
    >
      <div class="fl-ac-jc">
        <el-input size="small" style="width: 200px" type="number" placeholder="请输入复制费用数量" v-model="copyForm.copyNum"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
      <el-button size="mini" @click="() => {copyForm = {
          abroadBillId: '',
          addAbroadBillView: false,
          copyNum: 1
        }}">取 消</el-button>
      <el-button size="mini" type="primary" @click="submitCopyAbroadBill">确 定</el-button>
    </span>
    </el-dialog>
    <!--    文件上传-->
    <el-dialog
      v-dialogDrag
      center
      top="0"
      height="852"
      :visible.sync="uploadProofreadingState"
      width="50%"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
    >
      <UploadProofreading v-if="uploadProofreadingState" upType="overseasBill"  @cancel="()=>{this.uploadProofreadingState = false}" :defaultCaseList="getSelectedSortRows()" :filelist="curFile"></UploadProofreading>
    </el-dialog>

    <!--    批量编辑-->
    <Willtable v-if="showTable" :showTable="showTable" :abroadBillIds="abroadBillIds"
               plType="境外账单" @closeTable="closeTable"></Willtable>
    <!--  <SelectOption :buss-id="14" v-if="selectionOptionState&&multipleSelection.map(item=>item['feeId']).length" :dialog-visible="selectionOptionState" @cancel="closeSelect" :idArray="multipleSelection.map(item=>item['feeId'])"  ></SelectOption>-->
  </div>
</template>

<script>
  import { downLoadAll, getLanglist } from '@/utils'
  import MyTabs from '@/views/workbench/case/components/MyTabs'
  import SelectOption from '@/views/workbench/case/components/SelectOption.vue'
  import Pagination from '@/components/Pagination'
  import {
    queryFeeList,
    queryFeeTypeList,
    deleteFee,
    endorseFee,
    submitFee,
    batchDoFeeTask,
    checkFeeTasker,
    queryEndorseTasker,
    queryFeeTaskDefine,
    queryFeeSum
  } from '@/api/feeList'
  import {
    queryAbroadList,
    deleteAbroadBill,
    batchPayAbroadBill,
    copyAbroadBill,
  } from '@/api/billApi.js'
  import { uploadExcelFile } from "@/api/ipServiceApi.config.js";
  import {
    queryCustomerNameId,
    selectColumn,
    queryPreference,
    savePreference,
    configFilter,
    queryFilterConfig,
    queryFilter,
    addFilterScheme,
    delPreference,
    queryApplicantByIdList,
    doAbroadBillTask,
    checkPermission,
    downloadBatchFile
  } from '@/api/caseList.js'
  import { queryAllUrl, createAbroadBillTemplate, createAbroadBillFee } from '@/api/billApi'
  import { formatAmount } from '@/utils/filters'
  import Willtable from '../../../../components/Willtable/index'
  import UploadProofreading from '@/views/workbench/case/components/UploadProofreading'
  import jsFileDownload from 'js-file-download'
  import axios from 'axios'

  export default {
    name: 'index',
    props: {
      isFinance: {
        type: Boolean,
        default: false
      },
      ctx: {}
    },
    data() {
      var tableHeader = []
      if (localStorage.getItem('tableHeader') && JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name + this.$route.name)) {
        tableHeader = JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name + this.$route.name).tableHeader
      }
      return {
        abroadBillIds: [],
        copyForm: {
          abroadBillId: '',
          addAbroadBillView: false,
          copyNum: 1
        },
        exportType: 1,
        showTable: false,
        gridApi: {},
        operationState: 0,
        myTabsActivity: false,
        pageTitle: this.$route.meta.title,
        identification: 'indexoverseasBill',
        drawerState: false,
        selectionState: false, // 筛选递交复选框
        total: 0,
        loading: false,
        listLoading: false,
        feeList: [],
        feetList: [],
        queryModuleData: { // 查询条件

        },
        tableHeader,
        selectionOptionState: false,
        multipleTypeText: '确定',
        defaultParams: {
          value: 'feetId',
          label: 'feeName',
          checkStrictly: true,
          children: 'feeTypes'
        },
        listQuery: {
          pageNo: 1,
          pageSize: JSON.parse(localStorage.getItem('pageSize')) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name).pageSize : 10 : 10
        },
        pageSizesList: [10, 50, 200, 500, 1000, 5000, 10000],
        tableDefaultList: [{ 'label': '费用类型', 'prop': 'feeName' }, {
          'label': '总金额',
          'prop': 'total'
        }, { 'label': '案件文号', 'prop': 'showRefno' }, { 'label': '客户', 'prop': 'name' }, {
          'label': '报销人',
          'prop': 'bxfullname'
        }, { 'label': '报销人所属工作组', 'prop': 'bxgroupname' }, {
          'label': '费用承担工作组',
          'prop': 'groupName'
        }, { 'label': '填报人', 'prop': 'fullname' }, { 'label': '任务人', 'prop': 'tasker' }, {
          'label': '费用状态',
          'prop': 'wfStatus'
        }],
        customerNameIdList: [],
        feeTypeList: [],
        userList: [],
        deptByConditionList: [],
        workgroupNamesList: [],
        feeWfstatusList: ['待提交', '待财务初审', '待支付', '待费用复审'],
        endorseTaskerList: [],
        endorseTaskerState: false,
        endorseTasker: '',
        exportQueryModel: '',
        filterText: '',
        userId: this.$store.getters.userId,
        bussId: 16,
        conditionsModuleList: [],
        schemeName: '',
        addFilterState: false,
        checkCaseList: [],
        checkboxState: false,
        selectColumnList: [],
        transferVisible: false, // 配置筛选条件框
        transferData: [], // 筛选条件数据
        transferValue: [], // 当前筛选条件id
        multipleSelection: [],
        currentPageSize: 0,
        curFile:[],
        uploadProofreadingState: false,
        defaultcolumnDefs: [
          {
            headerName: '序号',
            field: 'sid',
            width: 80,
            enableRowGroup: true,
            // enablePivot: true,
            cellRenderer: this.cellRenderer,
            floatingFilter: true,
            filter: false,
            cellClass: 'vAlign',
            suppressMenu: true,
            checkboxSelection: false,
            headerCheckboxSelection: false,
            headerCheckboxSelectionFilteredOnly: true,
            hoverState:false,
            cellStyle: function(params) {
              const expectedPaymentDate = params.data.expectedPaymentDate
              const givenDate = new Date(expectedPaymentDate);
              const currentDate = new Date();
              const currentYear = currentDate.getFullYear();
              const currentMonth = currentDate.getMonth(); // 注意：getMonth() 返回的是 0-11 的值
              const givenYear = givenDate.getFullYear();
              const givenMonth = givenDate.getMonth();
              // 判断是否为当月或之前：年份小于当前年份，或者年份相同但月份小于等于当前月份
              const isMonthSameOrBefore = givenYear < currentYear || (givenYear === currentYear && givenMonth <= currentMonth);
              if (isMonthSameOrBefore&&!params.data.payDate &&expectedPaymentDate) {
                return { color: '#FB1E1E' }
              }
            }
          }
        ],
        columnDefs: [],
        brushRightHasFilter: false,
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
        uploadOrDownload: "1",
        patchImportVisible: false,
        uploadExcelFile,
        fileList:[],
        uploadButtonState: true,
        postFileData: {
          // 上传文件数据
          tokenID: this.$store.state.user.token
        },
      }
    },
    created() {
      // this.queryWorkgroupNames()
      // this.queryFeeTypeList()
      // this.queryDeptByCondition()
      // this.queryUsers()
      // this.queryFeeTaskDefine()
      // this.getDefaultTableHeader()
      this.getAllWfs()
      !this.isFinance && this.queryFilterConfig(1)
    },
    methods: {
      handleSuccess(res){
        if (res.success) {
          this.queryAbroadList()
          this.patchImportVisible = false;
          this.fileList = []
          this.postFileRemove()
          if (res.message) {
            const messageList = res.message.split(/\/n/);
            let messages = ''
            messageList.map((item,index) => {
              if (messageList.length==index+1) {
                messages+= `<p style='panding:5px'>${item}</p>`
              }else{
                messages+= `<p style='panding:5px;margin-bottom:8px'>${item}</p>`
              }
            })
            this.$message({
              type: "warning",
              duration: 5000,
              dangerouslyUseHTMLString: true,
              message: messages,
            });
          }
        }
      },
      postFileChange(file, fileList) {
        this.uploadButtonState = false;
      },
      postFileRemove() {
        setTimeout(() => {
          this.uploadButtonState = true;
        }, 500);
      },
      changeLoadType(){
        if (this.uploadOrDownload === "1") {
          document.getElementById("exceldown").click();
          this.patchImportVisible = false;
        }else{
          if (this.uploadButtonState) {
            return this.$message.error('请选择文件')
          }
          this.$refs.uploadExcel.submit();
        }
      },
      async downloadBatchFiles(type){
        const params = {
          whetherMergePdf:type,
          abroadBillIdList:this.getSelectedSortRows().map(item=>item.abroadBillId)
        }
        const res = await downloadBatchFile(params);
        // if (res.data&&res.data.length) {
        //   res.data.forEach(item=>{
        //     downLoadAll({url:`ipdoc${item}`})
        //   })
        // }
        if (res.data && res.data.length) {
          for (const item of res.data) {
            await this.downloadWithDelay(`ipdoc${item}`);
          }
        }else{
          this.$message.error('暂无文件')
        }
      },
      downloadWithDelay(url, delay = 1000) {
        return new Promise((resolve, reject) => {
          this.downloadPathch({ url })
            .then(() => {
              setTimeout(() => {
                resolve()
              }, delay)
            })
            .catch(error => reject(error));
        });
      },
      async downloadPathch(data){
        return new Promise((resolve, reject) => {
          axios.get(data.url, {
            responseType: 'blob', headers: {
              'Content-Type': 'application/json; charset=utf-8'
            },
          }).then((res)=>{
              jsFileDownload(res.data, data.url.split('/')[data.url.split('/').length - 1])
            resolve()
          }).catch(()=>{
            reject()
          })
        });
      },
      downloadBills() {
        if (!this.getSelectedSortRows().length) {
          this.$message.error('请选择境外账单')
          return;
        }
        this.$confirm('是否需要合并境外账单?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.downloadBatchFiles(1)
        }).catch(() => {
          this.downloadBatchFiles(0)
        })
      },
      patchimport(){
        this.patchImportVisible = true
      },
      handleSelect(){
        if (!this.getSelectedSortRows().length) {
          this.$message.error('请选择需要匹配的境外账单')
          return;
        }
        if(!this.curFile.length){
          this.$message.error('请上传文件')
          return
        }
        if (this.curFile.length != this.getSelectedSortRows().length) {
          this.$message.error('文件与发票数量不同')
          return
        }
        this.uploadProofreadingState = true
        return;
      },
      enentDrop(e){
        e.stopPropagation();
        e.preventDefault();
        this.hoverState=false
        if (e.dataTransfer.files) {
          this.curFile = e.dataTransfer.files
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
      createModel(type, item) {
        if (!this.getSelectedRows().length) {
          this.$message.error('请选择境外账单')
          return
        }
        createAbroadBillTemplate({
          code: item.code,
          abroadBillIds: this.getSelectedRows().map(item => item.abroadBillId)
        }).then(res => {
          this.$message.success('模板生成成功!')
          res.data && downLoadAll({
            url: `ipdoc${res.data.address}`, success: () => {
              this.$message.success(res.message)
            }
          })
          // this.handleSearch()
        })

      },
      batchEdit() {
        checkPermission({abroadBillIdList: this.gridApi.rowModel.rootNode.childrenAfterSort.filter(item =>item.selected).map(item => item.data).map(item => item.abroadBillId)}).then(res => {
          this.isModList = res.data.map((item, index) => ({abroadBillId: item.abroadBillId, idx: index + 1, modify: item.modify})).filter(item => item.modify) || []
          this.notModList = res.data.map((item, index) => ({abroadBillId: item.abroadBillId, idx: index + 1, modify: item.modify})).filter(item => !item.modify) || []
          if (this.notModList.length) {
            let notice = ''
            if (this.isModList.length) {
              notice = `已选境外账单中, 第${this.notModList.map(item => item.idx)}条您没有权限修改, 是否继续?`
              this.$confirm(notice, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              }).then(() => {
                if (this.isModList.length) {
                  this.abroadBillIds = this.isModList.map(item => item.abroadBillId)
                  this.showTable = true

                } else {

                }
              }).catch(() => {

              })
            } else {
              this.$message.error('您没有权限修改所选境外账单！')
              // notice = '所选境外账单您无法修改！'
            }
          } else {
            this.abroadBillIds = this.isModList.map(item => item.abroadBillId)
            this.showTable = true
          }
        })
        // checkPermission({ abroadBillIdList: this.getSelectedRows().map(item => item.abroadBillId) }).then(res => {
        //   // if (res.data.modify) {
        //   //   this.edit(row)
        //   // } else {
        //   //   this.$message.error('您没有权限修改所选境外账单！')
        //   // }
        // })
      },
      submitCopyAbroadBill(){
        if (this.copyForm.copyNum < 0) {
          this.$message.error('案件数量必须大于0')
          return
        }
        copyAbroadBill(this.copyForm).then(res => {
          if (this.copyForm.copyNum == 1) {
            this.edit(res.data)
            this.copyForm = {
              abroadBillId: '',
              addAbroadBillView: false,
              copyNum: 1
            }
          } else if (this.copyForm.copyNum > 1) {
            this.$message.success('复制境外账单成功，请到“待提交”中查看。')
            this.queryModuleData.wfStatus == '待提交' && this.queryAbroadList()
            this.copyForm = {
              abroadBillId: '',
              addAbroadBillView: false,
              copyNum: 1
            }
          }
        })
      },
      getCurrentRowsData(key) {
        if (this.gridApi && this.gridApi.rowModel) {
          return this.gridApi.rowModel.rootNode.childrenAfterSort.map(item => item.data).map(item => item[key])
        }
        return []
      },
      closeTable() {
        this.showTable = false
        this.queryAbroadList()
      },
      exportModel() {
        createAbroadBillTemplate({
          abroadBillIds: this.getSelectedRows().map(item => item.abroadBillId)
        }).then(res => {
          res.data && downLoadAll({
            url: `ipdoc${res.data.address}`, success: () => {
              this.$message.success(res.message)
            }
          })
          // window.location.href = `ipdoc${res.data.address}`
        })
        //  window.location.href = `ipdoc${res.data.address}`

      },
      createFee() {
        createAbroadBillFee({
          idArray: this.getSelectedRows().map(item => item.abroadBillId)
        }).then(res => {
          this.$message.success(res.message)
          this.queryAbroadList()
        })
      },
      batchPayAbroad() {
        if (!this.getSelectedRows().length) {
          this.$message.error('请选择境外账单！')
          return
        }
        batchPayAbroadBill({
          billIdList: this.getSelectedRows().map(i => i.abroadBillId),
          checkFlag: 1
        }).then(res => {
          if (res.messageType == 100) {
            this.$confirm(
              res.message,
              '提示',
              {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }
            ).then(() => {
              batchPayAbroadBill({
                billIdList: this.getSelectedRows().map(i => i.abroadBillId),
                checkFlag: 0

              }).then(res => {
                if (res.data) {
                  this.$confirm(
                    this.$createElement('div', {}, [
                      this.$createElement('p', {}, `同批境外账单号: ${res.data.batchAbroadNo}`),
                      this.$createElement('p', {}, `同批付款金额: ${res.data.batchPayMoney}`)
                    ]),
                    '提示',
                    {
                      type: 'success',
                      showCancelButton: false
                    }
                  )
                }
                this.queryAbroadList()
              })
            }).catch(err => {

            })
          }
        })
      },
      undateSearch(n) {
        if (this.bussId == n.bussId) {
          this.queryModuleData = JSON.parse(n.value)
          this.handleSearch(0)
          this.queryFilterConfig()
        }
      },
      getAllWfs() {
        const data = {
          userId: this.userId,
          bussId: this.bussId
        }
        Promise.all([selectColumn(data), queryPreference(data)]).then(res => {
          this.selectColumnList = res[0].data

          this.preferenceList = res[1].data
          this.tableHeader = this.preferenceList.map(item => ({
            label: item.title,
            prop: item.value,
            width: this.getLoactionWidth(item.title)
          }))
          this.columnDefs = [...this.defaultcolumnDefs, ...this.preferenceList.map(item => ({
            headerName: item.title,
            field: item.value,
            width: this.getLoactionWidth(item.title) == 'auto' ? 200 : this.getLoactionWidth(item.title),
            resizable: true,
            sortable: true,
            filter: 'agSetColumnFilter',
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            cellRenderer: this.cellRenderer,
            enableRowGroup: true,
            filterParams: {
              comparator: (a, b) => {
                return this.$commonUtils.sort(a, b, item.value)
              }
            },
            cellStyle: function(params) {
              const expectedPaymentDate = params.data.expectedPaymentDate
              const givenDate = new Date(expectedPaymentDate);
              const currentDate = new Date();
              const currentYear = currentDate.getFullYear();
              const currentMonth = currentDate.getMonth(); // 注意：getMonth() 返回的是 0-11 的值
              const givenYear = givenDate.getFullYear();
              const givenMonth = givenDate.getMonth();
              const isMonthSameOrBefore = givenYear < currentYear || (givenYear === currentYear && givenMonth <= currentMonth);
              if (isMonthSameOrBefore&&!params.data.payDate&&expectedPaymentDate) {
                return { color: '#FB1E1E' }
              }
            }
          }))]
          this.$nextTick(() => {
            this.columnDefs.forEach(item => {
              this.columnApi.getColumn(item.field).addEventListener('menuVisibleChanged', () => {
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
                let data = this.$commonUtils.getFilterModel(this.$options.name+this.$route.name,'FilterModel')
                let arr = Object.keys(data)
                if(this.columnDefs.map(itm => itm.field).diff(arr).includes(item.field)){
                  this.gridApi.getFilterInstance(item.field).selectNothing()
                }
              })
            })
          })
          this.saveLocation()
          this.checkCaseList = this.preferenceList.map(item => item.value)
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

        })
      },
      cellRenderer(params) {
        if (params.node.rowPinned == 'bottom') {
          return `<span title="${params.value}" style="float: right">${(params.value || params.value === 0) ? params.value : ''}</span>`
        }
        if (params.colDef.field == 'sid') {
          return params.rowIndex + 1
        } else if (Object.prototype.toString.call(params.value).includes('Number')) {
          return `<span title="${params.value}" style="float: right">${formatAmount(params.value)}</span>`
        }
        return `<span title="${params.value}">${params.value ? params.value : ''}</span>`
      },
      getLoactionWidth(label) {
        if (!localStorage.getItem('tableHeader')) {
          return 'auto'
        } else {
          var arr = JSON.parse(localStorage.getItem('tableHeader'))
          if (arr.find(item => item.name == this.$options.name + this.$route.name)) {
            var header = arr.find(item => item.name == this.$options.name + this.$route.name).tableHeader
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
      rowDoubleClicked(params) {
        var row = params.data
        if (this.isFinance) {
          this.ctx.seeFun(row.abroadBillId)
        } else {
          this.$router.push(`seeOverseasBill?abroadBillId=${row.abroadBillId}`)
        }
      },
      changeSelection(n) {
        if (n) {
          this.columnDefs.find(item => item.field == 'sid').checkboxSelection = function(params) {
            // we put checkbox on the name if we are not doing grouping
            return params.columnApi.getRowGroupColumns().length === 0
          },
            this.columnDefs.find(item => item.field == 'sid').headerCheckboxSelection = function(params) {
              // we put checkbox on the name if we are not doing grouping
              return params.columnApi.getRowGroupColumns().length === 0
            }
          this.columnDefs.push({})
          this.columnDefs.pop({})
        } else {
          this.columnDefs.find(item => item.field == 'sid').checkboxSelection = false
          this.columnDefs.find(item => item.field == 'sid').headerCheckboxSelection = false
          this.columnDefs.push({})
          this.columnDefs.pop({})
        }
      },
      editableTab(data) {
        if (data && data != 0) {
          this.myTabsActivity = true
        } else {
          this.myTabsActivity = false
        }
      },
      getSelectedRows() {
        if (this.gridApi.getSelectedNodes) {
          const selectedNodes = this.gridApi.getSelectedNodes()
          const selectedData = selectedNodes.map(node => node.data)
          return selectedData
        }
        return []
      },
      onGridReady(params) {
        this.gridparams = params
        this.gridApi = params.api
        this.columnApi = params.columnApi

      },
      dragStopped(params) {
        let tableHeader = params.columnApi.columnController.gridColumns.map(item => ({
          label: item.colDef.headerName,
          width: item.actualWidth,
          prop: item.colDef.field
        })).filter(item => item.prop != 'sid' && item.prop != 'group')
        this.tableHeader = tableHeader
        this.changeHeader(tableHeader)
        this.saveLocation()
      },
      saveLocation() {
        if (!localStorage.getItem('tableHeader')) {
          let arr = []
          arr.push({ name: this.$options.name + this.$route.name, tableHeader: this.tableHeader })
          localStorage.setItem('tableHeader', JSON.stringify(arr))
        } else {
          let arr = JSON.parse(localStorage.getItem('tableHeader'))
          if (arr.find(item => item.name == this.$options.name + this.$route.name)) {
            arr.find(item => item.name == this.$options.name + this.$route.name).tableHeader = this.tableHeader
            localStorage.setItem('tableHeader', JSON.stringify(arr))
          } else {
            arr.push({ name: this.$options.name + this.$route.name, tableHeader: this.tableHeader })
            localStorage.setItem('tableHeader', JSON.stringify(arr))
          }
        }
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
          // setTimeout(() =>{
          //   this.gridApi.forEachNode(rowNode => {
          //     rowNode.setDataValue(
          //       'sid',
          //       rowNode.rowIndex + 1)
          //   });
          // }, 0)
        // }
        if (this.feeList.length) {
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
      copyAbroadBill(row){
        this.copyForm.addAbroadBillView = true;
        this.copyForm.abroadBillId = row.abroadBillId
      },
      getRowContextmenuList(row) {
        let list = []
        if (this.isFinance) {
          list = [
            { name: '复制', action: 'copy' },
            { name: '复制境外账单', action: 'copyAbroadBill' },
            { name: '修改', action: 'checkEdit', permissions: 230 },
            { name: '删除', action: 'checkDeleteFee', permissions: 231 }
          ]
        } else {
          list = [
            { name: '暂存', action: 'temporarStorage' },
            { name: '隐藏', action: 'hidden' },
            { name: '复制', action: 'copy' },
            { name: '修改', action: 'checkEdit', permissions: 230 },
            { name: '删除', action: 'checkDeleteFee', permissions: 231 }]
        }
        return list.filter(item => {
          if (item.permissions) {
            return this.$store.getters.permissions.includes(item.permissions)
          } else {
            return true
          }
        })
      },
      getCurFilterId(title) {
        switch (title) {
          case '案件管理':
            return 'caseId'
          case '递交官方':
            return 'insId'
          case '官方通知':
            return 'tmFileId'
          case '境外账单':
            return 'abroadBillId'
        }
      },
      temporarStorage(row, column, event) {
        this.$store.commit('tabs/CHANGE_STORAGETABLE', {
          type: 'push',
          title: '暂存境外账单',
          name: '暂存境外账单',
          identification: this.identification,
          data: row
        })
        this.$refs.myTabs.tabClick({ name: '暂存境外账单' }, true)
      },
      hidden(row) {
        this.feeList = this.feeList.filter(item => item[this.getCurFilterId(this.pageTitle)] != row[this.getCurFilterId(this.pageTitle)])
        if (this.feeList.length) {
          this.getFilterModel()
        }
        // this.caseList.splice(this.caseList.indexOf(row),1)
        this.currentPageSize -= 1
      },
      addFilterScheme(e) {
        if (e == 1) {
          this.addFilterState = true
        } else if (e == 2) {
          if (!this.schemeName || !this.schemeName.trim()) {
            this.$message.error('请输入过滤器名称')
            return
          }
          const data = {
            schemeName: this.schemeName,
            bussId: this.bussId,
            value: JSON.stringify(this.queryModuleData)
          }
          addFilterScheme(data).then(res => {
            this.addFilterState = false
          })
        }
      },
      leftCheckChange(e) {
        // if (e.length + this.transferValue.length > 15) {
        //   this.$message({
        //     type: "warning",
        //     message: `您最多选择15项`
        //   });
        //   e.pop();
        // }
      },
      filterCheck(val) {
        this.filterText = val
      },
      handleChange(boolean) {
        if (!boolean) {
          this.checkboxState = false
        }
      },
      checkBox(e, property, values) {
        if (this.queryModuleData[property].includes('') && this.queryModuleData[property].filter(item => item).length != values.filter(item => item).length) {
          this.queryModuleData[property] = this.queryModuleData[property].filter(item => item)
        }
        if (e[e.length - 1] == '') {
          this.queryModuleData[property] = values.map(item => item.id)
        }
      },
      savePreference(num) {

        let list2 = this.checkCaseList.map(item => ({
          title: this.selectColumnList.find(i => i.COLUMN_NAME === item)
            .COLUMN_COMMENT,
          value: item
        }))
        const data = {
          userId: this.userId,
          bussId: this.bussId,
          list2
        }
        savePreference(data).then(res => {
          if (res.success) {
            this.checkboxState = false
            this.filterText = ''
            if (!num) {
              this.queryAbroadList()
            }
            this.getAllWfs()
          }
        })
      },
      delPreference(num) {
        const data = {
          userId: this.userId,
          bussId: this.bussId
        }
        delPreference(data).then(res => {
          if (res.success) {
            this.checkboxState = false
            if (!num) {
              this.queryAbroadList()
            }
            this.getAllWfs()
          }
        })
      },
      changeHeader(n) {
        if (n && n.length) {
          this.checkCaseList = n.map(item => item.prop)
          let list2 = this.checkCaseList.map(item => ({
            title: this.selectColumnList.find(i => i.COLUMN_NAME === item)
              .COLUMN_COMMENT,
            value: item
          }))
          const data = {
            userId: this.userId,
            bussId: this.bussId,
            list2
          }

          savePreference(data).then(res => {
            // this.$nextTick(()=>{
            //   this.feeList.push({})
            //   this.feeList.pop()
            // })
          })
        }
      },
      queryFilter() {
        this.transferVisible = true
        const data = {
          bussId: this.bussId
        }
        queryFilter(data).then(res => {
          if (res.success) {
            this.transferData = this.generateData(res.data)
          }
        })
      },
      generateData(arr) {
        arr.forEach(item => {
          item.key = item.filterId
          item.label = item.filterName
        })
        return arr
      },
      configFilter() {
        const data = {
          bussId: this.bussId,
          filterIds: this.transferValue.join(',')
        }
        configFilter(data).then(res => {
          this.queryFilterConfig()
        })
      },
      defaultQuerySearch() {
        // alert(1)
        this.queryModuleData = JSON.parse(localStorage.getItem('queryModuleData')) ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$route.name) ? JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$route.name).queryModuleData : {} : {}
        if (this.queryModuleData.wfStatus) {
          this.operationState = 1
        }
      },
      queryFilterConfig(type) {
        const data = {
          bussId: this.bussId
        }
        this.conditionsModuleList = []
        queryFilterConfig(data).then(res => {
          this.transferVisible = false
          this.$nextTick(() => {
            this.conditionsModuleList = res.data
            let keyList = res.data.map(item => item.property)
            for (var key in this.queryModuleData) {
              if (!keyList.includes(key)) {
                if (key.includes('Date')) {
                  this.$set(this.queryModuleData, key, ['', ''])
                } else if (key.includes('Array') || key.includes('List')) {
                  this.$set(this.queryModuleData, key, [])
                } else {
                  this.$set(this.queryModuleData, key, null)
                }
              }
            }
            this.defaultQuerySearch()
            if (type == 1) {
              this.queryAbroadList()
            }
            res.data.forEach(item => {
              if (item.filterType.includes('Many')) {
                if (this.queryModuleData[item.property]) {
                  if (item.filterType.includes('Many')) {
                    if (['被申请人', '转让人'].includes(item.filterName)) {
                    } else if (item.filterName == '申请人') {
                      if (this.queryModuleData[item.property] && this.queryModuleData[item.property].length) {
                        queryApplicantByIdList({ appIdArray: this.queryModuleData[item.property] }).then(res => {
                          this.$set(item, 'valueList', res.data.map(i => ({
                            id: i.appId,
                            value: i.applicantName,
                            value1: i.applicantEnName,
                            value2: i.applicantAddress,
                            value3: i.applicantEnAddress
                          })))
                        })
                      }
                    } else if (item.filterName == '客户') {
                      if (this.queryModuleData[item.property].length) {
                        queryCustomerNameId({ custIdArray: this.queryModuleData[item.property] }).then(res => {
                          this.$set(item, 'valueList', res.data.map(i => ({ id: i.custId, value: i.name })))
                        })
                      }
                    } else {
                      item.valueList = item.values.filter(i => i.id == this.queryModuleData[item.property])
                    }
                  }
                } else {
                  item.valueList = []
                }
              }
              if (item.filterType.includes('checkbox')) {
                if (this.queryModuleData[item.property] && this.queryModuleData[item.property].length) {
                  this.$set(this.queryModuleData, item.property, this.queryModuleData[item.property])
                } else {
                  this.$set(this.queryModuleData, item.property, [])
                }
              }
            })
            this.transferValue = res.data.map(item => item.filterId)
          })
        })
      },
      copy(row, value, event) {
        if (value) {
          this.$copyText(value).then(
            res => {
            })
        } else {
          this.$copyText(event.target.innerText).then(
            res => {
            })
        }
      },
      handleCheckboxState() {
        this.checkboxState = !this.checkboxState
      },
      closeSelect() {
        this.selectionOptionState = false
      },
      clearSearch(that) {
        for (var key in that.queryModuleData) {
          if (key.includes('Array') || key.includes('List')) {
            that.$set(that.queryModuleData, key, [])
          } else if (key === 'feetIds'|| key === 'caseTypeIds') {
            that.$set(that.queryModuleData, key, [])
          } else {
            that.$set(that.queryModuleData, key, null)
          }
        }
        if (that.$refs.multiCascader) {
          that.$refs.multiCascader.forEach(item => {
            item.$el.querySelector('.el-input__inner').value = ''
          })
        }
      },
      handleSearch(flag) {
        if (typeof flag == 'object') {
          const { searchType, searchData } = flag
          this.queryModuleData = Object.assign(this.queryModuleData, searchData)
          if (searchType !== undefined) {
            this.operationState = searchType
          }
        } else {
          this.operationState = flag || 0
        }
        // this.operationState=flag
        this.drawerState = false
        this.selectionState = false
        this.multipleSelection = []
        this.listQuery.pageNo = 1
        this.queryAbroadList()
        if (JSON.parse(localStorage.getItem('queryModuleData'))) {
          var arr = JSON.parse(localStorage.getItem('queryModuleData'))
        } else {
          var arr = []
        }
        if (arr.find(item => item.name == this.$route.name)) {
          arr.find(item => item.name == this.$route.name).queryModuleData = this.queryModuleData
        } else {
          arr.push({ name: this.$route.name, queryModuleData: this.queryModuleData })
        }
        localStorage.setItem('queryModuleData', JSON.stringify(arr))
      },
      remoteMethod(value, index, property, filterName) {
        if (value && filterName === '客户') {
          queryCustomerNameId({ pageNo: 1, pageSize: 100, keyword: value }).then(
            res => {
              this.$set(
                this.conditionsModuleList[index],
                'valueList',
                res.data.map(item => ({ id: item.custId, value: item.name }))
              )
              this.$forceUpdate()
            }
          )
        }
        if (value && ['申请人', '被申请人', '转让人'].includes(filterName)) {
          queryAllUrl({
            applicantName: value,
            pageNo: 1,
            pageSize: 100,
            orderBy: 1
          }).then(res => {
            this.$set(
              this.conditionsModuleList[index],
              'valueList',
              res.data.map(item => ({
                id: item.appId,
                value: item.applicantName,
                value1: item.applicantEnName,
                value2: item.applicantAddress,
                value3: item.applicantEnAddress
              }))
            )
            this.$forceUpdate()
          })
        }
        if (
          value &&
          filterName !== '客户' &&
          !['申请人', '被申请人', '转让人'].includes(filterName)
        ) {
          this.$set(
            this.conditionsModuleList[index],
            'valueList',
            this.conditionsModuleList[index].values
              .filter(item =>
                item.value
                  ? item.value
                    .toLocaleUpperCase()
                    .includes(value.toLocaleUpperCase())
                  : false
              )
              .slice(0, 100)
          )
          this.$forceUpdate()
        }
      },
      changeTextRange(value, index, property) {
        this.$set(this.queryModuleData, property.split(',')[1], value)
      },
      checkEdit(row) {
        checkPermission({ abroadBillId: row.abroadBillId }).then(res => {
          if (res.data.modify) {
            this.edit(row)
          } else {
            this.$message.error('您没有权限修改所选境外账单！')
          }
        })
      },
      edit(row) {
        switch (row.wfStatus) {
          case '待提交':
            this.ctx.editFun(row.abroadBillId, '3')
            break
          case '待支付':
            this.ctx.editFun(row.abroadBillId, '4')
            break
          case '待财务初审':
            this.ctx.editFun(row.abroadBillId, '5')
            break
          case '待费用复审':
            this.ctx.editFun(row.abroadBillId, '6')
            break
          default:
            this.ctx.editFun(row.abroadBillId, '2')
            break
        }
        // if (row.wfStatus == '待提交') {
        //   if (this.isFinance) {
        //     this.ctx.editFun(row.abroadBillId, '3')
        //   } else {
        //     this.$router.push(`addOverseasBill/3?abroadBillId=${row.abroadBillId}`)
        //   }
        // } else {
        //   if (this.isFinance) {
        //     this.ctx.editFun(row.abroadBillId, '2')
        //   } else {
        //     this.$router.push(`addOverseasBill/2?abroadBillId=${row.abroadBillId}`)
        //   }
        //
        // }
      },
      checkDeleteFee(row) {
        checkPermission({ abroadBillId: row.abroadBillId }).then(res => {
          if (res.data.delete) {
            this.deleteFee(row)
          } else {
            this.$message.error('无法删除该境外账单！')
          }
        })
      },
      deleteFee(row) {
        this.$confirm('此操作将永久删除该费用, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            deleteAbroadBill({ abroadBillId: row.abroadBillId }).then(res => {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.currentPageSize = this.currentPageSize - 1
              this.total = this.total - 1
              this.feeList.splice(this.feeList.indexOf(row), 1)
              setTimeout(() => {
                this.getFilterModel()
              }, 200)
            })
          })
          .catch(() => {
          })
      },
      closeDialogSelectOption() {
        this.selectionOptionState = false
        this.selectionState = false
      },
      exportList(flag) {
        this.exportType = flag
        if (flag == 2) {
          this.multipleSelection.forEach(item => {
            this.$refs.costList.toggleRowSelection(item, false)
          })
          this.multipleSelection = []
          this.selectionState = true
          this.multipleTypeText = '列表导出'
        } else if (flag == 1) {

          this.selectionOptionState = true
        }
        this.jumpDetailSubmisson()
      },
      checkSelectedRowsTaskNo() {
        let list = []
        let wfStatus = 'wfStatus'
        switch (this.multipleTypeText) {
          case '提交':
            wfStatus = '待提交'
            break
          case '财务初审通过':
            wfStatus = '待财务初审'
            break
          case '财务初审退回':
            wfStatus = '待财务初审'
            break
          case '支付':
            wfStatus = '待支付'
            break
          case '费用复审':
            wfStatus = '待费用复审'
            break
          default:
            break
        }
        if (this.getSelectedRows().length) {
          list = this.getSelectedRows().filter(item => item.wfStatus !== wfStatus)
          return list.length ? list.length : 'ok'
        }
        return 'error'
      },
      toExamine(key) {
        if (!this.getSelectedRows().length) {
          this.$message.error('请选择境外账单！')
          return
        }

        this.multipleTypeText = key
        if (typeof this.checkSelectedRowsTaskNo() === 'number') {
          this.$message.error(`有${this.checkSelectedRowsTaskNo()}条境外账单流程状态不符合当前操作！`)
          return
        }
        if (this.checkSelectedRowsTaskNo() === 'error') {
          this.$message.error('请选择境外账单！')
          return
        }
        this.selectionState = true
        this.jumpDetailSubmisson()
        // if(key=='支付'){
        //   this.queryModuleData.wfStatus='待支付'
        // }else if(key=='提交') {
        //   this.queryModuleData.wfStatus='账单信息'
        // }else if(key=='财务初审'){
        //   this.queryModuleData.wfStatus='待财务初审'
        // }else if(key=='费用复审'){
        //   this.queryModuleData.wfStatus='待费用复审'
        // }
        // this.operationState=1
        // this.queryAbroadList()
      },
      doAbroadBillTask(result, checkFlag) {
        const data = { taskIdList: this.getSelectedRows().map(item => item.taskId), result, checkFlag }
        doAbroadBillTask(data).then(res => {
          if (res.messageType == 100) {
            this.$confirm(res.message, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                this.doAbroadBillTask(result, 0)
              })
              .catch(() => {
              })
          } else {
            this.$message.success('操作成功')
            this.queryAbroadList()
          }
        }).catch((msg) => {

        })
      },
      jumpDetailSubmisson() {
        if (this.multipleTypeText == '列表导出') {
          this.selectionOptionState = true
        } else {
          if (this.multipleTypeText == '财务初审退回') {
            this.doAbroadBillTask(0, 1)
          } else {
            this.doAbroadBillTask(1, 1)
          }
        }
      },
      queryAbroadList() {
        const data = {
          pageNo: this.listQuery.pageNo,
          pageSize: this.listQuery.pageSize
        }
        let conditionsModuleList = this.$commonUtils.getLanglist(this.conditionsModuleList.map(item => item.property).map(item => item.split(',')))
        const querData = Object.assign(data, this.queryModuleData)
        // console.log(JSON.parse(JSON.stringify(querData)));
        if (this.operationState) {
          for (var key in querData) {
            if (!['business', 'pageNo', 'pageSize'].includes(key)) {
              if (!['wfStatus'].includes(key)) {
                delete querData[key]
              }
            }
          }
        } else {
          for (var key in querData) {
            if (!['business', 'pageNo', 'pageSize'].includes(key)) {
              if (['wfStatus'].includes(key) || ![...conditionsModuleList].includes(key)) {
                if (key == 'wfStatus') {
                  this.queryModuleData.wfStatus = undefined//'7'
                }
                delete querData[key]
              }
            }
          }
        }
        this.exportQueryModel = JSON.stringify(querData)
        queryAbroadList(querData).then(res => {
          this.feeList = res.data || [];
          if (this.feeList.length) {
            this.getFilterModel()
          }
          this.currentPageSize = this.feeList.length
          this.total = res.total
        })
      },
      catchange(e) {
        this.queryModuleData.feetId = e[e.length - 1]
      },
      clickoutside() {
        this.drawerState = false
      },
      changeDate(n, start, end) {
        this.queryModuleData[start] = n[0]
        this.queryModuleData[end] = n[1]
      }
      // queryCustomerList(query){
      //   if(query !== ''){
      //     queryCustomerNameId({ pageNo: 1, pageSize: 100,keyword:query }).then(res=>{
      //       this.customerNameIdList=res.data
      //     })
      //   }
      // },
      // queryWorkgroupNames(){
      //   queryWorkgroupNames().then(res=>{
      //     this.workgroupNamesList=res.data
      //   })
      // },
      // queryFeeTypeList(){
      //   queryFeeTypeList().then(res=>{
      //     this.feeTypeList=res.data
      //   })
      // },
      // queryDeptByCondition(){
      //   queryDeptByCondition().then(res=>{
      //     this.deptByConditionList=res.data
      //   })
      // },
      // queryUsers(){
      //   queryUsers({pageNo:1,pageSize:10000}).then(res=>{
      //     this.userList=res.data.users
      //   })
      // },

    },
    mounted() {
      let that = this
      document.getElementById('searchWrap').onscroll = function(e) {
        that.clearWrapTop = e.target.scrollTop + e.target.offsetHeight
        document.getElementById('clearWrap').style.top = that.clearWrapTop - 40 + 'px'
      }
    },
    watch: {
      drawerState(n) {
        if (n) {
          this.$nextTick(() => {
            document.getElementById('clearWrap').style.top = document.getElementById('searchWrap').scrollTop + document.getElementById('searchWrap').offsetHeight - 40 + 'px'
          })
        }
      },
      selectionState(n) {
        // this.changeSelection(n)
      },
      checkboxState(n) {
        if (n) {
          this.$nextTick(() => {
            this.$refs.checkCaseSelect.focus()
          })
        }
      }
    },
    components: {
      Willtable,
      Pagination, SelectOption, MyTabs,
      UploadProofreading
    },
    computed: {
      pinnedBottomRowData() {
        if (this.isFinance && this.gridApi.rowModel) {
          const columnDisplay = ['serviceCost', 'officialCost', 'otherCost', 'billSum', 'foreignSum', 'batchPayMoney', 'abroadOfficialFee', 'abroadOtherFee', 'abroadServiceFee', 'abroadBillSum', 'payMoney', 'handleFee']
          return this.$commonUtils.pinnedBottomRowData(this.gridApi.rowModel.rootNode.childrenAfterFilter.map(item => item.data), this.columnDefs, columnDisplay)
        }
        return ''
      },
      clientHeight() {
        let height = 0
        if (this.$store.state.settings.toolPosTop == 'top') {
          height = 260
        } else if (this.$store.state.settings.toolPosTop == 'right') {
          height = 180
        }
        return (document.documentElement.clientHeight - (this.isFinance ? height : 250))
      }
    }
  }

</script>
<style lang="scss" scoped>
  .el-table {
    /deep/ th {
      padding: 5px 0;
      color: rgba(51, 51, 51, 1);
      background: rgba(187, 187, 187, 0.5);
    }

    /deep/ td {
      padding: 0;
    }
  }

  /deep/ .pass-row {
    background: #c9c9c9 !important;
  }

  .clearButton {
    position: absolute;
    right: 18px;
    top: 20px;
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

  .buttonWrap {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .el-button {
      margin-right: 10px;
    }
  }

  .buttonWrap2 {
    width: 100%;
    text-align: right;
    margin-bottom: 10px;
    margin-top: 10px;
  }

  .limitDayNum {
    height: 30px;
    display: flex;
    position: relative;
    align-items: center;
    margin-bottom: 10px;

    img {
      width: 30px;
      height: 30px
    }

    span {
      font-family: 'Nunito Sans';
      font-weight: 400;
      font-style: normal;
      font-size: 14px;
      margin-left: 2px;
      margin-right: 10px;
      color: rgb(121, 121, 121);
    }

    .el-select {
      width: 174px;
      height: 32px;
      line-height: 32px;
      margin-right: 20px;

      /deep/ .el-input__icon {
        line-height: 25px
      }

      /deep/ input {
        height: 32px;
        line-height: 32px;
      }
    }
  }

  section {
    position: relative;
    clear: both;
    flex: 1;
  }

  .checkbox {
    position: absolute;
    left: 0px;
    top: 33px;
    width: 222px;
    height: 324px;
    border: 1px solid #99a9bf;
    background: #fff;
    z-index: 100;
    padding-top: 6px;
    padding-left: 6px;
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

  .checkboxChangeRadio {
    /deep/ .el-checkbox__inner {
      border-radius: 50%;
    }

    /deep/ .el-checkbox__inner:after {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background-color: #FFF;
      position: absolute;
      left: 50%;
      top: 50%;
      -webkit-transition: -webkit-transform .01s ease-in;
      transition: -webkit-transform .01s ease-in;
      transition: transform .01s ease-in;
      transition: transform .01s ease-in, -webkit-transform .01s ease-in;
      transition: transform .01s ease-in, -webkit-transform .01s ease-in;
      transform: translate(-50%, -50%) scale(1);
    }
  }

  /deep/ .selectRow {
    background: #C9C8D0
  }

  .timeLimitTable /deep/ .cell {
    white-space: nowrap;
    text-overflow: clip;
  }

  .w-table {
    position: relative;

    /deep/ .caret-wrapper {
      position: relative;
    }

    /deep/ .el-table__column-filter-trigger {
      position: relative;
    }

    /deep/ .el-table th {
      padding: 0;

      .virtual {
        position: absolute;
        display: block;
        width: 0;
        height: 0;
        top: 0;
        background: none;
        border: none;
        box-sizing: border-box;
      }

    }

    /deep/ .thead-cell {
      vertical-align: middle;
      padding: 0;
      display: inline-flex;
      flex-direction: column;
      align-items: left;
      cursor: pointer;
      overflow: initial;
      /*&:before {*/
      /*content: "";*/
      /*position: absolute;*/
      /*top: 0;*/
      /*left: 0;*/
      /*bottom: 0;*/
      /*right: 0;*/
      /*}*/
    }

    &.w-table_moving {
      .el-table th .thead-cell {
        cursor: move !important;
      }

      .el-table__fixed {
        cursor: not-allowed;
      }
    }
  }

  /deep/ .moveIng {
    .virtual {
      border: 2px dotted #666 !important;
    }

  }

  /deep/ .pagination-container {
    padding: 0;
  }

  .DataPicker /deep/ {
    .el-input__prefix {
      display: none;
    }

    .el-input {
      width: 100%;
    }

    .el-input__inner {

      text-align: center;

      padding: 0;
      padding-right: 18px;
      // padding-left: 10px;
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
      }
    }
  }

  .button-group-search {
    position: relative;
    display: flex;

    .searchWrap {
      border-radius: 5px;
      top: 34px;
      left: 10px;
      width: 550px;
      max-height: 500px;
      min-height: 200px;
      position: absolute;
      background: #ffffff;
      border: 1px solid #d4d5d5;
      z-index: 1;
      overflow: auto;
      padding: 20px 0;
      box-shadow: 0 3px 6px rgba(111, 111, 111, 0.2);

      /deep/ .el-form {
        padding-bottom: 10px;

        .multi-cascader /deep/ {
          .el-cascader__label {
            max-height: 40px;
            overflow-y: auto
          }
        }

        .el-form-item__label {
          text-align: left;
          padding-left: 32px;
          font-weight: normal;
          float: left;
        }

        .el-form-item__content {
          input {
            border-top: 0;
            border-left: 0;
            border-radius: 0;
            border-right: 0
          }
        }
      }

      .clearWrap {
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

  .DataPicker /deep/ {
    line-height: 28px;

    .el-input__prefix {
      display: none !important;
    }

    .el-input__inner {
      text-align: left;
      padding-left: 15px;
      padding-right: 18px;
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

  .button_wrap {
    margin-left: 10px
  }

  .searchRight {
    margin-left: 0;
    height: 32px;
    border-top-right-radius: 3px !important;
    border-bottom-right-radius: 3px !important;
    padding: 0 5px
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

  .MyTabs {
    width: 100%;
    position: absolute;

    /deep/ .el-tabs {
      .el-tabs__header {
        margin: 0;
      }

      .el-tabs__content {
        background: #fff;
      }
    }
  }

  .MyTabs.activity {
    background: #fff;
    z-index: 8;

    /deep/ .el-tabs {
      .el-tabs__header {
        margin: 0;
        background: #fff;
      }

      .el-tabs__content {
        background: #fff;
      }
    }
  }
  #exceldown {
    position: absolute;
    left: 10000px;
    text-indent: 10000px;
  }
  .el-radio-wrap {
    margin: 0 20px;

    .el-radio:nth-child(1) {
      border-bottom: 0;
    }

    .el-radio {
      display: flex;
      align-items: center;
      padding: 0 10px;
      height: 50px;
      border: 1px solid #f4f4f5;
      width: 100%;

      /deep/ .el-radio__label {
        flex: 1;
        position: relative;

        .el-upload--text {
          display: flex;
          align-items: center;
          justify-content: space-between;

          button {
            position: absolute;
            right: 0;
          }
        }
      }
    }
  }
  .upload-patchimprot {
    display: flex;
    align-items: center;

    /deep/ .el-upload-list__item:first-child {
      margin-top: 0;
    }
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
    margin-right: 20px;

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
</style>
