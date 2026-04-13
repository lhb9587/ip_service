<template>
    <el-dialog
      :title="title"
      :visible.sync="delayView"
      width="30%"
      :before-close="closeDialog"
      >
      <el-form label-width="120px">
        <el-form-item v-if="approve" label="选择执行人:" style="width: 100%;">
          <el-select style="width: 100%" v-model="delayInfo.executor" placeholder="请选择执行人" filterable clearable>
            <el-option
              v-for="item in peopleList"
              :key="item.id"
              :label="item.fullname"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item  label="任务截止日期:" style="width: 100%;">
<!--          <el-date-picker-->
<!--            v-if="!approve"-->
<!--            style="width: 100%;"-->
<!--            v-model="delayInfo.endDate"-->
<!--            type="date"-->
<!--            value-format="yyyy-MM-dd"-->
<!--            placeholder="选择日期">-->
<!--          </el-date-picker>-->
          <span>{{delayInfo.endDate}}</span>
        </el-form-item>
        <el-form-item  label="申请延期至:" style="width: 100%;">
          <el-date-picker
            v-if="!approve"
            style="width: 100%;"
            v-model="delayDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
          <span v-else>{{delayDate}}</span>
        </el-form-item>
        <el-form-item label="延期原因:" style="width: 100%;">
          <el-input v-if="!approve" type="textarea" placeholder="请输入备注" v-model="delayRemark" clearable :autosize="{ minRows: 1, maxRows: 4}"></el-input>
          <span v-else>{{delayRemark}}</span>
        </el-form-item>
        <el-form-item v-if="approve" label="审批结果:">
          <el-radio-group v-model="result">
            <el-radio :label="1">通过</el-radio>
            <el-radio :label="2">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="approve" label="批准延期至:" style="width: 100%;">
          <el-date-picker
            style="width: 100%;"
            v-model="approveDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-if="approve" label="审批备注:" style="width: 100%;">
          <el-input type="textarea" placeholder="请输入备注" v-model="approveRemark" clearable :autosize="{ minRows: 1, maxRows: 4}"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" size="mini">取 消</el-button>
        <el-button type="primary" size="mini" @click="delayShenqing">确 定</el-button>
      </span>
    </el-dialog>
</template>

<script>
  import { delayTask,shenpiTask } from '@/api/caseList'
  export default {
    name: "delayDate",
    props:{
      delayView:false,
      taskId:'',
      delayInfo:'',
      approve:false
    },
    watch:{
      approve:{
        handler(n){
          if(n){
            this.delayDate = this.delayInfo.delayDate
            this.delayRemark = this.delayInfo.reason
            this.approveDate = this.delayInfo.delayDate
          }
        },
        immediate:true
      }
    },
    data(){
      return{
        result:'',
        delayDate:'',
        delayRemark:'',
        approveDate:'',
        approveRemark:''
      }
    },
    computed:{
      title(){
        return this.approve?'审批延期':'申请延期'
      },
      peopleList(){
        return this.$store.getters.userList
      }
    },
    methods:{
      closeDialog(f){
        this.$emit('closeDelay',f)
        this.delayInfo.executor = ''
        this.delayDate = ''
        this.delayRemark = ''
        this.result = ''
        this.approveDate = ''
        this.approveRemark = ''
      },
      delayShenqing() {
        if(!this.approve){
          if(!this.delayDate){
            this.$message.error('请选择延期时间！')
            return
          }
          if(this.CompareDate(this.delayInfo.endDate,this.delayDate)){
            this.$message.error('延期时间应该大于截止日期！')
            return;
          }
          this.$emit('modifyTask','申请')
          // delayTask({prjTaskId: this.delayInfo.prjTaskId, endDate: this.delayDate,remark:this.delayRemark}).then(()=>{
          //   this.$message.success('申请延期已提交！')
          //   this.closeDialog('update')
          // })
        }else{
          if(this.CompareDate(this.delayInfo.startDate,this.approveDate)){
            this.$message.error(`审批时间应该大于开始日期:${this.delayInfo.startDate}！`)
            return;
          }
          if(!this.result){
            this.$message.error('请选择审批结果')
            return;
          }
          this.$emit('modifyTask','审批')

        }

      },
      shenqing(){
        // alert(2)
        delayTask({prjTaskId: this.delayInfo.prjTaskId, endDate: this.delayDate,remark:this.delayRemark}).then(()=>{
            this.$message.success('申请延期已提交！')
            this.closeDialog('update')
          })
      },
      shenpi(){
        // alert(2)
        shenpiTask({prjTaskId: this.delayInfo.prjTaskId, result: this.result, executor: this.delayInfo.executor,endDate: this.approveDate,remark:this.approveRemark}).then(()=>{
            this.$message.success('审批成功!')
            this.closeDialog('update')
          })
      },
      CompareDate(d1,d2) {
        return ((new Date(d1.replace(/-/g,"\/"))) > (new Date(d2.replace(/-/g,"\/"))));
      },
    }
  }
</script>

<style scoped>

</style>
