<template>
  <div class="hrm-container">
    <div class="hrm-header">
      <span>薪酬统计</span>
    </div>
    <div class="hrm-main">
      <List></List>
    </div>
  </div>
</template>

<script>
import List from './list'
export default {
  name: 'index',
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
  },
  components: {
    List
  }
}
</script>

<style lang="scss" scoped>
.hrm-container {
  width: 100%;
  background-color: #F2F2F2;
}
.hrm-header{
  width: 100%;
  height: 50px;
  background-color: #FFFFFF;
  color: #333;
  span{
    font-size: 18px;
    line-height: 50px;
    font-weight: bold;
  }
  .right-button{
    margin-top: 6px;
    float: right;
  }
  button{
    font-size: 16px;
    i{
      width: 20px;
      border-radius: 3px;
      background: #409eff;
      color: #fff
    }
  }
  .notice{
    font-size: 12px;
    display: initial;
    border-radius: 18px;
    background-color: #52A0F5;
    padding: 2px 6px;
    color: #FFFFFF;
  }
}
.hrm-main{
  width:100%;
  padding: 15px;
  .main-list{
    width: 100%;
    padding: 0 10px 10px 10px;
    background-color: #FFFFFF;
  }
}
.hrm-search{
  font-size: 14px;
  height: 46px;
  line-height: 46px;
  width: 100%;
  a{
    color: #52A0F5;
  }
  i{
    padding-right: 5px;
  }
  .header-search{
    float: left;
    padding-top: 7px;
    margin-left: -10px;
  }
  .el-select /deep/ .el-input input{
    //width: 90px;
    font-weight: bold;
    border: 0px !important;
  }
}
</style>
