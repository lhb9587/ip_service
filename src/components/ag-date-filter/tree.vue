<template>
  <div>


  <el-input
    placeholder="输入关键字进行过滤"
    v-model="filterText">
  </el-input>
  <el-tree
    :data="treeData"
    show-checkbox
    ref="tree"
    node-key="id"
    check-on-click-node
    :props="defaultProps"
    :filter-node-method="filterNode"
  @check="check">
    <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
<!--        <span>-->
<!--          ({{getCount(data)}})-->
<!--        </span>-->
      </span>
  </el-tree>
  </div>
</template>

<script>
  import {getTwoDimensionalArray} from '@/utils'
  export default {
    name: "tree",
    props:{
      data:{

      },
      field: {},
      splitStr: {}
    },
    data(){
      return {
        treeData:[],
        filterText:'',
        defaultTreeData:[],
        defaultProps: {
          children: 'child',
          label: 'name'
        }
      }
    },
    created(){
      this.defaultTreeData=JSON.parse(JSON.stringify(this.data))
       // this.treeData=this.c(this.getTreeData(this.data.map(item => item.gfCreateDate)))
      if (['certificationTime', 'reportEvidenceTime'].includes(this.field)) {
        this.treeData = this.c(this.getTreeData(this.data.map(item => item[this.field])))
      } else {
        this.treeData = this.c(this.getTreeData(this.data.map(item => item[this.field])))
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      },

    },
    methods:{
      filterNode(value, data) {
        if (!value) return true;
        let str= getTwoDimensionalArray(this.treeData, 'id', data.id, {children: 'child'}).map(i => i.split(this.splitStr)[1]).join(this.splitStr)
      return str.includes(value)||value .includes(str)
        // return data.name.indexOf(value) !== -1;
      },
      getTreeData(array){
         return [...new Set(array)].map(item=>{
          return item && item.split(this.splitStr)
        })
      },
      getCount(data){
        return 0
        // return  this.defaultTreeData.filter(item=>{
        //   return  item.abslimitDate.includes(getTwoDimensionalArray(this.treeData, 'id', data.id, {children: 'child'}).map(i => i.split('-')[1]).join('-'))
        // }).length
      },
     c(arr) {
         let id=0
      var ids = [],
        result = [],
        randomKey = Math.random().toString(32).slice(-8),
        map = new Map();

      function createItem (name, index) {

        ids.length = index + 1;

        ids[index] = (ids[index] || 0) + 1;

        let cl = ids.slice(0, index + 1).map(k => String(k).padStart(2, '0')).join('');

        return {
          name,
          id:++id+'-'+name,
          parent:null// cl
        };
      }

      function add(list) {
        let base,
          vk = [];

        list && list.forEach((o, i) => {
          vk.push(o);

          let d = vk.join(randomKey),
            mo;

          if (!map.has(d)) {
            mo = createItem(o, i);
            map.set(d, mo);
            if (base) {
              mo.parent=base.id
              base.child = (base.child || []).concat(mo);
            } else {
              result.push(mo);
            }
          } else {
            mo = map.get(d);
          }

          base = mo;
        });
      }

      arr.forEach(k => add(k));

      return result;
    },

      check(checkedNodes,checkedKeys,halfCheckedNodes,halfCheckedKeys){
        let arr = []
        let keys = ''
        if (['certificationTime', 'reportEvidenceTime'].includes(this.field)) {
          arr = checkedKeys.checkedNodes.map(item => getTwoDimensionalArray(this.treeData, 'id', item.id, {children: 'child'}))
          keys = arr.filter(item => item.length ==2).map(item => item.map(i => i.split('-')[1]).join(this.splitStr))
        } else {
          arr= checkedKeys.checkedNodes.map(item => getTwoDimensionalArray(this.treeData, 'id', item.id, {children: 'child'}))
          keys= arr.filter(item => item.length ==3).map(item => item.map(i => i.split('-')[1]).join(this.splitStr))
        }
        this.$emit('checkedKeys',keys)
      }
    }
  }
</script>

<style scoped>

</style>
