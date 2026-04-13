<template >
  <ConflictDetail :is-edit="true" />
</template>

<script>
import ConflictDetail from "./components/ConflictDetail";

export default {
  name: "EditForm",
  components: { ConflictDetail }
};
</script>
