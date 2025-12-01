// import { Edit2, Eye } from "lucide-react";
// import {
//   Table as T,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../../../../components/ui/table";
// import { useNavigate } from "react-router-dom";
// import { Button } from "../../../../components/ui/button";
// import { Tooltip, TooltipContent, TooltipTrigger } from "../../../../components/ui/tooltip";
// import { dateFormatter } from "../../../utils/DateFormatter";
// import { Badge } from "../../../../components/ui/badge";

// const VehicleServicesTable = ({ data }: any) => {
//   const navigate = useNavigate();

//   const paymentStatuses: any = {
//     0: { value: "Unpaid", color: "bg-red-200 text-red-800" },
//     1: { value: "Partial", color: "bg-amber-200 text-amber-800" },
//     2: { value: "Paid", color: "bg-green-200 text-green-800" },
//     3: { value: "Overpaid", color: "bg-green-400 text-white" },
//   };

//   return (
//     <div className="bg-white shadow rounded-2xl border border-gray-200 overflow-x-auto">
//       <T className="min-w-full">
//         <TableCaption className="text-gray-500 text-sm p-3">
//           {data?.length
//             ? `Recent services (${data.length})`
//             : "No services recorded yet."}
//         </TableCaption>

//         <TableHeader>
//           <TableRow className="bg-gray-200 text-gray-700">
//             <TableHead className="font-medium text-left w-[120px]">Invoice #</TableHead>
//             <TableHead className="font-medium text-left w-[130px]">Total</TableHead>
//             <TableHead className="font-medium text-left w-[130px]">Due</TableHead>
//             <TableHead className="font-medium text-left w-[130px]">Paid</TableHead>
//             <TableHead className="font-medium text-left w-[120px]">Status</TableHead>
//             <TableHead className="font-medium text-left w-[130px]">Date</TableHead>
//             <TableHead className="font-medium text-center w-[100px]">Actions</TableHead>
//           </TableRow>
//         </TableHeader>

//         <TableBody>
//           {data?.map((datum: any, idx: number) => (
//             <TableRow
//               key={datum.id}
//               className={`transition hover:bg-gray-50 ${
//                 idx % 2 === 0 ? "bg-gray-50" : "bg-white"
//               }`}
//             >
//               <TableCell className="font-semibold">{datum.id}</TableCell>
//               <TableCell>{datum.total.toFixed(2)} AED</TableCell>
//               <TableCell>{datum.amount_due.toFixed(2)} AED</TableCell>
//               <TableCell>{datum.amount_paid.toFixed(2)} AED</TableCell>
//               <TableCell>
//                 <Badge
//                   variant="outline"
//                   className={`px-2 py-1 rounded-full ${
//                     paymentStatuses[datum.bill_status]?.color
//                   }`}
//                 >
//                   {paymentStatuses[datum.bill_status]?.value}
//                 </Badge>
//               </TableCell>
//               <TableCell>{dateFormatter(datum.created_at)}</TableCell>

//               <TableCell className="text-center">
//                 <div className="flex justify-center gap-2">
//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <Button
//                         size="icon"
//                         variant="outline"
//                         className="bg-gray-200 hover:bg-gray-100"
//                         onClick={() => navigate(`/invoice/${datum.id}`)}
//                       >
//                         <Eye />
//                       </Button>
//                     </TooltipTrigger>
//                     <TooltipContent className="bg-gray-300">
//                       <p>View</p>
//                     </TooltipContent>
//                   </Tooltip>

//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <Button
//                         size="icon"
//                         variant="outline"
//                         className="bg-gray-200 hover:bg-gray-100"
//                         onClick={() => navigate(`/vehicle-details/${datum.id}`)}
//                       >
//                         <Edit2 />
//                       </Button>
//                     </TooltipTrigger>
//                     <TooltipContent className="bg-gray-300">
//                       <p>Edit</p>
//                     </TooltipContent>
//                   </Tooltip>
//                 </div>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </T>
//     </div>
//   );
// };

// export default VehicleServicesTable;



// import { Edit2, Eye, Receipt, DollarSign, Calendar } from "lucide-react";
// import { useState } from "react";

// interface VehicleService {
//   id: number;
//   total: number;
//   amount_due: number;
//   amount_paid: number;
//   bill_status: 0 | 1 | 2 | 3;
//   created_at: string;
// }

// interface VehicleServicesTableProps {
//   data: VehicleService[];
//   onViewInvoice: (invoiceId: number) => void;
//   onEditService: (serviceId: number) => void;
//   dateFormatter: (date: string) => string;
// }

// const VehicleServicesTable = ({ 
//   data, 
//   onViewInvoice, 
//   onEditService, 
//   dateFormatter 
// }: VehicleServicesTableProps) => {
//   const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);
//   const hasData = data && data.length > 0;

//   const paymentStatuses = {
//     0: { label: "Unpaid", color: "border-l-red-500 bg-red-50/50 text-red-700" },
//     1: { label: "Partial", color: "border-l-amber-500 bg-amber-50/50 text-amber-700" },
//     2: { label: "Paid", color: "border-l-green-500 bg-green-50/50 text-green-700" },
//     3: { label: "Overpaid", color: "border-l-emerald-500 bg-emerald-50/50 text-emerald-700" },
//   };

//   return (
//     <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
//       <div className="overflow-x-auto">
//         <table className="w-full min-w-full">
//           {!hasData && (
//             <caption className="py-8 text-center">
//               <Receipt className="w-12 h-12 mx-auto text-gray-300 mb-3" />
//               <p className="text-gray-500 font-medium">No services recorded</p>
//               <p className="text-gray-400 text-sm mt-1">Service history will appear here</p>
//             </caption>
//           )}
          
//           {hasData && (
//             <>
//               <thead>
//                 <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
//                   <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     <div className="flex items-center gap-2">
//                       <Receipt className="w-4 h-4" />
//                       Invoice
//                     </div>
//                   </th>
//                   <th className="px-4 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     <div className="flex items-center justify-end gap-2">
//                       <DollarSign className="w-4 h-4" />
//                       Amount
//                     </div>
//                   </th>
//                   <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     <div className="flex items-center gap-2">
//                       <Calendar className="w-4 h-4" />
//                       Date
//                     </div>
//                   </th>
//                   <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
              
//               <tbody>
//                 {data.map((service) => {
//                   const status = paymentStatuses[service.bill_status];
                  
//                   return (
//                     <tr 
//                       key={service.id}
//                       className="border-b border-gray-100 hover:bg-blue-50/30 transition-all duration-150"
//                     >
//                       <td className="px-4 py-4">
//                         <div className="flex items-center gap-3">
//                           <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
//                             <Receipt className="w-4 h-4 text-blue-600" />
//                           </div>
//                           <span className="font-semibold text-gray-900">#{service.id}</span>
//                         </div>
//                       </td>
                      
//                       <td className="px-4 py-4">
//                         <div className="flex flex-col items-end gap-1">
//                           <div className="flex items-center gap-2">
//                             <span className="text-xs text-gray-500">Total:</span>
//                             <span className="font-semibold text-gray-900">
//                               {service.total.toFixed(2)} AED
//                             </span>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <span className="text-xs text-green-600">Paid:</span>
//                             <span className="text-sm font-medium text-green-700">
//                               {service.amount_paid.toFixed(2)} AED
//                             </span>
//                           </div>
//                           {service.amount_due > 0 && (
//                             <div className="flex items-center gap-2">
//                               <span className="text-xs text-red-600">Due:</span>
//                               <span className="text-sm font-medium text-red-700">
//                                 {service.amount_due.toFixed(2)} AED
//                               </span>
//                             </div>
//                           )}
//                         </div>
//                       </td>
                      
//                       <td className="px-4 py-4">
//                         <div className="flex justify-center">
//                           <span className={`inline-flex items-center px-3 py-1.5 rounded-lg border-l-4 text-xs font-medium ${status.color}`}>
//                             {status.label}
//                           </span>
//                         </div>
//                       </td>
                      
//                       <td className="px-4 py-4">
//                         <span className="text-sm text-gray-700">{dateFormatter(service.created_at)}</span>
//                       </td>
                      
//                       <td className="px-4 py-4">
//                         <div className="flex justify-center gap-1.5">
//                           <div className="relative">
//                             <button
//                               className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors text-gray-600"
//                               onClick={() => onViewInvoice(service.id)}
//                               onMouseEnter={() => setHoveredTooltip(`view-${service.id}`)}
//                               onMouseLeave={() => setHoveredTooltip(null)}
//                               aria-label="View invoice"
//                             >
//                               <Eye className="h-4 w-4" />
//                             </button>
//                             {hoveredTooltip === `view-${service.id}` && (
//                               <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10 shadow-lg">
//                                 View invoice
//                                 <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
//                               </div>
//                             )}
//                           </div>
                          
//                           <div className="relative">
//                             <button
//                               className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-amber-50 hover:text-amber-600 transition-colors text-gray-600"
//                               onClick={() => onEditService(service.id)}
//                               onMouseEnter={() => setHoveredTooltip(`edit-${service.id}`)}
//                               onMouseLeave={() => setHoveredTooltip(null)}
//                               aria-label="Edit service"
//                             >
//                               <Edit2 className="h-4 w-4" />
//                             </button>
//                             {hoveredTooltip === `edit-${service.id}` && (
//                               <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10 shadow-lg">
//                                 Edit service
//                                 <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
              
//               <tfoot>
//                 <tr>
//                   <td colSpan={5} className="px-4 py-3 text-center text-sm text-gray-600 bg-gray-50 border-t border-gray-200">
//                     <div className="flex items-center justify-center gap-2">
//                       <Receipt className="w-4 h-4" />
//                       <span>Total services: {data.length}</span>
//                     </div>
//                   </td>
//                 </tr>
//               </tfoot>
//             </>
//           )}
//         </table>
//       </div>
//     </div>
//   );
// };

// export default VehicleServicesTable;







// import { Eye, Receipt, TrendingUp, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
// import { useState } from "react";

// interface VehicleService {
//   id: number;
//   total: number;
//   amount_due: number;
//   amount_paid: number;
//   bill_status: 0 | 1 | 2 | 3;
//   created_at: string;
// }

// interface VehicleServicesTableProps {
//   data: VehicleService[];
//   onViewInvoice: (invoiceId: number) => void;
//   dateFormatter: (date: string) => string;
// }

// const VehicleServicesTable = ({ 
//   data, 
//   onViewInvoice, 
//   dateFormatter 
// }: VehicleServicesTableProps) => {
//   const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);
//   const hasData = data && data.length > 0;

//   const paymentStatuses = {
//     0: { label: "Unpaid", color: "border-l-red-500 bg-red-50/50 text-red-700", icon: AlertCircle },
//     1: { label: "Partial", color: "border-l-amber-500 bg-amber-50/50 text-amber-700", icon: TrendingUp },
//     2: { label: "Paid", color: "border-l-green-500 bg-green-50/50 text-green-700", icon: CheckCircle2 },
//     3: { label: "Overpaid", color: "border-l-emerald-500 bg-emerald-50/50 text-emerald-700", icon: CheckCircle2 },
//   };

//   const calculateTotals = () => {
//     if (!hasData) return { totalAmount: 0, totalPaid: 0, totalDue: 0 };
    
//     return data.reduce((acc, service) => ({
//       totalAmount: acc.totalAmount + service.total,
//       totalPaid: acc.totalPaid + service.amount_paid,
//       totalDue: acc.totalDue + service.amount_due,
//     }), { totalAmount: 0, totalPaid: 0, totalDue: 0 });
//   };

//   const totals = calculateTotals();

//   return (
//     <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
//       <div className="overflow-x-auto">
//         <table className="w-full min-w-full">
//           {!hasData && (
//             <caption className="py-8 text-center">
//               <Receipt className="w-12 h-12 mx-auto text-gray-300 mb-3" />
//               <p className="text-gray-500 font-medium">No services recorded</p>
//               <p className="text-gray-400 text-sm mt-1">Service history will appear here</p>
//             </caption>
//           )}
          
//           {hasData && (
//             <>
//               <thead>
//                 <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
//                   <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Invoice
//                   </th>
//                   <th className="px-4 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Total Amount
//                   </th>
//                   <th className="px-4 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Amount Paid
//                   </th>
//                   <th className="px-4 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Balance Due
//                   </th>
//                   <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Payment Status
//                   </th>
//                   <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Service Date
//                   </th>
//                   <th className="px-4 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                     Action
//                   </th>
//                 </tr>
//               </thead>
              
//               <tbody>
//                 {data.map((service) => {
//                   const status = paymentStatuses[service.bill_status];
//                   const StatusIcon = status.icon;
//                   const paymentProgress = (service.amount_paid / service.total) * 100;
                  
//                   return (
//                     <tr 
//                       key={service.id}
//                       className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
//                     >
//                       <td className="px-4 py-4">
//                         <div className="flex items-center gap-2">
//                           <span className="text-sm font-semibold text-gray-900">#{service.id}</span>
//                         </div>
//                       </td>
                      
//                       <td className="px-4 py-4 text-right">
//                         <span className="text-sm font-semibold text-gray-900">
//                           {service.total.toFixed(2)} AED
//                         </span>
//                       </td>
                      
//                       <td className="px-4 py-4 text-right">
//                         <span className="text-sm font-medium text-gray-700">
//                           {service.amount_paid.toFixed(2)} AED
//                         </span>
//                       </td>
                      
//                       <td className="px-4 py-4 text-right">
//                         <span className={`text-sm font-medium ${service.amount_due > 0 ? 'text-red-600' : 'text-gray-400'}`}>
//                           {service.amount_due.toFixed(2)} AED
//                         </span>
//                       </td>
                      
//                       <td className="px-4 py-4">
//                         <div className="flex flex-col items-center gap-2">
//                           <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-l-4 text-xs font-medium ${status.color}`}>
//                             <StatusIcon className="w-3.5 h-3.5" />
//                             {status.label}
//                           </span>
//                           <div className="w-full max-w-[100px]">
//                             <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
//                               <div 
//                                 className="h-full bg-gray-900 rounded-full transition-all"
//                                 style={{ width: `${paymentProgress}%` }}
//                               ></div>
//                             </div>
//                             <p className="text-xs text-gray-500 mt-0.5 text-center">{paymentProgress.toFixed(0)}%</p>
//                           </div>
//                         </div>
//                       </td>
                      
//                       <td className="px-4 py-4">
//                         <div className="flex items-center gap-2">
//                           <Calendar className="w-4 h-4 text-gray-400" />
//                           <span className="text-sm text-gray-700">{dateFormatter(service.created_at)}</span>
//                         </div>
//                       </td>
                      
//                       <td className="px-4 py-4">
//                         <div className="flex justify-center">
//                           <div className="relative">
//                             <button
//                               className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100 transition-colors text-gray-600"
//                               onClick={() => onViewInvoice(service.id)}
//                               onMouseEnter={() => setHoveredTooltip(`view-${service.id}`)}
//                               onMouseLeave={() => setHoveredTooltip(null)}
//                               aria-label="View invoice"
//                             >
//                               <Eye className="h-4 w-4" />
//                             </button>
//                             {hoveredTooltip === `view-${service.id}` && (
//                               <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10 shadow-lg">
//                                 View invoice
//                                 <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
              
//               <tfoot>
//                 <tr className="bg-gray-50 border-t-2 border-gray-200">
//                   <td className="px-4 py-3">
//                     <span className="text-sm font-semibold text-gray-900">Totals</span>
//                   </td>
//                   <td className="px-4 py-3 text-right">
//                     <span className="text-sm font-bold text-gray-900">
//                       {totals.totalAmount.toFixed(2)} AED
//                     </span>
//                   </td>
//                   <td className="px-4 py-3 text-right">
//                     <span className="text-sm font-semibold text-green-700">
//                       {totals.totalPaid.toFixed(2)} AED
//                     </span>
//                   </td>
//                   <td className="px-4 py-3 text-right">
//                     <span className={`text-sm font-semibold ${totals.totalDue > 0 ? 'text-red-600' : 'text-gray-400'}`}>
//                       {totals.totalDue.toFixed(2)} AED
//                     </span>
//                   </td>
//                   <td colSpan={3} className="px-4 py-3 text-center">
//                     <span className="text-xs text-gray-500">{data.length} service{data.length !== 1 ? 's' : ''} recorded</span>
//                   </td>
//                 </tr>
//               </tfoot>
//             </>
//           )}
//         </table>
//       </div>
//     </div>
//   );
// };

// export default VehicleServicesTable;






// import { Eye, Receipt, Calendar } from "lucide-react";
// import { useState } from "react";

// interface VehicleService {
//   id: number;
//   total: number;
//   amount_due: number;
//   amount_paid: number;
//   bill_status: 0 | 1 | 2 | 3;
//   created_at: string;
// }

// interface VehicleServicesTableProps {
//   data: VehicleService[];
//   onViewInvoice: (invoiceId: number) => void;
//   dateFormatter: (date: string) => string;
// }

// const VehicleServicesTable = ({ 
//   data, 
//   onViewInvoice, 
//   dateFormatter 
// }: VehicleServicesTableProps) => {
//   const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);
//   const hasData = data && data.length > 0;

//   const paymentStatuses = {
//     0: { label: "Unpaid", color: "border-l-red-500 bg-red-50/50 text-red-700" },
//     1: { label: "Partial", color: "border-l-amber-500 bg-amber-50/50 text-amber-700" },
//     2: { label: "Paid", color: "border-l-green-500 bg-green-50/50 text-green-700" },
//     3: { label: "Overpaid", color: "border-l-emerald-500 bg-emerald-50/50 text-emerald-700" },
//   };

//   const calculateTotals = () => {
//     if (!hasData) return { totalAmount: 0, totalPaid: 0, totalDue: 0 };
    
//     return data.reduce((acc, service) => ({
//       totalAmount: acc.totalAmount + service.total,
//       totalPaid: acc.totalPaid + service.amount_paid,
//       totalDue: acc.totalDue + service.amount_due,
//     }), { totalAmount: 0, totalPaid: 0, totalDue: 0 });
//   };

//   const totals = calculateTotals();

//   return (
//     <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
//       <div className="overflow-x-auto">
//         <table className="w-full min-w-full">
//           {!hasData && (
//             <caption className="py-8 text-center">
//               <Receipt className="w-12 h-12 mx-auto text-gray-300 mb-3" />
//               <p className="text-gray-500 font-medium">No services recorded</p>
//               <p className="text-gray-400 text-sm mt-1">Service history will appear here</p>
//             </caption>
//           )}
          
//           {hasData && (
//             <>
//               <thead>
//                 <tr className="bg-gray-50 border-b border-gray-200">
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
//                     Invoice
//                   </th>
//                   <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wide">
//                     Total
//                   </th>
//                   <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wide">
//                     Paid
//                   </th>
//                   <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wide">
//                     Due
//                   </th>
//                   <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wide">
//                     Status
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wide">
//                     Date
//                   </th>
//                   <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wide">
//                     Action
//                   </th>
//                 </tr>
//               </thead>
              
//               <tbody>
//                 {data.map((service, idx) => {
//                   const status = paymentStatuses[service.bill_status];
                  
//                   return (
//                     <tr 
//                       key={service.id}
//                       className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
//                     >
//                       <td className="px-4 py-3">
//                         <span className="text-sm font-medium text-gray-900">#{service.id}</span>
//                       </td>
                      
//                       <td className="px-4 py-3 text-right">
//                         <span className="text-sm font-medium text-gray-900">
//                           {service.total.toFixed(2)}
//                         </span>
//                       </td>
                      
//                       <td className="px-4 py-3 text-right">
//                         <span className="text-sm text-gray-700">
//                           {service.amount_paid.toFixed(2)}
//                         </span>
//                       </td>
                      
//                       <td className="px-4 py-3 text-right">
//                         <span className={`text-sm ${service.amount_due > 0 ? 'font-medium text-gray-900' : 'text-gray-400'}`}>
//                           {service.amount_due.toFixed(2)}
//                         </span>
//                       </td>
                      
//                       <td className="px-4 py-3">
//                         <div className="flex justify-center">
//                           <span className={`inline-flex items-center px-2.5 py-1 rounded border-l-4 text-xs font-medium ${status.color}`}>
//                             {status.label}
//                           </span>
//                         </div>
//                       </td>
                      
//                       <td className="px-4 py-3">
//                         <span className="text-sm text-gray-600">{dateFormatter(service.created_at)}</span>
//                       </td>
                      
//                       <td className="px-4 py-3">
//                         <div className="flex justify-center">
//                           <div className="relative">
//                             <button
//                               className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100 transition-colors text-gray-600"
//                               onClick={() => onViewInvoice(service.id)}
//                               onMouseEnter={() => setHoveredTooltip(`view-${service.id}`)}
//                               onMouseLeave={() => setHoveredTooltip(null)}
//                               aria-label="View invoice"
//                             >
//                               <Eye className="h-4 w-4" />
//                             </button>
//                             {hoveredTooltip === `view-${service.id}` && (
//                               <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10">
//                                 View
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
              
//               <tfoot>
//                 <tr className="bg-gray-50 border-t border-gray-200">
//                   <td className="px-4 py-3">
//                     <span className="text-xs font-medium text-gray-600 uppercase">Total</span>
//                   </td>
//                   <td className="px-4 py-3 text-right">
//                     <span className="text-sm font-semibold text-gray-900">
//                       {totals.totalAmount.toFixed(2)}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3 text-right">
//                     <span className="text-sm font-medium text-gray-700">
//                       {totals.totalPaid.toFixed(2)}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3 text-right">
//                     <span className={`text-sm font-medium ${totals.totalDue > 0 ? 'text-gray-900' : 'text-gray-400'}`}>
//                       {totals.totalDue.toFixed(2)}
//                     </span>
//                   </td>
//                   <td colSpan={3} className="px-4 py-3 text-right">
//                     <span className="text-xs text-gray-500">{data.length} service{data.length !== 1 ? 's' : ''}</span>
//                   </td>
//                 </tr>
//               </tfoot>
//             </>
//           )}
//         </table>
//       </div>
//     </div>
//   );
// };

// export default VehicleServicesTable;



import { Edit2, Eye, Hash } from "lucide-react";
// import { useState } from "react";

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
}

const VehicleServicesTable = ({ 
  data, 
  onViewInvoice,
  onEditInvoice,
  dateFormatter 
}: VehicleServicesTableProps) => {
  // const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);
  const hasData = data && data.length > 0;

  const paymentStatuses = {
    0: { label: "Unpaid", color: "bg-red-100 text-red-700 border-red-200", dot: "bg-red-500" },
    1: { label: "Partial", color: "bg-amber-100 text-amber-700 border-amber-200", dot: "bg-amber-500" },
    2: { label: "Paid", color: "bg-green-100 text-green-700 border-green-200", dot: "bg-green-500" },
    3: { label: "Overpaid", color: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  };

  const calculateTotals = () => {
    if (!hasData) return { totalAmount: 0, totalPaid: 0, totalDue: 0 };
    
    return data.reduce((acc, service) => ({
      totalAmount: acc.totalAmount + service.total,
      totalPaid: acc.totalPaid + service.amount_paid,
      totalDue: acc.totalDue + service.amount_due,
    }), { totalAmount: 0, totalPaid: 0, totalDue: 0 });
  };

  const totals = calculateTotals();

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          {!hasData && (
            <caption className="py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
                    <Hash className="w-4 h-4 text-gray-500 "  />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</span>
                  </th>
                  <th className="px-6 py-3 text-right">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</span>
                  </th>
                  <th className="px-6 py-3 text-right">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</span>
                  </th>
                  <th className="px-6 py-3 text-right">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</span>
                  </th>
                  <th className="px-6 py-3 text-center">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</span>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Date</span>
                  </th>
                  <th className="px-6 py-3 text-center">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Action</span>
                  </th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-gray-100">
                {data.map((service) => {
                  const status = paymentStatuses[service.bill_status];
                  
                  return (
                    <tr 
                      key={service.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
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
                        <span className={`text-sm font-medium ${service.amount_due > 0 ? 'text-gray-900' : 'text-gray-400'}`}>
                          {service.amount_due.toFixed(2)} AED
                        </span>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                            {status.label}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{dateFormatter(service.created_at)}</span>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex justify- gap-1">
                          <div className="relative">
                            <button
                              className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all text-gray-600"
                              onClick={() => onEditInvoice(service.id)}
                              // onMouseEnter={() => setHoveredTooltip(`edit-${service.id}`)}
                              // onMouseLeave={() => setHoveredTooltip(null)}
                              aria-label="View invoice"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            {/* {hoveredTooltip === `view-${service.id}` && (
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap z-10">
                                View
                              </div>
                            )} */}
                          </div>
                           <div className="relative">
                            <button
                              className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all text-gray-600"
                              onClick={() => onViewInvoice(service.id)}
                              // onMouseEnter={() => setHoveredTooltip(`view-${service.id}`)}
                              // onMouseLeave={() => setHoveredTooltip(null)}
                              aria-label="View invoice"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {/* {hoveredTooltip === `view-${service.id}` && (
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap z-10">
                                View
                              </div>
                            )} */}
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
                    <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Total</span>
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
                    <span className={`text-sm font-medium ${totals.totalDue > 0 ? 'text-gray-900' : 'text-gray-400'}`}>
                      {totals.totalDue.toFixed(2)} AED
                    </span>
                  </td>
                  <td colSpan={3} className="px-6 py-3.5 text-right">
                    <span className="text-xs text-gray-500">{data.length} {data.length === 1 ? 'service' : 'services'}</span>
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