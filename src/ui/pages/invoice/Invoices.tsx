import { useEffect, useState } from "react";
import Table from "./components/Table";
import useDebounce from "react-debounced";
import { Search } from "lucide-react";

const Invoices = () => {
  const debounce = useDebounce(2000);
  const [invoices, setInvoices] = useState([]);
  const [searchVal, setSearchVal] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      //@ts-ignore
      const { response } = await window.electron.getInvoices();
      setInvoices(response);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e: any) => {
    const inputValue = e.target.value;
    setSearchVal(inputValue);
    setSearchLoading(true);
    debounce(async () => {
      //@ts-ignore
      const response = await window.electron.searchInvoices(inputValue);
      setInvoices(response);
      setSearchLoading(false);
    });
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-16 px-8">
        <div className="flex flex-col gap-2 mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-medium text-gray-700 mb-8">Invoices</h1>
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
                placeholder="Search invoice"
                onChange={handleChange}
              />
            </div>
          </div>
          <Table data={invoices} />
        </div>
      </div>
    </div>
  );
};

export default Invoices;
