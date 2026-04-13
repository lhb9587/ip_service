<template>
  <div>

    <div>
      <el-button v-if="type === 'edit'" size="mini" type="primary" @click="addQuotationData">添加</el-button>
      <el-button v-if="type === 'edit'" size="mini" type="primary" @click="delQuotationData">删除</el-button>
    </div>
    <AgGridVue
      style="width:100%;height: 500px"
      class="ag-theme-balham"
      :columnDefs="columnDefs"
      :rowData="priceData"
      rowSelection="single"
      @grid-ready="onGridReady"
      :gridOptions="gridOptions"
      :getContextMenuItems="getContextMenuItems"
      @sortChanged="refreshEvenRowsCurrencyData"
      @filterChanged="refreshEvenRowsCurrencyData"
      suppressAutoSize
      animateRows
      :localeText="$store.state.caseInformation.localeText"
    >
    </AgGridVue>
  </div>
</template>

<script>
  import {creatematerialUrl} from "@/api/serviceApi.config.js";
  import {formatAmount} from "../../../../utils/filters";
  import {queryCurrencyUrl} from "../../../../api/billApi";
  import {getProgID} from "../../../../utils/editInOffice";
  import {deleteMaterial} from "../../../../api/customerList";
  import {delCaseMaterialUrl} from "../../../../api/caseDetail";
  import {deleteMail} from "../../../../api/material";

  export default {
    name: "OverseasQuotation",
    props: {
      caseId: {},
      caseIds: {},
      currencyList: {
        type: Array,
        default: () => []
      },
      type: {
        type: String,
        default: 'view'
      },
      priceData: {
        type: Array,
        default: () => []
      },
    },
    watch: {
      "priceData": {
        handler(n) {
          n.forEach(item => {
            this.$set(item, 'materialIds', item.materialArray && item.materialArray.map(i => i.materialId) || [])
          })
        },
        immediate: true,
        deep: false
      }
    },
    data() {
      return {
        creatematerialUrl,
        preferenceList: [
          {'label': '报价币种', prop: 'abroadCurId', width: 200, 'editable': false},
          {'label': '折扣', prop: 'discount', 'editable': true},
          {'label': '服务费(折扣后)', prop: 'serviceCost', 'editable': true},
          {'label': '官费', prop: 'officialCost', 'editable': true},
          {'label': '杂费', prop: 'otherCost', 'editable': true},
          {'label': '总金额', prop: 'sumCost', 'editable': true},
          {'label': '说明', prop: 'description', 'editable': true},
          {'label': '报价文档', prop: 'materialArray', 'editable': false},
        ],
        gridOptions: {
          ...this.$store.state.caseInformation.gridOptions,
          singleClickEdit: true,
          onCellEditingStarted() {
            // console.log('##############')
          },
          onCellValueChanged(event) {

            event.api.refreshCells()
          },
          onCellEditingStopped: (event) => {
            this.changeCost(event)
            event.api.refreshCells()
          }
        },
        gridparams: [],
        gridApi: {},
        columnApi: {},
        // priceData: [],
        columnDefs: [],
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
      }
    },
    created() {
      this.init()
    },
    methods: {
      stopEditing(){
        this['gridApi'].stopEditing(false)
      },
      fomatFloat(number, n, type) {
        return +this.$wUtil.formatFloat(number || 0, n, type) || ''
      },
      changeCost(event) {
        let index = this.priceData.findIndex(item => item == event.data)
        if (['serviceCost', 'officialCost', 'otherCost'].includes(event.colDef.field)) {
          this.computedSumCost(event.colDef.field, event.value, index)
        }
      },
      computedSumCost(key, value, index) {
        if (!this.priceData[index])return
        this.priceData[index]['sumCost'] = this.fomatFloat(Number(Number(this.priceData[index] && this.priceData[index]['serviceCost'] || 0) + Number(this.priceData[index] && this.priceData[index]['officialCost'] || 0) + (Number(this.priceData[index] && this.priceData[index]['otherCost'] || 0))), 2)
      },
      addQuotationData() {
        this.$emit('addQuotationData')
      },
      delQuotationData() {
        this.$emit('delQuotationData', this.getSelectedRows())
      },
      copy(row, value) {
        this.$copyText(value).then(
          res => {
          })
      },
      getSelectedRows() {
        if (this.gridApi) {
          const selectedNodes = this.gridApi.getSelectedNodes()
          const selectedData = selectedNodes.map(node => node.data)
          return selectedData
        } else {
          return false
        }
      },
      init() {
        this.columnDefs = [...this.defaultcolumnDefs, ...this.preferenceList.map(item => ({
          headerName: item.label,
          field: item.prop,
          resizable: true,
          sortable: true,
          editable: item.editable ? this.type === 'edit' : false,
          width: item.width,
          filter: 'agSetColumnFilter',
          cellRenderer: this.cellRenderer,
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
      },
      cellRenderer(params) {
        const type = this.type
        if (params.colDef.field === 'sid') {
          return params.rowIndex + 1
        }
        if (params.colDef.field === 'abroadCurId') {
          const h = this.$createElement
          const vnode = h({
              template: `
                <div>
                  <el-select v-if="type === 'edit'" class="abroadCurId" size="mini" v-model='abroadCurId'
                             @change="changeAbroadCurId">
                    <el-option v-for="item in currencyList" :label="item.curName" :value="item.curId"
                               :key="item.curId"></el-option>
                  </el-select>
                  <span
                    v-else>{{currencyList.find(item => item.curId == abroadCurId) && currencyList.find(item => item.curId == abroadCurId).curName }}</span>
                </div>
              `,
              props: {
                type: {},
                abroadCurId: {},
                currencyList: {},
                changeAbroadCurId: {}
              },
            },
            {
              props: {
                type,
                abroadCurId: params.value,
                currencyList: this.currencyList,
                changeAbroadCurId: (value) => this.changeAbroadCurId(value, params, params.colDef.field)
              }
            }
          )
          const div = document.createElement('div');
          this.__patch__(div, vnode, true, false)
          return div

        }
        if (params.colDef.field === 'discount') {
          return `<span style="float: right" title="${params.value}">${params.value ? `${params.value}%` : ''}</span>`
        }
        if (['serviceCost', 'officialCost', 'otherCost', 'sumCost'].includes(params.colDef.field)) {
          return `<span title="${params.value}" style="float: right">${formatAmount(params.value) || ''}</span>`
        }
        if (params.colDef.field === 'materialArray') {
          const h = this.$createElement
          const vnode = h({
              template: `
                <div>
                  <div>
                    <div style="display: flex;align-items: flex-end">
                      <el-popover
                        placement="left"
                        width="300"
                        trigger="hover"
                      >
                        <div>
                          <div style="display: flex" v-for="(item, index) in (materialArray || [])"
                               :key="index">
                            <span style="flex: 1" class="pointer ellipsis" :title="item.materialName"
                                  @click="preView(item)">{{item.materialName}}</span>
                            <span v-if="type === 'edit'" @click="delFile(item, index, materialArray || [])"
                                  class="el-icon-delete delBtn"
                                  style="font-size: 16px;margin-left: 3px;cursor: pointer;width: 20px;height: 20px;line-height: 20px;"></span>
                          </div>
                        </div>
                        <div slot="reference" style="">
                            <span style="font-size: 20px;margin-left: 3px;cursor: pointer;"
                                  class="el-icon-document"></span>
                        </div>
                      </el-popover>
                      <el-upload
                        class="upload-demo"
                        ref="uploadFile"
                        multiple
                        :data="uploadFileData"
                        :action="creatematerialUrl"
                        name="attachFile"
                        :on-success="successCallback"
                        :show-file-list="false"
                        :auto-upload="true"
                      >
                  <span v-if="type === 'edit'"
                        style="font-size: 20px;margin-left: 20px;cursor: pointer;margin-bottom: 2px;"
                        class="el-icon-document-add"></span>
                      </el-upload>
                    </div>
                  </div>
                </div>
              `,
              props: {
                type: {},
                preView: {},
                delFile: {},
                uploadFileData: {},
                materialArray: {},
                successCallback: {},
                creatematerialUrl: {}
              },
            },
            {
              props: {
                type,
                preView: (item) => this.preView(item),
                delFile: (row, index, list) => this.delFile(row, index, list, params),
                uploadFileData: {
                  type: 2,
                  materialTypeId: 301619,
                  tokenID: this.$store.getters.token,
                  caseIds: this.caseIds,
                  caseId: this.caseId
                },
                materialArray: params.value,
                successCallback: (res, file) => this.successCallback(res, params),
                creatematerialUrl: this.creatematerialUrl
              }
            }
          )
          const div = document.createElement('div');
          this.__patch__(div, vnode, true, false)
          return div
        }
        return `<span style="float: right" title="${params.value}">${params.value ? params.value : ''}</span>`
      },
      changeAbroadCurId(value, params, field) {
        this.$set(this.priceData[params.rowIndex], field, value)
      },
      delFile(row, index, list, params) {
        if (row.materialId) {
          const delmaterialId = row.materialId
          delCaseMaterialUrl({
            caseIdArray: this.caseIds,
            materialId: delmaterialId
          }).then(res => {
            this.$message.success('删除文件成功!')
            this.priceData[params.rowIndex][params.colDef.field].splice(index, 1)
            this.priceData.forEach(item => {
              this.$set(item, 'materialIds', item.materialArray && item.materialArray.map(i => i.materialId) || [])
            })
          })
        } else if (row.mailId){
          deleteMail({
            mailId: row.mailId
          }).then(res => {
            this.$message.success('删除文件成功!')
            this.priceData[params.rowIndex][params.colDef.field].splice(index, 1)
          })
        }

      },
      preView(data) {
        let url = data.address
        if (getProgID(url) || ['eml', 'msg'].includes(url.replace(/.+\./, '').toLocaleLowerCase())) {
          if (['doc', 'docx'].includes(url.replace(/.+\./, "").toLocaleLowerCase())) {
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
        } else if (['pdf', 'jpg', 'png'].some(item => url.replace(/.+\./, "").toLocaleLowerCase() == item)) {
          window.open(`/ipdoc${url}`.replace(/[+]/g, '%2B'))
        } else {
          this.$commonUtils.downLoadAll({url: `ipdoc${url}`})
        }
      },
      successCallback(res, params) {
        this.priceData[params.rowIndex][params.colDef.field].push(res.data.map(item => ({
          materialName: item.materialName,
          url: item.address,
          address: item.address,
          materialId: item.materialId,
        }))[0])
        this.priceData.forEach(item => {
          this.$set(item, 'materialIds', item.materialArray && item.materialArray.map(i => i.materialId) || [])
        })
      },
      refreshEvenRowsCurrencyData(params) {
        if (!params.columnApi.columnController.groupAutoColumns) {
          this.gridApi.forEachNode(rowNode => {
            rowNode.setDataValue(
              'sid',
              rowNode.rowIndex + 1)
          })
        }
      }
      ,
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
      }
      ,
      getRowContextmenuList(row) {
        return [
          {name: '复制', action: 'copy'}
        ]
      }
      ,
      onGridReady(params) {
        this.gridparams = params
        this.gridApi = params.api
        this.columnApi = params.columnApi
        params.api.sizeColumnsToFit()
      }
      ,

    }
  }
</script>

<style lang="scss" scoped>
  /deep/ .ag-cell-inline-editing {
    background: #fff;
    color: #333;
  }

  > > > .href {
    cursor: pointer;
    color: #409eff;
  }

  > > > .ag-row-selected {
    .href {
      cursor: pointer;
      color: #fff;
    }
  }

  > > > .el-input__inner {
    height: 24px;
  }

  > > > .delBtn {
    &:hover {
      color: red;
    }
  }

</style>
