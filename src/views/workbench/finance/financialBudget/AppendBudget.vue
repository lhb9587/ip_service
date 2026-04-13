<template>
  <div style="padding: 0 20px;">
    <header>{{$route.meta.title}}{{$route.query.deptName}}</header>
    <el-form label-width="136px" >
      <el-row>
        <el-form-item label="预算修改方式:">
          <el-radio v-model="modifyType" label="1">增加</el-radio>
          <el-radio v-model="modifyType" label="2">追加</el-radio>
          <el-radio v-model="modifyType" label="3">调整</el-radio>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="费用科目:">
          <el-cascader
            v-model="selectedValues"
            :props="cascaderProps"
            :options="cascaderOptions"
            filterable
            :change-on-select="true"
            :show-all-levels="false"
            clearable
            ></el-cascader>
        </el-form-item>
        <el-form-item label="所属月:">
          <DataPicker v-model="monthList" format="MM" value-format="MM" type="month" start-placeholder="选择月" end-placeholder="选择月" @change="getMonthList"></DataPicker>
          <!--<el-date-picker-->
            <!--class="formatdd"-->
            <!--v-model="formData.startMonth"-->
            <!--type="month"-->
            <!--placeholder="选择月"-->
            <!---->
            <!--value-format="MM">-->
          <!--</el-date-picker>-->
          <!--<span>至</span>-->
          <!--<el-date-picker-->
            <!--class="formatdd"-->
            <!--v-model="formData.endMonth"-->
            <!--type="month"-->
            <!--placeholder="选择月"-->
            <!--format="MM"-->
            <!--value-format="MM">-->
          <!--</el-date-picker>-->
        </el-form-item>
        <div class="buttonWrap">
          <el-button ref="btn" type="primary" size="mini" @click="handleSearch">搜索</el-button>
        </div>
      </el-row>
    </el-form>
    <section>
    <div class="section_left">
      <el-table
        border
        @selection-change="(val)=>selectionChange(val,1)"
        :data="tableDataFlag1"
        style="width: 100%"
        height="400">
        <el-table-column type="selection" width="50">
        </el-table-column>
        <el-table-column type="index" width="50" label="序号">
        </el-table-column>
        <el-table-column
          :prop="item.value"
          :label="item.title"
          align="right"
          v-for="item in tableDefaultList">
          <template slot-scope="scope">
            <span v-if="item.value!='month'">{{scope.row[item.value]|formatAmount}}</span>
            <span v-else>{{scope.row[item.value]}}</span>
          </template>
        </el-table-column>
      </el-table>
      <p> 预算金额为0 <el-button type="text" @click="takeBudgetZero">选择</el-button></p>
      <el-table
        v-if="tableDataState"
        :data="tableDataFlag2"
        style="width: 100%"
        border
        height="400"
        @selection-change="(val)=>selectionChange(val,2)">
        <el-table-column type="selection" width="50">
        </el-table-column>
        <el-table-column type="index" width="50" label="序号">
        </el-table-column>
        <el-table-column
          :width="item.width?item.width:'auto'"
          :prop="item.value"
          :label="item.title"
          align="right"
          v-for="item in tableDefaultList">
          <template slot-scope="scope">
            <span v-if="item.value!='month'">{{scope.row[item.value]|formatAmount}}</span>
            <span v-else>{{scope.row[item.value]}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
      <aside  v-if="tableDataFlag1.length||tableDataState||adjustmentList.length">
        <div>
          <img src="@/assets/箭头.svg" alt="" style="transform: rotate(180deg);cursor: pointer" @click="transferFrom(2)">
           <img src="@/assets/箭头.svg" alt="" style="cursor: pointer" @click="transferFrom(1)">
        </div>
      </aside>
      <div class="append" >
        <div class="title">
          <span v-if="modifyType==1">增加:</span>
          <span v-if="modifyType==2">追加:</span>
          <span v-if="modifyType==3">调整:</span>
        </div>
        <el-table
          height="400"
          border
          v-show="adjustmentList.length&&modifyType!=3"
          :data="adjustmentList"
          style="width: 100%">
          <el-table-column type="index" width="50" label="序号">
          </el-table-column>
          <el-table-column
            :prop="item.value"
            :label="item.title"
            align="right"
            v-for="item in adjustmentTitleList">
            <template slot-scope="scope">
              <span v-if="item.value!='newAmount'&&item.value!='memo'&&item.value!='month'">{{scope.row[item.value]|formatAmount}}</span>
              <span v-if="item.value=='month'">{{scope.row[item.value]}}</span>
              <span v-if="item.value=='newAmount'">
                <el-input  type="number" v-model="scope.row[item.value]"></el-input>
              </span>
              <span v-if="item.value=='memo'">
                <el-input  type="text" v-model="scope.row[item.value]"></el-input>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
          >
            <template slot-scope="scope">
              <el-button  type="text" size="small" @click="deleteAdjust(scope.row)" >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-table
          height="400"
          border
          v-show="adjustmentList.length&&modifyType==3"
          :data="adjustmentList"
          style="width: 100%">
          <el-table-column type="index" width="50" label="序号">
          </el-table-column>
          <el-table-column
            :width="item.width?item.width:'auto'"
            :prop="item.value"
            :label="item.title"
            v-for="item in adjustmentTitleList1">
            <template slot-scope="scope">
              <span v-if="item.value!='newAmount'&&item.value!='outId'&&item.value!='memo'&&item.value!='month'">{{scope.row[item.value]|formatAmount}}</span>
              <span v-if="item.value=='month'">{{scope.row[item.value]}}</span>
              <span v-if="item.value=='outId'" :focus="getCurOptions(scope.row)">
                <el-select v-model="scope.row[item.value]" placeholder="请选择"  filterable
                           clearable>
                  <el-option
                    v-for="item in scope.row.options?scope.row.options:[]"
                    :key="item.bdDetailId"
                    :label="`${item.feeName} ${item.month}月(${item.amount})`"
                    :value="item.bdDetailId">
                  </el-option>
                </el-select>
              </span>
              <span v-if="item.value=='memo'">
                <el-input type="text" v-model="scope.row[item.value]"></el-input>
              </span>
              <el-form :model="scope.row"  :ref="`mineForm${scope.$index}`" v-if="item.value=='newAmount'">
                <el-form-item prop="newAmount" :rules="{ validator:(rule, value, callback)=> validateMineParamsValueInput(rule, value, callback,scope.row.options&&scope.row.options.length&&scope.row.outId?scope.row.options.find(itm=>itm.bdDetailId==scope.row.outId).amount:0), trigger: 'blur' }">
                  <el-input  v-if="scope.row.foucs" type="number" :min="0" :max="scope.row.options&&scope.row.options.length&&scope.row.outId?scope.row.options.find(itm=>itm.bdDetailId==scope.row.outId).amount:0" v-model="scope.row[item.value]" @blur="()=>onBlur(scope.row)"></el-input>
                  <el-input v-if="!scope.row.foucs" type="text"  :value="formatAmount(scope.row[item.value])" @focus="()=>onfocus(scope.row)"></el-input>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="60"
          >
            <template slot-scope="scope">
              <el-button  type="text" size="small" @click="deleteAdjust(scope.row)" >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="button_warp">
          <el-button size="mini" @click="submitAdjust" type="primary">确定</el-button>
          <el-button size="mini" @click="cancel">取消</el-button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import {queryBudgetForAjust,queryBudgetFeeType,addBudget,ajustBudget} from '@/api/caseList'
import {formatAmount} from '@/utils/filters.js'
export default {
  name: "AppendBudget",
  data(){
    return {
      formData: {

      },
      modifyType: '1',
      cascaderOptions:[],
      monthList:[],
      selectedValues:[],
      tableDataFlag1:[],
      tableDataFlag2:[],
      adjustmentList:[],
      tableDataState:false,
      multipleSelection:[],
      multipleSelection2:[],
      cascaderProps:{
        emitPath:false,
        value: "feetId",
        label: "feeName",
        children: "dataList",
        checkStrictly: true
      },
      tableDefaultList:[{'title':'费用科目','value':'feeName' },{'title': '所属月','value':'month'},{'title':'预算剩余金额','value':'amount',filter:true}],
      adjustmentTitleList:[{'title':'费用科目','value':'feeName' },{'title': '所属月','value':'month'},{'title':'预算剩余金额','value':'amount',filter:true},{'title':'增加金额','value':'newAmount',filter:true},{'title':'备注','value':'memo'}],
      adjustmentTitleList1:[{'title':'转入科目','value':'feeName' },{'title': '所属月','value':'month',width:80},{'title':'预算剩余金额','value':'amount',filter:true},{'title':'转出科目','value':'outId',width:300},{'title':'转出金额','value':'newAmount',width:150,filter:true},{'title':'备注','value':'memo'}],
    }
  },
  created() {
   // document.getElementById('app').classList.add('formatdd')
    this.queryBudgetFeeType()
  },
  mounted() {
    this.$refs.btn.$el.onkeydown= (e) =>{
      let _key=window.event.keyCode;
      if(_key===13){
        return false;
      }
    }
  },
  methods:{
    handleSearch(){
      this.adjustmentList = []
      this.queryBudgetForAjust(1)
      this.queryBudgetForAjust(2)
    },
    getMonthList(e){
        this.formData.endMonth=e[1]
      this.formData.startMonth=e[0]
    },
    formatAmount( amount){
      return formatAmount(amount)
    },
    onfocus(itm){
      this.$set(itm,'foucs',true)
    },
    onBlur(itm){
      this.$set(itm,'foucs',false)
      delete itm.focus
    },
    validateMineParamsValueInput(rule, value, callback,max){
      if(value < 0){
        return callback(new Error('不能输入负值'))
      }
      if(value > max){
        return callback(new Error('金额超过最大值'+max))
      }
      callback()
      // 输入为空
      // if (!value) {
      //   return callback(new Error('请输入**'))
      // } else {
      //   //自定义验证
      //   callback()
      // }
    },
    selectionChange(val, type) {
      if (type == 1) {
        this.multipleSelection = val
      }
      if(type == 2) {
        this.multipleSelection2 = val
      }
    },
    transferFrom(type) {
      if (type == 1) {
        this.multipleSelection.forEach(item=>{
          this.adjustmentList.push(...this.tableDataFlag1.splice(this.tableDataFlag1.indexOf(item),1))
        })
        this.multipleSelection2.forEach(item=>{
          this.adjustmentList.push(...this.tableDataFlag2.splice(this.tableDataFlag2.indexOf(item),1))
        })
        this.multipleSelection=[]
        this.multipleSelection2=[]
      }
      if (type == 2) {
        this.adjustmentList.forEach(item => {
          if (item.amount) {
            this.tableDataFlag1.push(item)
          } else {
            this.tableDataFlag2.push(item)
          }
        })
        this.adjustmentList = []
      }
    },
    deleteAdjust(row) {
      if(row.amount){
        this.tableDataFlag1.push(...this.adjustmentList.splice(this.adjustmentList.indexOf(row),1))
      } else {
        this.tableDataFlag2.push(...this.adjustmentList.splice(this.adjustmentList.indexOf(row),1))
      }
    },
    takeBudgetZero(){
      this.tableDataState = !this.tableDataState
      // if (this.tableDataState&&!this.tableDataFlag2.length){
      //   this.queryBudgetForAjust(2)
      // }
    },
    queryBudgetFeeType(){
      queryBudgetFeeType().then(res=>{
        this.cascaderOptions = res.data
      })
    },
    getCurOptions(row){
      if(!row.options){
        let feeName=row.feeName.match(/[\u4e00-\u9fa5]+\//g)[1].replace(/\//, '')
        queryBudgetForAjust(JSON.parse(JSON.stringify({queryFlag: 3,feeName,deptId: this.$route.query.deptId}))).then(res=>{
          row.options=res.data
        })
      }
    },
    queryBudgetForAjust(flag){
      this.formData.feetId = this.selectedValues[this.selectedValues.length-1]
      queryBudgetForAjust(JSON.parse(JSON.stringify(Object.assign(this.formData, {queryFlag: flag, deptId: this.$route.query.deptId})))).then(res=>{
        if(flag==1){
          this.tableDataFlag1=res.data
        } else {
          this.tableDataFlag2=res.data
        }
      })
    },
    submitAdjust() {
      if (this.modifyType == 1 || this.modifyType == 2) {
        const data = {
          deptId: this.$route.query.deptId,
          budgetList: this.adjustmentList.map(item => ({
            amount: item.newAmount,
            month: item.month,
            feetId: item.feetId,
            budgetType: this.modifyType == 1 ? '增加预算':'追加预算',
            budgetId: item.budgetId,
            memo:item.memo
          }))
        }
        addBudget(data).then(res => {
          this.$router.go(-1)
        })
      } else{
        Promise.all(this.adjustmentList.map((item, index) => this.$refs['mineForm' + (index)][0].validate())).then(res=>{
          const data = {
            deptId: this.$route.query.deptId,
            ajustList: this.adjustmentList.map(item => ({
              amount: item.newAmount,
              // month: item.month,
              inId: item.bdDetailId,
              outId: item.outId,
              memo:item.memo
            }))
          }
          ajustBudget(data).then(res => {
            this.$router.go(-1)
          })
       })
      }
    },
    cancel(){
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
  header{
    height: 39px;
    font-size: 18px;
    font-family: SourceHanSansCN-Normal;
    font-weight: 600;
    color: rgba(38, 42, 47, 1);
    line-height: 39px;
  }
  .el-row{
    display: flex;
    align-items: center;
    padding-top: 10px;
    .el-form-item{
      margin: 0;
    }
    .el-button{
      margin-left: 20px;
    }
    .el-cascader,.formatdd{
      height: 32px;
      line-height: 32px;
      /deep/{
        .el-input,.el-input__inner,.el-input__icon{
          height: 32px;
          line-height: 32px;
        }
      }
    }
  }
  section{
    margin-top: 20px;
    display: flex;
    .section_left{
      width: 640px;
      margin-right: 20px;
    }
    aside{
      padding-top: 200px;
      display: flex;
      flex-wrap: wrap;
      width: 40px;
      justify-content: center;
      img{
        width: 40px;
        margin-top: 10px;
        height: 40px;
      }
    }
    .append{
      box-sizing: border-box;
      border: 1px solid rgba(201, 201, 201, 1);
      flex: 1;
      margin-left: 20px;
      margin-right: 20px;
      display: flex;
      flex-direction: column;
      height: 500px;
      padding: 10px;
      justify-content: space-between;
      .title{
        height: 30px;
        left: 30px;
        font-weight: bold;
        font-style: normal;
        font-size: 18px;
      }
      .button_warp{
        margin-top: 10px;
        width: 100%;
        display: flex;
        justify-content: flex-end;
      }
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
  .el-form-item{
    /deep/ {
      margin-bottom: 0;
    }
  }
  .el-form-item.is-error{
    /deep/ {
      margin-bottom: 22px;
    }
  }
</style>
