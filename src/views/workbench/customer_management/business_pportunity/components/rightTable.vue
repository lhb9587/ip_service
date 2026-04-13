<template>
  <div style="position:relative;height: 100%">

    <div style="margin-bottom: 4px; display: flex; gap: 8px;" v-if="sign === 'createCao'">
      <el-button type="primary" size="mini" @click="gridApi.deselectAll(); gridApi.selectAllFiltered()">全选</el-button>
      <el-button size="mini" @click="gridApi.deselectAll()">清除所选</el-button>
    </div>
    <el-button class="brush_right" :class="brushRightHasFilter?'red':''" @click="brushRight" type="text"
               icon="el-icon-brush"></el-button>
    <AgGridVue :style="{width:'100%',height: tableHeight ? tableHeight + 'px' : '100%'}"
               id="right-grid"
               class="ag-theme-balham"
               :columnDefs="columnDefs"
               :rowData="data"
               @grid-ready="(params) => { gridApi = params.api }"
               @rowClicked="rowClick"
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
               :pinnedBottomRowData="pinnedBottomRowData"
               :rowHeight="isFinance ? $commonUtils.getRowHeight() : 28"
    >
    </AgGridVue>
    <pagination
      v-if="total"
      :total="total"
      :page.sync="listQuery.pageNo"
      :limit.sync="listQuery.pageSize"
      @pagination="$emit('search', {listQuery:listQuery})"
      :pageSizes="pageSizesList"
    />

<!--    预览-->
    <el-dialog
      title="预览"
      append-to-body
      :visible.sync="pdfDataState"
      width="50%"
      height="100vh"
      :modal="false"
      top="0"
      class="pdfDialog"
      :close-on-click-modal="false"
      v-dialogDrag
    >
      <swiper :options="swiperOption" v-if="pdfData.length">
        <swiper-slide v-for="(item, index) in pdfData">
          <iframe class="iframe"  :src="`ipdoc${item}`"></iframe>
        </swiper-slide>
        <div v-show="pdfData.length>1" class="swiper-button-prev swiper-button-prev2" slot="button-prev"></div>
        <div v-show="pdfData.length>1" class="swiper-button-next swiper-button-next2" slot="button-next"></div>
      </swiper>
    </el-dialog>

<!--    案件详情-->
    <el-dialog
      title="案件信息"
      append-to-body
      :visible.sync="caseInfo"
      width="50%"
      height="100vh"
      :modal="false"
      top="0"
      class="pdfDialog"
      :close-on-click-modal="false"
      v-dialogDrag
    >
      <seeCaseDetail :style="cssVar" :isPatentFee="true" v-if="currentCaseId" :case-id="currentCaseId" :sign="1" :taskType="4" :backsign="false"></seeCaseDetail>
    </el-dialog>
  </div>

</template>

<script>
  import seeCaseDetail from '@/views/workbench/case/components/ManualIdentification/seeCaseDetail'
  import {formatAmount,fomatFloat,toFixed1,toFixed2} from '@/utils/filters'

  import RemindRecordDetail from "./RemindRecordDetail";
  import Pagination from "@/components/Pagination";
  import agSelectAgentNum from '@/components/agSelectAgentNum';
  import agSelectNameCn from '@/components/agSelectNameCn';
  import aGSelectDate from '@/components/aGSelectDate';
  import { setBusiness } from '@/api/caseList'
  import UseRemindRecordDetail
    from '@/views/workbench/customer_management/business_pportunity/components/UseRemindRecordDetail.vue'

  export default {
    props: {
      sign: '',
      type: '',
      childDataList: {},
      tableHeight: 0,
      total: 0,
      isFinance: {
        type: Boolean,
        default: false
      }
    },
    components: {
      Pagination,
      seeCaseDetail
    },
    name: "rightTable",
    created() {
      // this.getData()
      this.getColumDefs()
    },
    watch: {
      childDataList: {
        handler(n, o) {
          // if (n && n.length) {
          //   this.data = n
          // }
          this.data = n
        },
        immediate: true

      },
      type: {
        handler(n, o) {
          if (n == '可续展') {
            this.tableTitleList = [
              {'title': '商标号', 'value': 'regNumber'},
              {'title': '商标名称', 'value': 'tmName'},
              {"title": "商标图样", "value": "imgFilePath"},
              {"title": "商标类别", "value": "tmGroup"},
              {"title": "客户", "value": "custName"},
              {"title": "申请人", "value": "applicantName"},
              {"title": "有效期起始日", "value": "validStartDate"},
              {"title": "有效期截至日", "value": "validEndDate"},
              {"title": "是否处于宽展期", "value": "isGrace"},
              {"title": "处理结果", "value": "disposeResult"},
              {"title": "是否续展", "value": "extensionSwitch"},
              {"title": "发送记录", "value": "RemindRecordDetail"}
            ]
          } else if (n == '境外续展提醒') {
            this.tableTitleList = [
              {'title': '商标号', 'value': 'regNumber'},
              {'title': '商标名称', 'value': 'tmName'},
              {'title': '注册国家', 'value': 'appState'},
              {"title": "商标图样", "value": "imgFilePath"},
              {"title": "商标类别", "value": "tmGroup"},
              {"title": "客户", "value": "custName"},
              {"title": "申请人", "value": "applicantName"},
              {"title": "有效期起始日", "value": "validStartDate"},
              {"title": "有效期截至日", "value": "validEndDate"},
              {"title": "是否处于宽展期", "value": "isGrace"},
              {"title": "处理结果", "value": "disposeResult"},
              {"title": "是否续展", "value": "extensionSwitch"},
              {"title": "发送记录", "value": "RemindRecordDetail"}
            ]
          } else if (n === '境外使用证据提醒') {
            this.tableTitleList = [
              {'title':'客户名称','value':'custName'},
              {'title':'案件文号','value':'agentNum'},
              {"title":"案件名称","value":"caseName" },
              {"title":"绝限日期","value":"absLimitDate" },
              {"title":"商标注册号","value":"regNumber" },
              {"title":"注册国家","value":"appState" },
              {"title":"商标图片","value":"imageFile" },
              {"title":"商标类别","value":"goodClasses" },
              {"title":"申请日","value":"appDate" },
              {"title":"注册日","value":"regDate" },
              {"title":"提醒日","value":"remindDate" },
              {"title":"邮件主题","value":"mailSubject" },
              {"title":"申请人姓名","value":"applicantName" },
              {"title": "发送记录", "value": "UseRemindRecordDetail"}
            ]
          }
          else if (n == '近似监控1') {
            this.tableTitleList = [
              {'title': '近似商标', 'value': 'tmName'},
              {'title': '注册号', 'value': 'regNumber'},
              {"title": "类号", "value": "tmType"},
              {"title": "申请人中文名称", "value": "applicantName"},
              {"title": "图样", "value": "imageFile"},
              {"title": "近似度（数值越接近于1越近似）", "value": "jinsidu"}
            ]
          } else if (n == '近似监控2') {
            this.tableTitleList = [
              {'title': '近似商标', 'value': 'tmName'},
              {'title': '注册号', 'value': 'regNumber'},
              {"title": "类号", "value": "tmType"},
              {"title": "申请人中文名称", "value": "applicantName"},
              {"title": "图样", "value": "imageFile"},
              {"title": "近似度（数值越小越近似）", "value": "distance"}
            ]
          } else if (n == '官费') {
            this.tableTitleList = [
              {'title': '附件', 'value': 'address','width': 60},
              {'title': '案件文号', 'value': 'agentNum', 'editable': true, 'cellEditor': 'agSelectAgentNum','width': 150},
              {'title': '申请号', 'value': 'appNumber','width': 120},
              {"title": "案件名称", "value": "caseCnName",'width': 150},
              {"title": "收据抬头", "value": "gfReceiptRise",'width': 150},
              {"title": "费用名称", "value": "nameCn", 'editable': true,'width': 100,'cellEditor':'agSelectNameCn'},
              {"title": "年号", "value": "yearNo", 'editable': true,'width': 80},
              {"title": "缴费金额", "value": "payAmount", 'editable': true,'width': 100},
              {"title": "收据号", "value": "invoiceNo", 'editable': true,'width': 120},
              {"title": "缴费日期", "value": "payDate", 'editable': true, 'cellEditor':'aGSelectDate','width': 120},
              {"title": "账单号", "value": "billNo",'width': 120},
              {"title": "客户名称", "value": "custName",'width': 120},
              {"title": "申请人名称", "value": "applicantName",'width': 120},
            ]
          }
          else if (n == '草单') {
            this.tableTitleList = [
              {'title': '案件文号', 'value': 'agentNum','width': 150 },
              {'title': '申请号', 'value': 'appNumber','width': 120},
              {'title': '申请日', 'value': 'appDate','width': 100},
              {'title': '客户', 'value': 'custName','width': 150},
              {'title': '缴费期限', 'value': 'abslimitDate','width': 100},
              {'title': '发明名称', 'value': 'caseCnName','width': 150},
              {"title": "开立日期", "value": "referDate",'width': 100},
              {"title": "费用项目（中文）", "value": "descriptionCn",'width': 120},
              {"title": "费用项目（英文）", "value": "descriptionEn",'width': 120},
              {"title": "费用类型", "value": "feeKindNameString",'width': 100},
              {"title": "数量", "value": "manhourBill",'width': 80},
              {"title": "单价", "value": "priceBill",'width': 80},
              {"title": "金额", "value": "amountBill",'width': 120},
              {"title": "是否已开账单", "value": "tobillStatusStr",'width': 120},
              {"title": "年号", "value": "yearNo",'width': 80},
              {"title": "客户文号", "value": "custRefNo",'width': 100},
            ]
          }
        },
        immediate: true

      }
    },
    computed: {
      cssVar(){
        return {
          '--height': document.documentElement.clientHeight-200 + 'px'
        }
      },
      pinnedBottomRowData() {
        if(this.type == '官费' && this['gridApi']['rowModel']){
          return [
            {
              sid: "##",
              agentNum: this.getSum(this.gridApi.rowModel&&this.gridApi.rowModel.rootNode.childrenAfterFilter.map(item=>item.data), 'agentNum'),
              appNumber: '##',
              caseCnName: '##',
              nameCn: '##',
              yearNo: '##',
              // payAmount: this.getSum([], 'payAmount'),
              payAmount: this.getSum(this.gridApi.rowModel&&this.gridApi.rowModel.rootNode.childrenAfterFilter.map(item=>item.data), 'payAmount'),
              invoiceNo: '##',
              payDate: '##',
              billNo: '##',
              custName: '##',
              applicantName: '##',
            }
          ]
        }else if(this.type == '草单' && this['gridApi']['rowModel']){
          return [
            {
              sid: "##",
              agentNum: '##',
              appNumber: '##',
              appDate: '##',
              custName: '##',
              abslimitDate: '##',
              // payAmount: this.getSum([], 'payAmount'),
              caseCnName: '##',
              referDate: '##',
              descriptionCn: '##',
              descriptionEn: '##',
              feeKindNameString: '##',
              manhourBill: '##',
              priceBill: '##',
              amountBill: this.getSum(this.gridApi.rowModel&&this.gridApi.rowModel.rootNode.childrenAfterFilter.map(item=>item.data), 'amountBill'),
              tobillStatusStr: '##',
              yearNo: '##',
              custRefNo: '##',
            }
          ]
        }else{
          return false
        }
      }
    },
    data() {
      return {
        currentCaseId: '',
        caseInfo: false,
        gridApi: {},
        pdfData: [],
        pdfDataState: false,
        swiperOption:{
          centeredSlides:true,
          spaceBetween: 10,
          observer:true, //修改swiper自己或子元素时，自动初始化swiper
          observeParents:true,
          direction: 'horizontal',
          speed:600, //config参数同swiper4,与官网一致
          navigation: {
            nextEl: '.swiper-button-next2',
            prevEl: '.swiper-button-prev2'
          }
        },
        frameworkComponents: {
          aGSelectDate:aGSelectDate,
          agSelectAgentNum: agSelectAgentNum,
          agSelectNameCn
        },
        pageSizesList: [10, 50, 100, 200, 300, 400, 500],
        listQuery: {
          pageNo: 1,
          pageSize: 10
        },
        gridOptions: {
          ...this.$store.state.caseInformation.gridOptions,
          singleClickEdit: true,
          onCellEditingStarted(){
            // console.log('##############')
          },
          onCellValueChanged(event){

            event.api.refreshCells()
          },
          onCellEditingStopped: (event) => {
            event.api.refreshCells()
          },
        },
        defaultcolumnDefs: [
          {
            headerName: '序号',
            field: 'sid',
            width: 60,
            'pinned': 'left', //固定再左边
            filter: false,
            cellClass: 'vAlign',
            suppressMenu: true,
            checkboxSelection: false,
            headerCheckboxSelection: false,
            headerCheckboxSelectionFilteredOnly: true,
            cellRenderer: this.cellRenderer,

          },
        ],
        columnDefs: [],
        tableTitleList: [],
        brushRightHasFilter: false,
        data: []
      }
    },
    methods: {
      scrollToBottom(){
        this.$nextTick(()=>{
          let sObj = document.getElementById('right-grid').getElementsByClassName('ag-body-viewport')[0]
          sObj.scrollTop = sObj.scrollHeight
        })
      },
      formatAmount(num){
        return formatAmount(num)
      },
      getSum(list,type){
        if(type == 'payAmount' || type == 'amountBill'){
          return `合计: ${this.formatAmount(list.map(item=>item[type]).filter(item=>!!item).reduce((x,y)=>Number(x)+Number(y),0))}`
        }else{
          return `合计: ${this.$commonUtils.unique(list, 'agentNum').length}`
        }
      },
      pdfPre(node) {
        this.pdfDataState = true;
        this.pdfData=[node.data.address]

        // this.$nextTick(()=>{
        //   if(node.data.addressList){
        //     this.pdfData =node.data.addressList.filter(itm=>['pdf','jpg','png'].some(item=>itm.replace(/.+\./,"").toLocaleLowerCase()==item))
        //     if(this.pdfData.length==0){
        //       this.pdfDataState=false
        //     }
        //   }
        // })

      },
      refreshCells(){
        this.gridApi.stopEditing(false)
        this.gridApi.refreshCells()
      },
      getData() {
        // this.data = this.childDataList
        // queryTmFirstCheckByDsId({qihao:this.qihao,dsId:this.id}).then(res=>{
        //     this.data=res.data
        // })
      },
      cellRenderer(params) {
        if(params.colDef.field == 'payAmount'){
          return this.formatAmount(params.value)
        }
        if(params.colDef.field == 'address' && params.value){
          var fDiv = document.createElement('div');
          fDiv.innerHTML = `<i style="color: #409EFF;font-size: 16px!important;cursor: pointer" class="el-icon-paperclip" alt="">`
          var fButton = fDiv.querySelectorAll('.el-icon-paperclip')[0];

          fButton.addEventListener('click', ()=> {
            this.pdfPre(params.node)
          });
          return fDiv;
        }
        if (params.colDef.field == 'sid' && params.value !== '') {
          return params.rowIndex + 1
        }
        if (this.type == '可续展' || this.type == '境外续展提醒' || this.type === '境外使用证据提醒') {
          // if (params.colDef.field == 'extensionSwitch') {
          //   return `<span title="${params.value ? '是' : '否'}">${params.value ? '是' : '否'}</span>`
          // }
          if (params.colDef.field == 'imgFilePath' || params.colDef.field == 'imageFile') {
            return `<img style="width: 67px;height: 30px" src="ipdoc/downloadimage${params.value}" alt="">`
          }

          if (params.colDef.field == 'RemindRecordDetail') {
            const h = this.$createElement;
            let vnode = h(RemindRecordDetail, {
              props: {
                regNumber: params.data.regNumber,
              },
            })
            const div = document.createElement('div');
            this.__patch__(div, vnode, true, false)
            return div
            // return  `<div  style="display: flex;align-items: center;flex-wrap:wrap">
            //     <p style="color: green;font-size: 12px;display:${params.node.data.sendSucceedNum!=0?'block':'none'}">已发送 (${params.value})</p>
            //     <p style="color: red;font-size: 12px;display:${params.node.data.sendDefeatedNum!=0?'block':'none'}">发送失败 (${params.value})</p>
            //     <p style="color: rgb(106, 167, 255);font-size: 12px;display:${params.node.data.sendDefeatedNum==0&&params.node.data.sendSucceedNum==0?'block':'none'}" >未发送</p>
            //   </div>`
          }
          if (params.colDef.field == 'UseRemindRecordDetail') {
            const h = this.$createElement;
            let vnode = h(UseRemindRecordDetail, {
              props: {
                agentNum: params.data.agentNum,
                remindDate: params.data.remindDate,
              },
            })
            const div = document.createElement('div');
            this.__patch__(div, vnode, true, false)
            return div
            // return  `<div  style="display: flex;align-items: center;flex-wrap:wrap">
            //     <p style="color: green;font-size: 12px;display:${params.node.data.sendSucceedNum!=0?'block':'none'}">已发送 (${params.value})</p>
            //     <p style="color: red;font-size: 12px;display:${params.node.data.sendDefeatedNum!=0?'block':'none'}">发送失败 (${params.value})</p>
            //     <p style="color: rgb(106, 167, 255);font-size: 12px;display:${params.node.data.sendDefeatedNum==0&&params.node.data.sendSucceedNum==0?'block':'none'}" >未发送</p>
            //   </div>`
          }
        } else if (this.type == '近似监控1' || this.type == '近似监控2') {
          if (params.colDef.field == 'imageFile') {
            return `<img style="width: 67px;height: 30px" src="${params.value}" alt="">`
          }
        }
        if (params.colDef.field == 'extensionSwitch') {
          const h = this.$createElement
          const that = this
          let vnode = h({
            template: `
              <div>
                <el-checkbox :true-label="1" v-model="value" @change="changeValue"></el-checkbox>
              </div>`,
            props: {
              params: {}
            },
            data(){
              return {
                value: ''
              }
            },
            watch: {
              value(n){
                this.params.data.extensionSwitch = n || 0
                // n && this.params.node && this.params.node.setDataValue('gainsLosses', '0')
              }
            },
            created() {
              console.log(this.params.value,'value!!');

              this.value = this.params.value || 0
            },
            methods: {
              async changeValue(n){
                console.log(n)
                console.log(this.params.data)
                setBusiness({
                  del: n ? 1 : 0,
                  regNumber: this.params.data.regNumber
                }).then(res => {
                  this.$message.success('操作成功！')
                })
                await new Promise(res => {
                  that.gridApi.stopEditing()
                  setTimeout(() => res(), 10)
                })
              }
            },
          }, {
            props: {
              params
            }

          })
          const div = document.createElement('div')
          this.__patch__(div, vnode, true, false)

          return div
        }
        return `<span title="${params.value}">${(params.value || params.value === 0) ? params.value : ''}</span>`
      },
      onGridReady(params) {
        this.gridparams = params
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        // params.api.sizeColumnsToFit();
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
          sortable: true,
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
      onGridReady(params) {
        this.gridApi = params.api
      },
      refreshEvenRowsCurrencyData(params) {
        this.currentPageSize = params.api.rowModel.rootNode.allChildrenCount
        if (!params.columnApi.columnController.groupAutoColumns) {
          this.gridApi.forEachNode(rowNode => {
            rowNode.setDataValue(
              'sid',
              rowNode.rowIndex + 1)
          });
        }
        if (params.type == "filterChanged") {
          // this.$commonUtils.saveFilterModel(this.$options.name+this.$route.name,'FilterModel',this.gridApi.getFilterModel())
          // var data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel');
          var arr = Object.keys(this.gridApi.getFilterModel());
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
            this[item.action](params.node.data, params.value, params.node)
          }
        }))
      },
      getRowContextmenuList(row) {
        return [
          {name: '复制', action: 'copy'},
          this.type == '官费' ? {name: '查看案件信息', action: 'seeCaseInfo'} : ''
          // { name: '商标导入', action: 'installtmmessage', permissions: 185 },
          // {name: '修改', action: 'editFun', permissions: 73},
          // {name: '删除', action: 'handledeleElement', permissions: 74}
        ].filter(i => !!i)
      },
      rowClick(params){
        if(this.caseInfo && this.currentCaseId === params.data.caseId)return;
        if(this.caseInfo){
          this.currentCaseId = '';
          this.$nextTick(()=>{
            this.currentCaseId = params.data.caseId
          })
        }
      },
      seeCaseInfo(row){
        if(this.caseInfo && this.currentCaseId === row.caseId)return;
        this.caseInfo = true;
        this.currentCaseId = '';
        this.$nextTick(()=>{
          this.currentCaseId = row.caseId
        })

      },
      copy(row, value) {
        this.$copyText(value).then(
          res => {
          })
      },
      getSelectedRows() {
        if (this.gridApi) {
          const selectedNodes = this.gridApi.getSelectedNodes();
          const selectedData = selectedNodes.map(node => node.data);
          return selectedData
        } else {
          return false
        }

      },
    }
  }
</script>

<style lang="scss" scoped>
  .el-form {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    .el-row {
      // min-height: 20px;
      width: 100%;
      display: flex;
      line-height: 30px;

      .el-form-item {
        width: 100%;
        display: flex;
        border: 1px solid #ebeef5;
        border-bottom: 0;
        margin-bottom: 0;

        /deep/ .el-form-item__label {
          background: #f5f7fa;
          line-height: 30px;
        }

        /deep/ .el-form-item__content {
          line-height: 30px;
          margin-left: 0 !important;
          padding-left: 10px;
          background: #fff;
          flex: 1;
        }
      }

      .small-el-form-item-prev:before {
        content: "";
        width: 50%;
        height: 1px;
        background: #ebeef5;
        position: absolute;
        bottom: -1px;
        right: 0;
        z-index: 1;
      }

      .small-el-form-item {
        position: relative;
        width: 50%;

        /deep/ .el-form-item__content {
          flex: 1;

          .pad20 {
            padding-left: 20px;
          }
        }
      }
    }

    .el-row:nth-last-child(1) {
      .el-form-item {
        border: 1px solid #ebeef5;
      }
    }
  }

  .bg-purple {
    box-sizing: border-box;
    padding: 0 0 0 20px;
    background: #d3dce6;
  }

  .bg-purple-light {
    background: #e5e9f2;
  }

  .grid-content {
    min-height: 30px;
    color: #409EFF;
    line-height: 2;
  }

  .postInfo-container-item {
    height: 100%;
  }

  .brush_right {
    position: absolute;
    right: 6px;
    top: 28px;
    z-index: 4;
  }

  > > > .ag-input-field-input {
    color: #000 !important;
  }
  .pdfDialog  /deep/{
    z-index: 3000;
    .el-dialog{
      z-index: 3000;
      height: 100vh;
      display: flex;
      flex-direction: column;
      .el-dialog__body{
        flex: 1;
        .swiper-container{
          height: 100%;
          .swiper-button-prev-son{
            cursor: pointer;
            position: absolute;
            top: 10px;
            left: 50%;
            z-index: 10000;
            transform: translateX(-50%);
            text-align: center;
            font-size: 50px;
          }
          .swiper-button-next-son{
            cursor: pointer;
            position: absolute;
            bottom:  10px;
            left: 50%;
            z-index: 10000;
            transform: translateX(-50%);
            text-align: center;
            font-size: 50px;
          }
        }
      }
    }
    .iframe{
      width: 100%;
      height: 100%;
    }
  }
  >>>.el-tabs__content{
    height: var(--height)!important;
    overflow: auto!important;
  }
  >>>.el-dialog{
    overflow: hidden!important;
  }
</style>
