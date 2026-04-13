<template>
  <div class="app-container">
    <header class="y-header">{{$route.meta.title}}</header>
    <div class="filter-container" style="margin-bottom:15px">
      <el-row>
        <el-col :span="24" style="text-align:center">
          <el-button-group class="button-group-search">
            <el-button type="primary" size="small" @click="getList('search')">搜索</el-button>
            <el-popover
              placement="bottom"
              width="550"
              trigger="click"
              v-model="drawerState"
            >
              <template>
                <el-form label-width="120px" :model="listQuery" size="mini" class="form-container">
                  <el-form-item label="姓名" class="content-center">
                    <el-input v-model="listQuery.name" placeholder="请输入内容"></el-input>
                  </el-form-item>
                  <el-form-item label="所属客户" class="content-center">
                    <el-select default-first-option :clearable='true' v-model="listQuery.custId" no-match-text='暂无数据' loading-text='正在查询' filterable remote reserve-keyword placeholder="请输入关键词"
                      :remote-method="remotepaternalUnit">
                      <el-option v-for="(item,key) in seletData.custnames" :key="key" :label="item.fullname" :value="item.custId">
                      </el-option>
                    </el-select>
                  </el-form-item>
                   <el-form-item label="客户国籍" class="content-center">
                      <el-select default-first-option :clearable='true' placeholder="请选择" v-model="listQuery.country" filterable>
                        <el-option v-for="item in seletData.country" :key="String(item.countryCn)" :label="item.countryCn" :value="String(item.countryCn)">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="联系人邮箱" class="content-center">
                      <el-input v-model="listQuery.email" placeholder="请输入内容" clearable></el-input>
                    </el-form-item>
                  <el-form-item label="来源场合" class="content-center">
                    <el-input v-model="listQuery.infoFromPlace" placeholder="请输入内容"></el-input>
                  </el-form-item>
                   <el-form-item label="创建日期" class="content-center">
                      <data-picker v-model="listQuery.createDateArray"></data-picker>
                    </el-form-item>
                  <el-form-item label="状态" class="content-center">
                    <el-checkbox-group v-model="listQuery.statuss">
                      <el-checkbox label="1212">在职</el-checkbox>
                      <el-checkbox label="1213">离职</el-checkbox>
                      <el-checkbox label="1215">退休</el-checkbox>
                      <el-checkbox label="1214">休假</el-checkbox>
                      <el-checkbox label="1216">其他</el-checkbox>
                    </el-checkbox-group>
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
<!--          <el-button class="filter-item" type="primary" @click="getList('search')" size="small" icon="el-icon-search">搜索-->
<!--          </el-button>-->
<!--          <el-button class="filter-item" type="primary" @click="clearSeach" size="small" icon="el-icon-delete">重置-->
<!--          </el-button>-->
          <!-- <el-button v-allow="68" class="filter-item" type="primary" @click="clearSeach" size="small" icon="el-icon-delete">审查
          </el-button> -->
          <router-link v-allow="67" :to="'./contact_df_creat'">
            <el-button type="primary" size="small" icon="el-icon-edit">创建</el-button>
          </router-link>
        </el-col>
      </el-row>

    </div>
    <TitleTotal :total="total" />
    <el-button class="brush_right" :class="brushRightHasFilter?'red':''" @click="brushRight" type="text" icon="el-icon-brush" ></el-button>
    <div style="cursor: pointer; position: absolute; display: flex; align-items: center; right: 0px; top: 55px; font-size: 14px; padding-right: 6px;">
      <el-button type="text" @click="exportList(2)" >导出</el-button>
      <span style="color: #52A2F4;margin: 0 5px"> / </span>
      <el-button type="text" @click="exportList(1)">全局导出</el-button>
<!--      <el-button type="text"  @click="exportList(1)"><i class="el-icon-download">导出</i></el-button>-->
<!--      <img @click="exportList(2)" src="@/assets/moon.png" style="width: 16px;height: 16px" width="16" alt="">-->
    </div>
<!--    </div>-->
    <AgGridVue
     :style="{ width:'100%', height: clientHeight + 'px'}"
     class="ag-theme-balham"
     :columnDefs="columnDefs"
     :rowData="list"
     rowSelection="multiple"
     @grid-ready="onGridReady"
     :gridOptions="gridOptions"
     :getContextMenuItems="getContextMenuItems"
     @sortChanged="refreshEvenRowsCurrencyData"
     @filterChanged="refreshEvenRowsCurrencyData"
     suppressAutoSize
     animateRows
     :localeText="$store.state.caseInformation.localeText"
     :suppressDragLeaveHidesColumns="true"
     :suppressMakeColumnVisibleAfterUnGroup="true"
     rowGroupPanelShow="always"
     :groupSelectsChildren="true"
     :suppressAggFuncInHeader="true"
    >
    </AgGridVue>
<!--    <el-table size="mini" :data="list" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">-->

<!--      <el-table-column label="姓名" align="left" width>-->
<!--        <template slot-scope="scope">-->
<!--          <span class="itemTitle_style" @click="$router.push('./contact_df_edit/'+scope.row.custContactId)">{{ scope.row.name }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="所属客户" align="left" width>-->
<!--        <template slot-scope="scope">-->
<!--          <CustCard :custName='scope.row.custName' :customerID='scope.row.custId' />-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="来源场合" align="left" width>-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ scope.row.infoFromPlace }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="职务" align="left" width>-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ scope.row.jobtitle }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="部门" align="left" width>-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ scope.row.department }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="办公电话" align="left" width>-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ scope.row.tel }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="邮箱" align="left" width>-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ scope.row.email }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="状态" align="left" width>-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ scope.row.statusStr }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="启用" align="left" width>-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ scope.row.sysStatusStr }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->

<!--      <el-table-column label="操作" align="left" width="" class-name="small-padding fixed-width">-->
<!--        <template slot-scope="scope">-->

<!--          <router-link v-allow="69" :to="'./contact_df_edit/'+scope.row.custContactId">-->
<!--            <el-button type="text" size="medium">-->
<!--              修改-->
<!--            </el-button>-->
<!--          </router-link>-->
<!--          <el-button v-allow="70" size="mini" type="text" @click="custAddrdel(scope.row,scope.$index)">删除</el-button>-->

<!--        </template>-->
<!--      </el-table-column>-->
<!--    </el-table>-->

    <pagination :pageSizes="pageSizesList" v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <SelectOption :buss-id="bussId" v-if="selectionOptionState" :dialog-visible="selectionOptionState" @cancel="closeSelect" :idArray="getCurrentRowsData('custContactId')" :defaultMultipleSelect="preferenceList.map(i=>i.label)" :exportType="exportType" :exportQueryModel="exportQueryModel"></SelectOption>
  </div>
</template>
<script>
  import SelectOption from '@/views/workbench/case/components/SelectOption'
import {
  queryCustomerContactListUrl,
  delCustomerContacturl,
  queryCustContactAllUrl,
  querycustSelectClass,
  queryCustomerNameIdUrl,
  queryCountryUrl
} from "@/api/customerList";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
const defaultData = {
  pageNo: 1,
  pageSize: 10,
  isCustomer: "1",
  custId: "",
  name: "",
  jobtitle: "",
  department: "",
  examineStatus: "",
  statuss: []
};
export default {
  components: { Pagination, SelectOption },
  data() {
    return {
      exportQueryModel: {},
      exportType: '',
      bussId: 49,
      selectionOptionState: false,
      multipleTypeText: '',
      selectionState: false,
      brushRightHasFilter: false,
      pageSizesList:[10, 50, 200,500,1000,5000,10000],
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
      columnDefs:[],
      preferenceList: [
        { 'label': '姓名', prop: 'name' },
        {'label': '所属客户', prop: 'custName'},
        {'label': '国籍', prop: 'custCountry'},
        { 'label': '来源场合', prop: 'infoFromPlace' },
        { 'label': '职务', prop: 'jobtitle' },
        { 'label': '部门', prop: 'department' },
        { 'label': '办公电话', prop: 'tel' },
        { 'label': '邮箱', prop: 'email' },
        { 'label': '状态', prop: 'statusStr' },
      ],
      drawerState: false,
      dialogFormxy: false,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        isCustomer: "1",
        custId: "",
        name: "",
        jobtitle: "",
        department: "",
        examineStatus: "",
        statuss: [],
        country: "",
        custId: "",
        infoFromPlace: ""
      },
      deldata: {
        customerID: ""
      },
      seletData: {
        scStatu: {},
        country: {},
        custnames: {},
        level: {},
        names: {}
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
      }
    };
  },
  computed: {
    clientHeight() {
      return document.documentElement.clientHeight - 200
    },
  },
  created() {
    this.getList();
    this.getallSelectData();
  },
  methods: {
    getCurrentRowsData(key){
      if (this.gridApi && this.gridApi.rowModel) {
        return this.gridApi.rowModel.rootNode.childrenAfterSort.map(item => item.data).map(item => item[key])
      }
      return []
    },
    getSelectedRows(){
      if(this.gridApi){
        const selectedNodes = this.gridApi.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data);
        return selectedData
      }else {
        return []
      }
    },
    exportList(flag){
      this.exportType=flag
      if(flag==2){
        this.selectionOptionState = true;
        this.multipleTypeText = '列表导出';
        // this.exportListState=true
      } else if(flag == 1) {
        this.selectionOptionState=true
      }
    },
    closeSelect(){
      this.selectionState=false
      this.selectionOptionState=false
    },
    brushRight() {
      let data = this.gridApi.getFilterModel()
      let arr =  Object.keys(data)
      arr.forEach(item=>{
        this.gridApi.destroyFilter(item)
      })
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
      if(params.type=="filterChanged"){
        // this.$commonUtils.saveFilterModel(this.$options.name+this.$route.name,'FilterModel',this.gridApi.getFilterModel())
         var data = this.gridApi.getFilterModel()
        var arr = Object.keys(data);
        if(arr.length){
          this.brushRightHasFilter=true
        }else {
          this.brushRightHasFilter=false
        }
      }
    },
    cellRenderer(params) {
      if (params.colDef.field === 'sid') {
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
          this[item.action](params.node.data, params.node.rowIndex,params.value, params.node)
        }
      }))
    },
    editFun(row){
      this.$router.push('/workbench/customer_management/contact_df_edit/'+row.custContactId)
    },
    delFun(row){
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delCustomerContacturl({ custContactId: row.custContactId }).then(
            response => {
              if (response.success) {
                const index = this.list.indexOf(row);
                this.list.splice(index, 1);
                this.total--
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
    },
    getRowContextmenuList(row) {
      return [
        { name: '复制', action: 'copy' },
        // { name: '商标导入', action: 'installtmmessage', permissions: 185 },
        { name: '修改', action: 'editFun', permissions: 69 },
        { name: '删除', action: 'delFun', permissions: 70 }
      ].filter(item => {
        if (item.permissions) {
          return this.$store.getters.permissions.includes(item.permissions)
        } else {
          return true
        }
      })
    },
    onGridReady(params) {
      this.gridparams = params
      this.gridApi = params.api
      this.columnApi = params.columnApi
      params.api.sizeColumnsToFit()
    },
    clearSeach() {
      this.listQuery = Object.assign({}, defaultData);

      this.total = "0";
    },
    getList(type) {
      this.columnDefs = [...this.defaultcolumnDefs, ...this.preferenceList.map(item => ({
        headerName: item.label,
        field: item.prop,
        resizable: true,
        sortable: true,
        width: item.width,
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
      if (type == "search") {
        this.listQuery.pageNo = "1";
      }
      this.listLoading = true;
      queryCustomerContactListUrl(this.listQuery).then(response => {
        this.list = response.data;
        this.total = response.total;
        this.listLoading = false;
        this.drawerState = false;
        this.exportQueryModel = JSON.stringify(this.listQuery)
      });
    },
    remotepaternalUnit(query) {
      if (query !== "") {
        queryCustomerNameIdUrl({ keyword: query,isCustomer:1 }).then(response => {
          if (response.success) {
            this.seletData.custnames = response.data;
          } else {
            this.$message.error(response.message);
          }
        });
      }
    },
    getallSelectData() {
      querycustSelectClass({ classId: "1130" }).then(response => {
        if (response.success) {
          this.seletData.scStatu = response.data["1130"];
        } else {
          this.$message.error(response.message);
        }
      });
      queryCountryUrl().then(response => {
        if (response.success) {
          this.seletData.country = response.data.areas;
        } else {
          this.$message.error(response.message);
        }
      });
      // queryCustContactAllUrl().then(response => {
      //   if (response.success) {
      //     this.seletData.names = response.data;
      //   } else {
      //     this.$message.error(response.message);
      //   }
      // });
      // querycustSelectClass({ classId: "1130,1099" }).then(response => {
      //   if (response.success) {
      //     this.seletData.scStatu = response.data["1130"];
      //     this.seletData.level = response.data["1099"];
      //   } else {
      //     this.$message.error(response.message);
      //   }
      // });
    },
    custAddrupdata(row, type) {},
    custAddrdel(row, type, index) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delCustomerContacturl({ custContactId: row.custContactId }).then(
            response => {
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
   .form-container /deep/ {
    max-height: 500px;
    overflow: auto;
    /*width: 550px;*/
    padding-bottom: 10px;

    .el-form-item__label {
      text-align: right;
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
   > > > .content-center {
    .el-form-item__content {
      height: 28px;
      display: flex;
      align-items: center;
      /*justify-content: center;*/
    }
  }
   .brush_right{
      position: absolute;
      right: 15px;
      z-index: 1;
      top: 85px;
    }
</style>

