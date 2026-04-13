<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible.main"
      top="5vh"
      width="80%"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <div>
        <template>
          <label>编制单位</label>
          <span v-if="pageState != 'create'">{{formData.deptIdStr}}</span>
          <el-select v-else @change="repeatCheck" v-model="formData.deptId" filterable clearable>
            <el-option
              v-for="item in companyList"
              :key="item.deptId"
              :label="item.nameCn"
              :value="item.deptId"
            >
            </el-option>
          </el-select>
          <label>报表月份</label>
          <span v-if="pageState != 'create'">{{formData.belongToDateShort}}</span>
          <el-date-picker
            v-else
            @change="repeatCheck"
            v-model="formData.belongToDateShort"
            type="month"
            value-format="yyyy-MM"
            placeholder="报表月份"
          >
          </el-date-picker>
        </template>
        <el-table
          :data="tableData"
          border
          stripe
          :cell-style="cellStyle"
          @cell-mouse-enter="mouseEvent"
          @cell-mouse-leave="mouseEvent"
          style="width: 100%;">
          <el-table-column
            prop="name"
            label="指标名称"
            width="600"
          >
          </el-table-column>
          <el-table-column
            prop="unit"
            label="计量单位"
            width="180">
          </el-table-column>
          <el-table-column
            prop="value"
            label="本期（1-本期）"
            width="180">
            <template v-slot:default="scope">
              <div v-if="scope.row.filed">
                <el-input type="number" v-if="scope.row.isOK && scope.row.unit=='人'" v-model="scope.row.value" @keydown.native="tabCheckInput($event,scope.$index)" onkeyup="this.value=this.value.replace(/\D|^0/g,'')"></el-input>
                <el-input type="number" v-else-if="scope.row.isOK" v-model="scope.row.value" @keydown.native="tabCheckInput($event,scope.$index)"></el-input>
                <span v-else-if="scope.row.unit=='千元'">{{amountHandle(scope.row.value)}}</span>
                <span v-else>{{scope.row.value}}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="button_wrap">
          <el-button class="exactButton" type="primary" v-if="pageState!='view'" @click="submit">保存</el-button>
          <el-button class="exactButton" plain @click="handleClose">取消</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible.export"
      class="down-dialog"
      width="20%"
      :before-close="handleClose">
      <div class="topBox">
        <span class="iconfont icon-warning-circle-fill"></span>
        <span>请选择导出报表月份</span>
      </div>
      <div>
        <div class="input-lable">所属月</div>
        <el-date-picker
          v-model="belongToDateShort"
          type="month"
          value-format="yyyy-MM"
          placeholder="选择导出报表月份"
          style="width: 70%">
        </el-date-picker>
      </div>
      <span class="button_wrap">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="download(10)">导 出</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible.lock"
      class="down-dialog"
      width="20%"
      :before-close="handleClose">
      <div class="topBox">
        <span class="iconfont icon-warning-circle-fill"></span>
        <span>请选择查询报表月份</span>
      </div>
      <div>
        <el-date-picker
          v-model="belongToDateShort"
          type="month"
          value-format="yyyy-MM"
          placeholder="选择报表月份"
          @change="queryLocked"
          style="width: 60%">
        </el-date-picker>
        <div class="switch-lable">
          解锁
          <el-switch
            style="margin: 5px"
            :active-value="1"
            :inactive-value="0"
            v-model="locked"
          >
          </el-switch>
          锁定
        </div>
      </div>
      <span class="button_wrap">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="modifyLocked">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { queryFinancialList, createFinancial, modifyFinancial, financialCreateExcel, deleteFinancial, queryFinancialLocked, modifyFinancialLocked } from '@/api/caseList'
import {formatAmount,fomatFloat,toFixed1,toFixed2} from '@/utils/filters'
export default {
  name: 'Financial',
  props: ['pageState', 'dialogVisible', 'reportData', 'companyList'],
  data() {
    return {
      dialogTitle: '',
      tableData: [
        {
          name: '一、期末资产负债',
          unit: '一'
        },
        {
          name: '固定资产原价',
          unit: '千元',
          value: 0,
          filed: 'fixedAssets',
          padding: '20',
          isOK: false
        },
        {
          name: '应收账款',
          unit: '',
          value: 0,
          filed: 'accountsReceivable',
          padding: '20',
          isOK: false
        },
        {
          name: '资产总计',
          unit: '千元',
          value: 0,
          filed: 'assetsTotal',
          padding: '20',
          isOK: false
        },
        {
          name: '负债合计',
          unit: '千元',
          value: 0,
          filed: 'debtTotal',
          padding: '20',
          isOK: false
        },
        {
          name: '所有者权益合计',
          unit: '千元',
          value: 0,
          filed: 'ownersEquity',
          padding: '20',
          isOK: false
        },
        {
          name: '二、损益及分配',
          unit: '一'
        },
        {
          name: '营业收入',
          unit: '千元',
          value: 0,
          filed: 'businessIncome',
          padding: '20',
          isOK: false
        },
        {
          name: '净服务收入',
          unit: '千元',
          value: 0,
          filed: 'serviceIncome',
          padding: '20',
          isOK: false
        },
        {
          name: '营业成本',
          unit: '千元',
          value: 0,
          filed: 'businessCost',
          padding: '20',
          isOK: false
        },
        {
          name: '税金及附加',
          unit: '千元',
          value: 0,
          filed: 'taxAndSurcharges',
          padding: '20',
          isOK: false
        },
        {
          name: '销售费用',
          unit: '千元',
          value: 0,
          filed: 'sale',
          padding: '20',
          isOK: false
        },
        {
          name: '管理费用',
          unit: '千元',
          value: 0,
          filed: 'manage',
          padding: '20',
          isOK: false
        },
        {
          name: '研发费用',
          unit: '千元',
          value: 0,
          filed: 'develop',
          padding: '20',
          isOK: false
        },
        {
          name: '财务费用',
          unit: '千元',
          value: 0,
          filed: 'finance',
          padding: '20',
          isOK: false
        },
        {
          name: '资产减值损失',
          unit: '千元',
          value: 0,
          filed: 'assetLoss',
          padding: '20',
          isOK: false
        },
        {
          name: '信用减值损失',
          unit: '千元',
          value: 0,
          filed: 'creditLoss',
          padding: '20',
          isOK: false
        },
        {
          name: '公允价值变动收益（损失以“-”号记）',
          unit: '千元',
          value: 0,
          filed: 'fairIncome',
          padding: '20',
          isOK: false
        },
        {
          name: '资产处置收益（损失以“-”号记）',
          unit: '千元',
          value: 0,
          filed: 'assetIncome',
          padding: '20',
          isOK: false
        },
        {
          name: '投资收益（损失以“-”号记）',
          unit: '千元',
          value: 0,
          filed: 'investIncome',
          padding: '20',
          isOK: false
        },
        {
          name: '净敞口套期收益（损失以“-”号记）',
          unit: '千元',
          value: 0,
          filed: 'hedgeIncome',
          padding: '20',
          isOK: false
        },
        {
          name: '其他收益',
          unit: '千元',
          value: 0,
          filed: 'otherIncome',
          padding: '20',
          isOK: false
        }, {
          name: '营业利润',
          unit: '千元',
          value: 0,
          filed: 'businessProfit',
          padding: '20',
          isOK: false
        },
        {
          name: '营业外收入',
          unit: '千元',
          value: 0,
          filed: 'noBusinessProfit',
          padding: '20',
          isOK: false
        }, {
          name: '营业外支出',
          unit: '千元',
          value: 0,
          filed: 'noBusinessExpenses',
          padding: '20',
          isOK: false
        },
        {
          name: '利润总额',
          unit: '千元',
          value: 0,
          filed: 'profitTotal',
          padding: '20',
          isOK: false
        },
        {
          name: '所得税费用',
          unit: '千元',
          value: 0,
          filed: 'incomeTax',
          padding: '20',
          isOK: false
        },
        {
          name: '三、成本费用及增值税',
          unit: '一'
        },
        {
          name: '应付职工薪酬（本年贷方累计发生额）',
          unit: '千元',
          value: 0,
          filed: 'empSalary',
          padding: '20',
          isOK: false
        },
        {
          name: '工资',
          unit: '千元',
          value: 0,
          filed: 'finSalary.salary',
          padding: '40',
          isOK: false
        },
        {
          name: '社保（企业部分）',
          unit: '千元',
          value: 0,
          filed: 'finSalary.insurance',
          padding: '40',
          isOK: false
        },
        {
          name: '公积金（企业部分）',
          unit: '千元',
          value: 0,
          filed: 'finSalary.funds',
          padding: '40',
          isOK: false
        },
        {
          name: '补充医疗',
          unit: '千元',
          value: 0,
          filed: 'finSalary.medicalSupp',
          padding: '40',
          isOK: false
        },
        {
          name: '福利费',
          unit: '千元',
          value: 0,
          filed: 'finSalary.benefits',
          padding: '40',
          isOK: false
        },
        {
          name: '职工教育经费',
          unit: '千元',
          value: 0,
          filed: 'finSalary.eduFunds',
          padding: '40',
          isOK: false
        },
        {
          name: '离职赔偿',
          unit: '千元',
          value: 0,
          filed: 'finSalary.compensation',
          padding: '40',
          isOK: false
        },
        {
          name: '工会经费',
          unit: '千元',
          value: 0,
          filed: 'finSalary.unionFunds',
          padding: '40',
          isOK: false
        },
        {
          name: '应交增值税',
          unit: '千元',
          value: 0,
          filed: 'addedTax',
          padding: '20',
          isOK: false
        },
        {
          name: '销项',
          unit: '千元',
          value: 0,
          filed: 'finTax.output',
          padding: '40',
          isOK: false
        },
        {
          name: '减去：进项',
          unit: '千元',
          value: 0,
          filed: 'finTax.input',
          padding: '40',
          isOK: false
        },
        {
          name: '减去：加计扣除',
          unit: '千元',
          value: 0,
          filed: 'finTax.addDeduction',
          padding: '40',
          isOK: false
        },
        {
          name: '加上：进项转出',
          unit: '千元',
          value: 0,
          filed: 'finTax.inputTransfer',
          padding: '40',
          isOK: false
        },
        {
          name: '减去：减免税',
          unit: '千元',
          value: 0,
          filed: 'finTax.exemptionTax',
          padding: '40',
          isOK: false
        },
        {
          name: '四、期末用工人数',
          unit: '人',
          value: 0,
          filed: 'empNum',
          isOK: false
        },
        {
          name: '五、平均用工人数',
          unit: '人',
          value: 0,
          filed: 'empAvgNum',
          isOK: false
        }
      ],
      formData: {
        deptId: '',
        belongToDateShort: '',
        finSalary: {
          salary: '',
          insurance: '',
          funds: '',
          medicalSupp: '',
          benefits: '',
          eduFunds: '',
          compensation: '',
          unionFunds: ''
        },
        finTax: {
          output: '',
          input: '',
          addDeduction: '',
          inputTransfer: '',
          exemptionTax: ''
        }
      },
      belongToDateShort: '',
      isRepeat: false,
      locked: 0
    }
  },
  created() {
    this.selectAction()
  },
  methods: {
    // 单元格的 style 的回调方法
    cellStyle({ row, column, rowIndex, columnIndex }) {
      // 方案一：通过参数设置
      if (columnIndex === 0 && row.padding) {
        return 'padding-left:'+row.padding+'px;';
      } else {
        return ''
      }
    },
    // 鼠标移入移出
    mouseEvent(row){
      if(this.pageState !== 'view' && row.isOK != undefined) {
        row.isOK = !row.isOK
        console.log(row.isOK)
        if (!row.isOK) {
          this.totalAmount()
        }
        if (!row.value){
          row.value = 0
        }else{
          row.value = Math.round(row.value)
        }
      }
    },
    // tab键切换input输入框
    tabCheckInput(e,index){
      if(e.key == 'Tab'){
        this.tableData[index].isOK = false
        if(this.tableData[index+1].isOK !== undefined){
          this.tableData[index+1].isOK = true
        }else{
          this.tableData[index+2].isOK = true
        }
      }
    },
    amountHandle(num){
      if (num){
        // console.log(toFixed2(Number(num)).replace(/\.[0-9]{2}/g, '')) //不四舍五入
        let amount = Math.round(num).toString()
        if (!amount.includes('.')) amount += '.00'
        let str = ""; // 字符串累加
        str += amount
          .replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
            return $1 + ",";
          }).replace(/\.[0-9]{2}/, '');
        // /\.[0-9]{2}/g
        return str; // 字符串=>数组=>反转=>字符串
      }
    },
    // 计算金额
    totalAmount() {
      var payrollPayableRow = 0
      var payrollPayableTotal = 0
      var vatRow = 0
      var vatTotal = 0
      var vatData = []
      for (let k in this.tableData){
        // var payrollPayable =  ['finSalary.salary']
        // if (payrollPayable.find(i => i === this.tableData[k].filed)){
        //   console.log(this.tableData[k])
        // }
        if (String(this.tableData[k].filed).indexOf('finSalary.') !== -1){
          payrollPayableTotal = Number(payrollPayableTotal) + Number(this.tableData[k].value)
        }
        if (this.tableData[k].filed == 'empSalary'){
          payrollPayableRow = k
        }
        if (String(this.tableData[k].filed).indexOf('finTax.') !== -1){
          vatData[this.tableData[k].filed] = Number(this.tableData[k].value)
        }
        if (this.tableData[k].filed == 'addedTax'){
          vatRow = k
        }
      }

      this.$set(this.tableData[payrollPayableRow], 'value', payrollPayableTotal)
      vatTotal = vatData['finTax.output'] - vatData['finTax.input'] - vatData['finTax.addDeduction'] + vatData['finTax.inputTransfer'] - vatData['finTax.exemptionTax']
      this.$set(this.tableData[vatRow], 'value', vatTotal)
    },
    selectAction(){
      switch (this.pageState) {
        case 'view':
          this.dialogTitle = '财务状况-查看'
          this.formData = this.reportData
          this.dataHandle()
          break;
        case 'create':
          this.dialogTitle = '财务状况-创建'
          break;
        case 'edit':
          this.dialogTitle = '财务状况-编辑'
          this.formData = JSON.parse(JSON.stringify(this.reportData))
          this.dataHandle()
          break;
        case 'delete':
          this.delete()
          break;
        case 'export':
          this.dialogTitle = '汇总报表导出'
          break;
        case 'lock':
          this.dialogTitle = '报表锁定解锁'
          break;
        default:
          this.handleClose()
          break;
      }
    },
    // 数据处理
    dataHandle() {
      for (let k in this.tableData) {
        if (this.tableData[k].filed) {
          if (this.tableData[k].filed.indexOf(".") !== -1) {
            var filed = this.tableData[k].filed.split(".")
            this.tableData[k].value = this.formData[filed[0]][filed[1]]
          }else {
            this.tableData[k].value = this.formData[this.tableData[k].filed]
          }
        }
      }
    },
    // 数据保存处理
    dataSaveHandle() {
      for (let k in this.tableData) {
        if (this.tableData[k].filed) {
          if (this.tableData[k].filed.indexOf(".") !== -1) {
            var filed = this.tableData[k].filed.split(".")
            this.formData[filed[0]][filed[1]] = this.tableData[k].value
          }else {
            this.formData[this.tableData[k].filed] = this.tableData[k].value
          }
        }
      }
    },
    delete() {
      if (this.reportData.finId){
        deleteFinancial({ finId: this.reportData.finId }).then(res => {
          if (res.success) {
            this.$message.success(res.message)
            this.handleClose(true)
          }
        });
      }
    },
    download(checkFlag){
      if (!this.belongToDateShort){
        this.$message.error('请选择导出报表月份!');
        return;
      }
      financialCreateExcel({ checkFlag: checkFlag, belongToDateShort: this.belongToDateShort }).then(res => {
        if (res.messageType == -6) {
          this.$confirm(`${res.message}`, {
            cancelButtonText: '否',
            confirmButtonText: '是'
          })
            .then(() => {
              this.download(30)
            })
            .catch(() => {
              this.download(20)
            });
          return
        }
        this.$commonUtils.downLoadAll({url:'ipdoc'+res.data.address})
        this.handleClose()
      });
    },
    submit() {
      if (!this.formData.deptId || !this.formData.belongToDateShort) {
        this.$message('请选择报表编制单位及所属月')
        return false
      }
      this.dataSaveHandle()
      if (this.pageState === 'create') {
        this.repeatCheck()
        if (this.isRepeat == false){
          createFinancial(this.formData).then(res => {
            if (res.success){
              this.$message.success(res.message)
              this.handleClose(true)
            }
          });
        }
      } else {
        modifyFinancial(this.formData).then(res => {
          if (res.success){
            this.$message.success(res.message)
            this.handleClose(true)
          }
        });
      }
    },
    queryLocked(row) {
      if (row) {
        queryFinancialLocked({ belongToDateShort: row }).then(res => {
          if (res.data) {
            this.locked = res.data.locked
          } else {
            this.$message.warning(row +'月无报表进行操作!');
            return;
          }
        })
      }
    },
    modifyLocked() {
      if (!this.belongToDateShort) {
        this.$message.error('请选择报表月份!');
        return;
      }
      modifyFinancialLocked({ belongToDateShort: this.belongToDateShort, locked: this.locked }).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.handleClose(true)
        }
      });

    },
    // 检查新建报表是否重复
    repeatCheck() {
      if (this.pageState === 'create') {
        const data = {
          deptId: this.formData.deptId,
          belongToDateShort: this.formData.belongToDateShort
        }
        if (data.deptId && data.belongToDateShort) {
          queryFinancialList(data).then(response => {
            if (response.data.length > 0) {
              this.$message.warning(data.belongToDateShort + '月报表已存在，请修改!');
              this.isRepeat = true
            } else {
              this.isRepeat = false
            }
          });
        } else {
          this.isRepeat = true
        }
      }
    },
    handleClose(state){
      this.$emit('closeDialog',false, state === true ? state : false);
    }
  },
}
</script>

<style lang="scss" scoped>
/deep/.el-dialog__body{
  padding: 10px 20px 30px;
}
/deep/.el-table td{
  padding: 5px 0;
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
