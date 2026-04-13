<template>
  <el-input
    v-if="state"
    type="number"
    v-model="newlovingVue"
    :placeholder="placeholder"
    @blur="state=false"
    @mousewheel.native.prevent
  >
  </el-input>
  <el-input
    v-else
    type="text"
    :placeholder="placeholder"
    :value="formatAmount(newlovingVue)"
    @focus="state=true"
    @mousewheel.native.prevent
  >
  </el-input>
</template>

<script>
import {formatAmount} from '@/utils/filters'
export default {
  name: "index",
  props:{
    placeholder:{
      default: '请输入'
    },
    lovingVue: {
      default: 0
    },
  },
  model:{
    prop: 'lovingVue',
    event: 'change'
  },
  data() {
    return {
      newlovingVue: this.lovingVue,
      state: false
    }
  },
  created() {
    console.log(this.lovingVue);
  },
  methods:{
    formatAmount(num){
      return formatAmount(num)
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
}
</script>

<style scoped>
  /* 在Chrome浏览器下 */
  /deep/ input::-webkit-outer-spin-button,
  /deep/ input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  /* 在Firefox浏览器下 */
  /deep/ input[type="number"]{
    -moz-appearance: textfield;
  }

</style>
