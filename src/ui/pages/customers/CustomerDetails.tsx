import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Building2, Mail, MapPin, User, Phone, Car, ArrowLeft, Plus, FileText } from "lucide-react";
import { toast } from "sonner";
import { CustomDialogBox } from "../../../components/CustomDialogBox";
import AlertBox from "../../../components/AlertBox";
import { dateFormatter } from "../../utils/DateFormatter";
import CustomerVehiclesTable from "./components/CustomerVehiclesTable";

interface CustomerInfo {
  id: number;
  name: string;
  address: string;
  email: string;
  company_name: string;
  company_phone_number: string;
  phone_number: string;
  created_at: string;
  created_by: number;
  updated_at: string;
  updated_by: number;
  trn: string;
}

interface VehicleData {
  id?: number;
  make: string;
  model: string;
  year: string;
  vehicle_number: string;
  chassis_number: string;
}

const CustomerDetails = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [vehiclesInfo, setVehiclesInfo] = useState<any[]>([]);
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    id?: number;
    action?: "add" | "edit" | "delete";
  }>({
    open: false,
  });

  const initialVehicleState: VehicleData = {
    make: "",
    model: "",
    year: "",
    vehicle_number: "",
    chassis_number: "",
  };
  const [vehicleData, setVehicleData] = useState<VehicleData>(initialVehicleState);

  useEffect(() => {
    Promise.allSettled([fetchCustomerInfo(), fetchCustomerVehicles()]);
  }, []);

  const fetchCustomerInfo = async () => {
    try {
      //@ts-ignore
      const { response } = await window.electron.getCustomerById(customerId);
      setCustomerInfo(response);
    } catch {
      toast.error("Failed to fetch customer information. Please restart the application.", {
        position: "top-center",
      });
    }
  };

  const fetchCustomerVehicles = async () => {
    try {
      //@ts-ignore
      const { response } = await window.electron.getVehiclesByCustomerId(customerId);
      setVehiclesInfo(response || []);
    } catch {
      toast.error("Failed to fetch customer vehicles. Please restart the application.", {
        position: "top-center",
      });
    }
  };

  const handleAddOrEditVehicle = async (action: "add" | "edit") => {
    try {
      if (vehicleData.make.trim() === "") {
        toast.error("Make is required and shouldn't be empty.", {
          position: "top-center",
        });
        return;
      }
      if (vehicleData.vehicle_number.trim() === "") {
        toast.error("Vehicle number is required and shouldn't be empty.", {
          position: "top-center",
        });
        return;
      }
      //@ts-ignore
      const user = JSON.parse(localStorage.getItem("gear-square-user"));
      const payload = {
        ...vehicleData,
        customer_id: Number(customerId),
        updatedBy: user.id,
        ...(action === "add" && { createdBy: user.id }),
      };
      //@ts-ignore
      const response =
        action === "add"
          ? //@ts-ignore
            await window.electron.addVehicle(payload)
          : //@ts-ignore
            await window.electron.updateVehicleDetails(payload);

      if (response?.success) {
        toast.success(`Vehicle ${action === "add" ? "added" : "updated"} successfully.`, {
          position: "top-center",
        });
      }

      fetchCustomerVehicles();
      setDialogState({ open: false });
      setVehicleData(initialVehicleState);
    } catch {
      toast.error("Operation failed. Please restart the application.", { position: "top-center" });
    }
  };

  const handleDeleteVehicle = async () => {
    try {
      //@ts-ignore
      await window.electron.deleteVehiclesById(dialogState.id);
      fetchCustomerVehicles();
      setDialogState({ open: false });
    } catch {
      toast.error("Failed to delete vehicle. Please restart the application.", {
        position: "top-center",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVehicleData({ ...vehicleData, [e.target.id]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-6 px-6 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="w-9 h-9 rounded-lg border border-gray-300 hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Customer Details</h1>
                <p className="text-sm text-gray-500 mt-0.5">{customerInfo?.name}</p>
              </div>
            </div>

            <button
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium transition-colors"
              onClick={() => setDialogState({ open: true, action: "add" })}
            >
              <Plus className="w-4 h-4" />
              Add Vehicle
            </button>
          </div>
        </div>

        {/* Customer Information Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-5">
          <h2 className="text-base font-semibold text-gray-900 mb-5">Customer Information</h2>

          {customerInfo && (
            <div className="grid md:grid-cols-2 gap-4">
              {/* Personal Info */}
              {customerInfo.name && (
                <InfoCard
                  icon={<User className="w-5 h-5 text-gray-600" />}
                  label="Customer Name"
                  value={customerInfo.name}
                  subtitle={customerInfo.phone_number}
                  subtitleIcon={<Phone className="w-3 h-3" />}
                />
              )}

              {/* Company Info */}
              {customerInfo.company_name && (
                <InfoCard
                  icon={<Building2 className="w-5 h-5 text-gray-600" />}
                  label="Company"
                  value={customerInfo.company_name}
                  subtitle={customerInfo.company_phone_number}
                  subtitleIcon={<Phone className="w-3 h-3" />}
                />
              )}

              {/* Email */}
              {customerInfo.email && (
                <InfoCard
                  icon={<Mail className="w-5 h-5 text-gray-600" />}
                  label="Email Address"
                  value={customerInfo.email}
                />
              )}

              {/* TRN */}
              {customerInfo.trn && (
                <InfoCard
                  icon={<FileText className="w-5 h-5 text-gray-600" />}
                  label="TRN"
                  value={customerInfo.trn}
                />
              )}

              {/* Address - Full Width */}
              {customerInfo.address && (
                <div className="md:col-span-2">
                  <InfoCard
                    icon={<MapPin className="w-5 h-5 text-gray-600" />}
                    label="Address"
                    value={customerInfo.address}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Vehicles Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                <Car className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">Vehicles</h2>
                <p className="text-sm text-gray-500">
                  {vehiclesInfo.length} vehicle{vehiclesInfo.length !== 1 ? "s" : ""} registered
                </p>
              </div>
            </div>
          </div>

          <CustomerVehiclesTable
            data={vehiclesInfo}
            onView={(id) => navigate(`/vehicle-details/${id}`)}
            onEdit={(vehicle) => {
              //@ts-ignore
              setVehicleData(vehicle);
              //@ts-ignore
              setDialogState({ open: true, action: "edit", id: vehicle.id });
            }}
            //@ts-ignore
            onDelete={(id) => setDialogState({ open: true, action: "delete", id })}
            dateFormatter={dateFormatter}
          />
        </div>

        {/* Delete Confirmation */}
        <AlertBox
          open={dialogState.open && dialogState.action === "delete"}
          setOpen={setDialogState}
          continueProcessHandler={handleDeleteVehicle}
          text="Delete Vehicle"
          subtext="This action cannot be undone. All services linked to this vehicle will also be removed."
        />

        {/* Add/Edit Vehicle Modal */}
        <CustomDialogBox
          open={dialogState.open && (dialogState.action === "add" || dialogState.action === "edit")}
          //@ts-ignore
          setOpen={setDialogState}
          handleSubmit={() => handleAddOrEditVehicle(dialogState.action as "add" | "edit")}
          data={vehicleData}
          onMutateData={handleInputChange}
          action={dialogState.action as "add" | "edit"}
        />
      </div>
    </div>
  );
};

export default CustomerDetails;

// Info Card Component
const InfoCard = ({
  icon,
  label,
  value,
  subtitle,
  subtitleIcon,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle?: string;
  subtitleIcon?: React.ReactNode;
}) => (
  <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="font-medium text-gray-900 break-words">{value}</p>
      {subtitle && (
        <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
          {subtitleIcon}
          {subtitle}
        </p>
      )}
    </div>
  </div>
);
