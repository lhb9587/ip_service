<template>
<div>
    <div v-if="filterList.length">
      <el-card shadow="hover" v-for="item in filterList" @click.native="useThisFilter(item)">
        <i class="el-icon-close" @click.stop="delFilterScheme(item)"></i>
       {{item.schemeName}}
      </el-card>
    </div>

</div>
</template>

<script>
import { mapState } from 'vuex'
import { delFilterScheme, getFilterScheme, addFilterScheme} from '@/api/caseList'
export default {
  name: "index",
  created() {
    //  this.getFilterScheme()
  },
  data() {
    return {
      filterList: []
    }
  },
  methods:{
    getFilterScheme() {
      getFilterScheme({ bussId: this.bussId }).then(res => {
        this.filterList = res.data
      })
    },
    useThisFilter(item) {
      this.$store.commit('caseInformation/SET_FILTERVALUE','')
      this.$nextTick(()=>{
        this.$store.commit('caseInformation/SET_FILTERVALUE',item.value)
      })
    },
    delFilterScheme(item){
      delFilterScheme({id:item.id}).then(res=>{
        this.getFilterScheme()
      })
    }
  },
  watch:{
    bussId:{
      handler(n,o){
        this.getFilterScheme()
      },
      immediate: true
    }
  },
  computed:{
    ...mapState({
      'bussId': state => state.caseInformation.bussId,
    }),
  }
}
</script>

<style lang="scss" scoped>
  .el-card{
    position: relative;
    width: 200px;
    margin:10px ;
    .el-icon-close{
      cursor: pointer;
      position: absolute;
      right: 5px;
      top: 5px;
    }
  }
</style>
