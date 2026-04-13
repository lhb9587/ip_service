<template>
  <div>
    <h5>阅读历史</h5>
    <div class="item_wrap">
      <div class="item_left">
        <div class="userInfo" >
          <img src="" class="userIcon" alt="">
          <span class="userName">userName</span>
        </div>
        <div class="title">
          title
        </div>
        <div class="bottom">
          <span class="sj">2020-01-01</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ReadingList"
}
</script>

<style lang="scss" scoped>
  .item_wrap{
    display: flex;
    justify-content: space-between;
    width: 450px;
    .item_left{
      width:290px;
      padding-left: 10px;
      .userInfo{
        .userIcon{
          width: 16px;
          height: 16px;
          border-radius: 50%;
        }
        .userName{
          font-size: 12px;
          line-height: 30px;
          color: #212224;
        }
      }
      .title{
        line-height: 32px;
        font-size: 14px;
        color: #212224;
        font-weight: bold;
      }
      .bottom{
        line-height: 20px;
        color: #9b958d;
        font-size: 12px;
      }
    }
  }
</style>
