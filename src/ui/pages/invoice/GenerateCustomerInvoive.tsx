import { useEffect, useState } from "react";
import InvoiceHeadInfo from "./components/InvoiceHeadInfo";
import InvoiceItem from "./components/InvoiceItem";
import { Button } from "../../../components/ui/button";
import AlertBox from "../../../components/AlertBox";
import PageHeader from "../../../components/PageHeader";
import { useNavigate, useParams } from "react-router-dom";
import { Building2, MapPin, Phone, User2 } from "lucide-react";
import { toast } from "sonner";

interface IItems {
  product: any;
  quantity: number;
  subtotal: number;
}
interface ICustomerInfo {
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
}

export const GenerateCustomerInvoive = () => {
  const navigate = useNavigate();
  const params = useParams();
  const paymentStatuses = [
    { title: "Unpaid", value: 0 },
    { title: "Partial", value: 1 },
    { title: "Paid", value: 2 },
  ];
  const initialItemState: IItems = {
    product: null,
    quantity: 1,
    subtotal: 0,
  };

  const vehicleInfoInitialState = {
    vehicleNumber: "",
    make: "",
    model: "",
    year: "",
    note: "",
    chassisNumber: "",
  };
  const [products, setProducts] = useState([]);
  const [customerInfo, setCustomerInfo] = useState<ICustomerInfo | null>(null);

  const [totalBill, setTotalBill] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState(0);
  const [discountPercentge, setDiscountPrecentage] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [vehicleDetails, setVehicleDetails] = useState(vehicleInfoInitialState);
  const [comboboxValue, comboboxSetValue] = useState(null);

  const [items, setItems] = useState([initialItemState]);
  useEffect(() => {
    Promise.allSettled([fetchAllProducts(), fetchCustomerInformation()]);
  }, []);

  const fetchAllProducts = async () => {
    try {
      //@ts-ignore
      const response = await window.electron.getProducts();
      //@ts-ignore
      setProducts(response);
    } catch (error) {
      toast.error("Something went wrong. Please restart the application", {
        position: "top-center",
      });
    }
  };
  const fetchCustomerInformation = async () => {
    try {
      //@ts-ignore
      const { response } = await window.electron.getCustomerById(params.customerId);
      //@ts-ignore
      setCustomerInfo(response);
    } catch (error) {
      toast.error("Something went wrong. Please restart the application", {
        position: "top-center",
      });
    }
  };

  const addNewItem = () => {
    setItems([...items, initialItemState]);
  };

  const handleProductChange = (id: number, idx: number) => {
    const prod: any = products.find((product: any) => product.id == id);

    const updatedItem = [...items];
    //@ts-ignore
    updatedItem[idx] = {
      ...updatedItem[idx],
      product: prod,

      subtotal: prod?.retail_price * items[idx].quantity,
    };
    const total = updatedItem.reduce((prev, curr) => {
      return prev + curr.subtotal;
    }, 0);
    setTotalBill(total);
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
    const total = updatedItem.reduce((prev, curr) => {
      return prev + curr.subtotal;
    }, 0);
    setTotalBill(total);
    setItems(updatedItem);
  };

  const deleteItem = (idx: number) => {
    // const filteredItems = items.filter((_, itemIdx) => itemIdx != idx);
    const filteredItems = [...items.slice(0, idx), ...items.slice(idx + 1)];
    const total = filteredItems.reduce((prev, curr) => {
      return prev + curr.subtotal;
    }, 0);
    setTotalBill(total);
    setItems([...filteredItems]);
  };

  const handleInvoiceGeneration = async () => {
    try {
      // @ts-ignore
      const response = await window.electron.generateInvoice({
        items,
        vehicleDetails: {
          ...vehicleDetails,
          //@ts-ignore
          createdBy: JSON.parse(localStorage.getItem("gear-square-user")).id,
          //@ts-ignore
          updatedBy: JSON.parse(localStorage.getItem("gear-square-user")).id,
          customerId: customerInfo?.id,
        },
        bill: {
          total: (totalBill - (discountPercentge / 100) * totalBill).toFixed(1),
          subtotal: totalBill,
          discount: discountPercentge,
          billStatus: paymentStatus,
          amountPaid,
        },
      });
      setItems([initialItemState]);
      setDiscountPrecentage(0);
      setAmountPaid(0);
      setPaymentStatus(0);
      setVehicleDetails(vehicleInfoInitialState);
      setTotalBill(0);
      if (response.success) {
        toast("Invoice generated successfully.", {
          position: "top-center",
        });
        navigate(`/invoice/${response.service_id}`);
      }
    } catch (error) {
      toast.error("Something went wrong. Please restart the application", {
        position: "top-center",
      });
    }
  };

  const handleVehicleDetailsChange = (e: any) => {
    setVehicleDetails((prev) => {
      return {
        ...prev,
        [e.target.id]: e.target.value,
      };
    });
  };

  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-16 px-8">
        <div className="flex flex-col gap-2 mb-8">
          <PageHeader title="Generate invoice">
            {items.length && items[0].product && (
              <Button
                variant="outline"
                className="bg-[#173468] text-white font-bold"
                onClick={() => setOpen(true)}
              >
                Generate
              </Button>
            )}

            <AlertBox
              open={open}
              setOpen={setOpen}
              continueProcessHandler={handleInvoiceGeneration}
              text="Are you sure you want to generate invoice?"
              subtext="Invoice will be stored in the database."
            />
          </PageHeader>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="grow">
                <InvoiceHeadInfo
                  vehicleDetails={vehicleDetails}
                  handleVehicleDetailsChange={handleVehicleDetailsChange}
                />
              </div>
              <div className="flex justify-end">
                <div className="p-4 bg-white rounded-2xl flex flex-col gap-4 border border-gray-300 shadow">
                  <h2 className="text-xl mt-2">Customer Details</h2>
                  {customerInfo?.name && (
                    <CustomerDetail text={customerInfo?.name} subtext={customerInfo?.email}>
                      <User2 className="text-gray-500 size-6" />
                    </CustomerDetail>
                  )}
                  {customerInfo?.company_name && (
                    <CustomerDetail text={customerInfo?.company_name} subtext={customerInfo?.company_phone_number}>
                      <Building2 className="text-gray-500 size-6"  />
                    </CustomerDetail>
                  )}
                  {customerInfo?.phone_number && (
                    <CustomerDetail text={customerInfo?.phone_number}>
                      <Phone className="text-gray-500 size-6" />
                    </CustomerDetail>
                  )}
                  {customerInfo?.address && (
                    <CustomerDetail text={customerInfo?.address}>
                      <MapPin className="text-gray-500 size-6" />
                    </CustomerDetail>
                  )}
                </div>
              </div>
            </div>
            <InvoiceItem
              products={products}
              handleProductChange={handleProductChange}
              handleQuantityChange={handleQuantityChange}
              handleSubtotal={handleSubtotal}
              items={items}
              addNewItem={addNewItem}
              deleteItem={deleteItem}
              comboboxValue={comboboxValue}
              comboboxSetValue={comboboxSetValue}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <div className="w-fit">
            <div className="p-4 bg-white rounded-2xl flex flex-col gap-4 border border-gray-300 shadow">
              <h2 className="text-lg font-semibold mt-2 flex justify-between text-gray-600">
                Sub total <p>{totalBill} aed</p>
              </h2>
              <div className="flex flex-col justify-end  gap-2">
                <div className="flex flex-col gap-1 grow">
                  <label htmlFor="name" className="flex justify-between text-sm text-gray-500">
                    <span>Discount</span>

                    <span className="text-xs text-right text-gray-600">
                      {((discountPercentge / 100) * totalBill).toFixed(1)} aed
                    </span>
                  </label>
                  <input
                    type="text"
                    name=""
                    id="name"
                    className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
                    //@ts-ignore
                    onChange={(e) => setDiscountPrecentage(e?.target?.value)}
                    value={discountPercentge}
                    required
                    placeholder="2.7%"
                  />
                </div>{" "}
                <div className="flex flex-col gap-1 grow">
                  <label htmlFor="payAmount" className="text-sm text-gray-500">
                    Pay amount
                  </label>
                  <input
                    type="text"
                    name="payAmount"
                    id="payAmount"
                    className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
                    //@ts-ignore
                    onChange={(e) => setAmountPaid(e?.target?.value)}
                    value={amountPaid}
                    required
                    placeholder="200 aed"
                  />
                </div>{" "}
                <div className="flex flex-col gap-1 grow">
                  <label htmlFor="name" className="text-sm text-gray-500">
                    Payment status
                  </label>
                  <select
                    name="products"
                    id="products"
                    className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
                    //@ts-ignore
                    onChange={(e) => setPaymentStatus(e?.target?.value)}
                  >
                    {paymentStatuses?.map((status: any) => (
                      <option value={status.value} key={status.value}>
                        {status.title}
                      </option>
                    ))}
                  </select>
                </div>
                <hr className="bg-gray-200 text-gray-300 my-4" />
                <h2 className="text-lg font-semibold flex justify-between text-gray-600">
                  Total{" "}
                  <p>
                    {totalBill > 0
                      ? (totalBill - (discountPercentge / 100) * totalBill).toFixed(1)
                      : 0}{" "}
                    aed
                  </p>
                </h2>
                  <h2 className="text-lg font-semibold flex justify-between text-gray-600">
                  Remaining{" "}
                  <p>
                    {totalBill > 0
                      ? ((totalBill - (discountPercentge / 100) * totalBill) - amountPaid).toFixed(1)
                      : 0}{" "}
                    aed
                  </p>
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
