import { CalendarDays, CarFront, Clock10, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ServiceItemTable from "./components/ServiceItemTable";
import { dateFormatter } from "../../utils/DateFormatter";

interface IInoviceDetails {
  service: IService | undefined;
  serviceItems: IServiceItems | undefined;
  serviceBill: IServiceBill | undefined;
}

interface IService {
  id: number;
  name: string;
  phone_number: string;
  vehicle_number: string;
  created_at: string;
}
interface IServiceItems {
  id: number;
  item: number;
  service_id: number;
  quantity: number;
  subtotal: number;
}
interface IServiceBill {
  discount: number;
  subtotal: number;
  total: number;
}
const InvoiceDetails = () => {
  const params = useParams();
  const [details, setDetails] = useState<IInoviceDetails>();

  useEffect(() => {
    fetchDetails(params.invoiceId);
  }, []);

  const fetchDetails = async (id: any) => {
    try {
      //@ts-ignore
      const resp = await window.electron.getInvoiceDetails(id);
      console.log(resp);
      setDetails(resp);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-16 px-8">
        <div className="flex flex-col gap-2 mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-medium text-gray-700 mb-8">Invoice details</h1>
          </div>
          <div className="flex gap-4">
            <div className="grow p-4 bg-gray-200 rounded-2xl flex flex-col gap-4 border border-gray-300 shadow">
              <h2 className="text-xl mt-2">General information</h2>
              <div className="flex justify-between">
                <div className="flex flex-col gap-2 ">
                  <h2 className="font-semibold">Billed to</h2>
                  <p className="flex gap-2 font-bold text-gray-600 text-lg">
                    {" "}
                    <User strokeWidth={1.5} /> {details?.service?.name}{" "}
                  </p>
                  <p className="flex gap-2 font-bold text-gray-600 text-lg text-right">
                    <Phone strokeWidth={1.5} />
                    {details?.service?.phone_number}
                  </p>
                  <p className="flex gap-2 font-bold text-gray-600 text-lg">
                    <CarFront strokeWidth={1.5} /> {details?.service?.vehicle_number}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="font-semibold">Invoice</h2>
                  <p>Invoice no# INV00{details?.service?.id}</p>
                  {details?.service?.created_at && (
                    <p className="flex gap-2 font-bold text-gray-600 text-lg">
                      <CalendarDays strokeWidth={1.5} />{" "}
                      {dateFormatter(details?.service.created_at)}
                    </p>
                  )}

                  <p className="flex gap-2 font-bold text-gray-600 text-lg">
                    <Clock10 strokeWidth={1.5} /> {details?.service?.created_at.split(" ")[1]}
                  </p>
                </div>
              </div>
            </div>
            <div className=" grow p-4 bg-gray-200 rounded-2xl flex flex-col gap-2 border border-gray-300 shadow">
              <h2 className="text-xl mt-2">Bill Information</h2>
              <p className=" flex gap-2 items-center">
                Subtotal{" "}
                <span className="font-semibold text-gray-600 text-lg">
                  {details?.serviceBill?.subtotal} aed
                </span>
              </p>
              <p className=" flex gap-2 items-center">
                Discount{" "}
                <span className="font-semibold text-gray-600 text-lg">
                  {details?.serviceBill?.discount}%
                </span>
              </p>
              <p className=" flex gap-2 items-center">
                Grand total{" "}
                <span className="font-semibold text-gray-600 text-2xl">
                  {details?.serviceBill?.total} aed
                </span>
              </p>
            </div>
            {/* <h2 className="font-bold text-2xl text-gray-500">{`Total bill ${totalBill} aed.`}</h2> */}
          </div>
          <div className="mt-8">
            <h2 className="font-semibold text-lg">Items detail</h2>
            <ServiceItemTable data={details?.serviceItems} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;
