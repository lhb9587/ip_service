<template>
  <div class="maskModel" :style="{height: height + 'px'}">

  </div>
</template>

<script>
  export default {
    name: "MaskModel",
    data() {
      return {
        height: 0
      }
    },
    created() {
      const obj = document.querySelector('.el-tabs__content')
      if (obj) {
        this.height = obj.scrollHeight
      }
    }
  }
</script>

<style lang="scss" scoped>
  .maskModel {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #000;
    z-index: 2;
    opacity: 0.2;

  }

</style>
