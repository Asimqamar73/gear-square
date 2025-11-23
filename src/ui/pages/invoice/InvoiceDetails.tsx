// import { Building2, CalendarDays, Car, Clock10, Download, Printer, User2 } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import ServiceItemTable from "./components/ServiceItemTable";
// import { dateFormatter, to12HourFormat } from "../../utils/DateFormatter";
// import { Badge } from "../../../components/ui/badge";
// import PageHeader from "../../../components/PageHeader";
// import { Button } from "../../../components/ui/button";
// import CustomSheet from "../../../components/CustomSheet";
// import { Separator } from "../../../components/ui/separator";
// import { Card } from "../../../components/ui/card";
// import MyDocument from "../../../components/PDF";
// import { pdf } from "@react-pdf/renderer"; // <-- updated import
// import { toast } from "sonner";
// import AlertBoxPDF from "../../../components/AlertBoxPDF";

// interface IInoviceDetails {
//   service: IService | undefined;
//   serviceItems: IServiceItems | undefined;
//   serviceBill: IServiceBill | undefined;
// }

// interface IService {
//   id: number;
//   service_id: number;
//   name: string;
//   company_name: string;
//   phone_number: string;
//   chassis_number: string;
//   company_phone_number: string;
//   vehicle_number: string;
//   created_at: string;
//   customer_id: number;
// }
// interface IServiceItems {
//   id: number;
//   item: number;
//   service_id: number;
//   quantity: number;
//   subtotal: number;
// }
// interface IServiceBill {
//   id: number;
//   discount: number;
//   subtotal: number;
//   total: number;
//   amount_paid: number;
//   amount_due: number;
//   bill_status: number;
//   vat_amount: number;
// }
// interface IPdfAction {
//   name: string;
//   addTRN: boolean;
// }

// const InvoiceDetails = () => {
//   const params = useParams();
//   const navigate = useNavigate();

//   const paymentStatuses: any = {
//   0: { value: "Unpaid", color: "bg-red-200 text-red-800" },
//   1: { value: "Partial", color: "bg-amber-200 text-amber-800" },
//   2: { value: "Paid", color: "bg-green-200 text-green-800" },
//   3: { value: "Overpaid", color: "bg-green-400 text-white" },
// };

//   const [details, setDetails] = useState<IInoviceDetails>();
//   const [isSheetOpen, setIsSheetOpen] = useState(false);
//   const [paymentAmount, setPaymentAmount] = useState<number | string>(0);
//   const [errorMessage, setErrorMessage] = useState("");

//   // modal state
//   const [open, setOpen] = useState(false);
//   const [pdfAction, setPdfAction] = useState<IPdfAction>({
//     name: "",
//     addTRN: false,
//   });

//   useEffect(() => {
//     fetchDetails(params.invoiceId);
//   }, []);

//   const fetchDetails = async (id: any) => {
//     try {
//       //@ts-ignore
//       const resp = await window.electron.getInvoiceDetails(id);
//       setDetails(resp);
//     } catch (error) {
//       toast.error("Something went wrong. Please restart the application", {
//         position: "top-center",
//       });
//     }
//   };

//   const handleSheetToggle = () => setIsSheetOpen(!isSheetOpen);

//   const handleUpdateInvoice = async () => {
//     //@ts-ignore
//     const newTotalPaid = Number(paymentAmount) + details?.serviceBill?.amount_paid;
//     try {
//       //@ts-ignore
//       await window.electron.updateServiceDuePayment({
//         billStatus: newTotalPaid === details?.serviceBill?.total ? 2 : 1,
//         amountPaid: newTotalPaid,
//         id: details?.serviceBill?.id,
//       });

//       fetchDetails(params.invoiceId);
//       setIsSheetOpen(false);
//     } catch (error) {}

//     toast.error("Something went wrong. Please restart the application", {
//       position: "top-center",
//     });
//   };

//   // New dynamic PDF download handler
//   const handleDownloadPDF = async () => {
//     if (!details) return;
//     try {
//       const blob = await pdf(
//         <MyDocument details={details} isTrnInclude={pdfAction.addTRN} />
//       ).toBlob();
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `${details.service?.name}-${details.service?.vehicle_number}.pdf`;
//       a.click();
//       URL.revokeObjectURL(url);
//     } catch (error) {
//       toast.error("Failed to generate PDF.");
//     }
//   };

//   // New dynamic PDF print handler
//   const handlePrintPDF = async () => {
//     if (!details) return;
//     try {
//       const blob = await pdf(
//         <MyDocument details={details} isTrnInclude={pdfAction.addTRN} />
//       ).toBlob();
//       const url = URL.createObjectURL(blob);
//       const printWindow = window.open(url, "_blank");
//       if (printWindow) printWindow.focus();
//     } catch (error) {
//       toast.error("Failed to generate PDF for printing.");
//     }
//   };

//   const handleInvoicePDF = () => {
//     if (pdfAction.name === "print") handlePrintPDF();
//     if (pdfAction.name === "download") handleDownloadPDF();
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <div className="py-16 px-8">
//         <div className="flex flex-col gap-2 mb-8">
//           <PageHeader title="Invoice details">
//             <div className="flex gap-0.5">
//               <Button
//                 className="bg-[#173468] text-white cursor-pointer"
//                 variant={"outline"}
//                 size={"icon"}
//                 onClick={() => {
//                   setOpen(true);
//                   setPdfAction({ ...pdfAction, name: "download" });
//                 }}
//               >
//                 <Download />
//               </Button>

//               <Button
//                 className="bg-[#173468] text-white cursor-pointer"
//                 variant={"outline"}
//                 size={"icon"}
//                 onClick={() => {
//                   setOpen(true);
//                   setPdfAction({ ...pdfAction, name: "print" });
//                 }}
//               >
//                 <Printer />
//               </Button>

//               <Button
//                 className="bg-[#173468] text-white"
//                 variant={"outline"}
//                 onClick={handleSheetToggle}
//               >
//                 Update payment
//               </Button>
//             </div>
//           </PageHeader>

//           {/* MAIN CONTENT BELOW — unchanged */}

//           <div className="col-span-5 flex flex-col lg:flex-row gap-6">
//             {/* Customer & Vehicle Details */}
//             <div className="grow p-6 bg-white rounded-2xl border border-gray-200 shadow-md flex flex-col gap-6">
//               <h2 className="text-2xl font-semibold text-gray-800">Customer & Vehicle Details</h2>

//               <div className="flex flex-col lg:flex-row gap-6">
//                 {/* Left Column: Customer */}
//                 <div className="flex-1 flex flex-col gap-4">
//                   <h3 className="text-lg font-semibold text-gray-700">Customer</h3>

//                   {details?.service?.name && (
//                     <div
//                       className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition"
//                       onClick={() => navigate(`/customer-details/${details?.service?.customer_id}`)}
//                     >
//                       <div className="p-2 border border-gray-300 rounded-xl bg-gray-100">
//                         <User2 className="text-gray-500" strokeWidth={1.5} />
//                       </div>
//                       <div className="flex flex-col">
//                         <p className="font-semibold text-gray-700">{details?.service?.name}</p>
//                         <p className="text-gray-500 text-sm">{details?.service?.phone_number}</p>
//                       </div>
//                     </div>
//                   )}

//                   {details?.service?.company_name && (
//                     <div
//                       className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition"
//                       onClick={() => navigate(`/customer-details/${details?.service?.customer_id}`)}
//                     >
//                       <div className="p-2 border border-gray-300 rounded-xl bg-gray-100">
//                         <Building2 className="text-gray-500" strokeWidth={1.5} />
//                       </div>
//                       <div className="flex flex-col">
//                         <p className="font-semibold text-gray-700">
//                           {details?.service?.company_name}
//                         </p>
//                         <p className="text-gray-500 text-sm">
//                           {details?.service?.company_phone_number}
//                         </p>
//                       </div>
//                     </div>
//                   )}

//                   {/* Vehicle Info */}
//                   <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 border border-gray-200">
//                     <div className="p-2 border border-gray-300 rounded-xl bg-gray-100">
//                       <Car className="text-gray-500" strokeWidth={1.5} />
//                     </div>
//                     <div className="flex flex-col">
//                       <p className="font-semibold text-gray-700">
//                         {details?.service?.vehicle_number}
//                       </p>
//                       <p className="text-gray-500 text-sm">{details?.service?.chassis_number}</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Right Column: Invoice Details */}
//                 <div className="flex-1 flex flex-col gap-4">
//                   <h3 className="text-lg font-semibold text-gray-700">Invoice Details</h3>
//                   <p className="font-semibold text-gray-700">Invoice # {details?.service?.id}</p>

//                   <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 border border-gray-200">
//                     <div className="p-2 border border-gray-300 rounded-xl bg-gray-100">
//                       <CalendarDays className="text-gray-500" strokeWidth={1.5} />
//                     </div>
//                     <p className="font-semibold text-gray-700">
//                       {details?.service?.created_at && dateFormatter(details?.service?.created_at)}
//                     </p>
//                   </div>

//                   <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 border border-gray-200">
//                     <div className="p-2 border border-gray-300 rounded-xl bg-gray-100">
//                       <Clock10 className="text-gray-500" strokeWidth={1.5} />
//                     </div>
//                     <p className="font-semibold text-gray-700">
//                       {details?.service?.created_at?.split(" ")[1] &&
//                         to12HourFormat(details?.service?.created_at.split(" ")[1])}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Payment Summary */}
//             <div className="grow p-6 bg-white rounded-2xl border border-gray-200 shadow-md flex flex-col gap-6">
//               <h2 className="text-2xl font-semibold text-gray-800">Payment Summary</h2>

//               <div className="flex flex-col gap-3">
//                 <div className="flex justify-between">
//                   <span>Subtotal</span>
//                   <span className="font-semibold text-gray-700">
//                     AED {details?.serviceBill?.subtotal?.toFixed(2)}
//                   </span>
//                 </div>

//                 <div className="flex justify-between">
//                   <span>VAT (5%)</span>
//                   <span className="font-semibold text-gray-700">
//                     AED {details?.serviceBill?.vat_amount?.toFixed(2)}
//                   </span>
//                 </div>

//                 <div className="flex justify-between">
//                   <span>Discount</span>
//                   <span className="font-semibold text-gray-700">
//                     {details?.serviceBill?.discount}%
//                   </span>
//                 </div>

//                 <div className="flex justify-between text-lg font-semibold text-gray-800 border-t border-gray-300 pt-2">
//                   <span>Total Amount</span>
//                   <span>AED {details?.serviceBill?.total?.toFixed(2)}</span>
//                 </div>

//                 <div className="flex justify-between mt-2">
//                   <span>Paid Amount</span>
//                   <span className="font-semibold text-gray-700">
//                     AED {details?.serviceBill?.amount_paid?.toFixed(2)}
//                   </span>
//                 </div>

//                 <div className="flex justify-between">
//                   <span>Outstanding Amount</span>
//                   <span className="font-semibold text-gray-700">
//                     AED {details?.serviceBill?.amount_due?.toFixed(2)}
//                   </span>
//                 </div>

//                 <div className="flex justify-between">
//                   <span>Payment Status</span>
//                   {details?.serviceBill && (
//                     <Badge
//                       variant="outline"
//                       className={`px-2 py-1 rounded-full ${
//                         paymentStatuses[details?.serviceBill?.bill_status]?.color
//                       } `}
//                     >
//                       {paymentStatuses[details?.serviceBill?.bill_status]?.value}
//                     </Badge>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Items table */}
//           <div className="mt-8">
//             <h2 className="font-semibold text-lg mb-1">Items detail</h2>
//             <ServiceItemTable data={details?.serviceItems} />
//           </div>
//         </div>
//         {/* PAYMENT SHEET (unchanged) */}
//         <CustomSheet
//           title="Update invoicess"
//           isOpen={isSheetOpen}
//           handleSheetToggle={() => setIsSheetOpen(false)}
//           handleSubmit={handleUpdateInvoice}
//         >
//           <div className="grid flex-1 auto-rows-min gap-2 px-4">
//             <Card className="px-4 bg-gray-200 border-gray-400 gap-2">
//               <div className="flex flex-col gap-2">
//                 <label>Subtotal</label>
//                 <input
//                   readOnly
//                   value={details?.serviceBill?.subtotal}
//                   className="p-1.5 indent-2 text-sm border rounded-md border-gray-500"
//                 />
//               </div>

//               <div className="flex flex-col gap-2">
//                 <label>Discount</label>
//                 <input
//                   readOnly
//                   value={details?.serviceBill?.discount}
//                   className="p-1.5 indent-2 text-sm border rounded-md border-gray-500"
//                 />
//               </div>

//               <div className="flex flex-col gap-2">
//                 <label>Grand total</label>
//                 <input
//                   readOnly
//                   value={details?.serviceBill?.subtotal}
//                   className="p-1.5 indent-2 text-sm border rounded-md border-gray-500"
//                 />
//               </div>
//             </Card>

//             <hr className="my-4" />

//             <Card className="px-4 bg-gray-200 border-gray-400 gap-2">
//               <div className="flex flex-col gap-2">
//                 <label>Paid amount</label>
//                 <input
//                   readOnly
//                   value={details?.serviceBill?.amount_paid}
//                   className="p-1.5 indent-2 text-sm border rounded-md border-gray-500"
//                 />
//               </div>

//               <div className="flex flex-col gap-2">
//                 <label>Due balance</label>
//                 <input
//                   readOnly
//                   value={details?.serviceBill?.amount_due}
//                   className="p-1.5 indent-2 text-sm border rounded-md border-gray-500"
//                 />
//               </div>
//             </Card>

//             <Separator className="my-4 bg-gray-500" />

//             <div className="flex flex-col gap-2">
//               <label>Payment amount</label>
//               <input
//                 type="number"
//                 min={1}
//                 value={paymentAmount}
//                 className="p-1.5 indent-2 text-sm border rounded-md"
//                 onChange={(e) => setPaymentAmount(e.target.value)}
//               />
//             </div>

//             {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
//           </div>
//         </CustomSheet>

//         {/* CONFIRMATION MODAL */}
//         <AlertBoxPDF
//           open={open}
//           setOpen={setOpen}
//           text={`${pdfAction.name.toLocaleUpperCase()} PDF?`}
//           subtext="Would you like to add TRN inside the document?"
//           continueProcessHandler={handleInvoicePDF} // dynamic PDF generation
//           pdfAction={pdfAction}
//           setPdfAction={setPdfAction}
//         />
//       </div>
//     </div>
//     // </div>
//   );
// };

// export default InvoiceDetails;

















import { 
  Building2, 
  CalendarDays, 
  Car, 
  Clock, 
  Download, 
  Printer, 
  User, 
  DollarSign,
  Receipt,
  CreditCard,
  AlertCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ServiceItemTable from "./components/ServiceItemTable";
import { dateFormatter, to12HourFormat } from "../../utils/DateFormatter";
import PageHeader from "../../../components/PageHeader";
import CustomSheet from "../../../components/CustomSheet";
import { Separator } from "../../../components/ui/separator";
import MyDocument from "../../../components/PDF";
import { pdf } from "@react-pdf/renderer";
import { toast } from "sonner";
import AlertBoxPDF from "../../../components/AlertBoxPDF";

interface InvoiceDetails {
  service: Service | undefined;
  serviceItems: ServiceItem[] | undefined;
  serviceBill: ServiceBill | undefined;
}

interface Service {
  id: number;
  service_id: number;
  name: string;
  company_name: string;
  phone_number: string;
  chassis_number: string;
  company_phone_number: string;
  vehicle_number: string;
  created_at: string;
  customer_id: number;
}

interface ServiceItem {
  id: number;
  item: number;
  service_id: number;
  quantity: number;
  subtotal: number;
  name: string;
  retail_price: number;
  image?: string;
}

interface ServiceBill {
  id: number;
  discount: number;
  subtotal: number;
  total: number;
  amount_paid: number;
  amount_due: number;
  bill_status: 0 | 1 | 2 | 3;
  vat_amount: number;
}

interface PdfAction {
  name: "print" | "download" | "";
  addTRN: boolean;
}

const InvoiceDetailsPage = () => {
  const params = useParams();
  const navigate = useNavigate();

  const paymentStatuses = {
    0: { label: "Unpaid", color: "bg-red-100 text-red-700 border-red-200", dot: "bg-red-500" },
    1: { label: "Partial", color: "bg-amber-100 text-amber-700 border-amber-200", dot: "bg-amber-500" },
    2: { label: "Paid", color: "bg-green-100 text-green-700 border-green-200", dot: "bg-green-500" },
    3: { label: "Overpaid", color: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  };

  const [details, setDetails] = useState<InvoiceDetails>();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number | string>("");
  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [pdfAction, setPdfAction] = useState<PdfAction>({
    name: "",
    addTRN: false,
  });

  useEffect(() => {
    fetchDetails(params.invoiceId);
  }, [params.invoiceId]);

  const fetchDetails = async (id: any) => {
    try {
      //@ts-ignore
      const resp = await window.electron.getInvoiceDetails(id);
      setDetails(resp);
    } catch (error) {
      toast.error("Failed to load invoice details. Please try again.", {
        position: "top-center",
      });
    }
  };

  const handleSheetToggle = () => {
    setIsSheetOpen(!isSheetOpen);
    setPaymentAmount("");
    setErrorMessage("");
  };

  const handleUpdateInvoice = async () => {
    const amount = Number(paymentAmount);
    
    if (!amount || amount <= 0) {
      setErrorMessage("Please enter a valid payment amount");
      return;
    }

    if (amount > (details?.serviceBill?.amount_due || 0)) {
      setErrorMessage("Payment amount cannot exceed outstanding balance");
      return;
    }

    const newTotalPaid = amount + (details?.serviceBill?.amount_paid || 0);
    
    try {
      //@ts-ignore
      await window.electron.updateServiceDuePayment({
        billStatus: newTotalPaid === details?.serviceBill?.total ? 2 : 1,
        amountPaid: newTotalPaid,
        id: details?.serviceBill?.id,
      });

      toast.success("Payment updated successfully!", { position: "top-center" });
      fetchDetails(params.invoiceId);
      setIsSheetOpen(false);
      setPaymentAmount("");
    } catch (error) {
      toast.error("Failed to update payment. Please try again.", {
        position: "top-center",
      });
    }
  };

  const handleDownloadPDF = async () => {
    if (!details) return;
    try {
      const blob = await pdf(
        <MyDocument details={details} isTrnInclude={pdfAction.addTRN} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Invoice-${details.service?.id}-${details.service?.vehicle_number}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      toast.error("Failed to generate PDF.");
    }
  };

  const handlePrintPDF = async () => {
    if (!details) return;
    try {
      const blob = await pdf(
        <MyDocument details={details} isTrnInclude={pdfAction.addTRN} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const printWindow = window.open(url, "_blank");
      if (printWindow) printWindow.focus();
    } catch (error) {
      toast.error("Failed to generate PDF for printing.");
    }
  };

  const handleInvoicePDF = () => {
    if (pdfAction.name === "print") handlePrintPDF();
    if (pdfAction.name === "download") handleDownloadPDF();
    setOpen(false);
  };

  const currentStatus = details?.serviceBill?.bill_status !== undefined 
    ? paymentStatuses[details.serviceBill.bill_status]
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="py-8 px-6 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <PageHeader title="Invoice Details">
            <div className="flex gap-2">
              <button
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-400 hover:bg-blue-500 text-white font-medium transition-colors shadow-sm"
                onClick={() => {
                  setOpen(true);
                  setPdfAction({ ...pdfAction, name: "download" });
                }}
              >
                <Download className="w-4 h-4" />
                Download
              </button>

              <button
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-800 text-white font-medium transition-colors shadow-sm"
                onClick={() => {
                  setOpen(true);
                  setPdfAction({ ...pdfAction, name: "print" });
                }}
              >
                <Printer className="w-4 h-4" />
                Print
              </button>

              <button
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-colors shadow-sm"
                onClick={handleSheetToggle}
              >
                <CreditCard className="w-4 h-4" />
                Update Payment
              </button>
            </div>
          </PageHeader>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Customer & Vehicle Details Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-xl font-bold text-gray-700">Customer & Vehicle Details</h2>
            </div>

            <div className="space-y-4">
              {/* Customer Info */}
              {details?.service?.name && (
                <div
                  className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 cursor-pointer transition-all"
                  onClick={() => navigate(`/customer-details/${details?.service?.customer_id}`)}
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    {/* <p className="text-sm text-gray-500 mb-1">Customer</p> */}
                    <p className="font-semibold text-sm text-gray-900">{details.service.name}</p>
                    <p className="text-sm text-gray-600 mt-0.5">{details.service.phone_number}</p>
                  </div>
                </div>
              )}

              {/* Company Info */}
              {details?.service?.company_name && (
                <div
                  className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 cursor-pointer transition-all"
                  onClick={() => navigate(`/customer-details/${details?.service?.customer_id}`)}
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    {/* <p className="text-sm text-gray-500 mb-1">Company</p> */}
                    <p className="font-semibold text-gray-900 text-sm">{details.service.company_name}</p>
                    <p className="text-gray-600 mt-0.5 text-xs">{details.service.company_phone_number}</p>
                  </div>
                </div>
              )}

              {/* Vehicle Info */}
              <div className="flex items-start gap-4 p-4 rounded-lg  border border-gray-200">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Car className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  {/* <p className="text-sm text-gray-500 mb-1">Vehicle</p> */}
                  <p className="font-semibold text-gray-900 text-sm">{details?.service?.vehicle_number}</p>
                  <p className="text-xs text-gray-600 mt-1">Chassis: {details?.service?.chassis_number}</p>
                </div>
              </div>

              {/* Invoice Metadata */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <CalendarDays className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="font-medium text-gray-900 text-sm">
                      {details?.service?.created_at && dateFormatter(details.service.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Time</p>
                    <p className="font-medium text-gray-900 text-sm">
                      {details?.service?.created_at?.split(" ")[1] &&
                        to12HourFormat(details.service.created_at.split(" ")[1])}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              {/* <DollarSign className="w-5 h-5 text-green-600" /> */}
              <h2 className="text-xl font-bold text-gray-700">Payment Summary</h2>
            </div>

            <div className="space-y-4">
              {/* Invoice Number */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                <span className="text-sm font-medium text-gray-700">Invoice Number</span>
                <span className="font-bold text-gray-600">#{details?.service?.id}</span>
              </div>

              {/* Financial Details */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    {details?.serviceBill?.subtotal?.toFixed(2)} AED
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">VAT (5%)</span>
                  <span className="font-semibold text-green-600">
                    +{details?.serviceBill?.vat_amount?.toFixed(2)} AED
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-semibold text-orange-600">
                    -{details?.serviceBill?.discount}%
                  </span>
                </div>

                <div className="pt-3 border-t-2 border-gray-300">
                  <div className="flex justify-between items-center text-gray-700 font-bold">
                    <span className="">Total Amount</span>
                    <span className="text-lg">
                      {details?.serviceBill?.total?.toFixed(2)} AED
                    </span>
                  </div>
                </div>

                <div className="pt-3 space-y-3 border-t border-gray-200">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Paid Amount</span>
                    <span className="font-semibold text-green-700">
                      {details?.serviceBill?.amount_paid?.toFixed(2)} AED
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Outstanding Balance</span>
                    <span className="font-semibold text-red-600">
                      {details?.serviceBill?.amount_due?.toFixed(2)} AED
                    </span>
                  </div>
                </div>

                {/* Payment Status Badge */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-200 text-sm">
                  <span className="text-gray-600">Payment Status</span>
                  {currentStatus && (
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${currentStatus.color}`}>
                      <span className={`w-2 h-2 rounded-full ${currentStatus.dot} mr-2`}></span>
                      {currentStatus.label}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Invoice Items</h2>
          <ServiceItemTable data={details?.serviceItems || []} />
        </div>

        {/* Payment Update Sheet */}
        <CustomSheet
          title="Update Payment"
          isOpen={isSheetOpen}
          handleSheetToggle={handleSheetToggle}
          handleSubmit={handleUpdateInvoice}
        >
          <div className="space-y-6 p-4">
            {/* Current Invoice Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 space-y-3 border border-blue-200">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Receipt className="w-4 h-4" />
                Invoice Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{details?.serviceBill?.subtotal?.toFixed(2)} AED</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-medium">{details?.serviceBill?.discount}%</span>
                </div>
                <div className="flex justify-between text-sm font-semibold pt-2 border-t border-blue-300">
                  <span>Total Amount</span>
                  <span>{details?.serviceBill?.total?.toFixed(2)} AED</span>
                </div>
              </div>
            </div>

            {/* Current Payment Status */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Payment Status
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Already Paid</span>
                  <span className="font-medium text-green-600">
                    {details?.serviceBill?.amount_paid?.toFixed(2)} AED
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Outstanding Balance</span>
                  <span className="font-medium text-red-600">
                    {details?.serviceBill?.amount_due?.toFixed(2)} AED
                  </span>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Payment Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Enter Payment Amount (AED)
              </label>
              <input
                type="number"
                min={0}
                max={details?.serviceBill?.amount_due}
                step="0.01"
                value={paymentAmount}
                placeholder="0.00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => {
                  setPaymentAmount(e.target.value);
                  setErrorMessage("");
                }}
              />
              <p className="text-xs text-gray-500">
                Maximum: {details?.serviceBill?.amount_due?.toFixed(2)} AED
              </p>
            </div>

            {errorMessage && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-600">{errorMessage}</p>
              </div>
            )}
          </div>
        </CustomSheet>

        {/* PDF Confirmation Modal */}
        <AlertBoxPDF
          open={open}
          setOpen={setOpen}
          text={`${pdfAction.name.toUpperCase()} Invoice PDF`}
          subtext="Would you like to include TRN in the document?"
          continueProcessHandler={handleInvoicePDF}
          pdfAction={pdfAction}
          setPdfAction={setPdfAction}
        />
      </div>
    </div>
  );
};

export default InvoiceDetailsPage;









// import { 
//   Building2, 
//   CalendarDays, 
//   Car, 
//   Clock, 
//   Download, 
//   Printer, 
//   User, 
//   DollarSign,
//   Receipt,
//   CreditCard,
//   AlertCircle,
//   FileText,
//   TrendingUp,
//   CheckCircle2,
//   ArrowLeft,
//   Sparkles
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import ServiceItemTable from "./components/ServiceItemTable";
// import { dateFormatter, to12HourFormat } from "../../utils/DateFormatter";
// import { Badge } from "../../../components/ui/badge";
// import PageHeader from "../../../components/PageHeader";
// import { Button } from "../../../components/ui/button";
// import CustomSheet from "../../../components/CustomSheet";
// import { Separator } from "../../../components/ui/separator";
// import { Card } from "../../../components/ui/card";
// import MyDocument from "../../../components/PDF";
// import { pdf } from "@react-pdf/renderer";
// import { toast } from "sonner";
// import AlertBoxPDF from "../../../components/AlertBoxPDF";

// interface InvoiceDetails {
//   service: Service | undefined;
//   serviceItems: ServiceItem[] | undefined;
//   serviceBill: ServiceBill | undefined;
// }

// interface Service {
//   id: number;
//   service_id: number;
//   name: string;
//   company_name: string;
//   phone_number: string;
//   chassis_number: string;
//   company_phone_number: string;
//   vehicle_number: string;
//   created_at: string;
//   customer_id: number;
// }

// interface ServiceItem {
//   id: number;
//   item: number;
//   service_id: number;
//   quantity: number;
//   subtotal: number;
//   name: string;
//   retail_price: number;
//   image?: string;
// }

// interface ServiceBill {
//   id: number;
//   discount: number;
//   subtotal: number;
//   total: number;
//   amount_paid: number;
//   amount_due: number;
//   bill_status: 0 | 1 | 2 | 3;
//   vat_amount: number;
// }

// interface PdfAction {
//   name: "print" | "download" | "";
//   addTRN: boolean;
// }

// const InvoiceDetailsPage = () => {
//   const params = useParams();
//   const navigate = useNavigate();

//   const paymentStatuses = {
//     0: { label: "Unpaid", color: "bg-red-100 text-red-700 border-red-300", gradient: "from-red-50 to-red-100", dot: "bg-red-500" },
//     1: { label: "Partial Payment", color: "bg-amber-100 text-amber-700 border-amber-300", gradient: "from-amber-50 to-amber-100", dot: "bg-amber-500" },
//     2: { label: "Paid in Full", color: "bg-green-100 text-green-700 border-green-300", gradient: "from-green-50 to-green-100", dot: "bg-green-500" },
//     3: { label: "Overpaid", color: "bg-emerald-100 text-emerald-700 border-emerald-300", gradient: "from-emerald-50 to-emerald-100", dot: "bg-emerald-500" },
//   };

//   const [details, setDetails] = useState<InvoiceDetails>();
//   const [isSheetOpen, setIsSheetOpen] = useState(false);
//   const [paymentAmount, setPaymentAmount] = useState<number | string>("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [open, setOpen] = useState(false);
//   const [pdfAction, setPdfAction] = useState<PdfAction>({
//     name: "",
//     addTRN: false,
//   });

//   useEffect(() => {
//     fetchDetails(params.invoiceId);
//   }, [params.invoiceId]);

//   const fetchDetails = async (id: any) => {
//     try {
//       //@ts-ignore
//       const resp = await window.electron.getInvoiceDetails(id);
//       setDetails(resp);
//     } catch (error) {
//       toast.error("Failed to load invoice details. Please try again.", {
//         position: "top-center",
//       });
//     }
//   };

//   const handleSheetToggle = () => {
//     setIsSheetOpen(!isSheetOpen);
//     setPaymentAmount("");
//     setErrorMessage("");
//   };

//   const handleUpdateInvoice = async () => {
//     const amount = Number(paymentAmount);
    
//     if (!amount || amount <= 0) {
//       setErrorMessage("Please enter a valid payment amount");
//       return;
//     }

//     if (amount > (details?.serviceBill?.amount_due || 0)) {
//       setErrorMessage("Payment amount cannot exceed outstanding balance");
//       return;
//     }

//     const newTotalPaid = amount + (details?.serviceBill?.amount_paid || 0);
    
//     try {
//       //@ts-ignore
//       await window.electron.updateServiceDuePayment({
//         billStatus: newTotalPaid === details?.serviceBill?.total ? 2 : 1,
//         amountPaid: newTotalPaid,
//         id: details?.serviceBill?.id,
//       });

//       toast.success("Payment updated successfully!", { position: "top-center" });
//       fetchDetails(params.invoiceId);
//       setIsSheetOpen(false);
//       setPaymentAmount("");
//     } catch (error) {
//       toast.error("Failed to update payment. Please try again.", {
//         position: "top-center",
//       });
//     }
//   };

//   const handleDownloadPDF = async () => {
//     if (!details) return;
//     try {
//       const blob = await pdf(
//         <MyDocument details={details} isTrnInclude={pdfAction.addTRN} />
//       ).toBlob();
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `Invoice-${details.service?.id}-${details.service?.vehicle_number}.pdf`;
//       a.click();
//       URL.revokeObjectURL(url);
//       toast.success("PDF downloaded successfully!");
//     } catch (error) {
//       toast.error("Failed to generate PDF.");
//     }
//   };

//   const handlePrintPDF = async () => {
//     if (!details) return;
//     try {
//       const blob = await pdf(
//         <MyDocument details={details} isTrnInclude={pdfAction.addTRN} />
//       ).toBlob();
//       const url = URL.createObjectURL(blob);
//       const printWindow = window.open(url, "_blank");
//       if (printWindow) printWindow.focus();
//     } catch (error) {
//       toast.error("Failed to generate PDF for printing.");
//     }
//   };

//   const handleInvoicePDF = () => {
//     if (pdfAction.name === "print") handlePrintPDF();
//     if (pdfAction.name === "download") handleDownloadPDF();
//     setOpen(false);
//   };

//   const currentStatus = details?.serviceBill?.bill_status !== undefined 
//     ? paymentStatuses[details.serviceBill.bill_status]
//     : null;

//   const paymentProgress = details?.serviceBill
//     ? (details.serviceBill.amount_paid / details.serviceBill.total) * 100
//     : 0;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//       <div className="py-8 px-6 max-w-[1600px] mx-auto">
//         {/* Enhanced Header with Background */}
//         <div className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <button
//                 onClick={() => navigate(-1)}
//                 className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
//               >
//                 <ArrowLeft className="w-5 h-5 text-gray-600" />
//               </button>
//               <div>
//                 <div className="flex items-center gap-3 mb-2">
//                   <FileText className="w-6 h-6 text-blue-600" />
//                   <h1 className="text-3xl font-bold text-gray-900">Invoice Details</h1>
//                 </div>
//                 <p className="text-gray-500">Invoice #{details?.service?.id}</p>
//               </div>
//             </div>
            
//             <div className="flex gap-2">
//               <button
//                 className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:-translate-y-0.5"
//                 onClick={() => {
//                   setOpen(true);
//                   setPdfAction({ ...pdfAction, name: "download" });
//                 }}
//               >
//                 <Download className="w-4 h-4" />
//                 Download PDF
//               </button>

//               <button
//                 className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white font-semibold transition-all shadow-lg shadow-gray-200 hover:shadow-xl hover:shadow-gray-300 hover:-translate-y-0.5"
//                 onClick={() => {
//                   setOpen(true);
//                   setPdfAction({ ...pdfAction, name: "print" });
//                 }}
//               >
//                 <Printer className="w-4 h-4" />
//                 Print
//               </button>

//               <button
//                 className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold transition-all shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 hover:-translate-y-0.5"
//                 onClick={handleSheetToggle}
//               >
//                 <CreditCard className="w-4 h-4" />
//                 Record Payment
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Main Content Grid */}
//         <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
//           {/* Customer & Vehicle Details Card */}
//           <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-xl p-8">
//             <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-200">
//               <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
//                 <Receipt className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-900">Customer & Vehicle</h2>
//                 <p className="text-sm text-gray-500">Client and service details</p>
//               </div>
//             </div>

//             <div className="grid md:grid-cols-2 gap-6">
//               {/* Customer Info */}
//               {details?.service?.name && (
//                 <div
//                   className="group relative overflow-hidden flex items-start gap-4 p-5 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border-2 border-blue-200 hover:border-blue-300 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
//                   onClick={() => navigate(`/customer-details/${details?.service?.customer_id}`)}
//                 >
//                   <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400 opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
//                   <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
//                     <User className="w-7 h-7 text-white" />
//                   </div>
//                   <div className="relative flex-1 min-w-0">
//                     <p className="text-xs font-medium text-blue-600 mb-1 uppercase tracking-wide">Customer</p>
//                     <p className="font-bold text-gray-900 text-lg mb-1">{details.service.name}</p>
//                     <p className="text-sm text-gray-600 flex items-center gap-1">
//                       <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
//                       {details.service.phone_number}
//                     </p>
//                   </div>
//                 </div>
//               )}

//               {/* Company Info */}
//               {details?.service?.company_name && (
//                 <div
//                   className="group relative overflow-hidden flex items-start gap-4 p-5 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-2 border-purple-200 hover:border-purple-300 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
//                   onClick={() => navigate(`/customer-details/${details?.service?.customer_id}`)}
//                 >
//                   <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400 opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
//                   <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
//                     <Building2 className="w-7 h-7 text-white" />
//                   </div>
//                   <div className="relative flex-1 min-w-0">
//                     <p className="text-xs font-medium text-purple-600 mb-1 uppercase tracking-wide">Company</p>
//                     <p className="font-bold text-gray-900 text-lg mb-1">{details.service.company_name}</p>
//                     <p className="text-sm text-gray-600 flex items-center gap-1">
//                       <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
//                       {details.service.company_phone_number}
//                     </p>
//                   </div>
//                 </div>
//               )}

//               {/* Vehicle Info - Full Width */}
//               <div className="md:col-span-2 relative overflow-hidden flex items-center gap-5 p-6 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 shadow-2xl">
//                 <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
//                 <div className="relative w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 shadow-2xl border-2 border-white/30">
//                   <Car className="w-8 h-8 text-white" />
//                 </div>
//                 <div className="relative flex-1">
//                   <p className="text-xs font-semibold text-blue-100 mb-2 uppercase tracking-wider">Vehicle Information</p>
//                   <p className="font-bold text-white text-2xl mb-2">{details?.service?.vehicle_number}</p>
//                   <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/30">
//                     <span className="text-xs text-blue-100">Chassis:</span>
//                     <span className="text-sm font-mono font-semibold text-white">{details?.service?.chassis_number}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Date & Time */}
//               <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
//                 <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center shadow-lg">
//                   <CalendarDays className="w-6 h-6 text-white" />
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-500 mb-0.5">Invoice Date</p>
//                   <p className="font-bold text-gray-900">
//                     {details?.service?.created_at && dateFormatter(details.service.created_at)}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
//                 <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-400 flex items-center justify-center shadow-lg">
//                   <Clock className="w-6 h-6 text-white" />
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-500 mb-0.5">Time</p>
//                   <p className="font-bold text-gray-900">
//                     {details?.service?.created_at?.split(" ")[1] &&
//                       to12HourFormat(details.service.created_at.split(" ")[1])}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Payment Summary Card */}
//           <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-8">
//             <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-200">
//               <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
//                 <DollarSign className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-900">Payment</h2>
//                 <p className="text-sm text-gray-500">Financial summary</p>
//               </div>
//             </div>

//             <div className="space-y-6">
//               {/* Status Badge */}
//               {currentStatus && (
//                 <div className={`relative overflow-hidden p-5 rounded-xl bg-gradient-to-r ${currentStatus.gradient} border-2 ${currentStatus.color.split(' ').pop()?.replace('text', 'border')}`}>
//                   <div className="flex items-center justify-between mb-3">
//                     <span className="text-sm font-semibold text-gray-700">Payment Status</span>
//                     <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border-2 ${currentStatus.color}`}>
//                       <span className={`w-2 h-2 rounded-full ${currentStatus.dot} mr-2 animate-pulse`}></span>
//                       {currentStatus.label}
//                     </span>
//                   </div>
                  
//                   {/* Progress Bar */}
//                   <div className="relative h-3 bg-white/50 rounded-full overflow-hidden">
//                     <div 
//                       className={`h-full rounded-full transition-all duration-1000 ease-out ${currentStatus.dot}`}
//                       style={{ width: `${paymentProgress}%` }}
//                     ></div>
//                   </div>
//                   <p className="text-xs text-gray-600 mt-2 text-right">{paymentProgress.toFixed(0)}% paid</p>
//                 </div>
//               )}

//               {/* Financial Breakdown */}
//               <div className="space-y-4 p-5 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl border border-gray-200">
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-600">Subtotal</span>
//                   <span className="font-bold text-gray-900">
//                     {details?.serviceBill?.subtotal?.toFixed(2)} AED
//                   </span>
//                 </div>

//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-600">VAT (5%)</span>
//                   <span className="font-bold text-green-600">
//                     +{details?.serviceBill?.vat_amount?.toFixed(2)} AED
//                   </span>
//                 </div>

//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-600">Discount</span>
//                   <span className="font-bold text-orange-600">
//                     -{details?.serviceBill?.discount}%
//                   </span>
//                 </div>

//                 <div className="pt-4 border-t-2 border-gray-300">
//                   <div className="flex justify-between items-center">
//                     <span className="font-bold text-gray-900">Grand Total</span>
//                     <span className="text-2xl font-black text-gray-900">
//                       {details?.serviceBill?.total?.toFixed(2)} AED
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Payment Details */}
//               <div className="space-y-3">
//                 <div className="flex justify-between items-center p-4 rounded-xl bg-green-50 border border-green-200">
//                   <div className="flex items-center gap-2">
//                     <CheckCircle2 className="w-4 h-4 text-green-600" />
//                     <span className="text-sm font-medium text-green-900">Amount Paid</span>
//                   </div>
//                   <span className="font-bold text-green-700 text-lg">
//                     {details?.serviceBill?.amount_paid?.toFixed(2)} AED
//                   </span>
//                 </div>

//                 <div className="flex justify-between items-center p-4 rounded-xl bg-red-50 border border-red-200">
//                   <div className="flex items-center gap-2">
//                     <TrendingUp className="w-4 h-4 text-red-600" />
//                     <span className="text-sm font-medium text-red-900">Outstanding</span>
//                   </div>
//                   <span className="font-bold text-red-700 text-lg">
//                     {details?.serviceBill?.amount_due?.toFixed(2)} AED
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Items Table */}
//         <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-8">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
//               <Sparkles className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900">Invoice Items</h2>
//               <p className="text-sm text-gray-500">Products and services breakdown</p>
//             </div>
//           </div>
//           <ServiceItemTable data={details?.serviceItems || []} />
//         </div>

//         {/* Payment Update Sheet */}
//         <CustomSheet
//           title="Record Payment"
//           isOpen={isSheetOpen}
//           handleSheetToggle={handleSheetToggle}
//           handleSubmit={handleUpdateInvoice}
//         >
//           <div className="space-y-6 p-4">
//             {/* Current Invoice Summary */}
//             <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50 rounded-xl p-5 space-y-4 border-2 border-blue-200 shadow-lg">
//               <div className="flex items-center gap-2 pb-2 border-b border-blue-200">
//                 <Receipt className="w-5 h-5 text-blue-600" />
//                 <h3 className="font-bold text-gray-900">Invoice Summary</h3>
//               </div>
//               <div className="space-y-3">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-700">Subtotal</span>
//                   <span className="font-bold text-gray-900">{details?.serviceBill?.subtotal?.toFixed(2)} AED</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-700">Discount</span>
//                   <span className="font-bold text-orange-600">{details?.serviceBill?.discount}%</span>
//                 </div>
//                 <div className="flex justify-between text-base font-bold pt-3 border-t-2 border-blue-300">
//                   <span className="text-gray-900">Total Amount</span>
//                   <span className="text-blue-600">{details?.serviceBill?.total?.toFixed(2)} AED</span>
//                 </div>
//               </div>
//             </div>

//             {/* Current Payment Status */}
//             <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-5 space-y-4 border-2 border-gray-200 shadow-lg">
//               <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
//                 <CreditCard className="w-5 h-5 text-gray-600" />
//                 <h3 className="font-bold text-gray-900">Current Status</h3>
//               </div>
//               <div className="space-y-3">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-700">Paid to Date</span>
//                   <span className="font-bold text-green-600">
//                     {details?.serviceBill?.amount_paid?.toFixed(2)} AED
//                   </span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-700">Remaining Balance</span>
//                   <span className="font-bold text-red-600">
//                     {details?.serviceBill?.amount_due?.toFixed(2)} AED
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <Separator className="my-6" />

//             {/* Payment Input */}
//             <div className="space-y-3">
//               <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
//                 <DollarSign className="w-5 h-5 text-green-600" />
//                 Enter Payment Amount (AED)
//               </label>
//               <div className="relative">
//                 <input
//                   type="number"
//                   min={0}
//                   max={details?.serviceBill?.amount_due}
//                   step="0.01"
//                   value={paymentAmount}
//                   placeholder="0.00"
//                   className="w-full px-5 py-4 text-lg font-semibold border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all"
//                   onChange={(e) => {
//                     setPaymentAmount(e.target.value);
//                     setErrorMessage("");
//                   }}
//                 />
//                 <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">AED</span>
//               </div>
//               <p className="text-xs text-gray-500 flex items-center gap-1">
//                 <AlertCircle className="w-3 h-3" />
//                 Maximum payable: <strong>{details?.serviceBill?.amount_due?.toFixed(2)} AED</strong>
//               </p>
//             </div>

//             {errorMessage && (
//               <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl shadow-sm">
//                 <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
//                 <p className="text-sm font-medium text-red-700">{errorMessage}</p>
//               </div>
//             )}
//           </div>
//         </CustomSheet>

//         {/* PDF Confirmation Modal */}
//         <AlertBoxPDF
//           open={open}
//           setOpen={setOpen}
//           text={`${pdfAction.name.toUpperCase()} Invoice PDF`}
//           subtext="Would you like to include TRN in the document?"
//           continueProcessHandler={handleInvoicePDF}
//           pdfAction={pdfAction}
//           setPdfAction={setPdfAction}
//         />
//       </div>
//     </div>

//   );
// };

// export default InvoiceDetailsPage;












// import { 
//   Building2, 
//   CalendarDays, 
//   Car, 
//   Clock, 
//   Download, 
//   Printer, 
//   User, 
//   DollarSign,
//   Receipt,
//   CreditCard,
//   AlertCircle,
//   FileText,
//   ArrowLeft,
//   CheckCircle2
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import ServiceItemTable from "./components/ServiceItemTable";
// import { dateFormatter, to12HourFormat } from "../../utils/DateFormatter";
// import { Badge } from "../../../components/ui/badge";
// import PageHeader from "../../../components/PageHeader";
// import { Button } from "../../../components/ui/button";
// import CustomSheet from "../../../components/CustomSheet";
// import { Separator } from "../../../components/ui/separator";
// import { Card } from "../../../components/ui/card";
// import MyDocument from "../../../components/PDF";
// import { pdf } from "@react-pdf/renderer";
// import { toast } from "sonner";
// import AlertBoxPDF from "../../../components/AlertBoxPDF";

// interface InvoiceDetails {
//   service: Service | undefined;
//   serviceItems: ServiceItem[] | undefined;
//   serviceBill: ServiceBill | undefined;
// }

// interface Service {
//   id: number;
//   service_id: number;
//   name: string;
//   company_name: string;
//   phone_number: string;
//   chassis_number: string;
//   company_phone_number: string;
//   vehicle_number: string;
//   created_at: string;
//   customer_id: number;
// }

// interface ServiceItem {
//   id: number;
//   item: number;
//   service_id: number;
//   quantity: number;
//   subtotal: number;
//   name: string;
//   retail_price: number;
//   image?: string;
// }

// interface ServiceBill {
//   id: number;
//   discount: number;
//   subtotal: number;
//   total: number;
//   amount_paid: number;
//   amount_due: number;
//   bill_status: 0 | 1 | 2 | 3;
//   vat_amount: number;
// }

// interface PdfAction {
//   name: "print" | "download" | "";
//   addTRN: boolean;
// }

// const InvoiceDetailsPage = () => {
//   const params = useParams();
//   const navigate = useNavigate();

//   const paymentStatuses = {
//     0: { label: "Unpaid", color: "border-l-red-500 bg-red-50/50 text-red-700" },
//     1: { label: "Partially Paid", color: "border-l-amber-500 bg-amber-50/50 text-amber-700" },
//     2: { label: "Paid", color: "border-l-green-500 bg-green-50/50 text-green-700" },
//     3: { label: "Overpaid", color: "border-l-emerald-500 bg-emerald-50/50 text-emerald-700" },
//   };

//   const [details, setDetails] = useState<InvoiceDetails>();
//   const [isSheetOpen, setIsSheetOpen] = useState(false);
//   const [paymentAmount, setPaymentAmount] = useState<number | string>("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [open, setOpen] = useState(false);
//   const [pdfAction, setPdfAction] = useState<PdfAction>({
//     name: "",
//     addTRN: false,
//   });

//   useEffect(() => {
//     fetchDetails(params.invoiceId);
//   }, [params.invoiceId]);

//   const fetchDetails = async (id: any) => {
//     try {
//       //@ts-ignore
//       const resp = await window.electron.getInvoiceDetails(id);
//       setDetails(resp);
//     } catch (error) {
//       toast.error("Failed to load invoice details. Please try again.", {
//         position: "top-center",
//       });
//     }
//   };

//   const handleSheetToggle = () => {
//     setIsSheetOpen(!isSheetOpen);
//     setPaymentAmount("");
//     setErrorMessage("");
//   };

//   const handleUpdateInvoice = async () => {
//     const amount = Number(paymentAmount);
    
//     if (!amount || amount <= 0) {
//       setErrorMessage("Please enter a valid payment amount");
//       return;
//     }

//     if (amount > (details?.serviceBill?.amount_due || 0)) {
//       setErrorMessage("Payment amount cannot exceed outstanding balance");
//       return;
//     }

//     const newTotalPaid = amount + (details?.serviceBill?.amount_paid || 0);
    
//     try {
//       //@ts-ignore
//       await window.electron.updateServiceDuePayment({
//         billStatus: newTotalPaid === details?.serviceBill?.total ? 2 : 1,
//         amountPaid: newTotalPaid,
//         id: details?.serviceBill?.id,
//       });

//       toast.success("Payment updated successfully!", { position: "top-center" });
//       fetchDetails(params.invoiceId);
//       setIsSheetOpen(false);
//       setPaymentAmount("");
//     } catch (error) {
//       toast.error("Failed to update payment. Please try again.", {
//         position: "top-center",
//       });
//     }
//   };

//   const handleDownloadPDF = async () => {
//     if (!details) return;
//     try {
//       const blob = await pdf(
//         <MyDocument details={details} isTrnInclude={pdfAction.addTRN} />
//       ).toBlob();
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `Invoice-${details.service?.id}-${details.service?.vehicle_number}.pdf`;
//       a.click();
//       URL.revokeObjectURL(url);
//       toast.success("PDF downloaded successfully!");
//     } catch (error) {
//       toast.error("Failed to generate PDF.");
//     }
//   };

//   const handlePrintPDF = async () => {
//     if (!details) return;
//     try {
//       const blob = await pdf(
//         <MyDocument details={details} isTrnInclude={pdfAction.addTRN} />
//       ).toBlob();
//       const url = URL.createObjectURL(blob);
//       const printWindow = window.open(url, "_blank");
//       if (printWindow) printWindow.focus();
//     } catch (error) {
//       toast.error("Failed to generate PDF for printing.");
//     }
//   };

//   const handleInvoicePDF = () => {
//     if (pdfAction.name === "print") handlePrintPDF();
//     if (pdfAction.name === "download") handleDownloadPDF();
//     setOpen(false);
//   };

//   const currentStatus = details?.serviceBill?.bill_status !== undefined 
//     ? paymentStatuses[details.serviceBill.bill_status]
//     : null;

//   const paymentProgress = details?.serviceBill
//     ? (details.serviceBill.amount_paid / details.serviceBill.total) * 100
//     : 0;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="py-6 px-6 max-w-[1400px] mx-auto">
        
//         {/* Minimal Header */}
//         <div className="mb-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <button
//                 onClick={() => navigate(-1)}
//                 className="w-9 h-9 rounded-lg border border-gray-300 hover:bg-gray-100 flex items-center justify-center transition-colors"
//               >
//                 <ArrowLeft className="w-4 h-4 text-gray-600" />
//               </button>
//               <div>
//                 <h1 className="text-2xl font-semibold text-gray-900">Invoice #{details?.service?.id}</h1>
//                 <p className="text-sm text-gray-500 mt-0.5">
//                   {details?.service?.created_at && dateFormatter(details.service.created_at)}
//                 </p>
//               </div>
//             </div>
            
//             <div className="flex gap-2">
//               <button
//                 className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors"
//                 onClick={() => {
//                   setOpen(true);
//                   setPdfAction({ ...pdfAction, name: "download" });
//                 }}
//               >
//                 <Download className="w-4 h-4" />
//                 Download
//               </button>

//               <button
//                 className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors"
//                 onClick={() => {
//                   setOpen(true);
//                   setPdfAction({ ...pdfaction, name: "print" });
//                 }}
//               >
//                 <Printer className="w-4 h-4" />
//                 Print
//               </button>

//               <button
//                 className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium transition-colors"
//                 onClick={handleSheetToggle}
//               >
//                 <CreditCard className="w-4 h-4" />
//                 Record Payment
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Main Content Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
          
//           {/* Customer & Vehicle Details */}
//           <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
//             <h2 className="text-base font-semibold text-gray-900 mb-5">Details</h2>

//             <div className="space-y-4">
//               {/* Customer */}
//               {details?.service?.name && (
//                 <div
//                   className="group flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer transition-all"
//                   onClick={() => navigate(`/customer-details/${details?.service?.customer_id}`)}
//                 >
//                   <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
//                     <User className="w-5 h-5 text-gray-600" />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-xs text-gray-500 mb-0.5">Customer</p>
//                     <p className="font-medium text-gray-900">{details.service.name}</p>
//                     <p className="text-sm text-gray-600 mt-0.5">{details.service.phone_number}</p>
//                   </div>
//                 </div>
//               )}

//               {/* Company */}
//               {details?.service?.company_name && (
//                 <div
//                   className="group flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer transition-all"
//                   onClick={() => navigate(`/customer-details/${details?.service?.customer_id}`)}
//                 >
//                   <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
//                     <Building2 className="w-5 h-5 text-gray-600" />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-xs text-gray-500 mb-0.5">Company</p>
//                     <p className="font-medium text-gray-900">{details.service.company_name}</p>
//                     <p className="text-sm text-gray-600 mt-0.5">{details.service.company_phone_number}</p>
//                   </div>
//                 </div>
//               )}

//               {/* Vehicle */}
//               <div className="flex items-center gap-4 p-4 rounded-lg border border-gray-300 bg-gray-50">
//                 <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0">
//                   <Car className="w-5 h-5 text-white" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-xs text-gray-500 mb-0.5">Vehicle</p>
//                   <p className="font-semibold text-gray-900">{details?.service?.vehicle_number}</p>
//                   <p className="text-sm text-gray-600 mt-0.5 font-mono">{details?.service?.chassis_number}</p>
//                 </div>
//               </div>

//               {/* Date & Time */}
//               <div className="grid grid-cols-2 gap-4 pt-2">
//                 <div className="flex items-center gap-3">
//                   <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
//                     <CalendarDays className="w-4 h-4 text-gray-600" />
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-500">Date</p>
//                     <p className="text-sm font-medium text-gray-900">
//                       {details?.service?.created_at && dateFormatter(details.service.created_at)}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
//                     <Clock className="w-4 h-4 text-gray-600" />
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-500">Time</p>
//                     <p className="text-sm font-medium text-gray-900">
//                       {details?.service?.created_at?.split(" ")[1] &&
//                         to12HourFormat(details.service.created_at.split(" ")[1])}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Payment Summary */}
//           <div className="bg-white rounded-lg border border-gray-200 p-6">
//             <h2 className="text-base font-semibold text-gray-900 mb-5">Payment Summary</h2>

//             <div className="space-y-5">
//               {/* Status */}
//               {currentStatus && (
//                 <div className={`p-4 rounded-lg border-l-4 ${currentStatus.color}`}>
//                   <div className="flex items-center justify-between mb-3">
//                     <span className="text-xs uppercase tracking-wide font-medium text-gray-600">Status</span>
//                     <span className="text-sm font-semibold">{currentStatus.label}</span>
//                   </div>
//                   <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
//                     <div 
//                       className="h-full bg-gray-900 rounded-full transition-all duration-700"
//                       style={{ width: `${paymentProgress}%` }}
//                     ></div>
//                   </div>
//                   <p className="text-xs text-gray-500 mt-2 text-right">{paymentProgress.toFixed(1)}% paid</p>
//                 </div>
//               )}

//               {/* Amounts */}
//               <div className="space-y-3 pt-3 border-t border-gray-200">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Subtotal</span>
//                   <span className="font-medium text-gray-900">
//                     {details?.serviceBill?.subtotal?.toFixed(2)} AED
//                   </span>
//                 </div>

//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">VAT (5%)</span>
//                   <span className="font-medium text-gray-900">
//                     {details?.serviceBill?.vat_amount?.toFixed(2)} AED
//                   </span>
//                 </div>

//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Discount</span>
//                   <span className="font-medium text-gray-900">
//                     {details?.serviceBill?.discount}%
//                   </span>
//                 </div>

//                 <div className="pt-3 border-t-2 border-gray-900">
//                   <div className="flex justify-between">
//                     <span className="font-semibold text-gray-900">Total</span>
//                     <span className="text-xl font-semibold text-gray-900">
//                       {details?.serviceBill?.total?.toFixed(2)} AED
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Payment Details */}
//               <div className="space-y-2.5 pt-3 border-t border-gray-200">
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-600">Amount Paid</span>
//                   <span className="text-sm font-semibold text-gray-900">
//                     {details?.serviceBill?.amount_paid?.toFixed(2)} AED
//                   </span>
//                 </div>

//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-600">Outstanding</span>
//                   <span className="text-sm font-semibold text-gray-900">
//                     {details?.serviceBill?.amount_due?.toFixed(2)} AED
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Items Table */}
//         <div className="bg-white rounded-lg border border-gray-200 p-6">
//           <h2 className="text-base font-semibold text-gray-900 mb-4">Items</h2>
//           <ServiceItemTable data={details?.serviceItems || []} />
//         </div>

//         {/* Payment Update Sheet */}
//         <CustomSheet
//           title="Record Payment"
//           isOpen={isSheetOpen}
//           handleSheetToggle={handleSheetToggle}
//           handleSubmit={handleUpdateInvoice}
//         >
//           <div className="space-y-5 p-4">
//             {/* Invoice Summary */}
//             <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
//               <h3 className="text-sm font-semibold text-gray-900">Invoice Summary</h3>
//               <div className="space-y-2">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Subtotal</span>
//                   <span className="font-medium">{details?.serviceBill?.subtotal?.toFixed(2)} AED</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Discount</span>
//                   <span className="font-medium">{details?.serviceBill?.discount}%</span>
//                 </div>
//                 <div className="flex justify-between text-sm font-semibold pt-2 border-t border-gray-300">
//                   <span>Total</span>
//                   <span>{details?.serviceBill?.total?.toFixed(2)} AED</span>
//                 </div>
//               </div>
//             </div>

//             {/* Payment Status */}
//             <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
//               <h3 className="text-sm font-semibold text-gray-900">Payment Status</h3>
//               <div className="space-y-2">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Paid</span>
//                   <span className="font-medium text-gray-900">
//                     {details?.serviceBill?.amount_paid?.toFixed(2)} AED
//                   </span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Outstanding</span>
//                   <span className="font-medium text-gray-900">
//                     {details?.serviceBill?.amount_due?.toFixed(2)} AED
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <Separator />

//             {/* Payment Input */}
//             <div className="space-y-2">
//               <label className="text-sm font-medium text-gray-900">
//                 Payment Amount (AED)
//               </label>
//               <input
//                 type="number"
//                 min={0}
//                 max={details?.serviceBill?.amount_due}
//                 step="0.01"
//                 value={paymentAmount}
//                 placeholder="0.00"
//                 className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
//                 onChange={(e) => {
//                   setPaymentAmount(e.target.value);
//                   setErrorMessage("");
//                 }}
//               />
//               <p className="text-xs text-gray-500">
//                 Maximum: {details?.serviceBill?.amount_due?.toFixed(2)} AED
//               </p>
//             </div>

//             {errorMessage && (
//               <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
//                 <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
//                 <p className="text-sm text-red-700">{errorMessage}</p>
//               </div>
//             )}
//           </div>
//         </CustomSheet>

//         {/* PDF Confirmation Modal */}
//         <AlertBoxPDF
//           open={open}
//           setOpen={setOpen}
//           text={`${pdfAction.name.toUpperCase()} Invoice PDF`}
//           subtext="Would you like to include TRN in the document?"
//           continueProcessHandler={handleInvoicePDF}
//           pdfAction={pdfAction}
//           setPdfAction={setPdfAction}
//         />
//       </div>
//     </div>
//   );
// };

// export default InvoiceDetailsPage;