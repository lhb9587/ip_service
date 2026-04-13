<template>
  <div class="app-container">
    <div class="search-box">
      <div class="search-left">
        <el-input style="margin-right: 10px;" placeholder="关键字模糊检索" size="small" clearable prefix-icon="el-icon-search" @change="(value) => {!value && vagueSearch('')}" v-model="listQuery.keywords"
                  @keyup.enter.native="(e)=>vagueSearch(e.target.value, true)">
          <!--            <template slot="prepend"><span class="el-icon-search"></span></template>-->
        </el-input>
        <el-button-group class="button-group-search" v-clickoutside="clickoutside">
          <el-button id="mySearch" type="primary" size="mini" @click="getList('search')">搜索</el-button>
          <el-button type="primary" class="searchRight" size="mini" icon="el-icon-arrow-down"
                     @click.stop.prevent="drawerState=true"></el-button>
          <transition name="show" mode="out-in">
            <div class="searchWrap" v-show="drawerState">
              <div style="width: 550px;
    max-height: 500px;overflow: auto">
                <el-form label-width="140px" size="mini" class="form-container"
                         @keyup.enter.native="getList('search')">
                  <el-form-item label="合作资源名称:" class="postInfo-container-item">
                    <el-input v-model="listQuery.keyword" placeholder="请输入内容"></el-input>
                  </el-form-item>
                  <el-form-item label="合作资源类型:" class="postInfo-container-item">
                    <el-select default-first-option :clearable='true' placeholder="请选择" v-model="listQuery.companyType"
                               filterable>
                      <el-option v-for="item in seletData.hzzyTypr" :key="item.typeName" :label="item.typeName"
                                 :value="item.typeName">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="合作资源状态:" class="postInfo-container-item">
                    <el-select default-first-option :clearable='true' placeholder="请选择" v-model="listQuery.collaborationStatus"
                               filterable>
                      <el-option v-for="item in seletData.hzzyStatusList" :key="item.typeName" :label="item.typeName"
                                 :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="国籍:" class="postInfo-container-item">

                    <el-select default-first-option :clearable='true' placeholder="请选择" v-model="listQuery.country"
                               filterable>
                      <el-option v-for="item in seletData.country" :key="String(item.countryCn)" :label="item.countryCn"
                                 :value="String(item.countryCn)">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="创建日期:" class="postInfo-container-item">
                    <DataPicker class="DataPicker" v-model="listQuery.createTimeArray"></DataPicker>
                    <!--          <el-date-picker v-model="listQuery.createTime" format='yyyy-MM-dd' value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">-->
                    <!--          </el-date-picker>-->
                  </el-form-item>
                  <el-form-item label="审查状态:" class="postInfo-container-item">
                    <el-select default-first-option :clearable='true' placeholder="请选择"
                               v-model="listQuery.examineStatus"
                               filterable>
                      <el-option v-for="item in seletData.scStatu" :key="String(item.id)" :label="item.typeName"
                                 :value="String(item.id)">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="执业法域:" class="postInfo-container-item">
                    <el-select @change="changeOffercountries" default-first-option :clearable='true' placeholder="请选择" v-model="listQuery.offercountries"
                              filterable>
                      <el-option v-for="item in seletData.country" :key="String(item.countryCn)" :label="item.countryCn"
                                :value="String(item.countryCn)">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item v-if="listQuery.offercountries" label="业务领域:" class="postInfo-container-item">
                    <el-select default-first-option :clearable='true' placeholder="请选择" v-model="listQuery.businessArea" filterable>
                      <el-option v-for="item in seletData.ywBussiness" :key="String(item.typeName)" :label="item.typeName" :value="String(item.typeName)">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="排名:" class="postInfo-container-item">
                    <el-input default-first-option :clearable='true' placeholder="请选择" v-model="listQuery.ranking"
                               filterable>
                  </el-input>
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
        <!--        </el-button>-->
        <!-- <el-button v-allow="57" class="filter-item" type="primary" @click="clearSeach" size="small" icon="el-icon-delete">审查
        </el-button> -->
        <el-button v-allow="56" type="primary" size="small" icon="el-icon-edit" @click="createClick">创建</el-button>
      </div>
    </div>
    <div style="position:relative;height: 30px;">
      <TitleTotal :total="total"/>
      <el-button class="brush_right" :class="brushRightHasFilter?'red':''" @click="brushRight" type="text"
                 icon="el-icon-brush"></el-button>
      <div class="export" v-allow="426">
        <el-button type="text" @click="exportList(2)">导出</el-button>
        <span style="color: #52A2F4;margin: 0 5px"> / </span>
        <el-button type="text" @click="exportList(1)">全局导出</el-button>
      </div>
    </div>

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
               @rowDoubleClicked="rowDoubleClicked"
               animateRows
               @sortChanged="refreshEvenRowsCurrencyData"
               @filterChanged="refreshEvenRowsCurrencyData"
               :localeText="$store.state.caseInformation.localeText"
               :suppressDragLeaveHidesColumns="true"
               :suppressMakeColumnVisibleAfterUnGroup="true"
               rowGroupPanelShow="always"
               :groupSelectsChildren="true"
               :suppressAggFuncInHeader="true"
    >
    </AgGridVue>
    <pagination :pageSizes="pageSizesList" v-show="total>0" :total="total" :page.sync="listQuery.pageNo"
                :limit.sync="listQuery.pageSize" @pagination="getList"/>


    <el-dialog
      :title="titleType"
      append-to-body
      :close-on-click-modal="false"
      :visible.sync="cooperativeView"
      width="90%"
      height="80%"
      class="abow_dialog"
      :before-close="() => closeDialog(false)"
    >
      <cooperative_view :cooperativeId="cooperativeId" isCustomer ref="cooperative"
                        v-if="cooperativeView && titleType === '查看'"></cooperative_view>
      <cooperative-detail :cooperativeId="cooperativeId" @closeDialog="closeDialog" isCustomer ref="cooperative"
                          v-if="cooperativeView && titleType !== '查看'"
                          :is-edit="titleType === '修改' || titleType === '审查'"></cooperative-detail>
      <span slot="footer" class="dialog-footer fl-ac-jc">
        <el-button size="small" type="primary" v-if="titleType === '新建'" @click="createCooperative">创建</el-button>
        <el-button size="small" type="primary" v-if="titleType === '修改'" @click="updateCooperative">保存</el-button>
        <el-button v-if="titleType === '审查'" size="small" type="primary"
                   @click="customerExamine('1621')">审核通过</el-button>
        <el-button v-if="titleType === '审查'" size="small" type="primary"
                   @click="customerExamine('1624')">审核驳回</el-button>
        <el-button size="small" @click="closeDialog(false)">取消</el-button>
      </span>
    </el-dialog>

    <SelectOption :buss-id="bussId" v-if="selectionOptionState" :dialog-visible="selectionOptionState"
                  @cancel="closeSelect" :idArray="getCurrentRowsData('custId')"
                  :defaultMultipleSelect="preferenceList.map(i=>i.label)" :exportType="exportType"
                  :exportQueryModel="exportQueryModel"></SelectOption>
  </div>
</template>
<script>
  import {
    fetchList,
    delCustomer,
    querycustSelectClass,
    queryCustomerNameIdUrl,
    queryCountryUrl,
    updateLevelUrl
  } from "@/api/customerList";
  import Pagination from "@/components/Pagination";
  import Cooperative_view from "../../customer_management/cooperative_resources/components/cooperative_view";
  import CooperativeDetail from "../../customer_management/cooperative_resources/components/CooperativeDetail";
  import SelectOption from "../../case/components/SelectOption"; // secondary package based on el-pagination
  export default {
    components: {SelectOption, CooperativeDetail, Cooperative_view, Pagination},
    data() {
      return {
        bussId: 17,
        exportQueryModel: {},
        brushRightHasFilter: false,
        defaultData: {
          country: "",
          companyType: "",
          pageNo: 1,
          pageSize: JSON.parse(localStorage.getItem('pageSize')) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name).pageSize : 10 : 10,
          keyword: "",
          createTimeArray: ["", ""],
          examineStatuss: "",
          isCollaboration: "1"
        },
        cooperativeId: '',
        cooperativeView: false,
        titleType: '',
        drawerState: false,
        pageSizesList: [10, 50, 200, 500, 1000, 5000, 10000],
        dialogFormxy: false,
        list: [],
        total: 0,
        listLoading: true,
        listQuery: {
          keywords: '',
          pageNo: 1,
          pageSize: JSON.parse(localStorage.getItem('pageSize')) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name).pageSize : 10 : 10,
          keyword: "",
          createTime: [],
          examineStatuss: "",
          isCollaboration: "1"
        },
        deldata: {
          customerID: ""
        },
        seletData: {
          scStatu: {},
          country: {},
          custnames: {},
          level: {}
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
        xyData: {
          custId: "",
          level: "",
          memo: ""
        },
        gridOptions: {
          ...this.$store.state.caseInformation.gridOptions, ...{
            statusBar: {
              statusPanels: [
                {statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left'},
                {statusPanel: 'agSelectedRowCountComponent', align: 'left'},
              ]
            },
          }
        },
        currentPageSize: 0,
        preferenceList: [
          {'label': '创建人', prop: 'createUserName'},
          {'label': '合作资源中文', prop: 'fullname'},
          {'label': '合作资源英文', prop: 'fullnameEn'},
          {'label': '简称', prop: 'name'},
          {'label': '合作资源名称', prop: 'fullname'},
          {'label': '国籍', prop: 'country'},
          {'label': '合作资源状态', prop: 'collaborationStatusStr'},
          {'label': '审查状态', prop: 'examineStatusStr'},
          {'label': '创建日期', prop: 'createTime'},
          {'label': '是否客户', prop: 'isCustomerStr'},
          {'label': '沟通语言', prop: 'contactLanguageStr'},
        ],
        defaultcolumnDefs: [
          {
            headerName: '序号',
            field: 'sid',
            width: 60,
            'pinned': 'left', //固定再左边
            enableRowGroup: true,
            // enablePivot: true,
            floatingFilter: true,
            filter: false,
            cellClass: 'vAlign',
            suppressMenu: true,
            checkboxSelection: false,
            headerCheckboxSelection: false,
            headerCheckboxSelectionFilteredOnly: true,
            cellRenderer: this.cellRenderer,
          },
        ],
        columnDefs: [],
        exportType: '',
        selectionOptionState: false,
        selectionState: false,
        multipleTypeText: ''
      };
    },
    created() {
      this.getAllWfs()
      this.getList();
      this.getallSelectData();
    },
    computed: {
      clientHeight() {
        return document.documentElement.clientHeight - 210
      },
    },
    methods: {
      changeOffercountries(value){
       if (!value) {
        this.listQuery.businessArea = undefined
       }
      },
      vagueSearch(e, forceSearch) {
        if (forceSearch) {
          this.$set(this.listQuery, 'createTimeArray', ['', ''])
          this.getList('search')
        } else {
          if (!e) {
            this.$refs.searchRef.focus()
          } else {
            this.$set(this.listQuery, 'createTimeArray', ['', ''])
            this.getList('search')
          }
        }
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
          // this.exportListState=true
        } else if (flag == 1) {
          this.selectionOptionState = true
        }
      },
      brushRight() {
        let data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel')
        let arr = Object.keys(data)
        arr.forEach(item => {
          this.gridApi.destroyFilter(item)
        })
      },
      customerExamine(flag) {
        this.$refs.cooperative.customerExamine(flag)
      },
      updateCooperative() {
        this.$refs.cooperative.updatasubmitForm('postForm')
      },
      createCooperative() {
        this.$refs.cooperative.submitForm('postForm')
      },
      closeDialog(isSearch) {
        isSearch === true && this.getList('search')
        this.cooperativeId = ''
        this.titleType = ''
        this.cooperativeView = false
      },
      clickoutside() {
        this.drawerState = false
      },
      clearSeach() {
        this.listQuery = Object.assign({}, this.defaultData);

        // this.total = 0;
      },
      getAllWfs() {
        if (localStorage.getItem('tableHeader') && !Array.isArray(JSON.parse(localStorage.getItem('tableHeader')))) {
          let arr = []
          arr.push({
            name: this.$route.name,
            tableHeader: this.preferenceList.map(item => ({label: item.label, prop: item.prop, width: 200}))
          })
          localStorage.setItem('tableHeader', JSON.stringify(arr))
        }
        this.tableHeader = this.preferenceList.map(item => ({
          label: item.label,
          prop: item.prop,
          width: this.getLoactionWidth(item.label)
        }))
        this.saveLocation()

        const data = {
          userId: this.userId,
          bussId: this.bussId
        };
        var tableHeader = []
        if (localStorage.getItem('tableHeader') && JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$route.name)) {
          tableHeader = JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$route.name).tableHeader
          console.log(tableHeader);
        }
        if (this.preferenceList.length == tableHeader.length) {
          this.preferenceList = tableHeader
        }
        this.columnDefs = [...this.defaultcolumnDefs, ...this.preferenceList.map(item => ({
          headerName: item.label,
          field: item.prop,
          resizable: true,
          sortable: true,
          width: this.getLoactionWidth(item.label) == 'auto' ? 200 : this.getLoactionWidth(item.label),
          filter: 'agSetColumnFilter',
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
        // this.tableHeader=this.preferenceList.map(item=>({label:item.label, prop:item.prop,width: this.getLoactionWidth(item.label)}))
        // this.saveLocation()
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
      saveLocation() {
        if (!localStorage.getItem('tableHeader')) {
          let arr = []
          arr.push({name: this.$route.name, tableHeader: this.tableHeader})
          localStorage.setItem('tableHeader', JSON.stringify(arr))
        } else {
          let arr = JSON.parse(localStorage.getItem('tableHeader'))
          if (arr.find(item => item.name == this.$route.name)) {
            arr.find(item => item.name == this.$route.name).tableHeader = this.tableHeader
            localStorage.setItem('tableHeader', JSON.stringify(arr))
          } else {
            arr.push({name: this.$route.name, tableHeader: this.tableHeader})
            localStorage.setItem('tableHeader', JSON.stringify(arr))
          }
        }
      },
      refreshEvenRowsCurrencyData(params) {
        this.currentPageSize = params.api.rowModel.rootNode.allChildrenCount
        if (!params.columnApi.columnController.groupAutoColumns) {
          this.gridApi.forEachNode(rowNode => {
            rowNode.setDataValue(
              'sid',
              rowNode.rowIndex + 1)
          });
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
        if (params.colDef.field == 'sid') {
          return params.rowIndex + 1
        }
        return `<span title="${params.value}">${params.value ? params.value : ''}</span>`
      },
      getContextMenuItems(params) {
        if (!params.node || !params.node.data) {
          return []
        }
        return this.getRowContextmenuList(params.node.data).map(item => ({
          name: item.name,
          action: () => {
            this[item.action](params.node.data, params.value, params.node)
          },
        }))
      },
      getRowContextmenuList(row) {
        return [
          {name: '复制', action: 'copy'},
          {name: '审查', action: 'shencha', permissions: 57, examineStatusStr: '审查中'},
          {name: '修改', action: 'editFun', permissions: 58},
          {name: '删除', action: 'handledeleElement', permissions: 59},
        ].filter(item => {
          if (item.permissions) {
            if (item.examineStatusStr) {
              return this.$store.getters.permissions.includes(item.permissions) && row.examineStatusStr == item.examineStatusStr
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
      createClick() {
        this.cooperativeId = ''
        this.titleType = '新建'
        this.cooperativeView = true
      },
      editFun(row, value) {
        this.cooperativeId = row.custId
        this.titleType = '修改'
        this.cooperativeView = true
        // this.$router.push(`./cooperative_edit/${row.custId}`)
      },
      shencha(row) {
        this.cooperativeId = row.custId
        this.titleType = '审查'
        this.cooperativeView = true
        // this.$router.push(`./cooperative_edit/${row.custId}?examine=1`)
      },
      rowDoubleClicked(params) {
        this.cooperativeId = params.data.custId
        this.titleType = '查看'
        this.cooperativeView = true
        // this.$router.push(`./cooperative_view/${params.data.custId}`)
      },
      getList(type) {
        if (type == "search") {
          this.listQuery.pageNo = "1";
        }
        const params = JSON.parse(JSON.stringify(this.listQuery));
        if(params.createTimeArray && params.createTimeArray.length > 0) {
          if(params.createTimeArray[0] === "" && params.createTimeArray[1] === "") {
            delete params.createTimeArray;
          }
        }
        this.listLoading = true;
        fetchList(params).then(response => {
          this.list = response.data;
          this.total = response.total;
          this.listLoading = false;
          this.exportQueryModel = JSON.stringify(params)
        });
      },
      onGridReady(params) {
        this.gridparams = params
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        params.api.sizeColumnsToFit();
        // api.getToolPanelInstance(columns)
        // let that=this
        // this.$nextTick(()=>{
        //   if(document.querySelector('.ag-body-viewport')){
        //     document.querySelector('.ag-body-viewport').onscroll=function (e) {
        //       that.scrollTopY= e.target.scrollTop
        //     }
        //   }
        // })
      },
      dragStopped(params) {
        let tableHeader = params.columnApi.columnController.gridColumns.map(item => ({
          label: item.colDef.headerName,
          width: item.actualWidth,
          prop: item.colDef.field,
        })).filter(item => item.prop != 'sid' && item.prop != "group")
        var arr = JSON.parse(localStorage.getItem('tableHeader'))
        console.log(arr);
        arr.find(item => item.name == this.$route.name).tableHeader = tableHeader
        localStorage.setItem('tableHeader', JSON.stringify(arr))
        // this.changeHeader(tableHeader)
        // console.log(a);
      },
      remotepaternalUnit(query) {
        if (query !== "") {
          queryCustomerNameIdUrl({keyword: query, isCustomer: 1}).then(response => {
            if (response.success) {
              this.seletData.custnames = response.data;
            } else {
              this.$message.error(response.message);
            }
          });
        }
      },
      getallSelectData() {
        queryCountryUrl().then(response => {
          if (response.success) {
            this.seletData.country = response.data.areas;
          } else {
            this.$message.error(response.message);
          }
        });
        querycustSelectClass({classId: "1130,1099,1047,1112,1191"}).then(response => {
          if (response.success) {
            this.seletData.scStatu = response.data["1130"];
            this.seletData.level = response.data["1099"];
            this.seletData.hzzyTypr = response.data["1047"];
            this.seletData.ywBussiness = response.data["1112"];
            this.seletData.hzzyStatusList = response.data["1191"];
          } else {
            this.$message.error(response.message);
          }
        });
      },
      handledeleElement(item, index) {
        this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.deldata.customerID = item.custId;
            delCustomer(this.deldata).then(response => {
              if (response.success) {
                const index = this.list.indexOf(item);
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
        padding: 20px 0 50px 0;

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

  .buttonWrap {
    width: 100%;
    text-align: center;
    display: flex;
    justify-content: center;
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

  .searchRight {
    margin-left: 0;
    height: 33px;
    border-top-right-radius: 3px !important;
    border-bottom-right-radius: 3px !important;
    padding: 0 5px
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
    top: 30px;
  }

  .export {
    position: absolute;
    right: 0;
    top: 0;
  }

</style>

