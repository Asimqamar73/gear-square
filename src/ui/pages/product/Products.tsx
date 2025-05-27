import { useEffect, useState } from "react";
import Table from "./components/Table";
import useDebounce from "react-debounced";
import { Search } from "lucide-react";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  const debounce = useDebounce(2000);
  const [searchVal, setSearchVal] = useState("");

  const handleChange = (e: any) => {
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

  if (loading) <h1>loading</h1>;
  return (
    <div className="bg-gray-100 min-h-screen w-full">
      <div className="px-8 py-16">
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-medium mb-8 text-gray-700">Products</h1>
          <div className="relative">
            <Search className="size-5 text-gray-500 absolute top-1.5 left-1" />
            {searchLoading && (
              <svg
                className="mr-3 size-4 animate-spin text-gray-500 rounded-4xl border-r-2 absolute right-0 top-2 "
                viewBox="0 0 16 16"
              ></svg>
            )}

            <input
              type="text"
              className="w-fit rounded-3xl border outline-0 p-1 indent-6"
              value={searchVal}
              placeholder="Search product"
              
              onChange={handleChange}
            />
          </div>
        </div>
        <Table data={products} />
      </div>
    </div>
  );
};

export default Products;
