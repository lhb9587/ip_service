<template>
  <ApplicantDetail :is-edit="false" />
</template>

<script>
import ApplicantDetail from "./components/ApplicantDetail";

export default {
  name: "CreateForm",
  components: { ApplicantDetail }
};
</script>

