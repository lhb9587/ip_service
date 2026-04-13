<template>
  <el-dialog title="提醒计划配置" :visible.sync="dialogFormVisible" width="80%" top="10vh">
    <div class="flexAble">

      <div class="el-radio-group—wrap">
        <el-button size="small" @click="addRemindPlan">添加</el-button>
        <el-radio-group v-model="rempId" @change="getRemindPlan">
          <div class="el-radio-button_wrap" v-for="item in remindPlanList" @contextmenu="rowContextmenu(item)">
            <el-input v-if="item.modifyState"  v-model="item.planName" @blur="blurPlanName(item)"></el-input>
            <el-radio-button   v-else :label="item.rempId" >{{item.planName}}</el-radio-button>
<!--            <div class="button_wrap">-->
<!--              <el-button type="text" class="el-icon-edit"></el-button>-->
<!--              <el-button type="text" class="el-icon-delete"></el-button>-->
<!--            </div>-->

          </div>
        </el-radio-group>
      </div>

      <div style="flex: 1;margin-left: 10px">
        <el-button size="small" @click="addCurrentRemindPlan">添加</el-button> <el-button size="small" @click="modifyRemindPlan">保存</el-button>
     <el-table :data="currentRemindPlan" height="600">
       <el-table-column property="aheadReminder" label="提醒间隔" >
         <template slot-scope="scope">
           <el-input v-model="scope.row[scope.column.property]"></el-input>
         </template>
       </el-table-column>
       <!-- <el-table-column property="daysEarlier" label="周期提醒提前天数" > -->
         <!-- <template slot-scope="scope"> -->
           <!-- <el-input v-model="scope.row[scope.column.property]"></el-input> -->
         <!-- </template> -->
       <!-- </el-table-column> -->
       <el-table-column property="remindOnce" label="提前天数" >
         <template slot-scope="scope">
           <el-input v-model="scope.row[scope.column.property]"></el-input>
         </template>
       </el-table-column>
       <el-table-column property="wechatNotice" label="是否企业微信提醒" >
         <template slot-scope="scope">
           <el-checkbox   :true-label="true" :false-label="false" v-model="scope.row[scope.column.property]"></el-checkbox>
         </template>
       </el-table-column>
       <el-table-column property="emailNotice" label="邮件提醒" >
         <template slot-scope="scope">
           <el-checkbox  :true-label="true" :false-label="false" v-model="scope.row[scope.column.property]"></el-checkbox>
         </template>
       </el-table-column>
     </el-table>
      </div>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible=false">取 消</el-button>
      <el-button type="primary" @click="modifyRemindPlan(1)">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {queryRemindPlan, getRemindPlan, addRemindPlan, modifyRemindPlan ,deleteRemindPlan} from '@/api/caseList'
export default {
  name: "RemindPlan",
  data(){
    return{
      remindPlanList:[],
      rempId:null,
      dialogFormVisible:false,
      currentRemindPlan:[],
      modifyState:false
    }
  },
  watch:{
    dialogFormVisible(n){
      if(!n){
        this.$emit('cancel')
      }
    }
  },
  created(){
    this.dialogFormVisible=true
    this.queryRemindPlan(1)
  },

  methods:{
    rowContextmenu(row){
      const that=this
      this.$ContextMenu({
        event, // 传入鼠标事件
        menu:this.getRowContextmenuList(row)
      }).then(rs => {
        this[rs](row)
      });
    },
    addRemindPlan(){
      addRemindPlan({planName:`新方案${this.remindPlanList.length}`}).then(res=>{
        this.queryRemindPlan()
      })
    },
    modify(row){
      this.$set(row,'modifyState',true)
    },
    deletePlan(row){
      this.$confirm('确定要删除该计划吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRemindPlan({rempId:row.rempId}).then(res=>{
          this.remindPlanList=this.remindPlanList.filter(item=>item.rempId!==row.rempId)
          if(row.rempId==this.rempId){
            this.currentRemindPlan=[]
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    blurPlanName(item){
      modifyRemindPlan({planName:item.planName,rempId:item.rempId}).then(res=>{
        item.modifyState=false
      })
    },
    getRowContextmenuList(row){
      return [
        { name: '修改', action: 'modify', permissions:126, },
        { name: '删除', action: 'deletePlan', permissions:127,},
      ].filter(item=>{
        if(item.permissions){
          return this.$store.getters.permissions.includes(item.permissions)
        }else {
          return true
        }
      })
    },
    queryRemindPlan(type){
      queryRemindPlan().then(res=>{
        this.remindPlanList=res.data
        if(type){
          this.rempId=res.data[0].rempId
          this.getRemindPlan(this.rempId)
        }
      })
    },
    getRemindPlan(rempId){
      getRemindPlan({rempId}).then(res=>{
        this.currentRemindPlan=res.data.planDetailsList
      })
    },
    modifyRemindPlan(type){
      modifyRemindPlan({rempId:this.rempId,planDetailsList:this.currentRemindPlan}).then(res=>{
        this.$message.success('保存成功')
        if(type===1){
          this.dialogFormVisible=false
        }

      })
    },
    addCurrentRemindPlan(){
      this.currentRemindPlan.push({
        remindOnce:null, daysEarlier:null ,aheadReminder :null,wechatNotice:false, emailNotice:false,
      })
    }
  }
}
</script>

<style lang="scss" scoped>

  .el-radio-group—wrap{
    .el-radio-group{
      display: flex;
      flex-wrap:wrap ;
      width: 200px;
      /deep/ .el-input__inner{ border: 1px solid #333};
      .el-radio-button_wrap{
        display: flex;
        /*justify-content: flex-end;*/
        justify-content: space-between;
        width: 100%;
        margin-top: 10px;
        .el-radio-button{
          max-width: 200px;
        }
        .button_wrap{
          /*display: flex;*/
          /*flex-direction:column ;*/
          /*justify-content: space-around;*/
        }
      }
    }
  }
  .flexAble{
    display: flex;

  }
  .el-table{
    /deep/  .el-input{
      line-height: 28px;
       .el-input__inner{
        height: 28px;
        line-height: 28px;
      }
    }
  }
</style>
