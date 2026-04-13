<template>
  <div class="datePickerWrap">
    <el-date-picker
      ref="selectFirst"
      v-model="newlovingVue[0]"
      :type="type"
      :placeholder="startPlaceholder"
      :format="format"
      :value-format="valueFormat"
      @change="(e)=>selectFirst(e,this)"
      :picker-options="{
        disabledDate(time){

          if(type=='month'){
            if(!newlovingVue[1]){
              return  false
            }
             return  time.getTime()>=new Date(newlovingVue[1]+'-01').getTime();
          }
        }
      }"
    >
    </el-date-picker>
    <span>至</span>
    <el-date-picker
      ref="selectSecond"
      v-model="newlovingVue[1]"
      :type="type"
      :format="format"
      @change="$emit('change', newlovingVue)"
      :placeholder="endPlaceholder"
      :value-format="valueFormat"
      :picker-options="{
        disabledDate(time) {

         if(type=='month'){
            return time.getTime() < new Date(newlovingVue[0]+'-01').setMonth(new Date(newlovingVue[0]+'-01').getMonth());
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
      lovingVue: {
        default: () => ['', '']
      },
      type: {
        default: 'month'
      },
      startPlaceholder: {
        default: '开始日期'
      },
      endPlaceholder:{
        default: '结束日期'
      },
      format: {
        default: 'yyyy-MM'
      },
      valueFormat:{
        default: 'yyyy-MM'
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
        // this.$emit('change',newVal)
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
        this.$emit('change', this.newlovingVue)
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
