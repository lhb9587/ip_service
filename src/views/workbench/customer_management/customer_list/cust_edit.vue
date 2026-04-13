<template >
  <cust-detail :is-edit="true"/>
</template>

<script>
import CustDetail from "./components/CustDetail";

export default {
  name: "EditForm",
  components: { CustDetail }
};
</script>
