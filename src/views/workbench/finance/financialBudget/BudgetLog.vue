<template>
  <div>
    <el-form label-width="78px">

      <el-form-item label="预算金额:" class="twoInputWarp">
        <el-input type="number" v-model="queryModuleData.budgetAmountStart " placeholder="请输入内容" @change="(e)=>changeTextRange(e,'budgetAmountEnd')" clearable></el-input>
        <span>至</span>
        <el-input type="number" v-model="queryModuleData.budgetAmountEnd" placeholder="请输入内容" clearable></el-input>
      </el-form-item>
      <el-form-item label="部门名称:">
        <el-cascader
          v-model="superiorDepartments"
          filterable
          clearable
          :change-on-select="true"
          :show-all-levels="false"
          :options="limitDepartData"
          :props="defaultParams2"
          placeholder="请选择"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="操作人:" >
        <el-select v-model="queryModuleData.optUser"  filterable
                   clearable>
          <el-option
            v-for="item in taskUserList"
            :key="item.optUser"
            :label="item.optUserName"
            :value="item.optUser"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="操作日期:" class="twoInputWarp">
        <DataPicker v-model="monthList"></DataPicker>
      </el-form-item>
      <el-form-item label="类型:">
        <el-select v-model="queryModuleData.budgetType"  filterable
                   clearable>
          <el-option
            v-for="item in [ '增加预算','追加预算','调整预算']"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年:">
        <el-date-picker
          v-model="queryModuleData.year"
          type="year"
          value-format="yyyy"
          placeholder="选择年">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="月:" >
        <el-date-picker
          v-model="queryModuleData.month"
          type="month"
          format="MM"
          value-format="MM"
          popper-class="monthPopper"
          placeholder="选择月">
        </el-date-picker>
      </el-form-item>
      <el-button type="primary" class="clearButton" size="mini"  @click="clearSearch"><img src="@/assets/清除@2x.png" alt=""><span>重置</span></el-button>
      <div class="buttonWrap">
        <el-button type="primary" size="mini"  @click="handleSearch">查询</el-button>
      </div>
    </el-form>
    <el-table
      ref="budgetDeclarationTable"
      :data="dataList"
      style="width: 100%">
      <el-table-column
        label="序号"
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        label="部门名称"
        prop="deptName"
      >
        <template slot-scope="scope">
          {{scope.row.deptName}}
        </template>
      </el-table-column>
      <el-table-column
        label="类型"
      >
        <template slot-scope="scope">
          {{scope.row.budgetType}}
        </template>
      </el-table-column>
      <el-table-column
        label="转入科目"
      >
        <template slot-scope="scope">
          {{scope.row.feeName}}
        </template>
      </el-table-column>
      <el-table-column
        label="转出科目"
      >
        <template slot-scope="scope">
          {{scope.row.outfeeName}}
        </template>
      </el-table-column>
      <el-table-column
        label="月份"
      >
        <template slot-scope="scope">
          {{scope.row.month}}
        </template>
      </el-table-column>
      <el-table-column
        label="金额"
      >
        <template slot-scope="scope">
          {{scope.row.amount|formatAmount}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作人"
      >
        <template slot-scope="scope">
          {{scope.row.optUserName}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作时间"
      >
        <template slot-scope="scope">
          {{scope.row.optTime}}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {queryBudgetLog,queryDepartMent,queryOperator} from '@/api/caseList.js'
export default {
  name: "BudgetLog",
  data(){
    return {
      queryModuleData: {

      },
      dataList: [],
      monthList:[],
      taskUserList:[],
      limitDepartData:[],
      superiorDepartments:[],
      defaultParams2:{
        value: 'deptId',
        label: 'deptName',
        checkStrictly: true,
        children: 'dataList'
      },
    }
  },
  created() {
    this.queryBudgetLog()
    this.queryDepartMent()
    this.queryOperator()
  },
  methods:{
    clearSearch(){
      this.queryModuleData={}
      this.monthList=[]
      this.superiorDepartments=[]
    },
    handleSearch(){
      this.queryBudgetLog()
    },
    queryDepartMent(){
      queryDepartMent({queryFlag:2}).then(res => {
        this.limitDepartData = res.data
      })

    },
    queryOperator(){
      queryOperator().then(res=>{
        this.taskUserList = res.data
      })
    },
    changeTextRange(e, type) {
      this.$set(this.queryModuleData, type, e)
    },
    queryBudgetLog(){
      this.queryModuleData.optTimeStart = this.monthList[0]
      this.queryModuleData.optTimeEnd = this.monthList[1]
      this.queryModuleData.deptId = this.superiorDepartments[this.superiorDepartments.length-1]
      queryBudgetLog(this.queryModuleData).then(res => {
        this.dataList = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-form{
    position: relative;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    margin-bottom: 40px;
    padding:10px 120px 10px 10px;
    box-shadow:0px 2px 5px 0px rgba(163, 163, 163, 0.35);
    .el-form-item{
      width: 25%;
      /deep/  .el-form-item__content{
        display: flex;
        align-items: center;
        height: 100%;
        .el-cascader{
          width: 100%;
        }
        .el-select{
          width: 100%;
        }
        .el-date-editor{
          width: 100%;
        }
      }
    }
  }
  .clearButton{
    position: absolute;
    right: 18px;
    top: 10px;
    background: #fff;
    color: RGBA(254, 153, 23, 1);
    border: 0;
    /deep/ span{
      display: flex;
      justify-content: center;
      align-items: center;
    }
    img{
      width: 20px;
      margin-right: 8px;
      vertical-align: middle;
    }
  }
  .buttonWrap{
    width: 100%;
    text-align: center;
    transform: translateX(60px);
  }
  .declaration{
    text-align: left;
    &>div{
      position: absolute;
      width: 300px;
      height: 122px;
      background: #ffffff;
      box-shadow: 2px 2px 5px rgba(201, 201, 201, 1);
      z-index: 3;
      padding: 5px;
      &>div{
        display: flex;
        justify-content: flex-end;
        padding-right: 10px;
        padding-bottom: 20px;
      }
    }
    .el-cascader{
      width: 200px;
      height: 30px;
      margin-bottom: 40px;
      //  line-height: 30px;
      .el-input{
        width: 200px;
        height: 30px;
        line-height: 30px;
      }
      /deep/ .el-input__inner{
        width: 200px;
        height: 30px;
        line-height: 30px;
      }
    }
  }
  .el-form{
    z-index: 1;
  }
  .el-table /deep/ .DisableSelection .cell{
    visibility: hidden;
  }
  .button_wrap {
    width: 100%;
    display: flex;
    height: 85px;
    align-items: center;
    justify-content: flex-end;
    .el-button{
      margin-right: 30px;
    }
  }
  .el-table{
    /deep/ th{
      padding:5px 0
    }
    /deep/ td {
      padding: 0 ;
    }
  }
  .el-table{
    width: auto;
    /deep/ tr:nth-of-type(1){
      th{
        background: rgba(242, 242, 242, 1);
      }
    }
  }
  .configTitle{
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
    line-height: 28px;
  }
</style>
