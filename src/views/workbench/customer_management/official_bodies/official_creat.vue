<template>
  <official-detail :is-edit="false" />
</template>

<script>
import officialDetail from "./components/officialDetail";

export default {
  name: "CreateForm",
  components: { officialDetail }
};
</script>

