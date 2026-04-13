<template >
  <officialDetail :is-edit="true" />
</template>

<script>
import officialDetail from "./components/officialDetail";

export default {
  name: "EditForm",
  components: { officialDetail }
};
</script>
