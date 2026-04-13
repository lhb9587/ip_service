<template>
    <div class="examine-message">
        <el-row :gutter="20">
            <el-col :span="11">
                <div>
                    <p>试用岗位</p>{{ approveDetail.enrollPosName }}
                </div>
            </el-col>
            <el-col :span="11" :offset="1">
                <div>
                    <p>试用期月薪</p>{{ approveDetail.probationSalary }}
                </div>
            </el-col>

        </el-row>
        <el-row :gutter="20">
            <el-col :span="11">
                <div>
                    <p>工作组</p>{{ approveDetail.enrollWkgName }}
                </div>
            </el-col>
            <el-col :span="12" :offset="1">
                <div v-if="approveDetail.startDate&&approveDetail.endDate">
                    <p>约定试用期</p>{{ approveDetail.startDate +' 至 '+ approveDetail.endDate }}
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="11">
                <div>
                    <p>申请转正时间</p>{{ approveDetail.appRegularDate }}
                </div>
            </el-col>
            <el-col :span="11" :offset="1">
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
export default {
    name: 'StraightForMsg',
    props: ['approveDetail','approveMaterials'],
    methods:{
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