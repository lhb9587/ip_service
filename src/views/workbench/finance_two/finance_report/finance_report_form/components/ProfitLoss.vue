<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible.main"
      top="5vh"
      width="90%"
      height="90%"
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
          :row-class-name="tableRowClassName"
          @row-dblclick="handleRowClick"
          style="width: 100%;">
          <el-table-column
            prop="name"
            label="项目"
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
            label="本月数"
            width="180">
            <template v-slot:default="scope">
              <div v-if="scope.row.filed">
                <el-input type="number" v-if="scope.row.isOK" @keydown.native="tabCheckInput($event,scope.$index)" v-model="scope.row.value"></el-input>
                <span v-else>{{amountHandle(scope.row.value)}}</span>
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
import { queryFProfitLossList, createFProfitLoss, modifyFProfitLoss, profitLossCreateExcel, deleteFProfitLoss, queryProfitLossLocked, modifyProfitLossLocked } from '@/api/caseList'
import { toFixed2 } from '@/utils/filters'
export default {
  name: 'Financial',
  props: ['pageState', 'dialogVisible', 'reportData', 'companyList'],
  data() {
    return {
      diasabledInput: false,// 可读可写
      dialogTitle: '',
      tableData: [
        {
          name: '一、营业收入',
          unit: '元',
          value: 0,
          filed: 'income',
          isOK: false
        },
        {
          name: '减：营业成本',
          unit: '元',
          value: 0,
          filed: 'cost',
          padding: '20',
          isOK: false
        },
        {
          name: '营业税金及附加',
          unit: '元',
          value: 0,
          filed: 'taxAndOther',
          padding: '47',
          isOK: false
        },
        {
          name: '销售费用',
          unit: '元',
          value: 0,
          filed: 'saleCost',
          padding: '47',
          isOK: false
        },
        {
          name: '管理费用',
          unit: '元',
          value: 0,
          filed: 'manageCost',
          padding: '47',
          isOK: false
        },
        {
          name: '财务费用',
          unit: '元',
          value: 0,
          filed: 'financeCost',
          padding: '47',
          isOK: false
        },
        {
          name: '资产减值损失',
          unit: '元',
          value: 0,
          filed: 'assetLoss',
          padding: '47',
          isOK: false
        },
        {
          name: '加：公允价值变动收益（损失以“－”号填列）',
          unit: '元',
          value: 0,
          filed: 'fairValueChange',
          padding: '20',
          isOK: false
        },
        {
          name: '投资收益（损失以“－”号填列）',
          unit: '元',
          value: 0,
          filed: 'investIncome',
          padding: '47',
          isOK: false
        },
        {
          name: '其他收益',
          unit: '元',
          value: 0,
          filed: 'otherIncome',
          padding: '47',
          isOK: false
        },
        {
          name: '其中：对联营、合营企业的投资收益',
          unit: '元',
          value: 0,
          filed: 'otherInvestIncome',
          padding: '47',
          isOK: false
        },
        {
          name: '二、营业利润（亏损以“－”号填列）',
          unit: '元',
          value: 0,
          filed: 'profit',
          isOK: false
        },
        {
          name: '加：营业外收入',
          unit: '元',
          value: 0,
          filed: 'otherProfit',
          padding: '20',
          isOK: false
        },
        {
          name: '减：营业外支出',
          unit: '元',
          value: 0,
          filed: 'otherCost',
          padding: '20',
          isOK: false
        },
        {
          name: '其中：非流动资产处置损失',
          unit: '元',
          value: 0,
          filed: 'nonCurrentAssetLoss',
          padding: '47',
          isOK: false
        },
        {
          name: '三、利润总额（亏损总额以“－”号填列）',
          unit: '元',
          value: 0,
          filed: 'profitTotal',
          isOK: false
        },
        {
          name: '减：所得税费用',
          unit: '元',
          value: 0,
          filed: 'tax',
          padding: '20',
          isOK: false
        },
        {
          name: '四、净利润（净亏损以“－”号填列）',
          unit: '元',
          value: 0,
          filed: 'netProfit',
          isOK: false
        },
        {
          name: '五、每股收益',
          unit: '元',
          value: 0,
          filed: 'earnPerShare',
          isOK: false
        },
        {
          name: '（一）基本每股收益',
          unit: '元',
          value: 0,
          filed: 'basicEarnPerShare',
          padding: '20',
          isOK: false
        },
        {
          name: '（二）稀释每股收益',
          unit: '元',
          value: 0,
          filed: 'dilutedEarnPerShare',
          padding: '20',
          isOK: false
        }
      ],
      formData: {
        deptId: '',
        belongToDateShort: ''
      },
      belongToDateShort: '',
      isRepeat: false,
      locked: 0,
      profit_arr: [
        {
          way: '+',
          filed: 'income'
        },
        {
          way: '-',
          filed: 'cost'
        },
        {
          way: '-',
          filed: 'taxAndOther'
        },
        {
          way: '-',
          filed: 'saleCost'
        },
        {
          way: '-',
          filed: 'manageCost'
        },
        {
          way: '-',
          filed: 'financeCost'
        },
        {
          way: '+',
          filed: 'fairValueChange'
        },
        {
          way: '+',
          filed: 'investIncome'
        },
        {
          way: '+',
          filed: 'otherIncome'
        },
        {
          way: '+',
          filed: 'otherInvestIncome'
        }
      ],
      profitTotal_arr: [
        {
          way: '+',
          filed: 'profit'
        },
        {
          way: '+',
          filed: 'otherProfit'
        },
        {
          way: '-',
          filed: 'otherCost'
        }
      ],
      netProfit_arr: [
        {
          way: '+',
          filed: 'profitTotal'
        },
        {
          way: '-',
          filed: 'tax'
        }
      ]
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
    // 设置行的 class
    tableRowClassName({ row, rowIndex  }) {
      return row.isOK ? 'highlight-row' : '';
    },
    // 双击编辑行
    handleRowClick(row) {
      // 如果是只读模式或特定行，直接返回
      if (this.pageState !== 'view') {
        // 先关闭其他所有行的编辑状态
        this.tableData.forEach(item => {
          if (item !== row && item.isOK) {
            item.isOK = false;
          }
        });

        // 切换当前行的编辑状态
        if (row.isOK === undefined) {
          this.$set(row, 'isOK', true);
        } else {
          row.isOK = !row.isOK;
        }

        this.totalAmount()

        // 格式化数值
        if (row.value) {
          row.value = Number(row.value).toFixed(2);
        }
      }
    },
    // 鼠标移入移出
    // mouseEvent(row){
    //   if(this.pageState !== 'view') {
    //     row.isOK = !row.isOK
    //     if (!row.isOK) {
    //       this.totalAmount()
    //     }
    //     if (!row.value){
    //       row.value = 0
    //     }else{
    //       row.value = Number(row.value).toFixed(2)
    //     }
    //   }
    // },
    // tab键切换input输入框
    tabCheckInput(e,index){
      if(e.key == 'Tab'){
        this.tableData[index].isOK = false
        this.tableData[index+1].isOK = true
      }
    },
    amountHandle(num){
      if (num){
        return toFixed2(Number(num)) //保留小数点后两位，从第三位四舍五入
        // console.log(toFixed2(Number(num)).replace(/\.[0-9]{2}/g, '')) //不四舍五入
        // let amount = Math.round(num).toString()
        // if (!amount.includes('.')) amount += '.00'
        // let str = ""; // 字符串累加
        // str += amount
        //   .replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
        //     return $1 + ",";
        //   }).replace(/\.[0-9]{2}/, '');
        // // /\.[0-9]{2}/g
        // return str; // 字符串=>数组=>反转=>字符串
      }
    },
    // 计算金额
    totalAmount() {
      var profitRow = 0
      var profitAmount = 0
      var profitTotalRow = 0
      var profitTotalAmount = 0
      var netProfitRow = 0
      var netProfitAmount = 0
      for (let k in this.tableData){
        // 营业利润
        if (this.profit_arr.find(i => i.filed === this.tableData[k].filed) && this.tableData[k].value){
          if (this.profit_arr.find(i => i.filed === this.tableData[k].filed).way == '-'){
            profitAmount = Number(profitAmount) - Number(this.tableData[k].value)
          }else{
            profitAmount = Number(profitAmount) + Number(this.tableData[k].value)
          }
        }
        // 利润总额
        if (this.profitTotal_arr.find(i => i.filed === this.tableData[k].filed) && this.tableData[k].value){
          if (this.profitTotal_arr.find(i => i.filed === this.tableData[k].filed).way == '-'){
            profitTotalAmount = Number(profitTotalAmount) - Number(this.tableData[k].value)
          }else{
            profitTotalAmount = Number(profitTotalAmount) + Number(this.tableData[k].value)
          }
        }
        // 净利润
        if (this.netProfit_arr.find(i => i.filed === this.tableData[k].filed) && this.tableData[k].value){
          if (this.netProfit_arr.find(i => i.filed === this.tableData[k].filed).way == '-'){
            netProfitAmount = Number(netProfitAmount) - Number(this.tableData[k].value)
          }else{
            netProfitAmount = Number(netProfitAmount) + Number(this.tableData[k].value)
          }
        }

        if (this.tableData[k].filed == 'profit'){
          profitRow = k
        }
        if (this.tableData[k].filed == 'profitTotal'){
          profitTotalRow = k
        }
        if (this.tableData[k].filed == 'netProfit'){
          netProfitRow = k
        }
      }
      profitAmount && this.$set(this.tableData[profitRow], 'value', profitAmount)
      profitTotalAmount && this.$set(this.tableData[profitTotalRow], 'value', profitTotalAmount)
      netProfitAmount && this.$set(this.tableData[netProfitRow], 'value', netProfitAmount)
    },
    selectAction(){
      switch (this.pageState) {
        case 'view':
          this.dialogTitle = '损益表-查看'
          this.formData = this.reportData
          this.dataHandle()
          break;
        case 'create':
          this.dialogTitle = '损益表-创建'
          break;
        case 'edit':
          this.dialogTitle = '损益表-编辑'
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
          this.tableData[k].value = this.formData[this.tableData[k].filed]
        }
      }
    },
    // 数据保存处理
    dataSaveHandle() {
      for (let k in this.tableData) {
        if (this.tableData[k].filed) {
          this.formData[this.tableData[k].filed] = this.tableData[k].value
        }
      }
    },
    delete() {
      if (this.reportData.fpId){
        deleteFProfitLoss({ fpId: this.reportData.fpId }).then(res => {
          if (res.success){
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
      profitLossCreateExcel({ checkFlag: checkFlag, belongToDateShort: this.belongToDateShort }).then(res => {
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
      if (this.tableData.some(item => item.isOK)) {
        this.$message('请确保所有可编辑行“双击关闭”后再进行提交保存!');
        return false;
      }
      this.dataSaveHandle()
      if (this.pageState === 'create') {
        this.repeatCheck()
        if (this.isRepeat == false) {
          createFProfitLoss(this.formData).then(res => {
            if (res.success) {
              this.$message.success(res.message)
              this.handleClose(true)
            }
          });
        }
      } else {
        modifyFProfitLoss(this.formData).then(res => {
          if (res.success){
            this.$message.success(res.message)
            this.handleClose(true)
          }
        });
      }
    },
    queryLocked(row) {
      if (row) {
        queryProfitLossLocked({ belongToDateShort: row }).then(res => {
          if (res.data) {
            this.locked = res.data.locked
          } else {
            this.$message.warning(row +'月无报表进行操作!');
            return;
          }
        })
      }
    },
    modifyLocked(){
      if (!this.belongToDateShort) {
        this.$message.error('请选择报表月份!');
        return;
      }
      modifyProfitLossLocked({ belongToDateShort: this.belongToDateShort, locked: this.locked }).then(res => {
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
          queryFProfitLossList(data).then(response => {
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

/deep/.el-dialog__body{
  padding: 10px 20px 30px;
}
/deep/.el-table td{
  padding: 5px 0;
}

/deep/ .el-table {
  .highlight-row {
    background-color: #d3e6fb !important;
    
    // 确保高亮行的所有单元格都保持高亮
    td {
      background-color: #d3e6fb !important;
    }
    
    // 鼠标悬停效果
    &:hover > td {
      background-color: #d3e6fb !important;
    }
  }
  
  // 处理斑马纹
  .highlight-row.el-table__row--striped {
    background-color: #d3e6fb !important;
    td {
      background-color: #d3e6fb !important;
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
