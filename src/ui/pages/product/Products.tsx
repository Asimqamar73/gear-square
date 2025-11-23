// import { useEffect, useState } from "react";
// import Table from "./components/Table";
// import useDebounce from "react-debounced";
// import SearchBar from "../../../components/SearchBar";
// import CustomSheet from "../../../components/CustomSheet";
// import { Separator } from "../../../components/ui/separator";
// import { toast } from "sonner";
// import ProductsTable from "./components/Table";
// import { useNavigate } from "react-router-dom";

// const Products = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchLoading, setSearchLoading] = useState(false);

//   const debounce = useDebounce(2000);
//   const [searchVal, setSearchVal] = useState("");

//   const handleSearch = (e: any) => {
//     const inputValue = e.target.value;
//     setSearchVal(inputValue);
//     setSearchLoading(true);
//     debounce(async () => {
//       //@ts-ignore
//       const response = await window.electron.searchProducts(inputValue);
//       setProducts(response);
//       setSearchLoading(false);
//     });
//   };
//   const navigate = useNavigate();
//   useEffect(() => {
//     //@ts-ignore
//     // window.electron.createUsersTable()
//     fetchAllProducts();
//   }, []);

//   const fetchAllProducts = async () => {
//     try {
//       //@ts-ignore
//       const result = await window.electron.getProducts();
//       setProducts(result);
//       setLoading(false);
//     } catch (error) {
//       setLoading(false);
//       toast.error("Something went wrong. Please restart the application", {
//         position: "top-center",
//       });
//     }
//   };

//   const [newQuantity, setNewQuantity] = useState<number | string>(1);
//   const [isSheetOpen, setIsSheetOpen] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState<any>(null);

//   const handleUpdateStock = async () => {
//     try {
//       //@ts-ignore
//       const response = await window.electron.updateProductStock({
//         //@ts-ignore
//         quantity: Number(newQuantity) + selectedProduct?.quantity,
//         //@ts-ignore
//         id: selectedProduct?.id,
//       });
//       fetchAllProducts();
//       setIsSheetOpen(false);
//       toast("Stock updated", { position: "top-center", className: "bg-red-300" });
//       setNewQuantity(1);
//     } catch (error) {
//       toast.error("Something went wrong. Please restart the application", {
//         position: "top-center",
//       });
//     }
//   };

//   if (loading) <h1>loading</h1>;
//   return (
//     <div className="bg-gray-100 min-h-screen w-full">
//       <div className="px-8 py-16">
//         <div className="flex justify-between items-start">
//           <h1 className="text-3xl font-medium mb-8 text-gray-700">Inventory</h1>
//           <SearchBar
//             handleSearch={handleSearch}
//             searchVal={searchVal}
//             searchLoading={searchLoading}
//             placeholder="Search products"
//           />
//         </div>
//         {/* <Table
//           data={products}
//           handleSheetToggle={(prdduct: any) => {
//             setSelectedProduct(prdduct);
//             setIsSheetOpen(true);
//           }}
//           // updateStockHandler={(product: any) => setSelectedProduct(product)}
//         /> */}

//         <ProductsTable
//           data={products}
//           onEdit={(id) => navigate(`/edit-product/${id}`)}
//           onRestock={(product) => {
//             setSelectedProduct(product);
//             setIsSheetOpen(true);
//           }}
//         />
//         <CustomSheet
//           title="Restock product"
//           isOpen={isSheetOpen}
//           handleSheetToggle={() => setIsSheetOpen(false)}
//           handleSubmit={handleUpdateStock}
//         >
//           <div className="grid flex-1 auto-rows-min gap-2 px-4">
//             <div className="grid gap-1">
//               <label htmlFor="name">Photo</label>
//               <div className="flex justify-center">
//                 {selectedProduct?.image && (
//                   <img
//                     src={`file://${selectedProduct?.image}`}
//                     alt="Product image"
//                     className="max-h-48"
//                   />
//                 )}
//               </div>
//             </div>
//             <div className="grid gap-1">
//               <label htmlFor="name">Name</label>
//               <input
//                 id="name"
//                 readOnly
//                 //@ts-ignore

//                 value={selectedProduct?.name}
//                 className="p-1.5 indent-2 text-sm border rounded-md focus:outline-amber-800"
//                 disabled
//               />
//             </div>

//             <div className="grid gap-1">
//               <label htmlFor="quantity">Quantity</label>
//               <input
//                 id="quantity"
//                 readOnly
//                 //@ts-ignore
//                 value={selectedProduct?.quantity}
//                 className="p-1.5 indent-2 text-sm border rounded-md focus:outline-amber-800"
//                 disabled
//               />
//             </div>
//             <div className="flex gap-2">
//               <div className="grid gap-1">
//                 <label htmlFor="quantity">SKU</label>
//                 <input
//                   id="quantity"
//                   readOnly
//                   //@ts-ignore

//                   value={selectedProduct?.sku}
//                   className="p-1.5 indent-2 text-sm border rounded-md focus:outline-amber-800"
//                   disabled
//                 />
//               </div>

//               <div className="grid gap-1">
//                 <label htmlFor="quantity">Part number</label>
//                 <input
//                   id="quantity"
//                   readOnly
//                   //@ts-ignore

//                   value={selectedProduct?.part_number}
//                   className="p-1.5 indent-2 text-sm border rounded-md focus:outline-amber-800"
//                   disabled
//                 />
//               </div>
//             </div>
//             <Separator orientation="horizontal" className="my-4 bg-gray-500" />
//             <div className="grid gap-1">
//               <label htmlFor="quantity">New stock quantity</label>
//               <input
//                 id="new-quantity"
//                 type="number"
//                 min={1}
//                 value={newQuantity}
//                 className="p-1.5 indent-2 text-sm border rounded-md"
//                 onChange={(e) => setNewQuantity(e.target.value)}
//               />
//             </div>
//           </div>
//         </CustomSheet>
//       </div>
//     </div>
//   );
// };

// export default Products;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useDebounce from "react-debounced";
import { Search, Package, Plus, TrendingUp, Loader2 } from "lucide-react";
import ProductsTable from "./components/Table";
import CustomSheet from "../../../components/CustomSheet";
import { Separator } from "../../../components/ui/separator";

interface Product {
  id: number;
  name: string;
  image?: string;
  quantity: number;
  sku: string;
  part_number: string;
  retail_price: number;
  cost_price: number;
}

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newQuantity, setNewQuantity] = useState<number | string>(1);

  const debounce = useDebounce(500);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      //@ts-ignore
      const result = await window.electron.getProducts();
      console.log(result)
      setProducts(result || []);
    } catch (error) {
      toast.error("Failed to load products. Please try again.", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearchVal(inputValue);

    if (!inputValue.trim()) {
      fetchAllProducts();
      return;
    }

    setSearchLoading(true);
    debounce(async () => {
      try {
        //@ts-ignore
        const response = await window.electron.searchProducts(inputValue);
        setProducts(response || []);
      } catch (error) {
        toast.error("Search failed. Please try again.");
      } finally {
        setSearchLoading(false);
      }
    });
  };

  // const handleSearch = (e: any) => {
  //   const inputValue = e.target.value;
  //   setSearchVal(inputValue);
  //   if (!inputValue.trim()) {
  //     console.log("!inputValue.trim(): ", !inputValue.trim());
  //     fetchAllProducts();
  //     return;
  //   }
  //   setSearchLoading(true);
  //   debounce(async () => {
  //     //@ts-ignore
  //     const response = await window.electron.searchProducts(inputValue);
  //     setProducts(response);
  //     setSearchLoading(false);
  //   });
  // };

  const handleUpdateStock = async () => {
    if (!selectedProduct) return;

    const addedQuantity = Number(newQuantity);
    if (addedQuantity <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    try {
      //@ts-ignore
      await window.electron.updateProductStock({
        quantity: addedQuantity + selectedProduct.quantity,
        id: selectedProduct.id,
      });

      toast.success(`Added ${addedQuantity} units to stock`, {
        position: "top-center",
      });
      fetchAllProducts();
      setIsSheetOpen(false);
      setNewQuantity(1);
      setSelectedProduct(null);
    } catch (error) {
      toast.error("Failed to update stock. Please try again.", {
        position: "top-center",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8 px-8 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                View and manage your product inventory and stock levels
              </p>
            </div>

            <button
              onClick={() => navigate("/add-product")}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-all shadow-sm hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              value={searchVal}
              placeholder="Search products..."
              onChange={handleSearch}
            />
            {searchLoading && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
            )}
          </div>
        </div>

        {/* Products Table */}
        <ProductsTable
          //@ts-ignore
          data={products}
          onEdit={(id) => navigate(`/edit-product/${id}`)}
          onRestock={(product) => {
            //@ts-ignore
            setSelectedProduct(product);
            setIsSheetOpen(true);
          }}
        />

        {/* Restock Sheet */}
        <CustomSheet
          title="Restock Product"
          isOpen={isSheetOpen}
          handleSheetToggle={() => {
            setIsSheetOpen(false);
            setNewQuantity(1);
            setSelectedProduct(null);
          }}
          handleSubmit={handleUpdateStock}
        >
          {selectedProduct && (
            <div className="space-y-5 px-4">
              {/* Product Image */}
              {selectedProduct.image && (
                <div className="flex justify-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <img
                    src={`file://${selectedProduct.image}`}
                    alt={selectedProduct.name}
                    className="max-h-48 rounded-lg object-contain"
                  />
                </div>
              )}

              {/* Product Info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Product Name</label>
                  <input
                    type="text"
                    value={selectedProduct.name}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900"
                    disabled
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">SKU</label>
                    <input
                      type="text"
                      value={selectedProduct.sku}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 font-mono"
                      disabled
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Part Number</label>
                    <input
                      type="text"
                      value={selectedProduct.part_number}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 font-mono"
                      disabled
                    />
                  </div>
                </div>

                {/* Current Stock */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-blue-700 uppercase tracking-wide mb-1">
                        Current Stock
                      </p>
                      <p className="text-2xl font-bold text-blue-900">{selectedProduct.quantity}</p>
                    </div>
                    <Package className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Add Stock */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="new-quantity"
                    className="text-sm font-medium text-gray-700 flex items-center gap-1.5"
                  >
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    Add Stock Quantity
                  </label>
                  <input
                    id="new-quantity"
                    type="number"
                    min={1}
                    value={newQuantity}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    onChange={(e) => setNewQuantity(e.target.value)}
                    placeholder="Enter quantity to add"
                  />
                </div>

                {/* Preview */}
                {Number(newQuantity) > 0 && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      <span className="font-medium">New total stock:</span>{" "}
                      {selectedProduct.quantity} + {Number(newQuantity)} ={" "}
                      <span className="font-bold">
                        {selectedProduct.quantity + Number(newQuantity)}
                      </span>{" "}
                      units
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CustomSheet>
      </div>
    </div>
  );
};

export default Products;
