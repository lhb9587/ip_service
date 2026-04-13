<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible.main"
      top="5vh"
      width="90%"
      height="90%"
      :before-close="handleClose">
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
            prop="code"
            label="代码"
            width="180">
          </el-table-column>
          <el-table-column
            prop="value"
            label="本期"
            width="180">
            <template v-slot:default="scope">
              <div v-if="scope.row.filed">
                <el-input type="number" v-if="scope.row.isOK && (scope.row.unit=='人' || scope.row.unit=='件')" v-model="scope.row.value" @keydown.native="tabCheckInput($event,scope.$index)" onkeyup="this.value=this.value.replace(/\D|^0/g,'')"></el-input>
                <el-input type="number" v-else-if="scope.row.isOK && scope.row.unit=='千元'" @keydown.native="tabCheckInput($event,scope.$index)" v-model="scope.row.value"></el-input>
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
import { queryFManageDevList, createFManageDev, modifyFManageDev, manageDevCreateExcel, deleteFManageDev, queryManageDevLocked, modifyManageDevLocked } from '@/api/caseList'
export default {
  name: 'ManageDev',
  props: ['pageState', 'dialogVisible', 'reportData', 'companyList'],
  data() {
    return {
      dialogTitle: '',
      tableData: [
        {
          name: '一、从业人员情况',
          unit: '一',
          code: '一'
        },
        {
          name: '从业人员期末人数',
          unit: '人',
          code: '01',
          value: '',
          filed: 'empNums',
          padding: '20',
          isOK: false
        },
        {
          name: '其中：港澳台和外籍人员',
          unit: '人',
          code: '80',
          value: '',
          filed: 'foreignPersonnel',
          padding: '40',
          isOK: false
        },
        {
          name: '其中：外籍专家人员',
          unit: '人',
          code: '166',
          value: '',
          filed: 'foreignExperts',
          padding: '60',
          isOK: false
        },
        {
          name: '其中：留学归国人员',
          unit: '人',
          code: '02',
          value: '',
          filed: 'returnees',
          padding: '40',
          isOK: false
        },
        {
          name: '其中：本科及以上学历人员',
          unit: '人',
          code: '81',
          value: '',
          filed: 'bachelorOrAbove',
          padding: '40',
          isOK: false
        },
        {
          name: '二、经营财务情况',
          unit: '一',
          code: '一'
        },
        {
          name: '新产品产值',
          unit: '千元',
          code: '07',
          value: '',
          filed: 'outputValue',
          padding: '20',
          isOK: false
        },
        {
          name: '总收入(利润表累计金额）',
          unit: '千元',
          code: '13',
          value: '',
          filed: 'incomeTotal',
          padding: '20',
          isOK: false
        },
        {
          name: '其中：1.技术收入',
          unit: '千元',
          code: '14',
          value: '',
          filed: 'technologyInc',
          padding: '40',
          isOK: false
        },
        {
          name: '2.产品销售收入',
          unit: '千元',
          code: '22',
          value: '',
          filed: 'productSaleInc',
          padding: '82',
          isOK: false
        },
        {
          name: '其中：新产品销售收入',
          unit: '千元',
          code: '24',
          value: '',
          filed: 'newProductSaleInc',
          padding: '100',
          isOK: false
        },
        {
          name: '3.商品销售收入',
          unit: '千元',
          code: '82',
          value: '',
          filed: 'commoditySaleInc',
          padding: '82',
          isOK: false
        },
        {
          name: '4.其他收入',
          unit: '千元',
          code: '29',
          value: '',
          filed: 'otherInc',
          padding: '82',
          isOK: false
        },
        {
          name: '其中：软件产品销售收入',
          unit: '千元',
          code: '27',
          value: '',
          filed: 'softwareSaleInc',
          padding: '40',
          isOK: false
        },
        {
          name: '实缴税费总额（不包括个税）',
          unit: '千元',
          code: '30',
          value: '',
          filed: 'paidTaxes',
          padding: '20',
          isOK: false
        },
        {
          name: '资产总计',
          unit: '千元',
          code: '42',
          value: '',
          filed: 'assetsTotal',
          padding: '20',
          isOK: false
        },
        {
          name: '负债合计',
          unit: '千元',
          code: '100',
          value: '',
          filed: 'debtTotal',
          padding: '20',
          isOK: false
        },
        {
          name: '利润总额',
          unit: '千元',
          code: '65',
          value: '',
          filed: 'profitTotal',
          padding: '20',
          isOK: false
        },
        {
          name: '所得税费用',
          unit: '千元',
          code: '66',
          value: '',
          filed: 'incomeTax',
          padding: '20',
          isOK: false
        },
        {
          name: '进出口总额',
          unit: '千元',
          code: '98',
          value: '',
          filed: 'importAndExportTotal',
          padding: '20',
          isOK: false
        },
        {
          name: '其中：出口总额',
          unit: '千元',
          code: '39',
          value: '',
          filed: 'exportTotal',
          padding: '40',
          isOK: false
        },
        {
          name: '其中：技术服务出口',
          unit: '千元',
          code: '84',
          value: '',
          filed: 'techServiceExport',
          padding: '60',
          isOK: false
        },
        {
          name: '三、研究开发活动情况',
          unit: '一',
          code: '一'
        },
        {
          name: '研究开发人员合计',
          unit: '人',
          code: '03',
          value: '',
          filed: 'rDEmp',
          padding: '20',
          isOK: false
        },
        {
          name: '研究开发费用合计',
          unit: '千元',
          code: '155',
          value: '',
          filed: 'rDCost',
          padding: '20',
          isOK: false
        },
        {
          name: '当年专利申请数',
          unit: '件',
          code: '32',
          value: '',
          filed: 'patentAppNum',
          padding: '20',
          isOK: false
        },
        {
          name: '其中：发明专利申请数',
          unit: '件',
          code: '33',
          value: '',
          filed: 'inventionAppNum',
          padding: '40',
          isOK: false
        },
        {
          name: '当年专利授权数',
          unit: '件',
          code: '63',
          value: '',
          filed: 'patentAuthNum',
          padding: '20',
          isOK: false
        },
        {
          name: '其中：发明专利授权数',
          unit: '件',
          code: '165',
          value: '',
          filed: 'inventionAuthNum',
          padding: '40',
          isOK: false
        },
        {
          name: '技术合同成交总额',
          unit: '千元',
          code: '90',
          value: '',
          filed: 'techContractTotal',
          padding: '20',
          isOK: false
        },
        {
          name: '其中：流向外省市',
          unit: '千元',
          code: '144',
          value: '',
          filed: 'otherProvAndCity',
          padding: '40',
          isOK: false
        },
        {
          name: '其中：河北',
          unit: '千元',
          code: '167',
          value: '',
          filed: 'hebei',
          padding: '60',
          isOK: false
        },
        {
          name: '天津',
          unit: '千元',
          code: '168',
          value: '',
          filed: 'tianjin',
          padding: '102',
          isOK: false
        },
        {
          name: '技术出口',
          unit: '千元',
          code: '145',
          value: '',
          filed: 'techExport',
          padding: '82',
          isOK: false
        },
      ],
      formData: {
        deptId: '',
        belongToDateShort: ''
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
      if(this.pageState !== 'view') {
        row.isOK = !row.isOK
        if (row.value) {
          row.value = Math.round(row.value)
        }
      }
    },
    // tab键切换input输入框
    tabCheckInput(e,index){
      if(e.key == 'Tab'){
        if(this.tableData[index+1].isOK != undefined){
          this.tableData[index+1].isOK = true
        }else{
          this.tableData[index+2].isOK = true
        }
        this.tableData[index].isOK = false
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
    selectAction(){
      switch (this.pageState) {
        case 'view':
          this.dialogTitle = '经营财务研发-查看'
          this.formData = this.reportData
          this.dataHandle()
          break;
        case 'create':
          this.dialogTitle = '经营财务研发-创建'
          break;
        case 'edit':
          this.dialogTitle = '经营财务研发-编辑'
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
      if (this.reportData.fdevId){
        deleteFManageDev({ fdevId: this.reportData.fdevId }).then(res => {
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
      manageDevCreateExcel({ checkFlag: checkFlag, belongToDateShort: this.belongToDateShort }).then(res => {
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
        if (this.isRepeat == false) {
          createFManageDev(this.formData).then(res => {
            if (res.success) {
              this.$message.success(res.message)
              this.handleClose(true)
            }
          });
        }
      } else {
        modifyFManageDev(this.formData).then(res => {
          if (res.success){
            this.$message.success(res.message)
            this.handleClose(true)
          }
        });
      }
    },
    queryLocked(row) {
      if (row) {
        queryManageDevLocked({ belongToDateShort: row }).then(res => {
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
      modifyManageDevLocked({ belongToDateShort: this.belongToDateShort, locked: this.locked }).then(res => {
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
          queryFManageDevList(data).then(response => {
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
