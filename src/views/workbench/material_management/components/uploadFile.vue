<template>
    <div>
      <input type="file" ref="uploadFile" style="display: none" :multiple="multiple">
    </div>
</template>

<script>
export default {
  name: "uploadFile",
  props:{
    clickUpload:{
      type: Boolean,
      default: false
    },
    multiple:{
      type: Boolean,
      default: false
    }
  },
  mounted(){
    this.$refs.uploadFile.addEventListener('change', e => {//绑定监听表格导入事件
      this.$emit('getUploadFile',e)
      this.$refs.uploadFile.value=''
    })
  },
  watch:{
    clickUpload(n){
      if(n){
        this.$refs.uploadFile.click()
        this.$emit('changeClick',false)
      }
    }
  }
}
</script>

<style scoped>

</style>
