<template>
    <div>
        <!-- 证明类申请  -->
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
                <el-col :span="10">
                    <el-form-item label="证明提交单位" prop="proveSubmitUnit" label-width="135px">
                        <el-input v-model="examineForm.proveSubmitUnit"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="10" :offset="1">
                    <el-form-item label="模版类型" prop="proveTemplateType">
                        <el-radio-group v-model="examineForm.proveTemplateType">
                            <el-radio label="公司模版"></el-radio>
                            <el-radio label="自行提供模版"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20" style="margin-bottom: 10px;">
                <el-col :span="20" :offset="1">
                    <el-form-item label="申请原因" prop="reason">
                        <el-input type="textarea" v-model="examineForm.reason"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20" style="margin-bottom: 10px;">
                <el-col :span="20" :offset="1">
                    <el-form-item label="上传附件" prop="approveMaterials">
                        <UpLoad
                            @addApproveMaterials="addApproveMaterials"
                            @deleteApproveMaterials="deleteApproveMaterials"
                            tip="（已填写内容的自行提供模版）"
                            :file-list="materialIdList"
                        />
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
import UpLoad from "./UpLoad.vue";
export default {
    name: 'ProveApply',
    props: ['dataDetail'],
    components: { UpLoad },
    data() {
        return {
            appUser: this.$store.getters.name,
            appUserId: this.$store.getters.userId,
            appDate: '',
            materialIdList:[],
            examineForm: {
                proveSubmitUnit: '',
                reason: '',
                proveTemplateType: '公司模版',
            },
            rules: {
                proveSubmitUnit: [
                    { required: true, message: "请填写证明提交单位", trigger: ["blur","change"] }
                ],
                reason: [
                    { required: true, message: "请填写原因", trigger: ["blur","change"] }
                ],
                proveTemplateType: [
                    { required: true, message: "请选择模版类型", trigger: ["blur","change"] }
                ],
            }
        }
    },
    watch: {
        deep: true,
        dataDetail(newVal) {
            if (newVal.approveMaterials&&newVal.approveMaterials.length) {
                this.materialIdList = newVal.approveMaterials.map(item => {
                return {
                    name: item.materialName,
                    url: item.materialPath,
                    materialId: item.materialId
                };
                });
            }
            const item = newVal.approveItems[0];
            this.examineForm = {
                id: item.id,
                proveSubmitUnit: item.proveSubmitUnit,
                reason: item.reason,
                proveTemplateType: item.proveTemplateType,
            };
        },
    },
    methods: {
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
        //删除approveMaterials 
        deleteApproveMaterials(id) {
            this.materialIdList = this.materialIdList.filter(item => item.materialId != id);
        },
        //添加approveMaterials
        addApproveMaterials(data) {
            this.materialIdList.push(data);
        },
         // 提交审批
         onCreactExamine(type) {
            this.$refs.examineForm.validate(valid => {
                if(valid) {
                    this.$message({ message: '验证成功', type: 'success' });
                    const data = {
                        appUserId: this.appUserId,
                        appDate: this.appDate,
                        materialIdList: this.materialIdList.map(item=>item.materialId),
                        approveItems: []
                    };
                    data.approveItems.push(this.examineForm);
                    this.$emit("createApproval",data,type);
                } else {
                    this.$message({ message: '请根据提示填写表单', type: 'error' });
                    this.$refs.form.resetFields()
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