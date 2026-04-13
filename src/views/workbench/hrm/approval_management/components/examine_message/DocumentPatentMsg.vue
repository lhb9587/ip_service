<template>
    <div class="examine-message">
        <el-row :gutter="20">
            <el-col :span="10">
                <div>
                    <p>岗位</p>{{ approveDetail.enrollPosName }}
                </div>
            </el-col>
            <el-col :span="11" :offset="2">
                <div>
                    <p>司龄</p>{{ convertDecimalToYearsMonths(approveDetail.workingYears) }}
                </div>
            </el-col>

        </el-row>
        <el-row :gutter="20">
            <el-col :span="10">
                <div>
                    <p>工作组</p>{{ approveDetail.enrollWkgName }}
                </div>
            </el-col>
            <el-col :span="11" :offset="2" v-if="appTypeId == 17">
                <div>
                    <p>取得法律职业资格证书日期</p>{{ approveDetail.certificationDate }}
                </div>
            </el-col>
            <el-col :span="11" :offset="2" v-else>
                <div>
                    <p>取得专代理师资格证书日期</p>{{ approveDetail.certificationDate }}
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="10" v-if="appTypeId == 17">
                <div>
                    <p >证书编号</p>{{ approveDetail.certificationNumber }}
                </div>
            </el-col>
            <el-col :span="10" v-else>
                <div>
                    <p>资格证号</p>{{ approveDetail.certificationNumber }}
                </div>
            </el-col>
            <el-col :span="11" :offset="2"  v-if="appTypeId == 17">
                <div>
                    <p>所属业务领域是否包括诉讼业务</p>{{ approveDetail.hasLawsuitBusiness === 1 ? '是': '否' }}
                </div>
            </el-col>
            <el-col :span="11" :offset="2" v-else>
                <div>
                    <p>专业领域</p>{{ approveDetail.majorType }}
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { convertDecimalToYearsMonths } from '@/utils/index.js';
export default {
    name: 'DocumentPatentMsg',
    props: ['approveDetail','appTypeId'],
    created(){
        console.log(this.appTypeId,'approveDetail.approveTypeId');
    },
    methods:{
        convertDecimalToYearsMonths
    }
}
</script>

<style lang='scss' scoped>
.examine-message {
    margin-top: 24px;
    div {
        margin-bottom: 14px;
        p {
            float: left;
            width: 100px;
            text-align: right;
            margin-right: 16px;
            color: #c3c3c3;
            clear: both;
        }
    }
}
</style>