<template>
  <el-dialog
    v-dialogDrag
    center
    top="0"
    :title="title"
    height="852"
    :visible.sync="newlovingVue"
    :width="width"
    :modal="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <CommonForm ref="CommonForm" :view="view" :formLabelAlign="formData" :form-items="FORM_ITEMS" >

    </CommonForm>
    <slot></slot>
  </el-dialog>
</template>

<script>
  export default {
    props:{
      width:{
        default:'50%'
      },
      view:{
        default:false

      },
      formData:{
        default: ()=>({
          name: "dogeWin",
          alias: "道格温·狗胜",
        })
      },
      title:{
        default:'提示'
      },
      FORM_ITEMS:{
        default:()=>([
          { prop: "name", label: "姓名", lableWidth: 100, el: "input" },
        ]),
      },
      lovingVue: {
      },
    },
    model:{
      prop: 'lovingVue',
      event: 'change'
    },
    name: "index",
    data(){
      return{
        dialogVisible:false,
        newlovingVue: this.lovingVue,
      }
    },
    methods:{
      checkValidate(){
        return this.$refs.CommonForm.submitForm()
      }
    },
    watch:{
      newlovingVue: function(newVal,oldVal){
        this.$emit('change',newVal)
      },
      lovingVue(n) {
        this.newlovingVue = n
      },
    }

  }
</script>

<style scoped>

</style>
