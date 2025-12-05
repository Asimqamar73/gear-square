import React from "react";
import { getStatusDot, paymentStatuses } from "../../../utils/paymentHelpers";

interface InvoiceSummaryProps {
  totalBill: number;
  laborCost: number;
  vatAmount: number;
  afterVAT: number;
  discount: number;
  amountPaid: number;
  remainingBalance: number;
  finalTotal: number;
  paymentStatus: number;
  setDiscount: React.Dispatch<React.SetStateAction<number>>;
  handleAmountPaidChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InvoiceSummary: React.FC<InvoiceSummaryProps> = ({
  totalBill,
  laborCost,
  vatAmount,
  afterVAT,
  discount,
  amountPaid,
  remainingBalance,
  finalTotal,
  paymentStatus,
  setDiscount,
  handleAmountPaidChange,
}) => {
  return (
    <div className="w-full max-w-md bg-white rounded-lg border border-gray-200 shadow-sm p-6 mt-6 ml-auto">
      <div className="flex items-center justify-between gap-2 mb-5 pb-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">Invoice Summary</h2>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${paymentStatuses[paymentStatus].color}`}
        >
            
          {getStatusDot(paymentStatus as any)}
          {paymentStatuses[paymentStatus].label}
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Products Subtotal</span>
          <span className="font-medium text-gray-900">{totalBill.toFixed(2)} AED</span>
        </div>

        <div className="flex justify-between text-sm pt-2 border-gray-200">
          <span className="text-gray-600 font-medium">Service Labor Cost</span>
          <span className="font-medium text-gray-900">{laborCost.toFixed(2)} AED</span>
        </div>

        <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
          <span className="text-gray-600 font-medium">Subtotal</span>
          <span className="font-medium text-gray-900">{(totalBill + laborCost).toFixed(2)} AED</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">VAT (5%)</span>
          <span className="font-medium text-gray-900">{vatAmount.toFixed(2)} AED</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">After VAT</span>
          <span className="font-medium text-gray-900">{afterVAT.toFixed(2)} AED</span>
        </div>

        <div className="space-y-2">
          <label htmlFor="discount" className="text-sm font-medium text-gray-700 flex justify-between">
            <span>Discount</span>
          </label>
          <input
            type="number"
            id="discount"
            min="0"
            max="100"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            placeholder="0"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="amountPaid" className="text-sm font-medium text-gray-700">
            Amount Paid
          </label>
          <input
            type="number"
            id="amountPaid"
            min="0"
            step="0.01"
            value={amountPaid}
            onChange={handleAmountPaidChange}
            placeholder="0.00"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
          />
        </div>

        <div className="pt-4 border-t border-gray-500 space-y-2">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-900">Total</span>
            <span className="text-xl font-bold text-gray-900">{finalTotal.toFixed(2)} AED</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Remaining Balance</span>
            <span className={`font-semibold ${remainingBalance > 0 ? "text-red-600" : "text-green-600"}`}>
              {remainingBalance.toFixed(2)} AED
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSummary;
