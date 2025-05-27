import { useEffect, useState } from "react";
import InvoiceHeadInfo from "./components/InvoiceHeadInfo";
import InvoiceItem from "./components/InvoiceItem";
import { Button } from "../../../components/ui/button";

interface IItems {
  product: any;
  quantity: number;
  subtotal: number;
}
export const GenerateInvoive = () => {
  const [products, setProducts] = useState([]);
  const [totalBill, setTotalBill] = useState(0);
  const initialItemState: IItems = {
    product: null,
    quantity: 1,
    subtotal: 0,
  };

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
      console.log(error);
    }
  };

  const addNewItem = () => {
    setItems([...items, initialItemState]);
  };

  const handleProductChange = (e: any, idx: number) => {
    const prod = products.find((product: any) => product.id == e.target.value);
    const updatedItem = [...items];
    //@ts-ignore
    updatedItem[idx] = {
      ...updatedItem[idx],
      product: prod,

      subtotal: prod?.base_price * items[idx].quantity,
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
      subtotal: items[idx].quantity * items[idx]?.product?.base_price,
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
    console.log(filteredItems)
     const total = filteredItems.reduce((prev, curr) => {
      return prev + curr.subtotal;
    }, 0);
    setTotalBill(total);
    setItems([...filteredItems]);
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-16 px-8">
        <div className="flex flex-col gap-2 mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-medium text-gray-700">Generate invoice</h1>
            {items.length && items[0].product && (
              <Button variant="outline" className="bg-[#173468] text-white font-bold">
                Generate
              </Button>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <InvoiceHeadInfo />
          <InvoiceItem
            products={products}
            handleProductChange={handleProductChange}
            handleQuantityChange={handleQuantityChange}
            handleSubtotal={handleSubtotal}
            items={items}
            addNewItem={addNewItem}
            deleteItem={deleteItem}
          />
          <div className="p-4 bg-white rounded-2xl flex flex-col gap-4 border border-gray-400 shadow">
            <h2 className="text-xl mt-2">Bill</h2>
            <div className="flex gap-4">
              <div className="flex flex-col gap-1 grow">
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
              </div>{" "}
              <div className="flex flex-col gap-1 grow">
                <label htmlFor="name" className="text-sm text-gray-500">
                  Discount
                </label>
                <input
                  type="text"
                  name=""
                  id="name"
                  className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
                  //   onChange={onMutate}
                  //   value={product.name}
                  required
                  placeholder="2.7%"
                />
              </div>{" "}
              <div className="flex flex-col gap-1 grow">
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
              </div>{" "}
              <div className="flex flex-col gap-1 grow">
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
              </div>
            </div>
            {/* <h2 className="font-bold text-2xl text-gray-500">{`Total bill ${totalBill} aed.`}</h2> */}
          </div>
        </div>
      </div>
    </div>
  );
};
