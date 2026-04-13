<template>
  <keep-alive :include="keepAliveList" max="1">
    <router-view />
  </keep-alive>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "finance",
  computed: {
    ...mapGetters(["keepAliveList", "shiftName"])
  }
};
</script>
