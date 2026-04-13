<template>
  <div class="text-center section">
    <v-calendar
      ref="calendar"
      class="custom-calendar max-w-full"
      :masks="masks"
      :attributes="attributes"
      disable-page-swipe
      is-expanded
      mode="range"
      @update:to-page="updateToPage"
      drag
    >
      <template v-slot:day-content="{ day, attributes }">
        <div class="flex flex-col h-full z-10 overflow-hidden">
<!--          <div>-->
<!--            <span class="day-label text-sm text-gray-900">{{ day.day }}</span>-->
<!--            <span v-if="attributes?attributes.find(attr=>attr.customData.title==='开庭时限'):false"><svg-icon icon-class="开庭公告"/></span>-->
<!--            <span v-if="attributes?attributes.find(attr=>attr.customData.title==='举证时限'):false"><svg-icon icon-class="证"/></span>-->
<!--            <span v-if="attributes?attributes.find(attr=>attr.customData.title==='应诉时限'):false"><svg-icon icon-class="诉"/></span>-->
<!--          </div>-->
<!--          <div class="flex-grow overflow-auto">-->
<!--            <div-->
<!--              v-for="attr in attributes"-->
<!--              class="text-xs leading-tight rounded-sm p-1 mt-0 mb-1"-->
<!--              :class="attr.customData.class"-->
<!--              :style="attr.customData.style"-->
<!--            >-->
<!--              <el-popover-->
<!--                placement="right"-->
<!--                :title="attr.customData.title"-->
<!--                width="300"-->
<!--                trigger="click"-->
<!--              >-->
<!--                <p style="cursor: pointer" @click="takeSee(attr.customData)">{{attr.customData.agentNum}}</p>-->
<!--                <p>创建日期 {{attr.customData.createDate}}</p>-->
<!--                <p>绝限日期 {{attr.customData.abslimitDate}}</p>-->
<!--                <p slot="reference" @contextmenu="rowContextmenu(attr.customData,$event)"> {{ attr.customData.title }}</p>-->
<!--              </el-popover>-->

<!--            </div>-->
<!--          </div>-->
        </div>
      </template>
    </v-calendar>
  </div>
</template>

<script>
  const month = new Date().getMonth();
  const year = new Date().getFullYear();
  export default {
    name: "CaleNarTitle",
    props:{

    },
    data(){
      return{
        masks: {
          weekdays: 'WWW',
        },
        attributes: [
        ],
      }
    },
    watch:{

    },
    methods:{

      updateToPage(page){
        this.$emit('updateToPage',page)
      },
      getStyle(item){
        if(item.isSign === 1) {
          return {color:'#14800B'}
        }
        if(item.isSign === 2) {
          return {color:'#c9c9c9'}
        }
        var startTime = item.abslimitDate
        startTime=new Date(startTime).getTime()
        var endTime = new Date().getTime()
        var nextDay=new Date(this.$commonUtils.formatDate(new Date(new Date().getTime() + 24*60*60*1000).toLocaleDateString())).getTime()
        if(startTime<=nextDay&&startTime>endTime){
          return {color:'#131EEA'}
        }
        if(startTime<endTime) {
          return {color:'#FB1E1E'}
        }
        return {color:'#333'}
      }
    },

  }
</script>

<style lang="scss" scoped>
  /*  ::-webkit-scrollbar {*/
  /*  width: 0px;*/
  /*}*/
  /*::-webkit-scrollbar-track {*/
  /*  display: none;*/
  /*}*/
  /deep/ .vc-weeks{
    display: none;

  }
  /deep/ .vc-grid-container.grid{
    overflow: revert;
  }
  ::-webkit-scrollbar {
    /*滚动条整体样式*/
    width : 10px;  /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }
  ::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius   : 10px;
    background-color: skyblue;
    background-image: -webkit-linear-gradient(
        45deg,
        rgba(255, 255, 255, 0.2) 25%,
        transparent 25%,
        transparent 50%,
        rgba(255, 255, 255, 0.2) 50%,
        rgba(255, 255, 255, 0.2) 75%,
        transparent 75%,
        transparent
    );
  }
  ::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
    background   : #ededed;
    border-radius: 10px;
  }
  /deep/ .custom-calendar.vc-container {
    --day-border: 1px solid #b8c2cc;
    --day-border-highlight: 1px solid #b8c2cc;
    --day-width: 90px;
    --day-height: 90px;
    --weekday-bg: #f8fafc;
    --weekday-border: 1px solid #eaeaea;
    border-radius: 0;
    width: 100%;
    & .vc-header {
      background-color: #f1f5f8;
      padding: 10px 0;
    }
    & .vc-weeks {
      padding: 0;
    }
    & .vc-weekday {
      background-color: var(--weekday-bg);
      border-bottom: var(--weekday-border);
      border-top: var(--weekday-border);
      padding: 5px 0;
    }
    & .vc-day {
      padding: 0 5px 3px 5px;
      text-align: left;
      height: var(--day-height);
      min-width: var(--day-width);
      background-color: white;
      &.weekday-1,
      &.weekday-7 {
        background-color: #eff8ff;
      }
      &:not(.on-bottom) {
        border-bottom: var(--day-border);
        &.weekday-1 {
          border-bottom: var(--day-border-highlight);
        }
      }
      &:not(.on-right) {
        border-right: var(--day-border);
      }
    }
    & .vc-day-dots {
      margin-bottom: 5px;
    }
  }
  .overflow-auto{
    overflow: auto;
  }
  .flex{
    display: flex;
    flex-direction: column;
  }
  .flex-grow{
    flex: 1;
  }
  .h-full{
    height: 100%;
  }
  .text-xs{
    background-color: #fcf4db;
    border-radius: 2px;
    cursor: pointer;
    font-size: 14px;
    margin-bottom: 5px;
  }
  .text-xs:hover{
    background-color: #ffd9b9;
    border-radius: 2px;
  }
  /deep/ .svg-icon{
    float: right;
    color: red;
  }
</style>
