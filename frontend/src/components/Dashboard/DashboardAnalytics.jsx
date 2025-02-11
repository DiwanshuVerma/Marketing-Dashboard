import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, Bar, BarChart, CartesianGrid } from "recharts";
import { FaChartLine } from "react-icons/fa";
import { MdOutlineNavigateNext } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { HiOutlineInformationCircle } from "react-icons/hi";

export default function DashboardAnalytics() {
    const navigate = useNavigate();
    const [bannerTimeframe, setBannerTimeframe] = useState("daily");
    const [ordersTimeframe, setOrdersTimeframe] = useState("Today");
    const [redemptionTimeframe, setRedemptionTimeframe] = useState("daily");
    
    // Dummy data states
    const [clicksData, setClicksData] = useState([]);
    const [ordersData, setOrdersData] = useState([]);
    const [redemptionData, setRedemptionData] = useState([]);

    // Generate dummy data functions
    const generateClicksData = (timeframe) => {
        const dataMap = {
            daily: Array.from({length: 7}, (_, i) => ({ 
                date: `Day ${i+1}`, 
                clicks: Math.floor(Math.random() * 500) + 100 
            })),
            weekly: Array.from({length: 4}, (_, i) => ({ 
                week: `Week ${i+1}`, 
                clicks: Math.floor(Math.random() * 3000) + 500 
            })),
            monthly: Array.from({length: 12}, (_, i) => ({ 
                month: `Month ${i+1}`, 
                clicks: Math.floor(Math.random() * 10000) + 2000 
            }))
        };
        return dataMap[timeframe];
    };

    const generateOrdersData = (timeframe) => {
        const categories = ["Food", "Beverages", "Combos", "Desserts"];
        const multiplier = {
            "Today": 1,
            "This Week": 7,
            "This Month": 30
        }[timeframe];
        
        return categories.map(category => ({
            category,
            count: Math.floor(Math.random() * 500 * multiplier) + 100
        }));
    };

    const generateRedemptionData = (timeframe) => {
        const items = timeframe === "daily" ? 7 : timeframe === "weekly" ? 4 : 12;
        return Array.from({length: items}, (_, i) => ({
            label: timeframe === "daily" ? `Day ${i+1}` : 
                   timeframe === "weekly" ? `Week ${i+1}` : `Month ${i+1}`,
            offersSent: Math.floor(Math.random() * 1000) + 500,
            redeemed: Math.floor(Math.random() * 500) + 200
        }));
    };

    // Independent effects for each chart
    useEffect(() => {
        setClicksData(generateClicksData(bannerTimeframe));
    }, [bannerTimeframe]);

    useEffect(() => {
        setOrdersData(generateOrdersData(ordersTimeframe));
    }, [ordersTimeframe]);

    useEffect(() => {
        setRedemptionData(generateRedemptionData(redemptionTimeframe));
    }, [redemptionTimeframe]);

    const timeTabs = ["daily", "weekly", "monthly"];
    const ordersTimeTabs = ["Today", "This Week", "This Month"];
    const axisKey = { daily: "date", weekly: "week", monthly: "month" };

    return (
        <div className="flex flex-col gap-4 w-full mt-12">
            {/* Top Row */}
            <div className="md:flex-row flex flex-col gap-8 items-center w-full">
                {/* Banner Clicks Chart */}
                <div className="p-4 bg-white rounded shadow space-y-4 md:w-1/2 w-full">
                    <ChartHeader 
                        title="Banner Click Analytics"
                        description="View banner trends for different time periods"
                        navigateTo="/campaign-management"
                    />
                    <TimeTabs 
                        tabs={timeTabs} 
                        activeTab={bannerTimeframe} 
                        setActiveTab={setBannerTimeframe} 
                    />
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={clicksData}>
                            <XAxis dataKey={axisKey[bannerTimeframe]} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="clicks" stroke="#4287f5" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Orders Analytics */}
                <div className="w-full md:w-1/2 bg-white rounded-md shadow-md space-y-4 p-4">
                    <ChartHeader 
                        title="Orders Analytics"
                        description="Orders Overview during Active Offers"
                        navigateTo="/restaurant-offers"
                    />
                    <div className="flex gap-2">
                        {ordersTimeTabs.map((tab) => (
                            <TabButton
                                key={tab}
                                label={tab}
                                isActive={ordersTimeframe === tab}
                                onClick={() => setOrdersTimeframe(tab)}
                            />
                        ))}
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={ordersData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="category" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#009999" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bottom Row - Offer Redemption */}
            <div className="w-full bg-white rounded-md shadow-md space-y-4 p-4">
                <ChartHeader 
                    title="Offer Redemption Rate"
                    description="Offers sent vs redeemed comparison"
                    navigateTo="/restaurant-offers"
                />
                <TimeTabs 
                    tabs={timeTabs} 
                    activeTab={redemptionTimeframe} 
                    setActiveTab={setRedemptionTimeframe} 
                />
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={redemptionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="label" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="offersSent" fill="#8884d8" />
                        <Bar dataKey="redeemed" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

// Reusable components remain the same
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
        className={`px-4 py-2 text-sm font-medium rounded ${
            isActive ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"
        }`}
        onClick={onClick}
    >
        {label}
    </button>
);