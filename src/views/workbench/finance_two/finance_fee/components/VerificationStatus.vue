<template>
  <div>
    <div class="topBox">
      <span class="iconfont icon-warning-circle-fill" style="color: #E6A23C;font-size: 20px;"></span>
      <span>确认要修改这条 [费用] 吗？</span>
    </div>
    <div class="content">
      <el-form ref="postForm" size="small" class="form-container" label-width="120px">
        <el-row class="first-row">
          <el-col :span="12">
            <el-form-item label="核销状态:" class="postInfo-container-item">
              <el-select clearable v-model="verificationData.tobillStatus">
                <el-option v-for="item in statusList" :label="item.label" :key="item.id"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="核销人:" class="postInfo-container-item">
              <el-select :clearable="true"
                         default-first-option filterable v-model="verificationData.tobillUserId"
              >
                <el-option v-for="(item,key) in $store.getters.userList" :key="key"
                           :label="item.fullname" :value="item.userId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="">
          <el-col :span="12">
            <el-form-item label="核销计划延迟到:" class="postInfo-container-item">
              <el-date-picker
                value-format="yyyy-MM-dd"
                v-model="verificationData.tobillDelayDate"
                type="date"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="核销日期:" class="postInfo-container-item">
              <el-date-picker
                value-format="yyyy-MM-dd"
                v-model="verificationData.tobillDate"
                type="date"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="">
          <el-col :span="24">
            <el-form-item label="不核销或延迟理由:" class="postInfo-container-item">
              <el-input type="textarea" v-model="verificationData.delayReason" :row="4"></el-input>
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
  import { updateFeeBatch } from "@/api/feeList";
  export default {
    name: 'VerificationStatus',
    data() {
      return {
        feeDetailIds: '',
        feeIds: '',
        feeIdList: [],
        statusList: [
          {
            id: 0,
            label: '未核销'
          },
          {
            id: 1,
            label: '已核销'
          },
          {
            id: 2,
            label: '延迟核销  '
          },
          {
            id: 3,
            label: '不开账单'
          }
        ],
        verificationData: {
          tobillStatus: '',
          tobillUserId: '',
          tobillDate: '',
          tobillDelayDate: '',
          delayReason: ''
        }
      }
    },
    methods: {
      closeDialog(search) {
        this.$emit('closeDialog', search)
        this.verificationData.tobillStatus = ''
        this.verificationData.tobillUserId = ''
        this.verificationData.tobillDate = ''
        this.verificationData.tobillDelayDate = ''
        this.verificationData.delayReason = ''
      },
      submit() {
        updateFeeBatch({
          ...this.verificationData,
          idArray: this.feeIdList,
          tag: 3
        }).then(res => {
          this.closeDialog({feeIds: this.feeIds, feeDetailIds: this.feeDetailIds})
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
        flex-shrink: 0;
        /*line-height: 28px;*/
      }
    }
  }
</style>
