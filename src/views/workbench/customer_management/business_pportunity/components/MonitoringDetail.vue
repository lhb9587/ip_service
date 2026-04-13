<template>
  <div style="position:relative;height: 100%">

    <el-button class="brush_right" :class="brushRightHasFilter?'red':''" @click="brushRight" type="text" icon="el-icon-brush" ></el-button>
  <AgGridVue :style="{width:'100%',height:'100%'}"
             class="ag-theme-balham"
             :columnDefs="columnDefs"
             :rowData="data"
             @grid-ready="onGridReady"
             rowSelection="multiple"
             :gridOptions="gridOptions"
             suppressAutoSize
             animateRows
             @sortChanged="refreshEvenRowsCurrencyData"
             @filterChanged="refreshEvenRowsCurrencyData"
             :localeText="$store.state.caseInformation.localeText"
             :groupSelectsChildren="true"
             :suppressAggFuncInHeader="true"
  >
  </AgGridVue>
  </div>

</template>

<script>
  import { queryTmFirstCheckByDsId } from '@/api/caseList'
  export default {
    props:{
      id:{

      },
      qihao:{

      }
    },
    name: "MonitoringDetail",
    created() {
      this.getData()
      this.getColumDefs()
    },
    data(){
      return{
        gridOptions:{...this.$store.state.caseInformation.gridOptions,...{}},
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
        columnDefs: [

        ],
        tableTitleList: [
          {"title":"公告类型","value":"announcementType" }, { 'title': '注册号', 'value': 'regnumber' },{"title":"类别","value":"goodClass" },
          {"title":"商标名称","value":"tmName" },{"title":"申请日期","value":"appDate" },{title:'期号',value: 'announcementQH'},{title:'申请人中文名称',value: 'appCnName'},{title:'申请人英文名称',value: 'appEnName'},
          {title:'申请人中文地址',value: 'appCnAddress'},{title:'申请人英文地址',value: 'appEnAddress'},{title:'代理事务所',value: 'agencyName'},{title:'商品/服务项目',value: 'groupName'},{title:'工作组',value: 'groupName'}],
        brushRightHasFilter:false,
        data:[]
      }
    },
    methods:{

      getData(){
        queryTmFirstCheckByDsId({qihao:this.qihao,dsId:this.id}).then(res=>{
            this.data=res.data
        })
      },
      cellRenderer(params){
        if(params.colDef.field == 'sid'){
          return params.rowIndex+1
        }
        return `<span title="${params.value}">${params.value?params.value:''}</span>`
      },
      onGridReady(params) {
        this.gridparams=params
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        // params.api.sizeColumnsToFit();
      },
      brushRight(){
        // let data =   this.$commonUtils.getFilterModel(this.$options.name+this.$route.name,'FilterModel')
        let arr = this.columnDefs.map(item=>item.field)// Object.keys(data)
        arr.forEach(item=>{
          this.gridApi.destroyFilter(item)
        })
      },
      getColumDefs(){
        this.columnDefs = [...this.defaultcolumnDefs, ...this.tableTitleList.map(item=>({
          headerName: item.title,
          field: item.value,
          width:item.width,
          resizable: true,
          sortable: true,
          filter: 'agSetColumnFilter',
          cellRenderer:this.cellRenderer,
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
        this.currentPageSize = params.api.rowModel.rootNode.allChildrenCount
        if(!params.columnApi.columnController.groupAutoColumns) {
          this.gridApi.forEachNode(rowNode => {
            rowNode.setDataValue(
              'sid',
              rowNode.rowIndex + 1)
          });
        }
        if(params.type=="filterChanged"){
          // this.$commonUtils.saveFilterModel(this.$options.name+this.$route.name,'FilterModel',this.gridApi.getFilterModel())
          // var data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel');
          var arr = Object.keys(this.gridApi.getFilterModel());
          if(arr.length){
            this.brushRightHasFilter=true
          }else {
            this.brushRightHasFilter=false
          }
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
  .brush_right{
    position: absolute;
    right: 6px;
    top: -4px;
    z-index: 4;
  }
</style>
