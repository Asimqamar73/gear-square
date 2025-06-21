import { useEffect, useState } from "react";
import PageHeader from "../../../components/PageHeader";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";

const EditCustomer = () => {
  // const navigate = useNavigate();
  const { id } = useParams();
  const initialState = {
    name: "",
    email: "",
    phone_number: "",
    address: "",
  };

  const [detail, setDetails] = useState(initialState);

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const fetchCustomerData = async () => {
    try {
      //@ts-ignore
      const { response } = await window.electron.getCustomerById(id);
      setDetails(response);
    } catch (error) {
      console.log(error);
    }
  };
  //@ts-ignore

  const handleSubmit = async (e: any) => {
    //@ts-ignoreå
    const data = JSON.parse(localStorage.getItem("gear-square-user"));

    e.preventDefault();
    try {
      //@ts-ignore
      const response = await window.electron.updateCustomerDetailsById({
        ...detail,
        updatedBy: data.id,
      });
      if (response.success) {
        toast("Customer details successfully...", { position: "top-center" });
      }
      console.log(response);
      setDetails(initialState);
    } catch (error) {
      console.log(error);
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
        <PageHeader title="Edit customer details" />
        <form onSubmit={handleSubmit} className="grid grid-cols-5 gap-4">
          <div className="col-span-1"></div>
          <div className="col-span-3 flex flex-col gap-4">
            <div className="p-4 bg-white rounded-2xl flex flex-col gap-4 border border-gray-300 shadow">
              <h2 className="text-xl mt-2">General information</h2>
              <div className="flex flex-col gap-1">
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
                  required
                />
              </div>
              <div className="flex flex-col gap-1 grow">
                <label htmlFor="phone_number" className="text-sm text-gray-500">
                  Phone number
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  id="phone_number"
                  className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
                  onChange={onMutate}
                  required
                  value={detail.phone_number}
                  placeholder="0097150450000"
                />
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
                  required
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
                  required
                  value={detail.address}
                  placeholder="11, Manama Street, Dubai"
                ></textarea>
              </div>
            </div>

            <button type="submit" className="bg-[#173468] p-2 rounded-sm text-white font-bold">
              Save
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

export default EditCustomer;
