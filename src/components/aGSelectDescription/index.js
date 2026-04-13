import Vue from 'vue';
import { elSelect,elOption } from "element-ui";
import { checkBillDescWord, queryChargeItemBynameCnUrl } from '@/api/billApi'
import {fomatFloat} from '@/utils/filters'
export default Vue.extend({
  template: `
            <el-popover  v-model="fwfPopShow" width class="inputshow" placement="bottom" trigger="click" >
              <el-table size="mini" @row-click="fwtableClick" :data="gridData" style="height:250px;overflow: scroll;"  >
                <el-table-column width="200" property="nameCn" label="费用描述（中文）"></el-table-column>
                <el-table-column width="300" property="nameEN" label="费用描述英文"></el-table-column>
                <el-table-column width="100" property="caseType" label="案件类型"></el-table-column>
                <el-table-column width="100" property="appFromto" label="申请方向"></el-table-column>
                <el-table-column width="100" property="price" label="定价"></el-table-column>
              </el-table>
              <el-input :ref="'input'" @dblclick.native="dblclick('billDetailsfwf')"  type="textarea" size="small" slot="reference" autosize :title="value" v-debounce:fwfinputchange="'input',200" v-model="value"></el-input>
            </el-popover>
<!--    <el-select :ref="'input'"  default-first-option v-model="value" clearable filterable reserve-keyword placeholder="请输入关键词"-->
<!--               >-->
<!--      <el-option v-for="(item,key) in allRoles" :key="key" :label="item.name" :value="item.roleId"></el-option>-->
<!--    </el-select>-->
  `,
  data() {
    return {
      value: '',
      gridData: [],
      cancelBeforeStart: true,
      loading: false,
      fwfPopShow:false
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
    fomatFloat(number,n){
      return fomatFloat(number,2)
    },
    changeValue(val) {

    },
    async fwfinputchange() {
      const val = this.value
      if (val != "") {
        queryChargeItemBynameCnUrl({ nameCn: val,billId:this.$route.params.id || this.params.data.billid }).then(res => {
          this.gridData = res.data;
          if(this.gridData.length){
            this.fwfPopShow=true
          }else {
            this.fwfPopShow=false
          }
        });
      }
      let html = val.replace(/\n/g, ' <br />')
      await checkBillDescWord({sentence: val || ''}).then(res => {
        console.log('====')
        console.log(html.split(' '))
        res.data && res.data.forEach(item => {
          const reg = new RegExp(item, 'g')
          html = html.split(' ').map(i => {
            if (i.includes('-')) {
              return i.split('-').map(j => {
                if (j.replace(/[^a-zA-Z]/g, '') == item) return j.replace(reg, `<span class="error-text" style="font-size: 13px;text-decoration: underline wavy red">${item}</span>`)
                return j
              }).join('-')
            }
            // if (i === '') return `<span class="error-text" style="text-decoration: underline wavy red;font-size: 13px">&nbsp</span>`
            if (i.replace(/[^a-zA-Z]/g, '') == item) return i.replace(reg, `<span class="error-text" style="text-decoration: underline wavy red">${item}</span>`)
            return i
          }).join(' ')
        })
        this.params.data.htmlCode = html.replace(/(^|\s+)([\w'-]+)(?=\s+\2(\b|$))/gi,
          (match, space, word) => {
            return space + `<span class="error-text" style="text-decoration: underline wavy red;font-size: 13px">${word}</span>`;
          }
        ).split(' ').map(i => {
          if (i === '') return `<span class="error-text" style="text-decoration: underline wavy red;font-size: 13px">&nbsp</span>`
          return i
        }).join(' ')
      })
    },
    dblclick(type){
      this.params.colDef.cellEditorParams.onDoubleClick(type,this.params.data)
    },
    fwtableClick(row) {
      this.params.data['localprice'] = row.price;
      if (this.$store.getters.contactLanguage == 'CN') {
        this.value = row.nameCn ? row.nameCn : ''
      } else {
        this.value = row.nameEN ? row.nameEN : ''
      }
      // this.djchange(row.price, this.data.billDetailsfwf[index], index);
      this.fwfPopShow = false
      let html = this.value.replace(/\n/g, ' <br />')
      checkBillDescWord({sentence: this.value || ''}).then(res => {
        res.data && res.data.forEach(item => {
          const reg = new RegExp(item, 'g')
          html = html.split(' ').map(i => {
            if (i.includes('-')) {
              return i.split('-').map(j => {
                if (j.replace(/[^a-zA-Z]/g, '') == item) return j.replace(reg, `<span class="error-text" style="font-size: 13px;text-decoration: underline wavy red">${item}</span>`)
                return j
              }).join('-')
            }
            // if (i === '') return `<span class="error-text" style="text-decoration: underline wavy red;font-size: 13px">&nbsp</span>`
            if (i.replace(/[^a-zA-Z]/g, '') == item) return i.replace(reg, `<span class="error-text" style="text-decoration: underline wavy red">${item}</span>`)
            return i
          }).join(' ')
        })
        this.params.data.htmlCode = html.replace(/(^|\s+)([\w'-]+)(?=\s+\2(\b|$))/gi,
          (match, space, word) => {
            return space + `<span class="error-text" style="text-decoration: underline wavy red;font-size: 13px">${word}</span>`;
          }
        ).split(' ').map(i => {
          if (i === '') return `<span class="error-text" style="text-decoration: underline wavy red;font-size: 13px">&nbsp</span>`
          return i
        }).join(' ')
      })
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
    // this.$store.log =this.params.data.allRoles
    // only start edit if key pressed is a number, not a letter
    this.cancelBeforeStart =
      this.params.charPress && '1234567890'.indexOf(this.params.charPress) < 0;
  },
  watch:{
    'params':{
       handler(n){
         console.log(n);
       },
      deep:true
    },
    fwfPopShow(n,o){
      if(n&&!this.gridData.length){
        this.$nextTick(()=>{
          this.fwfPopShow=false
        })

      }
    },
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
