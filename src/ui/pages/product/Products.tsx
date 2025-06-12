import { useEffect, useState } from "react";
import Table from "./components/Table";
import useDebounce from "react-debounced";
import SearchBar from "../../../components/SearchBar";
import CustomSheet from "../../../components/CustomSheet";
import { Separator } from "../../../components/ui/separator";
import { toast } from "sonner";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  const debounce = useDebounce(2000);
  const [searchVal, setSearchVal] = useState("");

  const handleSearch = (e: any) => {
    const inputValue = e.target.value;
    setSearchVal(inputValue);
    setSearchLoading(true);
    debounce(async () => {
      //@ts-ignore
      const response = await window.electron.searchProducts(inputValue);
      setProducts(response);
      setSearchLoading(false);
    });
  };

  useEffect(() => {
    //@ts-ignore
    // window.electron.createUsersTable()
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      //@ts-ignore
      const result = await window.electron.getProducts();
      setProducts(result);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const [newQuantity, setNewQuantity] = useState<number | string>(1);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const handleUpdateStock = async () => {
    try {
      //@ts-ignore
      const response = await window.electron.updateProductStock({
        //@ts-ignore
        quantity: Number(newQuantity) + selectedProduct?.quantity,
        //@ts-ignore
        id: selectedProduct?.id,
      });
      fetchAllProducts();
      setIsSheetOpen(false);
      toast("Stock updated", { position: "top-center", className: "bg-red-300" });
      setNewQuantity(1);
    } catch (error) {
      console.log();
    }
  };

  if (loading) <h1>loading</h1>;
  return (
    <div className="bg-gray-100 min-h-screen w-full">
      <div className="px-8 py-16">
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-medium mb-8 text-gray-700">Inventory</h1>
          <SearchBar
            handleSearch={handleSearch}
            searchVal={searchVal}
            searchLoading={searchLoading}
            placeholder="Search products"
          />
        </div>
        <Table
          data={products}
          handleSheetToggle={(prdduct: any) => {
            setSelectedProduct(prdduct);
            setIsSheetOpen(true);
          }}
          updateStockHandler={(product: any) => setSelectedProduct(product)}
        />
        <CustomSheet
          title="Restock product"
          isOpen={isSheetOpen}
          handleSheetToggle={() => setIsSheetOpen(false)}
          handleSubmit={handleUpdateStock}
        >
          <div className="grid flex-1 auto-rows-min gap-2 px-4">
            <div className="grid gap-1">
              <label htmlFor="name">Photo</label>
              <div className="flex justify-center">
                
                {selectedProduct?.image && (
                  <img
                    src={`file://${selectedProduct?.image}`}
                    alt="Product image"
                    className="max-h-48"
                  />
                )}
              </div>
            </div>
            <div className="grid gap-1">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                readOnly
                //@ts-ignore

                value={selectedProduct?.name}
                className="p-1.5 indent-2 text-sm border rounded-md focus:outline-amber-800"
                disabled
              />
            </div>

            <div className="grid gap-1">
              <label htmlFor="quantity">Quantity</label>
              <input
                id="quantity"
                readOnly
                //@ts-ignore
                value={selectedProduct?.quantity}
                className="p-1.5 indent-2 text-sm border rounded-md focus:outline-amber-800"
                disabled
              />
            </div>
            <div className="flex gap-2">
              <div className="grid gap-1">
                <label htmlFor="quantity">SKU</label>
                <input
                  id="quantity"
                  readOnly
                  //@ts-ignore

                  value={selectedProduct?.sku}
                  className="p-1.5 indent-2 text-sm border rounded-md focus:outline-amber-800"
                  disabled
                />
              </div>

              <div className="grid gap-1">
                <label htmlFor="quantity">Barcode</label>
                <input
                  id="quantity"
                  readOnly
                  //@ts-ignore

                  value={selectedProduct?.barcode}
                  className="p-1.5 indent-2 text-sm border rounded-md focus:outline-amber-800"
                  disabled
                />
              </div>
            </div>
            <Separator orientation="horizontal" className="my-4 bg-gray-500" />
            <div className="grid gap-1">
              <label htmlFor="quantity">New stock quantity</label>
              <input
                id="new-quantity"
                type="number"
                min={1}
                value={newQuantity}
                className="p-1.5 indent-2 text-sm border rounded-md"
                onChange={(e) => setNewQuantity(e.target.value)}
              />
            </div>
          </div>
        </CustomSheet>
      </div>
    </div>
  );
};

export default Products;
