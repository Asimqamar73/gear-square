// import {
//   Table as T,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../../../../components/ui/table";

// const ServiceItemTable = ({ data }: any) => {
//   return (
//     <div className="bg-white shadow-md rounded-2xl border border-gray-200 overflow-hidden">
//       <T className="min-w-full">
//         <TableCaption className="text-gray-500 text-sm p-3">List of </TableCaption>

//         <TableHeader>
//           <TableRow className="bg-gray-100">
//             <TableHead className="text-left w-12 font-medium text-gray-700">No.</TableHead>
//             <TableHead className="text-left w-16 font-medium text-gray-700">Photo</TableHead>
//             <TableHead className="text-left font-medium text-gray-700">Item Name</TableHead>
//             <TableHead className="text-right font-medium text-gray-700">Unit Price (AED)</TableHead>
//             <TableHead className="text-right font-medium text-gray-700">Qty</TableHead>
//             <TableHead className="text-right font-medium text-gray-700">Subtotal (AED)</TableHead>
//             <TableHead className="text-right font-medium text-gray-700">
//               Total (Incl. VAT)
//             </TableHead>
//           </TableRow>
//         </TableHeader>

//         <TableBody>
//           {data?.map((item: any, idx: number) => {
//             const totalWithVat = item.subtotal * 1.05;
//             return (
//               <TableRow
//                 key={idx}
//                 className={`transition hover:bg-gray-50 ${
//                   idx % 2 === 0 ? "bg-gray-50" : "bg-white"
//                 }`}
//               >
//                 <TableCell className="px-3 py-2">{idx + 1}</TableCell>
//                 <TableCell className="px-3 py-2">
//                   <img
//                     src={`file://${item.image}`}
//                     className="w-12 h-12 rounded-md object-cover"
//                     alt={item.name}
//                   />
//                 </TableCell>
//                 <TableCell className="px-3 py-2 font-medium text-gray-700">{item.name}</TableCell>
//                 <TableCell className="px-3 py-2 text-right">
//                   {item.retail_price.toFixed(2)}
//                 </TableCell>
//                 <TableCell className="px-3 py-2 text-right">{item.quantity}</TableCell>
//                 <TableCell className="px-3 py-2 text-right">{item.subtotal.toFixed(2)}</TableCell>
//                 <TableCell className="px-3 py-2 text-right font-semibold text-gray-800">
//                   {totalWithVat.toFixed(2)}
//                 </TableCell>
//               </TableRow>
//             );
//           })}
//         </TableBody>
//       </T>
//     </div>
//   );
// };

// export default ServiceItemTable;





import { Package, Receipt } from "lucide-react";

interface ServiceItem {
  id?: string | number;
  image?: string;
  name: string;
  retail_price: number;
  quantity: number;
  subtotal: number;
}

interface ServiceItemTableProps {
  data: ServiceItem[];
  vatRate?: number;
}

const ServiceItemTable = ({ data, vatRate = 5 }: ServiceItemTableProps) => {
  const hasData = data && data.length > 0;

  // const calculateVAT = (subtotal: number) => {
  //   return (subtotal * (vatRate / 100)).toFixed(2);
  // };

  // const calculateTotal = (subtotal: number) => {
  //   return (subtotal + subtotal * (vatRate / 100)).toFixed(2);
  // };

  const getTotals = () => {
    if (!hasData) return { subtotal: 0, vat: 0, total: 0 };
    
    const subtotal = data.reduce((sum, item) => sum + item.subtotal, 0);
    const vat = subtotal * (vatRate / 100);
    const total = subtotal + vat;
    
    return { subtotal, vat, total };
  };

  const totals = getTotals();

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-full">
          {!hasData && (
            <caption className="py-8 text-center">
              <Receipt className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No </p>
              <p className="text-gray-400 text-sm mt-1">Add items to this invoice</p>
            </caption>
          )}
          
          {hasData && (
            <>
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-16">
                    #
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-20">
                    Image
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Item Name
                    </div>
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Qty
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Subtotal
                  </th>
                  {/* <th className="px-4 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    VAT ({vatRate}%)
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Total
                  </th> */}
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
                    
                    <td className="px-4 py-4">
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
                    </td>
                    
                    <td className="px-4 py-4">
                      <span className="font-medium text-gray-900">{item.name}</span>
                    </td>
                    
                    <td className="px-4 py-4 text-right">
                      <span className="text-sm text-gray-700 font-medium">
                        {item.retail_price.toFixed(2)} AED
                      </span>
                    </td>
                    
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 rounded-md bg-gray-100 text-sm font-semibold text-gray-900">
                        {item.quantity}
                      </span>
                    </td>
                    
                    <td className="px-4 py-4 text-right">
                      <span className="text-sm font-semibold text-gray-900">
                        {item.subtotal.toFixed(2)} AED
                      </span>
                    </td>
                    
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
                  <td  className="px-4 py-4 text-right" colSpan={5}>
                    <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                      Items Totals
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

export default ServiceItemTable;