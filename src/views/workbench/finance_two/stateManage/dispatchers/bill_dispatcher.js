import reducer from '../reducers'
import Actions from '../actions'

function billDispatcher(type, ctx, ...args) {
  const {
    bill_create,
    bill_edit,
    bill_edit_remark,
    bill_create_invoice,
    bill_delete,
    bill_search,
    bill_clear_search,
    bill_submit,
    bill_headman_audit,
    bill_job_audit,
    bill_audit,
    bill_undertake,
    bill_reconfirm,
    bill_edit_date,
    bill_subillno,
    bill_balance,
    rebook,
    bill_bad_bill,
    bill_out_bill,
    bill_export_model,
    bill_collection,
    bill_download
  } = reducer(ctx);
  switch (type) {
    case Actions.BILL_CREATE:
      bill_create()
      break;
    case Actions.BILL_EDIT:
      bill_edit()
      break;
    case Actions.BILL_EDIT_REMARK:
      bill_edit_remark()
      break;
    case Actions.BILL_CREATE_INVOICE:
      bill_create_invoice();
      break;
    case Actions.BILL_DELETE:
      bill_delete();
      break;
    case Actions.BILL_SEARCH:
      bill_search(...args);
      break;
    case Actions.BILL_CLEAR_SEARCH:
      bill_clear_search(...args);
      break;
    case Actions.BILL_SUBMIT:
      bill_submit();
      break;
    case Actions.BILL_HEADMAN_AUDIT:
      bill_headman_audit();
      break;
    case Actions.BILL_JOB_AUDIT:
      bill_job_audit();
      break;
    case Actions.BILL_AUDIT:
      bill_audit();
      break;
    case Actions.BILL_UNDERTAKE:
      bill_undertake();
      break;
    case Actions.BILL_RECONFIRM:
      bill_reconfirm();
      break;
    case Actions.BILL_EDIT_DATE:
      bill_edit_date();
      break;
    case Actions.BILL_SUMBILLNO:
      bill_subillno();
      break;
    case Actions.BILL_BALANCE:
      bill_balance();
      break;
    case Actions.BILL_REBOOK:
      rebook();
      break;
    case Actions.BILL_BADBILL:
      bill_bad_bill();
      break;
    case Actions.BILL_OUTBILL:
      bill_out_bill();
      break;
    case Actions.BILL_EXPORT_MODEL:
      bill_export_model(...args);
      break;
    case Actions.BILL_COLLECTION:
      bill_collection();
      break;
    case Actions.BILL_DOWNLOAD:
      bill_download()
      break
    default:
      break;
  }

}
export default billDispatcher
