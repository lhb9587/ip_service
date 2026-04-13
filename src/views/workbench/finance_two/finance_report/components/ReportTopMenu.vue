<template>
  <div class="outTabs">
    <div class="search" name="search" :style="{backgroundColor: activeName === 'search' ? '#FFFFFF' : '#f5f7fa'}">
      <div class="btns" style="height: 40px;">
        <div style="cursor: pointer" @click="searchTab">
          <span class="el-icon-search" style="height: 40px;line-height: 40px;margin-left: 5px"></span>
          <span style="height: 40px;line-height: 40px">搜索</span>
        </div>

        <div style="height: 40px;line-height: 40px;cursor: pointer" @click="changeState"><span
          class="el-icon-arrow-down"></span></div>
      </div>
      <component ref="search" :is="currentView" style="display: inline-block;margin-right: 10px" :name="$route.name" @search="queryList"
                 :type="type" :ctx="ctx"></component>
    </div>
    <el-tabs v-model="activeName" type="border-card" style="margin:10px 0px 10px 0px;" @tab-click="tabSearch">
      <el-tab-pane v-for="(item, index) in tabList" :name="item.value" :key="item.value" v-if="!item.permissions || $store.getters.permissions.includes(item.permissions)">
        <span slot="label">{{item.label}}</span>
      </el-tab-pane>
    </el-tabs>
    <div class="more" :style="{backgroundColor: activeName === 'more' ? '#FFFFFF' : '#f5f7fa',color: activeName === 'more' ? '#409EFF' : '#909399'}" style="display: flex;min-width: 100px;" @click="moreTab" name="more"
         v-if="['report'].includes(type)">
      <el-popover
        placement="bottom"
        width="500"
        trigger="click"
      >
        <div class="companyBox">
          <template>
            <el-tag :class="{isActive: item.deptId == paymentDeptId}" @click.prevent.native="changeCompany(item)"
                    v-for="(item,index) in payCompanyList" :key="item.deptId" :title="item.nameCn">
              {{item.nameCn}}
            </el-tag>
          </template>
        </div>
        <div style="display: flex;padding: 0 0 0 20px;cursor: pointer;" class="btns" slot="reference">
          <div>{{paymentDeptName}}</div>
          <span class="el-icon-arrow-down" style="margin-right: 5px"></span>
        </div>
      </el-popover>
    </div>
    <div style="" class="date" name="date"
         v-if="['report'].includes(type)">
      <div class="dateInput">
        <el-date-picker
          style="cursor: pointer"
          ref="datePickers"
          id="datePick"
          @change="changeDatePick"
          v-model="belongToDate"
          type="month"
          value-format="yyyy-MM"
          :placeholder="belongToDate ? belongToDate : '所属月'">
        </el-date-picker>
      </div>
    </div>
  </div>
</template>

<script>
import dispatcher from '../../stateManage/dispatchers'
import report from '../finance_report_form/components/FormSearch'
import account from '../finance_report_account/components/AccountSearch'
import manage from '../finance_report_manage/components/ManageSearch'
import {queryReportCompany} from '@/api/caseList'

export default {
  name: 'ReportTopMenu',
  props:{
    type: {
      type: String,
      default: ''
    },
    tabList:{
      type: Array,
      default: () => []
    },
    ctx: {}
  },
  data(){
    return {
      activeName: 'search',
      belongToDate: '',
      paymentDeptName: '',
      payCompanyList: [],
    }
  },
  created() {
    console.log(this.type)
    this.initData()
    if (this.type == 'report'){
      this.queryModuleData = JSON.parse(localStorage.getItem('queryModuleData')) ?
        JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == 'finance_report_form') ?
          JSON.parse(localStorage.getItem('queryModuleData')).find(item => item.name == 'finance_report_form').queryModuleData : {} : {}
      if (this.queryModuleData.action){
        if (!this.queryModuleData.hasOwnProperty('deptId')){
          this.activeName = this.queryModuleData.action
        }
        this.$nextTick(()=> {
          dispatcher(this.ctx)('REPORT_SEARCH', 1, this.queryModuleData);
        })
      }
    }
  },
  components: {
    report,
    account,
    manage
  },
  methods: {
    searchTab() {
      this.activeName = 'search'
      this.$refs.search.handleSearch(1)
    },
    changeDatePick(n) {
      if (!n) return;
      this.activeName = 'more'
      this.ctx.$refs.reportList.$data.currentYear = n.slice(0, 4)
      this.ctx.$refs.reportList.$data.currentMonth = n.slice(5)
      this.ctx.$refs.reportList.changeBelongDate({repCompId: this.paymentDeptId})
    },
    tabSearch(item){
      if(item.name == 'search')return;
      const obj = {}
      obj['action'] = item.name
      switch (this.type) {
        case 'report':
          dispatcher(this.ctx)('REPORT_SEARCH', 1, obj);
          break;
        default:
          break;
      }
    },
    moreTab() {
      this.paymentDeptId = this.payCompanyList[0].deptId
    },
    queryList(val){
      this.activeName = 'search'
      switch (this.type) {
        case 'report':
          dispatcher(this.ctx)('REPORT_SEARCH', 0, val);
          break;
        case 'manage':
          dispatcher(this.ctx)('REPORT_MANAGE_SEARCH', 0, val);
          break;
        case 'account':
          dispatcher(this.ctx)('REPORT_ACCOUNT_SEARCH', 0, val);
          break;
        default:
          break;
      }
    },
    async initData() {
      queryReportCompany().then(res => {
        console.log('res',res)
        this.payCompanyList = res.data
        if(this.paymentDeptId){
          this.paymentDeptName = this.payCompanyList.find(item => item.deptId == this.paymentDeptId) && this.payCompanyList.find(item => item.deptId == this.paymentDeptId).nameCn || '更多'
        }else{
          this.paymentDeptName = this.payCompanyList[0].nameCn || '更多'
          this.paymentDeptId = this.payCompanyList[0].deptId
        }
      })
    },
    changeCompany({deptId, nameCn}) {
      if(this.paymentDeptId !== deptId || !this.belongToDate){
        this.belongToDate = this.$wUtil.getDate('', 'month')
      }
      this.paymentDeptId = deptId
      nameCn && (this.paymentDeptName = nameCn)
      console.log('deptId',deptId)
      this.ctx.$refs.reportList.changeCompany({deptId})

      this.activeName = ''
      this.$nextTick(() => {
        this.activeName = 'more'
      })
    },
    changeState() {
      this.$nextTick(()=>{
        this.$refs.search.openOrClose()
      })
    }
  },
  computed: {
    currentView() {
      return this.type;
    }
  }
}
</script>

<style lang="scss" scoped>
> > > .el-tabs__content {
  padding: 0;
  height: 0;
  overflow: visible;
}
.btns{
  display: flex;
  align-items: center;
  /*justify-content: space-around;*/
  .el-icon-search{
    margin-right: 5px;
  }
  .el-icon-arrow-down{
    /*width: 30px;*/
    margin-left: 15px;
  }
}

.companyBox {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  .el-tag {
    width: 70px;
    margin: 5px;
    cursor: pointer;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .isActive {
    background-color: #409EFF;
    color: #fff;
  }
}

.outTabs {
  display: flex;
  justify-content: left;
  align-items: center;

  .search, .date, .more {
    display: flex;
    align-items: center;
    margin: -1px 0 0 -1px;
    height: 40px;
    transition: all .3s cubic-bezier(.645, .045, .355, 1);
    border: 1px solid transparent;
    color: #909399;
    /*background: #FFF;*/
    border: 1px solid #DCDFE6;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
    background-color: #f5f7fa;
    border-bottom: 1px solid #E4E7ED;
    font-size: 14px;
    border-right: none;
  }

  .date, .more {
    border-left: none;
    border-right: 1px solid #DCDFE6;
    overflow: hidden;
    margin: -1px 0 0 -1px;
    height: 40px;
  }

  .more {
    border-right: none;
  }

  .el-tabs {
    border-right: none;
    border-left: none;
  }

  .dateInput {
    > > > .el-input {
      width: 120px;
      color: #909399;

      .el-input__inner {
        background-color: transparent;
      }

      input {
        border: none;
      }
    }
  }

}
</style>
