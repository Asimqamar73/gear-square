// import { useEffect, useState } from "react";
// import InvoiceItem from "./components/InvoiceItem";
// import AlertBox from "../../../components/AlertBox";
// import PageHeader from "../../../components/PageHeader";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   Building2,
//   CalendarDays,
//   Car,
//   FileText,
//   Hash,
//   MapPin,
//   Phone,
//   RefreshCcw,
//   User,

// } from "lucide-react";
// import { toast } from "sonner";

// interface IItems {
//   product: any;
//   quantity: number;
//   subtotal: number;
// }
// interface ICustomerInfo {
//   id: number;
//   name: string;
//   company_name: string;
//   address: string;
//   email: string;
//   vehicle_number: string;
//   chassis_number: string;
//   make: string;
//   model: string;
//   year: number;
//   phone_number: string;
//   company_phone_number: string;
//   created_at: string;
//   created_by: number;
//   labor_cost: number;
//   updated_at: string;
//   updated_by: number;
// }

// export const EditCustomerInvoive = () => {
//   const VAT_RATE = 0.05;
//   // const paymentStatuses = [
//   //   { title: "Unpaid", value: 0 },
//   //   { title: "Partial", value: 1 },
//   //   { title: "Paid", value: 2 },
//   // ];
//   const params = useParams();
//   const navigate = useNavigate();
//   const initialItemState: IItems = {
//     product: null,
//     quantity: 1,
//     subtotal: 0,
//   };

//   // const vehicleInfoInitialState = {
//   //   vehicle_number: "",
//   //   make: "",
//   //   model: "",
//   //   year: "",
//   //   note: "",
//   // };
//   const [products, setProducts] = useState([]);
//   const [customerInfo, setCustomerInfo] = useState<ICustomerInfo | null>(null);

//   const [totalBill, setTotalBill] = useState(0);
//   const [laborCost, setLaborCost] = useState(0);
//   // const [paymentStatus, setPaymentStatus] = useState(0);
//   const [discountPercentage, setDiscountPrecentage] = useState(0);
//   const [amountPaid, setAmountPaid] = useState(0);
//   const [serviceNote, setServiceNote] = useState("");
//   // const [vehicleDetails, setVehicleDetails] = useState(vehicleInfoInitialState);
//   const [comboboxValue, comboboxSetValue] = useState(null);

//   const [newItemsIndexes, setNewItemsIndexes] = useState([]);

//   const [items, setItems] = useState<any>([initialItemState]);
//   useEffect(() => {
//     fetchAllProducts();
//   }, []);

//   const fetchAllProducts = async () => {
//     try {
//       //@ts-ignore
//       const response = await window.electron.getProducts();
//       //@ts-ignore
//       setProducts(response);
//       fetchDetails(params.invoiceId, response);
//     } catch (error) {
//       toast.error("Something went wrong. Please restart the application", {
//         position: "top-center",
//       });
//     }
//   };

//   const fetchDetails = async (id: any, products: any) => {
//     try {
//       //@ts-ignore
//       const resp = await window.electron.getInvoiceDetails(id, products);
//       console.log(resp.serviceBill.discount);
//       // setDetails(resp);
//       setCustomerInfo(resp.service);
//       setTotalBill(resp.serviceBill.subtotal);
//       setAmountPaid(resp.serviceBill.amount_paid);
//       setDiscountPrecentage(resp.serviceBill.discount);
//       setLaborCost(resp.service.labor_cost);
//       setServiceNote(resp.service.note);
//       const f_items = products
//         .filter(
//           //@ts-ignore
//           (p) => resp.serviceItems.some((i) => i.product_id === p.id) // Filter products where there's a match in items
//         )
//         .map((p: any) => {
//           //@ts-ignore
//           const match = resp.serviceItems.find((i) => i.product_id === p.id); // Find the matching item from the items array
//           return {
//             product: p, // Include the full product object
//             subtotal: match.subtotal, // Add the subtotal from the items array
//             quantity: match.quantity, // Add the quantity from the items array
//             id: match.id,
//           };
//         });
//       console.log(f_items);
//       setItems(f_items);
//     } catch (error) {
//       toast.error("Something went wrong. Please restart the application", {
//         position: "top-center",
//       });
//     }
//   };

//   const addNewItem = () => {
//     //@ts-ignore
//     setNewItemsIndexes([...newItemsIndexes, items.length]);
//     setItems([...items, initialItemState]);
//   };

//   const handleProductChange = (id: number, idx: number) => {
//     const prod: any = products.find((product: any) => product.id == id);

//     const updatedItem = [...items];
//     //@ts-ignore
//     updatedItem[idx] = {
//       ...updatedItem[idx],
//       product: prod,

//       subtotal: prod?.retail_price * items[idx].quantity,
//     };

//     // if (newItemsIndexes.includes(idx)) {
//     //   setInvoiceUpdateAction({
//     //     ...invoiceUpdateActions,
//     //     //@ts-ignore
//     //     insert: [
//     //       //@ts-ignore
//     //       ...invoiceUpdateActions.insert,
//     //       //@ts-ignore
//     //       (updatedItem[idx] = {
//     //         ...updatedItem[idx],
//     //         product: prod,

//     //         subtotal: prod?.retail_price * items[idx].quantity,
//     //       }),
//     //     ],
//     //   });
//     //   const removedIndexesFilter = newItemsIndexes.filter((index) => index != idx);
//     //   setNewItemsIndexes(removedIndexesFilter);
//     // } else {
//     //   setInvoiceUpdateAction({
//     //     ...invoiceUpdateActions,
//     //     //@ts-ignore
//     //     insert: [
//     //       //@ts-ignore
//     //       ...invoiceUpdateActions.update,
//     //       //@ts-ignore
//     //       (updatedItem[idx] = {
//     //         ...updatedItem[idx],
//     //         product: prod,

//     //         subtotal: prod?.retail_price * items[idx].quantity,
//     //       }),
//     //     ],
//     //   });
//     // }

//     const total = updatedItem.reduce((prev, curr) => {
//       return prev + curr.subtotal;
//     }, 0);
//     setTotalBill(total);
//     setItems(updatedItem);
//   };
//   const handleQuantityChange = (event: any, idx: number) => {
//     const updatedItem = [...items];
//     updatedItem[idx] = { ...updatedItem[idx], quantity: event.target.value };
//     setItems(updatedItem);
//   };
//   const handleSubtotal = (idx: number) => {
//     const updatedItem = [...items];
//     updatedItem[idx] = {
//       ...updatedItem[idx],
//       subtotal: items[idx].quantity * items[idx]?.product?.retail_price,
//     };
//     const total = updatedItem.reduce((prev, curr) => {
//       return prev + curr.subtotal;
//     }, 0);
//     setTotalBill(total);
//     setItems(updatedItem);
//   };

//   const deleteItem = (idx: number) => {
//     // if (!newItemsIndexes.includes(idx)) {
//     //   setInvoiceUpdateAction({
//     //     ...invoiceUpdateActions,
//     //     //@ts-ignore
//     //     delete: [...invoiceUpdateActions.delete, items[idx].id],
//     //   });
//     // }
//     // const filteredNewInsertedItems = newItemsIndexes.filter((item) => item != idx);
//     // setNewItemsIndexes(filteredNewInsertedItems);

//     // const filteredItems = items.filter((_, itemIdx) => itemIdx != idx);
//     const filteredItems = [...items.slice(0, idx), ...items.slice(idx + 1)];
//     const total = filteredItems.reduce((prev, curr) => {
//       return prev + curr.subtotal;
//     }, 0);
//     setTotalBill(total);
//     setItems([...filteredItems]);
//   };

//   const handleInvoiceUpdate = async () => {
//     try {
//       //@ts-ignore
//       const response = await window.electron.updateInvoice({
//         service_id: params.invoiceId,
//         items,
//         total: totalBill,
//         subtotal: totalBill,
//         payment_status:
//           amountPaid === 0
//             ? 0
//             : totalBill - amountPaid === 0
//             ? 2
//             : totalBill - amountPaid < 0
//             ? 3
//             : 1,
//       });
//       if (response.success) {
//         toast("Invoice updated.", { position: "top-center" });
//         navigate(`/invoice/${params.invoiceId}`);
//       }
//     } catch (error) {
//       toast.error("Something went wrong. Please restart the application", {
//         position: "top-center",
//       });
//     }
//     // @ts-ignore
//     // window.electron.generateInvoice({
//     //   items,
//     //   vehicleDetails: {
//     //     ...vehicleDetails,
//     //     //@ts-ignore
//     //     createdBy: JSON.parse(localStorage.getItem("gear-square-user")).id,
//     //     //@ts-ignore
//     //     updatedBy: JSON.parse(localStorage.getItem("gear-square-user")).id,
//     //     customerId: customerInfo?.id,
//     //   },
//     // bill: {
//     //   total: (totalBill - (discountPercentge / 100) * totalBill).toFixed(1),
//     //   subtotal: totalBill,
//     //   discount: discountPercentge,
//     //   billStatus: paymentStatus,
//     //   amountPaid,
//     // },
//     // });

//     // setItems([initialItemState]);
//     // setDiscountPrecentage(0);
//     // setAmountPaid(0);
//     // setPaymentStatus(0);
//     // setVehicleDetails(vehicleInfoInitialState);
//     // setTotalBill(0);
//   };

//   // const handleVehicleDetailsChange = (e: any) => {
//   //   setVehicleDetails((prev) => {
//   //     return {
//   //       ...prev,
//   //       [e.target.id]: e.target.value,
//   //     };
//   //   });
//   // };

//   const [open, setOpen] = useState(false);

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <div className="py-16 px-8">
//         <div className="flex flex-col gap-2 mb-8">
//           <PageHeader title="Edit invoice">
//             {/* <Button
//               variant="outline"
//               className="bg-[#173468] text-white font-bold"
//               onClick={() => setOpen(true)}
//             >
//               <RefreshCcw />
//               Update
//             </Button> */}
//             <button
//               onClick={() => setOpen(true)}
//               className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
//             >
//               <RefreshCcw className="w-4 h-4" />
//               Update
//             </button>
//             <AlertBox
//               open={open}
//               setOpen={setOpen}
//               continueProcessHandler={handleInvoiceUpdate}
//               text="Are you sure you want to update invoice?"
//               subtext="Previous data will be overwrite with new invoice"
//             />
//           </PageHeader>
//           {/* <div className="flex flex-col gap-4">
//             <div className="flex gap-4">
//               <div className="grow">
//                 <InvoiceHeadInfo
//                   vehicleDetails={vehicleDetails}
//                   handleVehicleDetailsChange={handleVehicleDetailsChange}
//                 />
//               </div>
//               <div className="flex justify-end">
//                 <div className="p-4 bg-white rounded-2xl flex flex-col gap-4 border border-gray-300 shadow">
//                   <h2 className="text-xl mt-2">Invoice Details</h2>
//                   <CustomerDetail text={customerInfo?.name} subtext={customerInfo?.email}>
//                     <User2 className="text-gray-500 size-6" />
//                   </CustomerDetail>
//                   <CustomerDetail text={customerInfo?.phone_number}>
//                     <Phone className="text-gray-500 size-6" />
//                   </CustomerDetail>
//                   {customerInfo?.address && (
//                     <CustomerDetail text={customerInfo?.address}>
//                       <MapPin className="text-gray-500 size-6" />
//                     </CustomerDetail>
//                   )}

//                   {customerInfo?.vehicle_number && (
//                     <CustomerDetail
//                       text={customerInfo?.vehicle_number}
//                       subtext={customerInfo?.chassis_number}
//                     >
//                       <Car className="text-gray-500 size-6" />
//                     </CustomerDetail>
//                   )}
//                 </div>
//               </div>
//             </div>
//             <InvoiceItem
//               products={products}
//               handleProductChange={handleProductChange}
//               handleQuantityChange={handleQuantityChange}
//               handleSubtotal={handleSubtotal}
//               items={items}
//               addNewItem={addNewItem}
//               deleteItem={deleteItem}
//               comboboxValue={comboboxValue}
//               comboboxSetValue={comboboxSetValue}
//             />
//           </div> */}

//           <div className="grid lg:grid-cols-3 gap-6 mb-6">
//             {/* Owner Details */}
//             <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
//               <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
//                 <User className="w-5 h-5 text-gray-600" />
//                 <h2 className="text-base font-semibold text-gray-900">Owner Details</h2>
//               </div>
//               <div className="space-y-3">
//                 {customerInfo?.name && (
//                   <InfoRow
//                     icon={<User className="w-4 h-4 text-gray-600" />}
//                     value={customerInfo?.name}
//                     subValue={customerInfo?.email}
//                   />
//                 )}
//                 {customerInfo?.company_name && (
//                   <InfoRow
//                     icon={<Building2 className="w-4 h-4 text-gray-600" />}
//                     value={customerInfo?.company_name}
//                     subValue={customerInfo?.company_phone_number}
//                   />
//                 )}
//                 {customerInfo?.phone_number && (
//                   <InfoRow
//                     icon={<Phone className="w-4 h-4 text-gray-600" />}
//                     value={customerInfo?.phone_number}
//                   />
//                 )}
//                 {customerInfo?.address && (
//                   <InfoRow
//                     icon={<MapPin className="w-4 h-4 text-gray-600" />}
//                     value={customerInfo?.address}
//                   />
//                 )}
//               </div>
//             </div>

//             {/* Vehicle Details */}
//             <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
//               <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
//                 <Car className="w-5 h-5 text-gray-600" />
//                 <h2 className="text-base font-semibold text-gray-900">Vehicle Details</h2>
//               </div>
//               <div className="space-y-3">
//                 {customerInfo?.make && (
//                   <InfoRow
//                     icon={<Car className="w-4 h-4 text-gray-600" />}
//                     value={`${customerInfo?.make} ${customerInfo?.model || ""}`}
//                   />
//                 )}
//                 {customerInfo?.vehicle_number && (
//                   <InfoRow
//                     icon={<Hash className="w-4 h-4 text-gray-600" />}
//                     value={customerInfo?.vehicle_number}
//                     subValue={`Chassis: ${customerInfo?.chassis_number}`}
//                   />
//                 )}
//                 {customerInfo?.year && (
//                   <InfoRow
//                     icon={<CalendarDays className="w-4 h-4 text-gray-600" />}
//                     value={customerInfo?.year}
//                   />
//                 )}
//               </div>
//             </div>

//             {/* Service Note */}
//             <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
//               <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
//                 <FileText className="w-5 h-5 text-gray-600" />
//                 <h2 className="text-base font-semibold text-gray-900">Service Note</h2>
//               </div>
//               <textarea
//                 value={serviceNote}
//                 onChange={(e) => setServiceNote(e.target.value)}
//                 placeholder="Add service notes or comments..."
//                 rows={7}
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all resize-none text-sm"
//               />
//             </div>
//           </div>
//         </div>
//         <InvoiceItem
//           products={products}
//           handleProductChange={handleProductChange}
//           handleQuantityChange={handleQuantityChange}
//           handleSubtotal={handleSubtotal}
//           items={items}
//           addNewItem={addNewItem}
//           deleteItem={deleteItem}
//           comboboxValue={comboboxValue}
//           comboboxSetValue={comboboxSetValue}
//         />
//         <div className="flex justify-end mt-6">
//           <div className="w-full max-w-md bg-white rounded-lg border border-gray-200 shadow-sm p-6">
//             <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
//               <h2 className="text-base font-semibold text-gray-900">Invoice Summary</h2>
//             </div>

//             <div className="space-y-4">
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-600">Products Subtotal</span>
//                 <span className="font-medium text-gray-900">{totalBill.toFixed(2)} AED</span>
//               </div>

//               <div className="space-y-2">
//                 <label htmlFor="laborCost" className="text-sm font-medium text-gray-700">
//                   Service Labor Cost
//                 </label>
//                 <input
//                   type="number"
//                   id="laborCost"
//                   min="0"
//                   step="1"
//                   value={laborCost}
//                   //@ts-ignore
//                   onChange={(e) => setLaborCost(Number(e.target.value))}
//                   placeholder="0"
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
//                 />
//               </div>

//               <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
//                 <span className="text-gray-600 font-medium">Subtotal</span>
//                 <span className="font-medium text-gray-900">
//                   {(laborCost + totalBill).toFixed(2)} AED
//                 </span>
//               </div>

//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-600">VAT (5%)</span>
//                 <span className="font-medium text-gray-900">
//                   {(Number(laborCost + totalBill) * VAT_RATE).toFixed(2)} AED
//                 </span>
//               </div>

//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-600">After VAT</span>
//                 <span className="font-medium text-gray-900">
//                   {Number(
//                     Number(laborCost + totalBill) * VAT_RATE + (laborCost + totalBill)
//                   ).toFixed(2)}{" "}
//                   AED
//                 </span>
//               </div>

//               <div className="space-y-2">
//                 <label
//                   htmlFor="discount"
//                   className="text-sm font-medium text-gray-700 flex justify-between"
//                 >
//                   <span>Discount (%)</span>
//                   <span className="text-gray-500 font-normal">
//                     -{"totals.discountAmount.toFixed(2)"} AED
//                   </span>
//                 </label>
//                 <input
//                   type="number"
//                   id="discount"
//                   min="0"
//                   max="100"
//                   value={discountPercentage}
//                   onChange={(e) => setDiscountPrecentage(Number(e.target.value))}
//                   placeholder="0"
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label htmlFor="amountPaid" className="text-sm font-medium text-gray-700">
//                   Amount Paid
//                 </label>
//                 <input
//                   type="number"
//                   id="amountPaid"
//                   min="0"
//                   value={amountPaid}
//                   // onChange={"handleAmountPaid"}
//                   placeholder="0.00"
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label htmlFor="paymentStatus" className="text-sm font-medium text-gray-700">
//                   Payment Status
//                 </label>
//                 <select
//                   id="paymentStatus"
//                   disabled
//                   value={"paymentStatus"}
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
//                 >
//                   <option value={0}>Unpaid</option>
//                   <option value={1}>Partial</option>
//                   <option value={2}>Paid</option>
//                 </select>
//               </div>

//               <div className="pt-4 border-t border-gray-500 space-y-2">
//                 <div className="flex justify-between">
//                   <span className="font-semibold text-gray-900">Total</span>
//                   <span className="text-xl font-bold text-gray-900">
//                     {"totals.total.toFixed(2)"} AED
//                   </span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Remaining Balance</span>
//                   <span
//                   // className={`font-semibold ${
//                   //   totals.remaining > 0 ? "text-red-600" : "text-green-600"
//                   // }`}
//                   >
//                     {"totals.remaining.toFixed(2)"} AED
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const CustomerDetail = ({
//   text,
//   subtext,
//   children,
// }: {
//   text?: string;
//   subtext?: string;
//   children: any;
// }) => {
//   return (
//     <div className="flex items-center gap-2">
//       <div className="p-1.5 border border-gray-400 rounded-xl bg-gray-100">{children}</div>
//       <div>
//         <p>{text}</p>
//         {subtext && <p className="text-gray-500 text-sm">{subtext}</p>}
//       </div>
//     </div>
//   );
// };

// const InfoRow = ({
//   icon,
//   value,
//   subValue,
// }: {
//   icon: React.ReactNode;
//   value: string | number;
//   subValue?: string;
// }) => (
//   <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors bg-gray-50 border border-gray-200/80">
//     <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 border border-orange-200">
//       {icon}
//     </div>
//     <div className="flex-1 items-center h-full min-w-0">
//       <p className="text-sm font-medium text-gray-900 break-words">{value}</p>
//       {subValue && <p className="text-xs text-gray-500 mt-0.5">{subValue}</p>}
//     </div>
//   </div>
// );

import { useEffect, useState } from "react";
import InvoiceItem from "./components/InvoiceItem";
import AlertBox from "../../../components/AlertBox";
import PageHeader from "../../../components/PageHeader";
import { useNavigate, useParams } from "react-router-dom";
import {
  Building2,
  CalendarDays,
  Car,
  FileText,
  Hash,
  MapPin,
  Phone,
  RefreshCcw,
  User,
} from "lucide-react";
import { toast } from "sonner";

interface IItems {
  product: any;
  quantity: number;
  subtotal: number;
  id?: number;
}

interface ICustomerInfo {
  id: number;
  name: string;
  company_name: string;
  address: string;
  email: string;
  vehicle_number: string;
  chassis_number: string;
  make: string;
  model: string;
  year: number;
  phone_number: string;
  company_phone_number: string;
  created_at: string;
  created_by: number;
  labor_cost: number;
  note: string;
  updated_at: string;
  updated_by: number;
}

export const EditCustomerInvoice = () => {
  const VAT_RATE = 0.05;
  const params = useParams();
  const navigate = useNavigate();

  const initialItemState: IItems = {
    product: null,
    quantity: 1,
    subtotal: 0,
  };

  const [products, setProducts] = useState([]);
  const [customerInfo, setCustomerInfo] = useState<ICustomerInfo | null>(null);
  const [totalBill, setTotalBill] = useState(0);
  const [laborCost, setLaborCost] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [serviceNote, setServiceNote] = useState("");
  const [comboboxValue, comboboxSetValue] = useState(null);
  const [items, setItems] = useState<any>([initialItemState]);
  const [open, setOpen] = useState(false);

  // Calculated values
  const subtotalWithLabor = totalBill + laborCost;
  const vatAmount = subtotalWithLabor * VAT_RATE;
  const afterVAT = subtotalWithLabor + vatAmount;
  const discountAmount = (afterVAT * discountPercentage) / 100;
  const finalTotal = afterVAT - discountAmount;
  const remainingBalance = finalTotal - amountPaid;
  const paymentStatus = amountPaid === 0 ? 0 : remainingBalance <= 0 ? 2 : 1;

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      //@ts-ignore
      const response = await window.electron.getProducts();
      //@ts-ignore
      setProducts(response);
      fetchDetails(params.invoiceId, response);
    } catch (error) {
      toast.error("Something went wrong. Please restart the application", {
        position: "top-center",
      });
    }
  };

  const fetchDetails = async (id: any, products: any) => {
    try {
      //@ts-ignore
      const resp = await window.electron.getInvoiceDetails(id, products);

      setCustomerInfo(resp.service);
      setTotalBill(resp.serviceBill.subtotal - resp.service.labor_cost);
      setAmountPaid(resp.serviceBill.amount_paid);
      setDiscountPercentage(resp.serviceBill.discount);
      setLaborCost(resp.service.labor_cost);
      setServiceNote(resp.service.note || "");

      const f_items = products
        .filter(
          //@ts-ignore
          (p) => resp.serviceItems.some((i) => i.product_id === p.id)
        )
        .map((p: any) => {
          //@ts-ignore
          const match = resp.serviceItems.find((i) => i.product_id === p.id);
          return {
            product: p,
            subtotal: match.subtotal,
            quantity: match.quantity,
            id: match.id,
          };
        });

      setItems(f_items);
    } catch (error) {
      toast.error("Something went wrong. Please restart the application", {
        position: "top-center",
      });
    }
  };

  const addNewItem = () => {
    setItems([...items, initialItemState]);
  };

  const handleProductChange = (id: number, idx: number) => {
    const prod: any = products.find((product: any) => product.id == id);

    const updatedItem = [...items];
    updatedItem[idx] = {
      ...updatedItem[idx],
      product: prod,
      subtotal: prod?.retail_price * items[idx].quantity,
    };

    const total = updatedItem.reduce((prev, curr) => {
      return prev + curr.subtotal;
    }, 0);

    setTotalBill(total);
    setItems(updatedItem);
  };

  const handleQuantityChange = (event: any, idx: number) => {
    const updatedItem = [...items];
    updatedItem[idx] = { ...updatedItem[idx], quantity: event.target.value };
    setItems(updatedItem);
  };

  const handleSubtotal = (idx: number) => {
    const updatedItem = [...items];
    updatedItem[idx] = {
      ...updatedItem[idx],
      subtotal: items[idx].quantity * items[idx]?.product?.retail_price,
    };

    const total = updatedItem.reduce((prev, curr) => {
      return prev + curr.subtotal;
    }, 0);

    setTotalBill(total);
    setItems(updatedItem);
  };

  const deleteItem = (idx: number) => {
    const filteredItems = [...items.slice(0, idx), ...items.slice(idx + 1)];
    const total = filteredItems.reduce((prev, curr) => {
      return prev + curr.subtotal;
    }, 0);

    setTotalBill(total);
    setItems([...filteredItems]);
  };

  const handleInvoiceUpdate = async () => {
    try {
      //@ts-ignore
      const response = await window.electron.updateInvoice({
        service_id: params.invoiceId,
        items,
        total: finalTotal,
        subtotal: subtotalWithLabor,
        vat_amount: vatAmount,
        discount_percentage: discountPercentage,
        discount_amount: discountAmount,
        amount_paid: amountPaid,
        labor_cost: laborCost,
        service_note: serviceNote,
        payment_status: paymentStatus,
        //@ts-ignore
        updated_by: JSON.parse(localStorage.getItem("gear-square-user")).id, // Add this
      });
      if (response.success) {
        toast("Invoice updated successfully.", { position: "top-center" });
        navigate(`/invoice/${params.invoiceId}`);
      }
    } catch (error) {
      toast.error("Something went wrong. Please restart the application", {
        position: "top-center",
      });
    }
  };

  const handleAmountPaidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setAmountPaid(value >= 0 ? value : 0);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-16 px-8">
        <div className="flex flex-col gap-2 mb-8">
          <PageHeader title="Edit invoice">
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
            >
              <RefreshCcw className="w-4 h-4" />
              Update
            </button>
            <AlertBox
              open={open}
              setOpen={setOpen}
              continueProcessHandler={handleInvoiceUpdate}
              text="Are you sure you want to update invoice?"
              subtext="Previous data will be overwritten with new invoice"
            />
          </PageHeader>

          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            {/* Owner Details */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
                <User className="w-5 h-5 text-gray-600" />
                <h2 className="text-base font-semibold text-gray-900">Owner Details</h2>
              </div>
              <div className="space-y-3">
                {customerInfo?.name && (
                  <InfoRow
                    icon={<User className="w-4 h-4 text-gray-600" />}
                    value={customerInfo?.name}
                    subValue={customerInfo?.email}
                  />
                )}
                {customerInfo?.company_name && (
                  <InfoRow
                    icon={<Building2 className="w-4 h-4 text-gray-600" />}
                    value={customerInfo?.company_name}
                    subValue={customerInfo?.company_phone_number}
                  />
                )}
                {customerInfo?.phone_number && (
                  <InfoRow
                    icon={<Phone className="w-4 h-4 text-gray-600" />}
                    value={customerInfo?.phone_number}
                  />
                )}
                {customerInfo?.address && (
                  <InfoRow
                    icon={<MapPin className="w-4 h-4 text-gray-600" />}
                    value={customerInfo?.address}
                  />
                )}
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
                <Car className="w-5 h-5 text-gray-600" />
                <h2 className="text-base font-semibold text-gray-900">Vehicle Details</h2>
              </div>
              <div className="space-y-3">
                {customerInfo?.make && (
                  <InfoRow
                    icon={<Car className="w-4 h-4 text-gray-600" />}
                    value={`${customerInfo?.make} ${customerInfo?.model || ""}`}
                  />
                )}
                {customerInfo?.vehicle_number && (
                  <InfoRow
                    icon={<Hash className="w-4 h-4 text-gray-600" />}
                    value={customerInfo?.vehicle_number}
                    subValue={`Chassis: ${customerInfo?.chassis_number}`}
                  />
                )}
                {customerInfo?.year && (
                  <InfoRow
                    icon={<CalendarDays className="w-4 h-4 text-gray-600" />}
                    value={customerInfo?.year.toString()}
                  />
                )}
              </div>
            </div>

            {/* Service Note */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
                <FileText className="w-5 h-5 text-gray-600" />
                <h2 className="text-base font-semibold text-gray-900">Service Note</h2>
              </div>
              <textarea
                value={serviceNote}
                onChange={(e) => setServiceNote(e.target.value)}
                placeholder="Add service notes or comments..."
                rows={7}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all resize-none text-sm"
              />
            </div>
          </div>
        </div>

        <InvoiceItem
          products={products}
          handleProductChange={handleProductChange}
          handleQuantityChange={handleQuantityChange}
          handleSubtotal={handleSubtotal}
          items={items}
          addNewItem={addNewItem}
          deleteItem={deleteItem}
          comboboxValue={comboboxValue}
          comboboxSetValue={comboboxSetValue}
        />

        <div className="flex justify-end mt-6">
          <div className="w-full max-w-md bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Invoice Summary</h2>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Products Subtotal</span>
                <span className="font-medium text-gray-900">{totalBill.toFixed(2)} AED</span>
              </div>

              <div className="space-y-2">
                <label htmlFor="laborCost" className="text-sm font-medium text-gray-700">
                  Service Labor Cost
                </label>
                <input
                  type="number"
                  id="laborCost"
                  min="0"
                  step="1"
                  value={laborCost}
                  onChange={(e) => setLaborCost(Number(e.target.value))}
                  placeholder="0"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                />
              </div>

              <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                <span className="text-gray-600 font-medium">Subtotal</span>
                <span className="font-medium text-gray-900">
                  {(totalBill + laborCost).toFixed(2)} AED
                </span>
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
                <label
                  htmlFor="discount"
                  className="text-sm font-medium text-gray-700 flex justify-between"
                >
                  <span>Discount (%)</span>
                  <span className="text-red-600 font-normal">-{discountAmount.toFixed(2)} AED</span>
                </label>
                <input
                  type="number"
                  id="discount"
                  min="0"
                  max="100"
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(Number(e.target.value))}
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

              <div className="space-y-2">
                <label htmlFor="paymentStatus" className="text-sm font-medium text-gray-700">
                  Payment Status
                </label>
                <select
                  id="paymentStatus"
                  disabled
                  value={paymentStatus}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                >
                  <option value={0}>Unpaid</option>
                  <option value={1}>Partial</option>
                  <option value={2}>Paid</option>
                </select>
              </div>

              <div className="pt-4 border-t border-gray-500 space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">
                    {finalTotal.toFixed(2)} AED
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Remaining Balance</span>
                  <span
                    className={`font-semibold ${
                      remainingBalance > 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {remainingBalance.toFixed(2)} AED
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({
  icon,
  value,
  subValue,
}: {
  icon: React.ReactNode;
  value: string | number;
  subValue?: string;
}) => (
  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors bg-gray-50 border border-gray-200/80">
    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 border border-orange-200">
      {icon}
    </div>
    <div className="flex-1 items-center h-full min-w-0">
      <p className="text-sm font-medium text-gray-900 break-words">{value}</p>
      {subValue && <p className="text-xs text-gray-500 mt-0.5">{subValue}</p>}
    </div>
  </div>
);
