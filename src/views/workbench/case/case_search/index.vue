<template>
  <div class="case_management_item" id="case_management_item">
    <ViewsSwitching class="ViewsSwitching" @changePattern="changePattern"></ViewsSwitching>
    <MyTabs class="MyTabs" :page-title="pageTitle" :identification="identification" :defaultColumnDefs="deepCloneData" style="position: absolute" @editableTab="editableTab" :class="myTabsActivity?'activity':''" v-if="columnDefs.length" :getContextMenuItems="getContextMenuItems"></MyTabs>
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
                  <el-select  v-if="item.filterType==='checkbox'&&item.values&&item.values.length"    v-model="queryModuleData[item.property]" multiple reserve-keyword placeholder="请选择"  filterable  clearable @change="(e)=>checkBox(e,item.property,item.values)">
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
                  <template v-if="item.filterType==='selectMultipleManyTable' && item.property === 'custIdArray'">
                      <el-select v-if="item.filterType==='selectMultipleManyTable' && item.property === 'custIdArray' && !isDim" multiple v-model="queryModuleData[item.property]" reserve-keyword filterable remote clearable  placeholder="请输入关键词" :remote-method="(queryString)=>{
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
                      <el-input v-if="isDim" type="text" placeholder="请输入客户关键字" v-model="queryModuleData.custName"></el-input>
                      <el-checkbox :true-label="1" :false-label="0" v-model="isDim" label="模糊"></el-checkbox>
                    </template>
                    <el-select v-if="item.filterType==='selectMultipleManyTable' && item.property !== 'custIdArray'" multiple v-model="queryModuleData[item.property]" reserve-keyword filterable remote clearable  placeholder="请输入关键词" :remote-method="(queryString)=>{
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
<!--                  <el-select v-if="item.filterType==='selectMultipleManyTable'" multiple v-model="queryModuleData[item.property]" filterable remote clearable reserve-keyword placeholder="请输入关键词" :remote-method="(queryString)=>{-->
<!--            remoteMethod(queryString,index,item.property,item.filterName); }">-->
<!--                    <el-option disabled label="" value="-1">-->
<!--            <span v-for="(itmx,key) in getAppTitleList(item.filterName,item['valueList']?item['valueList'][0]:undefined)" v-if="key!='id'">-->
<!--            {{itmx}}-->
<!--            </span>-->
<!--                    </el-option>-->
<!--                    <el-option v-for="itm,idx in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">-->
<!--                      <el-tooltip v-for="itmx,key in item['valueList'][idx]" v-if="key!='id'" class="item" effect="light" :content="itmx" placement="top">-->
<!--                        <span>{{itmx}}</span>-->
<!--                      </el-tooltip>-->
<!--                    </el-option>-->
<!--                  </el-select>-->
                  <el-select v-if="item.filterType==='selectTableMany'"  v-model="queryModuleData[item.property]" filterable remote clearable reserve-keyword placeholder="请输入关键词" :remote-method="(queryString)=>{
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
                    <el-option v-for="itm,idx in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
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
        <el-button v-if="this.$store.getters.permissions.includes(371)" size="small" style="margin-left: 15px" type="primary" @click="handleCreateArchive">新建档案</el-button>
        <el-button size="small" style="margin-left: 15px" type="primary" @click="doNotIssueBills">不开账单</el-button>
        <el-form :model="queryModuleData" @submit.native.prevent>
          <el-form-item label="快捷查询:"  style="margin-bottom: 0" label-width="80px">
            <el-input v-model="queryModuleData.keyWord" placeholder="请输入内容"   @keyup.enter.native="handleSearch(1)"  clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <section>
      <div style="display: flex;position: relative">
        <TitleTotal :total="total" :currentPageSize="currentPageSize"/>
        <div class="button_wrap" v-if="selectionState">
          <el-button class="exactButton"  type="primary"  size="mini" @click="gridApi.deselectAll();gridApi.selectAllFiltered()">全选</el-button>
          <el-button class="exactButton"  size="mini" @click="gridApi.deselectAll()">清除所选</el-button>
<!--          <el-button type="primary"  size="mini" v-if="multipleTypeText==='审核'" @click="recognizedError" v-show="pageTitle=='官方通知'">识别错误</el-button>-->
<!--          <el-button v-if="multipleTypeText" class="exactButton" size="mini" type="primary" @click="jumpDetailSubmisson(multipleTypeText=='报官清单'?'1-2':'')">{{multipleTypeText}}</el-button>-->
<!--          <el-button v-if="multipleTypeText=='报官清单'" class="exactButton" size="mini" type="primary" @click="jumpDetailSubmisson('1-3')">批量报官清单</el-button>-->

          <el-button class="exactButton"  size="mini" @click="selectionState=false">取消</el-button>
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
        <div class="left_wrap" :style="{width:currentCaseId&&pattern?leftWrapWidth:'100%' }">
          <div class="dots" @click="handleCheckboxState">
            <span class="dot">.</span>
            <span class="dot">.</span>
            <span class="dot">.</span>
          </div>
          <el-button class="brush_right" :class="brushRightHasFilter?'red':''" @click="brushRight" type="text" icon="el-icon-brush" ></el-button>
          <AgGridVue :style="{width:'100%',height: clientHeight+'px'}"
                     v-if="tableFlag"
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
                     @selectionChanged="selectionChanged"
                     :localeText="$store.state.caseInformation.localeText"
                     :suppressDragLeaveHidesColumns="true"
                     :suppressMakeColumnVisibleAfterUnGroup="true"
                     rowGroupPanelShow="always"
                     :groupSelectsChildren="true"
                     :suppressAggFuncInHeader="true"
                     :autoGroupColumnDef="autoGroupColumnDef"
                     @drop.native.stop.prevent="enentDrop($event)"
                     @dragover.native.stop.prevent="hoverState=true"
                     @dragleave.native.stop.prevent="hoverState=false"
                     @dragenter.native.stop.prevent="hoverState=true"
          >
          </AgGridVue>
          <div class="progressWrap" v-if="percentage">
            <el-progress type="circle" :percentage="percentage"></el-progress>
          </div>
          <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :pageSizes="pageSizesList" :limit.sync="listQuery.pageSize" @pagination="queryCaseList(true)" />
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
        <div class="right_wrap" v-if="pattern" :style="{position:'relative','margin-left':currentCaseId&&pattern?'10px' :'0',height:clientHeight+'px'}">
           <seeCaseDetail v-if="currentCaseId" :task-type="taskType" :case-id="currentCaseId" :sign="1" :backsign="0">
          </seeCaseDetail>
        </div>
      </div>
    </section>
    <el-dialog title="提示" :visible.sync="transferVisible" width="80%" >
      <el-transfer v-model="transferValue" @left-check-change="leftCheckChange" :key="transferData.filterId" :data="transferData" filterable filter-placeholder="请输入搜索内容"
                   :titles="['选择筛选项—全部案件', '已选']">
      </el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="transferVisible = false">取 消</el-button>
        <el-button type="primary" @click="configFilter">确 定</el-button>
      </span>
    </el-dialog>

    <SelectOption :buss-id="bussId" v-if="selectionOptionState" :dialog-visible="selectionOptionState" @cancel="closeSelect" :idArray="getCurrentRowsData(getCurFilterId(pageTitle))" :defaultMultipleSelect="preferenceList.map(i=>i.title)" :exportType="exportType" :exportQueryModel="exportQueryModel"></SelectOption>
    <EmitSearch @undateSearch="undateSearch"></EmitSearch>

    <relevant-dialog v-if="relevantView && relCaseId" :viewState="relevantView" @closeRelevantDialog="closeRelevantDialog" :business="business" :relCaseId="relCaseId"></relevant-dialog>

    <el-dialog :visible.sync="detailView" title="新建档案信息" width="50%" :close-on-click-modal="false">
      <archiveDetail v-if="detailView" :check-type="'create'" :agent-nums="agentNums" @closeDialog="closeArchiveDialog"></archiveDetail>
    </el-dialog>

    <el-dialog title="不开账单" :close-on-click-modal="false" :visible.sync="noBIllView" width="40%">
      <el-form label-position="right" label-width="100px" :model="noBIllForm">
        <el-row style="width: 100%">
          <el-form-item label="日期:">
            <el-date-picker v-model="noBIllForm.noBillDate" format='yyyy-MM-dd' value-format="yyyy-MM-dd"
                            align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="原因:">
            <el-input type="textarea" placeholder="请填写" size="small" clearable v-model="noBIllForm.noBillReason"></el-input>
          </el-form-item>
        </el-row>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="noBIllView = false">取 消</el-button>
        <el-button type="primary" @click="noBillSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters,mapState } from "vuex";
  import {
    addFilterScheme,
    delCase,
    getAllCaseInfo,
    selectColumn,
    savePreference,
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
    queryCaseWork
  } from "@/api/caseList.js";
  import seeCaseDetail from '../components/ManualIdentification/seeCaseDetail'
  import Bus from "../../../../utils/Bus";
  import Pagination from "@/components/Pagination";
  import ManualIdentification from "../components/ManualIdentification/index";
  import PdfPreview from "../components/ManualIdentification/PdfPreview";
  import BulkUploadFile from "../components/BulkUploadFile";
  import SelectOption from "../components/SelectOption";
  import MyTabs from '@/views/workbench/case/components/MyTabs'
  import ViewsSwitching from "../components/ViewsSwitching";
  import Checkbox from "../components/Checkbox";
  import CaseInvestigators from "../components/CaseInvestigators";
  import {
    querylyctListUrl,
    queryCollaborationAll
  } from "@/api/customerList";
  import { queryAllUrl } from "@/api/applicant";
  import RelevantDialog from '../components/RelevantDialog'
  import rememberPosition from '@/mixins/rememberPosition.vue'
  import archiveDetail from '@/views/workbench/material_management/components/archiveDetail';
  import {queryList} from "../../../../api/caseList";
  import { setCaseNoBill } from '@/api/caseDetail'
  export default {
    name: "index",
    mixins: [rememberPosition],
    data(){
      return {
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
        noBIllView: false,
        noBIllForm: {
          noBillReason:'',
          noBillDate: ''
        },
        isDim: 0,
        relCaseId: '',
        relevantView: '',
        detailView: false,
        agentNums: [], // 档案详情案件文号
        business: 19,
        bussId:'19',
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
        pageTitle:'案件管理',
        currentPageSize:0,
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
          }
        ],
        columnDefs: [

        ],
        taskType:1,
        brushRightHasFilter:false,
        autoGroupColumnDef:{
          headerName: '组',
          field: 'group',
          headerCheckboxSelection: true,
          cellRenderer: 'agGroupCellRenderer',
          cellRendererParams: { checkbox: true },
        },
        tableFlag:true,
        selectionOptionState:false,
        plType: "",
        drawerState:false,
        queryModuleData: {
        },
        exportType:1,
        currentCaseId:'',
        pageSizesList:[10, 50, 200,500,1000,5000,10000],
        uploadType: '',
        uploadState: false,
        selectBox: [],
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
        filterData: {}, // 表头过滤数据
        conditionsModuleList: [], // 渲染筛选条件
        caseListDefault: [], // 案件默认全部列表
        checkFilterList: [], // 控制筛选漏斗状态
        firstRequest: false, //第一次请求
        listQuery: {
          pageNo: 0,
          pageSize: JSON.parse(localStorage.getItem('pageSize'))?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name)?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name).pageSize:10:10
        },
        total: 0,
        listLoading: false,
        defaultParams: {
          //級聯菜單默認
          value: "caseTypeId",
          label: "caseType",
          children: "childrens",
          checkStrictly: true,
          multiple: true
        },
        tableTitleList:[{"title":"案件文号", "value": "agentNum" },{"title":"案件类型","value":"caseType","boo":"2"},{"title":"商标名称","value":"tmName"},{"title":"商标号","value":"regNumber"},{"title":"商标类别","value":"goodClasses"},{"title":"客户","value":"custName" },{"title":"申请人中文名称","value":"appCnName","boo":"1"},{"title":"阶段","value":"stageName" }],
        multipleSelection: [],
        selectionState: false,
        multipleTypeText: "",
        willtableCaseIdList: [],
        selectCaseVisible: false,
        selectCaseList: [],
        officialInfoCount: 0,
        forCount: 100,
        requireList:[],
        otherSelect:false,
        downLoadState:false,
        exportListState:false,
        // tableHeader: tableHeader,
        currentId:'',
        clearWrapTop:0,
        tableHeaderLabelList:[],
        myTabsActivity: false,
        curFilterSelect:{},
        rowContextmenuList: [
          { name: '相关案件', action: 'relevant' },
          // { name:'暂存', action: 'temporarStorage'},
          // { name:'暂存(批量)', action: 'temporarStorageAll'},
          { name:'隐藏', action: 'hidden'},
          { name:'隐藏(批量)', action: 'hiddenAll'},
        ],
        filterDataSum:{},
        operationState:1,
        officialInfoCounData:{},
        addFilterState:false,
        schemeName:'',
        exportQueryModel:'',
        examineDialog: false,
        examineData:{tmcoiMapList:[],ifShow:0},
        percentage:0,
        timeLimitState:false,
        timeLimitData:{
          agentNums: [], kind: ''
        },
        detailSubmissionData:{
          caseIds:[],
          pageType:''
        },
        detailSubmissionState:false,
        updateWkgState:false,
        updateWkgData:{},
        cloneNode:'',
        leftWrapWidth:localStorage.getItem('leftWrapWidth')?localStorage.getItem('leftWrapWidth'):'60%',
        identification:'types_of_all_cases',
      };
    },
    created() {
      this.init(1)
    },
    mounted(){
      let that=this
      document.getElementById('searchWrap').onscroll=function (e) {
        that.clearWrapTop = e.target.scrollTop+ e.target.offsetHeight
        document.getElementById('clearWrap').style.top = that.clearWrapTop -40 + 'px'
      }
      new this.$DraginResize(document.querySelector(".left_wrap"), {
        clone: true,
        end(info) {
          if (info.dir == 'ver') {
            this.elem.style.height = info.height + 'px';
          }
          else if (info.dir == 'hor') {
            this.elem.style.width = info.width + 'px';
            localStorage.setItem('leftWrapWidth', info.width + 'px')
            that.leftWrapWidth=info.width + 'px'
          }
        }
      })
    },
    methods: {
      noBillSubmit() {
        this.noBIllView = false
        console.log(this.noBIllForm)
        setCaseNoBill(this.noBIllForm).then(res => {
          this.$message.success('操作成功！')
          this.queryCaseList()
        })
      },
      doNotIssueBills() {
        if (!this.getSelectedRows().length) {
          this.$message.error('请选择案件！')
          return
        }
        if (this.getSelectedRows().find(item => item.isCreateBillStr === '是')) {
          this.$message.error('案件已开具账单！')
          return
        }
        if (this.getSelectedRows().find(item => item.isCreateBillStr === '不开账单')) {
          this.$message.error('案件已不开账单！')
          return
        }
        this.noBIllView = true
        this.noBIllForm.noBillDate = this.$wUtil.getDate('', 'day')
        this.noBIllForm.noBillReason = ''
        this.noBIllForm.caseIds = this.getSelectedRows().map(item => item.caseId).filter(Boolean)
      },
      getCurrentRowsData(key){
        if (this.gridApi && this.gridApi.rowModel) {
          return this.gridApi.rowModel.rootNode.childrenAfterSort.map(item => item.data).map(item=>item[key])
        }
        return []
      },
      closeRelevantDialog(){
        this.relevantView = false
        this.relCaseId = ''
      },
      enentDrop(e){
        if(this.selectionState&&!this.multipleTypeText){
          e.stopPropagation();
          e.preventDefault();
          this.hoverState=false
          this.curFile = e.dataTransfer.files
          this.uploadDocFile(this.curFile)
        }
      },
      uploadDocFile(file){
        let formData = new FormData()
        for (let item of file){
          formData.append("attachFile", item);
        }
        formData.append("tokenID", this.$store.getters.token);
        formData.append("insIdList",this.getSelectedRows().map(item=>item.tmFileId));
        formData.append("lastModify",  Array.from(file).map(item=>item.name+'_'+item.lastModified).join(','));
        uploadDocFile(formData,(e)=>{
          this.percentage = parseInt(e.loaded/e.total*100)
        }).then(res => {
          this.percentage = 0
          this.$message.success(res.message)
        }).catch(()=>{
          this.percentage = 0
        })
      },
      init(flag){
        // browserBehavior()
        if(flag){
          Bus.$on('keyboardEvents', context => {
            if(!this.selectionState){
              if(context==40){
                if(this.gridApi.rowModel.rootNode.childrenAfterSort[this.gridApi.rowModel.rootNode.childrenAfterSort.indexOf(this.gridApi.selectionController.lastSelectedNode)+1]){
                  this.gridApi.rowModel.rootNode.childrenAfterSort[this.gridApi.rowModel.rootNode.childrenAfterSort.indexOf(this.gridApi.selectionController.lastSelectedNode)+1].setSelected(true, true);
                }
              }
              if(context==38){
                if( this.gridApi.rowModel.rootNode.childrenAfterSort[this.gridApi.rowModel.rootNode.childrenAfterSort.indexOf(this.gridApi.selectionController.lastSelectedNode)-1]){
                  this.gridApi.rowModel.rootNode.childrenAfterSort[this.gridApi.rowModel.rootNode.childrenAfterSort.indexOf(this.gridApi.selectionController.lastSelectedNode)-1].setSelected(true, true);
                }
              }
            }
            const that =this
            switch (context) {
              case 112: this.$store.getters.permissions.includes(180)?this.handleSelect('1-1-1' ):'';break;
              case 113:this.$store.getters.permissions.includes(181)?this.handleSelect('1-1-2' ):'';break;
              case 114:this.$store.getters.permissions.includes(182)?this.handleSelect('1-2-1' ):''; break;
              case 115:this.$store.getters.permissions.includes(183)? ~function () {   that.handleSelect('1-2-2' );if(that.pageTitle=='案件管理')that.jumpDetailSubmisson();
              } ():''; break;
              case 117: this.handleSelect('1-2-2-2');break;
              case 118: this.handleSelect('1-2-3');break;
              case 119: this.handleSelect('1-2-4');break;
              case 120: this.handleSelect('1-2-5');break;
              case 121: this.handleSelect('1-2-6');break;
              case 122:this.$store.getters.permissions.includes(190)? this.handleSelect('1-3-1' ):'';break;
              case 123:this.$store.getters.permissions.includes(191)? this.handleSelect('1-3-2' ):'';break;
              default:return
            }
          })
        }
        // localStorage.setItem('field','1')
        this.$store.commit('caseInformation/SET_BUSSID',this.bussId)
        // if (this.pageTitle === "官方通知") {
        //   this.getManualRecognitionOfficialInfoCount();
        // }
        // if(this.$route.query.instructionSubmitStatus){
        //   this.$set(this.queryModuleData, "instructionSubmitStatus",Number(this.$route.query.instructionSubmitStatus));
        //   this.queryCaseList();
        // } else {
        //   if(flag){
        //     this.queryFilterConfig(1);
        //   }
        // }
        if(flag) {

          this.queryFilterConfig(1);
        }
        // if(this.pageTitle=='递交官方'||this.pageTitle=='案件管理'){
        //   this.changeKeepAlive()
        // }
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
          if(param.data.isCheck==1){
            if(param.data[this.getCurFilterId(this.pageTitle)]!=this.currentId){
              this.currentId=''
              this.currentCaseId=''
            this.taskType=param.data.taskType
              this.$nextTick(()=>{
                this.currentId=param.data[this.getCurFilterId(this.pageTitle)]
                this.currentCaseId=param.data.caseId
              })
            }
          }else {
            this.currentId=''
            this.currentCaseId=''
          }
          // if(param.data[this.getCurFilterId(this.pageTitle)]!=this.currentId){
          //   this.currentId=''
          //   this.currentCaseId=''
          //   if([3,4].includes(param.data.taskType)){
          //     return
          //   }
          //
          //   this.filed=this.taskList.find(item=>item.type==param.data.taskType).filed
          //   this.$nextTick(()=>{
          //     this.currentId=param.data[this.getCurFilterId(this.pageTitle)]
          //     this.currentCaseId=param.data.caseId
          //   })
          // }
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
        // if(!params.columnApi.columnController.groupAutoColumns) {
        //   this.gridApi.forEachNode(rowNode => {
        //     rowNode.setDataValue(
        //       'sid',
        //       rowNode.rowIndex + 1)
        //   });
        // }
        if(this.caseList.length){
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
          if(params.type=="sortChanged"){
            this.$commonUtils.saveFilterModel(this.$options.name+this.$route.name,'SortModel',this.gridApi.getSortModel())
          }
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
          if (this.multipleSelection.length&&(this.getSelectedRows()[0].caseTypeId==48||this.getSelectedRows()[0].caseTypeId==62)&&[...new Set(this.getSelectedRows().map(item => item.changeType))].length >= 2) {
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
          if(row.isCheck==1){
            this.takeCaseDetail(row)
          }
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
        if (this.gridApi) {
          const selectedNodes = this.gridApi.getSelectedNodes();
          const selectedData = selectedNodes.map(node => node.data);
          return selectedData
        } else {
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
        let that=this
        this.getAllWfs();
        this.$nextTick(()=>{
          if(document.querySelector('.ag-body-viewport')){
            document.querySelector('.ag-body-viewport').onscroll=function (e) {
              that.scrollTopY= e.target.scrollTop
            }
          }
        })
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

          });
        }

      },
      editableTab(data){
        if(data&&data!=0){
          this.myTabsActivity=true
        }else {
          this.myTabsActivity=false
        }
      },
      changeMultiple(text){
        this.multipleTypeText=text
      },
      clickoutside(){
        this.drawerState = false
      },
      closeSelect(){
        this.detailSubmissionState=false
        this.timeLimitState=false
        this.selectionState=false
        this.selectionOptionState=false
        this.uploadState = false
        this.uploadType=''
        this.ManualIdentificationState = false
        this.$emit('closeModel')
        // this.changeKeepAlive()
      },
      checkBox(e,property,values){
        if(this.queryModuleData[property].includes('')&&this.queryModuleData[property].filter(item=>item).length!=values.filter(item=>item).length){
          this.queryModuleData[property]=this.queryModuleData[property].filter(item=>item)
        }
        if(e[e.length-1]==''){
          this.queryModuleData[property]=values.map(item=>item.id)
        }
      },
      takeCaseDetail(row) {
        this.closeSelect()
        this.$router.push("/workbench/case/seeCaseDetail/" + row.caseId+'?taskType='+row.taskType);
      },
      closeTable(bool) {
        this.showTable = bool;
        this.selectionState=false
        this.queryCaseList();
      },
      takeManualIdentification() {
        this.ManualIdentificationState = true;
      },
      handleSelect(key, keyPath) {
        this.requireList=[]
        this.otherSelect=false
        this.exportListState=false

        if (key === "1-2-1") {
          this.multipleSelection = [];
          this.selectionState = true;

          this.multipleTypeText = "递交";
        }
        if (key === "1-2-2") {
          this.multipleSelection = [];
          this.selectionState = true;
          this.multipleTypeText = "官方通知";
        }
        if (key === "1-1-1") {
          this.selectionState = true;
          this.multipleTypeText = "新建账单";


          // this.queryCaseList();
        }
        if (key === "1-1-2") {

          this.multipleSelection = [];
          this.selectionState = true;
          this.multipleTypeText = "新建内部账单";
        }

        if (key === "1-1-3") {
          this.multipleSelection = [];
          this.selectionState = true;
          this.multipleTypeText = "新建费用";
        }
        if (key === "1-1-4") {
          this.multipleSelection = [];
          this.selectionState = true;
          this.multipleTypeText = "新建境外账单";
        }
        if (key === "1-3-1") {
          this.selectionState = true;
          this.multipleTypeText = "新建官方时限";
          // this.queryCaseList();
        }
        if (key === "1-3-2") {
          this.selectionState = true;
          this.multipleTypeText = "新建内部时限";
          // this.queryCaseList();
        }
        if (key === "1-2-2-2") {
          this.selectionState = true;
          this.multipleTypeText = "递交官方(文件)";
          this.uploadType = "递交官方";
          // this.queryCaseList();
        }
        if (key === "1-2-3") {
          this.selectionState = true;
          this.multipleTypeText = "客户往来";
          this.uploadType = "客户往来";
          // this.queryCaseList();
        }
        if (key === "1-2-4") {
          this.selectionState = true;
          this.multipleTypeText = "内部往来";
          this.uploadType = "内部往来";
          // this.queryCaseList();
        }
        if (key === "1-2-5") {
          this.selectionState = true;
          this.multipleTypeText = "外代所往来";
          this.uploadType = "外代所往来";
          // this.queryCaseList();
        }
        if (key === "1-2-6") {
          this.selectionState = true;
          this.multipleTypeText = "对方当事人往来";
          this.uploadType = "对方当事人往来";
          // this.queryCaseList();
        }
        if (key === "1-2-7") {
          this.selectionState = true;
          this.multipleTypeText = "特批预立卷审批";
          this.uploadType = "特批预立卷审批";
          // this.queryCaseList();
        }
        if (key === "批量操作") {
          this.selectionState = true;
          this.multipleTypeText = "批量操作";
          // this.queryCaseList();
        }
        if (key === "文件下载") {
          this.selectionState = true;
          this.multipleTypeText = "文件下载";
        }
        if (key === "变更办案人") {
          this.selectionState = true;
          this.multipleTypeText = "变更办案人";
        }
        if (key === "文件上传") {
          this.selectionState = true;
          this.multipleTypeText = "";
          this.queryModuleData.isTmfileIdOrder=1
          this.queryCaseList()
        }
      },
      exportList(flag){
        this.exportType=flag
        this.selectionOptionState=true
        // if(flag==2){
        //   this.otherSelect=false
        //   this.selectionState = true;
        //   this.multipleTypeText = '列表导出';
        //   this.exportListState=true
        // } else if(flag == 1) {
        //   // this.otherSelect = false
        //   // this.exportListState = false
        //   // this.multipleSelection = []
        //   this.selectionOptionState=true
        // }
      },
      getLanglist(array) {
        let arr = [];
        array.forEach(item => {
          arr.push(...item);
        });
        return arr;
      },
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
      getCurFilterCaseData(){
        if(this.pageTitle==='官方通知'){
          let list = this.unique(
            this.getSelectedRows(),
            this.getCurFilterId(this.pageTitle)
          );
          let caseList = this.getLanglist(list.map(item => item.caseArray));
          return this.unique(caseList, 'caseId')
        } else {
          return this.unique( this.getSelectedRows(), 'caseId')
        }
      },
      getExportFileData(requireList,key){
        if(key){
          this.$refs.exportFile.currentType=key
        }
        // this.$refs.caseListMultiple.newTableStore.states.selection.forEach(item=>{
        //   this.$refs.caseListMultiple.toggleRowSelection([{row:item,selected:false}])
        // })
        //this.$refs.caseListMultiple.newTableStore.states.selection=[]
        this.selectionState=true
        this.multipleTypeText='报官清单'
        this.otherSelect=true
        this.exportListState=false
        this.requireList=requireList
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
        if (value && ["被申请人", "利益冲突方"].includes(filterName)) {
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
        // if (value && filterName === "客户") {
        //   queryCustomerNameId({ pageNo: 1, pageSize: 100, keyword: value }).then(
        //     res => {
        //       this.$set(
        //         this.conditionsModuleList[index],
        //         "valueList",
        //         res.data.map(item => ({ id: item.custId, value:item.name,value1:item.country,value2:item.fullname}))
        //       );
        //       this.$forceUpdate();
        //     }
        //   );
        // }
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
        if (value && ["外方代理所"].includes(filterName)) {
          queryCollaborationAll({
            fullname: value,
            pageNo: 1,
            pageSize: 100,
          }).then(res => {
            this.$set(
              this.conditionsModuleList[index],
              "valueList",
              res.data.map(item => ({
                id: item.custId,
                value: item.fullname,
              }))
            );
            this.$forceUpdate();
          });
        }
        if (
          value &&
          filterName !== "客户" &&
          !["申请人", "被申请人", "转让人","外方代理所"].includes(filterName)
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
      leftCheckChange(e) {
        // if (e.length + this.transferValue.length > 15) {
        //   this.$message({
        //     type: "warning",
        //     message: `您最多选择15项`
        //   });
        //   e.pop();
        // }
      },
      changePattern(e){
        if(e===1){
          this.$store.commit('user/SET_PATTERN',false)
        } else {
          this.$store.commit('user/SET_PATTERN',true)
        }
      },
      handleSearch(flag,e) {
        if(e){
          return
        }
        this.operationState=flag
        this.drawerState=false
        this.selectionState = false;
        this.listQuery.pageNo = 1;
        if (!this.operationState) {
          this.$set(this.queryModuleData, 'keyWord', '')
        }
        this.queryCaseList();
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
      clearSearch() {
        for (var key in this.queryModuleData) {
          if(!['officialInformScreen', 'myCase', 'instructionSubmitStatus'].includes(key)){
            if(key.includes('Date')){
              this.$set(this.queryModuleData,key,['',''])
            } else if(key.includes('Array')) {
              this.$set(this.queryModuleData,key,[])
            }else if(key==='caseTypeIds'||key==='deptGroupIds'){
              this.$set(this.queryModuleData,key,[])

            }else{
              this.$set(this.queryModuleData,key,null)
            }
          }
        }
        if(this.$refs.multiCascader){
          this.$refs.multiCascader.forEach(item=>{
            item.$el.querySelector('.el-input__inner').value=''
          })
        }
      },
      queryCaseList(initPosition = false) {
        const data = {
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

        if (this.operationState) {
            for (var key in querData) {
            if(![ 'pageNo', 'pageSize', 'keyWord'].includes(key)){
              delete querData[key]
            }
          }
        } else {
          delete querData['keyWord']
        }

        // if(this.operationState){
        //   for (var key in querData) {
        //     if(!['business', 'pageNo', 'pageSize'].includes(key)){
        //       if(!['officialInformScreen','djSubmitDateArray','myCase', 'regAndAgent','instructionSubmitStatus'].includes(key)){
        //         delete querData[key]
        //       }
        //     }
        //   }
        // } else {
        //   for (var key in querData) {
        //     if(!['business', 'pageNo', 'pageSize'].includes(key)){
        //       if(['officialInformScreen',  'myCase', 'instructionSubmitStatus'].includes(key)||![...this.conditionsModuleList.map(item=>item.property),...['agentNumStart', 'agentNumEnd', 'goodClasses', 'regNumber',  'tmName']].includes(key)){
        //         if(key=='officialInformScreen'){
        //           this.queryModuleData.officialInformScreen=100//'7'
        //         }
        //         if(key=='myCase'){
        //           this.queryModuleData.myCase=100//'1'
        //         }
        //         if(key=='instructionSubmitStatus'){
        //           this.queryModuleData.instructionSubmitStatus=100//0
        //         }
        //         delete querData[key]
        //       }
        //     }
        //   }
        // }
        this.exportQueryModel=JSON.stringify(querData)
        getAllCaseInfo(querData).then(
          res => {
            res.data.forEach(item=>{
              for(var key in item){
                if(!item[key]){
                  item[key]=''
                }
              }
            })
            this.caseListDefault = JSON.parse(JSON.stringify(res.data))
            this.total = res.total;
            this.caseList = res.data
            !initPosition && setTimeout(() => {
              this.changePosition()
            }, 0)
            this.currentId=''
            this.currentCaseId=''
            this.currentPageSize=this.caseList.length
            this.caseList.forEach((item,index) => {
              if (item.tmFileId) {
                item.insId = item.tmFileId;
              }
            });
            if(this.caseList.length){
              this.getFilterModel()
            }

            // this.brushRight()
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
            // this.gridApi.rowModel.rootNode.childrenAfterFilter[0].setSelected(true)
          }
        })
      },
      brushRight(){

        let data =   this.$commonUtils.getFilterModel(this.$options.name+this.$route.name,'FilterModel')
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
          // const els1 = this.$el.getElementsByClassName("checkbox")[0];
          // els1.children[0].click();
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
              newRowsAction: 'keep',
              comparator: (a, b)=>{
                return this.$commonUtils.sort(a,b,item.value)
              }
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
                if (!/^\d+$/.test(a.split('_')[0])&&!/^\d+$/.test(b.split('_')[0])){
                  return 0;
                }
                if (!/^\d+$/.test(a.split('_')[0])){
                  return -1;
                }
                if (!/^\d+$/.test(b.split('_')[0])){
                  return 1;
                }

                return a.split('_')[0] - b.split('_')[0];
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
      headerDragend(newWidth, oldWidth, column, event){
        var arr=JSON.parse(localStorage.getItem('tableHeader'))
        var header=arr.find(item=>item.name==this.$options.name+this.$route.name).tableHeader
        if (header.find(item=>item.label==column.label)){
          header.find(item=>item.label==column.label).width=newWidth
        }
        localStorage.setItem('tableHeader',JSON.stringify(arr))
      },
      checkNotAtAll() {
        this.checkCaseList = [];
      },
      setFilterItem(index) {
        this.checkFilterList.splice(index, 1, !this.checkFilterList[index]);
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
        this.queryModuleData = JSON.parse(localStorage.getItem('queryModuleData'))?JSON.parse(localStorage.getItem('queryModuleData')).find(item=>item.name==this.$route.name)?JSON.parse(localStorage.getItem('queryModuleData')).find(item=>item.name==this.$route.name).queryModuleData:{}:{}
        if (this.queryModuleData.custName) {
          const custName = this.queryModuleData.custName
          this.isDim = 1
          this.$nextTick(() => {
            this.$set(this.queryModuleData, 'custName', custName)
          })
        }
        if (this.$route.query.custId) {
          this.$set(this.queryModuleData, 'custId', +this.$route.query.custId)
        }
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
            if (this.$route.query.custId) {
              if (!this.transferValue.find(item => item == 58)) {
                this.$set(this.transferValue, this.transferValue.length - 1, 58);
                this.configFilter();
              } else {
                this.remoteMethod(
                  this.$route.query.name,
                  this.transferValue.indexOf(58),
                  "",
                  "客户"
                );
              }
              this.operationState=0
              this.clearSearch()
              this.$set(this.queryModuleData,'custIdArray',[Number(this.$route.query.custId)])
              this.queryCaseList()
            } else {
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
                      } else if(['外方代理所'].includes(item.filterName)){
                        if (this.queryModuleData[item.property]&&this.queryModuleData[item.property].length) {
                          queryCollaborationAll({custIdArray: this.queryModuleData[item.property]}).then(res=>{
                            this.$set(item,'valueList',res.data.map(i => ({id:i.custId,value:i.fullname}) ))
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
            }
          });
        })
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
        if (["被申请人", "利益冲突方"].includes(filterName)) {
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
        if (['外方代理所'].includes(filterName)) {
          return {
            id: "-1",
            value: "名称",
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
        return this.rowContextmenuList.concat([
          { name:'复制',action: 'copy' },
          { name:'设置相关案件',action: 'setRelevant'}
          ]
        )
      },
      setRelevant(row){
        this.relCaseId = row.caseId
        this.relevantView = true
      },
      relevant(row, column, event) {
        queryCorrelationCaseList({caseId: row.caseId, business: this.business}).then(res => {
          res.data.forEach(item => {
            this.$store.commit('tabs/CHANGE_STORAGETABLE', {
              type: 'push',
              title: '相关案件',
              name: '相关案件',
              identification: this.identification,
              data: item
            })
          })
        })
      },
      hidden(row){
        this.caseList=this.caseList.filter(item=>item[this.getCurFilterId(this.pageTitle)]!=row[this.getCurFilterId(this.pageTitle)])
        // this.caseList.splice(this.caseList.indexOf(row),1)
        this.currentPageSize-=1
      },
      hiddenAll(){
        let list=this.gridApi.getSelectedRows()
        this.caseList=this.caseList.filter(item=>!list.includes(item))
        this.$nextTick(()=>{
          this.currentPageSize = this.gridApi.rowModel.rootNode.allChildrenCount
        })
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
          this.handleSearch(1)
          this.queryFilterConfig()
        }

      },
      // 新建档案
      handleCreateArchive() {
        let list=this.gridApi.getSelectedRows()
        this.agentNums = list.map(node => node.agentNum)
        this.detailView = true
      },
      // 关闭新建档案页
      closeArchiveDialog() {
        this.detailView = false
      }
    },
    computed: {
      deepCloneData(){
        return this.$wUtil.deepClone3(this.columnDefs)
      },
      ...mapGetters(["userId"]),
      ...mapState({
        'pattern' : state => state.user.pattern,
      }),

      clientHeight(){
        return document.documentElement.clientHeight-310
      },
      // clearWrapTop(){
      //   if(document.getElementById('searchWrap')){
      //     return document.getElementById('searchWrap').scrollTop+document.getElementById('searchWrap').offsetHeight
      //   }
      //
      // }
    },
    watch: {
      isDim(n, o){
        this.$set(this.queryModuleData, 'custIdArray', [])
        this.$set(this.queryModuleData, 'custName', '')
      },
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
      drawerState(n){
        if(n){
          this.$nextTick(()=>{
            document.getElementById('clearWrap').style.top =document.getElementById('searchWrap').scrollTop+ document.getElementById('searchWrap').offsetHeight - 40 + 'px'
          })
        }
      },
      transferVisible(n){
        if(!n){
          setTimeout(()=>{
            this.$nextTick(()=>{
              let searchWrap= document.getElementById('searchWrap')
              this.clearWrapTop = searchWrap.scrollTop+ searchWrap.offsetHeight
              document.getElementById('clearWrap').style.top=this.clearWrapTop -40 + 'px'
            })
          },0)
        }
      },

      selectionState(n){
        if(n){
          if(this.multipleTypeText!='官方通知'){
            this.gridApi.deselectAll()
          }
        }
        this.changeSelection(n)
      },
      dialogVisible(n) {
        if (!n) {
          if(this.pageTitle=='案件管理'){
            // this.queryModuleData.shortcuts = 1;
            //  this.$refs.caseListMultiple.newTableStore.states.selection = [];
            this.selectionState = false
            // this.queryCaseList();
            //  delete this.queryModuleData.shortcuts;
          }else {

            // console.log('changeKeepAlive')
            // this.changeKeepAlive()
          }
        }
      },
      caseList:{
        handler(n, o) {
          // if(this.pattern === true){
          //   if(n.length){
          //     this.$nextTick(()=>{
          //       this.$refs.caseListMultiple.setCurrentRow(this.caseList.find((item,index)=>index==0))
          //     })
          //   }
          // }
          // this.$nextTick(()=>{
          //   let that = this
          //   let caseFilterId=that.caseList.map(item=>item[that.getCurFilterId(that.pageTitle)])
          //   let list=this.$refs.caseListMultiple.$el.querySelector('.el-table__body').querySelectorAll('.el-checkbox__inner')
          //   for(let i=0;i<list.length;i++){
          //     list[i].setAttribute('dataId',caseFilterId[i])
          //
          //     list[i].onclick=function(e){
          //       if(e.shiftKey){
          //         that.lastRow=list[i].getAttribute('dataId')
          //         if(!that.startRow) {
          //           that.startRow=list[i].getAttribute('dataId')
          //           return
          //         }
          //         that.tableselectRow(that.rowList)
          //         that.rowList = []
          //       }else {
          //         if(!Array.from(list[i].parentNode.classList).includes('is-checked')){
          //           that.startRow=list[i].getAttribute('dataId')
          //         }
          //       }
          //     }
          //   }
          // })
        },
        deep: true
      },

    },
    activated() {
      if(this.initFlag){
        this.init()
        if(document.querySelector('.ag-body-viewport')){
          document.querySelector('.ag-body-viewport').scrollTop=this.scrollTopY
        }
      }
      this.initFlag=true
    },
    components: {
      RelevantDialog,
      Pagination,
      ManualIdentification,
      BulkUploadFile,
      SelectOption,
      seeCaseDetail,
      MyTabs,
      ViewsSwitching,
      CaseInvestigators,
      archiveDetail
      // AgGridVue
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
    top: -25px;
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
  .el-input{
    >>>.el-input__inner{
      height: 30px;
    }
  }
</style>
