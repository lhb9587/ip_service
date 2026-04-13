import reducer from '../reducers'
import Actions from '../actions'

function exchangeRateDispatcher(type, ctx, ...args) {
  const {
    exchange_rate_search,
    exchange_rate_create,
    exchange_rate_edit
  } = reducer(ctx)
  switch (type) {
    case Actions.EXCHANGE_RATE_SEARCH:
      exchange_rate_search(...args)
      break
    case Actions.EXCHANGE_RATE_CREATE:
      exchange_rate_create()
      break
    case Actions.EXCHANGE_RATE_EDIT:
      exchange_rate_edit()
      break
    default:
      break
  }
}
export default exchangeRateDispatcher
