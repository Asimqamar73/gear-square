// import { useState } from "react";
// import PageHeader from "../../../components/PageHeader";
// import { toast } from "sonner";
// import { useNavigate } from "react-router-dom";

// const AddCustomer = () => {
//   const navigate = useNavigate();
//   const initialState = {
//     name: "",
//     email: "",
//     phoneNumber: "",
//     companyName: "",
//     companyPhoneNumber: "",
//     address: "",
//     trn: "",
//   };

//   const [detail, setDetails] = useState(initialState);
//   //@ts-ignore

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();

//     if (!detail.name.trim() && !detail.companyName.trim()) {
//       toast("Name or company name must required", { position: "top-center" });
//       return;
//     }
//     if (!detail.phoneNumber.trim() && !detail.companyPhoneNumber.trim()) {
//       toast("Phone number or company phone must required", { position: "top-center" });
//       return;
//     }
//     //@ts-ignoreå
//     const data = JSON.parse(localStorage.getItem("gear-square-user"));
//     console.log(detail)
//     try {
//       //@ts-ignore
//       const response = await window.electron.addCustomer({
//         ...detail,
//         createdBy: data.id,
//         updatedBy: data.id,
//       });
//       if (response.success) {
//         toast("Customer added successfully...", { position: "top-center" });
//       }
//       navigate(`/customer-details/${response.customerId}`);
//       setDetails(initialState);
//     } catch (error) {
//       toast.error("Something went wrong. Please restart the application", {
//         position: "top-center",
//       });
//     }
//   };

//   const onMutate = (e: any) => {
//     setDetails((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };
//   return (
//     <div className="min-h-screen bg-gray-100">
//       <div className="py-16 px-8">
//         <PageHeader title="Add customer" />
//         <form onSubmit={handleSubmit} className="grid grid-cols-5 gap-4">
//           <div className="col-span-1"></div>
//           <div className="col-span-3 flex flex-col gap-4">
//             <div className="p-4 bg-white rounded-2xl flex flex-col gap-4 border border-gray-300 shadow">
//               <h2 className="text-xl mt-2">General information</h2>
//               <div className="flex gap-2">
//                 <div className="flex flex-col gap-1 grow">
//                   <label htmlFor="name" className="text-sm text-gray-500">
//                     Name
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     id="name"
//                     className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
//                     onChange={onMutate}
//                     value={detail.name}
//                     placeholder="E.g John Doe"
//                   />
//                 </div>
//                 <div className="flex flex-col gap-1 grow">
//                   <label htmlFor="phoneNumber" className="text-sm text-gray-500">
//                     Phone number
//                   </label>
//                   <input
//                     type="tel"
//                     name="phoneNumber"
//                     id="phoneNumber"
//                     className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
//                     onChange={onMutate}
//                     value={detail.phoneNumber}
//                     placeholder="0097150450000"
//                   />
//                 </div>
//               </div>
//               <div className="flex gap-2">
//                 <div className="flex flex-col gap-1 grow">
//                   <label htmlFor="name" className="text-sm text-gray-500">
//                     Company name
//                   </label>
//                   <input
//                     type="text"
//                     name="companyName"
//                     id="companyName"
//                     className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
//                     onChange={onMutate}
//                     value={detail.companyName}
//                     placeholder="Gear Square"
//                   />
//                 </div>
//                 <div className="flex flex-col gap-1 grow">
//                   <label htmlFor="phoneNumber" className="text-sm text-gray-500">
//                     Company phone number
//                   </label>
//                   <input
//                     type="tel"
//                     name="companyPhoneNumber"
//                     id="companyPhoneNumber"
//                     className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
//                     onChange={onMutate}
//                     value={detail.companyPhoneNumber}
//                     placeholder="0097150450000"
//                   />
//                 </div>
//               </div>

//               <div className="flex flex-col gap-1 grow">
//                 <label htmlFor="email" className="text-sm text-gray-500">
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   id="email"
//                   className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
//                   onChange={onMutate}
//                   value={detail.email}
//                   placeholder="john.doe@example.com"
//                 />
//               </div>
//               <div className="flex flex-col gap-1 border-gray-200">
//                 <label htmlFor="address" className="text-sm text-gray-500">
//                   Address
//                 </label>
//                 <textarea
//                   name="address"
//                   id="address"
//                   className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
//                   rows={5}
//                   onChange={onMutate}
//                   value={detail.address}
//                   placeholder="11, Manama Street, Dubai"
//                 ></textarea>
//               </div>
//               <div className="flex flex-col gap-1 grow">
//                 <label htmlFor="email" className="text-sm text-gray-500">
//                   TRN
//                 </label>
//                 <input
//                   type="text"
//                   name="trn"
//                   id="trn"
//                   className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
//                   onChange={onMutate}
//                   value={detail.trn}
//                   placeholder="1234567"
//                 />
//               </div>
//             </div>

//             <button type="submit" className="bg-[#173468] p-2 rounded-sm text-white font-bold">
//               Add customer
//             </button>
//           </div>
//           {/* <div className="col-span-2">
//             <ProductMediaBox onMutate={onMutate} image={product.productImage} />
//           </div> */}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddCustomer;












import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { User, Building2, Phone, Mail, MapPin, FileText, ArrowLeft, Save } from "lucide-react";

interface CustomerDetails {
  name: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  companyPhoneNumber: string;
  address: string;
  trn: string;
}

const AddCustomer = () => {
  const navigate = useNavigate();
  const initialState: CustomerDetails = {
    name: "",
    email: "",
    phoneNumber: "",
    companyName: "",
    companyPhoneNumber: "",
    address: "",
    trn: "",
  };

  const [details, setDetails] = useState<CustomerDetails>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!details.name.trim() && !details.companyName.trim()) {
      toast.error("Either customer name or company name is required", { 
        position: "top-center" 
      });
      return;
    }
    if (!details.phoneNumber.trim() && !details.companyPhoneNumber.trim()) {
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
      const response = await window.electron.addCustomer({
        ...details,
        createdBy: user.id,
        updatedBy: user.id,
      });
      
      if (response.success) {
        toast.success("Customer added successfully", { position: "top-center" });
        navigate(`/customer-details/${response.customerId}`);
        setDetails(initialState);
      }
    } catch (error) {
      toast.error("Failed to add customer. Please try again.", {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8 px-8 max-w-[900px] mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-white hover:shadow-sm flex items-center justify-center transition-all"
            >
              <ArrowLeft className="w-4 h-4 text-gray-700" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Add New Customer</h1>
              <p className="text-sm text-gray-500 mt-0.5">Create a new customer record</p>
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
                  <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-gray-400" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    id="phoneNumber"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                    onChange={handleChange}
                    value={details.phoneNumber}
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
                  <label htmlFor="companyName" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    id="companyName"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                    onChange={handleChange}
                    value={details.companyName}
                    placeholder="Gear Square"
                  />
                </div>

                {/* Company Phone */}
                <div className="space-y-2">
                  <label htmlFor="companyPhoneNumber" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-gray-400" />
                    Company Phone
                  </label>
                  <input
                    type="tel"
                    name="companyPhoneNumber"
                    id="companyPhoneNumber"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                    onChange={handleChange}
                    value={details.companyPhoneNumber}
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
              onClick={() => navigate(-1)}
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
              {isSubmitting ? "Saving..." : "Save Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomer;