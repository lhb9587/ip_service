<template>
    <div>
      <el-tree
        :data="list"
        :props="defaultProps"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        :render-content="renderContent">
      </el-tree>
    </div>
</template>

<script>
import {queryContents} from '@/api/knowledgeBase.js'
// import input from "../../../../../components/pl-table/package/input/src/input";
export default {
  name: "directoryManagement",
  data(){
    return {
      list:[],
      defaultProps:{
        children: 'childArray',
        label: 'name',
        isLeaf: 'leaf'
      },
    }
  },
  created() {
    this.queryContents()
  },
  methods:{
    queryContents(){
      queryContents().then(res=>{
        this.list=res.data
      })
    },
    append(data,node){
      const newChild = { id: 111, name: '新建文件', childArray: []};
        if (!data.childArray) {
          this.$set(data, 'childArray', []);
        }
        data.childArray.push(newChild);
    },
    remove(node, data){
        const parent = node.parent;
        const childArray = parent.data.childArray || parent.data;
      const index = childArray.findIndex(d => d.id === data.id);
      childArray.splice(index, 1);
    },
    modify(data){
      if(data.modify){
        this.$set(data,'modify',false)
      }else {
        this.$set(data,'modify',true)
      }

      // data.modify
    },
    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
        {data.modify? <el-input class='treeInput' v-model={data.name}/>:<span>{node.label}</span>}
        <span>
      <el-button  size="mini" type="text" on-click={ () => this.modify(data,node) }>{data.modify?'保存':'修改'}</el-button>
        <el-button  size="mini" type="text" on-click={ () => this.append(data,node) }>添加</el-button>
        <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }>删除</el-button>
      </span>
      </span>);
    },
  }
}
</script>

<style lang="scss" scoped>
.el-tree /deep/{
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .treeInput{
    height: 22px;
    line-height: 22px;
  }
}

</style>
