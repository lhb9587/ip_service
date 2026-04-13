import ElOption from '@/components/option/option.vue';

/* istanbul ignore next */
ElOption.install = function(Vue) {
  Vue.component(ElOption.name, ElOption);
};

export default ElOption;
