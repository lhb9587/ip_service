<template>
  <div v-clickoutside="clickoutside">
    <div class="queryButton" id="queryButton" style="margin: 0 auto">
      <div class="buttonWrap_small">
        <div class="button-group-search">
          <transition name="show" mode="out-in">
            <div class="searchWrap" id="searchWrap" v-show="drawerState">
              <div class="form-container">
                <el-form size="mini" label-width="120px" @keyup.enter.native="handleSearch(0)" style="margin-top: 2px">
                  <el-form-item label="报表类型:">
                    <el-select v-model="queryModuleData.docType" filterable clearable @change="typeCheckout">
                      <el-option
                        v-for="item in docTypeData"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="所属月:" v-if="isMonth">
                    <DataPicker class="DataPicker"
                                @change="monthPicker"
                                style="width: 400px"
                                v-model="belongToDateArray"
                                type="month"
                                value-format="yyyy-MM"
                                startPlaceholder="开始月份"
                                endPlaceholder="结束月份"></DataPicker>
                  </el-form-item>
                  <el-form-item label="所属季度" v-if="isQuarter">
                    <el-quarter-picker v-model="yearQuarter" placeholder="选择季度" @change="quarterPicker"/>
                  </el-form-item>
                </el-form>
              </div>
              <div class="clearWrap" v-if="drawerState">
                <el-button size="mini" @click="clearSearch"><span>重置</span></el-button>
                <el-button type="primary" size="mini" @click="handleSearch(0)">搜索</el-button>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { queryReportCompany } from '@/api/caseList'
import ElQuarterPicker from '../../components/ElQuarterPicker'
export default {
  name: "ManageSearch",
  components: {
    ElQuarterPicker
  },
  props: {
    ctx: {},
    name: '',
    type: ''
  },
  data() {
    return {
      drawerState: false,
      isMonth: false,
      isQuarter: false,
      queryModuleData: {},
      defaultModuleData: {
        docType: '',
        belongToStart: '',
        belongToEnd: ''
      },
      docTypeData: [
        {
          value: 1,
          label: '财务状况'
        },
        {
          value: 2,
          label: '从业务人员工资总额'
        },
        {
          value: 3,
          label: '经营财务研发'
        },
        {
          value: 4,
          label: '损益表'
        },
        {
          value: 5,
          label: '资产负债表'
        },
        {
          value: 6,
          label: '资产余额情况表'
        }
      ],
      yearQuarter: '', // 年度季度拼接
      belongToDateArray: [],
    }
  },
  created() {
    this.queryModuleData = JSON.parse(JSON.stringify(this.defaultModuleData))
    // 判断报表，所属月所属组处理
    this.typeCheckout(this.type)
  },
  methods: {
    monthPicker(row) {
      this.queryModuleData.belongToStart = row[0]
      this.queryModuleData.belongToEnd = row[1]
    },
    quarterPicker(row) {
      let belongToYear = row.slice(0, 4)
      let quarter = row.slice(-1)
      this.queryModuleData.belongToStart = belongToYear + '第' + quarter + '季度'
      this.queryModuleData.belongToEnd = belongToYear + '第' + quarter + '季度'
    },
    // 根据选择不同报表类型，进行不同搜索项展示。目前从业人员工资总额报表，使用季度，和其他报表使用所属月不同
    typeCheckout(row) {
      if (row == 2) {
        this.isMonth = false
        this.isQuarter = true
        this.belongToDateArray = []
      } else {
        this.isMonth = true
        this.isQuarter = false
        this.yearQuarter = ''
      }
    },
    openOrClose(){
      this.drawerState = !this.drawerState
    },
    // 清空操作
    clearSearch() {
      this.queryModuleData = JSON.parse(JSON.stringify(this.defaultModuleData))
      this.belongToDateArray = ''
      this.yearQuarter = ''
    },
    clickoutside() {
      this.drawerState = false
    },
    handleSearch(flag) {
      this.drawerState = false
      this.$emit('search', this.queryModuleData)
    },
  }
}
</script>

<style lang="scss" scoped>
  header {
    margin-bottom: 19px;
    box-shadow: 0px 2px 5px 0px rgba(163, 163, 163, 0.35);
  }

  .queryButton {
    display: flex;
    flex-wrap: nowrap;
    position: relative;
    justify-content: center;

    .buttonWrap_small {
      display: flex;
      /*margin: 5px 5px;*/
      align-items: center;

      .el-button {
        margin-left: 10px;
      }
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

    /*.el-select /deep/{*/
    /*  .el-select__tags{*/
    /*    max-height: 40px;*/
    /*    overflow-y: auto;*/
    /*  }*/
    /*}*/
    /*.multi-cascader /deep/{*/
    /*  .el-cascader__label{*/
    /*    max-height: 40px;*/
    /*    overflow-y: auto*/
    /*  }*/
    /*}*/
    .postInfo-container-item {

      /deep/ .el-form-item__content {
        width: 330px;
        display: flex;
        //height: 28px;
        align-items: center;

        .el-select {
          width: 100%;
        }

        .el-input {
          width: 100%;
        }

        .el-autocomplete {
          width: 100%;

        }
      }
    }
  }

  .case_management_item {
    /*min-height: calc(100vh - 50px - 18px - 41px);*/
    display: flex;
    flex-direction: column;
    //overflow: auto;
    padding: 5px 5px;
  }

  section {
    position: relative;
    clear: both;
    flex: 1;
    //padding-bottom: 200px;
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

  .el-table {
    overflow: visible;

    /deep/ th {
      color: rgba(51, 51, 51, 1);
      background: rgba(187, 187, 187, 0.5);
    }
  }

  .el-table /deep/ th .cell {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    padding-left: 10px;

    img {
      margin-left: 5px;
      width: 12px;
      cursor: pointer;
    }

  }

  .el-table /deep/ th div {
    overflow: visible;
    text-overflow: inherit;
    padding: 0;
  }

  .el-table /deep/ .el-table__header-wrapper {
    overflow: hidden;

    th {
      overflow: visible;

      .cell {
        overflow: visible;
      }
    }
  }

  .el-scrollbar li {
    display: flex;

    span {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      border-right: 1px solid #f4f4f5;
      border-bottom: 1px solid #f4f4f5;
    }
  }

  .el-transfer {
    display: flex;

    /deep/ & > .el-transfer-panel {
      flex: 1;
    }

    /deep/ .el-transfer__buttons {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    /deep/ .el-transfer-panel__list {
      display: flex;
      flex-wrap: wrap;

      label {
        width: 33.3%;
        margin-right: 0;
      }
    }
  }

  .el-dropdown {
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
    width: 66px;
    height: 32px;
    font-size: 12px;
    border-radius: 3px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 10px;
  }

  .el-menu-demo {
    display: inline-block;
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
    width: 92px;
    height: 32px;
    font-size: 12px;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 10px;

    &:hover {
      opacity: 0.8;
    }

    /deep/ li {
      height: 100%;
      width: 100%;

      .el-submenu__title {
        border-radius: 3px;
        background: #409eff;
        color: #fff !important;
        line-height: 32px;
        height: 100%;
        text-align: center;
        border-bottom: 0;
        padding: 0;

        i {
          color: #fff;
        }

        &:hover {
          color: #fff;
          background: #409eff;
        }
      }
    }

    //padding: 9px 15px;
  }

  .button_wrap {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 50px;

    .el-button {
      margin-left: 10px;
    }
  }

  .filterTableTmg {
    height: 100%;
  }

  .fullItem {
    width: 100%;
  }

  /deep/ .plTableBox {
    .ant-table-scroll {
      max-height: "af" !important;

      .el-table {
        height: "123" !important;
      }
    }

    .myPagination {
      display: none;
    }
  }

  .FilterSelectWrap {
    display: flex;
    flex-wrap: wrap;

    .filterSelect {
      width: 232px;
      margin-right: 30px;
      margin-bottom: 10px;
    }
  }

  .selectButton {
    position: absolute;
    right: 12px;
    top: 28px;
  }

  .myeltable {
    /deep/ .cell {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: clip;
    }
  }

  .divdiver {
    position: relative;
    left: 30px;
    height: 1px;
    width: 83%;
    background: #EEF2FB;
    margin-bottom: 10px;
  }

  /deep/ .selectRow {
    background: #C9C8D0;


  }

  /deep/ .gray {
    background: #E4E2E2;
  }

  /deep/ .pagination-container {
    padding: 0;
  }

  .content_wrap {
    width: 100%;
    display: flex;

    .left_wrap {
      position: relative;
      transition: all 0.5s;
      //   width: 40%;
    }

    .right_wrap {
      box-shadow: 0px 0px 18px 0px rgba(64, 158, 255, 0.5);
      height: 598px;
      overflow: auto;
      transition: all 0.5s;
      flex: 1;

      /deep/ * {
        font-size: 12px !important;
      }

      // width: 60%;
      /deep/ .sectionWrap {
        padding: 0 !important;
        padding-left: 10px !important;
        // padding-bottom: 350px!important;
        .ElectronWrap {
          padding: 0 !important;
        }
      }
    }
  }

  .w-table {
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* 没有前缀，目前支持Opera和谷歌浏览器 */
    /deep/ .caret-wrapper {
      position: relative;
    }

    /deep/ .el-table__column-filter-trigger {
      position: relative;
    }

    /deep/ .el-table th {
      padding: 0;

      .virtual {
        position: absolute;
        display: block;
        width: 0;
        height: 0;
        z-index: 99;
        top: 0;
        background: none;
        border: none;
        box-sizing: border-box;
      }

    }

    .thead-cell {
      vertical-align: middle !important;
      padding: 0;
      display: inline-flex;
      flex-direction: column;
      align-items: left;
      cursor: pointer;
      overflow: initial;
      /*&:before {*/
      /*content: "";*/
      /*position: absolute;*/
      /*top: 0;*/
      /*left: 0;*/
      /*bottom: 0;*/
      /*right: 0;*/
      /*}*/
    }

    &.w-table_moving {
      .el-table th .thead-cell {
        cursor: move !important;
      }

      .el-table__fixed {
        cursor: not-allowed;
      }
    }
  }

  .right_wrap {

    /deep/ .el-collapse-item {
      border-bottom: 1px solid #303133;
    }
  }

  /deep/ .moveIng {
    .virtual {
      border: 2px dotted #666 !important;
    }
  }

  /deep/ .darg_active_left {
    .virtual {
      border-left: 2px dotted #666 !important;
    }
  }

  /deep/ .darg_active_right {
    .virtual {
      border-right: 2px dotted #666 !important;
    }
  }

  .DataPicker /deep/ {
    .el-input__prefix {
      display: none;
    }

    .el-input__inner {
      text-align: left;
      padding-left: 15px;
      padding-right: 18px;
      // padding-left: 10px;
    }
  }

  .djSubmitDateArray {
    width: 490px;
    margin-bottom: 0;

    /deep/ .el-form-item__label {
      line-height: 40px !important;
    }
  }

  .button-group-search {
    position: relative;
    display: flex;

    .searchRight {
      margin-left: 0;
      height: 32px;
      border-top-right-radius: 3px !important;
      border-bottom-right-radius: 3px !important;
      padding: 0 5px
    }

    .searchWrap {
      border-radius: 5px;
      top: 0px;
      left: 0px;
      width: 550px;
      min-height: 200px;
      /*max-height: 500px;*/
      position: absolute;
      background: #ffffff;
      border: 1px solid #d4d5d5;
      z-index: 50;
      /*overflow: auto;*/
      padding: 20px 0;
      box-shadow: 0 3px 6px rgba(111, 111, 111, 0.2);

      /deep/ .form-container {
        padding-bottom: 10px;
        overflow: auto;
        max-height: 500px;

        .el-form-item__label {
          text-align: left;
          padding-left: 32px;
          font-weight: normal;
        }

        .el-form-item__content {
          input {
            border-top: 0;
            border-left: 0;
            border-radius: 0;
            border-right: 0
          }
        }
      }

      .clearWrap {
        display: flex;
        justify-content: flex-end;
        right: 20px;
        bottom: 10px;
        position: absolute;
        z-index: 1;
      }
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

  .ViewsSwitching {
    position: absolute !important;
    right: 0;
    z-index: 100;
    top: 5px;
  }

  .searchRight {
    margin-left: 0;
    height: 32px;
    border-top-right-radius: 3px !important;
    border-bottom-right-radius: 3px !important;
    padding: 0 5px
  }


  .queryButton {
    z-index: 7
  }


  .noTrigger /deep/ .el-table__column-filter-trigger {
    display: none;
  }


  .brush_right {
    position: absolute;
    right: 6px;
    z-index: 1;
    top: -4px;
  }

  /deep/ .btn-simple1 {
    color: #409EFF;
  }

  /deep/ .name_wrap {
    display: flex;

    .name {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      border-right: 1px solid #2b2f3a;
      border-bottom: 1px solid #2b2f3a;
    }

    .name0 {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      /*text-overflow: ellipsis;*/
      border-right: 1px solid #2b2f3a;
      border-bottom: 1px solid #2b2f3a;
    }
  }

  /deep/ .firstName_wrap {
    cursor: not-allowed;
    background: #c9c9c9;
  }

  .file-down {
    > > > .el-dialog__body {
      padding-bottom: 50px;
      padding-top: 20px;
    }
  }
</style>
