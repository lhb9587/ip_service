import { Message } from 'element-ui'

function reportManageReducer(ctx) {
  function handleEvents(type, val, nocheck) {
    if(val !== undefined){
      ctx.$refs.manageList[type](val)
    }else{
      if(nocheck){
        ctx.$refs.manageList[type]()
      }else{
       ctx.$refs.manageList.getSelectedRows().length
      ? ctx.$refs.manageList[type](ctx.$refs.manageList.getSelectedRows()[0])
      : Message.error(`请选择报表记录！`)
      }
    }
  }
  // 新建
  function report_manage_create() {
    handleEvents('create',false,true)
  }
  // 修改
  function report_manage_edit() {
    handleEvents('edit')
  }
  // 删除
  function report_manage_delete() {
    if (ctx.$refs.manageList.getSelectedRows().length > 1) {
      Message.error(`不支持多条删除，请重新选择！`)
      return
    }
    handleEvents('delete')
  }
  // 搜索
  function report_manage_search(...args) {
    let searchType = args[0],
        searchData = args[1] || {}
    handleEvents('handleSearch', {searchType,searchData}, true)
  }
  return {
    report_manage_create,
    report_manage_edit,
    report_manage_delete,
    report_manage_search
  }
}

export default reportManageReducer
