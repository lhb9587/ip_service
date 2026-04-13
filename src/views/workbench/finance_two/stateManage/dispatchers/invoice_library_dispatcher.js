import reducer from '../reducers'
import Actions from '../actions'

function invoiceLibraryDispatcher(type, ctx, ...args) {
  const {
    // 发票库
    invoice_library_create,
    invoice_library_batch_process,
    invoice_library_batch_people,
    invoice_library_zeroing,
    invoice_library_edit,
    invoice_library_delete,
    invoice_library_search,
    invoice_library_clear_search,
    invoice_library_withdraw

  } = reducer(ctx);
  switch (type) {
    case Actions.INVOICE_LIBRARY_CREATE:
      invoice_library_create()
      break;
    case Actions.INVOICE_LIBRARY_BATCH_PROCESS:
      invoice_library_batch_process()
      break;
    case Actions.INVOICE_LIBRARY_BATCH_PEOPLE:
      invoice_library_batch_people()
      break;
    case Actions.INVOICE_LIBRARY_ZEROING:
      invoice_library_zeroing()
      break;
    case Actions.INVOICE_LIBRARY_EDIT:
      invoice_library_edit()
      break;
    case Actions.INVOICE_LIBRARY_DELETE:
      invoice_library_delete()
      break;
    case Actions.INVOICE_LIBRARY_SEARCH:
      invoice_library_search(...args);
      break;
    case Actions.INVOICE_LIBRARY_CLEAR_SEARCH:
      invoice_library_clear_search(...args);
      break;
    case Actions.INVOICE_LIBRARY_WITHDRAW:
      invoice_library_withdraw()
      break;
    default:
      break;
  }

}
export default invoiceLibraryDispatcher
