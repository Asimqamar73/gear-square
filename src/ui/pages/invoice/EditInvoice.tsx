import { CalendarDays, Car, Clock10, Download, Phone, User2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { dateFormatter, to12HourFormat } from "../../utils/DateFormatter";
import { Badge } from "../../../components/ui/badge";
import PageHeader from "../../../components/PageHeader";
import { Button } from "../../../components/ui/button";
import CustomSheet from "../../../components/CustomSheet";
import { Separator } from "../../../components/ui/separator";
import { Card } from "../../../components/ui/card";
import MyDocument from "../../../components/PDF";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { toast } from "sonner";

interface IInoviceDetails {
  service: IService | undefined;
  serviceItems: IServiceItems | [];
  serviceBill: IServiceBill | undefined;
}

interface IService {
  id: number;
  service_id: number;
  name: string;
  phone_number: string;
  vehicle_number: string;
  created_at: string;
  customer_id: number;
}
interface IServiceItems {
  id: number;
  item: number;
  service_id: number;
  quantity: number;
  subtotal: number;
}
interface IServiceBill {
  id: number;
  discount: number;
  subtotal: number;
  total: number;
  amount_paid: number;
  amount_due: number;
  bill_status: number;
}
const EditInovice = () => {
  const params = useParams();
  const navigate = useNavigate();
  const paymentStatuses: any = {
    0: {
      value: "Unpaid",
      color: "bg-red-200",
    },
    1: {
      value: "Partial",
      color: "bg-amber-200",
    },
    2: {
      value: "Paid",
      color: "bg-green-200",
    },
  };
  const [details, setDetails] = useState<IInoviceDetails>();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number | string>(0);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchDetails(params.invoiceId);
  }, []);

  const fetchDetails = async (id: any) => {
    try {
      //@ts-ignore
      const resp = await window.electron.getInvoiceDetails(id);
      setDetails(resp);
    } catch (error) {
      toast.error("Something went wrong. Please restart the application", {
        position: "top-center",
      });
    }
  };
  const handleSheetToggle = () => {
    setIsSheetOpen(!isSheetOpen);
  };
  const handleUpdateInvoice = async () => {
    if (Number(paymentAmount) <= 0) {
      setErrorMessage("Payment amount must be greater then 0");
      setTimeout(() => {
        setErrorMessage("");
      }, 4000);
      return;
    }
    //@ts-ignore
    const newTotalPaid = Number(paymentAmount) + details?.serviceBill?.amount_paid;
    try {
      //@ts-ignore
      const resp = await window.electron.updateServiceDuePayment({
        billStatus: newTotalPaid === details?.serviceBill?.total ? 2 : 1,
        amountPaid: newTotalPaid,
        id: details?.serviceBill?.id,
      });
      fetchDetails(params.invoiceId);
      setIsSheetOpen(false);
    } catch (error) {}
    toast.error("Something went wrong. Please restart the application", {
      position: "top-center",
    });
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-16 px-8">
        <div className="flex flex-col gap-2 mb-8">
          <PageHeader title="Invoice details">
            <div className="flex gap-1">
              <PDFDownloadLink
                document={<MyDocument details={details} isTrnInclude={true}/>}
                fileName={`${details?.service?.name}-${details?.service?.vehicle_number}.pdf`}
              >
                {(
                  //@ts-ignore
                  { blob, url, loading, error }: any
                ) =>
                  loading ? (
                    "Loading document..."
                  ) : (
                    <Button
                      className="bg-[#173468] text-white cursor-pointer"
                      variant={"outline"}
                      size={"icon"}
                    >
                      <Download />
                    </Button>
                  )
                }
              </PDFDownloadLink>
              <Button
                className="bg-[#173468] text-white"
                variant={"outline"}
                onClick={handleSheetToggle}
              >
                Update payment
              </Button>
            </div>
          </PageHeader>
          <div className="col-span-5 flex gap-4">
            <div className="grow p-4 bg-gray-200 rounded-2xl flex flex-col gap-4 border border-gray-300 shadow">
              <h2 className="text-xl mt-2">General information</h2>
              <div className="flex justify-between">
                <div className="flex flex-col gap-2 ">
                  <h2 className="font-semibold">Billed to</h2>
                  {/* <p className="flex gap-2 font-bold text-gray-600 text-lg">
                    {" "}
                    <User strokeWidth={1.5} /> {details?.service?.name}{" "}
                  </p> */}
                  <div
                    className="flex items-center gap-2 cursor-pointer text-blue-800"
                    onClick={() => navigate(`/customer-details/${details?.service?.customer_id}`)}
                  >
                    <div className="p-1.5 border border-gray-400 rounded-xl bg-gray-100">
                      <User2 className="text-gray-500" strokeWidth={1.5} />{" "}
                    </div>
                    <p className="font-semibold text-gray-600">{details?.service?.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 border border-gray-400 rounded-xl bg-gray-100">
                      <Phone className="text-gray-500" strokeWidth={1.5} />
                    </div>
                    <p className="font-semibold text-gray-600"> {details?.service?.phone_number}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="p-1.5 border border-gray-400 rounded-xl bg-gray-100">
                      <Car className="text-gray-500" strokeWidth={1.5} />
                    </div>
                    <p className="font-semibold text-gray-600">
                      {" "}
                      {details?.service?.vehicle_number}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="font-semibold">Invoice</h2>
                  <p className="font-semibold text-gray-600">Invoice no# {details?.service?.id}</p>

                  <div className="flex items-center gap-2">
                    <div className="p-1.5 border border-gray-400 rounded-xl bg-gray-100">
                      <CalendarDays className="text-gray-500" strokeWidth={1.5} />{" "}
                    </div>
                    <p className="font-semibold text-gray-600">
                      {details?.service?.created_at && dateFormatter(details?.service?.created_at)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="p-1.5 border border-gray-400 rounded-xl bg-gray-100">
                      <Clock10 className="text-gray-500" strokeWidth={1.5} />{" "}
                    </div>
                    <p className="font-semibold text-gray-600">
                      {details?.service?.created_at.split(" ")[1] &&
                        to12HourFormat(details?.service?.created_at.split(" ")[1])}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className=" grow p-4 bg-gray-200 rounded-2xl flex flex-col gap-2 border border-gray-300 shadow">
              <div className="flex flex-col gap-4 w-fit">
                <h2 className="text-xl mt-2">Bill Information</h2>
                <div className="flex flex-col gap-1.5">
                  <p className=" flex gap-2 items-center">
                    Subtotal{" "}
                    <span className="font-semibold text-gray-600">
                      AED {details?.serviceBill?.subtotal?.toFixed(2)}
                    </span>
                  </p>
                  <p className=" flex gap-2 items-center">
                    Discount{" "}
                    <span className="font-semibold text-gray-600">
                      {details?.serviceBill?.discount}%
                    </span>
                  </p>
                  <p className=" flex gap-2 items-center">
                    Grand total{" "}
                    <span className="font-semibold text-gray-600">
                      AED {details?.serviceBill?.total?.toFixed(2)}
                    </span>
                  </p>
                  <hr className="my-1.5" />
                  <p className=" flex gap-2 items-center">
                    Amount paid{" "}
                    <span className="font-semibold text-gray-600">
                      AED {details?.serviceBill?.amount_paid?.toFixed(2)}
                    </span>
                  </p>
                  <p className=" flex gap-2 items-center">
                    Due amount{" "}
                    <span className="font-semibold text-gray-600">
                      AED {details?.serviceBill?.amount_due?.toFixed(2)}
                    </span>
                  </p>
                  <p className=" flex gap-2 items-center">
                    Paymant status{" "}
                    {details?.serviceBill && (
                      <Badge
                        variant={"outline"}
                        className={`${
                          paymentStatuses[details?.serviceBill?.bill_status]?.color
                        } border-gray-400 text-gray-700`}
                      >
                        {paymentStatuses[details?.serviceBill?.bill_status]?.value}
                      </Badge>
                    )}
                    {/* <span
                        className={`${
                          paymentStatuses[details?.serviceBill?.bill_status]?.color
                        } px-2 py-0.5 rounded-2xl text-gray-700`}
                      >
                      </span> */}
                  </p>
                </div>
              </div>
            </div>
            {/* <h2 className="font-bold text-2xl text-gray-500">{`Total bill ${totalBill} aed.`}</h2> */}
          </div>
        </div>
        <div className="mt-8">
          <h2 className="font-semibold text-lg">Items detail</h2>
          {/* <ServiceItemTable data={details?.serviceItems} /> */}
        </div>
      </div>
      <CustomSheet
        title="Update invoice"
        isOpen={isSheetOpen}
        handleSheetToggle={() => setIsSheetOpen(false)}
        handleSubmit={handleUpdateInvoice}
      >
        <div className="grid flex-1 auto-rows-min gap-2 px-4">
          <Card className=" px-4 bg-gray-200 border-gray-400 gap-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="subtotal">Subtotal</label>
              <input
                id="subtotal"
                readOnly
                value={details?.serviceBill?.subtotal}
                className="p-1.5 indent-2 text-sm border rounded-md border-gray-500"
                disabled
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="discount">Discount</label>
              <input
                id="discount"
                readOnly
                value={details?.serviceBill?.discount}
                className="p-1.5 indent-2 text-sm border rounded-md border-gray-500"
                disabled
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="quantity">Grand total</label>
              <input
                id="quantity"
                readOnly
                value={details?.serviceBill?.subtotal}
                className="p-1.5 indent-2 text-sm border rounded-md border-gray-500"
                disabled
              />
            </div>
          </Card>
          <hr className="my-4" />
          <Card className=" px-4 bg-gray-200 border-gray-400 gap-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="quantity">Paid amount</label>
              <input
                id="quantity"
                readOnly
                value={details?.serviceBill?.amount_paid}
                className="p-1.5 indent-2 text-sm border rounded-md border-gray-500"
                disabled
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="quantity">Due balance</label>
              <input
                id="quantity"
                readOnly
                value={details?.serviceBill?.amount_due}
                className="p-1.5 indent-2 text-sm border rounded-md border-gray-500"
                disabled
              />
            </div>
          </Card>
          <Separator orientation="horizontal" className="my-4 bg-gray-500" />
          <div className="flex flex-col gap-2">
            <label htmlFor="quantity">Payment amount</label>
            <input
              id="new-quantity"
              type="number"
              min={1}
              value={paymentAmount}
              className="p-1.5 indent-2 text-sm border rounded-md"
              onChange={(e) => setPaymentAmount(e.target.value)}
            />
          </div>
          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        </div>
      </CustomSheet>
    </div>
  );
};

export default EditInovice;


