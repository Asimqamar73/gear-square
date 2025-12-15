import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { 
  Package, 
  DollarSign, 
  Barcode, 
  ArrowLeft, 
  Save, 
  FileText,
  Image as ImageIcon
} from "lucide-react";
import ProductMediaBox from "./components/ProductMediaBox";

interface ProductData {
  productImage: File | null;
  name: string;
  description: string;
  costPrice: string;
  retailPrice: string;
  sku: string;
  partNumber: string;
  quantity: string;
}

const AddProduct = () => {
  const navigate = useNavigate();
  const productInitialState: ProductData = {
    productImage: null,
    name: "",
    description: "",
    costPrice: "",
    retailPrice: "",
    sku: "",
    partNumber: "",
    quantity: "",
  };

  const [product, setProduct] = useState<ProductData>(productInitialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = event.target;
    setProduct((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setProduct((prev) => ({
        ...prev,
        productImage: event.target.files![0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      //@ts-ignore
      const user = JSON.parse(localStorage.getItem("gear-square-user"));
      
      const productData = {
        ...product,
        createdBy: user.id,
        updatedBy: user.id,
        productImage: product.productImage
          ? {
              buffer: await product.productImage.arrayBuffer(),
              imageName: product.productImage.name,
            }
          : null,
      };

      //@ts-ignore
      const response = await window.electron.addProduct(productData);
      
      if (response.success) {
        toast.success("Product added successfully", { position: "top-center" });
        setProduct(productInitialState);
        // Optionally navigate to products list
        // navigate("/products");
      } else {
        const errorMessage = response.error?.message || "Failed to add product";
        toast.error(errorMessage, { position: "top-center" });
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product. Please try again.", {
        position: "top-center",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateMargin = () => {
    const cost = parseFloat(product.costPrice);
    const retail = parseFloat(product.retailPrice);
    if (cost && retail && retail > 0) {
      return (((retail - cost) / retail) * 100).toFixed(1);
    }
    return "0";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8 px-8 max-w-[1400px] mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-white hover:shadow-sm flex items-center justify-center transition-all"
            >
              <ArrowLeft className="w-4 h-4 text-gray-700" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Add New Product</h1>
              <p className="text-sm text-gray-500 mt-0.5">Create a new inventory item</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
          
          {/* Main Form Sections */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* General Information */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-gray-600" />
                  <h2 className="text-base font-semibold text-gray-900">Product Information</h2>
                </div>
              </div>
              
              <div className="p-6 space-y-5">
                {/* Product Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-gray-400" />
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                    onChange={handleInputChange}
                    value={product.name}
                    placeholder="Enter product name"
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-gray-400" />
                    Description
                  </label>
                  <textarea
                    id="description"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all resize-none"
                    rows={4}
                    onChange={handleInputChange}
                    value={product.description}
                    placeholder="Enter product description (optional)"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-gray-600" />
                    <h2 className="text-base font-semibold text-gray-900">Pricing</h2>
                  </div>
                  {product.costPrice && product.retailPrice && (
                    <span className="text-xs font-medium text-gray-500 px-2.5 py-1 bg-gray-100 rounded-full">
                      Margin: {calculateMargin()}%
                    </span>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid sm:grid-cols-2 gap-5">
                  {/* Cost Price */}
                  <div className="space-y-2">
                    <label htmlFor="costPrice" className="text-sm font-medium text-gray-700">
                      Cost Price (AED)
                    </label>
                    <input
                      type="number"
                      id="costPrice"
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                      onChange={handleInputChange}
                      value={product.costPrice}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  {/* Retail Price */}
                  <div className="space-y-2">
                    <label htmlFor="retailPrice" className="text-sm font-medium text-gray-700">
                      Retail Price (AED)
                    </label>
                    <input
                      type="number"
                      id="retailPrice"
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                      onChange={handleInputChange}
                      value={product.retailPrice}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Barcode className="w-5 h-5 text-gray-600" />
                  <h2 className="text-base font-semibold text-gray-900">Inventory & Identification</h2>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid sm:grid-cols-3 gap-5">
                  {/* SKU */}
                  <div className="space-y-2">
                    <label htmlFor="sku" className="text-sm font-medium text-gray-700">
                      SKU
                    </label>
                    <input
                      type="text"
                      id="sku"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                      onChange={handleInputChange}
                      value={product.sku}
                      placeholder="SKU123"
                      required
                    />
                  </div>

                  {/* Part Number */}
                  <div className="space-y-2">
                    <label htmlFor="partNumber" className="text-sm font-medium text-gray-700">
                      Part Number
                    </label>
                    <input
                      type="text"
                      id="partNumber"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                      onChange={handleInputChange}
                      value={product.partNumber}
                      placeholder="PN-001"
                      required
                    />
                  </div>

                  {/* Quantity */}
                  <div className="space-y-2">
                    <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                      Initial Stock
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      min="0"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                      onChange={handleInputChange}
                      value={product.quantity}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Image Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm sticky top-8">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-gray-600" />
                  <h2 className="text-base font-semibold text-gray-900">Product Image</h2>
                </div>
                <p className="text-xs text-gray-500 mt-1">Upload a product photo</p>
              </div>
              
              <div className="p-6">
                <ProductMediaBox
                  onMutate={handleImageChange}
                  image={product.productImage}
                  newImage={product.productImage}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons - Full Width */}
          <div className="lg:col-span-3 flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-medium rounded-lg transition-all shadow-sm hover:shadow-md disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;