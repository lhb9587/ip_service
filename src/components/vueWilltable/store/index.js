import {
  verifyDate,
  verifyMonth,
  verifySelect,
  verifyNumber
} from '../mixins/verify'

class TableStore {
  constructor() {
    this.states = {
      plType:'',
      scrollBarWidth: 10,
      tableBodyLeft: 0,
      tableBodyTop: 0,
      columns: [],
      data: [],
      showData: [],
      // dfshowData: [],
      initialData: null,
      changeData: [],
      dataStatusList: [],
      columnsStatusList: [],
      rowSelection: 'single',
      // 编辑器
      editor: {
        editorRange: {},
        editorXIndex: 0,
        editorYIndex: 0,
        curEditorCoverValue: '',
        editorShow: false,
        editorIsFixed: false,
        editing: false,
        editType: 'text',
        options: [],
        key: '',
        curEditorWidth: 80
      },

      // 自动填充
      autofill: {
        autofillXIndex: 0,
        autofillYIndex: 0,
        isAutofill: false,
        autofillYArr: []
      },

      // 选择区域
      selector: {
        isSelected: false,
        selectedXIndex: 0,
        selectedYIndex: null,
        selectedXArr: [],
        selectedYArr: []
      },
      filters: {},

      dropdown: {
        index: null,
        list: {},
        key: '',
        sort: ''
      },

      isMac: false,

      adjustLineLeft: 0,
      adjustLineShow: false,

      // 历史记录
      historyData: [],
      curHisory: 0,
      isOperation: false
    }
  }

  tableBodyScroll(el) {
    this.states.tableBodyLeft = el.scrollLeft
    this.states.tableBodyTop = el.scrollTop
  }

  // 判断是否是mac
  handleIsMac() {
    if (/macintosh|mac os x/i.test(navigator.userAgent)) {
      this.states.isMac = true
    }
  }

  // 编辑器
  getEditorContent(editContent) {
    const {
      states
    } = this
    states.showData[states.editor.editorYIndex][states.columns[states.editor.editorXIndex].key] = editContent;


  }
  mgetEditorContent(editContent,x,y) {
    const {
      states
    } = this
    states.showData[y][states.columns[x].key] = editContent;


  }

  resetEditor() {
    const {
      states
    } = this
    states.editor.editing = false
    // states.editor.editType = 'text'
  }

  // 自动填充
  handleAutofill() {
    const {
      states
    } = this
    states.autofill.isAutofill = true
    window.addEventListener('mouseup', this.autofillUp.bind(this))
  }

  autofillUp() {

    const {
      states
    } = this
    if (states.autofill.autofillYArr[1] > states.selector.selectedYArr[1]) {
      for (let i = 0; i <= states.autofill.autofillYArr[1] - states.autofill.autofillYArr[0]; i += 1) {
        for (let j = 0; j <= states.selector.selectedXArr[1] - states.selector.selectedXArr[0]; j += 1) {
          if (!states.columns[j + states.selector.selectedXArr[0]].disabled) {
            if (states.columns[j + states.selector.selectedXArr[0]].key == 'goods') {
              let item = states.showData[states.selector.selectedYArr[1]]//[states.columns[j + states.selector.selectedXArr[0]].key]
              let data= states.showData[i + states.autofill.autofillYArr[0]]
              if (['内-外', '外-外'].includes(item.appFromto)) { // 对外
                if (['内-外', '外-外'].includes(data.appFromto)) {
                  // 默认赋值
                } else {
                  // 继续下次循环
                  continue
                }
              } else {
                if (['内-外', '外-外'].includes(data.appFromto)) {
                  continue
                } else {

                }
              }
            }
            if (states.columns[j + states.selector.selectedXArr[0]].key == 'appFromto') {
              let item = states.showData[states.selector.selectedYArr[1]]
              let data= states.showData[i + states.autofill.autofillYArr[0]]
              if (['内-外', '外-外'].includes(item.appFromto)) { // 选中数据为对外
                if (['内-外', '外-外'].includes(data.appFromto)) {
                  // 默认赋值
                } else {
                  // 下拉赋值的申请方向为对内，此时改为对外，商品默认设置最初版本（客户提供版本 version: 2096）
                  let number = Math.max(...(data.goods && data.goods.filter(item => item.number).map(item => item.number) || []), 0)
                  data.goods && data.goods.forEach((good, index) => {
                    good.version = 2096
                    good.number = ++number
                  })
                }
              } else { // 选中数据为对内
                if (['内-外', '外-外'].includes(data.appFromto)) {  // 下拉赋值的申请方向为对外，需改为对内，商品需保留最新版本
                  data.goods = data.goods && data.goods.filter(item => item.version === (data.trademarkCaseCategoryModifyList && data.trademarkCaseCategoryModifyList.length && data.trademarkCaseCategoryModifyList[0].goodVersion || 2096)) || []
                }
              }
            }
            states.showData[i + states.autofill.autofillYArr[0]][states.columns[j + states.selector.selectedXArr[0]].key] = states.showData[states.selector.selectedYArr[1]][states.columns[j + states.selector.selectedXArr[0]].key]
            if (states.columns[j + states.selector.selectedXArr[0]].key=='appCnName') {
              let item =states.showData[states.selector.selectedYArr[1]]//[states.columns[j + states.selector.selectedXArr[0]].key]
              let data=states.showData[i + states.autofill.autofillYArr[0]]
              // states.showData[i + states.autofill.autofillYArr[0]].appCnAddr = item.applicantAddress;
              data.appId = item.appId;
              data.appEnName =
                item.appEnName;
              data.appCnName =
                item.appCnName;
              data.applicantType =
                item.applicantType;
              data.appGJdq = item.sendType;
              data.appCnAddr =
                item.applicantAddress;
              data.appEnAddr =
                item.appEnAddr;
              data.appCountryOrRegion =
                item.appCountryOrRegion;
              data.certCode = item.certCode;
              data.appCertificateNum =
                item.appCertificateNum;
              data.appCertificate =
                item.appCertificate;
            }
            if(['billNo','regCountry'].includes(states.columns[j + states.selector.selectedXArr[0]].key)){
              let item =states.showData[states.selector.selectedYArr[1]]//[states.columns[j + states.selector.selectedXArr[0]].key]
              let data=states.showData[i + states.autofill.autofillYArr[0]]
              data.billId = item.billId
              data.billNo = item.billNo
              data.regCountry = item.regCountry
            }
            if(['submitType','appCnName'].includes(states.columns[j + states.selector.selectedXArr[0]].key)){
              let item =states.showData[states.selector.selectedYArr[1]]//[states.columns[j + states.selector.selectedXArr[0]].key]
              let data=states.showData[i + states.autofill.autofillYArr[0]]
              // states.showData[i + states.autofill.autofillYArr[0]].appCnAddr = item.applicantAddress;
              // data.discount = item.discount;

              data.discount = item.discount;
            }
            if(states.editor.editType === 'date'){
              let item = states.showData[states.selector.selectedYArr[1]]
              let data = states.showData[i + states.autofill.autofillYArr[0]]
              if(!item[states.columns[j + states.selector.selectedXArr[0]].key]){
                data[states.columns[j + states.selector.selectedXArr[0]].key] = ''
                data[states.columns[j + states.selector.selectedXArr[0]].key + 'Str'] = ''
              }
            }
            if (states.columns[j + states.selector.selectedXArr[0]].key == 'materialTypeName') {
              let item = states.showData[states.selector.selectedYArr[1]]//[states.columns[j + states.selector.selectedXArr[0]].key]
              let data= states.showData[i + states.autofill.autofillYArr[0]]
              data.materialTypeName = item.materialTypeName
              data.docName = item.docName
            }
            if (states.columns[j + states.selector.selectedXArr[0]].key == 'foreignExchangeRate') {
              let item = states.showData[states.selector.selectedYArr[1]]
              let data= states.showData[i + states.autofill.autofillYArr[0]]
              // data.foreignExchangeRate = item.foreignExchangeRate
              data.payMoney = (data.abroadBillSum * data.foreignExchangeRate / 100).toFixed(2)
            }
            if (states.columns[j + states.selector.selectedXArr[0]].key == 'abroadCurId') {
              let item = states.showData[states.selector.selectedYArr[1]]//[states.columns[j + states.selector.selectedXArr[0]].key]
              let data= states.showData[i + states.autofill.autofillYArr[0]]
              data.abroadCurId = item.abroadCurId
              data.abroadExchangeRate = item.abroadExchangeRate
            }
            if (states.columns[j + states.selector.selectedXArr[0]].key == 'feetId') {
              let item = states.showData[states.selector.selectedYArr[1]]//[states.columns[j + states.selector.selectedXArr[0]].key]
              let data= states.showData[i + states.autofill.autofillYArr[0]]
              data.feeName1 = item.feeName1
              data.feeName2 = item.feeName2
              data.feeName3 = item.feeName3
            }
            if (states.columns[j + states.selector.selectedXArr[0]].key == 'agencyOffers') {
              let item = states.showData[states.selector.selectedYArr[1]]//[states.columns[j + states.selector.selectedXArr[0]].key]
              let data= states.showData[i + states.autofill.autofillYArr[0]]
              data.agencyOffers = JSON.parse(JSON.stringify(item.agencyOffers))
              data.agencyOffers.forEach(o => {
                o.caseId = data.caseId
                o.caseAgencyId = undefined
              })
            }
            if (states.columns[j + states.selector.selectedXArr[0]].key == 'ifShareTm') {
              let item = states.showData[states.selector.selectedYArr[1]]//[states.columns[j + states.selector.selectedXArr[0]].key]
              let data= states.showData[i + states.autofill.autofillYArr[0]]
              if (item.ifShareTm == '0') {
                data.joinApps = []
              }
            }
            // console.log(states.showData[i + states.autofill.autofillYArr[0]][states.columns[j + states.selector.selectedXArr[0]].key],states.columns[j + states.selector.selectedXArr[0]].key);
          }
        }
      }
      states.selector.selectedYArr.splice(1, 1, states.autofill.autofillYArr[1])
      const autofillYIndex = states.autofill.autofillYArr[1]
      states.autofill.autofillYIndex = autofillYIndex
    }
    if (states.autofill.autofillYArr[0] < states.selector.selectedYArr[0]) {
      for (let i = 0; i <= states.autofill.autofillYArr[1] - states.autofill.autofillYArr[0]; i += 1) {
        for (let j = 0; j <= states.selector.selectedXArr[1] - states.selector.selectedXArr[0]; j += 1) {
          if (!states.columns[j + states.selector.selectedXArr[0]].disabled) {
            if (states.columns[j + states.selector.selectedXArr[0]].key == 'goods') {
              let item = states.showData[states.selector.selectedYArr[0]]//[states.columns[j + states.selector.selectedXArr[0]].key]
              let data= states.showData[i + states.autofill.autofillYArr[0]]
              if (['内-外', '外-外'].includes(item.appFromto)) { // 对外
                if (['内-外', '外-外'].includes(data.appFromto)) {
                  // 默认赋值
                } else {
                  // 继续下次循环
                  continue
                }
              } else {
                if (['内-外', '外-外'].includes(data.appFromto)) {
                  continue
                } else {

                }
              }
            }
            if (states.columns[j + states.selector.selectedXArr[0]].key == 'appFromto') {
              let item = states.showData[states.selector.selectedYArr[0]]
              let data= states.showData[i + states.autofill.autofillYArr[0]]
              if (['内-外', '外-外'].includes(item.appFromto)) { // 选中数据为对外
                if (['内-外', '外-外'].includes(data.appFromto)) {
                  // 默认赋值
                } else {
                  // 下拉赋值的申请方向为对内，此时改为对外，商品默认设置最初版本（客户提供版本 version: 2096）
                  let number = Math.max(...(data.goods && data.goods.filter(item => item.number).map(item => item.number) || []), 0)
                  data.goods && data.goods.forEach((good, index) => {
                    good.version = 2096
                    good.number = ++number
                  })
                }
              } else { // 选中数据为对内
                if (['内-外', '外-外'].includes(data.appFromto)) {  // 下拉赋值的申请方向为对外，需改为对内，商品需保留最新版本 trademarkCaseCategoryModifyList[trademarkCaseCategoryModifyList.length - 1].goodVersion
                  data.goods = data.goods && data.goods.filter(good => good.version === data.trademarkCaseCategoryModifyList && data.trademarkCaseCategoryModifyList.length && data.trademarkCaseCategoryModifyList[0].goodVersion || 2096) || []
                }
              }
            }
            states.showData[i + states.autofill.autofillYArr[0]][states.columns[j + states.selector.selectedXArr[0]].key] = states.showData[states.selector.selectedYArr[0]][states.columns[j + states.selector.selectedXArr[0]].key]
            if (states.columns[j + states.selector.selectedXArr[0]].key=='appCnName') {
              let item = states.showData[states.selector.selectedYArr[0]]//[states.columns[j + states.selector.selectedXArr[0]].key]
              let data = states.showData[i + states.autofill.autofillYArr[0]]
              // states.showData[i + states.autofill.autofillYArr[0]].appCnAddr = item.applicantAddress;
              data.appId = item.appId;
              data.appEnName =
                item.appEnName;
              data.appCnName =
                item.appCnName;
              data.applicantType =
                item.applicantType;
              data.appGJdq = item.appGJdq;
              data.appCnAddr =
                item.appCnAddr;
              data.appEnAddr =
                item.appEnAddr;
              data.appCountryOrRegion =
                item.appCountryOrRegion;
              data.certCode = item.certCode;
              data.appCertificateNum =
                item.appCertificateNum;
              data.appCertificate =
                item.appCertificate;
            }
            if(['billNo','regCountry'].includes(states.columns[j + states.selector.selectedXArr[0]].key)){
              let item =states.showData[states.selector.selectedYArr[0]]//[states.columns[j + states.selector.selectedXArr[0]].key]
              let data=states.showData[i + states.autofill.autofillYArr[0]]
              data.billId = item.billId
              data.billNo = item.billNo
              data.regCountry = item.regCountry
            }
            if (['submitType','appCnName'].includes(states.columns[j + states.selector.selectedXArr[0]].key)) {
              let item =states.showData[states.selector.selectedYArr[0]]//[states.columns[j + states.selector.selectedXArr[0]].key]
              let data=states.showData[i + states.autofill.autofillYArr[0]]
              data.discount = item.discount;
            }
            if(states.editor.editType === 'date'){
              let item = states.showData[states.selector.selectedYArr[0]]
              let data = states.showData[i + states.autofill.autofillYArr[0]]
              if(!item[states.columns[j + states.selector.selectedXArr[0]].key]){
                data[states.columns[j + states.selector.selectedXArr[0]].key] = ''
                data[states.columns[j + states.selector.selectedXArr[0]].key + 'Str'] = ''
              }
            }
            if (states.columns[j + states.selector.selectedXArr[0]].key == 'materialTypeName') {
              let item = states.showData[states.selector.selectedYArr[0]]//[states.columns[j + states.selector.selectedXArr[0]].key]
              let data= states.showData[i + states.autofill.autofillYArr[0]]
              data.materialTypeName = item.materialTypeName
              data.docName = item.docName
            }
            if (states.columns[j + states.selector.selectedXArr[0]].key == 'foreignExchangeRate') {
              let item = states.showData[states.selector.selectedYArr[0]]
              let data= states.showData[i + states.autofill.autofillYArr[0]]
              // data.foreignExchangeRate = item.foreignExchangeRate
              data.payMoney = (data.abroadBillSum * data.foreignExchangeRate / 100).toFixed(2)
            }
            if (states.columns[j + states.selector.selectedXArr[0]].key == 'abroadCurId') {
              let item = states.showData[states.selector.selectedYArr[0]]//[states.columns[j + states.selector.selectedXArr[0]].key]
              let data= states.showData[i + states.autofill.autofillYArr[0]]
              data.abroadCurId = item.abroadCurId
              data.abroadExchangeRate = item.abroadExchangeRate
            }
            if (states.columns[j + states.selector.selectedXArr[0]].key == 'feetId') {
              let item = states.showData[states.selector.selectedYArr[0]]//[states.columns[j + states.selector.selectedXArr[0]].key]
              let data= states.showData[i + states.autofill.autofillYArr[0]]
              data.feeName1 = item.feeName1
              data.feeName2 = item.feeName2
              data.feeName3 = item.feeName3
            }
            if (states.columns[j + states.selector.selectedXArr[0]].key == 'agencyOffers') {
              let item = states.showData[states.selector.selectedYArr[0]]//[states.columns[j + states.selector.selectedXArr[0]].key]
              let data= states.showData[i + states.autofill.autofillYArr[0]]
              data.agencyOffers = JSON.parse(JSON.stringify(item.agencyOffers))
              data.agencyOffers.forEach(o => {
                o.caseId = data.caseId
                o.caseAgencyId = undefined
              })
            }
            if (states.columns[j + states.selector.selectedXArr[0]].key == 'ifShareTm') {
              let item = states.showData[states.selector.selectedYArr[0]]//[states.columns[j + states.selector.selectedXArr[0]].key]
              let data= states.showData[i + states.autofill.autofillYArr[0]]
              if (item.ifShareTm == '0') {
                data.joinApps = []
              }
            }
          }
        }
      }
      states.selector.selectedYArr.splice(0, 1, states.autofill.autofillYArr[0])
    }
    setTimeout(() => {
      states.autofill.autofillYArr = []
      states.autofill.isAutofill = false
    }, 0)
  }

  // 选择器
  multiSelect(e, x, y, columnType) {
    const {
      states
    } = this
    if (columnType === 'selection') return
    if (states.selector.isSelected) {
      setTimeout(() => {
        states.autofill.autofillXIndex = x > states.editor.editorXIndex ? x : states.editor.editorXIndex
        states.autofill.autofillYIndex = y > states.editor.editorYIndex ? y : states.editor.editorYIndex
        states.selector.selectedXIndex = x
        states.selector.selectedYIndex = y
        if (states.selector.selectedXIndex > states.editor.editorXIndex) {
          states.selector.selectedXArr.splice(0, 1, states.editor.editorXIndex)
          states.selector.selectedXArr.splice(1, 1, states.selector.selectedXIndex)
        } else {
          states.selector.selectedXArr.splice(0, 1, states.selector.selectedXIndex)
          states.selector.selectedXArr.splice(1, 1, states.editor.editorXIndex)
        }
        if (states.selector.selectedYIndex > states.editor.editorYIndex) {
          states.selector.selectedYArr.splice(0, 1, states.editor.editorYIndex)
          states.selector.selectedYArr.splice(1, 1, states.selector.selectedYIndex)
        } else {
          states.selector.selectedYArr.splice(0, 1, states.selector.selectedYIndex)
          states.selector.selectedYArr.splice(1, 1, states.editor.editorYIndex)
        }
      }, 0)
    }
    if (states.autofill.isAutofill) {
      if (y > states.selector.selectedYArr[1]) {
        states.autofill.autofillYArr = [states.selector.selectedYArr[1] + 1, y]
      } else if (y < states.selector.selectedYArr[0]) {
        states.autofill.autofillYArr = [y, states.selector.selectedYArr[0] - 1]
      } else {
        states.autofill.autofillYArr = []
      }
    }
  }

  openDropdown(i) {
    const {
      states
    } = this
    if (typeof (i) === 'number') {
      if (states.dropdown.index === i) {
        states.dropdown.index = null
      } else {
        states.dropdown.index = i
        states.dropdown = JSON.parse(JSON.stringify({
          ...states.columnsStatusList[states.dropdown.index],
          index: states.dropdown.index
        }))
      }
    } else {
      states.dropdown.index = null
    }
  }

  selectAllCells() {
    const {
      states
    } = this
    states.selector.selectedXIndex = states.editor.editorRange.minX
    states.selector.selectedYIndex = states.editor.editorRange.minY
    states.selector.selectedXArr = [states.editor.editorRange.minX, states.editor.editorRange.maxX]
    states.selector.selectedYArr = [states.editor.editorRange.minY, states.editor.editorRange.maxY]
  }

  handleFilters() {
    const {
      states
    } = this
    states.columnsStatusList.forEach((th) => {
      if (th.type === 'selection') return
      if (th.list) {
        Object.keys(th.list).forEach((item) => {
          th.list[item].count = 0
        })
      } else {
        th.list = {}
      }
      states.data.forEach((td) => {
        if (td[th.key]) {
          if (th.list[td[th.key]]) {
            th.list[td[th.key]].count += 1
          } else {
            th.list[td[th.key]] = {}
            th.list[td[th.key]].count = 1
          }
        }
      })
      Object.keys(th.list).forEach((item) => {
        if (th.list[item].count === 0) {
          delete th.list[item]
        }
      })
    })
  }

  // 处理错误数据
  handleErrors() {
    const {
      states
    } = this
    setTimeout(() => {
      states.dataStatusList.forEach((item, yIndex) => {
        states.columns.forEach((column) => {
          if (this.verify(column, states.data[yIndex][column.key])) {
            if (item.errors.includes(column.key)) {
              item.errors.splice(item.errors.indexOf(column.key), 1)
            }
          } else {
            if (!item.errors.includes(column.key)) {
              item.errors.push(column.key)
            }
          }
        })
      })
    }, 0)
  }

  verify(column, value) {
    if (!value) {
      return true
    }
    let correct
    switch (column.type) {
      case 'date':
        correct = verifyDate(value)
        break;
      case 'month':
        correct = verifyMonth(value)
        break;
      case 'select':
        correct = verifySelect(value, column.options)
        break;
      case 'number':
        correct = verifyNumber(value)
        break;
      default:
        correct = true
    }
    return correct
  }

  sort(type) {
    const {
      states
    } = this
    states.columnsStatusList.forEach((item) => {
      item.sort = ''
    })
    states.columnsStatusList[states.dropdown.index].sort = type
    if (type === 'ascending') {
      states.showData.sort((x, y) => (x[states.columnsStatusList[states.dropdown.index].key] > y[states.columnsStatusList[states.dropdown.index].key] ? 1 : -1))
    } else {
      states.showData.sort((x, y) => (x[states.columnsStatusList[states.dropdown.index].key] > y[states.columnsStatusList[states.dropdown.index].key] ? -1 : 1))
    }
    states.dropdown.index = null
  }

  // 过滤处理
  handleFilter() {
    const {
      states
    } = this
    states.columnsStatusList[states.dropdown.index] = {
      list: states.dropdown.list,
      key: states.dropdown.key,
      sort: states.dropdown.sort
    }
    const arr = []
    Object.keys(states.dropdown.list).forEach((key) => {
      if (states.dropdown.list[key].checked) {
        arr.push(key)
      }
    })
    states.filters[states.columnsStatusList[states.dropdown.index].key] = arr
    this.filterData()
  }

  resetFilter() {
    const {
      states
    } = this
    delete states.filters[states.columnsStatusList[states.dropdown.index].key]
    Object.keys(states.columnsStatusList[states.dropdown.index].list).forEach((key) => {
      states.columnsStatusList[states.dropdown.index].list[key].checked = false
    })
    this.filterData()
  }

  filterData() {
    const {
      states
    } = this
    states.showData = states.data
    Object.keys(states.filters).forEach((key) => {
      states.showData = states.showData.filter((item) => states.filters[key].includes(item[key]))
    })
    states.dropdown.index = null
  }

  handleChangeData() {
    console.log('改變的是')
    const {
      states
    } = this
    const data = JSON.parse(JSON.stringify(states.data))
    const initialData = JSON.parse(JSON.stringify(states.initialData))
    // if(states.plType=='案件管理'){
    //   states.changeData = data.filter((item, index) =>  JSON.stringify(item) !== JSON.stringify(initialData[index])).map((item, index) => {
    //
    //
    //              for (let key in item) {
    //                  if (item.hasOwnProperty(key)) {
    //                    let element =item[key];
    //                    let element1=initialData[data.indexOf(item)][key];
    //                    if(JSON.stringify(element) != JSON.stringify(element1)){
    //                        var  boolSt=false;
    //                        if((element1  instanceof Array)&&(element  instanceof Array)){
    //                             if(element.length<=0&&element1.length>0){
    //                               boolSt=true;
    //                             }
    //                        }
    //                        if((!element&&element1)||boolSt){
    //                                switch (key) {
    //
    //                                  case 'custContactName':
    //                                    item['custContactId']='0000'
    //                                    // item['custContactName']='0000'
    //                                    break;
    //                                  case 'letterAddrName':
    //                                    item['letterAddrId']='0000'
    //                                    item['letterAddrName']='0000'
    //                                    break;
    //                                  case 'billCustContactName':
    //                                    item['billCustContactId']='0000'
    //                                    item['billCustContactName']='0000'
    //                                    break;
    //                                  case 'billAddrName':
    //                                    item['billAddrId']='0000'
    //                                    item['billAddrName']='0000'
    //                                    break;
    //                                  case 'appCnName':
    //                                    item['appId']='0000'
    //                                    item['appCnName']='0000'
    //                                    break;
    //                                  case 'goods':
    //                                    item['goodsSign']='0000'
    //                                    break;
    //                                  case 'joinApps':
    //                                    item['joinAppsSign']='0000'
    //                                    break;
    //                                  case 'trademarkCaseBasicinfos':
    //                                    item['trademarkCaseBasicinfosSign']='0000'
    //                                    break;
    //                                  case 'trademarkCaseCustContactArray':
    //                                    item['trademarkCaseCustContactsSign']='0000'
    //                                    break;
    //                                  case 'trademarkCaseCustWorkgroups':
    //                                    item['trademarkCaseCustWorkgroupsSign']='0000'
    //                                    break;
    //                                  case 'trademarkCaseCBWorkgroups':
    //                                    item['trademarkCaseCBWorkgroupsSign']='0000'
    //                                    break;
    //
    //                                  default:
    //                                   item[key]='0000';
    //
    //                                    break;
    //                                }
    //
    //                              }
    //                    }else{
    //                      //console.log(key,'else')
    //                      if(key!='caseId'&&key!='tmCaseId'&&key!='caseTypeId'){
    //                       delete item[key]
    //                      }
    //
    //                    }
    //                  }
    //                }
    //
    //
    //           return item
    //         } )
    // }else{
    //   states.changeData = data.filter((item, index) =>  JSON.stringify(item) !== JSON.stringify(initialData[index]))
    // }
    states.changeData = data.filter((item, index) =>  JSON.stringify(item) !== JSON.stringify(initialData[index])).map((item, index) => {
      item.nullValueList = []
      for (let key in item) {
        if (item.hasOwnProperty(key)) {
          let element =item[key];
          let element1=initialData[data.indexOf(item)][key];
          if(JSON.stringify(element) != JSON.stringify(element1)){
            var  boolSt=false;
            if((element1  instanceof Array)&&(element  instanceof Array)){
              if(element.length<=0&&element1.length>0){
                boolSt=true;
              }
            }
            if((!element&&(element!==false && element !== 0)&&element1)||boolSt){
              switch (key) {

                case 'custContactName':
                  item['custContactId']='0000'
                  // item['custContactName']='0000'
                  break;
                case 'letterAddrName':
                  item['letterAddrId']='0000'
                  item['letterAddrName']='0000'
                  break;
                case 'billCustContactName':
                  item['billCustContactId']='0000'
                  item['billCustContactName']='0000'
                  break;
                case 'billAddrName':
                  item['billAddrId']='0000'
                  item['billAddrName']='0000'
                  break;
                case 'appCnName':
                  item['appId']='0000'
                  item['appCnName']='0000'
                  break;
                case 'goods':
                  item['goodsSign']='0000'
                  break;
                case 'agencyOffers':
                  item['agencySign']='0000'
                  break;
                case 'joinApps':
                  item['joinAppsSign']='0000'
                  break;
                case 'trademarkCaseBasicinfos':
                  item['trademarkCaseBasicinfosSign']='0000'
                  break;
                case 'trademarkCaseCustContactArray':
                  item['trademarkCaseCustContactsSign']='0000'
                  break;
                case 'trademarkCaseCustWorkgroups':
                  item['trademarkCaseCustWorkgroupsSign']='0000'
                  break;
                case 'trademarkCaseCBWorkgroups':
                  item['trademarkCaseCBWorkgroupsSign']='0000'
                  break;
                case 'priorityAppDate':
                  item['priorityAppDate']='0000'
                  item['priorityAppDateStr']='0000'
                  break;
                case 'appDate':
                  item['appDate']='0000'
                  item['appDateStr']='0000'
                  break;
                case 'approvalDate':
                  item['approvalDate']='0000'
                  item['approvalDateStr']='0000'
                  break;
                case 'regDate':
                  item['regDate']='0000'
                  item['regDateStr']='0000'
                  break;
                case 'limitDate':
                  item['limitDateStr']='0000'
                  item['limitDate']='0000'
                  break;
                case 'submitDate':
                  item['submitDate']='0000'
                  item['submitDateStr']='0000'
                  break;
                case 'validStartDate':
                  item['validStartDate']='0000'
                  item['validStartDateStr']='0000'
                  break;
                case 'validEndDate':
                  item['validEndDate']='0000'
                  item['validEndDateStr']='0000'
                  break;
                case 'onlineAppDate':
                  item['onlineAppDate']='0000'
                  item['onlineAppDateStr']='0000'
                  break;
                default:
                  if(states.editor.editType === 'date'){
                    item[key + 'Str']='0000'
                  }
                  item[key]='0000';
                  break;
              }

            }
            if(typeof element1 == 'boolean' && item[key] !== true && item[key] !== false){
              item.nullValueList.push(key)
              console.log(item.nullValueList)
              delete item[key]
            }
          }else{
            //console.log(key,'else')
            if(key!='abroadBillId'&&key!='caseId'&&key!='tmCaseId'&&key!='caseTypeId'&&key!='tmCaseList'&&key!='billRecordId'&&key!='tmFileId'&&key!='insId'&&key!='appNumber'&&key!='approvalNo'&&key!='regNumber'&&key!='arcId'&&key!='samId'){
              delete item[key]
            }

          }
        }
      }

      return item
    } )
  }

  // 撤销与重做
  operation(type) {
    const {
      states
    } = this
    if (!states.editor.editing) {
      if (type === 'undo' && states.curHisory > 1) {
        states.curHisory -= 1
      }
      if (type === 'recovery' && states.curHisory < states.historyData.length) {
        states.curHisory += 1
      }
      states.isOperation = true
      JSON.parse(states.historyData[states.curHisory - 1]).forEach((i, index) => {
        Object.keys(i).forEach((j) => {
          states.data[index][j] = i[j]
        })
      })
      setTimeout(() => {
        states.isOperation = false
      }, 0)
    }
  }

  // 清楚数据
  clearSelected() {
    const {
      states
    } = this
    for (let i = 0; i <= states.selector.selectedYArr[1] - states.selector.selectedYArr[0]; i += 1) {
      for (let j = 0; j <= states.selector.selectedXArr[1] - states.selector.selectedXArr[0]; j += 1) {
        if (!states.columns[j + states.selector.selectedXArr[0]].disabled) {
          states.showData[i + states.selector.selectedYArr[0]][states.columns[j + states.selector.selectedXArr[0]].key] = ''
        }
      }
    }
  }
}

export default TableStore
