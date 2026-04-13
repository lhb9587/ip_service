<template>
  <el-row>
    <el-form-item label="提醒计划:" prop="rempId" >
      <div style="display:flex;">

      <div style="flex: 1">
            <el-select v-model="rempId" :popper-append-to-body="false" :disabled="type" placeholder="请选择提醒计划" filterable
                       clearable @change="(v)=>{changeRempId(v, true)}">
              <el-option
                v-for="item in remindPlanList"
                :key="item.rempId"
                :label="limitFormat(item)"
                :value="item.rempId">
                <span>
                  {{ item.planName }}
                </span>
              </el-option>
            </el-select>
<!--              <p style="color: red;font-size: 12px" v-if="!planList.length" v-show="!type">如果需要修改为该计划,请点击生成</p>-->
      </div>
      <div style="display: flex">
<!--        <el-button size="small" @click="getRemindPlan(rempId)" v-if="!type">查看</el-button>-->
        <el-button size="small" @click="modifyPlanList">{{type?'查看':'修改'}}</el-button>
      </div>
      </div>
    </el-form-item>
    <el-dialog
      top="0"
      :visible.sync="dialogVisible"
      width="80%"
      :modal="false"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      append-to-body
      :lock-scroll="false"
      title="提醒计划"
      v-dialogDrag
      center
    >
      <el-button size="small" v-if="!type" @click="addCurrentRemindPlan">添加</el-button>
      <el-table :key="key" :data="planList" height="600">
        <el-table-column property="cycleNotice" label="提醒方式(周期提醒)" width="150">
          <template slot-scope="scope">
            <span v-if="scope.row[scope.column.property]">是</span>
            <span  v-else>否</span>
<!--            <el-checkbox  :disabled="type" v-model="scope.row[scope.column.property]"></el-checkbox>-->
          </template>
        </el-table-column>

        <el-table-column property="startDate" label="开始时间" width="200">
          <template slot-scope="scope">
            <span v-if="type">{{scope.row[scope.column.property]}}</span>
            <el-date-picker
              v-model="scope.row[scope.column.property]"
              type="date"
              v-else
              :disabled="!scope.row['cycleNotice']"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </template>
        </el-table-column>
        <!-- <el-table-column property="daysEarlier" label="周期提醒提前天数" width="150"> -->
          <!-- <template slot-scope="scope"> -->
            <!-- <span v-if="type">{{scope.row[scope.column.property]}}</span> -->
            <!-- <el-input  v-else :disabled="!scope.row['cycleNotice']" v-model="scope.row[scope.column.property]"></el-input> -->
          <!-- </template> -->
        <!-- </el-table-column> -->
        <el-table-column property="aheadDays" label="提醒间隔" width="100">
          <template slot-scope="scope">
            <span v-if="type">{{scope.row[scope.column.property]}}</span>
            <el-input  v-else :disabled="!scope.row['cycleNotice']" v-model="scope.row[scope.column.property]"></el-input>
          </template>
        </el-table-column>
        <el-table-column property="remindOnce" label="提前天数" width="100">
          <template slot-scope="scope">
            <span v-if="type">{{scope.row[scope.column.property]}}</span>
            <el-input v-else :disabled="scope.row['cycleNotice']" v-model="scope.row[scope.column.property]"></el-input>

          </template>
        </el-table-column>
        <el-table-column property="userIdList" label="提醒人" width="350" >
          <template slot-scope="scope">
            <virtual-select class="virtual-select" :isUser="true" clearable multiple :disabled="true"  :data="$store.getters.userList" v-model="scope.row[scope.column.property]"   filterable :render="(data)=>$commonUtils.UserRender(data,this)" >
            </virtual-select>
<!--            <el-select v-model="scope.row[scope.column.property]" placeholder="请选择时限成员" filterable-->
<!--                       multiple  :disabled="type" clearable >-->
<!--              <el-option-->
<!--                v-for="item in queryGetUserList"-->
<!--                :key="item.userId"-->
<!--                :label="item.fullname"-->
<!--                :value="item.userId">-->
<!--                <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>-->
<!--              </el-option>-->
<!--            </el-select>-->
          </template>
        </el-table-column>
        <el-table-column property="wechatNotice" label="企信提醒" width="100">
          <template slot-scope="scope">
            <el-checkbox   :disabled="type" v-model="scope.row[scope.column.property]"></el-checkbox>

          </template>
        </el-table-column>
        <el-table-column property="emailNotice" label="邮件提醒" width="100">
          <template slot-scope="scope">
            <el-checkbox  :disabled="type"  v-model="scope.row[scope.column.property]"></el-checkbox>
          </template>
        </el-table-column>

        <el-table-column property="emailNotice" label="操作" v-if="!type">
          <template slot-scope="scope">
           <el-button type="text" @click="planList.splice(scope.$index,1)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmData">确 定</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>

<script>
  import {queryRemindPlan,getRemindPlan} from '@/api/caseList'
export default {
  name: "planList",
  props:{
    isEdit: {
      type: Boolean,
      default: false
    },
    timelimitInfo:{

    },
    queryGetUserList:{

    },
    type:{
      type: Boolean,
      default: false
    }
  },
  created() {
    this.queryRemindPlan()
    // if(this.timelimitInfo.rempId){
    //   this.getRemindPlan(this.timelimitInfo.rempId, true)
    // }
  },
  watch:{
    'timelimitInfo.planList':{
      handler(n){
        if (n) {
         this.planList = JSON.parse(JSON.stringify(n))
        }
      },
      immediate: true,
      deep:true
    },
    timelimitInfo:{
      handler(n,o){
        if(this.timelimitInfo.planList&&this.timelimitInfo.planList.length){
          // this.planList = JSON.parse(JSON.stringify(this.timelimitInfo.planList))
          this.planList.forEach((item, index)=>{
            if(item.remindOnce >= 0 && item.remindOnce !== undefined && item.remindOnce !== '' && item.remindOnce !== null){
              this.$set(item,'cycleNotice',false)
            } else {
              this.$set(item,'cycleNotice',true)
            }
          })
        }
        this.rempId=this.timelimitInfo.rempId
        this.rempIdBack=this.timelimitInfo.rempId
      },
      deep:true,
      immediate:true
    },
    // 'timelimitInfo.rempId': {
    //   handler() {
    //     this.changeRempId(this.timelimitInfo.rempId, true)
    //   }
    // }
  },
  data(){
    return{
      rempIdBack: '',
      key: false,
      remindPlanList:[],
      rempId:null,
      planList:[],
      dialogVisible:false,
      names:'数据的路口附近'
    }
  },
  methods:{
    limitFormat(value){
      const formatSuffix = this.planList.map(detail => detail.remindOnce).join('/')
      if(formatSuffix){
        const name = value.planName.replace(/\（.*?\）/g, '').trim();
        return name + '(' + formatSuffix + ')'
      }else{
        return value.planName
      }
    },
    changeRempId(v, flag){
      if (!v) {
        if (this.isEdit) {
          this.$confirm('该操作将删除所有提醒计划，是否继续?', '提示', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
            this.planList = []
            this.$emit('getData',{planList:this.planList,rempId:this.rempId})
            this.rempIdBack = v
          }).catch(() => {
            this.rempId = this.rempIdBack
          })
        } else {
          this.planList = []
          this.$emit('getData',{planList:this.planList,rempId:this.rempId})
          this.rempIdBack = v
        }
      } else {
        this.getRemindPlan(v, flag)
        this.rempIdBack = v
      }
    },
    queryRemindPlan(){
      queryRemindPlan().then(res=>{
        this.remindPlanList=res.data
      })
    },
    addCurrentRemindPlan(){
        this.$confirm('该条时限提醒是否为周期提醒?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          distinguishCancelAndClose:true
        }).then(() => {

          this.planList.push({
            remindOnce:null, startDate:null ,aheadDays :null,wechatNotice:false, emailNotice:false,
            userIdList:this.timelimitInfo.workgroupArray.reduce((pre,next)=>{
              return [...pre,...next.timelimitUserArray]
            },[]),
            cycleNotice:true
          })
        }).catch((action ) => {
          if(action=='cancel'){
            this.planList.push({
              remindOnce: 0, startDate:null ,aheadDays :null,wechatNotice:false, emailNotice:false,
              userIdList:this.timelimitInfo.workgroupArray.reduce((pre,next)=>{
                return [...pre,...next.timelimitUserArray]
              },[]),
              cycleNotice:false
            })
          }
        });
    },
    modifyPlanList(){
      this.key = !this.key
      this.dialogVisible=true
    },
    changePeople(n){
      this.$nextTick(() => {
        this.planList.forEach(item=>{
          // this.timelimitInfo.workgroupArray = n
          item.userIdList = [...new Set(n.filter(item=>item.timelimitUserArray).reduce((pre,next)=>{
            return [...pre,...next.timelimitUserArray]
          },[]))]
          this.key = !this.key
        })
        this.confirmData()
      })
    },
    getRemindPlan(rempId, flag=false){
      if(!rempId){
        this.$message.warning('请选择提醒计划后再点击生成')
        return
      }
      getRemindPlan({rempId, tltId: this.timelimitInfo.tltId}).then(res=>{
        this.planList = res.data.planDetailsList
        this.planList.forEach((item, index)=>{
            if(item.remindOnce >= 0 && item.remindOnce !== undefined && item.remindOnce !== '' && item.remindOnce !== null){
              this.$set(item,'cycleNotice',false)
            } else {
              this.$set(item,'cycleNotice',true)
            }
          })
        // console.log(this.timelimitInfo.workgroupArray);
        this.planList.forEach(item=>{
          item.userIdList = [...new Set(this.timelimitInfo.workgroupArray.reduce((pre,next)=>{
            return [...pre,...next.timelimitUserArray]
          },[]))]
          // console.log(item.userIdList);

        })
        if(flag){
          this.confirmData()
        }else{
          this.dialogVisible=true
        }
      })
      // this.$confirm('该操作将会将该原始计划应用于当前时限, 是否继续?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   if(rempId){
      //     getRemindPlan({rempId}).then(res=>{
      //       this.planList=res.data.planDetailsList
      //       // console.log(this.timelimitInfo.workgroupArray);
      //       this.planList.forEach(item=>{
      //         item.userIdList=this.timelimitInfo.workgroupArray.reduce((pre,next)=>{
      //           return [...pre,...next.timelimitUserArray]
      //         },[])
      //         // console.log(item.userIdList);
      //
      //       })
      //     })
      //   }else {
      //     this.planList=[]
      //   }
      //   this.dialogVisible=true
      // }).catch(() => {
      //
      // })
    },
    confirmData(){
      if (this.planList.find(item => item.remindOnce < 0)) {
        this.$message.error('提前天数不能为负数!')
        return
      }
      if (this.planList.find(item => item.cycleNotice && !item.startDate)) {
        this.$message.error('周期提醒的开始时间不能为空!')
        return
      }
      if (this.planList.find(item => item.cycleNotice && !item.aheadDays)) {
        this.$message.error('周期提醒的间隔时间不能为空!')
        return
      }
      if (this.planList.find(item => item.cycleNotice && (!item.wechatNotice && !item.emailNotice))) {
        this.$message.error('请选择周期提醒方式!')
        return
      }
      this.$emit('getData',{planList:this.planList,rempId:this.rempId})
      this.dialogVisible=false
    }
  }
}
</script>

<style lang="scss" scoped>
.virtual-select/deep/{
  .jh-virtual-select{
    height: auto;
    width: 100%;
  }
}
.el-row{
    .el-select,.el-input,.el-date-picker,.el-textarea{
        width: 95%;
      }
      min-height: 30px;
      width: 100%;
      display: flex;
     // align-items: center;
      .el-form-item{
        width: 100%;
        display: flex;
        border: 1px solid #EBEEF5;
        border-bottom: 0;
        margin-bottom: 0;
        /deep/ .el-form-item__label{
          background: #f5f7fa;
        }
        /deep/ .el-form-item__content{
          margin-left: 0 !important;
          padding-left: 10px;
          background: #fff;
          flex: 1;
        }

      }
      .sendDate /deep/{
        .el-form-item__label,input{
          color: blue;
        }
      }
      .abslimitDate /deep/{
        .el-form-item__label,input{
          color: red;
        }
      }
      .small-el-form-item-prev:before{
        content: '';
        width: 50%;
        height: 1px;
        background: #EBEEF5;
        position: absolute;
        bottom: -1px;
        right: 0;
        z-index: 1;
      }
      .small-el-form-item{
        position: relative;
        width: 50%;
        /deep/ .el-form-item__content{
          flex: 1;
          .pad20{
            padding-left: 20px;
          }
        }
      }
    }
.el-table{
  /*overflow: visible;*/
  /deep/ .cell{
    /*overflow: visible;*/

  }
  /deep/.el-date-editor{
    width: 100%;
    .el-icon-date{
      display: none;

    }
    .el-input__inner{
      padding: 0;
      padding-left: 10px;
    }
  }
  /deep/ .el-table__body-wrapper{
    /*overflow: visible;*/
  }
  /deep/ th{
    /*color: rgba(51, 51, 51, 1);*/

  }

}

</style>
