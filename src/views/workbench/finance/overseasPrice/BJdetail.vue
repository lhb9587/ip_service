<template>
  <div style="padding: 30px">
    <div class="bjForm">
      <BJForm :isCopy="isCopy" :threeLevelData="threeLevelData" :type="editType"></BJForm>
    </div>
    <div class="bjTable" style="margin-top: 30px">
      <el-button  type="primary" size="small" @click="preViewBj"
                 v-if="editType != 'view'">生成报价
      </el-button>
      <el-table :data="threeLevelData.offerMadrids" empty-text="暂无数据" style="width: 100%;"
                current-row-key border
                highlight-current-row
                size="mini">
        <el-table-column
          type="expand"
        >
          <template slot-scope="scope">
            <right-details :listData="scope.row" :exchangeRate="threeLevelData.exchangeRate || 1"></right-details>
          </template>
        </el-table-column>
        <el-table-column
          v-for="item in tableTitleList1"
          :label="item.title"
          :prop="item.value"
        >
          <template slot-scope="scope">
            {{ scope.row[item.value] | formatAmount}}
          </template>
        </el-table-column>
        <el-table-column
          label="合计"
        >
          <template slot-scope="scope">
            {{scope.row.totalRMB | formatAmount}}
          </template>

        </el-table-column>
      </el-table>
    </div>
    <div class="fl-ac-jc" style="margin-top: 50px">
      <el-button size="small" type="primary" @click="submitBj" v-if="editType == 'create'">创 建</el-button>
      <el-button size="small" type="primary" @click="editBj" v-if="editType == 'edit'">修 改</el-button>
      <el-button size="small" @click="closeDialog">取 消</el-button>
    </div>
  </div>
</template>

<script>
  import {formatAmount,fomatFloat,toFixed1,toFixed2} from '@/utils/filters'
  import RightDetails from './RightDetails'
  import BJForm from './BJForm'
  import { createOfferCust, modifyOfferCust, calculateOffer } from '@/api/billApi'

  export default {
    name: 'BJdetail',
    components: {
      RightDetails,
      BJForm
    },
    props: {
      isCopy: {},
      threeLevelData: {
        type: Object,
        default: () => ({})
      },
      editType: {}
    },
    data() {
      return {
        tableTitleList1: [
          { 'title': '案件类型', 'value': 'caseTypeIdStr' },
          { 'title': '类型', 'value': 'madridStr' },
          { 'title': '境外费用合计', 'value': 'officialFeeTotalRMB', 'isFormat': true },
          { 'title': '我方服务费', 'value': 'serviceFee', 'isFormat': true },
          { 'title': '公证认证及翻译费', 'value': 'gzFee', 'isFormat': true }
          // { 'title': '境外公证和翻译费', 'value': 'value' },
          // { 'title': '溢价', 'value': 'value' },
          // { 'title': '合计', 'value': 'totalRMB' }

        ]
      }
    },
    created() {
      // if(this.threeLevelData.offerMadrids && this.threeLevelData.offerMadrids.length){
      //   if(this.threeLevelData.offerMadrids.find(item => item.madrid === 1)){
      //     this.threeLevelData.totalB = this.threeLevelData.offerMadrids.find(item => item.madrid === 1).totalRMB
      //   }
      //   if(this.threeLevelData.offerMadrids.find(item => item.madrid === 0)){
      //     this.threeLevelData.totalA = this.threeLevelData.offerMadrids.find(item => item.madrid === 1).totalRMB
      //   }
      // }
      if (this.editType == 'create') {
        this.$set(this.threeLevelData, 'whdServiceFeeAdditional', 1500)
      }
    },
    methods: {
      preViewBj() {
        const data = JSON.parse(JSON.stringify(this.threeLevelData))
        // if(data.caseTypeIds&&data.caseTypeIds.length){
        //   data.caseTypeIds = data.caseTypeIds.join(',')
        // }
        if (data.offerMadrids && data.offerMadrids.length) {
          data.offerMadrids = []
        }
        // data.picture = 0
        if (!data.changeType) {
          data.changeType = undefined
        }
        calculateOffer({
          ...data
        }).then(res => {
          this.$set(this.threeLevelData, 'offerMadrids', [res.data.planA, res.data.planB].filter(i => !!i))
          if (this.threeLevelData.offerMadrids && this.threeLevelData.offerMadrids.length) {
            if (this.threeLevelData.offerMadrids.find(item => item.madrid === 1)) {
              this.threeLevelData.totalB = this.threeLevelData.offerMadrids.find(item => item.madrid === 1).totalRMB
            }
            if (this.threeLevelData.offerMadrids.find(item => item.madrid === 0)) {
              this.threeLevelData.totalA = this.threeLevelData.offerMadrids.find(item => item.madrid === 0).totalRMB
            }
          }
          // this.threeLevelData.offerMadrids = [res.data.planA, res.data.planB]
        })
      },
      editBj() {
        const templateOptions = `${this.threeLevelData.exportItem1}${this.threeLevelData.exportItem2}${this.threeLevelData.exportItem3}`
        this.threeLevelData.templateOptions = templateOptions
        const data = JSON.parse(JSON.stringify(this.threeLevelData))
        // if(data.caseTypeIds&&data.caseTypeIds.length){
        //   data.caseTypeIds = data.caseTypeIds.join(',')
        // }
        if (data.offerMadrids && data.offerMadrids.length) {
          data.offerMadrids = data.offerMadrids.map(item => this.$commonUtils.cleanNullAttr(item))
        } else {
          data.offerMadrids = []
        }
        data.countries && data.countries.forEach(item => {
          if (!item.custId) {
            item.custId = 0
          }
        })
        modifyOfferCust({
          ...data
        }).then(res => {
          this.$message.success('修改报价成功！')
          this.closeDialog(true)
        })
      },
      submitBj() {
        const templateOptions = `${this.threeLevelData.exportItem1}${this.threeLevelData.exportItem2}${this.threeLevelData.exportItem3}`
        this.threeLevelData.templateOptions = templateOptions
        // this.threeLevelData.picture = 0
        if (this.threeLevelData.caseTypeIds == 185 && this.threeLevelData.planB == 1) {
          this.$confirm("马德里官费非实时提取，为确保准确，请到WIPO官网计算器价格自行核对", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            const data = JSON.parse(JSON.stringify(this.threeLevelData))
            if (data.offerMadrids && data.offerMadrids.length) {
              data.offerMadrids = data.offerMadrids.map(item => this.$commonUtils.cleanNullAttr(item))
            } else {
              data.offerMadrids = []
            }
            createOfferCust({ ...data }).then(res => {
              this.$message.success('创建报价成功！')
              this.closeDialog(true)
            })
          })
          return
        }
        const data = JSON.parse(JSON.stringify(this.threeLevelData))
        // if(data.caseTypeIds&&data.caseTypeIds.length){
        //   data.caseTypeIds = data.caseTypeIds.join(',')
        // }
        if (data.offerMadrids && data.offerMadrids.length) {
          data.offerMadrids = data.offerMadrids.map(item => this.$commonUtils.cleanNullAttr(item))
        } else {
          data.offerMadrids = []
        }
        createOfferCust({ ...data }).then(res => {
          this.$message.success('创建报价成功！')
          this.closeDialog(true)
        })
      },
      closeDialog(isUpdate = false) {
        this.$emit('closeDialog', isUpdate)
      }
    }
  }
</script>

<style lang="scss" scoped>
  /deep/ .el-table__header tr,
  /deep/ .el-table__header th {
    padding: 0;
    height: 30px;
    background: #f5f5f5;
  }

</style>
