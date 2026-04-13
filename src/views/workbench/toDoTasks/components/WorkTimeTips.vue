<template>
    <div class="worktime-tips" v-if="paramsData.data">
        <el-popover
            placement="left"
            width="800"
            trigger="click"
            @show="showFlag"
            style="cursor: pointer;"
            >
            <el-tabs v-loading="oloading" type="border-card" @tab-click="labelName" v-model="labelValue" style="max-height: 400px; overflow: hidden;  overflow-x: hidden; overflow-y: auto;"> 
                <el-tab-pane label="关联工时">
                    <div v-if = 'workhoursList.length'>
                      <div class="associated-time" v-for="(item,index) in workhoursList" :key="index">
                        <el-row type="flex" justify="center">
                            <el-col :span="3"><i class="el-icon-user" style="margin-right: 8px;"></i>{{ item.recordUserName }}</el-col>
                            <el-col :span="3"><i class="el-icon-alarm-clock" style="margin-right: 8px;"></i><b style="font-size: 16px;">{{ item.approvedTime }}</b></el-col>
                            <el-col :span="4"><i class="el-icon-coin" style="margin-right: 8px;"></i><b style="font-size: 16px;">{{ item.approvedAmountCust }}</b></el-col>
                            <el-col :span="5"><i class="el-icon-date" style="margin-right: 8px;"></i>{{ item.hourDate }}</el-col>
                            <el-col :span="4">
                                <div v-if="item.wfStatus == '待审核'" class="clica" style="background-color: rgb(31, 143, 224);"></div>
                                <div v-if="item.wfStatus == '已核销'" class="clica" style="background-color: rgb(24, 151, 58);"></div>
                                <div v-if="item.wfStatus == '未核销'" class="clica" style="background-color: rgb(230, 43, 43);"></div>
                                <span class="shenh" style="margin-left: 6px;">{{ item.wfStatus }}</span>
                            </el-col>
                            <el-col :span="5"></el-col>
                        </el-row>
                        <el-row type="flex" justify="center" style="margin-top: 8px;">
                            <el-col :span="24"><i class="el-icon-document" style="margin-right: 8px;"></i>{{ item.workContent }}</el-col>
                        </el-row>
                        <div class="divider-segmentation"></div>
                    </div>
                    </div>
                    <div v-else style="width: 100%; text-align: center; line-height: 100px;">暂无数据</div>
                </el-tab-pane>
                <el-tab-pane label="参考工时">
                    <div v-if="workhoursList.length">
                      <div class="associated-time" v-for="(item,index) in workhoursList" :key="index">
                        <el-row type="flex" justify="center">
                            <el-col :span="8"><i class="el-icon-collection-tag" style="margin-right: 8px;"></i><span @click="jumpDetails(item)" style="color: rgb(37, 100, 235); cursor:pointer;">{{ item.agentNum }}</span></el-col>
                            <el-col :span="16"><i class="el-icon-office-building" style="margin-right: 8px;"></i>{{ item.custName }}</el-col>
                        </el-row>
                        <el-row type="flex" justify="center" style="margin-top: 8px;">
                            <el-col :span="24"><i class="el-icon-star-off" style="margin-right: 8px;"></i>{{ item.caseName }}</el-col>
                        </el-row>
                        <el-row type="flex" justify="center" style="margin-top: 8px;">
                            <el-col :span="3"><i class="el-icon-user" style="margin-right: 8px;"></i>{{ item.recordUserName }}</el-col>
                            <el-col :span="3"><i class="el-icon-alarm-clock" style="margin-right: 8px;"></i><b style="font-size: 16px;">{{ item.approvedTime }}</b></el-col>
                            <el-col :span="4"><i class="el-icon-coin" style="margin-right: 8px;"></i><b style="font-size: 16px;">{{ item.approvedAmountCust }}</b></el-col>
                            <el-col :span="5"><i class="el-icon-date" style="margin-right: 8px;"></i>{{ item.hourDate }}</el-col>
                            <el-col :span="4">
                                <div v-if="item.wfStatus == '未核销'" class="clica" style="background-color: rgb(230, 43, 43);"></div>
                                <div v-else class="clica" style="background-color: rgb(31, 143, 224);"></div>
                                <span class="shenh" style="margin-left: 6px;">{{ item.wfStatus }}</span>
                            </el-col>
                            <el-col :span="5"></el-col>
                        </el-row>
                        <el-row type="flex" justify="center" style="margin-top: 8px;">
                            <el-col :span="24"><i class="el-icon-document" style="margin-right: 8px;"></i>{{ item.approvedDesc }}</el-col>
                        </el-row>
                        <div class="divider-segmentation"></div>
                    </div>
                    </div>
                    <div v-else style="width: 100%; text-align: center; line-height: 100px;">暂无数据</div>
                </el-tab-pane>
                <el-tab-pane label="数据分析">
                    <div class="associated-time">
                        <el-row type="flex" justify="center">
                            <el-col :span="9">
                                <el-row type="flex" justify="center">
                                    <el-col :span="8">分析范围：</el-col>
                                    <el-col :span="14">
                                        <el-radio-group v-model="radio1" size="mini" @input="radioAClick"> 
                                            <el-radio-button label="案件"></el-radio-button>
                                            <el-radio-button label="客户"></el-radio-button>
                                        </el-radio-group>
                                    </el-col>
                                </el-row>
                            </el-col>
                            <el-col :span="15">
                                <el-row type="flex" justify="center" v-show="flag">
                                    <el-col :span="6">数据范围：</el-col>
                                    <el-col :span="18">
                                        <el-radio-group v-model="radio" @input="radioBClick">
                                            <el-radio :label="0">最近一年</el-radio>
                                            <el-radio :label="1">最近半年</el-radio>
                                            <el-radio :label="2">最近三个月</el-radio>
                                        </el-radio-group>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                        <div style="margin-top: 20px;">
                            <AgGridVue 
                                v-if="analyzeList.length>0"
                                class="ag-theme-balham"
                                :style="{width:'100%', height:'300px'}"
                                :rowData="analyzeList"
                                :columnDefs="analyzeDefs"
                                :defaultColDef="defaultColDef"
                                >
                            </AgGridVue>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
            <div slot="reference" style="margin-top: 4px; margin-left: 6px;"><i slot="reference" class="el-icon-s-order"></i></div>
        </el-popover>
    </div>
</template>
<script>
import { queryWorkHours } from "@/api/caseList.js";
export default {
    name: "WorkTimeTips",
    props: { 
        paramsData: {},
        tipsType: {
          type: String,
          default: ''
        } 
    },
    data() {
        return {
            labelValue: 0,
            oloading: false,
            flag: false,
            radio: 0,
            radio1: '案件',
            feeList: [],
            parmins: {},
            threeDate: '',
            haflYearData: '',
            nowDayData: '',
            reactYearData: '',
            workhoursList: [],
            analyzeList: [],
            analyzeDefs: [
                { headerName: '员工', field: 'userName'},
                { headerName: '记录工时', field: 'jiluSum'},
                { headerName: '核定工时', field: 'hedingSum'},
                { headerName: '账单工时', field: 'zhangdanSum'},
                { headerName: '核定/记录比', field: 'hedingjilu'},
                { headerName: '账单/核定比', field: 'zhangdanheding'},
            ],
            defaultColDef: {
                flex: 1,
                minWidth: 100,
                sortable: true,
                resizable: true,
            },
        }
    },
    methods:{
        jumpDetails(val) {
          let taskType = 1
          switch (val.domain) {
            case '商标':
              taskType = 1
              break
            case '诉讼':
              taskType = 2
              break
            case '保护':
              taskType = 3
              break
            case '专利':
              taskType = 4
              break
            case '域名':
              taskType = 5
              break
            case '著作权':
              taskType = 6
              break
            case '非诉':
              taskType = 7
              break
            default:
              taskType = 1
          }
          if(this.tipsType==='btn'){
              let data = {
                val: val,
                query:{taskType:taskType}
              }

              this.$emit('jumpDetails', data)
          }else{
            const routeUrl = this.$router.resolve({ path: '/workbench/case/seeCaseDetail/' + val.caseId, query: {taskType:taskType}})
             window.open(routeUrl.href, "_blank");
          }
         
        },
        reactYear() {
            let nowDate = new Date()
            let dates = new Date(nowDate)
            dates.setDate(dates.getDate() - 365)
            let seperator1 = '-'
            let year = dates.getFullYear()
            let month = dates.getMonth() + 1
            let strDate = dates.getDate()
            if (month >= 1 && month <= 9) {
                month = '0' + month
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = '0' + strDate
            }
            this.reactYearData = year + seperator1 + month + seperator1 + strDate
        },
        beforeThree() {
            const dates = new Date()
            dates.setMonth(dates.getMonth() - 3)
            let pastMonth = dates.getMonth() + 1
            let pastDay = dates.getDate()
            if (pastMonth >= 1 && pastMonth <= 9) {
                pastMonth = '0' + pastMonth
            }
            if (pastDay >= 0 && pastDay <= 9) {
                pastDay = '0' + pastDay
            }
            this.threeDate = dates.getFullYear() + '-' + pastMonth + '-' + pastDay
        },
        haflYear() {
            let curDate = (new Date()).getTime()
            let halfYear = 365 / 2 * 24 * 3600 * 1000
            let pastResult = curDate - halfYear
            let pastDate = new Date(pastResult)
            let pastYear = pastDate.getFullYear()
            let pastMonth = pastDate.getMonth() + 1
            let pastDay = pastDate.getDate()
            if (pastMonth >= 1 && pastMonth <= 9) {
                pastMonth = '0' + pastMonth
            }
            if (pastDay >= 0 && pastDay <= 9) {
                pastDay = '0' + pastDay
            }
            this.haflYearData = pastYear + '-' + pastMonth + '-' + pastDay
        },
        nowDate() {
            const loadYear = new Date().getFullYear()
            let loadMonth = new Date().getMonth() + 1
            let loadDay = new Date().getDate()
            if (loadMonth >= 1 && loadMonth <= 9) {
                loadMonth = '0' + loadMonth
            }
            if (loadDay >= 0 && loadDay <= 9) {
                loadDay = '0' + loadDay
            }
            this.nowDayData = loadYear + '-' + loadMonth + '-' + loadDay
        },
        labelName(val) {
            if(val.label == '关联工时') {
                this.parmins = {
                    caseId: this.paramsData.data.caseId,
                    wfStatusList: ['已核销','未核销']
                }
            }else if(val.label == '参考工时') {
                this.parmins = {
                    isReference: 1,
                    hoursId: this.paramsData.data.hoursId,
                }
            }else if(val.label == '数据分析') {
                this.radio1 = '案件'
                this.parmins = {
                    caseId: this.paramsData.data.caseId,
                    isStatistics: 1,
                    workDateArray: []
                }
            }
            this.queryWorkHours()
        },
        radioAClick(val) {
            this.parmins = {
                isStatistics : 1
            }
            if(val == '客户') {
              this.flag = true
              this.parmins.custId = this.paramsData.data.custId
              this.parmins.caseId = null
            }
            if(val == '案件') {
              this.flag = false
              this.parmins.caseId = this.paramsData.data.caseId
              this.parmins.custId = null
            }
            this.queryWorkHours()
        },
        radioBClick(val) {
            this.nowDate()
            this.haflYear()
            this.beforeThree() 
            this.reactYear()
            this.parmins.workDateArray = []
            if(val) {
                this.parmins.workDateArray.push(val == 1 ? this.haflYearData : this.threeDate, this.nowDayData)
            }else {
                this.parmins.workDateArray.push( this.reactYearData,this.nowDayData)
            }
            this.queryWorkHours()
        },
        showFlag(dat) {
            if(this.labelValue == 0) {
              this.labelName({ label: '关联工时' })
            }else if (this.labelValue == 1) {
              this.labelName({ label: '参考工时' })
            }else if (this.labelValue == 2){
              this.labelName({ label: '数据分析' })
              this.radio1 = '案件'
              this.flag = false
            }
        },
        queryWorkHours() {
            this.oloading = true
            this.workhoursList = []
            queryWorkHours(this.parmins).then(res => {
                this.oloading = false
                this.analyzeList = res.data.workhoursList  
                this.workhoursList = res.data.workhoursList
                this.workhoursList.forEach(item => {
                  item.approvedAmountCust = item.approvedAmountCust.toLocaleString('en-US')
                });
                this.parmins.workDateArray = []
            })
        }
    }
}    
</script>


<style lang="scss" scoped>
.clica {
    background-color: blue;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    float: left;
    margin-top: 6px;
    margin-right: 4px;
}
.worktime-tips {
    // width: 600px;
    font-size: 14px;
    .associated-time {
        
        .shenh {
            display: block;
            float: left;
        }
        >>> .el-col > i {
            margin-right: 4px;
        }
        >>> .el-radio__input {
            display: none;
        }
        >>> .el-radio__label {
            padding: 0;
        }
    }
}
.divider-segmentation{
  display: block;
  height: 1px;
  width: 100%;
  background-color: #dcdfe6;
  /*top: 20%;*/
  margin: 16px 0;
}
</style>