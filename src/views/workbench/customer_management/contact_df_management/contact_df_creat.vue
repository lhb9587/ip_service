<template>
  <ContactDfDetail :is-edit="false" />
</template>

<script>
import ContactDfDetail from "./components/ContactDfDetail";

export default {
  name: "CreateForm",
  components: { ContactDfDetail }
};
</script>

