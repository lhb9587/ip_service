<template>
  <div class="articleDetail">
    <el-input type="textarea" v-model="content" :rows="10"></el-input>
    <div class="button_wrap">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </div>
  </div>
</template>

<script>
import { createRongyu,updateRongyu } from '@/api/dashboard'
export default {
  name: "RongyuDetail",
  props: ['dateArray','detailInfo'],
  data() {
    return {
      content: ''
    }
  },
  created() {
    this.init()
  },
  methods:{
    init(){
      if (this.detailInfo){
        this.content = this.detailInfo.content
      }
    },
    submit() {
      if (!this.detailInfo.id){
        var data = {
          userId: this.$store.getters.userId,
          userFullName: this.$store.getters.name,
          startDate: this.dateArray[0],
          endDate: this.dateArray[1],
          content: this.content
        }
        createRongyu(data).then(res => {
          if(res.success){
            this.$message.success('创建成功');
            this.$emit('closeDetail')
          }
        })
      }else{
        var data = {
          wryId: this.detailInfo.id,
          content: this.content
        }
        updateRongyu(data).then(res => {
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
