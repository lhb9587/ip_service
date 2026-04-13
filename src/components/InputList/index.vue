<template>
  <div class="datePickerWrap">
    <el-input
      ref="selectFirst"
      v-model="newlovingVue[0]"
      :placeholder="startPlaceholder"
      @change="(e)=>selectFirst(e,this)"
    >
    </el-input>
    <span>至</span>
    <el-input
      ref="selectSecond"
      v-model="newlovingVue[1]"
      :placeholder="endPlaceholder"
    >
    </el-input>
  </div>
</template>

<script>
  export default {
    name: "index",
    props: {
      lovingVue: {
        default: () => ['', '']
      },
      startPlaceholder: {
        default: '开始'
      },
      endPlaceholder:{
        default: '结束'
      },
    },
    model:{
      prop: 'lovingVue',
      event: 'change'
    },
    data() {
      return {
        newlovingVue: this.lovingVue,
      }
    },
    watch:{
      newlovingVue: function(newVal,oldVal){
        this.$emit('change',newVal)
      },
      lovingVue(n) {
        this.newlovingVue = n
      }
    },
    created() {

    },
    methods:{
      focus(){
        this.$refs.selectFirst.focus()
      },
      selectFirst(e,ref){
        if(e&&!this.newlovingVue[1]){
          this.$nextTick(()=>{
            ref._self.$refs.selectSecond.focus();
          })
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  .datePickerWrap{
    display: flex;
    width: 100%;
    line-height: 40px
  }
</style>
