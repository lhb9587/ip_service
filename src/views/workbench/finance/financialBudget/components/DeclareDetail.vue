<template>
  <div class="declareDetailWrap">
    <div v-if="!isExamine" class="declareDetailWrapLeft">
      <div class="btTitle">过去一年发生过费用的项目，预算金额默认为上一年同期的费用金额</div>
      <div v-if="!dataList||dataList.length==0">
        无
      </div>
      <div v-for="(item,index) in dataList" :key="index">
        <h4 class="defaultTitle">{{item.feeTitle}} <span style="color: #333;font-size: 13px">{{computedSum(item.bdList)|formatAmount}}元</span><el-button type="text" @click="takeHistoryLog(item.feeTitle)">查看历史记录</el-button></h4>
        <div class="itemWarp">
          <label v-for="(itm,index) in item.bdList" :key="index" :class="withdrawalState?'withdrawalState':''"><div>{{itm.feeName}}:</div>
            <el-input v-if="itm.foucs" type="number" :disabled="itm.allow||pageName==13" v-model="itm.amount" @blur="()=>onBlur(itm)"></el-input>
            <el-input  v-if="!itm.foucs" type="text" :disabled="itm.allow||pageName==13" :value="formatAmount(itm.amount)" @focus="()=>onfocus(itm)"></el-input>
          </label>
        </div>
      </div>
      <div class="btTitle">过去一年未发生过费用的项目，预算金额默认为零 <el-button type="text" @click="pushDeclare">填写</el-button></div>
      <template v-if="pushDeclareState">
        <div v-if="!wList||wList.length==0">
          无
        </div>
        <div v-for="(item,index) in wList" :key="item.feeTitle">
          <h4 class="defaultTitle">{{item.feeTitle}} <span style="color: #333;font-size: 13px">{{computedSum(item.bdList)|formatAmount}}元</span></h4>
          <div class="itemWarp">
            <label v-for="(itm,index) in item.bdList" :key="index" :class="withdrawalState?'withdrawalState':''">
              <div>{{itm.feeName}}:</div>
              <el-input v-if="itm.foucs" type="number" :disabled="itm.allow||pageName==13" v-model="itm.amount" @blur="()=>onBlur(itm)"></el-input>
              <el-input  v-if="!itm.foucs" type="text" :disabled="itm.allow||pageName==13" :value="formatAmount(itm.amount)" @focus="()=>onfocus(itm)"></el-input>
            </label>
          </div>
        </div>
      </template>
      <TotalDeclaration v-if="curPage==pageName" ref="totalDeclaration" :month="pageName" :budgetAmount="budgetAmount">
        <el-button size="mini"  type="primary" @click="takeHistoryLog('')" >查看全部历史记录</el-button>
      </TotalDeclaration>
    </div>
    <div v-if="isExamine" class="declareDetailWrapLeft">
      <div><el-checkbox v-model="allSelect" :true-label="1" :false-label="0" @change="(val)=>selectTeeName(val,'','dataList','all')">全选</el-checkbox></div>
      <div class="btTitle">过去一年发生过费用的项目，预算金额默认为上一年同期的费用金额 </div>
      <div v-if="!dataList||dataList.length==0">
        无
      </div>
      <div v-for="(item,index) in dataList" :key="index">
        <h4><el-checkbox v-model="item.allow" @change="(val)=>feeTitle(val,item.feeTitle,'dataList')" :true-label="1" :false-label="0">{{item.feeTitle}}</el-checkbox>
          <span style="color: #333;font-size: 13px" >{{computedSum(item.bdList)|formatAmount}}元</span><el-button type="text" @click="takeHistoryLog(item.feeTitle)">查看历史记录</el-button>
        </h4>
        <div class="itemWarp">
          <label v-for="(itm,index) in item.bdList" :key="index">
            <div >
              <el-checkbox v-model="itm.allow" :true-label="1" :false-label="0" @change="(val)=>selectTeeName(val,item.feeTitle,'dataList')">
              <span>{{itm.feeName}}:</span>
              </el-checkbox>
            </div>
            <el-input :disabled="pageName==13" v-if="itm.foucs" type="number" v-model="itm.amount" @blur="()=>onBlur(itm)"></el-input>
            <el-input :disabled="pageName==13" v-if="!itm.foucs" type="text"  :value="formatAmount(itm.amount)" @focus="()=>onfocus(itm)"></el-input>
          </label>
        </div>
      </div>
      <div class="btTitle">过去一年未发生过费用的项目，预算金额默认为零  <el-button type="text" @click="pushDeclare">填写</el-button></div>
      <template v-if="pushDeclareState">
        <div v-if="!wList||wList.length==0">
          无
        </div>
        <div v-for="(item,index) in wList" :key="item.feeTitle">
          <h4><el-checkbox v-model="item.allow" @change="(val)=>feeTitle(val,item.feeTitle,'wList')" :true-label="1" :false-label="0">{{item.feeTitle}}</el-checkbox>
            <span style="color: #333;font-size: 13px" >{{computedSum(item.bdList)|formatAmount}}元</span>
          </h4>
          <div class="itemWarp">
            <label v-for="(itm,index) in item.bdList" :key="index"><div><el-checkbox v-model="itm.allow" :true-label="1" :false-label="0" @change="(val)=>selectTeeName(val,item.feeTitle,'wList')"><span>{{itm.feeName}}:</span></el-checkbox></div>
              <el-input :disabled="pageName==13" v-if="itm.foucs" type="number" v-model="itm.amount" @blur="()=>onBlur(itm)"></el-input>
              <el-input :disabled="pageName==13" v-if="!itm.foucs" type="text"  :value="formatAmount(itm.amount)" @focus="()=>onfocus(itm)"></el-input>
            </label>
          </div>
        </div>
      </template>
      <TotalDeclaration v-if="curPage==pageName" :month="pageName" ref="totalDeclaration" :budgetAmount="budgetAmount">
        <el-button size="mini" type="primary" @click="takeHistoryLog('')" >查看全部历史记录</el-button>
      </TotalDeclaration>
    </div>
    <ExpenditureDetails :historyType="historyType" v-if="curPage==pageName"  :month="pageName" :dept-id="$route.query.deptId" :titleStr="$route.query.deptName" :orderAmount="1" :position="'relative'"></ExpenditureDetails>
  </div>
</template>

<script>
import TotalDeclaration from './TotalDeclaration.vue'
import ExpenditureDetails from './ExpenditureDetails'
import {getLanglist} from '@/utils'
import {formatAmount} from '@/utils/filters'
export default {
  props:{
    dataDetail:{

    },
    sendData:{
    },
    pageName:{

    },
    isExamine: {
      default: false
    }
  },
  name: "DeclareDetail",
  created() {
    if(this.$route.query.taskStatus&&this.$route.query.taskStatus.includes('退回')){
      this.withdrawalState=true
    }
  },
  data() {
    return {
      dataList:[],
      wList:[],
      curPage:'1',
      pushDeclareState:false,
      queryDetail: false,
      allSelect: 0,
      historyType:'',
      withdrawalState:false
    }
  },
  computed:{
    budgetAmount(){;
      if(this.dataList&&this.dataList.length&&this.wList){
        return getLanglist([...this.dataList, ...this.wList].map(item=>item.bdList)).map(item=>item.amount).reduce((pre,next) =>{
          if(!pre){
            pre=0
          }
          if(!next){
            next=0
          }
          return Number(pre) + Number(next)
        })
      } else if(this.wList&&this.wList.length){
        return getLanglist(this.wList.map(item=>item.bdList)).map(item=>item.amount).reduce((pre,next) =>{
          if(!pre){
            pre=0
          }
          if(!next){
            next=0
          }
          return Number(pre) + Number(next)
        })
      }else {
        return 0
      }
    }
  },
  methods: {
    onfocus(itm){
      this.$set(itm,'foucs',true)
    },
    onBlur(itm){
      this.$set(itm,'foucs',false)
      delete itm.focus
    },
    takeHistoryLog(feeTitle){
      this.historyType='100'
      this.$nextTick(()=>{
        this.historyType=feeTitle
      })

    },
    computedSum(arr){
      let newArr=arr.map(item=>item.amount).filter(item=>item)
      if(newArr.length){
        return newArr.reduce((pre,next)=>Number(pre)+Number(next))
      }else {
        return 0
      }

    },
    pushDeclare() {
      this.pushDeclareState =! this.pushDeclareState
    },
    selectTeeName(value,feeTitle,type,range){
      if(range&&range=='all'){
        this.dataList.forEach(item=>{
          this.$set(item,'allow',value)
          item.bdList.forEach(i=>{
            this.$set(i,'allow',value)
          })
        })
        if(this.wList.length){
          this.wList.forEach(item=>{
            this.$set(item,'allow',value)
            item.bdList.forEach(i=>{
              this.$set(i,'allow',value)
            })
          })
        }
        return
      }
      if(this[type].find(item=>item.feeTitle===feeTitle).bdList.filter(item=>item.allow).length===this[type].find(item=>item.feeTitle===feeTitle).bdList.length){
        this.$set(this[type].find(item=>item.feeTitle===feeTitle),'allow',1)
        this.checkAll()
      } else {
        this.$set(this[type].find(item=>item.feeTitle===feeTitle),'allow',0)
        this.allSelect=0
      }
    },
    feeTitle(value,feeTitle,type){
      if(value){
        this[type].find(item=>item.feeTitle===feeTitle).bdList.forEach(item=>{
          this.$set(item,'allow',1)
        })
      }else {
        this[type].find(item=>item.feeTitle===feeTitle).bdList.forEach(item=>{
          this.$set(item,'allow',0)
        })
      }
      this.checkAll()
    },
    checkAll(){
      if([ ...this.dataList, ...this.wList].length===[ ...this.dataList, ...this.wList].filter(item=>item.allow).length) {
        this.allSelect=1
      } else {
        this.allSelect=0
      }
    },
    formatAmount(amount) {
      return formatAmount(amount)
      // if (Number(amount)) {
      //   amount = '' + (Number(amount)+0.004).toFixed(2);
      //   var x = amount.split('.');
      //   var x1 = x[0];
      //   var x2 = '.' + x[1];
      //   var rgx = /(\d+)(\d{3})/;
      //   while (rgx.test(x1)) {
      //     x1 = x1.replace(rgx, '$1' + ',' + '$2');
      //   }
      //   return x1 + x2;
      // } else {
      //   return amount
      // }
      // return amount
    },
  },
  watch:{
    '$parent.$parent.$parent.activeName'(n){
      this.curPage=n
    },
    pushDeclareState(n){
      // if(n){
      //   this.$set(this,'wList', this.dataDetail.wList)
      //   // this.wList = this.dataDetail.wList
      //   if(Object.prototype.toString.call(this.wList).includes('Array')){
      //     this.wList.forEach(item=>{
      //       if(item.bdList){
      //         item.bdList.forEach(i=>{
      //           this.selectTeeName('value',item.feeTitle,'wList')
      //         })
      //       }
      //     })
      //   }
      //   if(this.wList.filter(item => !item.allow).length){
      //     this.allSelect=0
      //   }
      // } else {
      //   this.wList = []
      // }
    },
    dataDetail: {
      handler(n, o) {
        this.dataList = this.dataDetail.yList
        this.$set(this,'wList', this.dataDetail.wList)
        if (Object.prototype.toString.call(this.dataList).includes('Array')) {
          this.dataList.forEach(item => {
            if (item.bdList) {
              item.bdList.forEach(i => {
                this.selectTeeName('value', item.feeTitle, 'dataList')
              })
            }
          })
        }
        if(Object.prototype.toString.call(this.wList).includes('Array')){
          this.wList.forEach(item=>{
            if(item.bdList){
              item.bdList.forEach(i=>{
                this.selectTeeName('value',item.feeTitle,'wList')
              })
            }
          })
        }

      },
      deep: true,
      immediate: true
    },
    sendData: {
      handler(n, o) {
        if (n == 1) {
          this.$emit('getData', { data: [...this.dataList, this.wList], pageName: this.pageName, type: 'save' })
        }
        if(n == 2){
          this.$emit('getData', { data: [...this.dataList, this.wList], pageName: this.pageName,type: 'submit' })
        }
      },
    }
  },
  components:{
    ExpenditureDetails,
    TotalDeclaration
  }
}
</script>

<style lang="scss" scoped>
  h4{
    font-weight: 400;
    height: 30px;
  }
.itemWarp{
  border: 1px solid rgb(201, 201, 201);
  display: flex;
  flex-wrap:wrap;
  &>label:nth-child(5n){
    padding-right: 10px;
  }
  &>label{
    display: flex;
    box-sizing: border-box;
    padding: 5px 0 5px 10px;
    font-size: 16px;
    font-weight:400;
    align-items: center;
    width: 20%;
   &>div{
     display: flex;
     align-items: center;
     line-height: 19px;
     font-size: 12px;
     box-sizing: border-box;
      width:100px ;
     text-align: left;
    // padding-right: 10px;
     .el-checkbox{
       width: 100%;
       display: flex;
       align-items: center;
       /deep/ .el-checkbox__inner{
         vertical-align: inherit;
       }
     }
     span{
       display: inline-block;
       white-space:normal;
     }
    }

    .el-input{
      width: 108px;
      height: 25px;
     line-height: 25px;
      /deep/ .el-input__inner{
        height: 25px;
        line-height: 25px;
        padding: 0 5px;
     }
    }
  }
}
  .declareDetailWrap{
    display: flex;
    .declareDetailWrapLeft{
      width: 1426px;
      border: 1px solid rgb(201, 201, 201);
      padding: 20px;
      margin-right: 5px;
    }

  }
  .btTitle{
    margin: 10px 0;
  }
  .defaultTitle{
    line-height: 30px;
    font-size: 14px;
    color: #606266;
    font-weight: 500;
  }
  .withdrawalState{
    color: red;
  }
</style>
