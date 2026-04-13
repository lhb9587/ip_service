<template>
  <GrowthProfile></GrowthProfile>
</template>

<script>
import GrowthProfile from './staff_management/components/GrowthProfile'
export default {
  name: 'my_profile',
  data() {
    return{

    }
  },
  created() {
    console.log('user_id',this.$store.state.user.userId)
  },
  components:{
    GrowthProfile
  }
}
</script>

<style scoped>

</style>
