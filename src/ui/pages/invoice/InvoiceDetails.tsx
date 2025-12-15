import {
  Building2,
  CalendarDays,
  Car,
  Clock,
  Download,
  Printer,
  User,
  CreditCard,
  AlertCircle,
  Edit2,
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
import ServiceLaborsListTable from "./components/ServiceLaborsListTable";

interface InvoiceDetails {
  service: Service | undefined;
  serviceItems: ServiceItem[] | undefined;
  serviceBill: ServiceBill | undefined;
  serviceLaborCostList: ILaborCostList[] | undefined;
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
  labor_cost: number;
  created_at: string;
  trn: string;
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
interface ILaborCostList {
  id?: string | number;
  description: string;
  labour_type: number;
  amount: number;
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
  addPaymentDetails: boolean;
}

const InvoiceDetailsPage = () => {
  const params = useParams();
  const navigate = useNavigate();

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

  const [details, setDetails] = useState<InvoiceDetails>();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number | string>("");
  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [pdfAction, setPdfAction] = useState<PdfAction>({
    name: "",
    addTRN: false,
    addPaymentDetails: false,
  });

  useEffect(() => {
    fetchDetails(params.invoiceId);
  }, [params.invoiceId]);

  const fetchDetails = async (id: any) => {
    try {
      //@ts-ignore
      const resp = await window.electron.getInvoiceDetails(id);
      console.log("resp", resp);
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

    if (amount > (Number(details?.serviceBill?.amount_due.toFixed(2)) || 0)) {
      setErrorMessage("Payment amount cannot exceed outstanding balance");
      return;
    }

    const newTotalPaid = amount + (Number(details?.serviceBill?.amount_paid?.toFixed(2)) || 0);

    try {
      //@ts-ignore
      await window.electron.updateServiceDuePayment({
        //@ts-ignore
        billStatus: newTotalPaid >= details?.serviceBill?.total ? 2 : 1,
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
        <MyDocument
          details={details}
          isTrnInclude={pdfAction.addTRN}
          isPaymentDetailsInclude={pdfAction.addPaymentDetails}
        />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Invoice-${details.service?.id}-${details.service?.vehicle_number}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      // toast.success("PDF downloaded successfully!");
    } catch (error) {
      toast.error("Failed to generate PDF.");
    }
  };

  const handlePrintPDF = async () => {
    if (!details) return;
    try {
      const blob = await pdf(
        <MyDocument
          details={details}
          isTrnInclude={pdfAction.addTRN}
          isPaymentDetailsInclude={pdfAction.addPaymentDetails}
        />
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

  const currentStatus =
    details?.serviceBill?.bill_status !== undefined
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
                  navigate(`/edit-invoice/${params.invoiceId}`);
                  // setPdfAction({ ...pdfAction, name: "download" });
                }}
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
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
                    <p className="font-semibold text-gray-900 text-sm">
                      {details.service.company_name}
                    </p>
                    <p className="text-gray-600 mt-0.5 text-xs">
                      {details.service.company_phone_number}
                    </p>
                  </div>
                </div>
              )}

              {/* Vehicle Info */}
              <div className="flex items-start gap-4 p-4 rounded-lg  border border-gray-200">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Car className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  {/* <p className="text-sm text-gray-500 mb-1">Vehicle</p> */}
                  <p className="font-semibold text-gray-900 text-sm">
                    {details?.service?.vehicle_number}
                  </p>
                  {details?.service?.chassis_number && (
                    <p className="text-xs text-gray-600 mt-1">
                      Chassis: {details?.service?.chassis_number}
                    </p>
                  )}
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
                  <span className="text-gray-600">Labor cost</span>
                  <span className="font-semibold text-gray-900">
                    {details?.service?.labor_cost?.toFixed(2)} AED
                  </span>
                </div>

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
                    -{details?.serviceBill?.discount?.toFixed(2)} AED
                  </span>
                </div>

                <div className="pt-3 border-t-2 border-gray-300">
                  <div className="flex justify-between items-center text-gray-700 font-bold">
                    <span className="">Total Amount</span>
                    <span className="text-lg">{details?.serviceBill?.total?.toFixed(2)} AED</span>
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
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${currentStatus.color}`}
                    >
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
        <div className="flex flex-col gap-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Items</h2>
            <ServiceItemTable data={details?.serviceItems || []} />
          </div>
          {/* service Labor cost list table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Labor cost list</h2>
            <ServiceLaborsListTable data={details?.serviceLaborCostList || []} />
          </div>
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
                Invoice Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    {details?.serviceBill?.subtotal?.toFixed(2)} AED
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-medium">{details?.serviceBill?.discount} AED</span>
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
                  <span className="text-gray-600">Due amount</span>
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
          subtext="Choose which additional details you want to include in the invoice before generating the PDF."
          continueProcessHandler={handleInvoicePDF}
          pdfAction={pdfAction}
          setPdfAction={setPdfAction}
          isTrnAvailable={details?.service?.trn ? true : false}
        />
      </div>
    </div>
  );
};

export default InvoiceDetailsPage;
