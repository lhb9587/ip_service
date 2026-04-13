<template>
  <CooperativeDetail :is-edit="false" />
</template>

<script>
import CooperativeDetail from "./components/CooperativeDetail";

export default {
  name: "CreateForm",
  components: { CooperativeDetail }
};
</script>

