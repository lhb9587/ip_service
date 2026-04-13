/**
 * Created by PanJiaChen on 16/11/18.
 */
import XLSX from 'xlsx'
import jsFileDownload from 'js-file-download'
import axios from 'axios'
import store from '@/store'
import UserIconAndUserName from '@/components/UserIconAndUserName/index.vue'
import vm from '../main'
import pinyinMatch from './pinyinMatch'

var pinyin = require('pinyin')
import { formatAmount } from '@/utils/filters'

export function closest(el, selector) {
  var matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector
  while (el) {
    if (matchesSelector.call(el, selector)) {
      break
    }
    el = el.parentElement
  }
  return el
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if ((

    '' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"')
      .replace(/\+/g, ' ') +
    '"}'
  )
}

/**
 * @param {date} sd
 * @param {Number} n
 * @param {String} g 月/天
 * @returns {String}
 */
export function getEndDate(sd, n, g) {
  var d = new Date(sd)
  switch (g) {
    case '月':
      var td = d.getDate()
      d.setMonth(d.getMonth() + n)
      if (td != d.getDate()) {
        d.setDate(0)
      }
      break
    case '天':
      d.setDate(d.getDate() + n)
      break
  }
  // d.setDate(d.getDate() - 1);
  // console.log(d);
  return formatDate(d)
}

/**
 * @param {string} time 2019/10/01
 * @returns {String}
 */
export function formatDate(time) {
  // if (time) {
  //   return new Date(time).toLocaleDateString().split(/[/|-]/).map(item => item.length < 2 ? '0' + item : item).join('-')
  // } else {
  //   return
  // }
  if (time) {
    time = new Date(time)
    var seperator1 = '-'
    var year = time.getFullYear()
    var month = time.getMonth() + 1
    var strDate = time.getDate()
    if (month >= 1 && month <= 9) {
      month = '0' + month
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = '0' + strDate
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate
    return currentdate
  } else {
    return ''
  }
}

export function formatDate1(time) {
  if (time) {
    time = new Date(time)
    var seperator1 = '-'
    var year = time.getFullYear()
    var month = time.getMonth() + 1
    var strDate = time.getDate()
    if (month >= 1 && month <= 9) {
      month = '0' + month
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = '0' + strDate
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate
    return currentdate
  } else {
    return ''
  }
}

export function getMenuName(obj, childrenStr = 'childrens') {
  var arr = []
  arr.push(obj)
  for (var i = 0, len = obj.length; i < len; i++) {
    arr.push(obj[i][childrenStr])
    if (obj[i][childrenStr] != null && obj[i][childrenStr].length > 0) {
      var factorial = function() {
        var _obj = arguments[0]
        for (var j = 0, _len = _obj.length; j < _len; j++) {
          arr.push(_obj[j][childrenStr])
          if (_obj[j][childrenStr] != null && _obj[j][childrenStr].length > 0) {
            factorial(_obj[j][childrenStr])
          }
        }
      }
      factorial(obj[i][childrenStr])
    }
  }
  var result = []
  for (let i = 0; i < arr.length; i++) {
    result = result.concat(arr[i])
  }
  return result.filter(item => item !== undefined && item !== null)
}

/**
 * @param {Object} Obj
 * @param {String} key
 * @param {Array || Number} array
 * @returns {Array || Number}
 */
export function getTwoDimensionalArray(Obj, key, array, props) {
  // console.log(Obj, key, array, props);
  if (props && props.children) {
    var childrenStr = props.children
  }
  var parent
  if (props && props.parent) {
    parent = props.parent
  } else {
    parent = 'parent'
  }
  let menuNameList = getMenuName(Obj, childrenStr)

  function familyTree(arr, pid) {
    var temp = []
    var forFn = function(arr, pid) {
      for (var i = 0; i < arr.length; i++) {
        var item = arr[i]
        if (item[key] == pid) {
          temp.push(item)
          forFn(arr, item[parent])
        }
      }
    }
    forFn(arr, pid)
    return temp
  }

  if (Object.prototype.toString.call(array).includes('Array')) {
    return array.map(item => familyTree(menuNameList, item).map(item => item[key]).reverse())
  } else {
    return familyTree(menuNameList, array).map(item => item[key]).reverse()
  }
}

export function downManyFile(list) {
  let index = 0

  function down(item) {
    downLoadAll({
      url: `ipdoc${item.localFilePath}`, success() {
        index += 1
        if (index === list.length) {
          return
        }
        setTimeout(() => {
          down(list[index])
        }, 1000)

      }
    })
  }

  down(list[index])
}

/**
 * @param {Object} data
 */
export function downLoadAll(data) {
  let downProgress = {}
  let uniSign = new Date().getTime() + ''
  // store.commit('caseInformation/PUSH_DOWNLOADLIST',data)
  axios.get(data.url, {
    responseType: 'blob', headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    onDownloadProgress(progress) {
      downProgress = Math.round(100 * progress.loaded / progress.total)
      store.commit('caseInformation/SET_PROGRESS', { path: uniSign, 'progress': downProgress })
    }
  }).then((res) => {
    if (data.downLoad) {
      jsFileDownload(res.data, data.downLoad + '.' + data.url.replace(/.+\./, ''))
    } else {
      jsFileDownload(res.data, data.url.split('/')[data.url.split('/').length - 1])
    }
    store.commit('caseInformation/PUSH_DOWNLOADLIST', data)
    if (data.success && typeof data.success == 'function') {
      data.success()
    }

  }).catch((e) => {
    if (data.error) {
      data.error(e)
    } else {
      // this.$message.error('该文件无法下载')
    }
  })
  // var a = document.createElement('a');
  // a.setAttribute('id', 'startTelMedicine');
  // a.setAttribute('href', data.url);
  // if (data.downLoad) {
  //   a.setAttribute('downLoad', data.downLoad);
  // }
  // if (data.target === '_blank') {
  //   a.setAttribute('target', '_blank');
  // }
  // if (document.getElementById('startTelMedicine')) {
  //   document.body.removeChild(document.getElementById('startTelMedicine'));
  // }
  // document.body.appendChild(a);
  // a.click();
}

export function getLanglist(array) {
  array = array.filter(item => !!item)
  let arr = []
  array.forEach(item => {
    arr.push(...item)
  })
  return arr
}

// export function removeClass(ele, cls) {
//   if (hasClass(ele, cls)) {
//     const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
//     ele.className = ele.className.replace(reg, ' ')
//   }
// }
// export function addClass(ele, cls) {
//   if (!hasClass(ele, cls)) ele.className += ' ' + cls
// }
export function throttle(fn, interval = 300) {
  var canRun = true
  return function() {
    if (!canRun) return
    canRun = false
    setTimeout(() => {
      fn.apply(this, arguments)
      canRun = true
    }, interval)
  }
}

export function unique(data, key) {
  const hash = {}
  const data2 = data.reduce((preVal, curVal) => {
    hash[curVal[key]]
      ? ''
      : (hash[curVal[key]] = true && preVal.push(curVal))
    return preVal
  }, [])
  return data2
}

export function getSuffix(str) {
  return str.replace(/(.*\/)*([^.]+).*/ig, '$2', '') + '.' + str.replace(/.+\./, '')
}

export const awaitWrap = (promise) => {
  return promise
    .then(data => [null, data])
    .catch(err => [err, null])
}

/**
 *
 * @param vm $refs.formName
 * @returns {boolean}
 */
export function formValidate(vm) {
  vm.validate()
  let validateList = vm.fields.map(_vm => ({
    validateState: _vm.validateState,
    validateMessage: _vm.validateMessage
  }))
  if (validateList.find(item => item.validateState == 'error')) {
    vm.$message.error(validateList.find(item => item.validateState == 'error').validateMessage)
    return false
  }
  return true
}

export const emptyParameterProcessing = (data) => {
  for (let key in data) {
    if (Object.prototype.toString.call(data[key]).includes('String') && data[key] === '') {
      delete data[key]
    } else if (Object.prototype.toString.call(data[key]).includes('Array') && data[key].length === 0) {
      delete data[key]
    } else if (Object.prototype.toString.call(data[key]).includes('Number') && !data[key] && data[key].length !== 0) {
      delete data[key]
    } else if (data[key] == null || data[key] == undefined) {
      delete data[key]
    }
    // }else if(!data[key]){
    //   delete data[key]
    // }
  }
  return data
}

function getPxNumber(str) {
  return parseFloat(str, 10)
}

function handleMouseDown(onMove, bindUpAndDown) {
  return function({ target, clientX: x, clientY: y }) {
    let x0 = x
    let y0 = y

    function handleMove(e, ...rest) {
      const { clientX, clientY } = e
      e.preventDefault()
      const detaX = clientX - x0
      const detaY = clientY - y0
      x0 = clientX
      y0 = clientY
      onMove(target, detaX, detaY, ...rest)
    }

    bindUpAndDown(target, handleMove)
  }
}

function renderCorner({ width, height }) {
  const eles = Array.from({ length: 4 }).map(() =>
    document.createElement('div')
  )
  eles.forEach(x => x.classList.add('controller-corner'))
  const [tl, tr, bl, br] = eles
  Object.assign(tl.style, {
    top: `-5px`,
    left: `-5px`,
    cursor: 'nw-resize',
    display: 'none'
  })
  Object.assign(tr.style, {
    top: `-5px`,
    cursor: 'ne-resize',
    right: `-5px`,
    display: 'none'
  })
  Object.assign(bl.style, {
    bottom: `-5px`,
    cursor: 'sw-resize',
    left: `-5px`,
    display: 'none'
  })
  Object.assign(br.style, {
    bottom: `-5px`,
    cursor: 'se-resize',
    right: `-5px`
  })
  return { eles }
}

function createControler(ele, { x, y, width, height }, { minSize = 10 }) {
  const { eles } = renderCorner({ x, y, width, height })
  const [tl, tr, bl, br] = eles
  const handleControlerMouseDown = handleMouseDown(
    (target, detaX, detaY, isMoveTargetElement) => {
      const isLeft = [tl, bl].includes(target)
      const isTop = [tl, tr].includes(target)
      const directionLeft = !isLeft ? 1 : -1
      const directionTop = !isTop ? 1 : -1
      let newWidth = getPxNumber(ele._style_.width) + directionLeft * detaX
      let newHeight =
        getPxNumber(ele._style_.height) + directionTop * detaY

      if (isMoveTargetElement) {
        const newL = getPxNumber(ele._style_.left)
        const newT = getPxNumber(ele._style_.top)
        // ele._style_.left = `${newL + detaX}px`;
        // ele._style_.top = `${newT + detaY}px`;
        return
      }
      newWidth = newWidth < minSize ? minSize : newWidth
      newHeight = newHeight < minSize ? minSize : newHeight

      ele._style_.width = `${newWidth}px`
      ele._style_.height = `${newHeight}px`
      // ele._style_.left = isLeft
      //   ? `${getPxNumber(ele._style_.left) - directionLeft * detaX}px`
      //   : ele._style_.left;

      // ele._style_.top = isTop
      //   ? `${getPxNumber(ele._style_.top) - directionTop * detaY}px`
      //   : ele._style_.top;
    },
    (target, handleMove) => {
      const handleMoveTargetElement = e => handleMove(e, true)
      if (eles.includes(target)) {
        document.addEventListener('mousemove', handleMove)
      } else {
        document.addEventListener('mousemove', handleMoveTargetElement)
      }
      document.addEventListener('mouseup', ({ target }) => {
        document.removeEventListener('mousemove', handleMove)
        document.removeEventListener('mousemove', handleMoveTargetElement)
      })
    }
  )
  document.addEventListener('mousedown', handleControlerMouseDown)
  eles.forEach(e => {
    ele.appendChild(e)
  })
  return {
    removeControler() {
      eles.forEach(e => {
        ele.removeChild(e)
      })
      document.removeEventListener('mousedown', handleControlerMouseDown)
    },
    eles: [...eles, ele]
  }
}

function injectController(ele, config) {
  const { x, y, width, height } = ele.getBoundingClientRect()
  const bodyMargin = getPxNumber(getComputedStyle(document.body).margin)
  const controlWrapper = document.createElement('div')
  const _style_ = new Proxy(controlWrapper.style, {
    get(o, key) {
      let originalStyleValue = Reflect.get(o, key)
      if (
        ['width', 'height', 'left', 'top'].includes(key) &&
        !originalStyleValue
      ) {
        originalStyleValue = controlWrapper.getBoundingClientRect()[key]
      }
      return originalStyleValue
    },
    set(o, key, val) {
      const pxNumber = getPxNumber(val)
      if (['left', 'top'].includes(key)) {
        ele.style[key] = `${pxNumber - bodyMargin}px`
      } else if (['width', 'height'].includes(key)) {
        ele.style[key] = val
      }
      Reflect.set(o, key, val)
      return val
    }
  })
  Object.assign(controlWrapper.style, {
    position: 'fixed',
    width: `${width}px`,
    height: `${height}px`,
    top: `${y}px`,
    left: `${x}px`,
    cursor: 'all-scroll',
    border: '0px dashed #000',
    zIndex: '-1'
  })
  controlWrapper._style_ = _style_
  const { removeControler, eles } = createControler(
    controlWrapper,
    {
      width,
      height
    },
    config
  )
  ele.appendChild(controlWrapper)
  return {
    removeAllControler() {
      removeControler()
      ele.removeChild(controlWrapper)
    },
    eles: [...eles, controlWrapper]
  }
}

export function injectDragger(ele, config = {}) {
  let removeDragger
  ele.addEventListener('click', () => {
    if (!removeDragger) {
      // console.log(ele.getBoundingClientRect());
      const { removeAllControler, eles } = injectController(ele, config)
      removeDragger = removeAllControler
      const handleRemove = ({ target }) => {
        // console.log(target);
        if (![...eles, ele].includes(target)) {
          removeDragger && removeDragger()
          removeDragger = undefined
          document.removeEventListener('mouseup', handleRemove)
        }
      }
      document.addEventListener('mouseup', handleRemove)
    }
  })
}

export function getuploadUrl() {
  // 192.168.100.70上的另一个IP地址是192.168.100.92
  // 上传文件接口：访问http://192.168.100.92:9000/ip_service/interface/material/creatematerial
  //
  //
  //   192.168.100.141上的另一个IP地址是192.168.100.198
  // 上传文件接口：访问http://192.168.100.198:9000/ip_service/interface/material/creatematerial
  // if(window.location.hostname=='192.168.100.70'){
  //   return 'http://192.168.100.70:9000/ip_service/interface/material/creatematerial'
  // }else if(window.location.hostname=='192.168.100.141'){
  //   return 'http://192.168.100.141:9000/ip_service/interface/material/creatematerial'
  // }else {
  //   return `${window.location.origin}/ip_service/interface/material/creatematerial`
  // }
  return `${window.location.origin}/ip_service/interface/material/creatematerial`
}

export function sort(a, b, prop) {
  if (!a && !b) {
    return 0
  }
  if (!a) {
    return -1
  }
  if (!b) {
    return 1
  }
  if (Number(a) + '' !== 'NaN') {
    return a - b
  } else if (typeof a == 'string') {
    return a.localeCompare(b, 'zh')
  } else {
    return 0
  }
}

export function saveFilterModel(name, type, value) {
  if (!localStorage.getItem(type)) {
    let arr = []
    arr.push({ name: name, [type]: value })
    localStorage.setItem(type, JSON.stringify(arr))
  } else {
    let arr = JSON.parse(localStorage.getItem(type))
    if (arr.find(item => item.name == name)) {
      arr.find(item => item.name == name)[type] = value
      localStorage.setItem(type, JSON.stringify(arr))
    } else {
      arr.push({ name: name, [type]: value })
      localStorage.setItem(type, JSON.stringify(arr))
    }
  }
}

export function getFilterModel(name, type) {
  if (localStorage.getItem(type) && JSON.parse(localStorage.getItem(type)).find(item => item.name == name)) {
    return JSON.parse(localStorage.getItem(type)).find(item => item.name == name)[type]
  }
  return ''
}

export function takeCaseDetail(row, vm, target = '_blank') {
  let taskType = getTaskType(row, vm)
  if (target == '_blank') {
    if (taskType) {
      window.open(`#/workbench/case/seeCaseDetail/${row.caseId}?taskType=${taskType}`)
    } else {
      window.open(`#/workbench/case/seeCaseDetail/${row.caseId}`)
    }
  } else {
    if (taskType) {
      vm.$router.push(`/workbench/case/seeCaseDetail/${row.caseId}?taskType=${taskType}`)
    } else {
      vm.$router.push(`/workbench/case/seeCaseDetail/${row.caseId}`)
    }
  }

}

//递交指令文件类型
export function getSubmitObjTypeByTaskType(taskType) {
  let objType = ''
  switch (taskType) {
    case 1 :
      objType = '1'
      break
    case 2 :
      objType = '1117'
      break
    case 3 :
      objType = '1039'
      break
    case 4 :
      objType = '2002'
      break
    case 5 :
      objType = ''
      break
    case 6 :
      objType = '1056'
      break
    case 7 :
      objType = ''
      break
  }
  return objType
}

//官方通知
export function getObjTypeByTaskType(taskType) {
  let objType = ''
  switch (taskType) {
    case 1 :
      objType = '2'
      break
    case 2 :
      objType = '1118'
      break
    case 3 :
      objType = '1038'
      break
    case 4 :
      objType = '2003'
      break
    case 5 :
      objType = '1052'
      break
    case 6 :
      objType = '1057'
      break
    case 7 :
      objType = ''
      break
  }
  return objType
}

export function getCaseTypeIdByTaskType(taskType) {
  let caseTypeId
  switch (taskType) {
    case 1 :
      caseTypeId = 3
      break
    case 2 :
      caseTypeId = 2
      break
    case 3 :
      caseTypeId = 1
      break
    case 4 :
      caseTypeId = 4
      break
    case 5 :
      caseTypeId = 75
      break
    case 6 :
      caseTypeId = 76
      break
    case 7 :
      caseTypeId = 86
      break
  }
  return caseTypeId
}

export function getTaskType(row, vm) {
  /*
  taskType
  1:商标案件
  2:诉讼案件
  3:保护案件
  4:专利案件
  5：域名案件
  6：著作权案件
  7：非诉案件
   */
  let taskType = null
  // 5：域名，75 6：著作权，76  7：非诉案件 86
  if (row.taskType) {
    taskType = row.taskType
  } else {
    if (getTwoDimensionalArray(vm.$store.getters.caseTypeList, 'caseTypeId', row.caseTypeId).includes(3)) {
      taskType = 1
    }
    if (getTwoDimensionalArray(vm.$store.getters.caseTypeList, 'caseTypeId', row.caseTypeId).includes(2)) {
      taskType = 2
    }
    if (getTwoDimensionalArray(vm.$store.getters.caseTypeList, 'caseTypeId', row.caseTypeId).includes(1)) {
      taskType = 3
    }
    if (getTwoDimensionalArray(vm.$store.getters.caseTypeList, 'caseTypeId', row.caseTypeId).includes(4)) {
      taskType = 4
    }
    if (getTwoDimensionalArray(vm.$store.getters.caseTypeList, 'caseTypeId', row.caseTypeId).includes(75)) {
      taskType = 5
    }
    if (getTwoDimensionalArray(vm.$store.getters.caseTypeList, 'caseTypeId', row.caseTypeId).includes(76)) {
      taskType = 6
    }
    if (getTwoDimensionalArray(vm.$store.getters.caseTypeList, 'caseTypeId', row.caseTypeId).includes(86)) {
      taskType = 7
    }
  }
  return taskType
}

export function intersection(arr1, arr2) {
  return arr1.filter(function(val) {
    return arr2.indexOf(val) > -1
  })
}

export function compare(property) {
  return function(a, b) {
    var value1 = a[property]
    var value2 = b[property]
    return value1 - value2
  }
}

export function transformation(arr, val, valType, labelStr) {
  if (arr && arr.length) {
    var item = arr.find(item => item[valType] == val)
    if (item) {
      return item[labelStr]
    } else {
      return ''
    }
  }
  return ''
}

/**
 * 导出Excel的处理函数--针对table
 * @param {Array} headers: [{key: 'date', title: '日期'}, {key: 'name', title: '名称'}]
 * @param {Array} data   : [{date: '2019-05-31', name: 'megen.huang'}, {date: 'name', name: '小明'}]
 * @param {String} fileName: '导出结果.xlsx'
 * */
export function ExportExcel(headers, data, fileName = '导出结果.xlsx') {
  const _headers = headers
    .map((item, i) => Object.assign({}, {
      key: item.key,
      title: item.title,
      position: String.fromCharCode(65 + i) + 1
    }))
    .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { key: next.key, v: next.title } }), {})

  const _data = data
    .map((item, i) => headers.map((key, j) => Object.assign({}, {
      content: item[key.key],
      position: String.fromCharCode(65 + j) + (i + 2)
    })))
    // 对刚才的结果进行降维处理（二维数组变成一维数组）
    .reduce((prev, next) => prev.concat(next))
    // 转换成 worksheet 需要的结构
    .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.content } }), {})

  Object.keys(_data).forEach(item => {

    if (!isNaN(Number(_data[item]['v']))) {
      _data[item]['v'] = Number(_data[item]['v']) || ''
      _data[item]['t'] = 'n'
    }

  })
  // 合并 headers 和 data
  const output = Object.assign({}, _headers, _data)
  // 获取所有单元格的位置
  const outputPos = Object.keys(output)
  // 计算出范围 ,["A1",..., "H2"]
  const ref = `${outputPos[0]}:${outputPos[outputPos.length - 1]}`

  // 构建 workbook 对象
  const wb = {
    SheetNames: ['mySheet'],
    Sheets: {
      mySheet: Object.assign(
        {},
        output,
        {
          '!ref': ref,
          // eslint-disable-next-line
          '!cols': headers.map(item => ({ wpx: 100 }))
        }
      )
    }
  }
  // 导出 Excel
  XLSX.writeFile(wb, fileName)
}

export function ExportExcelWithDC(headers, data, fileName = '导出结果.xlsx') {
  // 构建 headers 的位置映射
  const _headers = headers
    .map((item, i) => ({
      key: item.key,
      title: item.title,
      position: String.fromCharCode(65 + i) + 1 // A1, B1, C1...
    }))
    .reduce((prev, next) => ({ ...prev, [next.position]: { key: next.key, v: next.title } }), {});
 
  // 构建 data 的位置映射
  const _data = data
    .map((item, i) => {
      // 遍历 headers，确保每个字段都有值，缺失的字段设置为 0
      return headers.map((header, j) => ({
        content: item[header.key] !== undefined ? item[header.key] : 0, // 缺失字段设置为 0
        position: String.fromCharCode(65 + j) + (i + 2) // A2, B2, C2...
      }));
    })
    .flat() // 将二维数组展平为一维数组
    .reduce((prev, next) => ({ ...prev, [next.position]: { v: next.content } }), {});
 
  // 确保数字类型正确
  Object.keys(_data).forEach((item) => {
    if (!isNaN(Number(_data[item]['v']))) {
      _data[item]['v'] = Number(_data[item]['v']) || 0;
      _data[item]['t'] = 'n'; // 数字类型
    }
  });
 
  // 合并 headers 和 data
  const output = { ..._headers, ..._data };
 
  // 获取所有单元格的位置
  const outputPos = Object.keys(output);
  const ref = `${outputPos[0]}:${outputPos[outputPos.length - 1]}`;
 
  // 构建 workbook 对象
  const wb = {
    SheetNames: ['mySheet'],
    Sheets: {
      mySheet: Object.assign(
        {},
        output,
        {
          '!ref': ref,
          '!cols': headers.map(() => ({ wpx: 100 })) // 设置列宽
        }
      )
    }
  };
 
  // 导出 Excel
  XLSX.writeFile(wb, fileName);
}

export function process(s) {
  var pattern = new RegExp('[` ~!@#$^&*()=|{}\':;\',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“\'。，、？]')
  var rs = ''
  for (var i = 0; i < s.length; i++) {
    rs = rs + s.substr(i, 1).replace(pattern, '')
  }
  return rs
}

export function viewPdf(url, flag) {
  let caseList = require('@/api/caseList')
  return new Promise((resolve => {
    caseList.viewPdf({ address: `${url}` }).then(res => {
      resolve(res.data.pdfAddress)
      if (!flag) {
        window.open(`ipdoc${res.data.pdfAddress}`.replace(/[+]/g, '%2B'))
      }
    })
  }))

}

export function UserRender(data) {
  const h = vm.$createElement
  let vnode = h(UserIconAndUserName, {
    props: {
      userId: `${data.userId}`,
      list: vm.$store.getters.allUserList
    }

  })
  const div = document.createElement('div')
  vm.__patch__(div, vnode, true, false)

  return div
}

export function getPinyin(str) {//获取字符串拼音
  return pinyin(str, {
    style: pinyin.STYLE_NORMAL,
    heteronym: true               // 启用多音字模式
  })
}

export function isPinyinMatch(str, keyword) {
  return pinyinMatch.match(str, keyword)//getPinyin(str)
}

export function getSuffixFile(url) {
  if (['pdf'].includes(url.replace(/.+\./, ''))) {
    return 'pdf'
  }
  if (['docx', 'doc'].includes(url.replace(/.+\./, ''))) {
    return 'Doc'
  }
  if (['csv'].includes(url.replace(/.+\./, ''))) {
    return 'csv'
  }
  if (['xlsx', 'xls'].includes(url.replace(/.+\./, ''))) {
    return 'exc'
  }
  if (['txt'].includes(url.replace(/.+\./, ''))) {
    return 'txt'
  }
  if (['msg'].includes(url.replace(/.+\./, ''))) {
    return 'msg'
  }
  if (['mp4'].includes(url.replace(/.+\./, ''))) {
    return 'Video'
  }
  if (['html'].includes(url.replace(/.+\./, ''))) {
    return 'html'
  }
  if (['json'].includes(url.replace(/.+\./, ''))) {
    return 'json'
  }
  if (['mp3'].includes(url.replace(/.+\./, ''))) {
    return 'music'
  }
  if (['zip'].includes(url.replace(/.+\./, ''))) {
    return 'zip'
  }
  if (['rar'].includes(url.replace(/.+\./, ''))) {
    return 'RAR'
  }
  if (['pptx', 'ppt'].includes(url.replace(/.+\./, ''))) {
    return 'RAR'
  }
  if (['gif'].includes(url.replace(/.+\./, ''))) {
    return 'gif'
  }
  if (['jpg', 'png', 'jpeg'].includes(url.replace(/.+\./, ''))) {
    return 'pic'
  }
  return 'weizhi'
}

/**
 * @param{number} num 距离当日num天的日期
 * @param{number} str 日期分隔符 '-'、'/'...
 * */
export function getDay(num, str) {
  var today = new Date()
  var nowTime = today.getTime()
  var ms = 24 * 3600 * 1000 * num
  today.setTime(parseInt(nowTime + ms))
  var oYear = today.getFullYear()
  var oMoth = (today.getMonth() + 1).toString()
  if (oMoth.length <= 1) oMoth = '0' + oMoth
  var oDay = today.getDate().toString()
  if (oDay.length <= 1) oDay = '0' + oDay
  return oYear + str + oMoth + str + oDay
}

export function hasValue(data, key) {
  if (data[key] === undefined || data[key] === null || data[key] === '') {
    return false
  }
  if (data[key].toString && data[key].toString() == ',' || data[key].toString() == '') {
    return false
  }
  // if(data[key].toString&&data[key].toString()==''){
  //   return false
  // }

  return true
}

/**
 *
 * @param {Object} obj: 需要处理清空操作的对象
 * @param {Object} backObject: 需要处理清空操作的对象的初始值
 */
export function handleObjNullAttr(obj, backObject) {
  if (!obj || !backObject) return
  for (var key in obj) {
    if (Object.prototype.toString.call(obj[key]) == '[object Array]') {
      if (backObject[key] && backObject[key].length && !(obj[key] && obj[key].length)) {
        if (obj.nullValueList && obj.nullValueList.length) {
          obj.nullValueList.push(key)
        } else {
          obj.nullValueList = [key]
        }
      }
      // if(obj[key]&&!obj[key].length && backObject[key] &&backObject[key].length ){
      //   if(obj.nullValueList&&obj.nullValueList.length){
      //     obj.nullValueList.push(key)
      //   }else{
      //     obj.nullValueList = [key]
      //   }
      // }else if(obj[key]&&obj[key].length && backObject[key] &&backObject[key].length){
      //   obj[key].forEach((item,index)=>{
      //     if(Object.prototype.toString.call(item) == '[object Object]'){
      //       handleObjNullAttr(item,)
      //     }
      //   })
      // }
    } else if (Object.prototype.toString.call(obj[key]) == '[object Object]') {
      // handleObjNullAttr(obj[key], backObject[key])
    } else {
      if (obj[key] !== 0 && obj[key] !== false && !obj[key] && backObject[key]) {
        if (obj.nullValueList && obj.nullValueList.length) {
          obj.nullValueList.push(key)
        } else {
          obj.nullValueList = [key]
        }
      }
    }
  }
  obj.nullValueList = [...new Set(obj.nullValueList)]
}

/**
 *
 * @param {Array} changeList: 需要处理清空操作的数组
 * @param {Array} listAttr:  数组中的对象需要处理的属性，默认是对象全部属性
 */
export function handleArrayNullAttr(changeList = [], listAttr = undefined) {
  let listAttrs = listAttr
  if (!changeList.length) {
    return []
  } else if (!listAttr) {
    listAttrs = changeList[0].Object.keys().map(item => ({ field: item }))
  }
  changeList.forEach((items, index) => {
    if (items.length) {
      items.forEach(item => {
        item.nullValueList = []
        for (var key in item) {
          // console.log(item[key])
          if (!item[key] && item[key] !== 0 && listAttrs[index].map(item => item.field).includes(key)) {
            item.nullValueList.push(key)
          }
        }
      })
    }
  })
}

/**
 * 去除传参空字段
 * @param {Object} obj1
 *
 */
export function cleanNullAttr(obj1) {
  const obj = JSON.parse(JSON.stringify(obj1))
  for (let key in obj) {
    if (Object.prototype.toString.call(obj[key]) == '[object Array]' && (!obj[key].length || !obj[key].filter(Boolean).length)) {
      obj[key] = []
    } else if (!obj[key] && obj[key] !== 0 && obj[key] !== false) {
      obj[key] = undefined
    }
  }
  return obj
}

/**
 * 办案人逻辑判断
 *
 * */
export function checkBA(list) {
  let typeList = {
    chengBan: [],
    keHu: []
  }
  list && list.length && list.forEach(item => {
    if (item.includes('承办')) {
      typeList.chengBan.push(item.replace(/.+(.$)/, ($, $1) => $1))
    }
    if (item.includes('客户')) {
      typeList.keHu.push(item.replace(/.+(.$)/, ($, $1) => $1))
    }
  })
  return switchLength(typeList.chengBan) && switchLength(typeList.keHu)
}

function switchLength(list) {
  switch (list.length) {
    case 1:
      return list.includes('一')
    case 2:
      return list.includes('一') && list.includes('二')
    case 3:
      return list.includes('一') && list.includes('二') && list.includes('三')
    // case 4:
    //   return list.includes('一')&&list.includes('二')&&list.includes('三')&&list.includes('四');
    default:
      return true
  }
}

/**
 * 拖拽弹框层级关系
 *
 * */
export function dragZindex(that) {
  that.$nextTick(() => {
    var dragDomList = [...document.getElementsByClassName('dragDialog')]
    let zIndexList = dragDomList.map(i => i.style.zIndex).filter(Boolean).sort((a, b) => b - a)
    let maxIndex = +zIndexList[0]
    dragDomList.forEach((item, index) => {
      item.addEventListener('click', () => {
        item.style.zIndex = maxIndex + 1
        for (let i = 0; i < dragDomList.length; i++) {
          if (i !== index) {
            dragDomList[i].style.zIndex = maxIndex
          }
        }
      })
    })
  })
}

/**
 * el-table表头筛选
 * 传入表格数据,由于每行字段可能会变化（某字段在第一行有值，第二行直接没有）
 * 这里直接遍历所有数据，每行字段合并后去重，保证所有字段能正常收集
 * by coder__wang
 *
 * */
export function tableFilter(list) {
  let filters = {}
  if (list.length) {
    let keyList = []
    list.forEach(item => {
      keyList.push(...Object.keys(item))
    })
    keyList = [...new Set(keyList)]
    keyList.forEach(item => {
      filters[item] = []
    })
    list.forEach(item => {
      for (let key in item) {
        if (filters.hasOwnProperty(key) && !filters[key].find(i => i.text == item[key])) {
          filters[key].push({ text: item[key], value: item[key] })
        }
      }
    })
  }
  return filters
}

/**
 * 滚动条到底部
 *
 * */
export function scrollToBottom(domObj) {
  domObj.scrollTop = domObj.scrollHeight
}

/**
 * 提取表单对象数据改动过的属性
 * @params {Object} obj:原始数据 | obj1：修改后数据
 * @returns {Object} 改动的属性构成的新对象
 * by coder_wang
 * */
export function compareObjAttrs(obj, obj1) {
  const ignoreAttrList = ['appFromto', 'appCnName', 'appEnName', 'legalNature', 'appGJdq', 'certCode', 'appCnAddr', 'appEnAddr', 'appContactPerson', 'appContactTel', 'appContactEmail', 'appContactPostCode']
  if (!obj) return obj1 // 没有原始数据作对比则返回传入的数据
  let attrsObj = {}
  for (let key in obj1) {
    if (obj1.hasOwnProperty(key)) {
      if (Object.prototype.toString.call(obj1[key]) === '[object Array]') {
        attrsObj[key] = obj1[key]
        // if(!vm.$wUtil.compareArr(obj[key] || [], obj1[key])) {
        //   attrsObj[key] = obj1[key];
        // }
      } else if (Object.prototype.toString.call(obj1[key]) === '[object Object]') {
        if (!vm.$wUtil.compareObj(obj[key] || {}, obj1[key])) {
          attrsObj[key] = obj1[key]
        }
      } else {
        if (obj1[key] !== obj[key] || ignoreAttrList.includes(key)) {
          attrsObj[key] = obj1[key]
        }
        if ((!obj1[key] && obj1[key] !== 0 && obj1[key] !== false) && (!obj[key] && obj[key] !== 0 && obj[key] !== false)) {
          attrsObj[key] = undefined
        }
      }
    }
  }
  return attrsObj
}

/**
 * ag-grid底部属性合计
 * @params gridData 表格数据
 * @params columnDefs 所有列的数据
 * @params columnDisplay 需要合计的列属性数组
 *
 * */
export function getRowHeight() {
  return 24
}

export function pinnedBottomRowData(gridData, columnDefs = [], columnDisplay = []) {
  if (columnDefs.length && columnDisplay.length) {
    let obj = {};

    columnDefs.forEach(column => {
      if (column.children) {
        // 处理带子项的列 children (二级列)
        column.children.forEach(child => {
          if (columnDisplay.includes(child.field)) {
            obj[child.field] = getSum(gridData, child.field);
          } else {
            obj[child.field] = '';
          }
        });
      } else {
        // 处理没有子项的列 children (一级列)
        if (columnDisplay.includes(column.field)) {
          obj[column.field] = getSum(gridData, column.field);
        } else {
          obj[column.field] = '';
        }
      }
    });

    return [obj];
  }

  return [{}];
}


function getSum(list, type) {
  if (!list) return 0
  return `${formatAmount(list.map(item => item[type]).filter(item => !!item).reduce((x, y) => Number(x) + Number(y), 0))}`
}

/**
 *
 * 遍历删除数组元素
 * @params {Array} gridData 表格初始数据
 * @params {Array} rows 删除的数据
 * @params {String} delId 每条数据的id字段名称
 * @params {Function} cb 回调函数
 *
 * ps: 直接遍历gridData，splice()会改变原数组，后续splice操作将发生错误，这里借用栈
 *
 * */
export function partDel(gridData, rows, delId, cb) {
  let funcStack = [] // 存储将要删除数据的函数执行栈
  gridData.forEach(item => {
    rows.find(i => i == item[delId]) && funcStack.push(() => {
      gridData.splice(gridData.findIndex(i => i[delId] == item[delId]), 1)
    })
  })
  while (funcStack.length) {
    funcStack.pop()()
    cb() // 回调
  }
}

/**
 * 接口返回单条数据局部更新
 * @params {Array} gridData 表格数据
 * @params {Function} request 请求接口
 * @params {Object} argSearch: 其他参数
 * @params {String} searchKey: 参数
 * @params {String, Number} key, value 查询接口传参键值对
 * @params {Function} cb 回调
 *
 * */
export async function partUpdate(gridData, request, { argSearch = {}, searchKey, key, value }, cb) {
  let res = await request({
    [searchKey || key + 's']: value,
    ...argSearch
  })

  let list = res.data
  list.forEach(item => {
    let obj = gridData.find(i => i[key] == item[key])
    if (obj) {
      // value = value.replace(item[key], '')
      for (let k in item) {
        obj[k] = item[k]
      }
    }
  })
  cb(list)
}

export function browserRedirect() {
  const sUserAgent = window.navigator.userAgent.toLowerCase()
  const bIsIpad = sUserAgent.match(/ipad/i) == 'ipad'
  const bIsIphoneOs = sUserAgent.match(/iphone os/i) == 'iphone os'
  const bIsMidp = sUserAgent.match(/midp/i) == 'midp'
  const bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == 'rv:1.2.3.4'
  const bIsUc = sUserAgent.match(/ucweb/i) == 'ucweb'
  const bIsAndroid = sUserAgent.match(/android/i) == 'android'
  const bIsCE = sUserAgent.match(/windows ce/i) == 'windows ce'
  const bIsWM = sUserAgent.match(/windows mobile/i) == 'windows mobile'
  return bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM
}

export function getLastWorkDate() {
  var yesterday = new Date(),
    date = new Date()
  if (yesterday.getDay() === 0) {
    yesterday.setDate(date.getDate() - 2)
  } else if (yesterday.getDay() === 1) {
    yesterday.setDate(date.getDate() - 3)
  } else {
    yesterday.setDate(date.getDate() - 1)
  }
  var dateInt = yesterday.toLocaleDateString().replace(/\//g, '-')
  return dateInt
}

/**
 * 解决求和超出精度问题
 * @params {String | Number} a, b
 * wang
 * */
export function bigSum(a, b) {
  a = String(a).split('')
  b = String(b).split('')
  var sum = '',
    temp = 0,
    length = a.length > b.length ? a.length : b.length
  while (length + 1) {
    temp = ~~(temp / 10) + ~~a.pop() + ~~b.pop()
    sum = (temp % 10) + sum
    length--
  }
  return sum.replace(/^0+/, '')
}

/**
 * 解决丢失精度相关计算
 * @params {String | Number} a, b
 * wang
 * */
const getZero = (a, b) => {
  let zero = '',
    len = 0
  if (a > b) {
    len = a - b
  } else {
    len = b - a
  }
  for (let i = 0; i < len; i++) {
    zero += '0'
  }
  return zero
}
// 浮点数转换整数
const decimalToInteger = (a, b) => {
  let _a = a.toString(),
    _b = b.toString()
  if (!_a.match(/\./g) && !_b.match(/\./g)) {
    return {
      _a,
      _b,
      e: 1
    }
  } else {
    const al = _a.match(/\./g) ? _a.split('.')[1] : '',
      bl = _b.match(/\./g) ? _b.split('.')[1] : '',
      max = Math.max(al.length, bl.length),
      e = Math.pow(10, max)
    _b = _b.replace(/\./g, '')
    _a = _a.replace(/\./g, '')
    if (al.length > bl.length) {
      _b += getZero(al.length, bl.length)
    } else {
      _a += getZero(al.length, bl.length)
    }
    return {
      _a,
      _b,
      e
    }
  }
}
// 加
export const accuratelyAdd = (a, b) => {
  const { _a, _b, e } = decimalToInteger(a, b)
  return (Number(_a) + Number(_b)) / e
}
// 减
export const accuratelySubtract = (a, b) => {
  const { _a, _b, e } = decimalToInteger(a, b)
  return (Number(_a) - Number(_b)) / e
}
// 乘
export const accuratelyMultiply = (a, b) => {
  const { _a, _b, e } = decimalToInteger(a, b)
  return (Number(_a) * Number(_b)) / Math.pow(e, 2)
}
// 除以
export const accuratelyDivide = (a, b) => {
  const { _a, _b } = decimalToInteger(a, b)
  return (Number(_a) / Number(_b))
}

/**
 * 解决接口传参，number类型字段传空无效，清空 => 0
 * @params {Object} a需要处理传参的对象, b通过查询接口返回的初始值
 *
 * */
export function handleNullNumber(obj, backObject) {
  if (!obj || !backObject) return
  for (var key in obj) {
    if (typeof backObject[key] === 'number' && !obj[key]) {
      obj[key] = 0
    }
  }
}

/**
 * confirm多行信息提示虚拟dom
 * @params {String} message 提示信息
 * @params {String} flag 多行分割标识
 * */
export function rowsMessage(message, flag) {
  const confirmText = message.split(flag)
  const newDatas = []
  const h = vm.$createElement
  for (const i in confirmText) {
    newDatas.push(h('p', null, confirmText[i]))
  }
  return h('div', null, newDatas)
}

/**
 * 组合树形数据数组
 * @param data 平铺的所有树形数据
 * @param pid 父级id
 * @param child 子数据数组字段
 * @param id 子级id
 * @param childrenArray 接口返回的子级数据
 *
 * @return [tree, ...]
 * */
export function makeTree(data, pid, child, id, childrenArray) {
  const parents = data.filter(p => p[pid] === 0 || !p[pid])
  childrenArray.forEach(item => {
    makeLongList(item, item)
  })
  dataToTree(parents, childrenArray.map(i => i.longList || [i]).flat(1))
  return parents.filter(item => item[child])

  /**
   * 递归向上寻找每一个子级数据对应的父级数据，并将所有父级数据放进接口返回子级数据的longList字段
   * @param item1 接口返回的子级数据
   * @param item2 向上寻找的父级数据, 顶级父级除外，上面已经获取到顶级数据
   *
   * */
  function makeLongList(item1, item2) {
    if (data.find(p => p[id] === item2[pid]) && data.find(p => p[id] === item2[pid])[pid]) {
      if (item1.longList) {
        item1.longList.push(data.find(p => p[id] === item2[pid]))
      } else {
        const it = JSON.parse(JSON.stringify(item1))
        item1.longList = [it, data.find(p => p[id] === item2[pid])]
      }
      // 除去顶级数据
      data.find(p => p[id] === item2[pid])[pid] && makeLongList(item1, data.find(p => p[id] === item2[pid]))
    }
  }

  function dataToTree(parents, children) {
    parents.map(p => {
      children.map((c, i) => {
        if (c[pid] === p[id]) {
          const _children = JSON.parse(JSON.stringify(children))
          _children.splice(i, 1)
          dataToTree([c], _children)
          if (p[child]) {
            p[child].push(c)
          } else {
            p[child] = [c]
          }
          p[child] = unique(p[child], id)
        }
      })
    })
  }
}

/**
 *
 * @param {Array} arrs 树形数据
 * @param {string} childs 树形数据子数据的属性名,常用'children'
 * @param {Array} attrArr 需要提取的公共属性数组(默认是除了childs的全部属性)
 * @returns
 *
 * @author wang
 */
export function extractTree(arrs=[], childs, attrArr) {
  let attrList = []
  if (!Array.isArray(arrs) && !arrs.length) return []
  if (typeof childs !== 'string') return []
  if (!Array.isArray(attrArr) || Array.isArray(attrArr) && !attrArr.length) {
    attrList = arrs[0] && Object.keys(arrs[0]) || []
    attrList.splice(attrList.indexOf(childs), 1)
  } else {
    attrList = attrArr
  }
  const list = []
  const getObj = (arr) => {
    arr.forEach(function(row) {
      const obj = {}
      attrList.forEach(item => {
        obj[item] = row[item]
      })
      list.push(obj)
      if (row[childs]) {
        getObj(row[childs])
      }
    })
    return list
  }
  return getObj(arrs)
}

/**
 * 针对树形数据结构的级联选择器组件，后台数据返回最后一级数据（可能是id， 也可能是字符串及其组成的数组），
 * 封装处理方法，返回树形结构，根据不同场景，再二次处理获得所需数据
 *
 * @param list 级联选择器全部数据
 * @param flagAttr 字段标识，可能是id，也可能是字符串（商标案件详情中的【不予的案件类型】），如果是字符串，则需传入下面的 flagAttr2
 * @param values 接口最后一级数据数组
 * @param parentKey 树形数据中的父级id字段
 * @param childrenKey 父级的子数据数组
 * @param flagAttr2 当flagAttr为字符串，需要传入flagAttr2,该参数为对应数据的id，该id跟parentKey为父子级关系
 *
 * @return [treeData, ...]
 * */
export function findParentLevel(list, flagAttr, values, parentKey = 'parent', childrenKey = 'children', flagAttr2) {
  if (!list || !list.length || !flagAttr || !Array.isArray(values)) return []
  const longList = extractTree(list, childrenKey)
  values = values.map(value => longList.find(item => item[flagAttr] === value)).filter(Boolean)
  return makeTree(longList, parentKey, childrenKey, flagAttr2 || flagAttr, values)
}

/**
 * 处理一些字段 空 -> 0
 * @param obj 转换的对象
 * @param attrList 需要转换的属性，默认为全部
 * */
export function nullAttrChangeTo0(obj, attrList) {
  if (!attrList) {
    attrList = Object.keys(obj)
  }
  attrList.forEach(key => {
    if (obj[key] === null || obj[key] === '' || obj[key] === undefined) {
      obj[key] = 0
    }
  })
}

/**
 * 处理级联选择器禁止选中
 * @param arrs 级联选择器数据
 * @param childs 子级字段
 * @param disabledFlag 判断是否disabled标识
 * @return arrs
 * */
export function cascaderDisabled(arrs, childs, disabledFlag) {
  const disabled = (arr) => {
    arr.forEach((row) => {
      if (!row[disabledFlag]) {
        row.disabled = true
      }
      if (row[childs]) {
        disabled(row[childs])
      }
    })
    return arrs
  }
  return disabled(arrs)
}
/**
 * 判断是否在数字/英文字母/汉字及常用标点符号中的一项
 * @param {Object} val
 * @return {TypeName}
 */
export function isInputAll(str) {
  var strSource =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789,./\?;:'!<>{}[]+《》、-()&%*＇@。（）~ -：.·“”#";
  var ch;
  var i;
  var temp;
  var flag = true;
  var strs = "";
  if (str.length == 0) {
    flag = false;
  } else {
    for (i = 0; i <= str.length; i++) {
      ch = str.charAt(i);
      temp = strSource.indexOf(ch);
      if (ch != " " && temp == -1) {
        strs += ch;
      }
    }

    for (var i = 0; i < strs.length; i++) {
      if (strs.charCodeAt(i) <= 256) {
        flag = false;
      }
    }
  }
  return flag;
}

/**
 * 比较俩个对象之间的差异，项目中多处用到监听表单数据是否改动，故封装此方法
 * 如果数据改动，则返回新旧对象记录改动字段的新旧值
 *
 * by wang
 * */
export function diffObj(obj1, obj2) {
  function getTypeByObj (obj) {
    return Object.prototype.toString.call(obj).match(/^\[object ([a-zA-Z]*)\]$/)[1];
  }
  function isEmptyObject (obj) {
    for (let key in obj) {
      return false;
    };
    return true;
  }
  if (!obj1 || isEmptyObject(obj1) || !obj2 || isEmptyObject(obj2)) {
    return null;
  }
  let diffRes = {
    old_val: {},
    new_val: {}
  };
  for (let k in obj2) {
    // 判断数据类型是否一致
    if (getTypeByObj(obj2[k]) === getTypeByObj(obj1[k])) {
      // 比较 “Array”和“Object”类型
      if (getTypeByObj(obj2[k]) === 'Array' || getTypeByObj(obj2[k]) === 'Object') {
        const diffData = diffObj(obj1[k], obj2[k]);
        if (!isEmptyObject(diffData)) {
          diffRes.old_val[k] = diffData.old_val;
          diffRes.new_val[k] = diffData.new_val;
        }
      } else if (obj1[k] !== obj2[k]) { // 比较其他类型数据
        diffRes.old_val[k] = obj1[k];
        diffRes.new_val[k] = obj2[k];
      }
    } else {
      if ([undefined, null, ''].includes(obj1[k]) && [undefined, null, ''].includes(obj2[k])) {
        // 这三类数据可视为相等，不做处理
      }else {
        diffRes.old_val[k] = obj1[k];
        diffRes.new_val[k] = obj2[k];
      }
    }
  }
  // 若没有变化，返回null
  if (isEmptyObject(diffRes.old_val) || isEmptyObject(diffRes.new_val)) {
    return null;
  }
  return diffRes;
}

/**
 * 校验文件是否为图片类型
 *
 * */
export function checkImage(fileName) {
	const suffix = `(bmp|jpg|png|tif|gif|pcx|tga|exif|fpx|svg|psd|cdr|pcd|dxf|ufo|eps|ai|raw|WMF|webp|jpeg)`
	const regular = new RegExp(`.*\.${suffix}`)
	return regular.test(fileName)
}

/**
 * 检查手机、电话格式，规则跟网申系统一致
 *
 * */
export function yan_telMoble(val){
  const isMobile=/^(?:13\d|14\d|15\d|16\d|17\d|18\d|19\d|40\d)\d{5}(\d{3}|\*{3})$/;
  const isPhone=/^((0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/;
  if(isMobile.test(val) || isPhone.test(val)){
    return true;
  }else{
    return false;
  }
}
/**
 * 根据数字计算出司龄有几年几个月
 * @params {Number} decimalYears 年数
 * @params {String} n年n个月
 */
export function convertDecimalToYearsMonths(decimalYears) {
  // 将年份数乘以12得到月份数
  const totalMonths = Math.round(decimalYears * 12);
  // 使用整数除法得到完整的年份
  const years = Math.floor(totalMonths / 12);
  // 使用取模运算得到额外的月份
  const months = totalMonths % 12;
  const result = `${years > 0 ? `${years} 年 ` : ''}${months > 0 ? `${months} 个月` : ''}`;
  return result
}

/**
 * 根据几年几个月计算司龄，保留两位小数
 * @params {Number,Number} years 年数 months 月数
 * @return {String} 保留两位小数的年数
 */
export function convertAgeToDecimal(years = 0, months = 0) {
  const totalMonths = Number(years) * 12 + Number(months);
  const ageInYearsDecimal = totalMonths / 12;
  return ageInYearsDecimal.toFixed(2);
}

// 预览查看
export function preView(url) {
  if(['doc','docx'].includes(url.replace(/.+\./,"").toLocaleLowerCase())) {
    this.$commonUtils.viewPdf(`${url}`)
  }else if(['pdf','jpg','png'].some(item=>url.replace(/.+\./,"").toLocaleLowerCase()==item)) {
    window.open(`/ipdoc${url}`.replace(/[+]/g,'%2B'))
  } else {
    const downData = {
      url:`ipdoc${url}`,
    }
    this.$commonUtils.downLoadAll(downData)
  }
}

/**
 * 网申检查省、市、区
 *
 * */
export function fomat_qh(quhua = '') {
  let addr = quhua
  let reFlag = false
  if (addr.indexOf('(') > -1) {
    addr = addr.replace('(', '（')
  }
  if (addr.indexOf(')') > -1) {
    addr = addr.replace(')', '）')
  }
  const ary = new Array('北京市','天津市','河北省','山西省','内蒙古自治区','内蒙古省','辽宁省','吉林省','黑龙江省','上海市','江苏省','浙江省','安徽省','福建省','江西省','山东省','河南省','湖北省','湖南省','广东省','广西壮族自治区','广西省','海南省','重庆市','四川省','贵州省','云南省','西藏自治区','西藏省','陕西省','甘肃省','青海省','宁夏回族自治区',
    '宁夏省','新疆维吾尔自治区','新疆省','香港特别行政区','香港','中国香港','澳门特别行政区','中国澳门','澳门','台湾省','中国台湾','台湾','新疆生产建设兵团','中国（上海）自由贸易试验区','中国（广东）自由贸易试验区','中国（天津）自由贸易试验区','中国（福建）自由贸易试验区','中国（辽宁）自由贸易试验区','中国（浙江）自由贸易试验区','中国（河南）自由贸易试验区','中国（湖北）自由贸易试验区','中国（重庆）自由贸易试验区','中国（四川）自由贸易试验区','中国（陕西）自由贸易试验区',
    '中国（山东）自由贸易试验区','中国（江苏）自由贸易试验区','中国（广西）自由贸易试验区','中国（河北）自由贸易试验区','中国（云南）自由贸易试验区','中国（黑龙江）自由贸易试验区','中国（北京）自由贸易试验区','中国（湖南）自由贸易试验区','中国（安徽）自由贸易试验区','中国（海南）自由贸易试验区');
  for (let i = 0; i < ary.length; i++) {
    if (addr.substr(0, 13).indexOf(ary[i]) > -1) {
      reFlag = true
      break
    }
  }
  return reFlag
}

//防抖
export default function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
