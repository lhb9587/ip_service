import {Message, MessageBox} from 'element-ui'
function trawReducer(ctx) {
  // 检查是否选中
  function checkSeletedRows(isCheck = true) {
    if (ctx.$refs.trawList.getSelectedRows().length) {
      return ctx.$refs.trawList.getSelectedRows()
    } else {
      Message.error(`请选择草单！`)
      return false
    }
  }

  // 搜索
   function traw_search(...args) {
    let searchType = args[0],
      searchData = args[1] || {}
      ctx.$nextTick(() => {
        ctx.$refs.trawList['getList']({ searchType, searchData })
      })
   }

   // 修改
  function traw_edit() {
    checkSeletedRows() && ctx.$refs.trawList.editFun(checkSeletedRows()[0])
  }

  // 批量编辑
  function traw_pl_edit() {
    checkSeletedRows() && ctx.$refs.trawList.handleSelect('批量编辑')
  }

  // 删除
  function traw_delete() {
    checkSeletedRows() && ctx.$refs.trawList.handleSelect('删除')
  }

  return {
    traw_search,
    traw_edit,
    traw_pl_edit,
    traw_delete
  }
}

export default trawReducer
