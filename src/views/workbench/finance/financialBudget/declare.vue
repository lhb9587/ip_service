<template>
  <div style="padding: 5px">
    <h4>{{$route.meta.title}}</h4>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="2010年1月" :name="item" v-for="item in ['1','2','3','4','5','6','7','8','9','10','11','12','13']">
        <span slot="label">
          <!--<el-checkbox ref="checkbox" v-model="allSelectList" v-if="$route.query.examine&&item==activeName" @change="(val)=>changeAllSelect(val,item)"></el-checkbox>-->
          <span v-if="item!=13">{{year}}年{{item}}月</span>
          <span v-if="item==13">{{year}}年预算总金额</span>
          <el-dropdown @command="(e)=>handleCommand(e,item)" trigger="click">
            <span class="el-dropdown-link">
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="复制">复制</el-dropdown-item>
              <el-dropdown-item command="粘贴">粘贴</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> </span><DeclareDetail :isExamine="$route.query.examine" :ref="`DeclareDetail${item}`" :deptId="$route.query.deptId" :page-name="item" :dataDetail="dataObj['dataList'+item]"  @getData="getData"></DeclareDetail></el-tab-pane>
      <!--<el-tab-pane label="2010年2月" name="2">-->
       <!--<span slot="label">-->
          <!--2010年2月-->
          <!--<el-dropdown @command="(e)=>handleCommand(e,'2')">-->
            <!--<span class="el-dropdown-link">-->
              <!--<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
            <!--</span>-->
            <!--<el-dropdown-menu slot="dropdown">-->
              <!--<el-dropdown-item command="复制">复制</el-dropdown-item>-->
              <!--<el-dropdown-item command="粘贴">粘贴</el-dropdown-item>-->
            <!--</el-dropdown-menu>-->
          <!--</el-dropdown> </span><DeclareDetail  ref="DeclareDetail2" :page-name="'2'" :dataDetail="dataList2" :sendData="sendData2" @getData="getData"></DeclareDetail></el-tab-pane>-->
      <!--<el-tab-pane label="2010年3月" name="3"><DeclareDetail :page-name="'3'" :dataDetail="dataList3" :sendData="sendData3" @getData="getData"></DeclareDetail></el-tab-pane>-->
      <!--<el-tab-pane label="2010年4月" name="4"><DeclareDetail  :page-name="'4'" :dataDetail="dataList4" :sendData="sendData4" @getData="getData"></DeclareDetail></el-tab-pane>-->
      <!--<el-tab-pane label="2010年5月" name="5"><DeclareDetail :page-name="'5'"  :dataDetail="dataList5" :sendData="sendData5" @getData="getData"></DeclareDetail></el-tab-pane>-->
      <!--<el-tab-pane label="2010年6月" name="6"><DeclareDetail :page-name="'6'" :dataDetail="dataList6" :sendData="sendData6" @getData="getData"></DeclareDetail></el-tab-pane>-->
      <!--<el-tab-pane label="2010年7月" name="7"><DeclareDetail :page-name="'7'" :dataDetail="dataList7" :sendData="sendData7" @getData="getData"></DeclareDetail></el-tab-pane>-->
      <!--<el-tab-pane label="2010年8月" name="8"><DeclareDetail :page-name="'8'" :dataDetail="dataList8" :sendData="sendData8" @getData="getData"></DeclareDetail></el-tab-pane>-->
      <!--<el-tab-pane label="2010年9月" name="9"><DeclareDetail :page-name="'9'" :dataDetail="dataList9" :sendData="sendData9" @getData="getData"></DeclareDetail></el-tab-pane>-->
      <!--<el-tab-pane label="2010年10月" name="10"><DeclareDetail :page-name="'10'" :dataDetail="dataList10" :sendData="sendData10" @getData="getData"></DeclareDetail></el-tab-pane>-->
      <!--<el-tab-pane label="2010年11月" name="11"><DeclareDetail :page-name="'11'" :dataDetail="dataList11" :sendData="sendData11" @getData="getData"></DeclareDetail></el-tab-pane>-->
      <!--<el-tab-pane label="2010年12月" name="12"><DeclareDetail :page-name="'12'" :dataDetail="dataList12" :sendData="sendData12" @getData="getData"></DeclareDetail></el-tab-pane>-->
      <!--<el-tab-pane label="总预算金额" name="13"><DeclareDetail :page-name="'13'" :dataDetail="dataList13" :sendData="sendData13" @getData="getData"></DeclareDetail></el-tab-pane>-->
    </el-tabs>
    <footer v-if="!$route.query.examine">
    <el-button type="primary" @click="saveBudget(1)" size="mini">保存</el-button>
    <el-button type="primary" @click="submitBudget" size="mini">提交审核</el-button>
    <el-button @click="cancel" size="mini">取消</el-button>
    </footer>
    <footer v-if="$route.query.examine">
      <!--<el-button type="primary" @click="saveBudget">保存</el-button>-->
      <el-button type="primary" @click="auditBudget(1)" size="mini">审核完成</el-button>
      <el-button type="primary" @click="dialogVisible=true" size="mini">退回</el-button>
      <el-button @click="cancel" size="mini">取消</el-button>
    </footer>
    <el-dialog
      title="退回原因"
      :visible.sync="dialogVisible"
      width="50%">
      <el-input
        type="textarea"
        :rows="5"
        placeholder="请输入内容"
        v-model="textarea">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="auditBudget(2)">确定</el-button>
       </span>
    </el-dialog>
  </div>
</template>

<script>
import { createBudget, queryBudget, queryBudgetByFeetId, queryFeeType,saveBudget,submitBudget,auditBudget} from '@/api/caseList'
import DeclareDetail from './components/DeclareDetail'
import { getLanglist} from "@/utils";
import Bus from '@/utils/Bus'
export default {
  name: "declare",
  data() {
    return {
      textarea:'',
      dialogVisible:false,
      activeName:'0',
      year:'',
      dataObj:{
        dataList1:[],
        dataList2:[],
        dataList3:[],
        dataList4:[],
        dataList5:[],
        dataList6:[],
        dataList7:[],
        dataList8:[],
        dataList9:[],
        dataList10:[],
        dataList11:[],
        dataList12:[],
        dataList13:[],
        sendData1: 0,
        sendData2: 0,
        sendData3: 0,
        sendData4: 0,
        sendData5: 0,
        sendData6: 0,
        sendData7: 0,
        sendData8: 0,
        sendData9: 0,
        sendData10: 0,
        sendData11: 0,
        sendData12: 0,
        sendData13: 0,
      },
      budgetList:[],
      clipboardList:[],
      clipboardWList:[],
      clipboardPageState:false,
      activeNameList:[],
      allSelectList: false,
      oldActiveName:0,
      preList:['1']
    }
  },
  mounted(){
    Bus.$on('startSave', async content => {
      await this.saveBudget(1)
      Bus.$emit('saveOver',content)
    });
  },
  created() {
    if(this.$route.query.modify){
      this.queryBudget(this.$route.query,1)
      return
    }
    if(this.$route.query.examine){
      this.queryBudget(this.$route.query,1)
      return
    }
    this.createBudget()
  },
  methods:{
    changeAllSelect(val,activeName){
      // this.$set(this.allSelectList,activeName-1,val)
      // this.allSelectList.push({})
      // this.allSelectList.pop()
      this.$forceUpdate()
    },
    handleCommand(e,month){
      if(e=='复制'){
        this.clipboardPageState=this.$refs['DeclareDetail'+month][0].pushDeclareState
        if(this.clipboardPageState){
          this.clipboardList=getLanglist(this.$refs['DeclareDetail'+month][0].dataList.map(item=>item.bdList))
          this.clipboardWList=getLanglist(this.$refs['DeclareDetail'+month][0].wList.map(item=>item.bdList))
        } else {
          this.clipboardList=getLanglist(this.$refs['DeclareDetail'+month][0].dataList.map(item=>item.bdList))
          this.clipboardWList=[]
        }
      }
      if(e == '粘贴') {
        this.$refs['DeclareDetail' + month][0].pushDeclareState = this.clipboardPageState
        if (!this.clipboardPageState) {
          this.dataObj['dataList'+month].yList.forEach(item=>{
            this.clipboardList.forEach(itm=>{
              item.bdList.forEach(i=>{
                if(itm.feeName===i.feeName){
                  this.$set(i,'amount',itm.amount)
                  //i.amount= itm.amount
                }
              })
            })
          })
        }else {
          this.dataObj['dataList'+month].yList.forEach(item=>{
            this.clipboardList.forEach(itm=>{
              item.bdList.forEach(i=>{
                if(itm.feeName===i.feeName){
                  this.$set(i,'amount',itm.amount)
                }
              })
            })
          })
          this.dataObj['dataList'+month].wList.forEach(item=>{
            this.clipboardWList.forEach(itm=>{
              item.bdList.forEach(i=>{
                if(itm.feeName===i.feeName){
                  this.$set(i,'amount',itm.amount)
                }
              })
            })
          })
        }
      }
    },
   async handleClick(e){
      // if(e.name==this.activeName){
      //   return
      // }
     this.preList.push(e.name)
      await this.saveBudget()
      if(this.activeNameList.includes(e.name)){
        return
      }
      this.queryBudget(this.$route.query,e.name)
    },
    createBudget(){
      createBudget({deptId:this.$route.query.deptId}).then(res=>{
        this.dataObj['dataList1']=res.data
        this.activeName='1'
        this.activeNameList.push('1'.toString())
        this.year=res.data.year
      })
    },
    queryBudget({deptName,year},month){
      queryBudget({year,month,deptId:this.$route.query.deptId}).then(res=>{
        this.dataObj['dataList'+month]=res.data
        this.activeName=month.toString()
        if(month!=13){
          this.activeNameList.push(month.toString())
        }
        this.year=res.data.year
      })
    },
    // queryFeeType({deptName,year},month){
    //   queryFeeType({deptName,year,month,deptId:141}).then(res=>{
    //     this['dataList'+month]=res.data
    //     this.activeName='1'
    //   })
    // },

   async submitBudget(){
       await this.saveBudget(1)
       submitBudget({ deptId:this.$route.query.deptId }).then(res=>{
         this.$router.go(-1)
       })
      //this.changeSendDataState(2)
    },
    async auditBudget(e){
      if(e==1){
        await this.saveBudget(1)
        auditBudget({ deptId: this.$route.query.deptId,result:1 }).then(res=>{
          this.$router.go(-1)
        })
      } else if(e==2){
        await this.saveBudget(1)
        if(!this.textarea.trim()){
          this.$message.error('请填写退回原因')
          return
        }
        auditBudget({ deptId:this.$route.query.deptId,result:0 ,reason:this.textarea}).then(res=>{
          this.$router.go(-1)
        })
      }

    },
    saveBudget(type){
      var index=0
      if(type==1) {
        index = this.preList[this.preList.length - 1]
      }else{
        index = this.preList[this.preList.length - 2]
      }
      if(index==13||index==0){
        return
      }
      var arr=[]
      if(this.$refs['DeclareDetail'+index][0].dataList&&this.$refs['DeclareDetail'+index][0].dataList.length){

        arr = arr.concat([...this.$refs['DeclareDetail'+index][0].dataList.map(item=>item.bdList),...this.$refs['DeclareDetail'+index][0].wList.map(item=>item.bdList)])
      }else if(this.$refs['DeclareDetail'+index][0].wList&&this.$refs['DeclareDetail'+index][0].wList.length){
        arr = arr.concat(this.$refs['DeclareDetail'+index][0].wList.map(item=>item.bdList))
      }

      // for(var i=1;i<=13;i++){
      //   if(this.$refs['DeclareDetail'+i][0].dataList&&this.$refs['DeclareDetail'+i][0].dataList.length){
      //
      //     arr = arr.concat([...this.$refs['DeclareDetail'+i][0].dataList.map(item=>item.bdList),...this.$refs['DeclareDetail'+i][0].wList.map(item=>item.bdList)])
      //   }else if(this.$refs['DeclareDetail'+i][0].wList&&this.$refs['DeclareDetail'+i][0].wList.length){
      //     arr = arr.concat(this.$refs['DeclareDetail'+i][0].wList.map(item=>item.bdList))
      //   }
      // }
      if(getLanglist(arr).length){
        return saveBudget({ deptId: this.$route.query.deptId,year:this.year, budgetList: getLanglist(arr) })
      } else {
        return
      }
    },
    cancel(){
      this.$router.history.go(-1)
    },
    getData({data,pageName,type}){
      this['sendData'+pageName] = 0
      if(data&&type=='save') {
        saveBudget({deptId: 141, year: 2020, budgetList: getLanglist(data.map(item => item.bdList))}).then(res => {

        })
      }
      // }else {
      //   submitBudget({ deptId:141,year:2020,budgetList:getLanglist(data.map(item=>item.bdList))}).then(res=>{
      //
      //   })
      // }
    },
    changeSendDataState(e){
      for(var i=1;i<=13;i++){
        if(e){
          this['sendData'+i]=e
        }
      }
    }
  },
  components:{
    DeclareDetail
  },
  watch:{
    activeName(n,o){
      console.log(n, o,'****');
      // this.oldActiveName=Number(o)+1
      // console.log(this.oldActiveName);
      this.$nextTick(()=>{
        // console.log(this.$refs.checkbox[0].focus=true);
      })

    }
  }

}
</script>

<style lang="scss" scoped>
.el-checkbox{
  /*margin-right: 0;*/
}
footer{
  display: block;
  margin-top: 10px;
  text-align: right;
}
</style>
