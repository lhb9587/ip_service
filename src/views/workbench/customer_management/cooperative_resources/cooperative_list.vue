<template>
  <div class="app-container">
    <header class="y-header">{{$route.meta.title}}</header>
    <div class="filter-container" style="margin-bottom:15px">
      <!--      <el-form :inline="true" :model="listQuery" size="small" class="demo-form-inline">-->

      <!--        <el-form-item label="合作资源名称">-->
      <!--          <el-input v-model="listQuery.keyword" placeholder="请输入内容"></el-input>-->
      <!--        </el-form-item>-->
      <!--        <el-form-item label="创建日期">-->
      <!--          <DataPicker class="DataPicker" v-model="listQuery.createTimeArray"></DataPicker>-->
      <!--          &lt;!&ndash;          <el-date-picker v-model="listQuery.createTime" format='yyyy-MM-dd' value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">&ndash;&gt;-->
      <!--          &lt;!&ndash;          </el-date-picker>&ndash;&gt;-->
      <!--        </el-form-item>-->
      <!--        <el-form-item label="审查状态">-->
      <!--          <el-select default-first-option :clearable='true' placeholder="请选择" v-model="listQuery.examineStatus"-->
      <!--                     filterable>-->
      <!--            <el-option v-for="item in seletData.scStatu" :key="String(item.id)" :label="item.typeName"-->
      <!--                       :value="String(item.id)">-->
      <!--            </el-option>-->
      <!--          </el-select>-->
      <!--        </el-form-item>-->

      <!--      </el-form>-->
      <div class="buttonWrap">
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
                </el-form>
              </div>
              <div class="clearWrap">
                <el-button size="mini" @click="clearSeach"><span>重置</span></el-button>
                <el-button type="primary" size="mini" @click="getList('search')">搜索</el-button>
              </div>
            </div>
          </transition>
        </el-button-group>
        <el-button style="margin-right: 10px" type="primary" @click="clearSeach" size="small" icon="el-icon-delete">重置
        </el-button>
        <!-- <el-button v-allow="57" class="filter-item" type="primary" @click="clearSeach" size="small" icon="el-icon-delete">审查
        </el-button> -->
        <router-link v-allow="56" :to="'./cooperative_creat'">
          <el-button type="primary" size="small" icon="el-icon-edit">创建</el-button>
        </router-link>
      </div>
    </div>
    <TitleTotal :total="total"/>
    <!--    <el-table size="mini" :data="list" border fit empty-text="暂无数据" highlight-current-row current-row-key style="width: 100%;">-->
    <!--      <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>-->
    <!--      <el-table-column label="合作资源名称" align="left" width>-->
    <!--        <template slot-scope="scope">-->
    <!--          <span class="itemTitle_style" @click="$router.push('./cooperative_edit/'+scope.row.custId)">{{ scope.row.fullname }}</span>-->
    <!--        </template>-->
    <!--      </el-table-column>-->
    <!--      <el-table-column label="国籍" align="left" width>-->
    <!--        <template slot-scope="scope">-->
    <!--          <span>{{ scope.row.country }}</span>-->
    <!--        </template>-->
    <!--      </el-table-column>-->
    <!--      <el-table-column label="合作资源状态" align="left" width>-->
    <!--        <template slot-scope="scope">-->
    <!--          <span>{{ scope.row.curStatusStr }}</span>-->
    <!--        </template>-->
    <!--      </el-table-column>-->
    <!--      <el-table-column label="审查状态" align="left" width>-->
    <!--        <template slot-scope="scope">-->
    <!--          <span>{{ scope.row.examineStatusStr }}</span>-->
    <!--        </template>-->
    <!--      </el-table-column>-->
    <!--      <el-table-column label="创建日期" align="left" width>-->
    <!--        <template slot-scope="scope">-->
    <!--          <span>{{ scope.row.createTime }}</span>-->
    <!--        </template>-->
    <!--      </el-table-column>-->
    <!--      <el-table-column label="操作" align="left" class-name="small-padding fixed-width">-->
    <!--        <template slot-scope="scope">-->

    <!--          <el-row>-->
    <!--            <el-col :span="24">-->

    <!--              <router-link v-allow="58" :to="'./cooperative_edit/'+scope.row.custId">-->
    <!--                <el-button type="text" size="medium">-->
    <!--                  修改-->
    <!--                </el-button>-->
    <!--              </router-link>-->
    <!--              <el-button v-allow="59" size="medium" type="text" @click="handledeleElement(scope.row,scope.$index)">删除</el-button>-->
    <!--            </el-col>-->
    <!--          </el-row>-->
    <!--        </template>-->
    <!--      </el-table-column>-->
    <!--    </el-table>-->
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
  import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
  const defaultData = {
    country: "",
    companyType: "",
    pageNo: 1,
    pageSize: 10,
    keyword: "",
    createTimeArray: ["", ""],
    examineStatuss: "",
    isCollaboration: "1"
  };
  export default {
    components: {Pagination},
    data() {
      return {
        drawerState: false,
        pageSizesList: [10, 50, 200, 500, 1000, 5000, 10000],
        dialogFormxy: false,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          pageNo: 1,
          pageSize: 10,
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
          {'label': '合作资源状态', prop: 'curStatusStr'},
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
            // checkboxSelection:function(params) {
            //   // we put checkbox on the name if we are not doing grouping
            //   return params.columnApi.getRowGroupColumns().length === 0;
            // },
            // headerCheckboxSelection:(params)=>{
            //   // we put checkbox on the name if we are not doing grouping
            //   if(this.selectionState){
            //     return false
            //   }
            //   console.log(params.columnApi.getRowGroupColumns().length === 0);
            //   return params.columnApi.getRowGroupColumns().length === 0;
            // }
          },
        ],
        columnDefs: [],
      };
    },
    created() {
      this.listQuery.createTimeArray = [this.$wUtil.getDate('', 'day'), this.$wUtil.getDate('', 'day')]
      this.getAllWfs()
      this.getList();
      this.getallSelectData();
    },
    computed: {
      clientHeight() {
        return document.documentElement.clientHeight - 270
      },
    },
    methods: {
      clickoutside() {
        this.drawerState = false
      },
      clearSeach() {
        this.listQuery = Object.assign({}, defaultData);

        this.total = "0";
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
      editFun(row, value) {
        this.$router.push(`./cooperative_edit/${row.custId}`)
      },
      shencha(row) {
        this.$router.push(`./cooperative_edit/${row.custId}?examine=1`)
      },
      rowDoubleClicked(params) {
        this.$router.push(`./cooperative_view/${params.data.custId}`)
      },
      getList(type) {
        if (type == "search") {
          this.listQuery.pageNo = "1";
        }
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.list = response.data;
          this.total = response.total;
          this.listLoading = false;
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
        querycustSelectClass({classId: "1130,1099,1047"}).then(response => {
          if (response.success) {
            this.seletData.scStatu = response.data["1130"];
            this.seletData.level = response.data["1099"];
            this.seletData.hzzyTypr = response.data["1047"];
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
</style>

