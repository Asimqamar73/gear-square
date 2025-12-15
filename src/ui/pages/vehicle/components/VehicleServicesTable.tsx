import { Edit2, Eye, Hash, Trash2 } from "lucide-react";

interface VehicleService {
  id: number;
  total: number;
  amount_due: number;
  amount_paid: number;
  bill_status: 0 | 1 | 2 | 3;
  created_at: string;
}

interface VehicleServicesTableProps {
  data: VehicleService[];
  onViewInvoice: (invoiceId: number) => void;
  onEditInvoice: (invoiceId: number) => void;
  dateFormatter: (date: string) => string;
  onDeleteInvoice: (id: number) => void;
}

const VehicleServicesTable = ({
  data,
  onViewInvoice,
  onEditInvoice,
  onDeleteInvoice,
  dateFormatter,
}: VehicleServicesTableProps) => {
  // const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);
  const hasData = data && data.length > 0;

  const paymentStatuses = {
    0: { label: "Unpaid", color: "bg-red-100 text-red-700 border-red-200", dot: "bg-red-500" },
    1: {
      label: "Partial",
      color: "bg-amber-100 text-amber-700 border-amber-200",
      dot: "bg-amber-500",
    },
    2: {
      label: "Paid",
      color: "bg-green-100 text-green-700 border-green-200",
      dot: "bg-green-500",
    },
    3: {
      label: "Overpaid",
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
      dot: "bg-emerald-500",
    },
  };

  const calculateTotals = () => {
    if (!hasData) return { totalAmount: 0, totalPaid: 0, totalDue: 0 };

    return data.reduce(
      (acc, service) => ({
        totalAmount: acc.totalAmount + service.total,
        totalPaid: acc.totalPaid + service.amount_paid,
        totalDue: acc.totalDue + service.amount_due,
      }),
      { totalAmount: 0, totalPaid: 0, totalDue: 0 }
    );
  };

  const totals = calculateTotals();

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          {!hasData && (
            <caption className="py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">No service history</p>
              <p className="text-xs text-gray-500">Service records will appear here</p>
            </caption>
          )}

          {hasData && (
            <>
              <thead>
                <tr className="border-b border-gray-200 bg-gray-100">
                  <th className="px-6 py-3 flex gap-2 text-left">
                    <Hash className="w-4 h-4 text-gray-500 " />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice
                    </span>
                  </th>
                  <th className="px-6 py-3 text-right">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </span>
                  </th>
                  <th className="px-6 py-3 text-right">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paid
                    </span>
                  </th>
                  <th className="px-6 py-3 text-right">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance
                    </span>
                  </th>
                  <th className="px-6 py-3 text-center">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </span>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </span>
                  </th>
                  <th className="px-6 py-3 text-right">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {data.map((service) => {
                  const status = paymentStatuses[service.bill_status];

                  return (
                    <tr key={service.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">#{service.id}</span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-medium text-gray-900">
                          {service.total.toFixed(2)} AED
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <span className="text-sm text-gray-600">
                          {service.amount_paid.toFixed(2)} AED
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <span
                          className={`text-sm font-medium ${
                            service.amount_due > 0 ? "text-gray-900" : "text-gray-400"
                          }`}
                        >
                          {service.amount_due.toFixed(2)} AED
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${status.color}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                            {status.label}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {dateFormatter(service.created_at)}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-1">
                          <div className="relative">
                            <button
                              className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all text-gray-600"
                              onClick={() => onViewInvoice(service.id)}
                        
                              aria-label="View invoice"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="relative">
                            <button
                              className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all text-gray-600"
                              onClick={() => onEditInvoice(service.id)}
                              aria-label="View invoice"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </div>
                            <div className="relative">
                            <button
                              className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all text-gray-600"
                              onClick={() => onDeleteInvoice(service.id)}
                              aria-label="View invoice"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              <tfoot className="border-t border-gray-300 bg-linear-to-r from-slate-200 to-slate-300">
                <tr>
                  <td className="px-6 py-3.5">
                    <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Total
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <span className="text-sm font-semibold text-gray-900">
                      {totals.totalAmount.toFixed(2)} AED
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <span className="text-sm font-medium text-gray-700">
                      {totals.totalPaid.toFixed(2)} AED
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <span
                      className={`text-sm font-medium ${
                        totals.totalDue > 0 ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {totals.totalDue.toFixed(2)} AED
                    </span>
                  </td>
                  <td colSpan={3} className="px-6 py-3.5 text-right">
                    <span className="text-xs text-gray-500">
                      {data.length} {data.length === 1 ? "service" : "services"}
                    </span>
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

export default VehicleServicesTable;
