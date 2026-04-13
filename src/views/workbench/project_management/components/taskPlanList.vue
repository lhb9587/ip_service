<template>
  <div>
    <el-dialog
      top="0"
      :visible.sync="visible"
      width="80%"
      :modal="false"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      append-to-body
      :lock-scroll="false"
      title="任务提醒计划"
      v-dialogDrag
      center
    >
      <el-button size="small" v-if="!type" @click="addCurrentRemindPlan">添加</el-button>
      <el-table :data="planList" height="600">
        <el-table-column property="ifRemind" label="是否提醒" width="150">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row[scope.column.property]"
             :true-label="1"
            :false-label="0"
            ></el-checkbox>

          </template>
        </el-table-column>
        <el-table-column property="remindType" label="提醒类型" width="150">
          <template slot-scope="scope">
            <el-select v-model="scope.row[scope.column.property]" :clearable="true" default-first-option filterable placeholder="请选择" >
              <el-option  v-for="(item,key) in [{label:'截止日期提醒',value:1},{label:'内容修改提醒',value:2}]"   :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </template>
        </el-table-column>

<!--        <el-table-column property="endDate" label="任务截止日期" width="200">-->
<!--          <template slot-scope="scope">-->
<!--            <span v-if="type">{{scope.row[scope.column.property]}}</span>-->
<!--            <el-date-picker-->
<!--              v-model="scope.row[scope.column.property]"-->
<!--              type="date"-->
<!--              v-else-->
<!--              :disabled="!scope.row['cycleNotice']"-->
<!--              placeholder="选择日期"-->
<!--              value-format="yyyy-MM-dd">-->
<!--            </el-date-picker>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column property="daysEarlier" label="周期提醒提前天数" width="150">-->
<!--          <template slot-scope="scope">-->
<!--            <span v-if="type">{{scope.row[scope.column.property]}}</span>-->
<!--            <el-input  v-else :disabled="!scope.row['cycleNotice']" v-model="scope.row[scope.column.property]"></el-input>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column property="aheadDays" label="提醒间隔" width="100">-->
<!--          <template slot-scope="scope">-->
<!--            <span v-if="type">{{scope.row[scope.column.property]}}</span>-->
<!--            <el-input  v-else :disabled="!scope.row['cycleNotice']" v-model="scope.row[scope.column.property]"></el-input>-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column property="remindOnce" label="提前天数" width="100">
          <template slot-scope="scope" v-if="scope.row['remindType']==1">
            <el-input  v-model="scope.row[scope.column.property]"></el-input>
          </template>
        </el-table-column>
<!--        <el-table-column property="userIdList" label="提醒人" width="350" >-->
<!--          <template slot-scope="scope">-->
<!--            <virtual-select class="virtual-select" clearable multiple :disabled="type"  :data="$store.getters.userList" v-model="scope.row[scope.column.property]"   filterable :render="(data)=>$commonUtils.UserRender(data,this)" >-->
<!--            </virtual-select>-->
<!--          </template>-->
<!--        </el-table-column>-->
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
        <el-button @click="$emit('update:visible', false)">取 消</el-button>
        <el-button type="primary" @click="confirmData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {modifyRemindPlanPm} from '@/api/caseList'
  export default {
    name: "taskPlanList",
    props:{
      taskInfo:{

      },
      visible: {
        type: Boolean,
        default: false
      },
    },
    created() {

      // this.queryRemindPlan()
    },
    watch:{
      taskInfo:{
        handler(n,o){
          if(n){
            if(this.taskInfo.remindPlanList){
              this.planList=JSON.parse(JSON.stringify(this.taskInfo.remindPlanList))
            }

            this.prjTaskId=this.taskInfo.prjTaskId
          }
        },
        deep:true,
        immediate:true
      }
    },
    data(){
      return{
        type:false,
        remindPlanList:[],
        rempId:null,
        planList:[],
        dialogVisible:false
      }
    },
    methods:{
      // queryRemindPlan(){
      //   queryRemindPlan().then(res=>{
      //     this.remindPlanList=res.data
      //   })
      // },
      addCurrentRemindPlan(){
        this.planList.push({
          ifRemind:false, remindType:1, wechatNotice:false, emailNotice:false
        })
      },
      modifyPlanList(){
        modifyRemindPlanPm({ remindPlanList:this.planList,prjTaskId:this.taskInfo.prjTaskId}).then(res=>{
          this.$emit('update:visible', false);
        })

      },
      getRemindPlan(rempId){
        if(!rempId){
          this.$message.warning('请选择提醒计划后再点击生成')
          return
        }
        this.$confirm('该操作将会将该原始计划应用于当前时限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if(rempId){
            getRemindPlan({rempId}).then(res=>{
              this.planList=res.data.planDetailsList
              // console.log(this.timelimitInfo.workgroupArray);
              this.planList.forEach(item=>{
                item.userIdList=this.timelimitInfo.workgroupArray.reduce((pre,next)=>{
                  return [...pre,...next.timelimitUserArray]
                },[])
                // console.log(item.userIdList);

              })
            })
          }else {
            this.planList=[]
          }
          this.dialogVisible=true
        }).catch(() => {

        })
      },
      confirmData(){
        if(this.taskInfo){
         this.modifyPlanList()
        }else {
          this.$emit('getData',this.planList)
          this.$emit('update:visible', false);
        }
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
