<template>
  <div>
    <template v-if="type == 2">
      <div class="content">
        <el-table
          :data="lendData.recordArray"
          highlight-current-row
          :ref="statusMap[type]"
          @row-click="handleSelect"
          style="width: 100%;max-height: 260px;overflow-y: auto">
          <el-table-column
            prop="barcode"
            label="条码号">
            <template slot-scope="scope">
              <span v-if="scope.row.samId">{{scope.row.barcode}}</span>
              <el-input v-else v-model="scope.row.barcode" size="small" placeholder="条码号" @change="changeBarCode(scope.row.barcode,scope.$index)"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="sampleName"
            label="样品名称">
            <template slot-scope="scope">
              <span v-if="scope.row.samId">{{scope.row.sampleName}}</span>
              <el-input v-else v-model="scope.row.sampleName" size="small" placeholder="样品名称"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="number"
            label="借出数量">
            <template slot-scope="scope">
              <el-input type="number" v-model="scope.row.number" size="small" :oninput="handleInput(scope.row.number,scope.row.max,scope.$index)" placeholder="借出数量"></el-input>
            </template>
          </el-table-column>
<!--          <el-table-column-->
<!--            prop="recordPosition"-->
<!--            label="位置">-->
<!--            <template slot-scope="scope">-->
<!--              <el-input v-model="scope.row.recordPosition" size="small" placeholder="借出位置"></el-input>-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="deleteData(scope.$index)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="add-custom" @click="addData">
          <i class="el-icon-plus custom-icon"></i>
        </div>
        <el-form class="form-container" label-width="120px">
          <el-row class="first-row">
            <el-form-item label="备注:" class="postInfo-container-item">
              <el-input type="textarea" :rows="2" v-model="lendData.remarks"
                        placeholder="请填写备注"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="借出人:" class="postInfo-container-item">
                <el-select v-model="lendData.operator" filterable clearable reserve-keyword default-first-option>
                  <el-option
                    v-for="item in userList"
                    :key="item.userId"
                    :label="item.fullname"
                    :value="item.fullname"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="借出日期:" class="postInfo-container-item">
                <el-date-picker
                  v-model="lendData.recordDate"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="fl-ac-jc" style="padding: 20px 0">
        <el-button size="small" @click="closeDialog(false)">取 消</el-button>
        <el-button size="small" type="primary" @click="submit('lendData')">借 出</el-button>
      </div>
    </template>
    <template v-if="type == 3">
      <div class="content">
        <el-table
          :data="mailData.recordArray"
          highlight-current-row
          :ref="statusMap[type]"
          @row-click="handleSelect"
          style="width: 100%;max-height: 260px;overflow-y: auto">
          <el-table-column
            prop="barcode"
            label="条码号">
            <template slot-scope="scope">
              <span v-if="scope.row.samId">{{scope.row.barcode}}</span>
              <el-input v-else v-model="scope.row.barcode" size="small" placeholder="条码号" @change="changeBarCode(scope.row.barcode,scope.$index)"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="sampleName"
            label="样品名称">
            <template slot-scope="scope">
              <span v-if="scope.row.samId">{{scope.row.sampleName}}</span>
              <el-input v-else v-model="scope.row.sampleName" size="small" placeholder="样品名称"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="number"
            label="寄出数量">
            <template slot-scope="scope">
              <el-input type="number"  v-model="scope.row.number" size="small" :oninput="handleInput(scope.row.number,scope.row.max,scope.$index)"  placeholder="寄出数量"></el-input>
            </template>
          </el-table-column>
<!--          <el-table-column-->
<!--            prop="recordPosition"-->
<!--            label="位置">-->
<!--            <template slot-scope="scope">-->
<!--              <el-input v-model="scope.row.recordPosition" size="small" placeholder="借出位置"></el-input>-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column
            prop="expresNo"
            label="快递单号">
            <template slot-scope="scope">
              <el-input v-model="scope.row.expresNo" size="small" placeholder="快递单号"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="deleteData(scope.$index)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="add-custom" @click="addData">
          <i class="el-icon-plus custom-icon"></i>
        </div>
        <el-form class="form-container" label-width="120px">
          <el-row class="first-row">
            <el-form-item label="备注:" class="postInfo-container-item">
              <el-input type="textarea" :rows="2" v-model="mailData.remarks"
                        placeholder="请填写备注"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="寄出人:" class="postInfo-container-item">
                <el-select v-model="mailData.operator" filterable clearable reserve-keyword default-first-option>
                  <el-option
                    v-for="item in userList"
                    :key="item.userId"
                    :label="item.fullname"
                    :value="item.fullname"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="寄出日期:" class="postInfo-container-item">
                <el-date-picker
                  v-model="mailData.recordDate"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="邮寄地址:" class="postInfo-container-item">
              <el-input v-model="mailData.expressAddr" placeholder="请填写邮寄地址"></el-input>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      <div class="fl-ac-jc" style="padding: 20px 0">
        <el-button size="small" @click="closeDialog(false)">取 消</el-button>
        <el-button size="small" type="primary" @click="submit('mailData')">寄 出</el-button>
      </div>
    </template>
    <template v-if="type == 1">
      <div class="content">
        <el-table
          :data="returnData.recordArray"
          highlight-current-row
          :ref="statusMap[type]"
          @row-click="handleSelect"
          height="265">
          <el-table-column
            prop="barcode"
            label="条码号">
            <template slot-scope="scope">
              <span v-if="scope.row.samId">{{scope.row.barcode}}</span>
              <el-input v-else v-model="scope.row.barcode" size="small" placeholder="条码号" @change="changeBarCode(scope.row.barcode,scope.$index)"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="sampleName"
            label="样品名称">
            <template slot-scope="scope">
              <span v-if="scope.row.samId">{{scope.row.sampleName}}</span>
              <el-input v-else v-model="scope.row.sampleName" size="small" placeholder="样品名称"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="returnNumber"
            label="归还数量">
            <template slot-scope="scope">
              <el-input type="number" v-model="scope.row.returnNumber" size="small" :oninput="handleInput(scope.row.returnNumber,scope.row.max,scope.$index,'returnNumber')" placeholder="归还数量"></el-input>
            </template>
          </el-table-column>
<!--          <el-table-column-->
<!--            prop="recordPosition"-->
<!--            label="位置">-->
<!--            <template slot-scope="scope">-->
<!--              <span v-if="scope.row.recordPosition">{{scope.row.recordPosition}}</span>-->
<!--              <el-input v-else v-model="scope.row.recordPosition" size="small" placeholder="归还位置"></el-input>-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column
            prop="operator"
            label="归还人">
            <template slot-scope="scope">
              <span v-if="scope.row.samId">{{scope.row.operator}}</span>
              <el-select v-else v-model="scope.row.operator" size="small" filterable clearable reserve-keyword default-first-option>
                <el-option
                  v-for="item in userList"
                  :key="item.userId"
                  :label="item.fullname"
                  :value="item.fullname"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="returnDate"
            label="归还日期">
            <template slot-scope="scope">
              <el-date-picker
                size="small"
                v-model="scope.row.returnDate"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="deleteData(scope.$index)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="add-custom" @click="addData">
          <i class="el-icon-plus custom-icon"></i>
        </div>
      </div>
      <div class="fl-ac-jc" style="padding: 20px 0">
        <el-button size="small" @click="closeDialog(false)">取 消</el-button>
        <el-button size="small" type="primary" @click="submit('returnData')">归 还</el-button>
      </div>
    </template>
    <template v-if="type == 6">
      <div class="content">
        <el-table
          :data="turnData.recordArray"
          highlight-current-row
          :ref="statusMap[type]"
          @row-click="handleSelect"
          height="265">
          <el-table-column
            prop="barcode"
            label="条码号">
            <template slot-scope="scope">
              <span v-if="scope.row.samId">{{scope.row.barcode}}</span>
              <el-input v-else v-model="scope.row.barcode" size="small" placeholder="条码号" @change="changeBarCode(scope.row.barcode,scope.$index)"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="样品名称">
            <template slot-scope="scope">
              <span v-if="scope.row.samId">{{scope.row.sampleName}}</span>
              <el-input v-else v-model="scope.row.name" size="small" placeholder="样品名称"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="returnNumber"
            label="转借数量">
            <template slot-scope="scope">
              <el-input  type="number" v-model="scope.row.returnNumber" size="small" :oninput="handleInput(scope.row.returnNumber,scope.row.max,scope.$index,'returnNumber')" placeholder="转借数量"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="returnUserId"
            label="归还人">
            <template slot-scope="scope">
              <span v-if="scope.row.samId">{{scope.row.operator}}</span>
              <el-select v-else v-model="scope.row.returnUserId" filterable clearable reserve-keyword default-first-option>
                <el-option
                  v-for="item in userList"
                  :key="item.userId"
                  :label="item.fullname"
                  :value="item.userId"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="deleteData(scope.$index)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="add-custom" @click="addData">
          <i class="el-icon-plus custom-icon"></i>
        </div>
        <el-form class="form-container" label-width="120px">
          <el-row class="first-row">
            <el-form-item label="备注:" class="postInfo-container-item">
              <el-input type="textarea" :rows="2" v-model="turnData.remarks"
                        placeholder="请填写备注"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="转借人:" class="postInfo-container-item">
                <el-select v-model="turnData.operator" filterable clearable reserve-keyword default-first-option>
                  <el-option
                    v-for="item in userList"
                    :key="item.userId"
                    :label="item.fullname"
                    :value="item.fullname"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="转借日期:" class="postInfo-container-item">
                <el-date-picker
                  v-model="turnData.returnDate"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="fl-ac-jc" style="padding: 20px 0">
        <el-button size="small" @click="closeDialog(false)">取 消</el-button>
        <el-button size="small" type="primary" @click="submit('lendData')">转 借</el-button>
      </div>
    </template>
    <template v-if="type == 5">
      <div class="content">
        <el-table
          :data="offSiteData.recordArray"
          highlight-current-row
          :ref="statusMap[type]"
          @row-click="handleSelect"
          style="width: 100%;max-height: 260px;overflow-y: auto">
          <el-table-column
            prop="barcode"
            label="条码号">
            <template slot-scope="scope">
              <span v-if="scope.row.samId">{{scope.row.barcode}}</span>
              <el-input v-else v-model="scope.row.barcode" size="small" placeholder="条码号" @change="changeBarCode(scope.row.barcode,scope.$index)"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="sampleName"
            label="样品名称">
            <template slot-scope="scope">
              <span v-if="scope.row.samId">{{scope.row.sampleName}}</span>
              <el-input v-else v-model="scope.row.sampleName" size="small" placeholder="样品名称"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="number"
            label="异地保存数量">
            <template slot-scope="scope">
              <el-input type="number" v-model="scope.row.number" size="small" :oninput="handleInput(scope.row.number,scope.row.max,scope.$index)" placeholder="异地保存数量"></el-input>
            </template>
          </el-table-column>
<!--          <el-table-column-->
<!--            prop="recordPosition"-->
<!--            label="位置">-->
<!--            <template slot-scope="scope">-->
<!--              <el-input v-model="scope.row.recordPosition" size="small" placeholder="位置"></el-input>-->
<!--            </template>-->
<!--          </el-table-column>-->
          <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="deleteData(scope.$index)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="add-custom" @click="addData">
          <i class="el-icon-plus custom-icon"></i>
        </div>
        <el-form class="form-container" label-width="120px">
          <el-row class="first-row">
            <el-form-item label="备注:" class="postInfo-container-item">
              <el-input type="textarea" :rows="2" v-model="offSiteData.remarks"
                        placeholder="请填写备注"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="异地保存日期:" class="postInfo-container-item">
                <el-date-picker
                  v-model="offSiteData.recordDate"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="fl-ac-jc" style="padding: 20px 0">
        <el-button size="small" @click="closeDialog(false)">取 消</el-button>
        <el-button size="small" type="primary" @click="submit('offSiteData')">异地保存</el-button>
      </div>
    </template>
    <template v-if="type == 4">
      <div class="content">
        <el-table
          :data="destructData.recordArray"
          highlight-current-row
          :ref="statusMap[type]"
          @row-click="handleSelect"
          style="width: 100%;max-height: 260px;overflow-y: auto">
          <el-table-column
            prop="barcode"
            label="条码号">
            <template slot-scope="scope">
              <span v-if="scope.row.samId">{{scope.row.barcode}}</span>
              <el-input v-else v-model="scope.row.barcode" size="small" placeholder="条码号" @change="changeBarCode(scope.row.barcode,scope.$index)"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="sampleName"
            label="样品名称">
            <template slot-scope="scope">
              <span v-if="scope.row.samId">{{scope.row.sampleName}}</span>
              <el-input v-else v-model="scope.row.sampleName" size="small" placeholder="样品名称"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="number"
            label="销毁数量">
            <template slot-scope="scope">
              <el-input type="number" v-model="scope.row.number" size="small" :oninput="handleInput(scope.row.number,scope.row.max,scope.$index)" placeholder="销毁数量"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="deleteData(scope.$index)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="add-custom" @click="addData">
          <i class="el-icon-plus custom-icon"></i>
        </div>
        <el-form class="form-container" label-width="120px">
          <el-row class="first-row">
            <el-form-item label="备注:" class="postInfo-container-item">
              <el-input type="textarea" :rows="2" v-model="destructData.remarks"
                        placeholder="请填写备注"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="销毁人:" class="postInfo-container-item">
                <el-select v-model="destructUsers" @change="destructUsersChange" multiple filterable clearable reserve-keyword default-first-option>
                  <el-option
                    v-for="item in userList"
                    :key="item.userId"
                    :label="item.fullname"
                    :value="item.fullname"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="销毁日期:" class="postInfo-container-item">
                <el-date-picker
                  v-model="destructData.recordDate"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="fl-ac-jc" style="padding: 20px 0">
        <el-button size="small" @click="closeDialog(false)">取 消</el-button>
        <el-button size="small" type="primary" @click="submit('destructData')">销 毁</el-button>
      </div>
    </template>
  </div>
</template>

<script>
import { querySampleInfo, updateSampleStatus } from "@/api/material.js";
export default {
  name: 'sampleSetting',
  props: ['type','sampleList','recordArray'],
  data() {
    return {
      userList: [], // 用户列表
      lendData: {
        recordArray: [],
        remarks: '',
        operator: '',
        recordDate: this.$wUtil.getDate()
      },
      mailData: {
        recordArray: [],
        remarks: '',
        operator: '',
        expressAddr: '',
        recordDate: this.$wUtil.getDate()
      },
      returnData: {
        recordArray: []
      },
      turnData: {
        recordArray: [],
        operator: '',
        remarks: '',
        returnDate: this.$wUtil.getDate()
      },
      offSiteData: {
        recordArray: [],
        remarks: '',
        recordDate: this.$wUtil.getDate()
      },
      destructData: {
        recordArray: [],
        operator: '',
        remarks: '',
        recordDate: this.$wUtil.getDate()
      },
      statusMap: { 1: 'returnData', 2: 'lendData', 3: 'mailData', 5: 'offSiteData', 4: 'destructData', 6: 'turnData' },
      defaultData: {
        lendData: { samId: '', barcode: '', sampleName: '', number: '', recordPosition: '', recordType: 1 },
        mailData: { samId: '', barcode: '', sampleName: '', number: '', recordPosition: '', expresNo: '', recordType: 4},
        returnData: { samId: '', barcode: '', sampleName: '', number: '', returnNumber: '', recordPosition: '', operator: '', returnDate: '', recordType: ''},
        offSiteData: { samId: '', barcode: '', sampleName: '', number: '', recordPosition: '', recordType: 5},
        destructData: { samId: '', barcode: '', name: '', number: '', recordType: 6},
        turnData: { samId: '', barcode: '', name: '', number: '', returnNumber: '', returnUserId: '', recordType: 3}
      },
      destructUsers: [] // 销毁人
    }
  },
  created() {
    this.userList = this.$store.getters.userList
    this.init()
  },
  methods: {
    init() {
      if (this.type == 1 || this.type == 6){ // 归还操作
        this.sampleList.forEach(item => {
          item.recordArray && this.handleRecordArray(JSON.parse(JSON.stringify(item.recordArray)))
        })
      }else{
        this.sampleList.forEach(item => {
          var data = this.dataInitAssign(item)
          data && this[this.statusMap[this.type]].recordArray.push(data)
        })
      }
    },
    // 处理recordArray数据
    handleRecordArray(recordArray){
      recordArray.forEach(res => {
        // 借出归还和转借
        if(res.recordType == 1 && !res.returnDate){
          res.max = res.number
          res.returnNumber = res.returnNumber ? (res.number - res.returnNumber) : res.number
          if (this.type == 1){
            res.returnDate = this.$wUtil.getDate()
          }
          this[this.statusMap[this.type]].recordArray.push(res)
        }
      })
    },
    // 数据初始化赋值
    dataInitAssign(item) {
      var data = {
        samId: item.samId,
        barcode: item.barcode,
        sampleName: item.sampleName,
        number: item.quantity,
        max: item.quantity,
        recordType: this.defaultData[this.statusMap[this.type]].recordType
      }
      if (this.type === 1) {
        data.operator = ''
        data.returnDate = this.$wUtil.getDate()
      }
      if (this.type === 3) {
        data.expresNo = ''
      }
      return data
    },
    deleteData(index) {
      this[this.statusMap[this.type]].recordArray.splice(index,1)
    },
    // 添加列表填写项
    addData() {
      console.log('aq',this[this.statusMap[this.type]].recordArray)
      this[this.statusMap[this.type]].recordArray.push(JSON.parse(JSON.stringify(this.defaultData[this.statusMap[this.type]])))
    },
    // 处理录入条码号,获取样品详情赋值
    changeBarCode(barcode,index) {
      if (barcode){
        querySampleInfo({barcode: barcode}).then(res => {
          if (res.data) {
            if (this.type == 1 || this.type == 6){ // 归还、转借操作
              res.data.recordArray && this.handleRecordArray(res.data.recordArray)
              this[this.statusMap[this.type]].recordArray.splice(index,1)
            }else{
              var data = this.dataInitAssign(res.data)
              this.$set(this[this.statusMap[this.type]].recordArray, index, data)
            }
          } else {
            this.$message({message: '条码号关联样品不存在，请检查',type: 'warning'});
            this.$set(this[this.statusMap[this.type]].recordArray[index], 'samId', '')
            this.$refs[this.statusMap[this.type]].setCurrentRow(this[this.statusMap[this.type]].recordArray[index],true)
          }
        })
      }
    },
    // 销毁人员更改
    destructUsersChange(){
      this[this.statusMap[this.type]].operator = this.destructUsers.join(';')
    },
    closeDialog(search) {
      this.$emit('cancel')
    },
    handleSelect(row) {
      this.$refs[this.statusMap[this.type]].setCurrentRow()
    },
    // 限制借出数量
    handleInput(value, max, index, filed = 'number') {
      if (value > max) {
        this[this.statusMap[this.type]].recordArray[index][filed] = max
      } else if (value < 0) {
        this[this.statusMap[this.type]].recordArray[index][filed] = 0
      }
    },
    submit() {
      if (this[this.statusMap[this.type]].recordArray.length > 0){
        if (this[this.statusMap[this.type]].recordArray.findIndex(item => item.samId == '') !== -1){
          this.$message({message: '请检查条码号是否正确关联样品',type: 'warning'});
          this.$refs[this.statusMap[this.type]].setCurrentRow(this[this.statusMap[this.type]].recordArray.find(item => item.samId == ''),true)
          return
        }
        if (this[this.statusMap[this.type]].recordArray.findIndex(item => item.number == 0) !== -1){
          this.$message({message: '请检查借出数量是否为0',type: 'warning'});
          return
        }
        if (this[this.statusMap[this.type]].hasOwnProperty('operator')){
          if (!this[this.statusMap[this.type]].operator){
            this.$message({message: '请选择操作人',type: 'warning'});
            return
          }
        }
        console.log('数据',this[this.statusMap[this.type]])
        updateSampleStatus({
          status: this.type,
          ...this[this.statusMap[this.type]]
        }).then(res => {
          this.$message({
            type: 'success',
            message: res.message
          });
          this.$emit('cancel',this[this.statusMap[this.type]].recordArray.map(item => item.samId))
        })
      }else{
        this.$message({
          message: '请选择操作样品',
          type: 'warning'
        });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table{
  /deep/ th{
    padding: 6px 0;
    color: #555555;
    background: #FAFAFA;
  }
  /deep/ .el-table__body tr.current-row>td{
    background-color: #81bdff;
  }
}
.topBox {
  background-color: #F2F2F2;
  padding-left: 20px;
  display: flex;
  height: 40px;
  /*justify-content: center;*/
  align-items: center;

  .iconfont {
    margin-right: 10px;
  }
}

.content {
  border: 1px solid #D7D7D7;
  margin-top: 10px;
  padding: 5px;
}

.add-custom{
  height: 50px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  margin: 5px 0;
}

.custom-icon{
  font-size: 20px;
  color: #8c939d;
  width: 100%;
  height: 50px;
  line-height: 50px;
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
    text-align: right;
  }

  /deep/ .el-form-item {
    border-right: 1px solid #d7d7d7;
    margin: 0px !important;
  }

  .first-row {
    border-top: 1px solid #d7d7d7;
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
      flex: 1;
      padding: 5px 15px;
      margin-left: 0 !important;
    }

    /deep/ .el-form-item__label {
      flex-shrink: 0;
      /*line-height: 28px;*/
    }

    > > > .el-date-editor {
      width: 100%;
    }
  }
}
</style>
