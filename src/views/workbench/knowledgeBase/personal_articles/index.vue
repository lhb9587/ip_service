<template>
    <div>
        <div style="display: flex;justify-content: flex-end;margin-bottom: 10px">
          <el-button @click="writeAnArticle" size="mini">写文章</el-button>
        </div>
      <div>
        <AgGridVue :style="{width:'100%',height: clientHeight+'px'}"
                   class="ag-theme-balham"
                   :columnDefs="columnDefs"
                   :rowData="articleList"
                   rowSelection="multiple"
                   @grid-ready="onGridReady"
                   :gridOptions="gridOptions"
                   :getContextMenuItems="getContextMenuItems"
                   suppressAutoSize
                   animateRows
                   @rowDoubleClicked="rowDoubleClicked"
                   :localeText="$store.state.caseInformation.localeText"
                   :suppressDragLeaveHidesColumns="true"
                   :suppressMakeColumnVisibleAfterUnGroup="true"
        >
        </AgGridVue>
      </div>
    </div>
</template>

<script>
import { queryRuleByindex ,deleteRule} from '@/api/knowledgeBase'
export default {
  name: "index",
  data() {
    return {
      articleList:[],
      columnDefs:[],
      gridOptions:{}
    }
  },
  created() {
    this.getColumnDefs()
    this.queryRuleByindex()
  },
  methods:{
    onGridReady(params){
      params.api.sizeColumnsToFit()
    },
    rowDoubleClicked(){

    },
    queryRuleByindex(){
      let data={
        indexName:'essay',
        knowledgeNavigationId: 3,
        pageSize: 10000,
        pageNo: 1,
        authorArray:this.$store.getters.name
      }
      queryRuleByindex(data).then(res=>{
        this.articleList=res.data
      })
    },
    writeAnArticle(){
      this.$router.push('./articleDetail/1')
    },
    getContextMenuItems(params){
      if(!params.node.data){
        return []
      }
      return this.getRowContextmenuList(params.node.data).map(item=>({
        name: item.name,
        action: () =>{
          this[item.action](params.node.data,params.value)
        }
      }))
    },
    getRowContextmenuList(row){
      return [
        { name:'复制',action: 'copy' },
        { name: '修改', action: 'edit'},
        { name: '删除', action: 'delArticles'}]
    },
    copy(row, value,event) {
      if(value){
        this.$copyText(value).then(
          res => {
          })
      }else {
        this.$copyText(event.target.innerText).then(
          res => {
          })
      }
    },
    edit(row){
       this.$router.push(`./articleDetail/1/${row.id}`)
    },
    delArticles(row){
      deleteRule(row).then(res=>{
        this.queryRuleByindex()
      })
    },
    getColumnDefs(){
      let list=[{title:'标题',prop:'title',width:'800'},{title:'发布状态',prop:'xxx'},{title:'评论数',prop:'xxx'},{title:'阅读数',prop:'xxx'}]
      this.columnDefs=list.map(item=>({
        headerName: item.title,
        field: item.prop,
        width:item.width,
        resizable: true,
        sortable: true,
        filter: 'agSetColumnFilter',
        menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],
        cellRenderer: this.cellRenderer,
        enableRowGroup: true,
        filterParams: {
          comparator: (a, b)=>{
            return this.$commonUtils.sort(a,b,item.value)
          }
        }
      }))
    }
  },
  computed:{
    clientHeight(){
      return document.documentElement.clientHeight-250
    },
  }
}
</script>

<style lang="scss" scoped>

</style>
