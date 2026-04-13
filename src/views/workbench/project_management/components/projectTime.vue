<template>
  <div>
    <el-row>
      <el-col :span="24" class="tilteSpan">
<!--        <handTime  ref="handTime" @refreshList="queryWorkHours" noQuery="1" :projectId="projectId" style="display: inline-block;visibility: hidden"></handTime>-->
        <el-dialog
          title="新建工时"
          append-to-body
          :close-on-click-modal="false"
          :visible.sync="workHourView"
          width="45%"
          height="80%"
          class="abow_dialog"
        >
          <create-work-hour @refreshList="queryWorkHours" v-if="workHourView" :projectId="projectId" @closeDialog="workHourView = false"></create-work-hour>
        </el-dialog>
        <el-button size="mini" style="float:right" type="primary" @click="createHandTime">新建 </el-button>
      </el-col>
    </el-row>
    <el-row style='margin-top:5px'>
      <el-col :span="24">
        <el-table @row-dblclick="rowDoubleClicked" :height="height" :data="workHours" border current-row-key empty-text="暂无数据" :summary-method="getSummaries" fit highlight-current-row show-summary size="mini"
                  style="width: 100%;">

          <el-table-column align="left" label="工时日期"  width="150">
            <template slot-scope="scope">
              <span>{{ scope.row.hourDate }}</span>
            </template>
          </el-table-column>
          <el-table-column align="left" label="结束时间" width="150">
            <template slot-scope="scope">
              <span>{{ scope.row.endDate }}</span>
            </template>
          </el-table-column>
          <el-table-column align="left" label="员工" width="150">
            <template slot-scope="scope">
              <span>{{ scope.row.whUserName }}</span>
            </template>
          </el-table-column>
          <el-table-column align="left" label="员工角色" width="150">
            <template slot-scope="scope">
              <span>{{ scope.row.roleName }}</span>
            </template>
          </el-table-column>
          <el-table-column align="left" label="工时" width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.wfStatus=='待审核'">{{scope.row.time}}</span>
              <span v-else>{{ scope.row.approvedTime}}</span>
            </template>
          </el-table-column>
          <el-table-column align="left" label="费率(/时)" width="200">
            <template slot-scope="scope">
              <span v-if="scope.row.wfStatus=='待审核'">{{scope.row.criterionRate}}</span>
              <span v-else>{{ scope.row.billRate}}</span>
            </template>
          </el-table-column>
          <el-table-column align="left" label="描述" width="300">
            <template slot-scope="scope">
              <span v-if="scope.row.wfStatus=='待审核'">{{scope.row.workContent}}</span>
              <span v-else>{{ scope.row.approvedDesc||scope.row.workContent}}</span>
            </template>
          </el-table-column>

          <el-table-column align="left" label="状态" width>
            <template slot-scope="scope">
              <span>{{ scope.row.wfStatus }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="approvedAmountCust" align="left"  label="金额">
            <template slot-scope="scope">
              <span v-if="scope.row.wfStatus=='待审核'">{{scope.row.amount}}</span>
              <span v-else>{{ scope.row.approvedAmountCust}}</span>
            </template>
          </el-table-column>
          <el-table-column align="left"  label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="modifyTaskHours(scope.row)">修改</el-button>
            </template>
          </el-table-column>

        </el-table>

      </el-col>
    </el-row>
    <TimeDialog @updataData="queryWorkHours" @closeDialog="closeEdit" :sign="sign" :data-time="rowDataForm"  :view="editWorkTime"></TimeDialog>
<!--    <TimeDialog :view="view" :dataTime="data" @closeDialog="view=false"></TimeDialog>-->
  </div>
</template>

<script>
  import {queryWorkHours,checkPermission } from '@/api/caseList'
  import TimeDialog from '@/views/workbench/workTime/components/TimeDialog.vue'
  import { toFixed1 } from "@/utils/filters"
  // import handTime  from '@/views/workbench/workTime/components/handTime.vue'
  import CreateWorkHour from "../../workTime/components/CreateWorkHour";
  export default {
    name: "projectTime",
    props:{
      projectId:{

      },
    },
    data(){
      return{
        workHourView: false,
        workHours:[],
        rowDataForm:{},
        editWorkTime:false,
        sign:'',
        height: document.documentElement.clientHeight - 230
      }
    },
    created() {
      this.queryWorkHours()
    },
    methods:{
      closeEdit(){
        this.editWorkTime = false
        this.sign=''
      },
      modifyTaskHours(data) {
        let hoursId = data.hoursId
        checkPermission({hoursId}).then(res=> {
          if (res.data.modify == 0) {
            this.$message.error('该工时您无法修改')
          }else{
            this.sign = '修改'
            this.rowDataForm = JSON.parse(JSON.stringify(data))
            this.editWorkTime = true
          }
        })
      },
      rowDoubleClicked(data){
        this.rowDataForm = JSON.parse(JSON.stringify(data))
        this.sign = '查看'
        this.editWorkTime = true

      },
      createHandTime(){
        // this.$refs.handTime.isShow=true
        this.workHourView = true
      },
      getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = "合计：";
            return;
          }
          const values = data.map((item,index) =>{
            if(column.property=='approvedAmountCust'&&isNaN(Number(item[column.property]))){
              if(data.wfStatus=='待审核'){
                return Number(item['amount'])
              }else {
                return Number(item[column.property])
              }
            }
            return Number(item[column.property])
          });
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);

            sums[index] = toFixed1(sums[index])
            sums[index] = "￥ " + sums[index]
          }
        });
        return sums
      },
      queryWorkHours(){
        if(this.projectId){
          const data={
            pageNo: 1,
            pageSize: 10000,
            projectId: this.projectId,
          }
          queryWorkHours(data).then(res=>{
            this.workHours=res.data.workhoursList
            this.$parent.$parent.$parent.workHours=this.workHours
          })
        }
      }
    },
    watch:{
      projectId(){
        this.queryWorkHours()
      }
    },
    components:{
      CreateWorkHour,
      TimeDialog,
      // handTime
    }
  }
</script>

<style lang="scss" scoped>
  .abow_dialog {
    > > > .el-dialog {
      position: absolute;
      top: 50%;
      left: 50%;
      margin: 0 !important;
      transform: translate(-50%, -50%);
      min-height: calc(60%);
      max-height: calc(100% - 30px);
      max-width: calc(100% - 30px);
      display: flex;
      flex-direction: column;
    }

    > > > .el-dialog__body {
      overflow: auto;
      padding: 0 10px 10px 10px;
    }
  }
</style>
