<template>
    <div class="expenditure" :style="{'left':left+'px','top':top+'px','position':position,'padding':'10px'}">
      <header>
       {{titleStr}}—费用支出记录明细
        <i class="el-icon-close close" @click="$emit('closeExpenditureDetails')" v-if="orderAmount!=1"></i>
      </header>
      <template  v-if="orderAmount!=1">
        <el-table
          :data="dataList"
          height="800"
          border
          :cell-class-name="cellClassName"
        >
          <el-table-column
            label="序号"
            type="index"
            width="50"
            align="left">
          </el-table-column>
          <el-table-column :resizable="false" v-for="(item,index) in titleList" :key="index" :label="String(item.title)" :prop="item.value" align="left">
            <template slot="header" slot-scope="scope" >
              <span>{{item.title}}</span>
                <img v-show="!checkFilterList[index]&&dataList.length" @click.stop="setFilterItem(index)" src="@/assets/u600.png" alt=""
                     v-if="['费用类型','费用科目'].includes(item.title)"/>
                <img v-show="checkFilterList[index]&&dataList.length" @click.stop="setFilterItem(index)" src="@/assets/filter@2x.png" alt=""
                     v-if="['费用类型','费用科目'].includes(item.title)"/>
                <div class="checkboxs" v-if="checkFilterList[index]" v-clickoutside="handleOut">
                  <div class="filter_content" >
                    <div class="search_warp" v-if="index==1">
                      <el-input type="text" v-model="filterText" @keyup.enter.native="filterTextFeeName"></el-input><el-button type="text" icon="el-icon-search" @click="filterTextFeeName"></el-button>
                    </div>
                    <el-checkbox-group v-model="filterData[item.value]" @change="(e)=>checkboxGroup(e,item.value)">
                      <el-checkbox label="全选"></el-checkbox>
                      <el-checkbox :label="itm" v-for="itm in filterData[item.value+'List'].filter(i=>i.includes(filterFeeName))"></el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <p class="checkAll" >
                    <!--<span @click="checkAllOrNot(item.value)">全选</span>-->
                    <el-button @click="filterDataChange" size="mini" type="primary">确定</el-button><el-button size="mini" @click="setFilterItem(index)">取消</el-button>
                  </p>
                </div>
              </template>
            <template slot-scope="scope">
              <el-popover
                placement="right"
                width="400"
                trigger="click"
                v-if="item.value!='feeName'&&item.value!='feeType'&&scope.row['feeType']=='预算'&&scope.row[item.value]">
                <el-form ref="form" label-width="80px"  v-if="scope.row.budgetData">
                  <el-form-item label="原始预算:" v-if="scope.row.budgetData.find(item=>item.budgetType=='预算')">
                    <div class="border_warp">
                      {{scope.row.budgetData.find(item=>item.budgetType=='预算').amount}}
                    </div>
                  </el-form-item>
                  <el-form-item label="增加预算:" v-if="scope.row.budgetData.find(item=>item.budgetType=='增加预算')">
                    <div class="border_warp">
                      {{scope.row.budgetData.find(item=>item.budgetType=='增加预算').amount}}
                    </div>
                  </el-form-item>
                  <el-form-item label="追加预算:" v-if="scope.row.budgetData.find(item=>item.budgetType=='追加预算')">
                    <div class="border_warp">
                      {{scope.row.budgetData.find(item=>item.budgetType=='追加预算').amount}}
                    </div>
                  </el-form-item>
                  <el-form-item label="调整:" v-if="scope.row.budgetData.find(item=>item.budgetType=='调整预算')">
                    <div class="border_warp">
                      {{scope.row.budgetData.find(item=>item.budgetType=='调整预算').amount}}
                    </div>
                  </el-form-item>
                </el-form>
                <div slot="reference" > <img style="cursor: pointer;width: 17px;height: 17px"  src="@/assets/预算.png" alt="" @click="queryChangedBudget(scope)">{{scope.row[item.value]}}</div>
              </el-popover>
              <div v-else>{{scope.row[item.value]|formatAmount}}</div>
            </template>
          </el-table-column>
        </el-table>
        <el-collapse v-model="activeNames" >
        <el-collapse-item title="无费用" name="1">
          <el-table
            :data="noAmountList"
            height="800"
            border
            :cell-class-name="cellClassName"
          >
            <el-table-column
              label="序号"
              type="index"
              width="50"
              align="left">
            </el-table-column>
          <el-table-column :resizable="false" v-for="(item,index) in titleList" :key="index" :label="String(item.title)" :prop="item.value" align="left">
            <template slot="header" slot-scope="scope" >
              <span>{{item.title}}</span>
            </template>
            <template slot-scope="scope">
              <div> {{scope.row[item.value]|formatAmount}}</div>
            </template>
          </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
      </template>
      <template v-if="orderAmount==1">
        <el-tabs type="border-card"  v-model="activetabsName">
          <el-tab-pane name="1" label="支出">
            <el-table
              v-if="activetabsName==1"
              :data="dataList.filter(item=>item.feeType=='支出')"
              height="600"
              border
              show-summary
              :summary-method="getSummaries"
              :cell-class-name="cellClassName"
            >
              <el-table-column
                label="序号"
                type="index"
                width="50"
                align="left">
              </el-table-column>
              <el-table-column :sortable="item.value!='feeName'&&item.value!='feeType'" :resizable="false" v-for="(item,index) in titleList.filter(i=>i.value!='feeType')" :key="index" :label="String(item.title)" :prop="item.value" align="left">
                <template slot="header" slot-scope="scope">
                  <span>{{item.title}}</span>
                  <img v-show="!checkFilterList[index]&&dataList.length" @click.stop="setFilterItem(index)" src="@/assets/u600.png" alt=""
                       v-if="['费用类型','费用科目'].includes(item.title)"/>
                  <img v-show="checkFilterList[index]&&dataList.length" @click.stop="setFilterItem(index)" src="@/assets/filter@2x.png" alt=""
                       v-if="['费用类型','费用科目'].includes(item.title)"/>
                  <div class="checkboxs" @click.stop v-if="checkFilterList[index]" v-clickoutside="handleOut">
                    <div class="filter_content" >
                      <div class="search_warp" v-if="index==0">
                        <el-input type="text" v-model="filterText" @keyup.enter.native="filterTextFeeName"></el-input><el-button type="text" icon="el-icon-search" @click="filterTextFeeName"></el-button>
                      </div>
                      <el-checkbox-group v-model="filterData[item.value]" @change="(e)=>checkboxGroup(e,item.value)">
                        <el-checkbox label="全选"></el-checkbox>
                        <el-checkbox :label="itm" v-for="itm in filterData[item.value+'List'].filter(i=>i.includes(filterFeeName))"></el-checkbox>
                      </el-checkbox-group>
                    </div>
                    <p class="checkAll" >
                      <!--<span @click="checkAllOrNot(item.value)">全选</span>-->
                      <el-button @click="filterDataChange" size="mini" type="primary">确定</el-button><el-button size="mini" @click="setFilterItem(index)">取消</el-button>
                    </p>
                  </div>
                </template>
                <template slot-scope="scope">
                  <el-popover
                    placement="right"
                    width="400"
                    trigger="click"
                    v-if="item.value!='feeName'&&item.value!='feeType'&&scope.row['feeType']=='预算'&&scope.row[item.value]">
                    <el-form ref="form" label-width="80px"  v-if="scope.row.budgetData">
                      <el-form-item label="原始预算:" v-if="scope.row.budgetData.find(item=>item.budgetType=='预算')">
                        <div class="border_warp">
                          {{scope.row.budgetData.find(item=>item.budgetType=='预算').amount}}
                        </div>
                      </el-form-item>
                      <el-form-item label="增加预算:" v-if="scope.row.budgetData.find(item=>item.budgetType=='增加预算')">
                        <div class="border_warp">
                          {{scope.row.budgetData.find(item=>item.budgetType=='增加预算').amount}}
                        </div>
                      </el-form-item>
                      <el-form-item label="追加预算:" v-if="scope.row.budgetData.find(item=>item.budgetType=='追加预算')">
                        <div class="border_warp">
                          {{scope.row.budgetData.find(item=>item.budgetType=='追加预算').amount}}
                        </div>
                      </el-form-item>
                      <el-form-item label="调整:" v-if="scope.row.budgetData.find(item=>item.budgetType=='调整预算')">
                        <div class="border_warp">
                          {{scope.row.budgetData.find(item=>item.budgetType=='调整预算').amount}}
                        </div>
                      </el-form-item>
                    </el-form>
                    <span slot="reference"> <img style="cursor: pointer;width: 17px;height: 17px"  src="@/assets/预算.png" alt="" @click="queryChangedBudget(scope)">{{scope.row[item.value]}}</span>
                  </el-popover>
                  <div v-else > {{scope.row[item.value]|formatAmount}}</div>
                  <!--<span>{{scope.row[item.value]|formatAmount}}</span>-->
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane name="2" label="预算">
            <el-table
              v-if="activetabsName==2"
              :data="dataList.filter(item=>item.feeType=='预算')"
              height="600"
              border
              show-summary
              :summary-method="getSummaries"
              :cell-class-name="cellClassName"
            >
              <el-table-column
                label="序号"
                type="index"
                width="50"
                align="left">
              </el-table-column>
              <el-table-column :sortable="item.value!='feeName'&&item.value!='feeType'" :resizable="false" v-for="(item,index) in titleList.filter(i=>i.value!='feeType')" :key="index" :label="String(item.title)" :prop="item.value" align="left">
                <template slot="header" slot-scope="scope">
                  <span>{{item.title}}</span>
                  <img v-show="!checkFilterList[index]&&dataList.length" @click.stop="setFilterItem(index)" src="@/assets/u600.png" alt=""
                       v-if="['费用类型','费用科目'].includes(item.title)"/>
                  <img v-show="checkFilterList[index]&&dataList.length" @click.stop="setFilterItem(index)" src="@/assets/filter@2x.png" alt=""
                       v-if="['费用类型','费用科目'].includes(item.title)"/>
                  <div class="checkboxs" @click.stop v-if="checkFilterList[index]" v-clickoutside="handleOut">
                    <div class="filter_content" >
                      <div class="search_warp" v-if="index==0">
                        <el-input type="text" v-model="filterText" @keyup.enter.native="filterTextFeeName"></el-input><el-button type="text" icon="el-icon-search" @click="filterTextFeeName"></el-button>
                      </div>
                      <el-checkbox-group v-model="filterData1[item.value]" @change="(e)=>checkboxGroup1(e,item.value)">
                        <el-checkbox label="全选"></el-checkbox>
                        <el-checkbox :label="itm" v-for="itm in filterData1[item.value+'List'].filter(i=>i.includes(filterFeeName))"></el-checkbox>
                      </el-checkbox-group>
                    </div>
                    <p class="checkAll" >
                      <!--<span @click="checkAllOrNot(item.value)">全选</span>-->
                      <el-button @click="filterDataChange1" size="mini" type="primary">确定</el-button><el-button size="mini" @click="setFilterItem(index)">取消</el-button>
                    </p>
                  </div>
                </template>
                <template slot-scope="scope">
                  <el-popover
                    placement="right"
                    width="400"
                    trigger="click"
                    v-if="item.value!='feeName'&&item.value!='feeType'&&scope.row['feeType']=='预算'&&scope.row[item.value]">
                    <el-form ref="form" label-width="80px"  v-if="scope.row.budgetData">
                      <el-form-item label="原始预算:" v-if="scope.row.budgetData.find(item=>item.budgetType=='预算')">
                        <div class="border_warp">
                          {{scope.row.budgetData.find(item=>item.budgetType=='预算').amount}}
                        </div>
                      </el-form-item>
                      <el-form-item label="增加预算:" v-if="scope.row.budgetData.find(item=>item.budgetType=='增加预算')">
                        <div class="border_warp">
                          {{scope.row.budgetData.find(item=>item.budgetType=='增加预算').amount}}
                        </div>
                      </el-form-item>
                      <el-form-item label="追加预算:" v-if="scope.row.budgetData.find(item=>item.budgetType=='追加预算')">
                        <div class="border_warp">
                          {{scope.row.budgetData.find(item=>item.budgetType=='追加预算').amount}}
                        </div>
                      </el-form-item>
                      <el-form-item label="调整:" v-if="scope.row.budgetData.find(item=>item.budgetType=='调整预算')">
                        <div class="border_warp">
                          {{scope.row.budgetData.find(item=>item.budgetType=='调整预算').amount}}
                        </div>
                      </el-form-item>
                    </el-form>
                    <span slot="reference"> <img style="cursor: pointer;width: 17px;height: 17px"  src="@/assets/预算.png" alt="" @click="queryChangedBudget(scope)">{{scope.row[item.value]}}</span>
                  </el-popover>
                  <div  v-else>{{scope.row[item.value]|formatAmount}}</div>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </template>
    </div>
</template>

<script>
import { queryBudgetAndFeeDetail,queryChangedBudget } from '@/api/caseList'
import {formatAmount} from '@/utils/filters'
export default {
  props: {
    historyType:{
      default:''
    },
    deptId: {},
    month:{},
    top: {},
    left: {},
    position:{
      default:'absolute'
    },
    titleStr:{

    },
    monthRange:{
      default:()=>[]
    },
    orderAmount:{
      default: null
    }
  },
  data() {
    return {
      activetabsName:'1',
      activeNames:[],
      dataListDefault:[],
      dataList: [],
      noAmountList:[],
      titleList: [{'title': '费用类型', 'value': 'feeType'}, {'title': '费用科目', 'value': 'feeName' }],
      checkFilterList: [ false, false],
      filterData: { },
      filterData1:{},
      firstRequest: false,
      filterText:'',
      filterFeeName:''
    }
  },
  created(){
    if (this.month==13) {
      this.queryBudgetAndFeeDetail(this.deptId)
    } else {
      this.queryBudgetAndFeeDetail(this.deptId,this.month)
    }
  },
  name: "ExpenditureDetails",
  methods:{
    handleOut(index){
      this.checkFilterList=this.checkFilterList.map(item=>false)
    },
    queryBudgetAndFeeDetail(deptId,month){
      if(this.orderAmount!=1){
        var history=1
      }else {
        var history=2
      }
      queryBudgetAndFeeDetail({deptId,month,history,startMonth:this.monthRange[0],endMonth:this.monthRange[1]}).then(res=>{
        if(this.orderAmount!=1){
          this.dataListDefault = this.formatData(res.data)
          this.dataList = this.dataListDefault
          if (this.firstRequest === false) {
            this.dataListDefault.forEach(item => {
              for (let key in item) {
                this.$set(this.filterData, key ,[]);
                this.$set(this.filterData, key + "List", []);
              }
            });
            this.firstRequest = true;
          }
          this.dataListDefault.forEach(item => {
            for (let key in item) {
              if (item[key]) {
                this.filterData[key + "List"].push(item[key]);
              }
            }
          });
          for (let key in this.filterData) {
            this.filterData[key] = Array.from(new Set(this.filterData[key]));
          }
        //  this.filterDataChange();
        }else {
          this.dataListDefault = this.formatData(res.data)
          this.dataList = this.dataListDefault
          if (this.firstRequest === false) {
            this.dataListDefault.forEach(item => {
              if(item.feeType=='支出'){
                for (let key in item) {
                  this.$set(this.filterData, key ,[]);
                  this.$set(this.filterData, key + "List", []);
                }
              }else {
                for (let key in item) {
                  this.$set(this.filterData1, key ,[]);
                  this.$set(this.filterData1, key + "List", []);
                }
              }

            });
            this.firstRequest = true;
          }
          this.dataListDefault.forEach(item => {
            if(item.feeType=='支出'){
              for (let key in item) {
                if (item[key]) {
                  this.filterData[key + "List"].push(item[key]);
                }
              }
            }else {
              for (let key in item) {
                if (item[key]) {
                  this.filterData1[key + "List"].push(item[key]);
                }
              }
            }

          });
          for (let key in this.filterData) {
            this.filterData[key] = Array.from(new Set(this.filterData[key]));
          }
          for (let key in this.filterData1) {
            this.filterData1[key] = Array.from(new Set(this.filterData1[key]));
          }
          // this.filterDataChange();
          // this.filterDataChange1()
        }
      })
    },
    formatData(data,flag){
      let feetIdList=[...new Set(data.map(item=>item.feetId+item.feeType))]
      if(!flag){
        this.titleList=[...this.titleList,...[...new Set(data.map(item=>item.year))].map(item=>({'title':item,'value':'amount'+item }))]
      }
      let dataList=[]
      feetIdList.forEach(feetIdType=>{
        data.forEach(item=>{
          if(item.feetId+item.feeType===feetIdType){
            if(dataList.find(i=>i.feetIdType===feetIdType)){
              dataList.find(i=>i.feetIdType===feetIdType)['amount'+item.year] = item.amount
            } else {
              let data = {feetIdType}
              data['amount'+item.year]= item.amount
              dataList.push(Object.assign(item,data))
            }
          }
        })
      })
       let arr= [...new Set(data.map(item=>item.year))].map(item=>'amount'+item)
      dataList.forEach(item=>{
        arr.forEach(itm=>{
          if(!item[itm]){
            item[itm]=''
          }
        })
      })
      return dataList
    },
    queryChangedBudget({row,column}){
      const data={
        feetId: row.feetId,
        year: column.label,
        deptId: this.deptId,
        startMonth:this.monthRange[0],
        endMonth:this.monthRange[1]
      }
      queryChangedBudget(data).then(res=>{
        this.$set(row,'budgetData',res.data)
      //  row.budgetData=res.data
      })
    },
    getSummaries(param){
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] = this.formatAmount(sums[index])

        } else {
          sums[index] = '';
        }
      });

      return sums;
    },
    setFilterItem(index ,flag) {
      if(flag!==false){
        this.checkFilterList.splice(index, 1, !this.checkFilterList[index]);
      }
      if(flag===false){
        this.checkFilterList.splice(index, 1, false);
        return
      }
    },
    filterDataChange() {
      let arr = JSON.parse(JSON.stringify(this.dataListDefault));
      const filterKeys = Object.keys(this.filterData);
      let Allflag=false

      filterKeys.forEach(key => {
        if (this.filterData[key].length !== 0 && !key.includes("List")) {
          // if(this.filterData[key].includes('全选')){
          //   Allflag = true
          //   // this.filterData[key + "List"].forEach(item=>{
          //   //   this.filterData[key].push(item);
          //   // })
          //   // console.log(this.filterData[key]);
          //   //
          // }
          arr = arr.filter(itm => {
            var flag = false;
            if (Allflag){
              return Allflag
            }
            this.filterData[key].forEach(item => {
              if (item === itm[key]) {
                flag = true;
              }
            });
            return flag;
          });
        }
      });
      this.dataList = arr;
    },
    filterDataChange1() {
      let arr = JSON.parse(JSON.stringify(this.dataListDefault));
      const filterKeys = Object.keys(this.filterData1);
      let Allflag=false

      filterKeys.forEach(key => {
        if (this.filterData1[key].length !== 0 && !key.includes("List")) {
          if(this.filterData1[key].includes('全选')){
            Allflag = true
            // this.filterData[key + "List"].forEach(item=>{
            //   this.filterData[key].push(item);
            // })
            // console.log(this.filterData[key]);
            //
          }
          arr = arr.filter(itm => {
            var flag = false;
            if (Allflag){
              return Allflag
            }
            this.filterData1[key].forEach(item => {
              if (item === itm[key]) {
                flag = true;
              }
            });
            return flag;
          });
        }
      });
      this.dataList = arr;
    },
    checkAllOrNot(prop) {
      if (
        this.filterData[prop].length !== this.filterData[prop + "List"].length
      ) {
        this.filterData[prop] = [];
        this.filterData[prop + "List"].forEach(item => {
          this.filterData[prop].push(item);
        });
      } else {
        this.filterData[prop] = [];
      }
      //this.filterDataChange();
    },
    checkboxGroup(e,value) {
      if (value === 'feeName') {
        if(this.oldValue.includes('全选') && !this.newValue.includes('全选')){
          this.filterData['feeName'] = []

        }
        if (!this.oldValue.includes('全选') && this.newValue.includes('全选')){
          this.filterData['feeName' + 'List'].filter(i => i.includes(this.filterFeeName)).forEach(item=>{
            if(!this.filterData['feeName'].includes(item)){
              this.filterData['feeName'].push(item);
            }
          })
        }
        if (this.oldValue.includes('全选') && this.newValue.includes('全选')){
          this.filterData['feeName'] = this.filterData['feeName'].filter(item=>item!='全选')
        }
      }
      if (value === 'feeType') {
        if(this.oldFeeTypeValue.includes('全选') && !this.newFeeTypeValue.includes('全选')){
          this.filterData['feeType'] = []
        }
        if (!this.oldFeeTypeValue.includes('全选') && this.newFeeTypeValue.includes('全选')){
          this.filterData['feeType' + 'List'].forEach(item=>{
            this.filterData['feeType'].push(item);
          })
        }
        if (this.oldFeeTypeValue.includes('全选') && this.newFeeTypeValue.includes('全选')){
          this.filterData['feeType'] = this.filterData['feeType'].filter(item=>item!='全选')
        }
      }
    },
    checkboxGroup1(e,value) {
      if (value === 'feeName') {
        if(this.oldValue1.includes('全选') && !this.newValue1.includes('全选')){
          this.filterData1['feeName'] = []
        }
        if (!this.oldValue1.includes('全选') && this.newValue1.includes('全选')){
          this.filterData1['feeName' + 'List'].filter(i => i.includes(this.filterFeeName)).forEach(item=>{
            if(!this.filterData1['feeName'].includes(item)){
              this.filterData1['feeName'].push(item);
            }
          })
        }
        if (this.oldValue1.includes('全选') && this.newValue1.includes('全选')){
          this.filterData1['feeName'] = this.filterData1['feeName'].filter(item=>item!='全选')
        }
      }
      if (value === 'feeType') {
        if(this.oldFeeTypeValue1.includes('全选') && !this.newFeeTypeValue1.includes('全选')){
          this.filterData1['feeType'] = []
        }
        if (!this.oldFeeTypeValue1.includes('全选') && this.newFeeTypeValue1.includes('全选')){
          this.filterData1['feeType' + 'List'].forEach(item=>{
            this.filterData1['feeType'].push(item);
          })
        }
        if (this.oldFeeTypeValue1.includes('全选') && this.newFeeTypeValue1.includes('全选')){
          this.filterData1['feeType'] = this.filterData1['feeType'].filter(item=>item!='全选')
        }
      }
    },
    formatAmount(amount){
      return formatAmount(amount)
    },
    cellClassName({row, column, rowIndex, columnIndex}){
      if(typeof row[column.property]==='number'){
        return 'right-nowarp'
      }
    },
    filterTextFeeName(){
      this.filterFeeName=this.filterText
    },

  },
  watch:{
    historyType(n){
      if(n==100) return
      this.filterText=n
      this.filterTextFeeName()
      this.filterData['feeName']=this.filterData['feeName' + 'List'].filter(i => i.includes(this.filterFeeName))
      this.filterDataChange();
      if(this.dataList.filter(item=>item.feeType=='预算')&&this.dataList.filter(item=>item.feeType=='预算').length){
        this.filterData1['feeName']=this.filterData1['feeName' + 'List'].filter(i => i.includes(this.filterFeeName))
        this.filterDataChange1()
      }
    },
    'filterData.feeName'(n, o) {
      this.oldValue=o
      this.newValue=n
    },
    'filterData.feeType'(n,o){
      this.oldFeeTypeValue=o
      this.newFeeTypeValue=n
    },
    'filterData1.feeName'(n, o) {
      this.oldValue1=o
      this.newValue1=n
    },
    'filterData1.feeType'(n,o){
      this.oldFeeTypeValue1=o
      this.newFeeTypeValue1=n
    },
    'deptId'(n){
      this.queryBudgetAndFeeDetail(n)
    },
    activeNames(n){
      if( n==1){
        queryBudgetAndFeeDetail({queryFlag:2,deptId:this.deptId,startMonth:this.monthRange[0],endMonth:this.monthRange[1],}).then(res=>{
          this.noAmountList= this.formatData(res.data,1)
        })
      }

    }
  }
}
</script>

<style lang="scss" scoped>
  .el-table /deep/ th .cell {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    img {
      margin-left: 5px;
      width: 12px;
      cursor: pointer;
    }
    .checkboxs {
      position: absolute;
      background: #fff;
      min-width: 100%;
      top: 47px;
      left: 0px;
      display: flex;
      z-index: 1;
      border: 1px solid #f4f4f5;
      overflow: visible;
      padding-left: 6px;
      padding-bottom: 80px;
      .filter_content {
        text-align: left;
        width: 100%;
        max-height: 200px;
        height: 200px;
        overflow: auto;
        .el-checkbox{
          width: 100%;
        }
        .search_warp{
          padding-top: 10px;
          position: relative;
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          .el-input{
            padding-left: 0;
            width: 225px;
            height: 24px;
            line-height: 24px;
            /deep/ .el-input__inner{
              height: 24px;
              line-height: 24px;
            }
          }
          .el-button{
            position: absolute;
            left: 200px;
            top: 0;
          }
        }

      }
      .el-checkbox-group {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        overflow: visible;
      }
      .checkAll {
        position: absolute;
        bottom: -30px;
        width: 100%;
        left: 0;
        background: #fff;
        height: 30px;
        color: #409eff;
        text-indent: 5px;
        line-height: 30px;
        cursor: pointer;
        border: 1px solid #f4f4f5;
        text-align: right;
        padding-right: 10px;
      }
    }
  }
  .el-table /deep/ .el-table__header-wrapper {
    overflow: visible;
    th {
      overflow: visible;
      .cell {
        overflow: visible;
      }
    }
  }
  .el-scrollbar li {
    display: flex;
    span {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      border-right: 1px solid #f4f4f5;
      border-bottom: 1px solid #f4f4f5;
    }
  }
  .expenditure{
    position: absolute;
    width: 960px;

    height: 800px;
    overflow: auto;
    background-color: rgba(255, 255, 255, 1);
    box-sizing: border-box;
    border-width: 1px;
    border-style: solid;
    border-color: rgba(201, 201, 201, 1);
    border-radius: 5px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.349019607843137);
  }
  header{
    display: flex;
    justify-content: space-between;
    padding:0 10px;
    margin-bottom: 10px;
  }
  .border_warp{
    border: 1px solid rgba(201, 201, 201, 1);
    width: 50%;
    text-align: center;
  }
/deep/ .has-gutter .cell{
  text-align: right;
  white-space: nowrap;
  text-overflow: clip;
}
  .right-nowarp .cell div{
    text-align:right;
    white-space:nowrap
  }
</style>
