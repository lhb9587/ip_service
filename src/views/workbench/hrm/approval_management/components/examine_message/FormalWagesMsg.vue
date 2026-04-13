<template>
    <div class="examine-message">
        <el-row :gutter="20">
            <el-col :span="10">
                <div>
                    <p style="width: 120px;">发薪周期</p>{{ approveDetail.contractLimit }}
                </div>
            </el-col>
            <el-col :span="11" :offset="2">
                <div>
                    <p>发薪人数</p>{{ approveDetail.recruitNum  }}
                </div>
            </el-col>

        </el-row>
        <el-row :gutter="20">
            <el-col :span="10">
                <div>
                    <p style="width: 120px;">发薪总额</p>{{ approveDetail.salary }}
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
export default {
    name: 'FormalWagesMsg',
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