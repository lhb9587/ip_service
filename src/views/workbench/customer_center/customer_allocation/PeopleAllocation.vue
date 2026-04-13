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
    <div class="tableList">
      <div v-for="(item, index) in groupList1" :key="item.label" class="tableRow">
        <div class="tableCell">{{item.label}}</div>
        <div class="tableCell" v-for="(it, key) in item.data" :key="it.name">
          <div>
            <template v-if="item.label === '负责人列表'">
              <el-select
                size="mini"
                :disabled="!editStatus"
                v-if="!versionView"
                @change="(id) => changeUserBySelect(id, it, item, key, true)"
                default-first-option
                :clearable='true'
                placeholder="请选择负责人"
                v-model="it.userId"
                filterable
              >
                <el-option
                  v-for="p in fzUserList"
                  :key="p.userId" :label="p.fullname" :value="p.userId" :disabled="p.disabled">
                  <UserIconAndUserName :user-id="p.userId"></UserIconAndUserName>
                </el-option>
              </el-select>
              <!--              <virtual-select :disabled="!editStatus" v-if="!versionView"-->
              <!--                              :filterMethod="filterMethod"-->
              <!--                              @change="(id) => changeUserBySelect(id, it, item, key, index)"-->
              <!--                              :key="it.userId"-->
              <!--                              size="mini" placeholder="请选择负责人" style="width: 200px;" class="virtual-select"-->
              <!--                              :data="fzUserList.filter(k => !item.data.find(j => j.userId === k.userId && j.userId !== it.userId))"-->
              <!--                              v-model="it.userId" :clearable="!!it.userId"-->
              <!--                              filterable>-->
              <!--              </virtual-select>-->
              <div v-else>{{it.userName}}</div>
            </template>

            <template v-if="item.label === '领域'">
              <el-select v-if="!versionView" :disabled="!editStatus" size="mini" class="" default-first-option
                         :clearable='true'
                         placeholder="请选择" multiple
                         v-model="it.userDomainList" filterable @change="(v) => changeDomain(v, it, item, key, index)">
                <el-option v-for="domain in userDomainList" :key="domain"
                           :label="domain" :value="domain">
                </el-option>
              </el-select>
              <div v-else>{{it.userDomainList.join(',')}}</div>
            </template>

            <template v-if="item.label === '角色'">
              <el-select size="mini" :disabled="!editStatus" v-if="!versionView"
                         @change="(v) => changeRole(v, it, item, key, index)"
                         default-first-option :clearable='true' placeholder="请选择"
                         v-model="it.principalRole" filterable>
                <el-option v-for="role in roleList" :key="role.id" :label="role.typeName" :value="role.id">
                </el-option>
              </el-select>
              <div v-else>
                {{it.principalRoleStr}}
              </div>
            </template>
            <template v-if="item.label === '更新日期'">
              <el-date-picker size="mini" style="width: 100%;" :disabled="!editStatus" v-if="!versionView" v-model="it.updateDate"
                              format='yyyy-MM-dd'
                              value-format="yyyy-MM-dd" align="right" type="date" placeholder="选择日期"
                              >
              </el-date-picker>
              <div v-else>
                {{it.updateDate}}
              </div>
            </template>
            <template v-if="item.label === '特殊分配比例'">
              <div v-if="!versionView" style="display: flex;align-items: center">
                <el-input size="mini" :disabled="!editStatus"  v-model="it.specialRatio"></el-input>
                <span style="margin-left: 5px;">%</span>
              </div>
              <div v-else>
                {{it.specialRatio}}%
              </div>
            </template>
            <div v-if="item.label === '现有客户'">{{it.custList.filter(c => c.custId).length || ''}}
              <div v-if="it.userName && editStatus" style="margin-left: 15px;position:relative;" class="pointer"
                   @click="openCustList(it.custList, item, key)">
                <img src="../customer_list/assets/images/allocation.svg" alt="" height="14px">
                <span style="font-size: 14px">配置</span>
                <div v-if="custTableIndex === key && custTableView" class="custTable"
                     v-clickoutside="clickoutside">
                  <div class="divider" style="font-size: 14px">{{userName}}-客户管理</div>
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
                    <el-table-column label="客户负责人" align="left" width="440px">
                      <template slot-scope="scope">
                        <div v-for="(fenpei, id) in scope.row.customerResponsibleList" :key="id"
                             class="workgroup">
                          <el-select
                            size="mini"
                            style="width: 70%"
                            v-if="(!scope.row.isAddFlag && !fenpei.id) || fenpei.switchGroup"
                            default-first-option
                            :clearable='true'
                            placeholder="请选择负责人"
                            v-model="fenpei.userId"
                            filterable
                          >
                            <el-option
                              v-for="p in fzUserList"
                              :key="p.userId" :label="p.fullname" :value="p.userId">
                              <UserIconAndUserName :user-id="p.userId"></UserIconAndUserName>
                            </el-option>
                          </el-select>
                          <!--                          <virtual-select v-if="(!scope.row.isAddFlag && !fenpei.id) || fenpei.switchGroup"-->
                          <!--                                          size="mini" placeholder="请选择负责人"-->
                          <!--                                          :filterMethod="filterMethod"-->
                          <!--                                          style="width: 70%" class="virtual-select" clearable-->
                          <!--                                          :data="fzUserList.filter(w => !scope.row.customerResponsibleList.find(s => s.userId === w.userId && w.userId !== fenpei.userId))"-->
                          <!--                                          v-model="fenpei.userId" clearable-->
                          <!--                                          filterable>-->
                          <!--                          </virtual-select>-->
                          <div v-if="fenpei.id && !fenpei.switchGroup && fzUserList.find(p => p.userId ===
                              fenpei.userId)">
                            <el-popover
                              ref="domainRef"
                              placement="bottom-start"
                              width="400"
                              trigger="click"
                            >
                              <div>
                                <el-form size="mini" label-width="80px">
                                  <el-form-item label="角色:" style="margin-bottom: 10px">
                                    <div style="display: flex;flex-direction: row">
                                      <el-select

                                        default-first-option :clearable='true' placeholder="请选择"
                                        v-model="fenpei.principalRole" filterable>
                                        <el-option v-for="role in roleList" :key="role.id" :label="role.typeName"
                                                   :value="role.id">
                                        </el-option>
                                      </el-select>
                                      <div>
                                        <el-button size="mini" style="margin-left: 10px" type="primary"
                                                   @click="changUserDomain(fenpei, scope.row.custId, scope.row)">确定
                                        </el-button>
                                      </div>
                                    </div>
                                  </el-form-item>
                                  <el-form-item label="领域:" style="margin-bottom: 0">
                                    <div style="border: 1px solid #D7D7D7;border-bottom: none;border-right: none">
                                      <div v-for="(domainItem, dIndex) in fenpei.responseExtList" :key="dIndex"
                                           style="display: flex;">
                                        <div
                                          style="flex: 1;height: 40px;display: flex;align-items: center;justify-content: center;border-bottom: 1px solid #D7D7D7;border-right: 1px solid #D7D7D7;">
                                          <el-select style="margin: 0 3px" size="mini" class="" default-first-option
                                                     @change="(v) => changeFenpeiDomain(v, fenpei, dIndex, key)"
                                                     :clearable='true'
                                                     placeholder="请选择"
                                                     v-model="domainItem.domain" filterable
                                          >
                                            <el-option
                                              v-for="domain in userDomainList"
                                              :key="domain"
                                              :disabled="!!fenpei.responseExtList.find(k => k.domain === domain)"
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
                                    <!--                                    <div style="display: flex">-->
                                    <!--                                      <el-select size="mini" class="" default-first-option-->
                                    <!--                                                 :clearable='true'-->
                                    <!--                                                 placeholder="请选择" multiple-->
                                    <!--                                                 v-model="fenpei.domainList" filterable-->
                                    <!--                                      >-->
                                    <!--                                        <el-option-->
                                    <!--                                          v-for="domain in ['商标申请','商标诉讼','专利申请','专利诉讼','调查保护', '著作权', '域名', '其他']"-->
                                    <!--                                          :key="domain"-->
                                    <!--                                          :label="domain" :value="domain">-->
                                    <!--                                        </el-option>-->
                                    <!--                                      </el-select>-->
                                    <!--                                    </div>-->
                                  </el-form-item>
                                </el-form>
                              </div>
                              <span slot="reference" title="配置领域收入和角色">
                              {{$store.getters.userList.find(p => p.userId ===
                            fenpei.userId).fullname
                            }}
                            </span>
                            </el-popover>
                          </div>
                          <div style="margin-left: 5px">
                              <span v-if="fenpei.isAddFlag && !scope.row.isAddFlag" class="pointer"
                                    @click="addFenpei(fenpei, scope.row)">添加</span>
                            <template v-if="!fenpei.isAddFlag && $store.getters.userList.find(p => p.userId ===
                              fenpei.userId)">
                                <span class="pointer" v-if="!fenpei.switchGroup"
                                      @click="switchFunc(true, fenpei, scope.row)">转让</span>
                              <span v-else>
                                <span class="pointer" @click="switchFunc(false, fenpei, scope.row)">确定</span>
                                <span class="pointer" @click="fenpei.switchGroup = false">取消</span>
                              </span>
                              <span class="pointer" style="margin-left: 10px"
                                    @click="delFenpei(fenpei, scope.row)">删除</span>
                            </template>
                          </div>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="divider">账单收入</div>
    <div class="tableList">
      <div v-for="(item, index) in billList1" :key="item.label" class="tableRow">
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
            <div v-if="item.label === '去年收入' && custData.custId">{{it.value || ''}}</div>
            <span v-if="item.label === '本年累计收入'">{{it.value || ''}}</span>
            <div v-if="item.label === '分配估算收入'">
              <el-popover
                v-if="custData.custId && !versionView"
                placement="bottom-start"
                width="350"
                trigger="click"
              >
                <div style="border: 1px solid #D7D7D7;border-bottom: none;border-right: none">
                  <div v-for="(domainItem, dIndex) in groupList1[1].data[key].responseExtList" :key="dIndex"
                       style="display: flex;">
                    <div
                      style="flex: 1;height: 40px;display: flex;align-items: center;justify-content: center;border-bottom: 1px solid #D7D7D7;border-right: 1px solid #D7D7D7;">
                      {{domainItem.domain}}
                    </div>
                    <div
                      style="flex: 1;padding: 0 3px;height: 40px;display: flex;align-items: center;justify-content: center;border-bottom: 1px solid #D7D7D7;border-right: 1px solid #D7D7D7;">
                      <el-input type="number" size="small" v-model="domainItem.billSum"></el-input>
                      <!--                      {{domainItem.billSum}}-->
                    </div>
                  </div>
                </div>
                <div style="display: flex;justify-content: space-between;align-items: center;margin-top: 5px">
                  <div>合计: {{changeDomainSum(groupList1[1].data[key], key)}}</div>
                  <el-button size="mini" type="primary" @click="changeDomainSum(groupList1[1].data[key], key, true)">
                    确定
                  </el-button>
                </div>
                <div slot="reference" style="cursor: pointer" v-if="custData.custId && !versionView">
                  <!--            groupList1[1].data[innerIndex], 'responseExtList'      -->
                  {{it.value || 0}}
                  <span class="el-icon-edit pointer" style="font-size: 18px"></span>
                </div>
              </el-popover>
              <div v-else>
                {{it.value || 0}}
              </div>

            </div>
            <span v-if="item.label === '预计收入变动'">
              {{(it.value == 0 || it.value === null || it.value === undefined) ? '' : it.value > 0 ? `增加${it.value}` : `减少${Math.abs(it.value)}`}}
            </span>
          </template>
        </div>
      </div>
    </div>
    <div class="divider">人均产值</div>
    <div class="tableList">
      <div v-for="(item, index) in outputList1" :key="item.label" class="tableRow">
        <div class="tableCell">{{item.label}}</div>
        <div class="tableCell" v-for="(it, key) in item.data" :key="key.value">{{it.value}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    addFenpeiForResponsible,
    delFenpeiForResponsible, getBusinessUser, queryCustomerFenpeiRecord,
    queryCustomerFenpeiVersion,
    queryCustomerNameId,
    querycustSelectClass,
    queryDetailByUserId,
    queryFenpeiForResponsible,
    queryFenpeiRecordForResponsible,
    queryResopnseDomainList,
    queryTongjiForResponsible,
    saveFenpeiForResponsible,
    updateCustomerFenpeiById,
    updateFenpeiForResponsible
  } from "../../../../api/customerList";
  import {queryUserByRoleId} from "../../../../api/caseList";

  export default {
    name: "PeopleAllocation",
    props: {
      editStatus: {
        type: Boolean,
        default: true
      },
      custData: {
        type: Object,
        default: () => ({customerResponsibleArray: []})
      }
    },
    watch: {
      fzUserList: {
        handler(n) {
          if (n.length) {
            this.cssFlag = true
          } else {
            this.cssFlag = false
          }
        },
        deep: true
      },
      custData(n) {
        this.init()
      },
    },
    data() {
      return {
        responsibleList: [],
        cssFlag: false,
        fzUserList: [],
        backData: null,
        userDomainList: [],
        roles: [],
        groupList1: [
          {
            label: '负责人列表',
            data: [
              {
                name: '',
                userId: '',
                userName: '',
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
        billList1: [
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
              //   name: '增加239,011.25'
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
        outputList1: [
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
        userId: '',
        userName: '',
        fenpeiType: 1,
        mubiaoIdList: [],
        caozuo: '',
        custTableView: false,
        custTableIndex: -1,
        custNameList: [],
        billTableView: false,
        roleList: [],
        versionView: false,
        versionName: '',
        versionId: '',
      }
    },
    created() {
      // getBusinessUser().then(res => {
      //   this.fzUserList = res.data.map(item => ({
      //     userId: item.userId,
      //     fullname: item.fullname,
      //     value: item.userId,
      //     label: item.fullname
      //   }))
      // })
      querycustSelectClass({classId: "1156"}).then(response => {
        if (response.success) {
          this.roleList = response.data["1156"].filter(item => item.typeName !== '客户协调人')
        } else {
          this.$message.error(response.message)
        }
      })
      this.fzUserList = [...this.$store.getters.userList]
      this.init()
    },
    methods: {
      filterMethod(text) {
        // if (!this.custData.customerResponsibleArray) {
        //   this.custData.customerResponsibleArray = []
        // }
        // if (text == '') {
        //   this.fzUserList = this.responsibleList.filter(item => this.custData.customerResponsibleArray.map(itm => itm.userId).includes(item.userId))
        //   return
        // }
        // let list = [...this.responsibleList.filter(item => this.custData.customerResponsibleArray.map(itm => itm.userId).includes(item.userId)), ...this.responsibleList.filter(item => item.fullname.includes(text))]
        // this.fzUserList = this.$commonUtils.unique(list, 'userId')
      },
      refreshVersion() {
        this.saveCustomerUser()
        this.versionView = false
        this.versionName = ''
        this.backData = null
        this.versionId = ''
      },
      goBack() {
        this.$emit('updateVersion', false)
        this.versionView = false
        this.versionName = ''
        this.groupList1 = this.backData.groupList1
        this.billList1 = this.backData.billList1
        this.outputList1 = this.backData.outputList1
        this.backData = null
      },
      queryVersionData(versionId) {
        this.versionId = versionId
        queryFenpeiRecordForResponsible({
          custId: this.custData.custId,
          versionId
        }).then(res => {
          this.versionView = true
          if (!this.backData) {
            this.backData = {
              groupList1: JSON.parse(JSON.stringify(this.groupList1)),
              billList1: JSON.parse(JSON.stringify(this.billList1)),
              outputList1: JSON.parse(JSON.stringify(this.outputList1))
            }
          }
          this.$set(this, 'groupList1', [
            {
              label: '负责人列表',
              data: []
            },
            {
              label: '领域',
              data: []
            },
            {
              label: '角色',
              data: []
            }
          ],)
          this.$set(this, 'billList1', [
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
                //   name: '增加239,011.25'
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
          this.$set(this, 'outputList1', [
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
          this.versionName = res.data[0] && res.data[0].customerResponsibleList[0].createTime
          if (res.data[0] && res.data[0].customerResponsibleList) {
            res.data[0] && res.data[0].customerResponsibleList.forEach((data, innerIndex) => {
              this.$set(this.groupList1[0].data, innerIndex, {})
              this.$set(this.groupList1[1].data, innerIndex, {})
              this.$set(this.groupList1[2].data, innerIndex, {})
              this.$set(this.groupList1[3].data, innerIndex, {})
              this.$set(this.groupList1[4].data, innerIndex, {})
              this.$set(this.billList1[0].data, innerIndex, {})
              this.$set(this.billList1[1].data, innerIndex, {})
              this.$set(this.billList1[2].data, innerIndex, {})
              this.$set(this.billList1[3].data, innerIndex, {})
              this.$set(this.outputList1[0].data, innerIndex, {})
              this.$set(this.outputList1[1].data, innerIndex, {})


              this.$set(this.groupList1[0], 'userId', data.userId)
              this.$set(this.groupList1[0], 'userName', this.$store.getters.userList.find(item => item.userId === data.userId).fullname)
              this.$set(this.groupList1[0].data[innerIndex], 'userName', this.$store.getters.userList.find(item => item.userId === data.userId).fullname)

              this.$set(this.groupList1[0].data[innerIndex], 'userId', data.userId)
              this.$set(this.groupList1[0].data[innerIndex], 'isCreate', false)
              this.$set(this.groupList1[1], 'userId', data.userId)
              this.$set(this.groupList1[1], 'userName', this.$store.getters.userList.find(item => item.userId === data.userId).fullname)
              this.$set(this.groupList1[1].data[innerIndex], 'userName', this.$store.getters.userList.find(item => item.userId === data.userId).fullname)
              this.$set(this.groupList1[1].data[innerIndex], 'userId', data.userId)
              this.custData.custId && this.$set(this.groupList1[2].data[innerIndex], 'principalRole', '')
              this.custData.custId && this.$set(this.groupList1[3].data[innerIndex], 'updateDate', '')
              this.custData.custId && this.$set(this.groupList1[4].data[innerIndex], 'specialRatio', '')
              // 'id' 分配id暂且放在this.groupList1[1].data[innerIndex]领域信息下，保存分配会用到
              this.$set(this.groupList1[1].data[innerIndex], 'id', data.id || '')
              this.$set(this.groupList1[1].data[innerIndex], 'userDomainList', data.userDomains || [])
              this.$set(this.groupList1[1].data[innerIndex], 'responseExtList', data.responseExtList || [])
              // responseExtList1用作备份，后续清空领域再增加还会保留原来的数值
              this.$set(this.groupList1[1].data[innerIndex], 'responseExtList1', JSON.parse(JSON.stringify(data.responseExtList || [])))
              this.$set(this.groupList1[2].data[innerIndex], 'principalRole', data.principalRole || '')
              this.$set(this.groupList1[2].data[innerIndex], 'principalRoleStr', data.principalRoleStr || '')
              this.$set(this.groupList1[3].data[innerIndex], 'updateDate', data.updateDate || '')
              this.$set(this.groupList1[4].data[innerIndex], 'specialRatio', data.specialRatio || '')
              this.queryUserData(data.userId, this.custData.custId, undefined, [], innerIndex)
            })
          }
        })
      },
      changUserDomain(row, custId, outRow) {
        let responseList = JSON.parse(JSON.stringify(outRow.customerResponsibleList && outRow.customerResponsibleList.filter(item => !item.isAddFlag) || []))
        responseList.forEach(item => {
          item.custId = custId
          item.responseExtList = item.responseExtList.filter(item => item.domain)
          item.userDomain = item.responseExtList.map(i => i.domain).join(',')
        })
        saveFenpeiForResponsible({responseList}).then(res => {
          this.$message.success('保存成功!')
          this.updateUserFenpei([], this.custData.custId, undefined, [])
        })
      },
      changeFenpeiDomainAndBillSum(fenpei, index, outIndex) { // 负责人配置中的领域收入更改
        let startValue = 0
        let endValue = 0
        if (this.groupList1[1].data[outIndex].custList) {
          startValue = this.groupList1[1].data[outIndex].custList
            .filter(item => !item.isAddFlag)
            .map(item => item.customerResponsibleList)
            .filter(item => !item.isAddFlag)
            .flat()
            .filter(item => !item.isAddFlag)
            .map(item => item.responseExtList1)
            .flat()
            .reduce((pre, next) => +pre + (Number.isNaN(Number(next.billSum)) ? 0 : +next.billSum), 0)
          endValue = this.groupList1[1].data[outIndex].custList
            .filter(item => !item.isAddFlag)
            .map(item => item.customerResponsibleList)
            .filter(item => !item.isAddFlag)
            .flat()
            .filter(item => !item.isAddFlag)
            .map(item => item.responseExtList)
            .flat()
            .reduce((pre, next) => +pre + (Number.isNaN(Number(next.billSum)) ? 0 : +next.billSum), 0)
          this.$set(this.billList1[2].data[outIndex], 'value', endValue.toFixed(2))
          this.$set(this.billList1[3].data[outIndex], 'value', (endValue - startValue).toFixed(2))
          // this.$set(this.outputList1[1].data[index], 'value', data.rjgusuan + ` [${data.userCount}人]`)
          const userCount = this.outputList1[1].data[outIndex].value.match(/\/\s\d+/g) && this.outputList1[1].data[outIndex].value.match(/\/\s\d+/g)[0].match(/\d+/) && this.outputList1[1].data[outIndex].value.match(/\/\s\d+/g)[0].match(/\d+/)[0] || 0
          if (userCount && userCount !== '0') {
            this.$set(this.outputList1[1].data[outIndex], 'value', (endValue / userCount).toFixed(2) + ` [${userCount}人]`)
          } else {
            this.$set(this.outputList1[1].data[outIndex], 'value', '')
          }
        }
      },
      changeFenpeiDomain(value, row, index, outIndex) {
        if (!value) {
          row.responseExtList.splice(index, 1)
        }
        if (!row.responseExtList.find(item => !item.domain)) {
          row.responseExtList.push({userId: row.userId, domain: '', billSum: 0})
        }
        this.changeFenpeiDomainAndBillSum(row, index, outIndex)
      },
      changeDomainSum(col, index, isComputed) { // 明确客户下的领域收入修改
        const startValue = col.responseExtList1 && col.responseExtList1.reduce((pre, next) => +pre + (Number.isNaN(Number(next.billSum)) ? 0 : +next.billSum), 0) || 0
        const endValue = col.responseExtList && col.responseExtList.reduce((pre, next) => +pre + (Number.isNaN(Number(next.billSum)) ? 0 : +next.billSum), 0) || 0
        if (isComputed) {
          this.$set(this.billList1[2].data[index], 'value', 0)
          this.$nextTick(() => {
            this.$set(this.billList1[2].data[index], 'value', endValue.toFixed(2))
          })
          this.$set(this.billList1[3].data[index], 'value', (endValue - startValue).toFixed(2))
          const userCount = this.outputList1[1].data[index].value.match(/\/\s\d+/g) && this.outputList1[1].data[index].value.match(/\/\s\d+/g)[0].match(/\d+/) && this.outputList1[1].data[index].value.match(/\/\s\d+/g)[0].match(/\d+/)[0] || 0
          if (userCount && userCount !== '0') {
            this.$set(this.outputList1[1].data[index], 'value', (endValue / userCount).toFixed(2) + ' / ' + userCount + '人')
          } else {
            this.$set(this.outputList1[1].data[index], 'value', '')
          }
        }
        return endValue.toFixed(2)
      },
      saveCustomerUser() {
        // 客户下保存分配
        // userId
        // custId
        // userDomain 负责领域（用"，"隔开）
        // responseExtList

        let responseList = []
        const length = this.groupList1[0].data.filter(item => !item.isCreate).length
        for (let i = 0; i < length; i++) {
          responseList[i] = {
            id: this.groupList1[1].data[i].id || '',
            userId: this.groupList1[0].data[i].userId,
            custId: this.custData.custId,
            userDomain: this.groupList1[1].data[i].userDomainList && this.groupList1[1].data[i].userDomainList.join(','),
            responseExtList: this.groupList1[1].data[i].responseExtList && this.groupList1[1].data[i].responseExtList.filter(j => j.domain) || [],
            principalRole: this.groupList1[2].data[i].principalRole || '',
            updateDate: this.groupList1[3].data[i].updateDate || '',
            specialRatio: this.groupList1[4].data[i].specialRatio || '',
          }
        }
        saveFenpeiForResponsible({responseList, custId: this.custData.custId}).then(res => {
          this.$message.success('保存成功!')
          this.$emit('updateVersion', true)
          this.updateUserFenpei([], this.custData.custId, undefined, [])
        })
      },
      queryUserDomainList() {
        queryResopnseDomainList().then(res => {
          this.userDomainList = res.data
        })
      },
      init() {
        if (!this.userDomainList.length) {
          this.queryUserDomainList()
        }
        // 任务5206，增加负责人列表选择范围
        // queryUserByRoleId({roleId: '2049,1,1013,1014,2151,2152'}).then(res => {
        //   // if (!this.custData.customerResponsibleArray) {
        //   //   this.custData.customerResponsibleArray = []
        //   // }
        //   this.responsibleList = res.data
        //   this.fzUserList = this.responsibleList
        //     // .filter(item => this.custData.customerResponsibleArray.map(itm => itm.userId).includes(item.userId))
        // })
        if (this.custData.custId) {
          this.$set(this, 'groupList1', [
            {
              label: '负责人列表',
              data: []
            },
            {
              label: '领域',
              data: []
            },
            {
              label: '角色',
              data: []
            },
            {
              label: '更新日期',
              data: []
            },
            {
              label: '特殊分配比例',
              data: []
            }
          ],)
          this.$set(this, 'billList1', [
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
                //   name: '增加239,011.25'
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
          this.$set(this, 'outputList1', [
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

          this.custData.customerResponsibleArray && this.custData.customerResponsibleArray.length && this.custData.customerResponsibleArray.forEach(item => {
            this.groupList1[0].userId = item.userId
            this.groupList1[0].id = item.id
            const ishasUser = this.$store.getters.userList.find((user)=>{
              return user.userId == item.userId
            })
            
            if(!ishasUser){
              this.fzUserList.push({
                disabled: true,
                userId: item.userId,
                fullname: this.$commonUtils.transformation(this.$store.getters.allUserList, item.userId, 'userId', 'fullname')
              })
            }
            this.groupList1[0].data.push({
              id: item.id,
              userId: item.userId,
              userName: this.$commonUtils.transformation(this.$store.getters.userList, item.userId, 'userId', 'fullname')
            })
            this.groupList1[1].data.push({
              userDomainList: item.userDomains
            })
            this.groupList1[2].data.push({
              principalRole: item.principalRole
            })
            this.groupList1[3].data.push({
              updateDate: item.updateDate
            })
            this.groupList1[4].data.push({
              specialRatio: item.specialRatio
            })
            this.billList1[0].data.push({})
            this.billList1[1].data.push({})
            this.billList1[2].data.push({})
            this.billList1[3].data.push({})
            this.outputList1[0].data.push({})
            this.outputList1[1].data.push({})
          })
          this.groupList1[0].data.push({
            userId: '',
            userName: '',
            isCreate: true
          })
          this.groupList1[1].data.push({
            userDomainList: [],
            isCreate: true
          })
          this.custData.custId && this.groupList1[2].data.push({
            principalRole: '',
            isCreate: true
          })
          this.groupList1[3].data.push({
            updateDate: '',
            isCreate: true
          })
          this.groupList1[4].data.push({
            specialRatio: '',
            isCreate: true
          })
          this.groupList1[0].data.filter(item => !item.isCreate).forEach((item, index) => {
            this.changeUser(item.userId, item, this.groupList1[0], index, 0, this.custData.custId)
          })
        } else {
          this.$set(this, 'groupList1', [
            {
              label: '负责人列表',
              data: [
                {
                  name: '',
                  userId: '',
                  userName: '',
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
          this.$set(this, 'billList1', [
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
                //   name: '增加239,011.25'
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
          this.$set(this, 'outputList1', [
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
      changeRole(v, innerRow, outerRow, innerIndex, outerIndex) {
        // this.changeDomain(this.groupList1[1].data[innerIndex].userDomainList, innerRow, outerRow, innerIndex, outerIndex)
      },
      changeDomain(v, innerRow, outerRow, innerIndex, outerIndex) {
        this.$set(this.groupList1[outerIndex].data[innerIndex], 'userDomain', v.join(','))
        if (!v || v && !v.length) {
          this.$set(innerRow, 'responseExtList', [])
          // innerRow.responseExtList = []
        } else {
          const list = JSON.parse(JSON.stringify(innerRow.responseExtList1 || []))
          this.$set(innerRow, 'responseExtList', [])
          // innerRow.responseExtList = []
          v.forEach(item => {
            if (list.find(j => j.domain == item)) {
              innerRow.responseExtList.push(list.find(j => j.domain == item))
            } else {
              innerRow.responseExtList.push({
                userId: innerRow.userId,
                domain: item,
                billSum: 0
              })
            }
          })
        }
        this.changeDomainSum(innerRow, innerIndex, true)
      },
      resetFenpei() {
        this.groupList1 = [
          {
            label: '负责人列表',
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
        this.billList1 = [
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
              //   name: '增加239,011.25'
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
        this.outputList1 = [
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
      switchFunc(flag, row, outRow) {
        this.$set(row, 'switchGroup', flag)
        if (flag) { // 转组
          this.mubiaoIdList[0] = row.userId
        } else { // 确定
          outRow.customerResponsibleList.forEach(item => {
            item.custId = outRow.custId
            item.responseExtList = item.responseExtList.filter(item => item.domain)
            item.userDomain = item.responseExtList.map(i => i.domain).join(',')
          })
          saveFenpeiForResponsible({responseList: outRow.customerResponsibleList.filter(item => item.userId)}).then(res => {
            this.$message.success('转让成功!')
            this.updateUserFenpei([], undefined, undefined, [])
          })
          // this.mubiaoIdList[1] = row.userId
          // updateFenpeiForResponsible({...row, switchGroup: undefined, custId}).then(res => {
          //   this.$message.success('转让成功!')
          //   this.updateUserFenpei([], custId, 3, this.mubiaoIdList)
          // })
        }
      },
      changeCust(custId, row) {
        row.name = this.custNameList.find(item => item.custId === custId).fullname
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
      addCust(row) {
        if (!row.custId) return
        row.customerResponsibleList.forEach(item => {
          item.custId = row.custId
          item.userId = this.userId
        })
        saveFenpeiForResponsible({responseList: row.customerResponsibleList}).then(res => {
          this.$message.success('添加成功!')
          // row.customerResponsibleList = row.customerResponsibleList.filter(item => item.userId && item.userId != fenpei.userId)
          this.updateUserFenpei([], undefined, undefined, [])
        })
      },
      delFenpei(fenpei, row) {
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          row.customerResponsibleList.forEach(item => {
            item.custId = row.custId
            item.responseExtList = item.responseExtList.filter(item => item.domain)
            item.userDomain = item.responseExtList.map(i => i.domain).join(',')
          })
          saveFenpeiForResponsible({responseList: row.customerResponsibleList.filter(item => item.userId && item.userId != fenpei.userId)}).then(res => {
            this.$message.success('删除成功!')
            // row.customerResponsibleList = row.customerResponsibleList.filter(item => item.userId && item.userId != fenpei.userId)
            this.updateUserFenpei([], undefined, undefined, [])
          })
        })
      },
      addFenpei(fenpei, row) {
        if (!fenpei.userId) return
        row.customerResponsibleList.forEach(item => {
          item.custId = row.custId
          item.responseExtList = item.responseExtList.filter(item => item.domain)
          item.userDomain = item.responseExtList.map(i => i.domain).join(',')
        })
        saveFenpeiForResponsible({responseList: row.customerResponsibleList.filter(item => item.userId)}).then(res => {
          this.$message.success('添加成功!')
          this.updateUserFenpei([], undefined, undefined, [])
        })
      },
      updateUserFenpei(list, custId, caozuo, mubiaoIdList) {
        // let wkgIdList = [...new Set(list.map(item => item.wkgId)), this.wkgId]
        this.groupList1[0].data.filter(item => !item.isCreate).forEach((item, index) => {
          this.changeUser(item.userId, item, this.groupList1[0], index, 0, custId, caozuo, mubiaoIdList, false)
        })
      },
      clickoutside() {
        this.custTableIndex = -1
        this.custTableView = false
      },
      openCustList(list, outerRow, index) {
        this.custList = list
        this.userName = outerRow.userName
        this.userId = outerRow.userId
        this.custTableView = true
        this.custTableIndex = index
      },
      async changeUserBySelect(userId, innerRow, outerRow, innerIndex, handleRepeat) {
        const mubiaoUserId = outerRow.userId
        const isCreate = this.groupList1[0].data[innerIndex].isCreate
        if (this.custData.custId) {
          // if (!userId) {
          //   innerRow.id && this.custData.custId && delFenpeiForResponsible({
          //     id: innerRow.id
          //   }).then(res => {
          //     this.$message.success('删除成功!')
          //     this.updateUserFenpei([], this.custData.custId, 2, [mubiaoUserId])
          //   })
          // } else {
          //   if (isCreate) {
          //     // 添加
          //     addFenpeiForResponsible({
          //       userId: userId,
          //       custId: this.custData.custId
          //     }).then(res => {
          //       this.$message.success('分配成功!')
          //       this.updateUserFenpei([], this.custData.custId, 1, [userId])
          //     })
          //   } else if (!isCreate && mubiaoUserId && mubiaoUserId !== userId) {
          //     // 转让
          //     updateFenpeiForResponsible({
          //       ...innerRow,
          //       switchGroup: undefined,
          //       custId: this.custData.custId
          //     }).then(res => {
          //       this.$message.success('转让成功!')
          //       this.updateUserFenpei([], this.custData.custId, 3, [mubiaoUserId, userId])
          //     })
          //   }
          // }
        }
        this.changeUser(userId, innerRow, outerRow, innerIndex, 0, this.custData.custId, undefined, [], handleRepeat)
      },
      async changeUser(userId, innerRow, outerRow, innerIndex, outerIndex, custId, caozuo, mubiaoIdList, handleRepeat) {
        if (!userId) {
          this.$set(this.groupList1[0], 'userId', '')
          this.$set(this.groupList1[0], 'userName', '')
          this.$set(this.groupList1[0].data[innerIndex], 'userName', '')
          this.$set(this.groupList1[0].data[innerIndex], 'userId', '')
          this.$set(this.groupList1[0].data[innerIndex], 'isCreate', false)

          this.$set(this.groupList1[1], 'userId', '')
          this.$set(this.groupList1[1], 'userName', '')
          this.$set(this.groupList1[1].data[innerIndex], 'userName', '')
          this.$set(this.groupList1[1].data[innerIndex], 'userId', '')
          this.$set(this.groupList1[1].data[innerIndex], 'custList', [])
          this.groupList1[0].data.splice(innerIndex, 1)
          this.groupList1[1].data.splice(innerIndex, 1)
          this.custData.custId && this.groupList1[2].data.splice(innerIndex, 1)
          this.custData.custId && this.groupList1[3].data.splice(innerIndex, 1)
          this.custData.custId && this.groupList1[4].data.splice(innerIndex, 1)
          this.billList1[0].data.splice(innerIndex, 1)
          this.billList1[1].data.splice(innerIndex, 1)
          this.billList1[2].data.splice(innerIndex, 1)
          this.billList1[3].data.splice(innerIndex, 1)
          this.outputList1[0].data.splice(innerIndex, 1)
          this.outputList1[1].data.splice(innerIndex, 1)
          return
        }
        this.$set(this.groupList1[0], 'userId', userId)
        this.$set(this.groupList1[0], 'userName', this.$store.getters.userList.find(item => item.userId === userId).fullname)
        this.$set(this.groupList1[0].data[innerIndex], 'userName', this.$store.getters.userList.find(item => item.userId === userId).fullname)
        this.$set(this.groupList1[0].data[innerIndex], 'userId', userId)
        this.$set(this.groupList1[0].data[innerIndex], 'isCreate', false)
        this.$set(this.groupList1[1], 'userId', userId)
        this.$set(this.groupList1[1], 'userName', this.$store.getters.userList.find(item => item.userId === userId).fullname)
        this.$set(this.groupList1[1].data[innerIndex], 'userName', this.$store.getters.userList.find(item => item.userId === userId).fullname)
        this.$set(this.groupList1[1].data[innerIndex], 'userId', userId)
        this.custData.custId && this.$set(this.groupList1[2].data[innerIndex], 'principalRole', '')
        this.custData.custId && this.$set(this.groupList1[3].data[innerIndex], 'updateDate', '')
        this.custData.custId && this.$set(this.groupList1[4].data[innerIndex], 'specialRatio', '')

        this.isAddUser()

        !custId && this.queryBillDetailDataByUserId(userId, innerIndex)

        this.queryFenpeiList(userId, innerRow, outerRow, innerIndex, outerIndex, handleRepeat)

        this.queryUserData(userId, custId, caozuo, mubiaoIdList, innerIndex)

      },
      queryBillDetailDataByUserId(userId, index) {
        queryDetailByUserId({
          userId
        }).then(res => {
          this.$set(this.billList1[0].data[index], 'list', res.data)
          // this.billList1[0].data[index].list = res.data
        })
      },
      queryUserData(userId, custId, caozuo, mubiaoIdList, index) {
        queryTongjiForResponsible({
          // curCustId: this.custData.custId,
          versionId: this.versionView ? this.versionId : undefined,
          userId,
          custId,
        }).then(res => {
          // res.data.[0]
//           账单收入：
//           incomeLastYear：去年收入
//           incomeCustLastYear：去年客户数量
//           incomeThisYear：本年累计收入
//           incomeCustThisYear：本年累计收入对应的客户数量
//           expectedIncome：分配估算收入
          // custCount:  分配估算收入对应的客户数量
          // custIncome 预计收入变动
          if (res.data && res.data.length) {
            const data = res.data[0]
            if (this.custData.custId) {
              this.$set(this.billList1[0].data[index], 'value', data.incomeLastYear === null ? '' : data.incomeLastYear)
              this.$set(this.billList1[1].data[index], 'value', data.incomeThisYear === null ? '' : data.incomeThisYear)
              this.$set(this.billList1[2].data[index], 'value', data.expectedIncome === null ? '' : data.expectedIncome)
              this.$set(this.billList1[3].data[index], 'value', data.custIncome === null ? '' : data.custIncome)
              this.$set(this.outputList1[0].data[index], 'value', data.rjLastYear === null ? '' : (data.rjLastYear + ' / ' + data.userCountLastYear + '人'))
              this.$set(this.outputList1[1].data[index], 'value', data.rjgusuan === null ? '' : (data.rjgusuan + ' / ' + data.userCount + '人'))
            } else {
              this.$set(this.billList1[0].data[index], 'value', data.incomeLastYear === null ? '' : (data.incomeLastYear + ' / ' + data.incomeCustLastYear))
              this.$set(this.billList1[1].data[index], 'value', data.incomeThisYear === null ? '' : (data.incomeThisYear + ' / ' + data.incomeCustThisYear))
              this.$set(this.billList1[2].data[index], 'value', data.expectedIncome === null ? '' : (data.expectedIncome + ' / ' + data.custCount))
              this.$set(this.billList1[3].data[index], 'value', data.custIncome === null ? '' : data.custIncome)
              this.$set(this.outputList1[0].data[index], 'value', data.rjLastYear === null ? '' : (data.rjLastYear + ` [${data.userCountLastYear}人]`))
              this.$set(this.outputList1[1].data[index], 'value', data.rjgusuan === null ? '' : (data.rjgusuan + ` [${data.userCount}人]`))
            }
          }


//           人均产值
//           去年数据：
//              rjLastYear：人均收入
//              userCountLastYear：去年人数
//           分配估算：
//            rjgusuan：人均收入
//           userCount：今年人数
        })
      },
      queryFenpeiList(userId, innerRow, outerRow, innerIndex, outerIndex, handleRepeat) {
        queryFenpeiForResponsible({
          userId,
          custId: this.custData.custId || undefined
        }).then(res => {
          if (!res.data.length) return
          if (this.custData.custId) {
            const data = res.data.find(item => item.custId == this.custData.custId)
            if (data.customerResponsibleList.length) {
              // 'id' 分配id暂且放在this.groupList1[1].data[innerIndex]领域信息下，保存分配会用到
              if (handleRepeat) {
                if (this.groupList1[1].data.find(item => item.userId == userId)) {
                  this.$set(this.groupList1[1].data[innerIndex], 'id', undefined)
                } else {
                  this.$set(this.groupList1[1].data[innerIndex], 'id', data.customerResponsibleList.find(i => i.id == innerRow.id) && data.customerResponsibleList.find(i => i.id == innerRow.id).id || '')
                }
              } else {
                this.$set(this.groupList1[1].data[innerIndex], 'id', data.customerResponsibleList.find(i => i.id == innerRow.id) && data.customerResponsibleList.find(i => i.id == innerRow.id).id || '')
              }
              this.$set(this.groupList1[1].data[innerIndex], 'userDomainList', data.customerResponsibleList.find(i => i.id == innerRow.id) && data.customerResponsibleList.find(i => i.id == innerRow.id).userDomain && data.customerResponsibleList.find(i => i.id == innerRow.id).userDomain.split(',') || [])
              this.$set(this.groupList1[1].data[innerIndex], 'responseExtList', data.customerResponsibleList.find(i => i.id == innerRow.id) && data.customerResponsibleList.find(i => i.id == innerRow.id).responseExtList || [])
              // responseExtList1用作备份，后续清空领域再增加还会保留原来的数值
              this.$set(this.groupList1[1].data[innerIndex], 'responseExtList1', JSON.parse(JSON.stringify(data.customerResponsibleList.find(i => i.id == innerRow.id) && data.customerResponsibleList.find(i => i.id == innerRow.id).responseExtList || [])))
              this.$set(this.groupList1[2].data[innerIndex], 'principalRole', data.customerResponsibleList.find(i => i.id == innerRow.id) && data.customerResponsibleList.find(i => i.id == innerRow.id).principalRole)
              this.$set(this.groupList1[3].data[innerIndex], 'updateDate', data.customerResponsibleList.find(i => i.id == innerRow.id) && data.customerResponsibleList.find(i => i.id == innerRow.id).updateDate)
              this.$set(this.groupList1[4].data[innerIndex], 'specialRatio', data.customerResponsibleList.find(i => i.id == innerRow.id) && data.customerResponsibleList.find(i => i.id == innerRow.id).specialRatio)
            } else {
              this.$set(this.groupList1[1].data[innerIndex], 'id', '')
              this.$set(this.groupList1[1].data[innerIndex], 'userDomainList', [])
              this.$set(this.groupList1[1].data[innerIndex], 'responseExtList', [])
              this.$set(this.groupList1[2].data[innerIndex], 'principalRole', '')
              this.$set(this.groupList1[3].data[innerIndex], 'updateDate', '')
              this.$set(this.groupList1[4].data[innerIndex], 'specialRatio', '')
            }
          } else {
            this.$set(this.groupList1[1].data[innerIndex], 'custList', res.data)
            this.groupList1[1].data[innerIndex].custList.unshift({
              isAddFlag: true,
              customerResponsibleList: []
            })
            this.groupList1[1].data[innerIndex].custList.forEach(item => {
              item.customerResponsibleList.unshift({
                isAddFlag: true
              })
              item.customerResponsibleList.forEach((i, idx) => {
                this.$set(i, 'domainList', i.userDomain ? i.userDomain.split(',') : [])
                this.$set(i, 'principalRole', i.principalRole)
                if (i.responseExtList && i.responseExtList.length) {
                  if (!i.responseExtList.find(j => !j.domain)) {
                    i.responseExtList.push({userId: i.userId, domain: '', billSum: 0})
                  }
                } else {
                  this.$set(i, 'responseExtList', JSON.parse(JSON.stringify([{
                    domain: '',
                    billSum: 0,
                    userId: i.userId
                  }])))
                }
                this.$set(i, 'responseExtList1', JSON.parse(JSON.stringify(i.responseExtList)))
                if (this.custData.custId) {
                  this.groupList1[0].data[idx] && this.$set(this.groupList1[0].data[idx], 'id', i.id)
                }
              })
            })
          }
        })
      },
      isAddUser() {
        if (!this.groupList1[0].data.find(item => item.isCreate)) {
          this.groupList1[0].data.push({isCreate: true, userId: '', userName: ''})
          this.groupList1[1].data.push({userId: '', userName: '', custList: []})
          this.custData.custId && this.groupList1[2].data.push({userId: '', userName: '', custList: []})
          this.custData.custId && this.groupList1[3].data.push({updateDate: ''})
          this.custData.custId && this.groupList1[4].data.push({specialRatio: ''})
          this.billList1[0].data.push({})
          this.billList1[1].data.push({})
          this.billList1[2].data.push({})
          this.billList1[3].data.push({})
          this.outputList1[0].data.push({})
          this.outputList1[1].data.push({})
        }
      },
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
  /deep/ input[type="number"] {
    -moz-appearance: textfield;
  }

</style>
