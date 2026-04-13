<template>
  <div>
    <div class="search-wrapper">
      <el-button-group class="button-group-search" v-clickoutside="clickoutside">
        <el-button id="mySearch" type="primary" size="mini" @click="queryOfferCust">搜索</el-button>
        <el-button type="primary" class="searchRight" size="mini" icon="el-icon-arrow-down"
                   @click.stop.prevent="drawerState=true"></el-button>
        <transition name="show" mode="out-in">
          <div class="searchWrap" v-show="drawerState">
            <div style="width: 550px;max-height: 500px;overflow: auto">
              <el-form label-width="120px" size="mini" class="form-container">
                <el-form-item label="客户:">
                  <el-select
                    v-model="queryData['custId']"
                    ref="custSelect"
                    filterable
                    clearable
                    remote
                    reserve-keyword
                    placeholder="请输入客户姓名"
                    :remote-method="queryCustomerList">
                    <el-option
                      v-for="item in customerNameIdList"
                      :key="item.custId"
                      :label="item.fullname"
                      :value="item.custId"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="创建时间:">
                  <el-date-picker v-model="queryData.createDateStart" format='yyyy-MM-dd'
                                  value-format="yyyy-MM-dd"
                                  align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">
                  </el-date-picker>
                  至
                  <el-date-picker v-model="queryData.createDateEnd" format='yyyy-MM-dd'
                                  value-format="yyyy-MM-dd"
                                  align="right"
                                  type="date" placeholder="选择日期" :picker-options="pickerOptions">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="报价人:">
                  <el-select :clearable="true"
                             default-first-option filterable v-model="queryData.createUserId"
                  >
                    <el-option v-for="(item,key) in $store.getters.userList" :key="key"
                               :label="item.fullname" :value="item.userId"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="报价名称:">
                  <el-input v-model="queryData.offerName " placeholder="请输入报价名称" clearable></el-input>
                </el-form-item>
              </el-form>

            </div>
            <div class="clearWrap">
              <el-button size="mini" @click="clearSearch"><span>重置</span></el-button>
              <el-button type="primary" size="mini" @click="queryOfferCust">搜索</el-button>
            </div>
          </div>
        </transition>
      </el-button-group>
      <el-button type="primary" size="mini" style="margin-left: 10px" @click="importPriceClick">导入报价</el-button>
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
  import {
    queryCustomerNameId
  } from '@/api/caseList.js'
  import { doEditInOffice, getProgID } from '@/utils/editInOffice.js'
  import {
    queryOfferCust,
    importOfferCust
  } from '@/api/billApi'

  export default {
    name: 'PriceGrid',
    data() {
      return {
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
        priceData: [],
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
          { 'label': ' 创建日期', prop: 'createDate' },
          { 'label': '创建人', prop: 'createUserIdStr' },
          { 'label': '报价描述', prop: 'offerName' },
          { 'label': '客户', prop: 'custIdStr' },
          { 'label': '类别个数', prop: 'classNumTotal' },
          { 'label': '国家数量', prop: 'countrysNum' },
          { 'label': '进入国家', prop: 'countryCns' },
          { 'label': '瑞士法郎汇率', prop: 'exchangeRate' },
          { 'label': '报价文档', prop: 'materials' },
          { 'label': 'A方案合计', prop: 'totalA' },
          { 'label': 'B方案合计', prop: 'totalB' }
        ],
        columnDefs: [],
        gridOptions: {
          ...this.$store.state.caseInformation.gridOptions, ...{
            statusBar: {
              statusPanels: [
                { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
                { statusPanel: 'agSelectedRowCountComponent', align: 'left' }
              ]
            }
          }
        }
      }
    },
    props: ['idArray'],
    created() {
      this.init()
    },
    methods: {
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
          queryCustomerNameId({ pageNo: 1, pageSize: 100, keyword: query }).then(res => {
            this.customerNameIdList = res.data
          })
        }
      },
      clickoutside() {
        this.drawerState = false
      },
      init() {
        this.columnDefs = [...this.defaultcolumnDefs, ...this.preferenceList.map(item => ({
          headerName: item.label,
          field: item.prop,
          resizable: true,
          sortable: true,
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
        this.queryOfferCust()
      },
      queryOfferCust() {
        queryOfferCust({ ...this.queryData, idArray: this.idArray }).then(res => {
          this.priceData = res.data
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
        return `<span title="${params.value}">${params.value ? params.value : ''}</span>`
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
          { name: '复制', action: 'copy' }
        ]
      },
      onGridReady(params) {
        this.gridparams = params
        this.gridApi = params.api
        this.columnApi = params.columnApi
        params.api.sizeColumnsToFit()
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
