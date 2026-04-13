<template>
<div>
  <el-form  ref="submission"  label-width="206px" >
    <el-row>
      <el-form-item label="发送方式" >
        <el-radio v-model="submitData.sendWay" :label="1">邮箱</el-radio>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item label="提醒周期" >
        <el-radio-group v-model="submitData.planId" >
          <el-radio  :label="1">按季度发送</el-radio>
          <el-radio  :label="2">按月发送</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item label="发送时间" >
        <template v-if="submitData.planId===1">
          <el-date-picker
            class="pickauto"
            v-model="submitData.myselfArray[0].sendDate"
            type="date"
            format="MM月dd"
            value-format="MM-dd"
            placeholder="选择日期"
       >
          </el-date-picker>
          <el-date-picker
            class="pickauto"
            v-model="submitData.myselfArray[1].sendDate"
            type="date"
            format="MM月dd"
            value-format="MM-dd"
            placeholder="选择日期">
          </el-date-picker>
          <el-date-picker
            class="pickauto"
            v-model="submitData.myselfArray[2].sendDate"
            type="date"
            format="MM月dd"
            value-format="MM-dd"
            placeholder="选择日期">
          </el-date-picker>
          <el-date-picker
            class="pickauto"
            v-model="submitData.myselfArray[3].sendDate"
            type="date"
            format="MM月dd"
            value-format="MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </template>
        <template v-if="submitData.planId===2">
          <el-date-picker
            v-model="submitData.myselfArray[4].sendDate"
            type="date"
            format="dd"
            value-format="dd"
            placeholder="选择日期">
          </el-date-picker>
        </template>
      </el-form-item>
    </el-row>
  </el-form>
    <span  style="margin-top:10px;display: flex;justify-content: center">
      <el-button type="primary" size="mini" @click="upRemindType">确定</el-button>
      <el-button  size="mini" @click="$emit('changeFalse')">取消</el-button>
   </span>
</div>
</template>

<script>
import { getRemindType, upRemindType, getPlan} from '@/api/caseList'
export default {
  name: "reminderSettings",
  data(){
    return{
      submitData:{
        myselfArray:[]
      },
      defaultList:[]
    }
  },
  created(){
    this.getRemindTypeAndgetPlan()
  },
  methods:{
    getRemindTypeAndgetPlan(){
      Promise.all([getRemindType({typeyId:1}),getPlan()]).then(res=>{
        this.submitData=res[0].data
        this.defaultList=res[1].data
        if(!res[0].data.remindSchemeArray.length){
          this.submitData.myselfArray=res[1].data.find(item=>item.planId===1).remindDateArray
          this.submitData.myselfArray.push(res[1].data.find(item=>item.planId===2).remindDateArray.find(item=>item.sendId===5))
        } else {

        }
      })
    },
    upRemindType(){
      this.submitData.remindSchemeArray=this.defaultList.filter(item=>item.planId===this.submitData.planId)
      if(this.submitData.planId===1){
        this.submitData.remindSchemeArray[0].remindDateArray=this.submitData.myselfArray.filter(item=>item.sendId!==5)
      }
      if(this.submitData.planId===2){
        this.submitData.remindSchemeArray[0].remindDateArray=this.submitData.myselfArray.filter(item=>item.sendId===5)
      }
      delete this.submitData.myselfArray
      upRemindType( this.submitData).then(res=>{
        this.$message.success('设置成功')
        this.$emit('changeFalse')
      }).catch(()=>{
        this.$message.error('设置失败')
        this.$emit('changeFalse')
      })
    },
  },
  watch:{
    'submitData.planId'(n,o){
      if(n ===1) {
        document.getElementById('app').classList.remove('formatdd')
        document.getElementById('app').classList.add('formatMMdd')
      } else if(n === 2) {
        document.getElementById('app').classList.remove('formatMMdd')
        document.getElementById('app').classList.add('formatdd')
      }
    }
  },
  beforeDestroy() {
    document.getElementById('app').classList.remove('formatMMdd')
    document.getElementById('app').classList.remove('formatdd')
  }
}
</script>

<style lang="scss" scoped>
  .el-form{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 20px;
    margin:0 20px ;
    .el-select,.el-input,.el-date-picker,.el-textarea{
      width: 95%;
    }
    .pickauto{
      width: 23%;

    }
    .el-textarea{
      margin: 10px 0;
    }
    /deep/ input{
      height: 28px;
    }
    /deep/ .el-input__icon{
      line-height: 28px;
    }
    .el-row{
      min-height: 30px;
      width: 100%;
      display: flex;
      align-items: center;
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
    .el-row:nth-last-child(1){
      .el-form-item{
        border: 1px solid #EBEEF5;
      }
    }
  }

</style>
