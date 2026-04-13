<template>
  <div>
    <div class="tabbar">{{list[0]&&list[0].title}}日程</div>
    <div class="content">
      <div class="card" v-for="(item, index) in list" :key="index" @click="goToDetail(item)">
        <div class="title">{{item.activities}}</div>
        <div><span class="el-icon-location-outline"></span><span style="margin-left: 5px">{{item.site}}</span></div>
        <div><span class="el-icon-alarm-clock"><span style="margin-left: 5px">{{item.itDate}} {{item.itStartTime}}-{{item.itEndTime}}</span></span></div>
        <div><span class="el-icon-user"><span style="margin-left: 5px">{{item.personList.map(it => it.userName).join(',')}}</span></span></div>
      </div>
    </div>

    <div class="foot fl-ac-jc">
      <el-button type="primary" size="small" @click="closeWindow">关 闭</el-button>
    </div>
  </div>
</template>

<script>
  import {queryItineraryDetail, queryItineraryList} from "../../../api/schedule";

  export default {
    name: "ListH5",
    data() {
      return {
        list: [],
        itStartDate: '',
        itEndDate: '',
        meId: ''
      }
    },
    created() {
      this.itStartDate = this.$route.query && this.$route.query.itStartDate
      this.itEndDate = this.$route.query && this.$route.query.itEndDate
      this.meId = this.$route.query && this.$route.query.meId
      this.queryList()
    },
    methods: {
      goToDetail(item) {
        this.$router.push(`/workbench/platformData/itinerary_detail?itId=${item.itId}&isBack=1`)
      },
      closeWindow() {
        window.location.href = "about:blank";
        window.close();
      },
      queryList() {
        queryItineraryList({
          createDateArray: [this.itStartDate, this.itEndDate],
          meId: this.meId,
          pageNo: 1,
          pageSize: 999
        }).then(res => {
          this.list = res.data
        })
      },
    }
  }
</script>

<style scoped lang="scss">
  .tabbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 45px;
    background-color: #52A0F5;
    color: #fff;
    text-align: center;
    font-size: 16px;
    line-height: 45px;
    font-weight: bold;
  }

  .content {
    height: 100vh;
    /*background-color: #EBECF0;*/
    background-color: #F7F7F7;
    padding-top: 45px;
    padding-bottom: 45px;
    font-size: 14px;
    overflow: auto;
    .card{
      cursor: pointer;
      margin: 10px;
      background-color: #fff;
      border-radius: 3px;
      padding: 5px;
      .title{
        font-size: 16px;
        font-weight: bold;
      }
    }
  }

  .foot {
    padding-bottom: 10px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #F7F7F7;

    .el-button {
      width: 25%;
    }
  }
</style>
