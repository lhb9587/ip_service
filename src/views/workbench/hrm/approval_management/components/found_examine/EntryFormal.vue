<template>
  <div>
    <!-- 入职审批（正式岗位） -->
    <!-- 入职审批（实习生岗位） -->
    <el-form
      size="small"
      ref="examineForm"
      :model="examineForm"
      label-width="100px"
      :rules="rules"
    >
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="20" :offset="1">
          <el-form-item label="招聘说明" prop="description">
            <el-input
              type="textarea"
              v-model="examineForm.description"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="9" :offset="1">
          <el-form-item label="简历来源" prop="source">
            <el-input v-model="examineForm.source"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="上传附件" prop="materialIdList">
            <UpLoad
              @addApproveMaterials="addApproveMaterials"
              @deleteApproveMaterials="deleteApproveMaterials"
              tip="（简历）"
              :file-list="materialIdList"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <div class="message">
        <div class="blok"></div>
        <span>拟录候选人基本信息</span>
      </div>
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="7" :offset="1">
          <el-form-item label="姓名" prop="enrollName">
            <el-input v-model="examineForm.enrollName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" >
          <el-form-item label="性别" prop="enrollGender" label-width="70px">
            <el-radio-group v-model="examineForm.enrollGender">
              <el-radio label="男"></el-radio>
              <el-radio label="女"></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="岗位" prop="enrollPosId" label-width="60px">
            <el-select
              v-model="examineForm.enrollPosId"
              filterable
              clearable
              placeholder="请选择"
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
      </el-row>
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="20" :offset="1">
          <el-form-item label="工作组" prop="enrollWkgId">
            <el-cascader
              ref="uploadFile"
              placeholder="部门工作组"
              :props="defaultParams"
              :options="groupList"
              clearable
              filterable
              change-on-select
              v-model="examineForm.enrollWkgId"
              style="width: 100%;"
            ></el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="appTypeId == 3" :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="9" :offset="1">
          <el-form-item label="试用期月薪" prop="probationSalary">
            <el-input
              v-model="examineForm.probationSalary"
              style="width: 80px"
            ></el-input>
            <span>元/月</span>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="转正月薪" prop="salary">
            <el-input
              v-model="examineForm.salary"
              style="width: 80px"
            ></el-input>
            <span>元/月</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="appTypeId == 3" :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="9" :offset="1">
          <el-form-item label="合同期限" prop="contractLimit">
            <el-input-number
              v-model="examineForm.contractLimit"
              :min="0"
            ></el-input-number>
            <span>年</span>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="试用期期限" prop="probationMonth">
            <el-input-number
              v-model="examineForm.probationMonth"
              :min="1"
            ></el-input-number>
            <span>个月</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="appTypeId == 4" :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="9" :offset="1">
          <el-form-item label="实习待遇" prop="internSalary">
            <el-input
              v-model="examineForm.internSalary"
              style="width: 72%"
            ></el-input>
            <span>元/日</span>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="实习协议期限" prop="internMonth" label-width="120px">
            <el-input-number
              v-model="examineForm.internMonth"
              :min="1"
            ></el-input-number>
            <span>个月</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="appTypeId == 4" :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="9" :offset="1">
          <el-form-item label="实习类型" prop="internType">
            <el-radio-group v-model="examineForm.internType">
              <el-radio label="短期实习"></el-radio>
              <el-radio label="实习留用"></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="20" :offset="1">
          <el-form-item label="说明" prop="inernDesc">
            <el-input
              type="textarea"
              v-model="examineForm.inernDesc"
              placeholder="如为实习留用，需说明计划留用岗位及留用薪资标准"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="message">
        <div class="blok"></div>
        <span>教育经历</span>
        <el-button size="small" type="primary" @click="eduIncrement"
          >新增一行</el-button
        >
      </div>
      <el-row
        :gutter="20"
        style="margin-bottom: 10px;"
        class="add-table edu-table"
      >
        <el-table
          :data="examineForm.eduContentList"
          :border="true"
          size="mini"
          style="width: 90%;margin: auto;"
        >
          <el-table-column fixed label="开始时间">
            <template slot-scope="scope">
              <el-form-item
                class="table-item"
                :prop="`eduContentList[${scope.$index}][startDate]`"
                :rules="rules.startDate"
              >
                <el-date-picker
                  v-model="scope.row.startDate"
                  clearable
                  style="width: 120px;"
                  size="mini"
                  type="date"
                  class="dataTime"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column fixed label="结束时间">
            <template slot-scope="scope">
              <el-form-item
                class="table-item"
                :prop="`eduContentList[${scope.$index}][endDate]`"
                :rules="rules.endDate"
              >
                <el-date-picker
                  v-model="scope.row.endDate"
                  clearable
                  style="width: 120px;"
                  size="mini"
                  type="date"
                  class="dataTime"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column fixed label="毕业院校" width="200">
            <template slot-scope="scope">
              <el-form-item
                class="table-item"
                :prop="`eduContentList[${scope.$index}][collegeName]`"
                :rules="rules.collegeName"
              >
                <el-input
                  v-model="scope.row.collegeName"
                  clearable
                  size="mini"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column fixed label="专业" width="140">
            <template slot-scope="scope">
              <el-form-item
                class="table-item"
                :prop="`eduContentList[${scope.$index}][major]`"
                :rules="rules.major"
              >
                <el-input
                  v-model="scope.row.major"
                  clearable
                  size="mini"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column fixed label="学历" width="90">
            <template slot-scope="scope">
              <el-form-item
                class="table-item"
                :prop="`eduContentList[${scope.$index}][eduDegree]`"
                :rules="rules.eduDegree"
              >
                <el-input
                  v-model="scope.row.eduDegree"
                  clearable
                  size="mini"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="60px">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                :disabled="scope.$index === 0"
                @click="eduHandleDel(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <div class="message">
        <div class="blok"></div>
        <span>工作/实习经历</span>
        <el-button size="small" type="primary" @click="workIncrement"
          >新增一行</el-button
        >
      </div>
      <el-row :gutter="20" style="margin-bottom: 10px;" class="add-table">
        <el-table
          :data="examineForm.workContentList"
          :border="true"
          size="mini"
          style="width: 90%;margin: auto;"
        >
          <el-table-column fixed label="开始时间" width="142">
            <template slot-scope="scope">
              <el-date-picker
                v-model="scope.row.startDate"
                clearable
                style="width: 120px;"
                size="mini"
                type="date"
                class="dataTime"
                value-format="yyyy-MM-dd"
              />
            </template>
          </el-table-column>
          <el-table-column fixed label="结束时间" width="142">
            <template slot-scope="scope">
              <el-date-picker
                v-model="scope.row.endDate"
                clearable
                style="width: 120px;"
                size="mini"
                type="date"
                class="dataTime"
                value-format="yyyy-MM-dd"
              />
            </template>
          </el-table-column>
          <el-table-column fixed label="公司" width="290">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.company"
                clearable
                size="mini"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column fixed label="岗位">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.position"
                clearable
                size="mini"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="60px">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                @click="workHandleDel(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <div class="message">
        <div class="blok"></div>
        <span>技能信息</span>
      </div>
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="9" :offset="1">
          <el-form-item label="专业相关证书" prop="majorCertificate">
            <el-input v-model="examineForm.majorCertificate"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" :offset="1">
          <el-form-item label="外语等级证书" prop="languageCertificate">
            <el-input v-model="examineForm.languageCertificate"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="20" :offset="1">
          <el-form-item label="面试官评价" prop="evaluation">
            <el-input
              type="textarea"
              :rows="6"
              v-model="examineForm.evaluation"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col
          :span="20"
          :offset="1"
          style="text-align: right; margin-top: 60px;"
        >
          <el-button @click="Cancel">取消</el-button>
          <el-button type="primary" @click="onCreactExamine(0)">保存</el-button>
          <el-button type="primary" v-if="!dataDetail.submit" @click="onCreactExamine(1)">提交</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { queryOrganizations, queryPositions } from "@/api/hrmList.js";
import { creatematerialUrl } from "@/api/serviceApi.config.js";
import UpLoad from "./UpLoad.vue";
export default {
  name: "EntryFormal",
  props: ["appTypeId","dataDetail"],
  components: { UpLoad },
  data() {
    return {
      groupList: [],
      positionsList: [],
      fileUrl: creatematerialUrl,
      uploadFileData: {
        tokenID: this.$store.getters.token
      },
      materialIdList:[],
      appUserId: this.$store.getters.userId,
      examineForm: {
        description: "",      //实习说明
        inernDesc:"",              //招聘说明
        source: "",
        enrollName: "",
        enrollGender: "男",
        enrollPosId: "",
        enrollWkgId: "",
        probationSalary: "",
        salary: "",
        contractLimit: null,
        probationMonth: "",
        internSalary: "",
        internMonth: "",
        internType: "短期实习",
        majorCertificate: "",
        languageCertificate: "",
        evaluation: "",
        eduContentList: [
          {
            id: "id-1",
            startDate: "",
            endDate: "",
            collegeName: "",
            major: "",
            eduDegree: "",
            company: "",
            position: ""
          }
        ],
        workContentList: [
          {
            startDate: "",
            endDate: "",
            collegeName: "",
            major: "",
            eduDegree: "",
            company: "",
            position: ""
          }
        ]
      },
      defaultParams: {
        value: "deptCode",
        label: "kingDeeGroupName",
        checkStrictly: true,
        children: "children"
      },
      rules: {
        description: [
          { required: true, message: "请填写招聘说明"}
        ],
        source: [
          { required: true, message: "请填写简历来源"}
        ],
        startDate: [
          { required: true, message: "此项为必填项"}
        ],
        endDate: [{ required: true, message: "此项为必填项"}],
        collegeName: [
          { required: true, message: "此项为必填项"}
        ],
        major: [{ required: true, message: "此项为必填项"}],
        eduDegree: [{ required: true, message: "必填项"}],
        enrollName: [
          { required: true, message: "请填写候选人姓名"}
        ],
        enrollGender: [
          { required: true, message: "请填写候选人性别"}
        ],
        enrollPosId: [
          { required: true, message: "请填写候选人岗位"}
        ],
        enrollWkgId: [
          { required: true, message: "请选择工作组"}
        ],
        probationSalary: [
          { required: true, message: "请填写试用期月薪"}
        ],
        salary: [
          { required: true, message: "请填写转正月薪"}
        ],
        contractLimit: [
          { required: true, message: "请填写合同年限"}
        ],
        probationMonth: [
          { required: true, message: "请填写试用期期限"}
        ],
        internSalary: [
          { required: true, message: "请填写实习待遇"}
        ],
        internMonth: [
          { required: true, message: "请填写实习协议期限"}
        ],
        internType: [
          { required: true, message: "请填写实习类型"}
        ],
        evaluation: [
          { required: true, message: "请填写面试官评价"}
        ]
      },
    };
  },
  watch: {  
    dataDetail(newVal) {  
        // 处理新数据  
        if (newVal.approveMaterials&&newVal.approveMaterials.length) {
          this.materialIdList = newVal.approveMaterials.map(item => {
            return {
              name: item.materialName,
              url: item.materialPath,
              materialId: item.materialId
            };
          });
        }
        this.description = newVal.description
        const item = newVal.approveItems[0];
        this.examineForm = {
            id:item.id,
            description: newVal.description,
            inernDesc: item.description,
            source: newVal.source,
            enrollName: item.enrollName,
            enrollGender: item.enrollGender,
            enrollPosId: item.enrollPosId,
            enrollWkgId: this.findAncestors(this.groupList, item.enrollWkgId),
            probationSalary: item.probationSalary,
            salary: item.salary,
            contractLimit: item.contractLimit,
            probationMonth: item.probationMonth,
            internSalary: item.internSalary,
            internMonth: item.internMonth,
            internType: item.internType,
            majorCertificate: item.majorCertificate,
            languageCertificate: item.languageCertificate,
            evaluation:item.evaluation,
            eduContentList:item.eduContentList,
            workContentList:item.workContentList,
          }
    },
    groupList(newVal){
      if (newVal.length > 0 && this.dataDetail.approveItems&&this.dataDetail.approveItems.length>0) {
        this.examineForm.enrollWkgId = this.findAncestors(newVal, Number(this.dataDetail.approveItems[0].enrollWkgId))
      }
    }
  },
  methods: {
    findAncestors(nodes, targetId) {  
      if (!nodes || nodes.length === 0) {
        return []
      }
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
      console.log(arr,'arr');
      return arr;  
    },
    eduHandleDel(row) {
      const index = this.examineForm.eduContentList.findIndex(
        item => item.id === row.id
      );
      if (index !== -1) {
        this.examineForm.eduContentList.splice(index, 1);
      }
    },
    workHandleDel(row) {
      const index = this.examineForm.workContentList.findIndex(
        item => item.id === row.id
      );
      if (index !== -1) {
        this.examineForm.workContentList.splice(index, 1);
      }
    },
    errorUpload() {
      this.$message({
        message: "上传失败",
        type: "warning"
      });
    },
    successUpload() {
      this.$message({
        message: "上传成功",
        type: "success"
      });
    },
    beforeUpload(file) {
      var is2M = file.size / 1024 / 1024 < 2;
      if (!is2M) {
        this.$message({
          message: "上传文件大小不能超过 2MB!",
          type: "warning"
        });
        return false;
      }
      // let regex = /(.jpg|.jpeg|.gif|.png|.pdf)$/;
      let regex = /(.pdf)$/;
      if (regex.test(file.name.toLowerCase())) {
        console.log("校验通过");
      } else {
        this.$message.warning("只能上传.pdf文件");
        return false;
      }
    },
    handlefileList(file) {
      // 点击已上传文件列表的钩子
      this.pdfUrl = this.getPdfUrl(file);
    },
    handleRemove(file) {
      this.pdfUrl = "";
    },
    // 获取岗位列表
    queryPositions() {
      queryPositions().then(res => {
        this.positionsList = res.data;
      });
    },
    // 获取部门列表
    queryOrganizations() {
      queryOrganizations({ status: 1 }).then(res => {
        this.groupList = res.data;
      });
    },
    eduIncrement() {
      this.examineForm.eduContentList.push({
        id: `id-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        startDate: "",
        endDate: "",
        collegeName: "",
        major: "",
        eduDegree: ""
      });
    },
    workIncrement() {
      this.examineForm.workContentList.push({
        id: `id-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        startDate: "",
        endDate: "",
        company: "",
        position: ""
      });
    },
    // 上传相关
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3);
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
        if (valid) {
          this.$message({ message: "验证成功", type: "success" });
          const data = {
            appUserId: this.appUserId,
            description: this.examineForm.description,
            source: this.examineForm.source,
            materialIdList: this.materialIdList.map(item=>item.materialId),
            approveItems: []
          };
          let approveItems = JSON.parse(JSON.stringify(this.examineForm))
          approveItems.enrollWkgId = approveItems.enrollWkgId[approveItems.enrollWkgId.length - 1];
          approveItems.description = approveItems.inernDesc
          approveItems.source = undefined
          data.approveItems.push(approveItems);
          this.$emit("createApproval",data,type);
        } else {
          this.$message({ message: "请根据提示填写表单", type: "error" });
        }
      });
    },
    Cancel() {
      this.$emit("CancelOff");
    },
  },
  created() {
    this.getNowFormatDate();
    this.queryPositions();
    this.queryOrganizations();
  }
};
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
.add-table {
  >>> .el-table__cell {
    padding: 0 4px;
  }
  >>> .el-input__inner {
    padding: 0 4px;
    // border: none;
  }
  /deep/.dataTime {
    .el-input__inner {
      padding: 0 4px 0 30px;
    }
  }
}
/deep/.edu-table{
  .el-form-item {
    margin-bottom: 0;
  }
}
.table-item {
  >>> .el-form-item__content {
    margin-left: 0 !important;
  }
}
</style>
