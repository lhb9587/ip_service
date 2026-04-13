<template>
    <div>
<!--      {{state.editableTabs}}-->
      <el-tabs  v-model="state.editableTabsValue" type="card" closable @tab-remove="removeTab">
        <el-tab-pane
          v-for="(item, index) in state.editableTabs"
          :key="item.name"
          :label="item.title"
          :name="item.name"
        >
          <TablePage @updateList="(pageSize,pageNo,data)=>updateList(item,pageSize,pageNo,data)"  :data="item" :list="item.content" :titleArray="item.titleArray"></TablePage>
        </el-tab-pane>
      </el-tabs>
    </div>
</template>

<script>
import { state,  mutation} from '../store/index.js'
import TablePage from "./TablePage";
export default {
  name: "TabList",
  data() {
    return {
      // state:state
    }
  },
  computed: {
    state() {
      return state
    }
  },
  components:{
    TablePage
  },
  methods: {
    ...mutation,
    setCount() {
      state.count += 10
    },
    updateList(item,pageSize,pageNo,data){
      mutation.updateTabcontent(item.title,item.indexName,item.knowledgeNavigationId,pageSize,pageNo,data)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-tabs{
  margin-right: 10px;
  padding-bottom: 10px;
}
</style>
