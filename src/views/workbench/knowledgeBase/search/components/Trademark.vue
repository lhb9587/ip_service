<template>
  <el-row>

      <div class="avatar1" >
        <img  class="avatar" :src="'tmFile'+item.imgFilePath" alt="">
      </div>


<div>


      <p style="color: #6AA7FF;"> <span v-html="filterKeyLight(item.tmName)" style="cursor: pointer;font-size: 18px;margin-right:15px" >
                </span>
        <span style="cursor: pointer;font-size: 14px;">注册号：</span><span v-html="filterKeyLight(item.regNumber)" style="cursor: pointer;" @click="pushtodetail(item)">
                </span>
      </p>

      <p style="font-size: 14px;">申请人中文名称： <span style="margin-right:15px" v-html="filterKeyLight(item.applicantName)"> </span></p>
      <p>   申请日期： <span>{{item.appDate}}</span></p>

      <p style="font-size: 14px;">
        初审公告日期：<span style="margin-right:15px">{{item.approvalDate}}</span></p><p>初审公告期号：<span style="margin-right:15px">{{item.approvalNumber}}</span></p><p>注册公告期号：<span
        style="margin-right:15px">{{item.regnoticeNumber}}</span></p><p>注册公告日期：<span>{{item.regNoticeDate}}</span></p>

      <p style="font-size: 14px;"> 商品服务类别： <span>{{ item.tmType }}</span></p>

      <el-tag class="tag" :type="tagitems[item.status]" effect="dark">{{item.status}}</el-tag>

</div>
  </el-row>
</template>

<script>
  export default {
    props:{
      item:{

      }
    },
    name: "Trademark",
    data(){
      return{
        tagitems: {
          已注册: "success",
          申请中: "",
          已无效: "info"
        },
      }
    },
    methods:{
      filterKeyLight(text) {
        if (!this.searchInput) return text;
        if (!text) return text;
        const result = text.replace(
          new RegExp(this.searchInput, "g"),
          `<span style='color: red !important;background-color: yellow !important;'>${this.searchInput}</span>`
        );
        return result;
      },
    }
  }
</script>

<style lang="scss" scoped>
  .el-row {
    margin-bottom: 5px;
    display: flex;
  }
  .el-row:last-child {
    margin-bottom: 0;
  }
  .avatar {
    width: 70px;
    height: 70px;
    display: block;
    cursor: pointer;
  }
  .avatar1 {
    width: 72px;
    height: 72px;
    display: block;
    border: 1px solid #d4d5d5;
    margin-right: 20px;
  }
  .tag {
    position: absolute;
    right: 0px;
    top: 0px;
  }
  p {
    margin-bottom: 10px;
  }
  .primary_title {
    color: red !important;
    background-color: yellow !important;
  }
</style>
