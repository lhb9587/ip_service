<template>
  <div style="position: relative">
    <el-form label-width="136px"  >
      <!--<div class="el-wrap">-->
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
      <el-form-item label="实际支出:" class="twoInputWarp">
        <el-input type="number" v-model="queryModuleData.feeAmountStart " placeholder="请输入内容" @change="(e)=>changeTextRange(e,'feeAmountEnd')" clearable></el-input>
        <span>至</span>
        <el-input type="number" v-model="queryModuleData.feeAmountEnd" placeholder="请输入内容" clearable></el-input>
      </el-form-item>
      <el-form-item label="部门类别:">
        <el-radio-group v-model="queryModuleData.deptType">
          <el-radio label="">全部</el-radio>
          <el-radio label="1">职能部门</el-radio>
          <el-radio label="2">业务部门</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="月份:" class="twoInputWarp">
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
        <DataPicker type="month" v-model="monthList" start-placeholder="起始月份" end-placeholder="终止月份" format="MM" value-format="MM"></DataPicker>
      </el-form-item>
      <!--</div>-->

      <el-button type="primary" class="clearButton" size="mini"  @click="clearSearch"><img src="@/assets/清除@2x.png" alt=""><span>重置</span></el-button>
      <div class="buttonWrap">
        <el-button type="primary" size="mini"  @click="handleSearch(100)">查询</el-button>
      </div>
    </el-form>
    <el-table
      ref="modulTable"
      :data="modularData"
      style="width: 100%"
      row-key="deptId"
      border
      lazy
      :height="modulTableHeight"
      :load="load"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      >
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
          <img class="icon" src="@/assets/账单.png" alt="" @click="getExpenditureAbs($event,scope.row.deptId)">
          {{scope.row.deptName}}
        </template>
      </el-table-column>
      <el-table-column
        :label="item.title"
        v-for="item in defaultTitleList"
        :prop="item.value"
      >
      <template slot-scope="scope">
       <div style="text-align: right">{{scope.row[item.value]|formatAmount}}</div>
      </template>
      </el-table-column>
      <!--<el-table-column-->
        <!--prop="strStatus"-->
        <!--label="操作"-->
      <!--&gt;-->
        <!--<template slot-scope="scope">-->
          <!--&lt;!&ndash;<el-button  type="text" size="small"  @click="setting(scope.row)" >设置</el-button>&ndash;&gt;-->
        <!--</template>-->
      <!--</el-table-column>-->
      <div slot="append">
        <transition name="fade">
          <ExpenditureDetails v-clickoutside="handleClickoutside" v-if="expenditureDetailsState" :monthRange="curMonthRange" :titleStr="titleStr" :deptId="deptId" :left="expenditureLeft" :top="expenditureTop" @closeExpenditureDetails="expenditureDetailsState=false"></ExpenditureDetails>
        </transition>
      </div>
    </el-table>
  </div>
</template>

<script>

import { queryBudgetFee,queryDepartMent} from '@/api/caseList'
import ExpenditureDetails from './components/ExpenditureDetails'
import { selectAllDept } from '@/api/systemList'
import {getLanglist} from '@/utils'
export default {
  name: "HistoricalData",
  data(){
    return {
      queryModuleData:{},
      modularData:[],//列表數據
      expenditureLeft:0,
      expenditureTop:0,
      expenditureDetailsState:false,
      modulTableHeight:1000,
      defaultParams2:{
        value: 'deptId',
        label: 'deptName',
        checkStrictly: true,
        children: 'dataList'
      },
      titleStr:'',
      limitDepartData:[],
      superiorDepartments:[],
      monthList: [],
      curMonthRange:[],
      queryModuleDataDefault:{},
      defaultTitleList:[]
      //deptId:123
    }
  },
  created(){
    this.selectAllDept()
    this.handleSearch()
  },
  methods:{
    handleClickoutside(event){
      this.expenditureDetailsState=false
    },
    async  handleSearch(e){
      this.modularData=[]
      if(e){
        this.queryModuleData.queryFlag=e
      }
      this.curMonthRange=JSON.parse(JSON.stringify(this.monthList))
      this.queryModuleDataDefault=JSON.parse(JSON.stringify(this.queryModuleData))
      var { data } = await this.queryBudgetFee(this.queryModuleData)

      this.modularData = await this.formtData(data)
      this.defaultTitleList = [...new Set(getLanglist(this.modularData.map(item => Object.keys(item))))].filter(item=>item.includes('feeAmount')||item.includes('budgetAmount')).map(item=>({
        title: item.replace(/(feeAmount|budgetAmount)/,'') + (item.includes('feeAmount')?'年支出':'年预算'),
        value: item
      }))
    },
    async clearSearch(){
      this.queryModuleData={}
      this.superiorDepartments=[]
      this.monthList=[]
      // var { data } = await this.queryBudgetFee(this.queryModuleData)
      // this.modularData = await this.formtData(data)
    },
    getExpenditureAbs(e,deptId){
      this.expenditureLeft=e.target.parentNode.parentNode.nextSibling.offsetLeft
      this.expenditureTop=e.target.parentNode.parentNode.nextSibling.offsetTop
      this.modulTableHeight=this.expenditureTop + 870
      this.deptId=deptId
      this.titleStr=e.target.nextSibling.wholeText.trim()
      this.expenditureDetailsState=true
    },
    queryBudgetFee(data){//請求數據
      return queryBudgetFee(data)
    },
    async formtData(data){
      if(!data){
        return []
      }
      delete this.queryModuleDataDefault.queryFlag
      for (var item of data){
        if (item.deptId) {
          // const queryData = { deptId: item.deptId }
          // var newData = await this.queryBudgetFee(JSON.parse(JSON.stringify(Object.assign(this.queryModuleDataDefault,queryData))))
          // var hasChildren = newData.data
          if (!item.hasChild) {
            item.hasChildren = false
          } else {
            item.hasChildren = true
            item.children = []
          }

        } else {
          item.deptId = item.wkgId
          item.deptName = item.groupName
          item.hasChildren = false
        }
        if(item.dataList && item.dataList.length){
          item.dataList.forEach(itm => {
            item['feeAmount' + itm.year] = itm.feeAmount
            item['budgetAmount' + itm.year] = itm.budgetAmount
          })
        }
      }
      // data.forEach(async (item) => {
      //   if (item.deptId) {
      //     const queryData = { deptId: item.deptId }
      //     var newData = await this.queryBudgetFee(JSON.parse(JSON.stringify(Object.assign(this.queryModuleDataDefault,queryData))))
      //     var hasChildren = newData.data
      //     if (!hasChildren) {
      //       item.hasChildren = false
      //     } else {
      //       item.hasChildren = true
      //       item.children = []
      //     }
      //
      //   } else {
      //     item.deptId = item.wkgId
      //     item.deptName = item.groupName
      //     item.hasChildren = false
      //   }
      //   if(item.dataList && item.dataList.length){
      //     item.dataList.forEach(itm => {
      //       item['feeAmount' + itm.year] = itm.feeAmount
      //       item['budgetAmount' + itm.year] = itm.budgetAmount
      //     })
      //   }
      // })
      // console.log(data);
      return JSON.parse(JSON.stringify(data))
    },
    async load(tree, treeNode, resolve) {
      const queryData={ deptId:treeNode.rowKey}
      var { data } = await this.queryBudgetFee(Object.assign(this.queryModuleDataDefault,queryData))
      var dataList = await data
      this.formtData(dataList)
      if(!dataList){
        dataList = []
      }
      resolve(dataList)
    },
    selectAllDept(){
      queryDepartMent({queryFlag:2}).then(res => {
        this.limitDepartData = res.data
      })
    },
    changeTextRange(e,type) {
      this.$set(this.queryModuleData,type, e)
    },
  },
  watch:{
    'superiorDepartments'(n){
      this.queryModuleData.deptId=n[n.length-1]
    },
    monthList(n){
      this.queryModuleData.startMonth=n[0]
      this.queryModuleData.endMonth=n[1]
    }
  },
  components:{
    ExpenditureDetails
  },
}
</script>

<style lang="scss" scoped>
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
</style>
