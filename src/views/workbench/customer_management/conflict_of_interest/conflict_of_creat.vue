<template>
  <ConflictDetail :is-edit="false" />
</template>

<script>
import ConflictDetail from "./components/ConflictDetail";

export default {
  name: "CreateForm",
  components: { ConflictDetail }
};
</script>

