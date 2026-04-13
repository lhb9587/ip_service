<template>
  <GrowthProfile :talent-code="talentCode"></GrowthProfile>
</template>

<script>
import GrowthProfile from './components/GrowthProfile'
export default {
  name: 'staff_management_detail',
  data() {
    return {
      talentCode: ''
    }
  },
  created() {
    this.talentCode = this.$route.params && this.$route.params.id
  },
  components:{
    GrowthProfile
  }
}
</script>

<style scoped>

</style>
