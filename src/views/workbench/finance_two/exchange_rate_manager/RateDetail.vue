<template>
  <div>
    <div class="box-border">
      <el-form ref="postForm" size="small" class="form-container" label-width="120px" :rules="rules" :model="rateForm">
        <el-row class="first-row">
          <el-col :span="12">
            <el-form-item label="货币名称:" class="postInfo-container-item" prop="curId">
              <span v-if="dialogType === 'view'">{{rateForm.curName}}</span>
              <el-select v-else default-first-option @change="bzchange" clearable
                         v-model="rateForm.curId" placeholder="请选择货币">
                <el-option v-for="(item,key) in currencyList" :key="key" :label="item.curName"
                           :value="item.curId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="货币符号:" class="postInfo-container-item">
              <span>{{rateForm.charSign}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="first-row">
          <el-col :span="12">
            <el-form-item label="汇率:" class="postInfo-container-item" prop="exchangeRate">
              <span v-if="dialogType === 'view'">{{rateForm.exchangeRate}}</span>
              <el-input v-else size="mini" class="" placeholder="请输入汇率"
                        v-model="rateForm.exchangeRate"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="英文缩写:" class="postInfo-container-item">
              <span>{{rateForm.signEn}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="first-row">
          <el-col :span="12">
            <el-form-item label="是否本币:" class="postInfo-container-item">
              <span v-if="rateForm.isLocal">是</span>
              <span v-else>否</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属月:" class="postInfo-container-item" prop="month">
              <span v-if="dialogType === 'view'">{{rateForm.month}}</span>
              <el-date-picker v-else size="mini" class="" v-model="rateForm.month"
                              format='yyyy-MM'
                              value-format="yyyy-MM" align="right" type="month" placeholder="请选择日期"
                              :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
<!--        <el-row class="first-row">-->
<!--          <el-col :span="24">-->
<!--            <el-form-item label="备注:" class="postInfo-container-item">-->
<!--              <span v-if="dialogType === 'view'">{{rateForm.memo}}</span>-->
<!--              <el-input v-else type="textarea" placeholder="请输入备注" v-model="rateForm.memo" :rows="3"></el-input>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--        </el-row>-->

      </el-form>
    </div>
    <div class="fl-ac-jc">
      <el-button size="small" style="width: 100px;margin-right: 0px" @click="() => closeDialog(false)">取 消</el-button>
      <el-button size="small" v-if="dialogType !== 'view'" type="primary" style="width: 100px;margin-right: 0px" @click="submit">确 定</el-button>
  </div>
  </div>
</template>

<script>
import {addCurrencyHistory, queryCurrencyHistoryById, queryCurrencyUrl, updateCurrencyHistory} from "@/api/billApi";

export default {
  name: "RateDetail",
  props: {
    curHisId: {},
    dialogType: {}
  },
  data() {
    return {
      rules: {
        curId: [
          {required: true, message: "请选择货币名称", trigger: "change"}
        ],
        exchangeRate: [
          {required: true, message: "请填写汇率", trigger: "change"}
        ],
        month: [
          {required: true, message: "请选择所属月", trigger: "change"}
        ],
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          },
          {
            text: '一周前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }
        ]
      },
      currencyList: [],
      rateForm: {
        isLocal: undefined,
        curId: undefined,
        charSign: undefined,
        exchangeRate: undefined,
        signEn: undefined,
        month: undefined,
        memo: undefined
      }
    }
  },
  created() {
    queryCurrencyUrl().then(res => {
      this.currencyList = res.data
    })
    if (this.dialogType === "create") {
      this.rateForm.month = this.$wUtil.getDate('', 'day')
    }
    if (this.dialogType === "edit" || this.dialogType === "view") {
      queryCurrencyHistoryById({
        curHisId: this.curHisId
      }).then(res => {
        this.rateForm = res.data
      })
    }
  },
  methods: {
    bzchange(value) {
      if (value || value === 0) {
        const {charSign, signEn, exchangeRate, isLocal, month} = this.currencyList.find(item => item.curId === value)
        this.rateForm.charSign = charSign
        this.rateForm.signEn = signEn
        this.rateForm.exchangeRate = exchangeRate
        this.rateForm.isLocal = isLocal
        this.rateForm.month = month
      } else {
        this.rateForm.charSign = undefined
        this.rateForm.signEn = undefined
        this.rateForm.exchangeRate = undefined
        this.rateForm.isLocal = undefined
        this.rateForm.month = undefined
      }
    },
    closeDialog(isSearch) {
      this.$emit("close", isSearch)
      this.rateForm = {
        isLocal: undefined,
        curId: undefined,
        charSign: undefined,
        exchangeRate: undefined,
        signEn: undefined,
        month: undefined,
        memo: undefined
      }
    },
    submit() {
      if (this.dialogType === "create") {
        if (!this.$commonUtils.formValidate(this.$refs['postForm'])) return
        addCurrencyHistory(this.rateForm).then(res => {
          this.$message.success(res.message)
          this.closeDialog(true)
        })
      }else if (this.dialogType === "edit") {
        if (!this.$commonUtils.formValidate(this.$refs['postForm'])) return
        updateCurrencyHistory(this.rateForm).then(res => {
          this.$message.success(res.message)
          this.closeDialog(true)
        })
      } else {

      }
    }
  }
}
</script>

<style scoped lang="scss">
.fl-ac-jc {
  margin-top: 15px;
}

.box-border {
  border: 1px solid #D7D7D7;
  padding: 10px 10px 5px 10px;
}

.form-container {
  .el-form-item__error {
    position: relative !important;
    top: 0;
  }

  /deep/ .el-row {
    margin: 0 0 5px 0;
    display: flex;
  }

  /deep/ .postInfo-container-item {
    height: 100%;
    width: 100%;
  }

  /deep/ .el-form-item__label {
    flex-shrink: 0;
    background-color: #F2F2F2;
    /*width: 36.7%;*/
    text-align: right;
  }

  /deep/ .el-form-item {
    border-right: 1px solid #F2F2F2;
    margin: 0px !important;
  }

  .first-row {
    border-top: 1px solid #F2F2F2;
  }

  /deep/ .el-row {
    border-bottom: 1px solid #F2F2F2;
    border-left: 1px solid #F2F2F2;
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

    > > > .el-date-editor {
      width: 100%;
    }
  }
}

.divider {
  position: relative;
  border-bottom: 1px solid #797979;
  margin-bottom: 20px;
  /*border-right: 1px solid #ccc;*/
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

.el-table.el-table1 {
  /deep/ tr:nth-of-type(1) {
    th {
      padding: 0;
      background: #F2F2F2;
    }
  }
}

.tables {
  div {
    border: 1px solid #ccc;
    border-top: none;
    border-right: none;
    text-align: center;
    z-index: 9;
  }

  div:nth-child(3) {
    border-right: 1px solid #ccc;
  }
}

.table-head {
  text-align: center;
  background-color: #f7f7f7;
  border-top: 1px solid #ccc !important;
}

.overflow-hidden {
  overflow: hidden;
  width: 100%;
  display: inline-block;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-all;
  cursor: pointer !important;
}

.upload-btn {
  margin: 10px 0 5px 0;
  width: 120px;
  height: 30px;
  border: 1px solid #AAAAAA;
  color: #AAAAAA;
  text-align: center;
  line-height: 30px;
  cursor: pointer;

  &:hover {
    border: 1px solid #66B1FF;
    color: #66B1FF;
  }
}

.require:before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}

.requireForm /deep/ .el-form-item__label:before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}

.timeDiv {
  position: absolute;
  left: 100px;
  top: 10px;
  width: 180px;
}

> > > .el-select, > > > .el-cascader {
  width: 100%;

  .el-cascader__label {
    padding-left: 0;
    font-size: 14px;
    color: #000000;
  }

  .el-input.is-focus .el-input__inner {
    border-radius: 0;
    border-color: #fff;
    border-bottom: 1px solid #f2f2f2;
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

.date-border {
  /deep/ .el-input__prefix {
    left: -5px;
  }

  /deep/ .el-input__inner {
    border: 1px solid #fff;
    font-size: 14px;
    color: #000000;
    padding-left: 20px;

    &:hover {
      border-radius: 0;
      border-bottom: 1px solid #f2f2f2;
    }
  }
}

</style>
