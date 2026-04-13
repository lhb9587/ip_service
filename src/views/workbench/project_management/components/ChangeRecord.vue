<template>
<div>
  <div v-for="item in taskHistoryList">
    <div class="item_wrap">
      <div class="item_wrap_header">
        <span class="item_header_corB">
          <UserIconAndUserName :user-id="item.operator" ></UserIconAndUserName>
        </span>
        <span v-if="item.optName">进行了<span class="item_header_corB">{{item.optName}}</span>的操作 </span>
        <span class="createDate">{{item.createDate}}</span>
      </div>
      <div v-html="item.remark"></div>
    </div>

  </div>
</div>
</template>

<script>
  export default {
    props:{
      taskHistoryList:{
        default:()=>([])
      }
    },
    name: "ChangeRecord"
  }
</script>

<style lang="scss" scoped>
  .item_wrap_header{
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    position: relative;
  }
.item_header_corB{
  color: #3b73af;

}
.item_wrap{
  font-size: 12px;
  /*height: 25px;*/
 margin-bottom: 10px;
}
  .createDate{
    position: absolute;
    right: 0
  }
</style>
