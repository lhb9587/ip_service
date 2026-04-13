<template>
  <div style="position: relative">
    <div v-if="!isFinance" style="position: absolute;right: 0;height: 50px;width: 50px;">
      <ViewsSwitching class="ViewsSwitching" @changePattern="changePattern"></ViewsSwitching>
    </div>
    <div style="display: flex; padding: 0px">
      <div class="content_wrap" style="padding-top: 10px">
        <div style="position: relative;padding: 10px 10px 0 10px;border: 1px solid #E4E7ED" class="left_wrap"
             :style="{width:visiable&&pattern?leftWrapWidth:'100%' }">

          <div style="position:absolute;top: 15px">
            <div style="display: flex;justify-content: flex-start;height: 32px;">

            </div>
          </div>
          <el-button class="brush_right" :class="brushRightHasFilter?'red':''" @click="brushRight" type="text"
                     icon="el-icon-brush"></el-button>
          <div v-if="!isFinance" style="display: flex">
            <el-button-group class="button-group-search" v-clickoutside="clickoutside">
              <el-button id="mySearch" type="primary" size="mini" @click="handleSearch">搜索</el-button>
              <el-button type="primary" class="searchRight" size="mini" icon="el-icon-arrow-down"
                         @click.stop.prevent="drawerState=true"></el-button>
              <transition name="show" mode="out-in">
                <div class="searchWrap" v-show="drawerState">
                  <div style="width: 550px;max-height: 500px;overflow: auto">
                    <el-form label-width="120px" size="mini" class="form-container">
                      <el-form-item label="客户:">
                        <el-select
                          v-model="queryModuleData['custId']"
                          ref="custSelect"
                          filterable
                          clearable
                          remote
                          reserve-keyword
                          placeholder="请输入客户姓名"
                          :remote-method="queryCustomerList">
                          <el-option
                            v-for="item in customerNameIdList"
                            :key="item.custId"
                            :label="item.fullname"
                            :value="item.custId"
                          >
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="创建时间:">
                        <!--                        <DataPicker class="DataPicker" v-model="queryModuleData.createDateList"></DataPicker>-->
                        <el-date-picker v-model="queryModuleData.createDateStart" format='yyyy-MM-dd'
                                        value-format="yyyy-MM-dd"
                                        align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">
                        </el-date-picker>
                        至
                        <el-date-picker v-model="queryModuleData.createDateEnd" format='yyyy-MM-dd'
                                        value-format="yyyy-MM-dd"
                                        align="right"
                                        type="date" placeholder="选择日期" :picker-options="pickerOptions">
                        </el-date-picker>
                        <!--                        <el-date-picker-->
                        <!--                          v-model="queryModuleData.createDate"-->
                        <!--                          type="date"-->
                        <!--                          placeholder="选择日期"-->
                        <!--                          value-format="yyyy-MM-dd">-->
                        <!--                        </el-date-picker>-->
                      </el-form-item>
                      <el-form-item label="报价名称:">
                        <el-input v-model="queryModuleData.offerName " placeholder="请输入报价名称" clearable></el-input>
                      </el-form-item>
                      <el-form-item label="商标名称:">
                        <el-input v-model="queryModuleData.tmName " placeholder="请输入商标名称" clearable></el-input>
                      </el-form-item>
                      <el-form-item label="案件类型:">
                        <el-select style="" v-model="queryModuleData.caseTypeId" placeholder="" filterable clearable
                                   @change="changeCaseType">
                          <el-option
                            v-for="item in [{id: 185, label: '注册申请'}, {id: 31, label: '转让'}, {id: 52, label: '查询'}, {id: 33, label: '续展'}, {id: 30, label: '变名变址'}]"
                            :key="item.id"
                            :label="item.label"
                            :value="item.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="变更类型" class="">
                        <el-select v-model="queryModuleData.changeType" placeholder="" filterable clearable>
                          <el-option
                            v-for="item in ['变址', '变名', '变名变址']"
                            :key="item"
                            :label="item"
                            :value="item">
                          </el-option>
                        </el-select>
                      </el-form-item>

                    </el-form>

                  </div>
                  <div class="clearWrap">
                    <el-button size="mini" @click="clearSearch"><span>重置</span></el-button>
                    <el-button type="primary" size="mini" @click="handleSearch">搜索</el-button>
                  </div>
                </div>
              </transition>
            </el-button-group>
            <el-button type="primary" size="mini" style="margin-left: 10px" @click="createBJ"
                       v-if="$store.getters.permissions.includes(292)">新建
            </el-button>
            <el-button type="primary" size="mini" style="margin-left: 10px"
                       @click="ZYClick">
              逐一国家报价表
            </el-button>
            <el-button type="primary" size="mini"
                       @click="MDLClick">
              马德里国家报价表
            </el-button>
            <el-dropdown trigger="click" @command="createModel" style="margin-left: 10px">
              <el-button type="primary" size="mini">
                模板生成<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="1">境外注册方案及报价</el-dropdown-item>
                <el-dropdown-item :command="2">指定国家商标注册申请报价明细</el-dropdown-item>
                <el-dropdown-item :command="3">指定国家商标注册申请报价明细-拆分</el-dropdown-item>
                <el-dropdown-item :command="5">境外商标查询报价明细</el-dropdown-item>
                <el-dropdown-item :command="6">境外商标查询报价明细-拆分</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>

          <!--        <TitleTotal :total="total" :currentPageSize="currentPageSize"/>-->
          <AgGridVue
            style="width:100%;"
            :style="{'height': clientHeight + 'px'}"
            class="ag-theme-balham"
            :columnDefs="columnDefs"
            :rowData="bjTable"
            rowSelection="multiple"
            @grid-ready="onGridReady"
            :gridOptions="gridOptions"
            :getContextMenuItems="getContextMenuItems"
            @sortChanged="refreshEvenRowsCurrencyData"
            @filterChanged="refreshEvenRowsCurrencyData"
            @rowDoubleClicked="rowDoubleClicked"
            suppressAutoSize
            animateRows
            :localeText="$store.state.caseInformation.localeText"
            :suppressDragLeaveHidesColumns="true"
            :suppressMakeColumnVisibleAfterUnGroup="true"
            rowGroupPanelShow="always"
            :groupSelectsChildren="true"
            :suppressAggFuncInHeader="true"
            :autoGroupColumnDef="autoGroupColumnDef"
            :masterDetail="true"
            :detailCellRendererParams="detailCellRendererParams"
            keepDetailRows
            :rowHeight="isFinance ? $commonUtils.getRowHeight() : 28"
            :pinnedBottomRowData="pinnedBottomRowData"
          >
          </AgGridVue>
          <pagination
            v-if="total>0"
            :total="total"
            :page.sync="listQuery.pageNo"
            :limit.sync="listQuery.pageSize"
            @pagination="queryOfferCust"
            :pageSizes="pageSizesList"
          />
        </div>
        <div class="right_wrap"
             style="position:relative;padding: 50px 0px 0 0px;"
             v-if="pattern"
             :style="{position:'relative','margin-left':visiable?'10px' :'0','margin-right':visiable?'10px' :'0',height:clientHeight+'px'}">
          <div style="position:absolute;top:15px;left: 10px;z-index: 99">

          </div>
          <right-details v-if="listData.ocId" :listData="listData"></right-details>
          <!--          <right-table ref="rightTable" :table-height="false" v-if="visiable&&pattern" type="境外报价"-->
          <!--                       :childDataList="childDataList"></right-table>-->
        </div>

      </div>
    </div>

    <el-drawer
      :wrapperClosable="false"
      :title="title"
      :visible.sync="drawerView"
      direction="btt"
      :modal="false"
      size="95%"
      custom-class="billDraw"
      :before-close="closeDialog"
    >
      <ZYdetail v-if="ZyView"></ZYdetail>
      <MDLdetail v-if="MDLView"></MDLdetail>
      <WaibiList v-if="waibiView"></WaibiList>
      <BJdetail :isCopy="isCopy" v-if="bjView" :threeLevelData="threeLevelData" :editType="editType" @closeDialog="closeDialog"/>
    </el-drawer>

    <el-dialog :close-on-click-modal="false" :show-close="true" :before-close="closeCheckView" :visible.sync="checkChooseView" title="提示" width="30%">
      <div class="fl-ac-jc">
        <el-checkbox v-model="isCheckSelf">是否自查</el-checkbox>
        <el-checkbox v-model="isCheckOversea">是否境外查</el-checkbox>
      </div>
      <div class="dialog-footer fl-ac-jc" slot="footer">
        <el-button size="mini" @click="() => closeCheckView()">
          取消
        </el-button>
        <el-button type="primary" size="mini" @click="submitCheck">
          确定
        </el-button>
      </div>
    </el-dialog>
<!--choseCaseTypeView-->
    <el-dialog :close-on-click-modal="false" :show-close="true" :before-close="closeCheckView" :visible.sync="choseCaseTypeView" title="提示" width="30%">
      <div class="fl-ac-jc">
        <div style="display: flex;align-items: center;margin-right: 5px">案件类型:</div>
        <el-select style="width: 50%;" v-model="choseCaseTypeId" placeholder="请选择案件类型" filterable clearable>
          <el-option
              v-for="item in [{id: 185, label: '注册申请'}, {id: 31, label: '转让'}, {id: 33, label: '续展'}, {id: 30, label: '变名变址'}]"
              :key="item.id"
              :label="item.label"
              :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="dialog-footer fl-ac-jc" slot="footer">
        <el-button size="mini" @click="() => closeChoseCaseTypeView()">
          取消
        </el-button>
        <el-button type="primary" size="mini" @click="submitChoseCaseType">
          确定
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { doEditInOffice, getProgID } from '@/utils/editInOffice.js'
  import { formatAmount, fomatFloat, toFixed1, toFixed2 } from '@/utils/filters'
  import Pagination from '@/components/Pagination'
  import {
    upTimelimit,
    getTimelimitDetail,
    revocationTimelimitWriteoff,
    addFilterScheme,
    queryCustomerNameId,
    getTimelimitList,
    getTimelimitTypeAll,
    getWriteoffState,
    delTimelimit,
    selectColumn,
    queryPreference,
    savePreference,
    delPreference,
    getCaseTimelimitList,
    queryDeptGroup
  } from '@/api/caseList.js'
  import ViewsSwitching from '@/views/workbench/case/components/ViewsSwitching'
  import { mapState } from 'vuex'
  import overseasPriceDetail from './overseasPriceDetail'
  import ZYdetail from './ZYdetail'
  import MDLdetail from './MDLdetail'
  import RightDetails from './RightDetails'
  import {
    queryOfferCust, deleteOfferCust, createTemplateOffer, createSpecialTemplate
  } from '@/api/billApi'
  import BJdetail from './BJdetail'
  import BJForm from './BJForm'
  import WaibiList from './WaibiList'

  export default {
    name: 'overseasPrice',
    components: {
      WaibiList,
      BJdetail,
      // overseasPriceDetail,
      ZYdetail,
      MDLdetail,
      ViewsSwitching,
      RightDetails,
      BJForm,
      Pagination
    },
    computed: {
      ...mapState({
        'pattern': state => state.user.pattern
      }),
      clientHeight() {
        let height = 0;
        if(this.$store.state.settings.toolPosTop == 'top'){
          height = 250
        }else if(this.$store.state.settings.toolPosTop == 'right'){
          height = 170
        }
        return (document.documentElement.clientHeight - (this.isFinance ? height : 200))
      },
      pinnedBottomRowData(){
        if(this.isFinance && this.gridApi.rowModel){
          const columnDisplay = ['totalA', 'totalB']
          return this.$commonUtils.pinnedBottomRowData(this.gridApi.rowModel.rootNode.childrenAfterFilter.map(item=>item.data), this.columnDefs, columnDisplay)
        }
        return ''
      },
    },
    props: {
      isFinance: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        isCopy: false,
        choseCaseTypeId: '',
        choseCaseTypeCode: '',
        choseCaseTypeView: false,
        checkType: '',
        isCheckSelf: true,
        isCheckOversea: true,
        checkChooseView: false,
        waibiView: false,
        gridApi: {},
        total: 0,
        listQuery: {
          pageSize: 10,
          pageNo: 1
        },
        pageSizesList: [10, 50, 100, 200, 300, 400, 500],
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
        editType: '',
        createBjView: false,
        bjView: false,
        threeLevelData: {},
        customerNameIdList: [],
        drawerState: false,
        listData: {},
        leftWrapWidth: localStorage.getItem('leftWrapWidth') ? localStorage.getItem('leftWrapWidth') : '60%',
        brushRightHasFilter: false,
        visiable: false,
        autoGroupColumnDef: {
          headerName: '组',
          field: 'group',
          headerCheckboxSelection: true,
          cellRenderer: 'agGroupCellRenderer',
          cellRendererParams: { checkbox: true }
        },
        MDLView: false,
        title: '标题',
        ZyView: false,
        drawerView: false,
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
        bjTable: [],
        detailCellRendererParams: {
          detailGridOptions: {
            rowSelection: 'multiple',
            columnDefs: [],
            // rowHeight:67,
            defaultColDef: { flex: 1 },
            getContextMenuItems: this.getContextMenuItems1,
            localeText: this.$store.state.caseInformation.localeText
          },
          getDetailRowData: params => {
            params.successCallback(params.data.offerMadrids)
          }
        },
        defaultcolumnDefs: [
          {
            headerName: '序号',
            field: 'sid',
            width: 120,
            'pinned': 'left', // 固定再左边
            enableRowGroup: true,
            // enablePivot: true,
            floatingFilter: true,
            filter: false,
            cellClass: 'vAlign',
            autoHeight: true,
            suppressMenu: true,
            checkboxSelection: false,
            headerCheckboxSelection: false,
            headerCheckboxSelectionFilteredOnly: true,
            cellRenderer: this.cellRenderer
          }
        ],
        defaultcolumnDefs2: [
          {
            headerName: '序号',
            field: 'sid',
            width: 120,
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
            cellRenderer: this.cellRenderer2
          }
        ],
        preferenceList: [
          { 'label': ' 创建日期', prop: 'createDate' },
          { 'label': '创建人', prop: 'createUserIdStr' },
          { 'label': '报价描述', prop: 'offerName' },
          { 'label': '客户', prop: 'custIdStr' },
          { 'label': '案件类型', prop: 'caseTypeIdStr' },
          { 'label': '变更类型', prop: 'changeType' },
          { 'label': '类别个数', prop: 'classNumTotal' },
          { 'label': '国家数量', prop: 'countrysNum' },
          { 'label': '进入国家', prop: 'countryCns' },
          { 'label': '瑞士法郎汇率', prop: 'exchangeRate' },
          { 'label': '报价文档', prop: 'materials' },
          { 'label': 'A方案合计', prop: 'totalA' },
          { 'label': 'B方案合计', prop: 'totalB' },
          // { 'label': '客户组', prop: 'wkgIdStr' }
          // { 'label': '逐一境外费用RMB', prop: 'value' },
          // { 'label': '逐一万慧达代理费RMB', prop: 'value' },
          // { 'label': '逐一公正认证即翻译费RMB', prop: 'value' },
          // { 'label': '逐一报价合计', prop: 'value' },
          // { 'label': '马德里境外费用RMB', prop: 'value' },
          // { 'label': '马德里万慧达代理费RMB', prop: 'value' },
          // { 'label': '马德里公正认证即翻译费RMB', prop: 'value' },
          // { 'label': '马德里报价合计', prop: 'value' }
        ],
        tableTitleList2: [
          { 'title': '案件类型', 'value': 'caseTypeIdStr' },
          { 'title': '类型', 'value': 'madridStr' },
          { 'title': '官费合计', 'value': 'officialFeeTotalRMB' },
          { 'title': '服务费', 'value': 'serviceFee' },
          { 'title': '公证认证及翻译费', 'value': 'gzFee' },
          // { 'title': '境外公证和翻译费', 'value': 'value' },
          // { 'title': '溢价', 'value': 'value' },
          { 'title': '合计', 'value': 'totalRMB' }

        ],
        columnDefs: [],
        queryModuleData: {
          caseTypeId: '',
          changeType:'',
          custId: '',
          createUserId: '',
          createDateStart: '',
          createDateEnd: '',
          offerName: '',
          tmName: ''
        }
      }
    },
    mounted() {
      this.rightDrag()
    },
    created() {
      this.columnDefs = [...this.defaultcolumnDefs, ...this.preferenceList.map(item => ({
        headerName: item.label,
        field: item.prop,
        resizable: true,
        sortable: true,
        width: item.width,
        autoHeight: true,
        filter: 'agSetColumnFilter',
        cellRenderer: this.cellRenderer,
        menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
        enableRowGroup: true,
        filterParams: {
          defaultToNothingSelected: true,
          newRowsAction: 'keep',
          comparator: (a, b) => {
            return this.$commonUtils.sort(a, b, item.value)
          }
        }
      }))]

      this.detailCellRendererParams.detailGridOptions.columnDefs = [...this.defaultcolumnDefs2, ...this.tableTitleList2.map(item => ({
        headerName: item.title,
        field: item.value,
        // width:this.getLoactionWidth(item.title)=='auto'?200:this.getLoactionWidth(item.title),
        resizable: true,
        sortable: true,
        filter: 'agSetColumnFilter',
        cellRenderer: this.cellRenderer2,
        menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
        enableRowGroup: true,
        filterParams: {
          newRowsAction: 'keep',
          comparator: (a, b) => {
            return this.$commonUtils.sort(a, b, item.value)
          }
        }
      }))]
      this.handleSearch()

    },
    methods: {
      submitChoseCaseType(){
        if(!this.choseCaseTypeId) {
          this.$message.error('请选择案件类型！')
          return
        }
        createSpecialTemplate({
          code: this.choseCaseTypeCode,
          caseTypeId: this.choseCaseTypeId
        }).then(res => {
          this.$message.success('模板生成成功!')
          this.$commonUtils.downLoadAll({ url: `ipdoc${res.data}` })
          this.closeChoseCaseTypeView()
          this.handleSearch()
        })
      },
      closeChoseCaseTypeView(done) {
        this.choseCaseTypeView = false
        this.choseCaseTypeCode = ''
        this.choseCaseTypeId = ''
        done && done()
      },
      changeCaseType(value) {
        if (value != 30) {
          this.queryModuleData.changeType = ''
        }
      },
      submitCheck(){
        if (!this.isCheckSelf && !this.isCheckOversea) {
          this.$message.error('请至少勾选一项')
          return
        }
        createTemplateOffer({ hasA: this.isCheckSelf ? 1 : 0, hasB: this.isCheckOversea ? 1 : 0, type: this.checkType, ocId: this.getSelectedRows()[0].ocId }).then(res => {
          this.$message.success('模板生成成功!')
          this.$commonUtils.downLoadAll({ url: `ipdoc${res.data[0].localFilePath}` })
          this.handleSearch()
          this.closeCheckView()
        })
      },
      closeCheckView(done) {
        this.checkChooseView = false
        this.isCheckSelf = true
        this.isCheckOversea = true
        done && done()
      },
      waibiClick(){
        this.waibiView = true
        this.drawerView = true
        this.title = '外币汇率表'
      },
      MDLClick(){
        this.drawerView = true;
        this.MDLView = true;
        this.$store.getters.permissions.includes(297) ? this.title='维护马德里国家报价表' : this.title='查看马德里国家报价表'
      },
      ZYClick(){
        this.drawerView = true;
        this.ZyView = true;
        this.$store.getters.permissions.includes(296) ? this.title='维护逐一国家报价表' : this.title='查看逐一国家报价表'
      },
      getSelectedRows() {
        if (this.gridApi) {
          const selectedNodes = this.gridApi.getSelectedNodes()
          const selectedData = selectedNodes.map(node => node.data)
          return selectedData
        } else {
          return []
        }

      },
      createModel(type, item) {
        // if ([75, 76].includes(type)) {
        //   this.choseCaseTypeView = true
        //   this.choseCaseTypeCode = item.code
        //   return
        // }
        if (!this.getSelectedRows().length) {
          this.$message.error('请选择报价')
          return
        }
        if ([5, 6].includes(type)) {
          this.checkType = type
          this.checkChooseView = true
          return
        }
        if ([75, 78].includes(type)) {
          createSpecialTemplate({
            code: item.code,
            ocId: this.getSelectedRows()[0].ocId
          }).then(res => {
            this.$message.success('模板生成成功!')
            this.$commonUtils.downLoadAll({ url: `ipdoc${res.data}` })
            this.handleSearch()
          })
          return
        }
        createTemplateOffer({ type, ocId: this.getSelectedRows()[0].ocId }).then(res => {
          this.$message.success('模板生成成功!')
          this.$commonUtils.downLoadAll({ url: `ipdoc${res.data[0].localFilePath}` })
          this.handleSearch()
        })
      },
      rowDoubleClicked(params) {
        this.threeLevelData = JSON.parse(JSON.stringify(params.data))
        // if (this.threeLevelData && this.threeLevelData.caseTypeIds) {
        //   this.threeLevelData.caseTypeIds = this.threeLevelData.caseTypeIds.split(',').map(Number)
        // }
        if (this.threeLevelData.templateOptions) {
          this.$set(this.threeLevelData, 'exportItem1', Number(this.threeLevelData.templateOptions[0]))
          this.$set(this.threeLevelData, 'exportItem2', Number(this.threeLevelData.templateOptions[1]))
          this.$set(this.threeLevelData, 'exportItem3', Number(this.threeLevelData.templateOptions[2]))
        }
        this.title = '查看报价'
        this.editType = 'view'
        this.bjView = true
        this.drawerView = true
      },
      // 复制境外报价
      copyBj(row) {
        this.threeLevelData = JSON.parse(JSON.stringify(row))
        if (this.threeLevelData.templateOptions) {
          this.$set(this.threeLevelData, 'exportItem1', Number(this.threeLevelData.templateOptions[0]))
          this.$set(this.threeLevelData, 'exportItem2', Number(this.threeLevelData.templateOptions[1]))
          this.$set(this.threeLevelData, 'exportItem3', Number(this.threeLevelData.templateOptions[2]))
        }
        delete this.threeLevelData.createUserId
        delete this.threeLevelData.createUserIdStr
        delete this.threeLevelData.createDate
        delete this.threeLevelData.ocId
        if (this.threeLevelData.offerMadrids && this.threeLevelData.offerMadrids.length) {
          this.threeLevelData.offerMadrids.forEach(item => {
            delete item.ocId
          })
        }
        if (this.threeLevelData.countries && this.threeLevelData.countries.length) {
          this.threeLevelData.countries.forEach(item => {
            delete item.ocId
            delete item.countryId
            item.tmNumList = item.tmNumList && item.tmNumList.map(i => ({
              tmNum: i.tmNum,
              classNumPerTm: i.classNumPerTm
            })) || []
          })
        }
        this.title = '新建报价'
        this.editType = 'create'
        this.bjView = true
        this.drawerView = true
        this.isCopy = true
        this.$nextTick(() => {
          this.isCopy = false
        })
      },
      createBJ() {
        this.title = '新建报价'
        this.editType = 'create'
        this.bjView = true
        this.drawerView = true
      },
      queryCustomerList(query) {
        if (query !== '') {
          queryCustomerNameId({ pageNo: 1, pageSize: 100, keyword: query }).then(res => {
            this.customerNameIdList = res.data
          })
        }
      },
      clickoutside() {
        this.drawerState = false
      },
      handleSearch() {
        this.queryModuleData = JSON.parse(localStorage.getItem('queryModuleData'))
          && JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$route.name)
          && JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$route.name).queryModuleData
          || {}
        this.queryOfferCust()
      },
      clearSearch() {
        this.queryModuleData = {
          caseTypeId: '',
          changeType:'',
          custId: '',
          createUserId: '',
          createDateStart: '',
          createDateEnd: '',
          offerName: '',
          tmName: ''
        }
      },
      queryOfferCust() {
        queryOfferCust({
          ...this.queryModuleData,
          ...this.listQuery
        }).then(res => {
          this.bjTable = res.data
          this.total = res.total
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
        })
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
      rowClicked2(params) {
        this.listData = params.data
        this.visiable = true
      },
      rightDrag() {
        let that = this
        // document.getElementById('searchWrap').onscroll=function (e) {
        //   that.clearWrapTop = e.target.scrollTop+ e.target.offsetHeight
        //   document.getElementById('clearWrap').style.top = that.clearWrapTop -40 + 'px'
        // }
        document.querySelector('.left_wrap') && new this.$DraginResize(document.querySelector('.left_wrap'), {
          clone: true,
          end(info) {
            if (info.dir == 'ver') {
              this.elem.style.height = info.height + 'px'
            } else if (info.dir == 'hor') {
              this.elem.style.width = info.width + 'px'
              localStorage.setItem('leftWrapWidth', info.width + 'px')
              that.leftWrapWidth = info.width + 'px'
            }
          }
        })
      },
      changePattern(e) {
        if (e === 1) {
          this.$store.commit('user/SET_PATTERN', false)
        } else {
          this.$store.commit('user/SET_PATTERN', true)
          // if(this.caseList.length&&!this.currentId){
          //   let row=this.caseList.find((item,index)=>index==0)
          //   this.currentId=row[this.getCurFilterId(this.pageTitle)]
          //   this.currentCaseId=row.caseId
          //    this.$refs.caseListMultiple.setCurrentRow(row)
          // }
        }
      },
      brushRight() {
        this.brushRightHasFilter = false
        // let data =   this.$commonUtils.getFilterModel(this.$options.name+this.$route.name,'FilterModel')
        let arr = this.columnDefs.map(item => item.field)// Object.keys(data)
        arr.forEach(item => {
          this.gridApi.destroyFilter(item)
        })
      },
      closeDialog(isUpdate = false) {
        this.waibiView = false
        this.ZyView = false
        this.MDLView = false
        this.bjView = false
        this.editType = ''
        this.drawerView = false
        this.threeLevelData = {}
        isUpdate === true && this.handleSearch()
      },
      rowClicked(params) {
        if (params.node.expanded) {
          params.node.setExpanded(false)
        } else {
          params.node.setExpanded(true)
        }
        this.columnDefs.push({})
        this.columnDefs.pop()
      },
      getDiv(params) {
        let value = params.value
        if (params.colDef.field === 'sid' && value !== '') {
          value = params.rowIndex + 1
        }
        // if (params.colDef.field === 'madrid') {
        //   //0:指逐一国家A方案，1:指逐一+马德里B方案
        //   value = params.value ? '逐一+马德里B方案' : '逐一国家A方案'
        // }
        if (params.colDef.field === 'totalRMB') {
          value = params.data.serviceFee + params.data.officialFeeTotalRMB
        }
        if (['officialFeeTotalRMB', 'serviceFee', 'totalRMB', 'gzFee'].includes(params.colDef.field)) {
          value = formatAmount(params.value)
        }

        const h = this.$createElement
        let vNode = h('div', {
          on: {
            click: () => this.rowClicked2(params)
          },
          style: {
            height: '100%'
          },
          attrs:{
            title: value
          }
        }, `${value || ''}`)
        const div = document.createElement('div')
        this.__patch__(div, vNode, true, false)
        return div
      },
      getSidDiv(params) {
        let expandIndex = 10000
        if (params.colDef.field === 'sid') {
          this.gridApi.forEachNode(rowNode => {
            if (rowNode.expanded) {
              expandIndex = rowNode.rowIndex
            }
          })
        }
        const h = this.$createElement
        let vnode = params.node.data.offerMadrids ? h('div', {
            on: {
              click: () => this.rowClicked(params)
            }
          }, [

            h('i', {
              'class': {
                'el-icon-caret-right': true,
                'rotateClass': params.node.expanded
              }

            }),
            h('span', {
              attrs: {
                title: `${params.rowIndex <= expandIndex ? (params.rowIndex + 1) : params.rowIndex}`
              }
            }, [`${params.rowIndex <= expandIndex ? (params.rowIndex + 1) : params.rowIndex}`])
          ]
        ) : h('div', {}, [
            h('span', {
              attrs: {
                title: `${params.rowIndex + 1}`
              }
            }, [`${params.rowIndex + 1}`])
          ]
        )
        const div = document.createElement('div')
        this.__patch__(div, vnode, true, false)
        return div
      },
      preView(file) {
        return () => {
          let data = file
          let url = file.address
          if (getProgID(url) || ['eml', 'msg'].includes(url.replace(/.+\./, '').toLocaleLowerCase())) {
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
          } else if (['pdf', 'jpg', 'png'].some(item => url.replace(/.+\./, '').toLocaleLowerCase() == item)) {
            window.open(`/ipdoc${url}`.replace(/[+]/g, '%2B'))
          } else {
            this.downLoad(file)
          }
        }
      },
      downLoad(data) {
        const url = data.address
        const downData = {
          url: `ipdoc${url}`,
          success() {
            // notify.close()
          }
        }
        this.$commonUtils.downLoadAll(downData)
      },
      cellRenderer(params) {
        if (params.colDef.field === 'sid' && params.value !== '') {
          return this.getSidDiv(params)
        }
        if (params.colDef.field === 'totalA' || params.colDef.field === 'totalB') {
          return `<span title="${params.value}">${params.value ? formatAmount(params.value) : ''}</span>`
        }
        if (params.colDef.field === 'materials') {
          const h = this.$createElement
          let newDatas = []
          for (const i in params.value) {
            newDatas.push(h('p', {
              'class': {
                'fontColors': true
              },
              on:{
                click: this.preView(params.value[i])
              }
            }, params.value[i].materialName))
          }
          const vnode = h('div', {}, newDatas)
          const div = document.createElement('div');
          this.__patch__(div, vnode, true, false)
          return div
        }
        return `<span title="${params.value}">${params.value ? params.value : ''}</span>`
      },
      cellRenderer2(params) {
        return this.getDiv(params)
      },
      refreshEvenRowsCurrencyData(params) {
        // this.currentPageSize = params.api.rowModel.rootNode.allChildrenCount
        if (!params.columnApi.columnController.groupAutoColumns) {
          this.gridApi.forEachNode(rowNode => {
            rowNode.setDataValue(
              'sid',
              rowNode.rowIndex + 1)
          })
        }
        if (Object.keys(this.gridApi.getFilterModel()).length) {
          this.brushRightHasFilter = true
        } else {
          this.brushRightHasFilter = false
        }
      },
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
      getContextMenuItems1(params) {
        if (!params.node || !params.node.data) {
          return []
        }
        return this.getRowContextmenuList1(params.node.data).map(item => ({
          name: item.name,
          action: () => {
            this[item.action](params.node.data, params.value, params.node)
          }
        }))
      },
      editFun(row) {
        this.threeLevelData = JSON.parse(JSON.stringify(row))
        // if (this.threeLevelData && this.threeLevelData.caseTypeIds) {
        //   this.threeLevelData.caseTypeIds = this.threeLevelData.caseTypeIds.split(',').map(Number)
        // }
        if (this.threeLevelData.templateOptions) {
          this.$set(this.threeLevelData, 'exportItem1', Number(this.threeLevelData.templateOptions[0]))
          this.$set(this.threeLevelData, 'exportItem2', Number(this.threeLevelData.templateOptions[1]))
          this.$set(this.threeLevelData, 'exportItem3', Number(this.threeLevelData.templateOptions[2]))
        }
        this.title = '修改报价'
        this.editType = 'edit'
        this.bjView = true
        this.drawerView = true
      },
      handledeleElement(row) {
        // deleteOfferCust
        this.$wangConfirm('确定删除该报价吗？', () => {
          deleteOfferCust({
            ocId: row.ocId
          }).then(res => {
            this.$message.success('删除成功')
            this.bjTable.splice(this.bjTable.indexOf(row), 1)
          })
        }, () => {
          this.$message.info('已取消删除')
        })
      },
      getRowContextmenuList(row) {
        return [
          { name: '复制', action: 'copy' },
          { name: '复制境外报价', action: 'copyBj' },
          // { name: '商标导入', action: 'installtmmessage', permissions: 185 },
          { name: '修改', action: 'editFun', modifyPer: 1 },
          { name: '删除', action: 'handledeleElement', deletePer: 1 }
        ].filter(item => {
          if (item.modifyPer) {
            return row.modifyPer == item.modifyPer
          } else if (item.deletePer) {
            return row.deletePer == item.deletePer
          } else {
            return true
          }
        })
      },
      getRowContextmenuList1(row) {
        return [
          { name: '复制', action: 'copy' }
          // { name: '商标导入', action: 'installtmmessage', permissions: 185 },
          // { name: '修改', action: 'editFun' }
          // {name: '删除', action: 'handledeleElement', permissions: 74}
        ]
      },
      onGridReady(params) {
        this.gridparams = params
        this.gridApi = params.api
        this.columnApi = params.columnApi
        params.api.sizeColumnsToFit()
      }
    }
  }
</script>

<style lang="scss" scoped>
  > > > .el-drawer__body {
    overflow: auto;
  }

  /deep/ .rotateClass {
    transform: rotate(90deg);
    transition: transform 5s ease-in-out
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
      overflow: auto;
      transition: all 0.5s;
      flex: 1;
      z-index: 1;

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

  .brush_right {
    position: absolute;
    right: 16px;
    top: 6px;
    z-index: 4;
  }

  .button-group-search {
    /*position: relative;*/
    display: flex;

    .searchWrap {
      border-radius: 5px;
      top: 50px;
      left: 0;
      width: 550px;
      max-height: 500px;
      position: absolute;
      background: #ffffff;
      border: 1px solid #d4d5d5;
      z-index: 4;
      overflow: hidden;
      /*padding: 20px 0;*/
      box-shadow: 0 3px 6px rgba(111, 111, 111, 0.2);

      /deep/ .el-form {
        padding: 20px 0;

        .el-form-item__label {
          text-align: left;
          padding-left: 32px;
          font-weight: normal;
        }

        .el-form-item__content {
          display: flex;

          input {
            border-top: 0;
            border-left: 0;
            border-radius: 0;
            border-right: 0
          }

          .el-radio {
            line-height: 28px;
          }
        }
      }

      .clearWrap {
        display: flex;
        justify-content: flex-end;
        /*width: 100%;*/
        background: #fff;
        right: 10px;
        bottom: 0;
        padding-bottom: 10px;
        position: absolute;
        z-index: 1;
      }
    }
  }

  > > > .searchWrap {
    .el-form-item__content {
      width: 50%;
    }
  }
  .fontColors{
    color: #409eff;
    cursor: pointer;
  }
</style>
