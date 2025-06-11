import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../../components/PageHeader";
import { useEffect, useState } from "react";
import { MapPin, Phone, User2 } from "lucide-react";
import CustomerVehicleTable from "./components/CustomerVehicleTable";
import { Button } from "../../../components/ui/button";

interface ICustomerInfo {
  id: number;
  name: string;
  address: string;
  email: string;
  phone_number: string;
  created_at: string;
  created_by: number;
  updated_at: string;
  updated_by: number;
}

const CusomerDetails = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [customerInfo, setCustomerInfo] = useState<ICustomerInfo | null>(null);
  const [servicesInfo, setServicesInfo] = useState(null);

  useEffect(() => {
    Promise.allSettled([fetchCustomerInformation(), fetchServices()]);
  }, []);

  const fetchCustomerInformation = async () => {
    try {
      //@ts-ignore
      const { response } = await window.electron.getCustomerById(customerId);
      //@ts-ignore
      setCustomerInfo(response);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchServices = async () => {
    try {
      //@ts-ignore
      const { response } = await window.electron.getServicesById(customerId);
      //@ts-ignore
      console.log(response)
      setServicesInfo(response);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-16 px-8">
        <PageHeader title="Customer infomation">
           <Button
               variant="outline"
               className="bg-[#173468] text-white font-bold"
               // onClick={handleInvoiceGeneration}
               onClick={()=>navigate(`/generate-invoice/${customerInfo?.id}`)}
               >
                New invoice
              </Button>
        </PageHeader>
        <div className="w-fit">
          <div className="p-4 bg-white rounded-2xl flex flex-col gap-4 border border-gray-300 shadow">
            <h2 className="text-xl mt-2">Customer Details</h2>
            <CustomerDetail text={customerInfo?.name} subtext={customerInfo?.email}>
              <User2 className="text-gray-500 size-6" />
            </CustomerDetail>
            <CustomerDetail text={customerInfo?.phone_number}>
              <Phone className="text-gray-500 size-6" />
            </CustomerDetail>
            <CustomerDetail text={customerInfo?.address}>
              <MapPin className="text-gray-500 size-6" />
            </CustomerDetail>
          </div>
        </div>
        <h2 className="my-4 text-2xl">Invoices</h2>
        <CustomerVehicleTable data={servicesInfo} />
      </div>
    </div>
  );
};

export default CusomerDetails;

const CustomerDetail = ({
  text,
  subtext,
  children,
}: {
  text?: string;
  subtext?: string;
  children: any;
}) => {
  return (
    <div className="flex items-center gap-2">
      <div className="p-1.5 border border-gray-400 rounded-xl bg-gray-100">{children}</div>
      <div>
        <p>{text}</p>
        {subtext && <p className="text-gray-500 text-sm">{subtext}</p>}
      </div>
    </div>
  );
};
