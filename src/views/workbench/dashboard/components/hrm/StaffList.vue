<!-- 人员资料列展示 -->
<template>
  <div class="hrm-container" ref="hrmContainer">
    <div class="hrm-main" v-show="!infoVisible">
      <div class="hrm-search">
        <el-select v-model="talentCode" @change="handleSearch" style="width: 90px" size="small" filterable clearable placeholder="姓名">
          <el-option
            v-for="item in userList"
            :key="item.talentCode"
            :label="item.talentName"
            :value="item.talentCode">
          </el-option>
        </el-select>
        <el-select v-model="positionName" @change="handleSearch" :style="{ width: inputWid(positionName) }" size="small" filterable clearable placeholder="岗位名称">
          <el-option
            v-for="item in positionsList"
            :key="item.id"
            :label="item.posName"
            :value="item.posName">
          </el-option>
        </el-select>
        <el-select v-model="empStatus" @change="handleSearch" style="width: 100px" size="small" filterable clearable placeholder="在职状态">
          <el-option
            v-for="item in statusList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        <el-cascader
          ref="groupCascader"
          placeholder="部门工作组"
          :options="groupList"
          :props="defaultParams"
          clearable
          filterable
          change-on-select
          v-model="deptCodes"
          size="small"
          :style="{ width: inputWid(cascaderLable ? cascaderLable : '部门工作组') }"
          @change="handleCascaderSearch($event)"
        ></el-cascader>
        <el-select v-model="orderType" @change="handleSearch" style="width: 130px" size="small" filterable clearable placeholder="排序规则">
          <el-option
            v-for="item in orderTypeData"
            :key="item.type"
            :label="item.name"
            :value="item.type">
          </el-option>
        </el-select>
      </div>
      <div class="employee-list">
        <div v-for="employee in employees" :key="employee.id" class="employee-item" @click="clickStaffInfo(employee)">
          <img v-lazy="getAvatarUrl(employee.userIcon, employee.gender)" :key="employee.userIcon" :alt="employee.talentName" class="avatar" />
          <div class="employee-details">
            <span class="employee-name">{{ employee.talentName }}</span>
            <span class="employee-posname">{{ employee.posName }}</span>
          </div>
        </div>
      </div>
    </div>
    <StaffInfo v-if="infoVisible" :talent-code="infoTalentCode" @closeViewInfo="closeInfo" />
  </div>
</template>

<script>
import StaffInfo from './StaffInfo'
import { queryTalentPersonList, queryPersonAll, queryPositions, queryOrganizations } from '@/api/hrmList.js'
export default {
  components: {
    StaffInfo
  },
  data() {
    return {
      talentCode: '',
      deptCodes: [],
      positionName: '',
      empStatus: '在职',
      orderType: 0,
      orderTypeData: [
        { type: 0, name: '入职时间倒序'},
        { type: 1, name: '入职时间正序'},
        { type: 2, name: '按照姓氏正序'}
      ],
      defaultParams:{
        value: 'deptCode',
        label: 'kingDeeGroupName',
        checkStrictly: true,
        children: 'children'
      },
      userList: [], // 用户列表
      groupList: [], // 工作组列表
      positionsList: [],// 岗位列表
      statusList: ['在职','离职'],
      cascaderLable: '',
      infoVisible: false,
      employees: [],
      infoTalentCode: [],
      scrollPosition: 0 // 用于记录滚动位置
    };
  },
  created() {
    this.handleSearch()
    this.dataInit()
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll); // 监听滚动事件
  },
  methods: {
    closeInfo() {
      this.infoVisible = false
      this.$nextTick(() => {
        window.scrollTo(0, this.scrollPosition);
      })
    },
    handleScroll() {
      if (!this.infoVisible && window.scrollY){
        this.scrollPosition = window.scrollY // 更新滚动位置
      }
    },
    dataInit() {
      this.queryPersonAll() // 获取user列表
      this.queryOrganizations() // 获取工作组
      queryPositions().then(res => {
        if (res.success) {
          this.positionsList = res.data
        }
      })
    },
    queryPersonAll(){
      queryPersonAll({ empStatus: this.empStatus }).then(res => {
        if (res.success) {
          this.userList = res.data
        }
      })
    },
    queryOrganizations(){
      queryOrganizations({ status: (this.empStatus == '在职'?1:0) }).then(res => {
        if (res.success) {
          this.groupList = res.data
        }
      })
    },
    // 级联搜索
    handleCascaderSearch(row){
      this.handleSearch()
      this.$nextTick(()=>{
        this.cascaderLable =this.$refs.groupCascader.$el.innerText
      })
    },
    // 搜索
    handleSearch(val){
      console.log('姓名:',this.talentCode,'工作组:',this.deptCodes[this.deptCodes.length-1],'岗位名称:',this.posId,'在职状态:',this.empStatus)
      var querData = {
        talentCode: this.talentCode,
        posId: this.positionsList.find(item => item.posName == this.positionName) ? this.positionsList.find(item => item.posName == this.positionName).id : '',
        empStatus: this.empStatus,
        deptCode: this.deptCodes ? this.deptCodes[this.deptCodes.length-1] : '',
        orderType: this.orderType ? this.orderType : null,
        pageNo: 1,
        pageSize: 2000,
      }
      queryTalentPersonList(querData).then(res=>{
        this.total=res.total
        this.listLoading = false
        this.employees= res.data
      })
    },
    getAvatarUrl(avatarUrl,gender) {
      if (avatarUrl) {
        return 'ipdoc'+avatarUrl;
      } else {
        // 如果 avatarUrl 为空，则返回男头像或女头像的默认地址
        return (gender == '男') ? require('@/assets/default-male-avatar.jpg') : require('@/assets/default-female-avatar.jpg')
      }
    },
    clickStaffInfo(row) {
      this.infoTalentCode = row.talentCode
      this.infoVisible = true
      console.log('row',row)
    }
  },
  directives: {
    lazy: {
      inserted: (el, binding) => {
        const defaultAvatarUrl = require('@/assets/default-avatar.jpg');
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = new Image();
              img.src = binding.value;
              img.onload = () => {
                el.src = img.src;
                el.classList.add('loaded');
              };
              observer.unobserve(el);
            }
          });
        });
        observer.observe(el);

        // 设置默认图片
        el.src = defaultAvatarUrl;
      }
    }
  },
  computed:{
    inputWid() {
      return function (value) {
        if (!value) {
          return '110px'
        } else {
          // 有内容，字符串长度*字体大小
          return (String(value).length * 13 + 50) + 'px'
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.hrm-container {
  background-color: #f2f2f2;
  padding: 10px;
  height: 100%;
}
.hrm-main {
  background-color: #fff;
}
.hrm-search{
  font-size: 14px;
  height: 46px;
  line-height: 46px;
  width: 100%;
  a{
    color: #52A0F5;
  }
  i{
    padding-right: 5px;
  }
  .el-select /deep/ .el-input input{
    font-weight: bold;
    border: 0px !important;
  }
  .el-cascader {
    /deep/ .el-cascader__label{
      font-weight: bold;
    }
    /deep/ .el-input input {
      width: 300px;
      font-weight: bold;
      border: 0px !important;
    }
  }
}
.employee-list {
  display: flex;
  flex-wrap: wrap; /* 换行 */
}

.employee-item {
  display: flex;
  flex-direction: column;
  align-items: center; /* 垂直居中对齐 */
  margin: 15px; /* 添加间隔 */
  cursor: pointer;
}

.avatar {
  width: 120px; /* 设置头像宽度，可以根据实际需要进行调整 */
  height: 120px; /* 设置头像高度，可以根据实际需要进行调整 */
  object-fit: cover; /* 控制图片填充方式，保持宽高比并填充容器 */
  border: 1px solid #ebe9e9;
}
.employee-details{
  text-align: center;
}
.employee-name {
  display: block;
  font-weight: bold;
  margin-top: 15px; /* 添加姓名与头像之间的间距 */
}
.employee-posname {
  font-size: 14px;
  color: #776f6f;
}
</style>
