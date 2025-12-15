import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Search, Plus, Loader2, X } from "lucide-react";
import CustomerTable from "./components/Table";
import AlertBox from "../../../components/AlertBox";

interface Customer {
  id: number;
  name: string;
  phone_number: string;
  email?: string;
  company_name?: string;
  company_phone_number?: string;
  address?: string;
}

const Customers = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  // Search states
  const [searchVal, setSearchVal] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCustomers, setTotalCustomers] = useState(0);

  // Delete Dialog
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    customerId: number | null;
  }>({
    open: false,
    customerId: null,
  });

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, rowsPerPage]);

  const fetchCustomers = async () => {
    try {
      const offset = (currentPage - 1) * rowsPerPage;
      //@ts-ignore
      const {response} = await window.electron.getAllCustomers({
        limit: rowsPerPage,
        offset,
      });
    
      setCustomers(response.data || []);
      setTotalCustomers(response.total || 0);
    } catch (error) {
      toast.error("Failed to load customers. Please try again.", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchVal.trim()) {
      toast.error("Please enter a phone number to search");
      return;
    }

    setSearchLoading(true);

    try {
      //@ts-ignore
      const { response } = await window.electron.searchCustomerByPhoneNumber(
        searchVal
      );

      setCustomers(response || []);
      setIsSearchActive(true);
      setTotalCustomers(response?.length || 0);
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
    fetchCustomers();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const deleteCustomer = async () => {
    if (!deleteDialog.customerId) return;

    try {
      //@ts-ignore
      await window.electron.deleteCustomerById(deleteDialog.customerId);
      toast.success("Customer deleted successfully", { position: "top-center" });
      fetchCustomers();
      setDeleteDialog({ open: false, customerId: null });
    } catch (error) {
      toast.error("Failed to delete customer. Please try again.", {
        position: "top-center",
      });
    }
  };

  const totalPages = Math.ceil(totalCustomers / rowsPerPage);

  // Pagination Buttons With Ellipsis
  const renderPageButtons = () => {
    const pages: (number | string)[] = [];
    const delta = 2;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (
        i === currentPage - delta - 1 ||
        i === currentPage + delta + 1
      ) {
        pages.push("...");
      }
    }

    return pages.map((page, idx) =>
      page === "..." ? (
        <span
          key={idx}
          className="w-8 h-8 flex items-center justify-center text-gray-400"
        >
          ...
        </span>
      ) : (
        <button
          key={idx}
          onClick={() => setCurrentPage(Number(page))}
          className={`w-8 h-8 flex items-center justify-center rounded-full transition ${
            currentPage === page
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          {page}
        </button>
      )
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Loading customers...</p>
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
              <h1 className="text-2xl font-semibold text-gray-900">
                Customers
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                View and manage all customer records
              </p>
            </div>

            <button
              onClick={() => navigate("/add-customer")}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-all shadow-sm hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              Add Customer
            </button>
          </div>

          {/* Search Bar */}
          <div className="space-y-2">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

              <input
                type="text"
                className="w-full pl-10 pr-24 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                value={searchVal}
                placeholder="Search by phone number..."
                onChange={(e) => setSearchVal(e.target.value)}
                onKeyPress={handleKeyPress}
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

        {/* Customers Table */}
        <CustomerTable
          data={customers}
          onView={(id) => navigate(`/customer-details/${id}`)}
          onEdit={(id) => navigate(`/edit-customer/${id}`)}
          onDelete={(id) =>
            setDeleteDialog({ open: true, customerId: id as number })
          }
        />

        {/* Pagination */}
        {totalCustomers > rowsPerPage && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
            <div className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-medium">
                {(currentPage - 1) * rowsPerPage + 1}
              </span>{" "}
              –{" "}
              <span className="font-medium">
                {Math.min(currentPage * rowsPerPage, totalCustomers)}
              </span>{" "}
              of <span className="font-medium">{totalCustomers}</span> customers
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  currentPage > 1 && setCurrentPage(currentPage - 1)
                }
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-lg bg-white shadow-sm border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                Prev
              </button>

              {renderPageButtons()}

              <button
                onClick={() =>
                  currentPage < totalPages && setCurrentPage(currentPage + 1)
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-lg bg-white shadow-sm border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>

              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-1 rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm"
              >
                {[5, 10, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n} / page
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertBox
          open={deleteDialog.open}
          setOpen={(value: any) =>
            setDeleteDialog((prev) =>
              typeof value === "function"
                ? value(prev)
                : { open: value, customerId: null }
            )
          }
          continueProcessHandler={deleteCustomer}
          text="Delete Customer"
          subtext="This action cannot be undone. All associated vehicles and services will also be permanently deleted."
        />
      </div>
    </div>
  );
};

export default Customers;
