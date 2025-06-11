import { useEffect, useState } from "react";
import PageHeader from "../../../components/PageHeader";
import Table from "./components/Table";
import SearchBar from "../../../components/SearchBar";
import useDebounce from "react-debounced";

const Customers = () => {
  const debounce = useDebounce(2000);
  const [customers, setCustomers] = useState([]);
  const [searchVal, setSearchVal] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

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
  const handleSearch = (e: any) => {
    const inputValue = e.target.value;
    setSearchVal(inputValue);
    setSearchLoading(true);
    debounce(async () => {
      //@ts-ignore
      const response = await window.electron.searchCustomerByPhoneNumber(inputValue);
      setCustomers(response);
      setSearchLoading(false);
    });
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-16 px-8">
        <PageHeader title="Customers">
          <SearchBar
            searchVal={searchVal}
            searchLoading={searchLoading}
            handleSearch={handleSearch}
            placeholder="Search customer..."
          />{" "}
        </PageHeader>
        <Table data={customers} />
      </div>
    </div>
  );
};

export default Customers;
