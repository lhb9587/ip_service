<template>
    <div>
      <AgGridVue :style="{width:'100%',height: 800+'px'}"
                 class="ag-theme-balham"
                 :columnDefs="columnDefs"
                 :rowData="list"
                 rowSelection="multiple"
                 @gridReady="onGridReady"
      >
      </AgGridVue>
    </div>
</template>

<script>
  import {queryLogList} from '@/api/caseList'
  import axios from 'axios'
  export default {
    name: "index",
    data(){
      return {
        data:'',
        list:[],
        columnDefs:[{

        }],
        preferenceList:[{title:'time',value:'time'},{title:'columnNo',value:'columnNo'},{title:'error',value:'error'},{title:'fileUrl',value:'fileUrl'},{title:'lineNo',value:'lineNo'},{title:'msg',value:'msg'},{title:'userAgent',value:'userAgent'},{title:'userId',value:'userId'},]
      }
    },
    created() {
      this.init()
      this.queryLogList()
    },
    methods:{
      init(){
        this.columnDefs = this.preferenceList.map(item=>({
          headerName: item.title,
          field: item.value,
          resizable: true,
          sortable: true,
          filter: 'agSetColumnFilter',
          cellRenderer:this.cellRenderer,
          menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],
          enableRowGroup: true,
          editable: true,
          cellEditor: 'agLargeTextCellEditor',
          filterParams: {
            newRowsAction: 'keep',
            comparator: (a, b)=>{
              return this.$commonUtils.sort(a,b,item.value)
            }
          }
        }))
      },
      onGridReady(params) {
        this.gridparams=params
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
      },
      queryLogList(){


        // [2020-05-29 11:30:18]
        // {"msg":"Uncaught TypeError: Cannot read property 'toLowerCase' of null",
        //   "fileUrl":"http://192.168.100.70:8000/static/js/chunk-0f171cfc.0736e81e.js",
        //   "lineNo":1,"columnNo":58252,"error":"TypeError: Cannot read property 'toLowerCase' of null\n   " +
        // " at http://192.168.100.70:8000/static/js/chunk-0f171cfc.0736e81e.js:1:58252\n    at Array.filter (<anonymous>)\n   " +
        // " at s.querySearch (http://192.168.100.70:8000/static/js/chunk-0f171cfc.0736e81e.js:1:58152)\n    at s.fetch-suggestions " +
        // "(http://192.168.100.70:8000/static/js/chunk-0f171cfc.0736e81e.js:1:9850)\n    at s.getData (http://192.168.100.70:8000/static/j" +
        // "s/chunk-elementUI.e1a98d28.js:1:85566)\n    at p (http://192.168.100.70:8000/static/js/chunk-libs.2994f73c.js:36:19700)","userAg" +
        // "ent":"Mozilla%2F5.0%20(Windows%20NT%206.1%3B%20)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F83.0.4103.61%20Safari%2F537.36"}
// this.$commonUtils.downLoadAll({url:'124/ipdoc/logs/front.log'})
        axios.get('124/ip_service/interface/log/queryLogList?tokenID=1609841823184371').then(res=>{

        })
        axios.get('124/ipdoc/logs/front.log').then(res=>{

        //             // this.data[2020-05-29 11:33:07]
            console.log(res.data.match(/\[.*?\][{]"billId":.*?[}]/g));
          console.log(res.data.match(/\[.*?\][{]"feeId":.*?[}]/g));
        //   // console.log(res.data.match(/\[.*?\][{].*?430999.*?[}]/g));
        //   // let arr=res.data.match(/\[.*?\][{].*?"userId":.*?Mozilla%2F5[.]0%20[(]Windows%20NT%2010[.]0%3B%20WOW64[)]%20AppleWebKit%2F537[.]36%20[(]KHTML%2C%20like%20Gecko[)]%20Chrome%2F78[.]0[.]3904[.]108%20Safari%2F537[.]36.*?[}]/g).map(item=>{
        //   //   return item.match(/[{].*?[}]/g).map(itm=>JSON.parse(itm))
        //   // })
        //   // console.log(...new Set(this.$commonUtils.getLanglist(arr).map(item=>item.userId)));
        //   // console.log(res.data.match(/[{].*?[}]/g))
        //   console.log(res.data);
          this.list = res.data.replace(/\\n|\s/g,'').match(/[{].*?[}]/g).map(item=>JSON.parse(item))
        //   // setTimeout(()=>{
        //   //   this.columnDefs.forEach(item=>{
        //   //     this.columnApi.getColumn(item.field).addEventListener('menuVisibleChanged', ()=>{
        //   //       if(document.querySelector(".ag-tabs")){
        //   //         new this.$DraginResize(document.querySelector(".ag-set-filter-list"), {
        //   //           clone: true,
        //   //           end(info) {
        //   //             if (info.dir == 'ver') {
        //   //               this.elem.style.height = info.height + 'px';
        //   //             }
        //   //             else if (info.dir == 'hor') {
        //   //               this.elem.style.width = info.width + 'px';
        //   //             }
        //   //           }
        //   //         })
        //   //       }
        //   //
        //   //     });
        //   //   })
        //   //
        //   // })
        //   // console.log(this.list);
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
