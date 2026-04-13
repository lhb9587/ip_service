<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible.main"
      top="5vh"
      width="100%"
      height="80%"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <div>
        <template>
          <label>编制单位</label>
          <span v-if="pageState != 'create'">{{formData.deptIdStr}}</span>
          <el-select v-else v-model="formData.deptId" filterable clearable @change="queryFFundAccountList">
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
            @change="queryLastMonth">
          </el-date-picker>
        </template>
        <el-table
          :data="formData.details"
          :span-method="objectSpanMethod"
          border
          stripe
          :cell-style="cellStyle"
          :row-class-name="tableRowClassName"
          @row-dblclick="handleRowClick"
          style="width: 100%;"
          size="mini">
          <el-table-column
            fixed
            prop="currency"
            label="货币形式"
            width="70">
          </el-table-column>
          <el-table-column
            fixed
            prop="account"
            label="具体描述"
            width="192"
          >
          </el-table-column>
          <el-table-column
            prop="lastMonth"
            label="上月余额"
            width="110">
            <template v-slot:default="scope">
<!--              <el-input type="number" size="mini" v-if="scope.row.isOK" v-model="scope.row.lastMonth"></el-input>-->
<!--              <span v-else>{{amountHandle(scope.row.lastMonth)}}</span>-->
              {{amountHandle(scope.row.lastMonth)}}
            </template>
          </el-table-column>
          <el-table-column
            prop="thisMonthInc"
            label="本月增加"
            width="130">
            <template v-slot:default="scope">
              <el-input type="number" size="mini" v-if="scope.row.isOK" v-model="scope.row.thisMonthInc"></el-input>
              <span v-else>{{amountHandle(scope.row.thisMonthInc)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="thisMonthDec"
            label="本月减少"
            width="130">
            <template v-slot:default="scope">
              <el-input type="number" size="mini"  v-if="scope.row.isOK" v-model="scope.row.thisMonthDec"></el-input>
              <span v-else>{{amountHandle(scope.row.thisMonthDec)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="thisMonthBanlance"
            label="本月余额"
            width="130">
            <template v-slot:default="scope">
              <el-input type="number" size="mini"  v-if="scope.row.isOK" v-model="scope.row.thisMonthBanlance"></el-input>
              <span v-else>{{amountHandle(scope.row.thisMonthBanlance)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="financial"
            label="包含理财款"
            width="130">
            <template v-slot:default="scope">
              <el-input type="number" size="mini"  v-if="scope.row.isOK" v-model="scope.row.financial"></el-input>
              <span v-else>{{amountHandle(scope.row.financial)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="bankRecvEntNot"
            label="银行已收企业未收"
            width="130">
            <template v-slot:default="scope">
              <el-input type="number" size="mini"  v-if="scope.row.currency != '现金' && scope.row.isOK" v-model="scope.row.bankRecvEntNot"></el-input>
              <span v-else>{{amountHandle(scope.row.bankRecvEntNot)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="bankPaidEntNot"
            label="银行已付企业未付"
            width="130">
            <template v-slot:default="scope">
              <el-input type="number" size="mini"  v-if="scope.row.currency != '现金' && scope.row.isOK" v-model="scope.row.bankPaidEntNot"></el-input>
              <span v-else>{{amountHandle(scope.row.bankPaidEntNot)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="adjustBanlanceOne"
            label="调节后余额"
            width="110">
            <template v-slot:default="scope">
              <span>{{amountHandle(scope.row.adjustBanlanceOne)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="billBanlance"
            label="对账单余额"
            width="130">
            <template v-slot:default="scope">
              <el-input type="number" size="mini"  v-if="scope.row.currency != '现金' && scope.row.isOK" v-model="scope.row.billBanlance"></el-input>
              <span v-else>{{amountHandle(scope.row.billBanlance)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="entRecvBankNot"
            label="企业已收银行未收"
            width="130">
            <template v-slot:default="scope">
              <el-input type="number" size="mini"  v-if="scope.row.currency != '现金' && scope.row.isOK" v-model="scope.row.entRecvBankNot"></el-input>
              <span v-else>{{amountHandle(scope.row.entRecvBankNot)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="entPaidBankNot"
            label="企业已付银行未付"
            width="130">
            <template v-slot:default="scope">
              <el-input type="number" size="mini"  v-if="scope.row.currency != '现金' && scope.row.isOK" @keydown.native="tabCheckInput($event,scope.$index)" v-model="scope.row.entPaidBankNot"></el-input>
              <span v-else>{{amountHandle(scope.row.entPaidBankNot)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="adjustBanlance"
            label="调节后余额"
            width="110">
            <template v-slot:default="scope">
              <span>{{amountHandle(scope.row.adjustBanlance)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="对账图片"
            width="107">
            <template v-slot:default="scope">
              <template v-if="scope.row.currency=='银行存款'">
                <span style="display: flex">
                  <el-button v-if="scope.row.materialId" :title="scope.row.materialName" @click="preView(scope.row.address)" style="padding: 3px 5px;font-size: 12px;" icon="el-icon-picture">查看</el-button>
                  <el-upload
                    name="attachFile"
                    :data="uploadFileData"
                    :action="fundBalanceUploadImage"
                    :show-file-list="false"
                    :on-success="(res, file, fileList)=>successCallback(res, file, fileList,scope.row,scope.$index)"
                    :before-upload="beforeAvatarUpload">
                    <el-button style="margin-left:5px;padding: 5px 5px;font-size: 12px;">上传</el-button>
                  </el-upload>  
                </span>
              </template>
            </template>
          </el-table-column>
        </el-table>
        <el-table
          v-if="isOtherAmounts"
          :data="otherAmounts"
          :span-method="supplyObjectSpanMethod"
          border
          stripe
          :cell-style="cellStyle"
          :row-class-name="tableRowClassName"
          @row-dblclick="handleExtraRowDblClick"
          style="width: 100%;"
          size="mini">
          <el-table-column
            prop="currency"
            label="货币形式"
            width="70">
            <template v-slot:default="scope">
              {{'应收款'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="account"
            label="具体描述"
            width="192"
          >
          </el-table-column>
          <el-table-column
            prop="lastMonthAll"
            label="上月余额"
            width="110">
            <template v-slot:default="scope">
              {{amountHandle(scope.row.lastMonthAll)}}
            </template>
          </el-table-column>
          <el-table-column
            prop="thisMonthIncAll"
            label="本月增加"
            width="130">
            <template v-slot:default="scope">
              <el-input type="number" size="mini" v-if="scope.row.isOK" v-model="scope.row.thisMonthIncAll"></el-input>
              <span v-else>{{amountHandle(scope.row.thisMonthIncAll)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="thisMonthDecAll"
            label="本月减少"
            width="130">
            <template v-slot:default="scope">
              <el-input type="number" size="mini" v-if="scope.row.isOK" v-model="scope.row.thisMonthDecAll"></el-input>
              <span v-else>{{amountHandle(scope.row.thisMonthDecAll)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="thisMonthBanlanceAll"
            label="本月余额"
            width="130">
            <template v-slot:default="scope">
              <el-input type="number" size="mini" v-if="scope.row.isOK" @keydown.native="tabOtherCheckInput($event,scope.$index)" v-model="scope.row.thisMonthBanlanceAll"></el-input>
              <span v-else>{{amountHandle(scope.row.thisMonthBanlanceAll)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="备注"
            width="130">
            <template v-slot:default="scope">
              <el-input v-if="pageState !== 'view'" type="textarea" v-model.lazy="remarks" :rows="15"></el-input>
              <span v-else>{{ remarks }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="button_wrap">
          <el-button class="exactButton" type="primary" v-if="pageState!='view'" @click="submit('暂存')">暂存</el-button>
          <el-button class="exactButton" type="success" v-if="pageState!='view'" @click="submit('完成')">完成</el-button>
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
import {fundBalanceUploadImage} from "@/api/ipServiceApi.config.js";
import { queryFFundRegions, queryFFundAccountList, queryFFundBalanceList, createFFundRegions, modifyFFundRegions, createFFundBalanceBatch, modifyFFundBalanceBatch,
  fundBalanceCreateExcel, deleteFFundRegions, queryFundBalanceLocked, modifyFundBalanceLocked, queryLastMonthFFundRegionsDetail } from '@/api/caseList'
import { toFixed2 } from '@/utils/filters'
export default {
  name: 'FundBalance',
  props: ['pageState', 'dialogVisible', 'reportData', 'companyList', 'wfstatus'],
  data() {
    return {
      lastYearInput: true,// 可读
      diasabledInput: false,// 可读可写
      deptId: 124,
      dialogTitle: '',
      defaultField: {
        currency: '',
        account: '',
        lastMonth: 0,
        thisMonthInc: '',
        thisMonthDec: '',
        thisMonthBanlance: '',
        financial: '',
        bankRecvEntNot: '',
        bankPaidEntNot: '',
        billBanlance: 0,
        entRecvBankNot: '',
        entPaidBankNot: '',
        adjustBanlance: '',
        isOK: false,
        isModify: 0,
        sort: 0
      },
      tableData: [],
      formData: {
        deptId: '',
        belongToDateShort: '',
        details: [],
        wfstatus: ''
      },
      uploadFileData: {
        tokenID: this.$store.getters.token
      },
      fundBalanceUploadImage,
      belongToDateShort: '',
      isOtherAmounts: false,
      isOAList: false,
      otherAmountsLabel: [],
      otherAmounts:[],
      remarks: '',
      defaultOtherAmounts: [
        // {
        //   currency: '额外补充',
        //   account: '应支付而未支付分红',
        //   belongToDateShort: '',
        //   bType: 2,
        //   lastMonthAll: '',
        //   thisMonthIncAll: '',
        //   thisMonthDecAll: '',
        //   thisMonthBanlanceAll: ''
        // },
        // {
        //   currency: '额外补充',
        //   account: '长期投资-港日',
        //   belongToDateShort: '',
        //   bType: 3,
        //   lastMonthAll: '',
        //   thisMonthIncAll: '',
        //   thisMonthDecAll: '',
        //   thisMonthBanlanceAll: ''
        // },
        {
          currency: '额外补充',
          account: '海关及法院保证金情况',
          belongToDateShort: '',
          bType: 4,
          lastMonthAll: '',
          thisMonthIncAll: '',
          thisMonthDecAll: '',
          thisMonthBanlanceAll: ''
        }
      ],
      fFundUncollecteds:['2014年及以前年度','2015','2016','2017','2018','2019','2020','2021','2022','2023','2024','2025','2026'], // 年度数据
      isRepeat: false,
      locked: 0
    }
  },
  created() {
    // this.$set(this.otherAmountsLabel, 2, '应支付而未支付分红')
    // this.$set(this.otherAmountsLabel, 3, '长期投资-港日')
    this.$set(this.otherAmountsLabel, 4, '海关及法院保证金情况')
    this.$set(this.otherAmountsLabel, 6, '已开账单未收回款项')
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
    toNumber(value) {
      return Number(value) || 0;
    },
    // 规则计算余额
    calculateBalances(row) {
      // 本月余额 =  上月余额 + 本月增加 - 本月减少
      row.thisMonthBanlance = (this.toNumber(row.lastMonth) + this.toNumber(row.thisMonthInc) - this.toNumber(row.thisMonthDec)).toFixed(2)
      // 针对现金，两个调节后余额自动设置为“本月余额”
      if (row.currency == '现金'){
        row.adjustBanlanceOne = row.thisMonthBanlance
        row.adjustBanlance = row.thisMonthBanlance
      }else{
        // 调节后余额1 = 本月余额 + 银行已收企业未收 - 银行已付企业未付
        row.adjustBanlanceOne = (this.toNumber(row.thisMonthBanlance) + this.toNumber(row.bankRecvEntNot) - this.toNumber(row.bankPaidEntNot)).toFixed(2)
        // 调节后余额2 = 对账单余额 + 企业已收银行未收 - 企业已付银行未付
        row.adjustBanlance = (this.toNumber(row.billBanlance) + this.toNumber(row.entRecvBankNot) - this.toNumber(row.entPaidBankNot)).toFixed(2)
      }
    },
    // 鼠标移入移出
    // mouseEvent(row, column){
    //   // console.log(row.isModify,column)
    //   if(this.pageState !== 'view' && !row.account.includes(['现金合计']) && !row.account.includes(['银行存款合计'])){
    //     this.calculateBalances(row)
    //     if (row.isModify){
    //       if (row.isOK == undefined){
    //         this.$set(row, 'isOK', false)
    //       }
    //       row.isOK = !row.isOK
    //       if (!row.isOK){
    //         this.totalAmount()
    //       }
    //       if (row.value){
    //         row.value = Number(row.value).toFixed(2)
    //       }
    //     }
    //   }
    // },
    // 额外补充鼠标移入移出
    // extraMouseEvent(row, column){
    //   row.thisMonthBanlanceAll = (this.toNumber(row.lastMonthAll) + this.toNumber(row.thisMonthIncAll) - this.toNumber(row.thisMonthDecAll)).toFixed(2)
    //   if(this.pageState !== 'view'){
    //     if (row.isOK == undefined){
    //       this.$set(row, 'isOK', false)
    //     }
    //     if (!row.isOK){
    //       this.uncoAmountofBill()
    //     }
    //     row.isOK = !row.isOK
    //     if (row.value){
    //       row.value = Number(row.value).toFixed(2)
    //     }
    //   }
    // },
    // 设置行的 class
    tableRowClassName({ row, rowIndex  }) {
      return row.isOK ? 'highlight-row' : '';
    },
    // 双击编辑行
    handleRowClick(row) {
      // 如果是只读模式或特定行，直接返回
      if (this.pageState === 'view' || 
          row.account.includes('现金合计') || 
          row.account.includes('银行存款合计')) {
        return;
      }

      // 只在可修改的行上触发
      if (row.isModify) {
        // 先关闭其他所有行的编辑状态
        this.formData.details.forEach(item => {
          if (item !== row && item.isOK) {
            item.isOK = false;
            // 如果需要保存其他行的计算结果
            this.calculateBalances(item);
          }
        });

        // 处理当前点击的行
        this.calculateBalances(row);
        
        // 切换当前行的编辑状态
        if (row.isOK === undefined) {
          this.$set(row, 'isOK', true);
        } else {
          row.isOK = !row.isOK;
        }

        // 重新计算总额
        this.totalAmount();

        // 格式化数值
        if (row.value) {
          row.value = Number(row.value).toFixed(2);
        }
      }
    },
    // 双击处理额外补充鼠标
    handleExtraRowDblClick(row) {
      if(this.pageState === 'view') {
        return;
      }

      // 先关闭其他所有行的编辑状态
      this.otherAmounts.forEach(item => {
        if (item !== row && item.isOK) {
          item.isOK = false;
          // 如果需要保存其他行的计算结果
          item.thisMonthBanlanceAll = (
            this.toNumber(item.lastMonthAll) + 
            this.toNumber(item.thisMonthIncAll) - 
            this.toNumber(item.thisMonthDecAll)
          ).toFixed(2);
        }
      });

      // 计算本月余额
      row.thisMonthBanlanceAll = (
        this.toNumber(row.lastMonthAll) + 
        this.toNumber(row.thisMonthIncAll) - 
        this.toNumber(row.thisMonthDecAll)
      ).toFixed(2);

      // 切换当前行的编辑状态
      if (row.isOK === undefined) {
          this.$set(row, 'isOK', true);
        } else {
          row.isOK = !row.isOK;
        }
      
      this.uncoAmountofBill();
      
      if (row.value) {
        row.value = Number(row.value).toFixed(2);
      }
    },
    // tab键切换input输入框
    tabCheckInput(e,index){
      if(e.key == 'Tab'){
        this.formData.details[index].isOK = false
        this.formData.details[index+1].isOK = true
      }
    },
    // tab键切换input输入框
    tabOtherCheckInput(e,index){
      if(e.key == 'Tab'){
        this.otherAmounts[index].isOK = false
        this.otherAmounts[index+1].isOK = true
      }
    },
    amountHandle(num){
      if (num){
        return toFixed2(Number(num)) //保留小数点后两位，从第三位四舍五入
      }
    },
    mergeColumn(){
      const spanOneArr = []
      let concatOne = 0
      this.formData.details.forEach(( item, index ) => {
        if (index === 0){
          spanOneArr.push(1)
        } else {
          //name 修改
          if (item.currency === this.formData.details[index - 1].currency){ //第一列需合并相同内容的字段
            spanOneArr[concatOne] += 1
            spanOneArr.push(0)
          } else {
            spanOneArr.push(1)
            concatOne = index
          }
        }
      })
      return {
        one: spanOneArr
      }
    },
    objectSpanMethod({row, column, rowIndex, columnIndex}){
      if (columnIndex === 0) {
        const _row = (this.mergeColumn(this.formData.details).one)[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    // 额外
    supplyMergeColumn(){
      const spanOneArr = []
      let concatOne = 0
      this.otherAmounts.forEach(( item, index ) => {
        if (index === 0){
          spanOneArr.push(1)
        } else {
          //name 修改
          if (item.currency === this.otherAmounts[index - 1].currency){ //第一列需合并相同内容的字段
            spanOneArr[concatOne] += 1
            spanOneArr.push(0)
          } else {
            spanOneArr.push(1)
            concatOne = index
          }
        }
      })
      return {
        one: spanOneArr
      }
    },
    supplyObjectSpanMethod({row, column, rowIndex, columnIndex}){
      if (columnIndex === 0) {
        const _row = (this.supplyMergeColumn(this.otherAmounts).one)[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }

      }
      if(columnIndex === 6) {
        return {
          rowspan: row.account.includes('以前年度') ? 11 : 0,
          colspan: row.account.includes('以前年度') ? 1 : 0
        }
      }
    },
    beforeAvatarUpload(file) {
      var index = file.name.lastIndexOf(".");
      // 获取后缀
      var ext = file.name.substr(index + 1).toLowerCase();
      // 输出结果
      var extarr = ['jpg','jpeg', 'png', 'pdf']

      let flag = true
      if (extarr.indexOf(ext) == -1) {
        flag = false
        this.$message.error('上传对账文件只能是JPG/PNG/PDF格式!');
      }
      return flag
    },
    // 上传图片成功回调
    successCallback(res, file, fileList, row, index) {
      row.materialId = res.data.materialId
      row.materialName = res.data.materialName
      row.address = res.data.address
    },
    // 预览查看
    preView(url) {
      if(['doc','docx'].includes(url.replace(/.+\./,"").toLocaleLowerCase())) {
        this.$commonUtils.viewPdf(`${url}`)
      }else if(['pdf','jpg','png'].some(item=>url.replace(/.+\./,"").toLocaleLowerCase()==item)) {
        window.open(`/ipdoc${url}`.replace(/[+]/g,'%2B'))
      } else {
        this.downLoad(url)
      }
    },
    selectAction(){
      switch (this.pageState) {
        case 'view':
          this.dialogTitle = '货币资金情况表-查看'
          this.diasabledInput = true
          this.formData = this.reportData
          console.log('view',this.formData)
          this.dataInit()
          // this.queryLastMonth() //IPSERVICE-4900 查看使用数据库数据
          this.adjustedBalance()
          break;
        case 'create':
          this.dialogTitle = '货币资金情况表-创建'
          this.initfFundUncollecteds()
          break;
        case 'edit':
          this.dialogTitle = '货币资金情况表-编辑'
          this.formData = JSON.parse(JSON.stringify(this.reportData))
          this.dataInit()
          this.queryLastMonth()
          this.adjustedBalance()
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
    // 初始调节后余额赋值,计算
    adjustedBalance() {
      this.formData.details.forEach(item => {
        // adjustBanlanceOne 这个字段是虚拟的，需要重新赋值
        item.adjustBanlanceOne = (this.toNumber(item.thisMonthBanlance) + this.toNumber(item.bankRecvEntNot) - this.toNumber(item.bankPaidEntNot)).toFixed(2)
      })
    },
    // 额外补充数据初始化
    initfFundUncollecteds(){
      var fFundUncollecteds = []
      this.fFundUncollecteds.forEach(item => {
        var defaultfFundField = {}

        defaultfFundField.currency = '额外补充'
        defaultfFundField.account = item
        defaultfFundField.yearNumAll = item
        defaultfFundField.lastMonthAll = ''
        defaultfFundField.thisMonthIncAll = ''
        defaultfFundField.thisMonthDecAll = ''
        defaultfFundField.thisMonthBanlanceAll = ''
        this.defaultOtherAmounts.push(JSON.parse(JSON.stringify(defaultfFundField))) // 深拷贝
      })
      var otherAmounts = {
        currency: '额外补充',
        account: '已开账单未收回款项',
        belongToDateShort: '',
        bType: 6,
        lastMonthAll: '',
        thisMonthIncAll: '',
        thisMonthDecAll: '',
        thisMonthBanlanceAll: ''
      }
      this.defaultOtherAmounts.push(otherAmounts)
    },
    // 获取上个月数据
    queryLastMonth() {
      if (this.formData.deptId && this.formData.belongToDateShort) {
        this.formData.lastMonthTotal = ''
        queryLastMonthFFundRegionsDetail({ deptId: this.formData.deptId, belongToDateShort: this.formData.belongToDateShort }).then(res => {
          if (res.data != '') {
            let lastMonth = 0
            let lastMonthTotal = 0
            for (var i in res.data) {
              for (var j in this.formData.details) {
                if (res.data[i].currency == this.formData.details[j].currency && res.data[i].account == this.formData.details[j].account) {
                  lastMonth = this.toNumber(res.data[i].lastMonth)
                  lastMonthTotal = lastMonthTotal + lastMonth
                  this.formData.details[j].lastMonth = lastMonth
                  if (this.pageState == 'create'){
                    this.formData.details[j].thisMonthBanlance = lastMonth
                    this.formData.details[j].adjustBanlanceOne = lastMonth
                    if (res.data[i].currency == '现金'){
                      this.formData.details[j].adjustBanlance = lastMonth
                    }
                  } else {
                    this.calculateBalances(this.formData.details[j])
                  }
                }
              }
            }
            this.formData.lastMonthTotal = lastMonthTotal.toFixed(2)
          }
        })
        if (this.pageState == 'create'){
          this.dataInit()
        }
      }
    },
    // 获取日期上个月
    getPriorMonthFirstDay(date) {
      let startMonth = date.slice(-2) - 1
      let startYear = date.slice(0, 4)
      if (startMonth <= 0) {
        startYear = startYear - 1
        startMonth = 12
      }
      return startYear+'-'+startMonth
    },
    // 判断是否是北京，额外补充
    dataInit() {
      if (this.formData.deptId == this.deptId) {
        this.otherAmounts = JSON.parse(JSON.stringify(this.defaultOtherAmounts))
        this.isOtherAmounts = true
        if(this.formData.belongToDateShort){
          var belongToDateShort =  this.getPriorMonthFirstDay(this.formData.belongToDateShort)
          if (this.pageState == 'create'){
            // 获取上月数据
            this.queryFFundBalanceList(belongToDateShort)
          }else{
            queryFFundBalanceList({ belongToDateShort: this.formData.belongToDateShort }).then(res => {
              if (res.data != '') {
                var otherAmounts = []
                res.data.forEach(item => {
                  item.currency = '额外补充'
                  item.account = this.otherAmountsLabel[item.bType]
                  if (item.bType == 6){
                    this.remarks = item.remarks
                    var fFundUncollecteds = JSON.parse(JSON.stringify(item.fFundUncollecteds).replace(/Unc/g, 'All'))
                    for (let k in fFundUncollecteds){
                      if (fFundUncollecteds.hasOwnProperty(k)){
                        fFundUncollecteds[k].currency = '额外补充'
                        fFundUncollecteds[k].account = fFundUncollecteds[k].yearNumAll
                        otherAmounts.push(fFundUncollecteds[k])
                      }
                    }
                  }
                  otherAmounts.push(item)
                })
                this.otherAmounts = otherAmounts
                this.queryFFundBalanceList(belongToDateShort)
                this.isOAList = true
              }
            })
          }
        }
      }
      this.repeatCheck()
    },
    // 获取数据
    queryFFundBalanceList(belongToDateShort) {
      queryFFundBalanceList({belongToDateShort: belongToDateShort}).then(res => {
        if (res.data != '') {
          res.data.forEach(item => {
            for (let k in this.otherAmounts){
              if (this.otherAmounts.hasOwnProperty(k)){
                if (item.bType == this.otherAmounts[k].bType){
                  this.otherAmounts[k].lastMonthAll = item.thisMonthBanlanceAll
                  if (item.bType == 6){
                    this.initAnnualData(JSON.parse(JSON.stringify(item.fFundUncollecteds).replace(/Unc/g, 'All')))
                  }
                }
              }
            }
          })
        }
        this.otherAmountsCount()
      })
    },
    // 额外补充数据计算
    otherAmountsCount() {
      this.otherAmounts.forEach(item => {
        item.thisMonthBanlanceAll = (this.toNumber(item.lastMonthAll) + this.toNumber(item.thisMonthIncAll) - this.toNumber(item.thisMonthDecAll)).toFixed(2)
      })
    },
    /* 循环已开账单未收回款项年度数据 */
    initAnnualData(data){
      data.forEach(item => {
        for (let k in this.otherAmounts){
          if (item.yearNumAll == this.otherAmounts[k].account){
            this.otherAmounts[k].lastMonthAll = item.thisMonthBanlanceAll
          }
        }
      })
    },
    /* 获取账户数据，初始化内容（1） */
    queryFFundAccountList(row) {
      this.isOtherAmounts = false
      var AccountList = []
      if (row){
        queryFFundAccountList({ deptId: row }).then(res => {
          var casharr =[]
          var depositarr =[]
          var otherarr = []
          res.data.forEach(item => {
            var defaultField = JSON.parse(JSON.stringify(this.defaultField))
            defaultField.currency = item.currency
            defaultField.account = item.account
            defaultField.sort = item.sort
            defaultField.isModify = item.isModify
            if (item.currency == '现金'){
              casharr.push(defaultField)
            } else if (item.currency == '银行存款'){
              depositarr.push(defaultField)
            } else {
              otherarr.push(defaultField)
            }
          })
          if (res.data.length > 0){
            var cash = JSON.parse(JSON.stringify(this.defaultField))
            cash.currency = '现金'
            cash.account = '现金合计'
            casharr.push(cash)

            var deposit = JSON.parse(JSON.stringify(this.defaultField))
            deposit.currency = '银行存款'
            deposit.account = '银行存款合计'
            depositarr.push(deposit)
            AccountList = casharr.concat(depositarr.concat(otherarr))
          }
          var TotalFunds = JSON.parse(JSON.stringify(this.defaultField))
          TotalFunds.currency = '全部'
          TotalFunds.account = '全部资金合计'
          if (res.data.length <= 0){
            TotalFunds.isModify = 1
          }
          AccountList.push(TotalFunds)

          console.log('处理后数据',AccountList)
          this.formData.details = AccountList
        });
      }
      this.dataInit()
    },
    delete() {
      if (this.reportData.fregId){
        deleteFFundRegions({ fregId: this.reportData.fregId }).then(res => {
          if (res.success) {
            this.$message.success(res.message)
            this.handleClose(true)
          }
        });
      }
    },
    // 账单未收回款项 计算
    uncoAmountofBill(){
      if (this.isOtherAmounts){
        var billRow = 0
        var billData = []
        var thisMonthBanlanceAll = 0
        var thisMonthDecAll = 0
        var thisMonthIncAll = 0
        for (var i in this.otherAmounts){
          if (!this.otherAmounts[i].bType){
            if (this.otherAmounts[i].thisMonthBanlanceAll){
              thisMonthBanlanceAll = thisMonthBanlanceAll + Number(this.otherAmounts[i].thisMonthBanlanceAll)
            }
            if (this.otherAmounts[i].thisMonthDecAll) {
              thisMonthDecAll = thisMonthDecAll + Number(this.otherAmounts[i].thisMonthDecAll)
            }
            if (this.otherAmounts[i].thisMonthIncAll) {
              thisMonthIncAll = thisMonthIncAll + Number(this.otherAmounts[i].thisMonthIncAll)
            }
          }else{
            billRow = i
            billData = this.otherAmounts[i]
          }
        }
        billData.thisMonthBanlanceAll = thisMonthBanlanceAll.toFixed(2)
        billData.thisMonthDecAll = thisMonthDecAll.toFixed(2)
        billData.thisMonthIncAll = thisMonthIncAll.toFixed(2)
        this.$set(this.otherAmounts,billRow,billData)
      }
    },
    // 计算余额
    totalAmount() {
      // this.uncoAmountofBill()

      const cashAccounts = this.formData.details.filter(account => account.currency === '现金' && account.account !== '现金合计')
      const depositAccounts = this.formData.details.filter(account => account.currency === '银行存款' && account.account !== '银行存款合计')
      const allAccounts = this.formData.details.filter(account => account.account !== '现金合计' && account.account !== '银行存款合计' && account.account !== '全部资金合计')
      const computeTotals = (accounts) => {
        return accounts.reduce((totals, account) => {
          totals.inc += this.toNumber(account.thisMonthInc) // 本月增加
          totals.dec += this.toNumber(account.thisMonthDec) // 本月减少
          totals.balance += this.toNumber(account.thisMonthBanlance) // 本月余额
          totals.financial += this.toNumber(account.financial) // 包含理财款
          totals.bankRecvEntNot += this.toNumber(account.bankRecvEntNot) // 银行已收企业未收
          totals.bankPaidEntNot += this.toNumber(account.bankPaidEntNot) // 银行已付企业未付
          totals.billBanlance += this.toNumber(account.billBanlance) // 对账单余额
          totals.entRecvBankNot += this.toNumber(account.entRecvBankNot) // 企业已收银行未收
          totals.entPaidBankNot += this.toNumber(account.entPaidBankNot) // 企业已付银行未付
          totals.adjustBanlanceOne += this.toNumber(account.adjustBanlanceOne) // 调节后余额1
          totals.adjustBanlance += this.toNumber(account.adjustBanlance) // 调节后余额
          return totals
        }, { inc: 0, dec: 0, balance: 0, financial: 0, bankRecvEntNot: 0, bankPaidEntNot: 0, billBanlance: 0, entRecvBankNot: 0, entPaidBankNot: 0, adjustBanlanceOne: 0, adjustBanlance: 0 })
      }

      const cashTotals = computeTotals(cashAccounts)
      const depositTotals = computeTotals(depositAccounts)
      const allTotals = computeTotals(allAccounts)

      const updateAccount = (account, totals) => {
        account.thisMonthInc = totals.inc
        account.thisMonthDec = totals.dec
        account.thisMonthBanlance = totals.balance
        account.financial = totals.financial
        account.bankRecvEntNot = totals.bankRecvEntNot
        account.bankPaidEntNot = totals.bankPaidEntNot
        account.billBanlance = totals.billBanlance
        account.entRecvBankNot = totals.entRecvBankNot
        account.entPaidBankNot = totals.entPaidBankNot
        account.adjustBanlanceOne = totals.adjustBanlanceOne
        account.adjustBanlance = totals.adjustBanlance
      }

      // 计算合计金额
      if (this.formData.deptId != 300001 && this.formData.deptId != 300002) {
        updateAccount(this.formData.details.find(account => account.account === '现金合计'), cashTotals)
        updateAccount(this.formData.details.find(account => account.account === '银行存款合计'), depositTotals)
        updateAccount(this.formData.details.find(account => account.account === '全部资金合计'), allTotals)
      }

    },
    download(checkFlag){
      if (!this.belongToDateShort){
        this.$message.error('请选择导出报表月份!');
        return;
      }
      fundBalanceCreateExcel({ checkFlag: checkFlag, belongToDateShort: this.belongToDateShort }).then(res => {
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
    // 数据保存处理
    dataSaveHandle() {
      for (const detail of this.formData.details) {
        if (detail.currency === '全部') {
          const {
            lastMonth,
            thisMonthInc,
            thisMonthDec,
            thisMonthBanlance,
            financial,
            bankRecvEntNot,
            bankPaidEntNot,
            billBanlance,
            entRecvBankNot,
            entPaidBankNot,
            adjustBanlance,
          } = detail;

          this.formData.lastMonthTotal = lastMonth;
          this.formData.thisMonthIncTotal = thisMonthInc;
          this.formData.thisMonthDecTotal = thisMonthDec;
          this.formData.thisMonthBanlanceTotal = thisMonthBanlance;
          this.formData.financialTotal = financial;
          this.formData.BankRecvEntNotTotal = bankRecvEntNot;
          this.formData.bankPaidEntNotTotal = bankPaidEntNot;
          this.formData.billBanlanceTotal = billBanlance;
          this.formData.entRecvBankNotTotal = entRecvBankNot;
          this.formData.entPaidBankNotTotal = entPaidBankNot;
          this.formData.adjustBanlanceTotal = adjustBanlance;
        }
      }
    },
    async submit(wfstatus) {
      if (!this.formData.deptId || !this.formData.belongToDateShort){
        this.$message('请选择编制单位和报表月份!');
        return false;
      }
      if (this.formData.details.some(item => item.isOK) || this.otherAmounts.some(item => item.isOK)) {
        this.$message('请确保所有可编辑行“双击关闭”后再进行提交保存!');
        return false;
      }
      if (wfstatus == '完成') {
        var messageAdopt = ''
        var messageCheck = ''
        this.formData.details.forEach(item => {
          if (item.currency == '银行存款' && !item.account.includes('银行存款合计') && item.isModify){
            if (!item.materialId){
              messageAdopt = messageAdopt + item.account + ';'
            }
            if (!item.adjustBanlanceOne || !item.adjustBanlance || this.toNumber(item.adjustBanlanceOne).toFixed(2) !== this.toNumber(item.adjustBanlance).toFixed(2)){
              messageCheck = messageCheck + item.account + ';'
            }
          }
        })
        if (messageAdopt) {
          this.$message.warning('请上传以下账户银行对账图片：' + messageAdopt)
          return false;
        }
        if (messageCheck) {
          this.$message.warning('请检查以下账户银行调节后余额：' + messageCheck)
          return false;
        }
      }
      this.formData.wfstatus = wfstatus
      this.dataSaveHandle()
      if (this.pageState === 'create') {
        await this.repeatCheck()
        if (this.isRepeat == false) {
          if (this.isOtherAmounts) {
            this.operateFFundBalanceBatch()
          }
          createFFundRegions(this.formData).then(res => {
            if (res.success) {
              this.$message.success(res.message)
              this.handleClose(true)
            }
          });
        }
      } else {
        if (this.isOtherAmounts) {
          this.operateFFundBalanceBatch()
        }
        modifyFFundRegions(this.formData).then(res => {
          if (res.success){
            this.$message.success(res.message)
            this.handleClose(true)
          }
        });
      }
    },
    // 批量创建资金余额情况 即额外补充
    operateFFundBalanceBatch() {
      // 循环插入所属月、处理额外补充数据
      var _this = this
      let otherAmounts = []
      let fFundUncollecteds = []
      this.otherAmounts.forEach(function(item, index) {
        _this.$set(_this.otherAmounts[index], 'belongToDateShort', _this.formData.belongToDateShort);
        if (item.bType){
          otherAmounts.push(item)
        }else{
          fFundUncollecteds.push(item)
        }
      })
      for (let k in otherAmounts) {
        if(otherAmounts[k].bType == 6){
          otherAmounts[k].remarks = this.remarks
          otherAmounts[k].fFundUncollecteds = JSON.parse(JSON.stringify(fFundUncollecteds).replace(/All/g, 'Unc')) // 字段不同，转换
        }
      }
      console.log(otherAmounts)
      if (!this.isOAList) {
        createFFundBalanceBatch({ balances: otherAmounts }).then(res => {});
      } else {
        modifyFFundBalanceBatch({ balances: otherAmounts }).then(res => {});
      }
    },
    queryLocked(row) {
      if (row) {
        queryFundBalanceLocked({ belongToDateShort: row }).then(res => {
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
      modifyFundBalanceLocked({ belongToDateShort: this.belongToDateShort, locked: this.locked }).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.handleClose(true)
        }
      });
    },
    // 检查新建报表是否重复
    async repeatCheck() {
      if (this.pageState === 'create') {
        const data = {
          deptId: this.formData.deptId,
          belongToDateShort: this.formData.belongToDateShort
        }
        if (data.deptId && data.belongToDateShort) {
          await queryFFundRegions(data).then(response => {
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

/deep/ .el-input--mini .el-input__inner {
  padding: 0 3px;
}
</style>
