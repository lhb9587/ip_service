<template>
  <div class="potential-cust">
    <div class="left">
      <div class="title">潜在客户</div>
    </div>
    <div class="right">
      <div class="num">{{num}}</div>
      <img src="../assets/images/u407.png" alt="">
    </div>
    <el-popover
      placement="top-start"
      title="潜在客户"
      width="400"
      trigger="hover">
      <svg-icon slot="reference" class="question" icon-class="问题"/>
      <div>
        <p>潜在客户：当年合作状态“潜在”的客户</p>
      </div>
    </el-popover>
  </div>
</template>

<script>
  export default {
    name: "PotentialCust",
    props: {
      num: {
        type: Number,
        default: 0
      }
    }
  }
</script>

<style lang="scss" scoped>
  .potential-cust {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 186px;
    width: 100%;
    .left{
      height: 51px;
      padding: 15px 0 0 15px;
      .title {
        font-size: 17px;
        font-weight: bold;
      }
    }
    .right {
      flex: 1;
      display: flex;
      .num {
        margin-left: 15px;
        font-size: 22px;
        font-weight: bold;
        flex-shrink: 0;
      }
      img {
        max-width: 300px;
        height: 100%;
        /*height: 80%;*/
      }
    }
  }
  .question {
    position: absolute;
    right: 5px;
    top: 10px;
    cursor: pointer;
  }

</style>
