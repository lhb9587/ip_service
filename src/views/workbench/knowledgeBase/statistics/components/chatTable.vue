<template>
  <div >
    <el-button type="primary" style="margin-left:10px "  size="mini"  @click="ExportExcel" v-show="$store.getters.permissions.includes(286)">导出</el-button>
    <div style="width: 95%">
    <el-table :data="data" height="350" style="width: 100%">
      <el-table-column width="auto"  :label="item.label" v-for="item in columns">
      <template slot-scope="scope">
        {{scope.row[item.prop]?scope.row[item.prop]:scope.row.list.find(itm=>itm.name==item.label)?scope.row.list.find(itm=>itm.name==item.label).value:''}}
      </template>
      </el-table-column>
    </el-table>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    tableData:[]
  },
  name: "chatTable",
  created() {

    this.data=this.tableData//JSON.parse(JSON.stringify(this.tableData))
     // this.totalData=this.data.pop()
    this.formatColumns(this.data)
  },
  data() {
    return {
      data:[],
      columns:[],
      totalData:{}
    }
  },
  watch:{
    tableData:{
      handler(n,o){

        this.data=this.tableData//JSON.parse(JSON.stringify())
         // this.totalData=this.data.pop()
        this.formatColumns(this.data)
      },
      deep:true
    }
  },
  methods:{
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += ' 元';
        } else {
          sums[index] = '';
        }
      });

      return sums;
    },
    ExportExcel(){
      let newData=JSON.parse(JSON.stringify([...this.data,...[this.totalData]]))
      const dataSource = newData.map(item => {
        Object.keys(item).forEach(key => {
          // 后端传null node写入会有问题
          if (item[key] === null) {
            item[key] = '';
          }
          // scope.row.list.find(itm=>itm.name==item.label).value
          if (Array.isArray(item[key])) {
            item[key].forEach(i=>{
              item[i.name] = i.value
            })
             //item[key].join(',');
          }
        });
        return item;
      });
      this.$commonUtils.ExportExcel(this.columns.map(item => ({key: item.prop, title: item.label})), dataSource, `${new Date().getTime().toString()}_导出.xlsx`)
    },
    formatColumns(data){
      if(data.length){
        this.columns=[]
        Object.keys(data[0]).filter(item=>item!='list').forEach(item=>{
          this.columns.push({label:'',prop:item})
        })
        data[0].list.forEach(item=>{
          this.columns.push({label:item.name,prop:item.name})
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  /deep/ thead .cell{
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
