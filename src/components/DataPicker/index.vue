<template>
  <div class="datePickerWrap">
    <el-date-picker
      :disabled="disabled"
      ref="selectFirst"
      v-model="newlovingVue[0]"
      :type="type"
      :placeholder="startPlaceholder"
      :format="format"
      :value-format="valueFormat"
      @change="(e)=>selectFirst(e,this)"
      :popper-class="type=='month'?'monthPopper':''"
      :picker-options="{
        disabledDate(time){
          if(type=='date'){
            if(!(new Date(newlovingVue[1]).getTime())){
              return false
            }
            return time.getTime()>=new Date(newlovingVue[1]).getTime();
          }
          if(type=='month'){
             return time.getTime()>=new Date(new Date().getFullYear()+'-'+newlovingVue[1]+'-01').getTime();
          }
        }
      }"
      >
    </el-date-picker>
    <span>至</span>
    <el-date-picker
      :disabled="disabled"
      ref="selectSecond"
      v-model="newlovingVue[1]"
      :type="type"
      :format="format"
      :placeholder="endPlaceholder"
      :value-format="valueFormat"
      :popper-class="type=='month'?'monthPopper':''"
      :picker-options="{
        disabledDate(time) {
         if(type=='date'){
           if(!(new Date(newlovingVue[0]).getTime())){
                return false
              }
            return time.getTime() < new Date(newlovingVue[0]).setDate(new Date(newlovingVue[0]).getDate()-1);
          }
         if(type=='month'){
            return time.getTime() < new Date(new Date().getFullYear()+'-'+newlovingVue[0]+'-01').setMonth(new Date(new Date().getFullYear()+'-'+newlovingVue[0]+'-01').getMonth());
         }
        }
      }"
     >
    </el-date-picker>
  </div>
</template>

<script>
export default {
  name: "index",
  props: {
    disabled: {
      default: false
    },
    lovingVue: {
      default: () => ['', '']
    },
    type: {
      default: 'date'
    },
    startPlaceholder: {
      default: '开始日期'
    },
    endPlaceholder:{
      default: '结束日期'
    },
    format: {
      default: 'yyyy-MM-dd'
    },
    valueFormat:{
      default: 'yyyy-MM-dd'
    }
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
