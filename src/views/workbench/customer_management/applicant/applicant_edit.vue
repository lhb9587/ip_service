<template >
  <ApplicantDetail :is-edit="true" />
</template>

<script>
import ApplicantDetail from "./components/ApplicantDetail";

export default {
  name: "EditForm",
  components: { ApplicantDetail }
};
</script>
