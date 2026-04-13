<template>
  <div class="app-container">
    <!--    顶部搜索-->
    <div class="search-box">
      <div class="search-left">
        <el-input ref="searchRef" style="margin-right: 10px;" clearable placeholder="关键字模糊检索" size="small" prefix-icon="el-icon-search" @change="(value) => {!value && vagueSearch('')}" v-model="listQuery.keywords"
                  @keyup.enter.native="(e)=>vagueSearch(e.target.value, true)">
          <!--            <template slot="prepend"><span class="el-icon-search"></span></template>-->
        </el-input>
        <el-button-group class="button-group-search" v-clickoutside="clickoutside">
          <el-button id="mySearch" type="primary" size="mini" @click="getList('search')">搜索</el-button>
          <el-button type="primary" class="searchRight" size="small" icon="el-icon-arrow-down"
                     @click.stop.prevent="drawerState=true"></el-button>
          <transition name="show" mode="out-in">
            <div class="searchWrap" v-show="drawerState">
              <div style="width: 550px;
    max-height: 500px;overflow: auto">
                <el-form label-width="130px" size="mini" class="form-container" @keyup.enter.native="getList('search')">
                  <el-form-item label="主题">
                    <el-input clearable v-model="listQuery.subject" placeholder=""></el-input>
                  </el-form-item>
                  <el-form-item label="客户活动类型">
                    <el-select default-first-option :clearable='true' placeholder="请选择" v-model="listQuery.actType"
                               filterable>
                      <el-option v-for="item in seletData.hdtype" :key="String(item.id)" :label="item.typeName"
                                 :value="String(item.id)">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="合作资源活动类型">
                    <el-select default-first-option :clearable='true' placeholder="请选择" v-model="listQuery.cooperativeActType"
                               filterable>
                      <el-option v-for="item in seletData.cooperativeHdtype" :key="String(item.id)" :label="item.typeName"
                                 :value="String(item.id)">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="活动状态">
                    <el-select default-first-option :clearable='true' placeholder="请选择" v-model="listQuery.actStatus"
                               filterable>
                      <el-option v-for="item in seletData.hdstatu" :key="String(item.id)" :label="item.typeName"
                                 :value="String(item.id)">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="对方联系人">
                    <el-select default-first-option :clearable='true' v-model="listQuery.custContactId"
                               no-match-text='暂无数据' loading-text='正在查询' filterable remote reserve-keyword
                               placeholder="请输入关键词"
                               :remote-method="remotepaternalUnit">
                      <el-option v-for="item in seletData.custnames" :key="item.custContactId" :label="item.name"
                                 :value="item.custContactId">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="活动方式">
                    <el-select default-first-option :clearable='true' placeholder="请选择" v-model="listQuery.actKind"
                               filterable>
                      <el-option v-for="item in seletData.hdfs" :key="String(item.id)" :label="item.typeName"
                                 :value="String(item.id)">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="礼品">
                    <el-input clearable v-model="listQuery.gift" placeholder=""></el-input>
                  </el-form-item>
                  <el-form-item label="开始时间:">
                    <el-date-picker
                      v-model="listQuery.begindateArray"
                      type="datetimerange"
                      value-format="yyyy-MM-dd"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="审查状态">

                    <el-checkbox-group v-model="listQuery.examineStatuss">
                      <el-checkbox label="1623">待提交</el-checkbox>
                      <el-checkbox label="1622">审查中</el-checkbox>
                      <el-checkbox label="1621">审核通过</el-checkbox>
                      <el-checkbox label="1624">审核未通过</el-checkbox>

                    </el-checkbox-group>
                  </el-form-item>
                </el-form>

              </div>
              <div class="clearWrap">
                <el-button size="mini" @click="clearSeach"><span>重置</span></el-button>
                <el-button type="primary" size="mini" @click="getList('search')">搜索</el-button>
              </div>
            </div>
          </transition>
        </el-button-group>
        <el-button v-allow="71" type="primary" size="small" @click="createActivity">
          <span class="el-icon-plus"></span>
          创建活动
        </el-button>
        <el-button v-allow="499" type="primary" size="small" @click="changeActivity">
          招投标备案
        </el-button>
      </div>
      <!--      <div class="search-right-btn">-->
      <!--        -->
      <!--      </div>-->
    </div>
    <TitleTotal :total="total" v-if="total"/>
    <div v-else style="height: 30px;"></div>
    <div style="position: relative">
      <div class="dots" @click="handleCheckboxState">
        <span class="dot">.</span>
        <span class="dot">.</span>
        <span class="dot">.</span>
      </div>
      <el-button class="brush_right" :class="brushRightHasFilter?'red':''" @click="brushRight" type="text"
                 icon="el-icon-brush"></el-button>
      <AgGridVue
          style="width:100%;"
          :style="{height: clientHeight + 'px'}"
          class="ag-theme-balham"
          :columnDefs="columnDefs"
          :rowData="list"
          rowSelection="multiple"
          @grid-ready="onGridReady"
          @dragStopped="dragStopped"
          @rowDoubleClicked="rowDoubleClicked"
          :gridOptions="gridOptions"
          :getContextMenuItems="getContextMenuItems"
          @sortChanged="refreshEvenRowsCurrencyData"
          @filterChanged="refreshEvenRowsCurrencyData"
          suppressAutoSize
          animateRows
          :localeText="$store.state.caseInformation.localeText"
      >
      </AgGridVue>
      <pagination v-show="total>0" :total="total" :page-sizes="[10,50,100,500,1000,5000]" :page.sync="listQuery.pageNo"
                  :limit.sync="listQuery.pageSize" @pagination="getList"/>
    </div>


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

    <el-dialog
      :title="titleType"
      append-to-body
      :close-on-click-modal="false"
      :visible.sync="activityView"
      width="80%"
      height="80%"
      class="abow_dialog"
      :before-close="() => closeDialog(false)"
    >
      <activity-detail v-if="activityView" :isCustomer="true" ref="activity" :is-edit="viewType === 'edit'" :isLook="titleType === '查看'" :custActId="custActId"
                @closeDialog="closeDialog"></activity-detail>
    </el-dialog>

  </div>
</template>
<script>
  import {
    queryActivityListUrl,
    delCustomer,
    querycustSelectClass,
    queryCustomerNameIdUrl,
    queryCountryUrl,
    updateLevelUrl,
    delActivity,
    queryCustContactAllUrl
  } from "@/api/customerList";
  import Pagination from "@/components/Pagination";
  import Activity from "../../customer_management/activity_management/components/Activity";
  import ActivityDetail from "@/views/workbench/customer_center/customer_activity/ActivityDetail.vue";
  import {delPreference, queryPreference, savePreference, selectColumn} from "@/api/caseList"; // secondary package based on el-pagination
  export default {
    components: {ActivityDetail, Pagination},
    computed: {
      clientHeight() {
        return document.documentElement.clientHeight - 210
      }
    },
    data() {
      let tableHeader = []
      if (localStorage.getItem('tableHeader') && JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name)) {
        tableHeader = JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name).tableHeader
      }
      return {
        tableHeader,
        checkCaseList: [],
        brushRightHasFilter: false,
        defaultData: {
          isCustomer: "1",
          pageNo: 1,
          pageSize: JSON.parse(localStorage.getItem('pageSize')) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name).pageSize : 10 : 10,
          actType: "",
          examineStatuss: [],
          actStatus: "",
          subject: "",
          custContactId: "",

          actKind: ""
        },
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
        columnDefs: [],
        preferenceList: [{'label': '主题', prop: 'subject', 'width': 300},
          {'label': '活动类型', prop: 'actTypeStr'},
          {'label': '开始时间', prop: 'begindate'},
          {'label': '活动方式', prop: 'actKindStr'},
          {'label': '活动状态', prop: 'actStatusStr'},
          {'label': '审查状态', prop: 'examineStatusStr'},
          { 'label': '礼品', prop: 'putGift' },
          {'label': '备注', prop: 'memo'}
        ],
        gift: '',
        dialogFormxy: false,
        list: [],
        total: 0,
        listLoading: false,
        listQuery: {
          keywords: undefined,
          gift: '',
          begindateArray: [],
          isCustomer: "1",
          pageNo: 1,
          pageSize: JSON.parse(localStorage.getItem('pageSize')) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name).pageSize : 10 : 10,
          actType: "",
          examineStatuss: [],
          actStatus: "",
          subject: "",
          custContactId: "",

          actKind: ""
        },
        deldata: {
          customerID: ""
        },
        seletData: {
          hdstatu: {},
          hdtype: {},
          hdfs: {},
          custnames: {},
          cooperativeHdtype:{}
        },
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
        drawerState: false,
        viewType: '',
        activityView: false,
        custActId: '',
        titleType: '',
        xyData: {
          custId: "",
          level: "",
          memo: ""
        },
        checkboxState: false,
        filterText: '',
        selectColumnList: [],
        bussId: 90,
        callForBids:undefined
      };
    },
    watch: {
      checkboxState(n) {
        if (n) {
          this.$nextTick(() => {
            this.$refs.checkCaseSelect.focus()
          })
        }
      },
    },
    created() {
      // this.getList();
      this.getallSelectData();
      this.getAllWfs()
    },
    methods: {
      changeActivity(){
        this.callForBids = this.callForBids? undefined : 1
        this.getList('search')
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
              this.columnApi.getColumn(item.field)&&this.columnApi.getColumn(item.field).addEventListener('menuVisibleChanged', () => {
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
      savePreference() {
        let list2 = this.checkCaseList.map(item => ({
          title: this.selectColumnList.find(i => i.COLUMN_NAME === item).COLUMN_COMMENT,
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
            this.getList()
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
          this.checkboxState = false
          // this.handleSearch(this.searchFlag)
          this.getList()
          this.getAllWfs()
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
      handleCheckboxState() {
        this.checkboxState = !this.checkboxState;
      },
      vagueSearch(e, forceSearch) {
        if (forceSearch) {
          this.getList('search')
        } else {
          if (!e) {
            this.$refs.searchRef.focus()
          } else {
            this.getList('search')
          }
        }
      },
      brushRight() {
        let data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel')
        let arr = Object.keys(data)
        arr.forEach(item => {
          this.gridApi.destroyFilter(item)
        })
      },
      rowDoubleClicked(params) {
        const disabled = params.data.subject&&params.data.subject.includes('招投标备案')&&!this.$store.getters.permissions.includes(499)
        if (!disabled) {
          this.custActId = params.data.custActId
          this.viewType = 'edit'
          this.titleType = '查看'
          this.activityView = true
        }
      },
      closeDialog(isSearch) {
        if (this.titleType === '创建' && !isSearch) {
          // this.$refs.activity.delActivity()
        }
        this.custActId = ''
        this.activityView = false
        this.viewType = ''
        this.titleType = ''
        isSearch === true && this.getList('search')
      },
      createActivity() {
        this.viewType = 'create'
        this.titleType = '创建'
        this.activityView = true
      },
      clickoutside() {
        this.drawerState = false
      },
      refreshEvenRowsCurrencyData(params) {
        this.currentPageSize = params.api.rowModel.rootNode.allChildrenCount
        if (!params.columnApi.columnController.groupAutoColumns) {
          this.gridApi.forEachNode(rowNode => {
            rowNode.setDataValue(
              'sid',
              rowNode.rowIndex + 1)
          })
        }
        if (params.type == "filterChanged") {
          this.$commonUtils.saveFilterModel(this.$options.name + this.$route.name, 'FilterModel', this.gridApi.getFilterModel())
          var data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel');
          var arr = Object.keys(data);
          if (arr.length) {
            this.brushRightHasFilter = true
          } else {
            this.brushRightHasFilter = false
          }
        }
      },
      cellRenderer(params) {
        if (params.colDef.field === 'sid') {
          return params.rowIndex + 1
        }
        if (params.colDef.field == 'subject') {
          const disabled = params.data.subject&&params.data.subject.includes('招投标备案')&&!this.$store.getters.permissions.includes(499)
          var eDiv = document.createElement('div');
          if (disabled) {
            eDiv.innerHTML = `<span title="${params.value}">${params.value ? params.value : ''}</span>`
          }else{
            eDiv.innerHTML = `<span class="btn-simple" style="cursor: pointer;color: #00b0ff" title="${params.value}">${params.value ? params.value : ''}</span>`
            var eButton = eDiv.querySelectorAll('.btn-simple')[0];
            eButton.addEventListener('click', () => {
              if (params.data) {
                this.editFun(params.data)
                // this.$router.push(`./activity_edit/${params.data.custActId}`)
              }
            });
          }
          return eDiv;
        }
        return `<span title="${params.value}">${params.value ? params.value : ''}</span>`
      },
      getContextMenuItems(params) {
        console.log(params)
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
          // { name: '商标导入', action: 'installtmmessage', permissions: 185 },
          {name: '修改', action: 'editFun', permissions: 73},
          {name: '删除', action: 'handledeleElement', permissions: 74}
        ].filter(item => {
          if (item.permissions) {
            return this.$store.getters.permissions.includes(item.permissions)
          } else {
            return true
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
      editFun(row) {
        // this.$router.push(`./activity_edit/${row.custActId}`)
        this.custActId = row.custActId
        this.viewType = 'edit'
        this.titleType = '修改'
        this.activityView = true
      },
      onGridReady(params) {
        this.gridparams = params
        this.gridApi = params.api
        this.columnApi = params.columnApi
        params.api.sizeColumnsToFit()
      },
      clearSeach() {
        this.listQuery = Object.assign({}, this.defaultData);

        // this.total = "0";
      },
      getList(type) {
        if (type == "search") {
          this.listQuery.pageNo = "1";
        }
        this.listLoading = true;
        const params = JSON.parse(JSON.stringify(this.listQuery))
        if (params.cooperativeActType) {
          params.actType = params.cooperativeActType
          delete params.cooperativeActType
        }
        queryActivityListUrl({...params,callForBids: this.callForBids}).then(response => {
          this.list = response.data;
          this.total = response.total;
          this.listLoading = false;
        });
      },
      remotepaternalUnit(query) {
        if (query !== "") {
          queryCustContactAllUrl({name: query}).then(response => {
            if (response.success) {
              this.seletData.custnames = response.data;
            } else {
              this.$message.error(response.message);
            }
          });
        }
      },
      getallSelectData() {
        // this.columnDefs = [...this.defaultcolumnDefs, ...this.preferenceList.map(item => ({
        //   headerName: item.label,
        //   field: item.prop,
        //   resizable: true,
        //   sortable: true,
        //   width: item.width,
        //   filter: 'agSetColumnFilter',
        //   cellRenderer: this.cellRenderer,
        //   menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
        //   enableRowGroup: true,
        //   filterParams: {
        //     defaultToNothingSelected: true,
        //     newRowsAction: 'keep',
        //     comparator: (a, b) => {
        //       return this.$commonUtils.sort(a, b, item.prop)
        //     }
        //   }
        // }))]
        // console.log(this.columnDefs, 222)
        querycustSelectClass({classId: "1050,1049,1051,1192"}).then(response => {
          if (response.success) {
            this.seletData.hdstatu = response.data["1050"];
            this.seletData.hdtype = response.data["1049"];
            this.seletData.cooperativeHdtype = response.data["1192"];
            this.seletData.hdfs = response.data["1051"];
          } else {
            this.$message.error(response.message);
          }
        });
      },
      handledeleElement(row, index) {
        this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            delActivity({custActId: row.custActId}).then(response => {
              if (response.success) {
                // const index = this.list.indexOf(row);
                this.list.splice(index, 1);
                this.$message({
                  type: "success",
                  message: "删除成功"
                });
              } else {
                this.$message.error(response.message);
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
      setXy() {
        updateLevelUrl(this.xyData).then(response => {
          if (response.success) {
            this.$message.success(response.message);
            this.dialogFormxy = false;
          } else {
            this.$message.error(response.message);
          }
        });
      }
    }
  };
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

  .search-box {
    display: flex;
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
  }

  .search-right-btn {
    display: flex;
    align-items: center;
    margin-right: 15px;
  }

  .button-group-search {
    position: relative;
    display: flex;
    margin-right: 10px;

    .searchWrap {
      border-radius: 5px;
      top: 34px;
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
        padding: 20px 20px 50px 0;

        .el-form-item__label {
          text-align: right;
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

  .searchRight {
    border-top-right-radius: 3px !important;
    border-bottom-right-radius: 3px !important;
    padding: 0 5px;
    height: 33px;
  }

  .abow_dialog {
    > > > .el-dialog {
      position: absolute;
      top: 50%;
      left: 50%;
      margin: 0 !important;
      transform: translate(-50%, -50%);
      min-height: calc(60%);
      max-height: calc(100% - 30px);
      max-width: calc(100% - 30px);
      display: flex;
      flex-direction: column;
    }

    > > > .el-dialog__body {
      overflow: auto;
      padding: 0 10px 10px 10px;
    }
  }
  .brush_right {
    position: absolute;
    right: 15px;
    z-index: 1;
    top: 0px;
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

</style>

