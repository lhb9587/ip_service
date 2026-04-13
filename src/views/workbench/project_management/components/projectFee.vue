<template>
  <div>
    <el-row>
      <el-col :span="24" class="tilteSpan">
        <!--            <span id="-title">费用</span>-->
        <!-- <el-button size="mini" style="float:right" type="primary" @click="creatFee">新建 </el-button> -->
      </el-col>
    </el-row>
    <el-row style='margin-top:5px'>
      <el-col :span="24">
        <el-table :height="height" :data="feeList" :summary-method="getSummaries"  border current-row-key empty-text="暂无数据" fit highlight-current-row size="mini" style="width: 100%;" @row-dblclick="(row)=>rowClick(row,'费用')">
          <el-table-column align="left" label="科目" width >
            <template slot-scope="scope">
              <span>{{ scope.row.feeName }}</span>
            </template>
          </el-table-column>
          <el-table-column align="left" label="总金额" width prop="total">
            <template slot-scope="scope">
              <span>￥{{ scope.row.total}}</span>
            </template>
          </el-table-column>

          <el-table-column align="left" label="费用承担组" width>
            <template slot-scope="scope">
              <span>{{ scope.row.costWkgIdStr }}</span>
            </template>
          </el-table-column>

          <el-table-column align="left" label="报销人所属组" width>
            <template slot-scope="scope">
              <span>{{ scope.row.reimburseWkgIdStr }}</span>
            </template>
          </el-table-column>
          <el-table-column align="left" label="报销人" width>
            <template slot-scope="scope">
              <span>{{ scope.row.reimburseUserIdStr }}</span>
            </template>
          </el-table-column>
          <el-table-column align="left" sortable label="填报日期" width>
            <template slot-scope="scope">
              <span>{{scope.row.fillinDate }}</span>
            </template>
          </el-table-column>
          <el-table-column align="left" label="是否境外账单" width>
            <template slot-scope="scope">
              <span>{{ scope.row.isAbroadBill }}</span>
            </template>
          </el-table-column>
          <el-table-column align="left" label="核销状态" width>
            <template slot-scope="scope">
              <span>{{ scope.row.tobillStatusStr }}</span>
            </template>
          </el-table-column>
          <el-table-column align="left" label="费用状态" width>
            <template slot-scope="scope">
              <span>{{ scope.row.wfStatus }}</span>
            </template>
          </el-table-column>
          <el-table-column align="left" label="操作" width>
            <template slot-scope="scope">
              <el-button type="text" @click="seeFee(scope.row)">查看</el-button>
              <!-- <el-button type="text" @click="modifyFee(scope.row)">修改</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog :title="title" width="80%" :visible.sync="createFeeVisible">
      <projectFeeDetail
        v-if="createFeeVisible"
        :pageType="feeQueryData.pageType"
        :projectId="feeQueryData.projectId"
        :taskNo="feeQueryData.taskNo"
        :feeId="feeQueryData.feeId"
        @cancel="getProjectFeeFormation"></projectFeeDetail>
    </el-dialog>
    <el-dialog :title="title" width="80%" :visible.sync="seeFeeVisible">
      <see-fee-detail v-if="seeFeeVisible" :dialog-fee-id="feeQueryData.feeId" :dialog-task-no="feeQueryData.taskNo" @close="seeFeeVisible = false"/>
    </el-dialog>
  </div>
</template>

<script>
  import projectFeeDetail from '@/views/workbench/finance/cost/components/projectFeeDetail.vue'
  import { checkPermission, queryProjectFeeInfo } from '@/api/caseList'
  import SeeFeeDetail from '@/views/workbench/finance/cost/seeFeeDetail.vue'
  export default {
    name: "projectFee",
    props:{
      projectId:{

      }
    },
    data(){
      return{
        seeFeeVisible: false,
        feeList:[],
        createFeeVisible:false,
        feeQueryData:{},
        title:'',
        height:450
      }
    },
    created() {
      this.queryProjectFeeInfo(this.projectId)
    },
    methods:{
      getProjectFeeFormation(flag){
        this.createFeeVisible=false
        if(flag){
          this.queryProjectFeeInfo(this.projectId)
        }

      },

      queryProjectFeeInfo(projectId){
        if(projectId){
          queryProjectFeeInfo({projectId}).then(res=>{
            this.feeList=res.data
            this.$parent.$parent.$parent.feeList=this.feeList
          })
        }

      },
      rowClick(row,type){
        // if(type=='工时'){
        //   this.data=row
        //   this.view=true
        // }
        // if(type=='草单'){
        //   this.$router.push(`/workbench/finance/trawSheet/${row.billRecordId}/see`)
        // }
        // if(type=='账单'){
        //   this.$router.push(`/workbench/finance/creatBill/${row.billId}/view`)
        // }
        // if(type=='内部账单'){
        //   this.$router.push(`/workbench/finance/cinBill/${row.billInterId}/see`)
        // }
        if(type=='费用'){
          this.$router.push(`/workbench/finance/addFeeDetail/2?feeId=${row.feeId}`)
        }
      },
      seeFee(row) {
        this.title = '查看费用'
        this.feeQueryData = {
          pageType: 2,
          projectId: this.projectId,
          taskNo: row.taskNo,
          feeId: row.feeId,
        }
        this.seeFeeVisible = true
      },
      modifyFee(row){
        checkPermission({feeId: row.feeId}).then(res => {
          if (res.data.modify == 0) {
            this.$message.error('该费用您无法修改')
          } else {
            this.title='修改费用'
            this.feeQueryData={
              pageType:2,
              projectId:this.projectId,
              taskNo:row.taskNo,
              feeId:row.feeId,
            }
            this.createFeeVisible=true
          }
        })
      },
      creatFee(){
        this.title='新建费用'
        this.feeQueryData={
          pageType:1,
          projectId:this.projectId,
          taskNo:null,
          feeId:null,
        }
        this.createFeeVisible=true
      },
      getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = "合计：";
            return;
          }
          const values = data.map(item =>{
            if(column.property=='approvedAmountCust'&&isNaN(Number(item[column.property]))){
              if(!isNaN(Number(item['amount']))){
                return Number(item['amount'])
              }else {
                return Number(item[column.property])
              }

            }
            return Number(item[column.property])
          });
          // console.log(values);
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
    },
    watch:{
      projectId(n,o){
        this.queryProjectFeeInfo(n)
      }
    },
    components:{
      SeeFeeDetail,
      projectFeeDetail
    }
  }
</script>

<style lang="scss" scoped>
  /deep/ .el-dialog__body{
    padding: 10px 20px;
  }
</style>

