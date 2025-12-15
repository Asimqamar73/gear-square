import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Building2,
  CalendarDays,
  Car,
  Mail,
  MapPin,
  User,
  Phone,
  ArrowLeft,
  Plus,
  Hash,
} from "lucide-react";
import { toast } from "sonner";
import VehicleServicesTable from "./components/VehicleServicesTable";
import { dateFormatter } from "../../utils/DateFormatter";
import AlertBox from "../../../components/AlertBox";

interface VehicleInfo {
  id: number;
  name: string;
  address: string;
  email: string;
  company_name: string;
  company_phone_number: string;
  phone_number: string;
  make: string;
  model: string;
  year: string;
  chassis_number: string;
  vehicle_number: string;
  customer_id: number;
}

const VehicleDetails = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo | null>(null);
  const [servicesList, setServicesList] = useState<any[]>([]);
  // Delete Dialog
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    invoiceId: number | null;
  }>({
    open: false,
    invoiceId: null,
  });

  useEffect(() => {
    Promise.allSettled([fetchVehicleDetails(), fetchVehicleServices()]);
  }, [vehicleId]);

  const fetchVehicleDetails = async () => {
    try {
      //@ts-ignore
      const { response } = await window.electron.getVehicleDetails(vehicleId);
      setVehicleInfo(response);
    } catch (error) {
      toast.error("Failed to load vehicle details. Please try again.", {
        position: "top-center",
      });
    }
  };

  const fetchVehicleServices = async () => {
    try {
      //@ts-ignore
      const { response } = await window.electron.getServicesByVehicleId(vehicleId);
      setServicesList(response || []);
    } catch (error) {
      toast.error("Failed to load service history. Please try again.", {
        position: "top-center",
      });
    }
  };

  const handleDeleteInvoice = async () => {
    if (!deleteDialog.invoiceId) return;

    try {
      //@ts-ignore
      const response = await window.electron.deleteInvoice(deleteDialog.invoiceId);
      if (response.success) {
        toast.success("Service deleted successfully.", {
        position: "top-center",
      });
        fetchVehicleServices();
      }
      setDeleteDialog({ open: false, invoiceId: null });
    } catch (error) {
      toast.error("Failed to load service history. Please try again.", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8 px-8 max-w-[1400px] mx-auto">
        {/* Enhanced Header */}
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
                <div className="flex items-center gap-3 mb-1">
                  {/* <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center"> */}
                  {/* <Car className="w-4 h-4 text-white" /> */}
                  {/* </div> */}
                  <h1 className="text-2xl font-semibold text-gray-900">Vehicle Details</h1>
                </div>
                <p className="text-sm text-gray-500">{vehicleInfo?.vehicle_number}</p>
              </div>
            </div>

            <button
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium transition-all shadow-sm hover:shadow-md"
              onClick={() => navigate(`/generate-service-invoice/${vehicleId}`)}
            >
              <Plus className="w-4 h-4" />
              Create Invoice
            </button>
          </div>
        </div>

        {/* Information Cards Grid */}
        <div className="grid lg:grid-cols-5 gap-6 mb-6">
          {/* Owner Information Card */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-600" />
                <h2 className="text-base font-semibold text-gray-900">Owner Details</h2>
              </div>
            </div>

            {vehicleInfo && (
              <div className="p-6 space-y-4">
                {/* Customer Name */}
                {vehicleInfo.name && (
                  <div
                    className="group flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm cursor-pointer transition-all"
                    onClick={() => navigate(`/customer-details/${vehicleInfo.customer_id}`)}
                  >
                    <div className="w-11 h-11 rounded-lg bg-gray-100 group-hover:bg-gray-900 flex items-center justify-center flex-shrink-0 transition-colors">
                      <User className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-500 mb-1 tracking-wide">
                        Customer
                      </p>
                      <p className="font-semibold text-gray-900 mb-1">{vehicleInfo.name}</p>
                      {vehicleInfo.phone_number && (
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{vehicleInfo.phone_number}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Company */}
                {vehicleInfo.company_name && (
                  <DetailCard
                    icon={<Building2 className="w-5 h-5 text-gray-600" />}
                    label="Company"
                    value={vehicleInfo.company_name}
                    subtitle={vehicleInfo.company_phone_number}
                    subtitleIcon={<Phone className="w-3.5 h-3.5" />}
                  />
                )}

                {/* Email */}
                {vehicleInfo.email && (
                  <DetailCard
                    icon={<Mail className="w-5 h-5 text-gray-600" />}
                    label="Email Address"
                    value={vehicleInfo.email}
                  />
                )}

                {/* Address */}
                {vehicleInfo.address && (
                  <DetailCard
                    icon={<MapPin className="w-5 h-5 text-gray-600" />}
                    label="Location"
                    value={vehicleInfo.address}
                  />
                )}
              </div>
            )}
          </div>

          {/* Vehicle Information Card */}
          <div className="lg:col-span-3 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-gray-600" />
                <h2 className="text-base font-semibold text-gray-900">Vehicle Specifications</h2>
              </div>
            </div>

            {vehicleInfo && (
              <div className="p-6">
                {/* Primary Vehicle Info - Featured */}
                <div className="relative mb-5 p-6 rounded-lg bg-gradient-to-br from-gray-500 to-gray-200 overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                          Registration Number
                        </p>
                        <p className="text-2xl font-bold text-white mb-1">
                          {vehicleInfo.vehicle_number}
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                        <Hash className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    {vehicleInfo.chassis_number && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                        <span className="text-xs font-medium text-gray-300">Chassis:</span>
                        <span className="text-sm font-semibold font-mono text-white">
                          {vehicleInfo.chassis_number}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Details Grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Make & Model */}
                  {vehicleInfo.make && (
                    <DetailCard
                      icon={<Car className="w-5 h-5 text-gray-600" />}
                      label="Make & Model"
                      value={`${vehicleInfo.make}${
                        vehicleInfo.model ? ` ${vehicleInfo.model}` : ""
                      }`}
                      compact
                    />
                  )}

                  {/* Year */}
                  {vehicleInfo.year && (
                    <DetailCard
                      icon={<CalendarDays className="w-5 h-5 text-gray-600" />}
                      label="Year"
                      value={vehicleInfo.year}
                      compact
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Services Section */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center ">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-base font-semibold  text-gray-900">Service History</h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {servicesList.length} {servicesList.length === 1 ? "service" : "services"}{" "}
                    recorded
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <VehicleServicesTable
              data={servicesList}
              onViewInvoice={(id) => navigate(`/invoice/${id}`)}
              onEditInvoice={(id) => navigate(`/edit-invoice/${id}`)}
              onDeleteInvoice={(id) => setDeleteDialog({ open: true, invoiceId: id as number })}
              dateFormatter={dateFormatter}
            />
          </div>
          <AlertBox
            open={deleteDialog.open}
            setOpen={(value: any) =>
              setDeleteDialog((prev) =>
                typeof value === "function" ? value(prev) : { open: value, invoiceId: null }
              )
            }
            continueProcessHandler={handleDeleteInvoice}
            text="Delete service"
            subtext="This action cannot be undone. All associated services details will also be permanently deleted."
          />
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;

// Detail Card Component
const DetailCard = ({
  icon,
  label,
  value,
  subtitle,
  subtitleIcon,
  compact = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle?: string;
  subtitleIcon?: React.ReactNode;
  compact?: boolean;
}) => (
  <div
    className={`flex items-start gap-4 ${
      compact ? "p-3" : "p-4"
    } rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors`}
  >
    <div
      className={`${
        compact ? "w-10 h-10" : "w-11 h-11"
      } rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0`}
    >
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-gray-500 mb-1 tracking-wide">{label}</p>
      <p className="font-semibold text-gray-900 break-words">{value}</p>
      {subtitle && (
        <div className="flex items-center gap-1.5 text-sm text-gray-600 mt-1">
          {subtitleIcon}
          <span>{subtitle}</span>
        </div>
      )}
    </div>
  </div>
);
