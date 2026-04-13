<template>
  <div>
    <!--    <h1>财务-首页</h1>-->
  </div>
</template>

<script>
export default {
  name: 'index',
  created() {
    if (this.$store.getters.permissions.includes(84)) {
      this.$router.push('/workbench/finance_bill_manager/finance_bill')
      return
    }
    if (this.$store.getters.permissions.includes(85)) {
      this.$router.push('/workbench/finance_bill_manager/finance_inside_bill')
      return
    }
    if (this.$store.getters.permissions.includes(86)) {
      this.$router.push('/workbench/finance_bill_manager/finance_traw_sheet')
      return
    }
  }
}
</script>

<style scoped>

</style>
