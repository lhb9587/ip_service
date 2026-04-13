import { Message } from 'element-ui'

function reportCompanyReducer(ctx) {
  function handleEvents(type, val, nocheck) {
    if(val !== undefined){
      ctx.$refs.companyList[type](val)
    }else{
      if(nocheck){
        ctx.$refs.companyList[type]()
      }else{
       ctx.$refs.companyList.getSelectedRows().length
      ? ctx.$refs.companyList[type](ctx.$refs.companyList.getSelectedRows()[0])
      : Message.error(`请选择公司数据！`)
      }
    }
  }
  // 新建
  function report_company_create() {
    handleEvents('create',false,true)
  }
  // 修改
  function report_company_edit() {
    handleEvents('edit')
  }
  // 删除
  function report_company_delete() {
    if (ctx.$refs.companyList.getSelectedRows().length > 1) {
      Message.error(`不支持多条删除，请重新选择！`)
      return
    }
    handleEvents('delete')
  }
  return {
    report_company_create,
    report_company_edit,
    report_company_delete
  }
}

export default reportCompanyReducer
