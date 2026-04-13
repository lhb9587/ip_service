import Vue from 'vue';
import { elSelect,elOption } from "element-ui";
import {
  queryCustName,
} from "@/api/systemList";
export default Vue.extend({
  template: `
<!--    <input :ref="'input'" @keydown="onKeyDown($event)" v-model="value"/>-->
<!--    <el-select :ref="'input'" v-model="value" placeholder="请选择">-->
<!--      <el-option-->
<!--        v-for="item in options"-->
<!--        :key="item.value"-->
<!--        :label="item.label"-->
<!--        :value="item.value">-->
<!--      </el-option>-->
<!--    </el-select>-->
    <el-select :ref="'input'"  default-first-option v-model="value" clearable filterable remote reserve-keyword placeholder="请输入关键词"
            :remote-method="queryCustName">
            <el-option v-for="item in queryCustNameList.slice(0,100)" :key="item.custId" :label="item.name" :value="item.custId">
            </el-option>
    </el-select>
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
    //查询客户列表
    queryCustName(value) {
      if (!value) return;
      if (!this.loading) {
        this.loading = true;
        queryCustName({ name: value }).then(res => {
          if (res.success) {
            this.queryCustNameList = res.data;

            this.loading = false;
          }
        });
      }
    },
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
    //  console.log(n,o,this)
      this.params.data.name=this.queryCustNameList.find(item=>item.custId==n).name
      this.params.data.memo=this.queryCustNameList.find(item=>item.custId==n).memo
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
