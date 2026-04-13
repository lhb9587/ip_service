<template>
  <div class="container">
    <div class="main">
      <div class="main-list">
        <div class="hrm-search">
<!--          <el-date-picker-->
<!--            style="width: 300px;"-->
<!--            v-model="weekDate"-->
<!--            type="week"-->
<!--            :format="weekFormat + ' / WW 周'"-->
<!--            value-format="yyyy-MM-dd"-->
<!--            placeholder="选择周"-->
<!--            :picker-options="pickerOptions"-->
<!--            @change="handleWeekChange">-->
<!--          </el-date-picker>-->
          <DateWeekRange
            v-model="createDateArray"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="{ firstDayOfWeek: 1 }"
            format="yyyy-MM-dd/WW周"
            value-format="yyyy-MM-dd"
            @change="handleWeekChange"
          ></DateWeekRange>
          <el-button size="mini" @click="weekNews(10)">生成快讯</el-button>
          <el-button size="mini" @click="companyNewsVisible = true">快讯列表</el-button>
        </div>
        <newsList v-if="newsVisible" :date-array="createDateArray"></newsList>
      </div>
    </div>

    <el-dialog title="公司快讯" :visible.sync="companyNewsVisible" width="35%">
      <companyNewsList v-if="companyNewsVisible"></companyNewsList>
    </el-dialog>
  </div>
</template>

<script>
import { createWeekReportDoc } from '@/api/dashboard.js'
import DateWeekRange from 'date-week-range';
import {formatDate} from '@/utils'
import dateRangUtil from '@/utils/dateRangUtil'
import newsList from './components/weeklyReport/newsList'
import companyNewsList from './components/weeklyReport/companyNewsList'
export default {
  name: 'weekly_report',
  data() {
    return {
      createDateArray: [],
      weekDate: '',
      weekFormat: '',
      newsVisible: true,
      companyNewsVisible: false,
      pickerOptions: {
        firstDayOfWeek: 1,
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6
        },
        shortcuts: [
          // 获取本年已过周数的数组，倒序排列
          ...Array(this.getWeekNumber(new Date())).fill().map((_, i) => i + 1).reverse()
            .map(week => ({
              text: `第${week}周`,
              onClick: picker => {
                picker.$emit('pick', this.getWeekRange(week))
              }
            }))
        ]
      }
    }
  },
  created() {
    this.getLastWeek()
  },
  methods: {
    getFirstWeekStartDate(year) {
      const date = new Date(year, 0, 1);
      const dayOfWeek = date.getDay();
      return new Date(year, 0, 1 + (dayOfWeek <= 4 ? 1 - dayOfWeek : 8 - dayOfWeek));
    },
    getWeekRange(week) {
      const now = new Date();
      const year = now.getFullYear();
      const firstWeekStartDate = this.getFirstWeekStartDate(year);
      const startOffset = firstWeekStartDate.getDay();
      const startDate = new Date(year, 0, firstWeekStartDate.getDate() + (week - 1) * 7 - startOffset+1);
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 6);
      if (firstWeekStartDate.getFullYear() < year) {
        return null;
      }
      this.createDateArray = [formatDate(startDate),formatDate(endDate)]
      this.weekFormat = formatDate(startDate) + ' - ' + formatDate(endDate)
      const weekDate = formatDate(new Date(startDate.getTime() + (24 * 60 * 60 * 1000)));
      this.weekDate = weekDate
      return weekDate
    },
    getWeekNumber(date) {
      const onejan = new Date(date.getFullYear(), 0, 1)
      return Math.floor(((date - onejan) / 86400000 + onejan.getDay() + 1) / 7)
    },
    handleWeekChange(e) {
      this.newsVisible = false;
      this.$nextTick(() => {
        this.newsVisible = true
      })
      // if (e) {
      //   let start = new Date(e).setDate((new Date(e).getDate() - 1));
      //   let end = new Date(start).setDate((new Date(start).getDate() + 6));
      //   this.createDateArray = [formatDate(start),formatDate(end)]
      //   this.weekFormat = formatDate(start) + ' - ' + formatDate(end)
      //   this.newsVisible = false;
      //   this.$nextTick(() => {
      //     this.newsVisible = true
      //   })
      // }
    },
    // 日期处理，获取上周时间
    getLastWeek(){
      var now=new Date();
      var start=new Date();
      start.setDate(now.getDate()-7);
      var lastWeek = new dateRangUtil(start).getCurrentWeek()
      this.weekDate = formatDate(lastWeek[0])
      this.createDateArray = [formatDate(lastWeek[0]),formatDate(lastWeek[1])]
      this.weekFormat = formatDate(lastWeek[0]) + ' - ' + formatDate(lastWeek[1])
    },
    // 附件下载
    downLoad(data){
      const url = data.address
      const downData={
        url:`ipdoc${url}`,
        success(){
          // notify.close()
        }
      }
      this.$commonUtils.downLoadAll(downData)
    },
    // 导出快讯
    weekNews(checkFlag) {
      createWeekReportDoc({checkFlag: checkFlag,createDateArray:this.createDateArray}).then(res=>{
        if(res.messageType == -6){
          this.$confirm(res.message, '提示', {
            confirmButtonText: '覆盖',
            cancelButtonText: '不覆盖',
            type: 'warning'
          }).then(() => {
            this.weekNews(30)
          }).catch(() => {
            this.$message.info('已取消快讯生成！');
          });
        }else{
          if (res.data){
            this.downLoad(res.data)
            this.companyNewsVisible = true
          }else{
            this.$message('导出快讯失败！');
          }
        }
      })
    }
  },
  components:{
    DateWeekRange,
    newsList,
    companyNewsList
  }
}
</script>

<style lang="scss" scoped>
.el-date-editor{
  border: 0;
  font-weight: bold;
}
/deep/ .el-input--prefix .el-input__inner{
  border: 0;
}
/deep/ .ag-theme-balham .ag-cell{
  line-height: 34px;
}
/deep/ .huodong-color{
  background: #acddee;
}
/deep/ .shangji-color{
  background: #fad7de;
}
/deep/ .newCust-color{
  background: #c5e5e2;
}
.container {
  width: 100%;
  background-color: #F2F2F2;
}
.header{
  width: 100%;
  height: 50px;
  line-height: 50px;
  background-color: #FFFFFF;
  color: #333;
  .header-left{
    float: left;
    span{
      font-size: 18px;
      font-weight: bold;
      float: left;
    }
    img{
      height: 27px;
      margin-left: 10px;
      margin-top: 10px;
      float: right;
    }
  }
  .header-right{
    float: right;
    font-size: 14px;
    .right-desc{
      float: left;
      margin-left: 15px;
    }
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
    width: 50px;
    height: 22px;
    text-align: center;
    vertical-align: middle;
    color: #FFFFFF;
  }
}
.main{
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
  .el-select /deep/ .el-input input{
    //width: 90px;
    font-weight: bold;
    border: 0px !important;
  }
  .el-cascader {
    /deep/ .el-cascader__label{
      font-weight: bold;
    }
    /deep/ .el-input input {
      width: 300px;
      font-weight: bold;
      border: 0px !important;
    }
  }
}
.el-table{
  /deep/ th{
    padding:5px 0;
    color: rgba(51, 51, 51, 1);
    background: rgba(187, 187, 187, 0.5);
  }
  /deep/ td {
    padding: 0 ;
  }
}
/deep/ .pass-row{
  background: #c9c9c9!important;
}
.clearButton{
  position: absolute;
  right: 18px;
  top:20px;
  background: #fff;
  color: RGBA(254, 153, 23, 1);
  border: 0;
  /deep/ span{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  img{
    width: 20px;
    margin-right: 8px;
    vertical-align: middle;
  }
}
.buttonWrap{
  width: 100%;
  text-align: center;
}
.buttonWrap2{
  width: 100%;
  text-align: right;
  margin-bottom: 10px;
  margin-top: 10px;
}
.limitDayNum{
  height:30px;
  display: flex;
  position:relative;
  align-items: center;
  margin-bottom:10px;
  img {
    width: 30px;
    height: 30px
  }
  span{
    font-family: 'Nunito Sans';
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    margin-left: 2px;
    margin-right: 10px;
    color: rgb(121, 121, 121);
  }
  .el-select{
    width: 174px;
    height: 32px;
    line-height: 32px;
    margin-right: 20px;
    /deep/ .el-input__icon{
      line-height:25px
    }
    /deep/ input{
      height: 32px;
      line-height: 32px;
    }
  }
}
section{
  position: relative;
  clear: both;
  flex: 1;
}
.checkbox{
  position:absolute;
  left: 14px;
  top: 48px;
  width: 222px;
  height: 324px;
  border: 1px solid #99a9bf;
  background: #fff;
  z-index: 100;
  padding-top: 6px;
  padding-left: 6px;
}
.checkbox_bottom {
  position: absolute;
  display: flex;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 29px;
  background: #fff;
  z-index: 2;
  justify-content: flex-end;
}
.checkbox_bottom ~ li:last-of-type {
  margin-bottom: 30px;
}
.DataPicker /deep/ {
  .el-input__prefix{
    display: none;
  }
  .el-input{
    width: 100%;
  }
  .el-input__inner{

    text-align: center;

    padding: 0;
    padding-right: 18px;
    // padding-left: 10px;
  }
}
.el-form {
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .el-cascader {
    width: 100%;
  }
  .postInfo-container-item {
    /deep/ .el-form-item__content {
      width: 330px;
      display: flex;
      height: 28px;
      align-items: center;
      .el-select {
        width: 100%;
      }
      .el-input {
        width: 100%;
      }
    }
  }
}
/deep/ .button-group-search{
  position: relative;
  .searchWrap{
    border-radius: 5px;
    top: 34px;
    left: 0;
    width: 550px;
    max-height: 500px;
    position: absolute;
    background: #ffffff;
    border: 1px solid #d4d5d5;
    z-index: 1;
    overflow: auto;
    padding: 20px 0;
    box-shadow: 0 3px 6px rgba(111,111,111,0.2);
    /deep/  .el-form{
      .el-form-item__label{
        text-align: left;
        padding-left: 32px;
        font-weight: normal;
      }
      .el-form-item__content{
        display: flex;
        input{
          border-top: 0;
          border-left: 0;
          border-radius: 0;
          border-right: 0
        }
      }
    }
    .clearWrap{
      display: block;
    }
  }
}

.DataPicker /deep/ {
  .el-input__prefix {
    display: none!important;
  }
  .el-input__inner {
    text-align: left;
    padding-left: 15px;
    padding-right: 18px;
  }
}
@keyframes show {
  0% {

    opacity: 0;
    //transform: translateX(100%);

  }
  100% {
    // transform: translateX(0);
    opacity: 1;

  }
}
@keyframes hide {
  0% {
    opacity: 1;
    // transform: translateX(0);
  }
  100% {

    opacity: 0;
    //  transform: translateX(100%);
  }
}
.show-enter-active {
  animation: show 0.5s;
}
.show-leave-active {
  animation: hide 0.5s;
}
.show-enter, .show-leave-to {
  opacity: 0;
}
.button_wrap{
  margin-left:10px;
}
.searchRight{
  border-top-right-radius:3px !important;
  border-bottom-right-radius:3px !important;
  padding:0 5px;
  height: 32px
}
.dots {
  cursor: pointer;
  position: absolute;
  left: 0;
  z-index: 1;
  top: 17px;
  width: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  .dot {
    color: transparent;
    padding: 1px;
    margin: 1px;
    width: 5px;
    background: RGBA(113, 123, 140, 1);
    height: 5px;
    display: block;
  }
  & ~ span {
    margin-left: 5px;
  }
}
.brush_right{
  position: absolute;
  right: 6px;
  z-index: 1;
}

/deep/ .rotateClass {
  transform: rotate(90deg);
  transition: transform 5s ease-in-out
}

.isActive {
  background-color: #409EFF;
  color: #fff;
}
/deep/ .ag-theme-balham .ag-details-row{
  padding: 10px !important;
  background-color: #edf6ff;
}

/deep/ .el-dialog__body{
  padding: 0 20px 20px 20px
}
</style>
