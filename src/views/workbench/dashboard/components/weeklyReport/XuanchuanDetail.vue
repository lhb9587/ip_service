<template>
  <div class="articleDetail">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="日期">
        <el-col :span="11">
          <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd" v-model="form.xuanchuanDate" style="width: 100%;"></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="类型">
        <el-col :span="11">
          <el-input v-model="form.xuanchuanType"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="form.xuanchuanTitle"></el-input>
      </el-form-item>
      <el-form-item label="作者">
        <el-col :span="11">
          <el-input v-model="form.xuanchuanAuthor"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="阅读量">
        <el-col :span="6">
          <el-input v-model="form.readCount"></el-input>
        </el-col>
      </el-form-item>
    </el-form>
    <div class="button_wrap">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </div>
  </div>
</template>

<script>
import { createXuanchuan,updateXuanchuan } from '@/api/dashboard'
export default {
  name: "XuanchuanDetail",
  props: ['dateArray','detailInfo'],
  data() {
    return {
      form: {
        xuanchuanDate: '',
        xuanchuanType: '',
        xuanchuanTitle: '',
        xuanchuanAuthor: '',
        readCount: '',
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
      if (!this.detailInfo.wxcId){
        var data = {
          userId: this.$store.getters.userId,
          userFullName: this.$store.getters.name,
          startDate: this.dateArray[0],
          endDate: this.dateArray[1],
          ...this.form
        }
        createXuanchuan(data).then(res => {
          if(res.success){
            this.$message.success('创建成功');
            this.$emit('closeDetail')
          }
        })
      }else{
        var data = this.form
        updateXuanchuan(data).then(res => {
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
