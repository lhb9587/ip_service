<template>
  <div style="padding: 15px">
    <div v-if="$store.getters.permissions.includes(360)">
      <el-button style="float: right" size="mini" type="primary"
                 @click="createAndEdit('create')">新建
      </el-button>
    </div>
    <el-table
      :data="WBtableData"
      style="width: 100%">
      <el-table-column
        type="index"
        label="序号"
        width="60">
      </el-table-column>
      <el-table-column
        prop="curName"
        label="货币名称"
      >
      </el-table-column>
      <el-table-column
        prop="charSign"
        label="货币符号"
      >
      </el-table-column>
      <el-table-column
        prop="signEn"
        label="货币英文简写"
      >
      </el-table-column>
      <el-table-column
        prop="exchangeRate"
        label="汇率"
      >
      </el-table-column>
      <el-table-column
        width="400"
        prop="memo"
        label="备注"
      >
      </el-table-column>
      <el-table-column
        prop="modifyUserIdStr"
        label="最近修改用户"
      >
      </el-table-column>
      <el-table-column
        prop="modifyDate"
        label="最近修改时间"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        v-if="$store.getters.permissions.includes(360)"
      >
        <template slot-scope="scope">
          <span style="display:inline-block;cursor: pointer;color: #409eff;margin-right: 10px"
                @click="createAndEdit('edit', scope.$index, scope.row)">修改</span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="title"
      :append-to-body="true"
      :visible.sync="dialogView"
      width="70%"
      :before-close="handleClose">
      <el-form :model="rowData" size="small" class="form-container">
        <el-row class="first-row">
          <el-col :span="12">
            <el-form-item label="货币名称" class="postInfo-container-item">
              <el-input size="mini" v-model="rowData.curName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="货币符号" class="postInfo-container-item">
              <el-input size="mini" v-model="rowData.charSign"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="货币英文简写" class="postInfo-container-item">
              <el-input size="mini" v-model="rowData.signEn"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="汇率" class="postInfo-container-item">
              <el-input size="mini" v-model="rowData.exchangeRate"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" class="postInfo-container-item">
              <el-input size="mini" v-model="rowData.memo"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="fl-ac-jc">
        <el-button size="mini" @click="handleClose">取 消</el-button>
        <el-button size="mini" type="primary" @click="confirmBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { queryOfferCurrency, modifyOfferCurrency, createOfferCurrency } from '@/api/billApi'

  export default {
    name: 'WaibiList',
    data() {
      return {
        rowData: {},
        currentRowIndex: -1,
        dialogView: false,
        title: '',
        total: 0,
        WBtableData: [],
        listQuery: {
          pageSize: 10,
          pageNo: 1
        },
        pageSizesList: [10, 50, 100, 200, 300, 400, 500]
      }
    },
    created() {
      this.queryOfferCurrency()
    },
    methods: {
      confirmBtn() {
        if (this.title === '修改') {
          modifyOfferCurrency(this.rowData).then(res => {
            this.$message.success('修改成功！')
            this.WBtableData.splice(this.currentRowIndex, 1, this.rowData)
            this.handleClose()
          })
        } else {
          createOfferCurrency(this.rowData).then(res => {
            this.$message.success('创建成功！')
            this.handleClose()
          })
        }
      },
      handleClose() {
        this.dialogView = false
        this.currentRowIndex = -1
        this.title = ''
        this.queryOfferCurrency()
      },
      queryOfferCurrency() {
        queryOfferCurrency().then(res => {
          this.WBtableData = res.data
          this.total = res.total
        })
      },
      createAndEdit(flag, index, row) {
        if (flag == 'create') {
          this.dialogView = true
          this.title = '新建'
          this.rowData = {
            curName: '',
            charSign: '',
            signEn: '',
            exchangeRate: '',
            memo: ''
          }
        } else {
          this.currentRowIndex = index
          this.dialogView = true
          this.title = '修改'
          this.rowData = JSON.parse(JSON.stringify(row))
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .form-container {
    .el-form-item__error {
      position: relative !important;
      top: 0;
    }

    /deep/ .el-row {
      margin: 0px;
      display: flex; /*解决账单查看表单样式被撑开*/
    }

    /deep/ .postInfo-container-item {
      height: 100%;
      width: 100%;
    }

    /deep/ .el-form-item__label {
      background-color: #f9f9f9;
      /*width: 36.7%;*/
      width: 180px;
      text-align: right;
      flex-shrink: 0;
    }

    /deep/ .el-form-item {
      border-right: 1px solid #d7d7d7;
      margin: 0px !important;
    }

    .first-row {
      /*>>>.el-row {*/
      border-top: 1px solid #d7d7d7;
      /*}*/
    }

    /deep/ .el-row {
      border-bottom: 1px solid #d7d7d7;
      border-left: 1px solid #d7d7d7;
    }

    /deep/ .el-input,
    /deep/ .el-select {
      /*width: 77%;*/
    }

    /deep/ td .el-input,
    /deep/ td .el-select {
      width: 100%;
    }

    /deep/ .el-form-item__content {
      text-align: left;
      word-break: break-word;
      // height: 30px;
    }

    .fullRow {
      /deep/ .el-form-item__label {
        /*width: 15%;*/
        width: 180px;
        flex-shrink: 0;
      }

      /deep/ .el-input,
      /deep/ .el-select {
        /*width: 30%;*/
      }
    }

    /deep/ .el-input__inner {
      // border: none;
    }

    /deep/ .el-select .el-input {
      width: 100%;
    }

    /deep/ td .el-select,
    /deep/ td .el-input,
    /deep/ td .el-input__inner {
      // border: 0px !important;
    }

    .postInfo-container-item {
      display: flex;
      width: 100%;

      /deep/ .el-form-item__content {
        text-align: left;
        display: inline-table;
        width: 85%;
        padding: 0px 15px;
      }

      /deep/ .el-form-item__label {
        line-height: 28px;
      }
    }
  }

  > > > .el-table {
    height: auto;

    .cell {
      max-height: 70px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
    }
  }
</style>
