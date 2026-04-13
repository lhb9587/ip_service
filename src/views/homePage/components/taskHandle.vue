<template>
  <div>
    <el-popover  ref="popover" v-model="flag" style="display: flex;justify-content: center;align-items: center" width placement="bottom" trigger="click" >
      <div>
        <div v-for="(item, index) in handleList" :key="index">
          <div :class="{'ban-click':item.ban || !(delayFlag&&item.delayFlag&&delayFlag == item.delayFlag || item.nextOperation&&nextOperation&&item.nextOperation.includes(nextOperation) || item.per == creator || item.per == 1)}" :ref="'changeBgc'+index" style="cursor: pointer;font-size: 14px;height: 30px;line-height: 30px;" @mouseover="changeColor(index)" @mouseout="resetColor(index)" @click="handle(items, item)">{{item.name}}</div></div>

      </div>
      <span v-if="items" slot="reference" class="dot-btn" :style="{'box-shadow':flag?'inset 2px 2px 5px #000':''}"  style="color: #000;text-align: center" >
        <span  style="" class="el-icon-more"></span>
      </span>
    </el-popover>

  </div>

</template>

<script>

  import Bus from '@/utils/Bus'
  export default {
    name: "taskHandle",
    props:{
      items:{
      },
      userId:{
      },
      rowIndex:{
        type:[String,Number]
      },
      page:{
        type:String
      }
    },
    data(){
      return {
        // taskId:0,
        select:2222,
        hoverIndex:10000,
        flag:false,
        handleList: [
          {'name':'分配','nextOperation':'12'},
          {'name':'提交','nextOperation': '2'},
          {'name':'审核','nextOperation':'3'},
          {'name':'申请延期','delayFlag': '1'},
          {'name':'审批延期','delayFlag': '2'},
          {'name':'修改','per':1},
          {'name':'删除','per':this.userId}
        ],
      value: '',
      nextOperation: '',
      delayFlag: '',
      creator: '',
      }
    },
    created() {
      // console.log(this.items,999)

      // if(this.items&&this.items.prjTaskId){
      //   this.taskId = this.items.prjTaskId
      // }
      if(this.items&&this.items.nextOperation){
        this.nextOperation = this.items.nextOperation
      }
      if(this.items&&this.items.delayFlag){
        this.delayFlag = this.items.delayFlag
        if(this.delayFlag == 2){
          this.handleList = [
          {'name':'分配','nextOperation':'12','ban':1},
          {'name':'提交','nextOperation': '2','ban':1},
          {'name':'审核','nextOperation':'3','ban':1},
          {'name':'申请延期','delayFlag': '1','ban':1},
          {'name':'审批延期','delayFlag': '2'},
          {'name':'修改','per':1,'ban':1},
          {'name':'删除','per':this.userId,'ban':1}
          ]
        }
      }
      if(this.items&&this.items.creator){
        this.creator = this.items.creator
      }
    },
    computed:{
      // btnIndex(){
      //   switch (this.page) {
      //     case 'toDoTaskGet':
      //       return store.getters.getRowIndex
      //       break;
      //     case 'toDoTaskOut':
      //       return store.getters.outRowIndex
      //       break;
      //     case 'resource':
      //       return store.getters.btnIndex
      //       break;
      //     case 'taskManage':
      //       return store.getters.taskIndex
      //       break;
      //     default:
      //       break;
      //   }
      // },
      // btnStyle(){
      //   return this.taskId == this.btnIndex ? 'box-shadow:inset 2px 2px 5px #000;font-size:20px' : ''
      // }
    },
    methods:{
      clickOutSide(){
        // if(this.page == 'resource'){
        //   store.commit('caseInformation/SET_BTN_INDEX', 0)
        // }
        // if(this.page == 'toDoTaskGet'){
        //   store.commit('caseInformation/SET_GET_INDEX', 0)
        // }
        // if(this.page == 'toDoTaskOut'){
        //   store.commit('caseInformation/SET_OUT_INDEX', 0)
        // }
        // if(this.page == 'taskManage'){
        //   store.commit('caseInformation/SET_TASK_INDEX', 0)
        // }
      },
      resetColor(index){
        // this.hoverIndex = 10000
        this.$refs['changeBgc'+index][0].style.cssText = 'background-color: none;cursor: pointer;font-size: 14px;height: 30px;line-height: 30px;'
      },
      changeColor(index){
        // this.hoverIndex = index
        this.$refs['changeBgc'+index][0].style.cssText = 'background-color:#f4f4f4;cursor: pointer;font-size: 14px;height: 30px;line-height: 30px;'
      },
      handle(data,item){
        this.$refs.popover.doClose()
        if(item.ban || !(this.delayFlag == item.delayFlag || item.nextOperation&&this.nextOperation&&item.nextOperation.includes(this.nextOperation) || item.per == this.creator || item.per == 1)){
          return
        }
        if(this.page == 'resource'){
          Bus.$emit('taskHandle',[item.name,data])
        }
        if(this.page == 'toDoTaskGet' || this.page == 'toDoTaskOut'){
          Bus.$emit('toDoTaskHandle',[item.name,data])
        }
        if(this.page == 'taskManage'){
          Bus.$emit('taskManageHandle',[item.name,data])
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  .ban-click{
    cursor: not-allowed!important;
    color: #ccc;
    /*background-color: red;*/
  }
  .dot-btn{
    display: inline-block;
    width: 40px;
    height: 25px;
    line-height:25px;
    font-size: 16px;
    /*padding-bottom: 10px;*/
    background-color: #ddd;
    border-radius: 4px;
    box-shadow:0px 0px 10px #000;
    cursor: pointer;
    /*&:hover{*/
    /*  box-shadow:inset 2px 2px 5px #000;*/
    /*}*/
  }
  /*.dot-btn-click{*/
  /*  box-shadow:inset 2px 2px 5px #000;*/
  /*}*/
  .btn-bg{
    background-color: #eee;
    border-radius: 4px;
    font-size: 20px;
    /*border: 1px solid #eee;*/
  }
</style>
