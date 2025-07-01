import { useEffect, useState } from "react";
import PageHeader from "../../../components/PageHeader";
import CardV2 from "./components/CardV2";
import { toast } from "sonner";

const Dashboard = () => {
  const [profit, setProfit] = useState(0);
  const [last7Daysprofit, setLast7Daysprofit] = useState(0);
  const [dailyServicesCount, setDailyServicesCount] = useState(0);
  const [last7DaysServicesCount, setLast7DaysServicesCount] = useState(0);
  const [dueAmount, setDueAmount] = useState(0);
  const [last7DaysDueAmount, setLast7DaysdueAmount] = useState(0);
  useEffect(() => {
    Promise.allSettled([
      fetchDailyProfit(),
      fetchDailyServicesCount(),
      fetchDailyDueAmount(),
      fetchLast7DaysProfit(),
      fetchLast7DaysServicesCount(),
      fetchLast7DaysDueAmount(),
    ]);
  }, []);

  const fetchDailyProfit = async () => {
    try {
      //@ts-ignore
      const { response } = await window.electron.getDailyProfit();
      setProfit(response.total_profit);
    } catch (error) {
      toast.error("Something went wrong. Please restart the application", {
        position: "top-center",
      });
    }
  };
  const fetchLast7DaysProfit = async () => {
    try {
      //@ts-ignore
      const { response } = await window.electron.last7DaysProfit();
      setLast7Daysprofit(response.total_profit);
    } catch (error) {
      toast.error("Something went wrong. Please restart the application", {
        position: "top-center",
      });
    }
  };

  const fetchDailyServicesCount = async () => {
    try {
      //@ts-ignore
      const { totalServicesCount } = await window.electron.getDailyServicesCount();
      setDailyServicesCount(totalServicesCount.services_count);
    } catch (error) {
      toast.error("Something went wrong. Please restart the application", {
        position: "top-center",
      });
    }
  };
  const fetchLast7DaysServicesCount = async () => {
    try {
      //@ts-ignore
      const { totalServicesCount } = await window.electron.last7DaysServicesCount();
      setLast7DaysServicesCount(totalServicesCount.services_count);
    } catch (error) {
      toast.error("Something went wrong. Please restart the application", {
        position: "top-center",
      });
    }
  };
  const fetchDailyDueAmount = async () => {
    try {
      //@ts-ignore
      const { totalDueAmount } = await window.electron.getDailyDueAmount();
      setDueAmount(totalDueAmount);
      // setDueAmount(totalServicesCount.services_count);
    } catch (error) {
      toast.error("Something went wrong. Please restart the application", {
        position: "top-center",
      });
    }
  };

  const fetchLast7DaysDueAmount = async () => {
    try {
      //@ts-ignore
      const { totalDueAmount } = await window.electron.getLast7DaysDueAmount();
      setLast7DaysdueAmount(totalDueAmount);
      // setDueAmount(totalServicesCount.services_count);
    } catch (error) {
      toast.error("Something went wrong. Please restart the application", {
        position: "top-center",
      });
    }
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-16 px-8">
        <PageHeader title="Dashboard" />
        <div className="grid grid-cols-3 gap-4">
          <CardV2 cardDescription="Today profit" cardTitle={`AED ${profit ? profit : 0}`} />
          <CardV2 cardDescription="Today services" cardTitle={`${dailyServicesCount}`} />
          <CardV2
            cardDescription="Today due amount"
            cardTitle={`AED ${dueAmount ? dueAmount : 0}`}
          />
        </div>
        <p className="mt-4 mb-2 font-semibold">Last 7 days</p>
        <div className="grid grid-cols-3 gap-4">
          <CardV2
            cardDescription="Last 7 days profit"
            cardTitle={`AED ${last7Daysprofit ? last7Daysprofit : 0}`}
          />
          <CardV2 cardDescription="Last 7 days services" cardTitle={`${last7DaysServicesCount}`} />
          <CardV2
            cardDescription="Last 7 days due amount"
            cardTitle={`AED ${last7DaysDueAmount ? last7DaysDueAmount : 0}`}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
