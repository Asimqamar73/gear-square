import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
// import useDebounce from "react-debounced";
import { Search, Loader2, X } from "lucide-react";
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
  const [isSearchActive, setIsSearchActive] = useState(false);


  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchVal, setSearchVal] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalInvoices, setTotalInvoices] = useState(0);

  const totalPages = Math.ceil(totalInvoices / rowsPerPage);

  useEffect(() => {
    fetchInvoices();
  }, [currentPage, rowsPerPage]);

  const fetchInvoices = async () => {
    setLoading(true);

    try {
      //@ts-ignore
      const res = await window.electron.getInvoices({
        limit: rowsPerPage,
        offset: (currentPage - 1) * rowsPerPage,
        search: "",
      });
      if (res.success) {
        setInvoices(res?.response?.rows || []);
        setTotalInvoices(res?.response?.total || 0);
      } else {
        toast.error("Failed to load invoices.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Search handler
  // const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const val = e.target.value;
  //   setSearchVal(val);

  //   setSearchLoading(true);
  //   debounce(() => {
  //     setCurrentPage(1);
  //     fetchInvoices();
  //     setSearchLoading(false);
  //   });
  // };



   const handleSearch = async () => {
    if (!searchVal.trim()) {
      toast.error("Please enter a vehicle or chassis number to search");
      return;
    }

    setSearchLoading(true);

    try {
      //@ts-ignore
        const res = await window.electron.getInvoices({
        limit: rowsPerPage,
        offset: (currentPage - 1) * rowsPerPage,
        search: searchVal.trim() || "",
      });
       setInvoices(res?.response?.rows || []);
       setIsSearchActive(true);
        setTotalInvoices(res?.response?.total || 0);

      setCurrentPage(1);
    } catch (error) {
      toast.error("Search failed. Please try again.", {
        position: "top-center",
      });
    } finally {
      setSearchLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchVal("");
    setIsSearchActive(false);
    setCurrentPage(1);
    fetchInvoices();
  };

  // 🌟 Ellipsis Pagination Logic
  const renderPageButtons = () => {
    const pages: (number | string)[] = [];
    const delta = 2;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        pages.push(i);
      } else if (i === currentPage - delta - 1 || i === currentPage + delta + 1) {
        pages.push("...");
      }
    }

    return pages.map((p, idx) =>
      p === "..." ? (
        <span key={idx} className="w-8 h-8 flex items-center justify-center text-gray-400">
          ...
        </span>
      ) : (
        <button
          key={idx}
          onClick={() => setCurrentPage(Number(p))}
          className={`w-8 h-8 flex items-center justify-center rounded-full transition text-sm
          ${
            currentPage === p
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
          }`}
        >
          {p}
        </button>
      )
    );
  };

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
          <h1 className="text-2xl font-semibold text-gray-900">Invoices</h1>
          <p className="text-sm text-gray-500 mt-0.5">View and manage all invoices</p>

          {/* Search Bar */}
          {/* <div className="relative max-w-md mt-5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchVal}
              onChange={handleSearch}
              placeholder="Search invoices..."
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
            />
            {searchLoading && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-gray-400" />
            )}
          </div> */}
          <div className="space-y-2 mt-5">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

              <input
                type="text"
                className="w-full pl-10 pr-24 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                value={searchVal}
                placeholder="Search..."
                onChange={(e) => setSearchVal(e.target.value)}
                // onKeyPress={handleKeyPress}
              />

              {searchLoading ? (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
              ) : (
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-md transition-colors"
                >
                  Search
                </button>
              )}
            </div>

            {isSearchActive && (
              <button
                onClick={handleClearSearch}
                className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <X className="w-4 h-4" />
                Clear search
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <InvoiceTable data={invoices} onViewInvoice={(id) => navigate(`/invoice/${id}`)} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            {/* Left: rows per page */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 border border-gray-300 rounded-lg bg-white text-sm"
              >
                {[5, 10, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            {/* Center: pagination buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                Prev
              </button>

              {renderPageButtons()}

              <button
                onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Invoices;
