<template>
  <div>
    <div v-if="type === 'edit'">
      <div class="uploadwrap"
           :style="{'height': '100%','background':hoverState?'RGBA(32,159,255,0.06)':'#fff','overflow':'auto','padding':'20px', 'marginTop': '10px'}"
           @click="clickUpload=true"
           @mouseover="mouseOver"
           @mouseleave="mouseLeave"
           @drop.stop.prevent="enentDrop($event)"
           @dragover.stop.prevent="hoverState=true"
           @dragleave.stop.prevent="hoverState=false"
           @dragenter.stop.prevent="hoverState=true">
        <div style="text-align: center;margin-bottom: 10px">
            <span style="font-size: 12px;">将文件拖放、粘贴到此处以添加文件，或者 <span style="color: #409EFF;cursor: pointer;"
                                                                     @click="clickUpload=true">点击上传</span></span>
        </div>

        <uploadFile :multiple="false" :clickUpload="clickUpload" @getUploadFile="getUploadFile"
                    @changeClick="clickUpload=false"></uploadFile>
      </div>
    </div>
    <div>
      <div style="margin: 5px 0;display: flex;justify-content: right">
        <el-button type="primary" size="small" @click="checkGood(getSelectedRows())">查对商品</el-button>
        <el-button v-if="type === 'edit'" type="primary" size="small" @click="delCheckGoods">删除</el-button>
      </div>
      <AgGridVue
        style="width:100%;"
        :style="{height: '400px'}"
        class="ag-theme-balham"
        :columnDefs="columnDefs"
        :rowData="checkGoodList"
        rowSelection="multiple"
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
      <pagination style="margin-bottom: 10px" v-show="checkGoodList.length > 0" :total="total"
                  :page-sizes="[10,50,100]"
                  :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize"
                  @pagination="$emit('getCheckGoodsList', listQuery)"/>
    </div>

    <el-dialog
        v-if="compareVersionView"
        title="版本比对（只显示缺漏和不一致的项目）"
        :close-on-click-modal="false"
        :visible.sync="compareVersionView"
        width="80%"
        height="80%"
        class="compareDialog"
    >
      <div>
        <div style="display: flex;">
          <div style="margin-right: 5px;margin-bottom: 10px;color: #333">选择版本:</div>
          <el-select style="flex: 1" default-first-option placeholder="请选择" @change="changeCompareVersion"
                     v-model="compareVersionList" multiple filterable clearable>
            <el-option v-for="(item, key)  in goodsVersionList.filter(j => goodsListData.find(i => i.version === j.id))" :key="item.id"
                       :label="item.typeName" :value="item.id">
            </el-option>
          </el-select>
<!--          <el-button type="primary" size="mini" style="height: 32px;margin-left: 10px" @click="exportVersions">导出</el-button>-->
        </div>
        <AgGridVue :style="{width:'100%','height': '350px',border:'1px'}"
                   class="ag-theme-balham"
                   ref="gridApi"
                   :columnDefs="versionColumnDefs"
                   :gridOptions="gridOptions2"
                   :rowData="compareVerionData"
                   rowSelection="multiple"
                   :localeText="$store.state.caseInformation.localeText"
                   :rowHeight="28"
                   animateRows
                   suppressAutoSize
        >
        </AgGridVue>
      </div>
      <div class="dialog-footer fl-ac-jc" slot="footer">
        <el-button @click="compareVersionView = false" type="primary">
          关闭
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Pagination from "@/components/Pagination";
  import uploadFile from '@/views/workbench/material_management/components/uploadFile'
  import {creatematerial} from '@/api/ipServiceApi.config.js'
  import {queryImageGoodsContrast, uploadImageAndReadGoods} from "../../../../api/caseList";
  import {getProgID} from "../../../../utils/editInOffice";

  export default {
    name: "CheckGoodsList",
    components: {uploadFile, Pagination},
    props: {
      total: {
        default: 0
      },
      type: {
        typoe: Boolean,
        default: 'edit'
      },
      goodsVersionList: {
        default: () => []
      },
      caseId: {},
      caseIdArray: {
        default: () => []
      },
      goodsListData: {
        type: Array,
        default: ()=>([])
      },
      checkGoodList: {
        default: () => []
      },
    },
    data() {
      return {
        versionColumnDefs: [],
        defaultVersionColumnDefs: [
          // {
          //   'pinned': 'left',
          //   headerName: '类别',
          //   field: 'goodClass',
          //   resizable: true,
          //   cellStyle: { 'text-align':'left','white-space': 'normal' },
          //   sortable: true,
          //   width:70,
          //   filter: 'agSetColumnFilter',
          //   menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
          //   editable: false,
          //   cellRenderer: this.cellRenderer,
          // },
          // {
          //   'pinned': 'left',
          //   headerName: '编号',
          //   field: 'number',
          //   resizable: true,
          //   cellStyle: { 'text-align':'left','white-space': 'normal' },
          //   sortable: true,
          //   width:70,
          //   filter: 'agSetColumnFilter',
          //   menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
          //   editable: false,
          //   cellRenderer: this.cellRenderer,
          // }
        ],
        allVersionColumnDefs: [],
        gridOptions2: {...this.$store.state.caseInformation.gridOptions, onGridReady: (params)=>{
            this['gridApi2'] = params.api
            // this.data.billDetailsfwf.forEach(function(data, index) {
            //   data.id = index;
            // });
            // params.api.setRowData(this.data.billDetailsfwf);
            //  params.api.sizeColumnsToFit();
          },},
        compareVersionView: false,
        compareVerionData: [],
        defaultcolumnDefs: [
          {
            headerName: '序号',
            field: 'sid',
            width: 60,
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
        listQuery: {
          pageNo: 1,
          pageSize: 10
        },
        preferenceList: [
          // {'label': '对比名称', prop: 'operateDate', 'width': '', editable: true},
          {'label': '文件名称', prop: 'materialName', flex: 1},
          {'label': '上传时间', prop: 'createDate', 'width': ''},
          {'label': '上传人', prop: 'creater', 'width': ''},
          // {'label': '日志类型', prop: 'logType', 'width': ''},
          // {'label': '操作内容', prop: 'changeLog', flex: 1},
        ],
        columnDefs: [],
        gridApi: {},
        gridOptions: {
          ...this.$store.state.caseInformation.gridOptions, ...{
            statusBar: {
              statusPanels: [
                {statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left'},
                {statusPanel: 'agSelectedRowCountComponent', align: 'left'}
              ]
            }
          }
        },
        uploadFileData: {},
        hoverState: false,
        curFile: [],
        clickUpload: false,
        percentage: 0,
        mouseHover: false
      }
    },
    created() {
      this.columnDefs = [...this.defaultcolumnDefs, ...this.preferenceList.map(item => ({
        headerName: item.label,
        flex: item.flex,
        field: item.prop,
        resizable: true,
        sortable: true,
        editable: item.editable && this.type === 'edit',
        // width: item.width || 150,
        flex: 1,
        filter: 'agSetColumnFilter',
        cellRenderer: this.cellRenderer,
        menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
        enableRowGroup: true,
        filterParams: {
          defaultToNothingSelected: true,
          newRowsAction: 'keep',
          comparator: (a, b) => {
            return this.$commonUtils.sort(a, b, item.prop)
          }
        }
      }))]
    },
    destroyed() {
      document.removeEventListener('paste', this.pasteEvent);
    },
    mounted() {
      document.addEventListener('paste', this.pasteEvent);
    },
    methods: {
      delCheckGoods() {
        if (!this.getSelectedRows().length) {
          this.$message.warning('请先选择需要删除的文件！')
          return
        }
        this.$emit('delCheckGoods', this.getSelectedRows())
      },
      changeCompareVersion(versionList) {
        this.versionColumnDefs = []
        this.$nextTick(() => {
          this.versionColumnDefs = JSON.parse(JSON.stringify(this.defaultVersionColumnDefs)).concat(this.allVersionColumnDefs.filter(item => item.version).filter(item => versionList.find(i => i === item.version)).sort((a, b) => a.version - b.version))
          // this.gridApi.sizeColumnsToFit()
          //
        })
      },
      checkGood(list) {
        if (!list.length) {
          this.$message.warning('请先选择需要查对的文件！')
          return
        }
        if (list.length > 1) {
          this.$message.warning('只能选择一个文件查对！')
          return
        }
        this.compareVersionList = this.goodsVersionList.filter(j => this.goodsListData.find(i => i.version === j.id)).map(item => item.id)
        queryImageGoodsContrast({
          versionList: this.compareVersionList,
          materialId: list[0].materialId,
          caseId: this.caseId
        }).then(res => {
          this.compareVersionView = true
          this.compareVerionData = []
          if (res.data.length) {
            const numberList = res.data.map(item => {
              if (item.data.length) {
                item.data = item.data.map((good, index) => ({
                  // ['goodName' + item.version]: good.goodName,
                  // ['goodEnName' + item.version]: good.goodEnName,
                  ['goodEnName' + item.version]: good.goodEnName,
                  ['imageGoodEnName' + item.version]: good.imageGoodEnName,
                  // number: good.number,
                  // goodClass: good.goodClass
                }))
                return item.data
              } else {
                return []
              }
            }).flat()
            numberList.forEach(item => {
              this.compareVerionData.push({
                ...item
              })
            })
          }
          this.makeVersionCol()
        })
      },
      makeVersionCol() {
        this.allVersionColumnDefs = JSON.parse(JSON.stringify(this.defaultVersionColumnDefs))
        this.goodsVersionList.forEach(item => {
          this.allVersionColumnDefs.push(
              { headerName: item.typeName + '英文商品',
                field:'goodEnName' + item.id,
                cellStyle: { 'text-align': 'left','white-space': 'normal' },
                filter: 'agSetColumnFilter',
                menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
                width: 600,
                flex: 1,
                editable: false,
                resizable: true,
                cellRenderer: this.cellRenderer,
                version: item.id
              },
              {
                headerName: '图片比对英文商品',
                field:'imageGoodEnName' + item.id,
                width: 600,
                flex: 1,
                cellStyle: { 'text-align': 'left','white-space': 'normal' },
                filter: 'agSetColumnFilter',
                menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
                editable: false,
                resizable: true,
                cellRenderer: this.cellRenderer,
                version: item.id
              }
          )
        })
        this.versionColumnDefs = JSON.parse(JSON.stringify(this.defaultVersionColumnDefs)).concat(this.allVersionColumnDefs.filter(item => this.compareVersionList.find(i => i === item.version)))
        // this.versionColumnDefs = JSON.parse(JSON.stringify(this.defaultVersionColumnDefs)).concat(this.allVersionColumnDefs)
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
      pasteEvent(e) {
        if (this.mouseHover) {
          if (e.clipboardData.files.length > 1) {
            this.$message.warning('只能上传一个文件！')
          } else if (e.clipboardData.files.length === 1) {
            if (!this.$commonUtils.checkImage([...e.clipboardData.files][0].name)) {
              this.$message.warning('只能上传图片格式的文件！')
              return;
            }
            this.createMultMaterial([...e.clipboardData.files])
          }
        }
      },
      mouseLeave() {
        this.mouseHover = false
      },
      mouseOver() {
        this.mouseHover = true
      },
      stopEditing(){
        this.gridApi.stopEditing(false)
      },
      enentDrop(e) {
        e.stopPropagation();
        e.preventDefault();
        this.hoverState = false
        this.curFile = [...e.dataTransfer.files]
        if (this.curFile.length > 1) {
          this.$message.warning('只能上传一个文件！')
        } else if (this.curFile.length === 1) {
          if (!this.$commonUtils.checkImage(this.curFile[0].name)) {
            this.$message.warning('只能上传图片格式的文件！')
            return;
          }
          this.createMultMaterial(this.curFile)
        }
      },
      getUploadFile(e) {
        this.curFile = [...e.target.files]
        this.createMultMaterial(this.curFile)
      },
      createMultMaterial(file) {
        let formData = new FormData()
        file.forEach(item => {
          formData.append("attachFile", item);
          let fileName = item.name
          formData.append("materialName", '英文比对' + this.$wUtil.getDate('', 'second', '-').replace(/\s/g, '--').replace(/:/g, '-') + fileName.substring(fileName.lastIndexOf('.')).toLowerCase());
        })
        formData.append("tokenID", this.$store.getters.token);
        formData.append("caseId", this.caseId);
        formData.append("caseIdArray", this.caseIdArray);

        uploadImageAndReadGoods(formData, (e) => {
          this.percentage = parseInt(e.loaded / e.total * 100)
        }).then(async res => {
          this.percentage = 0
          this.checkGoodList.unshift(res.data)
          // TODO
          // 弹出对比结果列表
          this.checkGood([res.data])

          // this.$emit('checkSuccess')
          // this.$emit('getCheckGoodsList', this.listQuery)
        }).catch(() => {
          this.percentage = 0
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
      },
      onGridReady(params) {
        this.gridApi = params.api
        params.api.sizeColumnsToFit()
      },
      downLoad(data) {
        const url = data.address || data.url
        const downData = {
          url: `ipdoc${url}`,
          success() {
          }
        }
        if (data.mailId) {
          downData.downLoad = data.materialName
        }
        this.$commonUtils.downLoadAll(downData)
      },
      onPreview(data) {
        let url = data.address || data.url
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
          // doEditInOffice(url, getProgID(url))
        } else if (['pdf', 'jpg', 'png'].some(item => url.replace(/.+\./, "").toLocaleLowerCase() == item)) {
          window.open(`/ipdoc${url}`.replace(/[+]/g, '%2B'))
        } else {
          this.downLoad(data)
        }
      },
      cellRenderer(params) {
        if (params.colDef.field === 'sid') {
          return params.rowIndex + 1
        }
        if (params.colDef.field === 'materialName') {
          const h = this.$createElement
          const vnode = h('div', {
            'class': {
              'baoJia': true
            },
            attrs: {
              title: params.value
            },
            on: {
              click: () => this.onPreview(params.data)
            }
          }, params.value)
          const div = document.createElement('div')
          this.__patch__(div, vnode, true, false)
          return div
          return `<span title="${params.value}">${params.value ? params.value : ''}</span>`
        }
        return `<span title="${params.value}">${params.value ? params.value : ''}</span>`
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
      copy(row, value) {
        if (value) {
          this.$copyText(value)
        }
      },
      getRowContextmenuList(row) {
        return [
          {name: '复制', action: 'copy'},
        ].filter(item => {
          if (item.permissions) {
            return this.$store.getters.permissions.includes(item.permissions)
          } else {
            return true
          }
        })
      },
    }
  }
</script>

<style scoped lang="scss">
  > > > .baoJia {
    cursor: pointer;
    color: #409eff;
    display: inline-block;
  }

  > > > .ag-row-selected {
    .baoJia {
      cursor: pointer;
      color: #fff;
    }
  }

  > > > .upload-demo {
    .el-upload-dragger {
      height: 70px;
      width: 400px;

      .el-icon-upload {
        margin-top: 0 !important;
        margin-bottom: 0 !important;
        height: 30px;
        font-size: 30px;
      }
    }
  }

  .uploadwrap {
    border: 1px dashed #c9c9c9;

    &:hover {
      border: 1px dashed #6FB6FF;
      cursor: pointer;
    }
  }
  /deep/ .ag-cell-inline-editing {
    background: #fff;
    color: #333;
  }

</style>
