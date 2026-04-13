<template>
  <div>
    <!--    <el-button class="brush_right" :class="brushRightHasFilter?'red':''" @click="brushRight" type="text"-->
    <!--               icon="el-icon-brush"></el-button>-->
    <div style="display: flex;justify-content: space-between">
      <div style="flex: 3;display: flex;align-items: center;">
        <el-button style="height: 28px;" v-if="['异议', '无效宣告申请'].includes(ch_caseTypr)" type="primary" size="mini" @click="exportYz">导出诉争/引证对比表</el-button>
        <el-button style="height: 28px;" v-if="type === 'edit'" size="mini" type="primary" @click="addYzData">添加</el-button>
        <el-button style="height: 28px;" v-if="type === 'edit'" size="mini" type="primary" @click="delYzData">删除</el-button>
      </div>
      <div v-if="fileSize" style="margin-right: 15px;color: #C0C4CC;display: flex;align-items: center;">附件大小：{{fileSize}}</div>
      <div style="flex: 7;display:flex;margin-bottom: 5px" v-if="type === 'edit' && idFlData">
        <el-input style="width: 100%;" v-model="fileName" disabled size="mini"/>
        <div>
          <el-button style="margin-left:10px" size="mini" type="primary" @click="getfileData(materialTypeId,$event)">
            导入压缩包
          </el-button>
        </div>
        <div>
          <el-button style="margin-left: 10px" size="mini" type="primary" @click="downLoadModelZip">查看压缩包模板</el-button>
        </div>
      </div>
    </div>

    <!--    <el-button v-if="type === 'edit' && idFlData" size="mini" type="primary" @click="importZip">导入压缩包</el-button>-->
    <AgGridVue :style="{width:'100%',height: '300px'}"
               id="right-grid"
               class="ag-theme-balham"
               :columnDefs="columnDefs"
               :rowData="tableData"
               @grid-ready="onGridReady"
               rowSelection="multiple"
               :gridOptions="gridOptions"
               suppressAutoSize
               animateRows
               :getContextMenuItems="getContextMenuItems"
               @sortChanged="refreshEvenRowsCurrencyData"
               @filterChanged="refreshEvenRowsCurrencyData"
               :localeText="$store.state.caseInformation.localeText"
               :groupSelectsChildren="true"
               :suppressAggFuncInHeader="true"
               :frameworkComponents="frameworkComponents"
               rowHeight="28"
    >
    </AgGridVue>
  </div>
</template>

<script>
  import {creatematerial} from '@/api/ipServiceApi.config.js'
  import agInputSearch from '@/components/ag-input-search'
  import {doEditInOffice, getProgID} from '../../../../utils/editInOffice'
  import {createTmCaseQuotesTemplate, recordOnlienEdit} from '../../../../api/caseList'
  import {deleteMaterial} from '../../../../api/customerList'

  export default {
    name: 'YZgrid',
    props: {
      fileSize: {},
      caseData: {},
      ch_caseTypr: {},
      materialTypeId: {
        default: undefined
      },
      fileName: {
        type: String,
        default: ""
      },
      idFlData: {
        default: false,
        type: Boolean
      },
      rightKey: {
        default: false,
        type: Boolean
      },
      type: {
        default: 'view',
        type: String
      },
      tableData: {
        type: Array,
        default: () => []
      },
      caseId: {},
      tmCaseId: {},
      tableTitleList: {
        type: Array
      }
    },
    data() {
      return {
        creatematerial,
        // tableTitleList: [],
        frameworkComponents: {
          agInputSearch: agInputSearch
        },
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
            event.api.refreshCells()
          }
        },
        defaultcolumnDefs: [
          {
            headerName: '序号',
            field: 'sid',
            width: 60,
            'pinned': 'left', //固定再左边
            resizable: true,
            filter: false,
            cellClass: 'vAlign',
            suppressMenu: true,
            checkboxSelection: false,
            headerCheckboxSelection: false,
            headerCheckboxSelectionFilteredOnly: true,
            cellRenderer: this.cellRenderer

          }
        ],
        columnDefs: [],
        gridparams: {},
        gridApi: {},
        columnApi: {}
      }
    },
    created() {
      this.getColumDefs()
    },
    methods: {
      async exportYz() {
        await new Promise(res => {
          this['gridApi'].stopEditing(false)
          setTimeout(() => res(), 300)
        })
        createTmCaseQuotesTemplate({
          caseId: this.caseData.caseId,
          approvalNo: this.caseData.approvalNo,
          caseType: this.caseData.caseType,
          imageFile: this.caseData.imageFile,
          appDate: this.caseData.appDate,
          approvalDate: this.caseData.approvalDate,
          respondentNameCn: this.caseData.respondentNameCn,
          goods: this.caseData.goods,
          quotes: this.caseData.quotes,
          goodClasses: this.caseData.goodClasses,
          parentAppDate: this.caseData.parentAppDate,
        }).then(res => {
          this.$message.success(res.message)
          this.$commonUtils.downLoadAll({url: `ipdoc/${res.data.address}`})
        })
      },
      getfileData(materialTypeId, e) {
        this.$emit('getfileData', materialTypeId, e)
      },
      downLoadModelZip() {
        this.$commonUtils.downLoadAll({url: `/ipdoc/material/template/异议网申递交材料模板.zip`})
      },
      onsuccess(response, file, fileList) {
        response.data[0].name = response.data[0].materialName
        this.$emit('getResponseAndFile', {response, file})
        // this.flData.material = response.data[0]
        // this.flData.materialId = response.data[0].materialId
      },
      handleRemove(file, fileList, caseId) {
        let delmaterialId
        if (file.response) {
          delmaterialId = file.response.data[0].materialId
        } else {
          delmaterialId = file.materialId
        }
        this.$emit('deleteFile', {delmaterialId})
        // deleteMaterial({materialId: delmaterialId}).then(res => {
        //   // this.flData.material = {}
        //   // this.flData.materialId = ''
        // })
      },
      getUploadData() {
        const data = {
          tokenID: this.$store.getters.token,
          caseIds: [this.tmCaseId],
          materialTypeId: this.materialTypeId
        }
        return data
      },
      addYzData() {
        this.$emit('addYzData')
      },
      delYzData() {
        this.$emit('delYzData', this.getSelectedRows())
      },
      scrollToBottom() {
        this.$nextTick(() => {
          let sObj = document.getElementById('right-grid').getElementsByClassName('ag-body-viewport')[0]
          sObj.scrollTop = sObj.scrollHeight
        })
      },
      formatAmount(num) {
        return formatAmount(num)
      },
      refreshCells() {
        this.gridApi.stopEditing(false)
        this.gridApi.refreshCells()
      },
      preView(data) {
        let url = data.address
        if (getProgID(url)) {
          // recordOnlienEdit({materialId: data.materialId})
          // doEditInOffice(url, getProgID(url))
        } else if (['eml', 'msg'].includes(url.replace(/.+\./, '').toLocaleLowerCase())) {
          let flag = ''
          if (data.mailId) {
            flag = 'mailId'
          } else if (data.materialId) {
            flag = 'materialId'
          }
          url = url.replace(/&/g, '%26')
          window.open(`#/preView?address=ipdoc${url}&${flag}=${data[flag]}`.replace(/[+]/g, '%2B'))
          // doEditInOffice(url, getProgID(url))
        } else if (['pdf', 'jpg', 'png'].some(item => url.replace(/.+\./, '').toLocaleLowerCase() == item)) {
          window.open(`/ipdoc${url}`.replace(/[+]/g, '%2B'))
        } else {
          this.downLoad(data)
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
        if (data.mailId) {
          downData.downLoad = data.materialName
        }
        this.$commonUtils.downLoadAll(downData)
      },
      cellRenderer(params) {
        if (params.colDef.field == 'sid' && params.value !== '') {
          return params.rowIndex + 1
        }
        if (params.colDef.field === 'reason') {
          const h = this.$createElement
          const vnode = h({
            template: `
              <div>
                <el-tooltip placement="top" effect="light">
                  <div slot="content" style="max-width: 50vw;max-height: 50vh;overflow-y: auto;font-size: 15px">${params.value}</div>
                  <div>${params.value}</div>
                </el-tooltip>
              </div>`,

          }, {}, '')
          const div = document.createElement('div')
          this.__patch__(div, vnode, true, false)
          return div
        }
        if (params.colDef.field == 'material') {
          const h = this.$createElement
          const vnode = h('div', {
            'class': {
              'href': true
            },
            attrs: {
              title: params.value && params.value.materialName
            },
            on: {
              click: () => this.preView(params.value || {})
            }
          }, params.value && params.value.materialName)
          const div = document.createElement('div')
          this.__patch__(div, vnode, true, false)
          return div
        }
        if (params.colDef.field == 'createDate') {
          return `<span title="${params.data.material && params.data.material.createDate}">${params.data.material && params.data.material.createDate || ''}</span>`
        }
        return `<span title="${params.value}">${(params.value || params.value === 0) ? params.value : ''}</span>`
      },
      onGridReady(params) {
        this.gridparams = params
        this.gridApi = params.api
        this.columnApi = params.columnApi
        params.api.sizeColumnsToFit()
      },
      brushRight() {
        // let data =   this.$commonUtils.getFilterModel(this.$options.name+this.$route.name,'FilterModel')
        let arr = this.columnDefs.map(item => item.field)// Object.keys(data)
        arr.forEach(item => {
          this.gridApi.destroyFilter(item)
        })
      },
      getColumDefs() {
        this.columnDefs = [...this.defaultcolumnDefs, ...this.tableTitleList.map(item => ({
          headerName: item.title,
          field: item.value,
          width: item.width,
          resizable: true,
          editable: !!item.editable,
          cellEditor: item.cellEditor,
          // sortable: true,
          filter: 'agSetColumnFilter',
          cellRenderer: this.cellRenderer,
          menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
          // enableRowGroup: true,
          filterParams: {
            refreshValuesOnOpen: true,
            comparator: (a, b) => {
              return this.$commonUtils.sort(a, b, item.value)
            }
          }
        }))]
      },
      refreshEvenRowsCurrencyData(params) {
        if (!params.columnApi.columnController.groupAutoColumns) {
          this.gridApi.forEachNode(rowNode => {
            rowNode.setDataValue(
              'sid',
              rowNode.rowIndex + 1)
          })
        }
        if (params.type == 'filterChanged') {
          // this.$commonUtils.saveFilterModel(this.$options.name+this.$route.name,'FilterModel',this.gridApi.getFilterModel())
          // var data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel');
          var arr = Object.keys(this.gridApi.getFilterModel())
          if (arr.length) {
            this.brushRightHasFilter = true
          } else {
            this.brushRightHasFilter = false
          }
        }
      },
      getContextMenuItems(params) {
        if (!params.node || !params.node.data) {
          return []
        }
        return this.getRowContextmenuList(params.node.data).map(item => ({
          name: item.name,
          action: () => {
            this[item.action](params.node.data, params.node.rowIndex, params.value, params.node)
          }
        }))
      },
      getRowContextmenuList(row) {
        return [
          {name: '复制', action: 'copy', rightKey: false},
          // { name: '商标导入', action: 'installtmmessage', permissions: 185 },
          {name: '修改', action: 'editFun', rightKey: true},
          {name: '删除', action: 'delete', rightKey: true}
        ].filter(i => !i.rightKey || i.rightKey === this.rightKey && this.type !== 'view')
      },
      editFun(row, index) {
        this.$emit('edit', row, index)
      },
      delete(row) {
        this.$emit('delete', row)
      },
      copy(row, index,  value) {
        if(value){
          this.$copyText(value).then(
            res => {
            })
        }
      },
      getSelectedRows() {
        if (this.gridApi) {
          const selectedNodes = this.gridApi.getSelectedNodes()
          const selectedData = selectedNodes.map(node => node.data)
          return selectedData
        } else {
          return false
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
</style>
