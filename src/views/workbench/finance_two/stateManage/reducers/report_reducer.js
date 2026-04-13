import { Message } from 'element-ui'

function reportReducer(ctx) {
  function handleEvents(type, val, nocheck) {
    if(val !== undefined){
      ctx.$refs.reportList[type](val)
    }else{
      if(nocheck){
        ctx.$refs.reportList[type]()
      }else{
       ctx.$refs.reportList.getSelectedRows().length
      ? ctx.$refs.reportList[type](ctx.$refs.reportList.getSelectedRows()[0])
      : Message.error(`请选择报表！`)
      }
    }
  }
  // 新建
  function report_create() {
    handleEvents('create',false,true)
  }
  // 修改
  function report_edit() {
    handleEvents('edit')
  }
  // 删除
  function report_delete() {
    if (ctx.$refs.reportList.getSelectedRows().length > 1) {
      Message.error(`报表不支持多条删除，请重新选择！`)
      return
    }
    handleEvents('delete')
  }
  // 导出
  function report_export() {
    handleEvents('export',false,true)
  }
  // 报表管理，锁定
  function report_lock() {
    handleEvents('lock',false,true)
  }
  // 搜索
  function report_search(...args) {
    let searchType = args[0],
        searchData = args[1] || {}
    handleEvents('handleSearch', {searchType,searchData}, true)
  }
  return {
    report_create,
    report_edit,
    report_delete,
    report_search,
    report_export,
    report_lock
  }
}

export default reportReducer
