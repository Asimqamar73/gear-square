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
import LabourCharges from "./components/InvoiceLabor";
import { getStatusDot, paymentStatuses } from "../../utils/paymentHelpers";

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
  const [paymentStatus, setPaymentStatus] = useState<any>(0);
  const [discount, setDiscount] = useState<number | string | undefined>("");
  const [amountPaid, setAmountPaid] = useState<number | string | undefined>("");
  const [laborCost, setLaborCost] = useState("0");
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
      const { data } = await window.electron.getProducts();
      setProducts(data || []);
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
    const subtotal = totalBill + Number(laborCost);
    const afterVat = Number(subtotal) + Number(subtotal) * VAT_RATE;
    const validDiscount = Number(discount) ? Number(discount) : 0;
    const total = Number(afterVat) - validDiscount;
    const validPaidAmount = Number(amountPaid) ? Number(amountPaid) : 0;
    const remaining = total - validPaidAmount;

    return {
      subtotal,
      afterVat,
      validDiscount,
      total,
      validPaidAmount,
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
          laborCost: Number(laborCost),
        },
        laborItems,
        discount: totals.validDiscount,
        billStatus: paymentStatus,
        amountPaid: totals.validPaidAmount,
        vatAmount: (Number(totals.subtotal) * VAT_RATE).toFixed(2),
      });
      console.log(response);
      if (response.success) {
        toast.success("Invoice generated successfully");
        navigate(`/invoice/${response.invoiceId}`);
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
    // setAmountPaid(value);

    if (value || e.target.value == "") {
      setAmountPaid(e.target.value);
      const totals = calculateTotals();
      if (value === 0) {
        setPaymentStatus(0);
      } else if (value > 0 && value < totals.total) {
        setPaymentStatus(1);
      } else if (value >= totals.total) {
        setPaymentStatus(2);
      }
    }
  };

  const deleteLaborItem = (idx: number) => {
    setLaborItems(laborItems.filter((_, i) => i !== idx));
  };

  const totals = calculateTotals();
  const [laborItems, setLaborItems] = useState([]);

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
                <InfoRow
                  icon={<User className="w-4 h-4 text-gray-600" />}
                  value={vehicleInfo.name}
                  subValue={vehicleInfo.email}
                />
              )}
              {vehicleInfo?.company_name && (
                <InfoRow
                  icon={<Building2 className="w-4 h-4 text-gray-600" />}
                  value={vehicleInfo.company_name}
                  subValue={vehicleInfo.company_phone_number}
                />
              )}
              {vehicleInfo?.phone_number && (
                <InfoRow
                  icon={<Phone className="w-4 h-4 text-gray-600" />}
                  value={vehicleInfo.phone_number}
                />
              )}
              {vehicleInfo?.address && (
                <InfoRow
                  icon={<MapPin className="w-4 h-4 text-gray-600" />}
                  value={vehicleInfo.address}
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
              {vehicleInfo?.make && (
                <InfoRow
                  icon={<Car className="w-4 h-4 text-gray-600" />}
                  value={`${vehicleInfo.make} ${vehicleInfo.model || ""}`}
                />
              )}
              {vehicleInfo?.vehicle_number && (
                <InfoRow
                  icon={<Hash className="w-4 h-4 text-gray-600" />}
                  value={vehicleInfo.vehicle_number}
                  subValue={`Chassis: ${vehicleInfo.chassis_number}`}
                />
              )}
              {vehicleInfo?.year && (
                <InfoRow
                  icon={<CalendarDays className="w-4 h-4 text-gray-600" />}
                  value={vehicleInfo.year}
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

        {/*  */}
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

        <div className="mb-6">
          <LabourCharges
            labourItems={laborItems}
            setLabourItems={setLaborItems}
            setTotalLaborCost={setLaborCost}
            deleteLaborItem={deleteLaborItem}
          />
          {/* <InvoiceItem
            products={products}
            handleProductChange={handleProductChange}
            handleQuantityChange={handleQuantityChange}
            handleSubtotal={handleSubtotal}
            items={items}
            addNewItem={addNewItem}
            deleteItem={deleteItem}
          /> */}
        </div>

        {/* Summary */}
        <div className="flex justify-end">
          <div className="w-full max-w-md bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between gap-2 mb-5 pb-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Invoice Summary</h2>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${paymentStatuses[paymentStatus].color}`}
              >
                {getStatusDot(paymentStatus)}

                {paymentStatuses[paymentStatus].label}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Products Subtotal</span>
                <span className="font-medium text-gray-900">{totalBill.toFixed(2)} AED</span>
              </div>

              {/* <div className="space-y-2">
                <label htmlFor="laborCost" className="text-sm font-medium text-gray-700">
                  Service Labor Cost
                </label>
                <input
                  type="number"
                  id="laborCost"
                  min="0"
                  step="1"
                  value={laborCost}
                  onChange={(e) => setLaborCost(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                />
              </div> */}

              <div className="flex justify-between text-sm  border-gray-200 ">
                <span className="text-gray-600 font-medium">Labor Cost</span>
                <span className="font-medium text-gray-900">
                  {Number(laborCost).toFixed(2)} AED
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">VAT (5%)</span>
                <span className="font-medium text-gray-900">
                  {(Number(totals.subtotal) * VAT_RATE).toFixed(2)} AED
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">After VAT</span>
                <span className="font-medium text-gray-900">
                  {Number(totals.afterVat).toFixed(2)} AED
                </span>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="discount"
                  className="text-sm font-medium text-gray-700 flex justify-between"
                >
                  <span>Discount</span>
                  {/* <span className="text-gray-500 font-normal">
                    -{totals.discount.toFixed(2)} AED
                  </span> */}
                </label>
                <input
                  type="text"
                  id="discount"
                  value={discount}
                  onChange={(e) => {
                    if (Number(e.target.value) || e.target.value == "") {
                      setDiscount(e.target.value);
                    }
                  }}
                  placeholder="0"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="amountPaid" className="text-sm font-medium text-gray-700">
                  Amount Paid
                </label>
                <input
                  type="text"
                  id="amountPaid"
                  value={amountPaid}
                  onChange={(e) => handleAmountPaid(e)}
                  placeholder="0"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                />
              </div>

              {/* <div className="space-y-2">
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
              </div> */}

              <div className="pt-4 border-t border-gray-500 space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">
                    {totals.total.toFixed(2)} AED
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Remaining Balance</span>
                  <span
                    className={`font-semibold ${
                      totals.remaining > 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
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
