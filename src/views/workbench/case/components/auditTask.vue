<template>
    <el-dialog
        title="审核"
        :visible.sync="auditView"
        append-to-body
        :modal="false"
        center
        top="0"
        height="500"
        v-dialogDrag
        :close-on-click-modal="false"
        :before-close="closeAudit"
        width="25%">
        <div style="">
          <el-form :model="auditForm" :rules="rules" label-width="120px">
            <el-form-item label="执行人:" prop="executor">
              <el-select class="executor" v-model="auditForm.executor" placeholder="请选择执行人" filterable clearable>
                <el-option
                  v-for="item in peopleList"
                  :key="item.id"
                  :label="item.fullname"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="截止日期:" prop="shenheEndDate">
              <el-date-picker
                class="executor"
                v-model="auditForm.shenheEndDate"
                type="date"
                :clearable="false"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="审核结果:" prop="result">
              <el-radio-group v-model="auditForm.result">
                <el-radio :label="1">通过</el-radio>
                <el-radio :label="2">不通过</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="审核备注:" prop="shenheremark">
              <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 4}"  placeholder="请输入备注" v-model="auditForm.shenheremark"></el-input>
            </el-form-item>
          </el-form>

        </div>

        <span slot="footer" class="dialog-footer" style="display: flex; align-items: center;justify-content: center">
          <el-button @click="closeAudit" size="mini">取 消</el-button>
          <el-button type="primary" @click="auditTasks" size="mini">确 定</el-button>
        </span>
      </el-dialog>
</template>

<script>
  export default {
    name: "auditTask",
    props:{
      auditView:false,
      auditData:{}
    },
    watch:{
      auditData:{
        handler(n){
          // this.auditForm.executor = n.executor || ''
          // this.auditForm.shenheEndDate = n.endDate || ''
          this.auditForm = JSON.parse(JSON.stringify(n))
          this.$set(this.auditForm,'shenheremark','')
          this.$set(this.auditForm,'shenheEndDate',this.auditForm.endDate)
          this.$set(this.auditForm,'executor',this.auditForm.executor)
          this.$set(this.auditForm,'result','')
          // this.auditForm.shenheEndDate = this.auditForm.endDate
          // this.auditForm.shenheremark = ''
          // this.auditForm.result = ''
        },
        immediate:true
      }
    },
    data(){
      return{
        rules: {
          // shenheremark: [{required: true, message: '请输入任务名称', trigger: 'change'}],
          shenheEndDate: [{required: true, message: '请选择截止日期', trigger: 'change'},],
          executor: [{required: true, message: '请选择任务执行人', trigger: 'change'},],
          result: [{required: true, message: '请选择审核结果', trigger: 'change'},],
        },
        auditForm:{
          shenheremark:'',
          shenheEndDate:'',
          executor:'',
          result:''
        },

      }
    },
    computed:{
      peopleList(){
        return this.$store.getters.userList
      }
    },
    created() {

    },
    methods:{
      closeAudit(){
        this.$emit('closeAudit')
        // this.auditForm = {}
      },
      auditTasks(){
        if(!this.auditForm.executor){
          this.$message.error('请选择任务执行人')
          return;
        }
        if(!this.auditForm.shenheEndDate){
          this.$message.error('请选择截止日期')
          return;
        }
        if(!this.auditForm.result){
          this.$message.error('请选择审核结果')
          return;
        }
        this.$emit('auditTasks',this.auditForm)
        this.closeAudit()
      }
    }
  }
</script>

<style scoped>

</style>
