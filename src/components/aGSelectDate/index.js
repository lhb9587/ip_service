import Vue from 'vue';
import { elSelect,elOption } from "element-ui";

export default Vue.extend({
  template: `
    <el-date-picker
      ref="input"
      v-model="value"
      type="date"
      placeholder="选择日期"
      format='yyyy-MM-dd'
      value-format="yyyy-MM-dd">
    </el-date-picker>
  `,
  data() {
    return {
      value: '',
      queryCustNameList: [],
      cancelBeforeStart: true,
      loading: false
    };
  },
  components: {
    'el-select': elSelect,
    'el-option': elOption
  },
  methods: {
    getValue() {
      return this.value;
    },
    isCancelBeforeStart() {
      return this.cancelBeforeStart;
    },

    // will reject the number if it greater than 1,000,000
    // not very practical, but demonstrates the method.
    isCancelAfterEnd() {
      return this.value > 1000000;
    },

    onKeyDown(event) {
      // if (!this.isKeyPressedNumeric(event)) {
      //   if (event.preventDefault) event.preventDefault();
      // }
    },

    getCharCodeFromEvent(event) {
      event = event || window.event;
      return typeof event.which === 'undefined' ? event.keyCode : event.which;
    },

    isCharNumeric(charStr) {
      return /\d/.test(charStr);
    },

    isKeyPressedNumeric(event) {
      const charCode = this.getCharCodeFromEvent(event);
      const charStr = String.fromCharCode(charCode);
      return this.isCharNumeric(charStr);
    },
  },
  created() {
    this.value = this.params.value;
    this.queryCustNameList=[{custId:this.params.data.custId,name:this.params.data.name}]
    // only start edit if key pressed is a number, not a letter
    this.cancelBeforeStart =
      this.params.charPress && '1234567890'.indexOf(this.params.charPress) < 0;
  },
  watch:{
    value(n,o){
      this.params.data[this.params.colDef.field]=n
    }
  },
  mounted() {
    Vue.nextTick(() => {
      // need to check if the input reference is still valid - if the edit was cancelled before it started there
      // wont be an editor component anymore
      if (this.$refs.input) {
        this.$refs.input.focus();

      }
    });
  },
});
