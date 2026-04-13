<template>
  <div class="ElectronWrap">
    <div v-if="!isOuter" style="display: flex;justify-content: right;margin-bottom: 10px">
      <el-button  size="mini" type="primary" @click="createFile">新建</el-button>
<!--      <el-button size="mini" type="primary" @click="downloadMaterial">下载</el-button>-->
    </div>
    <el-button class="brush_right" :class="brushRightHasFilter?'red':''" @click="brushRight" type="text"
               icon="el-icon-brush"></el-button>
    <AgGridVue
      style="width:100%;"
      :style="{'height': clientHeight + 'px'}"
      class="ag-theme-balham"
      :columnDefs="columnDefs"
      :rowData="materialList"
      rowSelection="multiple"
      @grid-ready="onGridReady"
      :gridOptions="gridOptions"
      :getContextMenuItems="getContextMenuItems"
      @sortChanged="refreshEvenRowsCurrencyData"
      @filterChanged="refreshEvenRowsCurrencyData"
      suppressAutoSize
      animateRows
      :localeText="$store.state.caseInformation.localeText"
      :suppressDragLeaveHidesColumns="true"
      :suppressMakeColumnVisibleAfterUnGroup="true"
      rowGroupPanelShow="always"
      :groupSelectsChildren="true"
      :suppressAggFuncInHeader="true"
      :masterDetail="true"
      keepDetailRows
      @dragStopped="dragStopped"
    >
    </AgGridVue>
    <!--    <el-collapse class="materialModule" v-model="activeNames" v-if="materialList.length">-->
    <!--      <el-collapse-item v-for="(item,index) in materialList" :key="index" :name="index">-->
    <!--        <template slot="title">-->
    <!--          <p>-->
    <!--            &lt;!&ndash; <img style="vertical-align: middle;width:25px;margin-right:5px;margin-left: -25px" :src="require(`@/assets/电子档案图标/${item.typeName}.png`)" alt=""> &ndash;&gt;-->
    <!--            <span>{{item.docTypeName}}</span></p>-->
    <!--        </template>-->
    <!--        <AgGridVue :style="{width:'100%',maxHeight: 400+'px',height:getHeight(item.evenList)}"-->
    <!--                   class="ag-theme-balham"-->
    <!--                   :columnDefs="columnDefs"-->
    <!--                   :rowData="item.evenList"-->
    <!--                   rowSelection="multiple"-->
    <!--                   @grid-ready="(params)=>onGridReady(params,index)"-->
    <!--                   :gridOptions="gridOptions"-->
    <!--                   @dragStopped="dragStopped"-->
    <!--                   :getContextMenuItems="()=>([])"-->
    <!--                   suppressAutoSize-->
    <!--                   animateRows-->
    <!--                   :rowHeight="28"-->
    <!--                   @rowClicked="(params)=>rowClick(params,index)"-->
    <!--                   @rowDoubleClicked="(params)=>rowDblclick(params.data,item)"-->
    <!--                   :localeText="$store.state.caseInformation.localeText"-->
    <!--        >-->
    <!--        </AgGridVue>-->
    <!--      </el-collapse-item>-->
    <!--    </el-collapse>-->
  </div>
</template>

<script>
  import {
    modifyMailInfo
  } from '@/api/caseDetail'
  import { downloadMaterial } from '@/api/caseList.js'
  import { doEditInOffice, getProgID } from '@/utils/editInOffice.js'
  import delConfirm from './delConfirm'
  import { deleteNwMaterial } from '../../../api/material'

  const functionalComponent = {
    functional: true,
    props: {
      render: Function,
      params: {}
    },
    render(h, ctx) {
      const params = { ...ctx.props.params }
      return ctx.props.render.call(ctx, h, params)
    }
  }
  export default {
    name: 'MaterialList',
    props: {
      materialList: {
        type: Array,
        default: () => []
      },
      custId: {},
      nwCountryId: {
        type: [Number, String]
      },
      isOuter: {
        type: Boolean
      }
    },
    computed: {
      clientHeight() {
        return document.documentElement.clientHeight - (this.isOuter ? 230 : 260)
      }
    },
    watch: {
      custId: {
        handler(n) {
          console.log('custId:', n)
        },
        immediate: true
      },
      nwCountryId: {
        handler(n) {
          console.log('nwCountryId:', n)
        },
        immediate: true
      }
    },
    data() {
      var tableHeader = []
      if (localStorage.getItem('tableHeader') && JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name)) {
        tableHeader = JSON.parse(localStorage.getItem('tableHeader')).find(item => item.name == this.$options.name).tableHeader
      }
      return {
        brushRightHasFilter: false,
        tableHeader,
        defaultcolumnDefs: [
          {
            headerName: '序号',
            field: 'sid',
            width: 60,
            resizable: true,
            'pinned': 'left', //固定再左边
            enableRowGroup: true,
            floatingFilter: true,
            filter: false,
            autoHeight: true,
            cellClass: 'vAlign',
            suppressMenu: true,
            checkboxSelection: false,
            headerCheckboxSelection: false,
            headerCheckboxSelectionFilteredOnly: true,
            cellRenderer: this.cellRenderer
          }
        ],
        gridApi: {},
        preferenceList: [
          { 'label': '文件名称', prop: 'materialName', width: 200 },
          { 'label': '文件分类', prop: 'docTypeName', width: 200 },
          { 'label': '文件类型', prop: 'typeName', width: 200 },
          { 'label': '附件名称', prop: 'fileName', width: 200 },
          { 'label': '关键字', prop: 'keywordStr', width: 200 },
          { 'label': '案件类型', prop: 'nwTypeStr', width: 200 },
          { 'label': ' 外代所名称', prop: 'fullname', width: 100 },
          { 'label': ' 国家/地区', prop: 'countryCn', width: 100 },
          { 'label': '上传人', prop: 'creater', width: 100 },
          { 'label': '上传时间', prop: 'createDate', width: 100 }
          // { 'label': '操作', prop: 'operation', width: 100 }
        ],
        columnDefs: [],
        selectedList: [],
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
    created() {
      let list = []
      if (this.tableHeader && this.tableHeader.length) {
        list = this.tableHeader
      } else {
        list = this.preferenceList
      }
      // this.tableHeader = this.preferenceList.map(item => ({
      //   label: item.label,
      //   prop: item.prop,
      //   width: this.getLoactionWidth(item.label)
      // }))
      this.columnDefs = [...this.defaultcolumnDefs, ...list.map(item => ({
        headerName: item.label,
        field: item.prop,
        resizable: true,
        sortable: true,
        width: this.getLoactionWidth(item.label) == 'auto' ? 200 : this.getLoactionWidth(item.label),
        autoHeight: true,
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
      this.saveLocation()
    },
    methods: {
      downloadMaterial() {
        if (this.getSelectedRows().length < 1) {
          this.$message.error('请选择文件!')
          return
        }
        downloadMaterial({
          materialIdList: this.getSelectedRows().map(item => item.materialId),
          mailIdList: this.getSelectedRows().map(item => item.mailId)
        }).then(res => {
          res.data && this.$commonUtils.downLoadAll({ download: this.agentNum, url: 'ipdoc' + res.data })
        })
      },
      brushRight() {
        let arr = this.columnDefs.map(item => item.field)// Object.keys(data)
        arr.forEach(item => {
          this.gridApi.destroyFilter(item)
        })
        this.brushRightHasFilter = false
      },
      copy(row, value) {
        if (value) {
          this.$copyText(value).then(
            res => {
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
      editFun(row) {
        this.$emit('edit', row)
      },
      handledeleElement(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res => {
          deleteNwMaterial({materialIdList: [row.materialId]}).then(res => {
            this.$message.success('删除成功!')
            this.$emit('updateList', this.isOuter)
          })
        })
      },
      getRowContextmenuList(row) {
        return [
          { name: '复制', action: 'copy' },
          { name: '修改', action: 'editFun', permissions: 359 },
          { name: '删除', action: 'handledeleElement', permissions: 359 }
        ].filter(item => {
          if (item.permissions) {
            return this.$store.getters.permissions.includes(item.permissions)
          } else {
            return true
          }
        })
      },
      getLoactionWidth(label) {
        if (!localStorage.getItem('tableHeader')) {
          return 120
        } else {
          var arr = JSON.parse(localStorage.getItem('tableHeader'))
          if (arr.find(item => item.name == this.$options.name)) {
            var header = arr.find(item => item.name == this.$options.name).tableHeader
            if (header.find(item => item.label == label)) {
              return header.find(item => item.label == label).width
            } else {
              return 120
            }
          } else {
            return 120
          }
        }
      },
      dragStopped(params) {
        let tableHeader = params.columnApi.columnController.gridColumns.map(item => ({
          label: item.colDef.headerName,
          width: item.actualWidth,
          prop: item.colDef.field
        })).filter(item => item.prop != 'sid' && item.prop != 'group')
        this.tableHeader = tableHeader
        this.saveLocation()
      },
      saveLocation() {
        if (!localStorage.getItem('tableHeader')) {
          let arr = []
          arr.push({ name: this.$options.name, tableHeader: this.tableHeader })
          localStorage.setItem('tableHeader', JSON.stringify(arr))
        } else {
          let arr = JSON.parse(localStorage.getItem('tableHeader'))
          if (arr.find(item => item.name == this.$options.name)) {
            arr.find(item => item.name == this.$options.name).tableHeader = this.tableHeader
            localStorage.setItem('tableHeader', JSON.stringify(arr))
          } else {
            arr.push({ name: this.$options.name, tableHeader: this.tableHeader })
            localStorage.setItem('tableHeader', JSON.stringify(arr))
          }
        }
      },
      refreshEvenRowsCurrencyData(params) {
        // this.currentPageSize = params.api.rowModel.rootNode.allChildrenCount
        if (!params.columnApi.columnController.groupAutoColumns) {
          this.gridApi.forEachNode(rowNode => {
            rowNode.setDataValue(
              'sid',
              rowNode.rowIndex + 1)
          })
        }
        if (Object.keys(this.gridApi.getFilterModel()).length) {
          this.brushRightHasFilter = true
        } else {
          this.brushRightHasFilter = false
        }
      },
      createFile() {
        this.$emit('createFile')
      },
      rowDblclick(row, item) {

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
      rowClick(params, index) {
        if (this.getSelectedRows(this['gridApi']).length > 1) return
        if (this.selectedList.find(i => i.createDate === params.data.createDate)) {
          params.api.deselectNode(params.node)
          this.selectedList.splice(this.selectedList.indexOf(i => i.createDate === params.data.createDate), 1)
        } else {
          this.selectedList = [params.data]
        }
      },
      onGridReady(params) {
        this.gridparams = params
        this.gridApi = params.api
        this.columnApi = params.columnApi
        // params.api.sizeColumnsToFit()
      },
      cellRenderer(params) {
        if (params.colDef.field == 'sid') {
          return params.rowIndex + 1
        }
        if (params.colDef.field === 'fileName') {
          const h = this.$createElement
          const vnode = h('div', {
            'class': {
              'fontColors': true
            },
            attrs: {
              title: params.value
            },
            on: {
              click: () => this.preView(params.data)
            }
          }, params.value)
          const div = document.createElement('div')
          this.__patch__(div, vnode, true, false)
          return div
        }
        // if (params.colDef.field == 'operation') {
        //
        //   const h = this.$createElement
        //   let vnode = h(delConfirm, {
        //     props: {
        //       ctx: params.data,
        //       permissionList: this.$store.getters.permissions,
        //       name: this.$store.state.user.name,
        //       delItem: () => {
        //         this.deleteRow(params.data)
        //       },
        //       editItem: () => {
        //         this.editFile(params.data)
        //       },
        //       changeItem: (mailId, mdocName) => {
        //         this.changeName(mailId, mdocName, params)
        //       }
        //     }
        //   })
        //   const div = document.createElement('div')
        //   this.__patch__(div, vnode, true, false)
        //   return div
        // }
        return `<span title="${params.value}">${params.value ? params.value : ''}</span>`
      },
      editFile(row, item) {
        alert('我是编辑，点我干嘛？')
      },
      deleteRow(row) {
        alert('我是删除，点我干嘛？')
      },
      preView(data) {
        let url = data.address
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
      }
    }
  }
</script>

<style lang="scss" scoped>
  > > > .fontColors {
    color: #409eff;
    cursor: pointer;
  }

  .button_wrap {
    width: 100%;
    display: flex;
    height: 85px;
    align-items: center;
    justify-content: flex-end;

    .el-button {
      margin-right: 30px;
    }
  }

  /deep/ .el-collapse {
    border: 0;

    .el-collapse-item {
      margin-top: 0px;
    }

    .el-collapse-item__header {
      text-align: left !important;
      background: #fff !important;
      border-top: 0 !important;
      border-bottom: 1px solid #ebeef5 !important;

      .el-collapse-item__arrow.el-icon-arrow-right {
        display: none;
      }
    }

    .el-collapse-item__wrap {
      border-bottom: 0;
      box-sizing: border-box;
    }

    .step-div {
      padding: 10px 65px;
    }

    .fg-div {
      height: 20px;
      background: #e4e4e4;
    }

    /deep/ section {
      padding-bottom: 10px !important;
    }

    /deep/ .el-collapse-item__wrap {
      width: 100%;
    }

    .el-collapse-item__header {
      font-size: 16px;
      color: #6aa7ff;
    }

    /deep/ .el-tabs--border-card > .el-tabs__content {
      padding: 5px !important;
    }
  }

  .ElectronWrap {
    /*width: 100%;*/
    /*position: relative;*/
    padding: 15px;

    .updateCaseEvolve {
      color: #409eff;
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
    }
  }

  .taskRecord_span {
    margin-right: 16px;
  }

  .materialName {
    color: #409eff;
    display: block;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    margin-right: 10px;
  }

  .ag-row-selected {
    position: relative;

    .materialName, .fontColors {
      color: #fff;
    }

    .el-icon-view {
      color: #fff;
    }
  }

  .brush_right {
    position: absolute;
    right: 20px;
    z-index: 1;
    top: 50px;
  }

</style>
