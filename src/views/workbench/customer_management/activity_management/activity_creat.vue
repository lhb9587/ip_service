<template>
  <Activity :is-edit="false" />
</template>

<script>
import Activity from "./components/Activity";

export default {
  name: "CreateForm",
  components: { Activity }
};
</script>

