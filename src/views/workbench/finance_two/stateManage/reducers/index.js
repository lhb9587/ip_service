import billReducer from './bill_reducer'
import feeReducer from './fee_reducer'
import borrowReducer from './borrow_reducer'
import invoiceOpenerReducer from './invoice_opener_reducer'
import invoiceBorrowReducer from './invoice_borrow_reducer'
import invoiceLibraryReducer from './invoice_library_reducer'
import reportReducer from './report_reducer'
import reportAccountReducer from './report_account_reducer'
import reportCompanyReducer from './report_company_reducer'
import reportManageReducer from './report_manage_reducer'
import statementReducer from './statement_reducer'
import collectionReducer from './collection_reducer'
import patentReducer from "./patent_reducer";
import outPriceReducer from "./out_price_reducer";
import outBillReducer from "./out_bill_reducer";
import insideBillReducer from "./inside_bill_reducer"
import trawReducer from "./traw_reducer";
import exchange_rate_reducer from "@/views/workbench/finance_two/stateManage/reducers/exchange_rate_reducer";
function reducer(ctx) {
  return {
    ...billReducer(ctx),
    ...feeReducer(ctx),
    ...borrowReducer(ctx),
    ...invoiceOpenerReducer(ctx),
    ...invoiceBorrowReducer(ctx),
    ...invoiceLibraryReducer(ctx),
    ...reportReducer(ctx),
    ...reportAccountReducer(ctx),
    ...reportCompanyReducer(ctx),
    ...reportManageReducer(ctx),
    ...collectionReducer(ctx),
    ...statementReducer(ctx),
    ...patentReducer(ctx),
    ...outPriceReducer(ctx),
    ...outBillReducer(ctx),
    ...insideBillReducer(ctx),
    ...trawReducer(ctx),
    ...exchange_rate_reducer(ctx)
  }
}

export default reducer
