import CustomerCard from '@/components/CustomerCard/index.vue';

const CustCard = {
  install: function (Vue) {
    Vue.component('CustCard', CustomerCard);
  }
}

export default CustCard
