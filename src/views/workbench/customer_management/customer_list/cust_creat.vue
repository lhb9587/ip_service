<template>
  <cust-detail :is-edit="false"/>
</template>

<script>
import CustDetail from "./components/CustDetail";

export default {
  name: "CreateForm",
  components: { CustDetail }
};
</script>

