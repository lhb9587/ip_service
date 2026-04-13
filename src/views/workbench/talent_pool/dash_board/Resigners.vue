<template>
  <div class="dash-border" style="width:100%;height: 100%">
    <div>
      <el-form label-width="90px">
        <el-row>
          <el-form-item label="年度数据" class="fl-15">
            <el-select v-model="dateYear" placeholder="请选择" @change="yearSel()">
              <el-option
                v-for="item in yearArr"
                :key="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="离职总人数" class="fl-15">{{resignCount}}</el-form-item>
          <el-form-item label="总离职率">{{resignPercent}}</el-form-item>
        </el-row>
      </el-form>
      <div class="dash-border fl-15" style="width: 100%;height:580px;">
        <div>各业务模块离职率</div>
        <bar_chart_three :id="'module_bar'" :data="moduleData"></bar_chart_three>
      </div>
      <div class="dash-border" style="width:100%;height:100%;">
        <div>查看业务模块：
          <el-select v-model="businessName" placeholder="请选择" clearable @change="currentSel">
            <el-option
              v-for="item in modules"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </div>
        <div class="dash-border dashed fl-10" style="width: 49%;height:375px;">
          <div>辞职和辞退（劝退）数量分布</div>
          <pie_chart_one :id="'resign_bar'" :data="resignData"></pie_chart_one>
        </div>
        <div class="dash-border dashed" style="width: 49%;height:375px;">
          <div>辞职人员层级分布</div>
          <pie_chart_two :id="'level_bar'" :data="levelData"></pie_chart_two>
        </div>
        <div class="dash-border dashed fl-10" style="width: 49%;height:580px;">
          <div>辞职人员司龄分布</div>
          <bar_chart_four :id="'sl_bar'" :data="slData"></bar_chart_four>
        </div>
        <div class="dash-border dashed" style="width: 49%;height:580px;">
          <div>辞职原因分布</div>
          <bar_chart_five :id="'reason_bar'" :data="reasonData"></bar_chart_five>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { statisticsQuitTalentPerson, statisticsQuitTalentPersonByBusiness } from '@/api/hrmList'
import bar_chart_three from './components/bar_chart_three'
import bar_chart_four from './components/bar_chart_four'
import pie_chart_one from './components/pie_chart_one'
import pie_chart_two from './components/pie_chart_two'
import bar_chart_five from './components/bar_chart_five'
export default {
  name: 'Resigners',
  components: {
    bar_chart_three,
    bar_chart_four,
    pie_chart_one,
    pie_chart_two,
    bar_chart_five
  },
  data() {
    return {
      dateYear: '',
      yearArr: [],
      resignCount: 0,
      resignPercent: '',
      businessName: '',
      modules: ['国内商标', '国际商标', '商标诉讼', '专利和专利诉讼', '日本部', '调查保护', '职能支持部门', '曜斗', '君策', '其他'],
      moduleData: {
        nameArr: [],
        data: {
          '入职数': [],
          '离职数': [],
          '离职率': []
        }
      },
      resignData: {
        name: '辞职辞退比例',
        data: []
      },
      slData: {
        nameArr: ['5年以上', '3-5年', '1-3年', '1年内'],
        data: []
      },
      levelData: {
        data: []
      },
      reasonData: {
        nameArr: ['个人发展', '家庭原因', '个人不适岗', '管理问题', '其他'],
        data: []
      }
    }
  },
  mounted() {
    this.moduleData.nameArr = this.modules
    this.makeYear();
    this.statisticsQuitTalentPerson()
    this.statisticsQuitTalentPersonByBusiness()
  },
  methods: {
    makeYear() {
      let date = new Date()
      this.dateYear = date.getFullYear()
      for (var i=0;i<=5;i++){
        this.yearArr.push(this.dateYear-i)
      }
    },
    statisticsQuitTalentPerson() {
      statisticsQuitTalentPerson({ 'year': this.dateYear }).then(res => {
        this.resignCount = res.data['personQuitCount']
        this.resignPercent = res.data['personQuitPercent']
        let business = res.data['personByStatusAndBusinessGroup']
        for (let item of this.moduleData.nameArr) {
          if (business[item]) {
            this.moduleData.data['入职数'].push(business[item]['入职数'])
            this.moduleData.data['离职数'].push(business[item]['离职数'])
            this.moduleData.data['离职率'].push(business[item]['离职率'])
          } else {
            this.moduleData.data['入职数'].push(0)
            this.moduleData.data['离职数'].push(0)
            this.moduleData.data['离职率'].push(0)
          }
        }
        console.log(this.moduleData.data)
      })
    },
    statisticsQuitTalentPersonByBusiness() {
      var data = []
      if (this.businessName) {
        data = { 'year': this.dateYear, 'businessName': this.businessName }
      } else {
        data = { 'year': this.dateYear}
      }
      statisticsQuitTalentPersonByBusiness(data).then(res => {
        this.resignData.data = res.data['personByQuitType']
        this.levelData.data = res.data['personByPosLevel']
        this.slData.data = []
        this.slData.data = this.dataProcessing(this.slData.nameArr, res.data['personBySiLing'])
        this.reasonData.data = []
        this.reasonData.data = this.dataProcessing(this.reasonData.nameArr, res.data['personByQuitReason'])
        console.log(this.reasonData.data)
      })
    },
    dataProcessing(nameArr, res) {
      let data = []
      for (let name of nameArr) {
        let value = 0
        for (let item of res) {
          if (name == item.name) {
            value = item.value
          }
        }
        data.push(value)
      }
      return data
    },
    yearSel() {
      this.statisticsQuitTalentPerson()
      this.statisticsQuitTalentPersonByBusiness()
    },
    currentSel() {
      this.statisticsQuitTalentPersonByBusiness()
    }
  }
}
</script>

<style lang="scss" scoped>
.dash-border{
  padding: 10px 10px 10px 10px;
  border: 1px solid rgb(111,113,116);
  float: left;
  margin-top: 10px;
}
.dashed{
  border: 1px dashed #D7D7D7;
}
.fl-10{
  margin-right: 10px;
}
.el-row{
  display: flex;
  align-items: center;
  .el-form-item{
    border: 1px solid #EBEEF5;
    background: #f5f7fa;
    margin-bottom: 0px;
    /deep/ .el-form-item__content{
      background: #fff;
      width: 100px;
      padding-left: 10px;
    }
  }
}
</style>
