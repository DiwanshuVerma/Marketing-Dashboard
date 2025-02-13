import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, Bar, BarChart, CartesianGrid } from "recharts";
import { FaChartLine } from "react-icons/fa";
import { MdOutlineNavigateNext } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useOffers } from "../../context/OffersContext";

import {BannerClickAnalytics} from './BannerClickAnalytics'

export default function DashboardAnalytics() {
    const navigate = useNavigate();
    const [ordersTimeframe, setOrdersTimeframe] = useState("Today");
    const [ordersData, setOrdersData] = useState([]);


    const { offers } = useOffers()

    const generateClicksData = (timeframe) => {
        const dataMap = {
            daily: Array.from({ length: 7 }, (_, i) => ({
                date: `Day ${i + 1}`,
                clicks: Math.floor(Math.random() * 500) + 100
            })),
            weekly: Array.from({ length: 4 }, (_, i) => ({
                week: `Week ${i + 1}`,
                clicks: Math.floor(Math.random() * 3000) + 500
            })),
            monthly: Array.from({ length: 12 }, (_, i) => ({
                month: `Month ${i + 1}`,
                clicks: Math.floor(Math.random() * 10000) + 2000
            }))
        };
        return dataMap[timeframe];
    };

    const generateOrdersData = (timeframe) => {
        const categories = ["Starters", "Main Course", "Combos", "Desserts"];
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

    // Independent effects for each chart
    // useEffect(() => {
    //     setClicksData(generateClicksData(bannerTimeframe));
    // }, [bannerTimeframe]);

    useEffect(() => {
        setOrdersData(generateOrdersData(ordersTimeframe));
    }, [ordersTimeframe]);

    const timeTabs = ["daily", "weekly", "monthly"];
    const ordersTimeTabs = ["Today", "This Week", "This Month"];

    
    return (
        <div className="flex flex-col gap-4 w-full mt-12">
            {/* Top Row */}
            <div className="md:flex-row flex flex-col gap-8 items-center w-full">
                {/* Banner Clicks Chart */}
                <BannerClickAnalytics />

                {/* Orders Analytics */}
                <div className="w-full md:w-1/2 bg-white rounded-md shadow-md space-y-4 p-4">
                    <ChartHeader
                        title="Orders Analytics"
                        description="Orders Overview during Active Offers"
                        navigateTo="/restaurant-offers"
                    />

                    <div className="flex justify-between items-center">
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

                        {/* offers dropdown */}
                        <div className="flex gap-2 items-center">
                            <label htmlFor="offer" className="text-base font-bold text-gray-700">Offer:</label>
                            <select name="" id="offer" className="p-1 rounded">
                                <option value="All">All</option>
                                {offers.map((offer, offerIndex) => (
                                    <option key={offerIndex} value={offer.name}>{offer.name}</option>
                                ))}
                            </select>
                        </div>
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
        </div >
    );
}

// Reusable components
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