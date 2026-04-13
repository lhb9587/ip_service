<template>
  <div class="app-container">
    <header class='y-header'>{{$route.meta.title}}</header>
    <billDetails :type="type"></billDetails>
  </div>
</template>

<script>
import billDetails from "./components/billDetails";

export default {
  name: "",
  components: { billDetails },
  props: {},
  data() {
    return {
      type:1
    };
  },
  beforeRouteEnter:(to,from,next)=>{
    //此时该组件还没被实例化
    console.log(from)
    if(from.name=='off_bill'){
      next(vm =>{
        vm.type=1
      })
    }else {
      next(vm =>{
        vm.type=2
      })
    }
    //弹出消息框信息为 undefined

  },
  watch: {},
  computed: {},
  methods: {},
  created() {},
  mounted() {}
};
</script>
<style lang="scss" scoped>
/deep/ .el-tabs__item {
  text-align: center;
  width: 100px;
}
</style>
