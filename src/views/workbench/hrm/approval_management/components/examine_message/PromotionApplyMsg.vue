<template>
    <div class="examine-message">
        <el-row :gutter="20">
            <el-col :span="10">
                <div>
                    <p>入职时间</p>{{ approveDetail.startDate }}
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
                    <p>性别</p>{{ approveDetail.enrollGender }}
                </div>
            </el-col>
            <el-col :span="11" :offset="2">
                <div>
                    <p>年龄</p>{{ approveDetail.age }}
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="10">
                <div>
                    <p>现岗位</p>{{ approveDetail.enrollPosName }}
                </div>
            </el-col>
            <el-col :span="11" :offset="2">
                <div>
                    <p>工作组</p>{{ approveDetail.enrollWkgName }}
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="10">
                <div>
                    <p>申请晋升岗位</p>{{ approveDetail.promotePosName }}
                </div>
            </el-col>
            <el-col :span="11" :offset="2">
                <div style="display: flex;">
                    <p>附件</p>
                    <div>
                        <div class="fontColor" v-for="(item,index) in approveMaterials" :key="index">
                            <span @click="preView(item.materialPath)">{{ item.materialName }}</span>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { preView } from "@/utils/index";
import { convertDecimalToYearsMonths } from '@/utils/index.js';
export default {
    name: 'PromotionApplyMsg',
    props: ['approveDetail','approveMaterials'],
    methods:{
        convertDecimalToYearsMonths,
        preView,
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
.fontColor {
    color: #409EFF;
    cursor: pointer;
}
</style>