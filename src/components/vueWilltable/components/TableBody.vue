<template>
  <table cellspacing="0" cellpadding="0" style="position: relative;">
    <colgroup>
      <col v-for="(columnWidth, index) in columnsWidth" :width="columnWidth" :key="index">
    </colgroup>
    <tbody class="km-tbody">
      <tr v-for="(tr, yIndex) in showData" :key="yIndex" :class="store.states.selector.selectedYIndex==yIndex?'selected':''">
        <td v-for="(th, xIndex) in columns" :key="xIndex" :title="!th.render?format(tr[th.key], th.type, th.format,th,tr):th.render(tr[th.key])" :style="styleObj(tr, th, yIndex, xIndex, columnsWidth)"
          :class="classObj(tr, th, yIndex, xIndex)" :data-key="th.key"  @mouseenter="multiSelect($event, xIndex, yIndex, th.type)" @mousedown.prevent="selectCell($event, xIndex, yIndex, th.type)"
          v-show="th.fixed || allShow">
          <el-checkbox v-if="th.type === 'selection' && dataStatusList[yIndex]" size="mini" v-model="dataStatusList[yIndex].checked" @change="selectionChange(yIndex,dataStatusList[yIndex].checked)">
          </el-checkbox>
          <div v-else class="km-cell-content" :style="{'max-width':  `${columnsWidth[xIndex]}px`}">
            <span v-if="!th.render">
              <el-badge style="top:5px" v-if='tr[th.key]&&tr[th.key].length>0&&(th.type === "goods"||th.type === "joinApps"||th.type==="trademarkCaseBasicinfos" || th.type === "agencyOffers")' :value="['内-外', '外-外'].includes(tr.appFromto) && th.type === 'goods' ? tr[th.type].filter(item => item.version === (tr.trademarkCaseCategoryModifyList && tr.trademarkCaseCategoryModifyList.length && tr.trademarkCaseCategoryModifyList[0].goodVersion || 2096)).length || 0 : tr[th.key].length" :max="99"
                class="item"></el-badge>
              <span v-if="th.type === 'image'">
                <img class="filterTableTmg" height="30px" :src="'ipdoc' + tr[th.key]" alt="">
              </span>
              <span v-else>
                {{ format(tr[th.key], th.type, th.format,th,tr) }}
              </span>
            </span>
            <span v-else v-html="th.render(tr[th.key])"></span>
          </div>
        </td>
      </tr>
    </tbody>
    <slot></slot>
  </table>
</template>

<script>
// import { checkbox } from 'element-ui';

export default {
  props: {
    allShow: Boolean,
    columnsWidth: {
      type: Array,
      default: () => []
    },
    cellStyle: {
      type: [Object, Function],
      default: () => () => {}
    },
    cellClassName: {
      type: [Object, Function],
      default: () => () => {}
    },
    rowHeight: {
      type: [String, Number],
      default: 28
    },
    store: {
      required: true
    },
  },
  components: {
    // 'el-checkbox': checkbox,
  },
  data() {
    return {
      // selectIndex:1
    };
  },
  computed: {
    columns() {
      return this.store.states.columns;
    },
    dataStatusList() {
      return this.store.states.dataStatusList;
    },
    showData() {
      return this.store.states.showData;
    },
    editor() {
      return this.store.states.editor;
    },
    selector() {
      return this.store.states.selector;
    },
    autofill() {
      return this.store.states.autofill;
    }
  },
  methods: {
    selectionChange(yIndex,flag) {
      this.$parent.selectionChange(yIndex,flag);
    },
    multiSelect(e, x, y, columnType) {
      this.store.multiSelect(e, x, y, columnType);
    },
    selectCell(e, x, y, type) {
      this.$parent.selectCell(e, x, y, type);
      // console.log(e, x, y, type);
      // this.selectIndex+=1
      // this.selectIndex=x
    },

    format(value, type, format = true, head, data) {
      if (!format) return value;
      if (!value && type != "tmCaseList"&&value!==false) return;
      if (type === "number") {
        if (!parseInt(value, 10)) {
          return value;
        }
        return parseInt(value, 10).toLocaleString();
      }
      if (type === "searchSelect") {
        if (value && value.label) {
          return value.label;
        }
      }
      if (type === "moreSelect" && head.key === "trademarkCaseCustContactArray") {
        if (value && value.length > 0) {
          return value.map(ite => ite.custContacName).join(",");
        } else {
          return "";
        }
      }
      if (type === "moreSelect" && head.key === "caseCustRespUserArray") {
        if (value && value.length > 0) {
          return value.map(ite => ite.fullname).join(",");
        } else {
          return "";
        }
      }

      if (type === "selectItem") {
        if (value && value.label) {
          return value.label;
        } else {
          if (data) {
            switch (head.key) {
              case "custConId":
                return data.custConName ? data.custConName : "";
                break;
              case "custContactId":
                return data.custContactName ? data.custContactName : "";
                break;
              case "letterAddrId":
                return data.letterAddrName ? data.letterAddrName : "";
                break;
              case "billCustContactId":
                return data.billCustContactName ? data.billCustContactName : "";
                break;
              case "billAddrId":
                return data.billAddrName ? data.billAddrName : "";
                break;
              default:
                break;
            }
          }
        }
      }
      if (type == "select") {
        if (head) {
          if (head.options && head.options.length > 0) {
            if (
              head.options.find(item => item.value == value) &&
              head.options.find(item => item.value == value).label
            ) {
              return head.options.find(item => item.value == value).label;
            }
          }
        }
      }
      if (type === "trademarkCaseCustWorkgroups") {
        if (value && value.length > 0) {
          return value[0].groupName;
        } else {
          return "";
        }
      }
      if (type === "trademarkCaseCBWorkgroups") {
        if (value && value.length > 0) {
          return value[0].groupName;
        } else {
          return "";
        }
      }
      if (type === "goods") {
        if (value && value.length > 0) {
          if (['内-外', '外-外'].includes(data.appFromto)) {
            return value.filter(item => item.version === (data.trademarkCaseCategoryModifyList && data.trademarkCaseCategoryModifyList.length && data.trademarkCaseCategoryModifyList[0].goodVersion || 2096)).length && value.filter(item => item.version === (data.trademarkCaseCategoryModifyList && data.trademarkCaseCategoryModifyList.length && data.trademarkCaseCategoryModifyList[0].goodVersion || 2096))[0].goodName
          }
          return value[0].goodName;
        } else {
          return "";
        }
      }
      if (type === "agencyOffers") {
        if (value && value.length > 0) {
          return '详情';
        }
        return '';
      }

      if (type === "joinApps") {
        if (value && value.length > 0) {
          return value[0].nameCn;
        } else {
          return "";
        }
      }
      if (type === "trademarkCaseBasicinfos") {
        if (value && value.length > 0) {
          return value[0].regNumber;
        } else {
          return "";
        }
      }

      if (type === "tmCaseList") {
        if (data.tmCaseList && data.tmCaseList.length > 0) {
          return data.tmCaseList[0][head.key];
        } else {
          return "";
        }
      }
      if (type === "patentCaseApplicationList") {
        if (value && value.length > 0) {
          return value[0].applicantName;
        } else {
          return "";
        }
      }
      if (type === "patentInventorList") {
        if (value && value.length > 0) {
          return value[0].inventorCtitle;
        } else {
          return "";
        }
      }
      if (type === "patentPriorityClaimList") {
        if (value && value.length > 0) {
          return value[0].priorityAppDate;
        } else {
          return "";
        }
      }
      return value;
    },
    styleObj(row, column, rowIndex, columnIndex, columnsWidth) {
      return {
        width: `${columnsWidth[columnIndex]}px`,
        height: `${this.rowHeight}px`,
        textAlign: column.align,
        ...this.cellStyle({
          row,
          column,
          rowIndex,
          columnIndex
        })
      };
    },
    classObj(row, column, rowIndex, columnIndex) {
      return {
        disabled: column.disabled,
        error: !this.store.verify(column, row[column.key], rowIndex),
        ...this.cellClassName({
          row,
          column,
          rowIndex,
          columnIndex
        })
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.km-tbody {
  td {
    position: relative;
    border: none;
    border: 1px solid #d6dfe4;
    min-width: 0;
    text-indent: 4px;
  }

  .disabled {
    color: #c5c5c5;
  }
  .selected{
    background: #02799D;
    color: #fff !important;
  }
  .error {
    // background-color: #ff4c42 !important;
  }
}
</style>
