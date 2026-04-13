import billAction from './bill_action'
import feeAction from './fee_actions'
import borrowAction from './borrow_action'
import invoiceOpenerAction from './invoice_opener_action'
import invoiceBorrowAction from './invoice_borrow_action'
import invoiceLibraryAction from './invoice_library_action'
import reportAction from './report_action'
import reportAccountAction from './report_account_action'
import reportCompanyAction from './report_company_action'
import reportManageAction from './report_manage_action'
import collectionAction from './collection_action';
import statementAction from "./statement_action";
import patentAction from "./patent_action";
import outPriceAction from "./out_price_action";
import outBillAction from "./out_bill_action";
import insideBillAction from "./inside_bill_action";
import trawAction from "./traw_action";
import exchangeAction from "@/views/workbench/finance_two/stateManage/actions/exchange_rate_actions";
const Actions = {
  ...billAction,
  ...feeAction,
  ...borrowAction,
  ...invoiceOpenerAction,
  ...invoiceBorrowAction,
  ...invoiceLibraryAction,
  ...reportAction,
  ...reportAccountAction,
  ...reportCompanyAction,
  ...reportManageAction,
  ...collectionAction,
  ...statementAction,
  ...patentAction,
  ...outPriceAction,
  ...outBillAction,
  ...insideBillAction,
  ...trawAction,
  ...exchangeAction
}

export default Actions
