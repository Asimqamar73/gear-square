import { useEffect, useState } from "react";
import PageHeader from "../../../components/PageHeader";
import Table from "./components/Table";
import { MoveRight, Search } from "lucide-react";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchVal, setSearchVal] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [isSearchDone, setIsSearchDone] = useState(false);

  useEffect(() => {
    fetchAllCustomers();
  }, []);

  const fetchAllCustomers = async () => {
    try {
      //@ts-ignore
      const { response } = await window.electron.getAllCustomers();
      console.log(response);
      setCustomers(response);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSearchChange = (e: any) => {
    const inputValue = e.target.value;
    setSearchVal(inputValue);
  };
  const handleSearch = async () => {
    try {
      //@ts-ignore
      const { response } = await window.electron.searchCustomerByPhoneNumber(searchVal);
      setCustomers(response);
      console.log(response);
      setSearchLoading(false);
      setIsSearchDone(true);
    } catch (error) {
      console.log(error);
      setIsSearchDone(true);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-16 px-8">
        <PageHeader title="Customers">
          {/* <SearchBar
            searchVal={searchVal}
            searchLoading={searchLoading}
            handleSearch={handleSearch}
            placeholder="Search customer..."
          />{" "} */}

          <div className="relative w-[25%]">
            <Search className="size-6 text-gray-500 absolute top-1.5 left-1" />
            {searchLoading && (
              <svg
                className="mr-3 size-7 animate-spin text-gray-500 rounded-4xl border-r-2 absolute right-0 top-1.5"
                viewBox="0 0 16 16"
              ></svg>
            )}
            <button
              className=" absolute rounded-3xl right-1 bg-[#173468] p-1 top-0.5 cursor-pointer hover:bg-blue-500"
              onClick={handleSearch}
            >
              <MoveRight className="text-gray-300" />
            </button>
            <input
              type="text"
              className="rounded-3xl border outline-0 p-1.5 border-gray-500 indent-6 w-full bg-teal-50/30"
              value={searchVal}
              placeholder={"Search customer by phone..."}
              onChange={handleSearchChange}
            />
            {isSearchDone && (
              <p
                className="text-sm text-right mr-2 cursor-pointer text-gray-700 font-semibold"
                onClick={() => {
                  setIsSearchDone(false);
                  setSearchVal("");
                  fetchAllCustomers();
                }}
              >
                clear
              </p>
            )}
          </div>
        </PageHeader>
        <Table data={customers} />
      </div>
    </div>
  );
};

export default Customers;
