<template >
  <ContactDfDetail :is-edit="true" />
</template>

<script>
import ContactDfDetail from "./components/ContactDfDetail";

export default {
  name: "EditForm",
  components: { ContactDfDetail }
};
</script>
