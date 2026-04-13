<template>
  <div id="custom-list" class="custom-list" style="position:relative;padding: 10px 10px 0px 10px">
    <!--        <el-button @click="openDrawer">打开</el-button>-->
    <!--  顶部面板  -->
    <div class="top-panel" v-if="$store.getters.permissions.includes(416)" :style="{height: topChartHide ? 0 : '', overflow: topChartHide ? 'hidden' : ''}">
      <div class="item-panel" style="min-width: 365px;position:relative;overflow: unset">
        <objectives-overview @showOne="showOne" ref="objectives"></objectives-overview>
      </div>
      <div class="item-panel" style="min-width: 250px;position:relative;overflow: visible">
        <new-cust-num @showOne="showOne" ref="newCust" v-if="custNumData.finish"
                      :cust-num-data="custNumData"></new-cust-num>
      </div>
      <div class="item-panel" style="min-width: 100px;">
        <potential-cust :num="custNumData.potentialCustCount"></potential-cust>
      </div>
      <div class="item-panel1">
        <div class="warning-div">
          <cust-warning></cust-warning>
          <div class="hide-div" @click="hideTopCharts">
            <span class="el-icon-caret-left"></span>
            <div class="text">收<br/>起</div>
          </div>
        </div>

      </div>
    </div>

    <!--  中间搜索框  -->
    <div class="search-box" :style="{marginTop: topChartHide ? '0' : '10px'}">
      <div class="search-left">
        <div>
          <el-input :placeholder="$store.getters.permissions.includes(271) ? '客户模糊检索' : '客户检索(至少2个字)'" prefix-icon="el-icon-search" ref="searchRef" @change="(value) => {!value && vagueSearch('')}"
                    clearable v-model="queryModuleData.keywords"
                    @keyup.enter.native="(e)=> vagueSearch(e.target.value, true)">
            <!--            <template slot="prepend"><span class="el-icon-search"></span></template>-->
          </el-input>
        </div>
        <el-tooltip class="item" effect="dark" content="全局查找" placement="right">
          <i style="color: #409EFF;margin-left: 5px;cursor:pointer;" class="el-icon-s-opportunity" @click="setHighLight(queryModuleData.keywords)"></i>
        </el-tooltip>

        <div class="search-border" :class="queryModuleData.kuaijie === item.id ? 'choice-item' : ''"
             @click="choiceItem(item)"
             v-for="(item, index) in [{label: '我负责的', id: 1, num: filterNum.mine}, {label: '活跃客户', id: 2, num: filterNum.chengjiao}, {label: '重要客户', id: 3, num: filterNum.important}, {label: '潜在客户', id: 4, num: filterNum.qianzai}]"
             :key="item.label">
          <div class="search-item">
            <img src="../customer_list/assets/images/file.svg">
            <div>
              <div>{{item.num}}</div>
              <div>{{item.label}}</div>
            </div>
          </div>
        </div>
        <search-btn v-allow="271" ref="searchBtn" :buss-id="17" :name="$options.name" @search="handleSearch"></search-btn>
      </div>
      <div class="search-right-btn">
        <el-button type="primary" v-allow="42" @click="createCustomer">
          <span class="el-icon-plus"></span>
          新建客户
        </el-button>
      </div>
      <div class="show-div" @click="showTopCharts" v-if="$store.getters.permissions.includes(416) && topChartHide">
        <span class="el-icon-caret-right"></span>
        <div class="text">展<br/>开</div>
      </div>
    </div>

    <!--  客户列表  -->
    <div style="position: relative;">
      <div class="dots" @click="handleCheckboxState">
        <span class="dot">.</span>
        <span class="dot">.</span>
        <span class="dot">.</span>
      </div>
      <div class="export" v-allow="417">
        <el-button type="text" @click="exportList(2)">导出</el-button>
        <span style="color: #52A2F4;margin: 0 5px"> / </span>
        <el-button type="text" @click="exportList(1)">全局导出</el-button>
      </div>
      <el-button class="brush_right" :class="brushRightHasFilter?'red':''" @click="brushRight" type="text"
                 icon="el-icon-brush"></el-button>
      <AgGridVue :style="{width:'100%',height: clientHeight+'px', marginTop: '30px'}"
                 class="ag-theme-balham"
                 :columnDefs="columnDefs"
                 :rowData="custList"
                 rowSelection="multiple"
                 @grid-ready="onGridReady"
                 :gridOptions="gridOptions"
                 @dragStopped="dragStopped"
                 :getContextMenuItems="getContextMenuItems"
                 @rowDoubleClicked="rowDoubleClicked"
                 suppressAutoSize

                 animateRows
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
      <pagination v-show="total > 0" :total="total" :pageSizes="pageSizesList" :page.sync="listQuery.pageNo"
                  :limit.sync="listQuery.pageSize" @pagination="getList"/>
      <div class="checkbox" v-if="checkboxState">
        <el-select ref="checkCaseSelect" v-model="checkCaseList" multiple reserve-keyword filterable placeholder="请选择"
                   collapse-tags @visible-change="handleChange" :filter-method="filterCheck">
          <template slot="">
            <div class="checkbox_bottom">
              <el-button size="mini" round @click.stop="delPreference(1)">恢复默认</el-button>
              <el-button style="margin-right: 3px" size="mini" round @click.stop="savePreference(1)">保存设置</el-button>
            </div>
          </template>
          <el-option
            v-for="item in selectColumnList.filter(item =>item.COLUMN_COMMENT.includes(filterText))"
            :key="item.COLUMN_NAME"
            :label="item.COLUMN_COMMENT"
            :value="item.COLUMN_NAME">
          </el-option>
        </el-select>
      </div>
    </div>


    <!--   客户详情/创建 右侧drawer  -->
    <right-drawer
      :visible="drawerView"
      :width="75"
      @close="closeDrawer"
    >
      <custom-detail :style="cssVar" :isExamine="isExamine" :isSubmit="isSubmit" :isCreated="isCreated"
                     :editStatus="editStatus"
                     style="width: 100%;"
                     ref="custDetail"
                     :examineStatusStr="examineStatusStr"
                     :customerData="customerData"
                     @changeEditStatus="changeEditStatus"
                     @updateCust="updateCust"
                     @changeIsCreated="changeIsCreated"
                     @closeDetail="closeDetail"></custom-detail>
    </right-drawer>

    <SelectOption :buss-id="bussId" v-if="selectionOptionState" :dialog-visible="selectionOptionState"
                  @cancel="closeSelect" :idArray="getCurrentRowsData('custId')"
                  :defaultMultipleSelect="preferenceList.map(i=>i.label)" :exportType="exportType"
                  :exportQueryModel="exportQueryModel"></SelectOption>

    <merge-cust @closeMergeDialog="closeMergeDialog" v-if="mergeCustView" :dialogVisible="mergeCustView" :dialogTitle="dialogTitle" :custName="mergeCustName" :custId="mergeCustId"></merge-cust>
  </div>
</template>

<script>
  import ECharts from 'vue-echarts'
  import "echarts/lib/chart/line";
  import "echarts/lib/chart/bar";
  import "echarts/lib/chart/pie";
  import "echarts/lib/chart/scatter";
  import "echarts/lib/chart/radar";
  import "echarts/lib/chart/map";
  import "echarts/lib/chart/tree";
  import "echarts/lib/chart/treemap";
  import "echarts/lib/chart/graph";
  import "echarts/lib/chart/gauge";
  import "echarts/lib/chart/funnel";
  import "echarts/lib/chart/parallel";
  import "echarts/lib/chart/sankey";
  import "echarts/lib/chart/boxplot";
  import "echarts/lib/chart/candlestick";
  import "echarts/lib/chart/effectScatter";
  import "echarts/lib/chart/lines";
  import "echarts/lib/chart/heatmap";
  import "echarts/lib/chart/pictorialBar";
  import "echarts/lib/chart/themeRiver";
  import "echarts/lib/chart/sunburst";
  import "echarts/lib/chart/custom";
  import "echarts/lib/component/grid";
  import "echarts/lib/component/polar";
  import "echarts/lib/component/geo";
  import "echarts/lib/component/singleAxis";
  import "echarts/lib/component/parallel";
  import "echarts/lib/component/calendar";
  import "echarts/lib/component/graphic";
  import "echarts/lib/component/toolbox";
  import "echarts/lib/component/tooltip";
  import "echarts/lib/component/axisPointer";
  import "echarts/lib/component/brush";
  import "echarts/lib/component/title";
  import "echarts/lib/component/timeline";
  import "echarts/lib/component/markPoint";
  import "echarts/lib/component/markLine";
  import "echarts/lib/component/markArea";
  import "echarts/lib/component/legendScroll";
  import "echarts/lib/component/legend";
  import "echarts/lib/component/dataZoom";
  import "echarts/lib/component/dataZoomInside";
  import "echarts/lib/component/dataZoomSlider";
  import "echarts/lib/component/visualMap";
  import "echarts/lib/component/visualMapContinuous";
  import "echarts/lib/component/visualMapPiecewise";
  import "echarts/lib/component/dataset";
  import theme from "../../platformData/companyDashboard/components/shine.json"

  ECharts.registerTheme("ovilia-green", theme);
  import RightDrawer from "./RightDrawer"
  import SearchBtn from "./SearchBtn"
  import {checkPermission, delPreference, queryPreference, savePreference, selectColumn} from "../../../../api/caseList"
  import {
    addCustomer,
    delCustomer,
    fetchList,
    queryAppInfoUrl, queryCustKuaijieCounts,
    queryCustomerUrl, queryCustStatistics,
    searchtmdataUrl
  } from "../../../../api/customerList"
  import Pagination from "../../../../components/Pagination/index"
  import CustomDetail from "./CustomDetail";
  import NewCustNum from "./top_data/NewCustNum";
  import PotentialCust from "./top_data/PotentialCust";
  import CustWarning from "./top_data/CustWarning";
  import ObjectivesOverview from "./top_data/ObjectivesOverview";
  import Bus from '@/utils/Bus'
  import SelectOption from "../../case/components/SelectOption";
  import MergeCust from "./MergeCust";

  export default {
    name: "cust_list",
    components: {
      MergeCust,
      SelectOption,
      ObjectivesOverview,
      CustWarning, PotentialCust, NewCustNum, Pagination, SearchBtn, RightDrawer, CustomDetail
    },
    data() {
      let tableHeader = []
      if (localStorage.getItem('tableHeader') && JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name)) {
        tableHeader = JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name).tableHeader
      }
      return {
        mergeCustId: '',
        mergeCustName: '',
        mergeCustView: false,
        dialogTitle: '',
        examineStatusStr: '',
        topChartHide: false,
        needUpdate: false,
        isSubmit: false,
        custNumData: {},
        filterNum: {},
        editStatus: false,
        searchFlag: 0,
        queryModuleData: {
          isCustomer: 1
        },
        currentCustId: '',
        customerData: {
          caseType: '',
          mailConfigs: [1, 2, 3],
          custGrade: '',
          name: "",
          custId: "",
          examineStatus: "1623",
          userIcon: "",
          materiaoList: [],
          fullname: "",
          fullnameEn: "",
          fgFullname: "",
          contactLanguage: "",
          isCollaboration: "",
          firstcaseCollitem: "",
          parentCustId: "",
          legalNature: "",
          isAgent: "",
          curStatus: "",
          certType: "",
          idNumber: "",
          level: "",
          actLevel: "",
          source: '',
          certCode: "",
          custIntroductor: "",
          custIntroCompany: "",
          ownerDeptid: "",
          country: "",
          continent: "",
          province: "",
          city: "",
          website: "",
          fax1: "",
          phone: "",
          email: "",
          info: "",
          memo: "",
          isOfficial: "",
          isCustomer: "1",
          curStatusDesc: "",
          annualAccDate: "",
          mailConfig: [],
          ourImporter: "",
          auditUserName: "",
          customerAddrs: [],
          customerContacts: [],
          activities: [],
          agencyContacts: [],
          customerRequirements: [],
          customerAssociates: [],
          conflicters: [],
          customerIndustrys: [],
          materialList: [],
          customerResponsibleArray: [],
          ctData: []
        },
        listQuery: {
          pageSize: JSON.parse(localStorage.getItem('pageSize')) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name).pageSize : 10 : 10,
          pageNo: 1,
          isCustomer: 1
        },
        tableHeader,
        pageSizesList: [10, 50, 200, 500, 1000, 5000, 10000],
        autoGroupColumnDef: {
          headerName: '组',
          field: 'group',
          headerCheckboxSelection: true,
          cellRenderer: 'agGroupCellRenderer',
          cellRendererParams: {checkbox: true},
        },
        columnDefs: [],
        gridOptions: {
          ...this.$store.state.caseInformation.gridOptions, ...{
            statusBar: {
              statusPanels: [
                {statusPanel: 'agSelectedRowCountComponent', align: 'left'},
                {statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left'},
              ]
            },
            getRowStyle: (params) => {
              if (params.node.data) {
                if (params.node.data.isCheck == 0) {
                  return {background: '#DCDFE6'}
                }
              }
            },
            //floatingFilter: true,
          }
        },
        custList: [],
        drawerView: false,
        gridApi: {},
        columnApi: {},
        bussId: 17,
        preferenceList: [],
        defaultcolumnDefs: [
          {
            headerName: '序号',
            field: 'sid',
            width: 80,
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
          },
        ],
        checkCaseList: [],
        total: 0,
        exportQueryModel: {},
        brushRightHasFilter: false,
        checkboxState: false,
        isCreated: false,
        isExamine: false,
        selectColumnList: [],
        filterText: '',
        exportType: '',
        selectionOptionState: false,
        multipleTypeText: '',
        selectionState: false,
        searchResultsHighlightResult: [],
        searchResultsHighlightResult1: [],
      }
    },
    watch: {
      checkboxState(n) {
        if (n) {
          this.$nextTick(() => {
            this.$refs.checkCaseSelect.focus()
          })
        }
      },
      highLightList: {
        handler(n) {
          if(n.length) {
            n.forEach(item => {
              this.setTabHighLight(item)
            })
          }
        },
      }
    },
    computed: {
      cssVar() {
        return {
          '--height': 'calc(100vh - 260px)'
        }
      },
      clientHeight() {
        return document.documentElement.clientHeight - (this.topChartHide ? 190 : 390)
      },
      highLightList() {
        return this.$store.state.app.highLightList
      },
    },
    beforeDestroy() {
      Bus.$off('updateStatics')
      Bus.$off('highLightEvent')
    },
    created() {
      Bus.$on('updateStatics', () => {
        this.$refs.objectives.init()
      })
      Bus.$on('highLightEvent', () => {
        setTimeout(() => {
          this.setHighLight(this.queryModuleData.keywords, true)
        }, 510)
      })
      if (!this.$store.getters.permissions.includes(416)){
        this.topChartHide = true
      }
      this.getAllWfs()
      const queryData = JSON.parse(localStorage.getItem('queryModuleData')) // 全部搜索数据
        && JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$options.name)
        && JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$options.name).queryModuleData
        || {}
      if (queryData.keywords) {
        this.$set(this.queryModuleData, 'keywords', queryData.keywords)
      }
      if (queryData.kuaijie) {
        this.$set(this.queryModuleData, 'kuaijie', queryData.kuaijie)
      }
      if (this.$route.query.custName) {
        this.$set(this.queryModuleData, 'keywords', this.$route.query.custName)
      }
      (this.$store.getters.permissions.includes(271) || this.$route.query.custName) && this.handleSearch(1)
      this.queryKuaijieCounts()
      this.queryCustStatistics()
    },
    methods: {
      setTabHighLight(valueText) {
        const root = document.querySelector('.el-tabs__header');
        const treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        const allTextNodes = [];
        let currentNode = treeWalker.nextNode();
        while (currentNode) {
          allTextNodes.push(currentNode);
          currentNode = treeWalker.nextNode();
        }
        if (!valueText) {
          return
        }
        let indices = [] // 位置信息
        const ranges = allTextNodes
          .map((el) => {
            return { el, text: el.textContent.toLowerCase() };
          })
          .map(({ text, el }) => {
            let startPos = 0
            while (startPos < text.length) {
              const index = text.indexOf(valueText, startPos);
              if (index === -1) break
              indices.push({
                el,
                start: index,
                end: index + valueText.length
              });
              startPos = index + valueText.length;
            }
          });
        // 根据搜索词的位置创建选区
        let result = indices.map(item => {
          let range = new Range();
          range.setStart(item.el, item.start);
          range.setEnd(item.el, item.end);
          return range
        });
        // 创建高亮对象
        const searchResultsHighlight = new Highlight(...result, ...this.searchResultsHighlightResult);
        this.searchResultsHighlightResult = [...result, ...this.searchResultsHighlightResult]

        // 注册高亮
        CSS.highlights.set("search-results", searchResultsHighlight);
      },
      setHighLight(valueText, flag) {
        const root = document.documentElement;
        const treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        const allTextNodes = [];
        let currentNode = treeWalker.nextNode();
        while (currentNode) {
          allTextNodes.push(currentNode);
          currentNode = treeWalker.nextNode();
        }
        // 清除上个高亮
        CSS.highlights.clear();
        if (!valueText) {
          return
        }
        !flag && this.$store.commit('app/SET_HIGHT_LIST', '')
        this.$store.commit('app/SET_HIGH_LIGHT', valueText)
        let indices = [] // 位置信息
        const ranges = allTextNodes
          .map((el) => {
            return { el, text: el.textContent.toLowerCase() };
          })
          .map(({ text, el }) => {
            let startPos = 0
            while (startPos < text.length) {
              const index = text.indexOf(valueText.toLowerCase(), startPos);
              if (index === -1) break
              indices.push({
                el,
                start: index,
                end: index + valueText.length
              });
              startPos = index + valueText.length;
            }
          });
        // 根据搜索词的位置创建选区
        let result = indices.map(item => {
          let range = new Range();
          range.setStart(item.el, item.start);
          range.setEnd(item.el, item.end);
          return range
        });
        // 创建高亮对象
        const searchResultsHighlight = new Highlight(...result);
        this.searchResultsHighlightResult = result
        // 注册高亮
        CSS.highlights.set("search-results", searchResultsHighlight);
      },
      changeIsCreated(data) {
        this.isCreated = false
        this.editStatus = true
        this.$set(this, 'customerData', data)
      },
      closeMergeDialog(isSearch) {
        isSearch === true && this.handleSearch()
        this.mergeCustView = false
        this.dialogTitle = ''
        this.mergeCustName = ''
        this.mergeCustId = ''
      },
      closeSelect() {
        this.selectionState = false
        this.selectionOptionState = false
      },
      getCurrentRowsData(key) {
        if (this.gridApi && this.gridApi.rowModel) {
          return this.gridApi.rowModel.rootNode.childrenAfterSort.map(item => item.data).map(item => item[key])
        }
        return []
      },
      exportList(flag) {
        this.exportType = flag
        if (flag == 2) {
          this.selectionOptionState = true;
          this.multipleTypeText = '列表导出';
        } else if (flag == 1) {
          this.selectionOptionState = true
        }
      },
      showTopCharts() {
        this.topChartHide = false
      },
      hideTopCharts() {
        this.topChartHide = true
      },
      showOne(type) {
        if (type === 'objectOverview') {
          this.$refs.newCust && this.$refs.newCust.clickoutside()
        } else if (type === 'newCust') {
          this.$refs.objectives && this.$refs.objectives.clickoutside()
        }
      },
      vagueSearch(e, forceSearch) {
        if (!e) {
          this.$set(this.queryModuleData, 'kuaijie', undefined)
          if (forceSearch) {
            this.handleSearch(1)
          } else {
            this.$refs.searchRef.focus()
          }
        } else {
          if (this.$store.getters.permissions.includes(271)) {
            this.$set(this.queryModuleData, 'kuaijie', undefined)
            this.handleSearch(1, !e)
          } else {
            e && e.length > 1 && this.$set(this.queryModuleData, 'kuaijie', undefined)
            e && e.length > 1 && this.handleSearch(1, !e)
          }
        }
      },
      savePreference() {
        let list2 = this.checkCaseList.map(item => ({
          title: this.selectColumnList.find(i => i.COLUMN_NAME === item).COLUMN_COMMENT,
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
            this.getList(this.searchFlag)
            this.getAllWfs()
          }
        })
      },
      delPreference() {
        const data = {
          userId: this.$store.getters.userId,
          bussId: this.bussId,
        }
        delPreference(data).then(res => {
          if (res.success) {
            this.checkboxState = false
            this.handleSearch()
            this.getAllWfs()
          }
        })
      },
      filterCheck(val) {
        this.filterText = val;
      },
      handleChange(boolean) {
        if (!boolean) {
          this.checkboxState = false
          const els1 = this.$el.getElementsByClassName('checkbox')[0]
          els1.children[0].click()
        }
      },
      queryCustStatistics() {
        queryCustStatistics().then(res => {
          this.custNumData = res.data
          this.custNumData.finish = true
        })
      },
      choiceItem(item) {
        if (this.queryModuleData.kuaijie === item.id) {
          this.$set(this.queryModuleData, 'kuaijie', undefined)
        } else {
          this.$set(this.queryModuleData, 'kuaijie', item.id)
        }
        this.$set(this.queryModuleData, 'keywords', undefined)
        this.handleSearch(1)
      },
      queryKuaijieCounts() {
        queryCustKuaijieCounts().then(res => {
          this.filterNum = res.data
        })
      },
      updateCust(flag) {
        this.needUpdate = flag
        this.isExamine = false
        this.isCreated = false
      },
      closeDetail(isSearch) {
        this.isExamine = false
        this.isSubmit = false
        this.isCreated = false
        this.editStatus = false
        this.drawerView = false
        this.currentCustId = '';
        (isSearch === true || this.needUpdate) && this.getList()
        this.customerData = {
          mailConfigs: [1, 2, 3],
          custGrade: '',
          name: "",
          custId: "",
          examineStatus: "1623",
          userIcon: "",
          materiaoList: [],
          fullname: "",
          fullnameEn: "",
          fgFullname: "",
          contactLanguage: "",
          isCollaboration: "",
          firstcaseCollitem: "",
          parentCustId: "",
          legalNature: "",
          isAgent: "",
          curStatus: "",
          certType: "",
          idNumber: "",
          level: "",
          actLevel: "",
          source: '',
          certCode: "",
          custIntroductor: "",
          custIntroCompany: "",
          ownerDeptid: "",
          country: "",
          continent: "",
          province: "",
          city: "",
          website: "",
          fax1: "",
          phone: "",
          email: "",
          info: "",
          memo: "",
          isOfficial: "",
          isCustomer: "1",
          curStatusDesc: "",
          annualAccDate: "",
          mailConfig: [],
          ourImporter: "",
          auditUserName: "",
          customerAddrs: [],
          customerContacts: [],
          activities: [],
          agencyContacts: [],
          customerRequirements: [],
          customerAssociates: [],
          conflicters: [],
          customerIndustrys: [],
          materialList: [],
          customerResponsibleArray: [],
          ctData: []
        }
        this.needUpdate = false
        // this.closeDrawer()
      },
      createCustomer() {
        this.$set(this.customerData, 'reviewSubmitter', this.$store.getters.userId)
        this.$set(this.customerData, 'isCreated', true)
        this.$set(this.customerData, 'submissionDepartmentStr', this.$store.getters.userList.find(item => item.userId == this.$store.getters.userId) && this.$store.getters.userList.find(item => item.userId == this.$store.getters.userId).domainName || '')
        this.isCreated = true
        this.editStatus = true
        this.drawerView = true
        // addCustomer({isCustomer: 1}).then(response => {
        //   this.isCreated = true
        //   this.editStatus = true
        //   this.drawerView = true
        //   if (response.success) {
        //     this.customerData = response.data
        //     this.customerData.reviewSubmitter = this.$store.getters.userId
        //     this.customerData.submissionDepartmentStr = this.$store.getters.userList.find(item => item.userId == this.$store.getters.userId).domainName
        //   } else {
        //     this.$message.error(response.message);
        //   }
        // })
      },
      changeEditStatus(bool) {
        this.editStatus = bool
      },
      brushRight() {
        let data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel')
        let arr = Object.keys(data)
        arr.forEach(item => {
          this.gridApi.destroyFilter(item)
        })
        this.$commonUtils.saveFilterModel(this.$options.name + this.$route.name, 'FilterModel', {})
      },
      handleCheckboxState() {
        this.checkboxState = !this.checkboxState;
      },
      handleSearch(flag) {
        this.queryModuleData.keywords && this.$set(this.queryModuleData, 'kuaijie', undefined)
        this.queryModuleData.kuaijie && this.$set(this.queryModuleData, 'keywords', undefined)
        this.searchFlag = flag // 0: 搜索按钮内部搜索， 1：外面模糊搜索和过滤条件
        this.getList(flag)
      },
      getList(flag) {
        const queryData = JSON.parse(localStorage.getItem('queryModuleData')) // 全部搜索数据
          && JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$options.name)
          && JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$options.name).queryModuleData
          || {}
        let data = {}
        if (this.searchFlag) { // 外部
          data = JSON.parse(JSON.stringify(this.queryModuleData))
        } else { // 内部
          data = JSON.parse(JSON.stringify(queryData))
          delete data.keywords
          delete data.kuaijie
          delete this.queryModuleData.keywords
          delete this.queryModuleData.kuaijie
        }
        typeof flag === 'number' && (this.listQuery.pageNo = 1)
        let arr = []
        if (JSON.parse(localStorage.getItem('queryModuleData'))) {
          arr = JSON.parse(localStorage.getItem('queryModuleData'))
        } else {
          arr = []
        }
        if (arr.find(item => item.name == this.$options.name)) {
          arr.find(item => item.name == this.$options.name).queryModuleData = {...queryData, ...this.queryModuleData}
        } else {
          arr.push({name: this.$options.name, queryModuleData: {...queryData, ...this.queryModuleData}})
        }
        localStorage.setItem('queryModuleData', JSON.stringify(arr))
        fetchList({...this.listQuery, ...data}).then(response => {
          this.custList = response.data || []
          this.total = response.total
          this.exportQueryModel = JSON.stringify({...queryData, ...this.queryModuleData})
          if (this.custList.length) {
            this.getFilterModel()
          }
          if (this.$route.query.custName && this.$route.query.custName == this.queryModuleData.keywords && this.custList.length) {
            this.rowDoubleClicked({data: this.custList[0]})
          }
        })
      },
      async getAllWfs() {
        const data = {
          userId: this.$store.getters.userId,
          bussId: this.bussId
        }
        Promise.all([selectColumn(data), queryPreference(data)]).then(res => {
          this.selectColumnList = res[0].data
          this.preferenceList = res[1].data
          this.columnDefs = [...this.defaultcolumnDefs, ...this.preferenceList.map(item => ({
            headerName: item.title,
            field: item.value,
            width: this.getLoactionWidth(item.title) == 'auto' ? 200 : this.getLoactionWidth(item.title),
            resizable: true,
            sortable: true,
            enableRowGroup: true,
            filter: 'agSetColumnFilter',
            cellRenderer: this.cellRenderer,
            filterParams: {
              comparator: (a, b) => {
                return this.$commonUtils.sort(a, b, item.value)
              }
            },
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
          }))]
          this.$nextTick(() => {
            this.columnDefs.forEach(item => {
              this.columnApi.getColumn(item.field).addEventListener('menuVisibleChanged', () => {
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
              });
            })
          })
          this.tableHeader = this.preferenceList.map(item => ({
            label: item.title,
            prop: item.value,
            width: this.getLoactionWidth(item.title)
          }))
          this.saveLocation()
          this.checkCaseList = this.preferenceList.map(item => item.value)
        })
      },
      refreshEvenRowsCurrencyData(params) {
        // this.currentPageSize = params.api.rowModel.rootNode.allChildrenCount
        this.gridApi.rowModel.rootNode.childrenAfterFilter && this.gridApi.rowModel.rootNode.childrenAfterFilter.length && this.gridApi.rowModel.rootNode.childrenAfterFilter.forEach(rowNode => {
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
        if (this.custList.length) {
          if (params.type == "filterChanged") {
            let obj = this.gridApi.getFilterModel()
            for (let k in obj) {
              if (obj.hasOwnProperty(k)) {
                if (obj[k].values && !obj[k].values.length) {
                  delete obj[k]
                }
              }
            }
            Object.keys(obj).length && this.$commonUtils.saveFilterModel(this.$options.name + this.$route.name, 'FilterModel', this.gridApi.getFilterModel())
            var data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel');
            var arr = Object.keys(data);
            if (arr.length) {
              if (arr.length == 1 && arr[0] == 'gfCreateDate' && data.gfCreateDate.values.length == 0) {
                this.brushRightHasFilter = false
              } else {
                this.brushRightHasFilter = true
              }
            } else {
              this.brushRightHasFilter = false
            }
            // if(arr.length){
            //   this.brushRightHasFilter=true
            // }else {
            //   this.brushRightHasFilter=false
            // }
          }
          if (params.type == "sortChanged") {
            this.$commonUtils.saveFilterModel(this.$options.name + this.$route.name, 'SortModel', this.gridApi.getSortModel())
          }
        }
      },
      getLoactionWidth(label) {
        if (!localStorage.getItem('tableHeader')) {
          return 'auto'
        } else {
          var arr = JSON.parse(localStorage.getItem('tableHeader'))
          if (arr.find(item => item.name == this.$options.name)) {
            var header = arr.find(item => item.name == this.$options.name).tableHeader
            if (header.find(item => item.label == label)) {
              return header.find(item => item.label == label).width
            } else {
              return 'auto'//String(label).replace(/[\u4E00-\u9FA5]/gi,'aa').length*12+30
            }
          } else {
            return 'auto'
          }
        }
      },
      copy(row, value) {
        if (value) {
          this.$copyText(value)
        }
      },
      saveLocation() {
        if (!localStorage.getItem('tableHeader')) {
          let arr = []
          arr.push({name: this.$options.name, tableHeader: this.tableHeader})
          localStorage.setItem('tableHeader', JSON.stringify(arr))
        } else {
          let arr = JSON.parse(localStorage.getItem('tableHeader'))
          if (arr.find(item => item.name == this.$options.name)) {
            arr.find(item => item.name == this.$options.name).tableHeader = this.tableHeader
            localStorage.setItem('tableHeader', JSON.stringify(arr))
          } else {
            arr.push({name: this.$options.name, tableHeader: this.tableHeader})
            localStorage.setItem('tableHeader', JSON.stringify(arr))
          }
        }
      },
      cellRenderer(params) {
        // if (params.colDef.field == 'sid') {
        //   return `<span>${params.rowIndex + 1}<span class="el-icon-search" style="margin-left: 10px;cursor: pointer" @click="${this.setHighLight}"></span></span>`
        // }
        if (params.colDef.field === 'sid') {
          const h = this.$createElement
          const vnode = h('div', [params.rowIndex + 1
          //   , h('span', {
          //   'class': {
          //     'el-icon-search': !!this.queryModuleData.keywords
          //   },
          //   style: {
          //     marginLeft: '10px',
          //     cursor: 'pointer'
          //   },
          //   attrs: {
          //     title: '全局查找'
          //   },
          //   on: {
          //     click: () => this.setHighLight(this.queryModuleData.keywords)
          //   }
          // }, '')
          ])
          const div = document.createElement('div')
          this.__patch__(div, vnode, true, false)
          return div
        }else if(params.colDef.field === 'isAgent'){
          return `<span">${params.value == 1 ? '是' : '否'}</span>`
        }
        return `<span title="${params.value}">${params.value ? params.value : ''}</span>`
      },
      rowDoubleClicked(params) {
        this.$store.commit('app/SET_HIGHT_LIST', '')
        this.showOne('objectOverview')
        this.showOne('newCust')
        this.isCreated = false
        this.editStatus = false
        this.isExamine = false
        this.isSubmit = false
        if (!params.data.isCheck) return
        if (this.currentCustId === params.data.custId) return
        queryCustomerUrl({customerID: params.data.custId}).then(res => {
          this.customerData = res.data
          this.examineStatusStr = params.data.examineStatusStr
          if (this.drawerView === true) {
            this.drawerView = false
            this.currentCustId = ''
            setTimeout(() => {
              this.currentCustId = params.data.custId
              this.drawerView = true
            }, 400)
          } else {
            this.currentCustId = params.data.custId
            this.drawerView = true
          }
        })
      },
      getContextMenuItems(params) {
        if (!params.node.data) {
          return []
        }
        return this.getRowContextmenuList(params.node.data).map(item => {
          if (!item.subMenu) {
            return {
              name: item.name,
              action: () => {
                this[item.action](params.node.data, params.value)
              },
            }
          } else {
            return {
              name: item.name,
              subMenu: item.subMenu.map((itm, idx) => ({
                name: itm.name,
                action: () => {
                  if (item.name == '商标') {
                    this[itm.action]((idx + 1), params.node.data)
                  } else {
                    this[itm.action]((idx + 1), params.node.data)
                  }
                },
              }))
            }
          }
        })
      },
      listajbtn(val, row) {
        if (val == "1") {
          this.$router.push({
            path: "/workbench/case/case_search",
            query: {name: row.name, custId: row.custId}
          });
        }
      },
      listsbbtn(val, row) {
        if (val == "1") {
          this.$router.push(
            "/workbench/trademark/trademark_list/" + row.custId + "/" + row.name
          );
        }
        if (val == "2") {
          queryAppInfoUrl({custId: row.custId}).then(res => {
            if (res.data.map(ite => ite.applicantName).join(",")) {
              searchtmdataUrl({
                appName: res.data.map(ite => ite.applicantName).join(",")
              }).then(res => {
                this.$message.success(res.message);
              });
            } else {
              this.$message.error("请先给该客户添加申请人。");
            }
          });
        }
        if (val == "3") {
        }
      },
      goApp(row) {
        this.$router.push({
          path: "/workbench/customer_management/applicant_list",
          query: {name: row.name, custId: row.custId}
        })
      },
      takebill(row) {
        this.$router.push({path: "/workbench/finance/bill", query: {name: row.name, custId: row.custId}})
      },
      examine(row) {
        this.rowDoubleClicked({data: row})
        this.editStatus = true
        this.isExamine = true
      },
      custZs(row) {
        this.rowDoubleClicked({data: row})
      },
      handledeleElement(item) {
        var index = this.custList.indexOf(item)

        checkPermission({customerId: item.custId}).then(res => {
          if (res.data.delete == 0) {
            this.$message.error('该客户您无法删除')
          } else {
            this.$confirm("此操作将永久删除该客户, 是否继续?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                delCustomer({
                  customerID: item.custId
                }).then(response => {
                  if (response.success) {
                    this.custList.splice(index, 1)
                    this.$message({
                      type: "success",
                      message: "删除成功"
                    })
                  } else {
                    this.$message.error(response.message);
                  }
                })
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消删除"
                })
              })
          }
        })
      },
      takeModify(row) {
        this.rowDoubleClicked({data: row})
        this.editStatus = true
      },
      submitCust(row) {
        this.rowDoubleClicked({data: row})
        this.isSubmit = true
        this.editStatus = true
      },
      mergeCust(row) {
        this.mergeCustView = true
        this.dialogTitle = '合并客户'
        this.mergeCustName = row.fullname
        this.mergeCustId = row.custId
      },
      getRowContextmenuList(row) {
        return [
          {name: '复制', action: 'copy'},
          {name: '审查', action: 'examine', permissions: 49, examineStatusStr: '审查中', isCheck: 1},
          // {name: '客户指示', action: 'custZs', permissions: 48},
          // {name: '申请人', action: 'goApp', permissions: 47,},
          // {name: '账单', action: 'takebill', permissions: 45,},
          // {
          //   name: '商标',
          //   permissions: 46,
          //   isCheck: 1,
          //   subMenu: [{name: '详情', action: 'listsbbtn'}, {name: '导入', action: 'listsbbtn'}]
          // },
          {
            name: '案件',
            subMenu: [{name: '详情', action: 'listajbtn'}],
            isCheck: 1,
            permissions: 44
          },
          {name: '提交', action: 'submitCust', isSubmit: true, isCheck: 1,},
          {name: '合并客户', action: 'mergeCust', permissions: 420},
          {name: '删除', action: 'handledeleElement', permissions: 51, isCheck: 1}].filter(item => {
          if (item.permissions) {
            if (item.examineStatusStr) {
              // && row.taskList && row.taskList[0] && row.taskList[0].taskCandidates.includes(this.$store.getters.userId + '')
              return this.$store.getters.permissions.includes(item.permissions) && row.examineStatusStr == item.examineStatusStr
            } else if (item.isCheck) {
              return this.$store.getters.permissions.includes(item.permissions) && row.isCheck == item.isCheck
            } else {
              return this.$store.getters.permissions.includes(item.permissions)
            }
          } else if (item.isSubmit) {
            return row.taskList && row.taskList[0] && row.taskList[0].taskCandidates.includes(this.$store.getters.userId + '') && row.examineStatusStr === '审查未通过'
          } else if (item.isCheck) {
            return item.isCheck === row.isCheck
          } else {
            return true
          }
        })
      },
      dragStopped(params) {
        let tableHeader = params.columnApi.columnController.gridColumns.map(item => ({
          label: item.colDef.headerName,
          width: item.actualWidth,
          prop: item.colDef.field,
        })).filter(item => item.prop != 'sid' && item.prop != "group")
        const arr = JSON.parse(localStorage.getItem('tableHeader'))
        arr.find(item => item.name == this.$options.name).tableHeader = tableHeader
        localStorage.setItem('tableHeader', JSON.stringify(arr))
        this.changeHeader(tableHeader)
      },
      getFilterModel() {
        this.$nextTick(() => {
          let data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel')
          let arr = Object.keys(data)
          let arrInstance = arr.map(item => this.gridApi.getFilterInstance(item))
          arrInstance.forEach((item, index) => {
            item && item.selectNothing && item.selectNothing()
            item && item.setModel && item.setModel(data[arr[index]])
            item && item.applyModel && item.applyModel()
          })
          this.gridApi.onFilterChanged()
          let sortData = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'SortModel')
          if (sortData && sortData.length) {
            this.gridApi.setSortModel(sortData)
            this.gridApi.onSortChanged()
          }
          if (this.gridApi.rowModel.rootNode.childrenAfterFilter.length) {
            this.gridApi.rowModel.rootNode.childrenAfterFilter[0].setSelected(true)
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
          }));
          const data = {
            userId: this.$store.getters.userId,
            bussId: this.bussId,
            list2
          };
          savePreference(data)
        }
      },
      onGridReady(params) {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
      },
      closeDrawer() {
        Bus.$emit('checkCustEdit', () => {
          this.closeDetail(this.needUpdate)
        })
      },
      openDrawer() {
        this.drawerView = true
      }
    },
    mounted() {
    },
  }
</script>

<style lang="scss" scoped>
  > > > .el-drawer {
    padding-bottom: 0 !important;
  }

  > > > .el-drawer__wrapper {
    margin-top: 40px !important;
    margin-left: 200px;
  }

  .top-panel {
    display: flex;
    justify-content: space-around;
    transition: all ease-in-out 0.2s;

    .item-panel {
      flex: 1;
      margin-right: 30px;
      height: 190px;
      border: 2px solid #F2F2F2;
      border-radius: 5px;
      overflow: hidden;
    }

    .item-panel1 {
      flex: 1;
      margin-right: 0;
      height: 190px;

      .warning-div {
        position: relative;
        border: 1px solid #F2F2F2;
        width: 220px;
        border-radius: 5px;
      }
    }
  }

  .search-box {
    display: flex;
    position: relative;
    justify-content: space-between;
    height: 70px;
    width: 100%;
    margin-top: 15px;
    border: 2px solid #F2F2F2;
    border-bottom: 2px solid #52A0F5;
    border-radius: 5px 5px 0 0;

    .search-left {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 15px;
    }

    .show-div {
      position: absolute;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      left: -22px;
      top: -3px;
      width: 20px;
      height: 75px;
      background-color: #97C6F9;
      border-radius: 0 15px 15px 0;
      color: #fff;
      cursor: pointer;

      &:hover {
        background-color: #52A0F5;
      }

      .el-icon-caret-right {
        font-size: 18px;
      }

      .text {
        font-size: 12px;
      }
    }
  }

  .search-border {
    cursor: pointer;
    margin-left: 15px;
    font-size: 14px;
    color: #999999;
    font-weight: bold;

    &:hover {
      color: #52A0F5;
    }

    .search-item {
      border: 1px dashed #D7D7D7;
      width: 130px;
      height: 50px;
      display: flex;
      align-items: center;

      &:hover {
        border-color: #52A0F5;
      }

      img {
        width: 45px;
        height: 45px;
        margin: 0 2px
      }
    }
  }

  .choice-item {
    color: #52A0F5;
    border-color: #52A0F5;

    .search-item {
      border-color: #52A0F5;
    }
  }

  .search-right-btn {
    display: flex;
    align-items: center;
    margin-right: 15px;
  }

  .brush_right {
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

  .checkbox {
    position: absolute;
    left: 0px;
    top: 32px;
    width: 222px;
    height: 326px;
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

  .hide-div {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    right: -35px;
    top: 50px;
    width: 20px;
    height: 75px;
    background-color: #97C6F9;
    border-radius: 0 15px 15px 0;
    color: #fff;
    cursor: pointer;

    &:hover {
      background-color: #52A0F5;
    }

    .el-icon-caret-left {
      font-size: 18px;
    }

    .text {
      font-size: 12px;
    }
  }

  .ag-theme-balham {
    transition: all ease-in-out 0.2s;
  }
  .export {
    position: absolute;
    z-index: 1;
    right: 0;
    top: -30px;
  }
</style>
<style>
  .custom-list::highlight(search-results) {
    background-color: #ffff00;
    color: #000;
  }
</style>
