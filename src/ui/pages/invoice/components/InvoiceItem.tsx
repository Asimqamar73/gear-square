import { Button } from "../../../../components/ui/button";
import { Trash } from "lucide-react";

const InvoiceItem = ({
  products,
  handleProductChange,
  handleSubtotal,
  handleQuantityChange,
  items,
  addNewItem,
  deleteItem
}: any) => {
  return (
    <div className="p-4 bg-white rounded-2xl flex flex-col gap-4 border  border-gray-400 shadow">
      <h2 className="text-xl mt-2">Items</h2>
      {items.map((item: any, idx: number) => (
        <div className="flex items-end gap-4" key={idx}>
          <div className="flex flex-col gap-1 grow">
            <label htmlFor="name" className="text-sm text-gray-500">
              Name
            </label>
            <select
              name="products"
              id="products"
              className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
              onChange={(e) => handleProductChange(e, idx)}
            >
              <option selected disabled>
                {"Please select one item"}
              </option>
              {products?.map((product: any) => (
                <option value={product.id} key={product.id} selected={product.id===item?.product?.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1 grow">
            <label htmlFor="name" className="text-sm text-gray-500">
              Base price
            </label>
            <input
              type="text"
              name="basePrice"
              id="basePrice"
              className="border rounded-sm p-2 bg-teal-50/30 border-gray-400 disabled:bg-gray-100"
              //   onChange={onMutate}
              value={item.product?.base_price || 0}
              defaultValue={0}
              required
              disabled
              placeholder="102"
            />
          </div>
          <div className="flex flex-col gap-1 grow">
            <label htmlFor="name" className="text-sm text-gray-500">
              Quantity
            </label>
            <input
              type="text"
              name="quantity"
              id="quantity"
              defaultValue={1}
              className="border rounded-sm p-2 bg-teal-50/30 border-gray-400 placeholder:text-gray-400"
              //   onChange={onMutate}
              value={item.quantity}
              onBlur={() => handleSubtotal(idx)}
              onChange={(e) => handleQuantityChange(e, idx)}
              required
              placeholder="5"
            />
          </div>
          <div className="flex flex-col gap-1 grow">
            <label htmlFor="name" className="text-sm text-gray-500">
              Subtotal
            </label>
            <input
              type="number"
              name="subtotal"
              id="subtotal"
              className="border rounded-sm p-2 bg-teal-50/30 border-gray-400 disabled:bg-gray-100"
              //   onChange={onMutate}
              // value={selectedProduct?.barcode}
              value={item.subtotal}
              required
              disabled
              placeholder="LXI-990"
              defaultValue={0}
            />
          </div>
          {items.length > 1 && (
            <Button variant="outline" className="bg-red-400 text-white h-11 w-11" onClick={()=>deleteItem(idx)}>
              <Trash />
            </Button>
          )}
        </div>
      ))}
      <Button variant={"outline"} className="w-fit" onClick={addNewItem}>
        Add
      </Button>
    </div>
  );
};

export default InvoiceItem;
