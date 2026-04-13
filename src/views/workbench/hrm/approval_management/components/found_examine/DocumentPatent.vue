<template>
    <div>
        <!-- 执证申请（律师实习） -->
        <!-- 执证申请（专利代理师实习备案） -->
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
                <span>申请信息</span>
            </div>
            <el-row :gutter="20" style="margin-bottom: 10px;">
                <el-col :span="9" :offset="1">
                    <el-form-item label="岗位" prop="enrollPosId">
                        <el-select
                            v-model="talentInfo.posId"
                            filterable
                            clearable
                            placeholder="请选择"
                            :disabled="true"
                            >
                            <el-option
                                v-for="opt in positionsList"
                                :key="opt.id"
                                :label="opt.posName"
                                :value="opt.id"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="10" :offset="1">
                    <el-form-item label="司龄" prop="workingYears">
                        <el-input v-model="companyAgeFormatted" :disabled="true"></el-input>
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
                            v-model="enrollWkgId"
                            style="width: 100%;"
                            :disabled="true"
                        ></el-cascader>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="appTypeId == 17" :gutter="20" style="margin-bottom: 10px;">
                <el-col :span="9" :offset="1">
                    <el-form-item label="取得法律职业资格证书日期" prop="certificationDate">
                        <el-date-picker
                            v-model="examineForm.certificationDate"
                            type="date"
                            style="width: 202px;"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="10" :offset="1">
                    <el-form-item label="证书编号" prop="certificationNumber">
                        <el-input v-model="examineForm.certificationNumber"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="appTypeId == 17" :gutter="20" style="margin-bottom: 10px;">
                <el-col :span="24" :offset="1">
                    <el-form-item label="所属业务领域是否包括诉讼业务" prop="hasLawsuitBusiness">
                        <el-radio-group v-model="examineForm.hasLawsuitBusiness">
                            <el-radio :label="1">是</el-radio>
                            <el-radio :label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row v-if="appTypeId == 18" :gutter="20" style="margin-bottom: 10px;">
                <el-col :span="9" :offset="1">
                    <el-form-item label="取得专代理师资格证书日期" prop="certificationDate">
                        <el-date-picker
                            v-model="examineForm.certificationDate"
                            type="date"
                            style="width: 202px;"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="10" :offset="1">
                    <el-form-item label="资格证号" prop="certificationNumber">
                        <el-input v-model="examineForm.certificationNumber"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="appTypeId == 18" :gutter="20" style="margin-bottom: 10px;">
                <el-col :span="9" :offset="1">
                    <el-form-item label="专业领域" prop="majorType">
                        <el-input v-model="examineForm.majorType"></el-input>
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
import { convertDecimalToYearsMonths } from '@/utils/index.js';
export default {
    name: 'DocumentPatent',
    props:{
        talentInfo:{
            type: Object,
            default: () => {}
        },
        appTypeId:{
            type: Number,
            default: null
        },
        positionsList:{
            type: Array,
            default: () => []
        },
        groupList:{
            type: Array,
            default: () => []
        },
        dataDetail:{
            type: Object,
            default: () => {}
        },
    },
    data() {
        return {
            appUser: this.$store.getters.name,
            appUserId: this.$store.getters.userId,
            appDate: '',
            enrollWkgId:[],
            examineForm: {
                certificationDate: '',
                certificationNumber: '',
                hasLawsuitBusiness: '',
                majorType: '',
            },
            defaultParams: {
                value: "deptCode",
                label: "kingDeeGroupName",
                checkStrictly: true,
                children: "children"
            },
            rules: {
                certificationDate: [
                    { required: true, message: "请填写法律职业资格证书日期", trigger: ["blur","change"] }
                ],
                certificationNumber: [
                    { required: true, message: "请填写证书编号", trigger: ["blur","change"] }
                ],
                hasLawsuitBusiness: [
                    { required: true, message: "请填写所属业务领域是否包括诉讼业务", trigger: ["blur","change"] }
                ],
                certificationDate: [
                    { required: true, message: "请填写取得专代理师资格证书日期", trigger: ["blur","change"] }
                ],
                certificationNumber: [
                    { required: true, message: "请填写资格证号", trigger: ["blur","change"] }
                ],
                majorType: [
                    { required: true, message: "请填写专业领域", trigger: ["blur","change"] }
                ],
            }
        }
    },
    watch: {
        deep: true,
        dataDetail(newVal) {
            const item = newVal.approveItems[0];
            this.examineForm = {
                id: item.id,
                certificationDate: item.certificationDate,
                certificationNumber: item.certificationNumber,
                hasLawsuitBusiness:  item.hasLawsuitBusiness,
                majorType:  item.majorType,
            };
        },
        groupList(newVal){
            this.findAncestors(newVal, this.talentInfo.deptCode)
        }
    },
    computed: {  
    // 计算属性，将月份转换为“年 月”格式  
        companyAgeFormatted() {  
            return this.convertDecimalToYearsMonths(this.talentInfo.companyAge);  
        },  
    },
    methods: {
        convertDecimalToYearsMonths,
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
            return this.enrollWkgId = arr;  
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
         // 提交审批
         onCreactExamine(type) {
            this.$refs.examineForm.validate(valid => {
                if(valid) {
                    this.$message({ message: '验证成功', type: 'success' });
                    const data = {
                        appUserId: this.appUserId,
                        appDate: this.appDate,
                        approveItems: []
                    };
                    let approveItem = JSON.parse(JSON.stringify(this.examineForm))
                    approveItem.enrollPosId = this.talentInfo.posId;
                    approveItem.workingYears = this.talentInfo.companyAge;
                    approveItem.enrollWkgId = this.talentInfo.deptCode;
                    data.approveItems.push(approveItem);
                    this.$emit("createApproval",data,type);
                } else {
                    this.$message({ message: '请根据提示填写表单', type: 'error' });
                }
            })
        },
        Cancel() {
            this.$emit('CancelOff')
        }
    },
    created() {
        this.getNowFormatDate()
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
</style>