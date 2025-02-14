import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useBanners } from "../../context/BannersContext";
import { FaChartLine } from "react-icons/fa";
import { MdOutlineNavigateNext } from "react-icons/md";
import {useNavigate} from 'react-router-dom'

const BannerClicksList = ({ banners, timeframe }) => {
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border w-full">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Detailed Banner Performance</h3>
        
        {/* Header Row */}
        <div className="grid grid-cols-5 gap-4 mb-2 px-2 py-1 bg-gray-100 rounded">
          <div className="col-span-2 text-sm font-medium text-gray-600">Banner Name</div>
          <div className="text-center text-sm font-medium text-gray-600">Today</div>
          <div className="text-center text-sm font-medium text-gray-600">This Week</div>
          <div className="text-center text-sm font-medium text-gray-600">Total</div>
        </div>
  
        {/* Banner List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="grid grid-cols-5 gap-4 items-center p-2 bg-white rounded border hover:bg-gray-50 transition-colors"
            >
              {/* Banner Title with Ellipsis */}
              <div className="col-span-2 truncate text-sm font-medium text-gray-700">
                {banner.title}
              </div>
              
              {/* Timeframe Columns */}
              <div className="text-center text-sm text-gray-600">
                {banner.dailyClicks}
              </div>
              <div className="text-center text-sm text-gray-600">
                {banner.weeklyClicks}
              </div>
              <div className="text-center text-sm font-semibold text-blue-600">
                {banner.totalClicks}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };


export const BannerClickAnalytics = () => {
    const [bannersTimeframe, setBannersTimeframe] = useState("Today");
    const [clicksData, setClicksData] = useState([]);
    const { banners } = useBanners();
    const [showDetails, setShowDetails] = useState(false);

    const navigate = useNavigate()
    const timeTabs = ["Today", "This Week", "This Month"];

    useEffect(() => {
        const fetchData = () => {
            const data = banners.map(banner => ({
                name: banner.title,
                clicks: banner.clicks
            }));
            setClicksData(data);
        };

        fetchData();
    }, [bannersTimeframe, banners]);

    const handleBannerFilter = (e) => {
        const selectedBanner = e.target.value;
        if (selectedBanner === "All") {
            // Show all banners when "All" is selected
            const data = banners.map(banner => ({
                name: banner.title,
                clicks: banner.clicks
            }));
            setClicksData(data);
        } else {
            // Filter for specific banner
            const foundBanner = banners.find(banner => banner.title === selectedBanner);
            if (foundBanner) {
                setClicksData([{
                    name: foundBanner.title,
                    clicks: foundBanner.clicks
                }]);
            }
        }
    };

    return (
        <div className="flex flex-col md:w-1/2 w-full h-screen">
            <div className="bg-white rounded shadow space-y-4 p-4">
                <ChartHeader
                    title="Banner Click Analytics"
                    description="View banner clicks for different time periods"
                    onNavigateNext={() => setShowDetails(!showDetails)}
                />

                <div className="flex justify-between items-center flex-wrap gap-2">
                    <TimeTabs
                        tabs={timeTabs}
                        activeTab={bannersTimeframe}
                        setActiveTab={setBannersTimeframe}
                    />
                </div>

                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={clicksData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        {/* X-axis now shows banner clicks (angled -45) */}
                        <XAxis
                            dataKey="clicks"
                            type="category"
                            tick={{ fontSize: 15 }}
                        />
                        <YAxis />
                        {/* Use custom tooltip to show banner name and clicks */}
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar
                            dataKey="clicks"
                            fill="#009999"
                            name="Total Clicks"
                            maxBarSize={50}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-12 h-full w-[78vw] mb-6">
                {showDetails && <BannerClicksList banners={banners} timeframe={bannersTimeframe} />}
            </div>
        </div>
    );
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        // Access the full data object from payload
        const { name, clicks } = payload[0].payload;
        return (
            <div className="p-2 bg-white border border-gray-300">
                <p className="font-semibold mb-1">{name}</p>
                <p className="text-sky-600">Clicks: {clicks}</p>
            </div>
        );
    }
    return null;
};

const ChartHeader = ({ title, description, onNavigateNext }) => (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h1 className="text-lg font-bold text-gray-700 flex items-center gap-2">
          <FaChartLine className="text-blue-500" />
          {title}
        </h1>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <MdOutlineNavigateNext
        className="text-blue-600 cursor-pointer transform transition-transform hover:scale-110"
        onClick={onNavigateNext}
        size={24}
      />
    </div>
)


const TimeTabs = ({ tabs, activeTab, setActiveTab }) => (
    <div className="flex gap-2">
        {tabs.map((tab) => (
            <TabButton
                key={tab}
                label={tab.charAt(0).toUpperCase() + tab.slice(1)}
                isActive={activeTab === tab}
                onClick={() => setActiveTab(tab)}
            />
        ))}
    </div>
);

const TabButton = ({ label, isActive, onClick }) => (
    <button
        className={`px-2 py-1 text-sm font-normal rounded ${isActive ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"
            }`}
        onClick={onClick}
    >
        {label}
    </button>
);