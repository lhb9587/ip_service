<template>
    <div>
      <div class="flexAble">
        <div class="firstArtice">
          <img class="firstImg" src="" alt="">

          <div class="userInfo" >
            <img src="" class="userIcon" alt="">
            <span class="userName">userName</span>
          </div>
          <div class="title">
            title
          </div>
          <div class="content">
            content
          </div>
          <div class="bottom">
            <span class="sj">Read More</span>
          </div>
        </div>
        <div>
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
          <img src="" alt="">
        </div>
        </div>
      </div>
      <div></div>
    </div>
</template>

<script>
export default {
  name: "Headlines"
}
</script>

<style lang="scss"  scoped>
.flexAble{
  display: flex;
  .firstArtice{
    width: 280px;
    .firstImg{
      width: 260px;
      height: 200px;
    }
    .userInfo{
      .userIcon{
        width: 16px;
        height: 16px;
        border-radius: 50%;
      }
      .userName{
        font-size: 12px;
        line-height: 20px;
        color: #212224;
      }
    }
    .title{
      line-height: 32px;
      height: 64px;
      font-size: 16px;
      overflow: hidden;
      color: #212224;
      font-weight: bold;
      text-overflow: -o-ellipsis-lastline;
      text-overflow: ellipsis;
      -webkit-line-clamp:2; /*控制文本行数，多少行以后开始省略号 */
      line-clamp:2;
      -webkit-box-orient: vertical;
    }
    .content{
      line-height: 18px;
      height: 36px;
      font-size: 14px;
      color: #212224;
    }
    .bottom{
      line-height: 20px;
      color: #9b958d;
      font-size: 12px;
    }
  }
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
          line-height: 20px;
          color: #212224;
        }
      }
      .title{
        line-height: 20px;
        font-size: 16px;
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
}
</style>
