<template>
    <div v-if="handleDelayView">
      <!--      审批延期-->
      <el-dialog
        title="审批"
        :visible.sync="handleDelayView"
        width="30%">
        <div style="margin-bottom: 30px;margin-left:80px">
          <el-row>
            <el-col :span="20">
              <div style="display: flex;justify-content: left">
                <span style="width: 100px;line-height: 40px;text-align: right;margin-right: 10px">申请延期时间: </span>
                <span style="line-height: 40px;">{{delayDate}}</span>
              </div>
            </el-col>


          </el-row>
          <el-row>
            <el-col :span="20">
              <div style="display: flex;justify-content: left;margin-top: 20px">
                <span style="width: 100px;flex-shrink: 0;text-align: right;margin-right: 10px">申请延期理由:</span>
                <span style="height: 80px;overflow-y: auto">{{reason}}</span>
              </div>
<!--              <div style="">-->
<!--                <span style="display: flex; width: 100px;text-align: right;height: 30px;line-height: 40px;margin-left: 10px"><span style="display: inline-block;height: 100%;">申请延期理由:</span>  <span>{{reason}}11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111</span></span>-->
<!--               </div>-->
            </el-col>


          </el-row>
          <el-row>
            <el-col :span="20">
              <div style="display: flex;justify-content: left">
                <span style="width: 100px;line-height: 40px;text-align: right;margin-right: 10px">审批延期时间: </span>
                <el-date-picker
                  v-model="endDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
                </el-date-picker>
              </div>
            </el-col>


          </el-row>
          <el-row style="display: flex;justify-content: left;align-items: center;">
            <span style="font-size: 14px;margin-right: 20px;width: 100px;text-align: right;line-height: 40px;">审批结果:</span>
            <el-radio-group v-model="delayResult">
              <el-radio label="1">通过</el-radio>
              <el-radio label="2">不通过</el-radio>
            </el-radio-group>
          </el-row>
          <el-row v-if="delayResult==2" class="shenpi" style="display: flex;justify-content:left; ;align-items: center;">
            <span style="margin-right: 10px; width: 100px;text-align: right">执行人:</span>
            <el-select v-model="delayExecutor" placeholder="请选择执行人" filterable clearable>
              <el-option
                v-for="item in peopleList"
                :key="item.userId"
                :label="item.fullName"
                :value="item.userId">
              </el-option>
            </el-select>
          </el-row>

        </div>
        <span slot="footer" class="dialog-footer" style="display: flex;justify-content: center">
          <el-button @click="handleDelayView = false" size="small">取 消</el-button>
          <el-button type="primary" @click="shenpiTask" size="small">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
  export default {
    name: "shenpi",
    props: {
      handleDelayView: false,
      peopleList: {
        type: Array,
        default () {
            return []
        }
      },
      reason: '',
      delayDate: ''
    },
    watch: {
      handleDelayView: {
        handler(n,o){

        },
        immediate: true
      }
    },
    data(){
      return{
        delayExecutor: '',
        delayResult: '',
        endDate: this.delayDate
        // closeView: this.handleDelayView
      }
    },
    methods: {
      shenpiTask(){
        if(!this.delayResult){
          this.$message.error('请选择审批结果!')
          return
        }
        this.$emit('shenpi', {delayExecutor: this.delayExecutor, delayResult: this.delayResult, endDate: this.endDate})
        this.handleDelayView = false
      }
    }
  }
</script>

<style scoped>

</style>
