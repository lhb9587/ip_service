<template>
  <el-dialog
    title="手动识别官文"
    :visible.sync="ManualIdentificationState"
    width="95%"
    top="3vh"
    class="my-dialog"
    append-to-body
    :close-on-press-escape="false"
    :before-close="handleClose">
    <section>
      <div class="sectionItem" style="width: 36%">
        <div class="content_wrap" id="VueWilltableWrap">
          <el-tabs type="border-card" :before-leave="beforeLeave" v-model="elTabName">
            <el-tab-pane :label="`无法识别(${officialInfoCounData.unknown})`" name="2">
              <VueWilltable
                v-if="elTabName==2"
                class="VueWilltable1"
                ref="willtable"
                :columns="columns"
                v-model="tableData"
                :maxHeight="150"
                :rowHeight="rowHeight"
                @selection-change="selectionChange"/>
              <div style="text-align: right">
                <el-button style="margin: 5px 5px 5px 0" type="primary" v-allow="202" size="mini"
                           @click="deleteOffice()">删除
                </el-button>
                <el-button style="margin: 5px 5px 5px 0" type="primary" size="mini" @click="modifyOfficalDocBatch()">
                  保存
                </el-button>
                <el-button style="margin: 5px 0px 5px 5px" type="primary" size="mini" @click="noCase()">无案件官文
                </el-button>
              </div>
              <div style="display: flex;justify-content: left">
                <span style="color: #fe9917;height: 32px;line-height: 32px;font-size: 13px;flex-shrink: 0;">本页: {{currentNum}} 条 </span>
                <pagination v-show="listQuery1.total>0" :total="listQuery1.total" :page.sync="listQuery1.pageNo"
                          :limit.sync="listQuery1.pageSize" @pagination="beforeLeave('2')" :pageSizes="pageSizesList1"/>
              </div>

            </el-tab-pane>
            <el-tab-pane :label="`识别错误(${officialInfoCounData.error})`" name="3">
              <VueWilltable
                v-if="elTabName==3"
                class="VueWilltable1"
                ref="willtable"
                :rowHeight="rowHeight"
                :columns="columns"
                v-model="tableData"
                :maxHeight="150"
                @selection-change="selectionChange"/>
              <div style="text-align: right">
                <el-button style="margin: 5px 5px 5px 0" type="primary" v-allow="202" size="mini"
                           @click="deleteOffice()">删除
                </el-button>
                <el-button style="margin: 5px 5px 5px 0" type="primary" size="mini" @click="modifyOfficalDocBatch">保存
                </el-button>
                <el-button style="margin: 5px 0px 5px 5px" type="primary" size="mini" @click="noCase()">无案件官文
                </el-button>
              </div>
              <pagination v-show="listQuery2.total>0" :total="listQuery2.total" :page.sync="listQuery2.pageNo"
                          :limit.sync="listQuery2.pageSize" @pagination="beforeLeave('3')"/>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="content_wrap" style="min-height: 700px">
          <PdfPreview v-if="pdfDataState" :page-type="1" :pdf-data="pdfData"
                      @closePdfPreview="closePdfPreview"></PdfPreview>
        </div>
      </div>
      <div class="sectionItem caseTable" style="width: 64%">
        <div class="content_wrap">
          <el-form label-width="90px">
            <template v-if="!isPatent">
              <el-form-item label="案件文号:" class="twoInputWarp">
                <el-input v-model="queryModuleData.agentNumStart " placeholder="请输入内容" @change="changeTextRange"
                          clearable></el-input>
                <span>至</span>
                <el-input v-model="queryModuleData.agentNumEnd" placeholder="请输入内容" clearable></el-input>
              </el-form-item>
              <el-form-item label="案件类型:">
                <el-multi-cascader
                  ref="multiCascader"
                  :show-all-levels="false"
                  :options="caseTypeOptions"
                  multiple
                  filterable
                  clearable
                  :props="defaultParams"

                  change-on-select
                  selectChildren
                  v-model="queryModuleData['caseTypeIds']"></el-multi-cascader>
                <!--            <el-cascader ref="caseTypecascader"-->
                <!--                         filterable-->
                <!--                         v-model="queryModuleData.caseTypeIdArray"-->
                <!--                         :show-all-levels="false"-->
                <!--                         :options="caseTypeOptions"-->
                <!--                         :props="defaultParams"-->
                <!--                         placeholder="请选择"-->
                <!--                         clearable-->
                <!--            ></el-cascader>-->
              </el-form-item>
              <el-form-item label="申请人:">
                <el-select
                  v-model="queryModuleData.appCnName"
                  ref="custSelect"
                  filterable
                  clearable
                  remote
                  reserve-keyword
                  placeholder="请选择/输入申请人姓名"
                  :remote-method="queryAllUrlList">
                  <el-option
                    v-for="item in appInfoList"
                    :key="item.appId"
                    :label="item.applicantName"
                    :value="item.applicantName">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="商标号:">
                <el-input type="text" v-model="queryModuleData.regNumber" placeholder="请输入商标号" clearable></el-input>
              </el-form-item>
              <el-form-item label="商标名称:">
                <el-input v-model="queryModuleData.tmName" placeholder="商标名称" clearable></el-input>
              </el-form-item>
              <el-form-item label="申请日期:" class="twoInputWarp">
                <el-date-picker
                  class="noIcon"
                  v-model="queryModuleData.appDateStart"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
                <span>至</span>
                <el-date-picker
                  class="noIcon"
                  v-model="queryModuleData.appDateEnd"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="申请方向:">
                <el-select
                  v-model="queryModuleData.appFromtoArray"
                  filterable
                  clearable
                  multiple
                  placeholder="请选择/输入申请方向"
                >
                  <el-option
                    v-for="item in  ['内-内','外-外','外-内','内-外','台-内']"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="类别:">
                <el-input type="text" v-model="queryModuleData.goodClasses" placeholder="请输入类别" clearable></el-input>
              </el-form-item>
              <el-form-item label="是否马德里:">
                <el-select
                  v-model="queryModuleData.madrid"
                  filterable
                  clearable
                  placeholder="是否马德里"
                >
                  <el-option
                    v-for="item in  [{label:'是',value:true},{label:'否',value:false}]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="注册国家:">
                <el-select
                  v-model="queryModuleData.appState"
                  filterable
                  clearable
                  placeholder="请选择/输入注册国家"
                >
                  <el-option
                    v-for="item in  countryList"
                    :key="item.countryCn"
                    :label="item.countryCn" :value="item.countryCn">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="递交方式:">
                <el-select
                  multiple
                  v-model="queryModuleData.instructionSubmitTypeArray"
                  filterable
                  clearable
                  placeholder="请输入递交方式"
                >
                  <el-option
                    v-for="item in  ['网申', '人工送达', '邮寄', '电子回文']"
                    :key="item"
                    :label="item" :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="递交日期">
                <DataPicker class="DataPicker" v-model="queryModuleData.djSubmitDateArray"></DataPicker>
              </el-form-item>
              <!--          <el-form-item v-else label="进入国家:">-->
              <!--            <el-select-->
              <!--              v-model="queryModuleData.toCountry"-->
              <!--              filterable-->
              <!--              clearable-->
              <!--              placeholder="请选择/输入注册国家"-->
              <!--            >-->
              <!--              <el-option-->
              <!--                v-for="item in  countryList"-->
              <!--                :key="item.countryCn"-->
              <!--                :label="item.countryCn" :value="item.countryCn">-->
              <!--              </el-option>-->
              <!--            </el-select>-->
              <!--          </el-form-item>-->
            </template>
            <div v-if="isPatent" class="patent-search">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="案件文号:" class="twoInputWarp">
                    <el-input v-model="queryModuleData.agentNumStart " placeholder="请输入内容" @change="changeTextRange"
                              clearable></el-input>
                    <span>至</span>
                    <el-input v-model="queryModuleData.agentNumEnd" placeholder="请输入内容" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="案件类型:">
                    <el-multi-cascader
                      ref="multiCascader"
                      :show-all-levels="false"
                      :options="caseTypeOptions"
                      multiple
                      filterable
                      clearable
                      :props="defaultParams"

                      change-on-select
                      selectChildren
                      v-model="queryModuleData['caseTypeIds']"></el-multi-cascader>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="申请人:">
                    <el-select
                      v-model="queryModuleData.appCnName"
                      ref="custSelect"
                      filterable
                      clearable
                      remote
                      reserve-keyword
                      placeholder="请选择/输入申请人姓名"
                      :remote-method="queryAllUrlList">
                      <el-option
                        v-for="item in appInfoList"
                        :key="item.appId"
                        :label="item.applicantName"
                        :value="item.applicantName">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="申请号:">
                    <el-input type="text" v-model="queryModuleData.appNumber" placeholder="请输入申请号" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="案件名称:">
                    <el-input v-model="queryModuleData.caseCnName" placeholder="案件名称" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="专利类别:">
                    <el-input type="text" v-model="queryModuleData.patentType" placeholder="请输入专利类别"
                              clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="PCT申请号:">
                    <el-input type="text" v-model="queryModuleData.pctFileNo" placeholder="请输入商标号" clearable></el-input>
                  </el-form-item>
                </el-col>

              </el-row>
            </div>

            <el-button type="primary" class="clearButton" size="mini" @click="clearSearch"><img src="@/assets/清除@2x.png"
                                                                                                alt=""><span>重置</span>
            </el-button>
            <div class="buttonWrap">
              <el-button type="primary" size="mini" @click="handleSearch(1)">搜索</el-button>
            </div>
          </el-form>
          <div style="position: relative">
            <div  class="dots" @click="handleCheckboxState">
              <span class="dot">.</span>
              <span class="dot">.</span>
              <span class="dot">.</span>
            </div>
            <el-button class="brush_right" :class="brushRightHasFilter?'red':''" @click="brushRight" type="text"
                       icon="el-icon-brush"></el-button>
            <AgGridVue :style="{width:'100%',height: '600'+'px'}"
                       class="ag-theme-balham"
                       :columnDefs="columnDefs"
                       :rowData="caseList"
                       rowSelection="multiple"
                       @grid-ready="onGridReady"
                       :gridOptions="gridOptions"
                       suppressAutoSize
                       @dragStopped="dragStopped"
                       animateRows
                       @sortChanged="refreshEvenRowsCurrencyData"
                       @filterChanged="refreshEvenRowsCurrencyData"
                       :localeText="$store.state.caseInformation.localeText"

            >
            </AgGridVue>
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
          </div>
          <!--        <el-table-->
          <!--          ref="todoTaskMultiple"-->
          <!--          :data="caseList"-->
          <!--          border-->
          <!--          fit-->
          <!--          empty-text="暂无数据"-->
          <!--          highlight-current-row-->
          <!--          current-row-key-->
          <!--          style="width: 100%;"-->
          <!--          @select="handleSelectionChange"-->
          <!--          @select-all="handleSelectionAll"-->
          <!--        >-->
          <!--          <el-table-column-->
          <!--            type="selection"-->
          <!--            width="30"-->
          <!--            class="selection"-->
          <!--          >-->
          <!--          </el-table-column>-->
          <!--          <el-table-column type="index" width="60" label="序号" align="left">-->
          <!--          </el-table-column>-->
          <!--          <el-table-column   align="left" v-for="(item,index) in preferenceList" :label="item.title" :prop="item.value" :key="index">-->
          <!--            <template slot-scope="scope">-->
          <!--              <div style="cursor: pointer" @click="takeCaseDetail(scope.row)">-->
          <!--                <span v-if="item.value!=='imageFile'">{{scope.row[item.value]}}</span>-->
          <!--                <span v-else><img style="width:100%" :src="`ipdoc${scope.row[item.value]}`" alt=""></span>-->
          <!--              </div>-->
          <!--            </template>-->
          <!--          </el-table-column>-->
          <!--        </el-table>-->
          <pagination
            v-show="listQuery3.total>0"
            :total="listQuery3.total"
            :page.sync="listQuery3.pageNo"
            :limit.sync="listQuery3.pageSize"
            @pagination="queryCaseList"
            :page-sizes="pageSizesList"
          />
          <div class="button_wrap">
            <el-button class="exactButton" type="primary" @click="uploadAfterMatching">匹配后上传</el-button>
            <el-button class="exactButton" @click="cancelToggle">取消</el-button>
          </div>
        </div>
        <div class="content_wrap" style="min-height: 700px">
          <seeCaseDetail :type="true" v-if="seeCaseDetailState" :caseId="curCaseId"
                         @closeSeeCaseDetail="seeCaseDetailState=false"></seeCaseDetail>
        </div>
      </div>
    </section>
    <el-dialog
      v-dialogDrag
      top="0"
      :visible.sync="poppingTimeLimitState"
      width="60%"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      :modal="false"
      append-to-body
      :lock-scroll="false"
      title="创建时限"
      class="dialog——body——padding"
      center
    >
      <poppingTimeLimit v-if="poppingTimeLimitState" :officialCommunication="true" @cancel="closePoppingTimeLimit"
                        :list="caseData"></poppingTimeLimit>
    </el-dialog>
  </el-dialog>
</template>

<script>
  import Bus from '@/utils/Bus'
  import VueWilltable from '@/components/vueWilltable'
  import PdfPreview from './PdfPreview'
  import seeCaseDetail from './seeCaseDetail'
  import {
    queryMaterialType,
    getManualRecognitionOfficialInfoList,
    queryCaseType,
    queryCaseList,
    queryTrademarkCaseByOfficialDoc,
    manualBindOfficialDocAndCase,
    modifyOfficalDocBatch,
    noCase,
    deleteDoc,
    delPreference,
    savePreference,
    queryPreference,
    selectColumn
  } from '@/api/caseList.js'
  import {queryCountry, queryCaseWorkgroupUrl} from '@/api/caseDetail'
  import {queryAllUrl} from '@/api/applicant.js'
  import pagination from '@/components/Pagination'
  import {formatDate} from "../../../../../utils";
  import {getUser} from "../../../../../api/user";
  import poppingTimeLimit from '@/views/workbench/toDoTasks/poppingTimeLimit.vue'

  export default {
    props: {
      taskType: {},
      business: {
        type: Number,
        default: 2
      },
      ManualIdentificationState: {
        type: Boolean,
        default: true
      },
      officialInfoCounData: {},
      isPatent: {
        type: Boolean,
        default: false
      },
      caseTypeId: {
        type: String,
        default: 3
      }
    },
    data() {
      var tableHeader = []
      if (localStorage.getItem('tableHeader') && JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name + this.$route.name)) {
        tableHeader = JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name + this.$route.name).tableHeader
      }
      return {
        tableHeader,
        selectColumnList: [],
        filterText: '',
        checkCaseList: [],
        checkboxState: false,
        currentNum: 0,
        caseTypeOptions: [],
        poppingTimeLimitState: false,
        caseData: [],
        defaultParams: {// 級聯菜單默認
          value: 'caseTypeId',
          label: 'caseType',
          children: 'childrens',
          checkStrictly: false
        },
        caseList: [],
        appInfoList: [],
        queryModuleData: {
          caseTypeIdArray: []
        },
        defaultcolumnDefs: [
          {
            headerName: '序号',
            field: 'sid',
            width: 80,
            enableRowGroup: true,
            // enablePivot: true,
            'pinned': 'left', //固定再左边
            cellRenderer: this.cellRenderer,
            floatingFilter: true,
            filter: false,
            cellClass: 'vAlign',
            suppressMenu: true,
            checkboxSelection: function (params) {
              // we put checkbox on the name if we are not doing grouping
              return params.columnApi.getRowGroupColumns().length === 0;
            },
            headerCheckboxSelection: function (params) {
              // we put checkbox on the name if we are not doing grouping
              return params.columnApi.getRowGroupColumns().length === 0;
            },
            headerCheckboxSelectionFilteredOnly: true
          },
        ],
        columnDefs: [],
        brushRightHasFilter: false,
        gridOptions: {
          ...this.$store.state.caseInformation.gridOptions, ...{
            statusBar: {
              statusPanels: [
                {statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left'},
                {statusPanel: 'agSelectedRowCountComponent', align: 'left'},
              ]
            }
          }
        },

        preferenceList: this.isPatent
          ? [
            {'title': '案件文号', 'value': 'agentNum'},
            {'title': '案件类型', 'value': 'caseType'},
            {'title': '客户', 'value': 'custName'},
            {"title": "申请人", "value": "appCnName"},
            {"title": "申请号", "value": "appNumber"},
            {"title": "申请日", "value": "appDate"},
            {"title": "案件名称", "value": "caseCnName"},
            {"title": "专利类型", "value": "typeNameStr"},
            {"title": "申请方向", "value": "appFromto"},
            {"title": "PCT申请号", "value": "pctFileNo"},
            {"title": "进入国家", "value": "toCountry"}
          ]
          : [
            {'title': '案件文号', 'value': 'agentNum'},
            {'title': '案件类型', 'value': 'caseType'},
            {"title": "申请人", "value": "appCnName"},
            {"title": "商标号", "value": "regNumber"},
            {"title": "申请日", "value": "appDate",width: 100},
            {"title": "上报事项", "value": "reportMatter"},
            {"title": "递交方式", "value": "insSubmitType"},
            // {"title": "商标名称", "value": "tmName"},
            {"title": "商标名称", "value": "tmName"},
            {"title": "商标图样", "value": "imageFile"},
            {"title": "商标类别", "value": "goodClasses",width: 100},
            {"title": "申请方向", "value": "appFromto",width: 100},
            {"title": "阶段", "value": "stageName"},
            {"title": "马德里注册", "value": "madridStr",width: 110},
            {"title": "注册国家", "value": "appState"},
          ],
        tableData: [],
        pdfDataState: false,
        columns: this.isPatent
          ? [
            {
              type: 'selection',
              width: 40,
              fixed: true,
            },
            {
              title: '序号',
              key: 'sid',
              type: 'number',
              width: 48,
              fixed: true,
              disabled: true
            },
            {
              title: '官文类型',
              key: 'materialTypeName',
              width: 100,
              type: 'select',
              options: []
            },
            {
              title: '附件',
              key: 'address',
              width: 50,
              disabled: true,
              render: function (value) {
                return `<img class="addressImg" data="${value}" style="position: absolute;top: 0;cursor: pointer;z-index: 1;width: 25px" src="${require('@/assets/picture.png')}"/>`
              }
            },
            {
              title: '官文名称',
              key: 'docTitle',
              width: 100,
              autofill: false,
              render: function (value) {
                if (value) {
                  let res = value
                  if(!/^(电子|纸件)-/.test(value)){
                    res = value.replace(/^(电子|纸件)/, '$1-')
                  }
                  return res
                }else {
                  return ''
                }
              }
            },
            {
              title: '发文日期',
              key: 'dispatchDate',
              width: 100,
              type: 'date',
            },
            // {
            //   title: '收文日期',
            //   key: 'recvDate',
            //   width: 100,
            //   type: 'date',
            // },
            {
              title: '发文编号',
              key: 'documentNo',
              width: 200,
            },
            // {
            //   title: '转寄日期',
            //   key: 'sendDate',
            //   type: 'date',
            //   width: 100,
            // },
            // {
            //   title: '挂号号码',
            //   key: 'registNum',
            //   width: 100,
            // },
            {
              title: '备注',
              key: 'memo',
              width: 100,
            },
            // {
            //   title: '申请号',
            //   key: 'appNumber',
            //   width: 100,
            // },
            // {
            //   title: '申请日',
            //   key: 'appDate',
            //   type: 'date',
            //   width: 100,
            // },
            {
              title: '创建人',
              key: 'createUserName',
              width: 100,
              type: 'select',
              options: []
            }

          ]
          : [
            {
              type: 'selection',
              width: 40,
              fixed: true
            },
            {
              title: '序号',
              key: 'sid',
              type: 'number',
              width: 48,
              fixed: true,
              disabled: true
            },
            {
              title: '官文类型',
              key: 'materialTypeName',
              width: 100,
              type: 'select',
              options: [],
              action: true
            },
            {
              action: true,
              title: '附件',
              key: 'address',
              width: 50,
              disabled: true,
              render: function (value) {
                return `<img class="addressImg" data="${value}" style="position: absolute;top: 0;cursor: pointer;z-index: 1;width: 25px" src="${require('@/assets/picture.png')}"/>`
              }
            },
            {
              action: true,
              title: '官文名称',
              key: 'docName',
              width: 100,
              autofill: false,
              render: function (value) {
                if (value) {
                  let res = value
                  if(!/^(电子|纸件)-/.test(value)){
                    res = value.replace(/^(电子|纸件)/, '$1-')
                  }
                  return res
                }else {
                  return ''
                }
              }
            },
            {
              action: true,
              title: '发文日期',
              key: 'docDate',
              width: 100,
              type: 'date',
            },
            {
              action: true,
              title: '收文日期',
              key: 'recvDate',
              width: 100,
              type: 'date',
            },
            {
              action: true,
              title: '客户',
              key: 'custName',
              width: 100,
              type: 'searchSelect',
            },
            {
              action: true,
              title: '客户组',
              key: 'wkgId',
              width: 100,
              type: 'select',
            },
            {
              action: true,
              title: '发文编号',
              key: 'docNumber',
              width: 200,
            },
            {
              action: true,
              title: '转寄日期',
              key: 'sendDate',
              type: 'date',
              width: 100,
            },
            {
              action: true,
              title: '挂号号码',
              key: 'registNum',
              width: 100,
            },
            {
              action: true,
              title: '备注',
              key: 'memo',
              width: 100,
            },
            // {
            //   title: '申请号',
            //   key: 'appNumber',
            //   width: 100,
            // },
            // {
            //   title: '申请日',
            //   key: 'appDate',
            //   type: 'date',
            //   width: 100,
            // },
            {
              action: true,
              title: '创建人',
              key: 'createUserName',
              width: 100,
              type: 'select',
              options: []
            }

          ],
        pdfData: [],
        typeNameList: [],
        elTabName: '2',
        listQuery1: {
          pageNo: 1,
          pageSize: JSON.parse(localStorage.getItem('pageSize')) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == '无法识别') ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == '无法识别').pageSize : 10 : 10,

          total: 0
        },
        listQuery2: {
          pageNo: 1,
          pageSize: JSON.parse(localStorage.getItem('pageSize')) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == '识别错误') ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == '识别错误').pageSize : 10 : 10,

          total: 0
        },
        listQuery3: {
          pageNo: 1,
          pageSize: JSON.parse(localStorage.getItem('pageSize')) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == 'dialog-fade') ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == 'dialog-fade').pageSize : 10 : 10,

          total: 0
        },
        pageSizesList: [10, 50, 200, 500, 1000, 5000, 10000],
        pageSizesList1: [10, 30, 50, 100],
        radioSelection: [],
        toggleRowNum: 0,
        seeCaseDetailState: false,
        curCaseId: null,
        countryList: [],
        rowHeight: 28
      }
    },
    name: "Manual",
    created() {
      Bus.$on('changeCurrentNum', (v)=>{
        this.currentNum = v
      })
      this.queryMaterialType()
      this.queryCaseType()
      this.getColumnDefs()
      this.queryCountry()
      this.queryCaseWorkgroup()
    },
    mounted() {
      let that = this
      // this.$nextTick(()=>{
      //
      //   document.getElementById('VueWilltableWrap').addEventListener('click', function(e){
      //     var el = e.target
      //     if(el.className==='addressImg'){
      //       that.takePdf(el.getAttribute('data'))
      //       that.columns.find(item => item.title == '附件').render=function(value) {
      //         if(String(el.getAttribute('data'))==String(value)){
      //           return `<img class="addressImg" data="${value}" style="position: absolute;top: 0;cursor: pointer;z-index: 10;width: 25px" src="${require('@/assets/picture1.png')}"/>`
      //         }else {
      //           return `<img class="addressImg" data="${value}" style="position: absolute;top: 0;cursor: pointer;z-index: 10;width: 25px" src="${require('@/assets/picture.png')}"/>`
      //         }
      //       }
      //     }
      //   }, false);
      // })
    },
    methods: {
      dragStopped(params) {
        let tableHeader = params.columnApi.columnController.gridColumns.map(item => ({
          label: item.colDef.headerName,
          width: item.actualWidth,
          prop: item.colDef.field,
        })).filter(item => item.prop != "group")
        var arr = JSON.parse(localStorage.getItem('tableHeader'))
        arr.find(item => item.name == this.$options.name + this.$route.name).tableHeader = tableHeader
        localStorage.setItem('tableHeader', JSON.stringify(arr))
        this.changeHeader(tableHeader)
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
            bussId: 55,
            list2
          };
          savePreference(data)
        }
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
      saveLocation(){
        if(!localStorage.getItem('tableHeader')){
          let arr=[]
          arr.push({name:this.$options.name + this.$route.name,tableHeader:this.tableHeader})
          localStorage.setItem('tableHeader',JSON.stringify(arr))
        }else {
          let arr=JSON.parse(localStorage.getItem('tableHeader'))
          if(arr.find(item=>item.name==this.$options.name + this.$route.name)){
            arr.find(item=>item.name==this.$options.name + this.$route.name).tableHeader= this.tableHeader
            localStorage.setItem('tableHeader',JSON.stringify(arr))
          } else {
            arr.push({name:this.$options.name + this.$route.name,tableHeader:this.tableHeader})
            localStorage.setItem('tableHeader',JSON.stringify(arr))
          }
        }
      },
      handleChange(boolean) {
        if (!boolean) {
          this.checkboxState = false
        }
      },
      savePreference(num) {
        let list2 = this.checkCaseList.map(item => ({
          title: this.selectColumnList.find(i => i.COLUMN_NAME === item)
            .COLUMN_COMMENT,
          value: item
        }));
        const data = {
          userId: this.$store.getters.userId,
          bussId: 55,
          list2
        };
        savePreference(data).then(res => {
          if (res.success) {
            this.checkboxState = false;
            this.filterText=''
            if (!num) {
              this.handleSearch()
              // this.queryAbroadList();
            }
            this.getColumnDefs();
          }
        });
      },
      delPreference(num) {
        const data = {
          userId: this.$store.getters.userId,
          bussId: 55
        };
        delPreference(data).then(res => {
          if (res.success) {
            this.checkboxState = false;
            if (!num) {
              this.handleSearch();
            }
            this.getColumnDefs();
          }
        });
      },
      filterCheck(val) {
        this.filterText = val;
      },
      handleCheckboxState() {
        this.checkboxState = !this.checkboxState;
      },
      onGridReady(params) {
        this.gridparams = params
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        setTimeout(() => {
          this.columnDefs.forEach(item => {
            this.columnApi.getColumn(item.field)&&this.columnApi.getColumn(item.field).addEventListener('menuVisibleChanged', () => {
              let data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel')
              let arr = Object.keys(data)
              if (this.columnDefs.map(itm => itm.field).diff(arr).includes(item.field)) {
                this.gridApi.getFilterInstance(item.field).selectNothing()
              }
            });
          })
        })
      },
      refreshEvenRowsCurrencyData(params) {
        if (!params.columnApi.columnController.groupAutoColumns) {
          this.gridApi.forEachNode(rowNode => {
            rowNode.setDataValue(
              'sid',
              rowNode.rowIndex + 1)
          });
        }

        if (this.caseList.length) {
          this.$commonUtils.saveFilterModel(this.$options.name + this.$route.name, 'FilterModel', this.gridApi.getFilterModel())
        }
        // let filterObj = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel');
        // for (let k in filterObj) {
        //   if(!filterObj[k].values || !filterObj[k].values.length) {
        //     this.gridApi.destroyFilter(k)
        //   }
        // }
        if (this.caseList.length) {
          // &&!params.afterDataChange
          if (params.type == "filterChanged") {
            var data = this.gridApi.getFilterModel()
            var arr = Object.keys(data);
            if (arr.length) {
              this.brushRightHasFilter = true
            } else {
              this.brushRightHasFilter = false
            }
          }
        }
      },
      getFilterModel() {
        this.$nextTick(() => {
          let data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel')
          let arr = Object.keys(data)
          let arrInstance = arr.map(item => this.gridApi.getFilterInstance(item))
          arrInstance.forEach((item, index) => {
            item.selectNothing()
            item.setModel(data[arr[index]])
            item.applyModel()
          })
          this.gridApi.onFilterChanged()

        })
      },
      brushRight() {

        let data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel')
        let arr = Object.keys(data)
        arr.forEach(item => {
          this.gridApi.destroyFilter(item)
        })
        // this.columnDefs.map(item=>item.field).forEach(item=>{
        //   this.gridApi.getFilterInstance(item).selectNothing()
        //   // this.gridApi.getFilterInstance(item).setModel(data[arr[index]])
        // })
      },
      getColumnDefs() {
        if (this.isPatent) {
         this.columnDefs = [...this.defaultcolumnDefs, ...this.preferenceList.map(item => ({
            headerName: item.title,
            field: item.value,
            width: item.width,
            resizable: true,
            sortable: true,
            filter: 'agSetColumnFilter',
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            cellRenderer: this.cellRenderer,
            // enableRowGroup: true,
            filterParams: {
              newRowsAction: 'keep',
              comparator: (a, b) => {
                return this.$commonUtils.sort(a, b, item.value)
              }
            }
          }))]
        } else {
          const data = {
            userId: this.$store.getters.userId,
            bussId: 55
          };
          Promise.all([selectColumn(data), queryPreference(data)]).then(res => {
            this.selectColumnList = res[0].data;
            this.preferenceList = res[1].data;
            this.tableHeader = this.preferenceList.map(item => ({
              label: item.title,
              prop: item.value,
              width: this.getLoactionWidth(item.title)
            }))
            this.columnDefs = [...this.defaultcolumnDefs, ...this.preferenceList.map(item => ({
              headerName: item.title,
              field: item.value,
              width: this.getLoactionWidth(item.title) == 'auto' ? 110 : this.getLoactionWidth(item.title),
              resizable: true,
              sortable: true,
              filter: 'agSetColumnFilter',
              menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],
              cellRenderer: this.cellRenderer,
              enableRowGroup: true,
              filterParams: {
                 comparator: (a, b)=>{
                return this.$commonUtils.sort(a,b,item.value)
              }
              }
            }))]
            this.$nextTick(()=>{
              this.columnDefs.forEach(item=>{
                this.columnApi.getColumn(item.field)&&this.columnApi.getColumn(item.field).addEventListener('menuVisibleChanged', ()=>{
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
                });
              })
            })
            this.saveLocation()
            this.checkCaseList = this.preferenceList.map(item => item.value);
          });
        }
      },
      cellRenderer(params) {
        if (params.colDef.field == 'imageFile') {
          return `<img class="filterTableTmg"  src="/ipdoc${params.value}" alt="">`
        }
        if(params.colDef.field==='reportMatter'){
          if(params.value=='申请'){
            return `<span style="color:blue" title="${params.value}">${params.value ? params.value :''}</span>`
          } else {
            return  `<span style="color:red" title="${params.value}">${params.value ? params.value :''}</span>`
          }
        }
        if (params.colDef.field == 'agentNum') {
          var eDiv = document.createElement('div');
          eDiv.innerHTML = `<span class="btn-simple" title="${params.value}">${params.value ? params.value : ''}</span>`
          var eButton = eDiv.querySelectorAll('.btn-simple')[0];

          eButton.addEventListener('click', () => {
            if (!this.pattern && !this.selectionState) {
              this.takeCaseDetail(params.data)
            }
          });
          return eDiv;
        }
        if (params.colDef.field == 'sid') {
          return params.rowIndex + 1
        }
        if (params.colDef.field == 'multiclassStr') {
          return `<span title="${params.value}">${params.value ? params.value : '否'}</span>`
        }
        return `<span title="${params.value}">${params.value ? params.value : ''}</span>`
      },
      // takeCaseDetail(row) {
      //   this.$router.push("/workbench/case/seeCaseDetail/" + row.caseId);
      // },
      closePdfPreview() {
        this.pdfDataState = false
        this.columns.find(item => item.title == '附件').render = function (value) {
          return `<img class="addressImg" data="${value}" style="position: absolute;top: 0;cursor: pointer;z-index: 2;width: 25px" src="${require('@/assets/picture.png')}"/>`
        }
      },
      closePoppingTimeLimit() {
        this.poppingTimeLimitState = false
      },
      async noCase() {
        const arr = this.getWilltableSelection()
        await this.modifyOfficalDocBatch(1)
        if (arr && arr.length) {
          arr[0].business = this.business
          noCase(arr[0]).then(res => {
            if (res.messageType == 13) {
              this.caseData = res.data
              this.poppingTimeLimitState = true
            }
            // this.$message.success(res.message)
            this.beforeLeave(this.elTabName)
            this.$emit('changeTotal')
          })
        }
      },
      getWilltableSelection() {
        return this.$refs.willtable.store.states.showData.filter((item, index) => this.$refs.willtable.store.states.dataStatusList[index].checked)
      },
      takePdf(url) {
        this.pdfDataState = false
        this.pdfData = [{url: `ipdoc${url}`}]
        this.columns.find(item => item.title == '附件').render = function (value) {
          if (url == String(value)) {
            return `<img class="addressImg" data="${value}" style="position: absolute;top: 0;cursor: pointer;z-index: 10;width: 25px" src="${require('@/assets/picture1.png')}"/>`
          } else {
            return `<img class="addressImg" data="${value}" style="position: absolute;top: 0;cursor: pointer;z-index: 10;width: 25px" src="${require('@/assets/picture.png')}"/>`
          }
        }
        this.$nextTick(() => {
          this.pdfDataState = true
        })

      },

      cancelToggle() {
        this.gridApi.deselectAll()
      },
      async uploadAfterMatching() {
        console.log('==>')
        if (!this.getSelectedRows().length) {
          return
        }
        if (!this.getWilltableSelection().length) {
          return
        }
        const tmFileId = this.getWilltableSelection()[0].tmFileId
        await this.modifyOfficalDocBatch(1)
        if (!this.tableData.find(item => item.tmFileId == tmFileId).materialTypeName) {
          this.$message.error('请选择官文类型')
          return
        }
        if (!this.flag) {
          this.flag = true
          manualBindOfficialDocAndCase({
            tmFileId,
            caseIds: this.getSelectedRows().map(item => item.caseId).join(','),
            business: this.business
          }).then(res => {


            if (res.messageType == 12) {
              this.$confirm(res.message,
                "提示",
                {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                }
              ).then(() => {
              });
            } else if (res.messageType == 13) {
              this.caseData = res.data
              this.poppingTimeLimitState = true
            } else {
              // this.$message.success(res.message)
              this.$message.success('官方通知识别成功！')
            }
            this.beforeLeave(this.elTabName)
            this.cancelToggle()

            this.$emit('changeTotal')
            this.$nextTick(() => {
              this.flag = false
            })
          })
        }
      },
      deleteOffice() {
        if (!this.getWilltableSelection().length) {
          return
        }
        const tmFileId = this.getWilltableSelection()[0].tmFileId
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {

            deleteDoc({
              docList: [{tmFileId: tmFileId}],
              taskType: this.taskType
            }).then(res => {
              if (res.success) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.$emit('changeTotal')
                this.beforeLeave(this.elTabName)
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },
      modifyOfficalDocBatch(type) {
        let changeData = this.$refs.willtable.getChangeData()
        if (!changeData.length) {
          return
        }
        changeData.forEach(item => {
          delete item.custName
          item.ptOfficialId = item.tmFileId
          if (item.materialTypeName) {
            item.materialTypeId = this.typeNameList.find(i => i.typeName === item.materialTypeName).materialTypeId
            if (this.tableData.find(i => i.tmFileId == item.tmFileId)) {
              this.tableData.find(i => i.tmFileId == item.tmFileId).materialTypeId = item.materialTypeId
            }
          } else {
            item.materialTypeId = null
          }
          if (item.createUserName) {
            item.createUserId = this.userList.find(i => i.fullname === item.createUserName).userId
          } else {
            item.createUserId = null
          }
          if (item.docName && !/^(电子|纸件)-/.test(item.docName)) {
            item.docName = item.docName.replace(/^(电子|纸件)/, '$1-')
          }
        })
        let officialList = this.business == 2 ? 'officialList' : 'patentOfficialList'

        if (type) {
          return modifyOfficalDocBatch({[officialList]: changeData, business: this.business})
        } else {
          modifyOfficalDocBatch({[officialList]: changeData, business: this.business}).then(res => {
            this.$message.success(res.message)
            // this.beforeLeave(this.elTabName)
          })
        }
      },
      handleSearch() {
        this.listQuery3.pageNo = 1
        let business;
        if (this.business == 2) {
          business = 2
        } else if (this.business == 41) {
          business = 3
        }
        const data = {
          business,
          pageNo: this.listQuery3.pageNo,
          pageSize: this.listQuery3.pageSize
        };
        queryCaseList(Object.assign(this.queryModuleData, data)).then(res => {
          this.caseList = res.data
          if (this.caseList.length) {
            this.getFilterModel()
            this.$nextTick(() => {
              if (this.caseList.length) {
                this.$commonUtils.saveFilterModel(this.$options.name + this.$route.name, 'FilterModel', this.gridApi.getFilterModel())
              }
              let filterObj = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel');
              for (let k in filterObj) {
                if(!filterObj[k].values || !filterObj[k].values.length) {
                  this.gridApi.destroyFilter(k)
                }
              }
            })
             res.data.length==1&&this.isPatent ? this.$nextTick(()=>{this.gridApi.rowModel.rootNode.childrenAfterFilter[0].setSelected(true)}) : ''
          }
          this.listQuery3.total = res.total
        })
      },
      clearSearch() {
        for (var key in this.queryModuleData) {
          if (!['officialInformScreen', 'myCase', 'instructionSubmitStatus'].includes(key)) {
            if (key.includes('Date') && !key.includes('DateStart') && !key.includes('DateEnd')) {
              this.$set(this.queryModuleData, key, ['', ''])
            } else if (key.includes('Array')) {
              this.$set(this.queryModuleData, key, [])
            } else if (key === 'caseTypeIds') {
              this.$set(this.queryModuleData, key, [])
              if (this.$refs.multiCascader) {
                this.$refs.multiCascader.$el.querySelector('.el-input__inner').value = ''
              }
            } else {
              this.$set(this.queryModuleData, key, null)
            }
          }
        }
        //this.listQuery3.pageNo = 1
        /*const data = {
          business: 2,
          pageNo: this.listQuery3.pageNo,
          pageSize: this.listQuery3.pageSize
        };*/
        /* queryCaseList(Object.assign(this.queryModuleData,data)).then(res=>{
           this.caseList=res.data
           this.listQuery3.total=res.total
         })*/
      },
      takeCaseDetail({caseId}) {
        this.curCaseId = caseId
        this.seeCaseDetailState = false
        this.$nextTick(() => {
          this.seeCaseDetailState = true
        })
      },
      selectionChange(val) {
        val = val.filter(item => item !== undefined)
        // let idx = 0
        // this.tableData.forEach((item, index) => {
        //   if (item.tmFileId == val.map(item => item.tmFileId).diff(this.radioSelection.map(item => item.tmFileId))[0]) {
        //     idx = index + 1
        //   }
        // })
        // var checkboxList = document.querySelectorAll('.VueWilltable1 .el-checkbox')
        // for (var i = 1; i < checkboxList.length / 2; i++) {
        //   if (idx === i) {
        //   } else {
        //     if (checkboxList[i].getAttribute('aria-checked')) {
        //       checkboxList[i].click()
        //     }
        //   }
        // }
        this.radioSelection = val


        // this.$nextTick(()=>{
        //   for (var i = 1; i < checkboxList.length / 2; i++) {
        //     if (checkboxList[i].getAttribute('aria-checked')) {
        //       this.toggleRowNum = i
        //     }
        //   }
        // })
      },
      beforeLeave(activeName, oldActiveName) {
        // this.toggleRowNum=0
        this.getManualRecognitionOfficialInfoList(activeName)
      },
      handleClose() {
        this.$emit('changeManualIdentification', false)
      },
      queryCountry() {
        queryCountry().then(res => {
          this.countryList = res.data
        })
      },
      queryCaseWorkgroup(){
        // 客户组
        queryCaseWorkgroupUrl({ status: '1' }).then(res => {
          res.data && res.data.forEach(item => {
            item.value = item.wkgId
            item.label = item.groupName
          })
          this.custGroup = res.data
          this.columns[8].options = this.custGroup
        })
      },
      queryMaterialType() {
        queryMaterialType({sign: 2, caseTypeId: this.caseTypeId}).then(res => {
          res.data && res.data.forEach(item => {
            item.value = item.typeName
            item.label = item.typeName
          })
          this.typeNameList = res.data
          this.columns[2].options = this.typeNameList
          this.beforeLeave(this.elTabName)
        })
        getUser().then(res => {
          res.data.forEach(item => {
            item.value = item.fullname
            item.label = item.fullname
          })
          this.userList = res.data
          this.columns[this.columns.length - 1].options = this.userList
        })
      },
      getManualRecognitionOfficialInfoList(auditStatus) {
        if (auditStatus == 2) {
          var data = Object.assign({auditStatus, business: this.business}, this.listQuery1)
        } else {
          var data = Object.assign({auditStatus, business: this.business}, this.listQuery2)
        }
        getManualRecognitionOfficialInfoList(data).then(res => {
          this.tableData = res.data
          this.tableData.forEach(item => {
            if (!item.tmFileId && item.ptOfficialId) {
              item.tmFileId = item.ptOfficialId
            }
            if (item.docTitle && !/^(电子|纸件)-/.test(item.docTitle)) {
              item.docTitle = item.docTitle.replace(/^(电子|纸件)/, '$1-')
            }
            if (item.docName && !/^(电子|纸件)-/.test(item.docName)) {
              item.docName = item.docName.replace(/^(电子|纸件)/, '$1-')
            }
          })
          this.tableData.forEach((item, index) => {
            item.sid = index + 1
            if (this.typeNameList.find(i => i.materialTypeId === item.materialTypeId)) {
              this.$set(item, 'materialTypeName', this.typeNameList.find(i => i.materialTypeId === item.materialTypeId).typeName)
            } else {
              this.$set(item, 'materialTypeName', null)
            }
          })
          this.closePdfPreview()
          this.$refs.willtable.setData(this.tableData);
          setTimeout(() => {
            this.rowHeight = this.$refs.willtable.$el.querySelectorAll('tr')[this.tableData.length - 1].getBoundingClientRect().height
            // document.querySelector('.VueWilltable1 .el-checkbox')[0].click()
          })
          if (auditStatus == 2) {
            this.listQuery1.total = res.total
          } else {
            this.listQuery2.total = res.total
          }
        })
      },
      queryCaseType() {
        queryCaseType().then(res => {
          this.caseTypeOptions = res.data // this.getTreeData()
        })
      },
      changeTextRange(e) {
        this.$set(this.queryModuleData, 'agentNumEnd', e)
      },
      queryCaseList() {
        // var flag = false
        // for (var key in this.queryModuleData) {
        //   if(this.queryModuleData[key]){
        //     flag=true
        //   }
        // }
        // if (flag) {
        const data = {
          business: 2,
          pageNo: this.listQuery3.pageNo,
          pageSize: this.listQuery3.pageSize
        };
        queryCaseList(Object.assign(this.queryModuleData, data)).then(res => {
          this.caseList = res.data
          this.listQuery3.total = res.total
        })
      },
      getSelectedRows() {
        const selectedNodes = this.gridApi.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data);
        return selectedData
      },
      queryTrademarkCaseByOfficialDoc(tmFileId, row) {

        const data = {
          pageNo: this.listQuery3.pageNo,
          pageSize: this.listQuery3.pageSize,
          business: this.business
        };
        queryTrademarkCaseByOfficialDoc(Object.assign({tmFileId}, data)).then(res => {
          // if (res.data.length) {
          this.caseList = res.data
          this.listQuery3.total = res.total
          // }
          res.data.length&&this.isPatent
            ? (
                this.$set(this.queryModuleData, 'appCnName', res.data[0].appCnName),
                this.$set(this.queryModuleData, 'appNumber', res.data[0].appNumber),
                this.$set(this.queryModuleData, 'caseCnName', res.data[0].caseCnName),
                this.$nextTick(()=>{res.data.length==1&&this.gridApi.rowModel.rootNode.childrenAfterFilter[0].setSelected(true)})

            )
            : (
                this.$set(this.queryModuleData, 'appCnName', ''),
                this.$set(this.queryModuleData, 'appNumber', ''),
                this.$set(this.queryModuleData, 'caseCnName', '')
            )
        })
      },
      queryAllUrlList(query) {
        if (query !== '') {
          queryAllUrl({pageNo: 1, pageSize: 100, applicantName: query, orderBy: 1}).then(res => {
            this.appInfoList = res.data
          })
        }
      },
    },
    watch: {
      checkboxState(n){
        if(n){
          this.$nextTick(()=>{
            this.$refs.checkCaseSelect.focus()
          })
        }
      },
      radioSelection(n, o) {
        if (n.length) {
          this.queryTrademarkCaseByOfficialDoc(n[0].tmFileId)
          this.takePdf(n[0].address)
        }
      }
    },
    components: {
      VueWilltable, PdfPreview, seeCaseDetail, pagination, poppingTimeLimit
    }
  }
</script>

<style lang="scss" scoped>
  .my-dialog /deep/ {
    .el-dialog__body {
      padding: 0 20px;
    }
  }

  section {
    display: flex;
    flex-wrap: wrap;

    .sectionItem {
      width: 50%;
    }
  }

  .VueWilltable1 /deep/ tr:nth-child(1) th .el-checkbox {
    display: none;
  }

  .caseTable {
    .el-table {
      /deep/ tr {
        th.el-table-column--selection {
          border-right: 0;
          overflow: visible;

          .cell {
            position: relative;
            right: -14px;
            z-index: 1;
            text-overflow: clip;
          }
        }

        td.el-table-column--selection {
          border-right: 0;
          overflow: visible;

          .cell {
            position: relative;
            right: -14px;
            z-index: 1;
            text-overflow: clip;
          }
        }
      }
    }

    .el-form {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      padding: 20px 120px 20px 0;
      background: #fff;
      margin-bottom: 20px;
      box-shadow: 0px 2px 5px 0px rgba(163, 163, 163, 0.35);

      .el-form-item {
        width: 33%;

        /deep/ .el-form-item__content {
          input {
            font-size: 12px;
          }

          display: flex;
          align-items: center;
          height: 100%;

          .el-cascader {
            width: 100%;
          }

          .el-select {
            width: 100%;
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
      background: #fff;
      right: 0;

      .el-button {
        margin-right: 20px;
      }
    }

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
    position: absolute;
    bottom: 20px;
    right: 20px;
  }

  .content_wrap {
    background: #EDF7FF;
    padding: 10px;
    margin: 10px 5px;
  }

  .noIcon {
    /deep/ .el-input__inner {
      padding: 0 15px;
    }

    /deep/ .el-input__prefix {
      display: none;
    }
  }

  /*.multi-cascader /deep/{*/
  /*  .el-cascader__label{*/
  /*    max-height: 40px;*/
  /*    overflow-y: auto*/
  /*  }*/
  /*}*/
  .brush_right {
    position: absolute;
    right: 6px;
    z-index: 1;
    top: -4px;
  }

  .patent-search {
    width: 100%;

    .el-row {
      /*background-color: red;*/
      display: flex;
      width: 100%;

      .el-col {
        /*background-color: red;*/
        /*width: 100%;*/
        .el-form-item {
          width: 95%;
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
  .checkbox{
    position:absolute;
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
</style>
