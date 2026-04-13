<template>
  <div class="createPost-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="内部账单信息" name="first">
        <el-form ref="postForm" :model="data" size="small" :rules="rules" class="form-container">
          <div>
            <div class="form-con">

              <el-row>
                <el-col class="form-con-item" :span="24">
                  <el-row class="form-border">
                    <el-col :span="24">

                      <el-row class="fullRow">
                        <el-col :span="24">
                          <el-form-item label="案件文号:" class="postInfo-container-item">
                            <template>
                              <span>{{data.showrefno}}</span>
                            </template>
                          </el-form-item>
                        </el-col>

                      </el-row>
                      <el-row class="fullRow">
                        <el-col :span="24">
                          <el-form-item label="案件类型:" class="postInfo-container-item">
                            <template>
                              <span>{{data.caseTypeIdString}}</span>
                            </template>
                          </el-form-item>
                        </el-col>

                      </el-row>
                      <el-row class="fullRow">
                        <el-col :span="24">
                          <el-form-item label="内部账单号:" class="postInfo-container-item">
                            <template>
                              <span>{{data.billinterno}}</span>
                            </template>
                          </el-form-item>
                        </el-col>

                      </el-row>
                      <el-row>
                        <el-col :span="12">
                          <el-form-item label="客户:" class="postInfo-container-item">
                            <template>
                              <span>{{data.custIdString}}</span>
                            </template>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">

                          <el-form-item label="客户文号:" class="postInfo-container-item">
                            <template>
                              <span>{{data.custRefno}}</span>
                            </template>
                          </el-form-item>
                        </el-col>

                      </el-row>
                      <el-row class="">
                        <el-col :span="12">
                          <el-form-item label="承办组(所属工作组):" prop="costwkgid" class="postInfo-container-item">
                            <template>
                              <span v-if="detailType==='view'">{{data.costWkgIdString}}</span>
                              <el-select v-else default-first-option :clearable='true' @change="cbChange" v-model="data.costwkgid" no-match-text='暂无数据' loading-text='正在查询' filterable remote reserve-keyword
                                placeholder="请输入关键词" :remote-method="(v) => {remotepaternalGzz(v, 'cb')}">
                                <el-option v-for="(item,key) in selectData.gzzselect" :key="key" :label="item.groupName" :value="item.wkgId">
                                </el-option>
                              </el-select>
                            </template>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="客户组:" prop="wkgid" class="postInfo-container-item">
                            <template>
                              <span v-if="detailType==='view'">{{data.wkgidString}}</span>
                              <el-select v-else default-first-option :clearable='true' v-model="data.wkgid" no-match-text='暂无数据' loading-text='正在查询' filterable remote reserve-keyword placeholder="请输入关键词"
                                :remote-method="(v) => {remotepaternalGzz(v, 'kh')}">
                                <el-option v-for="(item,key) in selectData.khzselect" :key="key" :label="item.groupName" :value="item.wkgId">
                                </el-option>
                              </el-select>
                            </template>
                          </el-form-item>
                        </el-col>

                      </el-row>
                      <el-row class="fullRow">
                        <el-col :span="24">
                          <el-form-item label="所属部门:" prop="caseDesc" class="postInfo-container-item">
                            <template>

                              <span>{{data.deptname}}</span>
                            </template>
                          </el-form-item>
                        </el-col>

                      </el-row>
                      <el-row>
                        <el-col :span="12">
                          <el-form-item label="发生日期:" class="postInfo-container-item">
                            <template>
                              <span v-if="detailType==='view'">{{data.begindate}}</span>
                              <el-date-picker v-else v-model="data.begindate" format='yyyy-MM-dd' value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">
                              </el-date-picker>
                            </template>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">

                          <el-form-item label="结束日期:" class="postInfo-container-item">
                            <template>
                              <span v-if="detailType==='view'">{{data.enddate}}</span>
                              <el-date-picker v-else v-model="data.enddate" format='yyyy-MM-dd' value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">
                              </el-date-picker>
                            </template>
                          </el-form-item>
                        </el-col>

                      </el-row>

                      <el-row>
                        <el-col :span="12">
                          <el-form-item label="开单人:" class="postInfo-container-item">
                            <template>
                              <span v-if="detailType==='view'">{{data.reimburseUserIdString}}</span>
                              <el-select v-else default-first-option :clearable='true' v-model="data.reimburseuserid" no-match-text='暂无数据' loading-text='正在查询' filterable remote reserve-keyword
                                placeholder="请输入关键词" :remote-method="remotepaternalkdr">
                                <el-option v-for="(item,key) in selectData.kdrSelect" :key="key" :label="item.fullname" :value="item.userId">
                                </el-option>
                              </el-select>
                            </template>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">

                          <el-form-item label="开单日期:" class="postInfo-container-item">
                            <template>
                              <span v-if="detailType==='view'">{{data.fillindate}}</span>
<!--                              <span v-show="false">{{data.fillindate?data.fillindate:data.fillindate=getNowFormatDate()}}</span>-->
                              <el-date-picker v-else v-model="data.fillindate" format='yyyy-MM-dd' value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">
                              </el-date-picker>

                            </template>
                          </el-form-item>
                        </el-col>

                      </el-row>
                      <el-row>
                        <el-col :span="12">
                          <el-form-item label="所属月:" class="postInfo-container-item">
                            <template>
                              <span v-if="detailType==='view'">{{data.belongtodate}}</span>
                              <el-date-picker v-else v-model="data.belongtodate" format='yyyy-MM-dd' value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">
                              </el-date-picker>
                            </template>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">

                        </el-col>

                      </el-row>
                      <el-row>
                        <el-col :span="12">
                          <el-form-item label="收单人:" class="postInfo-container-item">
                            <template>
                              <span v-if="detailType==='view'">{{data.receiveUserIdString}}</span>
                              <el-select v-else default-first-option :clearable='true' v-model="data.receiveuserid" no-match-text='暂无数据' loading-text='正在查询' filterable remote reserve-keyword placeholder="请输入关键词"
                                :remote-method="remotepaternalkdr">
                                <el-option v-for="(item,key) in selectData.kdrSelect" :key="key" :label="item.fullname" :value="item.userId">
                                </el-option>
                              </el-select>
                            </template>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="总金额:" prop="total" class="postInfo-container-item">
                            <template>
                              <!-- <el-input v-model="data.total" placeholder=""></!-->
                              <span>{{data.total}}</span>
                            </template>
                          </el-form-item>
                        </el-col>

                      </el-row>
                      <el-row class="fullRow">
                        <el-col :span="24">
                          <el-form-item label="填报人:" class="postInfo-container-item">
                            <template>
                              <span>{{data.fillinUserIdString?data.fillinUserIdString:name}}</span>
                            </template>
                          </el-form-item>
                        </el-col>

                      </el-row>
                      <el-row>
                        <el-col :span="12">
                          <el-form-item label="核销状态:" class="postInfo-container-item">
                            <template>
                              <span>{{data.tobillStatusString}}</span>
                            </template>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">

                          <el-form-item label="核销日期:" class="postInfo-container-item">
                            <template>
                              <span>{{data.tobilldate}}</span>
                            </template>
                          </el-form-item>
                        </el-col>

                      </el-row>
                      <el-row class="fullRow">
                        <el-col :span="24">

                          <el-form-item label="备注:" class="postInfo-container-item">
                            <template>
                              <span v-if="detailType==='view'">{{data.remarks}}</span>
                              <el-input v-else type="textarea" :rows="3" v-model="data.remarks" placeholder="请输入">
                              </el-input>
                            </template>
                          </el-form-item>

                        </el-col>
                      </el-row>
                      <el-row class="fullRow">
                        <el-col :span="24" style="text-align:right">

                          <el-button v-if="detailType!=='view'" size="medium" @click="addbillInternalDetailsListitem" type="primary">添加
                          </el-button>
                        </el-col>
                      </el-row>

                      <el-table size="mini" :data="data.billInternalDetailsList" border fit empty-text="暂无数据" current-row-key style="width: 100%;">
                        <el-table-column type="index" width="50" label="序号" align="left"></el-table-column>
                        <el-table-column label="内部账单种类" align="left" width='130'>
                          <template slot-scope="scope">
                            <span v-if="detailType==='view'">{{scope.row.interKindString}}</span>
                            <el-select v-else :clearable='true' @change="(e)=>changeInterKind(e,scope.row)" v-model="scope.row.interkind"  filterable
                                       placeholder="请输入关键词" >
                              <el-option v-for="(item,key) in interKindList" :key="key" :label="item.label" :value="item.value">
                              </el-option>
                            </el-select>
      <!--                        <span>{{scope.row.interKindString}}</span>-->
                          </template>
                        </el-table-column>
                        <el-table-column label="内部账单描述" align="left">
                          <template slot-scope="scope">
                            <span v-if="detailType==='view'">{{scope.row.intername}}</span>

                            <el-popover class="inputshow"  placement="bottom" trigger="click">

                              <el-table size="mini" @row-click='((val)=>{fwtableClick(val, scope.row)})' :data="gridData" style='height:250px;overflow: scroll;'>
                                <el-table-column width="200" property="nameCn" label="费用描述（中文）"></el-table-column>
                                <el-table-column width="300" property="nameEN" label="费用描述英文"></el-table-column>
                                <el-table-column width="100" property="caseType" label="案件类型"></el-table-column>
                                <el-table-column width="100" property="appFromto" label="申请方向"></el-table-column>
                                <el-table-column width="100" property="price" label="定价"></el-table-column>
                              </el-table>
                              <el-input v-if="detailType!=='view'" slot="reference" @input="fwfinputchange" v-model="scope.row.intername">
                              </el-input>
                            </el-popover>

                          </template>
                        </el-table-column>

                        <el-table-column label="数量" align="left" width='130'>
                          <template slot-scope="scope">
                            <span v-if="detailType==='view'">{{scope.row.number}}</span>

                            <el-input v-else type="number" size="medium" @change="((val)=>{numberchange(val, scope.row)})" v-model="scope.row.number" :min="0">
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column label="单价" align="left" width='130'>
                          <template slot-scope="scope">
                            <span v-if="detailType==='view'">{{scope.row.unitprice}}</span>

                            <el-input type="number" v-else size="medium" @change="((val)=>{djchange(val, scope.row)})" v-model="scope.row.unitprice" >
                            </el-input>

                          </template>
                        </el-table-column>
                        <el-table-column label="金额" align="left" width>
                          <template slot-scope="scope">
                            <span>{{ scope.row.amount }}</span>
                          </template>
                        </el-table-column>
                        <el-table-column v-if="detailType!=='view'" label="操作" align="left" width>
                          <template slot-scope="scope">
                            <el-button size="medium" type="text" @click="handledeleElement(scope.row,scope.$index)">删除</el-button>
                          </template>
                        </el-table-column>

                      </el-table>

                    </el-col>

                  </el-row>
                </el-col>

              </el-row>
              <el-row style="margin-top:40px">
                <el-col :span="24" style="text-align:center">
                  <template v-if="detailType!=='view'">
                    <el-button size="medium" v-if='!($route.params.type==="see")'  v-show="data.taskNo>1" @click="sunmitBill(1)" type="primary">审核
                    </el-button>
                    <el-button size="medium" v-if='!($route.params.type==="see")'  v-show="data.taskNo>1" @click="sunmitBill(0)" type="primary">退回
                    </el-button>
                    <el-button size="medium" v-if='!($route.params.type==="see")'  v-show="data.taskNo==1||$route.params.type==='creat'"  @click="sunmitBill(1)" type="primary">确定
                    </el-button>
                    <el-button size="medium" v-if='!($route.params.type==="see")' v-show="data.taskNo!=1||$route.params.type==='edit'" @click="sunmitBill(3)" type="primary">保存
                    </el-button>
                  </template>
                  <template v-else>
                    <el-button style="margin-left:50px" type="" @click="cancel(false)" size="medium">关闭</el-button>
                  </template>

                </el-col>

              </el-row>
            </div>

          </div>

        </el-form>
      </el-tab-pane>
      <el-tab-pane label="内部账单流程" name="second">
        <el-table :data="progressData" style="width: 98%">
          <el-table-column
            :prop="item.prop"
            :label="item.label"
            v-for="item in progressColumn"
          >
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>


  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  queryBillInternalUrl,
  queryChargeItemBynameCnUrl,
  queryWorkgroupUrl,
  querywfUserNameUrl,
  updateBillInternalUrl,
  singleSubmitBillInternalUrl ,
  queryBillTaskRecord
} from "@/api/billApi";

export default {
  name: "",
  components: {},
  computed: {
    ...mapGetters(["name", "roles", "userId"])
  },
  props: {
    dialogType: {
      type: String,
      default: ''
    },
    pageBillId: {
      type: [String, Number],
      default: ''
    },
    isFinance: {
      type: Boolean,
      default: false
    },
    detailType: {
      type: String,
      default: ''
    },
  },
  created() {
    if (!this.isFinance){
      this.pageType = this.$route.params && this.$route.params.type
      this.billId = this.$route.params && this.$route.params.id
    }else{
      this.billId = this.pageBillId
      this.pageType = this.detailType
    }
    this.getallSelectdata();
    this.getBilldetail();
  },
  data() {
    return {
      billId: '',
      pageType: 'creat',
      progressColumn: [{prop: 'progressName', label: '任务名称'}, {prop: 'status', label: '任务状态'}, {
          prop: 'tasker',
          label: '任务人'
        }, {prop: 'createTime', label: '创建时间'}, {prop: 'result', label: '任务执行结果'}, {
          prop: 'returnReason',
          label: '退回原因'
        }],
      progressData: [],
      activeName: 'first',
      rules: {
        costwkgid: [
          { required: true, message: "请选择承办组", trigger: "change" }
        ],
        wkgid: [{ required: true, message: "请选择客户组", trigger: "change" }],
        total: [{ required: true, message: "请填写总金额", trigger: "blur" }]
      },
      gridData: [],
      interKindList:[{label:'服务费',value:1},{label:'官费',value:2},{label:'杂费',value:3}],
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
      data: {},
      selectData: {
        bzData: [],
        yhData: [],
        ygData: [],
        lxrData: [],
        dzData: [],
        gzzselect: [],
        kdrSelect: [],
        khzselect: []
      },
      currencySymbol: ""
    };
  },

  watch: {},

  methods: {
    changeInterKind(e,row){
      if(e){
        row.interKindString = this.interKindList.find(item=>item.value==e).label
      }else{
        row.interKindString=null
      }
    },
    addbillInternalDetailsListitem() {
      let item = {
        billinterid: this.data.billinterid,
        interKindString: "服务费",
        intername: "",
        number: 1,
        unitprice: 0,
        amount: 0,
        interkind: "1"
      };
      this.data.billInternalDetailsList.unshift(item);
      this.getTotal();
    },
    handledeleElement(item, index) {
      this.$confirm("此操作将删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.data.billInternalDetailsList.splice(index, 1);
          this.getTotal();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    getBilldetail() {
      const type = this.pageType;
      if (!this.isFinance) {
        if (type === "creat") {
          this.$route.meta.title = "创建内部账单";
        } else if (type === "edit") {
          this.$route.meta.title = "修改内部账单";
        } else {
          this.$route.meta.title = "查看内部账单";
        }
      }
      const id = this.billId;
      queryBillInternalUrl({ billInternalId: id }).then(res => {
        this.data = res.data;
        queryBillTaskRecord({
          typeId:15,
          id: this.data.billinterid
        }).then(res=>{
          this.progressData = res.data
        })

        queryWorkgroupUrl({
          wkgIdArray: [this.data.costwkgid, this.data.wkgid]
        }).then(res => {
          this.selectData.gzzselect = JSON.parse(JSON.stringify(res.data));
          this.selectData.khzselect = JSON.parse(JSON.stringify(res.data));
        });
        querywfUserNameUrl({
          userIdArray: [this.data.reimburseuserid, this.data.receiveuserid]
        }).then(res => {
          this.selectData.kdrSelect = res.data;
        });
      });
    },
    getallSelectdata() {
      // queryPayAcountUrl().then(res => {
      //   this.selectData.yhData = res.data;
      // });
      // queryCurrencyUrl().then(res => {
      //   this.selectData.bzData = res.data;
      // });
    },
    remotepaternalGzz(val, type) {
      queryWorkgroupUrl({ groupName: val }).then(res => {
        type === 'cb' && (this.selectData.gzzselect = res.data);
        type === 'kh' && (this.selectData.khzselect = res.data);
      });
    },
    remotepaternalkdr(val) {
      querywfUserNameUrl({ fullname: val }).then(res => {
        this.selectData.kdrSelect = res.data;
      });
    },
    fwfinputchange(val) {
      if (val != "") {
        queryChargeItemBynameCnUrl({ nameCn: val }).then(res => {
          this.gridData = res.data;
        });
      }
    },
    fwtableClick(row, mainRow) {
      const index = this.data.billInternalDetailsList.indexOf(mainRow);
      this.data.billInternalDetailsList[index].unitprice = row.price;
      this.data.billInternalDetailsList[index].intername = row.nameCn;
      this.data.billInternalDetailsList[index].amount =
        this.data.billInternalDetailsList[index].unitprice *
        this.data.billInternalDetailsList[index].number;
      this.getTotal()
     // row.fwfPopShow=false
    },
    cbChange(val) {
      let e;
      this.selectData.gzzselect.forEach(ele => {
        if (ele.wkgId === val) {
          e = ele;
        }
      });
      this.data.deptname = e.depName;
      this.data.deptid = e.deptId;
    },
    sunmitBill(result) {
      const type = this.pageType;
      this.$refs["postForm"].validate(valid => {
        if (valid) {
          if (result === 3) {

            delete this.data.billCost;
            delete this.data.billRecords;
            updateBillInternalUrl(this.data).then(res => {
              this.$message.success(res.message);
              this.cancel(true)
              // this.$router.push({
              //   name: "bill",
              //   params: {
              //     pagetype: "second"
              //   }
              // });
            });
          } else  {
            delete this.data.billCost;
            delete this.data.billRecords;
            this.data.result=result
            this.data.taskIdList = this.data.taskId;
            this.data.fillinuserid = this.userId;
            singleSubmitBillInternalUrl(this.data).then(res => {
              this.$message.success(res.message);
              this.cancel(true)
              // this.$router.push({
              //   name: "bill",
              //   params: {
              //     pagetype: "second"
              //   }
              // });
            });
          }
        } else {
          this.$message.error("请填写必填项");
          return false;
        }
      });
    },
    cancel(search){
      if (!this.isFinance){
        this.$router.go(-1)
      } else {
        this.$emit('closeBillDialog',{search, billinterid: this.data.billinterid}) // 关闭父级弹框
      }
    },
    numberchange(val, row) {
      const index = this.data.billInternalDetailsList.indexOf(row);
      this.data.billInternalDetailsList[index].amount =
        this.data.billInternalDetailsList[index].unitprice * val;
      this.getTotal();
    },
    djchange(val, row) {
      const index = this.data.billInternalDetailsList.indexOf(row);
      this.data.billInternalDetailsList[index].amount =
        this.data.billInternalDetailsList[index].number * val;
      this.getTotal();
    },
    getTotal() {
      let num = 0;
      this.data.billInternalDetailsList.forEach(element => {
        num += Number(element.amount);
      });
      this.data.total = num;
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
