<template>
  <div class="trademark-writing-wrapper">
    <ViewsSwitching class="ViewsSwitching" @changePattern="changePattern"></ViewsSwitching>
    <div class="btn-wrapper fl-ac-jc">

      <headerSearch style="display: inline-block;margin-right: 10px" :name="$options.name" @search="handleSearch(0)"
                    :bussId="bussId"></headerSearch>
      <!-- <el-button size="small" type="primary" @click="doWriteTask('申请指派')"
                 v-if="$store.getters.permissions.includes(378)">申请指派
      </el-button> -->
      <!-- <el-button size="small" type="primary" @click="doWriteTask(1)" v-if="$store.getters.permissions.includes(379)">
        指派撰写人
      </el-button> -->
      <el-button size="small" type="primary" @click="doWriteTask('1')">
        撰写提交
      </el-button>
      <!-- <el-button disabled size="small" type="primary" @click="doWriteTask(3)"
                 v-if="$store.getters.permissions.includes(381)">负责人审核(暂跳过)
      </el-button> -->
      <el-button size="small" type="primary" @click="doWriteTask('2,3')">
        审核
      </el-button>
      <!-- <el-button size="small" type="primary" @click="rebookTask">
        改签
      </el-button> -->
      <el-form label-width="120px" 
                @submit.native.prevent 
                size="mini">
        <el-form-item label="快捷查询:" style="margin-bottom: 0">
          <el-input type="text" 
                    v-model="queryModuleData.keyWord" 
                    clearable
                    @change="handleChangeSearch"
                    @clear="handleClearSearch"
                    ref="quickSearchInput"
                    @keydown.enter.native.stop="handleEnterSearch"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="status-wrapper">
      <div>
        <el-form label-width="120px" @submit.native.prevent size="mini" @keyup.enter.native="handleSearch(1)"
                 style="margin-top:10px">
          <div style="display: flex;justify-content: left">
            <el-form-item label="撰写状态:" style="margin-bottom: 0!important">
              <el-radio-group v-model="queryModuleData.taskNo"
                              @change="() => handleSearch(1)">
                <el-radio :label="undefined">全部</el-radio>
                <el-radio :label="1">待提交</el-radio>
                <el-radio :label="2">待组长审核</el-radio>
                <el-radio :label="3">待加审人审核</el-radio>
                <el-radio :label="4">已完成</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>

    <TitleTotal :total="total" :currentPageSize="currentPageSize" style="float: left;"/>
    <div class="content_wrap">
      <div class="ag-table-wrapper left_wrap" :style="{width: pattern ? leftWrapWidth : '100%' }">
        <div class="dots" @click="handleCheckboxState">
          <span class="dot">.</span>
          <span class="dot">.</span>
          <span class="dot">.</span>
        </div>
        <div class="ag-table-top">
          <el-button class="brush_right" :class="brushRightHasFilter ? 'red' : ''" @click="brushRight" type="text"
                     icon="el-icon-brush"></el-button>
        </div>
        <div class="brush_right export-action-wrap" style="top: -40px">
          <!-- <el-dropdown>
            <el-button type="primary" size="small">
              撰写人当前案件数量<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item type="primary" size="small" @click.native="queryWriteCaseCount(1)">天津</el-dropdown-item>
              <el-dropdown-item type="primary" size="small" @click.native="queryWriteCaseCount(2)">重庆</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
          <!-- <div style="cursor:pointer;display:flex;align-items:center;font-size: 14px;padding-right: 6px;margin-left: 10px">
            <el-button type="text" @click="exportList(2)">导出</el-button>
            <span style="color: #52A2F4;margin: 0 5px"> / </span>
            <el-button type="text" @click="exportList(1)">全局导出</el-button>
          </div> -->
        </div>
        <div>
          <AgGridVue
            :style="{height: clientHeight + 'px', width: '100%'}"
            class="ag-theme-balham"
            :columnDefs="columnDefs"
            :rowData="gridData"
            rowSelection="multiple"
            @grid-ready="onGridReady"
            @rowClicked="rowClicked"
            @dragStopped="dragStopped"
            :gridOptions="gridOptions"
            @rowDoubleClicked="rowDoubleClicked"
            :getContextMenuItems="getContextMenuItems"
            @sortChanged="refreshEvenRowsCurrencyData"
            @filterChanged="refreshEvenRowsCurrencyData"
            suppressAutoSize
            animateRows
            :localeText="$store.state.caseInformation.localeText"
          >
          </AgGridVue>
          <pagination
            v-show="total>0"
            :total="total"
            :pageSizes="pageSizesList"
            :page.sync="listQuery.pageNo"
            :limit.sync="listQuery.pageSize"
            @pagination="() => queryList()"></pagination>

          <div class="checkbox" v-show="checkboxState">
            <el-select ref="checkCaseSelect" v-model="checkCaseList" multiple reserve-keyword filterable
                       placeholder="请选择"
                       collapse-tags :popper-append-to-body="false" @visible-change="handleChange"
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
      </div>
      <div class="right_wrap"
           :style="{position:'relative','margin-left':currentCaseId&&pattern?'10px' :'0',height:clientHeight+'px'}">
        <!--<span class="el-icon-close" slot="close" style="cursor:pointer;position: absolute;right: 0;top: 10px;z-index: 1000" @click="closeCurrentRow"></span>-->
        <seeCaseDetail :style="cssVar" v-if="currentCaseId&&pattern" :case-id="currentCaseId" :taskType="4"
                       :sign="1" :backsign="0">
        </seeCaseDetail>
        <limitElectronicDocument v-else-if="currentTltId&&pattern" :tltId="currentTltId"></limitElectronicDocument>
        <div v-else style="margin-left: 45%;margin-top: 30px">暂无数据</div>

      </div>
    </div>
    <el-dialog
      :title="title"
      append-to-body
      :visible.sync="patentWritingView"
      width="80%"
      :modal="false"
      top="100px"
      class="dragDialog writingDialog"
      :close-on-click-modal="false"
      v-dialogDrag
      :before-close="closetrademarkWriting"
    >
      <PatentDrafting v-if="patentWritingView" :dialogType="dialogType" :dialogId="dialogId" :taskType="4" :caseId="getSelectedRows().map(item=>item.caseId)" @changeFalse="closetrademarkWriting"/>
    </el-dialog>

    <el-dialog
      title="撰写人当前案件数量"
      append-to-body
      :visible.sync="writeCaseCountView"
      width="60%"
      :modal="false"
      class="chart-dialog"
      :close-on-click-modal="false"
    >
      <vue-chart style="width: 100%;" ref="line" :autoresize="true"  @click="handleClick" theme="ovilia-green" :options="option"/>
      <div class="fl-ac-jc" style="margin-top: 30px">
        <el-button size="small" @click="writeCaseCountView = false">关 闭</el-button>
      </div>
    </el-dialog>

    <!--   改签   -->
    <el-dialog :close-on-click-modal="false" :show-close="false" :visible.sync="rebookView" title="改签" width="50%">
      <div class="rebookDiv">
        <div class="rebookTitle">确认要改签这些商标撰写吗？请指定您要改签的人</div>
        <div class="rebookBody">
          <div class="bodyRight">
            <div class="rightTitle">设置改签人员</div>
            <div class="rightSearch">
              <el-input style="margin-top: 5px;margin-bottom:5px" v-model="name" v-debounce:searchName="'input',300" size="small" placeholder="搜索部门名称或人员姓名">
                <template slot="prepend"><span class="el-icon-search"></span></template>
              </el-input>
            </div>
            <div class="rightTable">
              <el-table @row-click="rowClick" size="mini" :data="list" border fit empty-text="暂无数据"
                        :row-class-name="rowClassName"
                        current-row-key
                        style="width: 100%;">
                <el-table-column label="部门" prop="deptName"></el-table-column>
                <el-table-column label="姓名" prop="fullname"></el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
      <div class="fl-ac-jc" style="padding: 20px 0">
        <el-button size="small" @click="closeRebookDialog()">取 消</el-button>
        <el-button size="small" type="primary" @click="submitRebook">确 定</el-button>
      </div>
    </el-dialog>
    <SelectOption :buss-id="bussId" v-if="selectionOptionState" :dialog-visible="selectionOptionState"
                  @cancel="closeSelect" :idArray="getCurrentRowsData('acId')"
                  :defaultMultipleSelect="preferenceList.map(i=>i.title)" :exportType="exportType"
                  :exportQueryModel="exportQueryModel"></SelectOption>
  </div>
</template>

<script>
  import 'echarts'
  import vueChart from 'vue-echarts'
  import {
    checkPermission, deleteArticleApp,
    delPreference, doArticleTask, endorseArticleCaseTasker,
    queryArticleList,
    queryPreference, queryZxCaseCount,
    savePreference,
    selectColumn, updateWorkHourTasker
  } from "../../../../api/caseList";
  import {queryPatentWritingList} from "@/api/patentWriting";
  import headerSearch from '@/components/HeaderSearch'
  // import TrademarkWritingDetail from "./trademarkWritingDetail";
  import PatentDrafting from '@/views/workbench/case/components/PatentDrafting.vue';
  import LimitElectronicDocument from "../../toDoTasks/components/limitElectronicDocument";
  import SeeCaseDetail from "../components/ManualIdentification/seeCaseDetail";
  import SelectOption from '@/views/workbench/case/components/SelectOption'
  import {mapState} from "vuex";
  import ViewsSwitching from "../components/ViewsSwitching";
  import Pagination from "../../../../components/Pagination/index";
  import { queryPatentWritingDetail } from "@/api/patentWriting";

  export default {
    name: "trademarkWriting",
    components: {
      vueChart,
      Pagination,
      ViewsSwitching,
      SeeCaseDetail,
      LimitElectronicDocument,
      PatentDrafting,
      SelectOption,
      headerSearch
    },
    data() {
      var tableHeader = []
      if (localStorage.getItem('tableHeader') && JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name === this.$options.name + this.$route.name)) {
        tableHeader = JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name === this.$options.name + this.$route.name).tableHeader
      }
      return {
        dialogType: 'view',
        chartData: [],
        taskUserId: '',
        rebookView: false,
        name: '',
        list: [],
        editWritePeople: 0,
        option: {},
        writeCaseCountData: [],
        writeCaseCountView: false,
        title: '提示',
        taskNo: '',
        taskIdList: [],
        currentPageSize: 0,
        pageSizesList: [10, 50, 200, 500, 1000, 5000],
        leftWrapWidth: localStorage.getItem('leftWrapWidth') ? localStorage.getItem('leftWrapWidth') : '60%',
        taskType: '',
        currentTltId: '',
        currentCaseId: '',
        atData: {},
        type: '',
        trademarkWritingCaseIdList: [],
        patentWritingView: false,
        queryModuleData: {
          taskNo: undefined
        },
        searchTimer: null,
        isEnterPressed: false,
        isOutSearch: 0,
        tableHeader: tableHeader,
        selectColumnList: [],
        selectionOptionState: false,
        checkCaseList: [],
        checkFilterList: [],
        bussId: 101,
        exportType: 1,
        exportQueryModel: '',
        total: 0,
        gridData: [],
        brushRightHasFilter: false,
        gridOptions: {
          ...this.$store.state.caseInformation.gridOptions, ...{
            statusBar: {
              statusPanels: [
                {statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left'},
                {statusPanel: 'agSelectedRowCountComponent', align: 'left'}
              ]
            }
          }
        },
        gridApi: {},
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
        preferenceList: [],
        columnDefs: [],
        listQuery: {
          pageNo: 1,
          pageSize: JSON.parse(localStorage.getItem('pageSize')) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name === this.$route.name) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name === this.$route.name).pageSize : 10 : 10
        },
        filterText: '',
        checkboxState: false,
        columnApi: {},
        gridparams: {}
      }
    },
    computed: {
      clientHeight() {
        return document.documentElement.clientHeight - 250
      },
      ...mapState({
        'pattern': state => state.user.pattern
      }),
      cssVar() {
        return {
          '--height': document.documentElement.clientHeight - 300 + 'px'
        }
      },
    },
    watch: {
      checkboxState(n) {
        if (n) {
          this.$nextTick(() => {
            this.$refs.checkCaseSelect.focus()
          })
        }
      },
      $route: {
        handler: function (val, oldVal) {
          this.$nextTick(() => {
            this.rightDrag()
          })
        },
        immediate: true
      },
    },
    created() {
      // this.queryList()
      this.init()
    },
    methods: {
      handleClick(params) {
        this.isOutSearch = 1
        this.listQuery.pageNo = 1
        this.writeCaseCountView = false
        this.queryList({atStatus: 2, actualAttorney: this.chartData[params.dataIndex].userId})
      },
      closeSelect() {
        this.selectionOptionState = false
      },
      exportList(flag) {
        this.exportType = flag
        this.selectionOptionState = true
      },
      closeRebookDialog() {
        this.rebookView = false
        this.taskUserId = ''
        this.list = []
        this.name = ''
      },
      getCurrentRowsData(key) {
        if (this.gridApi && this.gridApi.rowModel) {
          return this.gridApi.rowModel.rootNode.childrenAfterSort
            .map(item => item.data)
            .map(item => item[key] || item.caseId)
            .filter(item => item !== undefined && item !== null && item !== '')
        }
        return []
      },
      submitRebook() {
        if (!this.taskUserId) {
          this.$message.error('请选择员工！')
          return
        }
        endorseArticleCaseTasker({
          endorseArticleList: this.getSelectedRows().map(item => ({
            taskId: item.taskList && item.taskList[0] && item.taskList[0].taskId,
            wfStatus: item.wfStatus,
            caseId: item.caseId
          })),
          auditUserIds: [this.taskUserId],
        }).then(res => {
          this.$message.success('改签成功!')
          this.closeRebookDialog()
          this.queryList()
        })
      },
      rebookTask() {
        if (this.getSelectedRows().length < 1) {
          this.$message.error('请先选择商标撰写')
          return
        }
        const taskList = this.getTaskList()
        if (taskList && !taskList.length) {
          this.$message.error('您不是当前任务的任务人!')
          return
        }
        this.rebookView = true
      },
      searchName(value) {
        if (!value.target.value) return
        this.taskUserId = ''
        this.list = this.$store.getters.userList.filter(item => (item.deptName + '~' + item.fullname).includes(value.target.value))
        if (this.list.length === 1) {
          this.name = this.list[0].fullname
          this.taskUserId = this.list[0].userId || ''
        }
      },
      rowClassName({row, rowIndex}) {
        if (row.userId == this.taskUserId) {
          return 'currentClick'
        }
        return ''
      },
      rowClick(row) {
        this.name = row.fullname
        this.taskUserId = row.userId || ''
      },
      queryWriteCaseCount(guoji) {
        queryZxCaseCount({
          guoji
        }).then(res => {
          this.chartData = res.data
          this.option = {
            tooltip: {
              trigger: "axis",
              axisPointer: {
                type: "shadow",
              },
            },
            grid: {
              left: "3%",
              right: "4%",
              bottom: "3%",
              containLabel: true,
            },
            xAxis: [
              {
                type: "category",
                data: res.data.map(item => item.fullname),
                axisTick: {
                  alignWithLabel: true,
                },
              },
            ],
            yAxis: [
              {
                type: "value",
              },
            ],
            series: [
              {
                name: "Direct",
                type: "bar",
                barWidth: "40%",
                data: res.data.map(item => item.count),
                label: {
                  show: true,
                },
                itemStyle: {
                  color: '#73C0DE'
                }
              },
            ],
          }
          this.writeCaseCountView = true
        })
      },
      closetrademarkWriting(flag) {
        this.patentWritingView = false
        this.atData = {}
        flag === true && this.queryList()
      },
      rowDoubleClicked(params) {
        this.atData = params.data
        this.dialogType = 'view'
        this.title = '查看'
        this.dialogId = this.atData.id
        this.taskNo = this.atData.taskList && this.atData.taskList[0] && this.atData.taskList[0].taskNo
        this.patentWritingView = true
      },
      getTaskList() {
        return this.getSelectedRows().map(item => {
          if (item.taskList && item.taskList.find(itm => itm.taskCandidates && itm.taskCandidates.includes(this.$store.getters.userId + ''))) {
            return {
              taskId: item.taskList.find(itm => itm.taskCandidates.includes(this.$store.getters.userId + '')).taskId,
              taskNo: item.taskList.find(itm => itm.taskCandidates.includes(this.$store.getters.userId + '')).taskNo
            }
          } else {
            return false
          }
        }).filter(item => !!item)
      },
      async doWriteTask(type) {
        if (!this.getSelectedRows().length) {
          this.$message.error("请先选择专利撰写！")
          return
        }
        let taskList = []
        let caseIds = [...new Set(this.getSelectedRows().map(item => item.caseId))]
        this.trademarkWritingCaseIdList = caseIds
        const detail = await queryPatentWritingDetail({ id: this.getSelectedRows()[0].id })
        if (!detail.data.taskUserId || detail.data.taskUserId !== this.$store.getters.userId) {
          this.$message.error('您不是当前任务的任务人!')
          return
        }
        if (!type.includes(this.getSelectedRows()[0].taskNo)) {
          this.$message.error('所选任务不符合流程!')
          return
        }
        switch (type) {
          case '1':
            this.gridApi.rowModel.rootNode.childrenAfterFilter.forEach((item, index) => {
              if (item.data.taskList && selectedTaskIdList.includes(item.data.taskList[0].taskId) && item.data.taskList[0].taskNo === 1) {
                this.gridApi.rowModel.rootNode.childrenAfterFilter[index].setSelected(true)
              }
            })
            this.atData = this.getSelectedRows()[0]
            this.dialogType = 'submit'
            this.dialogId = this.atData.id
            this.title = '提交'
            this.patentWritingView = true
            break
          case '2,3':
            this.gridApi.rowModel.rootNode.childrenAfterFilter.forEach((item, index) => {
              if (item.data.taskList && selectedTaskIdList.includes(item.data.taskList[0].taskId) && item.data.taskList[0].taskNo === 1) {
                this.gridApi.rowModel.rootNode.childrenAfterFilter[index].setSelected(true)
              }
            })
            this.atData = this.getSelectedRows()[0]
            this.dialogType = 'audit'
            this.dialogId = this.atData.id
            this.title = '审核'
            this.patentWritingView = true
            break
          default:
            break
        }
      },
      checkTaskUser() {

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
      rowClicked(param) {
        // if (param.node.selected) {
        if (this.currentCaseId === param.data.caseId) return
        this.currentCaseId = ''
        this.currentTltId = ''
        setTimeout(() => {
          this.caseMaterialId = param.data.caseMaterialId
          this.currentCaseId = param.data.caseId
          this.taskType = this.$commonUtils.getTaskType(param.data, this)
          if (!this.currentCaseId) {
            this.currentTltId = param.data.tltId
          }
        }, 200)
        // }
      },
      changePattern(e) {
        if (e === 1) {
          this.$store.commit('user/SET_PATTERN', false)
        } else {
          this.$store.commit('user/SET_PATTERN', true)
        }
      },
      rightDrag() {
        let that = this
        // document.getElementById('searchWrap').onscroll=function (e) {
        //   that.clearWrapTop = e.target.scrollTop+ e.target.offsetHeight
        //   document.getElementById('clearWrap').style.top = that.clearWrapTop -40 + 'px'
        // }
        document.querySelector('.left_wrap') && new this.$DraginResize(document.querySelector(".left_wrap"), {
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
      init(flag) {
        const data = {
          userId: this.$store.getters.userId,
          bussId: this.bussId
        };
        Promise.all([selectColumn(data), queryPreference(data)]).then(res => {
          this.selectColumnList = res[0].data

          this.preferenceList = res[1].data
          this.tableHeader = this.preferenceList.map(item => ({
            label: item.title,
            prop: item.value,
            width: this.getLoactionWidth(item.title)
          }))
          if (flag === 1) {
            this.preferenceList.forEach(col => {
              if (!this.columnDefs.find(item => item.field === col.value)) {
                this.columnDefs.push({
                  headerName: col.title,
                  field: col.value,
                  width: this.getLoactionWidth(col.title) == 'auto' ? 200 : this.getLoactionWidth(col.title),
                  resizable: true,
                  sortable: true,
                  filter: 'agSetColumnFilter',
                  menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
                  cellRenderer: this.cellRenderer,
                  enableRowGroup: true,
                  filterParams: {
                    comparator: (a, b) => {
                      return this.$commonUtils.sort(a, b, col.value)
                    }
                  }
                })
              }
            })
            const spliceFieId = []
            this.columnDefs.forEach(col => {
              if (!this.preferenceList.find(item => item.value === col.field) && col.field !== 'sid') {
                spliceFieId.push(col.field)
              }
            })
            spliceFieId.forEach(spFieId => {
              this.columnDefs.splice(this.columnDefs.findIndex(item => item.field === spFieId), 1)
            })

          } else {
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
              }
            }))]
          }
          this.gridApi.refreshCells()
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
                let data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel')
                let arr = Object.keys(data)
                if (this.columnDefs.map(itm => itm.field).diff(arr).includes(item.field)) {
                  this.gridApi.getFilterInstance(item.field).selectNothing()
                }
              })
            })
          })
          this.saveLocation()
          this.checkCaseList = this.preferenceList.map(item => item.value)
        })
      },
      handleCheckboxState() {
        this.checkboxState = !this.checkboxState
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
      delPreference(num) {
        const data = {
          userId: this.$store.getters.userId,
          bussId: this.bussId
        }
        delPreference(data).then(res => {
          if (res.success) {
            this.checkboxState = false
            if (!num) {
              this.queryList()
            }
            this.init(1)
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
          userId: this.$store.getters.userId,
          bussId: this.bussId,
          list2
        }
        savePreference(data).then(res => {
          if (res.success) {
            this.checkboxState = false
            this.filterText = ''
            // this.$router.go(0)
            if (!num) {
              this.queryList()
            }
            // this.queryList()
            this.init(1)
          }
        })
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
          arr.push({name: this.$options.name + this.$route.name, tableHeader: this.tableHeader})
          localStorage.setItem('tableHeader', JSON.stringify(arr))
        } else {
          let arr = JSON.parse(localStorage.getItem('tableHeader'))
          if (arr.find(item => item.name == this.$options.name + this.$route.name)) {
            arr.find(item => item.name == this.$options.name + this.$route.name).tableHeader = this.tableHeader
            localStorage.setItem('tableHeader', JSON.stringify(arr))
          } else {
            arr.push({name: this.$options.name + this.$route.name, tableHeader: this.tableHeader})
            localStorage.setItem('tableHeader', JSON.stringify(arr))
          }
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
      changeHeader(n) {
        if (n && n.length) {
          this.checkCaseList = n.map(item => item.prop)
          let list2 = this.checkCaseList.map(item => ({
            title: this.selectColumnList.find(i => i.COLUMN_NAME === item)
              .COLUMN_COMMENT,
            value: item
          }))
          const data = {
            userId: this.$store.getters.userId,
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
      handleEnterSearch(e) {
        e.preventDefault()
        this.isEnterPressed = true
        this.handleSearch(1)
        this.$refs.quickSearchInput.blur()
        setTimeout(() => {
          this.isEnterPressed = false
        }, 200)
      },
      handleChangeSearch() {
        if (this.isEnterPressed) return
        if (this.searchTimer) clearTimeout(this.searchTimer)
        this.searchTimer = setTimeout(() => {
          if (this.queryModuleData.keyWord) {
            this.handleSearch(1)
          }
          this.searchTimer = null
        }, 100)
      },
      handleClearSearch() {
        if (this.searchTimer) {
          clearTimeout(this.searchTimer)
          this.searchTimer = null
        }
      },
      handleSearch(isOutSearch) {
        this.isOutSearch = isOutSearch
        if (!isOutSearch) {
          this.queryModuleData = JSON.parse(localStorage.getItem('queryModuleData'))
            && JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$options.name)
            && JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == this.$options.name).queryModuleData
            || {}
        }
        this.listQuery.pageNo = 1

        this.queryList()
      },
      queryList(data = {}) {
        let searchData = Object.assign(this.listQuery, this.queryModuleData)
        const outQueryKey = ["taskNo", "keyWord"]
        if (this.isOutSearch) { // 外部搜索
          for (let key in searchData) {
            if (!outQueryKey.includes(key) && !['pageNo', 'pageSize'].includes(key)) {
              delete searchData[key]
            }
          }
        } else {
          for (let key in searchData) {
            if (outQueryKey.includes(key) && !['pageNo', 'pageSize'].includes(key)) {
              delete searchData[key]
            }
          }
        }

        const reqData = {...searchData, ...data}
        this.exportQueryModel = JSON.stringify(reqData)
        queryPatentWritingList(reqData).then(res => {
          this.gridData = res.data || []
          this.total = res.total
          if (this.gridData.length) {
            this.getFilterModel()
            this.$nextTick(() => {
              if (this.gridApi.rowModel.rootNode.childrenAfterFilter.length) {
                this.gridApi.rowModel.rootNode.childrenAfterFilter[0] && this.gridApi.rowModel.rootNode.childrenAfterFilter[0].setSelected(true)
                this.gridApi.rowModel.rootNode.childrenAfterFilter[0] && this.rowClicked(this.gridApi.rowModel.rootNode.childrenAfterFilter[0])
              }
            })
          }
        })
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
      brushRight() {
        let data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel')
        let arr = Object.keys(data)
        arr.forEach(item => {
          this.gridApi.destroyFilter(item)
        })
        this.$commonUtils.saveFilterModel(this.$options.name + this.$route.name, 'FilterModel', {})
      },
      refreshEvenRowsCurrencyData(params) {
        this.currentPageSize = params.api.rowModel.rootNode.allChildrenCount
        this.gridApi.rowModel.rootNode.childrenAfterFilter && this.gridApi.rowModel.rootNode.childrenAfterFilter.length && this.gridApi.rowModel.rootNode.childrenAfterFilter.forEach(rowNode => {
          setTimeout(() => {
            rowNode.setDataValue(
              'sid',
              rowNode.rowIndex + 1)
          }, 0)
        });
        if (this.gridData.length) {
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
              this.brushRightHasFilter = true
            } else {
              this.brushRightHasFilter = false
            }
          }
          if (params.type == "sortChanged") {
            this.$commonUtils.saveFilterModel(this.$options.name + this.$route.name, 'SortModel', this.gridApi.getSortModel())
          }
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
            this[item.action](params.node.data, params.node.rowIndex, params.value, params.node)
          }
        }))
      },
      getRowContextmenuList(row) {
        return [
          {name: '复制', action: 'copy'},
          // {name: '修改', action: 'editFun', permissions: 376},
          // {name: '删除', action: 'delFun', permissions: 377}
        ].filter(item => {
          if (item.permissions) {
            return this.$store.getters.permissions.includes(item.permissions)
          } else {
            return true
          }
        })
      },
      async editFun(row) {
        this.atData = row
        this.type = 'edit'
        this.title = '编辑'
        this.trademarkWritingCaseIdList = [row.caseId]
        this.taskIdList = row.taskList && row.taskList.length && [row.taskList[0].taskId]
        this.taskNo = row.taskList && row.taskList.length && row.taskList[0].taskNo
        const res = await checkPermission({
          articleCaseList: [{
            atId: row.atId,
            caseId: row.caseId
          }]
        })
        if (res && res.data) {
          this.editWritePeople = res.data.zhuanxieren // 是否可以修改撰写人
        }
        this.$set(this.atData, 'isModifyFlag', true)
        this.$set(this.atData, 'editWritePeople', this.editWritePeople)
        this.patentWritingView = true
      },
      delFun(row) {
        checkPermission({
          articleCaseList: [{
            atId: row.atId,
            caseId: row.caseId
          }]
        }).then(res => {
          if (res.data.delete == 0) {
            this.$message.error('没有权限！')
          } else {
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              deleteArticleApp({
                articleCaseList: [
                  {
                    atId: row.atId,
                    caseId: row.caseId
                  }
                ]
              }).then(res => {
                this.$message.success('删除成功!')
                this.queryList()
              })
            })
          }
        })
      },
      copy(row, index, value) {
        if (value) {
          this.$copyText(String(value)).then(
            res => {
            })
        }
      },
      cellRenderer(params) {
        if (params.colDef.field === 'sid') {
          return params.rowIndex + 1
        }
        return `<span title="${params.value}">${params.value === undefined ? '' : params.value}</span>`
      },
      onGridReady(params) {
        this.gridparams = params
        this.gridApi = params.api
        this.columnApi = params.columnApi
      },
    }
  }
</script>

<style lang="scss" scoped>
  .trademark-writing-wrapper {
    padding: 10px 20px;
  }

  .btn-wrapper {
    width: 100%;
  }

  .status-wrapper {
    margin: 10px 0;

    .quick-query-wrapper {
      width: 200px;
      background-color: green;
    }
  }

  .ag-table-wrapper {
    width: 100%;
  }

  .brush_right {
    position: absolute;
    right: 5px;
    z-index: 1;
    top: 0px;
  }

  .export-action-wrap {
    display: flex;
    align-items: center;
  }

  .checkbox {
    position: absolute;
    left: 0px;
    top: 34px;
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

  .dots {
    cursor: pointer;
    position: absolute;
    left: 2px;
    z-index: 1;
    top: 8px;
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

  .ViewsSwitching {
    position: absolute !important;
    right: 0;
    z-index: 100;
    top: -20px;
  }

  > > > .el-tabs__content {
    height: var(--height) !important;
    overflow: auto !important;
  }

  .writingDialog {
    > > > .el-dialog {
      max-height: 90vh !important;

      .el-dialog__body {
        padding-top: 0;
      }
    }
  }

  .chart-dialog {
    > > > .el-dialog {
      height: 70vh !important;
    }
  }

  .rebookDiv {
    width: 100%;
    border: 1px solid #D7D7D7;
    padding: 10px;

    .rebookTitle {
      color: #D9001B;
      padding-bottom: 10px;
      border-bottom: 2px solid #797979;
    }

    .rebookBody {
      display: flex;

      .bodyLeft {
        min-height: 300px;
        max-height: 500px;
        overflow: auto;
        flex: 4;
        /*background-color: red;*/
        margin-right: 10px;

        .nameList {
          width: 100%;
          height: 35px;
          border: 1px solid #F2F2F2;
          border-bottom: none;
          display: flex;
          justify-content: center;
          align-items: center;

          &:last-child {
            border-bottom: 1px solid #F2F2F2;
          }
        }
      }

      .bodyRight {
        min-height: 300px;
        max-height: 500px;
        overflow: auto;
        flex: 6;

        .rightTitle {
          text-align: center;
          background-color: #D7D7D7;
          margin-top: 10px;
          height: 30px;
          line-height: 30px;
        }

        .rightSearch {
          .el-input {
            input {
              border-radius: 0 !important;
            }

            > > > .el-input__inner {
              height: 35px;
            }
          }
        }

        .rightTable {
          thead {
            tr {
              th {
                background-color: #D7D7D7;
                color: #606266;
              }
            }
          }
        }
      }
    }
  }

  > > > .currentClick {
    background-color: #2981EB !important;
    color: #ffffff;
    font-weight: bold;
  }

  > > > .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: transparent !important;
  }

  >>>.el-dialog__body {
    padding-top: 0;
    padding-bottom: 0;
  }

  > > > .el-table {
    .cell {
      cursor: pointer;
    }
  }
</style>
