import { useState } from "react";
import PageHeader from "../../../components/PageHeader";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const AddCustomer = () => {
  const navigate = useNavigate();
  const initialState = {
    name: "",
    email: "",
    phoneNumber: "",
    companyName: "",
    companyPhoneNumber: "",
    address: "",
  };

  const [detail, setDetails] = useState(initialState);
  //@ts-ignore

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!detail.name.trim() && !detail.companyName.trim()) {
      toast("Name or company name must required", { position: "top-center" });
      return;
    }
    if (!detail.phoneNumber.trim() && !detail.companyPhoneNumber.trim()) {
      toast("Phone number or company phone must required", { position: "top-center" });
      return;
    }
    //@ts-ignoreå
    const data = JSON.parse(localStorage.getItem("gear-square-user"));
    try {
      //@ts-ignore
      const response = await window.electron.addCustomer({
        ...detail,
        createdBy: data.id,
        updatedBy: data.id,
      });
      if (response.success) {
        toast("Customer added successfully...", { position: "top-center" });
      }
      navigate(`/generate-invoice/${response.customerId}`);
      setDetails(initialState);
    } catch (error) {
      toast.error("Something went wrong. Please restart the application", {
        position: "top-center",
      });
    }
  };

  const onMutate = (e: any) => {
    setDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-16 px-8">
        <PageHeader title="Add customer" />
        <form onSubmit={handleSubmit} className="grid grid-cols-5 gap-4">
          <div className="col-span-1"></div>
          <div className="col-span-3 flex flex-col gap-4">
            <div className="p-4 bg-white rounded-2xl flex flex-col gap-4 border border-gray-300 shadow">
              <h2 className="text-xl mt-2">General information</h2>
              <div className="flex gap-2">
                <div className="flex flex-col gap-1 grow">
                  <label htmlFor="name" className="text-sm text-gray-500">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
                    onChange={onMutate}
                    value={detail.name}
                    placeholder="E.g John Doe"
                  />
                </div>
                <div className="flex flex-col gap-1 grow">
                  <label htmlFor="phoneNumber" className="text-sm text-gray-500">
                    Phone number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    id="phoneNumber"
                    className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
                    onChange={onMutate}
                    value={detail.phoneNumber}
                    placeholder="0097150450000"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex flex-col gap-1 grow">
                  <label htmlFor="name" className="text-sm text-gray-500">
                    Company name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    id="companyName"
                    className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
                    onChange={onMutate}
                    value={detail.companyName}
                    placeholder="Gear Square"
                  />
                </div>
                <div className="flex flex-col gap-1 grow">
                  <label htmlFor="phoneNumber" className="text-sm text-gray-500">
                    Company phone number
                  </label>
                  <input
                    type="tel"
                    name="companyPhoneNumber"
                    id="companyPhoneNumber"
                    className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
                    onChange={onMutate}
                    value={detail.companyPhoneNumber}
                    placeholder="0097150450000"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1 grow">
                <label htmlFor="email" className="text-sm text-gray-500">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
                  onChange={onMutate}
                  value={detail.email}
                  placeholder="john.doe@example.com"
                />
              </div>
              <div className="flex flex-col gap-1 border-gray-200">
                <label htmlFor="address" className="text-sm text-gray-500">
                  Address
                </label>
                <textarea
                  name="address"
                  id="address"
                  className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
                  rows={5}
                  onChange={onMutate}
                  value={detail.address}
                  placeholder="11, Manama Street, Dubai"
                ></textarea>
              </div>
            </div>

            <button type="submit" className="bg-[#173468] p-2 rounded-sm text-white font-bold">
              Add customer
            </button>
          </div>
          {/* <div className="col-span-2">
            <ProductMediaBox onMutate={onMutate} image={product.productImage} />
          </div> */}
        </form>
      </div>
    </div>
  );
};

export default AddCustomer;
