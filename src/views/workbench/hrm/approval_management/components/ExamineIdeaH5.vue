<template>
    <div>
        <el-dialog
            width="72%"
            :visible.sync="innerVisible"
            append-to-body
            @close="offIdea()"
            class="examinel-h5">
            <el-form ref="controls" :model="approveOpinions" label-position="top" label-width="80px" :rules="rules">
                <el-form-item label="意见" prop="region">
                    <el-select v-model="approveOpinions[option]" placeholder="请选择意见" @change="changeYj">
                        <el-option v-for="(item, index) in idea" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="意见补充" prop="supplementOpinion">
                    <el-input type="textarea" :rows="4" v-model="approveOpinions.supplementOpinion"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onExamine">确定</el-button>
                    <el-button @click="resetForm">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import { auditPersonApprove } from '@/api/hrmList.js'
export default {
    name: 'ExamineIdeaH5',
    props: ['approveId', 'dataDetail'],
    data() {
      return {
        innerVisible: true,
        currentTaskName: '首席合伙人意见',
        option: 'councilOpinion',
        approveOpinions: {
            councilOpinion: '',
            chiefOpinion: '',
            departOpinion: '',
            supplementOpinion: ''
        },
        idea: [
            {label: '同意', value: '同意'},
            {label: '不同意', value: '不同意'},
            {label: '部分同意', value: '部分同意'},
            {label: '暂缓审批', value: '暂缓审批'},
        ],
        rules: {
            region: [{ required: true, message: '请选择审批意见', trigger: 'change' }],
        }
      }
    },
    methods: {
        // 关闭内置弹框
        resetForm() {
            this.innerVisible = false
        },
        offIdea() {
            this.$emit('offIdea')
        },
        gmentProcess() {
            if(this.dataDetail.currentTaskName == '管委会合伙人意见') {
                this.option = 'councilOpinion'
                this.rules.supplementOpinion = [{ required: true, message: '请选择活动区域', trigger: 'change' }]
            }else if (this.dataDetail.currentTaskName == '首席合伙人意见') {
                this.option = 'chiefOpinion'
            }else {
                this.option = 'councilOpinion'
                this.rules['supplementOpinion'] = [{ required: true, message: '请选择活动区域', trigger: 'change' }]
            }
        },
        changeYj(val) {
            this.approveOpinions[this.option] = val
            this.$set(this.approveOpinions, `${this.option}`, val)
        },
        // 提交
        onExamine() {
            this.$refs.controls.validate(valid => {
                if(valid) {
                    this.$message({ message: '验证成功', type: 'success' });
                    this.auditPersonApprove()
                } else {
                    this.$message({ message: '请根据提示填写表单', type: 'error' });
                    this.$refs.form.resetFields()
                }
            })
        },
        auditPersonApprove() {
            const data = {
                processDefineId: this.dataDetail.processDefineId,
                approveId: this.approveId,
                currentTaskId: this.dataDetail.currentTaskId,
                approveOpinions: []
            }
            data.approveOpinions.push(this.approveOpinions)
            auditPersonApprove(data).then(res => {
                this.offIdea()
            })
        }
    },
    updated() {
        this.gmentProcess()
    }
}
</script>

<style lang="scss" scoped>
.examinel-h5 {
    >>>.el-dialog__body {
        padding: 4px 16px;
    }
    >>>.el-form-item__label {
        padding: 0;
    }
}
</style>