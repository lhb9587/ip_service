<template xmlns="http://www.w3.org/1999/html">
  <div class="hrm-container">
    <div class="hrm-header">
      <div class="info-top">
        <div v-if="talentCode" class="back-button" @click="$router.back()">
          <i class="el-icon-back"></i>
        </div>
        <el-upload
          class="avatar-uploader"
          name="attachFile"
          :disabled="!isEdit ? true : false"
          :show-file-list="false"
          :data="{tokenID:$store.getters.token, talentCode: formData.talentCode, materialType: 4}"
          :action="uploadPersonMaterial"
          :on-success="(value)=> fileChange(value)"
          :file-list="fileList"
          list-type="picture"
          :limit="1">
          <img v-if="formData.userIcon" :src="'ipdoc'+formData.userIcon" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <div>
          <div class="user-info">
            <div class="username">
              {{ formData.talentName }}
            </div>
            <div class="user-group">
              {{ formData.department }} <template v-if="formData.superGroup">- {{ formData.superGroup }}</template> <template v-if="formData.department != formData.groupName && formData.superGroup != formData.groupName">- {{ formData.groupName }}</template>
              <span>s-HR{{ formData.talentCode }}</span>
            </div>
          </div>
          <div class="user-contact">
            <div><i class="el-icon-message"></i>{{ formData.email }}</div>
            <div class="split-line">|</div>
            <div><i class="el-icon-mobile-phone"></i>{{ formData.phoneNumber }}</div>
          </div>
        </div>
        <div class="top-right" v-if="isShowEdit">
          <template v-if="formData.auditStatus !== 0">
            <el-button v-if="!isEdit" @click="handleEdit">编辑档案</el-button>
            <!--            <el-button v-if="isEdit && !status" @click="dataSave">保存</el-button>-->
            <el-button v-if="isEdit" @click="submitCheckUp">提交{{status ? '' : '审核'}}</el-button>
          </template>
          <template v-if="formData.auditStatus === 0">
            <el-alert
              title="审核中"
              type="warning"
              :closable="false">
            </el-alert>
          </template>
          <template v-else-if="formData.auditStatus === 1">
            <el-alert
              title="审核通过"
              type="success"
              :description="formData.comment"
              close-text="知道了">
            </el-alert>
          </template>
          <template v-else-if="formData.auditStatus === 2">
            <el-alert
              title="审核未通过"
              type="warning"
              :description="formData.comment">
            </el-alert>
          </template>
        </div>
      </div>
      <div class="info-tab">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="个人信息" name="personal"></el-tab-pane>
          <el-tab-pane label="岗位信息" name="job"></el-tab-pane>
          <el-tab-pane label="职业资质" name="certificate"></el-tab-pane>
          <el-tab-pane label="从业经历" name="experience"></el-tab-pane>
          <el-tab-pane v-if="formData.isResponsible" label="个人评价" name="evaluate"></el-tab-pane>
          <el-tab-pane v-if="this.$store.getters.permissions.includes(365)" label="薪资数据" name="salary"></el-tab-pane>
          <el-tab-pane label="绩效管理" name="performance"></el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="hrm-main">
      <template v-for="(tabItem,tabIndex) in tablesList" :index="tabIndex">
        <template v-if="activeName == tabIndex">
          <div class="main-list">
            <template v-for="form in tabItem.form" :index="form.type">
              <div v-if="formDisplay(form.type)" class="module">
                <div :id="form.type" class="module-top">
                  <div class="module-style"></div>
                  <div class="module-name">{{ form.name }}</div>
                </div>
                <div class="module-cont">
                  <el-form :inline="true" :model="tableHeader[form.type]" class="demo-form-inline">
                    <el-row v-for="(info,tIndex) in tableHeader[form.type]" :key="tIndex">
                      <el-col :span="info.length >2 ? 6 : 12" v-for="item in info" :key="item.field">
                        <el-form-item :rules="rules[item.field]" :label="item.lable" :class="info.length >2 ? '' : 'item-half'">
                          <template v-if="hiddenFormModule.includes(form.type) && !$store.getters.permissions.includes(363)">
                            <!--                            {{ formData[item.field] }}-->
                            <span :title="formData[item.field]">{{ formData[item.field] }}</span>
                          </template>
                          <template v-else>
                            <template v-if="!isEdit || item.hide">
                              <!--                              {{ formData[item.field] }}-->
                              <span v-if="item.type == 'pickerDate' && formData[item.field] == '9999-12-31'" :title="'长期有效'">长期有效</span>
                              <span v-else :title="formData[item.field]">{{ formData[item.field] }}</span>
                            </template>
                            <template v-else>

                              <el-input v-if="item.type=='input'" v-model="formData[item.field]" size="mini" :placeholder="'输入'+item.lable" @change="(val)=>selectItem({name:item.function,value:val})"></el-input>

                              <el-select v-else-if="item.type=='select' && item.options" v-model="formData[item.field]" @change="(val)=>selectItem({name:item.function,value:val})" filterable allow-create default-first-option size="mini" placeholder="请选择">
                                <el-option
                                  v-for="opt in item.options"
                                  :key="opt"
                                  :label="opt"
                                  :value="opt">
                                </el-option>
                              </el-select>

                              <el-date-picker
                                v-else-if="item.type=='date'"
                                v-model="formData[item.field]"
                                type="date"
                                size="mini"
                                width="200"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期"
                                @change="(val)=>selectItem({name:item.function,value:val})">
                              </el-date-picker>

                              <el-input v-else-if="item.type=='pickerDate' && formData[item.field]=='9999-12-31'" value="长期有效" size="mini" @focus="formData[item.field] = ''"></el-input>

                              <el-date-picker
                                v-else-if="item.type=='pickerDate'"
                                v-model="formData[item.field]"
                                type="date"
                                size="mini"
                                width="200"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期"
                                :picker-options="pickerOptions"
                                @change="(val)=>selectItem({name:item.function,value:val})">
                              </el-date-picker>
                            </template>
                          </template>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </div>
              </div>
            </template>
            <template v-if="tabIndex == 'personal'">
              <div id="personal" class="module">
                <div class="module-top">
                  <div class="module-style"></div>
                  <div class="module-name">个人标签特点（工作领域专长）</div>
                </div>
                <div class="module-cont">
                  <el-tag
                    :key="tag"
                    v-for="tag in formData.personLabelList"
                    :closable="isEdit"
                    :disable-transitions="false"
                    @close="handleClose(tag)">
                    {{tag}}
                  </el-tag>
                  <template v-if="isEdit">
                    <el-select v-model="tagValue" allow-create filterable size="small" style="width: 100px;" placeholder="请选择">
                      <el-option
                        v-for="item in tagSelectList"
                        :key="item"
                        :label="item"
                        :value="item">
                      </el-option>
                    </el-select>
                    <el-button @click="handleInputConfirm" size="small" icon="el-icon-plus"></el-button>
                  </template>
                </div>
              </div>
            </template>
            <template v-for="table in tabItem.table">
              <div v-if="tableDisplay(table.type,table.permissions)" class="module">
                <div :id="table.type" class="module-top">
                  <div class="module-style"></div>
                  <div class="module-name">{{ table.name }}</div>
                  <div v-if="hiddenTableModule.includes(table.type) && !$store.getters.permissions.includes(363)"></div>
                  <div v-else-if="isEdit && table.type == 'payAdjusts' && $store.getters.permissions.includes(484)" class="right-button" @click="handleAddItem(table.type)">新增</div>
                  <div v-else-if="isEdit && !['performances', 'payAdjusts'].includes(table.type)" class="right-button" @click="handleAddItem(table.type)">新增</div>
                  <div v-else-if="$store.getters.permissions.includes(363) && exportField.includes(table.type)" class="right-button" @click="handleExport(table.type, table.name)">导出</div>
                </div>
                <div class="module-cont">
                  <el-table
                    :data="
                      formData[table.type] && (formData[table.type].slice((tableHeader[table.type].currentPage - 1) * (table.type != 'performances' ? pageSize : 6), tableHeader[table.type].currentPage * (table.type != 'performances' ? pageSize : 6)))
                    "
                    style="width: 100%"
                    :class="isEdit ? 'module-td' : ''">
                    <el-table-column
                      v-for="(item, index) in tableHeader[table.type].header"
                      :key="index"
                      :prop="index"
                      :label="item.lable"
                      :show-overflow-tooltip="table.type != 'summaries' ? true : false"
                      :width="item.headerWidth ? item.headerWidth : tableHeader[table.type].headerWidth">
                      <template slot-scope="scope">
                        <template v-if="hiddenTableModule.includes(table.type) && !$store.getters.permissions.includes(363)">
                          <template v-if="item.type != 'upload'">
                            {{ showHandle(scope.row[item.field],item.handle,item.field) }}
                          </template>
                          <template v-else>
                            <el-button v-if="scope.row[item.field]" type="text" size="small" @click="preView(scope.row[item.field])">查看</el-button>
                            <span v-else>未上传</span>
                          </template>
                        </template>
                        <template v-else>
                          <span v-if="!isEdit">
                            <template v-if="item.type != 'upload'">
                              <template v-if="$store.getters.permissions.includes(299) && table.type == 'summaries' && item.field == 'content' && (scope.row.hrUserName ? scope.row.hrUserName == $store.getters.name ? true : false : true)">
                                <i v-if="scope.row.content" class="el-icon-edit" style="cursor: pointer;color: #409EFF;" @click="handleEvaluate(scope.row.id,scope.row.content,scope.$index,'content')"></i>
                                <el-button v-else type="primary" size="mini" icon="el-icon-edit" round @click="handleEvaluate(scope.row.id,scope.row.content,scope.$index,'content')">{{scope.row.content ? '' : '面谈记录'}}</el-button>
                              </template>
                              <template v-if="$store.getters.permissions.includes(299) && table.type == 'summaries' && item.field == 'feedback' && (scope.row.hrUserName ? scope.row.hrUserName == $store.getters.name ? true : false : true)">
                                <i v-if="scope.row.feedback" class="el-icon-edit" style="cursor: pointer;color: #409EFF;" @click="handleEvaluate(scope.row.id,scope.row.feedback,scope.$index,'feedback')"></i>
                                <el-button v-else type="primary" size="mini" icon="el-icon-edit" round @click="handleEvaluate(scope.row.id,scope.row.feedback,scope.$index,'feedback')">{{scope.row.feedback ? '' : '评价反馈'}}</el-button>
                              </template>
                              {{ showHandle(scope.row[item.field],item.handle,item.field) }}
                            </template>
                            <template v-else>
                              <el-button v-if="scope.row[item.field]" type="text" size="small" @click="preView(scope.row[item.field])">查看</el-button>
                              <span v-else>未上传</span>
                            </template>
                          </span>
                          <template v-else>
                            <el-input v-if="item.type=='input'" :disabled="item.permissions ? ($store.getters.permissions.includes(item.permissions) ? false : true): false" v-model="scope.row[item.field]" size="mini" :placeholder="'输入'+item.lable" @change="(val)=>selectItem({name:item.function,value:val,field:item.field,index:scope.$index,type:table.type,currentPage:tableHeader[table.type].currentPage})"></el-input>

                            <el-input v-else-if="item.type=='textarea' && item.field != 'feedback'" :disabled="item.permissions ? ($store.getters.permissions.includes(item.permissions) ? false : true): false" type="textarea" autosize v-model="scope.row[item.field]" size="mini" :placeholder="'输入'+item.lable" @change="(val)=>selectItem({name:item.function,value:val,field:item.field,index:scope.$index,type:table.type,currentPage:tableHeader[table.type].currentPage})"></el-input>

                            <el-input v-else-if="item.type=='textarea' && $store.getters.permissions.includes(item.permissions)" type="textarea" autosize v-model="scope.row[item.field]" size="mini" :placeholder="'输入'+item.lable" @change="(val)=>selectItem({name:item.function,value:val,field:item.field,index:scope.$index,type:table.type,currentPage:tableHeader[table.type].currentPage})"></el-input>

                            <el-select v-else-if="item.type=='select' && item.options" v-model="scope.row[item.field]" filterable allow-create default-first-option size="mini" placeholder="请选择" @change="(val)=>selectItem({name:item.function,value:val,field:item.field,index:scope.$index,type:table.type,currentPage:tableHeader[table.type].currentPage})">
                              <el-option
                                v-for="opt in item.options"
                                :key="opt"
                                :label="opt"
                                :value="opt">
                              </el-option>
                            </el-select>

                            <el-select v-else-if="item.type=='selectValue' && item.options" v-model="scope.row[item.field]" size="mini" placeholder="请选择" @change="(val)=>selectItem({name:item.function,value:val,field:item.field,index:scope.$index,type:table.type,currentPage:tableHeader[table.type].currentPage})">
                              <el-option
                                v-for="opt in item.options"
                                :key="opt.label"
                                :label="opt.label"
                                :value="opt.value">
                              </el-option>
                            </el-select>

                            <el-select v-else-if="item.type=='selectDepartment'" v-model="scope.row[item.field]" size="mini" filterable clearable placeholder="请选择" @change="(val)=>departmentChange(val,scope.$index)">
                              <el-option
                                v-for="opt in departmentList"
                                :key="opt.kingDeeDepartment"
                                :label="opt.kingDeeDepartment"
                                :value="opt.kingDeeDepartment">
                              </el-option>
                            </el-select>

                            <el-select v-else-if="item.type=='selectSuperGroup'" v-model="scope.row[item.field]" size="mini" filterable clearable placeholder="请选择" @change="(val)=>superGroupChange(val,scope.$index)">
                              <el-option
                                v-for="opt in superGroup[scope.$index]"
                                :key="opt.kingDeeGroupName"
                                :label="opt.kingDeeGroupName"
                                :value="opt.kingDeeGroupName">
                              </el-option>
                            </el-select>

                            <el-select v-else-if="item.type=='selectWorkGroup'" v-model="scope.row[item.field]" size="mini" filterable clearable placeholder="请选择" @change="(val)=>selectWorkGroup(item.field,val,scope.$index)">
                              <el-option
                                v-for="opt in groupList[scope.$index]"
                                :key="opt.kingDeeGroupName"
                                :label="opt.kingDeeGroupName"
                                :value="opt.kingDeeGroupName">
                              </el-option>
                            </el-select>

                            <el-select v-else-if="item.type=='selectPositions'" v-model="scope.row[item.field]" size="mini" filterable clearable placeholder="请选择" @change="(val)=>selectPositions(item.field,val,scope.$index)">
                              <el-option
                                v-for="opt in positionsList"
                                :key="opt.id"
                                :label="opt.posName"
                                :value="opt.posName">
                              </el-option>
                            </el-select>

                            <el-date-picker
                              v-else-if="item.type=='dateMonth'"
                              v-model="scope.row[item.field]"
                              type="month"
                              size="mini"
                              width="200"
                              format="yyyy-MM"
                              value-format="yyyy-MM"
                              placeholder="选择日期"
                              @change="(val)=>selectItem({name:item.function,value:val,field:item.field,index:scope.$index,type:table.type,currentPage:tableHeader[table.type].currentPage})">
                            </el-date-picker>

                            <el-date-picker
                              v-else-if="item.type=='date'"
                              v-model="scope.row[item.field]"
                              type="date"
                              size="mini"
                              width="200"
                              format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd"
                              placeholder="选择日期"
                               :disabled="item.permissions ? ($store.getters.permissions.includes(item.permissions) ? false : true): false"
                              @change="(val)=>selectItem({name:item.function,value:val,field:item.field,index:scope.$index,type:table.type,currentPage:tableHeader[table.type].currentPage})">
                            </el-date-picker>

                            <div v-else-if="item.type=='upload'" style="display: flex">
                              <el-button v-if="scope.row[item.field]" type="text" size="small" @click="preView(scope.row[item.field])">查看</el-button>
                              <el-button v-if="scope.row[item.field]" type="text" size="small" @click="scope.row[item.field] = ''" style="margin-right: 10px">删除</el-button>
                              <el-upload
                                v-if="!scope.row[item.field]"
                                class="upload"
                                name="attachFile"
                                :show-file-list="false"
                                :data="{tokenID:$store.getters.token, talentCode: formData.talentCode, materialType: item.options}"
                                :action="uploadPersonMaterial"
                                :on-success="(value)=> handleSuccess(table.type,item.field,value,scope.$index,tableHeader[table.type].currentPage)"
                                :file-list="fileList"
                                list-type="picture"
                                :limit="1">
                                <el-button size="mini">上传</el-button>
                              </el-upload>
                            </div>
                          </template>
                        </template>
                      </template>
                    </el-table-column>
                    <el-table-column
                      v-if="isEdit"
                      fixed="right"
                      label="操作"
                      width="100">
                      <template slot-scope="scope">
                        <el-button v-if="table.type == 'performances'" type="text" size="small" @click="fillInAssessInfo(scope.row)">{{ formData.userId != $store.getters.userId ? '绩效考核' : (scope.row.status == 1 ? '绩效查看' : '绩效填写') }}</el-button>
                        <span v-else-if="table.type == 'summaries' && scope.row['attachFile']"></span>
                        <div v-else>
                          <el-button
                            v-if="(!hiddenTableModule.includes(table.type) || $store.getters.permissions.includes(363)) && (table.type != 'payAdjusts' || $store.getters.permissions.includes(484))"
                            type="text"
                            size="small"
                            @click="deleteTableRow(scope.$index, table.type)">
                            删除
                          </el-button>

                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      v-if="!isEdit && table.type == 'performances'"
                      fixed="right"
                      label="操作"
                      width="200">
                      <template slot-scope="scope">
                        <el-button type="text" size="small" @click="fillInAssessInfo(scope.row)">{{ formData.userId != $store.getters.userId ? '绩效考核' : (scope.row.status == 1 ? '绩效查看' : '绩效填写') }}</el-button>
                        <el-button v-if="scope.row.performItems.length == 0 && !scope.row.status && $store.getters.permissions.includes(299)" type="text" size="small" @click="setAssessContent(scope.row)">设置绩效考核</el-button>
                        <el-button v-if="scope.row.performItems.length > 0 && $store.getters.permissions.includes(363)" type="text" style="color: red" size="small" @click="clearAssessmentContent(scope.row)">清空</el-button>
                        <el-button v-if="$store.getters.permissions.includes(363) && scope.row.status != 2" type="text" size="small" @click="settingAssessInfoEditor(scope.row,2)">授权</el-button>
                        <el-button v-else-if="$store.getters.permissions.includes(363) && scope.row.status == 2" type="text" size="small" @click="settingAssessInfoEditor(scope.row,1)">关闭</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div class="paging" v-if="formData[table.type]">
                    <div class="page">共{{formData[table.type].length}}条</div>
                    <el-pagination
                      align="right"
                      @current-change="val=>handleCurrentChange(val, table.type)"
                      :current-page="tableHeader[table.type].currentPage"
                      :page-size="table.type != 'performances' ? pageSize : 6"
                      layout="prev, pager, next"
                      background
                      :total="formData[table.type].length"
                      hide-on-single-page>
                    </el-pagination>
                  </div>
                </div>
              </div>
            </template>
          </div>
          <div class="right-column">
            <el-steps direction="vertical" :active="stepActive" style="height: 300px">
              <template v-for="form in tabItem.form">
                <el-step :key="form.step" v-if="formDisplay(form.type)" @click.native="getTopPosition(form.type,form.step)" :title="form.name" icon="el-icon-location-outline" ></el-step>
              </template>
              <el-step key="1" v-if="tabIndex=='personal'" @click.native="getTopPosition(tabIndex,1)" title="个人标签特点" icon="el-icon-location-outline" ></el-step>
              <template v-for="table in tabItem.table">
                <el-step :key="table.step" v-if="tableDisplay(table.type,table.permissions)" @click.native="getTopPosition(table.type,table.step)" :title="table.name" icon="el-icon-location-outline" ></el-step>
                <template v-if="table.type == 'performances'">
                  <el-step v-for="year in uniqueYears" :key="year" :title="year"></el-step>
                </template>
              </template>
            </el-steps>
          </div>
        </template>
      </template>
    </div>
    <el-dialog
      :title="evaluate.message"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="700px"
      @close="dialogVisible = false"
    >
      <div>
        <el-input
          type="textarea"
          :rows="10"
          :value="evaluate.inputValue"
          v-model="evaluate.inputValue"
          :placeholder="'请输入内容'+evaluate.message"
        ></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </span>
    </el-dialog>
    <el-dialog
      :title="assessMessage"
      :visible.sync="assessVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :fullscreen="true"
      width="80%"
      @close="assessVisible = false"
      class="perform-div"
    >
      <div class="assess-div" v-if="formData.performanceType === 1">
        <el-table
          class="assess-table"
          :data="assessData"
          :span-method="objectSpanMethod"
          show-summary
          :summary-method="getSummaries"
          sum-text="考核得分"
          border
          height="790px">
          <el-table-column
            prop="performType"
            label="考核维度及总占比"
            width="180">
            <template slot-scope="scope">
              <div style="text-align: center;font-weight: bold">{{ performTypes[scope.row.performType] }}</div>
              <span>{{ scope.row.performTypeDesc }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="element"
            label="考核要素">
            <template slot-scope="scope">
              <template v-if="scope.row.performType == 1">
                <div v-if="scope.$index % 2 === 0">
                  <span>{{scope.row.element}}</span>
                </div>
                <div v-else>
                  <el-input v-if="(formData.userId == $store.getters.userId) && performStatus != 1" type="textarea" v-model="scope.row.element"></el-input>
                  <span v-else>{{scope.row.element}}</span>
                </div>
              </template>
              <template v-else-if="performStatus != 1 && scope.row.performType == 3 && (formData.userId != $store.getters.userId)">
                <el-input type="textarea" v-model="scope.row.element"></el-input>
              </template>
              <template v-else>
                <span>{{scope.row.element}}</span>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            prop="standard"
            label="考核标准">
          </el-table-column>
          <el-table-column
            prop="weight"
            label="权重"
            width="100">
            <template slot-scope="scope">
              <div style="text-align: center">{{scope.row.weight}}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="score"
            label="考核得分"
            width="130">
            <template slot-scope="scope">
              <el-input v-if="performStatus != 1 && ((formData.superGroup && formData.superGroup.includes('商标流程部-档案流程组') && scope.row.performType == 3) || ($store.getters.permissions.includes(299) && scope.row.performType == 3))" v-model="scope.row.score" :placeholder="scope.row.weight ? '0-'+scope.row.weight+'分' : ''" type="number"></el-input>
              <el-input v-else-if="performStatus != 1 && ((formData.superGroup && formData.superGroup.includes('商标流程部-档案流程组')) || $store.getters.permissions.includes(299))" v-model="scope.row.score" :placeholder="scope.row.weight ? '0-'+scope.row.weight+'分' : ''" type="number" @mousewheel.native.prevent :max="scope.row.weight" :min="'0'" @change="checkInputScore(scope.row)"></el-input>
              <div v-else style="text-align: center">{{scope.row.score}}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-else>
        <div class="assess-div">
          <el-table
            :data="assessTwoData"
            class="assess-table"
          >
            <el-table-column
              prop="element"
              label="考核要素">
            </el-table-column>
            <el-table-column
              prop="standard"
              label="工作标准">
            </el-table-column>
          </el-table>
        </div>
        <div class="assess-div">
          <el-table
            class="assess-table"
            :data="assessData"
            :span-method="objectSpanMethod"
            show-summary
            :summary-method="getSummaries"
            sum-text="考核得分"
            border
            height="790px">
            <el-table-column
              prop="performType"
              label="考核维度及总占比"
              width="180">
              <template slot-scope="scope">
                <div style="text-align: center;font-weight: bold">{{ performTwoTypes[scope.row.performType] }}</div>
                <span>{{ scope.row.performTypeDesc }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="weight"
              label="权重"
              width="100">
              <template slot-scope="scope">
                <div style="text-align: center">{{scope.row.weight}}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="element"
              label="考核要素"
              width="150">
            </el-table-column>
            <el-table-column
              prop="standard"
              label="考核标准">
              <template slot-scope="scope">
                <template v-if="performStatus != 1 && (scope.row.performType == 3) && (formData.userId != $store.getters.userId)">
                  <el-input type="textarea" v-model="scope.row.standard"></el-input>
                </template>
                <template v-else>
                  <span>{{scope.row.standard}}</span>
                </template>
              </template>
            </el-table-column>
            <el-table-column
              prop="weight"
              label="自评划√"
              width="100">
              <template slot-scope="scope">
                <el-radio-group v-if="(formData.userId == $store.getters.userId) && performStatus != 1" v-model="scope.row.selfAssessment">
                  <el-radio
                    v-for="item in scope.row.selfAssessmentArray"
                    :key="item"
                    :label="item"
                    name="type"
                  ></el-radio>
                </el-radio-group>
                <span v-else>{{scope.row.selfAssessment && getMatchedValue(scope.row.selfAssessment)}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="score"
              label="考核得分"
              width="130">
              <template slot-scope="scope">
                <el-input v-if="performStatus != 1 && ((formData.superGroup && formData.superGroup.includes('商标流程部-档案流程组') && scope.row.performType == 3) || ($store.getters.permissions.includes(299) && scope.row.performType == 3))" v-model="scope.row.score" :placeholder="scope.row.weight ? '0-'+scope.row.weight+'分' : ''"></el-input>
                <el-input v-else-if="performStatus != 1 && ((formData.superGroup && formData.superGroup.includes('商标流程部-档案流程组')) || $store.getters.permissions.includes(299))" v-model="scope.row.score" :placeholder="scope.row.weight ? '0-'+scope.row.weight+'分' : ''" type="number" @mousewheel.native.prevent :max="scope.row.weight" :min="'0'" @change="checkInputScore(scope.row)"></el-input>
                <div v-else style="text-align: center">{{scope.row.score}}</div>
                <el-input
                  v-if="performStatus != 1 && ((formData.superGroup && formData.superGroup.includes('商标流程部-档案流程组')) || $store.getters.permissions.includes(299))"
                  style="margin-top: 5px"
                  type="textarea"
                  :rows="2"
                  placeholder="得分说明"
                  v-model="scope.row.scoreDesc">
                </el-input>
                <span v-else-if="scope.row.scoreDesc"><i class="el-icon-tickets"></i>{{ scope.row.scoreDesc }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <el-dialog
        title="绩效打分明细"
        :visible.sync="scoringDetailVisible"
        append-to-body
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        width="60%"
        top="10vh"
        class="scoring-div"
        @close="scoringDetailVisible = false">
        <ScoringDetail v-show="scoringDetailVisible"  :talent-code="talentCode" :assess-data="scoringDetailData" @clearAssess="scoringDetailVisible = false"></ScoringDetail>
      </el-dialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assessVisible = false">取消</el-button>
        <el-popover
          placement="top"
          width="500"
          trigger="click">
          <el-card class="box-card" style="padding: 0px">
            <div slot="header" class="clearfix">
              <span>绩效考核表关联附件管理</span>
              <el-upload
                ref="assessUpload"
                name="attachFile"
                style="float: right"
                :action="uploadPersonMaterial"
                multiple
                :limit="9"
                :data="{tokenID:$store.getters.token, talentCode: formData.talentCode, performId: performId, materialType: 20}"
                :on-success="onFileSuccess">
                <el-button v-if="performStatus != 1" size="small" style="padding: 3px 0" type="text">上传附件</el-button>
              </el-upload>
            </div>
            <el-table :data="performMaterials">
              <el-table-column property="materialName" label="附件名称"></el-table-column>
              <el-table-column
                label="操作"
                width="150">
                <template slot-scope="scope">
                  <el-button @click="preView(scope.row.materialPath)" type="text" size="small">查看</el-button>
                  <el-button @click="downLoad(scope.row.materialPath)" type="text" size="small">下载</el-button>
                  <el-button v-if="scope.row.id && performStatus != 1 && (scope.row.createUserId == $store.getters.userId)" @click="deleteAssessMaterial(scope.row.id,scope.$index)" type="text" style="color: red" size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
          <el-button type="primary" slot="reference" plain>附件管理</el-button>
        </el-popover>
        <el-button v-if="$store.getters.permissions.includes(436) && performStatus != 1 && (formData.userId != $store.getters.userId)" type="success" plain @click="scoringDetailVisible = true">历史打分明细</el-button>
        <el-button v-if="performStatus != 1 && (formData.userId != $store.getters.userId)" type="primary" @click="assessSubmit">考核确定</el-button>
        <el-button v-if="performStatus != 1 && (formData.userId == $store.getters.userId)" type="primary" @click="assessSubmit">保存</el-button>
        <el-button type="success" @click="downAssessForm()" style="margin-left: 0px">下载考核表</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="设置考核内容-1"
      :visible.sync="setAssessVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :fullscreen="true"
      width="80%"
      @close="setAssessVisible = false"
    >
      <AssessContent v-if="setAssessVisible" :talent-code="formData.talentCode" @clearAssess="setAssessVisible = false"></AssessContent>
    </el-dialog>

    <el-dialog
      title="设置考核内容-2"
      :visible.sync="setAssessTwoVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :fullscreen="true"
      width="80%"
      @close="setAssessTwoVisible = false"
    >
      <AssessTwoContent v-if="setAssessTwoVisible" :talent-code="formData.talentCode" @clearAssess="setAssessTwoVisible = false"></AssessTwoContent>
    </el-dialog>
  </div>
</template>

<script>
import { uploadPersonMaterial } from "@/api/ipServiceApi.config.js";
import { queryTalentPersonInfo, queryPositions, queryOrganizations, upsertTalentPersonInfo, updatePersonSummary, queryPersonPerformanceTemp, upsertPersonPerformance, deletePersonMaterial, exportTalentPersonPerformance } from '@/api/hrmList'
import { getToken } from "@/utils/auth";
import AssessContent from './AssessContent';
import AssessTwoContent from './AssessTwoContent';
import ScoringDetail from './ScoringDetail';
export default {
  name: 'growth_profile',
  props: ["talentCode"],
  data() {
    return {
      isEdit: false, // 页面是否编辑
      stepActive: 0,
      activeName: "personal",
      imageUrl: "", // 当前图片路径
      addUserIconUrl: process.env.VUE_APP_BASE_API, // 图片上传路径
      pageSize: 2, // 每页显示条数
      departmentList: [], // 部门列表
      superGroup: [], // 大组列表
      groupList: [], // 工作组列表
      positionsList: [], // 工作组角色列表
      isShowEdit: true,
      hiddenFormModule: ['positionInfo'],
      hiddenTableModule: ['positionAdjusts','laborContracts','trialPeriods','renewals','changes','performances'], // 禁用顶部标签模块编辑权限
      status: this.$store.getters.permissions.includes(363) ? 1 : 0, // 状态
      uploadPersonMaterial,
      dialogVisible: false, // 评价
      evaluate: {
        message: '',
        inputValue: '',
        id: '',
        index: '',
        field: ''
      },
      assessVisible: false, // 考核
      setAssessVisible: false, // 设置考核
      setAssessTwoVisible: false, // 设置考核2
      assessMessage: '', // 考核标题
      assessInfo: '', // 考核信息
      updatePerformList: false, // 考核更新id，判断是否需要手动更新
      assessData: [],
      assessTwoData: [],
      assessLimitDate: false, // 考核限制日期
      scoringDetailVisible: false, // 评分明细
      scoringDetailData: [], // 绩效明细列
      performId: '',
      performStatus: 0,
      performMaterials: [], // 业绩附件
      performTypes: {
        1: '工作任务(70%)',
        2: '综合评价(30%)',
        3: '浮动部分(5%)'
      },
      performTwoTypes: {
        1: '工作任务(90%)',
        2: '综合评价(10%)',
        3: '浮动部分(5%)'
      },
      fileList: [],
      pickerOptions: {
        shortcuts: [{
          text: '长期有效',
          onClick(picker) {
            picker.$emit('pick', '9999-12-31');
          }
        }]
      },
      tablesList: {
        personal: {
          form: [
            { name: '基本信息', type: 'personalInfo', step: 0 },
          ],
          table: [
            { name: '社会关系', type: 'socialRelations', step: 2 },
            { name: '教育经历', type: 'eduExperiences', step: 3 },
            { name: '外语水平', type: 'languages', step: 4 }
          ]
        },
        job: {
          form: [
            { name: '在职信息', type: 'positionInfo', step: 0 },
          ],
          table: [
            { name: '岗位调整', type: 'positionAdjusts', step: 1 },
            { name: '历史劳动合同', type: 'laborContracts', step: 2 }
          ]
        },
        certificate: {
          form: [
            { name: '法律/司法鉴定/仲裁/专利/商标资格', type: 'quals', step: 0 },
            { name: '执业律师', type: 'legalLawyer', step: 1 },
            { name: '法律职业资格', type: 'legalProfessions', step: 2 },
            { name: '专利代理师', type: 'patentAgent', step: 3 },
            { name: '专利代理资格', type: 'patentAgency', step: 4 },
            { name: '商标资格', type: 'trademarkInfo', step: 5 },
            { name: '仲裁员资格', type: 'arbiterInfo', step: 6 },
            { name: '司法鉴定人资格', type: 'judicialInfo', step: 7 },
          ],
          table: [
            { name: '指导律师记录', type: 'guidedLawyers', step: 8 },
            { name: '实习律师记录', type: 'lawyerTeachers', step: 9 },
            { name: '专利实习备案记录', type: 'patentPractices', step: 10 },
            { name: '职称和专业技术人员资格（人力社保局）', type: 'certificates', step: 11 }
          ]
        },
        experience: {
          form: [],
          table: [
            { name: '工作经历', type: 'workExperiences', step: 0 },
            { name: '继续教育', type: 'furtherStudies', step: 1 },
            { name: '授课/演讲/主持', type: 'lessonSpeeches', step: 2 },
            { name: '社会任职', type: 'socialOfficials', step: 3 },
            { name: '奖惩记录', type: 'rewardPunishes', step: 4 },
            { name: '论文/专著/编著', type: 'treatises', step: 5 },
            { name: '课题研究项目', type: 'projectStudies', step: 6 }
          ]
        },
        evaluate: {
          form: [],
          table: [
            { name: '试用期/转正', type: 'trialPeriods', step: 0 },
            { name: '续签', type: 'renewals', step: 1 },
            { name: '岗位/薪酬调整', type: 'changes', step: 2 },
          ]
        },
        salary: {
          form: [],
          table: [
            { name: '调薪记录', type: 'payAdjusts', step: 0 },
            // { name: '年终奖记录', type: 'bonuses', step: 1 },
          ]
        },
        performance: {
          form: [],
          table: [
            { name: '绩效记录', type: 'performances', step: 0 },
            { name: '个人总结', type: 'summaries', step: 1 },
          ]
        }
      }, // 相同table表格循环配置
      tableHeader: {
        personalInfo: [
          [
            { lable: '姓名', field: 'talentName', type: 'input' },
            { lable: '工号', field: 'talentCode', type: 'input', hide: true },
            { lable: '性别', field: 'gender', type: 'select', options: ['男','女'] },
            { lable: '年龄', field: 'age', type: 'input' }
          ],
          [
            { lable: '出生日期', field: 'birthday', type: 'date', function: 'getAge' },
            { lable: '政治面貌', field: 'politicsStatus', type: 'select', options: ['中国共产党党员','中国共产党预备党员','中国共产主义青年团团员','群众','其他民主党派'] },
            { lable: '民族', field: 'nationality', type: 'select', options: ['汉族','满族','土家族','达斡尔族','朝鲜族','蒙古族','彝族','回民','回族','侗族','苗族'] },
            { lable: '婚姻状况', field: 'maritalStatus', type: 'select', options: ['已婚','未婚'] }
          ],
          [
            { lable: '手机号码', field: 'phoneNumber', type: 'input' },
            { lable: '备用邮箱', field: 'secondEmail', type: 'input' },
            { lable: '档案存放单位', field: 'archiveUnit', type: 'input' },
            { lable: '参加工作时间', field: 'startWorkDate', type: 'date', function: 'handleWorkAge' }
          ],
          [
            { lable: '证件类型', field: 'certificateType', type: 'select', options: ['居民身份证','护照','驾驶证'] },
            { lable: '证件号码', field: 'certificateNumber', type: 'input' },
            { lable: '证件颁发日期', field: 'certificateIssueDate', type: 'date' },
            { lable: '证件有效期', field: 'certificateValidityDate', type: 'pickerDate' }
          ],
          [
            { lable: '户籍地址', field: 'domicile', type: 'input' },
            { lable: '户籍地-邮编', field: 'domicilePostCode', type: 'input' }
          ],
          [
            { lable: '现居住地址', field: 'living', type: 'input' },
            { lable: '现居住地-邮编', field: 'livingPostCode', type: 'input' }
          ],
          [
            { lable: '紧急联系人姓名', field: 'emergencyName', type: 'input' },
            { lable: '紧急联系人电话', field: 'emergencyPhone', type: 'input' }
          ]
        ], // 基本信息
        positionInfo: [
          [
            { lable: '员工类型', field: 'empType', type: 'select', options: ['正式员工','试用员工','实习员工','离职员工','辞职','辞退','退休返聘','返聘终止','兼职人员'] },
            { lable: '部门', field: 'department', type: 'input', hide: true },
            { lable: '工作组', field: 'groupName', type: 'input', hide: true },
            { lable: '岗位名称', field: 'posName', type: 'input', hide: true }
          ],
          [
            { lable: '合同签订主体', field: 'contractOwner', type: 'select', options: ['北京万慧达知识产权代理有限公司', '北京市万慧达律师事务所', '北京万慧达（上海）律师事务所', '北京君策知识产权发展中心', '北京市万慧达（广州）律师事务所', '北京万慧达知识产权代理有限公司上海分公司', '北京万慧达知识产权代理有限公司苏州分公司', '北京万慧达知识产权代理有限公司广州分公司', '北京万慧达知识产权代理有限公司重庆分公司', '北京万慧达知识产权代理有限公司杭州分公司', '北京曜斗科技有限公司', '北京万慧达知识产权代理有限公司天津分公司', '苏州万慧达知识产权咨询服务有限公司', '广州万慧达知识产权咨询服务有限公司', '重庆万慧达知识产权服务有限责任公司', '北京市万慧达（深圳）律师事务所', '北京万慧达知识产权代理有限公司宁波分公司', '北京通达亿管理咨询中心', '北京市万慧达（苏州）律师事务所', '广州达申商务咨询有限公司', '北京市万慧达（重庆）律师事务所', '北京君策九州科技有限公司', '广州达申商务咨询有限公司上海分公司', '北京万慧达（宁波）律师事务所', '北京万慧达（杭州）律师事务所','北京佰舟知识产权代理有限公司','北京璞琰科贸有限公司'], hide: true },
            { lable: '合同起始日期', field: 'contractDate', type: 'date', hide: true },
            { lable: '合同终止日期', field: 'expirationDate', type: 'date', hide: true },
            { lable: '合同年限', field: 'contractLimit', type: 'input', hide: true }
          ],
          [
            { lable: '工作邮箱', field: 'email', type: 'input' },
            { lable: '入职日期', field: 'joinDate', type: 'date', function: 'handleSeniority' },
            { lable: '转正日期', field: 'regularDate', type: 'date' },
            { lable: '离职日期', field: 'leaveDate', type: 'date' },
          ],
          [
            { lable: '司龄', field: 'companyAge', type: 'input', hide: true },
            { lable: '社会工龄', field: 'workAge', type: 'input', hide: true },
            { lable: '工资发放地', field: 'paymentPlace', type: 'select', options: ['北万','重庆','达申','广州','海南','杭州','律所','宁波','软件','上海','深圳','苏州','天津','香港','曜斗','中心','佰舟'] },
            { lable: '调整时间(年)', field: 'workAdjustTime', type: 'input' }
          ],
          [
            { lable: '所属公司', field: 'belongToCompany', type: 'select', options: ['总部','重庆','广州','海南','杭州','宁波','上海','深圳','苏州','天津','香港'] }
          ]
        ], // 在职信息
        quals: [
          [
            { lable: '法律资格', field: 'practiceType', type: 'select', options: ['法律职业资格','实习律师','执业律师','无'] },
            { lable: '专利资格', field: 'patentType', type: 'select', options: ['专利代理人资格','实习备案','专利代理师','无'] }
          ],
          [
            { lable: '商标资格', field: 'trademarkType', type: 'select', options: ['有','无'], function: 'handleTrademark' },
            { lable: '仲裁员资格', field: 'arbiterType', type: 'select', options: ['有','无'], function: 'handleArbiter' }
          ],
          [
            { lable: '司法鉴定人资格', field: 'judicialType', type: 'select', options: ['有','无'], function: 'handleJudicial' }
          ]
        ], // 法律/司法鉴定/仲裁/专利/商标资格
        legalLawyer: [
          [
            { lable: '执业机构', field: 'practiceOrganization', type: 'input' },
            { lable: '执业证类别', field: 'practiceClass', type: 'input' },
            { lable: '执业证号', field: 'practiceNumber', type: 'input' },
            { lable: '职业资格证号', field: 'practiceQualifyNumber', type: 'input' }
          ],
          [
            { lable: '发证机关', field: 'practiceUnit', type: 'input' },
            { lable: '发证日期', field: 'firstPracticeDate', type: 'date' },
            { lable: '执业年限', field: 'practiceYear', type: 'input' },
            { lable: '年度考核结果', field: 'practiceEvaluationResult', type: 'input' }
          ],
          [
            { lable: '工作地点', field: 'practiceWorkPlace', type: 'input' },
            { lable: '执业证所在地', field: 'practicePlace', type: 'input' },
            { lable: '分所负责人', field: 'practiceManager', type: 'select', options: ['是','否'] },
            { lable: '指导律师资质', field: 'practiceGuided', type: 'select', options: ['是','否'] }
          ]
        ], // 执业律师
        legalProfessions: [
          [
            { lable: '资格名称', field: 'legalProfessionName', type: 'input' },
            { lable: '证书编号', field: 'legalProfessionNumber', type: 'input' },
            { lable: '取得资格证时间', field: 'legalProfessionAcquireDate', type: 'date' },
            { lable: '颁发单位', field: 'legalProfessionOrganization', type: 'input' }
          ],
        ], // 法律职业资格
        patentAgent: [
          [
            { lable: '专业领域', field: 'patentMajor', type: 'input' },
            { lable: '资格证号', field: 'patentQualifyNumber', type: 'input' },
            { lable: '颁证日期', field: 'patentAcquireDate', type: 'date' },
            { lable: '首次执业', field: 'firstPatentDate', type: 'date' },
          ],
          [
            { lable: '执业机构', field: 'patentOrganization', type: 'input' },
            { lable: '备案编号', field: 'patentNumber', type: 'input' },
            { lable: '备案日期', field: 'patentRecordDate', type: 'date' },
            { lable: '备案机关', field: 'patentRecordUnit', type: 'input' }
          ]
        ], // 专利代理师
        patentAgency: [
          [
            { lable: '资格名称', field: 'patentAgencyName', type: 'input' },
            { lable: '证书编号', field: 'patentAgencyNumber', type: 'input' },
            { lable: '取得资格证时间', field: 'patentAgencyAcquireDate', type: 'date' },
            { lable: '颁发单位', field: 'patentAgencyOrganization', type: 'input' }
          ],
        ], // 专利代理资格
        trademarkInfo: [
          [
            { lable: '资格名称', field: 'trademarkName', type: 'input' },
            { lable: '证书编号', field: 'trademarkNumber', type: 'input' },
            { lable: '证书有效期', field: 'trademarkLimitDate', type: 'date' },
            { lable: '颁发单位', field: 'trademarkUnit', type: 'input' }
          ]
        ], // 商标资格
        arbiterInfo: [
          [
            { lable: '资格名称', field: 'arbiterName', type: 'input' },
            { lable: '证书编号', field: 'arbiterNumber', type: 'input' },
            { lable: '签发日期', field: 'arbiterIssueDate', type: 'date' },
            { lable: '聘任期限', field: 'arbiterLimitDate', type: 'date' }
          ],
          [
            { lable: '颁发单位', field: 'arbiterUnit', type: 'input' }
          ]
        ], // 仲裁员资格
        judicialInfo: [
          [
            { lable: '资格名称', field: 'judicialName', type: 'input' },
            { lable: '证书编号', field: 'judicialNumber', type: 'input' },
            { lable: '签发日期', field: 'judicialIssueDate', type: 'date' },
            { lable: '聘任期限', field: 'judicialLimitDate', type: 'date' }
          ],
          [
            { lable: '颁发单位', field: 'judicialUnit', type: 'input' }
          ]
        ], // 司法鉴定人资格
        guidedLawyers: {
          currentPage: 1,
          header: [
            { lable: '指导的实习律师', field: 'guidedLawyer', type: 'input' },
            { lable: '起始时间', field: 'startDate', type: 'date' },
            { lable: '到期时间', field: 'endDate', type: 'date' }
          ]
        }, // 指导实习律师记录
        lawyerTeachers: {
          currentPage: 1,
          header: [
            { lable: '指导律师', field: 'lawyerTeacher', type: 'input' },
            { lable: '起始时间', field: 'startDate', type: 'date' },
            { lable: '到期时间', field: 'endDate', type: 'date' },
            { lable: '实习证号', field: 'certificateNumber', type: 'input' },
            { lable: '职业资格证号', field: 'qualificationNumber', type: 'input' },
            { lable: '取得资格证时间', field: 'acquireDate', type: 'date' }
          ]
        }, // 实习律师记录
        patentPractices: {
          currentPage: 1,
          header: [
            { lable: '指导老师', field: 'lawyerTeacher', type: 'input' },
            { lable: '起始时间', field: 'startDate', type: 'date' },
            { lable: '到期时间', field: 'endDate', type: 'date' },
            { lable: '资格证号', field: 'certificationNumber', type: 'input' },
            { lable: '取得资格证时间', field: 'acquireDate', type: 'date' }
          ]
        }, // 专利实习备案记录
        socialRelations: {
          currentPage: 1,
          header: [
            { lable: '关系类型', field: 'relationType', type: 'select', options: ['父亲','母亲','配偶','儿子','女儿','兄弟','姐妹','其他'] },
            { lable: '姓名', field: 'relationName', type: 'input' },
            { lable: '工作/学习单位', field: 'relationOccupation', type: 'input' },
            { lable: '职务/身份', field: 'relationJob', type: 'input' },
            { lable: '联系电话', field: 'relationPhone', type: 'input' }
          ]
        }, // 社会关系
        eduExperiences: {
          currentPage: 1, // 当前页码
          headerWidth: '160',
          header: [
            { lable: '入学时间', field: 'entryDate', type: 'dateMonth' },
            { lable: '毕业时间', field: 'graduateDate', type: 'dateMonth' },
            { lable: '毕业院校', field: 'collegeName', type: 'input' },
            { lable: '所学专业', field: 'major', type: 'input' },
            { lable: '学历', field: 'eduExperience', type: 'select', options: ['高中','专科','本科','硕士','博士','其他'] },
            { lable: '学历证书编号', field: 'experienceNumber', type: 'input' },
            { lable: '学历附件', field: 'experienceFile', type: 'upload', options: 1 },
            { lable: '学位', field: 'eduDegree', type: 'select', options: ['学士','硕士','博士','无'] },
            { lable: '学位证书编号', field: 'degreeNumber', type: 'input' },
            { lable: '学位附件', field: 'degreeFile', type: 'upload', options: 5 }
          ]
        }, // 教育经历
        languages: {
          currentPage: 1, // 当前页码
          header: [
            { lable: '外语种类', field: 'language', type: 'select', options: ['英语','日语','德语','俄语','法语','韩语','西班牙语','无'] },
            { lable: '考试种类和等级/成绩', field: 'languageDegree', type: 'input' },
            { lable: '获取时间', field: 'acquireDate', type: 'dateMonth' },
            { lable: '工作语言', field: 'workingLanguage', type: 'select', options: ['汉语','英语','德语','俄语','法语','韩语','日语','其他'] }
          ]
        },
        positionAdjusts: {
          currentPage: 1,
          header: [
            { lable: '调整类型', field: 'adjustStatus', type: 'select', function: 'typeAdjust', options: ['员工初始化','转正','雇佣入职','实习入职','调动调入','晋升','平调','实习留用','结束实习','兼职','辞退','辞职','返聘','返聘终止','其他'] },
            { lable: '部门', field: 'deptName', type: 'selectDepartment', options: [] },
            { lable: '大组', field: 'superGroup', type: 'selectSuperGroup', options: [] },
            { lable: '工作组', field: 'groupName', type: 'selectWorkGroup', options: [] },
            { lable: '调整前岗位', field: 'oldPosName', type: 'selectPositions', options: [] },
            { lable: '调整后岗位', field: 'posName', type: 'selectPositions', options: [] },
            { lable: '任职类型', field: 'mainOfficial', type: 'selectValue', function: 'positionChange', handle: true, options: [
                {
                  value: 1,
                  label: '主要任职'
                },{
                  value: 0,
                  label: '次要任职'
                }
              ]},
            { lable: '生效日期', field: 'adjustDate', type: 'date', function: 'positionChange'}
          ]
        },
        laborContracts: {
          currentPage: 1,
          header: [
            // { lable: '合同编号', field: 'serialNumber', type: 'input' },
            { lable: '劳动合同主体', field: 'contractOwner', type: 'select', function: 'contractChange', options: ['北京万慧达知识产权代理有限公司', '北京市万慧达律师事务所', '北京万慧达（上海）律师事务所', '北京君策知识产权发展中心', '北京市万慧达（广州）律师事务所', '北京万慧达知识产权代理有限公司上海分公司', '北京万慧达知识产权代理有限公司苏州分公司', '北京万慧达知识产权代理有限公司广州分公司', '北京万慧达知识产权代理有限公司重庆分公司', '北京万慧达知识产权代理有限公司杭州分公司', '北京曜斗科技有限公司', '北京万慧达知识产权代理有限公司天津分公司', '苏州万慧达知识产权咨询服务有限公司', '广州万慧达知识产权咨询服务有限公司', '重庆万慧达知识产权服务有限责任公司', '北京市万慧达（深圳）律师事务所', '北京万慧达知识产权代理有限公司宁波分公司', '北京通达亿管理咨询中心', '北京市万慧达（苏州）律师事务所', '广州达申商务咨询有限公司', '北京市万慧达（重庆）律师事务所', '北京君策九州科技有限公司', '广州达申商务咨询有限公司上海分公司', '北京万慧达（宁波）律师事务所', '北京万慧达（杭州）律师事务所','北京佰舟知识产权代理有限公司','北京璞琰科贸有限公司'] },
            { lable: '合同编码', field: 'serialNumber', type: 'input', function: 'contractChange' },
            { lable: '合同期限类型', field: 'contractType', type: 'select', function: 'contractChange', options: ['固定期限','无固定期限'] },
            { lable: '合同期限（年）', field: 'contractLimit', type: 'input', function: 'contractChange' },
            { lable: '生效日期', field: 'takeEffectDate', type: 'date', function: 'contractChange' },
            { lable: '终止日期', field: 'terminalDate', type: 'date', function: 'contractChange'},
            // { lable: '签订日期', field: 'contractDate', type: 'date' },
            { lable: '解除日期', field: 'relieveDate', type: 'date', function: 'contractChange' }
          ]
        }, // 劳动合同
        certificates: {
          currentPage: 1,
          header: [
            { lable: '资格名称', field: 'name', type: 'input' },
            { lable: '资格等级', field: 'level', type: 'input' },
            { lable: '取得资格证书时间', field: 'acquireDate', type: 'dateMonth' },
            { lable: '证书编号', field: 'certificationNumber', type: 'input' },
            { lable: '颁发单位', field: 'organization', type: 'input' },
            { lable: '专业', field: 'major', type: 'input' }
          ]
        },
        workExperiences: {
          currentPage: 1,
          // headerWidth: '160',
          header: [
            { lable: '开始时间', field: 'startDate', type: 'dateMonth' },
            { lable: '结束时间', field: 'endDate', type: 'dateMonth' },
            { lable: '工作单位', field: 'workCompany', type: 'input', headerWidth: '350' },
            { lable: '部门', field: 'department', type: 'input' },
            { lable: '职务', field: 'position', type: 'input' }
          ]
        },
        furtherStudies: {
          currentPage: 1,
          headerWidth: '160',
          header: [
            { lable: '起始时间', field: 'startDate', type: 'dateMonth' },
            { lable: '结束时间', field: 'endDate', type: 'dateMonth' },
            { lable: '地点', field: 'address', type: 'input' },
            { lable: '组织单位', field: 'organization', type: 'input' },
            { lable: '参会费用类型', field: 'joinFeeType', type: 'select', options: ['收费','免费','权益置换','其它'] },
            { lable: '学习主题', field: 'content', type: 'input' },
            { lable: '学习形式', field: 'form', type: 'select', options: ['线上','线下'] },
            { lable: '学时', field: 'classHour', type: 'input' },
            { lable: '考试考核结果', field: 'result', type: 'select', options: ['合格','不合格','其它'] }
          ]
        },
        lessonSpeeches: {
          currentPage: 1,
          // headerWidth: '160',
          header: [
            { lable: '类型', field: 'type', type: 'select', options: ['授课','演讲','主持']},
            { lable: '起始时间', field: 'startDate', type: 'date' },
            { lable: '结束时间', field: 'endDate', type: 'date' },
            { lable: '地点', field: 'address', type: 'input' },
            { lable: '组织单位', field: 'organization', type: 'input' },
            { lable: '参会费用类型', field: 'joinFeeType', type: 'select', options: ['收费','免费','权益置换','其它'] },
            { lable: '活动规模', field: 'activityScale', type: 'input' },
            { lable: '活动主题', field: 'subject', type: 'input' },
            { lable: '讲授题目', field: 'title', type: 'input' },
            { lable: '证明文件', field: 'credentialFile', type: 'upload', options: 6 }
          ]
        },
        socialOfficials: {
          currentPage: 1,
          header: [
            { lable: '起始时间', field: 'startDate', type: 'date' },
            { lable: '结束时间', field: 'endDate', type: 'date' },
            { lable: '授予机构', field: 'organization', type: 'input' },
            { lable: '职务', field: 'duty', type: 'input' },
            { lable: '证明文件', field: 'credentialFile', type: 'upload', options: 3 }
          ]
        },
        rewardPunishes: {
          currentPage: 1,
          header: [
            { lable: '获得时间', field: 'gainDate', type: 'date' },
            { lable: '表彰奖励/惩罚名称', field: 'content', type: 'input' },
            { lable: '授予机构', field: 'organization', type: 'input' },
            { lable: '证明文件', field: 'credentialFile', type: 'upload', options: 2 }
          ]
        },
        treatises: {
          currentPage: 1,
          header: [
            { lable: '标题', field: 'title', type: 'input' },
            { lable: '类型', field: 'type', type: 'select', options: ['论文','专著','编著'] },
            { lable: '作者总人数', field: 'authorNumber', type: 'input' },
            { lable: '本人排名', field: 'personRanking', type: 'input' },
            { lable: '发表时间', field: 'publishDate', type: 'date' },
            { lable: '刊物名称/出版单位/学术会议名称', field: 'periodicalName', type: 'input' },
            { lable: '卷号/期号/页码', field: 'issueNumber', type: 'input' },
            { lable: '证明文件', field: 'credentialFile', type: 'upload', options: 7 }
          ]
        },
        projectStudies: {
          currentPage: 1,
          header: [
            { lable: '起始时间', field: 'startDate', type: 'date' },
            { lable: '结束时间', field: 'endDate', type: 'date' },
            { lable: '项目名称', field: 'projectName', type: 'input' },
            { lable: '委托单位', field: 'organization', type: 'input' },
            { lable: '本人职责与工作情况', field: 'position', type: 'input' },
            { lable: '证明人', field: 'authenticator', type: 'input' }
          ]
        },
        trialPeriods: {
          currentPage: 1,
          header: [
            { lable: '项目', field: 'item', type: 'select', options: ['试用期','转正','其他'] },
            { lable: '日期', field: 'itemDate', type: 'date' },
            { lable: '附件', field: 'attachFile', type: 'upload', options: 8 },
            { lable: '沟通内容', field: 'content', type: 'textarea', handle: true, permissions: 299 },
            { lable: '人力面谈人员', field: 'hrUserName', type: 'input' }
          ]
        },
        renewals: {
          currentPage: 1,
          header: [
            { lable: '项目', field: 'item', type: 'input' },
            { lable: '日期', field: 'itemDate', type: 'date' },
            { lable: '附件', field: 'attachFile', type: 'upload', options: 9 },
            { lable: '沟通内容', field: 'content', type: 'textarea', handle: true, permissions: 299 },
            { lable: '人力面谈人员', field: 'hrUserName', type: 'input' }
          ]
        },
        changes: {
          currentPage: 1,
          header: [
            { lable: '项目', field: 'item', type: 'input' },
            { lable: '日期', field: 'itemDate', type: 'date' },
            { lable: '附件', field: 'attachFile', type: 'upload', options: 10 },
            { lable: '沟通内容', field: 'content', type: 'textarea', handle: true, permissions: 299 },
            { lable: '人力面谈人员', field: 'hrUserName', type: 'input' }
          ]
        },
        summaries: {
          currentPage: 1,
          header: [
            { lable: '项目', field: 'item', type: 'select', options: ['2025年度总结','2024年度总结','2023年度总结','2022年度总结'] },
            { lable: '日期', field: 'itemDate', type: 'date' },
            { lable: '附件', field: 'attachFile', type: 'upload', options: 11 },
            { lable: '面谈记录', field: 'content', type: 'textarea', permissions: 299 },
            { lable: '评价反馈', field: 'feedback', type: 'textarea',handle: true, permissions: 299 },
            { lable: '负责人', field: 'hrUserName', type: 'input', permissions: 299 }
          ]
        },
        payAdjusts: {
          currentPage: 1,
          header: [
            { lable: '调薪类型', field: 'adjustType', type: 'input', permissions: 484 },
            { lable: '调整前薪资', field: 'currentSalary', type: 'input', permissions: 484 },
            { lable: '调整后薪资', field: 'adjustSalary', type: 'input', permissions: 484 },
            { lable: '调薪时间', field: 'adjustDate', type: 'date', function: 'handleAdjustDate', permissions: 484 }
          ]
        },
        bonuses: {
          currentPage: 1,
          header: [
            { lable: '年度', field: 'bonusYear', type: 'input' },
            { lable: '年终奖金额', field: 'bonusAmount', type: 'input' }
          ]
        },
        performances: {
          currentPage: 1,
          header: [
            { lable: '年度', field: 'performYear', type: 'input' },
            { lable: '月份', field: 'performMonth', type: 'input' },
            { lable: '开始日期', field: 'performDateStart', type: 'date' },
            { lable: '结束日期', field: 'performDateEnd', type: 'date' }
          ]
        }
      }, // table顶部列名
      insertData: {
        guidedLawyers: {
          guidedLawyer: '',
          startDate: '',
          endDate: ''
        },
        lawyerTeachers: {
          lawyerTeacher: '',
          startDate: '',
          endDate: '',
          practiceCard: '',
          qualificationCard: '',
          getDate: ''
        },
        patentPractices: {
          lawyerTeacher: '',
          startDate: '',
          endDate: '',
          qualificationCard: '',
          getDate: ''
        },
        socialRelations: {
          relationType: '',
          relationName: '',
          relationOccupation: '',
          relationJob: '',
          relationPhone: ''
        },
        eduExperiences: {
          entryDate: '',
          graduateDate: '',
          collegeName: '',
          major: '',
          eduExperience: '',
          experienceNumber: '',
          experienceFile: '',
          eduDegree: '',
          degreeNumber: '',
          degreeFile: ''
        },
        languages: {
          language: '',
          languageDegree: '',
          acquireDate: '',
          workingLanguage: ''
        },
        positionAdjusts: {
          posId: '',
          posName: '',
          oldPosId: '',
          oldPosName: '',
          deptCode: '',
          superGroup: '',
          deptName: '',
          groupName: '',
          mainOfficial: '',
          adjustDate: '',
          adjustStatus: ''
        },
        laborContracts: {
          serialNumber: '',
          contractOwner: '',
          contractType: '',
          contractLimit: '',
          takeEffectDate: '',
          terminalDate: '',
          contractDate: '',
          relieveDate: ''
        },
        certificates: {
          name: '',
          level: '',
          acquireDate: '',
          certificationNumber: '',
          organization: '',
          major: ''
        },
        workExperiences: {
          startDate: '',
          endDate: '',
          workCompany: '',
          department: '',
          position: ''
        },
        furtherStudies: {
          startDate: '',
          endDate: '',
          address: '',
          organization: '',
          joinFeeType: '',
          content: '',
          form: '',
          classHour: '',
          result: ''
        },
        lessonSpeeches: {
          startDate: '',
          endDate: '',
          address: '',
          organization: '',
          joinFeeType: '',
          scale: '',
          subject: '',
          title: ''
        },
        socialOfficials: {
          startDate: '',
          endDate: '',
          organization: '',
          duty: '',
          credentialFile: ''
        },
        rewardPunishes: {
          gainDate: '',
          content: '',
          organization: '',
          credentialFile: ''
        },
        projectStudies: {
          startDate: '',
          endDate: '',
          projectName: '',
          organization: '',
          position: '',
          witness: ''
        },
        treatises: {
          title: '',
          type: '',
          authorNumber: '',
          personRanking: '',
          publishDate: '',
          periodicalName: '',
          issueNumber: '',
          credentialFile: ''
        },
        trialPeriods: {
          item: '',
          itemDate: '',
          content: '',
          hrUserName: ''
        },
        renewals: {
          item: '',
          itemDate: '',
          content: '',
          hrUserName: ''
        },
        changes: {
          item: '',
          itemDate: '',
          content: '',
          hrUserName: ''
        },
        summaries: {
          item: '',
          itemDate: '',
          content: '',
          feedback: '',
          hrUserName: ''
        },
        payAdjusts: {
          adjustType: '',
          currentSalary: '',
          adjustSalary: '',
          adjustDate: ''
        },
        bonuses: {
          bonusYear: '',
          bonusAmount: ''
        },
        performances: {
          performYear: '',
          performMonth: '',
          performDateEnd: '',
          performDateStart: ''
        }
      }, // table插入数据字段
      formData: {
        personalInfo: [],
        socialRelations: [],
        eduExperiences: [],
        languages: [],
        positionInfo: [],
        positionAdjusts: [],
        laborContracts: [],
        quals: [],
        patentAgent: [],
        legalLawyer: [],
        guidedLawyers: [],
        lawyerTeachers: [],
        patentPractices: [],
        certificates: [],
        workExperiences: [],
        furtherStudies: [],
        lessonSpeeches: [],
        socialOfficials: [],
        rewardPunishes: [],
        treatises: [],
        projectStudies: [],
        trialPeriods: [],
        renewals: [],
        changes: [],
        summaries: [],
        payAdjusts: [],
        bonuses: [],
        performances: []
      }, // 渲染数据
      tagSelectList: ['商标','专利','诉讼','保护'], // 个人标签选择项
      tagValue: '', // 标签内容
      exportField: ['eduExperiences','workExperiences','certificates'], // 导出模块项
      checkFormField: ['talentName','gender','age','birthday','politicsStatus','nationality','maritalStatus','phoneNumber','secondEmail','archiveUnit','startWorkDate','certificateType','certificateNumber','certificateIssueDate','certificateValidityDate','domicile','domicilePostCode','living','livingPostCode','emergencyName','emergencyPhone'],
      checkTableField: ['eduExperiences','languages','workExperiences'],
      checkTableRequiredField: ['socialRelations','furtherStudies','lessonSpeeches','socialOfficials','rewardPunishes','treatises','projectStudies'],
      rules: {
        talentName: [{required: true, message: '姓名', trigger: 'blur'}],
        gender: [{required: true, message: '性别', trigger: 'blur'}],
        age: [{required: true, message: '年龄', trigger: 'blur'}],
        birthday: [{required: true, message: '出生日期', trigger: 'blur'}],
        politicsStatus: [{required: true, message: '政治面貌', trigger: 'blur'}],
        nationality: [{required: true, message: '民族', trigger: 'blur'}],
        maritalStatus: [{required: true, message: '婚姻状况', trigger: 'blur'}],
        phoneNumber: [{required: true, message: '手机号码', trigger: 'blur'}],
        secondEmail: [{required: true, message: '备用邮箱', trigger: 'blur'}],
        archiveUnit: [{required: true, message: '档案存放单位', trigger: 'blur'}],
        startWorkDate: [{required: true, message: '参加工作时间', trigger: 'blur'}],
        certificateType: [{required: true, message: '证件类型', trigger: 'blur'}],
        certificateNumber: [{required: true, message: '证件号码', trigger: 'blur'}],
        certificateIssueDate: [{required: true, message: '证件颁发日期', trigger: 'blur'}],
        certificateValidityDate: [{required: true, message: '证件有效期', trigger: 'blur'}],
        domicile: [{required: true, message: '户籍地址', trigger: 'blur'}],
        domicilePostCode: [{required: true, message: '户籍地址-邮编', trigger: 'blur'}],
        living: [{required: true, message: '现居住地址', trigger: 'blur'}],
        livingPostCode: [{required: true, message: '现居住地址-邮编', trigger: 'blur'}],
        emergencyName: [{required: true, message: '紧急联系人姓名', trigger: 'blur'}],
        emergencyPhone: [{required: true, message: '紧急联系人电话', trigger: 'blur'}],
        socialRelations: [{required: true, message: '社会关系', trigger: 'blur'}],
        eduExperiences: [{required: true, message: '教育经历', trigger: 'blur'}],
        languages: [{required: true, message: '外语水平', trigger: 'blur'}],
        workExperiences: [{required: true, message: '工作经历', trigger: 'blur'}],
        furtherStudies: [{required: true, message: '继续教育', trigger: 'blur'}],
        lessonSpeeches: [{required: true, message: '授课/演讲/主持', trigger: 'blur'}],
        socialOfficials: [{required: true, message: '社会任职', trigger: 'blur'}],
        rewardPunishes: [{required: true, message: '奖惩记录', trigger: 'blur'}],
        treatises: [{required: true, message: '论文/专著/编著', trigger: 'blur'}],
        projectStudies: [{required: true, message: '课题研究项目', trigger: 'blur'}],
      },
      requiredModuleRules:{
        socialRelations:{
          relationType: '关系类型',
          relationName: '姓名',
          relationOccupation: '工作/学习单位',
          relationJob: '职务/身份',
          relationPhone: '联系电话'
        },
        eduExperiences:{
          collegeName: '毕业院校',
          major: '所学专业',
          eduExperience: '学历',
          experienceNumber: '学历证书编号',
          eduDegree: '学位',
          degreeNumber: '学位证书编号'
        },
        languages:{
          language: '外语种类',
          languageDegree: '考试种类和等级/成绩',
          workingLanguage: '工作语言'
        },
        workExperiences:{
          workCompany: '工作单位',
          department: '部门',
          position: '职务'
        }
      }
    }
  },
  watch: {
    'formData.startWorkDate': {
      handler() {
        this.formData.workAge = this.formData.startWorkDate ? (this.dateSubMonth(this.formData.startWorkDate) - this.formData.workAdjustTime).toFixed(2) : 0
      }
    },
    'formData.workAdjustTime': {
      handler() {
        this.formData.workAge = this.formData.startWorkDate ? (this.dateSubMonth(this.formData.startWorkDate) - this.formData.workAdjustTime).toFixed(2) : 0
      }
    }
  },
  created() {
    this.dataInit()
    this.queryTalentPersonInfo()
    // 判断是否有编辑权限
    if (this.talentCode) {
      this.isShowEdit = this.status ? true : false
    }
    // this.isAssessFillIn()
  },
  // 页面加载完自动加载区域
  mounted() {
  },
  methods: {
    getMatchedValue(value) {
      const regex = /[\uFF1B;]/g;
      return regex.test(value) ? '未自评' : value;
    },
    handleCheckboxClick(row,item) {
      row.selfAssessment = [item];
    },
    // 置空商标资格信息
    handleTrademark(_this,option) {
      if (option.value == '无') {
        _this.formData.trademarkName = ''
        _this.formData.trademarkNumber = ''
        _this.formData.trademarkLimitDate = ''
        _this.formData.trademarkUnit = ''
      }
    },
    // 置空仲裁员资格信息
    handleArbiter(_this,option) {
      if (option.value == '无') {
        _this.formData.arbiterName = ''
        _this.formData.arbiterNumber = ''
        _this.formData.arbiterIssueDate = ''
        _this.formData.arbiterLimitDate = ''
        _this.formData.arbiterUnit = ''
      }
    },
    // 置空司法鉴定人资格信息
    handleJudicial(_this,option) {
      if (option.value == '无') {
        _this.formData.judicialName = ''
        _this.formData.judicialNumber = ''
        _this.formData.judicialIssueDate = ''
        _this.formData.judicialLimitDate = ''
        _this.formData.judicialUnit = ''
      }
    },
    // 判断form职业资质是否联动显示
    formDisplay(type) {
      if (type === 'legalLawyer' && (this.formData.practiceType !== '执业律师')) {
        return false;
      } else if (type === 'patentAgent' && (this.formData.patentType !== '专利代理师')) {
        return false;
      } else if (type === 'legalProfessions' && (this.formData.practiceType !== '法律职业资格')) {
        return false;
      } else if (type === 'patentAgency' && (this.formData.patentType !== '专利代理人资格')) {
        return false;
      } else if (type === 'trademarkInfo' && (this.formData.trademarkType !== '有')) {
        return false;
      } else if (type === 'arbiterInfo' && (this.formData.arbiterType !== '有')) {
        return false;
      } else if (type === 'judicialInfo' && (this.formData.judicialType !== '有')) {
        return false;
      } else {
        return true;
      }
    },
    // 判断table是否显示
    tableDisplay(type,permissions) {
      // 判断是否有该模块权限
      if (permissions && !this.$store.getters.permissions.includes(permissions)){
        return false;
      } else if (type === 'lawyerTeachers' && (this.formData.practiceType !== '实习律师')) {
        return false;
      } else if (type === 'patentPractices' && (this.formData.patentType !== '实习备案')) {
        return false;
      } else if (type === 'guidedLawyers') {
        if (this.formData.practiceType === '执业律师' && this.formData.practiceGuided === '是') {
          return true;
        }
        return false;
      } else {
        return true;
      }
    },
    dataInit() {
      // 获取部门
      queryOrganizations({ level: 1, status: 1 }).then(res => {
        if (res.success) {
          this.departmentList = res.data
          // 如果人员数据已加载，初始化岗位调整的选项
          if (this.formData.positionAdjusts && this.formData.positionAdjusts.length > 0) {
            this.initPositionAdjustsOptions()
          }
        }
      })
      queryPositions().then(res => {
        if (res.success) {
          this.positionsList = res.data
        }
      })
    },
    // 判断当前日期是否普通员工有编辑权限
    isAssessFillIn() {
      const today = new Date();
      const currentMonth = today.getMonth() + 1; // 月份从0开始，所以要加1
      const currentDay = today.getDate();
      if (currentDay >= 25) {
        this.assessLimitDate = true;
      }
    },
    handleClick() {
      this.stepActive = 0
    },
    getTopPosition(index, active) {
      this.stepActive = active;
      document.getElementById(index).scrollIntoView();
    },
    // 处理插入列status
    handleInsertData() {
      for (let key in this.insertData) {
        // console.log("下标:",key);
        // console.log("遍历后每条数据:",this.insertData[key]);
        this.insertData[key].talentCode = this.talentCode ? this.talentCode : this.formData.talentCode
        this.insertData[key].status = this.status
      }
    },
    // 导出功能
    handleExport(index,name) {
      var tableHeader = []
      this.tableHeader[index].header.map(item => {
        tableHeader.push({
          key: item.field,
          title: item.lable
        })
      })
      this.$commonUtils.ExportExcel(tableHeader, this.formData[index], this.formData.talentName+'-'+name + '.xlsx') // 生成Excel

    },
    // 显示处理,一些特殊内容转换
    showHandle(content, handle, field) {
      if (handle && content != null) {
        switch (field) {
          case 'mainOfficial':
            return content ? '主要任职' : '次要任职'
          case 'feedback':
            if (!this.$store.getters.permissions.includes(299)){
              return ''
            }
            break;
          case 'content':
            if (!this.$store.getters.permissions.includes(299)){
              return ''
            }
            break;
        }
      }
      return content
    },
    // 根据函数名称动态调用函数
    selectItem(option) {
      // console.log('根据函数',option)
      option.type && this.setDataStatus(option.type,this.pageSize * (option.currentPage - 1) + option.index)
      if (option.name) {
        let methods = this.$options.methods
        const _this = this
        methods[option.name](_this, option)
      }
    },
    // 设置数据列表状态（里面的数据发生更改记录）
    setDataStatus(type, index) {
      // 判断是否是人力专员，status = 1 “已审核”, 如果普通用户，编辑的数据status= 1修改为2 “修改待审核”, 新增的status还是为0 “新增待审核”
      // this.formData[type][index].status = this.status ? 1 : (this.formData[type][index].status ? 2 : 0)
      // 判断是否是人力专员，status = 1 “已审核”, 如果普通用户，新增编辑的status是为0 “待审核”
      this.formData[type][index].status = this.status ? 1 : 0
    },
    // 调整岗位类型
    typeAdjust(_this,option) {
      let position = _this.formData.positionAdjusts.findIndex(item => item.mainOfficial === 1)
      if (position !== -1 && position == option.index) {
        _this.handleTypeAdjust(_this,option.value)
      }
    },
    // 处理调整岗位类型,联动员工类型
    handleTypeAdjust(_this,type) {
      _this.formData.empStatus = '在职'
      const regularTypeList = ['调动调入','转正','平调','晋升','其他','员工初始化']
      switch (type) {
        case '转正':
          _this.formData.empType = '正式员工'
          _this.formData.regularDate = _this.formData.positionAdjusts.find(item => item.mainOfficial === 1).adjustDate
          break;
        case '辞职':
          _this.formData.empType = '辞职'
          break;
        case '辞退':
          _this.formData.empType = '辞退'
          break;
        case '兼职':
          _this.formData.empType = '兼职人员'
          break;
        case '实习留用':
          _this.formData.empType = '试用员工'
          break;
        case '返聘':
          _this.formData.empType = '退休返聘'
          break;
        case '返聘终止':
          _this.formData.empType = '返聘终止'
          break;
        case '雇佣入职':
          _this.formData.empType = '试用员工'
          break;
        case '实习入职':
          _this.formData.empType = '实习员工'
          break;
        case '结束实习':
          _this.formData.empType = '离职员工'
          break;
        default:
          _this.formData.empType = '正式员工'
          break;
      }
      if (type == '辞职' || type == '辞退' || type == '返聘终止' || type == '结束实习') {
        _this.formData.empStatus = '离职'
        _this.formData.leaveDate = _this.formData.positionAdjusts.find(item => item.mainOfficial === 1).adjustDate
      }
    },
    // 部门更改联动大组
    departmentChange(val,index) {
      if (val) {
        this.setDataStatus('positionAdjusts',index)
        // 获取岗位名称
        let deptCode = this.departmentList.find(item => item.kingDeeDepartment == val).deptCode
        this.formData.positionAdjusts[index].deptCode = deptCode
        queryOrganizations({ deptCode: deptCode, status: 1 }).then(res => {
          if (res.success) {
            this.superGroup[index] = res.data[0].children
          }
        })
      }
      this.formData.positionAdjusts[index].superGroup = ''
      this.formData.positionAdjusts[index].groupName = ''
    },
    // 大组联动工作组
    superGroupChange(val,index) {
      if(val){
        this.setDataStatus('positionAdjusts', index)
        let data = this.superGroup[index].find(item => item.kingDeeGroupName == val)
        this.formData.positionAdjusts[index].deptCode = data.deptCode
        this.groupList[index] = data.children != undefined ? data.children : [data] // 针对没有三级工作组做处理
      }
      this.formData.positionAdjusts[index].groupName = ''
    },
    // 选择工作组
    selectWorkGroup(field, val, index) {
      if (val){
        this.setDataStatus('positionAdjusts',index)
        let deptCode = this.groupList[index].find(item => item.kingDeeGroupName == val).deptCode
        this.formData.positionAdjusts[index].deptCode = deptCode
        this.positionChange(this)
      }
    },
    // 岗位调整变化
    positionChange(_this,option) {
      // 判断主要任职是否唯一
      if (_this.formData.positionAdjusts.filter(item => item.mainOfficial === 1).length > 1){
        _this.$message.error("任职类型不可存在两个主要任职，请处理！");
        return
      }
      // 获取主要岗位显示
      let position = _this.formData.positionAdjusts.find(item => item.mainOfficial === 1)
      if (position) {
        _this.formData.department = position.deptName
        _this.formData.superGroup = position.superGroup
        _this.formData.groupName = position.groupName
        _this.formData.posName = position.posName
        _this.handleTypeAdjust(_this,position.adjustStatus)
      }
    },
    // 选择岗位,根据名称联动id存储
    selectPositions(field, val, index) {
      this.setDataStatus('positionAdjusts',index)
      let pid = this.positionsList.find(item => item.posName == val).id
      if (field == 'oldPosName') {
        this.formData.positionAdjusts[index].oldPosId = pid
      } else {
        this.formData.positionAdjusts[index].posId = pid
      }
    },
    // 劳动合同变更
    contractChange(_this) {
      var laborContracts = _this.formData.laborContracts
      if (laborContracts.length > 1) {
        laborContracts.sort(function(a, b) {
          let obj1 = b['takeEffectDate']
          let obj2 = a['takeEffectDate']
          const val1 = Math.floor(new Date(obj1).getTime() / 1000)
          const val2 = Math.floor(new Date(obj2).getTime() / 1000)
          return val1 - val2
          // return val2 - val1
        });
      }
      _this.formData.contractOwner = laborContracts[0].contractOwner
      _this.formData.contractDate = laborContracts[0].takeEffectDate
      _this.formData.expirationDate = laborContracts[0].terminalDate
      _this.formData.contractLimit = laborContracts[0].contractType == '无固定期限' ? '无固定期限' : laborContracts[0].contractLimit
      _this.formData.leaveDate = laborContracts[0].relieveDate
    },
    // 根据调薪时间排序
    handleAdjustDate(_this) {
      var payAdjusts = _this.formData.payAdjusts
      if (payAdjusts.length > 1) {
        payAdjusts.sort(function(a, b) {
          let obj1 = b['adjustDate']
          let obj2 = a['adjustDate']
          const val1 = Math.floor(new Date(obj1).getTime() / 1000)
          const val2 = Math.floor(new Date(obj2).getTime() / 1000)
          return val1 - val2
        });
      }
    },
    // 计算年龄
    getAge(_this,option) {
      let birthdays = new Date(date.replace(/-/g, '/'))
      let d = new Date()
      _this.formData.age =  d.getFullYear() - birthdays.getFullYear() - (d.getMonth() < birthdays.getMonth() || (d.getMonth() == birthdays.getMonth() && d.getDate() < birthdays.getDate()) ? 1 : 0);
    },
    // 计算社会工龄
    handleWorkAge(_this,option) {
      _this.formData.workAge = (_this.dateSubMonth(option.value) - _this.formData.workAdjustTime).toFixed(2)
    },
    // 计算司龄
    handleSeniority(_this,option) {
      _this.formData.companyAge = _this.dateSubMonth(option.value)
    },
    // 工龄/司龄统一计算方法
    dateSubMonth(date) {
      var date1 = new Date(date);
      var date2 = new Date();
      var monthCount = parseInt(date2.getFullYear() - date1.getFullYear()) * 12 - date1.getMonth() + date2.getMonth();
      console.log(date2.getFullYear()+'-'+date1.getFullYear() + '*12-' + date1.getMonth()  + '+' +date2.getMonth())
      // var resM = monthCount % 12;
      // var resY = parseInt(monthCount / 12);
      var age = monthCount>0 ? parseFloat((monthCount/12)).toFixed(2) : 0
      return age;
    },
    // 获取人员信息
    queryTalentPersonInfo() {
      queryTalentPersonInfo(this.talentCode).then(res => {
        if (!this.updatePerformList){
          this.formData = res.data
          // 针对后台数据调薪记录做日期排序处理
          if(this.formData.payAdjusts && this.formData.payAdjusts.length > 1){
            this.formData.payAdjusts.sort(function(a, b) {
              let obj1 = b['adjustDate']
              let obj2 = a['adjustDate']
              const val1 = Math.floor(new Date(obj1).getTime() / 1000)
              const val2 = Math.floor(new Date(obj2).getTime() / 1000)
              return val1 - val2
            });
          }
          this.handleInsertData()
          // 如果部门列表已加载，初始化岗位调整记录的大组和工作组选项
          if (this.departmentList && this.departmentList.length > 0) {
            this.initPositionAdjustsOptions()
          }
        }else{
          this.$set(this.formData, 'performances', res.data.performances)
        }
      })
    },
    // 初始化岗位调整记录的大组和工作组选项
    initPositionAdjustsOptions() {
      // 遍历所有岗位调整记录
      if (this.formData.positionAdjusts && this.formData.positionAdjusts.length > 0) {
        this.formData.positionAdjusts.forEach((item, index) => {
          // 如果该记录有部门名称，则初始化大组选项
          if (item.deptName) {
            // 第一步：根据部门名称找到部门的 deptCode
            let dept = this.departmentList.find(d => d.kingDeeDepartment == item.deptName)
            if (dept && dept.deptCode) {
              // 第二步：用部门的 deptCode 查询该部门下的大组列表
              queryOrganizations({ deptCode: dept.deptCode, status: 1 }).then(res => {
                if (res.success && res.data && res.data.length > 0 && res.data[0].children) {
                  // 设置大组列表
                  this.$set(this.superGroup, index, res.data[0].children)
                  
                  // 第三步：如果该记录有大组选择，则继续初始化工作组选项
                  if (item.superGroup) {
                    // 在大组列表中找到当前选中的大组
                    let superGroupData = res.data[0].children.find(s => s.kingDeeGroupName == item.superGroup)
                    if (superGroupData) {
                      // 第四步：用大组的 children 设置工作组列表（处理没有三级工作组的情况）
                      this.$set(this.groupList, index, superGroupData.children != undefined ? superGroupData.children : [superGroupData])
                    }
                  }
                }
              })
            }
          }
        })
      }
    },
    // 删除个人标签
    handleClose(tag) {
      this.formData.personLabelList.splice(this.formData.personLabelList.indexOf(tag), 1);
    },
    // 添加个人标签
    handleInputConfirm() {
      if (!this.formData.personLabelList) {
        this.formData.personLabelList = []
      }
      let tagValue = this.tagValue;
      if (tagValue) {
        this.formData.personLabelList.push(tagValue);
      }
      this.tagValue = '';
    },
    // 附件上传成功
    handleSuccess(type, field, val, index, currentPage) {
      let rowIndex = this.pageSize * (currentPage - 1) + index
      this.setDataStatus(type,rowIndex)
      this.formData[type][rowIndex][field] = val.data
      this.$message({
        message: '上传成功',
        type: 'success'
      });
    },
    // 预览查看
    preView(url) {
      if(['doc','docx'].includes(url.replace(/.+\./,"").toLocaleLowerCase())) {
        this.$commonUtils.viewPdf(`${url}`)
      }else if(['pdf','jpg','png'].some(item=>url.replace(/.+\./,"").toLocaleLowerCase()==item)) {
        window.open(`/ipdoc${url}`.replace(/[+]/g,'%2B'))
      } else {
        this.downLoad(url)
      }
    },
    // 附件下载
    downLoad(url){
      const downData={
        url:`ipdoc${url}`,
        success(){
          // notify.close()
        }
      }
      this.$commonUtils.downLoadAll(downData)
    },
    // 处理评价
    handleEvaluate(id, text, index, field) {
      this.evaluate.id = id
      this.evaluate.index = index
      this.evaluate.field = field
      this.evaluate.message = field === 'content' ? '面谈记录' : '评价反馈'
      this.evaluate.inputValue = text
      this.dialogVisible = true
    },
    handleConfirm() {
      const value = this.evaluate.inputValue
      if (value) {
        const hrUserName = this.$store.getters.name
        const params = {
          id: this.evaluate.id,
          [this.evaluate.field]: value,
          hrUserName,
        }
        updatePersonSummary(params).then(res => {
          if (res.data) {
            this.formData.summaries[this.evaluate.index][this.evaluate.field] = value
            this.formData.summaries[this.evaluate.index].hrUserName = hrUserName
            this.$message({
              type: 'success',
              message: '提交成功',
            })
            this.dialogVisible = false
          }
        })
      } else {
        this.$message({
          type: 'warning',
          message: `请填写${this.evaluate.message}内容`,
        })
      }
    },
    // 成长档案编辑
    handleEdit() {
      this.isEdit = true
    },
    // 数据保存
    dataSave() {
      alert('数据保存')
    },
    // 提交检查,检查填写项是否必填
    submitCheckUp() {
      if(!this.$store.getters.permissions.includes(363)){
        let formStr = ''
        let table = []
        let tableStr = ''
        let tableRequiredStr = ''
        let showConfirmButton = true
        let showDivLabel = true
        Object.keys(this.formData).forEach(key=>{
          // console.log('key:',key,'value:',typeof this.formData[key]);
          if(!this.formData[key] && this.checkFormField.includes(key)){ // 基本信息
            formStr += this.rules[key][0].message + '; '
          } else if(this.checkTableField.includes(key) && this.formData[key].length > 0){ // 必填模块有数据
            table.push(key)
          } else if(this.checkTableField.includes(key) && this.formData[key].length <= 0){ // 必填模块无数据
            tableStr += this.rules[key][0].message + '; '
          } else if(this.checkTableRequiredField.includes(key) && this.formData[key].length <= 0){ // 建议模块
            tableRequiredStr += this.rules[key][0].message + '; '
          }
        })
        const h = this.$createElement;
        const divLabel = []
        if (formStr || tableStr) {
          divLabel.push(h('p', { style: 'color: red' }, '请填写以下必填项：' + formStr + tableStr))
          showConfirmButton = false
        }
        // 循环判断模块，多列数据里面字段是否为空
        if (table) {
          table.forEach(item => {
            this.formData[item].forEach((res,index) => {
              var errorStr = ''
              Object.keys(res).forEach(key => {
                if (Object.keys(this.requiredModuleRules[item]).includes(key) && !res[key]){
                  errorStr += this.requiredModuleRules[item][key] + '; '
                  showConfirmButton = false
                }
              })
              errorStr && divLabel.push(h('p', { style: 'color: red'},'请填写'+this.rules[item][0].message + '第' +(index+1) +'条: ' + errorStr+'信息'))
            })
          })
        }
        !showConfirmButton && divLabel.push(h('p', null, '必填项无数据，请填写“无”'))
        if (tableRequiredStr) {
          divLabel.push(h('p', { style: 'color: orange' }, '建议填写以下模块：' + tableRequiredStr))
          showDivLabel = false
        }
        showConfirmButton && divLabel.push(h('p', null, '点击确定继续提交审核'))
        if(!showConfirmButton || !showDivLabel) {
          this.$msgbox({
            title: '提示',
            message: h('div', null, divLabel),
            showCancelButton: true,
            showConfirmButton: showConfirmButton,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: showConfirmButton ? 'warning' : 'error'
          }).then(action => {
            this.submit()
          }).catch(() => {});
        } else {
          this.submit()
        }
      } else {
        this.submit()
      }
    },
    // 提交审核
    submit() {
      this.isEdit = false
      this.formData.status = this.status
      upsertTalentPersonInfo(this.formData).then(res => {
        if (res.success) {
          var message = this.status ? '更新员工信息成功' : '提交审核成功'
          this.$message({
            message: message,
            type: 'success'
          });
          // this.formData.auditStatus = this.status ? this.formData.auditStatus : 0
          this.formData.auditStatus = res.data.auditStatus
        }else{
          this.$message.error('数据异常，请联系技术人员！');
        }
      }).catch(error=>{
        this.$message.error('数据异常，勿关闭页面，请联系技术人员！');
      });
    },
    // 删除表行
    deleteTableRow(row,index) {
      var rowIndex = this.pageSize * (this.tableHeader[index].currentPage - 1) + row
      this.formData[index].splice(rowIndex,1)
      let totalPage = Math.ceil(this.formData[index].length / this.pageSize);//Math.ceil向上取整算出总分页
      let currentPage = this.tableHeader[index].currentPage
      // 计算，删除当前页数据，自动回到上页显示
      if(row == 0 && currentPage > 1 && currentPage > totalPage) {
        this.tableHeader[index].currentPage = (currentPage - 1)
      }
    },
    // 页码切换
    handleCurrentChange(val,index) {
      this.tableHeader[index].currentPage = val;
    },
    // 添加新行
    handleAddItem(index) {
      this.formData[index].unshift(JSON.parse(JSON.stringify(this.insertData[index])))
      this.tableHeader[index].currentPage = 1
    },
    clickOersonalInfo() {
      this.isEdit = !this.isEdit
      if (this.isEdit) {
        console.log('基本信息',this.formData.personalInfo)
      }
    },
    fileChange(file) {
      this.formData.userIcon = file.data;
    },
    beforeAvatarUpload(file) {
      const isJPGOrisPNG =
        file.type === "image/jpeg" || file.type === "image/png";
      const isLt200K = file.size / 1024 / 1024 / 1024 < 200;
      if (!isJPGOrisPNG) {
        this.$message.error("上传头像图片只能是 JPG 格式或者PNG");
      }
      if (!isLt200K) {
        this.$message.error("上传头像图片大小不能超过 200K!");
      }
      return isJPGOrisPNG && isLt200K;
    },
    // 清空考核内容
    clearAssessmentContent(row) {
      row.performItems = []
      var submitData = JSON.parse(JSON.stringify(row))
      upsertPersonPerformance(submitData).then(res => {
        if (res.success){
          this.$message.success(res.message)
          this.assessVisible = false
          this.updatePerformList && this.queryTalentPersonInfo()
        }
      })
    },
    // 打开编辑权限
    settingAssessInfoEditor(row,status) {
      row.status = status
      var submitData = JSON.parse(JSON.stringify(row))
      upsertPersonPerformance(submitData).then(res => {
        if (res.success){
          this.$message.success(res.message)
          this.assessVisible = false
          this.updatePerformList && this.queryTalentPersonInfo()
        }
      })
    },
    // 填写考核信息
    fillInAssessInfo(row) {
      this.assessInfo = row
      this.assessMessage = row.performDate ? row.performDate + ' ' + this.formData.talentName + ' 绩效考核表' : ''
      if (row.performItems.length <= 0){
        this.updatePerformList = true
        this.queryPersonPerformanceTemp(row)
      }else{
        this.updatePerformList = false
        var performItems = row.performItems.sort((a, b) => a.performType - b.performType);
        if (this.formData.performanceType === 1){
          var assessData = []
          performItems.forEach(item => {
            assessData.push(item)
            if (item.performType == 1){
              assessData.push({
                performType: item.performType,
                element: item.completeStatus
              })
            }
          })
          this.assessData = assessData
          // 绩效明细使用
          this.scoringDetailData = assessData
        }else{
          this.assessData = performItems.filter(item => item.performType != 4)
          this.assessTwoData = performItems.filter(item => item.performType == 4)
          // 绩效明细使用
          this.scoringDetailData = performItems.filter(item => item.performType != 4)
        }
      }
      this.performId = row.id
      this.performStatus = row.status
      this.performMaterials = row.performMaterials
      this.assessVisible = true
      if (this.performStatus == 1) {
        this.$alert('请在规定时间，填写月绩效考核表。当前仅查看！', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            return true
          }
        });
      }
    },
    // 设置考核内容
    setAssessContent() {
      if (this.formData.performanceType == 1){
        this.setAssessVisible = true
      }else{
        this.setAssessTwoVisible = true
      }
    },
    // 获取考核内容
    queryPersonPerformanceTemp(row){
      const data = []
      queryPersonPerformanceTemp({ talentCode: this.formData.talentCode }).then(res => {
        // 表格的渲染处理
        if (this.formData.performanceType === 1){
          res.data.forEach(item => {
            data.push(item)
            if (item.performType == 1){
              data.push({
                performType: item.performType,
                element: ''
              })
            }
          })
          this.assessData = data
          // 绩效明细使用
          this.scoringDetailData = res.data
        }else{
          this.assessData = res.data.filter(item => item.performType !== 4)
          this.assessTwoData = res.data.filter(item => item.performType === 4)

          // 绩效明细使用
          this.scoringDetailData = res.data.filter(item => item.performType !== 4)
        }
        // console.log(this.assessData)
      })

    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.mergeColumn()[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
      if (this.formData.performanceType === 1){
        if (row.performType == 1){
          if (rowIndex % 2 === 1) {
            if (columnIndex === 1) {
              return [1, 2];
            } else if (columnIndex === 2) {
              return [0, 0];
            }
          }
          if (columnIndex === 3 || columnIndex === 4) {
            if (rowIndex % 2 === 0) {
              return {
                rowspan: 2,
                colspan: 1
              };
            } else {
              return {
                rowspan: 0,
                colspan: 0
              };
            }
          }
        }
        if (row.performType == 3){
          if (columnIndex === 1) {
            return [1, 2];
          } else if (columnIndex === 2) {
            return [0, 0];
          }
        }
      }
    },
    mergeColumn() {
      const spanOneArr = [];
      let concatOne = 0;
      this.assessData.forEach((item, index) => {
        if (index === 0) {
          spanOneArr.push(1);
        } else {
          if (item.performType === this.assessData[index - 1].performType) {
            spanOneArr[concatOne] += 1;
            spanOneArr.push(0);
          } else {
            spanOneArr.push(1);
            concatOne = index;
          }
        }
      });
      return spanOneArr;
    },
    getSummaries(param) {
      const khIndex = this.formData.performanceType === 1 ? 3 : 4
      const { columns, data } = param;
      const sums = [];
      let fraction = 0;
      columns.forEach((column, index) => {
        if (index === khIndex) {
          sums[index] = '考核得分：';
          return;
        }
        if (index === (khIndex+1)){
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            fraction = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            this.assessInfo.finalScore = fraction
            sums[index] = fraction
          } else {
            sums[index] = 'N/A';
          }
        }else{
          sums[index] = '';
        }
      });
      return sums;
    },
    // 检查录入分数,限制输入
    checkInputScore(row) {
      if (row.score > row.weight){
        this.$set(row,'score',row.weight)
      }
      if (row.score < 0) {
        this.$set(row,'score',0)
      }
    },
    // 绩效考核内容提交
    assessSubmit() {
      var performItems = []
      if (this.formData.performanceType === 1){
        this.assessData.forEach((item,index) => {
          // 工作任务
          if (item.performType == 1) {
            if (index % 2 === 0) {
              item.completeStatus = this.assessData[index+1].element
              performItems.push(item)
            }
          }else{
            performItems.push(item)
          }
        })
      }else{
        performItems = this.assessData.concat(this.assessTwoData)
      }
      var submitData = {
        id: this.assessInfo.id,
        talentCode: this.assessInfo.talentCode,
        performYear: this.assessInfo.performYear,
        performMonth: this.assessInfo.performMonth,
        finalScore: this.assessInfo.finalScore,
        performItems: performItems
      }
      upsertPersonPerformance(submitData).then(res => {
        if (res.success){
          this.$message.success(res.message)
          this.assessVisible = false
          this.updatePerformList && this.queryTalentPersonInfo()
        }
      })
    },
    // 文件上传成功时
    onFileSuccess(file) {
      this.$refs.assessUpload.clearFiles(); // 去掉文件列表
      if (file.success) {
        this.$message.success(file.message)
        let str = file.data;
        let result = str.split("/").pop();
        this.performMaterials.push({
          materialName: result,
          materialPath: file.data
        })
      }
    },
    deleteAssessMaterial(id,index) {
      deletePersonMaterial({id:id}).then(res => {
        if (res.success) {
          this.$message.success('删除成功')
          this.performMaterials.splice(index,1)
        }
      })
    },
    // 下载考核表
    downAssessForm() {
      var data = {
        talentCode: this.assessInfo.talentCode,
        performYear: this.assessInfo.performYear,
        performMonth: this.assessInfo.performMonth
      }
      exportTalentPersonPerformance(data).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.downLoad(res.data)
        }
      })
    }
  },
  computed: {
    uniqueYears() {
      return [...new Set(this.formData.performances.map(item => item.performYear))].reverse();
    }
  },
  components:{
    AssessContent,
    AssessTwoContent,
    ScoringDetail
  }
}
</script>
<style>
.el-tooltip__popper{
  background: #fff;
  color: #3759af;
  line-height: 18px;
  max-width:20%;
}
</style>
<style lang="scss" scoped>
.perform-div /deep/ .el-dialog__body {
  height: calc(100vh - 120px);
  overflow: auto;
}
.scoring-div /deep/ .el-dialog__body {
  height: 80vh;
  overflow: auto;
}
.hrm-container {
  width: 100%;
  display: inline-block;
  background-color: #F2F2F2;
}
.hrm-header{
  height: 215px;
  margin: 10px 10px 15px 10px;
  color: #000000;
  .info-top{
    display: flex;
    height: 150px;
    background-color: #FFFFFF;
    .user-info{
      height: 40px;
      line-height: 40px;
      display: flex;
      margin-top: 35px;
      .username{
        font-size: 28px;
        font-weight: bold;
        margin-right: 20px;
      }
      .user-group{
        font-size: 18px;
        span{
          margin-left: 20px;
          color: #7F7F7F;
          font-size: 16px;
        }
      }
    }
    .user-contact{
      height: 21px;
      line-height: 21px;
      display: flex;
      font-size: 18px;
      margin-top: 20px;
      .split-line{
        margin: 0 20px;
      }
      i{
        color: #AAAAAA;
        margin-right: 10px;
      }
    }
  }
  .top-right{
    width: 200px;
    margin: 10px 10px 10px auto;
    .el-button{
      float: right;
      margin-bottom: 10px;
    }
    .el-alert{
      float: right;
    }
  }
  .info-tab{
    height: 50px;
    margin-top: 15px;
    background-color: #FFFFFF;
    .el-tabs{
      margin-left: 15px;
      /deep/ .el-tabs__nav-wrap::after{
        background-color: #FFFFFF;
      }
      /deep/ .el-tabs__item{
        height: 50px;
        line-height: 50px;
        font-size: 16px;
      }
    }
  }
}
.avatar-uploader /deep/ .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  margin: 24px 20px;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  object-fit: cover;
  display: block;
}
.back-button{
  position: fixed;
  cursor: pointer;
  width: 40px;
  height: 40px;
  background-color: #8cc5ff;
  color: #fff;
  float: right;
  padding: 3px 0 2px 5px;
  -webkit-clip-path: polygon(100% 0,0 0,0 0,0 100%);
  clip-path: polygon(100% 0,0 0,0 0,0 100%);
  i{
    width: 20px;
    height: 20px;
  }
}
.back-button:hover{
  background-color: #409EFF;
}
.hrm-main{
  display: flex;
  margin: 0 10px 10px 10px;
  .main-list{
    height: 640px;
    width: 85%;
    overflow: auto;
    //background-color: #FFFFFF;
    .module{
      //height: 200px;
      margin-bottom: 15px;
      padding-bottom: 10px;
      background-color: #FFFFFF;
      .module-top{
        height: 55px;
        display: flex;
        .module-style{
          width: 8px;
          height: 25px;
          margin: 15px 15px;
          background: #409EFF;
        }
        .module-name{
          height: 21px;
          font-size: 16px;
          font-weight: bold;
          margin-top: 20px;
        }
        .right-button{
          font-size: 14px;
          cursor: pointer;
          color: #409EFF;
          margin: 10px 10px 10px auto;
        }
      }
      .module-cont{
        padding: 0 15px;
        .module-td{
          /deep/ .el-table__body td{
            padding: 7px 0 !important;
          }
        }
        .paging{
          display: flex;
          .page{
            width: 100px;
            font-size: 12px;
            color: #555555;
            letter-spacing: 5px;
            margin: 15px 10px 0 10px;
          }
          .el-pagination{
            margin: 5px 5px -5px auto;
          }
        }
        .el-row{
          margin-bottom: 0px;
        }
        .el-form-item{
          margin-bottom: 0px;
          width: 100%;
        }
        .item-half{
          /deep/ .el-form-item__label{
            width: 20% !important;
          }
        }
        .el-form--inline {
          /deep/ .el-form-item__label{
            width: 40%;
            color: #7F7F7F;
            font-weight: 500;
            letter-spacing: 1px;
            padding: 0 15px 0 0;
          }
          /deep/ .el-form-item__content{
            width: 60%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space:nowrap;
            letter-spacing: 1px;
          }
        }
        .el-date-editor.el-input {
          width: 100%;
        }
        .el-select{
          width: 100%;
        }
        .el-tag + .el-tag {
          margin-left: 10px;
        }
        .button-new-tag {
          margin-left: 10px;
          height: 32px;
          line-height: 30px;
          padding-top: 0;
          padding-bottom: 0;
        }
        .input-new-tag {
          width: 90px;
          margin-left: 10px;
          vertical-align: bottom;
        }
      }
    }
  }

  .lawyer-right-button{
    font-size: 14px;
    cursor: pointer;
    float: right;
    color: #409EFF;
    margin: 10px 10px 10px auto;
  }

  .right-column{
    width: 15%;
    height: 640px;
    margin-left: 15px;
    background-color: #FFFFFF;
    .el-steps{
      margin: 50px 0px 0px 40px;
    }
  }
}

.el-table{
  /deep/ th{
    padding: 6px 0;
    color: #555555;
    background: #FAFAFA;
  }
}

.my-textarea {
  width: 400px;
  height: 200px; /* 设置文本域的高度 */
}

/deep/ .el-dialog__body{
  padding: 0 20px;
}
/deep/ .el-dialog__footer {
  padding: 10px 0;
  margin: 0 auto;
  display: table;
}

.assess-div {
  padding: 10px 0;
  background-color: #ecf5ff;
}
.assess-table {
  width: 80%;
  margin: auto;
  /deep/ .el-table__header th {
    text-align: center;
    background: linear-gradient(#98c9ff 37%,#f5f7fa 100%);
  }
  /deep/ .el-table__body td {
    padding: 5px;
    border-right: 2px dashed #dcdfe6;
    border-bottom: 2px dashed #dcdfe6;
  }
  /deep/ .el-table__footer-wrapper tbody td {
    padding:  5px 0;
  }
}
.el-card {
  /deep/ .el-card__header {
    padding: 10px 20px;
  }
  /deep/ .el-card__body {
    padding: 0px;
  }
}
</style>
