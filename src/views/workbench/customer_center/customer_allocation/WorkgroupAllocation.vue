<template>
  <div>
    <div class="tableList">
      <div v-for="(item, index) in groupList" :key="item.label" class="tableRow">
        <div class="tableCell">{{item.label}}</div>
        <div class="tableCell" v-for="(it, key) in item.data" :key="it.name">
          <div>
            <virtual-select :filterMethod="filterMethod" :disabled="!editStatus" v-if="item.label === '小组列表'"
                            @change="(id) => changeWkgSelect(id, it, item, key, index)"
                            :key="it.wkgId"
                            size="mini" placeholder="请选择小组" style="width: 200px;" class="virtual-select"
                            :data="workGroupList.filter(k => !item.data.find(j => j.wkgId === k.wkgId && j.wkgId !== it.wkgId))"
                            v-model="it.wkgId" :clearable="!!it.wkgId"
                            filterable>
            </virtual-select>
            <el-select :disabled="!editStatus" v-if="item.label === '领域'" size="mini" class="" default-first-option
                       :clearable='true'
                       placeholder="请选择" multiple
                       v-model="it.userDomainList" filterable @change="(v) => changeDomain(v, it, item, key, index)">
              <el-option v-for="domain in wkgDomainList" :key="domain"
                         :label="domain" :value="domain">
              </el-option>
            </el-select>
            <!--              <el-select v-if="item.label === '小组列表'" size="mini" v-model="it.wkgId" filterable clearable-->
            <!--                         @change="(id) => changeWkg(id, it, item, key, index)"-->
            <!--                         placeholder="请选择小组">-->
            <!--                <el-option-->
            <!--                  v-for="group in workGroupList.filter(k => !item.data.find(j => j.wkgId === k.wkgId && j.wkgId !== it.wkgId))"-->
            <!--                  :key="group.wkgId" :label="group.name" :value="group.wkgId">-->
            <!--                </el-option>-->
            <!--              </el-select>-->
            <div v-if="item.label === '现有客户'">{{it.custList.filter(c => c.custId).length || ''}}
              <div v-if="it.wkgName && editStatus" style="margin-left: 15px;position:relative;" class="pointer"
                   @click="openCustList(it.custList, item, key)">
                <img src="../customer_list/assets/images/allocation.svg" alt="" height="14px">
                <span style="font-size: 14px">配置</span>
                <div v-if="custTableIndex === key && custTableView" class="custTable"
                     v-clickoutside="clickoutside">
                  <div class="divider" style="font-size: 14px">{{wkgName}}-客户管理</div>
                  <el-table border max-height="350" size="mini" :data="it.custList" fit empty-text="暂无数据"
                            highlight-current-row
                            current-row-key style="width: 100%;">
                    <!--          <el-table-column type="index" width="60" label="序号" align="left"></el-table-column>-->
                    <el-table-column align="left" width>
                      <template slot="header" slot-scope="scope">
                        <span>客户</span>({{it.custList.filter(c => c.custId).length}})
                      </template>
                      <template slot-scope="scope">
                        <div v-if="scope.row.isAddFlag" style="display: flex">
                          <el-select size="mini" v-model="scope.row.custId" filterable remote clearable
                                     @change="(v) => changeCust(v, scope.row)"
                                     reserve-keyword placeholder="请输入关键词" no-data-text="暂无数据或列表已存在" :remote-method="(queryString)=>{
            remoteMethod(queryString, it.custList);
            }">
                            <el-option v-for="itm in custNameList" :key="itm.custId" :label="itm.fullname"
                                       :value="itm.custId">
                            </el-option>
                          </el-select>
                          <span class="pointer" style="width: 40px;margin-left: 5px"
                                @click="addCust(scope.row)">添加</span>
                        </div>
                        <div v-else>{{scope.row.name}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column label="客户负责组" align="left" width="440px">
                      <template slot-scope="scope">
                        <div v-for="fenpei in scope.row.wkgFenpeiList" :key="fenpei.wkgId + ''"
                             class="workgroup">
                          <virtual-select
                            :filterMethod="filterMethod"
                            v-if="(!scope.row.isAddFlag && !(fenpei.customerFenpeiList && fenpei.customerFenpeiList.find(q => q.cfpId))) || fenpei.switchGroup"
                            size="mini" placeholder="请选择小组"
                            style="width: 70%" class="virtual-select" clearable
                            :data="workGroupList.filter(w => !scope.row.wkgFenpeiList.find(s => s.wkgId === w.wkgId && w.wkgId !== fenpei.wkgId))"
                            v-model="fenpei.wkgId" clearable
                            filterable>
                          </virtual-select>
                          <div
                            v-if="fenpei.customerFenpeiList && fenpei.customerFenpeiList.length && !fenpei.switchGroup">
                            <el-popover
                              ref="domainRef"
                              placement="bottom-start"
                              width="350"
                              trigger="click"
                            >
                              <div>
                                <el-form size="mini" label-width="80px">
                                  <el-form-item label="领域:" style="margin-bottom: 0">
                                    <div style="border: 1px solid #D7D7D7;border-bottom: none;border-right: none">
                                      <div v-for="(domainItem, dIndex) in fenpei.customerFenpeiList" :key="dIndex"
                                           style="display: flex;">
                                        <div
                                          style="flex: 1;height: 40px;display: flex;align-items: center;justify-content: center;border-bottom: 1px solid #D7D7D7;border-right: 1px solid #D7D7D7;">
                                          <el-select size="mini" class="" style="margin: 0 3px" default-first-option
                                                     @change="(v) => changeFenpeiDomain(v, fenpei, dIndex, key)"
                                                     :clearable='true'
                                                     placeholder="请选择"
                                                     v-model="domainItem.userDomain" filterable
                                          >
                                            <el-option
                                              v-for="domain in wkgDomainList"
                                              :key="domain"
                                              :disabled="!!fenpei.customerFenpeiList.find(k => k.userDomain === domain)"
                                              :label="domain" :value="domain">
                                            </el-option>
                                          </el-select>
                                        </div>
                                        <div
                                          style="flex: 1;padding: 0 3px;height: 40px;display: flex;align-items: center;justify-content: center;border-bottom: 1px solid #D7D7D7;border-right: 1px solid #D7D7D7;">
                                          <el-input type="number" size="small" v-model="domainItem.billSum"
                                                    @change="() => changeFenpeiDomainAndBillSum(fenpei, dIndex, key)"></el-input>
                                          <!--                      {{domainItem.billSum}}-->
                                        </div>
                                      </div>
                                    </div>
                                    <div style="float: right;margin-top: 10px">
                                      <el-button size="mini" style="margin-left: 10px" type="primary"
                                                 @click="changWkgDomain(fenpei, scope.row.custId, scope.row)">确定
                                      </el-button>
                                    </div>

                                    <!--                                    <div style="display: flex">-->
                                    <!--                                      <el-select size="mini" class="" default-first-option-->
                                    <!--                                                 :clearable='true'-->
                                    <!--                                                 placeholder="请选择" multiple-->
                                    <!--                                                 v-model="fenpei.domainList" filterable-->
                                    <!--                                      >-->
                                    <!--                                        <el-option-->
                                    <!--                                          v-for="domain in ['商标','诉讼','保护','专利','域名', '著作权', '非诉', '全部']"-->
                                    <!--                                          :key="domain"-->
                                    <!--                                          :label="domain" :value="domain">-->
                                    <!--                                        </el-option>-->
                                    <!--                                      </el-select>-->
                                    <!--                                      <div>-->
                                    <!--                                        <el-button size="mini" style="margin-left: 10px" type="primary"-->
                                    <!--                                                   @click="changWkgDomain(fenpei, scope.row.custId)">确定-->
                                    <!--                                        </el-button>-->
                                    <!--                                      </div>-->
                                    <!--                                    </div>-->
                                  </el-form-item>
                                </el-form>
                              </div>
                              <span slot="reference" title="配置领域收入">
                              {{fenpei.groupName }}
                            </span>
                            </el-popover>
                          </div>
                          <div style="margin-left: 5px">
                              <span v-if="fenpei.isAddFlag && !scope.row.isAddFlag" class="pointer"
                                    @click="addFenpei(fenpei, scope.row)">添加</span>
                            <template v-if="!fenpei.isAddFlag && workGroupList.find(p => p.wkgId ===
                              fenpei.wkgId)">
                                <span class="pointer" v-if="!fenpei.switchGroup"
                                      @click="switchFunc(true, fenpei, scope.row)">转组</span>
                              <span class="pointer" v-else
                                    @click="switchFunc(false, fenpei, scope.row)">确定</span>
                              <span class="pointer" style="margin-left: 10px"
                                    @click="delFenpei(fenpei, scope.row)">删除</span>
                            </template>
                          </div>
                        </div>
                        <!--                          <el-select size="mini" v-for="fenpei in scope.row.customerFenpeiList" v-model="fenpei.wkgId" :key="fenpei.cfpId" filterable clearable placeholder="请选择小组">-->
                        <!--                            <el-option-->
                        <!--                              v-for="g in workGroupList"-->
                        <!--                              :key="g.wkgId" :label="g.name" :value="g.wkgId">-->
                        <!--                            </el-option>-->
                        <!--                          </el-select>-->
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
          </div>
          <!--            <div v-else>{{it.name}}</div>-->
        </div>
      </div>
    </div>
    <div class="divider">账单收入</div>
    <div class="tableList">
      <div v-for="(item, index) in billList" :key="item.label" class="tableRow">
        <div class="tableCell">{{item.label}}</div>
        <div class="tableCell" v-for="(it, key) in item.data" :key="it.value">
          <template v-if="it.value !== undefined">
            <el-popover
              placement="bottom-start"
              width="600"
              trigger="hover"
            >
              <div>
                <el-table border max-height="350" size="mini" :data="it.list || []" fit empty-text="暂无数据"
                          highlight-current-row
                          current-row-key style="width: 100%;">
                  <!--          <el-table-column type="index" width="60" label="序号" align="left"></el-table-column>-->
                  <el-table-column align="left" width>
                    <template slot="header" slot-scope="scope">
                      <span>去年收入-客户 </span> ({{it.list&&it.list.filter(c => c.custId).length || 0}})
                    </template>
                    <template slot-scope="scope">
                      {{scope.row.name}}
                    </template>
                  </el-table-column>
                  <el-table-column>
                    <template slot="header" slot-scope="scope">
                      <span>账单收入 </span> ( {{it && it.value && it.value.length && it.value.replace(/(.+)(\/.+)/, ($,
                      $1, $2) => $1)}})
                    </template>
                    <template slot-scope="scope">
                      {{scope.row.income}}
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div slot="reference" style="cursor: pointer" v-if="item.label === '去年收入' && !custData.custId">
                {{it.value || ''}}
              </div>
            </el-popover>
            <div v-if="item.label === '本年累计收入' && !custData.custId">{{it.value || ''}}</div>
            <div v-if="item.label === '去年收入' && custData.custId">{{it.value || ''}}</div>
            <span v-if="item.label === '分配估算收入'">{{it.value || ''}}</span>
            <span v-if="item.label === '预计收入变动'">
              {{(it.value == 0 || it.value === null || it.value === undefined) ? '' : it.value > 0 ? `增加${it.value}` : `减少${Math.abs(it.value)}`}}
            </span>
          </template>
        </div>
      </div>
    </div>
    <div class="divider">人均产值</div>
    <div class="tableList">
      <div v-for="(item, index) in outputList" :key="item.label" class="tableRow">
        <div class="tableCell">{{item.label}}</div>
        <div class="tableCell" v-for="(it, key) in item.data" :key="key.value">{{it.value}}</div>
      </div>
    </div>
    <!--      <div class="divider">成本</div>-->
    <!--      <div class="tableList">-->
    <!--        <div v-for="(item, index) in costList" :key="item.label" class="tableRow">-->
    <!--          <div class="tableCell">{{item.label}}</div>-->
    <!--          <div class="tableCell" v-for="(it, key) in item.data" :key="key.name">{{it.name}}</div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <div class="divider">利润</div>-->
    <!--      <div class="tableList">-->
    <!--        <div v-for="(item, index) in profitList" :key="item.label" class="tableRow">-->
    <!--          <div class="tableCell">{{item.label}}</div>-->
    <!--          <div class="tableCell" v-for="(it, key) in item.data" :key="key.name">{{it.name}}</div>-->
    <!--        </div>-->
    <!--      </div>-->
  </div>
</template>

<script>
  import {
    addCustomerFenpei,
    delCustomerFenpei, queryCustomerFenpei,
    queryCustomerNameId, queryDomainList, queryPerformanceByWkgId, queryPerformanceDetailByWkgId, saveCustomerFenpei,
    updateCustomerFenpeiById
  } from "../../../../api/customerList";
  import {queryWorkGroup} from "../../../../api/systemList";

  export default {
    name: "WorkgroupAllocation",
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
    watch: {
      async custData(n) {
        await this.init()
      },
    },
    data() {
      return {
        wkgDomainList: [],
        groupList: [
          {
            label: '小组列表',
            data: [
              {
                name: '',
                wkgId: '',
                wkgName: '',
                isCreate: true
              }
            ]
          },
          {
            label: '现有客户',
            data: [
              {
                name: '',
                custList: []
              },
            ]
          }
        ],
        billList: [
          {
            label: '去年收入',
            data: [
              {
                name: ''
              },
              // {
              //   name: '8,260,988.75/11'
              // }
            ]
          },
          {
            label: '本年累计收入',
            data: [
              {
                name: ''
              },
              // {
              //   name: '8,260,988.75/11'
              // }
            ]
          },
          {
            label: '分配估算收入',
            data: [
              {
                name: ''
              },
              // {
              //   name: '8,260,988.75/11'
              // }
            ]
          },
          {
            label: '预计收入变动',
            data: [
              {
                name: ''
              },
              // {
              //   name: '增加239,011.25'
              // }
            ]
          }
        ],
        outputList: [
          {
            label: '去年数据',
            data: [
              {
                name: ''
              },
            ]
          },
          {
            label: '分配估算',
            data: [
              {
                name: ''
              },

            ]
          }
        ],
        fenpeiType: 1,
        mubiaoIdList: [],
        caozuo: '',
        wkgId: '',
        wkgName: '',
        custTableView: false,
        custTableIndex: -1,
        workGroupList: [],
        domainName: '商标',
        custNameList: [],
        billTableView: false
      }
    },
    async created() {
      await this.init()
    },
    methods: {
      filterMethod(label,e){
        return this.$commonUtils.isPinyinMatch(label,e)
      },
      changWkgDomain(row, custId, outRow1) {
        const outRow = JSON.parse(JSON.stringify(outRow1))
        outRow.wkgFenpeiList.forEach(item => {
          item.custId = outRow.custId
          item.customerFenpeiList = item.customerFenpeiList.filter(j => j.userDomain)
          item.userDomain = item.customerFenpeiList.map(i => i.userDomain) + ''
        })
        saveCustomerFenpei({wkgFenpeiList: outRow.wkgFenpeiList.filter(item => item.userDomain)}).then(res => {
          this.$message.success('保存成功!')
          this.updateGroupsFenpei([], undefined, 1, [])
        })
      },
      changeFenpeiDomain(value, row, index, outIndex) {
        if (!value) {
          row.customerFenpeiList.splice(index, 1)
        }
        if (!row.customerFenpeiList.find(item => !item.userDomain)) {
          row.customerFenpeiList.push({wkgId: row.wkgId, userDomain: '', billSum: 0})
        }
        this.changeFenpeiDomainAndBillSum(row, index, outIndex)
      },
      changeFenpeiDomainAndBillSum(row, index, outIndex) {
        const startValue = row.customerFenpeiList1.reduce((pre, next) => +pre + (Number.isNaN(Number(next.billSum)) ? 0 : +next.billSum), 0)
        const endValue = row.customerFenpeiList.reduce((pre, next) => +pre + (Number.isNaN(Number(next.billSum)) ? 0 : +next.billSum), 0)
        this.$set(this.billList[2].data[outIndex], 'value', endValue.toFixed(2))
        this.$set(this.billList[3].data[outIndex], 'value', (endValue - startValue).toFixed(2))
        // this.$set(this.outputList[1].data[index], 'value', `${data.rjgusuan}` + ` [${data.wkgMemberCount}人]`)
        const wkgMemberCount = this.outputList[1].data[outIndex].value.match(/\[.+\]/g) && this.outputList[1].data[outIndex].value.match(/\[.+\]/g)[0].match(/\d+/g) && this.outputList[1].data[outIndex].value.match(/\[.+\]/g)[0].match(/\d+/g)[0] || 0
        if (wkgMemberCount) {
          this.$set(this.outputList[1].data[outIndex], 'value', `${(endValue / wkgMemberCount).toFixed(2)}` + ` [${wkgMemberCount}人]`)
        } else {
          this.$set(this.outputList[1].data[outIndex], 'value', `0` + ` [0人]`)
        }

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
        if (this.custData.custId) {
          this.$set(this, 'groupList', [
            {
              label: '小组列表',
              data: []
            },
            {
              label: '领域',
              data: []
            }
          ],)
          this.$set(this, 'billList', [
            {
              label: '去年收入',
              data: [
                {
                  name: ''
                },
                // {
                //   name: '8,260,988.75/11'
                // }
              ]
            },
            {
              label: '分配估算收入',
              data: [
                {
                  name: ''
                },
                // {
                //   name: '8,260,988.75/11'
                // }
              ]
            },
            {
              label: '预计收入变动',
              data: [
                {
                  name: ''
                },
                // {
                //   name: '增加239,011.25'
                // }
              ]
            }
          ])
          this.$set(this, 'outputList', [
            {
              label: '去年数据',
              data: [
                {
                  name: ''
                },
              ]
            },
            {
              label: '分配估算',
              data: [
                {
                  name: ''
                },

              ]
            }
          ])
          this.custData.customerFenpeiList && this.custData.customerFenpeiList.length && this.custData.customerFenpeiList.forEach(item => {
            this.groupList[0].wkgId = item.wkgId
            this.groupList[0].wkgName = item.wkgName
            this.groupList[0].data.push({
              cfpId: item.cfpId,
              wkgId: item.wkgId,
              wkgName: item.groupName
            })
            this.groupList[1].data.push({
              userDomainList: item.userDomain ? item.userDomain.split(',') : []
            })
            this.billList[0].data.push({})
            this.billList[1].data.push({})
            this.billList[2].data.push({})
            this.billList[3].data.push({})
            this.outputList[0].data.push({})
            this.outputList[1].data.push({})
          })
          this.groupList[0].data.push({isCreate: true, wkgId: '', wkgName: ''})
          this.groupList[1].data.push({
            userDomainList: []
          })
          this.groupList[0].data.filter(item => !item.isCreate).forEach((item, index) => {
            this.changeWkg(item.wkgId, item, this.groupList[0], index, 0, this.custData.custId)
          })
        } else {
          this.$set(this, 'groupList', [
            {
              label: '小组列表',
              data: [
                {
                  name: '',
                  wkgId: '',
                  wkgName: '',
                  isCreate: true
                }
              ]
            },
            {
              label: '现有客户',
              data: [
                {
                  name: '',
                  custList: []
                },
              ]
            }
          ])
          this.$set(this, 'billList', [
            {
              label: '去年收入',
              data: [
                {
                  name: ''
                },
                // {
                //   name: '8,260,988.75/11'
                // }
              ]
            },
            {
              label: '本年累计收入',
              data: [
                {
                  name: ''
                },
                // {
                //   name: '8,260,988.75/11'
                // }
              ]
            },
            {
              label: '分配估算收入',
              data: [
                {
                  name: ''
                },
                // {
                //   name: '8,260,988.75/11'
                // }
              ]
            },
            {
              label: '预计收入变动',
              data: [
                {
                  name: ''
                },
                // {
                //   name: '增加239,011.25'
                // }
              ]
            }
          ])
          this.$set(this, 'outputList', [
            {
              label: '去年数据',
              data: [
                {
                  name: ''
                },
              ]
            },
            {
              label: '分配估算',
              data: [
                {
                  name: ''
                },

              ]
            }
          ])
        }
      },
      changeDomain(v, innerRow, outerRow, innerIndex, outerIndex) {
        // this.$set(this.groupList[outerIndex].data[innerIndex], 'userDomain', v.join(','))
        // this.groupList[0].data[innerIndex].cfpId && updateCustomerFenpeiById({
        //   ...this.groupList[outerIndex].data[innerIndex],
        //   custList: [],
        //   userDomainList: [],
        //   ...this.groupList[0].data[innerIndex],
        //   custId: this.custData.custId
        // })
      },
      resetFenpei() {
        this.groupList = [
          {
            label: '小组列表',
            data: [
              {
                name: '',
                wkgId: '',
                wkgName: '',
                isCreate: true
              }
            ]
          },
          {
            label: '现有客户',
            data: [
              {
                name: '',
                custList: []
              },
            ]
          }
        ]
        this.billList = [
          {
            label: '去年收入',
            data: [
              {
                name: ''
              },
              // {
              //   name: '8,260,988.75/11'
              // }
            ]
          },
          {
            label: '分配估算收入',
            data: [
              {
                name: ''
              },
              // {
              //   name: '8,260,988.75/11'
              // }
            ]
          },
          {
            label: '预计收入变动',
            data: [
              {
                name: ''
              },
              // {
              //   name: '增加239,011.25'
              // }
            ]
          }
        ]
        this.outputList = [
          {
            label: '去年数据',
            data: [
              {
                name: ''
              },
            ]
          },
          {
            label: '分配估算',
            data: [
              {
                name: ''
              },

            ]
          }
        ]
      },
      delFenpei(fenpei, outRow1) {
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          const outRow = JSON.parse(JSON.stringify(outRow1))
          outRow.wkgFenpeiList.forEach(item => {
            item.custId = outRow.custId
            item.customerFenpeiList = item.customerFenpeiList.filter(j => j.userDomain)
            item.userDomain = item.customerFenpeiList.map(i => i.userDomain) + ''
          })
          saveCustomerFenpei({wkgFenpeiList: outRow.wkgFenpeiList.filter(item => item.wkgId && item.wkgId !== fenpei.wkgId).filter(i => i.userDomain)}).then(res => {
            this.$message.success('删除成功!')
            outRow.wkgFenpeiList = outRow.wkgFenpeiList.filter(item => item.wkgId !== fenpei.wkgId)
            this.updateGroupsFenpei([], undefined, 1, [])
          })
        })
      },
      addFenpei(fenpei, row) {
        if (!fenpei.wkgId) return

        const outRow = JSON.parse(JSON.stringify(row))
        outRow.wkgFenpeiList.forEach(item => {
          item.custId = outRow.custId
          item.customerFenpeiList = item.customerFenpeiList.filter(j => j.userDomain)
          item.userDomain = item.customerFenpeiList.map(i => i.userDomain) + ''
        })
        saveCustomerFenpei({wkgFenpeiList: outRow.wkgFenpeiList}).then(res => {
          this.$message.success('保存成功!')
          this.updateGroupsFenpei([], undefined, 1, [])
        })
        // addCustomerFenpei({
        //   wkgId: fenpei.wkgId,
        //   custId: row.custId
        // }).then(res => {
        //   this.$message.success('分配成功!')
        //   this.$set(fenpei, 'isAddFlag', false)
        //   this.$set(fenpei, 'cfpId', res.data.customerFenpei.cfpId)
        //   this.$set(row, 'isAddFlag', false)
        //
        //   this.updateGroupsFenpei(row.wkgFenpeiList, row.custId, 1, [fenpei.wkgId])
        // })
      },
      updateGroupsFenpei(list, custId, caozuo, mubiaoIdList) {
        // let wkgIdList = [...new Set(list.map(item => item.wkgId)), this.wkgId]
        this.groupList[0].data.filter(item => !item.isCreate).forEach((item, index) => {
          // if (wkgIdList.includes(item.wkgId)) {
          //   this.changeWkg(item.wkgId, item, this.groupList[0], index, 0, custId)
          // }
          this.changeWkg(item.wkgId, item, this.groupList[0], index, 0, custId, caozuo, mubiaoIdList)
        })
      },
      switchFunc(flag, row, outRow1) {
        this.$set(row, 'switchGroup', flag)
        if (flag) { // 转组
          this.mubiaoIdList[0] = row.wkgId
        } else { // 确定
          this.mubiaoIdList[1] = row.wkgId
          const outRow = JSON.parse(JSON.stringify(outRow1))
          outRow.wkgFenpeiList.forEach(item => {
            item.custId = outRow.custId
            item.customerFenpeiList = item.customerFenpeiList.filter(j => j.userDomain)
            item.userDomain = item.customerFenpeiList.map(i => i.userDomain) + ''
          })
          saveCustomerFenpei({wkgFenpeiList: outRow.wkgFenpeiList.filter(item => item.wkgId).filter(i => i.userDomain)}).then(res => {
            this.$message.success('保存成功!')
            this.updateGroupsFenpei([], undefined, 1, [])
          })
        }
      },
      changeCust(custId, row) {
        row.name = this.custNameList.find(item => item.custId === custId).fullname
      },
      addCust(row) {
        if (!row.custId) return
        saveCustomerFenpei({
          wkgFenpeiList: [{
            custId: row.custId,
            wkgId: this.wkgId
          }]
        }).then(res => {
          this.$message.success('保存成功!')
          this.updateGroupsFenpei([], undefined, 1, [])
        })
        // addCustomerFenpei({
        //   wkgId: this.wkgId,
        //   custId: row.custId
        // }).then(res => {
        //   row.isAddFlag = false
        //   this.$message.success('分配成功!')
        //   this.updateGroupsFenpei([], row.custId, 1, [this.wkgId])
        // })
      },
      remoteMethod(value, list) {
        if (value) {
          queryCustomerNameId({pageNo: 1, pageSize: 100, keyword: value}).then(
            res => {
              this.custNameList = res.data.filter(item => !list.find(i => i.custId === item.custId))
            }
          );
        }
      },
      clickoutside() {
        this.custTableIndex = -1
        this.custTableView = false
      },
      openCustList(list, outerRow, index) {
        this.custList = list
        this.wkgName = outerRow.wkgName
        this.wkgId = outerRow.wkgId
        this.custTableView = true
        this.custTableIndex = index
      },
      async changeWkgSelect(wkgId, innerRow, outerRow, innerIndex, outerIndex) {
        const mubiaoWkgId = outerRow.wkgId
        const isCreate = this.groupList[0].data[innerIndex].isCreate
        // if (this.custData.custId) {
        //   if (!wkgId) {
        //     innerRow.cfpId && delCustomerFenpei({
        //       cfpId: innerRow.cfpId
        //     }).then(res => {
        //       this.$message.success('删除成功!')
        //       this.updateGroupsFenpei([], this.custData.custId, 2, [mubiaoWkgId])
        //     })
        //   } else {
        //     if (isCreate) {
        //       // 添加
        //       addCustomerFenpei({
        //         wkgId,
        //         custId: this.custData.custId
        //       }).then(res => {
        //         this.$message.success('分配成功!')
        //         this.$set(innerRow, 'cfpId', res.data.customerFenpei.cfpId)
        //         this.updateGroupsFenpei([], this.custData.custId, 1, [wkgId])
        //       })
        //     } else {
        //       // 转组
        //       updateCustomerFenpeiById({...innerRow, custId: this.custData.custId, switchGroup: undefined}).then(res => {
        //         this.$message.success('转组成功!')
        //         this.updateGroupsFenpei([], custId, 3, [mubiaoWkgId, wkgId])
        //       })
        //     }
        //   }
        // }
        this.changeWkg(wkgId, innerRow, outerRow, innerIndex, outerIndex)
      },
      changeWkg(wkgId, innerRow, outerRow, innerIndex, outerIndex, custId, caozuo, mubiaoIdList) {
        if (!wkgId) {
          this.$set(this.groupList[0], 'wkgId', '')
          this.$set(this.groupList[0], 'wkgName', '')
          this.$set(this.groupList[0].data[innerIndex], 'wkgName', '')
          this.$set(this.groupList[0].data[innerIndex], 'wkgId', '')
          this.$set(this.groupList[0].data[innerIndex], 'isCreate', false)

          this.$set(this.groupList[1], 'wkgId', '')
          this.$set(this.groupList[1], 'wkgName', '')
          this.$set(this.groupList[1].data[innerIndex], 'wkgName', '')
          this.$set(this.groupList[1].data[innerIndex], 'wkgId', '')
          this.$set(this.groupList[1].data[innerIndex], 'custList', [])
          this.groupList[0].data.splice(innerIndex, 1)
          this.groupList[1].data.splice(innerIndex, 1)
          this.billList[0].data.splice(innerIndex, 1)
          this.billList[1].data.splice(innerIndex, 1)
          this.billList[2].data.splice(innerIndex, 1)
          this.billList[3].data.splice(innerIndex, 1)
          this.outputList[0].data.splice(innerIndex, 1)
          this.outputList[1].data.splice(innerIndex, 1)
          return
        }
        this.$set(this.groupList[0], 'wkgId', wkgId)
        this.$set(this.groupList[0], 'wkgName', this.workGroupList.find(item => item.wkgId === wkgId).name)
        this.$set(this.groupList[0].data[innerIndex], 'wkgName', this.workGroupList.find(item => item.wkgId === wkgId).name)
        this.$set(this.groupList[0].data[innerIndex], 'wkgId', wkgId)
        this.$set(this.groupList[0].data[innerIndex], 'isCreate', false)
        this.$set(this.groupList[1], 'wkgId', wkgId)
        this.$set(this.groupList[1], 'wkgName', this.workGroupList.find(item => item.wkgId === wkgId).name)
        this.$set(this.groupList[1].data[innerIndex], 'wkgName', this.workGroupList.find(item => item.wkgId === wkgId).name)
        this.$set(this.groupList[1].data[innerIndex], 'wkgId', wkgId)

        this.isAddWkg()

        this.queryWkgData(wkgId, custId, caozuo, mubiaoIdList, innerIndex)

        !custId && this.queryBillDataByWkgId(wkgId, innerIndex)

        this.queryCustomerFenpeiByWkgId(wkgId, innerRow, outerRow, innerIndex, outerIndex)
      },
      queryBillDataByWkgId(wkgId, innerIndex) {
        queryPerformanceDetailByWkgId({wkgId}).then(res => {
          this.billList[0].data[innerIndex].list = res.data
        })
      },
      queryWkgData(wkgId, custId, caozuo, mubiaoIdList, index) {
        queryPerformanceByWkgId({
          curCustId: this.custData.custId,
          wkgId,
          custId,
          caozuo,
          mubiaoIdList
        }).then(res => {
          // res.data.[0]
//           账单收入：
//           income：去年收入
//           custCountLastYear：去年客户数量
//           expectedIncome：分配估算收入
//           custCount：今年客户数量
//           custIncome：预计收入变动
          if (res.data && res.data.length) {
            const data = res.data[0]
            if (this.custData.custId) {
              this.$set(this.billList[0].data[index], 'value', data.income === null ? '' : data.income)
              this.$set(this.billList[1].data[index], 'value', data.incomeThisYear === null ? '' : data.incomeThisYear)
              this.$set(this.billList[2].data[index], 'value', data.expectedIncome === null ? '' : data.expectedIncome)
              this.$set(this.billList[3].data[index], 'value', data.custIncome === null ? '' : data.custIncome)
              this.$set(this.outputList[0].data[index], 'value', data.rjLastYear === null ? '' : (data.rjLastYear + ' / ' + data.wkgMemberCountLastYear))
              this.$set(this.outputList[1].data[index], 'value', data.rjgusuan === null ? '' : (data.rjgusuan + ' / ' + data.wkgMemberCount))
            } else {
              this.$set(this.billList[0].data[index], 'value', data.income === null ? '' : (data.income + ' / ' + data.custCountLastYear))
              this.$set(this.billList[1].data[index], 'value', data.incomeThisYear === null ? '' : data.incomeThisYear)
              this.$set(this.billList[2].data[index], 'value', data.expectedIncome === null ? '' : data.expectedIncome)
              this.$set(this.billList[3].data[index], 'value', data.custIncome === null ? '' : data.custIncome)
              this.$set(this.outputList[0].data[index], 'value', data.rjLastYear === null ? '' : (`${data.rjLastYear}` + ` [${data.wkgMemberCountLastYear}人]`))
              this.$set(this.outputList[1].data[index], 'value', data.rjgusuan === null ? '' : (`${data.rjgusuan}` + ` [${data.wkgMemberCount}人]`))
            }
          }


//           人均产值
//           去年数据：
//              rjLastYear：人均收入
//              wkgMemberCountLastYear：去年人数
//           分配估算：
//            rjgusuan：人均收入
//           wkgMemberCount：今年人数
        })
      },
      isAddWkg() {
        if (!this.groupList[0].data.find(item => item.isCreate)) {
          this.groupList[0].data.push({isCreate: true, wkgId: '', wkgName: ''})
          this.groupList[1].data.push({wkgId: '', wkgName: '', custList: []})
          this.billList[0].data.push({})
          this.billList[1].data.push({})
          this.billList[2].data.push({})
          this.billList[3].data.push({})
          this.outputList[0].data.push({})
          this.outputList[1].data.push({})
        }
      },
      queryCustomerFenpeiByWkgId(wkgId, innerRow, outerRow, innerIndex, outerIndex) {
        queryCustomerFenpei({
          wkgId
        }).then(res => {
          this.$set(this.groupList[1].data[innerIndex], 'custList', res.data)
          this.groupList[1].data[innerIndex].custList.unshift({
            isAddFlag: true,
            wkgFenpeiList: []
          })
          this.groupList[1].data[innerIndex].custList.forEach(item => {
            item.wkgFenpeiList.unshift({
              isAddFlag: true,
            })
            item.wkgFenpeiList.forEach((i, idx) => {
              this.$set(i, 'domainList', i.customerFenpeiList && i.customerFenpeiList.map(j => j.userDomain) || [])
              if (i.customerFenpeiList && i.customerFenpeiList.length) {
                if (!i.customerFenpeiList.find(j => !j.userDomain)) {
                  i.customerFenpeiList.push({wkgId: i.wkgId, userDomain: '', billSum: 0})
                }
              } else {
                this.$set(i, 'customerFenpeiList', JSON.parse(JSON.stringify([{
                  userDomain: '',
                  billSum: 0,
                  wkgId: i.wkgId
                }])))
              }
              this.$set(i, 'customerFenpeiList1', JSON.parse(JSON.stringify(i.customerFenpeiList)))
            })
          })
          this.$forceUpdate()
        })
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
    }
  }
</script>

<style lang="scss" scoped>
  .divider {
    height: 30px;
    line-height: 30px;
    background-color: #E8ECF5;
    width: 100%;
    border-left: 1px solid #DFDFDF;
    border-right: 1px solid #DFDFDF;
    font-size: 12px;
    padding-left: 15px;
    color: #000000;
  }

  .tableList {
    display: flex;
    flex-direction: column;
    border-top: 1px solid #DFDFDF;

    .tableRow {
      width: 100%;
      display: flex;
      border: 1px solid #DFDFDF;
      border-right: none;
      border-top: none;
      flex: 1;

      .tableCell {
        min-width: 130px;
        flex: 1;
        background-color: #fff;
        /*border: 1px solid #DFDFDF;*/
        padding: 10px 15px;
        font-size: 12px;
        border-top: none;
        border-right: 1px solid #DFDFDF;
        /*border-bottom: 1px solid #DFDFDF;*/
      }
    }
  }

  .custTable {
    position: absolute;
    width: 700px;
    height: 400px;
    background-color: #fff;
    border: 1px solid #D7D7D7;
    top: 30px;
    left: -47px;
    padding: 10px;
  }

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

  > > > .jh-virtual-select {
    /*width: 70% !important;*/

    .inner-text {
      div {
        span {
          overflow: hidden;
          height: 32px !important;
          line-height: 37px;
          display: inline-block;
        }
      }
    }
  }

  .workgroup {
    display: flex;
    /*justify-content: start;*/
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
