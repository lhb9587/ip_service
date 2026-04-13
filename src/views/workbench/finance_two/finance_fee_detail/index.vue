<template>
  <div>
    <finance-fee :is-detail="true" :bussId="45" />
  </div>
</template>

<script>
  import FinanceFee from '../finance_fee'
  export default {
    name: 'index',
    components: { FinanceFee }
  }
</script>
