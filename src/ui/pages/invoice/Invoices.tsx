import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Search, Loader2, X } from "lucide-react";
import InvoiceTable from "./components/Table";

interface Invoice {
  invoice_id: string | number;
  vehicle_id: string | number;
  vehicle_number: string;
  chassis_number: string;
  name: string;
  phone_number: string;
  company_name?: string;
  company_phone_number?: string;
  created_at: string;
  bill_status: 0 | 1 | 2 | 3;
  total: number;
  amount_paid: number;
  amount_due: number;
}

type TabType = "all" | "paid" | "partial" | "unpaid";

const TAB_STATUS_MAP: Record<TabType, number | null> = {
  all: null,
  unpaid: 0,
  partial: 1,
  paid: 2,
};

const TAB_LABELS: Record<TabType, string> = {
  all: "All",
  paid: "Paid",
  partial: "Partial Paid",
  unpaid: "Unpaid",
};

const Invoices = () => {
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  const [activeTab, setActiveTab] = useState<TabType>("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalInvoices, setTotalInvoices] = useState(0);

  const totalPages = Math.ceil(totalInvoices / rowsPerPage);

  useEffect(() => {
    fetchInvoices();
  }, [currentPage, rowsPerPage, activeTab]);

  const fetchInvoices = async (search = "") => {
    setLoading(true);
    try {
      //@ts-ignore
      const res = await window.electron.getInvoices({
        limit: rowsPerPage,
        offset: (currentPage - 1) * rowsPerPage,
        search,
        bill_status: TAB_STATUS_MAP[activeTab],
      });

      if (res?.success) {
        setInvoices(res.response?.rows || []);
        setTotalInvoices(res.response?.total || 0);
      } else {
        toast.error("Failed to load invoices.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchVal.trim()) {
      toast.error("Please enter a vehicle or chassis number");
      return;
    }

    setSearchLoading(true);
    setCurrentPage(1);
    setIsSearchActive(true);

    try {
      await fetchInvoices(searchVal.trim());
    } catch {
      toast.error("Search failed.");
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

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchVal("");
    setIsSearchActive(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8 px-8 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Invoices</h1>
          <p className="text-sm text-gray-500">View and manage all invoices</p>
          {/* Search */}
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

        {/* Badge-style Tabs */}
        <div className="flex gap-2 mt-4 flex-wrap my-4">
          {(Object.keys(TAB_LABELS) as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-1 text-sm font-medium rounded-full transition
                  ${
                    activeTab === tab
                      ? "bg-blue-600 text-white shadow"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>

        {/* Table */}
        <InvoiceTable data={invoices} onViewInvoice={(id) => navigate(`/invoice/${id}`)} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 border rounded-lg text-sm"
              >
                {[5, 10, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border rounded-lg text-sm"
              >
                Prev
              </button>

              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 border rounded-lg text-sm"
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
