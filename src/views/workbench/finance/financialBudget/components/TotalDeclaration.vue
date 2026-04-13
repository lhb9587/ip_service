<template>
    <div class="TotalDeclaration">
      <div>
        <span>共计申报:</span>
        <span>{{budgetAmount | formatAmount}}元</span>
        <el-button type="text" @click="takeTotal">金额汇总</el-button>
        <slot ></slot>
      </div>
      <el-dialog
        title="金额汇总"
        :visible.sync="takeTotalDeclaration"
        width="80%"
       >
        <el-table :data="levelThreeData" border>
          <el-table-column
            :label="item.feeName"
            :prop="item.feeName"
            v-for="item in levelThreeList"

          >
            <template slot="header" slot-scope="scope">
              <span @click="selectForth(scope)">
                {{item.feeName}}
              </span>
            </template>
            <template slot-scope="scope">
              <span  @click="selectForth(scope)">
                {{scope.row[item.feeName]}}
              </span>
            </template>
          </el-table-column>
        </el-table>
        <el-table :data="levelFourthData" border v-if="levelFourthData.length">
          <el-table-column
            :label="item.feeName"
            :prop="item.feeName"
            v-for="item in levelFourthList"

          >
            <template slot="header" slot-scope="scope">
              <span >
                {{item.feeName}}
              </span>
            </template>
            <template slot-scope="scope">
              <span  >
                {{scope.row[item.feeName]}}
              </span>
            </template>
          </el-table-column>
        </el-table>
        <p>日常费用共计:{{fourthTotalAmount.budgetAmount|formatAmount}}元</p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="takeTotalDeclaration = false">取 消</el-button>
          <el-button type="primary" @click="takeTotalDeclaration = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
import { queryBudgetByFeetId,queryBudgetDetailSum } from '@/api/caseList'
import Bus from '../../../../../utils/Bus'
export default {
  name: "TotalDeclaration",
  props:{
    month:{

    },
    budgetAmount: {

    }
  },
  created(){

    //this.queryBudgetByFeetId(this.$route.query.deptId,this.month)
  },
  mounted(){
    Bus.$on('saveOver', context => {
      if(this.month==context){
        this.takeTotalDeclaration = true
      }
    })
  },
  data(){
    return {
      takeTotalDeclaration: false,
      levelThreeList:[],
      totalAmount:{},
      levelThreeData:[],
      fourthTotalAmount:{},
      levelFourthList:[],
      levelFourthData:[]
    }
  },
  methods:{
    takeTotal(){
      Bus.$emit('startSave',this.month)
    },
    queryBudgetByFeetId(feetId,month){
      queryBudgetByFeetId({ feetId, month ,deptId: this.$route.query.deptId}).then(res=>{
        this.levelFourthData=[]
        this.fourthTotalAmount = res.data.splice(res.data.length-1,1)[0]
        // this.levelThreeData=res.data.map(item=>)
        var obj={}
        res.data.forEach(item=>{
          obj[item.feeName]=item.amount
          obj[item.feeName+'feetId']=item.feetId
        })
        this.$nextTick(()=>{
          this.levelFourthList = res.data
          this.levelFourthData=[obj]
        })


        // this.$forceUpdate()
        // console.log(this.levelFourthData,this.levelFourthList);
      })
    },
    selectForth({ column }){
      this.queryBudgetByFeetId(this.levelThreeData[0][column.label+'feetId'],this.month )
    },
    queryBudgetDetailSum(deptId, month){
      queryBudgetDetailSum({ deptId, month }).then(res=>{
        this.totalAmount=res.data.splice(res.data.length-1,1)[0]
        this.levelThreeList = res.data
       // this.levelThreeData=res.data.map(item=>)
        var obj={}
        res.data.forEach(item=>{
          obj[item.feeName]=item.amount
          obj[item.feeName+'feetId']=item.feetId
        })
        this.levelThreeData=[obj]
        this.queryBudgetByFeetId(this.levelThreeList[0].feetId,this.month )
      })
    }
  },
  watch:{
    takeTotalDeclaration(n){
      if(n){
        this.queryBudgetDetailSum(this.$route.query.deptId,this.month)
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.el-table{
  margin-top: 10px;
}
</style>
