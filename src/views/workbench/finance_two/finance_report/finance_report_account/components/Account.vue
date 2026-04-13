<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      top="25vh"
      width="30%"
      height="90%"
      :before-close="handleClose">
      <div>
        <el-form label-width="160px" >
          <el-row>
            <el-form-item label="账户所属">
              <el-select v-model="formData.deptId" filterable clearable v-bind:disabled="diasabledInput">
                <el-option
                  v-for="item in companyList"
                  :key="item.deptId"
                  :label="item.nameCn"
                  :value="item.deptId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="货币形式">
              <el-select v-model="formData.currency" filterable clearable v-bind:disabled="diasabledInput">
                <el-option
                  v-for="item in currencyList"
                  :key="item.label"
                  :label="item.label"
                  :value="item.label"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="具体描述">
              <el-input type="text" v-model="formData.account" placeholder="账户名称" v-bind:disabled="diasabledInput"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="排序">
              <el-input type="number" v-model="formData.sort" placeholder="数字" v-bind:disabled="diasabledInput"></el-input>
            </el-form-item>
          </el-row>
        </el-form>
        <div class="button_wrap" v-if="pageState!='view'">
          <el-button class="exactButton" type="primary" @click="submit">保存</el-button>
          <el-button class="exactButton" plain @click="handleClose">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createFFundAccount, modifyFFundAccount } from '@/api/caseList'
export default {
  name: 'Account',
  props: ['pageState', 'reportData', 'companyList'],
  data() {
    return {
      dialogVisible: true,
      diasabledInput: false,// 可读可写
      dialogTitle: '',
      currencyList: [
        {
          label: '现金'
        },
        {
          label: '银行存款'
        }
      ],
      formData: {
        deptId: '',
        currency: '',
        account: '',
        sort: ''
      }
    }
  },
  created() {
    this.selectAction()
  },
  methods: {
    selectAction(){
      switch (this.pageState) {
        case 'view':
          this.dialogTitle = '账户管理-查看'
          this.diasabledInput = true
          this.formData = this.reportData
          break;
        case 'create':
          this.dialogTitle = '账户管理-创建'
          break;
        case 'edit':
          this.dialogTitle = '账户管理-编辑'
          this.formData = this.reportData
          break;
        default:
          break;
      }
    },
    submit() {
      if (this.pageState === 'create') {
        createFFundAccount(this.formData).then(res => {
          console.log(res.success)
          if (res.success){
            this.$message.success(res.message)
            this.handleClose(true)
          }
        });
      } else {
        modifyFFundAccount(this.formData).then(res => {
          if (res.success){
            this.$message.success(res.message)
            this.handleClose(true)
          }
        });
      }
    },
    handleClose(state){
      this.$emit('closeDialog',false, state === true ? state : false);
    }
  },
}
</script>

<style lang="scss" scoped>
.el-form{
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  .el-select,.el-input,.el-date-picker,.el-textarea{
    width: 95%;
  }
  .el-textarea{
    margin: 10px 0;
  }
  /deep/ input{
    height: 28px;
  }
  /deep/ .el-input__icon{
    line-height: 28px;
  }
  .el-row{
    min-height: 30px;
    width: 100%;
    display: flex;
    align-items: center;
    .el-form-item{
      width: 100%;
      display: flex;
      border: 1px solid #EBEEF5;
      margin: 0px !important;
      /deep/ .el-form-item__label{
        background: #f5f7fa;
      }
      /deep/ .el-form-item__content {
        margin-left: 0 !important;
        padding-left: 10px;
        background: #fff;
        flex: 1;
      }
    }
  }
}
.button_wrap {
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  .el-button{
    margin-left: 30px;
  }
}

.title{
  width: 100%;
  font-size: 16px;
  color: #6AA7FF;
  height: 50px;
  line-height: 50px;
  font-weight: normal;
  position: relative;
  .title_right{
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }
}
.title-div{
  font-size: 14px;
  color: #fb9608a3;
  line-height: 30px;
}
.topBox {
  background-color: #F2F2F2;
  padding-left: 20px;
  display: flex;
  height: 40px;
  /*justify-content: center;*/
  align-items: center;
  margin-bottom: 10px;

  .iconfont {
    margin-right: 10px;
    color: #E6A23C;
    font-size: 20px;
  }

}
.down-dialog /deep/.el-dialog__body{
  padding-top: 0px;
}
.input-lable {
  float: left;
  width: 30%;
  height: 40px;
  font-size: 16px;
  text-align: center;
  line-height: 40px;
  background-color: #F2F2F2;
}

.switch-lable {
  float: right;
  width: 40%;
  height: 40px;
  font-size: 12px;
  text-align: center;
  line-height: 40px;
}
</style>
