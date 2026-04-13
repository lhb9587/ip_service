<template>
  <div>
    <top-panel v-if="toolPosTop == 'top'" :tool-arr="toolArr" tool-type="statement_tool" :ctx="this"/>
    <top-menu :buss-id="8" :ctx="this" :tab-list="tabList" type="statement"/>
    <right-panel v-if="toolPosTop == 'right'" :tool-arr="toolArr" tool-type="statement_tool" :ctx="this"></right-panel>
    <div class="all">
      <div class="drag-main">
        <div id="mainId" class="main">
          <div id="topBoxId" class="topBox content_wrap" :style="{height: statementTopHeight}">
            <div class="left_wrap" :style="{width:statementLeftWrapWidth }">
              <cust-grid ref="cust_grid" :statementTopHeight="statementTopLeftHeightGrid" @selectedRow="selectedRow"
                         @events="handleEvents"></cust-grid>
            </div>
            <div class="right_wrap" style="border: 1px solid #BDC3C7;padding: 0 5px;">
              <right-grids v-on="$listeners" ref="right_grids" :custName="custName" :statementTopHeight="statementTopHeightGrid" :custId="custId" :ctx="this"/>
            </div>
          </div>
          <div id="downBoxId" class="downBox" :style="{height: statementBottomHeight}">
            <div style="border: 1px solid #BDC3C7;padding: 0 5px 5px 5px;margin-top: 5px;border-bottom: none;">
              <div id="resizeId" class="r-resize"></div>
              <el-button size="mini" type="primary" @click="checkBill">对账</el-button>
            </div>
            <bill-grid ref="bill_grid" :custId="custId" :statementBottomHeight="statementBottomHeight"/>
          </div>

        </div>
      </div>
    </div>
    <!--  信用等级  -->
    <el-dialog
      v-if="creditDialogVisible"
      :title="'设定信用等级-'+ creditType"
      :close-on-click-modal="false"
      :visible.sync="creditDialogVisible"
      width="50%"
      height="80%"
      class="abow_dialog"
    >
      <credit ref="credit" v-if="creditDialogVisible" :creditType="creditType" @closeDialog="closeDialog"/>
    </el-dialog>
    <!--  设定对账  -->
    <el-dialog
      v-if="statementDialogVisible"
      :title="'设定客户对账信息-' + statementType"
      :close-on-click-modal="false"
      :visible.sync="statementDialogVisible"
      width="50%"
      height="80%"
      class="abow_dialog"
    >
      <state-ment ref="statement" v-if="statementDialogVisible" :statementType="statementType" @closeDialog="closeDialog"/>
    </el-dialog>
    <!--  对账  -->
    <el-dialog
      v-if="checkBillDialogVisible"
      :title="'催款-' + checkBillType"
      :close-on-click-modal="false"
      :visible.sync="checkBillDialogVisible"
      width="50%"
      height="80%"
      class="abow_dialog"
    >
      <check-bill ref="check_bill" v-if="checkBillDialogVisible" :checkBillType="checkBillType" @closeDialog="closeDialog"/>
    </el-dialog>
  </div>

</template>
<script>
  import Bus from '@/utils/Bus'
  import TopMenu from "../components/TopMenu";
  import TopPanel from "../components/TopPanel";
  import RightPanel from "../../../../components/RightPanel/index";
  import {mapState} from "vuex";
  import CustGrid from './component/CustGrid'
  import BillGrid from "./component/BillGrid";
  import Credit from "./component/Credit";
  import dispatcher from "../stateManage/dispatchers";
  import StateMent from "./component/StateMent";
  import CheckBill from "./component/CheckBill";
  import RightGrids from "./component/RightGrids";

  export default {
    components: {RightGrids, CheckBill, StateMent, Credit, BillGrid, RightPanel, TopPanel, TopMenu, CustGrid},
    computed: {
      ...mapState({
        // showSettings: state => state.settings.showSettings,
        toolPosTop: state => state.settings.toolPosTop
      })
    },
    data() {
      return {
        custData:{},
        memoType: '',
        memoDialogVisible: true,
        checkBillDialogVisible: false,
        checkBillType: '',
        creditType: '',
        statementType: '',
        statementDialogVisible: false,
        creditDialogVisible: false,
        custId: '',
        custName: '',
        tabList: [
          {
            key: 'isAll',
            label: '所有欠款客户',
            value: 2
          },
          {
            key: 'isAll',
            label: '所有客户',
            value: 1
          },
        ],
        toolArr: [
          {index: '1', name: '信用等级', icon: 'iconfont icon-xinyongdengji1', action: 'STATEMENT_SET_CREDIT', permissions: 342},
          {index: '2', name: '对账信息', icon: 'iconfont icon-caiwu-duizhang', action: 'STATEMENT_SET_STATEMENT', permissions: 343},
          {index: '3', name: '导出', icon: 'iconfont icon-daochu', action: 'STATEMENT_EXPORT'},
        ],
        statementTopHeightGrid: '',
        statementTopLeftHeightGrid: '',
        statementLeftWrapWidth: localStorage.getItem('statementLeftWrapWidth') ? localStorage.getItem('statementLeftWrapWidth') : '60%',
        statementTopHeight: localStorage.getItem('statementTopHeight') ? localStorage.getItem('statementTopHeight') : 'calc(20%)',
        statementBottomHeight: localStorage.getItem('statementBottomHeight') ? localStorage.getItem('statementBottomHeight') : 'calc(80% - 40px)',
      };
    },
    mounted() {
      this.rightDrag()
      this.dragTwoRowDiv("mainId", "topBoxId", "resizeId", "downBoxId");
      this.statementTopHeight = getComputedStyle(document.querySelector('#topBoxId'))['height']
      this.statementTopHeightGrid = Number(this.statementTopHeight.replace('px', '')) - 102 + 'px'
      this.statementTopLeftHeightGrid = Number(this.statementTopHeight.replace('px', '')) - 32 + 'px'
      this.statementBottomHeight = getComputedStyle(document.querySelector('#downBoxId'))['height']

    },
    methods: {
      checkBill() {
        if(!this.$refs.bill_grid.getSelectedRows().length){
          this.$message.error('请选择账单!')
          return
        }
        if(!this.$refs.cust_grid.getSelectedRows().length){
          this.$message.error('请选择客户!')
          return
        }
        this.checkBillDialogVisible = true
        this.checkBillType = '新建'
        this.$nextTick(() => {
          this.$refs.check_bill.$data.billNoList =  this.$refs.bill_grid.getSelectedRows().map(item => item.billNo)
          this.$refs.check_bill.$data.checkBillData.billIds =  this.$refs.bill_grid.getSelectedRows().map(item => item.billId)
          this.$refs.check_bill.$data.checkBillData.custId =  this.$refs.cust_grid.getSelectedRows()[0].custId
          this.$refs.check_bill.$data.custName =  this.$refs.cust_grid.getSelectedRows()[0].name
          this.$refs.check_bill.$data.checkBillData.nextDunningDate =  this.$commonUtils.getEndDate(this.$wUtil.getDate('', 'day'), this.$refs.cust_grid.getSelectedRows()[0].collectletterCycle || 0, '天')
        })
      },
      handleEvents({action, data}) {
        dispatcher(this)(action, data)
      },
      closeDialog(search) {
        if(this.creditDialogVisible && search){
          Bus.$emit('queryCreditList')
        }
        if(this.checkBillDialogVisible && search){
          Bus.$emit('queryCheckBillList')
        }
        this.memoDialogVisible = false
        this.checkBillDialogVisible = false
        this.creditDialogVisible = false
        this.statementDialogVisible = false
        search && this.$refs.cust_grid.queryPartData(search)
      },
      selectedRow({data}) {
        const {custId, name} = data
        this.custId = custId
        this.custName = name
      },
      rightDrag() {
        let that = this
        if (document.querySelector(".left_wrap")) {
          new this.$DraginResize(document.querySelector(".left_wrap"), {
            clone: true,
            end(info) {
              if (info.dir == 'ver') {
                this.elem.style.height = info.height + 'px';
              } else if (info.dir == 'hor') {
                this.elem.style.width = info.width + 'px';
                localStorage.setItem('statementLeftWrapWidth', info.width + 'px')
                that.leftWrapWidth = info.width + 'px'
              }
            }
          })
        }
      },
      dragTwoRowDiv(contentId, topBoxId, resizeId, downBoxId) {
        let resize = document.getElementById(resizeId);
        let topBox = document.getElementById(topBoxId);
        let downBox = document.getElementById(downBoxId);
        let box = document.getElementById(contentId);
        // let custGrid = document.getElementById('cust_grid');
        resize.onmousedown = (e) => {
          let startY = e.clientY;
          resize.top = resize.offsetTop;
          document.onmousemove = (e) => {
            let endY = e.clientY;
            let moveLen = resize.top + (endY - startY);
            let maxT = box.clientHeight - resize.offsetHeight;
            if (moveLen < 100) moveLen = 100;
            if (moveLen > maxT - 100) moveLen = maxT - 100;
            resize.style.top = moveLen;
            topBox.style.height = moveLen + "px";
            // custGrid.style.height = moveLen + "px";
            downBox.style.height = (box.clientHeight - moveLen - 37) + "px";
            this.statementTopHeight = topBox.style.height
            this.statementTopHeightGrid = moveLen - 102 + 'px'
            this.statementTopLeftHeightGrid = moveLen - 32 + 'px'
            localStorage.setItem('statementTopHeight', topBox.style.height)
            this.statementBottomHeight = downBox.style.height
            localStorage.setItem('statementBottomHeight', downBox.style.height)
          }
          document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
            resize.releaseCapture && resize.releaseCapture();
          }
          resize.setCapture && resize.setCapture();
          return false;
        }
      }
    }
  };
</script>
<style lang="scss" scoped>

  /* 两横 */
  #mainId {
    width: 100%;
    /*overflow: hidden;*/
    position: relative;
  }

  #topBoxId {
    /*height: calc(80% - 5px);*/
  }

  #resizeId {
    height: 5px;
    cursor: s-resize;
  }

  #downBoxId {
    height: 20%;
  }

  // 辅助修饰
  .all {
    /*padding: 30px;*/
    /*padding-top: 10px;*/
    padding-bottom: 20px;
    list-style: none;
  }


  ul.content {
    // width:100%;
    display: flex;
    overflow: hidden;

    li {
      // float: left;
      height: 100px;
      list-style-type: none;
    }

    .left {
      background: red;
    }

    .center {
      background: #16ffa6;
      padding: 30px;
      box-sizing: border-box;
    }

    .right {
      background: orange;
    }

    .l-resize {
      background: #000;
    }
  }

  .main {
    height: 85vh;

    .topBox {
      /*border: 1px solid #BDC3C7;*/
      /*background: #1ee3aa;*/
    }

    .r-resize {
      /*height: 5px;*/
      background: #fff;
      transition: all 0.3s ease-in-out;

      &:hover {
        /*box-shadow: 0px 0px 18px 0px rgba(64, 158, 255, 0.5);*/
        background-color: #C5E2FF;
        /*opacity: .3;*/
      }
    }

    .downBox {
      /*margin-top: 5px;*/
      /*border: 1px solid #BDC3C7;*/
      /*background: #eb77eb;*/
    }
  }

  .content_wrap {
    width: 100%;
    display: flex;

    .left_wrap {
      /*border: 1px solid #BDC3C7;*/
      margin-right: 5px;
      position: relative;
      transition: all 0.5s;
    }

    .right_wrap {
      /*border: 1px solid #BDC3C7;*/
      overflow: hidden;
      transition: all 0.5s;
      flex: 1;
    }
  }

  > > > .el-dialog__body {
    padding-top: 0;
    padding-bottom: 0;
  }
  .abow_dialog {
    > > > .el-dialog {
      position: absolute;
      top: 50%;
      left: 50%;
      margin: 0 !important;
      transform: translate(-50%, -50%);
      max-height: calc(100% - 30px);
      max-width: calc(100% - 30px);
      display: flex;
      flex-direction: column;
    }

    > > > .el-dialog__body {
      overflow: auto;
    }
  }
  @import "~@/styles/miniAg.scss";
</style>
