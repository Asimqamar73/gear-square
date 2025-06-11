import { Combobox } from "../../../../components/ComboBox";
import { Button } from "../../../../components/ui/button";
import { Trash } from "lucide-react";

const InvoiceItem = ({
  products,
  handleSubtotal,
  handleQuantityChange,
  handleProductChange,
  items,
  addNewItem,
  deleteItem,
  comboboxValue,
}: any) => {
  return (
    <div className="p-4 bg-white rounded-2xl flex flex-col gap-4 border  border-gray-300 shadow">
      <h2 className="text-xl mt-2">Items</h2>
      {items.map((item: any, idx: number) => (
        <div className="flex items-end gap-4" key={idx}>
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="name" className="text-sm text-gray-500">
              Name
            </label>
            <Combobox data={products} emptyMessage="No product found...." placeholder="Search product...." value={comboboxValue} handleProductChange={handleProductChange} item={item} itemIdx={idx}/>

            
            {/* <select
              name="products"
              id="products"
              className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
              onChange={(e) => handleProductChange(e, idx)}
            >
              <option selected disabled>
                {"Please select one item"}
              </option>
              {products?.map((product: any) => (
                <option
                  value={product.id}
                  key={product.id}
                  selected={product.id === item?.product?.id}
                >
                  {product.name}
                </option>
              ))}
            </select> */}
          </div>
          <div className="flex flex-col gap-1 grow">
            <label htmlFor="name" className="text-sm text-gray-500">
              Unit price
            </label>
            <input
              type="text"
              name="basePrice"
              id="basePrice"
              className="border rounded-sm p-2 bg-teal-50/30 border-gray-400 disabled:bg-gray-100"
              //   onChange={onMutate}
              value={item.product?.retail_price || 0}
              required
              disabled
              placeholder="102"
            />
          </div>
          <div className="flex flex-col justify-center gap-1 grow relative">
            <label htmlFor="name" className="text-sm text-gray-500">
              Quantity
            </label>

            <input
              type="text"
              name="quantity"
              id="quantity"
              className="border rounded-sm p-2 bg-teal-50/30 border-gray-400 placeholder:text-gray-400"
              //   onChange={onMutate}
              value={item.quantity}
              onBlur={() => handleSubtotal(idx)}
              onChange={(e) => handleQuantityChange(e, idx)}
              required
              placeholder="5"
            />
            {item?.product && (
              <p className="text-xs text-green-700 font-semibold absolute -bottom-4 right-0">
                Available stock {item?.product?.quantity}
              </p>
            )}
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
            />
          </div>
          <div className="flex flex-col gap-1 grow">
            <label htmlFor="name" className="text-sm text-gray-500">
              Profit (per unit)
            </label>
            <input
              type="number"
              name="profit"
              id="profit"
              className="border rounded-sm p-2 bg-teal-50/30 border-gray-400 disabled:bg-gray-100"
              //   onChange={onMutate}
              // value={selectedProduct?.barcode}
              value={item.product?.retail_price  - item.product?.cost_price}
              required
              disabled
              placeholder="30 aed"
            />
          </div>
             <div className="flex flex-col gap-1 grow">
            <label htmlFor="name" className="text-sm text-gray-500">
              Profit (per unit x quantity)
            </label>
            <input
              type="number"
              name="profit"
              id="profit"
              className="border rounded-sm p-2 bg-teal-50/30 border-gray-400 disabled:bg-gray-100"
              //   onChange={onMutate}
              // value={selectedProduct?.barcode}
              value={(item.product?.retail_price  - item.product?.cost_price) * item.quantity}
              required
              disabled
              placeholder="30 aed"
            />
          </div>
       
          {items.length > 1 && (
            <Button
              variant="outline"
              className="bg-red-400 text-white h-11 w-11"
              onClick={() => deleteItem(idx)}
            >
              <Trash />
            </Button>
          )}
        </div>
      ))}
      <Button
        variant={"outline"}
        className="w-fit bg-[#173468] text-white cursor-pointer"
        onClick={addNewItem}
      >
        Add item
      </Button>
    </div>
  );
};

export default InvoiceItem;
