<template>
  <div style="padding: 30px 30px 0 30px;">
    <el-form label-width="120px" :model="postForm">
      <el-row>
        <el-col :span="12">

          <el-form-item label="国家:">
            <el-select style="width: 50%;" v-model="postForm.countryCn" placeholder="" filterable clearable
                       @change="() => queryOfferPrice(true)">
              <el-option
                v-for="item in countryList"
                :key="item.countryCn"
                :label="item.countryCn"
                :value="item.countryCn">
              </el-option>
            </el-select>

          </el-form-item>
        </el-col>
        <el-col :span="postForm.caseTypeId == 30 ? 6 : 12">
          <el-form-item label="案件类型:">
            <el-select style="" v-model="postForm.caseTypeId" placeholder="" filterable clearable
                       @change="changeCaseType">
              <el-option
                v-for="item in [{id: 185, label: '注册申请'}, {id: 31, label: '转让'}, {id: 52, label: '查询'}, {id: 33, label: '续展'}, {id: 30, label: '变名变址'}]"
                :key="item.id"
                :label="item.label"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="postForm.caseTypeId == 30">
          <el-form-item label="变更类型" class="">
            <el-select @change="() => queryOfferPrice(true)" v-model="postForm.changeType" placeholder="" filterable
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
        <el-col :span="12">
          <el-form-item label="商标种类:">
            <el-radio-group v-model="picture" @change="() => queryOfferPrice(true)">
              <el-radio :label="0">文字</el-radio>
              <el-radio :label="1">图形</el-radio>
              <el-radio :label="2">组合</el-radio>
              <el-radio :label="4">英文文字</el-radio>
              <el-radio :label="5">中文文字</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商标颜色:">
            <el-radio-group v-model="colour" @change="() => queryOfferPrice(true)">
              <el-radio :label="0">黑白</el-radio>
              <el-radio :label="1">彩色</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="报价档位:">
            <el-select style="width: 50%;" v-model="priceLevel" placeholder="" clearable
                       @change="() => queryOfferPrice(true)">
              <el-option
                v-for="item in [{id: 0, label: '低档'}, {id: 1, label: '中档'}, {id: 2, label: '高档'}]"
                :key="item.id"
                :label="item.label"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="我方代理费/类:">
            <el-input v-if="$store.getters.permissions.includes(296)" style="width: 50%;" size="mini"
                      v-model="postForm.WHDFee"
                      @change="(v)=>{changeYJ(v, 2)}"></el-input>
            <span v-else>{{postForm.WHDFee}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <!--      <el-row>-->
      <!--        <el-col :span="12">-->
      <!--          <el-form-item label="溢价金额/类:">-->
      <!--            <el-input v-if="$store.getters.permissions.includes(296)" size="mini" style="width: 50%;"-->
      <!--                      v-model="postForm.YJFee"-->
      <!--                      @change="(v)=>{changeYJ(v, 1)}"></el-input>-->
      <!--            <span v-else>-->
      <!--              {{postForm.YJFee}}-->
      <!--            </span>-->
      <!--          </el-form-item>-->

      <!--        </el-col>-->
      <!--        -->
      <!--      </el-row>-->
    </el-form>
    <div style="width: 100%;position:relative;height: 30px;">
      <el-button style="position: absolute;right: 0" v-if="$store.getters.permissions.includes(296)" size="mini"
                 type="primary"
                 @click="createAndEdit('create')">新建
      </el-button>
    </div>

    <pl-table
      class="plTable"
      :data="ZYtableData"
    >
      <pl-table-column
        type="index"
        label="序号"
        width="60">
      </pl-table-column>
      <pl-table-column
        prop="countryCn"
        label="国家"
      >
      </pl-table-column>
      <pl-table-column
        prop="custIdStr"
        label="代理所"
      >
        <template slot-scope="scope">
          <span :title="scope.row.custIdStr">{{scope.row.custIdStr}}</span>
        </template>
      </pl-table-column>
      <pl-table-column
        prop="caseTypeIdStr"
        label="案件类型"
      >
      </pl-table-column>
      <pl-table-column
        prop="priceLevelStr"
        label="报价档位"
      >
      </pl-table-column>
      <pl-table-column
        label="报价规则"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.offerType == 2">标</span>
          <span v-if="scope.row.offerType == 1">类</span>
        </template>
      </pl-table-column>
      <pl-table-column label="境外商标注册费(RMB)">
        <!--      <el-table-column-->
        <!--        prop="name"-->
        <!--        label="姓名"-->
        <!--        width="120">-->
        <!--      </el-table-column>-->
        <!--      <el-table-column label="地址">-->
        <pl-table-column
          prop="firstClass"
          label="官费首类/标"
        >
        </pl-table-column>
        <pl-table-column
          prop="secondClass"
          label="官费第2类/标"
        >
        </pl-table-column>
        <pl-table-column
          prop="thirdClass"
          label="官费3~n类/标"
        >
        </pl-table-column>
        <pl-table-column
          prop="additionalClass"
          label="官费附加类/标"
        >
        </pl-table-column>
        <pl-table-column
          prop="additionalClassBegin"
          label="附加开始类/标(n+1)"
        >
        </pl-table-column>
        <pl-table-column
          prop="serviceFeeFirstClass"
          label="代理费首类/标"
        >
        </pl-table-column>
        <pl-table-column
          prop="serviceFeeSecondClass"
          label="代理费第2类/标"
        >
        </pl-table-column>
        <pl-table-column
          prop="serviceFeeThirdClass"
          label="代理费3~n类/标"
        >
        </pl-table-column>
        <pl-table-column
          prop="serviceFeeAdditionalClass"
          label="代理费附加类/标"
        >
        </pl-table-column>
        <pl-table-column
          prop="otherFeeFirstClass"
          label="杂费首类/标"
        >
        </pl-table-column>
        <pl-table-column
          prop="otherFeeAdditionalClass"
          label="杂费附加类/标"
        >
        </pl-table-column>
        <!--      </el-table-column>-->
      </pl-table-column>
      <pl-table-column
        label="公证认证及翻译费(RMB)"
      >
        <pl-table-column
          prop="abroadGzFee"
          label="境外公证及翻译费"
        >
        </pl-table-column>
        <pl-table-column
          prop="interGzFee"
          label="国内公证认证费"
        >
        </pl-table-column>
      </pl-table-column>
      <!--      <el-table-column-->
      <!--        prop="premium"-->
      <!--        label="溢价/类"-->
      <!--      >-->
      <!--      </el-table-column>-->
      <pl-table-column
        prop="whdServiceFee"
        label="万慧达代理费"
      >
      </pl-table-column>
      <pl-table-column
        prop="calculationDesc"
        label="事务所及裸价"
      >
        <template slot-scope="scope">
          <span :title="scope.row.calculationDesc">{{scope.row.calculationDesc}}</span>
        </template>
      </pl-table-column>
      <pl-table-column
        label="报价文件"
        width="120"
      >
        <template slot-scope="scope">
          <!--          <span :title="scope.row.remarks">{{scope.row.remarks}}</span>-->
          <div>
            <div>
              <div style="display: flex;align-items: flex-end">
                <!--                <span class="pointer ellipsis" style="flex: 1">文件名阿撒旦法撒旦法撒旦法撒旦发</span>-->
                <!--                                <span @click="delFile(scope.row, index)" class="el-icon-delete delBtn"-->
                <!--                                            style="font-size: 16px;margin-left: 3px;cursor: pointer;width: 20px;height: 20px;line-height: 20px;"></span>-->
                <el-popover
                  placement="left"
                  width="300"
                  trigger="hover"
                >
                  <div>
                    <div style="display: flex" v-for="(item, index) in (scope.row.materialArray.filter(i => i.materialTypeId != 301647) || [])" :key="index">
                      <span style="flex: 1" class="pointer ellipsis" :title="item.materialName" @click="preView(item)">{{item.materialName}}</span>
                      <span @click="delFile(item, index, scope.row.materialArray || [])" class="el-icon-delete delBtn"
                            style="font-size: 16px;margin-left: 3px;cursor: pointer;width: 20px;height: 20px;line-height: 20px;"></span>
                    </div>
                  </div>
                  <div slot="reference" style="">
                    <el-badge :value="scope.row.materialArray && scope.row.materialArray.filter(i => i.materialTypeId != 301647).length || 0"
                              style="margin-top: 10px">
                      <span style="font-size: 28px;margin-left: 3px;cursor: pointer;" class="el-icon-document"></span>
                    </el-badge>
                  </div>
                </el-popover>
                <el-upload
                  class="upload-demo"
                  ref="uploadFile"
                  multiple
                  :data="uploadFileData"
                  :action="creatematerialUrl"
                  name="attachFile"
                  :on-success="successCallback"
                  :show-file-list="false"
                  :auto-upload="true"
                >
                  <span style="font-size: 28px;margin-left: 25px;cursor: pointer;margin-bottom: 2px;"
                        class="el-icon-document-add" @click="addFile(scope.row, scope.$index)"></span>
                </el-upload>
              </div>
            </div>
            <!--            <div class="plusBtn"-->
            <!--                 @click="addFile(scope.row)">-->
            <!--              <span class="el-icon-plus"></span>-->
            <!--            </div>-->
          </div>
        </template>
      </pl-table-column>
      <pl-table-column
        label="注册申请文件"
        width="120"
      >
        <template slot-scope="scope">
          <!--          <span :title="scope.row.remarks">{{scope.row.remarks}}</span>-->
          <div>
            <div>
              <div style="display: flex;align-items: flex-end">
                <el-popover
                  placement="left"
                  width="300"
                  trigger="hover"
                >
                  <div>
                    <div style="display: flex" v-for="(item, index) in (scope.row.materialArray.filter(i => i.materialTypeId == 301647) || [])" :key="index">
                      <span style="flex: 1" class="pointer ellipsis" :title="item.materialName" @click="preView(item)">{{item.materialName}}</span>
                      <span @click="delFile(item, index, scope.row.materialArray || [])" class="el-icon-delete delBtn"
                            style="font-size: 16px;margin-left: 3px;cursor: pointer;width: 20px;height: 20px;line-height: 20px;"></span>
                    </div>
                  </div>
                  <div slot="reference" style="">
                    <el-badge :value="scope.row.materialArray && scope.row.materialArray.filter(i => i.materialTypeId == 301647).length || 0"
                              style="margin-top: 10px">
                      <span style="font-size: 28px;margin-left: 3px;cursor: pointer;" class="el-icon-document"></span>
                    </el-badge>
                  </div>
                </el-popover>
                <el-upload
                  class="upload-demo"
                  ref="uploadFile"
                  multiple
                  :data="uploadFileData1"
                  :action="creatematerialUrl"
                  name="attachFile"
                  :on-success="successCallback1"
                  :show-file-list="false"
                  :auto-upload="true"
                >
                  <span style="font-size: 28px;margin-left: 25px;cursor: pointer;margin-bottom: 2px;"
                        class="el-icon-document-add" @click="addFile(scope.row, scope.$index)"></span>
                </el-upload>
              </div>
            </div>
            <!--            <div class="plusBtn"-->
            <!--                 @click="addFile(scope.row)">-->
            <!--              <span class="el-icon-plus"></span>-->
            <!--            </div>-->
          </div>
        </template>
      </pl-table-column>
      <pl-table-column
        prop="isUseStr"
        label="是否可用"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.isUse === 1">是</span>
          <span v-if="scope.row.isUse === 2">否</span>
        </template>
      </pl-table-column>
      <pl-table-column
        label="顺利程序所需时长"
        prop="processTime"
      >
        <template slot-scope="scope">
          <span :title="scope.row.remarks">{{scope.row.processTime}}</span>
        </template>
      </pl-table-column>
      <pl-table-column
        label="申请所需文件/信息"
        prop="requiredInformation"
      >
        <template slot-scope="scope">
          <span :title="scope.row.remarks">{{scope.row.requiredInformation}}</span>
        </template>
      </pl-table-column>
      <pl-table-column
        label="特别提示"
        prop="specialDemand"
      >
        <template slot-scope="scope">
          <span :title="scope.row.remarks">{{scope.row.specialDemand}}</span>
        </template>
      </pl-table-column>
      <pl-table-column
        prop="remarks"
        label="备注"
      >
        <template slot-scope="scope">
          <span :title="scope.row.remarks">{{scope.row.remarks}}</span>
        </template>
      </pl-table-column>
      <pl-table-column
        prop="influenceFactor"
        label="影响报价的因素"
      >
        <template slot-scope="scope">
          <span :title="scope.row.influenceFactor">{{scope.row.influenceFactor}}</span>
        </template>
      </pl-table-column>
      <pl-table-column
        key="handle"
        label="操作"
        width="100px"
      >
        <template slot-scope="scope">
          <div v-if="isSorted">
            <span class="pointer" v-if="scope.$index != 0" @click="upMove(scope.$index)">上移</span>
            <span class="pointer" v-if="scope.$index != ZYtableData.length - 1"
                  @click="downMove(scope.$index)">下移</span>
          </div>
          <span style="display:block;cursor: pointer;color: #409eff;margin-right: 10px"
                @click="createAndEdit('copy', scope.$index, scope.row)" v-if="$store.getters.permissions.includes(296)">复制新建</span>
          <span style="display:block;cursor: pointer;color: #409eff;"
                @click="createAndEdit('edit', scope.$index, scope.row)" v-if="$store.getters.permissions.includes(296)">修改</span>
          <span style="display:block; cursor: pointer;color: #409eff;"
                @click="deleteOfferPrice(scope.row, scope.$index)"
                v-if="$store.getters.permissions.includes(296)">删除</span>
        </template>
      </pl-table-column>
    </pl-table>
    <pagination
      v-if="total"
      :total="total"
      :page.sync="listQuery.pageNo"
      :limit.sync="listQuery.pageSize"
      @pagination="queryOfferPrice"
      :pageSizes="pageSizesList"
    />


    <el-dialog
      :close-on-click-modal="false"
      :title="title"
      :append-to-body="true"
      :visible.sync="dialogView"
      width="70%"
      :before-close="handleClose">
      <el-form :model="rowData" size="small" class="form-container">
        <el-row class="first-row">
          <el-col :span="12">
            <el-form-item label="国家" class="postInfo-container-item">
              <!--              <el-input size="mini" v-model="rowData.countryCn"></el-input>-->
              <el-select style="width: 100%;" v-model="rowData.countryCn" placeholder="" filterable clearable>
                <el-option
                  v-for="item in countryList"
                  :key="item.countryCn"
                  :label="item.countryCn"
                  :value="item.countryCn">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="报价档位" class="postInfo-container-item">
              <el-select style="" v-model="rowData.priceLevel" placeholder="" clearable>
                <el-option
                  v-for="item in [{id: 0, label: '低档'}, {id: 1, label: '中档'}, {id: 2, label: '高档'}]"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="附加开始类/标(n+1)" class="postInfo-container-item">
              <el-input type="number" size="mini" v-model="rowData.additionalClassBegin"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="外代所:" class="postInfo-container-item">
              <el-select
                style="width: 100%;"
                default-first-option
                clearable
                placeholder="请选择"
                v-model="rowData.custId"
                filterable
                remote
                :remote-method="queryOtherCustomerListUrl"
                @change="changeCustId"
              >
                <el-option v-for="(item,key)  in hzLists" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商标种类:" class="postInfo-container-item">
              <el-radio-group v-model="rowData.picture">
                <el-radio :label="0">文字</el-radio>
                <el-radio :label="1">图形</el-radio>
                <el-radio :label="2">组合</el-radio>
                <el-radio :label="3">适用所有</el-radio>
                <el-radio :label="4">英文文字</el-radio>
                <el-radio :label="5">中文文字</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商标颜色:" class="postInfo-container-item">
              <el-radio-group v-model="rowData.colour">
                <el-radio :label="0">黑白</el-radio>
                <el-radio :label="1">彩色</el-radio>
                <el-radio :label="2">适用所有</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="fullRow">
          <el-col :span="12">
            <el-form-item label="报价规则" class="postInfo-container-item requireForm">
              <div style="display: flex;align-items: center">
                <el-radio-group v-model="rowData.offerType" @change="changeOfferType">
                  <el-radio :label="1">类</el-radio>
                  <el-radio :label="2">标</el-radio>
                </el-radio-group>
                <el-select clearable style="flex: 1;margin-left: 5px" default-first-option v-model="rowData.opRulesId"
                           placeholder>
                  <el-option
                    v-for="(item,key) in priceRuleList.filter(item => !rowData.offerType || item.offerType == rowData.offerType)"
                    :key="key" :label="item.rulesName"
                    :value="item.opRulesId"></el-option>
                </el-select>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="币种:" class="postInfo-container-item">
              <el-select default-first-option v-model="rowData.curId" placeholder
                         @change="(curId) => changeCurId(curId)">
                <el-option v-for="(item,key) in bzData" :key="key" :label="item.curName"
                           :value="item.curId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="汇率:" class="postInfo-container-item">
              <el-input
                type="text"
                v-model="rowData.exchangeRate"
                @change="handleExchangeRateChange([
                  {localKey: 'serviceFeeAdditionalClass', foreignKey: 'serviceFeeAdditionalClassForeign'},
                  {localKey: 'serviceFeeThirdClass', foreignKey: 'serviceFeeThirdClassForeign'},
                  {localKey: 'serviceFeeSpecialClass', foreignKey: 'serviceFeeSpecialClassForeign'},
                  {localKey: 'serviceFeeSecondClass', foreignKey: 'serviceFeeSecondClassForeign'},
                  {localKey: 'serviceFeeFirstClass', foreignKey: 'serviceFeeFirstClassForeign'},
                  {localKey: 'otherFeeAdditionalClass', foreignKey: 'otherFeeAdditionalClassForeign'},
                  {localKey: 'otherFeeFirstClass', foreignKey: 'otherFeeFirstClassForeign'},
                  {localKey: 'thirdClass', foreignKey: 'thirdClassForeign'},
                  {localKey: 'additionalClass', foreignKey: 'additionalClassForeign'},
                  {localKey: 'secondClass', foreignKey: 'secondClassForeign'},
                  {localKey: 'firstClass', foreignKey: 'firstClassForeign'},
                  {localKey: 'abroadGzFee', foreignKey: 'abroadGzFeeForeign'},
                  {localKey: 'interGzFee', foreignKey: 'interGzFeeForeign'},
                ])"></el-input>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="事务所及裸价" class="postInfo-container-item">
              <el-input size="mini" v-model="rowData.calculationDesc" type="textarea"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="影响报价的因素" class="postInfo-container-item">
              <el-input size="mini" v-model="rowData.influenceFactor" type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="fullRow">
          <el-col :span="12">
            <el-form-item label="是否可用" class="postInfo-container-item">
              <el-radio-group v-model="rowData.isUse">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="2">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="顺利程序所需时长" class="postInfo-container-item">
              <el-input size="mini" v-model="rowData.processTime" type="text"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="fullRow">
          <el-col :span="24">
            <el-form-item label="申请所需文件/信息" class="postInfo-container-item">
              <el-input size="mini" v-model="rowData.requiredInformation" type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="fullRow">
          <el-col :span="24">
            <el-form-item label="特别提示" class="postInfo-container-item">
              <el-input size="mini" v-model="rowData.specialDemand" type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="fullRow">
          <el-col :span="24">
            <el-form-item label="备注" class="postInfo-container-item">
              <el-input size="mini" v-model="rowData.remarks" type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label=" ">
              <span style="margin: 0 10px">是否联动更新同一国家其他外代所报价的:</span>
              <el-checkbox style="margin-left: 0;margin-right: 0;" v-model="rowData.updateFlag1" :true-label="1" :false-label="0">顺利程序所需时长</el-checkbox>
              <el-checkbox style="margin-left: 10px;margin-right: 0;" v-model="rowData.updateFlag2" :true-label="1" :false-label="0">申请所需文件/信息</el-checkbox>
              <el-checkbox style="margin-left: 10px;margin-right: 0;" v-model="rowData.updateFlag3" :true-label="1" :false-label="0">特别提示</el-checkbox>
              <el-checkbox style="margin-left: 10px;margin-right: 0;" v-model="rowData.updateFlag4" :true-label="1" :false-label="0">备注</el-checkbox>
              字段。
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="height: 30px;line-height: 30px;color: #409EFF;">
          <div style="display: flex;justify-content: space-between;width: 100%;">
            <span>官费</span>
          </div>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="官费首类/标(外币):" class="postInfo-container-item">
              <el-input v-model="rowData.firstClassForeign"
                        @change="handleExchangeRateChange([{localKey: 'firstClass', foreignKey: 'firstClassForeign'}])"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="官费首类/标(人民币):" class="postInfo-container-item">
              <el-input v-model="rowData.firstClass"></el-input>

            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="官费第2类/标(外币):" class="postInfo-container-item">
              <el-input v-model="rowData.secondClassForeign"
                        @change="handleExchangeRateChange([{localKey: 'secondClass', foreignKey: 'secondClassForeign'}])"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="官费第2类/标(人民币):" class="postInfo-container-item">
              <el-input v-model="rowData.secondClass"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="3~n类/标官费(外币)" class="postInfo-container-item">
              <el-input size="mini" v-model="rowData.thirdClassForeign"
                        @change="handleExchangeRateChange([{localKey: 'thirdClass', foreignKey: 'thirdClassForeign'}])"></el-input>

            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="3~n类/标官费(人民币)" class="postInfo-container-item">
              <el-input size="mini" v-model="rowData.thirdClass"></el-input>

            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="附加类/标官费(外币)" class="postInfo-container-item">
              <el-input size="mini" v-model="rowData.additionalClassForeign"
                        @change="handleExchangeRateChange([{localKey: 'additionalClass', foreignKey: 'additionalClassForeign'}])"></el-input>

            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="附加类/标官费(人民币)" class="postInfo-container-item">
              <el-input size="mini" v-model="rowData.additionalClass"></el-input>

            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="height: 30px;line-height: 30px;color: #409EFF"><span>代理费</span></el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="代理费首类/标(外币):" class="postInfo-container-item">
              <el-input v-model="rowData.serviceFeeFirstClassForeign"
                        @change="handleExchangeRateChange([{localKey: 'serviceFeeFirstClass', foreignKey: 'serviceFeeFirstClassForeign'}])"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="代理费首类/标(人民币):" class="postInfo-container-item">
              <el-input v-model="rowData.serviceFeeFirstClass"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="代理费第2类/标(外币):" class="postInfo-container-item">
              <el-input v-model="rowData.serviceFeeSecondClassForeign"
                        @change="handleExchangeRateChange([{localKey: 'serviceFeeSecondClass', foreignKey: 'serviceFeeSecondClassForeign'}])"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="代理费第2类/标(人民币):" class="postInfo-container-item">
              <el-input v-model="rowData.serviceFeeSecondClass"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="代理费3~n类/标(外币)" class="postInfo-container-item">
              <el-input size="mini" v-model="rowData.serviceFeeThirdClassForeign"
                        @change="handleExchangeRateChange([{localKey: 'serviceFeeThirdClass', foreignKey: 'serviceFeeThirdClassForeign'}])"></el-input>

            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="代理费3~n类/标(人民币)" class="postInfo-container-item">
              <el-input size="mini" v-model="rowData.serviceFeeThirdClass"></el-input>

            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="代理费每附加类/标(外币)" class="postInfo-container-item">
              <el-input size="mini" v-model="rowData.serviceFeeAdditionalClassForeign"
                        @change="handleExchangeRateChange([{localKey: 'serviceFeeAdditionalClass', foreignKey: 'serviceFeeAdditionalClassForeign'}])"></el-input>

            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="代理费每附加类/标(人民币)" class="postInfo-container-item">
              <el-input size="mini" v-model="rowData.serviceFeeAdditionalClass"></el-input>

            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="height: 30px;line-height: 30px;color: #409EFF"><span>杂费</span></el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="杂费首类/标(外币)" class="postInfo-container-item">
              <el-input size="mini" v-model="rowData.otherFeeFirstClassForeign"
                        @change="handleExchangeRateChange([{localKey: 'otherFeeFirstClass', foreignKey: 'otherFeeFirstClassForeign'}])"></el-input>

            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="杂费首类/标(人民币)" class="postInfo-container-item">
              <el-input size="mini" v-model="rowData.otherFeeFirstClass"></el-input>

            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="杂费每附加类/标(外币)" class="postInfo-container-item">
              <el-input size="mini" v-model="rowData.otherFeeAdditionalClassForeign"
                        @change="handleExchangeRateChange([{localKey: 'otherFeeAdditionalClass', foreignKey: 'otherFeeAdditionalClassForeign'}])"></el-input>

            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="杂费每附加类/标(人民币)" class="postInfo-container-item">
              <el-input size="mini" v-model="rowData.otherFeeAdditionalClass"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="height: 30px;line-height: 30px;color: #409EFF"><span>公证认证费</span></el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="国内公/认证费(外币)" class="postInfo-container-item">
              <el-input size="mini" v-model="rowData.interGzFeeForeign"
                        @change="handleExchangeRateChange([{localKey: 'interGzFee', foreignKey: 'interGzFeeForeign'}])"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="国内公/认证费(人民币)" class="postInfo-container-item">
              <el-input size="mini" v-model="rowData.interGzFee"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="境外公/认证及翻译费(外币)" class="postInfo-container-item">
              <el-input size="mini" v-model="rowData.abroadGzFeeForeign"
                        @change="handleExchangeRateChange([{localKey: 'abroadGzFee', foreignKey: 'abroadGzFeeForeign'}])"></el-input>

            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="境外公/认证及翻译费(人民币)" class="postInfo-container-item">
              <el-input size="mini" v-model="rowData.abroadGzFee"></el-input>

            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="height: 30px;line-height: 30px;color: #409EFF"><span>超项费</span></el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="超项费(外币)" class="postInfo-container-item">
              <el-input size="mini" v-model="rowData.overchargeFeeForeign"
                        @change="handleExchangeRateChange([{localKey: 'overchargeFee', foreignKey: 'overchargeFeeForeign'}])"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="超项费(人民币)" class="postInfo-container-item">
              <el-input size="mini" v-model="rowData.overchargeFee"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="超项费说明" class="postInfo-container-item">
              <el-input size="mini" v-model="rowData.overchargeDesc"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <span slot="footer" class="fl-ac-jc">
        <el-button size="mini" @click="handleClose">取 消</el-button>
        <el-button size="mini" type="primary" @click="confirmBtn">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      title="文件设置"
      :append-to-body="true"
      :visible.sync="uploadFileSetView"
      width="30%"
      :before-close="handleFileDialogClose"
    >
      <el-form size="mini" label-width="150px">
        <el-row>
          <el-form-item label="适用案件类型:">
            <el-select style="width: 50%;" v-model="caseTypeIdList" placeholder="" filterable clearable multiple>
              <el-option
                v-for="item in [{id: 185, label: '注册申请'}, {id: 31, label: '转让'}, {id: 52, label: '查询'}, {id: 33, label: '续展'}, {id: 30, label: '变名变址'}]"
                :key="item.id"
                :label="item.label"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="是否同步到内外资料:">
            <el-radio v-model="neiwaiSyn" :label="1">同步</el-radio>
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer" class="fl-ac-jc">
        <el-button size="mini" @click="handleFileDialogClose">取 消</el-button>
        <el-button size="mini" type="primary" @click="copyFileSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {creatematerialUrl} from "@/api/serviceApi.config.js";
  import {
    copyOfferPrice,
    queryOfferPrice,
    queryOfferPriceSome,
    queryOfferCountries,
    modifyOfferPriceSome,
    modifyOfferPrice,
    createOfferPrice,
    deleteOfferPrice,
    queryCurrencyUrl
  } from '@/api/billApi'
  import {queryCountry, queryOtherCustomerListUrl} from '@/api/caseDetail'
  import Pagination from '@/components/Pagination'
  import {batchModifyPriceSortNo, queryOfferCurrency, queryOfferPriceRules} from '../../../../api/billApi'
  import {getProgID} from "../../../../utils/editInOffice";
  import {deleteMaterial} from "../../../../api/customerList";
  import {copyMaterial} from "../../../../api/caseList";

  export default {
    name: 'ZYdetail',
    components: {
      Pagination
    },
    computed: {
      isSorted() {
        // if (this.postForm.caseTypeId == 30) { // 有变更类型
        //   if (this.picture && this.colour && this.priceLevel && this.postForm.countryCn && this.postForm.caseTypeId && this.postForm.changeType && this.postForm.WHDFee) {
        //     return true
        //   }
        //   return false
        // } else {
        //   if ((this.picture || this.picture === 0) && (this.colour || this.colour === 0) && (this.priceLevel || this.priceLevel === 0) && this.postForm.countryCn && this.postForm.caseTypeId && this.postForm.WHDFee) {
        //     return true
        //   }
        //   return false
        // }
        // 任务7115
        if ((this.picture || this.picture === 0) && (this.colour || this.colour === 0) && (this.priceLevel || this.priceLevel === 0) && this.postForm.countryCn && this.postForm.caseTypeId && this.postForm.WHDFee) {
          if (this.postForm.caseTypeId == 30) {
            if (this.postForm.changeType) {
              return true
            } else {
              return false
            }
          } else {
            return true
          }
        }
        return false
      }
    },
    data() {
      return {
        fileType: '',
        neiwaiSyn: 0,
        caseTypeIdList: [],
        fileList: [],
        uploadFileSetView: false,
        creatematerialUrl,
        uploadFileData: {
          opIndex: 0,
          objType: 1136,
          tokenID: this.$store.getters.token
        },
        uploadFileData1: {
          opIndex: 0,
          objType: 1136,
          materialTypeId: 301647,
          tokenID: this.$store.getters.token
        },
        priceRuleList: [],
        hzLists: [],
        bzData: [],
        picture: 0,
        colour: 0,
        priceLevel: 0,
        listQuery: {
          pageSize: 10,
          pageNo: 1
        },
        pageSizesList: [10, 50, 100, 200, 300, 400, 500],
        total: 0,
        currentRowIndex: -1,
        title: '',
        rowData: {
          isUse: 1,
          opRulesId: '',
          countryCn: '',
          firstClass: '',
          otherFeeAdditionalClass: '',
          additionalClass: '',
          serviceFeeFirstClass: '',
          serviceFeeAdditionalClass: '',
          otherFeeFirstClass: '',
          abroadGzFee: '',
          nterGzFee: ''
        },
        dialogView: false,
        countryList: [],
        ZYtableData: [],
        postForm: {
          caseTypeId: 185,
          countryCn: '',
          YJFee: '',
          WHDFee: '',
          changeType: ''
        }
      }
    },
    created() {
      this.queryOfferCountries()
      this.queryOfferPrice()
      this.queryOfferPriceSome()

      this.queryCurrency()

      this.queryOfferPriceRules()
    },
    methods: {
      upMove(index) {
        const data = this.ZYtableData[index]
        this.ZYtableData.splice(index, 1)
        this.ZYtableData.splice(index - 1, 0, data)
        batchModifyPriceSortNo({
          offerPriceSorts: this.ZYtableData.map((item, idx) => ({
            opId: item.opId,
            sortNo: idx + 1
          }))
        }).then(res => {
          this.$message.success('移动成功！')
        })
      },
      downMove(index) {
        const data = this.ZYtableData[index]
        this.ZYtableData.splice(index, 1)
        this.ZYtableData.splice(index + 1, 0, data)
        batchModifyPriceSortNo({
          offerPriceSorts: this.ZYtableData.map((item, idx) => ({
            opId: item.opId,
            sortNo: idx + 1
          }))
        }).then(res => {
          this.$message.success('移动成功！')
        })
      },
      changeCaseType(value) {
        if (value != 30) {
          this.postForm.changeType = ''
        }
        this.queryOfferPriceSome(value)
        this.queryOfferPrice(true)
      },
      copyFileSubmit() {
        copyMaterial({
          materialIdList: this.fileList.map(item => item.response.data[0].materialId),
          opId: this.ZYtableData[this.uploadFileData.opIndex].opId,
          caseTypeIdList: this.caseTypeIdList,
          neiwaiSyn: this.neiwaiSyn && this.fileType == '注册申请' ? 2 : this.neiwaiSyn
        }).then(res => {
          this.handleFileDialogClose()
          this.$message.success('操作成功!')
        }).catch(() => {
          this.$message.success('操作失败!')
        })
      },
      handleFileDialogClose() {
        this.uploadFileSetView = false
        this.caseTypeIdList = []
        this.fileList = []
        this.neiwaiSyn = 0
      },
      preView(data) {
        let url = data.address
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
          this.$commonUtils.downLoadAll({url: `ipdoc${url}`})
        }
      },
      successCallback(res, file, fileList) {
        this.fileList.push(file)
        if (!this.ZYtableData[this.uploadFileData.opIndex].materialArray || this.ZYtableData[this.uploadFileData.opIndex].materialArray && !this.ZYtableData[this.uploadFileData.opIndex].materialArray.length) {
          this.$set(this.ZYtableData[this.uploadFileData.opIndex], 'materialArray', [res.data.map(item => ({
            materialName: item.materialName,
            url: item.address,
            address: item.address,
            materialId: item.materialId,
          }))[0]])
        } else {
          this.ZYtableData[this.uploadFileData.opIndex].materialArray.push(res.data.map(item => ({
            materialName: item.materialName,
            url: item.address,
            address: item.address,
            materialId: item.materialId,
          }))[0])
        }
        this.uploadFileSetView = true
        this.$message.success('文件上传成功!')

      },
      successCallback1(res, file, fileList) {
        this.fileList.push(file)
        if (!this.ZYtableData[this.uploadFileData1.opIndex].materialArray || this.ZYtableData[this.uploadFileData1.opIndex].materialArray && !this.ZYtableData[this.uploadFileData1.opIndex].materialArray.length) {
          this.$set(this.ZYtableData[this.uploadFileData1.opIndex], 'materialArray', [res.data.map(item => ({
            materialName: item.materialName,
            url: item.address,
            address: item.address,
            materialId: item.materialId,
          }))[0]])
        } else {
          this.ZYtableData[this.uploadFileData1.opIndex].materialArray.push(res.data.map(item => ({
            materialName: item.materialName,
            url: item.address,
            address: item.address,
            materialId: item.materialId,
            materialTypeId: item.materialTypeId
          }))[0])
        }
        this.uploadFileSetView = true
        this.fileType = '注册申请'
        this.$message.success('文件上传成功!')

      },
      delFile(row, index, list) {
        const delmaterialId = row.materialId
        deleteMaterial({materialId: delmaterialId}).then(res => {
          this.$message.success('删除文件成功!')
          list.splice(list.findIndex(item => item.materialId == delmaterialId), 1)
        })
      },
      addFile(row, index) {
        this.uploadFileData.objInstId = row.opId
        this.uploadFileData1.objInstId = row.opId
        this.uploadFileData.opIndex = index // 标识当前上传文件的行数
        this.uploadFileData1.opIndex = index // 标识当前上传文件的行数
      },
      changeOfferType(v) {
        this.rowData.opRulesId = this.priceRuleList.filter(item => item.offerType == v)[0].opRulesId
      },
      queryOfferPriceRules() {
        queryOfferPriceRules().then(res => {
          this.priceRuleList = res.data
        })
      },
      changeCustId(v) {
        if (v && this.hzLists.find(item => item.value == v)) {
          this.rowData.custIdStr = this.hzLists.find(item => item.value == v).label
        }
      },
      queryOtherCustomerListUrl(v) {
        v && queryOtherCustomerListUrl({fullname: v})
          .then(response => {
            this.hzLists = response.data
            this.hzLists.forEach(item => {
              item.label = item.fullname
              item.value = item.custId
            })
          })
      },
      handleExchangeRateChange(arr) {
        arr.forEach(item => {
          !this.rowData[item.foreignKey] && this.$set(this.rowData, item.localKey, '')
          this.rowData[item.foreignKey] && this.rowData.exchangeRate && this.$set(this.rowData, item.localKey, Math.ceil((this.rowData[item.foreignKey] || 0) * (this.rowData.exchangeRate || 0) / 100 / 100) * 100)
        })
      },
      changeCurId(curId) {
        this.$set(this.rowData, 'exchangeRate', this.bzData.find(i => i.curId == curId).exchangeRate)
        this.handleExchangeRateChange([
          {localKey: 'serviceFeeAdditionalClass', foreignKey: 'serviceFeeAdditionalClassForeign'},
          {localKey: 'serviceFeeThirdClass', foreignKey: 'serviceFeeThirdClassForeign'},
          {localKey: 'serviceFeeSpecialClass', foreignKey: 'serviceFeeSpecialClassForeign'},
          {localKey: 'serviceFeeSecondClass', foreignKey: 'serviceFeeSecondClassForeign'},
          {localKey: 'serviceFeeFirstClass', foreignKey: 'serviceFeeFirstClassForeign'},
          {localKey: 'otherFeeAdditionalClass', foreignKey: 'otherFeeAdditionalClassForeign'},
          {localKey: 'otherFeeFirstClass', foreignKey: 'otherFeeFirstClassForeign'},
          {localKey: 'thirdClass', foreignKey: 'thirdClassForeign'},
          {localKey: 'additionalClass', foreignKey: 'additionalClassForeign'},
          {localKey: 'secondClass', foreignKey: 'secondClassForeign'},
          {localKey: 'firstClass', foreignKey: 'firstClassForeign'},
          {localKey: 'abroadGzFee', foreignKey: 'abroadGzFeeForeign'},
          {localKey: 'interGzFee', foreignKey: 'interGzFeeForeign'}
        ])
      },
      queryCurrency() {
        queryOfferCurrency().then(res => {
          this.bzData = res.data
        })
      },
      deleteOfferPrice(row, index) {
        this.$wangConfirm('确定删除吗？', () => {
          deleteOfferPrice({
            opId: row.opId
          }).then(res => {
            this.$message.success('删除成功!')
            this.ZYtableData.splice(index, 1)
            this.total--
          })
        }, () => {
          this.$message.info('已取消删除')
        })
      },
      createAndEdit(flag, index, row) {
        if (flag == 'create') {
          this.dialogView = true
          this.title = '新建'
          this.rowData = {
            isUse: 1,
            opRulesId: '',
            countryCn: '',
            firstClass: '',
            otherFeeAdditionalClass: '',
            additionalClass: '',
            serviceFeeFirstClass: '',
            serviceFeeAdditionalClass: '',
            otherFeeFirstClass: '',
            abroadGzFee: '',
            nterGzFee: '',
            updateFlag1: 1,
            updateFlag2: 1,
            updateFlag3: 1,
            updateFlag4: 1,
          }
        } else if (flag == 'edit') {
          this.currentRowIndex = index
          this.dialogView = true
          this.title = '修改'
          this.rowData = JSON.parse(JSON.stringify(row))
          this.rowData.custId = +this.rowData.custId
          this.$set(this.rowData, 'updateFlag1', 1)
          this.$set(this.rowData, 'updateFlag2', 1)
          this.$set(this.rowData, 'updateFlag3', 1)
          this.$set(this.rowData, 'updateFlag4', 1)
          if (this.rowData.custIdStr) {
            this.hzLists = [{
              label: this.rowData.custIdStr,
              value: this.rowData.custId
            }]
            // this.queryOtherCustomerListUrl(this.rowData.custIdStr)
          }
        } else {
          copyOfferPrice({
            opId: row.opId
          }).then(res => {
            this.dialogView = true
            this.title = '复制新建'
            this.rowData = res.data
            this.$set(this.rowData, 'updateFlag1', 1)
            this.$set(this.rowData, 'updateFlag2', 1)
            this.$set(this.rowData, 'updateFlag3', 1)
            this.$set(this.rowData, 'updateFlag4', 1)
            if (this.rowData.custIdStr) {
              this.hzLists = [{
                label: this.rowData.custIdStr,
                value: this.rowData.custId
              }]
              // this.queryOtherCustomerListUrl(this.rowData.custIdStr)
            }
          })
        }
        if (!this.rowData.additionalClassBegin && this.rowData.additionalClassBegin !== 0) {
          this.$set(this.rowData, 'additionalClassBegin', 4)
        }
      },
      confirmBtn() {
        if (!this.rowData.opRulesId) {
          this.$message.error('请选择报价规则!')
          return
        }
        if (this.title == '复制新建') {
          modifyOfferPrice({
            ...this.rowData
          }).then(res => {
            this.$message.success('新建成功!')
            // this.ZYtableData.splice(this.currentRowIndex, 1, this.rowData)
            this.handleClose(true)
          })
        } else if (this.title == '修改') {
          const nullAttrChangeList = [
            'firstClassForeign',
            'firstClass',
            'secondClassForeign',
            'secondClass',
            'thirdClassForeign',
            'thirdClass',
            'additionalClassForeign',
            'additionalClass',
            'serviceFeeFirstClassForeign',
            'serviceFeeFirstClass',
            'serviceFeeSecondClassForeign',
            'serviceFeeSecondClass',
            'serviceFeeThirdClassForeign',
            'serviceFeeThirdClass',
            'serviceFeeAdditionalClassForeign',
            'serviceFeeAdditionalClass',
            'otherFeeFirstClassForeign',
            'otherFeeFirstClass',
            'otherFeeAdditionalClassForeign',
            'otherFeeAdditionalClass',
            'interGzFeeForeign',
            'interGzFee',
            'abroadGzFeeForeign',
            'abroadGzFee'
          ]
          this.$commonUtils.nullAttrChangeTo0(this.rowData, nullAttrChangeList)
          modifyOfferPrice({
            ...this.rowData
          }).then(res => {
            this.$message.success('修改成功!')
            this.ZYtableData.splice(this.currentRowIndex, 1, this.rowData)
            this.handleClose()
          })

        } else {
          createOfferPrice({
            ...this.rowData,
            caseTypeId: this.postForm.caseTypeId,
            changeType: this.postForm.changeType || undefined
          }).then(res => {
            this.$message.success('创建成功!')
            this.queryOfferPrice(true)
            this.handleClose()
          })
        }
      },
      handleClose(search) {
        this.dialogView = false
        this.currentRowIndex = -1
        search === true && this.queryOfferPrice()
      },
      changeYJ(priceValue, priceType) {
        if (priceValue) {
          modifyOfferPriceSome({
            caseTypeId: this.postForm.caseTypeId,
            priceType,
            priceValue
          }).then(res => {
            this.$message.success('修改成功!')
            this.ZYtableData.length && this.ZYtableData.forEach(item => {
              priceType == 1 ? item.premium = priceValue : item.whdServiceFee = priceValue
            })
          })
        }
      },
      queryOfferCountries() {
        queryCountry({
          madrid: 0
        }).then(res => {
          this.countryList = res.data
        })
      },
      queryOfferPriceSome(v) {
        queryOfferPriceSome({caseTypeId: v}).then(res => {
          this.postForm.YJFee = res.data.filter(item => item.priceType == 1)[0] && res.data.filter(item => item.priceType == 1)[0].priceValue
          this.postForm.WHDFee = res.data.filter(item => item.priceType == 2)[0] && res.data.filter(item => item.priceType == 2)[0].priceValue
        })
      },
      queryOfferPrice(resetPageNo) {
        resetPageNo === true && (this.listQuery.pageNo = 1)
        queryOfferPrice({
          caseTypeId: this.postForm.caseTypeId,
          countryCn: this.postForm.countryCn,
          ...this.listQuery,
          picture: this.picture,
          colour: this.colour,
          priceLevel: this.priceLevel,
          changeType: this.postForm.changeType || undefined
        }).then(res => {
          this.ZYtableData = res.data
          this.total = res.total
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  > > > .el-input__inner {
    height: 30px;
    line-height: 30px;
  }

  > > > .cell {
    text-align: center;
  }

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
      width: 200px;
      text-align: right;
      flex-shrink: 0;
    }

    /deep/ .el-form-item {
      border-right: 1px solid #d7d7d7;
      margin: 0px !important;
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
      /*width: 77%;*/
    }

    /deep/ td .el-input,
    /deep/ td .el-select {
      width: 100%;
    }

    /deep/ .el-form-item__content {
      text-align: left;
      word-break: break-word;
      // height: 30px;
    }

    .fullRow {
      /deep/ .el-form-item__label {
        /*width: 15%;*/
        width: 200px;
        flex-shrink: 0;
      }

      /deep/ .el-input,
      /deep/ .el-select {
        /*width: 30%;*/
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
        padding: 0px 15px;
      }

      /deep/ .el-form-item__label {
        line-height: 28px;
      }
    }
  }

  > > > .el-table {
    height: auto;

    .cell {
      max-height: 70px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 4;
      overflow: hidden;
    }
  }

  .requireForm /deep/ .el-form-item__label:before {
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
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

  > > > .plTable {
    .el-table__body-wrapper {
      max-height: calc(100vh - 550px);
      overflow: auto;
    }

    /*.el-table__fixed-right {*/
    /*  overflow: auto;*/
    /*}*/
  }
</style>
