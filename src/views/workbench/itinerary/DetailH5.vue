<template>
  <div>
    <div class="tabbar">查看日程</div>
    <div class="content">
      <div class="status">
        <div><span
          style="display: inline-block;margin:0 10px;height: 10px;width: 10px;border-radius: 50%;background-color: #008000"></span>{{data.title}}
        </div>
      </div>
      <div class="content-case">
        <div class="case-row" v-for="(item, key) of detailInfo" :key="key">
          <div class="row-left">{{keyValue[key]}}</div>
          <div class-="row-right">{{detailInfo[key]}}</div>
        </div>
      </div>
    </div>
    <div class="foot fl-ac-jc">
      <el-button type="primary" size="small" v-if="isBack === '1'" @click="goBack">返 回</el-button>
      <el-button type="primary" size="small" @click="closeWindow">关 闭</el-button>
    </div>
  </div>
</template>

<script>
  import {queryItineraryDetail} from "../../../api/schedule";

  export default {
    name: "DetailH5",
    data() {
      return {
        isBack: false,
        detailInfo: {
          activities: '', // 活动
          site: '', // 地点
          itStartDate: '', // 开始时间
          itEndDate: '', // 结束时间
          gift: '', // 礼品
          personList: '', // 人员
          custList: '', // 关联客户
          details: '', // 活动描述
          memo: '', // 活动备注
        },
        keyValue: {
          activities: '活动',
          site: '地点',
          itStartDate: '开始时间',
          itEndDate: '结束时间',
          gift: '礼品',
          personList: '人员',
          custList: '关联客户',
          details: '活动描述',
          memo: '活动备注',
        },
        itId: '',
        data: {}
      }
    },
    created() {
      this.itId = this.$route.query && this.$route.query.itId
      this.isBack = this.$route.query && this.$route.query.isBack
      this.itId && this.queryDetail()
    },
    methods: {
      goBack() {
        this.$router.go(-1)
      },
      closeWindow() {
        window.location.href = "about:blank";
        window.close();
      },
      queryDetail() {
        queryItineraryDetail({
          itId: this.itId
        }).then(res => {
          this.data = res.data
          for (let key in this.detailInfo) {
            this.detailInfo[key] = res.data[key]
          }
          if (this.detailInfo.personList && this.detailInfo.personList.length) {
            const sortedNames = this.detailInfo.personList
              .map(item => item.userName)
              .sort((a, b) => a.localeCompare(b, 'zh-Hans-CN', { sensitivity: 'accent' }));
            const sortedNamesString = sortedNames.join(',');
            this.detailInfo.personList = sortedNamesString
          } else {
            this.detailInfo.personList = ''
          }
          if (this.detailInfo.custList && this.detailInfo.custList.length) {
            this.detailInfo.custList = this.detailInfo.custList.map(item => item.custName).join(',')
          } else {
            this.detailInfo.custList = ''
          }
        })
      }
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
    background-color: #F7F7F7;
    padding-top: 45px;
    padding-bottom: 45px;
    font-size: 14px;
    overflow: auto;

    .status {
      width: 100%;
      padding: 10px 0;

      div {
        padding: 10px;
        background-color: #fff;
      }
    }

    .content-case {
      /*height: 900px;*/
      /*width: 100%;*/
      margin: 0px 10px 10px 10px;
      background-color: #fff;
      border-radius: 10px;
      padding: 0 10px 0 10px;
      font-size: 13px;
    }


    .case-row, .fee-title, .fee-content-item {
      display: flex;
      justify-content: space-between;
      line-height: 35px;
      border-bottom: 1px solid #EBEEF5;

      .row-left {
        margin-right: 10px;
        flex-shrink: 0;
      }

      &:last-child {
        border: none;
      }
    }

    .fee-content-item {
      justify-content: left;
      border: none;
      line-height: 20px;

      .row-left {
        margin-right: 5px;
      }
    }

    .fee-title {
      border: none;

      .row-left {
        color: #52A0F5;
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
