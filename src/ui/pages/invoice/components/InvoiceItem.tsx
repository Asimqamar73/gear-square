import { Combobox } from "../../../../components/ComboBox";
import { Button } from "../../../../components/ui/button";
import { Plus, Trash } from "lucide-react";

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
    <div className="p-4 bg-white rounded-2xl flex flex-col gap-4 border  border-gray-300 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800">Service items</h2>
      {items.map((item: any, idx: number) => (
        <div className="flex items-end gap-4" key={idx}>
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="name" className="text-sm text-gray-500">
              Name
            </label>
            <Combobox
              data={products}
              emptyMessage="No product found...."
              placeholder="Search product...."
              value={comboboxValue}
              handleProductChange={handleProductChange}
              item={item}
              itemIdx={idx}
            />
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
              VAT
            </label>
            <input
              type="number"
              name="subtotal"
              id="subtotal"
              className="border rounded-sm p-2 bg-teal-50/30 border-gray-400 disabled:bg-gray-100"
              value={(item.subtotal + item.subtotal * (5 / 100)).toFixed(2)}
              required
              disabled
              placeholder="LXI-990"
            />
          </div>
          {/* <div className="flex flex-col gap-1 grow">
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
              value={item.product?.retail_price - item.product?.cost_price}
              required
              disabled
              placeholder="30 aed"
            />
          </div> */}
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
              value={(
                (item.product?.retail_price - item.product?.cost_price) *
                item.quantity
              ).toFixed(2)}
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
        className="w-fit items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium transition-all shadow-sm hover:shadow-md"
        onClick={addNewItem}
      >
        <Plus className="w-4 h-4" />
        Add item
      </Button>
    </div>
  );
};

export default InvoiceItem;

// // 2nd
// import { Combobox } from "../../../../components/ComboBox";
// import { Button } from "../../../../components/ui/button";
// import { Trash, Plus, Package } from "lucide-react";

// const InvoiceItem = ({
//   products,
//   handleSubtotal,
//   handleQuantityChange,
//   handleProductChange,
//   items,
//   addNewItem,
//   deleteItem,
//   comboboxValue,
// }: any) => {
//   return (
//     <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 shadow-lg overflow-hidden">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-[#173468] to-[#2a5a9e] px-6 py-4 flex items-center gap-3">
//         <Package className="w-5 h-5 text-white" />
//         <h2 className="text-xl font-semibold text-white">Service Items</h2>
//       </div>

//       {/* Items Container */}
//       <div className="p-6 space-y-4">
//         {items.map((item: any, idx: number) => (
//           <div
//             key={idx}
//             className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
//           >
//             {/* Item Number Badge */}
//             <div className="flex items-center justify-between mb-4">
//               <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#173468] text-white">
//                 Item #{idx + 1}
//               </span>
//               {items.length > 1 && (
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="h-8 w-8 p-0 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-400"
//                   onClick={() => deleteItem(idx)}
//                 >
//                   <Trash className="w-4 h-4" />
//                 </Button>
//               )}
//             </div>

//             {/* Form Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
//               {/* Product Name */}
//               <div className="lg:col-span-2">
//                 <label className="block text-xs font-medium text-gray-600 mb-1.5">
//                   Product Name
//                 </label>
//                 <Combobox
//                   data={products}
//                   emptyMessage="No product found...."
//                   placeholder="Search product...."
//                   value={comboboxValue}
//                   handleProductChange={handleProductChange}
//                   item={item}
//                   itemIdx={idx}
//                 />
//               </div>

//               {/* Unit Price */}
//               <div>
//                 <label className="block text-xs font-medium text-gray-600 mb-1.5">
//                   Unit Price
//                 </label>
//                 <input
//                   type="text"
//                   name="basePrice"
//                   className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#173468] focus:border-transparent"
//                   value={item.product?.retail_price || 0}
//                   disabled
//                   placeholder="0.00"
//                 />
//               </div>

//               {/* Quantity */}
//               <div>
//                 <label className="block text-xs font-medium text-gray-600 mb-1.5">
//                   Quantity
//                 </label>
//                 <input
//                   type="text"
//                   name="quantity"
//                   className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#173468] focus:border-transparent placeholder:text-gray-400"
//                   value={item.quantity}
//                   onBlur={() => handleSubtotal(idx)}
//                   onChange={(e) => handleQuantityChange(e, idx)}
//                   required
//                   placeholder="0"
//                 />
//               </div>

//               {/* Subtotal */}
//               <div>
//                 <label className="block text-xs font-medium text-gray-600 mb-1.5">
//                   Subtotal
//                 </label>
//                 <input
//                   type="number"
//                   name="subtotal"
//                   className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-700 text-sm focus:outline-none"
//                   value={item.subtotal}
//                   disabled
//                   placeholder="0.00"
//                 />
//               </div>

//               {/* VAT */}
//               <div>
//                 <label className="block text-xs font-medium text-gray-600 mb-1.5">
//                   VAT (5%)
//                 </label>
//                 <input
//                   type="number"
//                   name="vat"
//                   className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-700 text-sm focus:outline-none"
//                   value={(item.subtotal + item.subtotal * (5 / 100)).toFixed(2)}
//                   disabled
//                   placeholder="0.00"
//                 />
//               </div>
//             </div>

//             {/* Profit Section */}
//             <div className="mt-4 pt-4 border-t border-gray-100">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="bg-teal-50 rounded-md p-3 border border-teal-200">
//                   <label className="block text-xs font-medium text-teal-700 mb-1">
//                     Profit (Total)
//                   </label>
//                   <div className="text-lg font-semibold text-teal-900">
//                     {((item.product?.retail_price - item.product?.cost_price) * item.quantity).toFixed(2)} AED
//                   </div>
//                 </div>
//                 <div className="bg-blue-50 rounded-md p-3 border border-blue-200">
//                   <label className="block text-xs font-medium text-blue-700 mb-1">
//                     Total with VAT
//                   </label>
//                   <div className="text-lg font-semibold text-blue-900">
//                     {(item.subtotal + item.subtotal * (5 / 100)).toFixed(2)} AED
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}

//         {/* Add Item Button */}
//         <Button
//           variant="outline"
//           className="w-full h-12 border-2 border-dashed border-[#173468] text-[#173468] hover:bg-[#173468] hover:text-white transition-all duration-200 font-medium"
//           onClick={addNewItem}
//         >
//           <Plus className="w-5 h-5 mr-2" />
//           Add New Item
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default InvoiceItem;

// 3rd

// import { Button } from "../../../../components/ui/button";
// import { Trash2, Plus } from "lucide-react";
// import { Combobox } from "../../../../components/ComboBox";

// interface InvoiceItemProps {
//   products: any[];
//   items: any[];
//   comboboxValue: string;
//   handleProductChange: (itemIdx: number, product: any) => void;
//   handleQuantityChange: (e: React.ChangeEvent<HTMLInputElement>, idx: number) => void;
//   handleSubtotal: (idx: number) => void;
//   addNewItem: () => void;
//   deleteItem: (idx: number) => void;
// }

// const InvoiceItem = ({
//   products,
//   items,
//   comboboxValue,
//   handleProductChange,
//   handleQuantityChange,
//   handleSubtotal,
//   addNewItem,
//   deleteItem,
// }: InvoiceItemProps) => {
//   return (
//     <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-[#173468] to-[#1e4a7c] text-white px-6 py-4">
//         <h2 className="text-xl font-semibold flex items-center gap-2">
//           Service Items
//         </h2>
//       </div>

//       <div className="p-6 space-y-5">
//         {items.map((item: any, idx: number) => {
//           const unitPrice = item.product?.retail_price || 0;
//           const costPrice = item.product?.cost_price || 0;
//           const quantity = item.quantity || 1;
//           const subtotal = unitPrice * quantity;
//           const vatAmount = subtotal * 0.05;
//           const totalWithVat = subtotal + vatAmount;
//           const profitPerUnit = unitPrice - costPrice;
//           const totalProfit = profitPerUnit * quantity;

//           return (
//             <div
//               key={idx}
//               className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-gray-50/50 p-4 rounded-xl border border-gray-200"
//             >
//               {/* Product Name - Combobox */}
//               <div className="md:col-span-3 h-full">
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5 ">
//                   Service / Product
//                 </label>
//                 <Combobox
//                   data={products}
//                   emptyMessage="No product found..."
//                   placeholder="Search or select product..."
//                   value={comboboxValue}
//                   handleProductChange={(product) => handleProductChange(idx, product)}
//                   item={item}
//                   itemIdx={idx}

//                 />
//               </div>

//               {/* Unit Price */}
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                   Unit Price (AED)
//                 </label>
//                 <input
//                   type="text"
//                   value={unitPrice.toFixed(2)}
//                   disabled
//                   className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 font-medium focus:outline-none"
//                   placeholder="0.00"
//                 />
//               </div>

//               {/* Quantity */}
//               <div className="md:col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                   Qty
//                 </label>
//                 <input
//                   type="number"
//                   min="1"
//                   value={quantity}
//                   onChange={(e) => handleQuantityChange(e, idx)}
//                   onBlur={() => handleSubtotal(idx)}
//                   className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#173468] focus:border-[#173468] transition"
//                   placeholder="1"
//                 />
//               </div>

//               {/* Subtotal */}
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                   Subtotal (AED)
//                 </label>
//                 <input
//                   type="text"
//                   value={subtotal.toFixed(2)}
//                   disabled
//                   className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-teal-50/30 font-semibold text-gray-900"
//                 />
//               </div>

//               {/* VAT + Total */}
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                   Total + VAT (5%)
//                 </label>
//                 <input
//                   type="text"
//                   value={totalWithVat.toFixed(2)}
//                   disabled
//                   className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-emerald-50 font-bold text-emerald-800"
//                 />
//               </div>

//               {/* Profit */}
//               <div className="md:col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                   Profit
//                 </label>
//                 <input
//                   type="text"
//                   value={totalProfit.toFixed(2)}
//                   disabled
//                   className={`w-full px-3 py-2.5 border rounded-lg font-bold text-sm text-center ${
//                     totalProfit >= 0
//                       ? "bg-green-50 text-green-700 border-green-300"
//                       : "bg-red-50 text-red-700 border-red-300"
//                   }`}
//                 />
//               </div>

//               {/* Delete Button */}
//               <div className="md:col-span-1 flex justify-end">
//                 {items.length > 1 && (
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     onClick={() => deleteItem(idx)}
//                     className="h-10 w-10 text-red-600 hover:bg-red-50 hover:text-red-700 transition"
//                   >
//                     <Trash2 className="h-5 w-5" />
//                   </Button>
//                 )}
//               </div>
//             </div>
//           );
//         })}

//         {/* Add New Item Button */}
//         <div className="pt-4">
//           <Button
//             onClick={addNewItem}
//             className="bg-[#173468] hover:bg-[#1e4a7c] text-white font-medium px-6 py-5 rounded-xl shadow-md transition-all hover:shadow-lg flex items-center gap-2"
//           >
//             <Plus className="h-5 w-5" />
//             Add New Item
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InvoiceItem;
