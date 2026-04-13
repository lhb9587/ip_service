<template>
  <div class="app-container">
    <header class="y-header">{{$route.meta.title}}</header>
    <div class="filter-container" style="margin-bottom:15px">
      <el-form :inline="true" :model="listQuery" size="small" class="demo-form-inline">

        <el-form-item label="主题">
          <el-input clearable v-model="listQuery.subject" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="活动类型">
          <el-select default-first-option :clearable='true' placeholder="请选择" v-model="listQuery.actType" filterable>
            <el-option v-for="item in seletData.hdtype" :key="String(item.id)" :label="item.typeName" :value="String(item.id)">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动状态">
          <el-select default-first-option :clearable='true' placeholder="请选择" v-model="listQuery.actStatus" filterable>
            <el-option v-for="item in seletData.hdstatu" :key="String(item.id)" :label="item.typeName" :value="String(item.id)">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="对方联系人">
          <el-select default-first-option :clearable='true' v-model="listQuery.custContactId" no-match-text='暂无数据' loading-text='正在查询' filterable remote reserve-keyword placeholder="请输入关键词"
            :remote-method="remotepaternalUnit">
            <el-option v-for="item in seletData.custnames" :key="item.custContactId" :label="item.name" :value="item.custContactId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动方式">
          <el-select default-first-option :clearable='true' placeholder="请选择" v-model="listQuery.actKind" filterable>
            <el-option v-for="item in seletData.hdfs" :key="String(item.id)" :label="item.typeName" :value="String(item.id)">
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
      <el-row>
        <el-col :span="24" style="text-align:center">
          <el-button class="filter-item" type="primary" @click="getList('search')" size="small" icon="el-icon-search">搜索
          </el-button>
          <el-button class="filter-item" type="primary" @click="clearSeach" size="small" icon="el-icon-delete">重置
          </el-button>
          <!-- <el-button v-allow="72" class="filter-item" type="primary" @click="clearSeach" size="small" icon="el-icon-delete">审查
          </el-button> -->
          <router-link v-allow="71" :to="'./activity_creat'">
            <el-button type="primary" size="small" icon="el-icon-edit">创建</el-button>
          </router-link>
        </el-col>
      </el-row>

    </div>
    <TitleTotal :total="total" />
<!--    <el-table height="500" size="mini" :data="list" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">-->
<!--      <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>-->
<!--      <el-table-column label="主题" align="left" width="300">-->
<!--        <template slot-scope="scope">-->
<!--          <span class="itemTitle_style" @click="$router.push('./activity_edit/'+scope.row.custActId)">{{ scope.row.subject }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="活动类型" align="left" width>-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ scope.row.actTypeStr }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="开始时间" align="left" width>-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ scope.row.begindate }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      &lt;!&ndash; <el-table-column label="对方联系人" align="left" width>-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ scope.row.customerContactActs[0].custContactName }}</span>-->
<!--        </template>-->
<!--      </el-table-column> &ndash;&gt;-->
<!--      <el-table-column label="活动方式" align="left" width>-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ scope.row.actKindStr }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="活动状态" align="left" width>-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ scope.row.actStatusStr }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="审查状态" align="left" width>-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ scope.row.examineStatusStr }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="备注" align="left" width>-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ scope.row.memo }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->

<!--      <el-table-column label="操作" align="left" class-name="small-padding fixed-width">-->
<!--        <template slot-scope="scope">-->

<!--          <el-row>-->
<!--            <el-col :span="24">-->

<!--              <router-link v-allow="73" :to="'./activity_edit/'+scope.row.custActId">-->
<!--                <el-button type="text" size="medium">-->
<!--                  修改-->
<!--                </el-button>-->
<!--              </router-link>-->
<!--              <el-button v-allow="74" size="medium" type="text" @click="handledeleElement(scope.row,scope.$index)">删除</el-button>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--    </el-table>-->
    <AgGridVue
               style="width:100%;height: 500px"
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
    >
    </AgGridVue>
    <pagination v-show="total>0" :total="total" :page-sizes="[10,50,100,500,1000,5000]" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

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
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
const defaultData = {
  isCustomer: "1",
  pageNo: 1,
  pageSize: 10,
  actType: "",
  examineStatuss: [],
  actStatus: "",
  subject: "",
  custContactId: "",

  actKind: ""
};
export default {
  components: { Pagination },
  data() {
    return {
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
      preferenceList: [{ 'label': '主题', prop: 'subject','width': 300 },
                       {'label': '活动类型', prop: 'actTypeStr'},
                       { 'label': '开始时间', prop: 'begindate' },
                       { 'label': '活动方式', prop: 'actKindStr' },
                       { 'label': '活动状态', prop: 'actStatusStr' },
                       { 'label': '审查状态', prop: 'examineStatusStr' },
                       { 'label': '备注', prop: 'memo' }
                      ],
      gift: '',
      dialogFormxy: false,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        gift: '',
        begindateArray:[],
        isCustomer: "1",
        pageNo: 1,
        pageSize: 10,
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
        custnames: {}
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
  created() {
    this.getList();
    this.getallSelectData();
  },
  methods: {
    refreshEvenRowsCurrencyData(params) {
      this.currentPageSize = params.api.rowModel.rootNode.allChildrenCount
      if (!params.columnApi.columnController.groupAutoColumns) {
        this.gridApi.forEachNode(rowNode => {
          rowNode.setDataValue(
            'sid',
            rowNode.rowIndex + 1)
        })
      }
    },
    cellRenderer(params) {
      if (params.colDef.field === 'sid') {
        return params.rowIndex + 1
      }
      if(params.colDef.field=='subject'){
        var eDiv = document.createElement('div');
        eDiv.innerHTML = `<span class="btn-simple" style="cursor: pointer;color: #00b0ff" title="${params.value}">${params.value?params.value:''}</span>`
        var eButton = eDiv.querySelectorAll('.btn-simple')[0];

        eButton.addEventListener('click', ()=> {
          if(params.data){
            this.$router.push(`./activity_edit/${params.data.custActId}`)
          }
        });

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
          this[item.action](params.node.data, params.node.rowIndex,params.value, params.node)
        }
      }))
    },
    getRowContextmenuList(row) {
      return [
        { name: '复制', action: 'copy' },
        // { name: '商标导入', action: 'installtmmessage', permissions: 185 },
        { name: '修改', action: 'editFun', permissions: 73 },
        { name: '删除', action: 'handledeleElement', permissions: 74 }
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
      this.$router.push(`./activity_edit/${row.custActId}`)
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
      if (type == "search") {
        this.listQuery.pageNo = "1";
      }
      this.listLoading = true;
      queryActivityListUrl(this.listQuery).then(response => {
        this.list = response.data;
        this.total = response.total;
        this.listLoading = false;
      });
    },
    remotepaternalUnit(query) {
      if (query !== "") {
        queryCustContactAllUrl({ name: query }).then(response => {
          if (response.success) {
            this.seletData.custnames = response.data;
          } else {
            this.$message.error(response.message);
          }
        });
      }
    },
    getallSelectData() {
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
            return this.$commonUtils.sort(a, b, item.prop)
          }
        }
      }))]
      console.log(this.columnDefs,222)
      querycustSelectClass({ classId: "1050,1049,1051" }).then(response => {
        if (response.success) {
          this.seletData.hdstatu = response.data["1050"];
          this.seletData.hdtype = response.data["1049"];
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
          delActivity({ custActId: row.custActId }).then(response => {
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
</style>

