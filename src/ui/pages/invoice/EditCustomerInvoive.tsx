import { useEffect, useState } from "react";
import InvoiceItem from "./components/InvoiceItem";
import { Button } from "../../../components/ui/button";
import AlertBox from "../../../components/AlertBox";
import PageHeader from "../../../components/PageHeader";
import { useNavigate, useParams } from "react-router-dom";
import { Car, MapPin, Phone, User2 } from "lucide-react";
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
  vehicle_number: string;
  chassis_number: string;
  phone_number: string;
  created_at: string;
  created_by: number;
  updated_at: string;
  updated_by: number;
}

export const EditCustomerInvoive = () => {
  // const paymentStatuses = [
  //   { title: "Unpaid", value: 0 },
  //   { title: "Partial", value: 1 },
  //   { title: "Paid", value: 2 },
  // ];
  const params = useParams();
  const navigate = useNavigate();
  const initialItemState: IItems = {
    product: null,
    quantity: 1,
    subtotal: 0,
  };

  // const vehicleInfoInitialState = {
  //   vehicle_number: "",
  //   make: "",
  //   model: "",
  //   year: "",
  //   note: "",
  // };
  const [products, setProducts] = useState([]);
  const [customerInfo, setCustomerInfo] = useState<ICustomerInfo | null>(null);

  const [totalBill, setTotalBill] = useState(0);
  // const [paymentStatus, setPaymentStatus] = useState(0);
  // const [discountPercentge, setDiscountPrecentage] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  // const [vehicleDetails, setVehicleDetails] = useState(vehicleInfoInitialState);
  const [comboboxValue, comboboxSetValue] = useState(null);

  const [newItemsIndexes, setNewItemsIndexes] = useState([]);

  const [items, setItems] = useState<any>([initialItemState]);
  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      //@ts-ignore
      const response = await window.electron.getProducts();
      //@ts-ignore
      setProducts(response);
      fetchDetails(params.invoiceId, response);
    } catch (error) {
      toast.error("Something went wrong. Please restart the application", {
        position: "top-center",
      });
    }
  };

  const fetchDetails = async (id: any, products: any) => {
    try {
      //@ts-ignore
      const resp = await window.electron.getInvoiceDetails(id, products);
      // setDetails(resp);
      setCustomerInfo(resp.service);
      setTotalBill(resp.serviceBill.subtotal);
      setAmountPaid(resp.serviceBill.amount_paid);
      const f_items = products
        .filter(
          //@ts-ignore
          (p) => resp.serviceItems.some((i) => i.item === p.id) // Filter products where there's a match in items
        )
        .map((p: any) => {
          //@ts-ignore
          const match = resp.serviceItems.find((i) => i.item === p.id); // Find the matching item from the items array
          return {
            product: p, // Include the full product object
            subtotal: match.subtotal, // Add the subtotal from the items array
            quantity: match.quantity, // Add the quantity from the items array
            id: match.id,
          };
        });
      setItems(f_items);
    } catch (error) {
      toast.error("Something went wrong. Please restart the application", {
        position: "top-center",
      });
    }
  };

  const addNewItem = () => {
    //@ts-ignore
    setNewItemsIndexes([...newItemsIndexes, items.length]);
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

    // if (newItemsIndexes.includes(idx)) {
    //   setInvoiceUpdateAction({
    //     ...invoiceUpdateActions,
    //     //@ts-ignore
    //     insert: [
    //       //@ts-ignore
    //       ...invoiceUpdateActions.insert,
    //       //@ts-ignore
    //       (updatedItem[idx] = {
    //         ...updatedItem[idx],
    //         product: prod,

    //         subtotal: prod?.retail_price * items[idx].quantity,
    //       }),
    //     ],
    //   });
    //   const removedIndexesFilter = newItemsIndexes.filter((index) => index != idx);
    //   setNewItemsIndexes(removedIndexesFilter);
    // } else {
    //   setInvoiceUpdateAction({
    //     ...invoiceUpdateActions,
    //     //@ts-ignore
    //     insert: [
    //       //@ts-ignore
    //       ...invoiceUpdateActions.update,
    //       //@ts-ignore
    //       (updatedItem[idx] = {
    //         ...updatedItem[idx],
    //         product: prod,

    //         subtotal: prod?.retail_price * items[idx].quantity,
    //       }),
    //     ],
    //   });
    // }

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
    // if (!newItemsIndexes.includes(idx)) {
    //   setInvoiceUpdateAction({
    //     ...invoiceUpdateActions,
    //     //@ts-ignore
    //     delete: [...invoiceUpdateActions.delete, items[idx].id],
    //   });
    // }
    // const filteredNewInsertedItems = newItemsIndexes.filter((item) => item != idx);
    // setNewItemsIndexes(filteredNewInsertedItems);

    // const filteredItems = items.filter((_, itemIdx) => itemIdx != idx);
    const filteredItems = [...items.slice(0, idx), ...items.slice(idx + 1)];
    const total = filteredItems.reduce((prev, curr) => {
      return prev + curr.subtotal;
    }, 0);
    setTotalBill(total);
    setItems([...filteredItems]);
  };

  const handleInvoiceUpdate = async () => {
    try {
      //@ts-ignore
      const response = await window.electron.updateInvoice({
        service_id: params.invoiceId,
        items,
        total: totalBill,
        subtotal: totalBill,
        payment_status:
          amountPaid === 0
            ? 0
            : totalBill - amountPaid === 0
            ? 2
            : totalBill - amountPaid < 0
            ? 3
            : 1,
      });
      if (response.success) {
        toast("Invoice updated.", { position: "top-center" });
        navigate(`/invoice/${params.invoiceId}`);
      }
    } catch (error) {
      toast.error("Something went wrong. Please restart the application", {
        position: "top-center",
      });
    }
    // @ts-ignore
    // window.electron.generateInvoice({
    //   items,
    //   vehicleDetails: {
    //     ...vehicleDetails,
    //     //@ts-ignore
    //     createdBy: JSON.parse(localStorage.getItem("gear-square-user")).id,
    //     //@ts-ignore
    //     updatedBy: JSON.parse(localStorage.getItem("gear-square-user")).id,
    //     customerId: customerInfo?.id,
    //   },
    // bill: {
    //   total: (totalBill - (discountPercentge / 100) * totalBill).toFixed(1),
    //   subtotal: totalBill,
    //   discount: discountPercentge,
    //   billStatus: paymentStatus,
    //   amountPaid,
    // },
    // });

    // setItems([initialItemState]);
    // setDiscountPrecentage(0);
    // setAmountPaid(0);
    // setPaymentStatus(0);
    // setVehicleDetails(vehicleInfoInitialState);
    // setTotalBill(0);
  };

  // const handleVehicleDetailsChange = (e: any) => {
  //   setVehicleDetails((prev) => {
  //     return {
  //       ...prev,
  //       [e.target.id]: e.target.value,
  //     };
  //   });
  // };

  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-16 px-8">
        <div className="flex flex-col gap-2 mb-8">
          <PageHeader title="Edit invoice">
            <Button
              variant="outline"
              className="bg-[#173468] text-white font-bold"
              onClick={() => setOpen(true)}
            >
              Update
            </Button>
            <AlertBox
              open={open}
              setOpen={setOpen}
              continueProcessHandler={handleInvoiceUpdate}
              text="Are you sure you want to update invoice?"
              subtext="Previous data will be overwrite with new invoice"
            />
          </PageHeader>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              {/* <div className="grow">
                <InvoiceHeadInfo
                  vehicleDetails={vehicleDetails}
                  handleVehicleDetailsChange={handleVehicleDetailsChange}
                />
              </div> */}
              <div className="flex justify-end">
                <div className="p-4 bg-white rounded-2xl flex flex-col gap-4 border border-gray-300 shadow">
                  <h2 className="text-xl mt-2">Invoice Details</h2>
                  <CustomerDetail text={customerInfo?.name} subtext={customerInfo?.email}>
                    <User2 className="text-gray-500 size-6" />
                  </CustomerDetail>
                  <CustomerDetail text={customerInfo?.phone_number}>
                    <Phone className="text-gray-500 size-6" />
                  </CustomerDetail>
                  {customerInfo?.address && (
                    <CustomerDetail text={customerInfo?.address}>
                      <MapPin className="text-gray-500 size-6" />
                    </CustomerDetail>
                  )}

                  {customerInfo?.vehicle_number && (
                    <CustomerDetail
                      text={customerInfo?.vehicle_number}
                      subtext={customerInfo?.chassis_number}
                    >
                      <Car className="text-gray-500 size-6" />
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
          <div className="">
            <div className="p-4 bg-white rounded-2xl flex flex-col gap-4 border border-gray-300 shadow">
              <h2 className="text-lg font-semibold mt-2 flex justify-between text-gray-600">
                Sub total <p>{totalBill} aed</p>
              </h2>
              <div className="flex flex-col justify-end  gap-2">
                {/* <div className="flex flex-col gap-1 grow">
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
                </div>{" "} */}
                <div className="flex justify-between gap-1 grow">
                  <p>Amount paid</p>
                  <p>{amountPaid} aed</p>
                  {/* <label htmlFor="payAmount" className="text-sm text-gray-500">
                    Amount paid
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
                  /> */}
                </div>{" "}
                {/* <div className="flex flex-col gap-1 grow">
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
                </div> */}
                <hr className="bg-gray-200 text-gray-300 my-4" />
                <div className="text-lg  font-semibold flex justify-between text-gray-600">
                  Remaining amount <p className="ml-4">{totalBill - amountPaid} aed</p>
                </div>
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
