import Vue from 'vue'
import { queryQuoteByNumber } from '@/api/caseDetail'

export default Vue.extend({
  template: `
    <el-input :ref="'input'" type="text" size="small" slot="reference" autosize :title="value" @input="fwfinputchange"
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
    isCancelBeforeStart() {
      return this.cancelBeforeStart
    },
    fwfinputchange(val) {
      if (val != '') {
        queryQuoteByNumber({ quoteRegNumber: val }).then(res => {
          this.params.data['quoteTm'] = res.data.quoteTm
          this.params.data['quoteTmClass'] = res.data.quoteTmClass
          this.params.data['quoteAppName'] = res.data.quoteAppName
          this.params.api.refreshCells()
        })
      }
    },
    // dblclick(type){
    //   this.params.colDef.cellEditorParams.onDoubleClick(type,this.params.data)
    // },
    fwtableClick(row) {
      this.params.data['appNumber'] = row.appNumber
      this.params.data['caseCnName'] = row.caseCnName
      this.params.data['caseId'] = row.caseId
      this.params.data['billRecordId'] = row.billRecordId
      this.value = row.agentNum
      this.params.api.refreshCells()

      // this.djchange(row.price, this.data.billDetailsfwf[index], index);
      this.fwfPopShow = false
    }

  },
  created() {
    this.value = this.params.value
    // this.$store.log =this.params.data.allRoles
    // only start edit if key pressed is a number, not a letter
    this.cancelBeforeStart =
      this.params.charPress && '1234567890'.indexOf(this.params.charPress) < 0
  },
  watch: {
    'params': {
      handler(n) {
        console.log(n)
      },
      deep: true
    },
    value(n, o) {
      this.params.data[this.params.colDef.field] = n
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
