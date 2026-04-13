<template>
  <el-autocomplete
    class="inline-input"
    v-model="newlovingVue"
    :fetch-suggestions="querySearch"
    placeholder="请输入内容"
    @select="handleSelect"
    @change="handleChange"
    clearable
  ></el-autocomplete>
</template>

<script>
  export default {
    name: "index",
    props:{
      placeholder:{
        default: '请输入'
      },
      lovingVue: {
      },
      list:{
        default:()=>([])
      },
      type:{
        default:'value'
      }
    },
    model:{
      prop: 'lovingVue',
      event: 'change'
    },
    data() {
      return {
        newlovingVue: this.lovingVue,
        restaurants:this.list,
        filterText:'',
        flag:false
        // restaurants:[]
      }
    },
    created() {
    },
    methods:{
      handleChange(val){
        this.$emit('change', val)
        if (val !== undefined && val !== null) {
          this.filterText = val
        }
      },
      handleSelect(item){
        this.flag=true
        this.$emit('select',item)
        setTimeout(()=>{
          this.filterText=''
        })
        // this.querySearch()
      },
      querySearch(queryString, cb) {
        // console.log(queryString);

        var restaurants = this.restaurants;
        // if(queryString!==this.newlovingVue){
        //   this.filterText=queryString
        // }else {
        //   this.filterText=''
        // }
        console.log(this.filterText);
        var results = this.filterText ? restaurants.filter(this.createFilter(this.filterText)) : restaurants;
        cb(results);
        // 调用 callback 返回建议列表的数据
        // if(this.flag){
        //   cb(results);
        // }else {
        //   cb(restaurants);
        // }

      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
    },
    watch:{
      newlovingVue: function(newVal,oldVal){
        this.$emit('change',newVal)
        if(oldVal){
          this.filterText = newVal
        }
        // this.filterText = newVal
      },
      lovingVue(n) {
        this.newlovingVue = n
      },
      list:{
        handler(n,o){
          n.forEach(item=>{
            item.value=item[this.type]
          })
          this.restaurants=n
        },
        deep:true,
        immediate:true
      }
    },
  }
</script>

<style scoped>

</style>
