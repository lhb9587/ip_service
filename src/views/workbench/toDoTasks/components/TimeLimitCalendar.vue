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
          <div>
            <span class="day-label text-sm text-gray-900">{{ day.day }}</span>
<!--            <span v-if="attributes?attributes.find(attr=>attr.customData.title==='开庭时限'):false"><svg-icon icon-class="开庭公告"/></span>-->
<!--            <span v-if="attributes?attributes.find(attr=>attr.customData.title==='举证时限'):false"><svg-icon icon-class="证"/></span>-->
<!--            <span v-if="attributes?attributes.find(attr=>attr.customData.title==='应诉时限'):false"><svg-icon icon-class="诉"/></span>-->
          </div>
          <div class="flex-grow overflow-auto">
          <RecycleScroller
            class="scroller"
            :items="attributes?attributes:[]"
            :item-size="20"
            key-field="key"
            v-slot="{ item }"
          >
            <div  class="text-xs leading-tight rounded-sm p-1 mt-0 mb-1"
                            :class="item.customData.class"
                            :style="item.customData.style"
              >
                  <el-popover
                    placement="right"
                    :title="item.customData.title"
                    width="300"
                    trigger="click"
                    :key="item.key"
                  >
                    <p style="cursor: pointer" @click="takeSee(item.customData)">{{item.customData.agentNum}}</p>
                    <p>创建日期 {{item.customData.createDate}}</p>
                    <p>绝限日期 {{item.customData.abslimitDate}}</p>
                    <p slot="reference" @contextmenu="rowContextmenu(item.customData,$event)" style="display: flex;align-items: center;justify-content: left">
                      <span v-if="item.customData.typeName=='开庭时限'"><svg-icon icon-class="开庭公告"/></span>
                      <span v-if="item.customData.typeName=='举证时限'"><svg-icon icon-class="证"/></span>
                      <span v-if="item.customData.typeName=='应诉时限'"><svg-icon icon-class="诉"/></span>
                      <span style="padding-left: 30px">{{ item.customData.title }}</span>
                    </p>
                  </el-popover>
            </div>
          </RecycleScroller>
        </div>

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
<!--                >-->
<!--                <p style="cursor: pointer" @click="takeSee(attr.customData)">{{attr.customData.agentNum}}</p>-->
<!--                <p>创建日期 {{attr.customData.createDate}}</p>-->
<!--                <p>绝限日期 {{attr.customData.abslimitDate}}</p>-->
<!--                <p slot="reference" @contextmenu="rowContextmenu(attr.customData,$event)" style="display: flex;align-items: center;justify-content: left">-->
<!--                  <span v-if="attr.customData.typeName=='开庭时限'"><svg-icon icon-class="开庭公告"/></span>-->
<!--                  <span v-if="attr.customData.typeName=='举证时限'"><svg-icon icon-class="证"/></span>-->
<!--                  <span v-if="attr.customData.typeName=='应诉时限'"><svg-icon icon-class="诉"/></span>-->
<!--                  <span style="padding-left: 30px">{{ attr.customData.title }}</span>-->
<!--                </p>-->
<!--              </el-popover>-->

<!--            </div>-->
<!--          </div>-->
        </div>
      </template>
    </v-calendar>
  </div>
</template>

<script>
  import { RecycleScroller } from 'vue-virtual-scroller'
  import {getTimelimitList} from '@/api/caseList.js'
  const month = new Date().getMonth();
  const year = new Date().getFullYear();
  export default {
    name: "TimeLimitCalendar",
    props:{
      exportQueryModel:{

      }
    },
    data(){
      return{
        masks: {
          weekdays: 'WWW',
        },
        items:[
          {
            id: 1,
            label: 'Title',
            size: 64,
          },
          {
            id: 2,
            label: 'Foo',
            size: 32,
          },
          {
            id: 3,
            label: 'Bar',
            size: 32,
          },
        ],
        attributes: [
          // {
          //   key: 1,
          //   customData: {
          //     title: 'Lunch with mom.',
          //     class: 'bg-red-600 text-white',
          //   },
          //   dates: new Date(year, month, 1),
          // },
          // {
          //   key: 2,
          //   customData: {
          //     title: 'Take Noah to basketball practice',
          //     class: 'bg-blue-500 text-white',
          //   },
          //   dates: new Date(year, month, 2),
          // },
          // {
          //   key: 3,
          //   customData: {
          //     title: "Noah's basketball game.",
          //     class: 'bg-blue-500 text-white',
          //   },
          //   dates: new Date(year, month, 5),
          // },
          // {
          //   key: 4,
          //   customData: {
          //     title: 'Take car to the shop',
          //     class: 'bg-indigo-500 text-white',
          //   },
          //   dates: new Date(year, month, 5),
          // },
          // {
          //   key: 4,
          //   customData: {
          //     title: 'Meeting with new client.',
          //     class: 'bg-teal-500 text-white',
          //   },
          //   dates: new Date(year, month, 7),
          // },
          // {
          //   key: 5,
          //   customData: {
          //     title: "Mia's gymnastics practice.",
          //     class: 'bg-pink-500 text-white',
          //   },
          //   dates: new Date(year, month, 11),
          // },
          // {
          //   key: 6,
          //   customData: {
          //     title: 'Cookout with friends.',
          //     class: 'bg-orange-500 text-white',
          //   },
          //   dates: { months: 5, ordinalWeekdays: { 2: 2 } },
          // },
          // {
          //   key: 7,
          //   customData: {
          //     title: "Mia's gymnastics recital.",
          //     class: 'bg-pink-500 text-white',
          //   },
          //   dates: new Date(year, month, 22),
          // },
          // {
          //   key: 8,
          //   customData: {
          //     title: 'Visit great grandma.',
          //     class: 'bg-red-600 text-white',
          //   },
          //   dates: new Date(year, month, 25),
          // },
        ],
      }
    },
    watch:{
      'exportQueryModel'(n,o){

        if(n){
          this.getTimelimitList()
        }

      }
    },
    methods:{
      takeSee(row) {
        this.$router.push(`/workbench/seeTimeLimit/${row.tltId}`)
      },
      updateToPage(page){
        const data = {...page, ...this.$commonUtils.cleanNullAttr(JSON.parse(this.exportQueryModel)), ...{pageNo:1,pageSize:100000}}
        getTimelimitList(data).then(res=> {
          this.attributes = res.data.map(item => {
            return {
              key: item.tltId,
              customData: {...{
                title: item.typeName,
                style:this.getStyle(item)
              },...item},
              dates: new Date(item.abslimitDate)
            }
          })
        })
      },
      getTimelimitList(){
        const data = {...JSON.parse(this.exportQueryModel),...{year,month:month+1,pageNo:1,pageSize:100000}}
        if(data.abslimitDateStart){
          data.month=data.abslimitDateStart.substring(5,7)
          data.year=data.abslimitDateStart.substring(0,4)
          this.$refs.calendar.showPageRange(new Date(data.abslimitDateStart))
        }else {
          this.$refs.calendar.showPageRange(new Date())
        }

        getTimelimitList(data).then(res=>{
          this.attributes=res.data.map(item=>{
           return {
             key:item.tltId,
             customData: {...{
                 title: item.typeName,
                 style:this.getStyle(item)
               },...item},
             dates: new Date(item.abslimitDate),
            }
          })
          if(this.attributes.length){
            this.$refs.calendar.showPageRange(data)
          }
        })
      },
      getRowContextmenuList(row){
        return [
          // { name: '复制', action: 'copy' },
          { name: '核销', action: 'confirmExact', permissions:38, isSign:0},
          { name: '审核', action: 'takeExamine', permissions:41, isSign:1 },
          { name: '修改', action: 'takemodify', permissions:125, kind:1},
          { name: '修改', action: 'takemodify', permissions:126, kind:2},
          { name: '删除', action: 'delTimelimit', permissions:127, kind:1 },
          { name: '删除', action: 'delTimelimit', permissions:128, kind:2 },
          { name: '撤销', action: 'revocationTimelimitWriteoff',permissions:227, isRevocation:true }].filter(item=>{
          if(item.permissions){
            if(item.isRevocation){
              return this.$store.getters.permissions.includes(item.permissions)|| row.isRevocation
            }else {
              return this.$store.getters.permissions.includes(item.permissions)&&(row.isSign==item.isSign||row.kind==item.kind)
            }
          }else {
            return true
          }
        })
      },
      rowContextmenu(row, event) {
        const that=this
        this.$ContextMenu({
          event, // 传入鼠标事件
          menu:this.getRowContextmenuList(row)
        }).then(rs => {
          if(rs){
            this.$emit('action',rs,row)
          }
        });
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
    components:{
      'RecycleScroller': RecycleScroller
    }

  }
</script>

<style lang="scss" scoped>
  /*  ::-webkit-scrollbar {*/
  /*  width: 0px;*/
  /*}*/
  /*::-webkit-scrollbar-track {*/
  /*  display: none;*/
  /*}*/
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
  .scroller {
    height: 100%;
  }
</style>
