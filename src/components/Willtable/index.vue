<template>
  <div>
    <el-dialog :append-to-body="true" :title="`批量编辑${dtitle}`" @open="openDialog" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" :visible.sync="showTable"
   :width="getWidth+'px'" >
  <el-popover
   v-model="popvisible"
  placement="right"
  width="525"
  trigger="manual">
   <el-transfer
    filterable
    :filter-method="filterMethod"
    filter-placeholder="请输入"
    v-model="selectHeardArr"
    :titles="['全部表头', '已选表头']"
    targetOrder="key"
    :data="heardArr">

  </el-transfer>
   <el-button type="primary" size="small" style ="float:right;margin-top:5px" @click="selectHead">确 定</el-button>

</el-popover>

  <el-tooltip class="item" effect="dark" content="编辑表头" placement="right">
    <i style="font-size: 20px;cursor: pointer;" @click="popvisible=!popvisible" class="el-icon-menu" ></i>
    </el-tooltip>
    <span style="color: #00b0ff">共计：{{tabledata.length}}</span>
      <VueWilltable style="width:100%"  @selection-change="changetable" ref="willtable"  :plType='plType' :rowHeight="rowHeight" :columns="columns" v-model="tabledata"  maxHeight="800" />
      <div v-if="plType === '境外账单'" style="display: flex;justify-content: right;align-items: center">
<!--        handleFee-->
        <div>手续费共计:</div> <div class="piceSpan"> {{handleFeeSum | formatAmount}}</div>
<!--        payMoney-->
        <div>支付金额本币共计:</div> <div class="piceSpan"> {{payMoneySum | formatAmount}}</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$emit('closeTable', false)">取 消</el-button>
        <el-button type="primary" @click="siveBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import VueWilltable from "vue-willtable";
import {queryFeeList,updateFeeDetailList} from "@/api/feeList";
import {
  getBatchHerderUrl,
  queryCaseByCaseIdsUrl,
  saveCasesUrl,
  upTrademarkCaseByOfficialTmFileIdsUrl,
  queryTrademarkCaseByOfficialTmFileIdsUrl,
  upSubmitOfficialsUrl,
  getSubmitOfficialsUrl
} from "@/api/caseDetail.js";
import {queryBillRecordListByBillRecordIds,updateBillRecordListByBillRecordIds} from "@/api/caseList.js";
import VueWilltable from "@/components/vueWilltable/components/Table.vue";
import "vue-willtable/dist/vue-willtable.min.css";
import {queryAbroadList, batchModifyAbroadBill} from '@/api/billApi.js'
import {queryArchivesList, querySampleList, batchUpdateArchives, batchUpdateSamples} from '@/api/material.js'
export default {
  name: "willtable",
  components: { VueWilltable },
  props: {
    abroadBillIds: {
      default:() => []
    },
    feeDetailIds: {
      type: String
    },
    showTable: {
      type: Boolean,
      default: false
    },
    caseTypeId: {
      type: Number
    },
    materialTypeId: {
      type: Number
    },
    changeType: {
      type: String
    },
    reportMatter: {
      type: String
    },
    caseIds: {
      type: Array,
      default:() => []
    },
    plType: {
      type: String,
      default: "案件管理1"
    },
    billRecordIds:{
      default:() => []
    },
    arcDetailIds:{
      default:() => []
    },
    samDetailIds:{
      default:() => []
    },
    modifyCase: {},
  },
  data() {
    return {
      popvisible:false,
      tabledata: [],
      columns: [],
      gdVal: "1",
      dtitle: "--案件",
      heardArr:[],
      selectHeardArr:[],
      dfalldataheader:[],
      rowHeight:28
    };
  },
  watch: {
    selectHeardArr(n){

    }
  },
  computed: {
    handleFeeSum(){
      return this.tabledata.map(item => item.handleFee).reduce((p, n) => p + (+n), 0)
    },
    payMoneySum(){
      return this.tabledata.map(item => item.payMoney).reduce((p, n) => p + (+n), 0)
    },
    getWidth(){
     let width = this.columns.reduce((pre,next)=>{
        return pre+Number(next.width)
      },40)
      if(width<400){
        width=400
      }

      return width<document.body.clientWidth?width:(document.body.clientWidth-document.body.clientWidth*0.1)
    }
  },
  methods: {
    selectHead(){
      localStorage.setItem(this.plType,JSON.stringify(this.selectHeardArr))
      let objhead = []
      this.selectHeardArr.filter(item=>{
        if(this.dfalldataheader.find(i=>i.property == item)){
          objhead.push(this.dfalldataheader.find(i=>i.property == item));
          return true;
        }
      })

        this.columns =[...[{key:'sid',fixed:true,title:'序号',width: "50",disabled: true}],...objhead.map(item => {
          return {
            key: item.property,
            // key: 'remarks',
            fixed: item.isFixation,
            title: item.propertyName,
            type: item.type,
            disabled: !item.isCompile,
            width: item.width ? item.width : "100",
            action: "1",
            autofill: item.autofill,
            options:
              item.values && item.values.length > 0
                ? item.values.map(ite => {
                  return {
                    value2: ite.value2,
                    value: ite.id ? ite.id : ['payCurId', 'abroadCurId'].includes(item.property) && ite.id === 0 ? ite.id + '' : ite.id, // 币种为人民币的id为0无法正常显示，这里转为字符串
                    label: ite.value };
                })
                : []
          };
        })]
        this.popvisible=false;
        this.getData();
    },
    filterMethod(query, item) {
          return item.label.indexOf(query) > -1;
        },
    switchchange(val) {
      this.columns.forEach(col => {
        if (
          ["caseType", "appFromto", "agentNum", "custLevel"].includes(col.key)
        ) {
          col["fixed"] = val;

        }
      });
    },
    changetable(selection) {
      console.log(selection);
    },
    queryCaseByCaseIdsUrl(headerData, f){
      let business = 2
      f==4&&(
        business = 3
      )
      queryCaseByCaseIdsUrl({ caseIds: this.caseIds,propertiesArray:headerData, business }).then(res => {
         let data= res.data
        res.data.forEach((item,index)=>{
          item.sid=index+1
          for(let k in item){
            if(item[k] === 0 || item[k] === 1) {
              item[k] = String(item[k])
            }
          }
        })
        this.tableData = data
        this.$refs.willtable.setData(data);
        this.$nextTick(()=>{
          this.rowHeight=this.$refs.willtable.$el.querySelectorAll('tr')[res.data.length-1].getBoundingClientRect().height
        })
      });
    },
    getData() {
      var headerData=this.selectHeardArr;
      switch (this.plType) {
        case "案件管理1":
          this.queryCaseByCaseIdsUrl(headerData, 1)
          break;
          case "案件管理4":
          this.queryCaseByCaseIdsUrl(headerData, 4)
          break;
        case "递交官方1":
          getSubmitOfficialsUrl({ insIdList: this.caseIds }).then(res => {
            res.data.forEach((item,index)=>{
              item.sid=index+1
            })
            this.$refs.willtable.setData(res.data);
            this.$nextTick(()=>{
              this.rowHeight=this.$refs.willtable.$el.querySelectorAll('tr')[res.data.length-1].getBoundingClientRect().height
            })
          });
          break;
        case "官方通知1":
          queryTrademarkCaseByOfficialTmFileIdsUrl({
            insIdList: this.caseIds
          }).then(res => {
            res.data.forEach((item,index)=>{
              item.sid=index+1
            })
            this.$refs.willtable.setData(res.data);
            this.$nextTick(()=>{
              this.rowHeight=this.$refs.willtable.$el.querySelectorAll('tr')[res.data.length-1].getBoundingClientRect().height
            })
          });
          break;
        case "草单":
          queryBillRecordListByBillRecordIds({
            billRecordIds: this.billRecordIds,
            propertiesArray:headerData
          }).then(res => {
            res.data.forEach((item,index)=>{
              item.sid=index+1
            })
            this.$refs.willtable.setData(res.data);
            this.$nextTick(()=>{
              this.rowHeight=this.$refs.willtable.$el.querySelectorAll('tr')[res.data.length-1].getBoundingClientRect().height
            })
          });
          break;
        case '费用明细':
          queryFeeList({idStr: this.feeDetailIds, tag: 2}).then(res => {
             res.data.forEach((item,index)=>{
              item.sid=index+1
            })
            this.$refs.willtable.setData(res.data);
            this.$nextTick(()=>{
              this.rowHeight=this.$refs.willtable.$el.querySelectorAll('tr')[res.data.length-1].getBoundingClientRect().height
            })
          })
          break;
        case '境外账单':
          queryAbroadList({ idList: this.abroadBillIds }).then(res => {
            res.data.forEach((item,index)=>{
              item.sid=index+1
              item.abroadCurId = item.abroadCurId === 0 ? '0' : item.abroadCurId ;// 币种为人民币的id为0无法正常显示，这里转为字符串
              item.payCurId = item.payCurId === 0 ? '0' : item.payCurId
            })
            this.$refs.willtable.setData(res.data);
            this.$nextTick(()=>{
              this.rowHeight=this.$refs.willtable.$el.querySelectorAll('tr')[res.data.length-1].getBoundingClientRect().height
            })
          })
          break;
        case '档案信息':
          queryArchivesList({ arcIds: this.arcDetailIds }).then(res => {
            res.data.forEach((item,index)=>{
              item.sid=index+1
            })
            this.$refs.willtable.setData(res.data);
            this.$nextTick(()=>{
              this.rowHeight=this.$refs.willtable.$el.querySelectorAll('tr')[res.data.length-1].getBoundingClientRect().height
            })
          })
          break;
        case '样品信息':
          querySampleList({ samIds: this.samDetailIds }).then(res => {
            res.data.forEach((item,index)=>{
              item.sid=index+1
            })
            this.$refs.willtable.setData(res.data);
            this.$nextTick(()=>{
              this.rowHeight=this.$refs.willtable.$el.querySelectorAll('tr')[res.data.length-1].getBoundingClientRect().height
            })
          })
          break;
        default:
          break;
      }
    },
    businessComputed(){
      if(this.plType.includes('1')){
        return 2
      }else if(this.plType.includes('4')){
        return 3
      }else if(this.plType == '费用明细' || this.plType == '境外账单'){
        return 4
      }else if(this.plType == '档案信息') {
        return 61
      }else if(this.plType == '样品信息') {
        return 62
      }else{
        return ''
      }
      // this.plType.includes('1') ? 2 : this.plType.includes('4') ? 3 : ''
    },
    getBatchHerder() {
      var kindID = "";
      var typeID = "";
      switch (this.plType) {
        case "案件管理1":
          kindID = "1";
          typeID = this.caseTypeId;
          this.dtitle = "--案件";
          break;
        case "案件管理4":
          kindID = "1";
          typeID = this.caseTypeId;
          this.dtitle = "--案件";
          break;
        case "递交官方1":
          kindID = "3";
          typeID = this.reportMatter;
          this.dtitle = "--递交官方";
          break;
        case "官方通知1":
          kindID = "2";
          typeID = this.materialTypeId;
          this.dtitle = "--官方通知";
          break;
        case "草单":
          kindID = "4";
          this.dtitle = "--草单";
          break;
        case "费用明细":
          kindID = "5";
          this.dtitle = "--费用明细";
          break;
        case '境外账单':
          kindID = "6";
          this.dtitle = "--境外账单";
          break;
        case '档案信息':
          kindID = "61";
          this.dtitle = "--档案信息";
          break;
        case '样品信息':
          kindID = "62";
          this.dtitle = "--样品信息";
          break;
        default:
          break;
      }
      getBatchHerderUrl({
        business: this.businessComputed(),
        caseTypeId: typeID,
        kind: kindID,
        changeType: this.plType.includes('案件管理') ? this.changeType : ""
      }).then(res => {
        this.dfalldataheader=res.data;
        this.heardArr=res.data.map(item => {
          return {
            key: item.property,
            label:item.propertyName,
          };
        });
        if(JSON.parse(localStorage.getItem(this.plType))){
           this.selectHeardArr=JSON.parse(localStorage.getItem(this.plType))
        }else{
           this.selectHeardArr=this.heardArr.filter((item,index)=>index<20).map(item=>item.key)
        }
        if (this.selectHeardArr.includes('ifShareTm') && !this.selectHeardArr.includes('joinApps')) {
          this.selectHeardArr.push('joinApps')
        }
        this.selectHead()
      });
    },
    tmCaseValidate(caseList) { // 商标案件必填项
      const rules = {
        custRefno: {
          type: 'string',
          msg: '客户文号'
        },
        custContactId: {
          type: 'string',
          msg: '客户联系人'
        },
        appFromto: {
          type: 'string',
          msg: '申请方向'
        },
        trademarkCaseCustWorkgroups: {
          type: 'array',
          msg: '客户组'
        },
        reviewCaseAppDate: {
          type: 'string',
          msg: '原申请日期'
        },
        parentAppNumber: {
          type: 'string',
          msg: '原申请编号'
        },
        appCnAddr: {
          type: 'string',
          msg: '申请人中文地址, 申请人冠有省、市、县/区三级区划的详细地址,如四川省成都市青羊区玉沙路1000号'
        }
      }
      for (const k in rules) {
        if (!this.selectHeardArr.find(item => item == k)) {
          delete rules[k]
        }
      }
      let result = true
      let idx
      let msg
      caseList.filter(i => i.agentNum && i.agentNum.slice(0, 2) !== 'NO').forEach((item, index) => {
        if (item.ifShareTm == '1') {
          rules.joinApps = {
            type: 'array',
            msg: '共有人中文名称'
          }
        }
        if (item.caseTypeId != 62) { // 62: 撤回商标评审
          delete rules.reviewCaseAppDate
          delete rules.parentAppNumber
        }
        const noNeedTrademarkList = [
          '商标查询',
          "签署代理合同协议",
          "商标监控总卷/协议",
          "咨询",
          "其他",
          '广告',
          '著名商标认定',
          "投标"
          ] // 不需要校验申请人中文地址格式
        const noNeedTrademarkIdList = ['52', '114', '183', '182', '217', '184', '212', '218']
        if (noNeedTrademarkIdList.includes(String(item.caseTypeId)) || item.submitType !== '网上申请' || item.appGJdq !== '中国' || this.$commonUtils.fomat_qh(item.appCnAddr || '')) {
          delete rules.appCnAddr
        }
        for (let k in rules) {
          if (rules.hasOwnProperty(k)) {
            if (rules[k].type === 'array') {
              if (item[k] && !item[k].length || !item[k]) {
                result = false
                idx = index
                msg = rules[k].msg
              } else if (item[k] && item[k].length && k === 'trademarkCaseCustWorkgroups') {
                if (!item[k][0].wkgId) {
                  result = false
                  idx = index
                  msg = rules[k].msg
                }
              }
            } else if (item[k] && item[k].length && k === 'joinApps') {
              if (!item[k].length) {
                result = false
                idx = index
                msg = rules[k].msg
              }
            } else if (k === 'appCnAddr') {
              !this.$commonUtils.fomat_qh(item[k] || '') && (result = false, idx = index, msg = rules[k].msg)
            } else {
              !item[k] && (result = false, idx = index, msg = rules[k].msg)
            }
          }
        }
      })
      !result && this.$message.error(`请填写第${idx + 1}个案件中的${msg}`)
      return result
    },
    siveBtn(event, filterCaseIdList = [], sign) {
      let senddata
      setTimeout(()=>{
        senddata = this.$refs.willtable.getChangeData()
        senddata = senddata.map(item => {
          for (const ite in item) {
            if (item.hasOwnProperty(ite)) {
              if (item[ite] && item[ite].value && item[ite].label) {

                if(item[ite] && item[ite].applicantName){
                  item['appId']=item[ite].appId
                }
                item[ite] = item[ite].value;

              }
            }
          }

          return item;
        });
        this.$refs.willtable.store.states.data.forEach((item, index) => {
          if (item.ifShareTm == '0' && senddata[index]) {
            senddata[index].joinApps = []
            senddata[index].joinAppsSign = '0000'
          }
        })
        if(senddata&&senddata.length<=0){
          this.$message.error('暂无修改');
          return;
        }
        switch (this.plType) {
          case "案件管理1":
            this.tmCaseValidate(this.$refs.willtable.store.states.data) && saveCasesUrl({ sign: sign || undefined, tmCaseList: senddata.filter(item => !filterCaseIdList.includes(item.caseId)), modifyCase: this.modifyCase }).then(res => {
              if (res.messageType === 1) {
                this.$confirm(res.message,
                    "提示",
                    {
                      confirmButtonText: "确定",
                      showCancelButton: false,
                      // cancelButtonText: "取消",
                      type: "warning"
                    }).then(() => {
                      // this.$emit("closeTable", false);
                })
              } else if (res.messageType === 2) {
                  this.$confirm(res.message,
                    "提示",
                    {
                      confirmButtonText: "确定",
                      // showCancelButton: false,
                      cancelButtonText: "取消",
                      type: "warning"
                    }).then(() => {
                      this.siveBtn(null, res.data, 1)

                  })
              } else {
               this.$message.success(res.message)
                this.$emit("closeTable", false)
              }
            });
            break;
            case "案件管理4":
            saveCasesUrl({ ptCaseList: senddata, business: 3 }).then(res => {
              this.$message.success(res.message);
              this.$emit("closeTable", false);
            });
            break;
          case "递交官方1":
            upSubmitOfficialsUrl({ instructionList: senddata }).then(res => {
              this.$message.success(res.message);
              this.$emit("closeTable", false);
            });
            break;
          case "官方通知1":
            upTrademarkCaseByOfficialTmFileIdsUrl({
              officialList: senddata
            }).then(res => {
              this.$message.success(res.message);
              this.$emit("closeTable", false);
            });
            break;
          case "草单":
            updateBillRecordListByBillRecordIds({
              billRecordList: senddata
            }).then(res => {
              this.$message.success(res.message);
              this.$emit("closeTable", {billRecordIds: this.$refs.willtable.store.states.data.map(i => i.billRecordId)});
            });
            break;
          case "费用明细":
            updateFeeDetailList({feeDetails: this.$refs.willtable.store.states.data}).then(res => {
              this.$message.success(res.message);
              this.$emit("closeTable", {feeDetailIds: this.$refs.willtable.store.states.data.map(i => i.feeDetailId)});
            })
            break;
          case '境外账单':
            batchModifyAbroadBill({
              abBatchParamList: senddata,
              // abBatchParamList: this.$refs.willtable.store.states.data,
              checkFlag: 1
            }).then(res => {
                if (res.messageType == 100) {
                  this.$confirm(
                    res.message,
                    "提示",
                    {
                      confirmButtonText: "是",
                      cancelButtonText: "否",
                      type: "warning"
                    }
                  ).then(res => {
                    batchModifyAbroadBill({
                      abBatchParamList: senddata,
                      // abBatchParamList: this.$refs.willtable.store.states.data,
                      checkFlag: 0
                    }).then(res => {
                      this.$message.success(res.message);
                      this.$emit("closeTable");
                    })
                  }).catch(() => {

                  })
                }else{
                  this.$message.success(res.message);
                  this.$emit("closeTable");
                }
            })
            break;
          case "档案信息":
            batchUpdateArchives({archivesList: senddata}).then(res => {
              this.$message.success(res.message);
              this.$emit("closeTable", {arcDetailIds: this.$refs.willtable.store.states.data.map(i => i.arcId)});
            })
            break;
          case "样品信息":
            batchUpdateSamples({sampleList: senddata}).then(res => {
              this.$message.success(res.message);
              this.$emit("closeTable", {samDetailIds: this.$refs.willtable.store.states.data.map(i => i.samId)});
            })
            break;
          default:
            break;
        }
      },0)


    },
    openDialog() {}
  },
  created() {
    // if (this.caseIds.length == 0&&!this.billRecordIds.length&&!this.feeDetailIds&&!this.abroadBillIds.length) {
    //   if(this.plType!='草单'){
    //     this.$message.error("请选择案件");
    //   }else if(this.plType=='费用明细'){
    //     this.$message.error("请选择费用明细");
    //   }else if(this.plType=='境外账单'){
    //     this.$message.error("境外账单");
    //   }else{
    //     this.$message.error("请选择草单");
    //   }
    //   this.$emit("closeTable", false);
    //   return;
    // }
    if(this.plType=='草单' && !this.billRecordIds.length){
      this.$message.error("请选择草单");
      this.$emit("closeTable", false);
    }else if(this.plType=='费用明细' && !this.feeDetailIds){
      this.$message.error("请选择费用明细");
      this.$emit("closeTable", false);
    }else if(this.plType=='境外账单' && !this.abroadBillIds.length){
      this.$message.error("请选择境外账单");
      this.$emit("closeTable", false);
    }else if(this.plType=='档案信息' && !this.arcDetailIds.length){
      this.$message.error("请选择档案");
      this.$emit("closeTable", false);
    }else if(this.plType=='样品信息' && !this.samDetailIds.length){
      this.$message.error("请选择样品");
      this.$emit("closeTable", false);
    }else if(!this.caseIds.length && !['草单', '费用明细', '境外账单','档案信息','样品信息'].includes(this.plType)){
      this.$message.error("请选择案件");
      this.$emit("closeTable", false);
    }
  },
  mounted() {
    if (this.caseIds.length == 0&&!this.billRecordIds.length&&!this.feeDetailIds&&!this.abroadBillIds.length&&!this.arcDetailIds.length&&!this.samDetailIds.length) {
      return;
    }
    this.getBatchHerder();
  }
};
</script>
<style lang="scss" scoped>
  .piceSpan {
    font-weight: 700;
    font-style: normal;
    font-size: 20px;
    color: #ff6600;
    margin-right: 20px
  }
</style>
