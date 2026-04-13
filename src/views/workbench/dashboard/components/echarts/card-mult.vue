<template>
  <el-card class="box-card" v-loading="loading" element-loading-text="数据加载中">
    <div class="card-panel" @click="clickJump">
      <div class="show-icon">
        <el-popover
          placement="top-start"
          :title="panelName"
          width="400"
          trigger="hover">
          <svg-icon slot="reference" class="question" icon-class="问题" />
          <div v-html="panelDesc"></div>
        </el-popover>
      </div>
      <div class="card-panel-icon-left">
        <img :src="require('@/assets/card_icon/'+panelId+'.png')">
      </div>
      <div class="card-panel-description">
        <div class="card-panel-text">{{ panelName }}</div>
        <div class="card-panel-list">
          <div v-for="key in Object.keys(cardData).length" :key="key" class="card-panel-item">
            {{colName[key-1]}}
            <span>{{cardData['number'+key]}}</span>
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import { getChartData } from '@/api/dashboard.js'
export default {
  name: 'ScardMult',
  props: [ 'panelId', 'selectedYear'],
  data() {
    return {
      panelName: '',
      cardData: [],
      panelDesc: '',
      colName: [],
      loading: true, // 数据加载效果
    }
  },
  created() {
    this.getChartData()
  },
  methods:{
    getChartData() {
      this.loading = true
      const params = { panelId: this.panelId };
      if (this.selectedYear) {
        params.singleYear = this.selectedYear;
      }
      getChartData(params).then(res => {
        if (res.data) {
          this.panelName = res.data.panelName
          this.panelDesc = res.data.panelDesc ? res.data.panelDesc.replace(/\r\n/g,'<br/>') : ''
          this.colName = res.data.colName ? res.data.colName.split('#') : []
          var chartDatas = res.data.chartDatas
          this.cardData = chartDatas
        }
        this.loading = false
      })
    },
    clickJump() {
      console.log('点击跳转')
    }
  }
}
</script>

<style lang="scss" scoped>
.show-icon {
  cursor: pointer;
  width: 35px;
  height: 35px;
  text-align: center;
  background-color: #5aaafa;
  color: #fff;
  float: right;
  font-size: 12px;
  padding: 3px 0px 2px 18px;
  clip-path: polygon(100% 100%, 0 0, 0 0, 100% 0);
}
.box-card /deep/ .el-card__body{
  padding: 0;
}
.card-panel {
  height: 140px;
  //cursor: pointer;
  font-size: 12px;
  position: relative;
  overflow: hidden;
  color: #666;
  background: #fff;
  box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
  border-color: rgba(0, 0, 0, .05);

  &:hover {

    .icon-message {
      background: #36a3f7;
    }

    .icon-money {
      background: #f4516c;
    }

    .icon-shopping {
      background: #34bfa3
    }
  }


  .icon-message {
    color: #36a3f7;
  }

  .icon-money {
    color: #f4516c;
  }

  .icon-shopping {
    color: #34bfa3
  }
  .card-panel-icon-left{
    width: 20%;
    float: left;
    padding: 4em 1em;
    transition: all 0.38s ease-out;
    border-radius: 6px;
  }
  .card-panel-icon-left img{
    width: 70%;
    padding-left: 15%;
  }

  .card-panel-icon {
    float: left;
    font-size: 48px;
  }

  .card-panel-description {
    width: 80%;
    //height: 100%;
    float: left;
    padding: 0 1em;
    margin-left: 0px;

    .card-panel-text {
      line-height: 18px;
      color: #808080;
      text-align: center;
      font-size: 18px;
      margin-bottom: 5%;
    }

    .card-panel-number {
      float: left;
      color: #000000;
      font-size: 2em;
    }

    .card-panel-list {
      .card-panel-item {
        text-align: center;
        width: 33.3%;
        float: left;
        font-size: 16px;
        line-height: 16px;
        span {
          display: block;
          margin-top: 10px;
          color: #000000;
        }
      }
    }

    .card-panel-num {
      font-size: 20px;
    }
  }
}

@media screen and (min-width: 1200px) and (max-width: 1500px) {
  .card-panel-description {
    .card-panel-text{
      font-size: 16px !important;
    }
    .card-panel-list .card-panel-item{
      font-size: 12px !important;
    }
  }
}

@media (max-width:1000px) {
  .card-panel-icon-left {
    display: none;
  }
  .card-panel-description {
    width: 100% !important;
    .card-panel-text{
      font-size: 16px !important;
    }
    .card-panel-list .card-panel-item{
      font-size: 12px !important;
    }
  }
}

</style>
