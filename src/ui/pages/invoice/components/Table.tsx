import { Eye, FileText, Phone, Building2, Car, Hash } from "lucide-react";
import { useState } from "react";
import { dateFormatter } from "../../../utils/DateFormatter";
import { useNavigate } from "react-router-dom";
import { getStatusDot, paymentStatuses } from "../../../utils/paymentHelpers";

interface Invoice {
  invoice_id: string | number;
  vehicle_id: string | number;
  vehicle_number: string;
  chassis_number: string;
  name: string;
  phone_number: string;
  company_name?: string;
  company_phone_number?: string;
  created_at: string;
  bill_status: 0 | 1 | 2 | 3;
  total: number;
  amount_paid: number;
  amount_due: number;
}

interface InvoiceTableProps {
  data: Invoice[];
  onViewInvoice: (invoiceId: string | number) => void;
}

const InvoiceTable = ({ data, onViewInvoice }: InvoiceTableProps) => {
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);
  const navigate = useNavigate();

  const hasData = data && data.length > 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-full">
          {!hasData && (
            <caption className="py-8 text-center">
              <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No invoices found</p>
              <p className="text-gray-400 text-sm mt-1">Invoices will appear here once created</p>
            </caption>
          )}

          {hasData && (
            <>
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-200 border-b border-gray-200">
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      Invoice
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4" />
                      Vehicle Info
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Customer Details
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Company
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.map((invoice) => (
                  <tr
                    key={invoice.invoice_id}
                    className="border-b border-gray-100 hover:bg-blue-50/30 transition-all duration-150"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-600">#{invoice.invoice_id}</span>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => navigate(`/vehicle-details/${invoice.vehicle_id}`)}
                          className="text-blue-600 font-semibold hover:text-blue-700 hover:underline text-left transition-colors inline-flex items-center gap-1 w-fit"
                        >
                          {invoice.vehicle_number}
                        </button>
                        {invoice.chassis_number && (
                          <span className="text-xs text-gray-500">
                            Chassis: {invoice.chassis_number}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-gray-900">{invoice.name}</span>
                        {invoice.phone_number ? (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Phone className="w-3 h-3" />
                            {invoice.phone_number}
                          </div>
                        ) : (
                          <span className="italic text-sm text-gray-500">
                            {"No customer details added"}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      {invoice.company_name ? (
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium text-gray-900">
                            {invoice.company_name}
                          </span>
                          {invoice.company_phone_number && (
                            <span className="text-xs text-gray-500">
                              {invoice.company_phone_number}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm italic">No company</span>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-900">
                        {dateFormatter(invoice.created_at)}
                      </span>
                    </td>

                    {/* Amount Column */}
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1 text-sm">
                        <span className="text-green-600 font-medium">
                          Paid: {invoice.amount_paid.toLocaleString()}
                        </span>
                        <span className="text-red-600 font-medium">
                          Due: {invoice.amount_due.toLocaleString()}
                        </span>
                        <span className="text-gray-700 font-semibold">
                          Total: {invoice.total.toLocaleString()}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                          paymentStatuses[invoice.bill_status].color
                        }`}
                      >
                        {getStatusDot(invoice.bill_status)}
                        {paymentStatuses[invoice.bill_status].label}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex justify-center">
                        <div className="relative">
                          <button
                            onClick={() => onViewInvoice(invoice.invoice_id)}
                            onMouseEnter={() => setHoveredTooltip(`view-${invoice.invoice_id}`)}
                            onMouseLeave={() => setHoveredTooltip(null)}
                            className="h-8 w-8 inline-flex items-center justify-center rounded-lg  hover:bg-blue-50 hover:text-blue-600 text-gray-600 transition-all duration-150 hover:scale-105"
                            aria-label="View invoice"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {hoveredTooltip === `view-${invoice.invoice_id}` && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10 shadow-lg">
                              View invoice details
                              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-3 text-center text-sm text-gray-600 bg-gray-50 border-t border-gray-200"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>
                        Showing {data.length} invoice{data.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </>
          )}
        </table>
      </div>
    </div>
  );
};

export default InvoiceTable;
