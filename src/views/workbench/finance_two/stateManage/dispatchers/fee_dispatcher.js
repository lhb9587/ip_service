import reducer from '../reducers'
import Actions from '../actions'

function feeDispatcher(type, ctx, ...args) {
  const {
    fee_see,
    fee_edit,
    fee_delete,
    fee_submit,
    fee_group_audit,
    fee_assumejob_audit,
    fee_first_audit,
    fee_second_audit,
    fee_pay,
    fee_rebook,
    fee_belong_month,
    fee_pay_style,
    fee_verification_status,
    fee_invoice_remind,
    fee_search,
    fee_clear_search,
    fee_create,
    fee_copy,
    fee_detail_pl_edit,
    fee_export_model,
    fee_add_rule,
    fee_add_audit,
    fee_user_audit,
  } = reducer(ctx);
  switch (type) {
    case Actions.FEE_SEE:
      fee_see(...args);
      break;
    case Actions.FEE_EDIT:
      fee_edit(...args);
      break;
    case Actions.FEE_DELETE:
      fee_delete();
      break;
    case Actions.FEE_SUBMIT:
      fee_submit(...args);
      break;
    case Actions.FEE_GROUPAUDIT:
      fee_group_audit(...args);
      break;
    case Actions.FEE_ASSUMEJOB_AUDIT:
      fee_assumejob_audit(...args);
      break;
    case Actions.FEE_FIRSTAUDIT:
      fee_first_audit(...args);
      break;
    case Actions.FEE_SECONDAUDIT:
      fee_second_audit();
      break;
    case Actions.FEE_PAY:
      fee_pay();
      break;
    case Actions.FEE_REBOOK:
      fee_rebook(...args);
      break;
    case Actions.FEE_BELONG_MONTH:
      fee_belong_month();
      break;
    case Actions.FEE_PAY_STYLE:
      fee_pay_style();
      break;
    case Actions.FEE_VERIFICATION_STATUS:
      fee_verification_status();
      break;
    case Actions.FEE_INVOICE_REMIND:
      fee_invoice_remind();
      break;
    case Actions.FEE_SEARCH:
      fee_search(...args);
      break;
    case Actions.FEE_CLEAR_SEARCH:
      fee_clear_search(...args);
      break;
    case Actions.FEE_CREATE:
      fee_create();
      break;
    case Actions.FEE_COPY:
      fee_copy();
      break;
    case Actions.FEE_DETAIL_PL_EDIT:
      fee_detail_pl_edit();
      break;
    case Actions.FEE_EXPORT_MODEL:
      fee_export_model();
      break;
    case Actions.FEE_ADD_RULE:
      fee_add_rule(...args);
      break;
    case Actions.FEE_ADD_AUDIT:
      fee_add_audit(...args);
      break;
    case Actions.FEE_USER_AUDIT:
      fee_user_audit(...args);
      break;
    default:
      break;
  }
}
export default feeDispatcher
