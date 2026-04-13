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
          <el-form-item label="新人总数">{{newCount}}</el-form-item>
        </el-row>
      </el-form>
      <div class="dash-border fl-15" style="width: 32%;height:370px;">
        <div>新人学历分布</div>
        <pie_chart_one :id="'education_pie'" :data="educationData"></pie_chart_one>
      </div>
      <div class="dash-border fl-15" style="width: 32%;height:375px;">
        <div>新人年龄分布</div>
        <pie_chart_one :id="'age_pie'" :data="ageData"></pie_chart_one>
      </div>
      <div class="dash-border " style="width: 32%;height:375px;">
        <div>新人层级分布</div>
        <bar_chart_level :id="'level_bar'" :data="levelData"></bar_chart_level>
      </div>
      <div class="dash-border" style="width:60%;height:650px;">
        <div>按业务模块分布</div>
        <bar_chart_one :id="'new_module_bar'" :data="moduleData"></bar_chart_one>
      </div>
    </div>
  </div>
</template>

<script>
import { statisticsNewTalentPerson } from '@/api/hrmList'
import pie_chart_one from './components/pie_chart_one'
import bar_chart_level from './components/bar_chart_level'
import bar_chart_one from './components/bar_chart_one'
export default {
  name: 'Interns',
  components: {
    pie_chart_one,
    bar_chart_level,
    bar_chart_one,
  },
  data() {
    return {
      dateYear: '',
      yearArr: [],
      newCount: 121,
      educationData: {
        name: '员工学历',
        data: []
      },
      ageData: {
        name: '年龄分布',
        data: []
      },
      levelData: {
        nameArr: ['助理/专利工程师', '代理人/协办', '顾问/主办', '资深/高级', '合伙人'],
        data: []
      },
      moduleData: {
        nameArr: ['国内商标', '国际商标', '商标诉讼', '专利和专利诉讼', '日本部', '调查保护', '职能支持部门', '曜斗', '君策', '其他'],
        areaArr: ['总部', '上海', '广州', '深圳', '天津', '重庆', '苏州', '杭州', '宁波', '香港', '成都', '其他'],
        series: [],
      },
    }
  },
  mounted() {
    this.makeYear();
    this.statisticsNewTalentPerson();
  },
  methods: {
    makeYear() {
      let date = new Date()
      this.dateYear = date.getFullYear()
      for (var i=0;i<=5;i++){
        this.yearArr.push(this.dateYear-i)
      }
    },
    statisticsNewTalentPerson() {
      statisticsNewTalentPerson({ 'year': this.dateYear }).then(res => {
        this.newCount = res.data['personNewCount']
        this.educationData.data = res.data['personByCollegeGroup']
        this.ageData.data = res.data['personByAgeGroup']
        let level = res.data['personByPosLevel']
        this.levelData.data = []
        for (let name of this.levelData.nameArr) {
          let value = 0
          for (let item of level) {
            if (name == item.name) {
              value = item.value
            }
          }
          this.levelData.data.push({
            'name': name,
            'value': value
          })
        }
        console.log(this.levelData.data)
        this.moduleData.series = []
        let areaSum = []
        for (let area of this.moduleData.areaArr) {
          if (res.data['personByAreaAndBusinessGroup'][area]){
            areaSum.push(0) // 设置地区数量
            let data = []
            let businessModule = res.data['personByAreaAndBusinessGroup'][area]
            for (let item of this.moduleData.nameArr) {
              if (businessModule[item]) {
                data.push(businessModule[item])
              }else{
                data.push(0)
              }
            }
            this.moduleData.series.push({
              name: area,
              type: 'bar',
              barWidth: 30,
              stack: '总量',
              label: {
                show: true,
                formatter: function (params) {
                  if (params.value > 0) {
                    return params.value;
                  } else {
                    return '';
                  }
                }
              },
              data: data
            })
          }
        }
        this.moduleData.series.push({
          name: '',
          type: 'bar',
          data: areaSum,
          color: '#bbf',
          stack: '总量',
          barWidth: 30,
          label: {
            show: true,
            position: 'top',
            color: 'black'
          }
        })
      })
      console.log(this.moduleData.series)
    },
    yearSel() {
      this.statisticsNewTalentPerson()
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
.fl-15{
  margin-right: 15px;
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
