import { useEffect, useState } from "react";
import ProductMediaBox from "./components/ProductMediaBox";
import { useParams } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { toast } from "sonner";

const EditProduct = () => {
  const params = useParams();
  const productInitialState = {
    productImage: null,
    name: "",
    description: "",
    cost_price: "",
    retail_price: "",
    sku: "",
    part_number: "",
    quantity: "",
    image: "",
  };
  const [product, setProduct] = useState(productInitialState);
  //@ts-ignore
  const data = JSON.parse(localStorage.getItem("gear-square-user"));

  const [message, setMessage] = useState("");
  useEffect(() => {
    fetchProductDetails();
  }, []);

  const fetchProductDetails = async () => {
    try {
      //@ts-ignore
      const response = await window.electron.getProductById(params.productId);
      setProduct(response);
    } catch (error) {
      toast.error("Something went wrong. Please restart the application", {
        position: "top-center",
      });
    }
  };

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
    try {
      //@ts-ignore
      const resp = await window.electron.updateProductDetails({
        ...product,
        updatedBy: data.id,
        productImage: product.productImage
          ? {
              //@ts-ignore
              buffer: await product.productImage.arrayBuffer(),
              //@ts-ignore
              imageName: product.productImage.name,
            }
          : null,
      });
      if (resp.success) {
        setMessage("Product added successfully");
        setProduct(productInitialState);
      }
      setTimeout(() => {
        setMessage("");
      }, 4000);
    } catch (error) {
      toast.error("Something went wrong. Please restart the application", {
        position: "top-center",
      });
    }
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-16 px-8">
        <div className="flex flex-col gap-2 mb-8 text-gray-700">
          <h1 className="text-3xl font-medium">Edit product</h1>
          <p>Update product details</p>
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
                  required
                  value={product.description}
                ></textarea>
              </div>
            </div>
            <div className="p-4 bg-white rounded-2xl flex flex-col gap-4 border  border-gray-300 shadow">
              <h2 className="text-xl mt-2">Pricing</h2>
              <div className="flex flex-wrap gap-2">
                <div className="flex flex-col gap-1 grow">
                  <label htmlFor="cost_price" className="text-sm text-gray-500">
                    Cost price
                  </label>
                  <input
                    type="number"
                    name="cost_price"
                    id="cost_price"
                    className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
                    onChange={onMutate}
                    required
                    value={product.cost_price}
                    placeholder="115"
                  />
                </div>
                <div className="flex flex-col gap-1 grow">
                  <label htmlFor="retail_price" className="text-sm text-gray-500">
                    Retail price
                  </label>
                  <input
                    type="number"
                    name="retail_price"
                    id="retail_price"
                    className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
                    onChange={onMutate}
                    required
                    value={product.retail_price}
                    placeholder="135"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl flex flex-col gap-4 border  border-gray-300 shadow">
              <h2 className="text-xl mt-2">Inventory</h2>
              <div className="flex flex-wrap gap-2">
                <div className="flex flex-col gap-1 grow">
                  <label htmlFor="sku" className="text-sm text-gray-500">
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
                  <label htmlFor="part_number" className="text-sm text-gray-500">
                    Part number
                  </label>
                  <input
                    type="text"
                    name="part_number"
                    id="part_number"
                    placeholder="3356783367"
                    className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
                    onChange={onMutate}
                    required
                    value={product.part_number}
                  />
                </div>
                <div className="flex flex-col gap-1 grow">
                  <label htmlFor="quantity" className="text-sm text-gray-500">
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
            {/* <button type="submit" className=" p-2 rounded-sm text-white font-bold">
              Update
            </button> */}
            <Button type="submit" className="bg-[#173468] text-white" variant={"outline"}>
              Update
            </Button>
          </div>
          <div className="col-span-2">
            <ProductMediaBox
              onMutate={onMutate}
              image={product?.image}
              newImage={product.productImage}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
