<template>
  <div class="business-info">
    <el-button size="mini" type="primary" v-if="editStatus" @click="addBusiness">新增</el-button>
<!--    <div class="base-header">-->
<!--      <span class="left-line"></span>-->
<!--      <span class="right-text">关联商机</span>-->
<!--    </div>-->

    <div class="header-table">
      <el-table :max-height="clientHeight" class="el-table1" size="mini" :data="businessList" fit empty-text="暂无数据"
                highlight-current-row
                current-row-key style="width: 100%;" @row-dblclick="rowDbClick">
        <el-table-column label="商机来源" align="left" width prop="laiyuan" :filters="headFilters['laiyuan']" :filter-method="filterHandler">
          <template slot-scope="scope">
            <span :title="scope.row.laiyuan">{{ scope.row.laiyuan }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商机日期" align="left" width prop="sjDate" :filters="headFilters['sjDate']" :filter-method="filterHandler">
          <template slot-scope="scope">
            <span :title="scope.row.sjDate">{{ scope.row.sjDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="领域" align="left" width prop="domain" :filters="headFilters['domain']" :filter-method="filterHandler">
          <template slot-scope="scope">
            <span :title="scope.row.domain">{{ scope.row.domain }}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系人" align="left" width prop="lxren" :filters="headFilters['lxren']" :filter-method="filterHandler">
          <template slot-scope="scope">
            <span :title="scope.row.lxren">{{ scope.row.lxren }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建日期" align="left" width>
          <template slot-scope="scope">
            <span :title="scope.row.createDate">{{ scope.row.createDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系方式" align="left" width prop="lxfs" :filters="headFilters['lxfs']" :filter-method="filterHandler">
          <template slot-scope="scope">
            <span :title="scope.row.lxfs">{{ scope.row.lxfs }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商机描述" align="left" width>
          <template slot-scope="scope">
            <span :title="scope.row.sjdesc">{{ scope.row.sjdesc }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="editStatus" label="操作" align="left" width="" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <span class="pointer" @click="delBusiness(scope.row, scope.$index)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      :title="'关联商机 - ' + title"
      style="position:absolute;left: 0;top: 0;" :fullscreen="false" :show-close="false"
      :close-on-click-modal="false" :modal="false"
      :visible.sync="businessView"
      width="60%"
      class=""
    >
      <business-dialog v-if="businessView" :sjId="sjId" :type="type" :cust-id="custId" :cust-name="fullname"
                       @close="closeDialog"></business-dialog>
      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
  </div>
</template>

<script>
  import {delShangji, queryShangjiList} from "../../../../../api/business";
  import BusinessDialog from "../../business_opportunities/BusinessDialog";

  export default {
    name: "BusinessOpportunity",
    components: {BusinessDialog},
    props: {
      tabNo: {},
      fullname: {},
      custId: {},
      editStatus: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        headFilters: {},
        type: '',
        sjId: '',
        title: '',
        businessView: false,
        businessList: []
      }
    },
    computed: {
      clientHeight() {
        return document.documentElement.clientHeight - 300
      },
    },
    created() {
      this.queryList()
    },
    methods: {
      filterHandler(value, row, column) {
        const property = column['property']
        return row[property] === value
      },
      closeDialog(isSearch) {
        isSearch === true && this.queryList()
        this.$emit('changeMask', {type: 'del', value: this.tabNo})
        this.businessView = false
        this.title = ''
        this.type = ''
      },
      queryList() {
        queryShangjiList({custId: this.custId, pageNo: 1, pageSize: 1000}).then(res => {
          this.businessList = res.data || []
          this.headFilters = this.$commonUtils.tableFilter(this.businessList)
        })
      },
      delBusiness(row, index) {
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          delShangji({
            sjId: row.sjId
          }).then(res => {
            this.$message.success('删除成功!')
            this.businessList.splice(index, 1)
          })
        })
      },
      addBusiness() {
        this.$emit('changeMask', {type: 'add', value: this.tabNo})
        this.title = '新建'
        this.type = '新增商机'
        this.businessView = true
      },
      rowDbClick(row) {
        this.$emit('changeMask', {type: 'add', value: this.tabNo})
        this.title = this.editStatus ? '修改' : '查看'
        this.type = this.editStatus ? '修改商机' : '查看商机'
        this.businessView = true
        this.sjId = row.sjId
      }
    }
  }
</script>

<style lang="scss" scoped>
  > > > .el-table1 {
    /*height: auto;*/

    .cell {
      max-height: 70px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
    }
  }

  > > > .header-table {
    margin-top: 10px;
    padding: 0 0 0 15px;

    .el-table__header-wrapper {
      border: 1px solid #EBEEF5;
      border-bottom: none;

      th {
        background-color: #FAFAFA;
        font-size: 16px;
        color: #555555;
        font-weight: normal;
      }
    }
  }

  .business-info {
    background-color: #fff;
    padding: 10px 15px;

    .el-button {
      float: right;
    }

    .base-header {
      display: flex;
      align-items: center;

      .left-line {
        display: inline-block;
        width: 10px;
        height: 26px;
        background-color: #409EFF;
        margin-right: 10px;
      }

      .right-text {
        font-weight: bold;
      }
    }
  }

  .form-border {
    /deep/ .el-row {
      margin: 0px;
    }

    /deep/ .postInfo-container-item {
      width: 100%;
    }

    /deep/ .el-form-item__label {
      background-color: #f9f9f9;
      width: 30%;
      text-align: right;
    }

    /deep/ .el-form-item {
      display: flex;
      height: 100%;
      border-right: 1px solid #d7d7d7;
      margin: 0px !important;
    }

    /deep/ .el-row {
      border-bottom: 1px solid #d7d7d7;
    }

    /deep/ .el-input,
    /deep/ .el-select {
      width: 70%;
    }

    /deep/ .el-form-item__content {
      flex: 1;
      text-align: left;
      padding-left: 10px;
      /*height: 30px;*/
      margin-left: 0 !important;
    }

    .fullRow {
      /deep/ .el-form-item__label {
        width: 15%;
      }

      /deep/ .el-input,
      /deep/ .el-select {
        width: 100%;
      }
    }

    /deep/ .el-input__inner {
      border: none;
    }

    /deep/ .el-select .el-input {
      width: 100%;
    }

    border-top: 1px solid #d7d7d7;
    border-left: 1px solid #d7d7d7;
    // border-bottom: 1px solid #d7d7d7;
  }

  /deep/ .el-col.el-col-12 {
    .el-cascader {
      width: 100%;

      .el-input {
        width: 100%;
      }
    }
  }

  > > > .el-dialog {
    margin-top: 5vh !important;
  }

  > > > .el-dialog__body {
    padding-top: 0;
    padding-bottom: 0;
    max-height: 550px;
    overflow: auto;
  }

  /deep/ .el-form-item__content {
    text-align: center;

    .el-form-item__error {
      position: relative;
      text-align: left;
      left: 0;
      top: 0;
    }
  }

  .edit-border {
    /deep/ .el-input__inner {
      border: 1px solid #fff;
      font-size: 14px;
      color: #000000;
      padding-left: 0;

      &:hover {
        border-radius: 0;
        border-bottom: 1px solid #f2f2f2;
      }
    }
  }
</style>
