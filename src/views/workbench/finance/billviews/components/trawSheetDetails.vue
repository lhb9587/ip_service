<template>
  <div class="createPost-container">
    <div v-if="$route.query.copyByCase || copyTraw">
      <el-row class="searchfullRow">
        <el-col :span="11" class="searchcol">

          <el-form label-width="100px">
            <el-form-item label="案件文号">
              <GetCase style="flex: 1" @getCaseIdList="(list)=>{this.caseIdList = list.map(item=>item.caseId)}" ></GetCase>
<!--              <el-select multiple remote clearable reserve-keyword filterable placeholder="请输入关键词" :remote-method="getCase" v-model="caseNums">-->
<!--                <el-option v-for="item in gridData" :key="item.caseId" :value="item.agentNum" :disabled="item.agentNum == '案件文号'" style="display: flex;max-height: 100px;overflow-y: auto">-->
<!--                  <div @click="addCaseId(item.caseId)" class="tables" style="display: flex;max-height: 100px;width: 600px; overflow-y: auto">-->
<!--                    <el-tooltip  :content="item.agentNum" placement="top" effect="light">-->
<!--                        <div style="flex: 1;cursor: pointer;height: 34px;line-height: 34px;" class="overflow-hidden" :class="{'table-head': item.agentNum == '案件文号'}">{{item.agentNum}}</div>-->
<!--                      </el-tooltip>-->
<!--                      <el-tooltip  :content="item.caseName" placement="top" effect="light">-->
<!--                        <div style="flex: 1;cursor: pointer;height: 34px;line-height: 34px;" class="overflow-hidden" :class="{'table-head': item.caseName == '案件名称'}">{{item.caseName}}</div>-->
<!--                      </el-tooltip>-->
<!--                      <el-tooltip  :content="item.name||item.custName" placement="top" effect="light">-->
<!--                        <div style="flex: 1;cursor: pointer;height: 34px;line-height: 34px;" class="overflow-hidden" :class="{'table-head': item.custName == '客户'}">{{item.name||item.custName}}</div>-->
<!--                      </el-tooltip>-->
<!--                  </div>-->


<!--                </el-option>-->
<!--              </el-select>-->

            </el-form-item>
          </el-form>
        </el-col>

      </el-row>
    </div>
    <el-form ref="postForm" size="small" :rules="rules" class="form-container">
      <div>
        <div class="form-con">
          <el-row>
            <el-col class="form-con-item" :span="24">
              <el-row class="form-border">
                <el-col :span="24">
                  <div v-if="type=='creat' || type=='edit'" style="position:relative;height: 30px;">
                    <el-button style="position: absolute;right: 0;" type="primary" size="mini" @click="addTableList(dataarr, 'dataarr' )">添加</el-button>
<!--                    <el-button type="primary" size="mini" @click="delTableList(dataarr, 'dataarr' )">删除</el-button>-->
                  </div>
                  <div id="billTable">
                    <el-table ref="dataarr" :maxHeight="clientHeight" size="mini" :data="dataarr.filter(item=>item.tobillStatusStr != '已核销' || type !== 'creat'&&type !== 'edit')" border fit empty-text="暂无数据" current-row-key :summary-method="getSummaries" show-summary   style="width: 100%;">

                    <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
                    <el-table-column v-if="!$route.query.copyByCase && !copyTraw" label="案件文号" align="left" width="130">
                      <template slot-scope="scope">
                        <span>{{ scope.row.agentNum }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="费用种类" align="left" width="130">
                      <template slot-scope="scope">
                        <el-select v-if="type=='creat' || type=='edit'" v-model="scope.row.feeKind" @change="changeFeeKind(scope.row)" placeholder="请选择">
                          <el-option
                            v-for="item in [{id:1,label:'服务费'},{id:2,label:'官费'},{id:3,label:'杂费'}]"
                            :key="item.id"
                            :label="item.label"
                            :value="item.id">
                          </el-option>
                        </el-select>
                        <span v-else>{{ scope.row.feeKindNameString }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="费用描述(中文)" align="left" width="360">
                      <template slot-scope="scope">
                        <div v-if="type=='creat' || type=='edit'">
                          <el-popover class="inputshow"  placement="bottom" trigger="manual" v-model="scope.row.descVisible" :key="scope.$index" :ref="'popover-' + scope.$index">
                            <el-table size="mini" @row-click="
                                val => {
                                  fwtableClick(val, scope.row);
                                }
                              " :data="gridData" style="height:250px;overflow: scroll;">
                              <el-table-column width="200" property="nameCn" label="费用描述(中文)"></el-table-column>
                              <el-table-column width="300" property="nameEN" label="费用描述(英文)"></el-table-column>
                              <el-table-column width="100" property="caseType" label="案件类型"></el-table-column>
                              <el-table-column width="100" property="patentTypeName" label="专利类型"></el-table-column>
                              <el-table-column width="100" property="appFromto" label="申请方向"></el-table-column>
                              <el-table-column width="100" property="price" label="定价"></el-table-column>
                              <el-table-column width="100" property="yearNo" label="年号"></el-table-column>
                              <el-table-column label="草单类型" property="billStyleName" width="100"></el-table-column>
                            </el-table>
                            <el-input slot="reference" @focus="descFocus(scope.row, scope.$index)" @blur="() => $set(scope.row, 'descVisible', false)"  @input="(v)=>{fwfinputchange(v,scope.row)}" v-model="scope.row.descriptionCn">
                            </el-input>
                          </el-popover>
                        </div>
                        <div v-else>{{scope.row.descriptionCn}}</div>

                      </template>

                    </el-table-column>

                    <el-table-column label="费用描述(英文)" align="left" width="360">
                      <template slot-scope="scope">
                        <el-input :rows="3" type="textarea" v-if="type=='creat' || type=='edit'" v-model="scope.row.descriptionEn" placeholder=""></el-input>
                        <span v-else>{{scope.row.descriptionEn}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="数量" align="left" width="130" prop="manhourBill">
                      <template slot-scope="scope">
                        <el-input type="number" v-if="type=='creat' || type=='edit'" size="medium" v-model="scope.row.manhourBill" @change="(v)=>{manBillChange(v, scope.row)}" :min="0">
                        </el-input>
                        <span v-else>{{scope.row.manhourBill}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="单价" align="left" width="130" prop="priceBill">
                      <template slot-scope="scope">
                        <el-input type="number" v-if="type=='creat' || type=='edit'"  size="medium" v-model="scope.row.priceBill"  @change="(v)=>{priceBillChange(v, scope.row)}" >

                        </el-input>
                        <span v-else>{{scope.row.priceBill}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="金额" align="left" width="130" prop="amountBill">
                      <template slot-scope="scope">
                        {{scope.row.amountBill | filterMount}}
                      </template>
                    </el-table-column>
                    <el-table-column label="开单日期" align="left" width>
                      <template slot-scope="scope">
                        <span>{{ scope.row.referDate }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column width="100" label="年号">
                      <template slot-scope="scope">
                        <el-input v-if="type=='creat' || type=='edit'" v-model="scope.row.yearNo" placeholder="" @change="(v)=>{changeYearNo(v, scope.row)}"></el-input>
                        <span v-else>{{scope.row.yearNo}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="草单类型" align="left" width="120">
                      <template slot-scope="scope">
                        <el-cascader 
                          v-if="type=='creat' || type=='edit'"
                          :show-all-levels="false"
                          :options="typeTreeList"
                          filterable
                          clearable
                          :props="billTypeProps"
                          change-on-select
                          selectChildren
                          v-model="scope.row.billTypeIds"
                          ></el-cascader>
                        <span v-else>{{ scope.row.billStyleName }}</span>
                      </template>
                    </el-table-column>
                      <el-table-column label="备注" align="left" width="300">
                      <template slot-scope="scope">
                        <el-input :rows="3" type="textarea" v-if="type=='creat' || type=='edit'" v-model="scope.row.memo" placeholder=""></el-input>
                        <span v-else>{{scope.row.memo}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column v-if="type=='creat' || type=='edit'" fixed="right" label="操作" width>
                      <template slot-scope="scope">
                        <span class="handle" @click="delCao(dataarr, scope.$index)">删除</span>
<!--                        <span class="handle" v-if="!scope.row.billRecordId&&scope.$index!==0" @click="delCao(dataarr, scope.$index)">删除</span>-->
                      </template>
                    </el-table-column>
                  </el-table>
                  </div>
<!--                  <div :span="24" style="text-align:right; padding-top:15px">-->
<!--                    <span style="margin-left:20px">总金额:</span><span class="piceSpan"> {{ scope.row.amountBill }}</span>-->
<!--                  </div>-->
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row style="margin-top:40px" v-if="isPatentFee">
            <el-col :span="24" class="fl-ac-jc">
              <el-button type="primary" size="small" @click="saveBillRecordClick">创建</el-button>
              <el-button type="primary" size="small" @click="createRecordAndPatentFee">创建并生成缴纳官费</el-button>
              <el-button size="small" @click="$emit('closeDialog')">取消</el-button>
            </el-col>
          </el-row>
          <el-row v-else style="margin-top:40px">
            <el-col :span="24" style="text-align:center">
              <el-button size="medium" v-if="$route.params.type !== 'see' && openType !== 'see'" @click="sunmitBill" type="primary">确定
              </el-button>

              <el-button style="margin-left:50px" type="" @click="
                 handleClose(false)
                " size="medium">关 闭</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
  import {getCase} from "@/api/feeList";
  import {toFixed1, toFixed2} from "@/utils/filters"
import { mapGetters } from "vuex";
import {
  queryBillRecordcdUrl,
  queryChargeItemBynameCnUrl,
  queryWorkgroupUrl,
  querywfUserNameUrl,
  updateBillInternalUrl,
  updateBillRecordUrl,
  queryClassTree
} from "@/api/billApi";
import {
  addBillRecord,
  queryBillRecordListByBillRecordIds
} from "@/api/caseList";
  import {createPatentPayList, saveBillRecord} from "../../../../../api/billApi";
export default {
  name: "",
  components: {},
  computed: {
    ...mapGetters(["name", "roles", "userId"]),
    clientHeight(){
      return document.documentElement.clientHeight-200
    },
  },
  filters: {
    filterMount(value){
      if(!value && value !== 0){
        return '';
      }
      return value
    }
    },
  created() {
    this.seeCase = !!this.$route.query.from
    this.queryBillTypeTree();
    this.getallSelectdata();
    this.getBilldetail();
  },
  props:{
    billRecordList: {
      type: Array,
      default: () => []
    },
    isPatentFee: {
      type: Boolean,
      default: false
    },
    copyTraw:{
      type: Boolean,
      default: false
    },
    financeBillRecordId: {
      default: ''
    },
    openType: {
      default: ''
    },
    opt: {
      default: 1
    }
  },
  data() {
    return {
      caseIdList: [],
      caseNums: [],
      seeCase:false,
      typeTreeList:[],
      billTypeProps:{
        value: "id",
        label: "typeName",
        children: "childrens",
      },
      zfPopShow: false,
      rules: {
        costwkgid: [
          { required: true, message: "请选择承办组", trigger: "change" }
        ],
        wkgid: [{ required: true, message: "请选择客户组", trigger: "change" }],
        total: [{ required: true, message: "请填写总金额", trigger: "blur" }]
      },
      gridData: [],

      pickerOptions: {
        // disabledDate(time) {
        //   return time.getTime() > Date.now();
        // },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      pickerOptions1: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      data: {amountBill:0,manhourBill:0,priceBill:0},
      dataarr: [],
      selectData: {
        bzData: [],
        yhData: [],
        ygData: [],
        lxrData: [],
        dzData: [],
        gzzselect: [],
        kdrSelect: []
      },
      currencySymbol: "",
      type:''
    };
  },

  watch: {
    // "data.manhourBill"(val) {
    //   if(this.data.priceBill){
    //     this.data.amountBill = val * this.data.priceBill;
    //   }
    //
    // },
    // "data.priceBill"(val) {
    //   if(this.data.manhourBill){
    //     this.data.amountBill = val * this.data.manhourBill;
    //   }
    // }
  },

  methods: {
    changeFeeKind(row) { // 改变费用类型，需要清空费用描述、数量、单价、金额、chargeItemId
      delete row.chargeItemId
      delete row.descriptionCn
      delete row.descriptionEn
      this.$set(row, 'manhourBill', 1)
      delete row.priceBill
      delete row.amountBill
      this.gridData = []
    },
    descFocus(row, index) {
      this.$set(row, 'descVisible', true)
      const key = "popover-" + index
      this.$nextTick(() => {
        console.log(this.$refs[key])
        document.getElementById(this.$refs[key].$refs.popper.id).style.display = "none"
      })
    },
    saveBillRecordClick() {
      saveBillRecord({
        billRecordList: this.dataarr
      }).then(res => {
        this.$message.success(res.message)
        this.$emit('closeDialog')
      })
    },
    createRecordAndPatentFee() {
      saveBillRecord({
        billRecordList: this.dataarr
      }).then(res => {
        // 制作人 createUserId
        // 缴费日期 payDate 制作日期 createDate  当天 this.$commonUtils.formatDate(new Date()),
        // 缴费类型 payListType 全部 1826
        // 收据抬头 receiptTitle 本所 1838
        // 缴费方式 payMethod 1847
        if (res.data && res.data.billRecordList && res.data.billRecordList.length) {
          res.data.billRecordList.forEach(item => {
            item.payAmount = item.amountBill
            item.payDate = this.$commonUtils.formatDate(new Date())
            if (!item.yearNo) {
              item.yearNo = 0
            }
          })
          createPatentPayList({
            payDetails: res.data.billRecordList.filter(item => item.feeKind == 2),
            payMethod: 1847,
            createUserId: this.$store.getters.userId,
            payDate: this.$commonUtils.formatDate(new Date()),
            createDate: this.$commonUtils.formatDate(new Date()),
            payListType: 1826,
            receiptTitle: 1838
          }).then(res => {
            this.$message.success(res.message)
            this.$emit('closeDialog')
          })
        } else {
          this.$message.success(res.message)
          this.$emit('closeDialog')
        }
      })
    },
    // addCaseId(caseId){
    //   if(!this.caseIdList.includes(caseId)){
    //     this.caseIdList.push(caseId)
    //   }
    // },
    // getCase(e){
    //   if(!e)return;
    //   getCase({agentNumCaseName:e,pageSize:50}).then(res=>{
    //     this.gridData = res.data
    //     this.gridData.unshift({'agentNum': '案件文号', 'caseName': '案件名称', 'custName': '客户'})
    //   })
    // },
    changeYearNo(yearNo, row){
      if (yearNo && row.descriptionCn.includes('年费')) {
          queryChargeItemBynameCnUrl({nameCn:'年费', yearNo,caseId: row.caseId, chargeType: row.feeKind, caodan: 1 }).then(res => {
          // this.gridData = res.data;
          if(res.data&&res.data.length){
            this.fwtableClick(res.data[0], row)
          }
        });
      }
    },
    manBillChange(v, row){
      this.$set(row, 'amountBill', v * row.priceBill)
      this.$forceUpdate()
    },
    priceBillChange(v, row){
      this.$set(row, 'amountBill', v * row.manhourBill)
      this.$forceUpdate()
    },
    getSummaries1(param) {
        const { columns, data } = param;

        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总价';
            return;
          }
          const values = data.map(item => {
            console.log(item,'###')
            console.log(column)
            return Number(item[column.property])
          });
          // console.log('$$+++++++++++++++')
          //   console.log(values)
          //   console.log(data)
          //   console.log('+++++++++++++++')

          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);

            sums[index] += ' 元';
          } else {

            sums[index] = 'N/A';
          }
        });

        return sums;
      },
    getSummaries(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = "合计：";
            return;
          }
          const values = data.map(item => {
            // if(column.property == 'amountBill'){
            //   return Number(item.manhourBill * item.priceBill)
            // }
            if (isNaN(Number(item[column.property]))) {
              if (data.wfStatus == '待审核') {
                return Number(item['amount'])
              } else {
                return Number(item[column.property])
              }

            }
            return Number(item[column.property])
          })
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {

                return prev + curr;
              } else {
                return prev;
              }
            }, 0);

            sums[index] = toFixed1(sums[index])
            if(column.property == 'manhourBill'){
              sums[index] = sums[index]
            }else{
              sums[index] = "￥ " + sums[index]
            }

          }
        });
        return sums
      },
    delCao(list, index){
      if(list.length == 1){
        this.$message.error('数据不能为空！')
        return
      }
      list.splice(index, 1)
    },
    addTableList(list, f) {
      if (list) {
        list.push({
          agentNum:list[0].agentNum,
          caseId:list[0].caseId,
          manhourBill:1
        })
      } else {
        this.$set(this, f, [{}])
      }
      this.$nextTick(() => {
        this.$commonUtils.scrollToBottom(document.querySelector('.el-table__body-wrapper'))
      })
    },
    // delTableList(list, f) {
    //   if (!list.length) {
    //     this.$message.error('无数据')
    //     return
    //   }
    //   if (!this.$refs[f].selection.length) {
    //     this.$message.error('请选择数据')
    //     return
    //   }
    //   this.$refs[f].selection.forEach(item => {
    //     let idx = list.findIndex(i => i == item);
    //     list.splice(idx, 1)
    //   })
    // },
    queryBillTypeTree(){
        queryClassTree({classId:1185}).then(res=>{
          const list = res.data[1185] || []
          const formatData = list.map((item)=>{
            return {
              typeName:item.typeName,
              id:item.id,
              childrens:item.childrens
            }
          })
          this.typeTreeList = formatData
        })
      },
    addBillRecord(){
      addBillRecord({billRecords: this.dataarr}).then(res=>{
        this.$message.success(res.message);
        this.handleClose(true)
      })
    },
    getBilldetail() {
      const type = this.$route.params && this.$route.params.type || this.openType;
      this.type=type
      if (this.isPatentFee) {
        this.dataarr = this.billRecordList
        return
      }
      if(!this.openType){
        if (type === "creat") {
          this.$route.meta.title = "创建草单";
        } else if (type === "edit") {
          this.$route.meta.title = "修改草单";
        } else {
          this.$route.meta.title = "查看草单";
        }
      }
      let id = this.$route.params && this.$route.params.id || String(this.financeBillRecordId);
      if(type !== "creat"){
        queryBillRecordListByBillRecordIds({
          billRecordIds: id.split('&'),
          propertiesArray: ['tobillStatusStr','chargeItemId', 'agentNum','caseId', 'feeKind', 'descriptionCn', 'descriptionEn', 'manhourBill', 'priceBill', 'amountBill', 'referDate', 'yearNo', 'billStyle','feeKindNameString','billStyleName']
        }).then(res=>{
          this.dataarr = res.data
          if(this.dataarr.length&&this.dataarr[0].billStyle){
             this.dataarr[0].billTypeIds = this.$commonUtils.getTwoDimensionalArray(this.typeTreeList,'id', this.dataarr[0].billStyle )
          }
        })
        // queryBillRecordcdUrl({ billRecordId: id }).then(res => {
        //   // this.data = res.data;
        //   // this.dataarr = [];
        //   this.dataarr = [{...res.data}];
        // });
      }else {
        let data = {}
        data.agentNum=this.$route.query.agentNum
        data.caseId=id
        data.manhourBill=1
        this.dataarr = [];
        this.dataarr.push(data);
      }
    },
    getallSelectdata() {
      // queryPayAcountUrl().then(res => {
      //   this.selectData.yhData = res.data;
      // });
      // queryCurrencyUrl().then(res => {
      //   this.selectData.bzData = res.data;
      // });
    },

    fwfinputchange(val,row) {
      if (val != "") {
        queryChargeItemBynameCnUrl({ nameCn: val,caseId: row.caseId, chargeType: row.feeKind,caodan: 1 }).then(res => {
          this.gridData = res.data;
        });
      }
    },
    fwtableClick(row, mainRow) {
      this.$set(mainRow, 'chargeItemId', row.chargeItemId)
      this.$set(mainRow, 'descriptionCn', row.nameCn)
      this.$set(mainRow, 'descriptionEn', row.nameEN)
      this.$set(mainRow, 'priceBill', row.realPrice || row.price)
      this.$set(mainRow, 'yearNo', row.yearNo)
      this.$set(mainRow, 'billStyle', row.billStyle)
      mainRow.amountBill = mainRow.priceBill * (mainRow.manhourBill || 1)
      mainRow.yearNo && (
        mainRow.descriptionEn = mainRow.descriptionEn.replace(/(Xth)(-year)/, ($, $1, $2)=>{
          switch (mainRow.yearNo) {
            case 1:
              return $1 = '1st' + $2;
            case 2:
              return $1 = '2nd' + $2;
            case 3:
              return $1 = '3rd' + $2;
            default:
              return mainRow.yearNo + 'th' + $2

          }
        }),
        mainRow.descriptionCn = mainRow.descriptionCn + `(第${mainRow.yearNo}年)`
      )
      this.zfPopShow=false
    },
    validator(){
      if(this.dataarr.filter(item=>item.tobillStatusStr != '已核销').find(item => !item.feeKind)){
        this.$message.error('请选择费用种类!')
        return false
      }
      if(this.dataarr.find(item => !item.priceBill && item.priceBill !== 0)){
        this.$message.error('请填写单价!')
        return false
      }
      return true;
    },
    handleClose(search){
      if(this.openType){
        this.$emit('closeDialog', {search, billRecordId: [this.financeBillRecordId]})
      }else{
        this.$router.go(-1)
      }
    },
    sunmitBill() {
      if(!this.validator())return;
      if(this.$route.params.type === 'creat' || this.openType === 'creat'){
        this.addBillRecord()
        return
      }
      // delete this.data.billCost;
      // delete this.data.billRecords;
      if(this.$route.query.copyByCase || this.copyTraw){
        if(!this.caseIdList.filter(Boolean).length){
          this.$message.error('请输入案件文号！')
          return;
        }else{
          let list = []
          this.caseIdList.forEach(caseId=>{
            this.dataarr.forEach(item=>{
              list.push({
                caseId: caseId,
                feeKind: item.feeKind,
                descriptionCn: item.descriptionCn,
                descriptionEn: item.descriptionEn,
                manhourBill: item.manhourBill,
                priceBill: item.priceBill,
                amountBill: item.amountBill,
                yearNo: item.yearNo,
                chargeItemId: item.chargeItemId,
                billTypeIds:item.billTypeIds
              })
            })
          })
          this.dataarr = list
        }
      }
      this.dataarr.forEach((item)=>{
        if(item.billTypeIds&&item.billTypeIds.length){
          item.billStyle = item.billTypeIds[item.billTypeIds.length - 1]
        }
        delete item.billTypeIds
      })
      let opt = this.$route.query && this.$route.query.opt || this.opt
      updateBillRecordUrl({billRecords: this.dataarr, opt: +opt }).then(res => {
        this.$message.success(res.message);
        if(this.openType){
          this.handleClose(true)
        }else{
         if(this.seeCase){
            this.handleClose()
          }else{
            this.$router.push({
              name: "bill",
              params: {
                pagetype: "third"
              }
            });
          }
        }
      });
    }
  },

  mounted() {}
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.createPost-container {
  position: relative;
  // padding: 10px 2px;
  // border: 1px solid #d7d7d7;
  // margin: 15px 20px;
  min-height: 800px;
  .step-div {
    padding: 20px 65px;
  }
  /deep/ .el-tabs__header {
    margin-bottom: 2px;
  }
  /deep/ .el-collapse-item__header {
    display: block;
    text-align: center;
    background: #f5f5f5;
    height: 35px;
    line-height: 35px;
  }
  /deep/ .el-collapse-item__content {
    padding: 0px;
  }

  .fg-div {
    height: 20px;
    background: #e4e4e4;
  }
  .tilteSpan {
    font-size: 18px;
    padding: 15px 0px;
    color: #7199d5;
  }
  /deep/ .el-step {
    cursor: pointer;
  }
}
.table-dl-row {
  /deep/ thead,
  /deep/ th,
  /deep/ .el-table__header-wrapper,
  /deep/ .el-table__header,
  /deep/ tr,
  /deep/ td,
  /deep/ .el-select,
  /deep/ .el-input,
  /deep/ .el-input__inner {
    padding: 0px !important;
    height: 35px !important;
    line-height: 35px !important;
  }
  /deep/ td {
    background-color: #ffffff !important;
  }
  /deep/ .el-input__inner,
  /deep/ .el-select {
    width: 100% !important;
  }
}
/deep/ .cell {
  padding: 5px 5px !important;
}
.form-border {
  /deep/ .el-form-item__error {
    position: relative !important;
    top: 0;

  }
  /deep/ .el-row {
    margin: 0px;
  }
  /deep/ .postInfo-container-item {
    width: 100%;
  }

  /deep/ .el-form-item__label {
    background-color: #f9f9f9;
    width: 36.7%;
    text-align: right;
  }

  /deep/ .el-form-item {
    border-right: 1px solid #d7d7d7;
    margin: 0px !important;
  }
  /deep/ .el-row {
    border-bottom: 1px solid #d7d7d7;
    border-left: 1px solid #d7d7d7;
  }
  /deep/ .el-input,
  /deep/ .el-select {
    width: 77%;
  }

  /deep/ td .el-input,
  /deep/ td .el-select {
    width: 100%;
  }

  /deep/ .el-form-item__content {
    text-align: left;
    word-break: break-word;
    // height: 30px;
  }
  .fullRow {
    /deep/ .el-form-item__label {
      width: 15%;
    }

    /deep/ .el-input,
    /deep/ .el-select {
      width: 30%;
    }
  }
  /deep/ .el-input__inner {
    // border: none;
  }
  /deep/ .el-select .el-input {
    width: 100%;
  }
  /deep/ td .el-select,
  /deep/ td .el-input,
  /deep/ td .el-input__inner {
    // border: 0px !important;
  }
  .postInfo-container-item {
    display: flex;
    width: 100%;
    /deep/ .el-form-item__content {
      text-align: left;
      display: inline-table;
      width: 85%;
      padding: 5px 15px;
    }

    /deep/ .el-form-item__label {
      line-height: 43px;
    }
  }
  // border-top: 1px solid #d7d7d7;
  // border-left: 1px solid #d7d7d7;
  // border-bottom: 1px solid #d7d7d7;
}
/deep/ .el-table__header tr,
/deep/ .el-table__header th {
  padding: 0;
  height: 30px;
  background: #f5f5f5;
}
/deep/ .el-table__body tr,
/deep/ .el-table__body td {
  padding: 0;
  height: 40px;
}
/deep/ .el-step {
  cursor: pointer;
}
.upload-btn {
  display: inline-block;
}
/deep/ .el-table /deep/ .warning-row {
  background: #dd7a7a;
  color: white;
}
.redClass {
  color: #dd7a7a;
}
.greenClass {
  color: rgb(49, 165, 49);
}
.tmCmsearch {
  /deep/ .el-select .el-input {
    width: 130px;
  }
  /deep/ .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
}
.billallPice {
  text-align: right;
  border-left: none;
  margin-top: 10px;
  font-size: 14px;
  font-weight: 400;
  color: #333333;
  margin-bottom: 10px;
}
.piceSpan {
  font-weight: 700;
  font-style: normal;
  font-size: 28px;
  color: #ff6600;
}
.billtotalspan {
  margin-left: 20px;
}
/deep/ .el-input-number--medium {
  width: 120px;
}
  .handle {

    color: #409EFF;
    cursor: pointer;

    }
  .searchfullRow {
    .searchcol {
      padding-right: 3%;
    }
    /deep/ .el-form-item__label {
      width: 25%;
    }
    /deep/ .el-form-item__content {
      width: 75%;
    }
    /deep/ .el-form-item {
      width: 100%;
    }
    /deep/ .el-input,
    /deep/ .el-select {
      width: 100%;
    }
  }
  .tables{
    div{
      border: 1px solid #ccc;
      border-top: none;
      text-align: center;
    }
  }
   .table-head{
    text-align: center;
    background-color: #f7f7f7;
     cursor: not-allowed!important;
  }
   >>>.el-textarea__inner{
        word-break: keep-all;
  }
  >>> .el-autocomplete-suggestion{
    width: 500px!important;
  }
   .overflow-hidden{
      overflow:hidden;
      width: 100%;
      display:inline-block;
      text-overflow:ellipsis;
      white-space:nowrap;
      word-break: break-all;
    }
  /* 在Chrome浏览器下 */
  /deep/ input::-webkit-outer-spin-button,
  /deep/ input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  /* 在Firefox浏览器下 */
  /deep/ input[type="number"]{
    -moz-appearance: textfield;
  }
</style>
