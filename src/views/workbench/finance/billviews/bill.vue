<template>
  <div class="app-container">
    <header class='y-header'>{{$route.meta.title}}</header>
    <el-tabs v-model="activeName">
      <el-tab-pane v-if="$store.getters.permissions.includes(84)" label="账单" name="first">
        <transition name="show" mode="out-in">
          <bill-list v-if="activeName=='first'"></bill-list>
        </transition>
      </el-tab-pane>
      <el-tab-pane  v-if="$store.getters.permissions.includes(85)" label="内部账单" name="second">
        <transition name="show" mode="out-in">
          <inside-bill v-if="activeName=='second'"></inside-bill>
        </transition>
      </el-tab-pane>
      <el-tab-pane v-if="$store.getters.permissions.includes(86)" label="草单" name="third">
        <transition name="show" mode="out-in">
          <traw-sheet v-if="activeName=='third'"></traw-sheet>
        </transition>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>
import billList from "./components/billList";
import insideBill from "./components/insideBill";
import trawSheet from "./components/trawSheet";
export default {
  name: "bill",
  components: { billList, insideBill, trawSheet },
  props: {},
  data() {
    return {
      activeName: "first"
    };
  },
  watch: {},
  computed: {},
  methods: {
    init(){
      let activeName=this.activeName
      this.activeName=''
      this.$nextTick(()=>{
        this.activeName=activeName
      })
    }
  },
  activated() {
    if(this.$route.params&&this.$route.params.fenkai){
      this.activeName = 'first'
    }
    if(this.initFlag){
      this.init()
    }
    this.initFlag = true
  },
  created() {
    if(this.$route.params&&this.$route.params.fenkai){
      this.activeName = 'first'
    }
    if (this.$route.params.pagetype) {
      this.activeName = this.$route.params.pagetype;
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
/deep/ .el-tabs__item {
  text-align: center;
  width: 100px;
}
</style>
