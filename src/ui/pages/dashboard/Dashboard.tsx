import { useEffect, useState } from "react";
import { toast } from "sonner";
import { 
  TrendingUp, 
  AlertCircle, 
  Calendar,
  Loader2,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Wrench,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import DatePicker from "../../../components/DatePicker";

interface DashboardStats {
  profit: number;
  servicesCount: number;
  dueAmount: number;
}

interface PeriodStats {
  today: DashboardStats;
  last7Days: DashboardStats;
  last30Days: DashboardStats;
  last365Days: DashboardStats;
  custom: DashboardStats;
}

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<PeriodStats>({
    today: { profit: 0, servicesCount: 0, dueAmount: 0 },
    last7Days: { profit: 0, servicesCount: 0, dueAmount: 0 },
    last30Days: { profit: 0, servicesCount: 0, dueAmount: 0 },
    last365Days: { profit: 0, servicesCount: 0, dueAmount: 0 },
    custom: { profit: 0, servicesCount: 0, dueAmount: 0 },
  });

  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  useEffect(() => {
    fetchAllStats();
  }, []);

  const fetchAllStats = async () => {
    try {
      const [
        dailyProfit,
        dailyServices,
        dailyDue,
        week7Profit,
        week7Services,
        week7Due,
        month30Profit,
        month30Services,
        month30Due,
        year365Profit,
        year365Services,
        year365Due,
      ] = await Promise.allSettled([
        //@ts-ignore
        window.electron.getDailyProfit(),
        //@ts-ignore
        window.electron.getDailyServicesCount(),
        //@ts-ignore
        window.electron.getDailyDueAmount(),
        //@ts-ignore
        window.electron.last7DaysProfit(),
        //@ts-ignore
        window.electron.last7DaysServicesCount(),
        //@ts-ignore
        window.electron.getLast7DaysDueAmount(),
        //@ts-ignore
        window.electron.last30DaysProfit(),
        //@ts-ignore
        window.electron.last30DaysServicesCount(),
        //@ts-ignore
        window.electron.getLast30DaysDueAmount(),
        //@ts-ignore
        window.electron.last365DaysProfit(),
        //@ts-ignore
        window.electron.last365DaysServicesCount(),
        //@ts-ignore
        window.electron.getLast365DaysDueAmount(),
      ]);

      setStats({
        today: {
          profit: dailyProfit.status === 'fulfilled' ? dailyProfit.value?.response?.total_profit || 0 : 0,
          servicesCount: dailyServices.status === 'fulfilled' ? dailyServices.value?.totalServicesCount?.services_count || 0 : 0,
          dueAmount: dailyDue.status === 'fulfilled' ? dailyDue.value?.totalDueAmount || 0 : 0,
        },
        last7Days: {
          profit: week7Profit.status === 'fulfilled' ? week7Profit.value?.response?.total_profit || 0 : 0,
          servicesCount: week7Services.status === 'fulfilled' ? week7Services.value?.totalServicesCount?.services_count || 0 : 0,
          dueAmount: week7Due.status === 'fulfilled' ? week7Due.value?.totalDueAmount || 0 : 0,
        },
        last30Days: {
          profit: month30Profit.status === 'fulfilled' ? month30Profit.value?.response?.total_profit || 0 : 0,
          servicesCount: month30Services.status === 'fulfilled' ? month30Services.value?.totalServicesCount?.services_count || 0 : 0,
          dueAmount: month30Due.status === 'fulfilled' ? month30Due.value?.totalDueAmount || 0 : 0,
        },
        last365Days: {
          profit: year365Profit.status === 'fulfilled' ? year365Profit.value?.response?.total_profit || 0 : 0,
          servicesCount: year365Services.status === 'fulfilled' ? year365Services.value?.totalServicesCount?.services_count || 0 : 0,
          dueAmount: year365Due.status === 'fulfilled' ? year365Due.value?.totalDueAmount || 0 : 0,
        },
        custom: { profit: 0, servicesCount: 0, dueAmount: 0 },
      });
    } catch (error) {
      toast.error("Failed to load dashboard data. Please try again.", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCustomStats = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates");
      return;
    }
    try {
      //@ts-ignore
      const { response } = await window.electron.timelineSummary({ 
        startDate: startDate.toLocaleDateString(), 
        endDate: endDate.toLocaleDateString() 
      });
      
      setStats(prev => ({
        ...prev,
        custom: {
          profit: response.total_profit || 0,
          servicesCount: response.services_count || 0,
          dueAmount: response.total_due_amount || 0,
        }
      }));
      
      toast.success("Custom statistics loaded successfully");
    } catch (error) {
      toast.error("Failed to load custom statistics");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8 px-8 max-w-[1400px] mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Overview of your business performance</p>
        </div>

        {/* Today's Stats */}
        <div className="mb-8">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Today</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <StatCard
              title="Profit"
              value={`${stats.today.profit.toFixed(2)} AED`}
              icon={<TrendingUp className="w-6 h-6" />}
              iconBg="bg-green-100"
              iconColor="text-green-600"
              trend={stats.today.profit > 0 ? "up" : undefined}
            />
            <StatCard
              title="Services"
              value={stats.today.servicesCount.toString()}
              icon={<Wrench className="w-6 h-6" />}
              iconBg="bg-gray-100"
              iconColor="text-gray-600"
            />
            <StatCard
              title="Due Amount"
              value={`${stats.today.dueAmount.toFixed(2)} AED`}
              icon={<AlertCircle className="w-6 h-6" />}
              iconBg="bg-red-100"
              iconColor="text-red-600"
              trend={stats.today.dueAmount > 0 ? "down" : undefined}
            />
          </div>
        </div>

        {/* Last 7 Days */}
        <div className="mb-8">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Last 7 Days</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <StatCard
              title="Profit"
              value={`${stats.last7Days.profit.toFixed(2)} AED`}
              icon={<DollarSign className="w-6 h-6" />}
              iconBg="bg-gray-200"
              iconColor="text-green-600"
              compact
            />
            <StatCard
              title="Services"
              value={stats.last7Days.servicesCount.toString()}
              icon={<Wrench className="w-6 h-6" />}
              iconBg="bg-gray-100"
              iconColor="text-gray-600"
              compact
            />
            <StatCard
              title="Due Amount"
              value={`${stats.last7Days.dueAmount.toFixed(2)} AED`}
              icon={<AlertCircle className="w-6 h-6" />}
              iconBg="bg-red-100"
              iconColor="text-red-600"
              compact
            />
          </div>
        </div>

        {/* Last 30 Days */}
        <div className="mb-8">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Last 30 Days</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <StatCard
              title="Profit"
              value={`${stats.last30Days.profit.toFixed(2)} AED`}
              icon={<DollarSign className="w-6 h-6" />}
              iconBg="bg-gray-200"
              iconColor="text-green-600"
              compact
            />
            <StatCard
              title="Services"
              value={stats.last30Days.servicesCount.toString()}
              icon={<Wrench className="w-6 h-6" />}
              iconBg="bg-gray-100"
              iconColor="text-gray-600"
              compact
            />
            <StatCard
              title="Due Amount"
              value={`${stats.last30Days.dueAmount.toFixed(2)} AED`}
              icon={<AlertCircle className="w-6 h-6" />}
              iconBg="bg-red-100"
              iconColor="text-red-600"
              compact
            />
          </div>
        </div>

        {/* Last 365 Days */}
        <div className="mb-8">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Last 365 Days</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <StatCard
              title="Profit"
              value={`${stats.last365Days.profit.toFixed(2)} AED`}
              icon={<DollarSign className="w-6 h-6" />}
              iconBg="bg-gray-200"
              iconColor="text-green-600"
              compact
            />
            <StatCard
              title="Services"
              value={stats.last365Days.servicesCount.toString()}
              icon={<Wrench className="w-6 h-6" />}
              iconBg="bg-gray-100"
              iconColor="text-gray-600"
              compact
            />
            <StatCard
              title="Due Amount"
              value={`${stats.last365Days.dueAmount.toFixed(2)} AED`}
              icon={<AlertCircle className="w-6 h-6" />}
              iconBg="bg-red-100"
              iconColor="text-red-600"
              compact
            />
          </div>
        </div>

        {/* Custom Date Range */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <h2 className="text-base font-semibold text-gray-900">Custom Date Range</h2>
            </div>
            <div className="flex items-center gap-3">
              <DatePicker
                open={startDateOpen}
                date={startDate}
                setOpen={setStartDateOpen}
                setDate={setStartDate}
                text="Start Date"
              />
              <DatePicker
                open={endDateOpen}
                date={endDate}
                setOpen={setEndDateOpen}
                setDate={setEndDate}
                text="End Date"
              />
              <Button 
                onClick={handleCustomStats}
                className="bg-gray-900 hover:bg-gray-800 text-white"
              >
                Generate Report
              </Button>
            </div>
          </div>

          {stats.custom.profit > 0 || stats.custom.servicesCount > 0 || stats.custom.dueAmount > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <StatCard
                title="Profit"
                value={`${stats.custom.profit.toFixed(2)} AED`}
                icon={<DollarSign className="w-6 h-6" />}
                iconBg="bg-gray-200"
                iconColor="text-green-600"
              />
              <StatCard
                title="Services"
                value={stats.custom.servicesCount.toString()}
                icon={<Wrench className="w-6 h-6" />}
                iconBg="bg-gray-100"
                iconColor="text-gray-600"
              />
              <StatCard
                title="Due Amount"
                value={`${stats.custom.dueAmount.toFixed(2)} AED`}
                icon={<AlertCircle className="w-6 h-6" />}
                iconBg="bg-red-100"
                iconColor="text-red-600"
              />
            </div>
          ) : (
            <div className="py-12 text-center">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Select a date range and click "Generate Report"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({
  title,
  value,
  icon,
  iconBg,
  iconColor,
  trend,
  compact = false,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  trend?: "up" | "down";
  compact?: boolean;
}) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${compact ? 'p-5' : 'p-6'} hover:shadow-md transition-shadow`}>
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">{title}</p>
        <p className={`${compact ? 'text-xl' : 'text-2xl'} font-bold text-gray-900 mb-1`}>{value}</p>
        {trend && (
          <div className={`inline-flex items-center gap-1 text-xs font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            <span>{trend === 'up' ? 'Positive' : 'Outstanding'}</span>
          </div>
        )}
      </div>
      <div className={`${compact ? 'w-11 h-11' : 'w-12 h-12'} rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}>
        <div className={iconColor}>{icon}</div>
      </div>
    </div>
  </div>
);

export default Dashboard;
