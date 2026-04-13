<template>
  <div>
    <el-form :model="threeLevelData" size="small" class="form-container" label-width="180px">
      <el-row class="first-row">
        <el-col :span="6">
          <el-form-item label="客户" class="">
            <el-select
              :disabled="type == 'view'"
              v-model="threeLevelData.custId"
              ref="custSelect"
              filterable
              clearable
              remote
              reserve-keyword
              placeholder="请输入客户姓名"
              @change="spellDesc"
              :remote-method="queryCustomerList">
              <el-option
                v-for="item in customerNameIdList"
                :key="item.custId"
                :label="item.fullname"
                :value="item.custId"
              >
              </el-option>
            </el-select>
            <!--            <el-input size="mini" v-model="threeLevelData.custIdStr"></el-input>-->

          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商标名称" class="">
            <span v-if="type == 'view'">{{threeLevelData.tmName}}</span>
            <el-input v-else size="mini" v-model="threeLevelData.tmName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="threeLevelData.caseTypeIds == 30 ? 6 : 12">
          <el-form-item label="案件类型" class="">
            <el-select :disabled="type == 'view'" v-model="threeLevelData.caseTypeIds"
                       placeholder="" filterable clearable @change="changeCaseType"
            >
              <el-option
                v-for="item in [{id: 185, label: '注册申请'}, {id: 31, label: '转让'}, {id: 52, label: '查询'}, {id: 33, label: '续展'}, {id: 30, label: '变名变址'}]"
                :key="item.id"
                :label="item.label"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="threeLevelData.caseTypeIds == 30">
          <el-form-item label="变更类型" class="">
            <el-select :disabled="type == 'view'" v-model="threeLevelData.changeType" placeholder="" filterable
                       clearable>
              <el-option
                v-for="item in ['变址', '变名', '变名变址']"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="类别个数" class="">
            <span v-if="type == 'view'">{{threeLevelData.classNumTotal}}</span>
            <el-input-number @change="changeClassNumTotal" v-else size="mini" v-model="threeLevelData.classNumTotal"
                             controls-position="right"
                             :min="0">
            </el-input-number>
            <!--            <el-input v-else size="mini" v-model="threeLevelData.classNumTotal"></el-input>-->

          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="类别" class="">
            <span v-if="type == 'view'">{{threeLevelData.classIn}}</span>
            <el-select v-else multiple v-model="threeLevelData.classInList" placeholder="" filterable clearable
                       @change="changeClassIn">
              <el-option v-for="(item, index) in numList" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="国家数量" class="">
            {{threeLevelData.countrysNum}}
            <!--            <el-input size="mini" v-model="threeLevelData.countrysNum"></el-input>-->

          </el-form-item>
        </el-col>


      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="报价描述" class="">
            <span v-if="type == 'view'">{{threeLevelData.offerName}}</span>
            <el-input clearable v-else size="mini" v-model="threeLevelData.offerName"
                      @change="() => {this.offerNameChanged = true}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="瑞士法郎汇率" class="">
            <span v-if="type == 'view'">{{threeLevelData.exchangeRate}}</span>
            <el-input v-else size="mini" v-model="threeLevelData.exchangeRate"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="商标颜色" class="">
            <span v-if="type == 'view'">{{threeLevelData.colour ? '彩色' : '黑白'}}</span>
            <el-radio-group v-else v-model="threeLevelData.colour">
              <el-radio :label="0">黑白</el-radio>
              <el-radio :label="1">彩色</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商标种类" class="">
            <span v-if="type == 'view'">{{threeLevelData.pictureStr}}</span>
            <el-radio-group v-else v-model="threeLevelData.picture" @change="changeWDS">
              <el-radio :label="0">文字</el-radio>
              <el-radio :label="1">图形</el-radio>
              <el-radio :label="2">组合</el-radio>
              <el-radio :label="4">英文文字</el-radio>
              <el-radio :label="5">中文文字</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="我方首类/标代理费" class="">
            <span v-if="type == 'view'">{{threeLevelData.whdServiceFee}}</span>
            <el-input v-else size="mini" v-model="threeLevelData.whdServiceFee"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="我方附加类/标代理费" class="">
            <span v-if="type == 'view'">{{threeLevelData.whdServiceFeeAdditional}}</span>
            <el-input v-else size="mini" v-model="threeLevelData.whdServiceFeeAdditional"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="">
        <el-col :span="18">
          <el-form-item label="进入国家" class="">
            <upload-xlsx @changeClick="clickUpload=false" @getFirstSheet="getFirstSheet"
                         :clickUpload="clickUpload"></upload-xlsx>
            <el-button type="primary" size="mini" @click="() => addCountry()" v-if="type != 'view'">添加</el-button>
            <el-button type="primary" size="mini" @click="clickUpload=true" v-if="type != 'view'">导入国家</el-button>
            <el-button type="primary" size="mini" @click="addMoreCountry" v-if="type != 'view'">批量添加</el-button>
            <pl-table :data="threeLevelData.countries" empty-text="暂无数据" style="width: 100%;"
                      current-row-key border
                      maxHeight="500" ref="scroll-grid"
                      highlight-current-row
                      size="mini">
              <pl-table-column
                type="index"
                label="序号"
              >
              </pl-table-column>
              <pl-table-column
                label="国家"
                width="150"
              >
                <template slot-scope="scope">
                  <span v-if="type == 'view'">{{scope.row.cName}}</span>
<!--                  <virtual-select v-else-->
<!--                                  size="mini"-->
<!--                                  style="width: 70%" class="virtual-select" clearable-->
<!--                                  :data="countryList"-->
<!--                                  v-model="scope.row.cName" clearable-->
<!--                                  @change="(v)=>{changeCountry(v, scope.row)}"-->
<!--                                  filterable>-->
<!--                  </virtual-select>-->
                  <el-select v-else style="width: 95%;" v-model="scope.row.cName" placeholder="" allow-create
                             filterable clearable
                             @change="(v)=>{changeCountry(v, scope.row, true)}">
                    <el-option
                      v-for="item in countryList"
                      :key="item.countryCn"
                      :label="item.countryCn"
                      :value="item.countryCn">
                    </el-option>
                  </el-select>
                </template>
              </pl-table-column>
              <pl-table-column
                label="溢价"
              >
                <template slot-scope="scope">
                  <span v-if="type == 'view'">{{scope.row.premium}}</span>
                  <el-input v-else size="mini" v-model="scope.row.premium"
                            @change="(v) => changePremium(v, scope.$index)"></el-input>
                </template>
              </pl-table-column>
              <pl-table-column
                label="报价档位"
                width="120"
              >
                <template slot-scope="scope">
                  <span v-if="type == 'view'">{{scope.row.priceLevelStr}}</span>
                  <el-select v-else style="width: 90%;" v-model="scope.row.priceLevel" placeholder="" clearable
                             @change="(v) => {scope.$index === 0 ? changeAllLevel(v) : changeLevel(v, scope.row)}">
                    <el-option
                      v-for="item in [{id: 0, label: '低档'}, {id: 1, label: '中档'}, {id: 2, label: '高档'}]"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </template>
              </pl-table-column>
              <pl-table-column
                label="商标种类"
                width="120"
              >
                <template slot-scope="scope">
                  <span v-if="type == 'view'">{{scope.row.pictureStr}}</span>
                  <el-select v-else style="width: 90%;" v-model="scope.row.picture" placeholder="" clearable
                             @change="(v) => {changeLevel('', scope.row)}">
                    <el-option
                      v-for="item in [
                        {id: 0, label: '文字'},
                        {id: 1, label: '图形'},
                        {id: 2, label: '组合'},
                        {id: 4, label: '英文文字'},
                        {id: 5, label: '中文文字'},
                       ]"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </template>
              </pl-table-column>
              <pl-table-column
                label="报价规则"
              >
                <template slot-scope="scope">
                  <div>
                    <span v-if="scope.row.offerType == 2">标</span>
                    <span v-if="scope.row.offerType == 1">类</span>
                  </div>
                  <!--                  <div v-else>-->
                  <!--                    <el-radio v-model="scope.row.offerType" :label="2">标</el-radio>-->
                  <!--                    <el-radio v-model="scope.row.offerType" :label="1">类</el-radio>-->
                  <!--                  </div>-->
                </template>
              </pl-table-column>
              <pl-table-column
                label="商标数量"
                width="100"
              >
                <template slot-scope="scope">
                  <div v-if="type == 'view'"
                       style="display: flex;flex-direction: column;justify-content: center;align-items: center">
                    <div v-for="(item, index) in scope.row.tmNumList"
                         style="display: flex;flex-direction: row;justify-content: space-between;align-items: center">
                      {{item.tmNum}}
                    </div>
                  </div>
                  <div v-else style="display: flex;flex-direction: column;justify-content: center;align-items: center">
                    <div v-for="(item, index) in scope.row.tmNumList"
                         style="display: flex;flex-direction: row;justify-content: space-between;align-items: center">
                      <el-input v-model="item.tmNum"
                                @change="(v) => changeFirstRow(v, index, scope.$index, 'tmNum')"></el-input>
                      <span @click="delClassNum(scope.row, index)" class="el-icon-delete delBtn"
                            style="font-size: 16px;margin-left: 3px;cursor: pointer"></span>
                    </div>
                    <div class="plusBtn"
                         :class="{'stop-btn': threeLevelData.caseTypeIds == 185 && scope.row.tmNumList.length >= 1 ? true : false}"
                         @click="addClassNum(scope.row)">
                      <span class="el-icon-plus"></span>
                    </div>
                  </div>
                </template>
              </pl-table-column>
              <pl-table-column
                label="类别/标"
                width="100"
              >
                <template slot-scope="scope">
                  <div v-if="type == 'view'"
                       style="display: flex;flex-direction: column;justify-content: center;align-items: center">
                    <div v-for="(item, index) in scope.row.tmNumList"
                         style="display: flex;flex-direction: row;justify-content: space-between;align-items: center">
                      {{item.classNumPerTm}}
                    </div>
                  </div>
                  <div v-else style="display: flex;flex-direction: column;justify-content: center;align-items: center">
                    <div v-for="(item, index) in scope.row.tmNumList"
                         style="display: flex;flex-direction: row;justify-content: space-between;align-items: center">
                      <el-input @change="(v) => changeFirstRow(v, index, scope.$index, 'classNumPerTm', item)"
                                v-model="item.classNumPerTm" :disabled="scope.row.classDisabled"></el-input>
                      <span @click="delClassNum(scope.row, index)" class="el-icon-delete delBtn"
                            style="font-size: 16px;margin-left: 3px;cursor: pointer"></span>
                    </div>
                    <div class="plusBtn"
                         :class="{'stop-btn': threeLevelData.caseTypeIds == 185 && scope.row.tmNumList.length >= 1 ? true : false}"
                         @click="addClassNum(scope.row)">
                      <span class="el-icon-plus"></span>
                    </div>
                  </div>
                </template>
              </pl-table-column>
              <pl-table-column
                label="外代所"
                width="250"
              >
                <template slot-scope="scope">
                  <div style="display: flex;">
                    <span style="flex: 1;" v-if="type == 'view'">{{scope.row.custIdStr}}</span>
                    <el-select
                      v-else
                      style="flex: 1;"
                      default-first-option
                      clearable
                      placeholder="请选择"
                      v-model="scope.row.custId"
                      filterable
                      @change="(v) => changeCustId(v, scope.row)"
                    >
                      <el-option
                        v-for="(item,key) in $commonUtils.unique(hzLists.filter(item =>
                        ((scope.row.picture || scope.row.picture === 0) ? (item.picture === scope.row.picture || item.picture === 3) : true)
                        &&
                        ((threeLevelData.colour || threeLevelData.colour === 0) ? (item.colour === threeLevelData.colour || item.colour === 2) : true)
                        &&
                        (threeLevelData.caseTypeIds ? threeLevelData.caseTypeIds === item.caseTypeId : true)
                        &&
                        ((scope.row.priceLevel || scope.row.priceLevel === 0) ? item.priceLevel === scope.row.priceLevel : true)
                        &&
                        (scope.row.cName ? scope.row.cName === item.countryCn : true)
                        &&
                        (threeLevelData.caseTypeIds == 30 && threeLevelData.changeType ? threeLevelData.changeType === item.changeType : true)
                        ), 'custId')"
                        :key="item.custId + key" :label="item.custIdStr" :value="item.custId">
                      </el-option>
                    </el-select>
                    <div style="display: flex;flex-direction: column">
                      <el-popover
                        placement="right"
                        width="400"
                        trigger="hover"
                        :content="computedDesc(scope.row.cName, scope.row, 'calculationDesc')">
                        <div slot="reference" style="line-height: 32px;font-size: 20px;margin-left: 5px;cursor:pointer;"
                             class="el-icon-info"></div>
                      </el-popover>
                      <el-popover
                        placement="left"
                        width="300"
                        trigger="hover"
                      >
                        <div>
                          <div style="display: flex"
                               v-for="(item, index) in (computedDesc(scope.row.cName, scope.row, 'materialArray') || [])"
                               :key="item.materialId + index">
                            <span style="flex: 1" class="pointer ellipsis" :title="item.materialName"
                                  @click="preView(item)">{{item.materialName}}</span>
                            <!--                            <span @click="delFile(item, index, scope.row.materialArray || [])" class="el-icon-delete delBtn" style="font-size: 16px;margin-left: 3px;cursor: pointer;width: 20px;height: 20px;line-height: 20px;"></span>-->
                          </div>
                        </div>
                        <div slot="reference" style="cursor: pointer;margin-left: 4px">
                          <el-badge
                            :value="computedDesc(scope.row.cName, scope.row, 'materialArray') && computedDesc(scope.row.cName, scope.row, 'materialArray').length || 0">
                            <!--                          <span style="font-size: 16px;margin-left: 3px;cursor: pointer;" class="el-icon-document"></span>-->
                          </el-badge>
                        </div>
                      </el-popover>
                    </div>
                  </div>

                </template>
              </pl-table-column>
              <pl-table-column
                label="是否马德里成员"
              >
                <template slot-scope="scope">
                  <span v-if="type == 'view'">{{scope.row.mad ? '是' : scope.row.mad === 0 ? '否' : ''}}</span>
                  <div v-else>
                    <el-radio v-model="scope.row.mad" :disabled="scope.row.mType === 0" :label="1">是</el-radio>
                    <el-radio v-model="scope.row.mad" :disabled="scope.row.mType === 1" :label="0">否</el-radio>
                  </div>
                </template>
              </pl-table-column>
              <pl-table-column
                v-if="type != 'view'"
                label="操作"
              >
                <template slot-scope="scope">
                  <span class="pointer" @click="delCountry(threeLevelData.countries, scope.$index)">删除</span>
                </template>

              </pl-table-column>
            </pl-table>
            <!--            <el-input size="mini" v-model="threeLevelData.countrys"></el-input>-->

          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="上传商标图样">
            <div
              v-if="type == 'view'"
              style="width: 145px;height: 145px;padding: 10px"
              class="avatar-uploader fl-ac-jc">
              <img v-if="imageUrl" :src="`ipdoc/${imageUrl}`" class="avatar"
                   style="max-width: 100%;max-height: 100%;object-fit: contain">
            </div>
            <el-upload
              v-else
              drag
              style="width: 145px;height: 145px"
              ref="uploadFile"
              name="attachFile"
              :data="imageData"
              class="avatar-uploader fl-ac-jc"
              :action="uploadImage"
              :show-file-list="false"
              :auto-upload="true"
              :on-success="successBack"
              :before-upload="beforeuploadBack">
              <i v-if="!imageUrl" class="el-icon-plus avatar-uploader-icon"></i>
              <img v-if="imageUrl" :src="`ipdoc/${imageUrl}`" class="avatar"
                   style="max-width: 100%;max-height: 100%;object-fit: contain">
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="生成逐一报价" class="">
            <span v-if="type == 'view'">{{threeLevelData.planA ? '是' : threeLevelData.planA === 0 ? '否' : ''}}</span>
            <el-radio-group v-else v-model="threeLevelData.planA" @change="(v) => {!v && (threeLevelData.totalA = 0)}">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item class="">
            <span slot="label">生成马德里报价<br>（马德里+逐一）</span>
            <span v-if="type == 'view'">{{threeLevelData.planB ? '是' : threeLevelData.planB === 0 ? '否' : ''}}</span>
            <el-radio-group v-else v-model="threeLevelData.planB" @change="(v) => {!v && (threeLevelData.totalB = 0)}">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item class="">
            <span slot="label">生成马德里后期指定报价<br>（马德里后期指定+逐一）</span>
            <span v-if="type == 'view'">{{threeLevelData.subsequentDesignation ? '是' : threeLevelData.subsequentDesignation === 0 ? '否' : ''}}</span>
            <el-radio-group v-else v-model="threeLevelData.subsequentDesignation">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="是否导出以下三列">
            <div>
              <div style="display: flex;align-items: center;">
                <div style="width:120px;text-align:right;margin-right: 6px">顺利程序所需时长</div>
                <el-radio-group :disabled="type == 'view'" v-model="threeLevelData.exportItem1">
                  <el-radio :label="0">否</el-radio>
                  <el-radio :label="1">是</el-radio>
                </el-radio-group>
              </div>
              <div style="display: flex;align-items: center;">
                <div style="width:120px;text-align:right;margin-right: 6px">申请所需文件/信息</div>
                <el-radio-group :disabled="type == 'view'" v-model="threeLevelData.exportItem2">
                  <el-radio :label="0">否</el-radio>
                  <el-radio :label="1">是</el-radio>
                </el-radio-group>
              </div>
              <div style="display: flex;align-items: center;">
                <div style="width:120px;text-align:right;margin-right: 6px;">特别提示</div>
                <el-radio-group :disabled="type == 'view'" v-model="threeLevelData.exportItem3">
                  <el-radio :label="0">否</el-radio>
                  <el-radio :label="1">是</el-radio>
                </el-radio-group>
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="type=='edit' || type == 'view'">
        <el-col :span="12">
          <el-form-item label="逐一报价合计" class="">
            <!--            {{threeLevelData.totalA}}-->
            <span v-if="type == 'view'">{{threeLevelData.totalA | formatAmount}}</span>
            <div v-else>
              <el-input size="mini" v-if="status.totalAstatus" @blur="status.totalAstatus = false" type="number"
                        v-model="threeLevelData.totalA" placeholder></el-input>
              <el-input size="mini" v-if="!status.totalAstatus" @focus="status.totalAstatus = true"
                        :value="formatAmount(threeLevelData.totalA)"></el-input>
            </div>

            <!--            <el-input v-else size="mini" v-model="threeLevelData.totalA"></el-input>-->

          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item class="">
            <span slot="label">马德里报价合计<br>（马德里+逐一）</span>
            <!--            {{threeLevelData.totalB}}-->
            <span v-if="type == 'view'">{{threeLevelData.totalB | formatAmount}}</span>
            <div v-else>
              <el-input size="mini" v-if="status.totalBstatus" @blur="status.totalBstatus = false" type="number"
                        v-model="threeLevelData.totalB" placeholder></el-input>
              <el-input size="mini" v-if="!status.totalBstatus" @focus="status.totalBstatus = true"
                        :value="formatAmount(threeLevelData.totalB)"></el-input>
            </div>

          </el-form-item>
        </el-col>

      </el-row>
      <el-row v-if="type=='create'">
        <el-col :span="12">
          <el-form-item label="客户组" class="">
            <span v-if="type == 'view'"> {{threeLevelData.wkgIdStr}}</span>
            <el-select v-else :clearable="true"
                       default-first-option filterable placeholder=""
                       v-model="threeLevelData.wkgId">
              <el-option :key="key" :label="item.groupName" :value="item.wkgId"
                         v-for="(item,key) in custGroup"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="type!='create'">
        <el-col :span="12">
          <el-form-item label="客户组" class="">
            <span v-if="type == 'view'"> {{threeLevelData.wkgIdStr}}</span>
            <el-select v-else :clearable="true"
                       default-first-option filterable placeholder=""
                       v-model="threeLevelData.wkgId">
              <el-option :key="key" :label="item.groupName" :value="item.wkgId"
                         v-for="(item,key) in custGroup"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="创建日期" class="">
            <span>
              {{threeLevelData.createDate}}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="创建人" class="">
            {{threeLevelData.createUserIdStr}}
          </el-form-item>
        </el-col>

      </el-row>
      <el-row class="fullRow" v-if="type == 'edit' || type == 'view'">
        <el-col :span="24">
          <el-form-item label="报价文档" class="">
            <el-upload
              ref="upload"
              class="upload-demo"
              name="attachFile"
              :data="getUploadData"
              :action="creatematerial"
              :show-file-list='false'
              :before-upload="beforeUpload"
              :on-success="successCallback"
            >

              <el-button size="mini" type="primary">上传</el-button>
            </el-upload>
            <el-table :data="threeLevelData.materials" empty-text="暂无数据" style="width: 100%;"
                      current-row-key border
                      highlight-current-row
                      size="mini">
              <el-table-column
                type="index"
                label="序号"
              >
              </el-table-column>
              <el-table-column
                label="名称"
              >
                <template slot-scope="scope">
                  <span class="pointer" @click="preView(scope.row)">{{scope.row.materialName}}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="上传人"
              >
                <template slot-scope="scope">
                  {{scope.row.creater}}

                </template>
              </el-table-column>
              <el-table-column
                label="上传日期"
              >
                <template slot-scope="scope">
                  {{scope.row.createDate}}
                </template>
              </el-table-column>
              <el-table-column
                v-if="type != 'view'"
                label="操作"
              >
                <template slot-scope="scope">
                  <span v-allow="481" class="pointer" @click="delFile(scope.row)">删除</span>
                </template>

              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>

    <el-dialog
      append-to-body
      title="国家/地区"
      :close-on-click-modal="false"
      :visible.sync="moreCountryView"
      width="70%"
      height="80%"
      class="abow_dialog"
    >
      <el-tree
        @check="checkNode"
        :data="continentList"
        show-checkbox
        :default-expand-all="true"
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps"
        :render-content="renderContent"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer fl-ac-jc">
        <el-button size="small" @click="moreCountryView = false">取 消</el-button>
        <el-button size="small" type="primary" @click="addMoreCountryConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import uploadXlsx from '@/components/fileReadXLSX'
  import {doEditInOffice, getProgID} from '@/utils/editInOffice.js'
  import {creatematerial} from '@/api/ipServiceApi.config.js'
  import {formatAmount, fomatFloat, toFixed1, toFixed2} from '@/utils/filters'
  import {queryCaseWorkgroupUrl} from '@/api/caseDetail'
  import {queryCustomerNameId, delCaseMaterial} from '@/api/caseList.js'
  import {queryCountryCn, queryOfferPriceSome, queryOfferPrice} from '@/api/billApi'
  import {uploadImage} from '@/api/serviceApi.config.js'
  import {queryWorkByUserId} from '../../../../api/systemList'
  import {queryContinentByWorldArea} from "../../../../api/material";

  export default {
    name: 'BJForm',
    props: {
      isCopy: {},
      threeLevelData: {},
      type: {
        type: String,
        default: ''
      }
    },
    components: {
      uploadXlsx
    },
    computed: {
      numList() {
        return Array.from(new Array(45), (item, index) => (index + 1 < 10 ? '0' + (index + 1) : '' + (index + 1)))
      }
    },
    data() {
      return {
        checkedNodes: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        continentList: [],
        moreCountryView: false,
        offerNameChanged: false,
        clickUpload: false,
        hzLists: [],
        imageUrl: '',
        uploadImage,
        imageData: {
          tokenID: this.$store.getters.token
        },
        status: {
          totalAstatus: false,
          totalBstatus: false
        },
        getUploadData: {
          tokenID: this.$store.getters.token,
          objType: 1130,
          objInstId: ''
        },
        creatematerial,
        custGroup: [],
        countryList: [],
        customerNameIdList: [],
      }
    },
    watch: {
      'threeLevelData.countries': {
        handler(n) {
          this.threeLevelData.countrysNum = n && n.length || 0
        },
        immediate: true
      },
      'threeLevelData.caseTypeIds': {
        handler(n, o) {
          if (n) {
            this.queryCountryCn(n)
          }
        },
        immediate: false
      }
    },
    created() {
      this.init()
      if (this.isCopy) {
        this.queryOfferPrice()
      }
      // row.offerType = this.hzLists.find(item => item.countryCn === v).offerType
      //     if (row.offerType == 2) {
      //       row.classDisabled = true
      //       row.tmNumList.forEach(i => {
      //         i.classNumPerTm = ''
      //       })
      //     } else {
      //       row.classDisabled = false
      //     }
    },
    methods: {
      changeCaseType(caseType) {
        // this.changeWDS('case')
        this.queryOfferPrice()
      },
      checkNum(n) {
        let noticeFlag = false
        n.forEach(row => {
          if (row.tmNumList && row.tmNumList.find(item => item.classNumPerTm >= 45)) {
            noticeFlag = true
          }
          row.tmNumList && row.tmNumList.forEach(item => {
            item.classNumPerTm = item.classNumPerTm >= 45 ? '' : item.classNumPerTm;
          })
        })
        noticeFlag && this.$message.error('类别/标数值不能超过45')
      },
      addMoreCountryConfirm() {
        if (!this.checkedNodes.length) return
        this.checkedNodes.filter(item => item.label && !['全球', '世界知识产权组织国际局', '北美洲', '欧洲', '亚洲', '大洋洲', '南美洲', '非洲', '南极洲'].includes(item.label)).forEach(item => {
          this.addCountry(item.label)
          this.changeCountry(item.label, this.threeLevelData.countries[this.threeLevelData.countries.length - 1])
        })
        this.moreCountryView = false
        this.checkedNodes = []
        this.$refs.tree.setCheckedKeys([])
        this.$nextTick(() => {
          this.$commonUtils.scrollToBottom(document.querySelector('.el-table__body-wrapper'))
        })
      },
      renderContent(h, {node, data, store}) {
        return (
          < div
        style = "display: flex;align-items: center;" >
          {data.image ? < img
        style = "margin-left: 10px;border: 1px solid #ccc"
        src = {'/ipdoc/' +data.image} > < /img> : ''}
          < span
        style = "margin-left: 10px" > {data.label} < /span>
          < /div>
      )
      },
      checkNode(current, data) {
        this.checkedNodes = data.checkedNodes || []
      },
      addMoreCountry() {
        this.moreCountryView = true
      },
      changeFirstRow(v, index, outIndex, type, row) {
        if (index == 0 && outIndex == 0 && v != 0) {
          // this.threeLevelData.countries&&this.threeLevelData.countries[0]&&this.threeLevelData.countries[0].tmNumList
          if (this.threeLevelData.countries && this.threeLevelData.countries.length && this.threeLevelData.countries[0].tmNumList && this.threeLevelData.countries[0].tmNumList.length) {
            const tmNum = this.threeLevelData.countries[0].tmNumList[0].tmNum
            const classNumPerTm = this.threeLevelData.countries[0].tmNumList[0].classNumPerTm
            this.threeLevelData.countries.forEach(item => {
              if (item.tmNumList && item.tmNumList.length) {
                item.tmNumList.forEach(j => {
                  type == 'tmNum' && (j.tmNum = tmNum)
                  type == 'classNumPerTm' && !item.classDisabled && (j.classNumPerTm = classNumPerTm)
                })
              }
            })
          }
        }
        if (v == 0 && type == 'classNumPerTm') {
          this.$message.error("类别个数必须大于0")
          row.classNumPerTm = +this.threeLevelData.countries[0].tmNumList[0].classNumPerTm || this.threeLevelData.classNumTotal || 1
          this.$forceUpdate()
        }
        this.checkNum(this.threeLevelData.countries)
      },
      getFirstSheet(data) {
        if (!this.threeLevelData.classNumTotal && this.threeLevelData.classNumTotal !== 0) {
          this.$message.warning('请填写【类别个数】')
        }
        if (!JSON.stringify(data).includes('国家地区')) {
          this.$message.error('请增加或修改列表表头为【国家地区】')
          return
        }
        const str = JSON.stringify(data).replace(/国家地区/g, 'cName')
        const list = JSON.parse(str).map(item => ({cName: item.cName})).filter(i => i.cName)
        if (list && list.length) {
          list.forEach(item => {
            this.addCountry(item.cName)
            this.changeCountry(item.cName, this.threeLevelData.countries[this.threeLevelData.countries.length - 1])
          })
          this.$nextTick(() => {
            this.$commonUtils.scrollToBottom(document.querySelector('.el-table__body-wrapper'))
          })
        }
        this.checkNum(this.threeLevelData.countries)
      },
      delClassNum(row, index) {
        if (row.tmNumList.length == 1) {
          this.$message.error('至少保留一条！')
          return
        }
        row.tmNumList.splice(index, 1)
      },
      addClassNum(row) {
        if (this.threeLevelData.caseTypeIds == 185 && row.tmNumList.length >= 1) return
        let tmNum, classNumPerTm
        if (this.threeLevelData.countries && this.threeLevelData.countries[0] && this.threeLevelData.countries[0].tmNumList && this.threeLevelData.countries[0].tmNumList[0]) {
          tmNum = this.threeLevelData.countries[0].tmNumList[0].tmNum || 1
          // (row.offerType == 1 ? this.threeLevelData.classNumTotal : '')
          classNumPerTm = row.offerType == 2 ? '' : this.threeLevelData.countries[0].tmNumList[0].classNumPerTm || this.threeLevelData.classNumTotal || 1
        } else {
          classNumPerTm = row.offerType == 2 ? '' : this.threeLevelData.classNumTotal || 1
          tmNum = 1
        }
        row.tmNumList.push({tmNum, classNumPerTm})
      },
      changeClassIn(v) {
        this.threeLevelData.classIn = v.join(',')
        this.threeLevelData.classNumTotal = this.threeLevelData.classInList && this.threeLevelData.classInList.length || 0
        this.changeClassNumTotal(this.threeLevelData.classNumTotal)
      },
      changeClassNumTotal(v) {
        v && this.threeLevelData.countries && this.threeLevelData.countries.forEach(item => {
          item.tmNumList && item.tmNumList.forEach(j => {
            !item.classDisabled && (j.classNumPerTm = v)
          })
        })
      },
      changePremium(v, index) {
        if (index === 0) {
          this.threeLevelData.countries.forEach(item => {
            item.premium = v
          })
        }
      },
      spellDesc() {
        if (this.offerNameChanged && this.threeLevelData.offerName) return;
        this.$set(this.threeLevelData, 'offerName', (this.customerNameIdList.find(item => item.custId === this.threeLevelData.custId) && this.customerNameIdList.find(item => item.custId === this.threeLevelData.custId).fullname || '') +
          '境外商标' +
          ([{id: 185, label: '注册申请'}, {id: 31, label: '转让'}, {id: 52, label: '查询'}, {id: 33, label: '续展'}, {
              id: 30,
              label: '变名变址'
            }].find(it => it.id === this.threeLevelData.caseTypeIds)
            &&
            [{id: 185, label: '注册申请'}, {id: 31, label: '转让'}, {id: 52, label: '查询'}, {id: 33, label: '续展'}, {
              id: 30,
              label: '变名变址'
            }].find(it => it.id === this.threeLevelData.caseTypeIds).label || '') +
          '报价')
      },
      queryOfferPrice() {
        queryOfferPrice({
          pageSize: 10000,
          pageNo: 1,
          isUse: 1,
          caseTypeId: this.threeLevelData.caseTypeIds
        }).then(res => {
          this.hzLists = res.data.filter(item => item.custId)
        })
      },
      beforeuploadBack() {
        this.imageData.ocId = this.threeLevelData.ocId || ''
      },
      successBack(file) {
        this.imageUrl = file.data[0].address
        this.threeLevelData.imagePath = this.imageUrl
        file.data[0].objInstId ? this.threeLevelData.ocId = file.data[0].objInstId : ''
      },
      formatAmount(n) {
        return formatAmount(n)
      },
      delFile(row) {
        delCaseMaterial({
          materialId: row.materialId,
          objInstId: this.threeLevelData.ocId,
          objType: 1130
        }).then(res => {
          this.threeLevelData.materials.splice(this.threeLevelData.materials.map(item => item.materialId).indexOf(row.materialId), 1)
          this.$message.success('删除成功!')
        })
      },
      preView(file) {
        let data = file
        let url = file.address
        if (getProgID(url) || ['eml', 'msg'].includes(url.replace(/.+\./, '').toLocaleLowerCase())) {
          if (['doc', 'docx'].includes(url.replace(/.+\./, '').toLocaleLowerCase())) {
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
        } else if (['pdf', 'jpg', 'png'].some(item => url.replace(/.+\./, '').toLocaleLowerCase() == item)) {
          window.open(`/ipdoc${url}`.replace(/[+]/g, '%2B'))
        } else {
          this.downLoad(file)
        }
      },
      downLoad(data) {
        const url = data.address
        const downData = {
          url: `ipdoc${url}`,
          success() {
            // notify.close()
          }
        }
        this.$commonUtils.downLoadAll(downData)
      },
      beforeUpload() {
        this.getUploadData.objInstId = this.threeLevelData.ocId
      },
      successCallback(res, list) {
        res.data.forEach(item => {
          item.name = item.materialName

          this.threeLevelData.materials ? this.threeLevelData.materials.push(item) : this.threeLevelData.materials = [item]
        })
      },
      setWkgId(userId) {
        queryWorkByUserId({userId}).then(res => {
          if (res.data.groups && res.data.groups.length) {
            this.$set(this.threeLevelData, 'wkgId', res.data.groups[0].wkgId)
          }
        })
        // if (this.custGroup && this.custGroup.length) {
        //   this.custGroup.forEach(item => {
        //     if (item.wkgUsers && item.wkgUsers.length) {
        //       if (item.wkgUsers.find(i => i.userId == userId)) {
        //         !this.threeLevelData.wkgId && this.$set(this.threeLevelData, 'wkgId', item.wkgId)
        //       }
        //     }
        //   })
        // }
      },
      queryCustGroup() {
        queryCaseWorkgroupUrl({status: '1'}).then(res => {
          this.custGroup = res.data
          !this.threeLevelData.wkgId && this.type === 'create' && this.setWkgId(this.$store.getters.userId)
        })
      },
      queryContinentByWorldArea() {
        queryContinentByWorldArea().then(res => {
          this.continentList = res.data
        })
      },
      init() {
        this.queryContinentByWorldArea()
        !this.threeLevelData.classNumTotal && this.threeLevelData.classNumTotal !== 0 && this.$set(this.threeLevelData, 'classNumTotal', 1)
        this.threeLevelData.custId && queryCustomerNameId({custId: this.threeLevelData.custId}).then(res => {
          this.customerNameIdList = res.data
        })
        this.threeLevelData.caseTypeIds && (this.threeLevelData.caseTypeIds = +this.threeLevelData.caseTypeIds)
        !this.threeLevelData.exchangeRate && this.queryOfferPriceSome(true)
        !this.threeLevelData.colour && this.$set(this.threeLevelData, 'colour', 0)
        // !this.threeLevelData.picture && this.$set(this.threeLevelData, 'picture', 0)
        !this.threeLevelData.imagePath && this.$set(this.threeLevelData, 'imagePath', '')
        !this.threeLevelData.classIn && this.$set(this.threeLevelData, 'classIn', '')
        this.$set(this.threeLevelData, 'classInList', this.threeLevelData.classIn.split(',').filter(Boolean))
        this.imageUrl = this.threeLevelData.imagePath
        !this.threeLevelData.exportItem1 && this.$set(this.threeLevelData, 'exportItem1', 0)
        !this.threeLevelData.exportItem2 && this.$set(this.threeLevelData, 'exportItem2', 0)
        !this.threeLevelData.exportItem3 && this.$set(this.threeLevelData, 'exportItem3', 0)
        this.queryCustGroup();
        (this.type == 'edit' || this.type == 'view') && this.queryOfferPrice()
      },
      queryOfferPriceSome(noCaseType) { // true 瑞士法郎联动，false 我方代理费
        queryOfferPriceSome({
          caseTypeId: noCaseType ? 0 : this.threeLevelData.caseTypeIds,
          priceType: noCaseType ? 6 : undefined
        }).then(res => {
          noCaseType && this.$set(this.threeLevelData, 'exchangeRate', res.data[0].priceValue)
          !noCaseType && this.$set(this.threeLevelData, 'whdServiceFee', res.data.filter(item => item.priceType == 2)[0] && res.data.filter(item => item.priceType == 2)[0].priceValue)
        })
      },
      delCountry(list, index) {
        list.splice(index, 1)
      },
      queryCustomerList(query) {
        if (query !== '') {
          queryCustomerNameId({pageNo: 1, pageSize: 100, keyword: query, curStatus: '4,5'}).then(res => {
            this.customerNameIdList = res.data
          })
        }
      },
      changeCustId(v, row) {
        if (!v) {
          row.offerType = ''
        } else {
          const list = this.hzLists.filter(item => (
            (row.picture || row.picture === 0) ? (item.picture === row.picture || item.picture === 3) : true)
          &&
          ((this.threeLevelData.colour || this.threeLevelData.colour === 0) ? (item.colour === this.threeLevelData.colour || item.colour === 2) : true)
          &&
          (this.threeLevelData.caseTypeIds ? this.threeLevelData.caseTypeIds === item.caseTypeId : true)
          &&
          ((row.priceLevel || row.priceLevel === 0) ? item.priceLevel === row.priceLevel : true)
          &&
          (row.cName ? row.cName === item.countryCn : true)
            &&
            (this.threeLevelData.caseTypeIds == 30 && this.threeLevelData.changeType ? this.threeLevelData.changeType === item.changeType : true)
          )
          if (list.length) {
           row.offerType = list.find(item => item.custId == v).offerType || ''
            row.offerType == 2 && (row.classDisabled = true, row.tmNumList && row.tmNumList.forEach(i => {
              i.classNumPerTm = ''
            }))
            row.offerType != 2 && (row.classDisabled = false, row.tmNumList && row.tmNumList.forEach(i => {
              i.classNumPerTm = +this.threeLevelData.countries[0].tmNumList[0].classNumPerTm || this.threeLevelData.classNumTotal || 1
            }))
          }
        }
      },
      changeWDS(value) {
        // if (type === 'case') {
        //   !this.threeLevelData.whdServiceFee && this.threeLevelData.caseTypeIds && this.queryOfferPriceSome(false)
        // }
        // this.spellDesc()
        this.threeLevelData.countries && this.threeLevelData.countries.forEach(row => {
          row.picture = value
          this.changeLevel('', row)
        })
      },
      changeAllLevel(v) {
        this.threeLevelData.countries.forEach((item, index) => {
          this.$set(this.threeLevelData.countries[index], 'priceLevel', v)
          this.changeLevel(v, item)
        })
      },
      changeLevel(v, row) {
        row.custId = ''
        row.offerType = ''
        const list = this.hzLists.filter(item => (
            (row.picture || row.picture === 0) ? (item.picture === row.picture || item.picture === 3) : true)
          &&
          ((this.threeLevelData.colour || this.threeLevelData.colour === 0) ? (item.colour === this.threeLevelData.colour || item.colour === 2) : true)
          &&
          (this.threeLevelData.caseTypeIds ? this.threeLevelData.caseTypeIds === item.caseTypeId : true)
          &&
          ((row.priceLevel || row.priceLevel === 0) ? item.priceLevel === row.priceLevel : true)
          &&
          (row.cName ? row.cName === item.countryCn : true)
          &&
          (this.threeLevelData.caseTypeIds == 30 && this.threeLevelData.changeType ? this.threeLevelData.changeType === item.changeType : true)
        )
        if (list.length) {
          row.custId = list[0].custId
          row.offerType = list[0].offerType
          row.offerType == 2 && (row.classDisabled = true, row.tmNumList && row.tmNumList.forEach(i => {
            i.classNumPerTm = ''
          }))
          row.offerType != 2 && (row.classDisabled = false, row.tmNumList && row.tmNumList.forEach(i => {
            i.classNumPerTm = +this.threeLevelData.countries[0].tmNumList[0].classNumPerTm || this.threeLevelData.classNumTotal || 1
          }))
        }
      },
      computedDesc(v, row, key) {
        if (v && this.countryList.find(item => item.countryCn === v) && this.countryList.find(item => item.countryCn === v).countryCn) {
          const list = this.hzLists.filter(item => (
              (row.picture || row.picture === 0) ? (item.picture === row.picture || item.picture === 3) : true)
            &&
            ((this.threeLevelData.colour || this.threeLevelData.colour === 0) ? (item.colour === this.threeLevelData.colour || item.colour === 2) : true)
            &&
            (this.threeLevelData.caseTypeIds ? this.threeLevelData.caseTypeIds === item.caseTypeId : true)
            &&
            ((row.priceLevel || row.priceLevel === 0) ? item.priceLevel === row.priceLevel : true)
            &&
            (row.cName ? row.cName === item.countryCn : true)
            &&
            (this.threeLevelData.caseTypeIds == 30 && this.threeLevelData.changeType ? this.threeLevelData.changeType === item.changeType : true)
          )
          if (list.length) {
            return list.find(item => item.custId == row.custId) && list.find(item => item.custId == row.custId)[key] || (key === 'calculationDesc' ? '' : [])
          } else {
            return ''
          }
        } else {
          return ''
        }
      },
      changeCountry(v, row, isTable) {
        row.custId = ''
        row.offerType = ''
        const oapiList = [
          '喀麦隆',
          '贝宁',
          '布基纳法索',
          '中非共和国',
          '刚果共和国',
          '乍得',
          '加蓬',
          '几内亚',
          '几内亚比绍',
          '科特迪瓦（象牙海岸）',
          '马里',
          '毛里塔尼亚',
          '尼日尔',
          '塞内加尔',
          '多哥',
          '赤道几内亚',
          '科摩罗'
        ]
        if (oapiList.find(item => item === v) && isTable) {
          this.$message.warning('OAPI，非洲知识产权组织，由前法国殖民地中官方语言为法语的国家组成的地区性联盟，涵盖17个成员国：喀麦隆、贝宁、布基纳法索、中非共和国、刚果共和国、乍得、加蓬、几内亚、几内亚比绍、科特迪瓦（象牙海岸）、马里、毛里坦尼亚、尼日尔、塞内加尔、多哥、赤道几内亚、科摩罗。OAPI对商标保护实施和执行统一的立法，统一的立法被视为每个成员国的国内法律。各成员国放弃了自主审查注册商标的权利，OAPI颁发的商标保护证书自动在各成员国生效。当目的国在上述17个成员国范围内时，请选择OAPI及报价。')
        }
        if (v && this.countryList.find(item => item.countryCn === v) && this.countryList.find(item => item.countryCn === v).countryCn) {
          row.mType = this.countryList.find(item => item.countryCn === v).type
          row.mType ? row.mad = 1 : row.mad = 0
          const list = this.hzLists.filter(item => (
              (row.picture || row.picture === 0) ? (item.picture === row.picture || item.picture === 3) : true)
            &&
            ((this.threeLevelData.colour || this.threeLevelData.colour === 0) ? (item.colour === this.threeLevelData.colour || item.colour === 2) : true)
            &&
            (this.threeLevelData.caseTypeIds ? this.threeLevelData.caseTypeIds === item.caseTypeId : true)
            &&
            ((row.priceLevel || row.priceLevel === 0) ? item.priceLevel === row.priceLevel : true)
            &&
            (row.cName ? row.cName === item.countryCn : true)
            &&
            (this.threeLevelData.caseTypeIds == 30 && this.threeLevelData.changeType ? this.threeLevelData.changeType === item.changeType : true)
          ).filter(item => item.custId)
          if (list.length) {
            row.custId = list[0].custId
            row.offerType = list[0].offerType
            row.offerType == 2 && (row.classDisabled = true, row.tmNumList && row.tmNumList.forEach(i => {
              i.classNumPerTm = ''
            }))
            row.offerType != 2 && (row.classDisabled = false, row.tmNumList && row.tmNumList.forEach(i => {
              i.classNumPerTm = +this.threeLevelData.countries[0].tmNumList[0].classNumPerTm || this.threeLevelData.classNumTotal || 1
            }))
          }
        } else {
          row.tmNumList.forEach(item => {
            item.countryId = ''
          })
        }
      },
      addCountry(cName) {
        if (!this.threeLevelData.classNumTotal && this.threeLevelData.classNumTotal !== 0 && !cName) {
          this.$message.warning('请填写【类别个数】')
        }
        // if(countryCn)
        if (!this.threeLevelData.countries || this.threeLevelData.countries && !this.threeLevelData.countries.length) {
          this.$set(this.threeLevelData, 'countries', [{
            cName,
            mad: '',
            priceLevel: 0,
            premium: 500,
            custId: '',
            picture: 0,
            // classNum: this.threeLevelData.classNumTotal
            tmNumList: [{
              tmNum: 1,
              classNumPerTm: this.threeLevelData.classNumTotal || 1
            }]
          }])
        } else {
          this.threeLevelData.countries.push({
            cName,
            mad: '',
            priceLevel: 0,
            premium: 500,
            custId: '',
            picture: this.threeLevelData.countries[0].picture || 0,
            // classNum: this.threeLevelData.classNumTotal
            tmNumList: [{
              tmNum: this.threeLevelData.countries && this.threeLevelData.countries[0] && this.threeLevelData.countries[0].tmNumList && this.threeLevelData.countries[0].tmNumList[0] && this.threeLevelData.countries[0].tmNumList[0].tmNum || '',
              classNumPerTm: this.threeLevelData.countries && this.threeLevelData.countries[0] && this.threeLevelData.countries[0].tmNumList && this.threeLevelData.countries[0].tmNumList[0] && this.threeLevelData.countries[0].tmNumList[0].classNumPerTm || '',
            }]
          })
        }
        this.$nextTick(() => {
          !cName && this.$commonUtils.scrollToBottom(document.querySelector('.el-table__body-wrapper'))
        })
      },
      queryCountryCn(caseTypeIds) {
        queryCountryCn({
          caseTypeIds
        }).then(res => {
          this.countryList = res.data
          this.threeLevelData.countries && this.threeLevelData.countries.forEach(row => {
            if (row.cName && this.countryList.find(item => item.countryCn === row.cName) && this.countryList.find(item => item.countryCn === row.cName).countryCn) {
            row.mType = this.countryList.find(item => item.countryCn === row.cName).type
            }
          })
          // this.countryList = res.data.map(item => ({
          //   value: item.countryCn,
          //   label: item.countryCn,
          //   countryCn: item.countryCn
          // })) || []
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .form-container {
    .el-form-item__error {
      position: relative !important;
      top: 0;
    }

    /deep/ .el-row {
      margin: 0px;
      display: flex; /*解决账单查看表单样式被撑开*/
    }

    /deep/ .postInfo-container-item {
      height: 100%;
      width: 100%;
    }

    /deep/ .el-form-item__label {
      background-color: #f9f9f9;
      /*width: 36.7%;*/
      text-align: right;
      height: 100%;
    }

    /deep/ .el-form-item {
      border-right: 1px solid #d7d7d7;
      margin: 0px !important;
      height: 100%;
    }

    .first-row {
      /*>>>.el-row {*/
      border-top: 1px solid #d7d7d7;
      /*}*/
    }

    /deep/ .el-row {
      border-bottom: 1px solid #d7d7d7;
      border-left: 1px solid #d7d7d7;
    }

    /deep/ .el-input,
    /deep/ .el-select {
      width: 77%;
    }

    /deep/ td .el-input,
    /deep/ td .el-select {
      width: 100%;
    }

    /deep/ .el-form-item__content {
      text-align: left;
      word-break: break-word;
      padding: 0px 10px;
      // height: 30px;
    }

    .fullRow {
      /deep/ .el-form-item__label {
        /*width: 15%;*/
        height: 100%;
      }

      /deep/ .el-input,
      /deep/ .el-select {
        width: 30%;
      }
    }

    /deep/ .el-input__inner {
      // border: none;
    }

    /deep/ .el-select .el-input {
      width: 100%;
    }

    /deep/ td .el-select,
    /deep/ td .el-input,
    /deep/ td .el-input__inner {
      // border: 0px !important;
    }

    .postInfo-container-item {
      display: flex;
      width: 100%;

      /deep/ .el-form-item__content {
        text-align: left;
        display: inline-table;
        width: 85%;
        padding: 0px 10px;
      }

      /deep/ .el-form-item__label {
        height: 100%;
        line-height: 28px;
      }
    }
  }

  .avatar-uploader {
    /deep/ .el-form-item__label {
      height: 154px;
      line-height: 154px;
      width: 30%;
    }

    height: 154px;

    /deep/ .el-upload {
      border: 1px dashed #b6b2b2;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      margin-top: 4px;
    }
  }

  .avatar-uploader {
    /deep/ .el-upload:hover {
      border-color: #409eff;
    }
  }

  .avatar-uploader-icon {
    float: left;
    font-size: 28px;
    color: #8c939d;
    width: 145px;
    height: 145px;
    line-height: 145px;
    text-align: center;
    /*border: 1px dashed #d9d9d9;*/
  }

  .avatar {
    width: 145px;
    height: 145px;
    display: block;
  }

  .plusBtn {
    cursor: pointer;
    border-radius: 3px;
    border: 1px solid #DCDFE6;
    width: 100%;
    text-align: center;
    margin-top: 3px;
    line-height: 18px;
    height: 18px;

    &:hover {
      background-color: #409EFF;
      color: #fff;
    }
  }

  .delBtn {
    &:hover {
      color: red;
    }
  }

  .stop-btn {
    cursor: not-allowed;
  }

  .abow_dialog {
    > > > .el-dialog {
      position: absolute;
      top: 50%;
      left: 50%;
      margin: 0 !important;
      transform: translate(-50%, -50%);
      min-height: calc(60%);
      max-height: calc(100% - 30px);
      max-width: calc(100% - 30px);
      display: flex;
      flex-direction: column;
    }

    > > > .el-dialog__body {
      overflow: auto;
      padding: 0 10px 10px 10px;
    }
  }

  > > > .el-tree-node.is-expanded > .el-tree-node__children, > > > .el-tree-node > .el-tree-node__children {
    display: flex;
    flex-wrap: wrap;

    .el-tree-node {
      width: 25%;
      height: 60px;
      display: flex;
      align-items: center;

      .el-tree-node__content {
        display: flex;
        align-items: center;
      }
    }
  }
</style>
