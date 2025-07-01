import { useEffect, useState } from "react";
import Table from "./components/Table";
import useDebounce from "react-debounced";
import SearchBar from "../../../components/SearchBar";
import PageHeader from "../../../components/PageHeader";
import { toast } from "sonner";

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
    } catch (error) {
      toast.error("Something went wrong. Please restart the application", {
        position: "top-center",
      });
    }
  };

  const handleSearch = (e: any) => {
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
        <PageHeader title={"Invoices"}>
          <SearchBar
            searchVal={searchVal}
            searchLoading={searchLoading}
            handleSearch={handleSearch}
            placeholder="Search invoice"
          />
        </PageHeader>
        <Table data={invoices} />
      </div>
    </div>
  );
};

export default Invoices;
