import { useEffect, useState } from "react";
import InvoiceHeadInfo from "./components/InvoiceHeadInfo";
import InvoiceItem from "./components/InvoiceItem";
import { Button } from "../../../components/ui/button";
import AlertBox from "../../../components/AlertBox";
import PageHeader from "../../../components/PageHeader";
import { toast } from "sonner";

interface IItems {
  product: any;
  quantity: number;
  subtotal: number;
}
export const GenerateInvoice = () => {
  const initialItemState: IItems = {
    product: null,
    quantity: 1,
    subtotal: 0,
  };
  const initialServiceDetailsState = {
    name: "",
    note: "",
    phone_number: "",
    vehicle_number: "",
  };
  const [products, setProducts] = useState([]);
  const [totalBill, setTotalBill] = useState(0);
  const [comboBoxValue, setComboBoxValue] = useState();
  const [discountPercentge, setDiscountPrecentage] = useState(0);
  const [serviceDetails, setServiceDetails] = useState(initialServiceDetailsState);

  const [items, setItems] = useState([initialItemState]);
  useEffect(() => {
    fetchAllProducts();
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

  const addNewItem = () => {
    setItems([...items, initialItemState]);
  };

  const handleProductChange = (e: any, idx: number) => {
    const prod: any = products.find((product: any) => product.id == e.target.value);
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

  const handleInvoiceGeneration = () => {
    // @ts-ignore
    window.electron.generateInvoice({
      items,
      //@ts-ignore
      serviceDetails: {
        ...serviceDetails,
        //@ts-ignore
        created_at: JSON.parse(localStorage.getItem("gear-square-user")).id,
      },
      bill: {
        total: (totalBill - (discountPercentge / 100) * totalBill).toFixed(1),
        subtotal: totalBill,
        discount: discountPercentge,
      },
    });

    setItems([initialItemState]);
    setDiscountPrecentage(0);
    setServiceDetails(initialServiceDetailsState);
    setTotalBill(0);
  };

  const handleServiceDetailsChange = (e: any) => {
    setServiceDetails((prev) => {
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
          <PageHeader title="Invoice details">
            {items.length && items[0].product && (
              <Button
                variant="outline"
                className="bg-[#173468] text-white font-bold"
                // onClick={handleInvoiceGeneration}
                onClick={() => setOpen(true)}
              >
                Generate
              </Button>
            )}

            <AlertBox
              open={open}
              setOpen={setOpen}
              continueProcessHandler={handleInvoiceGeneration}
              text=""
              subtext=""
            />
          </PageHeader>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="grow">
                <InvoiceHeadInfo
                  servive={serviceDetails}
                  handleServiceDetailsChange={handleServiceDetailsChange}
                />
              </div>
              <div className="flex justify-end">
                <div className="p-4 bg-white rounded-2xl flex flex-col gap-2 border border-gray-300 shadow w-fit">
                  <h2 className="text-lg font-semibold mt-2 flex justify-between text-gray-600">
                    Sub total <p>{totalBill} aed</p>
                  </h2>
                  <div className="flex flex-col justify-end gap-4">
                    {/* <div className="flex flex-col gap-1 grow">
                <label htmlFor="name" className="text-sm text-gray-500">
                  Total
                </label>
                <input
                  type="text"
                  name=""
                  id="name"
                  className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
                  //   onChange={onMutate}
                  //   value={product.name}
                  required
                  placeholder="795.99"
                  value={totalBill}
                  disabled
                />
              </div>{" "} */}
                    <div className="flex flex-col gap-1 grow">
                      <label htmlFor="name" className="text-sm text-gray-500">
                        Discount
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
                      <p className="text-xs text-right text-gray-600">
                        {(discountPercentge / 100) * totalBill} aed
                      </p>
                    </div>{" "}
                    {/* <div className="flex flex-col gap-1 grow">
                    <label htmlFor="name" className="text-sm text-gray-500">
                      Tax
                    </label>
                    <input
                      type="text"
                      name=""
                      id="tax"
                      className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
                      //   onChange={onMutate}
                      //   value={product.name}
                      required
                      placeholder="5.3%"
                    />
                  </div>{" "} */}
                    <hr className="bg-gray-200 text-gray-300" />
                    <h2 className="text-lg font-semibold flex justify-between text-gray-600">
                      Total{" "}
                      <p>
                        {totalBill > 0
                          ? (totalBill - (discountPercentge / 100) * totalBill).toFixed(1)
                          : 0}{" "}
                        aed
                      </p>
                    </h2>
                    {/* <div className="flex flex-col gap-1 grow">
                <label htmlFor="name" className="text-sm text-gray-500">
                  Grand total
                </label>
                <input
                  type="text"
                  name=""
                  id="tax"
                  className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
                  //   onChange={onMutate}
                  //   value={product.name}
                  required
                  placeholder="1259.99"
                  disabled
                />
              </div> */}
                  </div>
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
              comboboxValue={comboBoxValue}
              comboboxSetValue={setComboBoxValue}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
