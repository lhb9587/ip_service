<template>
  <div style="padding: 5px 10px 5px 10px">
    <!--    顶部搜索-->
    <div class="search-box" v-if="$route.fullPath.includes('customer_allocation')">
      <div class="search-right-btn" style="margin-left: 10px">
        <el-button type="" size="mini"
                   :style="{color: fenpeiType === 2 ? '#419DFD' : '', backgroundColor: fenpeiType === 2 ? '#ECF5FF' : '', borderColor: fenpeiType === 2 ? '#C6E2FF' : ''}"
                   @click="changeFenpeiType(2)">
          <div style="display: flex;align-items: center">
            <img src="../customer_list/assets/images/u771.svg" alt="" style="margin-right: 5px">
            <span style="display: inline-block;">负责人分配</span>
          </div>
        </el-button>
        <!-- <el-button type="" size="mini"
                   :style="{color: fenpeiType === 1 ? '#419DFD' : '', backgroundColor: fenpeiType === 1 ? '#ECF5FF' : '', borderColor: fenpeiType === 1 ? '#C6E2FF' : ''}"
                   @click="changeFenpeiType(1)">
          <div style="display: flex;align-items: center">
            <img src="../customer_list/assets/images/u771.svg" alt="" style="margin-right: 5px">
            <span style="display: inline-block;">小组分配</span>
          </div>
        </el-button> -->
        <el-select
          v-model="custId"
          @change="changeCustId"
          ref="custSelect"
          filterable
          clearable
          remote
          reserve-keyword
          placeholder="客户查询"
          style="margin-left: 10px"
          :remote-method="remoteSearch"

        >
          <el-option
            v-for="item in queryCustomerNameIdList"
            :key="item.custId"
            :label="item.fullname"
            :value="item.custId"
          >
          </el-option>
        </el-select>
        <el-button v-if="custId" type="" size="mini" style="margin-left: 10px" @click="saveFenpei">
          <div style="display: flex;align-items: center">
            <i class="el-icon-circle-check-outline" style="font-size: 18px;color:#409EFF;"></i>
            <span style="display: inline-block;">保存分配</span>
          </div>
        </el-button>
        <el-dropdown v-if="custId" @command="changeVersion">
          <el-button type="" size="mini" style="margin-left: 10px" @click="">
            <div style="display: flex;align-items: center">
              <i class="el-icon-time" style="font-size: 18px;color:#409EFF;"></i>
              <span style="display: inline-block;">分配记录</span>
            </div>
          </el-button>
          <el-dropdown-menu v-if="fenpeiType === 2" slot="dropdown">
            <el-dropdown-item v-for="(item, index) in userVersionList" :command="item.versionId" :key="index">
              {{item.createTime}}
            </el-dropdown-item>
          </el-dropdown-menu>
          <el-dropdown-menu v-if="fenpeiType === 1" slot="dropdown">
            <el-dropdown-item v-for="(item, index) in wkgVersionList" :command="item.versionId" :key="index">
              {{item.createTime}}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <div v-else
         style="display: flex;align-items: center;background-color: #fff;height: 45px;margin: 0 10px;padding-left: 5px">
      <img @click="$emit('fenPeiClick', true)" style="cursor: pointer" src="../customer_list/assets/images/back.svg"
           alt="" width="26">
      <span style="font-size: 16px;font-weight: bold">客户分配-综合对比（{{fenpeiType === 1 ? '组' : '负责人'}}分配参考）</span>
      <el-button
        :style="{color: fenpeiType === 2 ? '#419DFD' : '', backgroundColor: fenpeiType === 2 ? '#ECF5FF' : '', borderColor: fenpeiType === 2 ? '#C6E2FF' : ''}"
        type="" size="mini" @click="changeFenpeiType(2)">
        <div style="display: flex;align-items: center">
          <img src="../customer_list/assets/images/u771.svg" alt="" style="margin-right: 5px">
          <span style="display: inline-block;">负责人分配</span>
        </div>
      </el-button>
      <!-- <el-button type="" size="mini"
                 :style="{color: fenpeiType === 1 ? '#419DFD' : '', backgroundColor: fenpeiType === 1 ? '#ECF5FF' : '', borderColor: fenpeiType === 1 ? '#C6E2FF' : ''}"
                 @click="changeFenpeiType(1)">
        <div style="display: flex;align-items: center">
          <img src="../customer_list/assets/images/u771.svg" alt="" style="margin-right: 5px">
          <span style="display: inline-block;">小组分配</span>
        </div>
      </el-button> -->
      <el-button :disabled="versionView" v-if="editStatus" type="" size="mini" style="margin-left: 10px"
                 @click="saveFenpei">
        <div style="display: flex;align-items: center">
          <i class="el-icon-circle-check-outline" style="font-size: 18px;color:#409EFF;"></i>
          <span style="display: inline-block;">保存分配</span>
        </div>
      </el-button>
      <el-dropdown v-if="editStatus" @command="changeVersion">
        <el-button type="" size="mini" style="margin-left: 10px" @click="">
          <div style="display: flex;align-items: center">
            <i class="el-icon-time" style="font-size: 18px;color:#409EFF;"></i>
            <span style="display: inline-block;">分配记录</span>
          </div>
        </el-button>
        <el-dropdown-menu v-if="fenpeiType === 2" slot="dropdown">
          <el-dropdown-item v-for="(item, index) in userVersionList" :command="item.versionId" :key="index">
            {{item.createTime}}
          </el-dropdown-item>
        </el-dropdown-menu>
        <el-dropdown-menu v-if="fenpeiType === 1" slot="dropdown">
          <el-dropdown-item v-for="(item, index) in wkgVersionList" :command="item.versionId" :key="index">
            {{item.createTime}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!--  表格数据  -->
    <div class="tableData" :style="{height: clientHeight + 'px'}">
      <!--      $store.getters.permissions.includes(410) -->
      <div v-show="fenpeiType === 1">
        <workgroup-allocation v-if="!custInfo.custId"
                              :editStatus="editStatus && $store.getters.permissions.includes(410)" ref="workgroupRef"
                              key="workgroup"></workgroup-allocation>
        <cust-wkg-allocation v-else @updateVersion="updateVersion"
                             :editStatus="editStatus && $store.getters.permissions.includes(410)"
                             :custData="custInfo" ref="custWkgRef"></cust-wkg-allocation>
      </div>
      <people-allocation :editStatus="editStatus && $store.getters.permissions.includes(410)" :custData="custInfo"
                         ref="peopleRef" key="people" @updateVersion="updateVersion"
                         v-show="fenpeiType === 2"></people-allocation>
    </div>
  </div>
</template>

<script>
  import WorkgroupAllocation from "./WorkgroupAllocation";
  import PeopleAllocation from "./PeopleAllocation";
  import {
    queryCustomerFenpeiVersion,
    queryCustomerNameId,
    queryCustomerUrl,
    queryResponsibleVersion
  } from "../../../../api/customerList";
  import CustWkgAllocation from "./CustWkgAllocation";

  export default {
    name: "index",
    components: {CustWkgAllocation, PeopleAllocation, WorkgroupAllocation},
    computed: {
      clientHeight() {
        return document.documentElement.clientHeight - 160
      }
    },
    props: {
      editStatus: {
        type: Boolean,
        default: true
      },
      fpType: {
        type: [Number, String],
        defaul: 2
      },
      custData: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        versionView: false,
        userVersionList: [],
        wkgVersionList: [],
        custInfo: {},
        queryCustomerNameIdList: [],
        custId: '',
        fenpeiType: 2,
        domainList: [
          {label: '商标', id: 1},
          {label: '专利', id: 4},
          {label: '诉讼', id: 2},
          {label: '保护', id: 3},
          {label: '非诉', id: 7},
          {label: '著作权', id: 6},
          {label: '域名', id: 5}
        ],
        domainName: '商标',
        costList: [
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
        profitList: [
          {
            label: '去年数据',
            data: [
              {
                name: 0
              },

            ]
          },
          {
            label: '分配估算',
            data: [
              {
                name: 0
              },

            ]
          }
        ],
      }
    },
    watch: {
      'custId': {
        handler(n) {
          if (n) {
            this.custId = n
            this.queryVersion()
          }
        },
        immediate: true
      }
    },
    created() {
      if (this.fpType) {
        this.fenpeiType = this.fpType
      }
      this.custId = this.custData.custId
      this.custInfo = this.custData
      if (this.custId) {
        this.queryVersion()
      }
    },
    methods: {
      queryVersion() {
        queryResponsibleVersion({custId: this.custId,}).then(res => {
          this.userVersionList = res.data
        })
        queryCustomerFenpeiVersion({custId: this.custId,}).then(res => {
          this.wkgVersionList = res.data
        })
      },
      updateVersion(flag) {
        flag === true && this.queryVersion()
        flag === true && this.$emit('refreshCustData', true)
        this.versionView = false
      },
      changeVersion(versionId) {
        this.versionView = true
        if (this.fenpeiType === 1) { // 工作组版本
          this.$refs.custWkgRef.queryVersionData(versionId, this.wkgVersionList.find(item => item.versionId === versionId).createTime)
        } else { // 负责人版本
          this.$refs.peopleRef.queryVersionData(versionId, this.userVersionList.find(item => item.versionId === versionId).createTime)
        }
      },
      saveFenpei() {
        if (this.fenpeiType === 1 && this.custInfo.custId) {
          this.$refs.custWkgRef.saveCustomerWkg()
        } else if (this.fenpeiType === 2 && this.custInfo.custId) {
          this.$refs.peopleRef.saveCustomerUser()
        }
        this.queryVersion()
      },
      changeCustId(custId) {
        if (custId) {
          queryCustomerUrl({customerID: custId}).then(res => {
            this.custInfo = res.data
            this.custId = res.data.custId
          })
        } else {
          this.$set(this, 'custInfo', {})
          this.custId = ''
        }
      },
      remoteSearch(value) {
        value && queryCustomerNameId({isCustomer: 1, pageNo: 0, pageSize: 100, keyword: value}).then(res => {
          this.queryCustomerNameIdList = res.data
        })
      },
      changeFenpeiType(type) {
        this.fenpeiType = type
      },
      resetFenpei() {
        if (this.fenpeiType == 1) {
          this.$refs.workgroupRef.resetFenpei()
        } else {
          this.$refs.peopleRef.resetFenpei()
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  .tableData {
    background-color: #F2F2F2;
    /*margin-top: 15px;*/
    width: 100%;
    overflow: auto;
    padding: 10px;

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
  }

  .search-box {
    display: flex;
    justify-content: space-between;
    height: 70px;
    width: 100%;
    margin-top: 15px;
    border: 2px solid #F2F2F2;
    border-bottom: 2px solid #52A0F5;
    border-radius: 5px 5px 0 0;

    .search-left {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 15px;
    }
  }

  .search-border {
    cursor: pointer;
    margin-left: 15px;
    font-size: 14px;
    color: #999999;
    font-weight: bold;

    &:hover {
      color: #52A0F5;
    }

    .search-item {
      border: 1px dashed #D7D7D7;
      width: 100px;
      height: 50px;
      display: flex;
      align-items: center;

      &:hover {
        border-color: #52A0F5;
      }
    }
  }

  .choice-item {
    color: #52A0F5;
    border-color: #52A0F5;

    .search-item {
      border-color: #52A0F5;
    }
  }

  .search-right-btn {
    display: flex;
    align-items: center;
    margin-right: 15px;
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

  .el-select > > > .el-input__inner {
    height: 35px;
  }

</style>
