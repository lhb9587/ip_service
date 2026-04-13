<template>
  <div class="trademarkTable">
    <p style="color: #409EFF">共计:{{ total }}</p>
    <!-- <el-table
    ref="trademarkTable"
    :data="trademarkTableList"
    border
    empty-text="暂无数据"
    highlight-current-row
    current-row-key
    style="width: 100%;"
    @select="handleSelectionChange"
    @select-all="handleSelectionAll"
    :header-cell-class-name="cellClass"
  >
    <el-table-column
      type="selection"
      width="30"
      class="selection"
    >
    </el-table-column>
    <el-table-column type="index" width="60" label="序号" align="left">
    </el-table-column>
    <el-table-column
      prop="商标图样"
      label="商标图样"
      width="auto">
      <template slot-scope="scope" >
        <img :src="`${scope.row.tmId?'tmFile':'ipdoc'}${scope.row.imgFilePath}`" alt="">
      </template>
    </el-table-column>
    <el-table-column
      prop="regNumber"
      label="商标号"
      width="auto"
      >
    </el-table-column>
    <el-table-column
      prop="tmName"
      label="商标名称"
      width="auto"
    >
    </el-table-column>
    <el-table-column
      prop="tmType"
      label="商标类别"
      width="auto"
    >
    </el-table-column>
    <el-table-column
      prop="applicantName"
      label="申请人中文名称"
      width="auto"
    >
    </el-table-column>
  </el-table> -->
    <AgGridVue
      :style="{ width: '100%', height: '400px' }"
      class="ag-theme-balham"
      @grid-ready="onGridReady"
      :columnDefs="columnDefs"
      :gridOptions="gridOptions"
      :rowData="trademarkTableList"
      :rowSelection="'multiple'"
      :localeText="$store.state.caseInformation.localeText"
      @row-selected="onRowSelected"
    ></AgGridVue>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.pageNo"
      :limit.sync="listQuery.pageSize"
      @pagination="queryCanProcessTm"
      :pageSizes="[10, 50, 200, 500, 1000, 5000, 10000]"
    />
  </div>
</template>

<script>
import { queryCanProcessTm, importTmRegNumberData } from "@/api/caseList";
import Pagination from "@/components/Pagination";
export default {
  props: {
    multipleState: {
      type: Boolean,
      default: false
    },
    queryModuleData: {
      type: Object
    },
    queryCanProcessTmState: {
      type: Boolean,
      default: false
    },
    regNumberList: {
      type: Array
    },
    goodClasses: {
      type: String
    },
    multiclass: {}
  },
  name: "trademarkTable",
  data() {
    return {
      trademarkTableList: [],
      total: 0,
      listQuery: {
        pageNo: 0,
        pageSize: 10
      },
      multipleSelection: [],
      ableCreate: [],
      firstEnter: true,
      listLoading: false,
      columnDefs: [
        {
          headerName: "商标号",
          field: "regNumber",
          headerCheckboxSelection: true,
          checkboxSelection: true,
          showDisabledCheckboxes: true
        },
        {
          headerName: "商标图样",
          field: "imgFilePath",
          cellRenderer: this.cellRenderer
        },
        { headerName: "商标名称", field: "tmName" },
        { headerName: "商标类别", field: "tmType" },
        { headerName: "申请人中文名称", field: "applicantName" }
      ],
      gridOptions: {
        rowClassRules: {
          // 重写选中行的样式规则，返回false意味着不应用任何额外的样式规则
          "ag-row-selected": () =>  {
            return false; // 这里总是返回false，因此'ag-row-selected'类将不会被添加
          }
        }
      }
    };
  },
  created() {},
  methods: {
    cellRenderer(params) {
      if (params.colDef.field == "imgFilePath") {
        let tyimage = "";
        if (params.data.tmId) {
          tyimage = `tmFile${params.value}`;
        } else {
          tyimage = `ipdoc${params.value}`;
        }
        return `<img class="filterTableTmg" src="${tyimage}" alt="">`;
      }
    },
    onRowSelected(values) {
      const selectedNodes = values.api.getSelectedNodes();
      const selectedData = selectedNodes.map(node => node.data);
      let row = values.data;
      let val = selectedData;
      val = val.filter(item => item !== undefined);
      if (!this.multipleState) {
        if (!val.find(item => item.regNumber === row.regNumber)) {
          this.multipleSelection = val;
          this.multipleSelection = this.multipleSelection.filter(
            item => item.regNumber !== row.regNumber
          );
        } else {
          if (this.multiclass === true || this.multiclass === null) {
            if (
              !this.multipleSelection
                .map(item => item.regNumber)
                .includes(row.regNumber)
            ) {
              this.multipleSelection = [row];
              this.trademarkTableList.forEach(item => {
                if (row["regNumber"] === item["regNumber"]) {
                  this.$refs.trademarkTable.toggleRowSelection(item, true);
                } else {
                  this.$refs.trademarkTable.toggleRowSelection(item, false);
                }
              });
            } else {
              this.multipleSelection = val;
            }
          } else if (this.multiclass === false) {
            this.multipleSelection = [row];
            this.trademarkTableList.forEach(item => {
              if (row["regNumber"] === item["regNumber"]) {
                this.$refs.trademarkTable.toggleRowSelection(item, true);
              } else {
                this.$refs.trademarkTable.toggleRowSelection(item, false);
              }
            });
          }
        }
      } else {
        this.multipleSelection = val;
        if (!val.find(item => item.regNumber === row.regNumber)) {
          // this.multipleSelection = this.multipleSelection.filter(
          //   item => item.regNumber !== row.regNumber
          // );
          this.ableCreate = this.ableCreate.filter(
            item => item.regNumber !== row.regNumber
          );
        }
      }
      this.$emit("getTrademark", this.multipleSelection);
    },
    onGridReady(params) {
      // 表格自适应
      params.api.sizeColumnsToFit();
    },
    queryCanProcessTm(ableCreate) {
      const data = {
        pageNo: this.listQuery.pageNo,
        pageSize: this.listQuery.pageSize,
        custId: this.queryModuleData.custId,
        appId: this.queryModuleData.appId,
        caseTypeId: this.queryModuleData.caseTypeId,
        importByCase: this.queryModuleData.caseTypeId == 30? 1 : ''
      };
      if (!this.queryModuleData.appId) {
        return;
      }
      if (
        this.queryModuleData.address &&
        this.queryModuleData.address.length >= 1
      ) {
        data.addressList = this.queryModuleData.address;
      }
      if (this.queryModuleData.addressEnList) {
        data.addressEnList = this.queryModuleData.addressEnList;
      }
      if (this.queryModuleData.regStartDate) {
        data.regStartDate = this.queryModuleData.regStartDate;
      }
      if (this.queryModuleData.regEndDate) {
        data.regEndDate = this.queryModuleData.regEndDate;
      }
      if (this.regNumberList && this.regNumberList.length) {
        data["regNumberInUse"] = this.regNumberList[0].regNumber;
      }
      if (this.queryModuleData.regNumberInUse) {
        data.regNumberInUse = this.queryModuleData.regNumberInUse;
      }
      this.listLoading = true;
      queryCanProcessTm(data).then(res => {
        this.listLoading = false;
        this.trademarkTableList = res.data;
        this.total = res.total;
        if (ableCreate) {
          this.multipleSelection = this.unique(
            this.multipleSelection.concat(this.ableCreate),
            "regNumber"
          );
          this.$emit("getTrademark", this.multipleSelection);
        }
        if (this.firstEnter) {
          if (!this.$route.query.import && this.$route.name === "case_detail") {
            this.multipleSelection = this.regNumberList;
            if (this.goodClasses) {
              var goodClassList = this.goodClasses.split(";");
              this.multipleSelection = this.trademarkTableList
                .filter(
                  item => item.regNumber === this.multipleSelection[0].regNumber
                )
                .filter(item => goodClassList.includes(item.tmType));
            }
            this.firstEnter = false;
          }
        }
        if (this.multipleSelection.length) {
          this.$nextTick(() => {
            this.multipleSelection.forEach(itm => {
              this.$refs.trademarkTable.toggleRowSelection(
                this.trademarkTableList.find(
                  item => item.regNumber === itm.regNumber
                ),
                true
              );
            });
          });
        }
      });
    },
    handleSelectionAll(val) {
      val = val.filter(item => item !== undefined);
      this.multipleSelection = this.unique(
        this.multipleSelection.concat(val),
        "regNumber"
      );

      if (!val.length) {
        this.trademarkTableList.forEach(row => {
          this.multipleSelection = this.multipleSelection.filter(
            item => item.regNumber !== row.regNumber
          );
        });
      }
      this.$emit("getTrademark", this.multipleSelection);
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
    importTmRegNumberData() {
      const data = {
        custId: this.queryModuleData.custId,
        appId: this.queryModuleData.appId,
        caseTypeId: this.queryModuleData.caseTypeId
      };
      // if (['变名','变址','变名变址'].includes(this.queryModuleData.caseTypeName)) {
      //   data.caseTypeId = 5
      // }
      data.regNumberList = this.regNumberList;
      importTmRegNumberData(data).then(res => {
        const reasons = `<h4>导入成功</h4><p style="margin:10px 0 ">表中有${
          res.data.ableCount
        }条商标与当前条件匹配已自动勾选</p><p style="margin:10px 0 ">表中有${
          res.data.disableCount
        }条商标与当前条件不符合，如有需要有请手动添加</p>`;
        this.$message({
          showClose: true,
          dangerouslyUseHTMLString: true,
          message: reasons,
          type: "success",
          duration: 0
        });
        this.ableCreate = res.data.ableCreate;
        this.queryCanProcessTm("ableCreate");
      });
    },
    cellClass(row) {
      if (row.columnIndex === 0 && !this.multipleState) {
        return "DisableSelection";
      }
    }
  },
  watch: {
    queryCanProcessTmState(n, o) {
      if (n) {
        this.queryCanProcessTm();
        if (this.$route.query.import) {
          this.multipleSelection = [];
          this.$emit("getTrademark", this.multipleSelection);
        }
        this.$emit("queryCanProcessTmChange", false);
      }
    },
    regNumberList: {
      handler(n, o) {
        if (!this.$route.query.import && this.$route.name !== "case_detail") {
          this.importTmRegNumberData();
        }
      },
      deep: true
    }
  },
  components: {
    Pagination
  }
};
</script>

<style lang="scss" scoped>
/deep/ .ag-theme-balham {
  margin-bottom: 10px;
  .ag-row-selected:nth-child(odd) {
    background-color: #E1F3FF !important;
    color: inherit !important; /* 或任何你希望的颜色，'inherit'用来继承父元素颜色 */
    font-weight: normal !important;
  }
  .ag-row-selected:nth-child(even) {
    background-color: inherit !important;
    color: inherit !important; /* 或任何你希望的颜色，'inherit'用来继承父元素颜色 */
    font-weight: normal !important;
  }
}
.el-table /deep/ .DisableSelection .cell {
  visibility: hidden;
}
.el-table /deep/ .cell img {
  width: 100px;
  margin-top: 10px;
}
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
/deep/ .filterTableTmg {
  height: 100%;
}
</style>
