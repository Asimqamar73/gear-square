import { useState } from "react";
import ProductMediaBox from "./components/ProductMediaBox";

const AddProduct = () => {
  const productInitialState = {
    productImage: null,
    name: "",
    description: "",
    costPrice: "",
    retailPrice: "",
    sku: "",
    barcode: "",
    quantity: "",
  };
  const [product, setProduct] = useState(productInitialState);
  //@ts-ignore
  const data = JSON.parse(localStorage.getItem("gear-square-user"));

  const [message, setMessage] = useState("");

  const onMutate = (event: any) => {
    if (event.target.files) {
      setProduct((prevState) => ({
        ...prevState,
        productImage: event.target.files[0],
      }));
    }
    if (!event.target.files) {
      setProduct((prevState) => ({
        ...prevState,
        [event.target.id]: event.target.value,
      }));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log(product);
    try {
      //@ts-ignore
      const resp = await window.electron.addProduct({
        ...product,
        createdBy: data.id,
        updatedBy: data.id,
        productImage: product.productImage ?  {
          //@ts-ignore
          buffer: await product.productImage.arrayBuffer(),
          //@ts-ignore
          imageName: product.productImage.name,
        } : null,
      });
      if (resp.success) {
        setMessage("Product added successfully");
        setProduct(productInitialState);
      }
      setTimeout(() => {
        setMessage("");
      }, 4000);
    } catch (error) {
      console.log(error)
    }
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-16 px-8">
        <div className="flex flex-col gap-2 mb-8 text-gray-700">
          <h1 className="text-3xl font-medium">Add new product</h1>
          <p>Please provide all below information about the product to add in the list.</p>
          {message ? (
            <p className="text-green-500 font-bold p-2 rounded-lg border w-68 bg-green-200">
              {message}
            </p>
          ) : (
            ""
          )}
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-5 gap-4">
          <div className="col-span-3 flex flex-col gap-4">
            <div className="p-4 bg-white rounded-2xl flex flex-col gap-4 border  border-gray-300 shadow">
              <h2 className="text-xl mt-2">General information</h2>
              <div className="flex flex-col gap-1">
                <label htmlFor="name" className="text-sm text-gray-500">
                  Name
                </label>
                <input
                  type="text"
                  name=""
                  id="name"
                  className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
                  onChange={onMutate}
                  value={product.name}
                  required
                />
              </div>
              <div className="flex flex-col gap-1 border-gray-200">
                <label htmlFor="description" className="text-sm text-gray-500">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
                  rows={5}
                  onChange={onMutate}
                  value={product.description}
                ></textarea>
              </div>
            </div>
            <div className="p-4 bg-white rounded-2xl flex flex-col gap-4 border  border-gray-300 shadow">
              <h2 className="text-xl mt-2">Pricing</h2>
              <div className="flex flex-wrap gap-2">
                <div className="flex flex-col gap-1 grow">
                  <label htmlFor="price" className="text-sm text-gray-500">
                    Cost price
                  </label>
                  <input
                    type="number"
                    name="costPrice"
                    id="costPrice"
                    className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
                    onChange={onMutate}
                    required
                    value={product.costPrice}
                    placeholder="115"
                  />
                </div>
                <div className="flex flex-col gap-1 grow">
                  <label htmlFor="price" className="text-sm text-gray-500">
                    Retail price
                  </label>
                  <input
                    type="number"
                    name="retailPrice"
                    id="retailPrice"
                    className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
                    onChange={onMutate}
                    required
                    value={product.retailPrice}
                    placeholder="135"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl flex flex-col gap-4 border  border-gray-300 shadow">
              <h2 className="text-xl mt-2">Inventory</h2>
              <div className="flex flex-wrap gap-2">
                <div className="flex flex-col gap-1 grow">
                  <label htmlFor="price" className="text-sm text-gray-500">
                    SKU
                  </label>
                  <input
                    type="number"
                    name="sku"
                    id="sku"
                    placeholder="453783"
                    className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
                    onChange={onMutate}
                    required
                    value={product.sku}
                  />
                </div>
                <div className="flex flex-col gap-1 grow">
                  <label htmlFor="price" className="text-sm text-gray-500">
                    Barcode
                  </label>
                  <input
                    type="number"
                    name="barcode"
                    id="barcode"
                    placeholder="3356783367"
                    className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
                    onChange={onMutate}
                    required
                    value={product.barcode}
                  />
                </div>
                <div className="flex flex-col gap-1 grow">
                  <label htmlFor="price" className="text-sm text-gray-500">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    id="quantity"
                    placeholder="190"
                    className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
                    onChange={onMutate}
                    required
                    value={product.quantity}
                  />
                </div>
              </div>
            </div>
            <button type="submit" className="bg-[#173468] p-2 rounded-sm text-white font-bold">
              Add
            </button>
          </div>
          <div className="col-span-2">
            <ProductMediaBox onMutate={onMutate} image={product.productImage} newImage={product.productImage}/>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
