<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      top="20px"
      width="80%"
      height="90%"
      :before-close="handleClose">
      <div>
        <div style="font-weight: bold">工商信息</div>
        <el-form label-width="160px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="统一社会信用代码">
                <span v-if="pageState === 'view'">{{ formData.creditCode }}</span>
                <el-input v-else v-model="formData.creditCode" placeholder="请输入统一社会信用代码"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="主体中文名称">
                <span v-if="pageState === 'view'">{{ formData.companyNameCn }}</span>
                <el-input v-else v-model="formData.companyNameCn" placeholder="请输入主体中文名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="主体简称">
                <span v-if="pageState === 'view'">{{ formData.companyAbbreviation }}</span>
                <el-input v-else v-model="formData.companyAbbreviation" placeholder="请输入主体简称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="法定代表人">
                <span v-if="pageState === 'view'">{{ formData.representName }}</span>
                <el-input v-else v-model="formData.representName" placeholder="请输入法定代表人名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="主体英文名称">
                <span v-if="pageState === 'view'">{{ formData.companyNameEn }}</span>
                <el-input v-else v-model="formData.companyNameEn" placeholder="请输入主体英文名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="组织机构代码">
                <span v-if="pageState === 'view'">{{ formData.orgCode }}</span>
                <el-input v-else v-model="formData.orgCode" placeholder="请输入组织机构代码"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="登记状态">
                <span v-if="pageState === 'view'">{{ formData.regStatus }}</span>
                <el-input v-else v-model="formData.regStatus" placeholder="请输入登记状态"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="成立日期">
                <span v-if="pageState === 'view'">{{ formData.establishDate }}</span>
                <el-date-picker
                  v-else
                  v-model="formData.establishDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="工商注册号">
                <span v-if="pageState === 'view'">{{ formData.regNo }}</span>
                <el-input v-else v-model="formData.regNo" placeholder="请输入工商注册号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="注册资本">
                <span v-if="pageState === 'view'">{{ formData.regCapital }}</span>
                <el-input v-else v-model="formData.regCapital" placeholder="请输入注册资本"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="实缴资本">
                <span v-if="pageState === 'view'">{{ formData.paidCapital }}</span>
                <el-input v-else v-model="formData.paidCapital" placeholder="请输入实缴资本"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="纳税人识别号">
                <span v-if="pageState === 'view'">{{ formData.taxIdentNum }}</span>
                <el-input v-else v-model="formData.taxIdentNum" placeholder="请输入纳税人识别号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="企业类型">
                <span v-if="pageState === 'view'">{{ formData.companyType }}</span>
                <el-input v-else v-model="formData.companyType" placeholder="请输入企业类型"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="营业期限">
                <span v-if="pageState === 'view'">{{ formData.businessTerm }}</span>
                <el-input v-else v-model="formData.businessTerm" placeholder="请输入营业期限"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="纳税人资质">
                <span v-if="pageState === 'view'">{{ formData.taxpayerQual }}</span>
                <el-input v-else v-model="formData.taxpayerQual" placeholder="请输入纳税人资质"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="当前人数">
                <span v-if="pageState === 'view'">{{ formData.empNum }}</span>
                <el-input v-else v-model="formData.empNum" placeholder="请输入当前人数"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="公司联络人">
                <span v-if="pageState === 'view'">{{ formData.sealUserIdStr }}</span>
                <el-select v-else default-first-option :clearable='true' placeholder="请选择"
                           v-model="formData.sealUserId" filterable>
                  <el-option v-for="item in $store.getters.userList" :key="item.userId" :label="item.fullname"
                             :value="item.userId">
                    <!--                        <UserIconAndUserName :user-id="item.userId"></UserIconAndUserName>-->
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="地域">
                <span v-if="pageState === 'view'">{{ formData.nameCn }}</span>
                <el-select v-else v-model="formData.deptId" filterable clearable>
                  <el-option
                    v-for="item in queryCompanyList"
                    :key="item.deptId"
                    :label="item.companyShortName"
                    :value="item.deptId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="主管税务机关">
                <span v-if="pageState === 'view'">{{ formData.taxAgency }}</span>
                <el-input v-else v-model="formData.taxAgency" placeholder="请输入主管税务机关"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="专业资质">
                <span v-if="pageState === 'view'">{{ formData.professionalQual }}</span>
                <el-input v-else v-model="formData.professionalQual" placeholder="请输入专业资质"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="从属关系">
                <span v-if="pageState === 'view'">{{ formData.relationship }}</span>
                <el-input v-else v-model="formData.relationship" placeholder="请输入从属关系"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="功能性主体">
                <span v-if="pageState === 'view'">{{ formData.functionComp }}</span>
<!--                <el-input v-else v-model="formData.functionComp" placeholder="请输入功能性主体"></el-input>-->
                <el-select v-else default-first-option :clearable='true' placeholder="请选择" style="width: 50%;"
                           v-model="formData.functionCompArr" multiple filterable>
                  <el-option v-for="item in companyTypeSelectList" :key="item.name" :label="item.name"
                             :value="item.name">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="注册地址">
                <span v-if="pageState === 'view'">{{ formData.address }}</span>
                <el-input v-else type="textarea" v-model="formData.address" placeholder="请输入注册地址"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="营业范围">
                <span v-if="pageState === 'view'">{{ formData.businessScope }}</span>
                <el-input v-else type="textarea" v-model="formData.businessScope"
                          placeholder="请输入营业范围"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="上传文件">
                <div>
                  <div v-if="pageState === 'view'">
                    <div v-for="item in materialList1" @click="onPreview(item)">
                      <span class="pointer">{{ item.materialName }}</span>
                    </div>
                  </div>
                  <el-upload
                    v-else
                    style="width: 50%;"
                    ref="upload"
                    class="upload-demo"
                    drag
                    multiple
                    name="attachFile"
                    :data="uploadData"
                    :action="creatematerial"
                    :file-list="materialList1"
                    :on-remove="(file,fileList) => handleRemove(file,fileList)"
                    :on-preview="onPreview"
                    :on-success="onsuccess"
                  >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                  </el-upload>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <div style="font-weight: bold;width: 100%;display: flex;justify-content: space-between;align-items: flex-end">
              <div>印章信息</div>
              <el-button type="primary" size="mini" @click="addRow1">增加</el-button>
            </div>
          </el-row>
          <el-row>
            <el-table
                ref="tableList"
                border
                :data="reportData.fDeptSealInfoList"
                fit
                empty-text="暂无数据"
                highlight-current-row
                current-row-key
                style="width: 100%;"
                max-height="500"
            >
              <el-table-column type="index" width="60" label="序号" align="left">
              </el-table-column>
              <el-table-column label="印章名称" align="left">
                <template slot-scope="scope">
                  <span v-if="pageState === 'view'">{{ scope.row.sealName }}</span>
                  <el-input v-else v-model="scope.row.sealName" placeholder="请输入印章名称"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="印章保管人" align="left">
                <template slot-scope="scope">
                  <el-select :disabled="pageState === 'view'" default-first-option :clearable='true' placeholder="请选择"
                             v-model="scope.row.sealUserId" filterable>
                    <el-option v-for="item in $store.getters.userList" :key="item.userId" :label="item.fullname"
                               :value="item.userId">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="附件" align="left">
                <template slot-scope="scope">
                  <div>
                    <div v-if="pageState === 'view'">
                      <div v-for="item in scope.row.mtArray" @click="onPreview(item)">
                        <span class="pointer">{{ item.materialName }}</span>
                      </div>
                    </div>
                    <el-upload
                        v-else
                        style="width: 100%;"
                        ref="upload"
                        class="upload-demo"
                        :multiple="true"
                        name="attachFile"
                        :limit="1"
                        :data="uploadData1"
                        :action="creatematerial"
                        :file-list="scope.row.mtArray"
                        :on-remove="(file,fileList) => handleRemoveRow(file, scope.row)"
                        :on-preview="onPreview"
                        :on-exceed="exceedFile"
                        :on-success="(res) => onsuccessRow(res, scope.row)"
                    >
                      <el-button type="primary" size="mini">上传</el-button>
                    </el-upload>
                  </div>
                </template>
              </el-table-column>
              <el-table-column v-if="pageState !== 'view'" label="操作" align="left">
                <template slot-scope="scope">
                  <span class="pointer" style="color: #F56C6C; margin-left: 10px;"
                        @click="delRow1(scope.$index)">删除</span>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
<!--          <el-row>-->
<!--            <el-col :span="24">-->
<!--              <el-form-item label="印章信息">-->
<!--&lt;!&ndash;                <div>&ndash;&gt;-->
<!--&lt;!&ndash;                  <div v-if="pageState === 'view'">&ndash;&gt;-->
<!--&lt;!&ndash;                    <div v-for="item in materialList2" @click="onPreview(item)">&ndash;&gt;-->
<!--&lt;!&ndash;                      <span class="pointer">{{ item.materialName }}</span>&ndash;&gt;-->
<!--&lt;!&ndash;                    </div>&ndash;&gt;-->
<!--&lt;!&ndash;                  </div>&ndash;&gt;-->
<!--&lt;!&ndash;                  <el-upload&ndash;&gt;-->
<!--&lt;!&ndash;                      v-else&ndash;&gt;-->
<!--&lt;!&ndash;                      style="width: 50%;"&ndash;&gt;-->
<!--&lt;!&ndash;                      ref="upload"&ndash;&gt;-->
<!--&lt;!&ndash;                      class="upload-demo"&ndash;&gt;-->
<!--&lt;!&ndash;                      drag&ndash;&gt;-->
<!--&lt;!&ndash;                      multiple&ndash;&gt;-->
<!--&lt;!&ndash;                      name="attachFile"&ndash;&gt;-->
<!--&lt;!&ndash;                      :data="uploadData1"&ndash;&gt;-->
<!--&lt;!&ndash;                      :action="creatematerial"&ndash;&gt;-->
<!--&lt;!&ndash;                      :file-list="materialList2"&ndash;&gt;-->
<!--&lt;!&ndash;                      :on-remove="(file,fileList) => handleRemove(file,fileList)"&ndash;&gt;-->
<!--&lt;!&ndash;                      :on-preview="onPreview"&ndash;&gt;-->
<!--&lt;!&ndash;                      :on-success="onsuccess"&ndash;&gt;-->
<!--&lt;!&ndash;                  >&ndash;&gt;-->
<!--&lt;!&ndash;                    <i class="el-icon-upload"></i>&ndash;&gt;-->
<!--&lt;!&ndash;                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>&ndash;&gt;-->
<!--&lt;!&ndash;                  </el-upload>&ndash;&gt;-->
<!--&lt;!&ndash;                </div>&ndash;&gt;-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--          </el-row>-->
          <el-row>
            <div style="font-weight: bold;width: 100%;display: flex;justify-content: space-between;align-items: flex-end">
              <div>股东信息</div>
              <el-button type="primary" size="mini" @click="addRow">增加</el-button>
            </div>
          </el-row>
          <el-row>
            <el-table
              ref="tableList"
              border
              :data="reportData.shareholderList"
              fit
              empty-text="暂无数据"
              highlight-current-row
              current-row-key
              style="width: 100%;"
              max-height="500"
            >
              <el-table-column type="index" width="60" label="序号" align="left">
              </el-table-column>
              <el-table-column label="股东名称" align="left">
                <template slot-scope="scope">
                  <span v-if="pageState === 'view'">{{ scope.row.partnerName }}</span>
                  <el-input v-else v-model="scope.row.partnerName" placeholder="请输入股东名称"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="任职职务" align="left">
                <template slot-scope="scope">
                  <span v-if="pageState === 'view'">{{ scope.row.position }}</span>
                  <el-input v-else v-model="scope.row.position" placeholder="请输入任职职务"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="股东标签" align="left">
                <template slot-scope="scope">
                  <span v-if="pageState === 'view'">{{ scope.row.partnerLabel }}</span>
                  <el-input v-else v-model="scope.row.partnerLabel" placeholder="请输入股东标签"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="股东类型" align="left">
                <template slot-scope="scope">
                  <span v-if="pageState === 'view'">{{ scope.row.partnerType }}</span>
                  <el-input v-else v-model="scope.row.partnerType" placeholder="请输入股东类型"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="持股比例" align="left">
                <template slot-scope="scope">
                  <span v-if="pageState === 'view'">{{ scope.row.shareholdingRatio }}</span>
                  <el-input v-else v-model="scope.row.shareholdingRatio" placeholder="请输入持股比例"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="认缴出资额(万元)" align="left">
                <template slot-scope="scope">
                  <span v-if="pageState === 'view'">{{ scope.row.subsContribution }}</span>
                  <el-input v-else v-model="scope.row.subsContribution" placeholder="请输入认缴出资额"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="认缴出资日期" align="left">
                <template slot-scope="scope">
                  <span v-if="pageState === 'view'">{{ scope.row.subsConDate }}</span>
                  <el-date-picker
                    v-else
                    v-model="scope.row.subsConDate"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </template>
              </el-table-column>
              <el-table-column label="首次持股日期" align="left">
                <template slot-scope="scope">
                  <span v-if="pageState === 'view'">{{ scope.row.initialShareholdingDate }}</span>
                  <el-date-picker
                    v-else
                    v-model="scope.row.initialShareholdingDate"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </template>
              </el-table-column>
              <el-table-column v-if="pageState !== 'view'" label="操作" align="left">
                <template slot-scope="scope">
                  <span class="pointer" style="color: #F56C6C; margin-left: 10px;"
                        @click="delRow(scope.$index)">删除</span>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-form>
        <div class="button_wrap">
          <el-button v-if="pageState!='view'" class="exactButton" type="primary" @click="submit">保存</el-button>
          <el-button class="exactButton" plain @click="handleClose">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {creatematerial} from '@/api/ipServiceApi.config.js'
import {createOrModifyCompany, delCaseMaterial} from '@/api/caseList'
import {queryCompany, queryDeptCompany} from "@/api/feeList"
import {getProgID} from "@/utils/editInOffice";
import {deleteMaterial} from "@/api/customerList";

export default {
  name: 'Company',
  props: ['pageState', 'reportData', 'companyList'],
  data() {
    return {
      companyTypeSelectList: [
        {
          name: '商标代理机构'
        },
        {
          name: '专利代理机构'
        },
        {
          name: '可签约主体'
        },
        {
          name: '影子公司'
        },
      ],
      materialList1: [],
      materialList2: [],
      uploadData: {
        tokenID: this.$store.getters.token,
        objType: 102000
      },
      uploadData1: {
        tokenID: this.$store.getters.token,
        objType: 102001
      },
      creatematerial,
      tableDefaultList: [
        {
          title: '期号',
          value: 'annNum',
          width: 'auto'
        }
      ],
      tableList: [],
      dialogVisible: true,
      diasabledInput: false,// 可读可写
      dialogTitle: '',
      queryCompanyList: [],
      formData: {
        deptId: '',
        nameCn: '',
        nameEn: ''
      }
    }
  },
  created() {
    this.queryCompany()
    this.selectAction()
  },
  methods: {
    exceedFile(){
      this.$message.info('文件已存在！')
    },
    handleRemove(file) {
      let delmaterialId
      if (file.response) {
        delmaterialId = file.response.data[0].materialId
      } else {
        delmaterialId = file.materialId
      }
      deleteMaterial({materialId: delmaterialId}).then(res => {
        this.$message.success('删除成功！')
        this.formData.materialList.splice(this.formData.materialList.findIndex(item => item.materialId == delmaterialId), 1)
        this.materialList1 = JSON.parse(JSON.stringify(this.formData.materialList.filter(item => item.objType == 102000) || []))
        this.materialList2 = JSON.parse(JSON.stringify(this.formData.materialList.filter(item => item.objType == 102001) || []))
      })
    },
    handleRemoveRow(file, row) {
      let delmaterialId
      if (file.response) {
        delmaterialId = file.response.data[0].materialId
      } else {
        delmaterialId = file.materialId
      }
      deleteMaterial({materialId: delmaterialId}).then(res => {
        this.$message.success('删除成功！')
        row.materialId = undefined
        this.formData.materialList.splice(this.formData.materialList.findIndex(item => item.materialId == delmaterialId), 1)
        this.materialList1 = JSON.parse(JSON.stringify(this.formData.materialList.filter(item => item.objType == 102000) || []))
        this.materialList2 = JSON.parse(JSON.stringify(this.formData.materialList.filter(item => item.objType == 102001) || []))
      })
    },
    onsuccess(res, file, fileList) {
      this.$message.success('上传成功！')
      if (!this.formData.materialList) {
        this.formData.materialList = []
      }
      const data = res.data[0] || {}
      data.name = data.materialName

      this.formData.materialList.push(res.data[0])
      this.materialList1 = JSON.parse(JSON.stringify(this.formData.materialList.filter(item => item.objType == 102000) || []))
      this.materialList2 = JSON.parse(JSON.stringify(this.formData.materialList.filter(item => item.objType == 102001) || []))
    },
    onsuccessRow(res, row) {
      this.$message.success('上传成功！')
      if (!this.formData.materialList) {
        this.formData.materialList = []
      }
      const data = res.data[0] || {}
      data.name = data.materialName
      row.materialId = data.materialId
      this.formData.materialList.push(res.data[0])
      this.materialList1 = JSON.parse(JSON.stringify(this.formData.materialList.filter(item => item.objType == 102000) || []))
      this.materialList2 = JSON.parse(JSON.stringify(this.formData.materialList.filter(item => item.objType == 102001) || []))
    },
    downLoad(data) {
      const url = data.address || data.url
      const downData = {
        url: `ipdoc${url}`,
        success() {
        }
      }
      if (data.mailId) {
        downData.downLoad = data.materialName
      }
      this.$commonUtils.downLoadAll(downData)
    },
    onPreview(data) {
      if (data.raw) {
        data = data.response.data[0]
      }
      let url = data.address || data.url
      if (getProgID(url) || ['eml', 'msg'].includes(url.replace(/.+\./, '').toLocaleLowerCase())) {
        if (['doc', 'docx'].includes(url.replace(/.+\./, "").toLocaleLowerCase())) {
          this.$commonUtils.viewPdf(`${url}`)
        } else {
          let flag = ''
          if (data.mailId) {
            flag = 'mailId'
          } else if (data.materialId) {
            flag = 'materialId'
          }
          url = url.replace(/&/g, '%26')
          window.open(`#/preView?address=ipdoc${url}&${flag}=${data[flag]}`.replace(/[+]/g, '%2B'))
        }
      } else if (['pdf', 'jpg', 'png'].some(item => url.replace(/.+\./, "").toLocaleLowerCase() == item)) {
        window.open(`/ipdoc${url}`.replace(/[+]/g, '%2B'))
      } else {
        this.downLoad(data)
      }
    },
    addRow1() {
      this.reportData.fDeptSealInfoList.push({
        sealName: '',
        sealUserId: '',
        materialList: []
      })
    },
    addRow() {
      this.reportData.shareholderList.push({
        compId: this.reportData.compId || undefined,
        partnerName: '',
        shareholdingRatio: '',
        subsContribution: '',
        subsConDate: '',
        initialShareholdingDate: '',
        position: '',
        partnerLabel: '',
        partnerType: ''
      })
    },
    delRow1(index){
      this.reportData.fDeptSealInfoList.splice(index, 1)
    },
    delRow(index) {
      this.reportData.shareholderList.splice(index, 1)
    },
    selectAction() {
      switch (this.pageState) {
        case 'view':
          this.dialogTitle = '主体-查看'
          this.diasabledInput = true
          this.formData = this.reportData
            if (this.reportData.fDeptSealInfoList && this.reportData.fDeptSealInfoList.length) {
              this.reportData.fDeptSealInfoList.forEach(item => {
                if (item.materialId) {
                  item.mtArray = this.formData.materialList.filter(i => i.materialId === item.materialId)
                }
              })
            }
          this.materialList1 = this.formData.materialList.filter(item => item.objType == 102000) || []
          this.materialList2 = this.formData.materialList.filter(item => item.objType == 102001) || []
          break;
        case 'create':
          this.dialogTitle = '主体-创建'
          break;
        case 'edit':
          this.dialogTitle = '主体-编辑'
          this.formData = this.reportData
          if (this.reportData.fDeptSealInfoList && this.reportData.fDeptSealInfoList.length) {
            this.reportData.fDeptSealInfoList.forEach(item => {
              if (item.materialId) {
                item.mtArray = this.formData.materialList.filter(i => i.materialId === item.materialId)
              }
            })
          }
          this.materialList1 = this.formData.materialList.filter(item => item.objType == 102000) || []
          this.materialList2 = this.formData.materialList.filter(item => item.objType == 102001) || []
          break;
        default:
          break;
      }
      if (this.formData.functionComp) {
        this.$set(this.formData, 'functionCompArr', this.formData.functionComp.split(','))
      } else {
        this.$set(this.formData, 'functionCompArr', [])
      }
    },
    queryCompany() {
      queryCompany().then(res => {
        this.queryCompanyList = res.data
      })
    },
    submit() {
      if (this.formData.functionCompArr && this.formData.functionCompArr.length) {
        this.formData.functionComp = this.formData.functionCompArr.join(',')
      } else {
        this.formData.functionComp = ''
      }
      createOrModifyCompany(this.formData).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.handleClose(true)
        }
      });
    },
    handleClose(state) {
      this.$emit('closeDialog', false, state === true ? state : false);
    }
  },
}
</script>

<style lang="scss" scoped>
.el-form {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  .el-select, .el-input, .el-date-picker, .el-textarea {
    width: 95%;
  }

  .el-textarea {
    margin: 10px 0;
  }

  /deep/ input {
    height: 28px;
  }

  /deep/ .el-input__icon {
    line-height: 28px;
  }

  .el-row {
    min-height: 30px;
    height: 100%;
    width: 100%;
    display: flex;
    //align-items: center;
    .el-col {
      display: flex;
    }

    .el-form-item {
      width: 100%;
      display: flex;
      border: 1px solid #EBEEF5;
      margin: 0px !important;

      /deep/ .el-form-item__label {
        background: #f5f7fa;
        height: 100%;
      }

      /deep/ .el-form-item__content {
        margin-left: 0 !important;
        padding-left: 10px;
        background: #fff;
        flex: 1;
      }
    }
  }
}

.button_wrap {
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: center;

  .el-button {
    margin-left: 30px;
  }
}

.title {
  width: 100%;
  font-size: 16px;
  color: #6AA7FF;
  height: 50px;
  line-height: 50px;
  font-weight: normal;
  position: relative;

  .title_right {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }
}

.title-div {
  font-size: 14px;
  color: #fb9608a3;
  line-height: 30px;
}

.topBox {
  background-color: #F2F2F2;
  padding-left: 20px;
  display: flex;
  height: 40px;
  /*justify-content: center;*/
  align-items: center;
  margin-bottom: 10px;

  .iconfont {
    margin-right: 10px;
    color: #E6A23C;
    font-size: 20px;
  }

}

.down-dialog /deep/ .el-dialog__body {
  padding-top: 0px;
}

.input-lable {
  float: left;
  width: 30%;
  height: 40px;
  font-size: 16px;
  text-align: center;
  line-height: 40px;
  background-color: #F2F2F2;
}

.switch-lable {
  float: right;
  width: 40%;
  height: 40px;
  font-size: 12px;
  text-align: center;
  line-height: 40px;
}

> > > .el-dialog__body {
  padding-top: 0;
}

> > > .el-table, > > > .pl-table {
  /*margin-top: 10px;*/
  margin-bottom: 15px;

  .el-table__header-wrapper {
    /*border: 1px solid #EBEEF5;*/
    /*border-bottom: none;*/

    th {
      padding: 7px 0;
      background-color: #F5F7FA;
      font-size: 14px;
      color: #606266;
      font-weight: normal;

      .el-table__column-filter-trigger {
        .el-icon-arrow-down {
          color: #fff;
          font-size: 16px;
        }
      }
    }

    .el-table__header {
      .cell {
        height: 23px;
        line-height: 23px;
        display: flex;

        .caret-wrapper {
          height: 23px !important;

          .ascending {
            top: 0 !important;
          }

          .descending {
            bottom: 1px !important;
          }
        }

        .el-table__column-filter-trigger {
          height: 23px;
          line-height: 23px;
        }
      }
    }
  }
}
</style>
