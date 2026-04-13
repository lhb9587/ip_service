import reducer from '../reducers'
import Actions from '../actions'

function borrowDispatcher(type, ctx, ...args) {
  const {
    // 入账发票外借
    borrow_create,
    borrow_edit,
    borrow_delete,
    borrow_submit,
    borrow_audit,
    borrow_pay,
    borrow_repay,
    borrow_rebook,
    borrow_search,
    borrow_clear_search

  } = reducer(ctx);
  switch (type) {
    case Actions.BORROW_CREATE:
      borrow_create()
      break;
    case Actions.BORROW_EDIT:
      borrow_edit()
      break;
    case Actions.BORROW_DELETE:
      borrow_delete();
      break;
    case Actions.BORROW_SUBMIT:
      borrow_submit();
      break;
    case Actions.BORROW_AUDIT:
      borrow_audit()
      break;
    case Actions.BORROW_PAY:
      borrow_pay()
      break;
    case Actions.BORROW_REPAY:
      borrow_repay()
      break;
    case Actions.BORROW_REBOOK:
      borrow_rebook(...args)
      break;
    case Actions.BORROW_SEARCH:
      borrow_search(...args);
      break;
    case Actions.BORROW_CLEAR_SEARCH:
      borrow_clear_search(...args);
      break;
    default:
      break;
  }

}
export default borrowDispatcher
