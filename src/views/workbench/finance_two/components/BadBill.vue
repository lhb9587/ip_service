<template>
  <div>
    <div class="topBox">
      <span class="iconfont icon-warning-circle-fill" style="color: #E6A23C;font-size: 20px;"></span>
      <span>确认要修改这条 [账单] 吗？</span>
    </div>
    <div class="content">
      <el-form ref="postForm" size="small" class="form-container" :model="badBillData" label-width="120px">
        <el-row class="first-row">
          <el-col :span="24">
            <el-form-item label="核销状态:" class="postInfo-container-item">
              <el-select clearable v-model="badBillData.paymentStatus">
                <el-option v-for="item in statusList" :label="item.label" :key="item.id"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="">
          <el-col :span="24">
            <el-form-item label="坏账说明:" class="postInfo-container-item">
              <el-input type="textarea" :row="5" v-model="badBillData.badDebtDesc"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="">
          <el-col :span="12">
            <el-form-item label="坏账操作人:" class="postInfo-container-item">
              <el-select :clearable="true"
                         default-first-option filterable v-model="badBillData.badDebtUserId"
              >
                <el-option v-for="(item,key) in $store.getters.userList" :key="key"
                           :label="item.fullname" :value="item.userId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="坏账操作时间:" class="postInfo-container-item">
              <el-date-picker
                value-format="yyyy-MM-dd HH:mm:ss"
                v-model="badBillData.badDebtDate"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="fl-ac-jc" style="padding: 20px 0">
      <el-button size="small" @click="closeDialog(false)">取 消</el-button>
      <el-button size="small" type="primary" @click="submit">确 定</el-button>
    </div>
  </div>
</template>

<script>
  import { modifyBillBadDebtBatch } from '@/api/billApi'
  export default {
    name: 'BadBill',
    data() {
      return {
        selectedRows: [],
        badBillData: {
          paymentStatus: '',
          badDebtDesc: '',
          badDebtDate: '',
          badDebtUserId: ''
        },
        statusList: [
          {
            id: 1,
            label: '未收款'
          },
          {
            id: 2,
            label: '部分收款'
          },
          {
            id: 3,
            label: '收款完毕'
          },
          {
            id: 4,
            label: '坏账'
          },
          {
            id: 5,
            label: '部分坏账'
          }
        ]
      }
    },
    created() {

    },
    methods: {
      closeDialog(search) {
        this.badBillData.badDebtDate = ''
        this.badBillData.paymentStatus = ''
        this.badBillData.badDebtDesc = ''
        this.badBillData.badDebtUserId = ''
        this.$emit('closeBadView', search)
      },
      submit() {
        modifyBillBadDebtBatch({...this.badBillData, billIds: this.selectedRows.map(item => item.billId).join(',')}).then(res => {
          this.$message.success(res.message)
          this.closeDialog(this.selectedRows.map(item => item.billId).join(','))
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/styles/icons/font_2251928_asl9bha01s.css";

  .topBox {
    background-color: #F2F2F2;
    padding-left: 20px;
    display: flex;
    height: 40px;
    /*justify-content: center;*/
    align-items: center;

    .iconfont {
      margin-right: 10px;
    }
  }

  .content {
    border: 1px solid #D7D7D7;
    margin-top: 10px;
    padding: 5px;
  }

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
      text-align: right;
    }

    /deep/ .el-form-item {
      border-right: 1px solid #d7d7d7;
      margin: 0px !important;
    }

    .first-row {
      border-top: 1px solid #d7d7d7;
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
        flex: 1;
        padding: 5px 15px;
        margin-left: 0 !important;
      }

      /deep/ .el-form-item__label {
        /*line-height: 28px;*/
      }
    }
  }
</style>
