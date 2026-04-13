<template>
    <div class="examine-message">
        <el-row :gutter="20">
            <el-col :span="10">
                <div>
                    <p>姓名</p>{{ approveDetail.enrollName }}
                </div>
            </el-col>
            <el-col :span="11" :offset="2">
                <div>
                    <p>性别</p>{{ approveDetail.enrollGender }}
                </div>
            </el-col>

        </el-row>
        <el-row :gutter="20">
            <el-col :span="10">
                <div>
                    <p>岗位</p>{{ approveDetail.enrollPosName }}
                </div>
            </el-col>
            <el-col :span="11" :offset="2">
                <div>
                    <p>工作组</p>{{ approveDetail.enrollWkgName }}
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20" v-if="appTypeId==3">
            <el-col :span="10">
                <div>
                    <p>试用期月薪</p>{{ approveDetail.probationSalary }}
                </div>
            </el-col>
            <el-col :span="11" :offset="2">
                <div>
                    <p>转正月薪</p>{{ approveDetail.salary }}
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20" v-if="appTypeId==3">
            <el-col :span="10">
                <div>
                    <p>合同年限</p>{{ approveDetail.contractLimit }}
                </div>
            </el-col>
            <el-col :span="11" :offset="2">
                <div>
                    <p>试用期期限</p>{{ approveDetail.probationMonth }}
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20" v-if="appTypeId==4">
            <el-col :span="10">
                <div>
                    <p>实习待遇</p>{{ approveDetail.internSalary }}
                </div>
            </el-col>
            <el-col :span="11" :offset="2">
                <div>
                    <p>实习协议期限</p>{{ approveDetail.internMonth }}
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20" v-if="appTypeId==4">
            <el-col :span="10">
                <div>
                    <p>实习类型</p>{{ approveDetail.internType }}
                </div>
            </el-col>
            <el-col :span="11" :offset="2">
                <div>
                    <p>说明</p>{{ approveDetail.description }}
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="3">
                <div>
                    <p>教育经历</p>
                </div>
            </el-col>
            <el-col :span="21">
                <el-table :data="approveDetail.eduContentList" :border="true" size="mini" style="margin-left: 14px;">
                    <el-table-column prop="startDate" label="开始时间" width="110"></el-table-column>
                    <el-table-column prop="endDate" label="结束时间" width="110"></el-table-column>
                    <el-table-column prop="collegeName" label="毕业院校" width="160"></el-table-column>
                    <el-table-column prop="major" label="专业" width="140"></el-table-column>
                    <el-table-column prop="eduDegree" label="学历"></el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="3">
                <div>
                    <p>实习经历</p>
                </div>
            </el-col>
            <el-col :span="21">
                <el-table :data="approveDetail.workContentList" :border="true" size="mini" style="margin-left: 14px;">
                    <el-table-column prop="startDate" label="开始时间" width="110"></el-table-column>
                    <el-table-column prop="endDate" label="结束时间" width="110"></el-table-column>
                    <el-table-column prop="company" label="公司" ></el-table-column>
                    <el-table-column prop="position" label="岗位" width="175"></el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="10">
                <div>
                    <p>专业相关证书</p>{{ approveDetail.majorCertificate }}
                </div>
            </el-col>
            <el-col :span="11" :offset="2">
                <div>
                    <p>外语等级证书</p>{{ approveDetail.languageCertificate }}
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="23">
                <div>
                    <p>面试官评价</p>{{ approveDetail.evaluation }}
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'EntryMessage',
    props: ["appTypeId",'approveDetail'],
    data() {
        return {}
    },
    methods: {}
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