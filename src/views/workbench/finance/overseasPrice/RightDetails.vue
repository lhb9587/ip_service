<template>
  <div>
    <!--    <el-row>-->
    <!--      <el-col :span="12">-->
    <!--        <el-form label-width="120px">-->
    <!--          <el-form-item label="马德里基础费:" v-if="listData.basicDetails&&listData.basicDetails.length">-->
    <!--            {{listData.basicDetails[0].amount}}-->
    <!--&lt;!&ndash;            <el-input size="mini" v-model="listData.basicDetails[0].amount"></el-input>&ndash;&gt;-->
    <!--          </el-form-item>-->
    <!--          <el-form-item label="附加费明细:"-->
    <!--                        v-if="listData.supplementarybasicDetails&&listData.supplementarybasicDetails.length">-->
    <!--&lt;!&ndash;            <el-input size="mini" v-model="listData.supplementarybasicDetails[0].amount"></el-input>&ndash;&gt;-->
    <!--            {{listData.supplementarybasicDetails[0].amount}}-->
    <!--          </el-form-item>-->
    <!--          <el-form-item label="万慧达基础服务费:"-->
    <!--                        v-if="listData.whdServiceBasicDetails&&listData.whdServiceBasicDetails.length">-->
    <!--&lt;!&ndash;            <el-input size="mini" v-model="listData.whdServiceBasicDetails[0].amount"></el-input>&ndash;&gt;-->
    <!--            {{listData.whdServiceBasicDetails[0].amount}}-->
    <!--          </el-form-item>-->
    <!--        </el-form>-->
    <!--      </el-col>-->
    <!--    </el-row>-->
    <el-row>
      <el-col :span="24">
        <el-form>
          <el-form-item label="" v-if="!listData.madrid">
            <!--            逐一table-->
            <div>逐一注册</div>
            <el-table :data="ZYData" empty-text="暂无数据"
                      style="width: 100%;margin: 10px 0px 10px 30px" current-row-key border
                      highlight-current-row fit
                      :summary-method="getSummaries"
                      show-summary
                      size="mini">
              <el-table-column
                type="index"
                label="序号"
                width="60">
              </el-table-column>
              <el-table-column
                label="国家"
              >
                <template slot-scope="scope">
                  {{scope.row.contractingPartyStr}}
                </template>
              </el-table-column>
              <el-table-column
                label="外代所"
              >
                <template slot-scope="scope">
                  {{scope.row.custIdStr}}
                </template>
              </el-table-column>
              <el-table-column
                label="境外官费"
              >
                <template slot-scope="scope">
                  {{scope.row.amount | formatAmount}}
                </template>
              </el-table-column>
              <el-table-column
                label="境外代理费"
              >
                <template slot-scope="scope">
                  {{scope.row.osServiceFee | formatAmount}}
                </template>
              </el-table-column>
              <el-table-column
                label="万慧达代理费"
              >
                <template slot-scope="scope">
                  {{scope.row.whdFee | formatAmount}}
                </template>
              </el-table-column>
              <el-table-column
                label="国内公证认证费"
              >
                <template slot-scope="scope">
                  {{scope.row.interGzFee |formatAmount}}
                </template>
              </el-table-column>
              <el-table-column
                label="境外公证认证及翻译费"
              >
                <template slot-scope="scope">
                  {{scope.row.abroadGzFee | formatAmount}}
                </template>
              </el-table-column>
              <el-table-column
                label="小计"
                prop="ZYsum"
              >
                <template slot-scope="scope">
                  {{scope.row.ZYsum | formatAmount}}
                  <!--                  {{scope.row.contractingParty}}-->
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item v-else>
            <div>马德里</div>
            <el-table :data="listData.contractingPartyDetails.filter(item => item.mad)" empty-text="暂无数据"
                      style="width: 100%;margin: 10px 0px 10px 30px" current-row-key border
                      highlight-current-row fit
                      size="mini"
                      :span-method="mergeRow"
                      :summary-method="getSummaries1"
                      show-summary
            >
              <el-table-column
                type="index"
                label="序号"
                width="60">
              </el-table-column>
              <el-table-column
                label="地区"
              >
                <template slot-scope="scope">
                  {{scope.row.contractingPartyStr}}
                </template>
              </el-table-column>
              <el-table-column
                label="基础官费(CHF)"
              >
                <template slot-scope="scope">
                  {{listData.basicDetails&&listData.basicDetails[0]&&listData.basicDetails[0].amount | formatAmount}}
                </template>
              </el-table-column>
              <el-table-column
                label="指定国家官费(CHF)"
              >
                <template slot-scope="scope">
                  {{scope.row.amount | formatAmount}}
                </template>
              </el-table-column>
              <el-table-column
                label="超类别官费"
              >
                <template slot-scope="scope">
                  {{listData.supplementarybasicDetails&&listData.supplementarybasicDetails[0]&&listData.supplementarybasicDetails[0].amount | formatAmount}}
                </template>
              </el-table-column>
              <el-table-column
                label="基础代理费(RMB)"
              >
                <template slot-scope="scope">
                  {{listData.whdServiceBasicDetails&&listData.whdServiceBasicDetails[0]&&listData.whdServiceBasicDetails[0].amount | formatAmount}}
                </template>
              </el-table-column>
              <el-table-column
                label="超类别代理费(RMB)"
              >
                <template slot-scope="scope">
                  {{listData.whdServiceBasicDetails&&listData.whdServiceBasicDetails[1]&&listData.whdServiceBasicDetails[1].amount | formatAmount}}
                </template>
              </el-table-column>
              <el-table-column
                label="指定国家代理费(RMB)"
              >
                <template slot-scope="scope">
                  {{scope.row.whdFee | formatAmount}}
                </template>
              </el-table-column>
              <el-table-column
                label="马德里官费小计(RMB)"
              >
                <template slot-scope="scope">
                  {{mdSum | formatAmount}}
                </template>
              </el-table-column>
              <el-table-column
                label="万慧达代理费小计(RMB)"
                prop="MDsum"
              >
                <template slot-scope="scope">
                  {{whdSum | formatAmount}}
                </template>
              </el-table-column>

            </el-table>
            <div>逐一注册</div>
            <el-table :data="ZYData" empty-text="暂无数据"
                      style="width: 100%;margin: 10px 0px 10px 30px" current-row-key border
                      highlight-current-row fit
                      :summary-method="getSummaries"
                      show-summary
                      size="mini">
              <el-table-column
                type="index"
                label="序号"
                width="60">
              </el-table-column>
              <el-table-column
                label="国家"
              >
                <template slot-scope="scope">
                  {{scope.row.contractingPartyStr}}
                </template>
              </el-table-column>
              <el-table-column
                label="外代所"
              >
                <template slot-scope="scope">
                  {{scope.row.custIdStr}}
                </template>
              </el-table-column>
              <el-table-column
                label="境外官费"
              >
                <template slot-scope="scope">
                  {{scope.row.amount | formatAmount}}
                </template>
              </el-table-column>
              <el-table-column
                label="境外代理费"
              >
                <template slot-scope="scope">
                  {{scope.row.osServiceFee | formatAmount}}
                </template>
              </el-table-column>
              <el-table-column
                label="万慧达代理费"
              >
                <template slot-scope="scope">
                  {{scope.row.whdFee | formatAmount}}
                </template>
              </el-table-column>
              <el-table-column
                label="国内公证认证费"
              >
                <template slot-scope="scope">
                  {{scope.row.interGzFee |formatAmount}}
                </template>
              </el-table-column>
              <el-table-column
                label="境外公证认证及翻译费"
              >
                <template slot-scope="scope">
                  {{scope.row.abroadGzFee |formatAmount}}
                </template>
              </el-table-column>
              <el-table-column
                label="小计"
                prop="ZYsum"
              >
                <template slot-scope="scope">
                  {{scope.row.ZYsum | formatAmount}}
<!--                  {{Number(scope.row.amount) + Number(scope.row.whdFee) + Number(scope.row.abroadGzFee)}}-->
                  <!--                  {{scope.row.contractingParty}}-->
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <!--          <el-form-item  label="">-->
          <!--            <el-table :data="listData.complementaryDetails" empty-text="暂无数据" style="width: 100%;margin: 10px 0px 10px 30px" current-row-key border-->
          <!--                      highlight-current-row-->
          <!--                      size="mini">-->
          <!--              <el-table-column-->
          <!--                type="index"-->
          <!--                label="补充费明细"-->
          <!--                width="120">-->
          <!--              </el-table-column>-->
          <!--              <el-table-column-->
          <!--                v-for="(row, key) in tableTitle"-->
          <!--                :prop="row.prop"-->
          <!--                :label="row.label"-->
          <!--                :key="key"-->
          <!--              >-->
          <!--              </el-table-column>-->
          <!--            </el-table>-->
          <!--          </el-form-item>-->
        </el-form>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import {formatAmount,fomatFloat,toFixed1,toFixed2} from '@/utils/filters'
  export default {
    name: 'RightDetails',
    props: {
      listData: {},
      exchangeRate: {
        type: [Number, String],
        default: 1
      }
    },
    data() {
      return {
        tableTitle1: [
          {
            label: '国家',
            prop: 'contractingParty'
          },
          {
            label: '修改日期',
            prop: 'modifyDate'
          },
          {
            label: '万慧达服务费',
            prop: 'whdFee'
          },
          {
            label: '国内公证认证费',
            prop: 'interGzFee'
          },
          {
            label: '境外公证及翻译费',
            prop: 'abroadGzFee'
          },
          {
            label: '总计合计',
            prop: 'total'
          }
        ]
      }
    },
    computed: {
      ZYData() {
        if (this.listData.contractingPartyDetails.filter(item => !item.mad).length) {
          this.listData.contractingPartyDetails.filter(item => !item.mad).forEach(i => {
            i.ZYsum = (10*Number(this.$wUtil.formatFloat(i.amount, 1)) + 10*Number(this.$wUtil.formatFloat(i.interGzFee, 1)) + 10*Number(this.$wUtil.formatFloat(i.whdFee, 1)) + 10*Number(this.$wUtil.formatFloat(i.osServiceFee, 1)) + 10*Number(this.$wUtil.formatFloat(i.abroadGzFee, 1))) / 10
          })
        }
        return this.listData.contractingPartyDetails.filter(item => !item.mad)
      },
      mdSum() {
        let sum = 10*Number(this.$wUtil.formatFloat((this.listData.basicDetails && this.listData.basicDetails[0] && this.listData.basicDetails[0].amount || 0) + (this.listData.supplementarybasicDetails && this.listData.supplementarybasicDetails[0] && this.listData.supplementarybasicDetails[0].amount || 0), 1))
        this.listData.contractingPartyDetails && this.listData.contractingPartyDetails.filter(item => item.mad).forEach(item => {
          sum +=  10*Number(this.$wUtil.formatFloat(item.amount || 0, 1))
        })
        return Number(this.$wUtil.formatFloat(sum * ((this.exchangeRate && this.exchangeRate / 100) || 1), 1)) / 10
      },
      whdSum() {
        let sum =10*Number(this.$wUtil.formatFloat(this.listData.whdServiceBasicDetails && this.listData.whdServiceBasicDetails[0] && this.listData.whdServiceBasicDetails[0].amount || 0, 1))
        this.listData.contractingPartyDetails && this.listData.contractingPartyDetails.filter(item => item.mad).forEach(item => {
          sum += 10*Number(this.$wUtil.formatFloat(item.whdFee || 0, 1))
        })
        return sum / 10
      }
    },
    created() {

    },
    methods: {
      getSummaries1(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = "合计：";
            return;
          }
          const values = data.map(item => {
            if (column.property == 'MDsum') {
              return (this.$wUtil.formatFloat(this.mdSum) * 10 + this.$wUtil.formatFloat(this.whdSum) * 10) / 10
            }
            return '-'
          });
          if (!values.every(value => isNaN(value))) {
            sums[index] = values[0]

          }
        });
        return sums.map(i=>formatAmount(i))
      },
      getSummaries(param) {
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计：'
            return
          }
          const values = data.map(item => {
            if (column.property == 'ZYsum') {
              return Number(this.$wUtil.formatFloat(item[column.property]))
            }
          })
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = curr
              if (!isNaN(value)) {
                return (10 * this.$wUtil.formatFloat(prev) + 10 * this.$wUtil.formatFloat(curr)) / 10
              } else {
                return +this.$wUtil.formatFloat(prev)
              }
            }, 0)

            // sums[index] = toFixed1(sums[index])
            // if(column.property == 'manhourBill'){
            //   sums[index] = sums[index]
            // }else{
            //   sums[index] = "￥ " + sums[index]
            // }

          }
        })
        return sums.map(i=>formatAmount(i))
      },
      mergeRow({ row, column, rowIndex, columnIndex }) {

        const length = this.listData.contractingPartyDetails.length
        if (length) {
          if (columnIndex === 2 || columnIndex === 4 || columnIndex === 5 || columnIndex === 6 || columnIndex === 8 || columnIndex === 9) {
            if (rowIndex % length === 0) {
              return {
                rowspan: length,
                colspan: 1
              }
            } else {
              return {
                rowspan: 0,
                colspan: 0
              }
            }
          }
        }
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
