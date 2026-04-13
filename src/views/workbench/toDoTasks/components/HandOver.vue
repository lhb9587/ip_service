<template>
  <el-dialog
    :title="transfromType"
    :visible.sync="transfromState"
    width="50%"
    :before-close="handleClose"
  >
    <div style="padding-left:30px" >
    <div style="color: #ff0000"  v-if="transfromType=='任务权限转交'">可以将选中类型的待办任务转交给其他人处理</div>


    <el-form label-width="100px" label-position="left">
      <el-form-item label="业务种类:" v-if="transfromType=='任务权限转交'">
        <el-select v-model="taskDefineId" placeholder="请选择业务种类" filterable
                   clearable >
          <el-option
            v-for="item in taskDefineList"
            :key="item.id"
            :label="`业务 ${item.processDesc}---任务 ${item.taskName}`"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否关注" >
        <el-radio v-model="include" :label="1">继续关注</el-radio>
        <el-radio v-model="include" :label="0">暂不关注</el-radio>
      </el-form-item>
      <el-form-item label="是否可收回" v-if="transfromType=='任务权限转交'">
        <el-radio v-model="recovery" :label="1">可收回</el-radio>
        <el-radio v-model="recovery" :label="0">不可收回</el-radio>
      </el-form-item>
      <el-form-item label="指定客户" v-if="transfromType=='任务权限转交'">
        <el-select
          v-model="custIdList"
          ref="custSelect"
          filterable
          clearable
          multiple
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="queryCustomerNameId">
          <el-option
            v-for="item in queryCustomerNameIdList"
            :key="item.custId"
            :label="item.fullname"
            :value="item.custId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择转交人">
        <el-select  default-first-option v-model="deliverId" filterable clearable placeholder="请选择">
          <el-option
            v-for="item in queryDeliverList"
            :key="item.userId"
            :label="item.nameEmail"
            :value="item.userId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
       <el-input class="memo" type="textarea"
                  :rows="4"
                  v-model="memo" placeholder="请输入备注"></el-input>
      </el-form-item>
    </el-form>
    </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="assginTaskCandidate(1)">确 定</el-button>
       </span>
  </el-dialog>
</template>

<script>
import { queryCustomerNameId,queryTaskDefine,assginTaskCandidate, queryTackBackTask,queryDeliver } from '@/api/caseList.js'
export default {
  name: "HandOver",
  props:['transfromState','transfromType', 'multipleSelection'],
  watch:{
    transfromState(n){
      n&&(this.queryDeliver(), this.queryTaskDefine())
    }
  },
  created() {
  },
  data(){
    return {
      deliverId:'',
      queryDeliverList:[],
      include: 1,
      recovery: 1,
      assignType:0,
      custIdList:[],
      queryCustomerNameIdList:[],// 客户信息列表
      loading: false,
      memo:'',
      taskDefineList:[],
      taskDefineId:1,
      taskDefineObj:{}
    }
  },
  methods:{
    queryTaskDefine(){
      queryTaskDefine().then(res=>{
        this.taskDefineList= res.data
      })
    },
    assginTaskCandidate(){
      this.assignType= this.transfromType==='任务权限转交'?this.assignType=1:this.assignType=0
      const data = {
        assignType:this.assignType,
        include: this.include,
        tackBack: this.recovery,
        taskIdList:this.multipleSelection.map(item=>item.taskId),
        taskCandidate:this.deliverId,
        memo:this.memo
      }
      if(this.transfromType==='任务权限转交'&& this.custId){
        data.custIdList = this.custIdList

      }
      if(this.transfromType==='任务权限转交'){
       this.taskDefineObj = this.taskDefineList.find(item=>item.id==this.taskDefineId)
      }else {
       this.taskDefineObj={}
      }
      // if(this.multipleSelection.length==1){
      //   data.custId=this.multipleSelection[0].custId
      // }
      assginTaskCandidate(Object.assign(data,this.taskDefineObj)).then(res=>{
        this.$store.dispatch('user/getTodoTaskNotice');
        this.cancel(1)
      })
    },
    queryCustomerNameId(query) {
      if (!this.loading) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            queryCustomerNameId({curStatus: '4,5', pageNo: 0, pageSize: 100, keyword: query }).then(res => {
              this.queryCustomerNameIdList = res.data
              this.loading = false;
            })
          }, 200);
        }
      } else {
        this.queryCustomerNameIdList = [];
      }
    },
    queryDeliver(){
      queryDeliver().then(res=>{
        this.queryDeliverList=res.data
      })
    },
    handleClose(){
      this.cancel()
    },
    cancel(flag){
      this.$emit('closeHandover',flag)
    }
  }
}
</script>

<style lang="scss" scoped>
.memo{
  width: 200px;
}
</style>
