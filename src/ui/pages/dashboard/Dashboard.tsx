import { useEffect, useState } from "react";
import PageHeader from "../../../components/PageHeader";
import CardV2 from "./components/CardV2";

const Dashboard = () => {
  const [profit, setProfit] = useState(0);
  const [dailyServicesCount, setDailyServicesCount] = useState(0);
  const [dueAmount, setDueAmount] = useState(0);
  useEffect(() => {
    Promise.allSettled([fetchDailyProfit(), fetchDailyServicesCount(),fetchDailyDueAmount()]);
  }, []);

  const fetchDailyProfit = async () => {
    try {
      //@ts-ignore
      const { response } = await window.electron.getDailyProfit();
      setProfit(response.total_profit);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDailyServicesCount = async () => {
    try {
      //@ts-ignore
      const { totalServicesCount } = await window.electron.getDailyServicesCount();
      console.log(totalServicesCount);
      setDailyServicesCount(totalServicesCount.services_count);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchDailyDueAmount = async () => {
    try {
      //@ts-ignore
      const {totalDueAmount} = await window.electron.getDailyDueAmount();
      console.log(totalDueAmount)
      setDueAmount(totalDueAmount);
      // setDueAmount(totalServicesCount.services_count);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-16 px-8">
        <PageHeader title="Dashboard" />
        <div className="grid grid-cols-3 gap-4">
          <CardV2 cardDescription="Today profit" cardTitle={`AED ${profit ? profit : 0}`} />
          <CardV2 cardDescription="Today services" cardTitle={`${dailyServicesCount}`} />
          <CardV2 cardDescription="Today due amount" cardTitle={`AED ${dueAmount ? dueAmount : 0}`} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
