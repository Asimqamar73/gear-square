import {   WrenchIcon } from "lucide-react";

interface ILaborCostList {
  id?: string | number;
  description: string;
  labour_type: number;
  amount: number;
}

interface ServiceItemTableProps {
  data: ILaborCostList[];
}

const ServiceLaborsListTable = ({ data }: ServiceItemTableProps) => {
  const hasData = data && data.length > 0;

  // const calculateVAT = (subtotal: number) => {
  //   return (subtotal * (vatRate / 100)).toFixed(2);
  // };

  // const calculateTotal = (subtotal: number) => {
  //   return (subtotal + subtotal * (vatRate / 100)).toFixed(2);
  // };

  const getTotals = () => {
    if (!hasData) return { subtotal: 0, vat: 0, total: 0 };

    const subtotal = data.reduce((sum, item) => sum + item.amount, 0);

    return { subtotal};
  };

  const totals = getTotals();

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-full">
          {!hasData && (
            <caption className="py-8 text-center">
              <WrenchIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No Labor cost added to this service</p>
              {/* <p className="text-gray-400 text-sm mt-1">Add items to this invoice</p> */}
            </caption>
          )}

          {hasData && (
            <>
              <thead>
                <tr className=" bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-16">
                    #
                  </th>

                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ">
                    <div className="flex items-center gap-2">
                      <WrenchIcon className="w-4 h-4" />
                      Type
                    </div>
                  </th>
                  <th className="px-4 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider text-left">
                    Amount
                  </th>
                  <th className="col-span-3 px-4 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider" colSpan={3}>
                    Details
                  </th>
               
                </tr>
              </thead>

              <tbody>
                {data.map((item, idx) => (
                  <tr
                    key={item.id || idx}
                    className="border-b border-gray-100 hover:bg-blue-50/30 transition-all duration-150"
                  >
                    <td className="px-4 py-4 text-center">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                        <span className="text-xs font-semibold text-blue-600">{idx + 1}</span>
                      </div>
                    </td>

                    {/* <td className="px-4 py-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                        {item.image ? (
                          <img
                            src={`file://${item.image}`}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                    </td> */}

                    <td className="px-4 py-4">
                      <span className="font-medium text-gray-900">{item.labour_type}</span>
                    </td>

                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-700 font-medium text-nowrap">
                        {item.amount.toFixed(2)} AED
                      </span>
                    </td>

                    <td className="px-4 py-4 text-center" colSpan={3}>
                      <span className="inline-flex items-center justify-center text-justify min-w-[2rem] px-2 py-1 rounded-md text-sm text-gray-800" >
                        {item.description}
                      </span>
                    </td>

                    {/* <td className="px-4 py-4 text-right">
                      <span className="text-sm font-semibold text-gray-900">
                        {item.subtotal.toFixed(2)} AED
                      </span>
                    </td> */}

                    {/* <td className="px-4 py-4 text-right">
                      <span className="text-sm text-green-600 font-medium">
                        +{calculateVAT(item.subtotal)} AED
                      </span>
                    </td>
                    
                    <td className="px-4 py-4 text-right">
                      <span className="text-sm font-bold text-gray-900">
                        {calculateTotal(item.subtotal)} AED
                      </span>
                    </td> */}
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr className="bg-gradient-to-r from-blue-50 to-blue-100 border-t-2 border-blue-200">
                  <td className="px-4 py-4 text-right" colSpan={5}>
                    <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                      Total
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-gray-500">Subtotal</span>
                      <span className="text-base font-bold text-gray-900">
                        {totals.subtotal.toFixed(2)} AED
                      </span>
                    </div>
                  </td>
                  {/* <td className="px-4 py-4 text-right">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-gray-500">VAT ({vatRate}%)</span>
                      <span className="text-base font-bold text-green-600">
                        +{totals.vat.toFixed(2)} AED
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-gray-500">Grand Total</span>
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-lg font-bold text-blue-600">
                          {totals.total.toFixed(2)} AED
                        </span>
                      </div>
                    </div>
                  </td> */}
                </tr>
              </tfoot>
            </>
          )}
        </table>
      </div>
    </div>
  );
};

export default ServiceLaborsListTable;
