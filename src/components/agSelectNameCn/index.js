import Vue from 'vue';
import {queryChargeItemBynameCnUrl} from "@/api/billApi";
export default Vue.extend({
  template: `
            <el-popover v-model="fwfPopShow" class="inputshow"  placement="bottom" trigger="click">
              <el-table size="mini" @row-click="fwtableClick" :data="gridData" style="height:250px;overflow: scroll;">
                <el-table-column width="200" property="nameCn" label="费用描述(中文)"></el-table-column>
                <el-table-column width="300" property="nameEN" label="费用描述(英文)"></el-table-column>
                <el-table-column width="100" property="caseType" label="案件类型"></el-table-column>
                <el-table-column width="100" property="patentTypeName" label="专利类型"></el-table-column>
                <el-table-column width="100" property="appFromto" label="申请方向"></el-table-column>
                <el-table-column width="100" property="price" label="定价"></el-table-column>
                <el-table-column width="100" property="yearNo" label="年号"></el-table-column>
              </el-table>
              <el-input ref="input" slot="reference" type="text" size="small" :title="value" @input="fwfinputchange" v-model="value">
              </el-input>
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
        queryChargeItemBynameCnUrl({ nameCn: val, caseId: this.params.data.caseId, chargeType:2 }).then(res => {
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
      this.params.data['priceBill'] = row.price;
      this.params.data['descriptionEn'] = row.nameEN;
      this.params.data['descriptionCn'] = row.nameCn;
      this.params.data['chargeItemId'] = row.chargeItemId;
      this.value = row.nameCn;
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
