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
          <label>报表季度</label>
          <span v-if="pageState != 'create'">{{formData.belongToYear + '年' + formData.quarter + '季度'}}</span>
          <el-quarter-picker v-else v-model="yearQuarter" placeholder="选择季度" @change="quarterPicker"/>
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
            label="本季度"
            width="180">
            <template v-slot:default="scope">
              <div v-if="scope.row.filed">
                <el-input type="number" v-if="scope.row.isOK" v-model="scope.row.value" @keydown.native="tabCheckInput($event,scope.$index)" onkeyup="this.value=this.value.replace(/\D|^0/g,'')"></el-input>
                <span v-else>{{scope.row.value}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="value"
            label="1-本季度"
            width="180">
            <template v-slot:default="scope">
              <div v-if="scope.row.filed1">
                <el-input type="number" v-if="scope.row.isOK && scope.row.unit=='人'" v-model="scope.row.value1" @keydown.native="tabCheckInput($event,scope.$index)" onkeyup="this.value=this.value.replace(/\D|^0/g,'')"></el-input>
                <el-input type="number" v-else-if="scope.row.isOK && scope.row.unit=='千元'" @keydown.native="tabCheckInput($event,scope.$index)" v-model="scope.row.value1"></el-input>
                <span v-else-if="scope.row.unit=='千元'">{{amountHandle(scope.row.value1)}}</span>
                <span v-else>{{scope.row.value1}}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!--        <el-button icon="el-icon-circle-plus" type="primary" @click="add()">提交</el-button>-->
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
        <span>请选择编制单位或所属季度</span>
      </div>
      <div>
        <div class="input-lable">所属季度</div>
        <el-quarter-picker v-model="belongToDateShort" placeholder="选择季度" @change="quarterPicker1" style="width: 70%"/>
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
        <span>请选择报表季度数据</span>
      </div>
      <div>
        <el-quarter-picker v-model="belongToDateShort" placeholder="选择季度" @change="quarterPicker1" style="width: 60%"/>
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
import ElQuarterPicker from '../../components/ElQuarterPicker'
import { createFSalary, modifyfSalary, salaryCreateExcel, deletefSalary, querySalaryLocked, modifySalaryLocked, queryfSalaryList } from '@/api/caseList'
export default {
  name: 'Salary',
  props: ['pageState', 'dialogVisible', 'reportData', 'companyList'],
  components: {
    ElQuarterPicker
  },
  data() {
    return {
      dialogTitle: '',
      yearQuarter: '', // 年度季度拼接
      tableData: [
        {
          name: '一、从业人员',
          unit: '一',
          code: '一'
        },
        {
          name: '从业人员期末人数',
          unit: '人',
          code: '01',
          value: 0,
          filed: 'fSalaryThisQuarter.empNums',
          padding: '20',
          isOK: false
        },
        {
          name: '其中：女性',
          unit: '人',
          code: '02',
          value: 0,
          filed: 'fSalaryThisQuarter.female',
          padding: '40',
          isOK: false
        },
        {
          name: '其中：工作地在外省市人员',
          unit: '人',
          code: 'BJ011',
          value: 0,
          filed: 'fSalaryThisQuarter.workOutOfTown',
          padding: '40',
          isOK: false
        },
        {
          name: '其中：户口在外省市人员',
          unit: '人',
          code: 'BJ07',
          value: 0,
          filed: 'fSalaryThisQuarter.regResidenceInOtherProv',
          padding: '40',
          isOK: false
        },
        {
          name: '其中：工作地在外省市人员',
          unit: '人',
          code: 'BJ08',
          value: 0,
          filed: 'fSalaryThisQuarter.regAndWorkInOther',
          padding: '60',
          isOK: false
        },
        {
          name: '其中：劳务派遣人员',
          unit: '人',
          code: '06',
          value: 0,
          filed: 'fSalaryThisQuarter.laborDispatchEmp',
          value1: 0,
          filed1: 'fSalaryThisQuarter1.laborDispatchEmp',
          padding: '40',
          isOK: false
        },
        {
          name: '从业人员平均人数',
          unit: '人',
          code: '08',
          value1: 0,
          filed1: 'fSalaryThisQuarter1.avgEmpNums',
          padding: '20',
          isOK: false
        },
        {
          name: '其中： 劳务派遣人员',
          unit: '人',
          code: '18',
          value1: 0,
          filed1: 'fSalaryThisQuarter1.laborDispatchAvgEmp',
          padding: '40',
          isOK: false
        },
        {
          name: '二、工资总额',
          unit: '一',
          code: '一'
        },
        {
          name: '从业人员工资总额',
          unit: '千元',
          code: '12',
          value1: 0,
          filed1: 'fSalaryThisQuarter1.salaryTotal',
          padding: '20',
          isOK: false
        },
        {
          name: '其中：劳务派遣人员',
          unit: '千元',
          code: '18',
          value1: 0,
          filed1: 'fSalaryThisQuarter1.laborDispatchSalaryTotal',
          padding: '40',
          isOK: false
        },
      ],
      formData: {
        deptId: '',
        belongToYear: '', // 年度
        quarter: '', // 季度
        fSalaryThisQuarter: {
          empNums: '',
          female: '',
          workOutOfTown: '',
          regResidenceInOtherProv: '',
          regAndWorkInOther: '',
          laborDispatchEmp: ''
        },
        fSalaryThisQuarter1: {
          laborDispatchEmp: '',
          avgEmpNums: '',
          laborDispatchAvgEmp: '',
          salaryTotal: '',
          laborDispatchSalaryTotal: ''
        }
      },
      deptId: '',
      belongToYear: '',
      quarter: '',
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
        if (!row.value){
          row.value = 0
        }
        if (!row.value1){
          row.value1 = 0
        }
        if (row.value || row.value1) {
          row.value = Math.round(row.value)
          row.value1 = Math.round(row.value1)
        }
      }
    },
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
          this.dialogTitle = '从业人员工资总额-查看'
          this.formData = this.reportData
          this.yearQuarter = this.reportData.belongToYear + '-0' + this.reportData.quarter
          this.dataHandle()
          break;
        case 'create':
          this.dialogTitle = '从业人员工资总额-创建'
          break;
        case 'edit':
          this.dialogTitle = '从业人员工资总额-编辑'
          this.formData = this.reportData
          this.yearQuarter = this.reportData.belongToYear + '-0' + this.reportData.quarter
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
        if (this.tableData[k].filed1) {
          if (this.tableData[k].filed1.indexOf(".") !== -1) {
            var filed = this.tableData[k].filed1.split(".")
            this.tableData[k].value1 = this.formData[filed[0]][filed[1]]
          }else {
            this.tableData[k].value1 = this.formData[this.tableData[k].filed1]
          }
        }
      }
    },
    // 数据保存处理
    dataSaveHandle() {
      for (let k in this.tableData) {
        if (this.tableData[k].filed) {
          var filed = this.tableData[k].filed.split(".")
          this.formData[filed[0]][filed[1]] = this.tableData[k].value
        }
        if (this.tableData[k].filed1) {
          var filed1 = this.tableData[k].filed1.split(".")
          this.formData[filed1[0]][filed1[1]] = this.tableData[k].value1
        }
      }
    },
    quarterPicker(row) {
      this.formData.belongToYear = row.slice(0, 4)
      this.formData.quarter = row.slice(-1)
      this.repeatCheck()
    },
    quarterPicker1(row) {
      this.belongToYear = row.slice(0, 4)
      this.quarter = row.slice(-1)
      if (this.pageState == 'lock') {
        this.queryLocked()
      }
    },
    delete() {
      if (this.reportData.fstId) {
        deletefSalary({ fstId: this.reportData.fstId }).then(res => {
          if (res.success) {
            this.$message.success(res.message)
            this.handleClose(true)
          }
        });
      }
    },
    download(checkFlag){
      if (!this.belongToDateShort){
        this.$message.error('请检查所属季度是否选择!');
        return;
      }
      var queryData = {
        checkFlag: checkFlag,
        belongToYear: this.belongToYear,
        quarter: this.quarter
      }
      salaryCreateExcel(queryData).then(res => {
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
      if (!this.formData.deptId || !this.formData.quarter) {
        this.$message('请选择报表编制单位及所属季度')
        return false
      }
      this.dataSaveHandle()
      if (this.pageState === 'create') {
        this.repeatCheck()
        if (this.isRepeat == false) {
          createFSalary(this.formData).then(res => {
            console.log(res.success)
            if (res.success) {
              this.$message.success(res.message)
              this.handleClose(true)
            }
          });
        }
      } else {
        modifyfSalary(this.formData).then(res => {
          if (res.success){
            this.$message.success(res.message)
            this.handleClose(true)
          }
        });
      }
    },
    queryLocked() {
      querySalaryLocked({ belongToYear: this.belongToYear, quarter: this.quarter }).then(res => {
        if (res.data) {
          this.locked = res.data.locked
        } else {
          this.$message.warning(this.belongToYear+'年第'+this.quarter+'季度无报表进行操作!');
          return;
        }
      })
    },
    modifyLocked() {
      if (!this.belongToYear){
        this.$message.error('请选择报表季度!');
        return;
      }
      modifySalaryLocked({ belongToYear: this.belongToYear, quarter: this.quarter, locked: this.locked }).then(res => {
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
          belongToYear: this.formData.belongToYear,
          quarter: this.formData.quarter
        }
        if (data.deptId && data.quarter) {
          queryfSalaryList(data).then(response => {
            if (response.data.length > 0) {
              console.log(response.data)
              this.$message.warning(data.belongToYear + '年' + data.quarter + '季度报表已存在，请修改!');
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
    handleClose(state) {
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
