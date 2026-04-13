<template>
  <div>
    <el-form class="form-container" size="small" label-width="120px" :model="memoData">
      <el-row class="first-row">
        <el-col :span="24">
          <el-form-item label="客户:" label-width="150px" class="postInfo-container-item">{{custName}}</el-form-item>
        </el-col>
      </el-row>
      <div style="border: 1px solid #D7D7D7;margin-top: 10px;padding: 0 5px 5px 5px">
        <div class="divider">
              <span>
                催款相关备注
              </span>
        </div>
        <div class="no-radius" style="margin-bottom: 5px">
          <el-input v-if="memoType == '查看'" type="textarea" :rows="4" v-model="memoData.description" readonly></el-input>
          <el-input v-else type="textarea" :rows="4" v-model="memoData.description"></el-input>
        </div>
        <el-row class="first-row">
          <el-col :span="24">
            <el-form-item label="备注:" label-width="150px" class="postInfo-container-item">
              <el-input v-if="memoType == '查看'" type="textarea" :row="5" v-model="memoData.memo" readonly></el-input>
              <el-input v-else type="textarea" :row="5" v-model="memoData.memo"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="提交人:" label-width="150px" class="postInfo-container-item">
              <span>{{referUserIdStr}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="提交日期:" label-width="150px" class="postInfo-container-item">
              {{memoData.referDate}}
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <div class="fl-ac-jc" style="padding: 20px 0">
      <el-button size="small" @click="closeDialog(false)">取 消</el-button>
      <el-button size="small" type="primary" @click="submit('新建')" v-if="memoType == '新建'">确 定</el-button>
      <el-button size="small" type="primary" @click="submit('保存')" v-if="memoType == '修改'">保 存</el-button>
    </div>
  </div>
</template>

<script>
  import { createDMemo, modifyDMemo } from '@/api/billApi'
  export default {
    name: "MemoDetail",
    props: {
      memoType: '',
      custId: '',
      custName: '',
      editData: {}
    },
    data() {
      return {
        referUserIdStr: '',
        // custName: '',
        memoData: {
          custId: '',
          description: '',
          memo: '',
          referUserId: '',
          referDate: ''
        }
      }
    },
    created() {
      if(this.memoType == '新建'){
        this.memoData.custId = this.custId
        this.memoData.referUserId = this.$store.getters.userId
        this.referUserIdStr = this.$store.getters.name
        this.memoData.referDate = this.$wUtil.getDate('', 'day')
      }else{
        for (let k in this.memoData){
          this.memoData[k] = this.editData[k]
        }
        this.memoData.custDmId = this.editData.custDmId
        this.referUserIdStr = this.editData.referUserIdStr
      }
    },
    methods: {
      closeDialog(search) {
        this.$emit('closeDialog', search)
      },
      submit(type) {
        if(type == '新建'){
          createDMemo(this.memoData).then(res => {
            this.$message.success('新建成功！')
            this.closeDialog(true)
          })
        }else{
          modifyDMemo(this.memoData).then(res => {
            this.$message.success('修改成功！')
            this.closeDialog(true)
          })
        }
      },
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

  .divider {
    position: relative;
    border-bottom: 1px solid #797979;
    margin-bottom: 20px;
    margin-top: 20px;

    .el-badge {
      padding-right: 10px;
    }

    span {
      /*color: #333;*/
      /*font-weight: bold;*/
      font-size: 14px;
      background: #fff;
      position: absolute;
      bottom: -9px;
      left: 50px;
      padding: 0 10px;
    }
  }

  > > > .no-radius {
    .el-textarea__inner {
      border-radius: 0;
    }

    input {
      border-radius: 0;
    }
  }
</style>
