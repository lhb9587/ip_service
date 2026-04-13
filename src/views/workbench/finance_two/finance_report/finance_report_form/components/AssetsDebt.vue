<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible.main"
      top="5vh"
      width="90%"
      style="height: 96%"
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
            v-model="formData.belongToDateShort"
            type="month"
            value-format="yyyy-MM"
            placeholder="报表月份"
            @change="queryLastYearData">
          </el-date-picker>
        </template>
        <div>
          <el-table
            :data="tableData"
            border
            stripe
            :cell-style="cellStyle"
            :row-class-name="tableRowClassName"
            @row-dblclick="handleRowClick"
            style="width: 50%;float: left">
            <el-table-column
              prop="name"
              label="资产"
              width="400"
            >
            </el-table-column>
            <el-table-column
              label="单位"
              width="80">元
            </el-table-column>
            <el-table-column
              prop="lastYear"
              label="年初数"
              width="180">
              <template v-slot:default="scope">
                {{amountHandle(scope.row.lastYear)}}
              </template>
            </el-table-column>
            <el-table-column
              prop="value"
              label="年末数"
              width="180">
              <template v-slot:default="scope">
                <div v-if="scope.row.filed">
                  <el-input type="number" v-if="scope.row.isOK" @keydown.native="tabCheckInput($event,scope.$index)" v-model="scope.row.value"></el-input>
                  <span v-else>{{amountHandle(scope.row.value)}}</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-table
            :data="tableData1"
            border
            stripe
            :cell-style="cellStyle"
            :row-class-name="tableRowClassName"
            @row-dblclick="handleRowClick"
            style="width: 50%;float: left">
            <el-table-column
              prop="name"
              label="资产"
              width="400"
            >
            </el-table-column>
            <el-table-column
              label="单位"
              width="80">元
            </el-table-column>
            <el-table-column
              prop="lastYear"
              label="年初数"
              width="180">
              <template v-slot:default="scope">
                {{amountHandle(scope.row.lastYear)}}
              </template>
            </el-table-column>
            <el-table-column
              prop="value"
              label="年末数"
              width="180">
              <template v-slot:default="scope">
                <div v-if="scope.row.filed">
                  <el-input type="number" v-if="scope.row.isOK" @keydown.native="tab1CheckInput($event,scope.$index)" v-model="scope.row.value"></el-input>
                  <span v-else>{{amountHandle(scope.row.value)}}</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="button_wrap">
          <el-button class="exactButton" type="primary"  v-if="pageState!='view'" @click="submit">保存</el-button>
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
import { queryFAssetsDebtList, createFAssetsDebt, modifyFAssetsDebt, assetsDebtCreateExcel, deleteFAssetsDebt, queryAssetsDebtLocked, modifyAssetsDebtLocked } from '@/api/caseList'
import { toFixed2 } from '@/utils/filters'
export default {
  name: 'AssetsDebt',
  props: ['pageState', 'dialogVisible', 'reportData', 'companyList'],
  data() {
    return {
      dialogTitle: '',
      lastYearData: [], // 年初数
      tableData: [
        {
          name: '流动资产：'
        },
        {
          name: '货币资金',
          value: '',
          lastYear: '',
          filed: 'monetaryCapital',
          padding: '20',
          isOK: false
        },
        {
          name: '交易性金融资产',
          value: '',
          lastYear: '',
          filed: 'tradingFinAssets',
          padding: '20',
          isOK: false
        },
        {
          name: '应收票据',
          value: '',
          lastYear: '',
          filed: 'assetReceipt',
          padding: '20',
          isOK: false
        },
        {
          name: '应收账款',
          value: '',
          lastYear: '',
          filed: 'assetBill',
          padding: '20',
          isOK: false
        },
        {
          name: '预付款项',
          value: '',
          lastYear: '',
          filed: 'assetPrepayment',
          padding: '20',
          isOK: false
        },
        {
          name: '应收利息',
          value: '',
          lastYear: '',
          filed: 'assetInterest',
          padding: '20',
          isOK: false
        },
        {
          name: '应收股利',
          value: '',
          lastYear: '',
          filed: 'assetDividend',
          padding: '20',
          isOK: false
        },
        {
          name: '其他应收款',
          value: '',
          lastYear: '',
          filed: 'assetOtherReceivable',
          padding: '20',
          isOK: false
        },
        {
          name: '存货',
          value: '',
          lastYear: '',
          filed: 'stock',
          padding: '20',
          isOK: false
        },
        {
          name: '一年内到期的非流动资产',
          value: '',
          lastYear: '',
          filed: 'oneYearDueNonCurrentAssets',
          padding: '20',
          isOK: false
        },
        {
          name: '其他流动资产',
          value: '',
          lastYear: '',
          filed: 'otherCurrentAssets',
          padding: '20',
          isOK: false
        },
        {
          name: '流动资产合计',
          value: '',
          lastYear: '',
          filed: 'currentAssetsTotal',
          padding: '60',
          isOK: false
        },
        {
          name: '非流动资产：'
        },
        {
          name: '可供出售金融资产',
          value: '',
          lastYear: '',
          filed: 'saleFinancialAssets',
          padding: '20',
          isOK: false
        },
        {
          name: '持有至到期投资',
          value: '',
          lastYear: '',
          filed: 'heldToExpire',
          padding: '20',
          isOK: false
        },
        {
          name: '长期应收款',
          value: '',
          lastYear: '',
          filed: 'longtermReceivables',
          padding: '20',
          isOK: false
        },
        {
          name: '长期股权投资',
          value: '',
          lastYear: '',
          filed: 'longtermEquityInvest',
          padding: '20',
          isOK: false
        },
        {
          name: '投资性房地产',
          value: '',
          lastYear: '',
          filed: 'realEstateInvest',
          padding: '20',
          isOK: false
        },
        {
          name: '固定资产',
          value: '',
          lastYear: '',
          filed: 'fixedAssets',
          padding: '20',
          isOK: false
        },
        {
          name: '在建工程',
          value: '',
          lastYear: '',
          filed: 'constructionInProgress',
          padding: '20',
          isOK: false
        },
        {
          name: '工程物资',
          value: '',
          lastYear: '',
          filed: 'constructionMaterials',
          padding: '20',
          isOK: false
        },
        {
          name: '固定资产清理',
          value: '',
          lastYear: '',
          filed: 'fixedAssetsDisposal',
          padding: '20',
          isOK: false
        },
        {
          name: '生物性生物资产',
          value: '',
          lastYear: '',
          filed: 'biologicalAsset',
          padding: '20',
          isOK: false
        },
        {
          name: '油气资产',
          value: '',
          lastYear: '',
          filed: 'oilAndGasAssets',
          padding: '20',
          isOK: false
        },
        {
          name: '无形资产',
          value: '',
          lastYear: '',
          filed: 'intangibleAssets',
          padding: '20',
          isOK: false
        },
        {
          name: '开发支出',
          value: '',
          lastYear: '',
          filed: 'devCost',
          padding: '20',
          isOK: false
        },
        {
          name: '商誉',
          value: '',
          lastYear: '',
          filed: 'goodwill',
          padding: '10',
          isOK: false
        },
        {
          name: '长期待摊费用',
          value: '',
          lastYear: '',
          filed: 'longtermPrepaidExpenses',
          padding: '20',
          isOK: false
        },
        {
          name: '递延所得税资产',
          value: '',
          lastYear: '',
          filed: 'deferredTaxAssets',
          padding: '20',
          isOK: false
        },
        {
          name: '其他非流动资产',
          value: '',
          lastYear: '',
          filed: 'otherNonCurrentAssets',
          padding: '20',
          isOK: false
        },
        {
          name: '非流动资产合计',
          value: '',
          lastYear: '',
          filed: 'nonCurrentAssetsTotal',
          padding: '60',
          isOK: false
        },
        {
          name: '资产总计',
          value: '',
          lastYear: '',
          filed: 'assetsTotal',
          padding: '80',
          isOK: false
        },
      ],
      tableData1: [
        {
          name: '流动负债：'
        },
        {
          name: '短期借款',
          value: '',
          lastYear: '',
          filed: 'shortTermLoan',
          padding: '20',
          isOK: false
        },
        {
          name: '交易性金融负债',
          value: '',
          lastYear: '',
          filed: 'tradingFinancialDebt',
          padding: '20',
          isOK: false
        },
        {
          name: '应付票据',
          value: '',
          lastYear: '',
          filed: 'debtReceipt',
          padding: '20',
          isOK: false
        },
        {
          name: '应付账款',
          value: '',
          lastYear: '',
          filed: 'debtBill',
          padding: '20',
          isOK: false
        },
        {
          name: '预收款项',
          value: '',
          lastYear: '',
          filed: 'debtPrepayment',
          padding: '20',
          isOK: false
        },
        {
          name: '应付职工薪酬',
          value: '',
          lastYear: '',
          filed: 'empSalary',
          padding: '20',
          isOK: false
        },
        {
          name: '应交税费',
          value: '',
          lastYear: '',
          filed: 'debtTaxCost',
          padding: '20',
          isOK: false
        },
        {
          name: '应付利息',
          value: '',
          lastYear: '',
          filed: 'debtInterest',
          padding: '20',
          isOK: false
        },
        {
          name: '应付股利',
          value: '',
          lastYear: '',
          filed: 'debtDividend',
          padding: '20',
          isOK: false
        },
        {
          name: '其他应付款',
          value: '',
          lastYear: '',
          filed: 'debtOtherReceivable',
          padding: '20',
          isOK: false
        },
        {
          name: '一年内到期的非流动负债',
          value: '',
          lastYear: '',
          filed: 'oneYearDueNonCurrentDebt',
          padding: '20',
          isOK: false
        },
        {
          name: '其他流动负债',
          value: '',
          lastYear: '',
          filed: 'otherCurrentDebt',
          padding: '20',
          isOK: false
        },
        {
          name: '流动负债合计',
          value: '',
          lastYear: '',
          filed: 'currentDebtsTotal',
          padding: '60',
          isOK: false
        },
        {
          name: '非流动负债：'
        },
        {
          name: '长期借款',
          value: '',
          lastYear: '',
          filed: 'longtermLoan',
          padding: '20',
          isOK: false
        },
        {
          name: '应付债券',
          value: '',
          lastYear: '',
          filed: 'bond',
          padding: '20',
          isOK: false
        },
        {
          name: '长期应付款',
          value: '',
          lastYear: '',
          filed: 'longTermAccountsPayable',
          padding: '20',
          isOK: false
        },
        {
          name: '专项应付款',
          value: '',
          lastYear: '',
          filed: 'specialAccountsPayable',
          padding: '20',
          isOK: false
        },
        {
          name: '预计负债',
          value: '',
          lastYear: '',
          filed: 'estimatedDebt',
          padding: '20',
          isOK: false
        },
        {
          name: '递延所得税负债',
          value: '',
          lastYear: '',
          filed: 'deferredTaxDebt',
          padding: '20',
          isOK: false
        },
        {
          name: '其他非流动负债',
          value: '',
          lastYear: '',
          filed: 'otherNonCurrentDebt',
          padding: '10',
          isOK: false
        },
        {
          name: '非流动负债合计',
          value: '',
          lastYear: '',
          filed: 'nonCurrentDebtsTotal',
          padding: '20',
          isOK: false
        },
        {
          name: '负债总计',
          value: '',
          lastYear: '',
          filed: 'debtsTotal',
          padding: '60',
          isOK: false
        },
        {
          name: '所有者权益（或股东权益）：'
        },
        {
          name: '实收资本（或股本）',
          value: '',
          lastYear: '',
          filed: 'paidInCapital',
          padding: '10',
          isOK: false
        },
        {
          name: '资本公积',
          value: '',
          lastYear: '',
          filed: 'capitalReserve',
          padding: '20',
          isOK: false
        },
        {
          name: '减：库存股',
          value: '',
          lastYear: '',
          filed: 'treasuryStock',
          padding: '20',
          isOK: false
        },
        {
          name: '盈余公积',
          value: '',
          lastYear: '',
          filed: 'surplusReserve',
          padding: '20',
          isOK: false
        },
        {
          name: '未分配利润',
          value: '',
          lastYear: '',
          filed: 'undistributedProfit',
          padding: '20',
          isOK: false
        },
        {
          name: '所有者权益（或股东权益）合计',
          value: '',
          lastYear: '',
          filed: 'ownersEquityTotal',
          padding: '20',
          isOK: false
        },
        {
          name: ''
        },
        {
          name: '负债和所有者权益（或股东权益）总计',
          value: '',
          lastYear: '',
          filed: 'debtOwnersEquityTotal',
          padding: '20',
          isOK: false
        }
      ],
      formData: {
        deptId: '',
        belongToDateShort: '',
        companyUserId: 0, // 企业负责人
        financialUserId: 0,
        fillinUserId: 0,
        fillinDate: '',
      },
      countDataArr: {
        currentAssets: ['monetaryCapital','tradingFinAssets','assetReceipt','assetBill','assetPrepayment','assetInterest','assetDividend','assetOtherReceivable','stock','oneYearDueNonCurrentAssets','otherCurrentAssets'], // 流动资产
        nonCurrentAssets: ['saleFinancialAssets','heldToExpire','longtermReceivables','longtermEquityInvest','realEstateInvest','fixedAssets','constructionInProgress','constructionMaterials','fixedAssetsDisposal','biologicalAsset','oilAndGasAssets','intangibleAssets','devCost','goodwill','longtermPrepaidExpenses','deferredTaxAssets','otherNonCurrentAssets'], // 非流动资产
        currentDebts: ['debtBill','debtPrepayment','empSalary','debtTaxCost','debtInterest','debtDividend','debtOtherReceivable','oneYearDueNonCurrentDebt','otherCurrentDebt'], // 流动负债
        nonCurrentDebts: ['longtermLoan','bond','longTermAccountsPayable','specialAccountsPayable','estimatedDebt','deferredTaxDebt','otherNonCurrentDebt'], // 非流动负债总计
        ownersEquity: ['paidInCapital','capitalReserve','treasuryStock','surplusReserve','undistributedProfit'] // 所有者权益（或股东权益）
      },
      userList: [],
      belongToDateShort: '',
      isRepeat: false,
      locked: 0
    }
  },
  created() {
    this.userList=this.$store.getters.userList
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
        // 先关闭其他所有行的编辑状态
        this.tableData1.forEach(item => {
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
    //   if(this.pageState !== 'view' && row.isOK != undefined) {
    //     row.isOK = !row.isOK
    //     if (!row.isOK) {
    //       this.totalAmount()
    //     }
    //     if (row.value) {
    //       row.value = Number(row.value).toFixed(2)
    //     }
    //   }
    // },
    // tab键切换input输入框
    tabCheckInput(e,index){
      if(e.key == 'Tab'){
        this.tableData[index].isOK = false
        if(this.tableData[index+1].isOK != undefined){
          this.tableData[index+1].isOK = true
        }else{
          this.tableData[index+2].isOK = true
        }
      }
    },
    // tab1键切换input输入框
    tab1CheckInput(e,index){
      if(e.key == 'Tab'){
        this.tableData1[index].isOK = false
        if(this.tableData1[index+1].isOK != undefined){
          this.tableData1[index+1].isOK = true
        }else{
          this.tableData1[index+2].isOK = true
        }
      }
    },
    amountHandle(num){
      if (num){
        return toFixed2(Number(num)) //保留小数点后两位，从第三位四舍五入
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
    // 统计金额
    totalAmount(index, name) {
      var currentAssetsRow = 0
      var currentAssetsTotal = 0

      var nonCurrentAssetsRow = 0
      var nonCurrentAssetsTotal = 0

      var currentDebtsRow = 0
      var currentDebtsTotal = 0

      var nonCurrentDebtsRow = 0
      var nonCurrentDebtsTotal = 0

      var ownersEquityRow = 0
      var ownersEquityTotal = 0

      var assetsTotalRow = 0
      var assetsTotal = 0

      var debtsTotalRow = 0

      var debtOwnersEquityTotalRow = 0
      var debtOwnersEquityTotal = 0
      for (let k in this.tableData){
        // 流动资产
        if (this.countDataArr['currentAssets'].find(i => i === this.tableData[k].filed) && this.tableData[k].value){
          currentAssetsTotal = Number(currentAssetsTotal) + Number(this.tableData[k].value)
        }
        if (this.tableData[k].filed == 'currentAssetsTotal'){
          currentAssetsRow = k
        }
        // 非流动资产
        if (this.countDataArr['nonCurrentAssets'].find(i => i === this.tableData[k].filed) && this.tableData[k].value){
          nonCurrentAssetsTotal = Number(nonCurrentAssetsTotal) + Number(this.tableData[k].value)
        }
        if (this.tableData[k].filed == 'nonCurrentAssetsTotal'){
          nonCurrentAssetsRow = k
        }
        // 资产总计
        if (this.tableData[k].filed == 'assetsTotal'){
          assetsTotalRow = k
        }
      }
      for (let k in this.tableData1){
        // 流动负债
        if (this.countDataArr['currentDebts'].find(i => i === this.tableData1[k].filed) && this.tableData1[k].value){
          currentDebtsTotal = Number(currentDebtsTotal) + Number(this.tableData1[k].value)
        }
        if (this.tableData1[k].filed == 'currentDebtsTotal'){
          currentDebtsRow = k
        }
        // 非流动负债总计
        if (this.countDataArr['nonCurrentDebts'].find(i => i === this.tableData1[k].filed) && this.tableData1[k].value){
          nonCurrentDebtsTotal = Number(nonCurrentDebtsTotal) + Number(this.tableData1[k].value)
        }
        if (this.tableData1[k].filed == 'nonCurrentDebtsTotal'){
          nonCurrentDebtsRow = k
        }
        // 所有者权益（或股东权益）
        if (this.countDataArr['ownersEquity'].find(i => i === this.tableData1[k].filed) && this.tableData1[k].value){
          ownersEquityTotal = Number(ownersEquityTotal) + Number(this.tableData1[k].value)
        }
        if (this.tableData1[k].filed == 'ownersEquityTotal'){
          ownersEquityRow = k
        }
        // 负债总计
        if (this.tableData1[k].filed == 'debtsTotal'){
          debtsTotalRow = k
        }
        // 负债和所有者权益（或股东权益）总计
        if (this.tableData1[k].filed == 'debtOwnersEquityTotal'){
          debtOwnersEquityTotalRow = k
        }
      }
      currentAssetsTotal && this.$set(this.tableData[currentAssetsRow], 'value', currentAssetsTotal)
      nonCurrentAssetsTotal && this.$set(this.tableData[nonCurrentAssetsRow], 'value', nonCurrentAssetsTotal)
      assetsTotal = currentAssetsTotal + nonCurrentAssetsTotal
      assetsTotal && this.$set(this.tableData[assetsTotalRow], 'value', assetsTotal)

      currentDebtsTotal && this.$set(this.tableData1[currentDebtsRow], 'value', currentDebtsTotal)
      nonCurrentDebtsTotal && this.$set(this.tableData1[nonCurrentDebtsRow], 'value', nonCurrentDebtsTotal)
      ownersEquityTotal && this.$set(this.tableData1[ownersEquityRow], 'value', ownersEquityTotal)

      currentDebtsTotal && this.$set(this.tableData1[debtsTotalRow], 'value', currentDebtsTotal)

      debtOwnersEquityTotal = currentDebtsTotal + ownersEquityTotal
      debtOwnersEquityTotal && this.$set(this.tableData1[debtOwnersEquityTotalRow], 'value', debtOwnersEquityTotal)
    },
    selectAction(){
      switch (this.pageState) {
        case 'view':
          this.dialogTitle = '资产负债表-查看'
          this.formData = this.reportData
          this.dataHandle()
          this.queryLastYearData(this.formData.belongToDateShort)
          break;
        case 'create':
          this.dialogTitle = '资产负债表-创建'
          break;
        case 'edit':
          this.dialogTitle = '资产负债表-编辑'
          this.formData = JSON.parse(JSON.stringify(this.reportData))
          this.dataHandle()
          this.queryLastYearData(this.formData.belongToDateShort);
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
      for (let k in this.tableData1) {
        if (this.tableData1[k].filed) {
          this.tableData1[k].value = this.formData[this.tableData1[k].filed]
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
      for (let k in this.tableData1) {
        if (this.tableData1[k].filed) {
          this.formData[this.tableData1[k].filed] = this.tableData1[k].value
        }
      }
    },
    // 获取年初数据，即去年12月份资产负债数据
    queryLastYearData(row){
      var toYear = row.slice(0, 4) - 1 + '-12'
      if (this.formData.deptId){
        queryFAssetsDebtList({ deptId: this.formData.deptId, belongToDateShort: toYear }).then(response => {
          var lastYearData = response.data[0] ? response.data[0] : []
          if (lastYearData){
            for (let k in this.tableData) {
              if (this.tableData[k].filed) {
                this.tableData[k].lastYear = lastYearData[this.tableData[k].filed]
              }
            }
            for (let k in this.tableData1) {
              if (this.tableData1[k].filed) {
                this.tableData1[k].lastYear = lastYearData[this.tableData1[k].filed]
              }
            }
          }
        });
      }
      this.repeatCheck()
    },
    delete() {
      if (this.reportData.fadId){
        deleteFAssetsDebt({ fadId: this.reportData.fadId }).then(res => {
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
      assetsDebtCreateExcel({ checkFlag: checkFlag, belongToDateShort: this.belongToDateShort }).then(res => {
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
      if (this.tableData.some(item => item.isOK) || this.tableData1.some(item => item.isOK)) {
        this.$message('请确保所有可编辑行“双击关闭”后再进行提交保存!');
        return false;
      }
      this.dataSaveHandle()
      if (this.pageState === 'create') {
        this.repeatCheck()
        if (this.isRepeat == false) {
          createFAssetsDebt(this.formData).then(res => {
            if (res.success) {
              this.$message.success(res.message)
              this.handleClose(true)
            }
          });
        }
      } else {
        modifyFAssetsDebt(this.formData).then(res => {
          if (res.success){
            this.$message.success(res.message)
            this.handleClose(true)
          }
        });
      }
    },
    queryLocked(row) {
      if (row) {
        queryAssetsDebtLocked({ belongToDateShort: row }).then(res => {
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
      modifyAssetsDebtLocked({ belongToDateShort: this.belongToDateShort, locked: this.locked }).then(res => {
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
          queryFAssetsDebtList(data).then(response => {
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

.table_wid{
  width: 100%;
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

.form-title{
  height: 50px;
  color: #6AA7FF;
  text-align: center;
  line-height: 50px;
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
