import Vue from 'vue';
import { elSelect,elOption } from "element-ui";
import {querywfUserNameUrl} from "@/api/billApi";
export default Vue.extend({
  template: `
    <el-select :ref="'input'"  default-first-option v-model="value" @change="changeValue" clearable filterable remote reserve-keyword placeholder="请输入关键词"
               :remote-method="querywfUserNameUrl">
      <el-option v-for="item in userList.filter(i=>!!i.userId).slice(0,100)" :key="item.userId" :label="item.fullname" :value="item.userId">
      </el-option>
    </el-select>
  `,
  data() {
    return {
      value: '',
      userList: [],
      cancelBeforeStart: true,
      loading: false
    };
  },
  components: {
    'el-select': elSelect,
    'el-option': elOption
  },
  methods: {
    changeValue(n){
      this.params.data[this.params.colDef.field]=n
      this.params.data['useridString']=this.userList.find(item=>item.userId==n)?this.userList.find(item=>item.userId==n).fullname:''
      this.params.api.stopEditing()
    },
    //查询客户列表
    querywfUserNameUrl(value) {
      if (!value) return;
      if (!this.loading) {
        this.loading = true;
        querywfUserNameUrl({ fullname: value, isActive: 0 }).then(res => {
            this.userList = res.data
            this.loading = false;
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
    this.userList=[{userId:this.params.data.userid,fullname:this.params.data.useridString}]
    console.log(this.userList);
    // only start edit if key pressed is a number, not a letter
    this.cancelBeforeStart =
      this.params.charPress && '1234567890'.indexOf(this.params.charPress) < 0;
  },
  watch:{
    value(n,o){
      // this.params.data[this.params.colDef.field]=n
      // this.params.data['useridString']=this.userList.find(item=>item.userId==n)?this.userList.find(item=>item.userId==n).fullname:''
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
