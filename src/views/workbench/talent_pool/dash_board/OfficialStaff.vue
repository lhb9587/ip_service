<template>
  <div class="dash-border" style="width:100%;height: 100%">
    <div>
      <el-form label-width="90px">
        <el-row>
          <el-form-item label="总人数">{{allCount}}</el-form-item>
        </el-row>
      </el-form>
      <div class="dash-border fl-15" style="width:70%;height:650px;">
        <div style="cursor:pointer" @click="statisticsTalentPersonAll">按业务模块分布</div>
        <bar_chart_one :id="'module_bar'" :data="moduleData"></bar_chart_one>
      </div>
      <div class="dash-border" style="width: 28%;height:650px;">
        <div>按地区分布</div>
        <map_chart v-if="mapData.series" :id="'module_map'" :data="mapData"></map_chart>
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
        <div class="dash-border dashed fl-15" style="width: 23.5%;height:375px;">
          <div>按性别分布</div>
          <pie_chart_one :id="'sex_pie'" :data="sexData"></pie_chart_one>
        </div>
        <div class="dash-border dashed fl-15" style="width: 23.5%;height:375px;">
          <div>按学历分布</div>
          <pie_chart_one :id="'education_pie'" :data="educationData"></pie_chart_one>
        </div>
        <div class="dash-border dashed fl-15" style="width: 23.5%;height:375px;">
          <div>按年龄分布</div>
          <pie_chart_one :id="'age_pie'" :data="ageData"></pie_chart_one>
        </div>
        <div class="dash-border dashed" style="width: 23.5%;height:375px;">
          <div>按层级分布</div>
          <funnel_chart :id="'level_funnel'" :data="levelData"></funnel_chart>
        </div>
        <div class="dash-border dashed" style="width: 100%;height:580px;">
          <div>执证情况分布</div>
          <bar_chart_two :id="'certify_bar'" :data="certifyData"></bar_chart_two>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { statisticsTalentPersonAll, statisticsTalentPersonByBusiness, statisticsTalentPersonForPatent } from '@/api/hrmList'
import bar_chart_one from './components/bar_chart_one'
import map_chart from './components/map_chart'
import pie_chart_one from './components/pie_chart_one'
import funnel_chart from './components/funnel_chart'
import bar_chart_two from './components/bar_chart_two'
export default {
  name: 'OfficialStaff',
  components: {
    pie_chart_one,
    bar_chart_one,
    map_chart,
    funnel_chart,
    bar_chart_two,
  },
  data() {
    return {
      allCount: 0,
      businessName: '',
      modules: ['国内商标', '国际商标', '商标诉讼', '专利和专利诉讼', '日本部', '调查保护', '职能支持部门', '曜斗', '君策', '其他'],
      area: ['总部', '上海', '广州', '深圳', '天津', '重庆', '苏州', '杭州', '宁波', '香港', '成都', '其他'],
      moduleData: {
        nameArr: [],
        areaArr: [],
        series: [],
      },
      mapData: {
        areaArr: ['北京', '上海', '广东', '天津', '重庆', '江苏', '浙江', '香港', '四川'],
        series: [],
      },
      sexData: {
        name: '男女比例',
        data: []
      },
      educationData: {
        name: '员工学历',
        data: []
      },
      ageData: {
        name: '年龄分布',
        data: []
      },
      levelData: {
        nameArr: [
          { value: 10, name: '合伙人' },
          { value: 20, name: '资深/高级' },
          { value: 30, name: '顾问/主办' },
          { value: 40, name: '代理人/协办' },
          { value: 50, name: '助理/专利工程师' }],
        data: []
      },
      certifyData: {
        nameArr: ['律师资格证', '律师执业证', '实习律师证', '专利代理人执业证', '专利代理人资格证', '法律职业资格证书'],
        areaArr: [],
        series: [],
      }
    }
  },
  mounted() {
    this.moduleData.nameArr = this.modules
    this.moduleData.areaArr = this.area
    this.certifyData.areaArr = this.area
    this.statisticsTalentPersonAll();
    this.statisticsTalentPersonByBusiness();
  },
  methods: {
    statisticsTalentPersonAll() {
      statisticsTalentPersonAll().then(res => {
        this.allCount = res.data['personAllCount']
        let business = res.data['personByAreaAndBusiness']
        this.moduleData.nameArr = this.modules
        this.moduleData.series = []
        let areaSum = []
        let mapData = []
        for (let area of this.moduleData.areaArr) {
          if (business[area]){
            areaSum.push(0) // 设置地区数量
            let data = []
            let map = []
            let businessModule = business[area]
            for (let item of this.moduleData.nameArr) {
              if (businessModule[item]) {
                data.push(businessModule[item])
                map.push({
                  'name': item,
                  'value': businessModule[item]
                })
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

            mapData[area] = {
              'city': area,
              'module': map
            }
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
        this.mapData.series.push(
          {
            name:'北京',
            value:5,
            res: [mapData['总部']]
          },
          {
            name:'上海',
            value:5,
            res: [mapData['上海']]
          },
          {
            name:'广东',
            value:5,
            res:[
              mapData['广州'],
              mapData['深圳']
            ]
          },
          {
            name:'香港',
            value:5,
            res: [mapData['香港']]
          },
          {
            name:'天津',
            value:5,
            res: [mapData['天津']]
          },
          {
            name:'重庆',
            value:5,
            res: [mapData['重庆']]
          },
          {
            name:'江苏',
            value:5,
            res: [mapData['苏州']]
          },
          {
            name:'浙江',
            value:5,
            res:[
              mapData['杭州'],
              mapData['宁波']
            ]
          },
          {
            name:'四川',
            value:5,
            res: [mapData['成都']]
          }
        )
      })
    },
    statisticsTalentPersonByBusiness() {
      var data = []
      if (this.businessName) {
        data = { 'businessName': this.businessName }
      }
      statisticsTalentPersonByBusiness(data).then(res => {
        this.sexData.data = res.data['personByGenderGroup']
        this.educationData.data = res.data['personByCollegeGroup']
        this.ageData.data = res.data['personByAgeGroup']
        let level = res.data['personByPosLevel']
        this.levelData.data = []
        for (let levelData of this.levelData.nameArr) {
          let value = 0
          for (let item of level) {
            if (levelData.name == item.name) {
              value = item.value
            }
          }
          this.levelData.data.push({
            'name': levelData.name +' '+value+' 人',
            'value': levelData.value
          })
        }
        let certificateGroup = res.data['personByAreaAndCertificateGroup']
        this.certifyData.series = []
        for (let item of this.certifyData.nameArr) {
          let certificate = []
          for (let area of this.certifyData.areaArr) {
            if (certificateGroup[area]) {
              if (certificateGroup[area][item]) {
                certificate.push(certificateGroup[area][item])
              } else {
                certificate.push(0)
              }
            }
          }
          this.certifyData.series.push({
            name: item,
            type: 'bar',
            stack: 'total',
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
            emphasis: {
              focus: 'series'
            },
            data: certificate
          })
        }
      })
    },
    currentSel() {
      this.statisticsTalentPersonByBusiness();
    },
    moduleClick(name) {
      statisticsTalentPersonForPatent().then(res => {
        this.moduleData.nameArr = ['国内专利', '国际专利', '专利诉讼', '专利流程']
        this.moduleData.series = []
        let business = res.data
        let areaSum = []
        for (let area of this.moduleData.areaArr) {
          if (business[area]) {
            areaSum.push(0) // 设置地区数量
            let data = []
            let businessModule = business[area]
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
