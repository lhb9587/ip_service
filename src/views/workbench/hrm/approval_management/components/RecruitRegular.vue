<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="申请人">
        {{ form.name }}
      </el-form-item>
      <el-form-item label="申请日期">
        {{ form.date }}
      </el-form-item>
      <el-form-item label="申请明细"></el-form-item>
<!--      <div class="detail">-->
<!--        <el-form-item label="活动时间">-->
<!--          <el-input size="small" v-model="form.name"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="即时配送">-->
<!--          <el-switch v-model="form.delivery"></el-switch>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="活动性质">-->
<!--          <el-checkbox-group v-model="form.type">-->
<!--            <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>-->
<!--            <el-checkbox label="地推活动" name="type"></el-checkbox>-->
<!--            <el-checkbox label="线下主题活动" name="type"></el-checkbox>-->
<!--            <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>-->
<!--          </el-checkbox-group>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="特殊资源">-->
<!--          <el-radio-group v-model="form.resource">-->
<!--            <el-radio label="线上品牌商赞助"></el-radio>-->
<!--            <el-radio label="线下场地免费"></el-radio>-->
<!--          </el-radio-group>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="活动形式">-->
<!--          <el-input type="textarea" v-model="form.desc"></el-input>-->
<!--        </el-form-item>-->
<!--      </div>-->
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'RecruitRegular',
  data() {
    return {
      form: {
        name: '侯强',
        date: '2023-06-19',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  created() {
    console.log(this.pageName)
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-form-item {
  margin: 0px;
}
.detail {
  border: 1px solid red;
}
</style>
