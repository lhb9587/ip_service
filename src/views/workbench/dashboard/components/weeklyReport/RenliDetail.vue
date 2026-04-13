<template>
  <div class="articleDetail">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="动态">
        <el-col :span="11">
          <el-select
            filterable
            allow-create
            default-first-option
            v-model="form.renliType"
            placeholder="请选择类型">
            <el-option label="入职" value="入职"></el-option>
            <el-option label="离职" value="离职"></el-option>
            <el-option label="晋升" value="晋升"></el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="人员信息">
        <el-input v-model="form.renliInfo"></el-input>
      </el-form-item>
    </el-form>
    <div class="button_wrap">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </div>
  </div>
</template>

<script>
import { createRenli,updateRenli } from '@/api/dashboard'
export default {
  name: "RenliDetail",
  props: ['dateArray','detailInfo'],
  data() {
    return {
      form: {
        renliType: '',
        renliInfo: ''
      }
    }
  },
  created() {
    this.init()
  },
  methods:{
    init(){
      if (this.detailInfo){
        this.form = JSON.parse(JSON.stringify(this.detailInfo))
      }
    },
    submit() {
      if (!this.detailInfo.wrlId){
        var data = {
          userId: this.$store.getters.userId,
          userFullName: this.$store.getters.name,
          startDate: this.dateArray[0],
          endDate: this.dateArray[1],
          ...this.form
        }
        createRenli(data).then(res => {
          if(res.success){
            this.$message.success('创建成功');
            this.$emit('closeDetail')
          }
        })
      }else{
        var data = this.form
        updateRenli(data).then(res => {
          if(res.success){
            this.$message.success('编辑成功');
            this.$emit('closeDetail')
          }
        })
      }
    },
    cancel() {
      this.$emit('closeDetail')
    }
  }
}
</script>

<style lang="scss" scoped>
.articleDetail{
  padding: 20px;
}
.el-tag + .el-tag {
  margin-right: 10px;
}
.button-new-tag {
  margin-right: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-right: 10px;
  vertical-align: bottom;
}
.title{
  color: #235;
  height: 30px;
  line-height: 30px;
  text-decoration: none;
}
.button_wrap{
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
</style>
