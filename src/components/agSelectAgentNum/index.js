import Vue from 'vue';
import {queryOfficialBillRecordList} from "@/api/billApi";
export default Vue.extend({
  template: `
            <el-popover  v-model="fwfPopShow" width class="inputshow" placement="bottom" trigger="click" >
              <el-table size="mini" @row-click="fwtableClick" :data="gridData" style="height:250px;overflow: scroll;"  >
                <el-table-column width="200" property="agentNum" label="案件文号"></el-table-column>
                <el-table-column width="300" property="appNumber" label="申请号"></el-table-column>
                <el-table-column width="100" property="nameCn" label="费用名称"></el-table-column>
                <el-table-column width="100" property="payAmount" label="缴费金额"></el-table-column>
                <el-table-column width="100" property="billNo" label="账单号"></el-table-column>
              </el-table>
              <el-input :ref="'input'" type="text" size="small" slot="reference" autosize :title="value" @input="fwfinputchange" v-model="value"></el-input>
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
    // 'el-select': elSelect,
    // 'el-option': elOption
  },
  methods: {
    getValue() {
      return this.value;
    },
    isCancelBeforeStart() {
      return this.cancelBeforeStart;
    },
    fwfinputchange(val) {
      if (val != "") {
        queryOfficialBillRecordList({ agentNum: val, payListType: 1826 }).then(res => {
          this.gridData = res.data;
          this.fwfPopShow=true
          // if(this.gridData.length){
          //   this.fwfPopShow=true
          // }else {
          //   this.fwfPopShow=false
          // }
        });
      }
    },
    // dblclick(type){
    //   this.params.colDef.cellEditorParams.onDoubleClick(type,this.params.data)
    // },
    fwtableClick(row) {
      this.params.data['appNumber'] = row.appNumber;
      this.params.data['caseCnName'] = row.caseCnName;
      this.params.data['caseId'] = row.caseId;
      this.params.data['billRecordId'] = row.billRecordId;
      this.value = row.agentNum;
      this.params.api.refreshCells()

      // this.djchange(row.price, this.data.billDetailsfwf[index], index);
      this.fwfPopShow = false
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
      // if(n&&!this.gridData.length){
      //   this.$nextTick(()=>{
      //     this.fwfPopShow=false
      //   })
      //
      // }
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
