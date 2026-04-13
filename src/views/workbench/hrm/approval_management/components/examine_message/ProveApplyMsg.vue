<template>
    <div class="examine-message">
        <el-row :gutter="20">
            <el-col :span="10">
                <div>
                    <p>证明提交单位</p>{{ approveDetail.proveSubmitUnit }}
                </div>
            </el-col>
            <el-col :span="11" :offset="2">
                <div>
                    <p>模版类型</p>{{ approveDetail.proveTemplateType }}
                </div>
            </el-col>

        </el-row>
        <el-row :gutter="20">
            <el-col :span="24">
                <div>
                    <p>申请原因</p>{{ approveDetail.reason }}
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="24">
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
    name: 'ProveApplyMsg',
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