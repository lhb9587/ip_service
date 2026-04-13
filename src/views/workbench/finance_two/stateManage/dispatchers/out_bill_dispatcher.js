import reducer from '../reducers'
import Actions from '../actions'

function outBillDispatcher(type, ctx, ...args) {
  const {
    out_bill_search,
    out_bill_create,
    out_bill_submit,
    out_bill_first_audit,
    out_bill_pay,
    out_bill_second_audit,
    out_bill_batch_pay,
    out_bill_edit,
    out_bill_del,
    out_bill_clear_search,
    out_bill_pl_edit,
    out_bill_export_model,
    out_bill_create_fee,
    out_bill_rebook,
    out_bill_upload,
    out_bill_download,
    out_bill_patchimport,
  } = reducer(ctx);
  switch (type) {
    case Actions.OUTBILL_SEARCH:
      out_bill_search(...args);
      break;
    case Actions.OUTBILL_CREATE:
      out_bill_create();
      break;
    case Actions.OUTBILL_SUBMIT:
      out_bill_submit();
      break;
    case Actions.OUTBILL_FIRSTAUDIT:
      out_bill_first_audit();
      break;
    case Actions.OUTBILL_PAY:
      out_bill_pay();
      break;
    case Actions.OUTBILL_SECONDAUDIT:
      out_bill_second_audit();
      break;
    case Actions.OUTBILL_BATCH_PAY:
      out_bill_batch_pay();
      break;
    case Actions.OUTBILL_EDIT:
      out_bill_edit();
      break;
    case Actions.OUTBILL_DEL:
      out_bill_del();
      break;
    case Actions.OUTBILL_CLEAR_SEARCH:
      out_bill_clear_search(...args);
      break;
    case Actions.OUTBILL_PL_EDIT:
      out_bill_pl_edit();
      break;
    case Actions.OUTBILL_EXPORT_MODEL:
      out_bill_export_model();
      break;
    case Actions.OUTBILL_CREATE_FEE:
      out_bill_create_fee();
      break;
    case Actions.OUTBILL_REBOOK:
      out_bill_rebook(...args);
      break;
    case Actions.UPLOAD_BILL:
      out_bill_upload(...args);
      break;
    case Actions.DOWNLOAD_BILL:
      out_bill_download(...args);
      break;
    case Actions.OUTBILL_PATCHIMPORT:
      out_bill_patchimport(...args);
      break;
    default:
      break;
  }

}
export default outBillDispatcher
