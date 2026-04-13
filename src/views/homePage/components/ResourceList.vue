<template>
  <div style="position: relative">
    <el-button class="brush_right" :class="brushRightHasFilter?'red':''" @click="brushRight" type="text" icon="el-icon-brush" ></el-button>
    <AgGridVue :style="{width:'100%',height: 600+'px'}"
               class="ag-theme-balham"
               :columnDefs="columnDefs"
               :rowData="dataList"
               rowSelection="multiple"
               @grid-ready="onGridReady"
               :gridOptions="gridOptions"
               :getContextMenuItems="getContextMenuItems"
               suppressAutoSize
               animateRows
               @rowDoubleClicked="rowDoubleClicked"
               @rowClicked="rowClicked"
               @sortChanged="refreshEvenRowsCurrencyData"
               @filterChanged="refreshEvenRowsCurrencyData"
               :localeText="$store.state.caseInformation.localeText"
               :suppressDragLeaveHidesColumns="true"
               :suppressMakeColumnVisibleAfterUnGroup="true"
               rowGroupPanelShow="always"
               :groupSelectsChildren="true"
               :suppressAggFuncInHeader="true"
               :frameworkComponents="frameworkComponents"
    >
    </AgGridVue>
  </div>

</template>

<script>
  import {queryUsersTaskList} from '@/api/caseList'
  import taskHandle from './taskHandle.vue'
  import vm from "../../../main";
  export default {
    name: "ResourceList",
    data(){
      return {
        gridOptions:{...this.$store.state.caseInformation.gridOptions,...{

            getRowStyle:(params)=>{
              if(params.node.data){

                if(params.node.data.auditStatus==1||params.node.data.isCheck==0){
                  return { background:'#DCDFE6' }
                }
              }
            },
            statusBar: {
              statusPanels: [
                { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
                { statusPanel: 'agSelectedRowCountComponent', align: 'left' },
              ]
            },
          }},
        brushRightHasFilter:false,
        dataList:[],
        frameworkComponents:{
          // taskHandle: taskHandle
        },
        defaultcolumnDefs:[
          {
            headerName: '序号',
            field: 'sid',
            width: 60,
            'pinned': 'left', //固定再左边
            enableRowGroup: true,
            // enablePivot: true,
            floatingFilter:true,
            filter: false,
            cellClass: 'vAlign',
            suppressMenu: true,
            checkboxSelection: false,
            headerCheckboxSelection: false,
            headerCheckboxSelectionFilteredOnly: true,
            cellRenderer:this.cellRenderer,
            // checkboxSelection:function(params) {
            //   // we put checkbox on the name if we are not doing grouping
            //   return params.columnApi.getRowGroupColumns().length === 0;
            // },
            // headerCheckboxSelection:(params)=>{
            //   // we put checkbox on the name if we are not doing grouping
            //   if(this.selectionState){
            //     return false
            //   }
            //   console.log(params.columnApi.getRowGroupColumns().length === 0);
            //   return params.columnApi.getRowGroupColumns().length === 0;
            // }
          },
          {
            headerName: '操作',
            field: 'handle',
            width: 60,
            'pinned': 'right', //固定再左边
            enableRowGroup: true,
            // enablePivot: true,
            floatingFilter:true,
            filter: false,
            cellClass: 'vAlign',
            suppressMenu: true,
            checkboxSelection: false,
            headerCheckboxSelection: false,
            headerCheckboxSelectionFilteredOnly: true,
            cellRenderer:this.cellRenderer,
            // editable: true,
            // cellEditor: 'taskHandle',
            // checkboxSelection:function(params) {
            //   // we put checkbox on the name if we are not doing grouping
            //   return params.columnApi.getRowGroupColumns().length === 0;
            // },
            // headerCheckboxSelection:(params)=>{
            //   // we put checkbox on the name if we are not doing grouping
            //   if(this.selectionState){
            //     return false
            //   }
            //   console.log(params.columnApi.getRowGroupColumns().length === 0);
            //   return params.columnApi.getRowGroupColumns().length === 0;
            // }
          },
        ],
        columnDefs: [

        ],
      }
    },
    created() {
      var columnDefs=[
        {headerName: '案件文号', field: 'agentNum',width:200},
        {headerName: '案件名称', field: 'caseName',width:400},
        {headerName: '客户', field: 'custName'},
        {headerName: '案件类型', field: 'caseType'},
        {headerName: '任务名称', field: 'taskName',width:400},
        {headerName: '任务状态', field: 'taskStatus'},
        {headerName: '分配人', field: 'assigneeName'},
        {headerName: '执行人', field: 'executorName'},
        {headerName: '开始时间', field: 'startDate'},
        {headerName: '截止日期', field: 'endDate'},
      ]
      this.columnDefs=[...this.defaultcolumnDefs,...columnDefs.map(item=>
      {
        if(!item.field.includes('Date')){
          return {
            headerName: item.headerName,
            field: item.field,
            width:item.width?item.width:100,
            resizable: true,
            sortable: true,
            filter: 'agSetColumnFilter',
            cellRenderer:this.cellRenderer,
            menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],
            enableRowGroup: true,
            filterParams: {
              newRowsAction: 'keep',
              comparator: (a, b)=>{
                return this.$commonUtils.sort(a,b,item.field)
              },
            }
          }
        }else {
          return {
            headerName: item.headerName,
            field: item.field,
            width:item.width?item.width:100,
            resizable: true,
            sortable: true,
            filter: 'agDateColumnFilter',
            cellRenderer:this.cellRenderer,
            menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],
            enableRowGroup: true,
            filterParams: {
              buttons: ['apply', 'reset'],
             // newRowsAction: 'keep',
              comparator: function (filterLocalDateAtMidnight, cellValue) {
                var dateAsString = cellValue;
                if (dateAsString == null) return -1;
                // var dateParts = dateAsString.split('/');
                // var cellDate = new Date(
                //   Number(dateParts[2]),
                //   Number(dateParts[1]) - 1,
                //   Number(dateParts[0])
                // );
               var cellDate = new Date(cellValue.replace(/-/g,'/'))
                if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
                  return 0;
                }
                if (cellDate < filterLocalDateAtMidnight) {
                  return -1;
                }
                if (cellDate > filterLocalDateAtMidnight) {
                  return 1;
                }
              },
              browserDatePicker: true,
              minValidYear: 2000,
            }
          }
        }

      })]
      // this.queryUsersTaskList()
    },
    mounted() {

    },
    methods:{

      rowClicked(params){
        // if(!(params.event.target.getAttribute("class")&&params.event.target.getAttribute("class").includes('dot-btn') || params.event.target.getAttribute("class")&&params.event.target.getAttribute("class").includes('el-icon-more'))){
        //   this.$store.commit('caseInformation/SET_BTN_INDEX', 0)
        //   return
        // };
        // this.$store.commit('caseInformation/SET_BTN_INDEX', params.data.prjTaskId)
      },
      rowDoubleClicked(params){
        if(params.event.target.getAttribute("class")&&params.event.target.getAttribute("class").includes('dot-btn') || params.event.target.getAttribute("class")&&params.event.target.getAttribute("class").includes('el-icon-more'))return;
        this.$emit('taskData',params.data)
      },
      brushRight(){

        let data = this.gridApi.getFilterModel()
        let arr =  Object.keys(data)
        arr.forEach(item=>{
          this.gridApi.destroyFilter(item)
        })
        // this.columnDefs.map(item=>item.field).forEach(item=>{
        //   this.gridApi.getFilterInstance(item).selectNothing()
        //   // this.gridApi.getFilterInstance(item).setModel(data[arr[index]])
        // })
      },
      getContextMenuItems(){
        return []
      },
      refreshEvenRowsCurrencyData(params) {
        if(!params.columnApi.columnController.groupAutoColumns){
          this.gridApi.forEachNode(rowNode=> {
            rowNode.setDataValue(
              'sid',
              rowNode.rowIndex + 1)
          });
        }
        // if(this.timeLimitList.length){
        //   // &&!params.afterDataChange
          if(params.type=="filterChanged"){
            // this.$commonUtils.saveFilterModel(this.$options.name+this.$route.name,'FilterModel',this.gridApi.getFilterModel())
             var data = this.gridApi.getFilterModel()
            var arr = Object.keys(data);
            if(arr.length){
              this.brushRightHasFilter=true
            }else {
              this.brushRightHasFilter=false
            }
          }
        //   if(params.type=="sortChanged"){
        //     this.$commonUtils.saveFilterModel(this.$options.name+this.$route.name,'SortModel',this.gridApi.getSortModel())
        //   }
        // }
      },
      selectJohnAndKenny(people) {
        if(people==this.people){
          var instance = this.gridApi.getFilterInstance('executorName');
          instance.setModel({
            values: null,
          });
          this.gridApi.onFilterChanged();
          this.people=null
        }else {
          this.people=people
          var instance = this.gridApi.getFilterInstance('executorName');
          instance.setModel({
            values: [people],
          });
          this.gridApi.onFilterChanged();
        }



      },
      cellRenderer(params){
        if(params.colDef.field=='sid'){
          return params.rowIndex+1
        }
        if(params.colDef.field=='handle'){
          const h = vm.$createElement;
          let vnode=h(taskHandle,{
            props: {
              items:params.data,
              userId:this.$store.getters.userId,
              page:'resource'
            },

          })
          const div = document.createElement('div');
          vm.__patch__(div,vnode,true,false)
          return div
        }
        return  `<span title="${params.value}">${params.value?params.value:''}</span>`
      },
      onGridReady(params){
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
      },
      queryUsersTaskList(data){
        queryUsersTaskList(data).then(res=>{
          this.dataList=res.data
          this.$emit('getData',this.dataList)
          this.$emit('update:total',res.total)
          // this.dataList=res.data.reduce((pre,next)=>{
          //   next.taskList.forEach(item=>item.executorName=next.executorName)
          //   return pre.concat( next.taskList)
          // },[])

        })

      },
    }
  }
</script>

<style lang="scss" scoped>
  .brush_right{
    position: absolute;
    right: 6px;
    z-index: 1;
    top: -4px;
  }
</style>
