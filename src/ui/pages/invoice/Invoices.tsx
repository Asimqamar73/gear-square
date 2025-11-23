// import { useEffect, useState } from "react";
// import useDebounce from "react-debounced";
// import SearchBar from "../../../components/SearchBar";
// import PageHeader from "../../../components/PageHeader";
// import { toast } from "sonner";
// import {  useNavigate } from "react-router-dom";
// import InvoiceTable from "./components/Table";

// const paymentStatuses: any = {
//   0: { value: "Unpaid", color: "bg-red-200 text-red-800" },
//   1: { value: "Partial", color: "bg-amber-200 text-amber-800" },
//   2: { value: "Paid", color: "bg-green-200 text-green-800" },
//   3: { value: "Overpaid", color: "bg-green-400 text-white" },
// };

// const Invoices = () => {
//   const debounce = useDebounce(2000);
//   const navigate = useNavigate();
//   const [invoices, setInvoices] = useState<any>([]);
//   const [searchVal, setSearchVal] = useState("");
//   const [searchLoading, setSearchLoading] = useState(false);

//   useEffect(() => {
//     fetchInvoices();
//   }, []);

//   const fetchInvoices = async () => {
//     try {
//       //@ts-ignore
//       const { response } = await window.electron.getInvoices();
//       setInvoices(response);
//     } catch (error) {
//       toast.error("Something went wrong. Please restart the application", {
//         position: "top-center",
//       });
//     }
//   };

//   const handleSearch = (e: any) => {
//     const inputValue = e.target.value;
//     setSearchVal(inputValue);
//     setSearchLoading(true);
//     debounce(async () => {
//       //@ts-ignore
//       const response = await window.electron.searchInvoices(inputValue);
//       setInvoices(response);
//       setSearchLoading(false);
//     });
//   };
//   return (
//     <div className="min-h-screen bg-gray-100">
//       <div className="py-16 px-8">
//         <PageHeader title={"Recent Invoices"}>
//           <SearchBar
//             searchVal={searchVal}
//             searchLoading={searchLoading}
//             handleSearch={handleSearch}
//             placeholder="Search invoice"
//           />
//         </PageHeader>
//         <InvoiceTable data={invoices} onViewInvoice={(id)=>navigate(`/invoice/${id}`)}/>
//       </div>
//     </div>
//   );
// };

// export default Invoices;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useDebounce from "react-debounced";
import { Search, Loader2 } from "lucide-react";
import InvoiceTable from "./components/Table";

interface Invoice {
  invoice_id: number;
  vehicle_id: number;
  vehicle_number: string;
  chassis_number: string;
  name: string;
  phone_number: string;
  company_name?: string;
  company_phone_number?: string;
  created_at: string;
  bill_status: 0 | 1 | 2 | 3;
  customer_id: number;
}

const Invoices = () => {
  const navigate = useNavigate();
  const debounce = useDebounce(500);

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchVal, setSearchVal] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      //@ts-ignore
      const { response } = await window.electron.getInvoices();
      setInvoices(response || []);
    } catch (error) {
      toast.error("Failed to load invoices. Please try again.", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearchVal(inputValue);

    if (!inputValue.trim()) {
      fetchInvoices();
      return;
    }

    setSearchLoading(true);
    debounce(async () => {
      try {
        //@ts-ignore
        const response = await window.electron.searchInvoices(inputValue);
        setInvoices(response || []);
      } catch (error) {
        toast.error("Search failed. Please try again.");
      } finally {
        setSearchLoading(false);
      }
    });
  };

  // const getStatusCounts = () => {
  //   return {
  //     total: invoices.length,
  //     unpaid: invoices.filter((inv) => inv.bill_status === 0).length,
  //     partial: invoices.filter((inv) => inv.bill_status === 1).length,
  //     paid: invoices.filter((inv) => inv.bill_status === 2).length,
  //   };
  // };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Loading invoices...</p>
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
              <h1 className="text-2xl font-semibold text-gray-900">Invoices</h1>
              <p className="text-sm text-gray-500 mt-0.5">View and manage all invoices</p>
            </div>
          </div>

          {/* Stats Cards */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Total Invoices
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-red-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-red-600 uppercase tracking-wide mb-1">
                    Unpaid
                  </p>
                  <p className="text-2xl font-semibold text-red-700">{stats.unpaid}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                  <Receipt className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-amber-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-amber-600 uppercase tracking-wide mb-1">
                    Partial Payment
                  </p>
                  <p className="text-2xl font-semibold text-amber-700">{stats.partial}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Receipt className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-green-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">
                    Paid in Full
                  </p>
                  <p className="text-2xl font-semibold text-green-700">{stats.paid}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <Receipt className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div> */}

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              value={searchVal}
              placeholder="Search invoices..."
              onChange={handleSearch}
            />
            {searchLoading && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
            )}
          </div>
        </div>

        {/* Invoices Table */}
        <InvoiceTable
          data={invoices}
          onViewInvoice={(id) => navigate(`/invoice/${id}`)}
          // onViewVehicle={(id) => navigate(`/vehicle-details/${id}`)}
          // dateFormatter={dateFormatter}
        />
      </div>
    </div>
  );
};

export default Invoices;
