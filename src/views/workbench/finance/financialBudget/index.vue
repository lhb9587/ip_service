<template>
    <div style="position: relative;padding: 10px">
<!--      <header>{{$route.meta.title}}</header>-->
      <!--<el-form label-width="136px">-->
        <!--&lt;!&ndash;<div class="el-wrap">&ndash;&gt;-->
        <!--<el-form-item label="预算金额:" class="twoInputWarp">-->
          <!--<el-input type="number" v-model="queryModuleData.budgetAmountStart " placeholder="请输入内容" @change="(e)=>changeTextRange(e,'budgetAmountEnd')" clearable></el-input>-->
          <!--<span>至</span>-->
          <!--<el-input type="number" v-model="queryModuleData.budgetAmountEnd" placeholder="请输入内容" clearable></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="部门名称:">-->
          <!--<el-cascader-->
            <!--v-model="superiorDepartments"-->
            <!--filterable-->
            <!--clearable-->
            <!--:change-on-select="true"-->
            <!--:show-all-levels="false"-->
            <!--:options="departData"-->
            <!--:props="defaultParams"-->
            <!--placeholder="请选择"-->
          <!--&gt;</el-cascader>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="实际支出:" class="twoInputWarp">-->
          <!--<el-input type="number" v-model="queryModuleData.feeAmountStart " placeholder="请输入内容" @change="(e)=>changeTextRange(e,'feeAmountEnd')" clearable></el-input>-->
          <!--<span>至</span>-->
          <!--<el-input type="number" v-model="queryModuleData.feeAmountEnd" placeholder="请输入内容" clearable></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="部门类别:">-->
          <!--<el-radio-group v-model="queryModuleData.deptType">-->
            <!--<el-radio label="">全部</el-radio>-->
            <!--<el-radio label="1">职能部门</el-radio>-->
            <!--<el-radio label="2">业务部门</el-radio>-->
          <!--</el-radio-group>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="月份:" class="twoInputWarp">-->
          <!--<el-date-picker-->
            <!--v-model="queryModuleData.month"-->
            <!--type="date"-->
            <!--placeholder="开始日期"-->
            <!--value-format="yyyy-MM-dd">-->
          <!--</el-date-picker>-->
          <!--<span>至</span>-->
          <!--<el-date-picker-->
            <!--v-model="queryModuleData.month"-->
            <!--type="date"-->
            <!--placeholder="结束日期"-->
            <!--value-format="yyyy-MM-dd">-->
          <!--</el-date-picker>-->
        <!--</el-form-item>-->
        <!--&lt;!&ndash;</div>&ndash;&gt;-->

        <!--<el-button type="primary" class="clearButton" size="mini"  @click="clearSearch"><img src="@/assets/清除@2x.png" alt=""><span>重置</span></el-button>-->
        <!--<div class="buttonWrap">-->
          <!--<el-button type="primary" size="mini"  @click="handleSearch">查询</el-button>-->
        <!--</div>-->
      <!--</el-form>-->
      <!--<el-table-->
        <!--ref="modulTable"-->
        <!--:data="modularData"-->
        <!--style="width: 100%"-->
        <!--row-key="deptId"-->
        <!--border-->
        <!--lazy-->
        <!--:height="modulTableHeight"-->
        <!--:load="load"-->
        <!--:tree-props="{children: 'children', hasChildren: 'hasChildren'}">-->
      <!--&gt;-->
        <!--<el-table-column-->
          <!--label="序号"-->
          <!--type="index"-->
          <!--width="50">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--label="部门名称"-->
          <!--prop="deptName"-->
         <!--&gt;-->
          <!--<template slot-scope="scope">-->
            <!--<img class="icon" src="@/assets/账单.png" alt="" @click="getExpenditureAbs($event,scope.row.deptId)">-->
            <!--{{scope.row.deptName}}-->
          <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--label="2015年预算"-->
          <!--&gt;-->
          <!--<template slot-scope="scope">-->
            <!--{{scope.row.feeAmount2015}}-->
          <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--label="2016年预算"-->
         <!--&gt;-->
          <!--<template slot-scope="scope">-->
            <!--{{scope.row.feeAmount2016}}-->
          <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--label="2017年预算"-->
          <!--&gt;-->
          <!--<template slot-scope="scope">-->
            <!--{{scope.row.feeAmount2017}}-->
          <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--label="2018年预算"-->
         <!--&gt;-->
          <!--<template slot-scope="scope">-->
            <!--{{scope.row.feeAmount2018}}-->
          <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--label="2019预算"-->
          <!--&gt;-->
          <!--<template slot-scope="scope">-->
            <!--{{scope.row.feeAmount2019}}-->
          <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--prop="strStatus"-->
          <!--label="状态"-->
          <!--&gt;-->
          <!--<template slot-scope="scope">-->
            <!--<el-button  type="text" size="small"  @click="setting(scope.row)" >设置</el-button>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <!--<div slot="append">-->
          <!--<transition name="fade">-->
            <!--<ExpenditureDetails v-if="expenditureDetailsState" :deptId="deptId" :left="expenditureLeft" :top="expenditureTop" @closeExpenditureDetails="expenditureDetailsState=false"></ExpenditureDetails>-->
          <!--</transition>-->
        <!--</div>-->
      <!--</el-table>-->
      <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="预算申报" name="1">
          <BudgetDeclaration v-if="activeName==1"></BudgetDeclaration>
        </el-tab-pane>
        <el-tab-pane label="财务预算与支出历史数据" name="2">
          <HistoricalData  v-if="activeName==2"></HistoricalData>
        </el-tab-pane>
        <el-tab-pane label="预算日志" name="3">
          <BudgetLog v-if="activeName==3"></BudgetLog>
        </el-tab-pane>
        <el-tab-pane label="预算报表" name="4">
          <BudgetReport v-if="activeName==4"></BudgetReport>
        </el-tab-pane>
      </el-tabs>
    </div>
</template>

<script>
import HistoricalData from './HistoricalData'
import BudgetDeclaration from './BudgetDeclaration'
import BudgetReport from './BudgetReport'
import BudgetLog from './BudgetLog'
export default {
  name: "index",
  data(){
    return {
      activeName:'1'
    }
  },
  created(){

  },
  methods: {},
  components:{
    HistoricalData,BudgetDeclaration,BudgetLog,BudgetReport
  }
}
</script>

<style lang="scss" scoped>
  header{
    font-family: "思源黑体 CN Bold", "思源黑体 CN";
    font-weight: bold;
    font-style: normal;
    font-size: 18px;
    text-align: left;
    line-height: 30px;
    height: 40px;
    text-indent: 10px;
  }
  .el-table /deep/{
    .cell .icon{
      width: 14px;
      vertical-align: middle;
      cursor: pointer;
    }
      .el-table__expand-icon{
      background: url("~@/assets/扩展.svg") no-repeat center ;
      background-size: contain;
      i:before{
        content: '';
      }
      i:after{
        content: '';
      }
    }
     .el-table__expand-icon--expanded {
      background: url("~@/assets/收缩.svg") no-repeat center ;
      background-size: contain;
      transform: rotate(0);
    }
  }
  .el-form{
    position: relative;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    margin-bottom: 40px;
    padding:10px 120px 10px 10px;
    box-shadow:0px 2px 5px 0px rgba(163, 163, 163, 0.35);
    .el-form-item{
      width: 33%;
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
</style>
