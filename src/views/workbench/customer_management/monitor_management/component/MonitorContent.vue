<template>
  <div>
    <div class="topSearch">
      <el-select style="margin-bottom: 10px" size="mini" default-first-option :clearable='true'
                 v-model="queryData.custName"
                 no-match-text='暂无数据' @change="queryList(1)"
                 filterable clearable reserve-keyword placeholder="选择客户"
      >
        <el-option v-for="(item,key) in custListMerge" :key="key" :label="item.fullname"
                   :value="item.fullname">
        </el-option>
      </el-select>
      <el-input clearable style="width: 180px;margin-left: 10px" placeholder="商标号/监控内容" size="mini"
                @change="queryList(1)"
                v-model="queryData.monitorItem"
      >
      </el-input>
      <el-select clearable size="mini" style="margin-left: 10px" @change="queryList(1)" default-first-option
                 v-model="queryData.wkgId" clearable
                 filterable placeholder="工作组">
        <el-option
            v-for="item in workgroupNamesList"
            :key="item.wkgId"
            :label="item.groupName"
            :value="item.wkgId">
        </el-option>
      </el-select>
      <el-select @change="queryList(1)" size="mini" style="margin-left: 10px;width: 120px" default-first-option
                 v-model="queryData.template"
                 clearable filterable placeholder="模板类型">
        <el-option
            v-for="item in [{label: '中文', value: 2}, {label: '英文', value: 1}]"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-select @change="queryList(1)" size="mini" style="margin-left: 10px;width: 120px" default-first-option
                 v-model="queryData.monitorType"
                 clearable filterable placeholder="监控类型">
        <el-option
            v-for="item in [{label: '文字', value: 1}, {label: '图形', value: 2}, {label: '主体', value: 3}, {label: '送达', value: 4}]"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-select @change="queryList(1)" size="mini" style="margin-left: 10px;width: 120px" default-first-option
                 v-model="queryData.supplier"
                 clearable filterable placeholder="供应商">
        <el-option
            v-for="item in supplierList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <div class="fl-ac-jc">
        <el-select @change="queryList(1)" size="mini" style="margin-left: 10px;width: 120px" default-first-option
                   v-model="queryData.orderRule"
                   clearable filterable placeholder="排序字段">
          <el-option
              v-for="item in [
            {label: '模板', value: 'template'},
             {label: '起始期号', value: 'startIssue'},
              {label: '截至期号', value: 'endIssue'},
               {label: '不监控', value: 'state'},
               {label: '监控类型', value: 'monitorType'}
               ]"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
        <el-button @click="clickSort('asc')" v-if="queryData.sort === 'desc'"
                   style="height: 28px;margin-left: 5px" type="primary" size="mini">
          <span class="el-icon-sort-up"></span>
          升序
        </el-button>
        <el-button @click="clickSort('desc')" v-else
                   style="height: 28px;margin-left: 5px" type="primary" size="mini">
          <span class="el-icon-sort-down"></span>
          倒序
        </el-button>
      </div>
      <div class="fl-ac-jc" style="margin-left: 25px;">
        <el-switch
            v-model="queryData.state"
            active-color="#13ce66"
            inactive-color="#DCDFE6"
            active-text="包括已停止"
            @change="queryList(1)"
        >
        </el-switch>
      </div>
      <div class="fl-ac-jc" style="margin-left: 25px;margin-bottom: 10px">
        <el-button style="height: 28px;margin-left: 5px" type="primary" size="mini" @click="addMonitor">
          <span class="el-icon-upload"></span>
          新建
        </el-button>
        <el-button style="height: 28px;margin-left: 5px" type="danger" size="mini" @click="stopMonitor">
          <span class="fl-ac-jc">
            <img src="./stop.svg" width="13" height="13" alt="">
            <span style="margin-left: 2px">停止</span>
          </span>
        </el-button>
        <el-button type="success" size="mini" @click="restoreBatch">
              <span class="el-icon-refresh" title="恢复">
              </span>
          恢复
        </el-button>
        <el-button type="primary" size="mini" @click="patchEdit">
          <span class="el-icon-edit-outline"></span>
          批量修改通知人
        </el-button>
      </div>
      <div class="export">
        <el-button type="text" @click="exportList(2)">导出</el-button>
        <span style="color: #52A2F4;margin: 0 5px"> / </span>
        <el-button type="text" @click="exportList(1)">全局导出</el-button>
      </div>
    </div>
    <el-table
        ref="tableList"
        :key="tableKeyOut"
        border
        :row-class-name="({row, rowIndex}) => tableRowClassName({row, rowIndex})"
        :data="monitorList"
        empty-text="暂无数据"
        highlight-current-row
        current-row-key
        :height="clientHeight"
        @select="handleSelectionChange"
        @select-all="handleSelectionAll"
        @header-dragend="(newWidth, oldWidth, column, event) => {headerDrage(newWidth, oldWidth, column)}"
        @sort-change="sortChangeOut"
        @filter-change="sortChangeOut"
    >
      <el-table-column
          type="index"
          width="60"
          align="left"
          label="序号"
      >
      </el-table-column>
      <el-table-column
          type="selection"
          width="50"
          class="selection"
      >
      </el-table-column>
      <el-table-column
          v-for="(item,index) in tableDefaultList"
          :key="item.value"
          :width="item.width"
          sortable
          :sort-method="(a, b) => $commonUtils.sort(a[item.value], b[item.value])"
          :label="item.title"
          align="left"
          :prop="item.value"
          :filters="tableHeadFilters[item.value]"
          :filter-method="filterHandler"
      >
        <template slot-scope="scope">
          <div v-if="item.value === 'state'">
            {{ scope.row[item.value] ? '否' : '是' }}
          </div>
          <div v-else-if="item.value === 'fuzzy'">
            {{
              fuzzyList.find(i => i.value === scope.row[item.value]) && fuzzyList.find(i => i.value ===
                  scope.row[item.value]).label
            }}
          </div>
          <div v-else-if="item.value === 'imgUrL'">
            <img v-if="scope.row[item.value]" class="filterTableTmg"
                 :src="scope.row[item.value].includes('http') ? scope.row[item.value] : `ipdoc${scope.row[item.value]}`"
                 width="32"
                 height="32">
            <img v-else class="filterTableTmg" src="./picFail.svg" width="32" height="32" alt="">
          </div>
          <div v-else class="ellipsis1" :title="scope.row[item.value]">{{ scope.row[item.value] }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="120" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <div style="display: flex;;">
            <el-button type="primary" size="mini" @click="editMonitor(scope.row)">
              <span class="el-icon-edit"></span>
            </el-button>
            <el-button type="danger" size="mini" v-if="scope.row.state" @click="stopMonitorSingle(scope.row)">
              <span class="fl-ac-jc">
                <img src="./stop.svg" width="13" height="13" alt="" title="停止">
              </span>
            </el-button>
            <el-button type="success" size="mini" v-else @click="restoreSingle(scope.row)">
              <span class="fl-ac-jc el-icon-refresh" title="恢复">
              </span>
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.pageNo"
        :limit.sync="listQuery.pageSize"
        @pagination="queryList"
        :pageSizes="pageSizesList"
    />
    <el-dialog
      v-if="editComradesView"
      title="批量修改通知人"
      center
      :fullscreen="false"
      :show-close="true"
      :close-on-click-modal="false" 
      :modal="true"
      :visible.sync="editComradesView"
      width="30%"
      destroy-on-close
      class="abow_dialog"
    >
    <el-form ref="comradesForm" size="mini" label-width="100px" :rules="comradesRules" :model="comradesData">
      <el-form-item label="工作组:" prop="wkgId">
        <el-select style="width: 100%;" clearable size="mini" 
          default-first-option @change="(value)=>queryUserByGroupName(value,'patchedit')"
          v-model="comradesData.wkgId" clearable
          filterable placeholder="请选择工作组">
          <el-option
              v-for="item in workgroupNamesList"
              :key="item.wkgId"
              :label="item.groupName"
              :value="item.wkgId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="通知人管理:">
          <virtual-select class="virtual-select" :isUser="true" 
            clearable multiple :data="$store.getters.userList"
            v-model="comradesData.userIdList" filterable
            :render="(data)=>$commonUtils.UserRender(data,this)">
          </virtual-select>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer fl-ac-jc">
      <el-button size="small" @click="closeComradesEdit">取 消</el-button>
      <el-button size="small" type="primary"
                @click="submitComradesEdit">确 认</el-button>
    </span>
    </el-dialog>

    <el-dialog
        v-if="monitorView"
        :title="title + '监控内容'"
        center
        :fullscreen="false" :show-close="true"
        :close-on-click-modal="false" :modal="true"
        :visible.sync="monitorView"
        width="60%"
        destroy-on-close
        class="abow_dialog"
        :before-close="() => closeDialog(false)"
    >
      <el-form ref="postForm" size="mini" label-width="100px" :rules="rules" :model="monitorData">
        <el-row>
          <el-col :span="12">
            <el-form-item label="客户名称:" :prop="monitorData.special ? '' : 'custId'">
              <el-select size="mini" default-first-option :clearable='true' v-model="monitorData.custId"
                         no-match-text='暂无数据'
                         loading-text='正在查询' filterable remote reserve-keyword placeholder="请输入客户名称"
                         :remote-method="remotepaternalUnit1">
                <el-option v-for="(item,key) in custArray" :key="key" :label="item.fullname"
                           :value="item.custId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="监控类型:" prop="monitorType">
              <el-select size="mini" default-first-option
                         v-model="monitorData.monitorType"
                         @change="changeMonitorType"
                         clearable filterable placeholder="监控类型">
                <el-option
                    v-for="item in [{label: '文字', value: 1}, {label: '图形', value: 2}, {label: '主体', value: 3}, {label: '送达', value: 4}]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="模板:" :prop="monitorData.special ? '' : 'template'">
              <el-select size="mini" default-first-option
                         v-model="monitorData.template"
                         clearable filterable placeholder="模板类型">
                <el-option
                    v-for="item in [{label: '中文', value: 2}, {label: '英文', value: 1}]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商:">
              <el-select size="mini" default-first-option
                         v-model="monitorData.supplier" :disabled="!!monitorData.monitorType"
                         clearable filterable placeholder="供应商">
                <el-option
                    v-for="item in supplierList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!--          <el-col :span="12">-->
          <!--            <el-form-item label="近似度:" :prop="[1, 2, 4].includes(monitorData.monitorType) ? '' : 'fuzzy'">-->
          <!--              <el-select size="mini" default-first-option-->
          <!--                         v-model="monitorData.fuzzy"-->
          <!--                         clearable filterable placeholder="请选择近似度">-->
          <!--                <el-option-->
          <!--                  v-for="item in fuzzyList"-->
          <!--                  :key="item.value"-->
          <!--                  :label="item.label"-->
          <!--                  :value="item.value">-->
          <!--                </el-option>-->
          <!--              </el-select>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <el-col :span="12" v-if="monitorData.monitorType == 1">
            <el-form-item label="近似查询:">
              <el-popover
                  popper-class="popper"
                  placement="bottom-start"
                  trigger="click"
              >
                <!--                <el-checkbox v-model="isAllCheck">全选</el-checkbox>-->
                <div style="display: flex;border-bottom: 1px solid #EAEAEA;">
                  <div style="width: 350px;display: flex;flex-direction: row;flex-shrink: 0;flex-wrap: wrap">
                    <div v-for="(item, index) in jsConfigData" :key="index"
                         :style="{color: item.isCheck ? '#409EFF' : '#606266'}"
                         style="height: 40px;line-height: 40px;text-align: center;cursor: pointer;margin-right: 15px"
                         @click="clickConfig(item)">
                      {{ item.label }}
                    </div>
                  </div>
                  <div style="display: flex;flex-direction: column;">
                    <div style="height: 40px;line-height: 40px;cursor:pointer;">
                      <el-button round @click="checkAllJsConfig">全选</el-button>
                    </div>
                    <div style="height: 40px;line-height: 40px;cursor: pointer">
                      <el-button round @click="resetJsConfig">重置</el-button>
                    </div>
                  </div>
                </div>
                <div style="display: flex;height: 40px;align-items: center">
                  <div style="margin-right: 10px;">指定含于其他:</div>
                  <el-checkbox-group v-model="checkJsConfigList" @change="changeJsConfig">
                    <el-checkbox v-for="(item, index) in jsConfigData1" :label="item.value">{{ item.label }}
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
                <el-input slot="reference" clearable placeholder="请选择近似查询" size="mini"
                          v-model="jsConfigObjList.map(item => item.label).join(',')" readonly
                ></el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商标号:">
              <el-input clearable placeholder="请填写商标号" size="mini"
                        v-model="monitorData.regNumber"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="监控内容:" prop="monitorItem">
              <el-input :disabled="title === '修改'" clearable placeholder="请填写监控内容" size="mini" type="textarea"
                        :rows="3"
                        v-model="monitorData.monitorItem"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="监控说明:">
              <el-input clearable placeholder="此处可以填写对监控的特殊要求" size="mini" type="textarea" :rows="3"
                        v-model="monitorData.monitorDescription"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="重点类别:" prop="">
              <el-popover
                  popper-class="popper"
                  placement="bottom-start"
                  trigger="click"
                  width="400"
              >
                <el-checkbox v-model="isAllCheck">全选</el-checkbox>
                <div class="classNumber">
                  <div v-for="number in 45" :style="{
                    backgroundColor: checkNumberList.find(item => item == number) ? '#2CC667' : '#fff',
                    color: checkNumberList.find(item => item == number) ? '#1E92F0' : '',
                    fontWeight: checkNumberList.find(item => item == number) ? 'bold' : '',
                     }" :key="number" @click="clickClassNumber(number)">
                    {{ number }}
                  </div>
                </div>
                <el-input slot="reference" clearable placeholder="全类监控不填" size="mini"
                          v-model="monitorData.keyCategories" readonly
                ></el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="忽略类别:">
              <el-popover
                  placement="bottom"
                  title="标题"
                  width="400"
                  trigger="click"
              >
                <el-checkbox v-model="isAllCheck1">全选</el-checkbox>
                <div class="classNumber">
                  <div v-for="number in 45" :style="{
                    backgroundColor: checkNumberList1.find(item => item == number) ? '#2CC667' : '#fff',
                    color: checkNumberList1.find(item => item == number) ? '#1E92F0' : '',
                    fontWeight: checkNumberList1.find(item => item == number) ? 'bold' : '',
                     }" :key="number" @click="clickClassNumber1(number)">
                    {{ number }}
                  </div>
                </div>
                <el-input slot="reference" clearable placeholder="全类监控不填" size="mini"
                          v-model="monitorData.ignoreCategories" readonly
                ></el-input>
              </el-popover>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="起始期号:" prop="startIssue">
              <el-input clearable placeholder="请填写起始期号" size="mini" @change="changeStartIssue"
                        v-model="monitorData.startIssue"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="截止期号:">
              <el-input clearable placeholder="请填写截止期号" size="mini"
                        v-model="monitorData.endIssue"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="监控方式:" v-if="monitorData.monitorType === 2">
              <el-radio-group v-model="monitorData.imageType">
                <el-radio label="0">以图查图</el-radio>
                <el-radio label="1">要素监控</el-radio>
                <el-radio label="2">俩者都选</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商标图片:" v-if="monitorData.monitorType === 2 && ['0', '2'].includes(monitorData.imageType)" key="imgUrL" prop="imgUrL">
              <div v-if="title === '新建' || title === '修改'">
                <el-upload :action='creatematerial' ref='userIconupload' :data='usericonSendData'
                           :on-success='iconSendSuccess'
                           accept="image/jpeg,image/gif,image/png"
                           :before-upload="onBeforeUploadIcon" :show-file-list="false" :auto-upload='false'
                           :multiple="false"
                           name='attachFile'
                           :on-change="handleAvatarChange">
                  <div v-if="monitorData.imgUrL && !iconIsDel" style="position: relative;padding-top: 10px"
                       @mouseenter="showDelIcon"
                       @mouseleave="hideDelIcon">
                    <img v-if="userIconCust"
                         :src="userIconCust.includes('http') ? userIconCust : `ipdoc${userIconCust}`" class="avatar">
                    <div @click.stop="btnDelete()" class="mask" v-show="isShow"
                         style="position:absolute; bottom: 0px; background-color: #000; opacity: 0.8; height: 20px; width: 100%">
                      <i class="el-icon-delete"
                         style="position:absolute; left: 43px;bottom: 3px; color: #fff;"></i>
                    </div>
                  </div>
                  <i v-else="!postForm.userIcon" class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </div>
              <img v-if="userIconCust && title === '查看'"
                   :src="userIconCust.includes('http') ? userIconCust : `ipdoc${userIconCust}`" class="avatar">
            </el-form-item>
            <el-form-item label="商标图片:" v-else>
              <div v-if="title === '新建' || title === '修改'">
                <el-upload :action='creatematerial' ref='userIconupload' :data='usericonSendData'
                           :on-success='iconSendSuccess'
                           accept="image/jpeg,image/gif,image/png"
                           :before-upload="onBeforeUploadIcon" :show-file-list="false" :auto-upload='false'
                           :multiple="false"
                           name='attachFile'
                           :on-change="handleAvatarChange">
                  <div v-if="monitorData.imgUrL && !iconIsDel" style="position: relative;padding-top: 10px"
                       @mouseenter="showDelIcon"
                       @mouseleave="hideDelIcon">
                    <img v-if="userIconCust"
                         :src="userIconCust.includes('http') ? userIconCust : `ipdoc${userIconCust}`" class="avatar">
                    <div @click.stop="btnDelete()" class="mask" v-show="isShow"
                         style="position:absolute; bottom: 0px; background-color: #000; opacity: 0.8; height: 20px; width: 100%">
                      <i class="el-icon-delete"
                         style="position:absolute; left: 43px;bottom: 3px; color: #fff;"></i>
                    </div>
                  </div>
                  <i v-else="!postForm.userIcon" class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </div>
              <img v-if="userIconCust && title === '查看'"
                   :src="userIconCust.includes('http') ? userIconCust : `ipdoc${userIconCust}`" class="avatar">
            </el-form-item>
          </el-col>

        </el-row>
        <el-row v-if="monitorData.monitorType === 2">
          <el-col :span="24">
            <el-form-item label="要素选择:" key="imageElementList" v-if="monitorData.monitorType === 2 && ['1', '2'].includes(monitorData.imageType)" prop="imageElementList">
              <el-button round @click="choseImage">
                <span class="el-icon-plus"></span>
                {{ monitorData.imageElementList.length ? '修改要素' : '添加要素' }}

              </el-button>
              <el-radio-group style="margin-left: 20px" v-model="monitorData.imageElementType">
                <el-radio :label="0">完全相同</el-radio>
                <el-radio :label="1">任一相同</el-radio>
              </el-radio-group>
              <div>
                <el-tag size="small" style="margin-right: 10px;margin-top: 5px" closable v-for="(tag, index) in monitorData.imageElementList" :key="index" @close="handleClose(tag)">
                  {{tag.label}}
                </el-tag>
              </div>
            </el-form-item>
            <el-form-item label="要素选择:" v-else>
              <el-button round @click="choseImage">
                <span class="el-icon-plus"></span>
                {{ monitorData.imageElementList.length ? '修改要素' : '添加要素' }}

              </el-button>
              <el-radio-group style="margin-left: 20px" v-model="monitorData.imageElementType">
                <el-radio :label="0">完全相同</el-radio>
                <el-radio :label="1">任一相同</el-radio>
              </el-radio-group>
              <div>
                <el-tag size="small" style="margin-right: 10px;margin-top: 5px" closable v-for="(tag, index) in monitorData.imageElementList" :key="index" @close="handleClose(tag)">
                  {{tag.label}}
                </el-tag>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="工作组:" :prop="monitorData.special ? '' : 'wkgId'">
              <el-select style="width: 100%;" clearable size="mini" default-first-option @change="(value)=>queryUserByGroupName(value,'edit')"
                         v-model="monitorData.wkgId" clearable
                         filterable placeholder="请选择工作组">
                <el-option
                    v-for="item in workgroupNamesList"
                    :key="item.wkgId"
                    :label="item.groupName"
                    :value="item.wkgId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="monitorData.monitorType === 4">
            <el-form-item label="特殊送达:" prop=""
                          v-if="$store.getters.roles.find(item => item.name === '商标监控管理员')">
              <el-checkbox v-if="title === '新建'" v-model="monitorData.special" @change="changeSpecial">
              </el-checkbox>
              <span v-if="title === '修改'">{{ monitorData.special ? '是' : '否' }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="通知人管理:">
              <virtual-select class="virtual-select" :isUser="true" clearable multiple :data="$store.getters.userList"
                              v-model="monitorData.userIdList" filterable
                              :render="(data)=>$commonUtils.UserRender(data,this)">
              </virtual-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col v-if="monitorData.monitorType === 1 || monitorData.monitorType === 2" :span="24">
            <el-form-item label="商标所属人:">
              <div>
                <el-button type="primary" size="mini" @click="addCompany">
                  添加
                </el-button>
                <el-button type="danger" size="mini" @click="delCompany">
                  删除
                </el-button>
              </div>
              <pl-table
                  border
                  :row-class-name="({row, rowIndex}) => tableRowClassName({row, rowIndex})"
                  ref="todoTaskMultiple"
                  :data="companyList"
                  fit
                  empty-text="暂无数据"
                  highlight-current-row
                  current-row-key
                  style="width: 80%;"
                  :height="250"
                  @select="handleCompanySelectionChange"
                  @select-all="handleCompanySelectionAll"
              >
                <pl-table-column
                    type="selection"
                    width="50"
                    class="selection"
                >
                </pl-table-column>
                <pl-table-column label="商标所属人全称" align="left" class-name="small-padding fixed-width">
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.name"></el-input>
                  </template>
                </pl-table-column>
                <pl-table-column label="操作" align="left" width="80" class-name="small-padding fixed-width">
                  <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="delSingleCom(scope.$index)">
                      删除
                    </el-button>
                  </template>
                </pl-table-column>
              </pl-table>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer fl-ac-jc">
          <el-button size="small" @click="() => closeDialog(false)">取 消</el-button>
          <el-button size="small" type="primary" v-if="title === '新建' || title === '修改'"
                     @click="submitData">确 认</el-button>
        </span>
      <el-dialog
          v-if="choseImageView"
          title="选择查询编码"
          center
          :fullscreen="false" :show-close="true"
          :close-on-click-modal="false" :modal="true"
          :visible.sync="choseImageView"
          width="60%"
          append-to-body
          destroy-on-close
          class="abow_dialog1"
      >
        <div>
          <div>
            <el-input size="small" style="width: 40%" placeholder="请输入关键词" clearable v-model="filterText" @change="changeFilter">
            </el-input>
            <el-button type="primary" size="small" @click="changeFilter(filterText)">搜索</el-button>
          </div>
          <el-tree
              v-if="choseImageView"
              ref="tree"
              :data="treeData"
              show-checkbox
              node-key="factorId"
              :props="defaultProps"
              :default-expanded-keys="defaultExpandedKeys"
              :default-checked-keys="defaultCheckedKeys"
              :filter-node-method="filterNode"
          >
            <div class="custom-tree-node" slot-scope="{ node, data }">
              <span v-html="filterKeyLight(node.label)"></span>
            </div>
          </el-tree>
        </div>
        <span slot="footer" class="dialog-footer fl-ac-jc">
          <el-button size="small" @click="() => choseImageView = false">取 消</el-button>
          <el-button size="small" type="primary"
                     @click="confirmCoder">确 认</el-button>
        </span>
      </el-dialog>
    </el-dialog>

    <SelectOption moduleName="monitor" :buss-id="bussId" v-if="selectionOptionState" :dialog-visible="selectionOptionState"
                  @cancel="closeSelect" :idArray="getCurrentRowsData('whdId')"
                  :defaultMultipleSelect="tableDefaultList.map(i=>i.title)" :exportType="exportType"
                  :exportQueryModel="exportQueryModel"></SelectOption>
  </div>
</template>

<script>
import {creatematerial} from '@/api/ipServiceApi.config.js'
import Pagination from '@/components/Pagination'
import {queryCustomerNameIdUrl} from "../../../../../api/customerList";
import {queryUsers, queryWorkgroupNames} from "../../../../../api/systemList";
import {
  addMonitor, batchState,
  queryIssueList,
  queryMonitor, queryMonitorCustomer, queryMonitorFactorImage, queryMonitorFactorType,
  queryMonitorList,
  updatebatchStop,
  updateMonitor,
  monitorUpdateByWkgId
} from "../../../../../api/monitor";
import {queryCustomerNameId} from "../../../../../api/caseList";
import SelectOption from '../../../case/components/SelectOption'

export default {
  name: "MonitorContent",
  components: {
    SelectOption,
    Pagination
  },
  props: {
    custList: {
      default: () => []
    },
    workgroupNamesList: {
      default: () => []
    }
  },
  computed: {
    clientHeight() {
      return document.documentElement.clientHeight - 250
    },
  },
  data() {
    var imgValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请上传商标图片'))
      } else {
        callback()
      }
    }
    var imgListValidator = (rule, value, callback) => {
      if (!value || value && !value.length) {
        callback(new Error('请添加要素编码'))
      } else {
        callback()
      }
    }
    return {
      exportType: '',
      exportQueryModel: {},
      bussId: '155',
      multipleTypeText: '',
      selectionOptionState: false,
      selectionState: false,
      defaultExpandedKeys: [],
      defaultCheckedKeys: [],
      filterText: '',
      choseImageView: false,
      defaultProps: {
        children: 'child',
        label: 'label'
      },
      jsConfigObjList: [],
      checkJsConfigList: [],
      jsConfigData1: [
        {
          label: '首部',
          value: 'head'
        },
        {
          label: '中部',
          value: 'middle'
        },
        {
          label: '尾部',
          value: 'tail'
        }
      ],
      jsConfigData: [
        {
          label: '相同',
          value: 'same'
        },
        {
          label: '加字',
          value: 'insert'
        },
        {
          label: '减字',
          value: 'reduce'
        },
        {
          label: '逆序',
          value: 'reverse'
        },
        {
          label: '换序',
          value: 'order'
        },
        {
          label: '含于其他',
          value: 'hanyuqita'
        },
        {
          label: '变字',
          value: 'change'
        },
        {
          label: '重叠',
          value: 'repeat'
        },

        {
          label: '音同',
          value: 'yintong'
        },
        {
          label: '形同',
          value: 'xingtong'
        },
        {
          label: '义同',
          value: 'yitong'
        },


        {
          label: '内含其他',
          value: 'neihanqita'
        },
      ],
      currentIssue: 0,
      tableKeyOut: false,
      tableHeadFilters: {},
      tableHeader: {},
      supplierList: [{label: '白兔', value: 1}, {label: '社文', value: 2}, {label: '摩知轮', value: 3}, {
        label: 'IPS',
        value: 4
      },{label:'太原数世',value:5}],
      isAllCheck: false,
      isAllCheck1: false,
      selectCompanyList: [],
      companyList: [],
      stopList: [],
      usericonSendData: {
        tokenID: "",
      },
      creatematerial,
      fuzzyList: [{label: '高度近似', value: 0}, {label: '中度近似', value: 1}, {label: '低度近似', value: 2}],
      custArray: [],
      rules: {
        imageElementList: [
          {validator: imgListValidator, required: true, message: '请添加要素编码'}
        ],
        imgUrL: [
          {validator: imgValidator, required: true, message: '请上传商标图片'}
        ],
        custId: [
          {required: true, message: '请填写客户', trigger: ['change', 'blur']}
        ],
        template: [
          {required: true, message: '请选择模板', trigger: ['change', 'blur']}
        ],
        monitorType: [
          {required: true, message: '请选择监控类型', trigger: ['change', 'blur']}
        ],
        wkgId: [
          {required: true, message: '请选择工作组', trigger: ['change', 'blur']}
        ],
        monitorItem: [
          {required: true, message: '请填写监控内容', trigger: ['change', 'blur']}
        ],
        // fuzzy: [
        //   {required: true, message: '请选择近似度', trigger: ['change', 'blur']}
        // ],
        keyCategories: [
          {required: true, message: '请选择重点类别', trigger: ['change', 'blur']}
        ],
        startIssue: [
          {required: true, message: '请填写起始期号', trigger: ['change', 'blur']}
        ],
      },
      defaultData: {
        imageElementList: [],
        imageElementType: 0,
        imageType: '0',
        special: false,
        imgUrl: '',
        companyList: [],
        custId: '',
        supplier: '',
        template: '',
        monitorType: '',
        fuzzy: '',
        regNumber: '',
        monitorItem: '',
        monitorDescription: '',
        keyCategories: '',
        ignoreCategories: '',
        startIssue: '',
        endIssue: '',
        wkgId: '',
        userIdList: []
      },
      monitorData: {
        imageElementList: [],
        imageElementType: 0,
        imageType: '0',
        special: false,
        imgUrl: '',
        companyList: [],
        custId: '',
        supplier: '',
        template: '',
        monitorType: '',
        fuzzy: '',
        regNumber: '',
        monitorItem: '',
        monitorDescription: '',
        keyCategories: '',
        ignoreCategories: '',
        startIssue: '',
        endIssue: '',
        wkgId: '',
        userIdList: []
      },
      monitorView: false,
      title: '',
      tableDefaultList: [
        {
          title: '类型',
          value: 'monitorTypeStr',
          width: 'auto'
        },
        {
          title: '商标号',
          value: 'regNumber',
          width: 'auto'
        },
        {
          title: '图形',
          value: 'imgUrL',
          width: '50'
        },
        {
          title: '监控内容',
          value: 'monitorItem',
          width: 'auto'
        },
        {
          title: '客户',
          value: 'custName',
          width: 'auto'
        },
        {
          title: '供应商',
          value: 'supplierStr',
          width: '80'
        },
        {
          title: '规则',
          value: 'ruleStr',
          width: 'auto'
        },
        {
          title: '重点类别',
          value: 'keyCategories',
          width: 'auto'
        },
        {
          title: '不监控',
          value: 'stateStr',
          width: 'auto'
        },
        {
          title: '起始期号',
          value: 'startIssue',
          width: 'auto'
        },
        {
          title: '截止期号',
          value: 'endIssue',
          width: 'auto'
        },
        {
          title: '模板类型',
          value: 'templateStr',
          width: 'auto'
        },
        // {
        //   title: '模糊度',
        //   value: 'fuzzy',
        //   width: 'auto'
        // },
      ],
      monitorList: [],
      total: 0,
      pageSizesList: [10, 50, 100, 200],
      listQuery: {
        pageNo: 1,
        pageSize: JSON.parse(localStorage.getItem('pageSize')) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name) ? JSON.parse(localStorage.getItem('pageSize')).find(item => item.name == this.$route.name).pageSize : 10 : 10,
      },
      // workgroupNamesList: [],
      custListMerge: [],
      checkNumberList: [],
      checkNumberList1: [],
      queryData: {
        state: false,
        sort: 'ASC',
        orderRule: undefined,
        custName: undefined,
        monitorItem: undefined,
        wkgId: undefined,
        template: undefined,
        monitorType: undefined,
        supplier: undefined
      },
      isShow: false,
      iconIsDel: false,
      userIconCust: '',
      tableKey: false,
      treeData: [],
      editComradesView: false,
      comradesData:{
        wkgId: undefined,
        userIdList: []
      },
      comradesRules: {
        wkgId: [
          {required: true, message: '请选择工作组', trigger: ['change']}
        ]
      }
    }
  },
  watch: {
    custList: {
      handler(value) {
        this.custListMerge = JSON.parse(JSON.stringify(value))
      },
      immediate: true
    },
    isAllCheck(n) {
      this.checkNumberList = []
      if (n) {
        for (let i = 1; i <= 45; i++) {
          this.checkNumberList.push(i)
        }
      }
    },
    isAllCheck1(n) {
      this.checkNumberList1 = []
      if (n) {
        for (let i = 1; i <= 45; i++) {
          this.checkNumberList1.push(i)
        }
      }
    },
    checkNumberList(n) {
      this.monitorData.keyCategories = [...new Set(n)].join(',')
    },
    checkNumberList1(n) {
      this.monitorData.ignoreCategories = [...new Set(n)].join(',')
    },
  },
  created() {
    // this.queryWorkgroupNames()
    this.initTableHeader()
    this.queryList()
    this.queryMonitorFactorType()
    this.queryImageTreeData()

  },
  methods: {
    exportList(flag) {
      this.exportType = flag
      const state = this.queryData.state ? 0 : 1
      this.exportQueryModel = JSON.stringify({...this.queryData, state})
      if (flag == 2) {
        this.selectionOptionState = true;
        this.multipleTypeText = '列表导出';
      } else if (flag == 1) {
        this.selectionOptionState = true
      }
    },
    closeSelect() {
      this.selectionState = false
      this.selectionOptionState = false
    },
    getCurrentRowsData(key) {
      return this.monitorList.map(item => item[key])
    },
    filterKeyLight(text) {
      if (!this.filterText) return text;
      if (!text) return text;
      const result = text.replace(
          new RegExp(this.filterText, "g"),
          `<span style='color: #3B8CCA !important;font-weight: bold;font-size: 16px;'>${this.filterText}</span>`
      );
      return result;
    },
    handleClose(tag) {
      this.monitorData.imageElementList.splice(this.monitorData.imageElementList.findIndex(item => item.factorId == tag.factorId), 1)
    },
    confirmCoder() {
      this.choseImageView = false
      this.monitorData.imageElementList = this.$refs.tree.getCheckedNodes() || []
      console.log(this.$refs.tree.getCheckedNodes())
    },
    changeFilter(val) {
      const longList = this.$commonUtils.extractTree(this.treeData, 'child').filter(item => item.label.toLowerCase().indexOf(this.filterText.toLowerCase()) >= 0)
      this.defaultExpandedKeys.push(...longList.map(item => item.factorId))
      this.defaultExpandedKeys = [...new Set(this.defaultExpandedKeys)]
      console.log(longList)
      console.log(this.defaultExpandedKeys)
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    choseImage() {
      this.defaultCheckedKeys = this.monitorData.imageElementList.map(item => item.factorId)
      this.defaultExpandedKeys = this.monitorData.imageElementList.map(item => item.factorId)
      this.choseImageView = true
    },
    queryImageTreeData() {
      queryMonitorFactorImage().then(res => {
        this.treeData = res.data
      })
    },
    queryMonitorFactorType() {
      queryMonitorFactorType().then(res => {
        this.jsConfigData = res.data.wordFilterCondition.map(item => ({
          id: item.id,
          label: item.factorCnName,
          value: item.factorEnName
        }))
        this.jsConfigData1 = res.data.wordFilterPosition.map(item => ({
          id: item.id,
          label: item.factorCnName,
          value: item.factorEnName
        }))
      })
    },
    clickConfig(item) {
      this.checkJsConfigList = []
      this.$set(item, 'isCheck', !item.isCheck)
      this.jsConfigObjList = this.jsConfigData.filter(j => j.isCheck)
    },
    changeJsConfig(value) {
      this.jsConfigData.forEach(item => {
        this.$set(item, 'isCheck', false)
      })
      if (value && value.length) {
        this.jsConfigObjList = this.jsConfigData1.filter(j => value.includes(j.value))
      } else {
        this.jsConfigObjList = []
      }
    },
    checkAllJsConfig() {
      this.checkJsConfigList = []
      this.jsConfigData.forEach(item => {
        this.$set(item, 'isCheck', true)
      })
      this.jsConfigObjList = this.jsConfigData.filter(j => j.isCheck)
    },
    resetJsConfig() {
      this.jsConfigData.forEach(item => {
        this.$set(item, 'isCheck', false)
      })
      if (!this.checkJsConfigList.length) {
        this.jsConfigObjList = []
      }
    },
    changeStartIssue(value) {
      this.monitorData.isReplenish = undefined
      console.log(this.currentIssue)
      console.log(value)
      if (value >= this.currentIssue - 12) {
        this.$confirm('请确认是否需补推历史公告的监控报告？确认后，将在第二天显示结果。', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.monitorData.isReplenish = 1
        }).catch(() => {
          this.monitorData.isReplenish = 0
          this.monitorData.startIssue = this.currentIssue
        })
      }
      // if (this.title === '新建') {
      //
      // } else if (this.title === '修改') {
      //
      // }
    },
    sortChangeOut(a, b, c) {
      this.tableHeadFilters = this.$commonUtils.tableFilter(this.$refs.tableList.tableData || [])
    },
    filterHandler(value, row, column) {
      const property = column['property']
      return row[property] === value
    },
    initTableHeader() {
      this.$set(this, 'tableHeader', JSON.parse(localStorage.getItem(this.$options.name)) || {})
      this.tableDefaultList.forEach(item => {
        item.width = this.tableHeader[item.value] || 'auto'
      })
    },
    headerDrage(newWidth, oldWidth, column) {
      this.tableHeader[column.property] = newWidth
      localStorage.setItem(this.$options.name, JSON.stringify(this.tableHeader))
    },
    changeMonitorType(value) {
      if (value === 1 || value === 2) {
        this.monitorData.supplier = 5
      }
      if (value === 3 || value === 4) {
        this.monitorData.supplier = 4
      }
    },
    restoreBatch() {
      if (!this.stopList.length) {
        this.$message.error('请选择商标监控!')
        return
      }
      this.batchRestoreMonitor(this.stopList)
    },
    patchEdit(){
      if (!this.stopList.length) {
        this.$message.error('请选择商标监控!')
        return
      }
      const whdId = this.stopList[0]
      queryMonitor({whdId: whdId}).then(res => {
        this.comradesData.wkgId = res.data.wkgId
        this.comradesData.userIdList = res.data.userIdList
      })
      this.editComradesView = true
    },
    closeComradesEdit(){
      this.editComradesView = false
      this.comradesData = {
        wkgId:'',
        userIdList:[]
      }
    },
    submitComradesEdit(){
      this.$refs['comradesForm'].validate((valid) => {
          if (valid) {
            console.log(this.comradesData,'comradesData')
            const params = {
              ...this.comradesData,
              monitorIdlist:this.stopList
            }
            monitorUpdateByWkgId(params).then((res)=>{
              if(res.success){
                this.$message.success('修改成功')
                this.editComradesView = false
              }
            })
          } else {
            return false;
          }
        });
    },
    restoreSingle(row) {
      this.batchRestoreMonitor([row.whdId])
    },
    batchRestoreMonitor(list) {
      // batchState
      this.$confirm('此操作将恢复商标监控, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        batchState({
          startList: list
        }).then(res => {
          this.$message.success('恢复成功!')
          this.monitorList.forEach(item => {
            if (list.includes(item.whdId)) {
              item.state = 1
            }
          })
        })
      })
    },
    changeSpecial(value) {
      if (value) {
        this.monitorData.custId = undefined
      }
    },
    delSingleCom(index) {
      this.companyList.splice(index, 1)
    },
    delCompany() {
      if (!this.selectCompanyList.length) {
        this.$message.error('请先勾选！')
        return
      }
      this.companyList = this.companyList.filter(item => !this.selectCompanyList.find(i => i.name === item.name))
      this.$message.success('删除成功！')
    },
    addCompany() {
      this.companyList.push({name: ''})
    },
    // closeDialog(isSearch) {
    //   this.title = ''
    //   this.annNum = undefined
    //   this.monitorView = false
    //   isSearch === true && this.queryList()
    // },
    stopMonitorSingle(row) {
      this.batchStop([row.whdId])
    },
    stopMonitor() {
      if (!this.stopList.length) {
        this.$message.error('请选择商标监控!')
        return
      }
      this.batchStop(this.stopList)
    },
    batchStop(stopList) {
      this.$confirm('此操作将停止商标监控, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updatebatchStop({stopList}).then(res => {
          this.$message.success('停止成功!')
          this.monitorList.forEach(item => {
            if (stopList.includes(item.whdId)) {
              item.state = 0
            }
          })
        })
      })
    },
    handleAvatarChange(file, fileList) {
      this.$refs.userIconupload.submit()
    },
    onBeforeUploadIcon(file) {
      this.usericonSendData.tokenID = this.$store.getters.token
      const isIMAGE = file.type === "image/jpeg" || "image/gif" || "image/png"
      if (!isIMAGE) {
        this.$message.error("上传文件只能是图片格式!")
      }
      return isIMAGE
    },
    hideDelIcon() {
      this.isShow = false
    },
    showDelIcon() {
      this.isShow = true
    },
    btnDelete() {
      this.userIconCust = ''
      this.iconIsDel = true
      this.monitorData.materialId = ''
      this.$set(this.monitorData, 'imgUrL', '')
    },
    iconSendSuccess(response, file, fileList) {
      if (response.success) {
        this.iconIsDel = false
        this.$set(this.monitorData, 'imgUrL', response.data[0] && `${response.data[0].address}`)
        // this.monitorData.imgUrL = response.data[0] && `${response.data[0].address}`
        this.$set(this.monitorData, 'imgUrL', response.data[0] && `${response.data[0].address}`)
        this.monitorData.materialId = response.data[0] && response.data[0].materialId
        this.userIconCust = response.data[0] && `${response.data[0].address}`
        this.$message.success(response.message)
      } else {
        this.$message.error(response.message)
        this.$set(this.monitorData, 'imgUrL', '')
        this.userIconCust = ''
      }
    },
    clickClassNumber(number) {
      if (this.checkNumberList.find(num => num == number)) {
        this.checkNumberList.splice(this.checkNumberList.findIndex(num => num == number), 1)
      } else {
        this.checkNumberList.push(number)
      }
    },
    clickClassNumber1(number) {
      if (this.checkNumberList1.find(num => num == number)) {
        this.checkNumberList1.splice(this.checkNumberList1.findIndex(num => num == number), 1)
      } else {
        this.checkNumberList1.push(number)
      }
    },
    queryUserByGroupName(wkgId,type) {
      if (!wkgId) return
      const groupName = this.workgroupNamesList.find(group => group.wkgId === wkgId).groupName
      queryUsers({
        groupName,
        pageSize: 100,
        administrative: 1,
        isActive: 1
      }).then(res => {
        if(type =='patchedit'){
          this.comradesData.userIdList = res.data.users.map(item => item.userId)
        }else{
          this.monitorData.userIdList = res.data.users.map(item => item.userId)
        }
      })
    },
    closeDialog(flag, data={}) {
      this.title = ''
      this.monitorView = false
      this.monitorData = JSON.parse(JSON.stringify(this.defaultData))
      this.custArray = []
      this.checkNumberList = []
      this.checkNumberList1 = []
      data.stateStr = data.state ? '否' : '是'
      if (flag === 'update') {
        this.monitorList.splice(this.monitorList.findIndex(item => item.whdId === data.whdId), 1, data)
        this.tableHeadFilters = this.$commonUtils.tableFilter(this.monitorList || [])
      } else if (flag === 'add') {
        this.monitorList.unshift(data)
        this.tableHeadFilters = this.$commonUtils.tableFilter(this.monitorList || [])
        this.total++
      }
      this.resetJsConfig()
      this.jsConfigObjList = []
      this.checkJsConfigList = []
      this.monitorList.forEach(item => {
        item.supplierStr = this.supplierList.find(i => i.value == item.supplier) && this.supplierList.find(i => i.value == item.supplier).label || ""
      })
    },
    async submitData() {
      // if (this.monitorData.monitorType === 2 && !this.monitorData.imgUrL) {
      //   this.$message.error('请上传商标图片')
      //   return;
      // }
      this.monitorData.factorList = []
      this.monitorData.factorTypeList = []
      if (this.monitorData.monitorType == 1) {
        if (this.jsConfigObjList && this.jsConfigObjList.length) {
          this.monitorData.factorList = this.jsConfigObjList.map(item => item.id)
        }
      }
      if (!this.monitorData.keyCategories && !await this.$confirm('您没有设置商标监控的【重点类别】，可能会出现监控结果较少的情况，是否继续保存该设置？', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        return true
      }).catch(() => {
        return false
      })) return
      this.monitorData.special = this.monitorData.special ? 1 : undefined
      if (!this.$commonUtils.formValidate(this.$refs['postForm'])) return
      this.monitorData.companyList = this.companyList.map(item => item.name)
      if (this.title === '修改') {
        // cleanNullAttr
        delete this.monitorData.pageSize
        delete this.monitorData.monitorPattern
        updateMonitor(this.monitorData).then(res => {
          this.$message.success('修改成功!')
          this.closeDialog('update', res.data)
        })
      } else {
        addMonitor(this.monitorData).then(res => {
          this.$message.success('新建成功!')
          this.closeDialog('add', res.data)
        })
      }
    },
    addMonitor() {
      this.monitorData = JSON.parse(JSON.stringify(this.defaultData))
      this.title = '新建'
      this.monitorView = true
      queryIssueList().then(res => {
        this.monitorData.supplier = 5
        if (res.data && res.data.length) {
          this.monitorData.startIssue = res.data[0] + 1
          this.currentIssue = res.data[0] + 1
        }
      })
    },
    editMonitor(row) {
      queryMonitor({whdId: row.whdId}).then(res => {
        this.monitorData = res.data
        if (!this.monitorData.imageElementList) {
          this.$set(this.monitorData, 'imageElementList', [])
        }

        if (this.monitorData.factorTypeList && this.monitorData.factorTypeList.length) {
          this.jsConfigData.forEach(item => {
            if (this.monitorData.factorTypeList.find(i => i.id === item.id)) {
              this.$set(item, 'isCheck', true)
              this.jsConfigObjList.push(item)
            }
          })
          this.jsConfigData1.forEach(item => {
            if (this.monitorData.factorTypeList.find(i => i.id === item.id)) {
              this.checkJsConfigList.push(item.value)
              this.jsConfigObjList.push(item)
            }
          })
        }

        this.currentIssue = this.monitorData.startIssue
        if (!this.monitorData.userIdList) {
          this.monitorData.userIdList = []
        }
        // if (!this.monitorData.special) {
        //   this.$commonUtils.formValidate(this.$refs['postForm'])
        // }
        this.monitorData.supplier = this.monitorData.supplier ? +this.monitorData.supplier : ''
        if (!this.monitorData.company) {
          this.$set(this, 'companyList', [])
        } else {
          this.$set(this, 'companyList', JSON.parse(this.monitorData.company).map(item => ({name: item})))
        }
        if (this.monitorData.imgUrL) {
          this.userIconCust = `${this.monitorData.imgUrL}`
        }
        this.checkNumberList = this.monitorData.keyCategories && this.monitorData.keyCategories.split(',') || []
        if (this.checkNumberList.length === 45) {
          this.isAllCheck = true
        }
        this.checkNumberList1 = this.monitorData.ignoreCategories && this.monitorData.ignoreCategories.split(',') || []
        if (this.checkNumberList1.length === 45) {
          this.isAllCheck1 = true
        }
        if (this.monitorData.custId) {
          queryCustomerNameId({
            pageNo: 1,
            pageSize: 100,
            custIdArray: [this.monitorData.custId]
          }).then(res => {
            this.custArray = res.data
            this.title = '修改'
            this.monitorView = true
          })
        } else if (this.monitorData.custName) {
          queryCustomerNameIdUrl({keyword: this.monitorData.custName, isCustomer: 1, pageSize: 100}).then(res => {
            this.custArray = this.$commonUtils.unique(res.data, 'custId')
            // this.monitorData.custId = this.custArray[0]
            this.$set(this.monitorData, 'custId', this.custArray[0])
            this.title = '修改'
            this.monitorView = true
          })
        } else {
          this.title = '修改'
          this.monitorView = true
        }
      })
    },
    handleSelectionAll(list) {
      list = list.filter(item => item != undefined)
      this.stopList = list.map(item => item.whdId)
    },
    handleCompanySelectionAll(list) {
      list = list.filter(item => item != undefined)
      this.selectCompanyList = list
    },
    handleSelectionChange(list) {
      list = list.filter(item => item != undefined)
      this.stopList = list.map(item => item.whdId)
    },
    handleCompanySelectionChange(list) {
      list = list.filter(item => item != undefined)
      this.selectCompanyList = list
    },
    tableRowClassName({row, rowIndex}) {
      if (rowIndex % 2) {
        return 'single-row'
      } else {
        return 'duouble-row'
      }
    },
    clickSort(sort) {
      this.queryData.sort = sort
      this.queryList(1)
    },
    queryWorkgroupNames() {
      queryWorkgroupNames().then(res => {
        if (res.success) {
          this.workgroupNamesList = res.data
        }
      })
    },
    remotepaternalUnit(query) {
      if (query != "") {
        queryMonitorCustomer({custName: query, pageSize: 100}).then(res => {
          this.custListMerge = this.$commonUtils.unique(res.data, 'custId').map(item => ({fullname: item.custName}))
        })
      } else {
        this.custListMerge = JSON.parse(JSON.stringify(this.custList))
      }
    },
    remotepaternalUnit1(query) {
      if (query !== "") {
        queryCustomerNameIdUrl({keyword: query, isCustomer: 1, pageSize: 100}).then(res => {
          this.custArray = this.$commonUtils.unique(res.data, 'custId')
        })
      }
    },
    queryList(flag) {
      if (flag === 1) {
        this.listQuery.pageNo = 1
      }
      const state = this.queryData.state ? undefined : 1
      queryMonitorList(this.$commonUtils.cleanNullAttr({...this.listQuery, ...this.queryData, state})).then(res => {
        this.total = res.total
        this.monitorList = res.data
        this.monitorList.forEach(item => {
          item.stateStr = item.state ? '否' : '是'
          item.supplierStr = this.supplierList.find(i => i.value == item.supplier) && this.supplierList.find(i => i.value == item.supplier).label || ""
        })
        this.tableHeadFilters = this.$commonUtils.tableFilter(this.monitorList)
        this.tableKeyOut = !this.tableKeyOut
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.topSearch {
  display: flex;
  flex-wrap: wrap;
}

.ellipsis1 {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

> > > .el-table {
  margin-bottom: 15px;

  .el-table__header-wrapper, .el-table__fixed-header-wrapper {
    /*border: 1px solid #EBEEF5;*/
    /*border-bottom: none;*/

    th {
      padding: 7px 0;
      background-color: #0D8CD6;
      font-size: 14px;
      color: #fff;
      font-weight: normal;

      .el-table__column-filter-trigger {
        .el-icon-arrow-down {
          color: #fff;
          font-size: 16px;
        }
      }
    }

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

> > > .single-row {
  background-color: #F7F6FD;
}

> > > .double-row {
  background-color: #EBEBEB;
}

> > > .el-switch__label--right {
  height: 28px;
  line-height: 28px;
}

.el-switch {
  height: 28px;
  line-height: 28px;
}

> > > .el-dialog__header {
  background-color: #8AB2FC;
  padding: 10px;

  .el-dialog__title {
    color: #fff;
  }

  .el-dialog__close {
    color: #fff;
  }
}

> > > .jh-virtual-select {
  height: auto !important;
}

.classNumber {
  display: flex;
  flex-wrap: wrap;

  div {
    width: 25px;
    height: 25px;
    margin: 5px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid;
    cursor: pointer;
  }
}

> > > .el-table td, > > > .el-table th {
  padding: 5px 0;
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
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  border: 1px dashed #d9d9d9;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
}

.abow_dialog {
  > > > .el-dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: 0 !important;
    transform: translate(-50%, -50%);
    max-height: calc(100% - 30px);
    max-width: calc(100% - 30px);
    display: flex;
    flex-direction: column;
  }

  > > > .el-dialog__body {
    overflow: auto;
  }
}
.abow_dialog1 {
  display: flex;
  justify-content: center;
  align-items: center;
  > > > .el-dialog {
    //position: absolute;
    //display: flex;
    //top: 50%;
    //left: 50%;
    margin: 0 !important;
    //transform: translate(-50%, -50%);
    height: calc(100% - 30px);
    max-width: calc(100% - 30px);
    display: flex;
    flex-direction: column;
  }

  > > > .el-dialog__body {
    overflow: auto;
  }
}
.custom-tree-node {
  padding-left: 5px;
}
  .export {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
</style>
