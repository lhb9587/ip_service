<template>
  <div>
    <div style="display: flex;justify-content: flex-end">
      <el-button size="small" type="primary" @click="exportData">导出</el-button>
    </div>
    <AgGridVue
        :style="{width: '100%', height: clientHeight + 'px'}"
        class="ag-theme-balham"
        :columnDefs="columnDefs"
        :rowData="surplusData"
        rowSelection="single"
        @grid-ready="onGridReady"
        :gridOptions="gridOptions"
        :getContextMenuItems="getContextMenuItems"
        @sortChanged="refreshEvenRowsCurrencyData"
        @filterChanged="refreshEvenRowsCurrencyData"
        suppressAutoSize
        animateRows
        :frameworkComponents="frameworkComponents"
        :localeText="$store.state.caseInformation.localeText"
    >
    </AgGridVue>
  </div>
</template>

<script>
import {
  queryCustomerNameId
} from '@/api/caseList.js'
import {doEditInOffice, getProgID} from '@/utils/editInOffice.js'
import {
  queryOfferCust,
  importOfferCust, modifyBillBalanceBatch, modifyBillBatch, exportCaseSurplusList
} from '@/api/billApi'
import CaseSurplusAgDesc from "@/views/workbench/case/components/CaseSurplusAgDesc";
import CaseSurplusAgSelect from "@/views/workbench/case/components/CaseSurplusAgSelect";
import {querycustSelectClass} from "@/api/caseDetail";

export default {
  name: 'CaseSurplus',
  props: {
    address: {},
    surplusData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    clientHeight() {
      return document.documentElement.clientHeight - 310
    },
  },
  data() {
    const that = this
    return {
      frameworkComponents: {
        CaseSurplusAgDesc,
        CaseSurplusAgSelect
      },
      jyList: [
        // {name: '未结余', id: 1887},
        // {name: '部分结余', id: 1888},
        // {name: '已结余', id: 1889},
      ],
      gridApi: {},
      customerNameIdList: [],
      drawerState: false,
      queryData: {
        idArray: '',
        createDateStart: '',
        createDateEnd: '',
        createUserId: '',
        offerName: '',
        custId: '',
        pageSize: 10000,
        pageNo: 1
      },
      // surplusData: [],
      defaultcolumnDefs: [
        {
          headerName: '序号',
          field: 'sid',
          width: 100,
          'pinned': 'left', // 固定再左边
          enableRowGroup: true,
          // enablePivot: true,
          floatingFilter: true,
          filter: false,
          cellClass: 'vAlign',
          suppressMenu: true,
          checkboxSelection: false,
          headerCheckboxSelection: false,
          headerCheckboxSelectionFilteredOnly: true,
          cellRenderer: this.cellRenderer
        }
      ],
      total: 0,
      preferenceList: [
        {'label': ' 客户', prop: 'custName'},
        {'label': '国家', prop: 'appState'},
        {'label': '文号', prop: 'agentNum'},
        {'label': '账单号', prop: 'billNo'},
        {'label': '我方账单收款状态', prop: 'paymentStatusStr'},
        {'label': '结算理由', prop: 'finalReason', 'editable': true},
        {'label': '结余状态', prop: 'balance', 'editable': true},
        {'label': '预计境外费用', prop: 'officialCost'},
        {'label': '实际境外支出', prop: 'actualAbroadCost'},
        {'label': '商标局马德里国际商标注册官费', prop: 'mdlFee'},
        {'label': '其他垫付官费', prop: 'otherOfficialCost'},
        {'label': '境外费用盈余', prop: 'feeSurplus'},
        {'label': '备注', prop: 'caseDesc', width: 500}
      ],
      columnDefs: [],
      changeList: [],
      gridOptions: {
        ...this.$store.state.caseInformation.gridOptions, ...{
          statusBar: {
            statusPanels: [
              {statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left'},
              {statusPanel: 'agSelectedRowCountComponent', align: 'left'}
            ]
          }
        },
        onCellEditingStarted(event) {
          that.preValue = event.value
        },
        onCellEditingStopped: (event) => {
          if (that.preValue === event.value || that.preValue === null && !event.value) {
            return;
          }
          if (event.rowIndex == 0) {
            this.surplusData.forEach(j => {
              this.$set(j, event.colDef.field, event.value)
              j[event.colDef.field] = event.value
            })
            this.changeList = JSON.parse(JSON.stringify(this.surplusData))
          } else {
            if (this.changeList.findIndex(item => item.billId === event.data.billId) > -1) {
              this.changeList.splice(this.changeList.findIndex(item => item.billId === event.data.billId), 1, event.data)
            } else {
              this.changeList.push(event.data)
            }
          }
          event.api.refreshCells()
        },
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    async exportData() {
      await new Promise(res => {
        this.gridApi.stopEditing()
        setTimeout(() => res(), 100)
      })
      exportCaseSurplusList({
        caseSurplusList: this.surplusData
      }).then(res => {
        this.$commonUtils.downLoadAll({url: `ipdoc/${res.data}`})
      })
      // if (this.surplusData.find(item => !item.balance)) {
      //   this.$message.error('请选择结余状态！')
      //   return
      // }
      // if (!this.changeList.length) { // 无改动直接导出
      //   this.$message.success('操作成功!')
      //   this.$commonUtils.downLoadAll({url: `ipdoc/${this.address}`})
      //   return
      // }
      // await modifyBillBatch({
      //   billList: this.changeList.map(item => ({
      //     billId: item.billId,
      //     balance: item.balance,
      //     finalReason: item.finalReason
      //   }))
      // })
      // await this.$emit('updateAndExport', 1, this.surplusData.map(item => item.billId))
      this.changeList = []
    },
    async submit() {
      await new Promise(res => {
        this.gridApi.stopEditing()
        setTimeout(() => res(), 100)
      })
      if (this.surplusData.find(item => !item.balance)) {
        this.$message.error('请选择结余状态！')
        return
      }
      if (!this.changeList.length) { // 无改动直接关闭
        this.$message.warning('暂无改动')
        return
      }
      modifyBillBatch({
        billList: this.changeList.map(item => ({
          billId: item.billId,
          balance: item.balance,
          finalReason: item.finalReason
        }))
      }).then(res => {
        this.$message.success('保存成功！')
        this.$emit('updateCaseSurplus', 1, this.surplusData.map(item => item.billId))
        this.changeList = []
      })
    },
    getSelectedRows() {
      if (this.gridApi) {
        const selectedNodes = this.gridApi.getSelectedNodes()
        const selectedData = selectedNodes.map(node => node.data)
        return selectedData
      } else {
        return []
      }
    },
    importPriceClick() {
      if (!this.getSelectedRows().length) {
        this.$message.error('请选择报价！')
        return
      }
      importOfferCust({
        idArray: this.idArray,
        ocId: this.getSelectedRows()[0].ocId
      }).then(res => {
        this.$message.success(res.message)
        this.$emit('closeImportDialog')
      }).catch(err => {
        // this.$message.error(err.message)
      })
    },
    clearSearch() {
      this.queryData = {
        idArray: '',
        createDateStart: '',
        createDateEnd: '',
        createUserId: '',
        offerName: '',
        custId: '',
        pageSize: 10000,
        pageNo: 1
      }
    },
    queryCustomerList(query) {
      if (query !== '') {
        queryCustomerNameId({pageNo: 1, pageSize: 100, keyword: query}).then(res => {
          this.customerNameIdList = res.data
        })
      }
    },
    clickoutside() {
      this.drawerState = false
    },
    choseEditor(item) {
      if (item.prop === 'finalReason') {
        return 'CaseSurplusAgDesc'
      } else if (item.prop === 'balance') {
        return 'CaseSurplusAgSelect'
      } else {
        return ''
      }
    },
    init() {
      querycustSelectClass({ classId: "1159" }).then(res => {
        this.jyList = res.data['1159']
        this.$store.commit('caseInformation/SET_JYLIST',this.jyList || [])
        this.columnDefs = [...this.defaultcolumnDefs, ...this.preferenceList.map(item => ({
          headerName: item.label,
          field: item.prop,
          resizable: true,
          editable: !!item.editable,
          sortable: true,
          width: item.width,
          singleClickEdit: true,
          filter: 'agSetColumnFilter',
          cellRenderer: this.cellRenderer,
          cellEditor: this.choseEditor(item),
          menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
          enableRowGroup: true,
          filterParams: {
            defaultToNothingSelected: true,
            newRowsAction: 'keep',
            comparator: (a, b) => {
              return this.$commonUtils.sort(a, b, item.value)
            }
          }
        }))]
      })

      // this.queryOfferCust()
    },
    queryOfferCust() {
      queryOfferCust({...this.queryData, idArray: this.idArray}).then(res => {
        this.surplusData = res.data
        this.total = res.total
      })
    },
    preView(file) {
      return () => {
        let data = file
        let url = file.address
        if (getProgID(url) || ['eml', 'msg'].includes(url.replace(/.+\./, '').toLocaleLowerCase())) {
          if (['doc', 'docx'].includes(url.replace(/.+\./, '').toLocaleLowerCase())) {
            this.$commonUtils.viewPdf(`${url}`)
          } else {
            let flag = ''
            if (data.mailId) {
              flag = 'mailId'
            } else if (data.materialId) {
              flag = 'materialId'
            }
            url = url.replace(/&/g, '%26')
            window.open(`#/preView?address=ipdoc${url}&${flag}=${data[flag]}`.replace(/[+]/g, '%2B'))
          }
        } else if (['pdf', 'jpg', 'png'].some(item => url.replace(/.+\./, '').toLocaleLowerCase() == item)) {
          window.open(`/ipdoc${url}`.replace(/[+]/g, '%2B'))
        } else {
          this.downLoad(file)
        }
      }
    },
    downLoad(data) {
      const url = data.address
      const downData = {
        url: `ipdoc${url}`,
        success() {
          // notify.close()
        }
      }
      this.$commonUtils.downLoadAll(downData)
    },
    cellRenderer(params) {
      if (params.colDef.field === 'sid') {
        return params.rowIndex + 1
      }
      if (params.colDef.field === 'materials') {
        const h = this.$createElement
        let newDatas = []
        for (const i in params.value) {
          newDatas.push(h('p', {
            'class': {
              'fontColors': true
            },
            attrs: {
              title: params.value[i].materialName
            },
            on: {
              click: () => this.preView(params.value[i])
            }
          }, params.value[i].materialName))
        }
        const vnode = h('div', {}, newDatas)
        const div = document.createElement('div')
        this.__patch__(div, vnode, true, false)
        return div
      }
      // if (params.colDef.field === 'finalReason') {
      //   const h = this.$createElement
      //   const vnode = h({
      //         template: `
      //           <div style="z-index: 100">
      //             <el-input size="mini" type="textarea" v-model="finalReason" :rows="1" @input.native="(e) => finalReason = e.target.value"></el-input>
      //           </div>
      //         `,
      //         props: {
      //           finalReason: {},
      //         },
      //       },
      //       {
      //         props: {
      //           finalReason: params.value,
      //         }
      //       }
      //   )
      //   const div = document.createElement('div');
      //   this.__patch__(div, vnode, true, false)
      //   return div
      // }
      if (params.colDef.field === 'balance') {
        const value = this.jyList.find(item => item.id == params.value) && this.jyList.find(item => item.id == params.value).typeName
        return `<span style="" title="${value}">${value ? value : ''}</span>`
      }
      return `<span style="" title="${params.value}">${params.value || params.value === 0 ? params.value : ''}</span>`
    },
    refreshEvenRowsCurrencyData(params) {
      if (!params.columnApi.columnController.groupAutoColumns) {
        this.gridApi.forEachNode(rowNode => {
          rowNode.setDataValue(
              'sid',
              rowNode.rowIndex + 1)
        })
      }
    },
    getContextMenuItems(params) {
      if (!params.node || !params.node.data) {
        return []
      }
      return this.getRowContextmenuList(params.node.data).map(item => ({
        name: item.name,
        action: () => {
          this[item.action](params.node.data, params.value, params.node)
        }
      }))
    },
    getRowContextmenuList(row) {
      return [
        {name: '复制', action: 'copy'}
      ]
    },
    onGridReady(params) {
      this.gridparams = params
      this.gridApi = params.api
      this.columnApi = params.columnApi
      // params.api.sizeColumnsToFit()
    },
    copy(row, value) {
      if (value) {
        this.$copyText(value).then(
            res => {
            })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .ag-cell-inline-editing {
  background: #fff;
  color: #333;
}

.fontColors {
  color: #409eff;
  cursor: pointer;
}

.button-group-search {
  /*position: relative;*/
  display: flex;

  .searchWrap {
    border-radius: 5px;
    top: 110px;
    /*left: 0;*/
    width: 550px;
    max-height: 500px;
    position: absolute;
    background: #ffffff;
    border: 1px solid #d4d5d5;
    z-index: 4;
    overflow: hidden;
    /*padding: 20px 0;*/
    box-shadow: 0 3px 6px rgba(111, 111, 111, 0.2);

    /deep/ .el-form {
      padding: 20px 0;

      .el-form-item__label {
        text-align: left;
        padding-left: 32px;
        font-weight: normal;
      }

      .el-form-item__content {
        display: flex;

        input {
          border-top: 0;
          border-left: 0;
          border-radius: 0;
          border-right: 0
        }

        .el-radio {
          line-height: 28px;
        }
      }
    }

    .clearWrap {
      display: flex;
      justify-content: flex-end;
      /*width: 100%;*/
      background: #fff;
      right: 10px;
      bottom: 0;
      padding-bottom: 10px;
      position: absolute;
      z-index: 1;
    }
  }
}

.search-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}
</style>
