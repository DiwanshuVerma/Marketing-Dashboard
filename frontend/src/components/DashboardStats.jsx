import { useState, useEffect } from "react";
import axios from "axios";

const DashboardStats = () => {
  const [data, setData] = useState(null);
  const [aov, setAOV] = useState(null);
  const [totalUsers, settotalUsers] = useState(null);
  const [viewTypes, setViewTypes] = useState({
    orders: "today",
    revenue: "today",
    users: "today",
    aov: "today",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const summaryRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/order-summary`);
        const aovRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/average-order-value`);
        const totalUsersRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user-summary`);

        setData(summaryRes.data);
        setAOV(aovRes.data);
        settotalUsers(totalUsersRes.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchData();
  }, []);

  if (!data || !aov || !totalUsers) return <p className="flex justify-center items-center text-xl">Loading...</p>;

  // Function to cycle viewType for a specific stat
  const toggleView = (key) => {
    setViewTypes((prev) => ({
      ...prev,
      [key]: prev[key] === "today" ? "thisWeek" : prev[key] === "thisWeek" ? "thisMonth" : prev[key] === "thisMonth" ? "allTime" : "today",
    }));
  };


  // Stats data with independent toggles
  const statsData = [
    {
      key: "orders",
      text: "text-sm",
      label: `Orders (${viewTypes.orders})`,
      value: data[viewTypes.orders].orders,
      bg: "bg-pink-600",
    },
    {
      key: "revenue",
      text: "text-sm",
      label: `Revenue (${viewTypes.revenue})`,
      value: `₹ ${data[viewTypes.revenue].revenue}`,
      bg: "bg-blue-600",
    },
    {
      key: "users",
      text: "text-sm",
      label: "Total Users",
      value: `${totalUsers.totalUsers}`, // Replace with real data if available
      bg: "bg-green-600",
    },
    {
      key: "aov",
      text: "text-xs",
      label: `Average Order Value (${viewTypes.aov})`,
      value: `₹ ${aov[`${viewTypes.aov}AOV`]}`,
      bg: "bg-yellow-600",
    },

  ];

  return (
    // <div className="flex items-center gap-2 w-full">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
      {statsData.map((stat) => (
        <div
          key={stat.key}
          className={`flex items-center justify-between p-3 rounded shadow text-white ${stat.bg}`}
        >
          <div className="flex flex-col">
            <span className={`${stat.text} font-medium opacity-90`}>{stat.label}</span>
            <span className="text-xl font-bold mt-1">{stat.value}</span>
          </div>
          {/* Clickable Icon to toggle view for this specific stat */}
          <svg
            onClick={() => toggleView(stat.key)}
            className="w-8 h-8 opacity-75 cursor-pointer"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5l-7 7 7 7M5 12h14" />
          </svg>
        </div>
      ))}
    </div>
    // </div>
  );
};

export default DashboardStats;
