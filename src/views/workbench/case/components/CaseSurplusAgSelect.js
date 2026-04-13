import Vue from 'vue';
import {mapGetters} from "vuex";

export default Vue.extend({
  template: `
    <el-select :ref="'input'" size="mini" default-first-option :clearable="true" v-model="value">
      <el-option v-for="(item,key) in jyList" :key="key" :label="item.typeName" :value="item.id"></el-option>
    </el-select>
  `,
  data() {
    return {
      // jyList: [
      //   {name: '未结余', id: 1887},
      //   {name: '部分结余', id: 1888},
      //   {name: '已结余', id: 1889},
      // ],
      value: '',
      gridData: [],
      cancelBeforeStart: true,
      loading: false,
      fwfPopShow: false
    };
  },
  computed: {
    ...mapGetters(["jyList"]),
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
