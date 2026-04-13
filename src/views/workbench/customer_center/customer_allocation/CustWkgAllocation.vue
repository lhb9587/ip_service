<template>
  <div>
    <div v-if="versionView"
         style="font-size:14px;background-color: #fff;border: 1px solid #EBEEF5;border-bottom: none;padding-left: 10px;height: 45px;line-height: 45px;">
      <span>版本: {{versionName}}</span>
      <el-button type="" size="mini" style="margin-left: 10px" @click="refreshVersion">
        <div style="display: flex;align-items: center">
          <i class="el-icon-refresh-right" style="font-size: 18px;color:#409EFF;"></i>
          <span style="display: inline-block;">还原到该版本</span>
        </div>
      </el-button>
      <el-button type="" size="mini" style="margin-left: 10px" @click="goBack">
        <div style="display: flex;align-items: center">
          <i class="el-icon-close" style="font-size: 18px;color:#409EFF;"></i>
          <span style="display: inline-block;">返 回</span>
        </div>
      </el-button>
    </div>
    <el-table :key="versionView" border :max-height="clientHeight" size="mini" :data="wkgList" fit empty-text="暂无数据"
              highlight-current-row
              current-row-key style="width: 100%;">
      <el-table-column label="小组列表" align="left" width="350px">
        <template slot-scope="scope">
          <virtual-select
            :filterMethod="filterMethod"
            v-if="!versionView"
            :disabled="!editStatus"
            size="mini" placeholder="请选择小组"
            style="width: 70%" class="virtual-select" clearable
            @change="(value) => {changeWkg(value, scope.row, scope.$index)}"
            :data="workGroupList.filter(w => !wkgList.find(s => s.wkgId === w.wkgId && w.wkgId !== scope.row.wkgId))"
            v-model="scope.row.wkgId" clearable
            filterable>
          </virtual-select>
          <div v-else>
            {{scope.row.groupName}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="领域" align="left" width="200px">
        <template slot-scope="scope">
          <el-select v-if="!versionView" :disabled="!editStatus" @change="(value) => {changeDomain(value, scope.row)}"
                     size="mini" class=""
                     default-first-option
                     :clearable='true'
                     placeholder="请选择" multiple
                     v-model="scope.row.domainList" filterable
          >
            <el-option
              v-for="domain in wkgDomainList"
              :key="domain"
              :label="domain" :value="domain">
            </el-option>
          </el-select>
          <div v-else>{{scope.row.domainList.join(',')}}</div>
        </template>
      </el-table-column>
      <el-table-column label="去年收入" align="left" width>
        <template slot-scope="scope">
          {{scope.row.income || ''}}
        </template>
      </el-table-column>
      <el-table-column label="本年累计收入" align="left" width>
        <template slot-scope="scope">
          {{scope.row.incomeThisYear || ''}}
        </template>
      </el-table-column>
      <el-table-column label="分配估算收入" align="left" width>
        <template slot-scope="scope">
          <el-popover
            v-if="editStatus && !versionView"
            placement="bottom-start"
            width="350"
            v-model="scope.row.popover"
            trigger="click"
          >
            <div>
              <div style="border: 1px solid #D7D7D7;border-bottom: none;border-right: none">
                <div v-for="(domainItem, dIndex) in scope.row.customerFenpeiList" :key="dIndex" style="display: flex;">
                  <div
                    style="flex: 1;height: 40px;display: flex;align-items: center;justify-content: center;border-bottom: 1px solid #D7D7D7;border-right: 1px solid #D7D7D7;">
                    {{domainItem.userDomain}}
                  </div>
                  <div
                    style="flex: 1;padding: 0 3px;height: 40px;display: flex;align-items: center;justify-content: center;border-bottom: 1px solid #D7D7D7;border-right: 1px solid #D7D7D7;">
                    <el-input type="number" size="small" v-model="domainItem.billSum"
                              @change="() => changeDomainSum(scope.row)"></el-input>
                    <!--                      {{domainItem.billSum}}-->
                  </div>
                </div>
              </div>
              <div style="display: flex;justify-content: space-between;align-items: center;margin-top: 5px">
                <div>合计: {{changeDomainSum(scope.row)}}</div>
                <el-button size="mini" type="primary"
                           @click="() => {changeDomainSum(scope.row, true); scope.row.popover = false}">确定
                </el-button>
              </div>
            </div>
            <div v-if="editStatus && !versionView" slot="reference" style="cursor: pointer"
                 @click="scope.row.popover = !!scope.row.popover"
            >
              {{scope.row.expectedIncome ? scope.row.expectedIncome : scope.row.isCreated ? '' : 0}}
              <span v-if="!scope.row.isCreated" class="el-icon-edit pointer" style="font-size: 18px"></span>
            </div>
          </el-popover>
          <div v-if="!editStatus || versionView">{{scope.row.expectedIncome ? scope.row.expectedIncome :
            scope.row.isCreated ? '' : 0}}
          </div>

        </template>
      </el-table-column>
      <el-table-column label="预计变动收入" align="left" width>
        <template slot-scope="scope">
          {{(scope.row.custIncomeChange == 0 || scope.row.custIncomeChange === undefined || scope.row.custIncomeChange
          === null) ? '' : scope.row.custIncomeChange > 0 ? `增加${scope.row.custIncomeChange}` :
          `减少${Math.abs(scope.row.custIncomeChange)}`}}
          <!--          {{scope.row.custIntroductor}}-->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {queryWorkGroup} from "../../../../api/systemList";
  import {
    queryCustomerFenpeiRecord, queryCustomerFenpeiVersion,
    queryDomainList,
    queryPerformanceByWkgId,
    saveCustomerFenpei
  } from "../../../../api/customerList";

  export default {
    name: "CustWkgAllocation",
    props: {
      editStatus: {
        type: Boolean,
        default: true
      },
      custData: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        wkgDomainList: [],
        wkgList: [],
        workGroupList: [],
        versionView: false,
        backData: null,
        versionName: '',
        versionId: ''
      }
    },
    computed: {
      clientHeight() {
        return document.documentElement.clientHeight - 190
      }
    },
    watch: {
      wkgList: {
        handler(n) {
          if (!n.find(item => item.isCreated)) {
            n.push({
              isCreated: true,
              domainList: [],
              custId: this.custData.custId,
              customerFenpeiList: [],
              customerFenpeiList1: [],
            })
          }
        },
        immediate: true
      }
    },
    async created() {
      await this.init()
    },
    methods: {
      filterMethod(label,e){
        return this.$commonUtils.isPinyinMatch(label,e)
      },
      refreshVersion() {
        this.saveCustomerWkg()
        this.versionView = false
        this.versionName = ''
        this.backData = null
        this.versionId = ''
      },
      goBack() {
        this.$emit('updateVersion', false)
        this.versionView = false
        this.versionName = ''
        this.wkgList = this.backData
        this.backData = null
      },
      queryVersionData(versionId, versionName) {
        this.versionView = true
        this.versionName = versionName
        if (!this.backData) {
          this.backData = JSON.parse(JSON.stringify(this.wkgList))
        }
        queryCustomerFenpeiRecord({
          custId: this.custData.custId,
          versionId
        }).then(res => {
          const wkgIdList = res.data[0] && res.data[0].wkgFenpeiList.map(item => item.wkgId) || []
          wkgIdList.length && queryPerformanceByWkgId({
            versionId,
            custId: this.custData.custId,
            wkgIdList
          }).then(res => {
            this.wkgList = res.data.map((item, index) => ({
              custId: this.custData.custId,
              ...item,
              customerFenpeiList1: JSON.parse(JSON.stringify(item.customerFenpeiList)),
              domainList: item.customerFenpeiList.map(i => i.userDomain),
              userDomain: item.customerFenpeiList.map(i => i.userDomain).join(',')
            }))
          })
        })
      },
      changeDomainSum(row, isComputed) {
        if (row.customerFenpeiList1 && row.customerFenpeiList) {
          const startValue = row.customerFenpeiList1.reduce((pre, next) => +pre + (Number.isNaN(Number(next.billSum)) ? 0 : +next.billSum), 0) || 0
          const endValue = row.customerFenpeiList.reduce((pre, next) => +pre + (Number.isNaN(Number(next.billSum)) ? 0 : +next.billSum), 0) || 0
          // this.$set(row, 'expectedIncome', endValue)
          // this.$set(row, 'custIncomeChange', endValue - startValue)
          if (isComputed) {
            row.expectedIncome = endValue.toFixed(2) // 分配估算收入
            row.custIncomeChange = (endValue - startValue).toFixed(2) // 预计变动收入
          }
          return endValue
        }
      },
      changeWkg(value, row, index) {
        value && this.queryPerformanceByWkgId(value, row, index)
      },
      queryPerformanceByWkgId(wkgId, row, index) {
        wkgId && queryPerformanceByWkgId({
          custId: this.custData.custId,
          wkgIdList: [wkgId]
        }).then(res => {
          row = res.data[0] || {}
          if (res.data && res.data.length) {
            this.$set(this.wkgList, index, res.data.map(item => ({
              custId: this.custData.custId,
              ...item,
              domainList: item.customerFenpeiList.map(i => i.userDomain),
              customerFenpeiList1: JSON.parse(JSON.stringify(item.customerFenpeiList))
            }))[0])
          } else {
            this.$set(this.wkgList, index, {
              wkgId,
              userDomain: '',
              custId: this.custData.custId,
              customerFenpeiList: [],
              customerFenpeiList1: [],
              domainList: []
            })
          }
          // this.$set(row, )
        })
      },
      changeDomain(value, row) {
        if (!value || value && !value.length) {
          row.customerFenpeiList = []
        } else {
          const list = JSON.parse(JSON.stringify(row.customerFenpeiList1 || []))
          row.customerFenpeiList = []
          value.forEach(item => {
            if (list.find(j => j.userDomain == item)) {
              row.customerFenpeiList.push(list.find(j => j.userDomain == item))
            } else {
              row.customerFenpeiList.push({
                wkgId: row.wkgId,
                userDomain: item,
                billSum: 0
              })
            }
          })
        }
        // row.customerFenpeiList1 = JSON.parse(JSON.stringify(row.customerFenpeiList))
        this.changeDomainSum(row, true)
      },
      saveCustomerWkg() {
        this.wkgList.forEach(item => {
          if (item.domainList) {
            this.$set(item, 'userDomain', item.domainList.join(','))
            // item.userDomain = item.domainList.join(',')
          }
          item.customerFenpeiList = item.customerFenpeiList.filter(i => i.userDomain)
        })
        saveCustomerFenpei({
          wkgFenpeiList: this.wkgList.filter(item => item.wkgId),
          custId: this.custData.custId
        }).then(res => {
          this.$message.success('保存成功!')
          this.$emit('updateVersion', true)
          this.updateTable(this.wkgList.filter(item => item.wkgId).map(i => i.wkgId))
        })
      },
      updateTable(wkgIdList) {
        this.wkgList = []
        wkgIdList.length && queryPerformanceByWkgId({
          custId: this.custData.custId,
          wkgIdList
        }).then(res => {
          this.wkgList = res.data.map((item, index) => ({
            ...item,
            customerFenpeiList1: JSON.parse(JSON.stringify(item.customerFenpeiList)),
            domainList: item.customerFenpeiList.map(i => i.userDomain),
            custId: this.custData.custId,
          }))
        })
      },
      queryDomainList() {
        queryDomainList().then(res => {
          this.wkgDomainList = res.data || []
        })
      },
      async init() {
        if (!this.workGroupList.length) {
          await this.queryWorkgroup()
        }
        if (!this.wkgDomainList.length) {
          this.queryDomainList()
        }
        if (this.custData.customerFenpeiList && this.custData.customerFenpeiList.length) {
          queryPerformanceByWkgId({
            custId: this.custData.custId,
            wkgIdList: this.custData.customerFenpeiList.map(item => item.wkgId)
          }).then(res => {
            this.wkgList = this.custData.customerFenpeiList.map(item => ({
              wkgId: item.wkgId,
              // cfpId: item.cfpId,
              custId: item.custId,
            }))
            this.wkgList = res.data.map((item, index) => ({
              custId: this.custData.custId,
              ...this.wkgList[index],
              ...item,
              customerFenpeiList1: JSON.parse(JSON.stringify(item.customerFenpeiList)),
              domainList: item.customerFenpeiList.map(i => i.userDomain)
            }))
          })
          // this.wkgList = JSON.parse(JSON.stringify(this.custData.customerFenpeiList))
        }
      },
      async queryWorkgroup() {
        await queryWorkGroup({
          isBussiness: 1,
          wkgStatus: 1
        }).then(res => {
          this.workGroupList = res.data.map(item => ({
            wkgId: item.wkgId,
            name: item.groupName,
            value: item.wkgId,
            label: item.groupName
          }))
        })
      }
    },
  }
</script>

<style lang="scss" scoped>
  > > > .header-table {
    margin-top: 10px;
    padding: 0 0 0 15px;

    .el-table__header-wrapper {
      border: 1px solid #EBEEF5;
      border-bottom: none;

      th {
        background-color: #FFFFFF;
        font-size: 16px;
        color: #555555;
        font-weight: normal;
      }
    }
  }

  /* 在Chrome浏览器下 */
  /deep/ input::-webkit-outer-spin-button,
  /deep/ input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  /* 在Firefox浏览器下 */
  /deep/ input[type="number"] {
    -moz-appearance: textfield;
  }

</style>
