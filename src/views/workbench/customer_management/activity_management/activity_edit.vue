<template >
  <Activity :is-edit="true" />
</template>

<script>
import Activity from "./components/Activity";

export default {
  name: "EditForm",
  components: { Activity }
};
</script>
