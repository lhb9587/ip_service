import { Message } from 'element-ui'

function reportAccountReducer(ctx) {
  function handleEvents(type, val, nocheck) {
    if(val !== undefined){
      ctx.$refs.accountList[type](val)
    }else{
      if(nocheck){
        ctx.$refs.accountList[type]()
      }else{
       ctx.$refs.accountList.getSelectedRows().length
      ? ctx.$refs.accountList[type](ctx.$refs.accountList.getSelectedRows()[0])
      : Message.error(`请选择账户数据！`)
      }
    }
  }
  // 新建
  function report_account_create() {
    handleEvents('create',false,true)
  }
  // 修改
  function report_account_edit() {
    handleEvents('edit')
  }
  // 删除
  function report_account_delete() {
    if (ctx.$refs.accountList.getSelectedRows().length > 1) {
      Message.error(`不支持多条删除，请重新选择！`)
      return
    }
    handleEvents('delete')
  }
  // 搜索
  function report_account_search(...args) {
    let searchType = args[0],
        searchData = args[1] || {}
    handleEvents('handleSearch', {searchType,searchData}, true)
  }
  return {
    report_account_create,
    report_account_edit,
    report_account_delete,
    report_account_search
  }
}

export default reportAccountReducer
