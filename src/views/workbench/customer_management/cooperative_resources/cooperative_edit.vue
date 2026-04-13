<template >
  <CooperativeDetail :is-edit="true" />
</template>

<script>
import CooperativeDetail from "./components/CooperativeDetail";

export default {
  name: "EditForm",
  components: { CooperativeDetail }
};
</script>
