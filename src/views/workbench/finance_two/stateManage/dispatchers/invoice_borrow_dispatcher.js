import reducer from '../reducers'
import Actions from '../actions'

function invoiceBorrowDispatcher(type, ctx, ...args) {
  const {
    // 入账发票外借
    invoice_borrow_create,
    invoice_borrow_edit,
    invoice_borrow_delete,
    invoice_borrow_submit,
    invoice_borrow_audit,
    invoice_borrow_debtor,
    invoice_borrow_rebook,
    invoice_borrow_search,
    invoice_borrow_clear_search,
    invoice_time_delay,

  } = reducer(ctx);
  switch (type) {
    case Actions.INVOICE_BORROW_CREATE:
      invoice_borrow_create()
      break;
    case Actions.INVOICE_BORROW_EDIT:
      invoice_borrow_edit()
      break;
    case Actions.INVOICE_BORROW_DELETE:
      invoice_borrow_delete();
      break;
    case Actions.INVOICE_BORROW_SUBMIT:
      invoice_borrow_submit();
      break;
    case Actions.INVOICE_BORROW_AUDIT:
      invoice_borrow_audit();
      break;
    case Actions.INVOICE_BORROW_DEBTOR:
      invoice_borrow_debtor();
      break;
    case Actions.INVOICE_BORROW_REBOOK:
      invoice_borrow_rebook(...args);
      break;
    case Actions.INVOICE_BORROW_SEARCH:
      invoice_borrow_search(...args);
      break;
    case Actions.INVOICE_BORROW_CLEAR_SEARCH:
      invoice_borrow_clear_search(...args);
      break;
    case Actions.INVOICE_TIME_DELAY:
      invoice_time_delay(...args);
      break;
    default:
      break;
  }

}
export default invoiceBorrowDispatcher
