import { Message } from 'element-ui'

function invoiceLibraryReducer(ctx) {
  function checkSeletedRows(isCheck = true) {
    if (ctx.$refs.invoiceLibraryList.getSelectedRows().length) {
      return ctx.$refs.invoiceLibraryList.getSelectedRows()
    } else {
      Message.error(`请选择发票！`)
      return false
    }
  }

  // 创建
  function invoice_library_create() {
    ctx.$refs.invoiceLibraryList['libraryCreate']()
  }

  // 分批处理
  function invoice_library_batch_process() {
    ctx.$refs.invoiceLibraryList['libraryBatchProcess']()
  }
  // 撤回处理
  function invoice_library_withdraw() {
    ctx.$refs.invoiceLibraryList['libraryWithdraw']()
  }

  // 批量修改发票所属人
  function invoice_library_batch_people() {
    ctx.$refs.invoiceLibraryList['libraryBatchPeople']()
  }

  // 发票余额清零
  function invoice_library_zeroing() {
    ctx.$refs.invoiceLibraryList['libraryBatchZeroing']()
  }

  // 修改
  function invoice_library_edit() {
    checkSeletedRows() && ctx.$refs.invoiceLibraryList['libraryEdit'](checkSeletedRows()[0])
  }

  // 删除
  function invoice_library_delete() {
    checkSeletedRows() && ctx.$refs.invoiceLibraryList['libraryDelete'](checkSeletedRows())
  }

  // 搜索
  function invoice_library_search(...args) {
    let searchType = args[0],
        searchData = args[1] || {}
    ctx.$refs.invoiceLibraryList['handleSearch']({ searchType, searchData })
  }
  // 清空搜索
  function invoice_library_clear_search(...args) {
    let that = args[0]
    ctx.$refs.invoiceLibraryList['clearSearch'](that)
  }
  return {
    invoice_library_create,
    invoice_library_batch_process,
    invoice_library_batch_people,
    invoice_library_zeroing,
    invoice_library_edit,
    invoice_library_delete,
    invoice_library_search,
    invoice_library_clear_search,
    invoice_library_withdraw
  }
}

export default invoiceLibraryReducer
