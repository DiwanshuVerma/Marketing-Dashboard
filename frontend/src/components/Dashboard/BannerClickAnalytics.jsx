import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useBanners } from "../../context/BannersContext";
import { FaChartLine } from "react-icons/fa";
import { MdOutlineNavigateNext } from "react-icons/md";

export const BannerClickAnalytics = () => {
    const [bannersTimeframe, setBannersTimeframe] = useState("Today");
    const [clicksData, setClicksData] = useState([]);
    const { banners } = useBanners();

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
        <div className="p-4 bg-white rounded shadow space-y-4 md:w-1/2 w-full">
            <ChartHeader
                title="Banner Click Analytics"
                description="View banner clicks for different time periods"
                navigateTo="/campaign-management"
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

const ChartHeader = ({ title, description, navigateTo }) => (
    <div className="flex items-center justify-between mb-4">
        <div>
            <h1 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                <FaChartLine className="text-blue-500" />
                {title}
            </h1>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
        <MdOutlineNavigateNext
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate(navigateTo)}
            size={24}
        />
    </div>
);

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