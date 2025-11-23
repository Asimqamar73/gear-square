// import { useEffect, useState } from "react";
// import InvoiceItem from "./components/InvoiceItem";
// import { Button } from "../../../components/ui/button";
// import AlertBox from "../../../components/AlertBox";
// import PageHeader from "../../../components/PageHeader";
// import { useNavigate, useParams } from "react-router-dom";
// import { Building2, CalendarDays, Car, Hash, MapPin, Phone, User2 } from "lucide-react";
// import { toast } from "sonner";

// interface IItems {
//   product: any;
//   quantity: number;
//   subtotal: number;
// }
// interface IVehicleInfo {
//   id: number;
//   name: string;
//   address: string;
//   email: string;
//   company_name: string;
//   company_phone_number: string;
//   make: string;
//   model: string;
//   phone_number: string;
//   chassis_number: string;
//   vehicle_number: string;
//   year: string;
//   created_at: string;
//   created_by: number;
//   updated_at: string;
//   updated_by: number;
// }

// export const GenerateVehicleServiceInvoice = () => {
//   const navigate = useNavigate();
//   const params = useParams();
//   const paymentStatuses = [
//     { title: "Unpaid", value: 0 },
//     { title: "Partial", value: 1 },
//     { title: "Paid", value: 2 },
//   ];
//   const initialItemState: IItems = {
//     product: null,
//     quantity: 1,
//     subtotal: 0,
//   };
//   const [products, setProducts] = useState([]);
//   const [vehicleInfo, setVehicleInfo] = useState<IVehicleInfo | null>(null);
//   const [serviceNote, setServiceNote] = useState("");

//   const [totalBill, setTotalBill] = useState(0);
//   const [paymentStatus, setPaymentStatus] = useState(0);
//   const [discountPercentge, setDiscountPrecentage] = useState(0);
//   const [amountPaid, setAmountPaid] = useState(0);
//   const [comboboxValue, comboboxSetValue] = useState(null);

//   const [items, setItems] = useState([initialItemState]);
//   useEffect(() => {
//     Promise.allSettled([fetchAllProducts(), fetchVehicleInformation()]);
//   }, []);

//   const fetchAllProducts = async () => {
//     try {
//       //@ts-ignore
//       const response = await window.electron.getProducts();
//       //@ts-ignore
//       setProducts(response);
//     } catch (error) {
//       toast.error("Something went wrong. Please restart the application", {
//         position: "top-center",
//       });
//     }
//   };
//   const fetchVehicleInformation = async () => {
//     try {
//       //@ts-ignore
//       const { response } = await window.electron.getVehicleDetails(params.vehicleId);
//       console.log(response);
//       //@ts-ignore
//       setVehicleInfo(response);
//     } catch (error) {
//       toast.error("Something went wrong. Please restart the application", {
//         position: "top-center",
//       });
//     }
//   };

//   const addNewItem = () => {
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
//     const total = updatedItem.reduce((prev, curr) => {
//       return prev + curr.subtotal;
//     }, 0);
//     setTotalBill(Number(total.toFixed(2)));
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
//     setTotalBill(Number(total.toFixed(2)));
//     setItems(updatedItem);
//   };

//   const deleteItem = (idx: number) => {
//     // const filteredItems = items.filter((_, itemIdx) => itemIdx != idx);
//     const filteredItems = [...items.slice(0, idx), ...items.slice(idx + 1)];
//     const total = filteredItems.reduce((prev, curr) => {
//       return prev + curr.subtotal;
//     }, 0);
//     setTotalBill(Number(total.toFixed(2)));
//     setItems([...filteredItems]);
//   };

//   const handleInvoiceGeneration = async () => {
//     //@ts-ignore
//     const id = JSON.parse(localStorage.getItem("gear-square-user")).id;
//     try {
//       // @ts-ignore
//       const response = await window.electron.generateInvoice({
//         items,
//         vehicleDetails: {
//           vehicle_id: params.vehicleId,
//           note: serviceNote,
//           //@ts-ignore
//           createdBy: id,
//           //@ts-ignore
//           updatedBy: id,
//           customerId: vehicleInfo?.id,
//         },
//         bill: {
//           total:
//             totalBill > 0
//               ? (
//                   totalBill +
//                   totalBill * (5 / 100) -
//                   (discountPercentge / 100) * (totalBill + totalBill * (5 / 100))
//                 ).toFixed(2)
//               : 0,
//           subtotal: totalBill,
//           discount: discountPercentge,
//           billStatus: paymentStatus,
//           amountPaid,
//           vatAmount:
//             (totalBill + totalBill * (5 / 100)).toFixed(2),
//         },
//       });
//       setItems([initialItemState]);
//       setDiscountPrecentage(0);
//       setAmountPaid(0);
//       setPaymentStatus(0);
//       // setVehicleDetails(vehicleInfoInitialState);
//       setTotalBill(0);
//       if (response.success) {
//         toast("Invoice generated successfully.", {
//           position: "top-center",
//         });
//         navigate(`/invoice/${response.service_id}`);
//       }
//     } catch (error) {
//       toast.error("Something went wrong. Please restart the application", {
//         position: "top-center",
//       });
//     }
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

//   const handleAmountPaid = (e: any) => {
//     setAmountPaid(e.target.value);
//     if (e.target.value == 0) {
//       setPaymentStatus(0);
//     } else if (
//       e.target.value > 0 &&
//       Number(e.target.value) <
//         Number((totalBill - (discountPercentge / 100) * totalBill).toFixed(2))
//     ) {
//       setPaymentStatus(1);
//     } else if (
//       Number(e.target.value) >=
//       Number((totalBill - (discountPercentge / 100) * totalBill).toFixed(2))
//     ) {
//       setPaymentStatus(2);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <div className="py-16 px-8">
//         <div className="flex flex-col gap-2 mb-8">
//           <PageHeader title="Generate invoice">
//             {items.length && items[0].product && (
//               <Button
//                 variant="outline"
//                 className="bg-[#173468] text-white font-bold"
//                 onClick={() => setOpen(true)}
//               >
//                 Generate
//               </Button>
//             )}

//             <AlertBox
//               open={open}
//               setOpen={setOpen}
//               continueProcessHandler={handleInvoiceGeneration}
//               text="Are you sure you want to generate invoice?"
//               subtext="Invoice will be stored in the database."
//             />
//           </PageHeader>
//           <div className="flex flex-col gap-4">
//             <div className="flex gap-4">
//               <div className="flex">
//                 <div className="p-4 bg-white rounded-2xl flex flex-col gap-4 border border-gray-300 shadow">
//                   <h2 className="text-xl mt-2">Owner Details</h2>
//                   {vehicleInfo?.name && (
//                     <CustomerDetail text={vehicleInfo?.name} subtext={vehicleInfo?.email}>
//                       <User2 className="text-gray-500 size-6" />
//                     </CustomerDetail>
//                   )}
//                   {vehicleInfo?.company_name && (
//                     <CustomerDetail
//                       text={vehicleInfo?.company_name}
//                       subtext={vehicleInfo?.company_phone_number}
//                     >
//                       <Building2 className="text-gray-500 size-6" />
//                     </CustomerDetail>
//                   )}
//                   {vehicleInfo?.phone_number && (
//                     <CustomerDetail text={vehicleInfo?.phone_number}>
//                       <Phone className="text-gray-500 size-6" />
//                     </CustomerDetail>
//                   )}
//                   {vehicleInfo?.address && (
//                     <CustomerDetail text={vehicleInfo?.address}>
//                       <MapPin className="text-gray-500 size-6" />
//                     </CustomerDetail>
//                   )}
//                 </div>
//               </div>
//               <div>
//                 <div className="p-4 bg-white rounded-2xl flex flex-col gap-4 border border-gray-300 shadow h-full">
//                   <h2 className="text-xl mt-2">Vehicle Details</h2>
//                   {vehicleInfo?.make && (
//                     <CustomerDetail text={vehicleInfo?.make} subtext={vehicleInfo?.model}>
//                       <Car className="text-gray-500 size-6" />
//                     </CustomerDetail>
//                   )}
//                   {vehicleInfo?.vehicle_number && (
//                     <CustomerDetail text={vehicleInfo?.vehicle_number} subtext={vehicleInfo?.chassis_number}>
//                       <Hash className="text-gray-500 size-6" />
//                     </CustomerDetail>
//                   )}
               

//                   {vehicleInfo?.year && (
//                     <CustomerDetail text={vehicleInfo?.year}>
//                       <CalendarDays className="text-gray-500 size-6" />
//                     </CustomerDetail>
//                   )}
//                 </div>
//               </div>
//               <div className="grow">
//                 <div className="p-4 bg-white rounded-2xl flex flex-col gap-4 border  border-gray-300 shadow">
//                   <h2 className="text-xl mt-2">Service note</h2>
//                   <div className="flex flex-col gap-1 grow">
//                     {/* <label htmlFor="name" className="text-sm text-gray-500">
//                       Note
//                     </label> */}
//                     <textarea
//                       name="note"
//                       id="note"
//                       className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
//                       //   onChange={onMutate}
//                       value={serviceNote}
//                       // value={vehicleDetails.note}
//                       onChange={(e) => {
//                         setServiceNote(e.target.value);
//                       }}
//                       placeholder="About services"
//                       rows={7}
//                     ></textarea>
//                   </div>
//                 </div>
//                 {/* <InvoiceHeadInfo
//                   vehicleDetails={vehicleDetails}
//                   handleVehicleDetailsChange={handleVehicleDetailsChange}
//                 /> */}
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
//           </div>
//         </div>
//         <div className="flex justify-end">
//           <div className="w-fit">
//             <div className="p-4 bg-white rounded-2xl flex flex-col gap-4 border border-gray-300 shadow">
//               <h2 className="text-lg font-semibold mt-2 flex justify-between text-gray-600">
//                 Sub total: <p>{totalBill} aed</p>
//               </h2>
//               <h2 className="text-lg font-semibold mt-2 flex justify-between text-gray-600">
//                 After VAT: <p>{(totalBill + totalBill * (5 / 100)).toFixed(2)} aed</p>
//               </h2>
//               <div className="flex flex-col justify-end  gap-2">
//                 <div className="flex flex-col gap-1 grow">
//                   <label htmlFor="name" className="flex justify-between text-sm text-gray-500">
//                     <span>Discount</span>

//                     <span className="text-xs text-right text-gray-600">
//                       {((discountPercentge / 100) * (totalBill + totalBill * (5 / 100))).toFixed(2)}{" "}
//                       aed
//                     </span>
//                   </label>
//                   <input
//                     type="text"
//                     name=""
//                     id="name"
//                     className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
//                     //@ts-ignore
//                     onChange={(e) => setDiscountPrecentage(e?.target?.value)}
//                     value={discountPercentge}
//                     required
//                     placeholder="2.7%"
//                   />
//                 </div>{" "}
//                 <div className="flex flex-col gap-1 grow">
//                   <label htmlFor="payAmount" className="text-sm text-gray-500">
//                     Pay amount
//                   </label>
//                   <input
//                     type="text"
//                     name="payAmount"
//                     id="payAmount"
//                     className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
//                     //@ts-ignore
//                     onChange={handleAmountPaid}
//                     value={amountPaid}
//                     required
//                     placeholder="200 aed"
//                   />
//                 </div>{" "}
//                 <div className="flex flex-col gap-1 grow">
//                   <label htmlFor="name" className="text-sm text-gray-500">
//                     Payment status
//                   </label>
//                   <select
//                     name="products"
//                     id="products"
//                     disabled
//                     className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
//                     //@ts-ignore
//                     onChange={(e) => setPaymentStatus(e?.target?.value)}
//                     value={paymentStatus}
//                   >
//                     {paymentStatuses?.map((status: any) => (
//                       <option value={status.value} key={status.value}>
//                         {status.title}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <hr className="bg-gray-200 text-gray-300 my-4" />
//                 <h2 className="text-lg font-semibold flex justify-between text-gray-600">
//                   Total{" "}
//                   <p>
//                     {totalBill > 0
//                       ? (
//                           totalBill +
//                           totalBill * (5 / 100) -
//                           (discountPercentge / 100) * (totalBill + totalBill * (5 / 100))
//                         ).toFixed(2)
//                       : 0}{" "}
//                     aed
//                   </p>
//                 </h2>
//                 <h2 className="text-lg font-semibold flex justify-between text-gray-600">
//                   Remaining{" "}
//                   <p>
//                     {totalBill > 0
//                       ? (
//                           totalBill +
//                           totalBill * (5 / 100) -
//                           (discountPercentge / 100) * (totalBill + totalBill * (5 / 100)) -
//                           amountPaid
//                         ).toFixed(2)
//                       : 0}{" "}
//                     aed
//                   </p>
//                 </h2>
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





import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Building2,
  CalendarDays,
  Car,
  Hash,
  MapPin,
  Phone,
  User,
  ArrowLeft,
  FileText,
  Save,
  Loader2,
} from "lucide-react";
import InvoiceItem from "./components/InvoiceItem";
import AlertBox from "../../../components/AlertBox";

interface InvoiceItem {
  product: any;
  quantity: number;
  subtotal: number;
}

interface VehicleInfo {
  id: number;
  name: string;
  address: string;
  email: string;
  company_name: string;
  company_phone_number: string;
  make: string;
  model: string;
  phone_number: string;
  chassis_number: string;
  vehicle_number: string;
  year: string;
  created_at: string;
  created_by: number;
  updated_at: string;
  updated_by: number;
}

export const GenerateVehicleServiceInvoice = () => {
  const navigate = useNavigate();
  const params = useParams();

  const initialItemState: InvoiceItem = {
    product: null,
    quantity: 1,
    subtotal: 0,
  };

  const [products, setProducts] = useState([]);
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo | null>(null);
  const [serviceNote, setServiceNote] = useState("");
  const [totalBill, setTotalBill] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [items, setItems] = useState<InvoiceItem[]>([initialItemState]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const VAT_RATE = 0.05;

  useEffect(() => {
    Promise.allSettled([fetchAllProducts(), fetchVehicleInformation()]).finally(() =>
      setLoading(false)
    );
  }, []);

  const fetchAllProducts = async () => {
    try {
      //@ts-ignore
      const response = await window.electron.getProducts();
      setProducts(response || []);
    } catch (error) {
      toast.error("Failed to load products. Please try again.");
    }
  };

  const fetchVehicleInformation = async () => {
    try {
      //@ts-ignore
      const { response } = await window.electron.getVehicleDetails(params.vehicleId);
      setVehicleInfo(response);
    } catch (error) {
      toast.error("Failed to load vehicle information. Please try again.");
      navigate("/vehicles");
    }
  };

  const addNewItem = () => {
    setItems([...items, initialItemState]);
  };

  const handleProductChange = (id: number, idx: number) => {
    const prod: any = products.find((product: any) => product.id === id);
    const updatedItem = [...items];
    updatedItem[idx] = {
      ...updatedItem[idx],
      product: prod,
      subtotal: prod?.retail_price * items[idx].quantity,
    };
    const total = updatedItem.reduce((prev, curr) => prev + curr.subtotal, 0);
    setTotalBill(Number(total.toFixed(2)));
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
    const total = updatedItem.reduce((prev, curr) => prev + curr.subtotal, 0);
    setTotalBill(Number(total.toFixed(2)));
    setItems(updatedItem);
  };

  const deleteItem = (idx: number) => {
    const filteredItems = items.filter((_, itemIdx) => itemIdx !== idx);
    const total = filteredItems.reduce((prev, curr) => prev + curr.subtotal, 0);
    setTotalBill(Number(total.toFixed(2)));
    setItems(filteredItems);
  };

  const calculateTotals = () => {
    const subtotal = totalBill;
    const afterVat = subtotal + subtotal * VAT_RATE;
    const discountAmount = (discountPercentage / 100) * afterVat;
    const total = afterVat - discountAmount;
    const remaining = total - amountPaid;

    return {
      subtotal,
      afterVat,
      discountAmount,
      total,
      remaining,
    };
  };

  const handleInvoiceGeneration = async () => {
    setIsSubmitting(true);
    try {
      //@ts-ignore
      const userId = JSON.parse(localStorage.getItem("gear-square-user")).id;
      const totals = calculateTotals();

      //@ts-ignore
      const response = await window.electron.generateInvoice({
        items,
        vehicleDetails: {
          vehicle_id: params.vehicleId,
          note: serviceNote,
          createdBy: userId,
          updatedBy: userId,
          customerId: vehicleInfo?.id,
        },
        bill: {
          total: totals.total.toFixed(2),
          subtotal: totals.subtotal,
          discount: discountPercentage,
          billStatus: paymentStatus,
          amountPaid,
          vatAmount: (totals.subtotal * VAT_RATE).toFixed(2),
        },
      });

      if (response.success) {
        toast.success("Invoice generated successfully");
        navigate(`/invoice/${response.service_id}`);
      }
    } catch (error) {
      toast.error("Failed to generate invoice. Please try again.");
    } finally {
      setIsSubmitting(false);
      setShowConfirmDialog(false);
    }
  };

  const handleAmountPaid = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setAmountPaid(value);

    const totals = calculateTotals();
    if (value === 0) {
      setPaymentStatus(0);
    } else if (value > 0 && value < totals.total) {
      setPaymentStatus(1);
    } else if (value >= totals.total) {
      setPaymentStatus(2);
    }
  };

  const totals = calculateTotals();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8 px-8 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-white hover:shadow-sm flex items-center justify-center transition-all"
              >
                <ArrowLeft className="w-4 h-4 text-gray-700" />
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Generate Invoice</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Create service invoice for {vehicleInfo?.vehicle_number}
                </p>
              </div>
            </div>

            {items.length > 0 && items[0].product && (
              <button
                onClick={() => setShowConfirmDialog(true)}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
              >
                <Save className="w-4 h-4" />
                Generate Invoice
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Owner Details */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
              <User className="w-5 h-5 text-gray-600" />
              <h2 className="text-base font-semibold text-gray-900">Owner Details</h2>
            </div>
            <div className="space-y-3">
              {vehicleInfo?.name && (
                <InfoRow icon={<User className="w-4 h-4 text-gray-600" />} value={vehicleInfo.name} subValue={vehicleInfo.email} />
              )}
              {vehicleInfo?.company_name && (
                <InfoRow icon={<Building2 className="w-4 h-4 text-gray-600" />} value={vehicleInfo.company_name} subValue={vehicleInfo.company_phone_number} />
              )}
              {vehicleInfo?.phone_number && (
                <InfoRow icon={<Phone className="w-4 h-4 text-gray-600" />} value={vehicleInfo.phone_number} />
              )}
              {vehicleInfo?.address && (
                <InfoRow icon={<MapPin className="w-4 h-4 text-gray-600" />} value={vehicleInfo.address} />
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
              {vehicleInfo?.make && (
                <InfoRow icon={<Car className="w-4 h-4 text-gray-600" />} value={`${vehicleInfo.make} ${vehicleInfo.model || ''}`} />
              )}
              {vehicleInfo?.vehicle_number && (
                <InfoRow icon={<Hash className="w-4 h-4 text-gray-600" />} value={vehicleInfo.vehicle_number} subValue={`Chassis: ${vehicleInfo.chassis_number}`} />
              )}
              {vehicleInfo?.year && (
                <InfoRow icon={<CalendarDays className="w-4 h-4 text-gray-600" />} value={vehicleInfo.year} />
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

        {/* Invoice Items */}
        <div className="mb-6">
          <InvoiceItem
            products={products}
            handleProductChange={handleProductChange}
            handleQuantityChange={handleQuantityChange}
            handleSubtotal={handleSubtotal}
            items={items}
            addNewItem={addNewItem}
            deleteItem={deleteItem}
          />
        </div>

        {/* Summary */}
        <div className="flex justify-end">
          <div className="w-full max-w-md bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
              {/* <DollarSign className="w-5 h-5 text-gray-600" /> */}
              <h2 className="text-base font-semibold text-gray-900">Invoice Summary</h2>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">{totals.subtotal.toFixed(2)} AED</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">VAT (5%)</span>
                <span className="font-medium text-gray-900">{(totals.subtotal * VAT_RATE).toFixed(2)} AED</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">After VAT</span>
                <span className="font-medium text-gray-900">{totals.afterVat.toFixed(2)} AED</span>
              </div>

              <div className="space-y-2">
                <label htmlFor="discount" className="text-sm font-medium text-gray-700 flex justify-between">
                  <span>Discount (%)</span>
                  <span className="text-gray-500 font-normal">-{totals.discountAmount.toFixed(2)} AED</span>
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
                  value={amountPaid}
                  onChange={handleAmountPaid}
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

              <div className="pt-4 border-t-2 border-gray-900 space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">{totals.total.toFixed(2)} AED</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Remaining Balance</span>
                  <span className={`font-semibold ${totals.remaining > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {totals.remaining.toFixed(2)} AED
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Dialog */}
        <AlertBox
          open={showConfirmDialog}
          setOpen={setShowConfirmDialog}
          continueProcessHandler={handleInvoiceGeneration}
          text="Generate Invoice"
          subtext="Are you sure you want to generate this invoice? This action will create a permanent record."
        />
      </div>
    </div>
  );
};

// Info Row Component
const InfoRow = ({
  icon,
  value,
  subValue,
}: {
  icon: React.ReactNode;
  value: string;
  subValue?: string;
}) => (
  <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-900 break-words">{value}</p>
      {subValue && <p className="text-xs text-gray-500 mt-0.5">{subValue}</p>}
    </div>
  </div>
);