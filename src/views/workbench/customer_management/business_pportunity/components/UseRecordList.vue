<template>
  <AgGridVue :style="{width:'100%',height:'300px'}"
             class="ag-theme-balham"
             :columnDefs="columnDefs"
             :rowData="list"
             rowSelection="multiple"
             @grid-ready="onGridReady"
             :gridOptions="gridOptions"
             :getContextMenuItems="getContextMenuItemsFather"
             @sortChanged="refreshEvenRowsCurrencyData"
             @filterChanged="refreshEvenRowsCurrencyData"
             suppressAutoSize
             animateRows
             :localeText="vm.$store.state.caseInformation.localeText"
  >
  </AgGridVue>
</template>

<script>
import { downLoadAll } from '@/utils'
import vm from '@/main'
export default {
  props:{
    list:{}
  },
  name: "UseRecordList",
  data(){
    return{
      vm,
      gridOptions:{...vm.$store.state.caseInformation.gridOptions,...{}},
      columnDefs:[],
      defaultcolumnDefs:[
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
          cellRenderer:this.cellRenderer,

        },
      ],
      tableTitleList: [
        {"title":"接收人","value":"recevicer" ,width:'90'},
        { 'title': '接收人的邮箱', 'value': 'recevicerMail',width:'200' },
        {"title":"发送时间","value":"sendDate" ,width:'150'},
        {"title":"发送状态","value":"sendStatus",width:'110' }
      ],
    }
  },
  created(){
    this.init()
  },
  methods:{
    init(){
      if(this.list&&this.list.length&&this.list[0].mailPath){
        this.tableTitleList.push({"title":"邮件","value":"mailPath",width:'110' })
      }
      this.columnDefs = [...this.defaultcolumnDefs, ...this.tableTitleList.map(item=>({
        headerName: item.title,
        field: item.value,
        width:item.width,
        resizable: true,
        sortable: true,
        filter: 'agSetColumnFilter',
        cellRenderer:this.cellRenderer,
        cellClass: function(params) {
          if(params.data.sendStart !== '失败') {
            return 'lightGreen'
          }
        },
        cellStyle: function(params) {
          if(!params.data){
            return
          }
          if(params.data.sendStart === '失败') {
            return {color:'red'}
          }else{
            return {color:'green'}
          }
        },
        menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],
        enableRowGroup: true,
        filterParams: {
          newRowsAction: 'keep',
          comparator: (a, b)=>{
            return this.$commonUtils.sort(a,b,item.value)
          }
        }
      }))]
    },
    refreshEvenRowsCurrencyData(params) {
      if(!params.columnApi.columnController.groupAutoColumns) {
        this.gridApi.forEachNode(rowNode => {
          rowNode.setDataValue(
            'sid',
            rowNode.rowIndex + 1)
        });
      }
    },
    cellRenderer(params){
      let that=this

      if(params.colDef.field == 'sid'){
        return params.rowIndex+1
      }
      if(params.colDef.field == 'mailPath'){
        var eDiv = document.createElement('div');
        eDiv.innerHTML = `<button  type="button" style="padding: 0"  class="el-button el-button--text el-button--small"><span>查看邮件</span></button>`
        eDiv.addEventListener('click', ()=> {
          that.downLoadAll(params.data)
        });
        return eDiv;
      }

      return `<span title="${params.value}">${params.value?params.value:''}</span>`
    },
    downLoadAll(row){
      if(['html','pdf','jpg','png'].some(item=>row.mailPath.replace(/.+\./,"").toLocaleLowerCase()==item)){
        window.open(`/ipdoc${row.mailPath}`.replace(/[+]/g,'%2B'))
        // window.open(`#/preView?address=ipdoc${url}`.replace(/[+]/g,'%2B'))
      }else{
        downLoadAll({target: '_blank', url: 'ipdoc' + row.mailPath})
      }
    },
    onGridReady(params) {
      this.gridparams=params
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
      params.api.sizeColumnsToFit();
    },
    getContextMenuItemsFather(){
      return []
    },
  },

}
</script>

<style lang="scss" scoped>
/deep/ .ag-row-selected  .lightGreen{
  span{
    color: #40FF43!important;
  }
}
</style>
