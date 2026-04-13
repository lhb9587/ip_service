import Vue from 'vue';

export default Vue.extend({
  template: `
    <el-input :ref="'input'" type="textarea" size="small" :title="value" v-model="value"></el-input>
  `,
  data() {
    return {
      value: '',
      gridData: [],
      cancelBeforeStart: true,
      loading: false,
      fwfPopShow: false
    };
  },
  methods: {
    getValue() {
      return this.value;
    },
  },
  created() {
    this.value = this.params.value;
  },
  watch: {
    'params': {
      handler(n) {
        console.log(n);
      },
      deep: true
    },
    value(n, o) {
      this.params.data[this.params.colDef.field] = n
    }
  },
  mounted() {
    Vue.nextTick(() => {
      if (this.$refs.input) {
        this.$refs.input.focus();
      }
    });
  },
});
