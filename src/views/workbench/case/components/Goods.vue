<template>
  <div>
    <div style="display: flex">
    <el-input v-model="searchval" placeholder="请输入" @keyup.enter.native="goodSearch"></el-input>
      <el-button @click="goodSearch" size="mini" style="margin-left:10px" type="primary">
        查询
      </el-button>
      <template v-if="type!='view'">
      <el-button v-if="!disabled" @click="goodAdd" size="mini" style="margin-left:10px" type="primary">
        新增
      </el-button>
        <el-button  @click="duplicateQuery
  " size="mini" style="margin-left:10px" type="primary">
          查重
        </el-button>

<!--    <el-button type="primary" v-if="!goodsDelBool&&!disabled" @click="goodsDelBool=true" size="mini" style="margin-left:10px">-->
<!--      选择-->
<!--    </el-button>-->
    <el-button type="primary" @click="delgoodw()" size="mini" style="margin-left:10px">
      删除
    </el-button>
    </template>
    <el-button type="primary" @click="exportExcel" size="mini" style="margin-left:10px">
      导出
    </el-button>
    <el-button  v-if="isRevamp"  @click="queryCaseGory(caseId)" size="mini" style="float:right,margin-left:10px">
      {{supplementCorrectionState?'补正后':'补正前'}}
    </el-button>
    <el-button type="primary" @click="showAllGoods" size="mini" style="margin-left:10px">
      全部
    </el-button>
      <el-button type="primary" v-if="['内-外', '外-外'].includes(appFromto)" @click="compareVersion" size="mini" style="margin-left:10px">
        版本比对
      </el-button>
    </div>
    <el-form v-if="['内-外', '外-外'].includes(appFromto)" style="margin-top: 5px" size="mini" label-width="120px">
      <el-row style="border: 1px solid #d7d7d7;">
        <el-col :span="8">
          <el-form-item label="版本号:" style="margin-bottom: 0">
            <el-select default-first-option placeholder="请选择"
                       v-model="version" filterable @change="changeVersion">
              <el-option v-for="(item, key)  in goodsVersionList" :key="item.id"
                         :label="item.typeName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="修改人:" style="margin-bottom: 0">
            {{modifyUserName}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="修改日期:" style="margin-bottom: 0">
            {{modifyDate}}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-col v-show="!supplementCorrectionState" :span="24" style="text-align: right;margin-top:10px">
<!--      <el-table class="table-dl-row" :data="pageGoodsw" border current-row-key empty-text="暂无数据" fit highlight-current-row size="mini" style="width: 100%;" @selection-change="handleSelectionChange">-->
<!--        <el-table-column v-if="goodsDelBool" type="selection" width="55">-->
<!--        </el-table-column>-->
<!--        <el-table-column align="left" label="商品类别" width>-->
<!--          <template slot-scope="scope">-->
<!--            <span v-if='!scope.row.aditbool'>{{ scope.row.goodClass }}</span>-->
<!--            <el-input v-else v-model="scope.row.goodClass" size="medium"></el-input>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column align="left" label="商品类似群组" width>-->
<!--          <template slot-scope="scope">-->
<!--            <span v-if='!scope.row.aditbool'>{{ scope.row.similarGroup }}</span>-->
<!--            <el-input v-else v-model="scope.row.similarGroup" size="medium"></el-input>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column align="left" label="商品代码" width>-->
<!--          <template slot-scope="scope">-->

<!--            <span v-if='!scope.row.aditbool'>{{ scope.row.goodCode }}</span>-->
<!--            <el-input v-else v-model="scope.row.goodCode" size="medium"></el-input>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column align="left" label="商品中文名称" width>-->
<!--          <template slot-scope="scope">-->

<!--            <span v-if='!scope.row.aditbool'>{{ scope.row.goodName }}</span>-->
<!--            <el-input v-else v-model="scope.row.goodName" size="medium" @input="(e)=>queryList(e,scope.row)"></el-input>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column align="left" label="商品英文名称" width>-->
<!--          <template slot-scope="scope">-->

<!--            <span v-if='!scope.row.aditbool'>{{ scope.row.goodEnName }}</span>-->
<!--            <el-input v-else v-model="scope.row.goodEnName" size="medium"></el-input>-->
<!--          </template>-->
<!--        </el-table-column>-->

<!--        <el-table-column align="left" label="操作" width v-if="type!='view'">-->
<!--          <template slot-scope="scope">-->
<!--            <el-button type="text" v-if="scope.row.aditbool" @click="save(scope.row)">保存-->
<!--            </el-button>-->
<!--            <el-button type="text" v-if="scope.row.aditbool" @click="recall(scope.row)">撤回-->
<!--            </el-button>-->
<!--            <el-button type="text"  v-if="!scope.row.aditbool" @click="edit(scope.row)">编辑-->
<!--            </el-button>-->
<!--          </template>-->
<!--        </el-table-column>-->

<!--      </el-table>-->
      <AgGridVue :style="{width:'100%','height':'350px',border:'1px'}"
                 class="ag-theme-balham"
                 ref="gridApiG"
                 key="ag-theme-balham"
                 :columnDefs="columnDefs"
                 :gridOptions="gridOptionsG"
                 :rowData="this.version ? pageGoodsw.filter(item => item.version == this.version) : pageGoodsw"
                 rowSelection="multiple"
                 :localeText="$store.state.caseInformation.localeText"
                 :getContextMenuItems="getContextMenuItems"
                 :rowHeight="28"
                 animateRows
                 suppressAutoSize
                 :suppressRowDrag="false"
                 :rowDragManaged="true"
                 :suppressMoveWhenRowDragging="true"
                 @rowDragEnd ="rowDragEnd"
                 :frameworkComponents="frameworkComponents"
      >
      </AgGridVue>
      <pagination :pageSizes="pageSizesList" :storage="false" :limit.sync="goodslistPageDataw.pageSize" :page.sync="goodslistPageDataw.pageNo" :total="goodslistPageDataw.total" @pagination="getgoodsListw(goodsListData)" v-show="goodslistPageDataw.total>0" />
    </el-col>
    <el-col v-show="supplementCorrectionState" :span="24" style="text-align: right;margin-top:10px">
      <el-table :row-class-name="supplementRowClassName" class="supplementTable" :data="curSupplementCorrectionList" border  empty-text="暂无数据" fit size="mini" style="width: 100%;">
        <el-table-column align="left" label="商品类别" width>
          <template slot-scope="scope">
            <span class="line_m" v-if="scope.row.beforeGoodClass!==scope.row.goodClass">{{ scope.row.beforeGoodClass }}</span>
            <span >{{ scope.row.goodClass }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="商品类似群组" width>
          <template slot-scope="scope">
            <span >{{ scope.row.similarGroup }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="商品代码" width>
          <template slot-scope="scope">

            <span>{{ scope.row.goodCode }}</span>

          </template>
        </el-table-column>
        <el-table-column align="left" label="商品中文名称" width>
          <template slot-scope="scope">
            <span class="line_m" v-if="scope.row.beforeName!==scope.row.goodName">{{ scope.row.beforeName }}</span>
            <span >{{ scope.row.goodName }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="商品英文名称" width>
          <template slot-scope="scope">
            <span class="line_m" v-if="scope.row.beforNameEn!==scope.row.goodNameEn">{{ scope.row.beforNameEn }}</span>
            <span>{{ scope.row.goodNameEn }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="商品日文名称" width>
          <template slot-scope="scope">
            <span class="line_m" v-if="scope.row.beforNameJp!==scope.row.goodJpName">{{ scope.row.beforNameJp }}</span>
            <span>{{ scope.row.goodJpName }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="本次操作" prop="operate" width>
        </el-table-column>
      </el-table>
      <pagination :storage="false" :limit.sync="supplementCorrection.pageSize" :page.sync="supplementCorrection.pageNo" :total="supplementCorrection.total" @pagination="getSupplementCorrectionList(supplementCorrectionList)" v-show="supplementCorrection.total>0" />
    </el-col>

    <el-dialog :close-on-click-modal="false" :append-to-body="true" :show-close="false" :visible.sync="dialogFormgoods" @open="goodsDialogShow" title="选择商标类别" width="70%">
      <el-dialog :visible.sync="innerVisible" append-to-body style="text-align:center" title="保存方案" width="30%">
        <el-input placeholder="请填写方案名称" v-model="planName" />

        <div class="dialog-footer" slot="footer">

          <el-button @click="innerVisible=false">
            取消
          </el-button>
          <el-button @click="siveGoodsPlanBtn" type="primary">
            确定
          </el-button>
        </div>
      </el-dialog>
      <el-form label-position="left" ref="creatwfconForm" size="small" style="width: 100%;">
        <el-row class="form-border">
          <el-col :span="24">
            <el-row class="fullRow">
              <el-col :span="24">
                <el-form-item v-if="goodsSelectPlan != 2" class="postInfo-container-item" label="选择方式:">
                  <template>
                    <el-select :clearable="true" default-first-option filterable placeholder="请选择" v-model="goodsSelectPlan">
                      <el-option label="手动填写" value="3" />
                      <el-option label="选择已有方案" value="0" />
                      <el-option label="智能推荐" value="1" />
                      <el-option label="自助选择" value="2" />
                      <el-option label="复制导入" value="4" />
                      <el-option label="execl导入" value="5" />
                    </el-select>
                    <el-button @click="goods=[]" style='margin-left:10px'>
                      全部删除
                    </el-button>
                    <el-button v-if="goodsSelectPlan == '5'" @click="downLoadModel" type="primary" style='margin-left:10px'>
                      导入模板下载
                    </el-button>
                  </template>
                </el-form-item>
                <template v-else>
                  <el-row class="first-row">
                    <el-col :span="goodsSelectPlan == 2 ? 8 : 24">
                      <el-form-item class="" label="选择方式:" label-width="120px">
                        <template>
                          <el-select style="width: 180px;" :clearable="true" default-first-option filterable placeholder="请选择" v-model="goodsSelectPlan">
                            <el-option label="手动填写" value="3" />
                            <!--                    <el-option label="选择已有方案" value="0" />-->
                            <el-option label="智能推荐" value="1" />
                            <el-option label="自助选择" value="2" />
                            <el-option label="复制导入" value="4" />
                            <el-option label="execl导入" value="5" />
                          </el-select>
                        </template>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item class="" label="类别:" label-width="120px">
                        <el-input v-model="goodClass" clearable></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item class="" label="群组:" label-width="120px">
                        <el-input v-model="similarGroup" clearable></el-input>
                      </el-form-item>
                    </el-col>
                    <!--            <el-col :span="5" v-if="goodsSelectPlan == 2">-->
                    <!--              <el-form-item class="" label="商品代码:">-->
                    <!--                <el-input v-model="goodCode" clearable></el-input>-->
                    <!--              </el-form-item>-->
                    <!--            </el-col>-->
                  </el-row>
                  <el-row class="first-row">
                    <el-col :span="8">
                      <el-form-item class="" label="中文名称" label-width="120px">
                        <el-input v-model="nameCn" clearable></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item class="" label="英文名称:" label-width="120px">
                        <el-input v-model="nameEn" clearable></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item class="" label="商品代码:" label-width="120px">
                        <el-input v-model="goodCode" clearable></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <div v-if="goodsSelectPlan == 2" style="display:flex;justify-content: flex-end;padding: 5px;border-right: 1px solid;border-color: #d7d7d7">
                    <el-button @click="goods=[]" size="mini" style='margin-left:10px'>
                      全部删除
                    </el-button>
                    <el-button size="mini" @click="searchGoodsNew" type="primary" style='margin-left:10px;'>
                      查询
                    </el-button>
                  </div>
                  <AgGridVue :style="{width:'100%','height':'350px',border:'1px'}"
                             class="ag-theme-balham"
                             ref="gridApi"
                             :columnDefs="columnDefsN"
                             :gridOptions="gridOptions"
                             :rowData="pageGoods"
                             rowSelection="multiple"
                             :localeText="$store.state.caseInformation.localeText"
                             :getContextMenuItems="getContextMenuItemsN"
                             :rowHeight="28"
                             animateRows
                             suppressAutoSize
                             :suppressRowDrag="false"
                             :rowDragManaged="false"
                             :suppressMoveWhenRowDragging="true"
                             :frameworkComponents="frameworkComponents"
                  >
                  </AgGridVue>
                  <pagination :storage="false" :limit.sync="goodslistPageData.pageSize" :page.sync="goodslistPageData.pageNo" :total="goodslistPageData.total" @pagination="getgoodsList(goods)" v-show="goodslistPageData.total>0" />
                </template>
              </el-col>
            </el-row>
            <el-row class="fullRow" v-if="goodsSelectPlan=='0'">
              <el-col :span="24">
                <el-form-item class="postInfo-container-item" label="选择已有方案:">
                  <template>

                    <el-select @change="goodsPlanselectChange" default-first-option placeholder="请选择" v-model="goodsPlan">
                      <el-option v-for="(item,key) in selectData.goodsPlanselect" :key="key" :label="item.planName" :value="item.planId">
                        <span style="float: left">{{ item.planName }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px"><i @click="delPlan(item.planId)" class="el-icon-close" /></span>
                      </el-option>
                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
              <el-col :span="24" style="text-align: right;margin-top:10px">
                <el-table :data="pageGoods" border current-row-key empty-text="暂无数据" fit highlight-current-row size="mini" style="width: 100%;">
                  <el-table-column align="left" label="商品类别" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.goodClass }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="left" label="商品类似群组" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.similarGroup }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="left" label="商品代码" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.goodCode }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="left" label="商品中文名称" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.goodName }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="left" label="商品英文名称" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.goodEnName }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="left" label="商品日文名称" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.goodJpName }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column align="left" label="操作" width>
                    <template slot-scope="scope">
                      <el-button @click="delgood(scope.row)" type="text">删除</el-button>
                    </template>
                  </el-table-column>

                </el-table>
                <pagination :storage="false" :limit.sync="goodslistPageData.pageSize" :page.sync="goodslistPageData.pageNo" :total="goodslistPageData.total" @pagination="getgoodsList(goods)" v-show="goodslistPageData.total>0" />
              </el-col>
            </el-row>
            <el-row class="fullRow" v-if="goodsSelectPlan=='1'">
              <el-col :span="24">
                <el-form-item class="postInfo-container-item" label="选择领域:">
                  <template>
                    <el-select :clearable="true" @change="zngoodChange" default-first-option filterable placeholder="请选择" v-model="zngood">
                      <el-option :key="index" :label="key" :value="value" v-for="(value, key, index) in selectData.goodszn" />

                    </el-select>
                    <el-select :clearable="true" @change="zngoodChangeb" default-first-option filterable placeholder="请选择" style="margin-left:10px" v-model="zngoodb">
                      <el-option :key="key" :label="item.type2" :value="item.id" v-for="(item,key) in selectData.goodsznselect" />

                    </el-select>
                  </template>
                </el-form-item>
              </el-col>
              <el-col :span="24" style="text-align: right;margin-top:10px">
                <el-table :data="pageGoods" border current-row-key empty-text="暂无数据" fit highlight-current-row size="mini" style="width: 100%;">

                  <el-table-column align="left" label="商品类别" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.goodClass }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="left" label="商品类似群组" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.similarGroup }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="left" label="商品代码" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.goodCode }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="left" label="商品中文名称" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.goodName }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="left" label="商品英文名称" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.goodEnName }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="left" label="商品日文名称" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.goodJpName }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column align="left" label="操作" width>
                    <template slot-scope="scope">
                      <el-button @click="delgood(scope.row)" type="text">删除</el-button>
                    </template>
                  </el-table-column>

                </el-table>
                <pagination :storage="false" :limit.sync="goodslistPageData.pageSize" :page.sync="goodslistPageData.pageNo" :total="goodslistPageData.total" @pagination="getgoodsList(goods)" v-show="goodslistPageData.total>0" />
              </el-col>
            </el-row>
<!--            <el-row class="" v-if="goodsSelectPlan=='2'">-->
<!--              <el-col :span="24">-->
<!--                <el-row style="height:600px">-->
<!--                  <el-col :span="6" style="overflow: auto; padding:10px 10px;border-right:1px solid #ddd;height:100%;">-->

<!--                    <el-input placeholder="请输入搜索内容" @keyup.enter.native="searchGoods" size="mini" style="width:64%" v-model="filterText" />-->
<!--                    <el-button @click="searchGoods" icon="el-icon-search" size="mini" style="margin-left:0px" type="primary" />-->
<!--                    &lt;!&ndash; <el-button @click="filterText=''" style="margin-left:0px" type="primary" icon="el-icon-refresh"-->
<!--                      size="mini">-->
<!--                    </el-button> &ndash;&gt;-->
<!--                    <el-tree v-if='searchGoodsData.length<=0' empty-text='' :load="loadGoodNode" :data="searchGoodsData" :default-expand-all="false" :props="goodsTreeProps" lazy accordion class="filter-tree" node-key="id" ref="goodstree" show-checkbox />-->
<!--                    <el-tree else :data="searchGoodsData" :default-expand-all="true" empty-text='' :props="goodsTreeProps" accordion class="filter-tree" node-key="id" ref="goodstree1" show-checkbox />-->
<!--                  </el-col>-->
<!--                  <el-col :span="1" style="padding:0px 0px;height:100%;line-height:600px;border-right:1px solid #ddd;">-->
<!--                    <el-button @click="addGoods" icon="el-icon-d-arrow-right" size="mini" style="margin-left:0px" type="primary" />-->
<!--                  </el-col>-->
<!--                  <el-col :span="17" style=" overflow: auto;padding:10px 10px;height:100%;border-right:1px solid #ddd;">-->
<!--                    <el-table :data="pageGoods" border current-row-key empty-text="暂无数据" fit highlight-current-row size="mini" style="width: 100%;">-->

<!--                      <el-table-column align="left" label="商品类别" width>-->
<!--                        <template slot-scope="scope">-->
<!--                          <span>{{ scope.row.goodClass }}</span>-->
<!--                        </template>-->
<!--                      </el-table-column>-->
<!--                      <el-table-column align="left" label="商品类似群组" width>-->
<!--                        <template slot-scope="scope">-->
<!--                          <span>{{ scope.row.similarGroup }}</span>-->
<!--                        </template>-->
<!--                      </el-table-column>-->
<!--                      <el-table-column align="left" label="商品代码" width>-->
<!--                        <template slot-scope="scope">-->
<!--                          <span>{{ scope.row.goodCode }}</span>-->
<!--                        </template>-->
<!--                      </el-table-column>-->
<!--                      <el-table-column align="left" label="商品中文名称" width>-->
<!--                        <template slot-scope="scope">-->
<!--                          <span>{{ scope.row.goodName }}</span>-->
<!--                        </template>-->
<!--                      </el-table-column>-->
<!--                      <el-table-column align="left" label="商品英文名称" width>-->
<!--                        <template slot-scope="scope">-->
<!--                          <span>{{ scope.row.goodEnName }}</span>-->
<!--                        </template>-->
<!--                      </el-table-column>-->
<!--                      <el-table-column align="left" label="商品日文名称" width>-->
<!--                        <template slot-scope="scope">-->
<!--                          <span>{{ scope.row.goodJpName }}</span>-->
<!--                        </template>-->
<!--                      </el-table-column>-->

<!--                      <el-table-column align="left" label="操作" width>-->
<!--                        <template slot-scope="scope">-->
<!--                          <el-button @click="delgood(scope.row)" type="text">删除</el-button>-->
<!--                        </template>-->
<!--                      </el-table-column>-->

<!--                    </el-table>-->
<!--                    <pagination :storage="false" :limit.sync="goodslistPageData.pageSize" :page.sync="goodslistPageData.pageNo" :total="goodslistPageData.total" @pagination="getgoodsList(goods)" v-show="goodslistPageData.total>0" />-->
<!--                  </el-col>-->
<!--                </el-row>-->
<!--              </el-col>-->
<!--            </el-row>-->
            <el-row class="fullRow" v-if="goodsSelectPlan=='3'">
              <el-col :span="24">
                <el-form-item class="postInfo-container-item" label="商品信息:">
                  <template>
                    <el-input :rows="4" placeholder="商品名称以回车分隔。" type="textarea" v-model="jyText" />
                    <el-button @click="jyGoods" style="margin-top:10px" type="primary">
                      校验信息
                    </el-button>
                  </template>
                </el-form-item>
              </el-col>
              <el-col :span="24" style="text-align: right;margin-top:10px">
                <el-table :data="pageGoods" :row-class-name="tableRowClassName" border current-row-key empty-text="暂无数据" fit highlight-current-row size="mini" style="width: 100%;">

                  <el-table-column align="left" label="商品类别" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.goodClass }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="left" label="商品类似群组" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.similarGroup }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="left" label="商品代码" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.goodCode }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="left" label="商品中文名称" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.goodName }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="left" label="商品英文名称" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.goodEnName }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="left" label="商品日文名称" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.goodJpName }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column align="left" label="操作" width>
                    <template slot-scope="scope">
                      <el-button @click="delgood(scope.row)" type="text">删除</el-button>
                    </template>
                  </el-table-column>

                </el-table>
                <pagination :storage="false" :limit.sync="goodslistPageData.pageSize" :page.sync="goodslistPageData.pageNo" :total="goodslistPageData.total" @pagination="getgoodsList(goods)" v-show="goodslistPageData.total>0" />
              </el-col>
            </el-row>
            <el-row class="fullRow" v-if="goodsSelectPlan=='4'">
              <el-col :span="24">
                <el-form-item class="postInfo-container-item" label="案卷号:">
                  <template>
                    <el-input placeholder="请输入需要导入的案卷号" v-model="goodsCaseNumber" />
                    <el-button @click="getGoodsBycaseNumber" size="mini" style="margin-left:10px" type="primary">导入
                    </el-button>
                  </template>
                </el-form-item>

              </el-col>
              <el-col :span="24" style="text-align: right;margin-top:10px">
                <el-table :data="pageGoods" border current-row-key empty-text="暂无数据" fit highlight-current-row size="mini" style="width: 100%;">

                  <el-table-column align="left" label="商品类别" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.goodClass }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="left" label="商品类似群组" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.similarGroup }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="left" label="商品代码" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.goodCode }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="left" label="商品中文名称" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.goodName }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="left" label="商品英文名称" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.goodEnName }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="left" label="商品日文名称" width>
                    <template slot-scope="scope">
                      <span>{{ scope.row.goodJpName }}</span>
                    </template>
                  </el-table-column>

                  <el-table-column align="left" label="操作" width>
                    <template slot-scope="scope">
                      <el-button @click="delgood(scope.row)" type="text">删除</el-button>
                    </template>
                  </el-table-column>

                </el-table>
                <pagination :storage="false" :limit.sync="goodslistPageData.pageSize" :page.sync="goodslistPageData.pageNo" :total="goodslistPageData.total" @pagination="getgoodsList(goods)" v-show="goodslistPageData.total>0" />
              </el-col>
            </el-row>
            <el-row class="fullRow" v-if="goodsSelectPlan=='5'">
<!--              <upload-xlsx @changeClick="clickUpload=false" @getFirstSheet="getFirstSheet" :clickUpload="clickUpload"></upload-xlsx>-->
              <uploadFile :clickUpload="clickUpload" @getUploadFile="getUploadFile" @changeClick="clickUpload=false" :multiple="false"></uploadFile>
              <el-button type="primary" @click="clickUpload=true" style="float:right">导入</el-button>
              <el-table :row-class-name="tableRowClassName" :data="pageGoods" border current-row-key empty-text="暂无数据" fit highlight-current-row size="mini" style="width: 100%;">

                <el-table-column align="left" label="商品类别" width>
                  <template slot-scope="scope">
                    <span>{{ scope.row.goodClass }}</span>
                  </template>
                </el-table-column>
                <el-table-column align="left" label="商品类似群组" width>
                  <template slot-scope="scope">
                    <span>{{ scope.row.similarGroup }}</span>
                  </template>
                </el-table-column>
                <el-table-column align="left" label="商品代码" width>
                  <template slot-scope="scope">
                    <span>{{ scope.row.goodCode }}</span>
                  </template>
                </el-table-column>
                <el-table-column align="left" label="商品中文名称" width>
                  <template slot-scope="scope">
                    <span>{{ scope.row.goodName }}</span>
                  </template>
                </el-table-column>
                <el-table-column align="left" label="商品英文名称" width>
                  <template slot-scope="scope">
                    <span>{{ scope.row.goodEnName }}</span>
                  </template>
                </el-table-column>
                <el-table-column align="left" label="商品日文名称" width>
                  <template slot-scope="scope">
                    <span>{{ scope.row.goodJpName }}</span>
                  </template>
                </el-table-column>

                <el-table-column align="left" label="操作" width>
                  <template slot-scope="scope">
                    <el-button @click="delgood(scope.row)" type="text">删除</el-button>
                  </template>
                </el-table-column>

              </el-table>
              <pagination :storage="false" :limit.sync="goodslistPageData.pageSize" :page.sync="goodslistPageData.pageNo" :total="goodslistPageData.total" @pagination="getgoodsList(goods)" v-show="goodslistPageData.total>0" />
            </el-row>
          </el-col>
        </el-row>

      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="siveGoodsPlan" v-if="goodsSelectPlan != 2">
          保存方案
        </el-button>
        <el-button @click="goodsDialogqx">
          取消
        </el-button>
        <el-button @click="exGoods" type="primary">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      v-if="showAllGoodsView"
      title="全部商品"
      :close-on-click-modal="false"
      :visible.sync="showAllGoodsView"
        width="80%"
        height="80%"
        class="abow_dialog"
      :before-close="closeShowAllGoodsView"
      >
      <div>
        <AgGridVue :style="{width:'100%','height': agHeight,border:'1px'}"
                 class="ag-theme-balham"
                 ref="gridApi"
                 :columnDefs="columnDefs"
                 :gridOptions="gridOptions1"
                 :rowData="this.version ? pageGoodsw.filter(item => item.version == this.version) : pageGoodsw"
                 rowSelection="multiple"
                 :localeText="$store.state.caseInformation.localeText"
                 :getContextMenuItems="getContextMenuItems"
                 :rowHeight="28"
                 animateRows
                 suppressAutoSize
                 :suppressRowDrag="false"
                 :rowDragManaged="true"
                 :suppressMoveWhenRowDragging="true"
                 @rowDragEnd ="rowDragEnd"
                   :frameworkComponents="frameworkComponents"
      >
      </AgGridVue>
      </div>
      <div class="dialog-footer fl-ac-jc" slot="footer">
        <el-button @click="() => closeShowAllGoodsView()" type="primary">
          关闭
        </el-button>
      </div>
    </el-dialog>

<!--    版本对比-->
    <el-dialog
      v-if="compareVersionView"
      title="版本比对"
      :close-on-click-modal="false"
      :visible.sync="compareVersionView"
      width="80%"
      height="80%"
      class="compareDialog"
      >
      <div>
        <div style="display: flex;">
          <div style="margin-right: 5px;margin-bottom: 10px;color: #333">选择版本:</div>
          <el-select style="flex: 1" default-first-option placeholder="请选择" @change="changeCompareVersion"
             v-model="compareVersionList" multiple filterable clearable>
            <el-option v-for="(item, key)  in goodsVersionList.filter(j => goodsListData.find(i => i.version === j.id))" :key="item.id"
                       :label="item.typeName" :value="item.id">
            </el-option>
          </el-select>
          <el-button type="primary" size="mini" style="height: 32px;margin-left: 10px" @click="exportVersions">导出</el-button>
        </div>
        <AgGridVue :style="{width:'100%','height': '350px',border:'1px'}"
                 class="ag-theme-balham"
                 ref="gridApi"
                 :columnDefs="versionColumnDefs"
                 :gridOptions="gridOptions2"
                 :rowData="compareVerionData"
                 rowSelection="multiple"
                 :localeText="$store.state.caseInformation.localeText"
                 :rowHeight="28"
                 animateRows
                 suppressAutoSize
      >
      </AgGridVue>
      </div>
      <div class="dialog-footer fl-ac-jc" slot="footer">
        <el-button @click="compareVersionView = false" type="primary">
          关闭
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  GSQAllcategoryUrl,
  GSQCategoryUrl,
  deleteGoodsPlanUrl,
  addGoodsPlanUrl,
  queryGoodsByAgentNumUrl,
  queryGoodsPlanUrl,
  queryGoodsUrl,
  GSQQueryAllClassUrl,
  queryListByUrl,
  queryDetaileGroupUrl,
  GSQQueryClassUrl,
  GSQQueryFirstClassUrl,
  queryByNameUrl,
  queryCaseGory, queryByNameNewUrl
} from '@/api/caseDetail'
import Pagination from "@/components/Pagination";
import uploadXlsx from '@/components/fileReadXLSX'
import {importExcel, queryGoodsContrast} from "../../../../api/caseDetail";
import UploadFile from "../../material_management/components/uploadFile";
import {deriveList} from "../../../../api/caseList";
import agInputLimitNumber from '../../../../components/ag-input-number'
export default {
  name: "goods",
  components: {UploadFile, Pagination,uploadXlsx },
  props: {
    appFromto: {},
    trademarkCaseCategoryModifyList: {
      type: Array,
      default: () => []
    },
    goodsVersionList: {
      type: Array,
      default: () => []
    },
    appId: "",
    goodsListData: {
      type: Array,
      default: ()=>([])
    },
    caseId:{

    },
    type:{

    },
    isRevamp:{

    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    let that=this
    return {
      columnDefsN: [
        {
          headerName: '序号',
          field: 'sid',
          width:70,
          enableRowGroup: true,
          resizable: true,
          floatingFilter:true,
          filter: false,
          cellClass: 'vAlign',
          suppressMenu: true,
          checkboxSelection: false,
          headerCheckboxSelection: false,
          headerCheckboxSelectionFilteredOnly: true,
          cellRenderer:this.cellRenderer,
          rowDrag: false
        },
        {
          headerName: '类别',
          field: 'goodClass',
          resizable: true,
          cellStyle: { 'text-align':'left','white-space': 'normal' },
          sortable: true,
          width:120,
          filter: 'agSetColumnFilter',
          menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
          editable: false,
          cellRenderer: this.cellRenderer,
          cellEditor: 'agInputLimitNumber'
        },
        { headerName: '商品类似群组',
          field:'similarGroup',
          filter: 'agSetColumnFilter',
          menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
          resizable: true,
          cellStyle: { 'text-align': 'left','white-space': 'normal' },
          editable: false,
          cellRenderer: this.cellRenderer,
        },
        { headerName: '商品代码',
          field:'goodCode',
          cellStyle: { 'text-align': 'left','white-space': 'normal' },
          filter: 'agSetColumnFilter',
          menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
          resizable: true,
          editable: false,
          cellRenderer: this.cellRenderer,
        },
        { headerName: '商品中文名称',
          field:'goodName',
          cellStyle: { 'text-align': 'left','white-space': 'normal' },
          filter: 'agSetColumnFilter',
          menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
          editable: false,
          resizable: true,
          cellRenderer: this.cellRenderer,
        },
        { headerName: '商品英文名称',
          field:'goodEnName',
          cellStyle: { 'text-align': 'left','white-space': 'normal' },
          filter: 'agSetColumnFilter',
          menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
          editable: false,
          resizable: true,
          cellRenderer: this.cellRenderer,
        },
        { headerName: '商品日文名称',
          field:'goodJpName',
          cellStyle: { 'text-align': 'left','white-space': 'normal' },
          filter: 'agSetColumnFilter',
          menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
          editable: false,
          resizable: true,
          cellRenderer: this.cellRenderer,
        }
      ],
      nameCn: '',
      nameEn: '',
      goodCode: '',
      similarGroup: '',
      goodClass: '',
      frameworkComponents: {
        agInputLimitNumber: agInputLimitNumber
      },
      allVersionColumnDefs: [],
      compareVersionList: [],
      compareVersionView: false,
      modifyUserName: '',
      modifyDate: '',
      version: '',
      pageSizesList:[10, 50, 200,500, 1000],
      pageAllGoodsw: [],
      showAllGoodsView: false,
      columnDefs:[],
      compareVerionData: [],
      versionColumnDefs: [],
      gridApiG: {},
      gridApi: {},
      defaultVersionColumnDefs: [
        {
          'pinned': 'left',
          headerName: '类别',
          field: 'goodClass',
          resizable: true,
          cellStyle: { 'text-align':'left','white-space': 'normal' },
          sortable: true,
          width:70,
          filter: 'agSetColumnFilter',
          menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
          editable: false,
          cellRenderer: this.cellRenderer,
          cellEditor: 'agInputLimitNumber',
        },
        {
          'pinned': 'left',
          headerName: '编号',
          field: 'number',
          resizable: true,
          cellStyle: { 'text-align':'left','white-space': 'normal' },
          sortable: true,
          width:70,
          filter: 'agSetColumnFilter',
          menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
          editable: false,
          cellRenderer: this.cellRenderer,
        }
      ],
      gridOptionsG:{
        ...this.$store.state.caseInformation.gridOptions,
        onColumnResized(params) {
          params.api.resetRowHeights();
        },
        onGridReady: (params)=>{
          this['gridApiG'] = params.api
          // this.data.billDetailsfwf.forEach(function(data, index) {
          //   data.id = index;
          // });
          // params.api.setRowData(this.data.billDetailsfwf);
           params.api.sizeColumnsToFit();
        },
        // singleClickEdit:true,
        // onCellEditingStarted: function (event) {
        //   console.log('cellEditingStarted');
        // },
        onCellEditingStarted(event){
          that.preValue = event.value

          // that.edit(event.data)
        },
        // getRowHeight(params){
        //   if(params.data.description){
        //     return (params.api.getSizesForCurrentTheme().rowHeight * Math.floor(params.data.description.length / 50))
        //   }else {
        //     return 28
        //   }
        //  // return (params.api.getSizesForCurrentTheme().rowHeight * Math.floor(params.data.description.length / 50))
        // },
        onCellValueChanged(event){

        },
        onCellEditingStopped(event){
          if (that.preValue === event.value)return;
          if(event.colDef.field=='goodName'){
            that.queryList(event.value,event.data)
          }

          // that.save(event.data)
          // if(that.preValue===event.value){
          //   return;
          // }
          // // this['gridApi'+'billDetailsfwf'].resetRowHeights();
          // this.changeRowFwf(event)
          // this.resetRowHeights('billDetailsfwf')
        },
      },
      gridOptions:{
        ...this.$store.state.caseInformation.gridOptions,
        onColumnResized(params) {
          params.api.resetRowHeights();
        },
        onGridReady: (params)=>{
          this['gridApi'] = params.api
          // this.data.billDetailsfwf.forEach(function(data, index) {
          //   data.id = index;
          // });
          // params.api.setRowData(this.data.billDetailsfwf);
           params.api.sizeColumnsToFit();
        },
        // singleClickEdit:true,
        // onCellEditingStarted: function (event) {
        //   console.log('cellEditingStarted');
        // },
        onCellEditingStarted(event){
          that.preValue = event.value

          // that.edit(event.data)
        },
        // getRowHeight(params){
        //   if(params.data.description){
        //     return (params.api.getSizesForCurrentTheme().rowHeight * Math.floor(params.data.description.length / 50))
        //   }else {
        //     return 28
        //   }
        //  // return (params.api.getSizesForCurrentTheme().rowHeight * Math.floor(params.data.description.length / 50))
        // },
        onCellValueChanged(event){

        },
        onCellEditingStopped(event){
          if (that.preValue === event.value)return;
          if(event.colDef.field=='goodName'){
            that.queryList(event.value,event.data)
          }

          // that.save(event.data)
          // if(that.preValue===event.value){
          //   return;
          // }
          // // this['gridApi'+'billDetailsfwf'].resetRowHeights();
          // this.changeRowFwf(event)
          // this.resetRowHeights('billDetailsfwf')
        },
      },
      gridOptions2: {...this.$store.state.caseInformation.gridOptions, onGridReady: (params)=>{
          this['gridApi2'] = params.api
          // this.data.billDetailsfwf.forEach(function(data, index) {
          //   data.id = index;
          // });
          // params.api.setRowData(this.data.billDetailsfwf);
          //  params.api.sizeColumnsToFit();
        },},
      gridOptions1:{
        ...this.$store.state.caseInformation.gridOptions,
        onColumnResized(params) {
          params.api.resetRowHeights();
        },
        onGridReady: (params)=>{
          this['gridApi1'] = params.api
          // this.data.billDetailsfwf.forEach(function(data, index) {
          //   data.id = index;
          // });
          // params.api.setRowData(this.data.billDetailsfwf);
           params.api.sizeColumnsToFit();
        },
        // singleClickEdit:true,
        // onCellEditingStarted: function (event) {
        //   console.log('cellEditingStarted');
        // },
        onCellEditingStarted(event){
          that.preValue = event.value

          // that.edit(event.data)
        },
        // getRowHeight(params){
        //   if(params.data.description){
        //     return (params.api.getSizesForCurrentTheme().rowHeight * Math.floor(params.data.description.length / 50))
        //   }else {
        //     return 28
        //   }
        //  // return (params.api.getSizesForCurrentTheme().rowHeight * Math.floor(params.data.description.length / 50))
        // },
        onCellValueChanged(event){

        },
        onCellEditingStopped(event){
          if (that.preValue === event.value)return;
          if(event.colDef.field=='goodName'){
            that.queryList(event.value,event.data)
          }

          // that.save(event.data)
          // if(that.preValue===event.value){
          //   return;
          // }
          // // this['gridApi'+'billDetailsfwf'].resetRowHeights();
          // this.changeRowFwf(event)
          // this.resetRowHeights('billDetailsfwf')
        },
      },
      treeLazy: true,

      goodsDelBool: false,
      multipleSelection: [],
      searchdata: [],
      goods: [],
      jyText: "",
      filterText: "",
      goodsSelectPlan: "3",
      innerVisible: false,
      pageGoods: [],
      pageGoodsw: [],
      goodsCaseNumber: "",
      goodsTreeProps: {
        label: function (data, node) {
          if (node.level == 1) {
            return data.classshortname;
          }
          if (node.level == 2) {
            return data.groupshortname;
          }
          if (node.level == 3) {
            return data.goodName;
          }
        },
        children: "chaild",
        isLeaf: function (data, node) {
          if (node.level == 3) {
            return true;
          }
        }
      },
      clickUpload:false,
      goodslistPageData: {
        total: 0,
        pageNo: 1,
        pageSize: 10
      },
      supplementCorrection:{
        total: 0,
        pageNo: 1,
        pageSize: 10
      },
      goodslistPageDataw: {
        total: 0,
        pageNo: 1,
        pageSize: 10
      },
      searchGoodsData: [],
      searchval: "",
      goodsData: [],
      dialogFormgoods: false,
      planName: "",
      zngoodb: "",
      zngood: "",
      goodsPlan: "",
      selectData: {
        goodsznselect: [],
        goodszn: [],
        goodsPlanselect: []
      },
      supplementCorrectionState:false,
      supplementCorrectionList:[],
      curSupplementCorrectionList:[]
    };
  },
  watch: {
    appFromto: {
      handler(n) {
        if (['内-外', '外-外'].includes(this.appFromto)) {
          this.columnDefs = [
            {
              headerName: '序号',
              field: 'sid',
              width:70,
              enableRowGroup: true,
              resizable: true,
              floatingFilter:true,
              filter: false,
              cellClass: 'vAlign',
              suppressMenu: true,
              checkboxSelection: false,
              headerCheckboxSelection: false,
              headerCheckboxSelectionFilteredOnly: true,
              cellRenderer:this.cellRenderer,
              rowDrag: true
            },
            {
              headerName: '编号',
                field: 'number',
                resizable: true,
                cellStyle: { 'text-align':'left','white-space': 'normal' },
                sortable: true,
                width:70,
                filter: 'agSetColumnFilter',
                menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
                editable: false,
                cellRenderer: this.cellRenderer
            },
            {
              headerName: '类别',
              field: 'goodClass',
              resizable: true,
              cellStyle: { 'text-align':'left','white-space': 'normal' },
              sortable: true,
              width:120,
              filter: 'agSetColumnFilter',
              menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
              editable: true,
              cellRenderer: this.cellRenderer,
              cellEditor: 'agInputLimitNumber'
            },
            { headerName: '商品类似群组',
              field:'similarGroup',
              filter: 'agSetColumnFilter',
              menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
              resizable: true,
              cellStyle: { 'text-align': 'left','white-space': 'normal' },
              editable: true,
              cellRenderer: this.cellRenderer,
            },
            { headerName: '商品代码',
              field:'goodCode',
              cellStyle: { 'text-align': 'left','white-space': 'normal' },
              filter: 'agSetColumnFilter',
              menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
              resizable: true,
              editable: true,
              cellRenderer: this.cellRenderer,
            },
            { headerName: '商品中文名称',
              field:'goodName',
              cellStyle: { 'text-align': 'left','white-space': 'normal' },
              filter: 'agSetColumnFilter',
              menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
              editable: true,
              resizable: true,
              cellRenderer: this.cellRenderer,
            },
            { headerName: '商品英文名称',
              field:'goodEnName',
              cellStyle: { 'text-align': 'left','white-space': 'normal' },
              filter: 'agSetColumnFilter',
              menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
              editable: true,
              resizable: true,
              cellRenderer: this.cellRenderer,
            },
            { headerName: '商品日文名称',
              field:'goodJpName',
              cellStyle: { 'text-align': 'left','white-space': 'normal' },
              filter: 'agSetColumnFilter',
              menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
              editable: true,
              resizable: true,
              cellRenderer: this.cellRenderer,
            }
          ]
        } else {
          this.columnDefs = [
            {
              headerName: '序号',
              field: 'sid',
              width:70,
              enableRowGroup: true,
              resizable: true,
              floatingFilter:true,
              filter: false,
              cellClass: 'vAlign',
              suppressMenu: true,
              checkboxSelection: false,
              headerCheckboxSelection: false,
              headerCheckboxSelectionFilteredOnly: true,
              cellRenderer:this.cellRenderer,
              rowDrag: true
            },
            {
              headerName: '类别',
              field: 'goodClass',
              resizable: true,
              cellStyle: { 'text-align':'left','white-space': 'normal' },
              sortable: true,
              width:120,
              filter: 'agSetColumnFilter',
              menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
              editable: true,
              cellRenderer: this.cellRenderer,
              cellEditor: 'agInputLimitNumber'
            },
            { headerName: '商品类似群组',
              field:'similarGroup',
              filter: 'agSetColumnFilter',
              menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
              resizable: true,
              cellStyle: { 'text-align': 'left','white-space': 'normal' },
              editable: true,
              cellRenderer: this.cellRenderer,
            },
            { headerName: '商品代码',
              field:'goodCode',
              cellStyle: { 'text-align': 'left','white-space': 'normal' },
              filter: 'agSetColumnFilter',
              menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
              resizable: true,
              editable: true,
              cellRenderer: this.cellRenderer,
            },
            { headerName: '商品中文名称',
              field:'goodName',
              cellStyle: { 'text-align': 'left','white-space': 'normal' },
              filter: 'agSetColumnFilter',
              menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
              editable: true,
              resizable: true,
              cellRenderer: this.cellRenderer,
            },
            { headerName: '商品英文名称',
              field:'goodEnName',
              cellStyle: { 'text-align': 'left','white-space': 'normal' },
              filter: 'agSetColumnFilter',
              menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
              editable: true,
              resizable: true,
              cellRenderer: this.cellRenderer,
            },
            { headerName: '商品日文名称',
              field:'goodJpName',
              cellStyle: { 'text-align': 'left','white-space': 'normal' },
              filter: 'agSetColumnFilter',
              menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
              editable: true,
              resizable: true,
              cellRenderer: this.cellRenderer,
            }
          ]
        }
      },
      immediate: true
    },
    filterText (n) {
      if (n == "") {
        this.searchGoodsData = [];
      }
    },
    goodsSelectPlan (n) {
      this.planselectchange(n);
    },
    goods: function (val, oldval) {
      this.getgoodsList(val);
    },
    // goodsListData: function (val, oldval) {
    //   this.searchdata = val;
    //   this.getgoodsListw(val);
    // },
    goodsListData:{
      handler(val,oleval){
        this.searchdata = val;
        this.getgoodsListw(val);
        val.forEach(item=>{
          if(['goodClass','similarGroup','goodCode','goodName','goodEnName', 'goodJpName'].every(i=>!item[i])){
            this.$message.error('商品服务项目中有空白数据行')
          }
          ['goodClass','similarGroup','goodCode','goodName','goodEnName', 'goodJpName'].forEach(key => {
            if (typeof item[key] === 'string') {
              item[key] = item[key] ? item[key].trim() : item[key]
            }
          })
        })
      },
      deep: true
    },
    searchval: function (val) {
      if (val == "") {
        this.goodSearch();
      }
    }
  },
  computed: {
    agHeight(){
      return document.documentElement.clientHeight - 250 + 'px'
    }
  },
  methods: {
    getContextMenuItemsN(params){
      return [ {name:'复制',
        action: () =>{
          this.$copyText(params.value).then(
            res => {
            })
        }},
        {name:'删除',
          action:()=>{
            this.delgood(params.node.data)
          }
        }]
    },
    // 任务6947
    searchGoodsNew () {
      queryByNameNewUrl({ name: this.nameCn, nameEn: this.nameEn , goodClass: this.goodClass, similarGroup: this.similarGroup, goodCode: this.goodCode }).then(res => {
        this.goods = res.data
      });
    },
    downLoadModel() {
      this.$commonUtils.downLoadAll({url: `/ipdoc/template/商品服务项目导入.xlsx`})
    },
    exportVersions() {
      deriveList({
        caseId: this.caseId,
        versionList: this.compareVersionList,
        bussId: 88
      }).then(res => {
        const downData = {
          url: `${res.data.address}`,
          success() {
          }
        }
        this.$commonUtils.downLoadAll(downData)
      })
    },
    changeCompareVersion(versionList) {
      this.versionColumnDefs = []
      this.$nextTick(() => {
        this.versionColumnDefs = JSON.parse(JSON.stringify(this.defaultVersionColumnDefs)).concat(this.allVersionColumnDefs.filter(item => item.version).filter(item => versionList.find(i => i === item.version)).sort((a, b) => a.version - b.version))
      })
    },
    makeVersionCol() {
      this.allVersionColumnDefs = JSON.parse(JSON.stringify(this.defaultVersionColumnDefs))
      this.goodsVersionList.forEach(item => {
        this.allVersionColumnDefs.push(
          { headerName: item.typeName + '英文商品',
            field:'goodEnName' + item.id,
            cellStyle: { 'text-align': 'left','white-space': 'normal' },
            filter: 'agSetColumnFilter',
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            width: 250,
            editable: true,
            resizable: true,
            cellRenderer: this.cellRenderer,
            version: item.id
          },
          {
            headerName: item.typeName + '中文商品',
            field:'goodName' + item.id,
            width: 250,
            cellStyle: { 'text-align': 'left','white-space': 'normal' },
            filter: 'agSetColumnFilter',
            menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
            editable: true,
            resizable: true,
            cellRenderer: this.cellRenderer,
            version: item.id
          }
        )
      })
      this.versionColumnDefs = JSON.parse(JSON.stringify(this.defaultVersionColumnDefs)).concat(this.allVersionColumnDefs.filter(item => this.compareVersionList.find(i => i === item.version)))
    },
    compareVersion() {
      this.compareVersionList = this.goodsVersionList.filter(j => this.goodsListData.find(i => i.version === j.id)).map(item => item.id)
      if (this.compareVersionList.length < 2) {
        this.$message.error('版本数低于2，无法比对！')
        return
      }
      queryGoodsContrast({
        caseId: this.caseId,
        versionList: this.goodsVersionList.filter(j => this.goodsListData.find(i => i.version === j.id)).map(item => item.id),
      }).then(res => {
        this.compareVersionView = true
        this.compareVerionData = []
        if (res.data.length) {
          const numberList = res.data.map(item => {
            if (item.data.length) {
              item.data = item.data.map(good => ({
                ['goodName' + item.version]: good.goodName,
                ['goodEnName' + item.version]: good.goodEnName,
                number: good.number,
                goodClass: good.goodClass
              }))
              return item.data
            } else {
              return []
            }
          }).flat()
          const uniqueNumberList = [...new Set(numberList.map(item => item.number))]
          uniqueNumberList.forEach(item => {
            function findAllAttr(objList, number) {
              let bigObj = {}
              objList.forEach(obj => {
                if (obj.number === number) {
                  for (let key in obj) {
                    bigObj[key] = obj[key]
                  }
                }
              })
              return bigObj
            }
            this.compareVerionData.push({
              number: item,
              ...findAllAttr(numberList, item)
            })
          })
        }
        this.makeVersionCol()
      })
    },
    goodAdd() {
      if ( ['内-外', '外-外'].includes(this.appFromto) && !this.goodsListData.filter(item => item.version && item.version == this.version).length && this.goodsListData.filter(item => item.version && item.version != this.version).length) {
        const h = this.$createElement
        const params = {
          version1: ''
        }
        let vnode = h({
          template: `
            <div>
              <el-form label-width="100px">
                <el-row>
                  <el-form-item label="选择版本:">
                    <el-select default-first-option placeholder="请选择" @change="changeValue"
                       v-model="version1" filterable>
                      <el-option v-for="(item, key)  in versionList" :key="item.id"
                                 :label="item.typeName" :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-row>
              </el-form>
            </div>`,
          props: {
            params: {},
            versionList: {}
          },
          methods: {
            changeValue(value) {
              this.params.version1 = value
            }
          },
          data() {
            return {
              version1: ''
            }
          },
        }, {
          props: {
            params,
            versionList: this.goodsVersionList.filter(item => this.goodsListData.find(i => i.version == item.id))
          }
        })
        this.$confirm(vnode, "是否导入之前版本的商品/服务项目？", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            if (params.version1) {
              done()
            } else {
              this.$message.error('请选择版本!')
            }
          } else {
            done()
          }
        }
        }).then(() => {
          const list = JSON.parse(JSON.stringify(this.goodsListData))
          this.$emit(
            "getGoods",
            list.filter(item => item.version == params.version1).map(item => {
              item.version = this.version
              item.cateId = undefined
              return item
            })
          )
        }).catch(() => {
          this.dialogFormgoods = true
        })
      } else {
        this.dialogFormgoods = true
      }
    },
    changeVersion(v) {
      if (this.trademarkCaseCategoryModifyList.find(item => item.goodVersion == v)) {
        this.modifyUserName = this.trademarkCaseCategoryModifyList.find(item => item.goodVersion == v).modifyUserName
        this.modifyDate = this.trademarkCaseCategoryModifyList.find(item => item.goodVersion == v).modifyDate
      } else {
        this.modifyUserName = ''
        this.modifyDate = ''
      }
      this.getgoodsListw(this.goodsListData)
    },
    closeShowAllGoodsView(close){
      this.showAllGoodsView = false
      close && close()
    },
    showAllGoods(){
      this.showAllGoodsView = true
      this.goodslistPageDataw.pageSize = 1000
      this.goodslistPageDataw.pageNo = 1
      this.getgoodsListw(this.goodsListData)

    },
    rowDragEnd(event){
      var movingNode = event.node;
      var overNode = event.overNode || {};
      var rowNeedsToMove = movingNode !== overNode;
      if (rowNeedsToMove) {
        var movingData = movingNode.data;
        var overData = overNode.data;
        var fromIndex = this.pageGoodsw.indexOf(movingData);
        var fromIndex1 = this.goodsListData.indexOf(movingData);
        var toIndex = this.pageGoodsw.indexOf(overData);
        var toIndex1 = this.goodsListData.indexOf(overData);
        var newStore = this.pageGoodsw.slice();
        var newStore1 = this.goodsListData
        moveInArray(newStore, fromIndex, toIndex);
        moveInArray(newStore1, fromIndex1, toIndex1);

        this.pageGoodsw = newStore;
        this.goodsListData=newStore1
        this['gridApiG'].setRowData(newStore);
        this['gridApiG'].clearFocusedCell();
        // this.sortNo()
      }
      function moveInArray(arr, fromIndex, toIndex) {
        var element = arr[fromIndex];
        arr.splice(fromIndex, 1);
        arr.splice(toIndex, 0, element);
      }
    },
    stopEditing(){
      this['gridApiG'].stopEditing(false)
    },
    getcolumnDefs(type){
      // var preferenceList = [
      //   {
      //     headerName: '序号',
      //     field: 'sid',
      //     width:70,
      //     enableRowGroup: true,
      //     resizable: true,
      //     floatingFilter:true,
      //     filter: false,
      //     cellClass: 'vAlign',
      //     suppressMenu: true,
      //     checkboxSelection: false,
      //     headerCheckboxSelection: false,
      //     headerCheckboxSelectionFilteredOnly: true,
      //     cellRenderer:this.cellRenderer,
      //     rowDrag: true
      //   },
      //   {
      //     headerName: '编号',
      //       field: 'number',
      //       resizable: true,
      //       cellStyle: { 'text-align':'left','white-space': 'normal' },
      //       sortable: true,
      //       width:70,
      //       filter: false,
      //       editable: false,
      //       cellRenderer: this.cellRenderer
      //   },
      //   {
      //     headerName: '类别',
      //     field: 'goodClass',
      //     resizable: true,
      //     cellStyle: { 'text-align':'left','white-space': 'normal' },
      //     sortable: true,
      //     width:120,
      //     filter: false,
      //     editable: true,
      //     cellRenderer: this.cellRenderer,
      //   },
      //   { headerName: '商品类似群组',
      //     field:'similarGroup',
      //     filter: false,
      //     resizable: true,
      //     cellStyle: { 'text-align': 'left','white-space': 'normal' },
      //     editable: true,
      //     cellRenderer: this.cellRenderer,
      //   },
      //   { headerName: '商品代码',
      //     field:'goodCode',
      //     cellStyle: { 'text-align': 'left','white-space': 'normal' },
      //     filter: false,
      //     resizable: true,
      //     editable: true,
      //     cellRenderer: this.cellRenderer,
      //   },
      //   { headerName: '商品中文名称',
      //     field:'goodName',
      //     cellStyle: { 'text-align': 'left','white-space': 'normal' },
      //     filter: false,
      //     editable: true,
      //     resizable: true,
      //     cellRenderer: this.cellRenderer,
      //   },
      //   { headerName: '商品英文名称',
      //     field:'goodEnName',
      //     cellStyle: { 'text-align': 'left','white-space': 'normal' },
      //     filter: false,
      //     editable: true,
      //     resizable: true,
      //     cellRenderer: this.cellRenderer,
      //   },
      //   { headerName: '商品日文名称',
      //     field:'goodJpName',
      //     cellStyle: { 'text-align': 'left','white-space': 'normal' },
      //     filter: false,
      //     editable: true,
      //     resizable: true,
      //     cellRenderer: this.cellRenderer,
      //   }
      // ]
      // this.columnDefs = preferenceList
    },
    getContextMenuItems(params){
      return this.type === 'view' ? [
        {
          name:'复制',
          action: () =>{
            this.$copyText(params.value).then(
              res => {
              })
          }}
      ] : [ {name:'复制',
        action: () =>{
          this.$copyText(params.value).then(
            res => {
            })
        }},
        {name:'插入',
          action: () =>{
            this.addfwf('upInsert',this.pageGoodsw.indexOf(params.node.data),params.node.data)
          }
        },
        // {name:'向下插入',
        //   action: () =>{
        //     this.addfwf('downInsert',this.pageGoodsw.indexOf(params.node.data))
        //   }
        // },
        {name:'删除',
          action:()=>{
            this.pageGoodsw.splice(this.pageGoodsw.indexOf(params.node.data),1)
            this.goodsListData.splice(this.goodsListData.indexOf(params.node.data),1)
            this.$emit("delgood", [params.node.data]);
          }
        }]
    },
    exportExcel(){
      // this['gridApi'].stopEditing(false)
      this.stopEditing()
      if (['内-外', '外-外'].includes(this.appFromto)) {
        this.goodsListData.filter(item => item.version == this.version).forEach((item,index)=>item.sid=index+1)
        this.$commonUtils.ExportExcel(this.columnDefs.filter(item => ['goodClass', 'goodName', 'goodEnName'].includes(item.field)).map(item => ({key: item.field, title: item.headerName.replace('名称', '')})), this.goodsListData.filter(item => item.version == this.version), '商品服务项目.xlsx')
      } else {
        this.goodsListData.forEach((item,index)=>item.sid=index+1)
        this.$commonUtils.ExportExcel(this.columnDefs.map(item => ({key: item.field, title: item.headerName})), this.goodsListData, '商品服务项目.xlsx')
      }
    },
    // sortNo(){
      // for(var i=0;i<this.goodsListData.length;i++){
      //   this.$set(this.goodsListData[i],'no',i)
      // }
      // this.goodsListData.forEach((item,index)=>{
      //   item.no=index
      // })
    // },
    addfwf(type,index,nodeData) {
      let data={
        no:this.goodsListData.indexOf(nodeData)
      }
      if(type=='upInsert'){
        this.pageGoodsw.splice(index,0,data)
        this.goodsListData.splice(this.goodsListData.indexOf(nodeData),0,data)
      }else if(type=='downInsert') {
        this.pageGoodsw.splice(index+1,0,data)
      }else {
        this.pageGoodsw.push(data);
      }
      // this.$nextTick(()=>{
      //   this.sortNo()
      // })

    },
    edit(row){
      if(this.curRow){
        this.$message.error('请先点击保存');
        return
      }
      this.curRow=JSON.parse(JSON.stringify(row))
      this.$set(row,'aditbool',true)
    },
    recall(row){
      for (var key in this.curRow){
        row[key] = this.curRow[key]
      }
      this.$set(row,'aditbool',false)
      this.curRow=null
    },
    save(row){
      this.$set(row,'aditbool',false)
      this.curRow=null
    },
    cellRenderer(params){
      // if(params.colDef.field=='userid'){
      //   return params.data.useridString
      // }
      // if(params.colDef.field=='roleid'){
      //   return params.data.roleidString
      // }
      //
      // if(params.colDef.field=='description'){
      //   return  this.getSpecialInfo(params.value)
      // }
      if(params.colDef.field == 'sid'){
        return params.rowIndex+1// params.data.no//params.rowIndex+1
      }
      return `<span title="${params.value}">${params.value?params.value:''}</span>`
    },
    queryList(paramter,row) {
      queryListByUrl({ paramter }).then(res => {
        if(res.data.length){
          if(res.data[0].flag){
            for (var key in res.data[0]){
              this.$set(row,key,res.data[0][key])
              // row[key] = res.data[0][key]
            }
          }else {
            for (var key in row){
              if(!['goodName','aditbool','version', 'number', 'caseId', 'cateId'].includes(key)){
                row[key] = null
              }
            }
          }
        }
        this['gridApiG'].refreshCells()
        this['gridApiG'].resetRowHeights();
      });
    },
    queryCaseGory(caseId){
      this.supplementCorrectionState=!this.supplementCorrectionState
      if(this.supplementCorrectionFlag){
        return
      }
      queryCaseGory({caseId}).then(res=>{
        this.supplementCorrectionFlag=true
        this.supplementCorrection.total=res.total
        this.supplementCorrectionList=res.data
        this.getSupplementCorrectionList(this.supplementCorrectionList)
      })
    },
    supplementRowClassName({row, rowIndex}) {
      if (row.operate === '删除') {
        return 'deleteChange';
      } else if (row.operate === '修改') {
        return 'modifyChange';
      }else if(row.operate === '新增'){
        return 'addChange'
      }
      return 'nothingChange';
    },
    getFirstSheet(data){
      let str =  JSON.stringify(data).replace(/(商品)?类别/g,'goodClass').replace(/商品中文(名称)?/g,'goodName').replace(/商品英文(名称)?/g,'goodEnName')
   let list=   JSON.parse(str)
      this.goods =[...this.goods,...list]
    },
    getUploadFile(e) {
      let formData = new FormData()
      for (let item of e.target.files) {
        formData.append("upfile", item)
      }
      formData.append("tokenID", this.$store.getters.token)
      importExcel(formData).then(res => {
        if (res.messageType == 200) {
          this.$message.warning(res.message)
        }
        const uniqMap = new Map();
        this.goods = [...this.goods, ...(res.data && res.data.filter(
          item => !uniqMap.has(item.goodName + item.goodEnName + item.goodJpName + (item.version || '')) && uniqMap.set(item.goodName + item.goodEnName + item.goodJpName + (item.version || ''), 1)
        ) || [])]
      })
    },
    loadGoodNode (node, resolve) {
      if (node.level === 0) {
        return resolve(this.goodsData);
      }
      if (node.level === 1) {
        GSQQueryClassUrl({ Class: node.data.classcode }).then(response => {
          return resolve(response.data.groupdetailgroup);
        });
      }
      if (node.level === 2) {
        queryDetaileGroupUrl({ Group: node.data.groupcode }).then(response => {
          return resolve(response.data.groupdetail);
        });
      }
    },

    exGoods () {
      if(this.goodsSelectPlan==3){
        if(this.pageGoods.length==0){
          this.$message.error('请校验信息')
          return
        }
      }
      let numberList = [...(this.goodsListData.filter(item => item.version == this.version).filter(item => item.number).map(item => item.number)), 0]
      this.$emit(
        "getGoods",
        this.goods.map(item => {
          if (item.goodClass&&typeof item=='string') {
            item.goodClass = item.goodClass.replace(/\b(0+)/gi, "");
          }
          item.version = this.version
          let number = Math.max(...numberList)
          item.number = item.number || number + 1
          numberList.push(item.number)
          return item;
        })
      );
      this.goodsSelectPlan = '3'
      this.nameCn = ''
      this.nameEn = ''
      this.goodCode = ''
      this.similarGroup = ''
      this.goodClass = ''
      this.dialogFormgoods = false;
    },
    goodsDialogqx() {
      this.dialogFormgoods = false;
      // this.goods = [];
    },
    addGoods () {
      if (this.searchGoodsData.length <= 0) {
        this.goods = [
          ...this.goods,
          ...this.$refs.goodstree.getCheckedNodes({
            leafOnly: true
          })
        ];
        this.$refs.goodstree.setCheckedKeys([]);
      } else {
        this.goods = [
          ...this.goods,
          ...this.$refs.goodstree1.getCheckedNodes({
            leafOnly: true
          })
        ];
        this.$refs.goodstree1.setCheckedKeys([]);
      }

      const res = new Map();
      this.goods = this.goods.filter(
        item => !res.has(item.goodName) && res.set(item.goodName, 1)
      );
    },
    goodsPlanselectChange (id) {
      console.log(id, "900-------009");
      queryGoodsUrl({ planId: id }).then(res => {
        this.goods = res.data;
      });
    },
    jyGoods () {
      if (this.jyText == "") {
        this.$message.error("请输入校验内容!");
      } else {
        // console.log(this.jyText.split("\n"));
        let list = this.jyText.split("\n").filter(Boolean)
        this.jyText = Array.from(new Set(this.jyText.split("\n"))).join("\n");
        Array.from(new Set(this.jyText.split("\n"))).forEach(item => {
          list.splice(list.findIndex(i => i == item), 1)
        })
        queryListByUrl({ paramter: this.jyText }).then(res => {
          this.goods = res.data
          if(list.length){
            this.$alert(`商品名称"${[...new Set(list)]}"有重复，已删除`,
            "提示",
              {
                confirmButtonText: "关闭",
                type: "warning"
              }
            )
          }
        });
      }
    },
    tableRowClassName ({ row, rowIndex }) {
      if (row.flag === 0) {
        return "warning-row";
      }
      return "";
    },
    delgood (item) {
      const index = this.goods.indexOf(item);
      this.goods.splice(index, 1);
    },
    delgoodw () {
      // if( this.multipleSelection.filter(item=>item.aditbool).length){
      //   this.curRow = null
      // }
      this.multipleSelection=this.getSelectedRows()
      this.$emit("delgood", this.multipleSelection);
      this.goodsDelBool = false;
    },
    getSelectedRows() {
      const selectedNodes = this['gridApiG'].getSelectedNodes();
      const selectedData = selectedNodes.map(node => node.data);
      return selectedData
    },
    getgoodsList (goods) {
      this.goodslistPageData.total = goods.length;

      var offset =
        (this.goodslistPageData.pageNo - 1) * this.goodslistPageData.pageSize;
      this.pageGoods =
        offset + this.goodslistPageData.pageSize >= goods.length
          ? goods.slice(offset, goods.length)
          : goods.slice(offset, offset + this.goodslistPageData.pageSize);
    },
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    getgoodsListw (goods = [], flag) {
      if (['内-外', '外-外'].includes(this.appFromto)) {
        goods = goods.filter(item => item.version == this.version)
        !flag && this.$emit('changeGoodClass', this.version)
      }
      this.goodslistPageDataw.total = goods.length;
      var offset =
        (this.goodslistPageDataw.pageNo - 1) * this.goodslistPageDataw.pageSize;
      this.pageGoodsw =
        offset + this.goodslistPageDataw.pageSize >= goods.length
          ? goods.slice(offset, goods.length)
          : goods.slice(offset, offset + this.goodslistPageDataw.pageSize);
    },
    getSupplementCorrectionList(goods){
      var offset =
        (this.supplementCorrection.pageNo - 1) * this.supplementCorrection.pageSize;
      this.curSupplementCorrectionList =
        offset + this.supplementCorrection.pageSize >= goods.length
          ? goods.slice(offset, goods.length)
          : goods.slice(offset, offset + this.supplementCorrection.pageSize);
    },
    searchGoods () {
      if (this.filterText) {
        queryByNameUrl({ name: this.filterText }).then(res => {
          this.searchGoodsData = res.data.map(item => {
            if (item.goodgroups) {
              item.chaild = item.goodgroups;
              if (item.goodgroups) {
                item.goodgroups.map(ite => {
                  if (ite.gooddetails) {
                    ite.chaild = ite.gooddetails;
                  }
                  return ite;
                });
              }
              return item;
            }
          });
          console.log(this.searchGoodsData);
          this.treeLazy = false;
        });
      }
    },

    delPlan (id) {
      deleteGoodsPlanUrl({ planId: id }).then(res => {
        this.getgoodspian();
      });
    },
    getgoodspian () {
      queryGoodsPlanUrl({ appId: this.appId })
        .then(response => {
          this.selectData.goodsPlanselect = response.data;
          if (!this.selectData.goodsPlanselect) {
            this.goodsPlan = "";
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    goodsDialogShow () {
      this.goods = [];
      this.zngoodb = "";
      this.zngood = "";
      this.goodsPlan = "";
      // if (!this.goodsData.length) {
      //   GSQQueryFirstClassUrl().then(response => {
      //     this.goodsData = response.data;
      //   });
      // }
    },
    goodsDialogqx () {
      this.dialogFormgoods = false;
      // this.goods = [];
    },

    siveGoodsPlan () {
      this.innerVisible = true;
    },
    siveGoodsPlanBtn () {
      if (!this.appId) {
        this.$message.error("请选择申请人");
      }
      if (!this.planName) {
        this.$message.error("请选择填写方案名称");
      }
      if (!this.goods) {
        this.$message.error("请选择商品");
      }
      addGoodsPlanUrl({
        appId: this.appId,
        planName: this.planName,
        goods: this.goods
      }).then(res => {
        this.$message.success("保存成功");
        this.getgoodspian();
        this.innerVisible = false;
      });
    },
    getGoodsBycaseNumber () {
      if (!this.goodsCaseNumber) {
        this.$message.error("请输入案卷号");
      } else {
        queryGoodsByAgentNumUrl({ agentNum: this.goodsCaseNumber }).then(
          res => {
            this.goods = res.data;
            this.$message.success("导入成功");
          }
        );
      }
    },
    goodSearch () {
      var str= this.searchval.replace(/；/g,';')
      var arr = str.split(';').filter(item=>!!item)
      this.getgoodsListw(
        this.searchdata.filter(data =>!this.searchval|| arr.some(item=>data.goodName && data.goodName.includes(item) || data.goodEnName && data.goodEnName.includes(item)))
      );
    },
    duplicateQuery(){
      // this['gridApi'].stopEditing(false)
      this.stopEditing()
      let data
      if (['内-外', '外-外'].includes(this.appFromto)) {
        data = this.goodsListData.filter(item => item.version == this.version).reduce((pre,next)=>{
          let goodName=this.$commonUtils.process(next.goodName)
          if(!pre.allGoodName.includes(goodName)){
            pre.allGoodName.push(goodName)
          } else {
            pre.indexList.push(this.goodsListData.findIndex(item=> this.$commonUtils.process(item.goodName)==goodName));
            pre.indexList.push(pre.i);
          }
          pre.i++
          return pre
        },{allGoodName:[],indexList:[],i:0})
      } else {
        data = this.goodsListData.reduce((pre,next)=>{
          let goodName=this.$commonUtils.process(next.goodName)
          if(!pre.allGoodName.includes(goodName)){
            pre.allGoodName.push(goodName)
          } else {
            pre.indexList.push(this.goodsListData.findIndex(item=> this.$commonUtils.process(item.goodName)==goodName));
            pre.indexList.push(pre.i);
          }
          pre.i++
          return pre
        },{allGoodName:[],indexList:[],i:0})
      }
     let list= [...new Set(data.indexList)].map(item=>item+1)
      if(list.length){
        this.$message.error(list.join('、')+'条重复')
      } else {
        this.$message.success('没有重复');
      }


    },
    zngoodChange (value) {
      this.selectData.goodsznselect = value;
      console.log(value);
    },
    zngoodChangeb (id) {
      GSQCategoryUrl({ grid: id }).then(res => {
        this.goods = res.data;
      });
    },
    planselectchange (val) {
      this.goods = [];
      if (val == "0") {
        if (this.appId) {
          this.getgoodspian();
        } else {
          this.$message.error("商品方案需要先选择申请人!");
        }
      }
      if (val == "1") {
        if (!this.selectData.goodszn.length) {
          GSQAllcategoryUrl({ lang: "cn" }).then(res => {
            this.selectData.goodszn = res.data;
          });
        }
      }
      if (val == "2") {
      }
    }
  },
  created () {
    this.getcolumnDefs();
    this.searchdata = this.goodsListData;
    if (['内-外', '外-外'].includes(this.appFromto) && this.trademarkCaseCategoryModifyList.length) {
      this.version = this.trademarkCaseCategoryModifyList[0].goodVersion
      this.modifyUserName = this.trademarkCaseCategoryModifyList[0].modifyUserName
      this.modifyDate = this.trademarkCaseCategoryModifyList[0].modifyDate
    }
    if (['内-外', '外-外'].includes(this.appFromto)) {
      this.version = this.version || 2096
    }
    this.getgoodsListw(Array.isArray(this.goodsListData) ? this.goodsListData : [], true); // 第一次不需要操作changeGoodClass
  },
  beforeUpdate () { },
  mounted () { }
};
</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;
  padding: 10px 2px;
  border: 1px solid #d7d7d7;
  margin: 15px 20px;
  min-height: 800px;

  .step-div {
    padding: 20px 65px;
  }

  /deep/ .el-tabs__header {
    margin-bottom: 2px;
  }

  /deep/ .el-collapse-item__header {
    display: block;
    text-align: center;
    background: #f5f5f5;
    height: 35px;
    line-height: 35px;
  }

  /deep/ .el-collapse-item__content {
    padding: 0px;
  }

  .fg-div {
    height: 20px;
    background: #e4e4e4;
  }

  .tilteSpan {
    font-size: 18px;
    padding: 15px 0px;
    color: #7199d5;

    span {
      display: block;
    }
  }

  /deep/ .el-step {
    cursor: pointer;
  }
}

/deep/ .form-border {
  .el-form-item__error {
    position: relative !important;
    top: 0;

  }

  .el-row {
    margin: 0px;
  }

  .postInfo-container-item {
    width: 100%;
  }

  .el-form-item__label {
    background-color: #f9f9f9;
    width: 36.7%;
    text-align: right;
  }

  .el-form-item {
    border-right: 1px solid #d7d7d7;
    margin: 0px !important;
  }

  .el-row {
    border-bottom: 1px solid #d7d7d7;
  }

  .el-input,
  .el-select {
    width: 77%;
  }

  .el-form-item__content {
    text-align: left;
    // height: 30px;
  }

  .fullRow {
    .el-form-item__label {
      width: 15%;
    }

    .el-input,
    .el-select {
      width: 30%;
    }
  }

  .el-input__inner {
    // border: none;
  }

  .el-select .el-input {
    width: 100%;
  }

  .postInfo-container-item {
    display: flex;
    width: 100%;

    .el-form-item__content {
      text-align: left;
      display: inline-table;
      width: 70%;
      min-width: 70%;
      padding: 5px 15px;
    }

    .el-form-item__label {
      line-height: 43px;
      border-right: 1px solid #d7d7d7;
    }
  }

  border-top: 1px solid #d7d7d7;
  border-left: 1px solid #d7d7d7;
  // border-bottom: 1px solid #d7d7d7;
}

/deep/ .el-table__header tr,
/deep/ .el-table__header th {
  padding: 0;
  height: 30px;
  background: #f5f5f5;
}

/deep/ .el-table__body tr,
/deep/ .el-table__body td {
  padding: 0;
  height: 40px;
}

/deep/ .el-step {
  cursor: pointer;
}

.upload-btn {
  display: inline-block;
}

/*/deep/ .el-table /deep/ .warning-row {*/
/*  background: #dd7a7a;*/
/*  color: white;*/
/*}*/
/deep/ .el-table {
    /*max-height: 500px;*/
    /*overflow: auto;*/
    .warning-row {
      background: #dd7a7a;
      color: white;
    }
  }

.redClass {
  color: #dd7a7a;
}

.greenClass {
  color: rgb(49, 165, 49);
}

.tmCmsearch {
  /deep/ .el-select .el-input {
    width: 130px;
  }

  /deep/ .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
}
.table-dl-row {
  /deep/ thead,
  /deep/ th,
  /deep/ .el-table__header-wrapper,
  /deep/ .el-table__header,
  /deep/ tr,
  /deep/ td,
  /deep/ .el-select,
  /deep/ .el-input,
  /deep/ .el-input__inner {
    height: 35px;
    line-height: 35px;
    // padding: 0px;
  }

  /deep/ td {
    background-color: #ffffff !important;
  }

  /deep/ .el-input__inner,
  /deep/ .el-select,
  /deep/ .el-input {
    width: 100% !important;
  }
}
.line_m{
  text-decoration: line-through;
}
/deep/ .supplementTable{
  .deleteChange{
    background:#ffffee !important;
    color:#c1c1c1;
    font-weight: bold;
  }
  .modifyChange{
    background:#ffffee  !important;
    color:#C46A16;
  }
  .addChange{
    background:#ffffee  !important;
    /*color:#C46A16;*/
  }
  .nothingChange{
    background:#E3EAE9 !important;
    color:#333;
  }
}
.ag-theme-balham{
  /deep/ .el-input,
  /deep/ .el-select {
    width: 100%;
    line-height: 28px;
  }
  /deep/ .el-textarea{
    height: 100%;
    textarea{
      height: 100%;
    }
  }
  /deep/ .el-input__inner{
    padding: 0
  }
  /deep/ .el-input__prefix{
    display: none;
  }
  /deep/ .ag-cell-auto-height{
    height: 100%!important;
    word-wrap: break-word;
    word-break: break-word;
  }
  /deep/ .ag-cell-inline-editing{
    background: #fff;
    color: #333;
  }
} .abow_dialog {
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
  .compareDialog {
    > > > .el-dialog {
      /*height: 90vh !important;*/

      .el-dialog__body {
        padding-top: 0;
      }
    }
  }
>>>.el-form {
  .first-row {
    display: flex;
    .el-col {
      display: flex;
      /*height: 42px;*/
      .el-form-item {
        flex: 1;
        .el-form-item__content {
          height: 100%;
          padding: 5px 15px;
        }
        .el-form-item__label {
          /*line-height: 35px;*/
          height: 100%;
          border-right: 1px solid #d7d7d7;
          /*background-color: #f9f9f9;*/
        }
        .el-input, .el-select {
          width: 80%;
        }
      }
    }
  }
}
</style>

