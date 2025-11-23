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
  const [searchVal, setSearchVal] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ 
    open: boolean; 
    customerId: number | null 
  }>({
    open: false,
    customerId: null,
  });

  useEffect(() => {
    fetchAllCustomers();
  }, []);

  const fetchAllCustomers = async () => {
    try {
      //@ts-ignore
      const { response } = await window.electron.getAllCustomers();
      setCustomers(response || []);
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
      const { response } = await window.electron.searchCustomerByPhoneNumber(searchVal);
      setCustomers(response || []);
      setIsSearchActive(true);
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
    fetchAllCustomers();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const deleteCustomer = async () => {
    if (!deleteDialog.customerId) return;

    try {
      //@ts-ignore
      await window.electron.deleteCustomerById(deleteDialog.customerId);
      toast.success("Customer deleted successfully", { position: "top-center" });
      fetchAllCustomers();
      setDeleteDialog({ open: false, customerId: null });
    } catch (error) {
      toast.error("Failed to delete customer. Please try again.", {
        position: "top-center",
      });
    }
  };

  // const getStatistics = () => {
  //   return {
  //     total: customers.length,
  //     withCompany: customers.filter(c => c.company_name).length,
  //     individual: customers.filter(c => !c.company_name).length,
  //   };
  // };

  // const stats = getStatistics();

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
              <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
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

          {/* Stats Cards */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Total Customers
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-blue-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">
                    Companies
                  </p>
                  <p className="text-2xl font-semibold text-blue-700">{stats.withCompany}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Individual
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.individual}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </div>
          </div> */}

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
                className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                <X className="w-4 h-4" />
                Clear search results
              </button>
            )}
          </div>
        </div>

        {/* Customers Table */}
        <CustomerTable
          data={customers}
          onView={(id) => navigate(`/customer-details/${id}`)}
          onEdit={(id) => navigate(`/edit-customer/${id}`)}
          onDelete={(id) => setDeleteDialog({ open: true, customerId: id as number })}
        />

        {/* Delete Confirmation Dialog */}
        <AlertBox
          open={deleteDialog.open}
          setOpen={(value:any) => setDeleteDialog(prev => 
            typeof value === 'function' ? value(prev) : { open: value, customerId: null }
          )}
          continueProcessHandler={deleteCustomer}
          text="Delete Customer"
          subtext="This action cannot be undone. All associated vehicles and services will also be permanently deleted."
        />
      </div>
    </div>
  );
};

export default Customers;