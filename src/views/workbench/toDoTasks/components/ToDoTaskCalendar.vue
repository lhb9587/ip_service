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
      drag
    >
      <template v-slot:day-content="{ day, attributes }">
        <div class="flex flex-col h-full z-10 overflow-hidden">
          <span class="day-label text-sm text-gray-900">{{ day.day }}</span>
          <div class="flex-grow overflow-auto">
            <div
              v-for="attr in attributes"
              class="text-xs leading-tight rounded-sm p-1 mt-0 mb-1"
              :class="attr.customData.class"
              :style="attr.customData.style"
            >
              <el-popover
                placement="right"
                :title="attr.customData.title"
                width="300"
                trigger="click"
                >
                <p>案件文号:{{attr.customData.agentNum}}</p>
                <p>截止日期: {{format(attr.customData.endDate)}}</p>
                <p>分配人: {{attr.customData.assigneeName}}</p>
                <p>执行人: {{attr.customData.executorName}}</p>

<!--                <p>绝限日期 {{attr.customData.abslimitDate}}</p>-->
                <p v-if="attr.customData.isOut==0" slot="reference" @contextmenu="rowContextmenu(attr.customData,$event)"> {{ attr.customData.title }}</p>
                <p v-else slot="reference"> {{ attr.customData.title }}</p>
              </el-popover>

            </div>
          </div>
        </div>
      </template>
    </v-calendar>
  </div>
</template>

<script>
  import {getTimelimitList, queryToDoTask} from '@/api/caseList.js'
  const month = new Date().getMonth();
  const year = new Date().getFullYear();
  export default {
    name: "ToDoTaskCalendar",
    props: {
      // isRemind: {
      //   type: Number,
      //   default: 0
      // },
      outData: {},
      getData: {},
      taskId: ''
    },
    data(){
      return{
        masks: {
          weekdays: 'WWW',
        },
        attributes: [
          // {
          //   key: 1,
          //   customData: {
          //     title: 'Lunch with mom.',
          //     class: 'bg-red-600 text-white',
          //   },
          //   dates: new Date(year, month, 1),
          // },
        ],
      }
    },
    computed: {
    },
    watch:{
      // isRemind(n, o) {
      //   if(n==1){
      //     this.attributes = this.attributes.filter(item=>item.remind>0)
      //     this.$forceUpdate()
      //   }
      // }
      getData(n, o) {
        if(n) {
          this.init(this.outData, n)
        }
      }
    },
    created() {
      // this.queryToDoTask()
      this.init(this.outData.filter(i=>!!i), this.getData.filter(i=>!!i))
    },
    methods:{
      init(a,b) {
        if(a.length>0){
          a.forEach(item=>{
            item.isOut = 1
          })
        }
        if(b.length>0){
          b.forEach(item=>{
            item.isOut = 0
          })
        }
        this.attributes = [...a, ...b].map(item => {
          return {
            key: item.taskId,
            customData: {...{
                title: item.taskName,
                style:this.getStyle(item)
              },...item},
            dates: new Date(this.format(item.endDate))
          }
        })
        if(this.taskId){
          this.attributes.forEach((item,index)=>{
            if(item.customData.taskId == this.taskId){
              this.attributes.splice(index,1)
              this.attributes.unshift(item)
              item.key = 1
            }
          })
        }
      },
      add0(m){
         return m<10?'0'+m:m
       },
      format(shijianchuo) {
        //shijianchuo是整数，否则要parseInt转换
        var time = new Date(shijianchuo);
        var y = time.getFullYear();
        var m = time.getMonth()+1;
        var d = time.getDate();
        // var h = time.getHours();
        // var mm = time.getMinutes();
        // var s = time.getSeconds();
        return y+'-'+this.add0(m)+'-'+this.add0(d)
      },
      takeSee(row) {
        // this.$router.push(`/workbench/seeTimeLimit/${row.tltId}`)
      },
      // updateToPage(page){
      //   const data = {...page,...{pageNo:1,pageSize:100000}}
      //   getTimelimitList(data).then(res=> {
      //     this.attributes = res.data.map(item => {
      //       return {
      //         key: item.tltId,
      //         customData: {...{
      //           title: item.typeName,
      //           style:this.getStyle(item)
      //         },...item},
      //         dates: new Date(item.abslimitDate)
      //       }
      //     })
      //   })
      // },
      // queryToDoTask() {
      //   Promise.all([queryToDoTask({taskType: 1}),queryToDoTask({taskType: 2, pageSize: this.$store.getters.total})]).then(res=>{
      //     this.outData = res[0].data
      //     this.outData.forEach(item=>{
      //       item.isOut = 1
      //     })
      //     this.getData = res[1].data
      //     this.getData.forEach(item=>{
      //       item.isOut = 0
      //     })
      //       console.log('+++++++++++++++')
      //       console.log(this.isRemind)
      //       console.log('+++++++++++++++')
      //     if(this.isRemind==true){
      //       console.log('+++++++++++++++')
      //       console.log(this.isRemind)
      //       console.log('+++++++++++++++')
      //       this.attributes = this.attributes.filter(item=>item.remind>0)
      //     }
      //     this.attributes = [...this.outData, ...this.getData].map(item => {
      //       return {
      //         key: item.taskId,
      //         customData: {...{
      //           title: item.taskName,
      //           style:this.getStyle(item)
      //         },...item},
      //         dates: new Date(this.format(item.endDate))
      //       }
      //     })
      //   })
      // },
      getTimelimitList(){
        // const data = {...JSON.parse(this.exportQueryModel),...{year,month:month+1,pageNo:1,pageSize:100000}}
        // if(data.abslimitDateStart){
        //   data.month=data.abslimitDateStart.substring(5,7)
        //   data.year=data.abslimitDateStart.substring(0,4)
        //   this.$refs.calendar.showPageRange(new Date(data.abslimitDateStart))
        // }else {
        //   this.$refs.calendar.showPageRange(new Date())
        // }

        // getTimelimitList(data).then(res=>{
        //   this.attributes=res.data.map(item=>{
        //    return {
        //      key:item.tltId,
        //      customData: {...{
        //          title: item.typeName,
        //          style:this.getStyle(item)
        //        },...item},
        //      dates: new Date(item.abslimitDate),
        //     }
        //   })
        //   if(this.attributes.length){
        //     this.$refs.calendar.showPageRange(data)
        //   }
        // })
      },
      getRowContextmenuList(row){
        if(row.nextOperation == 2) {
          return [
          // { name: '提交', action: 'submitTask'}
          ]
        }else if(row.nextOperation == 3) {
          return [
          // { name: '审核通过', action: 'auditTask'},
          // { name: '审核不通过', action: 'NoAuditTask'}
          ]
        }else{
          return true
        }
        // return [
        //   { name: '提交', action: 'submitTask', nextOperation},
        //   { name: '审核通过', action: 'auditTask'},
        //   { name: '审核不通过', action: 'NoAuditTask'}].filter(item=>{
        //   if(item.permissions){
        //     if(item.isRevocation){
        //       return this.$store.getters.permissions.includes(item.permissions)|| row.isRevocation
        //     }else {
        //       return this.$store.getters.permissions.includes(item.permissions)&&(row.isSign==item.isSign||row.kind==item.kind)
        //     }
        //   }else {
        //     return true
        //   }
        // })
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
        if(item.isOut === 1) {
          if(item.taskId == this.taskId) {
            return {fontSize: '14px',color:'#363636',backgroundColor: 'orange'}
          }
          return {fontSize: '14px', color:'#363636'}
        }
        if(item.isOut === 0) {
          if(item.taskId == this.taskId) {
            return {fontSize: '14px',color:'#0082FC',backgroundColor: 'orange'}
          }
          return {fontSize: '14px',color:'#0082FC'}
        }

        // var startTime = item.abslimitDate
        // startTime=new Date(startTime).getTime()
        // var endTime = new Date().getTime()
        // var nextDay=new Date(this.$commonUtils.formatDate(new Date(new Date().getTime() + 24*60*60*1000).toLocaleDateString())).getTime()
        // if(startTime<=nextDay&&startTime>endTime){
        //   return {color:'#131EEA'}
        // }
        // if(startTime<endTime) {
        //   return {color:'#FB1E1E'}
        // }
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
</style>
