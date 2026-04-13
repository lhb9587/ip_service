import Vue from 'vue'

export default Vue.extend({
  template: `
    <el-input :ref="'input'" type="number" size="small" :title="value" style="width: 100%;" @change="(n) => this.params.data[this.params.colDef.field] = n"
              v-model="value"></el-input>
  `,
  data() {
    return {
      value: '',
      gridData: [],
      cancelBeforeStart: true,
      loading: false,
      fwfPopShow: false
    }
  },
  components: {
    // 'el-select': elSelect,
    // 'el-option': elOption
  },
  methods: {
    getValue() {
      return this.value
    },

  },
  created() {
    this.value = this.params.value
  },
  watch: {
    'params': {
      handler(n) {
        console.log(n)
      },
      deep: true
    },
    value(n, o) {
      // this.params.data[this.params.colDef.field] = n
    }
  },
  mounted() {
    Vue.nextTick(() => {
      // need to check if the input reference is still valid - if the edit was cancelled before it started there
      // wont be an editor component anymore
      if (this.$refs.input) {
        this.$refs.input.focus()
      }
    })
  }
})
