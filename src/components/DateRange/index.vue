<template>
  <div>
    <date-picker :disabled="disabled" v-model="newlovingVue" @change="change" :shortcuts="shortcuts" :append-to-body="false" range placeholder="日期选择" value-type="YYYY-MM-DD">
    </date-picker>
  </div>

</template>

<script>
  import dateRangUtil from '@/utils/dateRangUtil'
  import DatePicker from 'vue2-datepicker'
  import 'vue2-datepicker/index.css';
  import 'vue2-datepicker/locale/zh-cn';
  function getLast(cur){ //cur 当前时间
    var firstDay = new Date(cur.getFullYear() + '/' + (cur.getMonth()+1) + '/' + cur.getDate() + ' 00:00:00');
    firstDay.setDate(1);
//月末
    var lastDay = new Date(+firstDay);
    lastDay.setMonth(lastDay.getMonth() + 1);
    lastDay.setDate(0);

    return [firstDay,lastDay];
  }
  export default {
    name: "index",
    methods:{
      change(newVal){
        this.$emit('change',newVal)
      }
    },
    props: {
      lovingVue: {
        default: () => []
      },
      disabled:{

      }
    },
    model:{
      prop: 'lovingVue',
      event: 'change'
    },
    data() {
      return {
        newlovingVue: this.lovingVue,
        shortcuts: [
          {
            text: '昨日',
            onClick() {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              return [date,date];
            },
          },
          {
            text: '今日',
            onClick() {
              const date = new Date();
              // return a Date
              return [date,date];
            },
          },
          {
            text: '上周',
            onClick() {
              var now=new Date();
              var start=new Date();
              start.setDate(now.getDate()-7);
              return  new dateRangUtil(start).getCurrentWeek()
            },
          },
          {
            text: '本周',
            onClick() {
              //获得本月的开始日期
              var now=new Date();
              var start=new Date();
              var end=new Date();
              var n=now.getDay();
              start.setDate(now.getDate()-n+1);
              end.setDate(now.getDate()-n+7);
              // start = start.getFullYear() + "-" + (start.getMonth()+1) + "-" + start.getDate();
              // end = end.getFullYear() + "-" + (end.getMonth()+1) + "-" + end.getDate();
              // alert("本周bai开du始zhi于:"+start+",结束dao于"+end);
              return new dateRangUtil().getCurrentWeek() //getCurrentWeek[start,end];
            },
          },
          {
            text: '上月',
            onClick() {
              var now=new Date();
              now.setMonth(now.getMonth()-1)
              return new dateRangUtil(now).getCurrentMonth()

            },
          },
          {
            text: '本月',
            onClick() {
              return  new dateRangUtil().getCurrentMonth()// getLast(new Date());
            },
          },
          {
            text: '上季度',
            onClick() {
              var now=new Date();
              now.setMonth(now.getMonth()-3)
              return new dateRangUtil(now).getCurrentSeason()
            },
          },
          {
            text: '本季度',
            onClick() {
            let arr=  new dateRangUtil().getCurrentSeason()
              return arr
            },
          },
          {
            text: '去年',
            onClick() {
              var now=new Date();
              now.setFullYear(now.getFullYear()-1)
              return new dateRangUtil(now).getCurrentYear();

            },
          },
          {
            text: '今年',
            onClick() {
              return new dateRangUtil().getCurrentYear();
            },
          },
          {
            text: '过去7天',
            onClick() {
              const date = new Date();
              date.setTime(date.getTime() - (3600 * 1000 * 24*7));
              return [date,new Date()];
            },
          },
          {
            text: '过去30天',
            onClick() {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24*30);
              return  [date,new Date()];
            },
          },
          {
            text: '不限时间',
            onClick() {
              return [];
            },
          },
        ],
      }
    },
    watch:{
      newlovingVue: function(newVal,oldVal){

      },
      lovingVue(n) {
        this.newlovingVue = n
      }
    },
    components:{
      DatePicker
    }
  }
</script>

<style lang="scss" scoped>
/deep/ .mx-datepicker-sidebar{
  position: relative;
  width:120px;
  .mx-btn{
    float: left;
    padding: 0 20px 4px 6px;
  }
  .mx-btn:nth-of-type(1){
    padding-top: 40px;
  }
  .mx-btn:nth-of-type(2){
    padding-top: 40px;
  }
  &:before{
    position: absolute;
    content: '快速选择';
    display: block;
    width: 100%;
    height: 40px;
    /*text-align: center;*/
    line-height: 40px;
    left: 0;
    right: 0;
    text-indent: 12px;
    color: #333;
    font-size: 15px;
  }
}
/deep/.mx-datepicker-sidebar+.mx-datepicker-content{
  margin-left: 120px;
}
  /deep/.mx-datepicker-popup {
    border-radius: 10px;
  }
</style>
