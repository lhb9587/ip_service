<template>
  <div>
    <el-form class="form-container" size="small" :model="statementData">
      <div class="box-border">
        <el-row class="first-row">
          <el-col :span="12">
            <el-form-item label="客户:" label-width="150px" class="postInfo-container-item">
              {{custName}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="下次催账时间:" label-width="150px" class="postInfo-container-item">
              <el-date-picker
                value-format="yyyy-MM-dd"
                v-model="statementData.nextDunningDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="录入人:" label-width="150px" class="postInfo-container-item">
              {{$store.getters.name}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="录入时间:" label-width="150px" class="postInfo-container-item">
              {{statementData.createDate}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="催款周期:" label-width="150px" class="postInfo-container-item">
              <el-input v-model="statementData.cycle"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注:" label-width="150px" class="postInfo-container-item">
              <el-input type="textarea" :row="5" v-model="statementData.remarks"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <div class="fl-ac-jc" style="padding: 20px 0">
      <el-button size="small" @click="closeDialog(false)">取 消</el-button>
      <el-button size="small" type="primary" @click="submit" v-if="statementType == '新建'">确 定</el-button>
    </div>
  </div>
</template>

<script>
  import { createDunningSetting } from '@/api/billApi'
  export default {
    name: "StateMent",
    props: {
      statementType: ''
    },
    data() {
      return {
        custName: '',
        queryCustomerNameIdList: [],
        statementData: {
          createUserId: '',
          custId: '',
          nextDunningDate: '',
          cycle: '',
          remarks: '',
          createDate: ''
        }
      }
    },
    created() {
      this.statementData.createUserId = this.$store.getters.userId
      this.statementData.createDate = this.$wUtil.getDate('', 'day')
    },
    methods: {
      closeDialog(search) {
        this.$emit('closeDialog', search)
      },
      submit() {
        createDunningSetting(this.statementData).then(res => {
          this.$message.success('设定成功!')
          this.closeDialog( true)
        })

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
      display: flex;
    }

    /deep/ .postInfo-container-item {
      height: 100%;
      width: 100%;
    }

    /deep/ .el-form-item__label {
      flex-shrink: 0;
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
    /deep/ td .el-input,
    /deep/ td .el-select {
      width: 100%;
    }

    /deep/ .el-form-item__content {
      text-align: left;
      word-break: break-word;
      // height: 30px;
    }
    /deep/ .el-select .el-input {
      width: 100%;
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
      >>>.el-date-editor{
        width: 100%;
      }
    }
  }

  .divider {
    position: relative;
    border-bottom: 1px solid #797979;
    margin-bottom: 20px;
    border-right: 1px solid #ccc;
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

  .box-border {
    border: 1px solid #D7D7D7;
    padding: 5px 5px 5px 5px;
  }

  /deep/ .el-table__header tr,
  /deep/ .el-table__header th {
    padding: 0;
    height: 30px;
    background: #f5f5f5;
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
