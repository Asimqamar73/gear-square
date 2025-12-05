// import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useDebounce from "react-debounced";
import { Search, Package, Plus, TrendingUp, Loader2 } from "lucide-react";
import ProductsTable from "./components/Table";
import CustomSheet from "../../../components/CustomSheet";
import { Separator } from "../../../components/ui/separator";
import { useEffect, useState } from "react";

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

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);

  const debounce = useDebounce(500);

  useEffect(() => {
    fetchAllProducts(currentPage);
  }, [currentPage, rowsPerPage]);

  const fetchAllProducts = async (page = 1) => {
    setLoading(true);
    try {
      const offset = (page - 1) * rowsPerPage;
      //@ts-ignore
      const result = await window.electron.getProducts({ limit: rowsPerPage, offset });
      setProducts(result.data || []);
      setTotalProducts(result.total || 0);
    } catch (error) {
      toast.error("Failed to load products. Please try again.", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearchVal(inputValue);
    setCurrentPage(1);

    if (!inputValue.trim()) {
      fetchAllProducts(1);
      return;
    }

    setSearchLoading(true);
    debounce(async () => {
      try {
        const offset = (currentPage - 1) * rowsPerPage;
        //@ts-ignore
        const response = await window.electron.searchProducts(inputValue, { limit: rowsPerPage, offset });
        setProducts(response.data || []);
        setTotalProducts(response.total || 0);
      } catch (error) {
        toast.error("Search failed. Please try again.");
      } finally {
        setSearchLoading(false);
      }
    });
  };

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

      toast.success(`Added ${addedQuantity} units to stock`, { position: "top-center" });
      fetchAllProducts(currentPage);
      setIsSheetOpen(false);
      setNewQuantity(1);
      setSelectedProduct(null);
    } catch (error) {
      toast.error("Failed to update stock. Please try again.", { position: "top-center" });
    }
  };

  const totalPages = Math.ceil(totalProducts / rowsPerPage);

  // Render page buttons with ellipsis
  const renderPageButtons = () => {
    const pages: (number | string)[] = [];
    const delta = 2; // pages before/after current

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (
        i === currentPage - delta - 1 ||
        i === currentPage + delta + 1
      ) {
        pages.push("...");
      }
    }

    return pages.map((page, idx) => {
      if (page === "...") {
        return (
          <span key={idx} className="w-8 h-8 flex items-center justify-center text-gray-400 select-none">
            ...
          </span>
        );
      }

      return (
        <button
          key={idx}
          onClick={() => setCurrentPage(Number(page))}
          className={`w-8 h-8 flex items-center justify-center rounded-full transition ${
            currentPage === page
              ? "bg-blue-500 text-white shadow-md"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          {page}
        </button>
      );
    });
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

        {/* Pagination */}
        {totalProducts > rowsPerPage && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{(currentPage - 1) * rowsPerPage + 1}</span> –{" "}
              <span className="font-medium">{Math.min(currentPage * rowsPerPage, totalProducts)}</span> of{" "}
              <span className="font-medium">{totalProducts}</span> products
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-lg bg-white shadow-sm border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Prev
              </button>

              {renderPageButtons()}

              <button
                onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-lg bg-white shadow-sm border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>

              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-1 rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {[5, 10, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n} / page
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

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
              {selectedProduct.image && (
                <div className="flex justify-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <img
                    src={`file://${selectedProduct.image}`}
                    alt={selectedProduct.name}
                    className="max-h-48 rounded-lg object-contain"
                  />
                </div>
              )}

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

                {Number(newQuantity) > 0 && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      <span className="font-medium">New total stock:</span> {selectedProduct.quantity} +{" "}
                      {Number(newQuantity)} ={" "}
                      <span className="font-bold">{selectedProduct.quantity + Number(newQuantity)}</span> units
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
