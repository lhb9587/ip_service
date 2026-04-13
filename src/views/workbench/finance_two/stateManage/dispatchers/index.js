import billDispatcher from './bill_dispatcher'
import feeDispatcher from './fee_dispatcher'
import borrowDispatcher from './borrow_dispatcher'
import invoiceOpenerDispatcher from './invoice_opener_dispatcher'
import invoiceBorrowDispatcher from './invoice_borrow_dispatcher'
import invoiceLibraryDispatcher from './invoice_library_dispatcher'
import reportDispatcher from './report_dispatcher'
import reportAccountDispatcher from './report_account_dispatcher'
import reportCompanyDispatcher from './report_company_dispatcher'
import reportManageDispatcher from './report_manage_dispatcher'
import collectionDispatcher from "./collection_dispatcher";
import statementDispatcher from "./statement_dispatcher";
import patentDispatcher from "./patent_dispatcher";
import outPriceDispatcher from "./out_price_dispatcher";
import outBillDispatcher from "./out_bill_dispatcher";
import insideBillDispatcher from "./inside_bill_dispatcher";
import trawDispatcher from "./traw_dispatcher";
import exchangeRateDispatcher from "@/views/workbench/finance_two/stateManage/dispatchers/exchange_rate_dispatcher";

export default (ctx) => {
  return function (type, ...args) {
    billDispatcher(type, ctx, ...args)
    feeDispatcher(type, ctx, ...args)
    borrowDispatcher(type, ctx, ...args)
    invoiceOpenerDispatcher(type, ctx, ...args)
    invoiceBorrowDispatcher(type, ctx, ...args)
    invoiceLibraryDispatcher(type, ctx, ...args)
    reportDispatcher(type, ctx, ...args)
    reportAccountDispatcher(type, ctx, ...args)
    reportCompanyDispatcher(type, ctx, ...args)
    reportManageDispatcher(type, ctx, ...args)
    collectionDispatcher(type, ctx, ...args)
    statementDispatcher(type, ctx, ...args)
    patentDispatcher(type, ctx, ...args)
    outPriceDispatcher(type, ctx, ...args)
    outBillDispatcher(type, ctx, ...args)
    insideBillDispatcher(type, ctx, ...args)
    trawDispatcher(type, ctx, ...args)
    exchangeRateDispatcher(type, ctx, ...args)
  }
}
