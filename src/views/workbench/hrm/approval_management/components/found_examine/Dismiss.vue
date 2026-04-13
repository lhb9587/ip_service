<template>
    <div>
        <!-- 员工辞退申请 -->
        <el-form size="small" ref="examineForm" :model="examineForm" label-width="100px" :rules="rules">
            <el-row :gutter="20" style="margin-bottom: 10px;">
                <el-col :span="9" :offset="1">
                    <el-form-item label="申请人" prop="appUser">
                        <el-input v-model="appUser" :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10" :offset="1">
                    <el-form-item label="申请日期" prop="appDate">
                        <el-input v-model="appDate" :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <div class="message">
                <div class="blok"></div>
                <span>辞退员工信息</span>
            </div>
            <el-row :gutter="20" style="margin-bottom: 10px;">
                <el-col :span="9" :offset="1">
                    <el-form-item label="姓名" prop="enrollName">
                        <el-select
                            v-model="examineForm.enrollName"
                            filterable
                            placeholder="请选择"
                            >
                            <el-option
                                v-for="item in talentList"
                                :key="item.talentCode"
                                :label="item.talentName"
                                :value="item.talentName"
                            >
                            </el-option>
                            </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="10" :offset="1">
                    <el-form-item label="岗位" prop="enrollPosId">
                        <el-select v-model="examineForm.enrollPosId" filterable clearable placeholder="请选择" style="width: 100%;">
                            <el-option
                                v-for="opt in positionsList"
                                :key="opt.id"
                                :label="opt.posName"
                                :value="opt.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20" style="margin-bottom: 10px;">
                <el-col :span="20" :offset="1">
                    <el-form-item label="工作组" prop="enrollWkgId">
                        <el-cascader
                            placeholder="部门工作组"
                            :props="defaultParams"
                            :options="groupList"
                            clearable
                            filterable
                            v-model="examineForm.enrollWkgId"
                            style="width: 100%;"
                            @change="changeGroup"
                        ></el-cascader>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20" style="margin-bottom: 10px;">
                <el-col :span="10">
                    <el-form-item label="经济补偿金额" prop="dismissSalary" label-width="135px">
                        <el-input v-model="examineForm.dismissSalary"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10" :offset="1">
                    <el-form-item label="司龄" required>
                        <div style="display: flex;">
                            <el-form-item  prop="workingYears" class="innerItem">
                                <el-input v-model.number="examineForm.workingYears" style="width: 80px"></el-input>
                                <span>年</span>
                            </el-form-item>
                            <el-form-item  prop="workingMonths" class="innerItem">
                                <el-input v-model.number="examineForm.workingMonths" style="width: 80px"></el-input>
                                <span>月</span>
                            </el-form-item>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20" style="margin-bottom: 10px;">
                <el-col :span="20" :offset="1">
                    <el-form-item label="辞退原因" prop="reason">
                        <el-input type="textarea" v-model="examineForm.reason"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20" style="margin-bottom: 10px;">
                <el-col :span="20" :offset="1" style="text-align: right; margin-top: 60px;">
                    <el-button @click="Cancel">取消</el-button>
                    <el-button type="primary" @click="onCreactExamine(0)">保存</el-button>
                    <el-button type="primary" v-if="!dataDetail.submit" @click="onCreactExamine(1)">提交</el-button>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>


<script>
import { queryOrganizations } from '@/api/hrmList.js'
import { convertAgeToDecimal } from '@/utils/index.js'

export default {
    name: 'Dismiss',
    props: ['talentList','positionsList','dataDetail'],
    data() {
        return {
            appUser: this.$store.getters.name,
            appUserId: this.$store.getters.userId,
            appDate:"",
            groupList: [],
            examineForm: {
                enrollWkgId: null,
                workingYears: null,
                workingMonths: null,
                enrollName:"",
                enrollPosId: null,
                dismissSalary: null,
                reason: null,
            },
            defaultParams:{
                value: 'deptCode',
                label: 'kingDeeGroupName',
                checkStrictly: true,
                children: 'children'
            },
            rules: {
                enrollName: [
                    { required: true, message: '请填写名称', trigger: 'change' }
                ],
                enrollPosId: [
                    { required: true, message: '请填写岗位', trigger: 'change' }
                ],
                enrollWkgId: [
                    { required: true, message: '请填写工作组', trigger: 'change' }
                ],
                dismissSalary: [
                    { required: true, message: '请填写经济补偿金额', trigger: 'change' }
                ],
                workingYears: [
                    { required: true, message: '请填写司龄', trigger: 'change' }
                ],
                reason: [
                    { required: true, message: '请填写辞退原因', trigger: 'change' }
                ],
            },
        }
    },
    watch: {
        deep: true,
        dataDetail(newVal) {
            const item = newVal.approveItems[0];
            this.examineForm = {
                id: item.id,
                enrollWkgId: this.findAncestors(this.groupList, item.enrollWkgId),
                workingYears:  item.workingYears?Math.floor(item.workingYears):'',
                workingMonths: this.countMonth(item.workingYears),
                enrollPosId: item.enrollPosId,
                reason: item.reason,
                enrollName: item.enrollName,
                dismissSalary: item.dismissSalary,
            };
        },
    },
    methods: {
        countMonth(decimalYears){
            // 将年份数乘以12得到月份数
            const totalMonths = Math.round(decimalYears * 12);
            // 使用取模运算得到额外的月份
            const months = totalMonths % 12;
            return months?months:''
        },
        findAncestors(nodes, targetId) {  
            let arr = []
            nodes.forEach((firItem)=>{
                if (firItem.deptCode == targetId) {
                arr = [ targetId ]
                }else{
                if (firItem.children&&firItem.children.length) {
                    firItem.children.forEach(secItem => {
                    if (secItem.deptCode==targetId) {
                        arr =  [ firItem.deptCode, targetId]
                    }else{
                        if (secItem.children&&secItem.children.length) {
                        secItem.children.forEach(thiItem => {
                            if (thiItem.deptCode == targetId) {
                            arr = [ firItem.deptCode, secItem.deptCode, targetId]
                            }
                        });
                        }
                    }
                    });
                }
                }
            })
            return arr;  
        },
        //获取当前日期函数
        getNowFormatDate() {
            let date = new Date(),
            year = date.getFullYear(), 
            month = date.getMonth() + 1,
            strDate = date.getDate()
            if (month < 10) month = `0${month}`
            if (strDate < 10) strDate = `0${strDate}`
            this.appDate = `${year}-${month}-${strDate}`
            return `${year}-${month}-${strDate}`
        },
        // 获取部门列表
        queryOrganizations() {
            queryOrganizations({ status: 1 }).then(res => {
                this.groupList = res.data
            })
        },
        // 提交审批
        onCreactExamine(type) {
            this.$refs.examineForm.validate(valid => {
                if(valid) {
                    this.$message({ message: '验证成功', type: 'success' });
                    const data = {
                        appUserId: this.appUserId,
                        appDate: this.appDate,
                        approveItems: []
                    }
                    let approveItem = JSON.parse(JSON.stringify(this.examineForm))
                    approveItem.enrollWkgId = approveItem.enrollWkgId[approveItem.enrollWkgId.length - 1];
                    approveItem.workingYears = convertAgeToDecimal(approveItem.workingYears, approveItem.workingMonths)
                    data.approveItems.push(approveItem)
                    this.$emit("createApproval",data,type);
                } else {
                    this.$message({ message: '请根据提示填写表单', type: 'error' });
                    this.$refs.form.resetFields()
                }
            })
        },
        Cancel() {
            this.$emit('CancelOff')
        },
    },
    created() {
        this.getNowFormatDate()
        this.queryOrganizations()
    }
}

</script>

<style lang="scss" scoped>
.message {
    height: 30px;
    line-height: 30px;
    position: relative;
    margin-bottom: 20px;
    .blok {
        height: 20px;
        width: 6px;
        background-color: blue;
        border-radius: 6px;
        float: left;
        margin: 5px 14px 0 0;
    }
    span {
        font-size: 18px;
        color: #313131;
    }
}
/deep/ .innerItem {
  margin-bottom: 0;
  margin-right: 6px;
  .el-input--prefix .el-input__inner {
    padding: 0 15px;
  }
}
</style>