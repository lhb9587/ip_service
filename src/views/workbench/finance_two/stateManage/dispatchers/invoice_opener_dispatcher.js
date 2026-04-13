import reducer from '../reducers'
import Actions from '../actions'

function invoiceOpenerDispatcher(type, ctx, ...args) {
  const {
    // 开具发票
    invoice_opener_create,
    invoice_opener_edit,
    invoice_opener_delete,
    invoice_opener_submit,
    invoice_opener_audit,
    invoice_opener,
    invoice_opener_rebook,
    invoice_opener_search,
    invoice_opener_clear_search,
    invoice_opener_date,
    invoice_opener_tax_amount,
    invoice_upload
  } = reducer(ctx);
  switch (type) {
    case Actions.INVOICE_OPENER_CREATE:
      invoice_opener_create()
      break;
    case Actions.INVOICE_OPENER_EDIT:
      invoice_opener_edit()
      break;
    case Actions.INVOICE_OPENER_DELETE:
      invoice_opener_delete();
      break;
    case Actions.INVOICE_OPENER_SUBMIT:
      invoice_opener_submit();
      break;
    case Actions.INVOICE_OPENER_AUDIT:
      invoice_opener_audit();
      break;
    case Actions.INVOICE_OPENER:
      invoice_opener();
      break;
    case Actions.INVOICE_OPENER_REBOOK:
      invoice_opener_rebook(...args);
      break;
    case Actions.INVOICE_OPENER_SEARCH:
      invoice_opener_search(...args);
      break;
    case Actions.INVOICE_OPENER_CLEAR_SEARCH:
      invoice_opener_clear_search(...args);
      break;
    case Actions.INVOICE_OPENER_DATE:
      invoice_opener_date()
      break;
    case Actions.INVOICE_OPENER_TAX_AMOUNT:
      invoice_opener_tax_amount()
      break
    case Actions.UPLOAD_INVOICE:
      invoice_upload()
      // invoice_opener_tax_amount()
      break
    default:
      break;
  }

}
export default invoiceOpenerDispatcher
