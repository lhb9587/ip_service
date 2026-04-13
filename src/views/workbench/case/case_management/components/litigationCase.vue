<template>
  <div class="case_management_item">
    <ViewsSwitching class="ViewsSwitching" @changePattern="changePattern"></ViewsSwitching>
    <MyTabs class="MyTabs" :page-title="pageTitle" :identification="identification" :defaultColumnDefs="columnDefs"  style="position: absolute" @editableTab="editableTab" :class="myTabsActivity?'activity':''" v-if="pageTitle=='案件管理'"></MyTabs>
    <div class="queryButton" style="width: 40%;margin: 0 auto" :class="myTabsActivity?'activity':''">
      <div class="buttonWrap_small">
        <el-button-group class="button-group-search"  v-clickoutside="clickoutside">
          <el-button id="mySearch" type="primary" size="small" @click="handleSearch(0)">搜索</el-button>
          <el-button type="primary" style="margin-left:0" class="searchRight"  size="small" icon="el-icon-arrow-down" @click.stop.prevent="drawerState=true"></el-button>
          <transition name="show" mode="out-in">
            <div class="searchWrap" id="searchWrap" v-show="drawerState">
              <el-form label-width="120px"  size="mini" class="form-container" @keyup.enter.native="handleSearch(0)">
                <template v-if="pageTitle=='案件管理'||pageTitle=='官方通知'">
                  <el-form-item  label="案件文号:" class="postInfo-container-item">
                    <el-input type="text" clearable v-model="queryModuleData.agentNumStart" placeholder="请输入案件文号" @change="(value)=>changeTextRange(value,'agentNumEnd')"></el-input>
                    <span>至</span>
                    <el-input type="text" clearable v-model="queryModuleData.agentNumEnd"  placeholder="请输入案件文号"></el-input>
                  </el-form-item>
                </template>
                <template v-if="pageTitle=='递交官方'">
                  <el-form-item  label="案件文号:" class="postInfo-container-item">
                    <el-input type="text" v-model="queryModuleData.agentNumStart" clearable placeholder="请输入案件文号" @change="(value)=>changeTextRange(value,'agentNumEnd')"></el-input>
                    <span>至</span>
                    <el-input type="text" v-model="queryModuleData.agentNumEnd" clearable placeholder="请输入案件文号"></el-input>
                  </el-form-item>
                </template>
              </el-form>
              <div class="divdiver"></div>
              <el-form size="mini" label-width="120px" class="form-container" @keyup.enter.native="handleSearch(0)" style="margin-top: 2px"  >
                <el-form-item :label="item.filterName+':'"
                              :class="item.filterType==='radio'&&item.values.length>3?'fullItem':'postInfo-container-item'" v-for="item,index in conditionsModuleList" :key="index">

                  <el-select v-model="queryModuleData[item.property]" placeholder="请选择" v-if="item.filterType==='select'" filterable clearable>
                    <el-option v-for="itm in item.values" :key="itm.id" :label="itm.value" :value="itm.id">
                    </el-option>
                  </el-select>
                  <!--<el-checkbox-group style="display:flex" v-model="queryModuleData[item.property]" v-if="item.filterType==='checkbox'">-->
                  <!--<el-checkbox v-for="itm in item.values" :label="itm.value" :key="itm.id">{{itm.value}}</el-checkbox>-->
                  <!--</el-checkbox-group>-->
                  <el-select  v-if="item.filterType==='checkbox'&&item.values&&item.values.length"    v-model="queryModuleData[item.property]" multiple  placeholder="请选择"  filterable  clearable @change="(e)=>checkBox(e,item.property,item.values)">
                    <el-option v-for="itm in item.values" :key="itm.id" :label="itm.value" :value="itm.id">
                    </el-option>
                  </el-select>
                  <el-select v-if="item.filterType==='selectMany'" v-model="queryModuleData[item.property]"  filterable remote clearable reserve-keyword placeholder="请输入关键词" :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName);
            }">
                    <el-option v-for="itm in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
                    </el-option>
                  </el-select>
                  <el-select v-if="item.filterType==='selectMultipleMany'" multiple v-model="queryModuleData[item.property]"  filterable remote clearable reserve-keyword placeholder="请输入关键词" :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName);
            }">
                    <el-option v-for="itm in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
                    </el-option>
                  </el-select>
                  <el-select v-if="item.filterType==='selectTableMany'" v-model="queryModuleData[item.property]" filterable remote clearable reserve-keyword placeholder="请输入关键词" :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName); }">
                    <el-option disabled label="" value="">
            <span v-for="(itmx,key) in getAppTitleList(item.filterName,item['valueList']?item['valueList'][0]:undefined)" v-if="key!='id'">
            {{itmx}}
            </span>
                    </el-option>
                    <el-option v-for="itm,idx in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
                      <el-tooltip v-for="itmx,key in item['valueList'][idx]" v-if="key!='id'" class="item" effect="light" :content="itmx" placement="top">
                        <span>{{itmx}}</span>
                      </el-tooltip>
                    </el-option>
                  </el-select>
                  <el-select v-if="item.filterType==='selectTableMultipleMany'" v-model="queryModuleData[item.property]" multiple filterable remote clearable reserve-keyword placeholder="请输入关键词" :remote-method="(queryString)=>{
            remoteMethod(queryString,index,item.property,item.filterName); }">
                    <el-option disabled label="" value="">
            <span v-for="(itmx,key) in getAppTitleList(item.filterName,item['valueList']?item['valueList'][0]:undefined)" v-if="key!='id'">
            {{itmx}}
            </span>
                    </el-option>
                    <el-option v-for="itm,idx in item['valueList']" :key="itm.id" :label="itm.value" :value="itm.id">
                      <el-tooltip v-for="itmx,key in item['valueList'][idx]" v-if="key!='id'" class="item" effect="light" :content="itmx" placement="top">
                        <span>{{itmx}}</span>
                      </el-tooltip>
                    </el-option>
                  </el-select>
                  <el-select v-if="item.filterType==='selectTable'" v-model="queryModuleData[item.property]" filterable clearable placeholder="请选择">
                    <el-option v-for="itm ,idx in item.values" :key="idx" :label="itm.value" :value="itm.id" :disabled="itm.id==-1">
                      <span v-for="itmx ,key in item['values'][idx]" v-if="key!='id'">{{itmx}}</span>
                    </el-option>
                  </el-select>
                  <el-radio-group v-model="queryModuleData[item.property]" v-if="item.filterType==='radio'">
                    <el-radio :label="itm.id" v-for="itm,index in item.values" :key="index">{{itm.value}}</el-radio>
                  </el-radio-group>
                  <el-input clearable v-model="queryModuleData[item.property]" :placeholder="'请输入'+item.filterName" v-if="item.filterType==='text'"></el-input>
                  <el-input clearable v-model="queryModuleData[item.property]" :placeholder="'请输入'+item.filterName" type="textarea" v-if="item.filterType==='textarea'"></el-input>
                  <el-input clearable v-model="queryModuleData[item.property.split(',')[0]]" :placeholder="'请输入'+item.filterName" v-if="item.filterType==='textRange'"
                            @change="(string)=>changeTextRange(string,index,item.property)"></el-input>
                  <span v-if="item.filterType==='textRange'" v-show="item.property.includes(',')">至</span>
                  <el-input clearable v-model="queryModuleData[item.property.split(',')[1]]" :placeholder="'请输入'+item.filterName" v-if="item.filterType==='textRange'"></el-input>
                  <DataPicker class="DataPicker" v-if="item.filterType==='date'" v-model="queryModuleData[item.property]"></DataPicker>
                  <!--<el-date-picker v-if="item.filterType==='date'" v-model="queryModuleData[item.property.split(',')[0]]" type="date" placeholder="开始日期">-->
                  <!--</el-date-picker>-->
                  <!--<span v-if="item.filterType==='date'" v-show="item.property.includes(',')">至</span>-->
                  <!--<el-date-picker v-if="item.filterType==='date'" v-show="item.property.includes(',')" v-model="queryModuleData[item.property.split(',')[1]]" type="date" placeholder="结束日期">-->
                  <!--</el-date-picker>-->
                  <el-multi-cascader
                    ref="multiCascader"
                    :class="item.property"
                    v-if="item.filterType==='cascader'"
                    :show-all-levels="false"
                    :options="item.values"
                    multiple
                    filterable
                    clearable
                    :props="item.props"

                    change-on-select
                    selectChildren
                    v-model="queryModuleData[item.property]"> </el-multi-cascader>
                  <!--                  <el-cascader :change-on-select="true" :show-all-levels="false" v-if="item.filterType==='cascader'" collapse-tags filterable clearable v-model="queryModuleData[item.property]"-->
                  <!--                               :options="item.values" :props="defaultParams" placeholder="请选择"></el-cascader>-->
                </el-form-item>
              </el-form>
              <div class="clearWrap" v-if="drawerState"  id="clearWrap" >
                <el-popover
                  placement="top"
                  width="300"
                  v-model="addFilterState">
                  <div>过滤器名称</div>
                  <div><el-input type="text" v-model="schemeName"></el-input></div>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="addFilterState = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="addFilterScheme(2)">确定</el-button>
                  </div>
                  <el-button  size="mini" slot="reference"><span>保存</span></el-button>
                </el-popover>

                <el-button  size="mini"   @click="clearSearch"><span>重置</span></el-button>
                <el-button  type="primary" size="mini"  @click="handleSearch(0)">搜索</el-button>
              </div>
              <el-button style="position:absolute;top: 10px;right: 10px" type="text" size="small"  @click="queryFilter"><i class="el-icon-s-tools"></i>更多</el-button>
            </div>
          </transition>
        </el-button-group>
        <el-menu class="el-menu-demo" mode="horizontal" @select="handleSelect" v-allow="83">
          <el-submenu index="1">
            <template slot="title">新建</template>
            <el-submenu index="1-1" v-allow="152">
              <template slot="title">新建费用账单</template>
              <el-menu-item index="1-1-1" v-allow="180">账单</el-menu-item>
              <el-menu-item index="1-1-2" v-allow="181">内部账单</el-menu-item>
               <el-menu-item index="1-1-3">费用</el-menu-item>
            </el-submenu>
            <el-submenu index="1-2" v-if="$store.getters.permissions.includes(153)&&pageTitle==='案件管理'||(pageTitle==='递交官方'&&$store.getters.permissions.includes(183))" >
              <template slot="title">新建案件进程</template>
              <el-menu-item index="1-2-1" v-if="pageTitle==='案件管理'&&$store.getters.permissions.includes(182)">递交指令</el-menu-item>
              <el-menu-item index="1-2-2" v-allow="183">官方通知</el-menu-item>
              <el-menu-item index="1-2-2-2" v-if="pageTitle==='案件管理'">递交官方(文件)</el-menu-item>
              <el-menu-item index="1-2-3"  v-if="pageTitle==='案件管理'">客户往来</el-menu-item>
              <el-menu-item index="1-2-4"  v-if="pageTitle==='案件管理'">内部往来</el-menu-item>
              <el-menu-item index="1-2-5"  v-if="pageTitle==='案件管理'">外代所往来</el-menu-item>
              <el-menu-item index="1-2-6"  v-if="pageTitle==='案件管理'">对方当事人往来</el-menu-item>
              <!--<el-menu-item index="1-2-7">特批预立卷审批</el-menu-item>-->
            </el-submenu>
            <el-submenu index="1-3" v-allow="154">
              <template slot="title">新建时限</template>
              <el-menu-item index="1-3-1" v-allow="190">官方时限</el-menu-item>
              <el-menu-item index="1-3-2" v-allow="191">内部时限</el-menu-item>
            </el-submenu>
          </el-submenu>
        </el-menu>
<!--        <el-button type="primary" size="small" @click="handleSelect('批量操作')" >批量编辑</el-button>-->
<!--        <el-button type="primary" size="small" v-if="queryModuleData.instructionSubmitStatus!=1"-->
<!--                   v-show="(pageTitle==='递交官方'&&$store.getters.permissions.includes(80))" @click="toExamine">审核</el-button>-->
        <exportFile ref="exportFile" :downLoadState="downLoadState" :multipleSelection="multipleSelection" @getData="getExportFileData" @exportList="exportList" @close="closeSelect" :pageTitle="pageTitle" @multipleTypeText="changeMultiple"></exportFile>
        <el-button type="primary"  v-allow='247' size="small" v-if="pageTitle==='案件管理'"   @click="handleSelect('变更办案人')" >变更办案人</el-button>
        <el-button type="primary"  size="small" v-if="pageTitle==='案件管理'&& isSuggestion"  @click.native="handleSelect('立卷')" >立卷</el-button>

        <!--<i class="el-icon-rank" :style="{cursor: 'pointer',color:pattern?'#409EFF':'rgba(187,187,187)',transition:'all 0.5s',transform:pattern?'transform: rotate(180deg)':'transform: rotate(-180deg)'}" @click="changePattern"></i>-->
      </div>

    </div>
    <el-form label-width="120px"  @submit.native.prevent size="mini"  @keyup.enter.native="handleSearch(1)" style="margin:10px 0 20px 0">
      <template v-if="pageTitle=='案件管理'">
        <el-form-item label="我的案件:" style="margin-bottom: 0!important">
          <el-radio-group v-model="queryModuleData.myCase" @change="handleSearch(1)">
            <el-radio label="2">最近三日浏览</el-radio>
            <el-radio label="3">当日立卷</el-radio>
            <el-radio label="1">全部</el-radio>
          </el-radio-group>
        </el-form-item>
      </template>
      <template v-if="pageTitle=='递交官方'">
        <el-form-item  label="递交状态:" style="margin-bottom: 0!important">
          <el-radio-group v-model="queryModuleData.instructionSubmitStatus" @change="handleSearch(1)">
            <el-radio :label="1">当天递交</el-radio>
            <el-radio :label="0">全部</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item  label="递交日期:" class="djSubmitDateArray"  v-if="conditionsModuleList.map(item=>item.filterName).includes('递交日期')" >
          <DataPicker class="DataPicker" v-model="queryModuleData['djSubmitDateArray']" @change="changeDjSubmitDate"></DataPicker>
        </el-form-item>

      </template>
      <el-form-item label="官文状态:" v-if="pageTitle=='官方通知'" style="margin-bottom: 0!important">
        <el-radio-group v-model="queryModuleData.officialInformScreen" @change="handleSearch(1)">
          <el-radio label="1">当天收到</el-radio>
          <el-radio label="2">待报告</el-radio>
          <el-radio label="7">全部</el-radio>
        </el-radio-group>
      </el-form-item>
      <!--      <el-form-item  label="案件文号:" class="postInfo-container-item" style="margin-bottom: 0">-->
      <!--        <el-input type="text" clearable v-model="queryModuleData.agentNumStart" placeholder="请输入案件文号" @change="(value)=>changeTextRange(value,'agentNumEnd')"></el-input>-->
      <!--        <span>至</span>-->
      <!--        <el-input type="text" clearable v-model="queryModuleData.agentNumEnd"  placeholder="请输入案件文号" @change="handleSearch(1)" ></el-input>-->
      <!--      </el-form-item>-->
      <el-form-item label="快捷查询:" style="margin-bottom: 0">
        <el-input type="text" v-model="queryModuleData.regAndAgent" clearable  @change="handleSearch(1)" ></el-input>
      </el-form-item>
    </el-form>

    <section>
      <div style="display: flex;position: relative">
        <TitleTotal :total="total" />
        <div class="button_wrap" v-if="selectionState">
          <el-button class="exactButton"  type="primary"  size="mini" @click="gridApi.deselectAll();gridApi.selectAllFiltered()">全选</el-button>
          <el-button class="exactButton"  size="mini" @click="gridApi.deselectAll()">清除所选</el-button>
          <el-button class="exactButton" size="mini" type="primary" @click="jumpDetailSubmisson">{{multipleTypeText}}</el-button>
          <el-button class="exactButton"  size="mini" @click="selectionState=false">取消</el-button>
        </div>
        <el-button type="text" style="position: absolute;right: 0;bottom:-6px;font-size: 14px;padding-right: 6px" @click="exportList(2)"><i class="el-icon-download">导出</i></el-button>
      </div>
      <div class="content_wrap">
        <div class="left_wrap" :style="{width:currentCaseId&&pattern?leftWrapWidth:'100%' }">
          <div class="dots" @click="handleCheckboxState">
            <span class="dot">.</span>
            <span class="dot">.</span>
            <span class="dot">.</span>
          </div>
          <el-button class="brush_right" :class="brushRightHasFilter?'red':''" @click="brushRight" type="text" icon="el-icon-brush" ></el-button>
          <AgGridVue :style="{width:'100%',height: clientHeight+'px'}"
                     class="ag-theme-balham"
                     :columnDefs="columnDefs"
                     :rowData="caseList"
                     :rowSelection="selectionState?'multiple':'single'"
                     @grid-ready="onGridReady"
                     :gridOptions="gridOptions"
                     @dragStopped="dragStopped"
                     :getContextMenuItems="getContextMenuItems"
                     suppressAutoSize

                     animateRows
                     @rowSelected="rowSelected"
                     @rowDoubleClicked="rowDoubleClicked"

                     @rowClicked="rowClicked"
                     @sortChanged="refreshEvenRowsCurrencyData"
                     @filterChanged="refreshEvenRowsCurrencyData"
                     @selectionChanged="selectionChanged"
                     :localeText="$store.state.caseInformation.localeText"
                     :suppressDragLeaveHidesColumns="true"
                     :suppressMakeColumnVisibleAfterUnGroup="true"
                     rowGroupPanelShow="always"
                     :groupSelectsChildren="true"
                     :suppressAggFuncInHeader="true"
                     :autoGroupColumnDef="autoGroupColumnDef"
          >
          </AgGridVue>
<!--          <div class="w-table contextmenu">-->
<!--            <el-table-->
<!--              @row-contextmenu="rowContextmenu"-->
<!--              highlight-current-row-->
<!--              class="myeltable cube"-->
<!--              ref="caseListMultiple"-->
<!--              :data="caseList"-->
<!--              @cell-dblclick="cellDblclick"-->
<!--              :height="clientHeight"-->
<!--              @row-click="rowClick"-->
<!--              @current-change="changeRow"-->
<!--              :row-class-name="getRowClassName"-->
<!--              empty-text="暂无数据"-->
<!--              @select="handleSelectionChange"-->
<!--              @select-all="handleSelectionAll"-->
<!--              :header-cell-class-name="headerCellClassName"-->
<!--              :cell-class-name="getCellClassName"-->
<!--              @header-dragend="headerDragend"-->
<!--              @filter-change="filterChange"-->
<!--              :class="total<=listQuery.pageSize?'':'noTrigger'"-->
<!--              border-->
<!--            >-->
<!--              <template v-if="selectionState">-->
<!--                <el-table-column type="selection" width="30" class="selection"  >-->
<!--                </el-table-column>-->
<!--              </template>-->
<!--              <el-table-column type="index" width="60" label="序号" align="left">-->
<!--                <template slot="header" slot-scope="scope">-->
<!--                  <div class="dots" @click="handleCheckboxState">-->
<!--                    <span class="dot">.</span>-->
<!--                    <span class="dot">.</span>-->
<!--                    <span class="dot">.</span>-->
<!--                  </div>-->
<!--                  <span>序号</span>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column v-for="(col, index) in tableHeader" :key="index"-->
<!--                               :prop="col.prop"-->
<!--                               :label="col.label"-->
<!--                               :width="col.width"-->
<!--                               :min-width="getMinWidth(col,tableHeader,currentId)"-->
<!--                               :type="col.type"-->
<!--                               :header-align="col.headerAlign"-->
<!--                               :column-key="index.toString()"-->
<!--                               :render-header="renderHeader"-->
<!--                               :filters="unique(caseList.map(i=>({text:i[col.prop],value:i[col.prop]})),'value').filter(ii=>ii.value!='')"-->
<!--                               :filter-method="filterHandler"-->
<!--                               sortable-->
<!--                               filter-placement="bottom-start"-->
<!--              >-->
<!--                <template slot-scope="scope">-->
<!--                  <span  v-if="col.prop!=='imageFile'&&col.prop!='djRemarks'&&col.prop!='custName'&&col.prop!='isLackMaterial'" :title='scope.row[col.prop]' style="margin: 0;cursor: pointer"-->
<!--                         @click="col.prop=='agentNum'&&!pattern?takeCaseDetail(scope.row):''">-->
<!--                  {{scope.row[col.prop]}}-->
<!--                  </span>-->
<!--                  <div   @click.stop v-if="col.prop=='djRemarks'&&!scope.row.modifyState" :title='scope.row[col.prop]' style="margin: 0;cursor: pointer">-->
<!--                    {{scope.row[col.prop]}}-->
<!--                  </div>-->
<!--                  <div   @click.stop v-show="col.prop=='djRemarks'&&scope.row.modifyState" :title='scope.row[col.prop]' style="margin: 0;cursor: pointer">-->
<!--                    <el-input type="text" v-model="scope.row[col.prop]" @keydown.native.enter="saveInfo(scope.row)" @blur="saveInfo(scope.row)"/>-->
<!--                  </div>-->
<!--                  <CustCard v-if="col.prop=='custName'" :custName="scope.row.custName" :customerID="scope.row.custId" />-->
<!--                  <img class="filterTableTmg" v-if="col.prop==='imageFile'" :src="'/ipdoc'+scope.row['imageFile']" alt="">-->
<!--                  <div v-if="col.prop=='isLackMaterial'">-->
<!--                    <Checkbox  :value="scope.row.isLackMaterial" :true-label="'是'"></Checkbox>-->
<!--                  </div>-->
<!--                </template>-->
<!--              </el-table-column>-->

<!--            </el-table>-->
<!--          </div>-->
          <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :pageSizes="pageSizesList" :limit.sync="listQuery.pageSize" @pagination="queryCaseList" />
          <div class="checkbox" v-show="checkboxState" >
            <el-select ref="checkCaseSelect" v-model="checkCaseList" multiple   reserve-keyword	 filterable placeholder="请选择" collapse-tags :popper-append-to-body="false"  @visible-change="handleChange"
                       :filter-method="filterCheck">
              <template slot="">
                <div class="checkbox_bottom">
                  <el-button size="mini" round @click.stop="delPreference(1)">恢复默认</el-button>
                  <el-button style="margin-right: 3px" size="mini" round @click.stop="savePreference(1)">保存设置</el-button>
                  <!--<el-button size="mini" round @click.stop="checkNotAtAll">全不选</el-button>-->
                </div>
              </template>
              <el-option v-for="(item,idx) in selectColumnList.filter(item =>item.COLUMN_COMMENT.includes(filterText))" :key="item.COLUMN_NAME" :label="item.COLUMN_COMMENT" :value="item.COLUMN_NAME">
                <!--<el-checkbox v-model="selectBox[idx]">{{item.COLUMN_COMMENT}}</el-checkbox>-->
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="right_wrap" v-if="pattern" :style="{position:'relative','margin-left':currentCaseId&&pattern?'10px' :'0',height:clientHeight+'px'}">
          <!--<span class="el-icon-close" slot="close" style="cursor:pointer;position: absolute;right: 0;top: 10px;z-index: 1000" @click="closeCurrentRow"></span>-->
          <seeCaseDetail v-if="currentCaseId" :case-id="currentCaseId" :agentNum="agentNum" :case-type="caseType" :sign="1" filed="litigation" :backsign="false">
          </seeCaseDetail>
        </div>
      </div>
    </section>
    <el-dialog title="提示" :visible.sync="transferVisible" width="80%" >
      <el-transfer v-model="transferValue" @left-check-change="leftCheckChange" :key="transferData.filterId" :data="transferData" filterable filter-placeholder="请输入搜索内容"
                   :titles="['选择筛选项—全部案件', '已选']">
      </el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="transferVisible = false">取 消</el-button>
        <el-button type="primary" @click="configFilter">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="案件选择" :visible.sync="selectCaseVisible" width="40%" >
      <el-table :data="selectCaseList" border height="450">
        <el-table-column type="index" width="60" label="序号" align="left">
          <template slot-scope="scope">
            <span style="margin: 0;cursor: pointer" @click="takeCaseDetail(scope.row)">
              {{scope.$index+1}}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="案件文号" prop="agentNum">
          <template slot-scope="scope">
            <span style="margin: 0;cursor: pointer" @click="takeCaseDetail(scope.row)">
              {{scope.row.agentNum}}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="selectCaseVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <PdfPreview class="pdfPreview" v-if="pdfDataState" :pdf-data="pdfData" @closePdfPreview="pdfDataState=false"></PdfPreview>
    <Willtable v-if="showTable" :plType="plType" :changeType="getSelectedRows().length?getSelectedRows()[0].changeType:''" :reportMatter="getSelectedRows().length?getSelectedRows()[0].reportMatter:null"
               :materialTypeId="getSelectedRows().length?getSelectedRows()[0].materialTypeId:null" :caseTypeId="getSelectedRows().length?getSelectedRows()[0].caseTypeId:null" :caseIds='willtableCaseIdList'
                :showTable='showTable'  @closeTable='closeTable'>
    </Willtable>
    <el-dialog :title="uploadType" :visible.sync="uploadState" width="70%" >
      <el-table :data="getSelectedRows()" border>
        <el-table-column type="index" width="60" label="序号" align="left">
          <template slot-scope="scope">
            <span style="margin: 0;cursor: pointer" @click="takeCaseDetail(scope.row)">
              {{scope.$index+1}}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="left" v-for="(item,index) in preferenceList" :label="item.title" :prop="item.value" :width="item.width" :key="index">
          <template slot-scope="scope">
            <span :class="item.value=='agentNum'?'itemTitle_style':''" v-if="item.value!=='imageFile'&&item.value!='custName'" :title='scope.row[item.value]' style="margin: 0;cursor: pointer"
                  @click="takeCaseDetail(scope.row)">
              {{scope.row[item.value]}}
            </span>
            <CustCard v-if="item.value=='custName'" :custName="scope.row.custName" :customerID="scope.row.custId" />
            <img class="filterTableTmg" v-if="item.value==='imageFile'" :src="'ipdoc'+scope.row['imageFile']" alt="">
          </template>
        </el-table-column>
      </el-table>
      <BulkUploadFile :taskType="taskType" v-if="uploadState" :uploadType="uploadType" :curCaseId="getSelectedRows().map(item=>item.caseId)" @changeFalse="closeSelect"></BulkUploadFile>
    </el-dialog>
      <litigationSubmission :taskType="2" :business="business" v-if="submissionState" :submissionState="submissionState" :submissionType="submissionType" :multipleSelection="multipleSelectionCaseArray" :curCaseId="multipleSelectionCaseArray.map(item=>item.caseId)" @changeFalse="closeSelect"></litigationSubmission>
    <SelectOption :buss-id="bussId" v-if="selectionOptionState" :dialog-visible="selectionOptionState" @cancel="closeSelect" :idArray="getSelectedRows().map(item=>item[getCurFilterId(pageTitle)])" :defaultMultipleSelect="preferenceList.map(i=>i.title)" :exportType="exportType" :exportQueryModel="exportQueryModel"></SelectOption>
    <EmitSearch @undateSearch="undateSearch"></EmitSearch>
    <litigationOfficial :taskType="2" :business="business" v-if="officialCommunicationState" :officialCommunicationState="officialCommunicationState" :officialCommunicationType="officialCommunicationType" :multipleSelection="multipleSelectionCaseArray" @closeThisPage="closeSelect"/>
    <el-dialog
      ref="timeLimit"
      title="创建时限"
      append-to-body
      :visible.sync="timeLimitState"
      width="50%"
      height="100vh"
      :modal="false"
      top="0"
      class="pdfDialog"
      :close-on-click-modal="false"
      v-dialogDrag
    >
      <createTimeLimit :query="timeLimitData" @cancel="closeSelect"></createTimeLimit>
    </el-dialog>
    <el-dialog
      title="变更办案人"
      append-to-body
      :visible.sync="updateWkgState"
      width="60%"
      height="100vh"
      :modal="false"
      top="0"
      class="pdfDialog"
      :close-on-click-modal="false"
      v-dialogDrag
    >
      <CaseInvestigators :statusChange="true" ref="CaseInvestigators" v-if="updateWkgState" :caseDetailData="updateWkgData"></CaseInvestigators>
      <span slot="footer" class="dialog-footer" style="float: left">
        <el-button @click="updateWkgState = false">取 消</el-button>
        <el-button type="primary" @click="updateWkg">确 定</el-button>
      </span>
      <!--      <officialSubmission v-if="updateWkgState" :query="detailSubmissionData" @cancel="closeSelect"></officialSubmission>-->
    </el-dialog>
  </div>
</template>

<script>
import CaseInvestigators from "@/views/workbench/case/components/CaseInvestigators";
import Checkbox from "@/views/workbench/case/components/Checkbox"
import Pagination from "@/components/Pagination";
import FilterSelect from '@/components/FilterSelect'
import ManualIdentification from "@/views/workbench/case/components/ManualIdentification";
import { queryAllUrl } from "@/api/applicant";
import BulkUploadFile from '@/views/workbench/case/components/BulkUploadFile'
import litigationSubmission from '@/views/workbench/case/officialSubmission/components/litigationSubmission.vue'
import litigationOfficial from '@/views/workbench/case/officialCommunication/components/litigationOfficial.vue'
import exportFile from '@/components/exportFile'
import SelectOption from '@/views/workbench/case/components/SelectOption'
import OfficialDocuments from '@/views/workbench/case/components/OfficialDocuments'
import wTable from '@/components/dragTable'
import ViewsSwitching from '@/views/workbench/case/components/ViewsSwitching'
import MyTabs from '@/views/workbench/case/components/MyTabs'
import createTimeLimit from "@/views/workbench/toDoTasks/createTimeLimit";
import {
  addFilterScheme,
  delCase,
  selectColumn,
  savePreference,
  queryCaseList,
  queryPreference,
  delPreference,
  queryFilter,
  configFilter,
  queryFilterConfig,
  submitOfficalAudit,
  auditOfficalDoc,
  deleteCase,
  deleteDoc,
  deleteIns,
  queryCustomerNameId,
  getManualRecognitionOfficialInfoCount,
  recognizedError,
  getCaseByTmFileId,
  submitOfficalModify,
  queryCorrelationCaseList, copyCase, queryCaseWork,
  updateWkg
} from "@/api/caseList.js";
import PdfPreview from "@/views/workbench/case/components/ManualIdentification/PdfPreview";
import Willtable from "@/components/Willtable";
import { mapGetters,mapState } from "vuex";
import { downLoadAll ,throttle} from "@/utils";
import seeCaseDetail from '@/views/workbench/case/components/ManualIdentification/seeCaseDetail'
import {browserBehavior} from '../../components/browserBehavior'
import Bus from "../../../../../utils/Bus";
export default {
  props: {
    field:{
      default:'litigation'
    },
    business: {
      type: Number,
      default: 2
    },
    bussId: {
      type: Number,
      default: 5
    },
    getCaseList: {
      type: Function,
      default: queryCaseList
    },
    // queryModuleData: {
    //   type: Object,
    //   default: () => ({})
    // },
    pageTitle: {
      type: String
    },
    dialogVisible: {
      type: Boolean,
      default: true
    }
  },
  name: "litigationCase",
  data() {
    var tableHeader=[]
    if(localStorage.getItem('tableHeader')&&JSON.parse(localStorage.getItem('tableHeader')).find(item=>item.name==this.$options.name+this.$route.name+this.field)){
      tableHeader=JSON.parse(localStorage.getItem('tableHeader')).find(item=>item.name==this.$options.name+this.$route.name+this.field).tableHeader
    }
    return {
      caseType: '',
      isSuggestion: false,
      updateWkgData: {},
      updateWkgState: false,
      selectionOptionState:false,
      plType: "",
      drawerState:false,
      queryModuleData: {
        instructionSubmitStatus: ""
      },
      tableOption:{
        maxHeight:200
      },
      submissionType:'',
      currentCaseId:'',
      pageSizesList:[10, 50, 200,500,1000,5000,10000],
      uploadType: '',
      uploadState: false,
      selectBox: [],
      filterText: "",
      showTable: false,
      ManualIdentificationState: false,
      checkboxState: false, // 表头筛选框状态
      transferVisible: false, // 配置筛选条件框
      transferData: [], // 筛选条件数据
      transferValue: [], // 当前筛选条件id
      caseList: [], // 当前列表数据
      checkCaseList: [], // 当前选中表头条件
      selectColumnList: [], // 配置表头总列数据做循环用
      preferenceList: [], // 循环表头数据
      filterData: {}, // 表头过滤数据
      conditionsModuleList: [], // 渲染筛选条件
      caseListDefault: [], // 案件默认全部列表
      checkFilterList: [], // 控制筛选漏斗状态
      firstRequest: false, //第一次请求
      listQuery: {
        pageNo: 0,
        pageSize: JSON.parse(localStorage.getItem('pageSize'))?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name)?JSON.parse(localStorage.getItem('pageSize')).find(item=>item.name==this.$route.name).pageSize:10:10
      },
      total: 0,
      submissionState:false,
      listLoading: false,
      defaultParams: {
        //級聯菜單默認
        value: "caseTypeId",
        label: "caseType",
        children: "childrens",
        checkStrictly: true,
        multiple: true
      },
      multipleSelection: [],
      multipleSelectionCaseArray:[],
      selectionState: false,
      multipleTypeText: "递交",
      pdfData: [],
      pdfDataState: false,
      willtableCaseIdList: [],
      selectCaseVisible: false,
      selectCaseList: [],
      officialInfoCount: 0,
      forCount: 100,
      requireList:[],
      otherSelect:false,
      downLoadState:false,
      exportListState:false,
      lastRow:'',
      startRow:'',
      rowList:[],
      dragState: {
        start: -1, // 起始元素的 index
        end: -1, // 结束元素的 index
        move: -1, // 移动鼠标时所覆盖的元素 index
        dragging: false, // 是否正在拖动
        direction: undefined // 拖动方向
      },
      tableHeader: tableHeader,
      currentId:'',
      clearWrapTop:0,
      tableHeaderLabelList:[],
      myTabsActivity: false,
      curFilterSelect:{},
      rowContextmenuList: [
        // { name:'复制立案',action: 'createCase',permissions:18},
        // { name: '相关案件', action: 'relevant' },
        { name:'暂存', action: 'temporarStorage'},
        // { name:'暂存(批量)', action: 'temporarStorageAll'},
        { name:'隐藏', action: 'hidden'},
        // { name:'隐藏(批量)', action: 'hiddenAll'},

      ],
      identification:'litigationCasecase_managementlitigation',
      filterDataSum:{},
      operationState:1,
      officialInfoCounData:{},
      addFilterState:false,
      schemeName:'',
      officialCommunicationState:false,
      officialCommunicationType:'create',
      gridOptions:{...this.$store.state.caseInformation.gridOptions,...{
          statusBar: {
            statusPanels: [
              { statusPanel: 'agSelectedRowCountComponent', align: 'left' },
            ]
          },
          //floatingFilter: true,
        }
      },
      currentPageSize:0,
      defaultcolumnDefs:[
        {
          headerName: '序号',
          field: 'sid',
          width: 80,
          enableRowGroup: true,
          // enablePivot: true,
          floatingFilter:true,
          filter: false,
          cellClass: 'vAlign',
          cellRenderer:this.cellRenderer,
          suppressMenu: true,
          checkboxSelection: false,
          headerCheckboxSelection: false,
          headerCheckboxSelectionFilteredOnly: true
        },
      ],
      columnDefs: [

      ],
      autoGroupColumnDef:{
        headerName: '组',
        field: 'group',
        headerCheckboxSelection: true,
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: { checkbox: true },
      },
      timeLimitState:false,
      timeLimitData:{
        agentNums: [], kind: ''
      },
      agentNum: '',
      brushRightHasFilter:false,
      leftWrapWidth:localStorage.getItem('leftWrapWidth')?localStorage.getItem('leftWrapWidth'):'60%'
    };
  },
  created() {
    this.init();

  },
  mounted(){
    document.getElementById('searchWrap').onscroll=function (e) {
      this.clearWrapTop = e.target.scrollTop+ e.target.offsetHeight
      document.getElementById('clearWrap').style.top = this.clearWrapTop -40 + 'px'
    }
    new this.$DraginResize(document.querySelector(".left_wrap"), {
      clone: true,
      end(info) {
        if (info.dir == 'ver') {
          this.elem.style.height = info.height + 'px';
        }
        else if (info.dir == 'hor') {
          this.elem.style.width = info.width + 'px';
          localStorage.setItem('leftWrapWidth', info.width + 'px')
        }
      }
    })
  },
  methods: {
    init(){
      browserBehavior()
      Bus.$on('keyboardEvents', context => {
        if(!this.selectionState){
          if(context==40){
            if( this.gridApi.rowModel.rootNode.childrenAfterSort[this.gridApi.rowModel.rootNode.childrenAfterSort.indexOf(this.gridApi.selectionController.lastSelectedNode)+1]){
              this.gridApi.rowModel.rootNode.childrenAfterSort[this.gridApi.rowModel.rootNode.childrenAfterSort.indexOf(this.gridApi.selectionController.lastSelectedNode)+1].setSelected(true, true);
            }
          }
          if(context==38){
            if( this.gridApi.rowModel.rootNode.childrenAfterSort[this.gridApi.rowModel.rootNode.childrenAfterSort.indexOf(this.gridApi.selectionController.lastSelectedNode)-1]){
              this.gridApi.rowModel.rootNode.childrenAfterSort[this.gridApi.rowModel.rootNode.childrenAfterSort.indexOf(this.gridApi.selectionController.lastSelectedNode)-1].setSelected(true, true);
            }
          }
        }
        switch (context) {
          case 112: this.$store.getters.permissions.includes(180)?this.handleSelect('1-1-1' ):'';break;
          case 113:this.$store.getters.permissions.includes(181)?this.handleSelect('1-1-2' ):'';break;
          case 114:this.$store.getters.permissions.includes(182)?this.handleSelect('1-2-1' ):''; break;
          case 115:this.$store.getters.permissions.includes(183)?this.handleSelect('1-2-2' ):''; break;

          case 117: this.handleSelect('1-2-2-2');break;
          case 118: this.handleSelect('1-2-3');break;
          case 119: this.handleSelect('1-2-4');break;
          case 120: this.handleSelect('1-2-5');break;
          case 121: this.handleSelect('1-2-6');break;
          case 122:this.$store.getters.permissions.includes(190)? this.handleSelect('1-3-1' ):'';break;
          case 123:this.$store.getters.permissions.includes(191)? this.handleSelect('1-3-2' ):'';break;
          default:return
        }
      })
      localStorage.setItem('field','4')
      this.$store.commit('caseInformation/SET_BUSSID',this.bussId)
      if (this.pageTitle === "官方通知") {
        this.getManualRecognitionOfficialInfoCount();
      }
      if(this.$route.query.instructionSubmitStatus){
        this.$set(this.queryModuleData, "instructionSubmitStatus",Number(this.$route.query.instructionSubmitStatus));
        this.queryCaseList();
      } else {
        this.queryFilterConfig(1);
      }
      this.getAllWfs();
      if(this.pageTitle=='递交官方'){
        this.changeKeepAlive()
      }
    },
    rowSelected(params){
      if(!this.selectionState){
        this.rowClicked(params)
      }
    },
    rowClicked(param){
      if(param.node.selected){
        if(param.data[this.getCurFilterId(this.pageTitle)]!=this.currentId){
          this.currentId=''
          this.currentCaseId=''
          this.$nextTick(()=>{
            this.currentId=param.data[this.getCurFilterId(this.pageTitle)]
            this.currentCaseId=param.data.caseId
            this.caseType = param.data.caseType
            this.agentNum = param.data.agentNum
          })
        }
      }
    },
    refreshEvenRowsCurrencyData(params) {
      this.currentPageSize = params.api.rowModel.rootNode.allChildrenCount
      if(!params.columnApi.columnController.groupAutoColumns) {
        this.gridApi.forEachNode(rowNode => {
          rowNode.setDataValue(
            'sid',
            rowNode.rowIndex + 1)
        });
      }
      // if(this.caseList.length){
      //   this.$commonUtils.saveFilterModel(this.$options.name+this.$route.name,'FilterModel',this.gridApi.getFilterModel())
      // }
      if(this.caseList.length){
        if(params.type=="filterChanged"){
          this.$commonUtils.saveFilterModel(this.$options.name+this.$route.name,'FilterModel',this.gridApi.getFilterModel())
          var data = this.$commonUtils.getFilterModel(this.$options.name + this.$route.name, 'FilterModel');
          var arr = Object.keys(data);
          if(arr.length){
            this.brushRightHasFilter=true
          }else {
            this.brushRightHasFilter=false
          }
        }
        if(params.type=="sortChanged"){
          this.$commonUtils.saveFilterModel(this.$options.name+this.$route.name,'SortModel',this.gridApi.getSortModel())
        }
      }
    },
    updateWkg(){

      updateWkg(Object.assign( this.$refs.CaseInvestigators.caseDetailFoemData,{caseIds:this.getSelectedRows().map(item=>item.caseId)})).then(res=>{
        this.queryCaseList()
        this.updateWkgState=false
        this.selectionState=false
      })
    },
    selectionChanged(params,n){
      if (this.multipleTypeText === "递交") {
        if ([...new Set(this.getSelectedRows().map(item => item.custName))].length >= 2) {
          this.$message.error("您必须选择同一客户下的案件");
        }
        if ([...new Set(this.getSelectedRows().map(item => item.caseType))].length >= 2) {
          this.$message.error("您必须选择同一案件类型的案件");
        }
        if ([...new Set(this.getSelectedRows().map(item => item.appCnName))].length >= 2) {
          this.$message.error("您必须选择同一申请人下的案件");
        }
      }

      if (this.multipleTypeText === "新建账单" || this.multipleTypeText === "新建内部账单") {
        if ([...new Set(this.getSelectedRows().map(item => item.custName))].length >= 2) {
          this.$message.error("您必须选择同一客户下的案件");
        }
      }
      if (this.multipleTypeText === "批量操作") {
        if ([...new Set(this.getSelectedRows().map(item => item.caseTypeId))].length >= 2) {
          this.$message.error("您必须选择同一案件类型的案件");
        }
        if (this.multipleSelection.length&&(this.getSelectedRows()[0].caseTypeId==48||this.getSelectedRows()[0].caseTypeId==165)&&[...new Set(this.getSelectedRows().map(item => item.changeType))].length >= 2) {
          this.$message.error("您必须选择同一撤回类型的案件");
        }
      }
      if (this.multipleTypeText === "报官清单"){
        if(this.requireList.length){
          this.requireList.forEach(thisType =>{
            if ([...new Set(this.multipleSelection.map(item => item[thisType['value']]))].length >= 2) {
              this.$message.error(`该选择需要${thisType.label}相同`);
            }
          })
        }
      }
    },
    cellRenderer(params){
      if(params.colDef.field=='imageFile'){
        return  `<img class="filterTableTmg"  src="/ipdoc${params.value}" alt="">`
      }
      if(params.colDef.field=='isLackMaterial'){
        if (params.value=='是'){
          return `<label role="checkbox" class="el-checkbox is-checked" aria-checked="true"><span aria-checked="mixed" class="el-checkbox__input is-checked"><span class="el-checkbox__inner"></span><input type="checkbox" aria-hidden="true" class="el-checkbox__original" value=""></span><!----></label>`
          } else {
          return `<label role="checkbox" class="el-checkbox" aria-checked="true"><span aria-checked="mixed" class="el-checkbox__input"><span class="el-checkbox__inner"></span><input type="checkbox" aria-hidden="true" class="el-checkbox__original" value=""></span><!----></label>`
          }
      }
      if(params.colDef.field=='agentNum'){
        var eDiv = document.createElement('div');
        eDiv.innerHTML = `<span class="btn-simple" title="${params.value}">${params.value?params.value:''}</span>`
        var eButton = eDiv.querySelectorAll('.btn-simple')[0];

        eButton.addEventListener('click', ()=> {
          if(!this.pattern){
            this.takeCaseDetail(params.data)
          }
        });

        return eDiv;
      }
      if(params.colDef.field=='sid'){
        return params.rowIndex+1
      }
      return `<span title="${params.value}">${params.value?params.value:''}</span>`
    },
    rowDoubleClicked(params){
      var row=params.data
      if(this.pageTitle!=='案件管理'){
        this.getViewRow(row)
      } else {
        this.takeCaseDetail(row)
      }
    },
    changeSelection(n){
      if(n){
        this.columnDefs.find(item=>item.field=='sid').checkboxSelection=function(params) {
          // we put checkbox on the name if we are not doing grouping
          return params.columnApi.getRowGroupColumns().length === 0;
        },
          this.columnDefs.find(item=>item.field=='sid').headerCheckboxSelection= function(params) {
            // we put checkbox on the name if we are not doing grouping
            return params.columnApi.getRowGroupColumns().length === 0;
          }
        this.columnDefs.push({})
        this.columnDefs.pop({})
      }else {
        this.columnDefs.find(item=>item.field=='sid').checkboxSelection=false
        this.columnDefs.find(item=>item.field=='sid').headerCheckboxSelection=false
        this.columnDefs.push({})
        this.columnDefs.pop({})
      }
    },
    getSelectedRows() {
      if (this.selectionState) {
        const selectedNodes = this.gridApi.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data);
        return selectedData
      } else {
        return []
      }
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.columnApi = params.columnApi;
    },
    dragStopped(params){
      let tableHeader=params.columnApi.columnController.gridColumns.map(item=>({
        label:item.colDef.headerName,
        width:item.actualWidth,
        prop:item.colDef.field,
      })).filter(item=>item.prop!='sid'&&item.prop!="group")
      var arr=JSON.parse(localStorage.getItem('tableHeader'))
      arr.find(item=>item.name==this.$options.name+this.$route.name+this.field).tableHeader=tableHeader
      localStorage.setItem('tableHeader',JSON.stringify(arr))
      this.changeHeader(tableHeader)
      // console.log(a);
    },

    getContextMenuItems(params){
      if(!params.node.data){
        return []
      }
      return this.getRowContextmenuList(params.node.data).map(item=>({
        name: item.name,
        action: () =>{
          this[item.action](params.node.data,params.value)
        },
      }))
    },
    editableTab(data){
      if(data&&data!=0){
        this.myTabsActivity=true
      }else {
        this.myTabsActivity=false
      }
    },
    changeMultiple(text){
      this.multipleTypeText=text
    },
    clickoutside(){
      this.drawerState = false
    },
    // closeCurrentRow(){
    //   this.currentCaseId=''
    //   this.currentId=''
    // },
    changeHeader(n){
      if(n&&n.length){
        this.checkCaseList=n.map(item => item.prop)
        let list2 = this.checkCaseList.map(item => ({
          title: this.selectColumnList.find(i => i.COLUMN_NAME === item)
            .COLUMN_COMMENT,
          value: item
        }));
        const data = {
          userId: this.userId,
          bussId: this.bussId,
          list2
        };
        savePreference(data).then(res => {
          // this.tableState=false
          // this.$nextTick(()=>{
          //   //  this.tableState=true
          //   this.caseList.push({})
          //   this.caseList.pop()
          // })
        });
      }
      // this.selectColumnList=
      // console.log(this.selectColumnList);
      // this.savePreference(1)
    },
    saveInfo(row){
      const data = {
        custId: row.custId,
        userId: this.$store.getters.userId,
        caseIds: row.caseId,
        materialTypeId: row.materialTypeId,
        insIdList: row.insId,
        remarks:row.djRemarks
      }
      submitOfficalModify(data).then(res => {
        this.$set(row,'modifyState',false)
      })
    },
    cellDblclick(row,column, cell, event){

      if(this.pageTitle!=='案件管理'){
        this.getViewRow(row)
      } else {
        this.takeCaseDetail(row)
      }
    },
    rowClick(row, column, event){
      // this.currentId=''
      // this.currentCaseId=''
      // this.$nextTick(()=>{
      //   this.currentId=row[this.getCurFilterId(this.pageTitle)]
      //   this.currentCaseId=row.caseId
      // })
      // if(type===1){
      //   console.log(type);
      //
      //   return
      // }

      if(row[this.getCurFilterId(this.pageTitle)]!=this.currentId){
        this.currentId=''
        this.currentCaseId=''
        this.$nextTick(()=>{
          this.currentId=row[this.getCurFilterId(this.pageTitle)]
          this.currentCaseId=row.caseId
        })
      }else {

      }
      if(this.selectionState){
        if(this.multipleSelection.find(item=>item[this.getCurFilterId(this.pageTitle)]==row[this.getCurFilterId(this.pageTitle)])){
          this.multipleSelection=this.multipleSelection.filter(item=>item[this.getCurFilterId(this.pageTitle)]!=row[this.getCurFilterId(this.pageTitle)])
          this.$refs.caseListMultiple.toggleRowSelection(row, false)
          this.startRow=''
        } else {
          var flag=true
          this.multipleSelection.push(row)
          if (this.multipleTypeText === "递交") {
            if ([...new Set(this.multipleSelection.map(item => item.custName))].length >= 2) {
              this.$message.error("您必须选择同一客户下的案件");
              this.$refs.caseListMultiple.toggleRowSelection(row, false);
              this.multipleSelection = this.multipleSelection.filter(
                item =>
                  item[this.getCurFilterId(this.pageTitle)] !==
                  row[this.getCurFilterId(this.pageTitle)]
              );
              flag=false
            }
            if ([...new Set(this.multipleSelection.map(item => item.caseType))].length >= 2) {
              this.$message.error("您必须选择同一案件类型的案件");
              this.$refs.caseListMultiple.toggleRowSelection(row, false);
              this.multipleSelection = this.multipleSelection.filter(
                item =>
                  item[this.getCurFilterId(this.pageTitle)] !==
                  row[this.getCurFilterId(this.pageTitle)]
              );
              flag=false
            }
            if ([...new Set(this.multipleSelection.map(item => item.appCnName))].length >= 2) {
              this.$message.error("您必须选择同一申请人下的案件");
              this.multipleSelection.filter(item => item.appCnName !== this.multipleSelection[0].appCnName).forEach(row => {
                this.$refs.caseListMultiple.toggleRowSelection(row, false);
                this.multipleSelection = this.multipleSelection.filter(
                  item =>
                    item[this.getCurFilterId(this.pageTitle)] !==
                    row[this.getCurFilterId(this.pageTitle)]
                );
              });
              flag=false
            }
          }
          if (this.multipleTypeText === "新建账单" || this.multipleTypeText === "新建内部账单") {
            if ([...new Set(this.multipleSelection.map(item => item.custName))].length >= 2) {
              this.$message.error("您必须选择同一客户下的案件");
              this.$refs.caseListMultiple.toggleRowSelection(row, false);
              this.multipleSelection = this.multipleSelection.filter(
                item =>
                  item[this.getCurFilterId(this.pageTitle)] !==
                  row[this.getCurFilterId(this.pageTitle)]
              );
              flag=false
            }
          }
          if (this.multipleTypeText === "批量操作") {
            if ([...new Set(this.multipleSelection.map(item => item.caseTypeId))].length >= 2) {
              this.$message.error("您必须选择同一案件类型的案件");
              this.$refs.caseListMultiple.toggleRowSelection(row, false);
              this.multipleSelection = this.multipleSelection.filter(
                item =>
                  item[this.getCurFilterId(this.pageTitle)] !==
                  row[this.getCurFilterId(this.pageTitle)]
              );
              flag=false
            }
            if (this.multipleSelection.length&&(this.multipleSelection[0].caseTypeId==48||this.multipleSelection[0].caseTypeId==165)&&[...new Set(this.multipleSelection.map(item => item.changeType))].length >= 2) {
              this.$message.error("您必须选择同一撤回类型的案件");
              this.$refs.caseListMultiple.toggleRowSelection(row, false);
              this.multipleSelection = this.multipleSelection.filter(
                item =>
                  item[this.getCurFilterId(this.pageTitle)] !==
                  row[this.getCurFilterId(this.pageTitle)]
              );
              flag=false
            }
          }
          if (this.multipleTypeText === "报官清单"){
            if(this.requireList.length){
              this.requireList.forEach(thisType =>{
                if ([...new Set(this.multipleSelection.map(item => item[thisType['value']]))].length >= 2) {
                  this.$message.error(`该选择需要${thisType.label}相同`);
                  this.multipleSelection.filter(item => item[thisType['value']]!== this.multipleSelection[0][thisType['value']]).forEach(row => {
                    this.$refs.caseListMultiple.toggleRowSelection(row, false);
                    this.multipleSelection = this.multipleSelection.filter(item => item[this.getCurFilterId(this.pageTitle)] !== row[this.getCurFilterId(this.pageTitle)]);
                  });
                  flag=false
                }
              })
            }
          }
          if(event.shiftKey){
            if(this.startRow){
              this.lastRow = row[this.getCurFilterId(this.pageTitle)]
              if(this.lastRow==this.startRow){
                this.lastRow=''
              }
            }
            if(!this.startRow&&flag) {
              this.startRow= row[this.getCurFilterId(this.pageTitle)]
              return
            }
            this.tableselectRow(this.rowList)
            this.rowList = []
          } else {
            if(!this.startRow&& flag){
              this.startRow=row[this.getCurFilterId(this.pageTitle)]
            }
          }
        }
      }
    },
    changeRow(row){
      if(!this.pattern){
        return
      }
      var that=this
      // console.log(this.$refs.caseListMultiple.$el.querySelector('.el-table__body'));
      document.onkeydown=throttle((event)=> {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if(e && e.keyCode==40){ //下
          if(that.caseList.find((item,index)=>index==that.caseList.map(item=>item[that.getCurFilterId(that.pageTitle)]).indexOf(that.currentId)+1)){
            that.$refs.caseListMultiple.setCurrentRow( that.caseList.find((item,index)=>index==that.caseList.map(item=>item[that.getCurFilterId(that.pageTitle)]).indexOf(that.currentId)+1))
          }
        }
        if(e && e.keyCode==38){ // 上
          if(that.caseList.find((item,index)=>index==that.caseList.map(item=>item[that.getCurFilterId(that.pageTitle)]).indexOf(that.currentId)-1)){
            that.$refs.caseListMultiple.setCurrentRow(that.caseList.find((item,index)=>index==that.caseList.map(item=>item[that.getCurFilterId(that.pageTitle)]).indexOf(that.currentId)-1))
          }
        }
      }, 300)
      this.currentId=''
      this.currentCaseId=''
      this.$nextTick(()=>{
        this.currentId=row[that.getCurFilterId(that.pageTitle)]
        this.currentCaseId=row.caseId
      })
    },
    closeSelect(){
      this.timeLimitState=false
      this.selectionState=false
      this.selectionOptionState=false
      this.uploadState = false
      this.ManualIdentificationState = false
      this.submissionState=false
      this.officialCommunicationState=false
      this.uploadType=''
    //  this.$emit('closeModel')
      this.changeKeepAlive()
    },
    checkBox(e,property,values){
      if(this.queryModuleData[property].includes('')&&this.queryModuleData[property].filter(item=>item).length!=values.filter(item=>item).length){
        this.queryModuleData[property]=this.queryModuleData[property].filter(item=>item)
      }
      if(e[e.length-1]==''){
        this.queryModuleData[property]=values.map(item=>item.id)
      }
    },
    newlovingVue1(value,property){
      property.split(',').forEach((item,index)=>{
        this.queryModuleData[item]=value[index]
      })
    },
    getManualRecognitionOfficialInfoCount() {
      getManualRecognitionOfficialInfoCount().then(res => {
        this.officialInfoCount = res.data.count;
        this.officialInfoCounData=res.data
      });
    },
    recognizedError() {
      if (!this.multipleSelection.length) {
        return;
      }
      recognizedError({
        tmFileIds: this.multipleSelection.map(item => item.tmFileId).join(",")
      }).then(res => {
        this.officialInfoCount += this.multipleSelection.length;
        this.multipleSelection=[]
        this.queryCaseList();
      });
    },
    takeCaseDetail(row) {

      this.closeSelect()
      if (this.pageTitle === "官方通知") {
        getCaseByTmFileId({ tmFileId: row.tmFileId }).then(res => {
          if (res.data.length > 1) {
            this.selectCaseList = res.data;
            this.selectCaseVisible = true;
          } else {
            this.$router.push("/workbench/case/seeCaseDetail/" + row.caseId+'?taskType=2&caseType='+row.caseType);
            this.selectCaseVisible = false;
          }
        });
      } else {
        this.$router.push("/workbench/case/seeCaseDetail/" + row.caseId+'?taskType=2&caseType='+row.caseType);
      }
    },
    closeTable(bool) {
      this.showTable = bool;
      this.selectionState=false
      this.queryCaseList();
    },
    pdfPre({ address }) {
      downLoadAll({ url: "ipdoc" + address, target: "_blank" });
      // this.pdfData = addressList
      //   .filter(item => /\.pdf$/i.test(item))
      //   .map(item => ({ url: "ipdoc" + item }));
      // if (this.pdfData.length) {
      //   this.pdfDataState = true;
      // }
    },
    takeManualIdentification() {
      this.ManualIdentificationState = true;
    },
    handleSelect(key, keyPath) {
      this.requireList=[]
      this.otherSelect=false
      this.exportListState=false
      if (key === "1-2-1") {
        this.queryModuleData.shortcuts = 1;
        this.multipleSelection = [];
        this.selectionState = true;
        this.multipleTypeText = "递交";
        // console.log(JSON.parse(JSON.stringify(this.queryModuleData)));
        // this.queryCaseList();
        // delete this.queryModuleData.shortcuts;
      }
      if (key === "1-2-2") {
        this.queryModuleData.shortcuts = 1;
        this.multipleSelection = [];
        this.selectionState = true;
        this.multipleTypeText = "官方通知";
        // this.queryCaseList();
        // delete this.queryModuleData.shortcuts;
      }
      if (key === "1-1-1") {
        this.selectionState = true;
        this.multipleTypeText = "新建账单";


        // this.queryCaseList();
      }
      if (key === "1-1-2") {
        this.queryModuleData.shortcuts = 1;
        this.multipleSelection = [];
        this.selectionState = true;
        this.multipleTypeText = "新建内部账单";
        // this.queryCaseList();
        // delete this.queryModuleData.shortcuts;
      }
      if (key === "1-1-3") {
        this.multipleSelection = [];
        this.selectionState = true;
        this.multipleTypeText = "新建费用";
      }
      if (key === "1-3-1") {
        this.selectionState = true;
        this.multipleTypeText = "新建官方时限";
        // this.queryCaseList();
      }
      if (key === "1-3-2") {
        this.selectionState = true;
        this.multipleTypeText = "新建内部时限";
        // this.queryCaseList();
      }
      if (key === "1-2-2-2") {
        this.selectionState = true;
        this.multipleTypeText = "递交官方(文件)";
        this.uploadType = "递交官方";
        // this.queryCaseList();
      }
      if (key === "1-2-3") {
        this.selectionState = true;
        this.multipleTypeText = "客户往来";
        this.uploadType = "客户往来";
        // this.queryCaseList();
      }
      if (key === "1-2-4") {
        this.selectionState = true;
        this.multipleTypeText = "内部往来";
        this.uploadType = "内部往来";
        // this.queryCaseList();
      }
      if (key === "1-2-5") {
        this.selectionState = true;
        this.multipleTypeText = "外代所往来";
        this.uploadType = "外代所往来";
        // this.queryCaseList();
      }
      if (key === "1-2-6") {
        this.selectionState = true;
        this.multipleTypeText = "对方当事人往来";
        this.uploadType = "对方当事人往来";
        // this.queryCaseList();
      }
      if (key === "1-2-7") {
        this.selectionState = true;
        this.multipleTypeText = "特批预立卷审批";
        this.uploadType = "特批预立卷审批";
        // this.queryCaseList();
      }
      if (key === "批量操作") {
        this.selectionState = true;
        this.multipleTypeText = "批量操作";
        // this.queryCaseList();
      }
      if (key === "文件下载") {
        this.selectionState = true;
        this.multipleTypeText = "文件下载";
      }
      if (key === "变更办案人") {
        this.selectionState = true;
        this.multipleTypeText = "变更办案人";
      }
      if (key === "立卷") {
        console.log(12345)
        this.selectionState = true;
        this.multipleTypeText = "立卷";
        if (this.multipleTypeText === "立卷") {
        if(this.getSelectedRows().length > 1) {
          this.$message.error('只能选择一个案件！')
        }else if(this.getSelectedRows().length == 1) {
          if(this.getSelectedRows()[0].caseType == '建议') {
            sessionStorage.setItem('suggestRowData', JSON.stringify(this.getSelectedRows()[0]))
            this.$router.push({path:'registration',query:{
              // data:this.getSelectedRows()[0]
                caseId: this.getSelectedRows()[0].caseId,
                custName: this.getSelectedRows()[0].custName,
                custLevel: this.getSelectedRows()[0].custLevel,
                custId: this.getSelectedRows()[0].custId,
                caseTypeId: this.getSelectedRows()[0].caseTypeId
              }
            })
            this.selectionState = false
          }else {
            this.$message.warning('仅支持建议类型案件立卷')
          }

        }else {
          this.$message.warning('请选择案件！')
        }
        // queryCaseWork({caseId:this.getSelectedRows()[0].caseId}).then(res=>{
        //   // this.updateWkgData= res.data
        //   this.updateWkgData={...{caseTypeId:this.getSelectedRows()[0].caseTypeId,trademarkCaseCustWorkgroups:[{ wkgId: "" }],trademarkCaseCBWorkgroups:[],trademarkCaseLCWorkgroups:[{groupName:''}]},...res.data}
        //
        //   this.updateWkgState = true;
        // })

      }
      }
    },
    exportList(flag){
      this.exportType=flag
      if(flag==2){
        this.otherSelect=false
        this.selectionState = true;
        this.multipleTypeText = '列表导出';
        this.exportListState=true
      } else if(flag == 1) {
        // this.otherSelect = false
        // this.exportListState = false
        // this.multipleSelection = []
        this.selectionOptionState=true
      }
    },
    toExamine() {
      this.selectionState = true;
      this.requireList=[]
      this.otherSelect=false
      this.exportListState=false
      // this.multipleSelection.forEach(item=>{
      //   this.$refs.caseListMultiple.toggleRowSelection([{row:item,selected:true}])
      // })
      this.multipleSelection = [];
      this.multipleTypeText = "审核";
      if (this.pageTitle === "官方通知") {
        if(!this.queryModuleData.officialInformScreen){
          this.queryModuleData.officialInformScreen="1"
        } else if(this.queryModuleData.officialInformScreen == '7' ){
          this.queryModuleData.officialInformScreen="1"
        }
      }
      if (this.pageTitle === "递交官方") {
        if (!([6,7,2].includes(this.queryModuleData.instructionSubmitStatus))) {
          this.$set(this.queryModuleData, "instructionSubmitStatus", 6);
        }
      }
      this.operationState=1
      this.queryCaseList();
    },
    getLanglist(array) {
      let arr = [];
      array.forEach(item => {
        arr.push(...item);
      });
      return arr;
    },
    jumpDetailSubmisson() {
      if (!this.getSelectedRows().length) {
        this.$message.error("请先选择！");
        return;
      }
      if (this.getSelectedRows().length && this.multipleTypeText === "递交") {
        if (this.pageTitle === "官方通知"||this.pageTitle === "递交官方") {
          let list = this.unique(
            this.getSelectedRows(),
            this.getCurFilterId(this.pageTitle)
          );
          let caseList = this.getLanglist(list.map(item => item.caseArray))
          this.multipleSelectionCaseArray=caseList
          this.submissionState=true
          // this.$router.push({
          //   path: "/workbench/case/detailSubmission",
          //   query: { caseIds: caseIds, pageType: "1" }
          // });
        } else {
          this.multipleSelectionCaseArray = this.getSelectedRows()
          this.submissionState=true
          this.submissionType='create'
        }
      }
      if (this.getSelectedRows().length && this.multipleTypeText === "变更办案人") {
        queryCaseWork({caseId:this.getSelectedRows()[0].caseId}).then(res=>{
          // this.updateWkgData= res.data
          this.updateWkgData={...{caseTypeId:this.getSelectedRows()[0].caseTypeId,trademarkCaseCustWorkgroups:[{ wkgId: "" }],trademarkCaseCBWorkgroups:[],trademarkCaseLCWorkgroups:[{groupName:''}]},...res.data}

          this.updateWkgState = true;
        })

      }
      //立卷
      if (this.multipleTypeText === "立卷") {
        if(this.getSelectedRows().length > 1) {
          this.$message.error('只能选择一个案件！')
        }else if(this.getSelectedRows().length == 1) {
          if(this.getSelectedRows()[0].caseType == '建议') {
            sessionStorage.setItem('suggestRowData', JSON.stringify(this.getSelectedRows()[0]))
            this.$router.push({path:'registration',query:{
              // data:this.getSelectedRows()[0]
                caseId: this.getSelectedRows()[0].caseId,
                custName: this.getSelectedRows()[0].custName,
                custLevel: this.getSelectedRows()[0].custLevel,
                custId: this.getSelectedRows()[0].custId,
                caseTypeId: this.getSelectedRows()[0].caseTypeId
              }
            })
            this.selectionState = false
          }else {
            this.$message.warning('仅支持建议类型案件立卷')
          }

        }else {
          this.$message.warning('请选择案件！')
        }
        // queryCaseWork({caseId:this.getSelectedRows()[0].caseId}).then(res=>{
        //   // this.updateWkgData= res.data
        //   this.updateWkgData={...{caseTypeId:this.getSelectedRows()[0].caseTypeId,trademarkCaseCustWorkgroups:[{ wkgId: "" }],trademarkCaseCBWorkgroups:[],trademarkCaseLCWorkgroups:[{groupName:''}]},...res.data}
        //
        //   this.updateWkgState = true;
        // })

      }
      if (this.getSelectedRows().length && this.multipleTypeText === "官方通知") {
        if (this.pageTitle === "官方通知"||this.pageTitle === "递交官方") {
          let list = this.unique(
            this.getSelectedRows(),
            this.getCurFilterId(this.pageTitle)
          );
           let caseList = this.getLanglist(list.map(item => item.caseArray));
          // let caseIds = caseList.map(item => item.caseId);
          this.multipleSelectionCaseArray=caseList
          this.officialCommunicationState=true
          this.officialCommunicationType='create'
        } else {
          let info = this.unique(this.getSelectedRows(), "caseId");
          info.forEach(item => {
            delete item.insId;
          });
          this.multipleSelectionCaseArray = this.getSelectedRows()
          // const queryInfo = {
          //   caseIds: [
          //     ...new Set(this.multipleSelection.map(item => item.caseId))
          //   ],
          //   pageType: "1",
          //   info
          // };
          this.officialCommunicationState=true
          this.officialCommunicationType='create'
         // this.$emit("getCaseQueryInfo", queryInfo);
        }
      }
      // if (
      //   this.getSelectedRows().length &&
      //   this.multipleTypeText === "审核" &&
      //   this.pageTitle === "递交官方"
      // ) {
      //   const data = {
      //     userId: this.$store.getters.userId,
      //     caseIds: [
      //       ...new Set(this.getSelectedRows().map(item => item.caseId))
      //     ],
      //     insIdList: this.getSelectedRows().map(item => item.insId),
      //     result: 1
      //   };
      //   submitOfficalAudit(data).then(res => {
      //     if (res.success) {
      //       this.selectionState=false
      //       this.queryCaseList();
      //     }
      //   });
      // }
      // if (
      //   this.getSelectedRows().length &&
      //   this.multipleTypeText === "审核" &&
      //   this.pageTitle === "官方通知"
      // ) {
      //   let list = this.unique(
      //     this.getSelectedRows(),
      //     this.getCurFilterId(this.pageTitle)
      //   );
      //   let caseList = this.getLanglist(list.map(item => item.caseArray));
      //   let caseIds = caseList.map(item => item.caseId);
      //   const data = {
      //     userId: this.$store.getters.userId,
      //     caseIds: caseIds,
      //     insIdList: this.getSelectedRows().map(item => item.tmFileId),
      //     result: 1
      //   };
      //   auditOfficalDoc(data).then(res => {
      //     if (res.success) {
      //       this.selectionState=false
      //       this.queryCaseList();
      //     }
      //   });
      // }
      if (
        this.getSelectedRows().length &&
        this.multipleTypeText === "新建账单"
      ) {
        if (this.pageTitle !== "案件管理") {
          let list = this.unique(
            this.getSelectedRows(),
            this.getCurFilterId(this.pageTitle)
          );
          let caseIds = this.getLanglist(list.map(item => item.caseArray)).map(
            item => item.caseId
          );
          this.$router.push({
            path: "/workbench/finance/off_bill/bill",
            query: { caseIdList: caseIds }
          });
        } else {
          this.$router.push({
            path: "/workbench/finance/off_bill/bill",
            query: {
              caseIdList: [
                ...new Set(this.getSelectedRows().map(item => item.caseId))
              ]
            }
          });
        }
        this.selectionState=false
      }
      if (
        this.getSelectedRows().length &&
        this.multipleTypeText === "新建内部账单"
      ) {
        if (this.pageTitle !== "案件管理") {
          let list = this.unique(
            this.getSelectedRows(),
            this.getCurFilterId(this.pageTitle)
          );
          let caseIds = this.getLanglist(list.map(item => item.caseArray)).map(
            item => item.caseId
          );
          this.$router.push({
            path: "/workbench/finance/off_bill/bill",
            query: { caseIdList: caseIds }
          });
        } else {
          this.$router.push({
            path: "/workbench/finance/off_bill/insideBill",
            query: {
              caseIdList: [
                ...new Set(this.getSelectedRows().map(item => item.caseId))
              ]
            }
          });
        }
        this.selectionState=false
      }
      if (
        this.getSelectedRows().length &&
        this.multipleTypeText === "新建官方时限"
      ) {
        if (this.pageTitle !== "案件管理") {
          let list = this.unique(
            this.getSelectedRows(),
            this.getCurFilterId(this.pageTitle)
          );
          let agentNums = this.getLanglist(list.map(item => item.caseArray))
            .map(item => item.agentNum)
            .join(",");
          this.timeLimitData={
            agentNums: agentNums, kind: 1
          }
          this.timeLimitState=true
        } else {
          this.timeLimitData={
            agentNums: [
              ...new Set(this.getSelectedRows().map(item => item.agentNum))
            ].join(","),
            kind: 1
          }
          this.timeLimitState=true
        }
        this.selectionState=false
      }
      if (
        this.getSelectedRows().length &&
        this.multipleTypeText === "新建内部时限"
      ) {
        if (this.pageTitle !== "案件管理") {
          let list = this.unique(
            this.getSelectedRows(),
            this.getCurFilterId(this.pageTitle)
          );
          let agentNums = this.getLanglist(list.map(item => item.caseArray))
            .map(item => item.agentNum)
            .join(",");
          this.timeLimitData={
            agentNums: agentNums, kind: 2
          }
          this.timeLimitState=true
        } else {
          this.timeLimitData={
            agentNums: [
              ...new Set(this.getSelectedRows().map(item => item.agentNum))
            ].join(","),
            kind: 2
          }
          this.timeLimitState=true
        }
        this.selectionState=false
      }
      if (
        this.getSelectedRows().length &&
        this.multipleTypeText === "新建费用"
      ) {
        if (this.pageTitle !== "案件管理") {
          let list = this.unique(
            this.getSelectedRows(),
            this.getCurFilterId(this.pageTitle)
          );
          let agentNums = this.getLanglist(list.map(item => item.caseArray))
            .map(item => item.agentNum)
            .join(",");

          this.$router.push({
            path: "/workbench/finance/addFeeDetail/1",
            query: { agentNums: agentNums, kind: 2 }
          });
        } else {
          this.$router.push({
            path: "/workbench/finance/addFeeDetail/1",
            query: {
              agentNums: [
                ...new Set(this.getSelectedRows().map(item => item.agentNum))
              ].join(","),
              kind: 2
            }
          });
        }
        this.selectionState=false
      }
      if (
        this.getSelectedRows().length &&
        this.multipleTypeText === "批量操作"
      ) {
        this.plType = this.pageTitle;
        if (this.pageTitle === "官方通知") {
          // let list = this.unique(
          //   this.multipleSelection,
          //   this.getCurFilterId(this.pageTitle)
          // );
          // let caseIdList = this.getLanglist(
          //   list.map(item => item.caseArray)
          // ).map(item => item.tmFileId);
          this.willtableCaseIdList = [
            ...new Set(this.getSelectedRows().map(item => item.tmFileId))
          ];
          // this.willtableCaseIdList = caseIdList;
          this.showTable = true;
        } else {
          if (this.pageTitle === "递交官方") {
            this.willtableCaseIdList = [
              ...new Set(this.getSelectedRows().map(item => item.insId))
            ];
          } else {
            this.willtableCaseIdList = [
              ...new Set(this.getSelectedRows().map(item => item.caseId))
            ];
          }

          this.showTable = true;
        }
      }
      if(this.otherSelect){
        this.downLoadState=true
        this.$nextTick(()=>{
          this.downLoadState=false
        })
      }
      if(this.exportListState){
        this.selectionOptionState=true
        this.exportListState=false
      }
      if(this.uploadType){
        this.uploadState=true
      }
      // if(!this.otherSelect&&!this.selectionOptionState){
      //   this.uploadState=true
      // }
      // this.selectionState = false;
    },
    getCurFilterId(title) {
      switch (title) {
        case "案件管理":
          return "caseId";
        case "递交官方":
          return "insId";
        case "官方通知":
          return "insId";
      }
    },
    getExportFileData(requireList,key){
      if(key){
        this.$refs.exportFile.currentType=key
      }
      // this.$refs.caseListMultiple.newTableStore.states.selection.forEach(item=>{
      //   this.$refs.caseListMultiple.toggleRowSelection([{row:item,selected:false}])
      // })
      //this.$refs.caseListMultiple.newTableStore.states.selection=[]
      this.selectionState=true
      this.multipleTypeText='报官清单'
      this.otherSelect=true
      this.exportListState=false
      this.requireList=requireList
    },
    intercept(val){
      if(!this.requireList.length){
        return
      }
      this.requireList.forEach(thisType =>{
        if ([...new Set(this.multipleSelection.map(item => item[thisType['value']]))].length >= 2) {
          this.$message.error(`该选择需要${thisType.label}相同`);
          this.multipleSelection.filter(item => item[thisType['value']]!== this.multipleSelection[0][thisType['value']]).forEach(row => {
            this.$refs.caseListMultiple.toggleRowSelection(row, false);
            this.multipleSelection = this.multipleSelection.filter(item => item[this.getCurFilterId(this.pageTitle)] !== row[this.getCurFilterId(this.pageTitle)]);
          });
        }
      })
    },
    tableselectRow(){

      let indexOfList=[this.caseList.map(item=>Number(item[this.getCurFilterId(this.pageTitle)])).indexOf(Number(this.startRow)),this.caseList.map(item=>Number(item[this.getCurFilterId(this.pageTitle)])).indexOf(Number(this.lastRow))].sort((a,b)=>a-b)
      this.rowList=this.caseList.filter((item,index)=>index>=indexOfList[0]&&index<=indexOfList[1])
      if (this.multipleTypeText === "递交") {
        if ([...new Set(this.rowList.map(item => item.custName))].length >= 2) {
          this.$message.error("您必须选择同一客户下的案件");
          this.rowList=this.rowList.filter(item=>item.custName==this.rowList[0].custName)
        }
        if ([...new Set(this.rowList.map(item => item.caseType))].length >= 2) {
          this.$message.error("您必须选择同一案件类型的案件");
          this.rowList=this.rowList.filter(item=>item.caseType==this.rowList[0].caseType)
        }
        if ([...new Set(this.rowList.map(item => item.appCnName))].length >= 2) {
          this.$message.error("您必须选择同一申请人下的案件");
          this.rowList=this.rowList.filter(item=>item.appCnName==this.rowList[0].appCnName)
        }
      }
      if (this.multipleTypeText === "新建账单" || this.multipleTypeText === "新建内部账单") {
        if ([...new Set(this.rowList.map(item => item.custName))].length >= 2) {
          this.$message.error("您必须选择同一客户下的案件");
          this.rowList=this.rowList.filter(item=>item.custName==this.rowList[0].custName)
        }
      }
      if (this.multipleTypeText === "批量操作") {
        if ([...new Set(this.rowList.map(item => item.caseTypeId))].length >= 2) {
          this.$message.error("您必须选择同一案件类型的案件");
          this.rowList=this.rowList.filter(item=>item.caseTypeId==this.rowList[0].caseTypeId)
        }
        if (this.rowList.length&&this.rowList[0].caseTypeId==48&&[...new Set(this.rowList.map(item => item.changeType))].length >= 2) {
          this.$message.error("您必须选择同一撤回类型的案件");
          this.rowList=this.rowList.filter(item=>item.changeType==this.rowList[0].changeType)
        }
      }
      if(this.multipleTypeText === "报官清单"){
        this.requireList.forEach(thisType =>{
          if ([...new Set(this.rowList.map(item => item[thisType['value']]))].length >= 2) {
            this.$message.error(`该选择需要${thisType.label}相同`);
            this.rowList=this.rowList.filter(item=>item[thisType['value']]==this.rowList[0][thisType['value']])
          }
        })
      }
      // this.intercept()
      this.rowList.forEach(item => {
        this.$refs.caseListMultiple.toggleRowSelection(this.caseList.find(i=>i[this.getCurFilterId(this.pageTitle)]==item[this.getCurFilterId(this.pageTitle)]), true);
        this.multipleSelection = this.unique(
          this.multipleSelection.concat([item]),
          this.getCurFilterId(this.pageTitle)
        );
      })
      this.startRow=''
      this.lastRow=''
    },
    handleSelectionAll(val) {
      val = val.filter(item => item !== undefined);
      this.multipleSelection = this.unique(
        this.multipleSelection.concat(val),
        this.getCurFilterId(this.pageTitle)
      );
      this.intercept(val)
      if (this.multipleTypeText === "递交") {
        if ([...new Set(this.multipleSelection.map(item => item.custName))].length >= 2) {
          this.$message.error("您必须选择同一客户下的案件");
          this.multipleSelection.filter(item => item.custName !== this.multipleSelection[0].custName).forEach(row => {
            this.$refs.caseListMultiple.toggleRowSelection(row, false);
            this.multipleSelection = this.multipleSelection.filter(item => item[this.getCurFilterId(this.pageTitle)] !== row[this.getCurFilterId(this.pageTitle)]);
          });
        }
        if ([...new Set(this.multipleSelection.map(item => item.caseType))].length >= 2) {
          this.$message.error("您必须选择同一类型下的案件");
          this.multipleSelection
            .filter(
              item => item.caseType !== this.multipleSelection[0].caseType
            )
            .forEach(row => {
              this.$refs.caseListMultiple.toggleRowSelection(row, false);
              this.multipleSelection = this.multipleSelection.filter(
                item =>
                  item[this.getCurFilterId(this.pageTitle)] !==
                  row[this.getCurFilterId(this.pageTitle)]
              );
            });
        }
        if (
          [...new Set(this.multipleSelection.map(item => item.appCnName))]
            .length >= 2
        ) {
          this.$message.error("您必须选择同一申请人下的案件");
          this.multipleSelection
            .filter(
              item => item.appCnName !== this.multipleSelection[0].appCnName
            )
            .forEach(row => {
              this.$refs.caseListMultiple.toggleRowSelection(row, false);
              this.multipleSelection = this.multipleSelection.filter(
                item =>
                  item[this.getCurFilterId(this.pageTitle)] !==
                  row[this.getCurFilterId(this.pageTitle)]
              );
            });
        }
      }
      if (
        this.multipleTypeText === "新建账单" ||
        this.multipleTypeText === "新建内部账单"
      ) {
        if (
          [...new Set(this.multipleSelection.map(item => item.custName))]
            .length >= 2
        ) {
          this.$message.error("您必须选择同一客户下的案件");
          this.multipleSelection
            .filter(
              item => item.custName !== this.multipleSelection[0].custName
            )
            .forEach(row => {
              this.$refs.caseListMultiple.toggleRowSelection(row, false);
              this.multipleSelection = this.multipleSelection.filter(
                item =>
                  item[this.getCurFilterId(this.pageTitle)] !==
                  row[this.getCurFilterId(this.pageTitle)]
              );
            });
        }
      }
      if (this.multipleTypeText === "批量操作") {
        if (
          [...new Set(this.multipleSelection.map(item => item.caseTypeId))]
            .length >= 2
        ) {
          this.$message.error("您必须选择同一案件类型");
          this.multipleSelection.filter(item => item.caseTypeId !== this.multipleSelection[0].caseTypeId).forEach(row => {
            this.$refs.caseListMultiple.toggleRowSelection(row, false);
            this.multipleSelection = this.multipleSelection.filter(
              item => item[this.getCurFilterId(this.pageTitle)] !== row[this.getCurFilterId(this.pageTitle)]);
          });
          if (this.multipleSelection.length&&(this.multipleSelection[0].caseTypeId==48||this.multipleSelection[0].caseTypeId==165)&&[...new Set(this.multipleSelection.map(item => item.changeType))].length >= 2) {
            this.$message.error("您必须选择同一撤回类型");
            this.multipleSelection.filter(item => item.changeType !== this.multipleSelection[0].changeType).forEach(row => {
              this.$refs.caseListMultiple.toggleRowSelection(row, false);
              this.multipleSelection = this.multipleSelection.filter(
                item => item[this.getCurFilterId(this.pageTitle)] !== row[this.getCurFilterId(this.pageTitle)]);
            });
          }
        }
      }
      if (!val.length) {
        this.caseList.forEach(row => {
          this.multipleSelection = this.multipleSelection.filter(
            item =>
              item[this.getCurFilterId(this.pageTitle)] !==
              row[this.getCurFilterId(this.pageTitle)]
          );
        });
      }
    },

    handleSelectionChange(val, row) {
      val = val.filter(item => item != undefined);
      this.multipleSelection = this.unique(
        this.multipleSelection.concat(val),
        this.getCurFilterId(this.pageTitle)
      );
      if (!val.find(item => item[this.getCurFilterId(this.pageTitle)] === row[this.getCurFilterId(this.pageTitle)])) {
        this.multipleSelection = this.multipleSelection.filter(
          item =>
            item[this.getCurFilterId(this.pageTitle)] !==
            row[this.getCurFilterId(this.pageTitle)]
        );
        this.startRow=''
      }
      this.intercept(val)
      if (this.multipleTypeText === "递交") {
        if ([...new Set(this.multipleSelection.map(item => item.custName))].length >= 2) {
          this.$message.error("您必须选择同一客户下的案件");
          this.$refs.caseListMultiple.toggleRowSelection(row, false);
          this.multipleSelection = this.multipleSelection.filter(
            item =>
              item[this.getCurFilterId(this.pageTitle)] !==
              row[this.getCurFilterId(this.pageTitle)]
          );
        }
        if ([...new Set(this.multipleSelection.map(item => item.caseType))].length >= 2) {
          this.$message.error("您必须选择同一案件类型的案件");
          this.$refs.caseListMultiple.toggleRowSelection(row, false);
          this.multipleSelection = this.multipleSelection.filter(
            item =>
              item[this.getCurFilterId(this.pageTitle)] !==
              row[this.getCurFilterId(this.pageTitle)]
          );
        }
        if ([...new Set(this.multipleSelection.map(item => item.appCnName))].length >= 2) {
          this.$message.error("您必须选择同一申请人下的案件");
          this.multipleSelection.filter(item => item.appCnName !== this.multipleSelection[0].appCnName).forEach(row => {
            this.$refs.caseListMultiple.toggleRowSelection(row, false);
            this.multipleSelection = this.multipleSelection.filter(
              item =>
                item[this.getCurFilterId(this.pageTitle)] !==
                row[this.getCurFilterId(this.pageTitle)]
            );
          });
        }
      }
      if (this.multipleTypeText === "新建账单" || this.multipleTypeText === "新建内部账单") {
        if ([...new Set(this.multipleSelection.map(item => item.custName))].length >= 2) {
          this.$message.error("您必须选择同一客户下的案件");
          this.$refs.caseListMultiple.toggleRowSelection(row, false);
          this.multipleSelection = this.multipleSelection.filter(
            item =>
              item[this.getCurFilterId(this.pageTitle)] !==
              row[this.getCurFilterId(this.pageTitle)]
          );
        }
      }
      if (this.multipleTypeText === "批量操作") {
        if ([...new Set(this.multipleSelection.map(item => item.caseTypeId))].length >= 2) {
          this.$message.error("您必须选择同一案件类型的案件");
          this.$refs.caseListMultiple.toggleRowSelection(row, false);
          this.multipleSelection = this.multipleSelection.filter(
            item =>
              item[this.getCurFilterId(this.pageTitle)] !==
              row[this.getCurFilterId(this.pageTitle)]
          );
        }
        if (this.multipleSelection.length&&(this.multipleSelection[0].caseTypeId==48||this.multipleSelection[0].caseTypeId==165)&&[...new Set(this.multipleSelection.map(item => item.changeType))].length >= 2) {
          this.$message.error("您必须选择同一撤回类型的案件");
          this.$refs.caseListMultiple.toggleRowSelection(row, false);
          this.multipleSelection = this.multipleSelection.filter(
            item =>
              item[this.getCurFilterId(this.pageTitle)] !==
              row[this.getCurFilterId(this.pageTitle)]
          );
        }
      }
    },
    unique(data, key) {
      const hash = {};
      const data2 = data.reduce((preVal, curVal) => {
        hash[curVal[key]]
          ? ""
          : (hash[curVal[key]] = true && preVal.push(curVal));
        return preVal;
      }, []);
      return data2;
    },
    remoteMethod(value, index, property, filterName) {
      if (value && filterName === "客户") {
        queryCustomerNameId({ pageNo: 1, pageSize: 100, keyword: value }).then(
          res => {
            this.$set(
              this.conditionsModuleList[index],
              "valueList",
              res.data.map(item => ({ id: item.custId, value: item.name }))
            );
            this.$forceUpdate();
          }
        );
      }
      if (value && ["申请人姓名", "被申请人", "转让人"].includes(filterName)) {
        queryAllUrl({
          applicantName: value,
          pageNo: 1,
          pageSize: 100,
          orderBy:1
        }).then(res => {
          this.$set(
            this.conditionsModuleList[index],
            "valueList",
            res.data.map(item => ({
              id: item.applicantName,
              value: item.applicantName,
              value1: item.applicantEnName,
              value2: item.applicantAddress,
              value3: item.applicantEnAddress
            }))
          );
          this.$forceUpdate();
        });

      }
      if (
        value &&
        filterName !== "客户" &&
        !["申请人姓名", "被申请人", "转让人"].includes(filterName)
      ) {
        this.$set(
          this.conditionsModuleList[index],
          "valueList",
          this.conditionsModuleList[index].values
            .filter(item =>
              item.value
                ? item.value
                  .toLocaleUpperCase()
                  .includes(value.toLocaleUpperCase())
                : false
            )
            .slice(0, 100)
        );
        this.$forceUpdate();
      }
    },
    changeTextRange(value, property) {
      this.$set(this.queryModuleData, property, value);
      // if(property=='agentNumEnd'){
      //   this.handleSearch(1)
      // }
    },
    leftCheckChange(e) {
      // if (e.length + this.transferValue.length > 15) {
      //   this.$message({
      //     type: "warning",
      //     message: `您最多选择15项`
      //   });
      //   e.pop();
      // }
    },
    changePattern(e){
      if(e===1){
        this.$store.commit('user/SET_PATTERN',false)
      } else {
        this.$store.commit('user/SET_PATTERN',true)
        // if(this.caseList.length&&!this.currentId){
        //   let row=this.caseList.find((item,index)=>index==0)
        //   this.currentId=row[this.getCurFilterId(this.pageTitle)]
        //   this.currentCaseId=row.caseId
        //    this.$refs.caseListMultiple.setCurrentRow(row)
        // }
      }
    },
    changeDjSubmitDate(e){
      if(this.drawerState){
        return
      }
      if(e.filter(item=>item).length===2){
        this.$set(this.queryModuleData,'instructionSubmitStatus',0)
        this.handleSearch(1)
      }else if(e.filter(item=>item).length===0){
        this.handleSearch(1)
      }
    },
    handleSearch(flag) {
      this.operationState=flag
      this.drawerState=false
      this.selectionState = false;
      this.listQuery.pageNo = 1;
      this.queryCaseList();
      if(JSON.parse(localStorage.getItem('queryModuleData'))){
        var arr = JSON.parse(localStorage.getItem('queryModuleData'))
      }else {
        var arr = []
      }
      if(arr.find(item=>item.name==this.$route.name+this.field)){
        arr.find(item=>item.name==this.$route.name+this.field).queryModuleData=this.queryModuleData
      }else {
        arr.push({name:this.$route.name+this.field,queryModuleData:this.queryModuleData})
      }
      localStorage.setItem('queryModuleData',JSON.stringify(arr))
    },
    clearSearch() {
      for (var key in this.queryModuleData) {
        if(!['officialInformScreen', 'myCase', 'instructionSubmitStatus'].includes(key)){
          if(key.includes('Date')){
            this.$set(this.queryModuleData,key,['',''])
          } else if(key.includes('Array')) {
            this.$set(this.queryModuleData,key,[])
          }else if(key==='caseTypeIds'||key==='deptGroupIds'){
            this.$set(this.queryModuleData,key,[])
          }else{
            this.$set(this.queryModuleData,key,null)
          }
        }
      }
      if(this.$refs.multiCascader){
        this.$refs.multiCascader.forEach(item=>{
          item.$el.querySelector('.el-input__inner').value=''
        })
      }
      //this.listQuery.pageNo = 1;
      // this.queryCaseList();
    },
    editFun(row) {
      if(this.pageTitle=='递交官方'){
        this.multipleSelectionCaseArray=row.caseArray
        this.submissionState=true
        this.submissionType='edit'
      }
      if(this.pageTitle=='官方通知'){
        this.multipleSelectionCaseArray=row.caseArray
        this.officialCommunicationState=true
        this.officialCommunicationType='edit'
      }
      if(this.pageTitle=='案件管理'){
        this.$emit('getCaseRow',row)
      }
    },
    getViewRow(row){
      if(this.pageTitle=='官方通知'){
        this.multipleSelectionCaseArray=row.caseArray
        this.officialCommunicationState=true
        this.officialCommunicationType='view'
      }
      // this.$emit("getViewRow", row);
    },
    queryCaseList() {
      this.startRow=''
      this.lastRow=''
      const data = {
        business: this.business,
        pageNo: this.listQuery.pageNo,
        pageSize: this.listQuery.pageSize
      };

      for (var key in this.queryModuleData) {
        if (Object.prototype.toString.call(this.queryModuleData[key]).includes("Date")) {
          this.queryModuleData[key] = this.formatDate(this.queryModuleData[key]);
        }
        if(this.queryModuleData[key]===null){
          delete this.queryModuleData[key]
        }
      }
      const querData=Object.assign(data, this.queryModuleData)
      if(this.operationState){
        for (var key in querData) {
          if(!['business', 'pageNo', 'pageSize','shortcuts'].includes(key)){
            if(!['officialInformScreen','djSubmitDateArray','myCase', 'regAndAgent','instructionSubmitStatus'].includes(key)){
              delete querData[key]
            }
          }
        }
      } else {
        for (var key in querData) {
          if(!['business', 'pageNo', 'pageSize','shortcuts'].includes(key)){
            if(['officialInformScreen',  'myCase', 'instructionSubmitStatus'].includes(key)||![...this.conditionsModuleList.map(item=>item.property),...['agentNumStart', 'agentNumEnd', 'goodClasses', 'regNumber',  'tmName']].includes(key)){
              delete querData[key]
            }
          }
        }
      }
      this.getCaseList()(querData).then(
        res => {
          res.data.forEach(item=>{
            for(var key in item){
              if(!item[key]){
                item[key]=''
              }
            }
          })
          this.caseListDefault = JSON.parse(JSON.stringify(res.data))
          this.total = res.total;
          this.caseList = res.data
          this.currentId=''
          this.currentCaseId=''
          this.caseList.forEach(item => {
            if (item.tmFileId) {
              item.insId = item.tmFileId;
            }
          });
          if(this.caseList.length){
            this.getFilterModel()
          }
          if(this.caseList.some(item=>item.caseType == '建议')) {
            // this.selectionState = true
            this.isSuggestion = true
          }else {
            this.isSuggestion = false
            this.selectionState = false
          }

        }
      );
    },
    getFilterModel(){
      this.$nextTick(()=>{
        let data =   this.$commonUtils.getFilterModel(this.$options.name+this.$route.name,'FilterModel')
        let arr =  Object.keys(data)
        let arrInstance=arr.map(item=>this.gridApi.getFilterInstance(item))
        arrInstance.forEach((item,index)=>{
          item.selectNothing()
          item.setModel(data[arr[index]])
          item.applyModel()
        })
        this.gridApi.onFilterChanged()

      })
    },
    brushRight(){

      let data =   this.$commonUtils.getFilterModel(this.$options.name+this.$route.name,'FilterModel')
      let arr =  Object.keys(data)
      arr.forEach(item=>{
        this.gridApi.destroyFilter(item)
      })
      // this.columnDefs.map(item=>item.field).forEach(item=>{
      //   this.gridApi.getFilterInstance(item).selectNothing()
      //   // this.gridApi.getFilterInstance(item).setModel(data[arr[index]])
      // })
    },
    handleChange(boolean) {
      if (!boolean) {
        this.checkboxState = false;
        // const els1 = this.$el.getElementsByClassName("checkbox")[0];
        // els1.children[0].click();
      }
    },
    savePreference(num) {

      let list2 = this.checkCaseList.map(item => ({
        title: this.selectColumnList.find(i => i.COLUMN_NAME === item)
          .COLUMN_COMMENT,
        value: item
      }));
      const data = {
        userId: this.userId,
        bussId: this.bussId,
        list2
      };
      savePreference(data).then(res => {
        if (res.success) {
          this.checkboxState = false;
          this.filterText=''
          if (!num) {
            this.queryCaseList();
          }
          this.getAllWfs();
        }
      });
    },
    delPreference(num) {
      const data = {
        userId: this.userId,
        bussId: this.bussId
      };
      delPreference(data).then(res => {
        if (res.success) {
          this.checkboxState = false;
          if (!num) {
            this.queryCaseList();
          }
          this.getAllWfs();
        }
      });
    },
    filterDataChange() {
      // this.caseList=this.multiFilter(this.caseListDefault,this.filterData)
      let arr = JSON.parse(JSON.stringify(this.caseListDefault));
      const filterKeys = Object.keys(this.filterData);
      filterKeys.forEach(key => {
        if (this.filterData[key].length !== 0 && !key.includes("List")) {
          arr = arr.filter(itm => {
            var flag = false;
            this.filterData[key].forEach(item => {
              if (item === itm[key]) {
                flag = true;
              }
            });
            return flag;
          });
        }
      });
      this.caseList = arr;
    },
    checkAllOrNot(prop) {
      if (
        this.filterData[prop].length !== this.filterData[prop + "List"].length
      ) {
        this.filterData[prop] = [];
        this.filterData[prop + "List"].forEach(item => {
          this.filterData[prop].push(item);
        });
      } else {
        this.filterData[prop] = [];
      }
      this.filterDataChange();
    },
    handleCheckboxState() {
      this.checkboxState = !this.checkboxState;
      // if (this.checkboxState) {
      //   this.setWidth();
      // }
    },
    saveLocation(){
      if(!localStorage.getItem('tableHeader')){
        let arr=[]
        arr.push({name:this.$options.name+this.$route.name+this.field,tableHeader:this.tableHeader})
        localStorage.setItem('tableHeader',JSON.stringify(arr))
      }else {
        let arr=JSON.parse(localStorage.getItem('tableHeader'))
        if(arr.find(item=>item.name==this.$options.name+this.$route.name+this.field)) {
          arr.find(item => item.name==this.$options.name+this.$route.name+this.field).tableHeader = this.tableHeader
          localStorage.setItem('tableHeader',JSON.stringify(arr))
        } else {
          arr.push({name:this.$options.name+this.$route.name+this.field,tableHeader:this.tableHeader})
          localStorage.setItem('tableHeader',JSON.stringify(arr))
        }
      }

    },
    getAllWfs() {
      const data = {
        userId: this.userId,
        bussId: this.bussId
      };
      Promise.all([selectColumn(data), queryPreference(data)]).then(res => {
        this.selectColumnList = res[0].data;

        this.preferenceList = res[1].data;
        this.columnDefs=[...this.defaultcolumnDefs,...this.preferenceList.map(item=>({
          headerName: item.title,
          field: item.value,
          width:this.getLoactionWidth(item.title)=='auto'?200:this.getLoactionWidth(item.title),
          resizable: true,
          sortable: true,
          filter: 'agSetColumnFilter',
          cellRenderer:this.cellRenderer,
          menuTabs: ['filterMenuTab','generalMenuTab','columnsMenuTab'],
          enableRowGroup: true,
          filterParams: {
            newRowsAction: 'keep',
             comparator: (a, b)=>{
              return this.$commonUtils.sort(a,b,item.value)
            }
          }
        }))]
        this.$nextTick(()=>{
          this.columnDefs.forEach(item=>{
            this.columnApi.getColumn(item.field).addEventListener('menuVisibleChanged', ()=>{
              if(document.querySelector(".ag-tabs")){
                new this.$DraginResize(document.querySelector(".ag-set-filter-list"), {
                  clone: true,
                  end(info) {
                    if (info.dir == 'ver') {
                      this.elem.style.height = info.height + 'px';
                    }
                    else if (info.dir == 'hor') {
                      this.elem.style.width = info.width + 'px';
                    }
                  }
                })
              }
              let data =   this.$commonUtils.getFilterModel(this.$options.name+this.$route.name,'FilterModel')
              let arr =  Object.keys(data)
              if(this.columnDefs.map(itm => itm.field).diff(arr).includes(item.field)){
                this.gridApi.getFilterInstance(item.field).selectNothing()
              }
            });
          })
        })
        this.tableHeader=this.preferenceList.map(item=>({label:item.title, prop:item.value,width: this.getLoactionWidth(item.title)}))

        this.saveLocation()
        this.checkCaseList = this.preferenceList.map(item => item.value);
        // this.selectBox = this.selectColumnList.map(item => {
        //   if (this.checkCaseList.includes(item.COLUMN_NAME)) {
        //     return true;
        //   } else {
        //     return false;
        //   }
        // });
        this.preferenceList.forEach(item => {
          this.$set(this.filterData, item.value, []);
        });
        this.checkFilterList = this.preferenceList.map(item => false);
      });
    },
    getLoactionWidth(label){
      if(!localStorage.getItem('tableHeader')){
        return 'auto'
      } else {
        var arr= JSON.parse(localStorage.getItem('tableHeader'))
        if(arr.find(item=>item.name==this.$options.name+this.$route.name+this.field)){
          var header=arr.find(item=>item.name==this.$options.name+this.$route.name+this.field).tableHeader
          if(header.find(item=>item.label==label)){
            return header.find(item=>item.label==label).width
          } else {
            return 'auto'
          }
        } else {
          return 'auto'
        }
      }
    },
    headerDragend(newWidth, oldWidth, column, event){
      var arr=JSON.parse(localStorage.getItem('tableHeader'))
      var header=arr.find(item=>item.name==this.$options.name+this.$route.name+this.field).tableHeader
      if (header.find(item=>item.label==column.label)){
        header.find(item=>item.label==column.label).width=newWidth
      }
      localStorage.setItem('tableHeader',JSON.stringify(arr))
    },
    checkNotAtAll() {
      this.checkCaseList = [];
    },
    setWidth() {
      let timer = setInterval(() => {
        if (this.$el.getElementsByClassName("el-select-dropdown")[0]) {
          const els = this.$el.getElementsByClassName("el-select-dropdown")[0];
          const els1 = this.$el.getElementsByClassName("checkbox")[0];
          els1.children[0].click();
          //els.style.width = '100px';
          clearInterval(timer);
        }
      }, 60);
    },
    setFilterItem(index) {
      this.checkFilterList.splice(index, 1, !this.checkFilterList[index]);
    },
    queryFilter() {
      this.transferVisible = true;
      const data = {
        bussId: this.bussId
      };
      queryFilter(data).then(res => {
        if (res.success) {
          this.transferData = this.generateData(res.data);
        }
      });
    },
    generateData(arr) {
      arr.forEach(item => {
        item.key = item.filterId;
        item.label = item.filterName;
      });
      return arr;
    },
    configFilter() {
      const data = {
        bussId: this.bussId,
        filterIds: this.transferValue.join(",")
      };
      configFilter(data).then(res => {
        this.queryFilterConfig();
      });
    },
    defaultQuerySearch(){
      this.queryModuleData = JSON.parse(localStorage.getItem('queryModuleData'))?JSON.parse(localStorage.getItem('queryModuleData')).find(item=>item.name==this.$route.name+this.field)?JSON.parse(localStorage.getItem('queryModuleData')).find(item=>item.name==this.$route.name+this.field).queryModuleData:{}:{}
      if (this.$route.query.custId) {
        // this.$set(this.queryModuleData, "custId", Number(this.$route.query.custId));
        // console.log(456)
        this.$set(this.queryModuleData, "custIdArray", [Number(this.$route.query.custId)]);
        this.operationState=1
        //this.queryCaseList();
      }
      // if (this.$route.query.myCase) {
      //   this.$set(this.queryModuleData, "myCase", this.$route.query.myCase);
      //   // this.queryCaseList();
      // }
    },
    queryFilterConfig(type) {
      const data = {
        bussId: this.bussId
      };
      this.conditionsModuleList=[]
      queryFilterConfig(data).then(res => {
        this.transferVisible = false;
        this.$nextTick(()=>{
          this.conditionsModuleList = res.data;
          let keyList=res.data.map(item=>item.property)
          for (var key in this.queryModuleData) {
            if(!keyList.includes(key)){
              if(key.includes('Date')){
                this.$set(this.queryModuleData,key,['',''])
              } else if(key.includes('Array')) {
                this.$set(this.queryModuleData,key,[])
              }else{
                this.$set(this.queryModuleData,key,null)
              }
            }
          }
          this.defaultQuerySearch()
          if(type==1){
            this.queryCaseList()
          }
          res.data.forEach(item => {
            if (item.filterType.includes("Many")) {
              if(this.queryModuleData[item.property]){
                if(item.filterType.includes('Many')){
                  if(["被申请人", "转让人"].includes(item.filterName)){
                    // queryAllUrl({ appId:this.queryModuleData[item.property]}).then(res=>{
                    //   this.$set(item,'valueList', res.data.map(i => ({
                    //     id: i.applicantName,
                    //     value: i.applicantName,
                    //     value1: i.applicantEnName,
                    //     value2: i.applicantAddress,
                    //     value3: i.applicantEnAddress
                    //   })))
                    // })
                  }else if(item.filterName=='申请人姓名' ){
                    // console.log(this.queryModuleData[item.property]);
                    // Promise.all( this.queryModuleData[item.property].map(itm=>queryAllUrl({appId:itm}))).then(res=>{
                    //   this.$set(item,'valueList', this.$commonUtils.getLanglist(res.map(i=>i.data)).map(i => ({
                    //     id: i.applicantName,
                    //     value: i.applicantName,
                    //     value1: i.applicantEnName,
                    //     value2: i.applicantAddress,
                    //     value3: i.applicantEnAddress
                    //   })))
                    //   // this.$set(item,'valueList', this.$commonUtils.getLanglist(res.map(i=>i.data)).map(i => ({ id: i.custId, value: i.name })))
                    // })
                  } else if(item.filterName=='客户'){
                    if(this.queryModuleData[item.property].length){
                      queryCustomerNameId({custIdArray: this.queryModuleData[item.property]}).then(res=>{
                        this.$set(item,'valueList', res.data.map(i => ({ id: i.custId, value: i.name })))
                      })
                    }
                  } else {
                    item.valueList = item.values.filter(i=>i.id==this.queryModuleData[item.property])
                  }
                  // if(item.property.includes('Array')){
                  //   //this.queryModuleData[item.property]=this.queryModuleData[item.property].map(itm=>Number(itm))
                  // }else {
                  //  // this.queryModuleData[item.property]=Number(this.queryModuleData[item.property])
                  // }
                }
              } else {
                item.valueList=[]
              }
            }
            if (item.filterType.includes("checkbox")) {
              if(this.queryModuleData[item.property]&&this.queryModuleData[item.property].length){
                this.$set(this.queryModuleData, item.property, this.queryModuleData[item.property]);
              }else {
                this.$set(this.queryModuleData, item.property, []);
              }
            }
          });
          this.transferValue = res.data.map(item => item.filterId);
          if (this.$route.query.custId) {
            if (!this.transferValue.find(item => item == 58)) {
              this.$set(this.transferValue, this.transferValue.length - 1, 58);
              this.configFilter();
            } else {
              this.remoteMethod(
                this.$route.query.name,
                this.transferValue.indexOf(58),
                "",
                "客户"
              );
            }
          }
        });
      })
    },
    filterMulList(row){
      if(this.multipleSelection.map(item=>item[this.getCurFilterId(this.pageTitle)]).includes(row[this.getCurFilterId(this.pageTitle)])){
        this.multipleSelection=this.multipleSelection.filter(item=>item[this.getCurFilterId(this.pageTitle)]!=row[this.getCurFilterId(this.pageTitle)])
      }
    },
    delCase(row) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (this.pageTitle === "案件管理") {
            deleteCase({ caseIds: row.caseId,taskType:2 })
              .then(res => {
                if (res.success) {
                  this.$message({
                    type: "success",
                    message: "删除成功!"
                  });
                  this.filterMulList(row)
                  this.queryCaseList();
                }
              })
              .catch(err => {
                this.$alert(`<p>${err}<p>`, "删除提示", {
                  dangerouslyUseHTMLString: true
                });
              });
          } else if (this.pageTitle === "官方通知") {
            deleteDoc({
              docList: [{ tmFileId: row.insId}],
              taskType:2
            }).then(res => {
              if (res.success) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.filterMulList(row)
                this.queryCaseList();
                // if(row.auditStatus==2||row.auditStatus==3){
                //   this.getManualRecognitionOfficialInfoCount()
                // }
              }
            });
          } else if (this.pageTitle === "递交官方") {
            deleteIns({ insIdList: row.insId,taskType:2}).then(res => {
              if (res.success) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.filterMulList(row)
                this.queryCaseList();
              }
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    formatDate(time) {
      return this.$commonUtils.formatDate(time)
    },
    filterCheck(val) {
      this.filterText = val;
    },
    headerCellClassName ({column, columnIndex}) {
      // if(this.dragState.dragging){
      //   console.log(this.dragState.move,columnIndex);
      //   return (columnIndex - 1 === this.dragState.move ? `moveIng` : '')
      // }
      if(!this.selectionState){
        return (columnIndex - 1 === this.dragState.move ? `moveIng` : '')
      }else {
        return (columnIndex -2 === this.dragState.move ? `moveIng` : '')
      }

      //  return (columnIndex - 1 === this.dragState.move ? `darg_active_${this.dragState.direction}` : '')
    },
    getRowClassName({row, rowIndex}){
      if(this.selectionState){
        if(this.multipleSelection.map(item=>item[this.getCurFilterId(this.pageTitle)]).includes(row[this.getCurFilterId(this.pageTitle)])){
          if(this.$refs.caseListMultiple){
            this.$refs.caseListMultiple.toggleRowSelection(row,true)
          }
          return 'selectRow'
        }
      }else {
        if(row.auditStatus==1){
          return 'gray'
        }
      }

    },
    getAppTitleList(filterName, valueList0) {
      if (filterName === "申请人姓名") {
        return {
          id: "-1",
          value: "申请人中文名称",
          value1: "申请人英文名称",
          value2: "申请人中文地址",
          value3: "申请人英文地址"
        };
      }
      if (filterName === "被申请人") {
        return {
          id: "-1",
          value: "被申请人中文名称",
          value1: "被申请人英文名称",
          value2: "被申请人中文地址",
          value3: "被申请人英文地址"
        };
      }
      if (filterName === "转让人") {
        return {
          id: "-1",
          value: "转让人中文名称",
          value1: "转让人英文名称",
          value2: "转让人中文地址",
          value3: "转让人英文地址"
        };
      }
      return valueList0;
    },
    renderHeader (createElement, {column}) {
      return createElement(
        'div', {
          'class': ['thead-cell'],
          on: {
            mousedown: ($event) => { this.handleMouseDown($event, column) },
            mouseup: ($event) => { this.handleMouseUp($event, column) },
            mousemove: ($event) => { this.handleMouseMove($event, column) }
          }
        }, [
          // 添加 <a> 用于显示表头 label
          createElement('a', column.label),
          // 添加一个空标签用于显示拖动动画
          createElement('span', {
            'class': ['virtual']
          })
        ])
    },
    addFilterScheme(e){
      if(e==1){
        this.addFilterState=true
      }else if(e==2) {
        if(!this.schemeName||!this.schemeName.trim()){
          this.$message.error('请输入过滤器名称')
          return
        }
        const data={
          schemeName:this.schemeName,
          bussId:this.bussId,
          value: JSON.stringify(this.queryModuleData)
        }
        addFilterScheme(data).then(res=>{
          this.addFilterState = false
        })
      }
    },
    // 按下鼠标开始拖动
    handleMouseDown (e, column) {
      e.target.parentNode.parentNode.childNodes[1].click()
      this.dragState.dragging = true
      this.dragState.start = parseInt(column.columnKey)

      // 给拖动时的虚拟容器添加宽高
      let table = document.getElementsByClassName('w-table')[0]
      let virtual = document.getElementsByClassName('virtual')
      for (let item of virtual) {
        item.style.height = item.parentElement.clientHeight - 1 + 'px'
        item.style.width = item.parentElement.clientWidth + 'px'
        item.style.left = '10px'
        // item.innerText=item.parentElement.parentElement.innerText
      }
    },

// 鼠标放开结束拖动
    handleMouseUp (e, column) {
      this.dragState.end = parseInt(column.columnKey) // 记录起始列
      this.dragColumn(this.dragState)
      // 初始化拖动状态
      this.dragState = {
        start: -1,
        end: -1,
        move: -1,
        dragging: false,
        direction: undefined
      }
    },
// 拖动中
    handleMouseMove (e, column) {
      if (this.dragState.dragging) {
        let index = parseInt(column.columnKey) // 记录起始列
        if (index - this.dragState.start !== 0) {
          this.dragState.direction = index - this.dragState.start < 0 ? 'left' : 'right' // 判断拖动方向
          this.dragState.move = parseInt(column.columnKey)
        } else {
          this.dragState.direction = undefined
        }
      } else {
        return false
      }
    },
    // 拖动易位
    dragColumn ({start, end, direction}) {
      if(start==-1){
        return
      }
      let tempData = []
      let left = direction === 'left'
      let min = left ? end : start - 1
      let max = left ? start + 1 : end
      for (let i = 0; i < this.tableHeader.length; i++) {
        if (i === end) {
          tempData.push(this.tableHeader[start])
        } else if (i > min && i < max) {
          tempData.push(this.tableHeader[ left ? i - 1 : i + 1 ])
        } else {
          tempData.push(this.tableHeader[i])
        }
      }
      if(start==end){
        return
      }

      this.tableHeader = tempData
      this.$refs.caseListMultiple.store.states.filters={}
      let arr=Array.from(this.$refs.caseListMultiple.$el.querySelectorAll('.is-sortable'))
      let classList = arr.map(item=>Array.from(item.classList).find(itm=>itm.includes('column')))
      this.$refs.caseListMultiple.store.states.columns.forEach(ii=>{
        ii.filteredValue=[]
      })
      this.tableHeader.forEach((item,index)=>{
        classList.forEach((itm,idx)=>{
          if(index==idx){
            this.$refs.caseListMultiple.store.states.filters[itm]=this.filterDataSum[item.label]
            this.$refs.caseListMultiple.store.states.columns.forEach(ii=>{
              if(ii.id==itm){
                ii.filteredValue=this.filterDataSum[item.label]
              }
            })
          }
        })
      })
    },
    filterChange(a){
      this.total=this.$refs.caseListMultiple.tableData.length
      //  console.log(this.$refs.caseListMultiple.tableData.length);
      for (var key in a){
        this.tableHeader.forEach((item,index)=>{
          if(index==key){
            this.$set(this.filterDataSum,item.label,a[key])
            // this.filterDataSum[item.label]=a[key]
          }
        })
      }
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    // handleFilterChange(val){
    //   console.log(val);
    //   // this.curFilterSelect=Object.assign(this.curFilterSelect,val)
    //   // console.log(this.curFilterSelect);
    //   // let arr = JSON.parse(JSON.stringify(this.caseList));
    //   // const filterKeys = Object.keys(this.curFilterSelect);
    //   // console.log(filterKeys);
    //   // console.log(this.tableHeader.map(item => item.prop));
    //   // let Allflag=false
    //   // filterKeys.forEach(key => {
    //   //   if (this.filterData[key].length !== 0 && !key.includes("List")) {
    //   //     if(this.filterData[key].includes('全选')){
    //   //       Allflag = true
    //   //     }
    //   //     arr = arr.filter(itm => {
    //   //       var flag = false;
    //   //       if (Allflag){
    //   //         return Allflag
    //   //       }
    //   //       this.filterData[key].forEach(item => {
    //   //         if (item === itm[key]) {
    //   //           flag = true;
    //   //         }
    //   //       });
    //   //       return flag;
    //   //     });
    //   //   }
    //   // });
    //
    // },
    getMinWidth(data, header, currentId){
      //  let arr=[...[String(data.label).replace(/[\u4E00-\u9FA5]/gi,'aa').length],...this.caseList.map(item => item[data.prop]).filter(item=>item).map(item=>String(item).replace(/[\u4E00-\u9FA5]/gi,'aa').length)]
      return String(data.label).replace(/[\u4E00-\u9FA5]/gi,'aa').length*12+30
    },
    getWidth(data, header, currentId){
      if(data.width!=='auto'){
        return data.width
      } else {
        return 'auto'
      }
    },
    getCellClassName({row, column, rowIndex, columnIndex}){
      if(column.label==='上报事项'){
        if(row['reportMatter']=='申请'){
          return 'blue'
        }else {
          return 'red'
        }
      } else if (column.label === '递交方式') {
        if (row['insSubmitType'] == '人工送达') {
          return 'blue'
        } else {
          return 'red'
        }
      } else if (column.label==='递交场所') {
        if(row['submitPlace']=='国际处' || row['submitPlace']=='海淀区工商局'){
          return 'blue'
        }
      } else if (column.label==='商标图样') {
        return 'imgWrap'
      }
    },
    getRowContextmenuList(row){
      if(this.pageTitle==='官方通知'){
        return[
          { name:'复制',action: 'copy' },
          { name: '修改', action: 'editFun'},
          { name: '删除', action: 'delCase'}]
      }
      if(this.pageTitle==='递交官方'){
        return [
          { name:'复制',action: 'copy' },
          { name: '修改', action: 'editFun'},
          { name: '删除', action: 'delCase'}]
      }
      if(this.pageTitle==='案件管理'){
        return this.rowContextmenuList.concat([
          { name:'复制',action: 'copy' },
          { name: '修改', action: 'editFun'},
          { name: '删除', action: 'delCase'}])
      }
    },
    rowContextmenu(row, column, event) {
      const that=this
      this.$ContextMenu({
        event, // 传入鼠标事件
        menu:this.getRowContextmenuList(row)
      }).then(rs => {
        if(rs){
          this[rs](row, column, event);
        }
      });
    },
    createCase(row){
      copyCase({caseId:row.caseId}).then(res=>{
        this.$message({
          message: '立案成功',
          type: 'success'
        });
        this.queryCaseList()
        // this.
      })
    },
    // relevant(row, column, event) {
    //   queryCorrelationCaseList({caseId:row.caseId}).then(res=>{
    //     if(this.pageTitle==='案件管理'){
    //       res.data.forEach(item=>{
    //         if(this.ajglTabList.find(item=>item.title=='相关案件')){
    //           this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'push',data:{title:'相关案件',name:'相关案件',data:item}})
    //         }else {
    //           this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'pushItem',data:{title:'相关案件',name:'相关案件',list:[item]}})
    //         }
    //       })
    //     }
    //   })
    // },
    relevant(row, column, event) {
      queryCorrelationCaseList({caseId:row.caseId}).then(res=>{
        res.data.forEach(item=>{
          this.$store.commit('tabs/CHANGE_STORAGETABLE',{type:'push',title:'相关案件',name:'相关案件',identification:this.identification,data:item})
        })

        // if(this.pageTitle==='案件管理'){
        //   res.data.forEach(item=>{
        //     if(this.ajglTabList.find(item=>item.title=='相关案件')){
        //       this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'push',data:{title:'相关案件',name:'相关案件',data:item}})
        //     }else {
        //       this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'pushItem',data:{title:'相关案件',name:'相关案件',list:[item]}})
        //     }
        //   })
        // }
      })
    },
    temporarStorage(row, column, event) {
      this.$store.commit('tabs/CHANGE_STORAGETABLE',{type:'push',title:'暂存案件',name:'暂存案件',identification:this.identification,data:row})
      // if(this.pageTitle==='案件管理'){
      //   if(this.ajglTabList.find(item=>item.title=='暂存案件')){
      //     this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'push',data:{title:'暂存案件',name:'暂存案件', identification:this.identification, data:row}})
      //   }else {
      //     this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'pushItem',data:{title:'暂存案件',name:'暂存案件', identification:this.identification, list:[row]}})
      //   }
      // }
    },
    temporarStorageAll(){
      let list = this.gridApi.getSelectedRows()
      list.forEach(item => {
        this.temporarStorage(item)
      })
      // if(this.pageTitle==='案件管理'){
      //   if(this.ajglTabList.find(item=>item.title=='暂存案件')){
      //
      //     this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'push',data:{title:'暂存案件',name:'暂存案件',data:row}})
      //   } else {
      //     this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'pushItem',data:{title:'暂存案件',name:'暂存案件',list:[row]}})
      //   }
      // }
    },
    getCurFilterId(title) {
      switch (title) {
        case "案件管理":
          return "caseId";
        case "递交官方":
          return "insId";
        case "官方通知":
          return "tmFileId";
      }
    },
    hidden(row){
      this.caseList=this.caseList.filter(item=>item[this.getCurFilterId(this.pageTitle)]!=row[this.getCurFilterId(this.pageTitle)])
      // this.caseList.splice(this.caseList.indexOf(row),1)
      this.currentPageSize-=1
    },
    abnormal(row, column, event) {
      if(this.pageTitle==='案件管理'){
        if(this.ajglTabList.find(item=>item.title=='异常案件')){
          this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'push',data:{title:'异常案件',name:'异常案件',data:row}})
        }else {
          this.$store.commit('tabs/CHANGE_AJGLTABLIST',{type:'pushItem',data:{title:'异常案件',name:'异常案件',list:[row]}})
        }
      }
    },
    copy(row, value) {
      this.$copyText(value).then(
        res => {
        })
    },
    changeKeepAlive(){
      if(this.$store.state.caseInformation.preOnlyId){
        this.getCaseList()({ insId: this.$store.state.caseInformation.preOnlyId ,business:this.business}).then(res => {
          if(res.data.length) {
            let str=this.getCurFilterId(this.pageTitle)
            let obj=this.caseList.find(item => item[str] === res.data[0][str])

            if(obj){
              for (var key in obj) {
                if(key!='sid'){
                  this.$set(obj,key,res.data[0][key])
                }
              }
            }
          }
        })
      }
    },
    undateSearch(n){
      if(this.bussId==n.bussId){
        this.queryModuleData=JSON.parse(n.value)
        this.handleSearch(0)
        this.queryFilterConfig()
      }

    }
  },
  computed: {
    ...mapGetters(["userId"]),
    ...mapState({
      'pattern' : state => state.user.pattern,
      'ajglTabList' : state => state.tabs.ajglTabList,
      'djgfTabList' : state => state.tabs.djgfTabList,
      'gftzTabList' : state => state.tabs.gftzTabList,
    }),
    clientHeight(){
      return document.documentElement.clientHeight-300
    },
  },
  watch: {
    timeLimitState(n,o){
      if(!n){
        let allData = this.$refs['timeLimit']._data
          for(var key in allData){
            allData[key] = ''
          }
      }
    },
    pattern:{
      handler(n,o){
        if(n){
          this.$store.commit('app/TOGGLE_SIDEBAR',false)

        } else {
          // this.$store.commit('app/TOGGLE_SIDEBAR',true)
        }
      },
      immediate:true
    },
    checkboxState(n){
      if(n){
        this.$nextTick(()=>{
          this.$refs.checkCaseSelect.focus()
        })
      }
    },
    drawerState(n){
      if(n){
        this.$nextTick(()=>{
          document.getElementById('clearWrap').style.top =document.getElementById('searchWrap').scrollTop+ document.getElementById('searchWrap').offsetHeight - 40 + 'px'
        })
      }
    },
    transferVisible(n){
      if(!n){
        setTimeout(()=>{
          this.$nextTick(()=>{
            let searchWrap= document.getElementById('searchWrap')
            this.clearWrapTop = searchWrap.scrollTop+ searchWrap.offsetHeight
            document.getElementById('clearWrap').style.top=this.clearWrapTop -40 + 'px'
          })
        },0)
      }
    },
    tableHeader(n){
      this.tableHeaderLabelList=n.map(item=>item.label)
    },
    tableHeaderLabelList(n,o){
      if(o.length){
        if(localStorage.getItem('tableHeader')){
          let header=JSON.parse(localStorage.getItem('tableHeader')).find(item=>item.name==this.$options.name+this.$route.name+this.field).tableHeader
          this.tableHeader.forEach(item=>{
            header.forEach(itm=>{
              if(itm.label==item.label){
                this.$set(item,'width',itm.width)
              }
            })
          })
        }
        this.changeHeader(this.tableHeader)
      }
    },
    selectionState(n){
      this.changeSelection(n)
    },
    dialogVisible(n) {
      if (!n) {
        if(this.pageTitle=='案件管理'){
          // this.queryModuleData.shortcuts = 1;
          //  this.$refs.caseListMultiple.newTableStore.states.selection = [];
          this.selectionState = false
          // this.queryCaseList();
          //  delete this.queryModuleData.shortcuts;
        }
        if(this.pageTitle=='官方通知'){
          this.changeKeepAlive()
        }
      }
    },
  },
  activated() {
    if(this.initFlag){
      this.init()
    }
    this.initFlag=true
    // this.$store.commit('caseInformation/SET_BUSSID',this.bussId)
    // if(this.$route.query.instructionSubmitStatus){
    //   this.$set(this.queryModuleData, "instructionSubmitStatus",Number(this.$route.query.instructionSubmitStatus));
    //   this.queryCaseList();
    // }
    // if (this.$route.query.custId) {
    //   this.$set(this.queryModuleData, "custIdArray", Number(this.$route.query.custId));
    //   this.operationState=1
    //   this.queryCaseList();
    // }
    // if (this.$route.query.myCase) {
    //   this.$set(this.queryModuleData, "myCase", this.$route.query.myCase);
    //   this.queryCaseList();
    // }
    // if(this.pageTitle=='递交官方'){
    //   this.changeKeepAlive()
    // }
  },
  components: {
    Pagination,
    PdfPreview,
    Willtable,
    BulkUploadFile,
    exportFile,
    SelectOption,
    seeCaseDetail,
    ViewsSwitching,
    litigationSubmission,
    litigationOfficial,
    MyTabs,
    createTimeLimit,
    CaseInvestigators
  }
};
</script>

<style lang="scss" scoped>
  header {
    margin-bottom: 19px;
    box-shadow: 0px 2px 5px 0px rgba(163, 163, 163, 0.35);

    /*<!--.queryButton:before{-->*/
    /*<!--content: '';-->*/
    /*<!--display: block;-->*/
    /*<!--width:0px;-->*/
    /*<!--border-right: 2px dashed rgba(191, 191, 191, 1);-->*/
    /*<!--height:58px;-->*/
    /*<!--position: absolute;-->*/
    /*<!--left: 0;-->*/
    /*<!--top: 50%;-->*/
    /*<!--transform: translateY(-50%);-->*/
    /*<!--}-->*/
  }
  .queryButton {
    display: flex;
    flex-wrap: nowrap;
    position: relative;
    justify-content: center;
    .buttonWrap_small {
      transform: translateX(-90px);
      display: flex;
      margin: 5px 5px;
      align-items: center;
      .el-button {
        margin-left: 10px;
      }
    }
  }

  .el-form {
    position: relative;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .el-cascader {
      width: 100%;
    }
    /*.el-select /deep/{*/
    /*  .el-select__tags{*/
    /*    max-height: 40px;*/
    /*    overflow-y: auto;*/
    /*  }*/
    /*}*/
    /*.multi-cascader /deep/{*/
    /*  .el-cascader__label{*/
    /*    max-height: 40px;*/
    /*    overflow-y: auto*/
    /*  }*/
    /*}*/
    .postInfo-container-item {

      /deep/ .el-form-item__content {
        width: 330px;
        display: flex;
        /*height: 28px;*/
        align-items: center;
        .el-select {
          width: 100%;
        }
        .el-input {
          width: 100%;
        }
      }
    }
  }
  .case_management_item {
    /*min-height: calc(100vh - 50px - 18px - 41px);*/
    display: flex;
    flex-direction: column;
    //overflow: auto;
    padding: 5px 5px;
  }
  section {
    position: relative;
    clear: both;
    flex: 1;
    //padding-bottom: 200px;
  }
  .checkbox {
    position: absolute;
    left: 0px;
    top: 88px;
    /*width: 222px;*/
    height: 324px;
    border: 1px solid #99a9bf;
    background: #fff;
    z-index: 100;
    padding-top: 6px;
    padding-left: 6px;
    padding-right: 16px;
  }
  .checkbox_bottom {
    position: absolute;
    display: flex;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 29px;
    background: #fff;
    z-index: 2;
    justify-content: flex-end;
  }
  .checkbox_bottom ~ li:last-of-type {
    margin-bottom: 30px;
  }
  .dots {
    cursor: pointer;
    position: absolute;
    left: 0;
    z-index: 1;
    top: 6px;
    width: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    .dot {
      color: transparent;
      padding: 1px;
      margin: 1px;
      width: 5px;
      background: RGBA(113, 123, 140, 1);
      height: 5px;
      display: block;
    }
    & ~ span {
      margin-left: 5px;
    }
  }

  .el-table {
    overflow: visible;
    /deep/ th {
      color: rgba(51, 51, 51, 1);
      background: rgba(187, 187, 187, 0.5);
    }
  }
  .el-table /deep/ th .cell {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    padding-left:10px ;

    img {
      margin-left: 5px;
      width: 12px;
      cursor: pointer;
    }
    .checkboxs {
      position: absolute;
      background: #fff;
      min-width: 100%;
      top: 47px;
      left: 0px;
      display: flex;
      z-index: 1;
      border: 1px solid #f4f4f5;
      overflow: visible;
      padding-left: 6px;
      padding-bottom: 80px;
      .filter_content {
        width: 100%;
        max-height: 200px;
        height: 200px;
        overflow: auto;
      }
      .el-checkbox-group {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        overflow: visible;
      }
      .checkAll {
        position: absolute;
        bottom: -27px;
        width: 100%;
        left: 0;
        background: #fff;
        height: 27px;
        color: #409eff;
        text-indent: 5px;
        line-height: 27px;
        cursor: pointer;
        border: 1px solid #f4f4f5;
      }
    }
  }
  .el-table /deep/ th div{
    overflow: visible;
    text-overflow: inherit;
    padding: 0;
  }

  .el-table /deep/ .el-table__header-wrapper {
    overflow: hidden;
    th {
      overflow: visible;
      .cell {
        overflow: visible;
      }
    }
  }
  .el-scrollbar li {
    display: flex;
    span {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      border-right: 1px solid #f4f4f5;
      border-bottom: 1px solid #f4f4f5;
    }
  }
  .el-transfer {
    display: flex;

    /deep/ & > .el-transfer-panel {
      flex: 1;
    }

    /deep/ .el-transfer__buttons {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    /deep/ .el-transfer-panel__list {
      display: flex;
      flex-wrap: wrap;
      label {
        width: 33.3%;
        margin-right: 0;
      }
    }
  }
  .el-dropdown {
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
    width: 66px;
    height: 32px;
    font-size: 12px;
    border-radius: 3px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 10px;
  }
  .el-menu-demo {
    display: inline-block;
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
    width: 92px;
    height: 32px;
    font-size: 12px;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 10px;
    &:hover {
      opacity: 0.8;
    }
    /deep/ li {
      height: 100%;
      width: 100%;
      .el-submenu__title {
        border-radius: 3px;
        background: #409eff;
        color: #fff !important;
        line-height: 32px;
        height: 100%;
        text-align: center;
        border-bottom: 0;
        padding: 0;
        i {
          color: #fff;
        }
        &:hover {
          color: #fff;
          background: #409eff;
        }
      }
    }
    //padding: 9px 15px;
  }
  .button_wrap {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 50px;

    .el-button {
      margin-left: 10px;
    }
  }

  .filterTableTmg {
    height: 100%;
  }
  .fullItem {
    width: 100%;
  }
  .pdfPreview {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
  }
  /deep/ .plTableBox {
    .ant-table-scroll {
      max-height: "af" !important;
      .el-table {
        height: "123" !important;
      }
    }
    .myPagination {
      display: none;
    }
  }
  .FilterSelectWrap{
    display: flex;
    flex-wrap: wrap;
    .filterSelect{
      width: 232px;
      margin-right: 30px;
      margin-bottom: 10px;
    }
  }
  .selectButton{
    position: absolute;
    right: 12px;
    top: 28px;
  }
  .myeltable{
    /deep/ .cell{
      overflow:hidden;
      white-space: nowrap;
      text-overflow: clip;
    }
  }

  .divdiver{
    position: relative;
    left: 30px;
    height: 1px;
    width: 83%;
    background: #EEF2FB;
    margin-bottom: 10px;
  }
  /deep/ .selectRow{
    background: #C9C8D0;



  }
  /deep/ .gray{
    background: #E4E2E2;
  }
  /deep/ .pagination-container{
    padding: 0;
  }
  .content_wrap{
    width: 100%;
    display: flex;
    .left_wrap{
      position: relative;
      transition:all 0.5s;
      //   width: 40%;
    }
    .right_wrap{
      box-shadow: 0px 0px 18px 0px rgba(64, 158, 255,0.5);
      height: 598px;
      overflow: auto;
      transition:all 0.5s;
      flex: 1;
      /deep/ *{
        font-size: 12px !important;
      }
      // width: 60%;
      /deep/.sectionWrap{
        padding: 0 !important;
        padding-left: 10px !important;
        // padding-bottom: 350px!important;
        .ElectronWrap{
          padding: 0!important;
        }
      }
    }
  }
  .w-table  {
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* 没有前缀，目前支持Opera和谷歌浏览器 */
    /deep/ .caret-wrapper{
      position: relative;
    }
    /deep/ .el-table__column-filter-trigger{
      position: relative;
    }
    /deep/ .el-table th {
      padding: 0;
      .virtual{
        position: absolute;
        display: block;
        width: 0;
        height: 0;
        z-index: 99;
        top: 0;
        background: none;
        border: none;
        box-sizing: border-box;
      }

    }
    .thead-cell {
      vertical-align: middle !important;
      padding: 0;
      display: inline-flex;
      flex-direction: column;
      align-items: left;
      cursor: pointer;
      overflow: initial;
      /*&:before {*/
      /*content: "";*/
      /*position: absolute;*/
      /*top: 0;*/
      /*left: 0;*/
      /*bottom: 0;*/
      /*right: 0;*/
      /*}*/
    }
    &.w-table_moving {
      .el-table th .thead-cell{
        cursor: move !important;
      }
      .el-table__fixed {
        cursor: not-allowed;
      }
    }
  }
  .right_wrap{

    /deep/.el-collapse-item{
      border-bottom: 1px solid #303133;
    }
  }
  /deep/ .moveIng{
    .virtual {
      border: 2px dotted #666 !important;
    }
  }
  /deep/  .darg_active_left {
    .virtual {
      border-left: 2px dotted #666 !important;
    }
  }

  /deep/  .darg_active_right {
    .virtual {
      border-right: 2px dotted #666 !important;
    }
  }
  .DataPicker /deep/ {
    .el-input__prefix{
      display: none;
    }
    .el-input__inner{
      text-align: left;
      padding-left: 15px;
      padding-right: 18px;
      // padding-left: 10px;
    }
  }
  .djSubmitDateArray{
    width: 490px;
    margin-bottom: 0;
    /deep/ .el-form-item__label{
      line-height: 40px!important;
    }
  }
  .button-group-search{
    position: relative;
    display: flex;
    .searchWrap{
      border-radius: 5px;
      top: 34px;
      left: 10px;
      width: 550px;
      max-height: 500px;
      position: absolute;
      background: #ffffff;
      border: 1px solid #d4d5d5;
      z-index: 1;
      overflow: auto;
      padding: 20px 0;
      box-shadow: 0 3px 6px rgba(111,111,111,0.2);
      /deep/  .el-form{
        padding-bottom: 10px;
        .el-form-item__label{
          text-align: left;
          padding-left: 32px;
          font-weight: normal;
        }
        .el-form-item__content{
          input{
            border-top: 0;
            border-left: 0;
            border-radius: 0;
            border-right: 0
          }
        }
      }
      .clearWrap{
        display: flex;
        justify-content: flex-end;
        width: 100%;
        background: #fff;
        right: 10px;
        padding-bottom: 10px;
        position: absolute;
        z-index: 1;
      }
    }
  }
  @keyframes show {
    0% {

      opacity: 0;
      //transform: translateX(100%);

    }
    100% {
      // transform: translateX(0);
      opacity: 1;

    }
  }
  @keyframes hide {
    0% {
      opacity: 1;
      // transform: translateX(0);
    }
    100% {

      opacity: 0;
      //  transform: translateX(100%);
    }
  }
  .show-enter-active {
    animation: show 0.5s;
  }
  .show-leave-active {
    animation: hide 0.5s;
  }
  .show-enter, .show-leave-to {
    opacity: 0;
  }
  .ViewsSwitching{
    position: absolute !important;
    right: 0;
    z-index: 100;
    top:5px;
  }
  .searchRight{
    margin-left: 0;
    height: 32px;
    border-top-right-radius:3px !important;
    border-bottom-right-radius:3px !important;
    padding: 0 5px
  }
  .MyTabs{
    width: 100%;
    position: absolute;

    /deep/ .el-tabs{
      .el-tabs__header{
        margin: 0;
      }
      .el-tabs__content{
        background: #fff;
      }
    }
  }
  .MyTabs.activity{
    background: #fff;
    z-index: 8;
    /deep/ .el-tabs{
      .el-tabs__header{
        margin: 0;
        background: #fff;
      }
      .el-tabs__content{
        background: #fff;
      }
    }
  }
  .queryButton{
    z-index:7
  }
  .cube{
    -webkit-transform: translateZ(0);
    -moz-transform: translateZ(0);
    -ms-transform: translateZ(0);
    -o-transform: translateZ(0);
    transform: translateZ(0);
    /* Other transform properties here */
  }
  /deep/ .imgWrap{
    .cell{
      width: 50px;
      height: 30px;
    }
  }
  .noTrigger /deep/.el-table__column-filter-trigger{
    display: none;
  }
  .pdfDialog  /deep/{
    z-index: 3000;
    .el-dialog{
      z-index: 3000;
      height: 100vh;
      display: flex;
      flex-direction: column;
      .el-dialog__body{
        flex: 1;
        .swiper-container{
          height: 100%;
          .swiper-button-prev-son{
            cursor: pointer;
            position: absolute;
            top: 10px;
            left: 50%;
            z-index: 10000;
            transform: translateX(-50%);
            text-align: center;
            font-size: 50px;
          }
          .swiper-button-next-son{
            cursor: pointer;
            position: absolute;
            bottom:  10px;
            left: 50%;
            z-index: 10000;
            transform: translateX(-50%);
            text-align: center;
            font-size: 50px;
          }
        }
      }
    }
    .iframe{
      width: 100%;
      height: 100%;
    }
  }
  .brush_right{
    position: absolute;
    right: 6px;
    z-index: 1;
    top: -4px;
  }
</style>
