import {Message} from "element-ui";

function exchangeRateReducer(ctx) {
  function checkSelected() {
    if (ctx.$refs.rateList.getSelectedRows().length) {
      return ctx.$refs.rateList.getSelectedRows()
    } else {
      Message.error(`请选择汇率！`)
      return false
    }
  }
  function exchange_rate_search(...args) {
    ctx.$nextTick(() => {
      let searchType = args[0],
        searchData = args[1] || {}
      ctx.$refs.rateList.queryList({searchType, searchData})
    })
  }

  function exchange_rate_create() {
    ctx.$refs.rateList.createRate()
  }
  function exchange_rate_edit() {
    checkSelected() && ctx.$refs.rateList.edit(checkSelected()[0])
  }

  return {
    exchange_rate_search,
    exchange_rate_create,
    exchange_rate_edit
  }
}

export default exchangeRateReducer
