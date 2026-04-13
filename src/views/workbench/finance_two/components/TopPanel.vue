<template>
  <div>
    <div class="tool_box">
      <div class="tool_item" v-for="(item, index) in applicationManagement.filter(item=>!item.flag && (!item.permissions || $store.getters.permissions.includes(item.permissions)))" :key="index">
        <template v-if="item.name =='模板生成' && !mbData.length || !['模板生成', '网络支付', '财务支付', '收据录入', '导出'].includes(item.name)">
          <span class="tool_icon" :class="item.icon" @click="toOtherView(item.index, item)"></span>
          <span class="tool_name">{{item.name}}</span>
        </template>
        <template v-if="item.name =='模板生成' && mbData.length">
          <el-popover
          placement="bottom"
          width="400"
          trigger="click">
            <div v-if="!noContent">
              <div v-for="(item,key) in mbData" :key='key' class="modelItem" @click="choseModel(item)">
                {{item.name}}
              </div>
            </div>
            <div v-else>暂无数据</div>
          <div slot="reference" class="tool_item">
            <span class="tool_icon" :class="item.icon" @click="toOtherView(item.index, item)"></span>
          </div>
        </el-popover>
          <span class="tool_name">{{item.name}}</span>
        </template>
        <template v-if="item.name =='网络支付'">
          <el-popover
          placement="bottom"
          width="400"
          trigger="click">
            <div v-for="(item,key) in [
              {id: '0', label: '网络支付'},
              {id: '1', label: 'PCT国际阶段费用'},
              {id: '2', label: 'PCT首次进入国家阶段费用'},
              {id: '3', label: '国家申请或集成电路费用'},
              {id: '4', label: '网上缴费费用信息模板'},
              ]" :key='key' class="modelItem" @click="choseNetPay(item)">
              {{item.label}}
            </div>
          <div slot="reference" class="tool_item">
            <span class="tool_icon" :class="item.icon" @click="toOtherView(item.index, item)"></span>
          </div>
        </el-popover>
          <span class="tool_name">{{item.name}}</span>
        </template>
        <template v-if="item.name =='财务支付'">
          <el-popover
          placement="bottom"
          width="400"
          trigger="click">
            <div v-for="(item,key) in [{id: '财务支付', label: '财务支付'}, {id: '补充缴费', label: '补充缴费'}]" :key='key' class="modelItem" @click="choseListPay(item)">
              {{item.label}}
            </div>
          <div slot="reference" class="tool_item">
            <span class="tool_icon" :class="item.icon" @click="toOtherView(item.index, item)"></span>
          </div>
        </el-popover>
          <span class="tool_name">{{item.name}}</span>
        </template>
        <template v-if="item.name =='导出'">
          <el-popover
          placement="bottom"
          width="400"
          trigger="click">
            <div v-for="(item,key) in [{id: 1, label: '全部导出'}, {id: 2, label: '部分导出'}]" :key='key' class="modelItem" @click="exportExcel(item)">
              {{item.label}}
            </div>
          <div slot="reference" class="tool_item">
            <span class="tool_icon" :class="item.icon" @click="toOtherView(item.index, item)"></span>
          </div>
        </el-popover>
          <span class="tool_name">{{item.name}}</span>
        </template>
        <template v-if="item.name =='收据录入'">
          <el-popover
            ref="popover"
            width="400"
            trigger="click"
            placement="bottom">
            <div style="height: 200px;width: 100%">
              <OfficialDocuments types="patenFee" @confirm="confirmClick"
                                 @closePopover="()=>{}"></OfficialDocuments>
            </div>
            <div slot="reference" class="tool_item">
              <span class="tool_icon" :class="item.icon" @click="toOtherView(item.index, item)"></span>
            </div>
          </el-popover>
          <span class="tool_name">{{item.name}}</span>
        </template>
      </div>
      <div class="tool_item">
        <span class="tool_icon el-icon-plus" @click="toOtherView('more')"></span>
        <span class="tool_name">更多</span>
      </div>
      <div class="tool_item">
        <span class="tool_icon iconfont icon-jiantou_zuoyouqiehuan" @click="changeToolsPos"></span>
        <span class="tool_name">切换</span>
      </div>
    </div>

    <el-dialog
      title="应用管理"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <div style="display: flex;flex-wrap: wrap;">
        <div class="appWrap">
          <div style="position: relative" v-for="item in applicationManagement.filter(item=>item.flag && (!item.permissions || $store.getters.permissions.includes(item.permissions)))">
            <el-tooltip  class="item" effect="dark" :content="item.name" placement="left">
              <el-button  class="rightp-item" type="primary" :icon="item.icon" circle></el-button>
            </el-tooltip>
            <div class="el-icon-circle-plus-outline" @click="addItem(item.index)"></div>
          </div>
        </div>

        <div class="divider"></div>
        <div class="appWrap">
          <div style="position: relative" v-for="item in applicationManagement.filter(item=>!item.flag && (!item.permissions || $store.getters.permissions.includes(item.permissions)))">
            <el-tooltip class="item" effect="dark" :content="item.name" placement="left">
              <el-button class="rightp-item" type="primary" :icon="item.icon" circle></el-button>
            </el-tooltip>
            <div class="el-icon-remove-outline" @click="deleteItem(item.index)"></div>
            <!--            <div class="el-icon-circle-plus-outline" @click="addItem(item.index)"></div>-->
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
<!--         <el-button @click="dialogVisible = false">取 消</el-button>-->
         <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import dispatcher from '../stateManage/dispatchers'
  import OfficialDocuments from "../../case/components/OfficialDocuments";

  export default {
    name: 'TopPanel',
    components: {OfficialDocuments},
    props:{
      mbData: {
        type: Array,
        default: () => []
      },
      ctx: {
        type: Object
      },
      toolType: {
        type: String,
        default: ''
      },
      toolArr: {
        type: Array,
        default: () => []
      },
    },
    data() {
      return {
        noContent: false,
        toolList: [],
        applicationManagement: [],
        dialogVisible: false
      }
    },
    watch: {
      $route: {
        handler: function(val, oldVal) {
          this.$nextTick(() => {
            this.changeTools()
          })
        },
        immediate: true
      }
    },
    created() {
      this.changeTools()
    },
    methods: {
      exportExcel(item){
        this.ctx.$refs.cust_grid.exportList(item.id)
      },
      confirmClick(){
        this.ctx.$refs.patentList.confirmClick()
      },
      choseListPay(item){
        this.ctx.$refs.patentList.financePay(item.id)
      },
      choseNetPay(item){
        this.ctx.$refs.patentList.netPay(item.id)
      },
      choseModel(item){
        if(this.toolType == 'bill_tool'){
         this.ctx.$refs.billList.mbmorebtn(item)
        }
        if(this.toolType == 'outside_price_tool'){
          this.ctx.$refs.overseasPriceList.createModel(item.id, item)
        }
        if (this.toolType === 'outside_bill_tool') {
          this.ctx.$refs.overseasBillList.createModel(item.id, item)
        }
      },
      changeToolsPos() {
        this.$store.dispatch('settings/changeToolsPos', 'right')
      },
      addItem(e) {
        let arr=JSON.parse(localStorage.getItem('toolObj'))[this.toolType]
        this.$set(arr.find(item=>item.index==e),'flag',false)
        localStorage.setItem('toolObj', JSON.stringify({[this.toolType]: arr}))
        this.getApplicationManagement()
      },
      deleteItem(e) {
        let arr=JSON.parse(localStorage.getItem('toolObj'))[this.toolType]
        this.$set(arr.find(item=>item.index==e),'flag',true)
        localStorage.setItem('toolObj', JSON.stringify({[this.toolType]: arr}))
        this.getApplicationManagement()
      },
      toOtherView(e, item) {
        if(e == 'more'){
          this.dialogVisible=true
        }
        if(item&&item.action){
          dispatcher(this.ctx)(item.action, this)
        }
      },
      changeTools() {
        this.toolList = this.toolArr
        let arr = this.toolList
        if(!localStorage.getItem('toolObj')){
          localStorage.setItem('toolObj',JSON.stringify({}))
        }
        if(!JSON.parse(localStorage.getItem('toolObj'))[this.toolType]){
          const obj = JSON.parse(localStorage.getItem('toolObj'))
          localStorage.setItem('toolObj', JSON.stringify({
            ...obj,
            [this.toolType]: arr
          }))
        }
        this.getApplicationManagement()
      },
      getApplicationManagement() {
        this.applicationManagement =  localStorage.getItem('toolObj') ? JSON.parse(localStorage.getItem('toolObj'))[this.toolType].filter(i => this.toolList.find(item => item.name == i.name)) : [];
        this.applicationManagement = this.applicationManagement.sort((a, b) => ~~a.index - ~~b.index)
        // const newList = this.toolList.filter(item => !this.applicationManagement.find(i => i.name == item.name));
        const newList = []
        this.toolList.forEach(item => {
          if(!this.applicationManagement.find(i => i.name == item.name)){
            this.applicationManagement.push(item)
          }
          // updateSign: 更新标识
          if(this.applicationManagement.findIndex(i => i.updateSign !== item.updateSign && i.name == item.name) > -1){
            this.applicationManagement.splice(this.applicationManagement.findIndex(i => i.updateSign !== item.updateSign && i.name == item.name), 1, item)
          }
        })
        const obj = JSON.parse(localStorage.getItem('toolObj'))
        localStorage.setItem('toolObj', JSON.stringify({
            ...obj,
            [this.toolType]: [...this.applicationManagement, ...newList]
          }))
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/styles/icons/font_3282901_9r5qlcs9bld.css";
  @import "~@/styles/icons/font_889103_gu06lslk7g9.css";
  @import "~@/styles/icons/font_1400426_lpcevksbfe.css";
  @import "~@/styles/icons/font_2251928_441yfy31kbp.css";
  @import "~@/styles/icons/font_3706197_fr0mtri99fk.css";
  @import "~@/styles/icons/font_4596209_hnhyphge3us.css";

  .tool_box {
    /*width: 100%;*/
    height: 70px;
    /*background-color: red;*/
    border: 2px solid #E4E7ED;
    padding: 0 10px;
    margin: 10px 0px 0px 0px;
    display: flex;
    justify-content: left;
    align-items: center;

    .tool_item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-right: 10px;

      .tool_icon {
        color: #fff;
        font-size: 25px;
        background-color: #52A0F5;
        /*background-color: #D7D7D7;*/
        width: 35px;
        height: 35px;
        line-height: 35px;
        text-align: center;
        border-radius: 5px;
        cursor: pointer;
      }

      .tool_name {
        color: #000;
        font-size: 12px;
        height: 20px;
        line-height: 20px;
      }
    }
  }

  .divider {
    display: block;
    height: 1px;
    width: 100%;
    margin: 24px 0;
    background-color: #dcdfe6;
    position: relative;
    /*top: 20%;*/
  }

  .rightp-item {
    position: relative;
    margin: 0 auto;
    margin-top: 20px;
    font-size: 12px;
    padding: 7px;
    /*right: 5px !important;*/
    /deep/ .icon-tiaojian {
      font-size: 13px !important;
    }
  }

  .ing {
    background: rgb(31, 114, 238) !important;
  }

  .el-icon-remove-outline {
    cursor: pointer;
    position: absolute;
    right: 0;
    top: 15px;
    color: #fff;
    background: #f00;
    border-radius: 50%;
  }

  .el-icon-circle-plus-outline {
    cursor: pointer;
    position: absolute;
    right: 0;
    top: 15px;
    color: #fff;
    background: #f00;
    border-radius: 50%;
  }

  .appWrap {
    width: 100%;
    min-height: 50px;
    display: flex;
    flex-wrap: wrap;

    & > div {
      margin-right: 10px;
    }
  }
  .modelItem{
    height: 40px;
    line-height: 40px;
    cursor: pointer;
    &:hover{
      background-color: #ECF5FF;
      color: #66B7FF;
    }
  }
</style>
