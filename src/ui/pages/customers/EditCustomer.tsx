import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { User, Building2, Phone, Mail, MapPin, FileText, ArrowLeft, Save, Loader2 } from "lucide-react";

interface CustomerDetails {
  name: string;
  email: string;
  phone_number: string;
  company_name: string;
  company_phone_number: string;
  address: string;
  trn: string;
}

const EditCustomer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const initialState: CustomerDetails = {
    name: "",
    email: "",
    phone_number: "",
    company_name: "",
    company_phone_number: "",
    address: "",
    trn: "",
  };

  const [details, setDetails] = useState<CustomerDetails>(initialState);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const fetchCustomerData = async () => {
    try {
      //@ts-ignore
      const { response } = await window.electron.getCustomerById(id);
      setDetails(response);
    } catch (error) {
      toast.error("Failed to load customer details. Please try again.", {
        position: "top-center",
      });
      navigate("/customers");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!details.name.trim() && !details.company_name.trim()) {
      toast.error("Either customer name or company name is required", { 
        position: "top-center" 
      });
      return;
    }
    if (!details.phone_number.trim() && !details.company_phone_number.trim()) {
      toast.error("Either phone number or company phone is required", { 
        position: "top-center" 
      });
      return;
    }

    setIsSubmitting(true);

    try {
      //@ts-ignore
      const user = JSON.parse(localStorage.getItem("gear-square-user"));
      //@ts-ignore
      const response = await window.electron.updateCustomerDetailsById({
        ...details,
        updatedBy: user.id,
      });
      
      if (response.success) {
        toast.success("Customer updated successfully", { position: "top-center" });
        navigate("/customers");
      }
    } catch (error) {
      toast.error("Failed to update customer. Please try again.", {
        position: "top-center",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Loading customer details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8 px-8 max-w-[900px] mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate("/customers")}
              className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-white hover:shadow-sm flex items-center justify-center transition-all"
            >
              <ArrowLeft className="w-4 h-4 text-gray-700" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Edit Customer</h1>
              <p className="text-sm text-gray-500 mt-0.5">Update customer information</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Personal Information Section */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-600" />
                <h2 className="text-base font-semibold text-gray-900">Personal Information</h2>
              </div>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                {/* Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-gray-400" />
                    Customer Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                    onChange={handleChange}
                    value={details.name}
                    placeholder="John Doe"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label htmlFor="phone_number" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-gray-400" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    id="phone_number"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                    onChange={handleChange}
                    value={details.phone_number}
                    placeholder="+971 50 123 4567"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-gray-400" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  onChange={handleChange}
                  value={details.email}
                  placeholder="john.doe@example.com"
                />
              </div>
            </div>
          </div>

          {/* Company Information Section */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-gray-600" />
                <h2 className="text-base font-semibold text-gray-900">Company Information</h2>
              </div>
              <p className="text-xs text-gray-500 mt-1">Optional company details</p>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                {/* Company Name */}
                <div className="space-y-2">
                  <label htmlFor="company_name" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    id="company_name"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                    onChange={handleChange}
                    value={details.company_name}
                    placeholder="Gear Square"
                  />
                </div>

                {/* Company Phone */}
                <div className="space-y-2">
                  <label htmlFor="company_phone_number" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-gray-400" />
                    Company Phone
                  </label>
                  <input
                    type="tel"
                    name="company_phone_number"
                    id="company_phone_number"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                    onChange={handleChange}
                    value={details.company_phone_number}
                    placeholder="+971 4 123 4567"
                  />
                </div>
              </div>

              {/* TRN */}
              <div className="space-y-2">
                <label htmlFor="trn" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-gray-400" />
                  Tax Registration Number (TRN)
                </label>
                <input
                  type="text"
                  name="trn"
                  id="trn"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  onChange={handleChange}
                  value={details.trn}
                  placeholder="123456789012345"
                />
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-600" />
                <h2 className="text-base font-semibold text-gray-900">Location</h2>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  Address
                </label>
                <textarea
                  name="address"
                  id="address"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all resize-none"
                  rows={4}
                  onChange={handleChange}
                  value={details.address}
                  placeholder="Enter full address..."
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/customers")}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-medium rounded-lg transition-all shadow-sm hover:shadow-md disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? "Updating..." : "Update Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCustomer;