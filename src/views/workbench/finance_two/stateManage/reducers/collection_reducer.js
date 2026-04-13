import {Message, MessageBox} from 'element-ui'
import {checkTasker} from '@/api/billApi'

function feeReducer(ctx) {
  // 检查是否选中
  function checkSeletedRows(isCheck = true) {
    if (ctx.$refs.collectionList.getSelectedRows().length) {
      return ctx.$refs.collectionList.getSelectedRows()
    } else {
      Message.error(`请选择收款！`)
      return false
    }
  }

  function collection_search(...args) {
    let searchType = args[0],
      searchData = args[1] || {}
    ctx.$refs.collectionList['handleSearch']({searchType, searchData})
  }

  // 清除搜索
  function collection_clear_search(...args) {
    let that = args[0]
    ctx.$refs.collectionList['clearSeach'](that)
  }

  // 新建
  function collection_create() {
    ctx.$refs.collectionList.createCollect()
  }

  // 修改
  function collection_edit() {
    if (checkSeletedRows()) {
      if (!checkSeletedRows()[0].flag) {
        Message.error(`该收款您无法更改！`)
      } else {
        ctx.$refs.collectionList.edit(checkSeletedRows()[0])
      }
    }
  }

  // 删除
  function collection_delete() {
    if (checkSeletedRows()) {
      if (checkSeletedRows().find(item => !item.flag)) {
        Message.error(`部分收款您无法更改！`)
      } else {
        ctx.$refs.collectionList.deletePays(checkSeletedRows())
      }
    }
  }

  // 提交
  function collection_submit() {
    ctx.$refs.collectionList.doPaymentTask(1)
  }

  // 结账
  function collection_check() {
    ctx.$refs.collectionList.doPaymentTask(2)
  }

  // 改签
  function collection_rebook(...args) {
    if (args[0].rightKeySign) {
      if (!args[0].taskId) {
        Message.error(`该收款您无法改签！`)
      } else {
        checkTasker({taskIdList: args[0].taskId}).then(res => {
          ctx.$data.dialogRebookVisible = true
          ctx.$nextTick(() => {
            ctx.$refs.rebook.$data.taskIdList = args[0].taskId
            ctx.$refs.rebook.$data.payIds = String(args[0].payId)
            ctx.$refs.rebook.$data.payDetailIds = String(args[0].payDetailId)
          })
        })
      }
    } else {
      if (checkSeletedRows()) {
        if (checkSeletedRows().map(item => item.taskId).filter(item => !item).length) {
          Message.error(`存在 [${checkSeletedRows().map(item => item.taskId).filter(item => !item).length}] 张收款无法改签`)
        } else {
          checkTasker({taskIdList: checkSeletedRows().map(item => item.taskId)}).then(res => {
            ctx.$data.dialogRebookVisible = true
            ctx.$nextTick(() => {
              ctx.$refs.rebook.$data.taskIdList = checkSeletedRows().map(item => item.taskId)
              ctx.$refs.rebook.$data.payIds = checkSeletedRows().map(item => item.payId) + ''
              ctx.$refs.rebook.$data.payDetailIds = checkSeletedRows().map(item => item.payDetailId) + ''
            })
          })
        }
      }
    }

  }

  return {
    collection_search,
    collection_clear_search,
    collection_create,
    collection_edit,
    collection_delete,
    collection_submit,
    collection_check,
    collection_rebook
  }
}

export default feeReducer
